#!/usr/bin/env python3
"""Original source60/aux34 independent state, AP, helper, composite and full-scene reference."""
from pathlib import Path
import importlib.util,json,math,struct,hashlib
A=Path(__file__).resolve().parent

def load(name,path):
 s=importlib.util.spec_from_file_location(name,path);m=importlib.util.module_from_spec(s);s.loader.exec_module(m);return m
ride=load('attachment_ride',A.parent/'game-actor-ride-v1/generate_vectors.py');spin=load('attachment_spin',A.parent/'game-actor-spin-v1/generate_vectors.py');scene=ride.scene;clock=ride.clock

def plan(action,screen,body,mount):
 return dict(action=3 if action==8 else 0,screenPosition=[screen[i]+body[i]+(mount[i]if mount else 0)for i in range(2)])
def b62(n):return ride.b62(n)
def packet(defs,code,p1,p2=0):
 def val(v,d):return v(d)if callable(v)else v
 return ('Hx! '+','.join(f'{b62(d["id"])}|99|-99|{code}|{d["face"]}|{val(p1,d)}|{val(p2,d)}|0'for d in defs)+' ').encode()
def main():
 pure=[]
 for action in range(-1,21):
  for screen in [(0,0),(160,120),(-320,480),(32767,-32768)]:
   for body in [(0,0),(6,-5),(-12,8),(32767,-32768),(-8,-40)]:
    for mount in [None,(0,0),(6,-30),(-4,-50)]:pure.append(dict(input=dict(parentAction=action,screenPosition=screen,bodyAttachment=body,mountAttachment=mount),expected=plan(action,screen,body,mount)))
 base=json.load(open(A.parent/'game-resource-runtime-v1/original-vectors.json'));original={r['path']:bytes.fromhex(r['bytesHex'])for r in base['files']};gs=scene.anime.groups();disk_index=original['Bin/AnimeInfo.bin'];disk=original['Bin/Anime.bin'];ap_index=original['Bin/CrdInfo.bin'];ap_data=original['Bin/Crd.bin']
 for rid,kind in [(100010,'body'),(114001,'body'),(100006,'attach'),(100007,'mount'),(100008,'empty'),(100009,'missing'),(110096,'effect'),(110097,'effect')]:
  blocks=[];physical=[]
  for face in range(8):
   for k in ([]if kind=='empty'else[1]if kind=='missing'else[0,1,3,4,8,11]if kind=='body'else[0,1,3,8,10]if kind=='mount'else[0,3]):
    coords=[(-2,1),(3,-1),(1,2)]if kind=='attach'else[(6,-30),(-4,-50),(8,-10)]if kind=='mount'else[(-1,-2),(1,0),(0,-1)]
    indices=[4,5,2]if kind=='attach'else[2,3,4]if kind=='body'else[2,4,5]
    flags=face%4 if kind in ['body','attach']else 0
    frames=[(indices[i],*coords[i],[23,10029,0][i])for i in range(3)]
    blocks.append(scene.anime.action(face,k,96,frames,1,flags=flags));physical.append(scene.anime.action(face,k,96,[(n+1000,x,y,e)for n,x,y,e in frames],1,flags=flags))
  gs[0]['index']+=struct.pack('<IIHH',rid,len(gs[0]['animation']),len(blocks),1);gs[0]['animation']+=b''.join(blocks)
  disk_index+=struct.pack('<IIHH',rid,len(disk),len(blocks),1);disk+=b''.join(physical)
  if kind in ['body','attach','mount']:
   rows=[(n,5+i,-7-i)for i,n in enumerate([2,3,4,5])];gs[0]['attachmentIndex']+=struct.pack('<IIH',rid,len(gs[0]['attachmentData']),len(rows));gs[0]['attachmentData']+=b''.join(struct.pack('<Ihh',*r)for r in rows)
   ap_index+=struct.pack('<IIH',rid,len(ap_data),len(rows));ap_data+=b''.join(struct.pack('<Ihh',n+1000,x,y)for n,x,y in rows)
 files=[dict(path=p,bytesHex=b.hex())for p,b in [('Bin/AnimeInfo.bin',disk_index),('Bin/Anime.bin',disk),('Bin/CrdInfo.bin',ap_index),('Bin/Crd.bin',ap_data)]];animations=scene.anime.parse(gs)
 before=json.load(open(A.parent/'game-legacy-scene-frame-v1/original-vectors.json'));defs=[dict(id=100,local=True,normal=100010,coordinates=[2,3],face=4,attached=100006,bodyFlags=0xb4),dict(id=200,local=False,normal=100010,coordinates=[2,3],face=2,attached=100006,bodyFlags=0x1034),dict(id=300,local=False,normal=80002,coordinates=[4,3],face=0,attached=80004,bodyFlags=0x434)]
 # Every scheduled packet is a real source record, not an extra product timer/field.
 events=[dict(at=12,key='rest',plainHex=packet(defs,0,0).hex()),dict(at=24,key='empty',plainHex=packet([defs[1]],60,100010,100008).hex()),dict(at=30,key='missing',plainHex=packet([defs[1]],60,100010,100009).hex()),dict(at=36,key='restore',plainHex=packet([defs[1]],60,100010,100006).hex()),dict(at=40,key='ride',plainHex=packet(defs,70,100007).hex()),dict(at=78,key='exit',plainHex=packet(defs,70,-1).hex()),dict(at=116,key='spin',plainHex=packet(defs,80,114001).hex()),dict(at=510,key='detach',plainHex=packet(defs,60,lambda d:d['normal'],0).hex()),dict(at=520,key='reattach',plainHex=packet(defs,60,lambda d:d['normal'],80004).hex()),dict(at=532,key='remove',plainHex=packet(defs,60,lambda d:d['normal'],0).hex())]
 states={d['id']:dict(state=0,counter=0,initialFacing=None,face=d['face'],resource=d['normal'],action=8,body=scene.anime.initial(),mount=None,mountAction=0,attached=scene.anime.initial(),attachedResource=d['attached'],attachedAction=0,effect=None,effectResource=None)for d in defs};frames=[];model=scene.Scene();model.animations=animations;planes=scene.planes(1);base_raster=scene.raster
 for index in range(540):
  for event in events:
   if event['at']!=index:continue
   key=event['key']
   for d in defs:
    s=states[d['id']]
    if key=='rest':s['action']=0;s['body']['lastAction']=-1
    elif key in ['empty','missing','restore']and d['id']==200:s['attachedResource']={'empty':100008,'missing':100009,'restore':100006}[key]
    elif key=='ride':s.update(state=1,counter=0,resource=ride.resource(d['normal']),mount=scene.anime.initial(),mountAction=1 if s['action']==1 else 0)
    elif key=='exit':s.update(state=2,counter=0,mountAction=1 if s['action']==1 else 0)
    elif key=='spin':s.update(state=3,counter=0,initialFacing=None,resource=114001)
    elif key in ['detach','remove']:s.update(resource=d['normal'],attached=None)
    elif key=='reattach':s.update(resource=d['normal'],attached=scene.anime.initial(),attachedResource=80004,attachedAction=0)
  roots=[];actor_rows=[];sounds=[];composites={}
  for d in defs:
   s=states[d['id']];state=s['state'];special=state!=0;base_screen=scene.project([n*64 for n in d['coordinates']],[128,192],[160,120],True);at=base_screen[:];calls=0;children=[];ride_plan=None;attach_plan=None;attached_code=None;queued=False;probe=None;body_mode=0
   def invoke(kind,rid,action,face,flags,mode=0):
    nonlocal calls
    q,res=scene.anime.step(s[kind],scene.anime.ctx(resourceId=rid,action=action,facing=face,mode=mode,staticFlip=False,soundScene=before['runtime']['soundScene'],actorFlags=flags),animations);s[kind]=q;calls+=1
    if res['event']:sounds.append(dict(**res['event'],actorId=d['id'],**({'child':'child'if kind=='mount'else'attachment'if kind=='attached'else'effect'}if kind!='body'else{}),screenPosition=[0,0]if kind!='body'else([int(v)for v in base_screen]if state==3 else base_screen[:])))
    return q,res['code']
   def cmd(q,where):
    if q['graphicIndex']<1000 or not q['geometry']:return None
    g=q['geometry'];xy=[scene.short(where[i]+q[['drawOffsetX','drawOffsetY'][i]]-g[['originX','originY'][i]])for i in range(2)];return scene.ordinary(q['graphicIndex'],*xy,10,q)
   if state in [1,2]:
    ride_plan=ride.plan(state,s['counter'],s['mount']['attachmentX'],s['mount']['attachmentY']);at=[a+b for a,b in zip(base_screen,ride_plan['offset'])];s['action']=11
    q,_=invoke('body',s['resource'],11,s['face'],d['bodyFlags']);mount,_=invoke('mount',100007,s['mountAction'],s['face'],0x234)
    if s['effect']is None:s['effect']=scene.anime.initial();s['effectResource']=ride_plan['effectResource']
    effect,_=invoke('effect',s['effectResource'],0,0,0x34);children=[cmd(effect,base_screen),cmd(q,at),cmd(mount,base_screen)];next=ride.outcome(state,ride_plan['counter'],ride_plan['offset'][1],mount['attachmentY']);s.update(state=next['state'],counter=next['counter'])
    for sound in [ride_plan['startSound'],next['sound']]:
     if sound is not None:sounds.append(dict(kind='sound',value=sound,actorId=d['id'],screenPosition=base_screen[:]))
    if next['complete']:
     s['effect']=None;s['effectResource']=None;s['action']=0
     if state==2:s['resource']=d['normal'];s['mount']=None
   elif state==3:
    p=spin.plan(s['counter'],s['initialFacing'],s['face']);s.update(initialFacing=p['initialFacing'],face=p['facingCode'],action=p['action']);at=[a+b for a,b in zip(base_screen,p['offset'])]
    if p['kind']=='finish-probe':
     _,probe=invoke('body',s['resource'],s['action'],s['face'],d['bodyFlags'],1)
     if probe==1:s.update(state=0,counter=0,action=0)
    q,_=invoke('body',s['resource'],s['action'],s['face'],d['bodyFlags']);s['counter']+=1;children=[cmd(q,at)]
   else:
    body_mode=0 if s['action']in [12,13,14,15,1,0,16,3,6]else 1
    q,_=invoke('body',s['resource'],s['action'],s['face'],d['bodyFlags'],body_mode);mount=None
    if s['mount']is not None:
     mount,_=invoke('mount',100007,s['mountAction'],s['face'],0x234,body_mode);at=[base_screen[0]+mount['attachmentX'],base_screen[1]+mount['attachmentY']]
    children=[cmd(q,at)]+([cmd(mount,base_screen)]if mount else[])
    if s['attached']is not None:
     attach_plan=plan(s['action'],base_screen,[q['attachmentX'],q['attachmentY']],[mount['attachmentX'],mount['attachmentY']]if mount else None);s['attachedAction']=attach_plan['action'];attached,attached_code=invoke('attached',s['attachedResource'],s['attachedAction'],s['face'],0x34)
     if attached_code==0:queued=True;children.insert(0,cmd(attached,attach_plan['screenPosition']))
   g=q['geometry'];anchor=[scene.short(at[i]+q[['drawOffsetX','drawOffsetY'][i]]-(g[['originX','originY'][i]]if g else 0))for i in range(2)];depth=[n*64 for n in d['coordinates']]
   if state in [1,2]:depth[1]=scene.f(depth[1]+scene.f(0.001))
   composites[d['id']]=[c for c in children if c];roots.append(dict(graphicIndex=q['graphicIndex'],position=depth,screenPosition=anchor,sortFlag=1 if d['local']and not special else 0,ordinal=len(roots),id=d['id'],command=dict(actorComposite=d['id'])))
   attachment=s['attached'];actor_rows.append(dict(id=d['id'],state=s['state'],counter=s['counter'],face=s['face'],bodyResource=s['resource'],bodyAction=s['action'],handler='source-ride'if state in[1,2]else'source-spin'if state==3 else'source-mounted'if s['mount']is not None else'ordinary',helperCalls=calls,attachmentUpdated=attach_plan is not None,attachmentPlan=attach_plan,attachmentCode=attached_code,attachmentQueued=queued,attachmentPresent=attachment is not None,attachmentAction=s['attachedAction']if attachment is not None else None,attachmentNextFrame=attachment['nextFrame']if attachment else None,attachmentGraphic=attachment['graphicIndex']if attachment else None,screenPosition=at))
  def composite_raster(commands,w,h):
   expanded=[];owners=[]
   for j,c in enumerate(commands):
    for v in composites[c['actorComposite']]if 'actorComposite'in c else[c]:expanded.append(v);owners.append(j)
   result=base_raster(expanded,w,h);result['drawOrder']=[owners[j]for j in result['drawOrder']];return result
  scene.raster=composite_raster;tick=1000+math.ceil(index*clock.PERIOD);request=dict(camera=[128,192],center=[160,120],width=320,height=240,runtime=before['runtime'],tick=tick)
  try:raster=model.step(12,12,planes,1,dict(tileCenter=[2,3],drawPrimitives=False),request,roots)
  finally:scene.raster=base_raster
  order=scene.frame.source_sort([{k:r[k]for k in ['position','sortFlag','ordinal']}for r in roots]);submitted=[roots[j]['id']for j in order for c in composites[roots[j]['id']]if scene.graphic(roots[j]['graphicIndex'])['resourceId']!=1]
  frames.append(dict(update=index+1,tick=tick,actors=actor_rows,events=sounds,submittedActorIds=submitted,rgbaSha256=raster['rgbaSha256']))
 initial=packet(defs,60,lambda d:d['normal'],lambda d:d['attached']).rstrip(b' ')+b' '+packet(defs,8,0)
 # Keep the two distinct source messages as distinct envelopes, not a made-up compound command.
 initial_messages=[packet(defs,60,lambda d:d['normal'],lambda d:d['attached']).hex(),packet(defs,8,0).hex()]
 unit=bytes.fromhex(before['protocol']['beforePlainHex'][3]).rstrip(b' ')+b'\t'+('|'.join(map(str,[71,b62(200),2,3,2,100010,0,0,'OriginalAttached','OriginalGuild',0,0,0,'OriginalTail',0,0,'']))).encode()+b'\t'+('|'.join(map(str,[b62(300),4,3,80002,0,'OriginalAttachedGraphic',0]))).encode()+b' '
 result=dict(schema='moli.actor-attachment-original-stage174.v1',original_synthetic_only=True,authority='independent Python source60/state/animation/AP/compound/native-sort/full-scene model, no product imports or vendor execution',purePlans=pure,files=files,full=dict(definitions=defs,unitPlainHex=unit.hex(),initialPlainHex=initial_messages,events=events,frames=frames,sourcePeriod=clock.PERIOD),reloadAt=20,closeAt=90)
 raw=(json.dumps(result,indent=2)+'\n').encode();(A/'original-vectors.json').write_bytes(raw);print(json.dumps(dict(pure=len(pure),source_frames=len(frames),unique_rasters=len({r['rgbaSha256']for r in frames}),bytes=len(raw),sha256=hashlib.sha256(raw).hexdigest())))
if __name__=='__main__':main()
