/** Fixed37c4 byte-width and ordinary actor label queue; glyphs come from explicit platform ports. */
import {assetFields,assetInteger,assetList,assetBytes} from './legacy-game-resource-values.mjs';
import {splitLegacyGameStateFields as fields,unescapeLegacyGameInnerField as unescape,readLegacyGameStateDecimal as decimal} from './legacy-game-state.mjs';
export const LEGACY_GAME_TEXT_PROFILE=Object.freeze({id:'legacy-se6000-37c4-ordinary-text-v1',sourceSha256:'37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd',records:4096,recordBytes:272,stringBytes:255,actorFont:1,priority:210,labelRows:48,nativeGlyphPixels:'host-port-unverified',wireEncoding:'explicit-port'});
export class LegacyGameTextError extends Error{constructor(code){super('Text is outside the evidenced bounded source projection.');this.name='LegacyGameTextError';this.code=code;}}
const fail=code=>{throw new LegacyGameTextError(code);},int=(n,lo=-2147483648,hi=2147483647)=>assetInteger(n,lo,hi),short=n=>(n<<16)>>16;
const metrics=Object.freeze([[9,18,18,18],[7,14,14,14],[11,21,21,21],[9,17,17,17],[8,15,15,15],[11,21,21,21],[11,21,21,21],[11,21,21,21],[6,12,12,12],[6,12,12,12],[8,16,16,16],[10,20,20,20],[6,12,12,12],[7,13,13,13]].map(Object.freeze));
export const LEGACY_GAME_TEXT_COLORS=Object.freeze([[255,255,255],[0,255,255],[255,0,255],[0,0,255],[255,255,0],[0,255,0],[255,0,0],[160,160,164],[166,202,240],[192,220,192],[0,0,0],[205,205,205]].map(Object.freeze));
export function legacyGameTextFontMetrics(font){int(font);font=font>=0&&font<14?font:0;const m=metrics[font];return Object.freeze({font,singleWidth:m[0],singleHeight:m[1],doubleWidth:m[2],doubleHeight:m[3]});}
function string(value,maximum=255){let raw;if(value===null)return Object.freeze([]);if(Array.isArray(value)){raw=assetList(value,maximum).map(n=>int(n,0,255));}else{const b=assetBytes(value,maximum);raw=Array.from(b);b.fill(0);}const nul=raw.indexOf(0);return Object.freeze(nul<0?raw:raw.slice(0,nul));}
export function measureLegacyGameText(value,font=0){const bytes=string(value),m=legacyGameTextFontMetrics(font);let width=0;
 for(let i=0;i<bytes.length;i++){if(bytes[i]&128){if(i+1>=bytes.length)fail('LEGACY_TEXT_DANGLING_BYTE');i++;width+=m.doubleWidth;}else width+=m.singleWidth;}return width;}
export function planLegacyGameActorLabel(value){const r=assetFields(value,['local','mode','bodyFlags','resourceId','screenX','screenY','labels','selectedLabel']);
 if(typeof r.local!=='boolean')fail('LEGACY_TEXT_BOOLEAN');int(r.mode);int(r.bodyFlags,0,0xffffffff);int(r.resourceId);int(r.screenX);int(r.screenY);const labels=assetList(r.labels,5);if(labels.length!==5)fail('LEGACY_TEXT_LABELS');
 if(r.mode<1)return null;let bytes,color;
 if(r.local){if(r.mode>5)return null;const index=[0,0,1,-1,2,3][r.mode];bytes=index<0?string(r.selectedLabel):string(labels[index]);color=[0,1,4,5,2,0][r.mode];}
 else if((r.bodyFlags&0x100)&&!(r.bodyFlags&0x80000)){if(r.resourceId===0||r.mode>5)return null;bytes=string(labels[[0,0,1,4,2,3][r.mode]]);color=[0,0,1,4,5,2][r.mode];}
 else if(r.bodyFlags&0x80200){const second=(r.bodyFlags&0x200)?string(labels[1]):null;bytes=second?.length?second:string(labels[0]);color=0;}
 else return null;
 const width=measureLegacyGameText(bytes,1);return Object.freeze({x:short(short(r.screenX)-Math.trunc(width/2)),y:short(short(r.screenY)-98),font:1,color,bytes});
}
export function createLegacyGameTextBatch(value,priority=210){
 if(priority!==210&&priority!==216)fail('LEGACY_TEXT_BATCH');
 const runs=assetList(value,4096).map(row=>{const r=assetFields(row,['x','y','font','color','bytes'],['actorId']);int(r.x);int(r.y);int(r.font,0,13);int(r.color,0,255);if((r.color&127)>=12)fail('LEGACY_TEXT_COLOR_UNSUPPORTED');if(Object.hasOwn(r,'actorId'))int(r.actorId);return Object.freeze({...r,x:short(r.x),y:short(r.y),bytes:string(r.bytes)});});
 return Object.freeze({profile:LEGACY_GAME_TEXT_PROFILE.id,priority,runs:Object.freeze(runs)});
}
export function snapshotLegacyGameTextBatch(value){const r=assetFields(value,['profile','priority','runs']);if(r.profile!==LEGACY_GAME_TEXT_PROFILE.id)fail('LEGACY_TEXT_BATCH');return createLegacyGameTextBatch(r.runs,r.priority);}
export function legacyGameTextMaskKey(run){return run.font+':'+run.bytes.map(n=>n.toString(16).padStart(2,'0')).join('');}
export function legacyGameTextRasterRequest(run){return Object.freeze({font:run.font,bytes:run.bytes,metrics:legacyGameTextFontMetrics(run.font),nativeFont:run.font===1?Object.freeze({height:14,width:0,weight:400,charSet:1,pitchAndFamily:17,faceNameBytes:Object.freeze([203,206,204,229])}):null});}
export function decodeLegacyGameActorLabelList(value){const raw=assetBytes(value,32760),rows=[];try{const tokens=fields(raw),number=i=>{const b=tokens[i]?.subarray(0,127);return b?.length?decimal(b):-1;};
 for(let i=0;i<48;i++){const first=number(i*3+1),text=unescape(tokens[i*3]?.subarray(0,255)??new Uint8Array());try{const bytes=string(text);if(first>=0&&bytes.length>19)fail('LEGACY_TEXT_LABEL_ROW_BUDGET');rows.push(Object.freeze({code:first<0?-1:first,value:first<0?-1:number(i*3+2),labelBytes:first<0?new Uint8Array():Uint8Array.from(bytes)}));}finally{text.fill(0);}}
 return Object.freeze({kind:'actor-label-list',records:Object.freeze(rows),extraTokens:Math.max(0,tokens.length-144)});
 }catch(error){for(const row of rows)row.labelBytes.fill(0);throw error;}finally{raw.fill(0);}}
