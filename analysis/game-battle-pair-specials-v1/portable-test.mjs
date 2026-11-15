/** Current generated portable artifact in a neutral JS realm,with explicit authored native ports. */
import test from 'node:test';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
import {verifyResultModel} from '../game-battle-physical-results-v1/verify_model.mjs';
import {verifyResultCallbacks,verifyResultCorrections,verifyResultAtomic,verifyResultLifetime,verifyResultManagers} from '../game-battle-physical-results-v1/verify_routes.mjs';
import {resultTCPModes,runResultTCP} from '../game-battle-physical-results-v1/tcp-flow.mjs';
const code=readFileSync(new URL('../../build/wechat-game-stage214-verified/game.js',import.meta.url),'utf8');
function instance(){const module={exports:{}};runInNewContext(code,{module,Uint8Array,Uint16Array,Uint32Array,Int32Array,Float32Array,ArrayBuffer,DataView,
 Buffer:undefined,URL:undefined,TextEncoder:undefined,TextDecoder:undefined,process:undefined,require:undefined,window:undefined,document:undefined,fetch:undefined,crypto:undefined,AbortController:undefined,AbortSignal:undefined,EventTarget:undefined,performance:undefined,setTimeout:undefined,clearTimeout:undefined},{timeout:1500});return module.exports;}
const vectors=()=>JSON.parse(readFileSync(new URL('../game-battle-physical-results-v1/original-vectors.json',import.meta.url)));
test('current neutral bundle result queues,storage,all states and RGBA match independent native equations',async()=>console.log('result-portable-model '+JSON.stringify(await verifyResultModel(instance(),vectors()))));
test('current neutral bundle result actual callbacks preserve freeze,triplet and RID ownership',async()=>console.log('result-portable-callbacks '+JSON.stringify(await verifyResultCallbacks(instance(),vectors()))));
test('current neutral bundle result rejects unsupported and invalid paths atomically',async()=>console.log('result-portable-atomic '+JSON.stringify(await verifyResultAtomic(instance(),vectors()))));
test('current neutral bundle result owns actual round,244 exit and native wait recovery',async()=>console.log('result-portable-managers '+JSON.stringify(await verifyResultManagers(instance(),vectors()))));
test('neutral bundle native field and266/262 category correction',async()=>console.log('results-portable-corrections '+JSON.stringify(await verifyResultCorrections(instance(),vectors()))));
test('neutral bundle result charge removed-parent lifetime',async()=>console.log('results-portable-lifetime '+JSON.stringify(await verifyResultLifetime(instance(),vectors()))));
for(const mode of resultTCPModes)test('current neutral bundle result complete OS TCP '+mode,{timeout:40000},async()=>console.log('result-portable-tcp '+JSON.stringify(await runResultTCP(instance(),mode))));
