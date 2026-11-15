#!/usr/bin/env python3
"""Independent physical direct-owner equations and original synthetic resources.
No product imports. Common callbacks inherited only from older independent source models.
"""
from pathlib import Path
from types import SimpleNamespace
import importlib.util,json,struct,copy
A=Path(__file__).resolve().parent
s=importlib.util.spec_from_file_location('physical_prior',A.parent/'game-battle-moving-numeric-v1/generate_vectors.py');prior=importlib.util.module_from_spec(s);s.loader.exec_module(prior)
f=prior.f;digest=prior.digest;anime=prior.anime;skill=prior.skill;layout=prior.layout;signed=prior.prior.signed
CLASSES=[0,1,3,5,6,75,76,77,78,79,80,81,84,85,87,95,110,258,259,266]
CHARGE={0,1,3,5,6,75,76,77,78,79,80,81,84,85,87,257,258,259,262,266}
def queues(c):
 rows={};principal=c['hits'][0][0]
 def row(s):return rows.setdefault(s,dict(slot=s,actions=[],tuples=[],assignments={}))
 def act(s,*a):row(s)['actions'].extend(a)
 row(principal)['assignments'].update(classCode=c['category'],skillLevel=c['level'],mpCost=c.get('cost',3));act(principal,38)
 if c['category']in CHARGE:act(principal,147)
 if c['category']==262 and c['level']==9:act(principal,73)
 if c['category']==258:row(principal)['assignments']['rememberedPosition']=[318,270];act(principal,8,6,10)
 act(principal,53);dead=False
 for i,raw in enumerate(c['hits']):
  actor,target,flags,value=raw[:4];kind=c['category']if i==0 else-1;extra=c.get('extra',7)if kind==81 else None;rid=raw[4]if flags&0x800000 else None
  if kind==5:flags&=~4
  row(actor)['assignments']['physicalFamily']=1;act(actor,24,*([7,205 if kind==262 else 9,10]if i==0 or actor!=principal else[205]if kind==262 else[3]),242)
  t=[target,signed(flags),value,rid[0]if rid else 0];row(actor)['tuples'].append(t)
  if rid:row(actor)['tuples'].extend([[target,signed(flags),rid[0],rid[1]],[target,signed(flags),rid[2],0],t[:]])
  if kind in[5,84,87]:row(principal)['assignments']['messageResource']={5:0x5745,84:0x5747,87:0x5746}[kind];act(principal,66)
  act(actor,14);act(target,0)
  if not flags&0x108:
   if flags&0x40:
    if flags&3:act(target,32,*([244]if target==c['local']else[50,49]))
   elif (value!=0 or kind==6)and flags&3:act(target,160 if flags&2 else 26)
  if value!=0 or kind==6 or flags&0x108:
   if target!=principal:act(target,11)
   if flags&0x100:act(target,74)
  if flags&0x20:
   if target==principal:dead=True
   else:act(target,44)
  if kind==81 and not flags&0xc108 and(not flags&0x2000 or not flags&0x20):
   act(actor,62,78,155);row(actor)['assignments'].update(effectResource=0x10f,numberValue=extra,numberStyle=5)
  if kind==262 and c['level']==9 and i+1<len(c['hits']):act(principal,74)
 if dead:act(principal,11,44)
 else:
  if principal<20:act(principal,7,11,10)
  if c['category']==262 and c['level']==9 and len(c['hits'])==1:act(principal,74)
 return dict(rows=list(rows.values()),principal=principal)
