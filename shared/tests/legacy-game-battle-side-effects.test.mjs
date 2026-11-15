import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import * as api from '../index.mjs';
import {sharedFixture} from '../../analysis/game-battle-shared-storage-v1/fixture.mjs';
import {sideEffectAssets,chatColor,timeColor} from '../../analysis/game-battle-shared-storage-v1/side-effects-fixture.mjs';
import {bytes,fixture} from '../../analysis/game-battle-loop-v1/reference-flow.mjs';

const read=path=>JSON.parse(readFileSync(new URL('../../analysis/'+path,import.meta.url)));
const original=read('game-battle-shared-storage-v1/original-fixtures.json');
const assets=sideEffectAssets(original);
const chatText=rows=>Array.from(rows,r=>String.fromCharCode(...r.text));
const hasPixel=(rgba,color)=>{
  for(let i=0;i<rgba.length;i+=4)if(color.every((v,n)=>rgba[i+n]===v))return true;
  return false;
};
const chatIcon=state=>state.playback.nodes.find(node=>node.kind==='chat-icon'&&!node.deleted);
const glyphs=state=>state.playback.nodes.filter(node=>node.kind==='time-glyph');

test('CHT/BST through M use chat lifetime, real pixels, action 161 and local-only time deduction',async()=>{
  const f=await sharedFixture(api,assets);
  try{
    f.owner.setTimer(120,1,0);
    f.load(bytes('M|CHT|0|1|2|6|<b>Original</b>|BST|0|3D|CHT|32|A|D|1|Alias|BST|A|FFFFFFC3|BST|1|7|CHT|1|C|E|1|Outside|'));
    const feedback=[],ids=[],icons=new Map(),chatWaits=[];
    let paintedChat=false,paintedTime=false,completed=false;
    let previous=f.owner.copyState();
    for(let i=0;i<220;i++){
      const {out,state,frame}=f.step();
      const icon=chatIcon(state);
      if(icon){
        if(!icons.has(icon.id)){
          const speaker=previous.playback.nodes.find(node=>node.slot===0);
          icons.set(icon.id,[speaker.position[0]-30,speaker.position[1]-speaker.animation.geometry.height]);
        }
        assert.equal(icon.drawPriority,204);
        assert.deepEqual([...icon.position],icons.get(icon.id));
      }
      for(const result of out.commands)if(result.kind==='command-chat-wait')chatWaits.push(result.remaining);
      for(const event of out.body.events){
        if(event.kind==='battle-time-feedback')feedback.push([event.slot,event.seconds,event.local]);
      }
      for(const row of glyphs(state)){
        if(!ids.some(glyph=>glyph[0]===row.id))ids.push([row.id,row.resourceId,row.drawPriority]);
      }
      if(icon&&!paintedChat)paintedChat=hasPixel((await f.library.startRender(frame.drawPlan).done).rgba,chatColor);
      if(frame.submitted.some(r=>r.kind==='time-glyph')&&!paintedTime)paintedTime=hasPixel((await f.library.startRender(frame.drawPlan).done).rgba,timeColor);
      if(out.manager.kind==='battle-round-drained'){completed=true;f.context.substate=4;}
      if(completed&&glyphs(state).length===0)break;
      previous=state;
    }
    assert.equal(completed,true);
    assert.equal(paintedChat,true);
    assert.equal(paintedTime,true);
    assert.equal(icons.size,1);
    assert.deepEqual(chatWaits,[5,4,3,2,1]);
    assert.deepEqual(feedback,[[0,61,true],[10,-61,false]]);
    assert.deepEqual(ids.map(row=>row.slice(1)),[0x3b859,0x3b7f5,0x3b85a,0x3b7f4,0x3b7f5,0x3b7f5,0x3b85a,0x3b7f4,0x3b7f5].map(resource=>[resource,207]));
    const chat=f.owner.copyChat();
    assert.deepEqual(chatText(chat),['<b>Original</b>','Alias']);
    assert.deepEqual(Array.from(chat,r=>[r.slot,r.channel,r.style]),[[0,1,2],[20,10,13]]);
    chat[0].text.fill(0);
    assert.equal(chatText(f.owner.copyChat())[0],'<b>Original</b>');
    assert.deepEqual(f.owner.inspectSideEffects().timer,{remainingMilliseconds:59000,mode:1});
    assert.equal(f.events.filter(e=>e.kind==='sound'&&e.value===0x4a).length,3);
    assert.equal(glyphs(f.owner.copyState()).length,0);
  }finally{f.close();}
});

