/** Original color-coded RD sprites for chat and time feedback. */
import {Buffer} from 'node:buffer';
import {readFileSync} from 'node:fs';

export const chatColor=Object.freeze([219,74,165,255]);
export const timeColor=Object.freeze([37,194,230,255]);

export function sideEffectAssets(input){
  const files=new Map(input.files.map(row=>[row.path,Buffer.from(row.bytesHex,'hex')]));
  const info=files.get('Bin/GraphicInfo.bin'),art=files.get('Bin/Graphic.bin');
  const ids=[0x573f,0x3b859,0x3b85a,...Array.from({length:10},(_,i)=>0x3b7f4+i)];
  const retained=[];
  let index=1000;
  for(let at=0;at<info.length;at+=40){
    index=Math.max(index,info.readUInt32LE(at)+1);
    if(!ids.includes(info.readUInt32LE(at+36)))retained.push(info.subarray(at,at+40));
  }
  const pixels=[];
  let offset=art.length;
  for(const resource of ids){
    const isChat=resource===0x573f,width=isChat?16:8,height=12;
    const rd=Buffer.alloc(16+width*height,isChat?33:34),record=Buffer.alloc(40);
    rd.set([82,68,0,0]);
    rd.writeInt32LE(width,4);
    rd.writeInt32LE(height,8);
    rd.writeUInt32LE(rd.length,12);
    [index++,offset,rd.length,-width/2,-height/2,width,height].forEach((value,i)=>record.writeInt32LE(value,i*4));
    record.writeInt32LE(resource,36);
    retained.push(record);
    pixels.push(rd);
    offset+=rd.length;
  }
  files.set('Bin/GraphicInfo.bin',Buffer.concat(retained));
  files.set('Bin/Graphic.bin',Buffer.concat([art,...pixels]));
  const palettePath='Bin/pal/palet_00.cgp';
  const base=JSON.parse(readFileSync(new URL('../game-resource-runtime-v1/original-vectors.json',import.meta.url)));
  const palette=files.get(palettePath)??Buffer.from(base.files.find(row=>row.path===palettePath).bytesHex,'hex');
  for(const [entry,color] of [[33,chatColor],[34,timeColor]])palette.set([color[2],color[1],color[0]],(entry-16)*3);
  files.set(palettePath,palette);
  return {...input,files:[...files].map(([path,raw])=>({path,bytesHex:raw.toString('hex')}))};
}
