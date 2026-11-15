#!/usr/bin/env python3
"""Independent source83 equations and original synthetic fixtures. No product imports."""
from pathlib import Path
import importlib.util,json,copy,math
A=Path(__file__).resolve().parent
s=importlib.util.spec_from_file_location('numeric_prior_equations',A.parent/'game-battle-numeric-skills-v1/generate_vectors.py');prior=importlib.util.module_from_spec(s);s.loader.exec_module(prior)
f=prior.f;digest=prior.digest;anime=prior.anime;skill=prior.skill;layout=prior.prior.layout;MID=[318,270]
def queues(c):
    p=prior.queues(c);row=next(r for r in p['rows']if r['slot']==c['caster']);tail=row['actions'][5:];row['actions']=[24,53,38,8,6,10,62,133,88 if c['caster']<20 else 193]+([244]if c['caster']==c['local']else[50,49])+tail
    row['assignments'].pop('chantResource');row['assignments']['rememberedPosition']=MID[:]
    return p
def boundary(c):
    if c['caster']!=c['local']:
        total=0
        for target,flags,value in c['hits']:
            if flags&0x10000:
                total=prior.signed(total+value)
                if target==c['caster']:return 'moving-numeric-removed-caster-reflection-runtime-unobserved'
        if total:return 'moving-numeric-removed-caster-reflection-runtime-unobserved'
    return None
def homing(angle,x,y):
    delta=skill.old.angle(x,y)-angle
    if delta>180:delta-=360
    elif delta<=-180:delta+=360
    return f(angle+((-20 if delta<0 else 20)if abs(int(delta))>=20 else delta))
class Body(prior.Body):
    def body_step(self):
        state=self.state;old_screen=self.body['screen'][:]
        if state==8:
            self.action=2;self.percent=100;self.aim(self.remember,True)
            if self.animate(self.body,1)==1:
                if self.flags&2:self.percent=200
                self.pop()
        elif state==6:
            self.action=3;self.speed=8.;self.percent=100;self.aim(self.remember,True);self.move()
            if self.reached(self.remember):self.position=self.remember[:];self.pop()
            self.animate(self.body,0)
        elif state in[133,193]:
            if not self.flags&0x60:self.animate(self.body,0)
            if not self.skill:
                n=self.w.make_numeric(self,'charge',0x1ae4d,flags=0x48000);n['position']=[self.position[0],f(self.position[1]+int(self.body['q']['drawOffsetY']/2))];self.w.screen(n);self.skill=1
            self.state=199 if state==193 else 157
        elif state==88:
            self.speed=10.;target=self.tuples[self.tuple_read][0]
            if self.body['q']['signal']==0 and target!=-1:
                self.after_image_enabled=1;other=self.w.bodies[target];self.angle=homing(self.angle,f(other.position[0]-self.position[0]),f(other.position[1]-self.position[1]))
                if self.body['q']['signal']==0 and int(math.sqrt(sum((x-y)**2 for x,y in zip(self.position,other.position))))<20:
                    other.state=other.actions[other.read]
                    if other.state==0:other.pop()
                    self.cooldown=4;self.tuple_read+=1
                    if self.tuples[self.tuple_read][0]==-1:self.body['q']['signal']=1
            if self.cooldown>0:self.cooldown-=1
            if self.cooldown==0:
                self.face=(self.face+1)%8;self.animate(self.body,0);self.move()
                if self.position[0]<-200 or self.position[0]>840 or self.position[1]<-200 or self.position[1]>680:self.tuple_read+=1;self.pop()
        elif state==137:self.pop()
        elif state==244:self.w.stopped=True
        else:super().body_step()
