#!/usr/bin/env python3
"""Revalidate retained source identities,selected complete lexical groups and new original instruction bytes."""
from pathlib import Path
import hashlib,importlib.util,json,struct,sys
sys.dont_write_bytecode=True
A=Path(__file__).resolve().parent;R=A.parent.parent;P=R/'build/analysis/game-battle-physical-guard-v1'
def read(p):return json.loads(p.read_text())
def info(p):return dict(path=str(p.relative_to(R)),bytes=p.stat().st_size,sha256=hashlib.sha256(p.read_bytes()).hexdigest())
def write(p,d):p.write_text(json.dumps(d,ensure_ascii=False,indent=2)+'\n')
def envelope(p):
 d=read(p)
 return d['structuredContent']if 'structuredContent'in d else json.loads(next(c['text']for c in d['content']if c['type']=='text'))if 'content'in d else d
def main():
 s=importlib.util.spec_from_file_location('historical207',A.parent/'game-battle-physical-specials-v1/verify_source.py');old=importlib.util.module_from_spec(s);s.loader.exec_module(old);history=[]
 def compare(p,v):assert read(p)==v,str(p);history.append(info(p))
 old.write=compare;old.main();prior=read(A.parent/'game-battle-physical-specials-v1/source-check.json');source=prior['source'];assert info(R/source['path'])==source
 merged={}
 for row in prior['canonical_cache_layers']:
  assert info(R/row['path'])==row;d=read(R/row['path']);assert not set(merged).intersection(d);merged.update(d)
 assert len(merged)==742
 raw=(R/source['path']).read_bytes();pe=struct.unpack_from('<I',raw,60)[0];base=struct.unpack_from('<I',raw,pe+52)[0];opt=struct.unpack_from('<H',raw,pe+20)[0];sections=[]
 for i in range(struct.unpack_from('<H',raw,pe+6)[0]):
  _,va,n,at=struct.unpack_from('<IIII',raw,pe+24+opt+40*i+8);sections.append((base+va,n,at))
 def original(address,n):
  address=int(address,16)
  for start,size,offset in sections:
   if start<=address and address+n<=start+size:return offset+address-start,raw[offset+address-start:offset+address-start+n]
  raise AssertionError('range not wholly original file-backed')
 selected=read(P/'selected-retained-functions.json');assert len(selected)==24;ranges=[]
 for address,d in selected.items():
  assert d==merged[address];body=d['procedure']['body'];assert body['available']and body['contains_entry']and not body['non_contiguous']and len(body['ranges'])==1
  n=body['total_bytes'];at,b=original(address,n);assert int(body['ranges'][0]['end'],16)+1==int(address,16)+n
  ranges.append(dict(address=address,bytes=n,file_offset=at,sha256=hashlib.sha256(b).hexdigest(),retained_analyze_function_id=d['id'],new_Evidence=False))
 instructions=[]
 for p in sorted(P.glob('instruction-*.json')):
  d=envelope(p);v=d['normalized_result'];assert d['subject']['digest']['sha256']==source['sha256']and d['analysis_profile']['digest']==prior['analysis_profile']and v['status']=='decoded'
  at,b=original(v['address'],v['length']);assert b==bytes.fromhex(v['bytes']);instructions.append(dict(evidence_id=d['evidence_id'],address=v['address'],file_offset=at,bytes=len(b),original_hex=b.hex(),artifact=info(p)))
 assert len(instructions)==14 and sum(r['bytes']for r in instructions)==53
 s=importlib.util.spec_from_file_location('ids205',A.parent/'game-battle-physical-consumers-v1/verify_source.py');ids=importlib.util.module_from_spec(s);s.loader.exec_module(ids)
 proof=read(R/'build/analysis/game-battle-physical-family-v1/prior-record-check.json');paths=[R/r['path']for r in proof['verified_prior_snapshot_files']]+[R/r['path']for r in proof['prior_small_snapshots_verified']]+[R/'build/analysis/game-battle-physical-family-v1/rea.snapshot.json',R/'build/analysis/game-battle-physical-consumers-v1/rea.snapshot.json',R/'build/analysis/game-battle-physical-specials-v1/rea.snapshot.json'];before=set()
 for p in paths:before.update(ids.evidence_ids(p))
 current=ids.evidence_ids(P/'rea.snapshot.json');assert len(before)==2455 and len(current)==178 and len(current-before)==14 and len(current|before)==2469
 assert {r['evidence_id']for r in instructions}==current-before
 assert envelope(P/'close-result.json')['result']['evidence_records']==178
 final=envelope(P/'session-final.json')['result'];assert not final['open']and not final['cleanup_pending'];assert final['server_identity']['package']['version']=='6.7.0'
 body=R/'build/analysis/game-battle-physical-family-v1/40a120-retained-pseudocode.txt';assert hashlib.sha256(body.read_bytes()).hexdigest()=='d2b1bccff7cc860eaa226b0bf128c7e0a2be1ec06854ed8832414f35837acae1'
 groups=read(P/'selected-case-groups.json');assert len(groups)==31;original_groups=read(R/'build/analysis/game-battle-physical-consumers-v1/consumer-inventory.json')['body_case_index']['complete_adjacent_alias_groups']
 for g in groups:
  original_group=next(r for r in original_groups if r['id']==g['id']);assert g['state']in g['values'];assert all(g[k]==original_group[k]for k in ['id','values','adjacent_alias_values','implementation_label_value','complete_group','private_text']);span=g['complete_group']['UTF8_byte_range'];part=body.read_bytes()[span['start']:span['end_exclusive']];assert hashlib.sha256(part).hexdigest()==g['complete_group']['sha256'];assert (P/('body-%s.txt'%g['state'])).read_bytes()==part
 for row in read(A/'consumer-map.json')['goto_owners']:
  part=(R/row['path']).read_bytes();assert hashlib.sha256(part).hexdigest()==row['sha256']and body.read_bytes().count(part)==1;assert row['label'].encode()in part
 generation=read(P/'reference-receipt.json');assert generation['exitCode']==0 and generation['unchanged']
 for name,row in generation['generatorInputs'].items():assert {k:info(R/name)[k]for k in ['bytes','sha256']}==row
 spec=read(A/'implementation-spec.json');ob=read(A/'consumer-obligations.json');previous=read(A.parent/'game-battle-physical-specials-v1/consumer-obligations.json');assert len(ob['groups'])==10
 for a,b in zip(ob['groups'],previous['groups']):assert all(a[k]==b[k]for k in ['id','source','classes','required_behavior','complete'])and a['complete']is False
 assert len(spec['modeled_pair_guard_classes'])==20 and not spec['complete_common_family_closure']
 out=dict(schema='moli.physical-guard-source-stage208.v1',source=source,tool=spec['tool'],analysis_profile=prior['analysis_profile'],canonical_cache_layers=prior['canonical_cache_layers'],canonical_functions=742,new_canonical_functions=[],finite_Evidence=dict(prior_union=2455,current_snapshot_records=178,new_distinct_records=14,new_ids=sorted(current-before),cumulative_after=2469,historical_snapshot_files=len(paths)),selected_retained_helpers=24,selected_original_ranges=ranges,selected_original_range_bytes=sum(r['bytes']for r in ranges),new_instruction_original_checks=instructions,new_instruction_original_bytes=53,complete_selected_body_groups=31,distinct_selected_body_groups=len(set(g['id']for g in groups)),selected_group_inventory=info(P/'selected-case-groups.json'),source_investigation_complete=False,historical_source_reverified=True,historical_outputs_unchanged=history,current_reference_generation=info(P/'reference-receipt.json'),implementation_spec=info(A/'implementation-spec.json'),consumer_map=info(A/'consumer-map.json'),consumer_obligations=info(A/'consumer-obligations.json'),session_closed=True,cleanup_pending=False,original_execution=0,VM_actions=0,official_sessions=0,complete_common_family_closure=False,runtime_implementation_complete=False,phase_complete=False,full_goal_complete=False,goal_status='active')
 write(A/'source-check.json',out);print(json.dumps(dict(canonical=742,new_canonical=0,finite=2469,new_instructions=14,instruction_bytes=53,selected_helpers=24,groups=31,closed=True)))
if __name__=='__main__':main()
