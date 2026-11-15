/** Current neutral JS bundle;explicit authored local TCP and file ports. */
import test from'node:test';
import{readFileSync}from'node:fs';
import{runInNewContext}from'node:vm';
import{verifySequenceModel}from'./verify_model.mjs';
import{verifySequenceCallbacks,verifySequenceParallel,verifySequenceLifetime,verifySequenceRID,verifySequenceBoundaries,verifySequenceManagers}from'./verify_routes.mjs';
import{sequenceTCPModes,runSequenceTCP}from'./tcp-flow.mjs';
const code=readFileSync(new URL('../../build/wechat-game-stage216-verified/game.js',import.meta.url),'utf8');
function instance(){const module={exports:{}};runInNewContext(code,{module,Uint8Array,Uint16Array,Uint32Array,Int32Array,Float32Array,ArrayBuffer,DataView,
 Buffer:undefined,URL:undefined,TextEncoder:undefined,TextDecoder:undefined,process:undefined,require:undefined,window:undefined,document:undefined,fetch:undefined,crypto:undefined,AbortController:undefined,AbortSignal:undefined,EventTarget:undefined,performance:undefined,setTimeout:undefined,clearTimeout:undefined},{timeout:1500});return module.exports;}
const vectors=()=>JSON.parse(readFileSync(new URL('./original-vectors.json',import.meta.url)));
test('neutral bundle105 independent queues,full owned states,RGBA and explicit rendering boundaries',async()=>console.log('sequence-portable-model '+JSON.stringify(await verifySequenceModel(instance(),vectors()))));
test('neutral bundle105 actual ten-level156/97/98 callbacks and one14 HP settlement',async()=>console.log('sequence-portable-callbacks '+JSON.stringify(await verifySequenceCallbacks(instance(),vectors()))));
test('neutral bundle105 one actual cursor across seven interleaved actor flows',async()=>console.log('sequence-portable-parallel '+JSON.stringify(await verifySequenceParallel(instance(),vectors()))));
test('neutral bundle105 actual self interruption preserves cursor across body clear',async()=>console.log('sequence-portable-lifetime '+JSON.stringify(await verifySequenceLifetime(instance(),vectors()))));
test('neutral bundle105 guard RID and stale fourth word',async()=>console.log('sequence-portable-rid '+JSON.stringify(await verifySequenceRID(instance(),vectors()))));
test('neutral bundle105 atomic field/capacity checks and two portable rendering failures',async()=>console.log('sequence-portable-boundaries '+JSON.stringify(await verifySequenceBoundaries(instance(),vectors()))));
test('neutral bundle105 natural rounds,recovery and244 exit via real managers',async()=>console.log('sequence-portable-managers '+JSON.stringify(await verifySequenceManagers(instance(),vectors()))));
for(const mode of sequenceTCPModes)test('neutral bundle105 complete OS TCP '+mode,{timeout:50000},async()=>console.log('sequence-portable-tcp '+JSON.stringify(await runSequenceTCP(instance(),mode))));
