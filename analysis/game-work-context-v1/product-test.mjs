/** Actual resource ZIP -> real controls -> original localhost context peer. */
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
const archive=resolve(profile.archive),qa='/tmp/moli-stage306-qa';mkdirSync(qa,{recursive:true});
function selection(){const v=startup();v.context='legacy-se6000-37c4';v.resourceParametersHex=Buffer.from(profile.parameters).toString('hex');return Buffer.from(JSON.stringify(v));}
function receipt(r){assert.equal(r.requests,34);for(const k of ['requery','staleRecipesBlocked','expiryReset','recipeBack','contextCraft','contextRepair','contextGather','directSkill','MPGuard','rideChild','sameConnection'])assert.equal(r[k],true);assert.equal(r.officialSession,false);}
async function flow(d,peer){
  await d.select(0);await d.act('context');await d.context(true);await d.shot('levels');await d.act('level',1);await d.phase('recipes');await peer.stage('requery');await d.recipe(false);await d.shot('requery');
  peer.release('recipes');await d.recipe(true);await d.act('recipe',0);await d.phase('materials');await d.assign(0,8);await d.assign(1,9);await d.act('begin');await d.phase('working');await d.phase('result');await d.lines(/制造成功了/);await d.act('close');
  await d.select(0);await d.act('context');await d.act('level',1);await d.phase('recipes');await peer.stage('expiry-ready');peer.release('zero-time');await peer.stage('expiry-query');await d.recipe(false);await d.context(false);await d.shot('expired');
  peer.release('normal-recipes');await d.recipe(true);await d.act('levels-back');await d.phase('levels');await d.act('close');
  await d.select(1);await d.act('level',1);await d.phase('materials');await d.item(10,false);await d.act('close');
  await d.select(1);await d.act('context');await d.act('level',1);await d.phase('materials');await d.item(10,true);await d.act('target',10);await d.cost(30);await d.shot('repair');await d.act('begin');await d.phase('result');await d.lines(/武器修理成功了/);await d.act('close');
  await d.select(5);await d.act('context');await d.act('level',1);await d.phase('working');await d.context(true);await d.shot('gather');await d.phase('result');await d.act('pause');await d.phase('paused');await d.act('close');
  await d.select(7);await d.act('context');await d.act('level',1);await peer.stage('direct-low-mp');await d.mp(0);await d.act('level',1);await d.lines(/魔力/);peer.release('ride');await peer.stage('ride-ready');await sleep(150);await d.act('level',1);await peer.stage('direct-second');
  await d.phase('levels');await d.directSent();await d.shot('direct');await d.act('close');await peer.stage('done');await d.closed();
}
if(surface==='web'){
  const {chromium}=createRequire(import.meta.url)(resolve('build/dependencies/playwright-core-1.64.1/node_modules/playwright-core'));
  for(const mobile of [false,true])test('stage306 skill context and direct skill '+(mobile?'touch web':'desktop web'),{timeout:180000},async()=>{
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
      const entered=await until(v=>v?.client.state==='playing'&&v.canvas?.presentations>2);assert.equal(entered.files.files,1072);assert.ok(entered.client.library.stats.imagesDecoded>0);await peer.stage('ready');await peer.stage('records-ready');
      const dialog=page.locator('#game-craft-dialog'),act=(a,v)=>dialog.locator('[data-craft-action="'+a+'"]'+(v===undefined?'':'[data-craft-value=\''+JSON.stringify(v)+'\']'));
      const d={act:async(a,v)=>{if(a==='target'){const b=dialog.locator('[data-craft-action=target]').filter({hasText:'Sword'});await click(b);}else if(a==='context'&&!mobile){await act(a).focus();await page.keyboard.press('Enter');}else await click(act(a,v));},
        async select(slot){await click(page.locator('#game-craft-open'));if(mobile)await click(act('skill',slot));else{await act('skill',slot).focus();await page.keyboard.press('Enter');}},
        async context(active){await page.waitForFunction(active=>document.querySelector('#game-craft-content').textContent.includes('精灵变身已启用')===active,active);},
        async recipe(enabled){await page.waitForFunction(enabled=>{const b=document.querySelector('[data-craft-action=recipe]');return b&&b.disabled===!enabled;},enabled);},
        async item(slot,enabled){const b=dialog.locator('[data-craft-action=target]').filter({hasText:'Sword'});assert.equal(await b.isDisabled(),!enabled);},
        async cost(n){assert.ok((await dialog.innerText()).includes('消耗魔力 '+n));},
        async directSent(){assert.match(await dialog.innerText(),/技能请求已发送/);},
        async assign(position,slot){await click(act('position',position));const b=dialog.locator('[data-craft-action=assign]').filter({hasText:slot===8?'Copper':'Wood'});await click(b);},
        async mp(n){await page.waitForFunction(n=>document.querySelector('#game-craft-content').textContent.includes('当前魔力 '+n),n);},
        async phase(phase){await until(v=>v?.client.world.craft?.phase===phase);},
        async lines(pattern){assert.match(await dialog.innerText(),pattern);},
        async retry(enabled){await page.waitForFunction(enabled=>{const b=document.querySelector('[data-craft-action=retry]');return b&&b.disabled===!enabled;},enabled);},
        async shot(kind){await page.screenshot({path:join(qa,label+'-'+kind+'.png')});},
        async closed(){assert.equal(await dialog.isVisible(),false);}};
      try{await flow(d,peer);}catch(error){writeFileSync(join(qa,label+'-failure.json'),JSON.stringify({view:await inspect(),errors,warnings,diagnostics:peer.diagnostics()},null,2));throw error;}assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);assert.deepEqual(errors,[]);assert.deepEqual(warnings,[]);
      await click(page.locator('#game-disconnect'));const result=await peer.receipt();receipt(result);
      const evidence={stage:306,surface:label+'-web',url,files:1072,viewport:mobile?[390,844]:[1100,850],browser:await browser.version(),keyboardAndMouse:!mobile,touch:mobile,errors,warnings,result,nativeAcceptance:false,
        screenshots:['levels','requery','expired','repair','gather','direct'].map(s=>join(qa,label+'-'+s+'.png'))};writeFileSync(join(qa,label+'-receipt.json'),JSON.stringify(evidence,null,2)+'\n');console.log(JSON.stringify(evidence));
    }finally{await browser?.close();await bridge?.close();await peer?.close();}
  });
}else{
  const {environment,until,cleared,event,variant}=await import('../game-wechat-page-v1/page-test.mjs');
  test('stage306 skill context and direct skill Page '+variant,{timeout:180000},async()=>{
    const peer=await workPeer(1),env=environment(peer,[],undefined,archive),page=env.startPage();
    const act=(action,value)=>{const item=page.data.craft?.items.find(i=>i.slot===value);return page.onCraft(event({action,...(['skill','level','recipe','position'].includes(action)?{value}:action==='target'||action==='assign'?{slot:value,revision:item.revision}:{})}));};
    try{
      await until(page,v=>v.canvasReady);env.select(selection());assert.equal(await page.onStartup(),true);assert.equal(await page.onResources(),true);
      const start=page.onConnect();await until(page,v=>v.state==='choosing');await page.onCharacter(event({action:'upgrade'}));await until(page,v=>v.versionState==='upgrade-success');await page.onCharacter(event({action:'version-back'}));await until(page,v=>v.state==='choosing'&&v.characters[1]?.options.previous);await page.onCharacter(event({action:'appearance',slot:1,direction:3}));const entering=page.onCharacter(event({action:'enter',slot:1}));await until(page,v=>v.state==='playing'&&v.hasFrame&&v.canCraft,18000);await start;await entering;await peer.stage('ready');await peer.stage('records-ready');
      const d={act,async select(slot){await act('open');await act('skill',slot);},
        async context(active){await until(page,v=>v.craft?.contextMode===Number(active));},
        async recipe(enabled){await until(page,v=>v.craft?.recipes[0]?.disabled===!enabled);},
        async item(slot,enabled){assert.equal(page.data.craft.items.find(i=>i.slot===slot).disabled,!enabled);},
        async cost(n){assert.equal(page.data.craft.cost,n);},
        async directSent(){assert.equal(page.data.craft.directRequestSent,true);},
        async assign(position,slot){await act('position',position);await act('assign',slot);},
        async mp(n){await until(page,v=>v.craft?.mp===n);},
        async phase(phase){await until(page,v=>v.craft?.phase===phase,18000);},
        async lines(pattern){assert.match(JSON.stringify(page.data.craft),pattern);},
        async retry(enabled){await until(page,v=>v.craft?.canRetry===enabled);},async shot(){},
        async closed(){assert.equal(page.data.craft,null);assert.equal(page.data.canTouch,true);}};
      await flow(d,peer);assert.equal(env.stats.created,1);assert.equal(page.data.resourceCount,1072);
      assert.equal(readFileSync(resolve(process.env.MOLI_PAGE_BUILD,'game/pages/play/craft.wxml'),'utf8'),readFileSync(resolve('wechat/game/pages/play/craft.wxml'),'utf8'));page.onDisconnect();cleared(env,page);const result=await peer.receipt();receipt(result);
      const evidence={stage:306,surface:'Page-'+variant,files:1072,frames:env.frames.length,result,nativeAcceptance:false};writeFileSync(join(qa,'page-'+variant+'-receipt.json'),JSON.stringify(evidence,null,2)+'\n');console.log(JSON.stringify(evidence));
    }finally{page.onUnload();await peer.close();}
  });
}
