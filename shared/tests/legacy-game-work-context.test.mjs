import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createRequire} from 'node:module';
import {resolve} from 'node:path';
import * as sourceAPI from '../index.mjs';
import {contextOwners,bytes,header,craftRecipe,offerContextRecords} from '../../analysis/game-work-context-v1/fixture.mjs';
import {cityFixture,base62} from '../../analysis/game-city-water-v1/fixture.mjs';
import {plain} from '../../web/tests/helpers/legacy-game-session-fixture.mjs';
const api=process.env.MOLI_CONTEXT_BUILD?createRequire(import.meta.url)(resolve(process.env.MOLI_CONTEXT_BUILD)):sourceAPI;
const vectors=JSON.parse(readFileSync(new URL('../../analysis/game-work-context-v1/original-vectors.json',import.meta.url)));
const wire=r=>r.requests.map(c=>[c.operationId,...c.arguments.map(v=>v instanceof Uint8Array?Buffer.from(v).toString():v)]);
const reject=(fn,code)=>assert.throws(fn,{code});
test('independent source table arithmetic covers112 signed/unsigned overflow cases and35 eligibility bounds',()=>{
  for(const v of vectors.durations)assert.equal(api.legacyGameWorkDuration(v.base,v.tier,1,v.unsigned),v.duration,JSON.stringify(v));
  for(const v of vectors.gates)assert.equal(api.legacyGameWorkContextAvailable(v.tier,v.remaining),v.enabled);
  assert.equal(api.legacyGameWorkDuration(-13000,null,0),-13000);
  for(const slot of [0,7,14]){assert.equal(api.legacyGameWorkContextSlot(slot,0),slot);assert.equal(api.legacyGameWorkContextSlot(slot,1),slot+100);}
  reject(()=>api.legacyGameWorkDuration(6500,7,1),'LEGACY_WORK_CONTEXT_TIER');reject(()=>api.legacyGameWorkContextSlot(15,1),'LEGACY_WORK_CONTEXT_SLOT');
});
test('one skill owner tags recipe replies at receive time and uses current context for roster queries',()=>{
  const h=contextOwners(api);
  try{
    h.select(0);assert.deepEqual(wire(h.act('context')),[['send-004f7b50',2,3,61]]);
    const update=h.skills.apply('0x4f0290',null,bytes(header));assert.deepEqual(wire(update),[['send-004f6d00',100],['send-004f6d00',103]]);
    assert.equal(h.skills.copyCraft(0).contextMode,0);h.skills.applyCraft(0,bytes(craftRecipe(501)));
    assert.equal(h.skills.copyCraft(0).contextMode,1);assert.equal(h.skills.copyState().craftContextMode,1);
    h.skills.apply('0x4f0290',null,bytes('0|0||-1|-1|'));assert.equal(h.skills.copyCraft(0).contextMode,1);
    assert.equal(h.skills.copyCraft(0).recipes[0].fields[0],-1);
  }finally{h.close();}
});
test('toggle is gated by current tier,time,selected skill and source child-window phase',()=>{
  const h=contextOwners(api);
  try{
    h.select(1);
    for(const [tier,time] of [[0,600000],[7,600000],[3,0],[null,600000],[3,null]]){
      h.state.tier=tier;h.state.remainingMilliseconds=time;assert.equal(h.owner.copy().canToggleContext,false);reject(()=>h.act('context'),'LEGACY_CRAFT_CONTEXT');assert.equal(h.skills.craftContext(),0);
    }
    h.state.tier=3;h.state.remainingMilliseconds=600000;h.act('context');h.act('level',1);
    assert.equal(h.owner.copy().canToggleContext,false);reject(()=>h.act('context'),'LEGACY_CRAFT_CONTEXT');
    assert.deepEqual(wire(h.act('close')),[['send-004f7be0',2,3,0],['send-004f7b50',2,3,62]]);assert.equal(h.skills.craftContext(),0);
  }finally{h.close();}
});
test('mismatched recipes requery,stay disabled and return through levels;expiry refreshes active manufacture',()=>{
  const h=contextOwners(api);
  try{
    h.select(0);h.act('context');assert.deepEqual(wire(h.act('level',1)),[['send-004f6d00',100]]);
    assert.equal(h.owner.copy().recipesCurrent,false);reject(()=>h.act('recipe',0),'LEGACY_CRAFT_CONTEXT_WAIT');reject(()=>h.act('context'),'LEGACY_CRAFT_CONTEXT');
    h.act('levels-back');h.act('context');assert.deepEqual(wire(h.act('level',1)),[]);h.act('levels-back');h.act('context');h.act('level',1);
    h.skills.applyCraft(0,bytes(craftRecipe(501)));h.owner.refresh();assert.equal(h.owner.copy().recipesCurrent,true);
    h.act('recipe',0);h.assign(0,8);h.assign(1,9);assert.equal(h.owner.copy().cost,8);
    assert.deepEqual(wire(h.act('begin')),[['send-004f8940',8]]);assert.equal(h.owner.copy().durationMilliseconds,8500);
    h.state.remainingMilliseconds=0;assert.deepEqual(wire(h.owner.tick(2000)),[['send-004f7b50',2,3,62],['send-004f6d00',0]]);
    assert.equal(h.owner.copy().contextMode,0);assert.deepEqual(wire(h.owner.tick(9500)),[['send-004f7c70',0,1,-1,'501|8|9']]);
    assert.deepEqual(wire(h.owner.tick(9600)),[]);assert.equal(h.mp,1000);
  }finally{h.close();}
});
test('context raises repair/appraisal rank by one,scales timers and preserves cost and source byte0',()=>{
  for(const slot of [1,2]){
    const h=contextOwners(api);
    try{
      h.select(slot);h.act('level',1);reject(()=>h.target(slot===1?10:11),'LEGACY_CRAFT_ITEM');h.act('close');h.select(slot);h.act('context');h.act('level',1);h.target(slot===1?10:11);
      assert.equal(h.owner.copy().cost,30);assert.deepEqual(wire(h.act('begin')),[['send-004f8940',16]]);assert.equal(h.owner.copy().durationMilliseconds,16150);
      assert.deepEqual(wire(h.owner.tick(17150)),[['send-004f7c70',100+slot,0,slot===1?10:11,'']]);assert.equal(h.mp,1000);
    }finally{h.close();}
  }
  const h=contextOwners(api);
  try{h.select(3);h.act('context');h.act('level',1);h.assign(0,12);h.assign(1,13);assert.deepEqual(wire(h.act('begin')),[['send-004f8940',6]]);assert.equal(h.owner.copy().durationMilliseconds,6800);
    assert.deepEqual(wire(h.owner.tick(7800)),[['send-004f7c70',103,0,-1,'12|13']]);}
  finally{h.close();}
});
test('target query remains ordinary while final target and strict gathering requests use context slots',()=>{
  const h=contextOwners(api);
  try{
    h.select(6);h.act('context');assert.deepEqual(wire(h.act('level',1)),[['send-004f79b0',6]]);h.owner.receivePeople(bytes(''));
    assert.deepEqual(wire(h.act('person',0)),[['send-004f7a00',0]]);h.owner.receiveSubjects(bytes(''));
    assert.deepEqual(wire(h.act('subject',0)),[['send-004f7c70',106,1,0,'']]);h.act('close');
    h.select(5);h.act('context');assert.deepEqual(wire(h.act('level',1)),[['send-004f7be0',2,3,5]]);assert.equal(h.owner.copy().durationMilliseconds,5525);
    assert.deepEqual(wire(h.owner.tick(6525)),[]);assert.deepEqual(wire(h.owner.tick(6526)),[['send-004f7c70',105,1,-1,'']]);
    h.owner.receive(1,4,bytes('1|0|0|0|0|0|88|Ore|'),7000);h.owner.tick(9001);assert.equal(h.owner.copy().durationMilliseconds,3825);
  }finally{h.close();}
});
test('direct kind5 sends selected level without a pose,result fiction or MP change;ride child skips only MP guard',()=>{
  const h=contextOwners(api);
  try{
    h.select(7);h.mp=19;reject(()=>h.act('level',1),'LEGACY_CRAFT_REQUIREMENTS');assert.equal(h.owner.copy().phase,'levels');
    h.mp=20;assert.deepEqual(wire(h.act('level',1)),[['send-004f7c70',7,1,-1,'']]);assert.equal(h.owner.copy().phase,'levels');assert.equal(h.owner.copy().directRequestSent,true);assert.equal(h.mp,20);
    assert.equal(h.owner.receive(1,5,bytes('1|')).accepted,false);assert.equal(h.owner.receive(1,1,bytes('1|')).accepted,false);
    h.act('context');h.mp=0;reject(()=>h.act('level',1),'LEGACY_CRAFT_REQUIREMENTS');h.state.rideChild=true;
    assert.deepEqual(wire(h.act('level',1)),[['send-004f7c70',107,1,-1,'']]);assert.equal(h.owner.copy().result,null);assert.equal(h.owner.copy().deadline,null);assert.equal(h.mp,0);
  }finally{h.close();}
});
test('actual client/session owns context,recipe queries and direct requests on the existing connection',async()=>{
  const h=await cityFixture(api),{f}=h;
  try{
    const offer=await offerContextRecords(h,api),act=(a,v)=>f.client.actOnCraft(a,f.client.copyCraft().revision,v);
    await act('open');await act('skill',0);assert.equal(f.client.copyCraft().canToggleContext,true);await act('context');
    assert.equal(Buffer.from(plain(f.writes.at(-1)),'hex').toString(),'+5D 2 3 Z ');
    await act('level',1);assert.equal(Buffer.from(plain(f.writes.at(-1)),'hex').toString(),"'<4 1C ");
    assert.equal(f.client.copyCraft().recipesCurrent,false);await offer('@_i',[0],craftRecipe(501));assert.equal(f.client.copyCraft().recipesCurrent,true);
    await act('close');assert.equal(Buffer.from(plain(f.writes.at(-1)),'hex').toString(),'+5D 2 3 10 ');
    await act('open');await act('skill',7);await act('level',1);assert.equal(Buffer.from(plain(f.writes.at(-1)),'hex').toString(),'+>L 7 1 -1  ');
    assert.equal(f.client.copyCraft().phase,'levels');assert.equal(f.client.copyCraft().mp,1000);assert.equal(f.stats.opens,1);
    await offer('E(9',[],'8|0');await assert.rejects(()=>act('level',1),{code:'LEGACY_CRAFT_REQUIREMENTS'});
    const id=h.world.copyGameState().actors.localId;await offer('Hx!',[],base62(id)+'|2|3|70|0|100000|0|0,');
    assert.ok(h.world.copyGameState().actors.localActor.ride.child);await act('level',1);
    assert.equal(Buffer.from(plain(f.writes.at(-1)),'hex').toString(),'+>L 7 1 -1  ');assert.equal(f.client.copyCraft().mp,0);
    await act('close');await offer('Xz@',[0,0]);await act('open');await act('skill',7);assert.equal(f.client.copyCraft().canToggleContext,false);
  }finally{h.close();}
});
