import test from 'node:test';
import assert from 'node:assert/strict';
import { snapshotLauncherDirectory, createLauncherCatalogProcessInput, createLauncherCatalogFirstConfigPlan } from '../launcher-launch-data.mjs';
import { makeSyntheticSessionLauncher } from '../launcher-fixture.mjs';
import { createLauncherProcessPlan, computeLauncherFileMd5, LAUNCHER_RESOURCE_GROUPS } from '../../shared/index.mjs';
const raw = value => new TextEncoder().encode(value), text = value => Buffer.from(value).toString('utf8').replace(/\0$/, '');
const names = ['Original/Bin/Anime_2.bin', 'Original/Bin/GraphicInfo_9.bin', 'Original/Bin/Puk2/Anime_3.bin',
  'Original/Bin/Puk3/Graphic_4.bin', 'Original/Bin/Coordinate_7.bin', 'Original/readme.txt'];
const snapshot = (paths = names) => snapshotLauncherDirectory(paths.map(relativePath => ({ relativePath })));
function input() {
  const fixture = makeSyntheticSessionLauncher([{ address: '127.0.0.1', port: 12345 }]);
  const gameListBytes = raw(fixture.games), regionListBytes = raw(fixture.regions);
  return { catalogs: { gameListBytes, regionListBytes, gameListMd5: computeLauncherFileMd5(gameListBytes),
    regionListMd5: computeLauncherFileMd5(regionListBytes), encoding: 'utf-8', allowBareAmpersands: false },
    gameOrdinal: 0, referenceOrdinal: 0, directoryText: 'C:\\Original', pathEncoding: 'ascii', resourceGroups: snapshot().resourceGroups };
}
test('ordered directory metadata classifies all seven original group positions and reads no file content', () => {
  const result = snapshot(); assert.equal(result.filesSeen, 6); assert.equal(result.matchedFiles, 5); assert.equal(result.ignoredFiles, 1);
  assert.deepEqual(result.resourceGroups.map(group => group.entries.length), [1, 1, 1, 0, 0, 1, 1]);
  assert.deepEqual(result.resourceGroups.map(group => group.id), LAUNCHER_RESOURCE_GROUPS.map(group => group.id));
  assert.equal(result.assetContent, 'not-read'); assert.equal(result.nativeEnumeration, 'unverified');
  const fields = input(), process = createLauncherProcessPlan(createLauncherCatalogProcessInput(fields));
  assert.equal(text(process.commandLineBytes), 'C:\\Original\\original-demo.exe   original-local  animebin:2 graphicinfobin:9 animebin:3 graphicbin:4 coordinatebin:7');
});
test('provided order is retained within each group while matching uses explicit ASCII case folding', () => {
  const result = snapshot(['Root/bIN/aNIME_Z.BIN', 'Root/Bin/ANIME_A.bin', 'Root/BIN/PuK2/GrApHiC_X.BiN', 'Root/Bin/Puk3/Anime_Last.bin']);
  assert.deepEqual(result.resourceGroups[0].entries.map(row => text(row.fileNameBytes)), ['aNIME_Z.BIN', 'ANIME_A.bin']);
  assert.equal(result.resourceGroups[3].entries.length, 1); assert.equal(result.resourceGroups[4].entries.length, 1);
});
test('duplicate case aliases, traversal, mixed roots, malformed paths and data accessors are rejected', () => {
  for (const paths of [[], ['Root/Bin/a.bin','Root/bin/A.BIN'], ['Root/../Anime.bin'], ['Root//Anime.bin'], ['A/a','B/b'],
    ['Root/Bin\\Anime.bin'], ['Root/Bin/A\0.bin'], ['Root/Bin/Anime_测.bin']]) assert.throws(() => snapshot(paths), { code: 'LAUNCH_DATA' });
  let touched = false;
  assert.throws(() => snapshotLauncherDirectory([{ get relativePath() { touched = true; return names[0]; } }]), { code: 'LAUNCH_DATA' });
  assert.equal(touched, false);
});
test('unrelated deep files and excluded coordinate subdirectories cannot become resource arguments', () => {
  const result = snapshot(['Root/readme.txt','Root/Bin/Sub/Anime_9.bin','Root/Bin/Puk2/Coordinate_3.bin','Root/Bin/Puk3/Other.bin']);
  assert.equal(result.matchedFiles, 0); assert.equal(result.resourceGroups.every(group => group.entries.length === 0), true);
});
test('metadata count and group budgets reject before unbounded accumulation', () => {
  assert.throws(() => snapshotLauncherDirectory(Array(32769)), { code: 'LAUNCH_DATA' });
  assert.throws(() => snapshot(Array.from({ length: 4097 }, (_, i) => 'Root/Bin/Anime_' + i + '.bin')), { code: 'LAUNCH_DATA' });
  assert.throws(() => snapshotLauncherDirectory([new Proxy({}, { getOwnPropertyDescriptor() { throw new Error('Private'); } })]), { code: 'LAUNCH_DATA' });
});
test('configuration ordinal binding distinguishes two Code11 clients and preserves source region whitespace', () => {
  const fields = input(), first = createLauncherProcessPlan(createLauncherCatalogProcessInput(fields));
  const second = createLauncherProcessPlan(createLauncherCatalogProcessInput({ ...fields, gameOrdinal: 1 }));
  assert.match(text(first.commandLineBytes), /^C:\\Original\\original-demo.exe /);
  assert.match(text(second.commandLineBytes), /^C:\\Original\\original-other.exe /);
  assert.equal(first.gameCode, 11); assert.equal(second.gameCode, 11); assert.match(text(second.commandLineBytes), /  original-local  /);
});
test('explicit path profile is independent from UTF8 catalog metadata and rejects lossy or absent choices', () => {
  const fields = input(); fields.directoryText = 'C:\\测试';
  assert.throws(() => createLauncherCatalogProcessInput(fields), { code: 'LAUNCH_DATA' });
  const encoded = createLauncherCatalogProcessInput({ ...fields, pathEncoding: 'windows-936' });
  assert.equal(Buffer.from(encoded.directoryBytes).toString('hex'), '433a5cb2e2cad4');
  assert.equal(Buffer.from(createLauncherCatalogProcessInput({ ...fields, pathEncoding: 'utf-8' }).directoryBytes).toString('hex'), '433a5ce6b58be8af95');
});
test('unsupported/closed region, unsafe directory, absent snapshots and getters cannot produce an input', () => {
  for (const change of [{ referenceOrdinal: 1 },{ directoryText: '../Root' },{ directoryText: 'C:\\Root\\..' },{ pathEncoding: 'auto' },
    { resourceGroups: [] },{ gameOrdinal: 99 }]) assert.throws(() => createLauncherCatalogProcessInput({ ...input(), ...change }), { code: 'LAUNCH_DATA' });
  const fields = input(); let touched = false; Object.defineProperty(fields, 'directoryText', { get() { touched = true; return 'C:\\Root'; } });
  assert.throws(() => createLauncherCatalogProcessInput(fields), { code: 'LAUNCH_DATA' }); assert.equal(touched, false);
});

