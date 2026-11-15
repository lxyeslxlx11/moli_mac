#!/usr/bin/env python3
"""Independent Python ordinary idle scene sequence for a normal automatic browser clock; no product JS."""
from pathlib import Path
import importlib.util,json,math
HERE=Path(__file__).resolve().parent
path=HERE.parent/'game-input-runtime-v1/generate_vectors.py'
s=importlib.util.spec_from_file_location('original_client_idle',path);base=importlib.util.module_from_spec(s);s.loader.exec_module(base)
scene=base.load('original_client_idle_scene',HERE.parent/'game-legacy-scene-frame-v1/generate_vectors.py')
v=json.loads((HERE.parent/'game-legacy-scene-frame-v1/original-vectors.json').read_text());model=scene.Scene();planes=scene.planes(1);state=scene.anime.initial();parsed=scene.anime.parse(scene.anime.groups());rows=[]
for i in range(240):
 state,_=scene.anime.step(state,scene.anime.ctx(resourceId=100001,action=0,facing=4),parsed);q=state
 g=q['geometry'];at=[scene.short(160+q['drawOffsetX']-(g['originX'] if g else 0)),scene.short(120+q['drawOffsetY']-(g['originY'] if g else 0))];index=q['graphicIndex'];command=scene.ordinary(index,*at,10,q) if g and scene.graphic(index)['resourceId']!=1 else None
 roots=[dict(graphicIndex=index,position=[128,192],screenPosition=at,sortFlag=1,ordinal=0,id=100,command=command)]
 request=dict(camera=[128,192],center=[160,120],width=320,height=240,runtime=v['runtime'],tick=1000+math.ceil(i*base.PERIOD))
 expected=model.step(12,12,planes,1,dict(tileCenter=[2,3],drawPrimitives=False),request,roots)
 rows.append(dict(sourceUpdate=i+1,tick=request['tick'],rgbaSha256=expected['rgbaSha256']))
result=dict(schema='moli.original-client-idle-vectors-stage169.v1',reference='Independent Python source animation/map-scene composition; static original assets, not target execution.',frames=rows)
(HERE/'original-idle-vectors.json').write_text(json.dumps(result,indent=2)+'\n');print(json.dumps(dict(frames=len(rows),unique=len({r['rgbaSha256'] for r in rows}),first=rows[0]['rgbaSha256'])))
