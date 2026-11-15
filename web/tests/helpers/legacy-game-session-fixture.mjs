/** Original deterministic transport/timer ports for a real source world. No network/account. */
import { readFileSync } from 'node:fs';
import { createLegacyGameWorldProtocol,encodeLegacyGameEnvelope,createLegacyGameEnvelopeReader,createLegacyGamePayloadCodec } from '../../../shared/index.mjs';
import { createLegacyGameSession } from '../../legacy-game-session.mjs';
export const original=JSON.parse(readFileSync(new URL('../../../analysis/game-session-runtime-v1/original-vectors.json',import.meta.url)));
export const bytes=h=>new Uint8Array(Buffer.from(h,'hex'));
export const ascii=s=>new Uint8Array(Buffer.from(s,'ascii'));
export const credentials=()=>({mappingBytes:ascii('gid:OriginalG glt:OriginalT\0'),moduleDigestBytes:ascii(original.authentication.moduleDigest)});
export const bootstrap=()=>encodeLegacyGameEnvelope(bytes(original.wire.bootstrap.payloadHex));
export const flush=async()=>{for(let i=0;i<40;i++)await Promise.resolve();};
export function plain(wire){const r=createLegacyGameEnvelopeReader(),c=createLegacyGamePayloadCodec(bytes(original.wire.bootstrap.keyHex));try{r.append(wire);return Buffer.from(c.decode(r.next().payload)).toString('hex');}finally{r.close();c.close();}}
export function harness(options={}){
 let tick=100,serial=0,pending=null,ended=false,closeCalls=0,reads=0,opens=0;
 const incoming=[],timers=new Map(),allTimers=[],writeRefs=[],writes=[],packets=[],states=[];
 const port={read(){reads++;if(incoming.length)return Promise.resolve(incoming.shift());if(ended)return Promise.resolve(null);return new Promise(resolve=>{pending=resolve;});},
  write(value){writeRefs.push(value);writes.push(value.slice());return options.write?options.write(value):Promise.resolve();},
  close(){closeCalls++;ended=true;const p=pending;pending=null;p?.(null);}};
 const world=createLegacyGameWorldProtocol();
 const settings={sourceProfile:'legacy-se6000-37c4',world,...credentials(),endpoint:{address:'127.0.0.1',port:32123},
  openStream:()=>{opens++;return options.openStream?options.openStream():Promise.resolve(port);},clock:()=>tick,
  setTimer(fn,delay){const handle={id:++serial,fn,delay};timers.set(handle,handle);allTimers.push(handle);return handle;},clearTimer(handle){timers.delete(handle);},
  createControl:()=>new AbortController(),pollMilliseconds:1,
  onPacket:p=>{packets.push(p);return options.onPacket?.(p);},onState:s=>{states.push(s);return options.onState?.(s);},...options.settings};
 const session=createLegacyGameSession(settings);
 const result={session,world,port,settings,writes,writeRefs,packets,states,timers,allTimers,
  offer(value){const p=pending;if(p){pending=null;p(value);}else incoming.push(value);},
  get stats(){return{closeCalls,reads,opens};},get tick(){return tick;},set tick(value){tick=value;},
  fire(){const next=timers.keys().next().value;if(!next)return false;timers.delete(next);tick=(tick+next.delay)>>>0;next.fn();return true;},
  close(){session.close();world.close();},
 };
 return result;
}
export async function sourceReady(f){f.session.start();await flush();f.offer(bootstrap());await flush();f.offer(bytes(original.wire.replies.success.frameHex));await flush();for(let i=0;i<30&&f.session.inspect().state!=='ready';i++){if(!f.fire())break;await flush();}const r=await f.session.ready;if(r.state!=='ready')throw Error('Original session not ready: '+r.errorCode);return r;}
