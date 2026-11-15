import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import * as api from '../index.mjs';
import {createLegacyGameBattleFrameController} from '../legacy-game-battle-frame.mjs';
import {createLegacyGameBattleState} from '../legacy-game-battle.mjs';
import {originalFiles} from '../../analysis/game-resource-runtime-v1/original_files.mjs';
import {battleBodyAssets} from '../../analysis/game-battle-body-v1/original_assets.mjs';
const read=p=>JSON.parse(readFileSync(new URL(p,import.meta.url))),v=read('../../analysis/game-battle-scene-v1/original-vectors.json'),bodyV=read('../../analysis/game-battle-body-v1/original-vectors.json'),
  base=read('../../analysis/game-resource-runtime-v1/original-vectors.json'),plain=x=>JSON.parse(JSON.stringify(x)),sha=x=>createHash('sha256').update(x).digest('hex');
const promoted=read('../../analysis/game-battle-draw-style-v1/original-vectors.json').promotedBattleFrames;
async function setup(){const files=originalFiles(battleBodyAssets(base,bodyV)),library=api.createLegacyGameResourceLibrary({plan:api.createLegacyGameResourcePlan(new Uint8Array()),files:files.port,paletteMode:'neutral'});await library.initialize();return{files,library,close(){library.close();files.close();}};}
const ctx={mainState:10,substate:6,slowEffects:false};
const configuration=(library,trace={})=>({animations:library.catalogs().animations,geometry:library.geometry,seed:12345,initialPhase:0,alternativeRenderer:trace.alternativeRenderer??false,staticFlip:false,screenOffset:trace.offset??[0,0]});
const initialNode=()=>{const n=plain(bodyV.traces[0].frames[0].nodes[0]);return{...n,slot:0,drawPriority:9,scale:[1,1],depthKey:0,alternateY:0,drawFlagMask:0,drawFlagValue:4};};
const playback=nodes=>({status:'open',alternativeRenderer:false,passes:1,nodes});
const frame=(f,nodes,bg=1000)=>{const c=createLegacyGameBattleFrameController({graphics:f.library.catalogs().graphics});try{return c.step({width:640,height:480},playback(nodes),bg);}finally{c.close();}};

test('source graphic zero is hidden while a positive graphic still requires geometry',async()=>{
  const f=await setup();try{
    const hidden=initialNode();hidden.resourceId=0;hidden.animation.graphicIndex=0;hidden.animation.geometry=null;
    const out=frame(f,[hidden]);
    assert.ok(out.skipped.some(row=>row.id===hidden.id&&row.reason==='graphic-empty'));
    assert.ok(!out.submitted.some(row=>row.id===hidden.id));
    const visible=initialNode();visible.animation.geometry=null;
    assert.ok(visible.animation.graphicIndex>0);
    assert.throws(()=>frame(f,[visible]),e=>e.code==='LEGACY_BATTLE_FRAME_GEOMETRY');
  }finally{f.close();}
});

