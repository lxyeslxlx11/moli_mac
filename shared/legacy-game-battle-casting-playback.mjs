/** Source135/137,31 projectiles and their real result/queue feedback. No elapsed-time hits. */
import {battleFail as fail} from './legacy-game-battle-bytes.mjs';
import {legacyGameBattleAngle,legacyGameBattleFacing,legacyGameBattleMovement,legacyGameBattleDistance} from './legacy-game-battle-math.mjs';
import {battleStatusVital} from './legacy-game-battle-status.mjs';
import {battleCastingResources,battleSideCastEffect} from './legacy-game-battle-casting.mjs';
import {battleFriendMetadata,classifyBattleFriend} from './legacy-game-battle-friends.mjs';
import {LEGACY_GAME_BATTLE_ELEMENT_FOLLOWER_BASES as elementBases} from './legacy-game-battle-data.mjs';
import {ITEM_RECOVERY_EFFECT} from './legacy-game-battle-shared-storage.mjs';
const f=Math.fround,types=new Set([31,32,71,115,122,123,124,134,135,137,146,177,199,206,207,211,212,241]);
const tuple=b=>{const at=(b.castRead??b.tupleRead)*4,t=b.castTuples??b.tuples;return {slot:t[at],flags:t[at+1]>>>0,amount:t[at+2],extra:t[at+3],at,t};};
export function legacyGameBattleHomingAngle(angle,x,y,limit){if([angle,x,y,limit].some(n=>typeof n!=='number'||!Number.isFinite(n)||!Number.isFinite(f(n))))fail('LEGACY_BATTLE_FLOAT');angle=f(angle);limit=f(limit);const target=legacyGameBattleAngle(x,y);if(limit===0)return target;
  let delta=target-angle;if(delta>180)delta-=360;else if(delta<=-180)delta+=360;
  return f(Math.abs(Math.trunc(delta))>=limit?angle+(delta<0?-limit:limit):angle+delta);
}
export function createBattleCastingPlayback(a,c,common){
  let overlayCounter=0,overlayDirection=0,submissions=[],shakeFlag=0,amplitude=0,limit=0,slow=0,context={entryMode:null,labelFlag:0,localSlot:null};
  const friendKnown=new WeakMap();
  const nodeFor=b=>{const node=a.node(b);if(!node)fail('LEGACY_BATTLE_CASTING_BODY_REMOVED');return node;};
  const sound=(node,value,point=node.screen)=>a.event({kind:'sound',value,nodeId:node.id,slot:node.body?.slot??node.ownerSlot??null,position:Object.freeze([...point])});
  const screen=(n,shake=false)=>{n.screen=n.position.map((x,i)=>(Math.trunc(x)+(shake?c.screenOffset[i]:0))|0);};
  const message=(node,resource,offsetY=0)=>{const position=node.body?node.body.position:node.position,n=a.allocate('message',null,{position:[position[0],f(position[1]+offsetY)],screenSpace:true,resourceId:resource,actorFlags:0x40000,drawPriority:204,height:-8});a.animate(n,1,10);a.screen(n);return n;};
  const vital=(body,style,amount)=>{const r=battleStatusVital(body.vitals,style,amount);body.vitals[r.index]=r.value;
    a.event({kind:'battle-vital',slot:body.slot,field:r.index===0?'HP':'MP',before:r.before,value:r.value,delta:r.value-r.before});};
  function advanceTuple(b){if(b.tupleRead>=199)fail('LEGACY_BATTLE_BODY_CAPACITY');return b.tuples[++b.tupleRead*4]===-1;}
  function overlay(group){if(overlayDirection===0){if(++overlayCounter>15){overlayCounter=15;overlayDirection=1;}}
    else if(--overlayCounter<0){overlayCounter=0;overlayDirection=0;}
    const resource=group===5?0x70f1+(overlayCounter>>2):group===4?(overlayCounter&1?0x70e8:0x70df):0x70d1+group*8+(overlayCounter>>1);
    for(let x=0;x<10;x++)for(let y=0;y<10;y++){const draw=Object.freeze({resourceId:resource,x:32+64*x,y:24+48*y,priority:3});submissions.push(draw);a.submitDirect(draw);}
  }
  function extraImpact(caster,victim){const tableA=[0,0x1af5f,0x1af6b,0x1af77,0x1af83],tableB=[0,0x1af5e,0x1af6a,0x1af76,0x1af82];
    for(const [index,table]of [[caster?.body.elementProperty??0,tableA],[victim.body.elementProperty??0,tableB]])if(index){const n=common.impact(victim,table[index]);if(n)n.sourceByte303=150;}
  }
  function feedback(caster,victim){const x=caster?.body,y=victim.body;if(!x||context.entryMode===null)return;const mode=context.entryMode,flags=context.labelFlag;
    if(!(flags&1)&&mode!==5&&mode!==6||!(flags&2)&&mode===2||!(flags&4)&&(mode===5||mode===6))return;
    const knownX=friendKnown.get(x)===true,knownY=friendKnown.get(y)===true;
    if((!knownX||!knownY)&&(!knownX||x.savedFlags&1)&&(!knownY||y.savedFlags&1)){a.event({kind:'battle-casting-feedback-unavailable',reason:'opposite-team-friend-roster',casterSlot:x.slot,targetSlot:y.slot});return;}
    if(!((x.savedFlags&1)&&(y.savedFlags&1)))return;
    const first=x.classCode>=19&&x.classCode<=30?Array.from({length:4},(_,i)=>Number(i===(x.classCode-19)%4)):[...x.statusMetadata];
    const second=[...y.statusMetadata];if(!(x.classCode>=19&&x.classCode<=30)&&(x.dynamicFlags&0x800))first.push(...first.splice(0,2));if(y.dynamicFlags&0x800)second.push(...second.splice(0,2));
    let offset=-20;for(const [i,j,resource]of [[0,1,0x57b7],[1,2,0x57b8],[2,3,0x57b9],[3,0,0x57ba],[0,3,0x57b2],[1,0,0x57b3],[2,1,0x57b4],[3,2,0x57b5]])if(first[i]&&second[j]){message(victim,resource,offset);offset-=22;}
  }
  function metadata(n){let t=tuple(n),recipient=a.get(t.flags&0x2000?n.ownerSlot:t.slot);if(!recipient)fail('LEGACY_BATTLE_CASTING_BODY_REMOVED');const target=nodeFor(recipient);
    if(t.flags&0x200000)message(target,0x5739);if(t.flags&0x400000)message(target,0x573a);
    if(t.flags&0x800000){const at=t.at,resources=[t.t[at+6],t.t[at+7],t.t[at+10]];n.castRead+=3;
      message(target,0x5738);sound(target,0xd6);a.rider(target,resources[0],resources[1]);a.attachment(target,resources[2]);}
    if(t.flags&0x1000000)message(target,0x573a);if(t.flags&0x2000000){message(target,0x5738);sound(target,0xd6);}
    return tuple(n);
  }
  function impactResource(flags){return flags&4?110000:flags&0x800?0x1ae13:flags&0x400?0x1ae12:0x1adb1+c.random.range(0,2);}
  function result(n,ctx,kind,preliminary=false){let t=tuple(n),body=a.get(t.slot);if(!body)fail('LEGACY_BATTLE_CASTING_TARGET_REMOVED');const victim=nodeFor(body),casterBody=a.get(n.ownerSlot),caster=casterBody?nodeFor(casterBody):null,resource=impactResource(t.flags),signal=n.player.copyState().signal;
    if(kind!=='homing')a.reface(body);body.attackerSlot=n.ownerSlot;body.reactionFlags=t.flags;
    if(!preliminary)t=metadata(n);
    if(t.flags&8){body.state=29;return;}
    if(preliminary){if(!(t.flags&0x70000)&&t.amount!==0){if(t.flags&2)common.impact(victim,0x1adb8);common.impact(victim,resource);extraImpact(caster,victim);body.state=25;sound(n,signal-(signal<20000?10000:20000));n.castCooldown=(((body.dynamicFlags>>>1)&1)+1)*14;}return;}
    if(!(t.flags&0x70000)&&t.amount!==0){
      if(kind==='signal'){if(t.flags&2)common.impact(victim,0x1adb8);common.impact(victim,resource);extraImpact(caster,victim);}
      vital(body,6,t.amount);if(t.flags&0x20){body.dynamicFlags|=2;if(kind!=='completion'||t.flags&0x40){slow=1;body.auxFF8=1;}}
      if(kind==='signal')sound(n,signal-10000,[320,240]);
    }
    if(!(t.flags&0x70000)){
      if(t.flags&0x100000){a.removeChild(victim,'status');body.dynamicFlags&=~0x20;}
      if(kind==='completion'){if(t.amount!==0){common.impact(victim,resource);extraImpact(caster,victim);}}
      else if(kind==='falling'||kind==='homing'){if(t.flags&2)common.impact(victim,0x1adb8);common.impact(victim,resource);extraImpact(caster,victim);}
      if(kind==='homing'){body.angle=legacyGameBattleAngle(f(n.position[0]-body.position[0]),f(n.position[1]-body.position[1]));body.facing=legacyGameBattleFacing(body.angle);}
      a.pop(body);if(kind==='signal'&&(t.flags&0x20000000))common.impact(victim,0x1af8a);
      else{if(t.amount===0&&(t.flags&0x10000000))message(victim,0x57bb);else common.number(victim,t.amount,6);if(t.flags&2)message(victim,0x57b6);feedback(caster,victim);}
    }else{a.pop(body);if(!(t.flags&0x50000)){vital(body,5,t.amount);if(t.amount===0&&(t.flags&0x10000000))message(victim,0x57bb);else common.number(victim,t.amount,5);if(t.flags&2)message(victim,0x57b6);feedback(caster,victim);}}
    if(kind==='signal'||t.amount!==0)n.castCooldown=(((body.dynamicFlags>>>1)&1)+1)*14;
    if(kind==='falling'){const r=n.resourceId;if(r>=0x1add0&&r<=0x1add2){sound(n,0x107);sound(n,0x84);}else sound(n,r>=0x1add3&&r<=0x1add5?0x107:r>=0x1add6&&r<=0x1add8?0x84:0x83);}
    if(kind==='homing')sound(n,n.resourceId===0x1addc||n.resourceId===0x1addd?0x10d:0x10c);
  }
  function createProjectile(parent){const b=parent.body,t=tuple(b),target=a.get(t.slot);if(!target)fail('LEGACY_BATTLE_CASTING_TARGET_REMOVED');const victim=nodeFor(target),g=victim.player.copyState().geometry;if(!g)fail('LEGACY_BATTLE_BODY_PARENT_GEOMETRY');
    const category=b.classCode,group=battleCastingResources(category,b.skillLevel).group,kind=['falling','signal','signal','homing','completion'][group];
    const count=t.flags&0x800000?16:4,packed=new Int32Array(count+4);packed.set(t.t.subarray(t.at,t.at+count));packed[count]=-1;
    if(t.flags&0x800000)b.tupleRead+=3;
    const n=a.allocate('casting-projectile',null,{manualScreen:true,ownerSlot:b.slot,classCode:category,skillLevel:b.skillLevel,castKind:kind,castRead:0,castTuples:packed,castCooldown:0,
      resourceId:b.projectileResource,drawPriority:group===0?0:group===1?204:201,actorFlags:group===0?0x40000:group===1||group===3?0x60000:0x48000,
      facing:0,speedPercent:100,castDelay:b.tupleRead!==0?c.random.range(0,30):0,castTrail:0,castFinish:0,castGuard:0,angle:0,speed:0,castTurn:0,drawFlagMask:group===0?0:4,drawFlagValue:group===0?0:4});
    if(group<3)n.resourceId+=c.random.range(0,2);
    if(group===0)n.position=[f(target.position[0]+(target.slot<10?-100:100)),f(target.position[1]-200-Math.trunc(g.height/2))];
    else if(group===1)n.position=[target.position[0],f(victim.screen[1]+1)];
    else if(group===2)n.position=[target.position[0],f(target.position[1]+Math.trunc(victim.player.copyState().drawOffsetY/2))];
    else if(group===3){n.position=[320,260];n.speed=c.random.range(4,8);n.angle=f(legacyGameBattleAngle(f(target.position[0]-320),f(target.position[1]-260))+c.random.range(-90,90));}
    else n.position=[...target.position];screen(n);return n;
  }
  function trail(position,resource,depth,priority){const n=a.allocate('casting-trail',null,{manualScreen:true,position:[...position],resourceId:resource,actorFlags:0x40000|(c.random.range(0,1)===0?0x10000:0x8000)|(depth?0x20000:0),drawPriority:priority,facing:0,drawFlagMask:0,drawFlagValue:0,speedPercent:200});screen(n);return n;}
  function childEffect(parent,resource,offset=0,loop=false){const n=a.allocate(loop?'casting-chant':'casting-charge',null,{parent,manualScreen:true,position:[parent.body.position[0],f(parent.body.position[1]+offset)],resourceId:resource,actorFlags:0x40000,facing:0,drawPriority:204});screen(n);return n;}
  function createPursuit(caster,target){
    const t=tuple(caster),extended=!!(t.flags&0x800000),packed=new Int32Array(extended?20:8);
    packed.set(t.t.subarray(t.at,t.at+4));
    if(extended){
      const opaque=t.t[t.at+4];
      packed.set([opaque,t.flags|0,t.t[t.at+6],t.t[t.at+7],
        opaque,t.flags|0,t.t[t.at+10],0],4);
      packed.set(t.t.subarray(t.at,t.at+4),12);
      caster.tupleRead+=3;
    }
    packed[extended?16:4]=-1;
    const delay=caster.tupleRead!==0?c.random.range(0,30):0;
    const speed=c.random.range(4,8),angle=f(legacyGameBattleAngle(f(target.position[0]-320),
      f(target.position[1]-260))+c.random.range(-90,90));
    const n=a.allocate('casting-projectile',null,{manualScreen:true,ownerSlot:caster.slot,classCode:400,
      skillLevel:caster.skillLevel,castKind:'pursuit',castRead:0,castTuples:packed,castDelay:delay,
      castCooldown:0,castTrail:0,castFinish:0,castTurn:0,position:[320,260],angle,speed,
      resourceId:caster.projectileResource,actorFlags:0x60000,drawPriority:201,drawFlagMask:4,drawFlagValue:4});
    screen(n);
  }
  function stepPursuit(n,ctx){
    const {slot,flags}=tuple(n),target=a.get(slot);
    if(n.state===0){
      if(!target){n.deleted=true;return;}
      if(target.state!==0)return;
      n.state=1;
    }
    const soundAtHit=n.resourceId<=0x1addd?0x10d:0x10c;
    if(!n.player.copyState().signal){
      if(!target){n.deleted=true;return;}
      if(legacyGameBattleDistance(...n.position,...target.position)<9){
        target.attackerSlot=n.ownerSlot;
        target.reactionFlags=flags;
        metadata(n);
        if(flags&8)target.state=29;
        else{
          if(flags&0x10000000)message(nodeFor(target),0x57bb);
          sound(n,soundAtHit);
          if(flags&0x10000000)a.pop(target);
        }
        n.player.setSignal(1);
      }
    }
    if(n.castDelay-- > 0){screen(n,true);return;}
    if(n.castDelay===-1)sound(n,n.resourceId===0x1addc?0x10d:0x10c);

    a.animate(n,0,ctx.mainState);
    n.castFinish=n.player.copyState().signal;
    const carry=n.castFinish!==0&&!(flags&0x10000008);
    const [x,y]=n.position;
    if(!n.castFinish){
      n.castTurn=f(n.castTurn+f(0.1));
      n.angle=legacyGameBattleHomingAngle(n.angle,f(target.position[0]-x),f(target.position[1]-y),n.castTurn);
    }else if(x< -200||x>840||y< -200||y>680){
      if(carry&&target){
        if(target.actions[target.actionWrite]===49)nodeFor(target).pursuitRemoval=true;
        a.pop(target);
      }
      n.deleted=true;
    }
    a.move(n);
    if(carry&&target){
      const tick=n.castDelay&31;
      const rise=tick<16?Math.trunc((tick-8)**2/2):64-Math.trunc((tick-24)**2/2);
      target.animationAction=8;
      target.facing=(target.facing+1)&7;
      target.position=[f(n.position[0]+c.screenOffset[0]),f(n.position[1]-35-rise+c.screenOffset[1])];
    }
    const tier=n.resourceId-0x1addc,radius=[10,6,4,2][tier];
    if(n.castTrail===0){
      const trailY=f(n.position[1]+c.random.range(-radius,radius));
      const trailX=f(n.position[0]+c.random.range(-radius,radius));
      trail([trailX,trailY],tier<2?0x1adb7:0x1adb6,true,202);
    }
    if(tier===2)n.castTrail++;
    n.castTrail=n.castTrail<2?n.castTrail+1:0;
    screen(n,true);
  }
  function transformTargets(caster){
    const b=caster.body,field=tuple(b).extra,targets=[];
    let read=b.tupleRead+1;
    while(b.tuples[read*4]!==-1){
      if(read+2>=199)fail('LEGACY_BATTLE_BODY_CAPACITY');
      const at=read*4;
      targets.push({node:nodeFor(a.get(b.tuples[at])),value1d0:b.tuples[at+2],
        base:b.tuples[at+6],rider:b.tuples[at+7],attachment:b.tuples[at+10]});
      read+=3;
    }
    sound(caster,0x113);
    a.startReplacementField(field);
    for(const {node,value1d0,base,rider,attachment} of targets){
      const body=node.body;
      body.value1d0=value1d0;
      body.resourceId=base;
      if(rider!==0&&node.children.has('rider')){
        a.rider(node,base,rider);
        body.linkedResources[0]=Math.max(0,rider);
      }
      a.attachment(node,attachment);
      body.linkedResources[1]=Math.max(0,attachment);
    }
    b.tupleRead=read;
  }
  function releaseSideTargets(caster){
    const targets=[];
    let read=caster.tupleRead;
    while(caster.tuples[read*4]!==-1){
      if(read>=199)fail('LEGACY_BATTLE_BODY_CAPACITY');
      const body=a.get(caster.tuples[read++*4]);
      if(!body)fail('LEGACY_BATTLE_CASTING_TARGET_REMOVED');
      targets.push(body);
    }
    for(const body of targets)body.state=body.actions[body.actionRead];
    caster.tupleRead=read;
  }
  function body(node,ctx){const b=node.body,type=b.state;if(!common.configured()||!types.has(type))return false;
    if(type===134||type===146){
      if(!(b.dynamicFlags&0x60))a.animate(node,0,ctx.mainState);
      if(b.skillStatus===0){
        const child=childEffect(node,type===146?ITEM_RECOVERY_EFFECT:0x1ae18);
        if(type===146){
          child.actorFlags|=c.alternativeRenderer?0x100000:0x8000;
          child.drawFlagMask=child.drawFlagValue=4;
        }
        b.skillStatus=1;
      }
      b.state=157;
    }else if(type===135){
      const transformation=b.classCode===405,sideCast=b.classCode===402;
      if(!transformation&&!sideCast&&(b.classCode<19||b.classCode>31))return false;
      b.animationAction=6;
      if(b.skillStatus===0){
        const child=childEffect(node,b.chantResource,0,true);
        if(sideCast)child.drawFlagMask=child.drawFlagValue=4;
        node.children.set('chant',child);b.skillStatus=1;sound(node,0x103);
      }
      const signal=node.player.copyState().signal;if(signal>9999&&signal<20000){if(node.children.has('chant')&&!sideCast){
        a.removeChild(node,'chant');
        if(transformation)transformTargets(node);
        else{let count=0;while(tuple(b).slot!==-1){if(++count>199)fail('LEGACY_BATTLE_BODY_CAPACITY');createProjectile(node);advanceTuple(b);}}
        advanceTuple(b);
      }node.player.clearSignal();}
      if(a.animate(node,1,ctx.mainState)===1){
        if(node.children.has('chant')){
          a.removeChild(node,'chant');
          if(sideCast)releaseSideTargets(b);
          else{let count=0;do{if(++count>199)fail('LEGACY_BATTLE_BODY_CAPACITY');}while(!advanceTuple(b));}
        }
        b.skillStatus=0;a.pop(b);
      }
      if(node.children.has('chant')&&!transformation&&!sideCast)overlay(battleCastingResources(b.classCode,b.skillLevel).group);
    }else if(type===206){
      if(b.classCode!==401)return false;
      const t=tuple(b);
      if(t.flags&1)a.setRain(t.amount);
      advanceTuple(b);
      a.pop(b);
    }else if(type===207){
      if(b.classCode!==401)return false;
      const t=tuple(b);
      const child=common.impact(node,t.slot);
      child.position=[(child.position[0]+t.amount)|0,(child.position[1]+t.extra)|0];
      child.drawFlagMask=child.drawFlagValue=4;
      a.screen(child);
      if(!(b.dynamicFlags&0x60))a.animate(node,0,ctx.mainState);
      if(++b.counter>=t.flags){
        b.counter=0;
        advanceTuple(b);
        a.pop(b);
      }
    }else if(type===211){
      const pursuit=b.classCode===400;
      if(!pursuit&&b.classCode!==401)return false;
      b.animationAction=6;
      if(b.skillStatus===0){
        const chant=childEffect(node,b.chantResource,0,true);
        chant.drawFlagMask=chant.drawFlagValue=4;
        node.children.set('chant',chant);
        b.skillStatus=1;
        b.counter=0;
        sound(node,pursuit?0x103:0x105);
      }
      const signal=node.player.copyState().signal;
      if(signal>9999&&signal<20000){
        if(node.children.has('chant')){
          a.removeChild(node,'chant');
          while(tuple(b).slot!==255){
            const target=a.get(tuple(b).slot);
            if(!target)fail('LEGACY_BATTLE_CASTING_TARGET_REMOVED');
            a.seedSource((b.slot+target.slot)|0);
            if(pursuit)createPursuit(b,target);
            const postTarget=a.get(tuple(b).slot);
            if(postTarget&&postTarget!==b)a.pop(postTarget);
            advanceTuple(b);
          }
          advanceTuple(b);
        }
        node.player.clearSignal();
      }
      if(a.animate(node,1,ctx.mainState)===1){
        a.removeChild(node,'chant');
        b.skillStatus=0;
        a.pop(b);
      }
      if(node.children.has('chant'))overlay(pursuit?3:1);
    }else if(type===241){
      b.speed=f(tuple(b).amount*f(0.01));
      advanceTuple(b);
      a.pop(b);
    }else if(type===212){
      if(!(b.dynamicFlags&0x60))a.animate(node,0,ctx.mainState);
      if(b.skillStatus===0){
        const child=common.impact(node,battleSideCastEffect);
        Object.assign(child,{kind:'casting-charge',parent:node,
          actorFlags:c.alternativeRenderer?0x140000:0x48000,drawFlagMask:4,drawFlagValue:4});
        b.skillStatus=1;
      }
      b.state=157;
    }else if(type===137){createProjectile(node);a.pop(b);}
    else if(type===31){b.animationAction=9;b.speedPercent=100;if(a.animate(node,1,ctx.mainState)===1)a.pop(b);}
    else if(type===71){const other=a.get(tuple(b).slot);if(!other)fail('LEGACY_BATTLE_CASTING_TARGET_REMOVED');a.pop(other);a.pop(b);}
    else if([115,122,123,124,177].includes(type)){if(!(b.dynamicFlags&0x60))a.animate(node,0,ctx.mainState);if(b.skillStatus===0){const level=[3,3,3,2,2,2,1,1,1,0][b.skillLevel],resource=type===115||type===177?0x1adf3+level:type===122?0x1ae21:type===123?0x1ae29:0x1ae31;
        const q=node.player.copyState();if(!q.geometry)fail('LEGACY_BATTLE_BODY_PARENT_GEOMETRY');const child=childEffect(node,resource,type===115||type===177?0:Math.trunc(q.drawOffsetY/2));child.actorFlags|=0x8000;b.skillStatus=1;}
      b.state=type===177?199:157;
    }else if(type===199){if(!(b.dynamicFlags&0x60))a.animate(node,0,ctx.mainState);b.actorFlags&=~2;const alpha=node.presentationAlpha??(node.player.copyState().color>>>24);node.presentationAlpha=alpha+3<255?alpha+3:255;
      for(const child of node.children.values()){child.presentationAlpha=node.presentationAlpha;child.actorFlags=(child.actorFlags&~2)|(node.presentationAlpha<255?0x8000:0);}
      if(node.presentationAlpha<255)b.actorFlags|=0x8000;else b.actorFlags&=~0x8000;
      if(b.skillStatus===2){node.presentationOffset=[0,0];const t=tuple(b);if(t.amount===0&&(t.flags&0x10000000))message(nodeFor(a.get(t.slot)),0x57bb);else if(b.numberStyle>=0)common.number(node,b.numberValue,b.numberStyle);if([3,4,5,6].includes(b.numberStyle))vital(b,b.numberStyle,b.numberValue);b.skillStatus++;}
      if(b.skillStatus===3&&++b.counter>59)b.skillStatus++;if(b.skillStatus===4&&node.presentationAlpha===255){b.skillStatus=b.counter=0;delete node.presentationAlpha;delete node.presentationOffset;a.pop(b);}
    }else if(type===32){deathFlight(node,ctx);}
    a.screen(node);return true;
  }
  function scatter(node){
    const b=node.body;
    const speedPercent=c.random.range(10,200),angle=c.random.range(0,359),speed=c.random.range(5,20);
    const position=[b.position[0],f(b.position[1]+Math.trunc(node.player.copyState().drawOffsetY/2))];
    const n=a.allocate('casting-scatter',null,{manualScreen:true,position,resourceId:0x1adb4,actorFlags:0x40000,
      drawPriority:204,drawFlagMask:0,drawFlagValue:0,speedPercent,angle,speed});
    screen(n);
  }
  function deathFlight(node,ctx){const b=node.body;b.animationAction=b.reactionFlags&0xc04?9:8;b.speedPercent=100;const count=++b.reactionCounter,start=(((b.dynamicFlags>>>1)&1)+1)*14;
    if(count<start){b.speed=5;b.angle=f(b.angle+180);if(b.angle>=360)b.angle=f(b.angle-360);if(b.dynamicFlags&2){slow=1;b.auxFF8=1;}a.move(b);}
    else{if(count===start){sound(node,0xcf);if(b.dynamicFlags&2){if(a.countAux()<2)slow=0;b.auxFF8=0;b.savedFlags|=2;}for(let i=0;i<40;i++)scatter(node);b.counter=b.castBoundary=0;b.speed=15;}
      a.move(b);b.facing=(b.facing+1)&7;let boundary=0;if(b.counter<3){const half=node.player.copyState().geometry.width*0.5;
        if(b.position[0]<half&&b.castBoundary!==1){boundary=1;b.angle=f(180-b.angle);}
        else if(b.position[0]>640-half&&b.castBoundary!==2){boundary=2;b.angle=f(540-b.angle);}
        else if(b.position[1]<-node.player.copyState().drawOffsetY&&b.castBoundary!==3){boundary=3;b.angle=f(360-b.angle);}
        else if(b.position[1]>480&&b.castBoundary!==4){boundary=4;b.angle=f(-b.angle);}
        if(boundary){b.counter++;sound(node,0xd0);}
      }else if(b.position[0]<-200||b.position[0]>840||b.position[1]<-200||b.position[1]>680)a.pop(b);b.castBoundary=boundary;
    }
    let countAdvance=0;while(a.animate(node,1,ctx.mainState)===0)if(++countAdvance>=65536)fail('LEGACY_BATTLE_BODY_ANIMATION_BUDGET');
  }
  function effect(n,ctx){if(n.kind==='casting-chant'){if(n.parent.deleted)n.deleted=true;a.animate(n,0,ctx.mainState);screen(n);return true;}
    if(n.kind==='casting-charge'){if(a.animate(n,1,ctx.mainState)===1){if(!n.parent.deleted&&n.parent.body.skillStatus!==0)n.parent.body.skillStatus=2;n.deleted=true;}screen(n);return true;}
    if(n.kind==='element-follow'){if(n.parent.deleted)n.deleted=true;n.screen=[n.parent.screen[0],n.parent.screen[1]+n.elementOffset];a.animate(n,0,ctx.mainState);return true;}
    if(n.kind==='casting-trail'||n.kind==='casting-scatter'){if(n.kind==='casting-scatter')n.position=[...legacyGameBattleMovement(...n.position,n.angle,n.speed)];if(a.animate(n,1,ctx.mainState)===1)n.deleted=true;screen(n);return true;}
    if(n.kind!=='casting-projectile')return false;
    if(n.castKind==='pursuit'){stepPursuit(n,ctx);return true;}
    const t=tuple(n),target=a.get(t.slot);if(!target)fail('LEGACY_BATTLE_CASTING_TARGET_REMOVED');if(n.state===0&&target.state!==0)return true;n.state=1;const victim=nodeFor(target),kind=n.castKind;
    if(kind==='completion'){if(a.animate(n,1,ctx.mainState)===1){n.deleted=true;result(n,ctx,kind);n.player.clearSignal();}const before=n.castDelay--;if(before<1&&n.castCooldown>0)n.castCooldown--;screen(n,true);return true;}
    if(kind==='signal'){const signal=n.player.copyState().signal;if(signal>=10000){result(n,ctx,kind,signal>=20000||n.castGuard===1);n.player.clearSignal();}
      const before=n.castDelay--;if(before<1){if(n.castCooldown>0)n.castCooldown--;if(n.castCooldown===0){if(a.animate(n,1,ctx.mainState)===1){if(n.resourceId>0x1ae3b&&n.resourceId<0x1ae48)n.deleted=true;n.actorFlags|=0x8000;n.castFinish++;}const previous=n.castFinish;if(previous>0){n.castFinish++;if(previous>19)n.deleted=true;}}}screen(n,true);return true;}
    const g=victim.player.copyState().geometry;if(!g)fail('LEGACY_BATTLE_BODY_PARENT_GEOMETRY');const aimY=target.position[1]+Math.trunc(g.height/2)+victim.player.copyState().drawOffsetY;
    const distance=()=>legacyGameBattleDistance(...n.position,...target.position),signal=n.player.copyState().signal;
    if((t.flags&0x20000000)&&signal===0&&(kind==='falling'?aimY-50<n.position[1]:distance()<71)){
      n.position=n.position.map((x,i)=>f(x+(kind==='falling'?Math.trunc(c.screenOffset[i]/2):c.screenOffset[i])));n.deleted=true;common.impact(n,kind==='falling'?0x1af85:0x1af8b);common.impact(victim,0x1af8a);a.pop(target);
    }
    if(n.player.copyState().signal===0&&(kind==='falling'?aimY<n.position[1]:distance()<9)){result(n,ctx,kind);n.player.setSignal(1);}
    const before=n.castDelay--;
    if(kind==='falling'&&before>0){n.drawPriority=(victim.drawPriority+20)&255;screen(n,true);return true;}
    if(kind==='homing'&&before>0){screen(n,true);return true;}
    if(kind==='falling'&&n.castDelay===-1){sound(n,0x106);const count=c.random.range(0,32);for(let i=0;i<count;i++)a.animate(n,0,ctx.mainState);}
    if(kind==='homing'&&n.castDelay===-1)sound(n,n.resourceId===0x1addc?0x10d:0x10c);
    if(n.castCooldown>0){n.castCooldown--;if(kind==='falling'&&!(tuple(n).flags&0x70000)){shakeFlag=1;limit=Math.trunc(n.skillLevel/2)+1;}}
    if(n.castCooldown===0){a.animate(n,0,ctx.mainState);
      if(kind==='falling'){n.angle=legacyGameBattleAngle(f(target.position[0]-n.position[0]),f(aimY-n.position[1]));n.position=[...legacyGameBattleMovement(...n.position,n.angle,n.speed)];n.speed=f(n.speed+f(0.5));
        if(n.player.copyState().signal===0){const r=n.resourceId;if(r>=0x1add0&&r<=0x1add5){if(n.castTrail===0)trail(n.position,0x1adb7,false,200);}else if(r>=0x1add6&&r<=0x1add8){if(n.castTrail===0)trail(n.position,0x1adb6,false,200);n.castTrail++;}}
      }else{if(n.player.copyState().signal===0){n.castTurn=f(n.castTurn+f(0.1));n.angle=legacyGameBattleHomingAngle(n.angle,f(target.position[0]-n.position[0]),f(target.position[1]-n.position[1]),n.castTurn);}
        else if(n.position[0]<-200||n.position[0]>840||n.position[1]<-200||n.position[1]>680)n.deleted=true;n.position=[...legacyGameBattleMovement(...n.position,n.angle,n.speed)];
        if(n.castTrail===0){const index=n.resourceId-0x1addc,radius=[10,6,4,2][index];if(radius!==undefined){const y=f(n.position[1]+c.random.range(-radius,radius)),x=f(n.position[0]+c.random.range(-radius,radius));trail([x,y],index<2?0x1adb7:0x1adb6,true,202);}}
        if(n.resourceId===0x1adde)n.castTrail++;
      }
      n.castTrail=n.castTrail<2?n.castTrail+1:0;
      if(kind==='falling'&&n.player.copyState().signal===1){n.deleted=true;shakeFlag=0;}
    }
    if(kind==='falling')n.drawPriority=(victim.drawPriority+20)&255;screen(n,true);return true;
  }
  function initializeMetadata(b,rawFlags,local=context.localSlot){
    b.statusMetadata=battleFriendMetadata(rawFlags);
    if(local!==null){
      const friend=classifyBattleFriend(b.slot,local,b.nameBytes,b.statusMetadata,a.matchFriend);
      b.savedFlags=(b.savedFlags&~1)|Number(friend===true);
      friendKnown.set(b,friend!==null);
    }
  }
  function createElementFollowers(node,property,mainState){
    const base=elementBases[property];
    for(const [i,elementOffset] of [2,1,-1,-2].entries()){
      const n=a.allocate('element-follow',null,{parent:node,manualScreen:true,elementOffset,position:[...node.body.position],
        resourceId:base+i,actorFlags:0x60000,drawPriority:9,facing:0});
      a.animate(n,0,mainState);
      screen(n);
      node.children.set('element'+i,n);
    }
  }
  return Object.freeze({body,effect,submitOverlay:overlay,initializeMetadata,scatter,createElementFollowers,
    markFriendKnown(body){friendKnown.set(body,true);},
    applyBodyMetadata(node,ownerSlot=node.body.slot){const b=node.body,carrier={ownerSlot,castRead:b.tupleRead,castTuples:b.tuples};metadata(carrier);b.tupleRead=carrier.castRead;},
    bodyFeedback:feedback,bodyMessage:message,physicalExtraImpact:extraImpact,setShake(value,maximum=limit){shakeFlag=value;limit=maximum;},
    beginPass(){submissions=[];},slow(){return slow;},setSlow(value){slow=value;},
    resetEntry(){shakeFlag=amplitude=slow=0;},
    configureContext(value){context={...value};},
    character(node,rawFlags){const b=node.body;initializeMetadata(b,rawFlags);
      if(!(rawFlags&0x10000000)){for(let i=0;i<4;i++)a.removeChild(node,'element'+i);if(Object.hasOwn(b,'elementProperty'))b.elementProperty=0;b.dynamicFlags&=~0x10000000;}
      else{if(!b.elementProperty){for(let i=0;i<4;i++)if(b.statusMetadata[i])b.elementProperty=i+1;
        if(b.elementProperty)createElementFollowers(node,b.elementProperty,10);
      }b.dynamicFlags|=0x10000000;}
    },
    backgroundPass(phase){if(slow!==1||phase===0){c.screenOffset[0]=c.random.range(-amplitude,amplitude);c.screenOffset[1]=c.random.range(-amplitude,amplitude);}amplitude=shakeFlag?Math.min(amplitude+1,limit):Math.max(amplitude-1,0);return Object.freeze({offset:Object.freeze([...c.screenOffset]),amplitude,limit,shakeFlag,slow,quarterPhase:phase});},
    snapshot(){return Object.freeze({overlayCounter,overlayDirection,shakeFlag,amplitude,limit,slow,context:Object.freeze({...context}),submissions:Object.freeze([...submissions])});},
    validate(plan){for(const h of plan.hits)for(const style of [5,6])for(const ch of String(h.amount))common.image(243700+style*10-48+ch.charCodeAt(0));for(const r of plan.rows)if(r.assignments.numberValue!==undefined)for(const ch of String(r.assignments.numberValue))common.image(243750-48+ch.charCodeAt(0));},
  });
}
