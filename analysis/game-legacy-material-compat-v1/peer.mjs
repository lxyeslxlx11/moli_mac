import {mkdtemp,copyFile,readFile,writeFile,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join,resolve} from 'node:path';
import {spawn} from 'node:child_process';
import {createInterface} from 'node:readline';
export async function materialPeer({flow=0,checksumMode=0}={}){
 if(![0,1].includes(flow)||![0,1].includes(checksumMode))throw Error('fixture selection');
 const temp=await mkdtemp(join(tmpdir(),'moli-material-peer-'));
 for(const [source,target] of [['game-browser-owner-v1/original_peer.py','original_peer.py'],['game-character-options-v1/original-vectors.json','original-vectors.json'],['game-post-login-v1/original-vectors.json','post-login-vectors.json'],['game-input-runtime-v1/original-vectors.json','scene-vectors.json'],['game-legacy-message-v1/generate_vectors.py','wire_reference.py'],['game-legacy-battle-reentry-v1/original-fixture.json','reentry-vectors.json']])await copyFile(resolve('analysis',source),join(temp,target));
 const file=join(temp,'scene-vectors.json'),v=JSON.parse(await readFile(file));
 v.protocol.beforePlainHex=v.protocol.beforePlainHex.map(hex=>{const words=Buffer.from(hex,'hex').toString().split(' ');if(words[0]==='TfD'){if(words[9]!=='1')throw Error('fixture mode');words[9]=String(checksumMode);return Buffer.from(words.join(' ')).toString('hex');}return hex;});
 await writeFile(file,JSON.stringify(v));
 const child=spawn('python3',[join(temp,'original_peer.py'),'browser',String(flow),'0'],{stdio:['pipe','pipe','pipe']});
 const lines=createInterface({input:child.stdout}),iterator=lines[Symbol.asyncIterator]();let diagnostics='';
 child.stderr.on('data',b=>{diagnostics+=b;});
 const exit=new Promise((resolve,reject)=>{child.once('error',reject);child.once('exit',resolve);});
 const first=await iterator.next();if(first.done)throw Error('No peer: '+diagnostics);
 const start=JSON.parse(first.value);
 return {port:start.port,entryReady(){child.stdin.write('entry-ready\n');},release(){child.stdin.write('release\n');},
  async receipt(){const row=await iterator.next(),code=await exit;if(code!==0||row.done)throw Error('Peer failure: '+diagnostics);return JSON.parse(row.value);},
  async close(){lines.close();child.stdin.end();if(child.exitCode===null)child.kill('SIGTERM');await exit;await rm(temp,{recursive:true,force:true});}};
}
