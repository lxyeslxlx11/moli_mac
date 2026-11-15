"""Independent fixed-city state order and water/type15 full-frame reference, original pixels only."""
from pathlib import Path
from hashlib import sha256
import struct
import json
A=Path(__file__).resolve().parent
F=lambda n:struct.unpack('<f',struct.pack('<f',n))[0]
TABLE=[0,1,2,3,4,5,6,7,8,9,10,10,11,11,11,12,12,12,11,11,11,10,9,9,8,7,6,5,4,3,2,1,0,-1,-2,-3,-4,-5,-6,-7,-8,-9,-10,-10,-11,-11,-11,-12,-12,-12,-11,-11,-11,-10,-9,-9,-8,-7,-6,-5,-4,-3,-2,-1]
traces=[]
for route in ['scene','boundary']:
 for mapid in ([40000,59000]if route=='scene'else[40000]):
  for own in [0,1,25,70]:
   phase=0.;amp=last=updates=passes=0;previous=[0.,0.];rows=[]
   def advance():
    global phase,updates
    phase=F(phase+.25);updates+=1
   def consume(requested,mapid):
    global phase,amp,last,passes
    command=None
    if requested:
     if last!=mapid:last=mapid;amp=0
     old=F((previous[1]-previous[0])/64*24+240);now=264.
     phase=F(phase-F((old-now)*.125))%64
     command=dict(phase=int(phase),amplitude=amp);amp=min(100,amp+2)
    passes+=1
    return command
   def record(label,command=None):rows.append(dict(label=label,command=command,state=dict(phase=phase,amplitude=amp,lastMap=last,previous=previous.copy(),updates=updates,passes=passes)))
   for i in range(54):
    advance();command=consume(True,40000);previous=[128.,192.];record('warm'if i<51 else'awaiting',command)
   local=False;steps=104 if route=='scene'else 80;capture_at=56 if route=='scene'else 32
   for i in range(1,steps+1):
    if own==i:local=True
    if i==capture_at and route=='boundary':local=True
    command=consume(True,mapid)if i==capture_at else None
    if local:advance()
    consume(False,mapid);previous=[128.,192.];record(str(i),command)
   traces.append(dict(route=route,mapId=mapid,ownAt=own,steps=steps,captureAt=capture_at,rows=rows))

width,height=640,480;raw=bytes(c for y in range(height)for x in range(width)for c in[(x*3+y*7)&255,(x*11+y*5)&255,(x^y)&255,255]);rasters=[]
for phase,amplitude in [(16,100),(16,0)]:
 capture=bytearray(raw);stride=width*4
 for i in range(60):
  sy=8*i+12+int(TABLE[(phase+i)%64]*amplitude/100)
  if 0<=sy<=472:capture[i*8*stride:(i+1)*8*stride]=raw[sy*stride:(sy+8)*stride]
 distances=[min(y,height-y)for y in range(height)];ages=[0]*height;count=0
 def positions():return[y+(-1 if y<=height//2 else 1)*age*(age+1)for y,age in enumerate(ages)]
 while abs(positions()[241])<=640:
  ages=[age+int(d<count)for age,d in zip(ages,distances)];count+=8 if count<241 else 0
 frames=[]
 for call in range(1,50):
  ages=[age-int(d<count)for age,d in zip(ages,distances)];ys=positions()
  if ys[240]>=240:count=max(0,count-8)
  out=bytearray(len(capture))
  for y,dest in enumerate(ys):
   if 0<=dest<height:out[dest*stride:(dest+1)*stride]=capture[y*stride:(y+1)*stride]
  frames.append(sha256(out).hexdigest())
 rasters.append(dict(phase=phase,amplitude=amplitude,capture=sha256(capture).hexdigest(),frames=frames))
out=dict(stage=300,traces=traces,rasters=rasters)
(A/'original-vectors.json').write_text(json.dumps(out,separators=(',',':'))+'\n')
print(json.dumps(dict(stage=300,traces=len(traces),states=sum(len(t['rows'])for t in traces),completeFrames=sum(len(r['frames'])for r in rasters))))
