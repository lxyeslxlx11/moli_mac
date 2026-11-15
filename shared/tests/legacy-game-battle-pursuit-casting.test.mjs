import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import * as api from '../index.mjs';
import {sharedFixture,sharedMotion} from '../../analysis/game-battle-shared-storage-v1/fixture.mjs';
import {transformationAssets} from '../../analysis/game-battle-shared-storage-v1/recovery-fixture.mjs';

const original=JSON.parse(readFileSync(new URL('../../analysis/game-battle-shared-storage-v1/original-fixtures.json',import.meta.url)));
const signaled=transformationAssets(original);
const motion=(hits,{cost=3,caster=0,code=40091}={})=>sharedMotion('SKL',[code,cost,caster,...hits.flat(),255]);
const command=raw=>api.decodeLegacyGameBattleMotion(raw).commands[0];
const pursuits=state=>state.playback.nodes.filter(n=>n.casting?.family==='pursuit');
const tail=[241,24,53,38,211,62];

test('SKL400 units digit and distinct registered, self, local and empty target queues',()=>{
  const get=slot=>[0,10,11,20,21].includes(slot)?{vitals:[70,100,10,10]}:null;
  const branches=[
    [0,[0,0,241,11]],
    [8,[0,0,241,11]],
    [0x100,[0,0,241,11,74]],
    [0x108,[0,0,241,11,74]],
    [0x80000,[0,0,241,50,49]],
    [0x80008,[0,0,241,11]],
    [0x10000000,[0,0,241]],
    [0x10000100,[0,0,241,11,74]],
  ];
  for(let code=40000;code<40100;code++){
    for(const [flags,actions] of branches){
      const p=api.planBattleCasting(command(motion([[10,flags]],{code})),get,0,0);
      const level=code%10,tier=level<3?3:level<6?2:level<9?1:0;
      assert.equal(p.level,level);
      assert.deepEqual(p.resources,{chant:0x1ade4+tier,projectile:0x1addc+tier,group:3});
      assert.deepEqual(p.rows.map(r=>r.actions),[tail,actions]);
      assert.deepEqual(p.rows.map(r=>r.tuples),[[[0,0,400,0],[10,flags,0,0],[255,0,0,0]],[[10,0,400,0]]]);
    }
  }
  const self=api.planBattleCasting(command(motion([[50,0],[51,0x80000]],{caster:50})),get,21,0);
  assert.equal(self.principal,20);
  assert.deepEqual(self.rows.map(r=>r.actions),[[...tail,0,11],[0,0,241,244]]);
  assert.equal(self.rows[0].tuples[1][0],20);
  const empty=api.planBattleCasting(command(motion([])),get,0,0);
  assert.deepEqual(empty.rows[0].tuples,[[0,0,400,0],[255,0,0,0]]);
  assert.equal(api.planBattleCasting(command(motion([[10,0]],{caster:3})),get,0,0).kind,'casting-skip');
  assert.equal(api.planBattleCasting(command(motion([[8,0]])),get,0,0).reason,'skill400-target-context');
  assert.equal(api.planBattleCasting(command(motion([[10,0x800000]])),get,0,0).reason,'skill400-linked-tuple-boundary');
  assert.equal(api.planBattleCasting(command(motion([[10,0],[10,0]])),get,0,0).rows[1].tuples.length,2);
});

