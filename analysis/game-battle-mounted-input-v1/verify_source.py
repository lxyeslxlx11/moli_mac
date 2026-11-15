#!/usr/bin/env python3
"""Verify fixed-sample REA observations and original callback bytes before port acceptance."""
from pathlib import Path
import hashlib,json,struct
A=Path(__file__).resolve().parent;R=A.parent.parent;P=R/'build/analysis/game-battle-mounted-input-v1'
def read(p):return json.loads(p.read_text())
def unwrap(d):
 if 'result'in d:return d['result']
 if 'structuredContent'in d:return d['structuredContent']['result']
 return json.loads(next(v['text']for v in d['content']if v['type']=='text'))['result']
def info(p):return dict(path=str(p.relative_to(R)),bytes=p.stat().st_size,sha256=hashlib.sha256(p.read_bytes()).hexdigest())
def main():
 old=read(R/'analysis/game-battle-character-change-v1/source-check.json');source=R/old['source']['path'];assert info(source)==old['source'];raw=source.read_bytes();pe=struct.unpack_from('<I',raw,60)[0];base=struct.unpack_from('<I',raw,pe+52)[0];optional=struct.unpack_from('<H',raw,pe+20)[0];sections=[]
 for i in range(struct.unpack_from('<H',raw,pe+6)[0]):
  _,va,count,at=struct.unpack_from('<IIII',raw,pe+24+optional+i*40+8);sections.append((base+va,at,count))
 def offset(va,n):
  for start,at,count in sections:
   if start<=va and va+n<=start+count:return at+va-start
  raise AssertionError('Absent original file range')
 retained=R/'build/analysis/game-battle-character-change-v1/functions-complete.json';assert info(retained)==next(v for v in old['artifacts']if v['path']==str(retained.relative_to(R)));functions=read(retained);assert len(functions)==685
 evidence=[];checks=[];new={};files=[retained]
 for address,n in [('4f0aa0',1367),('4f1000',573),('4f1420',679),('4ff000',39),('4fde60',56),('4fde20',56)]:
  ev=read(P/f'function-{address}.json');v=ev['normalized_result'];assert v['procedure']['address']=='0x'+address and v['procedure']['body']['total_bytes']==n
  rb=read(P/f'read_bytes-{address}.json');fb=read(P/f'address_to_file_offset-{address}.json');b=rb['normalized_result'];f=fb['normalized_result'];at=offset(int(address,16),n)
  assert b['requested_bytes']==b['returned_bytes']==n and b['complete']and f['file_offset']==at and bytes.fromhex(b['bytes_hex'])==raw[at:at+n]
  for e in [ev,rb,fb]:assert e['subject']['digest']['sha256']==old['source']['sha256'];evidence.append(e['evidence_id'])
  key='0x'+address;assert key not in functions;new[key]=dict(id=ev['evidence_id'],**v);checks.append(dict(address=key,bytes=n,file_offset=at,sha256=hashlib.sha256(raw[at:at+n]).hexdigest(),evidence_id=ev['evidence_id'],original_match=True));files.extend(P/(kind+'-'+address+'.json')for kind in ['function','read_bytes','address_to_file_offset'])
 constants=[]
 for address,data in [('53459c','3f3f3f00'),('5340e0','ffffffff01000000ffffffffffffffff')]:
  rb=read(P/f'read_bytes-{address}.json');fb=read(P/f'address_to_file_offset-{address}.json');v=rb['normalized_result'];n=len(bytes.fromhex(data));at=offset(int(address,16),n);assert v['complete']and v['returned_bytes']==n and v['bytes_hex'].lower()==data and bytes.fromhex(data)==raw[at:at+n]and fb['normalized_result']['file_offset']==at
  evidence.extend([rb['evidence_id'],fb['evidence_id']]);files.extend([P/f'read_bytes-{address}.json',P/f'address_to_file_offset-{address}.json']);constants.append(dict(address='0x'+address,bytes=n,hex=data,original_match=True))
 for address in ['ef35f0','5340e0']:
  ev=read(P/f'xrefs-{address}.json');assert ev['subject']['digest']['sha256']==old['source']['sha256'];evidence.append(ev['evidence_id']);files.append(P/f'xrefs-{address}.json')
 assert len(evidence)==len(set(evidence))==24 and sum(v['bytes']for v in checks)==2770
 callbacks=R/'build/analysis/game-battle-input-v1/callbacks-derived.json';derived=read(callbacks);cb=[]
 for entry,n in [('0x48b170',359),('0x48b2e0',362)]:
  row=next(v for v in derived['functions']if v['entry']==entry);count=0
  for instruction in row['instructions']:
   b=bytes.fromhex(instruction['bytes']);at=offset(int(instruction['address'],16),len(b));assert raw[at:at+len(b)]==b;count+=len(b)
  assert count==row['body_bytes']==n;cb.append(dict(entry=entry,bytes=count,all_original_bytes_match=True,canonical=False))
 assembly=new['0x4f1420']['assembly'];assert '0x4f157e: JMP 0x004f148c'in assembly and '0x4f1671: ADD EBP, 0x8'in assembly
 initial=unwrap(read(P/'session-initial.json'));final=unwrap(read(P/'session-final.json'));assert not initial['open']and not initial['cleanup_pending']and not final['open']and not final['cleanup_pending'];closed=unwrap(read(P/'close-result.json'));assert closed['primitive_entries']==6 and closed['evidence_records']==24
 functions.update(new);assert len(functions)==691;complete=P/'functions-complete.json'
 if complete.exists():assert read(complete)==functions
 else:complete.write_text(json.dumps(functions,ensure_ascii=False,separators=(',',':'))+'\n')
 files.extend([complete,callbacks,P/'session-initial.json',P/'session-final.json',P/'close-result.json',P/'rea.snapshot.json'])
 out=dict(schema='moli.battle-mounted-input-source-stage195.v1',classification='fact: fixed sample REA bytes; derived: callback static derivation and independent implementation',source=old['source'],rea='6.7.0',provider='Ghidra12.1.4',canonical_functions_before=685,canonical_functions_after=691,new_canonical_functions=checks,retained_records_before=2240,retained_record_union_after=2264,new_primitive_records=24,checked_new_function_bytes=2770,constants=constants,derived_callbacks=cb,source_contract=info(A/'implementation-spec.json'),artifacts=[info(p)for p in files],current_snapshot_records=24,session_closed=True,cleanup_pending=False,original_execution=0,VM_actions=0,official_sessions=0,limitations=['New24-record snapshot is distinct from cumulative2264 record union','Source receivers ordinary UI gate, global wrapped-value RNG and native popup/hit/audio are not fully reproduced','Current/official/device compatibility and full original objective remain active'],phase_complete=False,full_goal_complete=False,goal_status='active')
 (A/'source-check.json').write_text(json.dumps(out,ensure_ascii=False,indent=2)+'\n');print(json.dumps(dict(functions=691,record_union=2264,new_records=24,new_function_bytes=2770,callback_bytes=721,session_closed=True)))
if __name__=='__main__':main()
