/** Execute independently authored source byte-copy plans, without the product compositor. */
import {readFileSync}from'node:fs';
export const exitVectors=JSON.parse(readFileSync(new URL('./original-vectors.json',import.meta.url)));
export function originalExitCapture(){const out=new Uint8Array(640*480*4);for(let y=0;y<480;y++)for(let x=0;x<640;x++)out.set([(x*3+y*7)&255,(x*11+y*5)&255,(x^y)&255,255],(y*640+x)*4);return out;}
export function originalExitPixels(captured,frame,width=640,height=480){const native=new Uint8Array(640*480*4);for(const[from,to,length]of frame.copies)native.set(captured.subarray(from,from+length),to);if(width===640&&height===480)return native;
 const out=new Uint8Array(width*height*4);for(let y=0;y<Math.min(height,480);y++)out.set(native.subarray(y*640*4,(y*640+Math.min(width,640))*4),y*width*4);return out;}
