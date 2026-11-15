#!/usr/bin/env python3
"""Independent CBC/linked object source model; only original synthetic resources."""
from pathlib import Path
import importlib.util,json,struct
A=Path(__file__).resolve().parent
spec=importlib.util.spec_from_file_location('cbc_existing',A.parent/'game-battle-change-v1/generate_vectors.py');change=importlib.util.module_from_spec(spec);spec.loader.exec_module(change)
skill=change.skill;anime=change.anime;f=skill.f;layout=skill.layout
def mounted(n):
 for lo,hi,base in [(100000,0x1874e,0x1bd50),(0x1879a,0x18848,0x1bd6c),(0x19a28,0x19ad6,0x1bd88),(0x19b22,0x19bd0,0x1bda4),(0x19e10,0x19ebe,0x1bdc0),(0x19f0a,0x19fb8,0x1bddc)]:
  if lo<=n<hi:return base+(n-lo)//25*4+(n-lo)%25//6
 return 0x1bdf9 if n==0x18a24 else 0x1bdf8 if n==0x18a25 else n
def fixtures():
 _,records,prior=change.fixtures();files={r['path']:bytes.fromhex(r['bytesHex'])for r in prior};index=bytearray(files['Bin/AnimeInfo.bin']);data=bytearray(files['Bin/Anime.bin']);known={struct.unpack_from('<I',index,i)[0]for i in range(0,len(index),12)}
 for n in [100040,100041,100050,100051,114003,114004]:
  if n in known:continue
  frames=[1002,1004,1005]if n%2 else[1005,1003,1004]
  blocks=[anime.action(d,a,96,[(g,(i-1)*2,i-1,0)for i,g in enumerate(frames)])for d in range(8)for a in range(20)]
  index.extend(struct.pack('<IIHH',n,len(data),len(blocks),0));data.extend(b''.join(blocks))
 files.update({'Bin/AnimeInfo.bin':bytes(index),'Bin/Anime.bin':bytes(data)})
 return anime.parse([dict(index=bytes(index),animation=bytes(data),graphicBase=0)]),records,[dict(path=p,bytesHex=b.hex())for p,b in files.items()]
