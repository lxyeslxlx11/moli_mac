/** Fixed37c4 424310 first72/113 nested script,followed by ordinary pair records. */
import{physicalGuardQueueTarget,appendPhysicalGuardRedirect,appendPhysicalGuardRelease,buildPhysicalGuardPairs}from'./legacy-game-battle-physical-guard-plan.mjs';
export function buildPhysicalNestedPairs(c,p){
 const {row,act,raw}=p,h=c.hits[0],a=h.actor,f=h.flags,n=h.nested;let knocked=false,t=h.target;
 if(n?.resources||h.resources&&n&&(n.flags&0x2000)&&(n.flags&0xc108))return{reason:'physical-family-nested-RID-storage-context'};
 const own=s=>{row(s).assignments.physicalFamily=1;};
 const scatter=s=>act(s,32,...(s===c.localSlot?[244]:[50,49]));
 function redirect(hit){
  const g=appendPhysicalGuardRedirect(hit,p);
  if(g===a||hit.target===a||hit.target===g)return null;
  const caster=row(a),guard=row(g),protectedRow=row(hit.target);
  return {caster:a,guard:g,protectedSlot:hit.target,wait:caster.actions.length-2,casterTuple:caster.tuples.length-1,
   release:guard.actions.length-4,guardTuple:guard.tuples.length-2,returnTuple:guard.tuples.length-1,
   protectedAction:protectedRow.actions.length-6,protectedTuple:protectedRow.tuples.length-1};
 }
 own(a);act(a,24,...(f&0x1010?[3,113]:[7,9,10]),242);raw(a,h);
 let outer,inner,shared=false,trackBothGuards=false;
 if(h.guard!==null){outer=redirect(h);act(t,11);t=h.guard;}
 let nt=n?.target??0;
 if(n?.guard!==null&&n?.guard!==undefined){
  nt=n.guard;
  inner=redirect({...n,actor:a});
  const ordinary=outer&&inner&&!((f|n.flags)&0xe168);
  trackBothGuards=ordinary&&h.guard!==n.target&&n.guard!==h.target;
  if(ordinary&&h.target===n.target){
   outer.earlyReturn=true;
   inner.previousProtectedStand=outer.protectedAction+5;
  }
  if(nt===h.guard){
   if(ordinary){
    // The shared guard performs both approaches before either final release.
    const tuples=row(nt).tuples,outerReturn=outer.returnTuple,innerApproach=inner.guardTuple;
    [tuples[outerReturn],tuples[innerApproach]]=[tuples[innerApproach],tuples[outerReturn]];
    outer.returnTuple=innerApproach;
    inner.guardTuple=outerReturn;
    shared=true;
   }else inner=null;
  }
  act(a,72);raw(a,{...h,target:t});
 }
 if(!n){
  act(a,61);Object.assign(row(a).assignments,{pairedTarget:t,effectResource:0x6e});act(a,39,73,78,71,5,39,78,5);
 }else{
  if(n.guard===null)act(a,71);Object.assign(row(a).assignments,{pairedTarget:t,effectResource:0x6e});act(a,39,73,78);
  if(n.guard!==null)act(a,71);act(a,72);
  if(inner)inner.departure={action:row(a).actions.length,type:232,targets:[inner.casterTuple,row(a).tuples.length]};
  raw(a,{...n,target:nt});act(a,232);raw(a,{...h,target:t});
  if(!(n.flags&0x2040))act(a,39,78,5);
 }act(a,74);own(t);act(t,0);
 if(!(f&0x108)){
  if(f&0x40){if(f&3){if(f&0x2000){act(a,32);act(t,119);act(a,...(a===c.localSlot?[244]:[50,49]));}else{act(t,32);if(h.guard!==null)act(t,71,72);act(t,...(t===c.localSlot?[244]:[50,49]));}}}
  else if(h.amount!==0&&(f&3)){
   if(f&0x8000)act(t,121);else if(f&0x4000)act(t,120);else if(f&0x2000){act(a,f&2?160:26);act(t,119);}
  }
 }
 const follower=physicalGuardQueueTarget(c,h,t);if(follower===undefined)return{reason:'physical-family-lookahead-context'};
 if(h.guard!==null){
  if(outer)outer.returnAction=row(t).actions.length+Number(h.amount===0);
  appendPhysicalGuardRelease(t,h,follower,p);
  if(shared&&h.amount===0&&follower>=0){
   // The outer action 3/72 consumes its look-ahead tuple before the inner return.
   const tuples=row(t).tuples,[innerReturn]=tuples.splice(inner.returnTuple,1);
   inner.returnTuple=tuples.length;
   tuples.push(innerReturn);
  }
  if(outer&&h.amount===0&&follower>=0&&!(f&0xe000))outer.turn=Object.freeze({slot:follower,tuple:row(t).tuples.length-(shared?2:1)});
 }
 if((h.amount!==0||(f&0x108))&&!(f&0xc000)){
  if(!(f&0x2000)){if(f&0x100)act(t,74);}
  else if(a!==follower)act(t===c.principal?a:t,11);
 }
 if(f&0x20){if(!(f&0x2000)){if(t===c.principal)knocked=true;else act(t,44);}else if(t===c.principal)act(a,44);else knocked=true;}
 if(!n)act(t,30);
 else{
  own(nt);
  if(shared)inner.resultWait=row(nt).actions.length;
  act(nt,0);
  if(!(f&0x108)&&n.amount!==0&&!(n.flags&0x40)&&(n.flags&3)){
   if(n.flags&0x8000)act(nt,121);else if(n.flags&0x4000)act(nt,120);else if(n.flags&0x2000){act(a,f&2?160:26);act(nt,119);}else act(nt,n.flags&2?160:26);
  }
 }
 Object.assign(row(a).assignments,{scriptSound:f&0x80000?0x101:0x102,messageResource:f&0x80000?0x573c:0x573d});act(a,79,66);
 if(!n||(n.flags&0x2040)!==0x2040){if(f&0x80000)act(a,55);else if(n)act(a,56,56);else act(a,58,35);}
 act(a,72);
 if(outer&&n&&(trackBothGuards||n.guard===null&&n.target!==outer.guard&&n.target!==a&&n.target!==h.target)){
  const caster=row(a),targets=[];
  for(let i=outer.casterTuple;i<caster.tuples.length;i++)if(caster.tuples[i][0]===outer.guard)targets.push(i);
  outer.departure={action:caster.actions.length-1,type:72,targets};
 }
 if(n&&!(f&0x108)){
  if((n.flags&0x40)&&(n.flags&3)){
   if(n.flags&0x2000){act(a,32);act(nt,119);act(a,...(a===c.localSlot?[244]:[50,49]));}
   else{act(nt,32);if(n.guard!==null)act(nt,71,72);act(nt,...(t===c.localSlot?[244]:[50,49]));}
  }
  const nf=physicalGuardQueueTarget(c,h,nt);if(nf===undefined)return{reason:'physical-family-lookahead-context'};
  if(n.guard!==null){
   act(t,11);
   if(inner)inner.returnAction=row(nt).actions.length+Number(n.amount===0);
   appendPhysicalGuardRelease(nt,n,nf,p);
   if(inner&&n.amount===0&&nf>=0&&!(n.flags&0xe000))inner.turn=Object.freeze({slot:nf,tuple:row(nt).tuples.length-1});
  }
  if((n.amount!==0||(n.flags&0x108))&&!(n.flags&0xc000)){
   if(!(n.flags&0x2000)){if(nt!==c.principal)act(nt,11);if(n.flags&0x100)act(nt,74);}
   else if(nt===c.principal)act(a,11);
  }
  // The original tail tests the outer result's KO/reflection flags and names
  // its outer recipient,even while comparing the nested recipient.
  if(f&0x20){if(!(f&0x2000)){if(nt===c.principal)knocked=true;else act(t,44);}else if(nt===c.principal)act(a,44);else knocked=true;}
 }
 const handoffs=[outer,inner].filter(Boolean),followingStrikes=[];
 if(c.hits.length>1){
  const actors=new Set(handoffs.filter(link=>link.departure).map(link=>link.guard));
  const out=buildPhysicalGuardPairs({...c,hits:c.hits.slice(1),startIndex:1,following:{actors,strikes:followingStrikes}},p);
  if(out.reason)return out;
  knocked||=out.knocked;
 }
 for(const link of handoffs){
  if(link.departure){Object.freeze(link.departure.targets);Object.freeze(link.departure);}
  Object.freeze(link);
 }
 return{knocked,handoffs:Object.freeze(handoffs),followingStrikes:Object.freeze(followingStrikes)};
}
