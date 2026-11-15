import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createRequire} from 'node:module';
import {resolve} from 'node:path';
import * as sourceAPI from '../index.mjs';
import {targetOwners,bytes,itemRow,context,peopleWire,subjectWire,offerTargetRecords} from '../../analysis/game-work-targets-v1/fixture.mjs';
import {cityFixture} from '../../analysis/game-city-water-v1/fixture.mjs';
import {plain} from '../../web/tests/helpers/legacy-game-session-fixture.mjs';
const api=process.env.MOLI_TARGET_BUILD?createRequire(import.meta.url)(resolve(process.env.MOLI_TARGET_BUILD)):sourceAPI;
const vectors=JSON.parse(readFileSync(new URL('../../analysis/game-work-targets-v1/original-vectors.json',import.meta.url)));
const wire=r=>r.requests.map(c=>({id:c.operationId,args:c.arguments.map(v=>v instanceof Uint8Array?Buffer.from(v).toString():v)}));
const text=b=>Buffer.from(b).toString();

test('independent ordinary modes,cost overflow and unsigned strict gathering clock vectors',()=>{
  for(const v of vectors.modeCases)assert.equal(api.legacyGameTargetWorkMode({present:true,fields:{0x2c:v.kind,0x30:v.identifier}}),v.mode);
  for(const v of vectors.costs)assert.equal(api.legacyGamePlayerSkillCost(v.main,v.level),v.cost);
  for(const v of vectors.clocks)assert.equal(api.legacyGameGatherDeadline(v.tick,v.initial),v.deadline);
});
test('primary choices preserve source self,party holes,server order,disguise terminator and ten-row bound',()=>{
  const c=context(),rows=api.decodeLegacyGameWorkPeople('first-aid',bytes(peopleWire),c);
  assert.deepEqual(rows.map(r=>[r.index,r.type,text(r.nameBytes)]),[[0,0,'Local hero'],[1,1,'Party ally'],[2,1,''],[3,2,'Remote person'],[4,3,'Direct person'],[5,3,'Other person']]);
  assert.deepEqual(api.decodeLegacyGameWorkPeople('disguise',bytes(peopleWire),c).map(r=>[r.index,r.type,text(r.nameBytes)]),[[0,1,'Party ally'],[1,1,''],[2,2,'Remote person']]);
  assert.equal(api.decodeLegacyGameWorkPeople('treatment',bytes('A|0|'.repeat(20)),c).length,10);
  assert.throws(()=>api.decodeLegacyGameWorkPeople('first-aid',bytes('A'.repeat(17)+'|0|'),c),{code:'LEGACY_WORK_TARGET_NAME'});
  rows[0].nameBytes.fill(0);assert.equal(text(c.self.nameBytes),'Local hero');
});
test('secondary local pets use compressed ordinals;transform and external seven-field rows retain wire indices',()=>{
  const c=context();
  for(const v of vectors.localSubjects){const r=api.decodeLegacyGameWorkSubjects(v.mode,{type:0},bytes('ignored'),c);
    assert.deepEqual(r.map(s=>s.index),v.indices);assert.deepEqual(r.map(s=>s.wireIndex),v.wire);assert.deepEqual(r.map(s=>text(s.nameBytes)),v.names);}
  const r=api.decodeLegacyGameWorkSubjects('transform',{type:2},bytes(subjectWire),c);
  assert.deepEqual(r.map(s=>[s.index,s.wireIndex,s.type,text(s.nameBytes),...s.rawFields]),[[0,1,6,'Remote pet',10,2,30,80,12,20]]);
});
test('real owner queries targets,uses selected level and source pet ordinal without timer or optimistic MP',()=>{
  const h=targetOwners(api);
  try{
    h.mp=19;assert.throws(()=>h.open(2),{code:'LEGACY_CRAFT_REQUIREMENTS'});assert.equal(h.owner.copy().phase,'levels');
    h.mp=20;assert.deepEqual(wire(h.act('level',1)),[{id:'send-004f79b0',args:[2]}]);
    assert.deepEqual(wire(h.people()),[{id:'send-004f7be0',args:[2,3,13]}]);
    assert.deepEqual(wire(h.act('person',0)),[{id:'send-004f7a00',args:[0]}]);h.subjects();
    assert.deepEqual(wire(h.act('subject',1)),[{id:'send-004f7c70',args:[2,1,1,'']}]);
    h.owner.receive(1,3,bytes('10|99|1|2|3|4|15|'));assert.equal(h.owner.copy().mp,20);assert.equal(h.owner.copy().result.recoveryValue,15);
    assert.equal(text(h.owner.copy().result.subjectNameBytes),'Fox');assert.deepEqual(wire(h.act('retry')),[{id:'send-004f79b0',args:[2]}]);
  }finally{h.close();}
});
test('direct people,back,retry and copied results stay with the current selected owner',()=>{
  const h=targetOwners(api);
  try{
    h.open(0);h.people();assert.deepEqual(wire(h.act('person',2)),[{id:'send-004f7c70',args:[0,1,2,'']}]);
    h.owner.receive(0,3,bytes('1|0|0|0|0|0|0|'));assert.equal(h.owner.copy().result.outcome,'failure');h.act('close');
    h.open(3);h.people();h.act('person',3);h.subjects();assert.deepEqual(wire(h.act('people-back')),[{id:'send-004f79b0',args:[3]}]);
    h.people();assert.deepEqual(wire(h.act('person',4)),[{id:'send-004f7c70',args:[3,1,4,'']}]);
    h.owner.receive(1,3,bytes('1|0|0|0|0|0|4|'));const saved=h.owner.copy();saved.result.subjectNameBytes.fill(0);
    assert.equal(text(h.owner.copy().result.subjectNameBytes),'Direct person');h.mp=0;assert.equal(h.owner.copy().canRetry,false);
    assert.throws(()=>h.act('retry'),{code:'LEGACY_CRAFT_REQUIREMENTS'});
  }finally{h.close();}
});
test('kind3 final outcome is mode-specific HP/health/soul state across72 independent cases',()=>{
  for(const v of vectors.outcomes){const r=api.decodeLegacyGameTargetWorkResult(v.mode,v.status,bytes('10|99|1|2|-3|4|'+v.value+'|'));
    assert.equal(r.outcome,v.outcome);assert.equal(r.recoveryValue,v.value);assert.equal(r.injuryVisible,false);assert.equal(r.dexterityDelta,-3);}
  const r=api.decodeLegacyGameGatherResult(0,bytes('999|999|999|999|999|999|999|Fake|'));
  assert.equal(r.skillExperience,0);assert.equal(r.skillLevelUp,false);assert.equal(r.graphicIndex,-1);assert.equal(r.foundNameBytes.length,0);
  assert.equal(text(api.decodeLegacyGameGatherResult(1,bytes('1|0|0|0|0|0|88|'+'A'.repeat(29)+'|')).foundNameBytes),'???');
});
test('all six gathering identifiers use6500ms initial wait,strict greater-than and no7ba',()=>{
  for(const [slot,pose] of [[4,5],[5,7],[6,6],[7,5],[8,7],[9,6]]){
    const h=targetOwners(api);
    try{assert.deepEqual(wire(h.open(slot)),[{id:'send-004f7be0',args:[2,3,pose]}]);
      assert.equal(h.owner.copy().durationMilliseconds,6500);assert.deepEqual(wire(h.owner.tick(7500)),[]);
      assert.deepEqual(wire(h.owner.tick(7501)),[{id:'send-004f7c70',args:[slot,1,-1,'']}]);assert.deepEqual(wire(h.owner.tick(9000)),[]);
    }finally{h.close();}
  }
});
test('gathering repeats after2000+4500ms,rechecks MP and free bag,pause/resume and wrapping stay source-shaped',()=>{
  const h=targetOwners(api);
  try{
    h.open(4);h.owner.tick(7501);h.owner.receive(1,4,bytes('15|99|1|1|2|3|88|Local ore|'),8000);
    assert.equal(h.owner.copy().gatherContinuing,true);assert.equal(text(h.owner.copy().result.foundNameBytes),'Local ore');
    assert.equal(h.owner.copy().canRetry,false);assert.throws(()=>h.act('retry'),{code:'LEGACY_CRAFT_PHASE'});
    h.owner.tick(10000);assert.equal(h.owner.copy().phase,'result');h.owner.tick(10001);assert.equal(h.owner.copy().deadline,14501);
    assert.deepEqual(wire(h.owner.tick(14501)),[]);assert.deepEqual(wire(h.owner.tick(14502)),[{id:'send-004f7c70',args:[4,1,-1,'']}]);
    h.act('pause');h.owner.receive(0,4,bytes('ignored'),15000);h.owner.tick(17001);assert.equal(h.owner.copy().phase,'paused');
    h.mp=19;assert.equal(h.owner.copy().canRetry,false);h.mp=1000;
    h.items.apply(bytes(Array.from({length:20},(_,i)=>itemRow(8+i,'Item'+i,0)).join('')));assert.equal(h.owner.copy().canRetry,false);
    h.items.apply(bytes(itemRow(8,'',0)));assert.equal(h.owner.copy().canRetry,true);h.act('retry',undefined,0xffffffff-1000);
    assert.equal(h.owner.copy().deadline,3499);assert.deepEqual(wire(h.owner.tick(0xffffffff-999)),[{id:'send-004f7c70',args:[4,1,-1,'']}]);
    h.owner.receive(1,4,bytes('1|0|0|0|0|0|88|Ore|'),100);h.mp=0;h.owner.tick(2101);assert.equal(h.owner.copy().phase,'paused');
  }finally{h.close();}
});
test('closed,stale,wrong-kind and moved-scene work never creates another request or reopens choices',()=>{
  const h=targetOwners(api);
  try{
    h.open(1);h.people();h.act('person',0);h.subjects();assert.equal(h.owner.copy().subjects[0].wireIndex,1);
    assert.equal(h.owner.receive(1,2,bytes('1|0|0|0|0|0|0|')).accepted,false);
    const rev=h.owner.inspect().revision;h.owner.refresh();assert.throws(()=>h.owner.prepare('subject',rev,0,1000),{code:'LEGACY_CRAFT_STALE'});
    h.act('close');assert.equal(h.people().accepted,false);assert.equal(h.owner.receive(1,3,bytes('1|0|0|0|0|0|0|')).accepted,false);
    h.open(4);h.location={display:[3,3],position:[192,192]};assert.deepEqual(wire(h.owner.tick(2000)),[{id:'send-004f7be0',args:[3,3,0]}]);
    assert.equal(h.owner.copy().active,false);assert.deepEqual(wire(h.owner.tick(99999)),[]);assert.equal(h.owner.receive(1,4,bytes('ignored'),3000).accepted,false);
  }finally{h.close();}
});
test('actual client/session dispatches KxC pose,L<% and kind3;scene transition retires gathering on one connection',async()=>{
  const h=await cityFixture(api),f=h.f;
  try{
    const offer=await offerTargetRecords(h,api),act=(a,v)=>f.client.actOnCraft(a,f.client.copyCraft().revision,v);
    await act('open');await act('skill',2);await act('level',1);assert.equal(Buffer.from(plain(f.writes.at(-1)),'hex').toString(),' *[c 2 '.trimStart());
    await offer('KxC',[],peopleWire);await f.drive(()=>f.client.copyCraft().phase==='people'&&Buffer.from(plain(f.writes.at(-1)),'hex').toString()===':J@ 2 3 d ');
    await act('person',1);assert.equal(Buffer.from(plain(f.writes.at(-1)),'hex').toString(),'*^X 1 ');await offer('L<%',[],subjectWire);
    await act('subject',1);assert.equal(Buffer.from(plain(f.writes.at(-1)),'hex').toString(),'+>L 2 1 1  ');
    await offer('Lor',[1,3],'10|0|1|1|2|3|15|');assert.equal(f.client.copyCraft().result.recoveryValue,15);
    await act('close');await act('open');await act('skill',4);await act('level',1);assert.equal(f.client.copyCraft().phase,'working');
    await h.send(h.scene(40001));assert.equal(f.client.copyCraft().active,false);await offer('Lor',[1,4],'15|0|1|1|2|3|88|Ore|');assert.equal(f.client.copyCraft().active,false);
    assert.equal(f.client.session().inspect().io.opensCompleted,1);
  }finally{h.close();}
});
