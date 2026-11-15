/** Fixed37c4 44a430/44aaa0 palette cells sampled once per owned battle frame. */
import {assetBytes,assetFail,assetFields,assetInteger,assetList} from './legacy-game-resource-values.mjs';

const first=16*3,last=240*3;
const f=Math.fround;

export function snapshotLegacyGameBattlePalette(value){
  const input=assetFields(value,['rgb','tint']);
  const channels=(values,size)=>{
    const array=assetList(values,size);
    if(array.length!==size)assetFail('LEGACY_ASSET_BATTLE_PALETTE');
    return Object.freeze(array.map(n=>assetInteger(n,0,255)));
  };
  return Object.freeze({rgb:channels(input.rgb,768),tint:channels(input.tint,3)});
}

export function createLegacyGameBattlePalette(value){
  const input=assetFields(value,['baseRGB','guestRGB']);
  const base=assetBytes(input.baseRGB,768);
  const guest=input.guestRGB===null?null:assetBytes(input.guestRGB,768);
  if(base.length!==768||guest&&guest.length!==768)assetFail('LEGACY_ASSET_BATTLE_PALETTE');
  const current=base.slice(),targetTint=new Uint8Array(3),tint=new Uint8Array(3);
  const accumulator=new Float32Array(768),delta=new Float32Array(768);
  const tintAccumulator=new Float32Array(3),tintDelta=new Float32Array(3);
  let index,step,revision,refresh,transition,target,closed=false;
  function reset(){
    if(closed)assetFail('LEGACY_ASSET_CLOSED');
    current.set(base);
    tint.fill(128);
    index=step=revision=refresh=0;
    transition=false;
    target=base;
  }
  reset();
  return Object.freeze({
    pass(value){
      if(closed)assetFail('LEGACY_ASSET_CLOSED');
      if(!value)return null;
      const request=assetFields(value,['index','frames']);
      const frames=assetInteger(request.frames,1,2147483647);
      if(request.index!==0&&request.index!==13)assetFail('LEGACY_ASSET_BATTLE_PALETTE');
      const requested=request.index===0?base:guest;
      if(request.index!==index&&requested){
        index=request.index;
        target=requested;
        step=refresh=0;
        revision=1;
        transition=true;
        const divisor=f(frames);
        for(let i=first;i<last;i++){
          accumulator[i]=current[i];
          delta[i]=f((target[i]-current[i])/divisor);
        }
        targetTint.fill(index===0?128:96);
        for(let i=0;i<3;i++){
          tintAccumulator[i]=tint[i];
          tintDelta[i]=f((targetTint[i]-tint[i])/divisor);
        }
      }
      if(requested&&transition){
        if(++step>frames){
          current.set(target.subarray(first,last),first);
          tint.set(targetTint);
          transition=false;
          revision+=10;
        }else{
          for(let i=first;i<last;i++){
            const sum=accumulator[i]+delta[i];
            accumulator[i]=f(sum);
            // The blue FST at 44a712 leaves the sum on ST0 for 51b4a8.
            // Green and red are reloaded from their stored float values.
            current[i]=Math.trunc(i%3===2?sum:accumulator[i]);
          }
          for(let i=0;i<3;i++){
            tintAccumulator[i]=f(tintAccumulator[i]+tintDelta[i]);
            tint[i]=Math.trunc(tintAccumulator[i]);
          }
        }
        if(++refresh>=(frames<121?2:Math.trunc(frames/20))){
          revision++;
          refresh=0;
        }
      }
      const projection=index===0&&!transition?null:Object.freeze({
        rgb:Object.freeze(Array.from(current)),tint:Object.freeze(Array.from(tint)),
      });
      return Object.freeze({requested:request.index,index,step,frames,revision,transition,
        resourceAvailable:requested!==null,projection});
    },
    reset,
    close(){
      if(closed)return;
      closed=true;
      for(const values of [base,guest,current,tint,targetTint,accumulator,delta,tintAccumulator,tintDelta])values?.fill(0);
    },
  });
}
