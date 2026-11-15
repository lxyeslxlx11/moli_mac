#!/usr/bin/env python3
"""Independent fixed-PE82 equations and original synthetic bytes; no product imports."""
from pathlib import Path
from types import SimpleNamespace
import importlib.util,json,copy
A=Path(__file__).resolve().parent
s=importlib.util.spec_from_file_location('moving_prior_equations',A.parent/'game-battle-moving-numeric-v1/generate_vectors.py');prior=importlib.util.module_from_spec(s);s.loader.exec_module(prior)
f=prior.f;digest=prior.digest;anime=prior.anime;skill=prior.skill;layout=prior.layout;signed=prior.prior.signed
def queues(c):
    rows={};p=c['caster']
    def row(s):return rows.setdefault(s,dict(slot=s,actions=[],tuples=[],assignments={}))
    def act(s,*v):row(s)['actions'].extend(v)
    midpoint=[188,203]if p<10 else[449,336]
    row(p)['assignments'].update(classCode=82,skillLevel=c['level'],mpCost=c.get('cost',3),rememberedPosition=midpoint,effectResource=0x120)
    act(p,24,53,147,8,6,10,78,83,34,89,84,35,87,*([244]if p==c['local']else[50,49]))
    extra=0
    for h in c['hits']:
        target,flags,value=h[:3];rids=h[3]if flags&0x800000 else None
        if rids:extra=rids[0]
        t=[target,signed(flags),value,extra];row(p)['tuples'].append(t)
        if rids:row(p)['tuples'].extend([[target,signed(flags),rids[0],rids[1]],[target,signed(flags),rids[2],0],t[:]])
        row(target)['assignments'].update(classCode=82,skillLevel=c['level'])
        if not flags&0x108:
            if flags&0x40:act(target,32,*([244]if target==c['local']else[50,49]))
            elif value!=0 and flags&3:act(target,160 if flags&2 else 26)
        if value!=0 or flags&0x108:act(target,11)
        if flags&0x20 and not flags&0x10000:act(target,44)
    row(p)['tuples'].append([-1,0,0,0]);return dict(rows=list(rows.values()))
def boundary(c):return None if c['hits']else'skill82-empty-target-runtime-unobserved'
class Body(prior.Body):
    def body_step(self):
        state=self.state
        if self.category==82 and state==83:
            self.action=9;self.scale=[f(n+f(.01))for n in self.scale];self.face=(self.face+1)%8
            if self.scale[0]>=2:self.w.impact_node(self.body,0x1ae4a);self.pop()
            if not self.flags&0x60:self.animate(self.body,0)
        elif self.category==82 and state==34:
            if not self.flags&0x60:self.animate(self.body,0)
            self.counter+=1
            if self.counter>=30:self.counter=0;self.pop()
        elif self.category==82 and state==89:self.actor_flags|=2;self.pop();self.animate(self.body,0)
        elif self.category==82 and state==87:self.w.shake=0;self.pop()
        elif self.category==82 and state==84:
            while True:
                target,flags,value,_=self.tuples[self.tuple_read];flags&=0xffffffff;victim=self.w.bodies[target]
                victim.frozen=0;victim.aim(self.position);victim.reaction_flags=flags
                recipient=self if flags&0x2000 else victim
                if flags&0x200000:self.w.message(recipient,0x5739)
                if flags&0x400000:self.w.message(recipient,0x573a)
                if flags&0x800000:
                    rid0,rid1=self.tuples[self.tuple_read+1][2:4];rid2=self.tuples[self.tuple_read+2][2];self.tuple_read+=3;self.w.message(recipient,0x5738);recipient.rider(rid0,rid1);recipient.attachment(rid2)
                if flags&0x1000000:self.w.message(recipient,0x573a)
                if flags&0x2000000:self.w.message(recipient,0x5738)
                target,flags,value,_=self.tuples[self.tuple_read];flags&=0xffffffff
                if flags&0x20:victim.flags|=2;victim.aux=1;self.w.slow=True
                if flags&0x100000:victim.remove_link('status');victim.flags&=~0x20
                if value==0 and flags&0x10000000:self.w.message(victim,0x57bb)
                else:
                    self.w.number_style(victim,value,6)
                    if flags&2:self.w.message(victim,0x57b6)
                victim.vitals[0]=max(0,signed(victim.vitals[0]-value));victim.state=victim.actions[victim.read]
                if victim.state==0:victim.pop()
                self.tuple_read+=1
                if self.tuples[self.tuple_read][0]==-1:break
            self.w.shake=1;self.w.limit=6;self.pop()
        else:super().body_step()
class World(prior.World):
    def __init__(self,animations,records,c):
        self.animations,self.records=animations,records;self.nodes=[];self.next_id=1;self.random=skill.old.Random(12345);self.phase=self.passes=0;self.slow=False;self.events=[];self.bodies={};self.local=c['local'];self.alt=False;self.offset=[0,0];self.overlay_counter=self.overlay_direction=0;self.submissions=[];self.shake=self.amplitude=self.limit=0;self.case=c;self.field=None;self.used=False;self.phase2=False;self.stopped=False
        self.manager=SimpleNamespace(slot=None,body=None,links={},screen=lambda n:None);self.character_flags(c.get('C_flags',0))
        for slot in sorted(set([c['caster']]+[h[0]for h in c['hits']])):
            b=Body(self,slot,c.get('resource',100060));self.bodies[slot]=b;b.after_image_enabled=b.after_image_counter=0;b.raw=c.get('flags',{}).get(str(slot),0)
            if b.raw&0x1000:b.scale=[f(1.3),f(1.3)]
            if b.raw&0x3f0:self.condition(b,0x1adfb+(b.raw&0x3f0).bit_length()-5)
            if b.raw&0x800:self.toggle(b,True)
        self.plan=queues(c)
        for r in self.plan['rows']:
            b=self.bodies[r['slot']];b.actions=r['actions']+[-1]if r['actions']else[0,-1];b.read=0;b.write=len(r['actions'])-1;b.busy=int(bool(r['actions']));b.tuples=r['tuples']+[[-1,0,0,0]]+[[0,0,0,0]for _ in range(199-len(r['tuples']))];b.tuple_read=0
            for key,value in r['assignments'].items():setattr(b,{'classCode':'category','skillLevel':'level','mpCost':'cost','rememberedPosition':'remember','effectResource':'effect'}[key],value)
        b=self.bodies[c['caster']];b.state=b.actions[0]
    def project_casting(self):
        p=super().project_casting()
        for row,n in zip(p['nodes'],self.nodes):
            if n['kind']=='rider':row['scale']=n['owner'].scale[:]
        return p
