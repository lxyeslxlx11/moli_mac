import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import * as api from '../index.mjs';
import {sharedFixture,sharedMotion} from '../../analysis/game-battle-shared-storage-v1/fixture.mjs';
import {transformationAssets} from '../../analysis/game-battle-shared-storage-v1/recovery-fixture.mjs';

const original=JSON.parse(readFileSync(new URL('../../analysis/game-battle-shared-storage-v1/original-fixtures.json',import.meta.url)));
const signaled=transformationAssets(original);
const effectResource=0x1adfa;
const motion=(hits,{cost=3,caster=0,code=40198}={})=>sharedMotion('SKL',[code,cost,caster,...hits.flat(),255]);
const command=raw=>api.decodeLegacyGameBattleMotion(raw).commands[0];
const impacts=state=>state.playback.nodes.filter(n=>n.kind==='impact'&&n.resourceId===effectResource);
const weather=state=>state.playback.weather;
const paintColor=fixture=>{
  const bgr=fixture.files.files.get('bin/pal/palet_00.cgp');
  const index=(0x8f-16)*3;
  return [bgr[index+2],bgr[index+1],bgr[index],255];
};

test('SKL401 plans both weather writes and 30 impacts only for the flagged slots',()=>{
  const get=slot=>[0,10,11,20,21].includes(slot)?{vitals:[70,100,10,10]}:null;
  for(let code=40100;code<40200;code++){
    const decoded=command(motion([[10,0x80000],[11,0]],{code}));
    assert.equal(decoded.dependencyMask,0xc01);
    const plan=api.planBattleCasting(decoded,get,0,0);
    const level=code%10,tier=level<3?3:level<6?2:level<9?1:0;
    assert.equal(plan.level,level);
    assert.deepEqual(plan.resources,{chant:0x1ae01+tier,projectile:null,group:1});
    assert.deepEqual(plan.rows.map(r=>r.actions),[[24,53,38,211,206,62,35,206],[0,35,207],[0]]);
    assert.deepEqual(plan.rows.map(r=>r.tuples),[
      [[10,0x80000,0,0],[11,0,0,0],[255,0,0,0],[0,1,3],[0,1,0]],[[0x1adfa,30,0,23]],[],
    ]);
    assert.equal(plan.rows[1].assignments.classCode,401);
  }
  const alias=api.planBattleCasting(command(motion([[51,0],[51,0]],{caster:50})),get,20,0);
  assert.equal(alias.principal,20);
  assert.deepEqual(alias.rows[1].actions,[0,0]);
  assert.equal(api.planBattleCasting(command(motion([[10,0]],{caster:1})),get,0,0).kind,'casting-skip');
  assert.equal(api.planBattleCasting(command(motion([[3,0]])),get,0,0).reason,'skill401-target-context');
  assert.equal(api.planBattleCasting(command(motion([[0,0x80000]])),get,0,0).reason,'skill401-self-effect-tuple');
  assert.deepEqual(api.planBattleCasting(command(motion([[10,0],[10,0x80000]])),get,0,0).rows[1].actions,[0,0,35,207]);
});

