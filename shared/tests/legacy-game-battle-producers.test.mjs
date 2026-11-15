import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import * as api from '../index.mjs';
import {sharedContext,sharedFixture,sharedMotion} from '../../analysis/game-battle-shared-storage-v1/fixture.mjs';

const assets=JSON.parse(readFileSync(new URL('../../analysis/game-battle-shared-storage-v1/original-fixtures.json',import.meta.url)));
const text=bytes=>String.fromCharCode(...bytes);
const bytes=source=>Uint8Array.from(source,ch=>ch.charCodeAt(0));
const actions=b=>Array.from(b.actions.slice(0,b.actionWrite+1));
const tuple=(b,index)=>Array.from(b.tuples.slice(index*4,index*4+4));
const addGMN=(slot,mode,selected,field=0)=>sharedMotion('GMN',[slot,mode,selected,204,field,'Original Guardian',100120,123,70,100,10,10,1]);
const removeGMN=slot=>sharedMotion('GMN',[slot,0]);
const together=(first,second)=>Uint8Array.from([...first,...second.slice(2)]);
const selfRow=(principal,destination,flags=0,extra=0,name='First')=>
  [principal,destination,flags,name,100120,extra,123,40,100,8,10,0,'Second',100121,456,70,100,10,10,0];
const skill404=({level=1,principal=0,destination=5,flags=0,extra=0,hitRows=[[10,1,12]],exchanges=null}={})=>
  sharedMotion('SKL',[40400+level,99,7,principal,...(exchanges??selfRow(principal,destination,flags,extra)),...hitRows.flat(),255]);
const findNode=(state,slot)=>state.playback.nodes.find(node=>node.kind==='body'&&node.slot===slot&&!node.deleted);

function nextCommand(f,kind){
  for(let i=0;i<400;i++){
    const step=f.step();
    const command=step.out.commands.find(c=>c.kind===kind);
    if(command)return {...step,command};
  }
  assert.fail('command did not reach '+kind);
}

for(const [wireSlot,slot,side,selected] of [[50,20,0,1],[51,21,10,11]]){
  test('GMN mode 1 owns both formation queues, opacity, field and dismiss on side '+side,async()=>{
    const f=await sharedFixture(api,assets,{initialSlots:[1,11,slot]});
    try{
      const before=findNode(f.owner.copyState(),slot).id;
      f.load(together(addGMN(wireSlot,1,selected,1000),removeGMN(wireSlot)));
      const {state,command,out}=nextCommand(f,'command-gmn');
      const body=state.bodies.bodies[slot];
      assert.equal(command.leader,side);
      assert.equal(command.presentation,2);
      assert.notEqual(findNode(state,slot).id,before);
      assert.equal(text(body.nameBytes),'Original Guardian');
      assert.deepEqual(body.vitals,[70,100,10,10]);
      assert.deepEqual(actions(body),[78,170,169,0,35,162,6,10,24,71,72]);
      assert.deepEqual(tuple(body,0),[13,0,40,1000]);
      assert.deepEqual(tuple(body,1),[side,0,0,0]);
      assert.deepEqual(actions(state.bodies.bodies[side]),[35,162,71,72,167,0]);
      assert.deepEqual(tuple(state.bodies.bodies[side],0),[slot,2,0,1000]);
      assert.deepEqual(actions(state.bodies.bodies[selected]),[35,162,168]);
      assert.deepEqual(findNode(state,slot).gmnPresentation.birthIntegerBoxes.map(box=>box.value),[70,100,10,10]);
      assert.deepEqual(out.body.events.filter(e=>e.kind==='sound').map(e=>e.value),[56,204]);

      const result=f.drain();
      assert.equal(result?.out.manager.kind,'battle-round-drained');
      assert.equal(result.state.bodies.bodies[slot],null);
      assert.deepEqual(result.state.playback.gmnPaletteRequest,{index:0,frames:40});
      assert.ok(f.history.some(s=>s.playback.gmnPaletteRequest?.index===13));
      assert.ok(f.history.some(s=>findNode(s,selected)?.opacity===253));
      assert.ok(f.history.some(s=>findNode(s,side)?.opacity===252));
      const fade=f.history.find(s=>findNode(s,selected)?.opacity===253);
      const fadeFrame=f.frame.step({width:640,height:480},fade.playback,1000,1);
      assert.ok(fadeFrame.drawPlan.commands.some(c=>c.image.color>>>24===253&&!(c.image.flags&8)&&!Object.hasOwn(c,'opacity')));
      assert.equal((await f.library.startRender(fadeFrame.drawPlan).done).rgba.length,640*480*4);
      assert.ok(f.history.some(s=>s.playback.nodes.some(n=>n.kind==='shared-field'&&n.resourceId===1000)));
      assert.deepEqual(f.events.filter(e=>e.kind==='battle-motion-body-removed').map(e=>e.slot),[slot]);
      assert.ok(f.events.some(e=>e.kind==='sound'&&e.value===56&&e.position[0]===320));
      assert.ok(f.events.some(e=>e.kind==='sound'&&e.value===204&&e.slot===slot));
      for(let i=0;i<130;i++)f.step();
      assert.ok(f.owner.copyState().playback.nodes.every(n=>n.kind!=='shared-field'&&n.kind!=='gmn-notice'));
    }finally{f.close();}
  });
}

