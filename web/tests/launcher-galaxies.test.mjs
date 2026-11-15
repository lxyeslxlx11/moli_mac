import test from 'node:test';
import assert from 'node:assert/strict';
import { bindLauncherSessionTarget } from '../launcher-target.mjs';
import { createLauncherCatalogProcessInput } from '../launcher-launch-data.mjs';
import { makeSyntheticSessionLauncher } from '../launcher-fixture.mjs';
import { computeLauncherFileMd5, createLauncherProcessPlan, LAUNCHER_RESOURCE_GROUPS } from '../../shared/index.mjs';
const endpoint={address:'127.0.0.1',port:12345},raw=value=>new TextEncoder().encode(value);
function catalogs(){
  const source=makeSyntheticSessionLauncher([endpoint]);
  const region=source.regions.replace('</Arglist>','</Arglist><Galaxylist><Galaxy Name="OriginalA" Gamecode="11"> --galaxy-A </Galaxy><Galaxy Name="Other" Gamecode="3">other</Galaxy><Galaxy Name="OriginalB" Gamecode="11"> --galaxy-B-long </Galaxy></Galaxylist>');
  const gameListBytes=raw(source.games),regionListBytes=raw(region);
  return{gameListBytes,regionListBytes,gameListMd5:computeLauncherFileMd5(gameListBytes),regionListMd5:computeLauncherFileMd5(regionListBytes),encoding:'utf-8',allowBareAmpersands:false};
}
const input=()=>({catalogs:catalogs(),gameOrdinal:0,referenceOrdinal:0,allowedEndpoints:[endpoint]});
test('a complete target requires the correct explicit Galaxy source ordinal and keeps original endpoints',()=>{
  assert.throws(()=>bindLauncherSessionTarget(input()),{code:'TARGET_REGION'});
  const target=bindLauncherSessionTarget({...input(),galaxyOrdinal:2});assert.equal(target.galaxyOrdinal,2);assert.equal(target.galaxyName,'OriginalB');
  assert.equal(target.gameCode,11);assert.deepEqual(target.endpoints,[endpoint]);assert.equal(target.authentication,'unverified');
});
test('Galaxy choice cannot grant or rewrite a configured billing endpoint',()=>{
  assert.throws(()=>bindLauncherSessionTarget({...input(),galaxyOrdinal:0,allowedEndpoints:[{address:'127.0.0.1',port:1}]}),{code:'TARGET_DENIED'});
  assert.throws(()=>bindLauncherSessionTarget({...input(),galaxyOrdinal:1}),{code:'TARGET_REGION'});
});
test('bound process input carries the chosen additional text into command bytes, not into billing or mapping metadata',()=>{
  const common={catalogs:catalogs(),gameOrdinal:0,referenceOrdinal:0,directoryText:'C:\\Original',pathEncoding:'ascii',
    resourceGroups:LAUNCHER_RESOURCE_GROUPS.map(({id})=>({id,state:'find-failed'}))};
  const a=createLauncherProcessPlan(createLauncherCatalogProcessInput({...common,galaxyOrdinal:0}));
  const b=createLauncherProcessPlan(createLauncherCatalogProcessInput({...common,galaxyOrdinal:2}));
  assert.match(Buffer.from(a.commandLineBytes).toString('ascii'),/ --galaxy-A \0$/);
  assert.match(Buffer.from(b.commandLineBytes).toString('ascii'),/ --galaxy-B-long \0$/);
  assert.equal(b.commandLineBytes.length-a.commandLineBytes.length,5);
  assert.throws(()=>createLauncherCatalogProcessInput(common),{code:'LAUNCH_DATA'});
});
test('ordinal accessors are rejected without invocation by target and process adapters',()=>{
  let touched=false;const value={...input(),get galaxyOrdinal(){touched=true;return 0;}};
  assert.throws(()=>bindLauncherSessionTarget(value),{code:'TARGET_INPUT'});
  assert.equal(touched,false);
  const fields={catalogs:catalogs(),gameOrdinal:0,referenceOrdinal:0,directoryText:'C:\\Original',pathEncoding:'ascii'};
  Object.defineProperty(fields,'galaxyOrdinal',{get(){touched=true;return 0;}});
  assert.throws(()=>createLauncherCatalogProcessInput(fields),{code:'LAUNCH_DATA'});assert.equal(touched,false);
});
