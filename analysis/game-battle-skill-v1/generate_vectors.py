#!/usr/bin/env python3
"""Original synthetic resources and independent source queue/callback reference. No product imports."""
from pathlib import Path
import importlib.util,json,struct,math,copy
A=Path(__file__).resolve().parent
def module(name,path):
 s=importlib.util.spec_from_file_location(name,path);m=importlib.util.module_from_spec(s);s.loader.exec_module(m);return m
old=module('skill_body_reference',A.parent/'game-battle-body-v1/generate_vectors.py');anime=old.anime;f=old.f;layout=old.layout
KO=[48,44,34,18,0,-18,-34,-44,-48,-44,-34,-18,0,18,34,44,0,14,26,44,47,33,26,14,0,-14,-26,-44,-47,-33,-26,-14]
scene=module('skill_frame_reference',A.parent/'game-battle-scene-v1/generate_vectors.py')
def fixtures():
 files,_,_,_,_=old.fixtures();info=bytearray(files['Bin/GraphicInfo.bin']);pixels=bytearray(files['Bin/Graphic.bin']);index=bytearray(files['Bin/AnimeInfo.bin']);data=bytearray(files['Bin/Anime.bin'])
 for i,resource in enumerate([0x573b,0x57bb,0x57b6,*[243760-48+ord(c)for c in '-0123456789']]):
  w,h=8+4*(i%2),7;raw_pixels=bytes(0 if(j+i)%5==0 else 17+(j+i)%3 for j in range(w*h));raw=b'RD\0\0'+struct.pack('<iiI',w,h,16+len(raw_pixels))+raw_pixels;row=bytearray(40);struct.pack_into('<IIIiiii',row,0,3000+i,len(pixels),len(raw),-2,-3,w,h);struct.pack_into('<I',row,36,resource);info.extend(row);pixels.extend(raw)
 def add(resource,blocks):index.extend(struct.pack('<IIHH',resource,len(data),len(blocks),0));data.extend(b''.join(blocks))
 for resource,signals in [(100020,[0,10001,0]),(100021,[20001,10001,0])]:
  add(resource,[anime.action(direction,action,96,[(graphic,-1,1,signals[j]if action==5 else 0)for j,graphic in enumerate([1002,1004,1005])])for direction in range(8)for action in range(20)])
 for resource in [*range(0x1ae14,0x1ae18),0x1ae35,0x1ae36,0x1ae37,0x1adb8,110000,*range(0x1adb1,0x1adb5)]:add(resource,[anime.action(0,0,96,[(1002,0,0,0),(1004,1,-1,0),(1005,0,0,0)])])
 files.update({'Bin/GraphicInfo.bin':bytes(info),'Bin/Graphic.bin':bytes(pixels),'Bin/AnimeInfo.bin':bytes(index),'Bin/Anime.bin':bytes(data)})
 records=[]
 for at in range(0,len(info),40):
  n=struct.unpack_from('<i',info,at)[0];x,y,w,h=struct.unpack_from('<iiii',info,at+12);resource=struct.unpack_from('<I',info,at+36)[0];records.append(dict(index=n,originX=x,originY=y,width=w,height=h,resourceId=resource))
 def geo(kind,value):return{k:r[k]for k in ['index','originX','originY','width','height']for r in [next(r for r in records if r['index'if kind=='index'else'resourceId']==value)]}
 anime.geo=geo;groups=[dict(index=files['Bin/AnimeInfo.bin'],animation=files['Bin/Anime.bin'],graphicBase=0)]
 for at in range(0,len(info),40):
  n,offset,size,ox,oy,w,h=struct.unpack_from('<IIIiiii',info,at);resource=struct.unpack_from('<I',info,at+36)[0];raw=files['Bin/Graphic.bin'][offset:offset+size];head=20 if raw[2]==2 else 16;scene.IMAGES[n]=dict(index=n,resource=resource,origin=[ox,oy],width=w,height=h,pixels=raw[head:head+w*h],embedded=raw[head+w*h:]if raw[2]==2 else None)
 return anime.parse(groups),records,[dict(path=p,bytesHex=files[p].hex())for p in ['Bin/GraphicInfo.bin','Bin/Graphic.bin','Bin/AnimeInfo.bin','Bin/Anime.bin']],groups