test('GMN mode 2 exercises both random presentation bytes and the timed particle callback',async()=>{
  const modes=new Set();
  for(let phase=0;phase<10&&modes.size<2;phase++){
    const f=await sharedFixture(api,assets);
    try{
      for(let i=0;i<phase;i++)f.owner.advanceBackground();
      f.load(addGMN(50,2,0));
      const {state,command}=nextCommand(f,'command-gmn');
      modes.add(command.presentation);
      assert.ok(state.playback.nodes.some(n=>n.kind==='gmn-particle-timer'));
      assert.deepEqual(state.playback.nodes.find(n=>n.kind==='gmn-notice').gmnNotice.lines.map(text),['Original Guardian']);
      if(command.presentation===1){
        assert.equal(findNode(state,20).opacity,0);
        assert.equal(findNode(state,20).actorFlags&2,2);
        assert.deepEqual(actions(state.bodies.bodies[20]).slice(6),[166,24,71,72]);
      }else assert.deepEqual(actions(state.bodies.bodies[20]).slice(6),[6,10,24,71,72]);
      assert.ok(f.drain());
      assert.ok(f.history.some(s=>s.playback.nodes.some(n=>n.kind==='gmn-particle'&&n.resourceId===0x1af84)));
    }finally{f.close();}
  }
  assert.deepEqual([...modes].sort(),[1,2]);
});

test('undefined GMN mode and absent removal leave the body registry intact',async()=>{
  for(const motion of [addGMN(50,3,0),removeGMN(50)]){
    const f=await sharedFixture(api,assets);
    try{
      f.load(motion);
      f.step();
      const before=f.owner.copyState();
      const {state,command}=nextCommand(f,'command-unavailable');
      assert.ok(command.reason.startsWith('gmn-'));
      assert.equal(state.bodies.bodies[20],null);
      assert.deepEqual(state.playback.nodes.map(n=>n.id),before.playback.nodes.map(n=>n.id));
    }finally{f.close();}
  }
});

const expectedGeometry=[
  // Coordinates independently transcribed from 5337b0/533810.
  [0,0,10,[440,70],[340,70],[30,250]],
  [1,0,10,[328,328],[273,278],[158,178]],
];
for(const [level,principal,hitSlot,approach,turn,returnTo] of expectedGeometry){
  test('SKL404 level '+level+' creates the sourced routes and two hidden bodies before 222',async()=>{
    const f=await sharedFixture(api,assets,{mounts:[principal]});
    try{
      f.load(skill404({level,principal,hitRows:[[hitSlot,1,12]]}));
      const {state}=nextCommand(f,'command-skill404');
      const current=state.bodies.bodies[principal];
      assert.deepEqual(actions(current),[24,72,38,147,202,225,39,222]);
      assert.deepEqual(tuple(current,0),[hitSlot,0,0,0]);
      assert.deepEqual(tuple(current,1).slice(0,2),approach);
      assert.deepEqual(tuple(current,2).slice(0,2),turn);
      assert.deepEqual(tuple(current,3),[principal,1,principal,5]);
      const handoff=state.playback.attachedRID.handoffs[0];
      assert.ok(handoff.firstId<handoff.secondId&&handoff.secondId<handoff.id);
      assert.deepEqual(handoff.birthIntegerBoxes.map(box=>box.value),[40,100,8,10,70,100,10,10]);
      const first=state.playback.attachedRID.bodies.find(b=>b.id===handoff.firstId);
      const second=state.playback.attachedRID.bodies.find(b=>b.id===handoff.secondId);
      assert.equal(first.callbackEnabled,false);
      assert.equal(second.callbackEnabled,false);
      assert.equal(state.playback.attachedRID.registry[5],null);
      assert.deepEqual(actions(first.body),[24,71,72,7,11,10]);
      assert.deepEqual(actions(second.body),[24,227,202,226,34,0,7,11,10]);
      assert.deepEqual(tuple(second.body,1).slice(0,2),returnTo);

      const last=f.drain();
      assert.equal(last?.out.manager.kind,'battle-round-drained');
      assert.ok(last.state.playback.attachedRID.handoffs[0].complete);
      assert.ok(last.state.playback.nodes.every(n=>n.id!==handoff.id));
      assert.deepEqual(f.events.filter(e=>e.kind==='battle-skill404-registered').map(e=>e.slot),[5,0]);
      assert.deepEqual(last.state.bodies.bodies[0].vitals,[40,100,8,10]);
      assert.deepEqual(last.state.bodies.bodies[5].vitals,[70,100,10,10]);
      assert.deepEqual(last.state.bodies.bodies[hitSlot].vitals,[58,100,10,10]);
      assert.ok(f.history.some(s=>s.bodies.bodies[0]?.state===225));
      assert.ok(f.history.some(s=>s.bodies.bodies[0]?.state===222));
      assert.ok(f.history.some(s=>s.bodies.bodies[hitSlot]?.state===228));
    }finally{f.close();}
  });
}