def fixtures():
 _,_,source=prior.prior.fixtures();files={r['path']:bytes.fromhex(r['bytesHex'])for r in source};info=bytearray(files['Bin/GraphicInfo.bin']);pixels=bytearray(files['Bin/Graphic.bin']);index=bytearray(files['Bin/AnimeInfo.bin']);data=bytearray(files['Bin/Anime.bin'])
 known={struct.unpack_from('<I',info,at+36)[0]for at in range(0,len(info),40)};next_index=max(struct.unpack_from('<I',info,at)[0]for at in range(0,len(info),40))+1
 for resource in [0x5745,0x5746,0x5747,*[243730-48+ord(ch)for ch in '-0123456789']]:
  if resource in known:continue
  width,height=8,7;pix=bytes(0 if (i+resource)%5==0 else 17+(i+resource)%3 for i in range(width*height));raw=b'RD\0\0'+struct.pack('<iiI',width,height,len(pix)+16)+pix;row=bytearray(40);struct.pack_into('<IIIiiii',row,0,next_index,len(pixels),len(raw),-3,-4,width,height);struct.pack_into('<I',row,36,resource);info.extend(row);pixels.extend(raw);next_index+=1
 known_anim={struct.unpack_from('<I',index,at)[0]for at in range(0,len(index),12)}
 def add(resource,blocks):
  if resource in known_anim:return
  index.extend(struct.pack('<IIHH',resource,len(data),len(blocks),0));data.extend(b''.join(blocks));known_anim.add(resource)
 for resource,signals in[(100080,[0,10001,0]),(100081,[20001,10001,0])]:add(resource,[anime.action(d,a,96,[(graphic,-1,1,signals[i]if a==5 else 0)for i,graphic in enumerate([1002,1004,1005])])for d in range(8)for a in range(20)])
 for resource in [0x1ae5e,0x1ae5f,0x1ae50,0x1af86,0x1af8c,0x1af8d,0x1adfa,0x1ae12,*range(0x1adb4,0x1adb8)]:add(resource,[anime.action(0,0,96,[(1002,0,0,0),(1004,1,-1,0),(1005,0,0,0)])])
 files.update({'Bin/GraphicInfo.bin':bytes(info),'Bin/Graphic.bin':bytes(pixels),'Bin/AnimeInfo.bin':bytes(index),'Bin/Anime.bin':bytes(data)});records=[]
 for at in range(0,len(info),40):
  n,offset,size,x,y,w,h=struct.unpack_from('<IIIiiii',info,at);resource=struct.unpack_from('<I',info,at+36)[0];records.append(dict(index=n,resourceId=resource,originX=x,originY=y,width=w,height=h));raw=files['Bin/Graphic.bin'][offset:offset+size];head=20 if raw[2]==2 else 16;skill.scene.IMAGES[n]=dict(index=n,resource=resource,origin=[x,y],width=w,height=h,pixels=raw[head:head+w*h],embedded=raw[head+w*h:]if raw[2]==2 else None)
 def geo(kind,value):
  row=next(r for r in records if r['index'if kind=='index'else'resourceId']==value);return{k:row[k]for k in ['index','originX','originY','width','height']}
 anime.geo=geo;return anime.parse([dict(index=files['Bin/AnimeInfo.bin'],animation=files['Bin/Anime.bin'],graphicBase=0)]),records,[dict(path=p,bytesHex=b.hex())for p,b in files.items()]
