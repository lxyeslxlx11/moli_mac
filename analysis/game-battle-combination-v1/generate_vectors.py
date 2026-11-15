#!/usr/bin/env python3
"""Independent fixed37c4 CMB byte/queue/owner/1038/banner equations;no product imports."""
from pathlib import Path
from types import SimpleNamespace
import copy,importlib.util,json,struct,sys
sys.dont_write_bytecode=True
A=Path(__file__).resolve().parent;R=A.parent.parent;P=R/'build/analysis/game-battle-combination-v1'
s=importlib.util.spec_from_file_location('cmb_retained',A.parent/'game-battle-attached-rid-v1/generate_vectors.py');prior=importlib.util.module_from_spec(s);s.loader.exec_module(prior)
skill=prior.skill;anime=prior.anime;f=prior.f;digest=prior.digest;layout=prior.layout;signed=prior.prior.signed
X=[0,34,54,66,88,108,131,152,171,0];MIRROR=[0,8,7,6,5,4,3,2,1,9]
def fixtures():
 _,records,fs=prior.fixtures();files={r['path']:bytes.fromhex(r['bytesHex'])for r in fs};info=bytearray(files['Bin/GraphicInfo.bin']);pixels=bytearray(files['Bin/Graphic.bin']);nextid=max(r['index']for r in records)+1
 for i,resource in enumerate(list(range(0x5a63,0x5a6d))+list(range(0x5a76,0x5a7e))):
  w,h=12,9;pix=bytes(0 if(j+i)%5==0 else 17+(j+i)%3 for j in range(w*h));raw=b'RD\0\0'+struct.pack('<iiI',w,h,16+w*h)+pix;row=bytearray(40);struct.pack_into('<IIIiiii',row,0,nextid+i,len(pixels),len(raw),-3,-4,w,h);struct.pack_into('<I',row,36,resource);info.extend(row);pixels.extend(raw);records.append(dict(index=nextid+i,resourceId=resource,originX=-3,originY=-4,width=w,height=h));skill.scene.IMAGES[nextid+i]=dict(index=nextid+i,resource=resource,origin=[-3,-4],width=w,height=h,pixels=pix,embedded=None)
 files.update({'Bin/GraphicInfo.bin':bytes(info),'Bin/Graphic.bin':bytes(pixels)});return anime.parse([dict(index=files['Bin/AnimeInfo.bin'],animation=files['Bin/Anime.bin'],graphicBase=0)]),records,[dict(path=p,bytesHex=b.hex())for p,b in files.items()]
def queues(c):
 rows={};target=c['target'];aggregate=0;scratch=None;hits=[];order=[]
 def row(s):return rows.setdefault(s,dict(slot=s,actions=[],tuples=[],assignments={},unknownFourthCells=[]))
 def act(s,*values):row(s)['actions'].extend(values)
 def put(s,values):
  if values[3]is None:row(s)['unknownFourthCells'].append(len(row(s)['tuples']));values[3]=0
  row(s)['tuples'].append(values)
 act(target,0)
 for h in c['members']:
  actor,flags,amount=h[:3];rid=h[3]if flags&0x800000 else None
  if rid:scratch=rid[0]
  if not flags&0xe000:aggregate=signed(aggregate+amount)
  value=amount if flags&0xe000 else aggregate;original=[target,signed(flags),value,scratch];put(actor,original[:]);order.append(actor);hits.append(dict(actor=actor,target=target,flags=flags,amount=amount,value=value,rid=rid));row(actor)['assignments'].update(category=-1);act(actor,24,7,9,10,70,0)
  if rid:put(actor,[target,signed(flags),rid[0],rid[1]]);put(actor,[target,signed(flags),rid[2],0]);put(actor,original[:])
  act(actor,14)
  if not flags&0xe000:row(actor)['assignments']['partial']=1
  if not flags&0x40:
   if amount!=0 and flags&3:
    if flags&0x8000:act(target,127,0)
    elif flags&0x4000:act(target,126,0)
    elif flags&0x2000:act(actor,160 if flags&2 else 26);act(target,125,0)
  elif flags&3 and flags&0x2000:act(actor,32);act(target,125,0);act(actor,*([244]if actor==c['local']else[50,49]))
  act(actor,*([7,11,10]if not flags&0x20 or not flags&0x2000 else[11,44]))
 last=hits[-1];flags=last['flags'];amount=last['amount'];actor=last['actor'];row(actor)['assignments']['partial']=0
 if not flags&0xe000:
  if not flags&0x40:
   if amount!=0:
    if flags&3:act(target,160 if flags&2 else 26)
    if not flags&0x4000 and(target!=actor if not flags&0x2000 else target==actor):act(target,11)
   elif flags&8:
    if not flags&0x4000 and(target!=actor if not flags&0x2000 else target==actor):act(target,11)
  else:
   if flags&3:
    act(target,32)
    if not flags&0x2000:act(target,*([244]if target==c['local']else[50,49]))
    else:act(actor,*([244]if actor==c['local']else[50,49]))
   if amount!=0 or flags&8:
    if not flags&0x4000 and(target!=actor if not flags&0x2000 else target==actor):act(target,11)
  if flags&0x20 and(target!=actor if not flags&0x2000 else target==actor):act(target,44)
 else:row(target)['actions'][-1]=-1
 return dict(rows=list(rows.values()),target=target,aggregate=aggregate,order=order,last=last)
