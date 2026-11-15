/** Exercise the real Page handlers and game adapter with native-API-shaped local test ports. */
import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync, rmSync, writeFileSync, statSync, openSync, readSync, closeSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { resolve, dirname, join } from 'node:path';
import { tmpdir } from 'node:os';
import { createHash } from 'node:crypto';
import { runInNewContext } from 'node:vm';
import { setTimeout as wait } from 'node:timers/promises';
import { createWeChatLegacyGameHost } from '../../adapters/wechat/legacy-game-host.mjs';
import { createWeChatLauncherHost } from '../../adapters/wechat/launcher-host.mjs';
import { fakeWeChat } from '../../web/tests/helpers/wechat-tcp-fixture.mjs';
import { battleStartup } from '../game-battle-web-v1/browser-fixture.mjs';
import { peerFor, pickupAssets } from '../../build/analysis/game-battle-shared-storage-v1/chat-presentation/tcp-flow.mjs';

const variant = process.env.MOLI_PAGE_VARIANT ?? 'generated';
const project = resolve(process.env.MOLI_PAGE_BUILD ?? 'build/wechat-app-stage222-page-final');
const startup = Uint8Array.from(Buffer.from(JSON.stringify(battleStartup())));
const createResourceRows = () => pickupAssets.files.map(row=>({path:row.path,bytes:Uint8Array.from(Buffer.from(row.bytesHex,'hex'))}));
function packResourceRows(rows) {
  const directory = mkdtempSync(join(tmpdir(), 'moli-page-resource-'));
  const input = join(directory, 'rows.json'), output = join(directory, 'fixture.zip');
  try {
    writeFileSync(input, JSON.stringify(rows));
    const zip = spawnSync('python3', ['-B', '-c', `
import json,sys,zipfile
with open(sys.argv[1],encoding='utf-8') as source:
    rows=json.load(source)
with zipfile.ZipFile(sys.argv[2],'w',zipfile.ZIP_DEFLATED) as out:
    for row in rows:
        out.writestr(row['path'],bytes.fromhex(row['bytesHex']))
`, input, output], { stdio: ['ignore', 'ignore', 'pipe'], timeout: 15000 });
    if (zip.error) throw zip.error;
    assert.equal(zip.status, 0, String(zip.stderr));
    return Uint8Array.from(readFileSync(output));
  } finally { rmSync(directory, { recursive: true, force: true }); }
}
const resourceZip = packResourceRows(pickupAssets.files);
const digest = bytes => createHash('sha256').update(bytes).digest('hex');
const event = dataset => ({currentTarget:{dataset}});

