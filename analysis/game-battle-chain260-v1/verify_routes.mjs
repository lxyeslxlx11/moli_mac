import assert from'node:assert/strict';
import{readFileSync}from'node:fs';
import{chainFixture}from'./fixture.mjs';
import{chainMotion}from'./reference.mjs';
const ctx={mainState:10,substate:6,controlFlags:0,localSlot:0,resourceCode:0,slowEffects:false};
// Host comparison preserves every value while discarding foreign VM prototypes.
const hostValue=v=>Array.isArray(v)?Array.from(v,hostValue):v&&typeof v==='object'?Object.fromEntries(Object.entries(v).map(([k,n])=>[k,hostValue(n)])):v;
const get=()=>({vitals:[70,100,10,10],unmodeledCharacterMask:0,tuples:new Int32Array(800),tupleWrite:0});
const nativeHit=h=>({actor:h.actor,target:h.target,flags:h.flags>>>0,amount:h.amount,resources:h.RID,guard:h.guard,nested:h.chain? h.chain.target===255?{target:255}:{actor:h.actor,target:h.chain.target,flags:h.chain.flags>>>0,amount:h.chain.amount,resources:h.chain.RID,guard:h.chain.guard,extra:null,nested:null}:null,extra:null});
export function verifyChainProtocol(api){
 const v=JSON.parse(readFileSync(new URL('../game-battle-pair-specials-v1/original-protocol-vectors.json',import.meta.url)));let prepared=0,rejected=0,runtime=0,distinct=0;
 for(const c of v.cases){const raw=Uint8Array.from('M|SKL|'+c.words.map(n=>(n>>>0).toString(16).toUpperCase()).join('|')+'|',s=>s.charCodeAt(0)),expected=c.preflight;
  if(expected.error){assert.throws(()=>api.decodeLegacyGameBattleMotion(raw),e=>e.code===(expected.error==='truncated'?'LEGACY_BATTLE_MOTION_TRUNCATED':'LEGACY_BATTLE_MOTION_SLOT'),c.name);rejected++;continue;}
  const command=api.decodeLegacyGameBattleMotion(raw).commands[0];assert.deepEqual([...command.fields],c.words);assert.deepEqual([...command.dependencyCounts],expected.counts);assert.equal(command.principalSlot,expected.primary);prepared++;
  if(Math.trunc(c.words[0]/100)!==260)continue;
  const p=api.planBattlePhysicalFamily(command,get,0,0);
  if(c.runtime.complete){assert.equal(p.kind,'physical-family-plan',c.name+' '+p.reason);assert.deepEqual(hostValue(p.hits),c.runtime.hits.map(nativeHit),c.name);runtime++;}
  else assert.equal(p.kind,'physical-family-unavailable',c.name);
  const roles=x=>x.events.filter(e=>['guard','chain.target','chain.flags','chain.amount','chain.guard'].includes(e.role));distinct+=Number(JSON.stringify(roles(expected))!==JSON.stringify(roles(c.runtime)));
 }
 assert.equal(prepared,4368);assert.equal(rejected,240);assert.ok(runtime>0);assert.ok(distinct>0);return{streams:v.cases.length,prepared,rejected,complete260Runtime:runtime,distinct260Roles:distinct,nativeReadersRemainDistinct:true};
}
export async function verifyChainCallbacks(api,v){const grades=[];let callbacks204=0;
 for(let level=0;level<10;level++){const trace=v.traces.find(t=>t.case.name==='level-'+level),f=await chainFixture(api,v,trace.case),hits=[],primaryFaces=new Set(),secondaryFaces=new Set();let first203=false,point=null;
  try{f.owner.queuePhysicalFamily(f.command,1,0,0);
   for(let i=0;i<trace.states.length;i++){const before=f.owner.copy(10),caster=f.owner.copy(0),HP=f.owner.copy(11).vitals[0],ids=new Set(f.owner.copyPlayback().nodes.map(n=>n.id));f.step();const now=f.owner.copy(10);if(caster.state===203){first203=true;point=[...f.owner.copy(0).rememberedPosition];}
    if(before.state===204){callbacks204++;if(f.owner.copy(11).vitals[0]!==HP){assert.equal(before.reactionCounter+1,24);assert.equal(HP,70);assert.equal(f.owner.copy(11).vitals[0],63);assert.equal(f.owner.copy(11).attackerSlot,10);assert.equal(now.tupleRead,before.tupleRead+1);hits.push(i+1);}}
    for(const n of f.owner.copyPlayback().nodes)if(n.kind==='impact'&&n.resourceId===0x1af89&&[0,1].includes(n.animation.lastFacing))(n.animation.lastFacing===1?secondaryFaces:primaryFaces).add(n.id);
   }
   assert.equal(first203,true);assert.deepEqual(point,[202,218]);assert.equal(f.owner.copy(10).vitals[0],58);assert.equal(hits.length,1);assert.ok(primaryFaces.size);assert.equal(secondaryFaces.size,level===9?1:0);assert.equal(f.events.filter(e=>e.kind==='battle-vital'&&e.field==='HP').length,2);grades.push({level,secondaryHitFrame:hits[0],secondaryFacing:level===9?1:null});
  }finally{f.close();}
 }return{grades:10,callbacks204,onePrimaryAndSecondarySettlement:true,timer24:true,primaryFacing0:true,secondaryLevel9Facing1:true,gradesDetail:grades};
}
export async function verifyChainBoundaries(api,v){const trace=v.traces.find(t=>t.case.name==='chain255-0'),f=await chainFixture(api,v,trace.case);let fields=0;
 try{const original=f.command,before=JSON.stringify([f.owner.copyState(),f.owner.copyPlayback()]);const clone={...original};assert.equal(f.owner.queuePhysicalFamily(clone,1,0,0).reason,'physical-family-lookahead-context');assert.equal(JSON.stringify([f.owner.copyState(),f.owner.copyPlayback()]),before);fields++;
  for(const command of[{...original,attachedRID:1},{...original,fields:original.fields.slice(0,-1)},{...original,fields:[26000,4,0,0,99,1,12,255]}]){assert.equal(f.owner.queuePhysicalFamily(command,1,0,0).kind,'physical-family-unavailable');assert.equal(JSON.stringify([f.owner.copyState(),f.owner.copyPlayback()]),before);fields++;}
  assert.equal(f.owner.queuePhysicalFamily(original,1,0,0).kind,'strike-queued');for(let i=0;i<trace.states.length;i++)f.step();assert.equal(f.owner.copy(10).vitals[0],58);
 }finally{f.close();}
 const normal=v.traces.find(t=>t.case.name==='level-0'),g=await chainFixture(api,v,normal.case);
 try{g.owner.appendActions(11,1,Array(199).fill(0));const old=JSON.stringify(g.owner.copyState());assert.throws(()=>g.owner.queuePhysicalFamily(g.command,1,0,0),e=>e.code==='LEGACY_BATTLE_BODY_CAPACITY');assert.equal(JSON.stringify(g.owner.copyState()),old);}finally{g.close();}
 const consumer=[];for(const t of v.traces.filter(t=>t.consumerBoundary)){const f=await chainFixture(api,v,t.case);try{f.owner.queuePhysicalFamily(f.command,1,0,0);for(let i=0;i<t.states.length;i++)f.step();assert.throws(()=>f.step(),e=>e.code===t.consumerBoundary.code);consumer.push({name:t.case.name,...t.consumerBoundary});}finally{f.close();}}
 const self={...trace.case,hits:[[0,0,0x80001,12,null]]},first=chainMotion(self),next=chainMotion({...trace.case,cost:0x1010,nested:null,hits:[[0,10,1,12,null]]}),raw=new Uint8Array(first.length+next.length-2);raw.set(first);raw.set(next.subarray(2),first.length);
 const command=api.decodeLegacyGameBattleMotion(raw).commands[0];assert.equal(api.planBattlePhysicalFamily(command,get,0,0).reason,'physical-family-lookahead-context','Native lookahead must read the following SKL bytes,not assume NUL');
 const both={...trace.case,hits:[[0,10,0x80201,12,null,12]],nested:{target:11,flags:513,amount:7,resources:null,guard:13}};assert.throws(()=>api.decodeLegacyGameBattleMotion(chainMotion(both)),e=>e.code==='LEGACY_BATTLE_MOTION_SLOT','The front/runtime main-guard order is preserved');
 return{atomicFieldRefusals:fields,atomicCapacityRefusals:1,ownedRawTailRequired:true,followingRawCommandChecked:true,distinctGuardOrderRejection:true,consumerBoundaries:consumer,noInventedTarget:true};
}
export async function verifyChain202(api,v){const c=v.traces.find(t=>t.case.name==='no-chain-0').case,f=await chainFixture(api,v,c);try{f.owner.queuePhysicalFamily(f.command,1,0,0);f.owner.insertAction(0,1,202,-1);f.owner.activate(0);f.step();const b=f.owner.copy(0);assert.equal(b.state,6);assert.deepEqual([...b.rememberedPosition],[10,1]);assert.equal(b.tupleRead,1);return{actual202:true,coordinateWords:'slot and flags',amount12NotUsed:true,tupleAdvanced:true,native260ProducerEmits202:false,explicitOwnedQueueCallbackCheck:true};}finally{f.close();}}
export async function verifyChainManagers(api,v){const names=[...Array.from({length:10},(_,i)=>'level-'+i),'no-chain-0','chain255-9','primary-guard-9','secondary-guard-9','secondary-guard-RID-9','secondary-9-2001','secondary-9-4001','secondary-9-8001','self-0','same-victim-9','main-9-2041'],results=[];let rounds=0,exits=0;
 for(const name of names){const trace=v.traces.find(t=>t.case.name===name),f=await chainFixture(api,v,trace.case,{commands:true});let finished=0,stopped=0;const recoveries=[];
  try{f.owner.load(f.raw,{...ctx,substate:5});for(let i=1;i<=12000;i++){const out=f.owner.callCallbacks({...ctx,localSlot:trace.case.local});assert.equal(out.commands.some(r=>r.kind==='command-unavailable'),false,name);for(const r of[out.manager,...out.commands])if(r.wait?.recovered?.length)recoveries.push({call:i,slots:r.wait.recovered,counter:r.wait.counter});if(out.body.stopRequested)stopped=i;if(out.nextSubstate===7){assert.equal(i,stopped+1);assert.equal(f.owner.copyState().roundCounter,0);exits++;finished=i;break;}if(out.manager.kind==='battle-round-drained'){assert.equal(out.manager.roundCounter,1);rounds++;finished=i;break;}f.owner.advanceBackground();}assert.ok(finished,name);assert.equal(!!stopped,trace.stopped,name);results.push({name,finished,stopped,recoveries});}finally{f.close();}
 }return{managerCases:results.length,rounds,exits,recoveredRounds:results.filter(r=>r.recoveries.length).length,results};
}