class World(prior.World):
    def node(self,owner,kind,priority=2,resource=0,flags=0,position=None,parent=None,**extra):
        n=dict(id=self.next_id,kind=kind,priority=priority,drawPriority=9 if kind=='body'else 204,resource=resource,flags=flags,position=list(owner.position)if position is None else position[:],screen=[0,0],state=0,counter=0,height=0.,deleted=False,q=anime.initial(),owner=owner,parent=parent,**extra);self.next_id+=1
        i=0
        while i<len(self.nodes)and(self.nodes[i]['priority']<priority or self.nodes[i]['priority']==priority and self.nodes[i]['id']<n['id']):i+=1
        self.nodes.insert(i,n);owner.screen(n);return n
    def __init__(self,animations,records,case):
        super().__init__(animations,records,case);self.stopped=False
        self.plan=queues(case)
        for b in self.bodies.values():b.__class__=Body;b.chant=0;b.after_image_enabled=b.after_image_counter=0
        for row in self.plan['rows']:
            b=self.bodies[row['slot']];b.actions=row['actions']+[-1];b.read=0;b.write=len(row['actions'])-1;b.busy=1;b.tuples=row['tuples']+[[-1,0,0,0]]+[[0,0,0,0]for _ in range(199-len(row['tuples']))];b.tuple_read=0
            for key,value in row['assignments'].items():setattr(b,{'classCode':'category','skillLevel':'level','mpCost':'cost','numberValue':'number_value','numberStyle':'number_style','rememberedPosition':'remember'}[key],value)
        b=self.bodies[case['caster']];b.state=b.actions[0]
    def after_image(self,b,old_screen):
        n=self.node(b,'moving-numeric-afterimage',resource=b.resource,flags=b.actor_flags|0x8000,position=b.position[:],manual=True,mask=b.mask,maskValue=b.mask_value)
        n.update(q=copy.deepcopy(b.body['q']),screen=old_screen[:],priority=b.body['priority'],drawPriority=b.body['drawPriority'],height=b.body['height'],state=b.state,counter=0,deleted=b.body['deleted'],scale=b.scale[:])
    def step_effect(self,n):
        if n['kind']=='moving-numeric-afterimage':n['counter']+=1;n['deleted']|=n['counter']>11
        else:super().step_effect(n)
    def project_casting(self):
        p=super().project_casting()
        for row in p['bodies']:
            b=self.bodies[row['slot']];row.update(afterImageEnabled=b.after_image_enabled,afterImageCounter=b.after_image_counter)
        for row,n in zip(p['nodes'],self.nodes):row['scale']=n['owner'].scale[:]if n['kind']=='body'else n.get('scale',[1.,1.])[:]
        return p
def render_reference(w,selector):
    # Source ordinary point-scale presentation, with complete RGBA from the original fixture.
    p=w.project_casting();scene=skill.scene;depth=scene.pointer_sort([dict(id=n['id'],y=n['screen'][1],alternateY=n['alternateY'],flags=n['actorFlags'],depthKey=0)for n in p['nodes']if n['actorFlags']&0x20000]);priorities={n:(i+9)&255 for i,n in enumerate(depth)};commands=[];skipped=[]
    for n in p['nodes']:
        q=n['animation'];flags=n['actorFlags'];reason='renderer-filter'if(flags&0x8000 and selector==0 or flags&0x10000 and selector==1)else'graphic-missing'if q['graphicIndex']==-1 else'deleted'if n['deleted']else'hidden'if flags&2 else None
        if reason:skipped.append(dict(id=n['id'],reason=reason));continue
        scale=n['scale'];commands.append(dict(id=n['id'],kind=n['kind'],index=q['graphicIndex'],flags=(q['drawFlags']&~n['drawFlagMask'])|(n['drawFlagValue']&n['drawFlagMask']),x=n['screen'][0]+int(q['drawOffsetX']*scale[0]),y=n['screen'][1]+int(q['drawOffsetY']*scale[1]),priority=priorities.get(n['id'],n['drawPriority']),**({'scale':scale}if scale!=[1.,1.]else{})))
    bg=next(g for g in scene.IMAGES.values()if g['resource']==1000);commands.append(dict(id=None,kind='background',index=bg['index'],flags=0,x=320+bg['origin'][0]+w.offset[0],y=240+bg['origin'][1]+w.offset[1],priority=0))
    plan=dict(depthOrder=depth,commands=commands,skipped=skipped,drawOrder=[commands[i]['id']for i in sorted(range(len(commands)),key=lambda i:(commands[i]['priority'],-i))]);return dict(planDigest=digest(plan),rgbaSha256=scene.raster(commands))