function environment(peer=null, extraResources=[], baseResources=pickupAssets.files, archivePath=null) {
  const fake=fakeWeChat({native:peer!==null,loopbackPort:peer?.port});
  const modules=new Map(), pending=[], dialogPending=[];
  const statCalls=[], reads=[], frames=[], dialogFrames=[], paint=[], events=[];
  const rangeFile=archivePath?{length:statSync(archivePath).size,read(position,length){
    const fd=openSync(archivePath,'r'),bytes=new Uint8Array(length);
    try{assert.equal(readSync(fd,bytes,0,length,position),length);return bytes;}finally{closeSync(fd);}
  }}:null;
  const map={json:startup,zip:rangeFile??(baseResources===pickupAssets.files&&!extraResources.length
    ?resourceZip:packResourceRows([...baseResources,...extraResources]))};
  let capturePage,captureApp,selected=null,hold=false,resize=false,holdDialog=false;
  const canvas={width:320,height:240,getContext(type){assert.equal(type,'2d');return context;}};
  const context={
    createImageData(width,height){return {width,height,data:new Uint8ClampedArray(width*height*4)};},
    putImageData(image,x,y){
      assert.deepEqual([x,y,image.width,image.height],[0,0,canvas.width,canvas.height]);
      frames.push({width:image.width,height:image.height,sha256:digest(image.data),nonzero:image.data.some(value=>value!==0)});
    },
    clearRect(){events.push('clear');}, save(){}, restore(){}, scale(){}, fillRect(){},
    fillText(text){paint.push(text);},
  };
  const area={node:canvas,width:400,height:300,left:15,top:180};
  const dialogCanvas={width:0,height:0,getContext(type){assert.equal(type,'2d');return dialogContext;}};
  const dialogContext={
    createImageData:context.createImageData,
    putImageData(image,x,y){
      assert.deepEqual([x,y,image.width,image.height],[0,0,dialogCanvas.width,dialogCanvas.height]);
      dialogFrames.push({width:image.width,height:image.height,sha256:digest(image.data),nonzero:image.data.some(value=>value!==0)});
    },
    clearRect(){events.push('dialog-clear');},
  };
  const wx=Object.assign(fake.wx,{
    createSelectorQuery(){
      let art=false;
      return {in(){return this;},select(name){art=name==='#game-dialog-canvas';if(!art)assert.equal(name,'#game-canvas');return this;},
        fields(options){assert.equal(options.node,true);if(!art){assert.equal(options.size,true);assert.equal(options.rect,true);}return this;},
        exec(callback){
          const done=()=>callback([art?{node:dialogCanvas}:area]);
          if(art&&holdDialog)dialogPending.push(done);
          else if(!art&&resize)pending.push(done);
          else queueMicrotask(done);
        }};
    },
    chooseMessageFile(options){
      assert.equal(options.count,1);assert.equal(options.type,'file');
      const extension=options.extension[0], record=selected??map[extension], path='wxfile://original-'+extension;
      assert.ok(record);selected=null;map[extension]=record;
      const done=()=>options.success({tempFiles:[{path,size:record.length}]});
      if(hold)pending.push(done);else queueMicrotask(done);
    },
    getFileSystemManager(){return {
      stat({path,success}){statCalls.push(path);const bytes=map[path.split('-').at(-1)];queueMicrotask(()=>success({stats:{size:bytes.length,isFile:()=>true}}));},
      readFile({filePath,position,length,success}){
        const bytes=map[filePath.split('-').at(-1)];reads.push({filePath,position,length});
        assert.ok(position>=0&&length>=0&&position+length<=bytes.length);
        queueMicrotask(()=>success({data:(bytes.read?bytes.read(position,length):Uint8Array.from(bytes.subarray(position,position+length))).buffer}));
      },
    };},
  });
  function load(path){
    if(modules.has(path))return modules.get(path);
    if(variant==='source'&&path===resolve(project,'game/lib/play.js'))return {createWeChatLegacyGameHost};
    if(variant==='source'&&path===resolve(project,'lib/launcher.js'))return {createWeChatLauncherHost};
    const mod={exports:{}};
    runInNewContext(readFileSync(path,'utf8'),{module:mod,exports:mod.exports,wx,
      require:id=>load(resolve(dirname(path),id)),Page:value=>{capturePage=value;},App:value=>{captureApp=value;},
      Uint8Array,Uint8ClampedArray,Uint16Array,Uint32Array,Int8Array,Int16Array,Int32Array,Float32Array,ArrayBuffer,DataView,
      setTimeout,clearTimeout,queueMicrotask,Buffer:undefined,TextEncoder:undefined,TextDecoder:undefined,document:undefined,window:undefined,fetch:undefined,
    },{filename:path});
    modules.set(path,mod.exports);return mod.exports;
  }
  function createPage(route){
    load(resolve(project,route));
    const page={...capturePage,data:structuredClone(capturePage.data),setData(patch,done){
      Object.assign(this.data,structuredClone(patch));
      if(done)queueMicrotask(done);
    }};
    page.onLoad();return page;
  }
  function startPage(){
    const page=createPage('game/pages/play/index.js');page.onShow();page.onReady();return page;
  }
  function touch(page,kind,x,y,identifier=1,absolute=false){
    const position=absolute?{clientX:x+area.left,clientY:y+area.top}:{x,y};
    return page.onTouch({type:'touch'+kind,changedTouches:[{identifier,...position}]});
  }
  const tapMap=(page,absolute=false)=>{touch(page,'start',320,60,1,absolute);touch(page,'end',320,60,1,absolute);};
  return {wx,...fake,frames,dialogFrames,dialogPending,paint,events,reads,statCalls,pending,createPage,startPage,touch,tapMap,
    lifecycle:()=>load(resolve(project,'lifecycle.js')),
    application(){load(resolve(project,'app.js'));return captureApp;},
    select(bytes){selected=bytes;},hold(value){hold=value;},resize(value){resize=value;},holdDialog(value){holdDialog=value;}};
}

