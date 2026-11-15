import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createLegacyGameAnimationCatalog,createLegacyGameAnimationPlayer,createLegacyGameBattleBodies,createLegacyGameBattleCommands,LEGACY_GAME_BATTLE_PLAYBACK_PROFILE,
  createLegacyGameBattleRandom,legacyGameBattleAngle,legacyGameBattleFacing,legacyGameBattleSine,legacyGameBattleMovement,legacyGameBattleDistance} from '../index.mjs';
const vectors=JSON.parse(readFileSync(new URL('../../analysis/game-battle-body-v1/original-vectors.json',import.meta.url)));
const bytes=s=>Uint8Array.from(s.match(/../g)??[],v=>parseInt(v,16)),text=s=>new TextEncoder().encode(s);
const groups=()=>vectors.animationGroups.map(g=>({...g,index:bytes(g.index),animation:bytes(g.animation)}));
const geometry=({kind,value})=>{const r=vectors.geometry.find(r=>r[kind==='index'?'index':'resourceId']===value);if(!r)throw Error('Original fixture geometry missing');return{index:r.index,originX:r.originX,originY:r.originY,width:r.width,height:r.height};};
const config=catalog=>({animations:catalog,geometry,seed:12345,initialPhase:0,alternativeRenderer:false,staticFlip:false,screenOffset:[0,0]});
const context=(substate=6,localSlot=0)=>({mainState:10,substate,controlFlags:0,resourceCode:0,localSlot,slowEffects:false});
test('source table-angle/facing, quantized sine movement and1024 CRT random values match independent Python',()=>{
  for(const row of vectors.math){assert.equal(legacyGameBattleAngle(row.x,row.y),row.angle);assert.equal(legacyGameBattleFacing(row.angle),row.facing);}
  for(const row of vectors.trig){assert.equal(legacyGameBattleSine(row.angle),row.sine);assert.deepEqual(legacyGameBattleMovement(480,360,row.angle,6),row.move);}
  for(const row of vectors.random){const random=createLegacyGameBattleRandom(row.initial);assert.deepEqual(row.values.map(()=>random.next()),row.values);assert.equal(random.copySeed(),row.final);
    const {range}=random,before=random.copySeed();assert.equal(range(10,-1),0);assert.equal(random.copySeed(),before);}
  assert.equal(legacyGameBattleDistance(0,0,3,4),5);assert.equal(legacyGameBattleDistance(0,0,0,4.99),4);
  for(const fn of [()=>legacyGameBattleSine(Infinity),()=>legacyGameBattleSine(1e9),()=>legacyGameBattleFacing(1080),()=>legacyGameBattleDistance(0,0,1e10,0)])assert.throws(fn);
});
test('source body queues, movement, animation and child traversal match independent original frame traces',()=>{
  for(const type of vectors.covered_body_types)assert.ok(LEGACY_GAME_BATTLE_PLAYBACK_PROFILE.supportedBodyTypes.includes(type));
  for(const trace of vectors.traces){const catalog=createLegacyGameAnimationCatalog(groups()),body=createLegacyGameBattleBodies();try{
    body.configurePlayback({...config(catalog),screenOffset:trace.offset,alternativeRenderer:trace.alternativeRenderer});body.applyCharacter(trace.slot,trace.flags,100010,[0,0]);
    body.resetQueues(1<<trace.slot);body.setMessageResource(trace.slot,trace.message);body.appendActions(trace.slot,1,trace.queue);body.activate(trace.slot);
    for(let i=0;i<trace.frames.length;i++){
      const expected=trace.frames[i],result=body.stepPlayback({...context(),slowEffects:trace.slowEffects}),projection=body.copyPlayback(),state=body.copy(trace.slot)??projection.nodes.find(n=>n.kind==='body');
      const label=trace.name+'#'+(i+1);assert.equal(result.stopRequested,expected.stop,label);assert.equal(projection.phase,expected.phase,label);assert.equal(projection.seed,expected.seed,label);
      const nodes=projection.nodes.map(n=>({id:n.id,kind:n.kind,deleted:n.deleted,position:[...n.position],screen:[...n.screen],state:n.state,counter:n.counter,height:n.height,actorFlags:n.actorFlags,animation:n.animation}));
      assert.deepEqual(nodes,expected.nodes,label+' nodes');assert.deepEqual(result.results.map(r=>[r.id,r.result]),expected.visited,label+' traversal');
      if(!expected.detached){for(const key of ['state','busy','angle','facing','animationAction','speed','speedPercent','counter','escapeCounter','dynamicFlags'])assert.equal(state[key],expected[key],label+' '+key);assert.deepEqual(state.position,expected.position,label);assert.deepEqual(state.scale,expected.scale,label);}
      else assert.equal(body.copy(trace.slot),null,label+' detached global slot');
    }
  }finally{body.close();assert.equal(catalog.inspect().resources>0,true);catalog.close();}}
});
test('source animation frame reset retains resource/action/phase signal and only resets delay/nextFrame',()=>{
  const catalog=createLegacyGameAnimationCatalog(groups()),player=createLegacyGameAnimationPlayer(catalog);try{
    const c={resourceId:100010,action:13,facing:0,speedPercent:100,mode:1,frozen:0,staticFlip:false,soundScene:10,actorFlags:0x60054};
    let result;for(let i=0;i<20;i++){result=player.step(c,geometry);if(result.code===1)break;}assert.equal(result.code,1);
    const old=player.copyState();player.resetFrames();assert.deepEqual(player.copyState(),{...old,nextFrame:0,delay:0});
  }finally{player.close();catalog.close();}
});
test('source manager, command callbacks and real body completion feed each other in actual traversal order',()=>{
  const catalog=createLegacyGameAnimationCatalog(groups()),engine=createLegacyGameBattleCommands();try{
    engine.configureBodyPlayback(config(catalog));engine.applyCharacter(0,0,100010);engine.load(text('M|ANR|0|PUE|0|ACT|0|END|'),context(5));
    const timeline=[];for(let i=0;i<40;i++){const result=engine.callCallbacks(context());timeline.push(result);if(result.nextSubstate===7)break;}
    assert.equal(timeline.length,12);assert.equal(timeline[0].commands[0].kind,'command-delay');assert.equal(timeline[1].commands[0].kind,'command-queued');assert.equal(timeline[1].commands[0].bodyExecution,'partial');
    assert.equal(timeline[1].body.results[0].result,'advanced');assert.equal(timeline[2].commands[0].kind,'command-waiting');assert.equal(timeline[3].commands[0].kind,'command-next');
    assert.equal(timeline[9].commands[0].kind,'command-effect');assert.equal(timeline[11].nextSubstate,7);assert.ok(timeline[11].body.results.some(r=>r.result==='gated'));
    const state=engine.copyState();assert.equal(state.activeMask,0);assert.equal(state.bodies.bodies[0].busy,0);assert.ok(state.playback.nodes.some(n=>n.kind==='indicator'&&(n.actorFlags&2)));
    assert.equal(state.nativeDriver,'unimplemented');assert.equal(state.bodyCallbacks,'partial');
  }finally{engine.close();catalog.close();}
});
test('actual SUP animation completion drains EOF only after body231 clears busy, not when the last action pops',()=>{
  const catalog=createLegacyGameAnimationCatalog(groups()),engine=createLegacyGameBattleCommands();try{
    engine.configureBodyPlayback(config(catalog));engine.applyCharacter(0,0,100010);engine.load(text('M|SUP|0|FF|'),context(5));let ended=null,firstClear=null,released=null;
    for(let i=1;i<=40;i++){const result=engine.callCallbacks(context());const state=engine.copyState();if(firstClear===null&&i>1&&state.bodies.bodies[0].busy===0)firstClear=i;
      if(result.commands.some(c=>c.kind==='command-released'))released=i;if(result.nextSubstate===2){ended=i;break;}}
    assert.equal(firstClear,12);assert.equal(released,13);assert.equal(ended,14);assert.equal(engine.copyState().roundCounter,1);
  }finally{engine.close();catalog.close();}
});
test('local successful escape propagates source stop on244 and manager requests7 on the following call',()=>{
  const catalog=createLegacyGameAnimationCatalog(groups()),engine=createLegacyGameBattleCommands();try{
    engine.configureBodyPlayback(config(catalog));engine.applyCharacter(0,0,100010);engine.load(text('M|ESC|0|1|'),context(5));let stopped=null,exit=null;
    for(let i=1;i<=300;i++){const result=engine.callCallbacks(context());if(result.body.stopRequested){stopped=i;assert.equal(result.nextSubstate,null);assert.equal(engine.copyState().stop,1);}
      if(result.nextSubstate===7){exit=i;break;}}
    assert.ok(stopped>120);assert.equal(exit,stopped+1);assert.equal(engine.copyState().bodies.bodies[0].state,244);
  }finally{engine.close();catalog.close();}
});
test('escaped source49 marks the pool body deleted before physical removal and no longer blocks EOF',()=>{
  const catalog=createLegacyGameAnimationCatalog(groups()),engine=createLegacyGameBattleCommands();try{
    engine.configureBodyPlayback(config(catalog));engine.applyCharacter(10,0,100010);engine.load(text('M|ESC|A|1|'),context(5));let result;
    for(let i=0;i<300;i++){result=engine.callCallbacks(context());if(result.nextSubstate===2)break;}
    assert.equal(result.nextSubstate,2);const state=engine.copyState();assert.equal(state.bodies.bodies[10],null);assert.equal(state.playback.nodes.some(n=>n.kind==='body'&&n.slot===10),false);
  }finally{engine.close();catalog.close();}
});
test('unsupported special C/body branches stay unavailable and cannot be interpreted as completed gameplay',()=>{
  const catalog=createLegacyGameAnimationCatalog(groups()),body=createLegacyGameBattleBodies();try{
    body.configurePlayback(config(catalog));body.applyCharacter(0,0x2000,100010);body.appendActions(0,1,[139]);body.activate(0);
    const result=body.stepPlayback(context());assert.equal(result.results[0].result,'character-branch-unavailable');assert.equal(body.copy(0).busy,1);
  }finally{body.close();catalog.close();}
  const c=createLegacyGameAnimationCatalog(groups()),pending=createLegacyGameBattleBodies();try{
    pending.configurePlayback(config(c));pending.applyCharacter(0,0,100010);pending.appendActions(0,1,[208]);pending.activate(0);
    for(let i=0;i<30&&pending.copy(0).state!==209;i++)pending.stepPlayback(context());assert.equal(pending.copy(0).state,209);
    const before=pending.copy(0);assert.equal(pending.stepPlayback(context()).results[0].result,'body-handler-unavailable');assert.deepEqual(pending.copy(0),before);assert.equal(before.busy,1);
  }finally{pending.close();c.close();}
});
test('invalid callback context is rejected before state changes or playback failure',()=>{const catalog=createLegacyGameAnimationCatalog(groups()),body=createLegacyGameBattleBodies();try{
  body.configurePlayback(config(catalog));body.applyCharacter(0,0,100010);const before=body.copyPlayback();let reads=0;
  const invalid={...context()};Object.defineProperty(invalid,'slowEffects',{get(){reads++;return false;}});assert.throws(()=>body.stepPlayback(invalid));assert.equal(reads,0);assert.deepEqual(body.copyPlayback(),before);
  assert.equal(body.stepPlayback(context()).kind,'battle-body-callback-pass');
}finally{body.close();catalog.close();}});
test('C removal marks attached children before traversal and physical deletion obeys the source quarter gate',()=>{const catalog=createLegacyGameAnimationCatalog(groups()),body=createLegacyGameBattleBodies();try{
  body.configurePlayback({...config(catalog),initialPhase:1});body.applyCharacter(10,0x410,100010);assert.equal(body.copyPlayback().nodes.length,3);body.remove(10);
  assert.equal(body.copy(10),null);assert.ok(body.copyPlayback().nodes.every(n=>n.deleted));
  for(let i=0;i<3;i++){const pass=body.stepPlayback({...context(),slowEffects:true});assert.ok(pass.results.every(r=>r.result==='quarter-gated'));assert.equal(body.copyPlayback().nodes.length,3);}
  assert.ok(body.stepPlayback({...context(),slowEffects:true}).results.every(r=>r.result==='removed'));assert.equal(body.copyPlayback().nodes.length,0);
}finally{body.close();catalog.close();}});
test('playback configuration is required before C bodies and ownership rejects late binding, getters and borrowed-catalog close',()=>{
  const catalog=createLegacyGameAnimationCatalog(groups()),body=createLegacyGameBattleBodies();try{
    body.applyCharacter(0,0);assert.throws(()=>body.configurePlayback(config(catalog)),e=>e.code==='LEGACY_BATTLE_PLAYBACK_CONFIGURATION_BUSY');body.clear();let reads=0;
    const invalid={...config(catalog)};Object.defineProperty(invalid,'seed',{get(){reads++;return 1;}});assert.throws(()=>body.configurePlayback(invalid));assert.equal(reads,0);
    body.configurePlayback(config(catalog));body.applyCharacter(0,0,100010);const copy=body.copy(0);assert.throws(()=>{copy.linkedResources[0]=99;},TypeError);
    catalog.close();assert.throws(()=>body.stepPlayback(context()));assert.throws(()=>body.stepPlayback(context()));
  }finally{body.close();catalog.close();}
});
test('geometry reentrancy cannot mutate the world and close cancels players without closing caller catalog',()=>{
  const catalog=createLegacyGameAnimationCatalog(groups()),body=createLegacyGameBattleBodies();let callback=false;
  try{body.configurePlayback({...config(catalog),geometry(query){if(callback)body.close();else assert.throws(()=>body.appendActions(0,1,[66]),e=>e.code==='LEGACY_BATTLE_PLAYBACK_REENTRANT');return geometry(query);}});
    body.applyCharacter(0,0,100010);body.appendActions(0,1,[55]);body.activate(0);callback=true;assert.throws(()=>body.stepPlayback(context()));assert.throws(()=>body.copyState(),e=>e.code==='LEGACY_BATTLE_CLOSED');assert.ok(catalog.inspect().resources>0);
  }finally{body.close();catalog.close();}
});
