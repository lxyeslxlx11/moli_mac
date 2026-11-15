/** Independent original Python peer with explicit source packet boundaries; actual owned loopback TCP only. */
import { mkdtemp, copyFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawn } from 'node:child_process';
import { createInterface } from 'node:readline';
import assert from 'node:assert/strict';
const directory=new URL('../../../analysis/',import.meta.url);
export async function actorSpinOriginalPeer(mode,flow=0){
  const temp=await mkdtemp(join(tmpdir(),'moli-actor-spin-peer-'));
  for(const [source,target]of [['game-actor-spin-v1/original_peer.py','original_peer.py'],['game-actor-spin-v1/original-vectors.json','spin-vectors.json'],['game-character-options-v1/original-vectors.json','original-vectors.json'],['game-post-login-v1/original-vectors.json','post-login-vectors.json'],['game-input-runtime-v1/original-vectors.json','scene-vectors.json'],['game-legacy-message-v1/generate_vectors.py','wire_reference.py']])await copyFile(new URL(source,directory),join(temp,target));
  const child=spawn('python3',[join(temp,'original_peer.py'),mode,String(flow)],{stdio:['pipe','pipe','pipe']}),lines=createInterface({input:child.stdout}),iterator=lines[Symbol.asyncIterator]();
  let diagnostics='';child.stderr.on('data',b=>{diagnostics+=b;});const exit=new Promise((resolve,reject)=>{child.once('error',reject);child.once('exit',resolve);});
  const first=await iterator.next();if(first.done)throw Error('Original bootstrap peer did not listen: '+diagnostics);const port=JSON.parse(first.value).port;
  return {port,release(){child.stdin.write('release\n');},async stage(){const row=await iterator.next();assert.equal(row.done,false,diagnostics);return JSON.parse(row.value);},
    async receipt(){const row=await iterator.next();assert.equal(await exit,0,diagnostics);assert.equal(row.done,false,diagnostics);return JSON.parse(row.value);},
    async close(){lines.close();child.stdin.end();if(child.exitCode===null)child.kill('SIGTERM');await exit;await rm(temp,{recursive:true,force:true});}};
}
