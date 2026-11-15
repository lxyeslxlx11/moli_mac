import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import * as api from '../../shared/index.mjs';
import { contentGraphics } from '../../analysis/game-post-login-v1/original_assets.mjs';
import { harness,sourceReady,flush,bytes,ascii,plain } from './helpers/legacy-game-session-fixture.mjs';
import { LegacyGameSessionError } from '../legacy-game-session.mjs';
const v=JSON.parse(readFileSync(new URL('../../analysis/game-post-login-v1/original-vectors.json',import.meta.url))),r=v.flow.replies;
const error=code=>e=>e instanceof LegacyGameSessionError&&e.code===code;
function setup({generation=4,...options}={}){const graphics=contentGraphics(api,generation),f=harness({...options,settings:{...options.settings,postLogin:{graphics}}});return{...f,graphics,get stats(){return f.stats;},async dispose(){f.close();graphics.close();},get tick(){return f.tick;},set tick(value){f.tick=value;}};}
async function listing(f){await sourceReady(f);f.fire();await flush();f.fire();await flush();assert.equal(f.writes.length,2);assert.equal(Buffer.from(f.writes[1]).toString('hex'),v.flow.requests.list.frameHex);}
async function menu(f,{reply='list',category=true}={}){await listing(f);if(category)f.offer(bytes(r.category.frameHex));await flush();f.offer(bytes(r[reply].frameHex));await flush();for(let i=0;i<15&&f.session.inspect().characters.state!=='choosing'&&f.session.inspect().state!=='failed';i++){f.fire();await flush();}return f.session.charactersReady;}
async function selecting(f,slot=0){await menu(f);const pending=f.session.enterCharacter(slot);f.fire();await flush();f.fire();await flush();assert.equal(f.writes.length,3);assert.equal(Buffer.from(f.writes[2]).toString('hex'),v.flow.requests['enter'+slot].frameHex);return{pending};}

