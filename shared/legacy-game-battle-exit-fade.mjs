/** Source505030(12/14,8,float2) ->5029f0/6/7; captured rows use44ce40. */
import {battleFail as fail}from'./legacy-game-battle-bytes.mjs';
import {assetFields,assetBytes,assetInteger,assetList}from'./legacy-game-resource-values.mjs';
import {composeLegacyGameBattleEntryFade}from'./legacy-game-battle-entry-fade.mjs';
export const LEGACY_GAME_BATTLE_EXIT_FADE_PROFILE=Object.freeze({id:'legacy-se6000-37c4-battle-exit-fade-v1',
 sourceSha256:'37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd',width:640,height:480,types:Object.freeze([12,14]),stride:8,acceleration:2,scope:'source-exit-captured-rows',completeNativeExit:false});
const typeOf=n=>{if(n!==12&&n!==14)fail('LEGACY_BATTLE_EXIT_FADE_TYPE');return n;};
export function createLegacyGameBattleExitFade(type){typeOf(type);const velocities=new Float32Array(480),positions=new Float32Array(480);if(type===14)for(let i=0;i<480;i++)positions[i]=i;
 let closed=false,complete=false,calls=0,counter=0;const active=()=>{if(closed)fail('LEGACY_BATTLE_EXIT_FADE_CLOSED');};
 return Object.freeze({
  step(){active();if(complete)fail('LEGACY_BATTLE_EXIT_FADE_COMPLETE');
   for(let row=0;row<counter;row++){
    if(type===12){const other=((row&1)?480:478)-row,delta=(row&1)?2:-2;
     // counter241 aliases row238 through row240; native write order matters.
     for(const i of [row,other]){velocities[i]+=delta;positions[i]+=velocities[i];}
    }else{velocities[row]-=2;positions[row]+=velocities[row];const other=480-row;
     // The source also updates padding cell480 at row0. Neither its position nor
     // its velocity feeds any copied row or the row241 completion predicate.
     if(row<240&&other<480){velocities[other]+=2;positions[other]+=velocities[other];}}
   }
   counter=Math.min(241,counter+8);calls++;complete=positions[241]<-640||positions[241]>640;
   return Object.freeze({profile:LEGACY_GAME_BATTLE_EXIT_FADE_PROFILE.id,type,calls,counter,complete,rowPositions:Object.freeze(Array.from(positions,Math.trunc)),completion:'source-row241-outside-range'});
  },
  copyState(){active();return Object.freeze({type,calls,counter,complete,velocities:velocities.slice(),positions:positions.slice()});},
  close(){if(closed)return;closed=true;velocities.fill(0);positions.fill(0);},
 });
}

/** Fixed 503330 case7, called by 505030(15,8,2.0). */
export function createLegacyGameCityEntryFade() {
 const positions = Float32Array.from({ length: 480 }, (_, row) => row);
 const velocities = new Float32Array(480);
 let closed = false, calls = 0, counter = 0;
 do {
  for (let row = 0; row < Math.min(counter, 241); row++) {
   velocities[row] -= 2;
   positions[row] += velocities[row];
   if (row > 0 && row < 240) {
    const other = 480 - row;
    velocities[other] += 2;
    positions[other] += velocities[other];
   }
  }
  if (counter < 241) counter += 8;
 } while (positions[241] >= -640 && positions[241] <= 640);
 return Object.freeze({
  step() {
   if (closed) fail('LEGACY_CITY_ENTRY_FADE_CLOSED');
   if (calls && positions[0] >= 0) fail('LEGACY_CITY_ENTRY_FADE_COMPLETE');
   for (let row = 0; row < Math.min(counter, 241); row++) {
    positions[row] -= velocities[row];
    velocities[row] += 2;
    if (row > 0 && row < 240) {
     const other = 480 - row;
     positions[other] -= velocities[other];
     velocities[other] -= 2;
    }
   }
   if (positions[240] >= 240) counter = Math.max(0, counter - 8);
   return Object.freeze({ type: 15, calls: ++calls, counter, complete: positions[0] >= 0,
    rowPositions: Object.freeze(Array.from(positions, Math.trunc)) });
  },
  close() { if (!closed) { closed = true; velocities.fill(0); positions.fill(0); } },
 });
}

/** Clear follows the existing portable indexed-frame RGBA representation. */
export function composeLegacyGameBattleExitFade(captured,rowPositions,type,width,height){typeOf(type);
 if(type===12){const out=composeLegacyGameBattleEntryFade(captured,rowPositions,width,height);return Object.freeze({...out,profile:LEGACY_GAME_BATTLE_EXIT_FADE_PROFILE.id,type,scope:'source-exit-captured-rows'});}
 return composeVertical(captured,rowPositions,14,width,height);
}

export function composeLegacyGameCityEntryFade(captured,rowPositions,width,height){
 return composeVertical(captured,rowPositions,15,width,height);
}

function composeVertical(captured,rowPositions,type,width,height){
 const c=assetFields(captured,['width','height','rgba']);if(c.width!==640||c.height!==480)fail('LEGACY_BATTLE_EXIT_CAPTURE_DIMENSIONS');assetInteger(width,1,4194304);assetInteger(height,1,Math.floor(4194304/width));
 const rows=assetList(rowPositions,480);if(rows.length!==480)fail('LEGACY_BATTLE_EXIT_FADE_ROWS');for(const y of rows)assetInteger(y,-32768,32767);const source=assetBytes(c.rgba,640*480*4);
 try{if(source.length!==640*480*4)fail('LEGACY_BATTLE_EXIT_CAPTURE_BYTES');const rgba=new Uint8Array(width*height*4),count=Math.min(640,width);let copied=0;
  // Type14 descends from 479 to 1. Type15 visits all rows in ascending order.
  const exit=type===14;
  for(let index=0;index<(exit?479:480);index++){
   const row=exit?479-index:index,y=rows[row];if(y<0||y>=height)continue;
   const at=row*640*4;rgba.set(source.subarray(at,at+count*4),y*width*4);copied+=count;
  }
  return Object.freeze({profile:LEGACY_GAME_BATTLE_EXIT_FADE_PROFILE.id,type,width,height,rgba,rasterOperations:copied,scope:exit?'source-exit-captured-rows':'source-city-entry-captured-rows'});
 }finally{source.fill(0);}
}