async function until(page,predicate,maxAttempts=1400) {
  for(let i=0;i<maxAttempts;i++){
    if(predicate(page.data))return page.data;
    if(page.data.errorCode&&/^LEGACY_(CLIENT|SESSION|BATTLE|ASSET|CANVAS)_/.test(page.data.errorCode)) {
      throw Error('Native page stopped at '+page.data.errorCode);
    }
    await wait(8);
  }
  assert.fail('Page state timeout '+JSON.stringify({state:page.data.state,battle:page.data.battle?.blocked,status:page.data.status}));
}

async function enter(environment, page, peer, fromZip=true) {
  await until(page,value=>value.canvasReady);
  assert.equal(page.data.canConnect,false);
  assert.equal(await page.onStartup(),true);
  assert.equal(page.data.hasStartup,true);
  if(fromZip)assert.equal(await page.onResources(),true);
  assert.ok(page.data.resourceCount>6);assert.equal(page.data.canConnect,true);
  assert.equal(environment.stats.created,0);
  const started=page.onConnect();
  await until(page,value=>value.state==='choosing');
  assert.equal(environment.stats.created,1);
  assert.deepEqual(page.data.characters.map(row=>row.name),['OriginalA','OriginalB']);
  await page.onCharacter(event({action:'upgrade'}));
  await until(page,value=>value.versionState==='upgrade-success');
  await page.onCharacter(event({action:'version-back'}));
  await until(page,value=>value.state==='choosing'&&value.characters[1]?.options.previous);
  await page.onCharacter(event({action:'appearance',slot:'1',direction:'3'}));
  const entering=page.onCharacter(event({action:'enter',slot:'1'}));
  await peer.stage('initial-sent');
  await until(page,value=>value.state==='playing'&&value.hasFrame&&value.canTouch);
  assert.equal(await entering,true);
  await started;
  assert.ok(environment.frames.some(frame=>frame.width===320&&frame.height===240&&frame.nonzero));
  assert.ok(!/OriginalG|OriginalT|mappingHex|moduleDigest/i.test(JSON.stringify(page.data).replaceAll('OriginalGuide','')));
}

function cleared(environment,page){
  assert.equal(page.data.connected,false);
  assert.equal(page.data.resourceCount,0);
  assert.equal(page.data.hasStartup,false);
  assert.equal(page.data.hasFrame,false);
  assert.equal(page.data.canConnect,false);
  assert.equal(environment.stats.closed,1);
  assert.equal(environment.sockets[0].listenerCount(),0);
  assert.ok(environment.events.includes('clear'));
}

export { environment, until, cleared, enter, event, project, variant };

test('native route consumes resources once and rejects late files and canvas callbacks',async()=>{
  const env=environment(), main=env.createPage('pages/launcher/index.js');
  const files=createResourceRows();let route;
  env.wx.navigateTo=options=>{route=options.url;options.success();};
  main.data.resourcesSelected=true;
  main._host={copySelectedResources:()=>({files}),hide(){}};
  main.onOpenGame();assert.equal(route,'/game/pages/play/index');
  const page=env.startPage();
  try {
    await until(page,value=>value.canvasReady);
    assert.equal(page.data.resourceCount,files.length);
    assert.equal(env.lifecycle().takeGameResources(),null);
    env.select(new Uint8Array(65537));assert.equal(await page.onStartup(),false);
    assert.equal(env.reads.length,0);
    env.hold(true);const deferred=page.onStartup();
    assert.equal(page.data.picking,true);assert.equal(env.pending.length,1);
    env.resize(true);page.onResize();
    env.application().onHide();
    while(env.pending.length)env.pending.shift()();
    assert.equal(await deferred,false);
    assert.equal(page.data.resourceCount,0);
    assert.equal(page.data.hasStartup,false);
    assert.equal(page.data.picking,false);
    assert.ok(files.every(file=>file.bytes.every(byte=>byte===0)));
    assert.equal(env.stats.created,0);
  } finally { page.onUnload();main.onUnload(); }
});

