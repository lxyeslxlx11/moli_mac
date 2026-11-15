import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import * as api from '../index.mjs';
import {sharedFixture,sharedMotion} from '../../analysis/game-battle-shared-storage-v1/fixture.mjs';
import {transformationAssets,transformationField,transformationMotion} from '../../analysis/game-battle-shared-storage-v1/recovery-fixture.mjs';

const assets=JSON.parse(readFileSync(new URL('../../analysis/game-battle-shared-storage-v1/original-fixtures.json',import.meta.url)));
const transformed=transformationAssets(assets);
const bytes=(array,end)=>Array.from(array.slice(0,end));
const text=bytes=>String.fromCharCode(...bytes);
const node=(s,id)=>s.playback.nodes.find(n=>n.id===id);
const bodyNode=(s,slot)=>s.playback.nodes.find(n=>n.kind==='body'&&n.slot===slot&&!n.deleted);
const skill404=(destination,code=40401)=>sharedMotion('SKL',[code,99,7,0,0,destination,0,'First',100120,0,123,40,100,8,10,0,
  'Second',100121,456,70,100,10,10,0,10,1,12,255]);
const slotState=(state,slot)=>{const b=state.bodies.bodies[slot];return [b.state,b.busy,b.tupleRead,b.vitals[0],b.vitals[2]];};

test('the same-slot SKL404 keeps both registration events and waits for the 7201st actual busy check',async()=>{
  const f=await sharedFixture(api,assets,{mounts:[0]});
  try{
    f.load(skill404(0));
    assert.equal(f.drain(330),null);
    const state=f.owner.copyState(),pair=state.playback.attachedRID.handoffs[0];
    assert.equal(pair.complete,true);
    assert.equal(state.playback.attachedRID.registry[0],pair.firstId);
    assert.ok(!node(state,pair.sourceId)&&!node(state,pair.secondId)&&!node(state,pair.id));
    assert.deepEqual(f.events.filter(e=>e.kind==='battle-skill404-registered').map(e=>[e.slot,text(e.nameBytes)]),
      [[0,'Second'],[0,'First']]);
    let result;
    for(let i=331;i<=7202;i++){
      result=f.owner.callCallbacks(f.context);
      const wait=result.commands[0]?.wait;
      assert.equal(wait?.counter,i-2);
      assert.deepEqual(wait.recovered,[]);
    }
    result=f.owner.callCallbacks(f.context);
    assert.deepEqual(result.commands[0].wait,{ready:false,counter:0,recovered:[0,10],repositioned:null});
    const recovery=f.owner.copyState();
    assert.deepEqual([0,10].map(slot=>bytes(recovery.bodies.bodies[slot].actions,3)),[[11,38,-1],[11,38,-1]]);
    assert.deepEqual(slotState(recovery,10),[38,1,0,70,10]);
    for(const expected of [231,0]){
      f.owner.callCallbacks(f.context);
      assert.equal(f.owner.copyState().bodies.bodies[10].state,expected);
    }
    result=f.owner.callCallbacks(f.context);
    assert.equal(result.commands[0].kind,'command-released');
    result=f.owner.callCallbacks(f.context);
    assert.equal(result.manager.kind,'battle-round-drained');
    assert.equal(result.manager.roundCounter,1);
    assert.deepEqual(slotState(f.owner.copyState(),0),[0,0,0,40,8]);
    assert.deepEqual(slotState(f.owner.copyState(),10),[0,0,0,70,10]);

    f.load(sharedMotion('PSN',[0,0,10,0,5]));
    const next=f.drain(250);
    assert.equal(next?.out.manager.roundCounter,2);
    assert.equal(next.state.bodies.bodies[10].vitals[0],65);
  }finally{f.close();}
});

test('SKL404 writes the occupied target slot before its 227 hit and retires the prior object on entry cleanup',async()=>{
  const f=await sharedFixture(api,assets,{mounts:[0]});
  try{
    const displaced=bodyNode(f.owner.copyState(),10).id;
    f.load(skill404(10,40491));
    f.step();
    assert.equal(f.step().out.commands[0].level,1);
    const final=f.drain(330);
    assert.ok(final);
    const state=final.state,handoff=state.playback.attachedRID.handoffs[0];
    assert.equal(state.playback.attachedRID.registry[10],handoff.secondId);
    assert.equal(node(state,displaced).deleted,false);
    const bodies=state.playback.attachedRID.bodies;
    assert.equal(bodies.find(r=>r.id===displaced).body.vitals[0],70);
    assert.equal(bodies.find(r=>r.id===handoff.secondId).body.vitals[0],58);
    assert.deepEqual(f.events.filter(e=>e.kind==='battle-vital').map(e=>[e.slot,e.before,e.value]),[[10,70,58]]);
    f.owner.beginEntry();
    f.owner.callCallbacks(f.context);
    assert.equal(f.owner.copyState().playback.nodes.length,0);
  }finally{f.close();}
});

test('SKL405 preflight retains all ten level tiers and three exact tuples per target',()=>{
  const living={vitals:[70,100,10,10],unmodeledCharacterMask:0};
  for(let tens=0;tens<10;tens++)for(let level=0;level<10;level++){
    const raw=transformationMotion({code:40500+10*tens+level,
      targets:[[10,-123,100120,100121,100114],[50,234,100121,0,0]]});
    const command=api.decodeLegacyGameBattleMotion(raw).commands[0];
    assert.equal(command.dependencyMask,(1<<0)|(1<<10)|(1<<20));
    assert.equal(command.nextOffset,raw.length);
    const plan=api.planBattleCasting(command,()=>living,0,0);
    assert.equal(plan.category,405);
    assert.equal(plan.level,level);
    assert.deepEqual(plan.rows[0].actions,[24,53,38,135,62]);
    assert.deepEqual(plan.rows[0].tuples,[[0,0,0,transformationField],
      [10,0,-123,100120],[10,0,100120,100121],[10,0,100114,0],
      [20,0,234,100121],[20,0,100121,0],[20,0,0,0],[-1,0,0,0]]);
    const tier=level<3?3:level<6?2:level<9?1:0;
    assert.deepEqual(plan.resources,{chant:0x1ade4+tier,projectile:0x1addc+tier,group:null});
  }
});

