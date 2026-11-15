#!/usr/bin/env python3
"""Verify fixed native bytes,retained authority,extended105 window and original scope."""
from pathlib import Path
import ast,hashlib,importlib.util,json,re,struct,sys
sys.dont_write_bytecode=True
A=Path(__file__).resolve().parent;R=A.parent.parent;P=R/'build/analysis/game-battle-special-context-v1';Q=R/'build/analysis/game-battle-pair-specials-v1'
def read(p):return json.loads(p.read_text())
def info(p):return dict(path=str(p.relative_to(R)),bytes=p.stat().st_size,sha256=hashlib.sha256(p.read_bytes()).hexdigest())
def same(row):assert info(R/row['path'])=={k:row[k]for k in ['path','bytes','sha256']},row['path']
def write(p,d):p.write_text(json.dumps(d,ensure_ascii=False,indent=2)+'\n')
def envelope(p):
 d=read(p);return d['structuredContent']if 'structuredContent'in d else json.loads(next(c['text']for c in d['content']if c['type']=='text'))if 'content'in d else d

def main():
 prior=read(A.parent/'game-battle-special-pairs-v1/source-check.json');spec=read(A/'implementation-spec.json');cmap=read(A/'consumer-map.json');same(prior['source']);assert spec['source']==prior['source'];hist=read(P/'historical-source-receipt.json');assert hist['exit_code']==0 and hist['verified_pre_edit_files']==3463
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
 selected=read(P/'selected-retained-functions.json');assert len(selected)==62;ranges=[];oldselected=read(Q/'selected-retained-functions.json')
 for address,d in selected.items():
  assert d==allf[address];body=d['procedure']['body'];assert body['available']and body['contains_entry']and not body['non_contiguous']and len(body['ranges'])==1
  n=body['total_bytes'];at,b=original(address,n);assert int(body['ranges'][0]['end'],16)+1==int(address,16)+n
  if address in oldselected:
   assert(Q/(address[2:]+'-retained-pseudocode.txt')).read_text()==d['pseudocode'];assert(Q/(address[2:]+'-retained-assembly.txt')).read_text()=='\n'.join(d['assembly'])+'\n'
  else:assert read(P/(address[2:]+'-retained.json'))==d
  ranges.append(dict(address=address,bytes=n,file_offset=at,sha256=hashlib.sha256(b).hexdigest(),retained_analyze_function_id=d['id'],new_Evidence=False))
 assert sum(r['bytes']for r in ranges)==96141 and len(oldselected)==59 and sum(r['bytes']for r in ranges if r['address']in oldselected)==93763
 for row in read(A.parent/'game-battle-pair-specials-v1/source-check.json')['new_instruction_original_checks']:
  d=envelope(R/row['artifact']['path']);same(row['artifact']);v=d['normalized_result'];_,b=original(v['address'],v['length']);assert b==bytes.fromhex(v['bytes'])
 main=cmap['derived_main'];assert not main['canonical']and not main['procedure_existed_before_seed'];same(main['evidence']);same(main['pseudocode']);derived=read(R/main['evidence']['path']);entry=next(r for r in derived['entries']if r['requestedEntry']=='004260b0');assert not entry['functionExistedBeforeSeed']and not derived['originalExecution']and not derived['originalBytePatches'];total=0
 for row in entry['instructions']:
  b=bytes.fromhex(row['bytesHex']);_,actual=original(row['address'],len(b));assert actual==b;total+=len(b)
 assert len(entry['instructions'])==14120 and total==54685
 groups=read(Q/'selected-case-groups.json');assert len(groups)==18;inventory=read(R/'build/analysis/game-battle-physical-consumers-v1/consumer-inventory.json')['body_case_index']['complete_adjacent_alias_groups'];body=(Q/'40a120-retained-pseudocode.txt').read_bytes()
 for g in groups+[cmap['additional_retained_model_cleanup_group']]:
  known=next(k for k in inventory if k['id']==g['id']);assert all(g[k]==known[k]for k in ['id','values','adjacent_alias_values','complete_group']);span=g['complete_group']['UTF8_byte_range'];b=body[span['start']:span['end_exclusive']];assert hashlib.sha256(b).hexdigest()==g['complete_group']['sha256']and(R/known['private_text']['path']).read_bytes()==b
 partial=prior['partial_435000'];same(partial['disassembly']);assert(partial['canonical_body_bytes'],partial['source_llvm_bytes'],partial['provider_body_repaired'])==(28,461,False)
 observations=[]
 for name in ['xrefs-533968.json','xrefs-53397c.json','table-533940-512.json','typed-table-533968.json','typed-cursor-58fac0.json','type-533968.json','instruction-4fd848.json','instruction-4fd85f.json']:
  d=envelope(P/name);assert d['subject']['digest']['sha256']==prior['source']['sha256']and d['analysis_profile']['digest']==prior['analysis_profile'];observations.append(d)
 data=next(d for d in observations if d['operation']=='read_bytes');v=data['normalized_result'];assert v['complete']and v['address']=='0x533940'and v['returned_bytes']==512;offset,b=original('0x533940',512);assert b.hex()==v['bytes_hex'];signed=[n-256 if n>=128 else n for n in b[40:]];assert len(signed)==472
 params=read(A/'source-parameters.json');assert params['source_bytes_signed']==signed and params['window_bytes']==472;same(params['source']);same(params['memory_observation'])
 code=(R/'shared/legacy-game-battle-sequence-playback.mjs').read_text();m=re.search(r'sequenceBytes=Object.freeze\(\[([\d,\s-]+)\]\)',code);assert m and[int(n)for n in m.group(1).split(',')if n.strip()]==signed
 module=ast.parse((A/'generate_vectors.py').read_text());assign=next(n for n in module.body if isinstance(n,ast.Assign)and any(isinstance(t,ast.Name)and t.id=='SEQUENCE_BYTES'for t in n.targets));assert ast.literal_eval(assign.value)==signed
 prefixes=[]
 for level in range(10):
  start=level*20;negative=next(i for i,n in enumerate(signed[start:])if n<0);prefixes.append(dict(level=level,first_negative_index=negative,first_negative_address=hex(0x533968+start+negative),negative_value=signed[start+negative],actions=signed[start:start+negative]))
 assert[r['first_negative_index']for r in prefixes]==[9,10,163,143,123,103,83,63,43,23]
 cursor=next(d['normalized_result']for d in observations if d['parameters'].get('address')=='0x58fac0');refs=cursor['incoming_references'];assert[r['source_address']for r in refs if r['write']]==['0x40fba7','0x40fcba']and sum(r['read']for r in refs)==3
 segment=next(s for s in sections if s[0]<=0x58fac0<s[0]+max(s[1],s[3]));assert 0x58fac0>=segment[0]+segment[1]
 typeobs=next(d for d in observations if d['operation']=='inspect_native_data_type');assert typeobs['normalized_result']['status']=='unavailable'
 instructions=[d for d in observations if d['operation']=='inspect_native_instruction'and d['normalized_result']['status']=='decoded'];assert len(instructions)==2;instruction_rows=[]
 for d in instructions:
  v=d['normalized_result'];at,b=original(v['address'],v['length']);assert b==bytes.fromhex(v['bytes'])and v['procedure']=='0x4fd5f0';instruction_rows.append(dict(address=v['address'],bytes=v['length'],file_offset=at,sha256=hashlib.sha256(b).hexdigest(),evidence_id=d['evidence_id']))
 assert sum(r['bytes']for r in instruction_rows)==11
 ids_spec=importlib.util.spec_from_file_location('source_ids',A.parent/'game-battle-physical-consumers-v1/verify_source.py');ids=importlib.util.module_from_spec(ids_spec);ids_spec.loader.exec_module(ids);proof=read(R/'build/analysis/game-battle-physical-family-v1/prior-record-check.json');paths=[R/r['path']for r in proof['verified_prior_snapshot_files']]+[R/r['path']for r in proof['prior_small_snapshots_verified']]+[R/('build/analysis/'+n+'/rea.snapshot.json')for n in ['game-battle-physical-family-v1','game-battle-physical-consumers-v1','game-battle-physical-specials-v1','game-battle-physical-guard-v1','game-battle-physical-results-v1','game-battle-projectile-results-v1','game-battle-self-physical-v1','game-battle-nested-physical-v1','game-battle-special96-v1']]+[Q/'rea-final.snapshot.json'];before=set()
 for p in paths:before.update(ids.evidence_ids(p))
 current=ids.evidence_ids(P/'rea.snapshot.json');new=current-before;assert len(before)==2646 and len(current)==363 and len(new)==8 and new=={d['evidence_id']for d in observations}
 closed=envelope(P/'close-result.json')['result'];assert(closed['evidence_records'],closed['primitive_entries'],closed['workflow_entries'])==(363,32,1)
 for name in ['session-before.json','session-final.json']:
  status=envelope(P/name)['result'];assert not status['open']and not status['cleanup_pending']
 baseline=read(P/'preflight.json')['candidate_backups'];models=[r for r in baseline if r['path'].endswith('/generate_vectors.py')or r['path'].endswith('/original-vectors.json')];assert len(models)==128
 for row in models:same(row)
 write(P/'prior-model-identity-review.json',dict(changed=[],unchanged=models,all_prior_generators_and_goldens_preserved=True))
 for name in ['shared/legacy-game-battle-motion.mjs','shared/legacy-game-battle-frame.mjs','shared/legacy-game-animation.mjs']:
  row=next(r for r in baseline if r['path']==name);same(row)
 generation=read(P/'reference-generation-receipt.json');assert generation['observed_exit_code']==0 and generation['inputs_unchanged_after_observation'];same(generation['output']);same(generation['log']);assert(generation['queues'],generation['scenarios'],generation['states'],generation['RGBA'],generation['settled'],generation['local244'])==(4640,158,63158,42058,141,3);assert len(generation['waiting'])==12 and len(generation['rendering_boundaries'])==2
 ob=read(A/'consumer-obligations.json');oldob=read(A.parent/'game-battle-special-pairs-v1/consumer-obligations.json');assert len(ob['groups'])==10
 for a,b in zip(ob['groups'],oldob['groups']):assert all(a[k]==b[k]for k in ['id','source','classes','required_behavior','complete'])and not a['complete']
 original_plan=read(P/'before/analysis/game-battle-transition-v1/implementation-plan.json');plan=read(A/'implementation-plan.json');assert plan['required_remaining'][:32]==original_plan['remaining_phase_requirements']and len(original_plan['remaining_phase_requirements'])==32 and plan['goal_status']=='active'and not plan['phase_complete']and not plan['full_goal_complete']
 result=dict(schema='moli.special-context-source-stage216.v1',source=prior['source'],tool=spec['tool'],analysis_profile=prior['analysis_profile'],canonical_cache_layers=prior['canonical_cache_layers'],canonical_functions=742,new_canonical_functions=[],finite_Evidence=dict(prior_union=2646,current_retained_snapshot_records=363,new_distinct_records=8,new_ids=sorted(new),cumulative_after=2654,verified_retained_snapshots=len(paths)+1),selected_retained_helpers=62,selected_original_ranges=ranges,selected_original_range_bytes=96141,retained_instruction_observations_checked=44,retained_instruction_original_bytes_checked=228,new_instruction_original_checks=instruction_rows,new_instruction_original_bytes=11,new_original_data_bytes=512,original_memory_observation=dict(address='0x533940',bytes=512,file_offset=offset,sha256=hashlib.sha256(bytes.fromhex(data['normalized_result']['bytes_hex'])).hexdigest(),artifact=info(P/'table-533940-512.json')),sequence_parameters=info(A/'source-parameters.json'),observed_sequence_window_bytes=472,sequential_prefixes=prefixes,shared_cursor_typed_writes=['0x40fba7','0x40fcba'],original_global_process_lifecycle_observed=False,declared_source_table_type_observed=False,complete_selected_body_groups=18,additional_retained_model_cleanup_group=44,distinct_selected_body_groups=19,retained_analyst_seeded_main=dict(evidence=main['evidence'],pseudocode=main['pseudocode'],instructions_original_checked=14120,instruction_original_bytes=54685,canonical=False,not_new_function_or_Evidence=True),partial_435000=partial,historical_source_reverified=True,historical_view_receipt=info(P/'historical-source-receipt.json'),historical_outputs_unchanged=hist['historical_outputs_unchanged'],old_reference_files_unchanged=128,prior_model_identity_review=info(P/'prior-model-identity-review.json'),new_reference_generation=info(P/'reference-generation-receipt.json'),source_corrections=info(A/'source-corrections.json'),implementation_spec=info(A/'implementation-spec.json'),consumer_map=info(A/'consumer-map.json'),consumer_obligations=info(A/'consumer-obligations.json'),new_REA_analysis_queries=8,newly_enabled_pair_categories=[105],parser_changed=False,renderer_gate_changed=False,session_observed_closed=True,cleanup_pending=False,session_status_observations=[info(P/n)for n in ['session-before.json','session-final.json']],original_execution=0,VM_actions=0,official_sessions=0,source_investigation_complete=False,complete_common_family_closure=False,runtime_implementation_complete=False,phase_complete=False,full_goal_complete=False,goal_status='active')
 write(A/'source-check.json',result);print(json.dumps(dict(canonical=742,finite_Evidence=2654,new_distinct_records=8,retained_helpers=62,retained_ranges_bytes=96141,new_instruction_bytes=11,new_original_data_bytes=512,sequence_window_bytes=472,prior_models_unchanged=128,REA_observed_closed=True)),flush=True)
if __name__=='__main__':main()
