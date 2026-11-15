/** Authored self/guard aliases;real command,callback,wait and round owners remain in control. */
import assert from'node:assert/strict';
import{readFileSync}from'node:fs';
import{guardFixture}from'../game-battle-physical-guard-v1/fixture.mjs';
import{categories}from'../game-legacy-battle-self-family-v1/fixture.mjs';
const assets=JSON.parse(readFileSync(new URL('../game-battle-physical-guard-v1/original-vectors.json',import.meta.url)));
const ctx={mainState:10,substate:6,controlFlags:0,localSlot:0,resourceCode:0,slowEffects:false};
const hit=(flags,amount=12,guard=11)=>[0,0,flags,amount,flags&0x800000?[100040,100041,100050]:null,guard];
export const cases=Object.fromEntries(categories.map(category=>['class'+category,{category,hits:[hit(0x201)]}]));
Object.assign(cases,{
  allSelf:{hits:[hit(0x201,12,0)]},
  aliasPets:{hits:[[20,20,0x201,12,null,21]]},
  guardIsCaster:{hits:[[0,10,0x201,12,null,0]]},
  guardIsTarget:{hits:[[0,10,0x201,12,null,10]]},
  zero:{hits:[hit(0x200,0)]},critical:{hits:[hit(0x203)]},dodge:{hits:[hit(0x208)]},miss:{hits:[hit(0x300)]},
  bothSkip:{hits:[hit(0x308)]},knockout:{hits:[hit(0x221,90)]},scatter:{hits:[hit(0x241)]},
  localScatter:{hits:[hit(0x241)],local:11},allSelfScatter:{hits:[hit(0x241,12,0)]},
  chargeLow:{hits:[hit(0x211)],charge:0x1adb9},chargeHigh:{hits:[hit(0x1201)],charge:0x1ae49},
  reflect:{hits:[hit(0x2201)]},heal:{hits:[hit(0x4201)]},skip:{hits:[hit(0x8201)]},
  RID:{hits:[hit(0x800201)]},messages:{hits:[hit(0x3600201)]},
  combined:{hits:[hit(0x13f82601)]},cleanup:{hits:[hit(0x100201)],initialStatus:true},
  class5Bit4:{category:5,hits:[hit(0x205)]},level9RID:{category:259,level:9,hits:[hit(0x800201)]},
  leadingSelf:{hits:[hit(0x201),[0,10,1,6]]},
  followingSelf:{hits:[[0,10,1,6],hit(0x201)],targetHP:64,hpEvents:1},
  lookahead:{hits:[hit(0x201),[11,10,0x11,7]]},
  negative:{hits:[hit(0x201,-12)]},signedMax:{hits:[hit(0x201,2147483647)]},
});

export async function runSelfGuard(api,kind){
  const d=cases[kind];assert.ok(d,kind);
  const c={name:kind,category:d.category??0,level:d.level??0,variant:0,caster:d.hits[0][0],cost:3,
    local:d.local??0,resource:100080,hits:d.hits,extra:7,flags:d.initialStatus?{'11':0x20}:{}};
  const principal=c.hits[0][0],f=await guardFixture(api,assets,c,{commands:true});
  const initial=f.owner.copyState().bodies.bodies;
  for(const slot of[0,10])if(!initial[slot])f.owner.applyCharacter(slot,0,100080,[0,0],[70,100,10,10]);
  const hp=[],mp=[],recoveries=[];let end=null,drawCount=0,chargeSeen=false,frozenSeen=false,tail=null;
  try{
    f.owner.load(f.raw,{...ctx,localSlot:c.local,substate:5});
    for(let pass=1;pass<=10000;pass++){
      const out=f.owner.callCallbacks({...ctx,localSlot:c.local}),state=f.owner.copyState();
      assert.equal(out.body.stopRequested,false,kind+':parked alias must not invent stop244');
      for(const command of out.commands){assert.notEqual(command.kind,'command-unavailable',command.reason);if(command.wait?.recovered?.length)recoveries.push({pass,slots:[...command.wait.recovered]});}
      for(const e of out.body.events)if(e.kind==='battle-vital')(e.field==='HP'?hp:mp).push([pass,e.slot,e.before,e.value]);
      for(const n of state.playback.nodes)if(n.kind==='physical-guard-charge'){chargeSeen=true;if(d.charge)assert.equal(n.resourceId,d.charge);}
      frozenSeen||=state.bodies.bodies.some(b=>b?.frozen===1);
      f.owner.advanceBackground();const frame=f.frame.step({width:640,height:480},f.owner.copyState().playback,1000);
      f.owner.applyDrawPriorities(frame.depthPriorities);drawCount+=frame.submitted.length;tail=state;
      if(out.manager.kind==='battle-round-drained'){end={pass,round:out.manager.roundCounter,
        bodies:state.bodies.bodies.filter(Boolean).map(b=>[b.slot,b.busy,b.vitals])};break;}
    }
    assert.ok(end&&drawCount>0,kind);assert.equal(end.round,1);assert.ok(end.bodies.every(b=>b[1]===0));
    assert.equal(recoveries.length,1);assert.equal(recoveries[0].pass,7203);
    const bodies=new Map(end.bodies.map(b=>[b[0],b]));
    assert.deepEqual(bodies.get(principal)[2],[70,100,7,10],kind);
    assert.deepEqual(bodies.get(10)[2],principal===10?[70,100,7,10]:[d.targetHP??70,100,10,10],kind);
    assert.equal(hp.length,d.hpEvents??0);assert.deepEqual(mp.map(r=>r.slice(1)),[[principal,10,7]]);
    assert.equal(chargeSeen,!!d.charge);if(d.charge)assert.equal(frozenSeen,true);
    if(d.initialStatus)assert.equal(!!(tail.bodies.bodies[11].dynamicFlags&0x20),true);
    assert.ok(tail.bodies.bodies.filter(Boolean).every(b=>b.resourceId===100080&&b.frozen===0));
    assert.ok(!tail.playback.nodes.some(n=>n.kind==='rider'||n.kind==='attachment'));
    return{kind,hp,mp,recoveries,end,drawCount,chargeSeen,frozenSeen,resources:tail.bodies.bodies.filter(Boolean).map(b=>[b.slot,b.resourceId])};
  }finally{f.close();}
}
