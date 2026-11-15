#!/usr/bin/env python3
"""Independent original callback/depth/frame reference. No shipped assets or execution."""
from pathlib import Path
import copy, hashlib, importlib.util, json, math, random, struct
HERE=Path(__file__).resolve().parent
ROOT=HERE.parents[1]
def load(name,path):
    spec=importlib.util.spec_from_file_location(name,path)
    module=importlib.util.module_from_spec(spec);spec.loader.exec_module(module);return module
actor=load('actor_reference',ROOT/'analysis/game-legacy-actors-v1/generate_vectors.py')
anime=load('animation_reference',ROOT/'analysis/game-legacy-animation-v1/generate_vectors.py')
wire=load('wire_reference',ROOT/'analysis/game-legacy-message-v1/generate_vectors.py')
f=actor.f
RUNTIME=dict(runtimeStage=0,ownGateByte=0,movementScale=1,soundScene=0,sparseMode=0)
SOURCE=dict(unindexed=False,recordGateFlags=0,recordMotionFlags=0,recordTypeFlags=0,recordDrawFlags=0,bodyFlags=0,specialState=0,frozen=0,childAction=None)
def plan(p):
    r,s=p['runtime'],p['source'];local=p['local']
    out=dict(blocked=False,reason='ordinary',supported=True,motionEnabled=False,helperCalls=0,mode=0,staticFlip=False,sortFlag=int(local))
    reason=None
    if s['bodyFlags']&0x40000 and r['sparseMode']==1 and p['enginePhase']!=0:reason='engine-quarter-cadence'
    elif 250<=r['runtimeStage']<=252:reason='runtime-stage'
    elif local or s['unindexed']:
        if r['ownGateByte']&128:reason='own-gate'
    elif s['recordGateFlags']&0x80000000:reason='record-gate'
    if reason:return dict(out,blocked=True,reason=reason)
    if s['specialState']!=0 or s['childAction'] is not None or s['bodyFlags']&0x400:return dict(out,supported=False,reason='compound-or-culling-handler')
    suppressed=not local and bool(s['recordMotionFlags']&0x02000000)
    loops=[3,0,1,18,19,13,15,11] if not local and s['recordTypeFlags']&0x100 else [12,13,14,15,1,0,16,3,6]
    calls=1+int(r['movementScale']>=f(1.2))+int(r['movementScale']>=f(1.6)) if suppressed else 1+int(p['queueLength']>=2)+int(p['queueLength']>=4)
    return dict(out,motionEnabled=not local and not suppressed,helperCalls=calls,mode=int(p['action'] not in loops),staticFlip=p['sceneMode']==1 and not local and bool(s['recordDrawFlags']&0x1000) and not bool(s['recordDrawFlags']&0x400380))
def compare(a,b):
    da=a['position'][0]-a['position'][1];db=b['position'][0]-b['position'][1]
    if da!=db:return -1 if da<db else 1
    if a['position']==b['position']:
        if b['sortFlag']:return 1
        if a['sortFlag']:return -1
    return -1 if a['ordinal']<=b['ordinal'] else 1