test('opt-in stream owns source list and copied records, blocks gameplay until entry and emits exact three numeric fields',async()=>{
 const f=setup();try{const ready=await menu(f);assert.equal(ready.state,'ready');assert.equal(ready.characters.state,'choosing');assert.equal(ready.sourceCharacterEntered,false);const slots=f.session.copyCharacters();assert.equal(Buffer.from(slots[0].nameBytes).toString(),'OriginalA');slots.forEach(x=>{x.nameBytes.fill(0);x.field16Bytes.fill(0);x.recordBytes.fill(0);});assert.equal(f.session.copyCharacters()[0].present,true);
 await assert.rejects(f.session.sendCommand('send-004f6710',[1,2]),error('LEGACY_SESSION_GAME_NOT_ENTERED'));const pending=f.session.enterCharacter(0);f.fire();await flush();f.fire();await flush();assert.equal(Buffer.from(f.writes[2]).toString('hex'),v.flow.requests.enter0.frameHex);f.offer(bytes(r.entered.frameHex));await flush();assert.equal(f.session.inspect().sourceCharacterEntered,false);f.fire();await flush();assert.equal((await pending).sourceCharacterEntered,true);assert.equal(f.timers.size,0);await f.session.sendCommand('send-004f6710',[1,2]);assert.equal(Buffer.from(bytes(plain(f.writes[3]))).toString(),'#Mi 1 2 ');assert.equal(f.packets.length,1);assert.equal(JSON.stringify(f.states).includes('OriginalA'),false);assert.equal(JSON.stringify(f.states).includes('Original label'),false);
 }finally{await f.dispose();}
});
test('choosing the second existing slot sends field15/17/2 rather than its ordinal or name',async()=>{
 const f=setup();try{const{pending}=await selecting(f,1);f.offer(bytes(r.entered.frameHex));await flush();f.fire();await flush();assert.equal((await pending).characters.selectedSlot,1);assert.equal(f.session.inspect().characters.nativeMainPhase,9);assert.equal(f.session.inspect().officialAuthentication,'unverified');}finally{await f.dispose();}
});
test('duplicate list/enter replies cannot replace slots, replay requests or enter twice',async()=>{
 const f=setup();try{await menu(f);f.offer(bytes(r.listEmpty.frameHex));await flush();assert.equal(f.session.inspect().characters.presentSlots,2);const pending=f.session.enterCharacter(0);f.fire();await flush();f.fire();await flush();f.offer(bytes(r.entered.frameHex));await flush();f.offer(bytes(r.entryDenied.frameHex));await flush();f.fire();await flush();assert.equal((await pending).sourceCharacterEntered,true);assert.equal(f.writes.length,3);assert.equal(f.session.inspect().characters.ignoredReplies,2);await assert.rejects(f.session.enterCharacter(1),error('LEGACY_CHARACTER_NOT_SELECTABLE'));assert.equal(f.writes.length,3);}finally{await f.dispose();}
});
test('OUTOFSERVICE list failure terminates stream, clears owned roster and resolves every waiting promise',async()=>{
 const f=setup();try{await listing(f);f.offer(bytes(r.listUnavailable.frameHex));await flush();f.fire();await flush();const row=await f.session.charactersReady;assert.equal(row.errorCode,'LEGACY_CHARACTER_OUT_OF_SERVICE');assert.equal(row.characters.nativeResult,-3);assert.equal(row.characters.presentSlots,0);assert.equal((await f.session.characterEntered).state,'failed');assert.equal((await f.session.done).pendingWriteBytes,0);assert.equal(f.stats.closeCalls,1);}finally{await f.dispose();}
});
test('missing required content refuses selection and never sends entry, while byte category1 permits its observed bypass branch',async()=>{
 const f=setup({generation:3});try{const row=await menu(f);assert.equal(row.errorCode,'LEGACY_CHARACTER_CONTENT');assert.equal(row.characters.nativeSubphase,19);assert.equal(f.writes.length,2);assert.equal(f.stats.closeCalls,1);}finally{await f.dispose();}
 const g=setup({generation:-1});try{await listing(g);const c=api.createLegacyGamePayloadCodec(bytes(v.bootstrap.keyHex));let wire;try{wire=api.encodeLegacyGameEnvelope(c.encode(ascii('Wb^ 49 ')));}finally{c.close();}g.offer(wire);await flush();g.offer(bytes(r.list.frameHex));await flush();for(let i=0;i<4;i++){g.fire();await flush();}assert.equal((await g.session.charactersReady).characters.category,1);assert.equal(g.session.inspect().characters.state,'choosing');}finally{await g.dispose();}
});
test('list timeout remains600001 after source login; the old20001 login deadline is not reused',async()=>{
 const f=setup();try{await listing(f);const origin=f.tick;f.tick=(origin+20000)>>>0;f.fire();await flush();assert.equal(f.session.inspect().state,'ready');assert.equal(f.session.inspect().characters.state,'listing');f.tick=(origin+599999)>>>0;f.fire();await flush();assert.equal(f.session.inspect().state,'ready');f.fire();await flush();assert.equal((await f.session.done).errorCode,'LEGACY_CHARACTER_LIST_TIMEOUT');assert.equal(f.writes.length,2);}finally{await f.dispose();}
});
test('cancel while query/entry write is pending clears bytes, stops timers and settles completion without retry',async()=>{
 let writes=0,resolveWrite;const f=setup({write:()=>{writes++;return writes===2?new Promise(r=>{resolveWrite=r;}):Promise.resolve();}});try{await listing(f);const raw=f.writeRefs[1],stale=f.allTimers.at(-1);assert.ok(raw.some(b=>b!==0));f.session.close();const end=await f.session.characterEntered;assert.equal(end.state,'closed');assert.equal(raw.every(b=>b===0),true);assert.equal(end.characters.presentSlots,0);assert.equal((await f.session.charactersReady).state,'closed');resolveWrite();stale.fn();await flush();assert.equal(f.writes.length,2);assert.equal(f.session.inspect().pendingWriteBytes,0);}finally{await f.dispose();}
});
test('server entry denial never releases gameplay commands or exposes returned text',async()=>{
 const f=setup();try{const{pending}=await selecting(f);f.offer(bytes(r.entryDenied.frameHex));await flush();f.fire();await flush();const end=await pending;assert.equal(end.errorCode,'LEGACY_CHARACTER_ENTER_REJECTED');assert.equal(end.sourceCharacterEntered,false);assert.equal(end.characters.nativeResult,-2);assert.equal(end.characters.errorDetailBytes,15);assert.equal(JSON.stringify(end).includes('Original denial'),false);assert.equal(f.writes.length,3);await assert.rejects(f.session.sendCommand('send-004f6710',[1,2]),error('LEGACY_SESSION_NOT_READY'));}finally{await f.dispose();}
});
test('empty roster and selection bounds cannot generate an entry request',async()=>{
 const f=setup();try{await menu(f,{reply:'listEmpty'});await assert.rejects(f.session.enterCharacter(0),error('LEGACY_CHARACTER_EMPTY_SLOT'));await assert.rejects(f.session.enterCharacter(2),error('LEGACY_CHARACTER_INTEGER'));assert.equal(f.writes.length,2);assert.equal(f.session.inspect().characters.state,'choosing');}finally{await f.dispose();}
});
test('owned character-control commands cannot be manually replayed after source entry',async()=>{
 const f=setup();try{const{pending}=await selecting(f);f.offer(bytes(r.entered.frameHex));await flush();f.fire();await flush();await pending;for(const[id,args]of [['send-004f86e0',[]],['send-004f8650',[501,1,30000]]])await assert.rejects(f.session.sendCommand(id,args),error('LEGACY_SESSION_CHARACTER_REPLAY'));assert.equal(f.writes.length,3);}finally{await f.dispose();}
});
test('borrowed catalog closure fails pending content preparation without closing world or retaining names',async()=>{
 const f=setup();try{await listing(f);f.offer(bytes(r.category.frameHex));await flush();f.offer(bytes(r.list.frameHex));await flush();f.graphics.close();f.fire();await flush();f.fire();await flush();const row=await f.session.done;assert.equal(row.state,'failed');assert.equal(row.characters.presentSlots,0);assert.equal(f.world.inspect().state,'open');assert.equal(f.writes.length,2);}finally{await f.dispose();}
});
test('first-entry policy rejects a previously active world projection instead of silently resetting source state',async()=>{
 const f=setup();try{await menu(f);const scene=JSON.parse(readFileSync(new URL('../../analysis/game-legacy-scene-frame-v1/original-vectors.json',import.meta.url))),codec=api.createLegacyGamePayloadCodec(bytes(v.bootstrap.keyHex));let wire;try{wire=api.encodeLegacyGameEnvelope(codec.encode(bytes(scene.protocol.beforePlainHex[1])));}finally{codec.close();}f.offer(wire);await flush();assert.notEqual(f.world.copyScene(),null);await assert.rejects(f.session.enterCharacter(0),error('LEGACY_SESSION_CHARACTER_WORLD'));assert.equal(f.writes.length,2);assert.equal(f.session.inspect().characters.state,'choosing');}finally{await f.dispose();}
});
test('observer closure at entry completion resolves a closed snapshot instead of announcing a live game connection',async()=>{
 let session;const f=setup({onState:s=>{if(s.sourceCharacterEntered&&s.state==='ready')session.close();}});session=f.session;
 try{const{pending}=await selecting(f);f.offer(bytes(r.entered.frameHex));await flush();f.fire();await flush();const row=await pending;assert.equal(row.state,'closed');assert.equal(row.sourceCharacterEntered,true);assert.equal(f.session.inspect().state,'closed');assert.equal(f.timers.size,0);assert.equal(f.writes.length,3);}finally{await f.dispose();}
});