class Body(change.Body):
 def __init__(self,w,row):
  super().__init__(w,row['slot'],row.get('dead',False));self.links={};self.mask=self.mask_value=0
  if row.get('arriving'):
   self.position=list(layout[self.slot]['entry']);self.flags=0;self.face=1;self.body['q']=anime.initial();self.animate(self.body,0)
  self.rider(self.resource,row['cLinks'][0]);self.attachment(row['cLinks'][1])
  if row['cLinks'][0]>0:self.animate(self.body,0)
  self.body['screen']=list(layout[self.slot]['entry'])
  self.actions=row.get('queue',[])+[-1];self.write=len(self.actions)-2;self.read=0;self.state=self.actions[0]if self.write>=0 else 0;self.busy=int(self.write>=0)
 def screen(self,n):
  if n['kind']not in ['rider','attachment']:super().screen(n)
 def animate(self,n,mode):
  if n['kind']not in ['rider','attachment']:return super().animate(n,mode)
  q,out=anime.step(n['q'],anime.ctx(resourceId=n['resource'],action=n['action'],facing=n['face'],speedPercent=100,mode=mode,soundScene=10,actorFlags=n['flags']),self.animations);n['q']=q;return out['code']
 def linked(self,kind,resource):
  n=self.w.node(self,kind,resource=resource,flags=0x860040,position=[0,0],parent=self.body,action=0,face=self.face,anchor=self.slot,mask=0,maskValue=0);n['drawPriority']=9;self.animate(n,0);self.links[kind]=n;return n
 def remove(self,kind):
  n=self.links.pop(kind,None)
  if n:n['deleted']=True
 def rider(self,base,res):
  if res>0:
   n=self.links.get('rider')or self.linked('rider',mounted(base));n['resource']=mounted(base);self.resource=res
  else:self.remove('rider');self.resource=base
 def attachment(self,res):
  if res>0:n=self.links.get('attachment')or self.linked('attachment',res);n['resource']=res
  else:self.remove('attachment')
 def cbc(self,values):
  resource,hp,maxhp,mp,maxmp,rider,attachment=values;self.resource=resource;self.vitals=[hp,maxhp,mp,maxmp]
  if 'rider'in self.links and rider!=0:self.rider(resource,rider)
  self.attachment(attachment)
 def update(self):
  for kind in ['rider','attachment']:
   n=self.links.get(kind)
   if not n or n['deleted']:continue
   if self.w.bodies.get(n['anchor'])is not self:n['deleted']=True;continue
   hidden=2 if kind=='attachment'and self.flags&0x10002000 else 0
   if kind!='rider'or n['state']==0:
    n['alternateY']=self.body['screen'][1]
    action=({1:1,2:3,3:3,4:3,5:5,6:5,8:8,9:9,10:8}.get(self.action,0)if kind=='rider'else 3 if self.action==8 else 0)
    advancing=self.state!=0 or not(self.flags&0x60)and(action!=0 or bool(self.actor_flags&0x40))
    if self.state==0:action=0
    different=n['face']!=self.face;n['action']=action;n['face']=self.face
    if different or advancing:
     mode=0 if kind=='attachment'or action==5 else self.body['q']['mode'];code=self.animate(n,mode)
     if kind=='attachment'and code!=0:hidden=2
    base=self.links.get('rider',self.body)if kind=='attachment'else self.body;q=base['q'];n['screen']=[base['screen'][0]+int(q['attachmentX']*self.scale[0]),base['screen'][1]+int(q['attachmentY']*self.scale[0 if kind=='attachment'and base is not self.body else 1])]
   n['flags']=((n['flags']&0xffea7ffd)|0x820000|(self.actor_flags&0x118000)|(self.actor_flags&0x40002)|hidden)&0xffffffff;n['mask']=self.mask;n['maskValue']=self.mask_value
 def project(self):return dict(super().project(),drawFlagMask=self.mask,drawFlagValue=self.mask_value)
class World(change.World):
 def __init__(self,animations,records,row):
  self.animations,self.records=animations,records;self.nodes=[];self.next_id=1;self.random=skill.old.Random(12345);self.phase=self.passes=0;self.slow=row['slow'];self.events=[];self.bodies={};b=Body(self,row);self.bodies[b.slot]=b;self.row=row
 def step_effect(self,n):
  if n['kind']in ['rider','attachment']:
   if n['parent']['deleted']or self.bodies.get(n['anchor'])is not n['owner']:n['deleted']=True
  else:super().step_effect(n)
 def step(self):
  b=self.bodies[self.row['slot']]
  for action in self.row['changes']:
   if action['at']==self.passes:b.cbc(action['values'])
  i=0
  while i<len(self.nodes):
   n=self.nodes[i];owner=n['owner'];flags=owner.actor_flags if n['kind']=='body'else n['flags']
   if flags&0x40000 and self.slow and self.phase:i+=1;continue
   if n['deleted']:
    if owner.links.get(n['kind'])is n:owner.links.pop(n['kind'])
    self.nodes.pop(i);continue
   if n['kind']=='body':owner.body_step();owner.screen(n);owner.update()
   else:self.step_effect(n);owner.screen(n)
   i=self.nodes.index(n)+1
  self.phase=(self.phase+1)%4;self.passes+=1;return self.project()
 def project(self):
  p=super().project()
  for n,out in zip(self.nodes,p['nodes']):
   out['alternateY']=n.get('alternateY',0);out['resourceId']=n['owner'].resource if n['kind']=='body'else n['resource'];out['drawFlagMask']=n['owner'].mask if n['kind']=='body'else n.get('mask',4);out['drawFlagValue']=n['owner'].mask_value if n['kind']=='body'else n.get('maskValue',4)
   out['animation'].update({k:n['q'][k]for k in ['lastResource','lastFacing','mode','attachmentX','attachmentY']})
  return p
