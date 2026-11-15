/** Fixed37c4 ordinary value bars and source value/party records. No semantic stat names or native memory. */
import {assetFields,assetInteger,assetList,assetBytes} from './legacy-game-resource-values.mjs';
import {splitLegacyGameStateFields as fields,unescapeLegacyGameInnerField as unescape,readLegacyGameStateBase62 as base62,readLegacyGameStateDecimal as decimal} from './legacy-game-state.mjs';
export const LEGACY_GAME_VITALS_PROFILE=Object.freeze({id:'legacy-se6000-37c4-vitals-v1',sourceSha256:'37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd',priority:207,partySlots:5,partyRecordBytes:48,remoteValueRecords:5,fieldSemantics:'source-pair0-pair1',partyFollowing:'unmodeled',nativeBattle:'unmodeled'});
export class LegacyGameVitalsError extends Error{constructor(code){super('Value or party input is outside the evidenced ordinary source projection.');this.name='LegacyGameVitalsError';this.code=code;}}
const fail=code=>{throw new LegacyGameVitalsError(code);},int=n=>assetInteger(n,-2147483648,2147483647),short=n=>(n<<16)>>16;
export function legacyGameActorValueWidth(current,maximum){int(current);int(maximum);if(maximum===0)return null;const numerator=current<<5;if(numerator===-2147483648&&maximum===-1)fail('LEGACY_VITALS_DIVIDE_OVERFLOW');return short(Math.trunc(numerator/maximum));}
export function planLegacyGameActorVitals(value){const r=assetFields(value,['enabled','local','bodyFlags','primary','screenX','screenY','values']);if(typeof r.enabled!=='boolean'||typeof r.local!=='boolean')fail('LEGACY_VITALS_BOOLEAN');assetInteger(r.bodyFlags,0,0xffffffff);assetInteger(r.primary,0,65535);int(r.screenX);int(r.screenY);const values=assetList(r.values,4).map(int);if(values.length!==4)fail('LEGACY_VITALS_VALUES');
 if(!r.enabled||(!r.local&&!(r.primary&0x200)))return null;if(r.local&&(r.bodyFlags&0x80000))fail('LEGACY_VITALS_SHADOW_SOURCE_REQUIRED');
 const widths=[legacyGameActorValueWidth(values[0],values[1]),legacyGameActorValueWidth(values[2],values[3])],draws=[];
 for(let i=0;i<2;i++)if(widths[i]!==null)draws.push(Object.freeze({kind:'fill',resourceId:i?0x3bdef:0x3bdf0,x:(r.screenX-22)|0,y:(r.screenY+(i?4:1))|0,sourceAnchor:Object.freeze([-16,-1]),sourceWidth:widths[i],sourceHeight:2}));
 draws.push(Object.freeze({kind:'background',resourceId:0x3bdee,x:(r.screenX-10)|0,y:(r.screenY+3)|0}));return Object.freeze({priority:207,flags:4,color:0xffffffff,values:Object.freeze(values),widths:Object.freeze(widths),draws:Object.freeze(draws)});
}
export function decodeLegacyGameActorValues(value){const raw=assetBytes(value,32760);try{const tokens=fields(raw),records=[];let terminatedAt=5;
 for(let i=0;i<5;i++){const at=i*5,id=tokens[at]?.subarray(0,2047);if(!id?.length){terminatedAt=i;break;}records.push(Object.freeze({id:base62(id),values:Object.freeze(Array.from({length:4},(_,j)=>decimal(tokens[at+j+1]?.subarray(0,2047)??new Uint8Array())))}));}
 return Object.freeze({kind:'actor-values',records:Object.freeze(records),terminatedAt,extraTokens:Math.max(0,tokens.length-25)});
 }finally{raw.fill(0);}}
export function decodeLegacyGamePartyUpdate(slot,value){assetInteger(slot,0,4);const raw=assetBytes(value,32760);try{const tokens=fields(raw),first=tokens[0]?.subarray(0,127),mask=(first?.length?base62(first):-1)>>>0,updates=[];let at=1;
 if(mask!==0){for(const [name,flag]of [['actorId',3],['value8',5],['value10',9],['value0c',17],['value14',33],['labelBytes',65]])if(mask&flag){const token=tokens[at++]?.subarray(0,name==='labelBytes'?255:127)??new Uint8Array();let value;
   if(name==='labelBytes'){const decoded=unescape(token);value=decoded.length<=16?decoded.slice():Uint8Array.of(63,63,63);decoded.fill(0);}else value=token.length?decimal(token):-1;updates.push(Object.freeze({name,value}));}}
 return Object.freeze({kind:'party-update',slot,mask,active:mask!==0,updates:Object.freeze(updates),extraTokens:Math.max(0,tokens.length-at)});
 }finally{raw.fill(0);}}
