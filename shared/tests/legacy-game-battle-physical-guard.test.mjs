import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import * as api from '../index.mjs';
import {physicalGuardLookAhead} from '../legacy-game-battle-physical-guard-plan.mjs';
import {verifyGuardModel} from '../../analysis/game-battle-physical-guard-v1/verify_model.mjs';
import {verifyGuardCallbacks,verifyGuardAtomic,verifyGuardManagers} from '../../analysis/game-battle-physical-guard-v1/verify_routes.mjs';
const v=()=>JSON.parse(readFileSync(new URL('../../analysis/game-battle-physical-guard-v1/original-vectors.json',import.meta.url)));
test('guard,contiguous look-ahead and charge queues,owned storage,every modeled state and full RGBA match independent source equations',async()=>console.log('guard-independent '+JSON.stringify(await verifyGuardModel(api,v()))));
test('guard callbacks retain three roles,RID stale fourth,double freeze and source reset semantics',async()=>console.log('guard-callbacks '+JSON.stringify(await verifyGuardCallbacks(api,v()))));
test('guard unsupported results,malformed fields,missing resources and capacity reject atomically',async()=>console.log('guard-atomic '+JSON.stringify(await verifyGuardAtomic(api,v(),{supportsEmptyTargets:true}))));
test('guard real manager drains rounds,owns244 exit and exposes native wait recovery for finite unresolved alias chains',async()=>console.log('guard-managers '+JSON.stringify(await verifyGuardManagers(api,v()))));
test('436c20 inspects only contiguous1010 records using its local cursor and source RID skip',()=>{
 const cases=[[[255],0,0,-1],[[1,10,1,8,0,11,0x10,9,255],0,0,-1],[[1,10,0x800010,8,41,42,43,0,11,0x1000,9,255],0,0,11],[[1,10,0x10,8,50,51,0x10,9,255],0,20,21],[[1,10,0x10],0,0,undefined],[[0,11,0x10],0,0,11],[[1,10,0x210,8,0,11,0x10,9,255],0,0,11]];
 for(const[words,start,actor,result]of cases){const before=[...words];assert.equal(physicalGuardLookAhead(words,start,actor),result);assert.deepEqual(words,before);}
});