def main():
    animations,records,files=prior.prior.fixtures();cases=[]
    def case(name,caster=0,hits=None,level=0,local=0,**kw):return dict(name=name,category=82,level=level,caster=caster,hits=[[10,1,12]]if hits is None else hits,cost=3,local=local,**kw)
    for level in range(10):cases.extend([case('local-level%d'%level,level=level),case('nonlocal-level%d'%level,caster=1,level=level),case('second-side-level%d'%level,caster=10,hits=[[0,1,12]],level=level,local=10)])
    for name,flags,value in [('plain',0,12),('critical',3,17),('zero',0,0),('message-zero',0x10000000,0),('message-nonzero',0x10000000,12),('dodge',8,12),('zero-dodge',8,0),('zero100',0x100,0),('not-reflection',0x10000,12),('not-absorb',0x40000,12),('20000',0x20000,12),('KO',0x21,120),('scatter',0x40,12),('negative',1,-7),('signed-min',1,-2147483648),('signed-max',1,2147483647),('metadata',0x3600001,12)]:cases.append(case(name,hits=[[10,flags,value]]))
    cases.extend([case('nonlocal-KO',1,[[10,0x21,120]]),case('target-local-stop',1,[[0,0x41,12]]),case('multi',hits=[[10,1,7],[11,3,9],[12,8,0]]),case('duplicate',hits=[[10,1,7],[10,3,9]]),case('self',hits=[[0,1,12]]),case('nonlocal-self',1,[[1,1,12]]),case('RID',hits=[[10,0x800001,9,[100040,100041,100050]]]),case('RID-caster',hits=[[10,0x802001,9,[100040,100041,100050]]]),case('RID-then-plain',hits=[[10,0x800001,9,[100040,100041,100050]],[11,1,8]]),case('RID-clear',hits=[[10,0x800001,9,[100060,0,0]]]),case('scaled',flags={'0':4096}),case('remove-status',hits=[[10,0x100001,12]],flags={'10':32}),case('empty',hits=[])])
    for caster,target in [(20,0),(21,10)]:cases.append(case('slot%d'%caster,caster,[[target,1,12]]))
    cases.append(case('nonlocal-second-side',10,[[0,1,12]]))
    queue_cases=[]
    for level in range(10):
        for caster,target,local in[(0,10,0),(1,10,0),(10,0,10),(20,0,0),(21,10,0),(0,0,0),(1,1,0)]:
            for flags in [0,1,3,8,0x20,0x40,0x100,0x108,0x10000,0x20000,0x40000,0x100000,0x200000,0x400000,0x1000000,0x2000000,0x800000,0x802001,0x10000000,0xffffffff]:
                h=[target,flags,12]+([[100040,100041,100050]]if flags&0x800000 else[]);c=case('queue-%d-%d-%d-%x'%(level,caster,target,flags),caster,[h],level,local);queue_cases.append(dict(case=c,expected=queues(c),portableBoundary=boundary(c)))
    queue_cases.extend(dict(case=c,expected=queues(c),portableBoundary=boundary(c))for c in cases)
    traces=[]
    for c in cases:
        if boundary(c):traces.append(dict(case=c,portableBoundary=boundary(c),states=[],rasters=[],stopped=False,bodySettled=False));continue
        w=World(animations,records,c);states=[];rasters=[]
        for i in range(1400):
            frame=w.step();states.append(digest(frame))
            if i<8 or i%23==0:
                for selector in [0,1]:rasters.append(dict(frame=i+1,selector=selector,**prior.render_reference(w,selector)))
            if w.stopped:break
            if all(b.detached or not b.busy for b in w.bodies.values())and all(n['kind']in {'body','status','status-skill-overlay','status-skill-field'}for n in w.nodes):break
        settled=all(b.detached or not b.busy for b in w.bodies.values());traces.append(dict(case=c,states=states,rasters=rasters,stopped=w.stopped,bodySettled=settled,final=frame));print(c['name'],len(states),w.stopped,settled,flush=True)
    out=dict(schema='moli.skill82-reference-stage202.v1',authority='Independent original-source equations and original synthetic bytes; no product imports/original execution',files=files,geometry=records,queues=queue_cases,traces=traces,frames=sum(len(t['states'])for t in traces),rgbaFrames=sum(len(t['rasters'])for t in traces));(A/'original-vectors.json').write_text(json.dumps(out,separators=(',',':'))+'\n');print(json.dumps(dict(queues=len(queue_cases),scenarios=len(traces),states=out['frames'],RGBA=out['rgbaFrames'],stops=sum(t['stopped']for t in traces),bodySettled=sum(t['bodySettled']for t in traces))))
if __name__=='__main__':main()
