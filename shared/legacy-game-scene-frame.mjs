/** Fixed37c4 ordinary map/actor scene. Source contract: analysis/game-legacy-scene-frame-v1. */
import { projectLegacyGamePosition } from './legacy-game-motion.mjs';
import { sortLegacyGameActorDepth,snapshotLegacyGameFrameRequest } from './legacy-game-frame.mjs';
import { legacyGameGraphicMetadataAt,legacyGameGraphicResourceIdAt,resolveLegacyGameMapGraphic } from './legacy-game-graphics.mjs';
import { createLegacyGameAnimationPlayer } from './legacy-game-animation.mjs';
import { composeLegacyGameFrame } from './legacy-game-render.mjs';
import { createLegacyGameDrawPlan } from './legacy-game-draw-plan.mjs';
import {snapshotLegacyGameTextBatch} from './legacy-game-text.mjs';
import {composeLegacyGameTextFrame} from './legacy-game-text-render.mjs';
import {createLegacyGameWater,isLegacyGameWaterOwner,isLegacyGameWaterCommand,markLegacyGameWaterGraphic} from './legacy-game-water.mjs';
export const LEGACY_GAME_SCENE_FRAME_PROFILE=Object.freeze({id:'legacy-se6000-37c4-ordinary-scene-frame-v1',
  sourceSha256:'37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd',cutRecords:50000,rectangleCells:2601,queueRecords:1024,mergedRecords:3072,mapObjectInstances:159201,drawCommands:4096});
export class LegacyGameSceneFrameError extends Error{constructor(code){super('Scene input or ownership is outside the supported native source profile.');this.name='LegacyGameSceneFrameError';this.code=code;}}
const fail=code=>{throw new LegacyGameSceneFrameError(code);},short=n=>(n<<16)>>16,cuts=new WeakMap();
function int(n,lo=-2147483648,hi=2147483647){if(!Number.isInteger(n)||n<lo||n>hi)fail('LEGACY_SCENE_FRAME_INTEGER');return n===0?0:n;}
function float(n){if(typeof n!=='number'||!Number.isFinite(n)||!Number.isFinite(Math.fround(n)))fail('LEGACY_SCENE_FRAME_FLOAT');n=Math.fround(n);if(n < -2147483648||n>2147483648)fail('LEGACY_SCENE_FRAME_POSITION');return n;}
function fields(value,names,optional=[]){let d;try{d=Object.getOwnPropertyDescriptors(value);}catch{fail('LEGACY_SCENE_FRAME_FIELDS');}
  if(Reflect.ownKeys(d).some(k=>![...names,...optional].includes(k))||names.some(k=>!Object.hasOwn(d[k]??{},'value'))||Object.values(d).some(p=>!Object.hasOwn(p,'value')))fail('LEGACY_SCENE_FRAME_FIELDS');return Object.fromEntries(Object.entries(d).map(([k,p])=>[k,p.value]));}
function array(value,max){if(!Array.isArray(value))fail('LEGACY_SCENE_FRAME_ARRAY');let d;try{d=Object.getOwnPropertyDescriptors(value);}catch{fail('LEGACY_SCENE_FRAME_ARRAY');}
 const n=int(d.length?.value,0,max);if(Reflect.ownKeys(d).length!==n+1)fail('LEGACY_SCENE_FRAME_ARRAY');return Array.from({length:n},(_,i)=>{if(!Object.hasOwn(d[i]??{},'value'))fail('LEGACY_SCENE_FRAME_ARRAY');return d[i].value;});}
function pair(value,read){const a=array(value,2);if(a.length!==2)fail('LEGACY_SCENE_FRAME_PAIR');return Object.freeze(a.map(read));}
const typed=Object.getPrototypeOf(Uint8Array.prototype),bufferOf=Object.getOwnPropertyDescriptor(typed,'buffer').get,lengthOf=Object.getOwnPropertyDescriptor(typed,'length').get,
 offsetOf=Object.getOwnPropertyDescriptor(typed,'byteOffset').get,bufferLength=Object.getOwnPropertyDescriptor(ArrayBuffer.prototype,'byteLength').get;