class Body(prior.Body):
 def metadata(self):
  target,flags,_,_=self.tuples[self.tuple_read];flags&=0xffffffff;recipient=self.w.bodies[target]
  if flags&0x200000:self.w.message(recipient,0x5739)
  if flags&0x400000:self.w.message(recipient,0x573a)
  if flags&0x800000:
   rid0,rid1=self.tuples[self.tuple_read+1][2:4];rid2=self.tuples[self.tuple_read+2][2];self.tuple_read+=3;self.w.message(recipient,0x5738);recipient.rider(rid0,rid1);recipient.attachment(rid2)
  if flags&0x1000000:self.w.message(recipient,0x573a)
  if flags&0x2000000:self.w.message(recipient,0x5738)
 def body_step(self):
  if self.state==205:
   other=self.w.bodies[self.tuples[self.tuple_read][0]];self.action=3;self.speed=16;self.percent=50;self.aim(other.position)
   if int(sum((other.position[i]-self.position[i])**2 for i in range(2))**.5)<70:self.pop();self.speed=8;self.percent=100
   else:self.move()
   self.animate(self.body,0);self.w.node(self,'puff',resource=0x1adb4+(self.w.random.next()&3),flags=0x160000 if self.alt else 0x68000,position=self.position[:]);return
  if self.state==66:
   n=self.w.node(self,'message',resource=self.message,flags=0x40000,position=self.position[:],parent=self.body);n['height']=-8.;self.animate(n,1)
   if not self.flags&0x60:self.animate(self.body,1)
   self.pop();return
  if self.state!=14:return super().body_step()
  self.action=5;self.percent=100;target,flags,value,_=self.tuples[self.tuple_read];flags&=0xffffffff;victim=self.w.bodies[target];signal=self.body['q']['signal']
  if signal>9999:
   effects={0:[0x1ae35],1:[0x1ae36],3:[0x1ae37],5:[0x1ae3b],6:[0x1ae39],81:[0x1ae5e],84:[0x1ae5f],85:[0x1ae4f],87:[0x1ae50],258:[0x1af8d]}
   if flags&4:resources=[110000]
   elif flags&0x400:resources=[0x1ae12]
   elif 75<=self.category<=80:resources=[0x1adfa]
   elif self.category in effects:resources=effects[self.category]
   else:resources=[0x1adb1+self.w.random.range(0,2)]+([0x1af86]if self.category==259 else[])
   victim.frozen=0;victim.category=-1;victim.attacker=self;victim.reaction_flags=flags;victim.aim(self.position)
   if signal<20000:self.metadata();target,flags,value,_=self.tuples[self.tuple_read];flags&=0xffffffff
   if not flags&0x108:
    if value!=0 or self.category==6:
     victim.position=victim.remember[:]
     if flags&0x100000:victim.remove_link('status');victim.flags&=~0x20
     if flags&2:self.w.impact_node(victim.body,0x1adb8)
     for resource in resources:self.w.impact_node(victim.body,resource)
     if signal<20000 and flags&0x20:victim.flags|=2;victim.aux=1;self.w.slow=True
    if signal<20000:
     if flags&0x80000:
      if 75<=self.category<=80:self.w.condition(victim,110000+self.category)
      elif self.category==259:self.w.condition(victim,0x1adfb)
     victim.pop()
     if self.category==6:
      victim.vital(2,value)
      if value==0 and flags&0x10000000:self.w.message(victim,0x57bb)
      else:
       self.w.number_style(victim,value,3)
       if flags&2:self.w.message(victim,0x57b6)
     elif value==0:self.w.message(victim,0x57bb if flags&0x10000000 else 0x573b)
     elif self.category not in[84,85,87]:
      victim.vital(0,value);self.w.number_style(victim,value,6)
      if flags&2:self.w.message(victim,0x57b6)
    elif value!=0 or self.category==6:victim.state=25
   elif flags&8:victim.state=29
   elif signal>=20000 or victim.after_image_enabled==0:victim.after_image_enabled=1;victim.state=29
   if (not flags&8 and value!=0)or self.category==6:self.cooldown=(((victim.flags>>1)&1)+1)*14
   self.body['q']['signal']=0
  if self.cooldown>0:self.cooldown-=1
  if self.cooldown==0:
   if self.finish==0:
    if self.animate(self.body,1)!=1:return
   elif self.finish>10:self.pop();self.tuple_read+=1;self.cooldown=self.finish=0;return
   self.finish+=1
class World(prior.World):
 def __init__(self,animations,records,c):
  self.animations,self.records=animations,records;self.nodes=[];self.next_id=1;self.random=skill.old.Random(12345);self.phase=self.passes=0;self.slow=False;self.events=[];self.bodies={};self.local=c['local'];self.alt=False;self.offset=[0,0];self.overlay_counter=self.overlay_direction=0;self.submissions=[];self.shake=self.amplitude=self.limit=0;self.case=c;self.field=None;self.used=False;self.phase2=False;self.stopped=False
  self.manager=SimpleNamespace(slot=None,body=None,links={},screen=lambda n:None);self.character_flags(c.get('C_flags',0))
  for slot in sorted(set(s for h in c['hits']for s in h[:2])):
   b=Body(self,slot,c.get('resource',100080));self.bodies[slot]=b;b.after_image_enabled=b.after_image_counter=0;b.raw=c.get('flags',{}).get(str(slot),0)
   if b.raw&0x1000:b.scale=[f(1.3),f(1.3)]
   if b.raw&0x3f0:self.condition(b,0x1adfb+(b.raw&0x3f0).bit_length()-5)
   if b.raw&0x800:self.toggle(b,True)
  self.plan=queues(c)
  for row in self.plan['rows']:
   b=self.bodies[row['slot']];b.actions=row['actions']+[-1]if row['actions']else[0,-1];b.read=0;b.write=len(row['actions'])-1;b.busy=int(bool(row['actions']));b.tuples=row['tuples']+[[-1,0,0,0]]+[[0,0,0,0]for _ in range(199-len(row['tuples']))];b.tuple_read=0
   for key,value in row['assignments'].items():
    if key=='physicalFamily':continue
    setattr(b,{'classCode':'category','skillLevel':'level','mpCost':'cost','numberValue':'number_value','numberStyle':'number_style','effectResource':'effect','messageResource':'message','rememberedPosition':'remember'}[key],copy.deepcopy(value))
  b=self.bodies[self.plan['principal']];b.state=b.actions[0]
