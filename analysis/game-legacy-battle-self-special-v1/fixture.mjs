/** Authored self E000 records. Shared production owners execute every callback. */
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {sharedFixture,sharedMotion} from '../game-battle-shared-storage-v1/fixture.mjs';
import {categories} from '../game-legacy-battle-self-family-v1/fixture.mjs';

const assets=JSON.parse(readFileSync(new URL('../game-battle-shared-storage-v1/original-fixtures.json',import.meta.url)));
export const cases={};
for (const category of categories) for (const bits of [0x2000,0x4000,0x6000,0x8000,0xa000,0xc000,0xe000]) {
  cases[`class${category}-${bits.toString(16)}`]={category,hits:[[0,0,bits|1,12,...(category===81?[7]:[])]],
    hp:bits&0x8000?70:bits&0x4000?82:category===81?65:58,natural:bits===0x2000};
}
Object.assign(cases,{
  reflectZero:{category:6,hits:[[0,0,0x2001,0]],hp:70},
  healZero:{category:6,hits:[[0,0,0x4001,0]],hp:70},
  healClamp:{category:6,hits:[[0,0,0x4001,90]],hp:100},
  healNegative:{category:6,hits:[[0,0,0x4001,-12]],hp:58},
  reflectNegative:{category:6,hits:[[0,0,0x2001,-12]],hp:82},
  reflectClamp:{category:6,hits:[[0,0,0x2001,90]],hp:0},
  healWrap:{category:6,hits:[[0,0,0x4001,2147483647]],hp:-2147483579},
  reflectWrap:{category:6,hits:[[0,0,0x2001,-2147483648]],hp:0},
  aliasHeal:{category:6,principal:20,hits:[[50,20,0x4001,12]],hp:82},
  aliasReflect:{category:6,principal:20,hits:[[50,20,0x2001,12]],hp:58},
  class5Bit4Heal:{category:5,hits:[[0,0,0x4005,12]],hp:82},
  criticalReflect:{category:5,hits:[[0,0,0x2003,12]],hp:58},
  criticalHeal:{category:84,hits:[[0,0,0x4003,12]],hp:82},
  dodgeReflect:{category:6,hits:[[0,0,0x2008,12]],hp:70},
  missHeal:{category:6,hits:[[0,0,0x4100,12]],hp:70},
  followingReflect:{category:6,hits:[[0,10,1,6],[0,0,0x2001,12]],hp:58,targetMP:4},
  followingHeal:{category:6,hits:[[0,10,1,6],[0,0,0x4001,12]],hp:82,targetMP:4},
  leadingReflect:{category:6,hits:[[0,0,0x2001,12],[0,10,1,6]],hp:58,targetHP:64},
  leadingHeal:{category:6,hits:[[0,0,0x4001,12],[0,10,1,6]],hp:82},
  reflectThenHeal:{category:6,hits:[[0,0,0x2001,12],[0,0,0x4001,12]],hp:70},
  healThenReflect:{category:6,hits:[[0,0,0x4001,12],[0,0,0x2001,12]],hp:82},
});
for(const kind of ['reflectZero','reflectNegative','reflectClamp','reflectWrap','aliasReflect','criticalReflect','followingReflect','leadingReflect'])cases[kind].natural=true;
export const motion=definition=>sharedMotion('SKL',[definition.category*100+(definition.level??0),3,0,...definition.hits.flat(),255]);

export async function runSelfSpecial(api,kind){
  const definition=cases[kind],principal=definition.principal??0;
  const f=await sharedFixture(api,assets,{initialSlots:[20]});
  const hp=[],mp=[],recoveries=[],classes=[];let end=null,drawCount=0,prior=null;
  try{
    f.load(motion(definition));
    for(let pass=1;pass<=11000;pass++){
      const {out,state,frame}=f.step();f.history.length=0;
      const body=state.bodies.bodies[principal];
      if(body&&body.classCode!==prior){classes.push([pass,body.classCode,body.state,body.actionRead,body.tupleRead]);prior=body.classCode;}
      for(const event of out.body.events)if(event.kind==='battle-vital')(event.field==='HP'?hp:mp).push([pass,event.slot,event.before,event.value]);
      for(const command of out.commands){assert.notEqual(command.kind,'command-unavailable',command.reason);
        if(command.wait?.recovered?.length)recoveries.push({pass,slots:[...command.wait.recovered]});}
      drawCount+=frame.submitted.length;
      if(out.manager.kind==='battle-round-drained'){
        end={pass,round:out.manager.roundCounter,bodies:state.bodies.bodies.filter(Boolean).map(b=>[b.slot,b.busy,b.vitals])};break;
      }
    }
    assert.ok(end&&drawCount>0,'actual callbacks must finish and draw');
    const bodies=new Map(end.bodies.map(row=>[row[0],row]));
    assert.deepEqual(bodies.get(principal)[2],[definition.hp,100,7,10],kind);
    assert.deepEqual(bodies.get(10)[2],[definition.targetHP??70,100,definition.targetMP??10,10],kind);
    assert.equal(end.round,1);assert.ok(end.bodies.every(row=>row[1]===0));
    if(definition.natural){assert.deepEqual(recoveries,[]);assert.ok(end.pass<1000);}
    else{assert.equal(recoveries.length,1);assert.equal(recoveries[0].pass,7203);}
    assert.deepEqual(classes.map(row=>row[1]),[-1,definition.category,-1]);
    assert.equal(mp[0][1],principal);assert.deepEqual(mp[0].slice(2),[10,7]);
    if(kind==='class81-2000')assert.deepEqual(hp.map(row=>row.slice(2)),[[70,58],[58,65]]);
    return {kind,hp,mp,classes,recoveries,end,drawCount};
  }finally{f.close();}
}
