/** Fixed37c4 SKL404 birth order and body 225–230. The common rider owns 222. */
import {battleFail as fail} from './legacy-game-battle-bytes.mjs';
import {LEGACY_GAME_BATTLE_SLOT_LAYOUT as layout} from './legacy-game-battle-data.mjs';
import {battleIntegerBox,battleIntegerBoxSnapshot} from './legacy-game-battle-integer-box.mjs';
import {legacyGameBattleHomingAngle} from './legacy-game-battle-casting-playback.mjs';
import {legacyGameBattleFacing} from './legacy-game-battle-math.mjs';
import {battleStatusVital} from './legacy-game-battle-status.mjs';

const f=Math.fround;
const unavailable=reason=>Object.freeze({kind:'skill404-unavailable',reason});
const currentTuple=b=>{
  const at=b.tupleRead*4;
  return {slot:b.tuples[at],flags:b.tuples[at+1]>>>0,amount:b.tuples[at+2]};
};

export function createBattleSkill404Playback(a,c,common){
  function checkQueue(b,queue){
    if(b.actionWrite+queue.actions.length>198||b.tupleWrite+queue.tuples.length>199)fail('LEGACY_BATTLE_BODY_CAPACITY');
  }
  function validate(plan,attached){
    const parent=a.node(a.get(plan.principal));
    const rider=parent?.children.get('rider');
    if(!rider||rider.deleted||!a.present(rider))return unavailable('skill404-rider-context');
    if(parent.shared105c||attached?.records.some(record=>record.first.slot===plan.principal)){
      return unavailable('skill404-pair-storage-in-use');
    }
    if(a.count()+3+3*(attached?.records.length??0)>4096)fail('LEGACY_BATTLE_PLAYBACK_BUDGET');
    for(const row of plan.rows)checkQueue(a.get(row.slot),row);
    for(const row of [plan.first,plan.second])checkQueue({actionWrite:-1,tupleWrite:0},row);
    a.probe(100500);
    for(const {first,second} of plan.exchanges){
      a.probe(first.resourceId);
      a.probe(second.resourceId);
      if(first.attachmentResource>0)a.probe(first.attachmentResource);
    }
    for(const hit of plan.hits){
      const {flags,amount}=hit;
      if(flags&0x8108||amount===0&&(!(flags&0x6000)||(flags&0x10000000)))continue;
      const base=(flags&0x4000)?243750:243760;
      for(const digit of String(amount))common.image(base-48+digit.charCodeAt(0));
    }
    return null;
  }

  function queue(plan,owner){
    const parent=a.node(a.get(plan.principal));
    const rider=parent.children.get('rider');
    function hidden(){
      const b=a.createReplacement(0);
      const node=a.allocate('body',b,{callbackDisabled:true,ridCreated:true});
      a.animate(node,0,10);
      b.actorFlags|=2;
      b.actionWrite=-1;
      b.actions[0]=b.tuples[0]=-1;
      return {body:b,node,boxes:[]};
    }
    function describe(target,row){
      const {body:b,node}=target;
      b.nameBytes?.fill(0);
      Object.assign(b,{slot:row.slot,nameBytes:row.name.slice(),resourceId:row.resourceId,value1d0:row.value1d0,
        vitals:[...row.vitals],rawStatusFlags:row.flags,dynamicFlags:row.flags,savedFlags:0,
        position:[...layout[row.slot].target],classCode:404,skillLevel:plan.level});
      node.priority=row.slot*10+2;
      node.skill404Birth={rawResourceId:row.rawResourceId,rawAttachmentResource:row.rawAttachmentResource};
      node.screen=[...layout[row.slot].target];
      for(const value of row.vitals)target.boxes.push(battleIntegerBoxSnapshot(battleIntegerBox(value,c.random)));
      a.birthMetadata(b,row.flags,plan.localSlot);
    }
    function write(b,row){
      for(const tuple of row.tuples)a.appendTuple(b,tuple);
      a.append(b,owner,row.actions);
    }

    const first=hidden();
    const second=hidden();
    const container=a.allocate('skill404-handoff',null,{callbackDisabled:true,manualScreen:true,drawPriority:0});
    for(const exchange of plan.exchanges){
      describe(first,exchange.first);
      rider.ridPresentation?.nameBytes.fill(0);
      rider.ridPresentation={nameBytes:exchange.first.name.slice(),value1d0:exchange.first.value1d0,vitals:[...exchange.first.vitals]};
      rider.position=[f(parent.body.position[0]+parent.player.copyState().attachmentX),parent.body.position[1]];
      describe(second,exchange.second);
    }
    a.bindPair(container,parent,rider,first,second,plan.exchanges.at(-1));
    write(first.body,plan.first);
    write(second.body,plan.second);
    parent.body.classCode=404;
    parent.body.skillLevel=plan.level;
    parent.body.pairedTarget=plan.facingSlot;
    for(const row of plan.rows)write(a.get(row.slot),row);
    parent.body.state=parent.body.actions[parent.body.actionRead];
    return Object.freeze({kind:'skill404-queued',principal:plan.principal,destination:plan.destination,
      level:plan.level,actors:Object.freeze(plan.rows.map(row=>row.slot)),exchanges:plan.exchanges.length,hits:plan.hits.length});
  }

  function advanceTuple(b){
    if(b.tupleRead>=199)fail('LEGACY_BATTLE_BODY_CAPACITY');
    b.tupleRead++;
  }
  function applyHp(node,amount,heal){
    const b=node.body;
    const {index,before,value}=battleStatusVital(b.vitals,heal?5:6,amount);
    b.vitals[index]=value;
    a.event({kind:'battle-vital',slot:b.slot,field:'HP',before,value,delta:value-before});
  }
  function releaseHit(node,victim){
    const b=node.body,target=victim.body;
    const {flags,amount}=currentTuple(b);
    a.aim(target,b.position,true);
    target.classCode=-1;
    target.attackerSlot=b.slot;
    target.reactionFlags=flags;
    a.metadata(node);
    if(flags&8)target.state=29;
    else if(flags&0x100){
      if(!target.afterImageEnabled){
        a.sound(node,0xd2);
        target.afterImageEnabled=1;
        target.state=29;
      }
    }else{
      const heal=!!(flags&0x4000);
      const reflect=!!(flags&0x2000);
      if(!(flags&0xc000)&&amount!==0){
        target.position=[...target.rememberedPosition];
        if(reflect){
          if(flags&2)common.impact(node,0x1adb8);
          b.reactionFlags=0x2000;
          if(b.classCode!==404&&flags&0x20){
            b.dynamicFlags|=2;
            b.auxFF8=1;
            a.setSlow(1);
          }
        }else{
          if(flags&0x100000){a.removeChild(victim,'status');target.dynamicFlags&=~0x20;}
          if(flags&2)common.impact(victim,0x1adb8);
        }
        common.impact(victim,0x1adb1+c.random.range(0,2));
        a.extraImpact(node,victim);
        if(!reflect&&flags&0x20){
          target.dynamicFlags|=2;
          target.auxFF8=1;
          a.setSlow(1);
        }
      }
      a.pop(target);
      if(!(flags&0x8000)){
        const receiver=reflect&&!heal?node:victim;
        if(heal||reflect||amount!==0)applyHp(receiver,amount,heal);
        if(amount===0&&((flags&0x10000000)||!(heal||reflect))){
          common.message(victim,flags&0x10000000?0x57bb:0x573b);
        }else{
          common.number(receiver,amount,heal?5:6);
          if(flags&2)common.message(receiver,0x57b6);
          a.feedback(node,victim);
        }
      }
    }
    if(!(flags&8)&&amount!==0)b.attackCooldown=(((target.dynamicFlags>>>1)&1)+1)*14;
    a.pop(b);
    advanceTuple(b);
  }

  function reaction(node,ctx){
    const b=node.body;
    b.animationAction=b.reactionFlags&0xc04?9:8;
    b.speedPercent=50;
    const count=++b.reactionCounter,dead=(b.dynamicFlags>>>1)&1;
    const start=(dead+1)*14;
    if(count<start){
      b.speed=5;
      b.angle=f(b.angle+180);
      if(b.angle>=360)b.angle=f(b.angle-360);
      if(dead){b.auxFF8=1;a.setSlow(1);}
    }else if(count<dead*14+34){
      b.facing=(b.facing+1)&7;
      if(count===start){
        b.speed=5;
        if(dead){if(a.countAux()<2)a.setSlow(0);b.auxFF8=0;}
        b.counter=0;
      }
      if(b.counter===0)a.reactionPuff(node);
      if(++b.counter>2)b.counter=0;
    }else if(count>=dead*14+54){
      b.reactionCounter=0;
      const falling=dead&&!(b.reactionFlags&0x3010);
      b.speed=falling?1:6;
      b.speedPercent=falling?250:100;
      a.pop(b);
      if(!dead&&b.state===11)b.speed=4;
    }
    a.animate(node,1,ctx.mainState);
  }

  function flight(node,ctx){
    const b=node.body;
    b.animationAction=8;
    b.speedPercent=100;
    if(++b.reactionCounter===1){
      a.sound(node,0xcf);
      if(b.dynamicFlags&2){
        if(a.countAux()<2)a.setSlow(0);
        b.auxFF8=0;
        b.savedFlags|=2;
      }
      for(let i=0;i<40;i++)a.scatter(node);
      b.counter=b.attackCooldown=0;
      b.speed=15;
      if(b.angle>=360)b.angle=f(b.angle-360);
    }
    a.move(b);
    b.facing=(b.facing+1)&7;
    const [x,y]=b.position;
    if(b.counter<3){
      const frame=node.player.copyState();
      if(!frame.geometry)fail('LEGACY_BATTLE_BODY_PARENT_GEOMETRY');
      const half=frame.geometry.width*0.5;
      const edges=[x<half,x>640-half,y< -frame.drawOffsetY,y>480];
      const side=edges.findIndex((outside,i)=>outside&&b.attackCooldown!==i+1);
      if(side>=0){
        b.angle=f([180,540,360,0][side]-b.angle);
        b.counter++;
        b.attackCooldown=side+1;
        a.sound(node,0xd0);
      }
    }else if(x< -200||x>840||y< -200||y>680){
      a.pop(b);
      b.attackCooldown=0;
    }
    let count=0;
    while(a.animate(node,1,ctx.mainState)===0){
      if(++count>=65536)fail('LEGACY_BATTLE_BODY_ANIMATION_BUDGET');
    }
  }

  return Object.freeze({
    validate,queue,
    body(node,ctx){
      const b=node.body;
      switch(b.state){
        case -1:if(!node.skill404Birth)return false;break;
        case 34:
          if(!node.skill404Birth)return false;
          if(!(b.dynamicFlags&0x60))a.animate(node,0,ctx.mainState);
          if(++b.counter>=30){b.counter=0;a.pop(b);}
          break;
        case 202:{
          if(b.classCode!==404&&!node.skill404Birth)return false;
          const t=currentTuple(b);
          node.travelTarget=[t.slot,t.flags|0];
          advanceTuple(b);
          b.state=6;
          break;
        }
        case 225:{
          const t=currentTuple(b),target=[t.slot,t.flags|0];
          b.angle=legacyGameBattleHomingAngle(b.angle,f(target[0]-b.position[0]),f(target[1]-b.position[1]),10);
          b.facing=legacyGameBattleFacing(b.angle);
          a.move(b);
          a.animate(node,0,ctx.mainState);
          if(a.distance(b,target)<8){b.position=target;advanceTuple(b);a.pop(b);}
          break;
        }
        case 226:
          b.animationAction=9;b.speedPercent=100;
          b.speed=Math.max(0,f(b.speed-f(0.45)));
          a.move(b);
          if(b.speed===0){a.pop(b);b.speed=6;}
          a.animate(node,0,ctx.mainState);
          if(b.counter===0)a.reactionPuff(node,0x1adb6);
          if(b.counter===1)a.reactionPuff(node,0x1adb7);
          if(++b.counter>2)b.counter=0;
          break;
        case 227:{
          const victim=a.node(a.get(currentTuple(b).slot));
          if(!victim)fail('LEGACY_BATTLE_SKILL404_TARGET_REMOVED');
          b.animationAction=3;b.speed=10;b.speedPercent=100;
          a.aim(b,victim.body.position,true);
          a.move(b);
          if(a.distance(b,victim.body.position)<20)releaseHit(node,victim);
          a.reactionPuff(node,(c.random.next()&1)?0x1adb6:0x1adb4);
          a.animate(node,0,ctx.mainState);
          break;
        }
        case 228:reaction(node,ctx);break;
        case 229:flight(node,ctx);break;
        case 230:a.metadata(node);a.pop(b);break;
        default:return false;
      }
      a.screen(node);
      return true;
    },
  });
}
