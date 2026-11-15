/** Current generated portable artifact in a neutral JS realm,with explicit authored native ports. */
import test from 'node:test';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
import {verifyPositiveResultModel} from './verify_model.mjs';
import {verifyPositiveResultCallbacks,verifyPositiveResultMetadata,verifyPositiveResultAtomic,verifyPositiveResultLifetime,verifyPositiveResultManagers} from './verify_routes.mjs';
import {positiveTCPModes,positiveRecoveryModes,runPositiveTCP} from './tcp-flow.mjs';
const code=readFileSync(new URL('../../build/wechat-game-stage210-verified/game.js',import.meta.url),'utf8');
function instance(){const module={exports:{}};runInNewContext(code,{module,Uint8Array,Uint16Array,Uint32Array,Int32Array,Float32Array,ArrayBuffer,DataView,
 Buffer:undefined,URL:undefined,TextEncoder:undefined,TextDecoder:undefined,process:undefined,require:undefined,window:undefined,document:undefined,fetch:undefined,crypto:undefined,AbortController:undefined,AbortSignal:undefined,EventTarget:undefined,performance:undefined,setTimeout:undefined,clearTimeout:undefined},{timeout:1500});return module.exports;}
const vectors=()=>JSON.parse(readFileSync(new URL('./original-vectors.json',import.meta.url)));
test('neutral positive queues,storage,all modeled states andRGBA',async()=>console.log('positive-results-portable-model '+JSON.stringify(await verifyPositiveResultModel(instance(),vectors()))));
test('neutral positive actual HP/result priority',async()=>console.log('positive-results-portable-callbacks '+JSON.stringify(await verifyPositiveResultCallbacks(instance(),vectors()))));
test('neutral positive real RID recipients',async()=>console.log('positive-results-portable-metadata '+JSON.stringify(await verifyPositiveResultMetadata(instance(),vectors()))));
test('neutral positive atomic required and unused graphics contracts',async()=>console.log('positive-results-portable-atomic '+JSON.stringify(await verifyPositiveResultAtomic(instance(),vectors()))));
test('neutral positive removed-parent and reused-slot charge',async()=>console.log('positive-results-portable-lifetime '+JSON.stringify(await verifyPositiveResultLifetime(instance(),vectors()))));
test('neutral positive actual managers and native wait recovery',async()=>console.log('positive-results-portable-managers '+JSON.stringify(await verifyPositiveResultManagers(instance(),vectors()))));
for(const mode of positiveTCPModes)test('neutral positive OS TCP '+mode,{timeout:positiveRecoveryModes.includes(mode)?240000:40000},async()=>console.log('positive-results-portable-tcp '+JSON.stringify(await runPositiveTCP(instance(),mode))));
