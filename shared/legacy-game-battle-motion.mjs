/** Source M record preparation. This does not execute native body/action callbacks. */
import {battleFail as fail,battleOwnedBytes,createBattleFieldReader} from './legacy-game-battle-bytes.mjs';
import {BATTLE_MOTION_TOKENS,BATTLE_MOTION_ALIASES} from './legacy-game-battle-motion-data.mjs';
export const LEGACY_GAME_BATTLE_MOTION_PROFILE=Object.freeze({id:'legacy-se6000-37c4-battle-motion-preparation-v1',sourceSha256:'37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd',tokens:BATTLE_MOTION_TOKENS,slots:22,recordBytes:4095,maximumCommands:1024,execution:'unimplemented'});
const slot=n=>n===50?20:n===51?21:n;
const paired=n=>n>=0&&n<=4||n>=10&&n<=14?n+5:n-5;
const groupZero=new Set([10,11,12,13,14,17,23]);
const genericClasses=new Set([0,1,3,5,6,72,75,76,77,78,79,80,81,84,85,87,94,95,96,105,110,113,257,258,259,260,262,266]);
const statusClasses=new Set([4,19,20,21,22,23,24,25,26,27,28,29,30,31,82,97,106,111,116,267]);
const singleClasses=new Set([12,50,51,52,53,88]);
const plainClasses=new Set([32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,54,55,56,57,58,59,60,64,65,66,67,68,86,99,100,101,102,103,104,107,109,112,114,117]);
const twoClasses=new Set([61,62,63,83,108]);
// 436c20/436bb0 scan raw numeric words beyond a parsed result. Keep the
// source numeric tail privately;never normalize the two native field orders.
const physicalTails=new WeakMap();
const sourceLengths=new WeakMap();
const physical113Sources=new WeakMap();
const physical72AttachedSources=new WeakMap();
export const battleMotionSourceLength=command=>sourceLengths.get(command);
export const battlePhysicalLookAheadTail=command=>physicalTails.get(command);
const attachedRIDParts=new WeakMap();
export const battleAttachedRIDParts=command=>attachedRIDParts.get(command);

export function battleGroupedMotionToken(reader,next,skipUnknown=false){
  let token=reader.token();
  while(skipUnknown&&token&&token.offset<next.tokenOffset&&!BATTLE_MOTION_TOKENS.includes(token.token))token=reader.token();
  return token?.token===next.token&&token.offset===next.tokenOffset?token:null;
}

export function battlePhysicalProducerEnd(command,fieldCount,hasGroupedSuccessor){
  const source=physical113Sources.get(command);
  if(!source)return null;
  const reader=createBattleFieldReader(source.bytes,0);
  for(let i=0;i<fieldCount;i++)reader.number();
  const offset=command.argumentOffset+reader.offset;
  // 42625e repeats the scan for unknown tokens, but an intervening known
  // token would execute inside this object instead of the reserved record.
  if(hasGroupedSuccessor&&(!source.next||!battleGroupedMotionToken(reader,source.next,true)))return null;
  return offset;
}

export function battlePhysicalAbortReachesRID(command,fieldCount){
  const source=physical72AttachedSources.get(command);
  if(!source)return false;
  const reader=createBattleFieldReader(source.bytes,0);
  for(let i=0;i<fieldCount;i++)reader.number();
  // 436930 reads one token when the command owner has another reserved record.
  const skipped=reader.token();
  if(!skipped||BATTLE_MOTION_TOKENS.includes(skipped.token)||reader.offset>source.ridOffset)return false;
  return reader.token()?.offset===source.ridOffset;
}

