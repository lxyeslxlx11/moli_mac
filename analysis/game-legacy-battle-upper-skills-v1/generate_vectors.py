"""Independent equations from fixed37c4 upper producers and callbacks; authored fixtures only."""
from pathlib import Path
from hashlib import sha256
import importlib.util
import json
import struct
import math
from types import SimpleNamespace

HERE=Path(__file__).resolve().parent
ROOT=HERE.parents[1]
PATH=HERE.parent/'game-legacy-battle-skill99-v1/generate_vectors.py'
spec=importlib.util.spec_from_file_location('upper_status_reference',PATH)
prior=importlib.util.module_from_spec(spec);spec.loader.exec_module(prior)
native=prior.native
f=native.f
nspec=importlib.util.spec_from_file_location('upper_numeric_reference',HERE.parent/'game-battle-numeric-skills-v1/generate_vectors.py')
numeric=importlib.util.module_from_spec(nspec);nspec.loader.exec_module(numeric)
CLASSES=[107,108,109,112,114,117]

def case(name,category=107,level=0,caster=0,hits=None,**extra):
    return dict(name=name,category=category,level=level,caster=caster,cost=3,local=0,
        resource=100060,hits=([[10,0x80000,7]]if category==108 else[[10,0x80000]])if hits is None else hits,**extra)

def queues(c):
    out={};p=c['caster'];k=c['category'];level=c['level']
    def r(s):return out.setdefault(s,dict(slot=s,reset=False,actions=[],tuples=[],assignments={}))
    def add(s,*steps):r(s)['actions'].extend(steps)
    def depart(s):return [244]if s==c['local']else[50,49]
    r(p)['assignments'].update(classCode=k,skillLevel=level,mpCost=c['cost'])
    heads={107:[24,147,53,102],108:[24,147],109:[24,147],112:[24,53,156,73,107,108],
        114:[24,53,38,135,62],117:[24,53,38,147,62]}
    add(p,*heads[k])
    if k==114:r(p)['assignments']['chantResource']=0x1ade8+native.TIER[level]
    for h in c['hits']:
        t,bits=h[:2];amount=h[2]if k==108 else 0
        r(p)['tuples'].append([t,native.prior.signed(bits),amount])
        if k==107:continue
        r(t)['assignments'].update(classCode=k,skillLevel=level)
        if k in[108,109]:
            if p!=t:add(t,0);add(p,7,9,10)
            add(p,103)
            if bits&0x80000:
                add(p,104 if p==t else 55)
                special=(p==20 and t<10)or(p==21 and t>=10)
                if k==108:
                    add(t,*([179]if special else[146,154]));r(t)['assignments'].update(chantResource=0x1ae01+native.TIER[level],numberValue=amount,numberStyle=5)
                else:add(t,178 if special else 131)
            elif k==109 and bits&0x200000:
                r(t)['assignments']['messageResource']=0x5739;add(t,*([117,66,48]if bits&2 else[66,30]));add(p,57)
            else:r(p)['assignments']['messageResource']=0x573b;add(p,66,57)
            add(p,72)
        elif k==112:
            add(t,0)
            if not bits&0x80000:add(t,11)
            elif bits&0x2000:add(t,119);add(p,109,35,87,*depart(p))
            elif bits&0x4000:add(t,120)
            elif bits&0x8000:add(t,121)
            else:add(t,109,35,87,*depart(t))
        elif k==114:
            add(t,153)
            if bits&0x80000:r(t)['assignments']['effectResource']=0xfd;add(t,140,78,35)
        else:
            add(t,0)
            if bits&0x80000:add(t,54)
            else:r(t)['assignments']['messageResource']=0x573b;add(t,66)
            add(p,71,72)
    if k in[107,114]:r(p)['tuples'].append([-1,0,0])
    if k in[108,109]:add(p,53)
    return dict(rows=list(out.values()))

def additions():
    blocks=[native.anime.action(d,a,96,[(1002,-1,1,0),(1004,-1,1,10001 if a==5 else 0),(1005,-1,1,0)])for d in range(8)for a in range(20)]
    return [dict(resourceId=0x18aa7,actions=len(blocks),bytesHex=b''.join(blocks).hex())]

