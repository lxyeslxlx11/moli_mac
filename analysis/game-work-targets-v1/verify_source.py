#!/usr/bin/env python3
"""Bind ordinary target-work and gathering observations to the fixed source."""
from pathlib import Path
from hashlib import sha256
import json,struct
ROOT=Path(__file__).resolve().parents[2]
A=ROOT/'analysis/game-work-targets-v1';P=ROOT/'build/analysis/game-work-targets-v1'
OLD=ROOT/'build/analysis/game-work-actions-v1'
DIGEST='37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd'
PROFILE='7810ea9437da59780820ec6fedb47ce47390841a95d527ddb6c3b3700fe180cb'
def read(p):return json.loads(p.read_text())
def identity(p):
 h=sha256()
 with p.open('rb') as f:
  for b in iter(lambda:f.read(1048576),b''):h.update(b)
 return dict(path=str(p.relative_to(ROOT)),bytes=p.stat().st_size,sha256=h.hexdigest())
def verify():
 source=ROOT/'build/analysis/game-release-current-v1/legacy-members/cg_se_6000.exe'
 observed=identity(source);assert observed['bytes']==1569280 and observed['sha256']==DIGEST
 data=source.read_bytes();pe=struct.unpack_from('<I',data,60)[0];base=struct.unpack_from('<I',data,pe+52)[0]
 assert base==0x400000
 table=pe+24+struct.unpack_from('<H',data,pe+20)[0]
 sections=[struct.unpack_from('<4I',data,table+i*40+8) for i in range(struct.unpack_from('<H',data,pe+6)[0])]
 def offset(address,n):return next(at+address-base-va for _,va,size,at in sections if 0<=address-base-va<=size-n)
 def raw(address,n):
  at=offset(address,n);return data[at:at+n]
 def admit(d):
  assert d['subject']['digest']['sha256']==DIGEST and d['analysis_profile']['digest']==PROFILE
  return d
 functions=[]
 new=['4d5dd0','47aed0','47acd0','4f4660','4d6890','4d5d90','47aa90','4f4640','4799d0','479880','4706e0','4f7a00']
 reused=['437410','479670','479b70','479f60','47ae00','4d5110','4d3e50','4f79b0','507690']
 for parent,ids in [(P,new),(OLD,reused)]:
  for address in ids:
   path=parent/('function-'+address+'.json');d=admit(read(path));n=d['normalized_result'];body=n['procedure']['body']
   assert n['procedure']['address']=='0x'+address and body['available']
   rows=read(parent/('bytes-'+address+'.json'));assert len(rows)==len(body['ranges']);ranges=[]
   for bound,row in zip(body['ranges'],rows):
    r=admit(row);start=int(bound['start'],16);count=int(bound['end'],16)-start+1;v=r['normalized_result'];b=bytes.fromhex(v['bytes_hex'])
    assert v['complete'] and v['returned_bytes']==count and b==raw(start,count)
    ranges.append(dict(start=hex(start),bytes=count,file_offset=offset(start,count),sha256=sha256(b).hexdigest(),evidence_id=r['evidence_id']))
   assert sum(r['bytes'] for r in ranges)==body['total_bytes']
   functions.append(dict(entry='0x'+address,artifact=identity(path),evidence_id=d['evidence_id'],ranges=ranges,reused=parent==OLD))
 assert len(functions)==21 and sum(r['bytes'] for f in functions for r in f['ranges'])==8585
 derived=[]
 for path in [P/'derived-target-callbacks.json',P/'derived-work-window-callbacks.json',ROOT/'build/analysis/game-craft-input-v1/derived-level-choice.json']:
  d=read(path);assert not d['originalExecution'] and not d['originalBytePatches'];entries=[]
  for e in d['entries']:
   assert e['status']=='derived-static-export' and e['decompileCompleted'];count=0
   for ins in e['instructions']:
    b=bytes.fromhex(ins['bytesHex']);assert raw(int(ins['address'],16),len(b))==b;count+=len(b)
   assert count==e['derivedBodyBytes']
   entries.append(dict(entry=hex(int(e['requestedEntry'],16)),bytes=count,canonical_REA_function_claimed=False))
  derived.append(dict(artifact=identity(path),entries=entries))
 assert sum(len(p['entries']) for p in derived)==13 and sum(e['bytes'] for p in derived for e in p['entries'])==5659
 windows=[]
 for name in ['labels.json','result-labels.json','window-47a900.json','window12-13-pointers.json','window12-13-descriptors.json','window12-13-templates.json','fallback-name.json']:
  d=admit(read(P/name));v=d['normalized_result'];b=bytes.fromhex(v['bytes_hex']);address=int(v['address'],16)
  assert v['complete'] and v['returned_bytes']==len(b) and b==raw(address,len(b))
  windows.append(dict(artifact=identity(P/name),address=v['address'],bytes=len(b),evidence_id=d['evidence_id'],sha256=sha256(b).hexdigest()))
 assert struct.unpack('<2I',raw(0x559a28,8))==(0x52dff8,0x52e028)
 assert struct.unpack_from('<3I',raw(0x52dff8,48),36)==(0x479f80,0x4a7d20,0x479820)
 assert raw(0x53459c,4)==b'???\0'
 closure=read(P/'rea-closure.json');assert not closure['open'] and not closure['cleanup_pending']
 count=closure['export']['result']['records'];assert count==1407==closure['close']['result']['evidence_records']
 result=dict(stage=305,source=observed,tool='REA6.7.0/Ghidra12.1.4',analysis_profile=PROFILE,
  functions=functions,canonical_function_bytes=8585,derived=derived,derived_entries=13,derived_instruction_bytes=5659,
  windows=windows,previous_source=identity(ROOT/'analysis/game-work-actions-v1/source-check.json'),
  evidence=identity(P/'rea-evidence.json'),snapshot=identity(P/'rea.snapshot.json'),closure=identity(P/'rea-closure.json'),
  retained_records=count,ancestor_retained_records=1359,REA_closed=True,
  facts=['Kind3 ids221/222/223/224 map to disguise/transform/first-aid/treatment.472a10 checks selected-level cost then sends*[c(skillSlot).',
   'KxC ->4f4640/4d6890 builds up to10 primary choices from self,existing party bodies and incoming name/type pairs;disguise excludes self and stops at incoming type1.',
   '47a960 queries*^X(primary ordinal) for non-disguise choices except type3;otherwise submits+>L(skill,selected level,primary ordinal,empty bytes).',
   'L<% ->4f4660/4d5dd0 builds up to6 secondary rows;self reads current character and eligible local pets,other choices read7-field rows.Transform skips the first person row.',
   '47abc0 submits the saved source ordinal,not the visible index or absolute pet slot;back and result retry requery*[c.',
   'Lor kind3 has7 numbers with mode-specific final HP/recovery outcome;4d5110 and47aed0 use the same attribute globals.No inventory/MP/actor mutation is inferred.',
   'Kind4 known ids225/251 use pose5,226/253 pose7,227/250 pose6;cost uses selected level7c times main34/100 and requires free bag space.',
   '479670/4799d0 start an initial6500ms wait;479f80 submits only when unsigned now>deadline,then future waits are4500ms.No7ba or random draw occurs.',
   '479b70 starts a2000ms result wait and disables explicit restart;479880 pause enables it.Continuing mode rechecks MP and bag space before automatic restart.Paused mode does not submit another cycle.',
   'Lor kind4 success has7 numbers and one unescaped name<=28bytes;overlong names use???;failure ignores payload and zeroes displayed gains.'],
  limitations=['Ordinary context0 only;alternate context scaling and queries remain pending.',
   'Target name slots are17 bytes in native state;overlong names do not establish valid overflow or alias behavior.',
   'Native full widgets/animations/global aliases and exact process clock cadence are not proven by static analysis.',
   'Other kind4 identifiers and all original37 requirements/10 incomplete groups remain pending.',
   'Local source evidence does not establish real WeChat/physical phone/current/official acceptance.'],
  VM_actions=0,original_execution=0,official_sessions=0,full_goal_complete=False)
 (A/'source-check.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n')
 print(json.dumps(dict(stage=305,functions=21,bytes=8585,derived_entries=13,derived_bytes=5659,records=count,REA_closed=True)))
if __name__=='__main__':verify()
