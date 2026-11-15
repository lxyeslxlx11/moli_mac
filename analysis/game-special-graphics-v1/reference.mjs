/** Independent Python expectations exercised through public source/generated APIs. */
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
const sha=b=>createHash('sha256').update(b).digest('hex');
export function baseRGBA(w,h){const b=new Uint8Array(w*h*4);for(let y=0;y<h;y++)for(let x=0;x<w;x++)b.set([(x*7+y*3)&255,(y*5+x)&255,(x^y)&255,255],(y*w+x)*4);return b;}
export function verifyWater(api,v){
 const aggregate=createHash('sha256'),initial=baseRGBA(640,480);
 let native=0,viewport=0,order=0,passes=0,updates=0;
 for(const row of v.frames){assert.deepEqual(api.legacyGameWaterRows({phase:row.phase,amplitude:row.amplitude}),row.rows);const frame=api.composeLegacyGameFrame(640,480,[{waterStrip:{phase:row.phase,amplitude:row.amplitude},priority:2}],initial);assert.equal(sha(frame.rgba),row.sha256);aggregate.update(row.sha256);frame.rgba.fill(0);native++;}
 for(const row of v.viewports){const frame=api.composeLegacyGameFrame(row.width,row.height,[{waterStrip:{phase:row.phase,amplitude:row.amplitude},priority:2}],baseRGBA(row.width,row.height));assert.equal(sha(frame.rgba),row.sha256);aggregate.update(row.sha256);frame.rgba.fill(0);viewport++;}
 const sprites=[];
 for(const rgb of [[200,10,20],[20,210,30],[30,40,220]]){const paletteBytes=new Uint8Array(768);paletteBytes.set(rgb,3);const palette=api.createLegacyGamePalette32(paletteBytes,'explicit-rgb'),raw=new Uint8Array(20),d=new DataView(raw.buffer);raw.set([82,68]);d.setInt32(4,4,true);d.setInt32(8,1,true);raw.fill(1,16);const image=api.decodeLegacyGameRD(raw);try{sprites.push(api.prepareLegacyGameSprite(image,palette));}finally{image.close();palette.close();}}
 try{for(const row of v.orders){const commands=sprites.map((sprite,i)=>({sprite,x:16,y:8,priority:[1,2,5][i],scale:[2,16]}));commands.push({waterStrip:{phase:row.phase,amplitude:row.amplitude},priority:2});const frame=api.composeLegacyGameFrame(640,480,commands,initial);assert.equal(sha(frame.rgba),row.sha256);assert.deepEqual(frame.drawOrder,row.drawOrder);aggregate.update(row.sha256);frame.rgba.fill(0);order++;}}finally{for(const sprite of sprites)sprite.close();}
 for(const trace of v.traces){const water=api.createLegacyGameWater();try{for(const row of trace.rows){for(let i=0;i<row.updates;i++){water.advance();updates++;}assert.deepEqual(water.present(row.requested,row.mapId,row.position,row.camera,row.center,row.gate),row.command);assert.deepEqual(water.copyState(),row.state);passes++;aggregate.update(JSON.stringify(row.state));}}finally{water.close();}}
 assert.equal(sha(initial),sha(baseRGBA(640,480)));
 return {stage:298,nativeFrames:native,viewportFrames:viewport,orderFrames:order,completeFrames:native+viewport+order,statePasses:passes,updates,digest:aggregate.digest('hex')};
}
