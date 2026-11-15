#!/usr/bin/env python3
"""Fixed original bytes,canonical/derived separation,closed REA and historical input identities."""
from pathlib import Path
import hashlib,importlib.util,json,struct,sys
sys.dont_write_bytecode=True
A=Path(__file__).resolve().parent;R=A.parent.parent;P=R/'build/analysis/game-battle-combination-v1';B=A.parent/'game-battle-attached-rid-v1'
def read(p):return json.loads(p.read_text())
def write(p,d):p.write_text(json.dumps(d,ensure_ascii=False,indent=2)+'\n')
def info(p):return dict(path=str(p.relative_to(R)),bytes=p.stat().st_size,sha256=hashlib.sha256(p.read_bytes()).hexdigest())
def same(r):assert info(R/r['path'])=={k:r[k]for k in['path','bytes','sha256']},r['path']
def envelope(p):
 d=read(p);return d.get('structuredContent',d)
def main():
 old=read(B/'source-check.json');same(old['source']);hist=read(P/'historical-source-receipt.json');assert hist['exit_code']==0 and hist['verified_pre_edit_files']==3580
 for r in hist['historical_outputs_unchanged']:same(r)
 canonical={};layers=old['canonical_cache_layers']+[info(P/'functions-added.json')]
 for r in layers:
  same(r);part=read(R/r['path']);assert not set(part)&set(canonical);canonical.update(part)
 assert len(canonical)==745 and set(read(P/'functions-added.json'))=={'0x420c50','0x4210e0'}
 data=(R/old['source']['path']).read_bytes();pe=struct.unpack_from('<I',data,60)[0];base=struct.unpack_from('<I',data,pe+52)[0];opt=struct.unpack_from('<H',data,pe+20)[0];sections=[]
 for i in range(struct.unpack_from('<H',data,pe+6)[0]):
  vs,va,size,off=struct.unpack_from('<4I',data,pe+24+opt+40*i+8);sections.append((base+va,size,off))
 def original(a,n):
  a=int(a,16)if isinstance(a,str)else a
  for start,size,off in sections:
   if start<=a and a+n<=start+size:return off+a-start,data[off+a-start:off+a-start+n]
  raise AssertionError('not wholly file backed')
 def bytecheck(a,n):
  off,b=original(a,n);return dict(address=hex(int(a,16)if isinstance(a,str)else a),bytes=n,file_offset=off,sha256=hashlib.sha256(b).hexdigest())
 selected=read(P/'selected-retained-functions.json');assert len(selected)==102;ranges=[]
 for a,d in selected.items():
  assert d==canonical[a];body=d['procedure']['body'];n=body['total_bytes'];assert body['available']and body['contains_entry']and not body['non_contiguous']and len(body['ranges'])==1;assert int(body['ranges'][0]['end'],16)+1==int(a,16)+n
  ranges.append(dict(**bytecheck(a,n),retained_analyze_function_id=d['id']))
 assert sum(r['bytes']for r in ranges)==105376
 newranges=[bytecheck(a,canonical[a]['procedure']['body']['total_bytes'])for a in ['0x420c50','0x4210e0']];assert [r['bytes']for r in newranges]==[505,90]
 names=['420c50-dossier.json','combo-layout-table.json','4210e0-dossier.json','banner-floats-a.json','banner-floats-b.json','CMB-opcode-target.json','CMB-phase-targets.json','body70-target.json','body125-127-targets.json','body70-owner-write.json','body14-pending-check.json','banner-callback-binding.json','body14-pending-branch.json','CMB-phase-complete.json'];observations=[envelope(P/n)for n in names];checks=[];code=set();tables=set();decoded=raw=table=0
 table_names={'combo-layout-table.json','banner-floats-a.json','banner-floats-b.json','CMB-opcode-target.json','CMB-phase-targets.json','body70-target.json','body125-127-targets.json'}
 for name,d in zip(names,observations):
  assert d['subject']['digest']['sha256']==old['source']['sha256']and d['analysis_profile']['digest']==old['analysis_profile']
  if d['operation']=='analyze_function':
   norm=d['normalized_result'];a=norm['procedure']['address'];assert norm=={k:v for k,v in canonical[a].items()if k!='id'};continue
  v=d['normalized_result'];a=int(v['address'],16)
  if d['operation']=='inspect_native_instruction':assert v['status']=='decoded';n=v['length'];expected=v['bytes'];decoded+=n
  else:assert d['operation']=='read_bytes'and v['complete'];n=v['returned_bytes'];expected=v['bytes_hex'];table+=n if name in table_names else 0;raw+=n if name not in table_names else 0
  offset,b=original(a,n);assert b.hex()==expected;(tables if name in table_names else code).update(range(a,a+n));checks.append(dict(**info(P/name),address=hex(a),original_bytes=n,file_offset=offset,evidence_id=d['evidence_id']))
 assert(decoded,raw,table,len(code),len(tables))==(16,268,168,277,168),(decoded,raw,table,len(code),len(tables))
 assert struct.unpack('<20i',original(0x533bf4,80)[1])==tuple([0,34,54,66,88,108,131,152,171,0,0,8,7,6,5,4,3,2,1,9])
 assert struct.unpack('<I',original(0x433670,4)[1])[0]==0x426447
 assert struct.unpack('<4I',original(0x4336b0,16)[1])==(0x42645e,0x426af9,0x426b1c,0x426b8c)
 spec=importlib.util.spec_from_file_location('ids',A.parent/'game-battle-physical-consumers-v1/verify_source.py');ids=importlib.util.module_from_spec(spec);spec.loader.exec_module(ids);before=ids.evidence_ids(R/'build/analysis/game-battle-attached-rid-v1/rea.snapshot.json');current=ids.evidence_ids(P/'rea.snapshot.json');new=current-before;assert len(before)==391 and len(current)==405 and len(new)==14 and new=={d['evidence_id']for d in observations}
 known=set()
 def walk(x):
  if isinstance(x,dict):
   for y in x.values():walk(y)
  elif isinstance(x,list):
   for y in x:walk(y)
  elif isinstance(x,str)and x.startswith('ev_'):known.add(x)
 for p in(R/'analysis').glob('*/source-check.json'):
  if p.parent!=A:walk(read(p))
 assert not new&known;closed=envelope(P/'close-result.json')['result'];assert(closed['evidence_records'],closed['primitive_entries'],closed['workflow_entries'])==(405,35,1)
 for name in['session-before.json','session-final.json']:
  d=envelope(P/name)['result'];assert not d['open']and not d['cleanup_pending']
 derived=read(P/'derived-callbacks.json');assert not derived['originalExecution']and not derived['originalBytePatches'];entry=derived['entries'][0];assert entry['requestedEntry']=='00420e50'and not entry['functionExistedBeforeSeed']and entry['decompileCompleted']and not entry['noReturn'];instructions=entry['instructions'];assert(len(instructions),entry['derivedBodyBytes'])==(171,617);nb=0
 for ins in instructions:
  b=bytes.fromhex(ins['bytesHex']);assert original(ins['address'],len(b))[1]==b;nb+=len(b)
 assert nb==617;verified_derived=read(P/'derived-callback-verification.json');assert verified_derived['instructions']==171 and verified_derived['instruction_original_bytes']==617 and not verified_derived['canonical']
 oldmain=old['retained_analyst_seeded_main'];same(oldmain['evidence']);same(oldmain['pseudocode']);main=next(x for x in read(R/oldmain['evidence']['path'])['entries']if x['requestedEntry']=='004260b0');allins=read(P/'main-instructions.json');assert allins==main['instructions']and len(allins)==14120;nb=0
 for ins in allins:
  b=bytes.fromhex(ins['bytesHex']);assert original(ins['address'],len(b))[1]==b;nb+=len(b)
 assert nb==54685;selectedmain=read(P/'CMB-main-assembly.json');assert selectedmain==[i for i in allins if 0x426440<=int(i['address'],16)<0x426bbd]and len(selectedmain)==538 and sum(len(bytes.fromhex(i['bytesHex']))for i in selectedmain)==1919
 maintext=main['pseudocode'];part=(P/'CMB-main-retained-pseudocode.txt').read_text();start=maintext.encode().index(part.encode());assert(start,len(part.encode()))==(198309,8498)
 text=canonical['0x40a120']['pseudocode'];cases=read(R/'build/analysis/game-battle-physical-family-v1/body-cases-private.json');groups=[]
 for value in[14,24,70,125,126,127,135,150,151,152,159,170,171,213,214,215,219,220,221,222]:
  row=next(r for r in cases if r['case']==value);at=text.index(row['text']);rawtext=row['text'].encode();assert hashlib.sha256(rawtext).hexdigest()==row['sha256'];p=P/f'case-{value}-retained.txt';assert p.read_text()==row['text'];groups.append(dict(state=value,UTF8_byte_range=dict(start=len(text[:at].encode()),end_exclusive=len(text[:at].encode())+len(rawtext)),pseudocode=info(p)))
 hit=next(r['text']for r in cases if r['case']==14);assert hit.index('if (9999 <')<hit.index('(&DAT_0058fac4)')
 assert '0x40e'in hit and '**(int **)(iVar21 + 0xc)'in next(r['text']for r in cases if r['case']==70)
 for address in ['0x4347e0','0x4348e0']:assert '0x1038'in canonical[address]['pseudocode']
 assert '0x1040'in canonical['0x4347e0']['pseudocode']
 oldmodels=[r for r in read(P/'preflight.json')['candidate_backups']if r['path'].endswith('/generate_vectors.py')or r['path'].endswith('/original-vectors.json')];assert len(oldmodels)==136
 for r in oldmodels:same(r)
 oldob=read(B/'consumer-obligations.json');ob=read(A/'consumer-obligations.json');assert len(ob['groups'])==10
 for x,y in zip(ob['groups'],oldob['groups']):assert all(x[k]==y[k]for k in['id','source','classes','required_behavior','complete'])and not x['complete']
 plan=read(A/'implementation-plan.json');parent=read(P/'before'/plan['parent_battle_phase']);assert len(parent['remaining_phase_requirements'])==36 and plan['required_remaining'][:36]==parent['remaining_phase_requirements']and not plan['full_goal_complete']and plan['goal_status']=='active'
 generation=read(P/'reference-generation-receipt.json');assert generation['observed_exit_code']==0 and generation['natural_termination_observed']and generation['inputs_unchanged_after_observation']
 for r in generation['actual_generator_inputs']:same(r)
 for k in['output','log']:same(generation[k])
 assert(generation['scenarios'],generation['states'],generation['RGBA'],generation['settled'])==(62,81918,3918,59)and generation['waiting']==['duplicate','self']and generation['stops']==['local-exit']and not generation['boundaries']
 for name in['implementation-spec.json','source-parameters.json','source-corrections.json']:assert read(A/name)['source']==old['source']
 cmap=dict(schema='moli.combination-consumers-stage220.v1',source=old['source'],source_parameters=info(A/'source-parameters.json'),retained_original_ranges=ranges,new_canonical_ranges=newranges,retained_main=oldmain,retained_CMB_main=dict(pseudocode=info(P/'CMB-main-retained-pseudocode.txt'),UTF8_byte_range=dict(start=start,end_exclusive=start+len(part.encode())),instructions=538,original_instruction_bytes=1919),banner_callback=dict(derived=info(P/'derived-callbacks.json'),verification=info(P/'derived-callback-verification.json'),canonical=False,instructions=171,original_bytes=617),body_groups=groups,owner_contract='70 and14 update actual command data0 via106c;125126127 pop immediately',body14_lookup='global target lookup only when signal>9999;cooldown after removal remains valid',newly_modeled_states=[70,125,126,127],source_1038_and_1040_reset=True,unknown_native_fourth_scratch_tagged=True,complete_native_CMB=False,complete_shared_pointer_consumers=False);write(A/'consumer-map.json',cmap)
 out=dict(schema='moli.combination-source-stage220.v1',source=old['source'],tool=old['tool'],analysis_profile=old['analysis_profile'],canonical_cache_layers=layers,canonical_functions=745,new_canonical_functions=newranges,finite_Evidence=dict(prior_union=2682,new_distinct_records=14,new_ids=sorted(new),cumulative_after=2696,current_retained_snapshot_records=405),selected_retained_helpers=102,selected_original_range_bytes=105376,selected_original_ranges=ranges,current_decoded_instruction_bytes=decoded,current_raw_code_read_bytes=raw,current_table_read_bytes=table,current_unique_code_bytes=len(code),current_unique_data_bytes=len(tables),current_unique_original_bytes=len(code|tables),current_original_checks=checks,retained_analyst_seeded_main=oldmain,retained_main_CMB_lexical_span=cmap['retained_CMB_main'],analyst_seeded_banner=cmap['banner_callback'],partial_435000=old['partial_435000'],selected_body_groups=groups,new_reference=info(A/'original-vectors.json'),new_reference_generation=info(P/'reference-generation-receipt.json'),source_parameters=info(A/'source-parameters.json'),implementation_spec=info(A/'implementation-spec.json'),source_corrections=info(A/'source-corrections.json'),consumer_map=info(A/'consumer-map.json'),consumer_obligations=info(A/'consumer-obligations.json'),historical_view_receipt=info(P/'historical-source-receipt.json'),historical_outputs_unchanged=hist['historical_outputs_unchanged'],old_model_files=136,old_model_files_changed=0,old_model_files_unchanged=136,new_REA_analysis_queries=14,session_observed_closed=True,cleanup_pending=False,session_status_observations=[info(P/n)for n in['session-before.json','session-final.json']],original_execution=0,VM_actions=0,official_sessions=0,source_investigation_complete=False,runtime_implementation_complete=False,phase_complete=False,full_goal_complete=False,goal_status='active');write(A/'source-check.json',out);print(json.dumps(dict(canonical=745,finite_Evidence=2696,selected_helpers=102,selected_bytes=105376,new_function_bytes=595,derived_banner_bytes=617,unique_current_code_data=len(code|tables),unchanged_prior_models=136,REA_closed=True)),flush=True)
if __name__=='__main__':main()
