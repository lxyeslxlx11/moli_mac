/** Source-bound collision window, native directional route and missing-cache lookahead. */
import { readLegacyGameMapRectangle } from './legacy-game-map.mjs';
import { legacyGameFacingCode } from './legacy-game-motion.mjs';
import { resolveLegacyGameMapGraphic,legacyGameGraphicMetadata } from './legacy-game-graphics.mjs';
export const LEGACY_GAME_NAVIGATION_PROFILE=Object.freeze({id:'legacy-se6000-37c4-navigation-v1',
  sourceSha256:'37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd',windowCells:2601,pathCapacity:100,batchSteps:2,
  directions:Object.freeze([[0,-1],[1,-1],[1,0],[1,1],[0,1],[-1,1],[-1,0],[-1,-1]].map(Object.freeze)),nativeX87BitIdentity:'unverified'});
export class LegacyGameNavigationError extends Error{
  constructor(code){super('Navigation does not match the supported bounded legacy profile.');this.name='LegacyGameNavigationError';this.code=code;}
}
const fail=code=>{throw new LegacyGameNavigationError(code);},directions=LEGACY_GAME_NAVIGATION_PROFILE.directions,owned=new WeakMap();
function integer(value){if(!Number.isInteger(value)||value < -2147483648||value>2147483647)fail('LEGACY_NAVIGATION_INTEGER');return value|0;}
function short(value){integer(value);if(value < -32768||value>32767)fail('LEGACY_NAVIGATION_SHORT');return value|0;}
function shape(value,count){if(!Array.isArray(value))fail('LEGACY_NAVIGATION_ARGUMENTS');let d;try{d=Object.getOwnPropertyDescriptors(value);}catch{fail('LEGACY_NAVIGATION_ARGUMENTS');}
  if(d.length?.value!==count||Reflect.ownKeys(d).length!==count+1)fail('LEGACY_NAVIGATION_ARGUMENTS');return Array.from({length:count},(_,i)=>{if(!Object.hasOwn(d[i]??{},'value'))fail('LEGACY_NAVIGATION_ARGUMENTS');return d[i].value;});}
function pair(value){return shape(value,2).map(short);}
function size(width,height){integer(width);integer(height);if(width<1||height<1||width>32767||height>32767)fail('LEGACY_NAVIGATION_DIMENSIONS');}
function rectangle(value){const rect=shape(value,4).map(short),[x,y,right,bottom]=rect,w=right-x,h=bottom-y;
  if(w<1||h<1||w>2601||h>Math.floor(2601/w))fail('LEGACY_NAVIGATION_WINDOW');return {rect,w,h};}
export function legacyGameCollisionWindow(width,height,center){size(width,height);const [x,y]=pair(center);
  // Reject signed-short intermediate overflow instead of reproducing native wrapped rectangle hazards.
  const rect=[Math.max(0,short(x-30)),Math.max(0,short(y-20)),Math.min(width,short(x+21)),Math.min(height,short(y+31))];rectangle(rect);return Object.freeze(rect);}
const typed=Object.getPrototypeOf(Uint16Array.prototype),bufferOf=Object.getOwnPropertyDescriptor(typed,'buffer').get,
  lengthOf=Object.getOwnPropertyDescriptor(typed,'length').get,offsetOf=Object.getOwnPropertyDescriptor(typed,'byteOffset').get,
  bufferLength=Object.getOwnPropertyDescriptor(ArrayBuffer.prototype,'byteLength').get;
