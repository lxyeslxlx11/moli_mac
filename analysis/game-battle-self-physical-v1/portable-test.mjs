/** Current generated portable artifact in a neutral JS realm,with explicit authored native ports. */
import test from 'node:test';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
import {verifySelfPhysicalModel} from './verify_model.mjs';
import {verifySelfPhysicalCallbacks,verifySelfPhysicalMetadata,verifySelfPhysicalAtomic,verifySelfPhysicalManagers} from './verify_routes.mjs';
import {selfPhysicalTCPModes,selfPhysicalRecoveryModes,runSelfPhysicalTCP} from './tcp-flow.mjs';
const code=readFileSync(new URL('../../build/wechat-game-stage211-verified/game.js',import.meta.url),'utf8');
function instance(){const module={exports:{}};runInNewContext(code,{module,Uint8Array,Uint16Array,Uint32Array,Int32Array,Float32Array,ArrayBuffer,DataView,
 Buffer:undefined,URL:undefined,TextEncoder:undefined,TextDecoder:undefined,process:undefined,require:undefined,window:undefined,document:undefined,fetch:undefined,crypto:undefined,AbortController:undefined,AbortSignal:undefined,EventTarget:undefined,performance:undefined,setTimeout:undefined,clearTimeout:undefined},{timeout:1500});return module.exports;}
const vectors=()=>JSON.parse(readFileSync(new URL('./original-vectors.json',import.meta.url)));
test('neutral selfPhysical queues,storage,all modeled states andRGBA',async()=>console.log('selfPhysical-results-portable-model '+JSON.stringify(await verifySelfPhysicalModel(instance(),vectors()))));
test('neutral self actual216 HP/masks/messages/last record',async()=>console.log('selfPhysical-results-portable-callbacks '+JSON.stringify(await verifySelfPhysicalCallbacks(instance(),vectors()))));
test('neutral self actual216 saved RID ownership',async()=>console.log('selfPhysical-results-portable-metadata '+JSON.stringify(await verifySelfPhysicalMetadata(instance(),vectors()))));
test('neutral selfPhysical atomic required and unused graphics contracts',async()=>console.log('selfPhysical-results-portable-atomic '+JSON.stringify(await verifySelfPhysicalAtomic(instance(),vectors()))));
test('neutral selfPhysical actual managers and native wait recovery',async()=>console.log('selfPhysical-results-portable-managers '+JSON.stringify(await verifySelfPhysicalManagers(instance(),vectors()))));
for(const mode of selfPhysicalTCPModes)test('neutral selfPhysical OS TCP '+mode,{timeout:selfPhysicalRecoveryModes.includes(mode)?240000:40000},async()=>console.log('selfPhysical-results-portable-tcp '+JSON.stringify(await runSelfPhysicalTCP(instance(),mode))));
