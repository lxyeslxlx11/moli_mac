import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { parseGameCatalog, parseRegionCatalog, listGameGalaxies, selectLauncherRegion, createLauncherProcessPlan,
  encodeLauncherProcessField, LAUNCHER_RESOURCE_GROUPS, createOfflineRegionLaunchPlan } from '../index.mjs';
const game = code => parseGameCatalog(`<Gamelist><Games><Game Code="${code}"><Name>Original</Name><EXE>original.exe</EXE><Argsline> base </Argsline><Regions><Region>OriginalRegion</Region></Regions></Game></Games></Gamelist>`);
const xml = body => `<Regionlist><Regions><Region><Name>OriginalRegion</Name><Arglist><Args Gamecode="11"> region </Args></Arglist><Galaxylist>${body}</Galaxylist></Region></Regions></Regionlist>`;
const records = '<Galaxy Name="First" Gamecode="11"> --first </Galaxy><Galaxy Name="Other" Gamecode="3"> --other </Galaxy><Galaxy Name="Last" Gamecode="0011"> --last </Galaxy>';
const error = (fn, code) => assert.throws(fn, { code });
const vectors = JSON.parse(await readFile(new URL('../../analysis/launcher-v25/original-galaxy-vectors.json',import.meta.url)));

test('63 independent Python XML/filter/selection policy vectors match the public Galaxy model', () => {
  assert.equal(vectors.cases.length,63);
  for(const row of vectors.cases){
    const games=game(row.game_code),regions=parseRegionCatalog(row.region_xml);
    assert.deepEqual(listGameGalaxies(games,0,regions,0),row.expected.choices,row.name);
    const choose=()=>selectLauncherRegion(games,0,regions,0,row.galaxy_ordinal===null?{}:{galaxyOrdinal:row.galaxy_ordinal});
    if(row.expected.selection.error)error(choose,row.expected.selection.error);
    else{
      const selected=choose(),expected=row.expected.selection;
      assert.equal(selected.galaxyArgs??null,expected.galaxyArgs,row.name);
      if(expected.galaxyOrdinal!==undefined){assert.equal(selected.galaxyOrdinal,expected.galaxyOrdinal);assert.equal(selected.galaxyName,expected.galaxyName);}
    }
  }
});

