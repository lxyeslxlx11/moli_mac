/** Fixed37c4 first260 chain,followed by ordinary424310 pairs. */
import{battleFail as fail}from'./legacy-game-battle-bytes.mjs';
import{physicalGuardLookAhead,appendPhysicalGuardRedirect,appendPhysicalGuardRelease,buildPhysicalGuardPairs}from'./legacy-game-battle-physical-guard-plan.mjs';
export function buildPhysicalChainPairs(c,p){
 const{row,act,raw}=p,h=c.hits[0],a=h.actor,f=h.flags,n=h.nested;let t=h.target,nt=n?.target??-1,knocked=false;
 const own=s=>{row(s).assignments.physicalFamily=1;};
 const next=s=>{const v=physicalGuardLookAhead(c.words,c.ends.get(h),s,c.lookaheadTail);return v===undefined||v>=0&&(v>21||!c.get(v))?undefined:v;};
 function metadata(s,target,hit){
  if(!hit.resources)return null;const r=row(s),last=r.tuples.at(-1);let fourth=last[3];
  if(last.length===3){const b=c.get(s);if(!Number.isInteger(b?.tupleWrite)||!ArrayBuffer.isView(b?.tuples)||b.tuples.length!==800)return'physical-family-tuple-storage-context';const i=b.tupleWrite+r.tuples.length-1;if(i>=199)fail('LEGACY_BATTLE_BODY_CAPACITY');fourth=b.tuples[i*4+3];}
  const[x,y,z]=hit.resources;r.tuples.push([target,hit.flags|0,x,y],[target,hit.flags|0,z,0],[last[0],last[1],last[2],fourth]);return null;
 }
 own(a);act(a,24,...(f&0x1010?[3,113,201]:[203,201]),242);raw(a,h);
 if(h.guard!==null){appendPhysicalGuardRedirect(h,p);act(t,11);t=h.guard;}
 if(c.partialChain)return{knocked:false};
 if(n&&nt!==255&&n.guard!==null){appendPhysicalGuardRedirect({...n,actor:a},p);act(nt,11);nt=n.guard;raw(a,{...h,target:t});act(a,72);}
 if(c.level===9){act(a,72);row(a).tuples.push([1,0,15]);act(a,240);raw(a,{...h,target:t});}
 let problem=metadata(a,t,h);if(problem)return{reason:problem};act(a,14);own(t);act(t,0);
 if(!(f&0x108)){
  if(f&0x40){if(f&3){const moving=f&0x2000?a:t;act(moving,32);if(f&0x2000)act(t,119);else if(h.guard!==null)act(t,71,72);act(moving,...(moving===c.localSlot?[244]:[50,49]));}}
  else if(h.amount!==0&&(f&3)){
   if(f&0x8000)act(t,121);else if(f&0x4000)act(t,120);else if(f&0x2000){act(a,f&2?160:26);act(t,119);}
   else if(!n||nt===255)act(t,f&2?160:26);
   else{
    const follower=next(nt);if(follower===undefined)return{reason:'physical-family-lookahead-context'};
    act(t,204);raw(t,{...n,target:nt});problem=metadata(t,nt,n);if(problem)return{reason:problem};own(nt);act(nt,0);
    if(!(n.flags&0x40)){
     if(n.flags&0x8000)act(nt,121);else if(n.flags&0x4000)act(nt,120);else if(n.flags&0x2000)act(nt,119);else if(!(n.flags&0x10000108))act(nt,n.flags&2?160:26);
    }else if(n.flags&3){
     const moving=n.flags&0x2000?t:nt;if(n.flags&0x2000){act(t,201,32);act(nt,119);}else{act(nt,32);if(n.guard!==null)act(nt,71,72);}
     act(moving,...(moving===c.localSlot?[244]:[50,49]));
    }
    if(n.guard!==null)appendPhysicalGuardRelease(nt,n,follower,p);
    if(n.amount!==0||(n.flags&0x108)){
     if(!(n.flags&0x10000000)){if(n.guard===null||follower<0)act(nt,11);else{act(nt,3);raw(nt,{target:follower,flags:0,amount:0,resources:null});act(nt,72);}}
     if(n.flags&0x100)act(nt,74);
    }
    if(n.flags&0x20){if(!(n.flags&0x2000)){if(nt===c.principal)knocked=true;else act(nt,44);}else if(nt===c.principal)act(nt,44);else knocked=true;}
   }
  }
 }
 const follower=next(t);if(follower===undefined)return{reason:'physical-family-lookahead-context'};
 if(h.guard!==null)appendPhysicalGuardRelease(t,h,follower,p);
 if((h.amount!==0||(f&0x108))&&!(f&0xc000)){
  if(!(f&0x2000)){if(t!==c.principal)act(t,follower<0?11:243);if(f&0x100)act(t,74);}
  else if(a!==follower)act(t===c.principal?a:t,11);
 }
 if(f&0x20){if(!(f&0x2000)){if(t===c.principal)knocked=true;else act(t,44);}else if(t===c.principal)act(a,44);else knocked=true;}
 if(c.hits.length>1){const out=buildPhysicalGuardPairs({...c,hits:c.hits.slice(1),startIndex:1},p);if(out.reason)return out;knocked||=out.knocked;}
 return{knocked};
}
