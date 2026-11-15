#!/usr/bin/env python3
# coding: utf-8
"""Independent fixed-PE status/utility equations and original synthetic fixtures."""
from pathlib import Path
import importlib.util, json, struct
from types import SimpleNamespace
A=Path(__file__).resolve().parent
s=importlib.util.spec_from_file_location('prior_casting_reference',A.parent/'game-battle-casting-v1/generate_vectors.py');prior=importlib.util.module_from_spec(s);s.loader.exec_module(prior)
pet=prior.pet;skill=prior.skill;anime=prior.anime;f=prior.f;digest=prior.digest;layout=prior.layout
CLASSES=list(range(32,61))+list(range(64,69))+[86,88];SELF={50,51,52,53,88};TIER=[3,3,3,2,2,2,1,1,1,0]
FIELD={50:0x1ae0c,51:0x1ae09,52:0x1ae0a,53:0x1ae0b,88:0x1ae4b}
CIRCLE_A=[48,44,34,18,0,-18,-34,-44,-48,-44,-34,-18,0,18,34,44]
CIRCLE_B=[0,14,26,44,47,44,26,14,0,-14,-26,-44,-47,-44,-26,-14]
def queues(c):
    rows={};p=c['caster'];kind=c['category'];level=c['level'];self_cast=kind in SELF
    def row(slot):return rows.setdefault(slot,dict(slot=slot,reset=False,actions=[],tuples=[],assignments={}))
    def act(slot,*values):row(slot)['actions'].extend(values)
    def put(slot,target,flags):row(slot)['tuples'].append([target,prior.signed(flags),0,0])
    chant=TIER[level]+(0x1ade4 if kind==86 else 0x1ae01 if kind in[64,65,66,68]else 0x1ade8)
    row(p)['assignments'].update(classCode=kind,skillLevel=level,mpCost=c.get('cost',3),chantResource=chant);act(p,24,53,38,135,62)
    for hit in c['hits']:
        target,flags=hit[:2];put(p,target,flags)
        if self_cast:continue
        r=row(target);r['assignments'].update(classCode=kind,skillLevel=level,numberStyle=-1)
        special=p==20 and target<10 or p==21 and target>=10
        if 55<=kind<=60:act(target,185 if special else 118)
        elif 64<=kind<=66:act(target,175 if special else 128)
        elif 32<=kind<=49:
            act(target,117)
            if flags&0x80000:act(target,138)
        elif kind==54:
            act(target,143)
            if flags&0x80000:act(target,144)
        elif kind==67:
            act(target,178 if special else 131)
            if flags&0x80000:act(target,139)
        elif kind==68:
            r.update(reset=True,actions=[],tuples=[]);act(target,145)
            if flags&0x80000:r['assignments'].update(speed=8,numberValue=hit[2],numberStyle=5);act(target,77,155)
            act(target,38)
        elif kind==86:
            act(target,132)
            if flags&0x80000:act(target,45,43,44)
    put(p,-1,0)
    return dict(rows=list(rows.values()))
