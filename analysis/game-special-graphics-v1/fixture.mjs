/** Extend only original numeric fixtures with sparse water graphics and an authored map. */
import {resources,mapBytes} from '../game-legacy-scene-frame-v1/original_resources.mjs';
export function waterFixture(api,source,animations,{deferImages=true}={}){
 const raw=new Uint8Array(Buffer.from(source.graphicBytesHex,'hex').length+10*40);raw.set(Buffer.from(source.graphicBytesHex,'hex'));const d=new DataView(raw.buffer),start=raw.length-400;
 for(let i=0;i<10;i++){const at=start+i*40;d.setInt32(at,3096+i,true);d.setInt32(at+12,-32,true);d.setInt32(at+16,-24,true);d.setUint32(at+20,64,true);d.setUint32(at+24,48,true);raw[at+28]=raw[at+29]=1;d.setUint32(at+36,5000+i,true);}
 const v={...source,graphicBytesHex:Buffer.from(raw).toString('hex')},res=resources(api,v,animations),map=api.createLegacyGameMapState(7,40000,mapBytes(1,1,[[5000],[0],[16384]]),0),scene={identity:[7,40000],checksumMode:0};
 const config={graphics:res.graphics,animations:res.animations,cut:res.cut,context:()=>({tileCenter:[0,0],drawPrimitives:false}),geometry:res.geometry,sprite:res.sprite,deferImages};
 const controller=api.createLegacyGameSceneFrameController(config),request={tick:0,runtime:source.runtime,camera:[0,0],center:[320,240],width:640,height:480};
 return {v,res,map,scene,config,controller,request,close(){controller.close();map.close();res.close();}};
}
