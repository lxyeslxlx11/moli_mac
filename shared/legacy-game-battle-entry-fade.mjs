/** Fixed37c4 505030(13,8,float2) ->503330 case6 and44ce40 captured-row copies. */
import {battleFail as fail} from './legacy-game-battle-bytes.mjs';
import {assetFields,assetBytes,assetInteger,assetList} from './legacy-game-resource-values.mjs';
export const LEGACY_GAME_BATTLE_ENTRY_FADE_PROFILE=Object.freeze({id:'legacy-se6000-37c4-battle-entry-fade13-v1',
  sourceSha256:'37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd',width:640,height:480,
  type:13,stride:8,acceleration:2,scope:'source-entry-row-displacement',nativeExitFade:'unimplemented'});

export function createLegacyGameBattleEntryFade(){const velocities=new Float32Array(480),offsets=new Float32Array(480);
  let closed=false,started=false,complete=false,calls=0,counter=0;
  const active=()=>{if(closed)fail('LEGACY_BATTLE_ENTRY_FADE_CLOSED');};
  const initialize=()=>{let count=0,iterations=0;
    do{if(++iterations>1024)fail('LEGACY_BATTLE_ENTRY_FADE_BUDGET');
      for(let row=0;row<count;row++){const odd=row&1,other=(odd?480:478)-row,delta=odd?2:-2;
        for(const at of [row,other]){const velocity=velocities[at]+delta;velocities[at]=velocity;offsets[at]=offsets[at]+velocity;}}
      count=Math.min(240,count+8);
    }while(offsets[241]>=-640&&offsets[241]<=640);
    counter=count;started=true;
  };
  return Object.freeze({
    step(){active();if(complete)fail('LEGACY_BATTLE_ENTRY_FADE_COMPLETE');if(!started)initialize();
      for(let row=0;row<240;row++){const odd=row&1,other=(odd?480:478)-row;
        for(const at of [row,other]){if(odd?offsets[at]>1:offsets[at]<-1){offsets[at]=offsets[at]-velocities[at];velocities[at]=velocities[at]+(odd?-2:2);}else offsets[at]=0;}}
      counter=Math.min(240,counter+8);calls++;complete=offsets[0]===0;
      return Object.freeze({profile:LEGACY_GAME_BATTLE_ENTRY_FADE_PROFILE.id,calls,complete,counter,
        rowOffsets:Object.freeze(Array.from(offsets,n=>Math.trunc(n))),completion:'source-row0-zero'});
    },
    copyState(){active();return Object.freeze({started,complete,calls,counter,velocities:velocities.slice(),offsets:offsets.slice()});},
    close(){if(closed)return;closed=true;velocities.fill(0);offsets.fill(0);},
  });
}

/** Copy the actual owned640x480 background. Uncovered RGBA uses the existing indexed-frame representation. */
export function composeLegacyGameBattleEntryFade(captured,rowOffsets,width,height){
  const c=assetFields(captured,['width','height','rgba']);if(c.width!==640||c.height!==480)fail('LEGACY_BATTLE_ENTRY_CAPTURE_DIMENSIONS');
  assetInteger(width,1,4194304);assetInteger(height,1,Math.floor(4194304/width));
  const rows=assetList(rowOffsets,480);if(rows.length!==480)fail('LEGACY_BATTLE_ENTRY_FADE_ROWS');for(const row of rows)assetInteger(row,-32768,32767);
  const source=assetBytes(c.rgba,640*480*4);try{if(source.length!==640*480*4)fail('LEGACY_BATTLE_ENTRY_CAPTURE_BYTES');const rgba=new Uint8Array(width*height*4);let copied=0;
    for(let y=0;y<Math.min(height,480);y++){const dx=rows[y],sourceX=Math.max(0,-dx),destinationX=Math.max(0,dx),count=Math.min(640-sourceX,width-destinationX);
      if(count<=0)continue;const at=(y*640+sourceX)*4;rgba.set(source.subarray(at,at+count*4),(y*width+destinationX)*4);copied+=count;}
    return Object.freeze({profile:LEGACY_GAME_BATTLE_ENTRY_FADE_PROFILE.id,width,height,rgba,rasterOperations:copied,sourceWidth:640,sourceHeight:480,scope:'source-entry-row-displacement'});
  }finally{source.fill(0);}
}