test('Galaxy schema preserves source ordinals, raw Name/Gamecode/text and explicit game filtering', () => {
  const regions = parseRegionCatalog(xml(records)), choices = listGameGalaxies(game(11), 0, regions, 0);
  assert.deepEqual(regions.regions[0].galaxies.map(row => [row.ordinal,row.gameCode,row.name,row.text]),
    [[0,'11','First',' --first '],[1,'3','Other',' --other '],[2,'0011','Last',' --last ']]);
  assert.deepEqual(choices.map(row => [row.galaxyOrdinal,row.name,row.status]), [[0,'First','available'],[2,'Last','available']]);
  assert.ok(Object.isFrozen(choices)); assert.ok(Object.isFrozen(choices[0]));
  assert.deepEqual(listGameGalaxies(game(3),0,regions,0).map(row => row.galaxyOrdinal), [1]);
});
test('selection requires an explicit original ordinal and produces its own additional argument', () => {
  const regions = parseRegionCatalog(xml(records)); error(() => selectLauncherRegion(game(11),0,regions,0),'GALAXY_SELECTION_REQUIRED');
  const selected = selectLauncherRegion(game(11),0,regions,0,{galaxyOrdinal:2});
  assert.equal(selected.galaxyName,'Last');assert.equal(selected.galaxyArgs,' --last ');assert.equal(selected.galaxyOrdinal,2);
  assert.equal(selected.baseArgs,' base ');assert.equal(selected.regionArgs,' region ');assert.equal(selected.authentication,'unverified');
  error(() => selectLauncherRegion(game(11),0,regions,0,{galaxyOrdinal:1}),'GALAXY_UNAVAILABLE');
  error(() => selectLauncherRegion(game(11),0,regions,0,{galaxyOrdinal:99}),'GALAXY_UNAVAILABLE');
});
test('a Galaxy for another game does not require selection or add a stale argument', () => {
  const regions = parseRegionCatalog(xml(records));assert.deepEqual(listGameGalaxies(game(14),0,regions,0),[]);
  const result = selectLauncherRegion(game(14),0,regions,0);assert.equal(Object.hasOwn(result,'galaxyArgs'),false);
  error(() => selectLauncherRegion(game(14),0,regions,0,{galaxyOrdinal:0}),'GALAXY_UNAVAILABLE');
  assert.equal(selectLauncherRegion(game(11),0,parseRegionCatalog(xml('')),0).regionName,'OriginalRegion');
});
test('duplicate exact names are blocked across the entire region, including other game slots', () => {
  const regions = parseRegionCatalog(xml('<Galaxy Name="Same" Gamecode="3">other</Galaxy><Galaxy Name="Same" Gamecode="11">selected</Galaxy>'));
  assert.equal(listGameGalaxies(game(11),0,regions,0)[0].status,'ambiguous-name');
  error(() => selectLauncherRegion(game(11),0,regions,0,{galaxyOrdinal:1}),'GALAXY_AMBIGUOUS');
  const distinct = parseRegionCatalog(xml('<Galaxy Name="same" Gamecode="11">one</Galaxy><Galaxy Name="Same" Gamecode="11">two</Galaxy>'));
  assert.equal(listGameGalaxies(game(11),0,distinct,0).every(row => row.status==='available'),true);
});
test('decoded names retain whitespace/entity identity and body text does not undergo argument trimming', () => {
  const regions = parseRegionCatalog(xml('<Galaxy Name=" A&amp;B " Gamecode="11">  --raw &amp; &lt;x&gt;  </Galaxy>'));
  const result = selectLauncherRegion(game(11),0,regions,0,{galaxyOrdinal:0});
  assert.equal(result.galaxyName,' A&B ');assert.equal(result.galaxyArgs,'  --raw & <x>  ');
});
test('missing Name/Gamecode, nested body, non-Galaxy children and invalid slots fail during parsing', () => {
  for (const body of ['<Galaxy Gamecode="11">x</Galaxy>','<Galaxy Name="X">x</Galaxy>','<Galaxy Name=" " Gamecode="11"/>',
    '<Galaxy Name="X" Gamecode="15"/>','<Galaxy Name="X" Gamecode="-1"/>','<Galaxy Name="X" Gamecode="11"><Child/></Galaxy>',
    '<Other/>','unstructured']) assert.throws(() => parseRegionCatalog(xml(body)));
});
test('record budgets stop before native inclusive-loop or unbounded slot behavior is imitated', () => {
  const body = Array.from({length:15},(_,i)=>`<Galaxy Name="Original${i}" Gamecode="11">${i}</Galaxy>`).join('');
  assert.equal(listGameGalaxies(game(11),0,parseRegionCatalog(xml(body)),0).length,15);
  error(() => parseRegionCatalog(xml(body+'<Galaxy Name="Extra" Gamecode="11"/>')),'REGION_BUDGET');
});
test('invalid, inherited and accessor ordinals never coerce or silently choose the first item', () => {
  const regions = parseRegionCatalog(xml(records));
  for (const value of [-1,NaN,'0',Infinity,0.1,1n]) error(() => selectLauncherRegion(game(11),0,regions,0,{galaxyOrdinal:value}),'ORDINAL_BOUNDS');
  error(() => selectLauncherRegion(game(11),0,regions,0,Object.create({galaxyOrdinal:0})),'GALAXY_SELECTION_REQUIRED');
  let touched=false;error(() => selectLauncherRegion(game(11),0,regions,0,{get galaxyOrdinal(){touched=true;return 0;}}),'INVALID_INPUT');assert.equal(touched,false);
});
test('a chosen Galaxy reaches the independent process producer after base/region with its original bytes', () => {
  const selected = selectLauncherRegion(game(11),0,parseRegionCatalog(xml(records)),0,{galaxyOrdinal:2});
  const raw = text => encodeLauncherProcessField(text,{encoding:'ascii'});
  const plan = createLauncherProcessPlan({gameCode:11,onlyRefreshWord:0,caseProfile:'ascii',directoryBytes:raw('C:\\Original'),executablePathBytes:raw('Original.exe'),
    argsLineBytes:raw(selected.baseArgs),regionArgsBytes:raw(selected.regionArgs),galaxyArgsBytes:raw(selected.galaxyArgs),
    resourceGroups:LAUNCHER_RESOURCE_GROUPS.map(({id})=>({id,state:'find-failed'}))});
  assert.equal(Buffer.from(plan.commandLineBytes).toString('ascii'),'Original.exe  base   region   --last \0');
});
test('offline file planning also accepts the explicit Galaxy choice without losing directory options', () => {
  const plan = createOfflineRegionLaunchPlan(game(11),0,parseRegionCatalog(xml(records)),0,{galaxyOrdinal:0,iniText:'[Path]\nGame11=C:\\Original'});
  assert.equal(plan.region.galaxyName,'First');assert.equal(plan.files.client.windowsPath,'C:\\Original\\original.exe');
});
