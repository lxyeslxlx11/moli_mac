/** Original visible RD and animation markers for the fixed REB and PLV resources. */
import {Buffer} from 'node:buffer';
import {readFileSync} from 'node:fs';

export const transitionColors=Object.freeze({
  bind:Object.freeze([221,88,164,255]),
  clear:Object.freeze([40,186,214,255]),
  departure:Object.freeze([239,173,53,255]),
});
const bind=[0x1af54,0x1af55,0x1af60,0x1af61,0x1af6c,0x1af6d,0x1af78,0x1af79];
const clear=[0x1af57,0x1af58,0x1af63,0x1af64,0x1af6f,0x1af70,0x1af7b,0x1af7c];
const follower=[0x1af5a,0x1af66,0x1af72,0x1af7e].flatMap(base=>[base,base+1,base+2,base+3]);

export function actorTransitionAssets(input){
  const files=new Map(input.files.map(row=>[row.path,Buffer.from(row.bytesHex,'hex')]));
  const art=files.get('Bin/Graphic.bin'),graphicInfo=files.get('Bin/GraphicInfo.bin');
  let index=1000;
  const retained=[];
  for(let at=0;at<graphicInfo.length;at+=40){
    index=Math.max(index,graphicInfo.readUInt32LE(at)+1);
    if(graphicInfo.readUInt32LE(at+36)!==0x5734)retained.push(graphicInfo.subarray(at,at+40));
  }
  const graphics=[],indices={};
  let offset=art.length;
  for(const [i,key] of ['bind','clear','departure'].entries()){
    const width=20,height=12,rd=Buffer.alloc(16+width*height,41+i),record=Buffer.alloc(40);
    rd.set([82,68,0,0]);rd.writeInt32LE(width,4);rd.writeInt32LE(height,8);rd.writeUInt32LE(rd.length,12);
    [index,offset,rd.length,-10,-6,width,height].forEach((value,j)=>record.writeInt32LE(value,j*4));
    if(key==='departure')record.writeUInt32LE(0x5734,36);
    indices[key]=index++;
    offset+=rd.length;
    graphics.push(rd);retained.push(record);
  }
  files.set('Bin/Graphic.bin',Buffer.concat([art,...graphics]));
  files.set('Bin/GraphicInfo.bin',Buffer.concat(retained));
  const animation=files.get('Bin/Anime.bin'),info=files.get('Bin/AnimeInfo.bin');
  const effects=new Map([...bind,...follower].map(resource=>[resource,'bind']));
  for(const resource of clear)effects.set(resource,'clear');
  const animationRows=[],blocks=[];
  for(let at=0;at<info.length;at+=12)if(!effects.has(info.readUInt32LE(at)))animationRows.push(info.subarray(at,at+12));
  offset=animation.length;
  for(const [resource,key] of effects){
    const row=Buffer.alloc(12),block=Buffer.alloc(42);
    row.writeUInt32LE(resource,0);row.writeUInt32LE(offset,4);row.writeUInt16LE(1,8);
    block.writeUInt32LE(480,4);block.writeUInt32LE(3,8);
    for(let frame=0;frame<3;frame++)block.writeUInt32LE(indices[key],12+frame*10);
    blocks.push(block);animationRows.push(row);offset+=block.length;
  }
  files.set('Bin/Anime.bin',Buffer.concat([animation,...blocks]));
  files.set('Bin/AnimeInfo.bin',Buffer.concat(animationRows));
  const palettePath='Bin/pal/palet_00.cgp';
  const base=JSON.parse(readFileSync(new URL('../game-resource-runtime-v1/original-vectors.json',import.meta.url)));
  const palette=files.get(palettePath)??Buffer.from(base.files.find(row=>row.path===palettePath).bytesHex,'hex');
  for(const [i,[r,g,b]] of Object.values(transitionColors).entries())palette.set([b,g,r],(41+i-16)*3);
  files.set(palettePath,palette);
  return {...input,files:[...files].map(([path,bytes])=>({path,bytesHex:bytes.toString('hex')}))};
}
