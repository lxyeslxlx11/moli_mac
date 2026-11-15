import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { encodeLauncherCatalogCacheRecord as encode, decodeLauncherCatalogCacheRecord as decode,
  snapshotPortableLauncherCatalogs, LAUNCHER_CATALOG_CACHE_FORMAT } from '../launcher-catalog-cache.mjs';
const vectors=JSON.parse(readFileSync(new URL('../../analysis/launcher-wechat-cache-v1/original-vectors.json',import.meta.url))).cases;
const bytes=hex=>Uint8Array.from(Buffer.from(hex,'hex'));
const candidate=row=>snapshotPortableLauncherCatalogs({gameListBytes:bytes(row.gameListHex),regionListBytes:bytes(row.regionListHex),
  gameListMd5:row.gameListMd5,regionListMd5:row.regionListMd5,encoding:row.encoding,allowBareAmpersands:row.allowBareAmpersands});
function rehash(record){record.set(createHash('md5').update(record.subarray(0,28)).update(record.subarray(44)).digest(),28);return record;}

test('catalog cache framing exactly matches all independent Python struct/hashlib vectors',()=>{
  for(const row of vectors){const catalogs=candidate(row),record=encode({revision:row.revision,catalogs});
    assert.equal(Buffer.from(record).toString('hex'),row.recordHex);const result=decode(record);
    assert.equal(result.revision,row.revision);assert.equal(result.catalogs.encoding,row.encoding);assert.equal(result.catalogs.allowBareAmpersands,row.allowBareAmpersands);
    assert.equal(Buffer.from(result.catalogs.gameListBytes).toString('hex'),row.gameListHex);assert.equal(result.catalogs.gameListMd5,row.gameListMd5);
    assert.equal(result.trust,'unverified');assert.equal(result.format,LAUNCHER_CATALOG_CACHE_FORMAT.id);
  }
});

test('independent Python decoder accepts the JavaScript-produced raw framing and high revision',()=>{
  const row=vectors[1],record=encode({revision:row.revision,catalogs:candidate(row)});
  const output=execFileSync('python3',[fileURLToPath(new URL('../../analysis/launcher-wechat-cache-v1/original_cache.py',import.meta.url)),'--decode'],
    {input:JSON.stringify({recordHex:Buffer.from(record).toString('hex')}),maxBuffer:65536,timeout:5000,encoding:'utf8'});
  const result=JSON.parse(output);for(const key of ['revision','encoding','gameListHex','regionListHex','gameListMd5','regionListMd5'])assert.equal(result[key],row[key]);
});

test('cache container rejects header flags/revision/budgets/trailing data and corruption before returning any candidate',()=>{
  const original=bytes(vectors[0].recordHex);
  for(const mutate of [r=>r[0]^=1,r=>r[16]=2,r=>r[17]=2,r=>r[18]=1,r=>r.fill(0,8,16),
    r=>new DataView(r.buffer).setUint32(12,0x200000,true),r=>new DataView(r.buffer).setUint32(20,1048577,true),
    r=>r[28]^=1,r=>r[r.length-2]^=1]){
    const r=original.slice();mutate(r);assert.throws(()=>decode(r));
  }
  assert.throws(()=>decode(original.subarray(0,43)));assert.throws(()=>decode(original.subarray(0,original.length-1)));
  const trailing=new Uint8Array(original.length+1);trailing.set(original);assert.throws(()=>decode(trailing));
  const broken=original.slice();broken[44]=33;rehash(broken);assert.throws(()=>decode(broken),error=>error.code==='CATALOG_CACHE_CANDIDATE');
});

test('cache checksum binds metadata as well as raw bytes; a valid record never elevates source trust',()=>{
  const record=bytes(vectors[0].recordHex);record[17]=1;assert.throws(()=>decode(record),error=>error.code==='CATALOG_CACHE_DIGEST');
  rehash(record);assert.equal(decode(record).catalogs.allowBareAmpersands,true);
  const bad=candidate(vectors[0]);bad.gameListBytes[0]^=1;assert.throws(()=>encode({revision:1,catalogs:bad}),error=>error.code==='CATALOG_CACHE_CANDIDATE');
  for(const revision of [0,-1,1.5,Number.MAX_SAFE_INTEGER,Infinity])assert.throws(()=>encode({revision,catalogs:candidate(vectors[0])}));
  assert.throws(()=>encode({revision:1,catalogs:candidate(vectors[0]),password:'forbidden'}));
});

test('catalog record keeps exact BOM/CRLF bytes and returns independent input/output ownership',()=>{
  const row=vectors[0],game=Buffer.concat([Buffer.from([239,187,191]),Buffer.from(row.gameListHex,'hex'),Buffer.from('\r\n')]),region=Buffer.from(row.regionListHex,'hex');
  const catalogs={gameListBytes:game,regionListBytes:region,encoding:'utf-8',allowBareAmpersands:false,
    gameListMd5:createHash('md5').update(game).digest('hex'),regionListMd5:createHash('md5').update(region).digest('hex')};
  const record=encode({revision:1,catalogs}),result=decode(record);record.fill(0);game.fill(0);
  assert.equal(Buffer.from(result.catalogs.gameListBytes).toString('hex'), 'efbbbf'+row.gameListHex+'0d0a');
});

test('cache keeps the existing stricter XML character budget inside its independent raw byte limit',()=>{
  const row=vectors[0];const extend=(hex,length=262144)=>{const small=Buffer.from(hex,'hex'),full=Buffer.alloc(length,32);small.copy(full);return full;};
  const gameListBytes=extend(row.gameListHex),regionListBytes=extend(row.regionListHex),catalogs={gameListBytes,regionListBytes,encoding:'utf-8',allowBareAmpersands:false,
    gameListMd5:createHash('md5').update(gameListBytes).digest('hex'),regionListMd5:createHash('md5').update(regionListBytes).digest('hex')};
  const record=encode({revision:1,catalogs});assert.equal(record.length,524332);assert.equal(decode(record).catalogs.regionListBytes.length,262144);
  const larger=extend(row.gameListHex,1048576);assert.throws(()=>encode({revision:1,catalogs:{...catalogs,gameListBytes:larger,
    gameListMd5:createHash('md5').update(larger).digest('hex')}}),error=>error.code==='CATALOG_CACHE_CANDIDATE');
  assert.throws(()=>decode(new Uint8Array(2097197)),error=>error.code==='CATALOG_CACHE_BUDGET');
});
