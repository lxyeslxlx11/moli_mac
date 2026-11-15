#!/usr/bin/env python3
# coding: utf-8
"""Independent fixed37c4 casting equations; original synthetic resources, no product imports."""
from pathlib import Path
import importlib.util,struct,json,hashlib,math
A=Path(__file__).resolve().parent
s=importlib.util.spec_from_file_location('casting_prior_reference',A.parent/'game-battle-pet-transition-v1/generate_vectors.py');pet=importlib.util.module_from_spec(s);s.loader.exec_module(pet)
cbc=pet.cbc;skill=pet.skill;anime=pet.anime;f=pet.f;layout=pet.layout
TIERS=[3,3,3,2,2,2,1,1,1,0]
signed=lambda x:((x+2**31)%2**32)-2**31
def movement(x,y,angle,speed):return [f(skill.old.sine(f(angle+90))*speed+x),f(skill.old.sine(angle)*speed+y)]
def digest(value):
 h=hashlib.sha256()
 def walk(v):
  if v is None:h.update(b'n')
  elif isinstance(v,bool):h.update(b't'if v else b'f')
  elif isinstance(v,(int,float)):h.update(b'd'+struct.pack('>d',v or 0))
  elif isinstance(v,str):b=v.encode();h.update(b's'+struct.pack('>I',len(b))+b)
  elif isinstance(v,list):h.update(b'['+struct.pack('>I',len(v)));[walk(x)for x in v]
  elif isinstance(v,dict):h.update(b'{'+struct.pack('>I',len(v)));[(walk(k),walk(v[k]))for k in sorted(v)]
  else:raise TypeError(type(v))
 walk(value);return h.hexdigest()
def resources(code,level):
 group=4 if code==31 else(code-19)%4
 return [0x1ade4+TIERS[level],[0x1add0,0x1adc4,0x1ae3c,0x1addc,0x1adef][group]+TIERS[level]*(3 if group<3 else 1),group]
def queues(case):
 p=case['caster'];kind=case['category'];level=case['level'];rows={};reflected=[];amount_sum=0;reflect=None;last=None;extra_word=0
 def row(slot):return rows.setdefault(slot,dict(slot=slot,actions=[],tuples=[],assignments={}))
 def act(slot,*values):row(slot)['actions'].extend(values)
 def put(slot,target,flags,amount,rid=None,extra=0):
  q=[target,signed(flags),amount,extra];row(slot)['tuples'].append(q)
  if flags&0x800000:row(slot)['tuples'].extend([[target,signed(flags),rid[0],rid[1]],[target,signed(flags),rid[2],0],q[:]])
 def recovery(target,amount):
  act(p,177 if(p==20 and target<10 or p==21 and target>=10)else 115,155);row(p)['assignments'].update(numberValue=int(amount/2),numberStyle=5)
 def drain(target,flags,amount,dead):
  if dead:
   if flags&0xc00:act(target,31)
   act(target,32)
  else:act(target,31 if flags&0xc00 else 30)
  if p!=target:row(target)['tuples'].append([p,signed(flags),amount,0]);act(target,24)
  act(target,71)
  if p!=target:act(target,72)
  act(p,62 if p==target else 0)
  if not(flags&0x20 and p==target):recovery(target,amount)
 act(p,24,53,38,135,62)
 for hit in case['hits']:
  target,flags,amount=hit[:3];rid=hit[3]if len(hit)>3 else None
  if rid:extra_word=rid[0]
  if flags&0x10000:
   reflected.append(target);amount_sum=signed(amount_sum+amount);reflect=(target,flags,amount,rid,extra_word);flags&=0xfc1fffdf
  last=(target,flags,amount,rid);put(p,target,flags,amount,rid,extra_word);act(target,0)
  if not flags&0x108:
   if flags&0x40 and not flags&0x10000:
    if kind==31:drain(target,flags,amount,True)
    else:act(target,32)
    act(target,*([244]if target==case.get('local',0)else[50,49]))
   elif amount and flags&3:
    if flags&0x40000:act(target,124)
    elif flags&0x20000:act(target,123)
    elif flags&0x10000:act(target,122)
    elif not flags&0x20000000:
     if kind==31:drain(target,flags,amount,False)
     else:act(target,160 if flags&2 else 26)
  if(amount or flags&0x108)and not flags&0x20070000 and kind!=31:
   act(target,11)
   if flags&0x100:act(target,74)
  if flags&0x20 and not flags&0x10000:act(target,44)
 row(p)['tuples'].append([-1,0,0,0]);chant,projectile,_=resources(kind,level);row(p)['assignments'].update(classCode=kind,skillLevel=level,mpCost=case.get('cost',3),chantResource=chant,projectileResource=projectile)
 if amount_sum:
  target,old_flags,_,rid,extra=reflect;flags=old_flags&0xfffeffff;end,last_flags,last_amount,_=last
  row(target)['assignments'].update(classCode=kind,skillLevel=level,projectileResource=projectile);act(target,1,137);act(p,0)
  if not flags&8:
   if flags&0x40:act(p,32,*([244]if p==case.get('local',0)else[50,49]))
   elif last_amount:
    if kind==31:
     act(p,31 if last_flags&0xc00 else 30,62)
     if not flags&0x20:recovery(end,last_amount)
    elif flags&3:act(p,160 if last_flags&2 else 26)
  put(target,p,flags,amount_sum,rid,extra);act(target,72)
  if(last_amount or flags&8 or last_flags&0x100)and kind!=31:
   act(p,11)
   if last_flags&0x100:act(end,74)
  if flags&0x20:act(p,44)
 return dict(rows=list(rows.values()),reflectors=reflected,reflectedAmount=amount_sum)
