/** Actual resource archive -> real web/Page controls -> original localhost peer; no state injection. */
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
const archive=resolve(profile.archive),qa='/tmp/moli-stage304-qa';mkdirSync(qa,{recursive:true});
function selection(){const v=startup();v.context='legacy-se6000-37c4';v.resourceParametersHex=Buffer.from(profile.parameters).toString('hex');return Buffer.from(JSON.stringify(v));}
const receipt=r=>{assert.equal(r.requests,26);for(const k of ['query','repair','appraise','markAndClear','decorationOrder','cancelled','sameConnection'])assert.equal(r[k],true);assert.equal(r.officialSession,false);};
if(surface==='web'){
  const {chromium}=createRequire(import.meta.url)(resolve('build/dependencies/playwright-core-1.64.1/node_modules/playwright-core'));
  for(const mobile of [false,true])test('stage304 ordinary work '+(mobile?'touch web':'desktop web'),{timeout:150000},async()=>{
    let peer,bridge,browser;const label=mobile?'mobile':'desktop';
    try{
      peer=await workPeer();bridge=await createLauncherLoopbackServer({sourceProfile:'legacy',gameCode:2,label:'Original item work peer',endpoints:[{address:'127.0.0.1',port:peer.port}],lifetimeMilliseconds:60000});
      browser=await chromium.launch({channel:'chrome',headless:true});const context=await browser.newContext({viewport:mobile?{width:390,height:844}:{width:1100,height:850},isMobile:mobile,hasTouch:mobile}),page=await context.newPage(),errors=[],warnings=[];
      page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());if(m.type()==='warning')warnings.push(m.text());});
      const click=l=>mobile?l.tap():l.click(),url=bridge.origin+'/web/game.html';await page.goto(url);await page.waitForFunction(()=>!document.querySelector('#game-archive').disabled);
      assert.equal(await page.title(),'Moli · 游戏');assert.ok((await page.locator('body').innerText()).includes('游戏资源 ZIP'));assert.equal(await page.locator('vite-error-overlay,nextjs-portal').count(),0);assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
      await page.locator('#game-startup').setInputFiles({name:'original-startup.json',mimeType:'application/json',buffer:selection()});await page.locator('#game-archive').setInputFiles(archive);await click(page.locator('#game-connect'));
      const inspect=()=>page.evaluate(async()=>(await import('/web/game-app.mjs')).inspectGamePage().view);
      const until=async predicate=>{let v;for(let i=0;i<5000;i++){v=await inspect();if(predicate(v))return v;if(v?.client?.errorCode||v?.frameError)throw Error(JSON.stringify(v));await sleep(15);}assert.fail(JSON.stringify(v)+' '+peer.diagnostics());};
      await until(v=>v?.client.state==='choosing');for(const name of ['请求版本升级','返回人物列表','下一外观 OriginalA','进入 OriginalA'])await click(page.getByRole('button',{name,exact:true}));
      const entered=await until(v=>v?.client.state==='playing'&&v.canvas?.presentations>2);assert.equal(entered.files.files,1072);assert.ok(entered.client.library.stats.imagesDecoded>0);await peer.stage('ready');
      const dialog=page.locator('#game-craft-dialog'),act=(a,v)=>dialog.locator('[data-craft-action="'+a+'"]'+(v===undefined?'':'[data-craft-value=\''+JSON.stringify(v)+'\']'));
      const open=async slot=>{await click(page.locator('#game-craft-open'));if(mobile)await click(act('skill',slot));else{await act('skill',slot).focus();await page.keyboard.press('Enter');}await click(act('level',1));};
      const target=async name=>click(dialog.getByRole('button',{name,exact:true}));
      await open(1);assert.equal(await dialog.getByRole('button',{name:'Armor',exact:true}).isDisabled(),true);await target('Sword');assert.equal(await act('begin').isEnabled(),true);
      await page.screenshot({path:join(qa,label+'-repair.png')});await click(act('begin'));await peer.stage('repair-submitted');await until(v=>v?.client.world.craft?.phase==='awaiting');peer.release('repair-result');
      await until(v=>v?.client.world.craft?.phase==='result');await page.waitForFunction(()=>document.querySelector('#game-craft-content').textContent.includes('武器修理成功了'));await click(act('close'));
      await open(3);await target('Unknown relic');await peer.stage('appraise-open');assert.equal(await act('begin').isDisabled(),true);peer.release('restore-mp');await page.waitForFunction(()=>!document.querySelector('[data-craft-action="begin"]').disabled);await click(act('begin'));
      await until(v=>v?.client.world.craft?.phase==='result');await page.waitForFunction(()=>document.querySelector('#game-craft-content').textContent.includes('鉴定失败了'));assert.match(await dialog.innerText(),/受伤了/);await page.screenshot({path:join(qa,label+'-appraise.png')});await click(act('close'));
      await open(4);await target('Ring');const mark=async value=>{await dialog.locator('input[name=mark]').fill(value);await click(dialog.getByRole('button',{name:'确认刻印文字',exact:true}));};
      await mark('bad|mark');assert.equal(await act('begin').isDisabled(),true);assert.match(await page.locator('#game-craft-status').innerText(),/竖线/);
      await mark('Original mark');assert.equal(await act('begin').isEnabled(),true);await page.screenshot({path:join(qa,label+'-mark.png')});await click(act('begin'));
      await until(v=>v?.client.world.craft?.phase==='result'&&v.client.world.battle.items.revision>=2);await click(act('retry'));await target('Ring');await mark('');assert.equal(await act('begin').isEnabled(),true);await click(act('begin'));await until(v=>v?.client.world.craft?.phase==='result');await click(act('close'));
      const assign=async(position,name)=>{await click(act('position',position));await target(name);};
      await open(5);assert.equal(await dialog.getByRole('button',{name:'Not decoratable × 1',exact:true}).isDisabled(),true);await assign(4,'Base charm × 1');await assign(0,'Gem × 1');assert.equal(await act('begin').isEnabled(),true);await page.screenshot({path:join(qa,label+'-decoration.png')});await click(act('begin'));
      await until(v=>v?.client.world.craft?.phase==='result');await page.waitForFunction(()=>document.querySelector('#game-craft-content').textContent.includes('制造成功了'));assert.match(await dialog.innerText(),/Base charm/);await page.screenshot({path:join(qa,label+'-result.png')});await click(act('close'));
      await open(5);await assign(0,'Base charm × 1');await assign(1,'Gem × 1');await click(act('begin'));await click(act('close'));await peer.stage('cancelled');await sleep(80);assert.equal(await dialog.isVisible(),false);
      assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);assert.deepEqual(errors,[]);assert.deepEqual(warnings,[]);await click(page.locator('#game-disconnect'));const result=await peer.receipt();receipt(result);
      const evidence={stage:304,surface:label+'-web',url,files:1072,viewport:mobile?[390,844]:[1100,850],browser:await browser.version(),keyboardAndMouse:!mobile,touch:mobile,errors,warnings,result,nativeAcceptance:false,
        screenshots:['repair','appraise','mark','decoration','result'].map(s=>join(qa,label+'-'+s+'.png'))};writeFileSync(join(qa,label+'-receipt.json'),JSON.stringify(evidence,null,2)+'\n');console.log(JSON.stringify(evidence));
    }finally{await browser?.close();await bridge?.close();await peer?.close();}
  });
}else{
  const {environment,until,cleared,event,variant}=await import('../game-wechat-page-v1/page-test.mjs');
  test('stage304 ordinary work Page '+variant,{timeout:150000},async()=>{
    const peer=await workPeer(1),env=environment(peer,[],undefined,archive),page=env.startPage();
    const act=(action,value)=>page.onCraft(event({action,...(['skill','level','recipe','position','remove'].includes(action)?{value}:['assign','target'].includes(action)?value:{})}));
    const open=async slot=>{await act('open');await act('skill',slot);await act('level',1);};
    const target=async slot=>{const i=page.data.craft.items.find(i=>i.slot===slot);return act('target',{slot,revision:i.revision});};
    const assign=async(position,slot)=>{await act('position',position);const i=page.data.craft.items.find(i=>i.slot===slot);await act('assign',{slot,revision:i.revision});};
    const mark=value=>page.onCraftMark({detail:{value:{mark:value}}});
    try{
      await until(page,v=>v.canvasReady);env.select(selection());assert.equal(await page.onStartup(),true);assert.equal(await page.onResources(),true);
      const start=page.onConnect();await until(page,v=>v.state==='choosing');await page.onCharacter(event({action:'upgrade'}));await until(page,v=>v.versionState==='upgrade-success');await page.onCharacter(event({action:'version-back'}));await until(page,v=>v.state==='choosing'&&v.characters[1]?.options.previous);await page.onCharacter(event({action:'appearance',slot:1,direction:3}));const entering=page.onCharacter(event({action:'enter',slot:1}));await until(page,v=>v.state==='playing'&&v.hasFrame&&v.canCraft,18000);await start;await entering;await peer.stage('ready');
      await open(1);assert.equal(page.data.canTouch,false);assert.equal(page.data.craft.items.find(i=>i.slot===14).disabled,true);await target(8);await act('begin');await peer.stage('repair-submitted');peer.release('repair-result');await until(page,v=>v.craft?.phase==='result');assert.ok(page.data.craft.result.lines.includes('武器修理成功了'));await act('close');
      await open(3);await target(9);await peer.stage('appraise-open');assert.equal(page.data.craft.canBegin,false);peer.release('restore-mp');await until(page,v=>v.craft?.canBegin);await act('begin');await until(page,v=>v.craft?.phase==='result',18000);assert.ok(page.data.craft.result.lines.includes('鉴定失败了'));assert.ok(page.data.craft.result.lines.includes('受伤了'));await act('close');
      await open(4);await target(10);assert.equal(await mark('bad|mark'),false);assert.equal(page.data.craft.canBegin,false);assert.match(page.data.craft.notice,/竖线/);await mark('Original mark');await act('begin');await until(page,v=>v.craft?.phase==='result'&&v.craft.target?.canClearMark);await act('retry');await target(10);await mark('');assert.equal(page.data.craft.canBegin,true);await act('begin');await until(page,v=>v.craft?.phase==='result');await act('close');
      await open(5);assert.equal(page.data.craft.items.find(i=>i.slot===13).disabled,true);await assign(4,11);await assign(0,12);await act('begin');await until(page,v=>v.craft?.phase==='result',18000);assert.ok(page.data.craft.result.lines.includes('制造成功了'));assert.ok(page.data.craft.result.lines.includes('Base charm'));await act('close');
      await open(5);await assign(0,11);await assign(1,12);await act('begin');await act('close');await peer.stage('cancelled');await sleep(80);assert.equal(page.data.craft,null);assert.equal(page.data.canTouch,true);assert.equal(env.stats.created,1);assert.equal(page.data.resourceCount,1072);
      assert.equal(readFileSync(resolve(process.env.MOLI_PAGE_BUILD,'game/pages/play/craft.wxml'),'utf8'),readFileSync(resolve('wechat/game/pages/play/craft.wxml'),'utf8'));page.onDisconnect();cleared(env,page);const result=await peer.receipt();receipt(result);
      const evidence={stage:304,surface:'Page-'+variant,files:1072,frames:env.frames.length,result,nativeAcceptance:false};writeFileSync(join(qa,'page-'+variant+'-receipt.json'),JSON.stringify(evidence,null,2)+'\n');console.log(JSON.stringify(evidence));
    }finally{page.onUnload();await peer.close();}
  });
}
