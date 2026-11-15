/** Fixed37c4 pool-depth and basic indexed battle scene, bound to owned playback snapshots. */
import {battleFail as fail} from './legacy-game-battle-bytes.mjs';
import {legacyGameGraphicResourceIdAt} from './legacy-game-graphics.mjs';
import {createLegacyGameDrawPlan} from './legacy-game-draw-plan.mjs';
import {legacyGameRainDraws} from './legacy-game-battle-rain.mjs';
import {createLegacyGameBattlePalette} from './legacy-game-battle-palette.mjs';
import {legacyGameGMNOpeningBorder,legacyGameGMNWindowTiles} from './legacy-game-battle-window.mjs';
import {createLegacyGameTextBatch} from './legacy-game-text.mjs';
import {legacyGameBattleDrawStyle} from './legacy-game-battle-draw-style.mjs';
import {isLegacyGameWaterCommand} from './legacy-game-water.mjs';

export const LEGACY_GAME_BATTLE_FRAME_PROFILE=Object.freeze({id:'legacy-se6000-37c4-battle-basic-frame-v1',
  sourceSha256:'37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd',
  objects:4096,objectDraws:4093,sortStack:30,scope:'basic-owned-body-and-child-indexed-scene',
  fullBattleRenderer:'unimplemented',nativeMain10:'unimplemented',scaledBackendSampling:'portable-nearest-policy-original-backend-unverified'});
function int(n,lo=-2147483648,hi=2147483647){if(!Number.isInteger(n)||n<lo||n>hi)fail('LEGACY_BATTLE_FRAME_INTEGER');return n===0?0:n;}
function fields(value,required,optional=[]){let d;try{d=Object.getOwnPropertyDescriptors(value);}catch{fail('LEGACY_BATTLE_FRAME_FIELDS');}
  const keys=Reflect.ownKeys(d);
  if(keys.some(k=>!required.includes(k)&&!optional.includes(k)||!Object.hasOwn(d[k],'value'))||
    required.some(k=>!Object.hasOwn(d,k)))fail('LEGACY_BATTLE_FRAME_FIELDS');
  return Object.fromEntries(keys.map(k=>[k,d[k].value]));}
function list(value,max){if(!Array.isArray(value))fail('LEGACY_BATTLE_FRAME_LIST');const d=Object.getOwnPropertyDescriptors(value),n=int(d.length?.value,0,max);
  if(Reflect.ownKeys(d).length!==n+1)fail('LEGACY_BATTLE_FRAME_LIST');return Array.from({length:n},(_,i)=>{if(!Object.hasOwn(d[i]??{},'value'))fail('LEGACY_BATTLE_FRAME_LIST');return d[i].value;});}
// 4198d0 returns+1 for equal keys. Native51c1a2/51c2f6 must therefore retain their tie permutations.
function compare(a,b){const ay=a.flags&0x800000?a.alternateY:a.y,by=b.flags&0x800000?b.alternateY:b.y;
  return ay<by?-1:ay>by?1:a.depthKey<b.depthKey?-1:1;}
function sort(rows){if(rows.length<2)return rows;let lo=0,hi=rows.length-1;const pending=[];
  const swap=(a,b)=>{if(a!==b)[rows[a],rows[b]]=[rows[b],rows[a]];},push=(a,b)=>{if(pending.length>=30)fail('LEGACY_BATTLE_FRAME_SORT_STACK');pending.push([a,b]);};
  for(;;){const count=hi-lo+1;
    if(count>8){swap(lo+(count>>1),lo);let left=lo,right=hi+1;
      for(;;){do{left++;}while(left<=hi&&compare(rows[left],rows[lo])<=0);do{right--;}while(right>lo&&compare(rows[right],rows[lo])>=0);if(left>right)break;swap(left,right);}
      swap(lo,right);
      if((right-lo)*4-1<(hi-left)*4){if(left<hi)push(left,hi);if(lo+1<right){hi=right-1;continue;}}
      else{if(lo+1<right)push(lo,right-1);if(left<hi){lo=left;continue;}}
    }else for(let end=hi;lo<end;end--){let maximum=lo;for(let i=lo+1;i<=end;i++)if(compare(rows[i],rows[maximum])>0)maximum=i;swap(maximum,end);}
    if(!pending.length)return rows;[lo,hi]=pending.pop();
  }
}
export function sortLegacyGameBattleDepth(value){const seen=new Set(),rows=list(value,4096).map(value=>{const r=fields(value,['id','y','alternateY','flags','depthKey']);
  int(r.id,1,Number.MAX_SAFE_INTEGER);int(r.y);int(r.alternateY);int(r.flags,0,0xffffffff);int(r.depthKey,-32768,32767);
  if(seen.has(r.id))fail('LEGACY_BATTLE_FRAME_NODE_ID');seen.add(r.id);return r;});return Object.freeze(sort(rows).map(r=>r.id));}

