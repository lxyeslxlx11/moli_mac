import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { importLauncherResourceArchive as unpack } from '../launcher-resource-import.mjs';
const fixture=JSON.parse(readFileSync(new URL('../../analysis/launcher-wechat-patch-v1/original-resources.json',import.meta.url))),bytes=hex=>Uint8Array.from(Buffer.from(hex,'hex'));
test('original Python ZIP pack import owns files, merges nonconflicting batches and never mutates caller input',()=>{
  const pack=bytes(fixture.cases.base),base=unpack(pack,[]),copy=base.map(row=>({path:row.path,bytes:row.bytes.slice()}));
  pack.fill(0);assert.equal(Buffer.from(base[0].bytes).toString(),'original base');
  const combined=unpack(bytes(fixture.cases.extra),base);assert.equal(combined.length,2);assert.deepEqual(base,copy);
  combined[0].bytes.fill(0);assert.equal(Buffer.from(base[0].bytes).toString(),'original base');
});
test('resource ZIP import retains exact path/tree/CRC/entry policies and rejects aliases instead of overwriting',()=>{
  const base=unpack(bytes(fixture.cases.base),[]);
  for(const name of ['duplicate','unsafe','file-shadow','directory-shadow','too-many'])assert.throws(()=>unpack(bytes(fixture.cases[name]),base));
  const broken=bytes(fixture.cases.extra);broken[40]^=1;assert.throws(()=>unpack(broken,base));assert.equal(Buffer.from(base[0].bytes).toString(),'original base');
  assert.throws(()=>unpack(bytes(fixture.cases.extra),[{path:'Assets',bytes:Uint8Array.of(1)}]));
});
test('multiple64-entry resource packs reach the existing1024-file base limit, and the next batch is rejected',()=>{
  let files=[];for(let i=0;i<16;i++)files=unpack(bytes(fixture.batches[i]),files);assert.equal(files.length,1024);
  assert.throws(()=>unpack(bytes(fixture.batches[16]),files),error=>error.code==='PATCH_BUDGET');assert.equal(files.length,1024);
});
