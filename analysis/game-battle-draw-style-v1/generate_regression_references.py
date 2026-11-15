"""Independent updates to retained RID snapshots and ghost pet frames; no product imports."""
from pathlib import Path
from hashlib import sha256
import importlib.util
import json

A=Path(__file__).resolve().parent
ROOT=A.parents[1]


def load(name,path):
    spec=importlib.util.spec_from_file_location(name,ROOT/path)
    module=importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


def identity(path):
    raw=(ROOT/path).read_bytes()
    return dict(path=str(path),bytes=len(raw),sha256=sha256(raw).hexdigest())


pixels=load('draw_style_rgba_reference','analysis/game-battle-draw-style-v1/generate_vectors.py')
retained=load('raw_retained_reference','analysis/game-battle-shared-storage-v1/retained_reference.py')
m=retained.m


class RawWorld(m.World):
    def project_casting(self):
        result=super().project_casting()
        # Old diagnostics merged object alpha into animation305/300. Native506e80
        # reads these separately; the original animation bytes remain untouched.
        for row,node in zip(result['nodes'],self.nodes):
            for key in ('drawFlags','color'):
                row['animation'][key]=node['q'][key]
        return result


def attached_element():
    raw=json.loads((ROOT/'analysis/game-battle-attached-rid-v1/original-vectors.json').read_text())
    current=json.loads((ROOT/'analysis/game-battle-shared-storage-v1/retained-current-vectors.json').read_text())
    previous=next(t for t in current['traces'] if t['case']['name']=='element')
    animations,records,files=m.fixtures()
    assert files==raw['files']
    world=RawWorld(animations,records,previous['case'])
    initial=world.project_casting();states=[]
    for _ in previous['states']:
        world.step();states.append(m.digest(world.project_casting()))
    assert initial==previous['initial']
    assert states[:-1]==previous['states'][:-1]
    final=world.project_casting()
    assert [n['animation']['graphicIndex'] for n in final['nodes']]==[n['animation']['graphicIndex'] for n in previous['final']['nodes']]
    changed=[]
    for node,before in zip(final['nodes'],previous['final']['nodes']):
        other=dict(before,animation=dict(before['animation'],drawFlags=node['animation']['drawFlags'],color=node['animation']['color']))
        assert node==other
        if node!=before:
            changed.append(dict(id=node['id'],raw_animation={k:node['animation'][k] for k in ('drawFlags','color')},old_merged={k:before['animation'][k] for k in ('drawFlags','color')}))
    assert len(changed)==1 and states[-1]!=previous['states'][-1]
    return dict(previous,states=states,final=final),changed


def pet_raster(world,selector,pet):
    state=world.project();nodes=state['nodes']
    depth=pet.skill.scene.pointer_sort([dict(id=n['id'],y=n['screen'][1],alternateY=0,flags=n['actorFlags'],depthKey=0) for n in nodes if n['actorFlags']&0x20000])
    priorities={value:(i+9)&255 for i,value in enumerate(depth)}
    commands=[];skipped=[]
    for node,raw in zip(nodes,world.nodes):
        flags=node['actorFlags'];animation=node['animation']
        reason='renderer-filter' if flags&0x8000 and selector==0 or flags&0x10000 and selector==1 else 'graphic-missing' if animation['graphicIndex']==-1 else 'deleted' if node['deleted'] else 'hidden' if flags&2 else None
        if reason:
            skipped.append(dict(id=node['id'],reason=reason));continue
        # Source-created pet objects retain mask0; nonbody objects override flag4.
        final=pixels.style(dict(drawFlags=raw['q']['drawFlags'],color=raw['q']['color'],paletteSelector=0,
            actorFlags=flags,drawFlagMask=0 if node['kind']=='body' else 4,drawFlagValue=4))
        scale=node['scale'];color=final['color']
        commands.append(dict(id=node['id'],kind=node['kind'],index=animation['graphicIndex'],flags=final['flags'],
            x=node['screen'][0]+int(animation['drawOffsetX']*scale[0]),y=node['screen'][1]+int(animation['drawOffsetY']*scale[1]),
            priority=priorities.get(node['id'],node['drawPriority']),**({'scale':scale} if scale!=[1,1] else {}),
            **({'color':color} if color!=0xffffffff else {})))
    images=pet.skill.scene.IMAGES
    bg=next(g for g in images.values() if g['resource']==1000)
    commands.append(dict(id=None,kind='background',index=bg['index'],flags=0,x=320+bg['origin'][0],y=240+bg['origin'][1],priority=0))
    return dict(depthOrder=depth,skipped=skipped,commands=commands,rgbaSha256=pixels.raster(commands,images=images))


def pet_ghost():
    pet=load('ghost_pet_reference','analysis/game-battle-pet-transition-v1/generate_vectors.py')
    original=json.loads((ROOT/'analysis/game-battle-pet-transition-v1/original-vectors.json').read_text())
    previous=next(t for t in original['traces'] if t['name']=='summon-alternate-unavailable')
    animations,records,files=pet.fixtures();assert files==original['files']
    world=pet.World(animations,records,previous);renders=[];promoted=0
    for frame,old_render in zip(previous['frames'],previous['renders']):
        assert world.step()==frame
        current=[pet_raster(world,selector,pet) for selector in (0,1)]
        for before,now in zip(old_render,current):
            if before.get('unavailable'):
                assert before['unavailable']=='LEGACY_BATTLE_FRAME_DRAW_STYLE';promoted+=1
                assert any(c.get('color')==0x80ffffff for c in now['commands'])
            else:
                assert now==before
        renders.append(current)
    assert promoted==100
    return dict(name=previous['name'],renders=renders,frames_unchanged=len(previous['frames']),promoted_rasters=promoted)


def main():
    attached,changes=attached_element()
    pet=pet_ghost()
    inputs=[identity(Path(path)) for path in (
        'analysis/game-battle-attached-rid-v1/original-vectors.json',
        'analysis/game-battle-shared-storage-v1/retained-current-vectors.json',
        'analysis/game-battle-pet-transition-v1/original-vectors.json')]
    out=dict(stage=295,authority='Independent original Python source models; raw animation snapshot and final ghost RGBA projection. Archived original vectors unchanged.',
        inputs=inputs,attached=attached,attached_changes=changes,pet=pet)
    (A/'regression-references.json').write_text(json.dumps(out,separators=(',',':'))+'\n')
    print(json.dumps(dict(stage=295,attached_states=len(attached['states']),changed_attached_states=1,
        attached_rasters_unchanged=len(attached['rasters']),pet_states_unchanged=pet['frames_unchanged'],pet_complete_rasters=len(pet['renders'])*2,
        promoted_pet_rasters=pet['promoted_rasters'],original_vectors_changed=0)))


if __name__=='__main__':
    main()