test('native Page handlers verify character entry, scene pixels, actor choices, text reply, pause and movement over TCP',{timeout:30000},async()=>{
  const peer=await peerFor('actor'),env=environment(peer),page=env.startPage();
  try {
    await enter(env,page,peer);
    assert.ok(env.reads.some(row=>row.filePath.endsWith('-json'))&&env.reads.some(row=>row.filePath.endsWith('-zip')));
    assert.ok(env.reads.every(row=>row.length<=33554432));assert.ok(env.statCalls.length>=3);
    page.onPause();await until(page,value=>value.paused&&value.state==='paused');
    const count=env.frames.length;env.tapMap(page);await wait(650);
    assert.equal(env.frames.length,count);assert.equal(env.stats.closed,0);
    page.onPause();await until(page,value=>value.canTouch&&!value.paused);
    page.onInteract();assert.equal(page.data.interact,true);
    env.tapMap(page,true);await peer.stage('actor-verified');
    peer.send('menu');await peer.stage('menu-opened');
    const menu=(await until(page,value=>value.dialog?.choices?.length===2)).dialog;
    assert.deepEqual(menu.choices.map(row=>row.label),['Harbor','Village']);
    assert.equal(page.data.canTouch,false);
    assert.equal(await page.onDialog(event({revision:menu.revision,bit:0,choice:2})),true);
    await peer.stage('choice-verified');
    assert.equal(await page.onDialog(event({revision:menu.revision,bit:0,choice:1})),false);
    peer.send('input');await peer.stage('input-opened');
    const input=(await until(page,value=>value.dialog?.input)).dialog;
    page.onDialogInput({...event({revision:page.data.dialog.revision}),detail:{value:'魔力,|\\'}});
    assert.equal(await page.onDialog(event({revision:input.revision,bit:1})),true);
    await peer.stage('input-verified');
    peer.send('server-window');await peer.stage('server-window-opened');
    const serverWindow=(await until(page,value=>value.dialog?.buttons.some(row=>row.bit===32))).dialog;
    peer.send('wrong-close');await peer.stage('wrong-close-sent');await wait(60);
    assert.equal(page.data.dialog.revision,serverWindow.revision);
    peer.send('server-close');await peer.stage('server-close-sent');
    await until(page,value=>value.dialog===null);
    peer.send('local-window');await peer.stage('local-window-opened');
    const local=(await until(page,value=>value.dialog!==null)).dialog;
    assert.equal(await page.onDismiss(event({revision:local.revision})),true);
    page.onInteract();
    peer.send('move');env.tapMap(page);await peer.stage('moves-verified');
    peer.send('release');await peer.stage('released');
    page.onDisconnect();const receipt=await peer.receipt();
    cleared(env,page);
    assert.equal(receipt.normal_startup_requests_verified,5);
    assert.equal(receipt.movement_requests_verified,2);
    assert.equal(receipt.commands_verified.length,4);
    console.log(JSON.stringify({variant,flow:'map',receipt,frames:env.frames.length,firstScene:env.frames[0]}));
  } finally { page.onUnload();await peer.close(); }
});