/** The owning battle state supplies its own nodes; this function never advances their callbacks. */
export function createLegacyGameBattleFrameController(value){
  const c=fields(value,['graphics'],['paletteSources','noticeText']);
  legacyGameGraphicResourceIdAt(c.graphics,0);
  if(c.noticeText!==undefined&&typeof c.noticeText!=='boolean')fail('LEGACY_BATTLE_FRAME_FIELDS');
  const palette=c.paletteSources===undefined?null:createLegacyGameBattlePalette(c.paletteSources);
  let status='open',busy=false,frames=0,last=null;
  const active=()=>{if(status!=='open')fail('LEGACY_BATTLE_FRAME_CLOSED');legacyGameGraphicResourceIdAt(c.graphics,0);};
  return Object.freeze({
    inspect(){return Object.freeze({profile:LEGACY_GAME_BATTLE_FRAME_PROFILE.id,status,busy,frames,last,completeBattleRenderer:false,nativeMain10:false});},
    resetPalette(){active();if(busy)fail('LEGACY_BATTLE_FRAME_REENTRANT');palette?.reset();},
    backgroundPlan(background){active();int(background);if(background< -1)fail('LEGACY_BATTLE_FRAME_BACKGROUND');const commands=[];
      if(background>=1000){const g=c.graphics.image(background);if(!g.present||g.index<1000)fail('LEGACY_BATTLE_FRAME_BACKGROUND');
        commands.push({image:{index:g.index,paletteSelector:0,flags:0,color:0xffffffff},x:(320+g.originX)|0,y:(240+g.originY)|0,
          priority:200,flip:0,expectedDimensions:[g.width,g.height]});}
      return createLegacyGameDrawPlan(640,480,commands);
    },
    step(value,playback,background,bufferSelector=0){active();if(busy)fail('LEGACY_BATTLE_FRAME_REENTRANT');const r=fields(value,['width','height']);int(bufferSelector,0,1);
      int(r.width,1,4194304);int(r.height,1,Math.floor(4194304/r.width));int(background);
      if(!playback||playback.status!=='open'||typeof playback.alternativeRenderer!=='boolean')fail('LEGACY_BATTLE_FRAME_PLAYBACK');
      busy=true;
      try{const nodes=playback.nodes,depth=sortLegacyGameBattleDepth(nodes.filter(n=>n.actorFlags&0x20000).map(n=>({id:n.id,y:n.screen[1],alternateY:n.alternateY,flags:n.actorFlags,depthKey:n.depthKey}))),
        priorities=new Map(depth.map((id,i)=>[id,(i+9)&255])),commands=[],submitted=[],skipped=[];
        const command=(index,x,y,priority,flags,color,paletteSelector,geometry,scale=null)=>{
          if(index<1000)fail('LEGACY_BATTLE_FRAME_RESERVED_GRAPHIC');
          if((flags&~15)!==0)fail('LEGACY_BATTLE_FRAME_DRAW_STYLE');
          const image=Object.freeze({index,paletteSelector,flags,color});return Object.freeze({image,x,y,priority,flip:flags&3,expectedDimensions:Object.freeze([geometry.width,geometry.height]),...(scale&&(scale[0]!==1||scale[1]!==1)?{scale:Object.freeze([...scale])}:{})});
        };
        // 44fb60 calls423340 before506030 queued sprites, including direct priority3 submissions.
        background=playback.backgroundResource??background;
        int(background);
        let backgroundCommand=null;
        if(background< -1)fail('LEGACY_BATTLE_FRAME_BACKGROUND');
        if(background>=1000){const g=c.graphics.image(background);if(!g.present)fail('LEGACY_BATTLE_FRAME_BACKGROUND');
          const offset=playback.backgroundState?.offset??[0,0];backgroundCommand=command(g.index,(320+g.originX+offset[0])|0,(240+g.originY+offset[1])|0,0,0,0xffffffff,0,g);}
        let dropped=0;
        for(const draw of playback.directSubmissions??playback.casting?.submissions??[]){if(commands.length>=4096){dropped++;continue;}const g=c.graphics.image(draw.resourceId);if(!g.present)fail('LEGACY_BATTLE_FRAME_EFFECT_GRAPHIC');
          commands.push(command(g.index,(draw.x+g.originX)|0,(draw.y+g.originY)|0,draw.priority,0,0xffffffff,0,g));submitted.push(Object.freeze({id:null,kind:'casting-overlay',slot:null,priority:draw.priority}));}
        for(const node of nodes){const flags=node.actorFlags,a=node.animation;let reason=null;
          if(flags&0x8000&&bufferSelector===0||flags&0x10000&&bufferSelector===1)reason='renderer-filter';
          else if(a.graphicIndex===-1)reason='graphic-missing';
          else if(a.graphicIndex===0)reason='graphic-empty';
          else if(node.deleted)reason='deleted';else if(flags&2)reason='hidden';
          if(reason){skipped.push(Object.freeze({id:node.id,reason}));continue;}
          if(commands.length>=4096){dropped++;continue;}
          if(!a.geometry)fail('LEGACY_BATTLE_FRAME_GEOMETRY');
          const style=legacyGameBattleDrawStyle({drawFlags:a.drawFlags,color:a.color,paletteSelector:a.paletteSelector,actorFlags:flags,drawFlagMask:node.drawFlagMask,drawFlagValue:node.drawFlagValue,...(node.drawColorOverride?{drawColorOverride:node.drawColorOverride}:{})}),
            x=(node.screen[0]+Math.trunc(a.drawOffsetX*node.scale[0]))|0,y=(node.screen[1]+Math.trunc(a.drawOffsetY*node.scale[1]))|0,
            priority=priorities.get(node.id)??node.drawPriority;
          commands.push(command(a.graphicIndex,x,y,priority,style.flags,style.color,style.paletteSelector,a.geometry,node.scale));submitted.push(Object.freeze({id:node.id,kind:node.kind,slot:node.slot,priority}));
        }
        const notice=playback.gmnWindowSubmissions;
        const missingWindowResources=new Set();
        const submitWindow=value=>{
          if(commands.length>=4096){dropped++;return;}
          commands.push(value);
          submitted.push(Object.freeze({id:null,kind:'gmn-window',slot:null,priority:212}));
        };
        for(const window of notice?.windows??[]){
          if(window.kind==='opening'){
            for(const fill of legacyGameGMNOpeningBorder(window,r.width,r.height))submitWindow(fill);
          }else{
            for(const tile of legacyGameGMNWindowTiles(window,playback.alternativeRenderer)){
              const graphic=c.graphics.image(tile.resourceId);
              if(!graphic.present||graphic.index<1000){
                missingWindowResources.add(tile.resourceId);
                continue;
              }
              const [x,y,w,h]=tile.sourceRectangle;
              submitWindow({...command(graphic.index,tile.x,tile.y,212,4,0xffffffff,0,graphic),
                sourceRectangle:[x-graphic.originX,y-graphic.originY,w,h],
                ...(tile.opacity<255?{opacity:tile.opacity}:{})});
            }
          }
        }
        if(playback.weather?.drops.length){
          for(const drop of legacyGameRainDraws(playback.weather.drops)){
            if(commands.length>=4096){dropped++;continue;}
            commands.push(drop);
            submitted.push(Object.freeze({id:null,kind:'battle-rain',slot:null,priority:20}));
          }
        }
        const waterRequested=commands.some(isLegacyGameWaterCommand),capacity=waterRequested?4092:4093;
        if(commands.length>capacity){dropped+=commands.length-capacity;commands.length=capacity;submitted.length=capacity;}
        // 423340 copies the cached background surface; its graphic did not get
        // queued again here and cannot itself set the special-graphic marker.
        // Priority0 precedes queue priority0 ties by being appended last.
        if(backgroundCommand){commands.push(backgroundCommand);submitted.push(Object.freeze({id:null,kind:'background',slot:null,priority:0}));}
        const text=c.noticeText&&notice?.text.length?createLegacyGameTextBatch(notice.text,216):undefined;
        const paletteFrame=palette?.pass(playback.gmnPaletteRequest);
        const {projection,...paletteState}=paletteFrame??{};
        const drawPlan=createLegacyGameDrawPlan(r.width,r.height,commands,text,projection??undefined);active();frames++;
        last=Object.freeze({nodes:nodes.length,depthSorted:depth.length,submitted:commands.length,skipped:skipped.length,dropped});
        return Object.freeze({profile:LEGACY_GAME_BATTLE_FRAME_PROFILE.id,scope:LEGACY_GAME_BATTLE_FRAME_PROFILE.scope,width:r.width,height:r.height,bufferSelector,
          drawPlan,depthOrder:depth,depthPriorities:Object.freeze(depth.map(id=>Object.freeze({id,priority:priorities.get(id)}))),submitted:Object.freeze(submitted),skipped:Object.freeze(skipped),
          ...(waterRequested?{waterRequested:true}:{}),...(paletteFrame?{gmnPalette:Object.freeze(paletteState)}:{}),
          ...(notice?{gmnWindow:Object.freeze({windows:notice.windows.length,textRuns:text?.runs.length??0,
            missingResources:Object.freeze([...missingWindowResources])})}:{}),
          drawOrder:Object.freeze(drawPlan.drawOrder.map(i=>submitted[i])),dropped,callbackPasses:playback.passes,renderer:'partial',nativeMain10Driver:'unimplemented',completeBattleGameplay:false});
      }catch(error){if(status!=='closed')status='failed';throw error;}finally{busy=false;}
    },
    close(){if(status==='closed')return;status='closed';last=null;palette?.close();},
  });
}
