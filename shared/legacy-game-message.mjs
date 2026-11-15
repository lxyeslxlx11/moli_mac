/** Source-bound legacy text fields and dispatch metadata; no guessed business schema. */
import { LEGACY_GAME_MESSAGE_CATALOG as retainedCatalog } from './legacy-game-catalog.mjs';
// The trade offer formatter is byte-bound separately from the original caller inventory.
const tradeOffer = Object.freeze({
  id: 'send-004f7dc0', tag: '+oj', fields: Object.freeze(['bytes', 'bytes', 'int32']), producer: '0x4f7dc0',
});
// File-backed family wrappers sit outside the original caller inventory.
const familyProfile = Object.freeze({
  id: 'send-004f6fd0', tag: '7nu', fields: Object.freeze(['int32', 'bytes']), producer: '0x4f6fd0',
});
const familyRole = Object.freeze({
  id: 'send-004f7040', tag: '80i', fields: Object.freeze(['int32', 'int32', 'bytes']), producer: '0x4f7040',
});
const familyAssignRole = Object.freeze({
  id: 'send-004f70d0', tag: '8MV', fields: Object.freeze(['int32', 'int32']), producer: '0x4f70d0',
});
const familyRemoveMember = Object.freeze({
  id: 'send-004f71b0', tag: '8u6', fields: Object.freeze(['int32']), producer: '0x4f71b0',
});
const catalog = Object.freeze({ ...retainedCatalog,
  outgoing: Object.freeze([...retainedCatalog.outgoing, tradeOffer, familyProfile, familyRole, familyAssignRole, familyRemoveMember]) });
export { catalog as LEGACY_GAME_MESSAGE_CATALOG };
export const LEGACY_GAME_MESSAGE_PROFILE = Object.freeze({
  id: 'legacy-se6000-37c4-message-v1',
  sourceSha256: '37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd',
  messageBytes: 32760, binaryBytes: 32767, tagBytes: 1023,
  fieldInputBytes: 32760, escapedFieldBytes: 65520,
  outgoingOperations: catalog.outgoing.length, incomingBranches: 104, maximumIncomingFields: 17,
  scope: 'legacy-message-and-network-position-only', currentVersionCompatibility: 'unverified',
});
export class LegacyGameMessageError extends Error {
  constructor(code) { super('Legacy game message does not match the supported bounded profile.'); this.name='LegacyGameMessageError'; this.code=code; }
}
const fail=code=>{throw new LegacyGameMessageError(code);};
const typed=Object.getPrototypeOf(Uint8Array.prototype);
const lengthOf=Object.getOwnPropertyDescriptor(typed,'length').get;
const bufferOf=Object.getOwnPropertyDescriptor(typed,'buffer').get;
const offsetOf=Object.getOwnPropertyDescriptor(typed,'byteOffset').get;
const bufferLength=Object.getOwnPropertyDescriptor(ArrayBuffer.prototype,'byteLength').get;
function input(value,maximum){
  let buffer,length,offset=0;
  try{
    if(value instanceof ArrayBuffer){buffer=value;length=Reflect.apply(bufferLength,value,[]);}
    else{if(!(value instanceof Uint8Array))fail('LEGACY_GAME_MESSAGE_INPUT');buffer=Reflect.apply(bufferOf,value,[]);Reflect.apply(bufferLength,buffer,[]);
      length=Reflect.apply(lengthOf,value,[]);offset=Reflect.apply(offsetOf,value,[]);}
    if(length>maximum)fail('LEGACY_GAME_MESSAGE_BUDGET');
    return new Uint8Array(new Uint8Array(buffer,offset,length));
  }catch(error){if(error instanceof LegacyGameMessageError)throw error;fail('LEGACY_GAME_MESSAGE_INPUT');}
}
const prefixLength=bytes=>{const at=bytes.indexOf(0);return at<0?bytes.length:at;};
const alphabet='0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
const ascii=text=>Uint8Array.from(text,character=>character.charCodeAt(0));