def graphics():
    _,_,files=numeric.fixtures();files={r['path']:bytes.fromhex(r['bytesHex'])for r in files}
    result=[]
    for at in range(0,len(files['Bin/GraphicInfo.bin']),40):
        row=files['Bin/GraphicInfo.bin'][at:at+40];rid=struct.unpack_from('<I',row,36)[0]
        if 243697<=rid<=243709:
            off,size=struct.unpack_from('<II',row,4);result.append(dict(resourceId=rid,recordHex=row.hex(),bytesHex=files['Bin/Graphic.bin'][off:off+size].hex()))
    return result

def fixtures():
    _,records=prior.fixtures();_,_,base=native.fixtures();files={r['path']:bytes.fromhex(r['bytesHex'])for r in base}
    info,pixels=bytearray(files['Bin/GraphicInfo.bin']),bytearray(files['Bin/Graphic.bin'])
    known={struct.unpack_from('<I',info,at+36)[0]for at in range(0,len(info),40)}
    for row in graphics():
        if row['resourceId']in known:continue
        record=bytearray.fromhex(row['recordHex']);raw=bytes.fromhex(row['bytesHex']);struct.pack_into('<I',record,4,len(pixels));info.extend(record);pixels.extend(raw)
    files['Bin/GraphicInfo.bin'],files['Bin/Graphic.bin']=bytes(info),bytes(pixels)
    records=[]
    for at in range(0,len(info),40):
        n,off,size,ox,oy,w,h=struct.unpack_from('<IIIiiii',info,at);rid=struct.unpack_from('<I',info,at+36)[0];records.append(dict(index=n,resourceId=rid,originX=ox,originY=oy,width=w,height=h))
        raw=pixels[off:off+size];head=20 if raw[2]==2 else 16;native.skill.scene.IMAGES[n]=dict(index=n,resource=rid,origin=[ox,oy],width=w,height=h,pixels=raw[head:head+w*h],embedded=raw[head+w*h:]if raw[2]==2 else None)
    native.anime.geo=lambda kind,value:{k:r[k]for r in records if r['index'if kind=='index'else'resourceId']==value for k in['index','originX','originY','width','height']}
    index,data=bytearray(files['Bin/AnimeInfo.bin']),bytearray(files['Bin/Anime.bin'])
    for row in prior.additions()+additions():
        index.extend(struct.pack('<IIHH',row['resourceId'],len(data),row.get('actions',1),0));data.extend(bytes.fromhex(row['bytesHex']))
    files['Bin/AnimeInfo.bin'],files['Bin/Anime.bin']=bytes(index),bytes(data)
    return native.anime.parse([dict(index=bytes(index),animation=bytes(data),graphicBase=0)]),records

