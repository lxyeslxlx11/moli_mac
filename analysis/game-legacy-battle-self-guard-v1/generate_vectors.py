"""Independent native guard queue/alias reference,using retained source equations only."""
from pathlib import Path
from hashlib import sha256
import importlib.util
import json

HERE=Path(__file__).resolve().parent
ROOT=HERE.parents[1]
path=HERE.parent/'game-battle-physical-guard-v1/generate_vectors.py'
spec=importlib.util.spec_from_file_location('native_self_guard_reference',path)
old=importlib.util.module_from_spec(spec);spec.loader.exec_module(old)


def main():
    flags=[0x200,0x201,0x203,0x208,0x300,0x308,0x220,0x221,0x241,0x800201,0x800203,0x100201,0x211,0x1201]
    roles=[(0,0,11),(0,0,0),(20,20,21),(0,10,0),(0,10,10)]
    queues=[]
    for category in old.CLASSES:
        for level in range(10):
            for actor,target,guard in roles:
                for flag in flags:
                    hit=[actor,target,flag,12,[100040,100041,100050]if flag&0x800000 else None,guard]
                    c=old.case('queue',category,level,hits=[hit])
                    queues.append(dict(input=[category,level,actor,target,guard,flag],expected_digest=old.digest(old.queues(c)['rows'])))
    animations,records,_=old.fixtures()
    releases=[]
    for bits in [0,0x2000,0x4000,0x6000,0x8000,0xa000,0xc000,0xe000]:
        for dead in [0,0x20]:
            for amount in [0,12]:
                for next_slot in [-1,0,11,20]:
                    flags=bits|dead;actions=[];tuples=[]
                    if amount==0:actions.append(35)
                    actions.extend([71,72])
                    if bits:
                        if next_slot<0:actions.append(11)
                        else:actions.extend([3,72]);tuples.append([next_slot,0,0,0])
                    if not dead:actions.append(38)
                    if amount==0:
                        if next_slot<0:actions.append(11)
                        else:actions.extend([3,72]);tuples.append([next_slot,0,0,0])
                    releases.append(dict(input=[flags,amount,next_slot],actions=actions,tuples=tuples))
    traces=[]
    cases=[old.case('self-guard',hits=[[0,0,0x201,12,None,11]]),old.case('all-self',hits=[[0,0,0x201,12,None,0]]),
           old.case('self-charge',hits=[[0,0,0x1201,12,None,11]]),
           old.case('self-RID-stale',hits=[[0,0,0x800201,12,[100040,100041,100050],11]],initialFourths={'0':[0,0,0x11223344]})]
    for c in cases:
        w=old.World(animations,records,c)
        initial=old.digest(w.owned());states=[];rasters=[]
        for i in range(320):
            frame=w.step();states.append(old.digest(frame))
            if i in [0,39,159,319]:
                for selector in [0,1]:rasters.append(dict(frame=i+1,selector=selector,**old.prior.render_reference(w,selector)))
        traces.append(dict(case=c,initialOwnedDigest=initial,states=states,rasters=rasters,stopped=w.stopped,
            bodySettled=all(b.detached or not b.busy for b in w.bodies.values()),finalOwnedDigest=old.digest(w.owned()),final=frame))
    out=dict(schema='moli.self-guard-native-reference.stage282.v1',authority='Independent original native equations,authored assets;no product imports or original execution',
        reference=dict(path=str(path.relative_to(ROOT)),sha256=sha256(path.read_bytes()).hexdigest()),
        queues=queues,releases=releases,traces=traces,frames=sum(len(t['states'])for t in traces),rgbaFrames=sum(len(t['rasters'])for t in traces))
    (HERE/'original-vectors.json').write_text(json.dumps(out,separators=(',',':'))+'\n')
    print(json.dumps(dict(queues=len(queues),releases=len(releases),traces=len(traces),states=out['frames'],RGBA=out['rgbaFrames'])))


if __name__=='__main__':
    main()
