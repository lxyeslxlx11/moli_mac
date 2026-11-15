import test from 'node:test';
import assert from 'node:assert/strict';
import * as api from '../index.mjs';
import {sharedMotion} from '../../analysis/game-battle-shared-storage-v1/fixture.mjs';
import {cases,runSelfControl}from'../../analysis/game-legacy-battle-self-control-v1/fixture.mjs';

const categories=[0,1,3,5,6,75,76,77,78,79,80,81,84,85,87,95,110,258,259,266];
const bits=[0x10,0x1000,0x1010,0x20,0x40,0x60,0x1020,0x2010,0x2020,0x2040,0x2060,0x4020,0x8040];
const get=slot=>[0,10,20].includes(slot)?{vitals:[70,100,10,10]}:null;
const plan=(category,level,flags)=>api.planBattlePhysicalFamily(api.decodeLegacyGameBattleMotion(sharedMotion('SKL',[
  category*100+level,3,0,0,0,flags,12,...(category===81?[7]:[]),255])).commands[0],get,0,0);

test('self charge,knockout and scatter use the native producer across20 categories and10 levels',()=>{
  for(const category of categories)for(let level=0;level<10;level++)for(const flag of bits){
    const result=plan(category,level,flag|1);
    assert.equal(result.kind,'physical-family-plan',`${category}/${level}/${flag.toString(16)}: ${result.reason}`);
    assert.deepEqual(result.rows.map(row=>row.slot),[0]);
    assert.equal(result.rows[0].assignments.classCode,category);
  }
});

test('self controls preserve the opaque result word with knockout',()=>{
  for(const flags of [0x10000,0x20000,0x40000,0x40000000]){
    const result=plan(0,0,flags|0x20);assert.equal(result.kind,'physical-family-plan');
    assert.equal(result.hits[0].flags >>> 0,flags|0x20);
  }
});

for(const kind of Object.keys(cases))test('self control callbacks and original stop/round ownership: '+kind,async()=>{
  console.log(JSON.stringify(await runSelfControl(api,kind)));
});
