import test from 'node:test';
import assert from 'node:assert/strict';
import {createLegacyGameItems} from '../index.mjs';
import {createLegacyGameBattleInput} from '../legacy-game-battle-input.mjs';

const bytes=text=>Uint8Array.from(text,c=>c.charCodeAt(0));
const record=(slot,name,{code=1,category=23,useFlags=1,flags=1,mask=0x61,identified=1,quantity=0}={})=>
  [slot,name,0,'',code,useFlags,flags,mask,0,identified,0,category,quantity,''].join('|');
const plain=step=>Array.from(step.requests,r=>{
  assert.equal(r.operationId,'send-004f88f0');
  assert.equal(r.arguments.length,1);
  return String.fromCharCode(...r.arguments[0]);
});

function fixture(controlFlags=0x10){
  const inventory=createLegacyGameItems();
  const context={localSlot:0,controlFlags,playerSkillMask:0,petSkillMask:0,mountedPet:-1};
  const rows=Array(20).fill(null);
  for(const slot of [0,5,10])rows[slot]={value170:70,statusFlags:0,actorFlags:0};
  const input=createLegacyGameBattleInput({
    context:()=>context,rows:()=>rows,hasLocalBody:()=>true,special13b4:()=>false,
    beginMarks(){},clearTargets(){},setTargets(){},clearControl(mask){context.controlFlags&=~mask;},
    itemRecord:inventory.battleRecord,itemRecords:inventory.battleRecords,weaponRemoval:inventory.weaponRemoval,
  });
  let tick=0;
  const step=()=>input.step(tick+=16);
  const until=predicate=>{
    for(let i=0;i<80;i++){
      const result=step();
      if(predicate(result.snapshot))return result;
    }
    assert.fail('Battle input did not reach the expected state');
  };
  input.begin(0,1);
  until(s=>s.state===1&&s.menu.state===0);
  function open(){
    input.command('item');
    until(s=>s.itemPopup.state==='ready');
  }
  function choose(slot){
    input.item(slot,input.inspect().itemPopup.records.find(row=>row.slot===slot).revision);
    return step();
  }
  return {inventory,input,open,choose,step,until,close(){input.close();inventory.close();}};
}

test('inventory applies 14-field updates, copies escaped names, and swaps authoritative slots',()=>{
  const inventory=createLegacyGameItems();
  try{
    const data=bytes([record(8,'Original\\zTonic'),record(9,'Second'),record(2,'Hand',{category:1})].join('|'));
    const result=inventory.apply(data);
    assert.deepEqual(Array.from(result.slots),[8,9,2]);
    assert.equal(result.revision,1);
    assert.deepEqual({...inventory.inspect()},{revision:1,occupied:3,bagOccupied:2});
    const initial=inventory.battleRecord(8);
    assert.equal(String.fromCharCode(...initial.nameBytes),'Original|Tonic');
    initial.nameBytes.fill(0);
    assert.equal(String.fromCharCode(...inventory.battleRecord(8).nameBytes),'Original|Tonic');
    inventory.swap(8,9);
    assert.equal(inventory.battleRecord(9).revision,2);
    inventory.apply(bytes(record(9,'x'.repeat(29),{mask:-32768})));
    assert.equal(String.fromCharCode(...inventory.battleRecord(9).nameBytes),'Original|Tonic');
    assert.equal(inventory.battleRecord(9).targetMask,-32768);
    inventory.apply(bytes('9||'));
    assert.equal(inventory.battleRecord(9),null);
    assert.deepEqual(Array.from(inventory.battleRecords(),row=>row.slot),[8]);
    assert.equal(data[0],56);
  }finally{inventory.close();}
});

test('inventory rejects partial positive and out-of-range rows before updating any slot',()=>{
  const inventory=createLegacyGameItems();
  try{
    inventory.apply(bytes(record(8,'Original')));
    assert.throws(()=>inventory.apply(bytes(record(8,'Replacement')+'|9|Short|0')),
      e=>e.code==='LEGACY_GAME_ITEM_FIELDS');
    assert.throws(()=>inventory.apply(bytes(record(8,'Replacement')+'|'+record(28,'Outside'))),
      e=>e.code==='LEGACY_GAME_ITEM_SLOT');
    assert.throws(()=>inventory.swap(8,28),e=>e.code==='LEGACY_GAME_ITEM_SLOT');
    assert.equal(String.fromCharCode(...inventory.battleRecord(8).nameBytes),'Original');
    assert.equal(inventory.inspect().revision,1);
  }finally{inventory.close();}
});

