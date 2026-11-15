"""Verify pet publication, classic cache refresh and bounded page lifecycle.

Only retained static evidence is read. No target, VM, account or server is used.
Native records, analyst-seeded bodies and semantic review are separate claims.
"""
import hashlib,json,struct
from pathlib import Path
from extract_entry_inventory import PE
ROOT=Path(__file__).resolve().parents[2];PUBLIC=Path(__file__).resolve().parent
PRIVATE=ROOT/'build/analysis/capability-game-pet-publication-v1'
SHA='37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd'
PROFILE='7810ea9437da59780820ec6fedb47ce47390841a95d527ddb6c3b3700fe180cb'
MANIFEST_SHA='defbd17e62027007089cedb86587d716abc766b3d8e717f29a5ef06a71df1afc'
def load(p):return json.loads(p.read_text())
def stable(v):return json.dumps(v,ensure_ascii=False,sort_keys=True,separators=(',',':'))
def digest(b):return hashlib.sha256(b).hexdigest()
def identity(p):
 h=hashlib.sha256()
 with p.open('rb') as f:
  for b in iter(lambda:f.read(1048576),b''):h.update(b)
 return dict(path=str(p.relative_to(ROOT)),bytes=p.stat().st_size,sha256=h.hexdigest())
def pointer(v,p):
 for k in p.split('/')[1:] if p else []:v=v[int(k)] if isinstance(v,list) else v[k]
 return v
def evidence(v):
 if 'content'in v:v=v.get('structuredContent') or json.loads(next(x['text']for x in v['content']if x['type']=='text'))
 return v.get('result',v)
