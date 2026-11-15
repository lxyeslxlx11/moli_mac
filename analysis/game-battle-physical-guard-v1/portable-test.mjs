/** Current generated portable artifact in a neutral JS realm,with explicit authored native ports. */
import test from 'node:test';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
import {verifyGuardModel} from './verify_model.mjs';
import {verifyGuardCallbacks,verifyGuardAtomic,verifyGuardManagers} from './verify_routes.mjs';
import {guardTCPModes,runGuardTCP} from './tcp-flow.mjs';
const code=readFileSync(new URL('../../build/wechat-game-stage208-verified/game.js',import.meta.url),'utf8');
function instance(){const module={exports:{}};runInNewContext(code,{module,Uint8Array,Uint16Array,Uint32Array,Int32Array,Float32Array,ArrayBuffer,DataView,
 Buffer:undefined,URL:undefined,TextEncoder:undefined,TextDecoder:undefined,process:undefined,require:undefined,window:undefined,document:undefined,fetch:undefined,crypto:undefined,AbortController:undefined,AbortSignal:undefined,EventTarget:undefined,performance:undefined,setTimeout:undefined,clearTimeout:undefined},{timeout:1500});return module.exports;}
const vectors=()=>JSON.parse(readFileSync(new URL('./original-vectors.json',import.meta.url)));
test('current neutral bundle guard queues,storage,all states and RGBA match independent native equations',async()=>console.log('guard-portable-model '+JSON.stringify(await verifyGuardModel(instance(),vectors()))));
test('current neutral bundle guard actual callbacks preserve freeze,triplet and RID ownership',async()=>console.log('guard-portable-callbacks '+JSON.stringify(await verifyGuardCallbacks(instance(),vectors()))));
test('current neutral bundle guard rejects unsupported and invalid paths atomically',async()=>console.log('guard-portable-atomic '+JSON.stringify(await verifyGuardAtomic(instance(),vectors()))));
test('current neutral bundle guard owns actual round,244 exit and native wait recovery',async()=>console.log('guard-portable-managers '+JSON.stringify(await verifyGuardManagers(instance(),vectors()))));
for(const mode of guardTCPModes)test('current neutral bundle guard complete OS TCP '+mode,{timeout:40000},async()=>console.log('guard-portable-tcp '+JSON.stringify(await runGuardTCP(instance(),mode))));
