#!/usr/bin/env python3
"""Independent fixed37c4 pet transition equations; original synthetic resources, no product imports."""
from pathlib import Path
import importlib.util,json,struct,hashlib,copy
A=Path(__file__).resolve().parent
s=importlib.util.spec_from_file_location('pet_cbc_reference',A.parent/'game-battle-character-change-v1/generate_vectors.py');cbc=importlib.util.module_from_spec(s);s.loader.exec_module(cbc)
skill=cbc.skill;anime=cbc.anime;f=skill.f;layout=skill.layout;pair=cbc.change.pair

def fixtures():
 _,records,prior=cbc.fixtures();files={r['path']:bytes.fromhex(r['bytesHex'])for r in prior};index=bytearray(files['Bin/AnimeInfo.bin']);data=bytearray(files['Bin/Anime.bin']);info=bytearray(files['Bin/GraphicInfo.bin']);pixels=bytearray(files['Bin/Graphic.bin'])
 for i,res in enumerate([0x5742,0x5743]):
  raw=b'RD\0\0'+struct.pack('<iiI',8,8,80)+bytes(0 if j%5==0 else 17+(j+i)%3 for j in range(64));row=bytearray(40);struct.pack_into('<IIIiiii',row,0,7000+i,len(pixels),len(raw),-3,-4,8,8);struct.pack_into('<I',row,36,res);info.extend(row);pixels.extend(raw)
 for res in [100060,100061,0x1ae10,0x1ae11]:
  actor=res<110000;blocks=[anime.action(direction,action,96,[(g,-1 if actor else 0,1 if actor else 0,10001 if actor and action in[5,6]and i==1 else 0)for i,g in enumerate([1002,1004,1005])])for direction in(range(8)if actor else[0])for action in(range(20)if actor else[0])];index.extend(struct.pack('<IIHH',res,len(data),len(blocks),0));data.extend(b''.join(blocks))
 files.update({'Bin/AnimeInfo.bin':bytes(index),'Bin/Anime.bin':bytes(data),'Bin/GraphicInfo.bin':bytes(info),'Bin/Graphic.bin':bytes(pixels)});records=[]
 for at in range(0,len(info),40):
  n,offset,size,ox,oy,w,h=struct.unpack_from('<IIIiiii',info,at);res=struct.unpack_from('<I',info,at+36)[0];records.append(dict(index=n,resourceId=res,originX=ox,originY=oy,width=w,height=h));raw=files['Bin/Graphic.bin'][offset:offset+size];head=20 if raw[2]==2 else 16;skill.scene.IMAGES[n]=dict(index=n,resource=res,origin=[ox,oy],width=w,height=h,pixels=raw[head:head+w*h],embedded=raw[head+w*h:]if raw[2]==2 else None)
 def geo(kind,value):
  r=next(r for r in records if r['index'if kind=='index'else'resourceId']==value);return{k:r[k]for k in ['index','originX','originY','width','height']}
 anime.geo=geo
 return anime.parse([dict(index=bytes(index),animation=bytes(data),graphicBase=0)]),records,[dict(path=p,bytesHex=b.hex())for p,b in files.items()]

