#!/usr/bin/env python3
"""Original independent status-word, previous-anchor and complete-scene model. No product imports."""
from pathlib import Path
import importlib.util,json,math,struct
A=Path(__file__).resolve().parent
def load(name,path):
 s=importlib.util.spec_from_file_location(name,path);m=importlib.util.module_from_spec(s);s.loader.exec_module(m);return m
old=load('presentation_attachment',A.parent/'game-actor-attachment-v1/generate_vectors.py');scene=old.scene;clock=old.clock
tables=json.load(open(A/'source-tables.json'));HEIGHT=tables['height']['values'];VARIANT=tables['variant']['sampled_prefix']
def height(r):return HEIGHT[(r-100000)//25]if 100000<=r<101000 else-88
def control(r):
 p,b,v,f=r['primary'],r['secondary'],r['variant'],r['forced'];a,x=r['action'],r['parameter'];mask=0;duration=parameter=None
 if not r['local']and a==40:
  if x<0:p&=0xebff
  else:p|=0x400;parameter=x
 elif not r['local']and a==41:
  f=x==1
  if f:p|=0x100
  elif r['mode']!=2:p&=0xfeff
 elif not r['local']and a in[42,44]:
  bit=0x4000 if a==42 else 0x8000
  if x<0:p&=65535^bit
  else:p|=bit;parameter=x
 elif a==45:mask=1;b=b|1 if x==1 else b&0xfffe
 elif a in[46,63,64]:
  mask=2
  if a==64 or(a==46 and x==0):b&=0xfffd;v=0
  else:b|=2;v=x
 elif a==47:mask=0x24;b|=mask
 elif a==48:mask=8;b=b|8 if x==1 else b&0xfff7
 elif a==49:mask=0x50;b|=mask
 elif a==99:mask=0x180;b|=mask;duration=x
 else:return None
 return dict(primary=p,secondary=b,variant=v,forced=f,secondaryWrites=mask,duration=duration,parameterValue=parameter)
def plan(r):
 p,b=r['primary'],r['secondary'];shadow=bool(r['bodyFlags']&0x80000)
 if shadow:p&=0x8400;b=(1 if b&8 else 0)|(4 if b&16 else 0)|(32 if b&64 else 0)
 resource=None
 if b&2:
  if not 0<=r['variant']<16:raise ValueError('LEGACY_PRESENTATION_VARIANT_UNSUPPORTED')
  resource=VARIANT[r['variant']]
 for bit,rid in [(0x400,110401),(0x8000,110402),(0x4000,110403)]:
  if p&bit:resource=rid
 transient=bool(b&4);visible=transient and resource is None
 if transient and not visible and not r['transientPresent']:raise ValueError('LEGACY_PRESENTATION_TRANSIENT_OWNER_REQUIRED')
 return dict(primary=p,secondary=b,primaryResource=resource,primaryShift=-17 if b&1 and not p&0xc400 else 0,transient=transient,transientVisible=visible,transientSound=437 if visible and not r['transientPresent']and b&32 else None,soundClearMask=64 if shadow else 32,expirationClearMask=16 if shadow else 4,sideResource=110414 if b&1 and not p&0xc400 else None,sideShift=0 if resource is None else 17)
def main():
 controls=[];plans=[];anchors=[]
 for local in[False,True]:
  for action in[40,41,42,44,45,46,47,48,49,50,63,64,99]:
   for parameter in[-2,-1,0,1,2,15,16]:
    for primary,secondary,forced,mode in[(0,0,False,0),(0xffff,0xffff,True,2),(0x100,0x28,False,1)]:
     r=dict(local=local,action=action,parameter=parameter,primary=primary,secondary=secondary,variant=3,forced=forced,mode=mode);controls.append(dict(input=r,expected=control(r)))
 for primary in[0,0x400,0x8000,0x4000,0xc400]:
  for secondary in[0,1,2,3,4,0x24,6,7,8,0x50,0x180]:
   for variant in[0,1,2,10,15,-1,16]:
    for body in[0x34,0x80034]:
     for present in[False,True]:
      r=dict(primary=primary,secondary=secondary,variant=variant,bodyFlags=body,transientPresent=present)
      try:plans.append(dict(input=r,expected=plan(r)))
      except ValueError as e:plans.append(dict(input=r,error=str(e)))
 for resource in[99999,*range(100000,101001),110401]:
  r=dict(parentResource=resource,screenX=160,screenY=120,previousOffsetX=-7,previousOffsetY=9,previousOriginX=-3,previousOriginY=2,shift=17);anchors.append(dict(input=r,expected=[173,107+height(resource)]))
 prior=json.load(open(A.parent/'game-actor-attachment-v1/original-vectors.json'));files={r['path']:bytes.fromhex(r['bytesHex'])for r in prior['files']};gs=scene.anime.groups();gs[0].update(index=files['Bin/AnimeInfo.bin'],animation=files['Bin/Anime.bin'],graphicBase=0,attachmentIndex=files['Bin/CrdInfo.bin'],attachmentData=files['Bin/Crd.bin'])
 for resource in[103100,*range(110401,110415)]:
  blocks=[]
  if resource!=110409:
   code=9 if resource==110410 else 0;flags=(resource-110401)%4;coords=[(-8,5),(7,-4),(2,6)]
   blocks=[scene.anime.action(0,code,96,[(1002+i,*coords[i],[31,10033,0][i])for i in range(3)],1,flags=flags)]
  gs[0]['index']+=struct.pack('<IIHH',resource,len(gs[0]['animation']),len(blocks),1);gs[0]['animation']+=b''.join(blocks)
 files.update({'Bin/AnimeInfo.bin':gs[0]['index'],'Bin/Anime.bin':gs[0]['animation']});animations=scene.anime.parse(gs)
 defs=[dict(id=100,local=True,resource=100010,face=4,coordinates=[2,3],bodyFlags=0xb4),dict(id=200,local=False,resource=100010,face=2,coordinates=[2,3],bodyFlags=0x1034),dict(id=300,local=False,resource=80002,face=0,coordinates=[4,3],bodyFlags=0x434)]
 def packet(ids,code,p=0):
  selected=[d for d in defs if d['id']in ids]
  return ('Hx! '+','.join(f'{old.b62(d["id"])}|{d["coordinates"][0]if code in[40,42,44]else 99}|{d["coordinates"][1]if code in[40,42,44]else-99}|{code}|{d["face"]}|{p}|0|0'for d in selected)+' ').encode().hex()
 initial=[old.packet(defs,60,lambda d:d['resource'],0).hex(),packet([100],45,1),packet([100],46,2),packet([200],47)]
 schedule=[(12,'hide',200,46,3),(20,'show',200,64,0),(30,'empty',100,46,10),(36,'missing',100,46,11),(42,'replace',100,46,15),(50,'clear-primary',100,64,0),(56,'clear-side',100,45,0),(65,'force42',200,42,0),(70,'force44',200,44,0),(75,'force40',200,40,0),(80,'clear42',200,42,-1),(85,'clear44',200,44,-1),(90,'clear40',200,40,-1),(96,'local-transient',100,47,0),(112,'local-hide',100,46,2),(130,'local-show',100,64,0),(145,'graphic-side',300,45,1),(146,'graphic-primary',300,46,5),(160,'graphic-gate',300,99,8),(230,'remote-side',200,45,1),(240,'zero-primary',200,63,0),(248,'zero-clear',200,64,0),(620,'remote-gate',200,99,4),(700,'local-gate',100,99,3)]
 events=[dict(at=at,key=key,plainHex=packet([id],code,p),id=id,code=code,parameter=p)for at,key,id,code,p in schedule]
 # The actual retained local C0 row has flag11=1; its primary low-byte40 precedes all actions.
 states={d['id']:dict(primary=0x40 if d['local']else 0,secondary=0,variant=0,forced=False,face=d['face'],body=scene.anime.initial(),icons={k:None for k in['primary','transient','side']})for d in defs}
 def apply(d,code,parameter):
  s=states[d['id']];c=control(dict(primary=s['primary'],secondary=s['secondary'],variant=s['variant'],forced=s['forced'],mode=0,local=d['local'],action=code,parameter=parameter));s.update({k:c[k]for k in['primary','secondary','variant','forced']})
  if not d['local']and code==40 and parameter>=0:s['body']['lastAction']=-1
 for id,code,p in[(100,45,1),(100,46,2),(200,47,0)]:apply(next(d for d in defs if d['id']==id),code,p)
 frames=[];model=scene.Scene();model.animations=animations;planes=scene.planes(1);base_raster=scene.raster;raster_cache={}
 before=json.load(open(A.parent/'game-legacy-scene-frame-v1/original-vectors.json'))
 for index in range(720):
  for event in events:
   if event['at']==index:apply(next(d for d in defs if d['id']==event['id']),event['code'],event['parameter'])
  roots=[];rows=[];sounds=[];composites={}
  for d in defs:
   s=states[d['id']];at=scene.project([n*64 for n in d['coordinates']],[128,192],[160,120],True)
   if s['secondary']&128:rows.append(dict(id=d['id'],blocked=True,reason='own-gate'if d['local']else'record-gate',secondary=s['secondary']));continue
   q,res=scene.anime.step(s['body'],scene.anime.ctx(resourceId=d['resource'],action=0,facing=s['face'],mode=0,staticFlip=not d['local'],actorFlags=d['bodyFlags'],soundScene=before['runtime']['soundScene']),animations);s['body']=q;calls=1
   if res['event']:sounds.append(dict(**res['event'],actorId=d['id'],screenPosition=at[:]))
   p=plan(dict(primary=s['primary'],secondary=s['secondary'],variant=s['variant'],bodyFlags=d['bodyFlags'],transientPresent=s['icons']['transient']is not None))
   for kind,rid in[('primary',p['primaryResource']),('side',p['sideResource'])]:
    if rid is None:s['icons'][kind]=None
    elif s['icons'][kind]is None:s['icons'][kind]=dict(resource=rid,q=scene.anime.initial(),counter=0)
    else:s['icons'][kind]['resource']=rid
   if not p['transient']:s['icons']['transient']=None
   elif p['transientVisible']and s['icons']['transient']is None:s['icons']['transient']=dict(resource=110413,q=scene.anime.initial(),counter=0)
   if p['transientSound']is not None:s['secondary']&=65535^p['soundClearMask'];sounds.append(dict(kind='sound',value=437,actorId=d['id'],child='transient-create',screenPosition=at[:]))
   children=[];iconrows=[]
   for kind in['primary','transient','side']:
    if kind=='side':
     transient=s['icons']['transient']
     if transient is not None:
      transient['counter']+=1
      if transient['counter']>600:s['secondary']&=65535^p['expirationClearMask']
    icon=s['icons'][kind]
    if icon is None or(kind=='transient'and not p['transientVisible']):continue
    prev=icon['q'];g=prev['geometry'];shift=p['primaryShift']if kind=='primary'else p['sideShift']if kind=='side'else 0
    pos=[at[0]+prev['drawOffsetX']-(g['originX']if g else 0)+shift,at[1]+height(d['resource'])+prev['drawOffsetY']-(g['originY']if g else 0)-20]
    iq,ir=scene.anime.step(prev,scene.anime.ctx(resourceId=icon['resource'],action=0,facing=0,mode=0,staticFlip=False,actorFlags=0x20,soundScene=before['runtime']['soundScene']),animations);icon['q']=iq;calls+=1
    if ir['event']:sounds.append(dict(**ir['event'],actorId=d['id'],child=kind,screenPosition=pos[:]))
    command=scene.ordinary(iq['graphicIndex'],scene.short(pos[0]),scene.short(pos[1]),10,iq)if iq['geometry']and iq['graphicIndex']>=1000 else None
    if command:children.append(command)
    iconrows.append(dict(kind=kind,screenPosition=pos,code=ir['code'],graphicIndex=iq['graphicIndex'],nextFrame=iq['nextFrame'],queued=True))
   g=q['geometry'];anchor=[scene.short(at[i]+q[['drawOffsetX','drawOffsetY'][i]]-(g[['originX','originY'][i]]if g else 0))for i in range(2)];body=scene.ordinary(q['graphicIndex'],*anchor,10,q)if g and q['graphicIndex']>=1000 else None
   composites[d['id']]=children+([body]if body else[]);roots.append(dict(graphicIndex=q['graphicIndex'],position=[n*64 for n in d['coordinates']],screenPosition=anchor,sortFlag=1 if d['local']else 0,ordinal=len(roots),id=d['id'],command=dict(actorComposite=d['id'])))
   rows.append(dict(id=d['id'],blocked=False,helperCalls=calls,primary=s['primary'],secondary=s['secondary'],icons=iconrows,transientCounter=s['icons']['transient']['counter']if s['icons']['transient']else None))
  def composite_raster(commands,w,h):
   expanded=[];owners=[]
   for j,c in enumerate(commands):
    for v in composites[c['actorComposite']]if 'actorComposite'in c else[c]:expanded.append(v);owners.append(j)
   key=json.dumps([expanded,owners,w,h],sort_keys=True)
   if key not in raster_cache:
    result=base_raster(expanded,w,h);result['drawOrder']=[owners[j]for j in result['drawOrder']];raster_cache[key]=result
   return raster_cache[key]
  scene.raster=composite_raster;tick=1000+math.ceil(index*clock.PERIOD);request=dict(camera=[128,192],center=[160,120],width=320,height=240,runtime=before['runtime'],tick=tick)
  try:raster=model.step(12,12,planes,1,dict(tileCenter=[2,3],drawPrimitives=False),request,roots)
  finally:scene.raster=base_raster
  order=scene.frame.source_sort([{k:r[k]for k in['position','sortFlag','ordinal']}for r in roots]);submitted=[roots[j]['id']for j in order for c in composites[roots[j]['id']]if scene.graphic(roots[j]['graphicIndex'])['resourceId']!=1]
  frames.append(dict(update=index+1,tick=tick,actors=rows,events=sounds,submittedActorIds=submitted,rgbaSha256=raster['rgbaSha256']))
 result=dict(schema='moli.actor-presentation-original-stage175.v1',original_synthetic_only=True,authority='independent Python status/control/previous-anchor/animation/composite/full scene; no product imports or native execution',controls=controls,plans=plans,anchors=anchors,files=[dict(path=p,bytesHex=b.hex())for p,b in files.items()],full=dict(definitions=defs,unitPlainHex=prior['full']['unitPlainHex'],initialPlainHex=initial,events=events,frames=frames,sourcePeriod=clock.PERIOD),reloadAt=20,closeAt=90)
 (A/'original-vectors.json').write_text(json.dumps(result,indent=2)+'\n');print(json.dumps(dict(controls=len(controls),plans=len(plans),anchors=len(anchors),frames=len(frames),unique_rasters=len({r['rgbaSha256']for r in frames}))))
if __name__=='__main__':main()