def main():
 animations,records,files=fixtures();cases=[]
 def case(name,category=5,hits=None,level=0,**kw):return dict(dict(name=name,category=category,level=level,hits=[[0,10,1,12]]if hits is None else hits,cost=3,local=0,resource=100080),**kw)
 for category in CLASSES:
  for level in[0,9]if category!=259 else[0,8]:cases.append(case('class%d-level%d'%(category,level),category,level=level))
 for name,category,flags,value in [('MP-zero',6,1,0),('MP-message',6,0x10000000,0),('MP-negative',6,1,-7),('MP-overflow',6,1,-2147483648),('MP-KO',6,0x21,12),('noHP84',84,3,12),('noHP85',85,3,12),('noHP87',87,3,12),('zero-KO',0,0x20,0),('zero',5,0,0),('zero-message',5,0x10000000,0),('not-reflect',5,0x10000,12),('not-absorb',5,0x40000,12),('condition75',75,0x80001,12),('condition259',259,0x80001,12),('clear-status',5,0x100001,12),('RID',5,0x800001,9),('metadata',5,0x3600001,12),('critical',5,3,12),('dodge',5,8,12),('guard',5,0x100,12),('scatter',5,0x41,12),('scatter-nohit',5,0x40,12),('signed-min',5,1,-2147483648),('signed-max',5,1,2147483647)]:
  h=[0,10,flags,value]+([[100040,100041,100050]]if flags&0x800000 else[]);cases.append(case(name,category,[h],**({'flags':{'10':32}}if name=='clear-status'else{})))
 cases.extend([case('multi',hits=[[0,10,1,7],[1,11,3,9]]),case('repeat',hits=[[0,10,1,7],[0,10,3,9]]),case('actor-switch',hits=[[0,10,1,7],[1,11,1,9],[0,12,1,4]]),case('target-local-stop',hits=[[1,0,0x41,12]]),case('RID-then-plain',hits=[[0,10,0x800001,9,[100040,100041,100050]],[0,11,1,8]]),case('scaled',flags={'0':4096}),case('counter',resource=100081),case('slot20',hits=[[20,0,1,12]]),case('slot21',hits=[[21,10,1,12]]),case('counter-pairs',hits=[[0,10,1,12],[10,0,3,6]])])
 queue_cases=[]
 for category in CLASSES:
  for level in range(10):
   for actor,target in[(0,10),(1,10),(10,0),(20,0),(21,10)]:
    for flags in[0,1,3,8,0x20,0x21,0x40,0x41,0x100,0x108,0x400,0x80000,0x100000,0x800000,0x20000000,0x10000000]:
     if category==259 and level==9:continue
     h=[actor,target,flags,12]+([[100040,100041,100050]]if flags&0x800000 else[]);c=case('queue-%d-%d-%d-%d-%x'%(category,level,actor,target,flags),category,[h],level);queue_cases.append(dict(case=c,expected=queues(c)))
 queue_cases.extend(dict(case=c,expected=queues(c))for c in cases);traces=[]
 for c in cases:
  w=World(animations,records,c);states=[];rasters=[]
  for i in range(3000):
   frame=w.step();states.append(digest(frame))
   if i<8 or i%29==0:
    for selector in[0,1]:
     try:rasters.append(dict(frame=i+1,selector=selector,**prior.render_reference(w,selector)))
     except Exception:
      (A.parent.parent/'build/analysis/game-battle-physical-family-runtime-v1/reference-geometry-diagnostic.json').write_text(json.dumps(dict(case=c,frame=i+1,bad=[n for n in frame['nodes']if n['animation']['graphicIndex']==0],messages={b.slot:getattr(b,'message',None)for b in w.bodies.values()}),indent=2));raise
   if w.stopped:break
   if all(b.detached or not b.busy for b in w.bodies.values())and all(n['kind']in {'body','status','status-skill-overlay','status-skill-field','rider','attachment'}for n in w.nodes):break
  traces.append(dict(case=c,states=states,rasters=rasters,stopped=w.stopped,bodySettled=all(b.detached or not b.busy for b in w.bodies.values()),final=frame));print(c['name'],len(states),w.stopped,flush=True)
 out=dict(schema='moli.physical-family-reference-stage204.v1',authority='Independent original-source equations and original synthetic bytes; no product imports or original execution',files=files,geometry=records,queues=queue_cases,traces=traces,frames=sum(len(t['states'])for t in traces),rgbaFrames=sum(len(t['rasters'])for t in traces));(A/'original-vectors.json').write_text(json.dumps(out,separators=(',',':'))+'\n');print(json.dumps(dict(queues=len(queue_cases),traces=len(traces),states=out['frames'],RGBA=out['rgbaFrames'])),flush=True)
if __name__=='__main__':main()
