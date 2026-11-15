import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createLegacyGameBattleBodies,createLegacyGameBattleCommands,createLegacyGameBattleState,LEGACY_GAME_BATTLE_SLOT_LAYOUT as layout} from '../index.mjs';
const vectors=JSON.parse(readFileSync(new URL('../../analysis/game-battle-commands-v1/original-vectors.json',import.meta.url))),bytes=s=>new TextEncoder().encode(s);
const context=(substate=6,localSlot=0)=>({mainState:10,substate,localSlot,controlFlags:0,resourceCode:0});
function owner(text,slot=null,flags=0,local=0){const engine=createLegacyGameBattleCommands();if(slot!==null)engine.applyCharacter(slot,flags);
  engine.load(bytes(text),context(5,local));return engine;}
function dispatch(engine,local=0){const event=engine.callManager(context(6,local)),handle=event.created[0];
  assert.equal(engine.callCommand(handle,context(6,local)).kind,'command-delay');return{event,handle,result:engine.callCommand(handle,context(6,local))};}
test('source ESC/CLR/SUP/ANR/PUE/PNO/PDN dispatch writes exact owned queues, metadata and busy state',()=>{
  for(const row of vectors.queue_cases){const engine=owner(row.text,0,row.flags,row.local);try{
    const {result}=dispatch(engine,row.local);assert.equal(result.kind,'command-queued',row.text);const body=engine.copyState().bodies.bodies[0];
    assert.deepEqual(Array.from(body.actions.slice(0,body.actionWrite+1)),row.actions,row.text);assert.equal(body.actions[body.actionWrite+1],-1);
    assert.equal(body.state,row.state);assert.equal(body.messageResource,row.message);assert.equal(body.effectResource,row.effect);assert.equal(body.busy,1);
    assert.equal(engine.callCommand(engine.copyState().slots[0].handle,context(6,row.local)).kind,row.flags&2?'command-released':'command-waiting');
    assert.equal(engine.copyState().bodyCallbacks,'unimplemented');
  }finally{engine.close();}}
});
test('C new-body path forces initial queues empty before applying dead flags and target-facing',()=>{const body=createLegacyGameBattleBodies();try{
  body.applyCharacter(0,2);const state=body.copy(0);assert.equal(state.actionWrite,-1);assert.deepEqual(Array.from(state.actions.slice(0,2)),[0,-1]);
  assert.equal(state.tuples[0],-1);assert.equal(state.tuples[4],-1);assert.deepEqual(Array.from(state.values.slice(0,2)),[-1,-1]);assert.equal(state.facing,0);
  body.appendActions(0,7,[66]);body.activate(0);body.applyCharacter(0,2);assert.equal(body.copy(0).actionWrite,0);assert.equal(body.copy(0).busy,1);
}finally{body.close();}});
test('source coalescing shares only allowed dependencies and keeps blocked END at the execution cursor',()=>{
  const row=vectors.coalescing,engine=owner(row.text);try{const result=engine.callManager(context()),state=engine.copyState();
    assert.equal(result.kind,row.initial.kind);assert.equal(state.commandIndex,4);assert.equal(state.activeMask,3);assert.equal(state.groupIndex,1);
    assert.deepEqual(state.slots.filter(Boolean).map(o=>o.records.map(r=>r.token)),row.initial.records);
    assert.deepEqual(state.slots.filter(Boolean).map(o=>o.dependencyMask),row.initial.masks);
    const expectedCursor=bytes('M|ANR|0|PUE|0|ANR|1|PNO|1|').length;assert.equal(state.cursor,expectedCursor);assert.equal(state.preflightCursor,bytes(row.text).length);
    for(const handle of result.created){assert.equal(engine.callCommand(handle,context()).kind,'command-delay');assert.equal(engine.callCommand(handle,context()).kind,'command-next');assert.equal(engine.callCommand(handle,context()).kind,'command-delay');assert.equal(engine.callCommand(handle,context()).kind,'command-released');}
    const resumed=engine.callManager(context());assert.equal(resumed.created.length,1);const handle=resumed.created[0];assert.equal(engine.copyState().slots[handle.slot].type,23);
    engine.callCommand(handle,context());assert.equal(engine.callCommand(handle,context()).nextSubstate,7);assert.equal(engine.copyState().roundCounter,0);
  }finally{engine.close();}
});
test('conflicting preflight retains earlier reservation writes while leaving execution cursor unconsumed',()=>{const engine=owner('M|ANR|2|CLR|1|2|FF|');try{
  const event=engine.callManager(context()),state=engine.copyState();assert.equal(event.kind,'manager-conflict');assert.equal(event.slot,2);
  assert.equal(state.commandIndex,1);assert.equal(state.cursor,8);assert.equal(state.preflightCursor,19);assert.equal(state.reservations[1],1);assert.equal(state.reservations[2],1);
}finally{engine.close();}});
test('CHT/BST coalesce after the dependency gate and chat can log without playback',()=>{const engine=owner('M|ANR|0|CHT|1|0|0|1|Original|BST|2|1|');try{
  const event=engine.callManager(context()),state=engine.copyState();assert.equal(event.created.length,1);assert.deepEqual(event.merged,[1,2]);
  assert.equal(state.slots[0].dependencyMask,7);assert.equal(state.slots[0].records.length,3);
  const handle=event.created[0];engine.callCommand(handle,context());assert.equal(engine.callCommand(handle,context()).kind,'command-next');
  engine.callCommand(handle,context());assert.equal(engine.callCommand(handle,context()).kind,'command-chat');assert.equal(engine.copyState().activeMask,1);
  assert.equal(String.fromCharCode(...engine.copyChat()[0].text),'Original');
}finally{engine.close();}});
test('oversized supported dispatch rejects all queue and metadata writes before mutation',()=>{const engine=owner('M|SUP|'+('0|'.repeat(50))+'FF|',0);try{
  const handle=engine.callManager(context()).created[0];engine.callCommand(handle,context());const before=engine.copyState();
  assert.throws(()=>engine.callCommand(handle,context()),e=>e.code==='LEGACY_BATTLE_BODY_CAPACITY');assert.deepEqual(engine.copyState(),before);
}finally{engine.close();}});
test('all32 concurrent slots, unsigned bit31 and source group*22 delays are retained',()=>{const row=vectors.capacity,engine=owner(row.text);try{
  assert.equal(engine.callManager(context()).kind,'manager-capacity');const state=engine.copyState();assert.equal(state.activeMask,row.activeMask);assert.equal(state.inputEnded,false);
  assert.deepEqual(state.slots.map(o=>o.delay),row.delays);assert.deepEqual(state.slots.map(o=>o.type),row.types);assert.equal(engine.callManager(context()).kind,'manager-busy');
  const last=state.slots[31];for(let n=0;n<row.delays[31];n++)assert.equal(engine.callCommand(last.handle,context()).kind,'command-delay');
  assert.equal(engine.copyState().groupIndex,31);assert.equal(engine.callCommand(last.handle,context()).remaining,-1);
  const before=engine.copyState();assert.equal(engine.callCommand(last.handle,context()).kind,'command-unavailable');assert.deepEqual(engine.copyState(),before);
}finally{engine.close();}});
test('EOF drains to substate2 with uint32 round wrap; END requests7 and ignores position only',()=>{
  const engine=owner('M|ANR|0|');try{engine.configureRoundCounter(0xffffffff);const {handle}=dispatch(engine);assert.equal(engine.copyState().activeMask,0);
    assert.throws(()=>engine.callCommand(handle,context()),e=>e.code==='LEGACY_BATTLE_COMMAND_HANDLE');
    assert.deepEqual(engine.callManager(context()),{kind:'battle-round-drained',nextSubstate:2,roundCounter:0});
  }finally{engine.close();}
  const end=owner('M|END|',0,1);try{const {result}=dispatch(end);assert.equal(result.kind,'battle-exit-requested');assert.equal(result.nextSubstate,7);assert.equal(end.copyState().bodies.bodies[0].busy,0);}finally{end.close();}
});
test('EOF token scans advance both source cursors across trailing punctuation except the native one-byte early return',()=>{
  for(const [text,offset]of [['M|ANR|0|....',12],['M|ANR|0|.',8]]){const engine=owner(text);try{
    assert.equal(engine.callManager(context()).kind,'manager-input-ended');const state=engine.copyState();assert.equal(state.cursor,offset);assert.equal(state.preflightCursor,offset);
  }finally{engine.close();}}
});
test('released slot reuse rejects stale or forged handles and honors fresh one-call delay',()=>{const engine=owner('M|ANR|0|CLR|0|FF|');try{
  const first=engine.callManager(context()).created[0];engine.callCommand(first,context());engine.callCommand(first,context());
  const next=engine.callManager(context()).created[0];assert.equal(next.slot,first.slot);assert.notEqual(next.id,first.id);
  for(const handle of [first,{...next}])assert.throws(()=>engine.callCommand(handle,context()),e=>e.code==='LEGACY_BATTLE_COMMAND_HANDLE');
  assert.equal(engine.callCommand(next,context()).kind,'command-delay');assert.equal(engine.callCommand(next,context()).kind,'command-queued');assert.equal(engine.callCommand(next,context()).kind,'command-released');
}finally{engine.close();}});
test('queue199 cells plus sentinel are bounded atomically for actions, indexed insertion, tuples and values',()=>{
  const body=createLegacyGameBattleBodies();try{body.applyCharacter(0,0);body.resetQueues(1);
    body.appendActions(0,1,Array.from({length:199},(_,i)=>i));assert.equal(body.copy(0).actions[199],-1);
    let before=body.copyState();assert.throws(()=>body.appendActions(0,1,[99]),e=>e.code==='LEGACY_BATTLE_BODY_CAPACITY');assert.deepEqual(body.copyState(),before);
    assert.throws(()=>body.insertAction(0,1,3,198));assert.deepEqual(body.copyState(),before);
    body.insertAction(0,2,77,197);assert.equal(body.copy(0).actions[198],77);assert.equal(body.copy(0).owner,2);
    for(let i=0;i<199;i++){body.appendTuple(0,[i,i+1,i+2,i+3]);body.appendValue(0,i);}
    before=body.copyState();assert.throws(()=>body.appendTuple(0,[1,2,3]));assert.throws(()=>body.appendValue(0,3));assert.deepEqual(body.copyState(),before);
    assert.equal(body.copy(0).tuples[199*4],-1);assert.equal(body.copy(0).values[199],-1);
    for(let i=0;i<198;i++)assert.equal(body.popTuple(0),false);assert.equal(body.popTuple(0),true);assert.throws(()=>body.popTuple(0));
  }finally{body.close();}
});
test('reset skips dead/state13 via source guard, preserves busy/type, and forced reset retains tuple fourth word',()=>{
  const body=createLegacyGameBattleBodies();try{body.applyCharacter(0,0);body.resetQueues(1);body.appendActions(0,1,[13]);body.activate(0);
    const before=body.copy(0);body.resetQueues(1);assert.deepEqual(body.copy(0),before);
    body.appendTuple(0,[1,2,3,77]);body.resetQueues(1,0,true);body.appendTuple(0,[5,6,7]);assert.deepEqual(Array.from(body.copy(0).tuples.slice(0,4)),[5,6,7,77]);
    assert.equal(body.copy(0).state,13);assert.equal(body.copy(0).busy,1);assert.equal(body.copy(0).actionWrite,-1);
    body.applyCharacter(1,2);const dead=body.copy(1);body.resetQueues(2,3);assert.deepEqual(body.copy(1),dead);
  }finally{body.close();}
});
test('pop selects next action or231 without faking graphic callbacks or clearing busy',()=>{const body=createLegacyGameBattleBodies();try{
  body.applyCharacter(0,0);body.resetQueues(1);body.appendActions(0,9,[66,12]);body.activate(0);assert.equal(body.copy(0).state,66);
  assert.equal(body.popAction(0),12);assert.equal(body.popAction(0),231);assert.equal(body.copy(0).busy,1);assert.equal(body.copyState().callbackExecution,'unimplemented');
}finally{body.close();}});
test('real owned wait counter recovers after7200 and resets all affected present bodies with11/38',()=>{const body=createLegacyGameBattleBodies();try{
  for(const slot of [0,1]){body.applyCharacter(slot,0);body.resetQueues(1<<slot);body.appendActions(slot,1,[66]);body.activate(slot);}
  let result=body.wait(3,10,false,7199,4);assert.equal(result.counter,7200);assert.deepEqual(result.recovered,[]);
  result=body.wait(3,10,false,result.counter,4);assert.equal(result.ready,false);assert.equal(result.counter,0);assert.deepEqual(result.recovered,[0,1]);
  for(const slot of [0,1]){const state=body.copy(slot);assert.deepEqual(Array.from(state.actions.slice(0,3)),[11,38,-1]);assert.equal(state.state,11);assert.equal(state.owner,4);}
}finally{body.close();}});
test('wait includes dead actors only for source conditions, and normal position mismatch queues return movement',()=>{const body=createLegacyGameBattleBodies();try{
  body.applyCharacter(0,2);body.resetQueues(1,0,true);body.appendActions(0,1,[66]);body.activate(0);
  assert.equal(body.wait(1,10,false,0,2).ready,true);assert.equal(body.wait(1,23,false,0,2).ready,false);assert.equal(body.wait(1,10,true,0,2).ready,false);
  body.applyCharacter(1,1);body.resetQueues(2);const result=body.wait(2,10,false,0,2);assert.equal(result.repositioned,1);
  assert.deepEqual(Array.from(body.copy(1).actions.slice(0,3)),[11,38,-1]);
}finally{body.close();}});
test('ordered C dead/entry/target updates and source heading quantization retain all22 slots',()=>{const body=createLegacyGameBattleBodies();try{
  for(let i=0;i<22;i++){for(let j=0;j<vectors.character_history.flags.length;j++){
    body.applyCharacter(i,vectors.character_history.flags[j]);assert.deepEqual(body.copy(i).position,layout[i][vectors.character_history.positions[j]]);}
    body.resetQueues(1<<i,1);const state=body.copy(i);assert.equal(state.facing,i<10||i===20?0:4);
    const ideal=(Math.atan2(layout[i].target[1]-layout[i].entry[1],layout[i].target[0]-layout[i].entry[0])*180/Math.PI+360)%360;
    assert.ok(Math.abs(state.angle-ideal)<0.003);
  }
  const copy=body.copyState();copy.bodies[0].actions[0]=77;copy.bodies[0].tuples.fill(0);assert.notEqual(body.copy(0).actions[0],77);
}finally{body.close();}});
test('M consumption uses C-owned actors and remains atomic on malformed packets or wrong explicit state',()=>{const battle=createLegacyGameBattleState();try{
  battle.applyEntry(1,1000);battle.receive(bytes('M|ANR|0|'),9);assert.throws(()=>battle.consumeMotion(context(5)),e=>e.code==='LEGACY_BATTLE_COMMAND_CHARACTERS_PENDING');
  battle.receive(bytes('C|0|0|Original|64|0|0|0|0|0|0|0|0|0|'),9);assert.equal(battle.consumeCharacters().records,1);
  const before=battle.copyMotionQueue();assert.throws(()=>battle.consumeMotion(context(6)));assert.deepEqual(battle.copyMotionQueue(),before);
  assert.equal(battle.consumeMotion(context(5)).nextSubstate,6);assert.equal(battle.copyMotionQueue().readable,false);
  const handle=battle.callCommandManager(context()).created[0];battle.callCommand(handle,context());assert.equal(battle.callCommand(handle,context()).kind,'command-queued');
  assert.equal(battle.copyCommands().bodies.bodies[0].busy,1);assert.equal(battle.copyState().actionExecution,'unimplemented');
}finally{battle.close();}
const malformed=owner('M|ANR|0|');try{const before=malformed.copyState();assert.throws(()=>malformed.load(bytes('M|BAD|'),context(5)));assert.deepEqual(malformed.copyState(),before);}finally{malformed.close();}
});
test('engine input/state ownership rejects accessors and closed/stale calls without invoking context getters',()=>{const raw=bytes('M|END|'),engine=createLegacyGameBattleCommands();try{
  engine.load(raw,context(5));
  let invoked=0;const bad={...context()};Object.defineProperty(bad,'mainState',{get(){invoked++;throw Error();}});const before=engine.copyState();
  assert.throws(()=>engine.callManager(bad));assert.equal(invoked,0);assert.deepEqual(engine.copyState(),before);
  raw.fill(0);const result=engine.callManager(context());assert.equal(engine.copyState().slots[0].type,23);assert.throws(()=>{result.created[0].id=0;},TypeError);
}finally{engine.close();}assert.throws(()=>engine.copyState(),e=>e.code==='LEGACY_BATTLE_CLOSED');
});
