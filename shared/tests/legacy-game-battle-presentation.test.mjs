import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import * as api from '../index.mjs';
import {originalFiles} from '../../analysis/game-resource-runtime-v1/original_files.mjs';
import {projectileAssets} from '../../analysis/game-battle-physical-projectiles-v1/original_assets.mjs';
import {sharedContext,sharedMotion} from '../../analysis/game-battle-shared-storage-v1/fixture.mjs';
import {presentationAssets,presentationColors,presentationMask} from '../../analysis/game-battle-shared-storage-v1/presentation-fixture.mjs';

const read=url=>JSON.parse(readFileSync(new URL(url,import.meta.url)));
const base=read('../../analysis/game-resource-runtime-v1/original-vectors.json');
const battleAssets=read('../../analysis/game-battle-shared-storage-v1/original-fixtures.json');
const color=(raster,x,y)=>Array.from(raster.rgba.subarray((y*raster.width+x)*4,(y*raster.width+x)*4+4));
const request=index=>({index,frames:40});
const scene=(changes={})=>({status:'open',alternativeRenderer:false,nodes:[],passes:0,...changes});

async function setup({guest=true,noticeText=true}={}){
  const assets=presentationAssets(projectileAssets(base,battleAssets),{guest});
  const files=originalFiles(assets);
  const library=api.createLegacyGameResourceLibrary({
    plan:api.createLegacyGameResourcePlan(new Uint8Array()),files:files.port,paletteMode:'neutral',
    battlePalette:true,...(noticeText?{rasterText:presentationMask}:{}),
  });
  await library.initialize();
  const {graphics,animations}=library.catalogs();
  const frame=api.createLegacyGameBattleFrameController({graphics,paletteSources:library.copyBattlePaletteSources(),noticeText});
  const owner=api.createLegacyGameBattleCommands();
  owner.configureBodyPlayback({animations,geometry:library.geometry,seed:12345,initialPhase:0,
    alternativeRenderer:false,staticFlip:false,screenOffset:[0,0]});
  owner.configureSkills({graphics});
  for(const slot of [0,10])owner.applyCharacter(slot,0,100114,[0,0],[70,100,10,10]);
  return {files,library,frame,owner,graphics,
    render(plan){return library.startRender(plan).done;},
    step(playback=scene()){return frame.step({width:640,height:480},playback,-1,1);},
    close(){frame.close();owner.close();library.close();files.close();}};
}

function sampled(frame){
  const palette=frame.drawPlan.palette;
  return palette?[...palette.rgb.slice(48,51),palette.tint[0]]:null;
}

test('GMN palette frame steps use source float stores, cache revisions and the exact snap frame',async()=>{
  const f=await setup();
  try{
    const expected=new Map([
      [1,[24,100,206,127]],[2,[29,99,202,126]],[13,[84,88,156,117]],
      [20,[119,81,126,111]],[40,[219,62,41,95]],[41,[219,62,42,96]],
    ]);
    let frame;
    for(let i=1;i<=41;i++){
      frame=f.step(scene({gmnPaletteRequest:request(13)}));
      if(expected.has(i))assert.deepEqual(sampled(frame),expected.get(i));
      if(i===15)assert.deepEqual([...frame.drawPlan.palette.rgb.slice(51,54)],[9,9,8]);
      assert.equal(frame.gmnPalette.revision,i===41?31:1+Math.trunc(i/2));
      assert.equal(frame.gmnPalette.transition,i<=40);
      assert.deepEqual([...frame.drawPlan.palette.rgb.slice(168*3,169*3)],[0,0,0]);
    }
    assert.equal(f.step(scene({gmnPaletteRequest:request(13)})).gmnPalette.step,41);
    for(let i=1;i<=41;i++){
      frame=f.step(scene({gmnPaletteRequest:request(0)}));
      if(i===1)assert.deepEqual(sampled(frame),[214,62,46,96]);
      if(i===40)assert.deepEqual(sampled(frame),[19,100,211,128]);
    }
    assert.equal(frame.drawPlan.palette,undefined);
    assert.equal(frame.gmnPalette.transition,false);
    assert.equal(frame.gmnPalette.index,0);
  }finally{f.close();}
});

test('interrupted CGP transitions begin from the displayed bytes and a fresh battle restores the base',async()=>{
  const f=await setup();
  try{
    let frame;
    for(let i=0;i<15;i++)frame=f.step(scene({gmnPaletteRequest:request(13)}));
    assert.deepEqual(sampled(frame),[94,86,147,115]);
    assert.deepEqual(sampled(f.step(scene({gmnPaletteRequest:request(0)}))),[92,86,148,115]);
    f.frame.resetPalette();
    assert.equal(f.step(scene({gmnPaletteRequest:request(0)})).drawPlan.palette,undefined);
    assert.deepEqual(sampled(f.step(scene({gmnPaletteRequest:request(13)}))),[24,100,206,127]);
  }finally{f.close();}
});

test('an unavailable CGP variant keeps the base pixels and never opens an unknown file',async()=>{
  const f=await setup({guest:false});
  try{
    const frame=f.step(scene({gmnPaletteRequest:request(13)}));
    assert.equal(frame.gmnPalette.resourceAvailable,false);
    assert.equal(frame.gmnPalette.index,0);
    assert.equal(frame.drawPlan.palette,undefined);
    assert.equal(f.files.calls.filter(c=>c.path==='Bin/pal/palet_13.cgp'&&c.kind==='read').length,0);
  }finally{f.close();}
});

