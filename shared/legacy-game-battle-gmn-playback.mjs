/** Fixed37c4 GMN21 and its presentation callbacks. */
import {battleFail as fail} from './legacy-game-battle-bytes.mjs';
import {battleIntegerBox, battleIntegerBoxRead, battleIntegerBoxSnapshot} from './legacy-game-battle-integer-box.mjs';
import {LEGACY_GAME_BATTLE_SLOT_LAYOUT as layout} from './legacy-game-battle-data.mjs';
import {createLegacyGameBattleRandom} from './legacy-game-battle-math.mjs';
import {planLegacyGameGMNNotice} from './legacy-game-battle-window.mjs';
import {classifyLegacyGameActorResource, resolveLegacyGameActorResource} from './legacy-game-motion.mjs';

const unavailable=reason=>Object.freeze({kind:'gmn-unavailable',reason});
const battleSlot=slot=>slot===50?20:slot===51?21:slot;
const fadeChildren=['status','special','shadow','overlay','element0','element1','element2','element3'];
const sparkResource=0x1af84;

export function createBattleGMNPlayback(a,c){
  let palette=null;
  let windowDraws=[],textDraws=[];

  function formation(slot,replacement){
    const start=slot===21?10:0;
    return Array.from({length:10},(_,i)=>start+i)
      .map(i=>replacement&&i===slot?replacement:a.get(i)).filter(Boolean);
  }

  function queue(command,owner,resourceCode){
    const [wireSlot,mode,wireSelected,sound,field,name,rawResourceId,value1d0,hp,maxHp,mp,maxMp,rawFlags]=command.fields;
    const slot=battleSlot(wireSlot),selected=battleSlot(wireSelected);
    if(command.index!==21||!layout[slot]||![0,1,2].includes(mode))return unavailable('gmn-mode-or-slot');
    const prior=a.get(slot);
    if(mode===0&&!prior)return unavailable('gmn-dismiss-body-absent');
    if(mode!==0&&!layout[selected])return unavailable('gmn-selected-slot');
    const born=mode===0?null:a.createReplacement(slot);
    const side=formation(slot,born);
    const leader=slot>=20?side[0]?.slot??selected:selected;
    if(born&&leader!==slot&&!a.get(leader))return unavailable('gmn-leader-body-absent');

    const rows=new Map();
    function add(body,actions,tuple){
      if(!rows.has(body))rows.set(body,{actions:[],tuples:[]});
      const row=rows.get(body);
      row.actions.push(...actions);
      if(tuple)row.tuples.push(tuple);
    }
    function checkQueues(){
      for(const [body,row] of rows){
        if(body.actionWrite+row.actions.length>198||body.tupleWrite+row.tuples.length>199)fail('LEGACY_BATTLE_BODY_CAPACITY');
      }
    }
    function applyQueues(){
      for(const [body,row] of rows){
        for(const tuple of row.tuples)a.appendTuple(body,tuple);
        a.append(body,owner,row.actions);
        body.state=body.actions[body.actionRead];
      }
    }

    if(!born){
      const node=a.node(prior);
      add(prior,[169,171,167,163,49],[0,0,40]);
      for(const body of side)add(body,[166,163]);
      checkQueues();
      // Actor cell 1e0 holds the palette request saved at birth.
      rows.get(prior).tuples[0][0]=node.gmnPriorPalette?battleIntegerBoxRead(node.gmnPriorPalette,c.random):0;
      node.gmnDismissal=true;
      applyQueues();
      return Object.freeze({kind:'gmn-queued',slot,mode,selected:null,actors:Object.freeze([...rows.keys()].map(b=>b.slot))});
    }

    let noticePlan;
    try{noticePlan=planLegacyGameGMNNotice(name);}
    catch(error){
      if(error?.code==='LEGACY_TEXT_DANGLING_BYTE')return unavailable('gmn-notice-name-encoding');
      throw error;
    }
    const presentation=mode===1?2:(createLegacyGameBattleRandom(c.random.copySeed()).next()&1)+1;
    const resourceId=classifyLegacyGameActorResource(rawResourceId)===0?rawResourceId:resolveLegacyGameActorResource(rawResourceId,resourceCode);
    const flags=rawFlags>>>0;
    const fieldResource=field===0?-1:field;
    const vitals=[hp,maxHp,mp,maxMp];
    born.actionWrite=-1;
    born.actions[0]=born.tuples[0]=-1;
    add(born,[78,170,169,0,35,162,...(presentation===1?[166]:[6,10])],[13,0,40,fieldResource]);
    for(const body of side){
      add(body,[35,162]);
      if(body.slot===leader)add(body,[71,72],[slot,presentation,0,fieldResource]);
      add(body,[body.slot===selected?168:167]);
      if(body.slot===leader)add(body,[0]);
    }
    add(born,[24,71,72],[leader,0,0,0]);
    checkQueues();
    if(a.count()+3+Number(mode===2)>4096)fail('LEGACY_BATTLE_PLAYBACK_BUDGET');
    a.probe(100500);
    a.probe(resourceId);
    if(mode===2)a.probe(sparkResource);
    if(fieldResource>=0)a.image(fieldResource);

    if(mode===2){
      c.random.next();
      a.allocate('gmn-particle-timer',null,{counter:150,actorFlags:2,drawPriority:3});
    }
    if(prior)a.remove(prior);
    const node=a.allocate('body',born);
    a.animate(node,0,10);
    a.replace(slot,born);
    Object.assign(born,{nameBytes:name.slice(),resourceId,value1d0,vitals,rawStatusFlags:flags,
      dynamicFlags:flags,position:[...layout[slot].target],drawFlagMask:4,drawFlagValue:4,effectResource:sound});
    node.gmnVitals=vitals.map(value=>battleIntegerBoxSnapshot(battleIntegerBox(value,c.random)));
    node.gmnPriorPalette=battleIntegerBox(palette?.index??0,c.random);
    a.screen(node);
    a.animate(node,0,10);
    const notice=a.allocate('gmn-notice',null,{position:[320,240],screenSpace:true,counter:100,drawPriority:2,actorFlags:0x40000});
    const {x,y,width,height,font,style,lines}=noticePlan;
    const window=a.allocate('gmn-window',null,{priority:3,position:[x,y],screenSpace:true,drawPriority:212,actorFlags:6});
    const halfWidth=width>>1,halfHeight=height>>1;
    window.gmnWindow={x,y,width,height,halfWidth,centerY:y+halfHeight,openingHeight:0,
      verticalStep:Math.trunc(halfHeight/10),gate:{encoded:0,mask:0,reads:0}};
    notice.gmnNotice={style,font,lines,window};
    a.sound(notice,0x38);
    a.reface(born);
    if(presentation===1){
      node.presentationAlpha=0;
      born.actorFlags|=2;
    }else{
      born.position=[...layout[slot].entry];
      node.travelTarget=[...layout[slot].target];
      a.screen(node);
    }
    for(const body of side)a.node(body).presentationAlpha=255;
    applyQueues();
    return Object.freeze({kind:'gmn-queued',slot,mode,selected,leader,presentation,
      actors:Object.freeze([...rows.keys()].map(b=>b.slot)),
      metadata:Object.freeze({nameBytes:name.slice(),rawResourceId,resourceId,value1d0,values:Object.freeze([...vitals]),statusFlags:flags})});
  }

  function adjustLinks(node,setAlpha,delta,setFlags,clearFlags){
    for(const key of fadeChildren){
      const child=node.children.get(key);
      if(!child)continue;
      const alpha=((setAlpha??child.presentationAlpha??255)+delta)&255;
      child.presentationAlpha=alpha;child.presentationMask=alpha===255?0:8;
      child.actorFlags=alpha===0?2:(child.actorFlags&~(clearFlags|2))|setFlags;
    }
  }

  function fade(node,type){
    const b=node.body;
    const rising=type===166;
    const delta=rising?3:type===167?-3:-2;
    if(rising){
      b.actorFlags&=~2;
      adjustLinks(node,null,0,0,2);
    }
    const next=(node.presentationAlpha??255)+delta;
    if(next>=255||next<=0){
      node.presentationAlpha=rising?255:0;
      adjustLinks(node,node.presentationAlpha,0,0,0);
      if(!c.alternativeRenderer){
        b.actorFlags&=~0x8000;
        adjustLinks(node,null,0,0,0x8000);
      }
      if(!rising){
        b.actorFlags|=2;
        adjustLinks(node,null,0,0x8000,0);
      }
      a.pop(b);
    }else{
      node.presentationAlpha=next;
      adjustLinks(node,null,delta,0,0);
      if(!c.alternativeRenderer){
        b.actorFlags|=0x8000;
        adjustLinks(node,null,0,0x8000,0);
      }
    }
  }

  return Object.freeze({
    queue,
    body(node){
      const b=node.body;
      switch(b.state){
        case 162:case 163:
          node.gmnDrawStyle=b.state===162?8:0;node.presentationMask=node.gmnDrawStyle;
          a.pop(b);
          break;
        case 164:case 165:
          // 4136fb/413710 change 309 only; 310 and the separate 308 color mask survive.
          b.drawFlagMask=b.state===164?255:0;
          a.pop(b);
          break;
        case 166:case 167:case 168:
          fade(node,b.state);
          break;
        case 169:{
          const at=b.tupleRead*4;
          if(b.tupleRead>=199)fail('LEGACY_BATTLE_BODY_CAPACITY');
          const index=b.tuples[at],frames=Math.max(1,b.tuples[at+2]);
          // GMN writes palette13 or the actor's saved request. Both source entries have tier0.
          if(index===0||index===13)palette=Object.freeze({index,frames});
          b.tupleRead++;
          a.pop(b);
          break;
        }
        default:return false;
      }
      a.screen(node);
      return true;
    },
    effect(node,ctx){
      if(node.kind==='gmn-notice'){
        const {window,lines,font}=node.gmnNotice;
        const w=window.gmnWindow;
        if(battleIntegerBoxRead(w.gate,c.random)>0){
          for(const line of lines)textDraws.push(Object.freeze({
            x:w.x+40,y:w.y+40,font,color:0,bytes:Object.freeze(Array.from(line)),
          }));
          if(--node.counter<0){
            node.deleted=window.deleted=true;
            for(const line of lines)line.fill(0);
          }
        }
      }else if(node.kind==='gmn-window'){
        const w=node.gmnWindow;
        if(node.state===0){
          windowDraws.push(Object.freeze({kind:'opening',x:w.x,y:w.centerY-w.openingHeight,
            width:w.halfWidth*2,height:w.openingHeight*2}));
          w.openingHeight+=w.verticalStep;
          if(node.counter++>9)node.state=2;
        }else if(node.state===2){
          windowDraws.push(Object.freeze({kind:'tiles',x:w.x,y:w.y,width:w.width,height:w.height}));
          w.gate=battleIntegerBox(1,c.random);
        }
      }else if(node.kind==='gmn-particle-timer'){
        if((node.counter&7)===0){
          const y=c.random.next()%480,x=c.random.next()%640;
          a.allocate('gmn-particle',null,{position:[x,y],screenSpace:true,resourceId:sparkResource,
            actorFlags:c.alternativeRenderer?0x40000:0x48000,drawFlagMask:4,drawFlagValue:4});
        }
        if(--node.counter<0)node.deleted=true;
      }else if(node.kind==='gmn-particle'){
        if(a.animate(node,1,ctx.mainState)===1)node.deleted=true;
      }else return false;
      return true;
    },
    beginPass(){windowDraws=[];textDraws=[];},
    reset(){palette=null;windowDraws=[];textDraws=[];},
    snapshot(){return palette;},
    presentation(){
      if(!windowDraws.length&&!textDraws.length)return null;
      return Object.freeze({windows:Object.freeze([...windowDraws]),text:Object.freeze([...textDraws])});
    },
    nodeState(node){
      if(node.gmnNotice){
        const {style,font,lines}=node.gmnNotice;
        return {gmnNotice:Object.freeze({style,font,lines:Object.freeze(lines.map(bytes=>bytes.slice()))})};
      }
      if(node.gmnPriorPalette||node.gmnDrawStyle!==undefined)return {
        gmnPresentation:Object.freeze({drawStyle:node.gmnDrawStyle??0,
          priorPalette:node.gmnPriorPalette?battleIntegerBoxSnapshot(node.gmnPriorPalette):null,
          birthIntegerBoxes:node.gmnVitals?Object.freeze([...node.gmnVitals]):null}),
      };
      return {};
    },
  });
}
