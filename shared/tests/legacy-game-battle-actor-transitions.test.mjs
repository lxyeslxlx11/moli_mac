import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import * as api from '../index.mjs';
import {sharedFixture,sharedMotion} from '../../analysis/game-battle-shared-storage-v1/fixture.mjs';
import {actorTransitionAssets,transitionColors} from '../../analysis/game-battle-shared-storage-v1/actor-transitions-fixture.mjs';

const source=JSON.parse(readFileSync(new URL('../../analysis/game-battle-shared-storage-v1/original-fixtures.json',import.meta.url)));
const assets=actorTransitionAssets(source);
const bytes=value=>Uint8Array.from(value,ch=>ch.charCodeAt(0));
const body=(state,slot)=>state.bodies.bodies[slot];
const actor=(state,slot)=>state.playback.nodes.find(n=>n.kind==='body'&&n.slot===slot);
const effects=(state,kind)=>state.playback.nodes.filter(n=>n.kind===kind&&!n.deleted);
const hasColor=(rgba,color)=>{
  for(let at=0;at<rgba.length;at+=4)if(color.every((value,i)=>rgba[at+i]===value))return true;
  return false;
};

test('REB enters and releases all four element properties through M, shared children and real frames',async()=>{
  for(let selector=0;selector<4;selector++){
    const f=await sharedFixture(api,assets,{backup:{0:100060}});
    try{
      f.load(bytes('M|REB|0|80000|186DD|'+selector+'|REB|0|0|18712|'));
      const visible=[false,false],queued=[],alphas=[[],[]];
      let current=null,finished=false;
      for(let pass=0;pass<390;pass++){
        const {out,state,frame}=f.step(),b=body(state,0),node=actor(state,0);
        for(const command of out.commands){
          assert.notEqual(command.kind,'command-unavailable',command.reason);
          if(command.kind==='command-element-rebind-queued'){
            current=queued.length;
            queued.push([command.element,command.resourceId]);
            assert.deepEqual(Array.from(b.actions.slice(0,4)),[24,38,158,62]);
            assert.deepEqual(Array.from(b.tuples.slice(0,4)),current===0?[selector,0x80000,0,100061]:[-1,0,0,100114]);
          }
        }
        if(node.opacity!==undefined&&b.state===158)alphas[current].push(node.opacity);
        if(current===0&&b.elementProperty===selector+1){
          assert.equal(b.resource13a8,100114);
          assert.equal(b.resourceId,100061);
          assert.equal(b.dynamicFlags&0x10000000,0x10000000);
          const base=[0x1af5a,0x1af66,0x1af72,0x1af7e][selector];
          assert.deepEqual(Array.from(effects(state,'element-follow'),n=>n.resourceId),[base,base+1,base+2,base+3]);
        }
        if(current!==null&&!visible[current]&&frame.submitted.some(n=>n.kind==='element-transition')){
          const {rgba}=await f.library.startRender(frame.drawPlan).done;
          visible[current]=hasColor(rgba,transitionColors[current===0?'bind':'clear']);
        }
        if(out.manager.kind==='battle-round-drained'){finished=true;break;}
      }
      const final=f.owner.copyState();
      assert.equal(finished,true);
      assert.deepEqual(queued,[[selector+1,100061],[0,100114]]);
      assert.deepEqual(visible,[true,true]);
      assert.deepEqual(alphas[0],Array.from({length:36},(_,i)=>248-i*7));
      assert.deepEqual(alphas[1],Array.from({length:37},(_,i)=>i*7));
      assert.deepEqual(f.events.filter(e=>e.kind==='sound'&&e.value>=0x1a9&&e.value<=0x1b0).map(e=>e.value),[0x1a9+2*selector,0x1aa+2*selector]);
      assert.equal(body(final,0).elementProperty,0);
      assert.equal(body(final,0).dynamicFlags&0x10000000,0);
      assert.equal(body(final,0).resourceId,100114);
      assert.equal(body(final,0).drawFlagMask,0);
      assert.equal(body(final,0).drawFlagValue,4);
      assert.equal(effects(final,'element-follow').length,0);
      assert.equal(effects(final,'element-transition').length,0);
    }finally{f.close();}
  }
});

test('same-resource REB waits for its effect without fading the body or rewriting its backup',async()=>{
  const f=await sharedFixture(api,assets,{backup:{0:100060}});
  try{
    f.load(sharedMotion('REB',[0,0x80000,100114,2]));
    let effectFrames=0,advanced=false;
    for(let i=0;i<190;i++){
      const {out,state}=f.step();
      assert.equal(actor(state,0).opacity,undefined);
      if(body(state,0).attackFinishCounter===1&&effects(state,'element-transition').length)effectFrames++;
      if(out.manager.kind==='battle-round-drained'){advanced=true;break;}
    }
    const b=body(f.owner.copyState(),0);
    assert.ok(effectFrames>1);
    assert.equal(advanced,true);
    assert.equal(b.elementProperty,3);
    assert.equal(b.resource13a8,100060);
    assert.equal(b.resourceId,100114);
  }finally{f.close();}
});

