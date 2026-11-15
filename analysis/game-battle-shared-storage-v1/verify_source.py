#!/usr/bin/env python3
"""Checkpoint audit: immutable source bytes and retained native observations,not phase acceptance."""
from pathlib import Path
import hashlib,json,struct,sys
sys.dont_write_bytecode=True
R=Path(__file__).resolve().parents[2];A=Path(__file__).resolve().parent;P=R/'build/analysis/game-battle-shared-storage-v1'
def read(p):return json.loads(p.read_text())
def info(p):return dict(path=str(p.relative_to(R)),bytes=p.stat().st_size,sha256=hashlib.sha256(p.read_bytes()).hexdigest())
def same(d):assert info(R/d['path'])=={k:d[k]for k in['path','bytes','sha256']},d['path']
def env(p):
 o=read(p);return o.get('structuredContent',o)
def main():
 old=read(R/'analysis/game-battle-combination-v1/source-check.json');same(old['source']);data=(R/old['source']['path']).read_bytes();pe=struct.unpack_from('<I',data,60)[0];base=struct.unpack_from('<I',data,pe+52)[0];opt=struct.unpack_from('<H',data,pe+20)[0];sections=[]
 for i in range(struct.unpack_from('<H',data,pe+6)[0]):
  _,va,n,off=struct.unpack_from('<4I',data,pe+24+opt+i*40+8);sections.append((base+va,n,off))
 def original(a,n):
  a=int(a,16)if isinstance(a,str)else a
  for start,size,off in sections:
   if start<=a and a+n<=start+size:return data[off+a-start:off+a-start+n]
  raise AssertionError('no complete source mapping')
 def region(a,n):return dict(address=a,bytes=n,sha256=hashlib.sha256(original(a,n)).hexdigest())
 allf={};layers=old['canonical_cache_layers']+[info(P/'functions-added.json')]
 for r in layers:
  same(r);part=read(R/r['path']);assert not set(part)&set(allf);allf.update(part)
 assert len(allf)==746 and set(read(P/'functions-added.json'))=={'0x41b750'}
 selected=read(P/'selected-retained-functions.json');assert len(selected)==50;ranges=[]
 for a,d in selected.items():
  assert d==allf[a];body=d['procedure']['body'];assert body['available']and body['contains_entry'];rows=[]
  for r in body['ranges']:
   n=int(r['end'],16)-int(r['start'],16)+1;rows.append(region(r['start'],n))
  assert sum(x['bytes']for x in rows)==body['total_bytes'];ranges.append(dict(address=a,bytes=body['total_bytes'],ranges=rows,retained_evidence_id=d['id']))
 new=allf['0x41b750'];assert new['procedure']['body']['total_bytes']==160;newrange=region('0x41b750',160)
 names=['135-actor-child-pointer.json','159-finish-state-counter.json','159-state-counter-actual.json','41b750-dossier.json','421f90-instruction.json','421f90-bytes.json','shared-scale-floats.json'];observations=[];ids=set();byteaddresses=set();decoded=raw=unavailable=0
 for name in names:
  d=env(P/name);assert d['subject']['digest']['sha256']==old['source']['sha256']and d['analysis_profile']['digest']==old['analysis_profile'];ids.add(d['evidence_id']);v=d['normalized_result'];row=dict(file=info(P/name),id=d['evidence_id'],operation=d['operation'])
  if d['operation']=='inspect_native_instruction':
   row['status']=v['status']
   if v['status']=='decoded':b=bytes.fromhex(v['bytes']);assert original(v['address'],len(b))==b;decoded+=len(b);byteaddresses.update(range(int(v['address'],16),int(v['address'],16)+len(b)))
   else:assert v['status']=='not-instruction-boundary';unavailable+=1
  elif d['operation']=='read_bytes':
   assert v['complete'];b=bytes.fromhex(v['bytes_hex']);assert len(b)==v['returned_bytes']and original(v['address'],len(b))==b;raw+=len(b);byteaddresses.update(range(int(v['address'],16),int(v['address'],16)+len(b)))
  else:assert d['operation']=='analyze_function'and v['procedure']['address']=='0x41b750'
  observations.append(row)
 assert len(ids)==7 and(decoded,raw,unavailable)==(13,268,1)
 floats=struct.unpack('<7f',original('0x52d3c0',28));assert floats[0]==10 and floats[1]==struct.unpack('<f',bytes.fromhex('cdcccc3d'))[0]and floats[6]==struct.unpack('<f',bytes.fromhex('0ad7233c'))[0]
 # The current provider has no function at421f90. Reuse separately seeded205 derivation.
 derivedpath=R/'build/analysis/game-battle-physical-consumers-v1/derived-callbacks.json';derived=read(derivedpath);entry=next(e for e in derived['entries']if e['requestedEntry']=='00421f90');assert not derived['originalExecution']and not derived['originalBytePatches']and not entry['functionExistedBeforeSeed']and entry['derivedBodyBytes']==219
 for ins in entry['instructions']:assert original(ins['address'],len(bytes.fromhex(ins['bytesHex'])))==bytes.fromhex(ins['bytesHex'])
 oldmain=old['retained_analyst_seeded_main'];same(oldmain['evidence']);same(oldmain['pseudocode']);main=next(e for e in read(R/oldmain['evidence']['path'])['entries']if e['requestedEntry']=='004260b0');assert len(main['instructions'])==14120
 for ins in main['instructions']:assert original(ins['address'],len(bytes.fromhex(ins['bytesHex'])))==bytes.fromhex(ins['bytesHex'])
 part=(P/'RID-main-retained-pseudocode.txt').read_bytes();span=main['pseudocode'].encode().index(part);assert len(part)==13299
 cases=read(R/'build/analysis/game-battle-physical-family-v1/body-cases-private.json');text=allf['0x40a120']['pseudocode'];groups=[];selectedstates=[11,32,33,44,135,150,151,152,159,170,171,213,214,215,219,220,221,222,229,244];dependencies=[24,39,46,47,56,71,72,134,157,208,209,210,225]
 table=struct.unpack('<245I',original('0x419434',245*4));assert table[135]==0x4121b3 and table[159]==0x413287 and table[219:223]==(0x415519,0x41638c,0x416718,0x416ad5)
 for state in selectedstates+dependencies:
  row=next(r for r in cases if r['case']==state);part=row['text'];at=text.index(part);assert hashlib.sha256(part.encode()).hexdigest()==row['sha256'];groups.append(dict(state=state,entry=hex(table[state]),UTF8_byte_range=dict(start=len(text[:at].encode()),end_exclusive=len(text[:at].encode())+len(part.encode())),retained_fragment_sha256=row['sha256']))
 assert '51b4cf'in allf['0x41a240']['pseudocode']and'&DAT_00598ba4'in allf['0x41a240']['pseudocode'];assert '0x417'in next(r['text']for r in cases if r['case']==150)
 history=read(P/'historical-source-receipt.json');assert history['exit_code']==0 and history['verified_pre_edit_files']==3610
 baseline=read(P/'preflight.json')['candidate_backups'];models=[r for r in baseline if r['path'].endswith('/generate_vectors.py')or r['path'].endswith('/original-vectors.json')];assert len(models)==138
 for r in models:same(r)
 final=env(P/'session-final.json')['result'];closed=env(P/'close-result.json')['result'];assert not final['open']and not final['cleanup_pending']and closed['evidence_records']==412
 obligations=read(A/'consumer-obligations.json');assert len(obligations['groups'])==10 and all(not x['complete']for x in obligations['groups']);previous_obligations=read(R/'analysis/game-battle-combination-v1/consumer-obligations.json');assert all(all(x[k]==y[k]for k in['id','source','classes','required_behavior','complete'])for x,y in zip(obligations['groups'],previous_obligations['groups']))
 plan=read(A/'implementation-plan.json');parent=read(P/'before'/plan['parent_battle_phase']);assert set(parent['remaining_phase_requirements'])<=set(plan['required_remaining'])and len(plan['required_remaining'])==37
 out=dict(schema='moli.shared-storage-source-checkpoint-stage221.v1',scope='bounded canonical and derived source checkpoint;runtime/models/platform acceptance unfinished',source=old['source'],tool=old['tool'],analysis_profile=old['analysis_profile'],canonical_cache_layers=layers,canonical_functions=746,new_canonical_function=newrange,selected_retained_helpers=50,selected_original_range_bytes=sum(r['bytes']for r in ranges),selected_original_ranges=ranges,finite_Evidence=dict(prior_union=2696,new_distinct_records=7,new_ids=sorted(ids),cumulative_after=2703,current_retained_snapshot_records=412),current_decoded_instruction_bytes=decoded,current_raw_window_bytes=raw,non_instruction_observations=unavailable,current_unique_original_bytes=len(byteaddresses),current_observations=observations,retained_derived_field_callback=dict(evidence=info(derivedpath),address='0x421f90',body_bytes=219,instructions=len(entry['instructions']),canonical=False),retained_derived_main=dict(**oldmain,full_instruction_count=14120,full_instruction_bytes=54685,RID_lexical_span=dict(start=span,end_exclusive=span+13299)),selected_body_groups=groups,bounded_field_search=info(P/'shared-cell-source-candidates.json'),old_model_files=138,old_model_files_changed=0,session_observed_closed=True,cleanup_pending=False,source_investigation_complete=False,runtime_implementation_complete=False,independent_complete_state_model=False,full_regression=False,current_generated_acceptance=False,page_acceptance=False,phase_complete=False,full_goal_complete=False,goal_status='active',original_execution=0,VM_actions=0,official_sessions=0)
 (A/'source-check.json').write_text(json.dumps(out,ensure_ascii=False,indent=2)+'\n');print(json.dumps({k:out[k]for k in['canonical_functions','selected_retained_helpers','selected_original_range_bytes','current_unique_original_bytes','old_model_files','phase_complete']}),flush=True)
if __name__=='__main__':main()
