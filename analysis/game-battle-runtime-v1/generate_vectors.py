#!/usr/bin/env python3
"""Original M messages and explicit field/slot oracles; no JS/native execution."""
from pathlib import Path
import collections,json,random
A=Path(__file__).resolve().parent
TABLE=json.loads((A/'source-tables.json').read_text());TOKENS=[r['token']for r in TABLE['tokens']]
def i32(n):return((n+2**31)%2**32)-2**31
def mapped(n):return{50:20,51:21}.get(n,n)
def partner(n):return n+5 if n in list(range(5))+list(range(10,15))else n-5
def name(raw=b'Original\\zLabel',maximum=28):return dict(raw=raw.hex(),maximum=maximum)
def decoded_name(n):
 raw=bytes.fromhex(n['raw'])[:n['maximum']];out=bytearray();at=0
 while at<len(raw):
  c=raw[at];at+=1
  if c>=128:
   out.append(c)
   if at<len(raw):out.append(raw[at]);at+=1
  elif c==92:
   if at==len(raw):break
   c=raw[at];at+=1;out.append({110:10,99:44,122:124,121:92}.get(c,c))
  else:out.append(c)
 return out.hex()
def wire_fields(fields):return b''.join((bytes.fromhex(x['raw'])if isinstance(x,dict)else f'{x&0xffffffff:X}'.encode())+b'|'for x in fields)
def expected_fields(fields):return[dict(nameHex=decoded_name(x))if isinstance(x,dict)else i32(x)for x in fields]
def command(token,fields,marked,principal,advance=True,klass=None,tail=None):
 counts=[0]*22
 for n in marked:assert 0<=n<22;counts[n]=(counts[n]+1)&255
 raw=token.encode()+b'|'+wire_fields(fields);complete_fields=list(fields)
 for extra in tail or[]:raw+=b'RID|'+wire_fields(extra);complete_fields+=extra
 return dict(wire=raw.hex(),token=token,index=TOKENS.index(token),fields=expected_fields(complete_fields),counts=counts,mask=sum(1<<i for i,n in enumerate(counts)if n),principal=principal,advance=advance,klass=klass,attachedRID=len(tail or[]))
def rid(a=2,b=3,flags_a=2,flags_b=0):return[0,a,b,0,name(b'First'),*([0]*7),flags_a,name(b'Second'),*([0]*6),flags_b]
def skill(klass,a=1,b=2,resource=None):
 prefix=[klass*100 if resource is None else resource,7];marks=[];p=-1;f=[];tail=None
 generic={0,1,3,5,6,72,75,76,77,78,79,80,81,84,85,87,94,95,96,105,110,113,257,258,259,260,262,266}
 status={4,*range(19,32),82,97,106,111,116,267}
 plain={*range(32,50),*range(54,61),*range(64,69),86,*range(99,105),107,109,112,114,117}
 two={61,62,63,83,108}
 if klass in generic:
  f=[0,a,b,0,10];marks=[a,b];p=a
  if klass==81:f+=[11]
  if klass==94:f+=[12]
  f+=[255]
 elif klass in status:f=[0,a,b,0,10,255];marks=[a,b];p=a
 elif klass in {12,50,51,52,53,88}:f=[0,a,10];marks=[a];p=a
 elif klass in plain|two:f=[0,a,b,10]+([11]if klass in two or klass==68 else[])+[255];marks=[a,b];p=a
 elif klass==73:f=[1,a,b,0,10,255];marks=[a,b];p=a
 elif klass==93:f=[0,a,b,name(),*range(7),255];marks=[a,b];p=a
 elif klass==98:f=[0,0,a,b,10,255];marks=[a,b];p=a
 elif klass==263:f=[a,b,10,11];marks=[a,b];p=a
 elif klass in {400,401}:f=[a,b,10,255];marks=[a,b];p=a
 elif klass==402:f=[0,a,1];marks=[a,*range(10,20)];p=a
 elif klass==404:f=[0,a,b,0,10,255];marks=[a,b];p=a
 elif klass==405:f=[a,7,b,10,11,12,7,255];marks=[a,b];p=a
 return command('SKL',prefix+f,marks,p,True,klass,tail)
