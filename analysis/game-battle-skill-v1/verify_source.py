#!/usr/bin/env python3
"""Check provider reads against the immutable PE and publish concise evidence only."""
from pathlib import Path
import hashlib,json,struct
A=Path(__file__).resolve().parent;R=A.parent.parent;P=R/'build/analysis/game-battle-skill-v1'
def info(p):return dict(path=str(p.relative_to(R)),bytes=p.stat().st_size,sha256=hashlib.sha256(p.read_bytes()).hexdigest())
def main():
 b=json.loads((P/'rea-final.json').read_text());old=json.loads((P/'rea-initial.json').read_text());old_ids={e['evidence_id']for e in old['records']};new=[e for e in b['records']if e['evidence_id']not in old_ids]
 source=R/'build/analysis/game-release-current-v1/legacy-members/cg_se_6000.exe';data=source.read_bytes();digest=hashlib.sha256(data).hexdigest();assert digest=='37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd'
 pe=struct.unpack_from('<I',data,60)[0];count=struct.unpack_from('<H',data,pe+6)[0];optional=struct.unpack_from('<H',data,pe+20)[0];base=struct.unpack_from('<I',data,pe+24+28)[0];sections=[]
 for i in range(count):
  at=pe+24+optional+i*40;size,va,raw_size,raw_at=struct.unpack_from('<IIII',data,at+8);sections.append((base+va,raw_at,raw_size))
 def file_offset(address,length):
  for va,at,size in sections:
   if va<=address and address+length<=va+size:return at+address-va
  raise AssertionError('Not backed by original PE')
 mappings={e['normalized_result']['address']:e for e in b['records']if e['operation']=='address_to_file_offset'};checks=[]
 for e in b['records']:
  if e['operation']!='read_bytes' or e['evidence_id']in old_ids:continue
  n=e['normalized_result'];address=n['address'];raw=bytes.fromhex(n['bytes_hex']);assert n['complete']and len(raw)==n['requested_bytes'];offset=file_offset(int(address,16),len(raw));m=mappings[address];assert offset==m['normalized_result']['file_offset'];assert data[offset:offset+len(raw)]==raw
  checks.append(dict(address=address,bytes=len(raw),file_offset=offset,sha256=hashlib.sha256(raw).hexdigest(),read_id=e['evidence_id'],mapping_id=m['evidence_id'],original_file_match=True))
 funcs=[]
 for e in new:
  if e['operation']!='analyze_function':continue
  n=e['normalized_result'];p=n['procedure'];body=p['body'];assert body['contains_entry']and not body['non_contiguous'];assert any(c['address']==p['address']and c['bytes']==body['total_bytes']for c in checks)
  funcs.append(dict(address=p['address'],body=body,evidence_id=e['evidence_id'],callees=[c['address']for c in n['callees']],authority='canonical provider function'))
 constants=[]
 for address,length in [('0x52d518',8)]:
  e=next(e for e in b['records']if e['operation']=='read_bytes'and e['normalized_result']['address']==address and e['normalized_result']['returned_bytes']==length);raw=bytes.fromhex(e['normalized_result']['bytes_hex']);at=file_offset(int(address,16),length);assert data[at:at+length]==raw;constants.append(dict(address=address,bytes=length,file_offset=at,evidence_id=e['evidence_id'],reused_retained_record=e['evidence_id']in old_ids,original_file_match=True,values=list(struct.unpack('<2f',raw))))
 from collections import Counter
 derived=json.loads((P/'derived-byte-checks.json').read_text());assert len(derived)==1 and derived[0]['equal']and derived[0]['instruction_bytes']==536
 out=dict(schema='moli.battle-skill-source-stage190.v1',classification='fact',source=dict(path=str(source.relative_to(R)),bytes=len(data),sha256=digest),rea='6.7.0',provider='Ghidra12.1.4',retained_records_before=len(old['records']),retained_records_after=len(b['records']),new_operations=dict(Counter(e['operation']for e in new)),new_canonical_functions=funcs,canonical_functions_before=651,canonical_functions_after=675,provider_byte_checks=checks,checked_bytes=sum(c['bytes']for c in checks),derived_KO_callback=dict(entry='0x41b7f0',instruction_bytes=536,all_original_bytes_match=True,authority='independent disposable Ghidra callback export; not a canonical provider function'),original_execution=False,official_session=False,limitations=['Static/decompiled control and independent reconstruction are distinct from original runtime execution','Native x87 identity and complete native renderer remain unverified','Read52d450/32B is an incomplete early table view;128B view proves style6 stride4 base243760','Configured source49 detaches and marks deleted; earlier optional unconfigured slice retains its historical partial behavior'])
 lifecycle=json.loads((P/'rea-lifecycle.json').read_text());assert not lifecycle['final']['open']and not lifecycle['final']['cleanup_pending'];out.update(session_closed=True,snapshot_saved=False,snapshot_failure=lifecycle['snapshot_attempt'],source_contract=info(A/'implementation-spec.json'),artifacts=[info(P/n)for n in ['rea-final.json','functions-complete.json','rea-lifecycle.json','knockout-callback-derived.json','derived-byte-checks.json','knockout-callback-export-receipt.json','knockout-callback-export.log']],source_span_bytes=sum(r['body']['total_bytes']for r in funcs),retained_constant_checks=constants,no_original_pseudocode_in_selected_delivery=True)
 (A/'source-check.json').write_text(json.dumps(out,indent=2)+'\n');print(json.dumps(dict(functions=len(funcs),records=len(b['records']),reads=len(checks),checked_bytes=out['checked_bytes'],operations=out['new_operations'])))
if __name__=='__main__':main()
