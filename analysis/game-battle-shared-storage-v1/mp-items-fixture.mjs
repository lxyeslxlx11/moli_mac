/** Original RD markers for item casting, recovery, and actor animation 16. */
import {Buffer} from 'node:buffer';
import {readFileSync} from 'node:fs';

export const itemColors=Object.freeze({
  cast:Object.freeze([102,211,146,255]),
  recover:Object.freeze([242,163,68,255]),
  use:Object.freeze([105,154,237,255]),
});

export function mpItemAssets(input){
  const files=new Map(input.files.map(({path,bytesHex})=>[path,Buffer.from(bytesHex,'hex')]));
  const info=files.get('Bin/GraphicInfo.bin'),art=files.get('Bin/Graphic.bin');
  let index=1000,offset=art.length;
  for(let at=0;at<info.length;at+=40)index=Math.max(index,info.readUInt32LE(at)+1);
  const graphics=[art],records=[info],markers={};
  const palettePath='Bin/pal/palet_00.cgp';
  const base=JSON.parse(readFileSync(new URL('../game-resource-runtime-v1/original-vectors.json',import.meta.url)));
  const palette=files.get(palettePath)??Buffer.from(base.files.find(row=>row.path===palettePath).bytesHex,'hex');
  for(const [i,[label,[r,g,b]]] of Object.entries(itemColors).entries()){
    const width=20,height=12,entry=44+i;
    const rd=Buffer.alloc(16+width*height,entry),row=Buffer.alloc(40);
    rd.set([82,68,0,0]);
    rd.writeInt32LE(width,4);
    rd.writeInt32LE(height,8);
    rd.writeUInt32LE(rd.length,12);
    [index,offset,rd.length,-10,-6,width,height].forEach((value,j)=>row.writeInt32LE(value,j*4));
    markers[label]=index++;
    offset+=rd.length;
    graphics.push(rd);
    records.push(row);
    palette.set([b,g,r],(entry-16)*3);
  }
  files.set('Bin/GraphicInfo.bin',Buffer.concat(records));
  files.set('Bin/Graphic.bin',Buffer.concat(graphics));
  files.set(palettePath,palette);

  const effects=new Map([[0x1ae18,'cast'],[0x1ae08,'recover']]);
  const animations=files.get('Bin/Anime.bin'),animationInfo=files.get('Bin/AnimeInfo.bin');
  for(let at=0;at<animationInfo.length;at+=12){
    const resource=animationInfo.readUInt32LE(at),effect=effects.get(resource);
    if(!effect&&resource!==100114)continue;
    let frameAt=animationInfo.readUInt32LE(at+4);
    const actionCount=animationInfo.readUInt16LE(at+8);
    for(let i=0;i<actionCount;i++){
      const action=animations.readUInt16LE(frameAt+2),count=animations.readUInt32LE(frameAt+8);
      const label=effect??(action===16?'use':null);
      if(label){
        animations.writeUInt32LE(320,frameAt+4);
        for(let j=0;j<count;j++)animations.writeUInt32LE(markers[label],frameAt+12+j*10);
      }
      frameAt+=12+count*10;
    }
  }
  return {...input,files:[...files].map(([path,bytes])=>({path,bytesHex:bytes.toString('hex')}))};
}
