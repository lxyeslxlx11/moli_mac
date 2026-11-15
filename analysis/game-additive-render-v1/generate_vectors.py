"""Independent forward-raster ONE+ONE reference plus promoted historical animation pixels."""
from pathlib import Path
from hashlib import sha256
from itertools import product
import json
import math
import struct

A=Path(__file__).resolve().parent
ROOT=A.parents[1]
W,H=16,12
COLORS=[(0,0,0,0),(60,130,220,255),(200,70,80,255),(10,240,30,255),(0,0,1,255)]
PIXELS=bytes((x+2*y)%5 for y in range(4)for x in range(8))
RGBA=[COLORS[PIXELS[(3-y)*8+x]]for y in range(4)for x in range(8)]
short=lambda n:(n+32768)%65536-32768
f=lambda n:struct.unpack('<f',struct.pack('<f',n))[0]


def layout(c,sw,sh):
    x,y=c['x']+c.get('originX',0),c['y']+c.get('originY',0)
    if c.get('coordinateMode')!='int32':
        x,y=short(x),short(y)
    scale=c.get('scale',[1,1]);sx=sy=0
    if 'sourceRectangle'in c:
        sx,sy,sw,sh=c['sourceRectangle']
        if sx<0:
            x-=int(sx*scale[0]);sw+=sx;sx=0
        if sy<0:
            y-=int(sy*scale[1]);sh+=sy;sy=0
        sw=max(0,min(sw,8-sx));sh=max(0,min(sh,4-sy))
        if c.get('flip',0)&1:
            x+=int((8-sw)*scale[0])
        if c.get('flip',0)&2:
            y+=int((4-sh)*scale[1])
    right,bottom=int(x+sw*scale[0]),int(y+sh*scale[1])
    return x,y,sx,sy,sw,sh,right-x,bottom-y


def over(dst,src,a):
    da=dst[3];den=a*255+da*(255-a)
    if not den:
        return dst
    return tuple((src[c]*a*255+dst[c]*da*(255-a)+den//2)//den for c in range(3))+((den+127)//255,)


def draw(out,c,sw=8,sh=4,rgba=RGBA,width=W,height=H):
    x,y,sx,sy,sw,sh,dw,dh=layout(c,sw,sh)
    work=max(0,min(width,x+dw)-max(0,x))*max(0,min(height,y+dh)-max(0,y))
    if not dw or not dh:
        return work
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
            color=rgba[py*(8 if rgba is RGBA else c['spriteWidth'])+px]
            if not color[3]:
                continue
            at=Y*width+X
            if c.get('blend')=='additive':
                out[at]=tuple(min(255,out[at][i]+color[i])for i in range(3))+(255,)
            elif c.get('opacity',255):
                out[at]=over(out[at],color,c.get('opacity',255))
    return work


background=[(0,0,0,0)if(x+y)%7==0 else((x*17+y*3)%256,(x*13+y*29)%256,(x*41+y*7)%256,255)for y in range(H)for x in range(W)]
pack=lambda pixels:bytes(c for pixel in pixels for c in pixel)
cases=[]
for flip,opacity,scale,rect,initial in product(range(4),[0,63,128,255],[[1,1],[.5,1.5],[1.75,.75],[0,1],[1,0]],[None,[-2,-1,6,4],[2,1,8,3]],[False,True]):
    commands=[dict(x=1,y=2,priority=3,flip=1,opacity=128),dict(x=-2,y=1,originX=1,originY=-1,priority=4,flip=flip,opacity=opacity,scale=[f(n)for n in scale],blend='additive'),dict(x=4,y=3,priority=4,flip=3,scale=[1.5,1],blend='additive'),dict(x=7,y=2,priority=5,opacity=63)]
    if rect:
        commands[1]['sourceRectangle']=rect
    out=list(background)if initial else[(0,0,0,0)]*(W*H)
    order=sorted(range(len(commands)),key=lambda i:(commands[i]['priority'],-i))
    operations=sum(draw(out,commands[i])for i in order)
    cases.append(dict(commands=commands,initial=initial,rgbaSha256=sha256(pack(out)).hexdigest(),drawOrder=order,rasterOperations=operations))

text_cases=[]
for flip in range(4):
    commands=[dict(x=0,y=0,priority=1),dict(x=0,y=0,priority=211,blend='additive',flip=flip),dict(x=2,y=2,priority=212,opacity=63)]
    out=[(0,0,0,0)]*(W*H);operations=draw(out,commands[0])
    for y,x in product(range(2),range(2)):
        a=[255,128,0,64][y*2+x];at=(y+1)*W+x+1
        out[at]=over(out[at],(255,0,0,255),a)
    operations+=4
    for command in commands[1:]:
        operations+=draw(out,command)
    text_cases.append(dict(commands=commands,rgbaSha256=sha256(pack(out)).hexdigest(),rasterOperations=operations))

old=json.loads((ROOT/'analysis/game-legacy-animation-v1/original-vectors.json').read_text())
promoted=[]
pal=[(0,0,0,0),(13,31,61,255),(97,127,151,255),(173,193,223,255)]
for trace in old['series']:
    for i,row in enumerate(trace['steps']):
        state=row.get('expected',{}).get('state',{})
        if row.get('frameDigest')!='LEGACY_ANIMATION_DRAW_STYLE'or state.get('paletteSelector')or state.get('drawFlags')!=8 or state.get('color')!=0xffffffff:
            continue
        g=state['geometry'];w,h=g['width'],g['height'];pixels=[pal[0 if ((h-1-y)*w+x+g['index'])%5==0 else 1+((h-1-y)*w+x+g['index'])%3]for y in range(h)for x in range(w)]
        out=[(0,0,0,0)]*(32*24)
        command=dict(x=16+state['drawOffsetX'],y=12+state['drawOffsetY'],priority=10,flip=0,blend='additive',spriteWidth=w)
        draw(out,command,w,h,pixels,32,24)
        promoted.append(dict(trace=trace['name'],step=i,rgbaSha256=sha256(pack(out)).hexdigest()))
rd=b'RD\0\0'+struct.pack('<iiI',8,4,16+len(PIXELS))+PIXELS
rgb=bytearray(768)
for i,c in enumerate(COLORS):
    rgb[i*3:i*3+3]=bytes(c[:3])
out=dict(stage=293,original_synthetic_only=True,authority='source ONE+ONE equation with portable point/coverage/alpha policy;not hardware readback',width=W,height=H,rdHex=rd.hex(),paletteRGBHex=rgb.hex(),backgroundRGBAHex=pack(background).hex(),cases=cases,textCases=text_cases,promotedAnimationFrames=promoted)
(A/'original-vectors.json').write_text(json.dumps(out,separators=(',',':'))+'\n')
print(json.dumps(dict(stage=293,frames=len(cases),text_frames=len(text_cases),promoted_animation_frames=len(promoted))))
