#!/usr/bin/env python3
"""Independent original CUT, source queue merge and indexed scene raster reference."""
from pathlib import Path
import copy,hashlib,importlib.util,json,math,random,struct
HERE=Path(__file__).resolve().parent;ROOT=HERE.parents[1]
def load(name,path):
 s=importlib.util.spec_from_file_location(name,path);m=importlib.util.module_from_spec(s);s.loader.exec_module(m);return m
anime=load('original_anime',ROOT/'analysis/game-legacy-animation-v1/generate_vectors.py')
frame=load('original_frame',ROOT/'analysis/game-legacy-frame-v1/generate_vectors.py')
wire=load('original_wire',ROOT/'analysis/game-legacy-message-v1/generate_vectors.py')
f=lambda n:struct.unpack('<f',struct.pack('<f',n))[0]
short=lambda n:(int(n)+32768)%65536-32768
sha=lambda b:hashlib.sha256(bytes(b)).hexdigest()
COLORS=anime.COLORS
def graphics():
 rows=[]
 for i in [1002,1003,1004,1005,1006,3000]:
  g=anime.geo('index',i);rows.append(dict(g,resourceId=1 if i==1003 else 30000 if i==3000 else 80000+i-1000,tileWidth=1,tileHeight=1,rawFlags=100))
 for values in [(1010,1,4,4,0,0,1,1,100),(1100,1000,64,48,-32,-24,1,1,101),(1101,5000,64,48,-32,-24,1,1,101),(1200,2000,32,40,-16,-40,2,2,100),(1201,2001,12,36,-6,-36,1,3,300),(1202,2002,24,30,-12,-30,1,1,100),(1203,220001,16,12,-8,-12,2,1,100),(1300,81300,132,100,-4,-9,3,3,100)]:
  i,r,w,h,x,y,tw,th,flags=values;rows.append(dict(index=i,resourceId=r,width=w,height=h,originX=x,originY=y,tileWidth=tw,tileHeight=th,rawFlags=flags))
 return rows
G=graphics();BY_INDEX={g['index']:g for g in G};LOOKUP={g['resourceId']:g['index'] for g in G}
ZERO=dict(index=0,resourceId=0,width=0,height=0,originX=0,originY=0,tileWidth=0,tileHeight=0,rawFlags=0)
def graphic_index(n):return LOOKUP.get(n,0)
def graphic(n):return BY_INDEX.get(n,ZERO)
def geo(kind,value):
 g=graphic(value if kind=='index' else graphic_index(value));return {k:g[k] for k in ['index','originX','originY','width','height']}
anime.geo=geo
def graphic_bytes():
 out=b''
 for g in G:
  raw=bytearray(40)
  for at,key in [(0,'index'),(12,'originX'),(16,'originY'),(20,'width'),(24,'height'),(36,'resourceId')]:struct.pack_into('<i',raw,at,g[key])
  raw[28]=g['tileWidth'];raw[29]=g['tileHeight'];struct.pack_into('<H',raw,30,g['rawFlags']);struct.pack_into('<I',raw,32,0x12345678);out+=raw
 return out
def cut_rows():
 return [dict(resourceId=1000,kind=0,clip=[288,216,64,48],anchor=[32,24]),dict(resourceId=2000,kind=0,clip=[304,200,32,40],anchor=[16,40]),dict(resourceId=2001,kind=0,clip=[314,204,12,36],anchor=[6,36]),
  dict(resourceId=100001,kind=1,clip=[0,0,0,0],anchor=[-5,7]),dict(resourceId=80002,kind=0,clip=[320+graphic(1002)['originX']+2,240+graphic(1002)['originY']+1,4,3],anchor=[4,5]),dict(resourceId=1,kind=0,clip=[0,0,0,0],anchor=[0,0]),
  dict(resourceId=1000,kind=2,clip=[288,216,64,48],anchor=[32,24]),dict(resourceId=30000,kind=1,clip=[0,0,0,0],anchor=[2,-3]),dict(resourceId=100002,kind=1,clip=[0,0,0,0],anchor=[-2,1]),dict(resourceId=100002,kind=1,clip=[0,0,0,0],anchor=[90,90])]
