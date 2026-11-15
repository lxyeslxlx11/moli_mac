import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import * as api from '../index.mjs';
import {sharedFixture} from '../../analysis/game-battle-shared-storage-v1/fixture.mjs';
import {itemColors,mpItemAssets} from '../../analysis/game-battle-shared-storage-v1/mp-items-fixture.mjs';

const source=JSON.parse(readFileSync(new URL('../../analysis/game-battle-shared-storage-v1/original-fixtures.json',import.meta.url)));
const assets=mpItemAssets(source);
const bytes=value=>Uint8Array.from(value,ch=>ch.charCodeAt(0));
const body=(state,slot)=>state.bodies.bodies[slot];
const vitalEvents=(f,field)=>f.events.filter(e=>e.kind==='battle-vital'&&e.field===field)
  .map(e=>[e.slot,e.before,e.value]);

async function visible(f,frame,color){
  const {rgba}=await f.library.startRender(frame.drawPlan).done;
  for(let i=0;i<rgba.length;i+=4)if(color.every((value,n)=>rgba[i+n]===value))return true;
  return false;
}

test('CFP applies signed MP differences with a floor, a mapped slot, and an absent slot',async()=>{
  const f=await sharedFixture(api,assets,{initialSlots:[20,21]});
  try{
    f.load(bytes('M|CFP|32|3|CFP|32|0|CFP|32|FFFFFFFF|CFP|32|80000000|CFP|33|20|CFP|4|1|'));
    const round=f.drain();
    assert.equal(round?.state.roundCounter,1);
    const mp=vitalEvents(f,'MP');
    assert.deepEqual(mp.filter(e=>e[0]===20),[[20,10,7],[20,7,7],[20,7,8],[20,8,0]]);
    assert.deepEqual(mp.filter(e=>e[0]!==20),[[21,10,0]]);
    assert.deepEqual(vitalEvents(f,'HP'),[]);
    for(const slot of [20,21])assert.deepEqual(Array.from(body(round.state,slot).vitals),[70,100,0,10]);
  }finally{f.close();}
});

test('ITM0 releases each recipient after the cast and applies HP only after its own effect',async()=>{
  const f=await sharedFixture(api,assets,{initialSlots:[11]});
  try{
    f.load(bytes('M|ITM|0|0|1234|A|28|B|FFFFFFFD|FF|'));
    let cast=false,recover=false,queued=false,finished=false,waited=false;
    for(let i=0;i<480;i++){
      const {out,state,frame}=f.step(),actor=body(state,0),recipient=body(state,10);
      for(const command of out.commands){
        assert.notEqual(command.kind,'command-unavailable',command.reason);
        if(command.producer!=='ITM0')continue;
        queued=true;
        assert.deepEqual(Array.from(actor.actions.slice(0,4)),[24,38,134,69]);
        assert.deepEqual(Array.from(actor.tuples.slice(0,12)),[10,0,0,0,11,0,0,0,-1,0,0,0]);
        assert.deepEqual(Array.from(recipient.actions.slice(0,2)),[146,155]);
        assert.equal(recipient.state,0);
        assert.equal(recipient.vitals[0],70);
      }
      const nodes=state.playback.nodes;
      if(!cast&&nodes.some(n=>n.resourceId===0x1ae18&&!n.deleted))cast=await visible(f,frame,itemColors.cast);
      const charge=nodes.find(n=>n.resourceId===0x1ae08&&!n.deleted);
      if(charge){
        waited||=recipient.state===157&&recipient.vitals[0]===70;
        if(!recover){
          assert.ok(frame.skipped.some(row=>row.id===charge.id&&row.reason==='renderer-filter'));
          const selected=f.frame.step({width:640,height:480},state.playback,1000,1);
          recover=await visible(f,selected,itemColors.recover);
        }
      }
      if(out.manager.kind==='battle-round-drained'){finished=true;break;}
    }
    assert.deepEqual({queued,waited,cast,recover,finished},
      {queued:true,waited:true,cast:true,recover:true,finished:true});
    assert.deepEqual(vitalEvents(f,'HP'),[[10,70,100],[11,70,67]]);
    assert.deepEqual(vitalEvents(f,'MP'),[]);
  }finally{f.close();}
});

