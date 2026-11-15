import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createLauncherFirstConfigPlan,interpretLauncherFirstConfigOutcome} from '../launcher-first-config.mjs';
const fixture=JSON.parse(await readFile(new URL('../../analysis/launcher-v30/original-first-config-vectors.json',import.meta.url)));
const bytes=hex=>Uint8Array.from(Buffer.from(hex,'hex')),hex=value=>Buffer.from(value).toString('hex');
const input=row=>({usernameBytes:bytes(row.input.username_hex),codeTextBytes:bytes(row.input.codeText_hex),directoryBytes:bytes(row.input.directory_hex),configurerBytes:bytes(row.input.configurer_hex),firstConfigWord:row.input.firstConfigWord});
const example=()=>input(fixture.vectors.find(row=>row.expected.disposition==='configuration-requested'));
test('all24 independent original first-Config producer vectors match exact section/key/command/cwd bytes',()=>{
 assert.equal(fixture.vectors.length,24);
 for(const row of fixture.vectors){const p=createLauncherFirstConfigPlan(input(row));assert.equal(p.disposition,row.expected.disposition,row.name);assert.equal(hex(p.lookup.sectionBytes),row.expected.section_hex);assert.equal(hex(p.lookup.keyBytes),row.expected.key_hex);assert.equal(hex(p.commandLineBytes),row.expected.command_hex);assert.equal(hex(p.workingDirectoryBytes),row.expected.cwd_hex);}
});
test('all9 independent outcome vectors distinguish skips, create failure, wait and post-wait write intent',()=>{
 for(const row of fixture.outcomes){const p=interpretLauncherFirstConfigOutcome(row.input);for(const key of Object.keys(row.expected))assert.deepEqual(p[key],row.expected[key]);assert.equal(p.authentication,'unverified');assert.equal(p.profileWrites,'not-performed');assert.equal(p.configurationVerified,'unverified');}
});
test('native wait result/exit and writer result are not invented success gates',()=>{
 let touched=false;const value={planDisposition:'configuration-requested',processCreated:true,waitReturned:true,get waitResultWord(){touched=true;throw Error();},get processExitCode(){touched=true;throw Error();}};
 const p=interpretLauncherFirstConfigOutcome(value);assert.equal(touched,false);assert.equal(p.writeValue,0);assert.equal(p.waitResultChecked,false);assert.equal(p.processExitCodeChecked,false);assert.equal(p.writeResultChecked,false);
 assert.equal(interpretLauncherFirstConfigOutcome({planDisposition:'configuration-requested',processCreated:false}).continueContextPreparation,true);
});
test('lookup is account-derived MD5 section and raw Code key, not a license section or authentication',()=>{
 const p=createLauncherFirstConfigPlan({...example(),usernameBytes:new Uint8Array(),codeTextBytes:bytes('30303131')});assert.equal(Buffer.from(p.lookup.sectionBytes).toString(),'d41d8cd98f00b204e9800998ecf8427e\0');assert.equal(Buffer.from(p.lookup.keyBytes).toString(),'Game0011_Config\0');assert.equal(p.lookup.defaultWord,1);assert.equal(p.lookup.accountDerived,true);assert.equal(Object.hasOwn(p,'usernameBytes'),false);assert.equal(p.execution,'not-performed');
});
test('owned outputs preserve raw unquoted slash and spacing without mutating input',()=>{
 const value=example(),before=structuredClone(value),p=createLauncherFirstConfigPlan(value);assert.deepEqual(value,before);value.directoryBytes.fill(8);value.usernameBytes.fill(9);assert.equal(p.quoting,'native-raw-unquoted');assert.equal(hex(p.commandLineBytes),createLauncherFirstConfigPlan(before).commandLineBytes.reduce((a,b)=>a+b.toString(16).padStart(2,'0'),''));
 const other=createLauncherFirstConfigPlan(before);p.lookup.sectionBytes.fill(0);assert.ok(other.lookup.sectionBytes.some(x=>x!==0));assert.equal(p.applicationName,null);assert.equal(p.inheritHandles,false);assert.equal(p.waitTimeoutWord,0xffffffff);
});
test('actual byte ownership rejects shared memory, fake fields and embedded NUL without invoking getters',()=>{
 let touched=false;const wrong=example();Object.defineProperty(wrong,'usernameBytes',{get(){touched=true;return bytes('61');}});assert.throws(()=>createLauncherFirstConfigPlan(wrong),{code:'FIRST_CONFIG_INPUT'});assert.equal(touched,false);
 for(const raw of [{},new DataView(new ArrayBuffer(1)),new Uint8Array(new SharedArrayBuffer(1))])assert.throws(()=>createLauncherFirstConfigPlan({...example(),usernameBytes:raw}),{code:'FIRST_CONFIG_INPUT'});
 for(const field of ['usernameBytes','codeTextBytes','directoryBytes','configurerBytes'])assert.throws(()=>createLauncherFirstConfigPlan({...example(),[field]:Uint8Array.of(1,0,2)}),{code:'FIRST_CONFIG_NUL'});
});
test('explicit numeric and byte budgets reject unsupported profile inputs',()=>{
 for(const extra of [{usernameBytes:new Uint8Array(17).fill(1)},{directoryBytes:new Uint8Array(4097).fill(1)},{configurerBytes:new Uint8Array(4097).fill(1)}])assert.throws(()=>createLauncherFirstConfigPlan({...example(),...extra}),{code:'FIRST_CONFIG_BUDGET'});
 for(const firstConfigWord of [-1,0x100000000,'1',true,NaN])assert.throws(()=>createLauncherFirstConfigPlan({...example(),firstConfigWord}),{code:'FIRST_CONFIG_INPUT'});
 for(const codeTextBytes of [bytes('31'.repeat(11)),bytes('3135'),bytes('2b31')])assert.throws(()=>createLauncherFirstConfigPlan({...example(),codeTextBytes}),{code:'FIRST_CONFIG_INPUT'});
});
test('outcome requires explicit created/wait observations only on the relevant path',()=>{
 assert.throws(()=>interpretLauncherFirstConfigOutcome({planDisposition:'unknown'}),{code:'FIRST_CONFIG_STATE'});assert.throws(()=>interpretLauncherFirstConfigOutcome({planDisposition:'configuration-requested',processCreated:1}),{code:'FIRST_CONFIG_STATE'});
 assert.throws(()=>interpretLauncherFirstConfigOutcome({planDisposition:'configuration-requested',processCreated:true}),{code:'FIRST_CONFIG_INPUT'});
 let invoked=false;assert.equal(interpretLauncherFirstConfigOutcome({planDisposition:'flag-clear',get processCreated(){invoked=true;throw Error();}}).disposition,'not-requested');assert.equal(invoked,false);
});
