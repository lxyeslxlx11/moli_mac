/** Synthetic source packets/resources only, sent through the actual owning world codec. */
import {readFileSync} from 'node:fs';
import * as api from '../../shared/index.mjs';
import {originalWorld,originalFrame} from '../game-input-runtime-v1/original_world.mjs';
const read=p=>JSON.parse(readFileSync(new URL(p,import.meta.url)));
export const vectors=read('./original-vectors.json'),scene=read('../game-legacy-scene-frame-v1/original-vectors.json'),animation=read('../game-legacy-animation-v1/original-vectors.json'),input=read('../game-input-runtime-v1/original-vectors.json');
export const ascii=s=>new Uint8Array(Buffer.from(s,'latin1'));
export function partyWorld(name){
 const selected=typeof name==='string'?vectors.cases.find(c=>c.name===name):name;if(!selected)throw Error('Unknown original party case');
 const f=originalWorld(api,scene,animation);f.seed();f.world.configureActorFrames({animations:f.res.animations,graphics:f.res.graphics,source:()=>scene.actorSource,geometry:f.res.geometry,sprite:f.res.sprite,initialPhase:0,bindActorSource:true});
 const codec=api.createLegacyGamePayloadCodec(new Uint8Array(Buffer.from(scene.bootstrap.keyHex,'hex')));
 const send=text=>{const payload=codec.encode(ascii(text));try{f.world.append(api.encodeLegacyGameEnvelope(payload));const result=f.world.next();if(result.kind!=='message')throw Error('Original message did not apply');return result;}finally{payload.fill(0);}};
 for(const packet of selected.packets)send(packet);
 const runtime=api.createLegacyGameRuntime({world:f.world,initialTick:1000,initialCamera:f.world.copyLocalMovement().position});
 if(selected.destination)f.world.requestLocalDestination(selected.destination);
 return{...f,selected,runtime,send,frame(tick,extra={}){return originalFrame(f.world,scene,input.context,{tick,...extra});},close(){runtime.close();codec.close();f.close();}};
}