class Body(prior.Body):
 def __init__(self,w,slot,resource):super().__init__(w,slot,resource);self.partial=0;self.combo=False
 def pop(self):
  self.read+=1;self.state=self.actions[self.read]if self.read<=self.write and self.actions[self.read]!=-1 else 231
 def body_step(self):
  if self.state==-1:return
  if self.state==70:self.w.context['counter']+=1;self.pop();return
  if self.state in[125,126,127]:
   if not self.flags&0x60:self.animate(self.body,0)
   if self.skill==0:self.w.result_charge(self,self.state-125)
   self.pop();return
  if self.state!=14 or not self.combo:return super().body_step()
  self.action=5;self.percent=100;signal=self.body['q']['signal']
  if signal>9999:
   target,flags,value,_=self.tuples[self.tuple_read];flags&=0xffffffff;other=self.w.bodies[target];resources=[110000]if flags&4 else[0x1ae12]if flags&0x400 else[0x1adb1+self.w.random.range(0,2)];partial=signal<20000 and self.partial==1 and not flags&0x2000;full=(signal<20000 and self.partial!=1)or bool(flags&0x2000)
   other.frozen=0;other.category=-1;other.attacker=self;other.reaction_flags=flags;other.aim(self.position)
   if full:self.metadata();_,flags,value,_=self.tuples[self.tuple_read];flags&=0xffffffff
   if flags&0x108:
    if flags&8:other.state=29
    elif not full or other.after_image_enabled==0:other.after_image_enabled=1;other.state=29
   else:
    if not flags&0xc000 and value!=0:
     other.position=other.remember[:]
     if full and flags&0x2000:
      if flags&2:self.w.impact_node(self.body,0x1adb8)
      self.reaction_flags=0x2000
      if flags&0x20:self.flags|=2;self.aux=1;self.w.slow=True
     else:
      if flags&0x100000:other.remove_link('status');other.flags&=~0x20
      if flags&2:self.w.impact_node(other.body,0x1adb8)
      if not full:other.state=25
     for resource in resources:self.w.impact_node(other.body,resource)
     if not flags&0xe000 and full and flags&0x20:other.flags|=2;other.aux=1;self.w.slow=True
    if full:
     if flags&0x8000:other.pop();self.condition(other,flags)
     elif flags&0x4000:other.pop();self.condition(other,flags);other.vital_style(5,value);self.number_result(other,value,5,flags)
     elif flags&0x2000:
      self.pop();other.pop();self.condition(self,flags);self.vital(0,value)
      if value==0 and flags&0x10000000:self.w.message(other,0x57bb)
      else:self.number_result(self,value,6,flags)
      self.tuple_read+=1
     else:
      self.condition(other,flags);other.pop()
      if value==0:self.w.message(other,0x57bb if flags&0x10000000 else 0x573b)
      else:other.vital(0,value);self.w.number_style(other,value,6);self.w.message(other,0x57b6)if flags&2 else None
   if partial:self.w.context['counter']+=1;self.partial=0
   elif full and not flags&0x108:self.w.context['counter']+=1
   _,flags,amount,_=self.tuples[self.tuple_read]
   if not flags&8 and amount!=0:self.cooldown=(((other.flags>>1)&1)+1)*14
   self.body['q']['signal']=0
  if self.cooldown>0:self.cooldown-=1
  if self.cooldown==0:
   if self.finish==0:
    if self.animate(self.body,1)!=1:return
   elif self.finish>10:self.pop();self.tuple_read+=1;self.cooldown=self.finish=0;return
   self.finish+=1
