import assert from 'node:assert/strict';
import test from 'node:test';
import * as game from '../index.mjs';
import { battleStatusVital } from '../legacy-game-battle-status.mjs';
import { originalFiles } from '../../analysis/game-resource-runtime-v1/original_files.mjs';
import { statusVariantFiles } from '../../analysis/game-legacy-battle-status-variant-v1/original_assets.mjs';

const context = {mainState:10,substate:6,controlFlags:0,localSlot:0,resourceCode:0,slowEffects:false};
const wireSlot = slot => slot===20?50:slot===21?51:slot;
const fields = (variant,caster,rows,level=1) =>
  [9800+level,3,15,variant,wireSlot(caster),...rows.flatMap(([slot,...tail])=>[wireSlot(slot),...tail]),255];
const encode = values => Uint8Array.from('M|SKL|'+values.map(n=>(n>>>0).toString(16).toUpperCase()).join('|')+'|', c=>c.charCodeAt(0));
const fixture = statusVariantFiles();

async function runRound(variant,{caster=0,targets=[[10,0x80000]],bodies={},follow=''}={}) {
  const files=originalFiles(fixture);
  const library=game.createLegacyGameResourceLibrary({plan:game.createLegacyGameResourcePlan(new Uint8Array()),files:files.port,paletteMode:'neutral'});
  const battle=game.createLegacyGameBattleCommands();
  try{
    await library.initialize();
    battle.configureBodyPlayback({animations:library.catalogs().animations,geometry:library.geometry,seed:12345,
      initialPhase:0,alternativeRenderer:false,staticFlip:false,screenOffset:[0,0]});
    battle.configureSkills({graphics:library.catalogs().graphics});
    const slots=[...new Set([caster,...targets.map(row=>row[0])])].sort((a,b)=>a-b);
    for(const slot of slots){
      const row=bodies[slot];
      if(row!==null)battle.applyCharacter(slot,row?.flags??0,100060,[0,0],row?.vitals??[70,100,10,10]);
    }
    const motion=encode(fields(variant,caster,targets));
    const input=follow?Uint8Array.from([...motion,...Array.from(follow,c=>c.charCodeAt(0))]):motion;
    battle.load(input,{...context,substate:5});
    let preCastPasses=0,queued=0,seedAtActivation,signalSeen=false,peakRise=0,peakFall=0,numberSeen=false;
    const cues=[],vitals=[];
    for(let index=0;index<1000;index++){
      const before=battle.copyState(),inPreCast=before.bodies.bodies[caster]?.state===37;
      if(inPreCast)preCastPasses++;
      const step=battle.callCallbacks(context),after=battle.copyState();
      assert.deepEqual(step.commands.filter(row=>row.kind==='command-unavailable'),[]);
      assert.deepEqual(step.body.results.filter(row=>row.result.endsWith('unavailable')),[]);
      queued+=step.commands.filter(row=>row.kind==='command-status-skill').length;
      for(const event of step.body.events){
        if(event.kind==='sound'&&inPreCast&&event.slot===caster&&[0xa3,0xab,0xae].includes(event.value))cues.push([preCastPasses,event.value]);
        if(event.kind==='battle-vital')vitals.push(event);
        if(event.kind==='signal'&&event.slot===caster&&before.bodies.bodies[caster]?.state===135)signalSeen=true;
      }
      const was=before.bodies.bodies[caster],now=after.bodies.bodies[caster];
      if(signalSeen&&was?.state===135&&was.tupleRead===0&&now?.tupleRead>0)seedAtActivation??=after.playback.seed;
      const nodes=after.playback.nodes;
      peakRise=Math.max(peakRise,nodes.filter(node=>node.kind==='status-skill-rise-particle').length);
      peakFall=Math.max(peakFall,nodes.filter(node=>node.kind==='status-skill-fall-particle').length);
      numberSeen||=nodes.some(node=>node.kind==='damage-digit');
      if(step.manager.kind==='battle-round-drained'){
        assert.equal(after.roundCounter,1);
        return {after,queued,preCastPasses,cues,vitals,seedAtActivation,peakRise,peakFall,numberSeen,bytes:input.length};
      }
    }
    assert.fail('Round did not drain');
  } finally {
    battle.close();
    library.close();
    files.close();
  }
}

test('SKL98 pair records have independent expected queues at all ten levels',()=>{
  const expected=new Map([
    [0,[117,138]],[1,[117,138]],[2,[117,138]],[3,[117,138]],[4,[117,138]],[5,[117,138]],
    [9,[132,45,43,44]],[10,[131,139]],[11,[145,77,155,38]],[14,[]],
  ]);
  const tiers=[3,3,3,2,2,2,1,1,1,0],actor={vitals:[70,100,10,10],unmodeledCharacterMask:0};
  for(const [variant,actions] of expected)for(let level=0;level<10;level++){
    const rows=[variant===11?[10,0x80000,9]:[10,0x80000]];
    const [command]=game.decodeLegacyGameBattleMotion(encode(fields(variant,0,rows,level))).commands;
    const plan=game.planBattleStatusSkill(command,()=>actor,0);
    assert.equal(plan.kind,'status-skill-plan');
    assert.equal(plan.variant,variant);
    assert.equal(plan.ignoredWord,15);
    assert.equal(plan.chantResource,0x1ade8+tiers[level]);
    assert.deepEqual(plan.rows[0].actions,[24,53,37,38,135,62]);
    assert.deepEqual(plan.rows[0].tuples,[[10,0x80000,0,0],[-1,0,0,0]]);
    assert.deepEqual(plan.rows[1].actions,actions);
    assert.equal(plan.rows[1].reset,variant===11);
  }
  const [unhandled]=game.decodeLegacyGameBattleMotion(encode(fields(15,0,[]).slice(0,-1))).commands;
  assert.equal(game.planBattleStatusSkill(unhandled,()=>actor,0).reason,'status-skill98-variant');
});

