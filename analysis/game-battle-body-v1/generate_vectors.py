#!/usr/bin/env python3
"""Original synthetic bytes and independent source-state reference; no product imports."""
from pathlib import Path
import importlib.util, json, math, struct, hashlib
A=Path(__file__).resolve().parent
P=A.parent.parent/'build/analysis/game-battle-body-v1'
def module(name,path):
    spec=importlib.util.spec_from_file_location(name,path);out=importlib.util.module_from_spec(spec);spec.loader.exec_module(out);return out
anime=module('battle_animation_reference',A.parent/'game-legacy-animation-v1/generate_vectors.py')
f=lambda n:struct.unpack('<f',struct.pack('<f',n))[0]
u32=lambda n:n&0xffffffff
SIN=json.loads((A/'source-tables.json').read_text())['sine_degrees']
ATAN=json.loads((A.parent/'game-legacy-actors-v1/actor-catalog.json').read_text())['math']['direction_table']
slot_table=json.loads((A.parent/'game-battle-transition-v1/source-tables.json').read_text());layout=[dict(entry=slot_table['positions'][i][:2],target=slot_table['positions'][i][2:])for i in slot_table['mapping']]
def angle(x,y):
    x,y=f(x),f(y)
    if x==0 and y==0:return 0.0
    a,b=abs(x),abs(y);swap=a<b;ratio=(a/b if swap else b/a)*64;i=int(ratio);t=f(ratio-i)
    n=f(ATAN[i]*(1-t)+ATAN[min(i+1,64)]*t)
    return f((270-n if y<0 else n+90)if x<0 else(n+270 if y<0 else 90-n))if swap else f((n+180 if y<0 else 180-n)if x<0 else(360-n if y<0 else n))
def facing(a):
    a=f(a)
    if a>=360:a=f(a-360)
    if a<0:a=f(a+360)
    for lo,hi,n in [(15,60,4),(60,120,5),(120,165,6),(165,195,7),(195,240,0),(240,300,1),(300,345,2)]:
        if lo<=a<hi:return n
    return 3
def sine(a):
    a=f(a)
    while a>=360:a=f(a-360)
    while a<0:a=f(a+360)
    return SIN[int(a)]
class Random:
    def __init__(self,seed):self.seed=seed
    def next(self):self.seed=u32(self.seed*214013+2531011);return(self.seed>>16)&32767
    def range(self,lo,hi):return 0 if hi==-1 else self.next()%abs(hi-lo+1)+lo

