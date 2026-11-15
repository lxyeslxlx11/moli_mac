#!/usr/bin/env python3
"""Authored finite field streams interpreted by the two distinct retained native readers.

This does not emulate queues, animation callbacks, native memory writes, or game execution.
"""
from pathlib import Path
import hashlib,json,struct
A=Path(__file__).resolve().parent;R=A.parent.parent;P=R/'build/analysis/game-battle-pair-specials-v1'
def mapped(n):return 20 if n==50 else 21 if n==51 else n
def rawslot(n):return 50 if n==20 else 51 if n==21 else n
class Boundary(Exception):pass
class Reader:
 def __init__(self,words):self.words=words;self.at=3;self.counts=[0]*22;self.events=[]
 def number(self,role):
  if self.at>=len(self.words):raise Boundary('truncated')
  n=self.words[self.at];self.events.append(dict(at=self.at,role=role,value=n));self.at+=1;return n
 def slot(self,role,mark=False):
  n=mapped(self.number(role))
  if mark:
   if not 0<=n<22:raise Boundary('native-write-outside-declared-22-slots')
   self.counts[n]=(self.counts[n]+1)&255
  return n
 def tail(self,flags,prefix):
  amount=self.number(prefix+'.amount');rid=[self.number(prefix+'.RID'+str(i))for i in range(3)]if flags&0x800000 else None
  return amount,rid
 def result(self,primary,**extra):return dict(primary=primary,consumed=self.at,events=self.events,counts=self.counts,**extra)
def front(words):
 r=Reader(words);first=None
 try:
  kind=words[0]//100;first=r.slot('actor')
  if first==255:return r.result(first,complete=r.at==len(words))
  if not 0<=first<22:raise Boundary('native-write-outside-declared-22-slots')
  r.counts[first]+=1;r.slot('target',True);flags=r.number('flags');r.tail(flags,'main')
  while True:
   extra=-1;second_flags=0
   if kind==260 and flags&0x80000:
    extra=r.slot('chain.target')
    if extra!=255:
     if not 0<=extra<22:raise Boundary('native-write-outside-declared-22-slots')
     r.counts[extra]=(r.counts[extra]+1)&255;second_flags=r.number('chain.flags');r.tail(second_flags,'chain')
   if flags&512:r.slot('guard',True)
   if kind==260:
    if flags&0x80000 and second_flags&512:r.slot('chain.guard',True)
   elif kind==94:r.number('statusScalar104c')
   if extra==255:return r.result(first,complete=r.at==len(words))
   actor=r.slot('next.actor')
   if actor==255:return r.result(first,complete=r.at==len(words))
   if not 0<=actor<22:raise Boundary('native-write-outside-declared-22-slots')
   r.counts[actor]=(r.counts[actor]+1)&255;r.slot('next.target',True);flags=r.number('next.flags');r.tail(flags,'next');kind=-1
 except Boundary as e:return r.result(first,error=str(e),complete=False)
def runtime(words):
 r=Reader(words);first=None;hits=[]
 def slot(role):
  n=r.slot(role)
  if n!=255 and not 0<=n<22:raise Boundary('outside-declared-22-actor-model')
  return n
 try:
  kind=words[0]//100;first=actor=slot('actor')
  while actor!=255:
   target=slot('target');flags=r.number('flags');amount,rid=r.tail(flags,'main');guard=slot('guard')if flags&512 else None
   row=dict(actor=actor,target=target,flags=flags,amount=amount,RID=rid,guard=guard,chain=None,statusScalar=None);hits.append(row)
   if kind==94:row['statusScalar']=r.number('statusScalar104c')
   if kind==260 and flags&0x80000:
    t=slot('chain.target')
    if t==255:row['chain']=dict(target=255);return r.result(first,hits=hits,complete=r.at==len(words))
    f=r.number('chain.flags');n,rid=r.tail(f,'chain');g=slot('chain.guard')if f&512 else None;row['chain']=dict(target=t,flags=f,amount=n,RID=rid,guard=g)
   actor=slot('next.actor');kind=-1
  return r.result(first,hits=hits,complete=r.at==len(words))
 except Boundary as e:return r.result(first,hits=hits,error=str(e),complete=False)