test('SKL400 signal reseeds each projectile and carries only the ordinary target before returning it',async()=>{
  const f=await sharedFixture(api,signaled,{initialSlots:[11,20]});
  try{
    const raw=motion([[10,0],[11,0x10200000]],{code:40098});
    f.load(raw);
    let signalPass=0,launchPass=0,carryFrames=0,round=false,rgba=false,overlay=false;
    const initialPositions=new Map([10,11].map(slot=>[slot,[...f.owner.copyState().bodies.bodies[slot].position]]));
    const born=new Set(),messages=new Set(),sounds=[];
    for(let pass=1;pass<=330;pass++){
      const {out,state}=f.step();
      if(out.body.events.some(e=>e.kind==='signal'&&e.slot===0))signalPass=pass;
      sounds.push(...out.body.events.filter(e=>e.kind==='sound').map(e=>e.value));
      overlay||=state.playback.casting?.submissions.length===100;
      const flights=pursuits(state);
      if(!launchPass&&flights.length){
        launchPass=pass;
        assert.equal(launchPass,signalPass+1);
        assert.equal(flights.length,2);
        assert.equal(state.bodies.bodies[0].tupleRead,4);
        assert.ok(state.playback.nodes.every(n=>n.kind!=='casting-chant'||n.deleted));
        let lastSeed;
        for(const n of flights){
          const slot=n.casting.tuples[0],position=initialPositions.get(slot);
          let seed=raw.length*3*slot;
          const next=()=>((seed=(Math.imul(seed,214013)+2531011)>>>0)>>>16)&32767;
          assert.equal(n.casting.delay,next()%31-1);
          assert.equal(n.casting.speed,4+next()%5);
          const angle=api.legacyGameBattleAngle(position[0]-320,position[1]-260);
          assert.equal(n.casting.angle,Math.fround(angle-90+next()%181));
          assert.deepEqual([...n.position],[320,260]);
          assert.equal(state.bodies.bodies[slot].actionRead,1);
          lastSeed=seed;
          born.add(n.id);
        }
        assert.equal(state.playback.seed,lastSeed);
      }
      for(const n of flights){
        if(n.casting.tuples[0]===10&&n.casting.finish===1&&state.bodies.bodies[10].state===0){
          const tick=n.casting.delay&31;
          const rise=tick<16?Math.trunc((tick-8)**2/2):64-Math.trunc((tick-24)**2/2);
          assert.deepEqual([...state.bodies.bodies[10].position],[n.position[0],Math.fround(n.position[1]-35-rise)]);
          carryFrames++;
        }
        const trail=state.playback.nodes.find(r=>r.kind==='casting-trail'&&!r.deleted&&r.animation.geometry);
        if(!rgba&&trail&&!n.deleted&&n.animation.geometry&&n.position[0]>50&&n.position[0]<590&&n.position[1]>50&&n.position[1]<420){
          const zero=f.frame.step({width:640,height:480},state.playback,1000,0);
          const one=f.frame.step({width:640,height:480},state.playback,1000,1);
          for(const buffer of [zero,one]){
            const at=buffer.submitted.findIndex(r=>r.id===n.id);
            assert.ok(at>=0);
            assert.equal(buffer.drawPlan.commands[at].image.flags&4,4);
          }
          const [hidden,shown]=trail.actorFlags&0x8000?[zero,one]:[one,zero];
          assert.ok(hidden.skipped.some(r=>r.id===trail.id&&r.reason==='renderer-filter'));
          assert.ok(shown.submitted.some(r=>r.id===trail.id));
          const a=await f.library.startRender(zero.drawPlan).done,b=await f.library.startRender(one.drawPlan).done;
          assert.notDeepEqual(a.rgba,b.rgba);
          rgba=true;
        }
      }
      for(const n of state.playback.nodes)if(n.kind==='message')messages.add(n.resourceId);
      assert.deepEqual([...state.bodies.bodies[11].position],initialPositions.get(11));
      assert.ok(!out.body.events.some(e=>e.kind==='battle-vital'&&e.field==='HP'));
      if(out.manager.kind==='battle-round-drained'){
        assert.deepEqual([...state.bodies.bodies[10].position],initialPositions.get(10));
        assert.equal(state.bodies.bodies[0].vitals[2],7);
        assert.equal(state.bodies.bodies[10].vitals[0],70);
        round=true;
        break;
      }
    }
    assert.ok(overlay&&rgba&&round&&launchPass>0&&carryFrames>10);
    assert.equal(born.size,2);
    assert.ok(messages.has(0x57bb)&&messages.has(0x5739));
    assert.ok(sounds.includes(0x103)&&sounds.includes(0x10c)&&sounds.includes(0x10d));
    for(let i=0;i<160&&pursuits(f.owner.copyState()).length;i++)f.step();
    assert.equal(pursuits(f.owner.copyState()).length,0);
  }finally{f.close();}
});

test('SKL400 dodge uses source reaction and never enters the carry branch',async()=>{
  const f=await sharedFixture(api,signaled);
  try{
    const flags=0x08001008,originalPosition=[...f.owner.copyState().bodies.bodies[10].position];
    f.load(motion([[10,flags]],{cost:0}));
    let dodge=false,spin=false,returning=false,finished=false,previousFacing=null;
    for(let i=0;i<270;i++){
      const {out,state}=f.step(),b=state.bodies.bodies[10];
      if(b.state===29){
        dodge=true;
        assert.equal(b.reactionFlags,flags);
        assert.equal(b.attackerSlot,0);
        if(previousFacing!==null&&b.reactionCounter>0&&b.reactionCounter%2===0){
          assert.equal(b.facing,(previousFacing+1)&7);
          spin=true;
        }
        previousFacing=b.facing;
      }
      if(dodge&&b.state===241){assert.equal(b.speed,6);returning=true;}
      assert.notEqual(b.animationAction,8);
      if(out.manager.kind==='battle-round-drained'){
        assert.deepEqual([...b.position],originalPosition);
        assert.equal(b.vitals[0],70);
        assert.equal(state.bodies.bodies[0].vitals[2],10);
        finished=true;
        break;
      }
    }
    assert.ok(dodge&&spin&&returning&&finished);
  }finally{f.close();}
});

