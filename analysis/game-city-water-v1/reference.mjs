import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {cityFixture} from './fixture.mjs';
const sha=b=>createHash('sha256').update(b).digest('hex');
export async function verifyCityWater(api,v){let states=0,frames=0;const hashes=[];
 for(const trace of v.traces){const c=await cityFixture(api),{f,world,request}=c;let previous;
  try{
   for(let i=0;i<51;i++){const frame=world.advanceFrameFollowingLocal({...request,tick:i});assert.equal(frame.sceneFrameError,null);assert.equal(frame.actorFrameError,null);assert.deepEqual(world.copyWaterState(),trace.rows[i].state,trace.route+' warm '+i);states++;if(i===50)previous=(await f.client.library().startRender(frame.sceneLayer.drawPlan).done).rgba;}
   assert.equal(f.client.requestCityReturn(previous),true);
   for(let i=51;i<54;i++){const frame=await f.client.advanceCityReturn(i);assert.ok(frame?.rgba);f.client.presentCityReturn(frame,()=>{});assert.deepEqual(world.copyWaterState(),trace.rows[i].state,'ordinary awaiting '+i);states++;}
   if(trace.route==='scene'){await c.send(c.scene(trace.mapId));await c.send(c.patch(trace.mapId));await f.drive(()=>f.client.inspect().sceneReady);}
   else await c.send('>HY 1 g8 ');
   assert.equal(world.copyGameState().actors.localActor,null,'source transfer/boundary clears local');
   for(let i=1;i<=trace.steps;i++){
    if(trace.ownAt===i)await c.send(c.own);
    const frame=await f.client.advanceCityReturn(100+i);if(frame){hashes.push(sha(frame.rgba??new Uint8Array()));f.client.presentCityReturn(frame,()=>{});}
    assert.deepEqual(world.copyWaterState(),trace.rows[53+i].state,trace.route+'/'+trace.mapId+'/'+trace.ownAt+' #'+i);states++;
   }
   assert.equal(f.client.inspect().state,trace.route==='scene'&&trace.ownAt===0?'preparing-scene':'playing');assert.equal(world.copyGameState().actors.localActor!==null,trace.route==='boundary'||trace.ownAt!==0);
   assert.equal(f.writes.length,trace.route==='boundary'?5:4);assert.equal(f.stats.opens,1);
  }finally{c.close();}
 }
 for(const raster of v.rasters){const raw=new Uint8Array(640*480*4);for(let y=0,p=0;y<480;y++)for(let x=0;x<640;x++){raw[p++]=(x*3+y*7)&255;raw[p++]=(x*11+y*5)&255;raw[p++]=(x^y)&255;raw[p++]=255;}
  const water=api.createLegacyGameWater();for(let i=0;i<59;i++)water.advance();for(let i=0;i<50;i++)water.present(true,40000,[0,0],[0,0],[320,240]);let captured=null,updates=0;
  const transition=api.createLegacyGameCityReturn(null,()=>{const strip=water.consume(true,raster.amplitude?40000:59000,[0,0],[0,0],[320,240]);assert.deepEqual(strip,{phase:raster.phase,amplitude:raster.amplitude});captured=api.composeLegacyGameFrame(640,480,[{waterStrip:strip,priority:2}],raw).rgba;assert.equal(sha(captured),raster.capture);return{done:Promise.resolve({rgba:captured}),cancel(){}};},'map',()=>{water.advance();water.consume(false,40000,[0,0],[0,0],[320,240]);water.savePosition([0,0]);updates++;});
  try{transition.begin('scene');for(let i=0;i<5;i++)transition.present(await transition.advance(i),()=>{});
   for(let i=0;i<49;i++){const frame=await transition.advance(i+5),hash=sha(frame.rgba);assert.equal(hash,raster.frames[i]);hashes.push(hash);frames++;transition.present(frame,()=>{});assert.equal(frame.complete,i===48);}
   assert.equal(updates,54);assert.equal(water.copyState().phase,28.25);
  }finally{transition.close();water.close();raw.fill(0);}
 }
 return{stage:300,traces:v.traces.length,stateChecks:states,completeFrames:frames,digest:sha(JSON.stringify(hashes)),nativeAcceptance:false};
}
