/** Fixed37c4 GraphicInfo metadata. Image records are opt-in; no asset availability claim. */
export const LEGACY_GAME_GRAPHIC_PROFILE=Object.freeze({id:'legacy-se6000-37c4-collision-graphics-v1',
  sourceSha256:'37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd',recordBytes:40,runtimeRecordBytes:32,capacity:850000,maximumGroups:7});
export class LegacyGameGraphicError extends Error{
  constructor(code){super('Graphic collision metadata does not match the supported legacy profile.');this.name='LegacyGameGraphicError';this.code=code;}
}
const fail=code=>{throw new LegacyGameGraphicError(code);},capacity=850000,owned=new WeakMap();
const typed=Object.getPrototypeOf(Uint8Array.prototype),bufferOf=Object.getOwnPropertyDescriptor(typed,'buffer').get,
  lengthOf=Object.getOwnPropertyDescriptor(typed,'length').get,offsetOf=Object.getOwnPropertyDescriptor(typed,'byteOffset').get,
  bufferLength=Object.getOwnPropertyDescriptor(ArrayBuffer.prototype,'byteLength').get;
function input(value){try{let buffer,length,offset=0;
  if(value instanceof ArrayBuffer){buffer=value;length=Reflect.apply(bufferLength,value,[]);}
  else{if(!(value instanceof Uint8Array))fail('LEGACY_GRAPHIC_INPUT');buffer=Reflect.apply(bufferOf,value,[]);Reflect.apply(bufferLength,buffer,[]);length=Reflect.apply(lengthOf,value,[]);offset=Reflect.apply(offsetOf,value,[]);}
  if(length>capacity*40)fail('LEGACY_GRAPHIC_BUDGET');if(length%40)fail('LEGACY_GRAPHIC_LENGTH');return new Uint8Array(new Uint8Array(buffer,offset,length));
}catch(error){if(error instanceof LegacyGameGraphicError)throw error;fail('LEGACY_GRAPHIC_INPUT');}}
function uint32(value){if(!Number.isInteger(value)||value<0||value>0xffffffff)fail('LEGACY_GRAPHIC_INTEGER');return value>>>0;}
export function resolveLegacyGameMapGraphic(value){uint32(value);return value<20000?value:value<65536?value+200000:value;}
function state(catalog){const s=owned.get(catalog);if(!s)fail('LEGACY_GRAPHIC_CATALOG');if(s.closed)fail('LEGACY_GRAPHIC_CLOSED');return s;}
function imageMetadata(current,index,resource){const at=index*5,a=current.images;if(!a)fail('LEGACY_GRAPHIC_IMAGES_DISABLED');const origin=a[at+2],size=a[at+3];
  return Object.freeze({resourceId:resource,index,group:Math.max(0,a[at+4]-1),byteOffset:a[at],byteLength:a[at+1],originX:(origin<<16)>>16,originY:origin>>16,width:size&65535,height:size>>>16,present:a[at+4]!==0});}
export function legacyGameGraphicResourceIdAt(catalog,index){const s=state(catalog);uint32(index);if(index>=capacity)fail('LEGACY_GRAPHIC_RECORD_BOUNDS');if(!s.resourceIds)fail('LEGACY_GRAPHIC_IMAGES_DISABLED');return s.resourceIds[index];}
export function legacyGameGraphicMetadataAt(catalog,index){const s=state(catalog);uint32(index);if(index>=capacity)fail('LEGACY_GRAPHIC_RECORD_BOUNDS');const packed=s.records[index];
  return Object.freeze({resourceId:null,index,tileWidth:packed&255,tileHeight:(packed>>>8)&255,rawFlags:packed>>>16,collisionClass:(packed>>>16)%100});}
