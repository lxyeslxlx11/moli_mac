/** Local collision/navigation contracts with platform APIs absent. */
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile,writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { runInNewContext } from 'node:vm';
import esbuild from '../../build/dependencies/esbuild-0.25.12/node_modules/esbuild/lib/main.js';
const root=fileURLToPath(new URL('../../',import.meta.url)),directory=resolve(root,'build/analysis/game-legacy-local-movement-v1');
const entry='build/analysis/game-legacy-local-movement-v1/portable-entry.mjs';
await writeFile(resolve(root,entry),['graphics','navigation','local-movement','actors','motion','scene','state','map','protocol','envelope','payload'].map(name=>"export * from '../../../shared/legacy-game-"+name+".mjs';").join('\n')+'\n');
assert.equal(esbuild.version,'0.25.12');
const built=await esbuild.build({absWorkingDir:root,entryPoints:[entry],outfile:resolve(directory,'portable.cjs'),bundle:true,
  format:'cjs',platform:'neutral',target:'es2020',write:false,metafile:true,logLevel:'silent'});
const hash=raw=>createHash('sha256').update(raw).digest('hex'),inputs=[],outputs=[];
assert.ok(Object.values(built.metafile.outputs).every(row=>row.imports.length===0));
for(const path of Object.keys(built.metafile.inputs)){const raw=await readFile(resolve(root,path));inputs.push({path,bytes:raw.length,sha256:hash(raw)});}
for(const row of built.outputFiles){await writeFile(row.path,row.contents);outputs.push({path:row.path.slice(root.length),bytes:row.contents.length,sha256:hash(row.contents)});}
await writeFile(resolve(directory,'portable-build-report.json'),JSON.stringify({tool:'esbuild0.25.12',inputs,outputs,external_imports:0,native_or_game_acceptance:false},null,2)+'\n');
const source=await readFile(resolve(directory,'portable.cjs'),'utf8');
function instance(){const module={exports:{}};runInNewContext(source,{module,Uint8Array,Uint16Array,ArrayBuffer,DataView,
  TextEncoder:undefined,TextDecoder:undefined,Buffer:undefined,URL:undefined,process:undefined,require:undefined,
  window:undefined,document:undefined,wx:undefined,fetch:undefined,crypto:undefined,
  AbortController:undefined,AbortSignal:undefined,performance:undefined},{timeout:1000});return module.exports;}
const v=JSON.parse(await readFile(new URL('./original-vectors.json',import.meta.url)));
const bytes=hex=>new Uint8Array(Buffer.from(hex,'hex')),hex=value=>Buffer.from(value).toString('hex'),plain=value=>JSON.parse(JSON.stringify(value));
function normalize(value){if(value instanceof Uint8Array)return{bytesHex:hex(value)};if(Array.isArray(value))return Array.from(value,normalize);if(value&&typeof value==='object')return Object.fromEntries(Object.entries(value).map(([k,x])=>[k,normalize(x)]));return value;}
function collision(api,width,height,flags,center){const rect=api.legacyGameCollisionWindow(width,height,center),[left,top,right,bottom]=rect,words=[];for(let y=top;y<bottom;y++)for(let x=left;x<right;x++)words.push(flags[y*width+x]);
  return api.createLegacyGameCollisionGridFromRectangle(width,height,plain(rect),[new Uint16Array(words.length),new Uint16Array(words.length),new Uint16Array(words)],1);}