class World(prior.World):
 def __init__(self,animations,records,c):
  self.sequence_cursor=0;self.sequence_used=False;self.direct=[];self.direct_used=False;self.animations,self.records=animations,records;self.nodes=[];self.next_id=1;self.random=skill.old.Random(12345);self.phase=self.passes=0;self.slow=False;self.events=[];self.bodies={};self.local=c['local'];self.alt=False;self.offset=c.get('offset',[0,0])[:];self.overlay_counter=self.overlay_direction=0;self.submissions=[];self.shake=self.amplitude=self.limit=0;self.case={**c,'caster':c['members'][0][0],'mounts':c.get('mounts',[])};self.field=None;self.used=False;self.phase2=False;self.stopped=False;self.handoffs=[];self.command_phase=1;self.context=None;self.wait_counter=0;self.recoveries=0
  self.manager=SimpleNamespace(slot=None,body=None,links={},screen=lambda n:None)
  for slot in sorted({c['target']}|{h[0]for h in c['members']}):
   b=Body(self,slot,c['resource']);self.bodies[slot]=b;b.vitals=[70,100,10,10];b.raw=c.get('flags',{}).get(str(slot),0);b.condition_scalar=0;b.level=-1
   if b.raw&0x1000:b.scale=[f(1.3),f(1.3)]
   for i in range(6):
    if b.raw&(16<<i):self.condition(b,0x1adfb+i)
   if b.raw&0x800:self.toggle(b,True)
   for t in b.tuples:t[0]=-1
  self.plan=queues(c)
  for r in self.plan['rows']:
   b=self.bodies[r['slot']];b.actions=r['actions']+[-1];b.read=0;b.write=len(r['actions'])-1;b.busy=int(bool(r['actions']));b.tuple_read=0;b.tuple_write=len(r['tuples']);b.combo=True
   for i,t in enumerate(r['tuples']):b.tuples[i]=t[:];b.tuples[i+1][0]=-1
   for k,v in r['assignments'].items():setattr(b,k,v)
  for slot in self.plan['order']:self.bodies[slot].state=self.bodies[slot].actions[0]
  self.context=dict(owner=1,counter=0,target=c['target'],order=self.plan['order'][:],aggregate=self.plan['aggregate'],lastFlags=self.plan['last']['flags'],lastActor=self.plan['last']['actor'],unknownFourthCells=[dict(slot=r['slot'],sourceBodyId=self.bodies[r['slot']].body['id'],cells=r['unknownFourthCells'][:])for r in self.plan['rows']if r['unknownFourthCells']],bannerCreated=False)
  for r in c.get('rids',[]):
   parent=self.bodies[r[1]];first,boxA=self.birth(r,True);rider=parent.links['rider'];rider['ridPresentation']=dict(nameBytes=list(r[4].encode('ascii')[:28]),value1d0=r[7],vitals=r[8:12]);rider['position']=[f(parent.position[0]+parent.body['q']['attachmentX']),parent.position[1]];second,boxB=self.birth(r,False);container=self.node(parent,'attached-rid-handoff');container.update(disabled=True,flags=0,drawPriority=0,position=[0,0],screen=self.offset[:])
   h=dict(container=container,parent=parent,rider=rider,first=first,second=second,firstId=first.body['id'],secondId=second.body['id'],slots=r[1:3],extra=r[6],boxes=boxA+boxB,complete=False,lastReadSlots=None);self.handoffs.append(h);parent.rid=h;parent.actions.insert(parent.write+1,221);parent.write+=1;parent.busy=1;parent.tuples[parent.tuple_write]=[r[1],0,r[1],r[2]];parent.tuple_write+=1;parent.tuples[parent.tuple_write][0]=-1
 def integer_read(self,b):
  b['reads']+=1
  if b['reads']>20:b['reads']=0;b['mask']=self.random.next();b['encoded']=(b['value']^b['mask'])&0xffffffff
  return b['value']
 def integer_increment(self,b):self.integer_read(b);b['value']=signed(b['value']+1);b['encoded']=(b['value']^b['mask'])&0xffffffff
 def box(self,value):
  mask=self.random.next();b=dict(value=value,encoded=(value^mask)&0xffffffff,mask=mask,reads=0);self.integer_read(b);return b
 def banner(self):
  count=min(10,len(self.plan['order']));reverse=self.context['lastActor']>9
  for i in range(10 if count==10 else 9):
   letter=MIRROR[i]if reverse else i;resource=count+0x5a62 if letter==0 else 0x5a7a if letter==8 else 0x5a7d if letter==9 else letter+0x5a75;g=next(r for r in self.records if r['resourceId']==resource);b=self.bodies[self.case['target']];n=self.node(b,'combination-banner',priority=11,resource=0,flags=2 if letter in[0,9]else 0,position=[f((X[4]if letter==9 else X[letter])+g['originX']+(-203 if reverse else 672)),f(g['originY']+(96 if reverse else 384)-(32 if letter==9 else 0))],manual=True,screenSpace=True)
   n.update(drawPriority=205,screen=[int(x)for x in n['position']],banner=dict(state=0,delay=i*4,lifetime=(8-letter)*4,angle=90 if reverse else 270,speed=18.,index=self.box(i),counter=dict(value=0,encoded=0,mask=0,reads=0)));n['q'].update(graphicIndex=g['index'],geometry={k:g[k]for k in['index','originX','originY','width','height']},drawOffsetX=0,drawOffsetY=0,drawFlags=0)
 def step_effect(self,n):
  if n['kind']!='combination-banner':return super().step_effect(n)
  b=n['banner'];s=b['state'];b['lifetime']+=1
  def move():
   a=f(270-b['angle']);n['position']=[f(n['position'][0]-skill.old.sine(f(a+90))*b['speed']),f(n['position'][1]+skill.old.sine(a)*b['speed'])];n['screen']=[int(v)for v in n['position']]
  if s==0:
   if b['delay']!=0:b['delay']-=1;return
   self.integer_increment(b['counter'])
   if self.integer_read(b['counter'])>60:b['state']+=1
  elif s==1:
   move();b['speed']=f(b['speed']-f(.7))
   if b['speed']<=0:b['state']+=1;b['counter']=self.box(0)
  elif s==2:
   self.integer_increment(b['counter'])
   if n['flags']==0:
    if b['lifetime']>240:n['deleted']=True
   elif self.integer_read(b['counter'])>50:n['flags']=0;b['state']+=1;b['speed']=10.;b['angle']=0.;self.integer_read(b['index'])
  elif s==3:
   move();self.integer_increment(b['counter']);b['speed']=f(b['speed']-f(.3))
   if b['speed']<=0:b['angle']=180.;b['state']+=1
  elif s==4:
   self.integer_increment(b['counter']);b['speed']=f(b['speed']+f(.3))
   if b['speed']>=10:b['state']+=1
   move()
  else:
   self.integer_increment(b['counter'])
   if b['lifetime']>240:n['deleted']=True
  n['resource']=b['state']
 def command_ready(self):
  for slot,b in sorted(self.bodies.items()):
   if b.saved&2 and b.aux==0 and b.state!=26:continue
   if b.busy:
    self.wait_counter+=1
    if self.wait_counter>7200:
     self.recoveries+=1;self.wait_counter=0
     for b in self.bodies.values():
      b.speed=1.;b.frozen=b.counter=b.escape=b.aux=b.skill=b.reaction_flags=b.reaction_count=b.cooldown=b.finish=b.partial=0;b.after_image_enabled=b.after_image_counter=0;b.read=0;b.write=1;b.actions=b.actions+[0]*(200-len(b.actions));b.actions[0:3]=[11,38,-1];b.tuple_read=b.tuple_write=0;b.tuples[0][0]=b.tuples[1][0]=-1;b.busy=1;b.state=11
    return False
   if b.position!=list(layout[slot]['target']):
    for action in[11,38]:
     b.write+=1
     while len(b.actions)<=b.write+1:b.actions.append(0)
     b.actions[b.write]=action;b.actions[b.write+1]=-1;b.busy=1
    b.state=b.actions[b.read];return False
  return True
 def step(self):
  x=self.context
  if self.command_phase==1 and x['counter']>=len(x['order']):x['counter']=0;self.command_phase=2
  elif self.command_phase==2:
   b=self.bodies[x['order'][x['counter']]]
   if b.state==0:b.pop()
   if x['counter']>=len(x['order'])-1:
    if not self.case.get('controlFlags',0)&0x404 and len(x['order'])>1:self.banner();x['bannerCreated']=True
    self.command_phase=3
  elif self.command_phase==3 and self.command_ready():
   b=self.bodies.get(self.case['target'])
   if b and not b.flags&2:b.reface()
   self.context=None;self.command_phase=4
   for b in self.bodies.values():
    if b.flags&2 or b.state==13:continue
    b.speed=1.;b.frozen=b.counter=b.escape=b.aux=b.skill=b.reaction_flags=b.reaction_count=b.cooldown=b.finish=b.partial=0;b.read=0;b.write=-1;b.actions[0:2]=[0,-1];b.actions=b.actions+[0]*(200-len(b.actions));b.tuple_read=b.tuple_write=0
    for t in b.tuples:t[0]=-1
    b.category=b.level=-1
  return super().step()
 def project_casting(self):
  p=prior.cast.project_casting(self);p['bodies']=[]
  for row,n in zip(p['nodes'],self.nodes):
   row['scale']=n['owner'].scale[:]if n['kind']in['body','rider']else n.get('scale',[1,1])
   if n['kind']=='combination-banner':row['combinationBanner']=copy.deepcopy(n['banner'])
   if n.get('ridGraphicMissing'):row['animation']['graphicIndex']=-1
   if 'ridPresentation'in n:row['ridPresentation']=copy.deepcopy(n['ridPresentation'])
  p['bodies']=[dict(slot=b.slot,**{k:copy.deepcopy(getattr(b,v))for k,v in prior.BODY_KEYS.items()},cooperativePending=getattr(b,'partial',0),nameBytes=getattr(b,'name',None),actions=b.actions+[0]*(200-len(b.actions)),tuples=[v for t in b.tuples for v in t])for _,b in sorted(self.bodies.items())]
  p['commandPhase']=self.command_phase;p['waitCounter']=self.wait_counter;p['contexts']=[copy.deepcopy(self.context)]if self.context else[]
  if self.passes==0:p['background']=None
  return {k:p[k]for k in['phase','seed','commandPhase','waitCounter','nodes','background','contexts','bodies']}
