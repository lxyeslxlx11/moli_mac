#!/usr/bin/env python3
"""Independent source equations and original synthetic bytes; no product imports."""
from pathlib import Path
from types import SimpleNamespace
import copy,hashlib,importlib.util,json,math,struct,sys

sys.dont_write_bytecode=True
A=Path(__file__).resolve().parent;R=A.parent.parent;P=R/'build/analysis/game-battle-physical-projectiles-v1'
s=importlib.util.spec_from_file_location('physical_direct_reference',A.parent/'game-battle-physical-family-runtime-v1/generate_vectors.py')
prior=importlib.util.module_from_spec(s);s.loader.exec_module(prior)
anime=prior.anime;skill=prior.skill;f=prior.f;layout=prior.layout;digest=prior.digest;signed=prior.signed

def fixtures():
 _,records,source=prior.fixtures();files={row['path']:bytes.fromhex(row['bytesHex'])for row in source}
 index=bytearray(files['Bin/AnimeInfo.bin']);data=bytearray(files['Bin/Anime.bin']);info=bytearray(files['Bin/GraphicInfo.bin']);pixels=bytearray(files['Bin/Graphic.bin'])
 positions={struct.unpack_from('<I',index,at)[0]:at for at in range(0,len(index),12)}
 def add(resource,blocks,replace=False):
  if resource in positions and not replace:return
  row=struct.pack('<IIHH',resource,len(data),len(blocks),0)
  if resource in positions:index[positions[resource]:positions[resource]+12]=row
  else:positions[resource]=len(index);index.extend(row)
  data.extend(b''.join(blocks))
 for resource,probe_event,attack_event in [(100090,10001,10002),(100091,0,10003),(100092,10004,10005)]:
  add(resource,[anime.action(direction,action,96,[(g,-1,1,(probe_event if action==7 else attack_event if action==5 else 0)if i==1 else 0)for i,g in enumerate([1002,1004,1005])])for direction in range(8)for action in range(20)])
 resources=[*range(0x564a,0x564a+32),*range(0x5622,0x5622+32),0x19258,0x1ae13,0x1af85,0x1af89,0x1af8a,0x1adbe,0x1af8c,0x1af8d]
 known_graphics={r['resourceId']for r in records};next_graphic=max(r['index']for r in records)+1
 for resource in resources:
  if resource>=100000:
   add(resource,[anime.action(direction,0,96,[(1002,0,0,0),(1004,1,-1,0),(1005,0,0,0)])for direction in range(8)],replace=True);continue
  if resource in known_graphics:continue
  width,height=8,7;paint=bytes(0 if(i+resource)%5==0 else 17+(i+resource)%3 for i in range(width*height));raw=b'RD\0\0'+struct.pack('<iiI',width,height,len(paint)+16)+paint
  row=bytearray(40);struct.pack_into('<IIIiiii',row,0,next_graphic,len(pixels),len(raw),-3,-4,width,height);struct.pack_into('<I',row,36,resource);info.extend(row);pixels.extend(raw)
  records.append(dict(index=next_graphic,resourceId=resource,originX=-3,originY=-4,width=width,height=height))
  skill.scene.IMAGES[next_graphic]=dict(index=next_graphic,resource=resource,origin=[-3,-4],width=width,height=height,pixels=paint,embedded=None)
  next_graphic+=1;known_graphics.add(resource)
 files.update({'Bin/AnimeInfo.bin':bytes(index),'Bin/Anime.bin':bytes(data),'Bin/GraphicInfo.bin':bytes(info),'Bin/Graphic.bin':bytes(pixels)})
 return anime.parse([dict(index=files['Bin/AnimeInfo.bin'],animation=files['Bin/Anime.bin'],graphicBase=0)]),records,[dict(path=name,bytesHex=b.hex())for name,b in files.items()]

