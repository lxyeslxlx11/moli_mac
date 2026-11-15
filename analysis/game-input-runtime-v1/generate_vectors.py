#!/usr/bin/env python3
"""Independent original inverse/pointer/clock and camera-follow scene reference."""
from pathlib import Path
import copy,importlib.util,json,math,random,struct
HERE=Path(__file__).resolve().parent;ROOT=HERE.parents[1]
def load(name,path):
 s=importlib.util.spec_from_file_location(name,path);m=importlib.util.module_from_spec(s);s.loader.exec_module(m);return m
f=lambda n:struct.unpack('<f',struct.pack('<f',n))[0]
i32=lambda n:(int(n)+2147483648)%4294967296-2147483648
u32=lambda n:int(n)%4294967296
CTX=dict(hitIndex=0,dialogIndex=-1,inputOverride=0,cursorOverride=0,overlayA=0,overlayB=0,leftBlock=0,ownGateByte=0,nativePartyMode=0,nativePartyFlags=0,nativeCoordinationGuard=0,nativeActionGuard=0,actionResetEligible=False)
nav=load('original_nav_input',ROOT/'analysis/game-legacy-local-movement-v1/generate_vectors.py')
def pick(screen,camera,center):
 dx=f(screen[0])-center[0];scaled=(f(screen[1])-center[1])*f(4/3);p=[f(dx-scaled+f(camera[0])),f(scaled+dx+f(camera[1]))];n=[math.trunc(x+0.5) for x in p];return dict(position=p,pickedPosition=n,tile=[math.trunc(i32(x+32)/64) for x in n])
class Pointer:
 def __init__(self):self.screen=[0,0];self.held=self.edges=self.start=self.duration=self.auto=self.last=self.updates=0
 def event(self,e):
  op=e[0]
  if op=='move':self.screen=e[1]
  elif op=='reset':self.held=self.edges=0
  elif op=='press':m=1 if e[1]==0 else 2;self.held|=m;self.edges|=m|(m<<4 if len(e)>2 and e[2] else 0)
  elif op=='release':m=1 if e[1]==0 else 2;self.held&=~m;self.edges|=m<<2
 def step(self,r):
  c=r['context'];now=r['tick'];p=pick(self.screen,r['camera'],r['center']);base=c['hitIndex']<212 and c['dialogIndex']<0;inside=self.screen[1]<456;enabled=inside and (base or c['inputOverride'] or c['overlayA'] or c['overlayB']);hint=bool(inside and (base or c['cursorOverride'] or c['overlayA'] or c['overlayB']) and self.auto==0);lp=lh=rp=rh=False
  if enabled:
   if self.edges&1 and c['leftBlock']==0:lp=True;self.duration=0;self.start=now
   if not self.held&1 or c['leftBlock']:self.duration=self.start=0
   else:
    lh=True
    if self.start:self.duration=u32(now-self.start)
   rp=bool(self.edges&2);rh=bool(self.held&2 and not rp)
  else:self.duration=self.start=0
  clear=c['actionResetEligible'];guard=0 if clear else c['nativeActionGuard'];advance=c['ownGateByte']&128==0;dest=None;style=None
  if advance and (not c['nativePartyMode'] or c['nativePartyFlags']&256) and not c['nativeCoordinationGuard'] and not guard:
   attempt=False
   if self.duration<500 and self.auto!=1:attempt=lp
   else:
    if self.duration>=500:self.auto=1
    if not self.edges&1:
     attempt=True
     if p['tile']!=r['display']:style=nav.face(p['tile'][0]-r['display'][0],p['tile'][1]-r['display'][1])+3
    else:self.auto=0
   if attempt and u32(self.last+250)<=now:self.last=now;dest=p['tile'][:]
  self.updates+=1
  return dict(kind='source-pointer-update',**p,screenPosition=self.screen[:],leftPress=lp,leftHeld=lh,rightPress=rp,rightHeld=rh,duration=self.duration,autoWalk=self.auto,lastRequestTick=self.last,destination=dest,cursorTileHint=hint,cursorStyle=style,clearActionGuard=clear,advanceLocal=advance,rightInteractions='unmodeled' if rp and advance else None,currentVersionCompatibility='unverified')
 def state(self):return dict(screenPosition=self.screen[:],heldBits=self.held,pressedBits=self.edges,startTick=self.start,duration=self.duration,autoWalk=self.auto,lastRequestTick=self.last,updates=self.updates)
