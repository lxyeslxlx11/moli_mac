#!/usr/bin/env python3
"""Original source-profile numeric animation and image-position reference, no game material."""
from pathlib import Path
import struct,json,hashlib,random
HERE=Path(__file__).resolve().parent
sha=lambda b:hashlib.sha256(bytes(b)).hexdigest()
def put(p,x):p.write_text(json.dumps(x,ensure_ascii=False,indent=2)+'\n')
def index(rows):return b''.join(struct.pack('<IIHH',*r) for r in rows)
def action(direction,code,duration,frames,version=0,selector=0,flags=0,color=0xffffffff):
 b=struct.pack('<HHII',direction,code,duration,len(frames))
 if version==1:b+=struct.pack('<HHI',selector,flags,color)
 return b+b''.join(struct.pack('<IhhH',*r) for r in frames)
def groups():
 a=b'';rows=[]
 def add(resource,blocks,version):
  nonlocal a;at=len(a);a+=b''.join(blocks);rows.append([resource,at,len(blocks),version])
 add(100001,[action(d,k,144,[(2,-3,2,7),(3,1,-2,10004),(4,0,0,0)]) for d in range(8) for k in range(2)],0)
 add(100002,[action(d,k,64,[(5,2,-1,8),(6,-1,2,0)],1,selector=(3 if k==6 else 0),flags=(d if k<4 else 8 if k==4 else 0),color=(0x80ffffff if k==5 else 0xffffffff)) for d in range(4) for k in range(7)],1)
 add(100003,[action(0,0,0,[],1)],1);add(100004,[],0)
 add(100005,[action(0,0,32,[(8,1,-1,0)])],65535)
 # Last duplicate record andgroup wins; AP offsets resolve against the record's group.
 b=action(1,2,320,[(7,-4,2,9999),(8,3,-2,10000)],1,flags=3)
 apindex=b'\1'+struct.pack('<IIH',100001,0,3)+struct.pack('<IIH',100002,24,1)
 apdata=b''.join(struct.pack('<Ihh',*v) for v in [(2,9,-7),(2,99,99),(4,-3,5),(5,-5,6)])
 return [dict(index=index(rows),animation=a,graphicBase=1000,attachmentIndex=apindex,attachmentData=apdata),dict(index=index([(100005,0,1,1)]),animation=b,graphicBase=2000)]
