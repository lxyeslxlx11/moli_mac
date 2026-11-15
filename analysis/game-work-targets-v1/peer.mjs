/** Original local target-work and continuous gathering peer. */
import {mkdtemp,writeFile,rm,readFile} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join,resolve} from 'node:path';
import {spawn} from 'node:child_process';
import {createInterface} from 'node:readline';
import assert from 'node:assert/strict';
import * as api from '../../shared/index.mjs';
import {targetHeader,levels,peopleWire,subjectWire,bytes} from './fixture.mjs';
import {waterWire,base62} from '../game-city-water-v1/fixture.mjs';
export async function workPeer(flow=0){
  const temp=await mkdtemp(join(tmpdir(),'moli-work305-peer-'));let child,lines,exit;
  try{
    const old=JSON.parse(await readFile(resolve('analysis/game-legacy-scene-frame-v1/original-vectors.json')));
    const packet=(tag,args,raw)=>Buffer.concat([Buffer.from(tag+' '),...args.flatMap(n=>[
      Buffer.from(api.encodeLegacyGameInteger(n)),Buffer.from(' ')]),Buffer.from(api.encodeLegacyGameTextField(bytes(raw))),Buffer.from(' ')]).toString('hex');
    const stats=base62(2+4+8+16+32768+536870912)+'|50|100|1000|1000|20|Local hero|';
    const petFields={0:100000,1:1,2:20,3:70,4:10,5:30,8:8,21:'Fox',22:'Fox',23:2,24:1};
    let mask=0;for(const key of Object.keys(petFields))mask|=1<<(Number(key)+1);
    const pet=base62(mask)+'|'+Object.values(petFields).join('|')+'|';
    const fixture={initial:[...old.protocol.beforePlainHex.map(h=>Buffer.from(waterWire(h)).toString('hex')),
      packet('J<=',[],targetHeader),...Array.from({length:12},(_,slot)=>packet('JUA',[slot],levels)),
      packet('E(9',[],stats),packet('FBY',[3],pet)],
      people:packet('KxC',[],peopleWire),subjects:packet('L<%',[],subjectWire),selfSubjects:packet('L<%',[],''),
      disguiseResult:packet('Lor',[0,3],'0|0|0|0|0|0|0|'),transformResult:packet('Lor',[1,3],'1|0|0|0|0|0|0|'),
      aidResult:packet('Lor',[1,3],'10|0|1|1|2|3|15|'),aidFailure:packet('Lor',[0,3],'0|0|0|0|0|0|1|'),
      treatmentFailure:packet('Lor',[0,3],'1|0|0|0|0|0|2|'),treatmentResult:packet('Lor',[1,3],'5|0|0|0|0|0|4|'),
      gatherResult:packet('Lor',[1,4],'15|0|1|1|2|3|88|Local ore|'),gatherFailure:packet('Lor',[0,4],'Ignored|'),
      lowMp:packet('E(9',[],'8|1'),restoreMp:packet('E(9',[],'8|1000')};
    const path=join(temp,'fixture.json');await writeFile(path,JSON.stringify(fixture));
    child=spawn('python3',[resolve('analysis/game-work-targets-v1/original_peer.py'),path,String(flow)],{stdio:['pipe','pipe','pipe']});
    let diagnostics='';child.stderr.on('data',b=>diagnostics+=b);exit=new Promise((yes,no)=>{child.once('error',no);child.once('exit',yes);});
    lines=createInterface({input:child.stdout});const iterator=lines[Symbol.asyncIterator]();
    const row=async()=>{let timer;try{const next=await Promise.race([iterator.next(),new Promise((_,reject)=>{timer=setTimeout(()=>reject(Error('Original work peer receipt timeout: '+diagnostics)),45000);})]);assert.equal(next.done,false,diagnostics);return JSON.parse(next.value);}finally{clearTimeout(timer);}};
    const {port}=await row();return {port,diagnostics:()=>diagnostics,
      async stage(expected){assert.deepEqual(await row(),{stage:expected});},release(s){child.stdin.write(s+'\n');},
      async receipt(){const value=await row();assert.equal(await exit,0,diagnostics);return value;},
      async close(){lines.close();child.stdin.end();if(child.exitCode===null)child.kill('SIGTERM');await exit;await rm(temp,{recursive:true,force:true});}};
  }catch(error){lines?.close();if(child&&child.exitCode===null)child.kill('SIGTERM');if(exit)await exit;await rm(temp,{recursive:true,force:true});throw error;}
}