test('battle pointer-depth sort retains native equal-key permutations, signed270, alternateY and4096 capacity',()=>{
  for(const row of v.sorts)assert.deepEqual(api.sortLegacyGameBattleDepth(row.rows),row.expected);
  assert.throws(()=>api.sortLegacyGameBattleDepth([{id:1,y:0,alternateY:0,flags:0,depthKey:32768}]));
  assert.throws(()=>api.sortLegacyGameBattleDepth([{id:1,y:0,alternateY:0,flags:0,depthKey:0},{id:1,y:0,alternateY:0,flags:0,depthKey:0}]));
});
test('real owned callbacks and RD/CGP resources matchindependent complete frame rasters with source49 and selector/scale corrections',async()=>{
  const f=await setup();let rendered=0,unavailable=0;
  try{for(const trace of bodyV.traces){const body=api.createLegacyGameBattleBodies();let scene=createLegacyGameBattleFrameController({graphics:f.library.catalogs().graphics});
    try{body.configurePlayback(configuration(f.library,trace));body.applyCharacter(trace.slot,trace.flags,100010,[0,0]);body.resetQueues(1<<trace.slot);body.setMessageResource(trace.slot,trace.message);body.appendActions(trace.slot,1,trace.queue);body.activate(trace.slot);
      const expected=v.traces.find(t=>t.name===trace.name);
      for(let i=0;i<trace.frames.length;i++){body.stepPlayback({...ctx,slowEffects:trace.slowEffects});const before=JSON.stringify(body.copyPlayback()),row=promoted.find(r=>r.trace===trace.name&&r.step===i)?.expected??expected.frames[i],label=trace.name+'#'+i;
        if(row.unavailable){assert.throws(()=>scene.step({width:640,height:480},body.copyPlayback(),1000),e=>e.code===row.unavailable,label);scene.close();scene=createLegacyGameBattleFrameController({graphics:f.library.catalogs().graphics});unavailable++;}
        else{const result=scene.step({width:640,height:480},body.copyPlayback(),1000),commands=result.drawPlan.commands.map((c,i)=>({id:result.submitted[i].id,kind:result.submitted[i].kind,index:c.image.index,flags:c.image.flags,x:c.x,y:c.y,priority:c.priority,...(c.image.color!==0xffffffff?{color:c.image.color}:{}),...(c.scale?{scale:[...c.scale]}:{})}));
          assert.deepEqual(plain(result.depthOrder),row.depthOrder,label);assert.deepEqual(plain(result.skipped),row.skipped,label);assert.deepEqual(commands,row.commands,label);assert.deepEqual(result.drawOrder.map(r=>r.id),row.drawOrder,label);
          const pixels=await f.library.startRender(result.drawPlan).done;assert.equal(sha(pixels.rgba),row.rgbaSha256,label);assert.equal(result.renderer,'partial');assert.equal(result.nativeMain10Driver,'unimplemented');assert.equal(result.completeBattleGameplay,false);rendered++;}
        assert.equal(JSON.stringify(body.copyPlayback()),before,label+' rendering must not advance callbacks');
      }
    }finally{scene.close();body.close();}}
    assert.equal(rendered,v.counts.pixel_frames+promoted.length);assert.equal(unavailable,v.counts.explicit_unavailable_frames-promoted.length);
    console.log('battle-frame-original '+JSON.stringify({rendered,unavailable,independentSourceFrames:1994,actualResourceReads:f.files.calls.filter(c=>c.kind==='read').length}));
  }finally{f.close();}
});
test('depth assignment precedes renderer, deleted and hidden filters; detached pool bodies remain drawable',async()=>{
  const f=await setup();try{const nodes=Array.from({length:6},(_,i)=>({...initialNode(),id:i+1,screen:[80,50+i],slot:i===5?10:i,actorFlags:0x20000}));nodes[0].actorFlags|=0x8000;nodes[1].deleted=true;nodes[2].actorFlags|=2;nodes[3].actorFlags|=0x10000;nodes[4].animation.graphicIndex=-1;
    const result=frame(f,nodes);assert.deepEqual(result.depthOrder,[1,2,3,4,5,6]);assert.deepEqual(result.depthPriorities.map(r=>r.priority),[9,10,11,12,13,14]);
    assert.deepEqual(result.skipped.map(r=>r.reason),['renderer-filter','deleted','hidden','graphic-missing']);assert.deepEqual(result.submitted.filter(r=>r.kind!=='background').map(r=>[r.id,r.priority]),[[4,12],[6,14]]);
  }finally{f.close();}
});
test('byte depth priorities wrap through0 and background tie order follows appended captured-surface record',async()=>{
  const f=await setup();try{const nodes=Array.from({length:260},(_,i)=>({...initialNode(),id:i+1,screen:[80,i],actorFlags:0x20000})),result=frame(f,nodes);
    assert.equal(result.depthPriorities[247].priority,0);assert.equal(result.depthPriorities[252].priority,5);assert.ok(result.drawOrder.findIndex(r=>r.kind==='background')<result.drawOrder.findIndex(r=>r.id===253));
    const boundary=frame(f,Array.from({length:4096},(_,i)=>({...initialNode(),id:i+1,actorFlags:0,drawPriority:10})));assert.equal(boundary.dropped,3);assert.equal(boundary.submitted.length,4094);
  }finally{f.close();}
});
test('flags4 overrides affect actual image palette and flips retain signed-short pixel coordinates',async()=>{
  const f=await setup();try{const n=initialNode();n.kind='status';n.drawFlagMask=n.drawFlagValue=4;n.animation.drawFlags=3;n.screen=[65530,-65530];const result=frame(f,[n],0),c=result.drawPlan.commands[0];assert.equal(c.image.flags,7);assert.equal(c.flip,3);assert.equal(c.x,(65530+n.animation.drawOffsetX)|0);assert.equal(c.y,(-65530+n.animation.drawOffsetY)|0);const pixels=await f.library.startRender(result.drawPlan).done;assert.equal(pixels.rgba.length,640*480*4);
  }finally{f.close();}
});
test('unproven style bits, missing image data and invalid background paths fail explicitly',async()=>{
  const f=await setup();try{const badStyle=initialNode();badStyle.animation.drawFlags=16;assert.throws(()=>frame(f,[badStyle]),e=>e.code==='LEGACY_BATTLE_FRAME_DRAW_STYLE');
    const missing=initialNode();missing.animation.graphicIndex=3096;const request=frame(f,[missing],0);assert.equal(request.waterRequested,true);await assert.rejects(f.library.startRender(request.drawPlan).done,e=>e.code==='LEGACY_ASSET_IMAGE_MISSING');assert.throws(()=>frame(f,[],-2),e=>e.code==='LEGACY_BATTLE_FRAME_BACKGROUND');
  }finally{f.close();}
});
test('invalid frame requests invoke no accessors and closed controllers/catalogs do not fabricate frames',async()=>{
  const f=await setup(),c=createLegacyGameBattleFrameController({graphics:f.library.catalogs().graphics});try{let reads=0;assert.throws(()=>c.step({get width(){reads++;return 640;},height:480},playback([]),0));assert.equal(reads,0);assert.equal(c.inspect().frames,0);assert.equal(c.step({width:640,height:480},playback([]),0).drawPlan.commands.length,0);c.close();assert.throws(()=>c.step({width:640,height:480},playback([]),0));assert.ok(f.library.catalogs().graphics.inspect().records>0);
  }finally{c.close();f.close();}
});
test('battle owner reads its actual C bodies and rendering preserves receive, command and animation state',async()=>{
  const f=await setup(),battle=createLegacyGameBattleState();try{battle.configureBodyPlayback(configuration(f.library));battle.configureFrames({graphics:f.library.catalogs().graphics});battle.applyEntry(1,1000);const text='C|0|0|Original|186AA|0|A|64|64|1E|1E|0|0|0|';battle.receive(new TextEncoder().encode(text),10);assert.throws(()=>battle.stepFrame({width:640,height:480}));battle.consumeCharacters();const before=JSON.stringify(battle.copyCommands()),result=battle.stepFrame({width:640,height:480});assert.equal(result.submitted.filter(r=>r.kind==='body').length,1);assert.equal(JSON.stringify(battle.copyCommands()),before);assert.equal(battle.copyState().rendering,'partial');assert.equal(battle.copyState().completeRendererAvailable,false);assert.equal(battle.inspect().actionExecutionAvailable,false);
  }finally{battle.close();assert.ok(f.library.catalogs().graphics.inspect().records>0);f.close();}
});