test('ordinary use takes field 6 and the special code while battle uses field 12 and its own flags',()=>{
  const inventory=createLegacyGameItems();
  try{
    inventory.apply(bytes([
      record(8,'Ordinary',{code:2,category:23,flags:0,identified:0,quantity:7}),
      record(9,'Special',{code:0x67c9}),
      record(10,'Battle only',{code:4,useFlags:0}),
      record(11,'Equipment',{code:4321,category:2,useFlags:0,flags:0}),
    ].join('|')));
    const slots=inventory.copySlots();
    assert.equal(slots.length,28);
    assert.equal(slots.filter(row=>row.equipment).length,8);
    assert.deepEqual(slots.slice(8,12).map(row=>row.canUse),[true,false,false,false]);
    assert.equal(slots[8].quantity,7);
    assert.equal(slots[2].nameBytes,null);
    slots[8].nameBytes.fill(0);
    assert.equal(String.fromCharCode(...inventory.copySlots()[8].nameBytes),'Ordinary');
    assert.deepEqual(inventory.prepareUse(8,1,2,3),{operationId:'send-004f68b0',arguments:[2,3,8,0]});
    for(const slot of [2,9,10,11])assert.throws(()=>inventory.prepareUse(slot,slots[slot].revision,2,3),
      e=>e.code==='LEGACY_GAME_ITEM_USE');
    assert.equal(inventory.battleRecord(8).action,'use');
    assert.equal(inventory.battleRecord(8).enabled,false);
    assert.equal(inventory.battleRecord(10).enabled,true);
    assert.equal(inventory.battleRecord(11).action,'equip');
    assert.equal(inventory.battleRecord(11).enabled,true);
  }finally{inventory.close();}
});

test('ordinary moves validate both slot revisions and only split into empty bag slots',()=>{
  const inventory=createLegacyGameItems();
  try{
    inventory.apply(bytes([record(8,'Stack',{quantity:6}),record(9,'Occupied'),record(2,'Equipped',{category:1})].join('|')));
    const check=(from,to,amount,fromRevision=1,toRevision=0)=>inventory.prepareMove(from,fromRevision,to,toRevision,amount);
    assert.deepEqual(check(8,27,6),{operationId:'send-004f6c70',arguments:[8,27,6]});
    assert.deepEqual(check(8,2,-1,1,1).arguments,[8,2,-1]);
    assert.deepEqual(check(2,27,-1).arguments,[2,27,-1]);
    for(const amount of [0,-2,7,1.5,NaN])assert.throws(()=>check(8,27,amount),e=>e.code==='LEGACY_GAME_ITEM_AMOUNT');
    for(const [from,to,rev] of [[8,9,1],[2,27,0],[8,3,0]]){
      assert.throws(()=>check(from,to,1,1,rev),e=>e.code==='LEGACY_GAME_ITEM_AMOUNT');
    }
    assert.throws(()=>check(8,8,-1,1,1),e=>e.code==='LEGACY_GAME_ITEM_MOVE');
    assert.throws(()=>check(26,27,-1,0,0),e=>e.code==='LEGACY_GAME_ITEM_MOVE');
    assert.deepEqual({...inventory.inspect()},{revision:1,occupied:3,bagOccupied:2});
    inventory.swap(26,27);
    assert.throws(()=>check(8,27,-1),e=>e.code==='LEGACY_GAME_ITEM_STALE');
    inventory.swap(8,9);
    assert.throws(()=>check(8,27,-1,1,2),e=>e.code==='LEGACY_GAME_ITEM_STALE');
    assert.throws(()=>inventory.prepareUse(8,1,2,3),e=>e.code==='LEGACY_GAME_ITEM_STALE');
    assert.equal(inventory.copySlots()[9].quantity,6);
  }finally{inventory.close();}
});

