#!/usr/bin/env python3
"""Original independent source70/mapping/compound queue/scene reference; no product imports."""
from pathlib import Path
import importlib.util,json,math,struct,hashlib
A=Path(__file__).resolve().parent

def load(name,path):
 s=importlib.util.spec_from_file_location(name,path);m=importlib.util.module_from_spec(s);s.loader.exec_module(m);return m
scene=load('ride_scene',A.parent/'game-legacy-scene-frame-v1/generate_vectors.py');clock=load('ride_clock',A.parent/'game-input-runtime-v1/generate_vectors.py')
RANGES=[(100000,0x1874e,0x1bd50),(0x1879a,0x18848,0x1bd6c),(0x19a28,0x19ad6,0x1bd88),(0x19b22,0x19bd0,0x1bda4),(0x19e10,0x19ebe,0x1bdc0),(0x19f0a,0x19fb8,0x1bddc)]
def resource(n):
 for lo,hi,b in RANGES:
  if lo<=n<hi:q,r=divmod(n-lo,25);return b+4*q+r//6
 return {0x18a24:0x1bdf9,0x18a25:0x1bdf8}.get(n,n)
def action(n,k):
 if 114000<=n<=114169:
  table={0:0,1:1,2:3,3:3,4:3,5:5,6:5,8:8,9:9,10:8};return dict(action=table.get(k,0),childAction=k if k in table else 0)
 return dict(action=11 if 100000<=n<0x18a88 or 0x19a28<=n<0x1a131 or n in [0x18a24,0x18a25]else 0,childAction=k)
def plan(state,c,ax,ay):
 original=c
 if state==2 and not c:
  for c in range(16):
   if (c-15)**2-225<=ay:break
 h=(c-15)**2-225
 if state==1:
  if c>15 and ay<=h:h=ay
  x=int(ax*original/30)
 else:
  if c>15 and h>=0:h=0
  x=ax-int(ax*original/30)
 return dict(state=state,counter=c,offset=[x,h],effectResource=110095+state,startSound=(465 if state==1 else 463)if not c else None)
def outcome(state,c,h,ay):
 done=(c+1>=16 and h>=ay)if state==1 else(c+1>15 and h>=0)
 return dict(state=0 if done else state,counter=c+1,complete=done,sound=(462 if state==1 else 457)if done else None)
def b62(n):
 s=''
 while n or not s:s='0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'[n%62]+s;n//=62
 return s