export function decodeLegacyGameBattleMotion(value) {
  const raw=battleOwnedBytes(value,4095),reader=createBattleFieldReader(raw),commands=[];let fields=[];
  const number=()=>{if(reader.done)fail('LEGACY_BATTLE_MOTION_TRUNCATED');if(fields.length>4095)fail('LEGACY_BATTLE_MOTION_FIELDS');const n=reader.number();fields.push(n);return n;};
  const skip=n=>{for(let i=0;i<n;i++)number();};
  const label=maximum=>{const b=reader.name(maximum);fields.push(b);return b;};
  const wipeFields=at=>{for(const x of fields.slice(at))if(x instanceof Uint8Array)x.fill(0);fields.length=at;};
  try {
    if(raw[0]!==77)fail('LEGACY_BATTLE_MOTION_TAG');
    for(let token;token=reader.token();){
      if(commands.length>=1024)fail('LEGACY_BATTLE_MOTION_COMMANDS');
      const index=BATTLE_MOTION_TOKENS.indexOf(token.token);if(index<0)fail('LEGACY_BATTLE_MOTION_OPCODE');
      fields=[];const counts=new Uint8Array(22);let primary=-1,advance=!groupZero.has(index),classCode=null,attachedRID=0,primaryFields=null,primaryEnd=null,firstRIDOffset=null;
      const mark=n=>{if(!Number.isInteger(n)||n<0||n>21)fail('LEGACY_BATTLE_MOTION_SLOT');counts[n]=(counts[n]+1)&255;return n;};
      const readSlot=()=>slot(number());
      const marked=()=>mark(readSlot());
      const all=()=>{for(let n=0;n<22;n++)mark(n);};
      const statusTail=flags=>{number();if(flags&0x800000)skip(3);};
      const list=(extras,status=false,skipBefore=false)=>{for(;;){if(skipBefore)number();const n=readSlot();if(n===255)return;mark(n);if(status)statusTail(number());else skip(extras);}};
      const ridTail=()=>{
        primaryFields=fields.length;primaryEnd=reader.offset;
        for(;;){
          const saved=reader.offset,at=fields.length,next=reader.token();
          if(next?.token!=='RID'){reader.seek(saved);return;}
          if(number()!==0){reader.seek(saved);wipeFields(at);return;}
          const a=number(),b=number();number();label(28);skip(7);const flagsA=number();label(28);skip(6);const flagsB=number();
          if(!(flagsA&2)&&!(flagsB&2)){reader.seek(saved);wipeFields(at);return;}
          firstRIDOffset??=next.offset;
          mark(a);mark(b);attachedRID++;
        }
      };
      const pairs=kind=>{
        const first=readSlot();if(first===255)return first;mark(first);mark(readSlot());let flags=number();number();if(kind===81)number();if(flags&0x800000)skip(3);
        for(;;){
          let extra=-1,extraFlags=0;
          if(kind===260&&(flags&0x80000)){extra=readSlot();if(extra!==255){mark(extra);extraFlags=number();statusTail(extraFlags);}}
          if(flags&0x200)marked();
          if(kind===260){if((flags&0x80000)&&(extraFlags&0x200))marked();}
          else if(kind===94)number();
          else if(kind===72&&(flags&1)){extra=readSlot();extraFlags=number();statusTail(extraFlags);if(extraFlags&0x200)marked();}
          if(extra===255)return first;
          const next=readSlot();if(next===255)return first;mark(next);marked();flags=number();statusTail(flags);kind=-1;
        }
      };
      const generic=kind=>{
        const variant=number();
        if(kind===72||kind===113||variant===0){primary=pairs(kind);return;}
        if(variant>0&&variant<4){
          primary=marked();
          for(;;){const n=readSlot();if(n===255)break;mark(n);const flags=number();statusTail(flags);if(n===primary&&(flags&0x200))marked();}
        }
      };
      if(index===0){
        let code=number();if(code>50000)for(const [from,to]of BATTLE_MOTION_ALIASES)if(code===from)code=to;
        classCode=Math.trunc(code/100);number();const k=classCode;
        if(genericClasses.has(k)){generic(k);ridTail();}
        else if(statusClasses.has(k)){number();primary=marked();list(0,true);ridTail();}
        else if(singleClasses.has(k)){number();primary=marked();number();}
        else if(plainClasses.has(k)||twoClasses.has(k)){
          number();primary=marked();list(twoClasses.has(k)||k===68?2:1);
          if(k<99)ridTail();
        }else if(k===73){
          const variant=number();if(variant===0)primary=pairs(k);else if(variant>0&&variant<4){primary=marked();list(0,true);}ridTail();
        }else if(k===93){
          number();primary=marked();for(;;){const n=readSlot();if(n===255)break;mark(n);label(28);skip(7);}
        }else if(k===98){
          number();const variant=number();primary=marked();
          if([0,1,2,3,4,5,9,10,11,14].includes(variant))list(variant===11?2:1);
          else if(variant===6||variant===8)list(0);
          else if(variant===7){for(;;){const n=readSlot();if(n===255)break;mark(n);mark(paired(n));}}
          else if(variant===12||variant===13){primary=readSlot();if(primary!==255){mark(primary);list(variant===13?2:0,variant===12);}}
          // 435a1a/435a83 return before the attached RID lookahead on assist FF.
          if(primary!==255)ridTail();
        }else if(k===263){primary=marked();const other=readSlot();skip(2);if(other!==-1)mark(other);}
        else if(k===400||k===401){primary=marked();list(1);}
        else if(k===402){number();primary=marked();const start=number()!==0?10:0;for(let n=start;n<start+10;n++)mark(n);}
        else if(k===404){
          number();primary=marked();for(;;){const n=readSlot();if(n===255)break;if(n===primary){marked();number();label(28);skip(8);label(28);skip(7);}else{mark(n);statusTail(number());}}ridTail();
        }else if(k===405){primary=marked();list(3,false,true);}
      }else if(index===1||index===20){primary=marked();number();}
      else if(index===2||index===3){for(;;){primary=readSlot();if(primary===255)break;mark(primary);}}
      else if(index===4){primary=marked();mark(paired(primary));}
      else if(index===5){primary=marked();mark(paired(primary));if(number()!==0){number();label(28);skip(6);}number();}
      else if(index===6){primary=marked();skip(2);}
      else if(index===7){const variant=number();if(variant===0){primary=marked();list(0,false,true);}else if(variant===6){primary=marked();marked();number();}else if(variant===7)primary=marked();}
      else if(index===8){marked();list(0,true);primary=255;ridTail();}
      else if(index===9){skip(2);primary=marked();skip(2);ridTail();}
      else if([10,11,12,15,16,18].includes(index))primary=marked();
      else if(index===13){primary=marked();number();}
      else if(index===14){primary=readSlot();if(primary>=0&&primary<22)mark(primary);skip(3);label(255);}
      else if(index===17){primary=marked();skip(7);}
      else if(index===19){primary=marked();const flags=number();number();if(flags&0x80000)number();}
      else if(index===21){marked();if(number()!==0){primary=readSlot();skip(2);label(28);skip(7);}all();}
      else if(index===22){const variant=number();primary=marked();marked();const flags=number();if(variant===0){label(28);skip(8);label(28);skip(7);}else if(flags&0x80000){label(28);skip(8);}}
      else if(index===23)all();
      let mask=0;for(let n=0;n<22;n++)if(counts[n])mask|=1<<n;
      const command=Object.freeze({index,token:token.token,tokenOffset:token.offset,argumentOffset:token.argumentOffset,nextOffset:reader.offset,principalSlot:primary,dependencyCounts:counts,dependencyMask:mask>>>0,groupAdvance:advance,classCode,attachedRID,fields:Object.freeze(fields.slice())});
      sourceLengths.set(command,raw.indexOf(0)<0?raw.length:raw.indexOf(0));
      if(classCode===113&&!attachedRID){
        const firstEnd=fields.indexOf(255,3);
        if(firstEnd>=0&&firstEnd<fields.length-1){
          // Keep only the numeric record and the following token, up to its arguments.
          const next=createBattleFieldReader(raw,reader.offset).token(),start=command.argumentOffset;
          physical113Sources.set(command,{bytes:raw.slice(start,next?.argumentOffset??reader.offset),
            next:next&&{token:next.token,tokenOffset:next.offset-start}});
        }
      }
      if(classCode===260||classCode===73){const tail=[],r=createBattleFieldReader(raw,primaryEnd??reader.offset);while(!r.done)tail.push(r.number());physicalTails.set(command,Object.freeze(tail));}
      if(attachedRID){const core=Object.freeze({...command,attachedRID:0,fields:Object.freeze(fields.slice(0,primaryFields))});
        sourceLengths.set(core,sourceLengths.get(command));
        if(classCode===72)physical72AttachedSources.set(core,{bytes:raw.slice(command.argumentOffset,firstRIDOffset+4),
          ridOffset:firstRIDOffset-command.argumentOffset});
        if(physicalTails.has(command))physicalTails.set(core,physicalTails.get(command));
        attachedRIDParts.set(command,Object.freeze({core,fields:Object.freeze(fields.slice(primaryFields)),primaryEnd}));}
      commands.push(command);
    }
    return Object.freeze({kind:'battle-motion-preparation',profile:LEGACY_GAME_BATTLE_MOTION_PROFILE.id,commands:Object.freeze(commands),consumedBytes:reader.offset,execution:'unimplemented'});
  }catch(error){wipeFields(0);for(const command of commands)for(const field of command.fields)if(field instanceof Uint8Array)field.fill(0);throw error;}
  finally{raw.fill(0);}
}