def source_sort(rows):
    # Byte-address partition, matching the retained 52-byte native record routine.
    rows=copy.deepcopy(rows)
    if len(rows)<2:return [x['ordinal'] for x in rows]
    low=0;high=(len(rows)-1)*52;stack=[]
    def cmp(a,b):return compare(rows[a//52],rows[b//52])
    def swap(a,b):rows[a//52],rows[b//52]=rows[b//52],rows[a//52]
    while True:
        count=(high-low)//52+1
        if count<=8:
            end=high
            while low<end:
                largest=low
                for at in range(low+52,end+1,52):
                    if cmp(at,largest)>0:largest=at
                swap(largest,end);end-=52
        else:
            swap(low+(count//2)*52,low);left=low;right=high+52
            while True:
                left+=52
                while left<=high and cmp(left,low)<1:left+=52
                right-=52
                while right>low and cmp(right,low)>=0:right-=52
                if left>right:break
                swap(left,right)
            swap(low,right)
            if right-low-1 < high-left:
                if left<high:stack.append((left,high))
                if low+52<right:high=right-52;continue
            else:
                if low+52<right:stack.append((low,right-52))
                low=left
                if left<high:continue
        if not stack:break
        low,high=stack.pop()
    return [x['ordinal'] for x in rows]
def pixels(states,roots,order,width=96,height=72):
    out=bytearray(width*height*4);submitted=[];operations=0
    for i in order:
        q=states[i]
        if q['geometry'] and q['graphicIndex']>=1000 and q['graphicIndex']!=1003:submitted.append(i)
    # Priority10 queue is consumed in reverse insertion order by source507200.
    for i in reversed(submitted):
        q=states[i];g=q['geometry'];w,h=g['width'],g['height'];flags=q['drawFlags'];idx=q['graphicIndex'];screen=roots[i]['screen']
        left=screen[0]+q['drawOffsetX'];top=screen[1]+q['drawOffsetY']
        for y in range(max(0,top),min(height,top+h)):
            for x in range(max(0,left),min(width,left+w)):
                operations+=1;sx=w-1-(x-left) if flags&1 else x-left;sy=h-1-(y-top) if flags&2 else y-top;at=(h-1-sy)*w+sx
                color=0 if (at+idx)%5==0 else 1+(at+idx)%3;c=anime.COLORS[color]
                if c[3]:out[(y*width+x)*4:(y*width+x)*4+4]=bytes(c)
    return dict(rgbaSha256=hashlib.sha256(out).hexdigest(),submitted=submitted,drawOrder=list(reversed(submitted)),rasterOperations=operations)
def frame_series(name,count=64):
    definitions=[dict(id=200,local=False,origin=[3,3],resourceId=100001,facing=4,targets=[[4,3],[5,3],[5,4],[4,4],[3,4]]),
                 dict(id=100,local=True,origin=[2,3],resourceId=100001,facing=4,targets=[]),
                 dict(id=201,local=False,origin=[2,3],resourceId=30000,facing=3,targets=[])]
    states=[anime.initial() for _ in definitions];motion_rows=[actor.motion(d['origin'],100,d['targets'],count) for d in definitions];motion_at=[0]*3
    current=[dict(target=d['origin'][:],position=[f(x*64) for x in d['origin']],display=d['origin'][:],velocity=[0,0],queue=copy.deepcopy(d['targets']),facingCode=d['facing'],speed=100,moving=False,animation=int(bool(d['targets'])),phase=0) for d in definitions]
    animations=anime.parse(anime.groups());phase=2 if name=='quarter-cadence' else 0;frames=[]
    for tick in range(count):
        r=dict(RUNTIME);sources=[dict(SOURCE) for _ in definitions]
        if name=='quarter-cadence':r['sparseMode']=1;sources[0]['bodyFlags']=0x40000
        if name=='source-gates':
            r['runtimeStage']=250 if tick in [3,4] else 0;r['ownGateByte']=128 if 8<=tick<12 else 0;sources[0]['recordGateFlags']=0x80000000 if 16<=tick<21 else 0;sources[2]['unindexed']=True
        if name=='suppressed-scale':
            sources[0]['recordMotionFlags']=0x02000000;r['movementScale']=f([1,1.2,1.6,2][tick%4])
        if name=='frozen-audio':
            sources[0]['frozen']=1 if tick<4 or 20<=tick<25 else 0;r['soundScene']=9;sources[0]['bodyFlags']=0x80200
        if name=='static-flip':sources[2]['recordDrawFlags']=0x1000
        invalidate=[1] if name=='repeat-action' and tick in [1,5,13,30] else []
        for i in invalidate:current[i]['phase']=-1
        results=[];roots=[];active_states=[];events=[];calls=0
        for i,d in enumerate(definitions):
            m=current[i];s=sources[i];p=dict(local=d['local'],action=m['animation'],queueLength=len(m['queue']),sceneMode=1,enginePhase=phase,runtime=r,source=s)
            before=plan(p)
            if before['blocked']:results.append(dict(id=d['id'],local=d['local'],state='blocked',reason=before['reason'],helperCalls=0));continue
            if before['motionEnabled']:
                old_phase=m['phase'];m=copy.deepcopy(motion_rows[i][motion_at[i]]);motion_at[i]+=1;m['phase']=old_phase
                # First stationary direction remains the announced direction.
                if not d['targets']:m['facingCode']=d['facing']
                current[i]=m
            p.update(action=m['animation'],queueLength=len(m['queue']));selected=plan(p)
            q=states[i]
            if m['phase']==-1:q=dict(q,lastAction=-1)
            x,y=m['position'];cx,cy=[160,192];screen=[math.trunc(f(((x-cx)+(y-cy))*0.5+48)+0.5),math.trunc(f(((y-cy)-(x-cx))*0.375+36)+0.5)]
            c=anime.ctx(resourceId=d['resourceId'],action=m['animation'],facing=m['facingCode'],mode=selected['mode'],frozen=s['frozen'],staticFlip=selected['staticFlip'],soundScene=r['soundScene'],actorFlags=s['bodyFlags'])
            for _ in range(selected['helperCalls']):
                q,result=anime.step(q,c,animations);calls+=1
                if result['event']:events.append(dict(result['event'],actorId=d['id'],screenPosition=screen))
            states[i]=q;m['phase']=q['lastAction'];ordinal=len(roots);roots.append(dict(position=m['position'][:],sortFlag=int(d['local']),ordinal=ordinal,screen=screen,id=d['id']));active_states.append(q)
            results.append(dict(id=d['id'],local=d['local'],state='advanced',helperCalls=selected['helperCalls'],motion=copy.deepcopy(m),screenPosition=screen,animation=copy.deepcopy(q),code=result['code'],reason=result['reason']))
        order=source_sort([{k:x[k] for k in ['position','sortFlag','ordinal']} for x in roots]);image=pixels(active_states,roots,order);phase=(phase+1)%4
        frames.append(dict(tick=tick,runtime=r,sources=sources,invalidateActorIndices=invalidate,expected=dict(actors=results,events=events,helperCalls=calls,queueOrder=order,enginePhase=phase,submittedActorIds=[roots[i]['id'] for i in image['submitted']],drawOrderActorIds=[roots[i]['id'] for i in image['drawOrder']],rgbaSha256=image['rgbaSha256'],rasterOperations=image['rasterOperations'])))
    return dict(name=name,definitions=definitions,initialPhase=2 if name=='quarter-cadence' else 0,camera=[160,192],center=[48,36],width=96,height=72,frames=frames)
def main():
    rng=random.Random(161);plans=[]
    for _ in range(800):
        r=dict(RUNTIME,runtimeStage=rng.choice([0,249,250,251,252,253]),ownGateByte=rng.choice([0,127,128,255]),movementScale=f(rng.choice([0,1,1.19999,1.2,1.59999,1.6,2])),sparseMode=rng.randrange(2))
        s=dict(SOURCE,unindexed=bool(rng.randrange(2)),recordGateFlags=rng.choice([0,0x80000000]),recordMotionFlags=rng.choice([0,0x02000000]),recordTypeFlags=rng.choice([0,0x100]),recordDrawFlags=rng.choice([0,0x1000,0x1400,0x401000]),bodyFlags=rng.choice([0,0x40000,0x400]),specialState=rng.choice([0,0,1]),childAction=rng.choice([None,None,0]))
        p=dict(local=bool(rng.randrange(2)),action=rng.randrange(22),queueLength=rng.randrange(11),sceneMode=rng.randrange(3),enginePhase=rng.randrange(4),runtime=r,source=s);plans.append(dict(input=p,expected=plan(p)))
    for local in [False,True]:
        for action in range(22):
            for n in [0,1,2,3,4,10]:
                p=dict(local=local,action=action,queueLength=n,sceneMode=1,enginePhase=0,runtime=RUNTIME,source=SOURCE);plans.append(dict(input=p,expected=plan(p)))
    sorts=[]
    for count in [0,1,2,7,8,9,10,31,100,1001,1024]:
        for pattern in ['same','ties','random','reverse']:
            rows=[]
            for i in range(count):
                p=[0,0] if pattern=='same' else [rng.randrange(-8,9)*64,rng.randrange(-8,9)*64] if pattern=='ties' else [f(rng.uniform(-2000,2000)),f(rng.uniform(-2000,2000))] if pattern=='random' else [f(count-i),0]
                rows.append(dict(position=p,sortFlag=int(i==count//2),ordinal=i))
            sorts.append(dict(name=pattern+'-'+str(count),input=rows,expected=source_sort(rows)))
    series=[frame_series(n) for n in ['ordinary','quarter-cadence','source-gates','suppressed-scale','frozen-audio','static-flip','repeat-action']]
    navigation=load('local_reference',ROOT/'analysis/game-legacy-local-movement-v1/generate_vectors.py')
    nav=json.loads((ROOT/'analysis/game-legacy-local-movement-v1/original-vectors.json').read_text());protocol=copy.deepcopy(nav['protocol'])
    protocol['beforePlainHex']=[bytes.fromhex(x).replace(b'|100111|',b'|100001|').hex() for x in protocol['beforePlainHex']]
    local=navigation.local_frames(12,12,[0xc000]*144,[2,3],[5,3],100,52);q=anime.initial();animations=anime.parse(anime.groups());expected=[];previous=None
    for m in local:
        if previous and previous['moving'] and not m['moving']:q=dict(q,lastAction=-1)
        c=anime.ctx(resourceId=100001,action=m['animation'],facing=m['facingCode']);q,result=anime.step(q,c,animations)
        x,y=m['position'];screen=[math.trunc(f(((x-160)+(y-192))*0.5+48)+0.5),math.trunc(f(((y-192)-(x-160))*0.375+36)+0.5)]
        image=pixels([q],[dict(screen=screen)],[0]);expected.append(dict(position=m['position'],display=m['display'],animation=copy.deepcopy(q),screenPosition=screen,rgbaSha256=image['rgbaSha256']));previous=m
    output=dict(schema='moli.original-actor-frame-vectors-stage161.v1',original_synthetic_only=True,runtime=RUNTIME,source=SOURCE,plans=plans,sorts=sorts,series=series,
                bootstrap=nav['bootstrap'],sourceContext=nav['sourceContext'],protocol=protocol,worldFrames=expected)
    (HERE/'original-vectors.json').write_text(json.dumps(output,indent=2)+'\n')
    print(json.dumps(dict(plans=len(plans),sorts=len(sorts),traces=len(series),frames=sum(len(s['frames']) for s in series))))
if __name__=='__main__':main()
