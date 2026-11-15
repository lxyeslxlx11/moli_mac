/** Fixed37c4 424310 first class96 pair script;remaining records use kind=-1. */
import{appendPhysicalGuardRedirect,appendPhysicalGuardRelease,physicalGuardLookAhead,buildPhysicalGuardPairs}from'./legacy-game-battle-physical-guard-plan.mjs';
export function buildPhysicalSpecial96Pairs(c,p){
 const{row,act,raw}=p,h=c.hits[0],a=h.actor,f=h.flags;let t=h.target,knocked=false;
 row(a).assignments.physicalFamily=1;act(a,24,...(f&0x1010?[3,113]:[]),242);raw(a,h);
 if(h.guard!==null){appendPhysicalGuardRedirect(h,p);act(t,11);t=h.guard;}
 Object.assign(row(a).assignments,{effectResource:0x3e,scriptSound:0xd2,scriptAuxSound:0x85,messageResource:0x5783});
 act(a,78,75,34,89,34,92,90,34,76,34,73,79,93,74,62,80,66,95,35,94,71,72);
 row(t).assignments.physicalFamily=1;act(t,0);
 if(!(f&0x108)){
  if(f&0x40){if(f&3){const moving=f&0x2000?a:t;act(moving,32);if(f&0x2000)act(t,119);else if(h.guard!==null)act(t,71,72);act(moving,...(moving===c.localSlot?[244]:[50,49]));}}
  else if(h.amount!==0&&(f&3)){
   if(f&0x8000)act(t,121);else if(f&0x4000)act(t,120);else if(f&0x2000){act(a,f&2?160:26);act(t,119);}else act(t,f&2?160:26);
  }
 }
 const next=physicalGuardLookAhead(c.words,c.ends.get(h),t);if(next===undefined||next>=0&&(next>21||!c.get(next)))return{reason:'physical-family-lookahead-context'};
 if(h.guard!==null)appendPhysicalGuardRelease(t,h,next,p);
 if((h.amount!==0||(f&0x108))&&!(f&0xc000)){
  if(!(f&0x2000)){if(f&0x100)act(t,74);}else if(a!==next)act(t===c.principal?a:t,11);
 }
 if(f&0x20){if(!(f&0x2000)){if(t===c.principal)knocked=true;else act(t,45,44);}else if(t===c.principal)act(a,44);else knocked=true;}
 if(c.hits.length>1){const out=buildPhysicalGuardPairs({...c,hits:c.hits.slice(1),startIndex:1},p);if(out.reason)return out;knocked||=out.knocked;}
 return{knocked};
}