class Body(cbc.Body):
 def __init__(self,w,slot,dead=False,fresh=False,links=None):
  super().__init__(w,dict(slot=slot,cLinks=links or[0,0],dead=dead));self.resource=100500 if fresh else 100060;self.scale=[1.,1.];self.paired=0;self.value=0;self.meta=[0]*4;self.effect=0;self.msg=0;self.children={};self.tuple_write=0;self.actions=[0,-1];self.saved=2 if dead else 0;self.deleted=False
  if fresh:self.speed=3.;self.position=list(layout[slot]['entry']);self.face=1;self.angle=0.;self.category=0
  self.body['q']=anime.initial()
  if dead:
   while self.animate(self.body,1)!=1:pass
   g=self.body['q']['geometry'];q=self.body['q']
   for n in self.w.nodes:
    if n['kind']=='death'and n['owner']is self:n['position']=[f(int(g['width']/2)+q['drawOffsetX']+self.position[0]),f(int(g['height']/2)+q['drawOffsetY']+self.position[1])];self.screen(n)
  self.animate(self.body,0);self.body['screen']=list(layout[slot]['entry']);self.vitals=[0 if dead else 70,100,10,10]
 def body_step(self):
  state=self.state
  if state==35:
   if not self.flags&0x60:self.animate(self.body,0)
   self.counter+=1
   if self.counter>=60:self.counter=0;self.pop()
  elif state==39:self.aim(layout[self.paired]['target']);self.pop()
  elif state==218:
   index=self.tuples[self.tuple_read][0];local=self.w.bodies.get(self.w.local);other=self.w.bodies.get(pair(self.w.local));self.w.events.append(dict(kind='battle-pet-cache',index=index,refreshValues=other.vitals[:]if self.w.local<20 and local and 'rider'not in local.links and other else None));self.tuple_read+=1;self.pop()
  elif state==66:
   n=self.w.node(self,'message',resource=self.msg,flags=0x40000,position=self.position,parent=self.body);n['height']=-8.;self.animate(n,1);self.screen(n)
   if not self.flags&0x60:self.animate(self.body,1)
   self.pop()
  elif state==65:
   self.action=6;signal=self.body['q']['signal']
   if 9999<signal<20000:
    while self.tuples[self.tuple_read][0]!=-1:
     other=self.w.bodies.get(self.tuples[self.tuple_read][0])
     if other:other.state=other.actions[other.read]
     self.tuple_read+=1
    self.tuple_read+=1;self.body['q']['signal']=0
   if self.animate(self.body,1)==1:self.pop()
  elif state in[51,52]:
   growing=state==52;flag=0x100000 if self.w.alt else 0x8000;self.actor_flags|=flag
   if growing:self.reface()
   self.scale=[f(n+(f(.02)if growing else-f(.02)))for n in self.scale]
   if self.scale[0]>1 if growing else self.scale[0]<0:self.scale=[1.,1.]if growing else[0.,0.]
   if self.skill==0:
    n=self.w.node(self,'pet-transition',resource=0x1ae10 if growing else 0x1ae11,flags=0x40000|flag,parent=self.body);self.children['pet-transition']=n;self.skill=1
   if self.scale[0]==(1 if growing else 0):
    n=self.children.pop('pet-transition',None)
    if n:n['deleted']=True
    if growing:self.actor_flags&=~flag;self.skill=0
    self.pop()
   self.animate(self.body,1)
  elif state==49:self.w.bodies.pop(self.slot,None);self.detached=True;self.body['deleted']=True;self.deleted=True
  elif state==78:self.pop()
  else:super().body_step()
 def project_pet(self):
  return dict(slot=self.slot,state=self.state,busy=self.busy,resourceId=self.resource,value1d0=self.value,dynamicFlags=self.flags,savedFlags=self.saved,statusMetadata=self.meta[:],vitals=self.vitals[:],position=self.position[:],scale=self.scale[:],actorFlags=self.actor_flags,skillStatus=self.skill,animationAction=self.action,facing=self.face,angle=self.angle,actionRead=self.read,actionWrite=self.write,tupleRead=self.tuple_read,pairedTarget=self.paired,actions=self.actions[:self.write+2],tuples=[x[:3]for x in self.tuples[:self.tuple_write+1]])

class World(cbc.World):
 def __init__(self,animations,records,row):
  self.animations,self.records=animations,records;self.nodes=[];self.next_id=1;self.random=skill.old.Random(12345);self.phase=self.passes=0;self.slow=row['slow'];self.alt=row.get('alternative',False);self.events=[];self.bodies={};self.row=row;self.local=row['local'];self.queued=False;self.queue_frame=None
  for slot in sorted([row['actor']]+([pair(row['actor'])]if row['present']else[])):self.bodies[slot]=Body(self,slot,row.get('dead',False)and slot!=row['actor'])
  if row.get('busy'):
   b=self.bodies[pair(row['actor'])];b.actions=[35,38,-1];b.read=0;b.write=1;b.busy=1;b.state=35
 def queue(self):
  r=self.row;a=self.bodies[r['actor']];p=pair(a.slot);b=self.bodies.get(p)
  if b and b.busy:return 'waiting'
  reset=a.slot==self.local and(r['mode']==0 or r['opaque']!=-1);a.paired=p;a.actions=[39]+([218]if reset else[])+[66,65,-1];a.write=len(a.actions)-2;a.read=0;a.busy=1;a.tuples=([[-2,0,0,0]]if reset else[])+[[p,0,0,0],[-1,0,0,0],[-1,0,0,0]];a.tuple_write=len(a.tuples)-1;a.tuple_read=0;a.msg=0x5743 if r['mode']==0 else 0x5742
  if r['mode']==0:
   if not b:return 'absent'
   if b.flags&2:b.speed=1.;b.counter=b.escape=0;b.skill=0;b.read=0;b.write=-1;b.actions=[0,-1];b.tuples=[[-1,0,0,0]];b.tuple_read=0
   b.effect=0xcd;b.actions=b.actions[:b.write+1]+[78,51,49,-1];b.write+=3;b.busy=1
  else:
   if not b:b=Body(self,p,fresh=True);self.bodies[p]=b
   b.resource=100061;b.value=r['value'];b.vitals=r['vitals'][:];b.flags=r['status'];b.saved=int(p==self.local or p==pair(self.local));b.meta=[r['status']>>(24+i)&1 for i in range(4)];b.position=list(layout[p]['target']);b.scale=[0.,0.];b.state=0;b.actions=[78,52,-1];b.read=0;b.write=1;b.tuples=[[-1,0,0,0]];b.tuple_read=0;b.busy=1;b.effect=0xcc
  a.state=a.actions[0];self.queued=True;self.queue_frame=self.passes;return 'queued'
 def step_effect(self,n):
  if n['kind']=='pet-transition':
   if n['parent']['deleted']:n['deleted']=True
   n['owner'].animate(n,0)
  else:super().step_effect(n)
 def project(self):
  fields=['graphicIndex','drawOffsetX','drawOffsetY','nextFrame','delay','signal','lastAction','lastResource','lastFacing','mode','attachmentX','attachmentY']
  return dict(phase=self.phase,bodies=[b.project_pet()for _,b in sorted(self.bodies.items())],nodes=[dict(id=n['id'],kind=n['kind'],parentId=n['parent']['id']if n['parent']else None,deleted=n['deleted'],priority=n['priority'],drawPriority=n['drawPriority'],position=(n['owner'].position[:]if n['kind']=='body'else n['position'][:]),screen=n['screen'][:],state=n['owner'].state if n['kind']=='body'else n['state'],resourceId=n['owner'].resource if n['kind']=='body'else n['resource'],scale=n['owner'].scale[:]if n['kind']=='body'else[1,1],actorFlags=n['owner'].actor_flags if n['kind']=='body'else n['flags'],animation={k:n['q'][k]for k in fields})for n in self.nodes],cacheEvents=copy.deepcopy([e for e in self.events if e['kind']=='battle-pet-cache']))
 def step(self):
  self.events=[];queued=self.queue()if not self.queued else None;i=0
  while i<len(self.nodes):
   n=self.nodes[i];owner=n['owner'];flags=owner.actor_flags if n['kind']=='body'else n['flags']
   if flags&0x40000 and self.slow and self.phase:i+=1;continue
   if n['deleted']:self.nodes.pop(i);continue
   if n['kind']=='body':previous=n['screen'][:];owner.body_step();self.after_body(owner,previous);owner.screen(n);owner.update()
   else:self.step_effect(n);owner.screen(n)
   i=self.nodes.index(n)+1
  self.phase=(self.phase+1)%4;self.passes+=1;return dict(self.project(),queueResult=queued)