test('neutral core matches original graphics,41 collisions,149 paths,32 selectors and18 local403-frame traces',()=>{
  const api=instance(),catalog=api.createLegacyGameGraphicCatalog(v.graphicGroupsHex.map(bytes));
  for(const row of v.graphicQueries)assert.deepEqual(plain(catalog.lookup(row.resourceId)),row);
  for(const row of v.collisionCases){const g=api.createLegacyGameCollisionGridFromRectangle(row.width,row.height,[0,0,row.width,row.height],row.planes.map(p=>Uint16Array.from(p)),row.mode,catalog);assert.deepEqual([...g.copyCells()],row.expected);g.close();}
  catalog.close();for(const row of v.pathCases){const n=row.width*row.height,g=api.createLegacyGameCollisionGridFromRectangle(row.width,row.height,[0,0,row.width,row.height],[new Uint16Array(n),new Uint16Array(n),Uint16Array.from(row.cells,c=>0xc000|(c===1?256:0))],1);
    if(row.error)assert.throws(()=>api.planLegacyGamePath(g,row.start,row.goal),e=>e.code===row.error);else assert.deepEqual(plain(api.planLegacyGamePath(g,row.start,row.goal)),row.expected);g.close();}
  for(const row of v.selectorCases)assert.equal(api.classifyLegacyGameTileEventContext(row.input),row.expected);
  for(const row of v.localCases){const flags=new Uint16Array(row.width*row.height).fill(0xc000);for(const[x,y,n]of row.flagChanges)flags[y*row.width+x]=n;const m=api.createLegacyGameLocalMovement(row.origin,row.speed,4,row.context);m.requestDestination(row.destination);
    for(let i=0;i<row.frameCount;i++){if(row.fills&&i===row.fills.at)for(const[index,value]of row.fills.values)flags[index]=value;const g=collision(api,row.width,row.height,flags,plain(m.copyState().display)),effect=m.step(g,1000+i,[7,23],99),s=m.copyState();
      const selected=normalize({state:effect.state,requests:effect.requests,event:effect.event,...Object.fromEntries(['position','display','target','velocity','facingCode','speed','moving','animation','phase','queuedDirections','arrivedLast','frames','waitingForMap','pendingInteraction','context'].map(k=>[k,s[k]])),routeCount:s.route.length});assert.deepEqual(selected,row.expected[i],row.name+' frame'+i);g.close();}m.close();}
});
test('neutral world byte streams emit exact original movement/map requests and synchronize actor/pose after correction or fill',()=>{
  const api=instance();for(const [name,profile]of [['movement',v.protocol],['missing',v.protocolMap]]){
    const p=api.createLegacyGameWorldProtocol(),c=api.createLegacyGamePayloadCodec(bytes(v.bootstrap.keyHex));p.configureLocalMovement(null,v.sourceContext);p.append(api.encodeLegacyGameEnvelope(bytes(v.bootstrap.payloadHex)));assert.equal(p.next().kind,'bootstrap');
    const send=raw=>{p.append(api.encodeLegacyGameEnvelope(c.encode(bytes(raw))));return p.next();};const sent=[];
    const step=tick=>{const effect=p.advanceLocalMovement(tick);for(const request of effect.requests){const r=api.createLegacyGameEnvelopeReader();r.append(p.encodeCommand(request.operationId,request.arguments));sent.push(hex(c.decode(r.next().payload)));r.close();}return effect;};
    try{for(const raw of profile.beforePlainHex)send(raw);p.requestLocalDestination(profile.destination);
      if(name==='movement'){for(let i=0;i<profile.frames;i++)step(1000+i);assert.deepEqual(plain(p.copyGameState().localMovement.position),profile.finalPosition);for(const raw of profile.afterPlainHex)send(raw);assert.deepEqual(plain(p.copyGameState().localMovement.position),[384,256]);}
      else{assert.equal(step(1000).state,'waiting-map');assert.equal(step(1001).state,'waiting-map');for(const raw of profile.afterPlainHex)send(raw);for(let i=0;i<36;i++)step(1003+i);assert.deepEqual(plain(p.copyGameState().localMovement.position),profile.finalPosition);assert.equal(p.copyGameState().localMovement.waitingForMap,null);}
      assert.deepEqual(sent,profile.requestPlainHex);assert.deepEqual(plain(p.copyGameState().actors.localActor.motion.position),plain(p.copyGameState().pose.scaledCoordinates));p.finish();assert.equal(p.copyGameState().localMovement,null);assert.equal(p.copyGameState().actors,null);
    }finally{p.close();c.close();}
  }
});
