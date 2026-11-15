#!/usr/bin/env python3
"""Independent fixed37c4 RID0 producer/body221 equations. No product imports."""
from pathlib import Path
import copy,importlib.util,json,struct,sys
sys.dont_write_bytecode=True
A=Path(__file__).resolve().parent;R=A.parent.parent;P=R/'build/analysis/game-battle-attached-rid-v1'
s=importlib.util.spec_from_file_location('rid_prior',A.parent/'game-battle-pair73-v1/generate_vectors.py');prior=importlib.util.module_from_spec(s);s.loader.exec_module(prior)
s2=importlib.util.spec_from_file_location('rid_special_pairs',A.parent/'game-battle-special-pairs-v1/generate_vectors.py');specialPairs=importlib.util.module_from_spec(s2);s2.loader.exec_module(specialPairs)
skill=prior.skill;anime=prior.anime;digest=prior.digest;f=prior.f;layout=skill.layout
# Find retained casting projection without requiring its more specialized body lookups.
cast=next(c for c in prior.World.__mro__ if c.__dict__.get('project_casting')and c.__dict__['project_casting'].__code__.co_filename.endswith('game-battle-casting-v1/generate_vectors.py'))
BODY_KEYS={'state':'state','busy':'busy','position':'position','angle':'angle','facing':'face','animationAction':'action','speed':'speed','speedPercent':'percent','counter':'counter','dynamicFlags':'flags','actorFlags':'actor_flags','vitals':'vitals','skillStatus':'skill','mpCost':'cost','classCode':'category','resourceId':'resource','savedFlags':'saved','rawStatusFlags':'raw','value1d0':'value','statusMetadata':'meta','scale':'scale','actionRead':'read','actionWrite':'write','tupleRead':'tuple_read','tupleWrite':'tuple_write'}
NODE_KEYS=['id','kind','slot','parentId','deleted','priority','drawPriority','position','screen','state','counter','height','actorFlags','resourceId','alternateY','drawFlagMask','drawFlagValue','animation','scale']
def fixtures():
 _,g,fs=prior.fixtures();files={r['path']:bytes.fromhex(r['bytesHex'])for r in fs};ix=bytearray(files['Bin/AnimeInfo.bin']);data=bytearray(files['Bin/Anime.bin'])
 for resource in[100120,100121,100122,114018,100500]:
  blocks=[anime.action(d,a,96,[(v,-2,-(24 if resource==100121 else 4)+i,10002 if a==5 and i==1 else 0)for i,v in enumerate([1002,1004,1005])])for d in range(8)for a in range(20)];ix.extend(struct.pack('<IIHH',resource,len(data),len(blocks),0));data.extend(b''.join(blocks))
 files.update({'Bin/AnimeInfo.bin':bytes(ix),'Bin/Anime.bin':bytes(data)});return anime.parse([dict(index=bytes(ix),animation=bytes(data),graphicBase=0)]),g,[dict(path=p,bytesHex=b.hex())for p,b in files.items()]
ordinaryResultBody=next(c for c in prior.Body.__mro__ if c.__dict__.get('body_step')and c.__dict__['body_step'].__code__.co_filename.endswith('game-battle-physical-results-v1/generate_vectors.py'))
class Boundary(Exception):
 def __init__(self,code):self.code=code
