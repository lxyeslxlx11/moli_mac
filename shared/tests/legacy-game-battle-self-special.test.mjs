import test from 'node:test';
import assert from 'node:assert/strict';
import * as api from '../index.mjs';
import { sharedMotion } from '../../analysis/game-battle-shared-storage-v1/fixture.mjs';
import { createBattlePhysicalPlayback } from '../legacy-game-battle-physical-playback.mjs';
import {cases,runSelfSpecial} from '../../analysis/game-legacy-battle-self-special-v1/fixture.mjs';

const categories = [0,1,3,5,6,75,76,77,78,79,80,81,84,85,87,95,110,258,259,266];
const get = slot => [0,10,20].includes(slot) ? { vitals:[70,100,10,10] } : null;
const plan = (category, level, flags, tail = []) => api.planBattlePhysicalFamily(api.decodeLegacyGameBattleMotion(
  sharedMotion('SKL', [category*100+level,3,0,0,0,flags,12,...(category===81?[7]:[]),...tail,255])).commands[0],get,0,0);

test('ordinary E000 self pairs preserve one body across20 categories,10 levels and7 precedence combinations', () => {
  for (const category of categories) for (let level=0;level<10;level++) for (const bits of [0x2000,0x4000,0x6000,0x8000,0xa000,0xc000,0xe000]) {
    const result=plan(category,level,bits|1);
    assert.equal(result.kind,'physical-family-plan',`${category}/${level}/${bits.toString(16)}: ${result.reason}`);
    assert.deepEqual(result.rows.map(row=>row.slot),[0]);
    assert.equal(result.rows[0].assignments.classCode,category);
    assert.equal(result.rows[0].assignments.mpCost,3);
  }
});

test('class5 clears its first0x4 flag before an E000 self result', () => {
  const result=plan(5,0,0x4005);
  assert.equal(result.kind,'physical-family-plan');
  assert.deepEqual(result.rows[0].tuples,[[0,0x4001,12,0]]);
  assert.equal(result.rows[0].assignments.messageResource,0x5745);
  const repeated=plan(5,0,1,[0,0,0x4005,12]);
  assert.equal(repeated.kind,'physical-family-plan');
  assert.equal(repeated.hits[1].flags,0x4005);
});

test('self E000 glyph preflight follows8000 then4000 then2000 priority after class reset', () => {
  for (const [flags,expected] of [[0x2001,[243761,243762]],[0x4001,[243751,243752]],[0x6001,[243751,243752]],
    [0x8001,[]],[0xa001,[]],[0xc001,[]],[0xe001,[]]]) {
    const requested=[];
    const owner=createBattlePhysicalPlayback({validateSpecials(){}},{},{image(id){assert.ok(expected.includes(id));requested.push(id);}});
    assert.equal(owner.validate({category:6,principal:0,pairMode:true,variant:0,
      rows:[{slot:0,actions:[14],assignments:{}}],hits:[{actor:0,target:0,flags,amount:12,guard:null}]}).kind,'physical-family-supported');
    assert.deepEqual(requested,expected);
  }
});

test('self special results preserve the opaque result word with reflection', () => {
  for (const flags of [0x10000,0x20000,0x40000,0x40000000]) {
    const result=plan(0,0,flags|0x2000);
    assert.equal(result.kind,'physical-family-plan');
    assert.equal(result.hits[0].flags >>> 0,flags|0x2000);
  }
});

for(const kind of Object.keys(cases))test('self E000 callback,tuple and round ownership: '+kind,async()=>{
  console.log(JSON.stringify(await runSelfSpecial(api,kind)));
});
