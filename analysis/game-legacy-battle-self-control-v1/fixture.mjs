/** Authored self controls; no readiness injection or direct body-state writes. */
import assert from'node:assert/strict';
import {readFileSync}from'node:fs';
import {sharedFixture,sharedMotion}from'../game-battle-shared-storage-v1/fixture.mjs';
import {categories}from'../game-legacy-battle-self-family-v1/fixture.mjs';
const assets=JSON.parse(readFileSync(new URL('../game-battle-shared-storage-v1/original-fixtures.json',import.meta.url)));
export const cases={
  charge:{category:0,flags:0x11},chargeHigh:{category:0,flags:0x1001},chargeBoth:{category:0,flags:0x1011},
  knockout:{category:0,flags:0x21,amount:90},scatter:{category:0,flags:0x41},
  reflectedKnockout:{category:0,flags:0x2021,amount:90},reflectedScatter:{category:0,flags:0x2041},
  remoteScatter:{category:0,flags:0x2041,local:10},remoteKnockout:{category:0,flags:0x2021,amount:90,local:10},
  bothTerminal:{category:0,flags:0x2061,amount:90},chargedKnockout:{category:0,flags:0x1031,amount:90},
  chargedReflection:{category:0,flags:0x2011},zeroScatter:{category:6,flags:0x40,amount:0},
  dodgeScatter:{category:6,flags:0x48},aliasScatter:{category:6,flags:0x2041,principal:20},
};
for(const category of categories)for(const [name,flags,amount]of [
  ['charge',0x11,12],['chargeHigh',0x1001,12],['chargeBoth',0x1011,12],
  ['knockout',0x21,90],['scatter',0x41,12],['reflectedKnockout',0x2021,90],['reflectedScatter',0x2041,12],
])cases[`class${category}-${name}`]={category,flags,amount};
Object.assign(cases,{
  charged81:{category:81,flags:0x2011,hp:65},
  charged259Level9:{category:259,level:9,flags:0x2011},
  scatter258Level9:{category:258,level:9,flags:0x2041},
  first5Bit4:{category:5,flags:0x2045},
  reflectedChargeThenForeign:{category:6,flags:0x2011,hits:[[0,0,0x2011,12],[0,10,0x11,6]],targetHP:64},
  chargeThenForeign:{category:6,flags:0x11,hits:[[0,0,0x11,12],[0,10,0x1011,6]]},
});
for(const d of Object.values(cases)){
  const suppressed=!!(d.flags&0x108),reflected=!!(d.flags&0x2000)&&!(d.flags&0xc000);
  d.outcome=reflected&&!suppressed?(d.flags&0x40?(d.local??0)===(d.principal??0)?'stop':'departed':d.flags&0x20?'departed':'natural'):'recovery';
  d.hp??=suppressed||d.amount===0?70:Math.max(0,70-(d.amount??12));
}
export const motion=d=>sharedMotion('SKL',[d.category*100+(d.level??0),3,0,...(d.hits??[
  [d.principal===20?50:d.principal??0,d.principal??0,d.flags,d.amount??12,...(d.category===81?[7]:[])]
]).flat(),255]);
export async function runSelfControl(api,kind){
  const d=cases[kind],principal=d.principal??0,f=await sharedFixture(api,assets,{initialSlots:[20],local:d.local??0});
  const hp=[],mp=[],recoveries=[],states=[];let lastKey=null,lastBody=null,end=null,drawCount=0;
  try{
    f.load(motion(d));
    for(let pass=1;pass<=12000;pass++){
      const {out,state,frame}=f.step();f.history.length=0;const b=state.bodies.bodies[principal];
      if(b)lastBody={slot:b.slot,state:b.state,busy:b.busy,vitals:[...b.vitals],dynamicFlags:b.dynamicFlags,savedFlags:b.savedFlags,frozen:b.frozen};
      const key=b?[b.state,b.dynamicFlags,b.savedFlags,b.frozen].join(','):'absent';
      if(key!==lastKey){states.push(b?[pass,b.state,b.actionRead,b.tupleRead,b.busy,b.dynamicFlags,b.savedFlags,b.frozen]:[pass,'absent']);lastKey=key;}
      for(const event of out.body.events)if(event.kind==='battle-vital')(event.field==='HP'?hp:mp).push([pass,event.slot,event.before,event.value]);
      for(const command of out.commands){if(command.kind==='command-unavailable')throw new Error(command.reason);if(command.wait?.recovered?.length)recoveries.push({pass,slots:[...command.wait.recovered]});}
      drawCount+=frame.submitted.length;
      if(out.body.stopRequested||out.manager.kind==='battle-round-drained'){
        end={pass,kind:out.body.stopRequested?'stop':'round',round:out.manager.roundCounter??state.roundCounter,
          bodies:state.bodies.bodies.filter(Boolean).map(row=>[row.slot,row.state,row.busy,row.vitals])};break;
      }
    }
    assert.ok(end&&drawCount>0,kind+': real callback completion');
    assert.equal(lastBody.vitals[0],d.hp,kind+': HP');
    assert.deepEqual(mp.map(row=>row.slice(1)),[[principal,10,7]]);
    assert.equal(lastBody.frozen,0);
    if(d.outcome==='stop'){
      assert.equal(end.kind,'stop');assert.equal(end.round,0);assert.equal(lastBody.state,244);assert.deepEqual(recoveries,[]);
    }else{
      assert.equal(end.kind,'round');assert.equal(end.round,1);
      const present=end.bodies.some(row=>row[0]===principal);
      assert.equal(present,d.outcome!=='departed');
      if(d.outcome==='recovery'){assert.equal(recoveries.length,1);assert.equal(recoveries[0].pass,7203);}
      else{assert.deepEqual(recoveries,[]);assert.ok(end.pass<1000);}
    }
    assert.equal(end.bodies.find(row=>row[0]===10)?.[3][0],d.targetHP??70);
    // Use the same command owner and resource library for the next public entry.
    f.owner.beginEntry(0);f.context.localSlot=0;
    for(const slot of [0,10])f.owner.applyCharacter(slot,0,100114,[0,0],[70,100,10,10]);
    assert.equal(f.owner.copyState().roundCounter,0);
    f.load(sharedMotion('SKL',[0,3,0,0,10,1,6,255]));
    let fresh=null;
    for(let pass=1;pass<=1800;pass++){
      const {out,state}=f.step();f.history.length=0;assert.equal(out.body.stopRequested,false);
      for(const command of out.commands){assert.notEqual(command.kind,'command-unavailable',command.reason);assert.ok(!command.wait?.recovered?.length);}
      if(out.manager.kind==='battle-round-drained'){
        fresh={pass,round:out.manager.roundCounter,bodies:state.bodies.bodies.filter(Boolean).map(row=>[row.slot,row.busy,row.vitals])};break;
      }
    }
    assert.ok(fresh);assert.equal(fresh.round,1);
    assert.deepEqual(fresh.bodies,[[0,0,[70,100,7,10]],[10,0,[64,100,10,10]]]);
    return {kind,outcome:d.outcome,hp,mp,recoveries,states,lastBody,end,drawCount,fresh};
  }finally{f.close();}
}
