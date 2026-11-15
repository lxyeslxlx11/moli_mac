import { readFile,writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import assert from 'node:assert/strict';
import { resolve } from 'node:path';
import { createLegacyGameCutCatalog } from '../../shared/index.mjs';
const raw=await readFile(resolve(process.argv[2])),oracle=JSON.parse(raw),hash=b=>createHash('sha256').update(b).digest('hex'),rows=[];let records=0;
for(const row of oracle.cuts){const bytes=await readFile(resolve(row.source.path));assert.equal(hash(bytes),row.source.sha256);assert.equal(bytes.length,row.source.bytes);const c=createLegacyGameCutCatalog(bytes);
 try{const state=c.inspect(),digest=createHash('sha256'),kinds={};assert.equal(state.records,row.records);assert.deepEqual(state.counts,row.counts);assert.equal(state.consumedBytes,row.consumedBytes);assert.equal(state.trailingBytes,row.trailingBytes);
  for(let i=0;i<state.records;i++){const e=c.entry(1000+i);digest.update(JSON.stringify([e.tileId,e.index,e.resourceId,e.kind,...e.clip,...e.anchor])+'\n');kinds[e.kind]=(kinds[e.kind]??0)+1;}
  assert.equal(digest.digest('hex'),row.numericDigest);assert.deepEqual(kinds,row.kinds);records+=state.records;rows.push({source:row.source,records:state.records,numericDigest:row.numericDigest,matched:true});
 }finally{c.close();}}
const result={schema:'moli.cut-corpus-comparison-stage162.v1',oracleMetadataSha256:hash(raw),compared:rows.length,accepted:rows.length,rejected:0,records,kinds:oracle.kinds,allComparisonsMatched:true,pairs:rows,nativeOrVisualAcceptance:false,gameBytesExported:false};
await writeFile(new URL('./corpus-comparison.json',import.meta.url),JSON.stringify(result,null,2)+'\n');process.stdout.write(JSON.stringify({compared:rows.length,records,matched:true})+'\n');