def fixtures():
    _,_,files=prior.fixtures();files={r['path']:bytes.fromhex(r['bytesHex'])for r in files}
    info=bytearray(files['Bin/GraphicInfo.bin']);pixels=bytearray(files['Bin/Graphic.bin']);index=bytearray(files['Bin/AnimeInfo.bin']);data=bytearray(files['Bin/Anime.bin'])
    ids={struct.unpack_from('<I',info,i+36)[0]for i in range(0,len(info),40)}
    for k,rid in enumerate(range(0x70f1,0x70f5)):
        if rid in ids:continue
        w,h=12,10;pix=bytes(0 if(j+k)%5==0 else 17+(j+k)%3 for j in range(w*h));raw=b'RD\0\0'+struct.pack('<iiI',w,h,16+len(pix))+pix
        row=bytearray(40);struct.pack_into('<IIIiiii',row,0,9000+k,len(pixels),len(raw),-3,-4,w,h);struct.pack_into('<I',row,36,rid);info.extend(row);pixels.extend(raw)
    known={struct.unpack_from('<I',index,i)[0]for i in range(0,len(index),12)}
    for rid in range(0x1adb0,0x1ae70):
        if rid not in known:index.extend(struct.pack('<IIHH',rid,len(data),1,0));data.extend(anime.action(0,0,96,[(1002,-1,1,0),(1004,-1,1,0),(1005,-1,1,0)]))
    files.update({'Bin/GraphicInfo.bin':bytes(info),'Bin/Graphic.bin':bytes(pixels),'Bin/AnimeInfo.bin':bytes(index),'Bin/Anime.bin':bytes(data)});records=[]
    for at in range(0,len(info),40):
        n,off,size,ox,oy,w,h=struct.unpack_from('<IIIiiii',info,at);rid=struct.unpack_from('<I',info,at+36)[0];records.append(dict(index=n,resourceId=rid,originX=ox,originY=oy,width=w,height=h));raw=files['Bin/Graphic.bin'][off:off+size];head=20 if raw[2]==2 else 16;skill.scene.IMAGES[n]=dict(index=n,resource=rid,origin=[ox,oy],width=w,height=h,pixels=raw[head:head+w*h],embedded=raw[head+w*h:]if raw[2]==2 else None)
    def geo(kind,value):return{k:r[k]for r in records if r['index'if kind=='index'else'resourceId']==value for k in ['index','originX','originY','width','height']}
    anime.geo=geo
    return anime.parse([dict(index=bytes(index),animation=bytes(data),graphicBase=0)]),records,[dict(path=p,bytesHex=b.hex())for p,b in files.items()]
def resource_for(state,level):
    tier=TIER[level]
    if state in[117,184]:return 'charge',0x1adf7+tier,False,0x48000
    if state in[118,185]:return 'charge',0x1ae19+tier,False,0x40000
    if state in[128,175]:return 'charge',0x1ae60+tier,True,0x48000
    if state in[131,178]:return 'rise-emitter',0,False,0x40000
    if state in[132,192]:return 'charge',0x1ae4c,True,0x40000
    if state in[143,196]:return 'charge',0x1ae51+tier,False,0x40000
    if state==145:return 'fall-emitter',0,False,0x40000
    raise ValueError(state)
class Body(prior.Body):
    def body_step(self):
        state=self.state
        if state==135:
            self.w.used=True;self.action=6
            if not self.skill:self.children['chant']=self.w.chant(self);self.skill=1
            if 10000<=self.body['q']['signal']<20000:
                if 'chant'in self.children:
                    self.remove_child('chant')
                    if self.category in SELF:
                        if self.tuples[self.tuple_read][0]!=-1:self.w.set_field(FIELD[self.category]);self.tuple_read+=1
                    else:
                        while self.tuples[self.tuple_read][0]!=-1:
                            target=self.w.bodies[self.tuples[self.tuple_read][0]];target.state=target.actions[target.read];self.tuple_read+=1
                    self.tuple_read+=1
                self.body['q']['signal']=0
            if self.animate(self.body,1)==1:
                if 'chant'in self.children:
                    self.remove_child('chant');self.tuple_read+=1
                    while self.tuples[self.tuple_read][0]!=-1:self.tuple_read+=1
                self.skill=0;self.pop()
            if 'chant'in self.children and self.category==86:self.w.overlay(5)
        elif state in[117,118,128,131,132,143,145,175,178,185]:
            self.w.used=True
            if not self.flags&0x60:self.animate(self.body,0)
            if not self.skill:self.w.status_charge(self,state)
            self.state=199 if state in[175,178,185]else 157
        elif state==138:
            self.w.condition(self,0x1adfb+(self.category-32)%6)
            if not self.flags&0x60:self.animate(self.body,0)
            self.pop()
        elif state==139:self.remove_link('status');self.flags&=~0x3f0;self.animate(self.body,0);self.pop()
        elif state==144:self.w.toggle(self,not bool(self.flags&0x800));self.pop()
        elif state==77:
            for k in['shadow','element0','element1','element2','element3']:self.remove_link(k)
            self.action=0;self.flags&=~2;self.saved&=~2;self.pop()
        elif state==43:self.pop()
        elif state==45:self.flags|=2;self.pop()
        elif state==199 and self.number_style<0:
            if not self.flags&0x60:self.animate(self.body,0)
            self.actor_flags&=~2;self.body['alpha']=min(255,self.body.get('alpha',self.body['q']['color']>>24)+3)
            self.actor_flags=self.actor_flags|0x8000 if self.body['alpha']<255 else self.actor_flags&~0x8000
            for n in self.links.values():n['alpha']=self.body['alpha'];n['flags']=(n['flags']&~2)|(0x8000 if n['alpha']<255 else 0)
            if self.skill==2:self.body['presentationOffset']=[0,0];self.skill=3
            if self.skill==3:self.counter+=1;self.skill+=int(self.counter>59)
            if self.skill==4 and self.body['alpha']==255:self.skill=self.counter=0;self.body.pop('alpha',None);self.body.pop('presentationOffset',None);self.pop()
        else:super().body_step()
    def remove_link(self,key):
        n=self.links.pop(key,None)
        if n:n['deleted']=True