test('targeted item use uses the raw qualification bits and drop retains the slot until a reply',()=>{
  const inventory=createLegacyGameItems();
  try{
    inventory.apply(bytes([
      record(2,'Equipped'),record(8,'Source',{code:0x67c9}),record(9,'Excluded category',{category:0x2f}),
      record(10,'Stack',{quantity:1}),record(11,'Bit 8',{identified:0x100}),
      record(12,'Bit 9',{identified:0x200}),record(13,'Bits 9 and 10',{identified:0x600}),
      record(14,'Bit 10',{identified:0x400}),record(15,'Plain',{identified:0,quantity:-1}),
    ].join('|')));
    const slots=inventory.copySlots();
    assert.equal(slots[8].canUseOnItem,true);
    assert.equal(slots[8].canUse,false);
    assert.deepEqual(slots.slice(9,17).map(row=>row.canReceiveItemUse),[false,false,false,false,true,true,true,false]);
    for(const to of [2,8,9,10,11,12,16])assert.throws(()=>inventory.prepareTargetedUse(8,1,to,slots[to].revision),
      e=>e.code==='LEGACY_GAME_ITEM_TARGET');
    assert.throws(()=>inventory.prepareTargetedUse(13,1,14,1),e=>e.code==='LEGACY_GAME_ITEM_USE');
    assert.deepEqual(inventory.prepareTargetedUse(8,1,13,1),{operationId:'send-004f7ae0',arguments:[13,8]});
    assert.deepEqual(inventory.prepareDrop(2,1,-5,9),{operationId:'send-004f6ac0',arguments:[-5,9,2]});
    assert.throws(()=>inventory.prepareDrop(16,0,2,3),e=>e.code==='LEGACY_GAME_ITEM_DROP');
    assert.equal(inventory.copySlots()[2].present,true);
    assert.equal(inventory.inspect().revision,1);
    inventory.apply(bytes(record(13,'New stack',{quantity:1})));
    assert.throws(()=>inventory.prepareTargetedUse(8,1,13,1),e=>e.code==='LEGACY_GAME_ITEM_STALE');
    inventory.swap(8,16);
    assert.throws(()=>inventory.prepareTargetedUse(8,1,14,1),e=>e.code==='LEGACY_GAME_ITEM_STALE');
    assert.throws(()=>inventory.prepareDrop(8,1,2,3),e=>e.code==='LEGACY_GAME_ITEM_STALE');
  }finally{inventory.close();}
});

test('weapon removal counts both hand slots and excludes category 7 independently of item-use flags',()=>{
  const inventory=createLegacyGameItems();
  try{
    assert.deepEqual(inventory.weaponRemoval(),{revision:0,weapons:0,freeSlots:20,reason:'empty'});
    inventory.apply(bytes([record(1,'Other equipment',{category:1}),record(2,'Weapon',{category:3,identified:0,flags:0}),
      record(3,'Shield',{category:7}),...Array.from({length:19},(_,i)=>record(8+i,'Item '+i))].join('|')));
    assert.deepEqual(inventory.weaponRemoval(),{revision:1,weapons:1,freeSlots:1,reason:null});
    inventory.apply(bytes(record(3,'Second weapon',{category:1,identified:0,flags:0})));
    assert.deepEqual(inventory.weaponRemoval(),{revision:2,weapons:2,freeSlots:1,reason:'space'});
    inventory.apply(bytes('26||'));
    assert.deepEqual(inventory.weaponRemoval(),{revision:3,weapons:2,freeSlots:2,reason:null});
    inventory.apply(bytes('2||'));
    inventory.apply(bytes(record(3,'Shield',{category:7})));
    assert.deepEqual(inventory.weaponRemoval(),{revision:5,weapons:0,freeSlots:2,reason:'empty'});
  }finally{inventory.close();}
});

test('inventory uses source identification, use flags, and the raw grid index when the bag is full',()=>{
  const inventory=createLegacyGameItems();
  try{
    const gear={category:7,flags:0};
    inventory.apply(bytes([record(0,'Raw flag row',{...gear,flags:8}),record(2,'Hand A',gear),record(3,'Hand B',gear),
      ...Array.from({length:20},(_,i)=>record(8+i,'Item '+i,i<2?gear:i===2?{identified:0}:i===3?{flags:0}:{}))].join('|')));
    assert.equal(inventory.inspect().bagOccupied,20);
    assert.equal(inventory.battleRecord(8).enabled,false);
    assert.equal(inventory.battleRecord(9).enabled,true);
    assert.equal(inventory.battleRecord(10).enabled,false);
    assert.equal(inventory.battleRecord(11).enabled,false);
    inventory.apply(bytes('27||'));
    assert.equal(inventory.battleRecord(8).enabled,true);
    assert.equal(inventory.battleRecord(8).action,'equip');
  }finally{inventory.close();}
});

