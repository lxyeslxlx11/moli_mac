import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import * as api from '../index.mjs';
import {sharedFixture,sharedMotion} from '../../analysis/game-battle-shared-storage-v1/fixture.mjs';
import {transformationAssets} from '../../analysis/game-battle-shared-storage-v1/recovery-fixture.mjs';

const original=JSON.parse(readFileSync(new URL('../../analysis/game-battle-shared-storage-v1/original-fixtures.json',import.meta.url)));
const signaled=transformationAssets(original);
const slots=[1,9,11,19,20,21];
const effectResource=0x1af8a;
const motion=(selector,{cost=3,argument=1234,caster=0,code=40298}={})=>sharedMotion('SKL',[code,cost,argument,caster,selector]);
const decode=raw=>api.decodeLegacyGameBattleMotion(raw).commands[0];
const bodyNode=(state,slot)=>state.playback.nodes.find(node=>node.kind==='body'&&node.slot===slot);
const effects=state=>state.playback.nodes.filter(node=>node.kind==='casting-charge'&&!node.deleted);

test('SKL402 reserves the ten selected cells and emits source triples only for present bodies',()=>{
  const bodies=new Map([0,1,9,10,11,19,20,21].map(slot=>[slot,{vitals:[70,100,10,10]}]));
  for(let code=40200;code<40300;code++){
    for(const selector of [0,-1,7]){
      const side=selector===0?[0,1,9]:[10,11,19];
      const command=decode(motion(selector,{code}));
      assert.equal(command.dependencyMask,selector===0?0x3ff:0xffc01);
      const plan=api.planBattleCasting(command,slot=>bodies.get(slot),0,0);
      assert.equal(plan.level,code%10);
      assert.deepEqual(plan.sideTargets,side);
      assert.deepEqual(plan.rows[0].tuples,side.map(slot=>[slot,0,0]));
      const cast=[24,53,38,135,62];
      assert.deepEqual(plan.rows.map(row=>[row.slot,row.actions]),selector===0?
        [[0,[...cast,212]],[1,[212]],[9,[212]]]:[[0,cast],[10,[212]],[11,[212]],[19,[212]]]);
      const level=code%10,tier=level<3?3:level<6?2:level<9?1:0;
      assert.equal(plan.resources.chant,0x1ade4+tier);
      assert.equal(Object.hasOwn(plan.rows[0].assignments,'projectileResource'),false);
    }
  }
});

test('SKL402 releases the entire registered side at chant completion, with one owned effect per body',async()=>{
  const f=await sharedFixture(api,signaled,{initialSlots:slots,flags:{11:2}});
  try{
    f.load(motion(-1));
    let firstEffects,signalAt=0,finished=false,seed=12345;
    const born=new Set(),observed=new Map();
    const random=max=>{
      if(max===-1)return 0;
      seed=(Math.imul(seed,214013)+2531011)>>>0;
      return ((seed>>>16)&0x7fff)%(max+1);
    };
    for(let pass=1;pass<=50;pass++){
      const result=f.owner.callCallbacks(f.context),state=f.owner.copyState();
      if(result.body.events.some(event=>event.kind==='signal'&&event.slot===0))signalAt=pass;
      const active=effects(state);
      if(active.length&&!firstEffects){
        firstEffects=pass;
        assert.ok(signalAt>0&&pass>signalAt);
        assert.equal(state.bodies.bodies[0].state,62);
        assert.equal(state.bodies.bodies[0].tupleRead,3);
        assert.ok(state.playback.nodes.every(node=>node.kind!=='casting-chant'||node.deleted));
      }
      if(signalAt&&pass===signalAt+1){
        assert.equal(state.bodies.bodies[0].state,135);
        assert.equal(active.length,0);
        assert.ok([10,11,19].every(slot=>state.bodies.bodies[slot].state===0&&state.bodies.bodies[slot].busy===1));
      }
      for(const charge of active){
        if(born.has(charge.id))continue;
        born.add(charge.id);
        const parent=state.playback.nodes.find(node=>node.id===charge.parentId);
        const {width}=parent.animation.geometry,y=parent.animation.drawOffsetY;
        const x=parent.screen[0]+random(Math.trunc(width/2))-Math.trunc(width/4);
        const py=parent.screen[1]+Math.trunc(y/4)-random(Math.trunc(y/3));
        assert.deepEqual([...charge.screen],[x,py]);
        assert.equal(charge.actorFlags,0x48000);
        assert.equal(state.bodies.bodies[parent.slot].state,157);
        observed.set(parent.slot,charge.id);
      }
      assert.equal(state.playback.seed,seed);
      if(active.length&&active.every(node=>node.animation.lastResource===effectResource)){
        const canvas={width:640,height:480};
        const hidden=f.frame.step(canvas,state.playback,1000,0);
        const shown=f.frame.step(canvas,state.playback,1000,1);
        for(const id of born){
          assert.ok(hidden.skipped.some(r=>r.id===id&&r.reason==='renderer-filter'));
          const at=shown.submitted.findIndex(r=>r.id===id);
          assert.ok(at>=0);
          assert.equal(shown.drawPlan.commands[at].image.flags&4,4);
        }
        const opaque=await f.library.startRender(shown.drawPlan).done;
        const other=await f.library.startRender(hidden.drawPlan).done;
        assert.notDeepEqual(opaque.rgba,other.rgba);
      }
      if(result.manager.kind==='battle-round-drained'){
        finished=true;
        assert.equal(result.manager.roundCounter,1);
        assert.equal(active.length,0);
        assert.deepEqual([...observed.keys()],[10,11,19]);
        assert.equal(state.bodies.bodies[11].savedFlags&2,2);
        assert.deepEqual(state.bodies.bodies.filter(Boolean).map(b=>[b.slot,b.vitals[0],b.vitals[2]]),
          [[0,70,7],[1,70,10],[9,70,10],[10,70,10],[11,70,10],[19,70,10],[20,70,10],[21,70,10]]);
        break;
      }
    }
    assert.ok(finished);
  }finally{f.close();}
});