class World(prior.World):
    def __init__(self,animations,records,case):
        self.animations,self.records=animations,records;self.nodes=[];self.next_id=1;self.random=skill.old.Random(12345);self.phase=self.passes=0;self.slow=False;self.events=[];self.bodies={};self.local=case.get('local',0);self.alt=False;self.offset=[0,0];self.overlay_counter=self.overlay_direction=0;self.submissions=[];self.shake=self.amplitude=self.limit=0;self.case=case;self.field=None;self.used=False;self.phase2=False
        self.manager=SimpleNamespace(slot=None,body=None,links={},screen=lambda n:None)
        self.character_flags(case.get('C_flags',0))
        for slot in sorted(set([case['caster']]+[h[0]for h in case['hits']])):
            b=Body(self,slot,case.get('resource',100060));self.bodies[slot]=b;raw=case.get('flags',{}).get(str(slot),0);b.raw=raw
            if raw&0x3f0:self.condition(b,0x1adfb+(raw&0x3f0).bit_length()-5)
            if raw&0x800:self.toggle(b,True)
        self.plan=queues(case)
        for row in self.plan['rows']:
            b=self.bodies[row['slot']];b.actions=row['actions']+[-1];b.read=0;b.write=len(row['actions'])-1;b.busy=1;b.tuples=row['tuples']+[[-1,0,0,0]]+[[0,0,0,0]for _ in range(199-len(row['tuples']))];b.tuple_read=0
            if row['reset']:b.speed=1.;b.skill=b.counter=b.aux=b.reaction_count=b.cooldown=b.finish=0
            for k,v in row['assignments'].items():setattr(b,{'classCode':'category','skillLevel':'level','mpCost':'cost','chantResource':'chant','numberValue':'number_value','numberStyle':'number_style','speed':'speed'}[k],v)
        first=self.bodies[case['caster']];first.state=first.actions[0]
    def make(self,b,kind,resource=0,position=None,flags=0x40000,**kw):
        n=self.node(b,'status-skill-'+kind,resource=resource,flags=flags,position=position or b.position[:],parent=kw.pop('parent',b.body),manual=True,**kw);self.screen(n);return n
    def chant(self,b):return self.make(b,'chant',b.chant)
    def status_charge(self,b,state):
        kind,rid,offset,flags=resource_for(state,b.level);q=b.body['q'];position=[b.position[0],f(b.position[1]+(int(q['drawOffsetY']/2)if offset else 0))]if kind=='charge'else[f(int(q['geometry']['width']/2)+q['drawOffsetX']+b.body['screen'][0]),f(b.body['screen'][1])]
        extra={'completed':0,'slots':[0]*32,'emitterIndex':0}if kind=='fall-emitter'else{'completed':0,'emitted':0}if kind=='rise-emitter'else{}
        self.make(b,kind,rid,position,flags,**extra);b.skill=1
    def set_field(self,resource):
        self.used=True
        if self.field and not self.field['deleted']:self.field['resource']=resource;return
        self.field=self.make(self.manager,'field',resource,[318,270.5],parent=None);self.field['drawPriority']=7;self.animate(self.field,1);self.screen(self.field,True)
    def character_flags(self,flags):
        if flags&0x20:return
        value=next((r for bit,r in[(1,0x1ae0c),(2,0x1ae09),(4,0x1ae0a),(8,0x1ae0b),(16,0x1ae4b)]if flags&bit),None)
        if value:self.set_field(value)
        elif self.field:self.field['deleted']=True;self.field=None
    def condition(self,b,rid):
        if 'status'in b.links:return
        b.flags|=16<<(rid-0x1adfb);n=self.node(b,'status',resource=rid,flags=0x60000,position=[b.position[0],f(b.position[1]+1)],parent=b.body);n['drawPriority']=9;self.animate(n,1);b.screen(n);b.links['status']=n
    def toggle(self,b,enabled):
        if not enabled:b.remove_link('overlay');b.flags&=~0x800;return
        self.used=True;b.flags|=0x800
        if 'overlay'in b.links:return
        n=self.make(b,'overlay',0x1ae48,[b.position[0],f(b.position[1]+1)],0x48000);n['drawPriority']=200;self.animate(n,1);self.screen(n,True);b.links['overlay']=n
    def overlay(self,group):
        if group!=5:return super().overlay(group)
        if not self.overlay_direction:
            self.overlay_counter+=1
            if self.overlay_counter>15:self.overlay_counter=15;self.overlay_direction=1
        else:
            self.overlay_counter-=1
            if self.overlay_counter<0:self.overlay_counter=0;self.overlay_direction=0
        self.submissions.extend(dict(resourceId=0x70f1+(self.overlay_counter>>2),x=32+64*x,y=24+48*y,priority=3)for x in range(10)for y in range(10))
    def born_particle(self,n,kind,index):
        if kind=='rise':x,y=CIRCLE_A[index%16],CIRCLE_B[index%16];extra=dict(velocity=0.,acceleration=f(.1),crossing=n['screen'][1]+y-100)
        else:x,y=CIRCLE_A[15-index%16],CIRCLE_B[15-index%16];extra=dict(crossing=n['screen'][1]+y-40)
        self.make(n['owner'],kind+'-particle',0x1adbb if kind=='rise'else 0x1adec,[f(n['screen'][0]+x),f(n['screen'][1]+y-(100 if kind=='fall'else 0))],parent=n,**extra)
    def done(self,n):
        if not n['parent']['deleted']and n['owner'].skill:n['owner'].skill=2
        n['deleted']=True
    def step_effect(self,n):
        kind=n['kind'];b=n['owner']
        if kind=='status':
            if n['parent']['deleted']:n['deleted']=True
            else:self.animate(n,0);n['position']=[b.position[0],f(b.position[1]+1)]
        elif kind=='status-skill-field':self.animate(n,0);self.screen(n,True)
        elif kind=='status-skill-overlay':
            if n['parent']['deleted']:n['deleted']=True
            else:self.animate(n,0);n['position']=[b.position[0],f(b.position[1]+1)]
            self.screen(n,True)
        elif kind=='status-skill-chant':
            if n['parent']['deleted']:n['deleted']=True
            self.animate(n,0);self.screen(n)
        elif kind=='status-skill-charge':
            if self.animate(n,1)==1:self.done(n)
            self.screen(n)
        elif kind=='status-skill-rise-emitter':
            before=n['state'];n['state']+=1
            if before>0 and n['emitted']<32:n['state']=0;self.born_particle(n,'rise',n['emitted']);n['emitted']+=1
            if n['completed']>31:self.done(n)
        elif kind=='status-skill-fall-emitter':
            before=n['state'];n['state']+=1
            if before>1:
                n['state']=0
                for i in range(n['emitterIndex']+1):
                    if n['slots'][i]<4:self.born_particle(n,'fall',i);n['slots'][i]+=1
                n['emitterIndex']=min(31,n['emitterIndex']+1)
            if n['completed']>127:self.done(n)
        elif kind in['status-skill-rise-particle','status-skill-fall-particle']:
            if kind.endswith('rise-particle'):
                if n['parent']['deleted']:n['deleted']=True;return
                n['velocity']=f(n['velocity']-n['acceleration']);n['position'][1]=f(n['position'][1]+n['velocity']);cross=n['position'][1]<n['crossing']
            else:n['position'][1]=f(n['position'][1]+3);cross=n['position'][1]>n['crossing']
            if cross:n['parent']['completed']+=1;n['deleted']=True
            self.animate(n,0);self.screen(n)
        else:super().step_effect(n)
    def project_casting(self):
        p=super().project_casting()
        for row in p['bodies']:
            b=self.bodies[row['slot']];row.update(numberStyle=b.number_style,numberValue=b.number_value,rawStatusFlags=b.raw)
        for row,n in zip(p['nodes'],self.nodes):
            if n['kind'].startswith('status-skill-'):row['statusSkill']=dict(completed=n.get('completed'),emitted=n.get('emitted'),emitterIndex=n.get('emitterIndex'),emitterSlots=n.get('slots'),velocity=n.get('velocity'),acceleration=n.get('acceleration'),crossing=n.get('crossing'))
        if self.used:p['statusSkills']=dict(used=True,fieldNodeId=self.field['id']if self.field else None,fieldResource=self.field['resource']if self.field else None)
        return p