def fixtures():
 _,_,prior=pet.fixtures();files={r['path']:bytes.fromhex(r['bytesHex'])for r in prior};info=bytearray(files['Bin/GraphicInfo.bin']);pixels=bytearray(files['Bin/Graphic.bin']);index=bytearray(files['Bin/AnimeInfo.bin']);data=bytearray(files['Bin/Anime.bin'])
 known_graphics={struct.unpack_from('<I',info,i+36)[0]for i in range(0,len(info),40)}
 for i,resource in enumerate([*range(0x70d1,0x70f1),*range(0x5738,0x573b),*range(0x57b2,0x57bc),*[243750-48+ord(c)for c in '-0123456789']]):
  if resource in known_graphics:continue
  w,h=(12,10)if resource<0x7100 else(7,6);pix=bytes(0 if(j+i)%5==0 else 17+(j+i)%3 for j in range(w*h));raw=b'RD\0\0'+struct.pack('<iiI',w,h,16+len(pix))+pix;row=bytearray(40);struct.pack_into('<IIIiiii',row,0,8000+i,len(pixels),len(raw),-3,-4,w,h);struct.pack_into('<I',row,36,resource);info.extend(row);pixels.extend(raw)
 known={struct.unpack_from('<I',index,i)[0]for i in range(0,len(index),12)}
 def add(resource,blocks):index.extend(struct.pack('<IIHH',resource,len(data),len(blocks),0));data.extend(b''.join(blocks));known.add(resource)
 for resource in [*range(0x1adc4,0x1ae50),0x1af85,0x1af8a,0x1af8b,0x1adb7,*range(0x1af5a,0x1af84)]:
  if resource in known:continue
  signals=[0,10001,0]if 0x1adc4<=resource<=0x1adcf or 0x1ae3c<=resource<=0x1ae47 else[0,0,0]
  if 0x1adc4<=resource<=0x1adc6:signals=[20001,10001,10002]
  add(resource,[anime.action(0,0,96,[(graphic,i-1,-i,signals[i])for i,graphic in enumerate([1002,1004,1005])])])
 # A prolonged original chant exercises both ends of the global triangle counter.
 add(100070,[anime.action(d,a,1280 if a==6 else 96,[(1002,-1,1,10001 if a==6 and i==37 else 0)for i in range(40)]if a==6 else[(1002,-1,1,0),(1004,-1,1,0),(1005,-1,1,0)])for d in range(8)for a in range(20)])
 files.update({'Bin/GraphicInfo.bin':bytes(info),'Bin/Graphic.bin':bytes(pixels),'Bin/AnimeInfo.bin':bytes(index),'Bin/Anime.bin':bytes(data)});records=[]
 for at in range(0,len(info),40):
  n,offset,size,ox,oy,w,h=struct.unpack_from('<IIIiiii',info,at);res=struct.unpack_from('<I',info,at+36)[0];records.append(dict(index=n,resourceId=res,originX=ox,originY=oy,width=w,height=h));raw=files['Bin/Graphic.bin'][offset:offset+size];head=20 if raw[2]==2 else 16;skill.scene.IMAGES[n]=dict(index=n,resource=res,origin=[ox,oy],width=w,height=h,pixels=raw[head:head+w*h],embedded=raw[head+w*h:]if raw[2]==2 else None)
 def geo(kind,value):
  r=next(r for r in records if r['index'if kind=='index'else'resourceId']==value);return{k:r[k]for k in ['index','originX','originY','width','height']}
 anime.geo=geo
 return anime.parse([dict(index=bytes(index),animation=bytes(data),graphicBase=0)]),records,[dict(path=p,bytesHex=b.hex())for p,b in files.items()]
