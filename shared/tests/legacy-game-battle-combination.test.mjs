import test from'node:test';import{readFileSync}from'node:fs';import*as api from'../index.mjs';import{verifyCombinationModel}from'../../analysis/game-battle-combination-v1/verify_model.mjs';import{verifyCombinationQueues,verifyCombinationManagers,verifyCombinationBoundaries}from'../../analysis/game-battle-combination-v1/verify_routes.mjs';
const vectors=()=>JSON.parse(readFileSync(new URL('../../analysis/game-battle-combination-v1/original-vectors.json',import.meta.url)));
test('CMB independent cumulative queues',()=>console.log('combination-queues '+JSON.stringify(verifyCombinationQueues(api,vectors()))));
test('CMB independent states,owned storage and full RGBA',async()=>console.log('combination-model '+JSON.stringify(await verifyCombinationModel(api,vectors()))));
test('CMB actual command manager rounds,exits and literal waiting',async()=>console.log('combination-managers '+JSON.stringify(await verifyCombinationManagers(api,vectors()))));
test('CMB atomic source boundaries,reset and scratch provenance',async()=>console.log('combination-boundaries '+JSON.stringify(await verifyCombinationBoundaries(api,vectors()))));
