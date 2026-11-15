import test from'node:test';
import assert from'node:assert/strict';
import{readFileSync}from'node:fs';
import*as api from'../index.mjs';
import{verifySelfFlagModel}from'../../analysis/game-legacy-battle-self-flags-v1/model.mjs';
import{cases,runSelfFlags}from'../../analysis/game-legacy-battle-self-flags-v1/fixture.mjs';
import{categories}from'../../analysis/game-legacy-battle-self-family-v1/fixture.mjs';
import{sharedMotion}from'../../analysis/game-battle-shared-storage-v1/fixture.mjs';
import{guardFixture}from'../../analysis/game-battle-physical-guard-v1/fixture.mjs';
test('self flag consumers and opaque words match independent native queues,callbacks and full RGBA',async()=>console.log('self-flags-independent '+JSON.stringify(await verifySelfFlagModel(api))));

test('ordinary self words preserve all32 bits,zero and all-bits across20 classes and10 levels',()=>{
 const words=[0,...Array.from({length:32},(_,n)=>(2**n)>>>0),0xffffffff];
 for(const category of categories)for(let level=0;level<10;level++)for(const flags of words){
  const fields=[category*100+level,3,0,0,0,flags,12,...(category===81?[7]:[]),
   ...(flags&0x800000?[100020,100061,100050]:[]),...(flags&0x200?[0]:[]),255];
  const c=api.decodeLegacyGameBattleMotion(sharedMotion('SKL',fields)).commands[0];
  const p=api.planBattlePhysicalFamily(c,()=>({vitals:[70,100,10,10],tuples:new Int32Array(800),tupleWrite:0}),0,0);
  assert.equal(p.kind,'physical-family-plan',`${category}/${level}/${flags.toString(16)} ${p.reason}`);
  assert.equal(p.hits[0].flags>>>0,category===5?(flags&~4)>>>0:flags);
  assert.deepEqual(p.rows.map(r=>r.slot),[0]);
 }
});

test('ordinary class259 level9 tile marker retains the original fourth tuple cell',async()=>{
 const assets=JSON.parse(readFileSync(new URL('../../analysis/game-battle-physical-guard-v1/original-vectors.json',import.meta.url)));
 const c={category:259,level:9,resource:100080,local:0,cost:3,hits:[[0,0,0x805,12]],initialFourths:{0:[0,0x11223344]}};
 const f=await guardFixture(api,assets,c);
 try{assert.equal(f.owner.queuePhysicalFamily(f.command,1,0,0).kind,'strike-queued');assert.equal(f.owner.copy(0).tuples[7],0x11223344);}
 finally{f.close();}
});

for(const kind of Object.keys(cases))test('self word callbacks,partial reactions and source round ownership: '+kind,
 async()=>console.log('self-flags-callback '+JSON.stringify(await runSelfFlags(api,kind))));