def render_reference(w):
 nodes=w.project()['nodes'];depth=scene.pointer_sort([dict(id=n['id'],y=n['screen'][1],alternateY=0,flags=n['actorFlags'],depthKey=0)for n in nodes if n['actorFlags']&0x20000]);priorities={n:(i+9)&255 for i,n in enumerate(depth)};commands=[];skipped=[]
 for n in nodes:
  flags=n['actorFlags'];q=n['animation'];reason='renderer-filter'if flags&0x8000 else'graphic-missing'if q['graphicIndex']==-1 else'deleted'if n['deleted']else'hidden'if flags&2 else None
  if reason:skipped.append(dict(id=n['id'],reason=reason));continue
  commands.append(dict(id=n['id'],kind=n['kind'],index=q['graphicIndex'],flags=0 if n['kind']in ['body','moving-numeric-afterimage']else 4,x=n['screen'][0]+q['drawOffsetX'],y=n['screen'][1]+q['drawOffsetY'],priority=priorities.get(n['id'],n['drawPriority'])))
 bg=next(g for g in scene.IMAGES.values()if g['resource']==1000);commands.append(dict(id=None,kind='background',index=bg['index'],flags=0,x=320+bg['origin'][0],y=240+bg['origin'][1],priority=0))
 return dict(depthOrder=depth,commands=commands,skipped=skipped,rgbaSha256=scene.raster(commands),drawOrder=[commands[i]['id']for i in sorted(range(len(commands)),key=lambda i:(commands[i]['priority'],-i))])

def queues(hits):
 rows={};principal=hits[0][0]
 def row(s):return rows.setdefault(s,dict(slot=s,actions=[],tuples=[]))
 def action(s,*v):row(s)['actions'].extend(v)
 action(principal,38,147,53)
 for i,(actor,target,flags,amount)in enumerate(hits):
  action(actor,24,*([7,9,10]if i==0 or actor!=principal else[3]),242,14);row(actor)['tuples'].append([target,flags,amount,0]);action(target,0)
  if not flags&0x108 and amount and flags&3:action(target,160 if flags&2 else 26)
  if amount or flags&0x108:
   if target!=principal:action(target,11)
   if flags&0x100:action(target,74)
  if flags&0x20 and target!=principal:action(target,44)
 if any(t==principal and flags&0x20 for _,t,flags,_ in hits):action(principal,11,44)
 elif principal<20:action(principal,7,11,10)
 return list(rows.values())

