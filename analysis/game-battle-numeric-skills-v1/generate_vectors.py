#!/usr/bin/env python3
"""Independent equations from fixed37c4 dispatcher/body/constructor observations. No product imports."""
from pathlib import Path
from types import SimpleNamespace
import importlib.util,json,struct
A=Path(__file__).resolve().parent
s=importlib.util.spec_from_file_location('prior_status_equations',A.parent/'game-battle-status-skills-v1/generate_vectors.py');prior=importlib.util.module_from_spec(s);s.loader.exec_module(prior)
f=prior.f;digest=prior.digest;anime=prior.anime;skill=prior.skill;signed=prior.prior.signed;TIER=prior.TIER
def queues(c):
    rows={};p=c['caster'];category=c['category'];level=c['level'];reflectors=[];total=0;last=None
    def row(s):return rows.setdefault(s,dict(slot=s,actions=[],tuples=[],assignments={}))
    def push(s,*values):row(s)['actions']+=list(values)
    def record(s,target,flags,amount):row(s)['tuples'].append([target,signed(flags),amount,0])
    row(p)['assignments'].update(classCode=category,skillLevel=level,mpCost=c.get('cost',3),chantResource=0x1ae01+TIER[level]);push(p,24,53,38,135,62)
    for target,raw,amount in c['hits']:
        flags=raw
        if flags&0x10000:reflectors.append(target);last=(target,raw);total=signed(total+amount);flags&=0xffffffdf
        record(p,target,flags,amount);row(target)['assignments'].update(classCode=category,skillLevel=level)
        special=p==20 and target<10 or p==21 and target>=10
        if not special:push(target,146)
        if special:record(target,p,flags,amount);push(target,179,72)
        if flags&0x40000:push(target,124)
        elif flags&0x20000:
            push(target,123,154,30);row(target)['assignments'].update(numberValue=amount,numberStyle=0 if flags&0x10000000 else 6)
            if flags&0x20:push(target,44,45)
        elif flags&0x10000:push(target,122)
        else:
            if not special:push(target,155)
            row(target)['assignments'].update(numberValue=amount,numberStyle=0 if flags&0x10000000 else 5)
    record(p,-1,0,0)
    if total:
        target,flags=last;row(target)['assignments'].update(classCode=category,skillLevel=level);push(target,1,137);push(p,0,146,155)
        row(p)['assignments'].update(numberValue=total,numberStyle=5);record(target,p,flags&0xfffeffff,total);push(target,72)
    return dict(rows=list(rows.values()),reflectors=reflectors,reflectedAmount=total)
def fixtures():
    _,_,records=prior.fixtures();files={r['path']:bytes.fromhex(r['bytesHex'])for r in records}
    info=bytearray(files['Bin/GraphicInfo.bin']);pixels=bytearray(files['Bin/Graphic.bin']);ids={struct.unpack_from('<I',info,i+36)[0]for i in range(0,len(info),40)}
    for k,ch in enumerate('-0123456789'):
        rid=243700-48+ord(ch)
        if rid in ids:continue
        w,h=8,8;pix=bytes(0 if (j+k)%4==0 else 17+(j+k)%3 for j in range(w*h));raw=b'RD\0\0'+struct.pack('<iiI',w,h,16+len(pix))+pix;row=bytearray(40)
        struct.pack_into('<IIIiiii',row,0,10000+k,len(pixels),len(raw),-2,-3,w,h);struct.pack_into('<I',row,36,rid);info+=row;pixels+=raw
    files['Bin/GraphicInfo.bin']=bytes(info);files['Bin/Graphic.bin']=bytes(pixels);geometry=[]
    for at in range(0,len(info),40):
        n,off,size,ox,oy,w,h=struct.unpack_from('<IIIiiii',info,at);rid=struct.unpack_from('<I',info,at+36)[0];geometry.append(dict(index=n,resourceId=rid,originX=ox,originY=oy,width=w,height=h));raw=files['Bin/Graphic.bin'][off:off+size];head=20 if raw[2]==2 else 16;skill.scene.IMAGES[n]=dict(index=n,resource=rid,origin=[ox,oy],width=w,height=h,pixels=raw[head:head+w*h],embedded=raw[head+w*h:]if raw[2]==2 else None)
    anime.geo=lambda kind,value:{k:r[k]for r in geometry if r['index'if kind=='index'else'resourceId']==value for k in ['index','originX','originY','width','height']}
    return anime.parse([dict(index=files['Bin/AnimeInfo.bin'],animation=files['Bin/Anime.bin'],graphicBase=0)]),geometry,[dict(path=p,bytesHex=b.hex())for p,b in files.items()]