def fixtures():
    base=json.loads((A.parent/'game-resource-runtime-v1/original-vectors.json').read_text());files={r['path']:bytes.fromhex(r['bytesHex'])for r in base['files']}
    info=bytearray(files['Bin/GraphicInfo.bin']);graphics=bytearray(files['Bin/Graphic.bin'])
    for i,resource in enumerate([0x5730,0x5733,0x573e,0x5736,0x5737]):
        index=2000+i;width,height=8,4;pixels=bytes(0 if(j+i)%5==0 else 17+(j+i)%3 for j in range(width*height));raw=b'RD\0\0'+struct.pack('<iiI',width,height,16+len(pixels))+pixels
        row=bytearray(40);struct.pack_into('<IIIiiii',row,0,index,len(graphics),len(raw),-4,-2,width,height);struct.pack_into('<I',row,36,resource);info.extend(row);graphics.extend(raw)
    files['Bin/GraphicInfo.bin']=bytes(info);files['Bin/Graphic.bin']=bytes(graphics)
    data=bytearray(files['Bin/Anime.bin']);indices=bytearray(files['Bin/AnimeInfo.bin'])
    def add(resource,blocks):
        indices.extend(struct.pack('<IIHH',resource,len(data),len(blocks),0));data.extend(b''.join(blocks))
    add(100010,[anime.action(direction,action,96,[(1002,-1,1,7),(1004,1,-1,0),(1005,0,0,10001)])for direction in range(8)for action in [0,1,3,10,13]])
    add(100500,[anime.action(1,0,16,[(1002,0,0,0)])])
    add(0x1adb6,[anime.action(0,0,32,[(1004,0,0,0),(1005,1,-1,0)])])
    for resource in [0x1ae59,*range(0x1adfb,0x1ae01)]:add(resource,[anime.action(0,0,96,[(1002,0,0,0),(1004,1,-1,0),(1005,0,0,0)])])
    files['Bin/AnimeInfo.bin']=bytes(indices);files['Bin/Anime.bin']=bytes(data)
    records=[]
    for at in range(0,len(info),40):
        index=struct.unpack_from('<i',info,at)[0];x,y,w,h=struct.unpack_from('<iiii',info,at+12);resource=struct.unpack_from('<I',info,at+36)[0]
        records.append(dict(index=index,originX=x,originY=y,width=w,height=h,resourceId=resource))
    def geo(kind,value):
        record=next(r for r in records if r['index'if kind=='index'else'resourceId']==value)
        return{k:record[k]for k in ['index','originX','originY','width','height']}
    anime.geo=geo
    groups=[dict(index=files['Bin/AnimeInfo.bin'],animation=files['Bin/Anime.bin'],graphicBase=0)]
    replacements=[dict(path=n,bytesHex=files[n].hex())for n in ['Bin/GraphicInfo.bin','Bin/Graphic.bin','Bin/AnimeInfo.bin','Bin/Anime.bin']]
    return files,groups,anime.parse(groups),records,replacements

