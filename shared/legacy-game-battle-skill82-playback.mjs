/** Source82 scale/spin, simultaneous target results and shared background ownership. */
import {battleFail as fail} from './legacy-game-battle-bytes.mjs';
const f=Math.fround,increment=f(0.01),types=new Set([34,83,84,87,89]);
export function createBattleSkill82Playback(a,c,common){
  function body(node,ctx){const b=node.body,type=b.state;if(!common.configured()||!([82,98].includes(b.classCode)||b.classCode===97&&[84,87].includes(type)||b.classCode===116&&type===83)||!types.has(type))return false;
    if(type===83){b.animationAction=9;b.scale=b.scale.map(n=>f(n+increment));b.facing=(b.facing+1)&7;
      if(b.scale[0]>=2){common.impact(node,0x1ae4a);a.pop(b);}if(!(b.dynamicFlags&0x60))a.animate(node,0,ctx.mainState);
    }else if(type===34){if(!(b.dynamicFlags&0x60))a.animate(node,0,ctx.mainState);if(++b.counter>=30){b.counter=0;a.pop(b);}}
    else if(type===89){b.actorFlags|=2;a.pop(b);a.animate(node,0,ctx.mainState);}
    else if(type===87){a.shake(0);a.pop(b);}
    else{
      let done=false,count=0;do{if(++count>199)fail('LEGACY_BATTLE_BODY_CAPACITY');let at=b.tupleRead*4,t={slot:b.tuples[at],flags:b.tuples[at+1]>>>0,amount:b.tuples[at+2]},target=a.get(t.slot);
        if(!target)fail('LEGACY_BATTLE_SKILL82_TARGET_REMOVED');const victim=a.node(target);if(!victim)fail('LEGACY_BATTLE_BODY_OWNER');
        target.frozen=0;a.aim(target,b.position,true);target.reactionFlags=t.flags;a.metadata(node);
        at=b.tupleRead*4;t={slot:b.tuples[at],flags:b.tuples[at+1]>>>0,amount:b.tuples[at+2]};
        if(t.flags&0x20){target.dynamicFlags|=2;target.auxFF8=1;a.setSlow(1);}
        if(t.flags&0x100000){a.removeChild(victim,'status');target.dynamicFlags&=~0x20;}
        if(t.amount===0&&(t.flags&0x10000000))a.message(victim,0x57bb);
        else{common.number(victim,t.amount,6);if(t.flags&2)a.message(victim,0x57b6);a.feedback(node,victim);}
        const before=target.vitals[0],value=Math.max(0,(before-t.amount)|0);target.vitals[0]=value;a.event({kind:'battle-vital',slot:target.slot,field:'HP',before,value,delta:value-before});
        a.restart(target);if(target.state===0)a.pop(target);if(b.tupleRead>=199)fail('LEGACY_BATTLE_BODY_CAPACITY');done=b.tuples[++b.tupleRead*4]===-1;
      }while(!done);a.shake(1,6);a.pop(b);
    }
    a.screen(node);return true;
  }
  return Object.freeze({body,validate(plan){for(const h of plan.hits)if(h.amount!==0||!(h.flags&0x10000000))for(const ch of String(h.amount))common.image(243760-48+ch.charCodeAt(0));}});
}
