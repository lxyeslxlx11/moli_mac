/** Authored self metadata records; production callbacks own every mutation and cursor. */
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {sharedFixture,sharedMotion} from '../game-battle-shared-storage-v1/fixture.mjs';
import {categories} from '../game-legacy-battle-self-family-v1/fixture.mjs';

const assets=JSON.parse(readFileSync(new URL('../game-battle-shared-storage-v1/original-fixtures.json',import.meta.url)));
const messages=[0x5739,0x573a,0x573a,0x5738];
const rid=[100040,100041,100050];
const hit=(category,flags,amount=12,resources=[])=>[0,0,flags,amount,...(category===81?[7]:[]),...resources];
export const cases={};
for(const category of categories){
  cases['messages-class'+category]={category,hits:[hit(category,0x3600001)],messages};
  cases['RID-class'+category]={category,hits:[hit(category,0x800001,12,rid)],messages:[0x5738],resource:100041,rider:114006,attachment:100050,resourceSteps:[100041],cursorSteps:[3]};
}
Object.assign(cases,{
  combinedRIDNotice:{category:0,hits:[hit(0,0x13f82401,0,[100040,100061,100050])],messages:[0x5739,0x573a,0x5738,0x573a,0x5738,0x57bb],soundCount:2,initialStatus:true,statusRetained:true,resource:100061,rider:114006,attachment:100050,resourceSteps:[100061],cursorSteps:[4],hp:70,natural:true},
  combinedRIDResult:{category:0,hits:[hit(0,0x13f82401,12,[100040,100061,100050])],messages:[0x5739,0x573a,0x5738,0x573a,0x5738],soundCount:2,initialStatus:true,statusRetained:true,resource:100061,rider:114006,attachment:100050,resourceSteps:[100061],cursorSteps:[4],natural:true},
  messagesReflect:{category:0,hits:[hit(0,0x3602001)],messages,natural:true},
  messagesMiss:{category:0,hits:[hit(0,0x3600100)],messages,hp:70},
  RIDReflect:{category:0,hits:[hit(0,0x802001,12,rid)],messages:[0x5738],resource:100041,rider:114006,attachment:100050,resourceSteps:[100041],cursorSteps:[4],natural:true},
  RIDHeal:{category:6,hits:[hit(6,0x804001,12,rid)],messages:[0x5738],resource:100041,rider:114006,attachment:100050,resourceSteps:[100041],cursorSteps:[3],hp:82},
  RIDMiss:{category:0,hits:[hit(0,0x800100,12,rid)],messages:[0x5738],resource:100041,rider:114006,attachment:100050,resourceSteps:[100041],cursorSteps:[3],hp:70},
  RIDWithdraw:{category:0,hits:[hit(0,0x800001,12,[100060,0,0])],messages:[0x5738],initialRID:true,resource:100060,rider:null,attachment:null,resourceSteps:[100060],cursorSteps:[3]},
  RIDAlias:{category:0,principal:20,hits:[[50,20,0x800001,12,...rid]],messages:[0x5738],resource:100041,rider:114006,attachment:100050,resourceSteps:[100041],cursorSteps:[3]},
  // Authored100041 has no attack signal;100061 does. Both paths retain real animation ownership.
  RIDThenForeignSilent:{category:0,hits:[hit(0,0x802001,12,rid),[0,10,1,6]],messages:[0x5738],resource:100041,rider:114006,attachment:100050,resourceSteps:[100041],cursorSteps:[4]},
  RIDThenForeign:{category:0,hits:[hit(0,0x802001,12,[100040,100061,100050]),[0,10,1,6]],messages:[0x5738],resource:100061,rider:114006,attachment:100050,resourceSteps:[100061],cursorSteps:[4],targetHP:64,natural:true},
  repeatedRIDSilent:{category:0,hits:[hit(0,0x802001,12,rid),hit(0,0x802001,12,[100060,100061,100050])],messages:[0x5738],resource:100041,rider:114006,attachment:100050,resourceSteps:[100041],cursorSteps:[4]},
  repeatedRID:{category:0,hits:[hit(0,0x802001,12,[100040,100061,100050]),hit(0,0x802001,12,[100060,100114,100050])],messages:[0x5738,0x5738],resource:100114,rider:114009,attachment:100050,resourceSteps:[100061,100114],cursorSteps:[4,8],hp:46,natural:true},
  cleanup:{category:0,hits:[hit(0,0x100001)],initialStatus:true,statusRetained:false},
  cleanupZero:{category:6,hits:[hit(6,0x100001,0)],initialStatus:true,statusRetained:true,hp:70},
  cleanupMiss:{category:0,hits:[hit(0,0x100100)],initialStatus:true,statusRetained:true,hp:70},
  cleanupReflect:{category:0,hits:[hit(0,0x102001)],initialStatus:true,statusRetained:true,natural:true},
  cleanupHeal:{category:0,hits:[hit(0,0x104001)],initialStatus:true,statusRetained:true,hp:82},
  conditionClass75:{category:75,hits:[hit(75,0x80001)],initialStatus:true,statusRetained:true},
  conditionClass259:{category:259,hits:[hit(259,0x80001)],initialStatus:true,statusRetained:true},
  zeroNotice:{category:6,hits:[hit(6,0x10000001,0)],messages:[0x57bb],hp:70},
  zeroNoticeReflect:{category:0,hits:[hit(0,0x10002001,0)],messages:[0x57bb],hp:70,natural:true},
  zeroNoticeHeal:{category:0,hits:[hit(0,0x10004001,0)],messages:[0x57bb],hp:70},
  zeroNoticeMiss:{category:0,hits:[hit(0,0x10000100,0)],messages:[],hp:70},
  nonzeroNotice:{category:0,hits:[hit(0,0x10000001)],messages:[]},
  overrideImpact:{category:0,hits:[hit(0,0x401)],impact:0x1ae12},
  overrideReflect:{category:0,hits:[hit(0,0x2401)],impact:0x1ae12,natural:true},
});
export const motion=d=>sharedMotion('SKL',[d.category*100+(d.level??0),3,0,...d.hits.flat(),255]);

