/** Actual owned OS TCP facade for either source modules or an already loaded neutral bundle. */
import assert from 'node:assert/strict';
import {copyFile,mkdtemp,rm} from 'node:fs/promises';
import {join} from 'node:path';
import {tmpdir} from 'node:os';
import {createConnection} from 'node:net';
import {createInterface} from 'node:readline';
import {spawn} from 'node:child_process';
import {createHash} from 'node:crypto';
import {originalWorld,originalFrame} from '../game-input-runtime-v1/original_world.mjs';
import {vectors,scene,animation,input} from './original_world.mjs';
export async function runPartyTCP(api,name){
 const c=vectors.cases.find(c=>c.name===name),temp=await mkdtemp(join(tmpdir(),'moli-party-follow-'));
 for(const [source,target]of [['original_peer.py','original_peer.py'],['original-vectors.json','party-vectors.json'],['../game-legacy-scene-frame-v1/original-vectors.json','scene-vectors.json'],['../game-legacy-message-v1/generate_vectors.py','wire_reference.py']])await copyFile(new URL(source,import.meta.url),join(temp,target));
 const child=spawn('python3',[join(temp,'original_peer.py'),name],{stdio:['pipe','pipe','pipe']}),lines=createInterface({input:child.stdout}),iterator=lines[Symbol.asyncIterator](),exit=new Promise((resolve,reject)=>{child.once('exit',resolve);child.once('error',reject);});let diagnostics='',socket,runtime,frames=0,packets=0;child.stderr.on('data',b=>{diagnostics+=b;});
 const f=originalWorld(api,scene,animation);f.world.configureActorFrames({animations:f.res.animations,graphics:f.res.graphics,source:()=>scene.actorSource,geometry:f.res.geometry,sprite:f.res.sprite,initialPhase:0,bindActorSource:true});
 try{const first=await iterator.next();assert.equal(first.done,false,diagnostics);const port=JSON.parse(first.value).port;socket=createConnection({host:'127.0.0.1',port});
  await new Promise((resolve,reject)=>{socket.once('error',reject);socket.on('data',data=>{try{f.world.append(data);for(;;){const message=f.world.next();if(message.kind==='need-more')break;if(message.kind!=='message')continue;packets++;if(packets===scene.protocol.beforePlainHex.length+c.packets.length){
   runtime=api.createLegacyGameRuntime({world:f.world,initialTick:1000,initialCamera:f.world.copyLocalMovement().position});if(c.destination)f.world.requestLocalDestination(c.destination);
   for(const row of c.frames){const out=runtime.pump(originalFrame(f.world,scene,input.context,{tick:row.tick}));assert.equal(out.error,null);assert.equal(out.updates,1);assert.equal(createHash('sha256').update(out.frame.sceneLayer.rgba).digest('hex'),row.rgbaSha256);for(const command of out.requests)socket.write(f.world.encodeCommand(command.operationId,command.arguments));frames++;}
   child.stdin.write('done\n');
  }}}catch(error){reject(error);}});socket.once('end',()=>{socket.end();resolve();});});
  const row=await iterator.next();assert.equal(row.done,false,diagnostics);assert.equal(await exit,0,diagnostics);const receipt=JSON.parse(row.value);assert.equal(receipt.requests_verified,c.expected_requests);assert.equal(receipt.source_packets,packets);assert.equal(frames,c.frames.length);runtime.close();f.world.close();return{case:name,frames,sourcePackets:packets,receipt,closedOwners:f.world.inspect().state==='closed'&&runtime.inspect().state==='closed',officialSession:false};
 }finally{socket?.destroy();runtime?.close();f.close();lines.close();child.stdin.end();if(child.exitCode===null)child.kill('SIGTERM');await exit;await rm(temp,{recursive:true,force:true});}
}
