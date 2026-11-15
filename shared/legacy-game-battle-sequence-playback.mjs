/** Fixed37c4 body156/97/98 and shared58fac0. HP/RID settlement remains in body14. */
import{battleFail as fail}from'./legacy-game-battle-bytes.mjs';
const f=Math.fround;
// Original533968..533b3f. Beyond byte199 this is adjacent image data,
// not a declaration of a larger level table. Interleaved native98 uses the same address expression.
const sequenceBytes=Object.freeze([
 7,8,16,15,10,11,13,12,14,-1,0,0,0,0,0,0,0,0,0,0,10,10,10,10,10,10,10,10,10,10,-1,0,
 0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
 0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
 0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
 0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
 0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
 0,0,0,0,0,0,0,0,37,115,32,-126,-52,-113,-18,-107,-15,-126,-16,-110,-78,-126,-41,-126,-23,-126,-79,-126,-58,-126,-86,-113,
 111,-105,-120,-126,-56,-126,-87,-126,-63,-126,-67,0,37,115,32,-126,-52,70,80,-126,-51,32,37,100,47,37,100,0,37,115,32,-126,
 -52,76,80,-126,-51,32,37,100,47,37,100,0,-47,112,0,0,-47,112,0,0,-46,112,0,0,-46,112,0,0,-45,112,0,0,
 -45,112,0,0,-44,112,0,0,-44,112,0,0,-43,112,0,0,-43,112,0,0,-42,112,0,0,-42,112,0,0,-41,112,0,0,
 -41,112,0,0,-40,112,0,0,-40,112,0,0,-39,112,0,0,-39,112,0,0,-38,112,0,0,-38,112,0,0,-37,112,0,0,
 -37,112,0,0,-36,112,0,0,-36,112,0,0,-35,112,0,0,-35,112,0,0,-34,112,0,0,-34,112,0,0,-33,112,0,0,
 -33,112,0,0,-32,112,0,0,-32,112,0,0,-31,112,0,0,-31,112,0,0,-30,112,0,0,-30,112,0,0,-29,112,0,0,
 -29,112,0,0,-28,112,0,0,-28,112,0,0,-27,112,0,0,-27,112,0,0,-26,112,0,0,-26,112,0,0,-25,112,0,0,
 -25,112,0,0,-24,112,0,0,-24,112,0,0,-23,112,0,0,-23,112,0,0,-22,112,0,0
]);
function actionAt(level,cursor){const at=level*20+cursor;if(at<0||at>=sequenceBytes.length)fail('LEGACY_BATTLE_SEQUENCE_CONTEXT');return sequenceBytes[at];}
export function createBattleSequencePlayback(a,c,common){
 let cursor=0,used=false;
 const charge=(node,resource,result=false)=>{
  const b=node.body,q=node.player.copyState();
  a.allocate(result?'physical-result-charge':'charge',null,{parent:node,position:[b.position[0],f(b.position[1]+Math.trunc(q.drawOffsetY/2))],
   resourceId:resource,actorFlags:result?(c.alternativeRenderer?0x140000:0x48000):0x40000,drawPriority:204,
   ...(result?{screenSpace:true,facing:0,drawFlagMask:4,drawFlagValue:4}:{})});b.skillStatus=1;
 };
 return Object.freeze({snapshot:()=>used?Object.freeze({cursor}):null,
  body(node,ctx){const b=node.body,type=b.state;if(!b.physicalFamily||![97,98,156].includes(type))return false;used=true;
   if(type===156){if(!(b.dynamicFlags&0x60))a.animate(node,0,ctx.mainState);if(b.skillStatus===0)charge(node,0x1adbc);b.state=157;}
   else if(type===97){b.speedPercent=25;a.pop(b);node.player.resetFrames();}
   else{
    const at=b.tupleRead*4,other=a.get(b.tuples[at]);if(!other)fail('LEGACY_BATTLE_PHYSICAL_TARGET_REMOVED');const victim=a.node(other);if(!victim)fail('LEGACY_BATTLE_BODY_OWNER');
    const q=node.player.copyState();if(q.nextFrame===0&&q.delay===0){b.animationAction=actionAt(b.skillLevel,cursor);cursor=(cursor+1)|0;}
    if(a.animate(node,1,ctx.mainState)===1){
     const flags=b.tuples[at+1]>>>0;other.reactionFlags=flags;
     if(flags&0x2000)charge(victim,0x1ae1d,true);
     else if(flags&0x8000)charge(victim,0x1ae2d,true);
     else if(flags&0x4000)charge(victim,0x1ae25,true);
     else{other.state=25;common.impact(victim,flags&4?110000:flags&0x400?0x1ae12:0x1ae35);a.extraImpact(node,victim);}
     a.sound(node,c.random.range(131,132));node.player.resetFrames();node.player.clearSignal();
     if(actionAt(b.skillLevel,cursor)<0){cursor=0;a.pop(b);}
    }
   }a.screen(node);return true;
  },
 });
}