class Body(prior.Body):
    def vital_style(self,style,amount):
        if style in[3,5,6]:super().vital_style(style,amount)
    def body_step(self):
        state=self.state
        if state==135:
            self.action=6
            if not self.skill:self.children['chant']=self.w.make_numeric(self,'chant',self.chant);self.skill=1
            if 10000<=self.body['q']['signal']<20000:
                if 'chant'in self.children:
                    self.remove_child('chant')
                    while self.tuples[self.tuple_read][0]!=-1:
                        target=self.w.bodies[self.tuples[self.tuple_read][0]];target.state=target.actions[target.read];self.tuple_read+=1
                    self.tuple_read+=1
                self.body['q']['signal']=0
            if self.animate(self.body,1)==1:
                if 'chant'in self.children:
                    self.remove_child('chant');self.tuple_read+=1
                    while self.tuples[self.tuple_read][0]!=-1:self.tuple_read+=1
                self.skill=0;self.pop()
        elif state==137:self.w.bodies[self.tuples[self.tuple_read][0]].pop();self.pop()
        elif state in[146,179]:
            if not self.flags&0x60:self.animate(self.body,0)
            if not self.skill:
                rid=0x1ae05+TIER[self.level];child=self.w.make_numeric(self,'charge',rid,flags=0x48000)
                if rid==0x1ae05:self.w.make_numeric(self,'overlay',0x1ae68,flags=0x48000,parent=child,drawPriority=203)
                self.skill=1
            self.state=199 if state==179 else 157
        elif state in[154,155]and self.number_style==0:
            if not self.flags&0x60:self.animate(self.body,0)
            self.w.message(self,0x57bb)
            if state==154:self.pop()
            else:self.state=35
        elif state==199:
            if not self.flags&0x60:self.animate(self.body,0)
            self.actor_flags&=~2;self.body['alpha']=min(255,self.body.get('alpha',self.body['q']['color']>>24)+3)
            self.actor_flags=self.actor_flags|0x8000 if self.body['alpha']<255 else self.actor_flags&~0x8000
            for n in self.links.values():n['alpha']=self.body['alpha'];n['flags']=(n['flags']&~2)|(0x8000 if self.body['alpha']<255 else 0)
            if self.skill==2:
                self.body['presentationOffset']=[0,0];target,flags,amount,_=self.tuples[self.tuple_read]
                if amount==0 and flags&0x10000000:self.w.message(self.w.bodies[target],0x57bb)
                elif self.number_style>=0:self.w.number_style(self,self.number_value,self.number_style)
                self.vital_style(self.number_style,self.number_value);self.skill=3
            if self.skill==3:self.counter+=1;self.skill+=int(self.counter>59)
            if self.skill==4 and self.body['alpha']==255:self.skill=self.counter=0;self.body.pop('alpha',None);self.body.pop('presentationOffset',None);self.pop()
        else:super().body_step()
class World(prior.World):
    def __init__(self,animations,records,case):
        self.animations,self.records=animations,records;self.nodes=[];self.next_id=1;self.random=skill.old.Random(12345);self.phase=self.passes=0;self.slow=False;self.events=[];self.bodies={};self.local=case.get('local',0);self.alt=False;self.offset=[0,0];self.overlay_counter=self.overlay_direction=0;self.submissions=[];self.shake=self.amplitude=self.limit=0;self.case=case;self.field=None;self.used=False;self.phase2=True
        self.manager=SimpleNamespace(slot=None,body=None,links={},screen=lambda n:None);self.character_flags(case.get('C_flags',0))
        for slot in sorted(set([case['caster']]+[h[0]for h in case['hits']])):
            b=Body(self,slot,case.get('resource',100060));self.bodies[slot]=b;raw=case.get('flags',{}).get(str(slot),0);b.raw=raw
            if raw&0x3f0:self.condition(b,0x1adfb+(raw&0x3f0).bit_length()-5)
            if raw&0x800:self.toggle(b,True)
        self.plan=queues(case)
        for row in self.plan['rows']:
            b=self.bodies[row['slot']];b.actions=row['actions']+[-1];b.read=0;b.write=len(row['actions'])-1;b.busy=1;b.tuples=row['tuples']+[[-1,0,0,0]]+[[0,0,0,0]for _ in range(199-len(row['tuples']))];b.tuple_read=0
            for k,v in row['assignments'].items():setattr(b,{'classCode':'category','skillLevel':'level','mpCost':'cost','chantResource':'chant','numberValue':'number_value','numberStyle':'number_style'}[k],v)
        b=self.bodies[case['caster']];b.state=b.actions[0]
    def make_numeric(self,b,kind,resource,flags=0x40000,parent=None,drawPriority=204):
        n=self.node(b,'numeric-skill-'+kind,resource=resource,flags=flags,position=b.position[:],parent=parent or b.body,manual=True);n['drawPriority']=drawPriority;self.screen(n);return n
    def step_effect(self,n):
        kind=n['kind']
        if kind=='numeric-skill-chant':
            if n['parent']['deleted']:n['deleted']=True
            self.animate(n,0);self.screen(n)
        elif kind=='numeric-skill-charge':
            if self.animate(n,1)==1:
                if not n['parent']['deleted']and n['owner'].skill:n['owner'].skill=2
                n['deleted']=True
            self.screen(n)
        elif kind=='numeric-skill-overlay':
            if n['parent']['deleted']:n['deleted']=True
            self.animate(n,0);self.screen(n)
        else:super().step_effect(n)