PERIOD=struct.unpack('<d',bytes.fromhex('abaaaaaaaaaa3040'))[0]
class Clock:
 def __init__(self,now):self.deadline=now;self.phase='ready';self.count=1;self.updates=self.presentations=0;self.pending=False
 def complete(self):self.deadline+=PERIOD;self.count=1;self.presentations+=int(self.pending);self.pending=False;self.phase='ready'
 def begin(self,now):
  if self.phase=='waiting':
   if now<=self.deadline:return dict(ready=False,waitMilliseconds=math.floor(self.deadline-now)+1)
   self.complete()
  assert self.phase=='ready';self.phase='updating';return dict(ready=True,waitMilliseconds=0)
 def finish(self,now,mode,force):
  assert self.phase=='updating';mode=2 if mode==1 and not force else mode;self.updates+=1
  if not force and mode and now>self.deadline+PERIOD and self.count<=19:self.deadline+=PERIOD;self.count+=1;self.phase='ready';return dict(present=False,repeat=True,graphicsMode=mode,waitMilliseconds=0)
  self.pending=bool(force or mode);present=self.pending
  if now<=self.deadline:self.phase='waiting';delay=math.floor(self.deadline-now)+1
  else:self.complete();delay=0
  return dict(present=present,repeat=False,graphicsMode=mode,waitMilliseconds=delay)
 def state(self):return dict(deadline=self.deadline,phase=self.phase,skipCount=self.count,updates=self.updates,presentations=self.presentations,pendingPresentation=self.pending)