test('ITM0 supports self, repeated, and empty recipient lists',async()=>{
  const f=await sharedFixture(api,assets);
  try{
    f.load(bytes('M|ITM|0|0|0|0|5|A|4|A|9|FF|'));
    const first=f.drain();
    assert.equal(first?.state.roundCounter,1);
    const hp=vitalEvents(f,'HP');
    assert.deepEqual(hp.filter(e=>e[0]===0),[[0,70,75]]);
    assert.deepEqual(hp.filter(e=>e[0]===10),[[10,70,79],[10,79,88]]);
    f.load(bytes('M|ITM|0|0|0|FF|'));
    assert.equal(f.drain()?.state.roundCounter,2);
    assert.deepEqual(vitalEvents(f,'HP'),hp);
  }finally{f.close();}
});

test('an absent ITM0 recipient leaves all actor queues untouched',async()=>{
  const f=await sharedFixture(api,assets);
  try{
    f.load(bytes('M|ITM|0|0|0|A|1|B|2|FF|'));
    let result;
    for(let i=0;i<8&&!result;i++)result=f.step().out.commands.find(c=>c.kind==='command-unavailable');
    assert.equal(result?.reason,'item-recovery-target');
    const state=f.owner.copyState();
    for(const slot of [0,10]){
      assert.equal(body(state,slot).actionWrite,-1);
      assert.equal(body(state,slot).tupleWrite,0);
      assert.equal(body(state,slot).vitals[0],70);
    }
    assert.deepEqual(vitalEvents(f,'HP'),[]);
  }finally{f.close();}
});

test('ITM7 emits one cue, renders action 16, and holds action 36 for 120 passes',async()=>{
  const f=await sharedFixture(api,assets);
  try{
    f.load(bytes('M|ITM|7|0|'));
    let queued=false,rendered=false,hold=0,round=null;
    for(let i=0;i<390;i++){
      const {out,state,frame}=f.step(),actor=body(state,0);
      for(const command of out.commands){
        assert.notEqual(command.kind,'command-unavailable',command.reason);
        if(command.producer==='ITM7'){
          assert.deepEqual(Array.from(actor.actions.slice(0,4)),[78,200,36,35]);
          queued=true;
        }
      }
      if(actor.state===36)hold++;
      if(!rendered&&actor.state===200&&actor.animationAction===16)rendered=await visible(f,frame,itemColors.use);
      if(out.manager.kind==='battle-round-drained'){round=state;break;}
    }
    assert.equal(queued&&rendered,true);
    assert.equal(hold,120);
    assert.equal(round?.roundCounter,1);
    assert.equal(body(round,0).animationAction,0);
    assert.deepEqual(f.events.filter(e=>e.kind==='sound'&&e.value===0x1b6).map(e=>e.slot),[0]);
    assert.deepEqual(vitalEvents(f,'HP'),[]);
  }finally{f.close();}
});

test('a server exit during recovery releases both actor queues before HP changes',async()=>{
  const f=await sharedFixture(api,assets);
  try{
    f.load(bytes('M|CFP|0|3|ITM|0|0|0|A|28|FF|ITM|7|0|'));
    for(let i=0;i<200;i++){
      const {state}=f.step();
      if(body(state,10).state===157)break;
    }
    const before=f.owner.copyState();
    assert.equal(body(before,0).vitals[2],7);
    assert.equal(body(before,10).state,157);
    assert.equal(body(before,10).vitals[0],70);
    const cleanup=f.owner.prepareExit({...f.context,substate:7});
    assert.equal(cleanup.callbacks.commands.filter(c=>c.kind==='command-aborted').length,1);
    const after=f.owner.copyState();
    assert.equal(after.roundCounter,0);
    assert.ok(after.bodies.bodies.every(b=>b===null));
    f.owner.markExitDeleted();
    assert.ok(f.owner.copyState().playback.nodes.every(n=>n.deleted));
    assert.deepEqual(vitalEvents(f,'HP'),[]);
    assert.equal(f.events.filter(e=>e.kind==='sound'&&e.value===0x1b6).length,0);
  }finally{f.close();}
});