def queues(c):
 caster=c.get('caster',c['hits'][0][0]);rows={}
 def row(s):return rows.setdefault(s,dict(slot=s,actions=[],tuples=[],assignments={}))
 def act(s,*values):row(s)['actions'].extend(values)
 own=row(caster);related=c['category']==73;own['assignments'].update(classCode=c['category'],skillLevel=c['level'])
 if not related:own['assignments']['mpCost']=c.get('cost',3);act(caster,38)
 if c['category']not in[73,94,96]:act(caster,147)
 if c['category']==105:own['assignments']['afterImageEnabled']=1
 if not related:act(caster,53)
 own['assignments']['physicalVariant']=c['variant'];act(caster,24,*([18]if c['variant']==3 else[15,41,23]if c['variant']==2 and related else[15,41]if c['variant']==2 else[15]))
 for _,target,flags,value,*rest in c['hits']:
  if target==caster and not related:continue
  packed=[target,signed(flags),value,rest[0][0]if flags&0x800000 else 0];own['tuples'].append(packed)
  if flags&0x800000:
   a,b,d=rest[0];own['tuples'].extend([[target,signed(flags),a,b],[target,signed(flags),d,0],packed[:]])
  act(target,0)
  if not flags&0x108:
   if flags&0x40:act(target,32,*([244]if target==c['local']else[50,49]))
   elif value!=0 and flags&3 and(related or not flags&0x20000000):act(target,28 if c['category']==95 and not flags&0x20 else 160 if flags&2 else 26)
  if (value!=0 or flags&0x108)and not flags&(0xe000 if related else 0x2000e000)and(c['category']!=95 or flags&0x20):
   act(target,11)
   if c['category']!=95 and flags&0x100:act(target,74)
  if flags&0x20:act(target,44)
 if not related:own['tuples'].append([-1,0,0,0]);act(caster,72,*([23]if c['variant']==2 else[]))
 own['assignments']['physicalFamily']=1
 return dict(principal=caster,rows=list(rows.values()))

def normalize(a):return f(a-360)if a>=360 else f(a+360)if a<0 else a
def difference(a,b):
 d=a-b
 return d-360 if d>180 else d+360 if d<=-180 else d
def steer(b,point,rate=0):
 wanted=skill.old.angle(f(point[0]-b.position[0]),f(point[1]-b.position[1]));d=difference(wanted,b.angle)
 b.angle=wanted if rate==0 else f(b.angle+(-rate if d<0 else rate)if abs(int(d))>=rate else b.angle+d)
def sector(origin,destination):
 reference=f(difference(skill.old.angle(65,-35),0));a=skill.old.angle(f(destination[0]-origin[0]),f(destination[1]-origin[1]))
 if reference<0:a-=reference+360
 a=difference(a,reference)
 if any(abs(a-k)<=5 for k in[0,180,-180]):return 0
 return(1 if a>=0 else-1)if reference<0 else(1 if a<0 else-1)
def approach(origin,screen,first,first_screen,second):
 x,y=first_screen;side=sector(origin,first)
 if second is None:return[x,y]
 ax,bx=first[0],second[0]
 if side==-1:
  if ax<bx:y+=100;x+=20
  if bx<ax:x+=100
 elif side==0:
  if bx<ax and screen[0]<=x:x+=150
  if ax<bx and x<=screen[0]:y+=150
 else:
  if bx<ax:y-=100;x+=20
  if ax<bx:x-=100
 def div(a,b):
  if b==0:raise ValueError('native division frontier')
  result=int(a/b)
  if not-2147483648<=result<=2147483647:raise ValueError('native division overflow')
  return result
 if(side<0 and bx<=ax)or(side>0 and bx>ax):
  if y<screen[1]:
   if x<=screen[0]:return[x,y]
   ratio=min(100,div(signed((x-screen[0])*100),signed(screen[1]-y)))
  else:
   if screen[0]<=x:return[x,y]
   ratio=min(100,div(signed((screen[0]-x)*100),signed(y-screen[1])))
  x+=div(ratio,2)if side<0 else-div(ratio,2);y+=ratio if side<0 else-ratio
 else:
  if x<screen[0]:
   if screen[1]<=y:return[x,y]
   ratio=min(100,div(signed((screen[1]-y)*100),signed(screen[0]-x)))
  else:
   if y<=screen[1]:return[x,y]
   ratio=min(100,div(signed((y-screen[1])*100),signed(x-screen[0])))
  if side:x+=-ratio if side<0 else ratio;y+=div(ratio,2)if side<0 else-div(ratio,2)
 return[signed(x),signed(y)]

