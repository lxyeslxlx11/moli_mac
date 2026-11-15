"""Independent byte-address source fade oracle and original pixel fixtures. No product imports."""
from pathlib import Path
import hashlib,json,struct
A=Path(__file__).resolve().parent
V=0xf5f3ec;X=0xf5fb6c;Y=0xf602ec
def f32(x):return struct.unpack('<f',struct.pack('<f',x))[0]
def capture():return bytes(v for y in range(480)for x in range(640)for v in [(x*3+y*7)&255,(x*11+y*5)&255,(x^y)&255,255])
def copies(kind,rows,w=640,h=480):
 out=[]
 for y in (range(480)if kind==12 else range(479,0,-1)):
  dx,dy=(rows[y],y)if kind==12 else(0,rows[y])
  left=max(0,-dx);right=min(640,w-dx)
  if 0<=dy<h and right>left:out.append([4*(y*640+left),4*(dy*w+dx+left),4*(right-left)])
 return out
def pixels(raw,spans,w=640,h=480):
 out=bytearray(w*h*4)
 for a,b,n in spans:out[b:b+n]=raw[a:a+n]
 return out
raw=capture();modes=[]
for kind in [12,14]:
 memory={V+4*i:0.0 for i in range(481)};memory.update({X+4*i:0.0 for i in range(480)});memory.update({Y+4*i:float(i)for i in range(481)})
 count=0;frames=[]
 def add(address,value):memory[address]=f32(memory.get(address,0)+value)
 for call in range(1,100):
  for row in range(count):
   if kind==12:
    delta=2 if row%2 else -2;other=(480 if row%2 else 478)-row
    for at in [row,other]:add(V+at*4,delta);add(X+at*4,memory[V+at*4])
   else:
    add(V+row*4,-2);add(Y+row*4,memory[V+row*4])
    if row<240:
     other=480-row;add(V+other*4,2);add(Y+other*4,memory[V+other*4])
  count=min(241,count+8);base=X if kind==12 else Y;positions=[memory[base+4*i]for i in range(480)];rows=[int(x)for x in positions];spans=copies(kind,rows);complete=abs(positions[241])>640
  frames.append(dict(call=call,counter=count,complete=complete,positions=positions,velocities=[memory[V+4*i]for i in range(480)],rowPositions=rows,copies=spans,rgbaSha256=hashlib.sha256(pixels(raw,spans)).hexdigest()))
  if complete:break
 assert frames[-1]['complete'];clips=[]
 for frame in [frames[0],frames[7],frames[30],frames[-1]]:
  for w,h in [(320,240),(640,1),(1,480),(700,500)]:clips.append(dict(call=frame['call'],width=w,height=h,rgbaSha256=hashlib.sha256(pixels(raw,copies(kind,frame['rowPositions'],w,h),w,h)).hexdigest()))
 modes.append(dict(type=kind,frames=frames,clips=clips))
out=dict(schema='moli.original-battle-exit-vectors-stage188.v1',authority='independent address-based float32/source copy-plan oracle using synthetic pixels; no original execution',source_sha256='37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd',source_addresses=dict(velocity=hex(V),x=hex(X),y=hex(Y),render='503157..503227',completion='row241 outside inclusive[-640,640]'),captureSha256=hashlib.sha256(raw).hexdigest(),modes=modes,counts=dict(types=2,fade_steps=sum(len(m['frames'])for m in modes),row_states=480*sum(len(m['frames'])for m in modes),clip_cases=sum(len(m['clips'])for m in modes)))
(A/'original-vectors.json').write_text(json.dumps(out,separators=(',',':'))+'\n');print(json.dumps(dict(**out['counts'],calls={m['type']:len(m['frames'])for m in modes})))