CUT=cut_rows()
def cut_bytes():return b'CUT '+struct.pack('<4H',12,4,4,2)+b''.join(struct.pack('<IH6h',r['resourceId'],r['kind'],*r['clip'],*r['anchor']) for r in CUT)
def cut_entry(tile):
 i=tile-1000
 return dict(tileId=tile,index=i,**copy.deepcopy(CUT[i]),present=True) if i<len(CUT) else dict(tileId=tile,index=i,resourceId=0,kind=65535,clip=[0]*4,anchor=[0,0],present=False)
def rectangle(w,h,center):
 x,y=center;return [max(0,short(x-30)),max(0,short(y-20)),min(w,short(x+21)),min(h,short(y+31))]
def tile_order(w,h):
 out=[]
 for d in range(1-h,w):
  x=min(w-1,d+h-1);y=x-d
  while x>=0 and y>=0:out.append([x,y]);x-=1;y-=1
 return out
def before(a,b):
 ax,ay=a['position'];bx,by=b['position'];asx,asy=a['screenPosition'];bsx,bsy=b['screenPosition'];w,h=b['footprint']
 if b['declaredResourceId']==1 or [w,h]==[1,1]:return bx-by<ax-ay
 if bx<ax and ay<by:return True
 if bsx<asx:return asy<bsy+24*(1-w)
 if bsx>asx:return asy<bsy+24*(1-h)
 return asy<bsy
def merge(actors,objects,tails):
 lookup={r['ordinal']:r for r in actors};a=[lookup[i] for i in frame.source_sort([{k:r[k] for k in ['position','sortFlag','ordinal']} for r in actors])];i=j=0;out=[]
 def emit(q,r):
  if q!='actor' or r['declaredResourceId']!=1:out.append(dict(queue=q,ordinal=r['ordinal']))
 while i<len(a) and j<len(objects):
  if before(a[i],objects[j]):emit('object',objects[j]);j+=1
  else:
   position=a[i]['position'];emit('actor',a[i]);i+=1
   while i<len(a) and a[i]['position']==position:emit('actor',a[i]);i+=1
 for r in objects[j:]:emit('object',r)
 for r in a[i:]:emit('actor',r)
 for r in tails:emit('tail',r)
 return out
def root(index,position,screen,sort=0,ordinal=0):
 g=graphic(index);return dict(graphicIndex=index,declaredResourceId=0xffffffff if index<0 else g['resourceId'],position=position,screenPosition=[short(x) for x in screen],footprint=[g['tileWidth'],g['tileHeight']],sortFlag=sort,ordinal=ordinal)
def raster(commands,w,h):
 out=bytearray(w*h*4);work=0;order=sorted(range(len(commands)),key=lambda i:(commands[i]['priority'],-i))
 for i in order:
  c=commands[i];g=graphic(c['index']);iw,ih=g['width'],g['height'];x=short(c['x']+c.get('originX',0));y=short(c['y']+c.get('originY',0));flip=c.get('flip',0);sx=sy=0;sw=iw;sh=ih
  if 'sourceRectangle' in c:
   sx,sy,sw,sh=c['sourceRectangle']
   if sx<0:x-=sx;sw+=sx;sx=0
   if sy<0:y-=sy;sh+=sy;sy=0
   sw=max(0,min(sw,iw-sx));sh=max(0,min(sh,ih-sy))
   if flip&1:x+=iw-sw
   if flip&2:y+=ih-sh
  # Independent 64x48 native texture chunks; production uses a collapsed RGBA loop.
  native_x=x-(iw-sw if flip&1 and 'sourceRectangle' in c else 0);native_y=y-(ih-sh if flip&2 and 'sourceRectangle' in c else 0)
  for by in range(0,ih,48):
   for bx in range(0,iw,64):
    startx=max(0,sx-bx);starty=max(0,sy-by);endx=min(64,sx+sw-bx,iw-bx);endy=min(48,sy+sh-by,ih-by)
    if startx>=endx or starty>=endy:continue
    left=native_x+((iw-bx-endx)+sx if flip&1 else bx-sx+startx);top=native_y+((ih-by-endy)+sy if flip&2 else by-sy+starty)
    for dy in range(endy-starty):
     for dx in range(endx-startx):
      ox=left+dx;oy=top+dy
      if ox<0 or oy<0 or ox>=w or oy>=h:continue
      work+=1;px=bx+(endx-1-dx if flip&1 else startx+dx);py=by+(endy-1-dy if flip&2 else starty+dy);offset=(ih-1-py)*iw+px;palette=0 if (offset+c['index'])%5==0 else 1+(offset+c['index'])%3;color=COLORS[palette]
      if color[3]:out[(oy*w+ox)*4:(oy*w+ox)*4+4]=bytes(color)
 return dict(rgbaSha256=sha(out),rasterOperations=work,drawOrder=order)
