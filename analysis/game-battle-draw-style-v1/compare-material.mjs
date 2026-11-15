import {openSync,closeSync,readSync,statSync,readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {createRequire} from 'node:module';
import {resolve} from 'node:path';
import assert from 'node:assert/strict';
import {styleNode,stylePlayback} from './fixture.mjs';
const api=process.argv[2]==='generated'?createRequire(import.meta.url)(resolve('build/wechat-game-stage295-api-final/game.js')):await import('../../shared/index.mjs');
const profile=JSON.parse(readFileSync(new URL('../game-legacy-material-compat-v1/material-profile.json',import.meta.url))),v=JSON.parse(readFileSync('build/analysis/game-battle-draw-style-v1/material-oracle.json'));
const sha=b=>createHash('sha256').update(b).digest('hex'),fd=openSync(profile.archive,'r');
const archive=await api.createLegacyGameResourceArchive({size:statSync(profile.archive).size,async read(at,length){const b=new Uint8Array(length);assert.equal(readSync(fd,b,0,length,at),length);return b;},close(){closeSync(fd);}});
const library=api.createLegacyGameResourceLibrary({plan:api.createLegacyGameResourcePlan(new TextEncoder().encode(profile.parameters)),files:archive.port,paletteMode:'neutral'});let controller;
try{const catalogs=await library.initialize();controller=api.createLegacyGameBattleFrameController({graphics:catalogs.graphics});const rows=[];
 for(const row of v.rows){const input={drawFlags:row.action_flags,color:row.action_color,paletteSelector:row.selector};
  if(row.context==='alpha0')input.drawColorOverride={mask:8,color:0x00ffffff};if(row.context==='alpha64')input.drawColorOverride={mask:8,color:0x40ffffff};if(row.context==='ghost'||row.context==='rgb-ghost')input.actorFlags=0x100000;if(row.context==='rgb-ghost')input.drawColorOverride={mask:7,color:0xff80c040};if(row.context==='clear-additive'){input.drawFlagMask=8;input.drawFlagValue=0;}
  const action=catalogs.animations.animation(row.resource).actions.find(a=>a.direction===row.direction&&a.action===0);assert.equal(action.color,row.action_color);assert.equal(action.flags,row.action_flags);assert.equal(action.frames[row.ordinal].graphicIndex,row.index);
  const playback=stylePlayback([styleNode({},1,v.floor.source.index,{width:v.floor.width,height:v.floor.height},[0,0]),styleNode(input,2,row.index,{width:row.width,height:row.height},[row.x,row.y])]),before=JSON.stringify(playback),frame=controller.step({width:v.width,height:v.height},playback,-1),q=frame.drawPlan.commands[1].image;
  assert.equal(q.flags,row.final_flags);assert.equal(q.color,row.final_color);assert.equal(q.paletteSelector,row.selector);assert.equal(JSON.stringify(playback),before);
  const output=await library.startRender(frame.drawPlan).done;assert.equal(sha(output.rgba),row.rgba_sha256,JSON.stringify([row.resource,row.direction,row.ordinal,row.context]));rows.push(row.rgba_sha256);output.rgba.fill(0);
 }
 console.log(JSON.stringify({stage:295,actualFrames:v.actual_frames,actions:v.actions,namedCarriers:v.named_carriers,contexts:v.contexts.length,completeBattleFrames:rows.length,digest:sha(Buffer.from(JSON.stringify(rows))),sourceGeneratedComparable:true,originalExecution:false}));
}finally{controller?.close();library.close();archive.close();}