def words(kind,level,a,t,flags,g=None,status=0,chain=None,order='runtime',suffix=False):
 flags|=512 if g is not None else 0;flags|=0x80000 if chain is not None else 0
 v=[kind*100+level,4,0,rawslot(a),rawslot(t),flags,12]
 if flags&0x800000:v.extend([100040,100041,100050])
 def extra():
  if chain is None:return
  v.append(rawslot(chain['target']))
  if chain['target']==255:return
  f=chain['flags']|(512 if chain.get('guard')is not None else 0);v.extend([f,7])
  if f&0x800000:v.extend([100040,100041,100050])
  if order=='runtime' and chain.get('guard')is not None:v.append(rawslot(chain['guard']))
 if order=='preflight':extra()
 if g is not None:v.append(rawslot(g))
 if order=='runtime':extra()
 elif chain and chain['target']!=255 and chain.get('guard')is not None:v.append(rawslot(chain['guard']))
 if kind==94:v.append(status)
 if suffix and not(chain and chain['target']==255):v.extend([rawslot(a),11 if t!=11 else 12,0x800001,5,100040,100041,100050])
 if not(chain and chain['target']==255):v.append(255)
 return v
def main():
 rows=[]
 def add(name,v,**meta):
  f=front(v);s=runtime(v);rows.append(dict(name=name,words=v,preflight=f,runtime=s,**meta))
 for kind in[94,105,257,260,262]:
  for level in range(10):
   for a,t in[(0,10),(10,0),(20,10),(21,0)]:
    for guard in[None,12,a,t]:
     for flags in[1,0x800001,0x1001,0xe003]:
      for scalar in[0,6]if kind==94 else[0]:
       add(f'pair-{kind}-{level}-{a}-{t}-{guard}-{flags}-{scalar}',words(kind,level,a,t,flags,guard,scalar,suffix=True),scope='shared-native-field-order')
 for level in[0,9]:
  for a,t in[(0,10),(10,0),(20,10),(21,0)]:
   for guard in[None,12,a,t]:
    for target in[11,255]:
     for second_guard in[None,13]:
      if target==255 and second_guard is not None:continue
      for flags in[1,0x800001]:
       for secondary_flags in[1,0x800001]:
        for order in['runtime','preflight']:
         chain=dict(target=target,flags=secondary_flags,guard=second_guard)
         add(f'chain-{level}-{a}-{t}-{guard}-{target}-{second_guard}-{flags}-{secondary_flags}-{order}',words(260,level,a,t,flags,guard,chain=chain,order=order,suffix=True),scope='distinct-native-readers',wire_order=order)
 table=json.loads((P/'table-533968.json').read_text())['structuredContent'];raw=bytes.fromhex(table['normalized_result']['bytes_hex']);assert len(raw)==200
 prefixes=[]
 for level in range(10):
  values=list(struct.unpack('20b',raw[level*20:(level+1)*20]));end=next((i for i,v in enumerate(values)if v<0),None)
  prefixes.append(dict(level=level,known_row=values,first_negative_index=end,prefix=values[:end]if end is not None else values,original_runtime_observed=False,termination_beyond_observed_row='unverified'if end is None else'not-needed-for-this-table-prefix',animation_completion_assumed_only_for_prefix=True))
 out=dict(schema='moli.pair-specials-source-readers-stage214.v1',authority='Authored field streams;independent retained435000 and424310 read-order equations. No native memory mutation/queue/callback execution.',cases=rows,animation_table_prefixes=prefixes,source_original_execution=False,queue_runtime_verified=False,complete_game=False)
 (A/'original-protocol-vectors.json').write_text(json.dumps(out,separators=(',',':'))+'\n')
 summary=dict(cases=len(rows),front_complete=sum(r['preflight'].get('complete',False)for r in rows),runtime_complete=sum(r['runtime'].get('complete',False)for r in rows),both_complete=sum(r['preflight'].get('complete',False)and r['runtime'].get('complete',False)for r in rows),front_outside_or_truncated=sum('error'in r['preflight']for r in rows),runtime_outside_or_truncated=sum('error'in r['runtime']for r in rows),terminating_table_rows=[r['level']for r in prefixes if r['first_negative_index']is not None])
 print(json.dumps(summary))
if __name__=='__main__':main()
