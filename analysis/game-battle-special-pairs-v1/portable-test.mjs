/** Current neutral JS bundle;explicit authored local TCP and file ports. */
import test from'node:test';
import{readFileSync}from'node:fs';
import{runInNewContext}from'node:vm';
import{verifySpecialPairsModel}from'./verify_model.mjs';
import{verifySpecialPairsCallbacks,verifySpecialPairsDash,verifySpecialPairsRID,verifySpecialPairsAtomic,verifySpecialPairsManagers}from'./verify_routes.mjs';
import{specialPairsTCPModes,runSpecialPairsTCP}from'./tcp-flow.mjs';
const code=readFileSync(new URL('../../build/wechat-game-stage215-verified/game.js',import.meta.url),'utf8');
function instance(){const module={exports:{}};runInNewContext(code,{module,Uint8Array,Uint16Array,Uint32Array,Int32Array,Float32Array,ArrayBuffer,DataView,
 Buffer:undefined,URL:undefined,TextEncoder:undefined,TextDecoder:undefined,process:undefined,require:undefined,window:undefined,document:undefined,fetch:undefined,crypto:undefined,AbortController:undefined,AbortSignal:undefined,EventTarget:undefined,performance:undefined,setTimeout:undefined,clearTimeout:undefined},{timeout:1500});return module.exports;}
const vectors=()=>JSON.parse(readFileSync(new URL('./original-vectors.json',import.meta.url)));
test('neutral bundle94/257/262 independent queues,states and complete RGBA',async()=>console.log('special-pairs-portable-model '+JSON.stringify(await verifySpecialPairsModel(instance(),vectors()))));
test('neutral bundle94 signal,end,condition and257/262 effect facing',async()=>console.log('special-pairs-portable-callbacks '+JSON.stringify(await verifySpecialPairsCallbacks(instance(),vectors()))));
test('neutral bundle262 actual205 one-rand callbacks',async()=>console.log('special-pairs-portable-dash '+JSON.stringify(await verifySpecialPairsDash(instance(),vectors()))));
test('neutral bundle94/257/262 guard RID and fourth word',async()=>console.log('special-pairs-portable-RID '+JSON.stringify(await verifySpecialPairsRID(instance(),vectors()))));
test('neutral bundle94/257/262 atomic rejection',async()=>console.log('special-pairs-portable-atomic '+JSON.stringify(await verifySpecialPairsAtomic(instance(),vectors()))));
test('neutral bundle94/257/262 actual round,recovery and244 managers',async()=>console.log('special-pairs-portable-managers '+JSON.stringify(await verifySpecialPairsManagers(instance(),vectors()))));
for(const mode of specialPairsTCPModes)test('neutral bundle94/257/262 complete OS TCP '+mode,{timeout:40000},async()=>console.log('special-pairs-portable-tcp '+JSON.stringify(await runSpecialPairsTCP(instance(),mode))));
