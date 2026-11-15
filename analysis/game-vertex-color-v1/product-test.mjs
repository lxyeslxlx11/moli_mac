/** Actual ARGB animation with a real CUT/AUT pair andauthored local scene. */
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,mkdirSync} from 'node:fs';
import {createRequire} from 'node:module';
import {resolve,join} from 'node:path';
import {setTimeout as sleep} from 'node:timers/promises';
import {createLauncherLoopbackServer} from '../../adapters/node/launcher-loopback.mjs';
import {startup} from '../../web/tests/helpers/legacy-game-client-fixture.mjs';
import {vertexPeer} from './peer.mjs';
const profile=JSON.parse(readFileSync(new URL('../game-legacy-material-compat-v1/material-profile.json',import.meta.url))),archive=resolve(profile.archive),mode=process.env.MOLI_MATERIAL_HOST??'web',animated=true;
const scenario=process.env.MOLI_VERTEX_SCENARIO??'alpha',cutSelector=scenario==='alpha'?59510:59526,aut=readFileSync('build/analysis/game-legacy-resource-archive-v1/material-root/Bin/Puk2/cutdat/'+cutSelector+'.Aut');
let cell=0;while(cell<144&&!aut.subarray(cell*3,cell*3+3).some(v=>v))cell++;if(cell===144)cell=0;const rgb=[...aut.subarray(cell*3,cell*3+3)];if(!rgb.some(v=>v))rgb[2]=1;const expected=[...rgb,255];
function samplePoint(zoom){const n=[107,54,27][zoom],x=cell%12-2+Math.trunc(n/2),y=Math.floor(cell/12)-3+Math.trunc(n/2);return [640-(4*n+2)-12+1+2*(x+y),12+n+1-x+y];}
function selection(){const r=startup();r.context='legacy-se6000-37c4';r.resourceParametersHex=Buffer.from(profile.parameters).toString('hex');return new Uint8Array(Buffer.from(JSON.stringify(r)));}
const qa='/tmp/moli-stage294-qa';mkdirSync(qa,{recursive:true});
if(mode==='web'){
 const {chromium}=createRequire(import.meta.url)(resolve('build/dependencies/playwright-core-1.64.1/node_modules/playwright-core'));
 for(const checksumMode of [1])for(const mobile of [false,true])test('actual ARGB '+(mobile?'mobile':'desktop')+' mode'+checksumMode,{timeout:60000},async()=>{
  let peer,bridge,browser;const label=(mobile?'mobile':'desktop')+'-'+scenario+'-mode'+checksumMode;
  try{
   peer=await vertexPeer({checksumMode,animated,scenario});bridge=await createLauncherLoopbackServer({sourceProfile:'legacy',gameCode:2,label:'Original minimap peer',endpoints:[{address:'127.0.0.1',port:peer.port}],lifetimeMilliseconds:60000});browser=await chromium.launch({channel:'chrome',headless:true});
   const context=await browser.newContext({viewport:mobile?{width:390,height:844}:{width:1100,height:850},isMobile:mobile,hasTouch:mobile}),page=await context.newPage(),errors=[],warnings=[];
   page.on('console',m=>{if(m.type()==='error')errors.push(m.text());if(m.type()==='warning')warnings.push(m.text());});page.on('pageerror',e=>errors.push(e.message));
   await page.goto(bridge.origin+'/web/game.html');await page.waitForFunction(()=>!document.querySelector('#game-archive').disabled);assert.equal(await page.title(),'Moli · 游戏');assert.equal(new URL(page.url()).origin,bridge.origin);assert.ok((await page.locator('body').innerText()).includes('游戏资源 ZIP'));assert.equal(await page.locator('vite-error-overlay,nextjs-portal').count(),0);
   assert.deepEqual(await page.evaluate(()=>({scrollY,overflow:document.documentElement.scrollWidth>innerWidth})),{scrollY:0,overflow:false});await page.screenshot({path:join(qa,label+'-initial.png')});
   await page.locator('#game-startup').setInputFiles({name:'original-startup.json',mimeType:'application/json',buffer:Buffer.from(selection())});await page.locator('#game-archive').setInputFiles(archive);await page.locator('#game-connect').click();
   const inspect=()=>page.evaluate(async()=>(await import('/web/game-app.mjs')).inspectGamePage().view);
   async function until(predicate){let v;for(let i=0;i<700;i++){v=await inspect();if(predicate(v))return v;if(v?.client.errorCode)throw Error(v.client.errorCode);await sleep(20);}assert.fail('Expected minimap view: '+JSON.stringify(v));}
   await until(v=>v?.client.state==='choosing');await page.getByRole('button',{name:'请求版本升级',exact:true}).click();await page.getByRole('button',{name:'返回人物列表',exact:true}).click();await page.getByRole('button',{name:'下一外观 OriginalA',exact:true}).click();await page.getByRole('button',{name:'进入 OriginalA',exact:true}).click();
   const first=await until(v=>v?.client.state==='playing'&&v.canvas?.presentations>2);assert.ok(first.client.library.namedPaletteEntries>0);assert.ok(first.client.library.stats.namedPalettesDecoded>0);
   await page.locator('#game-minimap').click();
   const snapshots=[];
   for(const zoom of [1,2,0]){
    const view=await until(v=>v?.minimap?.state==='ready'&&v.minimap.zoom===zoom&&v.minimap.presentations>0);
    const canvas=page.locator('#game-canvas');await canvas.scrollIntoViewIfNeeded();await sleep(80);
    const pixel=await canvas.evaluate((node,p)=>Array.from(node.getContext('2d').getImageData(...p,1,1).data),samplePoint(zoom));if(checksumMode===1)assert.deepEqual(pixel,expected,'actual AUT reaches Canvas');
    assert.equal(view.frameError,null);assert.equal(view.minimap.mode,checksumMode);snapshots.push({zoom,width:view.minimap.width,pixel});
    assert.equal(await page.locator('#game-minimap-range').innerText(),'范围 '+[107,54,27][zoom]+' 格');
    if(zoom===1){await page.locator('#game-minimap-range').scrollIntoViewIfNeeded();assert.equal(await page.locator('#game-minimap-range').isVisible(),true);await page.screenshot({path:join(qa,label+'-scene.png')});await page.locator('#game-minimap').click();await until(v=>!v?.minimap);await sleep(100);await page.locator('#game-canvas').scrollIntoViewIfNeeded();await page.screenshot({path:join(qa,label+'-animation.png')});await page.locator('#game-minimap').click();await until(v=>v?.minimap?.state==='ready');}
    if(zoom!==0)await page.locator('#game-minimap-range').click();
   }
   await page.locator('#game-minimap').click();assert.equal((await inspect()).minimap,undefined);await page.locator('#game-minimap').click();await until(v=>v?.minimap?.state==='ready'&&v.minimap.presentations>3);
   const canvas=page.locator('#game-canvas');await canvas.scrollIntoViewIfNeeded();const box=await canvas.boundingBox(),x=box.x+box.width*416/640,y=box.y+box.height*168/480;if(mobile)await page.touchscreen.tap(x,y);else await page.mouse.click(x,y);
   peer.release();const final=await until(v=>v?.client.sceneRevision===2&&v.minimap?.state==='ready'&&v.canvas?.presentations>1);assert.equal(final.client.state,'playing');assert.deepEqual(errors,[]);
   await page.locator('#game-disconnect').click();const receipt=await peer.receipt();assert.equal(receipt.total_client_requests,7);assert.equal(receipt.movement_requests_verified,2);assert.ok(receipt.scene_reloaded);
   console.log(JSON.stringify({stage:294,label,url:bridge.origin+'/web/game.html',title:'Moli · 游戏',files:1072,selector:checksumMode===1?cutSelector:null,scenario,checksumMode,snapshots,sceneRevision:2,receipt,consoleErrors:0,warnings,notBlank:true,noOverlay:true,screenshot:join(qa,label+'-scene.png'),browserAvailability:'Browser plugin not available',official:false}));
  }finally{await browser?.close();await bridge?.close();await peer?.close();}
 });
}else{
 const {environment,until,cleared,event,variant}=await import('../game-wechat-page-v1/page-test.mjs');
 for(const checksumMode of [1])test('actual ARGB Page '+variant+' mode'+checksumMode,{timeout:60000},async()=>{
  const peer=await vertexPeer({flow:1,checksumMode,animated:true,scenario}),env=environment(peer,[],undefined,archive),samples=[];let zoom=1;
  const make=env.wx.createSelectorQuery;env.wx.createSelectorQuery=function(){const query=make(),exec=query.exec;query.exec=function(callback){return exec.call(this,rows=>{const context=rows?.[0]?.node?.getContext('2d');if(context&&!context.minimapWrapped){const put=context.putImageData;context.minimapWrapped=true;context.putImageData=function(image,...args){const [x,y]=samplePoint(zoom),at=(y*image.width+x)*4;samples.push({zoom,pixel:[...image.data.slice(at,at+4)]});return put.call(this,image,...args);};}callback(rows);});};return query;};
  const page=env.startPage();
  try{
   await until(page,v=>v.canvasReady);env.select(selection());assert.equal(await page.onStartup(),true);assert.equal(await page.onResources(),true);const started=page.onConnect();await until(page,v=>v.state==='choosing');await page.onCharacter(event({action:'upgrade'}));await until(page,v=>v.versionState==='upgrade-success');await page.onCharacter(event({action:'version-back'}));await until(page,v=>v.state==='choosing'&&v.characters[1]?.options.previous);await page.onCharacter(event({action:'appearance',slot:'1',direction:'3'}));const entered=page.onCharacter(event({action:'enter',slot:'1'}));await until(page,v=>v.state==='playing'&&v.hasFrame&&v.canTouch);await entered;await started;
   assert.equal(page.onMinimap(),true);
   const results=[];
   for(const next of [1,2,0]){zoom=next;await until(page,v=>v.minimap?.state==='ready'&&v.minimap.zoom===zoom);await sleep(100);const sample=samples.at(-1);assert.equal(sample.zoom,zoom);if(checksumMode===1)assert.deepEqual(sample.pixel,expected);results.push(sample);if(zoom!==0)assert.equal(page.onMinimapRange(),true);}
   assert.equal(page.onMinimap(),true);assert.equal(page.data.minimap,null);assert.equal(page.onMinimap(),true);await until(page,v=>v.minimap?.state==='ready');await sleep(80);
   const states=[],set=page.setData;page.setData=function(patch,done){if(patch.state)states.push(patch.state);return set.call(this,patch,done);};env.touch(page,'start',260,105);env.touch(page,'end',260,105);await until(page,()=>env.stats.writes.length===7);peer.release();await until(page,v=>v.state==='playing'&&v.minimap?.state==='ready'&&states.includes('preparing-scene')&&v.canTouch);
   assert.ok(env.frames.some(r=>r.width===640&&r.height===480&&r.nonzero));page.onDisconnect();cleared(env,page);const receipt=await peer.receipt();assert.equal(receipt.total_client_requests,7);assert.equal(receipt.movement_requests_verified,2);assert.ok(receipt.scene_reloaded);
   console.log(JSON.stringify({stage:294,label:'Page-'+variant+'-'+scenario+'-mode'+checksumMode,files:1072,checksumMode,selector:checksumMode===1?cutSelector:null,scenario,results,frames:env.frames.length,receipt,nativeAcceptance:false,official:false}));
  }finally{page.onUnload();await peer.close();}
 });
}
