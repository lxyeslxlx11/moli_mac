import test from 'node:test';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {resolve} from 'node:path';
import {readFileSync} from 'node:fs';
import * as sourceAPI from '../index.mjs';
import {craftOwners,bytes,craftRecipe,craftItems,offerCraftRecords} from '../../analysis/game-craft-input-v1/fixture.mjs';
import {cityFixture} from '../../analysis/game-city-water-v1/fixture.mjs';
import {plain} from '../../web/tests/helpers/legacy-game-session-fixture.mjs';
const api=process.env.MOLI_CRAFT_INPUT_BUILD?createRequire(import.meta.url)(resolve(process.env.MOLI_CRAFT_INPUT_BUILD)):sourceAPI;
const wire=r=>r.requests.map(c=>({id:c.operationId,args:c.arguments.map(v=>v instanceof Uint8Array?Buffer.from(v).toString():v)}));
const failure=(fn,code)=>assert.throws(fn,{code});
const reference=JSON.parse(readFileSync(new URL('../../analysis/game-craft-input-v1/original-vectors.json',import.meta.url)));

test('independent Python int32/unsigned reference covers cost overflow, negative/wrapped delays and all work poses',()=>{
  for(const v of reference.numericCases){
    const h=craftOwners(api);
    try{
      h.skills.apply('0x4f0290',null,bytes('3|220|Forge|1|2|3|4|1|1|'+v.multiplier+'|5|'));
      const row=craftRecipe().split('|');row[1]=v.recipeTime;row[5]=v.recipeCost;
      for(const at of [7,10,13,16,19])row[at]=-1;
      h.skills.applyCraft(3,bytes(row.join('|')));h.mp=2147483647;h.open();
      assert.equal(h.owner.copy().cost,v.cost);assert.equal(h.owner.copy().canBegin,true);
      assert.deepEqual(wire(h.act('begin',undefined,v.now)),[{id:'send-004f8940',args:[v.seconds]}]);
      assert.equal(h.owner.inspect().deadline,v.deadline);assert.equal(h.owner.inspect().durationMilliseconds,v.durationMilliseconds);
      assert.equal(h.owner.tick(v.now).requests.length,v.dueAtStart?1:0);
    }finally{h.close();}
  }
  for(const v of reference.poses){
    const h=craftOwners(api);
    try{
      h.skills.apply('0x4f0290',null,bytes('3|'+v.identifier+'|Forge|1|2|3|4|1|1|125|5|'));
      assert.equal(h.open().requests[0].arguments[2],v.pose);
      if([215,216].includes(v.identifier))failure(()=>h.assign(0,10),'LEGACY_CRAFT_MATERIAL');
    }finally{h.close();}
  }
});

test('normal skill/level/recipe selection uses source enable fields, poses, MP and six positions',()=>{
  const h=craftOwners(api);
  try{
    h.act('open');h.act('skill',3);
    failure(()=>h.act('level',1),'LEGACY_CRAFT_LEVEL');
    failure(()=>h.act('level',10),'LEGACY_CRAFT_INDEX');
    h.act('level',0);
    assert.deepEqual(wire(h.act('recipe',0)),[{id:'send-004f7be0',args:[2,3,9]}]);
    let s=h.owner.copy();assert.equal(s.cost,10);assert.equal(s.canBegin,false);
    assert.deepEqual(s.fulfilled,[false,false,true,true,true]);
    h.assign(4,8);h.assign(1,9);s=h.owner.copy();assert.equal(s.canBegin,true);
    h.mp=9;assert.equal(h.owner.copy().canBegin,false);
    failure(()=>h.act('begin'),'LEGACY_CRAFT_REQUIREMENTS');
    h.mp=10;assert.equal(h.owner.copy().canBegin,true);
  }finally{h.close();}
});

