/** Original controlled client ports; retain the existing helper unchanged. */
import {readFileSync} from 'node:fs';
import {fileURLToPath,pathToFileURL} from 'node:url';
import {resolve} from 'node:path';
import assert from 'node:assert/strict';
import {waterAssets} from '../game-battle-water-v1/fixture.mjs';
import {characterAssets} from '../game-post-login-v1/original_assets.mjs';
const helper=new URL('../../web/tests/helpers/legacy-game-client-fixture.mjs',import.meta.url),base=fileURLToPath(new URL('.',helper));
let code=readFileSync(helper,'utf8');
code=code.replace('import * as api from','import * as defaultAPI from').replace('export function clientFixture(options = {}) {','export function clientFixture(options = {}) {\n  const api=options.api??defaultAPI;');
code=code.replace('factories++;','factories++; options.onWorld?.(world);').replace('const fixture = { client,','const fixture = { api, client,').replace('f.offer(api.encodeLegacyGameEnvelope','f.offer(f.api.encodeLegacyGameEnvelope');
// Compiled objects must use the session compiled with the same module identity.
// Original controlled byte ports are exposed through native-API-shaped callbacks.
code=code.replace('return createLegacyGameSession({ sourceProfile:',`if(api.createWeChatLegacyGameSession){
 const wx={createTCPSocket(){const handlers=Object.fromEntries(['Connect','Message','Error','Close'].map(n=>[n,new Set()]));let stopped=false;
  const emit=(n,v)=>{for(const f of [...handlers[n]])f(v);},socket={
   connect(){opens++;queueMicrotask(()=>emit('Connect'));void(async()=>{try{while(!stopped){const b=await stream.read();if(b===null){emit('Close');break;}emit('Message',{message:b.slice().buffer});}}catch{emit('Error',{});}})();},
   write(b){void stream.write(new Uint8Array(b));},close(){if(!stopped){stopped=true;stream.close();}}
  };for(const n of Object.keys(handlers)){socket['on'+n]=f=>handlers[n].add(f);socket['off'+n]=f=>handlers[n].delete(f);}return socket;}};
 return api.createWeChatLegacyGameSession({wx,sourceProfile:material.sourceProfile,world,mappingBytes:material.mappingBytes,moduleDigestBytes:material.moduleDigestBytes,endpoint:{address:'fixture.invalid',port:12345},pollMilliseconds:1,postLogin:{graphics},wallNow:()=>tick,setTimer(fn,delay){const t={fn,delay};timers.set(t,t);allTimers.push(t);return t;},clearTimer:t=>timers.delete(t),onState,onPacket});
}
return createLegacyGameSession({ sourceProfile:`);
code=code.replace(/(?:from\s*|import\()\s*['"](\.[^'"]+)['"]/g,(match,path)=>match.replace(path,pathToFileURL(resolve(base,path)).href)).replaceAll('import.meta.url',JSON.stringify(helper.href));
const {clientFixture,clientMenu}=await import('data:text/javascript;base64,'+Buffer.from(code).toString('base64'));
const read=p=>JSON.parse(readFileSync(new URL(p,import.meta.url))),v=read('../game-legacy-scene-frame-v1/original-vectors.json'),post=read('../game-post-login-v1/original-vectors.json');
export const base62=n=>{let s='';do{s='0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'[n%62]+s;n=Math.floor(n/62);}while(n);return s;};
export function waterWire(hex,mapId=40000){const words=Buffer.from(hex,'hex').toString().split(' ');
 if(words[0]==='TfD'){words[2]=base62(mapId);words[9]='0';words[11]='-1';}
 if(words[0]==='=mJ'){words[2]=base62(mapId);const planes=words[7].split('|').map(p=>p.split(','));planes[0].fill(base62(5000));planes[1].fill('0');planes[2].fill(base62(16384));words[7]=planes.map(p=>p.join(',')).join('|');}
 return words.join(' ');
}
export async function cityFixture(api){let world;const f=clientFixture({api,assets:characterAssets(waterAssets()),onWorld(w){world=w;}});
 try{
  await clientMenu(f);f.client.session().enterCharacter(0);await f.drive(()=>f.writes.length===3);f.offer(new Uint8Array(Buffer.from(post.flow.replies.entered.frameHex,'hex')));await f.drive(()=>f.client.inspect().session.sourceCharacterEntered);
  const send=async plain=>{f.offer(f.frame(Buffer.from(plain).toString('hex')));await new Promise(resolve=>setImmediate(resolve));};
  for(const hex of v.protocol.beforePlainHex)await send(waterWire(hex));await f.drive(()=>f.client.inspect().state==='playing');
  const request={tick:1000,runtime:v.runtime,camera:[128,192],center:[320,240],width:640,height:480};
  assert.equal(world.copyGameState().actors.localBootstrap.entryPrepared,true);assert.equal(world.copyGameState().sourceEntryWaitMask,0);
  const message=tag=>v.protocol.beforePlainHex.find(h=>Buffer.from(h,'hex').toString().startsWith(tag+' '));
  return {f,world,request,send,own:Buffer.from(message('H#|'),'hex').toString(),scene:mapId=>waterWire(message('TfD'),mapId),patch:mapId=>waterWire(message('=mJ'),mapId),close(){f.close();}};
 }catch(error){f.close();throw error;}
}