def parse(gs):
 records={}
 for g,group in enumerate(gs):
  for at in range(0,len(group['index']),12):
   resource,offset,count,version=struct.unpack_from('<IIHH',group['index'],at);records[resource]=dict(group=g,offset=offset,count=count,version=version if version<=1 else 0,apoffset=0,apcount=0)
 for group in gs:
  raw=group.get('attachmentIndex',b'')
  for at in range(1,len(raw),10):
   resource,offset,count=struct.unpack_from('<IIH',raw,at)
   if resource in records:records[resource].update(apoffset=offset,apcount=count)
 out={}
 for resource,r in records.items():
  g=gs[r['group']];cursor=r['offset'];actions=[]
  for _ in range(r['count']):
   direction,code,duration,count=struct.unpack_from('<HHII',g['animation'],cursor);cursor+=12
   selector,flags,color=struct.unpack_from('<HHI',g['animation'],cursor) if r['version']==1 else (0,0,0xffffffff)
   if r['version']==1:cursor+=8
   fs=[]
   for i in range(count):
    graphic,x,y,event=struct.unpack_from('<IhhH',g['animation'],cursor);cursor+=10;fs.append(dict(graphicIndex=graphic+g['graphicBase'],x=x,y=y,event=event))
   actions.append(dict(direction=direction,action=code,duration=duration,delayTicks=max(1,duration//(count*16)) if count else duration,frameCount=count,paletteSelector=selector,flags=flags,color=color,frames=fs))
  aps=[]
  for i in range(r['apcount']):
   graphic,x,y=struct.unpack_from('<Ihh',g['attachmentData'],r['apoffset']+i*8);aps.append(dict(graphicIndex=graphic+g['graphicBase'],x=x,y=y))
  out[resource]=dict(resourceId=resource,group=r['group'],version=r['version'],actionCount=len(actions),byteOffset=r['offset'],consumedBytes=cursor-r['offset'],actions=actions,attachments=aps)
 return out

def geo(kind,value):
 i=value if kind=='index' else value%5000+3000
 return dict(index=i,originX=i%7-3,originY=i%5-2,width=4*(i%3+1),height=i%4+2)
def initial():return dict(lastResource=0,lastAction=0,lastFacing=0,nextFrame=0,delay=0,cycles=0,signal=0,mode=0,graphicIndex=-1,drawOffsetX=0,drawOffsetY=0,attachmentX=0,attachmentY=0,paletteSelector=0,drawFlags=0,color=0xffffffff,geometry=None)
def ctx(**kw):return dict(resourceId=100001,action=0,facing=0,speedPercent=100,mode=0,frozen=0,staticFlip=False,soundScene=0,actorFlags=0,**kw) if not kw else {**ctx(),**kw}
def step(q,c,animations):
 n=dict(q);event=None;changed=False;code=0;reason='countdown'
 if c['frozen']==1:return n,dict(code=0,reason='frozen',frameChanged=False,event=None,state=n)
 n['mode']=c['mode']
 if (n['lastResource'],n['lastAction'],n['lastFacing'])!=(c['resourceId'],c['action'],c['facing']):
  n.update(lastResource=c['resourceId'],lastAction=c['action'],lastFacing=c['facing'],nextFrame=0,delay=0,cycles=0)
 if n['delay']:
  n['delay']=(n['delay']-1)&0xffffffff
 elif c['resourceId']<1000:n.update(graphicIndex=0,geometry=None);reason='hidden'
 elif 100000<=c['resourceId']<200000:
  a=animations.get(c['resourceId']);selected=next((a for a in a['actions'] if a['direction']==c['facing'] and a['action']==c['action']),None) if a else None
  if not a:code=1;reason='resource-missing'
  elif not a['actionCount']:code=-1;reason='load-empty'
  elif not selected:code=1;reason='action-missing'
  else:
   period=((selected['delayTicks']*c['speedPercent'])&0xffffffff)//100 or 1;n['delay']=period
   if n['nextFrame']>=selected['frameCount'] and c['mode']==1:n.update(delay=255,cycles=1);code=1;reason='complete'
   else:
    if not selected['frameCount']:raise ValueError('LEGACY_ANIMATION_EMPTY_LOOP')
    if n['nextFrame']>=selected['frameCount']:n.update(nextFrame=0,cycles=n['cycles']+1)
    f=selected['frames'][n['nextFrame']];g=geo('index',f['graphicIndex']);flags=selected['flags']&255
    dx=f['x']+g['originX'];dy=f['y']+g['originY'];ap=next((v for v in a['attachments'] if v['graphicIndex']==f['graphicIndex']),dict(x=0,y=0));ax=f['x']+ap['x'];ay=f['y']+ap['y']
    if flags&1:dx=-(g['width']+dx);ax=-ax
    if flags&2:dy=-(g['height']+dy);ay=-ay
    n.update(graphicIndex=f['graphicIndex'],geometry=g,drawOffsetX=dx,drawOffsetY=dy,attachmentX=ax,attachmentY=ay,paletteSelector=selected['paletteSelector'],drawFlags=flags,color=selected['color'],nextFrame=n['nextFrame']+1,delay=n['delay']-1)
    if f['event']>=10000:n['signal']=f['event'];event=dict(kind='signal',value=f['event'])
    elif f['event'] and not(c['soundScene']==9 and c['actorFlags']&0x80200):event=dict(kind='sound',value=f['event'])
    reason='frame';changed=True
 else:
  g=geo('resource',c['resourceId']);flip=c['staticFlip'] and 2<=c['facing']<5
  n.update(graphicIndex=g['index'],geometry=g,drawOffsetX=-(g['width']+g['originX']) if flip else g['originX'],drawOffsetY=g['originY'],delay=2147483647,paletteSelector=0,drawFlags=1 if flip else 0,color=0xffffffff,attachmentX=0,attachmentY=0);reason='static';changed=True
 return n,dict(code=code,reason=reason,frameChanged=changed,event=event,state=n)
COLORS=[(0,0,0,0),(13,31,61,255),(97,127,151,255),(173,193,223,255)]
def render(q):
 out=bytearray(32*24*4);g=q['geometry']
 if not g or q['graphicIndex']<1000:return sha(out)
 if q['paletteSelector'] or q['drawFlags']&~7 or q['color']!=0xffffffff:return 'LEGACY_ANIMATION_DRAW_STYLE'
 w,h=g['width'],g['height'];left=16+q['drawOffsetX'];top=12+q['drawOffsetY'];flags=q['drawFlags'];index=q['graphicIndex']
 for y in range(max(0,top),min(24,top+h)):
  for x in range(max(0,left),min(32,left+w)):
   sx=w-1-(x-left) if flags&1 else x-left;sy=h-1-(y-top) if flags&2 else y-top;i=(h-1-sy)*w+sx;p=0 if (i+index)%5==0 else 1+(i+index)%3;c=COLORS[p]
   if c[3]:out[(y*32+x)*4:(y*32+x)*4+4]=bytes(c)
 return sha(out)
def generate():
 gs=groups();animations=parse(gs);series=[]
 def trace(name,contexts,invalidations=[]):
  q=initial();rows=[]
  for i,c in enumerate(contexts):
   invalidated=i in invalidations
   if invalidated:q={**q,'lastAction':-1}
   try:q,result=step(q,c,animations);row=dict(context=c,invalidate=invalidated,expected=result,frameDigest=render(q))
   except ValueError as e:row=dict(context=c,invalidate=invalidated,error=str(e),unchangedState=q)
   rows.append(row)
  series.append(dict(name=name,steps=rows))
 trace('loop', [ctx() for _ in range(40)])
 trace('once-and255-retry',[ctx(mode=1) for _ in range(280)])
 trace('same-action-restart',[ctx() for _ in range(32)],[2,4,17])
 trace('freeze-and-resume',[ctx(frozen=1 if 4<=i<12 else 0,action=1 if i>=8 else 0) for i in range(32)])
 trace('sound-suppressed',[ctx(soundScene=9,actorFlags=0x200) for _ in range(24)])
 trace('empty-once',[ctx(resourceId=100003,mode=1) for _ in range(260)])
 trace('empty-loop',[ctx(resourceId=100003) for _ in range(3)])
 trace('load-empty',[ctx(resourceId=100004) for _ in range(3)])
 for flags in range(4):trace('flip-'+str(flags),[ctx(resourceId=100002,facing=flags) for _ in range(14)])
 for k in [4,5,6]:trace('special-style-'+str(k),[ctx(resourceId=100002,action=k) for _ in range(4)])
 trace('group-override',[ctx(resourceId=100005,facing=1,action=2) for _ in range(36)])
 for speed in [-1,0,1,33,100,199,2147483647]:trace('percent-'+str(speed),[ctx(speedPercent=speed) for _ in range(16)])
 rng=random.Random(160)
 for j in range(12):
  contexts=[]
  for i in range(30):contexts.append(ctx(resourceId=rng.choice([0,999,1000,100001,100002,100005,120500,199999,200000]),action=rng.choice([0,1,2]),facing=rng.randrange(-1,8),staticFlip=bool(rng.randrange(2)),mode=rng.randrange(3),frozen=rng.choice([0,0,1,2])))
  trace('mixed-'+str(j),contexts)
 serialized=[]
 for g in gs:serialized.append({k+'Hex' if isinstance(v,bytes) else k:v.hex() if isinstance(v,bytes) else v for k,v in g.items()})
 put(HERE/'original-vectors.json',dict(schema='moli.legacy-animation-original-stage160.v1',original_synthetic_only=True,groups=serialized,animations=list(animations.values()),series=series));print(json.dumps(dict(resources=len(animations),actions=sum(x['actionCount'] for x in animations.values()),frames=sum(a['frameCount'] for x in animations.values() for a in x['actions']),series=len(series),steps=sum(len(x['steps']) for x in series))))
if __name__=='__main__':generate()