class Body(prior.Body):
    def vital_style(self,style,amount):
        if style in[3,5,6]:super().vital_style(style,amount)
    def body_step(self):
        state=self.state
        if state==102:
            while self.tuples[self.tuple_read][0]!=-1:self.tuple_read+=1
            self.tuple_read+=1;self.pop()
        elif state==103:
            target=self.w.bodies[self.tuples[self.tuple_read][0]];n=self.counter;self.action=16;self.percent=50
            if target is not self:
                x,y=target.position;self.position=[x,f(y-70)]if n<31 else[f(x+70),y]if n<61 else[x,f(y+70)]if n<91 else[f(x-70),y];self.aim(target.position)
            self.counter+=1
            if n>119:
                self.counter=0;self.percent=100;self.pop()
                if target is not self:target.pop()
            self.animate(self.body,0)
        elif state==104:self.action=13;self.pop()
        elif state==48:
            self.action=10
            if self.animate(self.body,1)==1:self.pop()
        elif state==107:self.w.clone_body(self);self.pop()
        elif state==108:self.rush()
        elif state==109:self.eject()
        elif state==105:self.body['deleted']=True;self.detached=True
        elif state in[54,55,57]:
            self.action={54:5,55:13,57:15}[state]
            if self.animate(self.body,1)==1:
                self.body['q']['nextFrame']=self.body['q']['delay']=0
                if state==54:self.body['q']['signal']=0
                self.pop()
        elif state==156:
            if not self.flags&0x60:self.animate(self.body,0)
            if not self.skill:self.w.node(self,'charge',resource=0x1adbc,flags=0x40000,position=self.position[:],parent=self.body,mask=4,maskValue=4,face=0);self.skill=1
            self.state=157
        elif state==87:self.w.shake=0;self.pop()
        elif state in[119,120,121]:
            if not self.flags&0x60:self.animate(self.body,0)
            if not self.skill:
                n=self.w.node(self,'physical-result-charge',resource=0x1ae1d+8*(state-119),flags=0x48000,position=[self.position[0],f(self.position[1]+int(self.body['q']['drawOffsetY']/2))],parent=self.body,screenSpace=True,face=0,mask=4,maskValue=4);self.skill=1
            self.state=157
        elif state in[146,179,199]:numeric.Body.body_step(self)
        else:super().body_step()
    def rush(self):
        self.action=3;self.speed=16.;self.percent=290;done=getattr(self,'rush_done',0);target=self.w.bodies.get(self.tuples[self.tuple_read][0])
        if target:self.aim(target.position)
        old=self.counter;self.counter+=1;animate=True;move=False
        if old<60 or done:
            if self.counter<60 and not done:self.percent-=self.counter*4
            elif done:
                old_cooldown=self.cooldown;self.cooldown-=1
                if old_cooldown:self.speed=2.;self.percent=100;animate=False;move=True
        else:
            self.percent=50
            if int(math.dist(self.position,target.position))<70:
                if self.slot>=0:
                    while True:
                        target=self.w.bodies[self.tuples[self.tuple_read][0]];target.aim(self.position);flags=self.tuples[self.tuple_read][1]&0xffffffff;target.reaction_flags=flags
                        if flags&8:target.state=29
                        elif flags&0x80000:
                            if not flags&0xe000:
                                resource=0x1adb1+self.w.random.range(0,2);self.w.impact_node(target.body,resource)
                                next(n for n in reversed(self.w.nodes)if n['kind']=='impact'and n['owner']is target)['scale']=[2.,2.]
                                self.w.random.next();target.vitals[0]=0
                                if flags&0x20:target.flags|=2;target.aux=1;self.w.slow=True
                            if flags&0x2000:
                                resource=0x1adb1+self.w.random.range(0,2);self.w.impact_node(self.body,resource)
                                next(n for n in reversed(self.w.nodes)if n['kind']=='impact'and n['owner']is self)['scale']=[2.,2.]
                                self.w.random.next();self.vitals[0]=0
                                if flags&0x20:self.flags|=2;self.aux=1;self.w.slow=True
                                self.pop()
                        target.pop();self.cooldown=(((flags>>19)&1)+1)*14;self.tuple_read+=1
                        if self.tuples[self.tuple_read][0]==-1:break
                self.move();self.counter=0;self.rush_done=1;self.after_image_enabled=0;self.action=5;self.body['q']['signal']=0
                guard=0
                while not 10000<=self.body['q']['signal']<=19999:
                    guard+=1;assert guard<=65536;self.animate(self.body,0)
                self.body['q']['signal']=0
            else:move=True
        if move:self.move()
        if not getattr(self,'rush_done',0)or self.cooldown:
            if animate:self.animate(self.body,0)
        else:self.speed=8.;self.percent=100;self.action=3;self.counter=self.rush_done=self.cooldown=0;self.pop()
    def eject(self):
        self.action=8;self.percent=100;self.finish+=1;limit=(((self.flags>>1)&1)+1)*14
        if self.finish<limit:
            self.speed=-2.
            if self.flags&2:self.w.slow=True;self.aux=1;self.move();self.animate(self.body,0);return
        else:
            if self.finish==limit:
                if self.flags&2:
                    if sum(b.aux==1 for b in self.w.bodies.values())<2:self.w.slow=False
                    self.aux=0;self.saved|=2
                for _ in range(40):self.w.smoke(self)
                self.counter=self.cooldown=0;self.speed=32.;self.flip()
            x,y=self.position
            if x< -200 or x>840 or y< -200 or y>680:self.pop();self.cooldown=0;self.w.shake=1;self.w.limit=6
        self.move();self.animate(self.body,0)