test('SKL404 coordinate cells cover all four source formation groups',async()=>{
  const vectors=[
    [0,1,[195,465],[295,465],[610,290]],
    [0,6,[135,420],[235,420],[545,240]],
    [0,11,[440,70],[340,70],[30,250]],
    [0,16,[500,121],[400,121],[90,300]],
    [9,1,[371,176],[426,226],[545,325]],
    [9,6,[371,176],[426,226],[545,325]],
    [9,11,[391,292],[336,242],[222,142]],
    [9,16,[391,292],[336,242],[222,142]],
  ];
  for(const [level,slot,approach,turn,returnTo] of vectors){
    const f=await sharedFixture(api,assets,{mounts:[0],initialSlots:[slot]});
    try{
      f.load(skill404({level,hitRows:[[slot,1,12]]}));
      const {state}=nextCommand(f,'command-skill404');
      assert.deepEqual(tuple(state.bodies.bodies[0],1).slice(0,2),approach);
      assert.deepEqual(tuple(state.bodies.bodies[0],2).slice(0,2),turn);
      const {secondId}=state.playback.attachedRID.handoffs[0];
      const second=state.playback.attachedRID.bodies.find(b=>b.id===secondId).body;
      assert.deepEqual(tuple(second,1).slice(0,2),returnTo);
    }finally{f.close();}
  }
});

for(const [label,hitRows,expected] of [
  ['heal',[[10,0x4001,20]],[[10,90]]],
  ['reflection',[[10,0x2001,12]],[[5,58]]],
  ['skip',[[10,0x8001,12]],[]],
  ['dodge',[[10,8,12]],[]],
  ['afterimage',[[10,0x100,12]],[]],
  ['repeated target',[[10,1,12],[10,1,9]],[[10,58],[10,49]]],
  ['KO',[[10,0x21,80]],[[10,0]]],
  ['RID result metadata',[[10,0x800001,12,100120,100121,0]],[[10,58]]],
]){
  test('SKL404 '+label+' has sourced result ownership and command release',async()=>{
    const f=await sharedFixture(api,assets,{mounts:[0]});
    try{
      f.load(skill404({hitRows}));
      const last=f.drain();
      assert.equal(last?.out.manager.kind,'battle-round-drained');
      assert.deepEqual(f.events.filter(e=>e.kind==='battle-vital').map(e=>[e.slot,e.value]),expected);
      if(label==='KO')assert.equal(last.state.bodies.bodies[10],null);
      if(label==='RID result metadata'){
        assert.equal(last.state.bodies.bodies[10].resourceId,100121);
        assert.ok(last.state.playback.nodes.some(n=>n.kind==='rider'&&n.parentId===findNode(last.state,10).id));
      }
    }finally{f.close();}
  });
}

test('SKL404 alternate exchange removes the second body after flight and preserves the first',async()=>{
  const f=await sharedFixture(api,assets,{mounts:[0]});
  try{
    f.load(skill404({flags:0x40,extra:100114}));
    const last=f.drain();
    assert.ok(last);
    assert.equal(last.state.bodies.bodies[5],null);
    assert.equal(last.state.bodies.bodies[0].linkedResources[1],100114);
    assert.ok(f.history.some(s=>s.bodies.bodies[5]?.state===229));
    assert.ok(f.history.some(s=>s.playback.nodes.filter(n=>n.kind==='casting-scatter').length===40));
    assert.ok(f.events.some(e=>e.kind==='battle-motion-body-removed'&&e.slot===5));
  }finally{f.close();}
});