def main():
    animations,records,files=prior.fixtures();cases=[]
    def case(name,caster=0,hits=None,level=0,local=0,**kw):return dict(name=name,category=83,level=level,caster=caster,hits=[[10,0,12]]if hits is None else hits,cost=3,local=local,**kw)
    for level in range(10):cases.extend([case('local-level%d'%level,level=level),case('nonlocal-level%d'%level,caster=1,level=level)])
    for name,flags,value in[('damage',0x20000,12),('damage-KO',0x20020,120),('absorb',0x40000,12),('zero',0x10000000,0),('zero-nonzero',0x10000000,12),('negative',0,-7),('overflow',0,2147483647),('local-reflect',0x10000,7)]:cases.extend([case(name,hits=[[10,flags,value]]),case('nonlocal-'+name,caster=1,hits=[[10,flags,value]])])
    cases.extend([case('multi',hits=[[10,0,7],[11,0x20000,9],[12,0x40000,3]]),case('duplicate',hits=[[10,0,7],[10,0,9]]),case('self',hits=[[0,0,12]]),case('nonlocal-self',caster=1,hits=[[1,0,12]]),case('empty',hits=[]),case('nonlocal-empty',caster=1,hits=[]),case('nonlocal-zero-sum',caster=1,hits=[[10,0x10000,7],[11,0x10000,-7]]),case('local-multi-reflect',hits=[[10,0x10000,7],[11,0x10000,9]]),case('local-duplicate-reflect',hits=[[10,0x10000,7],[10,0x10000,9]]),case('nonlocal-self-reflect',caster=1,hits=[[1,0x10000,7]]),case('status-follow',flags={'0':32})])
    for caster,target in[(20,0),(20,10),(20,20),(21,10),(21,0),(21,21)]:
        for local in[0,caster]:cases.append(case('slot%d-target%d-local%d'%(caster,target,local),caster,[[target,0,7]],local=local))
    queue_cases=[]
    for level in range(10):
        for caster,target,local in[(0,10,0),(1,10,0),(10,0,10),(20,0,0),(21,10,0),(20,0,20),(0,0,0),(1,1,0)]:
            for flags in[0,0x20,0x10000,0x20000,0x40000,0x30020,0x50020,0x70020,0x10000000,0x10020000,0xffffffff]:
                c=case('queue-%d-%d-%d-%x'%(level,caster,target,flags),caster,[[target,flags,12]],level,local);queue_cases.append(dict(case=c,expected=queues(c),portableBoundary=boundary(c)))
    queue_cases.extend(dict(case=c,expected=queues(c),portableBoundary=boundary(c))for c in cases)
    traces=[]
    for c in cases:
        unavailable=boundary(c)
        if unavailable:traces.append(dict(case=c,portableBoundary=unavailable,states=[],rasters=[],stopped=False,bodySettled=False,commandPhase2Waiting=False));continue
        w=World(animations,records,c);states=[];rasters=[]
        for i in range(600):
            frame=w.step();states.append(digest(frame))
            if i<8 or i%19==0:
                for selector in[0,1]:rasters.append(dict(frame=i+1,selector=selector,**render_reference(w,selector)))
            if w.stopped:break
            if all(b.detached or not b.busy for b in w.bodies.values())and all(n['kind']in{'body','status','status-skill-overlay','status-skill-field'}for n in w.nodes):break
        settled=all(b.detached or not b.busy for b in w.bodies.values());traces.append(dict(case=c,states=states,rasters=rasters,stopped=w.stopped,bodySettled=settled,commandPhase2Waiting=w.phase2,final=frame));print(c['name'],len(states),w.stopped,settled,flush=True)
    out=dict(schema='moli.moving-numeric-reference-stage201.v1',authority='Independent source equations and original synthetic bytes; no product imports or original execution',files=files,geometry=records,queues=queue_cases,traces=traces,frames=sum(len(t['states'])for t in traces),rgbaFrames=sum(len(t['rasters'])for t in traces));(A/'original-vectors.json').write_text(json.dumps(out,separators=(',',':'))+'\n');print(json.dumps(dict(cases=len(traces),queues=len(queue_cases),states=out['frames'],RGBA=out['rgbaFrames'],sourceStops=sum(t['stopped']for t in traces),bodySettled=sum(t['bodySettled']for t in traces),boundaries=sum(bool(t.get('portableBoundary'))for t in traces))))
if __name__=='__main__':main()
