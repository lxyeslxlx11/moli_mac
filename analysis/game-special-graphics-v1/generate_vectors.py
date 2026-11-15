"""Original deterministic water traces and full-frame byte-copy reference; no client code."""
import hashlib
import json
import struct
from pathlib import Path

A=Path(__file__).resolve().parent
F=lambda n:struct.unpack('<f',struct.pack('<f',n))[0]
TABLE=[0,1,2,3,4,5,6,7,8,9,10,10,11,11,11,12,12,12,11,11,11,10,9,9,8,7,6,5,4,3,2,1,0,-1,-2,-3,-4,-5,-6,-7,-8,-9,-10,-10,-11,-11,-11,-12,-12,-12,-11,-11,-11,-10,-9,-9,-8,-7,-6,-5,-4,-3,-2,-1]

def base(w,h):
    return bytearray(c for y in range(h)for x in range(w)for c in[(x*7+y*3)&255,(y*5+x)&255,(x^y)&255,255])


def rows(p,a):return [i*8+12+int(TABLE[(p+i)%64]*a/100)for i in range(60)]


def water(b,w,h,p,a):
    snap=bytearray(640*480*4)
    for y in range(min(h,480)):snap[y*640*4:(y*640+min(w,640))*4]=b[y*w*4:(y*w+min(w,640))*4]
    for i,sy in enumerate(rows(p,a)):
        if not 0<=sy<=472:continue
        for y in range(i*8,min(i*8+8,h,480)):
            start=(sy+y-i*8)*640*4
            b[y*w*4:(y*w+min(w,640))*4]=snap[start:start+min(w,640)*4]
    return b


native=base(640,480)
frames=[]
for p in range(64):
    for a in range(0,101,2):
        b=water(native.copy(),640,480,p,a)
        frames.append(dict(phase=p,amplitude=a,sha256=hashlib.sha256(b).hexdigest(),rows=rows(p,a)))
viewports=[]
for w,h in[(320,240),(648,480),(640,488),(32,8),(1,1),(700,500)]:
    for p,a in[(0,0),(16,100),(48,100),(63,98)]:
        viewports.append(dict(width=w,height=h,phase=p,amplitude=a,sha256=hashlib.sha256(water(base(w,h),w,h,p,a)).hexdigest()))
orders=[]
for p in [0,16,32,48]:
    for a in [0,2,50,100]:
        b=native.copy()
        # Three opaque1x1 draws, scaled8x16 at16,8. Wave appended last atpriority2.
        for y in range(8,24):
            for x in range(16,24):b[(y*640+x)*4:(y*640+x)*4+4]=bytes([200,10,20,255])
        water(b,640,480,p,a)
        for rgb in[[20,210,30],[30,40,220]]:
            for y in range(8,24):
                for x in range(16,24):b[(y*640+x)*4:(y*640+x)*4+4]=bytes(rgb+[255])
        orders.append(dict(phase=p,amplitude=a,sha256=hashlib.sha256(b).hexdigest(),drawOrder=[0,3,1,2]))

traces=[]
for name in ['ramp','travel','gate','skip','absence']:
    phase=0.;amp=last=updates=passes=0;previous=[0.,0.];trace=[]
    for i in range(130):
        count=20 if name=='skip' else (i%4+1 if name=='travel'else 1)
        for _ in range(count):phase=F(phase+.25);updates+=1
        position=[F((i%11-5)*64+i*.125),F((i%7-3)*64-i*.25)]if name=='travel'else [0.,0.]
        camera=[F(position[0]-1.5),F(position[1]+.75)]if name=='travel'else [0.,0.]
        mapid=[39999,40000,41999,42000,59000,59001,59100,59002,-1,40001][(i//4)%10]if name=='gate'else 40000+(i//65)
        gate=1 if name=='gate'and i%3==0 else 0
        requested=not(name=='absence'and i%5 in[1,2,3])
        command=None
        if requested:
            if gate or not(40000<=mapid<42000 or mapid in[59000,59001,59100]):amp=0
            else:
                if last!=mapid:last=mapid;amp=0
                def py(pos):return F(((pos[1]-camera[1])-(pos[0]-camera[0]))/64*24+240)
                phase=F(phase-F((py(previous)-py(position))*.125))
                while phase>=64:phase=F(phase-64)
                while phase<0:phase=F(phase+64)
                command=dict(phase=int(phase),amplitude=amp)
                if amp<100:amp+=2
        previous=position.copy();passes+=1
        trace.append(dict(updates=count,requested=requested,mapId=mapid,position=position,camera=camera,center=[320,240],gate=gate,command=command,
            state=dict(phase=phase,amplitude=amp,lastMap=last,previous=previous,updates=updates,passes=passes)))
    traces.append(dict(name=name,rows=trace))
out=dict(stage=298,original=True,frames=frames,viewports=viewports,orders=orders,traces=traces)
(A/'original-vectors.json').write_text(json.dumps(out,separators=(',',':'))+'\n')
print(json.dumps(dict(stage=298,nativeFrames=len(frames),viewportFrames=len(viewports),orderFrames=len(orders),statePasses=sum(len(t['rows'])for t in traces))))