class World:
 def __init__(self,animations,records,resource,hits,category=0,level=0,cost=3,slow=False):
  self.animations=animations;self.records=records;self.nodes=[];self.next_id=1;self.random=old.Random(12345);self.phase=0;self.passes=0;self.bodies={};self.slow=slow;self.events=[]
  for slot in sorted({s for h in hits for s in h[:2]}):self.bodies[slot]=Body(self,slot,resource)
  self.rows=queues(hits)
  for r in self.rows:
   b=self.bodies[r['slot']];b.actions=r['actions']+[-1];b.read=0;b.write=len(r['actions'])-1;b.busy=1;b.tuples=r['tuples']+[[ -1,0,0,0]];b.tuple_read=0
  first=self.bodies[hits[0][0]];first.state=first.actions[0];first.category=category;first.level=level;first.cost=cost
 def node(self,owner,kind,priority=2,resource=0,flags=0,position=None,parent=None,**extra):
  n=dict(id=self.next_id,kind=kind,priority=priority,drawPriority=9 if kind=='body'else 204,resource=resource,flags=flags,position=list(owner.position)if position is None else position[:],screen=[0,0],state=0,counter=0,height=0.,deleted=False,q=anime.initial(),owner=owner,parent=parent,**extra);self.next_id+=1
  i=0
  while i<len(self.nodes)and(self.nodes[i]['priority']<priority or self.nodes[i]['priority']==priority and self.nodes[i]['id']<n['id']):i+=1
  self.nodes.insert(i,n);owner.screen(n);return n
 def impact(self,b,resource):
  g=b.body['q']['geometry'];p=b.body['screen'];x=self.random.range(0,int(g['width']/2))+p[0]-int(g['width']/4);y=int(b.body['q']['drawOffsetY']/4)+p[1]-self.random.range(0,int(b.body['q']['drawOffsetY']/3));self.node(b,'impact',resource=resource,flags=0x50000,position=[x,y],screenSpace=True)
 def number(self,b,value):
  text=str(value);middle=int(len(text)*9/2)
  for i,ch in enumerate(text):
   g=next(r for r in self.records if r['resourceId']==243760-48+ord(ch));n=self.node(b,'damage-digit',flags=0x40002,position=[g['originX']+b.body['screen'][0]-middle+11*i,g['originY']+b.body['screen'][1]-80],screenSpace=True,delay=2*i);n.update(height=-8.,drawPriority=207);n['q'].update(graphicIndex=g['index'],geometry={k:g[k]for k in ['index','originX','originY','width','height']})
 def message(self,b,resource):
  n=self.node(b,'message',resource=resource,flags=0x40000,position=b.body['screen'],screenSpace=True);n['height']=-8.;b.animate(n,1)
 def after_image(self,b,old_screen):
  n=self.node(b,'moving-numeric-afterimage',resource=b.resource,flags=b.actor_flags|0x8000,position=b.position[:],manual=True,mask=getattr(b,'mask',0),maskValue=getattr(b,'mask_value',0))
  n.update(q=copy.deepcopy(b.body['q']),screen=old_screen[:],priority=b.body['priority'],drawPriority=b.body['drawPriority'],height=b.body['height'],state=b.state,counter=0,deleted=b.body['deleted'],scale=b.scale[:])
 def after_body(self,b,old_screen):
  if b.after_image_enabled==1:
   b.after_image_counter=(b.after_image_counter+1)%2
   if b.after_image_counter==1:self.after_image(b,old_screen)
 def step_effect(self,n):
  b=n['owner'];kind=n['kind']
  if kind=='moving-numeric-afterimage':n['counter']+=1;n['deleted']|=n['counter']>11
  elif kind in ['impact','puff']:n['deleted']=b.animate(n,1)==1
  elif kind=='charge':
   if b.animate(n,1)==1:
    if not n['parent']['deleted']and b.skill: b.skill=2
    n['deleted']=True
  elif kind=='damage-digit':
   if n['state']==0:
    if n['delay']>0:n['delay']-=1
    else:
     height=n['height']+f(.8);n['height']=f(height);n['flags']&=~2
     if height>=f(7.2):n['state']=1
     n['position'][1]+=int(height)
   else:n['counter']+=1;n['deleted']=n['counter']>49
  elif kind=='message':
   if n['state']==0:
    height=n['height']+f(.8);n['height']=f(height);n['position'][1]=f(n['position'][1]+height)
    if height>=f(7.2):n['state']=1
   else:n['counter']+=1;n['deleted']=n['counter']>59
  elif kind=='knockout':
   if n['parent']['deleted']:n['deleted']=True;return
   previous=n['state'];n['state']+=1
   if previous<50:
    if n['state']==40:b.actor_flags|=2
    i=self.random.range(0,15);flags=0x48000 if self.random.range(0,1)else 0x50000
    self.node(b,'knockout-particle',resource=0x1adb4,flags=flags,position=[f(n['position'][0]+KO[i]),f(n['position'][1]+KO[i+16])],screenSpace=True,parent=n,targetY=n['position'][1]-100+KO[i+16],verticalSpeed=0.,acceleration=f(.2))
   if n['completed']>=50:
    if b.skill:b.skill=2
    n['deleted']=True
  elif kind=='knockout-particle':
   if n['parent']['deleted']:n['deleted']=True;return
   n['verticalSpeed']=f(n['verticalSpeed']-n['acceleration']);n['position'][1]=f(n['position'][1]+n['verticalSpeed'])
   if n['position'][1]<n['targetY']:n['parent']['completed']+=1;n['deleted']=True
   b.animate(n,0)
  else:raise AssertionError(kind)
 def step(self):
  i=0;self.events=[]
  while i<len(self.nodes):
   n=self.nodes[i];b=n['owner'];flags=b.actor_flags if n['kind']=='body'else n['flags']
   if flags&0x40000 and self.slow and self.phase:i+=1;continue
   if n['deleted']:self.nodes.pop(i);continue
   if n['kind']=='body':previous=n['screen'][:];b.body_step();self.after_body(b,previous)
   else:self.step_effect(n)
   b.screen(n);i=self.nodes.index(n)+1
  self.phase=(self.phase+1)%4;self.passes+=1
  return self.project()
 def project(self):
  fields=['graphicIndex','drawOffsetX','drawOffsetY','nextFrame','delay','signal','lastAction']
  return dict(phase=self.phase,seed=self.random.seed,bodies=[b.project()for b in self.bodies.values()if not b.detached],nodes=[dict(id=n['id'],kind=n['kind'],parentId=n['parent']['id']if n['parent']else None,deleted=n['deleted'],priority=n['priority'],drawPriority=n['drawPriority'],position=(n['owner'].position[:]if n['kind']=='body'else n['position'][:]),screen=n['screen'][:],state=n['owner'].state if n['kind']=='body'else n['state'],counter=n['counter'],height=n['height'],actorFlags=n['owner'].actor_flags if n['kind']=='body'else n['flags'],animation={k:n['q'][k]for k in fields})for n in self.nodes])