def render_reference(w,selector):
 p=w.project_casting();depth=skill.scene.pointer_sort([dict(id=n['id'],y=n['screen'][1],alternateY=n['alternateY'],flags=n['actorFlags'],depthKey=0)for n in p['nodes']if n['actorFlags']&0x20000]);priorities={n:(i+9)&255 for i,n in enumerate(depth)};commands=[];skipped=[]
 for d in w.submissions:
  g=next(g for g in skill.scene.IMAGES.values()if g['resource']==d['resourceId']);commands.append(dict(id=None,kind='casting-overlay',index=g['index'],flags=0,x=d['x']+g['origin'][0],y=d['y']+g['origin'][1],priority=3))
 for n in p['nodes']:
  q=n['animation'];flags=n['actorFlags'];reason='renderer-filter'if(flags&0x8000 and selector==0 or flags&0x10000 and selector==1)else'graphic-missing'if q['graphicIndex']==-1 else'deleted'if n['deleted']else'hidden'if flags&2 else None
  if reason:skipped.append(dict(id=n['id'],reason=reason));continue
  commands.append(dict(id=n['id'],kind=n['kind'],index=q['graphicIndex'],flags=(q['drawFlags']&~n['drawFlagMask'])|(n['drawFlagValue']&n['drawFlagMask']),x=n['screen'][0]+q['drawOffsetX'],y=n['screen'][1]+q['drawOffsetY'],priority=priorities.get(n['id'],n['drawPriority'])))
 bg=next(g for g in skill.scene.IMAGES.values()if g['resource']==1000);commands.append(dict(id=None,kind='background',index=bg['index'],flags=0,x=320+bg['origin'][0]+w.offset[0],y=240+bg['origin'][1]+w.offset[1],priority=0))
 plan=dict(depthOrder=depth,commands=commands,skipped=skipped,drawOrder=[commands[i]['id']for i in sorted(range(len(commands)),key=lambda i:(commands[i]['priority'],-i))]);return dict(planDigest=digest(plan),rgbaSha256=skill.scene.raster(commands),commands=len(commands))

class Body(pet.Body):
 def __init__(self,w,slot,resource=100060):
  super().__init__(w,slot);self.resource=resource;self.saved=int(slot==w.local or slot==pet.pair(w.local));self.raw=0;self.meta=[0]*4;self.chant=self.projectile=0;self.number_value=self.number_style=0;self.body['q']=anime.initial();self.animate(self.body,0);self.body['screen']=list(layout[slot]['entry']);self.children={};self.tuples=[[-1,0,0,0]]+[[0,0,0,0]for _ in range(199)]
 def animate(self,n,mode):return self.w.animate(n,mode)
 def screen(self,n):
  if n.get('manual')or n['kind']in['rider','attachment']:return
  pos=self.position if n['kind']=='body'else n['position'];offset=[0,0]if n.get('screenSpace')or n['kind']in['message','puff']else self.w.offset;n['screen']=[int(pos[i])+offset[i]for i in range(2)]
 def vital_style(self,style,amount):
  i=2 if style==3 else 0;x=signed(self.vitals[i]+amount if style==5 else self.vitals[i]-amount);self.vitals[i]=min(x,self.vitals[1])if style==5 else max(0,x)
 def body_step(self):
  s=self.state
  if s==135:
   self.action=6
   if not self.skill:self.children['chant']=self.w.charge(self,self.chant,loop=True);self.skill=1
   signal=self.body['q']['signal']
   if 10000<=signal<20000:
    if 'chant'in self.children:
     self.remove_child('chant')
     while self.tuples[self.tuple_read][0]!=-1:self.w.projectile(self);self.tuple_read+=1
     self.tuple_read+=1
    self.body['q']['signal']=0
   if self.animate(self.body,1)==1:
    if 'chant'in self.children:
     self.remove_child('chant');self.tuple_read+=1
     while self.tuples[self.tuple_read][0]!=-1:self.tuple_read+=1
    self.skill=0;self.pop()
   if 'chant'in self.children:self.w.overlay(resources(self.category,self.level)[2])
  elif s==137:self.w.projectile(self);self.pop()
  elif s==62:self.action=0;self.pop()
  elif s in[30,31]:self.action=9 if s==31 else 8;self.percent=100;self.pop()if self.animate(self.body,1)==1 else None
  elif s==71:self.w.bodies[self.tuples[self.tuple_read][0]].pop();self.pop()
  elif s==72:self.tuple_read+=1;self.pop()
  elif s==50:self.pop()
  elif s in[115,122,123,124,177]:
   if not self.flags&0x60:self.animate(self.body,0)
   if not self.skill:
    resource=0x1adf3+TIERS[self.level]if s in[115,177]else{122:0x1ae21,123:0x1ae29,124:0x1ae31}[s];n=self.w.charge(self,resource,0 if s in[115,177]else int(self.body['q']['drawOffsetY']/2));n['flags']|=0x8000;self.skill=1
   self.state=199 if s==177 else 157
  elif s==199:
   if not self.flags&0x60:self.animate(self.body,0)
   self.actor_flags&=~2;self.body['alpha']=min(255,self.body.get('alpha',self.body['q']['color']>>24)+3)
   self.actor_flags=(self.actor_flags|0x8000)if self.body['alpha']<255 else(self.actor_flags&~0x8000)
   if self.skill==2:
    self.body['presentationOffset']=[0,0];self.w.number_style(self,self.number_value,self.number_style);self.vital_style(self.number_style,self.number_value);self.skill=3
   if self.skill==3:self.counter+=1;self.skill+=int(self.counter>59)
   if self.skill==4 and self.body['alpha']==255:self.skill=self.counter=0;self.body.pop('alpha',None);self.body.pop('presentationOffset',None);self.pop()
  elif s in[154,155]:
   if not self.flags&0x60:self.animate(self.body,0)
   self.w.number_style(self,self.number_value,self.number_style);self.vital_style(self.number_style,self.number_value)
   if s==154:self.pop()
   else:self.state=35
  elif s==32:self.death_flight()
  else:
   if s in[26,160]and self.flags&2:
    if self.reaction_count+1<28:self.w.slow=True;self.aux=1
    elif self.reaction_count+1==28 and sum(b.aux==1 for b in self.w.bodies.values())<2:self.w.slow=False
   super().body_step()
 def remove_child(self,key):
  n=self.children.pop(key,None)
  if n:n['deleted']=True
 def death_flight(self):
  self.action=9 if self.reaction_flags&0xc04 else 8;self.percent=100;self.reaction_count+=1;start=((self.flags>>1&1)+1)*14
  if self.reaction_count<start:
   self.speed=5.;self.flip()
   if self.flags&2:self.w.slow=True;self.aux=1
   self.move()
  else:
   if self.reaction_count==start:
    if self.flags&2:
     if sum(b.aux==1 for b in self.w.bodies.values())<2:self.w.slow=False
     self.aux=0;self.saved|=2
    for _ in range(40):
     n=self.w.node(self,'casting-scatter',resource=0x1adb4,flags=0x40000,position=[self.position[0],f(self.position[1]+int(self.body['q']['drawOffsetY']/2))],manual=True,percent=self.w.random.range(10,200),angle=self.w.random.range(0,359),speed=self.w.random.range(5,20),mask=0,maskValue=0);self.w.screen(n)
    self.counter=self.boundary=0;self.speed=15.
   self.move();self.face=(self.face+1)%8;boundary=0;q=self.body['q']
   if self.counter<3:
    half=q['geometry']['width']*.5
    if self.position[0]<half and self.boundary!=1:boundary=1;self.angle=f(180-self.angle)
    elif self.position[0]>640-half and self.boundary!=2:boundary=2;self.angle=f(540-self.angle)
    elif self.position[1]<-q['drawOffsetY']and self.boundary!=3:boundary=3;self.angle=f(360-self.angle)
    elif self.position[1]>480 and self.boundary!=4:boundary=4;self.angle=f(-self.angle)
    if boundary:self.counter+=1
   elif self.position[0]<-200 or self.position[0]>840 or self.position[1]<-200 or self.position[1]>680:self.pop()
   self.boundary=boundary
  while self.animate(self.body,1)==0:pass

