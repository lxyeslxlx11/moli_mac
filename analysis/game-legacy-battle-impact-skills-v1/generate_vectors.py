"""Independent fixed37c4 producer/callback equations; authored archives, no product imports."""
from pathlib import Path
from hashlib import sha256
from types import SimpleNamespace
import importlib.util,copy,json,math,struct
HERE=Path(__file__).resolve().parent
ROOT=HERE.parents[1]
def load(name,path):
    s=importlib.util.spec_from_file_location(name,path);m=importlib.util.module_from_spec(s);s.loader.exec_module(m);return m
upper=load('impact_upper_reference',HERE.parent/'game-legacy-battle-upper-skills-v1/generate_vectors.py')
physical=load('impact_projectile_reference',HERE.parent/'game-battle-physical-projectiles-v1/generate_vectors.py')
area=load('impact_area_reference',HERE.parent/'game-battle-skill82-v1/generate_vectors.py')
native=upper.native;anime=native.anime;skill=native.skill;f=native.f;signed=physical.signed
CLASSES=[4,97,106,111,116]
POSITIONS=[[(285,105),(222,142),(158,178),(94,214),(30,250),(345,156),(281,192),(218,228),(154,264),(90,300)],
 [(610,290),(545,325),(480,360),(415,395),(350,430),(545,240),(481,276),(418,313),(354,349),(290,385)]]
def case(name,category=4,level=0,caster=0,hits=None,**kw):
    return dict(dict(name=name,category=category,level=level,caster=caster,cost=3,local=0,word=2,resource=100095,hits=[[10,1,12]]if hits is None else hits),**kw)
def queues(c):
    rows={};p=c['caster'];k=c['category'];level=c['level']
    def row(s):return rows.setdefault(s,dict(slot=s,actions=[],tuples=[],assignments={}))
    def add(s,*steps):row(s)['actions'].extend(steps)
    own=row(p);own['assignments'].update(classCode=k,skillLevel=level,mpCost=c['cost'])
    if k!=97:own['assignments']['physicalVariant']=c['word']
    heads={4:[24,53,147,68],97:[24,53,38,147,135,62,78,86,85,84,87],106:[24,53,156,75,34,89,101],111:[24,53,156,7,9,10,73,106],116:[24,53,156]+([110,62]if level==9 else[])}
    add(p,*heads[k])
    if k==97:own['assignments'].update(chantResource=0x1ade4+native.TIER[level],effectResource=5)
    opaque=0
    for target,flags,value,*tail in c['hits']:
        if flags&0x800000:opaque=tail[0][0]
        packed=[target,signed(flags),value,opaque];own['tuples'].append(packed)
        if flags&0x800000:
            a,b,d=tail[0];own['tuples'].extend([[target,signed(flags),a,b],[target,signed(flags),d,0],packed[:]])
        if k==97:row(target)['assignments'].update(classCode=k,skillLevel=level)
        else:add(target,0)
        if k==116 and level<9:add(p,110,72,62)
        if not flags&0x108:
            if flags&0x40:add(target,32,*([244]if target==c['local']else[50,49]))
            elif value!=0 and flags&3:
                if k!=97 and flags&0x8000:add(target,121)
                elif k!=97 and flags&0x4000:add(target,120)
                elif k!=97 and flags&0x2000:add(target,119)
                elif k!=4 or not flags&0x20000000:add(target,160 if flags&2 else 26)
        if (value!=0 or flags&0x108)and(k==97 or not flags&(0x2000e000 if k==4 else 0xe000)):
            add(target,11)
            if k!=97 and flags&0x100:add(target,74)
        if flags&0x20 and(k!=97 or not flags&0x10000):add(target,44)
    if k==111:add(p,74,7,11,10)
    if k==116:add(p,62)
    return dict(rows=list(rows.values()))
