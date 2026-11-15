#!/usr/bin/env python3
"""Independent numeric CUT semantic digests; never exports image/map/audio bytes."""
from pathlib import Path
import collections,hashlib,json,struct,sys
R=Path(__file__).resolve().parents[2]
def main():
 source=Path(sys.argv[1]).resolve();out=Path(sys.argv[2]).resolve();rows=[];hist=collections.Counter();total=0
 for path in sorted(source.glob('*.cut')):
  raw=path.read_bytes();assert raw[:4]==b'CUT ' and struct.unpack_from('<H',raw,4)[0]==12
  counts=list(struct.unpack_from('<3h',raw,6));assert min(counts)>=0;n=sum(counts);assert n<=50000;consumed=12+n*18;assert len(raw)>=consumed;digest=hashlib.sha256();kinds=collections.Counter()
  for i in range(n):
   values=list(struct.unpack_from('<IH6h',raw,12+i*18));digest.update((json.dumps([1000+i,i,*values],separators=(',',':'))+'\n').encode('ascii'));kinds[values[1]]+=1
  hist.update(kinds);total+=n;rows.append(dict(source=dict(path=str(path.relative_to(R)),bytes=len(raw),sha256=hashlib.sha256(raw).hexdigest()),records=n,counts=counts,consumedBytes=consumed,trailingBytes=len(raw)-consumed,numericDigest=digest.hexdigest(),kinds=dict(kinds)))
 autos=[dict(path=str(p.relative_to(R)),bytes=p.stat().st_size,sha256=hashlib.sha256(p.read_bytes()).hexdigest()) for p in sorted(source.iterdir()) if p.suffix.lower()=='.aut']
 result=dict(schema='moli.private-cut-corpus-oracle-stage162.v1',original_game_bytes_exported=False,cuts=rows,cut_count=len(rows),records=total,kinds=dict(hist),AUT_files=autos,AUT_count=len(autos),AUT_role='Separate minimap raw colours;not compared byCUT parser',native_or_visual_acceptance=False)
 out.write_text(json.dumps(result,indent=2)+'\n');print(json.dumps(dict(cuts=len(rows),records=total,kinds=dict(hist),AUTs=len(autos))))
if __name__=='__main__':main()