test('exit applies active and global tails once in source order, without creating new feedback sprites',async()=>{
  const f=await sharedFixture(api,assets);
  try{
    f.owner.setTimer(4,1,0);
    const motion=bytes('M|CHT|0|1|2|20|First|BST|0|6|CHT|A|1|2|2|Active|BST|0|FFFFFFFD|CHT|A|1|2|1|Global|');
    f.load(motion);
    f.step();f.step();
    assert.deepEqual(chatText(f.owner.copyChat()),['First']);
    assert.equal(f.owner.copyState().commandIndex,3);
    const ctx={...f.context,substate:7};
    const out=f.owner.prepareExit(ctx);
    assert.deepEqual(out.sideEffects,{chat:2,time:2,chatSoundCues:2});
    assert.deepEqual(chatText(f.owner.copyChat()),['First','Active','Global']);
    assert.deepEqual(f.owner.inspectSideEffects().timer,{remainingMilliseconds:3000,mode:1});
    assert.equal(f.owner.copyState().cursor,motion.length);
    assert.equal(f.owner.copyState().activeMask,0);
    assert.equal(glyphs(f.owner.copyState()).length,0);
    assert.deepEqual(f.owner.prepareExit(ctx).sideEffects,{chat:0,time:0,chatSoundCues:0});
    assert.deepEqual(chatText(f.owner.copyChat()),['First','Active','Global']);
    f.owner.beginEntry(-1);
    assert.equal(f.owner.inspectSideEffects().timer.remainingMilliseconds,3000);
    assert.equal(f.owner.copyChat().length,3);
  }finally{f.close();}
});

test('real phase 7 scans a valid embedded uppercase CHT in a pending GMN record',async()=>{
  const f=await fixture(api,{motion:'M|SKL|0|7|0|0|A|0|A|FF|GMN|0|1|0|0|0|CHT|0|1|2|3|4|5|6|'});
  try{
    const b=f.battle;b.configureExit();
    for(let i=0;i<4;i++)f.step();
    b.receive(bytes('xU'),10);f.step();
    const exit=f.step().exit;
    assert.deepEqual(exit.cleanup.sideEffects,{chat:1,time:0,chatSoundCues:1});
    assert.deepEqual(chatText(b.copyChat()),['4']);
    assert.equal(b.copyCommands().playback.nodes.some(r=>r.kind==='chat-icon'),false);
  }finally{f.close();}
});

test('Xz@ owns the signed timer with exact zero, uint32 wrap and disabled mode',()=>{
  const bootstrap=read('game-post-login-v1/original-vectors.json').bootstrap;
  const codec=api.createLegacyGamePayloadCodec(new Uint8Array(Buffer.from(bootstrap.keyHex,'hex')));
  let reads=0;
  const world=api.createLegacyGameWorldProtocol(()=>{reads++;return 0xfffffffc;});
  const owner=api.createLegacyGameBattleCommands();
  try{
    world.append(api.encodeLegacyGameEnvelope(new Uint8Array(Buffer.from(bootstrap.payloadHex,'hex'))));
    assert.equal(world.next().kind,'bootstrap');
    world.append(api.encodeLegacyGameEnvelope(codec.encode(bytes('Xz@ 1 1 '))));
    assert.deepEqual(world.next().effect,{kind:'game-time-update',remainingMilliseconds:1000,mode:1});
    assert.equal(reads,1);
    assert.deepEqual(world.inspect().battle.sideEffects.timer,{remainingMilliseconds:1000,mode:1});
    owner.setTimer(1,1,0xfffffffc);
    owner.advanceTimer(996);
    assert.deepEqual(owner.inspectSideEffects().timer,{remainingMilliseconds:0,mode:1});
    owner.advanceTimer(997);
    assert.deepEqual(owner.inspectSideEffects().timer,{remainingMilliseconds:0,mode:0});
    owner.setTimer(-5,0,997);
    owner.advanceTimer(1000);
    assert.deepEqual(owner.inspectSideEffects().timer,{remainingMilliseconds:0,mode:0});
  }finally{world.close();codec.close();owner.close();}
});

test('chat wraps at 512 records and decodes owned 255-byte text with the selected profile',()=>{
  const owner=api.createLegacyGameBattleCommands();
  try{
    for(let n=0;n<513;n++){
      const ctx={mainState:10,substate:6,localSlot:0,controlFlags:0,resourceCode:0};
      owner.load(bytes('M|CHT|0|0|0|1|Message'+n+'|'),{...ctx,substate:5});
      const handle=owner.callManager(ctx).created[0];
      owner.callCommand(handle,ctx);owner.callCommand(handle,ctx);owner.callCommand(handle,ctx);
      owner.reset();
    }
    const records=chatText(owner.copyChat());
    assert.equal(records.length,512);
    assert.equal(records[0],'Message1');
    assert.equal(records.at(-1),'Message512');
    assert.equal(owner.inspectSideEffects().chatVersion,513);
    const encoded=Uint8Array.from([...Array(251).fill(65),0xc4,0xe3,13,10]);
    assert.equal(api.decodeLegacyGameChatText(encoded,{encoding:'windows-936'}),'A'.repeat(251)+'你\r\n');
    assert.throws(()=>api.decodeLegacyGameChatText(new Uint8Array(256),{encoding:'ascii'}),e=>e.code==='TEXT_BYTES');
    assert.equal(api.decodeLegacyGameChatText(new Uint8Array(),{encoding:'ascii'}),'');
  }finally{owner.close();}
});
