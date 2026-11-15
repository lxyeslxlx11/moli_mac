#!/usr/bin/env python3
"""Revalidate original bytes and retained provenance; no original execution.

The historical206 generator ledger is checked against its exact pre207 archived
204 source for the one explicitly corrected model. Current model and vector
correction identities are verified separately; no historical receipts rewritten.
"""
from pathlib import Path
import hashlib,importlib.util,json,struct,sys
sys.dont_write_bytecode=True
A=Path(__file__).resolve().parent;R=A.parent.parent;P=R/'build/analysis/game-battle-physical-specials-v1'
def read(p):return json.loads(p.read_text())
def write(p,d):p.write_text(json.dumps(d,ensure_ascii=False,indent=2)+'\n')
def info(p):return dict(path=str(p.relative_to(R)),bytes=p.stat().st_size,sha256=hashlib.sha256(p.read_bytes()).hexdigest())
def envelope(p):
 d=read(p)
 return d['structuredContent']if 'structuredContent'in d else json.loads(next(c['text']for c in d['content']if c['type']=='text'))if 'content'in d else d
def main():
 s=importlib.util.spec_from_file_location('historical206',A.parent/'game-battle-physical-projectiles-v1/verify_source.py');old=importlib.util.module_from_spec(s);s.loader.exec_module(old)
 original_info=old.info;history=[];archived=R/'analysis/game-battle-physical-family-runtime-v1/generate_vectors.py'
 def historical_info(p):
  if p==archived:
   row=info(P/'before'/p.relative_to(R));row['path']=str(p.relative_to(R));return row
  return original_info(p)
 def compare(p,v):assert read(p)==v,str(p);history.append(info(p))
 old.info=historical_info;old.write=compare;old.main()
 prior=read(A.parent/'game-battle-physical-projectiles-v1/source-check.json');source=prior['source'];assert info(R/source['path'])==source
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
 selected=read(P/'selected-retained-functions.json');assert len(selected)==29;ranges=[]
 for address,d in selected.items():
  assert d==merged[address];body=d['procedure']['body'];assert body['available']and body['contains_entry']and not body['non_contiguous']and len(body['ranges'])==1
  n=body['total_bytes'];at,b=original(address,n);assert int(body['ranges'][0]['end'],16)+1==int(address,16)+n
  ranges.append(dict(address=address,bytes=n,file_offset=at,sha256=hashlib.sha256(b).hexdigest(),retained_analyze_function_id=d['id'],new_Evidence=False))
 instructions=[]
 for p in sorted(P.glob('instruction-*.json')):
  d=envelope(p);v=d['normalized_result'];assert d['subject']['digest']['sha256']==source['sha256']and d['analysis_profile']['digest']==prior['analysis_profile']and v['status']=='decoded'
  at,b=original(v['address'],v['length']);assert b==bytes.fromhex(v['bytes']);instructions.append(dict(evidence_id=d['evidence_id'],address=v['address'],file_offset=at,bytes=len(b),original_hex=b.hex(),operation=d['operation'],artifact=info(p)))
 assert len(instructions)==10 and sum(r['bytes']for r in instructions)==35
 s=importlib.util.spec_from_file_location('ids205',A.parent/'game-battle-physical-consumers-v1/verify_source.py');ids=importlib.util.module_from_spec(s);s.loader.exec_module(ids)
 proof=read(R/'build/analysis/game-battle-physical-family-v1/prior-record-check.json');paths=[R/r['path']for r in proof['verified_prior_snapshot_files']]+[R/r['path']for r in proof['prior_small_snapshots_verified']]+[R/'build/analysis/game-battle-physical-family-v1/rea.snapshot.json',R/'build/analysis/game-battle-physical-consumers-v1/rea.snapshot.json'];before=set()
 for p in paths:before.update(ids.evidence_ids(p))
 current=ids.evidence_ids(P/'rea.snapshot.json');assert len(before)==2445 and len(current)==164 and len(current-before)==10 and len(current|before)==2455
 assert {r['evidence_id']for r in instructions}==current-before
 close=envelope(P/'close-result.json')['result'];assert close['evidence_records']==164
 final=envelope(P/'session-final.json')['result'];assert not final['open']and not final['cleanup_pending'];assert final['server_identity']['package']['version']=='6.7.0'
 correction=read(P/'reference-correction-receipts.json');direct,projectile=correction
 assert len(direct['changed_queue_rows'])==802 and direct['changed_traces']==['class266-level0','class266-level9']and projectile['before']==projectile['after']
 for r in correction:
  assert r['exit_code']==0 and r['model_sources_unchanged_during_run']and r['original_authored_assets_unchanged']and r['geometry_unchanged']and r['case_inputs_unchanged'];assert info(R/r['after']['path'])==r['after']
  before_file=P/'before'/r['before']['path'];assert before_file.stat().st_size==r['before']['bytes']and hashlib.sha256(before_file.read_bytes()).hexdigest()==r['before']['sha256']
  for row in r['model_sources']:assert info(R/row['path'])==row
 generation=read(P/'reference-generation-receipt.json');assert generation['exit_code']==0 and generation['model_sources_unchanged'];assert info(R/generation['output']['path'])==generation['output'];assert info(R/generation['log']['path'])==generation['log']
 for row in generation['model_sources_before']:assert info(R/row['path'])==row
 ob=read(A/'consumer-obligations.json');previous=read(A.parent/'game-battle-physical-projectiles-v1/consumer-obligations.json');assert len(ob['groups'])==10
 for a,b in zip(ob['groups'],previous['groups']):assert all(a[k]==b[k]for k in['id','source','classes','required_behavior','complete'])and a['complete']is False
 spec=read(A/'implementation-spec.json');assert len(spec['modeled_positive_classes'])==27 and not spec['complete_common_family_closure']
 table=read(A/'tile-resources.json');assert table==read(P/'tile-resource-indices.json')and len(table['rows'])==6
 out=dict(schema='moli.physical-specials-source-stage207.v1',source=source,tool=spec['tool'],analysis_profile=prior['analysis_profile'],canonical_cache_layers=prior['canonical_cache_layers'],canonical_functions=742,new_canonical_functions=[],finite_Evidence=dict(prior_union=2445,current_snapshot_records=164,new_distinct_records=10,new_ids=sorted(current-before),cumulative_after=2455,historical_snapshot_files=len(paths)),selected_retained_helpers=len(selected),selected_original_ranges=ranges,selected_original_range_bytes=sum(r['bytes']for r in ranges),new_instruction_original_checks=instructions,new_instruction_original_bytes=35,historical_source_reverified=True,historical_outputs_unchanged=history,historical206_model_archive_view=dict(path=str(archived.relative_to(R)),archive=info(P/'before'/archived.relative_to(R)),current=info(archived),reason='Source-backed266 direct147 correction;historical identity is not the current model'),reference_correction=info(P/'reference-correction-receipts.json'),current_reference_generation=info(P/'reference-generation-receipt.json'),implementation_spec=info(A/'implementation-spec.json'),consumer_map=info(A/'consumer-map.json'),consumer_obligations=info(A/'consumer-obligations.json'),tile_resources=info(A/'tile-resources.json'),session_closed=True,cleanup_pending=False,original_execution=0,VM_actions=0,official_sessions=0,complete_common_family_closure=False,source_investigation_complete=False,runtime_implementation_complete=False,phase_complete=False,full_goal_complete=False,goal_status='active')
 write(A/'source-check.json',out);print(json.dumps(dict(canonical=742,new_canonical=0,finite=2455,new_instructions=10,instruction_bytes=35,selected_helpers=29,range_bytes=out['selected_original_range_bytes'],reference_cases=generation['scenarios'],closed=True)))
if __name__=='__main__':main()