class Body(prior.Body):
 def __init__(self,w,slot,resource=100114):
  super().__init__(w,slot,resource);self.disabled=False;self.rid=None;self.name=None
  if not getattr(w,'birthing',False)and slot in w.case.get('mounts',[w.case['caster']]):self.rider(resource,resource);self.links['rider']['screen']=w.offset[:];self.body['q']=anime.initial();self.animate(self.body,0)
 def indicator(self,first):
  if 'indicator'in self.links:self.links['indicator']['resource']=0x5736 if first else 0x5737;return
  n=self.w.node(self,'indicator',resource=0x5736 if first else 0x5737,flags=0x40000,parent=self.body);n['drawPriority']=200;self.animate(n,1);self.screen(n);self.links['indicator']=n
 def body_step(self):
  h=self.rid;s=self.state
  if s==1:
   self.percent=100;self.action=0
   if not self.flags&0x60:self.animate(self.body,0)
   return
  if h and s in[135,150,151,152,170,171,213,214,215,219,220,222]:raise Boundary('LEGACY_BATTLE_ATTACHED_RID_SHARED_POINTER_CONTEXT')
  if(h or getattr(self,'rid_created',False))and s==44 and self.flags&0x10000000:self.counter=44;self.state=159;return
  if(h or getattr(self,'rid_created',False))and s==159:raise Boundary('LEGACY_BATTLE_ATTACHED_RID_ELEMENT_CONTEXT')
  if h and s in[11,44]and not h['container']['deleted']and any(b and b.flags&2 for b in[h['first'],h['second']]):
   self.pop()
   if self.state==44:self.pop()
   return
  if s==14 and self.category not in[73,94,105,257,260,262]:return ordinaryResultBody.body_step(self)
  if s!=221:return super().body_step()
  if not h or not h['first']or h['container']['deleted']:raise Boundary('LEGACY_BATTLE_ATTACHED_RID_CONTEXT')
  a,b=self.tuples[self.tuple_read][2:];h['lastReadSlots']=[a,b];r=h['rider']
  if r not in self.w.nodes:raise Boundary('LEGACY_BATTLE_ATTACHED_RID_CHILD_REMOVED')
  if r['counter']==0:
   second=h['second'];self.w.bodies[b]=second;second.disabled=False;second.state=1;second.actor_flags&=~2;second.position=self.position[:];h['second']=None;self.body['ridGraphicMissing']=True
   for key in['shadow','status','special','indicator','attachment']:self.remove_link(key)
   second.reface();r['face']=second.face
  second=self.w.bodies[b];self.action=3;r['state']=1;r['action']=8;r['flags']|=0x14;r['screen']=[int(x)+o for x,o in zip(second.position,self.w.offset)];second.animate(second.body,0);y=int(prior.signed(r['counter']*r['counter'])/5)+second.body['q']['attachmentY'];r['screen'][1]+=y;r['counter']+=1
  if y<0:self.animate(r,0);return
  previous=self.w.bodies.get(a)
  if previous:previous.body['deleted']=True
  first=h['first'];self.w.bodies[a]=first;first.disabled=False;first.actor_flags&=~2;first.position=self.position[:];first.remove_link('attachment')
  if h['extra']>0:first.attachment(h['extra'])
  h['first']=None;first.reface();first.animate(first.body,0);first.state=first.actions[first.read];r['state']=r['counter']=0;r['deleted']=True;self.links.pop('rider',None);h['container']['deleted']=True;self.rid=None
  self.w.restore(self.w.bodies[a]);self.w.restore(self.w.bodies[b]);self.w.bodies[b].state=self.w.bodies[b].actions[self.w.bodies[b].read];self.body['deleted']=True;h['complete']=True