def render(w,selector):
 p=w.project();nodes=p['nodes'];depth=skill.scene.pointer_sort([dict(id=n['id'],y=n['screen'][1],alternateY=0,flags=n['actorFlags'],depthKey=0)for n in nodes if n['actorFlags']&0x20000]);priorities={v:(i+9)&255 for i,v in enumerate(depth)};commands=[];skipped=[]
 for n in nodes:
  flags=n['actorFlags'];q=n['animation'];reason='renderer-filter'if flags&0x8000 and selector==0 or flags&0x10000 and selector==1 else'graphic-missing'if q['graphicIndex']==-1 else'deleted'if n['deleted']else'hidden'if flags&2 else None
  if reason:skipped.append(dict(id=n['id'],reason=reason));continue
  if flags&0x100000:return dict(unavailable='LEGACY_BATTLE_FRAME_DRAW_STYLE')
  scale=n['scale'];commands.append(dict(id=n['id'],kind=n['kind'],index=q['graphicIndex'],flags=0 if n['kind']=='body'else 4,x=n['screen'][0]+int(q['drawOffsetX']*scale[0]),y=n['screen'][1]+int(q['drawOffsetY']*scale[1]),priority=priorities.get(n['id'],n['drawPriority']),**({'scale':scale}if scale!=[1,1]else{})))
 bg=next(g for g in skill.scene.IMAGES.values()if g['resource']==1000);commands.append(dict(id=None,kind='background',index=bg['index'],flags=0,x=320+bg['origin'][0],y=240+bg['origin'][1],priority=0))
 return dict(depthOrder=depth,skipped=skipped,commands=commands,rgbaSha256=skill.scene.raster(commands))

def main():
 animations,records,files=fixtures();rows=[]
 for slot in[0,5,10,15]:
  for mode in[0,1]:rows.append(dict(name=f'MON-{slot}-{mode}',actor=slot,local=slot,present=True,mode=mode,opaque=0,value=-17,vitals=[61,90,7,12],status=0x05000001,slow=False))
 rows.extend([dict(rows[1],name='summon-fresh',present=False),dict(rows[1],name='summon-opaque-minus1',opaque=-1),dict(rows[1],name='summon-reuse-busy',busy=True),dict(rows[0],name='withdraw-dead',dead=True),dict(rows[1],name='summon-quarter',slow=True),dict(rows[0],name='withdraw-quarter',slow=True),dict(rows[1],name='summon-alternate-unavailable',alternative=True),dict(rows[1],name='nonlocal-same-team',local=1)])
 traces=[]
 for row in rows:
  w=World(animations,records,row);frames=[];renders=[]
  for _ in range(1000):
   frames.append(w.step());renders.append([render(w,0),render(w,1)])
   if w.queued and all(not b.busy for b in w.bodies.values())and all(n['kind']=='body'for n in w.nodes):break
  assert w.queued and all(not b.busy for b in w.bodies.values()),row['name'];traces.append(dict(row,frames=frames,renders=renders,queueFrame=w.queue_frame))
 out=dict(schema='moli.original-pet-transition-reference-stage196.v1',authority='Independent source equations, original animation/pixel fixtures; portable nearest policy not original DDRAW/D3D pixel equivalence',files=files,geometry=records,traces=traces,counts=dict(scenes=len(traces),frames=sum(len(r['frames'])for r in traces)));(A/'original-vectors.json').write_text(json.dumps(out,separators=(',',':'))+'\n');print(json.dumps(out['counts']))
if __name__=='__main__':main()
