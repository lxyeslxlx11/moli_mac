import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import * as api from '../index.mjs';
import {createBattleFriendRoster} from '../legacy-game-battle-friends.mjs';
import {originalFiles} from '../../analysis/game-resource-runtime-v1/original_files.mjs';
import {petTransitionFiles} from '../../analysis/game-battle-pet-transition-v1/tcp-flow.mjs';

const bytes=text=>Uint8Array.from(text,ch=>ch.charCodeAt(0));
const bootstrap=JSON.parse(readFileSync(new URL('../../analysis/game-post-login-v1/original-vectors.json',import.meta.url))).bootstrap;
const detail=(index,name,metadata=[7,0,-2,0])=>[index,41,2,1,0,0,1,2,3,4,...metadata,9,bytes('Note|Other'),bytes(name)];
const requests=effect=>Array.from(effect.requests,request=>request.arguments[0]);

function worldFixture(){
  const world=api.createLegacyGameWorldProtocol();
  const codec=api.createLegacyGamePayloadCodec(new Uint8Array(Buffer.from(bootstrap.keyHex,'hex')));
  world.append(api.encodeLegacyGameEnvelope(new Uint8Array(Buffer.from(bootstrap.payloadHex,'hex'))));
  assert.equal(world.next().kind,'bootstrap');
  function feed(tag,args){
    const fields=args.map(value=>typeof value==='number'?api.encodeLegacyGameInteger(value):api.encodeLegacyGameTextField(value));
    const plain=bytes(tag+' '+fields.map(value=>String.fromCharCode(...value)).join(' ')+' ');
    world.append(api.encodeLegacyGameEnvelope(codec.encode(plain)));
    return world.next().effect;
  }
  return {world,feed,close(){world.close();codec.close();}};
}

test('fixed bitmap and detail keep exact one-based rows, signed refresh and clearing',()=>{
  const f=worldFixture();
  try{
    const mask='-2147483647|1|0|0|0|0|0|0|0|2147483648|';
    assert.deepEqual(requests(f.feed('@t-',[4,bytes(mask)])),[1,32,33,320]);
    for(const index of [1,32,33,320])assert.deepEqual(f.feed('B8S',detail(index,'Card')),{kind:'battle-friend-detail',accepted:true,index});
    assert.equal(f.feed('B8S',detail(321,'Overflow')).accepted,false);
    assert.equal(f.feed('B8S',detail(0,'Zero')).accepted,false);
    assert.deepEqual(f.world.inspect().battleFriends,{revision:4,rows:4});
    assert.deepEqual(requests(f.feed('@t-',[4,bytes(mask)])),[]);
    assert.deepEqual(requests(f.feed('@t-',[5,bytes(mask)])),[1,32,33,320]);
    assert.deepEqual(requests(f.feed('@t-',[3,bytes('0||-1')])),[]);
    assert.deepEqual(f.world.inspect().battleFriends,{revision:3,rows:2});
    assert.deepEqual(requests(f.feed('@t-',[3,bytes(mask)])),[1,32]);
    f.world.close();
    assert.equal(f.world.inspect().battleFriends,null);
  }finally{f.close();}
});

test('bitmap emits all 320 ascending indices and signed decimal prefix semantics',()=>{
  const f=worldFixture();
  try{
    const bitmap=bytes(Array(10).fill('4294967295').join('|')+'|-1');
    assert.deepEqual(requests(f.feed('@t-',[-1,bitmap])),Array.from({length:320},(_,i)=>i+1));
    assert.deepEqual(requests(f.feed('@t-',[0,bytes(' +3junk|0x20| -2147483648 |')])),[1,2,96]);
  }finally{f.close();}
});

test('friend lookup uses the C-string bytes and four nonzero tests, with owned replacement',()=>{
  const roster=createBattleFriendRoster();
  try{
    const values=detail(1,'Card\0Hidden');
    roster.applyDetail(values);
    values[16].fill(0);
    assert.equal(roster.match(bytes('Card'),[1,0,1,0]),true);
    assert.equal(roster.match(bytes('card'),[1,0,1,0]),false);
    assert.equal(roster.match(bytes('Card'),[1,0,0,0]),false);
    assert.equal(roster.match(bytes('Card\0Other'),[true,false,true,false]),true);
    roster.applyDetail(detail(1,'1234567890123456'));
    assert.equal(roster.match(bytes('1234567890123456'),[1,0,1,0]),true);
    roster.applyDetail(detail(1,'12345678901234567'));
    assert.equal(roster.match(bytes('???'),[1,0,1,0]),true);
    assert.equal(roster.match(bytes('Card'),[1,0,1,0]),false);
    roster.applySummary(1,bytes('0'));
    assert.equal(roster.match(bytes('???'),[1,0,1,0]),false);
  }finally{roster.close();}
});

test('received C classifies the local pair and opposite name+metadata, then rereads on entry',async()=>{
  const f=worldFixture(),files=originalFiles(petTransitionFiles());
  const library=api.createLegacyGameResourceLibrary({plan:api.createLegacyGameResourcePlan(new Uint8Array()),files:files.port,paletteMode:'neutral'});
  try{
    await library.initialize();
    const {world}=f;
    world.configureActorResources(0);
    world.configureBattlePlayback({animations:library.catalogs().animations,geometry:library.geometry,seed:1,initialPhase:0,alternativeRenderer:false,staticFlip:false,screenOffset:[0,0]});
    world.configureBattleFrames({graphics:library.catalogs().graphics});
    world.configureBattleEntry({entryWindowPresent:false});
    f.feed('@t-',[1,bytes('1')]);
    f.feed('B8S',detail(1,'Card'));
    const c='C|0|'+[[0,'Hero',0],[5,'Pet',0],[1,'Card',0x5000000],[10,'Card',0x5000000],[11,'Card',0x1000000],[12,'card',0x5000000]].map(([slot,name,flags])=>
      slot.toString(16).toUpperCase()+'|'+name+'|186DC|0|1|46|64|A|A|'+flags.toString(16).toUpperCase()+'|0|0|').join('');
    let tick=0;
    const entry=()=>{
      f.feed('>HY',[1,1000]);
      f.feed('?+e',[bytes('P|0|10|0|0|0|0|')]);
      f.feed('?+e',[bytes(c)]);
      for(let step=0;step<60;step++){
        world.advanceBattleEntry(tick+=16);
        if(world.copyBattleEntry().phase===3)break;
      }
      assert.equal(world.copyBattleEntry().phase,3);
      return Array.from(world.copyBattleCommands().bodies.bodies,body=>body?body.savedFlags&1:null);
    };
    const first=entry();
    assert.deepEqual([first[0],first[5],first[1],first[10],first[11],first[12]],[1,1,0,1,0,0]);
    f.feed('@t-',[2,bytes('0')]);
    assert.equal(world.copyBattleCommands().bodies.bodies[10].savedFlags&1,1,'Existing body keeps its last source classification');
    const second=entry();
    assert.deepEqual([second[0],second[5],second[10]],[1,1,0]);
  }finally{f.close();library.close();files.close();}
});
