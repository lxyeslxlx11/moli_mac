#!/usr/bin/env python3
"""Independent fixed37c4 guard/contiguous-look-ahead/charge equations.
Native423fa0/4241f0/424310/436c20 and selected40a120 groups,not product imports.
"""
from pathlib import Path
from types import SimpleNamespace
import copy,hashlib,importlib.util,json,struct,sys
sys.dont_write_bytecode=True
A=Path(__file__).resolve().parent;R=A.parent.parent;P=R/'build/analysis/game-battle-physical-guard-v1'
s=importlib.util.spec_from_file_location('guard_prior',A.parent/'game-battle-physical-specials-v1/generate_vectors.py');prior=importlib.util.module_from_spec(s);s.loader.exec_module(prior)
anime=prior.anime;skill=prior.skill;f=prior.f;digest=prior.digest;signed=prior.signed
CLASSES=[0,1,3,5,6,75,76,77,78,79,80,81,84,85,87,95,110,258,259,266]
mapped=lambda n:50 if n==20 else 51 if n==21 else n
decoded=lambda n:20 if n==50 else 21 if n==51 else n
def words(c):
 out=[c['category']*100+c['level'],c.get('cost',3),0];ends=[]
 for i,h in enumerate(c['hits']):
  a,t,flags,value=h[:4];out.extend([mapped(a),mapped(t),signed(flags),value])
  if i==0 and c['category']==81:out.append(c.get('extra',7))
  if flags&0x800000:out.extend(h[4])
  if flags&0x200:out.append(mapped(h[5]))
  ends.append(len(out))
 out.append(255);return out,ends
def lookahead(raw,start,actor):
 at=start
 for _ in range(1024):
  if at>=len(raw):return None
  first=decoded(raw[at]);at+=1
  if first==255:return -1
  if at+1>=len(raw):return None
  second,flags=decoded(raw[at]),raw[at+1]&0xffffffff;at+=2
  if flags&0x1010==0:return -1
  if first==actor:return second
  at+=1
  if flags&0x800000:at+=3
 return None