def additions():
    return [dict(resourceId=rid,actions=160,bytesHex=b''.join(anime.action(d,a,96,[(1002,-1,1,0),(1004,-1,1,10001 if a in[5,6,7]else 0),(1005,-1,1,0)])for d in range(8)for a in range(20)).hex())for rid in[100095,101111]]
def fixtures():
    _,_=upper.fixtures();_,_,base=native.fixtures();files={r['path']:bytes.fromhex(r['bytesHex'])for r in base}
    info,pixels=bytearray(files['Bin/GraphicInfo.bin']),bytearray(files['Bin/Graphic.bin'])
    added=upper.graphics();known={struct.unpack_from('<I',info,i+36)[0]for i in range(0,len(info),40)}
    for r in added:
        if r['resourceId']in known:continue
        row=bytearray.fromhex(r['recordHex']);raw=bytes.fromhex(r['bytesHex']);struct.pack_into('<I',row,4,len(pixels));info.extend(row);pixels.extend(raw)
    own=[];next_index=max(struct.unpack_from('<I',info,i)[0]for i in range(0,len(info),40))+1
    for rid in[0x565a,0x666c]:
        w,h=8,7;paint=bytes(0 if(i+rid)%5==0 else 17+(i+rid)%3 for i in range(w*h));raw=b'RD\0\0'+struct.pack('<iiI',w,h,16+len(paint))+paint
        row=bytearray(40);struct.pack_into('<IIIiiii',row,0,next_index,len(pixels),len(raw),-3,-4,w,h);struct.pack_into('<I',row,36,rid);own.append(dict(resourceId=rid,recordHex=bytes(row).hex(),bytesHex=raw.hex()));info.extend(row);pixels.extend(raw);next_index+=1
    records=[]
    for at in range(0,len(info),40):
        n,off,size,ox,oy,w,h=struct.unpack_from('<IIIiiii',info,at);rid=struct.unpack_from('<I',info,at+36)[0];records.append(dict(index=n,resourceId=rid,originX=ox,originY=oy,width=w,height=h));raw=pixels[off:off+size];head=20 if raw[2]==2 else 16;skill.scene.IMAGES[n]=dict(index=n,resource=rid,origin=[ox,oy],width=w,height=h,pixels=raw[head:head+w*h],embedded=raw[head+w*h:]if raw[2]==2 else None)
    anime.geo=lambda kind,value:{k:r[k]for r in records if r['index'if kind=='index'else'resourceId']==value for k in['index','originX','originY','width','height']}
    index,data=bytearray(files['Bin/AnimeInfo.bin']),bytearray(files['Bin/Anime.bin'])
    for r in upper.prior.additions()+upper.additions()+additions():index.extend(struct.pack('<IIHH',r['resourceId'],len(data),r.get('actions',1),0));data.extend(bytes.fromhex(r['bytesHex']))
    return anime.parse([dict(index=bytes(index),animation=bytes(data),graphicBase=0)]),records,own
