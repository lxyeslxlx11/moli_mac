#!/usr/bin/env python3
"""Independent synthetic party motion and ordinary scene reference. No product imports."""
from pathlib import Path
import copy, importlib.util, json, math, random, struct
A=Path(__file__).resolve().parent
def load(name,p):
 s=importlib.util.spec_from_file_location(name,p);m=importlib.util.module_from_spec(s);s.loader.exec_module(m);return m
scene=load('party_scene',A.parent/'game-legacy-scene-frame-v1/generate_vectors.py');anime=scene.anime
f=lambda n:struct.unpack('<f',struct.pack('<f',n))[0]
scale=lambda n:f(1 if n<2 else 1.2 if n<4 else 1.6 if n<6 else 2)
def body(id,x,speed=100):return dict(id=id,local=id==100,target=[x,3],display=[x,3],position=[f(x*64),192.0],velocity=[0.0,0.0],queue=[],speed=speed,facingCode=4,animation=0,moving=False,phase=0)
def aligned(b):return b['position']==[f(n*64)for n in b['target']]
def enqueue(b,p):
 if len(b['queue'])<10:b['queue'].append(p[:])
 else:b.update(queue=[],target=p[:],display=p[:],position=[f(n*64)for n in p],velocity=[0.0,0.0])
def start(b,speed,factor):
 p=b['queue'].pop(0);dx,dy=[f(p[i]*64-b['position'][i])for i in range(2)];distance=f(math.sqrt(dx*dx+dy*dy));nx,ny=[f(n/distance)if distance else 0.0 for n in [dx,dy]];rate=f(speed*factor*f(0.01))
 b.update(target=p,velocity=[f(nx*rate*4),f(ny*rate*4)]if factor!=0 else[f(speed*nx*4*0.01),f(speed*ny*4*0.01)])
 if nx or ny:b['facingCode']=scene.frame.actor.facing(nx,ny);b['moving']=True
def advance(b,multiplier=1):
 if b['velocity']==[0,0]:
  if b['moving']:
   b['animation']=0
   if b['local']:b['phase']=-1
  b['moving']=False
 else:
  v=[f(n*multiplier)for n in b['velocity']];delta=[f(b['target'][i]*64)-b['position'][i]for i in range(2)]
  if sum(n*n for n in v)<sum(n*n for n in delta):b['position']=[f(b['position'][i]+v[i])for i in range(2)]
  else:b['position']=[f(n*64)for n in b['target']];b['velocity']=[0.0,0.0]
  b['animation']=1;b['moving']=True
 if not b['local']or b['velocity']==[0,0]:b['display']=[math.trunc(n/64)for n in b['position']]
