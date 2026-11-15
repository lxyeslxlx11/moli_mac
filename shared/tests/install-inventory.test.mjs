import test from 'node:test';
import assert from 'node:assert/strict';
import { INVENTORY_LIMITS, InventoryError, LauncherError, parseGameCatalog, createOfflineLaunchPlan, verifyInstallInventory } from '../index.mjs';

const A = 'ab'.repeat(32); const B = 'cd'.repeat(32);
function plan(extra = '') {
  const catalog = parseGameCatalog(`<Gamelist><Games><Game Code="11"><Name>Synthetic</Name><EXE>client.exe</EXE><Argsline> opaque </Argsline>${extra}</Game></Games></Gamelist>`);
  return createOfflineLaunchPlan(catalog,0,{iniText:'[Path]\nGame11=C:\\Synthetic\\Demo'});
}
const row = (relativePath='client.exe', byteLength=10, sha256=A) => ({relativePath,byteLength,kind:'file',...(sha256===undefined?{}:{sha256})});
const inventory = (files=[row()],rootPath='C:\\Synthetic\\Demo') => ({rootPath,files});
const expect = (fn,code) => assert.throws(fn,e=>e instanceof InventoryError && e.code===code);

test('inventory validates only caller-declared presence and metadata expectations', () => {
  const result = verifyInstallInventory(plan(),inventory(),{expected:[{relativePath:'client.exe',byteLength:10,sha256:A.toUpperCase()}]});
  assert.equal(result.scope,'explicit-snapshot-and-expectations-only');
  assert.equal(result.knownRequirementsSatisfied,true); assert.equal(result.snapshotConsistent,true);
  assert.deepEqual(result.summary,{present:1,missing:0,ambiguous:0,mismatch:0,unverified:0});
  assert.deepEqual(result.requirements[0].checks,{byteLength:'match',sha256:'match'});
  assert.equal(Object.hasOwn(result,'readyToPlay'),false);
  assert.equal(Object.hasOwn(result,'officiallyCompatible'),false);
});

test('inventory reports configured missing files and does not invent cwd/default files', () => {
  const value = plan('<PatchEXE>patch.exe</PatchEXE><ConfigEXE>tools/config.exe</ConfigEXE><SpeFile>data/map.bin</SpeFile>');
  const result = verifyInstallInventory(value,inventory([row()]));
  assert.equal(result.knownRequirementsSatisfied,false); assert.equal(result.summary.missing,3);
  assert.deepEqual(result.requirements.filter(v=>v.status==='missing').map(v=>v.relativePath),['patch.exe','tools\\config.exe','data\\map.bin']);
});

test('inventory combines roles that refer to one configured file', () => {
  const result = verifyInstallInventory(plan('<ConfigEXE>CLIENT.EXE</ConfigEXE>'),inventory());
  assert.equal(result.requirements.length,1);
  assert.deepEqual(result.requirements[0].roles,['client','configuration']);
});

test('inventory uses explicit ASCII-case/NFC collision policy and normalizes separators', () => {
  const result = verifyInstallInventory(plan(),inventory([row('CLIENT.EXE')],'c:/synthetic/demo/'));
  assert.equal(result.knownRequirementsSatisfied,true); assert.equal(result.casePolicy,'ASCII-fold-and-NFC');
  const conflict = verifyInstallInventory(plan(),inventory([row(),row('CLIENT.EXE')]));
  assert.equal(conflict.summary.ambiguous,1); assert.equal(conflict.snapshotConsistent,false);
  assert.equal(conflict.knownRequirementsSatisfied,false);
  assert.deepEqual(conflict.ambiguities[0].paths,['client.exe','CLIENT.EXE']);
});

test('inventory does not silently ignore unrelated duplicate or normalized alias entries', () => {
  for (const extra of [[row('other.bin'),row('other.bin')],[row('caf\u00e9.bin'),row('cafe\u0301.bin')]]) {
    const result = verifyInstallInventory(plan(),inventory([row(),...extra]));
    assert.equal(result.summary.present,1); assert.equal(result.snapshotConsistent,false); assert.equal(result.knownRequirementsSatisfied,false);
  }
});

test('inventory binds the supplied directory to the selected plan and rejects forged absolute paths', () => {
  expect(()=>verifyInstallInventory(plan(),inventory([row()],'D:\\Other')), 'ROOT_MISMATCH');
  const value=plan();
  const forged={...value,files:{...value.files,client:{relativePath:'client.exe',windowsPath:'C:\\Other\\client.exe'}}};
  expect(()=>verifyInstallInventory(forged,inventory()),'PLAN_PATH_MISMATCH');
});

test('inventory compares sizes and SHA256 independently and reports missing requested digest', () => {
  const expected=[{relativePath:'client.exe',byteLength:11,sha256:B}];
  const mismatch=verifyInstallInventory(plan(),inventory(),{expected});
  assert.equal(mismatch.summary.mismatch,1); assert.deepEqual(mismatch.requirements[0].checks,{byteLength:'mismatch',sha256:'mismatch'});
  const missingHash=verifyInstallInventory(plan(),inventory([{relativePath:'client.exe',byteLength:10,kind:'file'}]),{expected:[{relativePath:'client.exe',sha256:A}]});
  // Omitted hash is distinct from a known incorrect hash; no hashing is performed by the core.
  assert.equal(missingHash.summary.unverified,1); assert.equal(missingHash.knownRequirementsSatisfied,false);
});