class Body(upper.Body):
    def __init__(self,w,slot,resource):super().__init__(w,slot,resource);self.role=None;self.variant=0;self.frozen=0
    distance=physical.Body.distance
    def metadata(self):
        target,flags,_,_=self.tuples[self.tuple_read];flags&=0xffffffff;recipient=self.w.bodies[self.slot]if flags&0x2000 else self.w.bodies[target]
        if flags&0x200000:self.w.message(recipient,0x5739)
        if flags&0x400000:self.w.message(recipient,0x573a)
        if flags&0x800000:
            a,b=self.tuples[self.tuple_read+1][2:4];d=self.tuples[self.tuple_read+2][2];self.tuple_read+=3;self.w.message(recipient,0x5738);recipient.rider(a,b);recipient.attachment(d)
        if flags&0x1000000:self.w.message(recipient,0x573a)
        if flags&0x2000000:self.w.message(recipient,0x5738)
    def vital(self,index,amount):
        raw=signed(self.vitals[index]-amount)
        if raw<0:self.w.random.next()
        self.vitals[index]=max(0,raw)
    def result_number(self,victim,flags,value,style=6):
        if value==0 and flags&0x10000000:self.w.message(victim,0x57bb)
        else:
            self.w.number_style(victim,value,style)
            if flags&2:self.w.message(victim,0x57b6)
    def burst(self,kind):
        while True:
            t,flags,value,_=self.tuples[self.tuple_read];flags&=0xffffffff;victim=self.w.bodies[t]
            res=110000 if flags&4 else 0x1ae12 if flags&0x400 else 0x1ae37 if kind==106 and(flags&0x200 or self.tuple_read==0)else 0x1adb1+self.w.random.range(0,2)
            victim.aim(self.w.bodies[self.slot].position if kind==112 and self.level<9 else self.position)
            if kind==106 and self.tuple_read==0:self.w.impact_node(victim.body,0x1adbe)
            victim.reaction_flags=flags;self.metadata()
            if kind==112 and self.tuple_read==0 and self.level<9:self.w.impact_node(self.body,0x1ae4e)['scale']=[f(1+f(int(self.level/10)+.1))]*2
            _,flags,value,_=self.tuples[self.tuple_read];flags&=0xffffffff
            if flags&8:victim.state=29
            elif flags&0x100:victim.after_image_enabled=1;victim.state=29
            else:
                if not flags&0xe000 and value:
                    if flags&2:self.w.impact_node(victim.body,0x1adb8)
                    self.w.impact_node(victim.body,res);victim.vital(0,value)
                    if flags&0x20:victim.flags|=2;victim.aux=1;self.w.slow=True
                if not flags&0xe000:
                    if flags&0x100000:victim.remove_link('status');victim.flags&=~0x20
                    victim.pop();self.result_number(victim,flags,value)
                elif flags&0x8000:victim.pop()
                elif flags&0x4000:victim.pop();victim.vitals[0]=min(victim.vitals[1],signed(victim.vitals[0]+value));self.result_number(victim,flags,value,5)
                else:victim.pop()
            if not flags&8 and value:self.cooldown=(((victim.flags>>1)&1)+1)*14
            self.tuple_read+=1
            if self.tuples[self.tuple_read][0]==-1:break
    def clone_hit(self):
        self.action=5;self.percent=100;signal=self.body['q']['signal']
        if signal>9999:
            t,flags,value,_=self.tuples[self.tuple_read];flags&=0xffffffff;v=self.w.bodies[t];res=110000 if flags&4 else 0x1ae12 if flags&0x400 else 0x1adb1+self.w.random.range(0,2)
            v.frozen=0;v.category=-1;v.attacker=self;v.reaction_flags=flags;v.aim(self.position);final=signal<20000 or bool(flags&0x2000)
            if final:self.metadata()
            _,flags,value,_=self.tuples[self.tuple_read];flags&=0xffffffff
            if flags&8:v.state=29
            elif flags&0x100:
                if not final or not v.after_image_enabled:v.after_image_enabled=1;v.state=29
            else:
                if not flags&0xc000 and value:
                    v.position=v.remember[:]
                    if final and flags&0x2000:
                        if flags&2:self.w.impact_node(self.body,0x1adb8)
                        self.w.impact_node(v.body,res);self.reaction_flags=0x2000
                        if flags&0x20:self.flags|=2;self.aux=1;self.w.slow=True
                    else:
                        if flags&0x100000:v.remove_link('status');v.flags&=~0x20
                        if flags&2:self.w.impact_node(v.body,0x1adb8)
                        self.w.impact_node(v.body,res)
                        if final and flags&0x20:v.flags|=2;v.aux=1;self.w.slow=True
                        if not final:v.state=25
                if final:
                    if flags&0x8000:v.pop()
                    elif flags&0x4000:v.pop();v.vitals[0]=min(v.vitals[1],signed(v.vitals[0]+value));self.result_number(v,flags,value,5)
                    elif flags&0x2000:self.pop();v.pop();self.vital(0,value);self.result_number(self,flags,value);self.tuple_read+=1
                    else:
                        v.pop()
                        if value==0:self.w.message(v,0x57bb if flags&0x10000000 else 0x573b)
                        else:v.vital(0,value);self.result_number(v,flags,value)
            _,flags,value,_=self.tuples[self.tuple_read]
            if not flags&8 and value:self.cooldown=(((v.flags>>1)&1)+1)*14
            self.body['q']['signal']=0
        if self.cooldown>0:self.cooldown-=1
        if self.cooldown==0:
            if self.finish==0:
                if self.animate(self.body,1)!=1:return
            elif self.finish>10:self.pop();self.tuple_read+=1;self.cooldown=self.finish=0;return
            self.finish+=1
    def body_step(self):
        s=self.state
        if self.role:physical.Body.body_step(self);return
        if getattr(self,'clone',False)and s==24:
            t=self.tuples[self.tuple_read][0];v=self.w.bodies.get(t)
            if v is None or self.slot==t or v.state==0:
                if v:v.remember=v.body['screen'][:]
                self.pop()
            else:self.action=0;self.animate(self.body,0)if not self.flags&0x60 else None
        elif getattr(self,'clone',False)and s==14:self.clone_hit()
        elif s==68 and self.category==4:
            self.action=5;self.percent=100;t=self.tuples[self.tuple_read][0]
            if t!=-1:self.aim(self.w.bodies[t].position)
            if self.animate(self.body,1)==1:self.pop()
            if 10000<=self.body['q']['signal']<20000:
                while True:
                    self.w.impact_projectile(self);self.tuple_read+=1
                    if self.tuples[self.tuple_read][0]==-1:break
                self.body['q']['signal']=0
        elif s==135 and self.category==97:
            self.w.used=True;self.action=6
            if not self.skill:self.children['chant']=self.w.chant(self);self.skill=1
            if 10000<=self.body['q']['signal']<20000:self.remove_child('chant');self.w.shake=1;self.w.limit=6;self.body['q']['signal']=0
            if self.animate(self.body,1)==1:self.remove_child('chant');self.skill=0;self.pop()
        elif s==86:self.w.shake=1;self.w.limit=6;self.pop()
        elif s==85 and self.category==97:
            for x,y in POSITIONS[int(self.slot>=10)]:
                if self.w.random.range(0,2)==0:
                    rid=0x1adb7+self.w.random.range(-1,0);dy=self.w.random.range(-60 if self.slot<10 else-80,0);dx=self.w.random.range(-30 if self.slot<10 else-40,30 if self.slot<10 else 40)
                    n=self.w.node(self,'impact-skill-spark',resource=rid,flags=0x48000,position=[0,0],manual=True,mask=4,maskValue=4,face=0);n['screen']=[x+dx,y+dy]
                    self.w.random.range(0,30)
            self.counter+=1
            if self.counter>269:self.counter=0;self.pop()
            self.animate(self.body,0)
        elif(s==84 and self.category==97)or(s==83 and getattr(self,'ball',False)):
            old=self.category;self.category=82;area.Body.body_step(self);self.category=old
        elif s==101 and self.category==106:
            while True:
                clone=self.w.detached(self);clone.clone=True;clone.actions=[24,75,89,9,90,14,105,-1];clone.read=0;clone.write=6;clone.busy=1;clone.tuples[0]=self.tuples[self.tuple_read][:];clone.tuples[1]=[-1,0,0,0];clone.state=24;self.tuple_read+=1
                if self.tuples[self.tuple_read][0]==-1:break
            self.pop()
        elif s==106 and self.category==111:
            self.action=5;self.percent=200
            if 10000<=self.body['q']['signal']<20000:self.burst(106);self.speed=8.;self.percent=100;self.counter=0;self.body['q']['signal']=0
            if self.animate(self.body,1)==1:self.pop()
        elif s==110 and self.category==116:self.flight()
        elif s==111 and getattr(self,'ball',False):
            self.position[1]=self.flat_y;self.move();back=self.back;back.position=[self.position[0],f(self.position[1]-self.body['q']['drawOffsetY'])];self.flat_y=self.position[1];delta=self.counter-30;self.position[1]=f(f(f(delta*delta)*self.acceleration-100)+self.position[1]);old=self.counter;self.counter+=1
            if old>=60:self.position=self.point[:];self.pop();back.body['deleted']=True;self.counter=0
        elif s==112 and getattr(self,'ball',False):self.burst(112);self.pop()
        elif s==75:self.actor_flags|=0x8000;self.pop()
        elif s in[89,90]:self.actor_flags=self.actor_flags|2 if s==89 else self.actor_flags&~2;self.pop();self.animate(self.body,0)
        elif s==34:
            if not self.flags&0x60:self.animate(self.body,0)
            self.counter+=1
            if self.counter>=30:self.counter=0;self.pop()
        else:super().body_step()
    def flight(self):
        if self.animate(self.body,1)==1:self.pop()
        self.action=7 if 100000<=self.resource<=100999 or 105000<=self.resource<=106800 else 5
        if self.level<9:self.aim(self.w.bodies[self.tuples[self.tuple_read][0]].position)
        if not 10000<=self.body['q']['signal']<20000:return
        back=self.w.detached(self);back.resource=0x565a;back.action=back.face=0;back.animate(back.body,0)
        front=self.w.detached(self);front.resource=0x666c;front.action=front.face=0;front.animate(front.body,0);front.body['parent']=back.body;front.ball=True;front.back=back;front.level=self.level
        target=self.tuples[self.tuple_read][0];front.point=([449,336]if target<10 else[188,203])if self.level==9 else list(map(int,self.w.bodies[target].position))
        if self.level==9:self.aim(front.point)
        front.position[1]=f(front.position[1]+int(self.body['q']['drawOffsetY']/2));front.screen(front.body);front.aim(front.point);back.aim(front.point)
        dx,dy=[abs(front.point[i]-front.body['screen'][i])for i in range(2)]
        front.speed=f(abs(skill.old.sine(front.angle))*f(dy/60)+f(abs(skill.old.sine(f(front.angle+90)))*f(dx*f(.016666668))));front.flat_y=front.position[1];front.acceleration=f(100/900);front.body['height']=100.
        front.actions=[111]+([83,34]if self.level==9 else[])+[112,105,-1];front.read=0;front.write=len(front.actions)-2;front.busy=1;front.state=111
        if self.level<9:front.tuples[0]=self.tuples[self.tuple_read][:];front.tuples[1]=[-1,0,0,0]
        else:
            copied=[]
            while self.tuples[self.tuple_read][0]!=-1:copied.append(self.tuples[self.tuple_read][:]);self.tuple_read+=1
            front.tuples[:len(copied)+1]=copied+[[-1,0,0,0]]
        self.body['q']['signal']=0
        if self.level<9 and self.tuples[self.tuple_read+1][0]>=0:self.pop()
