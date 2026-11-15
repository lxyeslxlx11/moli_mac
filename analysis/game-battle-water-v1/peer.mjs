/** Original loopback peer: authored water maps40000/59000 and special background5000; actual artwork unchanged. */
import {mkdtemp,copyFile,readFile,writeFile,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join,resolve} from 'node:path';
import {spawn} from 'node:child_process';
import {createInterface} from 'node:readline';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
const digits='0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
export const base62=n=>{let out='';do{out=digits[n%62]+out;n=Math.floor(n/62);}while(n);return out;};
export async function battleWaterPeer({flow=0,actor=100010,background=5000,cut=40000}={}){
  assert.ok([0,1].includes(flow));assert.equal(actor,100010);assert.equal(background,5000);assert.ok([40000,59000].includes(cut));
  const temp=await mkdtemp(join(tmpdir(),'moli-battle-water-peer-'));
  try{
    for(const [source,target] of [['game-browser-owner-v1/original_peer.py','original_peer.py'],['game-character-options-v1/original-vectors.json','original-vectors.json'],['game-post-login-v1/original-vectors.json','post-login-vectors.json'],['game-input-runtime-v1/original-vectors.json','scene-vectors.json'],['game-legacy-message-v1/generate_vectors.py','wire_reference.py'],['game-legacy-battle-reentry-v1/original-fixture.json','reentry-vectors.json']])await copyFile(resolve('analysis',source),join(temp,target));
    const file=join(temp,'scene-vectors.json'),v=JSON.parse(await readFile(file));
    v.protocol.beforePlainHex=v.protocol.beforePlainHex.map(hex=>{const words=Buffer.from(hex,'hex').toString().split(' ');
      if(words[0]==='TfD'){assert.equal(words.length,14);words[2]=base62(cut);words[9]='0';words[11]='-1';}
      if(words[0]==='=mJ'){words[2]=base62(cut);const planes=words[7].split('|').map(p=>p.split(','));assert.equal(planes.length,3);planes[0]=planes[0].map((_,i)=>base62(Math.floor(i/12)===3?1099:5000+i%9));planes[1].fill('0');planes[1][11*12+2]=base62(8946);planes[2][10*12+10]=base62(256);words[7]=planes.map(p=>p.join(',')).join('|');}
      return Buffer.from(words.join(' ')).toString('hex');});
    await writeFile(file,JSON.stringify(v));
    const script=join(temp,'original_peer.py'),before=await readFile(script,'utf8');
    const actorLiteral="b'|186FF|'",bgLiteral="    }[status]\n    packets = [b'>HY 1 g8 ',";
    assert.equal(before.split(actorLiteral).length-1,1);assert.equal(before.split(bgLiteral).length-1,1);
    const after=before.replace(actorLiteral,"b'|"+actor.toString(16).toUpperCase()+"|'").replace(bgLiteral,"    }[status]\n    packets = [b'>HY 1 "+base62(background)+" ',");
    await writeFile(script,after);
    const fixture={stage:299,actor,background,mapId:cut,mapMode:0,wireShapeUnchanged:true,artworkUnchanged:true,
      basePeerSha256:createHash('sha256').update(before).digest('hex'),selectedPeerSha256:createHash('sha256').update(after).digest('hex')};
    const child=spawn('python3',[script,'battle-status-impact-106',String(flow),'0'],{stdio:['pipe','pipe','pipe']}),lines=createInterface({input:child.stdout}),iterator=lines[Symbol.asyncIterator]();
    let diagnostics='';child.stderr.on('data',b=>{diagnostics+=b;});
    const exit=new Promise((resolve,reject)=>{child.once('error',reject);child.once('exit',resolve);});
    const first=await iterator.next();if(first.done)throw Error('No actual material peer: '+diagnostics);const port=JSON.parse(first.value).port;
    return {port,fixture,diagnostics:()=>diagnostics,release(){child.stdin.write('release\n');},
      async finishBattle(){child.stdin.write('finish-battle\n');const row=await iterator.next();assert.equal(row.done,false,diagnostics);const result=JSON.parse(row.value);assert.equal(result.battle_exit_verified,true);assert.ok(Number.isInteger(result.battle_keepalives_verified));return result;},
      async receipt(){const row=await iterator.next();assert.equal(await exit,0,diagnostics);assert.equal(row.done,false,diagnostics);return JSON.parse(row.value);},
      async close(){lines.close();child.stdin.end();if(child.exitCode===null)child.kill('SIGTERM');await exit;await rm(temp,{recursive:true,force:true});}};
  }catch(error){await rm(temp,{recursive:true,force:true});throw error;}
}
