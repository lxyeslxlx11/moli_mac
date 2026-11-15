/** Source-bound legacy map-cache projection. Plane roles and native scene state remain unassigned. */
import { MAP01_LIMITS } from './map01.mjs';

export const LEGACY_GAME_MAP_PROFILE=Object.freeze({
  id:'legacy-se6000-37c4-map-cache-v1',
  sourceSha256:'37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd',
  rectangleCells:2601,checksumBytes:1458,patchBytes:32760,planeFieldBytes:18191,cellTokenBytes:99,
  planes:3,scope:'map-cache-projection',nativeSceneSynchronization:'unmodeled',currentVersionCompatibility:'unverified',
});
export class LegacyGameMapError extends Error{
  constructor(code){super('Legacy map data does not match the supported bounded profile.');this.name='LegacyGameMapError';this.code=code;}
}
const fail=code=>{throw new LegacyGameMapError(code);};
const typed=Object.getPrototypeOf(Uint8Array.prototype);
const lengthOf=Object.getOwnPropertyDescriptor(typed,'length').get;
const bufferOf=Object.getOwnPropertyDescriptor(typed,'buffer').get;
const offsetOf=Object.getOwnPropertyDescriptor(typed,'byteOffset').get;
const bufferLength=Object.getOwnPropertyDescriptor(ArrayBuffer.prototype,'byteLength').get;
function input(value,maximum){
  try{
    let buffer,length,offset=0;
    if(value instanceof ArrayBuffer){buffer=value;length=Reflect.apply(bufferLength,value,[]);}
    else{
      if(!(value instanceof Uint8Array))fail('LEGACY_MAP_INPUT');
      buffer=Reflect.apply(bufferOf,value,[]);Reflect.apply(bufferLength,buffer,[]);
      length=Reflect.apply(lengthOf,value,[]);offset=Reflect.apply(offsetOf,value,[]);
    }
    if(length>maximum)fail('LEGACY_MAP_BUDGET');
    return new Uint8Array(new Uint8Array(buffer,offset,length));
  }catch(error){if(error instanceof LegacyGameMapError)throw error;fail('LEGACY_MAP_INPUT');}
}
function values(value,length){
  if(!Array.isArray(value))fail('LEGACY_MAP_ARGUMENTS');let descriptors;
  try{descriptors=Object.getOwnPropertyDescriptors(value);}catch{fail('LEGACY_MAP_ARGUMENTS');}
  if(descriptors.length?.value!==length||Reflect.ownKeys(descriptors).length!==length+1)fail('LEGACY_MAP_ARGUMENTS');
  return Array.from({length},(_,i)=>{const row=descriptors[i];if(!row||!Object.hasOwn(row,'value'))fail('LEGACY_MAP_ARGUMENTS');return row.value;});
}
function int32(value){if(!Number.isInteger(value)||value < -2147483648||value>2147483647)fail('LEGACY_MAP_INTEGER');return value;}
function rectangle(value){
  const coordinates=values(value,4).map(int32),[x1,y1,x2,y2]=coordinates,width=x2-x1,height=y2-y1;
  if(width<=0||height<=0)fail('LEGACY_MAP_RECTANGLE');
  if(width>2601||height>Math.floor(2601/width))fail('LEGACY_MAP_RECTANGLE_BUDGET');
  return {coordinates:Object.freeze(coordinates),x1,y1,x2,y2,width,height,cells:width*height};
}
function map(value){
  const bytes=input(value,MAP01_LIMITS.bytes);
  try{
    if(bytes.length<20)fail('LEGACY_MAP_TRUNCATED');
    if(bytes[0]!==77||bytes[1]!==65||bytes[2]!==80||bytes[3]!==1)fail('LEGACY_MAP_VERSION');
    const view=new DataView(bytes.buffer),width=view.getUint32(12,true),height=view.getUint32(16,true);
    if(width===0||height===0)fail('LEGACY_MAP_DIMENSIONS');
    if(width>MAP01_LIMITS.cells||height>Math.floor(MAP01_LIMITS.cells/width))fail('LEGACY_MAP_CELL_BUDGET');
    const cells=width*height;if(bytes.length!==20+6*cells)fail('LEGACY_MAP_LENGTH');
    return {bytes,view,width,height,cells};
  }catch(error){bytes.fill(0);throw error;}
}
function read(cache,rect){
  const planes=Array.from({length:3},()=>new Uint16Array(rect.cells));
  const left=Math.max(0,rect.x1),top=Math.max(0,rect.y1),right=Math.min(cache.width,rect.x2),bottom=Math.min(cache.height,rect.y2);
  for(let p=0;p<3;p++)for(let y=top;y<bottom;y++)for(let x=left;x<right;x++)
    planes[p][(y-rect.y1)*rect.width+x-rect.x1]=cache.view.getUint16(20+2*(p*cache.cells+y*cache.width+x),true);
  return Object.freeze({rectangle:rect.coordinates,width:rect.width,height:rect.height,planes:Object.freeze(planes)});
}
export function readLegacyGameMapRectangle(value,coordinates){
  const rect=rectangle(coordinates),cache=map(value);try{return read(cache,rect);}finally{cache.bytes.fill(0);}
}
function checksum(planes,mode){
  int32(mode);const mask=mode===1?0x1ff:0xfff;
  return Object.freeze(planes.map((plane,p)=>{
    let c=0;
    for(let index=0;index<1458;index++){
      let word=plane[index>>>1]??0;if(p===2)word&=mask;
      const byte=(word>>>((index&1)*8))&255;let reverse=0,remaining=byte;
      for(let bit=0;bit<8;bit++){reverse=(reverse<<1)|(remaining&1);remaining>>>=1;}
      for(let bit=0;bit<8;bit++)c=((c<<1)^((c&0x8000)?0x1021:0))&0xffff;
      c^=reverse;
    }
    return c;
  }));
}
export function checksumLegacyGameMapRectangle(value,coordinates,mode){
  const rect=rectangle(coordinates),cache=map(value);
  try{return checksum(read(cache,rect).planes,mode);}finally{cache.bytes.fill(0);}
}
function fields(raw,separator,maximum,maximumFields){
  const nul=raw.indexOf(0),end=nul<0?raw.length:nul,output=[];let start=0;
  for(let at=0;at<end;at++){
    if(raw[at]>=128){if(at+1>=end)fail('LEGACY_MAP_TEXT_PAIR');at++;continue;}
    if(raw[at]!==separator)continue;
    if(at-start>maximum)fail('LEGACY_MAP_TOKEN_BUDGET');output.push(raw.subarray(start,at));start=at+1;
    if(output.length===maximumFields)return {fields:output,trailingBytes:end-start};
  }
  if(end-start>maximum)fail('LEGACY_MAP_TOKEN_BUDGET');output.push(raw.subarray(start,end));
  if(output.length>maximumFields)fail('LEGACY_MAP_PATCH_CELLS');
  return {fields:output,trailingBytes:0};
}
function number(raw){
  let n=0,sign=1;
  for(const byte of raw){
    n=Math.imul(n,62);
    if(byte>=48&&byte<=57)n=(n+byte-48)|0;
    else if(byte>=97&&byte<=122)n=(n+byte-87)|0;
    else if(byte>=65&&byte<=90)n=(n+byte-29)|0;
    else if(byte===45)sign=-1;
    else return 0;
  }
  return Math.imul(n,sign)&0xffff;
}
function patch(value,rect){
  const raw=input(value,32760);
  try{
    const outer=fields(raw,124,18191,3);if(outer.fields.length!==3)fail('LEGACY_MAP_PATCH_PLANES');
    const planes=outer.fields.map(plane=>{
      const inner=fields(plane,44,99,2602);
      if(inner.fields.length!==rect.cells)fail('LEGACY_MAP_PATCH_CELLS');
      return Uint16Array.from(inner.fields,number);
    });
    return Object.freeze({rectangle:rect.coordinates,width:rect.width,height:rect.height,planes:Object.freeze(planes),ignoredOuterBytes:outer.trailingBytes});
  }finally{raw.fill(0);}
}
export function decodeLegacyGameMapPatch(value,coordinates){return patch(value,rectangle(coordinates));}
function write(cache,rect,decoded){
  const left=Math.max(0,rect.x1),top=Math.max(0,rect.y1),right=Math.min(cache.width,rect.x2),bottom=Math.min(cache.height,rect.y2);
  for(let p=0;p<3;p++)for(let y=top;y<bottom;y++)for(let x=left;x<right;x++){
    let word=decoded.planes[p][(y-rect.y1)*rect.width+x-rect.x1];if(p===2)word|=0xc000;
    cache.view.setUint16(20+2*(p*cache.cells+y*cache.width+x),word,true);
  }
  return Math.max(0,right-left)*Math.max(0,bottom-top);
}
export function applyLegacyGameMapPatch(value,coordinates,byteData){
  const rect=rectangle(coordinates),decoded=patch(byteData,rect),cache=map(value);
  try{return Object.freeze({bytes:cache.bytes,rectangle:rect.coordinates,writtenCells:write(cache,rect,decoded),ignoredOuterBytes:decoded.ignoredOuterBytes});}
  catch(error){cache.bytes.fill(0);throw error;}
}

