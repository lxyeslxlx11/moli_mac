/** Original synthetic protocol/resource setup shared by independent host checks. */
import { resources } from '../game-legacy-scene-frame-v1/original_resources.mjs';
export function originalWorld(api,v,av,extra={}){
 const bytes=hex=>Uint8Array.from(hex.match(/../g)??[],x=>parseInt(x,16)),res=resources(api,v,av),world=api.createLegacyGameWorldProtocol();
 world.configureLocalMovement(null,v.sourceContext);world.configureActorResources(8);
 world.configureActorFrames({animations:res.animations,graphics:res.graphics,source:()=>v.actorSource,geometry:res.geometry,sprite:res.sprite,initialPhase:0});
 const sceneConfig={graphics:res.graphics,cut:res.cut,animations:res.animations,context:()=>({tileCenter:world.copyGameState().localMovement?.display??[2,3],drawPrimitives:false}),geometry:res.geometry,sprite:res.sprite,...extra};world.configureSceneFrames(sceneConfig);
 return {world,res,sceneConfig,seed(){world.append(api.encodeLegacyGameEnvelope(bytes(v.bootstrap.payloadHex)));world.next();const codec=api.createLegacyGamePayloadCodec(bytes(v.bootstrap.keyHex));try{for(const raw of v.protocol.beforePlainHex){world.append(api.encodeLegacyGameEnvelope(codec.encode(bytes(raw))));world.next();}}finally{codec.close();}},close(){world.close();res.close();}};
}
export function originalInput(world,context,extra={}){const local=world.copyLocalMovement().context;return{...context,...Object.fromEntries(['nativePartyMode','nativePartyFlags','nativeCoordinationGuard','nativeActionGuard'].map(k=>[k,local[k]])),...extra};}
export function originalFrame(world,v,context,extra={}){return{tick:1000,runtime:v.runtime,center:[160,120],width:320,height:240,input:originalInput(world,context),graphicsMode:2,forceRender:false,...extra};}
