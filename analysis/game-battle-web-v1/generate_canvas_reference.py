#!/usr/bin/env python3
"""Independent full canvas references for actual browser ready-state idle frames. No product imports."""
from pathlib import Path
import importlib.util,itertools,json
A=Path(__file__).resolve().parent
def module(name,path):
 s=importlib.util.spec_from_file_location(name,path);m=importlib.util.module_from_spec(s);s.loader.exec_module(m);return m
ref=module('browser_skill_reference',A.parent/'game-battle-skill-v1/generate_vectors.py')
def main():
 _,records,_,_=ref.fixtures();frames=[(1002,-1,1),(1004,1,-1),(1005,0,0)];rows=[]
 for a,b in itertools.product(range(3),repeat=2):
  commands=[]
  for node,slot,frame in [(1,0,frames[a]),(2,10,frames[b])]:
   index,x,y=frame;g=next(r for r in records if r['index']==index);home=ref.layout[slot]['target'];commands.append(dict(id=node,kind='body',index=index,flags=0,x=home[0]+x+g['originX'],y=home[1]+y+g['originY'],priority=10 if slot==0 else 9))
  bg=next(g for g in ref.scene.IMAGES.values()if g['resource']==1000);commands.append(dict(id=None,kind='background',index=bg['index'],flags=0,x=320+bg['origin'][0],y=240+bg['origin'][1],priority=5));rows.append(dict(frames=[a,b],commands=commands,rgbaSha256=ref.scene.raster(commands)))
 out=dict(schema='moli.battle-web-canvas-reference-stage191.v1',authority='Independent Python indexed-pixel reference, original synthetic100020 idle frames and retained source formation table; no product imports/runtime state',width=640,height=480,slots=[0,10],ordinary_viewport=[320,240],cases=rows,original_synthetic_only=True,native_UI_or_device_equivalence=False)
 (A/'canvas-reference.json').write_text(json.dumps(out,indent=2)+'\n');print(json.dumps(dict(cases=len(rows),uniqueHashes=len({r['rgbaSha256']for r in rows}))))
if __name__=='__main__':main()
