/** Current generated portable artifact in a neutral JS realm,with explicit authored native ports. */
import test from 'node:test';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
import {verifySpecial96Model} from './verify_model.mjs';
import {verifySpecial96Callbacks,verifySpecial96Visibility,verifySpecial96Atomic,verifySpecial96Managers} from './verify_routes.mjs';
import {special96TCPModes,special96RecoveryModes,runSpecial96TCP} from './tcp-flow.mjs';
const code=readFileSync(new URL('../../build/wechat-game-stage213-verified/game.js',import.meta.url),'utf8');
function instance(){const module={exports:{}};runInNewContext(code,{module,Uint8Array,Uint16Array,Uint32Array,Int32Array,Float32Array,ArrayBuffer,DataView,
 Buffer:undefined,URL:undefined,TextEncoder:undefined,TextDecoder:undefined,process:undefined,require:undefined,window:undefined,document:undefined,fetch:undefined,crypto:undefined,AbortController:undefined,AbortSignal:undefined,EventTarget:undefined,performance:undefined,setTimeout:undefined,clearTimeout:undefined},{timeout:1500});return module.exports;}
const vectors=()=>JSON.parse(readFileSync(new URL('./original-vectors.json',import.meta.url)));
test('neutral special96 queues,storage,all modeled states andRGBA',async()=>console.log('special96-portable-model '+JSON.stringify(await verifySpecial96Model(instance(),vectors()))));
test('neutral96 actual93 zero HP without amount arithmetic',async()=>console.log('special96-portable-callbacks '+JSON.stringify(await verifySpecial96Callbacks(instance(),vectors()))));
test('neutral96 real visibility/teleport/freeze and explicit backend style boundary',async()=>console.log('special96-portable-metadata '+JSON.stringify(await verifySpecial96Visibility(instance(),vectors()))));
test('neutral special96 atomic required and unused graphics contracts',async()=>console.log('special96-portable-atomic '+JSON.stringify(await verifySpecial96Atomic(instance(),vectors()))));
test('neutral special96 actual managers and native wait recovery',async()=>console.log('special96-portable-managers '+JSON.stringify(await verifySpecial96Managers(instance(),vectors()))));
for(const mode of special96TCPModes)test('neutral special96 OS TCP '+mode,{timeout:special96RecoveryModes.includes(mode)?240000:40000},async()=>console.log('special96-portable-tcp '+JSON.stringify(await runSpecial96TCP(instance(),mode))));