def initialization(c):
    plan=queues(c)
    for row in plan['rows']:
        row['assignments'].pop('messageResource',None);row['assignments'].pop('effectResource',None)
        row['tuples']=[t+[0]for t in row['tuples']]
    return plan

native.Body=Body
native.queues=initialization

class World(prior.World):
    def __init__(self,animations,records,c):
        native.World.__init__(self,animations,records,c)
        self.plan=queues(c)
        for row in self.plan['rows']:
            b=self.bodies[row['slot']];b.msg=row['assignments'].get('messageResource',0);b.effect=row['assignments'].get('effectResource',0)
        for slot,b in self.bodies.items():
            b.vitals=c.get('vitals',{}).get(str(slot),[70,100,10,10])[:]
    make_numeric=numeric.World.make_numeric
    def clone_body(self,p):
        b=Body(self,0,p.resource);b.body.update(parent=p.body,drawPriority=p.body['drawPriority'])
        b.slot=-1;b.flags=b.saved=0;b.actor_flags=0x20000;b.angle=p.angle;b.face=p.face;b.position=p.position[:];b.category=p.category;b.level=0;b.cost=b.skill=0;b.speed=0.;b.percent=100
        b.after_image_enabled=p.after_image_enabled;b.body['q']=native.anime.initial();b.animate(b.body,0);b.screen(b.body)
        b.resource=0x18aa7;b.actor_flags|=0x8000;b.after_image_enabled=1;b.actions=[0,24,108,105,-1];b.read=0;b.write=3;b.busy=1
        b.tuples=[p.tuples[p.tuple_read][:],[-1,0,0,0]]+[[0,0,0,0]for _ in range(198)];b.tuple_read=0;b.pop()
    def smoke(self,b):
        percent=self.random.range(10,200);angle=float(self.random.range(0,359));speed=float(self.random.range(5,20))
        self.node(b,'upper-skill-smoke',resource=0x1adb4,flags=0x40000,position=[b.position[0],f(b.position[1]+int(b.body['q']['geometry']['height']/2))],parent=b.body,manual=True,percent=percent,angle=angle,speed=speed,face=0)
    def step_effect(self,n):
        if n['kind']=='upper-skill-smoke':
            n['position']=native.prior.movement(*n['position'],n['angle'],n['speed']);n['deleted']=self.animate(n,1)==1;self.screen(n)
        elif n['kind']=='physical-result-charge':
            if self.animate(n,1)==1:self.done(n)
        elif n['kind'].startswith('numeric-skill-'):numeric.World.step_effect(self,n)
        else:super().step_effect(n)

def render_reference(w,selector):
    p=w.project_casting();scene=native.skill.scene
    depth=scene.pointer_sort([dict(id=n['id'],y=n['screen'][1],alternateY=n['alternateY'],flags=n['actorFlags'],depthKey=0)for n in p['nodes']if n['actorFlags']&0x20000])
    priorities={node:(i+9)&255 for i,node in enumerate(depth)};commands=[];skipped=[]
    for n in p['nodes']:
        q=n['animation'];flags=n['actorFlags']
        reason='renderer-filter'if(flags&0x8000 and selector==0 or flags&0x10000 and selector==1)else'graphic-missing'if q['graphicIndex']==-1 else'deleted'if n['deleted']else'hidden'if flags&2 else None
        if reason:skipped.append(dict(id=n['id'],reason=reason));continue
        scale=n['scale'];commands.append(dict(id=n['id'],kind=n['kind'],index=q['graphicIndex'],
            flags=(q['drawFlags']&~n['drawFlagMask'])|(n['drawFlagValue']&n['drawFlagMask']),
            x=n['screen'][0]+int(q['drawOffsetX']*scale[0]),y=n['screen'][1]+int(q['drawOffsetY']*scale[1]),
            priority=priorities.get(n['id'],n['drawPriority']),**({'scale':scale}if scale!=[1,1]else{})))
    bg=next(g for g in scene.IMAGES.values()if g['resource']==1000)
    commands.append(dict(id=None,kind='background',index=bg['index'],flags=0,x=320+bg['origin'][0]+w.offset[0],y=240+bg['origin'][1]+w.offset[1],priority=0))
    plan=dict(depthOrder=depth,commands=commands,skipped=skipped,drawOrder=[commands[i]['id']for i in sorted(range(len(commands)),key=lambda i:(commands[i]['priority'],-i))])
    return dict(planDigest=native.digest(plan),rgbaSha256=scene.raster(commands))