test('SKL404 consumes self rows in packet order and marks the last replacement metadata',async()=>{
  const f=await sharedFixture(api,assets,{mounts:[0]});
  try{
    const exchanges=[...selfRow(0,5,0,100114,'Discarded'),...selfRow(0,6,0x200000,0,'Retained')];
    f.load(skill404({exchanges}));
    const {state,command}=nextCommand(f,'command-skill404');
    assert.equal(command.destination,6);
    assert.equal(command.exchanges,2);
    assert.equal(state.playback.attachedRID.handoffs[0].birthIntegerBoxes.length,16);
    const last=f.drain();
    assert.equal(text(last.state.bodies.bodies[0].nameBytes),'Retained');
    assert.equal(last.state.bodies.bodies[5],null);
    assert.ok(f.history.some(s=>s.bodies.bodies[6]?.state===230));
  }finally{f.close();}
});

test('SKL404 rejects a missing mounted rider before allocating or appending',async()=>{
  const f=await sharedFixture(api,assets);
  try{
    f.load(skill404());
    f.step();
    const before=f.owner.copyState();
    const {state,command}=nextCommand(f,'command-unavailable');
    assert.equal(command.reason,'skill404-rider-context');
    assert.equal(state.playback.attachedRID,undefined);
    assert.deepEqual(state.bodies.bodies,before.bodies.bodies);
    assert.equal(state.playback.seed,before.playback.seed);
  }finally{f.close();}
});

test('SKL404 sends a real attached RID suffix through its own 221 handoff',async()=>{
  const f=await sharedFixture(api,assets,{mounts:[0,10]});
  try{
    const tail=sharedMotion('RID',[0,10,16,0,'Tail First',100120,0,0,51,100,9,10,0,'Tail Second',100121,0,0,100,5,10,2]);
    f.load(together(skill404(),tail));
    const {command}=nextCommand(f,'command-skill404');
    assert.equal(command.attachedRID,1);
    const last=f.drain();
    assert.ok(last);
    assert.deepEqual(last.state.playback.attachedRID.handoffs.map(h=>[...h.slots,h.complete]),[[0,5,true],[10,16,true]]);
    assert.ok(f.history.some(s=>s.bodies.bodies[10]?.state===221));
    assert.equal(text(last.state.bodies.bodies[10].nameBytes),'Tail First');
  }finally{f.close();}
});

test('SKL404 same-slot exchange preserves the falling rider and the bounded source wait',async()=>{
  const f=await sharedFixture(api,assets,{mounts:[0]});
  try{
    f.load(skill404({destination:0}));
    assert.equal(f.drain(330),null);
    const state=f.owner.copyState();
    assert.equal(state.playback.attachedRID.handoffs[0].complete,true);
    assert.deepEqual(f.events.filter(e=>e.kind==='battle-skill404-registered').map(e=>[e.slot,text(e.nameBytes)]),
      [[0,'Second'],[0,'First']]);
    assert.ok(state.slots.some(command=>command?.phase===1&&command.waitCounter>0));
    assert.equal(state.bodies.bodies[10].vitals[0],70);
  }finally{f.close();}
});

test('C and M ingress publish each SKL404 replacement only when its registry cell changes',async()=>{
  const f=await sharedFixture(api,assets);
  const battle=api.createLegacyGameBattleState();
  try{
    const {graphics,animations}=f.library.catalogs();
    battle.configureResources(0);
    battle.configureBodyPlayback({animations,geometry:f.library.geometry,seed:12345,initialPhase:0,
      alternativeRenderer:false,staticFlip:false,screenOffset:[0,0]});
    battle.configureSkills({graphics});
    battle.configureFrames({graphics});
    battle.applyEntry(1,1000);
    battle.receive(bytes('P|0|0|0|1EF|0|FFFFFFFF|'),10);
    const cRow=(slot,name,rider)=>[slot,name,'18722','0','1','46','64','A','A','0',rider,'0',''].join('|');
    battle.receive(bytes('C|0|'+cRow('0','Original','18722')+cRow('A','Target','0')),10);
    assert.deepEqual(battle.consumeCharacters().slots,[0,10]);
    battle.receive(skill404(),10);
    assert.equal(battle.consumeMotion({...sharedContext,substate:5}).commands,1);
    let complete=false;
    const registered=[];
    for(let i=0;i<600;i++){
      const step=battle.callCallbacks(sharedContext);
      for(const event of step.body.events.filter(e=>e.kind==='battle-skill404-registered')){
        registered.push(event.slot);
        assert.equal(text(battle.copyState().rows[event.slot].nameBytes),event.slot===0?'First':'Second');
        assert.equal(battle.copyState().rows[event.slot].metadataOrigin,'SKL404');
      }
      if(step.manager.kind==='battle-round-drained'){complete=true;break;}
    }
    assert.equal(complete,true);
    assert.deepEqual(registered,[5,0]);
  }finally{battle.close();f.close();}
});