test('SKL401 runs the chant, four-drop updates and all 30 independent impacts through normal commands',async()=>{
  const f=await sharedFixture(api,signaled,{initialSlots:[11,20]});
  try{
    const raw=motion([[10,0x80000],[11,0]]);
    f.load(raw);
    let previous=f.owner.copyState(),signal=0,released=0,on=0,off=0,firstImpact=0,round=false,pixel=false,overlay=false,buffers=false;
    const seen=new Set();
    for(let pass=1;pass<=160;pass++){
      const {out,state,frame}=f.step(),rain=weather(state);
      const current=impacts(state).filter(n=>!seen.has(n.id));
      if(out.body.events.some(e=>e.kind==='signal'&&e.slot===0))signal=pass;
      if(!released&&signal&&state.bodies.bodies[0].tupleRead===3){
        released=pass;
        assert.equal(pass,signal+1);
        assert.equal(state.playback.seed,raw.length*3*11);
        assert.equal(state.bodies.bodies[10].state,35);
      }
      overlay||=state.playback.casting?.submissions.length===100;
      assert.ok(!state.playback.nodes.some(n=>n.kind==='casting-projectile'));
      assert.ok(!out.body.events.some(e=>e.kind==='battle-vital'&&e.field==='HP'));
      if(rain){
        if(!on){assert.equal(rain.mode,3);on=pass;assert.ok(on>released);}
        if(!off&&rain.mode===0)off=pass;
        let seed=previous.playback.seed;
        const next=()=>((seed=(Math.imul(seed,214013)+2531011)>>>0)>>>16)&32767;
        // Normal screen-offset sampling happens between these two snapshots.
        next();
        next();
        if(current.length){
          assert.equal(current.length,1);
          if(!firstImpact)firstImpact=pass;
          const n=current[0],parent=previous.playback.nodes.find(r=>r.slot===10),q=parent.animation;
          const w=q.geometry.width,y=q.drawOffsetY,divisor=Math.trunc(y/3)+1;
          const px=parent.screen[0]-Math.trunc(w/4)+next()%(Math.trunc(w/2)+1);
          const py=parent.screen[1]+Math.trunc(y/4)-(divisor===0?0:next()%divisor)+23;
          assert.deepEqual([...n.position],[px,py]);
          assert.equal(n.actorFlags,0x50000);
          seen.add(n.id);
        }
        const expected=(weather(previous)?.drops??[]).map(d=>({...d}));
        if(rain.mode===3)for(let i=0;i<4;i++)expected.unshift({x:next()%840-200,y:-9,speedX:next()%2+2});
        for(const d of expected){d.x+=d.speedX;d.y+=9;}
        assert.deepEqual(rain.drops,expected.filter(d=>d.x<640&&d.y<480));
        assert.equal(state.playback.seed,seed);
        const drop=frame.drawPlan.commands.find(c=>c.rainDrop&&c.y<9);
        if(drop&&!pixel){
          assert.equal(drop.priority,20);
          const {rgba}=await f.library.startRender(frame.drawPlan).done;
          for(const [dx,dy] of [[0,0],[0,1],[1,2],[1,3]]){
            const at=((drop.y+dy)*640+drop.x+dx)*4;
            assert.deepEqual([...rgba.slice(at,at+4)],paintColor(f));
          }
          pixel=true;
        }
        const drawnImpact=impacts(state).find(n=>n.animation.geometry&&!n.deleted);
        if(!buffers&&drawnImpact){
          const other=f.frame.step({width:640,height:480},state.playback,1000,1);
          assert.ok(other.skipped.some(r=>r.id===drawnImpact.id&&r.reason==='renderer-filter'));
          const first=f.frame.step({width:640,height:480},state.playback,1000,0);
          const at=first.submitted.findIndex(r=>r.id===drawnImpact.id);
          assert.ok(at>=0);
          assert.equal(first.drawPlan.commands[at].image.flags&4,4);
          buffers=true;
        }
      }
      previous=state;
      if(out.manager.kind==='battle-round-drained'){
        assert.equal(state.bodies.bodies[0].vitals[2],7);
        assert.equal(state.bodies.bodies[10].vitals[0],70);
        assert.equal(state.bodies.bodies[11].vitals[0],70);
        assert.ok(rain.drops.length>0);
        round=true;
        break;
      }
    }
    assert.equal(off-on,62);
    assert.equal(firstImpact-released,60);
    assert.equal(seen.size,30);
    assert.ok(pixel&&overlay&&buffers&&round);
  }finally{f.close();}
});

test('SKL401 retains mode-zero rain at ordinary return and drains it using ordinary movement direction',async()=>{
  const f=await sharedFixture(api,signaled);
  try{
    f.load(motion([[10,0x80000]]));
    const round=f.drain(180);
    assert.ok(round&&weather(round.state).mode===0);
    const before=weather(round.state).drops;
    assert.ok(before.length>0);
    assert.equal(f.owner.prepareExit({...f.context,substate:7}).kind,'battle-exit-cleanup');
    f.owner.markExitDeleted();
    assert.deepEqual(weather(f.owner.copyState()).drops,before);
    const after=f.owner.advanceOrdinaryRain(2);
    assert.deepEqual(after,before.map(d=>({...d,x:d.x+d.speedX-1,y:d.y+10})).filter(d=>d.x<640&&d.y<480));
    for(let i=0;i<72;i++)f.owner.advanceOrdinaryRain(-1);
    assert.equal(f.owner.advanceOrdinaryRain(-1),null);
    f.owner.beginEntry(5);
    assert.equal(weather(f.owner.copyState()),undefined);
  }finally{f.close();}
});

