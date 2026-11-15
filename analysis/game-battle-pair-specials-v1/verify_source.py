#!/usr/bin/env python3
"""Verify retained native authority,original bytes,distinct readers and266/262 correction."""
from pathlib import Path
import hashlib,importlib.util,json,struct,sys
sys.dont_write_bytecode=True
A=Path(__file__).resolve().parent;R=A.parent.parent;P=R/'build/analysis/game-battle-pair-specials-v1'
def read(p):return json.loads(p.read_text())
def info(p):return dict(path=str(p.relative_to(R)),bytes=p.stat().st_size,sha256=hashlib.sha256(p.read_bytes()).hexdigest())
def write(p,d):p.write_text(json.dumps(d,ensure_ascii=False,indent=2)+'\n')
def envelope(p):
 d=read(p);return d['structuredContent']if 'structuredContent'in d else json.loads(next(c['text']for c in d['content']if c['type']=='text'))if 'content'in d else d
def main():
 prior=read(A.parent/'game-battle-special96-v1/source-check.json');spec=read(A/'implementation-spec.json');cmap=read(A/'consumer-map.json');source=prior['source'];assert spec['source']==source and info(R/source['path'])==source
 historical=read(P/'historical-source-receipt.json');assert historical['exit_code']==0 and historical['verified_pre_edit_files']==3417
 for row in historical['historical_outputs_unchanged']:assert info(R/row['path'])==row
 allf={}
 for row in prior['canonical_cache_layers']:
  assert info(R/row['path'])==row;d=read(R/row['path']);assert not set(allf).intersection(d);allf.update(d)
 assert len(allf)==742
 raw=(R/source['path']).read_bytes();pe=struct.unpack_from('<I',raw,60)[0];base=struct.unpack_from('<I',raw,pe+52)[0];opt=struct.unpack_from('<H',raw,pe+20)[0];sections=[]
 for i in range(struct.unpack_from('<H',raw,pe+6)[0]):
  vs,va,n,at=struct.unpack_from('<IIII',raw,pe+24+opt+40*i+8);sections.append((base+va,n,at,vs))
 def original(address,n):
  address=int(address,16)if isinstance(address,str)else address
  for start,size,offset,_ in sections:
   if start<=address and address+n<=start+size:return offset+address-start,raw[offset+address-start:offset+address-start+n]
  raise AssertionError('not wholly original file-backed')
 selected=read(P/'selected-retained-functions.json');assert len(selected)==59;ranges=[]
 for address,d in selected.items():
  assert d==allf[address];body=d['procedure']['body'];assert body['available']and body['contains_entry']and not body['non_contiguous']and len(body['ranges'])==1
  n=body['total_bytes'];at,b=original(address,n);assert int(body['ranges'][0]['end'],16)+1==int(address,16)+n
  assert(P/(address[2:]+'-retained-pseudocode.txt')).read_text()==d['pseudocode']
  assert(P/(address[2:]+'-retained-assembly.txt')).read_text()=='\n'.join(d['assembly'])+'\n'
  ranges.append(dict(address=address,bytes=n,file_offset=at,sha256=hashlib.sha256(b).hexdigest(),retained_analyze_function_id=d['id'],new_Evidence=False))
 assert sum(r['bytes']for r in ranges)==93763
 instructions=[]
 for p in sorted(P.glob('instruction-*.json')):
  d=envelope(p);v=d['normalized_result'];assert d['subject']['digest']['sha256']==source['sha256']and d['analysis_profile']['digest']==prior['analysis_profile']and v['status']=='decoded'
  at,b=original(v['address'],v['length']);assert b==bytes.fromhex(v['bytes']);instructions.append(dict(evidence_id=d['evidence_id'],address=v['address'],file_offset=at,bytes=len(b),original_hex=b.hex(),observed_canonical_procedure=v['procedure'],artifact=info(p)))
 assert len(instructions)==44
 data=[]
 for name,addr,n in [('table-533968.json','0x533968',200),('constants-52d3b0.json','0x52d3b0',16)]:
  d=envelope(P/name);v=d['normalized_result'];assert v['complete']and v['returned_bytes']==n and v['address']==addr
  at,b=original(addr,n);assert b.hex()==v['bytes_hex'];data.append(dict(address=addr,bytes=n,file_offset=at,original_hex=b.hex(),evidence_id=d['evidence_id'],artifact=info(P/name)))
 table=bytes.fromhex(data[0]['original_hex']);assert list(struct.unpack('10b',table[:10]))==[7,8,16,15,10,11,13,12,14,-1]and list(struct.unpack('11b',table[20:31]))==[10]*10+[-1]and table[40:]==bytes(160)
 assert struct.unpack('<dd',bytes.fromhex(data[1]['original_hex']))==(480,-.75)
 segment=next(s for s in sections if s[0]<=0x58fac0<s[0]+max(s[1],s[3]));assert 0x58fac0>=segment[0]+segment[1]
 refs=envelope(P/'xrefs-58fac0.json');assert refs['normalized_result']==['0x40fb8a','0x40fba1','0x40fba7','0x40fca7','0x40fcba']
 # Check the branch arithmetic itself,not the mistaken historical decimal label.
 calc={n:n-0x101-1-4 for n in [257,258,262,266]};assert calc[262]==0 and calc[266]==4
 assert envelope(P/'instruction-4247cf.json')['normalized_result']['operands'][1]['raw']=='0x106'
 assert envelope(P/'instruction-42480e.json')['normalized_result']['operands'][1]['raw']=='0x106'
 s=importlib.util.spec_from_file_location('ids205',A.parent/'game-battle-physical-consumers-v1/verify_source.py');ids=importlib.util.module_from_spec(s);s.loader.exec_module(ids)
 proof=read(R/'build/analysis/game-battle-physical-family-v1/prior-record-check.json');paths=[R/r['path']for r in proof['verified_prior_snapshot_files']]+[R/r['path']for r in proof['prior_small_snapshots_verified']]+[R/('build/analysis/'+n+'/rea.snapshot.json')for n in ['game-battle-physical-family-v1','game-battle-physical-consumers-v1','game-battle-physical-specials-v1','game-battle-physical-guard-v1','game-battle-physical-results-v1','game-battle-projectile-results-v1','game-battle-self-physical-v1','game-battle-nested-physical-v1','game-battle-special96-v1']];before=set()
 for p in paths:before.update(ids.evidence_ids(p))
 current=ids.evidence_ids(P/'rea-final.snapshot.json');assert len(before)==2600 and len(current)==355;new=current-before
 assert {r['evidence_id']for r in instructions}|{r['evidence_id']for r in data}|{refs['evidence_id']}==current-set(ids.evidence_ids(R/'build/analysis/game-battle-special96-v1/rea.snapshot.json'))|({r['evidence_id']for r in instructions}&before)
 closed=envelope(P/'close-final-result.json')['result'];assert(closed['evidence_records'],closed['primitive_entries'],closed['workflow_entries'])==(355,32,1)
 final=envelope(P/'session-final-after-category.json')['result'];assert not final['open']and not final['cleanup_pending']and final['server_identity']['package']['version']=='6.7.0'
 groups=read(P/'selected-case-groups.json');assert len(groups)==len({g['id']for g in groups})==18;inventory=read(R/'build/analysis/game-battle-physical-consumers-v1/consumer-inventory.json')['body_case_index']['complete_adjacent_alias_groups'];body=(P/'40a120-retained-pseudocode.txt').read_bytes()
 for g in groups:
  known=next(r for r in inventory if r['id']==g['id']);assert g['state']in g['values']and all(g[k]==known[k]for k in ['id','values','adjacent_alias_values','implementation_label_value','complete_group','private_text']);span=g['complete_group']['UTF8_byte_range'];b=body[span['start']:span['end_exclusive']];assert hashlib.sha256(b).hexdigest()==g['complete_group']['sha256']and(P/('body-%s.txt'%g['state'])).read_bytes()==b
 main=cmap['derived_main'];assert not main['canonical']and not main['procedure_existed_before_seed'];assert info(R/main['evidence']['path'])==main['evidence']and info(R/main['pseudocode']['path'])==main['pseudocode']
 derived=read(R/main['evidence']['path']);entry=next(r for r in derived['entries']if r['requestedEntry']=='004260b0');assert not entry['functionExistedBeforeSeed']and not derived['originalExecution']and not derived['originalBytePatches'];total=0
 for r in entry['instructions']:
  b=bytes.fromhex(r['bytesHex']);_,actual=original(r['address'],len(b));assert actual==b;total+=len(b)
 assert len(entry['instructions'])==14120 and total==54685
 for row in main['selected_complete_lexical_spans']+cmap['additional_derived_main_spans']:
  span=row['UTF8_byte_range'];b=(R/main['pseudocode']['path']).read_bytes()[span['start']:span['end_exclusive']];assert hashlib.sha256(b).hexdigest()==row['sha256']and(R/row['private_artifact']['path']).read_bytes()==b
 partial=prior['partial_435000'];assert partial['canonical_body_bytes']==28 and partial['source_llvm_bytes']==461 and not partial['provider_body_repaired'];assert info(R/partial['disassembly']['path'])==partial['disassembly']
 source_models=read(P/'regeneration-source-identities-before.json');assert source_models==read(P/'regeneration-source-identities.json')
 for row in source_models:assert info(R/row['path'])==row
 regenerated=read(P/'regeneration-receipts.json');assert len(regenerated)==3 and all(r['exit_code']==0 and r['same_cases_queues_assets_geometry']for r in regenerated)
 for row in regenerated:assert info(R/row['output']['path'])==row['output']and info(R/row['log']['path'])==row['log']
 baseline=read(P/'preflight.json')['candidate_backups'];models=[r for r in baseline if r['path'].endswith('/generate_vectors.py')or r['path'].endswith('/original-vectors.json')];assert len(models)==126
 model_changes=[dict(before=r,after=info(R/r['path']))for r in models if info(R/r['path'])!=r];assert len(model_changes)==6
 write(P/'prior-model-identity-review.json',dict(changed=model_changes,unchanged=[r for r in models if info(R/r['path'])==r],old_cases_queue_inputs_assets_geometry_preserved=True))
 protocol=read(P/'protocol-validation.json');assert protocol['passed']and(protocol['cases'],protocol['actual_shared_parser_prepared'],protocol['portable_bounds_rejections'],protocol['pending_after_both_native_readers_complete'])==(4608,4368,240,4128)
 for r in protocol['inputs']:assert info(R/r['path'])==r
 ob=read(A/'consumer-obligations.json');previous=read(A.parent/'game-battle-special96-v1/consumer-obligations.json');assert len(ob['groups'])==10
 for a,b in zip(ob['groups'],previous['groups']):assert all(a[k]==b[k]for k in ['id','source','classes','required_behavior','complete'])and not a['complete']
 result=dict(schema='moli.pair-specials-source-stage214.v1',source=source,tool=spec['tool'],analysis_profile=prior['analysis_profile'],canonical_cache_layers=prior['canonical_cache_layers'],canonical_functions=742,new_canonical_functions=[],finite_Evidence=dict(prior_union=2600,current_snapshot_records=len(current),new_distinct_records=len(new),new_ids=sorted(new),cumulative_after=len(before|current),historical_snapshot_files=len(paths)),selected_retained_helpers=59,selected_original_ranges=ranges,selected_original_range_bytes=93763,new_instruction_original_checks=instructions,new_instruction_original_bytes=sum(r['bytes']for r in instructions),new_instruction_records=sum(r['evidence_id']in new for r in instructions),original_data_checks=data,data_original_bytes=216,complete_selected_body_groups=18,distinct_selected_body_groups=18,selected_group_inventory=info(P/'selected-case-groups.json'),retained_analyst_seeded_main=dict(evidence=main['evidence'],pseudocode=main['pseudocode'],instructions_original_checked=14120,instruction_original_bytes=54685,canonical=False,not_new_function_or_Evidence=True),partial_435000=partial,category_arithmetic=dict(native_hex='0x106',decimal=262,distinct_native_hex='0x10a',distinct_decimal=266,branch_residuals=calc),global_cursor_static_reference_count=5,global_cursor_initial_image_zero_fill=True,global_cursor_runtime_observed=False,historical_source_reverified=True,historical_outputs_unchanged=historical['historical_outputs_unchanged'],historical_view_receipt=info(P/'historical-source-receipt.json'),reference_regeneration=info(P/'regeneration-receipts.json'),prior_model_identity_review=info(P/'prior-model-identity-review.json'),source_corrections=info(A/'source-corrections.json'),implementation_spec=info(A/'implementation-spec.json'),consumer_map=info(A/'consumer-map.json'),consumer_obligations=info(A/'consumer-obligations.json'),protocol_check=info(P/'protocol-validation.json'),session_closed=True,cleanup_pending=False,original_execution=0,VM_actions=0,official_sessions=0,source_investigation_complete=False,complete_common_family_closure=False,runtime_implementation_complete=False,phase_complete=False,full_goal_complete=False,goal_status='active')
 write(A/'source-check.json',result);print(json.dumps(dict(canonical=742,finite_Evidence=len(before|current),new_distinct_records=len(new),retained_helpers=59,retained_ranges_bytes=93763,instruction_observations=len(instructions),instruction_bytes=result['new_instruction_original_bytes'],original_data_bytes=216,body_groups=18,models_changed=6,REA_closed=True)),flush=True)
if __name__=='__main__':main()
