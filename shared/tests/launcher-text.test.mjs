import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { encodeLauncherCredential as encode, decodeLauncherProfileName as decode, LauncherTextError } from '../launcher-text.mjs';
import { createLauncherLicenseIdentity, encodeLauncherLoginRequestFrame } from '../index.mjs';
const reference=JSON.parse(await readFile(new URL('../../analysis/launcher-v20/encoding-reference.json',import.meta.url)));
const options=encoding=>({encoding});
const bytes=(...value)=>Uint8Array.from(value);

test('explicit ASCII retains case/space and its legacy16-byte range',()=>{
 assert.deepEqual([...encode(' A a ',options('ascii'))],[32,65,32,97,32]);
 assert.equal(encode('A'.repeat(16),options('ascii')).length,16);
 assert.throws(()=>encode('',options('ascii')),{code:'TEXT_LENGTH',byteLength:0});
 assert.throws(()=>encode('A'.repeat(17),options('ascii')),{code:'TEXT_LENGTH',byteLength:17});
 assert.throws(()=>encode('中文',options('ascii')),{code:'TEXT_UNREPRESENTABLE'});
});
test('Windows936 uses byte count rather than JavaScript character count and never substitutes',()=>{
 assert.deepEqual([...encode('中文',options('windows-936'))],[0xd6,0xd0,0xce,0xc4]);
 assert.equal(encode('中'.repeat(8),options('windows-936')).length,16);
 assert.throws(()=>encode('中'.repeat(9),options('windows-936')),{code:'TEXT_LENGTH',byteLength:18});
 assert.throws(()=>encode('😀',options('windows-936')),{code:'TEXT_UNREPRESENTABLE'});
 assert.equal(decode(bytes(0x80),options('windows-936')),'€');
 assert.deepEqual([...encode('€',options('windows-936'))],[0x80]);
});
test('all21791 Windows936 double-byte mappings and2149 undefined pairs match independent Python gbk',()=>{
 let defined=0,unassigned=0;
 for(const group of reference.windows936_double_groups){
  const hash=createHash('sha256');let count=0,missing=0;
  for(let trail=0x40;trail<=0xfe;trail++){
   if(trail===0x7f)continue;
   const source=bytes(group.lead,trail);let text;
   try{text=decode(source,options('windows-936'));}catch(error){assert.equal(error.code,'TEXT_BYTES');missing++;continue;}
   assert.deepEqual(encode(text,options('windows-936')),source);assert.equal(text.length,1);
   const packed=Buffer.alloc(6);packed[0]=group.lead;packed[1]=trail;packed.writeUInt32BE(text.codePointAt(0),2);hash.update(packed);count++;
  }
  assert.equal(count,group.defined);assert.equal(missing,group.unassigned);assert.equal(hash.digest('hex'),group.sha256);defined+=count;unassigned+=missing;
 }
 assert.equal(defined,21791);assert.equal(unassigned,2149);
});
test('UTF8 covers1037 independent Python scalar vectors including astral, BOM and boundaries',()=>{
 const hash=createHash('sha256');
 for(const point of reference.utf8_scalar_points){const text=String.fromCodePoint(point),encoded=encode(text,options('utf-8'));assert.equal(decode(encoded,options('utf-8')),text);const header=Buffer.alloc(5);header.writeUInt32BE(point,0);header[4]=encoded.length;hash.update(header).update(encoded);}
 assert.equal(hash.digest('hex'),reference.utf8_sha256);
 assert.equal(decode(bytes(0xef,0xbb,0xbf,0x41),options('utf-8')),'\ufeffA');
});
test('UTF8 credentials enforce16 encoded bytes including multicode-unit characters',()=>{
 assert.equal(encode('中'.repeat(5),options('utf-8')).length,15);
 assert.throws(()=>encode('中'.repeat(6),options('utf-8')),{code:'TEXT_LENGTH',byteLength:18});
 assert.equal(encode('😀'.repeat(4),options('utf-8')).length,16);
 assert.throws(()=>encode('😀'.repeat(5),options('utf-8')),{code:'TEXT_LENGTH',byteLength:20});
 assert.notDeepEqual(encode('é',options('utf-8')),encode('e\u0301',options('utf-8')));
});
test('ill-formed UTF8 is rejected rather than decoded with replacement',()=>{
 for(const value of [[0x80],[0xc0,0xaf],[0xc2],[0xe0,0x80,0x80],[0xed,0xa0,0x80],[0xf0,0x80,0x80,0x80],[0xf4,0x90,0x80,0x80],[0xf5,0x80,0x80,0x80],[0xe4,0xb8,0x41]])assert.throws(()=>decode(bytes(...value),options('utf-8')),{code:'TEXT_BYTES'});
});
test('Windows936 rejects incomplete/illegal pairs and GB18030 four-byte extensions',()=>{
 for(const value of [[0x81],[0xff],[0x81,0x7f],[0x81,0x30],[0x81,0x30,0x81,0x30]])assert.throws(()=>decode(bytes(...value),options('windows-936')),{code:'TEXT_BYTES'});
});
test('all profiles reject control text and unpaired surrogates without coercion or echoed content',()=>{
 for(const encoding of ['ascii','windows-936','utf-8']){
  for(const value of ['\0','\n','\t','\x7f','\x80','\x9f'])assert.throws(()=>encode(value,options(encoding)),{code:'TEXT_CONTROL'});
  for(const value of ['\ud800','\udfff',null,{},42])assert.throws(()=>encode(value,options(encoding)),{code:'TEXT_INPUT'});
 }
 const privateText='OriginalUnmappable😀';assert.throws(()=>encode(privateText,options('windows-936')),error=>!error.message.includes('Original')&&error.code==='TEXT_UNREPRESENTABLE');
});
test('encoding is explicit own data, with safe errors and no getters/coercion',()=>{
 for(const value of [undefined,{},Object.create({encoding:'utf-8'}),{encoding:'gb18030'},{encoding:'automatic'}])assert.throws(()=>encode('A',value),{code:'TEXT_ENCODING'});
 let called=false;assert.throws(()=>encode('A',{get encoding(){called=true;return 'ascii';}}),{code:'TEXT_ENCODING'});assert.equal(called,false);
 assert.equal(new LauncherTextError({toString(){throw new Error('Do not coerce');}}).code,'TEXT_INPUT');
});
test('names accept the full41-byte range and actual offset views without modifying callers',()=>{
 assert.equal(decode(new Uint8Array(41).fill(65),options('ascii')).length,41);
 assert.throws(()=>decode(new Uint8Array(42).fill(65),options('ascii')),{code:'TEXT_BYTES'});
 const data=bytes(99,0xd6,0xd0,0xce,0xc4,99),copy=data.slice();assert.equal(decode(data.subarray(1,5),options('windows-936')),'中文');assert.deepEqual(data,copy);
 for(const value of [new Uint8Array(0),[65],new DataView(new ArrayBuffer(2)),new Proxy(bytes(65),{})])assert.throws(()=>decode(value,options('ascii')),{code:'TEXT_BYTES'});
});
test('selected text encoding feeds the same exact-byte license identity and request frame',()=>{
 const text='合成用户甲',passwordText='测试口令甲';
 const win=encode(text,options('windows-936')),utf=encode(text,options('utf-8'));
 const first=createLauncherLicenseIdentity({gameCodeText:'11',usernameBytes:win}),second=createLauncherLicenseIdentity({gameCodeText:'11',usernameBytes:utf});
 assert.notEqual(first.key,second.key);assert.equal(first.key,createHash('md5').update(win).digest('hex'));assert.equal(second.key,createHash('md5').update(utf).digest('hex'));
 for(const [encoding,usernameBytes] of [['windows-936',win],['utf-8',utf]]){const frame=encodeLauncherLoginRequestFrame({requestCounter:0,gameCode:11,usernameBytes,passwordBytes:encode(passwordText,options(encoding))});assert.equal(frame[7],usernameBytes.length);assert.deepEqual(frame.subarray(8,8+usernameBytes.length),usernameBytes);}
});