test('native battle buttons use shared target and server result, then return to the map and close on app hide',{timeout:30000},async()=>{
  const peer=await peerFor('target'),env=environment(peer);
  env.lifecycle().stageGameResources(createResourceRows());
  const page=env.startPage();
  try {
    await enter(env,page,peer,false);
    assert.equal(env.reads.length,1);
    peer.send('entry');await peer.stage('entry-sent');
    await until(page,value=>value.battle?.commands.some(row=>row.action==='item'&&row.enabled));
    assert.equal(page.onBattle(event({action:'command',value:'item'})),true);
    const item=(await until(page,value=>value.battle?.itemPopup?.state==='ready')).battle.itemPopup.records.find(row=>row.slot===8);
    assert.equal(item.name,'Original|Tonic');
    assert.equal(page.onBattle(event({action:'item',value:'8',revision:item.revision})),true);
    const targets=(await until(page,value=>value.battle?.targets?.length===1)).battle.targets;
    assert.equal(targets[0].slot,10);
    assert.equal(page.onBattle(event({action:'target',value:'0'})),false);
    assert.equal(page.onBattle(event({action:'target',value:'10'})),true);
    await peer.stage('action-verified');
    await until(page,value=>value.battle?.actors?.some(row=>row.slot===10&&row.vitals[0]===100));
    assert.ok(env.frames.some(frame=>frame.width===640&&frame.height===480&&frame.nonzero));
    peer.send('finish');await peer.stage('finish-sent');await peer.stage('exit-verified');
    await until(page,value=>value.state==='playing'&&value.battle===null&&value.canTouch);
    peer.send('move');env.tapMap(page);await peer.stage('moves-verified');
    peer.send('release');await peer.stage('released');
    env.application().onHide();page.onHide();
    const receipt=await peer.receipt();cleared(env,page);
    assert.deepEqual(receipt.commands_verified,['I|8|A']);
    assert.equal(receipt.exit_requests_verified,1);assert.equal(receipt.movement_requests_verified,2);
    console.log(JSON.stringify({variant,flow:'battle',receipt,frames:env.frames.length,
      firstBattle:env.frames.find(frame=>frame.width===640&&frame.nonzero)}));
  } finally { page.onUnload();await peer.close(); }
});

test('native chat form uses source size, color and party settings and draws server echoes',{timeout:30000},async()=>{
  const peer=await peerFor('chat'),env=environment(peer),page=env.startPage();
  const send=text=>page.onChat({detail:{value:{message:text}}});
  const setting=(option,value)=>page.onChatOption({...event({option}),detail:{value}});
  async function request(name,result){peer.send('chat-'+name);await peer.stage('chat-'+result);}
  try {
    await enter(env,page,peer);
    await request('initial','loaded');await until(page,value=>value.chat.length===2);
    assert.deepEqual(page.data.chat.map(row=>row.text),['Visitor: Hello|world','System line']);
    assert.equal(page.data.canSetParty,false);
    assert.equal(await send('魔'.repeat(39)),false);
    assert.equal(page.data.errorCode,'LEGACY_GAME_CHAT_TEXT');
    await request('invalid','invalid-idle');
    setting('range','2');setting('color','4');setting('size','2');
    const text='魔力 |,\\';
    assert.equal(await send(text),true);await peer.stage('chat-text-verified');
    assert.equal(page.data.chat.length,2);
    assert.equal(await send('Too fast'),false);
    assert.equal(page.data.errorCode,'LEGACY_GAME_CHAT_RATE');
    await request('echo','echoed');await until(page,value=>value.chat.length===3&&env.paint.includes(text));
    await request('party','party-ready');await until(page,value=>value.canSetParty);
    await page.onPartyChat();await peer.stage('chat-group-verified');
    assert.equal(page.data.partySelected,true);
    for(const option of ['range','color','size'])setting(option,'0');
    assert.equal(await send('Group hello'),true);await peer.stage('chat-group-text-verified');
    assert.equal(page.data.chat.length,3);
    await request('group-echo','group-echoed');await until(page,value=>value.chat.length===4&&env.paint.includes('Group hello'));
    assert.equal(page.data.chat.at(-1).text,'[GP]Hero: Group hello');
    await page.onPartyChat();await peer.stage('chat-normal-verified');
    await request('exit','party-closed');await until(page,value=>!value.canSetParty);
    peer.send('move');env.tapMap(page);await peer.stage('moves-verified');
    peer.send('release');await peer.stage('released');
    page.onDisconnect();const receipt=await peer.receipt();cleared(env,page);
    assert.deepEqual(page.data.chat,[]);
    assert.equal(receipt.commands_verified.length,4);
    console.log(JSON.stringify({variant,flow:'chat',receipt,chatEchoes:4,paintedSpeech:true}));
  } finally { page.onUnload();await peer.close(); }
});
