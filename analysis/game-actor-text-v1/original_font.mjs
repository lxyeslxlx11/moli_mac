/** Original synthetic glyph-mask port; intentionally not a native font or product fallback. */
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const v=JSON.parse(readFileSync(new URL('./original-vectors.json',import.meta.url))),rows=new Map(v.masks.map(r=>[r.font+':'+r.bytesHex,r]));
export function originalTextMask(request){if(request.font===1){assert.equal(request.nativeFont.height,14);assert.equal(request.nativeFont.charSet,1);assert.deepEqual(Array.from(request.nativeFont.faceNameBytes),[203,206,204,229]);assert.equal(request.metrics.singleWidth,7);assert.equal(request.metrics.doubleWidth,14);}
 const key=request.font+':'+Buffer.from(request.bytes).toString('hex'),row=rows.get(key);assert.ok(row,'Unexpected original glyph request '+key);return{width:row.width,height:row.height,originX:row.originX,originY:row.originY,alpha:new Uint8Array(Buffer.from(row.alphaHex,'hex'))};}