test('inventory presence without expected hashes is not labeled content verification', () => {
  const result=verifyInstallInventory(plan(),inventory([{relativePath:'client.exe',byteLength:0,kind:'file'}]));
  assert.equal(result.knownRequirementsSatisfied,true);
  assert.deepEqual(result.requirements[0].checks,{byteLength:'not-requested',sha256:'not-requested'});
  const empty=verifyInstallInventory(plan(),inventory([]));assert.equal(empty.summary.missing,1);
});

test('explicit additional resource expectations become requirements without scanning', () => {
  const result=verifyInstallInventory(plan(),inventory(),{expected:[{relativePath:'map/1000.dat',byteLength:22}]});
  assert.equal(result.summary.missing,1);
  assert.deepEqual(result.requirements[1].roles,[]);
  assert.equal(result.requirements[1].relativePath,'map\\1000.dat');
});

test('duplicate expectation aliases and empty or invalid expectations are rejected', () => {
  expect(()=>verifyInstallInventory(plan(),inventory(),{expected:[{relativePath:'client.exe',byteLength:10},{relativePath:'CLIENT.EXE',sha256:A}]}),'DUPLICATE_EXPECTATION');
  expect(()=>verifyInstallInventory(plan(),inventory(),{expected:[{relativePath:'client.exe'}]}),'EMPTY_EXPECTATION');
  for(const expected of [null,{},Array(INVENTORY_LIMITS.expectations+1)]) expect(()=>verifyInstallInventory(plan(),inventory(),{expected}),'EXPECTATION_BUDGET');
});

test('unsafe, remote, device, ADS and traversal inventory paths are refused', () => {
  for(const path of ['../outside','a\\..\\outside','C:\\outside','/absolute','\\\\server\\share','https://example.invalid/file','a:stream','NUL.dat','a//b','a./b']) {
    expect(()=>verifyInstallInventory(plan(),inventory([row(path)])),'UNSAFE_PATH');
    expect(()=>verifyInstallInventory(plan(),inventory(),{expected:[{relativePath:path,byteLength:1}]}),'UNSAFE_PATH');
  }
  for(const root of ['relative','C:relative','\\\\server\\share','/posix']) expect(()=>verifyInstallInventory(plan(),inventory([row()],root)),'UNSUPPORTED_DIRECTORY');
});

test('inventory cannot follow metadata declared as a link, directory or unsupported kind', () => {
  for(const kind of ['symlink','directory','junction',undefined]) expect(()=>verifyInstallInventory(plan(),inventory([{...row(),kind}])),'UNSUPPORTED_ENTRY_KIND');
});

test('invalid size and digest metadata fail before a successful result', () => {
  for(const byteLength of [-1,NaN,Infinity,0.5,Number.MAX_SAFE_INTEGER+1,'10']) {
    expect(()=>verifyInstallInventory(plan(),inventory([{...row(),byteLength}])),'INVALID_SIZE');
    expect(()=>verifyInstallInventory(plan(),inventory(),{expected:[{relativePath:'client.exe',byteLength}]}),'INVALID_SIZE');
  }
  for(const sha256 of ['',A.slice(1),'not-a-hash',42]) expect(()=>verifyInstallInventory(plan(),inventory([{...row(),sha256}])),'INVALID_DIGEST');
});

test('fixed entry, field and total metadata budgets cannot be raised', () => {
  expect(()=>verifyInstallInventory(plan(),inventory(Array(INVENTORY_LIMITS.files+1))),'INVENTORY_BUDGET');
  expect(()=>verifyInstallInventory(plan(),inventory([row('x'.repeat(4097))])),'FIELD_BUDGET');
  const long='x'.repeat(4090);const files=Array.from({length:1100},(_,i)=>row(`${i}\\${long}`,1));
  expect(()=>verifyInstallInventory(plan(),inventory(files),{metadataCharacters:Number.MAX_SAFE_INTEGER}),'METADATA_BUDGET');
});

test('inventory results are frozen and do not retain mutable caller entries or expectations', () => {
  const source=row(); const expected={relativePath:'client.exe',byteLength:10,sha256:A};
  const result=verifyInstallInventory(plan(),inventory([source]),{expected:[expected]});
  source.byteLength=99;expected.byteLength=99;
  assert.equal(result.requirements[0].actual.byteLength,10); assert.equal(result.requirements[0].expected.byteLength,10);
  for(const item of [result,result.summary,result.requirements,result.requirements[0],result.requirements[0].actual,result.requirements[0].roles]) assert.equal(Object.isFrozen(item),true);
});

test('inventory rejects malformed plans, absent own roles, input collections and options', () => {
  for(const value of [null,{}, {directory:{},files:{}}]) expect(()=>verifyInstallInventory(value,inventory()),'INVALID_PLAN');
  const base=plan(); const files={...base.files};delete files.configuration;
  expect(()=>verifyInstallInventory({...base,files},inventory()),'INVALID_PLAN');
  expect(()=>verifyInstallInventory({...base,files:{...base.files,unknown:null}},inventory()),'INVALID_PLAN');
  for(const value of [null,{}, {rootPath:'C:\\Synthetic\\Demo',files:{}}]) expect(()=>verifyInstallInventory(base,value),'INVALID_INPUT');
  expect(()=>verifyInstallInventory(base,inventory(),null),'INVALID_INPUT');
});

test('shared planner now applies the common total joined-path budget', () => {
  const value=parseGameCatalog('<Gamelist><Games><Game Code="1"><Name>Long</Name><EXE>'+ 'f'.repeat(50)+'.exe</EXE></Game></Games></Gamelist>');
  assert.throws(()=>createOfflineLaunchPlan(value,0,{iniText:'[Path]\nGame1=C:\\'+'d'.repeat(4060)}),e=>e instanceof LauncherError && e.code==='FIELD_BUDGET');
});
