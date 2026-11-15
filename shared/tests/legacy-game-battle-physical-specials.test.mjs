import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import * as api from '../index.mjs';
import {createBattlePhysicalSpecials} from '../legacy-game-battle-physical-specials.mjs';
import {verifySpecialsModel} from '../../analysis/game-battle-physical-specials-v1/verify_model.mjs';
import {verifySpecialsAtomic,verifySpecialsCallbacks,verifySpecialsManagers,verifySpecialsMissingGraphics} from '../../analysis/game-battle-physical-specials-v1/verify_routes.mjs';
const v=()=>JSON.parse(readFileSync(new URL('../../analysis/game-battle-physical-specials-v1/original-vectors.json',import.meta.url)));
test('physical specials every positive queue and newly enabled full state/draw/RGBA path match independent source equations',async()=>console.log('specials-independent '+JSON.stringify(await verifySpecialsModel(api,v()))));
test('physical specials callbacks retain metadata, lifetime, no-follow sprites and raw tile draws after deletion mark',async()=>console.log('specials-callbacks '+JSON.stringify(await verifySpecialsCallbacks(api,v()))));
test('physical specials real manager drains all new highest-tier variants and direct RID round',async()=>console.log('specials-managers '+JSON.stringify(await verifySpecialsManagers(api,v()))));
test('physical specials preserve unported branches and atomic malformed/capacity boundaries',async()=>console.log('specials-atomic '+JSON.stringify(await verifySpecialsAtomic(api,v(),{supportsEmptyTargets:true}))));
test('physical specials missing transient and every enabled tile row reject before body/tuple mutation',async()=>console.log('specials-graphics '+JSON.stringify(await verifySpecialsMissingGraphics(api,v()))));
test('41f5b0 all six selectors,31 draws,turnaround endpoints and integer remasking preserve native callback order',()=>{
 const rows=JSON.parse(readFileSync(new URL('../../analysis/game-battle-physical-specials-v1/tile-resources.json',import.meta.url))).rows;
 for(let selector=0;selector<6;selector++){
  const nodes=[],draws=[];let calls=0;const a={allocate:(kind,body,opts)=>{const n={kind,body,counter:0,...opts};nodes.push(n);return n;},submitDirect:d=>draws.push(d)},c={random:{next:()=>++calls}},s=createBattlePhysicalSpecials(a,c,{});
  assert.equal(s.tile(selector,0),null);assert.equal(nodes.length,0);const n=s.tile(selector,30);assert.equal(calls,2);
  const pulses=[];for(let i=0;i<31;i++){draws.length=0;s.effect(n);const p=s.snapshot(n);pulses.push(p.pulse);assert.equal(draws.length,100);assert.deepEqual([draws[0].x,draws[0].y,draws[99].x,draws[99].y],[32,24,608,456]);assert.equal(draws[0].resourceId,rows[selector][p.pulse]);assert.equal(p.counter.value,i+1);assert.equal(!!n.deleted,i===30);}
  assert.deepEqual(pulses,[...Array.from({length:15},(_,i)=>i+1),...Array.from({length:15},(_,i)=>14-i),1]);assert.equal(calls,5);
 }
});
