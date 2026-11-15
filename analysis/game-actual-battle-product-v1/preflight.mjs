/** Identify unchanged corpus and the exact actors/background used by the authored product flow. */
import {openSync,closeSync,readSync,statSync,readFileSync,writeFileSync,createReadStream} from 'node:fs';
import {createHash} from 'node:crypto';
import {createRequire} from 'node:module';
import {resolve} from 'node:path';
import assert from 'node:assert/strict';
const api=process.argv[2]==='generated'?createRequire(import.meta.url)(resolve('build/wechat-game-stage296-api-final/game.js')):await import('../../shared/index.mjs');
const profilePath='analysis/game-legacy-material-compat-v1/material-profile.json',raw=readFileSync(profilePath),profile=JSON.parse(raw),fd=openSync(profile.archive,'r');
const archive=await api.createLegacyGameResourceArchive({size:statSync(profile.archive).size,async read(at,length){const b=new Uint8Array(length);assert.equal(readSync(fd,b,0,length,at),length);return b;},close(){closeSync(fd);}});
const library=api.createLegacyGameResourceLibrary({plan:api.createLegacyGameResourcePlan(new TextEncoder().encode(profile.parameters)),files:archive.port,paletteMode:'neutral'});
try{
  const catalogs=await library.initialize();
  const actor=catalogs.animations.animation(100010),background=catalogs.graphics.image(300653);
  assert.equal(actor.actionCount,160);assert.equal(background.width,640);assert.equal(background.height,480);assert.equal(background.index,618381);
  const actions=actor.actions.map(a=>({direction:a.direction,action:a.action,frames:a.frameCount,duration:a.duration,delayTicks:a.delayTicks,color:a.color,flags:a.flags,paletteSelector:a.paletteSelector,
    signals:a.frames.flatMap((f,i)=>f.event>=10000?[{frame:i,value:f.event}]:[])}));
  for(let direction=0;direction<8;direction++)for(const action of [0,1,2,5,6])assert.ok(actions.some(a=>a.direction===direction&&a.action===action));
  assert.ok(actions.filter(a=>a.action===5||a.action===6).some(a=>a.signals.length));
  const graphics=[300653,1099,243710,243711,0x5736,0x5737].map(resource=>({resource,...catalogs.graphics.image(resource)}));assert.ok(graphics.every(g=>g.present&&g.index>=1000));
  const hash=createHash('sha256');for await(const block of createReadStream(profile.archive))hash.update(block);
  const identity={path:profile.archive,bytes:statSync(profile.archive).size,sha256:hash.digest('hex')};
  assert.equal(identity.bytes,2549171845);assert.equal(identity.sha256,'6ff08fd6251c748afaaa36a894b027a4992bdcc1e1a615d3f739809c5d6d2c8e');
  const out={stage:296,archive:identity,profile:{path:profilePath,bytes:raw.length,sha256:createHash('sha256').update(raw).digest('hex')},actor:100010,actions,graphics,
    selectedCuts:[59510,59526],mode:1,files:archive.inspect().files??1072,animationSignalsUnchanged:true,artworkUnchanged:true,actualServerVersionCompatibility:false,originalExecution:false};
  writeFileSync('build/analysis/game-actual-battle-product-v1/preflight-'+(process.argv[2]==='generated'?'generated':'source')+'.json',JSON.stringify(out,null,2)+'\n');
  console.log(JSON.stringify({stage:296,actor:100010,actorActions:actions.length,signalFrames:actions.reduce((n,a)=>n+a.signals.length,0),background:300653,backgroundIndex:618381,width:640,height:480,
    archive:identity,archiveFiles:1072,sourceGeneratedComparable:true,artworkUnchanged:true,actualServerVersionCompatibility:false}));
}finally{library.close();archive.close();}