def case(name,members=None,target=10,**kw):return dict(dict(name=name,target=target,members=members or[[0,1,12],[1,1,7]],local=0,resource=100114),**kw)
def cases(quick=False):
 if quick:return[case('ordinary')]
 out=[case('local-exit',[[10,1,12],[11,0x41,7]],target=0),case('slot20',target=20),case('slot21-member',[[0,1,12],[21,1,7]]),case('scaled',flags={'0':0x1000,'1':0x1000,'10':0x1000}),case('target-status',flags={'10':32}),case('member-status',flags={'1':32}),case('ordinary'),case('single',[[0,1,12]]),case('three',[[0,1,12],[1,3,7],[2,1,9]]),case('reverse',[[10,1,12],[11,1,7]],target=0),case('count10',[[i,1,2]for i in range(10)]),case('count11',[[i,1,2]for i in range(10)]+[[20,1,2]]),case('suppress-400',controlFlags=0x400),case('suppress-4',controlFlags=4),case('offset',offset=[11,-7]),case('duplicate',[[0,1,12],[0,1,7]]),case('self',[[0,1,12]],target=0)]
 for flags,name in[(0,'plain'),(3,'critical'),(4,'impact4'),(0x400,'impact400'),(8,'dodge'),(0x100,'immune'),(0x108,'both-dodge'),(0x10000000,'zero-label'),(0x20,'KO'),(0x21,'hit-KO'),(0x40,'scatter-no-hit'),(0x41,'scatter'),(0x2001,'reflect'),(0x4001,'heal'),(0x8001,'skip'),(0x6003,'reflect-heal'),(0xc003,'skip-heal'),(0xe003,'all-E000'),(0x800001,'RID3')]:
  h=lambda actor:[actor,flags,0 if name=='zero-label'else 12]+([[100040,100041,100050]]if flags&0x800000 else[])
  out.extend([case(name,[h(0),[1,1,7]]),case(name+'-last',[[0,1,7],h(1)])])
 out.extend([case('attached-RID-actor',mounts=[1],rids=[prior.rid(a=1,b=6)]),case('attached-RID-victim',mounts=[10],rids=[prior.rid(a=10,b=15)]),case('RID3-plus-attached',[[0,0x800001,12,[100040,100041,100050]],[1,1,7]],mounts=[1],rids=[prior.rid(a=1,b=6)])])
 for value,name in[(0,'zero'),(-7,'negative'),(-2147483648,'min'),(2147483647,'max')]:out.append(case(name,[[0,1,value],[1,1,7]]))
 return out