class Body(old.BodyReference):
 def __init__(self,w,slot,resource):
  self.w=w;self.animations=w.animations;self.slot=slot;self.position=list(layout[slot]['target']);self.flags=1;self.saved=0;self.actor_flags=0x60054;self.angle=0.;self.face=1;self.action=0;self.resource=resource;self.speed=1.;self.percent=100;self.scale=[1.,1.];self.counter=self.escape=0;self.state=self.busy=0;self.read=0;self.write=-1;self.actions=[0,-1];self.detached=False;self.offset=(0,0);self.alt=False;self.seed=w.random;self.nodes=w.nodes;self.tuples=[[-1,0,0,0]];self.tuple_read=0;self.vitals=[100,100,10,10];self.skill=self.level=self.cost=self.reaction_flags=self.reaction_count=self.cooldown=self.finish=self.timer=0;self.category=-1;self.remember=[0,0];self.aux=0;self.attacker=None
  self.after_image_enabled=self.after_image_counter=0
  self.body=w.node(self,'body',priority=slot*10+2,flags=self.actor_flags);self.body['screen']=list(layout[slot]['entry']);self.reface();self.animate(self.body,0)
 def node(self,kind,priority=2,resource=0,flags=0,position=None):return self.w.node(self,kind,priority,resource,flags,position,parent=self.body if kind=='puff'else None)
 def screen(self,n):
  if not n.get('manual'):n['screen']=[int(v)for v in(self.position if n['kind']=='body'else n['position'])]
 def vital(self,index,amount):self.vitals[index]=max(0,((self.vitals[index]-amount+2**31)%2**32)-2**31)
 def flip(self):
  self.angle=f(self.angle+180)
  if self.angle>=360:self.angle=f(self.angle-360)
 def reaction_puff(self):
  # Original41f310 allocates at the current body position and makes no RNG call.
  if self.counter==0:self.w.node(self,'puff',resource=0x1adb6,flags=0x160000 if self.alt else 0x68000,position=self.position[:])
  self.counter=(self.counter+1)%3
 def body_step(self):
  s=self.state;t,flags,amount,_=self.tuples[self.tuple_read];other=self.w.bodies.get(t);target=layout[self.slot]['target']
  if s in [0,1,2,38,231]:return super().body_step()
  if s==11:
   if not self.flags&2 or self.flags&12:
    if self.action!=10:self.action=1
   elif self.action!=10:self.state=44;return
   if self.read>0 and self.actions[self.read-1]==7:self.action=3
   self.aim(target,self.action!=10);self.move()
   if self.reached(target):self.position=target[:];self.pop()
   self.animate(self.body,1 if self.action==10 else 0)
  elif s==24:
   if other is None:self.pop()
   elif other is self or other.state==0:other.remember=other.body['screen'][:];self.pop()
   else:
    self.action=0
    if not self.flags&0x60:self.animate(self.body,0)
  elif s in [3,9]:
   self.action=1 if s==3 else 3;self.speed=8.;self.percent=100;home=s==9 and self.read>=2 and self.actions[self.read-2]==14;point=target if home else other.position;self.aim(point)
   if int(math.dist(self.position,point))>=(5 if home else 70):self.move()
   else:self.pop()
   self.animate(self.body,0)
  elif s==7:
   self.action=2;self.percent=100;self.aim(other.position if other else target)
   if self.animate(self.body,1)==1:
    self.pop()
    if self.flags&2:self.percent=200
  elif s==10:
   self.action=4;self.percent=100
   if self.animate(self.body,1)==1:
    if self.read>0 and self.actions[self.read-1]==11 and not self.flags&2:
     registered=self.w.bodies.get(self.slot)
     if registered:registered.reface()
    self.pop()
  elif s==147:
   if not self.flags&0x60:self.animate(self.body,0)
   if self.skill==0:
    g=self.body['q']['geometry'];self.w.node(self,'charge',resource=0x1ae14+[3,3,3,2,2,2,1,1,1,0][self.level],flags=0x40000,position=[self.position[0],f(self.position[1]+int(self.body['q']['drawOffsetY']/2))],parent=self.body);self.skill=1
   self.state=157
  elif s==157:
   if not self.flags&0x60:self.animate(self.body,0)
   if self.skill==2:self.skill=0;self.pop()
  elif s==53:
   self.animate(self.body,1)
   if self.cost>0:self.vital(2,self.cost);self.cost=-1
   self.pop()
  elif s==242:self.remember=[int(v)for v in self.position];self.pop()
  elif s==14:
   self.action=5;self.percent=100;signal=self.body['q']['signal']
   if signal>9999:
    other.category=-1;other.attacker=self;other.reaction_flags=flags;other.aim(self.position)
    if not flags&0x108:
     if amount:
      other.position=other.remember[:]
      if flags&2:self.w.impact(other,0x1adb8)
      self.w.impact(other,110000 if flags&4 else{0:0x1ae35,1:0x1ae36,3:0x1ae37}.get(self.category,0)or self.w.random.range(0,2)+0x1adb1)
     if signal<20000:
      other.pop()
      if amount:
       other.vital(0,amount);self.w.number(other,amount)
       if flags&2:self.w.message(other,0x57b6)
      else:self.w.message(other,0x57bb if flags&0x10000000 else 0x573b)
      if flags&0x20:other.flags|=2;other.aux=1
     elif amount:other.state=25
    elif flags&8:other.state=29
    elif signal>=20000 or other.after_image_enabled==0:other.after_image_enabled=1;other.state=29
    if not flags&8 and amount:self.cooldown=14*((other.flags>>1&1)+1)
    self.body['q']['signal']=0
   if self.cooldown>0:self.cooldown-=1
   if self.cooldown==0:
    if self.finish==0:
     if self.animate(self.body,1)!=1:return
    elif self.finish>10:self.pop();self.tuple_read+=1;self.cooldown=self.finish=0;return
    self.finish+=1
  elif s in [25,26,160]:
   self.action=9 if self.reaction_flags&0xc04 else 8;self.percent=50
   if s==25:self.speed=5.;self.flip();self.move();self.animate(self.body,1);return
   self.reaction_count+=1;n=self.reaction_count;dead=self.flags>>1&1;start=(dead+1)*14;end=dead*14+34
   if n<start:
    self.speed=5.;self.flip()
    if dead:self.aux=1
    self.move();self.animate(self.body,1);return
   if n<end:
    if s==160 or self.reaction_flags&2:self.face=(self.face+1)%8
    if n==start:self.speed=5.;self.counter=0;self.aux=0 if dead else self.aux
    self.reaction_puff();self.speed=max(0.,f(self.speed-f(.3)));self.move();self.animate(self.body,1);return
   if n>=dead*14+54:
    self.reaction_count=0;self.speed=1. if dead else 6.;self.percent=250 if dead else 100;self.pop()
    if not dead and self.state==11:self.speed=4.;self.percent=100
   self.animate(self.body,1)
  elif s==29:
   self.percent=100;self.reaction_count+=1
   if self.reaction_count<14:self.action=1;self.speed=-4.;self.move()
   elif self.reaction_count<28:self.action=0
   elif self.attacker is None or self.attacker.state!=14:self.action=0;self.speed=4.;self.reaction_count=0;self.pop()
   self.animate(self.body,1)
  elif s==73:self.after_image_enabled=1;self.pop()
  elif s==74:self.after_image_enabled=0;self.pop()
  elif s==44:
   self.action=10;self.percent=100
   if self.animate(self.body,1)==1:self.saved|=2;self.state=46
  elif s==46:
   self.counter+=1
   if self.timer>7:
    self.timer=0;self.actor_flags|=0x8000;g=self.body['q']['geometry'];self.w.node(self,'knockout',priority=self.slot*10+1,flags=0x40000,position=[int(g['width']/2)+self.body['q']['drawOffsetX']+self.body['screen'][0],self.body['screen'][1]],parent=self.body,completed=0,screenSpace=True);self.skill=1;self.state=47
   elif self.counter>4:self.counter=0;self.actor_flags^=2;self.timer+=1
  elif s==47:
   if self.skill==2:self.skill=0;self.state=49
  elif s==49:self.detached=True;self.body['deleted']=True
  else:raise AssertionError(s)
 def project(self):return dict(slot=self.slot,state=self.state,busy=self.busy,position=self.position[:],angle=self.angle,facing=self.face,animationAction=self.action,speed=self.speed,speedPercent=self.percent,counter=self.counter,dynamicFlags=self.flags,actorFlags=self.actor_flags,vitals=self.vitals[:],skillStatus=self.skill,mpCost=self.cost,classCode=self.category,rememberedPosition=self.remember[:],reactionCounter=self.reaction_count,attackCooldown=self.cooldown,attackFinishCounter=self.finish,sourceTimer=self.timer,auxFF8=self.aux,tupleRead=self.tuple_read)

