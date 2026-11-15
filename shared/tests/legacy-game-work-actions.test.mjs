import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createRequire} from 'node:module';
import {resolve} from 'node:path';
import * as sourceAPI from '../index.mjs';
import {workOwners,bytes,itemRow,skillRow,knownProducts,offerWorkRecords} from '../../analysis/game-work-actions-v1/fixture.mjs';
import {cityFixture} from '../../analysis/game-city-water-v1/fixture.mjs';
import {plain} from '../../web/tests/helpers/legacy-game-session-fixture.mjs';
const api=process.env.MOLI_WORK_BUILD?createRequire(import.meta.url)(resolve(process.env.MOLI_WORK_BUILD)):sourceAPI;
const vectors=JSON.parse(readFileSync(new URL('../../analysis/game-work-actions-v1/original-vectors.json',import.meta.url)));
const wire=r=>r.requests.map(c=>({id:c.operationId,args:c.arguments.map(v=>v instanceof Uint8Array?Buffer.from(v).toString():v)}));
const reject=(fn,code)=>assert.throws(fn,{code});

test('independent reference covers60 item predicates and13 mark byte/blank/DBCS boundaries',()=>{
  for(const v of vectors.itemCases)assert.equal(api.legacyGameWorkItemEligible(v.mode,v.item,v.rank),v.eligible,JSON.stringify(v));
  for(const v of vectors.marks){
    const raw=Uint8Array.from(Buffer.from(v.hex,'hex'));
    if(v.accepted){const copy=api.legacyGameWorkMark(raw,v.allowEmpty);assert.deepEqual(copy,raw);copy.fill(0);}
    else assert.throws(()=>api.legacyGameWorkMark(raw,v.allowEmpty));
  }
});

test('repair/appraisal preserve item-rank cost,source byte0 and signed timer boundaries independently of selected level',()=>{
  for(const v of vectors.timers){
    const h=workOwners(api);
    try{
      h.skills.apply('0x4f0290',null,bytes(skillRow(1,217,2,'Weapon repair',2147483647)));
      h.items.apply(bytes(itemRow(8,'Sword',0,v.level)));h.mp=2147483647;
      assert.deepEqual(wire(h.open(1,1)),[{id:'send-004f7be0',args:[2,3,12]}]);
      h.target(8);assert.equal(h.owner.copy().cost,v.cost);
      assert.deepEqual(wire(h.act('begin',undefined,v.now)),[{id:'send-004f8940',args:[v.seconds]}]);
      assert.equal(h.owner.inspect().deadline,v.deadline);assert.equal(h.owner.inspect().durationMilliseconds,v.duration);
      assert.deepEqual(wire(h.owner.tick(v.deadline)),[{id:'send-004f7c70',args:[1,0,8,'']}]);
      assert.deepEqual(wire(h.owner.tick(v.deadline)),[]);
    }finally{h.close();}
  }
});

test('weapon/armor/appraisal selections use inverse description and rank checks with current MP',()=>{
  for(const [slot,accepted,blocked] of [[1,8,14],[2,14,8],[3,9,8]]){
    const h=workOwners(api);
    try{
      h.open(slot);reject(()=>h.target(blocked),'LEGACY_CRAFT_ITEM');reject(()=>h.target(15),'LEGACY_CRAFT_ITEM');
      h.target(accepted);h.mp=9;assert.equal(h.owner.copy().canBegin,false);
      reject(()=>h.act('begin'),'LEGACY_CRAFT_REQUIREMENTS');h.mp=10;assert.equal(h.owner.copy().canBegin,true);
      const row=h.items.copyCraftRecords().find(i=>i.slot===accepted);
      reject(()=>h.act('target',{slot:accepted,revision:row.revision-1}),'LEGACY_CRAFT_ITEM');
    }finally{h.close();}
  }
});

test('engraving is immediate,retains original text bytes,clears prior400 marks and never consumes a timer draw',()=>{
  const h=workOwners(api);
  try{
    assert.equal(h.open(4).requests[0].arguments[2],9);reject(()=>h.target(16),'LEGACY_CRAFT_ITEM');h.target(10);
    assert.equal(h.owner.copy().cost,10);assert.equal(h.owner.copy().canBegin,false);
    h.act('mark',bytes('Original mark'));
    assert.deepEqual(wire(h.act('begin')),[{id:'send-004f7c70',args:[4,0,10,'Original mark']}]);
    h.owner.receive(1,2,bytes('5|99|1|2|3|4|0|'));assert.equal(h.owner.copy().target.slot,10);
    h.act('retry');h.items.apply(bytes(itemRow(10,'Ring',22,1,'Identified',0x700)));h.owner.refresh();h.target(10);
    assert.equal(h.owner.copy().canBegin,true);
    assert.deepEqual(wire(h.act('begin')),[{id:'send-004f7c70',args:[4,0,10,'']}]);
    h.act('close');h.open(1);h.target(8);
    assert.deepEqual(wire(h.act('begin')),[{id:'send-004f8940',args:[13]}]);
    assert.equal(h.owner.copy().phase,'working');
  }finally{h.close();}
});