def queues(c):
 rows={};principal=c['hits'][0][0];wire,ends=words(c)
 def row(s):return rows.setdefault(s,dict(slot=s,actions=[],tuples=[],assignments={}))
 def act(s,*items):row(s)['actions'].extend(items)
 def put(s,t,flags,amount,extra=None):row(s)['tuples'].append([t,signed(flags),amount]+([]if extra is None else[extra]))
 def own(s):row(s)['assignments']['physicalFamily']=1
 def guard(a,t,g,flags,amount):
  own(t);own(g);act(a,72);put(a,g,flags,amount);act(a,24,71,0,24)
  act(g,0);put(g,t,flags,amount);row(g)['assignments'].update(pairedTarget=t,effectResource=0xfc,messageResource=0x5748);act(g,39,78,67,34,73,7,4,42,71,10,74,72);put(g,t,flags,amount)
  act(t,0,27);put(t,a,flags,amount);act(t,71,72,62,1)
 def metadata(a,t,flags,rid):
  if rid is None:return
  previous=row(a)['tuples'][-1][:]
  if len(previous)==3:
   old=c.get('initialFourths',{}).get(str(a),[]);index=len(row(a)['tuples'])-1;previous.append(old[index]if index<len(old)else 0)
  put(a,t,flags,rid[0],rid[1]);put(a,t,flags,rid[2],0);row(a)['tuples'].append(previous)
 def finish_guard(t,flags,amount,next_slot):
  own(t)
  if amount==0:act(t,35)
  act(t,71,72)
  if not flags&0x20:act(t,38)
  if amount==0:
   if next_slot>=0:act(t,3);put(t,next_slot,0,0,0);act(t,72)
   else:act(t,11)
 row(principal)['assignments'].update(classCode=c['category'],skillLevel=c['level'],mpCost=c.get('cost',3));act(principal,38)
 if c['category']in prior.prior.prior.CHARGE:act(principal,147)
 if c['category']==262 and c['level']==9:act(principal,73)
 if c['category']==258:row(principal)['assignments']['rememberedPosition']=[318,270];act(principal,8,6,10)
 act(principal,53);dead=False
 for i,h in enumerate(c['hits']):
  a,t,flags,amount=h[:4];kind=c['category']if i==0 else-1;rid=h[4]if flags&0x800000 else None;g=h[5]if flags&0x200 else None
  if kind==5:flags&=~4
  own(a);act(a,24)
  if flags&0x1010:act(a,3,113)
  elif i==0 or a!=principal:act(a,7,205 if kind==262 else 9,10)
  else:act(a,205 if kind==262 else 3)
  act(a,242);put(a,t,flags,amount,rid[0]if rid else 0)
  if g is not None:guard(a,t,g,flags,amount);act(t,11);t=g
  if kind in[5,84,87]:row(principal)['assignments']['messageResource']={5:0x5745,84:0x5747,87:0x5746}[kind];act(principal,66)
  if kind==259 and c['level']==9:act(a,72);put(a,0,0,15);act(a,240);put(a,t,flags,amount,rid[0]if rid else 0)
  metadata(a,t,flags,rid);act(a,14);act(t,0)
  if not flags&0x108:
   if flags&0x40:
    if flags&3:
     act(t,32)
     if g is not None:act(t,71,72)
     act(t,*([244]if t==c['local']else[50,49]))
   elif (amount!=0 or kind==6)and flags&3:act(t,160 if flags&2 else 26)
  next_slot=lookahead(wire,ends[i],t)
  if next_slot is None:raise ValueError('bounded look-ahead frontier')
  if g is not None:finish_guard(t,flags,amount,next_slot)
  if amount!=0 or kind==6 or flags&0x108:
   if t!=principal:act(t,11 if next_slot<0 else 243)
   if flags&0x100:act(t,74)
  if flags&0x20:
   if t==principal:dead=True
   else:act(t,44)
  if kind==81 and not flags&0xc108 and(not flags&0x2000 or not flags&0x20):act(a,62,78,155);row(a)['assignments'].update(effectResource=0x10f,numberValue=c.get('extra',7),numberStyle=5)
  if kind==262 and c['level']==9 and i+1<len(c['hits']):act(principal,74)
 if dead:act(principal,11,44)
 else:
  if principal<20:act(principal,7,11,10)
  if c['category']==262 and c['level']==9 and len(c['hits'])==1:act(principal,74)
 return dict(principal=principal,rows=list(rows.values()))

def fixtures():
 animations,records,source=prior.fixtures();files={r['path']:bytes.fromhex(r['bytesHex'])for r in source};info=bytearray(files['Bin/GraphicInfo.bin']);pixels=bytearray(files['Bin/Graphic.bin']);index=bytearray(files['Bin/AnimeInfo.bin']);data=bytearray(files['Bin/Anime.bin'])
 known={r['resourceId']for r in records};n=max(r['index']for r in records)+1
 if 0x5748 not in known:
  resource=0x5748;width,height=8,7;paint=bytes(0 if(i+resource)%5==0 else 17+(i+resource)%3 for i in range(width*height));raw=b'RD\0\0'+struct.pack('<iiI',width,height,len(paint)+16)+paint;row=bytearray(40);struct.pack_into('<IIIiiii',row,0,n,len(pixels),len(raw),-3,-4,width,height);struct.pack_into('<I',row,36,resource);info.extend(row);pixels.extend(raw);records.append(dict(index=n,resourceId=resource,originX=-3,originY=-4,width=width,height=height));skill.scene.IMAGES[n]=dict(index=n,resource=resource,origin=[-3,-4],width=width,height=height,pixels=paint,embedded=None)
 known_animation={struct.unpack_from('<I',index,at)[0]for at in range(0,len(index),12)}
 for resource in[0x1adb9,0x1ae49]:
  if resource not in known_animation:
   blocks=[anime.action(0,0,96,[(1002,0,0,0),(1004,1,-1,0),(1005,0,0,0)])];index.extend(struct.pack('<IIHH',resource,len(data),len(blocks),0));data.extend(b''.join(blocks))
 files.update({'Bin/GraphicInfo.bin':bytes(info),'Bin/Graphic.bin':bytes(pixels),'Bin/AnimeInfo.bin':bytes(index),'Bin/Anime.bin':bytes(data)})
 return anime.parse([dict(index=files['Bin/AnimeInfo.bin'],animation=files['Bin/Anime.bin'],graphicBase=0)]),records,[dict(path=p,bytesHex=b.hex())for p,b in files.items()]

