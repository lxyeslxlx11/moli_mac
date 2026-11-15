import test from'node:test';import{readFileSync}from'node:fs';import*as api from'../index.mjs';import{verifyPair73Model}from'../../analysis/game-battle-pair73-v1/verify_model.mjs';import{verifyPair73Protocol,verifyPair73Callbacks,verifyPair73PositiveRegression,verifyPair73Boundaries,verifyPair73Managers}from'../../analysis/game-battle-pair73-v1/verify_routes.mjs';
const vectors=()=>JSON.parse(readFileSync(new URL('../../analysis/game-battle-pair73-v1/original-vectors.json',import.meta.url)));
test('73 pair independent queues,states and RGBA',async()=>console.log('pair73-model '+JSON.stringify(await verifyPair73Model(api,vectors()))));
test('73 pair native preparation,slot aliases and cost prefix',()=>console.log('pair73-protocol '+JSON.stringify(verifyPair73Protocol(api,vectors()))));
test('73 pair default14 callbacks,one MP cost and one HP result',async()=>console.log('pair73-callbacks '+JSON.stringify(await verifyPair73Callbacks(api,vectors()))));
test('73 positive variants retain their independent model and no pair cost',async()=>console.log('pair73-positive '+JSON.stringify(await verifyPair73PositiveRegression(api))));
test('73 pair owned raw-tail,capacity and unsupported context boundaries',async()=>console.log('pair73-boundaries '+JSON.stringify(await verifyPair73Boundaries(api,vectors()))));
test('73 pair real manager rounds,recovery and local244',async()=>console.log('pair73-managers '+JSON.stringify(await verifyPair73Managers(api,vectors()))));
