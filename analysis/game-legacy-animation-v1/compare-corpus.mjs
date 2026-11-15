/** Compare numeric source-format metadata; retained game bytes never leave local memory. */
import { readFile,writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import assert from 'node:assert/strict';
import { createLegacyGameAnimationCatalog } from '../../shared/index.mjs';
const metaPath=process.argv[2],meta=JSON.parse(await readFile(metaPath,'utf8')),sha=x=>createHash('sha256').update(x).digest('hex');
const sorted=x=>Array.isArray(x)?x.map(sorted):x&&typeof x==='object'?Object.fromEntries(Object.keys(x).sort().map(k=>[k,sorted(x[k])])):x;
const pairs=[];let accepted=0,rejected=0;
for(const pair of meta.pairs){const indexRow=pair.sources.find(r=>r.path.endsWith('/'+pair.index)),animRow=pair.sources.find(r=>r.path.endsWith('/'+pair.animation));
 const index=await readFile(indexRow.path),animation=await readFile(animRow.path);for(const [b,r]of [[index,indexRow],[animation,animRow]]){assert.equal(b.length,r.bytes);assert.equal(sha(b),r.sha256);}
 let ok=0,bad=0;
 for(const row of pair.rows){let c;try{
  const get=()=>{c=createLegacyGameAnimationCatalog([{index:index.subarray(row.ordinal*12,row.ordinal*12+12),animation,graphicBase:0}]);return c.animation(row.resourceId);};
  if(row.status==='rejected'){assert.throws(get,e=>e.code===row.code);rejected++;bad++;}
  else {const d=get();assert.equal(sha(JSON.stringify(sorted(d))),row.metadataSha256,pair.index+'#'+row.ordinal);accepted++;ok++;}
 }finally{c?.close();}}
 pairs.push({index:pair.index,animation:pair.animation,records:pair.recordCount,accepted:ok,rejected:bad,actions:pair.actions,frames:pair.frames,maximumFramesPerAction:pair.maximumFramesPerAction});
}
const result={schema:'moli.legacy-animation-corpus-stage160.v1',oracleMetadataSha256:sha(await readFile(metaPath)),pairs,compared:accepted+rejected,accepted,rejected,allComparisonsMatched:true,imageOrAudioExports:false,nativeOrVisualAcceptance:false,currentVersionIdentityProven:false};
await writeFile('analysis/game-legacy-animation-v1/corpus-comparison.json',JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify(result));
