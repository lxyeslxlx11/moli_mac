"""Original RGBA/effect state expectations, independent of all JavaScript product modules."""
from pathlib import Path
from hashlib import sha256
import struct
import json
A=Path(__file__).resolve().parent
F=lambda n:struct.unpack('<f',struct.pack('<f',n))[0]
TABLE=[0,1,2,3,4,5,6,7,8,9,10,10,11,11,11,12,12,12,11,11,11,10,9,9,8,7,6,5,4,3,2,1,0,-1,-2,-3,-4,-5,-6,-7,-8,-9,-10,-10,-11,-11,-11,-12,-12,-12,-11,-11,-11,-10,-9,-9,-8,-7,-6,-5,-4,-3,-2,-1]
COLORS=[[31,61,91],[111,141,171],[191,211,231]]


def paint(out,index,x0,y0):
    for y in range(8):
        for x in range(8):
            i=index-3096
            if(x+y+i)%5==0:continue
            p=((y0+y)*640+x0+x)*4;out[p:p+4]=bytes(COLORS[(x+2*y+i)%3]+[255])


def ripple(out,phase,amp):
    old=out.copy()
    for i in range(60):
        sy=8*i+12+int(TABLE[(phase+i)&63]*amp/100)
        if 0<=sy<=472:out[i*8*640*4:(i+1)*8*640*4]=old[sy*640*4:(sy+8)*640*4]


scenarios=[];frames=0
for index in range(3096,3106):
    for gate in[0,1]:
        quarter=(index-3096)*31
        for background in[0,5001]:
            rows=[]
            for tick in range(52 if background else 1):
                phase=quarter*.25;strip=None
                if gate==0:phase%=64;strip=dict(phase=int(phase),amplitude=min(100,tick*2))
                out=bytearray(640*480*4)
                if background:paint(out,3097,320,240)
                if strip:ripple(out,strip['phase'],strip['amplitude'])
                paint(out,index,479,361)
                rows.append(dict(tick=tick,strip=strip,rgbaSha256=sha256(out).hexdigest(),state=dict(phase=phase,amplitude=min(100,(tick+1)*2)if gate==0 else 0,lastMap=40000 if gate==0 else 0,previous=[0,0],updates=quarter,passes=tick+1)))
            frames+=len(rows);scenarios.append(dict(index=index,gate=gate,background=background,quarter=quarter,frames=rows))

traces=[]
for seed in range(12):
    phase=0.;amp=last=updates=passes=0;previous=[0.,0.];events=[]
    for i in range(100):
        # Distinct update, nested consume, and outer position snapshot. Never
        # silently turn a capture into an update or snapshot.
        if i%7==0:
            phase=F(phase+.25);updates+=1;event=dict(op='advance')
        elif i%7 in[1,2,3,4]:
            position=[F((i+seed)*.5),F((seed-i)*.25)];camera=[F(seed*8),F(-seed*4)];center=[320,240]
            requested=(i%7)!=4;gate=1 if(i+seed)%11==0 else 0;mapid=[40000,59000,23][(i//17+seed)%3];result=None
            if requested:
                if gate or mapid==23:amp=0
                else:
                    if last!=mapid:last=mapid;amp=0
                    py=lambda p:F(((p[1]-camera[1])-(p[0]-camera[0]))/64*24+240)
                    phase=F(phase-F((py(previous)-py(position))*.125))
                    while phase>=64:phase=F(phase-64)
                    while phase<0:phase=F(phase+64)
                    result=dict(phase=int(phase),amplitude=amp)
                    if amp<100:amp+=2
            passes+=1;event=dict(op='consume',args=[requested,mapid,position,camera,center,gate],result=result)
        else:
            position=[F((i+seed)*.5),F((seed-i)*.25)];previous=position;event=dict(op='savePosition',args=[position])
        event['state']=dict(phase=phase,amplitude=amp,lastMap=last,previous=previous,updates=updates,passes=passes);events.append(event)
    traces.append(dict(seed=seed,events=events))
out=dict(stage=299,original=True,source='Authored indexed textures andsource-derived state ordering;not nativecaptures',scenarios=scenarios,traces=traces)
(A/'original-vectors.json').write_text(json.dumps(out,separators=(',',':'))+'\n')
print(json.dumps(dict(stage=299,scenarios=len(scenarios),completeRGBA=frames,orderedEvents=sum(len(t['events'])for t in traces))))
