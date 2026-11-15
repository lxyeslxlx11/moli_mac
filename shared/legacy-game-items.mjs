/** Fixed 37c4 item rows shared by ordinary and battle input. */
import {assetBytes} from './legacy-game-resource-values.mjs';
import {
  splitLegacyGameStateFields as split,
  unescapeLegacyGameInnerField as unescape,
  readLegacyGameStateDecimal as decimal,
} from './legacy-game-state.mjs';

const slots=28,bagStart=8,fieldsPerRow=14;
const emptyText=new Uint8Array();
const number=field=>field?.length?decimal(field.subarray(0,127)):-1;
const usable=row=>row.present&&(row.useFlags&1)!==0;
const directUse=row=>usable(row)&&row.code!==0x67c9;
const targetedUse=row=>usable(row)&&row.code===0x67c9;
const eligibleTarget=row=>row.present&&row.category!==0x2f&&row.quantity<=0&&
  !(row.qualification&0x100)&&(!(row.qualification&0x200)||!!(row.qualification&0x400));
const command=(operationId,args)=>Object.freeze({operationId,arguments:Object.freeze(args)});
function clearText(row){
  row.nameBytes.fill(0);
  row.descriptionBytes.fill(0);
}

function fail(code){
  const error=Error('Item data is outside the supported source profile.');
  error.code=code;
  throw error;
}

function slotNumber(value){
  if(!Number.isInteger(value)||value<0||value>=slots)fail('LEGACY_GAME_ITEM_SLOT');
  return value;
}