class World(pet.World):
 def __init__(self,animations,records,case):
  self.animations,self.records=animations,records;self.nodes=[];self.next_id=1;self.random=skill.old.Random(12345);self.phase=self.passes=0;self.slow=False;self.events=[];self.bodies={};self.local=case.get('local',0);self.alt=False;self.offset=[0,0];self.overlay_counter=self.overlay_direction=0;self.submissions=[];self.shake=self.amplitude=self.limit=0;self.case=case
  for slot in sorted(set([case['caster']]+[h[0]for h in case['hits']])):self.bodies[slot]=Body(self,slot,case.get('resource',100060))
  self.plan=queues(case);self.phase2=True
  for row in self.plan['rows']:
   b=self.bodies[row['slot']];b.actions=row['actions']+[-1];b.read=0;b.write=len(row['actions'])-1;b.busy=1;b.tuples=row['tuples']+[[-1,0,0,0]]+[[0,0,0,0]for _ in range(199-len(row['tuples']))];b.tuple_read=0
   for k,v in row['assignments'].items():setattr(b,{'classCode':'category','skillLevel':'level','mpCost':'cost','chantResource':'chant','projectileResource':'projectile','numberValue':'number_value','numberStyle':'number_style'}[k],v)
  first=self.bodies[case['caster']];first.state=first.actions[0]
 def animate(self,n,mode):
  b=n['owner'];isbody=n['kind']=='body';q,out=anime.step(n['q'],anime.ctx(resourceId=b.resource if isbody else n['resource'],action=b.action if isbody else n.get('action',0),facing=b.face if isbody else n.get('face',0),speedPercent=b.percent if isbody else n.get('percent',100),mode=mode,soundScene=10,actorFlags=b.actor_flags if isbody else n['flags']),self.animations);n['q']=q;return out['code']
 def screen(self,n,shake=False):n['screen']=[int(x)+(self.offset[i]if shake else 0)for i,x in enumerate(n['position'])]
 def charge(self,b,res,offset=0,loop=False):
  n=self.node(b,'casting-chant'if loop else'casting-charge',resource=res,flags=0x40000,position=[b.position[0],f(b.position[1]+offset)],parent=b.body,manual=True);self.screen(n);return n
 def overlay(self,group):
  if self.overlay_direction==0:
   self.overlay_counter+=1
   if self.overlay_counter>15:self.overlay_counter=15;self.overlay_direction=1
  else:
   self.overlay_counter-=1
   if self.overlay_counter<0:self.overlay_counter=0;self.overlay_direction=0
  resource=(0x70e8 if self.overlay_counter%2 else 0x70df)if group==4 else 0x70d1+8*group+self.overlay_counter//2
  self.submissions.extend(dict(resourceId=resource,x=32+64*x,y=24+48*y,priority=3)for x in range(10)for y in range(10))
 def projectile(self,b):
  target,flags,amount,extra=b.tuples[b.tuple_read];flags&=0xffffffff;victim=self.bodies[target];group=resources(b.category,b.level)[2];packed=[b.tuples[b.tuple_read+i][:]for i in range(4 if flags&0x800000 else 1)]
  if flags&0x800000:b.tuple_read+=3
  delay=self.random.range(0,30)if b.tuple_read else 0;n=self.node(b,'casting-projectile',resource=b.projectile,flags=[0x40000,0x60000,0x48000,0x60000,0x48000][group],manual=True,packed=packed+[[-1,0,0,0]],ri=0,delay=delay,cool=0,trail=0,finish=0,guard=0,angle=0.,speed=0.,turn=0.,family=['falling','signal','signal','homing','completion'][group],category=b.category,level=b.level,mask=0 if group==0 else 4,maskValue=0 if group==0 else 4)
  n['drawPriority']=[0,204,201,201,201][group]
  if group<3:n['resource']+=self.random.range(0,2)
  if group==0:n['position']=[f(victim.position[0]+(-100 if target<10 else 100)),f(victim.position[1]-200-int(victim.body['q']['geometry']['height']/2))]
  elif group==1:n['position']=[victim.position[0],f(victim.body['screen'][1]+1)]
  elif group==2:n['position']=[victim.position[0],f(victim.position[1]+int(victim.body['q']['drawOffsetY']/2))]
  elif group==3:
   n['position']=[320,260];n['speed']=self.random.range(4,8);n['angle']=f(skill.old.angle(f(victim.position[0]-320),f(victim.position[1]-260))+self.random.range(-90,90))
  else:n['position']=victim.position[:]
  self.screen(n);return n
 def trail(self,b,position,res,depth,priority):
  n=self.node(b,'casting-trail',resource=res,flags=0x40000|(0x8000 if self.random.range(0,1)else 0x10000)|(0x20000 if depth else 0),position=position,manual=True,percent=200,mask=0,maskValue=0);n['drawPriority']=priority;self.screen(n)
 def number_style(self,b,value,style):
  text=str(value);mid=int(len(text)*9/2)
  for i,ch in enumerate(text):
   g=next(r for r in self.records if r['resourceId']==243700+style*10-48+ord(ch));n=self.node(b,'damage-digit',flags=0x40002,position=[g['originX']+b.body['screen'][0]-mid+11*i,g['originY']+b.body['screen'][1]-80],screenSpace=True,delay=2*i);n['height']=-8.;n['drawPriority']=207;n['q'].update(graphicIndex=g['index'],geometry={k:g[k]for k in ['index','originX','originY','width','height']})
 def message(self,b,res):
  n=self.node(b,'message',resource=res,flags=0x40000,position=b.position,screenSpace=True);n['height']=-8.;self.animate(n,1)
 def result(self,n,preliminary=False):
  target,flags,amount,_=n['packed'][n['ri']];flags&=0xffffffff;b=self.bodies[target];family=n['family'];res=110000 if flags&4 else 0x1ae13 if flags&0x800 else 0x1ae12 if flags&0x400 else 0x1adb1+self.random.range(0,2)
  if family!='homing':b.reface()
  b.attacker=n['owner'];b.reaction_flags=flags
  if not preliminary:
   recipient=n['owner']if flags&0x2000 else b
   if flags&0x200000:self.message(recipient,0x5739)
   if flags&0x400000:self.message(recipient,0x573a)
   if flags&0x800000:
    _,_,rid0,rid1=n['packed'][n['ri']+1];rid2=n['packed'][n['ri']+2][2];n['ri']+=3;self.message(recipient,0x5738);recipient.rider(rid0,rid1);recipient.attachment(rid2)
   if flags&0x1000000:self.message(recipient,0x573a)
   if flags&0x2000000:self.message(recipient,0x5738)
  if flags&8:b.state=29;return
  if preliminary:
   if not flags&0x70000 and amount:
    if flags&2:self.impact(b,0x1adb8)
    self.impact(b,res);b.state=25;n['cool']=((b.flags>>1&1)+1)*14
   return
  if not flags&0x70000 and amount:
   if family=='signal':
    if flags&2:self.impact(b,0x1adb8)
    self.impact(b,res)
   b.vital_style(6,amount)
   if flags&0x20:
    b.flags|=2
    if family!='completion'or flags&0x40:self.slow=True;b.aux=1
  if not flags&0x70000:
   if flags&0x100000:b.remove_child('status');b.flags&=~0x20
   if family=='completion':
    if amount:self.impact(b,res)
   elif family in['falling','homing']:
    if flags&2:self.impact(b,0x1adb8)
    self.impact(b,res)
   if family=='homing':b.aim(n['position'])
   b.pop()
   if family=='signal'and flags&0x20000000:self.impact(b,0x1af8a)
   else:
    self.message(b,0x57bb)if amount==0 and flags&0x10000000 else self.number_style(b,amount,6)
    if flags&2:self.message(b,0x57b6)
  else:
   b.pop()
   if not flags&0x50000:
    b.vital_style(5,amount);self.message(b,0x57bb)if amount==0 and flags&0x10000000 else self.number_style(b,amount,5)
    if flags&2:self.message(b,0x57b6)
  if family=='signal'or amount:n['cool']=((b.flags>>1&1)+1)*14
 def step_effect(self,n):
  family=n['kind'];b=n['owner']
  if family=='casting-chant':
   if n['parent']['deleted']:n['deleted']=True
   self.animate(n,0);self.screen(n)
  elif family=='casting-charge':
   if self.animate(n,1)==1:
    if not n['parent']['deleted']and b.skill:b.skill=2
    n['deleted']=True
   self.screen(n)
  elif family in['casting-trail','casting-scatter']:
   if family=='casting-scatter':n['position']=movement(*n['position'],n['angle'],n['speed'])
   if self.animate(n,1)==1:n['deleted']=True
   self.screen(n)
  elif family=='casting-projectile':self.step_projectile(n)
  else:super().step_effect(n)
 def step_projectile(self,n):
  target,flags,amount,_=n['packed'][n['ri']];flags&=0xffffffff;b=self.bodies[target]
  if n['state']==0 and b.state!=0:return
  n['state']=1;family=n['family']
  if family=='completion':
   if self.animate(n,1)==1:n['deleted']=True;self.result(n);n['q']['signal']=0
   before=n['delay'];n['delay']-=1
   if before<1 and n['cool']>0:n['cool']-=1
   self.screen(n,True);return
  if family=='signal':
   signal=n['q']['signal']
   if signal>=10000:self.result(n,signal>=20000 or n['guard']==1);n['q']['signal']=0
   before=n['delay'];n['delay']-=1
   if before<1:
    n['cool']=max(0,n['cool']-1)
    if n['cool']==0:
     if self.animate(n,1)==1:n['deleted']=0x1ae3b<n['resource']<0x1ae48;n['flags']|=0x8000;n['finish']+=1
     previous=n['finish']
     if previous>0:n['finish']+=1;n['deleted']=n['deleted']or previous>19
   self.screen(n,True);return
  q=b.body['q'];aim_y=b.position[1]+int(q['geometry']['height']/2)+q['drawOffsetY'];distance=math.trunc(math.hypot(b.position[0]-n['position'][0],b.position[1]-n['position'][1]))
  if flags&0x20000000 and n['q']['signal']==0 and(aim_y-50<n['position'][1]if family=='falling'else distance<71):
   n['position']=[f(x+(int(self.offset[i]/2)if family=='falling'else self.offset[i]))for i,x in enumerate(n['position'])];n['deleted']=True
   self.impact_node(n,0x1af85 if family=='falling'else 0x1af8b);self.impact(b,0x1af8a);b.pop()
  if n['q']['signal']==0 and(aim_y<n['position'][1]if family=='falling'else distance<9):self.result(n);n['q']['signal']=1
  before=n['delay'];n['delay']-=1
  if before>0:
   if family=='falling':n['drawPriority']=(b.body['drawPriority']+20)&255
   self.screen(n,True);return
  if family=='falling'and n['delay']==-1:
   for _ in range(self.random.range(0,32)):self.animate(n,0)
  if n['cool']>0:
   n['cool']-=1
   if family=='falling'and not n['packed'][n['ri']][1]&0x70000:self.shake=1;self.limit=int(n['level']/2)+1
  if n['cool']==0:
   self.animate(n,0)
   if family=='falling':
    n['angle']=skill.old.angle(f(b.position[0]-n['position'][0]),f(aim_y-n['position'][1]));n['position']=movement(*n['position'],n['angle'],n['speed']);n['speed']=f(n['speed']+f(.5))
    if n['q']['signal']==0:
     resource=n['resource']
     if 0x1add0<=resource<=0x1add5:
      if n['trail']==0:self.trail(n['owner'],n['position'],0x1adb7,False,200)
     elif 0x1add6<=resource<=0x1add8:
      if n['trail']==0:self.trail(n['owner'],n['position'],0x1adb6,False,200)
      n['trail']+=1
   else:
    if n['q']['signal']==0:
     n['turn']=f(n['turn']+f(.1));target_angle=skill.old.angle(f(b.position[0]-n['position'][0]),f(b.position[1]-n['position'][1]));delta=target_angle-n['angle']
     if delta>180:delta-=360
     elif delta<=-180:delta+=360
     n['angle']=f(n['angle']+(-n['turn']if delta<0 else n['turn'])if abs(int(delta))>=n['turn']else n['angle']+delta)
    elif n['position'][0]<-200 or n['position'][0]>840 or n['position'][1]<-200 or n['position'][1]>680:n['deleted']=True
    n['position']=movement(*n['position'],n['angle'],n['speed'])
    if n['trail']==0 and 0x1addc<=n['resource']<=0x1addf:
     i=n['resource']-0x1addc;radius=[10,6,4,2][i];y=f(n['position'][1]+self.random.range(-radius,radius));x=f(n['position'][0]+self.random.range(-radius,radius));self.trail(n['owner'],[x,y],0x1adb7 if i<2 else 0x1adb6,True,202)
    if n['resource']==0x1adde:n['trail']+=1
   n['trail']=n['trail']+1 if n['trail']<2 else 0
   if family=='falling'and n['q']['signal']==1:n['deleted']=True;self.shake=0
  if family=='falling':n['drawPriority']=(b.body['drawPriority']+20)&255
  self.screen(n,True)
 def impact_node(self,n,res):
  q=n['q'];g=q['geometry'];p=n['screen'];x=self.random.range(0,int(g['width']/2))+p[0]-int(g['width']/4);y=int(q['drawOffsetY']/4)+p[1]-self.random.range(0,int(q['drawOffsetY']/3));self.node(n['owner'],'impact',resource=res,flags=0x50000,position=[x,y],screenSpace=True)
 def step(self):
  if self.phase2:
   slots=self.plan['reflectors']
   if not slots:self.phase2=False
   elif all(self.bodies[s].state==0 for s in slots[:-1])and self.bodies[slots[-1]].state==1 and self.bodies[self.case['caster']].state in[0,1]:self.bodies[slots[-1]].pop();self.phase2=False
  self.submissions=[];i=0
  while i<len(self.nodes):
   n=self.nodes[i];b=n['owner'];flags=b.actor_flags if n['kind']=='body'else n['flags']
   if flags&0x40000 and self.slow and self.phase:i+=1;continue
   if n['deleted']:
    if b.links.get(n['kind'])is n:b.links.pop(n['kind'])
    self.nodes.pop(i);continue
   if n['kind']=='body':previous=n['screen'][:];b.body_step();self.after_body(b,previous);b.screen(n);b.update()
   else:self.step_effect(n);b.screen(n)
   i=self.nodes.index(n)+1
  self.phase=(self.phase+1)%4;self.passes+=1
  if not self.slow or self.phase==0:self.offset=[self.random.range(-self.amplitude,self.amplitude),self.random.range(-self.amplitude,self.amplitude)]
  self.amplitude=min(self.amplitude+1,self.limit)if self.shake else max(0,self.amplitude-1)
  p=self.project_casting();depth=skill.scene.pointer_sort([dict(id=n['id'],y=n['screen'][1],alternateY=n['alternateY'],flags=n['actorFlags'],depthKey=0)for n in p['nodes']if n['actorFlags']&0x20000]);priorities={n:(i+9)&255 for i,n in enumerate(depth)}
  for n in self.nodes:
   if n['id']in priorities:n['drawPriority']=priorities[n['id']]
  return self.project_casting()
 def project_casting(self):
  bodies=[]
  for b in self.bodies.values():
   if b.detached:continue
   bodies.append(dict(slot=b.slot,state=b.state,busy=b.busy,position=b.position[:],angle=b.angle,facing=b.face,animationAction=b.action,speed=b.speed,speedPercent=b.percent,counter=b.counter,dynamicFlags=b.flags,actorFlags=b.actor_flags,vitals=b.vitals[:],skillStatus=b.skill,mpCost=b.cost,classCode=b.category,rememberedPosition=b.remember[:],reactionCounter=b.reaction_count,attackCooldown=b.cooldown,attackFinishCounter=b.finish,sourceTimer=b.timer,auxFF8=b.aux,tupleRead=b.tuple_read,resourceId=b.resource,savedFlags=b.saved))
  nodes=[]
  for n in self.nodes:
   b=n['owner'];body=n['kind']=='body';q={k:n['q'][k]for k in['graphicIndex','drawOffsetX','drawOffsetY','nextFrame','delay','signal','lastAction','lastResource','lastFacing','mode','attachmentX','attachmentY','drawFlags','color']}
   if 'presentationOffset'in n:q['drawOffsetX'],q['drawOffsetY']=n['presentationOffset']
   if 'alpha'in n:q['drawFlags']=(q['drawFlags']&~8)|(8 if n['alpha']<255 else 0);q['color']=(q['color']&0xffffff)|(n['alpha']<<24)
   row=dict(id=n['id'],kind=n['kind'],slot=b.slot if body else None,parentId=n['parent']['id']if n['parent']else None,deleted=n['deleted'],priority=n['priority'],drawPriority=n['drawPriority'],position=b.position[:]if body else n['position'][:],screen=n['screen'][:],state=b.state if body else n['state'],counter=n['counter'],height=n['height'],actorFlags=b.actor_flags if body else n['flags'],resourceId=b.resource if body else n['resource'],alternateY=n.get('alternateY',0),drawFlagMask=b.mask if body else n.get('mask',4),drawFlagValue=b.mask_value if body else n.get('maskValue',4),animation=q)
   if n['kind']=='casting-projectile':row['casting']=dict(family=n['family'],ownerSlot=b.slot,classCode=n['category'],level=n['level'],tupleRead=n['ri'],tuples=[v for t in n['packed']for v in t],delay=n['delay'],cooldown=n['cool'],trail=n['trail'],finish=n['finish'],angle=n['angle'],speed=n['speed'],turn=n['turn'])
   nodes.append(row)
  return dict(phase=self.phase,seed=self.random.seed,bodies=bodies,nodes=nodes,overlayCounter=self.overlay_counter,overlayDirection=self.overlay_direction,submissions=self.submissions[:],background=dict(offset=self.offset[:],amplitude=self.amplitude,limit=self.limit,shakeFlag=self.shake,slow=int(self.slow),quarterPhase=self.phase))
