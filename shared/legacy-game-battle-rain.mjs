/** Fixed37c4 type-one weather from 465410 and the 5059f0 depth-20 draw. */
import {battleFail as fail} from './legacy-game-battle-bytes.mjs';

const windDeltas=[[1,1],[0,2],[-1,1],[-2,0],[-1,-1],[0,-2],[1,-1],[2,0]];
const calm=[0,0];
const maximumDrops=500;

export function createBattleRain(random){
  let mode=0, direction=-1, used=false, drops=[];
  function setDirection(value){
    if(!Number.isInteger(value)||value< -1||value>7)fail('LEGACY_BATTLE_WEATHER_DIRECTION');
    direction=value;
  }
  function step(){
    if(!mode&&!drops.length)return;
    // 465270 adds each new item to the head of the active list.
    if(mode===3){
      for(let i=0;i<4&&drops.length<maximumDrops;i++){
        drops.unshift({x:random.next()%840-200,y:-9,speedX:random.next()%2+2});
      }
    }
    const [windX,windY]=windDeltas[direction]??calm;
    for(const drop of drops){
      drop.x+=drop.speedX+windX;
      drop.y+=9+windY;
    }
    drops=drops.filter(drop=>drop.x<640&&drop.y<480);
  }
  const snapshotDrops=()=>Object.freeze(drops.map(drop=>Object.freeze({...drop})));
  return Object.freeze({
    setMode(value){
      if(value!==0&&value!==3)fail('LEGACY_BATTLE_WEATHER_MODE');
      mode=value;used=true;
    },
    step,
    finish(){
      // 437b30 steps the pool 160 times after clearing an active mode.
      if(mode!==0){mode=0;drops=[];}
    },
    advanceOrdinary(wind){
      if(!drops.length)return null;
      setDirection(wind);
      step();
      return snapshotDrops();
    },
    copyState(){return used?Object.freeze({mode,direction,drops:snapshotDrops()}):null;},
    reset(wind=direction){setDirection(wind);mode=0;used=false;drops=[];},
  });
}

export function legacyGameRainDraws(drops){
  return drops.filter(({x,y})=>x>=0&&x<636&&y>=0&&y<468)
    .map(({x,y})=>Object.freeze({rainDrop:true,x,y,priority:20}));
}
