"""Independent equations for106 reflected RID and the literal calloc/reader frontier."""
from pathlib import Path
from hashlib import sha256
from types import SimpleNamespace
import copy,importlib.util,json
HERE=Path(__file__).resolve().parent
ROOT=HERE.parents[1]
PREVIOUS=HERE.parent/'game-legacy-battle-impact-skills-v1/generate_vectors.py'
s=importlib.util.spec_from_file_location('detached_rid_prior',PREVIOUS);prior=importlib.util.module_from_spec(s);s.loader.exec_module(prior)
native=prior.native;f=prior.f;skill=prior.skill;anime=prior.anime;signed=prior.signed
def case(name,level=0,caster=0,hits=None,**kw):
    return dict(dict(name=name,category=106,level=level,caster=caster,cost=3,local=0,word=2,resource=100095,initialSlots=[0],hits=[[10,0x802001,9,[100040,100041,100050]]]if hits is None else hits),**kw)
class Body(prior.Body):
    def pop(self):
        self.read+=1
        value=self.actions[self.read]if self.read<len(self.actions)else 0
        self.state=value if self.read<200 and value!=-1 else 231
    def clone_hit(self):
        _,flags,_,_=self.tuples[self.tuple_read];flags&=0xffffffff
        if not flags&0x800000:return super().clone_hit()
        assert flags&0x2000 and 0 in self.w.bodies
        self.action=5;self.percent=100;signal=self.body['q']['signal']
        if signal>9999:
            t,flags,_,_=self.tuples[self.tuple_read];flags&=0xffffffff;v=self.w.bodies[t]
            # Native chooses this resource before metadata even though the post-read amount is zero.
            if not flags&(4|0x400):self.w.random.range(0,2)
            v.frozen=0;v.category=-1;v.attacker=self;v.reaction_flags=flags;v.aim(self.position)
            self.metadata()
            assert self.tuple_read==3 and self.tuples[3]==[0,0,0,0]
            v.pop();self.w.message(self.w.bodies[0],0x573b);self.body['q']['signal']=0
        if self.cooldown>0:self.cooldown-=1
        if self.cooldown==0:
            if self.finish==0:
                if self.animate(self.body,1)!=1:return
            elif self.finish>10:self.pop();self.tuple_read+=1;self.cooldown=self.finish=0;return
            self.finish+=1
class World(prior.World):
    def __init__(self,animations,records,c):
        self.animations,self.records=animations,records;self.nodes=[];self.next_id=1;self.random=skill.old.Random(12345);self.phase=self.passes=0;self.slow=False;self.events=[];self.bodies={};self.local=c['local'];self.alt=False;self.offset=[0,0];self.overlay_counter=self.overlay_direction=0;self.submissions=[];self.shake=self.amplitude=self.limit=0;self.case=c;self.field=None;self.used=False;self.phase2=False;self.stopped=False
        self.manager=SimpleNamespace(slot=None,body=None,links={},screen=lambda n:None)
        for slot in sorted(set([c['caster']]+[h[0]for h in c['hits']]+c.get('initialSlots',[]))):
            b=Body(self,slot,c['resource']);self.bodies[slot]=b;b.raw=c.get('flags',{}).get(str(slot),0);b.vitals=c.get('vitals',{}).get(str(slot),[70,100,10,10])[:]
            if b.raw&0x3f0:self.condition(b,0x1adfb+(b.raw&0x3f0).bit_length()-5)
        self.plan=prior.queues(c)
        for row in self.plan['rows']:
            b=self.bodies[row['slot']];b.actions=row['actions']+[-1]if row['actions']else[0,-1];b.read=0;b.write=len(row['actions'])-1;b.busy=int(bool(row['actions']));b.tuples=copy.deepcopy(row['tuples'])+[[-1,0,0,0]]+[[0,0,0,0]for _ in range(199-len(row['tuples']))];b.tuple_read=0
            for key,value in row['assignments'].items():setattr(b,{'classCode':'category','skillLevel':'level','mpCost':'cost','physicalVariant':'variant','chantResource':'chant','effectResource':'effect'}[key],value)
        b=self.bodies[c['caster']];b.state=b.actions[0]
    def detached(self,p):
        b=Body(self,0,p.resource);b.slot=p.slot;b.body.update(parent=p.body,drawPriority=p.body['drawPriority']);b.saved=b.flags=b.skill=b.level=b.cost=0;b.actor_flags=0x20000;b.angle=p.angle;b.face=p.face;b.position=p.position[:];b.category=p.category;b.variant=p.variant;b.vitals=[0]*4;b.speed=0.;b.percent=100;b.tuples=[[0,0,0,0]for _ in range(200)];b.tuples[0][0]=-1;b.body['q']=anime.initial();b.animate(b.body,0);b.screen(b.body);return b