test('REB rejects a bad selector or unresolved graphic before writing the body queue',async()=>{
  for(const [resource,selector,reason] of [[100061,4,'element-selector'],[104720,0,'element-graphic-resources']]){
    const f=await sharedFixture(api,assets);
    try{
      f.load(sharedMotion('REB',[0,0x80000,resource,selector]));
      const handle=f.owner.callManager(f.context).created[0];
      f.owner.callCommand(handle,f.context);
      const before=f.owner.copyState();
      const out=f.owner.callCommand(handle,f.context);
      assert.equal(out.kind,'command-unavailable');
      assert.equal(out.reason,reason);
      assert.deepEqual(f.owner.copyState(),before);
    }finally{f.close();}
  }
});

const rows=[
  [910,590],[845,625],[780,660],[715,695],[650,730],[845,540],[781,576],[718,613],[654,649],[590,685],
  [-14,-194],[-77,-157],[-141,-121],[-205,-85],[-269,-49],[45,-143],[-18,-107],[-81,-71],[-145,-35],[-209,0],
];
const wireSlot=slot=>slot<20?slot:slot+30;
function departure(slot){
  const x=(Math.imul(slot,214013)+2531011)>>>0,seed=(Math.imul(x,214013)+2531011)>>>0;
  return {seed,target:[rows[((x>>>16)&32767)%20][0],rows[((seed>>>16)&32767)%20][1]]};
}

test('PLV chooses two independent raw entry rows for every remapped slot',async()=>{
  for(let slot=0;slot<22;slot++){
    const f=await sharedFixture(api,assets,{initialSlots:[slot]});
    try{
      f.load(sharedMotion('PLV',[wireSlot(slot)]));
      const handle=f.owner.callManager(f.context).created[0];
      f.owner.callCommand(handle,f.context);
      const result=f.owner.callCommand(handle,f.context),state=f.owner.copyState(),expected=departure(slot);
      assert.equal(result.kind,'command-departure-queued');
      assert.equal(result.slot,slot);
      assert.deepEqual([...result.target],expected.target);
      assert.equal(state.playback.seed,expected.seed);
      assert.deepEqual([...body(state,slot).departureTarget],expected.target);
      assert.deepEqual(Array.from(body(state,slot).actions.slice(0,5)),[12,66,78,13,49]);
    }finally{f.close();}
  }
});

test('PLV walks the owned departure queue and removes both living and downed actors once',async()=>{
  for(const flags of [0,2]){
    const f=await sharedFixture(api,assets,{flags:{10:flags}});
    try{
      f.load(sharedMotion('PLV',[10]));
      let pendingRemoval=false,frameColor=false,finished=false;
      for(let i=0;i<550;i++){
        const {out,state,frame}=f.step(),b=body(state,10);
        if(b?.state===49){pendingRemoval=true;assert.deepEqual([...b.position],departure(10).target);}
        if(!frameColor&&frame.submitted.some(n=>n.kind==='message'))frameColor=hasColor((await f.library.startRender(frame.drawPlan).done).rgba,transitionColors.departure);
        if(out.manager.kind==='battle-round-drained'){finished=true;break;}
      }
      assert.equal(finished,true);
      assert.equal(pendingRemoval,true);
      assert.equal(frameColor,true);
      assert.equal(body(f.owner.copyState(),10),null);
      assert.deepEqual(f.events.filter(e=>e.kind==='battle-motion-body-removed').map(e=>e.slot),[10]);
      assert.equal(f.events.filter(e=>e.kind==='sound'&&e.value===0xd3).length,1);
    }finally{f.close();}
  }
});

test('phase 7 interrupts an active REB and PLV before retirement and preserves the round count',async()=>{
  const f=await sharedFixture(api,assets);
  try{
    f.load(bytes('M|REB|0|80000|186DD|0|PLV|A|'));
    for(let i=0;i<100;i++){
      const {state}=f.step();
      if(body(state,10).departureTarget&&body(state,0).attackFinishCounter===1)break;
    }
    const before=f.owner.copyState();
    assert.equal(body(before,0).state,158);
    assert.equal(body(before,10).state,12);
    assert.equal(effects(before,'element-transition').length,1);
    const cleanup=f.owner.prepareExit({...f.context,substate:7});
    assert.equal(cleanup.callbacks.commands.filter(c=>c.kind==='command-aborted').length,2);
    const after=f.owner.copyState();
    assert.equal(after.roundCounter,0);
    assert.equal(after.activeMask,0);
    assert.ok(after.bodies.bodies.every(b=>b===null));
    f.owner.markExitDeleted();
    assert.ok(f.owner.copyState().playback.nodes.every(n=>n.deleted));
  }finally{f.close();}
});