for(let variant=0;variant<=5;variant++){
  test('SKL98 condition variant '+variant+' waits for the signal and applies one selected state',async()=>{
    const r=await runRound(variant,{targets:[[10,0x80000],[11,0]]});
    assert.equal(r.queued,1);
    assert.equal(r.preCastPasses,270);
    const soundPasses=[1,36,70,102,132,160,186,210,232,252,270];
    assert.deepEqual(r.cues,soundPasses.flatMap((pass,index)=>[[pass,0xa3],[pass,index%2?0xae:0xab]]));
    assert.equal(r.seedAtActivation,r.bytes*3*11);
    assert.deepEqual(r.after.bodies.bodies[10].vitals,[70,100,10,10]);
    assert.equal(r.after.bodies.bodies[10].dynamicFlags&0x3f0,0x10<<variant);
    assert.equal(r.after.bodies.bodies[11].dynamicFlags&0x3f0,0);
    assert.equal(r.after.playback.nodes.find(node=>node.kind==='status').resourceId,0x1adfb+variant);
    assert.deepEqual(r.vitals.map(event=>[event.slot,event.field,event.value]),[[0,'MP',7]]);
  });
}

test('SKL98 variant 9 zeros live HP before removing the KO target',async()=>{
  const r=await runRound(9,{targets:[[10,0x80000],[11,0]]});
  assert.equal(r.after.bodies.bodies[10],null);
  assert.equal(r.after.bodies.bodies[11].vitals[0],70);
  assert.deepEqual(r.vitals.map(event=>[event.slot,event.field,event.before,event.value]),
    [[0,'MP',10,7],[10,'HP',70,0]]);
});

for(const [caster,target] of [[0,10],[20,0],[21,10]]){
  test('SKL98 variant 10 clears a prior condition from caster slot '+caster,async()=>{
    const r=await runRound(10,{caster,targets:[[target,0x80000]],bodies:{[target]:{flags:0x10}}});
    assert.ok(r.peakRise>0);
    assert.equal(r.numberSeen,caster>=20);
    assert.equal(r.after.playback.nodes.some(node=>node.kind==='status'),false);
    assert.equal(r.after.bodies.bodies[target].dynamicFlags&0x3f0,0);
    assert.equal(r.after.bodies.bodies[target].vitals[0],70);
  });
}

test('SKL98 variant 11 preserves the dead-target wait boundary and caps revived HP',async()=>{
  const r=await runRound(11,{targets:[[10,0x80000,140]],bodies:{10:{flags:2,vitals:[0,100,10,10]}},follow:'CFP|A|2|'});
  const target=r.after.bodies.bodies[10];
  assert.ok(r.peakFall>0);
  assert.deepEqual(target.vitals,[100,100,8,10]);
  assert.equal((target.dynamicFlags|target.savedFlags)&2,0);
  assert.deepEqual(r.vitals.map(event=>[event.slot,event.field,event.value]),[[0,'MP',7],[10,'MP',8],[10,'HP',100]]);
});

test('SKL98 variant 11 self reset replaces the original caster actions',async()=>{
  const r=await runRound(11,{targets:[[0,0x80000,9]]});
  assert.equal(r.preCastPasses,0);
  assert.deepEqual(r.after.bodies.bodies[0].vitals,[79,100,10,10]);
});

test('SKL98 variant 14 leaves target vitals and statuses unchanged',async()=>{
  const r=await runRound(14,{bodies:{10:{flags:0x10}}});
  assert.equal(r.after.bodies.bodies[10].dynamicFlags&0x3f0,0x10);
  assert.deepEqual(r.after.bodies.bodies[10].vitals,[70,100,10,10]);
  assert.equal(r.preCastPasses,270);
});

test('SKL98 releases with an absent caster and can settle an empty target list',async()=>{
  const absent=await runRound(0,{bodies:{0:null}});
  assert.equal(absent.queued,0);
  const empty=await runRound(0,{targets:[]});
  assert.deepEqual(empty.after.bodies.bodies[0].vitals,[70,100,7,10]);
});

test('style 4 adds signed MP and caps it at maximum MP',()=>{
  assert.deepEqual(battleStatusVital([70,100,7,10],4,6),{index:2,before:7,value:10});
  assert.deepEqual(battleStatusVital([70,100,7,10],4,-2),{index:2,before:7,value:5});
});
