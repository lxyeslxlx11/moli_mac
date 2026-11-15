"""Portable point policy oracle for source447330 integer geometry. Driver sampling remains unverified."""
from pathlib import Path
import struct,hashlib,json,random,math
A=Path(__file__).resolve().parent
f=lambda n:struct.unpack('<f',struct.pack('<f',n))[0]
def oracle(c):
 W,H=16,12;x=c['x']+c['originX'];y=c['y']+c['originY'];x=(x+32768)%65536-32768;y=(y+32768)%65536-32768;scale=c['scale'];sx=sy=0;sw,sh=8,4
 if 'sourceRectangle'in c:
  sx,sy,sw,sh=c['sourceRectangle']
  if sx<0:x-=int(sx*scale[0]);sw+=sx;sx=0
  if sy<0:y-=int(sy*scale[1]);sh+=sy;sy=0
  sw=max(0,min(sw,8-sx));sh=max(0,min(sh,4-sy))
  if c['flip']&1:x+=int((8-sw)*scale[0])
  if c['flip']&2:y+=int((4-sh)*scale[1])
 right=int(x+sw*scale[0]);bottom=int(y+sh*scale[1]);dw=right-x;dh=bottom-y;pixels=bytearray(W*H*4)
 for Y in range(max(0,y),min(H,bottom)):
  for X in range(max(0,x),min(W,right)):
   ix=(X-x)*sw//dw;iy=(Y-y)*sh//dh;ix=sx+(sw-1-ix if c['flip']&1 else ix);iy=sy+(sh-1-iy if c['flip']&2 else iy);n=((3-iy)*8+ix)%4
   if n:p=(Y*W+X)*4;pixels[p:p+4]=bytes([n,255-n,n^53,255])
 return dict(rgbaSha256=hashlib.sha256(pixels).hexdigest(),rasterOperations=max(0,min(W,right)-max(0,x))*max(0,min(H,bottom)-max(0,y)))
def main():
 rng=random.Random(196);rows=[]
 for i in range(240):
  c=dict(x=rng.choice([-65539,-9,-2,0,3,15,65536]),y=rng.choice([-65537,-4,0,3,11,65536]),originX=rng.choice([-3,0,2]),originY=rng.choice([-2,0,3]),flip=i%4,scale=[f(rng.choice([0,.02,.3,.5,1,1.3,2.5])),f(rng.choice([0,.02,.5,1,1.3,2.5]))],priority=5)
  if i%3:c['sourceRectangle']=rng.choice([[-2,-1,8,4],[0,0,4,3],[3,1,7,5],[20,20,1,1],[0,0,8,4]])
  rows.append(dict(command=c,expected=oracle(c)))
 raw=b'RD\0\0'+struct.pack('<iiI',8,4,48)+bytes(i%4 for i in range(32));out=dict(schema='moli.original-portable-scale-policy-stage196.v1',authority='independent Python integer rectangle and point-sampling policy; original backend pixel identity unverified',rdHex=raw.hex(),width=16,height=12,rows=rows);(A/'scale-vectors.json').write_text(json.dumps(out,separators=(',',':'))+'\n');print(json.dumps(dict(cases=len(rows))))
if __name__=='__main__':main()
