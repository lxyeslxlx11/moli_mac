#!/usr/bin/env python3
"""Original fixtures/oracle; no official images, executable or libraries required."""
import hashlib,json,struct,random
from pathlib import Path
HERE=Path(__file__).resolve().parent
sha=lambda b:hashlib.sha256(bytes(b)).hexdigest()
def put(p,d):p.write_text(json.dumps(d,ensure_ascii=False,indent=2)+'\n')
def rd(flags,w,h,data,palette=b'',extra=b'',length=None):
 header=bytearray(b'RD'+bytes([flags,0xa7])+struct.pack('<iiI',w,h,0))
 if flags&2:header+=struct.pack('<I',len(palette))
 body=data if flags&1 else data+palette
 struct.pack_into('<I',header,12,len(header)+len(body) if length is None else length)
 return bytes(header)+body+extra
def encode(op,n,value=37,data=None):
 if op<8:ext=op%2
 else:ext=2 if op&2 else op&1
 out=bytearray([(op<<4)|(n>>(8*ext))]);
 if op in [8,9,10,11]:out.append(value)
 out+=int(n&((1<<(8*ext))-1)).to_bytes(ext,'big')
 if op<8:out+=data if data is not None else bytes((i*13+9)&255 for i in range(n))
 return bytes(out)
def oracle(raw):
 flags=raw[2];w,h,end=struct.unpack_from('<iiI',raw,4);start=20 if flags&2 else 16;pal=struct.unpack_from('<I',raw,16)[0] if flags&2 else 0
 if not flags&1:return raw[start:start+w*h],raw[start+w*h:start+w*h+pal],start+w*h+pal
 out=bytearray();i=start
 while i<end:
  tag=raw[i];i+=1;op=tag>>4;n=tag&15
  if op<8:
   if op&1:n=n*256+raw[i];i+=1
   out+=raw[i:i+n];i+=n
  else:
   v=0
   if op<12:v=raw[i];i+=1
   extensions=2 if op&2 else op&1
   for _ in range(extensions):n=n*256+raw[i];i+=1
   out.extend(bytes([v])*n)
 assert len(out)==w*h+pal
 return bytes(out[:w*h]),bytes(out[w*h:]),i

def base_rgb(cgp):
 fixed=[[0,0,0],[128,0,0],[0,128,0],[128,128,0],[0,0,128],[128,0,128],[0,128,128],[192,192,192],[192,220,192],[166,202,240],[222,0,0],[255,95,0],[255,255,160],[0,95,210],[80,210,255],[40,225,40],[245,195,150],[225,160,95],[195,125,70],[155,85,30],[70,65,55],[40,35,30],[255,251,240],[160,160,164],[128,128,128],[255,0,0],[0,255,0],[255,255,0],[0,0,255],[255,0,255],[0,255,255],[255,255,255]]
 original=bytearray(sum(fixed[:16],[]))+bytearray(sum(([cgp[i+2],cgp[i+1],cgp[i]] for i in range(0,672,3)),[]))+bytearray(sum(fixed[16:],[]));current=bytearray(original);current[168*3:169*3]=b'\0\0\0';return original,current

