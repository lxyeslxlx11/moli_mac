/** Bounded original peer fixture and lifecycle for the real web and Page clients. */
import {mkdtemp,writeFile,rm,readFile} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join,resolve} from 'node:path';
import {spawn} from 'node:child_process';
import {createInterface} from 'node:readline';
import assert from 'node:assert/strict';
import * as api from '../../shared/index.mjs';
import {craftHeader,craftLevels,craftRecipe,craftItems,bytes} from './fixture.mjs';
import {waterWire} from '../game-city-water-v1/fixture.mjs';
export async function craftPeer(flow=0){
  const temp=await mkdtemp(join(tmpdir(),'moli-craft303-peer-'));let child,lines,exit;
  try{
    const old=JSON.parse(await readFile(resolve('analysis/game-legacy-scene-frame-v1/original-vectors.json')));
    const packet=(tag,args,raw)=>Buffer.concat([Buffer.from(tag+' '),...args.flatMap(n=>[
      Buffer.from(api.encodeLegacyGameInteger(n)),Buffer.from(' ')]),Buffer.from(api.encodeLegacyGameTextField(bytes(raw))),Buffer.from(' ')]).toString('hex');
    const fixture={initial:[...old.protocol.beforePlainHex.map(h=>Buffer.from(waterWire(h)).toString('hex')),
      packet('J<=',[],craftHeader),packet('JUA',[3],craftLevels),packet('?l)',[],craftItems),packet('E(9',[],'8|1000')],
      recipes:packet('@_i',[3],craftRecipe()),success:packet('Lor',[1,1],'15|0|1|2|3|0|0|88|Copper|'),
      failure:packet('Lor',[0,1],'0|0|0|0|0|0|1|88|Wood|'),lowMp:packet('E(9',[],'8|9'),restoreMp:packet('E(9',[],'8|1000')};
    const path=join(temp,'fixture.json');await writeFile(path,JSON.stringify(fixture));
    child=spawn('python3',[resolve('analysis/game-craft-input-v1/original_peer.py'),path,String(flow)],{stdio:['pipe','pipe','pipe']});
    let diagnostics='';child.stderr.on('data',b=>diagnostics+=b);exit=new Promise((yes,no)=>{child.once('error',no);child.once('exit',yes);});
    lines=createInterface({input:child.stdout});const iterator=lines[Symbol.asyncIterator]();
    const row=async()=>{let timer;try{const next=await Promise.race([iterator.next(),new Promise((_,reject)=>{timer=setTimeout(()=>reject(Error('Original peer receipt timeout: '+diagnostics)),30000);})]);assert.equal(next.done,false,diagnostics);return JSON.parse(next.value);}finally{clearTimeout(timer);}};
    const {port}=await row();return {port,diagnostics:()=>diagnostics,
      async stage(expected){assert.deepEqual(await row(),{stage:expected});},release(s){child.stdin.write(s+'\n');},
      async receipt(){const value=await row();assert.equal(await exit,0,diagnostics);return value;},
      async close(){lines.close();child.stdin.end();if(child.exitCode===null)child.kill('SIGTERM');await exit;await rm(temp,{recursive:true,force:true});}};
  }catch(error){lines?.close();if(child&&child.exitCode===null)child.kill('SIGTERM');if(exit)await exit;await rm(temp,{recursive:true,force:true});throw error;}
}
