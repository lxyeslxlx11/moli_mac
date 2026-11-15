/** Fixed37c4 102/103/104,detached107/108 and eject109 callbacks. */
import {battleFail as fail} from './legacy-game-battle-bytes.mjs';
import {LEGACY_GAME_BATTLE_UPPER_SKILLS_PROFILE as profile} from './legacy-game-battle-upper-skills.mjs';
const f=Math.fround,classes=new Set(profile.classes),types=new Set([57,73,87,102,103,104,105,107,108,109,156]);
const tiers=[3,3,3,2,2,2,1,1,1,0];
export function createBattleUpperSkillsPlayback(a,c,common){
  const tuple=b=>{const at=b.tupleRead*4;return {slot:b.tuples[at],flags:b.tuples[at+1]>>>0,amount:b.tuples[at+2],extra:b.tuples[at+3]};};
  const advance=b=>{if(b.tupleRead>=199)fail('LEGACY_BATTLE_BODY_CAPACITY');return b.tuples[++b.tupleRead*4]===-1;};
  const nodeFor=b=>{const node=a.node(b);if(!node)fail('LEGACY_BATTLE_BODY_OWNER');return node;};
  const target=b=>{const other=a.get(tuple(b).slot);if(!other)fail('LEGACY_BATTLE_UPPER_SKILL_TARGET_REMOVED');return other;};
  function zeroHP(body){c.random.next();const before=body.vitals[0];body.vitals[0]=0;
    a.event({kind:'battle-vital',slot:body.slot,field:'HP',before,value:0,delta:-before});}
  function smoke(parent){const b=parent.body,q=parent.player.copyState();
    const speedPercent=c.random.range(10,200),angle=c.random.range(0,359),speed=c.random.range(5,20);
    return a.allocate('upper-skill-smoke',null,{parent,manualScreen:true,drawPriority:204,resourceId:0x1adb4,
      position:[b.position[0],f(b.position[1]+Math.trunc(q.drawOffsetY/2))],actorFlags:0x40000,
      facing:0,speedPercent,angle,speed});
  }
  function clone(parent,ctx){const p=parent.body,n=a.detachedBody(parent,ctx),b=n.body;
    n.upperDetached=true;b.slot=-1;b.resourceId=0x18aa7;b.actorFlags|=c.alternativeRenderer?0x100000:0x8000;b.afterImageEnabled=1;
    a.append(b,p.owner,[24,108,105]);const t=tuple(p);a.appendTuple(b,[t.slot,t.flags|0,t.amount,t.extra]);
    a.pop(b);a.pop(p);
  }
  function orbit(node,ctx){const b=node.body,other=target(b),old=b.counter;
    b.animationAction=16;b.speedPercent=50;
    if(b.slot!==other.slot){
      b.position=old<31?[other.position[0],f(other.position[1]-70)]:old<61?[f(other.position[0]+70),other.position[1]]:
        old<91?[other.position[0],f(other.position[1]+70)]:[f(other.position[0]-70),other.position[1]];
      a.aim(b,other.position,true);
    }
    b.counter=old+1;
    if(old>119){b.counter=0;b.speedPercent=100;a.pop(b);if(b.slot!==other.slot)a.pop(other);}
    a.animate(node,0,ctx.mainState);
  }
  function rush(node,ctx){const b=node.body;
    b.animationAction=3;b.speed=16;b.speedPercent=290;
    const other=a.get(tuple(b).slot);if(other)a.aim(b,other.position,true);
    const old=b.counter,now=old+1;b.counter=now;let suppressAnimation=false,move=false;
    if(old<60||(b.upperFinish??0)!==0){
      if(now<60&&(b.upperFinish??0)===0)b.speedPercent+=now*-4;
      else if(b.upperFinish){
        const cooldown=b.attackCooldown;b.attackCooldown=cooldown-1;
        if(cooldown!==0){b.speed=2;b.speedPercent=100;suppressAnimation=true;move=true;}
      }
    }else{
      b.speedPercent=50;
      if(!other)fail('LEGACY_BATTLE_UPPER_SKILL_TARGET_REMOVED');
      if(a.distance(b,other.position)<70){
        if(b.slot>=0){let count=0;do{
          if(++count>199)fail('LEGACY_BATTLE_BODY_CAPACITY');
          const victim=target(b),victimNode=nodeFor(victim);a.aim(victim,b.position,true);victim.reactionFlags=tuple(b).flags;
          a.metadata(node,b.slot);const flags=tuple(b).flags;
          if(flags&8)victim.state=29;
          else if(flags&0x80000){
            if(!(flags&0xe000)){
              const impact=common.impact(victimNode,0x1adb1+c.random.range(0,2));a.extraImpact(node,victimNode);
              impact.scale=[2,2];a.sound(node,0x84);zeroHP(victim);
              if(flags&0x20){victim.dynamicFlags|=2;victim.auxFF8=1;a.setSlow(1);}
            }
            if(flags&0x2000){
              const impact=common.impact(node,0x1adb1+c.random.range(0,2));a.extraImpact(node,victimNode);
              impact.scale=[2,2];a.sound(node,0x84);zeroHP(b);
              if(flags&0x20){b.dynamicFlags|=2;b.auxFF8=1;a.setSlow(1);}
              a.pop(b);
            }
          }
          a.pop(victim);b.attackCooldown=(((flags>>>19)&1)+1)*14;
        }while(!advance(b));}
        a.move(b);b.counter=0;b.upperFinish=1;b.afterImageEnabled=0;b.animationAction=5;node.player.clearSignal();
        let count=0;
        while(node.player.copyState().signal<10000||node.player.copyState().signal>19999){
          if(++count>65536)fail('LEGACY_BATTLE_BODY_ANIMATION_BUDGET');a.animate(node,0,ctx.mainState);
        }
        node.player.clearSignal();
      }else move=true;
    }
    if(move)a.move(b);
    if((b.upperFinish??0)===0||b.attackCooldown!==0){if(!suppressAnimation)a.animate(node,0,ctx.mainState);}
    else{b.speed=8;b.speedPercent=100;b.animationAction=3;b.counter=b.upperFinish=b.attackCooldown=0;a.pop(b);}
  }
  function eject(node,ctx){const b=node.body;
    node.upperDeparture=true;
    b.animationAction=8;b.speedPercent=100;const count=++b.attackFinishCounter,limit=(((b.dynamicFlags>>>1)&1)+1)*14;
    if(count<limit){
      b.speed=-2;if(b.dynamicFlags&2){a.setSlow(1);b.auxFF8=1;a.move(b);a.animate(node,0,ctx.mainState);return;}
    }else{
      if(count===limit){
        a.sound(node,0xcf);
        if(b.dynamicFlags&2){if(a.countAux()<2)a.setSlow(0);b.auxFF8=0;b.savedFlags|=2;}
        for(let i=0;i<40;i++)smoke(node);
        b.counter=b.attackCooldown=0;b.speed=32;b.angle=f(b.angle+180);if(b.angle>=360)b.angle=f(b.angle-360);
      }
      const [x,y]=b.position;
      if(x< -200||x>840||y< -200||y>680){a.pop(b);b.attackCooldown=0;a.shake(1,6);}
    }
    a.move(b);a.animate(node,0,ctx.mainState);
  }
  return Object.freeze({
    body(node,ctx){const b=node.body,type=b.state;
      if(!common.configured()||!classes.has(b.classCode)||!types.has(type))return false;
      if(type===102){
        let count=0;while(tuple(b).slot!==-1){
          if(++count>199)fail('LEGACY_BATTLE_BODY_CAPACITY');
          const t=tuple(b),other=target(b);
          if(b.slot===ctx.localSlot)a.event({kind:'battle-information',caster:b.slot,slot:other.slot,success:!!(t.flags&0x80000),
            nameBytes:other.nameBytes?.slice()??new Uint8Array(),...(t.flags&0x80000?{values:Object.freeze([...other.vitals])}:{}),
            legacyPrintf:t.flags&0x80000?'boxed-varargs-unmodeled':'name-only'});
          advance(b);
        }
        advance(b);a.pop(b);
      }else if(type===103)orbit(node,ctx);
      else if(type===104){b.animationAction=13;a.pop(b);}
      else if(type===107)clone(node,ctx);
      else if(type===108)rush(node,ctx);
      else if(type===109)eject(node,ctx);
      else if(type===105){if(!node.upperDetached)fail('LEGACY_BATTLE_UPPER_SKILL_DETACHED_OWNER');node.deleted=b.deleted=true;}
      else if(type===73){b.afterImageEnabled=1;a.pop(b);}
      else if(type===87){a.shake(0);a.pop(b);}
      else if(type===57){b.animationAction=15;if(a.animate(node,1,ctx.mainState)===1){node.player.resetFrames();a.pop(b);}}
      else{
        if(!(b.dynamicFlags&0x60))a.animate(node,0,ctx.mainState);
        if(b.skillStatus===0){a.allocate('charge',null,{parent:node,position:[...b.position],resourceId:0x1adbc,
          actorFlags:0x40000,drawPriority:204,facing:0,drawFlagMask:4,drawFlagValue:4});b.skillStatus=1;}
        b.state=157;
      }
      a.screen(node);return true;
    },
    effect(node,ctx){if(node.kind!=='upper-skill-smoke')return false;
      a.move(node);if(a.animate(node,1,ctx.mainState)===1)node.deleted=true;
      node.screen=node.position.map(value=>Math.trunc(value)|0);return true;
    },
    validate(plan){if(!classes.has(plan.category))return;
      const required=resource=>{if(!a.probeAnimation(resource,0).state.geometry)fail('LEGACY_BATTLE_SKILL_ANIMATION_REQUIRED');};
      if(plan.category!==114)required(0x1ae14+tiers[plan.level]);
      if(plan.category===108){
        if(plan.hits.some(hit=>hit.flags&0x80000))required(0x1ae05+tiers[plan.level]);
        for(const hit of plan.hits)if(hit.flags&0x80000)common.validateStatus({style:5,amount:hit.amount});
      }
      if(plan.category===112){required(0x1adbc);required(0x18aa7);required(0x1adb4);}
    },
  });
}
