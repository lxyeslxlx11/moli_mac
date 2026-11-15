/** Source-bound scene/cache preparation. No filesystem, native scene or rendering execution. */
import { MAP01_LIMITS } from './map01.mjs';
export const LEGACY_GAME_SCENE_PROFILE=Object.freeze({id:'legacy-se6000-37c4-scene-v1',
  sourceSha256:'37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd',
  scope:'scene-and-cache-preparation-projection',nativeSceneSynchronization:'unmodeled',currentVersionCompatibility:'unverified'});
export class LegacyGameSceneError extends Error{
  constructor(code){super('Legacy scene does not match the supported bounded profile.');this.name='LegacyGameSceneError';this.code=code;}
}
const fail=code=>{throw new LegacyGameSceneError(code);};
const typed=Object.getPrototypeOf(Uint8Array.prototype),bufferOf=Object.getOwnPropertyDescriptor(typed,'buffer').get,
  lengthOf=Object.getOwnPropertyDescriptor(typed,'length').get,offsetOf=Object.getOwnPropertyDescriptor(typed,'byteOffset').get,
  bufferLength=Object.getOwnPropertyDescriptor(ArrayBuffer.prototype,'byteLength').get;
function input(value){
  try{
    let buffer,length,offset=0;
    if(value instanceof ArrayBuffer){buffer=value;length=Reflect.apply(bufferLength,value,[]);}
    else{if(!(value instanceof Uint8Array))fail('LEGACY_SCENE_INPUT');buffer=Reflect.apply(bufferOf,value,[]);Reflect.apply(bufferLength,buffer,[]);
      length=Reflect.apply(lengthOf,value,[]);offset=Reflect.apply(offsetOf,value,[]);}
    if(length>MAP01_LIMITS.bytes)fail('LEGACY_SCENE_CACHE_BUDGET');return new Uint8Array(new Uint8Array(buffer,offset,length));
  }catch(error){if(error instanceof LegacyGameSceneError)throw error;fail('LEGACY_SCENE_INPUT');}
}
function ints(value,length){
  if(!Array.isArray(value))fail('LEGACY_SCENE_ARGUMENTS');let descriptors;
  try{descriptors=Object.getOwnPropertyDescriptors(value);}catch{fail('LEGACY_SCENE_ARGUMENTS');}
  if(descriptors.length?.value!==length||Reflect.ownKeys(descriptors).length!==length+1)fail('LEGACY_SCENE_ARGUMENTS');
  return Array.from({length},(_,i)=>{
    const row=descriptors[i];if(!row||!Object.hasOwn(row,'value'))fail('LEGACY_SCENE_ARGUMENTS');
    const n=row.value;if(!Number.isInteger(n)||n < -2147483648||n>2147483647)fail('LEGACY_SCENE_INTEGER');return n;
  });
}
export function prepareLegacyGameSceneTransition(argumentsValue,previousIdentity=null,previousCacheBytes=null){
  const fields=ints(argumentsValue,12),[identityA,identityB,width,height,x,y,word4,word8,mode,conditional,resourceSelector]=fields;
  const scene=Object.freeze({profile:LEGACY_GAME_SCENE_PROFILE.id,fields:Object.freeze(fields),identity:Object.freeze([identityA,identityB]),
    dimensions:Object.freeze([width,height]),headerWords:Object.freeze([word4,word8]),coordinates:Object.freeze([x,y]),
    scaledCoordinates:Object.freeze([Math.fround(x*64),Math.fround(y*64)]),checksumMode:mode,
    positiveConditionalValue:conditional>0?conditional:null,resourceSelector,
    resolvedSelector:mode===1?(resourceSelector===-1?identityB:resourceSelector):null,wireField12:fields[11],
    nativeSceneSynchronization:'unmodeled',currentVersionCompatibility:'unverified'});
  if(identityB===0)return Object.freeze({scene,cacheAction:'skipped-identityB-zero',cacheBytes:null});
  if(width<=0||height<=0)fail('LEGACY_SCENE_DIMENSIONS');
  if(width>MAP01_LIMITS.cells||height>Math.floor(MAP01_LIMITS.cells/width))fail('LEGACY_SCENE_CELL_BUDGET');
  const size=20+6*width*height;if(size>MAP01_LIMITS.bytes)fail('LEGACY_SCENE_CACHE_BUDGET');
  let previous=null;
  try{
    let sameIdentity=false;
    if(previousIdentity!==null||previousCacheBytes!==null){
      const pair=ints(previousIdentity,2);previous=input(previousCacheBytes);sameIdentity=pair[0]===identityA&&pair[1]===identityB;
    }
    const header=new Uint8Array(20),view=new DataView(header.buffer);header.set([77,65,80,1]);
    view.setInt32(4,word4,true);view.setInt32(8,word8,true);view.setInt32(12,width,true);view.setInt32(16,height,true);
    const matches=sameIdentity&&previous.length>=20&&header.every((b,i)=>previous[i]===b);
    if(matches&&identityA!==2){
      if(previous.length!==size)fail('LEGACY_SCENE_CACHE_LENGTH');
      const cacheBytes=previous;previous=null;return Object.freeze({scene,cacheAction:'reused',cacheBytes});
    }
    const cacheBytes=new Uint8Array(size);cacheBytes.set(header);
    return Object.freeze({scene,cacheAction:sameIdentity?'replaced':'created',cacheBytes});
  }finally{previous?.fill(0);}
}