test('explicit nonzero refresh words skip resource reads while absent or zero preserves existing groups',()=>{
 const normal=createLauncherProcessPlan(createLauncherCatalogProcessInput(input()));assert.equal(normal.onlyRefreshWord,0);assert.equal(normal.resourceGroups.reduce((n,r)=>n+r.rows.length,0),5);
 for(const onlyRefreshWord of [1,2,0xffffffff]){let touched=false;const value={...input(),onlyRefreshWord};Object.defineProperty(value,'resourceGroups',{get(){touched=true;throw Error();}});const p=createLauncherProcessPlan(createLauncherCatalogProcessInput(value));assert.equal(touched,false);assert.equal(p.onlyRefreshWord,onlyRefreshWord);assert.equal(p.clientCreationRequested,false);assert.deepEqual(p.resourceGroups,[]);}
});
test('refresh input must be an own uint32 and never invokes an accessor',()=>{
 for(const onlyRefreshWord of [-1,0x100000000,Infinity,'1',true,null,undefined])assert.throws(()=>createLauncherCatalogProcessInput({...input(),onlyRefreshWord}),{code:'LAUNCH_DATA'});
 let touched=false;const value=input();Object.defineProperty(value,'onlyRefreshWord',{get(){touched=true;return 1;}});assert.throws(()=>createLauncherCatalogProcessInput(value),{code:'LAUNCH_DATA'});assert.equal(touched,false);
});
test('inherited refresh is not silently applied to the current configured target',()=>{
 const value=input();Object.setPrototypeOf(value,{onlyRefreshWord:1});const p=createLauncherProcessPlan(createLauncherCatalogProcessInput(value));assert.equal(p.onlyRefreshWord,0);assert.equal(p.clientCreationRequested,true);
});
test('refresh word does not stop non-CG native client branches',()=>{
 const value=input();const games=new TextDecoder().decode(value.catalogs.gameListBytes).replaceAll('Code="11"','Code="3"'),regions=new TextDecoder().decode(value.catalogs.regionListBytes).replaceAll('Gamecode="11"','Gamecode="3"');
 const gameListBytes=raw(games),regionListBytes=raw(regions);const catalogs={...value.catalogs,gameListBytes,regionListBytes,gameListMd5:computeLauncherFileMd5(gameListBytes),regionListMd5:computeLauncherFileMd5(regionListBytes)};
 const p=createLauncherProcessPlan(createLauncherCatalogProcessInput({...value,catalogs,onlyRefreshWord:1}));assert.equal(p.gameCode,3);assert.equal(p.clientCreationRequested,true);assert.deepEqual(p.resourceGroups,[]);
});

