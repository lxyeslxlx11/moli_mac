/** Original indexed textures/animation references for special indices; no shipped bytes. */
import {readFileSync} from 'node:fs';
import {originalFiles} from '../game-resource-runtime-v1/original_files.mjs';
import {battleBodyAssets} from '../game-battle-body-v1/original_assets.mjs';
const read=p=>JSON.parse(readFileSync(new URL(p,import.meta.url))),base=read('../game-resource-runtime-v1/original-vectors.json'),body=read('../game-battle-body-v1/original-vectors.json');
export function waterAssets(index=3096){
 const value=battleBodyAssets(base,body),files=value.files.map(r=>({...r,bytes:Uint8Array.from(Buffer.from(r.bytesHex,'hex'))}));
 const get=path=>files.find(r=>r.path.toLowerCase()===path.toLowerCase());
 const graphics=get('bin/Graphic.bin'),metadata=get('bin/GraphicInfo.bin'),parts=[graphics.bytes],records=new Uint8Array(metadata.bytes.length+400);records.set(metadata.bytes);let offset=graphics.bytes.length;
 const colors=[[31,61,91],[111,141,171],[191,211,231]],palette=get('bin/pal/palet_00.cgp');
 for(let i=0;i<3;i++)palette.bytes.set([...colors[i]].reverse(),(20+i-16)*3);
 for(let i=0;i<10;i++){
  const raw=new Uint8Array(80),rv=new DataView(raw.buffer);raw.set([82,68]);rv.setInt32(4,8,true);rv.setInt32(8,8,true);rv.setUint32(12,80,true);
  for(let y=0;y<8;y++)for(let x=0;x<8;x++)raw[16+(7-y)*8+x]=(x+y+i)%5===0?0:20+(x+2*y+i)%3;
  const at=metadata.bytes.length+i*40,d=new DataView(records.buffer);d.setInt32(at,3096+i,true);d.setUint32(at+4,offset,true);d.setUint32(at+8,80,true);d.setUint32(at+20,8,true);d.setUint32(at+24,8,true);records[at+28]=records[at+29]=1;d.setUint32(at+36,5000+i,true);offset+=80;parts.push(raw);
 }
 const all=new Uint8Array(offset);let cursor=0;for(const part of parts){all.set(part,cursor);cursor+=part.length;}graphics.bytes=all;metadata.bytes=records;
 const iv=new DataView(get('bin/AnimeInfo.bin').bytes.buffer),anime=get('bin/Anime.bin').bytes,av=new DataView(anime.buffer);let patched=0;
 for(let at=0;at<iv.byteLength;at+=12){if(iv.getUint32(at,true)!==100010)continue;let cursor=iv.getUint32(at+4,true),count=iv.getUint16(at+8,true),head=iv.getUint16(at+10,true)===1?20:12;
  for(let action=0;action<count;action++){const n=av.getUint32(cursor+8,true);cursor+=head;for(let f=0;f<n;f++,cursor+=10){if(av.getUint32(cursor,true)>=1000){av.setUint32(cursor,index,true);patched++;}}}
 }
 if(patched===0)throw Error('No authored animation frames patched');
 return {...value,files:files.map(({bytes,...r})=>({...r,bytesHex:Buffer.from(bytes).toString('hex')}))};
}
export async function battleWaterFixture(api,index=3096,waterOwner=undefined){const assets=waterAssets(index),files=originalFiles(assets),library=api.createLegacyGameResourceLibrary({plan:api.createLegacyGameResourcePlan(new Uint8Array()),files:files.port,paletteMode:'neutral'});
 try{await library.initialize();const battle=api.createLegacyGameBattleState(null,null,null,waterOwner);battle.configureResources(0);battle.configureBodyPlayback({animations:library.catalogs().animations,geometry:library.geometry,seed:12345,initialPhase:0,alternativeRenderer:false,staticFlip:false,screenOffset:[0,0]});battle.configureFrames({graphics:library.catalogs().graphics});
  return {assets,files,library,battle,context:{mapId:40000,position:[0,0],camera:[0,0],center:[320,240],nativeGate:1,localPresent:false},close(){battle.close();library.close();files.close();}};
 }catch(e){library.close();files.close();throw e;}
}
export const characterText='C|0|0|Original|186AA|0|64|64|64|A|A|0|0|0|';