export function createLegacyGameItems(){
  let closed=false,revision=0;
  const rows=Array.from({length:slots},()=>({present:false,nameBytes:emptyText,descriptionBytes:emptyText,revision:0}));
  const active=()=>{if(closed)fail('LEGACY_GAME_ITEMS_CLOSED');};
  const result=(kind,changed)=>Object.freeze({kind,revision,slots:Object.freeze(changed)});

  function selected(slot,expectedRevision){
    const row=rows[slotNumber(slot)];
    if(row.revision!==expectedRevision)fail('LEGACY_GAME_ITEM_STALE');
    return row;
  }

  function battleRecord(slot){
    active();
    const row=rows[slotNumber(slot)];
    if(slot<bagStart||!row?.present)return null;
    const gear=row.category>=0&&row.category<=7;
    const needsSpace=gear&&rows[2]?.present&&rows[3]?.present&&rows.slice(bagStart).every(r=>r?.present);
    // The native full-bag test uses the grid index, before adding eight.
    const blockedBySpace=needsSpace&&((rows[slot-bagStart]?.flags??0)&8)!==0;
    return Object.freeze({slot,revision:row.revision,nameBytes:row.nameBytes.slice(),
      action:gear?'equip':'use',targetMask:row.targetMask,
      enabled:row.qualification!==0&&(gear?!blockedBySpace:(row.flags&1)!==0)});
  }

  return Object.freeze({
    apply(value){
      active();
      const raw=assetBytes(value,32760),staged=new Map();
      try{
        const fields=split(raw);
        for(let at=0;at+2<fields.length;at+=fieldsPerRow){
          const field=fields[at+1];
          // 510de0 requires a delimiter within the 255-byte name read.
          if(field.length>=255)break;
          const slot=slotNumber(number(fields[at]));
          const previous=staged.get(slot)??rows[slot];
          const name=unescape(field);
          try{
            if(name.length&&fields.length<at+fieldsPerRow)fail('LEGACY_GAME_ITEM_FIELDS');
            const nameBytes=(name.length>0&&name.length<=28?name:previous.nameBytes).slice();
            const row=name.length?{
              present:true,nameBytes,descriptionBytes:unescape(fields[at+3].subarray(0,0x2ff)),
              code:number(fields[at+4]),useFlags:number(fields[at+5])&0xffff,
              flags:number(fields[at+6])&0xffff,category:number(fields[at+11]),quantity:number(fields[at+12]),
              targetMask:(number(fields[at+7])<<16)>>16,qualification:number(fields[at+9])&0xffff,
              exchangeCode:number(fields[at+10]),level:number(fields[at+8]),
            }:{...previous,present:false,nameBytes,descriptionBytes:emptyText};
            if(staged.has(slot))clearText(previous);
            staged.set(slot,row);
          }finally{name.fill(0);}
        }
        const changed=[...staged.keys()];
        if(changed.length){
          revision++;
          for(const [slot,row] of staged){
            clearText(rows[slot]);
            rows[slot]={...row,revision};
          }
          staged.clear();
        }
        return result('items-updated',changed);
      }finally{
        raw.fill(0);
        for(const row of staged.values())clearText(row);
      }
    },
    swap(from,to){
      active();
      if(!Number.isInteger(from)||!Number.isInteger(to))fail('LEGACY_GAME_ITEM_SLOT');
      if(from<0||to<0)return result('items-swapped',[]);
      slotNumber(from);slotNumber(to);
      if(from===to)return result('items-swapped',[]);
      [rows[from],rows[to]]=[rows[to],rows[from]];
      revision++;
      rows[from].revision=rows[to].revision=revision;
      return result('items-swapped',[from,to]);
    },
    copySlots(includeText=true){
      active();
      return Object.freeze(rows.map((row,slot)=>Object.freeze({slot,revision:row.revision,
        equipment:slot<bagStart,present:row.present,nameBytes:includeText&&row.present?row.nameBytes.slice():null,
        descriptionBytes:includeText&&row.present?row.descriptionBytes.slice():null,
        exchangeCode:row.present?row.exchangeCode:null,
        category:row.present?row.category:null,
        quantity:row.present?row.quantity:null,canUse:directUse(row),canUseOnItem:targetedUse(row),
        canTrade:slot>=bagStart&&row.present&&(row.qualification&1)!==0,
        canStore:slot>=bagStart&&row.present&&(row.qualification&0x60)===0,
        canReceiveItemUse:slot>=bagStart&&eligibleTarget(row)})));
    },
    copyCraftRecords(){
      active();
      return Object.freeze(rows.flatMap((row,slot)=>slot>=bagStart&&row.present?[Object.freeze({
        slot,revision:row.revision,present:true,nameBytes:row.nameBytes.slice(),
        hasDescription:row.descriptionBytes.length>0&&![0,10,13].includes(row.descriptionBytes[0]),
        graphicIndex:row.code,level:row.level,qualification:row.qualification,exchangeCode:row.exchangeCode,
        category:row.category,quantity:row.quantity,
      })]:[]));
    },
    prepareUse(slot,expectedRevision,x,y){
      active();
      if(!directUse(selected(slot,expectedRevision)))fail('LEGACY_GAME_ITEM_USE');
      return command('send-004f68b0',[x,y,slot,0]);
    },
    prepareTargetedUse(from,fromRevision,to,toRevision){
      active();
      if(!targetedUse(selected(from,fromRevision)))fail('LEGACY_GAME_ITEM_USE');
      const target=selected(to,toRevision);
      if(from===to||to<bagStart||!eligibleTarget(target))fail('LEGACY_GAME_ITEM_TARGET');
      return command('send-004f7ae0',[to,from]);
    },
    prepareDrop(slot,expectedRevision,x,y){
      active();
      if(!selected(slot,expectedRevision).present)fail('LEGACY_GAME_ITEM_DROP');
      return command('send-004f6ac0',[x,y,slot]);
    },
    prepareMove(from,fromRevision,to,toRevision,amount){
      active();
      const source=selected(from,fromRevision),destination=selected(to,toRevision);
      if(!source.present||from===to)fail('LEGACY_GAME_ITEM_MOVE');
      if(amount!==-1&&(!Number.isInteger(amount)||amount<1||amount>source.quantity||
          from<bagStart||to<bagStart||destination.present))fail('LEGACY_GAME_ITEM_AMOUNT');
      return command('send-004f6c70',[from,to,amount]);
    },
    battleRecord,
    weaponRemoval(){
      active();
      const weapons=rows.slice(2,4).filter(row=>row.present&&row.category!==7).length;
      const freeSlots=rows.slice(bagStart).filter(row=>!row.present).length;
      return Object.freeze({revision,weapons,freeSlots,reason:weapons===0?'empty':freeSlots<weapons?'space':null});
    },
    battleRecords(){
      active();
      const records=[];
      for(let slot=bagStart;slot<slots;slot++){
        const record=battleRecord(slot);
        if(record)records.push(record);
      }
      return Object.freeze(records);
    },
    inspect(){
      return Object.freeze({revision,occupied:rows.filter(r=>r?.present).length,
        bagOccupied:rows.slice(bagStart).filter(r=>r?.present).length});
    },
    close(){
      if(closed)return;
      closed=true;
      for(const row of rows)clearText(row);
      rows.fill(null);
    },
  });
}
