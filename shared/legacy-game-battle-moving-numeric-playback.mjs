/** Fixed37c4 source83 movement and frozen actor-copy afterimages. */
import {battleFail as fail} from './legacy-game-battle-bytes.mjs';
import {legacyGameBattleHomingAngle} from './legacy-game-battle-casting-playback.mjs';
export const LEGACY_GAME_BATTLE_MOVING_NUMERIC_PROFILE=Object.freeze({
  id:'legacy-se6000-37c4-moving-numeric-v1',sourceSha256:'37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd',
  classCode:83,midpoint:Object.freeze([318,270]),afterImageVisits:12,completeSKL:false,completeBattleGameplay:false,
});
const f=Math.fround;
export function createBattleMovingNumericPlayback(a,c,common){
  function body(node,ctx){const b=node.body,type=b.state;if(!common.configured()||![82,83,98].includes(b.classCode))return false;
    const flight=b.classCode!==82;
    if(type===8){b.animationAction=2;b.speedPercent=100;a.aim(b,b.rememberedPosition,true);if(a.animate(node,1,ctx.mainState)===1){if(b.dynamicFlags&2)b.speedPercent=200;a.pop(b);}}
    else if(type===6){b.animationAction=3;b.speed=8;b.speedPercent=100;a.aim(b,b.rememberedPosition,true);a.move(b);if(a.distance(b,b.rememberedPosition)<5){b.position=[...b.rememberedPosition];a.pop(b);}a.animate(node,0,ctx.mainState);}
    else if(flight&&(type===133||b.classCode===83&&type===193)){if(!(b.dynamicFlags&0x60))a.animate(node,0,ctx.mainState);if(b.skillStatus===0){const q=node.player.copyState();if(!q.geometry)fail('LEGACY_BATTLE_BODY_PARENT_GEOMETRY');
        const child=a.allocate('numeric-skill-charge',null,{parent:node,manualScreen:true,resourceId:0x1ae4d,actorFlags:0x48000,drawPriority:204,position:[b.position[0],f(b.position[1]+Math.trunc(q.drawOffsetY/2))],facing:0,drawFlagMask:4,drawFlagValue:4});child.screen=child.position.map(v=>Math.trunc(v)|0);b.skillStatus=1;}
      b.state=type===193?199:157;
    }else if(flight&&type===88){b.speed=10;const at=b.tupleRead*4,slot=b.tuples[at];
      if(node.player.copyState().signal===0&&slot!==-1){const target=a.get(slot);if(!target)fail('LEGACY_BATTLE_MOVING_NUMERIC_TARGET_REMOVED');b.afterImageEnabled=1;
        b.angle=legacyGameBattleHomingAngle(b.angle,f(target.position[0]-b.position[0]),f(target.position[1]-b.position[1]),20);
        if(node.player.copyState().signal===0&&a.distance(b,target.position)<20){a.restart(target);if(target.state===0)a.pop(target);b.attackCooldown=4;
          if(b.tupleRead>=199)fail('LEGACY_BATTLE_BODY_CAPACITY');if(b.tuples[++b.tupleRead*4]===-1)node.player.setSignal(1);
        }
      }
      if(b.attackCooldown>0)b.attackCooldown--;if(b.attackCooldown===0){b.facing=(b.facing+1)&7;a.animate(node,0,ctx.mainState);a.move(b);
        if(b.position[0]<-200||b.position[0]>840||b.position[1]<-200||b.position[1]>680){if(b.tupleRead>=199)fail('LEGACY_BATTLE_BODY_CAPACITY');b.tupleRead++;a.pop(b);}}
    }else return false;a.screen(node);return true;
  }
  function afterBody(node,previousScreen){const b=node.body;if(b.afterImageEnabled!==1)return;const next=(b.afterImageCounter+1)|0;b.afterImageCounter=next>1?0:next;
    if(b.afterImageCounter!==1)return;
    const q=node.player.copyState(),n=a.allocate('moving-numeric-afterimage',null,{manualScreen:true,ownerSlot:b.slot,resourceId:b.resourceId,actorFlags:b.actorFlags|0x8000,
      state:b.state,counter:0,deleted:node.deleted,position:[...b.position],drawPriority:node.drawPriority,height:node.height,facing:b.facing,scale:[...b.scale],alternateY:node.alternateY??0,
      drawFlagMask:b.drawFlagMask,drawFlagValue:b.drawFlagValue,staticFrame:Object.freeze({...q})});
    // 40a120 copies the actor before writing this invocation's screen coordinates.
    // Its copied float position is current; the copied integer screen is previous.
    n.screen=[...previousScreen];
    // Allocation inserts at2; the actor copy then overwrites its priority byte
    // while preserving those list links. Future insertions inspect the copied key.
    n.priority=node.priority;
  }
  function effect(n){if(n.kind!=='moving-numeric-afterimage')return false;if(++n.counter>11)n.deleted=true;return true;}
  return Object.freeze({body,afterBody,effect});
}