function input(value){try{let buffer,length,offset=0;if(value instanceof ArrayBuffer){buffer=value;length=Reflect.apply(bufferLength,buffer,[]);}else{
  if(!(value instanceof Uint8Array))fail('LEGACY_CUT_INPUT');buffer=Reflect.apply(bufferOf,value,[]);Reflect.apply(bufferLength,buffer,[]);length=Reflect.apply(lengthOf,value,[]);offset=Reflect.apply(offsetOf,value,[]);}
  if(length>12+50000*18)fail('LEGACY_CUT_BUDGET');return new Uint8Array(new Uint8Array(buffer,offset,length));}catch(e){if(e instanceof LegacyGameSceneFrameError)throw e;fail('LEGACY_CUT_INPUT');}}
function cutState(catalog){const s=cuts.get(catalog);if(!s)fail('LEGACY_CUT_CATALOG');if(s.closed)fail('LEGACY_CUT_CLOSED');return s;}
export function createLegacyGameCutCatalog(value){const bytes=input(value);try{if(bytes.length<12)fail('LEGACY_CUT_TRUNCATED');const view=new DataView(bytes.buffer);
 if(bytes[0]!==67||bytes[1]!==85||bytes[2]!==84||bytes[3]!==32||view.getUint16(4,true)!==12)fail('LEGACY_CUT_HEADER');
 const counts=[6,8,10].map(at=>view.getInt16(at,true));if(counts.some(n=>n<0))fail('LEGACY_CUT_COUNT');const count=counts.reduce((a,b)=>a+b,0);if(count>50000)fail('LEGACY_CUT_BUDGET');
 const consumed=12+count*18;if(bytes.length<consumed)fail('LEGACY_CUT_TRUNCATED');const s={closed:false,bytes,view,count,counts:Object.freeze(counts),consumed};
 const catalog=Object.freeze({entry(tile){const s=cutState(catalog);int(tile,1000,50999);const index=tile-1000;if(index>=s.count)return Object.freeze({tileId:tile,index,resourceId:0,kind:65535,clip:Object.freeze([0,0,0,0]),anchor:Object.freeze([0,0]),present:false});
   const at=12+index*18;return Object.freeze({tileId:tile,index,resourceId:s.view.getUint32(at,true),kind:s.view.getUint16(at+4,true),clip:Object.freeze([6,8,10,12].map(n=>s.view.getInt16(at+n,true))),anchor:Object.freeze([14,16].map(n=>s.view.getInt16(at+n,true))),present:true});},
  inspect(){const s=cutState(catalog);return Object.freeze({profile:LEGACY_GAME_SCENE_FRAME_PROFILE.id,records:s.count,counts:s.counts,consumedBytes:s.consumed,trailingBytes:s.bytes.length-s.consumed,fileRecordBytes:18,runtimeRecordBytes:20,capacity:50000});},
  close(){if(s.closed)return;s.closed=true;s.bytes.fill(0);s.bytes=null;s.view=null;}});cuts.set(catalog,s);return catalog;
 }catch(e){bytes.fill(0);throw e;}}

export function legacyGameSceneRectangle(width,height,center){int(width,1,32767);int(height,1,32767);const [x,y]=pair(center,n=>int(n,0,32736));if(x>=width||y>=height)fail('LEGACY_SCENE_FRAME_CENTER');
 const result=[Math.max(0,short(x-30)),Math.max(0,short(y-20)),Math.min(width,short(x+21)),Math.min(height,short(y+31))];
 if(result[2]<=result[0]||result[3]<=result[1]||(result[2]-result[0])*(result[3]-result[1])>2601)fail('LEGACY_SCENE_FRAME_WINDOW');return Object.freeze(result);}
export function legacyGameSceneTileOrder(width,height){int(width,1,2601);int(height,1,Math.floor(2601/width));const out=[];
 for(let d=1-height;d<width;d++){let x=Math.min(width-1,d+height-1),y=x-d;for(;x>=0&&y>=0;x--,y--)out.push(Object.freeze([x,y]));}return Object.freeze(out);}
function root(value){const r=fields(value,['graphicIndex','declaredResourceId','position','screenPosition','footprint','sortFlag','ordinal']);r.graphicIndex=int(r.graphicIndex,-1,849999);r.declaredResourceId=int(r.declaredResourceId,0,0xffffffff);
 r.position=pair(r.position,float);r.screenPosition=pair(r.screenPosition,n=>int(n,-32768,32767));r.footprint=pair(r.footprint,n=>int(n,0,255));r.sortFlag=int(r.sortFlag,0,1);r.ordinal=int(r.ordinal,0,1023);return r;}
