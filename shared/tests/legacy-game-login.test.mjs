import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createLegacyGameLogin,readLegacyGameHandoff,LegacyGameLoginError } from '../index.mjs';
const vectors=JSON.parse(await readFile(new URL('../../analysis/game-session-runtime-v1/original-vectors.json',import.meta.url)));
const ascii=s=>new Uint8Array(Buffer.from(s,'ascii')),bytes=h=>new Uint8Array(Buffer.from(h,'hex')),hex=b=>Buffer.from(b).toString('hex');
const input=()=>({mappingBytes:ascii('gid:OriginalG glt:OriginalT\0'),moduleDigestBytes:ascii(vectors.authentication.moduleDigest)});
const login=()=>createLegacyGameLogin(input());
const error=code=>e=>e instanceof LegacyGameLoginError&&e.code===code;

test('24 independent Python handoff cases preserve first-substring/C-whitespace/50-byte boundaries',()=>{
 for(const row of vectors.handoffs){const raw=bytes(row.mappingHex),saved=raw.slice();if(row.rejected)assert.throws(()=>readLegacyGameHandoff(raw),LegacyGameLoginError);else{const r=readLegacyGameHandoff(raw);assert.equal(hex(r.gidBytes),row.expected.gid);assert.equal(hex(r.gltBytes),row.expected.glt);r.gidBytes.fill(0);assert.equal(hex(r.gltBytes),row.expected.glt);}assert.deepEqual(raw,saved);}
});
test('131 independent source-poll traces/4315 states preserve ack gates, delayed success, WORD and uint32 deadlines',()=>{
 let count=0;
 for(const row of vectors.traces){const f=login();try{f.start(row.origin);f.connected();for(let i=0;i<row.events.length;i++){const e=row.events[i],expected=row.expected[i];let ignored;
  if(e.action==='bootstrap'){const c=f.bootstrap();ignored=c===null;if(c){assert.equal(c.operationId,'send-004f83d0');assert.deepEqual(c.arguments.map(hex),[hex(ascii(vectors.authentication.moduleDigest)),hex(ascii('OriginalT')),hex(ascii('OriginalG'))]);for(const raw of c.arguments)raw.fill(0);}}
  else if(e.action==='reply')ignored=!f.observeReply(e.status,bytes(e.detailHex));else f.poll(e.tick);
  const actual=f.inspect();for(const[k,v]of Object.entries(expected))if(k!=='ignored')assert.equal(actual[k],v,`trace${count} event${i} ${k}`);if(ignored!==undefined)assert.equal(ignored,expected.ignored);count++;
 }}finally{f.close();}}
 assert.equal(count,4315);
});
test('handoff/digest constructors reject accessors, detached/shared arrays and unsupported fingerprints without mutating inputs',()=>{
 let reads=0;const hostile={mappingBytes:input().mappingBytes,get moduleDigestBytes(){reads++;return ascii('a'.repeat(32));}};assert.throws(()=>createLegacyGameLogin(hostile),error('LEGACY_LOGIN_INPUT'));assert.equal(reads,0);
 for(const digest of ['x'.repeat(32),'A'.repeat(32),'a'.repeat(31),'a'.repeat(33)]){const row={...input(),moduleDigestBytes:ascii(digest)},saved=row.mappingBytes.slice();assert.throws(()=>createLegacyGameLogin(row),LegacyGameLoginError);assert.deepEqual(row.mappingBytes,saved);}
 const detached=ascii('gid:A glt:B\0');structuredClone(detached.buffer,{transfer:[detached.buffer]});assert.throws(()=>readLegacyGameHandoff(detached),LegacyGameLoginError);
 assert.throws(()=>readLegacyGameHandoff(new Uint8Array(new SharedArrayBuffer(12))),LegacyGameLoginError);
 const empty=createLegacyGameLogin({...input(),moduleDigestBytes:new Uint8Array()});empty.start(0);empty.connected();assert.equal(empty.bootstrap().arguments[0].length,0);empty.close();
});
test('successful reply prefix bounds and auxiliary tail are explicit, copied and cleared; invalid reply leaves ack pending',()=>{
 const f=login();try{f.start(0);f.connected();f.bootstrap();assert.throws(()=>f.observeReply(0,ascii('x'.repeat(128))),error('LEGACY_LOGIN_REPLY_PREFIX'));assert.equal(f.inspect().nativeAckState,1);
 const raw=ascii('x'.repeat(127)+'|unmodeled\0ignored');assert.equal(f.observeReply(0,raw),true);assert.equal(f.inspect().replyPrefixBytes,127);assert.equal(f.inspect().auxiliaryReplyUnmodeled,true);const copy=f.copyReply();copy.fill(0);assert.equal(f.copyReply().length,137);assert.equal(raw.at(-1),100);f.close();assert.equal(f.inspect().replyBytes,0);assert.equal(f.inspect().credentialsCleared,true);assert.throws(()=>f.copyReply(),error('LEGACY_LOGIN_CLOSED'));
 }finally{f.close();}
});
test('full status controls success even when low WORD0; busy is exact and duplicates cannot change status',()=>{
 for(const[status,detail,word]of [[65536,'busy',1234],[1,'Busy',1],[-1,'busy\0tail',1234],[-2147483648,'',0]]){const f=login();f.start(0);f.connected();f.bootstrap();assert.equal(f.observeReply(status,ascii(detail)),true);assert.equal(f.observeReply(0,ascii('duplicate')),false);assert.equal(f.inspect().statusWord,word);const r=f.poll(20001);assert.equal(r.errorCode,'LEGACY_LOGIN_REJECTED');assert.equal(r.nativeResult,-7);assert.equal(r.nativeOuterResult,-2);f.close();}
});
test('ownership and lifecycle keep returned command independent and never replay auth after bootstrap reset',()=>{
 const c=input(),f=createLegacyGameLogin(c);c.mappingBytes.fill(0);c.moduleDigestBytes.fill(0);assert.throws(()=>f.poll(0),error('LEGACY_LOGIN_NOT_STARTED'));assert.equal(f.observeReply('unread',null),false);f.start(100);assert.equal(f.connected(),true);assert.equal(f.connected(),false);const command=f.bootstrap();assert.equal(f.inspect().credentialsCleared,true);f.close();f.close();assert.equal(Buffer.from(command.arguments[1]).toString(),'OriginalT');command.arguments.forEach(a=>a.fill(0));assert.throws(()=>f.start(0),error('LEGACY_LOGIN_CLOSED'));
});
test('outer deadline equality differs from internal600001 and source phase99 success has priority',()=>{
 for(const[tick,result]of [[20000,0],[20001,0],[600000,0],[600001,-1]]){const f=login();f.start(0);f.connected();const r=f.poll(tick);assert.equal(r.nativeResult,result);assert.equal(r.nativeOuterResult,tick<20001?0:-2);f.close();}
 const f=login();f.start(0);f.connected();f.bootstrap();f.observeReply(0,ascii('Good'));for(let i=0;i<18;i++)f.poll(i);assert.equal(f.inspect().nativeStage,99);assert.equal(f.poll(600001).state,'accepted');assert.equal(f.inspect().officialAuthentication,'unverified');assert.equal(f.bootstrap(),null);f.close();
});
