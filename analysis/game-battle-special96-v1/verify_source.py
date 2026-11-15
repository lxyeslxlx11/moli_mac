#!/usr/bin/env python3
"""Byte-bind96 special callbacks and preserved alternate-profile boundary,explicitly derived producer and closed REA provenance."""
from pathlib import Path
import hashlib,importlib.util,json,struct,sys
sys.dont_write_bytecode=True
A=Path(__file__).resolve().parent;R=A.parent.parent;P=R/'build/analysis/game-battle-special96-v1'
def read(p):return json.loads(p.read_text())
def info(p):return dict(path=str(p.relative_to(R)),bytes=p.stat().st_size,sha256=hashlib.sha256(p.read_bytes()).hexdigest())
def write(p,d):p.write_text(json.dumps(d,ensure_ascii=False,indent=2)+'\n')
def envelope(p):
 d=read(p)
 return d['structuredContent']if 'structuredContent'in d else json.loads(next(c['text']for c in d['content']if c['type']=='text'))if 'content'in d else d
def main():
 prior=read(A.parent/'game-battle-nested-physical-v1/source-check.json');spec=read(A/'implementation-spec.json');source=spec['source'];assert source==prior['source']and info(R/source['path'])==source
 historical=read(P/'historical-source-receipt.json');assert historical['exit_code']==0 and historical['verified_pre_edit_files']==3388 and historical['historical_outputs_unchanged']
 for row in historical['historical_outputs_unchanged']:assert info(R/row['path'])==row
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
  raise AssertionError('not wholly original file-backed')
 selected=read(P/'selected-retained-functions.json');assert len(selected)==47;ranges=[]
 for address,d in selected.items():
  assert d==merged[address];body=d['procedure']['body'];assert body['available']and body['contains_entry']and not body['non_contiguous']and len(body['ranges'])==1
  n=body['total_bytes'];at,b=original(address,n);assert int(body['ranges'][0]['end'],16)+1==int(address,16)+n
  ranges.append(dict(address=address,bytes=n,file_offset=at,sha256=hashlib.sha256(b).hexdigest(),retained_analyze_function_id=d['id'],new_Evidence=False))
 assert sum(r['bytes']for r in ranges)==92063
 instructions=[]
 for p in sorted(P.glob('instruction-*.json')):
  d=envelope(p);v=d['normalized_result'];assert d['subject']['digest']['sha256']==source['sha256']and d['analysis_profile']['digest']==prior['analysis_profile']and v['status']=='decoded'
  at,b=original(v['address'],v['length']);assert b==bytes.fromhex(v['bytes']);instructions.append(dict(evidence_id=d['evidence_id'],address=v['address'],file_offset=at,bytes=len(b),original_hex=b.hex(),observed_canonical_procedure=v['procedure'],artifact=info(p)))
 assert len(instructions)==24 and sum(r['bytes']for r in instructions)==135
 s=importlib.util.spec_from_file_location('ids205',A.parent/'game-battle-physical-consumers-v1/verify_source.py');ids=importlib.util.module_from_spec(s);s.loader.exec_module(ids)
 proof=read(R/'build/analysis/game-battle-physical-family-v1/prior-record-check.json');paths=[R/r['path']for r in proof['verified_prior_snapshot_files']]+[R/r['path']for r in proof['prior_small_snapshots_verified']]+[R/('build/analysis/'+n+'/rea.snapshot.json')for n in ['game-battle-physical-family-v1','game-battle-physical-consumers-v1','game-battle-physical-specials-v1','game-battle-physical-guard-v1','game-battle-physical-results-v1','game-battle-projectile-results-v1','game-battle-self-physical-v1','game-battle-nested-physical-v1']];before=set()
 for p in paths:before.update(ids.evidence_ids(p))
 current=ids.evidence_ids(P/'rea.snapshot.json');assert len(before)==2576 and len(current)==309 and len(current-before)==24 and len(current|before)==2600
 assert {r['evidence_id']for r in instructions}==current-before
 closed=envelope(P/'close-result.json')['result'];assert closed['evidence_records']==309 and closed['primitive_entries']==32 and closed['workflow_entries']==1
 final=envelope(P/'session-final.json')['result'];assert not final['open']and not final['cleanup_pending']and final['server_identity']['package']['version']=='6.7.0'
 body=R/'build/analysis/game-battle-physical-family-v1/40a120-retained-pseudocode.txt';assert hashlib.sha256(body.read_bytes()).hexdigest()=='d2b1bccff7cc860eaa226b0bf128c7e0a2be1ec06854ed8832414f35837acae1'
 groups=read(P/'selected-case-groups.json');assert len(groups)==22;inventory=read(R/'build/analysis/game-battle-physical-consumers-v1/consumer-inventory.json')['body_case_index']['complete_adjacent_alias_groups']
 for g in groups:
  prior_group=next(r for r in inventory if r['id']==g['id']);assert g['state']in g['values']and all(g[k]==prior_group[k]for k in ['id','values','adjacent_alias_values','implementation_label_value','complete_group','private_text']);span=g['complete_group']['UTF8_byte_range'];b=body.read_bytes()[span['start']:span['end_exclusive']];assert hashlib.sha256(b).hexdigest()==g['complete_group']['sha256']and(P/('body-%s.txt'%g['state'])).read_bytes()==b
 cmap=read(A/'consumer-map.json');main=cmap['derived_main'];assert main['canonical']is False and main['procedure_existed_before_seed']is False
 assert info(R/main['evidence']['path'])==main['evidence']and info(R/main['pseudocode']['path'])==main['pseudocode']
 derived=read(R/main['evidence']['path']);assert derived['originalExecution']is False and derived['originalBytePatches']is False
 entry=next(r for r in derived['entries']if r['requestedEntry']=='004260b0');assert entry['functionExistedBeforeSeed']is False and entry['status']=='derived-static-export'and entry['derivedBodyBytes']==54685
 assert entry['pseudocode']==(R/main['pseudocode']['path']).read_text();total=0
 for row in entry['instructions']:
  b=bytes.fromhex(row['bytesHex']);_,actual=original(row['address'],len(b));assert b==actual;total+=len(b)
 assert total==54685 and len(entry['instructions'])==14120
 for row in main['selected_complete_lexical_spans']:
  span=row['UTF8_byte_range'];b=(R/main['pseudocode']['path']).read_bytes()[span['start']:span['end_exclusive']];assert hashlib.sha256(b).hexdigest()==row['sha256']and(R/row['private_artifact']['path']).read_bytes()==b
 generation=read(P/'reference-generation-receipt.json');assert generation['exit_code']==0 and generation['model_sources_unchanged']and(generation['queues'],generation['scenarios'],generation['states'],generation['RGBA'])==(4160,82,33886,12414)
 assert generation['output']==info(A/'original-vectors.json')
 for row in generation['model_sources_before']:assert info(R/row['path'])==row
 baseline=read(P/'preflight.json')['candidate_backups'];old_vectors=[]
 for row in baseline:
  if row['path'].endswith('/original-vectors.json')or row['path'].endswith('/generate_vectors.py'):
   assert info(R/row['path'])==row;old_vectors.append(row)
 write(P/'prior-model-identities-unchanged.json',old_vectors)
 constants=read(P/'constant-original.json');assert len(constants)==1
 for row in constants:
  at,b=original(row['address'],row['bytes']);assert at==row['file_offset']and b.hex()==row['original_hex']and struct.unpack('<f',b)[0]==row['float32']==180
 partial=prior['partial_435000'];assert partial['canonical_body_bytes']==28 and partial['source_llvm_bytes']==461 and not partial['provider_body_repaired'];assert info(R/partial['disassembly']['path'])==partial['disassembly']
 ob=read(A/'consumer-obligations.json');previous=read(A.parent/'game-battle-nested-physical-v1/consumer-obligations.json');assert len(ob['groups'])==10
 for a,b in zip(ob['groups'],previous['groups']):assert all(a[k]==b[k]for k in ['id','source','classes','required_behavior','complete'])and a['complete']is False
 assert len(spec['modeled_positive_classes'])==27 and len(set(spec['modeled_positive_classes']))==27 and not spec['complete_common_family_closure']
 out=dict(schema='moli.special96-source-stage213.v1',source=source,tool=spec['tool'],analysis_profile=prior['analysis_profile'],canonical_cache_layers=prior['canonical_cache_layers'],canonical_functions=742,new_canonical_functions=[],finite_Evidence=dict(prior_union=2576,current_snapshot_records=309,new_distinct_records=24,new_ids=sorted(current-before),cumulative_after=2600,historical_snapshot_files=len(paths)),selected_retained_helpers=47,selected_original_ranges=ranges,selected_original_range_bytes=92063,new_instruction_original_checks=instructions,new_instruction_original_bytes=135,complete_selected_body_groups=22,distinct_selected_body_groups=len(set(g['id']for g in groups)),selected_group_inventory=info(P/'selected-case-groups.json'),retained_analyst_seeded_main=dict(evidence=main['evidence'],pseudocode=main['pseudocode'],instructions_original_checked=14120,instruction_original_bytes=54685,canonical=False,not_new_function_or_Evidence=True,producer_lexical_spans=len(main['selected_complete_lexical_spans'])),source_investigation_complete=False,historical_source_reverified=True,historical_outputs_unchanged=historical['historical_outputs_unchanged'],historical_view_receipt=info(P/'historical-source-receipt.json'),current_reference_generation=info(P/'reference-generation-receipt.json'),prior_vectors_unchanged=info(P/'prior-model-identities-unchanged.json'),partial_435000=partial,original_float_constant=info(P/'constant-original.json'),source_corrections=info(A/'source-corrections.json'),implementation_spec=info(A/'implementation-spec.json'),consumer_map=info(A/'consumer-map.json'),consumer_obligations=info(A/'consumer-obligations.json'),session_closed=True,cleanup_pending=False,original_execution=0,VM_actions=0,official_sessions=0,complete_common_family_closure=False,runtime_implementation_complete=False,phase_complete=False,full_goal_complete=False,goal_status='active')
 write(A/'source-check.json',out);print(json.dumps(dict(canonical=742,finite_Evidence=2600,retained_helpers=47,retained_ranges_bytes=92063,new_instructions=24,new_instruction_original_bytes=135,body_entries=22,body_lexical_groups=22,retained_derived_main_original_instructions=14120,retained_derived_main_original_bytes=54685,historical_source_reverified=True,REA_closed=True)),flush=True)
if __name__=='__main__':main()
