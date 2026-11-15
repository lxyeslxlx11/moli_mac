import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { createLauncherResourceSnapshot } from '../launcher-resources.mjs';
import { encodeLauncherResourceCacheRecord as encode,decodeLauncherResourceCacheRecord as decode,
  LAUNCHER_RESOURCE_CACHE_FORMAT as format,LauncherResourceCacheError } from '../launcher-resource-cache.mjs';
const vectors=JSON.parse(readFileSync(new URL('../../analysis/launcher-wechat-resource-cache-v1/original-vectors.json',import.meta.url)));
const bytes=hex=>Uint8Array.from(Buffer.from(hex,'hex')),hex=value=>Buffer.from(value).toString('hex');
const snapshot=row=>createLauncherResourceSnapshot({binding:row.binding,files:row.files.map(file=>({path:file.path,bytes:bytes(file.hex)}))});
const digest=value=>createHash('md5').update(value).digest('hex');
const release=resources=>{for(const file of resources.files)file.bytes.fill(0);};
const code=(fn,expected)=>assert.throws(fn,error=>error instanceof LauncherResourceCacheError&&error.code===expected);
function repack(original,change,textChange=value=>value){
  const old=new DataView(original.buffer,original.byteOffset),length=old.getUint32(16,true),parsed=JSON.parse(Buffer.from(original.subarray(48,48+length)).toString('ascii'));
  change(parsed);const meta=Buffer.from(textChange(JSON.stringify(parsed).replace(/[\u0080-\uffff]/g,c=>'\\u'+c.charCodeAt(0).toString(16).padStart(4,'0'))),'ascii');
  const payload=original.subarray(48+length),out=new Uint8Array(48+meta.length+payload.length),view=new DataView(out.buffer);out.set(original.subarray(0,32));
  view.setUint32(16,meta.length,true);out.set(meta,48);out.set(payload,48+meta.length);out.set(createHash('md5').update(out.subarray(0,32)).update(meta).digest(),32);return out;
}