test('SKL400 remote removal detaches the affected registry slot and its flagged paired actor',async()=>{
  const f=await sharedFixture(api,signaled,{initialSlots:[15],flags:{10:4}});
  try{
    f.load(motion([[10,0x80000]]));
    const round=f.drain(420);
    assert.ok(round);
    for(const slot of [10,15])assert.equal(round.state.bodies.bodies[slot],null);
    assert.equal(round.state.bodies.bodies[0].vitals[2],7);
    assert.equal(pursuits(round.state).length,0);
    assert.deepEqual(f.events.filter(e=>e.kind==='battle-motion-body-removed').map(e=>e.slot),[10,15]);
    assert.ok(!f.events.some(e=>e.kind==='battle-vital'&&e.field==='HP'));
  }finally{f.close();}
});

test('SKL400 local removal uses action 244 and leaves cleanup to battle entry',async()=>{
  const f=await sharedFixture(api,signaled);
  try{
    f.load(motion([[0,0x80000]],{caster:10}));
    let stopped;
    for(let i=0;i<370;i++){const r=f.step();if(r.out.body.stopRequested){stopped=r;break;}}
    assert.ok(stopped);
    assert.equal(stopped.state.bodies.bodies[0].state,244);
    assert.equal(stopped.state.bodies.bodies[0].vitals[0],70);
    assert.equal(stopped.state.bodies.bodies[10].vitals[2],7);
    const ids=new Set(stopped.state.playback.nodes.map(n=>n.id));
    f.owner.beginEntry();
    f.owner.applyCharacter(0,0,100114,[0,0],[90,100,5,10]);
    f.owner.callCallbacks(f.context);
    const fresh=f.owner.copyState();
    assert.ok(fresh.playback.nodes.every(n=>!ids.has(n.id)));
    assert.deepEqual([...fresh.bodies.bodies[0].vitals],[90,100,5,10]);
  }finally{f.close();}
});

test('SKL400 with no animation signal holds the target for the source busy recovery',async()=>{
  const f=await sharedFixture(api,original);
  try{
    f.load(motion([[10,0]]));
    let recovered=false,round=false;
    for(let pass=0;pass<7300;pass++){
      const out=f.owner.callCallbacks(f.context);
      assert.ok(out.body.results.every(n=>n.kind!=='casting-projectile'));
      if(out.commands.some(r=>r.wait?.recovered.includes(10)))recovered=true;
      if(out.manager.kind==='battle-round-drained'){round=true;break;}
    }
    assert.ok(recovered&&round);
    assert.equal(f.owner.copyState().bodies.bodies[0].vitals[2],7);
    assert.equal(f.owner.copyState().bodies.bodies[10].vitals[0],70);
  }finally{f.close();}
});

test('SKL400 self targeting waits for the caster and preserves the default trail RNG order',async()=>{
  const f=await sharedFixture(api,signaled);
  try{
    const initialPosition=[...f.owner.copyState().bodies.bodies[0].position];
    f.load(motion([[0,0]],{cost:0}));
    let waited=false,trailVerified=false,returned=false,previousSeed=12345;
    for(let i=0;i<350;i++){
      const {out,state}=f.step(),n=pursuits(state)[0],b=state.bodies.bodies[0];
      if(n?.state===0){
        assert.deepEqual([...n.position],[320,260]);
        assert.equal(n.casting.turn,0);
        assert.ok([211,62].includes(b.state));
        waited=true;
      }
      const trail=state.playback.nodes.find(r=>r.kind==='casting-trail'&&!r.deleted&&r.animation.geometry);
      if(!trailVerified&&trail){
        let seed=previousSeed;
        const next=()=>((seed=(Math.imul(seed,214013)+2531011)>>>0)>>>16)&32767;
        // The ordinary frame consumes its two screen-offset draws before this callback.
        next();
        next();
        const y=Math.fround(n.position[1]+next()%5-2);
        const x=Math.fround(n.position[0]+next()%5-2);
        assert.deepEqual([...trail.position],[x,y]);
        assert.equal(trail.actorFlags,next()%2===0?0x70000:0x68000);
        assert.equal(state.playback.seed,seed);
        trailVerified=true;
      }
      previousSeed=state.playback.seed;
      if(out.manager.kind==='battle-round-drained'){
        assert.deepEqual([...b.position],initialPosition);
        assert.deepEqual([...b.vitals],[70,100,10,10]);
        returned=true;
        break;
      }
    }
    assert.ok(waited&&trailVerified&&returned);
  }finally{f.close();}
});
