/** Actual unchanged material through city request, held reply, transfer, captured fades and movement. */
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,mkdirSync} from 'node:fs';
import {createRequire} from 'node:module';
import {resolve,join} from 'node:path';
import {setTimeout as sleep} from 'node:timers/promises';
import {createLauncherLoopbackServer} from '../../adapters/node/launcher-loopback.mjs';
import {startup} from '../../web/tests/helpers/legacy-game-client-fixture.mjs';
import {cityWaterPeer} from './peer.mjs';
const profile=JSON.parse(readFileSync(new URL('../game-legacy-material-compat-v1/material-profile.json',import.meta.url))),archive=resolve(profile.archive),host=process.env.MOLI_CITY_HOST??'web',route=process.env.MOLI_CITY_ROUTE??'scene',qa='/tmp/moli-stage300-qa';mkdirSync(qa,{recursive:true});
const battle=route.startsWith('battle-'),transfer=['scene','battle-transfer','battle-late'].includes(route),requests=route==='boundary'||route==='battle-late'?3:battle?2:1;
function selection(){const v=startup();v.context='legacy-se6000-37c4';v.resourceParametersHex=Buffer.from(profile.parameters).toString('hex');return Buffer.from(JSON.stringify(v));}
function receipt(r){assert.equal(r.total_client_requests,9+requests);assert.equal(r.city_return_verified,true);assert.equal(r.city_return_requests,requests);assert.equal(r.movement_requests_verified,4);assert.equal(r.entry_request_verified,true);assert.equal(r.scene_reloaded,transfer);assert.equal(r.official_session,false);}
if(host==='web'){
 const {chromium}=createRequire(import.meta.url)(resolve('build/dependencies/playwright-core-1.64.1/node_modules/playwright-core'));
 for(const mobile of [false,true])test('actual material city '+route+' '+(mobile?'mobile':'desktop'),{timeout:120000},async()=>{
  let peer,bridge,browser;const label=(mobile?'mobile':'desktop')+'-'+route;
  try{
   peer=await cityWaterPeer(route);bridge=await createLauncherLoopbackServer({sourceProfile:'legacy',gameCode:2,label:'Original city water material',endpoints:[{address:'127.0.0.1',port:peer.port}],lifetimeMilliseconds:60000});
   browser=await chromium.launch({channel:'chrome',headless:true});const context=await browser.newContext({viewport:mobile?{width:390,height:844}:{width:1100,height:850},isMobile:mobile,hasTouch:mobile}),page=await context.newPage(),errors=[],warnings=[];
   page.on('console',m=>{if(m.type()==='error')errors.push(m.text());if(m.type()==='warning')warnings.push(m.text());});page.on('pageerror',e=>errors.push(e.message));
   await page.goto(bridge.origin+'/web/game.html');await page.waitForFunction(()=>!document.querySelector('#game-archive').disabled);assert.equal(await page.title(),'Moli · 游戏');assert.ok((await page.locator('body').innerText()).includes('游戏资源 ZIP'));assert.equal(await page.locator('vite-error-overlay,nextjs-portal').count(),0);assert.deepEqual(await page.evaluate(()=>({scrollY,overflow:document.documentElement.scrollWidth>innerWidth})),{scrollY:0,overflow:false});await page.screenshot({path:join(qa,label+'-initial.png')});
   await page.locator('#game-startup').setInputFiles({name:'original-startup.json',mimeType:'application/json',buffer:selection()});await page.locator('#game-archive').setInputFiles(archive);await page.locator('#game-connect').click();
   const inspect=()=>page.evaluate(async()=>(await import('/web/game-app.mjs')).inspectGamePage().view);
   async function until(predicate){let v;for(let i=0;i<3500;i++){v=await inspect();if(predicate(v))return v;if(v?.client.errorCode||v?.frameError||v?.battle?.blocked)throw Error(JSON.stringify(v));await sleep(20);}assert.fail('City view '+JSON.stringify(v)+' '+peer.diagnostics());}
   await until(v=>v?.client.state==='choosing');await page.getByRole('button',{name:'请求版本升级',exact:true}).click();await page.getByRole('button',{name:'返回人物列表',exact:true}).click();await page.getByRole('button',{name:'下一外观 OriginalA',exact:true}).click();await page.getByRole('button',{name:'进入 OriginalA',exact:true}).click();
   const scene=await until(v=>v?.client.state==='playing'&&v.canvas?.presentations>2);assert.equal(scene.files.files,1072);assert.ok(scene.client.library.stats.imagesDecoded>0);const canvas=page.locator('#game-canvas');await canvas.scrollIntoViewIfNeeded();await page.screenshot({path:join(qa,label+'-scene.png')});
   async function walk(){await canvas.scrollIntoViewIfNeeded();const box=await canvas.boundingBox(),x=box.x+box.width*416/640,y=box.y+box.height*168/480;if(mobile)await page.touchscreen.tap(x,y);else await page.mouse.click(x,y);}
   await walk();const moved=await until(v=>v?.client.session.io.writes===7);peer.release();const before=battle?await until(v=>v?.battle?.actors.length===2&&v.client.canReturnToCity):moved;await canvas.scrollIntoViewIfNeeded();await page.screenshot({path:join(qa,label+'-before.png')});
   await page.evaluate(()=>{const c=document.querySelector('#game-canvas').getContext('2d'),put=c.putImageData;globalThis.__moliCityPaints=0;c.putImageData=function(...args){globalThis.__moliCityPaints++;return Reflect.apply(put,this,args);};});
   await page.locator('#game-return-city').click();await peer.waitReturnRequest();assert.equal(await page.locator('#game-return-city').isDisabled(),true);
   if(!battle){const a=await page.evaluate(()=>globalThis.__moliCityPaints);await sleep(150);const b=await inspect();assert.equal(b.client.cityReturn.phase,'awaiting-server');assert.ok(await page.evaluate(()=>globalThis.__moliCityPaints)>a,'ordinary image continues while reply is parked');}
   await peer.checkReturnParked();if(battle)await peer.waitCityBoundary(requests-1);
   if(transfer){await until(v=>v?.client.cityReturn?.phase==='waiting-map'&&v.client.cityReturn.leftFrames===50);await sleep(140);assert.equal(await page.locator('#game-return-city').isDisabled(),true);await page.screenshot({path:join(qa,label+'-waiting.png')});peer.supplyCityMap();}
   const returned=await until(v=>v?.client.state==='playing'&&v.client.runtimeRevision>before.client.runtimeRevision&&v.canvas?.presentations>0);assert.equal(returned.client.session.io.opensCompleted,1);assert.equal(returned.client.sceneRevision,transfer?2:1);await walk();await until(v=>v?.client.session.io.writes===9+requests);await page.screenshot({path:join(qa,label+'-returned.png')});assert.deepEqual(errors,[]);assert.deepEqual(warnings,[]);await page.locator('#game-disconnect').click();const r=await peer.receipt();receipt(r);
   console.log(JSON.stringify({stage:300,surface:mobile?'mobile-web':'desktop-web',route,fixture:peer.fixture,files:1072,url:bridge.origin+'/web/game.html',title:'Moli · 游戏',viewport:mobile?[390,844]:[1100,850],waitingServerRendered:!battle,mapWaitVerified:transfer,sameConnection:true,resumedMovement:true,receipt:r,errors,warnings,notBlank:true,noOverlay:true,nativeAcceptance:false}));
  }finally{await browser?.close();await bridge?.close();await peer?.close();}
 });
}else{
 const {environment,until,cleared,event,variant}=await import('../game-wechat-page-v1/page-test.mjs');
 test('actual material city '+route+' Page '+variant,{timeout:120000},async()=>{
  const peer=await cityWaterPeer(route,1),env=environment(peer,[],undefined,archive),page=env.startPage();
  const mark=step=>{if(process.env.MOLI_CITY_TRACE)console.log(JSON.stringify({cityTrace:step,route,variant,state:page.data.state,error:page.data.errorCode,writes:env.stats.writes.length,frames:env.frames.length,canReturn:page.data.canReturnToCity,diagnostics:peer.diagnostics()}));};
  try{
   await until(page,v=>v.canvasReady);env.select(selection());assert.equal(await page.onStartup(),true);assert.equal(await page.onResources(),true);assert.equal(page.data.resourceCount,1072);const start=page.onConnect();await until(page,v=>v.state==='choosing');await page.onCharacter(event({action:'upgrade'}));await until(page,v=>v.versionState==='upgrade-success');await page.onCharacter(event({action:'version-back'}));await until(page,v=>v.state==='choosing'&&v.characters[1]?.options.previous);await page.onCharacter(event({action:'appearance',slot:'1',direction:'3'}));const entered=page.onCharacter(event({action:'enter',slot:'1'}));await until(page,v=>v.state==='playing'&&v.hasFrame&&v.canTouch,18000);await entered;await start;
   mark('entered');env.touch(page,'start',260,105);env.touch(page,'end',260,105);await until(page,()=>env.stats.writes.length===7,18000);peer.release();mark('moved/released');if(battle)await until(page,v=>v.battle?.actors.length===2&&v.canReturnToCity,18000);mark('ready');
   const before=env.frames.length;page.onReturnToCity();mark('requested');await peer.waitReturnRequest();mark('request-receipt');assert.equal(page.data.canTouch,false);assert.equal(page.data.connected,true);if(!battle)await until(page,()=>env.frames.length>=before+3,18000);await peer.checkReturnParked();mark('reply-released');if(battle)await peer.waitCityBoundary(requests-1);mark('boundary');
   if(transfer){const waitFrames=route==='battle-transfer'?80:route==='battle-late'?105:55;await until(page,()=>env.frames.length>=before+waitFrames&&env.frames.slice(-5).every(f=>!f.nonzero),18000);assert.equal(page.data.state,'returning-city');peer.supplyCityMap();}
   await until(page,v=>v.state==='playing'&&v.hasFrame&&v.canTouch,18000);const returned=env.frames.length;env.touch(page,'start',260,105);env.touch(page,'end',260,105);await until(page,()=>env.stats.writes.length===9+requests,18000);assert.equal(env.stats.created,1);assert.ok(env.frames.slice(before,returned).some(f=>f.nonzero));page.onDisconnect();cleared(env,page);const r=await peer.receipt();receipt(r);
   console.log(JSON.stringify({stage:300,surface:'Page-'+variant,route,fixture:peer.fixture,files:1072,sceneFrames:before,returnedFrames:returned,frames:env.frames.length,waitingServerRendered:!battle,mapWaitVerified:transfer,sameConnection:true,resumedMovement:true,receipt:r,nativeAcceptance:false}));
  }finally{page.onUnload();await peer.close();}
 });
}