def main():
 cases=[]
 for seed in range(12):
  a=seed%5;b=10+seed%5;m=mapped(a);pair=partner(m);n=name(b'X'*27+b'\x81\x40'+b'Label')
  rows=[
   command('ESC',[a,seed],[m],m),command('CLR',[a,b,255],[m,b],255),command('SUP',[a,b,255],[m,b],255),
   command('POS',[a],[m,pair],m),command('MON',[a,0,seed],[m,pair],m),command('MON',[a,1,seed,n,*range(7)],[m,pair],m),command('EQU',[a,seed,seed+1],[m],m),
   command('ITM',[0,a,7,b,7,255],[m,b],m),command('ITM',[6,a,b,7],[m,b],m),command('ITM',[7,a],[m],m),command('ITM',[9],[],-1),
   command('CMB',[a,b,0x800000,10,11,12,13,255],[m,b],255),command('PSN',[1,2,a,3,4],[m],m),
   *[command(t,[a],[m],m,t not in ['ANR','PUE','ACT'])for t in ['ANR','PUE','ACT','PNO','PLV','PDN']],
   command('CFP',[a,seed],[m],m,False),command('CHT',[a,1,2,3,name(b'Original\\nMessage'*18,255)],[m],m,False),command('CBC',[a,*range(7)],[m],m,False),
   command('REB',[a,0x80000,10,11],[m],m),command('BST',[a,7],[m],m),command('GMN',[a,0],[m,*range(22)],-1),
   command('GMN',[a,1,b,10,11,n,*range(7)],[m,*range(22)],b),command('RID',rid(a,b),[m,b],m),command('RID',[1,a,b,0x80000,n,*range(8)],[m,b],m),command('RID',[1,a,b,0],[m,b],m),command('END',[],list(range(22)),-1,False),
  ]
  cases+=rows
 for k in range(0,118):cases.append(skill(k))
 for k in [257,258,259,260,262,263,266,267,400,401,402,404,405]:cases.append(skill(k))
 for source,target in TABLE['aliases']:
  value=source
  for left,right in TABLE['aliases']:
   if value==left:value=right
  cases.append(skill(int(value/100),resource=source))
 # Explicit multi-target/status paths and grammar variants absent from the basic recipes.
 for k in [0,1,72,81,94,105,110,113,257,258,259,260,262,266]:
  f=[k*100,0,1,1,1,0x200,10,3,2,0x800000,20,21,22,23,255]
  if k in [72,113]:continue
  cases.append(command('SKL',f,[1,1,3,2],1,True,k))
 for v in range(15):
  if v in [0,1,2,3,4,5,9,10,11,14]:fields=[1,2,10]+([11]if v==11 else[])+[255];marked=[1,2];p=1
  elif v in [6,8]:fields=[1,2,255];marked=[1,2];p=1
  elif v==7:fields=[1,2,255];marked=[1,2,7];p=1
  elif v==12:fields=[1,2,3,0x800000,10,11,12,13,255];marked=[1,2,3];p=2
  else:fields=[1,2,3,10,11,255];marked=[1,2,3];p=2
  cases.append(command('SKL',[9800,0,0,v,*fields],marked,p,True,98))
 cases.append(command('SKL',[26000,0,0,1,2,0x80200,10,3,0x800200,20,21,22,23,4,5,255],[1,2,3,4,5],1,True,260))
 cases.append(command('SKL',[7200,0,0,1,2,1,10,3,0x200,20,4,255],[1,2,4],1,True,72))
 cases.append(command('SKL',[40400,0,0,1,1,2,10,name(),*range(8),name(),*range(7),255],[1,2],1,True,404))
 cases.append(command('CHT',[-1,1,2,3,name()],[],-1,False))
 for raw_slot in [50,51]:cases.append(command('ANR',[raw_slot],[mapped(raw_slot)],mapped(raw_slot),False))
 base=[400,0,0,1,2,0,10,255];tail=rid(3,4)
 cases.append(command('SKL',base,[1,2,3,4],1,True,4,[tail]))
 cases.append(command('CMB',[1,2,0,10,255],[1,2,3,4],255,True,None,[tail]))
 # Native counters are bytes: 256 uses become zero, not a set membership count.
 cases.append(command('CLR',[0]*256+[255],[0]*256,255))
 for c in cases:c['hex']=(b'M|'+bytes.fromhex(c.pop('wire'))).hex()
 flow=b'M|ESC|32|1|CHT|33|1|2|3|Original\\zMessage|END|'
 out=dict(schema='moli.original-battle-motion-stage181.v1',original_synthetic_only=True,authority='explicit independently constructed opcode/field/dependency oracle; no product imports or original execution',cases=cases,flow=dict(motionHex=flow.hex(),tokens=['ESC','CHT','END'],principal=[20,21,-1],masks=[1<<20,1<<21,(1<<22)-1]),coverage=dict(tokens=sorted(set(c['index']for c in cases)),classes=sorted(set(c['klass']for c in cases if c['klass']is not None)),aliases=len(TABLE['aliases'])))
 (A/'original-vectors.json').write_text(json.dumps(out,indent=2)+'\n');print(json.dumps(dict(cases=len(cases),tokens=out['coverage']['tokens'],classes=len(out['coverage']['classes']),aliases=out['coverage']['aliases'])))
if __name__=='__main__':main()
