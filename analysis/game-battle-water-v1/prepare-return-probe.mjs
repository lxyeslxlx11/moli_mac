/** Reuse the accepted TCP return flow, adding independent source-order accounting. */
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {fileURLToPath,pathToFileURL} from 'node:url';
import {resolve} from 'node:path';
import assert from 'node:assert/strict';
const root=fileURLToPath(new URL('../../',import.meta.url)),base=resolve(root,'analysis/game-battle-return-v1'),out=resolve(root,'build/analysis/game-battle-water-v1/return-probe.mjs');
export function waterReturnProbeSource(){
let source=readFileSync(resolve(base,'tcp-flow.mjs'),'utf8');
const before='const advance=async()=>{tick=(tick+16)>>>0;const job=client.advanceBattleEntry();';assert.equal(source.split(before).length-1,1);
source=source.replace(before,"const advance=async()=>{tick=(tick+16)>>>0;const waterBefore=worldOwner.copyWaterState(),entryBefore=client.copyBattleEntry();const job=client.advanceBattleEntry();const waterPrepared=worldOwner.copyWaterState(),localPresent=client.copyWorldState().actors.localActor!==null;");
const boundary='rendered++;last=out;return out;';assert.equal(source.split(boundary).length-1,1);
source=source.replace(boundary,`const expectedUpdates=entryBefore.mainState===9&&localPresent?1:0;
 assert.equal(waterPrepared.updates-waterBefore.updates,expectedUpdates,'source442f20 presence gate');
 assert.equal(waterPrepared.phase-waterBefore.phase,expectedUpdates*.25,'no render-driven phase advance');
 const expectedPasses=1+Number(!!out.capturePlan)+Number(!!out.return?.capture);
 assert.equal(waterPrepared.passes-waterBefore.passes,expectedPasses,'nested506030 andouter pass count');
 assert.deepEqual(worldOwner.copyWaterState(),waterPrepared,'resource rendering must not replaywater');
 waterChecks++;waterUpdates+=expectedUpdates;waterPasses+=expectedPasses;
 rendered++;last=out;return out;`);
source=source.replace('let worldOwner,','let waterChecks=0,waterUpdates=0,waterPasses=0;let worldOwner,');
source=source.replace('export async function runReturnTCP','export async function runWaterReturnTCP');
// Keep all original transport, result, fade and cleanup assertions.
assert.equal(source.split('return{mode,receipt,rendered,').length-1,1);
source=source.replace('return{mode,receipt,rendered,','return{waterChecks,waterUpdates,waterPasses,mode,receipt,rendered,');
source=source.replace(/(?:from\s*|import\()\s*['"](\.[^'"]+)['"]/g,(match,path)=>match.replace(path,pathToFileURL(resolve(base,path)).href));
source=source.replace(/new URL\('([^']+)',import.meta.url\)/g,(match,path)=>"new URL('"+pathToFileURL(resolve(base,path)).href+"')");
// read() deliberately resolves relative to the original evidence directory.
source=source.replace("new URL(p,import.meta.url)","new URL(p,'"+pathToFileURL(resolve(base,'tcp-flow.mjs')).href+"')");
source=source.replace('returnTCPModes','waterReturnTCPModes');
return source;
}
// Tests load this authored instrumentation directly from retained source inputs;
// a prior build/ preparation must not be needed to run shared tests.
export async function loadWaterReturnProbe(){return import('data:text/javascript;base64,'+Buffer.from(waterReturnProbeSource()).toString('base64'));}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 mkdirSync(resolve(root,'build/analysis/game-battle-water-v1'),{recursive:true});writeFileSync(out,waterReturnProbeSource());console.log(JSON.stringify({stage:299,output:out,source:'analysis/game-battle-return-v1/tcp-flow.mjs',oldAssertionsPreserved:true}));
}