class World(prior.World):
 def __init__(self,animations,records,c):
  old=prior.Body;oldq=prior.queues;prior.Body=Body
  pending=[]
  if c['category']!=73:
   def selected(scenario):
    q=(prior.prior.queues if scenario['category']==260 else prior.prior.prior.queues if scenario['category']==105 else specialPairs.queues if scenario['category']in[94,257,262]else prior.prior.prior.prior.queues)(scenario)
    for row in q['rows']:
     if 'rememberedPosition'in row.get('assignments',{}):pending.append((row['slot'],row['assignments'].pop('rememberedPosition')))
    return q
   prior.queues=selected
  try:super().__init__(animations,records,c)
  finally:prior.Body=old;prior.queues=oldq
  for slot,position in pending:self.bodies[slot].remember=position[:]
  self.handoffs=[]
  for slot in c.get('initialSlots',[]):
   if slot not in self.bodies:
    self.bodies[slot]=Body(self,slot,c['resource']);self.bodies[slot].vitals=[70,100,10,10]
    for t in self.bodies[slot].tuples:t[0]=-1
  for r in c['rids']:
   parent=self.bodies[r[1]];first,boxA=self.birth(r,True);rider=parent.links['rider'];rider['ridPresentation']=dict(nameBytes=list(r[4].encode('ascii')[:28]),value1d0=r[7],vitals=r[8:12]);rider['position']=[f(parent.position[0]+parent.body['q']['attachmentX']),parent.position[1]];second,boxB=self.birth(r,False)
   container=self.node(parent,'attached-rid-handoff');container.update(disabled=True,flags=0,drawPriority=0,position=[0,0],screen=self.offset[:])
   h=dict(container=container,parent=parent,rider=rider,first=first,second=second,firstId=first.body['id'],secondId=second.body['id'],slots=r[1:3],extra=r[6],boxes=boxA+boxB,complete=False,lastReadSlots=None);self.handoffs.append(h);parent.rid=h
   parent.actions.insert(parent.write+1,221);parent.write+=1;parent.busy=1;parent.tuples[parent.tuple_write]=[r[1],0,r[1],r[2]];parent.tuple_write+=1;parent.tuples[parent.tuple_write][0]=-1
 def birth(self,r,first):
  slot=r[1]if first else r[2];self.birthing=True;b=Body(self,slot,self.case['resource']);self.birthing=False
  # Constructors above are retained helpers; discard C-only setup for the actual anonymous433a10 object.
  for n in list(b.links.values()):self.nodes.remove(n)
  b.links={};b.children={};b.name=list((r[4]if first else r[13]).encode('ascii')[:28]);b.resource=100500;b.position=list(layout[slot]['entry']);b.face=1;b.angle=0.;b.speed=3.;b.flags=b.raw=b.saved=b.category=0;b.meta=[0]*4;b.vitals=None;b.body['q']=anime.initial();b.animate(b.body,0)
  b.resource=r[5]if first else r[14];b.value=r[7]if first else r[15];b.vitals=r[8:12]if first else r[16:20];b.flags=b.raw=(r[12]if first else r[20])&0xffffffff;b.position=list(layout[r[1]]['target']);b.body['screen']=b.position[:];b.disabled=True;b.rid_created=True;b.actor_flags|=2;b.meta=[(b.flags>>i)&1 for i in range(24,28)];b.saved=int(slot==self.local or slot==((self.local+5)%10 if self.local<10 else 10+(self.local-10+5)%10 if self.local<20 else self.local))
  boxes=[]
  for value in b.vitals:
   mask=self.random.next();boxes.append(dict(value=value,encoded=(value^mask)&0xffffffff,mask=mask,reads=0))
  b.speed=4. if b.flags&2 else 5.;b.actions=([11,38,44]if b.flags&2 else[7,11,10])+[-1];b.read=0;b.write=2;b.tuples=[[0,0,0,0]for _ in range(200)];b.tuple_read=b.tuple_write=0;b.busy=1;return b,boxes
 def step_effect(self,n):
  if n['kind']=='indicator':
   if n['parent']['deleted']:n['deleted']=True;return
   self.animate(n,0);n['position']=n['owner'].position[:];n['owner'].screen(n);return
  return super().step_effect(n)
 def restore(self,b):
  flags=b.flags
  for i in range(6):
   bit=16<<i
   if flags&bit:self.condition(b,0x1adfb+i)
   else:b.flags&=~bit
  b.scale=[f(1.3),f(1.3)]if flags&0x1000 else[1.,1.]
  if flags&0x400:b.indicator(True)
  else:b.remove_link('indicator')
  self.toggle(b,bool(flags&0x800))
 def step(self):
  self.submissions=[];i=0
  while i<len(self.nodes):
   n=self.nodes[i];b=n['owner'];flags=b.actor_flags if n['kind']=='body'else n['flags']
   if flags&0x40000 and self.slow and self.phase:i+=1;continue
   if n['deleted']:
    if b.links.get(n['kind'])is n:b.links.pop(n['kind'])
    self.nodes.pop(i);continue
   if n.get('disabled')or n['kind']=='body'and b.disabled:i+=1;continue
   if n['kind']=='body':previous=n['screen'][:];b.body_step();self.after_body(b,previous);b.screen(n);b.update()
   else:self.step_effect(n);b.screen(n)
   i=self.nodes.index(n)+1
  self.phase=(self.phase+1)%4;self.passes+=1
  if not self.slow or self.phase==0:self.offset=[self.random.range(-self.amplitude,self.amplitude),self.random.range(-self.amplitude,self.amplitude)]
  self.amplitude=min(self.amplitude+1,self.limit)if self.shake else max(0,self.amplitude-1)
  p=self.project_casting();depth=skill.scene.pointer_sort([dict(id=n['id'],y=n['screen'][1],alternateY=n['alternateY'],flags=n['actorFlags'],depthKey=0)for n in p['nodes']if n['actorFlags']&0x20000]);priorities={n:(i+9)&255 for i,n in enumerate(depth)}
  if not any(n['animation']['graphicIndex']==0 and not n['deleted']and not n['actorFlags']&2 for n in p['nodes']):
   for n in self.nodes:
    if n['id']in priorities:n['drawPriority']=priorities[n['id']]
  return self.project_casting()
 def project_casting(self):
  p=cast.project_casting(self);p['bodies']=[]
  if self.passes==0:p['background']=None
  for row,n in zip(p['nodes'],self.nodes):
   row['scale']=(n['owner'].scale[:]if n['kind']in['body','rider']else n.get('scale',[1,1]))
   if n.get('ridGraphicMissing'):row['animation']['graphicIndex']=-1
   if 'ridPresentation'in n:row['ridPresentation']=copy.deepcopy(n['ridPresentation'])
  p['registry']=[self.bodies[i].body['id']if i in self.bodies and self.bodies[i].body in self.nodes else None for i in range(22)];p['handoffs']=[dict(id=h['container']['id'],sourceId=h['parent'].body['id'],firstId=h['firstId'],secondId=h['secondId'],firstPointer=h['first'].body['id']if h['first']else None,secondPointer=h['second'].body['id']if h['second']else None,slots=h['slots'][:],lastReadSlots=h['lastReadSlots'],extraResource=h['extra'],complete=h['complete'],containerDeleted=h['container']['deleted'],birthIntegerBoxes=h['boxes'])for h in self.handoffs]
  p['poolBodies']=[dict(id=n['id'],callbackEnabled=not n['owner'].disabled,slot=n['owner'].slot,nameBytes=n['owner'].name,**{k:copy.deepcopy(getattr(n['owner'],v))for k,v in BODY_KEYS.items()},actions=n['owner'].actions+[0]*(200-len(n['owner'].actions)),tuples=[v for t in n['owner'].tuples for v in t])for n in self.nodes if n['kind']=='body']
  return {k:p[k]for k in['phase','seed','nodes','background','registry','handoffs','poolBodies']}
