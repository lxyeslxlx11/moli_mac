import test from 'node:test';
import assert from 'node:assert/strict';
import * as api from '../index.mjs';
import {clientEnter} from '../../web/tests/helpers/legacy-game-client-fixture.mjs';
import {vitalsFixture,enterVitals,sendVitals,numeric,vectors as v,checkVitalsFrame,ascii,sha,textController} from '../../web/tests/helpers/legacy-game-actor-vitals-fixture.mjs';
const hex=b=>Buffer.from(b).toString('hex'),base=(values=[50,100,75,100])=>({enabled:true,local:true,bodyFlags:0xb4,primary:0,screenX:160,screenY:120,values}),units=(id='3e')=>ascii(`1|${id}|2|3|0|100010|0|0|Hero|Guild|0|0|0|Tail|0|0|`);
test('all198 independent SHL32/signed IDIV/int16 cases, including zero and unsafe division',()=>{
 for(const r of numeric.cases)if(r.error)assert.throws(()=>api.legacyGameActorValueWidth(r.current,r.maximum),e=>e.code===r.error);else assert.equal(api.legacyGameActorValueWidth(r.current,r.maximum),r.expected);
 assert.equal(api.legacyGameActorValueWidth(200,100),64);assert.equal(api.legacyGameActorValueWidth(-100,100),-32);assert.equal(api.legacyGameActorValueWidth(1,-1),-32);
});
test('source bars use the actual fill/background resources, parent anchors and zero-denominator omission',()=>{
 const p=api.planLegacyGameActorVitals(base());assert.deepEqual(p.widths,[16,24]);assert.deepEqual(p.draws.map(r=>[r.kind,r.resourceId,r.x,r.y]),[['fill',0x3bdf0,138,121],['fill',0x3bdef,138,124],['background',0x3bdee,150,123]]);assert.deepEqual(api.planLegacyGameActorVitals(base([1,0,1,0])).draws.map(r=>r.kind),['background']);assert.equal(api.planLegacyGameActorVitals({...base(),enabled:false}),null);assert.equal(api.planLegacyGameActorVitals({...base(),local:false}),null);assert.ok(api.planLegacyGameActorVitals({...base(),local:false,primary:0x200}));assert.throws(()=>api.planLegacyGameActorVitals({...base(),bodyFlags:0x800b4}),e=>e.code==='LEGACY_VITALS_SHADOW_SOURCE_REQUIRED');
});
test('source value plans reject getters and extra fields before any numeric consumption',()=>{
 let reads=0;const r=base();Object.defineProperty(r,'screenX',{get(){reads++;return 0;}});assert.throws(()=>api.planLegacyGameActorVitals(r));assert.equal(reads,0);assert.throws(()=>api.planLegacyGameActorVitals({...base(),extra:0}));assert.throws(()=>api.planLegacyGameActorVitals(base([1,2,3])));
});
test(']_g reads five flat groups, empty ID termination, 2047-byte prefix and decimal defaults',()=>{
 const d=api.decodeLegacyGameActorValues(ascii('3e|25|100|50|100|4Q|1||-2|3|'));assert.deepEqual(d.records,[{id:200,values:[25,100,50,100]},{id:300,values:[1,0,-2,3]}]);assert.equal(d.terminatedAt,2);
 const b=ascii(Array.from({length:6},(_,i)=>`${i+1}|1|2|3|4`).join('|'));assert.equal(api.decodeLegacyGameActorValues(b).records.length,5);assert.equal(api.decodeLegacyGameActorValues(b).extraTokens,5);b.fill(0);assert.equal(d.records[0].values[0],25);
});
test('HFs exact masks preserve source column order and fallback names, and reject unsafe slot indices',()=>{
 const d=api.decodeLegacyGamePartyUpdate(4,ascii('1|200|8|16|12|14|Name'));assert.equal(d.active,true);assert.deepEqual(d.updates,[{name:'actorId',value:200},{name:'value8',value:8},{name:'value10',value:16},{name:'value0c',value:12},{name:'value14',value:14},{name:'labelBytes',value:ascii('Name')}]);
 assert.deepEqual(api.decodeLegacyGamePartyUpdate(1,ascii('4|99')).updates,[{name:'value8',value:99}]);assert.deepEqual(api.decodeLegacyGamePartyUpdate(1,ascii('12|'+'A'.repeat(17))).updates,[{name:'labelBytes',value:ascii('???')}]);assert.equal(api.decodeLegacyGamePartyUpdate(0,ascii('0|ignored')).updates.length,0);for(const n of [-1,5,1.5])assert.throws(()=>api.decodeLegacyGamePartyUpdate(n,ascii('0')));
});
test('actual client matches120 independent value/name/map RGBA scenes and ordinary member changes',async()=>{
 const f=vitalsFixture();try{await enterVitals(f);for(let i=0;i<v.full.frames.length;i++){for(const e of v.full.events.filter(e=>e.at===i))if(e.kind==='cycle')assert.equal(f.client.cycleLabels(),e.mode);else if(e.kind==='bars')assert.equal(f.client.setBarsVisible(e.visible),e.visible);else{f.offer(f.frame(e.plainHex));await new Promise(resolve=>setImmediate(resolve));}const expected=v.full.frames[i],out=f.client.runtime().pump({...f.client.readFrame(),tick:expected.tick});checkVitalsFrame(f.client,out,expected);const image=await f.client.library().startRender(out.frame.sceneLayer.drawPlan).done;assert.equal(sha(image.rgba),expected.rgbaSha256,'complete value scene '+(i+1));}}
 finally{f.close();}
});
test('remote value message updates indexed remotes only; local values refresh from real E(9 fields in the ordinary hook',async()=>{
 const f=vitalsFixture();try{await enterVitals(f);await sendVitals(f,']_g 1C|999|999|999|999|3e|1|2|3|4 ');let a=f.client.copyWorldState().actors;assert.deepEqual(a.localActor.vitals,[0,0,0,0]);assert.deepEqual(a.remoteActors.find(r=>r.id===200).vitals,[1,2,3,4]);const out=f.client.runtime().pump({...f.client.readFrame(),tick:1000});assert.equal(out.error,null);a=f.client.copyWorldState().actors;assert.deepEqual(a.localActor.vitals,[50,100,75,100]);}
 finally{f.close();}
});
test('party entry before C0 binds on actual unit creation and membership is independent of the ordinary aux04 badge',()=>{
 const a=api.createLegacyGameActors();try{a.setContext([100,0,1,0]);a.configureSceneMode(1);a.applyParty(0,ascii('1|200|7|8|9|10|Member'));assert.equal(a.copyState().party.rows[0].bound,false);a.applyUnits(units());const s=a.copyState();assert.equal(s.party.rows[0].bound,true);assert.equal(s.remoteActors[0].presentation.primary&0x300,0x300);assert.equal(s.remoteActors[0].presentation.forced,true);assert.equal(s.party.leaderBadge,'ordinary-source-aux04');assert.equal(hex(s.remoteActors[0].labels[0]),hex(ascii('Hero')));}
 finally{a.close();}
});
test('partial HFs retains omitted values and owns copied names; removing one of two slots dissolves remaining membership',()=>{
 const a=api.createLegacyGameActors();try{a.setContext([100,0,1,0]);a.configureSceneMode(1);a.applyUnits(units('3e'));a.applyUnits(units('4Q'));a.applyParty(1,ascii('1|200|7|8|9|10|First'));a.applyParty(2,ascii('1|300|17|18|19|20|Second'));a.applyParty(1,ascii('4|77'));let s=a.copyState();assert.equal(s.party.rows[1].value8,77);assert.equal(s.party.rows[1].value10,8);s.party.rows[1].labelBytes.fill(0);assert.equal(hex(a.copyState().party.rows[1].labelBytes),hex(ascii('First')));a.applyParty(1,ascii('0'));s=a.copyState();assert.equal(s.party.active,false);assert.ok(s.party.rows.every(r=>!r.active&&r.actorId===0&&!r.bound));assert.equal(s.remoteActors[0].presentation.primary&0x200,0);assert.equal(s.remoteActors[1].presentation.primary&0x200,0);assert.equal(s.party.rows[2].value14,20);assert.equal(hex(s.party.rows[2].labelBytes),hex(ascii('Second')));}
 finally{a.close();}
});
test('party body references are released on removal and scene rebuild while raw rows remain available to rebind',()=>{
 const a=api.createLegacyGameActors();try{a.setContext([100,0,1,0]);a.configureSceneMode(1);a.applyUnits(units());a.applyParty(1,ascii('1|200|7|8|9|10|Member'));a.remove(ascii('3e'));assert.equal(a.copyState().party.rows[1].bound,false);assert.equal(a.copyState().party.rows[1].active,true);a.applyUnits(units());assert.equal(a.copyState().party.rows[1].bound,true);a.beginScene();assert.equal(a.copyState().party.rows[1].bound,false);assert.equal(a.copyState().party.rows[1].actorId,200);}
 finally{a.close();}
});
test('slot removal with unbound slot0 records its source gate and does not enqueue followers',()=>{
 const a=api.createLegacyGameActors();try{a.setContext([100,0,1,0]);a.configureSceneMode(1);for(const [i,id]of ['3e','4Q','6s'].entries()){a.applyUnits(units(id));a.applyParty(i+1,ascii(`1|${200+i*100}|7|8|9|10|Member`));}const effect=a.applyParty(1,ascii('0'));assert.equal(effect.partyActive,true);assert.equal(effect.coordinateTransfer.synchronization,'slot0-unbound');assert.equal(effect.coordinateTransfer.queued,0);assert.equal(a.copyState().party.following,'ordinary-source');}
 finally{a.close();}
});
test('bar controls are local, preserve pause/scene choice, and never add a protocol write',async()=>{
 const f=vitalsFixture();try{assert.throws(()=>f.client.toggleBars());await enterVitals(f);const before=f.writes.length;assert.equal(f.client.toggleBars(),false);f.client.pause();assert.equal(f.client.toggleBars(),true);assert.equal(f.client.inspect().state,'paused');assert.equal(f.writes.length,before);assert.throws(()=>f.client.setBarsVisible(1));f.client.close();assert.equal(f.client.inspect().actorBarsVisible,false);assert.throws(()=>f.client.toggleBars());}
 finally{f.close();}
});
