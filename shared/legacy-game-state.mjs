/** Ordered source state slots. No guessed attribute names or native wrapped-storage emulation. */
import { LEGACY_GAME_STATE_CATALOG as catalog } from './legacy-game-state-catalog.mjs';
export { LEGACY_GAME_STATE_CATALOG } from './legacy-game-state-catalog.mjs';
export const LEGACY_GAME_STATE_PROFILE=Object.freeze({id:'legacy-se6000-37c4-state-v1',
  sourceSha256:'37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd',
  inputBytes:32760,recordFields:Object.freeze([30,18]),scope:'source-state-slots',attributeNames:'unassigned',nativeActorSynchronization:'unmodeled',currentVersionCompatibility:'unverified'});
export class LegacyGameStateError extends Error{
  constructor(code){super('Legacy state does not match the supported bounded profile.');this.name='LegacyGameStateError';this.code=code;}
}
const fail=code=>{throw new LegacyGameStateError(code);};
const typed=Object.getPrototypeOf(Uint8Array.prototype),bufferOf=Object.getOwnPropertyDescriptor(typed,'buffer').get,
  lengthOf=Object.getOwnPropertyDescriptor(typed,'length').get,offsetOf=Object.getOwnPropertyDescriptor(typed,'byteOffset').get,
  bufferLength=Object.getOwnPropertyDescriptor(ArrayBuffer.prototype,'byteLength').get;
