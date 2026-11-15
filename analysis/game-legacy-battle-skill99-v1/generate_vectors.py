"""Independent SKL99..104 source equations and authored animation additions."""
from pathlib import Path
from hashlib import sha256
import importlib.util
import json
import struct

HERE=Path(__file__).resolve().parent
ROOT=HERE.parents[1]
REFERENCE=HERE.parent/'game-battle-status-skills-v1/generate_vectors.py'
spec=importlib.util.spec_from_file_location('skill99_status_reference',REFERENCE)
native=importlib.util.module_from_spec(spec);spec.loader.exec_module(native)
f=native.f
CLASSES=list(range(99,105))


def case(name,category=99,level=0,caster=0,hits=None,**kw):
    return dict(name=name,category=category,level=level,caster=caster,cost=3,local=0,
                resource=100060,hits=[[10,0x80000]]if hits is None else hits,**kw)


def queues(c):
    rows={};principal=c['caster'];kind=c['category']
    def row(slot):return rows.setdefault(slot,dict(slot=slot,reset=False,actions=[],tuples=[],assignments={}))
    def act(slot,*values):row(slot)['actions'].extend(values)
    def put(target,flags):row(principal)['tuples'].append([target,native.prior.signed(flags),0])
    row(principal)['assignments'].update(classCode=kind,skillLevel=c['level'],mpCost=c['cost'],
        chantResource=0x1ade8+native.TIER[c['level']])
    act(principal,24,53,37,38,135,62,38)
    for target,flags in c['hits']:
        put(target,flags);row(target)['assignments'].update(classCode=kind,skillLevel=c['level'])
        act(target,153)
        if flags&0x80000:
            row(target)['assignments']['effectResource']=0xfd if kind%2 else 0x112
            act(target,140,78,35)
    put(-1,0)
    return dict(rows=list(rows.values()))


def additions():
    return[dict(resourceId=0x1926a+i,bytesHex=native.anime.action(0,0,96,
        [(1002,-1,1,0),(1004,-1,1,0),(1005,-1,1,0)]).hex())for i in range(6)]


def fixtures():
    _,records,original=native.fixtures();files={r['path']:bytes.fromhex(r['bytesHex'])for r in original}
    index,data=bytearray(files['Bin/AnimeInfo.bin']),bytearray(files['Bin/Anime.bin'])
    for row in additions():
        index.extend(struct.pack('<IIHH',row['resourceId'],len(data),1,0));data.extend(bytes.fromhex(row['bytesHex']))
    files.update({'Bin/AnimeInfo.bin':bytes(index),'Bin/Anime.bin':bytes(data)})
    return native.anime.parse([dict(index=bytes(index),animation=bytes(data),graphicBase=0)]),records


class Body(native.Body):
    def body_step(self):
        if self.state==37:
            self.w.used=True;self.pre_pass=getattr(self,'pre_pass',0)+1;turn=getattr(self,'pre_turn',0)
            if self.pre_pass==1:self.action=8
            if self.pre_pass%(36-turn)==0:
                if self.action==9:self.action=8;self.face=(self.face+2)%8
                else:self.action=9
                self.pre_turn=turn+1
                if turn==9:self.pre_pass=self.pre_turn=0;self.action=9;self.reface();self.pop()
            for _ in range(3):self.animate(self.body,1)
        elif self.state==153:
            self.w.used=True
            if not self.flags&0x60:self.animate(self.body,0)
            if not self.skill:self.w.make(self,'charge',0x1ae6d);self.skill=1
            self.state=157
        elif self.state==140:
            self.w.modifier(self,self.category-99,True)
            if not self.flags&0x60:self.animate(self.body,0)
            self.pop()
        else:super().body_step()


def initialization_queues(c):
    plan=queues(c)
    for row in plan['rows']:
        row['assignments'].pop('effectResource',None)
        row['tuples']=[t+[0]for t in row['tuples']]
    return plan


native.Body=Body
native.queues=initialization_queues


