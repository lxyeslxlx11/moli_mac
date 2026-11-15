/** Current neutral JS bundle;explicit authored local TCP and file ports. */
import test from'node:test';
import{readFileSync}from'node:fs';
import{runInNewContext}from'node:vm';
import{verifyPair73Model}from'../game-battle-pair73-v1/verify_model.mjs';
import{verifyPair73Protocol,verifyPair73Callbacks,verifyPair73PositiveRegression,verifyPair73Boundaries,verifyPair73Managers}from'../game-battle-pair73-v1/verify_routes.mjs';
import{pair73TCPModes,runPair73TCP}from'../game-battle-pair73-v1/tcp-flow.mjs';
const code=readFileSync(new URL('../../build/wechat-game-stage219-verified/game.js',import.meta.url),'utf8');
function instance(){const module={exports:{}};runInNewContext(code,{module,Uint8Array,Uint16Array,Uint32Array,Int32Array,Float32Array,ArrayBuffer,DataView,
 Buffer:undefined,URL:undefined,TextEncoder:undefined,TextDecoder:undefined,process:undefined,require:undefined,window:undefined,document:undefined,fetch:undefined,crypto:undefined,AbortController:undefined,AbortSignal:undefined,EventTarget:undefined,performance:undefined,setTimeout:undefined,clearTimeout:undefined},{timeout:1500});return module.exports;}
const vectors=()=>JSON.parse(readFileSync(new URL('../game-battle-pair73-v1/original-vectors.json',import.meta.url)));
test('neutral bundle73pair independent queues,states and RGBA',async()=>console.log('pair73-portable-model '+JSON.stringify(await verifyPair73Model(instance(),vectors()))));
test('neutral bundle73pair native preparation and slot aliases',async()=>console.log('pair73-portable-protocol '+JSON.stringify(verifyPair73Protocol(instance(),vectors()))));
test('neutral bundle73pair default14 and cost callbacks',async()=>console.log('pair73-portable-callbacks '+JSON.stringify(await verifyPair73Callbacks(instance(),vectors()))));
test('neutral bundle73pair positive variant regression',async()=>console.log('pair73-portable-202 '+JSON.stringify(await verifyPair73PositiveRegression(instance(),vectors()))));
test('neutral bundle73pair raw-tail and source context boundaries',async()=>console.log('pair73-portable-boundaries '+JSON.stringify(await verifyPair73Boundaries(instance(),vectors()))));
test('neutral bundle73pair actual manager rounds,recovery and local244',async()=>console.log('pair73-portable-managers '+JSON.stringify(await verifyPair73Managers(instance(),vectors()))));
for(const mode of pair73TCPModes)test('neutral bundle73pair OS TCP '+mode,{timeout:50000},async()=>console.log('pair73-portable-tcp '+JSON.stringify(await runPair73TCP(instance(),mode))));

import{verifyAttachedRIDModel}from'./verify_model.mjs';import{verifyAttachedRIDRoutes}from'./verify_routes.mjs';import{attachedRIDTCPModes,runAttachedRIDTCP}from'./tcp-flow.mjs';
const ridVectors=()=>JSON.parse(readFileSync(new URL('./original-vectors.json',import.meta.url)));
test('neutral bundle attached RID independent states,storage and RGBA',async()=>console.log('attached-rid-portable-model '+JSON.stringify(await verifyAttachedRIDModel(instance(),ridVectors()))));
test('neutral bundle attached RID atomic context and ownership',async()=>console.log('attached-rid-portable-routes '+JSON.stringify(await verifyAttachedRIDRoutes(instance(),ridVectors()))));
for(const mode of attachedRIDTCPModes)test('neutral bundle attached RID OS TCP '+mode,{timeout:50000},async()=>console.log('attached-rid-portable-tcp '+JSON.stringify(await runAttachedRIDTCP(instance(),mode))));
