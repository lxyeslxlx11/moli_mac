import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {createRequire} from 'node:module';
import {resolve} from 'node:path';
import {styleFixture,styleNode,stylePlayback,authoredAnimation} from '../../analysis/game-battle-draw-style-v1/fixture.mjs';
import {attachedRIDFixture} from '../../analysis/game-battle-attached-rid-v1/fixture.mjs';
const api=process.env.MOLI_BATTLE_STYLE_BUILD?createRequire(import.meta.url)(resolve(process.env.MOLI_BATTLE_STYLE_BUILD)):await import('../index.mjs');
const v=JSON.parse(readFileSync(new URL('../../analysis/game-battle-draw-style-v1/original-vectors.json',import.meta.url))),shared=JSON.parse(readFileSync(new URL('../../analysis/game-battle-shared-storage-v1/original-fixtures.json',import.meta.url))),sha=b=>createHash('sha256').update(b).digest('hex');
test('2048 independent finalqueue styles cover allobject masks,separate flag masks,namedselectors andlast ghostalpha',()=>{
 for(const row of v.matrix){const actual=api.legacyGameBattleDrawStyle(row.input);assert.deepEqual(actual,row.expected);assert.ok(Object.isFrozen(actual));}
});
test('2048 complete authored battle frames bind finalARGB/flags/namedcolors without advancing orpoisoning cache',async()=>{
 const f=await styleFixture(api);try{for(const row of v.matrix){const playback=stylePlayback([styleNode({},1),styleNode(row.input,2,1600,{width:4,height:1},[2,3],row.scale)]),before=JSON.stringify(playback),result=f.frame.step({width:v.width,height:v.height},playback,-1),query=result.drawPlan.commands[1].image;assert.deepEqual({flags:query.flags,color:query.color,paletteSelector:query.paletteSelector},row.expected);const output=await f.library.startRender(result.drawPlan).done;assert.equal(sha(output.rgba),row.rgbaSha256);assert.equal(JSON.stringify(playback),before);assert.equal(result.completeBattleGameplay,false);output.rgba.fill(0);}assert.equal(f.library.inspect().stats.imagesDecoded,4);assert.equal(f.library.inspect().stats.namedPalettesDecoded,1);}finally{f.close();}
});
test('actual GMN162/163 controls objectmask while rawactionalpha andadditiveflag stay independent',async()=>{
 const f=await styleFixture(api);try{for(const flags of [0,8]){const catalog=authoredAnimation(api,flags),body=api.createLegacyGameBattleBodies();try{body.configurePlayback({animations:catalog,geometry:f.library.geometry,seed:1,initialPhase:0,alternativeRenderer:true,staticFlip:false,screenOffset:[0,0]});body.applyCharacter(0,0,100001,[0,0]);body.resetQueues(1);body.appendActions(0,1,[162,168,163,166,0]);body.activate(0);
  let enabled=false,faded=false,disabled=false,risingWithoutMask=false;
  for(let i=0;i<400;i++){body.stepPlayback({mainState:10,substate:6,slowEffects:false});const playback=body.copyPlayback(),node=playback.nodes.find(n=>n.kind==='body'&&n.slot===0);if(node.animation.graphicIndex<1000)continue;assert.equal(node.animation.drawFlags,flags);assert.equal(node.animation.color,0x80ffffff);const style=api.legacyGameBattleDrawStyle({drawFlags:node.animation.drawFlags,color:node.animation.color,paletteSelector:node.animation.paletteSelector,actorFlags:node.actorFlags,drawFlagMask:node.drawFlagMask,drawFlagValue:node.drawFlagValue,...(node.drawColorOverride?{drawColorOverride:node.drawColorOverride}:{})});
   if(node.drawColorOverride){enabled=true;assert.equal(node.drawColorOverride.mask,8);if(node.opacity===253){faded=true;assert.equal(style.color>>>24,253);assert.equal(style.flags&8,flags&8);}}
   else if(enabled){disabled=true;assert.equal(style.color>>>24,128);if(node.opacity>0&&node.opacity<255)risingWithoutMask=true;}
  }
  assert.ok(enabled&&faded&&disabled&&risingWithoutMask,{flags,enabled,faded,disabled,risingWithoutMask});
 }finally{body.close();catalog.close();}}}finally{f.close();}
});
test('shape actorcopy inherits initial objectmask thenenables its own alpha onthe next native branch',async()=>{
 for(const enabled of [false,true]){const c={name:'shape-mask',category:73,level:0,variant:0,caster:0,local:0,resource:100114,hits:[[0,10,1,12,null]],rids:[],mounts:[]},f=await attachedRIDFixture(api,shared,c);try{if(enabled){f.owner.appendActions(0,1,[162]);f.owner.activate(0);f.step();}f.owner.resetQueues(1);f.owner.appendTuple(0,[3,0,0,100120]);f.owner.appendActions(0,1,[213,0]);f.owner.activate(0);const history=[];for(let i=0;i<500;i++){f.step();history.push(f.owner.copyPlayback());}const first=history.flatMap(s=>s.nodes).find(n=>n.kind==='actor-copy');assert.ok(first);assert.equal(first.opacity,0);assert.equal(first.drawColorOverride?.mask??0,enabled?8:0);assert.equal(first.animation.drawFlags&8,0);const next=history.flatMap(s=>s.nodes).find(n=>n.kind==='actor-copy'&&n.opacity===7);assert.equal(next.drawColorOverride.mask,8);assert.equal(next.drawColorOverride.color>>>24,7);assert.equal(next.animation.color>>>24,255);assert.equal(f.owner.copyPlayback().nodes.some(n=>n.kind==='actor-copy'),false);}finally{f.close();}}
});
test('native303 alpha assignment preservesRGB,clone ownership andnext action overwrite',async()=>{
 const f=await styleFixture(api),catalog=authoredAnimation(api,8,0x80345678),player=api.createLegacyGameAnimationPlayer(catalog);let clone;const context={resourceId:100001,action:0,facing:0,speedPercent:100,mode:0,frozen:0,staticFlip:false,soundScene:0,actorFlags:0};
 try{player.step(context,f.library.geometry);player.setColorAlpha(7);assert.equal(player.copyState().color,0x07345678);clone=player.clone();player.setColorAlpha(255);assert.equal(player.copyState().color,0xff345678);assert.equal(clone.copyState().color,0x07345678);player.step(context,f.library.geometry);assert.equal(player.copyState().color,0x80345678);assert.equal(clone.copyState().color,0x07345678);const before=player.copyState();for(const value of [-1,256,1.5,undefined])assert.throws(()=>player.setColorAlpha(value),{code:'LEGACY_ANIMATION_INTEGER'});assert.deepEqual(player.copyState(),before);player.close();assert.throws(()=>player.setColorAlpha(0),{code:'LEGACY_ANIMATION_CLOSED'});}finally{clone?.close();player.close();catalog.close();f.close();}
});
test('style boundary rejects accessors,invalid masks/colors andpartial overrides without mutating callers',()=>{
 const input=v.matrix[0].input,before=JSON.stringify(input);let reads=0;assert.throws(()=>api.legacyGameBattleDrawStyle({...input,get color(){reads++;return 0xffffffff;}}),{code:'LEGACY_BATTLE_DRAW_STYLE_FIELDS'});assert.equal(reads,0);for(const key of ['drawFlags','drawFlagMask','drawFlagValue'])for(const value of [-1,256,1.5])assert.throws(()=>api.legacyGameBattleDrawStyle({...input,[key]:value}),{code:'LEGACY_BATTLE_DRAW_STYLE_INTEGER'});for(const value of [undefined,null,{mask:8},{mask:256,color:0},{mask:8,color:0x100000000}])assert.throws(()=>api.legacyGameBattleDrawStyle({...input,drawColorOverride:value}));assert.equal(JSON.stringify(input),before);
});
