/** Authored animation bytes around actual owned body callbacks; no shipped artwork. */
import {styleFixture} from '../game-battle-draw-style-v1/fixture.mjs';
export async function controlFixture(api,flags=0,value=0,{initialPhase=0}={}){
  const f=await styleFixture(api),body=api.createLegacyGameBattleBodies();
  const index=new Uint8Array(24),iv=new DataView(index.buffer),animation=new Uint8Array(40),v=new DataView(animation.buffer);
  for(const [at,resource]of [[0,100001],[12,110350]]){iv.setUint32(at,resource,true);iv.setUint16(at+8,1,true);iv.setUint16(at+10,1,true);}
  v.setUint32(4,32,true);v.setUint32(8,2,true);v.setUint16(12,320,true);v.setUint16(14,flags,true);v.setUint32(16,0x4090c0ff,true);v.setUint32(20,1600,true);v.setUint32(30,1600,true);
  const animations=api.createLegacyGameAnimationCatalog([{index,animation,graphicBase:0}]);
  try{
    body.configurePlayback({animations,geometry:f.library.geometry,seed:12345,initialPhase,alternativeRenderer:false,staticFlip:false,screenOffset:[0,0]});
    body.applyCharacter(0,0,value===4?110350:100001,[0,0],[70,100,10,10]);body.resetQueues(1);
    body.stepPlayback({mainState:10,substate:6,slowEffects:false,localSlot:0});
    return {...f,body,queue(actions=[162,164,165,163]){body.resetQueues(1);body.appendActions(0,1,actions);body.activate(0);},
      tick(context={}){return body.stepPlayback({mainState:10,substate:6,slowEffects:false,localSlot:0,...context});},
      close(){body.close();f.close();}};
  }catch(error){body.close();f.close();throw error;}
}