export function legacyGameGraphicMetadata(catalog,resource){
  const s=state(catalog);uint32(resource);if(resource>=capacity)fail('LEGACY_GRAPHIC_RESOURCE_BOUNDS');const index=s.lookup[resource],packed=s.records[index];
  return Object.freeze({resourceId:resource,index,tileWidth:packed&255,tileHeight:(packed>>>8)&255,rawFlags:packed>>>16,collisionClass:(packed>>>16)%100});
}
export function createLegacyGameGraphicCatalog(groups,options){
  let includeImages=false;
  if(options!==undefined){let o;try{o=Object.getOwnPropertyDescriptors(options);}catch{fail('LEGACY_GRAPHIC_OPTIONS');}
    if(Reflect.ownKeys(o).length!==1||!Object.hasOwn(o.includeImages??{},'value')||typeof o.includeImages.value!=='boolean')fail('LEGACY_GRAPHIC_OPTIONS');includeImages=o.includeImages.value;}
  if(!Array.isArray(groups))fail('LEGACY_GRAPHIC_GROUPS');let d;try{d=Object.getOwnPropertyDescriptors(groups);}catch{fail('LEGACY_GRAPHIC_GROUPS');}
  const count=d.length?.value;if(!Number.isInteger(count)||count<1||count>7||Reflect.ownKeys(d).length!==count+1)fail('LEGACY_GRAPHIC_GROUPS');
  const s={closed:false,lookup:new Uint32Array(capacity),records:new Uint32Array(capacity),images:includeImages?new Uint32Array(capacity*5):null,resourceIds:includeImages?new Uint32Array(capacity):null,groupCount:count,recordCount:0,ignoredResourceIds:0};
  try{
    for(let group=0;group<count;group++){
      if(!Object.hasOwn(d[group]??{},'value'))fail('LEGACY_GRAPHIC_GROUPS');const raw=input(d[group].value),view=new DataView(raw.buffer);const rows=raw.length/40,base=s.recordCount;
      try{if(base+rows+10>=capacity)fail('LEGACY_GRAPHIC_BUDGET');for(let at=0;at<raw.length;at+=40){
        const sourceIndex=view.getInt32(at,true),index=sourceIndex+base,resource=view.getUint32(at+36,true);
        if(sourceIndex<0||index>=capacity)fail('LEGACY_GRAPHIC_RECORD_BOUNDS');
        s.records[index]=((view.getUint16(at+30,true)<<16)|(raw[at+29]<<8)|raw[at+28])>>>0;
        if(s.images){s.resourceIds[index]=resource;const dst=index*5;s.images[dst]=view.getUint32(at+4,true);s.images[dst+1]=view.getUint32(at+8,true);
          s.images[dst+2]=((view.getUint16(at+16,true)<<16)|view.getUint16(at+12,true))>>>0;
          s.images[dst+3]=((view.getUint16(at+24,true)<<16)|view.getUint16(at+20,true))>>>0;s.images[dst+4]=group+1;}
        if(resource===0)s.lookup[0]=0;else if(resource<capacity)s.lookup[resource]=index;else s.ignoredResourceIds++;
      }s.recordCount+=rows;}finally{raw.fill(0);}
    }
    for(const [resource,index] of [[0x3bd30,0x9999d],[0x3bd3a,0x9999e],[0x3bd44,0x9999f],[0x3bea2,0x999a0]])if(s.lookup[resource]!==0)s.lookup[resource]=index;
    const catalog=Object.freeze({lookup(resource){return legacyGameGraphicMetadata(catalog,resource);},
      image(resource){const current=state(catalog);uint32(resource);if(resource>=capacity)fail('LEGACY_GRAPHIC_RESOURCE_BOUNDS');if(!current.images)fail('LEGACY_GRAPHIC_IMAGES_DISABLED');
        return imageMetadata(current,current.lookup[resource],resource);},
      imageAt(index){const current=state(catalog);uint32(index);if(index>=capacity)fail('LEGACY_GRAPHIC_RECORD_BOUNDS');return imageMetadata(current,index,null);},
      resourceIdAt(index){return legacyGameGraphicResourceIdAt(catalog,index);},
      metadataAt(index){return legacyGameGraphicMetadataAt(catalog,index);},
      inspect(){const current=state(catalog);return Object.freeze({profile:LEGACY_GAME_GRAPHIC_PROFILE.id,groups:current.groupCount,records:current.recordCount,ignoredResourceIds:current.ignoredResourceIds,sourceCapacity:capacity,imagePixels:'unimplemented',currentVersionCompatibility:'unverified'});},
      close(){if(s.closed)return;s.closed=true;s.lookup.fill(0);s.records.fill(0);s.images?.fill(0);s.resourceIds?.fill(0);s.lookup=null;s.records=null;s.images=null;s.resourceIds=null;}});owned.set(catalog,s);return catalog;
  }catch(error){s.lookup.fill(0);s.records.fill(0);s.images?.fill(0);s.resourceIds?.fill(0);throw error;}
}
