import assert from 'node:assert/strict';
import test from 'node:test';
import * as game from '../index.mjs';
import {petTransitionConfig,petTransitionFixture} from '../../analysis/game-battle-pet-transition-v1/reference.mjs';

const bytes = text => Uint8Array.from(text, char => char.charCodeAt(0));
const label = raw => String.fromCharCode(...raw);
const cast = 'SKL|2455|3|F|0|';
const target = (slot, name, resource='186DD', flags='5000001') =>
  [slot, name, resource, 'FFFFFFEF', '3D', '5A', '7', 'C', flags, ''].join('|');
const context = {mainState:10, substate:6, localSlot:0, controlFlags:0, resourceCode:0, slowEffects:false};

async function withBattle(fn, {caster=true}={}) {
  const fixture = await petTransitionFixture(game);
  const battle = game.createLegacyGameBattleCommands((name, metadata) =>
    label(name)==='NewEnemy' && metadata.join('')==='1010');
  try {
    battle.configureBodyPlayback(petTransitionConfig(fixture));
    battle.configureSkills({graphics:fixture.library.catalogs().graphics});
    if(caster) battle.applyCharacter(0, 0, 100060, [0,0], [70,100,10,10]);
    battle.applyCharacter(10, 0, 100060, [0,0], [30,70,2,7], 0, 1, bytes('OldEnemy'));
    const load = motion => battle.load(bytes('M|'+motion), {...context, substate:5});
    const pass = () => battle.callCallbacks(context);
    await fn(battle, load, pass);
  } finally {
    battle.close();
    fixture.close();
  }
}

test('SKL93 activates owned replacements from the caster signal and drains the round', async () => {
  await withBattle((battle, load, pass) => {
    const old = battle.copyState().playback.nodes.find(node => node.slot===10).id;
    const motion = cast+target('5','NewPet')+target('A','EarlierEnemy')+target('A','NewEnemy')+'FF|CFP|A|2|';
    assert.equal(load(motion).commands,2);
    let registration, signalFrame, mpCostFrame, after, sawScale=false;
    const arrivalSounds=[];
    for(let frame=0;frame<140;frame++){
      const step=pass(), state=battle.copyState();
      assert.deepEqual(step.commands.filter(command=>command.kind==='command-unavailable'),[]);
      assert.deepEqual(step.body.results.filter(body=>body.result.endsWith('unavailable')),[]);
      const summon=step.commands.find(command=>command.kind==='command-summon');
      if(summon){
        assert.equal(registration,undefined);
        registration=frame;
        assert.deepEqual(summon.metadata.map(row=>[row.slot,label(row.nameBytes)]),
          [[5,'NewPet'],[10,'EarlierEnemy'],[10,'NewEnemy']]);
        const [caster,pet,enemy]=[0,5,10].map(slot=>state.bodies.bodies[slot]);
        assert.deepEqual(Array.from(caster.actions.slice(0,5)),[24,53,66,65,-1]);
        assert.deepEqual([caster.skillLevel,caster.messageResource,caster.vitals[2]],[1,0x5742,10]);
        assert.deepEqual(Array.from(caster.tuples.slice(0,16)),[5,0,0,0,10,0,0,0,10,0,0,0,-1,0,0,0]);
        for(const body of [pet,enemy]){
          assert.equal(body.state,0);
          assert.deepEqual(body.scale,[0,0]);
          assert.equal(body.resourceId,100061);
          assert.equal(body.value1d0,-17);
          assert.deepEqual(body.vitals,[61,90,7,12]);
          assert.deepEqual(body.statusMetadata,[1,0,1,0]);
          assert.equal(body.savedFlags&1,1);
        }
        assert.equal(state.playback.nodes.some(node=>node.id===old&&!node.deleted),false);
        assert.equal(state.playback.nodes.filter(node=>node.kind==='body'&&node.slot===10&&!node.deleted).length,1);
      }
      for(const event of step.body.events){
        if(event.kind==='signal'&&event.slot===0&&event.value===10001)signalFrame??=frame;
        if(event.kind==='battle-vital'&&event.slot===0)mpCostFrame=frame;
        if(event.kind==='sound'&&event.value===0xcc)arrivalSounds.push({frame,slot:event.slot});
      }
      const pet=state.bodies.bodies[5];
      if(pet&&pet.scale[0]>0&&pet.scale[0]<1){
        assert.ok(frame>signalFrame);
        sawScale=true;
      }
      if(step.manager.kind==='battle-round-drained'){
        after=state;
        break;
      }
    }
    assert.ok(after);
    assert.ok(registration<mpCostFrame&&mpCostFrame<signalFrame);
    assert.ok(sawScale);
    assert.deepEqual(arrivalSounds.map(sound=>sound.slot).sort((a,b)=>a-b),[5,10]);
    assert.ok(arrivalSounds.every(sound=>sound.frame>signalFrame));
    assert.deepEqual(after.bodies.bodies[0].vitals,[70,100,7,10]);
    assert.deepEqual(after.bodies.bodies[10].vitals,[61,90,5,12]);
    for(const slot of [5,10]){
      const body=after.bodies.bodies[slot];
      assert.deepEqual(body.scale,[1,1]);
      assert.equal(body.busy,0);
    }
  });
});

test('SKL93 preflight tracks mapped target slots and owns a bounded name', () => {
  const motion=bytes('M|'+cast+target('32','X'.repeat(32))+target('33','Y')+'FF|');
  const [command]=game.decodeLegacyGameBattleMotion(motion).commands;
  motion.fill(0);
  assert.equal(command.classCode,93);
  assert.equal(command.fields[5].length,28);
  assert.deepEqual([...command.dependencyCounts.entries()].filter(([,count])=>count),[[0,1],[20,1],[21,1]]);
  assert.throws(()=>game.decodeLegacyGameBattleMotion(bytes('M|'+cast+target('5','Broken'))),
    {code:'LEGACY_BATTLE_MOTION_TRUNCATED'});
});

test('SKL93 validates every destination before committing bodies or charging MP', async () => {
  await withBattle((battle, load, pass) => {
    load(cast+target('A','NewEnemy')+target('0','Self')+'FF|');
    let unavailable;
    for(let i=0;i<4&&!unavailable;i++) unavailable=pass().commands.find(command=>command.kind==='command-unavailable');
    assert.equal(unavailable?.reason,'summon-self-replacement');
    const state=battle.copyState();
    assert.equal(label(state.bodies.bodies[10].nameBytes),'OldEnemy');
    assert.equal(state.bodies.bodies[0].vitals[2],10);
    assert.equal(state.playback.nodes.filter(node=>node.kind==='body').length,2);
  });
});

for(const caster of [true,false]){
  test('SKL93 releases with '+(caster?'an empty list':'a missing caster'), async () => {
    await withBattle((battle, load, pass) => {
      load(cast+(caster?'':target('A','NewEnemy'))+'FF|');
      let drained=false;
      for(let i=0;i<40&&!drained;i++) drained=pass().manager.kind==='battle-round-drained';
      assert.equal(drained,true);
      const rows=battle.copyState().bodies.bodies;
      assert.equal(label(rows[10].nameBytes),'OldEnemy');
      if(caster) assert.equal(rows[0].vitals[2],7);
      else assert.equal(rows[0],null);
    },{caster});
  });
}
