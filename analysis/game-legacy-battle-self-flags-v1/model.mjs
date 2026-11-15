import assert from'node:assert/strict';
import{readFileSync}from'node:fs';
import{guardMotion}from'../game-battle-physical-guard-v1/reference.mjs';
import{guardDigest}from'../game-battle-physical-guard-v1/projection.mjs';
import{verifyGuardModel}from'../game-battle-physical-guard-v1/verify_model.mjs';
export async function verifySelfFlagModel(api){
 const assets=JSON.parse(readFileSync(new URL('../game-battle-physical-guard-v1/original-vectors.json',import.meta.url)));
 const v=JSON.parse(readFileSync(new URL('./original-vectors.json',import.meta.url)));
 for(const row of v.queues){const[category,level,flags]=row.input,c={category,level,cost:3,local:0,hits:[[0,0,flags,12]]};
  const get=()=>({vitals:[70,100,10,10],unmodeledCharacterMask:0,tuples:new Int32Array(800),tupleWrite:0});
  const p=api.planBattlePhysicalFamily(api.decodeLegacyGameBattleMotion(guardMotion(c)).commands[0],get,0,0);
  assert.equal(p.kind,'physical-family-plan',row.input.join('/')+' '+p.reason);assert.equal(guardDigest(p.rows),row.expected_digest,row.input.join('/'));
 }
 const result=await verifyGuardModel(api,{...assets,...v,queues:[]},{mismatchDirectory:new URL('../../build/analysis/game-legacy-battle-self-flags-v1/',import.meta.url)});
 return{...result,queues:v.queues.length};
}
