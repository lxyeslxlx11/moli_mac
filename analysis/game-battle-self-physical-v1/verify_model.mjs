/** Independent native-equation comparison through the actual source/generated API. */
import assert from 'node:assert/strict';
import {writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {directSelfFlight,guardedSelfFlight,guardedSelfHP,selfPhysicalMotion} from './reference.mjs';
import {selfPhysicalProjection,selfPhysicalDigest,selfPhysicalOwned} from './projection.mjs';
import {selfPhysicalFixture} from './fixture.mjs';
export async function verifySelfPhysicalModel(api,v,{queueCost=4,sourceGuardReturn=false,sourceSelfCatch=false,mismatchDirectory=new URL('../../build/analysis/game-battle-self-physical-v1/',import.meta.url)}={}){
 let queues=0,states=0,rasters=0,settled=0;
 let guardScenarios=0,guardFrames=0,replacedStates=0,replacedRasters=0;
 let catchScenarios=0,catchFrames=0,aliasStates=0,aliasRasters=0;
 for(const row of v.queues){const c={...row.case,cost:queueCost};
  const get=()=>({vitals:[70,100,10,10],unmodeledCharacterMask:0,tuples:new Int32Array(800),tupleWrite:0});
  const p=api.planBattlePhysicalFamily(api.decodeLegacyGameBattleMotion(selfPhysicalMotion(c)).commands[0],get,0,0);
  assert.equal(p.kind,'physical-family-plan',JSON.stringify(c)+' '+p.reason);assert.equal(selfPhysicalDigest(p.rows),row.expected_digest,JSON.stringify(c));queues++;
 }
 for(const trace of v.traces){const c=trace.case,f=await selfPhysicalFixture(api,v,c);
  const guard=sourceGuardReturn?guardedSelfFlight(c):null;
  const direct=sourceSelfCatch?directSelfFlight(c):null;
  const expected=direct?.alias?v.traces.find(row=>row.case.name==='self-damage'):trace;
  let relay=null,guardFlown=false,guardResult=false;
  let caught=false,directResult=false;
  try{
   if(direct?.alias){
    const saved=c.hits.at(-1);
    assert.deepEqual({...c,name:expected.case.name,hits:[...c.hits.slice(0,-1),[saved[0],saved[1],direct.flags,saved[3]]]},expected.case);
    replacedStates+=trace.states.length;
    replacedRasters+=trace.rasters.length;
   }
   const q=f.owner.queuePhysicalFamily(f.command,1,c.local,0);assert.equal(q.kind,'strike-queued',c.name+' '+q.reason);
   const initial=selfPhysicalDigest(selfPhysicalOwned(f.owner));
   if(initial!==expected.initialOwnedDigest){writeFileSync(new URL('model-initial-mismatch.json',mismatchDirectory),JSON.stringify({case:c,actual:selfPhysicalOwned(f.owner),expectedDigest:expected.initialOwnedDigest,actualDigest:initial},null,2));assert.fail(c.name+' initial owned storage');}
   for(let i=0;i<expected.states.length;i++){
    const before=relay===null?null:f.owner.copy(guard.slot);
    const caster=direct?f.owner.copy(c.caster):null;
    const returning=direct&&!caught&&caster?.state===23&&caster.actions[caster.actionRead+1]===216
     ?f.owner.copyPlayback().nodes.find(n=>n.physical?.role==='multi'&&n.state===22&&!n.deleted):null;
    const step=f.step();assert.equal(step.results.some(r=>r.result.endsWith('unavailable')),false,c.name+' unavailable#'+(i+1));
    if(guard){
     const playback=f.owner.copyPlayback(),child=playback.nodes.find(n=>n.physical?.role==='multi');
     if(relay===null&&child&&[24,71].includes(child.state)){
      const {tuples,tupleRead,tupleWrite}=child.physical;
      assert.deepEqual([...tuples.slice(tupleRead*4,tupleRead*4+4)],[guard.slot,0,0,0],c.name);
      assert.equal(tupleWrite,tupleRead+1,c.name);
      assert.equal(f.owner.copy(c.caster).state,0,c.name+' first wait');
      relay=child.id;
      replacedStates+=trace.states.length-i;
      replacedRasters+=trace.rasters.filter(r=>r.frame>i).length;
     }
     if(relay!==null){
      if(child)assert.equal(child.id,relay,c.name+' returns the same projectile');
      guardFlown||=child?.state===217;
      const after=f.owner.copy(guard.slot);
      const resultQueued=before?.state===216||before?.state===0&&before.actions[before.actionRead+1]===216;
      if(resultQueued&&after?.tupleRead!==before.tupleRead){
       assert.ok(guardFlown&&!guardResult,c.name+' one guarded hit after flight');
       assert.equal(before.tuples[(before.tupleRead+1)*4+1]>>>0,guard.flags,c.name+' saved result');
       assert.equal(after.vitals[0],guardedSelfHP(before.vitals,guard),c.name+' 216 HP');
       assert.equal(after.tupleRead,before.tupleRead+2+(guard.flags&0x800000?3:0),c.name+' 216 cursor');
       guardResult=true;
      }
      guardFrames++;
      if(f.stopped||(!child&&f.owner.copyState().bodies.every(b=>!b?.busy)))break;
      continue;
     }
    }
    if(direct){
     const after=f.owner.copy(c.caster);
     const closeCatch=returning&&step.events.some(e=>e.kind==='sound'&&e.value===0xd8&&e.nodeId===returning.id);
     if(closeCatch){
      assert.ok(Math.hypot(returning.position[0]-caster.position[0],returning.position[1]-caster.position[1])<20,c.name+' near return');
      assert.ok(after.state===216||after.tupleRead>caster.tupleRead,c.name+' catch releases 216');
      caught=true;
      if(!direct.alias){
       replacedStates+=trace.states.length-i;
       replacedRasters+=trace.rasters.filter(r=>r.frame>i).length;
      }
     }
     if((caster.state===216||closeCatch)&&after?.tupleRead>caster.tupleRead){
      assert.equal(directResult,false,c.name+' only one self result');
      assert.equal(caster.tuples[(caster.tupleRead+1)*4+1]>>>0,direct.flags,c.name+' owned flags');
      assert.equal(after.tupleRead,caster.tupleRead+2+(direct.flags&0x800000?3:0),c.name+' 216 cursor');
      assert.equal(after.vitals[0],guardedSelfHP(caster.vitals,direct),c.name+' 216 HP');
      directResult=true;
     }
     if(caught){
      assert.ok(f.owner.copyPlayback().nodes.every(n=>n.state!==217),c.name+' no guard relay');
      catchFrames++;
      if(f.stopped||f.owner.copyState().bodies.every(b=>!b?.busy))break;
      continue;
     }
    }
    const actual=selfPhysicalProjection(f.owner),hash=selfPhysicalDigest(actual);
    if(hash!==expected.states[i]){writeFileSync(new URL('model-state-mismatch.json',mismatchDirectory),JSON.stringify({case:c,frame:i+1,actual,actualDigest:hash,expectedDigest:expected.states[i]},null,2));assert.fail(c.name+' state#'+(i+1));}
    for(const r of expected.rasters.filter(r=>r.frame===i+1)){
     const out=f.frame.step({width:640,height:480},f.owner.copyPlayback(),1000,r.selector),plan={depthOrder:[...out.depthOrder],commands:out.drawPlan.commands.map((d,j)=>({id:out.submitted[j].id,kind:out.submitted[j].kind,index:d.image.index,flags:d.image.flags,x:d.x,y:d.y,priority:d.priority,...(d.scale?{scale:Array.from(d.scale)}:{})})),skipped:[...out.skipped],drawOrder:out.drawOrder.map(d=>d.id)};
     assert.equal(selfPhysicalDigest(plan),r.planDigest,c.name+' draw plan#'+r.frame+'/'+r.selector);const pixels=await f.library.startRender(out.drawPlan).done;
     assert.equal(createHash('sha256').update(pixels.rgba).digest('hex'),r.rgbaSha256,c.name+' full RGBA#'+r.frame+'/'+r.selector);assert.equal(selfPhysicalDigest(selfPhysicalProjection(f.owner)),hash);
     if(direct?.alias)aliasRasters++;else rasters++;
    }
    if(direct?.alias)aliasStates++;else states++;
   }
   if(guard){
    assert.ok(relay!==null&&guardFlown&&guardResult,c.name+' completed guard flight');
    const done=f.owner.copyState().bodies.every(b=>!b?.busy);
    assert.ok(f.stopped||done,c.name+' drained or stopped');
    guardScenarios++;settled+=Number(done);
    continue;
   }
   if(caught){assert.ok(directResult,c.name+' completed the self result');catchScenarios++;}
   assert.equal(f.stopped,expected.stopped,c.name);const done=f.owner.copyState().bodies.filter(Boolean).every(b=>!b.busy);assert.equal(done,expected.bodySettled,c.name);settled+=Number(done);
   assert.equal(selfPhysicalDigest(selfPhysicalOwned(f.owner)),expected.finalOwnedDigest,c.name+' final owned storage');
  }finally{f.close();}
 }assert.equal(states+replacedStates,v.frames);assert.equal(rasters+replacedRasters,v.rgbaFrames);
 return {queues,scenarios:v.traces.length,states,rasters,settled,guardScenarios,guardFrames,catchScenarios,catchFrames,aliasStates,aliasRasters,replacedStates,replacedRasters};
}
