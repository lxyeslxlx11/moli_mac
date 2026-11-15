import {legacyGameTextFontMetrics} from '../shared/legacy-game-text.mjs';

/** Host Canvas glyph masks for ordinary font 1 and GMN font 0. */
export function createLegacyGameCanvasTextRasterizer({document:doc,canvas:providedCanvas,decode}){
 if((!providedCanvas&&typeof doc?.createElement!=='function')||typeof decode!=='function')throw Error('LEGACY_TEXT_CANVAS_PORT');
 const canvas=providedCanvas??doc.createElement('canvas'),context=canvas.getContext('2d',{willReadFrequently:true});if(!context)throw Error('LEGACY_TEXT_CANVAS_CONTEXT');
 let closed=false,bytes=0;const cache=new Map(),active=()=>{if(closed)throw Error('LEGACY_TEXT_CANVAS_CLOSED');};
 const configure=size=>{context.font='400 '+size+'px SimSun, "Songti SC", serif';context.textBaseline='top';context.textAlign='left';context.fillStyle='#fff';};
 function raster(request){active();const font=request?.font;if((font!==0&&font!==1)||!Array.isArray(request.bytes)||request.bytes.length>255||request.bytes.some(n=>!Number.isInteger(n)||n<0||n>255))throw Error('LEGACY_TEXT_CANVAS_PROFILE');
  const size=legacyGameTextFontMetrics(font).singleHeight;
  const key=font+':'+request.bytes.map(n=>n.toString(16).padStart(2,'0')).join('');if(cache.has(key)){const value=cache.get(key);cache.delete(key);cache.set(key,value);return{...value,alpha:value.alpha.slice()};}
  let text,raw=Uint8Array.from(request.bytes);try{text=decode(raw);}catch{throw Error('LEGACY_TEXT_CANVAS_DECODE');}finally{raw.fill(0);}active();if(typeof text!=='string'||text.length>1024)throw Error('LEGACY_TEXT_CANVAS_DECODE');
  configure(size);const m=context.measureText(text),left=Math.ceil(Math.max(0,m.actualBoundingBoxLeft??0))+2,top=Math.ceil(Math.max(0,m.actualBoundingBoxAscent??0))+2,
   right=Math.ceil(Math.max(m.width,m.actualBoundingBoxRight??0))+2,bottom=Math.ceil(Math.max(size,m.actualBoundingBoxDescent??size))+2,width=left+right,height=top+bottom;
  if(!Number.isFinite(width)||!Number.isFinite(height)||width<1||height<1||width>8192||height>512||width*height>4194304)throw Error('LEGACY_TEXT_CANVAS_BUDGET');
  canvas.width=width;canvas.height=height;configure(size);context.clearRect(0,0,width,height);context.fillText(text,left,top);const pixels=context.getImageData(0,0,width,height),alpha=new Uint8Array(width*height);for(let i=0;i<alpha.length;i++)alpha[i]=pixels.data[i*4+3];pixels.data.fill(0);active();
  while(cache.size&&(cache.size>=128||bytes+alpha.length>8388608)){const key=cache.keys().next().value,value=cache.get(key);cache.delete(key);bytes-=value.alpha.length;value.alpha.fill(0);}
  const value=Object.freeze({width,height,originX:-left,originY:-top,alpha});cache.set(key,value);bytes+=alpha.length;return{...value,alpha:alpha.slice()};
 }
 return Object.freeze({raster,inspect(){return Object.freeze({state:closed?'closed':'open',entries:cache.size,bytes,font:'host-SimSun-SongtiSC-serif',nativeGlyphPixels:'unverified'});},
  close(){if(closed)return;closed=true;for(const value of cache.values())value.alpha.fill(0);cache.clear();bytes=0;canvas.width=canvas.height=0;}});
}