function plane(value,count){try{if(!(value instanceof Uint16Array))fail('LEGACY_NAVIGATION_PLANE');const buffer=Reflect.apply(bufferOf,value,[]);Reflect.apply(bufferLength,buffer,[]);
  const length=Reflect.apply(lengthOf,value,[]),offset=Reflect.apply(offsetOf,value,[]);if(length!==count)fail('LEGACY_NAVIGATION_PLANE');return new Uint16Array(new Uint16Array(buffer,offset,length));
}catch(error){if(error instanceof LegacyGameNavigationError)throw error;fail('LEGACY_NAVIGATION_PLANE');}}
function grid(value){const s=owned.get(value);if(!s)fail('LEGACY_NAVIGATION_GRID');if(s.closed)fail('LEGACY_NAVIGATION_CLOSED');return s;}
export function legacyGameNavigationInfo(value){const s=grid(value);return Object.freeze({profile:LEGACY_GAME_NAVIGATION_PROFILE.id,mapWidth:s.width,mapHeight:s.height,
  rectangle:Object.freeze([...s.rect]),width:s.w,height:s.h,mode:s.mode,cells:s.cells.length});}
function blocked(s,x,y){x-=s.rect[0];y-=s.rect[1];return x<0||y<0||x>=s.w||y>=s.h||s.cells[y*s.w+x]===1;}
export function createLegacyGameCollisionGridFromRectangle(width,height,coordinates,planes,mode,graphics=null){
  size(width,height);integer(mode);const {rect,w,h}=rectangle(coordinates);
  if(rect[0]<0||rect[1]<0||rect[2]>width||rect[3]>height)fail('LEGACY_NAVIGATION_WINDOW');
  const raw=[],cells=new Uint8Array(w*h);
  try{
    for(const p of shape(planes,3))raw.push(plane(p,w*h));
    const [ground,objects,flags]=raw;
    if(mode===1){for(let i=0;i<cells.length;i++)cells[i]=(flags[i]&256)?1:0;}
    else{
      const metadata=resource=>{if(graphics===null)fail('LEGACY_NAVIGATION_GRAPHICS_REQUIRED');return legacyGameGraphicMetadata(graphics,resource);};
      const basic=(i,id,zeroGround=false)=>{
        if(id>=1000||(id>=60&&id<=79)){const c=metadata(id).collisionClass;if(c===0){if(cells[i]!==2)cells[i]=1;}else if(c===2)cells[i]=2;}
        else if(id===4)cells[i]=2;else if([2,5,6,9,10].includes(id)||(zeroGround&&id===0&&(flags[i]&16384))){if(cells[i]!==2)cells[i]=1;}
      };
      for(let i=0;i<cells.length;i++)basic(i,resolveLegacyGameMapGraphic(ground[i]),true);
      for(let y=0;y<h;y++)for(let x=0;x<w;x++){
        const i=y*w+x,id=resolveLegacyGameMapGraphic(objects[i]);
        if(id<1000)basic(i,id);
        else{const m=metadata(id);if(m.collisionClass===0||m.collisionClass===2){
          for(let dy=0;dy<m.tileHeight&&y-dy>=0;dy++)for(let dx=0;dx<m.tileWidth&&x+dx<w;dx++){
            const at=(y-dy)*w+x+dx;if(m.collisionClass===2)cells[at]=2;else if(cells[at]!==2)cells[at]=1;
          }
        }}
        if(objects[i]===0&&ground[i]===0&&cells[i]===0)cells[i]=1;
        if((flags[i]&255)===1)cells[i]=1;
      }
    }
    const s={closed:false,width,height,rect,w,h,mode,cells,flags:raw[2]};raw[0].fill(0);raw[1].fill(0);
    const result=Object.freeze({inspect(){return legacyGameNavigationInfo(result);},
      isBlocked(x,y){integer(x);integer(y);return blocked(grid(result),x,y);},
      cellValue(x,y){const n=grid(result);integer(x);integer(y);x-=n.rect[0];y-=n.rect[1];return x<0||y<0||x>=n.w||y>=n.h?1:n.cells[y*n.w+x];},
      copyCells(){return grid(result).cells.slice();},
      close(){if(s.closed)return;s.closed=true;s.cells.fill(0);s.flags.fill(0);s.cells=null;s.flags=null;}});owned.set(result,s);return result;
  }catch(error){for(const p of raw)p.fill(0);cells.fill(0);throw error;}
}
export function createLegacyGameCollisionGrid(bytes,width,height,center,mode,graphics=null){
  let view;
  try{if(bytes instanceof ArrayBuffer){Reflect.apply(bufferLength,bytes,[]);view=new DataView(bytes);}
    else{if(!(bytes instanceof Uint8Array))fail('LEGACY_NAVIGATION_INPUT');const buffer=Reflect.apply(bufferOf,bytes,[]);Reflect.apply(bufferLength,buffer,[]);
      const offset=Reflect.apply(offsetOf,bytes,[]),length=Reflect.apply(lengthOf,bytes,[]);view=new DataView(buffer,offset,length);}
    if(view.byteLength<20)fail('LEGACY_NAVIGATION_INPUT');
  }catch(error){if(error instanceof LegacyGameNavigationError)throw error;fail('LEGACY_NAVIGATION_INPUT');}
  if(view.getInt32(12,true)!==width||view.getInt32(16,true)!==height)fail('LEGACY_NAVIGATION_MAP_DIMENSIONS');
  const rect=legacyGameCollisionWindow(width,height,center),selected=readLegacyGameMapRectangle(bytes,rect);
  try{return createLegacyGameCollisionGridFromRectangle(width,height,rect,selected.planes,mode,graphics);}finally{for(const p of selected.planes)p.fill(0);}
}
export function classifyLegacyGameTileEventContext(value){integer(value);return (value>=0&&value<=3)||(value>=19&&value<=23)?2:value<7?3:value>15?1:0;}
export function legacyGameTileFlag(value,point){const n=grid(value),[x,y]=pair(point),at=(y-n.rect[1])*n.w+x-n.rect[0];
  if(x<n.rect[0]||y<n.rect[1]||x>=n.rect[2]||y>=n.rect[3])fail('LEGACY_NAVIGATION_EVENT_BOUNDS');return n.flags[at]&255;}
