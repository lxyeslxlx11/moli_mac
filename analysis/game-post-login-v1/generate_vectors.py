#!/usr/bin/env python3
"""Original independent character records, menu gates, preview mutations and wire requests."""
from pathlib import Path
import json,struct,random,importlib.util,hashlib
HERE=Path(__file__).resolve().parent;ROOT=HERE.parents[1]
def load(name,path):
 s=importlib.util.spec_from_file_location(name,path);m=importlib.util.module_from_spec(s);s.loader.exec_module(m);return m
wire=load('original_wire',HERE.parent/'game-legacy-message-v1/generate_vectors.py')
source=load('original_records',HERE.parent/'game-legacy-actors-v1/generate_vectors.py')
FIELDS=[(2,24),(4,40),(5,44),(6,48),(7,52),(8,56),(13,20),(15,76),(17,80),(18,28),(19,32)]
def signed(n):return ((n+2**31)%2**32)-2**31
def trunc(a,b):return (abs(a)//b)*(-1 if a<0 else 1)
def prefix(raw):return raw.split(b'\0',1)[0]
def esc(raw):
 out=b'';i=0;table={10:b'\\n',44:b'\\c',124:b'\\z',92:b'\\y'}
 while i<len(raw):
  b=raw[i]
  if b>=128:out+=raw[i:i+2];i+=2
  else:out+=table.get(b,bytes([b]));i+=1
 return out

def number(tokens,n):
 raw=(tokens[n-1] if n<=len(tokens) else b'')[:127]
 return source.decimal(raw) if raw else -1

def decode(raw):
 outer=source.split(raw);records=[bytearray(148),bytearray(148)];applied=ignored=fallbacks=0
 for pair in range(2):
  name=(outer[pair*2] if pair*2<len(outer) else b'')[:1023]
  inner=source.inner((outer[pair*2+1] if pair*2+1<len(outer) else b'')[:1023]);tokens=source.split(inner);slot=number(tokens,1)
  if slot not in [0,1]:ignored+=1;continue
  rec=bytearray(148)
  if len(name)>16:name=b'???';fallbacks+=1
  rec[:len(name)]=name
  for field,offset in FIELDS:struct.pack_into('<i',rec,offset,number(tokens,field))
  struct.pack_into('<H',rec,18,number(tokens,3)&65535)
  for field in range(9,13):struct.pack_into('<i',rec,60+(field-9)*4,trunc(number(tokens,field),10))
  text=(tokens[15] if len(tokens)>15 else b'')[:63];rec[84:84+len(text)]=text;records[slot]=rec;applied+=1
 return dict(records=[x.hex() for x in records],applied=applied,ignored=ignored,nameFallbacks=fallbacks)

def forward_old(code):
 if 30000<=code<98000:
  if code>=70000:code-=12000
  group,rem=divmod(code-30000,4000);first,rem=divmod(rem,1000);second,rem=divmod(rem,10)
  if group==3:return rem+(second+(first+8128)*5)*5
  if group==4:group=3
  return rem+(second+(first+8112+group*4)*5)*5
 return code

def forward_new(code):
 if 202800<=code<204201:return code+37200
 order=[2000,2002,2008,2010,2012,2014,2016,2004,2006,2018,2020,2022,2024,2026]
 q=trunc(code,100);rem=code-q*100
 return rem+(order.index(q)*100+241400) if q in order else code

def preview(raw):
 out=bytearray(raw)
 if not out[0]:return dict(recordHex=out.hex(),normalizedCode=None)
 code=struct.unpack_from('<i',out,24)[0];variant=struct.unpack_from('<i',out,80)[0]
 if code<30000:code=0x814c;struct.pack_into('<i',out,24,code)
 normalized=forward_new(forward_old(code))
 if variant<0:variant=1 if 240000<=normalized<241400 else 2
 elif normalized>=241400:variant=2
 struct.pack_into('<i',out,80,variant);return dict(recordHex=out.hex(),normalizedCode=normalized)

def policy(c,g):
 c&=255;allowed=True
 if c!=1:
  if g<2 and c>4:allowed=False
  elif g<1 and c>2:allowed=False
  elif g<3 and c>6:allowed=False
  elif g<4 and c>7:allowed=False
 extra=c!=1 and ((g>=1 and c in [0,2])or(g>=3 and c in [5,6])or(g==4 and c==7))
 return dict(category=c,generation=g,allowed=allowed,nativeAuxiliaryOption=extra)

def record_tokens(slot=0,code=30000,variant=-1,identity=501):
 values=[str(slot).encode(),str(code).encode(),b'12',b'40',b'50',b'60',b'70',b'80',b'91',b'-101',b'111',b'-121',b'130',b'ignored14',str(identity).encode(),b'Original label',str(variant).encode(),b'18',b'0']
 return b'|'.join(values)
def body(rows):return b'|'.join(name+b'|'+esc(record) for name,record in rows)

def main():
 rng=random.Random(166);cases=[];native=[body([(b'OriginalA',record_tokens()),(b'OriginalB',record_tokens(1,33001,2,502))]),b'',b'onlyname',body([(b'A'*16,record_tokens()),(b'B'*17,record_tokens(1))]),body([(b'First',record_tokens()),(b'Last',record_tokens(0,39999,0,777))])]
 for slot in [-2147483648,-1,0,1,2,2147483647]:native.append(body([(b'Slot',record_tokens(slot)),(b'',b'')]))
 for i in range(200):
  rows=[]
  for k in range(2):
   n=rng.choice([0,1,8,16,17,80]);name=bytes(rng.choice(b'ABCxyz012') for _ in range(n));values=[str(rng.choice([-1,0,1,2])).encode()]
   for f in range(2,20):
    if f==16:values.append(esc(b'Inner|label,'+bytes([0x81,0x7c])+b'\\tail') if i%7==0 else b'L'*rng.choice([0,1,63,64,150]))
    else:values.append(rng.choice([b'',b'-1',b'+12tail',b'  -12',b'bad',str(rng.randint(-2**40,2**40)).encode()]))
   rows.append((name,b'|'.join(values)))
  native.append(body(rows))
 for raw in native:cases.append(dict(bodyHex=raw.hex(),expected=decode(raw)))
 policies=[dict(category=c,generation=g,expected=policy(c,g)) for c in list(range(256))+[-2147483648,-1,256,257,2147483647] for g in range(-1,5)]
 codes=[-2147483648,-1,0,29999,30000,33000,33001,57999,58000,69999,70000,97999,98000,199999,200000,200099,200200,202799,202800,204200,204201,239999,240000,241399,241400,242799,242800,2147483647]+[rng.randrange(30000,98000) for _ in range(160)]
 previews=[]
 for code in codes:
  for variant in [-2147483648,-1,0,1,2,2147483647]:
   rec=bytearray(148);rec[:8]=b'Original';struct.pack_into('<i',rec,24,code);struct.pack_into('<i',rec,80,variant);previews.append(dict(recordHex=rec.hex(),expected=preview(rec)))
 raw=native[0];decoded=decode(raw);prepared=[preview(bytes.fromhex(h)) for h in decoded['records']];auth=json.loads((HERE.parent/'game-session-runtime-v1/original-vectors.json').read_text());key=bytes.fromhex(auth['wire']['bootstrap']['keyHex']);catalog=json.loads((HERE.parent/'game-legacy-message-v1/dispatch-catalog.json').read_text());incoming={r['id']:r for r in catalog['incoming']};outgoing={r['id']:r for r in catalog['outgoing']}
 def framed(raw):return wire.frame(wire.payload_encode(raw,key)).hex()
 req={};replies={}
 for name,ident,values in [('list','send-004f86e0',[]),('enter0','send-004f8650',[501,1,30000]),('enter1','send-004f8650',[502,2,33001])]:
  plain=wire.message(outgoing[ident],values);req[name]=dict(id=ident,arguments=values,plainHex=plain.hex(),frameHex=framed(plain))
 for name,ident,values in [('category','receive-00567c20',[8]),('list','receive-00567c3c',[0,raw]),('listEmpty','receive-00567c3c',[0,b'']),('listUnavailable','receive-00567c3c',[1,b'OUTOFSERVICE']),('listDenied','receive-00567c3c',[1,b'Other']),('entered','receive-00567c40',[b'successful',b'']),('entryDenied','receive-00567c40',[b'failed',b'Original denial'])]:
  plain=wire.message(incoming[ident],values);replies[name]=dict(id=ident,values=[v if isinstance(v,int) else {'hex':v.hex()} for v in values],plainHex=plain.hex(),frameHex=framed(plain))
 out=dict(schema='moli.original-post-login-vectors.v1',description='Original bytes/identifiers only; independent Python native-record/branch/wire reference.',records=cases,policies=policies,previews=previews,flow=dict(bodyHex=raw.hex(),nativeRecords=decoded['records'],preparedRecords=[p['recordHex'] for p in prepared],category=8,probeResourceId=0x3c39f,requests=req,replies=replies),authentication=auth['authentication'],bootstrap=auth['wire']['bootstrap'],authFrameHex=auth['wire']['authFrameHex'],authReplyFrameHex=auth['wire']['replies']['success']['frameHex'])
 (HERE/'original-vectors.json').write_text(json.dumps(out,indent=2)+'\n');print(json.dumps(dict(record_cases=len(cases),policies=len(policies),previews=len(previews))))
if __name__=='__main__':main()
