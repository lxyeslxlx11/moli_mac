#!/usr/bin/env python3
"""Original-byte authority, closed REA lifecycle, pointer contracts, and explicit model correction audit."""
from pathlib import Path
import hashlib,importlib.util,json,struct,sys
sys.dont_write_bytecode=True
A=Path(__file__).resolve().parent;R=A.parent.parent;P=R/'build/analysis/game-battle-attached-rid-v1';B=A.parent/'game-battle-pair73-v1'
def read(p):return json.loads(p.read_text())
def info(p):return dict(path=str(p.relative_to(R)),bytes=p.stat().st_size,sha256=hashlib.sha256(p.read_bytes()).hexdigest())
def same(r):assert info(R/r['path'])=={k:r[k]for k in['path','bytes','sha256']},r['path']
def write(p,d):p.write_text(json.dumps(d,ensure_ascii=False,indent=2)+'\n')
def envelope(p):
 d=read(p);return d.get('structuredContent',d)
def main():
 old=read(B/'source-check.json');same(old['source']);hist=read(P/'historical-source-receipt.json');assert hist['exit_code']==0 and hist['verified_pre_edit_files']==3550
 for r in hist['historical_outputs_unchanged']:same(r)
 canonical={};layers=old['canonical_cache_layers']+[info(P/'functions-added.json')]
 for r in layers:
  same(r);part=read(R/r['path']);assert not set(part)&set(canonical);canonical.update(part)
 assert len(canonical)==743 and set(read(P/'functions-added.json'))=={'0x422e20'}
 data=(R/old['source']['path']).read_bytes();pe=struct.unpack_from('<I',data,60)[0];base=struct.unpack_from('<I',data,pe+52)[0];opt=struct.unpack_from('<H',data,pe+20)[0];sections=[]
 for i in range(struct.unpack_from('<H',data,pe+6)[0]):
  vs,va,size,off=struct.unpack_from('<4I',data,pe+24+opt+40*i+8);sections.append((base+va,size,off))
 def original(a,n):
  a=int(a,16)if isinstance(a,str)else a
  for start,size,off in sections:
   if start<=a and a+n<=start+size:return off+a-start,data[off+a-start:off+a-start+n]
  raise AssertionError('not wholly file-backed')
 selected=read(P/'selected-retained-functions.json');assert len(selected)==77;ranges=[]
 for a,d in selected.items():
  assert d==canonical[a];body=d['procedure']['body'];n=body['total_bytes'];assert body['available']and body['contains_entry']and not body['non_contiguous']and len(body['ranges'])==1;offset,b=original(a,n);assert int(body['ranges'][0]['end'],16)+1==int(a,16)+n
  ranges.append(dict(address=a,bytes=n,file_offset=offset,sha256=hashlib.sha256(b).hexdigest(),retained_analyze_function_id=d['id']))
 assert sum(r['bytes']for r in ranges)==101674
 n=canonical['0x422e20']['procedure']['body']['total_bytes'];assert n==590;offset,b=original(0x422e20,n);new_range=dict(address='0x422e20',bytes=n,file_offset=offset,sha256=hashlib.sha256(b).hexdigest())
 names=['422e20-new-dossier.json','table221.json','write-first.json','write-second.json','attachment-Y.json','second-position.json','fall-equation.json','action10-previous-index.json','action10-previous-read.json','action10-global-owner.json','action10-complete-branch.json'];observations=[envelope(P/n)for n in names];checks=[];code=set();tables=set();decoded=raw=table=0
 for name,d in zip(names,observations):
  assert d['subject']['digest']['sha256']==old['source']['sha256']and d['analysis_profile']['digest']==old['analysis_profile']
  if d['operation']=='analyze_function':continue
  v=d['normalized_result'];a=int(v['address'],16)
  if d['operation']=='inspect_native_instruction':assert v['status']=='decoded';n=v['length'];expected=v['bytes'];decoded+=n
  else:assert d['operation']=='read_bytes'and v['complete'];n=v['returned_bytes'];expected=v['bytes_hex'];table+=n if name=='table221.json'else 0;raw+=n if name!='table221.json'else 0
  offset,b=original(a,n);assert b.hex()==expected;(tables if name=='table221.json'else code).update(range(a,a+n));checks.append(dict(**info(P/name),address=hex(a),original_bytes=n,file_offset=offset,evidence_id=d['evidence_id']))
 assert(decoded,raw,table,len(code),len(tables))==(41,144,4,161,4)
 s=importlib.util.spec_from_file_location('ids',A.parent/'game-battle-physical-consumers-v1/verify_source.py');ids=importlib.util.module_from_spec(s);s.loader.exec_module(ids);before=ids.evidence_ids(R/'build/analysis/game-battle-pair73-v1/rea.snapshot.json');current=ids.evidence_ids(P/'rea.snapshot.json');new=current-before;assert len(before)==380 and len(current)==391 and len(new)==11 and new=={d['evidence_id']for d in observations}
 known=set()
 def walk(x):
  if isinstance(x,dict):
   for y in x.values():walk(y)
  elif isinstance(x,list):
   for y in x:walk(y)
  elif isinstance(x,str)and x.startswith('ev_'):known.add(x)
 for p in(R/'analysis').glob('*/source-check.json'):
  if p.parent!=A:walk(read(p))
 assert not new&known;closed=envelope(P/'close-result.json')['result'];assert(closed['evidence_records'],closed['primitive_entries'],closed['workflow_entries'])==(391,33,1)
 for name in['session-before.json','session-final.json']:
  d=envelope(P/name)['result'];assert not d['open']and not d['cleanup_pending']
 text=canonical['0x40a120']['pseudocode'];cases=read(R/'build/analysis/game-battle-physical-family-v1/body-cases-private.json');groups=[]
 for value in[1,10,11,44,221]:
  row=next(r for r in cases if r['case']==value);at=text.index(row['text']);rawtext=row['text'].encode();assert hashlib.sha256(rawtext).hexdigest()==row['sha256'];p=P/f'case-{value}-retained.txt';p.write_text(row['text']);groups.append(dict(state=value,UTF8_byte_range=dict(start=len(text[:at].encode()),end_exclusive=len(text[:at].encode())+len(rawtext)),pseudocode=info(p)))
 assert any('0x4ed'in r['text']and '0x417'in r['text']for r in cases if r['case']==221)
 assert all(x in canonical['0x4236d0']['pseudocode']for x in['FUN_00433a10','FUN_004032f0','FUN_004235f0','0xdd'])
 assert all(x in canonical['0x422e20']['pseudocode']for x in['0x1000','0x800','FUN_00420220'])
 pointer_groups=read(P/'shared-pointer-consumer-groups.json');assert {s for r in pointer_groups for s in r['states']}=={11,44,135,150,151,152,170,171,213,214,215,219,220,221,222}
 # Exact historical model differences are authorized source corrections, never rebaselined as unchanged.
 pre=read(P/'preflight.json');models=[r for r in pre['candidate_backups']if r['path'].endswith('/generate_vectors.py')or r['path'].endswith('/original-vectors.json')];assert len(models)==134;changed=[];unchanged=[]
 for r in models:
  now=info(R/r['path']);(unchanged if now==r else changed).append(dict(before=r,after=now))
 assert [r['after']['path']for r in changed if r['after']['path'].endswith('/generate_vectors.py')]==['analysis/game-battle-skill-v1/generate_vectors.py']
 receipts=read(P/'prior-regeneration-receipts.json');assert len(receipts)==23
 for r in receipts:
  assert r['exit_code']==0 and r['generator_sources_unchanged']and r['case_inputs_unchanged']and r['queues_unchanged']and r['authored_assets_and_geometry_unchanged']and r['old_frames']==r['new_frames']and r['old_RGBA']==r['new_RGBA'];same(r['after']);same(r['log'])
 review=dict(changed=changed,unchanged=unchanged,correction='40c7a1 previous actionRead-1 and registered global[body.slot], null is no-op; runtime and independent generator corrected together',regenerations=info(P/'prior-regeneration-receipts.json'),old_inputs_queues_geometry_assets_preserved=True,historical_stage218_only_reverified_in_before_view=True);write(P/'prior-model-correction-review.json',review)
 ob=read(A/'consumer-obligations.json');oldob=read(B/'consumer-obligations.json');assert len(ob['groups'])==10
 for x,y in zip(ob['groups'],oldob['groups']):assert all(x[k]==y[k]for k in['id','source','classes','required_behavior','complete'])and not x['complete']
 plan=read(A/'implementation-plan.json');parent=read(P/'before'/plan['parent_battle_phase']);assert len(parent['remaining_phase_requirements'])==35 and plan['required_remaining'][:35]==parent['remaining_phase_requirements']and not plan['full_goal_complete']and plan['goal_status']=='active'
 generation=read(P/'reference-generation-receipt.json');assert generation['observed_exit_code']==0 and generation['natural_termination_observed']and generation['inputs_unchanged_after_observation']
 for r in generation['actual_generator_inputs']:same(r)
 for k in['output','log']:same(generation[k])
 assert(generation['scenarios'],generation['states'],generation['RGBA'],generation['settled'])==(53,13799,1098,50)and len(generation['boundaries'])==2 and generation['waiting']==['same-a-multiple']
 for name in['implementation-spec.json','source-parameters.json','source-corrections.json','consumer-map.json']:assert read(A/name)['source']==old['source']
 out=dict(schema='moli.attached-rid-source-stage219.v1',source=old['source'],tool=old['tool'],analysis_profile=old['analysis_profile'],canonical_cache_layers=layers,canonical_functions=743,new_canonical_functions=[new_range],finite_Evidence=dict(prior_union=2671,new_distinct_records=11,new_ids=sorted(new),cumulative_after=2682,current_retained_snapshot_records=391),selected_retained_helpers=77,selected_original_range_bytes=101674,selected_original_ranges=ranges,current_decoded_instruction_bytes=41,current_raw_code_read_bytes=144,current_table_read_bytes=4,current_unique_code_bytes=161,current_unique_data_bytes=4,current_unique_original_bytes=165,current_original_checks=checks,retained_analyst_seeded_main=old['retained_analyst_seeded_main'],partial_435000=old['partial_435000'],selected_body_groups=groups,shared_pointer_consumers=pointer_groups,new_reference=info(A/'original-vectors.json'),new_reference_generation=info(P/'reference-generation-receipt.json'),source_parameters=info(A/'source-parameters.json'),implementation_spec=info(A/'implementation-spec.json'),source_corrections=info(A/'source-corrections.json'),consumer_map=info(A/'consumer-map.json'),consumer_obligations=info(A/'consumer-obligations.json'),model_field_review=info(P/'model-field-review.json'),historical_view_receipt=info(P/'historical-source-receipt.json'),historical_outputs_unchanged=hist['historical_outputs_unchanged'],prior_model_correction_review=info(P/'prior-model-correction-review.json'),old_model_files=len(models),old_model_files_changed=len(changed),old_model_files_unchanged=len(unchanged),new_REA_analysis_queries=11,session_observed_closed=True,cleanup_pending=False,session_status_observations=[info(P/n)for n in['session-before.json','session-final.json']],original_execution=0,VM_actions=0,official_sessions=0,source_investigation_complete=False,runtime_implementation_complete=False,phase_complete=False,full_goal_complete=False,goal_status='active');write(A/'source-check.json',out);print(json.dumps(dict(canonical=743,finite_Evidence=2682,selected_helpers=77,selected_bytes=101674,new_function_bytes=590,unique_current_code_data=165,changed_prior_models=len(changed),unchanged_prior_models=len(unchanged),REA_closed=True)),flush=True)
if __name__=='__main__':main()