test('SKL402 on the caster side runs even with no cast signal and includes the caster after action 62',async()=>{
  const f=await sharedFixture(api,original,{initialSlots:slots});
  try{
    f.load(motion(0,{cost:0}));
    const births=new Map();
    let round=null;
    for(let pass=1;pass<=50;pass++){
      const result=f.step();
      assert.equal(result.out.body.events.some(e=>e.kind==='signal'&&e.slot===0),false);
      for(const charge of effects(result.state)){
        const parent=result.state.playback.nodes.find(node=>node.id===charge.parentId);
        if(!births.has(parent.slot))births.set(parent.slot,pass);
      }
      if(result.out.manager.kind==='battle-round-drained'){round=result;break;}
    }
    assert.ok(round);
    assert.deepEqual([...births.keys()],[1,9,0]);
    assert.equal(births.get(1),births.get(9));
    assert.equal(births.get(0),births.get(1)+2);
    assert.equal(round.state.bodies.bodies[0].vitals[2],10);
    assert.equal(effects(round.state).length,0);
  }finally{f.close();}
});

test('SKL402 skips an absent caster and rejects the empty-side tuple context before a charge or cost',async()=>{
  const f=await sharedFixture(api,original);
  try{
    f.owner.removeCharacter(10);
    f.load(motion(1,{caster:3}));
    const skipped=f.drain(20);
    assert.ok(skipped);
    assert.equal(skipped.state.bodies.bodies[0].vitals[2],10);
    f.load(motion(1));
    f.step();
    const rejected=f.step();
    assert.equal(rejected.out.commands[0].reason,'skill402-empty-side');
    assert.equal(rejected.state.bodies.bodies[0].vitals[2],10);
    assert.ok(rejected.state.playback.nodes.every(node=>!node.kind.startsWith('casting-')));
  }finally{f.close();}
});

test('starting a new battle retires the active SKL402 effects and their former owners',async()=>{
  const f=await sharedFixture(api,signaled,{initialSlots:[1,11]});
  try{
    f.load(motion(1));
    let live=null;
    for(let i=0;i<35;i++){
      const frame=f.step();
      if(effects(frame.state).length){live=frame.state;break;}
    }
    assert.ok(live);
    const ids=new Set(live.playback.nodes.map(node=>node.id));
    const formerTarget=bodyNode(live,10).id;
    f.owner.beginEntry();
    f.owner.applyCharacter(10,0,100114,[0,0],[90,100,5,10]);
    f.owner.callCallbacks(f.context);
    const fresh=f.owner.copyState();
    assert.equal(fresh.playback.nodes.some(node=>ids.has(node.id)),false);
    assert.notEqual(bodyNode(fresh,10).id,formerTarget);
    assert.deepEqual([...fresh.bodies.bodies[10].vitals],[90,100,5,10]);
    assert.equal(fresh.bodies.bodies[10].busy,0);
  }finally{f.close();}
});