test('SKL405 waits for a real signal, applies ordered resource changes and publishes the next background',async()=>{
  const f=await sharedFixture(api,transformed,{mounts:[10]});
  try{
    const before=f.owner.copyState(),targetId=bodyNode(before,10).id;
    const oldRider=before.playback.nodes.find(n=>n.kind==='rider'&&n.parentId===targetId).id;
    f.load(transformationMotion({targets:[[10,-2,100120,100121,100114],[0,99,100120,100121,0],[10,-7,100121,0,100114]]}));
    let birth=null,signalFrame=null,release=null,round=null;
    const alphas=[],seen=new Map();
    for(let i=1;i<310;i++){
      const pass=f.step(),state=pass.state;
      const events=pass.out.body.events;
      if(events.some(e=>e.kind==='signal'&&e.value===10003))signalFrame=i;
      const cue=events.find(e=>e.kind==='sound'&&e.value===0x113);
      if(cue){
        assert.equal(i,signalFrame+1);
        assert.equal(birth,null);
        birth=i;
        assert.equal(state.bodies.bodies[0].tupleRead,11);
        assert.equal(state.bodies.bodies[10].value1d0,-7);
        assert.equal(state.bodies.bodies[10].resourceId,100121);
        assert.equal(state.bodies.bodies[0].resourceId,100120);
        assert.equal(state.bodies.bodies[0].value1d0,99);
        assert.ok(node(state,oldRider));
        assert.deepEqual([...state.bodies.bodies[10].linkedResources],[100121,100114]);
        assert.equal(state.playback.nodes.some(n=>n.kind==='rider'&&n.parentId===bodyNode(state,0).id),false);
      }
      if(!birth)assert.equal(state.bodies.bodies[10].value1d0,0);
      if(pass.out.commands.some(r=>r.kind==='command-released'))release??=i;
      if(pass.out.manager.kind==='battle-round-drained')round??=i;
      const overlay=state.playback.nodes.find(n=>n.kind==='shared-field'&&!n.deleted);
      if(overlay){
        const alpha=overlay.opacity??255;
        alphas.push(alpha);
        if([1,128,255].includes(alpha))seen.set(alpha,pass.frame.drawPlan);
      }
      if(state.playback.backgroundResource===transformationField){
        assert.equal(overlay,undefined);
        assert.equal(i,birth+255);
        seen.set('background',pass.frame.drawPlan);
        break;
      }
    }
    assert.deepEqual(alphas,Array.from({length:255},(_,i)=>i+1));
    assert.ok(release&&round===release+1&&round<birth+255);
    const vitals=f.events.filter(e=>e.kind==='battle-vital');
    assert.deepEqual(vitals.map(e=>[e.slot,e.field,e.before,e.value]),[[0,'MP',10,7]]);
    for(const [key,plan] of seen){
      const picture=await f.library.startRender(plan).done;
      const alpha=key==='background'?255:key;
      assert.deepEqual(bytes(picture.rgba,4),[97,127,151,alpha]);
    }
    assert.equal(f.owner.copyState().playback.backgroundResource,transformationField);
    f.owner.beginEntry();
    assert.equal(f.owner.copyState().playback.backgroundResource,undefined);
  }finally{f.close();}
});

test('SKL405 without a cast signal charges only the queued MP and leaves the targets and field untouched',async()=>{
  const f=await sharedFixture(api,transformationAssets(assets,{signal:false}),{mounts:[10]});
  try{
    f.load(transformationMotion({targets:[[10,42,100120,100121,100114]]}));
    const result=f.drain(40);
    assert.ok(result);
    assert.deepEqual(slotState(result.state,0),[0,0,0,70,7]);
    assert.equal(result.state.bodies.bodies[10].resourceId,100114);
    assert.equal(result.state.bodies.bodies[10].value1d0,0);
    assert.equal(result.state.playback.nodes.some(n=>n.kind==='shared-field'),false);
    assert.equal(f.events.some(e=>e.kind==='sound'&&e.value===0x113),false);
  }finally{f.close();}
});

test('SKL405 can remove an existing rider and attachment and use the cleared field sentinel',async()=>{
  const f=await sharedFixture(api,transformed);
  try{
    f.owner.applyCharacter(10,0,100114,[100114,100121],[70,100,10,10]);
    f.load(transformationMotion({field:-1,cost:0,targets:[[10,-8,100120,-1,-1]]}));
    const result=f.drain(40);
    assert.ok(result);
    assert.equal(result.state.bodies.bodies[10].resourceId,100120);
    assert.deepEqual([...result.state.bodies.bodies[10].linkedResources],[0,0]);
    assert.equal(result.state.playback.nodes.some(n=>['rider','attachment'].includes(n.kind)),false);
    for(let i=0;i<270&&f.owner.copyState().playback.backgroundResource===undefined;i++)f.step();
    const state=f.owner.copyState();
    assert.equal(state.playback.backgroundResource,-1);
    const frame=f.frame.step({width:640,height:480},state.playback,1000);
    assert.equal(frame.drawPlan.commands.some(c=>c.priority===0),false);
  }finally{f.close();}
});
