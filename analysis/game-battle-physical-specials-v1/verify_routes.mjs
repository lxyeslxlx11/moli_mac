/** Current finite boundaries and real callback/manager ownership, no injected readiness. */
import assert from 'node:assert/strict';
import {projectileFixture,projectileContext as ctx} from '../game-battle-physical-projectiles-v1/fixture.mjs';
import {projectileMotion} from '../game-battle-physical-projectiles-v1/reference.mjs';
import {sharedMotion} from '../game-battle-shared-storage-v1/fixture.mjs';
const command=(api,c)=>api.decodeLegacyGameBattleMotion(projectileMotion(c)).commands[0];
export async function verifySpecialsAtomic(api,v,{supportsEmptyTargets=false}={}){
 const c=v.traces.find(t=>t.case.variant===1).case,f=await projectileFixture(api,v,c);let rejected=0,reads=0;
 try{
  const before=JSON.stringify(f.owner.copyState()),legacySelfOnly=[
   [{...c,category:266,variant:2,hits:[[0,0,1,12]]},'physical-family-empty-after-self-runtime-unobserved'],
   [{...c,category:258,level:9,variant:1,hits:[[0,0,1,12]]},'physical-family-empty-after-self-runtime-unobserved'],
   [{...c,category:259,level:9,variant:3,hits:[[0,0,1,12]]},'physical-family-empty-after-self-runtime-unobserved']];
  const specs=[[{...c,category:401,pending401SelfEffect:true},'physical-family-category'],
   ...(supportsEmptyTargets?[]:legacySelfOnly)];
  for(const[value,reason]of specs){assert.equal(f.owner.queuePhysicalFamily(value.pending401SelfEffect?api.decodeLegacyGameBattleMotion(sharedMotion('SKL',[40100,3,0,0,0x80000,255])).commands[0]:command(api,value),1,0,0).reason,reason);assert.equal(JSON.stringify(f.owner.copyState()),before);rejected++;}
  const malformed=[{...f.command,attachedRID:1},{...f.command,fields:f.command.fields.slice(0,-1)},
   {...f.command,fields:Object.defineProperty([...f.command.fields],3,{get(){reads++;return 0;}})},{...f.command,fields:[...f.command.fields,0]}];
  for(const value of malformed){assert.equal(f.owner.queuePhysicalFamily(value,1,0,0).kind,'physical-family-unavailable');assert.equal(JSON.stringify(f.owner.copyState()),before);rejected++;}
  assert.equal(reads,0);f.owner.appendActions(10,1,Array(199).fill(0));const full=JSON.stringify(f.owner.copyState());
  assert.throws(()=>f.owner.queuePhysicalFamily(f.command,1,0,0),e=>e.code==='LEGACY_BATTLE_BODY_CAPACITY');assert.equal(JSON.stringify(f.owner.copyState()),full);
 }finally{f.close();}return {atomicRejections:rejected,capacityRejections:1,getterReads:reads};
}
export async function verifySpecialsCallbacks(api,v){
 const selected=v.traces.filter(t=>t.case.name.startsWith('class')&&(t.case.level===0||t.case.level===9)||t.case.name.startsWith('direct2599'));let count=0,tileBatches=0,transients=0;
 for(const t of selected){const c=t.case,f=await projectileFixture(api,v,c),deleted=new Set();let tiles=0,sawTransient=false,finalDraws=false;
  try{
   assert.equal(f.owner.queuePhysicalFamily(f.command,1,0,0).kind,'strike-queued');assert.equal(f.events.length,0);
   for(let i=0;i<t.states.length;i++){
    f.step();const p=f.owner.copyPlayback();sawTransient||=p.nodes.some(n=>n.kind==='physical-transient');
    tiles+=(p.directSubmissions?.length??0)/100;
    for(const n of p.nodes.filter(n=>n.kind==='physical-tile'&&n.deleted&&!deleted.has(n.id))){assert.ok(p.directSubmissions.length>=100);assert.equal(n.physicalSpecial.counter.value,16);finalDraws=true;deleted.add(n.id);}
    assert.equal(p.casting?.overlayCounter??0,0);
   }
   const expected=c.category===258&&c.variant!==2;assert.equal(sawTransient,expected,c.name);transients+=+sawTransient;
   if(c.level===9){assert.ok(tiles>=16,c.name);assert.equal(finalDraws,true,c.name);}else assert.equal(tiles,0);
   for(const body of t.final.bodies)assert.deepEqual(Array.from(f.owner.copy(body.slot)?.vitals??[]),body.vitals,c.name);
   assert.equal(f.owner.copy(0).vitals[2],7);tileBatches+=tiles;count++;
  }finally{f.close();}
 }return {callbackCases:count,tileBatches,transientCases:transients};
}
export async function verifySpecialsManagers(api,v){
 const selected=v.traces.filter(t=>t.case.name.startsWith('class')&&t.case.level===9||t.case.name==='direct2599-RID');let count=0;
 for(const t of selected){const c=t.case,f=await projectileFixture(api,v,c,{commands:true});let finished=false;
  try{
   f.owner.load(f.raw,{...ctx,substate:5,localSlot:c.local});
   for(let i=0;i<800;i++){
    const out=f.owner.callCallbacks({...ctx,localSlot:c.local});assert.equal(out.commands.some(r=>r.kind==='command-unavailable'),false);
    if(out.manager.kind==='battle-round-drained'){assert.equal(out.manager.roundCounter,1);assert.equal(out.manager.nextSubstate,2);assert.equal(f.owner.copyState().activeMask,0);finished=true;break;}
    f.owner.advanceBackground();
   }
   assert.equal(finished,true,c.name);count++;
  }finally{f.close();}
 }return {managerCases:count};
}
export async function verifySpecialsMissingGraphics(api,v){
 let count=0;
 for(const[name,resource]of[['class258-level0-variant1',0x71b1],['class258-level9-variant1',28905],['class259-level9-variant1',28913],['direct2599',28881]]){
  const c=v.traces.find(t=>t.case.name===name).case,files=v.files.map(row=>{
   if(row.path!=='Bin/GraphicInfo.bin')return row;const raw=Buffer.from(row.bytesHex,'hex'),kept=[];let removed=0;
   for(let at=0;at<raw.length;at+=40){if(raw.readUInt32LE(at+36)===resource)removed++;else kept.push(raw.subarray(at,at+40));}
   assert.equal(removed,1);return {...row,bytesHex:Buffer.concat(kept).toString('hex')};
  }),f=await projectileFixture(api,{...v,files},c);
  try{const before=JSON.stringify(f.owner.copyState());assert.throws(()=>f.owner.queuePhysicalFamily(f.command,1,0,0),e=>e.code==='LEGACY_BATTLE_SKILL_GRAPHIC_REQUIRED');assert.equal(JSON.stringify(f.owner.copyState()),before);count++;}finally{f.close();}
 }return {missingGraphicRejections:count};
}