class Body(prior.Body):
 def __init__(self,w,slot,resource):super().__init__(w,slot,resource);self.frozen=self.pairedTarget=0;self.tuple_write=0
 def body_step(self):
  state=self.state
  if state==4:
   other=self.w.bodies[self.tuples[self.tuple_read][0]];self.action=3;self.speed=8;self.percent=100;self.aim(other.position)
   if self.distance(other.position)>=8:self.move()
   else:self.pop()
   self.animate(self.body,0);return
  if state==27:
   self.action=8;self.percent=50;self.reaction_count+=1
   if self.reaction_count<14:self.speed=5;self.flip();self.move()
   elif self.reaction_count<34:
    if self.reaction_count==14:self.speed=5;self.counter=0
    self.reaction_puff()
    self.speed=max(0,f(self.speed-f(.3)));self.move()
   elif self.reaction_count>53:self.reaction_count=0;self.speed=4;self.percent=100;self.pop()
   self.animate(self.body,1);return
  if state==34:
   if not self.flags&0x60:self.animate(self.body,0)
   self.counter+=1
   if self.counter>=30:self.counter=0;self.pop()
   return
  if state==42:self.w.bodies[self.tuples[self.tuple_read][0]].aim(self.position);self.pop();return
  if state==71:self.w.bodies[self.tuples[self.tuple_read][0]].pop();self.pop();return
  if state==73:self.after_image_enabled=1;self.pop();return
  if state==113:
   self.action=5;self.animate(self.body,1)
   if self.skill==0:
    other=self.w.bodies[self.tuples[self.tuple_read][0]];self.w.guard_charge(self,3 if self.tuples[self.tuple_read][1]&0x1000 else 0);self.frozen=other.frozen=1
   self.state=157;return
  if state==157:
   if not self.flags&0x60:self.animate(self.body,0)
   if self.skill==2:self.skill=self.frozen=0;self.pop()
   return
  if state==39:self.aim(prior.prior.layout[self.pairedTarget]['target']);self.pop();return
  if state==243:
   self.action=1;self.speed=8;self.percent=100;self.aim(self.remember);self.move()
   if self.distance(self.remember)<5:self.position=self.remember[:];self.pop()
   self.animate(self.body,0);return
  return super().body_step()

