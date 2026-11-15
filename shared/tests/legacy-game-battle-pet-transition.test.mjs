import test from'node:test';import assert from'node:assert/strict';import*as api from'../index.mjs';
import{petTransitionVectors as v,verifyPetTransitionTrace}from'../../analysis/game-battle-pet-transition-v1/reference.mjs';
for(const row of v.traces)test('MON source queues, actual owners, f32 callbacks and both selectors: '+row.name,()=>verifyPetTransitionTrace(api,assert,row));