def queue_vectors():
 out=[]
 for target,actors in[(10,[0,1]),(0,[10,11]),(20,[21,0]),(10,[0,0])]:
  for flags in[0,1,3,8,0x100,0x108,0x20,0x21,0x41,0x2001,0x4001,0x8001,0xe003,0x800001,0x10000000,0x10000001]:
   for value in[0,-7,12,2147483647]:
    c=case('queue',[[a,flags,value]+([[100040,100041,100050]]if flags&0x800000 else[])for a in actors],target=target);q=queues(c);fields=[50 if target==20 else 51 if target==21 else target]
    for h in c['members']:fields.extend([50 if h[0]==20 else 51 if h[0]==21 else h[0],signed(h[1]),h[2]]+(h[3]if h[1]&0x800000 else[]))
    fields.append(255);rows=[]
    for row in q['rows']:
     assignments={}
     if 'category'in row['assignments']:assignments.update(classCode=row['assignments']['category'],physicalFamily=1)
     if 'partial'in row['assignments']:assignments['cooperativePending']=row['assignments']['partial']
     rows.append(dict(slot=row['slot'],actions=row['actions'],tuples=row['tuples'],assignments=assignments,unknownFourthCells=row['unknownFourthCells']))
    out.append(dict(fields=fields,expected_digest=digest(rows)))
 return out
