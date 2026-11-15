"""Original independent forward raster of per-draw ARGB; no product imports."""
from pathlib import Path
from hashlib import sha256
from itertools import product
import json
import struct

A=Path(__file__).resolve().parent
ROOT=A.parents[1]
W,H=16,12
COLORS=[(0,0,0,0),(60,130,220,255),(200,70,80,255),(10,240,30,255),(0,0,1,255)]
PIXELS=bytes((x+2*y)%5 for y in range(4) for x in range(8))
RGBA=[COLORS[PIXELS[(3-y)*8+x]] for y in range(4) for x in range(8)]
words=[0xffffffff,0x80ffffff,0x014080ff,0x004080ff,0xff000000,0xff7f80fe,0x7fff0100,0xc83f7f3f]
pack=lambda pixels:bytes(c for pixel in pixels for c in pixel)
f32=lambda n:struct.unpack('<f',struct.pack('<f',n))[0]
short=lambda n:(n+32768)%65536-32768


def multiply(a,b):
    return (a*b+127)//255


def over(dst,src,a):
    if not a:
        return dst
    d=dst[3];den=a*255+d*(255-a)
    return tuple((src[i]*a*255+dst[i]*d*(255-a)+den//2)//den for i in range(3))+((den+127)//255,)


def draw(out,c,width=W,height=H,pixels=RGBA,image_width=8,image_height=4):
    x,y=c['x']+c.get('originX',0),c['y']+c.get('originY',0)
    if c.get('coordinateMode')!='int32':
        x,y=short(x),short(y)
    scale=[f32(n) for n in c.get('scale',[1,1])]
    sx=sy=0;sw,sh=image_width,image_height
    if 'sourceRectangle' in c:
        sx,sy,sw,sh=c['sourceRectangle']
        if sx<0:
            x-=int(sx*scale[0]);sw+=sx;sx=0
        if sy<0:
            y-=int(sy*scale[1]);sh+=sy;sy=0
        sw=max(0,min(sw,image_width-sx));sh=max(0,min(sh,image_height-sy))
        if c.get('flip',0)&1:
            x+=int((image_width-sw)*scale[0])
        if c.get('flip',0)&2:
            y+=int((image_height-sh)*scale[1])
    dw,dh=int(x+sw*scale[0])-x,int(y+sh*scale[1])-y
    work=max(0,min(width,x+dw)-max(0,x))*max(0,min(height,y+dh)-max(0,y))
    if not dw or not dh:
        return work
    word=c.get('color',0xffffffff)
    tint=[word>>16&255,word>>8&255,word&255]
    alpha=multiply(word>>24,c.get('opacity',255))
    for row in range(dh):
        Y=y+row
        if not 0<=Y<height:
            continue
        py=sy+(sh-1-row*sh//dh if c.get('flip',0)&2 else row*sh//dh)
        for column in range(dw):
            X=x+column
            if not 0<=X<width:
                continue
            px=sx+(sw-1-column*sw//dw if c.get('flip',0)&1 else column*sw//dw)
            source=pixels[py*image_width+px]
            if not source[3]:
                continue
            rgb=tuple(multiply(source[i],tint[i]) for i in range(3))
            at=Y*width+X
            if c.get('blend')=='additive':
                out[at]=tuple(min(255,out[at][i]+rgb[i]) for i in range(3))+(255,)
            else:
                out[at]=over(out[at],rgb,alpha)
    return work


background=[(0,0,0,0) if (x+y)%7==0 else ((x*17+y*3)%256,(x*13+y*29)%256,(x*41+y*7)%256,255) for y in range(H) for x in range(W)]
cases=[]
for flip,color,opacity,blend,rect,scale,initial in product(range(4),words,[0,127,255],['source-over','additive'],[None,[-2,-1,6,4]],[[1,1],[.5,1.5]],[False,True]):
    commands=[dict(x=1,y=2,priority=3,opacity=128,color=0x7fffff7f),
        dict(x=-2,y=1,originX=1,originY=-1,priority=4,flip=flip,opacity=opacity,color=color,blend=blend,scale=scale),
        dict(x=4,y=3,priority=4,flip=3,scale=[1.5,1],blend='additive',color=0x00ff80ff,opacity=0),
        dict(x=7,y=2,priority=5,opacity=63,color=0x80ff3f7f)]
    if rect:
        commands[1]['sourceRectangle']=rect
    out=list(background) if initial else [(0,0,0,0)]*(W*H)
    order=sorted(range(len(commands)),key=lambda i:(commands[i]['priority'],-i))
    operations=sum(draw(out,commands[i]) for i in order)
    cases.append(dict(commands=commands,initial=initial,rgbaSha256=sha256(pack(out)).hexdigest(),drawOrder=order,rasterOperations=operations))

text_cases=[]
for color,blend in product(words,['source-over','additive']):
    commands=[dict(x=0,y=0,priority=1,opacity=128),dict(x=0,y=0,priority=211,color=color,blend=blend),dict(x=1,y=1,priority=212,color=0x80ff7f3f,opacity=127)]
    out=[(0,0,0,0)]*(W*H);operations=draw(out,commands[0])
    for y,x in product(range(2),range(2)):
        a=[255,128,0,64][y*2+x];at=(y+1)*W+x+1
        out[at]=over(out[at],(255,0,0),a)
    operations+=4
    for command in commands[1:]:
        operations+=draw(out,command)
    text_cases.append(dict(commands=commands,rgbaSha256=sha256(pack(out)).hexdigest(),rasterOperations=operations))

channel_sweep=sha256()
rain_mask={0,2,5,7}
for source,tint in product(range(256),repeat=2):
    n=multiply(source,tint)
    # The explicit indexed palette deliberately maps opaque black to RGB000001.
    rgb=(n,n,n) if source else (0,0,multiply(1,tint))
    channel_sweep.update(pack([rgb+(255,) if i in rain_mask else (0,0,0,0) for i in range(8)]))
alpha_sweep=sha256()
opacities=[0,1,63,127,128,254,255]
bases=[(19,71,211,0),(17,83,197,255)]
for base,alpha,opacity in product(bases,range(256),opacities):
    a=multiply(alpha,opacity)
    alpha_sweep.update(pack([over(base,(91,173,223),a) if i in rain_mask else base for i in range(8)]))

named=json.loads((ROOT/'analysis/game-animation-palette-source-v1/original-vectors.json').read_text())
named_bytes=bytes.fromhex(next(c['rgbaHex'] for c in named['palette_cases'] if c['selector']==320 and not c['tint']))
named_pixels=[tuple(named_bytes[i:i+4]) for i in range(0,len(named_bytes),4)]
library_cases=[]
for color,flags in [(0x12345678,0),(0xff000000,0),(0x00ff80ff,8),(0x80ffffff,0),(0xc83f7f3f,8),(0xffffffff,0)]:
    commands=[dict(x=0,y=0,priority=10,color=color,flags=flags),dict(x=0,y=0,priority=9,color=0xff7f80fe,flags=0)]
    out=[(0,0,0,0)]*4
    for c in reversed(commands):
        draw(out,dict(c,blend='additive' if c['flags']&8 else 'source-over'),4,1,named_pixels,4,1)
    library_cases.append(dict(commands=commands,rgbaSha256=sha256(pack(out)).hexdigest()))
partial_pixels=[(0,0,0,0)]+[((i*7+320*11)&255,(i*5+320)&255,(i+320*3)&255,255) for i in (1,2,3)]
partial_out=[(0,0,0,0)]*4
draw(partial_out,dict(x=0,y=0,color=0x12345678),4,1,partial_pixels,4,1)

old=json.loads((ROOT/'analysis/game-legacy-animation-v1/original-vectors.json').read_text())
promoted=[]
pal=[(0,0,0,0),(13,31,61,255),(97,127,151,255),(173,193,223,255)]
for trace in old['series']:
    for i,row in enumerate(trace['steps']):
        state=row.get('expected',{}).get('state',{})
        if row.get('frameDigest')!='LEGACY_ANIMATION_DRAW_STYLE' or state.get('paletteSelector') or state.get('drawFlags')!=0 or state.get('color')!=0x80ffffff:
            continue
        g=state['geometry'];w,h=g['width'],g['height']
        pixels=[pal[0 if ((h-1-y)*w+x+g['index'])%5==0 else 1+((h-1-y)*w+x+g['index'])%3] for y in range(h) for x in range(w)]
        out=[(0,0,0,0)]*(32*24)
        draw(out,dict(x=16+state['drawOffsetX'],y=12+state['drawOffsetY'],priority=10,color=state['color']),32,24,pixels,w,h)
        promoted.append(dict(trace=trace['name'],step=i,rgbaSha256=sha256(pack(out)).hexdigest()))
rd=b'RD\0\0'+struct.pack('<iiI',8,4,16+len(PIXELS))+PIXELS
rgb=bytearray(768)
for i,c in enumerate(COLORS):
    rgb[i*3:i*3+3]=bytes(c[:3])
out=dict(stage=294,original_synthetic_only=True,authority='documented source texture-stage/vertex blend equations with explicit portable8-bit rounding/straight-alpha coverage;not hardware readback',width=W,height=H,
    rdHex=rd.hex(),paletteRGBHex=rgb.hex(),backgroundRGBAHex=pack(background).hex(),cases=cases,textCases=text_cases,promotedAnimationFrames=promoted,libraryCases=library_cases,
    partialPaletteFrame=dict(index=2065,selector=320,color=0x12345678,paletteBytes=12,rgbaSha256=sha256(pack(partial_out)).hexdigest()),
    channelSweep=dict(frames=65536,width=4,height=2,explicitBlack=1,rgbaSha256=channel_sweep.hexdigest()),
    alphaSweep=dict(frames=3584,width=4,height=2,opacities=opacities,bases=bases,sourceRGB=0x5baddf,rgbaSha256=alpha_sweep.hexdigest()))
(A/'original-vectors.json').write_text(json.dumps(out,separators=(',',':'))+'\n')
print(json.dumps(dict(stage=294,frames=len(cases),text_frames=len(text_cases),promoted=len(promoted),sweep_frames=65536+3584)))
