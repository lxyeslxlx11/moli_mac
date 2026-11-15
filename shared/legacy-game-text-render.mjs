/** RGBA reconstruction of source lane0 text with borrowed glyph masks; native font pixel identity is unverified. */
import {composeLegacyGameFrame,legacyGamePreparedSpriteDimensions} from './legacy-game-render.mjs';
import {assetFields,assetBytes,assetInteger,assetList} from './legacy-game-resource-values.mjs';
import {LEGACY_GAME_TEXT_COLORS,LegacyGameTextError,snapshotLegacyGameTextBatch,legacyGameTextMaskKey,legacyGameTextRasterRequest} from './legacy-game-text.mjs';
import {snapshotLegacyGameWater} from './legacy-game-water.mjs';
const fail=code=>{throw new LegacyGameTextError(code);};
export function snapshotLegacyGameTextMask(value){const r=assetFields(value,['width','height','originX','originY','alpha']);assetInteger(r.width,0,4194304);assetInteger(r.height,0,4194304);assetInteger(r.originX,-32768,32767);assetInteger(r.originY,-32768,32767);if(r.width*r.height>4194304)fail('LEGACY_TEXT_MASK_BUDGET');const alpha=assetBytes(r.alpha,4194304);if(alpha.length!==r.width*r.height){alpha.fill(0);fail('LEGACY_TEXT_MASK_LENGTH');}return Object.freeze({...r,alpha});}
function blend(out,offset,rgb,a){if(a===0)return;const da=out[offset+3],inv=255-a,den=a*255+da*inv;
 for(let c=0;c<3;c++)out[offset+c]=Math.floor((rgb[c]*a*255+out[offset+c]*da*inv+den/2)/den);out[offset+3]=Math.floor((den+127)/255);}
function imageCommands(value){return assetList(value,4095).map(row=>{
 if(row&&Object.hasOwn(row,'waterStrip')){const r=assetFields(row,['waterStrip','priority']);r.waterStrip=snapshotLegacyGameWater(r.waterStrip);assetInteger(r.priority,2,2);return Object.freeze(r);}
 const c=assetFields(row,['sprite','x','y','priority'],['originX','originY','flip','sourceRectangle','coordinateMode','scale','opacity','blend','color']);legacyGamePreparedSpriteDimensions(c.sprite);if(Object.hasOwn(c,'coordinateMode')&&c.coordinateMode!=='int32')fail('LEGACY_TEXT_COORDINATE_MODE');
 if(Object.hasOwn(c,'blend')&&!['source-over','additive'].includes(c.blend))fail('LEGACY_TEXT_IMAGE_BLEND');
 for(const k of ['x','y'])assetInteger(c[k],-2147483648,2147483647);assetInteger(c.priority,0,255);assetInteger(c.flip??0,0,3);
 for(const k of ['originX','originY'])if(Object.hasOwn(c,k))assetInteger(c[k],-32768,32767);
 if(Object.hasOwn(c,'opacity'))assetInteger(c.opacity,0,255);
 if(Object.hasOwn(c,'color'))assetInteger(c.color,0,0xffffffff);
 if(Object.hasOwn(c,'scale')){const scale=assetList(c.scale,2);if(scale.length!==2||scale.some(n=>typeof n!=='number'||!Number.isFinite(n)||n<0||!Number.isFinite(Math.fround(n))))fail('LEGACY_TEXT_IMAGE_SCALE');c.scale=Object.freeze(scale.map(Math.fround));}
 if(Object.hasOwn(c,'sourceRectangle')){const rect=assetList(c.sourceRectangle,4);if(rect.length!==4)fail('LEGACY_TEXT_IMAGE_RECTANGLE');c.sourceRectangle=Object.freeze(rect.map(n=>assetInteger(n,-32768,32767)));}return Object.freeze(c);});}
export function composeLegacyGameTextFrame(width,height,commands,value,resolveMask){const text=snapshotLegacyGameTextBatch(value);if(!text.runs.length)return composeLegacyGameFrame(width,height,commands);assetInteger(width,1,4194304);assetInteger(height,1,Math.floor(4194304/width));commands=imageCommands(commands);if(typeof resolveMask!=='function'&&text.runs.some(r=>r.bytes.length))fail('LEGACY_TEXT_RASTER_PORT_REQUIRED');
 const priority=text.priority,low=commands.filter(c=>c.priority<=priority),high=commands.filter(c=>c.priority>priority),before=composeLegacyGameFrame(width,height,low),out=before.rgba,masks=new Map();let operations=before.rasterOperations,maskBytes=0;
 try{for(const run of text.runs){if(!run.bytes.length)continue;const key=legacyGameTextMaskKey(run);if(!masks.has(key)){const mask=snapshotLegacyGameTextMask(resolveMask(legacyGameTextRasterRequest(run)));maskBytes+=mask.alpha.length;if(maskBytes>16777216){mask.alpha.fill(0);fail('LEGACY_TEXT_MASK_BUDGET');}masks.set(key,mask);}const mask=masks.get(key);
   const paint=(shift,color)=>{const left=run.x+mask.originX+shift,top=run.y+mask.originY+shift,x0=Math.max(0,-left),y0=Math.max(0,-top),x1=Math.min(mask.width,width-left),y1=Math.min(mask.height,height-top);if(x1<=x0||y1<=y0)return;
    operations+=(x1-x0)*(y1-y0);if(operations>67108864)fail('LEGACY_TEXT_RASTER_BUDGET');for(let y=y0;y<y1;y++)for(let x=x0;x<x1;x++)blend(out,((top+y)*width+left+x)*4,color,mask.alpha[y*mask.width+x]);};
   if(!(run.color&128))paint(1,[0,0,0]);paint(0,LEGACY_GAME_TEXT_COLORS[run.color&127]);}
  if(high.length){const above=composeLegacyGameFrame(width,height,high,out);try{operations+=above.rasterOperations;if(operations>67108864)fail('LEGACY_TEXT_RASTER_BUDGET');out.set(above.rgba);}finally{above.rgba.fill(0);}}
  const order=commands.map((_,i)=>i).sort((a,b)=>commands[a].priority-commands[b].priority||b-a),drawOperations=[...order.filter(i=>commands[i].priority<=priority),priority===216?'text-lane2':'text-lane0',...order.filter(i=>commands[i].priority>priority)];return Object.freeze({...before,rgba:out,drawOrder:Object.freeze(order),rasterOperations:operations,drawOperations:Object.freeze(drawOperations),textRuns:text.runs.length,nativeGlyphPixels:'host-port-unverified'});
 }catch(error){out.fill(0);throw error;}finally{for(const mask of masks.values())mask.alpha.fill(0);}}
