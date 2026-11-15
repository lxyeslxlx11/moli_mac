#!/usr/bin/env python3
"""Byte-check retained REA authority and new authored94/257/262 port contracts."""
from pathlib import Path
import hashlib,importlib.util,json,struct,sys
sys.dont_write_bytecode=True
A=Path(__file__).resolve().parent;R=A.parent.parent;P=R/'build/analysis/game-battle-special-pairs-v1';Q=R/'build/analysis/game-battle-pair-specials-v1'
def read(p):return json.loads(p.read_text())
def info(p):return dict(path=str(p.relative_to(R)),bytes=p.stat().st_size,sha256=hashlib.sha256(p.read_bytes()).hexdigest())
def same(row):assert info(R/row['path'])=={k:row[k]for k in ['path','bytes','sha256']},row['path']
def write(p,d):p.write_text(json.dumps(d,ensure_ascii=False,indent=2)+'\n')
def envelope(p):
 d=read(p);return d['structuredContent']if 'structuredContent'in d else json.loads(next(c['text']for c in d['content']if c['type']=='text'))if 'content'in d else d

def main():
 prior=read(A.parent/'game-battle-pair-specials-v1/source-check.json');spec=read(A/'implementation-spec.json');cmap=read(A/'consumer-map.json');same(prior['source']);assert spec['source']==prior['source']
 hist=read(P/'historical-source-receipt.json');assert hist['exit_code']==0 and hist['verified_pre_edit_files']==3436
 for row in hist['historical_outputs_unchanged']:same(row)
 allf={}
 for row in prior['canonical_cache_layers']:
  same(row);d=read(R/row['path']);assert not set(allf).intersection(d);allf.update(d)
 assert len(allf)==742
 raw=(R/prior['source']['path']).read_bytes();pe=struct.unpack_from('<I',raw,60)[0];base=struct.unpack_from('<I',raw,pe+52)[0];opt=struct.unpack_from('<H',raw,pe+20)[0];sections=[]
 for i in range(struct.unpack_from('<H',raw,pe+6)[0]):
  vs,va,n,at=struct.unpack_from('<IIII',raw,pe+24+opt+40*i+8);sections.append((base+va,n,at,vs))
 def original(address,n):
  address=int(address,16)if isinstance(address,str)else address
  for start,size,offset,_ in sections:
   if start<=address and address+n<=start+size:return offset+address-start,raw[offset+address-start:offset+address-start+n]
  raise AssertionError('not wholly original file-backed')
 selected=read(Q/'selected-retained-functions.json');assert len(selected)==59;ranges=[]
 for address,d in selected.items():
  assert d==allf[address];body=d['procedure']['body'];assert body['available']and body['contains_entry']and not body['non_contiguous']and len(body['ranges'])==1
  n=body['total_bytes'];at,b=original(address,n);assert int(body['ranges'][0]['end'],16)+1==int(address,16)+n
  assert(Q/(address[2:]+'-retained-pseudocode.txt')).read_text()==d['pseudocode']
  assert(Q/(address[2:]+'-retained-assembly.txt')).read_text()=='\n'.join(d['assembly'])+'\n'
  ranges.append(dict(address=address,bytes=n,file_offset=at,sha256=hashlib.sha256(b).hexdigest(),retained_analyze_function_id=d['id'],new_Evidence=False))
 assert ranges==prior['selected_original_ranges']and sum(r['bytes']for r in ranges)==93763
 for row in prior['new_instruction_original_checks']:
  d=envelope(R/row['artifact']['path']);same(row['artifact']);v=d['normalized_result'];at,b=original(v['address'],v['length']);assert b==bytes.fromhex(v['bytes'])and at==row['file_offset']
 for row in prior['original_data_checks']:
  same(row['artifact']);at,b=original(row['address'],row['bytes']);assert b.hex()==row['original_hex']and at==row['file_offset']
 main=cmap['derived_main'];assert not main['canonical']and not main['procedure_existed_before_seed'];same(main['evidence']);same(main['pseudocode']);derived=read(R/main['evidence']['path']);entry=next(r for r in derived['entries']if r['requestedEntry']=='004260b0');assert not entry['functionExistedBeforeSeed']and not derived['originalExecution']and not derived['originalBytePatches'];total=0
 for row in entry['instructions']:
  b=bytes.fromhex(row['bytesHex']);_,actual=original(row['address'],len(b));assert actual==b;total+=len(b)
 assert len(entry['instructions'])==14120 and total==54685
 for row in main['selected_complete_lexical_spans']+cmap['additional_derived_main_spans']:
  span=row['UTF8_byte_range'];b=(R/main['pseudocode']['path']).read_bytes()[span['start']:span['end_exclusive']];assert hashlib.sha256(b).hexdigest()==row['sha256']and(R/row['private_artifact']['path']).read_bytes()==b
 groups=read(Q/'selected-case-groups.json');assert len(groups)==18
 inventory=read(R/'build/analysis/game-battle-physical-consumers-v1/consumer-inventory.json')['body_case_index']['complete_adjacent_alias_groups'];body=(Q/'40a120-retained-pseudocode.txt').read_bytes()
 for g in groups+[cmap['additional_retained_model_cleanup_group']]:
  known=next(k for k in inventory if k['id']==g['id']);assert all(g[k]==known[k]for k in ['id','values','adjacent_alias_values','complete_group']);span=g['complete_group']['UTF8_byte_range'];b=body[span['start']:span['end_exclusive']];assert hashlib.sha256(b).hexdigest()==g['complete_group']['sha256']and(R/known['private_text']['path']).read_bytes()==b
 assert cmap['additional_retained_model_cleanup_group']['values']==[44]
 partial=prior['partial_435000'];same(partial['disassembly']);assert(partial['canonical_body_bytes'],partial['source_llvm_bytes'],partial['provider_body_repaired'])==(28,461,False)
 ids_spec=importlib.util.spec_from_file_location('source_ids',A.parent/'game-battle-physical-consumers-v1/verify_source.py');ids=importlib.util.module_from_spec(ids_spec);ids_spec.loader.exec_module(ids)
 proof=read(R/'build/analysis/game-battle-physical-family-v1/prior-record-check.json');paths=[R/r['path']for r in proof['verified_prior_snapshot_files']]+[R/r['path']for r in proof['prior_small_snapshots_verified']]+[R/('build/analysis/'+n+'/rea.snapshot.json')for n in ['game-battle-physical-family-v1','game-battle-physical-consumers-v1','game-battle-physical-specials-v1','game-battle-physical-guard-v1','game-battle-physical-results-v1','game-battle-projectile-results-v1','game-battle-self-physical-v1','game-battle-nested-physical-v1','game-battle-special96-v1']]+[Q/'rea-final.snapshot.json'];union=set()
 for p in paths:union.update(ids.evidence_ids(p))
 assert len(union)==2646 and len(ids.evidence_ids(Q/'rea-final.snapshot.json'))==355
 baseline=read(P/'preflight.json')['candidate_backups'];models=[r for r in baseline if r['path'].endswith('/generate_vectors.py')or r['path'].endswith('/original-vectors.json')];assert len(models)==126
 for row in models:same(row);same(dict(row,path=str((P/'before'/row['path']).relative_to(R))))
 write(P/'prior-model-identity-review.json',dict(changed=[],unchanged=models,all_prior_generators_and_goldens_preserved=True))
 generation=read(P/'reference-generation-receipt.json');assert generation['exit_code']==0 and generation['model_sources_unchanged'];same(generation['output']);same(generation['log'])
 assert(generation['queues'],generation['scenarios'],generation['states'],generation['RGBA'],generation['body_settled'])==(41760,307,71230,32260,286)
 for row in generation['model_sources_before']:same(row)
 ob=read(A/'consumer-obligations.json');oldob=read(A.parent/'game-battle-pair-specials-v1/consumer-obligations.json');assert len(ob['groups'])==10
 for a,b in zip(ob['groups'],oldob['groups']):assert all(a[k]==b[k]for k in ['id','source','classes','required_behavior','complete'])and not a['complete']
 original_plan=read(P/'before/analysis/game-battle-transition-v1/implementation-plan.json');plan=read(A/'implementation-plan.json');assert plan['required_remaining'][:31]==original_plan['remaining_phase_requirements']and len(original_plan['remaining_phase_requirements'])==31
 assert plan['goal_status']=='active'and not plan['phase_complete']and not plan['full_goal_complete']
 for k in ['source','retained_source_check','retained_selected_helpers','retained_group_inventory']:same(cmap[k])
 for name in ['session-before.json','session-final.json']:
  status=envelope(P/name)['result'];assert not status['open']and not status['cleanup_pending']
 result=dict(schema='moli.special-pairs-source-stage215.v1',source=prior['source'],tool=spec['tool'],analysis_profile=prior['analysis_profile'],canonical_cache_layers=prior['canonical_cache_layers'],canonical_functions=742,new_canonical_functions=[],finite_Evidence=dict(reused_union=2646,current_retained_snapshot_records=355,new_distinct_records=0,cumulative_after=2646,verified_retained_snapshots=len(paths)),selected_retained_helpers=59,selected_original_ranges=ranges,selected_original_range_bytes=93763,retained_instruction_observations_checked=44,retained_instruction_original_bytes_checked=228,retained_data_original_bytes_checked=216,complete_selected_body_groups=18,additional_retained_model_cleanup_group=44,distinct_selected_body_groups=19,retained_analyst_seeded_main=dict(evidence=main['evidence'],pseudocode=main['pseudocode'],instructions_original_checked=14120,instruction_original_bytes=54685,canonical=False,not_new_function_or_Evidence=True),partial_435000=partial,historical_source_reverified=True,historical_view_receipt=info(P/'historical-source-receipt.json'),historical_outputs_unchanged=hist['historical_outputs_unchanged'],old_reference_files_unchanged=126,prior_model_identity_review=info(P/'prior-model-identity-review.json'),new_reference_generation=info(P/'reference-generation-receipt.json'),source_corrections=info(A/'source-corrections.json'),implementation_spec=info(A/'implementation-spec.json'),consumer_map=info(A/'consumer-map.json'),consumer_obligations=info(A/'consumer-obligations.json'),new_REA_analysis_queries=0,newly_enabled_pair_categories=[94,257,262],parser_changed=False,session_observed_closed=True,cleanup_pending=False,session_status_observations=[info(P/n)for n in ['session-before.json','session-final.json']],original_execution=0,VM_actions=0,official_sessions=0,source_investigation_complete=False,complete_common_family_closure=False,runtime_implementation_complete=False,phase_complete=False,full_goal_complete=False,goal_status='active')
 write(A/'source-check.json',result);print(json.dumps(dict(canonical=742,finite_Evidence=2646,new_distinct_records=0,retained_helpers=59,retained_ranges_bytes=93763,retained_body_groups=18,additional44=True,prior_models_unchanged=126,derived_instructions=14120,derived_original_bytes=54685,REA_observed_closed=True)),flush=True)
if __name__=='__main__':main()