def main():
 rng=random.Random(163);picks=[]
 for i in range(1200):
  args=dict(screen=[rng.randrange(-2000,2001),rng.randrange(-2000,2001)],camera=[f(rng.uniform(-100000,100000)),f(rng.uniform(-100000,100000))],center=[rng.randrange(-500,501),rng.randrange(-500,501)]);picks.append(dict(**args,expected=pick(**args)))
 for x in [-97,-96,-65,-64,-33,-32,-1,0,1,31,32,63,64]:
  args=dict(screen=[0,0],camera=[x,x],center=[0,0]);picks.append(dict(**args,expected=pick(**args)))
 traces=[]
 for name,initial,events,times in [
  ('auto-release-cancel',1000,{0:[['move',[256,48]],['press',0]],3:[['release',0]],5:[['press',0]],7:[['release',0]]},[1000,1499,1500,1501,1750,1751,2001,2251]),
  ('fast-click',1000,{0:[['move',[256,48]],['press',0],['release',0]]},[1000,1017,1250]),
  ('tick-zero',0,{0:[['press',0]],2:[['release',0]],3:[['press',0]]},[0,500,501,502,1002]),
  ('right-double',1000,{0:[['press',2,True]],2:[['release',2]],3:[['press',0,True],['release',0]]},[1000,1017,1034,1051]),
  ('unsigned-wrap',4294967200,{0:[['press',0]],2:[['release',0]],3:[['press',0]]},[4294967200,4294967295,1,250,750]),
  ('opaque-gates',1000,{0:[['press',0]],5:[['release',0]]},[1000,1500,1750,2000,2250,2500,2750,3000])]:
  pointer=Pointer();rows=[]
  for i,t in enumerate(times):
   es=events.get(i,[])
   for e in es:pointer.event(e)
   c=CTX.copy()
   if name=='opaque-gates':
    if i==1:c['hitIndex']=212
    if i==2:c.update(hitIndex=212,inputOverride=1,cursorOverride=0)
    if i==3:c.update(ownGateByte=128,nativeActionGuard=1,actionResetEligible=True)
    if i==4:c.update(nativePartyMode=1,nativePartyFlags=0)
    if i==5:c.update(nativePartyMode=1,nativePartyFlags=256)
    if i==6:es=es+[['move',[100,456]]];pointer.event(['move',[100,456]])
   r=dict(tick=t,camera=[128,192],center=[160,120],display=[2,3],context=c);out=pointer.step(r);mode=0 if name=='right-double' and i==0 else 2
   if mode:pointer.edges=0
   rows.append(dict(events=es,request=r,graphicsMode=mode,expected=out,state=pointer.state()))
  traces.append(dict(name=name,initialTick=initial,rows=rows))
 clocks=[]
 for name,start in [('normal',1000),('late',0),('wrap',4294967280)]:
  clock=Clock(start);now=start;rows=[]
  for i in range(600):
   if name=='wrap':now=u32(now+1 if i<20 else now+19)
   elif name=='late':now=10000+i//20*1000
   else:now+=rng.randrange(0,39)
   begin=clock.begin(now);mode=[0,1,2][i%3];force=i%23==0;finish=clock.finish(now,mode,force) if begin['ready'] else None;rows.append(dict(tick=now,mode=mode,force=force,begin=begin,finish=finish,state=clock.state()))
  clocks.append(dict(name=name,initialTick=start,rows=rows))
 scene=load('original_scene_input',ROOT/'analysis/game-legacy-scene-frame-v1/generate_vectors.py');v=json.loads((ROOT/'analysis/game-legacy-scene-frame-v1/original-vectors.json').read_text());av=json.loads((ROOT/'analysis/game-legacy-frame-v1/original-vectors.json').read_text());model=scene.Scene();world=[];p=scene.planes(1)
 for i,a in enumerate(av['worldFrames']):
  q=a['animation'];g=q['geometry'];screen=[160,120];at=[scene.short(screen[j]+q['drawOffsetX' if j==0 else 'drawOffsetY']-(g['originX' if j==0 else 'originY'] if g else 0)) for j in [0,1]];index=q['graphicIndex'];command=scene.ordinary(index,*at,10,q) if g and scene.graphic(index)['resourceId']!=1 else None
  roots=[dict(graphicIndex=index,position=a['position'],screenPosition=at,sortFlag=1,ordinal=0,id=100,command=command)];r=dict(tick=1000+math.ceil(i*PERIOD),camera=a['position'],center=[160,120],width=320,height=240,runtime=v['runtime']);expected=model.step(12,12,p,1,dict(tileCenter=a['display'],drawPrimitives=False),r,roots);world.append(dict(tick=r['tick'],camera=a['position'],display=a['display'],actorScreen=[160,120],scene=expected))
 browser_model=scene.Scene();idle,_=scene.anime.step(scene.anime.initial(),scene.anime.ctx(resourceId=100001,action=0,facing=4),scene.anime.parse(scene.anime.groups()));browser=[]
 def actor(q,position):
  g=q['geometry'];at=[scene.short(160+q['drawOffsetX']-(g['originX'] if g else 0)),scene.short(120+q['drawOffsetY']-(g['originY'] if g else 0))];index=q['graphicIndex'];command=scene.ordinary(index,*at,10,q) if g and scene.graphic(index)['resourceId']!=1 else None;return [dict(graphicIndex=index,position=position,screenPosition=at,sortFlag=1,ordinal=0,id=100,command=command)]
 req=dict(camera=[128,192],center=[160,120],width=320,height=240,runtime=v['runtime'],tick=1000);idle_scene=browser_model.step(12,12,p,1,dict(tileCenter=[2,3],drawPrimitives=False),req,actor(idle,[128,192]))
 for i,a in enumerate(av['worldFrames']):
  req=dict(req,camera=a['position'],tick=1000+math.ceil((i+1)*PERIOD));browser.append(dict(tick=req['tick'],camera=a['position'],display=a['display'],scene=browser_model.step(12,12,p,1,dict(tileCenter=a['display'],drawPrimitives=False),req,actor(a['animation'],a['position']))))
 out=dict(schema='moli.original-game-input-runtime-stage163.v1',original_synthetic_only=True,context=CTX,picks=picks,pointerTraces=traces,clockTraces=clocks,worldFrames=world,browserIdle=idle_scene,browserFrames=browser,protocol=v['protocol'],bootstrap=v['bootstrap'])
 (HERE/'original-vectors.json').write_text(json.dumps(out,indent=2)+'\n');print(json.dumps(dict(picks=len(picks),pointerUpdates=sum(len(t['rows']) for t in traces),clockCalls=sum(len(t['rows']) for t in clocks),worldFrames=len(world))))
if __name__=='__main__':main()
