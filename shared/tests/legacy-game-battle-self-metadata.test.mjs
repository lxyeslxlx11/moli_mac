import test from 'node:test';
import assert from 'node:assert/strict';
import * as api from '../index.mjs';
import {sharedMotion} from '../../analysis/game-battle-shared-storage-v1/fixture.mjs';
import {categories} from '../../analysis/game-legacy-battle-self-family-v1/fixture.mjs';
import {cases,runSelfMetadata} from '../../analysis/game-legacy-battle-self-metadata-v1/fixture.mjs';

const bits=[0x400,0x80000,0x100000,0x200000,0x400000,0x800000,0x1000000,0x2000000,0x10000000,0x13f80000];
const get=slot=>[0,10,20].includes(slot)?{vitals:[70,100,10,10]}:null;
function plan(category,level,flags){
  return api.planBattlePhysicalFamily(api.decodeLegacyGameBattleMotion(sharedMotion('SKL',[
    category*100+level,3,0,0,0,flags,12,...(category===81?[7]:[]),...(flags&0x800000?[100040,100041,100050]:[]),255])).commands[0],get,0,0);
}
test('common self metadata preserves native tuple expansion across20 categories and10 levels',()=>{
  for(const category of categories)for(let level=0;level<10;level++)for(const flag of bits){
    const result=plan(category,level,flag|1);
    assert.equal(result.kind,'physical-family-plan',`${category}/${level}/${flag.toString(16)}: ${result.reason}`);
    assert.deepEqual(result.rows.map(row=>row.slot),[0]);
    assert.equal(result.rows[0].assignments.classCode,category);
    const main=[0,flag|1,12,flag&0x800000?100040:0];
    const packed=flag&0x800000?[main,[0,flag|1,100040,100041],[0,flag|1,100050,0],[...main]]:[main];
    assert.deepEqual(result.rows[0].tuples,category===259&&level===9?[[...main],[0,0,15],...packed]:packed);
  }
});
test('self metadata preserves opaque bits without invented consumers',()=>{
  for(const flag of [0x10000,0x20000,0x40000,0x40000000]){
    const result=plan(0,0,flag|1);assert.equal(result.kind,'physical-family-plan');
    assert.equal(result.hits[0].flags >>> 0,flag|1);
  }
});
for(const kind of Object.keys(cases))test('self metadata callback and source cursor ownership: '+kind,async()=>console.log(JSON.stringify(await runSelfMetadata(api,kind))));