def main():
 animations,records,files,groups=fixtures();traces=[]
 cases=[('normal',[[0,10,1,12]],0,0,3,100020,False),('critical',[[0,10,3,17]],1,4,3,100020,False),('dodge',[[0,10,0x100,0]],3,9,3,100020,False),('miss',[[0,10,8,0]],0,0,0,100020,False),('zero',[[0,10,0,0]],0,0,-1,100020,False),('no-damage-message',[[0,10,0x10000000,0]],0,0,3,100020,False),('healing-number',[[0,10,1,-9]],0,0,3,100020,False),('KO',[[0,10,0x21,120]],0,0,3,100020,False),('pre-impact',[[0,10,1,13]],0,0,3,100021,False),('MP-clamp',[[10,0,1,11]],3,6,35,100020,False),('repeat-hit',[[0,10,1,6],[0,10,5,7]],0,0,3,100020,False),('counter',[[0,10,1,6],[10,0,1,7]],0,0,3,100020,False),('quartered-KO',[[0,10,0x23,120]],1,7,2,100020,True)]
 for name,hits,category,level,cost,resource,slow in cases:
  w=World(animations,records,resource,hits,category,level,cost,slow);frames=[];renders=[]
  for _ in range(1800):
   frames.append(w.step());renders.append(render_reference(w))
   if all(b.detached or not b.busy for b in w.bodies.values())and all(n['kind']=='body'for n in w.nodes):break
  assert all(b.detached or not b.busy for b in w.bodies.values()),name
  traces.append(dict(name=name,hits=hits,category=category,level=level,cost=cost,resource=resource,slow=slow,queues=w.rows,frames=frames,renders=renders))
 out=dict(schema='moli.original-battle-skill-vectors-stage190.v1',authority='independent Python source reference; original synthetic bytes only; no product imports or original execution',files=files,geometry=records,animationGroups=[{k:v.hex()if isinstance(v,bytes)else v for k,v in g.items()}for g in groups],traces=traces,frames=sum(len(t['frames'])for t in traces))
 (A/'original-vectors.json').write_text(json.dumps(out,separators=(',',':'))+'\n');print(json.dumps(dict(cases=len(traces),frames=out['frames'],lengths={t['name']:len(t['frames'])for t in traces})))
if __name__=='__main__':main()