export function createLegacyGameMapState(identityA,identityB,value,mode){
  int32(identityA);int32(identityB);int32(mode);let cache=map(value),updates=0,closed=false;
  const active=()=>{if(closed)fail('LEGACY_MAP_CLOSED');};
  const unavailable=(a,b)=>Object.freeze({kind:'map-cache-unavailable',messageIdentity:Object.freeze([a,b]),installedIdentity:Object.freeze([identityA,identityB])});
  return Object.freeze({
    applyNotice(argumentsValue){
      active();const args=values(argumentsValue,9).map(int32);active();const [a,b,...tail]=args;
      if(b!==identityB)return unavailable(a,b);
      const rect=rectangle(tail.slice(0,4)),actual=checksum(read(cache,rect).planes,mode),expected=tail.slice(4);
      const matches=expected.every((value,index)=>value===actual[index]);
      return Object.freeze({kind:'map-cache-notice',rectangle:rect.coordinates,cacheIdentity:Object.freeze([identityA,identityB]),
        messageIdentity:Object.freeze([a,b]),checksums:actual,expected:Object.freeze(expected),matches,
        request:matches?null:Object.freeze({operationId:'send-004f6610',arguments:Object.freeze(args.slice(0,6))})});
    },
    applyPatch(argumentsValue){
      active();const args=values(argumentsValue,7);args.slice(0,6).forEach(int32);active();
      if(args[0]!==identityA||args[1]!==identityB)return unavailable(args[0],args[1]);
      const rect=rectangle(args.slice(2,6)),decoded=patch(args[6],rect);active();
      const writtenCells=write(cache,rect,decoded);updates++;
      return Object.freeze({kind:'map-cache-patch',rectangle:rect.coordinates,writtenCells,updates,ignoredOuterBytes:decoded.ignoredOuterBytes});
    },
    copyBytes(){active();return cache.bytes.slice();},
    readRectangle(coordinates){active();const rect=rectangle(coordinates);active();return read(cache,rect);},
    inspect(){return Object.freeze({profile:LEGACY_GAME_MAP_PROFILE.id,scope:'map-cache-projection',installed:!closed,
      identity:closed?null:Object.freeze([identityA,identityB]),width:closed?0:cache.width,height:closed?0:cache.height,mode,updates,
      planeRoles:'unassigned',nativeSceneSynchronization:'unmodeled',currentVersionCompatibility:'unverified'});},
    close(){if(closed)return;closed=true;cache.bytes.fill(0);cache=null;},
  });
}
