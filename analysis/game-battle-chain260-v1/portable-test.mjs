/** Current neutral JS bundle;explicit authored local TCP and file ports. */
import test from'node:test';
import{readFileSync}from'node:fs';
import{runInNewContext}from'node:vm';
import{verifyChainModel}from'./verify_model.mjs';
import{verifyChainProtocol,verifyChainCallbacks,verifyChain202,verifyChainBoundaries,verifyChainManagers}from'./verify_routes.mjs';
import{chainTCPModes,runChainTCP}from'./tcp-flow.mjs';
const code=readFileSync(new URL('../../build/wechat-game-stage217-verified/game.js',import.meta.url),'utf8');
function instance(){const module={exports:{}};runInNewContext(code,{module,Uint8Array,Uint16Array,Uint32Array,Int32Array,Float32Array,ArrayBuffer,DataView,
 Buffer:undefined,URL:undefined,TextEncoder:undefined,TextDecoder:undefined,process:undefined,require:undefined,window:undefined,document:undefined,fetch:undefined,crypto:undefined,AbortController:undefined,AbortSignal:undefined,EventTarget:undefined,performance:undefined,setTimeout:undefined,clearTimeout:undefined},{timeout:1500});return module.exports;}
const vectors=()=>JSON.parse(readFileSync(new URL('./original-vectors.json',import.meta.url)));
test('neutral bundle260 independent queues,states and RGBA',async()=>console.log('chain-portable-model '+JSON.stringify(await verifyChainModel(instance(),vectors()))));
test('neutral bundle260 distinct native readers',async()=>console.log('chain-portable-protocol '+JSON.stringify(verifyChainProtocol(instance()))));
test('neutral bundle260 actual201/203/204 callbacks',async()=>console.log('chain-portable-callbacks '+JSON.stringify(await verifyChainCallbacks(instance(),vectors()))));
test('neutral bundle260 actual202 slot/flags coordinates',async()=>console.log('chain-portable-202 '+JSON.stringify(await verifyChain202(instance(),vectors()))));
test('neutral bundle260 raw-tail and source context boundaries',async()=>console.log('chain-portable-boundaries '+JSON.stringify(await verifyChainBoundaries(instance(),vectors()))));
test('neutral bundle260 actual manager rounds,recovery and local244',async()=>console.log('chain-portable-managers '+JSON.stringify(await verifyChainManagers(instance(),vectors()))));
for(const mode of chainTCPModes)test('neutral bundle260 OS TCP '+mode,{timeout:50000},async()=>console.log('chain-portable-tcp '+JSON.stringify(await runChainTCP(instance(),mode))));