test('decoration finds all56 products beyond a prefix hole and resets only through the owning skill',()=>{
  const h=workOwners(api);
  try{
    assert.equal(h.skills.copyCraft(0).recipes[0].fields[0],-1);assert.equal(h.skills.knowsCraftProduct(501),true);
    assert.equal(h.skills.knowsCraftProduct(999),false);h.open(5);
    reject(()=>h.assign(0,13),'LEGACY_CRAFT_MATERIAL');h.assign(4,11);h.assign(0,12);
    assert.equal(h.owner.copy().canBegin,true);h.mp=99;assert.equal(h.owner.copy().canBegin,false);h.mp=100;
    assert.deepEqual(wire(h.act('begin')),[{id:'send-004f8940',args:[8]}]);
    assert.deepEqual(wire(h.owner.tick(9000)),[{id:'send-004f7c70',args:[5,0,-1,'11|12']}]);
    h.owner.receive(1,1,bytes('10|0|1|0|1|0|0|88|Gem|'));assert.equal(h.owner.copy().phase,'result');
    assert.equal(Buffer.from(h.owner.copy().result.subjectNameBytes).toString(),'Base charm');
    h.act('close');h.open(1);h.target(8);assert.equal(h.act('begin').requests[0].arguments[0],13);
    h.act('close');h.skills.apply('0x4f0290',null,bytes('0|0||-1|-1|'));assert.equal(h.skills.knowsCraftProduct(501),false);
  }finally{h.close();}
});

test('decoration replacement frees the old position before quota checks;swaps and current inventory invalidation stay owned',()=>{
  const h=workOwners(api);
  try{
    h.items.apply(bytes(itemRow(17,'Spare base',0,1,'Identified',0x800,501)+itemRow(18,'Spare gem',39)));
    h.open(5);h.assign(4,11);h.assign(0,12);h.assign(4,17);assert.equal(h.owner.copy().positions[4].slot,17);
    reject(()=>h.assign(4,18),'LEGACY_CRAFT_MATERIAL');assert.equal(h.owner.copy().positions[4],null);
    h.assign(4,11);h.act('swap',{from:4,to:2});assert.equal(h.owner.copy().positions[2].group,0);
    h.items.apply(bytes(itemRow(11,'Changed base',0,1,'Identified',0,501)));h.owner.refresh();
    assert.equal(h.owner.copy().positions[2],null);assert.equal(h.owner.copy().canBegin,false);
  }finally{h.close();}
});

test('kind2 result owns seven fields and copied subject without changing inventory/MP;closed and wrong-kind results do not open work',()=>{
  const h=workOwners(api);
  try{
    h.open(1);h.target(8);h.act('begin');const before=h.items.copySlots();
    assert.equal(h.owner.receive(1,4,bytes('1|')).accepted,false);
    const raw=bytes('15|99|1|2|3|4|1|ignored|');h.owner.receive(-1,2,raw);raw.fill(0);
    const snapshot=h.owner.copy();assert.equal(snapshot.result.success,true);assert.equal(snapshot.result.rawFields.length,7);
    assert.equal(snapshot.target,null);assert.equal(snapshot.cost,10);assert.equal(snapshot.mp,1000);assert.deepEqual(h.items.copySlots(),before);
    snapshot.result.subjectNameBytes.fill(0);assert.equal(Buffer.from(h.owner.copy().result.subjectNameBytes).toString(),'Sword');
    h.act('retry');assert.equal(h.owner.copy().target,null);assert.equal(h.owner.copy().canBegin,false);
    h.target(8);h.owner.receive(0,2,bytes('0|0|0|0|0|0|0|'));assert.equal(h.owner.copy().target.slot,8);
    h.act('close');assert.equal(h.owner.receive(1,2,bytes('1|')).accepted,false);assert.equal(h.owner.copy().active,false);
  }finally{h.close();}
});

test('actual ordinary client and existing session dispatch kind2,engraving and decoration with scene cancellation on one connection',async()=>{
  const h=await cityFixture(api),{f}=h;
  try{
    const offer=await offerWorkRecords(h,api);const act=(a,v)=>f.client.actOnCraft(a,f.client.copyCraft().revision,v);
    const open=async slot=>{await act('open');await act('skill',slot);await act('level',1);};
    const target=async slot=>{const row=f.client.copyCraft().items.find(i=>i.slot===slot);await act('target',{slot,revision:row.revision});};
    await open(4);await target(10);await act('mark',bytes('Original mark'));await act('begin');
    assert.equal(Buffer.from(plain(f.writes.at(-1)),'hex').toString(),'+>L 4 0 a Original\\Smark ');
    await offer('Lor',[1,2],'10|0|1|0|1|0|0|');assert.equal(f.client.copyCraft().phase,'result');
    await act('close');await open(5);
    for(const [position,slot] of [[4,11],[0,12]]){const row=f.client.copyCraft().items.find(i=>i.slot===slot);await act('assign',{position,slot,revision:row.revision});}
    await act('begin');assert.equal(Buffer.from(plain(f.writes.at(-1)),'hex').toString(),'7ba 8 ');
    await h.send(h.scene(40001));assert.equal(f.client.copyCraft().active,false);
    await offer('Lor',[1,1],'10|0|1|0|1|0|0|88|');assert.equal(f.client.copyCraft().active,false);
    assert.equal(f.client.session().inspect().io.opensCompleted,1);
  }finally{h.close();}
});