def palette(data,mode,luts=None):
 colors=[0]*256;known=[0]*256
 for i in range(len(data)//3):
  a,b,c=data[i*3:i*3+3];r,g,blue=(c,b,a) if mode=='embedded-bgr' else (a,b,c)
  if luts and (mode=='embedded-bgr' or 16<=i<240):r,g,blue=luts[0][r],luts[1][g],luts[2][blue]
  word=(r<<16)|(g<<8)|blue;colors[i]=word if word or mode=='default-rgb' else 1;known[i]=1
 colors[0]=0;known[0]=1;return colors,known

def raster(w,h,stream,colors):
 out=bytearray()
 for y in range(h):
  for x in range(w):
   c=colors[stream[(h-1-y)*w+x]];out+=bytes([c>>16,(c>>8)&255,c&255,255 if c else 0])
 return out

def compose(w,h,sprites,commands):
 out=bytearray(w*h*4);order=sorted(range(len(commands)),key=lambda i:(commands[i]['priority'],-i));work=0
 def short(v):return (v+32768)%65536-32768
 for i in order:
  c=commands[i];s=sprites[c['sprite']];x=short(c['x']+c.get('originX',0));y=short(c['y']+c.get('originY',0));flip=c.get('flip',0)
  for oy in range(max(0,y),min(h,y+s['height'])):
   for ox in range(max(0,x),min(w,x+s['width'])):
    work+=1;sx=s['width']-1-(ox-x) if flip&1 else ox-x;sy=s['height']-1-(oy-y) if flip&2 else oy-y
    src=(sy*s['width']+sx)*4;dst=(oy*w+ox)*4
    if s['rgba'][src+3]:out[dst:dst+4]=s['rgba'][src:src+4]
 return out,order,work

def generate():
 cases=[]
 for flags in range(256):
  p=bytes([0,2,5,7,11,13,17,19]);tail=bytes([27,31,37,41,43]) if flags&2 else b''
  data=encode(1,len(p+tail),data=p+tail) if flags&1 else p
  raw=rd(flags,4,2,data,tail,b'opaque',None if flags&1 else 0xdeadbeef);a,b,c=oracle(raw)
  cases.append(dict(name='flags-'+str(flags),inputHex=raw.hex(),width=4,height=2,flags=flags,pixelsSha256=sha(a),paletteHex=b.hex(),consumed=c,ignored=len(raw)-c))
 for op in range(16):
  ext=(op%2) if op<8 else (2 if op&2 else op&1)
  counts=[0,1,15] if not ext else [0,16,257,4095] if ext==1 else [0,256,65536,1048575]
  for n in counts:
   padding=(-n)%4;total=n+padding or 4;stream=encode(op,n)
   if padding or not n:stream+=encode(8,total-n,49)
   raw=rd(1,total//4,4,stream);a,b,c=oracle(raw)
   # Keep dimensions narrow enough to be ordinary source images, even for long runs.
   struct.pack_into('<ii',r:=bytearray(raw),4,4,total//4);raw=bytes(r);a,b,c=oracle(raw)
   cases.append(dict(name=f'op-{op:x}-{n}',inputHex=raw.hex(),width=4,height=total//4,flags=1,pixelsSha256=sha(a),paletteHex=b.hex(),consumed=c,ignored=0))
 # Cross pixel/palette boundary, full embedded palette, with zero fills and no-ops.
 body=encode(0,0)+encode(8,6,9)+encode(12,5)+encode(1,5,data=b'abcde')
 raw=rd(3,4,2,body,b'12345678');a,b,c=oracle(raw);cases.append(dict(name='cross-boundary',inputHex=raw.hex(),width=4,height=2,flags=3,pixelsSha256=sha(a),paletteHex=b.hex(),consumed=c,ignored=0))
 cgp=bytes((i*37+19)&255 for i in range(708));original,current=base_rgb(cgp)
 cgps=[dict(inputHex=cgp.hex(),originalSha256=sha(original),currentSha256=sha(current),ignored=36)]
 luts=[bytes((i*7+3)&255 for i in range(256)),bytes(255-i for i in range(256)),bytes((i*11)&255 for i in range(256))]
 palette_cases=[]
 for mode in ['default-rgb','explicit-rgb','embedded-bgr']:
  lengths=[768] if mode!='embedded-bgr' else [0,1,2,3,5,6,63,765,767,768]
  for n in lengths:
   for transformed in ([False] if mode=='default-rgb' else [False,True]):
    data=bytes((i*17+7)&255 for i in range(n));data=bytes(0 if i<9 else v for i,v in enumerate(data));colors,known=palette(data,mode,luts if transformed else None)
    palette_cases.append(dict(name=f'{mode}-{n}-{transformed}',mode=mode,inputHex=data.hex(),lutsHex=[x.hex() for x in luts] if transformed else None,colors=colors,known=known))
 colors,_=palette(current,'default-rgb');ss=[];sprite_cases=[]
 for j in range(4):
  w,h=4*(j+1),j+2;pixels=bytes(0 if i%5==0 else (i*17+j*3)%256 for i in range(w*h));rgba=raster(w,h,pixels,colors);ss.append(dict(width=w,height=h,rgba=rgba));sprite_cases.append(dict(rdHex=rd(0,w,h,pixels).hex(),rgbaSha256=sha(rgba),rgbaHex=rgba.hex()))
 rng=random.Random(159);frames=[]
 for n in range(100):
  w,h=rng.randrange(1,20),rng.randrange(1,15);commands=[]
  for i in range(rng.randrange(0,12)):
   commands.append(dict(sprite=rng.randrange(4),x=rng.randrange(-8,21),y=rng.randrange(-6,16),priority=rng.randrange(4),originX=rng.randrange(-3,4),originY=rng.randrange(-3,4),flip=rng.randrange(4)))
  if n==99:commands=[dict(sprite=0,x=65535,y=-65535,priority=255,flip=3),dict(sprite=1,x=0,y=0,priority=0)]
  pixels,order,work=compose(w,h,ss,commands);frames.append(dict(width=w,height=h,commands=commands,rgbaSha256=sha(pixels),drawOrder=order,rasterOperations=work))
 result=dict(schema='moli.legacy-render-original-vectors-stage159.v1',original_synthetic_only=True,rdCases=cases,cgpCases=cgps,paletteCases=palette_cases,spriteCases=sprite_cases,frameCases=frames)
 put(HERE/'original-vectors.json',result);print(json.dumps({k:len(v) for k,v in result.items() if k.endswith('Cases')}))
if __name__=='__main__':generate()
