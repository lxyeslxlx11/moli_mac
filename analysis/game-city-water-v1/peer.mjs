/** Original loopback city peer; authored water map, unchanged actual graphics and existing own-unit packet. */
import {mkdtemp,copyFile,readFile,writeFile,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join,resolve} from 'node:path';
import {spawn} from 'node:child_process';
import {createInterface} from 'node:readline';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
import {base62} from './fixture.mjs';
export async function cityWaterPeer(route,flow=0){
 assert.ok(['scene','boundary','battle-transfer','battle-early','battle-late'].includes(route));
 const temp=await mkdtemp(join(tmpdir(),'moli-city-water-peer-'));let child,exit,lines;
 try{
  for(const [s,t]of [['game-browser-owner-v1/original_peer.py','original_peer.py'],['game-character-options-v1/original-vectors.json','original-vectors.json'],['game-post-login-v1/original-vectors.json','post-login-vectors.json'],['game-input-runtime-v1/original-vectors.json','scene-vectors.json'],['game-legacy-message-v1/generate_vectors.py','wire_reference.py'],['game-legacy-battle-reentry-v1/original-fixture.json','reentry-vectors.json']])await copyFile(resolve('analysis',s),join(temp,t));
  const vectorFile=join(temp,'scene-vectors.json'),v=JSON.parse(await readFile(vectorFile));
  v.protocol.beforePlainHex=v.protocol.beforePlainHex.map(hex=>{const words=Buffer.from(hex,'hex').toString().split(' ');
   if(words[0]==='TfD'){words[2]=base62(40000);words[9]='0';words[11]='-1';}
   if(words[0]==='=mJ'){words[2]=base62(40000);const planes=words[7].split('|').map(p=>p.split(','));planes[0]=planes[0].map((_,i)=>base62(Math.floor(i/12)===3?1099:5000+i%9));planes[1].fill('0');words[7]=planes.map(p=>p.join(',')).join('|');}
   return Buffer.from(words.join(' ')).toString('hex');});await writeFile(vectorFile,JSON.stringify(v));
  const file=join(temp,'original_peer.py'),before=await readFile(file,'utf8');let after=before;
  assert.equal(after.split('transfer[2] = patch[2] = wire.integer(24)').length-1,1);after=after.replace('transfer[2] = patch[2] = wire.integer(24)','transfer[2] = patch[2] = wire.integer(59000)');
  // The scene path does not call the native main9/11 local constructor. A real
  // own-unit callback is required; reuse the original authored unit packet.
  const patchSend='connection.sendall(encoded([patch]))',hits=after.split(patchSend).length-1;assert.equal(hits,2);
  after=after.replaceAll(patchSend,"connection.sendall(encoded([patch] + [row for row in scene['protocol']['beforePlainHex'] if bytes.fromhex(row).startswith(b'H#| ')]))");
  const a=after.indexOf('def city_battle_entry():'),b=after.indexOf('\ndef ',a+1),part=after.slice(a,b);assert.equal(part.split("packets = [b'>HY 1 g8 ',").length-1,1);after=after.slice(0,a)+part.replace("packets = [b'>HY 1 g8 ',","packets = [b'>HY 1 "+base62(5000)+" ',")+after.slice(b);
  await writeFile(file,after);const fixture={stage:300,route,initialMap:40000,cityMap:59000,mapMode:0,actor:100010,background:5000,freshOwnUnit:true,wireShapeUnchanged:true,artworkUnchanged:true,basePeerSha256:createHash('sha256').update(before).digest('hex'),selectedPeerSha256:createHash('sha256').update(after).digest('hex')};
  child=spawn('python3',[file,'city-return-'+route,String(flow),'0'],{stdio:['pipe','pipe','pipe']});lines=createInterface({input:child.stdout});const iterator=lines[Symbol.asyncIterator]();let diagnostics='';child.stderr.on('data',b=>diagnostics+=b);exit=new Promise((yes,no)=>{child.once('error',no);child.once('exit',yes);});
  const first=await iterator.next();assert.equal(first.done,false,diagnostics);const port=JSON.parse(first.value).port;
  const next=async expected=>{const row=await iterator.next();assert.equal(row.done,false,diagnostics);assert.deepEqual(JSON.parse(row.value),expected);};
  return{port,fixture,diagnostics:()=>diagnostics,release(){child.stdin.write('release\n');},waitReturnRequest:()=>next({return_request_verified:true}),checkReturnParked:async()=>{child.stdin.write('check-return\n');await next({return_parked:true});},waitCityBoundary:n=>next({city_boundary_verified:n}),supplyCityMap(){child.stdin.write('city-map\n');},
   async receipt(){const row=await iterator.next();assert.equal(await exit,0,diagnostics);assert.equal(row.done,false,diagnostics);return JSON.parse(row.value);},
   async close(){lines.close();child.stdin.end();if(child.exitCode===null)child.kill('SIGTERM');await exit;await rm(temp,{recursive:true,force:true});}};
 }catch(error){lines?.close();if(child&&child.exitCode===null)child.kill('SIGTERM');if(exit)await exit;await rm(temp,{recursive:true,force:true});throw error;}
}