class Body(prior.Body):
 def __init__(self,w,slot,resource):
  super().__init__(w,slot,resource);self.role=None;self.variant=0;self.flight=None;self.wait=0
 def distance(self,point):return int(math.sqrt((f(point[0])-self.position[0])**2+(f(point[1])-self.position[1])**2))
 def probe(self):
  found=False
  for _ in range(65536):
   if self.animate(self.body,1)==1:break
   if 10000<=self.body['q']['signal']<=19999:found=True;break
  else:raise ValueError('animation probe budget')
  self.body['q']['lastAction']=-1;self.body['q']['signal']=0;return found
 def emit(self,which):
  if which==15:
   if self.cooldown==0:
    self.cooldown=1;self.action=7
    if not self.probe():self.action=5
   self.percent=100;t=self.tuples[self.tuple_read]
   if t[0]!=-1:
    victim=self.w.bodies[t[0]]
    if self.variant!=2:self.aim(victim.position)
    else:
     point=victim.body['screen'][:]
     if t[0]<10:
      if not 0<=self.slot<=4:
       if self.body['screen'][1]<point[1]:point[0]-=100
      elif point[1]<=self.body['screen'][1]:point[0]+=100
     elif not 10<=self.slot<=14:
      if point[1]<self.body['screen'][1]:point[0]+=100
     elif self.body['screen'][1]<=point[1]:point[0]-=100
     self.aim(point)
   if self.animate(self.body,1)==1:self.pop();self.cooldown=0
   if 10000<=self.body['q']['signal']<=19999:
    if self.variant==2:self.flight=self.w.multiple(self)
    else:
     while True:
      self.w.single(self,0x564a);self.tuple_read+=1
      if self.tuples[self.tuple_read][0]==-1:break
    self.body['q']['signal']=0
  else:
   self.action=5;self.percent=33 if self.category==95 else 100
   if self.tuples[self.tuple_read][0]==-1:
    if self.animate(self.body,1)==1:self.pop()
   else:self.aim(self.w.bodies[self.tuples[self.tuple_read][0]].position);self.animate(self.body,0)
   if 10000<=self.body['q']['signal']<=19999:
    self.w.single(self,0x5622);self.tuple_read+=1
    if self.category==95 and self.tuples[self.tuple_read][0]!=-1:self.body['q']['nextFrame']=self.body['q']['delay']=0
    self.body['q']['signal']=0
 def body_step(self):
  if self.state==28:
   self.action=9 if self.reaction_flags&0xc04 else 8;self.percent=50;self.reaction_count+=1
   if self.reaction_count<14:self.speed=5;self.flip();self.move()
   elif self.reaction_count>43:self.reaction_count=0;self.percent=100;self.speed=4;self.pop()
   self.animate(self.body,1);return
  if self.role:
   signal=lambda:self.body['q']['signal']
   if self.state==16:
    victim=self.w.bodies[self.tuples[self.tuple_read][0]];flags=self.tuples[self.tuple_read][1]&0xffffffff
    if not flags&8:self.aim(victim.position,False)
    if flags&0x20000000 and self.distance(victim.position)<70 and signal()==0:
     self.body['deleted']=True;self.state=17
     if self.variant==3:
      point=self.position[:];speed=self.speed;self.speed=20;self.move();n=self.w.impact_node(self.body,0x1af85);n['position']=[int(self.position[0]),int(self.position[1])-90];self.position=point;self.speed=speed
     else:
      n=self.w.impact_node(self.body,0x1af85 if self.variant==1 else 0x1af89);n['position'][1]-=103 if self.variant==1 else 68
     self.w.impact_node(victim.body,0x1af8a)
     if victim.state!=0:victim.pop();victim.reaction_count=victim.skill=0
     victim.pop();return
    if self.distance(victim.position)<20 and signal()==0:self.w.result(self,False);self.body['q']['signal']=1
    if self.cooldown>0:
     self.cooldown-=1
     if self.resource==0x1adc0:self.animate(self.body,0)
    if self.cooldown==0:
     self.animate(self.body,0);self.move()
     if signal()==1:
      if not self.tuples[self.tuple_read][1]&0x108:self.body['deleted']=True
      self.state=17
   elif self.state==17:
    self.move()
    if not(-200<=self.position[0]<=840 and-200<=self.position[1]<=680):self.body['deleted']=True
   elif self.state==20:
    steer(self,self.waypoint,10);self.angle=normalize(self.angle)
    if self.distance(self.waypoint)<20:self.state=21
    self.move();self.animate(self.body,0)
   elif self.state==21:
    if signal()==0:
     victim=self.w.bodies[self.tuples[self.tuple_read][0]]
     if self.heading==0:self.heading=int(difference(skill.old.angle(f(victim.position[0]-self.position[0]),f(victim.position[1]-self.position[1])),self.angle))
     if self.distance(victim.position)<60:self.turn=f(self.turn+.3);steer(self,victim.position,self.turn)
     steer(self,victim.position,self.turn);self.angle=normalize(self.angle)
     if self.parent.state!=15:self.parent.aim(self.position)
     if signal()==0 and self.distance(victim.position)<20:
      self.turn=10;self.w.result(self,True);self.tuple_read+=1
      if self.tuples[self.tuple_read][0]==-1:self.body['q']['signal']=1
    if self.cooldown>0:self.cooldown-=1
    if self.cooldown==0:
     self.animate(self.body,0);self.move()
     if signal()==1:self.state=22
   elif self.state==22:
    d=difference(skill.old.angle(f(self.parent.position[0]-self.position[0]),f(self.parent.position[1]-self.position[1])),self.angle);df=f(d);zero=False
    if self.heading==0:self.heading=int(d);zero=self.heading==0
    if zero or self.heading<0:self.angle=f(self.angle+(df if-self.turn<=df<=f(self.turn*.2)else-self.turn))
    else:self.angle=f(self.angle+(self.turn if d>self.turn or df<f(self.turn*-.2)else df))
    self.angle=normalize(self.angle)
    if self.distance(self.parent.position)<100:self.turn=f(self.turn+.3)
    if self.distance(self.parent.position)<60:
     self.turn=180
     if self.parent.state==15:self.parent.pop()
     if self.parent.state!=23:self.parent.action=12;self.parent.animate(self.parent.body,0);self.parent.pop()
     if self.distance(self.parent.position)<20:self.body['deleted']=True
    self.move();self.animate(self.body,0)
   else:raise ValueError(('unexpected anonymous state',self.state))
   return
  if self.state in[15,18]:self.emit(self.state);return
  if self.state==41:
   if self.flight:self.aim(self.flight.position)
   self.percent=100;self.action=0;self.animate(self.body,0);return
  if self.state==23:
   self.wait+=1
   if self.wait>=21:self.wait=0;self.pop()
   return
  return super().body_step()

