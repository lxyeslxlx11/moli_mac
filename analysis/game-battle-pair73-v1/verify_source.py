#!/usr/bin/env python3
"""Reverify exact original authority,73 dispatch ownership and independent finite scope."""
from pathlib import Path
import hashlib,importlib.util,json,struct,sys
sys.dont_write_bytecode=True
A=Path(__file__).resolve().parent;R=A.parent.parent;P=R/'build/analysis/game-battle-pair73-v1';B=A.parent/'game-battle-chain260-v1'
def read(p):return json.loads(p.read_text())
def info(p):return dict(path=str(p.relative_to(R)),bytes=p.stat().st_size,sha256=hashlib.sha256(p.read_bytes()).hexdigest())
def same(r):assert info(R/r['path'])=={k:r[k]for k in ['path','bytes','sha256']},r['path']
def write(p,d):p.write_text(json.dumps(d,ensure_ascii=False,indent=2)+'\n')
def envelope(p):
 d=read(p);return d['structuredContent']if 'structuredContent'in d else json.loads(next(c['text']for c in d['content']if c['type']=='text'))if 'content'in d else d
def main():
 prior=read(B/'source-check.json');spec=read(A/'implementation-spec.json');cmap=read(A/'consumer-map.json');same(prior['source']);assert spec['source']==prior['source'];hist=read(P/'historical-source-receipt.json');assert hist['exit_code']==0 and hist['verified_pre_edit_files']==3522
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
 selected=read(P/'selected-retained-functions.json');oldselected=read(R/'build/analysis/game-battle-chain260-v1/selected-retained-functions.json');assert len(selected)==64 and len(oldselected)==63 and set(selected)-set(oldselected)=={'0x4236d0'};ranges=[]
 for a,d in selected.items():
  assert d==canonical[a];body=d['procedure']['body'];assert body['available']and body['contains_entry']and not body['non_contiguous']and len(body['ranges'])==1;n=body['total_bytes'];offset,b=original(a,n);assert int(body['ranges'][0]['end'],16)+1==int(a,16)+n
  if a in oldselected:assert d==oldselected[a]
  ranges.append(dict(address=a,bytes=n,file_offset=offset,sha256=hashlib.sha256(b).hexdigest(),retained_analyze_function_id=d['id'],new_Evidence=False))
 assert sum(r['bytes']for r in ranges)==98490
 old_groups=read(R/'build/analysis/game-battle-pair-specials-v1/selected-case-groups.json');assert len(old_groups)==18;body=canonical['0x40a120']['pseudocode'].encode();groups=[]
 for g in old_groups:
  span=g['complete_group']['UTF8_byte_range'];b=body[span['start']:span['end_exclusive']];assert hashlib.sha256(b).hexdigest()==g['complete_group']['sha256'];groups.append(dict(state=g['state'],id=g['id'],sha256=hashlib.sha256(b).hexdigest()))
 for r in prior['retained_analyst_seeded_main'].values():
  if isinstance(r,dict)and 'path'in r:same(r)
 mainbody=(R/cmap['derived_main']['pseudocode']['path']).read_bytes();same(cmap['derived_main']['pseudocode']);spans=[]
 for s in cmap['stage218_derived_main_spans']:
  same(s['private_artifact']);p=s['UTF8_byte_range'];b=mainbody[p['start']:p['end_exclusive']];assert hashlib.sha256(b).hexdigest()==s['sha256'];assert b==(R/s['private_artifact']['path']).read_bytes();spans.append(dict(name=s['name'],bytes=len(b),sha256=s['sha256']))
 assert len(spans)==4
 phase0=(P/'class73-phase0.txt').read_text();phase1=(P/'class73-phase1.txt').read_text();assert all(x in phase0 for x in ['case 0x49:','FUN_00424310','DAT_00599ba4','FUN_00434a70','FUN_004236d0','piVar3[0x16] = piVar3[0x16] + 1']);assert 'case 0x52:'not in phase0;assert all(x in phase1 for x in ['FUN_00434b90(param_1,0)','DAT_00599ba4','bVar2 & 2','LAB_004293ee','LAB_004293f7'])
 partial=prior['partial_435000'];same(partial['disassembly']);assert(partial['canonical_body_bytes'],partial['source_llvm_bytes'],partial['provider_body_repaired'])==(28,461,False)
 observations=[envelope(R/r['path'])for r in cmap['new_native_observations']];assert len(observations)==11
 for r in cmap['new_native_observations']:same(r)
 checks=[];by_name={};code=set();tables=set();instruction_bytes=0;raw_code_bytes=0;raw_table_bytes=0
 data_addresses={0x4338f1,0x433894,0x433765,0x433714}
 for r,d in zip(cmap['new_native_observations'],observations):
  assert d['subject']['digest']['sha256']==prior['source']['sha256']and d['analysis_profile']['digest']==prior['analysis_profile'];v=d['normalized_result'];address=int(v['address'],16)
  if d['operation']=='inspect_native_instruction':
   assert v['status']=='decoded';n=v['length'];expected=v['bytes'];instruction_bytes+=n;kind='decoded-instruction'
  else:
   assert d['operation']=='read_bytes'and v['complete'];n=v['returned_bytes'];expected=v['bytes_hex'];kind='table-data'if address in data_addresses else'raw-code-read'
   if kind=='table-data':raw_table_bytes+=n
   else:raw_code_bytes+=n
  offset,b=original(address,n);assert b.hex()==expected;target=tables if address in data_addresses else code;target.update(range(address,address+n));by_name[Path(r['path']).name]=b
  checks.append(dict(path=r['path'],address=v['address'],bytes=n,file_offset=offset,sha256=hashlib.sha256(b).hexdigest(),evidence_id=d['evidence_id'],kind=kind,complete_instruction_range=Path(r['path']).name!='dispatch-range-1.json'if kind!='table-data'else None))
 assert (instruction_bytes,raw_code_bytes,raw_table_bytes,len(code),len(tables))==(14,177,10,131,10)
 assert by_name['class73-selector.json']==b'\x07'and struct.unpack('<I',by_name['table-0.json'])[0]==0x4294ac;assert by_name['table-1.json']==b'\x06'and struct.unpack('<I',by_name['completion-pointer.json'])[0]==0x42912e
 b=by_name['dispatch-range-0.json'];assert b[13:15]==b'\x0f\x84'and 0x4294ac+19+struct.unpack_from('<i',b,15)[0]==0x429859
 b=by_name['probe-0.json'];assert b[0]==0xe8 and 0x429882+struct.unpack_from('<i',b,1)[0]==0x424310;assert b[18]==0xe8 and 0x429894+struct.unpack_from('<i',b,19)[0]==0x434a70
 assert len(by_name['completion-complete.json'])==61 and by_name['completion-complete.json'][:55]==by_name['dispatch-range-1.json'];assert by_name['completion-complete.json'][-5:]==bytes.fromhex('e982020000')
 s=importlib.util.spec_from_file_location('ids',A.parent/'game-battle-physical-consumers-v1/verify_source.py');ids=importlib.util.module_from_spec(s);s.loader.exec_module(ids)
 before=ids.evidence_ids(R/'build/analysis/game-battle-chain260-v1/rea.snapshot.json');current=ids.evidence_ids(P/'rea.snapshot.json');new=current-before;assert len(before)==369 and len(current)==380 and len(new)==11 and new=={d['evidence_id']for d in observations}
 known=set()
 def walk(x):
  if isinstance(x,dict):
   for y in x.values():walk(y)
  elif isinstance(x,list):
   for y in x:walk(y)
  elif isinstance(x,str)and x.startswith('ev_'):known.add(x)
 for p in (R/'analysis').glob('*/source-check.json'):
  if p.parent!=A:walk(read(p))
 assert not new&known
 closed=envelope(P/'close-result.json')['result'];assert(closed['evidence_records'],closed['primitive_entries'],closed['workflow_entries'])==(380,32,1)
 for n in ['session-before.json','session-final.json']:
  d=envelope(P/n)['result'];assert not d['open']and not d['cleanup_pending']
 params=read(A/'source-parameters.json');assert params['pair_prefix']==[38,53]and not params['generic147']and params['suffix']['principal_less_than20_only']and params['phase1_dispatch']['alive_mask']==2
 proof=canonical['0x436bb0']['pseudocode'];assert 'if (iVar4 == 0)'in proof and 'return iVar3;'in proof
 front=(R/'shared/legacy-game-battle-motion.mjs').read_text();oldfront=(P/'before/shared/legacy-game-battle-motion.mjs').read_text();assert front[front.index('      const pairs='):front.index('      const generic=')]==oldfront[oldfront.index('      const pairs='):oldfront.index('      const generic=')]
 for n in ['shared/legacy-game-battle-frame.mjs','shared/legacy-game-animation.mjs','shared/legacy-game-battle-commands.mjs']:assert(R/n).read_bytes()==(P/'before'/n).read_bytes()
 baseline=read(P/'preflight.json')['candidate_backups'];models=[r for r in baseline if r['path'].endswith('/generate_vectors.py')or r['path'].endswith('/original-vectors.json')];assert len(models)==132
 for r in models:same(r)
 write(P/'prior-model-identity-review.json',dict(changed=[],unchanged=models,all_prior_generators_and_goldens_preserved=True))
 generation=read(P/'reference-generation-receipt.json');assert generation['observed_exit_code']==0 and generation['natural_termination_observed']and generation['inputs_unchanged_after_observation']and generation['started_utc']
 for k in ['output','log']:same(generation[k])
 for r in generation['actual_generator_inputs']:same(r)
 assert(generation['queues'],generation['scenarios'],generation['states'],generation['RGBA'],generation['settled'],generation['local244'])==(4640,136,50158,10580,118,2);assert len(generation['waiting'])==16 and not generation['rendering_boundaries']
 ob=read(A/'consumer-obligations.json');oldob=read(B/'consumer-obligations.json');assert len(ob['groups'])==10
 for x,y in zip(ob['groups'],oldob['groups']):assert all(x[k]==y[k]for k in ['id','source','classes','required_behavior','complete'])and not x['complete']
 plan=read(A/'implementation-plan.json');parent=read(P/'before'/plan['parent_battle_phase']);assert plan['required_remaining'][:34]==parent['remaining_phase_requirements']and len(parent['remaining_phase_requirements'])==34 and len(plan['required_remaining'])in[34,35]and not plan['full_goal_complete']and plan['goal_status']=='active'
 out=dict(schema='moli.pair73-source-stage218.v1',source=prior['source'],tool=prior['tool'],analysis_profile=prior['analysis_profile'],canonical_cache_layers=prior['canonical_cache_layers'],canonical_functions=742,new_canonical_functions=[],finite_Evidence=dict(prior_union=2660,current_retained_snapshot_records=380,new_distinct_records=11,new_ids=sorted(new),new_ids_absent_all_prior_sourcechecks=True,cumulative_after=2671),selected_retained_helpers=64,selected_original_ranges=ranges,selected_original_range_bytes=98490,current_original_checks=checks,current_decoded_instruction_bytes=14,current_raw_code_read_bytes=177,current_table_read_bytes=10,current_unique_code_bytes=131,current_unique_data_bytes=10,current_unique_original_bytes=141,partial_instruction_end_not_used_as_complete_proof='dispatch-range-1.json',complete_selected_body_groups=18,selected_body_group_checks=groups,distinct_selected_body_groups=19,additional_retained_model_cleanup_group=44,new_derived_main_spans=spans,retained_analyst_seeded_main=prior['retained_analyst_seeded_main'],partial_435000=partial,source_parameters=info(A/'source-parameters.json'),historical_source_reverified=True,historical_view_receipt=info(P/'historical-source-receipt.json'),historical_outputs_unchanged=hist['historical_outputs_unchanged'],old_reference_files_unchanged=132,prior_model_identity_review=info(P/'prior-model-identity-review.json'),new_reference_generation=info(P/'reference-generation-receipt.json'),source_corrections=info(A/'source-corrections.json'),implementation_spec=info(A/'implementation-spec.json'),consumer_map=info(A/'consumer-map.json'),consumer_obligations=info(A/'consumer-obligations.json'),new_REA_analysis_queries=11,newly_enabled_pair_categories=[73],front_field_order_changed=False,private_raw_numeric_tail_extended_to73=True,wire_normalization_observed=False,renderer_gate_changed=False,session_observed_closed=True,cleanup_pending=False,session_status_observations=[info(P/n)for n in ['session-before.json','session-final.json']],original_execution=0,VM_actions=0,official_sessions=0,source_investigation_complete=False,complete_common_family_closure=False,runtime_implementation_complete=False,phase_complete=False,full_goal_complete=False,goal_status='active')
 write(A/'source-check.json',out);print(json.dumps(dict(canonical=742,finite_Evidence=2671,new_distinct_records=11,retained_helpers=64,retained_ranges_bytes=98490,current_unique_original_bytes=141,prior_models_unchanged=132,REA_observed_closed=True)),flush=True)
if __name__=='__main__':main()