def build():
 manifest=PRIVATE/'source-inputs.json';assert identity(manifest)['sha256']==MANIFEST_SHA
 for r in load(manifest)['files']:assert identity(ROOT/r['path'])==r,r['path']
 pe_path=ROOT/'build/analysis/game-release-current-v1/legacy-members/cg_se_6000.exe';pe=PE(pe_path,SHA)
 member=load(PRIVATE/'evidence-membership-audit.json')
 member_hashes={r['evidence_id']:r['record_sha256']for r in member['previous_record_comparison_manifest']+member['new_records']}
 cache={};native=[];derived=[];bodies={};records={}
 for row in load(PRIVATE/'source-body-selection.json'):
  path=ROOT/row['file']
  if str(path)not in cache:cache[str(path)]=load(path)
  carrier=cache[str(path)];r=evidence(pointer(carrier,row['pointer']));entry=row['entry'];spans=[]
  if row['kind']=='native':
   assert r['operation']=='analyze_function' and r['subject']['digest']['sha256']==SHA and r['analysis_profile']['digest']==PROFILE
   if row['role']=='new-native' or r['evidence_id']in member_hashes:
    assert member_hashes[r['evidence_id']]==digest(stable(r).encode())
   else:
    # Old mounted-input records retain their own exact carriers; they were not
    # re-imported merely to make the current export contain already available evidence.
    binding=next(b for b in carrier['bindings']if b['evidence_id']==r['evidence_id'])
    src=ROOT/binding['source_carrier']['path'];assert identity(src)==binding['source_carrier']
    assert evidence(pointer(load(src),binding['source_record_json_pointer']))==r
   n=r['normalized_result'];assert n['procedure']['address']==entry
   body=n['procedure']['body'];assert body['available'] and body['contains_entry']
   source_ranges=body['ranges'];expected_bytes=body['total_bytes'];pseudocode=n['pseudocode']
  else:
   binding=pointer(carrier,row['binding_pointer'])
   assert binding['entry']==entry and binding['profile_as_retained']['native_profile_digest']is None
   src=ROOT/binding['source_identity']['path']
   if str(src)not in cache:cache[str(src)]=load(src)
   original=pointer(cache[str(src)],binding['source_pointer'])
   assert original==r and digest(stable(r).encode())==binding['source_record_sha256_stable_json_utf8']
   assert int(r['requestedEntry'],16)==int(entry,16) and r['decompileCompleted']
   source_ranges=r['derivedBody'];expected_bytes=r['derivedBodyBytes'];pseudocode=r['pseudocode']
  for span in source_ranges:
   a,b=int(span['start'],16),int(span['end'],16);raw=pe.read(a,b-a+1)
   assert pe.executable(a) and pe.executable(b)
   spans.append(dict(start=hex(a),end=hex(b),bytes=len(raw),file_offset=pe.file_offset(a,len(raw)),sha256=digest(raw)))
  assert sum(s['bytes']for s in spans)==expected_bytes
  item=dict(entry=entry,role=row['role'],source=identity(path),record_pointer=row['pointer'],record_sha256=digest(stable(r).encode()),
   ranges=spans,pseudocode_sha256=digest(pseudocode.encode()),semantic_scope='Only the rules stated in this contract; body extent is not whole-game semantic closure.')
  if row['kind']=='native':
   item.update(authority='complete-canonical-REA-record',evidence_id=r['evidence_id'],original_parameters=r['parameters'],native_profile=PROFILE,body_metadata=body,
    in_current_export=r['evidence_id']in member_hashes,original_carrier_equality_verified=r['evidence_id']not in member_hashes)
   native.append(item)
  else:
   covered=set()
   for ins in r['instructions']:
    a=int(ins['address'],16);raw=bytes.fromhex(ins['bytesHex']);assert raw and pe.read(a,len(raw))==raw
    assert any(int(s['start'],16)<=a and a+len(raw)-1<=int(s['end'],16)for s in spans)
    covered.update(range(a,a+len(raw)))
   assert len(covered)==expected_bytes
   item.update(authority='reused-analyst-seeded-derived-static',native_profile=None,original_source=binding['source_identity'],original_selector=binding['source_pointer'],
    profile_as_retained=binding['profile_as_retained'],instructions_verified=len(r['instructions']),instruction_bytes_verified=len(covered))
   derived.append(item)
  bodies[entry]=pseudocode;records[entry]=r
 # Tokens locate the reviewed source conditions; they do not prove arbitrary execution paths.
 tokens={
  '0x4855a0':['DAT_00c5e96c = 1'], '0x4855b0':['DAT_00c5e96c = 0'], '0x4855c0':['DAT_00c5e96c == 1'],
  '0x4855d0':['iVar4 == 0x10','in_ECX = 9','iVar4 == 0x11','in_ECX = 0xe','iVar4 == 0x12','in_ECX = 0xb','DAT_00c4bd7c','DAT_00ef3cad','DAT_00ef3c9c'],
  '0x4856a0':['DAT_00d72fb0 + 2','DAT_00c1dda4','DAT_00ef3cc0','0x6d8','0xd72fda'],
  '0x4856e0':['DAT_00c1dda4','DAT_00ef3cc0','return 1','return 0'],
  '0x4f3280':['DAT_00ef365c + param_2 * 0x6d8','param_3'],
  '0x480fe0':['param_1 == -1','DAT_00c221d0 = DAT_00c218e4','FUN_004856e0','FUN_004855c0','FUN_004855b0','FUN_00482e60','0x8000'],
  '0x4810f0':['param_1 == -1','FUN_004856e0','FUN_004855c0','FUN_004855b0','FUN_00483bf0','0x8000'],
  '0x4811f0':['param_1 == -1','FUN_004856e0','FUN_004855c0','FUN_004855b0','FUN_00484e20','0x8000'],
  '0x4813c0':['case 5:','case 6:','case 7:','case 8:','FUN_004f81d0','FUN_004f6be0','FUN_0049a130','DAT_00c218e4'],
  '0x4dd740':['DAT_00c5e934','FUN_004f6be0'], '0x4de9a0':['DAT_00c5e934'], '0x4e05f0':['DAT_00c5e934'],
  '0x481300':['DAT_00c106fc','DAT_00c10748','DAT_00c1079c'],
  '0x481340':['DAT_00c10750','DAT_00c106f4','DAT_00c1079c'],
  '0x481380':['DAT_00c107a4','DAT_00c106f4','DAT_00c10748']}
 for entry,required in tokens.items():
  for t in required:assert t in bodies[entry],(entry,t)
 remaining=records['0x4f3280'];assert len(remaining['instructions'])==7
 assert not any('CALL'in i['flowType']for i in remaining['instructions'])
 assert 'if ('not in bodies['0x4f3280']
 for entry,builder in [('0x480fe0','FUN_00482e60'),('0x4810f0','FUN_00483bf0'),('0x4811f0','FUN_00484e20')]:
  text=bodies[entry];normal=text[text.index('if (DAT_00c218e4'):]
  assert normal.index('FUN_004856a0')<normal.index('FUN_004855d0',normal.index('FUN_004856a0'))<normal.index('FUN_004855b0')<normal.index('FUN_0046cf90')<normal.index('0x8000')<normal.index(builder)
  assert 'FUN_004855b0'not in text[:text.index('if (DAT_00c218e4')]
 for entry in ['0x481300','0x481340','0x481380']:
  assert not any('CALL'in i['flowType']for i in records[entry]['instructions'])
 # Exact E8 decoding through PE section mappings, not file-offset arithmetic from image base.
 anchors=[]
 for name in ['pet-receiver-call-anchors.json','reused-pet-publication-owners.json']:
  for a in load(PRIVATE/name)['anchors']:
   address,target=int(a['source'],16),int(a['target'],16);raw=bytes.fromhex(a['instruction_hex'])
   assert len(raw)==5 and raw[0]==0xe8 and pe.read(address,5)==raw
   assert address+5+int.from_bytes(raw[1:],'little',signed=True)==target
   anchors.append(dict(source=hex(address),target=hex(target),file_offset=pe.file_offset(address,5),instruction_sha256=digest(raw),retained_anchor_source=str((PRIVATE/name).relative_to(ROOT))))
 assert len(anchors)==14
 incoming=[]
 for entry in ['4855b0','4855c0']:
  r=evidence(load(PRIVATE/f'incoming-{entry}.json'));assert r['parameters']==dict(procedure='0x'+entry,direction='incoming')
  refs=[v for v in r['normalized_result']['references']if v['kind']['call']]
  assert len(refs)==3 and {v['source_procedure']['address']for v in refs}=={'0x480fe0','0x4810f0','0x4811f0'}
  assert all(any(v['source_address']==a['source'] and v['target_address']==a['target']for a in anchors)for v in refs)
  incoming.append(dict(entry='0x'+entry,evidence_id=r['evidence_id'],CALL_sites=[v['source_address']for v in refs]))
 r=evidence(load(PRIVATE/'native-data-c5e96c.json'));refs=r['normalized_result']['incoming_references']
 assert {(v['source_address'],v['type'])for v in refs}=={('0x4855a0','WRITE'),('0x4855b0','WRITE'),('0x4855c0','READ')}
 # Reuse table identities; retain only hashes and callback bindings, not vendor control payloads.
 inv=load(PUBLIC/'entry-inventory.json');window_proofs=[]
 for w in [x for x in inv['classic_windows']if x['id']in [16,17,18]]:
  a=int(w['descriptor_address'],16);raw=pe.read(a,48);assert digest(raw)==w['descriptor_sha256']
  assert struct.unpack('<I',pe.read(int(w['pointer_address'],16),4))[0]==a
  for c in w['controls']:assert digest(pe.read(int(c['address'],16),32))==c['sha256']
  assert w['callbacks']['destructor']in ['0x481300','0x481340','0x481380']
  window_proofs.append(dict(id=w['id'],descriptor_address=hex(a),descriptor_bytes=48,descriptor_sha256=digest(raw),callbacks=w['callbacks'],control_identities_verified=len(w['controls'])))
 assert len(window_proofs)==3 and sum(w['control_identities_verified']for w in window_proofs)==162
 row=next(x for x in inv['receive_entries']if x['id']=='receive-00567c7c')
 assert row['tag']=='Or`' and row['fields']==['int32','int32'] and row['consumer']=='0x4f3280' and row['native_return']==0
 tagraw=pe.read(int(row['tag_address'],16),4);assert tagraw==b'Or`\0' and digest(tagraw)==row['tag_word_sha256']
 # A repeated observation is retained verbatim and explicitly excluded from new semantic coverage.
 helper=load(PRIVATE/'reused-pet-publication-helpers.json');old=helper['records'][0];dup=evidence(load(PRIVATE/'native-4855a0.json'))
 assert dup['normalized_result']==old['normalized_result'] and dup['parameters']==old['parameters']
 assert {k for k in old if old[k]!=dup[k]}=={'evidence_id','limitations'}
 assert member_hashes[dup['evidence_id']]==digest(stable(dup).encode())
 assert len(helper['records'])==3 and all(x['normalized_result']['procedure']['address']=='0x4032f0'for x in helper['records'][1:])
 assert '0x4032f0'not in bodies
 assert member['passed'] and member['previous_records_unchanged']==1775 and member['current_records']==1784
 assert member['new_operations']=={'analyze_function':6,'procedure_references':2,'inspect_native_instruction':1}
 assert member['offline_authentication']['complete_records_factory_validated']==1784 and not member['offline_authentication']['failures']
 assert not member['offline_authentication']['complete_original_export_passed_to_factory']
 closed=load(PRIVATE/'rea-final-closed.json');assert closed['open']is False and closed['cleanup_pending']is False
 selected=load(PRIVATE/'selected-pet-symbol-occurrences.json')['summary'];assert selected['selected_roots_processed']==647 and selected['positive_literal_roots']==30
 assert selected['requested_exact_symbols']['0xef365c']['positive_entries']==['0x468f60','0x4f3280']
 # Existing product source is inspected only; the new remaining-points contract is not implemented here.
 pet=(ROOT/'shared/legacy-game-pets.mjs').read_text()
 assert all(t in pet for t in ['0x4f0aa0','0x4f1000','0x4f1420'])and '0x4f3280'not in pet
 new=[v for v in native if v['role']=='new-native'];oldrows=[v for v in native if v['role']=='reused-native']
 size=lambda rows:sum(s['bytes']for v in rows for s in v['ranges'])
 assert len(new)==5 and size(new)==330 and len(oldrows)==7 and size(oldrows)==2781
 assert len(derived)==12 and size(derived)==6965 and sum(v['instructions_verified']for v in derived)==2009
 summary=dict(new_native_records=5,new_native_body_bytes=330,reused_complete_native_records=7,reused_native_unique_body_bytes=2781,
  reused_derived_entries=12,reused_derived_body_bytes=6965,reused_derived_instructions_verified=2009,new_derived_entries=0,
  duplicated_native_observations=1,duplicated_native_body_bytes=11,duplicated_observations_count_as_new_coverage=False,
  held_out_numeric_constructor_records=2,source_anchored_CALLs=14,classic_page_descriptors=3,classic_controls_identity_refs=162,
  selected_roots_searched=647,positive_literal_roots=30,literal_hits_are_complete_read_write_inventory=False,
  previous_REA_records_unchanged=1775,current_REA_records=1784,remaining_points_carrier_source_bound=True,
  remaining_points_carrier_added_to_shared_module=False,full_pet_business_closed=False,global97_callback_consumption_closed=False)
 result=dict(schema='moli.capability.game-pet-publication-source-check.v1',source=identity(pe_path),native_profile=PROFILE,tools=dict(REA='6.7.0',Ghidra='12.1.4'),
  input_manifest=identity(manifest),native_bodies=native,derived_bodies=derived,source_anchored_calls=anchors,incoming_query_and_clear=incoming,
  exact_dirty_symbol=dict(address='0xc5e96c',evidence_id=r['evidence_id'],references=refs,alias_or_whole_lifecycle_closed=False),
  classic_window_proofs=window_proofs,remaining_points_dispatch=row,
  duplicated_observation=dict(entry='0x4855a0',old_id=old['evidence_id'],new_id=dup['evidence_id'],normalized_facets_and_parameters_equal=True,
   differing_top_level_fields=['evidence_id','limitations'],new_semantic_coverage=False),
  held_out_numeric_constructor=dict(records=2,entry='0x4032f0',admitted_to_publication_body_coverage=False,representation_implementation_added=False),
  selected_symbol_inventory=identity(PRIVATE/'selected-pet-symbol-occurrences.json'),
  semantic_review=dict(method='Root reviewed relevant guards, branches and ordering; mechanical token/range checks locate the reviewed source.',
   source_entry_scope=sorted(tokens,key=lambda x:int(x,16)),full_4813c0_command_enums_reviewed=False,full_game_semantics_closed=False),
  evidence_membership=identity(PRIVATE/'evidence-membership-audit.json'),summary=summary,
  original_execution=False,VM_execution=False,account_or_official_session_observed=False,runtime_features_changed=False,all_capability_analysis_complete=False)
 (PUBLIC/'game-pet-publication-source-check.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n')
 print(json.dumps(summary,ensure_ascii=False))
if __name__=='__main__':build()
