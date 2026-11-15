/** Actual source graphics catalog/probe helper versus independent Python, metadata only. */
import { readFile,writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { resolve } from 'node:path';
import assert from 'node:assert/strict';
import { createLegacyGameGraphicCatalog,detectLegacyGameCharacterContent } from '../../shared/index.mjs';
const root=process.cwd(),oracle=JSON.parse(await readFile(resolve(root,'build/analysis/game-post-login-v1/corpus-probe-oracle.json'))),groups=[];
for(let group=0;group<7;group++){const row=oracle.files.find(x=>x.group===group);if(!row){groups.push(new Uint8Array());continue;}const bytes=new Uint8Array(await readFile(resolve(root,row.path)));assert.equal(bytes.length,row.bytes);assert.equal(createHash('sha256').update(bytes).digest('hex'),row.sha256);groups.push(bytes);}
const graphics=createLegacyGameGraphicCatalog(groups);
try{const generation=detectLegacyGameCharacterContent(graphics),probes=oracle.probes.map(row=>({resource:row.resource,index:graphics.lookup(row.resource).index}));assert.equal(generation,oracle.expectedGeneration);assert.deepEqual(probes,oracle.probes.map(({resource,index})=>({resource,index})));assert.equal(graphics.inspect().records,oracle.records);
 const report={schema:'moli.character-content-corpus-stage166.v1',classification:'actual local GraphicInfo bytes/independent Python lookup and genuine source graphics catalog',files:oracle.files,groups:oracle.groups,records:oracle.records,probes,generation,allMatched:true,sourceExecutableEquivalence:'unverified',originalExecutableExecuted:false,officialPixelsExported:false,officialAuthentication:false};await writeFile(resolve(root,'analysis/game-post-login-v1/corpus-probe.json'),JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify({files:report.files.length,records:report.records,generation,probes,allMatched:true}));
}finally{graphics.close();groups.forEach(x=>x.fill(0));}
