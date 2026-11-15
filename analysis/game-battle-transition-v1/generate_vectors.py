#!/usr/bin/env python3
"""Original packet construction/oracles independent of the JS implementation."""
from pathlib import Path
import json,random
A=Path(__file__).resolve().parent
u32=lambda n:n&0xffffffff
i32=lambda n:((n+0x80000000)&0xffffffff)-0x80000000
def text(raw):
 out=bytearray();i=0;raw=raw[:28]
 while i<len(raw):
  b=raw[i];i+=1
  if b>=128:
   out.append(b)
   if i<len(raw):out.append(raw[i]);i+=1
  elif b==92:
   if i==len(raw):break
   b=raw[i];i+=1;out.append({110:10,99:44,122:124,121:92}.get(b,b))
  else:out.append(b)
 return bytes(out)
def row(slot,label,values):return f'{u32(slot):X}|'.encode()+label+b'|'+b'|'.join(f'{u32(n):X}'.encode()for n in values)+b'|'
def make(flags,defs):
 raw=f'C|{flags:X}|'.encode()+b''.join(row(*d)for d in defs);expected=[]
 if not flags&32:
  for slot,label,values in defs:expected.append(dict(slot=slot if 0<=slot<=21 else 0,wireSlot=slot,nameHex=text(label).hex(),rawResourceId=i32(values[0]),rawResource13a8=i32(values[1]),value1d0=i32(values[2]),values=[i32(n)for n in values[3:7]],statusFlags=u32(values[7]),rawLinkedResources=[i32(n)for n in values[8:10]]))
 return dict(hex=raw.hex(),flags=u32(flags),end=bool(flags&32),records=expected)
def main():
 rng=random.Random(180);cases=[];names=[b'Hero',b'Enemy',b'X'*40,b'Name\\zPipe',b'Original\\nLabel',b'X'*27+b'\x81\x40',b'\x81\x40'*15]
 for i in range(240):
  defs=[]
  for j in range(rng.randrange(0,8)):
   slot=rng.choice([-3,-1,*range(25)]);values=[100010,0,rng.randrange(101),rng.randrange(1000),1000,rng.randrange(999),999,rng.getrandbits(32),0,0];defs.append((slot,rng.choice(names),values))
  cases.append(make(rng.choice([0,0,0,1,2,4,8,16,32,0x80000000]),defs))
 base=[100010,0,10,100,100,30,30,0,0,0];sample=make(0,[(0,b'Hero',base),(10,b'Enemy',[100010,0,12,200,200,0,0,0,0,0])]);end=make(32,[])
 v=dict(schema='moli.battle-transition-original-stage180.v1',original_synthetic_only=True,authority='independent original construction and explicit expected field values; no product imports, native execution or vendor assets',character_cases=cases,flow=dict(entry=[1,1000],parameters='P|0|0|1|0|0|0',characters=bytes.fromhex(sample['hex']).decode('latin1'),acknowledgment='A|1|2',motion='M|OriginalPendingAction',end=bytes.fromhex(end['hex']).decode('latin1'),expected_rows=sample['records']),edge_numbers=[dict(token=t,value=n)for t,n in[('a',0),('-2',2),('ZZ1F',31),('FFFFFFFF',-1),('100000000',0),('ff1A',26),('',0)]]);(A/'original-vectors.json').write_text(json.dumps(v,indent=2)+'\n');print(json.dumps(dict(character_cases=len(cases),records=sum(len(r['records'])for r in cases),number_edges=len(v['edge_numbers']))))
if __name__=='__main__':main()