export function encodeLegacyGameInteger(value){
  if(!Number.isInteger(value)||value < -2147483647||value > 2147483647)fail('LEGACY_GAME_INTEGER_RANGE');
  const negative=value<0;let remaining=Math.abs(value),text='';
  do{const digit=remaining%62;text=alphabet[digit]+text;remaining=Math.floor(remaining/62);}while(remaining);
  return ascii((negative?'-':'')+text);
}
export function decodeLegacyGameInteger(value){
  const raw=input(value,32760);try{
    const end=prefixLength(raw);let at=0,sign=1,result=0;
    if(raw[0]===45){sign=-1;at++;}
    for(;at<end;at++){
      const byte=raw[at];let digit;
      if(byte>=48&&byte<=57)digit=byte-48;else if(byte>=97&&byte<=122)digit=byte-87;
      else if(byte>=65&&byte<=90)digit=byte-29;else return 0;
      result=(Math.imul(result,62)+digit)|0;
    }
    return Math.imul(result,sign);
  }finally{raw.fill(0);}
}

export function encodeLegacyGameTextField(value){
  const raw=input(value,32760);let output;
  try{
    const end=prefixLength(raw);output=new Uint8Array(end*2);let length=0;
    for(let at=0;at<end;at++){
      const byte=raw[at];
      if(byte>=128){
        if(at+1>=end)fail('LEGACY_GAME_TEXT_PAIR');const second=raw[++at];
        output[length++]=byte;output[length++]=[92,32,10,13].includes(second)?102:second;
      }else if([92,32,10,13].includes(byte)){
        output[length++]=92;output[length++]=byte===32?83:byte===10?110:byte===13?114:92;
      }else output[length++]=byte;
    }
    return output.slice(0,length);
  }finally{raw.fill(0);output?.fill(0);}
}
export function decodeLegacyGameTextField(value){
  const raw=input(value,65520);let output;
  try{
    const end=prefixLength(raw);output=new Uint8Array(end);let length=0;
    for(let at=0;at<end;at++){
      const byte=raw[at];
      if(byte>=128){if(at+1>=end)fail('LEGACY_GAME_TEXT_PAIR');output[length++]=byte;output[length++]=raw[++at];}
      else if(byte===92){
        if(at+1===end){output[length++]=92;continue;}
        const next=raw[++at];output[length++]=next===83?32:next===110?10:next===114?13:92;
      }else output[length++]=byte;
    }
    return output.slice(0,length);
  }finally{raw.fill(0);output?.fill(0);}
}

function argumentsOf(value,length){
  if(!Array.isArray(value))fail('LEGACY_GAME_MESSAGE_ARGUMENTS');let descriptors;
  try{descriptors=Object.getOwnPropertyDescriptors(value);}catch{fail('LEGACY_GAME_MESSAGE_ARGUMENTS');}
  if(descriptors.length?.value!==length||Reflect.ownKeys(descriptors).length!==length+1)fail('LEGACY_GAME_MESSAGE_ARGUMENTS');
  return Array.from({length},(_,index)=>{const row=descriptors[index];if(!row||!Object.hasOwn(row,'value'))fail('LEGACY_GAME_MESSAGE_ARGUMENTS');return row.value;});
}
export function encodeLegacyGameCommand(operationId,values){
  if(typeof operationId!=='string')fail('LEGACY_GAME_MESSAGE_OPERATION');
  const spec=catalog.outgoing.find(row=>row.id===operationId);if(!spec)fail('LEGACY_GAME_MESSAGE_OPERATION');
  const args=argumentsOf(values,spec.fields.length),parts=[];
  try{
    let length=spec.tag.length+1;
    for(let at=0;at<args.length;at++){
      const bytes=spec.fields[at]==='int32'?encodeLegacyGameInteger(args[at]):encodeLegacyGameTextField(args[at]);parts.push(bytes);
      length+=bytes.length+1;if(length>32760)fail('LEGACY_GAME_MESSAGE_BUDGET');
    }
    const output=new Uint8Array(length);output.set(ascii(spec.tag));let at=spec.tag.length;output[at++]=32;
    for(const part of parts){output.set(part,at);at+=part.length;output[at++]=32;}
    return output;
  }finally{for(const part of parts)part.fill(0);}
}

