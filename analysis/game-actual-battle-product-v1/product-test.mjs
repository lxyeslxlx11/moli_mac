/** Actual unchanged corpus through original peer, product controls, battle and ordinary return. */
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,mkdirSync} from 'node:fs';
import {createRequire} from 'node:module';
import {resolve,join} from 'node:path';
import {setTimeout as sleep} from 'node:timers/promises';
import {createLauncherLoopbackServer} from '../../adapters/node/launcher-loopback.mjs';
import {startup} from '../../web/tests/helpers/legacy-game-client-fixture.mjs';
import {actualBattlePeer} from './peer.mjs';
const profile=JSON.parse(readFileSync(new URL('../game-legacy-material-compat-v1/material-profile.json',import.meta.url))),archive=resolve(profile.archive),host=process.env.MOLI_MATERIAL_HOST??'web';
const cut=Number(process.env.MOLI_MATERIAL_CUT??59510),qa=process.env.MOLI_MATERIAL_QA??'/tmp/moli-stage296-qa';mkdirSync(qa,{recursive:true});
function selection(){const value=startup();value.context='legacy-se6000-37c4';value.resourceParametersHex=Buffer.from(profile.parameters).toString('hex');return new Uint8Array(Buffer.from(JSON.stringify(value)));}
const vitals=b=>b.actors.map(r=>[r.slot,...r.vitals]).sort((a,b)=>a[0]-b[0]);
function settled(b){if(b?.blocked)assert.fail(JSON.stringify(b.blocked));return b?.round===1&&b.actors.find(r=>r.slot===0)?.vitals[2]===5&&b.actors.find(r=>r.slot===10)?.vitals[0]===58;}
function checkReceipt(r,keepalives){assert.equal(r.total_client_requests,9+keepalives);assert.equal(r.entry_request_verified,true);assert.equal(r.status_guards_verified,1);assert.equal(r.battle_exit_verified,true);assert.equal(r.movement_requests_verified,2);assert.equal(r.battle_keepalives_verified,keepalives);assert.equal(r.official_session,false);}
if(host==='web'){
  const {chromium}=createRequire(import.meta.url)(resolve('build/dependencies/playwright-core-1.64.1/node_modules/playwright-core'));
  for(const mobile of [false,true])if(!process.env.MOLI_MATERIAL_SIZE||process.env.MOLI_MATERIAL_SIZE===(mobile?'mobile':'desktop'))test('actual material battle '+(mobile?'mobile':'desktop')+' CUT'+cut,{timeout:90000},async()=>{
    let peer,bridge,browser;const label=(mobile?'mobile':'desktop')+'-'+cut;
    try{
      peer=await actualBattlePeer({cut});bridge=await createLauncherLoopbackServer({sourceProfile:'legacy',gameCode:2,label:'Original actual material battle',endpoints:[{address:'127.0.0.1',port:peer.port}],lifetimeMilliseconds:60000});
      browser=await chromium.launch({channel:'chrome',headless:true});const context=await browser.newContext({viewport:mobile?{width:390,height:844}:{width:1100,height:850},isMobile:mobile,hasTouch:mobile}),page=await context.newPage(),errors=[],warnings=[];
      page.on('console',m=>{if(m.type()==='error')errors.push(m.text());if(m.type()==='warning')warnings.push(m.text());});page.on('pageerror',e=>errors.push(e.message));
      await page.goto(bridge.origin+'/web/game.html');await page.waitForFunction(()=>!document.querySelector('#game-archive').disabled);
      assert.equal(await page.title(),'Moli · 游戏');assert.ok((await page.locator('body').innerText()).includes('游戏资源 ZIP'));assert.equal(await page.locator('vite-error-overlay,nextjs-portal').count(),0);
      assert.deepEqual(await page.evaluate(()=>({scrollY,overflow:document.documentElement.scrollWidth>innerWidth})),{scrollY:0,overflow:false});await page.screenshot({path:join(qa,label+'-initial.png')});
      await page.locator('#game-startup').setInputFiles({name:'original-startup.json',mimeType:'application/json',buffer:Buffer.from(selection())});await page.locator('#game-archive').setInputFiles(archive);await page.locator('#game-connect').click();
      const inspect=()=>page.evaluate(async()=>(await import('/web/game-app.mjs')).inspectGamePage().view);
      async function until(predicate){let v;for(let i=0;i<2500;i++){v=await inspect();if(predicate(v))return v;if(v?.client.errorCode||v?.frameError||v?.battle?.blocked)throw Error(JSON.stringify(v));await sleep(20);}assert.fail('Expected actual material view: '+JSON.stringify(v));}
      await until(v=>v?.client.state==='choosing');await page.getByRole('button',{name:'请求版本升级',exact:true}).click();await page.getByRole('button',{name:'返回人物列表',exact:true}).click();await page.getByRole('button',{name:'下一外观 OriginalA',exact:true}).click();await page.getByRole('button',{name:'进入 OriginalA',exact:true}).click();
      const scene=await until(v=>v?.client.state==='playing'&&v.canvas?.presentations>2);assert.equal(scene.files.files,1072);assert.ok(scene.client.library.namedPaletteEntries>0);assert.equal(scene.frameError,null);
      const canvas=page.locator('#game-canvas');await canvas.scrollIntoViewIfNeeded();await page.screenshot({path:join(qa,label+'-scene.png')});
      peer.release();const ready=await until(v=>v?.battle?.actors.length===2&&v.battle.ready);assert.equal(ready.battle.round,0);await canvas.scrollIntoViewIfNeeded();await page.screenshot({path:join(qa,label+'-battle-entry.png')});
      await page.locator('#game-battle-guard').click();const result=await until(v=>settled(v?.battle));assert.deepEqual(vitals(result.battle),[[0,70,100,5,10],[10,58,100,10,10]]);assert.ok(result.battle.presentations>0);
      await canvas.scrollIntoViewIfNeeded();await page.screenshot({path:join(qa,label+'-battle-result.png')});const finish=await peer.finishBattle();
      const returned=await until(v=>v?.client.state==='playing'&&v.canvas?.presentations>0&&v.canvas?.state==='running');await canvas.scrollIntoViewIfNeeded();const box=await canvas.boundingBox(),x=box.x+box.width*416/640,y=box.y+box.height*168/480;
      if(mobile)await page.touchscreen.tap(x,y);else await page.mouse.click(x,y);const final=await until(v=>v?.client.session.io.writes===9+finish.battle_keepalives_verified);await page.screenshot({path:join(qa,label+'-returned.png')});
      assert.deepEqual(errors,[]);assert.equal(final.frameError,null);await page.locator('#game-disconnect').click();const receipt=await peer.receipt();checkReceipt(receipt,finish.battle_keepalives_verified);
      console.log(JSON.stringify({stage:296,surface:mobile?'mobile-web':'desktop-web',cut,fixture:peer.fixture,files:1072,url:bridge.origin+'/web/game.html',title:'Moli · 游戏',viewport:mobile?[390,844]:[1100,850],
        round:result.battle.round,vitals:vitals(result.battle),battlePresentations:result.battle.presentations,returnedPresentations:returned.canvas.presentations,frameError:null,receipt,errors,warnings,
        notBlank:true,noOverlay:true,artworkUnchanged:true,browserAvailability:'Browser plugin not available',nativeAcceptance:false}));
    }finally{await browser?.close();await bridge?.close();await peer?.close();}
  });
}else{
  const {environment,until,cleared,event,variant}=await import('../game-wechat-page-v1/page-test.mjs');
  test('actual material battle Page '+variant+' CUT'+cut,{timeout:90000},async()=>{
    const peer=await actualBattlePeer({flow:1,cut}),env=environment(peer,[],undefined,archive),page=env.startPage();
    try{
      await until(page,v=>v.canvasReady);env.select(selection());assert.equal(await page.onStartup(),true);assert.equal(await page.onResources(),true);assert.equal(page.data.resourceCount,1072);
      const started=page.onConnect();await until(page,v=>v.state==='choosing');await page.onCharacter(event({action:'upgrade'}));await until(page,v=>v.versionState==='upgrade-success');await page.onCharacter(event({action:'version-back'}));await until(page,v=>v.state==='choosing'&&v.characters[1]?.options.previous);await page.onCharacter(event({action:'appearance',slot:'1',direction:'3'}));const entered=page.onCharacter(event({action:'enter',slot:'1'}));
      await until(page,v=>v.state==='playing'&&v.hasFrame&&v.canTouch,12000);await entered;await started;const sceneFrames=env.frames.length;peer.release();await until(page,v=>v.battle?.ready&&v.battle.actors.length===2,12000);
      assert.equal(page.onBattle(event({action:'command',value:'guard'})),true);const result=(await until(page,v=>settled(v.battle),18000)).battle;assert.deepEqual(vitals(result),[[0,70,100,5,10],[10,58,100,10,10]]);
      const finish=await peer.finishBattle();await until(page,v=>v.state==='playing'&&!v.battle&&v.hasFrame&&v.canTouch,12000);const returnFrames=env.frames.length;env.touch(page,'start',260,105);env.touch(page,'end',260,105);await until(page,()=>env.stats.writes.length===9+finish.battle_keepalives_verified,12000);
      assert.equal(env.stats.created,1);assert.ok(env.frames.slice(sceneFrames,returnFrames).some(f=>f.nonzero));page.onDisconnect();cleared(env,page);const receipt=await peer.receipt();checkReceipt(receipt,finish.battle_keepalives_verified);
      console.log(JSON.stringify({stage:296,surface:'Page-'+variant,cut,fixture:peer.fixture,files:1072,round:result.round,vitals:vitals(result),sceneFrames,returnFrames,frames:env.frames.length,
        readBytes:env.reads.filter(r=>r.filePath.endsWith('-zip')).reduce((n,r)=>n+r.length,0),receipt,artworkUnchanged:true,nativeAcceptance:false}));
    }finally{page.onUnload();await peer.close();}
  });
}
