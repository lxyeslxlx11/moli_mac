/** Original localhost peer; fixed expected request bytes live in independent Python. */
import {mkdtemp,writeFile,rm,readFile} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join,resolve} from 'node:path';
import {spawn} from 'node:child_process';
import {createInterface} from 'node:readline';
import assert from 'node:assert/strict';
import * as api from '../../shared/index.mjs';
import {header,levels,items,craftRecipe,bytes} from './fixture.mjs';
import {waterWire} from '../game-city-water-v1/fixture.mjs';
export async function workPeer(flow=0){
  const temp=await mkdtemp(join(tmpdir(),'moli-work306-peer-'));let child,lines,exit;
  try{
    const old=JSON.parse(await readFile(resolve('analysis/game-legacy-scene-frame-v1/original-vectors.json')));
    const packet=(tag,args,raw)=>Buffer.concat([Buffer.from(tag+' '),...args.flatMap(n=>[
      Buffer.from(api.encodeLegacyGameInteger(n)),Buffer.from(' ')]),...(raw===undefined?[]:[Buffer.from(api.encodeLegacyGameTextField(bytes(raw))),Buffer.from(' ')])]).toString('hex');
    const identity=Buffer.from(old.protocol.beforePlainHex.find(h=>Buffer.from(h,'hex').toString().startsWith('@Qu ')),'hex').toString().split(' ')[1];
    assert.match(identity,/^[0-9a-zA-Z]+$/);
    const fixture={initial:[...old.protocol.beforePlainHex.map(h=>Buffer.from(waterWire(h)).toString('hex')),
      packet('J<=',[],header),...Array.from({length:8},(_,slot)=>packet('JUA',[slot],levels)),
      packet('@_i',[0],craftRecipe(501)),packet('?l)',[],items),packet('E(9',[],'8|1000'),packet('F8%',[],'8ww|3'),packet('Xz@',[600,1])],
      recipe:packet('@_i',[0],craftRecipe(501)),timer:packet('Xz@',[600,1]),zeroTime:packet('Xz@',[0,0]),
      craftResult:packet('Lor',[1,1],'10|0|1|0|0|0|0|88|'),repairResult:packet('Lor',[1,2],'10|0|0|0|0|0|0|'),
      gatherResult:packet('Lor',[1,4],'10|0|0|0|0|0|88|Local ore|'),lowMp:packet('E(9',[],'8|0'),
      ride:packet('Hx!',[],identity+'|2|3|70|0|100000|0|0,')};
    const path=join(temp,'fixture.json');await writeFile(path,JSON.stringify(fixture));
    child=spawn('python3',[resolve('analysis/game-work-context-v1/original_peer.py'),path,String(flow)],{stdio:['pipe','pipe','pipe']});
    let diagnostics='';child.stderr.on('data',b=>diagnostics+=b);exit=new Promise((yes,no)=>{child.once('error',no);child.once('exit',yes);});
    lines=createInterface({input:child.stdout});const iterator=lines[Symbol.asyncIterator]();
    const row=async()=>{let timer;try{const next=await Promise.race([iterator.next(),new Promise((_,reject)=>{timer=setTimeout(()=>reject(Error('Original context peer timeout: '+diagnostics)),45000);})]);assert.equal(next.done,false,diagnostics);return JSON.parse(next.value);}finally{clearTimeout(timer);}};
    const {port}=await row();return {port,diagnostics:()=>diagnostics,
      async stage(expected){assert.deepEqual(await row(),{stage:expected});},release(s){child.stdin.write(s+'\n');},
      async receipt(){const value=await row();assert.equal(await exit,0,diagnostics);return value;},
      async close(){lines.close();child.stdin.end();if(child.exitCode===null)child.kill('SIGTERM');await exit;await rm(temp,{recursive:true,force:true});}};
  }catch(error){lines?.close();if(child&&child.exitCode===null)child.kill('SIGTERM');if(exit)await exit;await rm(temp,{recursive:true,force:true});throw error;}
}