def actions(definitions,exit=False):return ('Hx! '+','.join(f'{b62(d["id"])}|99|-99|70|7|{-1 if exit else d["mount"]}|999|0'for d in definitions)+' ').encode()
def main():
 resource_cases=[dict(input=n,expected=resource(n))for n in sorted({-2147483648,-1,0,99999,0x18a24,0x18a25,2147483647}|{n for a,b,_ in RANGES for n in range(a-1,b+1)})]
 action_cases=[dict(resource=n,action=k,expected=action(n,k))for n in [99999,100001,0x18a24,0x18a25,0x19a28,0x1a130,0x1a131,110350,114000,114001,114169,114170]for k in range(-1,21)]
 plans=[];outcomes=[]
 for state in [1,2]:
  for c in range(41):
   for ax,ay in [(0,0),(6,-30),(-4,-50),(8,-10),(-12,-300),(9,20)]:
    p=plan(state,c,ax,ay);plans.append(dict(input=dict(state=state,counter=c,attachmentX=ax,attachmentY=ay),expected=p))
    for current in [-300,-225,-50,-30,-10,0,20]:outcomes.append(dict(input=[state,p['counter'],p['offset'][1],current],expected=outcome(state,p['counter'],p['offset'][1],current)))
 gs=scene.anime.groups();base=json.load(open(A.parent/'game-resource-runtime-v1/original-vectors.json'));original={r['path']:bytes.fromhex(r['bytesHex'])for r in base['files']};disk_index=original['Bin/AnimeInfo.bin'];disk=original['Bin/Anime.bin']
 for rid,kind in [(114000,'body'),(100006,'mount'),(100007,'deep'),(100008,'positive'),(110096,'effect'),(110097,'effect')]:
  blocks=[];physical=[]
  for face in range(8):
   for k in ([0,1,3,4,5,8,9,11]if kind=='body'else[0,1,3,5,8,9]):
    coords=[(6,-30),(-4,-50),(8,-10)]if kind=='mount'else[(0,-300)]*3 if kind=='deep'else[(2,20)]*3 if kind=='positive'else[(-1,-2),(1,0),(0,-1)]
    indices=[3,3,3]if kind=='positive'else[2,4,5]if kind in ['mount','deep']else[5,2,4]
    frames=[(indices[i],*coords[i],[17,10023,0][i])for i in range(3)]
    blocks.append(scene.anime.action(face,k,96,frames));physical.append(scene.anime.action(face,k,96,[(g+1000,x,y,e)for g,x,y,e in frames]))
  gs[0]['index']+=struct.pack('<IIHH',rid,len(gs[0]['animation']),len(blocks),0);gs[0]['animation']+=b''.join(blocks)
  disk_index+=struct.pack('<IIHH',rid,len(disk),len(blocks),0);disk+=b''.join(physical)
 files=[dict(path='Bin/AnimeInfo.bin',bytesHex=disk_index.hex()),dict(path='Bin/Anime.bin',bytesHex=disk.hex())];animations=scene.anime.parse(gs)
 before=json.load(open(A.parent/'game-legacy-scene-frame-v1/original-vectors.json'));defs=[dict(id=100,local=True,normal=100001,coordinates=[2,3],face=4,mount=100006,bodyFlags=0xb4),dict(id=200,local=False,normal=100001,coordinates=[2,3],face=2,mount=100007,bodyFlags=0x1034),dict(id=300,local=False,normal=80002,coordinates=[4,3],face=0,mount=100008,bodyFlags=0x434)]
 states={d['id']:dict(state=1,counter=0,bodyResource=resource(d['normal']),bodyAction=0,mountAction=0,body=scene.anime.initial(),mount=scene.anime.initial(),effect=None,effectResource=None)for d in defs};frames=[];model=scene.Scene();planes=scene.planes(1);base_raster=scene.raster
 for index in range(110):
  if index in [45,85]:
   for d in defs:
    s=states[d['id']];s.update(state=2 if index==45 else 1,counter=0,mountAction=1 if s['bodyAction']==1 else 0)
    if index==85:s['bodyResource']=resource(d['normal']);s['mount']=scene.anime.initial()
  roots=[];actor_rows=[];events=[];composites={}
  for d in defs:
   s=states[d['id']];state=s['state'];special=state in [1,2];screen=scene.project([n*64 for n in d['coordinates']],[128,192],[160,120],True);at=screen[:];calls=0;children=[];p=None
   def invoke(kind,rid,action,face,flags):
    nonlocal calls
    q,res=scene.anime.step(s[kind],scene.anime.ctx(resourceId=rid,action=action,facing=face,mode=0,staticFlip=False,soundScene=before['runtime']['soundScene'],actorFlags=flags),animations);s[kind]=q;calls+=1
    if res['event']:events.append(dict(**res['event'],actorId=d['id'],**({'child':kind if kind=='effect'else'child'}if kind!='body'else{}),screenPosition=[0,0]if kind!='body'else screen[:]))
    return q
   def cmd(q,where):
    if q['graphicIndex']<1000 or not q['geometry']:return None
    g=q['geometry'];xy=[scene.short(where[i]+q[['drawOffsetX','drawOffsetY'][i]]-g[['originX','originY'][i]])for i in range(2)]
    return scene.ordinary(q['graphicIndex'],*xy,10,q)
   if special:
    p=plan(state,s['counter'],s['mount']['attachmentX'],s['mount']['attachmentY']);at=[a+b for a,b in zip(screen,p['offset'])];s['bodyAction']=11
    q=invoke('body',s['bodyResource'],11,d['face'],d['bodyFlags']);mount=invoke('mount',d['mount'],s['mountAction'],d['face'],0x234)
    if s['effect']is None:s['effect']=scene.anime.initial();s['effectResource']=p['effectResource']
    effect=invoke('effect',s['effectResource'],0,0,0x34);children=[cmd(effect,screen),cmd(q,at),cmd(mount,screen)];next=outcome(state,p['counter'],p['offset'][1],mount['attachmentY']);s['state']=next['state'];s['counter']=next['counter']
    for sound in [p['startSound'],next['sound']]:
     if sound is not None:events.append(dict(kind='sound',value=sound,actorId=d['id'],screenPosition=screen[:]))
    if next['complete']:
     s['effect']=None;s['effectResource']=None;s['bodyAction']=0
     if state==2:s['bodyResource']=d['normal'];s['mount']=None
   else:
    q=invoke('body',s['bodyResource'],s['bodyAction'],d['face'],d['bodyFlags'])
    if s['mount']is not None:
     mount=invoke('mount',d['mount'],s['mountAction'],d['face'],0x234);at=[screen[0]+mount['attachmentX'],screen[1]+mount['attachmentY']];children=[cmd(q,at),cmd(mount,screen)]
    else:children=[cmd(q,at)]
   g=q['geometry'];anchor=[scene.short(at[i]+q[['drawOffsetX','drawOffsetY'][i]]-(g[['originX','originY'][i]]if g else 0))for i in range(2)];depth=[n*64 for n in d['coordinates']]
   if special:depth[1]=scene.f(depth[1]+scene.f(0.001))
   composites[d['id']]=[x for x in children if x];roots.append(dict(graphicIndex=q['graphicIndex'],position=depth,screenPosition=anchor,sortFlag=1 if d['local']and not special else 0,ordinal=len(roots),id=d['id'],command=dict(actorComposite=d['id'])))
   actor_rows.append(dict(id=d['id'],state=s['state'],counter=s['counter'],bodyResource=s['bodyResource'],bodyAction=s['bodyAction'],handler='source-ride'if special else'source-mounted'if s['mount']is not None else'ordinary',helperCalls=calls,screenPosition=at,child=s['mount']is not None,effect=s['effect']is not None,plan=p))
  # Existing independent scene merge emits one root token. Expand only after placement;
  # keep each expanded command's original owner ordinal for its draw-order receipts.
  def composite_raster(commands,w,h):
   expanded=[];owners=[]
   for j,c in enumerate(commands):
    cs=composites[c['actorComposite']]if 'actorComposite'in c else[c]
    for v in cs:expanded.append(v);owners.append(j)
   result=base_raster(expanded,w,h);result['drawOrder']=[owners[j]for j in result['drawOrder']];return result
  scene.raster=composite_raster
  tick=1000+math.ceil(index*clock.PERIOD);request=dict(camera=[128,192],center=[160,120],width=320,height=240,runtime=before['runtime'],tick=tick)
  try:raster=model.step(12,12,planes,1,dict(tileCenter=[2,3],drawPrimitives=False),request,roots)
  finally:scene.raster=base_raster
  order=scene.frame.source_sort([{k:r[k]for k in ['position','sortFlag','ordinal']}for r in roots]);submitted=[roots[j]['id']for j in order for c in composites[roots[j]['id']]if scene.graphic(roots[j]['graphicIndex'])['resourceId']!=1]
  frames.append(dict(update=index+1,tick=tick,actors=actor_rows,events=events,submittedActorIds=submitted,rgbaSha256=raster['rgbaSha256']))
 unit=bytes.fromhex(before['protocol']['beforePlainHex'][3]).rstrip(b' ')+b'\t'+('|'.join(map(str,[71,b62(200),2,3,2,100001,0,0,'OriginalRide','OriginalGuild',0,0,0,'OriginalTail',0,0,'']))).encode()+b'\t'+('|'.join(map(str,[b62(300),4,3,80002,0,'OriginalRideGraphic',0]))).encode()+b' '
 result=dict(schema='moli.actor-ride-vectors-stage173.v1',original_synthetic_only=True,authority='independent Python mapping/state/animation/compound traversal/source sort/map scene raster, no product imports or native execution',resourceCases=resource_cases,actionCases=action_cases,plans=plans,outcomes=outcomes,files=files,full=dict(definitions=defs,unitPlainHex=unit.hex(),entryPlainHex=actions(defs).hex(),exitPlainHex=actions(defs,True).hex(),frames=frames,exitAt=45,reenterAt=85,sourcePeriod=clock.PERIOD),reloadAt=20,closeAt=60)
 raw=(json.dumps(result,indent=2)+'\n').encode();(A/'original-vectors.json').write_bytes(raw);print(json.dumps(dict(mapping=len(resource_cases),actions=len(action_cases),plans=len(plans),outcomes=len(outcomes),source_frames=len(frames),unique_rasters=len({r['rgbaSha256']for r in frames}),bytes=len(raw),sha256=hashlib.sha256(raw).hexdigest())))
if __name__=='__main__':main()
