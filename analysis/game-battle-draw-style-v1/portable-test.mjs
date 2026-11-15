import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {createRequire} from 'node:module';
import {resolve} from 'node:path';
import assert from 'node:assert/strict';
import {styleFixture,styleNode,stylePlayback} from './fixture.mjs';
import {originalFiles} from '../game-resource-runtime-v1/original_files.mjs';
import {battleBodyAssets} from '../game-battle-body-v1/original_assets.mjs';
const api=process.argv[2]==='generated'?createRequire(import.meta.url)(resolve('build/wechat-game-stage295-api-final/game.js')):await import('../../shared/index.mjs');
const read=p=>JSON.parse(readFileSync(new URL(p,import.meta.url))),v=read('./original-vectors.json'),sha=b=>createHash('sha256').update(b).digest('hex'),rows=[];
const f=await styleFixture(api);try{for(const row of v.matrix){assert.deepEqual(api.legacyGameBattleDrawStyle(row.input),row.expected);const p=stylePlayback([styleNode({},1),styleNode(row.input,2,1600,{width:4,height:1},[2,3],row.scale)]),before=JSON.stringify(p),frame=f.frame.step({width:v.width,height:v.height},p,-1),output=await f.library.startRender(frame.drawPlan).done;assert.equal(sha(output.rgba),row.rgbaSha256);assert.equal(JSON.stringify(p),before);rows.push(row.rgbaSha256);output.rgba.fill(0);}assert.equal(f.library.inspect().stats.imagesDecoded,4);assert.equal(f.library.inspect().stats.namedPalettesDecoded,1);}finally{f.close();}
const bodyV=read('../game-battle-body-v1/original-vectors.json'),base=read('../game-resource-runtime-v1/original-vectors.json'),files=originalFiles(battleBodyAssets(base,bodyV)),library=api.createLegacyGameResourceLibrary({plan:api.createLegacyGameResourcePlan(new Uint8Array()),files:files.port,paletteMode:'neutral'});let promoted=0;
try{await library.initialize();for(const trace of bodyV.traces){const expected=v.promotedBattleFrames.filter(r=>r.trace===trace.name);if(!expected.length)continue;const body=api.createLegacyGameBattleBodies(),frame=api.createLegacyGameBattleFrameController({graphics:library.catalogs().graphics});
 try{body.configurePlayback({animations:library.catalogs().animations,geometry:library.geometry,seed:12345,initialPhase:0,alternativeRenderer:trace.alternativeRenderer??false,staticFlip:false,screenOffset:trace.offset??[0,0]});body.applyCharacter(trace.slot,trace.flags,100010,[0,0]);body.resetQueues(1<<trace.slot);body.setMessageResource(trace.slot,trace.message);body.appendActions(trace.slot,1,trace.queue);body.activate(trace.slot);
  for(let i=0;i<trace.frames.length;i++){body.stepPlayback({mainState:10,substate:6,slowEffects:trace.slowEffects});const row=expected.find(r=>r.step===i);if(!row)continue;const p=body.copyPlayback(),before=JSON.stringify(p),plan=frame.step({width:640,height:480},p,1000),out=await library.startRender(plan.drawPlan).done;assert.equal(sha(out.rgba),row.expected.rgbaSha256,trace.name+':'+i);assert.equal(JSON.stringify(body.copyPlayback()),before);rows.push(row.expected.rgbaSha256);out.rgba.fill(0);promoted++;}
 }finally{frame.close();body.close();}}
}finally{library.close();files.close();}
assert.equal(promoted,v.promotedBattleFrames.length);console.log(JSON.stringify({stage:295,styleProjections:v.matrix.length,completeMatrixFrames:v.matrix.length,promotedBodyFrames:promoted,completeReferenceFrames:rows.length,digest:sha(Buffer.from(JSON.stringify(rows))),sourceGeneratedComparable:true,originalExecution:false}));
