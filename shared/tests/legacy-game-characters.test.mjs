import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import * as api from '../index.mjs';
import { contentGraphics } from '../../analysis/game-post-login-v1/original_assets.mjs';
const vectors=JSON.parse(readFileSync(new URL('../../analysis/game-post-login-v1/original-vectors.json',import.meta.url)));
const b=h=>new Uint8Array(Buffer.from(h,'hex')),ascii=s=>new Uint8Array(Buffer.from(s,'ascii')),hex=b=>Buffer.from(b).toString('hex'),err=c=>e=>e instanceof api.LegacyGameCharacterError&&e.code===c;
function flow(g=4){const graphics=contentGraphics(api,g),core=api.createLegacyGameCharacterFlow({graphics});return{core,graphics,close(){core.close();graphics.close();}};}
function query(f,t=1000){f.core.begin();assert.equal(f.core.advance(t).snapshot.nativeSubphase,1);const r=f.core.advance(t);assert.equal(r.commands.length,1);assert.equal(r.commands[0].operationId,'send-004f86e0');assert.deepEqual(r.commands[0].arguments,[]);return r;}
function menu(f,{category=8,body=vectors.flow.bodyHex,t=1000}={}){query(f,t);f.core.observe(api.LEGACY_GAME_CHARACTER_PROFILE.category,[category]);f.core.observe(api.LEGACY_GAME_CHARACTER_PROFILE.listReply,[0,b(body)]);for(let i=0;i<4;i++)f.core.advance(t);return f.core.inspect();}
const wipe=rows=>rows.forEach(r=>{r.nameBytes.fill(0);r.field16Bytes.fill(0);r.recordBytes.fill(0);});
test('211 independent packed roster cases match all148B records including decimal wrap/div10, fallback, duplicates and missing slots',()=>{
 for(const row of vectors.records){const input=b(row.bodyHex),saved=input.slice(),r=api.decodeLegacyGameCharacterList(input);assert.deepEqual(r.records.map(hex),row.expected.records);for(const k of ['applied','ignored','nameFallbacks'])assert.equal(r[k],row.expected[k]);r.records.forEach(r=>r.fill(0));assert.deepEqual(input,saved);}
});
test('1566 independent unsigned category/content policies and source index0 probe semantics match',()=>{
 for(const row of vectors.policies)assert.deepEqual(api.legacyGameCharacterPolicy(row.category,row.generation),row.expected);
 for(let generation=-1;generation<=4;generation++){const g=contentGraphics(api,generation);try{assert.equal(api.detectLegacyGameCharacterContent(g),generation);}finally{g.close();}}
 const zero=contentGraphics(api,4,true);try{assert.equal(api.detectLegacyGameCharacterContent(zero),-1);}finally{zero.close();}
});
test('1128 independent native preview mutations preserve default look, variant and source conversion boundary values',()=>{
 for(const row of vectors.previews){const raw=b(row.recordHex),saved=raw.slice(),r=api.prepareLegacyGameCharacterPreview(raw);assert.equal(hex(r.recordBytes),row.expected.recordHex);assert.equal(r.normalizedCode,row.expected.normalizedCode);assert.equal(r.previewPixels,'unmodeled');r.recordBytes.fill(0);assert.deepEqual(raw,saved);}
});
test('source list/9/10/11 progression arms selection only after both record previews, with one query and duplicate suppression',()=>{
 const f=flow();try{query(f);assert.equal(f.core.observe('unrecognized',[]),false);f.core.observe('receive-00567c20',[8]);assert.equal(f.core.observe('receive-00567c3c',[0,b(vectors.flow.bodyHex)]),true);f.core.observe('receive-00567c3c',[1,ascii('OUTOFSERVICE')]);
 for(const phase of [9,10,11]){const step=f.core.advance(1000);assert.equal(step.snapshot.nativeSubphase,phase);assert.equal(step.snapshot.menuArmed,false);assert.deepEqual(step.commands,[]);}
 assert.equal(f.core.advance(1000).snapshot.state,'choosing');const slots=f.core.copySlots();assert.deepEqual(slots.map(r=>hex(r.recordBytes)),vectors.flow.preparedRecords);assert.equal(slots[0].values['field-17'],1);wipe(slots);assert.equal(f.core.inspect().requests,1);assert.equal(f.core.inspect().ignoredReplies,1);assert.ok(!JSON.stringify(f.core.inspect()).includes('OriginalA'));
 }finally{f.close();}
});
test('existing slot enters through main5/6 with exact field15/17/2 values, result keyword and connected-before-timeout order',()=>{
 const f=flow();try{assert.equal(menu(f).state,'choosing');const selected=f.core.select(1);assert.equal(selected.nativeMainPhase,5);let step=f.core.advance(1000);assert.equal(step.effect.kind,'native-entry-reset-boundary');assert.equal(step.commands.length,0);step=f.core.advance(1000);assert.deepEqual(step.commands[0],{operationId:'send-004f8650',arguments:[502,2,33001]});assert.equal(step.snapshot.nativeAckState,1);assert.equal(step.snapshot.nativeResult,0);
 f.core.observe('receive-00567c40',[ascii('successful\0ignored'),ascii('unused')]);assert.equal(f.core.inspect().nativeGameFlag,true);assert.equal(f.core.inspect().sourceEnterComplete,false);assert.equal(f.core.advance(700001,false).snapshot.state,'waiting-entry');assert.equal(f.core.advance(700001,true).snapshot.state,'entered');assert.equal(f.core.inspect().nativeMainPhase,9);assert.equal(f.core.inspect().officialAcceptance,'unverified');assert.equal(f.core.advance(700002).commands.length,0);
 }finally{f.close();}
});
test('list timeout600001 uses unsigned subtraction, while already received success takes precedence even past the deadline',()=>{
 for(const origin of [0,0xfffffff0]){const f=flow();try{query(f,origin);assert.equal(f.core.advance((origin+600000)>>>0).snapshot.state,'listing');assert.equal(f.core.advance((origin+600001)>>>0).snapshot.nativeResult,-1);assert.equal(f.core.inspect().errorCode,'LEGACY_CHARACTER_LIST_TIMEOUT');}finally{f.close();}
 const g=flow();try{query(g,origin);g.core.observe('receive-00567c3c',[0,b(vectors.flow.bodyHex)]);assert.equal(g.core.advance((origin+600001)>>>0).snapshot.nativeSubphase,9);assert.equal(g.core.inspect().nativeResult,1);}finally{g.close();}}
});
test('OUTOFSERVICE case sensitivity/full status and empty successful roster preserve distinct source outcomes',()=>{
 for(const[status,text,expected]of [[1,'OUTOFSERVICE',-3],[1,'outofservice',-2],[65536,'Other',-2]]){const f=flow();try{query(f);f.core.observe('receive-00567c3c',[status,ascii(text)]);assert.equal(f.core.advance(1001).snapshot.nativeResult,expected);}finally{f.close();}}
 const f=flow();try{assert.equal(menu(f,{body:''}).state,'choosing');assert.equal(f.core.inspect().presentSlots,0);assert.throws(()=>f.core.select(0),err('LEGACY_CHARACTER_EMPTY_SLOT'));}finally{f.close();}
});
test('entry failed keyword remains rejection; pending entry timeout is paused by disconnected source flag',()=>{
 for(const word of ['Successful','0','failed','successful ']){const f=flow();try{menu(f);f.core.select(0);f.core.advance(1000);f.core.advance(1000);f.core.observe('receive-00567c40',[ascii(word),ascii('Original denial')]);assert.equal(f.core.advance(1001).snapshot.errorCode,'LEGACY_CHARACTER_ENTER_REJECTED');assert.equal(f.core.inspect().nativeResult,-2);}finally{f.close();}}
 const f=flow();try{menu(f);f.core.select(0);f.core.advance(1000);f.core.advance(1000);assert.equal(f.core.advance(601001,false).snapshot.state,'waiting-entry');assert.equal(f.core.advance(601001,true).snapshot.errorCode,'LEGACY_CHARACTER_ENTER_TIMEOUT');}finally{f.close();}
});
test('content guard uses observed byte category and latches auxiliary option only at source subphase9',()=>{
 const blocked=flow(3);try{assert.equal(menu(blocked).state,'blocked-content');assert.equal(blocked.core.inspect().nativeSubphase,19);assert.throws(()=>blocked.core.select(0),err('LEGACY_CHARACTER_NOT_SELECTABLE'));}finally{blocked.close();}
 const bypass=flow(-1);try{assert.equal(menu(bypass,{category:257}).state,'choosing');assert.equal(bypass.core.inspect().category,1);assert.equal(bypass.core.inspect().nativeAuxiliaryOption,false);}finally{bypass.close();}
 const latched=flow(3);try{menu(latched,{category:5});assert.equal(latched.core.inspect().nativeAuxiliaryOption,true);latched.core.observe('receive-00567c20',[3]);assert.equal(latched.core.inspect().nativeAuxiliaryOption,true);}finally{latched.close();}
});
test('ownership, invalid input, slot bounds and closed borrowed graphics do not mutate source arrays or expose names in metadata',()=>{
 const f=flow();try{assert.throws(()=>f.core.advance(0),err('LEGACY_CHARACTER_NOT_STARTED'));assert.equal(f.core.observe('receive-00567c3c',[null,null]),true);menu(f);const copy=f.core.copySlots();f.core.close();assert.equal(Buffer.from(copy[0].nameBytes).toString(),'OriginalA');assert.equal(f.core.inspect().presentSlots,0);assert.throws(()=>f.core.copySlots(),err('LEGACY_CHARACTER_CLOSED'));assert.equal(api.detectLegacyGameCharacterContent(f.graphics),4);wipe(copy);}finally{f.close();}
 assert.throws(()=>api.createLegacyGameCharacterFlow({graphics:{}}));for(const value of [new Uint8Array(32761),new Uint8Array(new SharedArrayBuffer(20)),null])assert.throws(()=>api.decodeLegacyGameCharacterList(value),api.LegacyGameCharacterError);
 const g=flow();try{menu(g);for(const n of [-1,2,0.1,Infinity])assert.throws(()=>g.core.select(n),api.LegacyGameCharacterError);}finally{g.close();}
});
test('unsolicited/duplicate entry acknowledgements and invalid argument getters cannot manufacture source entry',()=>{
 const f=flow();try{assert.equal(f.core.observe('receive-00567c40',[null,null]),true);assert.equal(f.core.inspect().sourceEnterComplete,false);query(f);let read=0;const a=[];Object.defineProperty(a,0,{get(){read++;return 0;}});a[1]=ascii('');assert.throws(()=>f.core.observe('receive-00567c3c',a),err('LEGACY_CHARACTER_ARGUMENTS'));assert.equal(read,0);assert.equal(f.core.inspect().nativeAckState,1);}finally{f.close();}
});
