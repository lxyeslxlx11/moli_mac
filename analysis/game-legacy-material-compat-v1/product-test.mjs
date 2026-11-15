/** Real selected material over an authored local scene; never a claim of official-server acceptance. */
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,mkdirSync} from 'node:fs';
import {createRequire} from 'node:module';
import {resolve,join} from 'node:path';
import {setTimeout as sleep} from 'node:timers/promises';
import {createLauncherLoopbackServer} from '../../adapters/node/launcher-loopback.mjs';
import {startup} from '../../web/tests/helpers/legacy-game-client-fixture.mjs';
import {materialPeer} from './peer.mjs';
const profile=JSON.parse(readFileSync(new URL('./material-profile.json',import.meta.url)));
const archive=resolve(process.env.MOLI_MATERIAL_ARCHIVE??profile.archive);
const mode=process.env.MOLI_MATERIAL_HOST??'web',negative=process.env.MOLI_MATERIAL_MISSING_CUT==='1';
assert.ok(['web','wechat'].includes(mode));
function selection(){const r=startup();r.context='legacy-se6000-37c4';r.resourceParametersHex=Buffer.from(profile.parameters).toString('hex');return new Uint8Array(Buffer.from(JSON.stringify(r)));}
const qa='/tmp/moli-stage290-qa';mkdirSync(qa,{recursive:true});
if(mode==='web'){
 const {chromium}=createRequire(import.meta.url)(resolve('build/dependencies/playwright-core-1.64.1/node_modules/playwright-core'));
 for(const mobile of negative?[false]:[false,true])test('actual material '+(negative?'missing CUT':mobile?'mobile':'desktop')+' selection,scene and movement',{timeout:45000},async()=>{
  let peer,bridge,browser;
  const label=negative?'missing-cut':mobile?'mobile':'desktop';
  try{
   peer=await materialPeer({checksumMode:negative?1:0});
   bridge=await createLauncherLoopbackServer({sourceProfile:'legacy',gameCode:2,label:'Original peer with selected material',endpoints:[{address:'127.0.0.1',port:peer.port}],lifetimeMilliseconds:45000});
   browser=await chromium.launch({channel:'chrome',headless:true});
   const context=await browser.newContext({viewport:mobile?{width:390,height:844}:{width:1100,height:850},isMobile:mobile,hasTouch:mobile});
   const page=await context.newPage(),errors=[];
   page.on('console',m=>{if(['error','warning'].includes(m.type()))errors.push(m.text());});page.on('pageerror',e=>errors.push(e.message));
   await page.goto(bridge.origin+'/web/game.html');await page.waitForFunction(()=>!document.querySelector('#game-archive').disabled);
   assert.equal(await page.title(),'Moli · 游戏');assert.equal(new URL(page.url()).origin,bridge.origin);
   assert.ok((await page.locator('body').innerText()).includes('游戏资源 ZIP'));assert.equal(await page.locator('vite-error-overlay,nextjs-portal').count(),0);
   assert.deepEqual(await page.evaluate(()=>({scrollY,overflow:document.documentElement.scrollWidth>innerWidth})),{scrollY:0,overflow:false});
   await page.screenshot({path:join(qa,label+'-initial.png'),fullPage:false});
   await page.locator('#game-startup').setInputFiles({name:'original-startup.json',mimeType:'application/json',buffer:Buffer.from(selection())});
   await page.locator('#game-archive').setInputFiles(archive);await page.locator('#game-connect').click();
   const inspect=()=>page.evaluate(async()=>(await import('/web/game-app.mjs')).inspectGamePage().view);
   async function until(predicate){let v;for(let i=0;i<450;i++){v=await inspect();if(predicate(v))return v;if(v?.client.errorCode)throw Error(v.client.errorCode);await sleep(20);}assert.fail('No expected view: '+JSON.stringify(v));}
   const chosen=await until(v=>v?.client.state==='choosing');assert.equal(chosen.files.files,1072);
   assert.equal(chosen.client.library.state,'ready');
   await page.getByRole('button',{name:'请求版本升级',exact:true}).click();await page.getByRole('button',{name:'返回人物列表',exact:true}).click();
   await page.getByRole('button',{name:'下一外观 OriginalA',exact:true}).click();await page.getByRole('button',{name:'进入 OriginalA',exact:true}).click();
   if(negative){
    let failed;for(let i=0;i<450;i++){failed=await inspect();if(failed?.client.state==='failed')break;await sleep(20);}
    assert.equal(failed.client.errorCode,'LEGACY_ASSET_REQUIRED_FILE');assert.equal(failed.presentations,0);
    await page.screenshot({path:join(qa,label+'-result.png'),fullPage:false});assert.deepEqual(errors,[]);
    console.log(JSON.stringify({actualMaterial:true,label,missingCUT:true,errorCode:failed.client.errorCode,presentations:0,consoleErrors:0,official:false}));return;
   }
   let active=await until(v=>v?.client.state==='playing'&&v.canvas?.presentations>1);
   const canvas=page.locator('#game-canvas');await canvas.scrollIntoViewIfNeeded();
   const pixels=await canvas.evaluate(async node=>{const b=node.getContext('2d').getImageData(0,0,node.width,node.height).data;return {width:node.width,height:node.height,nonzero:b.some(x=>x!==0),sha256:Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',b)),x=>x.toString(16).padStart(2,'0')).join('')};});
   assert.deepEqual([pixels.width,pixels.height,pixels.nonzero],[640,480,true]);
   await page.screenshot({path:join(qa,label+'-scene.png'),fullPage:false});
   const box=await canvas.boundingBox(),x=box.x+box.width*416/640,y=box.y+box.height*168/480;
   if(mobile)await page.touchscreen.tap(x,y);else await page.mouse.click(x,y);
   peer.release();active=await until(v=>v?.client.state==='playing'&&v.client.sceneRevision===2&&v.canvas?.presentations>0);
   assert.equal(active.frameError,null);assert.deepEqual(errors,[]);
   await page.locator('#game-disconnect').click();const receipt=await peer.receipt();
   assert.equal(receipt.total_client_requests,7);assert.equal(receipt.movement_requests_verified,2);assert.ok(receipt.scene_reloaded);assert.equal(receipt.official_session,false);
   console.log(JSON.stringify({actualMaterial:true,label,url:bridge.origin+'/web/game.html',title:'Moli · 游戏',files:1072,checksumMode:0,pixels,sceneRevision:2,receipt,consoleErrors:0,notBlank:true,noOverlay:true,screenshot:join(qa,label+'-scene.png'),browserAvailability:'Browser plugin not available'}));
  }finally{await browser?.close();await bridge?.close();await peer?.close();}
 });
}else{
 const {environment,until,cleared,event,variant}=await import('../game-wechat-page-v1/page-test.mjs');
 test('actual material WeChat '+variant+' selection,scene and movement',{timeout:45000},async()=>{
  const peer=await materialPeer({flow:1}),env=environment(peer,[],undefined,archive),page=env.startPage();
  try{
   await until(page,v=>v.canvasReady);env.select(selection());assert.equal(await page.onStartup(),true);assert.equal(await page.onResources(),true,page.data.status);
   assert.equal(page.data.resourceCount,1072);const initialBytes=env.reads.filter(r=>r.filePath.endsWith('-zip')).reduce((n,r)=>n+r.length,0);assert.ok(initialBytes<1048576);
   const started=page.onConnect();await until(page,v=>v.state==='choosing');await page.onCharacter(event({action:'upgrade'}));await until(page,v=>v.versionState==='upgrade-success');
   await page.onCharacter(event({action:'version-back'}));await until(page,v=>v.state==='choosing'&&v.characters[1]?.options.previous);
   await page.onCharacter(event({action:'appearance',slot:'1',direction:'3'}));const entered=page.onCharacter(event({action:'enter',slot:'1'}));
   await until(page,v=>v.state==='playing'&&v.hasFrame&&v.canTouch);assert.equal(await entered,true);await started;await sleep(300);
   const before=env.frames.length;assert.ok(env.frames.some(r=>r.width===640&&r.height===480&&r.nonzero));
   env.touch(page,'start',260,105);env.touch(page,'end',260,105);await until(page,()=>env.stats.writes.length===7);
   const states=[],set=page.setData;page.setData=function(patch,done){if(patch.state)states.push(patch.state);return set.call(this,patch,done);};
   peer.release();await until(page,v=>v.state==='playing'&&v.canTouch&&states.includes('preparing-scene')&&env.frames.length>before);
   const finalFrame=env.frames.at(-1),reads=env.reads.filter(r=>r.filePath.endsWith('-zip'));
   assert.ok(reads.some(r=>r.position>2147483647));page.onDisconnect();cleared(env,page);const receipt=await peer.receipt();
   assert.equal(receipt.total_client_requests,7);assert.equal(receipt.movement_requests_verified,2);assert.ok(receipt.scene_reloaded);
   console.log(JSON.stringify({actualMaterial:true,label:'wechat-'+variant,files:1072,checksumMode:0,initialBytes,readBytes:reads.reduce((n,r)=>n+r.length,0),largeOffset:true,frames:env.frames.length,finalFrame,receipt,nativeAcceptance:false}));
  }finally{page.onUnload();await peer.close();}
 });
}
