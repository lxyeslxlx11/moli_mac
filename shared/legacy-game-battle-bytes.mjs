/** Owned source battle bytes/readers; no native pointers or unsafe reads. */
import {unescapeLegacyGameInnerField} from './legacy-game-state.mjs';
export class LegacyGameBattleError extends Error {
  constructor(code) { super('Battle data is outside the evidenced bounded source profile.'); this.name='LegacyGameBattleError'; this.code=code; }
}
export const battleFail=code=>{throw new LegacyGameBattleError(code);};
const typed=Object.getPrototypeOf(Uint8Array.prototype),getBuffer=Object.getOwnPropertyDescriptor(typed,'buffer').get,getLength=Object.getOwnPropertyDescriptor(typed,'length').get,getOffset=Object.getOwnPropertyDescriptor(typed,'byteOffset').get,getBufferLength=Object.getOwnPropertyDescriptor(ArrayBuffer.prototype,'byteLength').get;
export function battleOwnedBytes(value,maximum=32760) {
  try {
    let buffer,length,offset=0;
    if(value instanceof ArrayBuffer){buffer=value;length=Reflect.apply(getBufferLength,value,[]);}
    else{if(!(value instanceof Uint8Array))battleFail('LEGACY_BATTLE_BYTES');buffer=Reflect.apply(getBuffer,value,[]);Reflect.apply(getBufferLength,buffer,[]);length=Reflect.apply(getLength,value,[]);offset=Reflect.apply(getOffset,value,[]);}
    if(length>maximum)battleFail('LEGACY_BATTLE_BUDGET');
    const copy=new Uint8Array(new Uint8Array(buffer,offset,length)),end=copy.indexOf(0);
    if(end<0)return copy;const prefix=copy.slice(0,end);copy.fill(0);return prefix;
  }catch(error){if(error instanceof LegacyGameBattleError)throw error;battleFail('LEGACY_BATTLE_BYTES');}
}
const digit=n=>n>=48&&n<=57?n-48:n>=65&&n<=70?n-55:-1;
export function createBattleFieldReader(raw,initial=2) {
  let at=initial;
  return {
    get offset(){return at;},get done(){return at>=raw.length;},
    seek(next){if(!Number.isInteger(next)||next<0||next>raw.length+4)battleFail('LEGACY_BATTLE_CURSOR');at=next;},
    number(){let n=0,started=false;while(at<raw.length){const b=raw[at],d=digit(b);if(d>=0){n=(Math.imul(n,16)+d)|0;started=true;at++;}else if(started||b===124){at++;return n;}else at++;}return n;},
    name(maximum=28){const out=[];while(at<raw.length){const b=raw[at++];if(b===124)break;if(b>=128){if(at>=raw.length)battleFail('LEGACY_BATTLE_TEXT_PAIR');const second=raw[at++];if(out.length<maximum){out.push(b);if(out.length<maximum)out.push(second);}}else if(out.length<maximum)out.push(b);}return unescapeLegacyGameInnerField(Uint8Array.from(out));},
    token(){if(at>=raw.length||at+1>=raw.length)return null;while(at<raw.length){const b=raw[at];if(b>=65&&b<=90){if(at+2>=raw.length)battleFail('LEGACY_BATTLE_MOTION_TRUNCATED');const offset=at,token=String.fromCharCode(raw[at],raw[at+1],raw[at+2]);at+=4;return{token,offset,argumentOffset:at};}at++;}return null;},
  };
}
