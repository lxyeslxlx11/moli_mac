import {openSync,closeSync,readSync,statSync,readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {createRequire} from 'node:module';
import {resolve} from 'node:path';
import assert from 'node:assert/strict';
const api=process.argv[2]==='generated'?createRequire(import.meta.url)(resolve('build/wechat-game-stage292-api-final/game.js')):await import('../../shared/index.mjs');
const profile=JSON.parse(readFileSync(new URL('../game-legacy-material-compat-v1/material-profile.json',import.meta.url))),v=JSON.parse(readFileSync('build/analysis/game-animation-palette-source-v1/material-oracle.json'));
const sha=b=>createHash('sha256').update(b).digest('hex'),fd=openSync(profile.archive,'r');
const archive=await api.createLegacyGameResourceArchive({size:statSync(profile.archive).size,async read(at,length){const b=new Uint8Array(length);assert.equal(readSync(fd,b,0,length,at),length);return b;},close(){closeSync(fd);}});
const library=api.createLegacyGameResourceLibrary({plan:api.createLegacyGameResourcePlan(new TextEncoder().encode(profile.parameters)),files:archive.port,paletteMode:'neutral'});
try{
 await library.initialize();assert.deepEqual(api.legacyGameNamedPalette(320),{selector:320,resourceId:113058});const rows=[];
 for(const row of v.frames){const output=await library.startRender(api.createLegacyGameDrawPlan(row.width,row.height,[{image:{index:row.index,paletteSelector:row.selector,flags:0,color:0xffffffff},x:0,y:0,priority:10}])).done;assert.equal(sha(output.rgba),row.rgba_sha256,'actual frame '+row.action+':'+row.ordinal);rows.push([row.action,row.ordinal,row.index,row.rgba_sha256]);output.rgba.fill(0);}
 assert.equal(library.inspect().stats.namedPalettesDecoded,1);console.log(JSON.stringify({stage:292,selector:320,resource:113058,actions:v.actions.length,frames:v.frames.length,completeNamedRGBA:true,digest:sha(Buffer.from(JSON.stringify(rows))),paletteSha256:v.palette_sha256,sourceGeneratedComparable:true,originalExecution:false}));
}finally{library.close();archive.close();}
