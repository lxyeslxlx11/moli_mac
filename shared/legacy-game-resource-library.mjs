/** Own source catalogs/palette and a bounded image cache; borrow explicit range-read ports. */
import { createLegacyGameGraphicCatalog } from './legacy-game-graphics.mjs';
import { createLegacyGameAnimationCatalog } from './legacy-game-animation.mjs';
import { decodeLegacyGameRD,decodeLegacyGameCGP,createLegacyGamePalette32,prepareLegacyGameSprite,
  prepareLegacyGameBlackSprite,prepareLegacyGameRainSprite,composeLegacyGameFrame } from './legacy-game-render.mjs';
import { createLegacyGameCutCatalog } from './legacy-game-scene-frame.mjs';
import { snapshotLegacyGameDrawPlan } from './legacy-game-draw-plan.mjs';
import {legacyGameTextMaskKey,legacyGameTextRasterRequest} from './legacy-game-text.mjs';
import {snapshotLegacyGameTextMask,composeLegacyGameTextFrame} from './legacy-game-text-render.mjs';
import { LEGACY_GAME_RESOURCE_PROFILE,legacyGameResourcePlan,legacyGameCutPath } from './legacy-game-resource-paths.mjs';
import { assetFail,assetFields,assetInteger,assetBytes,assetList,assetKey,assetPath } from './legacy-game-resource-values.mjs';
import { legacyGameMinimapColor, LEGACY_GAME_MINIMAP_PROFILE } from './legacy-game-minimap.mjs';
import {legacyGameNamedPalette,LEGACY_GAME_NAMED_PALETTE_PROFILE} from './legacy-game-named-palette.mjs';
export function createLegacyGameResourceLibrary(value){
 const c=assetFields(value,['plan','files','paletteMode'],['cacheBytes','cacheEntries','rasterText','battlePalette']),plan=legacyGameResourcePlan(c.plan),io=assetFields(c.files,['stat','read']);
 if(c.paletteMode!=='neutral')assetFail('LEGACY_ASSET_PALETTE_CONTEXT');
 if(typeof io.stat!=='function'||typeof io.read!=='function')assetFail('LEGACY_ASSET_FILE_PORT');
 if(Object.hasOwn(c,'rasterText')&&typeof c.rasterText!=='function')assetFail('LEGACY_ASSET_TEXT_PORT');
 if(Object.hasOwn(c,'battlePalette')&&typeof c.battlePalette!=='boolean')assetFail('LEGACY_ASSET_BATTLE_PALETTE');
 const budget=assetInteger(c.cacheBytes??67108864,1,268435456),capacity=assetInteger(c.cacheEntries??1024,1,4096),stats={statCalls:0,readCalls:0,readBytes:0,imagesDecoded:0,cacheHits:0,evicted:0,renders:0};
 let status='uninitialized',initialization=null,graphics=null,animations=null,palette=null,neutralPalette=null,activeJob=null,cacheBytes=0;
 let baseRGB=null,guestRGB=null,minimapRGB=null,minimapSources=null;
 const minimapColors=new Uint8Array(65536),minimapKnown=new Uint8Array(65536),minimapPending=new Map();
 const namedPalettes=new Map();
 const files=new Map(),cache=new Map(),archiveSizes=[];
 const live=()=>{if(status==='closed')assetFail('LEGACY_ASSET_CLOSED');},ready=()=>{live();if(status!=='ready')assetFail('LEGACY_ASSET_NOT_READY');};
 const safeIO=async action=>{let result;try{result=await action();}catch{live();assetFail('LEGACY_ASSET_READ_FAILED');}live();return result;};
 const stat=async path=>{live();const key=assetKey(path);if(files.has(key))return files.get(key);stats.statCalls++;const value=await safeIO(()=>io.stat(path));if(value!==null)assetInteger(value);files.set(key,value);return value;};
 const read=async(path,at,count)=>{live();assetInteger(at);assetInteger(count,0,33554432);stats.readCalls++;const raw=await safeIO(()=>io.read(path,at,count)),copy=assetBytes(raw,count);try{live();if(copy.length!==count)assetFail('LEGACY_ASSET_SHORT_READ');stats.readBytes+=count;return copy;}catch(error){copy.fill(0);throw error;}};
 const whole=async(path,max,required=false)=>{const size=await stat(path);if(size===null){if(required)assetFail('LEGACY_ASSET_REQUIRED_FILE');return null;}assetInteger(size,0,max);return read(path,0,size);};
 const closeEntry=e=>{e.sprite.close();e.image?.close();};
 const cleanup=()=>{for(const e of cache.values())closeEntry(e);cache.clear();cacheBytes=0;for(const p of namedPalettes.values())p.fill(0);namedPalettes.clear();graphics?.close();animations?.close();palette?.close();neutralPalette?.close();graphics=animations=palette=neutralPalette=null;baseRGB?.fill(0);guestRGB?.fill(0);minimapRGB?.fill(0);minimapSources?.fill(0);minimapColors.fill(0);minimapKnown.fill(0);minimapPending.clear();baseRGB=guestRGB=minimapRGB=minimapSources=null;files.clear();archiveSizes.length=0;};
 const evict=need=>{for(const [key,e]of cache){if(cacheBytes+need<=budget&&cache.size<capacity)break;if(e.pins)continue;cache.delete(key);cacheBytes-=e.bytes;closeEntry(e);stats.evicted++;}if(cacheBytes+need>budget||cache.size>=capacity)assetFail('LEGACY_ASSET_PINNED_BUDGET');};
 const touch=(key,e)=>{cache.delete(key);cache.set(key,e);};
 async function initialize(){live();if(status==='ready')return catalogs();if(initialization)return initialization;if(status!=='uninitialized')assetFail('LEGACY_ASSET_NOT_READY');status='loading';
  initialization=(async()=>{const buffers=[],groupInfo=[],groupAnimations=[];try{
   for(const g of plan.groups){archiveSizes.push(await stat(g.graphic));if(g.graphicRequired&&archiveSizes[g.group]===null)assetFail('LEGACY_ASSET_REQUIRED_FILE');const bytes=await whole(g.graphicInfo,33554432,g.graphicRequired)??new Uint8Array();buffers.push(bytes);groupInfo.push(bytes);}
   graphics=createLegacyGameGraphicCatalog(groupInfo,{includeImages:true});live();let graphicBase=0;
   const coordinates=new Map();
   for(const g of plan.groups){const index=await whole(g.animationInfo,246000,g.animationRequired),animation=index?await whole(g.animation,33554432,g.animationRequired):null;buffers.push(index,animation);
    const entry={index:index??new Uint8Array(),animation:animation??new Uint8Array(),graphicBase};graphicBase+=groupInfo[g.group].length/40;
    const key=assetKey(g.coordinateInfo)+'\n'+assetKey(g.coordinate);let ap=coordinates.get(key);
    if(!ap){const apIndex=await whole(g.coordinateInfo,205001),apData=apIndex?await whole(g.coordinate,8388608):null;buffers.push(apIndex,apData);ap=apIndex&&apData?{attachmentIndex:apIndex,attachmentData:apData}:{};coordinates.set(key,ap);}
    groupAnimations.push({...entry,...ap});}
   animations=createLegacyGameAnimationCatalog(groupAnimations);live();
   const size=await stat(plan.palette);if(size===null)assetFail('LEGACY_ASSET_REQUIRED_FILE');if(size<672)assetFail('LEGACY_ASSET_SHORT_READ');const raw=await read(plan.palette,0,672);buffers.push(raw);const colors=decodeLegacyGameCGP(raw);let rgb;
   try{
    rgb=colors.copyCurrentRGB();palette=createLegacyGamePalette32(rgb,'default-rgb');
    if(c.battlePalette)baseRGB=rgb.slice();
    rgb.fill(0);rgb=colors.copyOriginalRGB();minimapRGB=rgb.slice();neutralPalette=createLegacyGamePalette32(rgb,'explicit-rgb');
   }finally{rgb?.fill(0);colors.close();}
   if(c.battlePalette){
    const path=assetPath(plan.directory+'/pal/palet_13.cgp');
    const guestSize=await stat(path);
    if(guestSize!==null&&guestSize>=672){
     const rawGuest=await read(path,0,672);
     buffers.push(rawGuest);
     const guest=decodeLegacyGameCGP(rawGuest);
     try{guestRGB=guest.copyCurrentRGB();}finally{guest.close();}
    }
   }
   live();status='ready';return catalogs();
  }catch(error){cleanup();if(status!=='closed')status='failed';throw error;}finally{for(const b of buffers)b?.fill(0);}})();return initialization;
 }
 function catalogs(){ready();return Object.freeze({graphics,animations,palette});}
 function geometry(value){ready();const q=assetFields(value,['kind','value']);assetInteger(q.value,0,849999);if(q.kind!=='index'&&q.kind!=='resource')assetFail('LEGACY_ASSET_GEOMETRY');const g=q.kind==='index'?graphics.imageAt(q.value):graphics.image(q.value);return Object.freeze({index:g.index,originX:g.originX,originY:g.originY,width:g.width,height:g.height});}
 async function namedPalette(value,check){
  const q=legacyGameNamedPalette(value),known=namedPalettes.get(q.selector);
  if(known){namedPalettes.delete(q.selector);namedPalettes.set(q.selector,known);return known;}
  const g=graphics.image(q.resourceId),size=archiveSizes[g.group];
  if(!g.present||graphics.resourceIdAt(g.index)!==q.resourceId)assetFail('LEGACY_ASSET_NAMED_PALETTE_REQUIRED');
  if(size===null||g.byteOffset>size||g.byteLength>size-g.byteOffset)assetFail('LEGACY_ASSET_IMAGE_RANGE');
  let raw,image,bytes;
  try{raw=await read(plan.groups[g.group].graphic,g.byteOffset,g.byteLength);check();image=decodeLegacyGameRD(raw);bytes=image.copyPalette();
   // 5076a0 copies the declared palette prefix. Keep its available triples;
   // prepareLegacyGameSprite rejects an image that references an absent color.
   if(!bytes.length||bytes.length%3||bytes.length>LEGACY_GAME_NAMED_PALETTE_PROFILE.paletteBytes)assetFail('LEGACY_ASSET_NAMED_PALETTE_LENGTH');check();
   if(namedPalettes.size>=LEGACY_GAME_NAMED_PALETTE_PROFILE.cacheEntries){const oldest=namedPalettes.keys().next().value;namedPalettes.get(oldest).fill(0);namedPalettes.delete(oldest);}
   namedPalettes.set(q.selector,bytes);const result=bytes;bytes=null;stats.namedPalettesDecoded=(stats.namedPalettesDecoded??0)+1;return result;
  }finally{raw?.fill(0);image?.close();bytes?.fill(0);}
 }
 function startRender(value){ready();if(activeJob)assetFail('LEGACY_ASSET_RENDER_BUSY');const plan=snapshotLegacyGameDrawPlan(value);ready();let cancelled=false,state='queued';const pinned=[],textMasks=new Map();
  const projection=plan.palette;
  const colorKey=projection?String.fromCharCode(...projection.rgb,...projection.tint):null;
  const isDynamic=query=>colorKey!==null&&!(query.flags&4);
  const cacheKey=query=>query.index+':'+legacyGameNamedPalette(query.paletteSelector).selector+':'+(query.flags&4)+(isDynamic(query)?':gmn':'');
  let framePalette=null,transforms,blackSprite=null,rainSprite=null;
  const check=()=>{if(cancelled)assetFail('LEGACY_ASSET_CANCELLED');ready();};
  function prepare(image,metadata,query,named){
   let embedded,colors;
   try{
    if(named||metadata.paletteBytes>0){
     embedded=named?named.slice():image.copyPalette();
     colors=createLegacyGamePalette32(embedded,'embedded-bgr',isDynamic(query)?transforms:undefined);
    }
    return prepareLegacyGameSprite(image,colors??(query.flags&4?neutralPalette:framePalette??palette));
   }finally{embedded?.fill(0);colors?.close();}
  }
  const acquire=async query=>{
   check();
   const named=legacyGameNamedPalette(query.paletteSelector).selector?await namedPalette(query.paletteSelector,check):null;check();
   const key=cacheKey(query),dynamic=isDynamic(query);
   let entry=cache.get(key);
   if(entry){
    if(dynamic&&entry.colorKey!==colorKey){
     const sprite=prepare(entry.image,entry.image.inspect(),query,named);
     entry.sprite.close();entry.sprite=sprite;entry.colorKey=colorKey;
     stats.paletteRepaints=(stats.paletteRepaints??0)+1;
    }
    stats.cacheHits++;entry.pins++;pinned.push(entry);touch(key,entry);return entry;
   }
   const g=graphics.imageAt(query.index);if(!g.present)assetFail('LEGACY_ASSET_IMAGE_MISSING');const size=archiveSizes[g.group];if(size===null||g.byteOffset>size||g.byteLength>size-g.byteOffset)assetFail('LEGACY_ASSET_IMAGE_RANGE');
   let raw,image,sprite;
   try{
    raw=await read(c.plan.groups[g.group].graphic,g.byteOffset,g.byteLength);check();
    image=decodeLegacyGameRD(raw);
    const metadata=image.inspect(),pixels=metadata.width*metadata.height;
    const need=pixels*4+(dynamic?pixels+metadata.paletteBytes:0);
    evict(need);check();
    sprite=prepare(image,metadata,query,named);check();
    entry={sprite,bytes:need,pins:1,width:metadata.width,height:metadata.height};
    if(dynamic){entry.image=image;entry.colorKey=colorKey;image=null;}
    cache.set(key,entry);cacheBytes+=need;pinned.push(entry);sprite=null;stats.imagesDecoded++;
    return entry;
   }finally{raw?.fill(0);image?.close();sprite?.close();}
  };
  const done=Promise.resolve().then(async()=>{state='loading';try{
    check();
    if(projection){
     const rgb=Uint8Array.from(projection.rgb);
     try{framePalette=createLegacyGamePalette32(rgb,'default-rgb');}finally{rgb.fill(0);}
     if(projection.tint.some(n=>n!==128)){
      transforms=Object.fromEntries(['red','green','blue'].map((key,i)=>[key,
       Uint8Array.from({length:256},(_,n)=>Math.min(255,(n*projection.tint[i])>>>7))]));
     }
    }
    const unique=new Map();
    for(const command of plan.commands){
     if(!command.image)continue;
     const q=command.image,key=cacheKey(q);
     if(!unique.has(key))unique.set(key,await acquire(q));
     check();
    }
    const commands=plan.commands.map(command=>{
     if(command.waterStrip)return command;
     if(command.rainDrop){
      rainSprite??=prepareLegacyGameRainSprite((framePalette??palette).copyColors()[0x8f]);
      return {sprite:rainSprite,x:command.x,y:command.y,priority:command.priority,coordinateMode:'int32'};
     }
     if(command.blackRectangle){
      blackSprite??=prepareLegacyGameBlackSprite();
      return {sprite:blackSprite,x:command.x,y:command.y,priority:command.priority,
       scale:command.blackRectangle,coordinateMode:'int32'};
     }
     const {image,expectedDimensions,...rest}=command,e=unique.get(cacheKey(image));
     if(expectedDimensions&&(e.width!==expectedDimensions[0]||e.height!==expectedDimensions[1]))assetFail('LEGACY_ASSET_SPRITE_DIMENSIONS');
     return {...rest,sprite:e.sprite,...(image.color!==0xffffffff?{color:image.color}:{}),...(image.flags&8?{blend:'additive'}:{})};
    });
    check();let maskBytes=0;
    for(const run of plan.text?.runs??[]){if(!run.bytes.length)continue;const key=legacyGameTextMaskKey(run);if(textMasks.has(key))continue;if(typeof c.rasterText!=='function')assetFail('LEGACY_ASSET_TEXT_PORT_REQUIRED');let raw;
     try{raw=await c.rasterText(legacyGameTextRasterRequest(run));}catch{check();assetFail('LEGACY_ASSET_TEXT_FAILED');}check();const mask=snapshotLegacyGameTextMask(raw);maskBytes+=mask.alpha.length;if(maskBytes>16777216){mask.alpha.fill(0);assetFail('LEGACY_ASSET_TEXT_BUDGET');}textMasks.set(key,mask);stats.textMasks=(stats.textMasks??0)+1;}
    const output=plan.text?composeLegacyGameTextFrame(plan.width,plan.height,commands,plan.text,request=>textMasks.get(legacyGameTextMaskKey(request))):composeLegacyGameFrame(plan.width,plan.height,commands);check();state='complete';stats.renders++;return output;
   }catch(error){state=cancelled?'cancelled':status==='closed'?'closed':'failed';if(cancelled)assetFail('LEGACY_ASSET_CANCELLED');if(status==='closed')assetFail('LEGACY_ASSET_CLOSED');throw error;}finally{
    framePalette?.close();blackSprite?.close();rainSprite?.close();
    if(transforms)for(const lut of Object.values(transforms))lut.fill(0);
    for(const e of pinned)e.pins--;for(const mask of textMasks.values())mask.alpha.fill(0);textMasks.clear();activeJob=null;
   }});
  const job=Object.freeze({done,cancel(){if(state==='complete'||state==='failed'||state==='closed'||state==='cancelled')return;cancelled=true;state='cancelling';},inspect(){return Object.freeze({state,commands:plan.commands.length});}});activeJob=job;return job;
 }
 async function minimapColorTable(ids){
  ready();ids=assetList(ids,65536);for(const id of ids)assetInteger(id,0,65535);
  if(!minimapSources){
   minimapSources=new Int32Array(65536).fill(-1);
   for(let index=0;index<850000;index++){
    const resource=graphics.resourceIdAt(index),g=graphics.imageAt(index);if(!g.present||resource===0)continue;
    if(g.group<=2){const tile=resource>=1000&&resource<=19999?resource:resource>=220000&&resource<=265535?resource-200000:-1;if(tile>=0)minimapSources[tile]=index;}
    else if(resource<65536)minimapSources[resource]=-1;
   }
  }
  for(const id of new Set(ids))if(!minimapKnown[id]){
   let task=minimapPending.get(id);
   if(!task){task=(async()=>{const index=minimapSources[id];let color=0,raw,image,pixels;
    try{
     if(index>=0){const g=graphics.imageAt(index),size=archiveSizes[g.group];if(size===null||g.byteOffset>size||g.byteLength>size-g.byteOffset)assetFail('LEGACY_ASSET_IMAGE_RANGE');raw=await read(plan.groups[g.group].graphic,g.byteOffset,g.byteLength);ready();image=decodeLegacyGameRD(raw);pixels=image.copyPixels();color=legacyGameMinimapColor(pixels,minimapRGB);}
     ready();minimapColors[id]=color;minimapKnown[id]=1;
    }finally{raw?.fill(0);pixels?.fill(0);image?.close();}
   })();minimapPending.set(id,task);task.then(()=>minimapPending.delete(id),()=>minimapPending.delete(id));}
   await task;ready();
  }
  return minimapColors.slice();
 }
 return Object.freeze({initialize,catalogs,geometry,startRender,minimapColorTable,
  async readMinimapAUT(selector){ready();assetInteger(selector,-2147483648,2147483647);const path=assetPath('bin/PUK2/cutdat/'+selector+'.aut'),size=await stat(path);if(size===null)assetFail('LEGACY_ASSET_REQUIRED_FILE');let raw;try{raw=await read(path,0,Math.min(size,LEGACY_GAME_MINIMAP_PROFILE.AUTBytes));ready();return raw;}catch(error){raw?.fill(0);throw error;}},
  copyBattlePaletteSources(){ready();return baseRGB?Object.freeze({baseRGB:baseRGB.slice(),guestRGB:guestRGB?.slice()??null}):null;},
  async readCut(value){ready();const path=legacyGameCutPath(value);if(path===null)return null;let raw;try{raw=await whole(path,900012,true);ready();return createLegacyGameCutCatalog(raw);}finally{raw?.fill(0);}},
  clearCache(){ready();if(activeJob)assetFail('LEGACY_ASSET_RENDER_BUSY');for(const e of cache.values())closeEntry(e);cache.clear();cacheBytes=0;},
  inspect(){return Object.freeze({profile:LEGACY_GAME_RESOURCE_PROFILE.id,state:status,cacheEntries:cache.size,cacheBytes,cacheBudget:budget,cacheCapacity:capacity,rendering:activeJob!==null,...(namedPalettes.size?{namedPaletteEntries:namedPalettes.size}:{}),stats:Object.freeze({...stats}),currentVersionCompatibility:'unverified'});},
  close(){if(status==='closed')return;status='closed';activeJob?.cancel();cleanup();},
 });
}
