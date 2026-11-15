/** Current generated portable artifact in a neutral JS realm,with explicit authored native ports. */
import test from 'node:test';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
import {verifyNestedPhysicalModel} from './verify_model.mjs';
import {verifyNestedPhysicalCallbacks,verifyNestedPhysicalPreparation,verifyNestedPhysicalAtomic,verifyNestedPhysicalManagers} from './verify_routes.mjs';
import {nestedPhysicalTCPModes,nestedPhysicalRecoveryModes,runNestedPhysicalTCP} from './tcp-flow.mjs';
const code=readFileSync(new URL('../../build/wechat-game-stage212-verified/game.js',import.meta.url),'utf8');
function instance(){const module={exports:{}};runInNewContext(code,{module,Uint8Array,Uint16Array,Uint32Array,Int32Array,Float32Array,ArrayBuffer,DataView,
 Buffer:undefined,URL:undefined,TextEncoder:undefined,TextDecoder:undefined,process:undefined,require:undefined,window:undefined,document:undefined,fetch:undefined,crypto:undefined,AbortController:undefined,AbortSignal:undefined,EventTarget:undefined,performance:undefined,setTimeout:undefined,clearTimeout:undefined},{timeout:1500});return module.exports;}
const vectors=()=>JSON.parse(readFileSync(new URL('./original-vectors.json',import.meta.url)));
test('neutral nestedPhysical queues,storage,all modeled states andRGBA',async()=>console.log('nestedPhysical-results-portable-model '+JSON.stringify(await verifyNestedPhysicalModel(instance(),vectors()))));
test('neutral nested actual232 HP/masks/messages/two guards',async()=>console.log('nestedPhysical-results-portable-callbacks '+JSON.stringify(await verifyNestedPhysicalCallbacks(instance(),vectors()))));
test('neutral113 runtime and72-only preparation boundary',async()=>console.log('nestedPhysical-results-portable-metadata '+JSON.stringify(await verifyNestedPhysicalPreparation(instance(),vectors()))));
test('neutral nestedPhysical atomic required and unused graphics contracts',async()=>console.log('nestedPhysical-results-portable-atomic '+JSON.stringify(await verifyNestedPhysicalAtomic(instance(),vectors()))));
test('neutral nestedPhysical actual managers and native wait recovery',async()=>console.log('nestedPhysical-results-portable-managers '+JSON.stringify(await verifyNestedPhysicalManagers(instance(),vectors()))));
for(const mode of nestedPhysicalTCPModes)test('neutral nestedPhysical OS TCP '+mode,{timeout:nestedPhysicalRecoveryModes.includes(mode)?240000:40000},async()=>console.log('nestedPhysical-results-portable-tcp '+JSON.stringify(await runNestedPhysicalTCP(instance(),mode))));