def ordinary(index,x,y,priority,style=None):
 if index<1000:return None
 g=graphic(index);return dict(index=index,x=x,y=y,originX=g['originX'],originY=g['originY'],priority=priority,flip=0 if style is None else style['drawFlags']&3)
def clipped(entry,index,x,y,priority):
 if index<1000:return None
 g=graphic(index);return dict(index=index,x=short(x-entry['anchor'][0]),y=short(y-entry['anchor'][1]),priority=priority,sourceRectangle=[short(entry['clip'][0]-320-g['originX']),short(entry['clip'][1]-240-g['originY']),*entry['clip'][2:]])
def project(position,camera,center,bias=False):
 x,y=position;cx,cy=camera;return [math.trunc(f(((x-cx)+(y-cy))*0.5+center[0])+(0.5 if bias else 0)),math.trunc(f(((y-cy)-(x-cx))*0.375+center[1])+(0.5 if bias else 0))]
class Scene:
 def __init__(self):self.instances={};self.animations=anime.parse(anime.groups())
 def step(self,w,h,planes,mode,context,request,actor_roots,reset=False):
  if reset:self.instances={}
  rect=rectangle(w,h,context['tileCenter']);left,top,right,bottom=rect;base=project([0,0],request['camera'],request['center']);queues=dict(actor=[],object=[],tail=[]);commands={};sources={};ground=[];created=[];updated=[];events=[];ignored=[];calls=0;dropped=0
  def add(queue,r,command,source):
   nonlocal dropped
   if len(queues[queue])==1024:dropped+=1;return
   r['ordinal']=len(queues[queue]);queues[queue].append(r);key=queue+':'+str(r['ordinal']);commands[key]=command;sources[key]=source
  for a in actor_roots:add('actor',root(a['graphicIndex'],a['position'],a['screenPosition'],a['sortFlag']),a['command'],dict(kind='actor',id=a['id']))
  for x,y in tile_order(right-left,bottom-top):
   world=[left+x,top+y];cell=world[1]*w+world[0];position=[f(n*64) for n in world];screen=[32*sum(world)+base[0],24*(world[1]-world[0])+base[1]];source=dict(kind='map',coordinates=world)
   def enqueue(index,at,command):
    r=root(index,position,at)
    if r['declaredResourceId']==1:add('actor',r,command,source)
    elif r['declaredResourceId']>999:add('tail' if graphic(index)['rawFlags']//100==3 else 'object',r,command,source)
   if mode==1:
    g,o=planes[0][cell],planes[1][cell]
    if g>999 and -65<screen[0]<672 and -49<screen[1]<504:
     entry=cut_entry(g);command=clipped(entry,graphic_index(entry['resourceId']),*screen,5)
     if command:ground.append((command,source))
    if o>999:
     entry=cut_entry(o)
     if entry['kind']==0:
      index=graphic_index(entry['resourceId']);at=[short(n-a) for n,a in zip(screen,entry['anchor'])];enqueue(index,at,clipped(entry,index,*screen,10))
     elif entry['kind']==1:
      key=tuple(world)
      if key not in self.instances:self.instances[key]=dict(resource=entry['resourceId'],anchor=entry['anchor'],state=anime.initial());created.append(world)
      else:
       instance=self.instances[key];state,result=anime.step(instance['state'],anime.ctx(resourceId=instance['resource'],facing=0,action=0),self.animations);instance['state']=state;calls+=1;updated.append(world)
       if result['event']:events.append(dict(result['event'],mapCoordinates=world,screenPosition=screen))
       index=state['graphicIndex'];at=[short(n+a) for n,a in zip(screen,instance['anchor'])];add('object',root(index,position,at),ordinary(index,*at,10,state),source)
     else:ignored.append(dict(coordinates=world,cutKind=entry['kind']))
   else:
    primitive=lambda n:n if n<20000 else n+200000
    g,o=[primitive(planes[p][cell]) for p in [0,1]]
    if g>=1000 and -33<screen[0]<672 and -25<screen[1]<504:
     command=ordinary(graphic_index(g),*screen,1 if 5000<=g<=5009 else 5)
     if command:ground.append((command,source))
    if o==1 and context['drawPrimitives']:add('actor',root(graphic_index(1),position,screen),None,source)
    elif o>=1000:
     index=graphic_index(o);g=graphic(index);sx=short(g['originX']+screen[0]);sy=short(g['originY']+screen[1])
     if sx<640 and sx+short(g['width'])-1>=0 and sy<480 and sy+short(g['height'])-1>=0:enqueue(index,screen,ordinary(index,*screen,10))
  order=merge(queues['actor'],queues['object'],queues['tail']);all_commands=[];submitted=[]
  for command,source in ground+[(commands[r['queue']+':'+str(r['ordinal'])],sources[r['queue']+':'+str(r['ordinal'])]) for r in order]:
   if command is not None:all_commands.append(command);submitted.append(source)
  image=raster(all_commands,request['width'],request['height']);return dict(rectangle=rect,queues={k:len(v) for k,v in queues.items()},mergeOrder=order,submitted=submitted,drawOrder=[submitted[i] for i in image['drawOrder']],rasterOperations=image['rasterOperations'],helperCalls=calls,createdMapObjects=created,updatedMapObjects=updated,ignoredCutKinds=ignored,events=events,droppedRoots=dropped,droppedDraws=0,rgbaSha256=image['rgbaSha256'],mapObjectInstances=len(self.instances))
def planes(mode,w=12,h=12):
 p=[[1000]*(w*h),[0]*(w*h),[0xc000]*(w*h)]
 if mode==1:
  p[0][3*w+3]=1006  # Ground consumes the CUT image regardless of its object-kind field.
  for x,y,n in [(3,3,1001),(4,4,1002),(4,3,1003),(3,4,1004),(2,3,1005),(8,8,1006),(6,4,1007),(5,4,1008)]:p[1][y*w+x]=n
 else:
  p[0][1*w+1]=5000
  for x,y,n in [(3,3,2000),(4,4,2001),(3,4,2002),(2,3,1),(7,5,20001)]:p[1][y*w+x]=n
 return p
REQUEST=dict(tick=0,runtime=frame.RUNTIME,camera=[160,192],center=[48,36],width=96,height=72)
def actors(tick):
 out=[]
 for i,(index,pos,flag) in enumerate([(1002,[f(160+tick*2),192],1),(3000,[192,192],0),(1003,[128,192],0)]):
  screen=project(pos,REQUEST['camera'],REQUEST['center'],True);r=dict(graphicIndex=index,position=pos,screenPosition=screen,sortFlag=flag,ordinal=i,id=100+i,command=ordinary(index,*screen,10));out.append(r)
 return out
def main():
 rng=random.Random(162);windows=[]
 for _ in range(100):
  w=rng.randrange(1,200);h=rng.randrange(1,200);c=[rng.randrange(w),rng.randrange(h)];windows.append(dict(width=w,height=h,center=c,expected=rectangle(w,h,c)))
 orders=[dict(width=w,height=h,expected=tile_order(w,h)) for w,h in [(1,1),(2,3),(3,2),(7,4),(51,51),(2601,1),(1,2601)]]
 def random_root(i):
  index=rng.choice([1002,1010,1200,1201,1202,1203]);return root(index,[f(rng.randrange(-5,6)*64),f(rng.randrange(-5,6)*64)],[rng.randrange(-320,321),rng.randrange(-240,241)],int(i==0),i)
 comparisons=[]
 for i in range(600):
  a=random_root(0);b=random_root(0);comparisons.append(dict(actor=a,object=b,expected=before(a,b)))
 merges=[]
 for n in [0,1,2,7,8,9,40,100,1024]:
  for _ in range(3):
   a=[random_root(i) for i in range(n)];b=[random_root(i) for i in range(min(n,40))];b.sort(key=lambda r:r['position'][0]-r['position'][1]);tails=[random_root(i) for i in range(min(n,4))];merges.append(dict(actors=a,objects=b,tails=tails,expected=merge(a,b,tails)))
 crop=[]
 for i in range(160):
  index=1002 if i<80 else 1300;w,h=(32,24) if i<80 else (128,96);c=dict(index=index,x=rng.randrange(-4,21) if i<80 else rng.randrange(-80,41),y=rng.randrange(-3,16) if i<80 else rng.randrange(-60,31),priority=10,flip=i%4,
   sourceRectangle=[rng.randrange(-12,17),rng.randrange(-8,9),rng.randrange(-2,20),rng.randrange(-2,13)] if i<80 else [rng.randrange(-16,133),rng.randrange(-16,101),rng.randrange(-2,161),rng.randrange(-2,121)]);crop.append(dict(command=c,width=w,height=h,expected=raster([c],w,h)))
 series=[]
 for name,mode in [('ordinary',0),('primitive-markers',0),('atlas-and-animation',1),('animated-retention',1),('scene-reset',1),('fractional-camera',1)]:
  model=Scene();p=planes(mode);rows=[]
  for tick in range(24):
   changes=[];request=copy.deepcopy(REQUEST);request['tick']=tick;context=dict(tileCenter=[2,3],drawPrimitives=name=='primitive-markers')
   if name=='animated-retention' and tick in [5,10]:
    n=0 if tick==5 else 1009;p[1][3*12+4]=n;changes=[[1,4,3,n]]
   if name=='fractional-camera':request['camera']=[f(160.25+tick*0.1),f(192.75-tick*0.2)];request['center']=[-2,1]
   reset=name=='scene-reset' and tick==12;a=actors(tick);expected=model.step(12,12,p,mode,context,request,a,reset);rows.append(dict(tick=tick,request=request,context=context,changes=changes,reset=reset,actorRoots=a,expected=expected))
  series.append(dict(name=name,width=12,height=12,mode=mode,initialPlanes=planes(mode),frames=rows))
 nav=json.loads((ROOT/'analysis/game-legacy-frame-v1/original-vectors.json').read_text());protocol=copy.deepcopy(nav['protocol']);p=planes(1);dispatch=json.loads((ROOT/'analysis/game-legacy-message-v1/dispatch-catalog.json').read_text());patch_spec=next(r for r in dispatch['incoming'] if r.get('consumer')=='0x4ef580');payload=b'|'.join(b','.join(wire.integer(n&0x1ff if i==2 else n) for n in plane) for i,plane in enumerate(p));protocol['beforePlainHex'][-1]=wire.message(patch_spec,[7,23,0,0,12,12,payload]).hex();model=Scene();world=[]
 for tick,a in enumerate(nav['worldFrames']):
  q=a['animation'];g=q['geometry'];screen=[short(a['screenPosition'][0]+q['drawOffsetX']-(g['originX'] if g else 0)),short(a['screenPosition'][1]+q['drawOffsetY']-(g['originY'] if g else 0))];index=q['graphicIndex'];command=ordinary(index,screen[0],screen[1],10,q) if g and graphic(index)['resourceId']!=1 else None
  actor_roots=[dict(graphicIndex=index,position=a['position'],screenPosition=screen,sortFlag=1,ordinal=0,id=100,command=command)];request=copy.deepcopy(REQUEST);request['tick']=1000+tick;world.append(model.step(12,12,p,1,dict(tileCenter=[2,3],drawPrimitives=False),request,actor_roots))
 out=dict(schema='moli.original-scene-frame-vectors-stage162.v1',original_synthetic_only=True,graphics=G,graphicBytesHex=graphic_bytes().hex(),cutHex=cut_bytes().hex(),cutEntries=[cut_entry(n) for n in [*range(1000,1010),1020,50999]],windows=windows,tileOrders=orders,comparisons=comparisons,merges=merges,sourceRectangleCases=crop,series=series,
  bootstrap=nav['bootstrap'],sourceContext=nav['sourceContext'],runtime=frame.RUNTIME,actorSource=frame.SOURCE,protocol=protocol,worldFrames=world)
 (HERE/'original-vectors.json').write_text(json.dumps(out,indent=2)+'\n');print(json.dumps(dict(windows=len(windows),tileOrders=len(orders),comparisons=len(comparisons),merges=len(merges),cropCases=len(crop),sceneTraces=len(series),sceneFrames=sum(len(s['frames']) for s in series),TCPFrames=len(world))))
if __name__=='__main__':main()
