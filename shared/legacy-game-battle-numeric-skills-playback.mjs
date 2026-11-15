/** Source numeric chant/146/179/137 and constructor16/17 parent completion. */
import {battleFail as fail} from './legacy-game-battle-bytes.mjs';
import {LEGACY_GAME_BATTLE_NUMERIC_SKILLS_PROFILE as profile} from './legacy-game-battle-numeric-skills.mjs';
const classes=new Set(profile.classes);
export function createBattleNumericSkillsPlayback(a,c,common){
  const screen=n=>{n.screen=n.position.map(v=>Math.trunc(v)|0);};
  const tuple=b=>b.tuples[b.tupleRead*4];
  const advance=b=>{if(b.tupleRead>=199)fail('LEGACY_BATTLE_BODY_CAPACITY');return b.tuples[++b.tupleRead*4]===-1;};
  function effectNode(node,kind,resource,actorFlags=0x40000,parent=node,drawPriority=204){const n=a.allocate('numeric-skill-'+kind,null,{parent,manualScreen:true,resourceId:resource,
    actorFlags,drawPriority,position:[...node.body.position],facing:0,drawFlagMask:4,drawFlagValue:4});screen(n);return n;}
  function body(node,ctx){const b=node.body,type=b.state;if(!common.configured()||!classes.has(b.classCode)&&!(b.classCode===108&&(type===146||type===179)))return false;
    if(type===135){if(b.classCode===83)return false;b.animationAction=6;if(b.skillStatus===0){node.children.set('chant',effectNode(node,'chant',b.chantResource));b.skillStatus=1;
        a.event({kind:'sound',value:0x103,nodeId:node.id,slot:b.slot,position:Object.freeze([...node.screen])});}
      const signal=node.player.copyState().signal;if(signal>9999&&signal<20000){if(node.children.has('chant')){a.removeChild(node,'chant');let count=0;
          while(tuple(b)!==-1){if(++count>199)fail('LEGACY_BATTLE_BODY_CAPACITY');const target=a.get(tuple(b));if(!target)fail('LEGACY_BATTLE_NUMERIC_SKILL_TARGET_REMOVED');a.restart(target);advance(b);}advance(b);}node.player.clearSignal();}
      if(a.animate(node,1,ctx.mainState)===1){if(node.children.has('chant')){a.removeChild(node,'chant');let count=0;do{if(++count>199)fail('LEGACY_BATTLE_BODY_CAPACITY');}while(!advance(b));}b.skillStatus=0;a.pop(b);}
    }else if(type===137){if(b.classCode!==83){const target=a.get(tuple(b));if(!target)fail('LEGACY_BATTLE_NUMERIC_SKILL_TARGET_REMOVED');a.pop(target);}a.pop(b);}
    else if(type===146||type===179){if(!(b.dynamicFlags&0x60))a.animate(node,0,ctx.mainState);
      if(b.skillStatus===0){const resource=0x1ae05+profile.levelTable[b.skillLevel],n=effectNode(node,'charge',resource,0x48000);if(resource===0x1ae05)effectNode(node,'overlay',0x1ae68,0x48000,n,203);b.skillStatus=1;}
      b.state=type===179?199:157;
    }else return false;a.screen(node);return true;
  }
  function effect(n,ctx){if(n.kind==='numeric-skill-chant'){if(n.parent.deleted)n.deleted=true;a.animate(n,0,ctx.mainState);screen(n);return true;}
    if(n.kind==='numeric-skill-charge'){if(a.animate(n,1,ctx.mainState)===1){if(!n.parent.deleted&&n.parent.body.skillStatus!==0)n.parent.body.skillStatus=2;n.deleted=true;}screen(n);return true;}
    if(n.kind==='numeric-skill-overlay'){if(n.parent.deleted)n.deleted=true;a.animate(n,0,ctx.mainState);screen(n);return true;}return false;
  }
  return Object.freeze({body,effect,validate(plan){for(const r of plan.rows)if(r.actions.some(t=>[154,155,179,193].includes(t))){const b=a.get(r.slot),style=r.assignments.numberStyle??b.numberStyle,value=r.assignments.numberValue??b.numberValue;
      if(style>0||style===0&&r.actions.some(t=>t===179||t===193))for(const ch of String(value))common.image(243700+style*10-48+ch.charCodeAt(0));}}});
}