class World(upper.World):
    def __init__(self,animations,records,c):
        self.animations,self.records=animations,records;self.nodes=[];self.next_id=1;self.random=skill.old.Random(12345);self.phase=self.passes=0;self.slow=False;self.events=[];self.bodies={};self.local=c['local'];self.alt=False;self.offset=[0,0];self.overlay_counter=self.overlay_direction=0;self.submissions=[];self.shake=self.amplitude=self.limit=0;self.case=c;self.field=None;self.used=False;self.phase2=False;self.stopped=False
        self.manager=SimpleNamespace(slot=None,body=None,links={},screen=lambda n:None)
        for slot in sorted(set([c['caster']]+[h[0]for h in c['hits']])):
            b=Body(self,slot,c['resource']);self.bodies[slot]=b;b.raw=c.get('flags',{}).get(str(slot),0);b.vitals=c.get('vitals',{}).get(str(slot),[70,100,10,10])[:]
            if b.raw&0x3f0:self.condition(b,0x1adfb+(b.raw&0x3f0).bit_length()-5)
        self.plan=queues(c)
        for row in self.plan['rows']:
            b=self.bodies[row['slot']];b.actions=row['actions']+[-1]if row['actions']else[0,-1];b.read=0;b.write=len(row['actions'])-1;b.busy=int(bool(row['actions']));b.tuples=copy.deepcopy(row['tuples'])+[[-1,0,0,0]]+[[0,0,0,0]for _ in range(199-len(row['tuples']))];b.tuple_read=0
            for key,value in row['assignments'].items():setattr(b,{'classCode':'category','skillLevel':'level','mpCost':'cost','physicalVariant':'variant','chantResource':'chant','effectResource':'effect'}[key],value)
        b=self.bodies[c['caster']];b.state=b.actions[0]
    impact_node=physical.World.impact_node
    copy_record=physical.World.copy_record
    arrow=physical.World.arrow
    result=physical.World.result
    def detached(self,p):
        b=Body(self,0,p.resource);b.slot=p.slot;b.body.update(parent=p.body,drawPriority=p.body['drawPriority']);b.saved=b.flags=b.skill=b.level=b.cost=0;b.actor_flags=0x20000;b.angle=p.angle;b.face=p.face;b.position=p.position[:];b.category=p.category;b.variant=p.variant;b.vitals=[0]*4;b.speed=0.;b.percent=100;b.tuples=[[0,0,0,0]for _ in range(200)];b.tuples[0][0]=-1;b.body['q']=anime.initial();b.animate(b.body,0);b.screen(b.body);return b
    def impact_projectile(self,p):
        t=p.tuples[p.tuple_read][0];v=self.bodies[t];b=Body(self,0,p.resource);b.role='single';b.flags=b.saved=b.face=b.action=0;b.resource=0;b.actor_flags=0x60002;b.body['drawPriority']=203;b.position=p.position[:];b.speed=10.;b.percent=100;b.aim(v.position,False);self.copy_record(p,b);b.state=16;b.slot=p.slot;b.body['q']=anime.initial();b.body['screen']=[0,0]
        q,e=p.body['q'],v.body['q'];self.arrow(b,[b.position[0],f(b.position[1]+q['drawOffsetY']+q['geometry']['height']*.5)],[v.position[0],f(v.position[1]+e['drawOffsetY']+e['geometry']['height']*.5)],0x1adc0)
        b.category,b.variant,b.level=p.category,p.variant,p.level;b.move();b.move();b.animate(b.body,0);b.body['screen']=list(map(int,b.position))
    def step_effect(self,n):
        if n['kind']=='impact-skill-spark':n['deleted']=self.animate(n,1)==1
        elif n['kind']=='physical-arrow':physical.World.step_effect(self,n)
        else:super().step_effect(n)
    def project_casting(self):
        p=super().project_casting()
        for row,n in zip(p['nodes'],self.nodes):
            b=n['owner']
            if n['kind']=='body'and b.role:row['physical']=dict(role=b.role,principal=b.slot,classCode=b.category,variant=b.variant,level=b.level,angle=b.angle,speed=b.speed,cooldown=b.cooldown,tupleRead=b.tuple_read,tupleWrite=b.written,tuples=[x for t in b.tuples for x in t],turnRate=0,headingSign=0,waypoint=[0,0])
        return p