test('material description readiness, count0, optional category and pre-removal replacement are source rules',()=>{
  const h=craftOwners(api);
  try{
    h.open();
    const items=h.items.copyCraftRecords();assert.equal(items.find(r=>r.slot===8).hasDescription,true);
    assert.equal(items.find(r=>r.slot===12).hasDescription,false);
    assert.equal(items.find(r=>r.slot===13).hasDescription,false);
    failure(()=>h.assign(0,12),'LEGACY_CRAFT_ITEM');
    failure(()=>h.assign(0,13),'LEGACY_CRAFT_ITEM');
    h.assign(4,8);h.assign(1,9);h.assign(0,10);
    assert.equal(h.owner.copy().positions[1].quantity,1);
    failure(()=>h.assign(2,8),'LEGACY_CRAFT_ITEM_USED');
    failure(()=>h.assign(4,11),'LEGACY_CRAFT_MATERIAL');
    h.act('remove',4);h.assign(4,11);h.act('swap',{from:4,to:3});
    assert.equal(h.owner.copy().positions[3].group,0);
    assert.equal(h.owner.copy().canBegin,true);
  }finally{h.close();}
});

test('owned CRT delay emits7ba then exactly one+>L with required positions before optional positions',()=>{
  const h=craftOwners(api);
  try{
    h.open();
    for(const step of reference.materialSteps){
      h.assign(step.position,step.slot);const snapshot=h.owner.copy();
      assert.deepEqual(snapshot.positions.map(p=>p?.group??null),step.expectedGroups);
      assert.deepEqual(snapshot.fulfilled,step.fulfilled);
    }
    assert.deepEqual(wire(h.act('begin',undefined,1000)),[{id:'send-004f8940',args:[10]}]);
    assert.equal(h.owner.inspect().deadline,11000);
    assert.deepEqual(wire(h.owner.tick(10999)),[]);
    assert.deepEqual(wire(h.owner.tick(11000)),[{id:'send-004f7c70',args:[3,0,-1,reference.submission]}]);
    assert.deepEqual(wire(h.owner.tick(11000)),[]);assert.deepEqual(wire(h.owner.tick(12000)),[]);
    assert.equal(h.owner.copy().phase,'awaiting');
    failure(()=>h.act('begin'),'LEGACY_CRAFT_PHASE');
  }finally{h.close();}
});

test('source unsigned deadline comparison, cancellation and return to the same position never replay',()=>{
  const h=craftOwners(api);
  try{
    h.open();h.assign(0,8);h.assign(1,9);h.act('begin',undefined,0xffffff00);
    assert.deepEqual(wire(h.owner.tick(0xffffff00)),[{id:'send-004f7c70',args:[3,0,-1,'700|8|9']}]);
    assert.deepEqual(wire(h.act('close')), [{id:'send-004f7be0',args:[2,3,0]}]);
    assert.deepEqual(wire(h.owner.tick(12000)),[]);
    h.open();h.assign(0,8);h.assign(1,9);h.act('begin');
    h.location={display:[3,3],position:[191,192]};assert.equal(h.owner.tick(1001).requests.length,0);
    h.location={display:[3,3],position:[192,192]};assert.equal(h.owner.tick(1002).requests[0].arguments[2],0);
    assert.equal(h.owner.copy().active,false);assert.deepEqual(wire(h.owner.tick(20000)),[]);
  }finally{h.close();}
});

test('server result owns copied bounded text, renders success/failure, retries without mutating items/MP',()=>{
  const h=craftOwners(api);
  try{
    h.open();h.assign(0,8);h.assign(1,9);h.act('begin');h.owner.tick(11000);
    const before=h.items.copySlots(),raw=bytes('15|999|1|2|3|4|1|88|Copper|Wood|Extra1|Extra2|Extra3|Extra4|');
    assert.equal(h.owner.receive(1,1,raw).accepted,true);raw.fill(0);
    let s=h.owner.copy();assert.equal(s.result.success,true);assert.equal(s.result.graphicIndex,88);
    assert.equal(s.result.lostItemNames.length,3);assert.equal(s.result.injuryVisible,false);
    s.result.lostItemNames[0].fill(0);assert.equal(Buffer.from(h.owner.copy().result.lostItemNames[0]).toString(),'Copper');
    assert.deepEqual(h.items.copySlots(),before);assert.equal(h.owner.copy().mp,1000);
    h.act('retry');assert.equal(h.owner.copy().phase,'materials');assert.equal(h.owner.copy().canBegin,false);
    h.owner.receive(0,1,bytes('0|0|0|0|0|0|0|123|'));
    s=h.owner.copy();assert.equal(s.result.success,false);assert.equal(s.result.graphicIndex,0);
    h.act('close');assert.equal(h.owner.receive(1,1,bytes('0|0|0|0|0|0|0|1|')).accepted,false);
    assert.equal(h.owner.copy().active,false);
  }finally{h.close();}
});