test('independent Python resource records exactly encode/decode empty, binary, Unicode, source0/1 and maximum revision',()=>{
  for(const row of vectors.cases){const input=snapshot(row),before=structuredClone(input),record=encode({revision:row.revision,resources:input});
    assert.equal(hex(record),row.recordHex,row.name);assert.equal(digest(record),row.recordMd5);assert.deepEqual(input,before);
    const saved=decode(record);assert.equal(saved.revision,row.revision);assert.deepEqual(saved.resources,input);assert.equal(saved.trust,'unverified');release(input);release(saved.resources);}
});
test('complete original64MiB payload and32MiB file limits roundtrip without reducing the existing resource budget',()=>{
  const row=vectors.maximumBytes,files=row.files.map(file=>({path:file.path,bytes:new Uint8Array(file.length).fill(file.fill)}));
  const resources=createLauncherResourceSnapshot({binding:row.binding,files}),record=encode({revision:row.revision,resources});
  assert.equal(record.length,row.recordBytes);assert.equal(hex(record.subarray(0,48)),row.headerHex);assert.equal(digest(record),row.recordMd5);
  const decoded=decode(record);assert.equal(decoded.resources.files.length,2);
  for(let i=0;i<2;i++){assert.equal(decoded.resources.files[i].bytes.length,33554432);assert.equal(digest(decoded.resources.files[i].bytes),row.files[i].md5);}
  for(const file of files)file.bytes.fill(0);release(resources);release(decoded.resources);record.fill(0);
});
test('all1024 maximum259-character paths fit the metadata record and another file is rejected',()=>{
  const row=vectors.maximumCount,files=Array.from({length:1024},(_,i)=>({path:'f'+String(i).padStart(4,'0')+'a'.repeat(250)+'.bin',bytes:new Uint8Array()}));
  const resources=createLauncherResourceSnapshot({binding:row.binding,files}),record=encode({revision:row.revision,resources});
  assert.equal(record.length,row.recordBytes);assert.equal(digest(record),row.recordMd5);assert.equal(decode(record).resources.files.length,1024);
  code(()=>encode({revision:1,resources:{...resources,files:[...resources.files,resources.files[0]]}}),'RESOURCE_RECORD_CANDIDATE');
});
test('header/revision/count/length/reserved/checksum/payload corruption fail before returning a resource snapshot',()=>{
  const original=bytes(vectors.cases[1].recordHex);
  for(const index of [0,28,31]){const bad=original.slice();bad[index]^=1;code(()=>decode(bad),'RESOURCE_RECORD_HEADER');}
  for(const revision of [0,-1,0x20000000000000,1.1,'1'])code(()=>encode({revision,resources:snapshot(vectors.cases[0])}),'RESOURCE_RECORD_REVISION');
  for(const [offset,value] of [[16,1048577],[20,67108865],[24,1025]]){const bad=original.slice();new DataView(bad.buffer).setUint32(offset,value,true);code(()=>decode(bad),'RESOURCE_RECORD_BUDGET');}
  const checksum=original.slice();checksum[32]^=1;code(()=>decode(checksum),'RESOURCE_RECORD_DIGEST');
  const payload=original.slice();payload[payload.length-1]^=1;code(()=>decode(payload),'RESOURCE_RECORD_CANDIDATE');
  code(()=>decode(original.subarray(0,original.length-1)),'RESOURCE_RECORD_BUDGET');
  const extra=new Uint8Array(original.length+1);extra.set(original);code(()=>decode(extra),'RESOURCE_RECORD_BUDGET');
});
test('resigned malformed metadata cannot normalize paths, source bindings, schema, digests or noncanonical JSON into acceptance',()=>{
  const original=bytes(vectors.cases[1].recordHex);
  for(const change of [m=>{m.extra=true;},m=>{m.files[0].secret='forbidden';}])code(()=>decode(repack(original,change)),'RESOURCE_RECORD_FORMAT');
  for(const change of [m=>{m.schema='unknown';},m=>{m.files[0].path='../escape';},m=>{m.files[1].path='data/A.bin';},
    m=>{m.files[0].md5='0'.repeat(32);},m=>{m.binding.patchSourceProfile='puk3-195f3afd';m.binding.patchSourceOrdinal=1;}])
    code(()=>decode(repack(original,change)),'RESOURCE_RECORD_CANDIDATE');
  code(()=>decode(repack(original,()=>{},text=>' '+text)),'RESOURCE_RECORD_FORMAT');
  code(()=>decode(repack(original,()=>{},text=>text.replace('{','{"schema":"ignored",'))),'RESOURCE_RECORD_FORMAT');
  code(()=>decode(repack(original,m=>{m.files[0].length=33554433;})),'RESOURCE_RECORD_BUDGET');
});
test('resource records own every output and reject accessors, extra fields, shared, detached and fake byte storage',()=>{
  const row=vectors.cases[1],input=snapshot(row),record=encode({revision:1,resources:input}),first=decode(record),second=decode(record);
  first.resources.files[0].bytes.fill(3);record.fill(0);assert.equal(hex(second.resources.files[0].bytes),row.files[0].hex);assert.equal(hex(input.files[0].bytes),row.files[0].hex);
  let reads=0;code(()=>encode({revision:1,get resources(){reads++;return input;}}),'RESOURCE_RECORD_INPUT');assert.equal(reads,0);
  code(()=>encode({revision:1,resources:input,extra:1}),'RESOURCE_RECORD_INPUT');
  const detached=bytes(row.recordHex);structuredClone(detached.buffer,{transfer:[detached.buffer]});
  for(const value of [detached,new Uint8Array(new SharedArrayBuffer(60)),new Proxy(bytes(row.recordHex),{}),{},null])code(()=>decode(value),'RESOURCE_RECORD_INPUT');
  code(()=>decode(new Uint8Array(format.recordBytes+1)),'RESOURCE_RECORD_BUDGET');
  release(input);release(first.resources);release(second.resources);
});