class BodyReference:
    def __init__(self,animations,slot=0,flags=0,seed=12345,offset=(0,0),alternative=False):
        self.animations=animations;self.slot=slot;self.flags=0;self.saved=flags&2;self.actor_flags=0x60054;self.position=list(layout[slot]['entry']);self.angle=0.;self.face=1;self.action=0;self.resource=100500;self.speed=3.;self.percent=100
        self.actions=[0,-1];self.read=0;self.write=-1;self.state=0;self.busy=0;self.counter=0;self.escape=0;self.scale=[f(1.3),f(1.3)]if flags&0x1000 else[1.,1.]
        self.seed=Random(seed);self.phase=0;self.passes=0;self.offset=offset;self.alt=alternative;self.detached=False;self.nodes=[];self.next_id=1;self.anime=anime.initial();self.child_status=None;self.children={}
        self.body=self.node('body',priority=slot*10+2,flags=self.actor_flags);self.animate(self.body,0);self.body['screen']=[int(n)for n in self.position]
        self.speed=1.;self.resource=100010;self.raw_flags=flags
        if flags&1:self.position=list(layout[slot]['entry'])
        else:self.position=list(layout[slot]['target']);self.reface()
        self.flags=(0 if flags&1 else 1)|(flags&14)
        if not(flags&1)and flags&2:
            self.action=10
            while self.animate(self.body,1)!=1:pass
            ghost=self.node('death',resource=0x1ae59,flags=0x40000);self.death_position(ghost);self.animate(ghost,1);self.children['death']=ghost
        for i in range(6):
            bit=16<<i
            if flags&bit and not self.child_status:
                self.flags|=bit;self.child_status=self.node('status',resource=0x1adfb+i,flags=0x60000,position=[self.position[0],f(self.position[1]+1)]);self.animate(self.child_status,1)
        if flags&0x400:self.indicator(True)
        self.animate(self.body,0)
    def node(self,kind,priority=2,resource=0,flags=0,position=None):
        n=dict(id=self.next_id,kind=kind,priority=priority,resource=resource,flags=flags,position=list(self.position)if position is None else position[:],screen=[0,0],state=0,counter=0,height=0.,deleted=False,q=anime.initial())
        self.next_id+=1;self.nodes.append(n);self.nodes.sort(key=lambda n:(n['priority'],n['id']));self.screen(n);return n
    def screen(self,n):
        p=self.position if n['kind']=='body'else n['position'];offset=(0,0)if n['kind']in ['message','puff']else self.offset;n['screen']=[int(p[i])+offset[i]for i in range(2)]
    def animate(self,node,mode):
        body=node['kind']=='body';q,result=anime.step(node['q'],anime.ctx(resourceId=self.resource if body else node['resource'],action=self.action if body else 0,facing=self.face if body else 0,speedPercent=self.percent if body else 100,mode=mode,soundScene=10,actorFlags=self.actor_flags if body else node['flags']),self.animations);node['q']=q
        if body:self.anime=q
        return result['code']
    def death_position(self,n):
        q=self.body['q'];g=q['geometry'];n['position']=[f(int(g['width']/2)+f(q['drawOffsetX'])+self.position[0]),f(int(g['height']/2)+f(q['drawOffsetY'])+self.position[1])];self.screen(n)
    def indicator(self,first):
        n=self.children.get('indicator')
        if n:n['resource']=0x5736 if first else 0x5737;return
        n=self.node('indicator',resource=0x5736 if first else 0x5737,flags=0x40000);self.animate(n,1);self.children['indicator']=n
    def reset(self):self.speed=1.;self.counter=self.escape=0;self.actions=[0,-1];self.read=0;self.write=-1
    def queue(self,values):self.actions=values+[-1];self.read=0;self.write=len(values)-1;self.state=values[0];self.busy=1
    def pop(self):self.read+=1;self.state=self.actions[self.read]if self.read<=self.write else 231
    def reface(self):
        row=layout[self.slot];self.angle=angle(row['target'][0]-row['entry'][0],row['target'][1]-row['entry'][1]);self.face=facing(self.angle)
    def aim(self,target,turn=True):
        self.angle=angle(f(target[0]-self.position[0]),f(target[1]-self.position[1]))
        if turn:self.face=facing(self.angle)
    def move(self):self.position=[f(sine(f(self.angle+90))*self.speed+self.position[0]),f(sine(self.angle)*self.speed+self.position[1])]
    def reached(self,target):return int(math.sqrt(sum((a-b)**2 for a,b in zip(self.position,target))))<5
    def puff(self):
        if self.counter==0:
            y=f(self.position[1]+self.seed.range(-10,10));x=f(self.position[0]+self.seed.range(-10,10));self.node('puff',resource=0x1adb6,flags=0x160000 if self.alt else 0x68000,position=[x,y])
        self.counter=(self.counter+1)%3
    def idle(self):
        self.percent=100
        if self.flags&2:self.action=10;self.animate(self.body,1)
        else:
            previous=self.action;self.action=0
            if not(self.flags&0x60)and(previous!=0 or self.actor_flags&64):self.animate(self.body,0)
    def body_step(self):
        s=self.state;target=layout[self.slot]['target'];entry=layout[self.slot]['entry'];stop=False
        if s==231:self.state=0;self.busy=0;self.idle()
        elif s==0:self.idle()
        elif s==1:self.percent=100;self.action=0;self.animate(self.body,0)
        elif s==2:
            self.action=1;self.speed=4.;self.percent=100;self.aim(target);self.move()
            if self.reached(target):self.position=target[:];self.state=0;self.flags|=1
            self.animate(self.body,0)
        elif s==11:
            if self.action!=10:self.action=1
            self.aim(target,self.action!=10);self.move()
            if self.reached(target):self.position=target[:];self.pop()
            self.animate(self.body,1 if self.action==10 else 0)
        elif s==12:
            if self.flags&2:self.action=10;self.animate(self.body,1);self.aim(entry,False);self.speed=6.;self.pop()
            else:
                self.puff();self.action=1;self.animate(self.body,0);self.aim(entry);self.escape+=1;self.percent=100-self.escape if self.escape<71 else 30
                if self.escape>119:self.escape=self.counter=0;self.speed=6.;self.pop()
        elif s==13:
            if self.flags&2:self.action=10;self.animate(self.body,1);self.aim(entry,False)
            else:self.puff();self.action=1;self.animate(self.body,0);self.aim(entry)
            self.speed=6.;self.percent=20;self.move()
            if self.reached(entry):self.position=entry[:];self.pop()
        elif s==35:
            if not self.flags&0x60:self.animate(self.body,0)
            self.counter+=1
            if self.counter>=60:self.counter=0;self.pop()
        elif s==38:self.reface();self.pop()
        elif s==45:self.flags|=2;self.pop()
        elif s==48:
            self.action=10
            if self.animate(self.body,1)==1:self.pop()
        elif s==49:self.detached=True;self.body['deleted']=True
        elif s==50:self.pop()
        elif s==55:
            self.action=13
            if self.animate(self.body,1)==1:self.body['q'].update(nextFrame=0,delay=0);self.pop()
        elif s==62:self.action=0;self.pop()
        elif s==63:
            self.action=0;previous=self.counter;self.counter+=1
            if previous>69:self.pop();self.counter=0
            elif self.counter in [8,32,40,64]:self.face-=1
            elif self.counter in [16,24,48,56]:self.face+=1
            self.face%=8;self.animate(self.body,0)
        elif s==66:
            n=self.node('message',resource=self.message,flags=0x40000);n['height']=-8.;self.animate(n,1)
            if not self.flags&0x60:self.animate(self.body,1)
            self.pop()
        elif s==78:self.pop()
        elif s==82:
            self.scale=[f(n-f(.01))for n in self.scale]
            if self.scale[0]<=1:self.scale=[1.,1.];self.flags&=~0x1000;self.pop()
            if not self.flags&0x60:self.animate(self.body,0)
        elif s==139:
            if self.child_status:self.child_status['deleted']=True;self.child_status=None
            self.flags&=0xfffffc0f;self.animate(self.body,0);self.pop()
        elif s==141:self.flags&=0xfff03fff;self.animate(self.body,0);self.pop()
        elif s==208:
            self.action=10;self.percent=100
            if self.animate(self.body,1)==1:self.state=209
        elif s==244:stop=True
        return stop
    def step(self,substate=6,slow=False):
        i=0;stop=False;visited=[]
        while i<len(self.nodes):
            n=self.nodes[i]
            if n['flags']&0x40000 and slow and self.phase:i+=1;visited.append([n['id'],'quarter-gated']);continue
            if n['deleted']:self.nodes.pop(i);visited.append([n['id'],'removed']);continue
            if n['kind']=='body':
                if substate!=7:stop=self.body_step()or stop
            elif n['kind']=='message':
                if not n['state']:
                    height=n['height']+f(.8);n['state']=1 if height>=f(7.2)else 0;n['height']=f(height);n['position'][1]=f(n['position'][1]+height)
                else:n['counter']+=1;n['deleted']=n['counter']>59
            elif n['kind']=='puff':n['deleted']=self.animate(n,1)==1
            elif n['kind']=='status':self.animate(n,0);n['position']=[self.position[0],f(self.position[1]+1)]
            elif n['kind']=='death':self.animate(n,0);self.death_position(n)
            elif n['kind']=='indicator':
                self.animate(n,0);n['flags']=n['flags']&~2 if substate==6 else n['flags']|2;n['position']=self.position[:]
            self.screen(n);visited.append([n['id'],'gated'if n['kind']=='body'and substate==7 else 'stop'if n['kind']=='body'and self.state==244 and stop else'advanced']);i=self.nodes.index(n)+1
        self.phase=(self.phase+1)%4;self.passes+=1
        return dict(state=self.state,busy=self.busy,position=self.position[:],angle=self.angle,facing=self.face,animationAction=self.action,speed=self.speed,speedPercent=self.percent,counter=self.counter,escapeCounter=self.escape,scale=self.scale[:],dynamicFlags=self.flags,detached=self.detached,phase=self.phase,seed=self.seed.seed,stop=stop,
            nodes=[dict(id=n['id'],kind=n['kind'],deleted=n['deleted'],position=(self.position[:]if n['kind']=='body'else n['position'][:]),screen=n['screen'][:],state=self.state if n['kind']=='body'else n['state'],counter=n['counter'],height=n['height'],actorFlags=self.actor_flags if n['kind']=='body'else n['flags'],animation=n['q'].copy())for n in self.nodes],visited=visited)