def main(quick=False):
 animations,records,files=fixtures();traces=[];rgba=0
 for c in cases(quick):
  w=World(animations,records,c);initial=w.project_casting();states=[];rasters=[];boundary=None
  for i in range(900 if c['name']in['duplicate','self']else 9000):
   w.step();frame=w.project_casting();states.append(digest(frame))
   if any(n['animation']['graphicIndex']==0 and not n['deleted']and not n['actorFlags']&2 for n in frame['nodes']):boundary=dict(frame=i+1,code='LEGACY_BATTLE_FRAME_GEOMETRY');break
   if i<4 or i%47==0:
    for selector in[0,1]:rasters.append(dict(frame=i+1,selector=selector,**prior.render_reference(w,selector)));rgba+=1
   if w.stopped or w.command_phase==4 and all(n['kind']in['body','status','rider','attachment']for n in w.nodes):break
  traces.append(dict(case=c,initial=initial,states=states,rasters=rasters,final=w.project_casting(),settled=w.command_phase==4,stopped=w.stopped,boundary=boundary,recoveries=w.recoveries));print(c['name'],len(states),w.command_phase,w.stopped,boundary,flush=True)
 out=dict(schema='moli.combination-reference-stage220.v1',authority='Independent native CMB and derived617B banner equations/authored assets;no product imports or original execution',files=files,geometry=records,queues=[]if quick else queue_vectors(),traces=traces,frames=sum(len(t['states'])for t in traces),rgbaFrames=rgba);dest=P/'quick-vectors.json'if quick else A/'original-vectors.json';dest.write_text(json.dumps(out,separators=(',',':'))+'\n');print(json.dumps(dict(scenarios=len(traces),states=out['frames'],RGBA=rgba)),flush=True)
if __name__=='__main__':main('--quick'in sys.argv)