def main():
    animations,records,files=fixtures();cases=[]
    def case(name,category=32,level=0,caster=0,hits=None,**kw):return dict(name=name,category=category,level=level,caster=caster,hits=hits if hits is not None else[[caster,0]]if category in SELF else[[10,0x80000,7]]if category==68 else[[10,0x80000]],cost=3,local=0,**kw)
    for category in CLASSES:
        for level in range(10):cases.append(case('class%d-level%d'%(category,level),category,level))
    for category in[32,37,38,43,44,49,54,55,60,64,66,67,68,86]:
        cases.extend([case('clearflag-%d'%category,category,hits=[[10,0,7]]if category==68 else[[10,0]]),case('self-%d'%category,category,hits=[[0,0x80000,7]]if category==68 else[[0,0x80000]]),case('special20-%d'%category,category,caster=20,hits=[[0,0x80000,7]]if category==68 else[[0,0x80000]])])
    for category in SELF:cases.append(case('sentinel-%d'%category,category,hits=[]))
    cases.extend([case('multi32',32,hits=[[10,0x80000],[11,0x80000],[12,0]]),case('multi67',67,hits=[[10,0x80000],[11,0]]),case('multi68',68,hits=[[10,0x80000,-7],[11,0,9],[12,0x80000,2147483647]]),case('duplicate68',68,hits=[[10,0x80000,7],[10,0x80000,9]]),case('C-status-retain32',32,flags={'10':32}),case('C-status-clear67',67,flags={'10':32}),case('C-overlay-toggle54',54,flags={'10':2048}),case('C-field-update50',50,C_flags=4),case('prolonged86',86,resource=100070)])
    queue_cases=[]
    for c in cases:
        for flags in[0,1,0x80000,0x80001,0x100000,0x80000000,0xffffffff]:
            hits=[[c['caster'],flags]]if c['category']in SELF else[[10,flags,-7]]if c['category']==68 else[[10,flags]]
            q={**c,'hits':hits};queue_cases.append(dict(case=q,expected=queues(q)))
    traces=[]
    for c in cases:
        w=World(animations,records,c);states=[];rasters=[]
        for i in range(1300):
            frame=w.step();states.append(digest(frame))
            if i<7 or i%31==0 or c.get('resource')==100070 and i<90:
                for selector in[0,1]:rasters.append(dict(frame=i+1,selector=selector,**prior.render_reference(w,selector)))
            persistent={'body','rider','attachment','status','status-skill-overlay','status-skill-field'}
            if all(b.detached or not b.busy for b in w.bodies.values())and all(n['kind']in persistent for n in w.nodes):break
        settled=all(b.detached or not b.busy for b in w.bodies.values());traces.append(dict(case=c,states=states,rasters=rasters,settled=settled,final=frame));print(c['name'],len(states),settled,flush=True)
    out=dict(schema='moli.status-skills-reference-stage199.v1',authority='Independent Python source equations; no product code imports or original execution',files=files,geometry=records,queues=queue_cases,traces=traces,frames=sum(len(t['states'])for t in traces),rgbaFrames=sum(len(t['rasters'])for t in traces))
    (A/'original-vectors.json').write_text(json.dumps(out,separators=(',',':'))+'\n');print(json.dumps(dict(cases=len(traces),settled=sum(t['settled']for t in traces),queues=len(queue_cases),states=out['frames'],rgbaFrames=out['rgbaFrames'])))
if __name__=='__main__':main()
