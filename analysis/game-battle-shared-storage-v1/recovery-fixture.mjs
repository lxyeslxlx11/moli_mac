import assert from 'node:assert/strict';
import {sharedMotion} from './fixture.mjs';

export const transformationField=245321;

export function transformationMotion({code=40500,cost=3,caster=0,field=transformationField,targets=[]}={}){
  return sharedMotion('SKL',[code,cost,caster,field,...targets.flat(),255]);
}

/** Add a synthetic indexed background and an optional cast signal to copies of authored assets. */
export function transformationAssets(input,{signal=true}={}){
  const files=new Map(input.files.map(r=>[r.path,Buffer.from(r.bytesHex,'hex')]));
  const graphicPath='Bin/Graphic.bin',infoPath='Bin/GraphicInfo.bin';
  const graphics=files.get(graphicPath),info=files.get(infoPath);
  let index=1000;
  for(let at=0;at<info.length;at+=40)index=Math.max(index,info.readUInt32LE(at)+1);
  const rd=Buffer.alloc(20);
  rd.set([82,68,1,0]);
  rd.writeInt32LE(640,4);
  rd.writeInt32LE(480,8);
  rd.writeUInt32LE(rd.length,12);
  // A single 307200-byte repeat of palette index 18.
  rd.set([0xa4,18,0xb0,0],16);
  const record=Buffer.alloc(40);
  [index,graphics.length,rd.length,-320,-240,640,480].forEach((value,at)=>record.writeInt32LE(value,at*4));
  record.writeUInt32LE(transformationField,36);
  files.set(graphicPath,Buffer.concat([graphics,rd]));
  files.set(infoPath,Buffer.concat([info,record]));

  const animeInfo=files.get('Bin/AnimeInfo.bin'),anime=files.get('Bin/Anime.bin');
  let casts=0;
  for(let i=0;i<animeInfo.length;i+=12){
    if(animeInfo.readUInt32LE(i)!==100114)continue;
    const header=animeInfo.readUInt16LE(i+10)===1?20:12;
    let at=animeInfo.readUInt32LE(i+4);
    for(let action=0;action<animeInfo.readUInt16LE(i+8);action++){
      const count=anime.readUInt32LE(at+8);
      if(anime.readUInt16LE(at+2)===6){
        assert.ok(count>=2);
        for(let frame=0;frame<count;frame++)anime.writeUInt16LE(signal&&frame===1?10003:0,at+header+frame*10+8);
        casts++;
      }
      at+=header+count*10;
    }
  }
  assert.equal(casts,8);
  return {...input,files:[...files].map(([path,bytes])=>({path,bytesHex:bytes.toString('hex')}))};
}
