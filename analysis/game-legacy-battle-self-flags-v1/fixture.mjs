/** Authored result words; production callbacks own every body and round mutation. */
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {sharedFixture,sharedMotion} from '../game-battle-shared-storage-v1/fixture.mjs';
import {categories} from '../game-legacy-battle-self-family-v1/fixture.mjs';
const assets=JSON.parse(readFileSync(new URL('../game-battle-shared-storage-v1/original-fixtures.json',import.meta.url)));
export const opaqueMask=0xe4070080;
export const opaqueBits=[0x80,0x10000,0x20000,0x40000,0x4000000,0x20000000,0x40000000,0x80000000];
export const cases=Object.fromEntries(categories.map(category=>['class'+category,{category,flags:0x805}]));
for(const bit of opaqueBits)cases['opaque-'+bit.toString(16)]={flags:(bit|1)>>>0};
Object.assign(cases,{
  allOpaque:{flags:(opaqueMask|1)>>>0},
  opaqueReflect:{flags:(opaqueMask|0x2001)>>>0,natural:true},
  impact:{flags:5,impact:110000},reaction:{flags:0x801},
  partial:{flags:0x801,resource:100081,hp:70,reaction9:true},
  partialOpaque:{flags:(opaqueMask|0x801)>>>0,resource:100081,hp:70,reaction9:true},
  spinDodge:{flags:0x8000008,hp:70,spin:true},
  spinCharge:{flags:0x8001008,hp:70,spin:true,charge:0x1ae49},
  allBits:{flags:0xffffffff,hp:70},
  class5AllBits:{category:5,flags:0xffffffff,hp:70},
});
export async function runSelfFlags(api,kind){
  const d=cases[kind];assert.ok(d,kind);
  const flags=d.flags>>>0,category=d.category??0;
  const words=[category*100+(d.level??0),3,0,0,0,flags,12,
    ...(category===81?[7]:[]),...(flags&0x800000?[100020,100061,100050]:[]),...(flags&0x200?[0]:[]),255];
  const f=await sharedFixture(api,assets,{resource:d.resource??100114});
  const hp=[],mp=[],recoveries=[],reactions=new Set(),facings=new Set(),resources=new Set();
  let end=null,drawCount=0,spinSeen=false,chargeSeen=false;
  try{
    f.load(sharedMotion('SKL',words));
    for(let pass=1;pass<=10000;pass++){
      const {out,state,frame}=f.step();f.history.length=0;
      assert.equal(out.body.stopRequested,false,kind);
      for(const command of out.commands){
        assert.notEqual(command.kind,'command-unavailable',command.reason);
        if(command.wait?.recovered?.length)recoveries.push({pass,slots:[...command.wait.recovered]});
      }
      for(const event of out.body.events)if(event.kind==='battle-vital')
        (event.field==='HP'?hp:mp).push([pass,event.slot,event.before,event.value]);
      const body=state.bodies.bodies[0];
      spinSeen||=body?.state===29;
      for(const n of state.playback.nodes){
        resources.add(n.resourceId);
        if(n.kind==='body'&&n.slot===0){facings.add(n.animation.lastFacing);if(body?.state===25)reactions.add(n.animation.lastAction);}
        if(n.kind==='physical-guard-charge'&&(!d.charge||n.resourceId===d.charge))chargeSeen=true;
      }
      drawCount+=frame.submitted.length;
      if(out.manager.kind==='battle-round-drained'){
        end={pass,round:out.manager.roundCounter,bodies:state.bodies.bodies.filter(Boolean).map(b=>[b.slot,b.busy,b.vitals])};break;
      }
    }
    assert.ok(end&&drawCount>0,kind+': callback completion and rendered submissions');
    assert.equal(end.round,1);assert.ok(end.bodies.every(b=>b[1]===0));
    const bodies=new Map(end.bodies.map(b=>[b[0],b]));
    assert.deepEqual(bodies.get(0)[2],[d.hp??58,100,7,10],kind);
    assert.deepEqual(bodies.get(10)[2],[70,100,10,10],kind);
    assert.deepEqual(mp.map(r=>r.slice(1)),[[0,10,7]]);
    assert.equal(hp.length,(d.hp??58)===70?0:1);
    if(d.impact)assert.ok(resources.has(d.impact),kind+': impact resource');
    if(d.reaction9)assert.ok(reactions.has(9),kind+': actual partial reaction animation');
    if(d.spin)assert.equal(spinSeen,true,kind+': original body29');
    if(d.charge)assert.equal(chargeSeen,true,kind+': original charge resource');
    if(d.natural){assert.deepEqual(recoveries,[]);assert.ok(end.pass<1500);}
    else{assert.equal(recoveries.length,1);assert.equal(recoveries[0].pass,7203);}
    return{kind,hp,mp,recoveries,end,drawCount,spinSeen,chargeSeen,reactions:[...reactions],facings:[...facings]};
  }finally{f.close();}
}
