/** Browser presentation and semantic intents for actual owned battle jobs. No source-state mutation. */
export function createLegacyGameBattleCanvasHost({canvas,client,decodeName,onState=()=>{},onImage=()=>{},onFrame=()=>{},clock=()=>Math.trunc(performance.now())>>>0,schedule=(fn,delay)=>setTimeout(fn,delay),cancel=clearTimeout}){
  const context=canvas?.getContext('2d',{alpha:true});if(!context||typeof decodeName!=='function')throw Error('LEGACY_BATTLE_CANVAS_CONFIGURATION');
  let closed=false,running=false,busy=false,timer=null,job=null,epoch=0,presentations=0,steps=0,queued=false,pendingIntent=null,blocked=null,countdown=null,lastError=null;
  const serial=client.copyBattleState().generation;let cached=null;
  const code=e=>Object.getOwnPropertyDescriptor(e??{},'code')?.value;
  function inspect(){return cached??Object.freeze({state:closed?'closed':'stopped',generation:serial,presentations,steps,ready:false,actors:Object.freeze([]),blocked,lastError});}
  function refresh(){if(closed)return;const c=client.inspect(),battle=client.copyBattleState(),entry=client.copyBattleEntry(),input=client.copyBattleInput(),commands=client.copyBattleCommands();
    const ready=!c.paused&&!queued&&!blocked&&entry?.mainState===10&&entry.phase===4&&[1,4].includes(input?.state)&&input.menu.state===0;
    const player=input?.playerPopup,name=(bytes,fallback)=>{try{return decodeName(bytes);}catch{return fallback;}},playerReady=ready&&input?.state===1&&player?.state==='ready';
    const playerPopup=Object.freeze({state:player?.state??'closed',mode:player?.mode??null,mainSlot:player?.mainSlot??-1,levelIndex:player?.levelIndex??-1,targeting:!!player?.targeting,
      records:Object.freeze((player?.records??[]).map(r=>Object.freeze({slot:r.slot,name:name(r.nameBytes,'技能'),enabled:!!(playerReady&&r.enabled)}))),
      levels:Object.freeze((player?.levels??[]).filter(l=>l.present).map(l=>Object.freeze({index:l.index,name:name(l.nameBytes,'等级'),description:name(l.descriptionBytes,''),mpCost:l.mpCost,enabled:!!(playerReady&&l.enabled)})))});
    const items=input?.itemPopup,itemReady=ready&&input.state===1&&items?.state==='ready';
    const removal=items?.weaponRemoval;
    const itemPopup=Object.freeze({state:items?.state??'closed',targeting:!!items?.targeting,
      weaponRemoval:removal?Object.freeze({...removal,enabled:!!itemReady&&removal.reason===null}):null,
      records:Object.freeze((items?.records??[]).map(r=>Object.freeze({slot:r.slot,revision:r.revision,
        name:name(r.nameBytes,'物品 '+r.slot),action:r.action,enabled:!!(itemReady&&r.enabled)})))});
    const targeting=ready&&(input.state===1&&input.gate&&(input.selected===0||input.selected===2&&playerPopup.targeting||
      input.selected===3&&itemPopup.targeting)||input.state===4&&input.petStage===3);
    const actorRows=battle.rows.map((r,slot)=>r??(commands.bodies.bodies[slot]?.nameBytes?{slot,nameBytes:commands.bodies.bodies[slot].nameBytes,values:commands.bodies.bodies[slot].vitals}:null));
    const actors=actorRows.filter(r=>r&&commands.bodies.bodies[r.slot]).map(r=>{const b=commands.bodies.bodies[r.slot];let name;try{name=decodeName(b.nameBytes??r.nameBytes);}catch{name='人物';}return Object.freeze({slot:r.slot,name,vitals:Object.freeze([...(b.vitals??r.values)]),local:r.slot===entry?.localSlot,present:!!b,eligible:!!(targeting&&r.slot<20&&(input.eligibleMask&(1<<r.slot)))});});
    cached=Object.freeze({state:closed?'closed':blocked?'waiting':busy?'rendering':running?'running':'stopped',generation:serial,presentations,steps,presentation:client.copyPresentation?.()??null,ready,paused:c.paused,queued,blocked,lastError,phase:entry?.phase,mainState:entry?.mainState,round:battle.roundCounter,selected:input?.selected,inputMode:input?.inputMode??'primary',petStage:input?.petStage,currentSkill:input?.currentSkill,petCount:input?.petCount,petIndex:input?.petIndex,skills:Object.freeze((input?.skills??[]).filter(s=>s.present).map(s=>{let name;try{name=decodeName(s.nameBytes);}catch{name='技能';}return Object.freeze({index:s.index,name,mpCost:s.mpCost,enabled:!!(ready&&input.state===4&&input.petStage===1&&s.enabled)});})),petPopup:Object.freeze({state:input?.petPopup?.state??'closed',recallEnabled:!!(ready&&input?.petPopup?.recallEnabled),records:Object.freeze((input?.petPopup?.records??[]).map(r=>{let name;try{name=decodeName(r.nameBytes);}catch{name='宠物';}return Object.freeze({slot:r.slot,name,mode:r.mode,values:r.values,enabled:!!(ready&&input.petPopup.state==='ready'&&r.enabled)});}))}),playerPopup,itemPopup,itemEnabled:!!(ready&&input.state===1&&!input.limitedSecondary),skillEnabled:ready&&!input.limitedSecondary,petEnabled:ready&&!input.limitedSecondary,positionEnabled:ready&&!input.limitedSecondary,countdown:entry?.phase===4?countdown:null,actors:Object.freeze(actors)});
  }
  function notify(){refresh();onState(inspect());}
  function arm(delay=16){if(!closed&&running&&!busy&&timer===null&&!blocked){const token=epoch;timer=schedule(()=>{timer=null;if(closed||!running||token!==epoch)return;pump().catch(()=>{});},Math.max(1,Math.min(50,delay)));}}
  function stop(){if(closed)return;running=false;epoch++;if(timer!==null)cancel(timer);timer=null;job?.cancel();}
  function flushIntent(){if(!pendingIntent)return;const {kind,value}=pendingIntent,entry=client.copyBattleEntry(),input=client.copyBattleInput();if(client.copyBattleState().generation!==serial||entry?.phase!==4||![1,4].includes(input?.state)||input.menu.state!==0){pendingIntent=null;queued=false;return;}
    try{if(kind==='target')client.chooseBattleTarget(value);else if(kind==='pet-skill')client.chooseBattlePetSkill(value);else if(kind==='pet-choice')client.chooseBattlePet(value);else if(kind==='player-skill')client.chooseBattlePlayerSkill(value);else if(kind==='player-level')client.chooseBattlePlayerSkillLevel(value);else if(kind==='item')client.chooseBattleItem(value.slot,value.revision);else client.chooseBattleCommand(value.name,value.revision);pendingIntent=null;}catch(e){if(code(e)==='LEGACY_CLIENT_BATTLE_RENDER_BUSY')return;if(['LEGACY_BATTLE_INPUT_NOT_READY','LEGACY_BATTLE_INPUT_TARGET','LEGACY_BATTLE_INPUT_DISABLED'].includes(code(e))){pendingIntent=null;queued=false;return;}throw e;}}
  async function pump(){if(closed||!running||busy||blocked)return null;const c=client.inspect();if(c.state!=='battle-pending'||c.paused)return null;busy=true;const token=epoch,start=clock();
    try{flushIntent();const consumedIntent=queued&&!pendingIntent;job=client.advanceBattleEntry();const out=await job.done;if(closed||token!==epoch||client.copyBattleState().generation!==serial)return null;
      if(client.canPresentBattleFrame&&!client.canPresentBattleFrame(job))return null;
      if(canvas.width!==out.width)canvas.width=out.width;if(canvas.height!==out.height)canvas.height=out.height;const image=context.createImageData(out.width,out.height);image.data.set(out.rgba);context.putImageData(image,0,0);onImage(image);client.presentBattleFrame?.(job);onFrame(out);presentations++;steps++;if(consumedIntent)queued=false;countdown=out.input?.countdown??null;
      if(out.callbacks?.commands.some(r=>r.kind==='command-unavailable'))blocked='action';lastError=null;return out;
    }catch(e){if(closed||token!==epoch)return null;const value=code(e);if(value==='LEGACY_CLIENT_BATTLE_RENDER_BUSY')return null;
      if(['LEGACY_BATTLE_RETURN_DEPENDENCY_UNAVAILABLE'].includes(value))blocked='resources';
      else if(['LEGACY_BATTLE_ENTRY_POPUP_UNAVAILABLE','LEGACY_BATTLE_ENTRY_STATE_UNAVAILABLE','LEGACY_BATTLE_INPUT_DEPENDENCY_UNAVAILABLE','LEGACY_BATTLE_EXIT_DEPENDENCY_UNAVAILABLE','LEGACY_BATTLE_RETURN_STATE_UNAVAILABLE'].includes(value))blocked='flow';
      else{lastError=value??'LEGACY_BATTLE_CANVAS_FRAME';stop();client.fail(e);}return null;
    }finally{job=null;busy=false;if(!closed){if(token===epoch){flushIntent();notify();arm(Math.max(1,16-((clock()-start)|0)));}else arm(1);}}
  }
  function intent(kind,value){if(closed)return false;refresh();if(!cached.ready||kind==='target'&&!cached.actors.some(a=>a.slot===value&&a.eligible))return false;
    pendingIntent={kind,value};queued=true;if(!busy)flushIntent();notify();arm(1);return true;
  }
  refresh();return Object.freeze({inspect,pump,generation:serial,start(){if(closed||running)return;running=true;epoch++;notify();arm(1);},pause(){stop();cached=Object.freeze({...inspect(),state:'stopped',ready:false,paused:true});},sync(){if(closed)return;if(!running&&!client.inspect().paused){running=true;epoch++;}if(blocked==='resources')blocked=null;notify();arm();},command:(name,revision)=>intent('command',{name,revision}),target:slot=>intent('target',slot),playerSkill:slot=>intent('player-skill',slot),playerSkillLevel:index=>intent('player-level',index),item:(slot,revision)=>intent('item',{slot,revision}),petSkill:index=>intent('pet-skill',index),pet:slot=>intent('pet-choice',slot),close(){if(closed)return;stop();closed=true;pendingIntent=null;cached=Object.freeze({...inspect(),state:'closed',ready:false,actors:Object.freeze([])});}});
}
