import test from 'node:test';
import assert from 'node:assert/strict';
import {createLauncherResourceSnapshot,readLauncherResourceSnapshot,snapshotLauncherResourceBinding,launcherResourceBindingKey} from '../launcher-resources.mjs';
const binding=()=>({gameListMd5:'a'.repeat(32),regionListMd5:'b'.repeat(32),gameOrdinal:0,referenceOrdinal:1,regionOrdinal:2,gameCodeText:'0011',directoryText:'C:\\Original',pathEncoding:'ascii'});
const input=()=>({binding:binding(),files:[{path:'Bin/base.bin',bytes:Uint8Array.of(0,1,255)},{path:'empty',bytes:new Uint8Array()}]});
test('resource format owns payloads and preserves exact original Code and optional Galaxy identity',()=>{
 const value=input(),copy=createLauncherResourceSnapshot(value);value.files[0].bytes.fill(7);value.binding.gameCodeText='3';
 assert.deepEqual([...copy.files[0].bytes],[0,1,255]);assert.equal(copy.files[0].md5,'ffbb8cd5a232b7d906904533e9609f48');assert.equal(copy.binding.gameCodeText,'0011');
 assert.equal(copy.files[1].md5,'d41d8cd98f00b204e9800998ecf8427e');assert.equal(copy.trust,'unverified');assert.equal(Object.isFrozen(copy.files),true);
 const restored=readLauncherResourceSnapshot(structuredClone(copy));assert.deepEqual(restored,copy);restored.files[0].bytes.fill(8);assert.deepEqual([...copy.files[0].bytes],[0,1,255]);
 const grouped=snapshotLauncherResourceBinding({...binding(),galaxyOrdinal:3});assert.equal(grouped.galaxyOrdinal,3);assert.notEqual(launcherResourceBindingKey(grouped),launcherResourceBindingKey(binding()));
});
test('binding picks only declared non-secret fields and changes every identity component',()=>{
 let invoked=false;const raw={...binding(),gameName:'Original A',password:'not copied'};Object.defineProperty(raw,'unused',{get(){invoked=true;throw Error();}});
 const fixed=snapshotLauncherResourceBinding(raw);assert.equal(invoked,false);assert.equal(Object.hasOwn(fixed,'password'),false);assert.equal(Object.hasOwn(fixed,'gameName'),false);
 for(const delta of [{gameListMd5:'c'.repeat(32)},{regionListMd5:'c'.repeat(32)},{gameOrdinal:3},{referenceOrdinal:3},{regionOrdinal:3},{gameCodeText:'11'},{directoryText:'C:\\Other'},{pathEncoding:'utf-8'},{galaxyOrdinal:0}])assert.notEqual(launcherResourceBindingKey(binding()),launcherResourceBindingKey({...binding(),...delta}));
});
test('invalid binding fields and accessors are rejected without coercion',()=>{
 for(const delta of [{gameListMd5:'A'.repeat(32)},{regionListMd5:'x'},{gameOrdinal:-1},{referenceOrdinal:1.5},{regionOrdinal:0x80000000},{gameCodeText:'15'},{gameCodeText:'11x'},{pathEncoding:'guess'},{directoryText:'../x'},{galaxyOrdinal:-1}])assert.throws(()=>snapshotLauncherResourceBinding({...binding(),...delta}));
 let invoked=false;const value=binding();Object.defineProperty(value,'gameCodeText',{get(){invoked=true;return'11';}});assert.throws(()=>snapshotLauncherResourceBinding(value));assert.equal(invoked,false);
});
test('format rejects case aliases, traversal and file/directory conflicts; empty snapshots supported',()=>{
 for(const paths of [['Bin/a','bin/A'],['../a'],['a','a/b'],['CON.bin']])assert.throws(()=>createLauncherResourceSnapshot({binding:binding(),files:paths.map(path=>({path,bytes:new Uint8Array()}))}));
 const value=createLauncherResourceSnapshot({binding:binding(),files:[]});assert.deepEqual(readLauncherResourceSnapshot(value).files,[]);
});
test('stored format rejects stale digest, modified path, unknown fields and invented trust',()=>{
 const mutations=[v=>v.files[0].bytes.fill(4),v=>v.files[0].md5='0'.repeat(32),v=>v.files[0].path='Bin\\base.bin',v=>v.trust='verified',v=>v.schema='future',v=>v.extra=1,v=>v.files[0].extra=1,v=>v.binding.account='never admitted',v=>v.binding.directoryText='C:/Original',v=>v.binding.galaxyOrdinal=undefined];
 for(const mutate of mutations){const value=structuredClone(createLauncherResourceSnapshot(input()));mutate(value);assert.throws(()=>readLauncherResourceSnapshot(value));}
});
test('file metadata budgets, actual bytes and shared-memory exclusions apply before serialization',()=>{
 assert.throws(()=>createLauncherResourceSnapshot({binding:binding(),files:new Array(1025)}));
 assert.throws(()=>createLauncherResourceSnapshot({binding:binding(),files:[{path:'a',bytes:new Uint8Array(33554433)}]}),{code:'RESOURCE_BUDGET'});
 for(const bytes of [{},new DataView(new ArrayBuffer(1)),new Uint8Array(new SharedArrayBuffer(1))])assert.throws(()=>createLauncherResourceSnapshot({binding:binding(),files:[{path:'a',bytes}]}));
 const ab=Uint8Array.of(0,255).buffer;assert.deepEqual([...createLauncherResourceSnapshot({binding:binding(),files:[{path:'a',bytes:ab}]}).files[0].bytes],[0,255]);
});
