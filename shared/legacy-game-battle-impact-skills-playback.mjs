/** Fixed37c4 result-body factories and five impact-family callback chains. */
import {battleFail as fail} from './legacy-game-battle-bytes.mjs';
import {legacyGameBattleSine} from './legacy-game-battle-math.mjs';
import {LEGACY_GAME_BATTLE_IMPACT_SKILLS_PROFILE as profile} from './legacy-game-battle-impact-skills.mjs';
const f=Math.fround,classes=new Set(profile.classes),tiers=[3,3,3,2,2,2,1,1,1,0];
const positions=[[[285,105],[222,142],[158,178],[94,214],[30,250],[345,156],[281,192],[218,228],[154,264],[90,300]],
 [[610,290],[545,325],[480,360],[415,395],[350,430],[545,240],[481,276],[418,313],[354,349],[290,385]]];
export function createBattleImpactSkillsPlayback(a,c,common){
  const tuple=b=>{const at=b.tupleRead*4;return {slot:b.tuples[at],flags:b.tuples[at+1]>>>0,amount:b.tuples[at+2],extra:b.tuples[at+3]};};
  const advance=b=>{if(b.tupleRead>=199)fail('LEGACY_BATTLE_BODY_CAPACITY');return b.tuples[++b.tupleRead*4]===-1;};
  const nodeFor=b=>{const node=a.node(b);if(!node)fail('LEGACY_BATTLE_BODY_OWNER');return node;};
  const target=b=>{const body=a.get(tuple(b).slot);if(!body)fail('LEGACY_BATTLE_IMPACT_TARGET_REMOVED');return body;};
  function vital(node,body,amount,healing=false){
    const before=body.vitals[0],raw=(healing?before+amount:before-amount)|0,value=healing?Math.min(body.vitals[1],raw):Math.max(0,raw);
    if(!healing&&raw<0)c.random.next();body.vitals[0]=value;
    a.event({kind:a.get(body.slot)===body?'battle-vital':'battle-detached-vital',slot:body.slot,nodeId:node.id,field:'HP',before,value,delta:value-before});
  }
  function number(node,caster,amount,style,flags,feedback=node){
    if(amount===0&&(flags&0x10000000))common.message(node,0x57bb);
    else{common.number(node,amount,style);if(flags&2)common.message(node,0x57b6);a.feedback(caster,feedback);}
  }
  function killFlag(body){body.dynamicFlags|=2;body.auxFF8=1;a.setSlow(1);}
  function clearStatus(node,flags){if(flags&0x100000){a.removeChild(node,'status');node.body.dynamicFlags&=~0x20;}}
  function emitter(node,ctx){const b=node.body;b.animationAction=5;b.speedPercent=100;
    if(tuple(b).slot!==-1)a.aim(b,target(b).position,true);
    if(a.animate(node,1,ctx.mainState)===1)a.pop(b);
    const signal=node.player.copyState().signal;
    if(signal>9999&&signal<20000){let count=0;do{
      if(++count>199)fail('LEGACY_BATTLE_BODY_CAPACITY');a.impactProjectile(node,ctx);
    }while(!advance(b));a.sound(node,0xfe);node.player.clearSignal();}
  }
  function sparks(node,ctx){const b=node.body,side=b.slot<10?0:1;
    for(const [x,y]of positions[side])if(c.random.range(0,2)===0){
      const resource=0x1adb7+c.random.range(-1,0),dy=c.random.range(side?-80:-60,0),dx=c.random.range(side?-40:-30,side?40:30);
      a.allocate('impact-skill-spark',null,{manualScreen:true,position:[0,0],screen:[x+dx,y+dy],
        resourceId:resource,actorFlags:c.alternativeRenderer?0x140000:0x48000,drawPriority:204,facing:0,drawFlagMask:4,drawFlagValue:4});
      if(c.random.range(0,30)===0)a.soundAt(0x107,[320,240],node);
    }
    if(++b.counter>269){b.counter=0;a.pop(b);a.soundAt(0x107,[320,240],node);}a.animate(node,0,ctx.mainState);
  }
  function clones(node,ctx){const p=node.body;let count=0;
    do{
      if(++count>199)fail('LEGACY_BATTLE_BODY_CAPACITY');const n=a.detachedBody(node,ctx),b=n.body,t=tuple(p);
      n.impactClone=true;b.vitals=[0,0,0,0];a.append(b,p.owner,[24,75,89,9,90,14,105]);a.appendTuple(b,[t.slot,t.flags|0,t.amount,t.extra]);a.pop(b);
    }while(!advance(p));a.pop(p);
  }
  function cloneHit(node,ctx){const b=node.body;b.animationAction=5;b.speedPercent=100;const signal=node.player.copyState().signal;
    if(signal>9999){const other=target(b),victim=nodeFor(other),initial=tuple(b);
      const resource=initial.flags&4?110000:initial.flags&0x400?0x1ae12:0x1adb1+c.random.range(0,2);
      other.frozen=0;other.classCode=-1;other.attackerSlot=b.slot;other.reactionFlags=initial.flags;a.aim(other,b.position,true);
      const final=signal<20000||!!(initial.flags&0x2000);
      if(final)a.metadata(node,b.slot);let t=tuple(b);
      if(t.flags&0xe000){
        if(t.flags&0x108){if(t.flags&8)other.state=29;else if(!final||other.afterImageEnabled===0){other.afterImageEnabled=1;other.state=29;a.sound(node,0xd2);}}
        else{
          if(!(t.flags&0xc000)&&t.amount!==0){
            other.position=[...other.rememberedPosition];
            if(final&&(t.flags&0x2000)){
              if(t.flags&2)common.impact(node,0x1adb8);common.impact(victim,resource);a.extraImpact(node,victim);b.reactionFlags=0x2000;if(t.flags&0x20)killFlag(b);
            }else{clearStatus(victim,t.flags);if(t.flags&2)common.impact(victim,0x1adb8);common.impact(victim,resource);a.extraImpact(node,victim);if(!final)other.state=25;}
            a.sound(node,signal-(signal<20000?10000:20000));
          }
          if(final){
            if(t.flags&0x8000)a.pop(other);
            else if(t.flags&0x4000){a.pop(other);vital(victim,other,t.amount,true);number(victim,node,t.amount,5,t.flags);}
            else{a.pop(b);a.pop(other);vital(node,b,t.amount);number(node,node,t.amount,6,t.flags,victim);advance(b);}
          }
        }
      }else if(!(t.flags&0x108)){
        if(t.amount!==0){other.position=[...other.rememberedPosition];clearStatus(victim,t.flags);if(t.flags&2)common.impact(victim,0x1adb8);common.impact(victim,resource);a.extraImpact(node,victim);
          if(final&&(t.flags&0x20))killFlag(other);a.sound(node,signal-(signal<20000?10000:20000));}
        if(final){a.pop(other);if(t.amount===0){const recipient=a.get(t.slot);if(!recipient)fail('LEGACY_BATTLE_IMPACT_MESSAGE_TARGET_REMOVED');common.message(nodeFor(recipient),t.flags&0x10000000?0x57bb:0x573b);}else{vital(victim,other,t.amount);number(victim,node,t.amount,6,t.flags);}}
        else if(t.amount!==0)other.state=25;
      }else if(t.flags&8)other.state=29;
      else if(!final||other.afterImageEnabled===0){other.afterImageEnabled=1;other.state=29;a.sound(node,0xd2);}
      t=tuple(b);if(!(t.flags&8)&&t.amount!==0)b.attackCooldown=(((other.dynamicFlags>>>1)&1)+1)*14;node.player.clearSignal();
    }
    if(b.attackCooldown>0)b.attackCooldown--;
    if(b.attackCooldown===0){if(b.attackFinishCounter===0){if(a.animate(node,1,ctx.mainState)!==1)return;}
      else if(b.attackFinishCounter>10){a.pop(b);advance(b);b.attackCooldown=b.attackFinishCounter=0;return;}b.attackFinishCounter++;}
  }
  function burst(node,ctx,kind){const b=node.body;let count=0;
    do{
      if(++count>199)fail('LEGACY_BATTLE_BODY_CAPACITY');const t0=tuple(b),other=target(b),victim=nodeFor(other);
      const resource=t0.flags&4?110000:t0.flags&0x400?0x1ae12:kind===106&&(t0.flags&0x200||b.tupleRead===0)?0x1ae37:0x1adb1+c.random.range(0,2);
      const caster=kind===112?nodeFor(a.get(b.slot)):node;
      a.aim(other,kind===112&&b.skillLevel<9?caster.body.position:b.position,true);
      if(kind===106&&b.tupleRead===0)common.impact(victim,0x1adbe);
      other.reactionFlags=t0.flags;a.metadata(node,b.slot);
      if(kind===112&&b.tupleRead===0&&b.skillLevel<9){const effect=common.impact(node,0x1ae4e),increment=f(Math.trunc(b.skillLevel/10)+0.1);effect.scale=[f(1+increment),f(1+increment)];}
      const t=tuple(b);
      if(t.flags&8)other.state=29;
      else if(t.flags&0x100){other.afterImageEnabled=1;other.state=29;a.sound(node,0xd2);}
      else{
        if(!(t.flags&0xe000)&&t.amount!==0){
          if(t.flags&2)common.impact(victim,0x1adb8);common.impact(victim,resource);a.extraImpact(caster,victim);a.sound(node,kind===106?0x86:0x10b);vital(victim,other,t.amount);if(t.flags&0x20)killFlag(other);
        }
        if(!(t.flags&0xe000)){clearStatus(victim,t.flags);a.pop(other);number(victim,caster,t.amount,6,t.flags);}
        else if(t.flags&0x8000)a.pop(other);
        else if(t.flags&0x4000){a.pop(other);vital(victim,other,t.amount,true);number(victim,caster,t.amount,5,t.flags);}
        else a.pop(other);
      }
      if(!(t.flags&8)&&t.amount!==0)b.attackCooldown=(((other.dynamicFlags>>>1)&1)+1)*14;
    }while(!advance(b));
  }
  function multiHit(node,ctx){const b=node.body;b.animationAction=5;b.speedPercent=200;const signal=node.player.copyState().signal;
    if(signal>9999&&signal<20000){burst(node,ctx,106);b.speed=8;b.speedPercent=100;b.counter=0;node.player.clearSignal();}
    if(a.animate(node,1,ctx.mainState)===1)a.pop(b);
  }
  function flight(node,ctx){const b=node.body;
    if(a.animate(node,1,ctx.mainState)===1)a.pop(b);
    b.animationAction=(b.resourceId>=100000&&b.resourceId<=100999||b.resourceId>=0x19a28&&b.resourceId<=0x1a130)?7:5;
    if(b.skillLevel<9)a.aim(b,target(b).position,true);
    const signal=node.player.copyState().signal;if(signal<10000||signal>19999)return;
    const back=a.detachedBody(node,ctx),q=node.player.copyState(),t=tuple(b),x=target(b);
    back.body.resourceId=0x565a;back.body.animationAction=back.body.facing=0;a.animate(back,0,ctx.mainState);
    const front=a.detachedBody(node,ctx);
    front.body.resourceId=0x666c;front.body.animationAction=front.body.facing=0;a.animate(front,0,ctx.mainState);
    front.impactBall=true;front.impactBack=back;front.parent=back;front.body.skillLevel=b.skillLevel;
    const point=b.skillLevel===9?(t.slot<10?[449,336]:[188,203]):x.position.map(Math.trunc);
    if(b.skillLevel===9)a.aim(b,point,true);
    front.body.position[1]=f(front.body.position[1]+Math.trunc(q.drawOffsetY/2));front.screen=front.body.position.map(Math.trunc);
    a.aim(front.body,point,true);a.aim(back.body,point,true);
    const dx=Math.abs(point[0]-front.screen[0]),dy=Math.abs(point[1]-front.screen[1]);
    const first=f(Math.abs(legacyGameBattleSine(f(front.body.angle+90)))*f(dx*f(0.016666668)));
    front.body.speed=f(Math.abs(legacyGameBattleSine(front.body.angle))*f(dy/60)+first);
    front.impactFlatY=front.body.position[1];front.impactDuration=60;front.height=100;front.impactAcceleration=f(100/900);front.impactPoint=point;
    a.append(front.body,b.owner,[111,...(b.skillLevel===9?[83,34]:[]),112,105]);
    if(b.skillLevel<9)a.appendTuple(front.body,[t.slot,t.flags|0,t.amount,t.extra]);
    else{let count=0;do{if(++count>199)fail('LEGACY_BATTLE_BODY_CAPACITY');const t=tuple(b);a.appendTuple(front.body,[t.slot,t.flags|0,t.amount,t.extra]);}while(!advance(b));}
    front.body.tupleRead=0;a.pop(front.body);node.player.clearSignal();
    if(b.skillLevel<9&&b.tuples[(b.tupleRead+1)*4]>=0)a.pop(b);
  }
  function arc(node){const b=node.body,back=node.impactBack;
    b.position[1]=node.impactFlatY;a.move(b);
    back.body.position=[b.position[0],f(b.position[1]-node.player.copyState().drawOffsetY)];
    node.impactFlatY=b.position[1];const delta=b.counter-Math.trunc(node.impactDuration/2);
    b.position[1]=f(f(f(delta*delta)*node.impactAcceleration-node.height)+b.position[1]);const old=b.counter++;
    if(old>=node.impactDuration){b.position=[...node.impactPoint];a.pop(b);back.deleted=back.body.deleted=true;b.counter=0;}
  }
  return Object.freeze({
    body(node,ctx){const b=node.body,type=b.state;if(!common.configured()||!classes.has(b.classCode)&&!node.impactClone&&!node.impactBall)return false;
      if(node.impactClone&&type===24){const t=tuple(b),other=a.get(t.slot);if(!other||b.slot===t.slot||other.state===0){if(other)other.rememberedPosition=[...nodeFor(other).screen];a.pop(b);}else{b.animationAction=0;if(!(b.dynamicFlags&0x60))a.animate(node,0,ctx.mainState);}}
      else if(node.impactClone&&type===14)cloneHit(node,ctx);
      else if(type===68&&b.classCode===4)emitter(node,ctx);
      else if(type===85&&b.classCode===97)sparks(node,ctx);
      else if(type===86&&b.classCode===97){a.shake(1,6);a.pop(b);}
      else if(type===101&&b.classCode===106)clones(node,ctx);
      else if(type===106&&b.classCode===111)multiHit(node,ctx);
      else if(type===110&&b.classCode===116)flight(node,ctx);
      else if(type===111&&node.impactBall)arc(node);
      else if(type===112&&node.impactBall){burst(node,ctx,112);a.pop(b);}
      else if(type===105&&(node.impactClone||node.impactBall))node.deleted=b.deleted=true;
      else if(type===75){b.actorFlags|=c.alternativeRenderer?0x100000:0x8000;a.pop(b);}
      else if(type===73||type===74){b.afterImageEnabled=type===73?1:0;a.pop(b);}
      else if(type===89||type===90){b.actorFlags=type===89?b.actorFlags|2:b.actorFlags&~2;a.pop(b);a.animate(node,0,ctx.mainState);}
      else if(type===34){if(!(b.dynamicFlags&0x60))a.animate(node,0,ctx.mainState);if(++b.counter>=30){b.counter=0;a.pop(b);}}
      else if(type===87){a.shake(0);a.pop(b);}
      else if(type===156){if(!(b.dynamicFlags&0x60))a.animate(node,0,ctx.mainState);if(b.skillStatus===0){a.allocate('charge',null,{parent:node,position:[...b.position],resourceId:0x1adbc,actorFlags:0x40000,drawPriority:204,facing:0,drawFlagMask:4,drawFlagValue:4});b.skillStatus=1;}b.state=157;}
      else return false;a.screen(node);return true;
    },
    effect(node,ctx){if(node.kind!=='impact-skill-spark')return false;if(a.animate(node,1,ctx.mainState)===1)node.deleted=true;return true;},
    validate(plan){
      const detachedRID=plan.hits.filter(h=>h.flags&0x800000);
      if(detachedRID.length&&(plan.category===106&&detachedRID.some(h=>!(h.flags&0x2000))||plan.category===116&&plan.level<9))
        return Object.freeze({kind:'impact-skill-unavailable',reason:'impact-skill-detached-RID-storage'});
      if(plan.category===106&&detachedRID.length){
        if(!a.get(0))return Object.freeze({kind:'impact-skill-unavailable',reason:'impact-skill-detached-RID-slot0'});
        common.image(0x573b);common.image(0x5738);
      }
      if(plan.category===4&&plan.hits.some(h=>h.flags&0x20000000))
        return Object.freeze({kind:'impact-skill-unavailable',reason:'impact-skill-hidden-deflection-geometry'});
      const required=resource=>{if(!a.probeAnimation(resource,0).state.geometry)fail('LEGACY_BATTLE_SKILL_ANIMATION_REQUIRED');};
      if(plan.category===4){required(0x1ae14+tiers[plan.level]);required(0x1adc0);}
      else if(plan.category===97){required(0x1ae14+tiers[plan.level]);required(0x1ade4+tiers[plan.level]);required(0x1adb6);required(0x1adb7);}
      else required(0x1adbc);
      if(plan.category===116){common.image(0x565a);common.image(0x666c);required(0x1ae4e);if(plan.level===9)required(0x1ae4a);}
      for(const h of plan.hits){
        if(plan.category!==97&&(h.flags&0x108||h.flags&0x8000||h.flags&0x2000))continue;
        const style=plan.category!==97&&(h.flags&0x4000)?5:6;
        if(h.amount===0&&(h.flags&0x10000000))common.image(0x57bb);else common.validateStatus({style,amount:h.amount});
      }
      return null;
    },
    finish(node,category){if([106,111,116].includes(category)){node.player.clearSignal();node.body.actorFlags&=~(2|(c.alternativeRenderer?0x100000:0x8000));}},
  });
}
