/** Source-bound Config.exe file bytes. No filesystem, renderer, process, credentials or game-protocol APIs. */
export const GAME_CONFIG_PROFILE=Object.freeze({id:'config-exe-9389add9-v1',
  sourceSha256:'9389add9c04cbc6bd313a34098ed94aef11a866ba721c6ccf7f984973efa0f7d',
  fileName:'Config.dat',readBytes:256,maximumWriterBytes:52,
  deviceCodes:Object.freeze([1,2,3,4]),scope:'configuration-helper-only'});
export class GameConfigError extends Error {
  constructor(code){super('Game configuration does not match the supported bounded profile.');this.name='GameConfigError';this.code=code;}
}
const fail=code=>{throw new GameConfigError(code);};
const flagNames=Object.freeze(['windowMode','onlyActive','soundOff','musicOff']);
const flagTokens=Object.freeze(['windowmode','onlyactive','soundoff','musicoff']);
const typed=Object.getPrototypeOf(Uint8Array.prototype),lengthOf=Object.getOwnPropertyDescriptor(typed,'length').get,
  bufferOf=Object.getOwnPropertyDescriptor(typed,'buffer').get,offsetOf=Object.getOwnPropertyDescriptor(typed,'byteOffset').get,
  bufferLength=Object.getOwnPropertyDescriptor(ArrayBuffer.prototype,'byteLength').get;
function ownSettings(value){
  let fields;try{fields=Object.getOwnPropertyDescriptors(value);}catch{fail('GAME_CONFIG_INPUT');}
  const names=['deviceCode',...flagNames];
  if(Reflect.ownKeys(fields).length!==5||names.some(name=>!fields[name]||!Object.hasOwn(fields[name],'value')))fail('GAME_CONFIG_INPUT');
  const result=Object.fromEntries(names.map(name=>[name,fields[name].value]));
  if(!Number.isInteger(result.deviceCode)||result.deviceCode<1||result.deviceCode>4||flagNames.some(name=>typeof result[name]!=='boolean'))fail('GAME_CONFIG_INPUT');
  return Object.freeze(result);
}
function readPrefix(value){
  let buffer,length,offset=0;
  try{
    if(value instanceof ArrayBuffer){buffer=value;length=Reflect.apply(bufferLength,value,[]);}
    else{if(!(value instanceof Uint8Array))fail('GAME_CONFIG_INPUT');
      buffer=Reflect.apply(bufferOf,value,[]);Reflect.apply(bufferLength,buffer,[]);
      length=Reflect.apply(lengthOf,value,[]);offset=Reflect.apply(offsetOf,value,[]);}
    const bytes=new Uint8Array(new Uint8Array(buffer,offset,Math.min(length,256)));return{bytes,length};
  }catch{fail('GAME_CONFIG_INPUT');}
}

export function createDefaultGameConfig(){return Object.freeze({deviceCode:1,windowMode:false,onlyActive:false,soundOff:false,musicOff:false});}
export function encodeGameConfig(value){
  const settings=ownSettings(value);let text=` 3Ddevice:${settings.deviceCode} `;
  for(let i=0;i<4;i++)if(settings[flagNames[i]])text+=flagTokens[i]+' ';
  return Uint8Array.from(text,character=>character.charCodeAt(0));
}

/** Native substring/decimal semantics within an explicit bounded text boundary; undefined stack/parse states are rejected. */
export function decodeGameConfig(value){
  const {bytes,length}=readPrefix(value);
  try{
    const nul=bytes.indexOf(0),end=nul<0?bytes.length:nul;
    let text='';for(let i=0;i<end;i++)text+=String.fromCharCode(bytes[i]);
    const deviceOffset=text.indexOf('3Ddevice:');if(deviceOffset<0)fail('GAME_CONFIG_DEVICE_MISSING');
    let at=deviceOffset+9;while(at<end&&[9,10,11,12,13,32].includes(bytes[at]))at++;
    let sign=1;if(bytes[at]===43||bytes[at]===45){if(bytes[at]===45)sign=-1;at++;}
    const first=at;let deviceCode=0;
    while(at<end&&bytes[at]>=48&&bytes[at]<=57){
      deviceCode=deviceCode*10+bytes[at++]-48;
      if(deviceCode>(sign<0?2147483648:2147483647))fail('GAME_CONFIG_DEVICE_OVERFLOW');
    }
    if(at===first)fail('GAME_CONFIG_DEVICE_PARSE');deviceCode*=sign;
    if(deviceCode<1||deviceCode>4)fail('GAME_CONFIG_DEVICE_RANGE');
    const fields={deviceCode},offsets={device:deviceOffset};
    for(let i=0;i<4;i++){const found=text.indexOf(flagTokens[i]);fields[flagNames[i]]=found>=0;offsets[flagNames[i]]=found;}
    return Object.freeze({profile:GAME_CONFIG_PROFILE.id,settings:Object.freeze(fields),offsets:Object.freeze(offsets),
      inputBytes:length,readBytes:bytes.length,textBytes:end,unreadBytes:length-bytes.length,
      ignoredAfterNul:nul<0?0:bytes.length-end-1,boundary:nul<0?'bounded-read-end':'nul-in-read',
      boundaryPolicy:'bounded-end-as-terminator',scope:'configuration-helper-only',gameEffects:'unverified'});
  }finally{bytes.fill(0);}
}
