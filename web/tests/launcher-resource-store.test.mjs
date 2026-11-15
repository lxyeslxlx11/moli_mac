import test from 'node:test';
import assert from 'node:assert/strict';
import {createLauncherResourceStore} from '../launcher-resource-store.mjs';
import {createLauncherResourceSnapshot} from '../../shared/launcher-resources.mjs';
import {createLauncherPatchState} from '../launcher-patch-state.mjs';
const binding=()=>({gameListMd5:'a'.repeat(32),regionListMd5:'b'.repeat(32),gameOrdinal:0,referenceOrdinal:0,regionOrdinal:0,gameCodeText:'0011',directoryText:'C:\\Original',pathEncoding:'ascii'});
const resources=()=>createLauncherResourceSnapshot({binding:binding(),files:[{path:'Bin/base.bin',bytes:Uint8Array.of(0,1,255)}]});
test('resource cache profile/factory validation and bounded cancellation require no IDB open',async()=>{
 for(const profile of ['', '../escape','a'.repeat(33)])assert.throws(()=>createLauncherResourceStore({profile,indexedDB:{open(){throw Error();}}}));
 assert.throws(()=>createLauncherResourceStore({profile:'original',indexedDB:null}),{code:'RESOURCE_CACHE_UNAVAILABLE'});
 let calls=0;const store=createLauncherResourceStore({profile:'original',indexedDB:{open(){calls++;throw Error('private fixture detail');}}});
 for(const options of [{timeoutMs:0},{timeoutMs:60001},{signal:{}}])await assert.rejects(store.read(options),{code:'RESOURCE_CACHE_INPUT'});
 const c=new AbortController();c.abort();await assert.rejects(store.read({signal:c.signal}),{code:'RESOURCE_CACHE_ABORTED'});
 await assert.rejects(store.commitResources(resources(),{expectedRevision:-1}),{code:'RESOURCE_CACHE_INPUT'});
 const broken=structuredClone(resources());broken.files[0].bytes[0]=7;await assert.rejects(store.commitResources(broken,{expectedRevision:0}),{code:'RESOURCE_CACHE_CANDIDATE'});assert.equal(calls,0);
 await assert.rejects(store.read(),e=>e.code==='RESOURCE_CACHE_STORAGE'&&!e.message.includes('private'));assert.equal(calls,1);
});
test('patch restoration is review-only, byte-owned and exact-binding checked',()=>{
 const original=resources(),state=createLauncherPatchState();assert.throws(()=>state.copySelectedResources());
 const restored=state.restore(original,binding());assert.equal(restored.state,'ready');assert.equal(restored.reason,'cache');assert.equal(state.selectedPaths(),null);original.files[0].bytes.fill(9);
 state.choose();const selected=state.copySelectedResources();assert.deepEqual([...selected.files[0].bytes],[0,1,255]);selected.files[0].bytes.fill(8);assert.deepEqual([...state.copySelectedResources().files[0].bytes],[0,1,255]);
 state.reset();assert.equal(state.snapshot().hasCandidate,false);assert.deepEqual([...selected.files[0].bytes],[8,8,8]);
 state.restore(resources(),{...binding(),directoryText:'C:\\Other'});assert.equal(state.snapshot().state,'failed');assert.equal(state.snapshot().errorCode,'RESOURCE_BINDING');assert.equal(state.selectedPaths(),null);
});
test('restore errors invalidate any older choice instead of preserving stale readiness',()=>{
 const state=createLauncherPatchState();state.restore(resources(),binding());state.choose();
 const bad=structuredClone(resources());bad.files[0].md5='0'.repeat(32);state.restore(bad,binding());assert.equal(state.snapshot().state,'failed');assert.equal(state.selectedPaths(),null);assert.equal(state.snapshot().hasCandidate,false);
});
test('resource cache open deadline and actual abort settle without an unresolved provider',async()=>{
 let calls=0;const factory={open(){calls++;return{};}},store=createLauncherResourceStore({profile:'deadline',indexedDB:factory});
 factory.open=()=>{throw Error('Changed open must not be called');};
 await assert.rejects(store.read({timeoutMs:5}),{code:'RESOURCE_CACHE_TIMEOUT'});
 const controller=new AbortController(),task=store.read({signal:controller.signal});controller.abort();await assert.rejects(task,{code:'RESOURCE_CACHE_ABORTED'});assert.equal(calls,2);
});