function objectBefore(a,b){if(b.declaredResourceId===1||(b.footprint[0]===1&&b.footprint[1]===1))return b.position[0]-b.position[1]<a.position[0]-a.position[1];
 if(b.position[0]<a.position[0]&&a.position[1]<b.position[1])return true;
 if(b.screenPosition[0]<a.screenPosition[0])return a.screenPosition[1]<b.screenPosition[1]+24*(1-b.footprint[0]);
 if(b.screenPosition[0]>a.screenPosition[0])return a.screenPosition[1]<b.screenPosition[1]+24*(1-b.footprint[1]);return a.screenPosition[1]<b.screenPosition[1];}
export function compareLegacyGameSceneDepth(actorRoot,mapRoot){return objectBefore(root(actorRoot),root(mapRoot));}
export function mergeLegacyGameSceneRoots(actors,objects,tails){const groups=[actors,objects,tails].map(a=>{const seen=new Set();return array(a,1024).map(v=>{const r=root(v);if(seen.has(r.ordinal))fail('LEGACY_SCENE_FRAME_ORDINAL');seen.add(r.ordinal);return r;});});
 const [a,b,c]=groups,byOrdinal=new Map(a.map(x=>[x.ordinal,x])),sorted=sortLegacyGameActorDepth(a.map(({position,sortFlag,ordinal})=>({position,sortFlag,ordinal}))).map(i=>byOrdinal.get(i)),out=[];
 let i=0,j=0;const append=(queue,row)=>{if(queue!=='actor'||row.declaredResourceId!==1)out.push(Object.freeze({queue,ordinal:row.ordinal}));};
 while(i<sorted.length&&j<b.length){if(objectBefore(sorted[i],b[j]))append('object',b[j++]);else{let previous;do{previous=sorted[i++];append('actor',previous);}while(i<sorted.length&&previous.position[0]===sorted[i].position[0]&&previous.position[1]===sorted[i].position[1]);}}
 while(j<b.length)append('object',b[j++]);while(i<sorted.length)append('actor',sorted[i++]);for(const r of c)append('tail',r);return Object.freeze(out);}