class World(prior.World):
 def __init__(self,animations,records,c):
  self.direct=[];self.direct_used=False;self.animations,self.records=animations,records;self.nodes=[];self.next_id=1;self.random=skill.old.Random(12345);self.phase=self.passes=0;self.slow=False;self.events=[];self.bodies={};self.local=c['local'];self.alt=False;self.offset=c.get('offset',[0,0])[:];self.overlay_counter=self.overlay_direction=0;self.submissions=[];self.shake=self.amplitude=self.limit=0;self.case=c;self.field=None;self.used=False;self.phase2=False;self.stopped=False
  self.manager=SimpleNamespace(slot=None,body=None,links={},screen=lambda n:None);self.character_flags(c.get('C_flags',0));slots={s for h in c['hits']for s in h[:2]}|{h[5]for h in c['hits']if h[2]&0x200}
  for slot in sorted(slots):
   b=Body(self,slot,c['resource']);self.bodies[slot]=b;b.after_image_enabled=b.after_image_counter=0;b.raw=c.get('flags',{}).get(str(slot),0)
   if b.raw&0x1000:b.scale=[f(1.3),f(1.3)]
   if b.raw&0x3f0:self.condition(b,0x1adfb+(b.raw&0x3f0).bit_length()-5)
   if b.raw&0x800:self.toggle(b,True)
   for t in b.tuples:t[0]=-1
   for i,fourth in enumerate(c.get('initialFourths',{}).get(str(slot),[])):b.tuples[i][3]=fourth
  self.plan=queues(c);names={'classCode':'category','skillLevel':'level','mpCost':'cost','messageResource':'message','effectResource':'effect','rememberedPosition':'remember','numberValue':'number_value','numberStyle':'number_style','pairedTarget':'pairedTarget'}
  for row in self.plan['rows']:
   b=self.bodies[row['slot']];b.actions=row['actions']+[-1]if row['actions']else[0,-1];b.read=0;b.write=len(row['actions'])-1;b.busy=int(bool(row['actions']));b.tuple_read=0;b.tuple_write=len(row['tuples'])
   for i,t in enumerate(row['tuples']):b.tuples[i][:len(t)]=t;b.tuples[i+1][0]=-1
   for key,value in row['assignments'].items():
    if key!='physicalFamily':setattr(b,names[key],copy.deepcopy(value))
  b=self.bodies[self.plan['principal']];b.state=b.actions[0]
 def animate(self,n,mode):
  b=n['owner'];body=n['kind']=='body';q,out=anime.step(n['q'],anime.ctx(resourceId=b.resource if body else n['resource'],action=b.action if body else n.get('action',0),facing=b.face if body else n.get('face',0),speedPercent=b.percent if body else n.get('percent',100),mode=mode,frozen=getattr(b,'frozen',0)if body else 0,soundScene=10,actorFlags=b.actor_flags if body else n['flags']),self.animations);n['q']=q;return out['code']
 def guard_charge(self,b,kind):
  n=self.node(b,'physical-guard-charge',resource=0x1ae49 if kind==3 else 0x1adb9,flags=0x40000,position=[b.position[0],f(b.position[1]-32)],parent=b.body,screenSpace=True);b.skill=1;return n
 def step_effect(self,n):
  if n['kind']=='physical-guard-charge':
   if self.animate(n,1)==1:
    if not n['parent']['deleted']and n['owner'].skill:n['owner'].skill=2
    n['deleted']=True
   return
  return super().step_effect(n)
 def project_casting(self):
  p=super().project_casting()
  for row in p['bodies']:
   b=self.bodies[row['slot']];row.update(frozen=b.frozen,actionRead=b.read,actionWrite=b.write,tupleWrite=b.tuple_write,pairedTarget=b.pairedTarget,messageResource=getattr(b,'message',0),effectResource=getattr(b,'effect',0))
  return p
 def owned(self):
  return [dict(slot=b.slot,actions=b.actions+[0]*(200-len(b.actions)),actionRead=b.read,actionWrite=b.write,tuples=[x for t in b.tuples for x in t],tupleRead=b.tuple_read,tupleWrite=b.tuple_write)for b in self.bodies.values()if not b.detached]

