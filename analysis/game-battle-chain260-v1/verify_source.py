#!/usr/bin/env python3
"""Verify native byte authority,distinct numeric readers,retained scope and new finite port."""
from pathlib import Path
import hashlib,importlib.util,json,struct,sys
sys.dont_write_bytecode=True
A=Path(__file__).resolve().parent;R=A.parent.parent;P=R/'build/analysis/game-battle-chain260-v1';B=A.parent/'game-battle-special-context-v1'
def read(p):return json.loads(p.read_text())
def info(p):return dict(path=str(p.relative_to(R)),bytes=p.stat().st_size,sha256=hashlib.sha256(p.read_bytes()).hexdigest())
def same(r):assert info(R/r['path'])=={k:r[k]for k in ['path','bytes','sha256']},r['path']
def write(p,d):p.write_text(json.dumps(d,ensure_ascii=False,indent=2)+'\n')
def envelope(p):
 d=read(p);return d['structuredContent']if 'structuredContent'in d else json.loads(next(c['text']for c in d['content']if c['type']=='text'))if 'content'in d else d
def main():
 prior=read(B/'source-check.json');spec=read(A/'implementation-spec.json');cmap=read(A/'consumer-map.json');same(prior['source']);assert spec['source']==prior['source'];hist=read(P/'historical-source-receipt.json');assert hist['exit_code']==0 and hist['verified_pre_edit_files']==3492
 for r in hist['historical_outputs_unchanged']:same(r)
 canonical={}
 for r in prior['canonical_cache_layers']:
  same(r);part=read(R/r['path']);assert not set(canonical)&set(part);canonical.update(part)
 assert len(canonical)==742
 data=(R/prior['source']['path']).read_bytes();pe=struct.unpack_from('<I',data,60)[0];base=struct.unpack_from('<I',data,pe+52)[0];opt=struct.unpack_from('<H',data,pe+20)[0];sections=[]
 for i in range(struct.unpack_from('<H',data,pe+6)[0]):
  vs,va,size,off=struct.unpack_from('<4I',data,pe+24+opt+40*i+8);sections.append((base+va,size,off,vs))
 def original(address,n):
  address=int(address,16)if isinstance(address,str)else address
  for start,size,off,_ in sections:
   if start<=address and address+n<=start+size:return off+address-start,data[off+address-start:off+address-start+n]
  raise AssertionError('not wholly original file-backed')
 selected=read(P/'selected-retained-functions.json');oldselected=read(R/'build/analysis/game-battle-special-context-v1/selected-retained-functions.json');assert len(selected)==63 and len(oldselected)==62 and set(selected)-set(oldselected)=={'0x436bb0'};ranges=[]
 for a,d in selected.items():
  assert d==canonical[a];body=d['procedure']['body'];assert body['available']and body['contains_entry']and not body['non_contiguous']and len(body['ranges'])==1;n=body['total_bytes'];offset,b=original(a,n);assert int(body['ranges'][0]['end'],16)+1==int(a,16)+n
  if a in oldselected:assert d==oldselected[a]
  ranges.append(dict(address=a,bytes=n,file_offset=offset,sha256=hashlib.sha256(b).hexdigest(),retained_analyze_function_id=d['id'],new_Evidence=False))
 assert sum(r['bytes']for r in ranges)==96241
 old_groups=read(R/'build/analysis/game-battle-pair-specials-v1/selected-case-groups.json');assert len(old_groups)==18;body=canonical['0x40a120']['pseudocode'].encode();groups=[]
 for g in old_groups:
  span=g['complete_group']['UTF8_byte_range'];b=body[span['start']:span['end_exclusive']];assert hashlib.sha256(b).hexdigest()==g['complete_group']['sha256'];groups.append(dict(state=g['state'],id=g['id'],sha256=hashlib.sha256(b).hexdigest()))
 assert {201,202,203,204}<=set(g['state']for g in groups)
 for r in prior['retained_analyst_seeded_main'].values():
  if isinstance(r,dict)and 'path'in r:same(r)
 partial=prior['partial_435000'];same(partial['disassembly']);assert(partial['canonical_body_bytes'],partial['source_llvm_bytes'],partial['provider_body_repaired'])==(28,461,False)
 observations=[envelope(R/r['path'])for r in cmap['new_native_observations']];assert len(observations)==8
 for r in cmap['new_native_observations']:same(r)
 ins=[];missing=[];reader=None
 for d in observations:
  assert d['subject']['digest']['sha256']==prior['source']['sha256']and d['analysis_profile']['digest']==prior['analysis_profile'];v=d['normalized_result']
  if d['operation']=='inspect_native_instruction':
   if v['status']=='decoded':
    offset,b=original(v['address'],v['length']);assert b.hex()==v['bytes'];ins.append(dict(address=v['address'],bytes=len(b),file_offset=offset,sha256=hashlib.sha256(b).hexdigest(),evidence_id=d['evidence_id']))
   else:assert v['status']=='not-instruction-boundary'and v['bytes']is None;missing.append(dict(address=v['address'],status=v['status'],evidence_id=d['evidence_id'],not_used_as_code_proof=True))
  else:
   assert d['operation']=='read_bytes'and v['address']=='0x436bb0'and v['complete']and v['returned_bytes']==100;offset,b=original(v['address'],100);assert b.hex()==v['bytes_hex'];reader=dict(address=v['address'],bytes=100,file_offset=offset,sha256=hashlib.sha256(b).hexdigest(),evidence_id=d['evidence_id'])
 assert len(ins)==4 and sum(r['bytes']for r in ins)==17 and len(missing)==3 and reader
 s=importlib.util.spec_from_file_location('ids',A.parent/'game-battle-physical-consumers-v1/verify_source.py');ids=importlib.util.module_from_spec(s);s.loader.exec_module(ids)
 before=ids.evidence_ids(R/'build/analysis/game-battle-special-context-v1/rea.snapshot.json');current=ids.evidence_ids(P/'rea.snapshot.json');new=current-before;assert len(before)==363 and len(current)==369 and len(new)==6 and new<={d['evidence_id']for d in observations};assert len({d['evidence_id']for d in observations}&before)==2
 closed=envelope(P/'close-result.json')['result'];assert(closed['evidence_records'],closed['primitive_entries'],closed['workflow_entries'])==(369,32,1)
 for n in ['session-before.json','session-final.json']:
  d=envelope(P/n)['result'];assert not d['open']and not d['cleanup_pending']
 params=read(A/'source-parameters.json');assert params['actual202']['rememberedY']=='tuple.flags'and params['actual202']['amount_not_coordinate']and params['actual204']['secondary_HP_only_without_mask']==0xe000 and params['primary14']['facing']==0 and params['actual204']['secondary_caster_level9_facing']==1
 proof=canonical['0x436bb0']['pseudocode'];assert 'if (iVar4 == 0)'in proof and 'return iVar3;'in proof
 front=(R/'shared/legacy-game-battle-motion.mjs').read_text();oldfront=(P/'before/shared/legacy-game-battle-motion.mjs').read_text();assert front[front.index('      const pairs='):front.index('      const generic=')]==oldfront[oldfront.index('      const pairs='):oldfront.index('      const generic=')]
 for n in ['shared/legacy-game-battle-frame.mjs','shared/legacy-game-animation.mjs']:assert(R/n).read_bytes()==(P/'before'/n).read_bytes()
 baseline=read(P/'preflight.json')['candidate_backups'];models=[r for r in baseline if r['path'].endswith('/generate_vectors.py')or r['path'].endswith('/original-vectors.json')];assert len(models)==130
 for r in models:same(r)
 write(P/'prior-model-identity-review.json',dict(changed=[],unchanged=models,all_prior_generators_and_goldens_preserved=True))
 generation=read(P/'reference-generation-receipt.json');assert generation['observed_exit_code']==0 and generation['inputs_unchanged_after_observation']and generation['initial_wrapper_exit_code']==1 and generation['started_utc']is None
 for k in ['output','log']:same(generation[k])
 for r in generation['actual_generator_inputs']:same(r)
 assert(generation['queues'],generation['scenarios'],generation['states'],generation['RGBA'],generation['settled'],generation['local244'])==(4640,191,66189,21374,167,2);assert len(generation['waiting'])==18 and len(generation['consumer_boundaries'])==len(generation['rendering_boundaries'])==2
 ob=read(A/'consumer-obligations.json');oldob=read(B/'consumer-obligations.json');assert len(ob['groups'])==10
 for x,y in zip(ob['groups'],oldob['groups']):assert all(x[k]==y[k]for k in ['id','source','classes','required_behavior','complete'])and not x['complete']
 plan=read(A/'implementation-plan.json');parent=read(P/'before'/plan['parent_battle_phase']);assert plan['required_remaining'][:33]==parent['remaining_phase_requirements']and len(parent['remaining_phase_requirements'])==33 and not plan['full_goal_complete']and plan['goal_status']=='active'
 out=dict(schema='moli.chain260-source-stage217.v1',source=prior['source'],tool=prior['tool'],analysis_profile=prior['analysis_profile'],canonical_cache_layers=prior['canonical_cache_layers'],canonical_functions=742,new_canonical_functions=[],finite_Evidence=dict(prior_union=2654,current_retained_snapshot_records=369,new_distinct_records=6,new_ids=sorted(new),reused_query_records=2,cumulative_after=2660),selected_retained_helpers=63,selected_original_ranges=ranges,selected_original_range_bytes=96241,current_instruction_original_checks=ins,current_instruction_original_bytes=17,new_distinct_decoded_instruction_bytes=5,unavailable_instruction_observations=missing,complete_reader_original_check=reader,complete_selected_body_groups=18,selected_body_group_checks=groups,distinct_selected_body_groups=19,additional_retained_model_cleanup_group=44,retained_analyst_seeded_main=prior['retained_analyst_seeded_main'],partial_435000=partial,source_parameters=info(A/'source-parameters.json'),historical_source_reverified=True,historical_view_receipt=info(P/'historical-source-receipt.json'),historical_outputs_unchanged=hist['historical_outputs_unchanged'],old_reference_files_unchanged=130,prior_model_identity_review=info(P/'prior-model-identity-review.json'),new_reference_generation=info(P/'reference-generation-receipt.json'),source_corrections=info(A/'source-corrections.json'),implementation_spec=info(A/'implementation-spec.json'),consumer_map=info(A/'consumer-map.json'),consumer_obligations=info(A/'consumer-obligations.json'),new_REA_analysis_queries=8,newly_enabled_pair_categories=[260],front_field_order_changed=False,private_raw_numeric_tail_added=True,wire_normalization_observed=False,renderer_gate_changed=False,session_observed_closed=True,cleanup_pending=False,session_status_observations=[info(P/n)for n in ['session-before.json','session-final.json']],original_execution=0,VM_actions=0,official_sessions=0,source_investigation_complete=False,complete_common_family_closure=False,runtime_implementation_complete=False,phase_complete=False,full_goal_complete=False,goal_status='active')
 write(A/'source-check.json',out);print(json.dumps(dict(canonical=742,finite_Evidence=2660,new_distinct_records=6,reused_queries=2,retained_helpers=63,retained_ranges_bytes=96241,instruction_bytes=17,complete_reader_bytes=100,prior_models_unchanged=130,REA_observed_closed=True)),flush=True)
if __name__=='__main__':main()
