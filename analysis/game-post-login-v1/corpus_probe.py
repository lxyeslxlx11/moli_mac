#!/usr/bin/env python3
"""Independent read-only source lookup probes over the six existing local GraphicInfo artifacts; no art export."""
from pathlib import Path
import json,hashlib,struct
R=Path(__file__).resolve().parents[2];P=R/'build/analysis/game-post-login-v1';OLD=R/'build/analysis/game-resource-runtime-v1/corpus-oracle.json'
PROBES=[0x3c39f,0x3bd9f,0x5727,0x56c4,0x55f2]
def main():
 old=json.loads(OLD.read_text());root=R/old['sourceRoot'];assert root.is_relative_to(R/'build')
 names=['bin/GraphicInfo_20.bin','bin/GraphicInfoEx_4.bin',None,'bin/GraphicInfoV3_18.bin','bin/PUK2/GraphicInfo_PUK2_2.bin','bin/PUK3/GraphicInfo_PUK3_1.bin','bin/GraphicInfo_Joy_22.bin']
 known={x['path'].lower():x for x in old['sources']};base=0;lookup={x:0 for x in PROBES};rows=[];files=[];provenance={}
 for group,name in enumerate(names):
  if name is None:rows.append(dict(group=group,records=0));continue
  path=root/name;raw=path.read_bytes();digest=hashlib.sha256(raw).hexdigest();key=str(path.relative_to(R)).lower();assert key in known and known[key]['sha256']==digest and known[key]['bytes']==len(raw);assert len(raw)%40==0
  files.append(dict(group=group,path=str(path.relative_to(R)),bytes=len(raw),sha256=digest))
  for at in range(0,len(raw),40):
   resource=struct.unpack_from('<I',raw,at+36)[0]
   if resource in lookup:
    index=struct.unpack_from('<i',raw,at)[0]+base;assert 0<=index<850000;lookup[resource]=index;provenance[resource]=dict(group=group,fileRecord=at//40)
  rows.append(dict(group=group,records=len(raw)//40));base+=len(raw)//40
 probes=[dict(resource=x,index=lookup[x],**provenance.get(x,{})) for x in PROBES];generation=next((4-i for i,x in enumerate(PROBES) if lookup[x]!=0),-1)
 receipt=dict(schema='moli.character-content-corpus-independent.v1',files=files,groups=rows,records=base,probes=probes,expectedGeneration=generation,source_executable_equivalence='unverified; resource artifact identities are separate',original_executable_executed=False,official_pixels_exported=False,official_session=False)
 (P/'corpus-probe-oracle.json').write_text(json.dumps(receipt,indent=2)+'\n');print(json.dumps(dict(files=len(files),records=base,generation=generation)))
if __name__=='__main__':main()