test('default and embedded palette pixels recolor with the snapshot while flag4 and replay retain their values',async()=>{
  const f=await setup();
  try{
    const draw=(resource,x,flags)=>({image:{index:f.graphics.image(resource).index,paletteSelector:0,flags,color:0xffffffff},
      x,y:0,priority:0});
    const commands=[draw(245310,0,0),draw(245310,4,4),draw(245311,8,0),draw(245311,12,4)];
    const make=palette=>api.createLegacyGameDrawPlan(16,4,commands,undefined,palette);
    const first=make(f.step(scene({gmnPaletteRequest:request(13)})).drawPlan.palette);
    const out=await f.render(first);
    assert.deepEqual(color(out,0,0),[24,100,206,255]);
    assert.deepEqual(color(out,4,0),[...presentationColors.base,255]);
    assert.deepEqual(color(out,8,0),[198,99,39,255]);
    assert.deepEqual(color(out,12,0),[...presentationColors.embedded,255]);
    const reads=f.files.calls.length;
    const second=make(f.step(scene({gmnPaletteRequest:request(13)})).drawPlan.palette);
    const next=await f.render(second);
    assert.deepEqual(color(next,0,0),[29,99,202,255]);
    assert.deepEqual(color(next,8,0),[196,98,39,255]);
    const retried=await f.render(first);
    assert.deepEqual(retried.rgba,out.rgba);
    assert.equal(f.files.calls.length,reads);
    assert.equal(f.library.inspect().stats.paletteRepaints,4);
  }finally{f.close();}
});

test('the real GMN manager emits 11 opening callbacks before tiles and 101 lane2 text submissions',async()=>{
  const f=await setup();
  try{
    const raw=sharedMotion('GMN',[50,1,0,204,0,'A\nLong',100120,123,70,100,10,10,1]);
    f.owner.load(raw,{...sharedContext,substate:5});
    let birth,opening,ready,lastText,openingCallbacks=0,textCallbacks=0;
    for(let i=1;i<=135;i++){
      const pass=f.owner.callCallbacks(sharedContext);
      if(pass.commands.some(row=>row.kind==='command-gmn'))birth=i;
      const playback=f.owner.copyState().playback;
      const submissions=playback.gmnWindowSubmissions;
      if(!submissions)continue;
      const frame=f.step(playback);
      const window=submissions.windows[0];
      if(window?.kind==='opening'){
        openingCallbacks++;
        assert.equal(window.height,(openingCallbacks-1)*12);
        assert.equal(submissions.text.length,0);
        if(openingCallbacks===4)opening=frame;
      }
      if(submissions.text.length){
        textCallbacks++;
        if(!ready){
          assert.equal(i-birth,12);
          ready=frame;
          assert.deepEqual(submissions.windows.map(r=>[r.x,r.y,r.width,r.height]),[[262,172,116,136]]);
        }
        lastText=frame;
      }
    }
    assert.equal(openingCallbacks,11);
    assert.equal(textCallbacks,101);
    assert.ok(opening.drawPlan.commands.some(r=>r.blackRectangle));
    assert.equal(ready.drawPlan.text.priority,216);
    assert.deepEqual(ready.drawPlan.text.runs.map(r=>[r.x,r.y,String.fromCharCode(...r.bytes)]),[[302,212,'A'],[302,212,'Long']]);
    assert.deepEqual([...ready.gmnWindow.missingResources],[]);
    assert.equal(lastText.gmnWindow.windows,0);
    const painted=await f.render(ready.drawPlan);
    assert.ok(painted.drawOperations.includes('text-lane2'));
    assert.deepEqual(color(painted,302,212),[255,255,255,255]);
    assert.deepEqual(color(painted,320,240),[46,92,145,255]);
    const border=await f.render(opening.drawPlan);
    assert.deepEqual(color(border,263,222),[0,0,0,255]);
    assert.deepEqual(color(border,262,222),[0,0,0,0]);
  }finally{f.close();}
});

test('GMN window geometry and tile clipping follow 48e8d0 in both portable renderer modes',async()=>{
  const f=await setup({noticeText:false});
  try{
    const window={kind:'tiles',x:190,y:180,width:260,height:120};
    const submissions={windows:[window],text:[]};
    const frame=f.step(scene({gmnWindowSubmissions:submissions,alternativeRenderer:true}));
    const tiles=frame.drawPlan.commands;
    assert.equal(tiles.length,22);
    assert.deepEqual(tiles.slice(0,4).map(c=>[c.x,c.y,...c.sourceRectangle]),[
      [190,180,0,0,74,54],[376,180,0,0,74,54],[190,246,0,0,74,54],[376,246,0,0,74,54],
    ]);
    assert.ok(tiles.some(c=>c.sourceRectangle[2]===38));
    assert.ok(tiles.some(c=>c.sourceRectangle[3]===12&&c.opacity===128));
    const opaque=await f.render(f.step(scene({gmnWindowSubmissions:submissions})).drawPlan);
    const translucent=await f.render(frame.drawPlan);
    assert.deepEqual(color(opaque,320,240),[46,92,145,255]);
    assert.deepEqual(color(translucent,320,240),[46,92,145,128]);
  }finally{f.close();}
});

test('the GMN notice obeys the slow-effects quarter gate while its opening actor keeps moving',async()=>{
  const f=await setup();
  try{
    f.owner.load(sharedMotion('GMN',[50,1,0,204,0,'Slow',100120,123,70,100,10,10,1]),{...sharedContext,substate:5});
    let openings=0;
    const textFrames=[];
    for(let i=1;i<=31;i++){
      f.owner.callCallbacks({...sharedContext,slowEffects:true});
      const notice=f.owner.copyState().playback.gmnWindowSubmissions;
      if(notice?.windows[0]?.kind==='opening')openings++;
      if(notice?.text.length)textFrames.push(i);
    }
    assert.equal(openings,11);
    assert.deepEqual(textFrames,[17,21,25,29]);
  }finally{f.close();}
});
