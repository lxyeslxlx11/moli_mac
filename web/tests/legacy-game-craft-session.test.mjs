import test from 'node:test';
import assert from 'node:assert/strict';
import * as api from '../../shared/index.mjs';
import {clientFixture,clientMenu,post} from './helpers/legacy-game-client-fixture.mjs';
import {flush,plain} from './helpers/legacy-game-session-fixture.mjs';
import {craftHeader,bytes} from '../../analysis/game-craft-input-v1/fixture.mjs';

test('coalesced entry reply and skill packet query recipes before the next character poll',async()=>{
  const f=clientFixture();
  try{
    await clientMenu(f);f.client.session().enterCharacter(0);await f.drive(()=>f.writes.length===3);
    const raw=Buffer.concat([Buffer.from('J<= '),Buffer.from(api.encodeLegacyGameTextField(bytes(craftHeader))),Buffer.from(' ')]);
    f.offer(Buffer.concat([Buffer.from(post.flow.replies.entered.frameHex,'hex'),f.frame(raw.toString('hex'))]));
    await flush();await flush();
    assert.equal(f.client.session().inspect().sourceCharacterEntered,false);
    assert.equal(f.writes.length,4);
    assert.equal(Buffer.from(plain(f.writes.at(-1)),'hex').toString(),"'<4 3 ");
    await assert.rejects(f.client.session().sendCommands([{operationId:'send-004f7be0',arguments:[2,3,9]}]),{code:'LEGACY_SESSION_GAME_NOT_ENTERED'});
    await f.drive(()=>f.client.session().inspect().sourceCharacterEntered);
    assert.equal(f.client.inspect().errorCode,null);assert.equal(f.stats.closeCalls,0);
  }finally{f.close();}
});
