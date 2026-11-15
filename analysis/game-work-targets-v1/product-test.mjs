/** Actual resource ZIP -> real controls -> original localhost target/gather peer. */
import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdirSync,readFileSync,writeFileSync} from 'node:fs';
import {resolve,join} from 'node:path';
import {createRequire} from 'node:module';
import {setTimeout as sleep} from 'node:timers/promises';
import {createLauncherLoopbackServer} from '../../adapters/node/launcher-loopback.mjs';
import {startup} from '../../web/tests/helpers/legacy-game-client-fixture.mjs';
import {workPeer} from './peer.mjs';
const surface=process.env.MOLI_WORK_SURFACE??'web';
const profile=JSON.parse(readFileSync(resolve('analysis/game-legacy-material-compat-v1/material-profile.json')));
const archive=resolve(profile.archive),qa='/tmp/moli-stage305-qa';mkdirSync(qa,{recursive:true});
function selection(){const v=startup();v.context='legacy-se6000-37c4';v.resourceParametersHex=Buffer.from(profile.parameters).toString('hex');return Buffer.from(JSON.stringify(v));}
function receipt(r){assert.equal(r.requests,37);for(const k of ['twoStageTargets','petHoleOrdinal','allFourTargetModes','MPGuard','gatherRepeat','pause','threeGatherPoses','cancelled','sameConnection'])assert.equal(r[k],true);assert.equal(r.officialSession,false);}
async function flow(d,peer){
  await d.open(0);await d.phase('people');await d.act('person',0);await d.phase('result');await d.lines(/变装失败了/);await d.act('close');
  await d.open(1);await d.phase('people');await d.act('person',0);await d.phase('subjects');await d.lines(/Fox/);await d.shot('subjects');
  await d.act('subject',0);await d.phase('result');await d.lines(/变身成功了/);await d.act('close');
  await d.open(2);await d.phase('people');await d.act('person',0);await d.phase('subjects');await d.act('subject',1);await d.phase('result');
  await peer.stage('aid-low-mp');await d.retry(false);await d.lines(/生命值恢复了 15/);await d.shot('aid');peer.release('restore-mp');await d.retry(true);
  await d.act('retry');await d.phase('people');await d.act('person',1);await d.phase('subjects');await d.act('subject',1);await d.phase('result');await d.lines(/急救失败了/);await d.act('close');
  await d.open(3);await d.phase('people');await d.act('person',1);await d.phase('subjects');await d.act('subject',0);await d.phase('result');await d.lines(/伤势恶化了/);await d.shot('treatment');
  await d.act('retry');await d.phase('people');await d.act('person',2);await d.phase('result');await d.lines(/伤势全部恢复了/);await d.act('close');
  await d.open(4);await d.phase('working');await peer.stage('gather-success');await d.phase('result');await d.lines(/Local ore/);await d.retry(false);await d.shot('gather');
  await peer.stage('gather-second');await d.phase('awaiting');await d.act('pause');await d.phase('paused');peer.release('paused');await d.phase('result');await d.lines(/什么都没发现/);await d.phase('paused');await d.shot('paused');
  await d.act('retry');await d.phase('working');await d.act('close');
  for(const slot of [5,6]){await d.open(slot);await d.phase('working');await d.act('close');}
  await peer.stage('cancelled');await sleep(80);await d.closed();
}
if(surface==='web'){
  const {chromium}=createRequire(import.meta.url)(resolve('build/dependencies/playwright-core-1.64.1/node_modules/playwright-core'));
  for(const mobile of [false,true])test('stage305 ordinary targets and gathering '+(mobile?'touch web':'desktop web'),{timeout:180000},async()=>{
    let peer,bridge,browser;const label=mobile?'mobile':'desktop';
    try{
      peer=await workPeer();bridge=await createLauncherLoopbackServer({sourceProfile:'legacy',gameCode:2,label:'Original work targets peer',endpoints:[{address:'127.0.0.1',port:peer.port}],lifetimeMilliseconds:60000});
      browser=await chromium.launch({channel:'chrome',headless:true});const context=await browser.newContext({viewport:mobile?{width:390,height:844}:{width:1100,height:850},isMobile:mobile,hasTouch:mobile}),page=await context.newPage(),errors=[],warnings=[];
      page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());if(m.type()==='warning')warnings.push(m.text());});
      const click=l=>mobile?l.tap():l.click(),url=bridge.origin+'/web/game.html';await page.goto(url);await page.waitForFunction(()=>!document.querySelector('#game-archive').disabled);
      assert.equal(await page.title(),'Moli · 游戏');assert.ok((await page.locator('body').innerText()).includes('游戏资源 ZIP'));assert.equal(await page.locator('vite-error-overlay,nextjs-portal').count(),0);assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
      await page.locator('#game-startup').setInputFiles({name:'original-startup.json',mimeType:'application/json',buffer:selection()});await page.locator('#game-archive').setInputFiles(archive);await click(page.locator('#game-connect'));
      const inspect=()=>page.evaluate(async()=>(await import('/web/game-app.mjs')).inspectGamePage().view);
      const until=async predicate=>{let v;for(let i=0;i<6000;i++){v=await inspect();if(predicate(v))return v;if(v?.client?.errorCode||v?.frameError)throw Error(JSON.stringify(v));await sleep(15);}assert.fail(JSON.stringify(v)+' '+peer.diagnostics());};
      await until(v=>v?.client.state==='choosing');for(const name of ['请求版本升级','返回人物列表','下一外观 OriginalA','进入 OriginalA'])await click(page.getByRole('button',{name,exact:true}));
      const entered=await until(v=>v?.client.state==='playing'&&v.canvas?.presentations>2);assert.equal(entered.files.files,1072);assert.ok(entered.client.library.stats.imagesDecoded>0);await peer.stage('ready');
      const dialog=page.locator('#game-craft-dialog'),act=(a,v)=>dialog.locator('[data-craft-action="'+a+'"]'+(v===undefined?'':'[data-craft-value=\''+JSON.stringify(v)+'\']'));
      const d={act:async(a,v)=>click(act(a,v)),
        async open(slot){await click(page.locator('#game-craft-open'));if(mobile)await click(act('skill',slot));else{await act('skill',slot).focus();await page.keyboard.press('Enter');}await click(act('level',1));},
        async phase(phase){await until(v=>v?.client.world.craft?.phase===phase);},
        async lines(pattern){assert.match(await dialog.innerText(),pattern);},
        async retry(enabled){await page.waitForFunction(enabled=>{const b=document.querySelector('[data-craft-action=retry]');return b&&b.disabled===!enabled;},enabled);},
        async shot(kind){await page.screenshot({path:join(qa,label+'-'+kind+'.png')});},
        async closed(){assert.equal(await dialog.isVisible(),false);}};
      await flow(d,peer);assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);assert.deepEqual(errors,[]);assert.deepEqual(warnings,[]);
      await click(page.locator('#game-disconnect'));const result=await peer.receipt();receipt(result);
      const evidence={stage:305,surface:label+'-web',url,files:1072,viewport:mobile?[390,844]:[1100,850],browser:await browser.version(),keyboardAndMouse:!mobile,touch:mobile,errors,warnings,result,nativeAcceptance:false,
        screenshots:['subjects','aid','treatment','gather','paused'].map(s=>join(qa,label+'-'+s+'.png'))};writeFileSync(join(qa,label+'-receipt.json'),JSON.stringify(evidence,null,2)+'\n');console.log(JSON.stringify(evidence));
    }finally{await browser?.close();await bridge?.close();await peer?.close();}
  });
}else{
  const {environment,until,cleared,event,variant}=await import('../game-wechat-page-v1/page-test.mjs');
  test('stage305 ordinary targets and gathering Page '+variant,{timeout:180000},async()=>{
    const peer=await workPeer(1),env=environment(peer,[],undefined,archive),page=env.startPage();
    const act=(action,value)=>page.onCraft(event({action,...(['skill','level','person','subject'].includes(action)?{value}:{})}));
    try{
      await until(page,v=>v.canvasReady);env.select(selection());assert.equal(await page.onStartup(),true);assert.equal(await page.onResources(),true);
      const start=page.onConnect();await until(page,v=>v.state==='choosing');await page.onCharacter(event({action:'upgrade'}));await until(page,v=>v.versionState==='upgrade-success');await page.onCharacter(event({action:'version-back'}));await until(page,v=>v.state==='choosing'&&v.characters[1]?.options.previous);await page.onCharacter(event({action:'appearance',slot:1,direction:3}));const entering=page.onCharacter(event({action:'enter',slot:1}));await until(page,v=>v.state==='playing'&&v.hasFrame&&v.canCraft,18000);await start;await entering;await peer.stage('ready');
      const d={act,async open(slot){await act('open');await act('skill',slot);await act('level',1);},
        async phase(phase){await until(page,v=>v.craft?.phase===phase,18000);},
        async lines(pattern){assert.match(JSON.stringify(page.data.craft),pattern);},
        async retry(enabled){await until(page,v=>v.craft?.canRetry===enabled);},async shot(){},
        async closed(){assert.equal(page.data.craft,null);assert.equal(page.data.canTouch,true);}};
      await flow(d,peer);assert.equal(env.stats.created,1);assert.equal(page.data.resourceCount,1072);
      assert.equal(readFileSync(resolve(process.env.MOLI_PAGE_BUILD,'game/pages/play/craft.wxml'),'utf8'),readFileSync(resolve('wechat/game/pages/play/craft.wxml'),'utf8'));page.onDisconnect();cleared(env,page);const result=await peer.receipt();receipt(result);
      const evidence={stage:305,surface:'Page-'+variant,files:1072,frames:env.frames.length,result,nativeAcceptance:false};writeFileSync(join(qa,'page-'+variant+'-receipt.json'),JSON.stringify(evidence,null,2)+'\n');console.log(JSON.stringify(evidence));
    }finally{page.onUnload();await peer.close();}
  });
}