class World(prior.World):
 def __init__(self,animations,records,c):
  self.animations,self.records=animations,records;self.nodes=[];self.next_id=1;self.random=skill.old.Random(12345);self.phase=self.passes=0;self.slow=False;self.events=[];self.bodies={};self.local=c['local'];self.alt=False;self.offset=c.get('offset',[0,0])[:];self.overlay_counter=self.overlay_direction=0;self.submissions=[];self.shake=self.amplitude=self.limit=0;self.case=c;self.field=None;self.used=False;self.phase2=False;self.stopped=False
  self.manager=SimpleNamespace(slot=None,body=None,links={},screen=lambda n:None);self.character_flags(c.get('C_flags',0))
  for slot in sorted({s for h in c['hits']for s in h[:2]}|{c.get('caster',c['hits'][0][0])}):
   b=Body(self,slot,c.get('resource',100090));self.bodies[slot]=b;b.after_image_enabled=b.after_image_counter=0;b.raw=c.get('flags',{}).get(str(slot),0)
   if b.raw&0x1000:b.scale=[f(1.3),f(1.3)]
   if b.raw&0x3f0:self.condition(b,0x1adfb+(b.raw&0x3f0).bit_length()-5)
   if b.raw&0x800:self.toggle(b,True)
  self.plan=queues(c)
  for row in self.plan['rows']:
   b=self.bodies[row['slot']];b.actions=row['actions']+[-1]if row['actions']else[0,-1];b.read=0;b.write=len(row['actions'])-1;b.busy=int(bool(row['actions']));b.tuples=copy.deepcopy(row['tuples'])+[[-1,0,0,0]]+[[0,0,0,0]for _ in range(199-len(row['tuples']))];b.tuple_read=0
   for key,value in row['assignments'].items():
    if key!='physicalFamily':setattr(b,{'classCode':'category','skillLevel':'level','mpCost':'cost','physicalVariant':'variant','afterImageEnabled':'after_image_enabled'}[key],copy.deepcopy(value))
  b=self.bodies[self.plan['principal']];b.state=b.actions[0]
 def anonymous(self,parent,role,flags,priority):
  b=Body(self,0,100090);b.role=role;b.actor_flags=flags;b.saved=b.flags=0;b.resource=0;b.face=b.category=b.level=b.cost=b.variant=0;b.vitals=None;b.position=parent.position[:];b.speed=10;b.turn=10 if role=='multi'else 0;b.heading=0;b.waypoint=[0,0];b.body.update(drawPriority=priority);b.body['q']=anime.initial();return b
 def copy_record(self,source,destination):
  start=source.tuple_read;count=4 if source.tuples[start][1]&0x800000 else 1
  if not hasattr(destination,'written'):destination.written=0;destination.tuples=[[0,0,0,0]for _ in range(200)]
  for j in range(count):destination.tuples[destination.written]=source.tuples[start+j][:];destination.written+=1
  destination.tuples[destination.written]=[-1,0,0,0];source.tuple_read+=count-1
 def arrow(self,parent,origin,destination,resource):
  angle=skill.old.angle(f(int(destination[0])-origin[0]),f(int(destination[1])-origin[1]));n=self.node(parent,'physical-arrow',resource=resource,flags=0x40000,position=origin,parent=parent.body,screenSpace=True,percent=10,angle=angle,speed=10,mask=4 if resource==0x1adc0 else 0,maskValue=4 if resource==0x1adc0 else 0)
  n['drawPriority']=parent.body['drawPriority'];n['screen']=[0,0];self.animate(n,0)
  if resource==0x1adc0:
   for _ in range(2):n['position']=[f(skill.old.sine(f(angle+90))*10+n['position'][0]),f(skill.old.sine(angle)*10+n['position'][1])]
  parent.screen(n);return n
 def single(self,parent,base):
  victim=self.bodies[parent.tuples[parent.tuple_read][0]];b=self.anonymous(parent,'single',0x60000,203);b.percent=10;b.aim(victim.position);q=parent.body['q'];b.speed=f(q['geometry']['width']*.5);b.move();b.speed=10
  part=int((b.angle+11.25)*(2/45));part=part+16 if part<0 else part;part=part-16 if part>=16 else part;b.resource=base+16+part
  self.copy_record(parent,b);b.state=16;b.body['screen']=[0,0];b.animate(b.body,0);b.category,b.variant,b.level,b.slot=parent.category,parent.variant,parent.level,parent.slot
  end=victim.body['q'];self.arrow(b,[b.position[0],f(q['geometry']['height']*.5+q['drawOffsetY']+b.position[1])],[victim.position[0],f(end['geometry']['height']*.5+end['drawOffsetY']+victim.position[1])],b.resource-16);b.body['screen']=[int(p)for p in b.position];return b
 def multiple(self,parent):
  b=self.anonymous(parent,'multi',0x40000,205);b.parent=parent;b.body['parent']=parent.body;b.slot=parent.slot;b.percent=100;b.resource=0x19258;b.face=0;b.body['screen']=[int(p)for p in b.position]
  while True:
   self.copy_record(parent,b);parent.tuple_read+=1
   if parent.tuples[parent.tuple_read][0]==-1:break
  first=self.bodies[b.tuples[0][0]];second=self.bodies[b.tuples[1][0]].position if b.written>1 else None;b.waypoint=approach(b.position,b.body['screen'],first.position,first.body['screen'],second);steer(b,b.waypoint);b.state=20
  width=parent.body['q']['geometry']['width']*.5
  for _ in range(65536):
   b.body_step();b.screen(b.body)
   if b.state!=20 or b.distance(parent.position)>=width:break
  else:raise ValueError('initialization budget')
  b.animate(b.body,0);b.category,b.variant,b.level=parent.category,parent.variant,parent.level;return b
 def impact_node(self,n,res,face=0):
  q=n['q'];g=q['geometry'];x=self.random.range(0,int(g['width']/2))+n['screen'][0]-int(g['width']/4);y=int(q['drawOffsetY']/4)+n['screen'][1]-self.random.range(0,int(q['drawOffsetY']/3))
  return self.node(n['owner'],'impact',resource=res,flags=0x50000,position=[x,y],screenSpace=True,face=face)
 def result(self,b,multi):
  victim=self.bodies[b.tuples[b.tuple_read][0]];flags=b.tuples[b.tuple_read][1]&0xffffffff;primary={0:0x1ae35,1:0x1ae36,3:0x1ae37,5:0x1ae3b,6:0x1ae39,81:0x1ae5e,84:0x1ae5f,85:0x1ae4f,87:0x1ae50}.get(b.category);extra=-1;face=0
  if flags&4:primary=110000
  elif not multi and flags&0x800:primary=0x1ae13
  elif flags&0x400:primary=0x1ae12
  elif 75<=b.category<=80 or not multi and b.category==110:primary=0x1adfa
  elif b.category==257 or multi and b.category==266:primary=0x1adbe if b.level==9 else-1;extra=0x1af8c
  elif b.category==258:primary=-1;extra=0x1af8d
  elif b.category==259:primary=0x1adb1+self.random.range(0,2);extra=0x1af86
  elif b.category in[260,262]or not multi and b.category==266:primary=0x1af89;face=int(b.category==266)
  elif primary is None:primary=0x1adb1+self.random.range(0,2)
  victim.aim(b.position);victim.attacker=self.bodies[b.slot];victim.reaction_flags=flags;b.metadata();_,flags,value,_=b.tuples[b.tuple_read];flags&=0xffffffff
  effect,skip,heal,mana=(0xe000,0x8000,0x4000,0x2000)if multi else(0x7e000,0x48000,0x24000,0x12000)
  def release95():
   if victim.state!=0:victim.pop();victim.reaction_count=victim.skill=0
   victim.pop()
  if not flags&0x108:
   if not flags&effect and value!=0:
    if flags&2:self.impact_node(victim.body,0x1adb8)
    if primary>=0:self.impact_node(victim.body,primary,face)
    if extra>=0:self.impact_node(victim.body,extra)
    victim.vital(0,value)
    if flags&0x20:victim.flags|=2;victim.aux=1;self.slow=True
   if not flags&skip:
    healing=bool(flags&heal);magical=not healing and bool(flags&mana)
    if not healing and not magical and flags&0x100000:victim.remove_link('status');victim.flags&=~0x20
    if not multi and b.category==95:
     if not healing and not magical:victim.flip();victim.speed=8;victim.move();victim.flip()
     release95()
    else:
     if not multi and b.category==110 and flags&0x80000:self.condition(victim,0x1adfb)
     victim.pop()
    if healing:victim.vitals[0]=min(victim.vitals[1],signed(victim.vitals[0]+value))
    if not magical:
     if flags&0x10000000:self.message(victim,0x57bb)
     else:
      self.number_style(victim,value,5 if healing else 6)
      if flags&2:self.message(victim,0x57b6)
   elif not multi and b.category==95:release95()
   else:
    if not multi and b.category==110 and flags&0x80000:self.condition(victim,0x1adfb)
    victim.pop()
   if b.category==259 and flags&0x80000:self.condition(victim,0x1adfb)
  elif not multi and b.category==95:release95()
  else:
   if not flags&8 and flags&0x100:victim.after_image_enabled=1
   victim.state=29
  if not flags&8 and value!=0:b.cooldown=((((victim.flags>>1)&1)+1)*14)>>(2 if multi else 0)
 def step_effect(self,n):
  if n['kind']=='physical-arrow':
   if n['parent']['owner'].cooldown==0:n['position']=[f(skill.old.sine(f(n['angle']+90))*10+n['position'][0]),f(skill.old.sine(n['angle'])*10+n['position'][1])]
   if n['parent']['deleted']:n['deleted']=True
   n['drawPriority']=n['parent']['drawPriority'];self.animate(n,0);return
  return super().step_effect(n)
 def project_casting(self):
  p=super().project_casting()
  for row,n in zip(p['nodes'],self.nodes):
   b=n['owner']
   if n['kind']=='body'and b.role:row['physical']=dict(role=b.role,principal=b.slot,classCode=b.category,variant=b.variant,level=b.level,angle=b.angle,speed=b.speed,cooldown=b.cooldown,tupleRead=b.tuple_read,tupleWrite=b.written,tuples=[x for t in b.tuples for x in t],turnRate=b.turn,headingSign=b.heading,waypoint=b.waypoint[:])
  return p