def render_reference(w,selector):
    # The portable frame profile names the native blank index0 before its hidden-actor branch.
    old=native.digest
    def digest(plan):
        blank={n['id']for n in w.project_casting()['nodes']if 0<=n['animation']['graphicIndex']<1000}
        plan['skipped']=[dict(r,reason='graphic-empty')if r['id']in blank else r for r in plan['skipped']]
        return old(plan)
    native.digest=digest
    try:return upper.render_reference(w,selector)
    finally:native.digest=old
def main():
    animations,records,graphics=fixtures();q=[]
    flags=[0,1,3,8,0x100,0x108,0x21,0x41,0x2001,0x4001,0x8001,0xe001,0x100001,0x800001,0x20000001,0xffffffff]
    for k in CLASSES:
        for level in range(10):
            for p,t in[(0,10),(20,0),(21,10),(0,0),(1,1),(10,0)]:
                for bits in flags:
                    c=case('queue',k,level,p,[[t,bits,-7]+([[100040,100041,100050]]if bits&0x800000 else[])]);q.append(dict(case=c,expected=queues(c)))
    cases=[]
    for k in CLASSES:
        cases.extend([case('class'+str(k),k),case('critical'+str(k),k,hits=[[10,3,17]]),case('zero'+str(k),k,hits=[[10,0,0]]),case('dodge'+str(k),k,hits=[[10,8,12]]),case('heal'+str(k),k,hits=[[10,0x4001,9]]),case('multi'+str(k),k,hits=[[10,1,7],[11,3,9]])])
        cases.extend([case('KO'+str(k),k,hits=[[10,0x21,70]]),case('guard'+str(k),k,hits=[[10,0x100,12]]),case('self'+str(k),k,hits=[[0,1,7]]),case('zero-message'+str(k),k,hits=[[10,0x10000000,0]]),case('reflect'+str(k),k,hits=[[10,0x2001,9]])])
    cases.extend([case('level9-116',116,9,hits=[[10,1,7],[11,3,9]]),case('nonhuman-116',116,resource=101111),case('RID4',4,hits=[[10,0x800001,9,[100040,100041,100050]],[11,1,8]]),case('RID97',97,hits=[[10,0x800001,9,[100040,100041,100050]],[11,1,8]]),case('RID111',111,hits=[[10,0x800001,9,[100040,100041,100050]],[11,1,8]]),case('RID116level9',116,9,hits=[[10,0x800001,9,[100040,100041,100050]],[11,1,8]]),case('clone-reflect',106,hits=[[10,0x2001,9]]),case('clear111',111,hits=[[10,0x100001,7]],flags={'10':32}),case('opposite97',97,caster=10,hits=[[0,1,7]])])
    traces=[]
    for c in cases:
        w=World(animations,records,c);states=[];rasters=[]
        for i in range(800 if c['name']=='KO97'else 540):
            frame=w.step();states.append(native.digest(frame))
            if i in[0,6,18,29,59,89,119,149,179,209,239,269,299,359,449,539]:
                for selector in[0,1]:rasters.append(dict(frame=i+1,selector=selector,**render_reference(w,selector)))
            if all(b.detached or not b.busy for b in w.bodies.values())and all(n['kind']in['body','rider','attachment']for n in w.nodes)and not any(n['kind']=='body'and n['owner']not in w.bodies.values()for n in w.nodes):break
        traces.append(dict(case=c,states=states,rasters=rasters,settled=all(b.detached or not b.busy for b in w.bodies.values()),final=frame));print(c['name'],len(states),traces[-1]['settled'],flush=True)
    result=dict(schema='moli.impact-skills-source-reference.stage286.v1',authority='independent source equations and authored archives;no product imports or original execution',reference=dict(path=str(Path(__file__).relative_to(ROOT)),sha256=sha256(Path(__file__).read_bytes()).hexdigest()),addedAnimations=additions(),addedGraphics=graphics,queues=q,traces=traces,frames=sum(len(t['states'])for t in traces),rgbaFrames=sum(len(t['rasters'])for t in traces))
    (HERE/'original-vectors.json').write_text(json.dumps(result,separators=(',',':'))+'\n');print(json.dumps(dict(queues=len(q),cases=len(traces),states=result['frames'],RGBA=result['rgbaFrames'])))
if __name__=='__main__':main()