def main():
    files,groups,animations,records,replacements=fixtures();traces=[]
    scenarios=[('anr',0,0,[139],20),('anr-status',0,16,[139],20),('pue',0,0,[141],20),('sup',0,0,[66,78,55,62],30),('sup-dead',0,2,[66,78],30),('pno',0,0,[66,63],90),('escape-failed',0,0,[66,12,48,35,38],205),('escape-other',10,0,[66,12,78,50,13,49],230),('escape-local',0,0,[66,12,78,50,13,244],230),('pdn-scaled',0,0x1000,[78,82],60),('return',0,1,[11,38],450),('sup-quartered',0,0,[66,78,55,62],90),('pno-other-offset',10,0,[66,63],90),('status-quartered',10,16,[139],30),('death-probe',0,0,[208],15)]
    scenarios.extend([('anr-status32',0,32,[139],20),('escape-other-alt',10,0,[66,12,78,50,13,49],230),('idle-reset',0,0,[1],10),('entry-motion',0,1,[2],120),('paired-dead-marker',0,0,[45,49],12)])
    covered=set()
    for name,slot,flags,queue,count in scenarios:
        ref=BodyReference(animations,slot,flags,offset=(7,-9)if'offset'in name else(0,0),alternative=name.endswith('-alt'));
        if not flags&2:ref.reset()
        ref.message=0x5730 if name.startswith('escape')else 0x5733 if name.startswith('sup')else 0x573e;ref.queue(queue)
        rows=[]
        for _ in range(count):
            if ref.state not in [0,1,2,11,12,13,35,38,45,48,49,50,55,62,63,66,78,82,139,141,208,231,244]:break
            covered.add(ref.state)
            rows.append(ref.step(slow='quartered'in name))
        traces.append(dict(name=name,slot=slot,flags=flags,queue=queue,message=ref.message,offset=list(ref.offset),alternativeRenderer=ref.alt,slowEffects='quartered'in name,frames=rows))
    math_rows=[]
    for x in [-300,-10,-1,0,1,10,299,300]:
        for y in [-300,-1,0,1,299,300]:
            a=angle(x,y);math_rows.append(dict(x=x,y=y,angle=a,facing=facing(a)))
    trig=[dict(angle=a,sine=sine(a),move=[f(sine(f(a+90))*6+f(480)),f(sine(a)*6+f(360))])for a in [0,.9,1,14.99,15,44.9,45,89.9,90,179.9,180,224.9,225,269.9,270,359.9,360,450,-1,-360]]
    randoms=[]
    for seed in [0,1,12345,0xffffffff]:
        r=Random(seed);randoms.append(dict(initial=seed,values=[r.next()for _ in range(256)],final=r.seed))
    out=dict(schema='moli.original-battle-body-vectors-stage183.v1',original_synthetic_only=True,authority='independent Python source queue/counter/motion/animation/effect traversal; original source tables, no product code or original execution; x87 identity unverified',
        animationGroups=[{k:(v.hex()if isinstance(v,bytes)else v)for k,v in g.items()}for g in groups],geometry=records,files=replacements,math=math_rows,trig=trig,random=randoms,traces=traces,covered_body_types=sorted(covered),source_frames=sum(len(t['frames'])for t in traces))
    (A/'original-vectors.json').write_text(json.dumps(out,indent=2)+'\n');print(json.dumps(dict(traces=len(traces),frames=out['source_frames'],math=len(math_rows),trig=len(trig),random_values=1024)))
if __name__=='__main__':main()