def rid(a=0,b=5,flagsA=0,flagsB=2,**kw):
 r=[0,a,b,0,kw.get('nameA','OriginalRider'),100120,kw.get('extra',0),123,40,100,8,10,flagsA,kw.get('nameB','OriginalMount'),100121,456,0,100,0,10,flagsB]
 if 'vitalsA'in kw:r[8:12]=kw['vitalsA']
 if 'vitalsB'in kw:r[16:20]=kw['vitalsB']
 return r
def cases(quick=False):
 out=[dict(prior.case('level-'+str(i),i),rids=[rid()])for i in(range(2)if quick else range(10))]
 if quick:return out
 variants=[('old-B-present',dict(initialSlots=[5])),('attachment',dict(rids=[rid(extra=100122)])),('A-dead',dict(rids=[rid(flagsA=2,flagsB=0)])),('both-dead',dict(rids=[rid(flagsA=2)])),('A-status',dict(rids=[rid(flagsA=0x1c30)])),('B-status',dict(rids=[rid(flagsB=0x1c32)])),('signed',dict(rids=[rid(vitalsA=[-7,100,-2147483648,10],vitalsB=[2147483647,100,-7,10])])),('long-name',dict(rids=[rid(nameA='OriginalNameABCDEFGHIJKLMNOPQRSTUVWXYZ')])),('offset',dict(offset=[11,-7])),('same-a-multiple',dict(rids=[rid(),rid(b=6)])),('same-a-b',dict(rids=[rid(b=0)])),('opposite',dict(caster=10,local=10,hits=[[10,0,1,12,None]],rids=[rid(a=10,b=15)])),('slot20',dict(caster=20,hits=[[20,10,1,12,None]],rids=[rid(a=20,b=21)])),('slot21',dict(caster=21,hits=[[21,0,1,12,None]],rids=[rid(a=21,b=20)])),('victim-replace',dict(mounts=[10],rids=[rid(a=10,b=15)])),('two-roots',dict(mounts=[0,10],rids=[rid(),rid(a=10,b=15)])),('element',dict(rids=[rid(flagsB=0x10000002)]))]
 for name,kw in variants:out.append(dict(prior.case(name),rids=[rid()],**kw)if 'rids'not in kw else dict(dict(prior.case(name),rids=[rid()]),**kw))
 for mask,name in[(0x800001,'RID3'),(0x201,'guard'),(0x2001,'reflect'),(0x21,'KO'),(8,'dodge'),(0,'zero-mask')]:out.append(dict(prior.case(name,mask=mask,guardian=12 if mask&512 else None),rids=[rid()]))
 for category in[0,5,6,73,81,84,87,94,105,257,258,259,260,262]:
  c=dict(prior.case('class-'+str(category)),category=category,rids=[rid()]);out.append(c)
 for name,kwargs in[('tcp-level0',{}),('tcp-level9',{'level':9}),('tcp-attachment',{'attachment':True}),('tcp-oldB',{'oldB':True}),('tcp-RID3',{'rid3':True}),('tcp-guard',{'guard':True})]:
  c=prior.case(name,kwargs.get('level',0),mask=0x800001 if kwargs.get('rid3')else 1,guardian=12 if kwargs.get('guard')else None);c.update(mounts=[10],rids=[rid(a=10,b=15,extra=100122 if kwargs.get('attachment')else 0)])
  if kwargs.get('oldB'):c['initialSlots']=[15]
  out.append(c)
 return out