def write_fixtures():
 _,records,files=fixtures();out=dict(schema='moli.physical-projectile-fixture-only-stage206.v1',files=files,geometry=records)
 (P/'fixture-only.json').write_text(json.dumps(out,separators=(',',':'))+'\n');print(json.dumps(dict(files=len(files),geometry=len(records),fixture_only=True)))

CLASSES=[0,1,3,5,6,73,75,76,77,78,79,80,81,84,85,87,94,95,96,105,110,257,259,260,262,266]
def case(name,category=0,variant=1,level=0,caster=0,hits=None,**extra):
 return dict(dict(name=name,category=category,variant=variant,level=level,caster=caster,cost=3,local=0,resource=100090,hits=hits if hits is not None else[[caster,10 if caster<10 else 0,1,12],[caster,11 if caster<10 else 1,3,7]]),**extra)
def main(quick=False):
 animations,records,files=fixtures();cases=[];queue_vectors=[]
 for category in([0,6,73,84,95,105,110,257,259,266]if quick else CLASSES):
  for level in([0]if quick else range(10)):
   if level==9 and category in[259,266]:continue
   for variant in[1,2,3]:cases.append(case('class%d-level%d-variant%d'%(category,level,variant),category,variant,level))
 for variant in[1,2,3]:cases.append(case('self73-variant'+str(variant),73,variant,hits=[[0,0,1,12]]))
 if not quick:
  for variant in[1,2,3]:
   for name,category,flags,value in [('zero',0,0,0),('zero-message',0,0x10000000,0),('heal-mask',0,0x20001,40),('mana-mask',0,0x10001,12),('skip-mask',0,0x40001,12),('negative',6,1,-7),('minimum',0,1,-2147483648),('critical',0,3,12),('KO',0,0x21,90),('zero-KO',0,0x20,0),('dodge',0,8,12),('guard',0,0x100,12),('both-immune',0,0x108,12),('deflect',0,0x20000001,12),('condition110',110,0x80001,12),('condition259',259,0x80001,12),('clear-status',0,0x100001,12),('RID',0,0x800001,9)]:
    hit=[0,10,flags,value]+([[100040,100041,100050]]if flags&0x800000 else[])
    cases.append(case(name+'-variant'+str(variant),category,variant,hits=[hit],**({'flags':{'10':32}}if name=='clear-status'else{})))
   cases.extend([case('fallback-variant'+str(variant),variant=variant,resource=100091),case('repeat-variant'+str(variant),variant=variant,hits=[[0,10,1,7],[0,10,3,9]]),case('RID-followup-variant'+str(variant),variant=variant,hits=[[0,10,0x800001,9,[100040,100041,100050]],[0,11,1,8]]),case('offset-variant'+str(variant),variant=variant,offset=[11,-7])])
   for flags in[0,8,0x100,0x108,0x21,0x20001,0x20000001]:cases.append(case('class95-flags%x-variant%d'%(flags,variant),95,variant,hits=[[0,10,flags,12]]))
   cases.append(case('related73-deflect-variant'+str(variant),73,variant,hits=[[0,10,0x20000001,12]]))
   for caster in[1,10,20,21]:cases.append(case('slot%d-variant%d'%(caster,variant),variant=variant,caster=caster))
  for category in CLASSES:
   for level in range(10):
    if category in[259,266]and level==9:continue
    for variant in[1,2,3]:
     for caster,target in[(0,10),(1,10),(10,0),(20,0),(21,10)]:
      for flags in[0,1,3,8,0x20,0x21,0x40,0x41,0x100,0x108,0x400,0x80000,0x100000,0x800000,0x20000000,0x10000000]:
       hit=[caster,target,flags,12]+([[100040,100041,100050]]if flags&0x800000 else[]);c=case('queue',category,variant,level,caster,[hit]);queue_vectors.append(dict(input=[category,level,variant,caster,target,flags],expected_digest=digest(queues(c)['rows'])))
 traces=[]
 for c in cases:
  w=World(animations,records,c);states=[];rasters=[];old_vitals=None
  for i in range(3000):
   frame=w.step();states.append(digest(frame));values=[b.vitals[:]for b in w.bodies.values()]
   if i<4 or i%47==0 or values!=old_vitals:
    for selector in[0,1]:rasters.append(dict(frame=i+1,selector=selector,**prior.prior.render_reference(w,selector)))
   old_vitals=copy.deepcopy(values)
   if w.stopped:break
   if all(b.detached or not b.busy for b in w.bodies.values())and not any(n['kind']=='physical-arrow'or n['kind']=='body'and n['owner'].role for n in w.nodes)and all(n['kind']in['body','status','rider','attachment','status-skill-overlay','status-skill-field','moving-numeric-afterimage']for n in w.nodes):break
  traces.append(dict(case=c,states=states,rasters=rasters,stopped=w.stopped,bodySettled=all(b.detached or not b.busy for b in w.bodies.values()),final=frame));print(c['name'],len(states),flush=True)
 out=dict(schema='moli.physical-projectile-reference-stage206.v1',authority='Independent original-source equations and authored synthetic archives;no product imports or original execution',files=files,geometry=records,queues=queue_vectors,traces=traces,frames=sum(len(t['states'])for t in traces),rgbaFrames=sum(len(t['rasters'])for t in traces))
 destination=P/'quick-vectors.json'if quick else A/'original-vectors.json';destination.write_text(json.dumps(out,separators=(',',':'))+'\n');print(json.dumps(dict(path=str(destination.relative_to(R)),queues=len(queue_vectors),scenarios=len(traces),frames=out['frames'],RGBA=out['rgbaFrames'])),flush=True)

if __name__=='__main__':
 if '--fixtures-only'in sys.argv:write_fixtures()
 else:main('--quick'in sys.argv)