export async function runSelfMetadata(api,kind){
  const d=cases[kind],principal=d.principal??0;
  assert.ok(d,kind);
  const f=await sharedFixture(api,assets,{initialSlots:[20],flags:d.initialStatus?{[principal]:0x20}:{},mounts:d.initialRID?[principal]:[]});
  if(d.initialRID)f.owner.applyCharacter(principal,0,100114,[100114,100050],[70,100,10,10]);
  const hp=[],mp=[],recoveries=[],metadata=[],metadataSounds=[],resourceSteps=[],cursorSteps=[];
  const newResources=[],seen=new Set();let end=null,drawCount=0,prior=100114,finalPlayback=null,finalBody=null;
  try{
    f.load(motion(d));
    for(let pass=1;pass<=11000;pass++){
      const {out,state,frame}=f.step();f.history.length=0;
      for(const event of out.body.events)if(event.kind==='battle-vital')(event.field==='HP'?hp:mp).push([pass,event.slot,event.before,event.value]);
      for(const event of out.body.events)if(event.kind==='sound'&&event.value===0xd6)metadataSounds.push([pass,event.slot]);
      for(const command of out.commands){assert.notEqual(command.kind,'command-unavailable',command.reason);if(command.wait?.recovered?.length)recoveries.push({pass,slots:[...command.wait.recovered]});}
      const body=state.bodies.bodies[principal];
      if(body&&body.resourceId!==prior){resourceSteps.push(body.resourceId);cursorSteps.push(body.tupleRead);prior=body.resourceId;}
      for(const node of state.playback.nodes)if(!seen.has(node.id)){
        seen.add(node.id);newResources.push([pass,node.kind,node.resourceId]);
        if(node.kind==='message'&&[0x5738,0x5739,0x573a,0x57bb].includes(node.resourceId))metadata.push(node.resourceId);
      }
      drawCount+=frame.submitted.length;finalPlayback=state.playback;finalBody=body;
      if(out.manager.kind==='battle-round-drained'){
        end={pass,round:out.manager.roundCounter,bodies:state.bodies.bodies.filter(Boolean).map(b=>[b.slot,b.busy,b.vitals])};break;
      }
    }
    assert.ok(end&&drawCount>0,kind+': callbacks must finish and draw');
    assert.equal(end.round,1);assert.ok(end.bodies.every(row=>row[1]===0));
    const bodies=new Map(end.bodies.map(row=>[row[0],row]));
    assert.deepEqual(bodies.get(principal)[2],[d.hp??58,100,7,10],kind);
    assert.deepEqual(bodies.get(10)[2],[d.targetHP??70,100,10,10],kind);
    assert.deepEqual(metadata,d.messages??[],kind+': source metadata order');
    if(d.soundCount!==undefined)assert.deepEqual(metadataSounds.map(row=>row[1]),Array(d.soundCount).fill(principal));
    assert.deepEqual(resourceSteps,d.resourceSteps??[],kind+': source RID updates');
    assert.deepEqual(cursorSteps,d.cursorSteps??[],kind+': source RID tuple progression');
    assert.equal(finalBody.resourceId,d.resource??100114);
    const parent=finalPlayback.nodes.find(n=>n.kind==='body'&&n.slot===principal);
    const children=finalPlayback.nodes.filter(n=>n.parentId===parent.id&&!n.deleted);
    if(d.resource!==undefined){
      assert.equal(children.find(n=>n.kind==='rider')?.resourceId??null,d.rider);
      assert.equal(children.find(n=>n.kind==='attachment')?.resourceId??null,d.attachment);
    }
    if(d.initialStatus){
      assert.equal(!!(finalBody.dynamicFlags&0x20),d.statusRetained);
      assert.deepEqual(children.filter(n=>n.kind==='status').map(n=>n.resourceId),d.statusRetained?[110076]:[]);
    }
    if(d.impact)assert.ok(newResources.some(row=>row[2]===d.impact),kind+': selected impact resource');
    if(d.natural){assert.deepEqual(recoveries,[]);assert.ok(end.pass<1500);}
    else{assert.equal(recoveries.length,1);assert.equal(recoveries[0].pass,7203);}
    assert.deepEqual(mp[0].slice(1),[principal,10,7]);
    return {kind,hp,mp,metadata,metadataSounds,resourceSteps,cursorSteps,recoveries,end,drawCount,
      final:{resource:finalBody.resourceId,status:!!(finalBody.dynamicFlags&0x20),children:children.map(n=>[n.kind,n.resourceId])}};
  }finally{f.close();}
}
