"""Read selected animation headers completely; retain metadata and digests, never pixels."""
from pathlib import Path
from hashlib import sha256
from collections import Counter
import json
import struct

ROOT=Path(__file__).resolve().parents[2]
A=Path(__file__).resolve().parent
P=ROOT/'build/analysis/game-vertex-color-v1'
M=ROOT/'build/analysis/game-legacy-resource-archive-v1/material-root'
profile=json.loads((ROOT/'analysis/game-legacy-material-compat-v1/material-profile.json').read_text())
files={r['path'].lower():r for r in profile['files']}
groups=[]
nonwhite=[]
for group in profile['groups']:
    if group['animationInfo'].lower() not in files:
        groups.append(dict(group=group['group'],present=False))
        continue
    inputs=[]
    values=[]
    for key in ('animationInfo','animation'):
        row=files[group[key].lower()]
        raw=(M/row['path']).read_bytes()
        assert len(raw)==row['bytes'] and sha256(raw).hexdigest()==row['sha256']
        values.append(raw)
        inputs.append(row)
    index,data=values
    assert len(index)%12==0
    colors=Counter(); styles=Counter(); versions=Counter(); actions=frames=0
    for at in range(0,len(index),12):
        resource,cursor,count,version=struct.unpack_from('<IIHH',index,at)
        versions[version]+=1
        # Native index normalization maps values above one back to the 12-byte header.
        version=version if version<=1 else 0
        for action in range(count):
            head=20 if version==1 else 12
            assert cursor+head<=len(data)
            direction,kind,duration,n=struct.unpack_from('<HHII',data,cursor)
            selector,flags,color=struct.unpack_from('<HHI',data,cursor+12) if version==1 else (0,0,0xffffffff)
            end=cursor+head+10*n
            assert end<=len(data)
            colors[f'{color:08x}']+=1
            styles[str(flags)]+=1
            if color!=0xffffffff:
                nonwhite.append(dict(group=group['group'],resource=resource,physical_row=at//12,action_row=action,
                    action=kind,direction=direction,header_offset=cursor,frames=n,selector=selector,flags=flags,color=color))
            cursor=end; actions+=1; frames+=n
    groups.append(dict(group=group['group'],present=True,inputs=inputs,index_rows=len(index)//12,
        versions=dict(versions),actions=actions,frames=frames,colors=dict(colors),flags=dict(styles)))
out=dict(stage=294,scope='Every physical animationInfo row and every action header in the explicitly selected six present groups; not every archive suffix or runtime producer.',
    groups=groups,nonwhite=nonwhite,records=sum(g.get('index_rows',0) for g in groups),
    actions=sum(g.get('actions',0) for g in groups),frames=sum(g.get('frames',0) for g in groups),
    original_execution=False,official_connection=False)
(P/'material-census.json').write_text(json.dumps(out,indent=2)+'\n')
print(json.dumps(dict(stage=294,records=out['records'],actions=out['actions'],frames=out['frames'],nonwhite=len(nonwhite),sample=nonwhite[:8])))
