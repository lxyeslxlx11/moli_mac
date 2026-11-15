import test from'node:test';import{readFileSync}from'node:fs';import*as api from'../index.mjs';import{verifyChainModel}from'../../analysis/game-battle-chain260-v1/verify_model.mjs';import{verifyChainProtocol,verifyChainCallbacks,verifyChain202,verifyChainBoundaries,verifyChainManagers}from'../../analysis/game-battle-chain260-v1/verify_routes.mjs';
const vectors=()=>JSON.parse(readFileSync(new URL('../../analysis/game-battle-chain260-v1/original-vectors.json',import.meta.url)));
test('260 independent queues,states and RGBA',async()=>console.log('chain-model '+JSON.stringify(await verifyChainModel(api,vectors()))));
test('260 distinct native preparation and runtime readers',async()=>console.log('chain-protocol '+JSON.stringify(verifyChainProtocol(api))));
test('260 actual201/203/204 timers,ownership and impact facing',async()=>console.log('chain-callbacks '+JSON.stringify(await verifyChainCallbacks(api,vectors()))));
test('260 actual202 slot/flags coordinates',async()=>console.log('chain-202 '+JSON.stringify(await verifyChain202(api,vectors()))));
test('260 raw-tail,capacity and native-context boundaries',async()=>console.log('chain-boundaries '+JSON.stringify(await verifyChainBoundaries(api,vectors()))));
test('260 real manager rounds,recovery and local244',async()=>console.log('chain-managers '+JSON.stringify(await verifyChainManagers(api,vectors()))));