def case(name,category=0,level=0,hits=None,**extra):return dict(dict(name=name,category=category,level=level,variant=0,caster=0,cost=3,local=0,resource=100080,hits=hits or[[0,10,0x201,12,None,11]]),**extra)
def main(quick=False):
 animations,records,files=fixtures();cases=[case('guard'),case('charge0',hits=[[0,10,0x11,12]]),case('charge3',hits=[[0,10,0x1001,12]]),case('guard-charge0',hits=[[0,10,0x211,12,None,11]]),case('guard-charge3',hits=[[0,10,0x1201,12,None,11]]),case('guard-RID',hits=[[0,10,0x800201,9,[100040,100041,100050],11]]),case('guard2599',259,9),case('guard-zero',hits=[[0,10,0x200,0,None,11]]),case('guard-lookahead',hits=[[0,10,0x201,12,None,11],[11,0,0x11,7]]),case('guard-lookahead-RID',hits=[[0,10,0x201,12,None,11],[1,10,0x800010,5,[100040,100041,100050]],[11,0,0x1001,7]])]
 queue_vectors=[]
 if not quick:
  for category in CLASSES:
   for level in[0,9]:
    for flag,name in[(0x201,'guard'),(0x211,'guard-charge0'),(0x1201,'guard-charge3'),(0x11,'charge0'),(0x1001,'charge3')]:cases.append(case('%s-class%d-level%d'%(name,category,level),category,level,hits=[[0,10,flag,12]+([None,11]if flag&0x200 else[])]))
  for flag,name,value in[(0x203,'critical',12),(0x208,'dodge',12),(0x300,'defense',12),(0x308,'immune',12),(0x221,'KO',90),(0x241,'scatter',12),(0x100201,'clear-status',12),(0x800201,'RID',9),(0x200,'zero',0),(0x201,'negative',-7),(0x201,'min',-2147483648),(0x201,'max',2147483647)]:cases.append(case('guard-'+name,hits=[[0,10,flag,value,([100040,100041,100050]if flag&0x800000 else None),11]],**({'flags':{'11':32}}if name=='clear-status'else{})))
  cases.extend([case('guard-offset',offset=[11,-7]),case('guard-RID-old-fourth',hits=[[0,10,0x800201,9,[100040,100041,100050],11]],initialFourths={'0':[0,0x11223344]}),case('guard-local-exit',local=11,hits=[[0,10,0x241,12,None,11]]),case('guard-alias-actor',hits=[[0,10,0x201,12,None,0]]),case('guard-alias-target',hits=[[0,10,0x201,12,None,10]])])
  for category in CLASSES:
   for level in range(10):
    for actor,target,guardian in[(0,10,11),(1,10,5),(10,0,1),(20,0,10),(21,10,0)]:
     for flag in[0x200,0x201,0x203,0x208,0x300,0x308,0x220,0x221,0x241,0x800201,0x800203,0x100201,0x211,0x1201,0x11,0x1001]:
      h=[actor,target,flag,12]+([([100040,100041,100050]if flag&0x800000 else None),guardian]if flag&0x200 else[]);c=case('queue',category,level,hits=[h]);queue_vectors.append(dict(input=[category,level,actor,target,guardian,flag],expected_digest=digest(queues(c)['rows'])))
 traces=[]
 for c in cases:
  w=World(animations,records,c);initial=digest(w.owned());states=[];rasters=[];old_vitals=None
  for i in range(3000):
   frame=w.step();states.append(digest(frame));vitals=[b.vitals[:]for b in w.bodies.values()]
   if i<4 or i%43==0 or vitals!=old_vitals:
    for selector in[0,1]:rasters.append(dict(frame=i+1,selector=selector,**prior.render_reference(w,selector)))
   old_vitals=copy.deepcopy(vitals)
   if w.stopped:break
   if all(b.detached or not b.busy for b in w.bodies.values())and all(n['kind']in['body','status','rider','attachment','status-skill-overlay','status-skill-field']for n in w.nodes):break
  traces.append(dict(case=c,initialOwnedDigest=initial,states=states,rasters=rasters,stopped=w.stopped,bodySettled=all(b.detached or not b.busy for b in w.bodies.values()),finalOwnedDigest=digest(w.owned()),final=frame));print(c['name'],len(states),traces[-1]['bodySettled'],flush=True)
 out=dict(schema='moli.physical-guard-reference-stage208.v1',authority='Independent retained native source equations and authored synthetic archive bytes;no product imports or original execution',files=files,geometry=records,queues=queue_vectors,traces=traces,frames=sum(len(t['states'])for t in traces),rgbaFrames=sum(len(t['rasters'])for t in traces));destination=P/'quick-vectors.json'if quick else A/'original-vectors.json';destination.write_text(json.dumps(out,separators=(',',':'))+'\n');print(json.dumps(dict(path=str(destination.relative_to(R)),queues=len(queue_vectors),scenarios=len(traces),states=out['frames'],RGBA=out['rgbaFrames'])),flush=True)
if __name__=='__main__':main('--quick'in sys.argv)
