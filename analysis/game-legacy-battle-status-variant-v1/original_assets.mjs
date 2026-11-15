/** Add synthetic glyph rows for the inherited number styles used by action 199. */
import { statusSkillFiles } from '../game-battle-status-skills-v1/tcp-flow.mjs';

export function statusVariantFiles() {
  const fixture = statusSkillFiles();
  const metadataPath = 'Bin/GraphicInfo.bin', dataPath = 'Bin/Graphic.bin';
  const byPath = path => Buffer.from(fixture.files.find(row => row.path === path).bytesHex, 'hex');
  const metadata = byPath(metadataPath), data = byPath(dataPath), rows = [metadata], pixels = [data];
  const styleFive = new Map();
  let nextIndex = 1000, nextOffset = data.length;
  for(let offset=0;offset<metadata.length;offset+=40){
    const row = metadata.subarray(offset,offset+40), resource = row.readUInt32LE(36);
    nextIndex=Math.max(nextIndex,row.readUInt32LE(0)+1);
    if(resource===243747||resource>=243750&&resource<243760)styleFive.set(resource,row);
  }
  for(const style of [0,4])for(const [resource,source] of styleFive){
    const row=Buffer.from(source), start=source.readUInt32LE(4), size=source.readUInt32LE(8);
    row.writeUInt32LE(nextIndex++,0);
    row.writeUInt32LE(nextOffset,4);
    row.writeUInt32LE(resource+(style-5)*10,36);
    rows.push(row);
    pixels.push(data.subarray(start,start+size));
    nextOffset+=size;
  }
  const replacements=new Map([[metadataPath,Buffer.concat(rows)],[dataPath,Buffer.concat(pixels)]]);
  return {...fixture,files:fixture.files.map(row=>replacements.has(row.path)
    ?{...row,bytesHex:replacements.get(row.path).toString('hex')}:row)};
}