class World(native.World):
    def __init__(self,animations,records,c):
        super().__init__(animations,records,c)
        self.plan=queues(c)
        for row in self.plan['rows']:
            if 'effectResource'in row['assignments']:self.bodies[row['slot']].effect=row['assignments']['effectResource']
        for slot,b in self.bodies.items():
            raw=c.get('flags',{}).get(str(slot),0)
            for i in range(6):
                if raw&(0x4000<<i):self.modifier(b,i)
                else:b.flags&=~(0x4000<<(i&~1))
    def modifier(self,b,index,pop=False):
        if 'modifier'in b.links:return
        self.used=True
        if 0<=index<6:b.flags|=0x4000<<index
        elif index==15:b.flags|=0x100000;index=0
        n=self.make(b,'modifier',0x1926a+index);n.update(drawPriority=200,scale=[f(.3),f(.3)]if pop else[1.,1.],
            modifier=dict(kind=index,offsetX=0,offsetY=-50 if pop else 0))
        self.animate(n,1);self.screen(n);b.links['modifier']=n
    def step_effect(self,n):
        if n['kind']!='status-skill-modifier':return super().step_effect(n)
        b=n['owner'];m=n['modifier']
        if n['parent']['deleted']:n['deleted']=True
        else:
            indicator=b.links.get('indicator')
            if indicator and not indicator['flags']&2:m['offsetX']=min(10,m['offsetX']+1)
            elif m['offsetX']>0:m['offsetX']-=1
            if m['offsetY']:
                n['scale']=[min(1.,f(value+f(.04)))for value in n['scale']]
                if n['scale'][1]>=1:n['height']=f(n['height']+1)
                if n['height']>=30:m['offsetY']+=7
                if m['offsetY']>0:m['offsetY']=0
            self.animate(n,0);n['position']=[f(b.position[0]+m['offsetX']),f(f(b.position[1]-5)+m['offsetY'])]
        self.screen(n,True)
    def project_casting(self):
        p=super().project_casting()
        for row,n in zip(p['nodes'],self.nodes):
            row['scale']=n['owner'].scale[:]if n['kind']=='body'else n.get('scale',[1.,1.])[:]
            if n['kind']=='status-skill-modifier':row['statusSkill']['modifier']=dict(n['modifier'])
        return p


def render_reference(w,selector):
    p=w.project_casting();scene=native.skill.scene
    depth=scene.pointer_sort([dict(id=n['id'],y=n['screen'][1],alternateY=n['alternateY'],flags=n['actorFlags'],depthKey=0)
        for n in p['nodes']if n['actorFlags']&0x20000])
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
    commands.append(dict(id=None,kind='background',index=bg['index'],flags=0,x=320+bg['origin'][0],y=240+bg['origin'][1],priority=0))
    plan=dict(depthOrder=depth,commands=commands,skipped=skipped,
        drawOrder=[commands[i]['id']for i in sorted(range(len(commands)),key=lambda i:(commands[i]['priority'],-i))])
    return dict(planDigest=native.digest(plan),rgbaSha256=scene.raster(commands))


def main():
    queue_cases=[]
    for category in CLASSES:
        for level in range(10):
            for caster,target in[(0,10),(20,0),(21,10),(0,0),(1,1),(10,0)]:
                for flags in[0,1,0x80000,0x80001,0x100000,0x80000000,0xffffffff]:
                    c=case('queue',category,level,caster,[[target,flags]])
                    queue_cases.append(dict(case=c,expected=queues(c)))
    cases=[case('class'+str(category),category)for category in CLASSES]
    cases.extend([case('no-result-bit',hits=[[10,0]]),case('opaque-all',100,hits=[[10,0xffffffff]]),
        case('self',101,hits=[[0,0x80000]]),case('multi',102,hits=[[10,0x80000],[11,0],[12,0x80000]]),
        case('repeated',103,hits=[[10,0x80000],[10,0x80000]]),case('pet',104,caster=20,hits=[[0,0x80000]]),
        case('existing-icon',99,flags={'10':0x8000}),case('empty',104,hits=[]),case('level9',100,9)])
    animations,records=fixtures();traces=[]
    for c in cases:
        w=World(animations,records,c);states=[];rasters=[]
        for i in range(700):
            frame=w.step();states.append(native.digest(frame))
            if i in[0,35,69,131,209,269,274,279,284,289,299,319,349,399,499,599,699]:
                for selector in[0,1]:rasters.append(dict(frame=i+1,selector=selector,**render_reference(w,selector)))
            if all(not b.busy for b in w.bodies.values())and all(n['kind']in['body','status-skill-modifier']for n in w.nodes):break
        traces.append(dict(case=c,states=states,rasters=rasters,settled=all(not b.busy for b in w.bodies.values()),final=frame))
        print(c['name'],len(states),traces[-1]['settled'],flush=True)
    result=dict(schema='moli.skill99-source-reference.stage284.v1',authority='Independent original equations and authored archives;no product imports or original execution',
        reference=dict(path=str(REFERENCE.relative_to(ROOT)),sha256=sha256(REFERENCE.read_bytes()).hexdigest()),
        addedAnimations=additions(),queues=queue_cases,traces=traces,frames=sum(len(t['states'])for t in traces),
        rgbaFrames=sum(len(t['rasters'])for t in traces))
    (HERE/'original-vectors.json').write_text(json.dumps(result,separators=(',',':'))+'\n')
    print(json.dumps(dict(queues=len(queue_cases),scenarios=len(traces),states=result['frames'],RGBA=result['rgbaFrames'])))


if __name__=='__main__':main()
