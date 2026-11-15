/** Compare retained local bytes to independent Python metadata; no image exports. */
import { readFile,writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { resolve } from 'node:path';
import assert from 'node:assert/strict';
import { decodeLegacyGameRD,decodeLegacyGameCGP,createLegacyGamePalette32,prepareLegacyGameSprite } from '../../shared/index.mjs';
const root=resolve('.'),metaPath=process.argv[2],metadata=JSON.parse(await readFile(metaPath,'utf8'));
const sha=raw=>createHash('sha256').update(raw).digest('hex');
const cgpRaw=await readFile(metadata.cgp.path);assert.equal(sha(cgpRaw),metadata.cgp.sha256);
const cgp=decodeLegacyGameCGP(cgpRaw),base=createLegacyGamePalette32(cgp.copyCurrentRGB(),'default-rgb');
const summaries=[];let compared=0,rejected=0,rasterChecks=0;
for(const pair of metadata.pairs){
  const source=pair.sources.find(r=>r.path.endsWith('/'+pair.graphic)),g=await readFile(source.path);assert.equal(g.length,source.bytes);assert.equal(sha(g),source.sha256);
  let accepted=0,unknown=0;
  for(const row of pair.rows){
    compared++;let image,palette,sprite;
    try{
      if(row.status==='rejected'){assert.throws(()=>decodeLegacyGameRD(g.subarray(row.offset,row.offset+row.bytes)),e=>e.code===row.code);rejected++;continue;}
      image=decodeLegacyGameRD(g.subarray(row.offset,row.offset+row.bytes));const i=image.inspect();
      for(const k of ['width','height','flags','consumedBytes','ignoredBytes'])assert.equal(i[k],row[{consumedBytes:'consumed',ignoredBytes:'ignored'}[k]??k],pair.graphic+'#'+row.ordinal+' '+k);
      assert.equal(sha(image.copyPixels()),row.pixelsSha256);assert.equal(sha(image.copyPalette()),row.paletteSha256);accepted++;
      palette=row.paletteBytes?createLegacyGamePalette32(image.copyPalette(),'embedded-bgr'):base;
      if(row.render!=='available'){assert.throws(()=>prepareLegacyGameSprite(image,palette),e=>e.code===row.render);unknown++;}
      else if(row.rgbaSha256){sprite=prepareLegacyGameSprite(image,palette);assert.equal(sha(sprite.copyRGBA()),row.rgbaSha256);rasterChecks++;}
    }finally{sprite?.close();image?.close();if(palette&&palette!==base)palette.close();}
  }
  summaries.push({graphic:pair.graphic,index:pair.index,records:pair.recordCount,accepted,renderRefused:unknown,flags:pair.flags,widthModulo4:pair.widthModulo4,errors:pair.errors,render:pair.render});
}
base.close();cgp.close();
const result={schema:'moli.legacy-render-corpus-comparison-stage159.v1',oracleMetadataSha256:sha(await readFile(metaPath)),pairs:summaries,compared,rejected,accepted:compared-rejected,rasterChecks,allComparisonsMatched:true,officialPixelsExported:false,nativeOrVisualAcceptance:false,currentVersionIdentityProven:false};
await writeFile('analysis/game-legacy-render-v1/corpus-comparison.json',JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify(result));
