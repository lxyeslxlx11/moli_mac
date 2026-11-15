/** Compare finite native field-reader equations with the actual,unchanged shared parser. */
import assert from 'node:assert/strict';
import{readFileSync,writeFileSync}from'node:fs';
import{createHash}from'node:crypto';
import{decodeLegacyGameBattleMotion,planBattlePhysicalFamily}from'../../shared/index.mjs';
const root=new URL('../../',import.meta.url),dir=new URL('../../build/analysis/game-battle-pair-specials-v1/',import.meta.url);
const info=path=>{const b=readFileSync(new URL(path,root));return{path,bytes:b.length,sha256:createHash('sha256').update(b).digest('hex')};};
const inputs=['analysis/game-battle-pair-specials-v1/verify_boundaries.mjs','analysis/game-battle-pair-specials-v1/original-protocol-vectors.json','shared/legacy-game-battle-motion.mjs','shared/legacy-game-battle-physical-family.mjs'],before=inputs.map(info);
const v=JSON.parse(readFileSync(new URL('./original-protocol-vectors.json',import.meta.url))),get=()=>({vitals:[70,100,10,10],unmodeledCharacterMask:0,tuples:new Int32Array(800),tupleWrite:0});
let parsed=0,outside=0,unimplemented=0,runtimePending=0,guardOrderDifferences=0;
const byClass={};
for(const row of v.cases){
 const raw=Uint8Array.from('M|SKL|'+row.words.map(n=>(n>>>0).toString(16).toUpperCase()).join('|')+'|',s=>s.charCodeAt(0));
 const expected=row.preflight,category=Math.trunc(row.words[0]/100);byClass[category]??={cases:0,prepared:0,rejected:0};byClass[category].cases++;
 if(expected.error){
  // Native writes outside the declared22-slot array are not executed here.
  // These are the portable parser's deliberate bounds,not native error claims.
  assert.throws(()=>decodeLegacyGameBattleMotion(raw),e=>e.code===(expected.error==='truncated'?'LEGACY_BATTLE_MOTION_TRUNCATED':'LEGACY_BATTLE_MOTION_SLOT'),row.name);outside++;byClass[category].rejected++;continue;
 }
 assert.equal(expected.complete,true,row.name+' literal full preflight cursor');
 const decoded=decodeLegacyGameBattleMotion(raw);assert.equal(decoded.commands.length,1,row.name);const command=decoded.commands[0];
 assert.equal(command.principalSlot,expected.primary,row.name);assert.deepEqual(Array.from(command.fields),row.words,row.name+' field preservation');assert.deepEqual(Array.from(command.dependencyCounts),expected.counts,row.name+' dependency multiplicities');parsed++;byClass[category].prepared++;
 const pending=planBattlePhysicalFamily(command,get,0,0);assert.equal(pending.kind,'physical-family-unavailable',row.name+' no invented special producer');unimplemented++;
 if(row.runtime.complete){assert.equal(pending.reason,'physical-family-special-producer-pending',row.name);runtimePending++;}
 if(category===260){
  const roles=x=>x.events.filter(e=>['guard','chain.target','chain.flags','chain.amount','chain.guard'].includes(e.role));
  if(JSON.stringify(roles(expected))!==JSON.stringify(roles(row.runtime)))guardOrderDifferences++;
 }
}
assert.equal(parsed,4368);assert.equal(outside,240);assert.equal(runtimePending,4128);assert.equal(unimplemented,parsed);
const table=v.animation_table_prefixes;assert.deepEqual(table.filter(r=>r.first_negative_index!==null).map(r=>r.level),[0,1]);assert.deepEqual(table[0].prefix,[7,8,16,15,10,11,13,12,14]);assert.deepEqual(table[1].prefix,Array(10).fill(10));for(const r of table.slice(2))assert.deepEqual(r.known_row,Array(20).fill(0));
assert.deepEqual(inputs.map(info),before);
const result={schema:'moli.pair-specials-reader-validation-stage214.v1',command:'node analysis/game-battle-pair-specials-v1/verify_boundaries.mjs',node:process.version,cases:v.cases.length,actual_shared_parser_prepared:parsed,portable_bounds_rejections:outside,pending_producer_rejections:unimplemented,pending_after_both_native_readers_complete:runtimePending,prepared_but_distinct_guard_field_order:guardOrderDifferences,byClass,terminating_observed_animation_rows:[0,1],known_higher_rows_without_negative:8,source_only:true,queue_callback_or_game_execution:false,official_sessions:0,inputs:before,inputs_unchanged:true,passed:true};
writeFileSync(new URL('protocol-validation.json',dir),JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify(result));