def main():
    q=[]
    for k in CLASSES:
        for level in range(10):
            for p,t in[(0,10),(20,0),(21,10),(0,0),(1,1),(10,0)]:
                for flags in[0,2,0x80000,0x80020,0x82000,0x84000,0x88000,0x8e000,0x200000,0x200002,0x80000000,0xffffffff]:
                    c=case('queue',k,level,p,[[t,flags,-7]if k==108 else[t,flags]])
                    q.append(dict(case=c,expected=queues(c)))
    cases=[case('class'+str(k),k)for k in CLASSES]
    cases+=[case('inspect-fail',107,hits=[[10,0]]),case('inspect-nonlocal',107,caster=1),
        case('heal-self',108,hits=[[0,0x80000,7]]),case('heal-fail',108,hits=[[10,0,7]]),
        case('heal-pet',108,caster=20,hits=[[0,0x80000,7]]),case('heal-tier0',108,9),
        case('cleanse-rejected',109,hits=[[10,0x200000]]),case('cleanse-rejected-dead',109,hits=[[10,0x200002]]),
        case('cleanse-fail',109,hits=[[10,0]]),case('cleanse-pet',109,caster=20,hits=[[0,0x80000]]),
        case('rush-fail',112,hits=[[10,0]]),case('rush-dodge',112,hits=[[10,8]]),
        case('rush-guard',112,hits=[[10,0x84000]]),case('rush-absorb',112,hits=[[10,0x88000]]),
        case('rush-reflect',112,caster=1,hits=[[10,0x82000]]),
        case('modifier-self',114,hits=[[0,0x80000]]),case('modifier-fail',114,hits=[[10,0]]),
        case('gesture-self',117,hits=[[0,0x80000]]),case('gesture-fail',117,hits=[[10,0]]),
        case('gesture-multi',117,hits=[[10,0x80000],[11,0],[10,0x80000]])]
    result=dict(schema='moli.upper-skills-reference.stage285.v1',authority='independent source equations and authored archives;no product imports or original execution',
        reference=dict(path=str(PATH.relative_to(ROOT)),sha256=sha256(PATH.read_bytes()).hexdigest()),addedAnimations=additions(),addedGraphics=graphics(),queues=q,cases=cases)
    animations,records=fixtures();traces=[]
    for c in cases:
        w=World(animations,records,c);states=[];rasters=[]
        for i in range(520):
            frame=w.step();states.append(native.digest(frame))
            if i in[0,6,12,18,29,59,89,119,149,179,209,239,269,299,359,449,519]:
                for selector in[0,1]:rasters.append(dict(frame=i+1,selector=selector,**render_reference(w,selector)))
            if all(not b.busy for b in w.bodies.values())and all(n['kind']in['body','status-skill-modifier']for n in w.nodes):break
        traces.append(dict(case=c,states=states,rasters=rasters,settled=all(not b.busy for b in w.bodies.values()),final=frame))
        print(c['name'],len(states),traces[-1]['settled'],flush=True)
    result.update(traces=traces,frames=sum(len(t['states'])for t in traces),rgbaFrames=sum(len(t['rasters'])for t in traces))
    (HERE/'original-vectors.json').write_text(json.dumps(result,separators=(',',':'))+'\n')
    print(json.dumps(dict(queues=len(q),cases=len(cases))))

if __name__=='__main__':main()