test('item input sends the exact target, own-slot, group, and equip forms',()=>{
  for(const [data,expected,target] of [
    [record(8,'Targeted'),'I|8|A',10],
    [record(9,'Immediate',{mask:0}),'I|9|0',null],
    [record(10,'All opponents',{mask:0x221}),'I|A|2A',10],
    [record(11,'Equipment',{code:4321,category:2,flags:0}),'Q|B|',null],
  ]){
    const f=fixture();
    try{
      f.inventory.apply(bytes(data));
      f.open();
      const slot=Number(data.split('|')[0]),chosen=f.choose(slot);
      if(target===null)assert.deepEqual(plain(chosen),[expected]);
      else{
        assert.deepEqual(plain(chosen),[]);
        assert.equal(chosen.snapshot.itemPopup.targeting,true);
        assert.throws(()=>f.input.target(5),e=>e.code==='LEGACY_BATTLE_INPUT_TARGET');
        f.input.target(target);
        assert.deepEqual(plain(f.step()),[expected]);
      }
      assert.equal(f.input.inspect().primaryCount,1);
      assert.equal(f.inventory.inspect().bagOccupied,1);
      const drained=f.until(s=>s.state===3);
      assert.deepEqual(plain(drained),[]);
      f.input.begin(2000,2);
      assert.equal(f.step().snapshot.itemPopup.state,'opening');
    }finally{f.close();}
  }
});

test('battle weapon removal rejects stale revisions and completes a single primary action with Q FF',()=>{
  const f=fixture();
  try{
    assert.throws(()=>f.input.command('weapon-remove'),e=>e.code==='LEGACY_BATTLE_INPUT_NOT_READY');
    f.open();
    assert.throws(()=>f.input.command('weapon-remove'),e=>e.code==='LEGACY_BATTLE_INPUT_DISABLED');
    f.inventory.apply(bytes(record(2,'Weapon',{category:1})));
    const {revision}=f.input.inspect().itemPopup.weaponRemoval;
    assert.throws(()=>f.input.command('weapon-remove',revision-1),e=>e.code==='LEGACY_BATTLE_INPUT_DISABLED');
    f.input.command('weapon-remove',revision);
    f.inventory.apply(bytes(record(2,'Replacement',{category:2})));
    const stale=f.step();
    assert.deepEqual(plain(stale),[]);
    assert.equal(stale.snapshot.primaryCount,0);
    assert.equal(stale.snapshot.itemPopup.state,'ready');
    f.input.command('weapon-remove',stale.snapshot.itemPopup.weaponRemoval.revision);
    const sent=f.step();
    assert.deepEqual(plain(sent),['Q|FF|']);
    assert.equal(sent.snapshot.primaryCount,1);
    assert.equal(sent.snapshot.itemPopup.state,'closed');
    assert.equal(f.inventory.copySlots()[2].present,true);
    assert.deepEqual(plain(f.until(s=>s.state===3)),[]);
  }finally{f.close();}
});

test('slot revisions reject a queued or targeted item after a swap or deletion',()=>{
  const f=fixture();
  try{
    f.inventory.apply(bytes(record(8,'Tonic')));
    f.open();
    const row=f.input.inspect().itemPopup.records[0];
    f.input.item(row.slot,row.revision);
    f.inventory.swap(8,9);
    assert.deepEqual(plain(f.step()),[]);
    assert.equal(f.input.inspect().itemPopup.state,'ready');
    assert.deepEqual(plain(f.choose(9)),[]);
    f.input.target(10);
    f.inventory.apply(bytes('9||'));
    const cleared=f.step();
    assert.deepEqual(plain(cleared),[]);
    assert.equal(cleared.snapshot.eligibleMask,0);
    assert.equal(cleared.snapshot.itemPopup.state,'opening');
    assert.equal(cleared.snapshot.itemPopup.targeting,false);
  }finally{f.close();}
});

test('closing or timing out item targeting clears the selection without sending an item',()=>{
  const f=fixture();
  try{
    f.inventory.apply(bytes(record(8,'Tonic')));
    f.open();
    f.choose(8);
    f.input.command('item-close');
    const closed=f.step();
    assert.deepEqual(plain(closed),[]);
    assert.equal(closed.snapshot.itemPopup.state,'closed');
    assert.equal(closed.snapshot.itemPopup.targeting,false);
    f.open();
    f.choose(8);
    const expired=f.input.step(30000);
    assert.deepEqual(plain(expired),['N','N']);
    assert.equal(expired.requestPhase5,true);
    assert.equal(expired.snapshot.itemPopup.targeting,false);
  }finally{f.close();}
});