export function findLegacyGameMissingMapRectangles(value,origin,direction){
  const s=grid(value),[x,y]=pair(origin);integer(direction);if(direction<0||direction>7)fail('LEGACY_NAVIGATION_DIRECTION');
  if(s.w<51||s.h<51)return Object.freeze([]);const rectangles=[],inside=(a,b)=>a>=0&&b>=0&&a<s.width&&b<s.height;
  const emit=rect=>{rect[0]=Math.max(0,rect[0]);rect[1]=Math.max(0,rect[1]);rect[2]=Math.min(s.width,rect[2]);rect[3]=Math.min(s.height,rect[3]);rectangles.push(Object.freeze(rect));};
  const scan=(kind)=>{for(let i=0;i<23;i++){
    const horizontal=kind==='top'||kind==='bottom',a=horizontal?x-11+i:(kind==='left'?x-11:x+11),b=horizontal?(kind==='top'?y-11:y+11):y-11+i;
    if(!inside(a,b))continue;const cx=horizontal?19+i:(kind==='left'?19:41),cy=horizontal?(kind==='top'?9:31):9+i;
    if(s.flags[cy*s.w+cx]!==0)continue;
    if(kind==='left')emit([a-1,b-1,a+1,b-i+23]);
    else if(kind==='right')emit([a,b-1,a+2,b-i+23]);
    else if(kind==='top')emit([a-1,b-1,a-i+23,b+1]);
    else emit([a-1,b,a-i+23,b+2]);return;
  }};
  if([5,6,7].includes(direction))scan('left');if([7,0,1].includes(direction))scan('top');
  if(rectangles.length<2&&[1,2,3].includes(direction))scan('right');if(rectangles.length<2&&[3,4,5].includes(direction))scan('bottom');return Object.freeze(rectangles);
}
export function planLegacyGamePath(value,origin,destination){
  const s=grid(value),start=pair(origin),goal=pair(destination);let [x,y]=start,previous=[0,0],route=[],finalFacing=-1,work=0;
  const finish=(reason,preserve=false)=>Object.freeze({kind:'legacy-path',origin:Object.freeze([...start]),destination:Object.freeze([...goal]),
    steps:Object.freeze(route.map(p=>Object.freeze({direction:p.direction,coordinates:Object.freeze([...p.coordinates])}))),finalFacing,reached:x===goal[0]&&y===goal[1],preservePreviousRoute:preserve,reason});
  if(x===goal[0]&&y===goal[1])return finish('same-point',true);const initial=legacyGameFacingCode(goal[0]-x,goal[1]-y),near=n=>[initial,(initial+1)&7,(initial-1)&7].includes(n);
  const emit=(dx,dy,direction,resetPrevious=false)=>{
    const sx=previous[0]+dx,sy=previous[1]+dy;
    let merged=false;
    if((previous[0]!==0||previous[1]!==0)&&(dx!==0||dy!==0)&&Math.abs(sx)===1&&Math.abs(sy)===1){
      const index=directions.findIndex(d=>d[0]===sx&&d[1]===sy),a=(index+1)&7,b=(index-1)&7,da=directions[a],db=directions[b];
      if(!blocked(s,x+da[0]-previous[0],y+da[1]-previous[1])&&!blocked(s,x+db[0]-previous[0],y+db[1]-previous[1])){
        if(!route.length)fail('LEGACY_NAVIGATION_PATH_MERGE');route[route.length-1]={direction:index,coordinates:[x+dx,y+dy]};merged=true;
      }
    }
    if(!merged){if(route.length>=100)fail('LEGACY_NAVIGATION_PATH_OVERFLOW');route.push({direction,coordinates:[x+dx,y+dy]});previous=resetPrevious?[0,0]:[dx,dy];}
    else previous=[previous[0]+dx,previous[1]+dy];x+=dx;y+=dy;
  };
  let fallback=false;
  while(x!==goal[0]||y!==goal[1]){
    if(++work>2048)fail('LEGACY_NAVIGATION_WORK_BUDGET');if(route.length>=100){route=[];return finish('source-capacity-reset');}
    const desired=legacyGameFacingCode(goal[0]-x,goal[1]-y);let direction=null;
    if(near(desired))for(const offset of [0,1,-1]){
      const candidate=(desired+offset)&7;if(!near(candidate))continue;const [dx,dy]=directions[candidate];
      if(!blocked(s,x+dx,y+dy)){direction=candidate;break;}
      if(x+dx===goal[0]&&y+dy===goal[1]&&(candidate&1)===0)break;
    }
    if(direction===null){fallback=true;break;}
    let [dx,dy]=directions[direction];
    if(direction&1){
      const a=(direction+1)&7,b=(direction-1)&7,da=directions[a],db=directions[b],ba=blocked(s,x+da[0],y+da[1]),bb=blocked(s,x+db[0],y+db[1]);
      if(ba&&bb){fallback=true;break;}
      if(ba||bb){const selected=ba?db:da,selectedDirection=ba?b:a;emit(selected[0],selected[1],selectedDirection,true);dx-=selected[0];dy-=selected[1];direction=legacyGameFacingCode(dx,dy);}
    }
    emit(dx,dy,direction);
  }
  // Native fallback appends axes directly, without the merge helper or an array-capacity guard.
  if(fallback){for(const axis of [0,1]){
    const current=()=>axis===0?x:y,delta=Math.sign(goal[axis]-current());
    while(current()!==goal[axis]&&!blocked(s,x+(axis===0?delta:0),y+(axis===1?delta:0))){
      if(route.length>=100)fail('LEGACY_NAVIGATION_PATH_OVERFLOW');const dx=axis===0?delta:0,dy=axis===1?delta:0;x+=dx;y+=dy;route.push({direction:legacyGameFacingCode(dx,dy),coordinates:[x,y]});
    }
  }}
  if(route.length&&(x!==goal[0]||y!==goal[1]))finalFacing=legacyGameFacingCode(goal[0]-x,goal[1]-y);return finish(fallback?'axis-fallback':'directional-route');
}
