/** Optional shared minimap presentation owner; resource work never repeats game requests. */
import {createLegacyGameMinimapGrid,renderLegacyGameMinimap,overlayLegacyGameMinimap,createLegacyGameMinimapBlink} from './legacy-game-minimap.mjs';
import {assetFail,assetInteger} from './legacy-game-resource-values.mjs';
export function createLegacyGameMinimapOwner({client}){
 if(typeof client?.copyMinimapSource!=='function'||typeof client.library!=='function')assetFail('LEGACY_MINIMAP_CLIENT');
 let closed=false,visible=false,zoom=1,epoch=0,state='hidden',errorCode=null,ready=null,queued=null,active=null,task=null;
 let aut=null,autSelector=null,failedKey=null,presentations=0;
 const blink=createLegacyGameMinimapBlink();
 const clearSource=source=>{for(const p of source?.planes??[])p.fill(0);};
 const clearReady=()=>{ready?.grid.pixels.fill(0);ready?.palette?.fill(0);ready=null;};
 const clearAUT=()=>{aut?.fill(0);aut=null;autSelector=null;};
 const inspect=()=>Object.freeze({visible,zoom,state,errorCode,presentations,mode:ready?.mode??null,width:ready?.grid.width??null});
 const usable=serial=>!closed&&visible&&serial===epoch;
 function launch(){
  if(task||!queued||!visible||closed)return;
  const source=queued;queued=null;active=source;const serial=epoch;
  let colors,raw,grid,palette;
  state='loading';errorCode=null;
  task=Promise.resolve().then(async()=>{
   if(!usable(serial))return;
   const library=client.library();
   if(source.mode===1){
    if(autSelector!==source.selector){clearAUT();autSelector=source.selector;}
    if(!aut){raw=await library.readMinimapAUT(source.selector);if(!usable(serial))return;aut=raw;raw=null;}
    grid=createLegacyGameMinimapGrid({...source,autRGB:aut});
   }else{
    const ids=new Set();for(let i=0;i<source.planes[2].length;i++)if(source.planes[2][i]&0x4000){ids.add(source.planes[0][i]);ids.add(source.planes[1][i]);}
    colors=await library.minimapColorTable([...ids]);if(!usable(serial))return;
    grid=createLegacyGameMinimapGrid({...source,colors,graphics:library.catalogs().graphics});
    palette=library.catalogs().palette.copyColors();
   }
   if(!usable(serial))return;
   clearReady();ready={key:source.key,mode:source.mode,grid,palette};grid=palette=null;state='ready';failedKey=null;
  }).catch(error=>{
   if(usable(serial)){state='unavailable';errorCode=typeof error?.code==='string'?error.code:'LEGACY_MINIMAP_RESOURCE';failedKey=source.key;}
  }).finally(()=>{
   clearSource(source);colors?.fill(0);raw?.fill(0);grid?.pixels.fill(0);palette?.fill(0);active=null;task=null;
   if(queued&&visible&&!closed)launch();
  });
 }
 function invalidate(){epoch++;clearReady();clearSource(queued);queued=null;clearSource(active);failedKey=null;errorCode=null;}
 return Object.freeze({inspect,
  toggle(){if(closed)assetFail('LEGACY_MINIMAP_CLOSED');invalidate();visible=!visible;state=visible?'loading':'hidden';return inspect();},
  cycleRange(){if(closed)assetFail('LEGACY_MINIMAP_CLOSED');invalidate();zoom=(zoom+1)%3;state=visible?'loading':'hidden';return inspect();},
  decorate(frame,tick){
   if(closed||!visible)return;assetInteger(tick);
   let source;
   try{source=client.copyMinimapSource(zoom);}catch(error){state='unavailable';errorCode=error?.code??'LEGACY_MINIMAP_SOURCE';return;}
   if(!source)return;
   if(ready?.key===source.key){
    clearSource(source);const pixels=renderLegacyGameMinimap(ready.grid,ready.palette,blink.next(ready.mode,tick));
    try{overlayLegacyGameMinimap(frame.rgba,frame.width,frame.height,pixels,Math.max(0,frame.width-pixels.width-12),12);presentations++;}
    finally{pixels.rgba.fill(0);}return;
   }
   clearReady();
   if(failedKey===source.key){clearSource(source);state='unavailable';return;}
   if(active?.key===source.key||queued?.key===source.key){clearSource(source);return;}
   clearSource(queued);queued=source;launch();
  },
  close(){if(closed)return;closed=true;visible=false;invalidate();clearAUT();blink.close();state='closed';},
 });
}