export function decodeLegacyGameMessage(value){
  const raw=input(value,32760),values=[];let succeeded=false;
  try{
    const end=prefixLength(raw),ranges=[];let start=0,stop=-1,count=end?1:0;
    for(let at=0;at<end;at++){
      const byte=raw[at];if(stop<0&&(byte===32||byte===10||byte===13))stop=at;
      if(byte===32){if(ranges.length<18)ranges.push([start,stop]);start=at+1;stop=-1;count++;}
    }
    if(end&&ranges.length<18)ranges.push([start,stop<0?end:stop]);
    const first=ranges[0]||[0,0],tagBytes=raw.slice(first[0],Math.min(first[1],first[0]+1023));
    let tag='';for(const byte of tagBytes)tag+=String.fromCharCode(byte);
    const spec=catalog.incoming.find(row=>row.tag===tag);
    const common={profile:LEGACY_GAME_MESSAGE_PROFILE.id,tagBytes,inputBytes:raw.length,textBytes:end,
      ignoredAfterNul:end===raw.length?0:raw.length-end-1,tokenCount:count,tagTruncated:first[1]-first[0]>1023};
    if(!spec){succeeded=true;return Object.freeze({...common,kind:'unknown',operationId:null,consumer:null,arguments:Object.freeze([]),opaque:raw.slice(0,end)});}
    for(let at=0;at<spec.fields.length;at++){
      const range=ranges[at+1];
      values.push(range?(spec.fields[at]==='int32'?decodeLegacyGameInteger(raw.subarray(...range)):decodeLegacyGameTextField(raw.subarray(...range))):
        spec.fields[at]==='int32'?0:new Uint8Array());
    }
    succeeded=true;
    return Object.freeze({...common,kind:spec.action,operationId:spec.id,consumer:spec.consumer,nativeReturn:spec.native_return,
      arguments:Object.freeze(values),missingArguments:Math.max(0,spec.fields.length-Math.max(0,count-1)),extraTokenCount:Math.max(0,count-1-spec.fields.length)});
  }finally{raw.fill(0);if(!succeeded)for(const value of values)if(value instanceof Uint8Array)value.fill(0);}
}

export function decodeLegacyGameBinary(value){
  const raw=input(value,32767),segments=[];let succeeded=false;
  try{
    if(raw.length<3||raw[0]!==93)fail('LEGACY_GAME_BINARY_PREFIX');
    const count=raw[1]===94&&raw[2]===105?4:raw[1]===80&&raw[2]===107?1:0;
    if(!count)fail('LEGACY_GAME_BINARY_PREFIX');const header=3+count*2;if(raw.length<header)fail('LEGACY_GAME_BINARY_LENGTH');
    let at=header;
    for(let index=0;index<count;index++){
      const length=raw[3+index*2]|(raw[4+index*2]<<8);
      if(length>32767||at+length>raw.length)fail('LEGACY_GAME_BINARY_LENGTH');
      segments.push(raw.slice(at,at+length));at+=length;
    }
    succeeded=true;
    return Object.freeze({profile:LEGACY_GAME_MESSAGE_PROFILE.id,variant:count===4?'four-segments':'single-segment',
      consumer:count===4?'0x4eee80':'0x4eee40',segments:Object.freeze(segments),trailingBytes:raw.length-at});
  }finally{raw.fill(0);if(!succeeded)for(const segment of segments)segment.fill(0);}
}