test('SKL401 exit while mode 3 is active clears the pool and does not generate ordinary drops',async()=>{
  const f=await sharedFixture(api,signaled);
  try{
    f.owner.beginEntry(5);
    f.owner.applyCharacter(0,0,100114,[0,0],[70,100,10,10]);
    f.load(motion([]));
    let active=null;
    for(let i=0;i<60;i++){const r=f.step();if(weather(r.state)?.mode===3){active=r;break;}}
    assert.ok(active);
    const before=weather(active.state);
    assert.equal(before.direction,5);
    assert.equal(before.drops.length,4);
    assert.ok(before.drops.every(d=>d.y===-2));
    assert.equal(active.frame.submitted.filter(r=>r.kind==='battle-rain').length,0);
    assert.equal(f.owner.prepareExit({...f.context,substate:7}).kind,'battle-exit-cleanup');
    assert.equal(weather(f.owner.copyState()).mode,0);
    assert.equal(weather(f.owner.copyState()).drops.length,0);
    f.owner.markExitDeleted();
    assert.equal(f.owner.advanceOrdinaryRain(5),null);
  }finally{f.close();}
});

test('SKL401 without a cast signal consumes the original target and sentinel before busy recovery',async()=>{
  const f=await sharedFixture(api,original);
  try{
    f.load(motion([[10,0x80000]]));
    let consumed=false,recovered=false,round=false;
    for(let i=0;i<7300;i++){
      const r=f.owner.callCallbacks(f.context);
      assert.ok(r.body.results.every(n=>n.kind!=='impact'));
      if(i<160){
        const state=f.owner.copyState();
        assert.equal(weather(state),undefined);
        if(state.bodies.bodies[0].tupleRead===2)consumed=true;
      }
      if(r.commands.some(o=>o.wait?.recovered.includes(10)))recovered=true;
      if(r.manager.kind==='battle-round-drained'){round=true;break;}
    }
    assert.ok(consumed&&recovered&&round);
    assert.equal(f.owner.copyState().bodies.bodies[0].vitals[2],7);
  }finally{f.close();}
});

test('SKL401 empty target list without a signal reaches the mode-three tuple at the second weather action',async()=>{
  const f=await sharedFixture(api,original);
  try{
    f.load(motion([]));
    let first=null,round=null;
    for(let i=0;i<130;i++){
      const r=f.step();
      if(!first&&weather(r.state)?.mode===3)first=r;
      if(r.out.manager.kind==='battle-round-drained'){round=r;break;}
    }
    assert.ok(round);
    assert.ok(first);
    assert.equal(first.state.bodies.bodies[0].tupleRead,2);
    assert.equal(first.state.bodies.bodies[0].state,231);
    assert.equal(weather(round.state).mode,3);
    assert.ok(weather(round.state).drops.length>=4);
    assert.equal(f.owner.prepareExit({...f.context,substate:7}).kind,'battle-exit-cleanup');
    assert.equal(weather(f.owner.copyState()).drops.length,0);
  }finally{f.close();}
});

test('the rain draw record paints a four-pixel pattern in palette color at depth 20',async()=>{
  const f=await sharedFixture(api,original);
  try{
    const drop={rainDrop:true,x:0,y:0,priority:20};
    const plan=api.createLegacyGameDrawPlan(2,4,[drop,{blackRectangle:[1,1],x:0,y:0,priority:21}]);
    const {rgba}=await f.library.startRender(plan).done;
    const color=paintColor(f);
    const expected=[[0,0,0,255],[0,0,0,0],color,[0,0,0,0],[0,0,0,0],color,[0,0,0,0],color];
    assert.deepEqual([...rgba],expected.flat());
    assert.throws(()=>api.createLegacyGameDrawPlan(640,480,[{...drop,x:636}]));
    assert.throws(()=>api.createLegacyGameDrawPlan(640,480,[{...drop,priority:21}]));
  }finally{f.close();}
});