test('recipe reordering retains id, stale controls and skill removal cannot leave timed work alive',()=>{
  const h=craftOwners(api);
  try{
    h.open();const revision=h.owner.inspect().revision;
    h.skills.applyCraft(3,bytes(craftRecipe(701)+craftRecipe(700)));h.owner.refresh();
    assert.equal(h.owner.copy().recipe.index,1);
    failure(()=>h.owner.prepare('remove',revision,0,1000),'LEGACY_CRAFT_STALE');
    h.assign(0,8);h.assign(1,9);h.act('begin');
    h.skills.apply('0x4f0290',null,bytes('3|0||-1|-1|'));h.owner.refresh();
    assert.equal(h.owner.copy().active,false);assert.deepEqual(wire(h.owner.tick(20000)),[]);
    h.owner.close();h.owner.close();failure(()=>h.owner.copy(),'LEGACY_CRAFT_CLOSED');
  }finally{h.close();}
});

test('actual ordinary client/runtime sends work requests, gates movement, accepts Lor and cancels on scene replacement',async()=>{
  const h=await cityFixture(api),{f,world}=h;
  try{
    const offer=await offerCraftRecords(h,api);
    await f.drive(()=>f.client.copyCraft().skills.length===1&&f.client.copyInventory().filter(r=>r.present).length===6);
    const act=(a,v)=>f.client.actOnCraft(a,f.client.copyCraft().revision,v);
    await act('open');await act('skill',3);await act('level',0);await act('recipe',0);
    assert.equal(f.client.inspect().canReturnToCity,false);
    const item=slot=>f.client.copyCraft().items.find(r=>r.slot===slot);
    await act('assign',{position:4,...item(8)});await act('assign',{position:1,...item(9)});await act('assign',{position:0,...item(10)});
    await act('begin');
    assert.equal(Buffer.from(plain(f.writes.at(-1)),'hex').toString(),'7ba a ');
    failure(()=>world.requestLocalDestination([4,3]),'LEGACY_CRAFT_CONTEXT');
    const pending=f.writes.length;
    const runtime=f.client.runtime();const {camera,...request}=h.request;const frame={...request,input:JSON.parse(JSON.stringify(f.material.context.input)),graphicsMode:0,forceRender:false};
    const pump=runtime.pump({...frame,tick:f.client.copyCraft().deadline});
    assert.equal(pump.error,null);assert.equal(pump.requests.filter(r=>r.operationId==='send-004f7c70').length,1);
    await f.client.session().sendCommands(pump.requests);
    assert.equal(f.writes.length,pending+1);
    assert.equal(Buffer.from(plain(f.writes.at(-1)),'hex').toString(),'+>L 3 0 -1 700|9|8|10 ');
    await offer('Lor',[1,1],'15|0|1|2|0|0|0|88|');
    assert.equal(f.client.copyCraft().phase,'result');assert.equal(f.client.copyCraft().result.skillExperience,15);
    await act('retry');await act('assign',{position:0,...item(8)});await act('assign',{position:1,...item(9)});await act('begin');
    await h.send(h.scene(40001));assert.equal(f.client.copyCraft().active,false);
    assert.equal(f.client.inspect().state,'preparing-scene');
    await offer('Lor',[1,1],'15|0|0|0|0|0|0|88|');assert.equal(f.client.copyCraft().active,false);
  }finally{h.close();}
  assert.equal(world.copyGameState().craft,undefined);
  assert.equal(world.inspect().state,'closed');
});
