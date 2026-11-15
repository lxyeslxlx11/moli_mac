import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {createRequire} from 'node:module';
import {resolve} from 'node:path';
import {originalFiles} from '../game-resource-runtime-v1/original_files.mjs';
const api=process.argv[2]==='generated'?createRequire(import.meta.url)(resolve('build/wechat-game-stage292-api-final/game.js')):await import('../../shared/index.mjs');
const v=JSON.parse(readFileSync(new URL('./original-vectors.json',import.meta.url))),sha=b=>createHash('sha256').update(b).digest('hex'),hash=createHash('sha256'),buffer=new Uint8Array(8),view=new DataView(buffer.buffer);
for(let i=0;i<65536;i++){const r=api.legacyGameNamedPalette(i);view.setUint32(0,r.selector,true);view.setUint32(4,r.resourceId,true);hash.update(buffer);}const domain=hash.digest('hex');assert.equal(domain,v.selector_domain_sha256);
const files=originalFiles(v.assets),library=api.createLegacyGameResourceLibrary({plan:api.createLegacyGameResourcePlan(new Uint8Array()),files:files.port,paletteMode:'neutral'});
try{await library.initialize();const rows=[];for(const row of v.palette_cases){const p=api.createLegacyGameDrawPlan(row.width,row.height,[{image:{index:row.index,paletteSelector:row.selector,flags:row.flags,color:0xffffffff},x:0,y:0,priority:10}],undefined,row.tint?{rgb:new Array(768).fill(0),tint:row.tint}:undefined),out=await library.startRender(p).done;assert.equal(sha(out.rgba),row.rgbaSha256);rows.push([row.selector,row.flags,row.tint,row.rgbaSha256]);out.rgba.fill(0);}console.log(JSON.stringify({stage:292,domain:65536,domainSha256:domain,paletteCases:rows.length,completeRGBA:true,digest:sha(Buffer.from(JSON.stringify(rows))),namedPalettesDecoded:library.inspect().stats.namedPalettesDecoded,sourceGeneratedComparable:true}));}finally{library.close();files.close();}
