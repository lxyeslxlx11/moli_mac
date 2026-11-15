/** Fixed37c4 423fa0/4241f0 and436c20. This is a native ordered script,not a damage summary. */
import {battleFail as fail} from './legacy-game-battle-bytes.mjs';
const slot=n=>n===50?20:n===51?21:n;
// 436c20 copies the main word cursor. Only a contiguous1010 block is searched.
// Native skips amount and optional three RID words,not an optional guard scalar.
export function physicalGuardLookAhead(words,start,actor,tail){
 let at=start;
 const number=()=>at<words.length?words[at++]:tail===undefined?undefined:tail[at++-words.length]??0;
 for(let count=0;count<1024;count++){
  const a=number();if(a===undefined)return undefined;const from=slot(a);if(from===255)return -1;
  const t=number(),f=number();if(t===undefined||f===undefined)return undefined;const target=slot(t),flags=f>>>0;
  if(!(flags&0x1010))return -1;if(from===actor)return target;
  for(let i=0,n=1+(flags&0x800000?3:0);i<n;i++)if(number()===undefined)return undefined;
 }
 return undefined;
}
export function physicalGuardQueueTarget(c,h,actor){
 const target=physicalGuardLookAhead(c.words,c.ends.get(h),actor,c.lookaheadTail);
 if(target===undefined||target<0)return target;
 if(target>21)return undefined;
 if(c.get(target))return target;
 // A later-pair interruption clears the raw turn before playback. A dead
 // or departing actor can keep that tuple and still needs a bound target.
 if(target!==c.interruptedTarget||!(c.cleanupMask&(1<<actor)))return undefined;
 const owner=c.get(actor);
 return owner&&!(owner.dynamicFlags&2)&&owner.state!==13?target:undefined;
}
export function appendPhysicalGuardRedirect(h,{row,act}){
 const a=h.actor,t=h.target,g=h.guard,triple=(s,target)=>row(s).tuples.push([target,h.flags|0,h.amount]);
 row(t).assignments.physicalFamily=row(g).assignments.physicalFamily=1;
 act(a,72);triple(a,g);act(a,24,71,0,24);
 act(g,0);triple(g,t);Object.assign(row(g).assignments,{pairedTarget:t,effectResource:0xfc,messageResource:0x5748});
 act(g,39,78,67,34,73,7,4,42,71,10,74,72);triple(g,t);
 act(t,0,27);triple(t,a);act(t,71,72,62,1);return g;
}
export function appendPhysicalGuardRelease(target,h,next,{row,act,raw}){
 row(target).assignments.physicalFamily=1;if(h.amount===0)act(target,35);act(target,71,72);
 if(h.flags&0xe000){if(next<0)act(target,11);else{act(target,3);raw(target,{target:next,flags:0,amount:0,resources:null});act(target,72);}}
 if(!(h.flags&0x20))act(target,38);
 if(h.amount===0){if(next>=0){act(target,3);raw(target,{target:next,flags:0,amount:0,resources:null});act(target,72);}else act(target,11);}
}
export function isDirectPhysicalFollow(hit,principal,extended=false){
 const allowed=extended?0x80f013:0x1013;
 return hit.guard===null&&hit.target!==hit.actor&&hit.target!==principal&&!(hit.flags&~allowed);
}
export function buildPhysicalGuardPairs(c,p){
 const {row,act,raw}=p;let knocked=false;
 const triple=(s,target,flags,amount)=>row(s).tuples.push([target,flags|0,amount]);
 const owned=s=>{row(s).assignments.physicalFamily=1;};
 function metadata(s,target,h){
  if(!h.resources)return null;const r=row(s),last=r.tuples.at(-1);let fourth=last[3];
  if(last.length===3){
   const b=c.get(s);if(!Number.isInteger(b?.tupleWrite)||!ArrayBuffer.isView(b?.tuples)||b.tuples.length!==800)return 'physical-family-tuple-storage-context';
   const index=b.tupleWrite+r.tuples.length-1;if(index>=199)fail('LEGACY_BATTLE_BODY_CAPACITY');fourth=b.tuples[index*4+3];
  }
  const [a,b,d]=h.resources;r.tuples.push([target,h.flags|0,a,b],[target,h.flags|0,d,0],[last[0],last[1],last[2],fourth]);return null;
 }
 const protect=h=>{const g=appendPhysicalGuardRedirect(h,p);act(h.target,11);return g;};
 const release=(target,h,next)=>appendPhysicalGuardRelease(target,h,next,p);
 for(let i=0;i<c.hits.length;i++){
  const h=c.hits[i],index=i+(c.startIndex??0),kind=index===0?c.category:-1,a=h.actor;owned(a);if(kind===5)h.flags&=~4;
  const following=c.following;
  const track=following&&(following.actors.has(a)||c.lateReceiveSlots?.has(a)||c.lateReceiveSlots?.has(h.target))&&
   isDirectPhysicalFollow(h,c.principal,c.extendedFollowing);
  const attacker=track?row(a):null,action=attacker?.actions.length,tuple=attacker?.tuples.length;
  act(a,24,...(h.flags&0x1010?[3,113]:index===0||a!==c.principal?[7,kind===262?205:9,10]:kind===262?[205]:[3]),242);raw(a,h);
  const recipient=h.guard!==null?protect(h):h.target;
  if([5,84,87].includes(kind)){row(c.principal).assignments.messageResource=kind===5?0x5745:kind===84?0x5747:0x5746;act(c.principal,66);}
  if(kind===105)act(a,97,98);
  if(kind===94){Object.assign(row(a).assignments,{statusScalar:h.extra,effectResource:0x104});act(a,78,96);}
  if([257,259,262].includes(kind)&&c.level===9){act(a,72);triple(a,kind===257?2:kind===262?3:0,0,15);act(a,240);raw(a,{...h,target:recipient});}
  const problem=metadata(a,recipient,h);if(problem)return {reason:problem};
  const resultAction=attacker?.actions.length,tupleEnd=attacker?attacker.tuples.length-1:undefined;
  act(a,14);
  const receiver=track?row(recipient):null,wait=receiver?.actions.length;
  act(recipient,0);
  if(!(h.flags&0x108)){
   if(h.flags&0x40){if(h.flags&3){const reflected=!!(h.flags&0x2000),moving=reflected?a:recipient;act(moving,32);if(reflected)act(recipient,119);else if(h.guard!==null)act(recipient,71,72);act(moving,...(moving===c.localSlot?[244]:[50,49]));}}
   else if((h.amount!==0||kind===6)&&(h.flags&3)){
    if(h.flags&0x8000)act(recipient,121);else if(h.flags&0x4000)act(recipient,120);else if(h.flags&0x2000){act(a,h.flags&2?160:26);act(recipient,119);}else act(recipient,h.flags&2?160:26);
   }
  }
  const next=physicalGuardQueueTarget(c,h,recipient);
  if(next===undefined)return {reason:'physical-family-lookahead-context'};
  if(h.guard!==null)release(recipient,h,next);
  if((h.amount!==0||kind===6||h.flags&0x108)&&!(h.flags&0xc000)){
   if(!(h.flags&0x2000)){if(recipient!==c.principal)act(recipient,next<0?11:243);if(h.flags&0x100)act(recipient,74);}
   else{if(a!==next)act(recipient===c.principal?a:recipient,11);if(kind===257||kind===262&&c.level===9)act(c.principal,74);}
  }
  if(h.flags&0x20){if(!(h.flags&0x2000)){if(recipient===c.principal)knocked=true;else act(recipient,44);}else if(recipient===c.principal)act(a,44);else knocked=true;}
  if(kind===81&&!(h.flags&0xc108)&&(!(h.flags&0x2000)||!(h.flags&0x20))){act(a,62,78,155);Object.assign(row(a).assignments,{effectResource:0x10f,numberValue:h.extra,numberStyle:5});}
  if(h.flags&0xe000)owned(recipient);if((kind===257||kind===262&&c.level===9)&&i+1<c.hits.length)act(c.principal,74);
  if(track){
   // A recipient can own a later strike once this result releases its queue.
   following.actors.add(recipient);
   following.strikes.push(Object.freeze({actor:a,slot:recipient,action,resultAction,last:attacker.actions.length-1,tuple,tupleEnd,wait,
    recipientActions:Object.freeze(receiver.actions.slice(wait))}));
  }
 }
 return {knocked};
}
