/** Source status/utility callbacks and manager-owned field. No supplied readiness. */
import {battleFail as fail} from './legacy-game-battle-bytes.mjs';
import {battleStatusSkillEffect,LEGACY_GAME_BATTLE_STATUS_SKILLS_PROFILE as profile} from './legacy-game-battle-status-skills.mjs';
const f=Math.fround,classes=new Set(profile.classes),selfResources=new Map([[50,0x1ae0c],[51,0x1ae09],[52,0x1ae0a],[53,0x1ae0b],[88,0x1ae4b]]);
const effectTypes=new Set([117,118,128,131,132,143,145,153,175,178,185]);
const circleA=[48,44,34,18,0,-18,-34,-44,-48,-44,-34,-18,0,18,34,44];
const circleB=[0,14,26,44,47,44,26,14,0,-14,-26,-44,-47,-44,-26,-14];
export function createBattleStatusSkillsPlayback(a,c,common){
  let field=null,used=false;
  const nodeFor=b=>{const n=a.node(b);if(!n)fail('LEGACY_BATTLE_STATUS_SKILL_BODY_REMOVED');return n;};
  const screen=(n,offset=false)=>{n.screen=n.position.map((v,i)=>(Math.trunc(v)+(offset?c.screenOffset[i]:0))|0);};
  const sound=(n,value)=>a.event({kind:'sound',value,nodeId:n.id,slot:n.body?.slot??null,position:Object.freeze([...n.screen])});
  const tuple=b=>{const at=b.tupleRead*4;return {slot:b.tuples[at],flags:b.tuples[at+1]>>>0};};
  const advance=b=>{if(b.tupleRead>=199)fail('LEGACY_BATTLE_BODY_CAPACITY');return b.tuples[++b.tupleRead*4]===-1;};
  function parentDone(n){if(!n.parent.deleted&&n.parent.body.skillStatus!==0)n.parent.body.skillStatus=2;n.deleted=true;}
  function setField(resource){used=true;if(field&&!field.deleted){field.resourceId=resource;return;}
    field=a.allocate('status-skill-field',null,{manualScreen:true,resourceId:resource,actorFlags:0x40000,drawPriority:7,
      position:[...profile.fieldPosition],facing:0,drawFlagMask:4,drawFlagValue:4});a.animate(field,1,10);screen(field,true);
  }
  function condition(node,resource){if(node.children.has('status'))return;
    const index=resource-0x1adfb;if(index>=0&&index<6)node.body.dynamicFlags|=16<<index;
    const n=a.allocate('status',null,{parent:node,resourceId:resource,actorFlags:0x60000,drawPriority:9,facing:0,
      position:[node.body.position[0],f(node.body.position[1]+1)]});a.animate(n,1,10);a.screen(n);node.children.set('status',n);
  }
  function toggleOverlay(node,enabled){const b=node.body;
    if(!enabled){a.removeChild(node,'overlay');b.dynamicFlags&=~0x800;return;}
    used=true;b.dynamicFlags|=0x800;if(node.children.has('overlay'))return;
    const n=a.allocate('status-skill-overlay',null,{parent:node,manualScreen:true,resourceId:0x1ae48,actorFlags:0x48000,drawPriority:200,
      position:[b.position[0],f(b.position[1]+1)],facing:0,drawFlagMask:4,drawFlagValue:4});a.animate(n,1,10);screen(n,true);node.children.set('overlay',n);
  }
  function modifier(node,index,pop=false){
    if(node.children.has('modifier'))return;
    used=true;
    if(index>=0&&index<6)node.body.dynamicFlags|=0x4000<<index;
    else if(index===15){node.body.dynamicFlags|=0x100000;index=0;}
    const n=a.allocate('status-skill-modifier',null,{parent:node,manualScreen:true,resourceId:0x1926a+index,
      actorFlags:0x40000,drawPriority:200,position:[...node.body.position],facing:0,
      drawFlagMask:4,drawFlagValue:4,modifierType:index,modifierX:0,modifierY:pop?-50:0,
      scale:pop?[f(0.3),f(0.3)]:[1,1]});
    a.animate(n,1,10);screen(n);node.children.set('modifier',n);
  }
  function charge(node,type){const b=node.body,q=node.player.copyState(),s=battleStatusSkillEffect(type,b.skillLevel);
    if(!q.geometry)fail('LEGACY_BATTLE_BODY_PARENT_GEOMETRY');let position;
    if(s.kind==='charge')position=[b.position[0],f(b.position[1]+(s.offset?Math.trunc(q.drawOffsetY/2):0))];
    else position=[f(Math.trunc(q.geometry.width/2)+q.drawOffsetX+node.screen[0]),f(node.screen[1])];
    const n=a.allocate('status-skill-'+s.kind,null,{parent:node,manualScreen:true,resourceId:s.resource,actorFlags:s.actorFlags,drawPriority:204,
      position,facing:0,drawFlagMask:4,drawFlagValue:4,...(s.kind==='fall-emitter'?{completedParticles:0,emitterSlots:new Uint8Array(32),emitterIndex:0}:s.kind==='rise-emitter'?{completedParticles:0,emittedParticles:0}:{})});
    b.skillStatus=1;screen(n);if(s.kind!=='charge')sound(node,s.kind==='rise-emitter'?0x119:0x118);return n;
  }
  // 40e7fd uses a running pass count and a shorter divisor at each turn.
  function preCast(node,ctx){
    const b=node.body,pass=(node.preCastPass??0)+1,turn=node.preCastTurn??0;
    node.preCastPass=pass;
    if(pass===1){
      b.animationAction=8;
      sound(node,0xa3);sound(node,0xab);
    }
    if(pass%(36-turn)===0){
      const rotate=b.animationAction===9;
      b.animationAction=rotate?8:9;
      sound(node,0xa3);sound(node,rotate?0xab:0xae);
      if(rotate)b.facing=(b.facing+2)%8;
      node.preCastTurn=turn+1;
      if(turn===9){
        node.preCastPass=node.preCastTurn=0;
        b.animationAction=9;
        a.reface(b);a.pop(b);
      }
    }
    a.animate(node,1,ctx.mainState);
    a.animate(node,1,ctx.mainState);
    a.animate(node,1,ctx.mainState);
  }
  function body(node,ctx){const b=node.body,type=b.state;if(!common.configured())return false;
    if(type===37&&(b.classCode===98||b.classCode>=99&&b.classCode<=104)){used=true;preCast(node,ctx);a.screen(node);return true;}
    if(type===135){if(!classes.has(b.classCode)&&b.classCode!==97)return false;used=true;b.animationAction=6;
      if(b.skillStatus===0){const n=a.allocate('status-skill-chant',null,{parent:node,manualScreen:true,resourceId:b.chantResource,
        actorFlags:0x40000,drawPriority:204,position:[...b.position],facing:0,drawFlagMask:4,drawFlagValue:4});screen(n);node.children.set('chant',n);b.skillStatus=1;sound(node,0x103);}
      const signal=node.player.copyState().signal;
      if(signal>9999&&signal<20000){if(node.children.has('chant')){a.removeChild(node,'chant');
          if(b.classCode===97){a.shake(1,6);sound(node,5);sound(node,0x106);}
          else if(b.classCode===98&&(b.skillVariant===12||b.skillVariant===13)){
            const assist=a.get(b.assistSlot);
            if(assist)a.restart(assist);
          }else{
            if(selfResources.has(b.classCode)){if(tuple(b).slot!==-1){sound(node,0x113);setField(selfResources.get(b.classCode));advance(b);}}
            else{let count=0;while(tuple(b).slot!==-1){
              if(++count>199)fail('LEGACY_BATTLE_BODY_CAPACITY');
              const targetSlot=tuple(b).slot,target=a.get(targetSlot);
              if(!target&&!(b.classCode===98&&b.skillVariant===7))fail('LEGACY_BATTLE_STATUS_SKILL_TARGET_REMOVED');
              if(b.classCode===98)a.seedSource(b.slot+targetSlot);
              if(target)a.restart(target);
              advance(b);
            }}
            advance(b);
          }
        }node.player.clearSignal();}
      if(a.animate(node,1,ctx.mainState)===1){if(node.children.has('chant')){a.removeChild(node,'chant');let count=0;do{if(++count>199)fail('LEGACY_BATTLE_BODY_CAPACITY');}while(!advance(b));}b.skillStatus=0;a.pop(b);}
      if(node.children.has('chant')&&b.classCode===86)a.overlay(5);a.screen(node);return true;
    }
    if(effectTypes.has(type)){used=true;if(!(b.dynamicFlags&0x60))a.animate(node,0,ctx.mainState);if(b.skillStatus===0)charge(node,type);b.state=[175,178,185].includes(type)?199:157;}
    else if(type===138){condition(node,0x1adfb+(b.classCode===98?b.skillVariant:(b.classCode-32)%6));if(!(b.dynamicFlags&0x60))a.animate(node,0,ctx.mainState);a.pop(b);}
    else if(type===139){a.removeChild(node,'status');b.dynamicFlags&=~0x3f0;a.animate(node,0,ctx.mainState);a.pop(b);}
    else if(type===144){toggleOverlay(node,!(b.dynamicFlags&0x800));a.pop(b);}
    else if(type===140){modifier(node,b.classCode-99,true);if(!(b.dynamicFlags&0x60))a.animate(node,0,ctx.mainState);a.pop(b);}
    else if(type===77){for(const key of ['shadow','element0','element1','element2','element3'])a.removeChild(node,key);b.animationAction=0;b.dynamicFlags&=~2;b.savedFlags&=~2;a.pop(b);}
    else if(type===43){
      c.random.next(); // 4032f0 boxes zero before writing the live HP payload.
      if(b.vitals){
        const before=b.vitals[0];
        b.vitals[0]=0;
        a.event({kind:'battle-vital',slot:b.slot,field:'HP',before,value:0,delta:-before});
      }
      a.pop(b);
    }
    else return false;a.screen(node);return true;
  }
  function particle(parent,kind,index){let x,y,extra;
    if(kind==='rise'){x=circleA[index&15];y=circleB[index&15];extra={velocity:0,acceleration:f(0.1),crossing:parent.screen[1]+y-100};}
    else{x=circleA[15-(index&15)];y=circleB[15-(index&15)];extra={crossing:parent.screen[1]+y-40};}
    const n=a.allocate('status-skill-'+kind+'-particle',null,{parent,manualScreen:true,resourceId:kind==='rise'?0x1adbb:0x1adec,
      actorFlags:0x40000,drawPriority:204,position:[f(parent.screen[0]+x),f(parent.screen[1]+y-(kind==='fall'?100:0))],
      facing:0,drawFlagMask:4,drawFlagValue:4,...extra});screen(n);return n;
  }
  function effect(n,ctx){
    if(n.kind==='status-skill-modifier'){
      if(n.parent.deleted)n.deleted=true;
      else{
        const indicator=n.parent.children.get('indicator');
        if(indicator&&!(indicator.actorFlags&2)){if(n.modifierX<10)n.modifierX++;}
        else if(n.modifierX>0)n.modifierX--;
        if(n.modifierY!==0){
          n.scale=n.scale.map(value=>Math.min(1,f(value+f(0.04))));
          if(n.scale[1]>=1)n.height=f(n.height+1);
          if(n.height>=30)n.modifierY+=7;
          if(n.modifierY>0)n.modifierY=0;
        }
        a.animate(n,0,ctx.mainState);
        n.position=[f(n.parent.body.position[0]+n.modifierX),f(f(n.parent.body.position[1]-5)+n.modifierY)];
      }
      screen(n,true);return true;
    }
    if(n.kind==='status-skill-field'){a.animate(n,0,ctx.mainState);screen(n,true);return true;}
    if(n.kind==='status-skill-overlay'){if(n.parent.deleted)n.deleted=true;else{a.animate(n,0,ctx.mainState);n.position=[n.parent.body.position[0],f(n.parent.body.position[1]+1)];}screen(n,true);return true;}
    if(n.kind==='status-skill-chant'){if(n.parent.deleted)n.deleted=true;a.animate(n,0,ctx.mainState);screen(n);return true;}
    if(n.kind==='status-skill-charge'){if(a.animate(n,1,ctx.mainState)===1)parentDone(n);screen(n);return true;}
    if(n.kind==='status-skill-rise-emitter'){
      const before=n.state++;if(before>0&&n.emittedParticles<32){n.state=0;particle(n,'rise',n.emittedParticles++);}
      if(n.completedParticles>31)parentDone(n);return true;
    }
    if(n.kind==='status-skill-fall-emitter'){
      const before=n.state++;if(before>1){n.state=0;for(let i=0;i<=n.emitterIndex;i++)if(n.emitterSlots[i]<4){particle(n,'fall',i);n.emitterSlots[i]++;}n.emitterIndex=Math.min(31,n.emitterIndex+1);}
      if(n.completedParticles>127)parentDone(n);return true;
    }
    if(n.kind==='status-skill-rise-particle'){
      if(n.parent.deleted){n.deleted=true;return true;}n.velocity=f(n.velocity-n.acceleration);n.position[1]=f(n.position[1]+n.velocity);
      if(n.position[1]<n.crossing){n.parent.completedParticles++;n.deleted=true;}a.animate(n,0,ctx.mainState);screen(n);return true;
    }
    if(n.kind==='status-skill-fall-particle'){
      n.position[1]=f(n.position[1]+3);if(n.position[1]>n.crossing){n.parent.completedParticles++;n.deleted=true;}a.animate(n,0,ctx.mainState);screen(n);return true;
    }
    return false;
  }
  return Object.freeze({body,effect,condition,
    character(node,flags){
      toggleOverlay(node,!!(flags&0x800));
      // 433cd0 clears each pair's lower bit when its upper flag is absent.
      for(let i=0;i<6;i++){
        if(flags&(0x4000<<i))modifier(node,i);
        else node.body.dynamicFlags&=~(0x4000<<(i&~1));
      }
    },
    characterFlags(flags){if(flags&0x20)return;const row=[[1,0x1ae0c],[2,0x1ae09],[4,0x1ae0a],[8,0x1ae0b],[16,0x1ae4b]].find(([bit])=>flags&bit);
      if(row)setField(row[1]);else if(field){field.deleted=true;field=null;}
    },
    reset(){field=null;used=false;},
    snapshot(){return Object.freeze({used,fieldNodeId:field?.id??null,fieldResource:field?.resourceId??null});},
    validate(plan){
      if(plan.category>=99&&plan.category<=104||plan.category===114){
        const required=resource=>{if(!a.probeAnimation(resource,0).state.geometry)fail('LEGACY_BATTLE_SKILL_ANIMATION_REQUIRED');};
        required(plan.chantResource);
        if(plan.hits.length)required(0x1ae6d);
        for(const hit of plan.hits)if(hit.flags&0x80000){
          if(!a.node(a.get(hit.slot)).children.has('modifier'))required(0x1926a+(plan.category===114?0:plan.category-99));
        }
      }
      if(plan.category===98&&plan.variant===13){
        for(const hit of plan.hits)common.validateStatus({style:5,amount:hit.amount});
      }
      if(plan.category===68||plan.category===98&&plan.variant===11){
        for(const hit of plan.hits)if(hit.flags&0x80000)common.validateStatus({style:5,amount:hit.extra});
      }
      if(plan.category===98&&plan.variant===10||plan.category===109){
        for(const row of plan.rows)if(row.actions.includes(178)){
          const target=a.get(row.slot);
          if(target.numberStyle>=0)common.validateStatus({style:target.numberStyle,amount:target.numberValue});
        }
      }
    },
  });
}