function input(value){
  try{
    let buffer,length,offset=0;
    if(value instanceof ArrayBuffer){buffer=value;length=Reflect.apply(bufferLength,value,[]);}
    else{if(!(value instanceof Uint8Array))fail('LEGACY_STATE_INPUT');buffer=Reflect.apply(bufferOf,value,[]);Reflect.apply(bufferLength,buffer,[]);
      length=Reflect.apply(lengthOf,value,[]);offset=Reflect.apply(offsetOf,value,[]);}
    if(length>32760)fail('LEGACY_STATE_BUDGET');return new Uint8Array(new Uint8Array(buffer,offset,length));
  }catch(error){if(error instanceof LegacyGameStateError)throw error;fail('LEGACY_STATE_INPUT');}
}
function prefix(bytes){const nul=bytes.indexOf(0);return nul<0?bytes:bytes.subarray(0,nul);}
function fields(raw,separator=124){
  const bytes=prefix(raw),result=[];let start=0;
  for(let i=0;i<bytes.length;i++){
    if(bytes[i]>=128){i++;continue;}
    if(bytes[i]===separator){result.push(bytes.subarray(start,i));start=i+1;}
  }
  result.push(bytes.subarray(start));return result;
}
function innerUnescape(bytes){
  bytes=prefix(bytes);const output=new Uint8Array(bytes.length);let n=0;
  for(let i=0;i<bytes.length;i++){
    const b=bytes[i];
    if(b>=128){output[n++]=b;if(i+1<bytes.length)output[n++]=bytes[++i];}
    else if(b===92){
      if(++i>=bytes.length)break;const escaped=bytes[i];
      output[n++]=escaped===110?10:escaped===99?44:escaped===122?124:escaped===121?92:escaped;
    }else output[n++]=b;
  }
  return output.slice(0,n);
}
const token=(tokens,index,maximum)=>tokens[index]?.subarray(0,maximum)??new Uint8Array();
const alphabet='0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
function base62(bytes){
  let n=0,sign=1;
  for(const b of bytes){n=Math.imul(n,62);if(b===45)sign=-1;else{const digit=alphabet.indexOf(String.fromCharCode(b));if(digit<0)return 0;n=(n+digit)|0;}}
  return Math.imul(n,sign);
}
function decimal(bytes){
  let at=0,n=0,sign=1;
  while(at<bytes.length&&(bytes[at]===32||(bytes[at]>=9&&bytes[at]<=13)))at++;
  if(bytes[at]===45||bytes[at]===43){if(bytes[at]===45)sign=-1;at++;}
  while(at<bytes.length&&bytes[at]>=48&&bytes[at]<=57)n=(Math.imul(n,10)+bytes[at++]-48)|0;
  return Math.imul(n,sign);
}
export function decodeLegacyGameStateRecord(operationId,value){
  const spec=typeof operationId==='string'?catalog.find(r=>r.operation_id===operationId):null;if(!spec)fail('LEGACY_STATE_OPERATION');
  const raw=input(value);
  try{
    const tokens=fields(raw),mask=token(tokens,0,127),flags=(mask.length?base62(mask):-1)>>>0,updates=[],ignoredFields=[];let at=1;
    for(const field of spec.fields){
      if((flags&field.mask)===0)continue;
      const selected=token(tokens,at++,field.kind==='bytes'?255:127);let decoded;
      if(field.kind==='bytes'){
        decoded=innerUnescape(selected);
        if(decoded.length>16){decoded.fill(0);ignoredFields.push(field.id);continue;}
      }else{
        decoded=selected.length?decimal(selected):-1;
        if(field.nonpositive_replacement!==undefined&&decoded<=0)decoded=field.nonpositive_replacement;
      }
      updates.push(Object.freeze({fieldId:field.id,nativeStorage:field.native_storage,value:decoded}));
    }
    return Object.freeze({profile:LEGACY_GAME_STATE_PROFILE.id,kind:'masked-state-update',recordId:spec.id,operationId,flags,
      updates:Object.freeze(updates),ignoredFields:Object.freeze(ignoredFields),missingFields:Math.max(0,at-tokens.length),extraTokenCount:Math.max(0,tokens.length-at),
      attributeNames:'unassigned',nativeActorSynchronization:'unmodeled'});
  }finally{raw.fill(0);}
}
export function decodeLegacyGameSceneLabel(value){
  const raw=input(value);let whole,first;
  try{
    whole=innerUnescape(raw);const tokens=fields(whole);first=innerUnescape(token(tokens,0,255));
    const fallback=first.length>=25,labelBytes=fallback?new Uint8Array([63,63,63]):first.slice(),second=token(tokens,1,31),n=second.length?decimal(second):-1;
    return Object.freeze({kind:'scene-label',labelBytes,code:n<0?-1:n,fallbackApplied:fallback,semantics:'unassigned-global-label'});
  }finally{raw.fill(0);whole?.fill(0);first?.fill(0);}
}
const valueCopy=value=>value instanceof Uint8Array?value.slice():value;
export function createLegacyGameState(){
  let closed=false;const records=new Map(catalog.map(r=>[r.id,new Map(r.fields.map(f=>[f.id,null]))]));
  const active=()=>{if(closed)fail('LEGACY_STATE_CLOSED');};
  return Object.freeze({
    applyEntryAppearance(value){
      active();if(!Number.isInteger(value)||value < -2147483648||value>2147483647)fail('LEGACY_STATE_INTEGER');
      records.get(catalog[1].id).set('field-16',value);
    },
    apply(operationId,bytes){
      active();const update=decodeLegacyGameStateRecord(operationId,bytes);active();const record=records.get(update.recordId);
      for(const field of update.updates){const prior=record.get(field.fieldId);if(prior instanceof Uint8Array)prior.fill(0);record.set(field.fieldId,valueCopy(field.value));}
      return update;
    },
    readInteger(recordId, fieldId){
      active();
      const value=records.get(recordId)?.get(fieldId);
      return Number.isInteger(value)?value:null;
    },
    copyBytes(recordId,fieldId){active();const value=records.get(recordId)?.get(fieldId);return value instanceof Uint8Array?value.slice():null;},
    applyActorGlobals(value15=null,firstLabel=null,secondLabel=null,speed=null){
      active();const pending=[];
      for(const [value,recordId,fieldId] of [[value15,catalog[0].id,'field-15'],[speed,catalog[1].id,'field-18']]){
        if(value===null)continue;if(!Number.isInteger(value)||value < -2147483648||value>2147483647)fail('LEGACY_STATE_INTEGER');
        pending.push({recordId,fieldId,value});
      }
      for(const [value,fieldId] of [[firstLabel,'field-29'],[secondLabel,'field-30']]){
        if(value===null)continue;const owned=input(value),selected=prefix(owned);
        if(selected.length<=16)pending.push({recordId:catalog[0].id,fieldId,value:selected.slice()});owned.fill(0);
      }
      active();for(const row of pending){const record=records.get(row.recordId),previous=record.get(row.fieldId);
        if(previous instanceof Uint8Array)previous.fill(0);record.set(row.fieldId,row.value);}
    },
    copyState(){
      active();return Object.freeze({profile:LEGACY_GAME_STATE_PROFILE.id,attributeNames:'unassigned',nativeActorSynchronization:'unmodeled',
        records:Object.freeze(catalog.map(r=>Object.freeze({id:r.id,operationId:r.operation_id,
          fields:Object.freeze(r.fields.map(f=>Object.freeze({id:f.id,nativeStorage:f.native_storage,value:valueCopy(records.get(r.id).get(f.id))})))})))});
    },
    close(){if(closed)return;closed=true;for(const record of records.values())for(const value of record.values())if(value instanceof Uint8Array)value.fill(0);records.clear();},
  });
}
// Shared source grammar for actor consumers; these are not reexported by shared/index.
export { fields as splitLegacyGameStateFields,innerUnescape as unescapeLegacyGameInnerField,
  base62 as readLegacyGameStateBase62,decimal as readLegacyGameStateDecimal };
