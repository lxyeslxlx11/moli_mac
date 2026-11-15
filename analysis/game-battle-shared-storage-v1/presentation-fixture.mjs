/** Original CGP values, indexed sprites, and GMN panel tiles for the portable renderer. */
export const presentationColors=Object.freeze({
  base:Object.freeze([20,101,211]),guest:Object.freeze([219,62,42]),
  embedded:Object.freeze([200,100,40]),
});
const tiles=[
  [-37,-27,76,54],[-37,-27,76,6],[-37,-27,76,54],
  [-37,-27,8,54],[-37,-27,76,54],[30,-27,8,54],
  [-37,-27,76,54],[-37,21,76,6],[-37,-27,76,54],
];

function rd(width,height,rgb){
  const pixels=width*height,paletteBytes=rgb?51:0,header=rgb?20:16;
  const raw=Buffer.alloc(header+pixels+paletteBytes);
  raw.set([82,68,rgb?2:0]);
  raw.writeInt32LE(width,4);
  raw.writeInt32LE(height,8);
  raw.writeUInt32LE(raw.length,12);
  raw.fill(16,header,header+pixels);
  if(rgb){
    raw.writeUInt32LE(paletteBytes,16);
    raw.set([rgb[2],rgb[1],rgb[0]],header+pixels+48);
  }
  return raw;
}

export function presentationAssets(input,{guest=true}={}){
  const files=new Map(input.files.map(row=>[row.path,Buffer.from(row.bytesHex,'hex')]));
  const graphicPath='Bin/Graphic_Joy.bin',infoPath='Bin/GraphicInfo_Joy.bin';
  const graphics=[files.get(graphicPath)],rows=[files.get(infoPath)];
  let index=1000,offset=graphics[0].length;
  for(let at=0;at<rows[0].length;at+=40)index=Math.max(index,rows[0].readInt32LE(at)+1);
  function image(resource,geometry,rgb){
    const [x,y,width,height]=geometry;
    const raw=rd(width,height,rgb);
    const row=Buffer.alloc(40);
    [index++,offset,raw.length,x,y,width,height].forEach((value,i)=>row.writeInt32LE(value,i*4));
    row.writeUInt32LE(resource,36);
    rows.push(row);
    graphics.push(raw);
    offset+=raw.length;
  }
  for(let i=0;i<tiles.length;i++)image(245300+i,tiles[i],i===4?[46,92,145]:[100,210,170]);
  image(245310,[0,0,4,4],null);
  image(245311,[0,0,4,4],presentationColors.embedded);
  files.set(graphicPath,Buffer.concat(graphics));
  files.set(infoPath,Buffer.concat(rows));
  const palettePath='Bin/pal/palet_00.cgp';
  const base=files.get(palettePath);
  base.set([...presentationColors.base].reverse(),0);
  base.fill(0,3,6);
  if(guest){
    const palette13=Buffer.from(base);
    palette13.set([...presentationColors.guest].reverse(),0);
    palette13.fill(24,3,6);
    files.set('Bin/pal/palet_13.cgp',palette13);
  }
  return {...input,files:[...files].map(([path,raw])=>({path,bytesHex:raw.toString('hex')}))};
}

/** An explicit synthetic host mask used only in tests. */
export function presentationMask(){
  return {width:3,height:2,originX:0,originY:0,alpha:Uint8Array.of(255,128,255,255,0,255)};
}