def render(w):
 nodes=w.project()['nodes'];depth=skill.scene.pointer_sort([dict(id=n['id'],y=n['screen'][1],alternateY=n['alternateY'],flags=n['actorFlags'],depthKey=0)for n in nodes if n['actorFlags']&0x20000]);priorities={n:(i+9)&255 for i,n in enumerate(depth)};commands=[];skipped=[]
 for n in nodes:
  q=n['animation'];reason='graphic-missing'if q['graphicIndex']==-1 else'deleted'if n['deleted']else'hidden'if n['actorFlags']&2 else None
  if reason:skipped.append(dict(id=n['id'],reason=reason));continue
  mask=n['drawFlagMask'];drawflags=(w.nodes[next(i for i,x in enumerate(w.nodes)if x['id']==n['id'])]['q']['drawFlags']&~mask)|(n['drawFlagValue']&mask)
  commands.append(dict(id=n['id'],kind=n['kind'],index=q['graphicIndex'],flags=drawflags,x=n['screen'][0]+q['drawOffsetX'],y=n['screen'][1]+q['drawOffsetY'],priority=priorities.get(n['id'],n['drawPriority'])))
 bg=next(g for g in skill.scene.IMAGES.values()if g['resource']==1000);commands.append(dict(id=None,kind='background',index=bg['index'],flags=0,x=320+bg['origin'][0],y=240+bg['origin'][1],priority=0))
 return dict(depthOrder=depth,commands=commands,skipped=skipped,rgbaSha256=skill.scene.raster(commands),drawOrder=[commands[i]['id']for i in sorted(range(len(commands)),key=lambda i:(commands[i]['priority'],-i))])
def main():
 animations,records,files=fixtures();rows=[]
 def row(name,slot=0,links=None,changes=None,**kw):return dict(name=name,slot=slot,cLinks=links or[0,0],changes=changes or[dict(at=0,values=[100030,61,90,7,12,0,0])],slow=False,frames=30,**kw)
 for slot in range(22):rows.append(row('CBC-slot-'+str(slot),slot))
 for links in [[0,0],[100040,0],[0,100050],[100040,100050]]:
  name='links-'+str(links);rows.append(row(name,10,links,[dict(at=0,values=[100030,61,90,7,12,100041,100051])]))
 rows.extend([row('rider-zero-preserves-child',links=[100040,100050],changes=[dict(at=0,values=[100030,-7,-10,-3,-4,0,0])]),row('rider-negative-removes',links=[100040,100050],changes=[dict(at=0,values=[100030,2147483647,-2147483648,0,-1,-1,-1])]),row('repeated-create-update-remove',changes=[dict(at=0,values=[100030,70,100,10,10,100041,100050]),dict(at=5,values=[100021,50,100,8,10,100040,100051]),dict(at=10,values=[100030,40,100,6,10,0,0])]),row('rider-and-attachment-follow-arrival',links=[100040,100050],changes=[dict(at=10,values=[100030,60,100,7,10,100041,100051])],arriving=True,queue=[2]),row('attachment-parent-dead',changes=[dict(at=0,values=[100030,0,100,7,10,0,100050])],dead=True)])
 slow=row('quarter-linked-arrival',links=[100040,100050],changes=[dict(at=8,values=[100030,63,100,9,10,100041,100051])],arriving=True,queue=[2]);slow.update(slow=True,frames=80);rows.append(slow)
 traces=[]
 for r in rows:
  w=World(animations,records,r);states=[];renders=[]
  for i in range(r['frames']):states.append(w.step());renders.append(render(w))
  traces.append(dict(r,states=states,renders=renders))
 out=dict(schema='moli.original-battle-character-change-reference-stage194.v1',authority='Independent static-source Python model and original synthetic raster; no product imports or original execution',files=files,geometry=records,traces=traces,frames=sum(len(t['states'])for t in traces));(A/'original-vectors.json').write_text(json.dumps(out,separators=(',',':'))+'\n');print(json.dumps(dict(cases=len(traces),frames=out['frames'])))
if __name__=='__main__':main()