def main():
 animations,records,files=fixtures();cases=[]
 def case(name,category=19,level=0,caster=0,hits=None,**kw):return dict(name=name,category=category,level=level,caster=caster,hits=hits or[[10,1,12]],cost=3,local=0,**kw)
 for category in range(19,32):
  for level in range(10):cases.append(case('class%d-level%d'%(category,level),category,level))
 for category in [19,20,21,22,31]:
  for name,flags,amount in [('critical',3,17),('heal',0x20001,9),('negate',0x40001,12),('reflect',0x10001,12),('zero',0x10000000,0),('dodge',8,0),('KO',0x21,120),('RID',0x800001,9)]:cases.append(case('%s-%d'%(name,category),category,hits=[[10,flags,amount,[100040,100041,100050]]]if flags&0x800000 else[[10,flags,amount]]))
 cases.extend([case('multi-target',19,hits=[[10,1,7],[11,3,8],[12,0x800001,9,[100040,100041,100050]]]),case('multiple-reflectors',20,hits=[[10,0x10001,6],[11,0x10001,7]]),case('last-record-reflection',22,hits=[[10,0x10001,6],[11,3,7]]),case('self-normal',21,hits=[[0,1,7]]),case('self-drain-source-edge',31,hits=[[0,1,7]]),case('prolonged-chant',19,resource=100070)])
 for category in[19,20,22,31]:
  for name,flags,amount in [('scatter',0x41,12),('guard',0x20000001,12),('metadata',0x3600001,12),('RID-caster',0x802001,12),('zero-amount',0,0),('dodge100',0x100,0),('signed-min',1,-2147483648),('heal-overflow',0x20001,2147483647)]:cases.append(case('%s-%d'%(name,category),category,hits=[[10,flags,amount,[100040,100041,100050]]]if flags&0x800000 else[[10,flags,amount]]))
 cases.extend([case('slot20-drain',31,caster=20),case('slot21-drain',31,caster=21),case('ignored-word',22,ignoredWord=0x11223344),case('RID-followed-by-plain',20,hits=[[10,0x800001,9,[100040,100041,100050]],[11,1,8],[12,1,7]]),case('RID-reflection',20,hits=[[10,0x810001,12,[100040,100041,100050]]])])
 queue_cases=[]
 for c in cases:
  for flag in [0,1,3,4,8,0x20,0x40,0x100,0x400,0x800,0x10000,0x20000,0x40000,0x800000,0x100000,0x2000,0x200000,0x400000,0x1000000,0x2000000,0x10000000,0x20000000]:
   q={**c,'hits':[[10,flag,12,[100040,100041,100050]]]if flag&0x800000 else[[10,flag,12]]};queue_cases.append(dict(case=q,expected=queues(q)))
 traces=[]
 for c in cases:
  if c['name']=='self-drain-source-edge':traces.append(dict(case=c,states=[],settled=False,unavailable='casting-self-drain-cursor',final=None));continue
  w=World(animations,records,c);frames=[];rasters=[]
  for i in range(1200):
   frame=w.step();frames.append(digest(frame))
   if i<8 or i%19==0 or c.get('resource')==100070 and i<90:
    for selector in[0,1]:rasters.append(dict(frame=i+1,selector=selector,**render_reference(w,selector)))
   if all(b.detached or not b.busy for b in w.bodies.values())and all(n['kind']=='body'or n['kind']in['rider','attachment']for n in w.nodes):break
  settled=all(b.detached or not b.busy for b in w.bodies.values());traces.append(dict(case=c,states=frames,rasters=rasters,settled=settled,final=frame))
  print(c['name'],len(frames),settled,flush=True)
 homing=[]
 for angle in[-90,0,15,170,180,350,450]:
  for x,y in[(0,0),(1,0),(-1,0),(0,1),(0,-1),(10,3),(-10,-3)]:
   for limit in[0,.1,.9,1,3,180]:
    turn=skill.old.angle(x,y)-angle
    if turn>180:turn-=360
    elif turn<=-180:turn+=360
    expected=skill.old.angle(x,y)if limit==0 else f(angle+(-limit if turn<0 else limit))if abs(int(turn))>=limit else f(angle+turn);homing.append(dict(angle=angle,x=x,y=y,limit=limit,expected=expected))
 out=dict(schema='moli.casting-reference-stage198.v1',authority='Independent Python static-source equations and original synthetic fixtures; no product code imports or original execution',files=files,geometry=records,queues=queue_cases,traces=traces,homing=homing,frames=sum(len(t['states'])for t in traces),rgbaFrames=sum(len(t.get('rasters',[]))for t in traces));(A/'original-vectors.json').write_text(json.dumps(out,separators=(',',':'))+'\n');print(json.dumps(dict(cases=len(traces),frames=out['frames'],queues=len(queue_cases),rgbaFrames=out['rgbaFrames'])))
if __name__=='__main__':main()
