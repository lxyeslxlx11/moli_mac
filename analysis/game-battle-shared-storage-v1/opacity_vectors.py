"""Independent rational alpha compositor and point sampler for portable policy."""
from pathlib import Path
from fractions import Fraction as F
import hashlib,json
A=Path(__file__).resolve().parent
COLORS=[(0,0,0,0),(200,40,100,255),(20,180,60,255),(10,20,240,255)]
def blend(d,s,a):
 if not a or not s[3]:return d
 alpha=F(a,255);dest=F(d[3],255);out=alpha+dest*(1-alpha)
 rnd=lambda x:(2*x.numerator+x.denominator)//(2*x.denominator)
 return tuple(rnd((F(s[i])*alpha+F(d[i])*dest*(1-alpha))/out)for i in range(3))+(rnd(out*255),)
def render(commands):
 w,h=5,3;out=[(0,0,0,0)]*(w*h)
 for order,c in sorted(enumerate(commands),key=lambda z:(z[1]['priority'],-z[0])):
  pix=[1,2,0,3,3,0,2,1];sx,sy=c.get('scale',[1,1]);dw,dh=int(4*sx),int(2*sy)
  for yy in range(dh):
   for xx in range(dw):
    x,y=c['x']+xx,c['y']+yy
    if not(0<=x<w and 0<=y<h):continue
    ix,iy=xx*4//dw,yy*2//dh
    if c.get('flip',0)&1:ix=3-ix
    if c.get('flip',0)&2:iy=1-iy
    at=y*w+x;out[at]=blend(out[at],COLORS[pix[iy*4+ix]],c.get('opacity',255))
 return bytes(v for p in out for v in p)
def vectors():
 cases=[]
 for alpha in[0,1,7,63,127,128,192,252,254,255]:
  for flip in range(4):
   for scale in[[1,1],[2,1],[1,0.5]]:
    commands=[dict(x=0,y=0,priority=5),dict(x=-1,y=1,priority=6,opacity=alpha,flip=flip,scale=scale),dict(x=1,y=0,priority=7,opacity=127,flip=flip)]
    rgba=render(commands);cases.append(dict(alpha=alpha,flip=flip,scale=scale,commands=commands,rgbaHex=rgba.hex(),sha256=hashlib.sha256(rgba).hexdigest()))
 return dict(schema='moli.portable-opacity-reference-stage221.v1',authority='independent rational alpha policy;native GPU rounding unverified',colors=COLORS,pixels=[1,2,0,3,3,0,2,1],width=5,height=3,cases=cases)
if __name__=='__main__':
 o=vectors();p=A/'opacity-vectors.json';p.write_text(json.dumps(o,separators=(',',':'))+'\n');print(json.dumps(dict(cases=len(o['cases']),bytes=p.stat().st_size)))