def main():
    animations,records,files=fixtures();cases=[]
    def case(name,category=61,level=0,caster=0,hits=None,**kw):return dict(name=name,category=category,level=level,caster=caster,hits=[[10,0,12]]if hits is None else hits,cost=3,local=0,**kw)
    for category in[61,62,63]:
        for level in range(10):cases.append(case('class%d-level%d'%(category,level),category,level))
        for name,flags,amount in [('damage',0x20000,12),('damage-KO',0x20020,120),('absorb',0x40000,12),('reflect',0x10000,12),('zero',0x10000000,0),('zero-nonzero',0x10000000,12),('negative',0,-7),('signed-min',0,-2147483648),('heal-overflow',0,2147483647),('damage-overflow',0x20000,-2147483648),('all-three',0x70020,7),('damage-reflect',0x30020,7),('reflect-absorb',0x50020,7),('plain-high',0x800000,7)]:cases.append(case('%s-%d'%(name,category),category,hits=[[10,flags,amount]]))
        cases.extend([case('self-%d'%category,category,hits=[[0,0,7]]),case('multi-%d'%category,category,hits=[[10,0,7],[11,0x20000,9],[12,0x40000,3]]),case('reflectors-%d'%category,category,hits=[[10,0x10000,7],[11,0x10000,9]]),case('reflect-last-plain-%d'%category,category,hits=[[10,0x10000,7],[11,0,9]]),case('zero-sum-%d'%category,category,hits=[[10,0x10000,7],[11,0x10000,-7]]),case('duplicate-reflect-%d'%category,category,hits=[[10,0x10000,7],[10,0x10000,9]])])
        for caster,target in[(20,0),(20,10),(21,10),(21,0)]:
            for flags in[0,0x10000000,0x40000,0x20000,0x10000]:cases.append(case('slot%d-target%d-%x-%d'%(caster,target,flags,category),category,9,caster,[[target,flags,0 if flags==0x10000000 else 7]]))
    cases.extend([case('duplicate-heal',hits=[[10,0,7],[10,0,9]]),case('duplicate-mixed',hits=[[10,0,7],[10,0x20000,9]]),case('empty',hits=[]),case('ignored-word',ignoredWord=0x11223344),case('prolonged-chant',resource=100070),case('reflect-overflow',hits=[[10,0x10000,2147483647],[11,0x10000,1]]),case('self-reflect',hits=[[0,0x10000,7]])])
    queue_cases=[]
    for category in[61,62,63]:
        for level in range(10):
            for caster,target in[(0,10),(0,0),(20,0),(20,10),(21,10),(21,0)]:
                for flags in[0,0x20,0x10000,0x20000,0x40000,0x30020,0x50020,0x60020,0x70020,0x10000000,0x10020000,0xffffffff]:
                    c=case('queue-%d-%d-%d-%d-%x'%(category,level,caster,target,flags),category,level,caster,[[target,flags,12]]);queue_cases.append(dict(case=c,expected=queues(c)))
    queue_cases.extend(dict(case=c,expected=queues(c))for c in cases)
    traces=[]
    for c in cases:
        w=World(animations,records,c);states=[];rasters=[]
        for i in range(600):
            frame=w.step();states.append(digest(frame))
            if i<7 or i%31==0 or c.get('resource')==100070 and i<90:
                for selector in[0,1]:rasters.append(dict(frame=i+1,selector=selector,**prior.prior.render_reference(w,selector)))
            if all(b.detached or not b.busy for b in w.bodies.values())and all(n['kind']in{'body','rider','attachment','status','status-skill-overlay','status-skill-field'}for n in w.nodes):break
        settled=all(b.detached or not b.busy for b in w.bodies.values());traces.append(dict(case=c,states=states,rasters=rasters,settled=settled,commandSettled=settled and not w.phase2,commandPhase2Waiting=w.phase2,final=frame));print(c['name'],len(states),settled,flush=True)
    out=dict(schema='moli.numeric-skills-reference-stage200.v1',authority='Independent Python source equations; no product imports or original execution',files=files,geometry=records,queues=queue_cases,traces=traces,frames=sum(len(t['states'])for t in traces),rgbaFrames=sum(len(t['rasters'])for t in traces))
    (A/'original-vectors.json').write_text(json.dumps(out,separators=(',',':'))+'\n');print(json.dumps(dict(cases=len(traces),settled=sum(t['settled']for t in traces),queues=len(queue_cases),states=out['frames'],rgbaFrames=out['rgbaFrames'])))
if __name__=='__main__':main()