test('firstConfig binds raw ConfigEXE and separate same-Code ordinals without reading resource metadata',()=>{
 const value=input(),games=new TextDecoder().decode(value.catalogs.gameListBytes).replace('<EXE>original-demo.exe</EXE>','<EXE>original-demo.exe</EXE><ConfigEXE> tools/Config.exe </ConfigEXE>').replace('<EXE>original-other.exe</EXE>','<EXE>original-other.exe</EXE><ConfigEXE>Other.exe</ConfigEXE>');
 const gameListBytes=raw(games),catalogs={...value.catalogs,gameListBytes,gameListMd5:computeLauncherFileMd5(gameListBytes)},fields={...value,catalogs,firstConfigWord:1,usernameBytes:raw('OriginalU1')};
 let touched=false;Object.defineProperty(fields,'resourceGroups',{get(){touched=true;throw Error();}});const first=createLauncherCatalogFirstConfigPlan(fields),second=createLauncherCatalogFirstConfigPlan({...value,catalogs,gameOrdinal:1,firstConfigWord:1,usernameBytes:raw('OriginalU1')});
 assert.equal(touched,false);assert.equal(first.binding.configurerText,' tools/Config.exe ');assert.equal(text(first.firstConfig.commandLineBytes),'C:\\Original\\ tools/Config.exe ');assert.equal(text(second.firstConfig.commandLineBytes),'C:\\Original\\Other.exe');assert.deepEqual(first.firstConfig.lookup.keyBytes,second.firstConfig.lookup.keyBytes);assert.equal(first.authentication,'unverified');
});
test('firstConfig source encoding remains explicit and account inputs never enter binding metadata',()=>{
 const value=input(),fields={...value,usernameBytes:raw('OriginalU1'),firstConfigWord:0,directoryText:'C:\\测试',pathEncoding:'windows-936'};
 const result=createLauncherCatalogFirstConfigPlan(fields);assert.equal(result.firstConfig.disposition,'flag-clear');assert.equal(Object.hasOwn(result.binding,'usernameBytes'),false);assert.equal(Object.hasOwn(result.binding,'password'),false);
 assert.throws(()=>createLauncherCatalogFirstConfigPlan({...fields,pathEncoding:'ascii'}),{code:'LAUNCH_DATA'});assert.throws(()=>createLauncherCatalogFirstConfigPlan({...fields,firstConfigWord:'1'}),{code:'LAUNCH_DATA'});
});
