import test from 'node:test';
import assert from 'node:assert/strict';
import {battleIntegerBox,battleIntegerBoxRead,battleIntegerBoxPeek,battleIntegerBoxAtLeast,battleIntegerBoxIncrement,battleIntegerBoxSnapshot} from '../legacy-game-battle-integer-box.mjs';
test('4034f0 remasks on read21 and snapshot never consumes a read or random value',()=>{
 let calls=0;const random={next:()=>++calls},b=battleIntegerBox(-2147483648,random);
 for(let i=0;i<20;i++){assert.equal(battleIntegerBoxRead(b,random),-2147483648);assert.equal(battleIntegerBoxSnapshot(b).reads,i+1);}
 assert.equal(calls,1);assert.equal(battleIntegerBoxRead(b,random),-2147483648);assert.equal(b.reads,0);assert.equal(calls,2);
 const before=JSON.stringify(b);for(let i=0;i<10;i++)assert.equal(battleIntegerBoxPeek(b),-2147483648);assert.equal(JSON.stringify(b),before);
});
test('4033b0 signed comparison reads limit before counter and403410 increments through signed wrap',()=>{
 let calls=0;const random={next:()=>++calls},limit=battleIntegerBox(2147483647,random),counter=battleIntegerBox(-1,random);limit.reads=counter.reads=20;
 assert.equal(battleIntegerBoxAtLeast(counter,limit,random),false);assert.equal(limit.mask,3);assert.equal(counter.mask,4);
 const n=battleIntegerBox(2147483647,random);assert.equal(battleIntegerBoxIncrement(n,random),-2147483648);assert.equal(battleIntegerBoxPeek(n),-2147483648);
 assert.equal(battleIntegerBoxAtLeast(battleIntegerBox(0,random),battleIntegerBox(-1,random),random),true);
});
