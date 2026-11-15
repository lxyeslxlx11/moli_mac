/** Stage303 actual resource ZIP and authored localhost peer, without injected client state. */
import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdirSync,readFileSync,writeFileSync} from 'node:fs';
import {resolve,join} from 'node:path';
import {createRequire} from 'node:module';
import {setTimeout as sleep} from 'node:timers/promises';
import {createLauncherLoopbackServer} from '../../adapters/node/launcher-loopback.mjs';
import {startup} from '../../web/tests/helpers/legacy-game-client-fixture.mjs';
import {craftPeer} from './peer.mjs';
const surface=process.env.MOLI_CRAFT_SURFACE??'web';
const profile=JSON.parse(readFileSync(resolve('analysis/game-legacy-material-compat-v1/material-profile.json')));
const archive=resolve(profile.archive),qa='/tmp/moli-stage303-qa';mkdirSync(qa,{recursive:true});
function selection(){const value=startup();value.context='legacy-se6000-37c4';value.resourceParametersHex=Buffer.from(profile.parameters).toString('hex');return Buffer.from(JSON.stringify(value));}
const receipt=r=>{assert.equal(r.requests,13);for(const k of ['query','workPose','orderedSlots','successAndFailure','cancelled','sameConnection'])assert.equal(r[k],true);assert.equal(r.officialSession,false);};
if(surface==='web'){
  const {chromium}=createRequire(import.meta.url)(resolve('build/dependencies/playwright-core-1.64.1/node_modules/playwright-core'));
  for(const mobile of [false,true])test('stage303 manufacture '+(mobile?'touch web':'desktop web'),{timeout:120000},async()=>{
    let peer,bridge,browser;const label=mobile?'mobile':'desktop';
    try{
      peer=await craftPeer();bridge=await createLauncherLoopbackServer({sourceProfile:'legacy',gameCode:2,label:'Original manufacture peer',endpoints:[{address:'127.0.0.1',port:peer.port}],lifetimeMilliseconds:60000});
      browser=await chromium.launch({channel:'chrome',headless:true});
      const context=await browser.newContext({viewport:mobile?{width:390,height:844}:{width:1100,height:850},isMobile:mobile,hasTouch:mobile});
      const page=await context.newPage(),errors=[],warnings=[];
      page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());if(m.type()==='warning')warnings.push(m.text());});
      const click=locator=>mobile?locator.tap():locator.click();
      await page.goto(bridge.origin+'/web/game.html');
      await page.waitForFunction(()=>!document.querySelector('#game-archive').disabled);
      assert.equal(await page.title(),'Moli · 游戏');assert.equal(await page.locator('vite-error-overlay,nextjs-portal').count(),0);
      assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
      await page.locator('#game-startup').setInputFiles({name:'original-startup.json',mimeType:'application/json',buffer:selection()});
      await page.locator('#game-archive').setInputFiles(archive);await click(page.locator('#game-connect'));
      const inspect=()=>page.evaluate(async()=>(await import('/web/game-app.mjs')).inspectGamePage().view);
      const until=async predicate=>{let v;for(let i=0;i<5000;i++){v=await inspect();if(predicate(v))return v;if(v?.client?.errorCode||v?.frameError)throw Error(JSON.stringify(v));await sleep(15);}assert.fail('Manufacture timeout '+JSON.stringify(v)+' '+peer.diagnostics());};
      await until(v=>v?.client.state==='choosing');
      for(const name of ['请求版本升级','返回人物列表','下一外观 OriginalA','进入 OriginalA'])await click(page.getByRole('button',{name,exact:true}));
      const entered=await until(v=>v?.client.state==='playing'&&v.canvas?.presentations>2);
      assert.equal(entered.files.files,1072);assert.ok(entered.client.library.stats.imagesDecoded>0);await peer.stage('ready');
      await click(page.locator('#game-craft-open'));const dialog=page.locator('#game-craft-dialog');
      const act=(action,value)=>dialog.locator('[data-craft-action="'+action+'"]'+(value===undefined?'':'[data-craft-value=\''+JSON.stringify(value)+'\']'));
      if(mobile)await click(act('skill',3));else{await act('skill',3).focus();await page.keyboard.press('Enter');}
      assert.equal(await act('level',1).isDisabled(),true);await click(act('level',0));await click(act('recipe',0));
      assert.equal(await act('begin').isDisabled(),true);
      const assign=async(position,name)=>{await click(act('position',position));await click(dialog.getByRole('button',{name,exact:true}));};
      assert.equal(await dialog.getByRole('button',{name:'Empty description × 3',exact:true}).isDisabled(),true);
      await assign(4,'Copper × 3');await assign(1,'Wood × 1');await assign(0,'Catalyst × 1');
      assert.equal(await act('begin').isEnabled(),true);
      assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
      await page.screenshot({path:join(qa,label+'-materials.png')});
      await click(act('begin'));await until(v=>v?.client.world.craft?.phase==='working');
      assert.match(await dialog.innerText(),/正在制造/);await page.screenshot({path:join(qa,label+'-working.png')});
      await peer.stage('submitted-success');await until(v=>v?.client.world.craft?.phase==='awaiting');
      assert.match(await dialog.innerText(),/等待结果/);assert.equal(await act('begin').count(),0);
      peer.release('success');await until(v=>v?.client.world.craft?.phase==='result');
      await page.waitForFunction(()=>document.querySelector('#game-craft-content').textContent.includes('制造成功了'));
      assert.match(await dialog.innerText(),/技能经验值 \+15/);assert.match(await dialog.innerText(),/等级提升/);
      await page.screenshot({path:join(qa,label+'-success.png')});
      await click(act('retry'));await assign(0,'Copper × 3');await assign(1,'Wood × 1');
      assert.equal(await act('begin').isDisabled(),true);peer.release('restore-mp');await page.waitForFunction(()=>!document.querySelector('[data-craft-action="begin"]').disabled);
      await click(act('begin'));await peer.stage('submitted-failure');peer.release('failure');
      await until(v=>v?.client.world.craft?.phase==='result');await page.waitForFunction(()=>document.querySelector('#game-craft-content').textContent.includes('制造失败了'));
      assert.match(await dialog.innerText(),/受伤了/);await page.screenshot({path:join(qa,label+'-failure.png')});
      await click(act('retry'));await assign(0,'Copper × 3');await assign(1,'Wood × 1');await click(act('begin'));await click(act('close'));
      await peer.stage('cancelled');await until(v=>!v?.client.world.craft);assert.equal(await dialog.isVisible(),false);
      assert.deepEqual(errors,[]);assert.deepEqual(warnings,[]);await click(page.locator('#game-disconnect'));
      const result=await peer.receipt();receipt(result);
      const evidence={stage:303,surface:label+'-web',files:1072,viewport:mobile?[390,844]:[1100,850],
        browser:await browser.version(),keyboard:!mobile,touch:mobile,errors,warnings,result,
        screenshots:['materials','working','success','failure'].map(s=>join(qa,label+'-'+s+'.png')),nativeAcceptance:false};
      writeFileSync(join(qa,label+'-receipt.json'),JSON.stringify(evidence,null,2)+'\n');console.log(JSON.stringify(evidence));
    }finally{await browser?.close();await bridge?.close();await peer?.close();}
  });
}else{
  const {environment,until,cleared,event,variant}=await import('../game-wechat-page-v1/page-test.mjs');
  test('stage303 manufacture Page '+variant,{timeout:120000},async()=>{
    const peer=await craftPeer(1),env=environment(peer,[],undefined,archive),page=env.startPage();
    const mark=step=>console.log(JSON.stringify({stage:303,surface:'Page-'+variant,step,state:page.data.state,phase:page.data.craft?.phase,errorCode:page.data.errorCode,diagnostics:peer.diagnostics()}));
    const act=(action,value)=>page.onCraft(event({action,...(['skill','level','recipe','position','remove'].includes(action)?{value}:action==='assign'?value:{})}));
    const assign=async(position,slot)=>{await act('position',position);const row=page.data.craft.items.find(i=>i.slot===slot);await act('assign',{slot,revision:row.revision});};
    try{
      await until(page,v=>v.canvasReady);mark('canvas');env.select(selection());assert.equal(await page.onStartup(),true);assert.equal(await page.onResources(),true);mark('resources');
      const start=page.onConnect();await until(page,v=>v.state==='choosing');await page.onCharacter(event({action:'upgrade'}));await until(page,v=>v.versionState==='upgrade-success');
      await page.onCharacter(event({action:'version-back'}));await until(page,v=>v.state==='choosing'&&v.characters[1]?.options.previous);
      await page.onCharacter(event({action:'appearance',slot:1,direction:3}));const entering=page.onCharacter(event({action:'enter',slot:1}));
      await until(page,v=>v.state==='playing'&&v.hasFrame&&v.canCraft,18000);await start;await entering;mark('entered');await peer.stage('ready');mark('ready');
      await act('open');assert.equal(page.data.canTouch,false);await act('skill',3);assert.equal(page.data.craft.levels[1].disabled,true);
      await act('level',0);await act('recipe',0);assert.equal(page.data.craft.canBegin,false);
      await assign(4,8);await assign(1,9);await assign(0,10);assert.equal(page.data.craft.canBegin,true);
      await act('begin');assert.equal(page.data.craft.phase,'working');mark('working-success');await peer.stage('submitted-success');mark('submitted-success');await until(page,v=>v.craft?.phase==='awaiting',18000);
      peer.release('success');await until(page,v=>v.craft?.phase==='result');assert.ok(page.data.craft.result.lines.includes('制造成功了'));assert.ok(page.data.craft.result.lines.includes('技能经验值 +15'));
      await act('retry');await assign(0,8);await assign(1,9);assert.equal(page.data.craft.canBegin,false);peer.release('restore-mp');await until(page,v=>v.craft?.canBegin);
      await act('begin');mark('working-failure');await peer.stage('submitted-failure');mark('submitted-failure');peer.release('failure');await until(page,v=>v.craft?.phase==='result');assert.ok(page.data.craft.result.lines.includes('制造失败了'));assert.ok(page.data.craft.result.lines.includes('受伤了'));
      await act('retry');await assign(0,8);await assign(1,9);await act('begin');await act('close');await peer.stage('cancelled');assert.equal(page.data.craft,null);assert.equal(page.data.canTouch,true);
      assert.equal(readFileSync(resolve(process.env.MOLI_PAGE_BUILD,'game/pages/play/craft.wxml'),'utf8'),readFileSync(resolve('wechat/game/pages/play/craft.wxml'),'utf8'));
      assert.match(readFileSync(resolve(process.env.MOLI_PAGE_BUILD,'game/pages/play/index.wxml'),'utf8'),/include src=".\/craft.wxml"/);
      assert.equal(env.stats.created,1);assert.equal(page.data.resourceCount,1072);page.onDisconnect();cleared(env,page);const result=await peer.receipt();receipt(result);
      const evidence={stage:303,surface:'Page-'+variant,files:1072,frames:env.frames.length,result,nativeAcceptance:false};writeFileSync(join(qa,'page-'+variant+'-receipt.json'),JSON.stringify(evidence,null,2)+'\n');console.log(JSON.stringify(evidence));
    }finally{page.onUnload();await peer.close();}
  });
}