def render_reference(w,selector):
    p=w.project_casting();scene=skill.scene
    depth=scene.pointer_sort([dict(id=n['id'],y=n['screen'][1],alternateY=n['alternateY'],flags=n['actorFlags'],depthKey=0)for n in p['nodes']if n['actorFlags']&0x20000])
    priorities={node:(i+9)&255 for i,node in enumerate(depth)};commands=[];skipped=[]
    for n in p['nodes']:
        q=n['animation'];flags=n['actorFlags']
        reason='renderer-filter'if(flags&0x8000 and selector==0 or flags&0x10000 and selector==1)else'graphic-missing'if q['graphicIndex']==-1 else'graphic-empty'if q['graphicIndex']==0 else'deleted'if n['deleted']else'hidden'if flags&2 else None
        if reason:skipped.append(dict(id=n['id'],reason=reason));continue
        scale=n['scale'];commands.append(dict(id=n['id'],kind=n['kind'],index=q['graphicIndex'],flags=(q['drawFlags']&~n['drawFlagMask'])|(n['drawFlagValue']&n['drawFlagMask']),x=n['screen'][0]+int(q['drawOffsetX']*scale[0]),y=n['screen'][1]+int(q['drawOffsetY']*scale[1]),priority=priorities.get(n['id'],n['drawPriority']),**({'scale':scale}if scale!=[1,1]else{})))
    bg=next(g for g in scene.IMAGES.values()if g['resource']==1000);commands.append(dict(id=None,kind='background',index=bg['index'],flags=0,x=320+bg['origin'][0]+w.offset[0],y=240+bg['origin'][1]+w.offset[1],priority=0))
    plan=dict(depthOrder=depth,commands=commands,skipped=skipped,drawOrder=[commands[i]['id']for i in sorted(range(len(commands)),key=lambda i:(commands[i]['priority'],-i))]);return dict(planDigest=native.digest(plan),rgbaSha256=scene.raster(commands))
def main():
    animations,records,_=prior.fixtures();queues=[]
    patterns=[0x802000,0x802001,0x802003,0x802009,0x802101,0x802021,0x802041,0x802005,0x802401,0x806001,0x80a001,0xb02001]
    for level in range(10):
        for p,t in[(0,10),(1,10),(10,0),(20,0),(21,10),(0,0)]:
            for flags in patterns:
                c=case('queue',level,p,[[t,flags,-7,[100040,100041,100050]]]);queues.append(dict(case=c,expected=prior.queues(c)))
    cases=[case('level'+str(i),i)for i in range(10)]
    cases.extend([case('flags'+hex(flags),hits=[[10,flags,9,[100040,100041,100050]]])for flags in patterns if flags!=0x802001])
    cases.extend([case('caster1',caster=1),case('caster10',caster=10,hits=[[1,0x802001,9,[100040,100041,100050]]]),case('pet20',caster=20),case('pet21',caster=21),case('self',hits=[[0,0x802001,9,[100040,100041,100050]]]),case('followup',hits=[[10,0x802001,9,[100040,100041,100050]],[11,1,8]]),case('RID_twice',hits=[[10,0x802001,9,[100040,100041,100050]],[11,0x802003,7,[100040,100041,100050]]]),case('repeat',hits=[[10,0x802001,9,[100040,100041,100050]],[10,0x802001,7,[100040,100041,100050]]])])
    traces=[]
    for c in cases:
        w=World(animations,records,c);states=[];rasters=[]
        for i in range(540):
            frame=w.step();states.append(native.digest(frame))
            if i in[0,6,18,29,44,59,74,89,104,119,149,179,209,239,299,359,449,539]:
                for selector in[0,1]:rasters.append(dict(frame=i+1,selector=selector,**render_reference(w,selector)))
            if all(b.detached or not b.busy for b in w.bodies.values())and all(n['kind']in['body','rider','attachment']for n in w.nodes)and not any(n['kind']=='body'and n['owner']not in w.bodies.values()for n in w.nodes):break
        traces.append(dict(case=c,states=states,rasters=rasters,settled=all(b.detached or not b.busy for b in w.bodies.values()),final=frame));print(c['name'],len(states),traces[-1]['settled'],flush=True)
    result=dict(schema='moli.detached-reflected-rid.stage287.v1',authority='independent source equations and authored archives;no product imports or original execution',reference=dict(path=str(Path(__file__).relative_to(ROOT)),sha256=sha256(Path(__file__).read_bytes()).hexdigest()),prior_reference=dict(path=str(PREVIOUS.relative_to(ROOT)),sha256=sha256(PREVIOUS.read_bytes()).hexdigest()),queues=queues,traces=traces,frames=sum(len(t['states'])for t in traces),rgbaFrames=sum(len(t['rasters'])for t in traces))
    (HERE/'original-vectors.json').write_text(json.dumps(result,separators=(',',':'))+'\n');print(json.dumps(dict(queues=len(queues),traces=len(traces),states=result['frames'],RGBA=result['rgbaFrames'])))
if __name__=='__main__':main()
