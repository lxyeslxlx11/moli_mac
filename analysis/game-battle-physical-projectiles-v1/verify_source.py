#!/usr/bin/env python3
"""Read-only revalidation of retained REA source and current finite projectile port.

No original executable is launched. Selected dossier ranges are mapped into the
fixed PE; independent LLVM checks corroborate two precise native observations.
These range hashes are not additional canonical REA functions or Evidence.
"""
from pathlib import Path
import hashlib,importlib.util,json,struct,sys
sys.dont_write_bytecode=True
A=Path(__file__).resolve().parent;R=A.parent.parent;P=R/'build/analysis/game-battle-physical-projectiles-v1'
def read(p):return json.loads(p.read_text())
def write(p,d):p.write_text(json.dumps(d,ensure_ascii=False,indent=2)+'\n')
def info(p):return dict(path=str(p.relative_to(R)),bytes=p.stat().st_size,sha256=hashlib.sha256(p.read_bytes()).hexdigest())
def envelope(p):
 d=read(p)
 if 'structuredContent'in d:return d['structuredContent']
 if 'content'in d:return json.loads(next(c['text']for c in d['content']if c['type']=='text'))
 return d
def main():
 history=[];path=R/'analysis/game-battle-physical-consumers-v1/verify_source.py'
 s=importlib.util.spec_from_file_location('retained_source205',path);m=importlib.util.module_from_spec(s);s.loader.exec_module(m)
 def compare(p,v):assert read(p)==v,str(p);history.append(info(p))
 m.write=compare;m.main()
 old=read(R/'analysis/game-battle-physical-consumers-v1/source-check.json');source=old['source'];assert info(R/source['path'])==source
 assert old['canonical_functions']==742 and old['finite_Evidence']['cumulative_after']==2445
 merged={}
 for row in old['canonical_cache_layers']:
  assert info(R/row['path'])==row;d=read(R/row['path']);assert not set(merged).intersection(d);merged.update(d)
 assert len(merged)==742
 selected=read(P/'selected-retained-functions.json');assert len(selected)==33
 raw=(R/source['path']).read_bytes();pe=struct.unpack_from('<I',raw,60)[0];base=struct.unpack_from('<I',raw,pe+52)[0];opt=struct.unpack_from('<H',raw,pe+20)[0];sections=[]
 for i in range(struct.unpack_from('<H',raw,pe+6)[0]):
  _,va,n,at=struct.unpack_from('<IIII',raw,pe+24+opt+40*i+8);sections.append((base+va,n,at))
 def original(address,n):
  address=int(address,16)
  for start,size,offset in sections:
   if start<=address and address+n<=start+size:return offset+address-start,raw[offset+address-start:offset+address-start+n]
  raise AssertionError('Original range is not wholly file-backed')
 ranges=[]
 for address,d in selected.items():
  assert d==merged[address];body=d['procedure']['body'];assert body['available']and body['contains_entry']and not body['non_contiguous']and len(body['ranges'])==1
  n=body['total_bytes'];at,b=original(address,n);assert int(body['ranges'][0]['end'],16)+1==int(address,16)+n
  ranges.append(dict(address=address,bytes=n,file_offset=at,sha256=hashlib.sha256(b).hexdigest(),retained_analyze_function_id=d['id'],new_Evidence=False))
 groups=read(P/'selected-case-groups.json');assert [g['state']for g in groups]==[15,16,17,18,20,21,22,23,28,41,113,238]
 for g in groups:
  row=g['complete_group'];b=(R/row['source']).read_bytes()[row['UTF8_byte_range']['start']:row['UTF8_byte_range']['end_exclusive']]
  assert hashlib.sha256(b).hexdigest()==row['sha256'];assert info(R/g['private_text']['path'])==g['private_text'];assert (R/g['private_text']['path']).read_bytes()==b
 sector=read(P/'llvm-sector-receipt.json');message=read(P/'llvm-message-receipt.json')
 for row in [sector,message]:
  assert row['exit_code']==0 and not row['original_execution']and row['source_sha256']==source['sha256'];assert info(R/row['log']['path'])==row['log']
 assert original('0x419c83',2)[1]==bytes.fromhex('de e9')
 assert 'fsubp'in(R/sector['log']['path']).read_text()and 'fsub'in(R/sector['log']['path']).read_text()
 native=selected['0x420080']['pseudocode'];assert '*(float *)(param_1 + 0x40)'in native and '*(float *)(param_1 + 0x44)'in native
 llvm=(R/message['log']['path']).read_text();assert '[eax + 0x40]'in llvm and '[eax + 0x44]'in llvm
 spec=read(A/'implementation-spec.json');assert len(spec['modeled_positive_classes'])==26 and spec['excluded_level9']==[259,266]
 assert spec['source']==source and not spec['complete_common_family_closure']
 ob=read(A/'consumer-obligations.json');oldob=read(R/'analysis/game-battle-physical-consumers-v1/consumer-obligations.json');assert len(ob['groups'])==len(oldob['groups'])==10
 for a,b in zip(ob['groups'],oldob['groups']):assert all(a[k]==b[k]for k in['id','source','classes','required_behavior','complete'])and a['complete']is False
 session=envelope(P/'session-initial.json')['result'];assert not session['open']and not session['cleanup_pending'];assert session['server_identity']['package']['version']=='6.7.0'
 final_session=envelope(P/'session-final.json')['result'];assert not final_session['open']and not final_session['cleanup_pending'];assert final_session['server_identity']['package']['version']=='6.7.0'
 proof=read(P/'reference-generation-receipt.json');assert proof['exit_code']==0 and proof['model_sources_unchanged']and proof['queues']==61920 and proof['scenarios']==879
 assert info(R/proof['output']['path'])==proof['output'];assert info(R/proof['log']['path'])==proof['log']
 for row in proof['model_sources_before']:assert info(R/row['path'])==row
 out=dict(schema='moli.physical-projectiles-source-stage206.v1',source=source,tool=spec['tool'],analysis_profile=old['analysis_profile'],
  canonical_cache_layers=old['canonical_cache_layers'],canonical_functions=742,new_canonical_functions=[],finite_Evidence=dict(cumulative_after=2445,new_distinct_records=0,latest_retained_snapshot_records=154),
  selected_retained_helpers=33,selected_original_range_checks=ranges,selected_original_range_bytes=sum(r['bytes']for r in ranges),selected_complete_case_groups=12,
  independent_static_decoder='Apple LLVM21.0.0',independent_disassembly_receipts=[info(P/'llvm-sector-receipt.json'),info(P/'llvm-message-receipt.json')],
  prior_source_reverified_read_only=True,historical_outputs_unchanged=history,retained_source_check=info(R/'analysis/game-battle-physical-consumers-v1/source-check.json'),
  implementation_spec=info(A/'implementation-spec.json'),consumer_map=info(A/'consumer-map.json'),consumer_obligations=info(A/'consumer-obligations.json'),
  artifacts=[info(P/n)for n in['selected-retained-functions.json','selected-case-groups.json','session-initial.json','session-final.json','llvm-version.log','llvm-sector-disassembly.log','llvm-message-disassembly.log','reference-generation-receipt.json']],
  session_closed=True,cleanup_pending=False,original_execution=0,VM_actions=0,official_sessions=0,complete_common_family_closure=False,
  source_investigation_complete=False,runtime_implementation_complete=False,phase_complete=False,full_goal_complete=False,goal_status='active')
 write(A/'source-check.json',out);print(json.dumps(dict(canonical_functions=742,new_canonical_functions=0,finite_Evidence=2445,selected_helpers=33,selected_range_bytes=out['selected_original_range_bytes'],case_groups=12,source_session_closed=True)))
if __name__=='__main__':main()