/** Internal world composition. Catalogs and prepared sprites are borrowed. */
export function createLegacyGameSceneFrameController(value,waterOwner=undefined){const c=fields(value,['graphics','cut','animations','context','geometry'],['sprite','deferImages','rasterText']);if(Object.hasOwn(c,'deferImages')&&typeof c.deferImages!=='boolean')fail('LEGACY_SCENE_FRAME_BOOLEAN');c.deferImages??=false;if(Object.hasOwn(c,'rasterText')&&typeof c.rasterText!=='function')fail('LEGACY_SCENE_FRAME_PROVIDER');
 const ownsWater=waterOwner===undefined,water=ownsWater?createLegacyGameWater():waterOwner;if(!isLegacyGameWaterOwner(water))fail('LEGACY_SCENE_FRAME_WATER_OWNER');
 for(const key of ['context','geometry',...(!c.deferImages||Object.hasOwn(c,'sprite')?['sprite']:[])])if(typeof c[key]!=='function')fail('LEGACY_SCENE_FRAME_PROVIDER');legacyGameGraphicResourceIdAt(c.graphics,0);if(c.cut!==null)cutState(c.cut);const probe=createLegacyGameAnimationPlayer(c.animations);probe.close();
 let status='open',busy=false,frames=0,last=null,lastScene=null,pending=null;const instances=new Map(),active=()=>{if(status!=='open')fail('LEGACY_SCENE_FRAME_CLOSED');};
 const clear=()=>{for(const v of instances.values())v.player.close();instances.clear();lastScene=null;pending=null;};
 const waterCommand=(requested,scene,request,position,mode)=>{const mapId=requested?scene.identity?.[1]:0;if(mapId===undefined)fail('LEGACY_SCENE_FRAME_WATER_CONTEXT_REQUIRED');const strip=mode==='capture'?water.consume(requested,mapId,position,request.camera,request.center):water.present(requested,mapId,position,request.camera,request.center);return strip?Object.freeze({waterStrip:strip,priority:2}):null;};
 return Object.freeze({
  inspect(){return Object.freeze({profile:LEGACY_GAME_SCENE_FRAME_PROFILE.id,state:status,advancing:busy,frames,mapObjectInstances:instances.size,last,scope:'ordinary-map-object-actor-scene',nativeUIAndEffects:'incomplete'});},
  reset(){active();if(busy)fail('LEGACY_SCENE_FRAME_REENTRANT');clear();last=null;},
  copyWaterState(){active();return water.copyState();},
  preparePresentation(layer){active();if(busy)fail('LEGACY_SCENE_FRAME_REENTRANT');if(pending?.prepared===layer&&layer)return layer;if(!pending||pending.layer!==layer)fail('LEGACY_SCENE_FRAME_PRESENTATION_STALE');if(pending.prepared)return pending.prepared;
   busy=true;try{
   const command=waterCommand(pending.requested,pending.scene,pending.request,pending.position,pending.waterMode);if(!command){pending.prepared=layer;return layer;}
   const commands=[...pending.commands,command],plan=layer.drawPlan,output=plan?createLegacyGameDrawPlan(plan.width,plan.height,commands,plan.text,plan.palette):pending.text?composeLegacyGameTextFrame(layer.width,layer.height,commands,pending.text,c.rasterText):composeLegacyGameFrame(layer.width,layer.height,commands),submitted=Object.freeze([...layer.submitted,Object.freeze({queue:'effect',kind:'water-strip'})]);
   active();legacyGameGraphicResourceIdAt(c.graphics,0);last=Object.freeze({...last,submitted:submitted.length});
   pending.prepared=Object.freeze({...layer,...(plan?{drawPlan:output}:{rgba:output.rgba}),rasterOperations:output.rasterOperations,submitted,drawOrder:Object.freeze(output.drawOrder.map(i=>submitted[i])),waterEffect:command.waterStrip});return pending.prepared;
   }catch(error){if(status==='open')status='failed';clear();throw error;}finally{busy=false;}
  },
  step(value,scene,map,actorRoots,textValue=undefined,overlayValue=[],deferPresentation=false,waterPosition=undefined,waterMode='ordinary'){active();if(busy)fail('LEGACY_SCENE_FRAME_REENTRANT');if(typeof deferPresentation!=='boolean'||!['ordinary','capture'].includes(waterMode))fail('LEGACY_SCENE_FRAME_PRESENTATION_MODE');const request=snapshotLegacyGameFrameRequest(value),position=pair(waterPosition??request.camera,float),text=textValue===undefined?undefined:snapshotLegacyGameTextBatch(textValue),overlays=array(overlayValue,4096).map(row=>{const r=fields(row,['id','kind','command']);int(r.id);if(!['fill','background'].includes(r.kind))fail('LEGACY_SCENE_FRAME_OVERLAY');return r;});busy=true;
   const assert=()=>{active();legacyGameGraphicResourceIdAt(c.graphics,0);if(c.cut!==null)cutState(c.cut);};
   try{if(scene!==lastScene){clear();lastScene=scene;}const context=fields(c.context(request,scene),['tileCenter','drawPrimitives']);assert();if(typeof context.drawPrimitives!=='boolean')fail('LEGACY_SCENE_FRAME_BOOLEAN');
    if(waterMode==='ordinary')water.advance();pending=null;
    const metadata=map.inspect(),rectangle=legacyGameSceneRectangle(metadata.width,metadata.height,context.tileCenter),patch=map.readRectangle(rectangle),[left,top]=rectangle,
     tileOrder=legacyGameSceneTileOrder(patch.width,patch.height),base=projectLegacyGamePosition([0,0],request.camera,request.center).map(n=>Math.trunc(n));
    const queues={actor:[],object:[],tail:[]},commandsByKey=new Map(),sourcesByKey=new Map(),ground=[],events=[],created=[],updated=[],ignored=[];let droppedRoots=0,helperCalls=0;
    const row=(graphicIndex,position,screenPosition,sortFlag,ordinal)=>{const m=graphicIndex<0?null:legacyGameGraphicMetadataAt(c.graphics,graphicIndex);return{graphicIndex,declaredResourceId:graphicIndex<0?0xffffffff:legacyGameGraphicResourceIdAt(c.graphics,graphicIndex),position,screenPosition:screenPosition.map(short),footprint:m?[m.tileWidth,m.tileHeight]:[0,0],sortFlag,ordinal};};
    for(const a of actorRoots){queues.actor.push(row(a.graphicIndex,a.position,a.screenPosition,a.sortFlag,a.ordinal));commandsByKey.set('actor:'+a.ordinal,a.commands??a.command);sourcesByKey.set('actor:'+a.ordinal,Object.freeze({kind:'actor',id:a.id}));}
    if(queues.actor.length>1024)fail('LEGACY_SCENE_FRAME_ROOT_BUDGET');
    const add=(queue,r,command,source)=>{const list=queues[queue];if(list.length>=1024){droppedRoots++;return;}r.ordinal=list.length;list.push(r);commandsByKey.set(queue+':'+r.ordinal,command);sourcesByKey.set(queue+':'+r.ordinal,source);};
    const image=index=>{const m=c.graphics.imageAt(index);assert();return m;};
    const ordinary=(index,x,y,priority,style={paletteSelector:0,flags:0,color:0xffffffff})=>index<1000?null:()=>{
     if((style.paletteSelector!==0&&!c.deferImages)||(style.flags&~15)!==0)fail('LEGACY_SCENE_FRAME_DRAW_STYLE');const m=image(index),query=Object.freeze({index,...style}),handle=c.deferImages?{image:query}:{sprite:c.sprite(query,null),...(style.color!==0xffffffff?{color:style.color}:{}),...(style.flags&8?{blend:'additive'}:{})};assert();return markLegacyGameWaterGraphic(Object.freeze({...handle,x,y,originX:m.originX,originY:m.originY,priority,flip:style.flags&3}),index);};
    const clipped=(entry,index,x,y,priority)=>index<1000?null:()=>{const m=image(index),query=Object.freeze({index,paletteSelector:0,flags:0,color:0xffffffff}),handle=c.deferImages?{image:query}:{sprite:c.sprite(query,null)};assert();return markLegacyGameWaterGraphic(Object.freeze({...handle,x:short(x-entry.anchor[0]),y:short(y-entry.anchor[1]),priority,
      sourceRectangle:Object.freeze([short(entry.clip[0]-320-m.originX),short(entry.clip[1]-240-m.originY),entry.clip[2],entry.clip[3]])}),index);};
    const enqueueMap=(index,position,screen,command,source)=>{const r=row(index,position,screen,0,0);if(r.declaredResourceId===1)add('actor',r,command,source);else if(r.declaredResourceId>999)add(Math.floor(legacyGameGraphicMetadataAt(c.graphics,index).rawFlags/100)===3?'tail':'object',r,command,source);};
    const primitive=(id,position,screen,plane,source)=>{if(!context.drawPrimitives)return;if(id===1&&plane===1){const index=c.graphics.image(1).index;add('actor',row(index,position,screen,0,0),null,source);}else if(id>=200&&id<=299)fail('LEGACY_SCENE_FRAME_PRIMITIVE_UNMODELED');};
    for(const [x,y] of tileOrder){const cell=y*patch.width+x,world=[left+x,top+y],position=world.map(n=>Math.fround(n*64)),screen=[32*(world[0]+world[1])+base[0],24*(world[1]-world[0])+base[1]],source=Object.freeze({kind:'map',coordinates:Object.freeze(world)});
     if(scene.checksumMode===1){if(c.cut===null)fail('LEGACY_SCENE_FRAME_CUT_REQUIRED');const groundTile=patch.planes[0][cell],objectTile=patch.planes[1][cell];
      if(groundTile>999&&screen[0]>-65&&screen[0]<672&&screen[1]>-49&&screen[1]<504){const entry=c.cut.entry(groundTile),index=c.graphics.image(entry.resourceId).index,command=clipped(entry,index,...screen,5);if(command)ground.push({command,source});}
      if(objectTile>999){const entry=c.cut.entry(objectTile);
       if(entry.kind===0){const index=c.graphics.image(entry.resourceId).index,at=screen.map((n,i)=>short(n-entry.anchor[i])),command=clipped(entry,index,...screen,10);enqueueMap(index,position,at,command,source);}
       else if(entry.kind===1){if(world.some(n=>n<0||n>=399))fail('LEGACY_SCENE_FRAME_MAP_OBJECT_COORDINATE');const key=world[0]*399+world[1];let instance=instances.get(key);
        if(!instance){if(instances.size>=159201)fail('LEGACY_SCENE_FRAME_MAP_OBJECT_BUDGET');instance={resourceId:entry.resourceId,anchor:entry.anchor,player:createLegacyGameAnimationPlayer(c.animations)};instances.set(key,instance);created.push(Object.freeze([...world]));}
        else{const update=instance.player.step({resourceId:instance.resourceId,action:0,facing:0,speedPercent:100,mode:0,frozen:0,staticFlip:false,soundScene:request.runtime.soundScene,actorFlags:0x30},query=>{const result=c.geometry(query,source);assert();return result;});helperCalls++;updated.push(Object.freeze([...world]));
         if(update.event)events.push(Object.freeze({...update.event,mapCoordinates:Object.freeze([...world]),screenPosition:Object.freeze([...screen])}));const animation=instance.player.copyState(),index=animation.graphicIndex,at=screen.map((n,i)=>short(n+instance.anchor[i])),command=ordinary(index,...at,10,{paletteSelector:animation.paletteSelector,flags:animation.drawFlags,color:animation.color});add('object',row(index,position,at,0,0),command,source);}}
       else ignored.push(Object.freeze({coordinates:Object.freeze([...world]),cutKind:entry.kind}));}
     }else{
      const groundId=resolveLegacyGameMapGraphic(patch.planes[0][cell]),objectId=resolveLegacyGameMapGraphic(patch.planes[1][cell]);
      if(groundId<1000)primitive(groundId,position,screen,0,source);else if(screen[0]>-33&&screen[0]<672&&screen[1]>-25&&screen[1]<504){const index=c.graphics.image(groundId).index,command=ordinary(index,...screen,groundId>=5000&&groundId<=5009?1:5);if(command)ground.push({command,source});}
      if(objectId<1000)primitive(objectId,position,screen,1,source);else{const index=c.graphics.image(objectId).index,m=image(index),sx=short(m.originX+screen[0]),sy=short(m.originY+screen[1]),w=short(m.width),h=short(m.height);
       if(sx<640&&sx+w-1>=0&&sy<480&&sy+h-1>=0)enqueueMap(index,position,screen,ordinary(index,...screen,10),source);}
     }
    }
    const order=mergeLegacyGameSceneRoots(queues.actor,queues.object,queues.tail),commands=[],submitted=[];let droppedDraws=0;
    const submit=(command,source)=>{if(Array.isArray(command)){for(const c of command)submit(c,source);return;}if(!command)return;if(commands.length>=4096){droppedDraws++;return;}commands.push(typeof command==='function'?command():command);submitted.push(source);};
    for(const r of overlays)submit(r.command,Object.freeze({queue:'overlay',actorId:r.id,kind:r.kind}));for(const g of ground)submit(g.command,g.source);for(const r of order)submit(commandsByKey.get(r.queue+':'+r.ordinal),sourcesByKey.get(r.queue+':'+r.ordinal));assert();
    // Source5059f0 observes the marker before trimming for its3/4 helper records.
    const requested=commands.some(isLegacyGameWaterCommand),capacity=requested?4092:4093;
    if(commands.length>capacity){droppedDraws+=commands.length-capacity;commands.length=capacity;submitted.length=capacity;}
    const waterDraw=deferPresentation?null:waterCommand(requested,scene,request,position,waterMode);
    if(waterDraw){commands.push(waterDraw);submitted.push(Object.freeze({queue:'effect',kind:'water-strip'}));}
    const output=c.deferImages?createLegacyGameDrawPlan(request.width,request.height,commands,text):text?composeLegacyGameTextFrame(request.width,request.height,commands,text,c.rasterText):composeLegacyGameFrame(request.width,request.height,commands);assert();frames++;
    last=Object.freeze({rectangle,ground:ground.length,actorRoots:queues.actor.length,objects:queues.object.length,tails:queues.tail.length,merged:order.length,submitted:commands.length,helperCalls,droppedRoots,droppedDraws});
    const layer=Object.freeze({profile:LEGACY_GAME_SCENE_FRAME_PROFILE.id,scope:'ordinary-map-object-actor-scene',width:output.width,height:output.height,...(c.deferImages?{drawPlan:output}:{rgba:output.rgba}),...(requested?{waterRequested:true}:{}),...(waterDraw?{waterEffect:waterDraw.waterStrip}:{}),rectangle,queues:Object.freeze({actor:queues.actor.length,object:queues.object.length,tail:queues.tail.length}),mergeOrder:order,
      submitted:Object.freeze(submitted),drawOrder:Object.freeze(output.drawOrder.map(i=>submitted[i])),rasterOperations:output.rasterOperations,helperCalls,createdMapObjects:Object.freeze(created),updatedMapObjects:Object.freeze(updated),ignoredCutKinds:Object.freeze(ignored),events:Object.freeze(events),droppedRoots,droppedDraws,currentVersionCompatibility:'unverified',nativeUIAndEffects:'incomplete'});
    if(deferPresentation)pending={layer,requested,scene,request,position,waterMode,commands:Object.freeze([...commands]),text,prepared:null};return layer;
   }catch(error){if(status==='open')status='failed';clear();throw error;}finally{busy=false;}
  },
  close(){if(status==='closed')return;status='closed';clear();last=null;if(ownsWater)water.close();},
 });
}