def main(quick=False):
 animations,records,files=fixtures();traces=[];rgba=0
 for c in cases(quick):
  w=World(animations,records,c);initial=w.project_casting();states=[];rasters=[];boundary=None
  for i in range(700):
   try:w.step()
   except Boundary as e:boundary=dict(frame=i+1,code=e.code);break
   frame=w.project_casting();states.append(digest(frame))
   if any(n['animation']['graphicIndex']==0 and not n['deleted']and not n['actorFlags']&2 for n in frame['nodes']):boundary=dict(frame=i+1,code='LEGACY_BATTLE_FRAME_GEOMETRY');break
   if i<4 or i%43==0 or any(h['complete']and not old for h,old in zip(w.handoffs,completed))if i else True:
    for selector in[0,1]:rasters.append(dict(frame=i+1,selector=selector,**render_reference(w,selector)));rgba+=1
   completed=[h['complete']for h in w.handoffs]
   if w.stopped or all(not b.busy for b in w.bodies.values())and all(n['kind']in['body','status','rider','attachment','indicator','status-skill-overlay','status-skill-field']for n in w.nodes):break
  traces.append(dict(case=c,initial=initial,states=states,rasters=rasters,boundary=boundary,final=w.project_casting(),settled=all(not b.busy for b in w.bodies.values())));print(c['name'],len(states),traces[-1]['settled'],boundary,flush=True)
 dest=P/'quick-vectors.json'if quick else A/'original-vectors.json';out=dict(schema='moli.attached-rid-reference-stage219.v1',authority='Independent source equations and authored fixtures; no original execution',files=files,geometry=records,traces=traces,frames=sum(len(t['states'])for t in traces),rgbaFrames=rgba);dest.write_text(json.dumps(out,separators=(',',':'))+'\n');print(json.dumps(dict(traces=len(traces),frames=out['frames'],RGBA=rgba)),flush=True)
def render_reference(w,selector):
 p=w.project_casting();depth=skill.scene.pointer_sort([dict(id=n['id'],y=n['screen'][1],alternateY=n['alternateY'],flags=n['actorFlags'],depthKey=0)for n in p['nodes']if n['actorFlags']&0x20000]);priorities={n:(i+9)&255 for i,n in enumerate(depth)};commands=[];skipped=[]
 for n in p['nodes']:
  q=n['animation'];flags=n['actorFlags'];reason='renderer-filter'if(flags&0x8000 and selector==0 or flags&0x10000 and selector==1)else'graphic-missing'if q['graphicIndex']==-1 else'deleted'if n['deleted']else'hidden'if flags&2 else None
  if reason:skipped.append(dict(id=n['id'],reason=reason));continue
  scale=n['scale'];commands.append(dict(id=n['id'],kind=n['kind'],index=q['graphicIndex'],flags=(q['drawFlags']&~n['drawFlagMask'])|(n['drawFlagValue']&n['drawFlagMask']),x=n['screen'][0]+int(q['drawOffsetX']*scale[0]),y=n['screen'][1]+int(q['drawOffsetY']*scale[1]),priority=priorities.get(n['id'],n['drawPriority']),**({'scale':scale}if scale!=[1,1]else{})))
 bg=next(g for g in skill.scene.IMAGES.values()if g['resource']==1000);commands.append(dict(id=None,kind='background',index=bg['index'],flags=0,x=320+bg['origin'][0]+w.offset[0],y=240+bg['origin'][1]+w.offset[1],priority=0));plan=dict(depthOrder=depth,commands=commands,skipped=skipped,drawOrder=[commands[i]['id']for i in sorted(range(len(commands)),key=lambda i:(commands[i]['priority'],-i))]);return dict(planDigest=digest(plan),rgbaSha256=skill.scene.raster(commands))
if __name__=='__main__':main('--quick'in sys.argv)