def vectors(name,count):
 leader=name=='leader';definitions=[body(100,2),body(200,1 if leader else 5),body(300,0 if leader else 1)]
 if name=='removal':definitions.append(body(400,4))
 byid={b['id']:b for b in definitions};members=[100,200,300]if leader else[200,100,300];slots=[0,2,4];packets=[]
 for b in definitions[1:]:packets.append(f"H#| 1|{scene.wire.integer(b['id']).decode()}|{b['display'][0]}|3|4|100001|0|0|Member|Guild|0|0|0|Tail|0|0| ")
 for slot,id in zip(slots,members):packets.append(f'HFs {slot} 1|{id}|0|0|0|0|Member ')
 if name=='removal':
  packets.append('HFs 1 1|400|0|0|0|0|Middle ');packets.append('HFs 1 0 ');enqueue(byid[100],[4,3]);enqueue(byid[300],[2,3])
 elif not leader:
  for p in [[6,3],[7,3],[8,3],[9,3],[10,3],[10,4]]:packets.append(f'Hx! 3e|{p[0]}|{p[1]}|1|4|80|0|0 ');enqueue(byid[200],p);byid[200]['animation']=1;byid[200]['speed']=80
 state={b['id']:anime.initial()for b in definitions};parsed=anime.parse(anime.groups());mapmodel=scene.Scene();planes=scene.planes(1);frames=[];factor=1.0;path=[[3,3],[4,3],[5,3]]if leader else[]
 for frame in range(count):
  local=byid[100]
  if leader:
   factor=1.0
   if aligned(local)and path:
    old=local['display'][:];enqueue(local,path.pop(0));start(local,100,1);enqueue(byid[members[1]],old)
   for i,id in enumerate(members[1:],1):
    b=byid[id]
    if aligned(b)and b['queue']:
     old=b['display'][:];start(b,100,scale(len(b['queue'])))
     if i+1<len(members):enqueue(byid[members[i+1]],old)
   advance(local)
   for id in members[1:]:advance(byid[id])
  else:
   for i,id in enumerate(members):
    b=byid[id]
    if aligned(b)and b['queue']:
     if i==0:factor=scale(len(b['queue']))
     old=b['display'][:];start(b,byid[members[0]]['speed'],0)
     if i+1<len(members):enqueue(byid[members[i+1]],old)
   for id in members:advance(byid[id],factor)
  roots=[];helpers={}
  for b in definitions:
   q=state[b['id']]
   if b['phase']==-1:q=dict(q,lastAction=-1)
   calls=1+(int(factor>=f(1.2))+int(factor>=f(1.6))if not b['local']and b['id']in members else int(len(b['queue'])>=2)+int(len(b['queue'])>=4))
   c=anime.ctx(resourceId=100001,action=b['animation'],facing=b['facingCode'],mode=0 if b['animation']in[0,1]else 1,frozen=0,staticFlip=False,soundScene=0,actorFlags=0xb4 if b['local']else 0x134)
   for _ in range(calls):q,_=anime.step(q,c,parsed)
   state[b['id']]=q;b['phase']=q['lastAction'];helpers[str(b['id'])]=calls;g=q['geometry'];at=scene.project(b['position'],local['position'],[160,120],True);at=[scene.short(at[i]+q['drawOffsetX'if i==0 else'drawOffsetY']-(g['originX'if i==0 else'originY']if g else 0))for i in range(2)]
   roots.append(dict(id=b['id'],graphicIndex=q['graphicIndex'],position=b['position'][:],screenPosition=at,sortFlag=int(b['local']),command=scene.ordinary(q['graphicIndex'],*at,10,q)if g else None))
  request=dict(tick=1000+math.ceil(frame*1000/60),camera=local['position'][:],center=[160,120],width=320,height=240,runtime={})
  result=mapmodel.step(12,12,planes,1,dict(tileCenter=local['display'][:],drawPrimitives=False),request,roots)
  frames.append(dict(tick=request['tick'],movementScale=factor,helpers=helpers,actors=copy.deepcopy(definitions),camera=request['camera'],rgbaSha256=result['rgbaSha256']))
 return dict(name=name,slots=slots,members=members,packets=packets,destination=[5,3]if leader else None,expected_requests=2 if leader else 0,frames=frames)
def main():
 rng=random.Random(178);distances=[]
 for _ in range(160):
  p=[rng.randint(-33554432,33554431)for _ in range(2)];q=[p[i]+rng.randint(-3,3)for i in range(2)];distances.append(dict(points=p+q,near=all(abs(p[i]-q[i])<2 for i in range(2))))
 out=dict(schema='moli.original-party-follow-stage178.v1',original_synthetic_only=True,distances=distances,queueScales=[scale(n)for n in range(11)],cases=[vectors('leader',64),vectors('follower',96),vectors('removal',64)])
 (A/'original-vectors.json').write_text(json.dumps(out,indent=2)+'\n');print(json.dumps(dict(cases=3,scene_frames=224,unique_RGBA=len({r['rgbaSha256']for c in out['cases']for r in c['frames']}),distances=160)))
if __name__=='__main__':main()
