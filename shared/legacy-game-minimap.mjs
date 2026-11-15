/** Fixed37c4 minimap colour/grid and32-bit diamond raster; no platform or I/O globals. */
import {assetFail,assetFields,assetInteger,assetBytes,assetList} from './legacy-game-resource-values.mjs';
import {legacyGameGraphicMetadata} from './legacy-game-graphics.mjs';
export const LEGACY_GAME_MINIMAP_PROFILE=Object.freeze({id:'legacy-se6000-37c4-minimap-v1',sourceSha256:'37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd',sizes:Object.freeze([107,54,27]),AUTBytes:477603});
const fail=code=>assetFail('LEGACY_MINIMAP_'+code);
const pair=value=>{const a=assetList(value,2);if(a.length!==2)fail('POINT');return a.map(n=>assetInteger(n,-2147483648,2147483647));};
function words(value,count,Type){
 try{if(!(value instanceof Type)||value.length!==count)fail('PLANE');Reflect.apply(Object.getOwnPropertyDescriptor(ArrayBuffer.prototype,'byteLength').get,value.buffer,[]);return new Type(value);}
 catch(error){if(error?.code)throw error;fail('PLANE');}
}
export function legacyGameMinimapWindow(mapWidth,mapHeight,center,zoom=1){
 assetInteger(mapWidth,1,32767);assetInteger(mapHeight,1,32767);assetInteger(zoom,0,2);
 const point=pair(center).map(n=>assetInteger(n,-32768,32767)),size=LEGACY_GAME_MINIMAP_PROFILE.sizes[zoom];
 return Object.freeze({mapWidth,mapHeight,center:Object.freeze(point),zoom,width:size,height:size,origin:Object.freeze(point.map(n=>n-Math.trunc(size/2)))});
}
/** Native average excludes index0; nearest search considers0 and16..239 with strict ties. */
export function legacyGameMinimapColor(pixelsValue,paletteValue){
 const pixels=assetBytes(pixelsValue,4194304),palette=assetBytes(paletteValue,768);
 try{
  if(palette.length!==768)fail('PALETTE');let red=0,green=0,blue=0,count=0;
  for(const index of pixels)if(index){const at=index*3;red+=palette[at];green+=palette[at+1];blue+=palette[at+2];count++;}
  if(!count)return 0;red=Math.floor(red/count);green=Math.floor(green/count);blue=Math.floor(blue/count);
  const distance=i=>(palette[i*3]-red)**2+(palette[i*3+1]-green)**2+(palette[i*3+2]-blue)**2;
  let chosen=0,best=distance(0);for(let i=16;i<240;i++){const next=distance(i);if(next<best){chosen=i;best=next;}}return chosen;
 }finally{pixels.fill(0);palette.fill(0);}
}
export function createLegacyGameMinimapGrid(value){
 const r=assetFields(value,['mode','mapWidth','mapHeight','origin','width','height','planes'],['zoom','center','identity','selector','revision','key','colors','graphics','autRGB']);
 assetInteger(r.mode,-2147483648,2147483647);assetInteger(r.mapWidth,1,32767);assetInteger(r.mapHeight,1,32767);
 if(r.width!==r.height||!LEGACY_GAME_MINIMAP_PROFILE.sizes.includes(r.width))fail('SIZE');
 const origin=pair(r.origin),count=r.width*r.height,planes=[];
 let colors,aut;const rgb=r.mode===1,grid=rgb?new Uint32Array(count):new Uint8Array(count);
 try{
  const input=assetList(r.planes,3);if(input.length!==3)fail('PLANE');for(const p of input)planes.push(words(p,count,Uint16Array));
  if(rgb){aut=assetBytes(r.autRGB,LEGACY_GAME_MINIMAP_PROFILE.AUTBytes);if(aut.length%3)fail('AUT_LENGTH');}
  else{colors=assetBytes(r.colors,65536);if(colors.length!==65536)fail('COLORS');legacyGameGraphicMetadata(r.graphics,0);}
  for(let y=0;y<r.height;y++)for(let x=0;x<r.width;x++){
   const at=y*r.width+x;if(!(planes[2][at]&0x4000))continue;
   const px=origin[0]+x,py=origin[1]+y;
   if(px<0||py<0||px>=r.mapWidth||py>=r.mapHeight)fail('WINDOW');
   if(rgb){const offset=(py*r.mapWidth+px)*3;if(offset+3>aut.length)fail('AUT_TRUNCATED');grid[at]=(aut[offset]<<16)|(aut[offset+1]<<8)|aut[offset+2];}
   else grid[at]=colors[planes[0][at]];
  }
  if(!rgb)for(let y=0;y<r.height;y++)for(let x=0;x<r.width;x++){
   const at=y*r.width+x,color=colors[planes[1][at]];if(!(planes[2][at]&0x4000)||!color)continue;
   const m=legacyGameGraphicMetadata(r.graphics,planes[1][at]);
   if(m.collisionClass===0){const end=Math.min(r.width,x+m.tileWidth);for(let dy=0;dy<m.tileHeight&&dy<=y;dy++)grid.fill(color,(y-dy)*r.width+x,(y-dy)*r.width+end);}
   else grid[at]=color;
  }
  return Object.freeze({width:r.width,height:r.height,kind:rgb?'rgb':'indexed',pixels:grid});
 }catch(error){grid.fill(0);throw error;}finally{for(const p of planes)p.fill(0);colors?.fill(0);aut?.fill(0);}
}
export function renderLegacyGameMinimap(value,paletteValue,marker=1){
 const r=assetFields(value,['width','height','kind','pixels']);
 if(r.width!==r.height||!LEGACY_GAME_MINIMAP_PROFILE.sizes.includes(r.width)||!['indexed','rgb'].includes(r.kind))fail('GRID');
 assetInteger(marker,0,0xffffff);const n=r.width,pixels=words(r.pixels,n*n,r.kind==='rgb'?Uint32Array:Uint8Array);
 const palette=r.kind==='indexed'?words(paletteValue,256,Uint32Array):null,width=n*4+2,height=n*2+2,rgba=new Uint8Array(width*height*4);
 const put=(x,y,color)=>{const at=(y*width+x)*4;rgba[at]=color>>>16;rgba[at+1]=color>>>8;rgba[at+2]=color;rgba[at+3]=255;};
 const stencil=(x,y,color)=>{put(x-1,y,color);put(x,y,color);put(x+1,y,color);put(x,y-1,color);};
 try{
  for(let y=0;y<n;y++)for(let x=0;x<n;x++){let color=r.kind==='rgb'?pixels[y*n+x]:palette[pixels[y*n+x]];color&=0xffffff;if(!color)color=1;stencil(1+2*(x+y),n+1-x+y,color);}
  stencil(2*n+1,n+1,marker);return Object.freeze({width,height,rgba});
 }catch(error){rgba.fill(0);throw error;}finally{pixels.fill(0);palette?.fill(0);}
}
export function overlayLegacyGameMinimap(target,width,height,overlay,x,y){
 assetInteger(width,1,4194304);assetInteger(height,1,Math.floor(4194304/width));assetInteger(x,-2147483648,2147483647);assetInteger(y,-2147483648,2147483647);
 if(!(target instanceof Uint8Array)||target.length!==width*height*4)fail('FRAME');
 const r=assetFields(overlay,['width','height','rgba']);assetInteger(r.width,1,430);assetInteger(r.height,1,216);
 const rgba=assetBytes(r.rgba,r.width*r.height*4);
 try{if(rgba.length!==r.width*r.height*4)fail('FRAME');for(let i=3;i<rgba.length;i+=4)if(rgba[i]!==0&&rgba[i]!==255)fail('ALPHA');
  for(let sy=Math.max(0,-y);sy<r.height&&sy+y<height;sy++)for(let sx=Math.max(0,-x);sx<r.width&&sx+x<width;sx++){
   const from=(sy*r.width+sx)*4;if(!rgba[from+3])continue;const to=((sy+y)*width+sx+x)*4;target.set(rgba.subarray(from,from+4),to);
  }
 }finally{rgba.fill(0);}
}
export function createLegacyGameMinimapBlink(){
 let closed=false;const phase=new Uint8Array(2),last=new Uint32Array(2);
 return Object.freeze({next(mode,tick){if(closed)fail('CLOSED');assetInteger(mode,-2147483648,2147483647);assetInteger(tick);const i=mode===1?1:0,color=phase[i]?0xffffff:1;if(((last[i]+1000)>>>0)<=tick){last[i]=tick;phase[i]^=1;}return color;},
  close(){closed=true;phase.fill(0);last.fill(0);}});
}
