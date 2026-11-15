/** Source489880/4898e0/218 logical cache. It does not mutate received persistent pet records. */
import{battleFail as fail}from'./legacy-game-battle-bytes.mjs';
export function createBattlePetCache(){let closed=false,activeIndex=-1,captured=false,revision=0;const values=Array.from({length:5},()=>[0,0,0,0]);
 const active=()=>{if(closed)fail('LEGACY_BATTLE_CLOSED');};
 const refresh=v=>{if(activeIndex>=0&&activeIndex<5&&v){values[activeIndex]=[...v];revision++;}};
 return Object.freeze({
  begin(records,previousLocal){active();if(previousLocal<20){for(let i=0;i<5;i++)values[i]=[0x10,0x20,0x30,0x40].map(k=>records[i].fields[k]??0);captured=true;revision++;}},
  characters(index,pairedValues){active();activeIndex=index;refresh(pairedValues);},
  event(event){active();if(event.kind!=='battle-pet-cache')return;if(event.index===-2){if(activeIndex>=0){refresh(event.refreshValues);activeIndex=-1;revision++;}}else if(event.index>=0){if(event.index>=5)fail('LEGACY_BATTLE_PET_CACHE_INDEX');activeIndex=event.index;revision++;}},
  record(slot){active();return Number.isInteger(slot)&&slot>=0&&slot<5?Object.freeze([...values[slot]]):null;},
  inspect(){active();return Object.freeze({captured,activeIndex,revision,values:Object.freeze(values.map(v=>Object.freeze([...v])))});},
  close(){if(closed)return;closed=true;values.forEach(v=>v.fill(0));activeIndex=-1;captured=false;},
 });
}
