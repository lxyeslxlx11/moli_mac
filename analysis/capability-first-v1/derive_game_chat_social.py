"""Verify grouped chat/social source rules and source identities; no game or product run.

Declared function ranges, selected semantics, global scheduling, independent input
policy and official acceptance retain separate evidence and completion states.
"""
import hashlib,json,re,struct,sys
from collections import Counter
from pathlib import Path
sys.dont_write_bytecode=True
from extract_entry_inventory import PE
R=Path(__file__).resolve().parents[2];U=Path(__file__).resolve().parent;P=R/'build/analysis/capability-game-chat-social-v1'
SHA='37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd'
PROFILE='7810ea9437da59780820ec6fedb47ce47390841a95d527ddb6c3b3700fe180cb'
MANIFEST_SHA='b8861ba8262da9e44f848774541c4f4c3d24348a551ad4dd9042eb758bd1366e'
def load(p):return json.loads(p.read_text())
def digest(raw):return hashlib.sha256(raw).hexdigest()
def canonical(v):return digest(json.dumps(v,ensure_ascii=False,sort_keys=True,separators=(',',':')).encode())
identities={}
def ident(p):
 st=p.stat();stamp=(st.st_dev,st.st_ino,st.st_size,st.st_mtime_ns)
 if p in identities and identities[p][0]==stamp:return identities[p][1]
 h=hashlib.sha256()
 with p.open('rb')as f:
  for b in iter(lambda:f.read(1048576),b''):h.update(b)
 value=dict(path=str(p.relative_to(R)),bytes=st.st_size,sha256=h.hexdigest())
 assert p.stat().st_mtime_ns==st.st_mtime_ns
 identities[p]=(stamp,value);return value
def pointer(v,p):
 for k in p.split('/')[1:]if p else []:v=v[int(k)]if isinstance(v,list)else v[k]
 return v
def build():
 manifest=P/'source-inputs.json';assert ident(manifest)['sha256']==MANIFEST_SHA
 for row in load(manifest)['files']:assert ident(R/row['path'])==row,row['path']
 pe=PE(R/'build/analysis/game-release-current-v1/legacy-members/cg_se_6000.exe',SHA)
 selection=load(P/'source-body-selection.json');cache={};bodies=[];calls=[];texts={};records={};totals=Counter()
 def read(path):
  path=R/path if isinstance(path,str)else path
  if path not in cache:cache[path]=load(path)
  return cache[path]
 def call(a,raw,text,entry,path,ptr):
  if len(raw)<5 or raw[0]!=0xe8:return
  target=(a+5+struct.unpack('<i',raw[1:5])[0])&0xffffffff
  assert re.search(r'\bCALL\b',text,re.I)and re.search(r'0x0*'+format(target,'x')+r'\b',text,re.I),(entry,hex(a),text)
  calls.append(dict(source=hex(a),target=hex(target),instruction_hex=raw[:5].hex(),owner=entry,file=path,pointer=ptr,file_offset=pe.file_offset(a,5)))
 for row in selection['entries']:
  assert ident(R/row['file']['path'])==row['file'];r=pointer(read(row['file']['path']),row['pointer']);assert canonical(r)==row['record_sha256']
  entry=row['entry'];native=row['kind']=='native';occupied=set();proof=[]
  if native:
   assert r['operation']=='analyze_function'and r['subject']['digest']['sha256']==SHA and r['analysis_profile']['digest']==PROFILE
   n=r['normalized_result'];body=n['procedure']['body'];assert n['procedure']['address']==entry and body['available']and body['contains_entry']
   ranges=body['ranges'];size=body['total_bytes'];text=n['pseudocode']
  else:
   assert hex(int(r['requestedEntry'],16))==entry and r['decompileCompleted']and r['status']=='derived-static-export'
   ranges=r['derivedBody'];size=r['derivedBodyBytes'];text=r['pseudocode']
  for q in ranges:
   a,b=int(q['start'],16),int(q['end'],16);raw=pe.read(a,b-a+1);assert pe.executable(a)and pe.executable(b)
   occupied.update(range(a,b+1));proof.append(dict(start=hex(a),end=hex(b),bytes=len(raw),file_offset=pe.file_offset(a,len(raw)),sha256=digest(raw)))
  assert sum(q['bytes']for q in proof)==size
  if native:
   points=[]
   for i,line in enumerate(n['assembly']):
    m=re.match(r'\s*(0x[0-9a-fA-F]+):\s*(.*)',line);assert m
    a=int(m[1],16);assert a in occupied;points.append((a,i,m[2]))
   for a,i,line in points:
    end=next(int(q['end'],16)+1 for q in proof if int(q['start'],16)<=a<=int(q['end'],16));raw=pe.read(a,min(5,end-a))
    if raw[:1]==b'\xe8':assert min([b for b,j,t in points if a<b<end]+[end])-a==5
    call(a,raw,line,entry,row['file']['path'],row['pointer']+f'/normalized_result/assembly/{i}')
   count=0;totals['native_listing_boundaries']+=len(points);totals['native_body_bytes']+=size
  else:
   covered=set()
   for i,ins in enumerate(r['instructions']):
    a=int(ins['address'],16);raw=bytes.fromhex(ins['bytesHex']);assert raw and raw==pe.read(a,len(raw))
    span=set(range(a,a+len(raw)));assert not covered&span;covered|=span
    call(a,raw,ins['text'],entry,row['file']['path'],row['pointer']+f'/instructions/{i}')
   assert covered==occupied;count=len(r['instructions'])
   label='new'if row['role']=='new-call-or-pointer-anchored-view'else'reused'
   totals[label+'_derived_instructions']+=count;totals[label+'_derived_body_bytes']+=size;totals[label+'_derived_views']+=1
  totals['native_views'if native else'derived_views']+=1;totals['body_bytes']+=size
  bodies.append(dict(entry=entry,kind=row['kind'],role=row['role'],source=row['file'],pointer=row['pointer'],record_sha256=row['record_sha256'],
   evidence_id=row['evidence_id'],native_profile=row['native_profile'],ranges=proof,declared_body_bytes=size,pseudocode_sha256=digest(text.encode()),
   derived_instructions_byte_verified=count,semantic_scope='Selected source clauses, not every subroutine effect or runtime path.'))
  texts[entry]=text;records[entry]=r

 auth=read(P/'authenticate-reused-records.json');assert auth['passed']and not auth['failures']and auth['complete_records_factory_validated']==103
 assert auth['source']==ident(P/'source-body-selection.json')and not auth['original_snapshot_or_bundle_factory_validated']and not auth['original_snapshot_imported']
 old=read(P/'reused-chat-social-native.json');assert len(old['records'])==99 and not old['missing']and not old['conflicts']
 old_ids={r['evidence_id']:r for r in old['records']};bound=0
 for requested in old['requested_helpers']:
  for binding in requested['bindings']:
   assert ident(R/binding['source_check']['path'])==binding['source_check']
   q=pointer(read(binding['source_check']['path']),binding['pointer']);assert q==binding['original_item']and q['evidence_id']==requested['evidence_id']
   r=old_ids[q['evidence_id']];body=r['normalized_result']['procedure']['body'];assert r['normalized_result']['procedure']['address']==binding['entry']
   actual=[(int(z['start'],16),int(z['end'],16),int(z['end'],16)-int(z['start'],16)+1,pe.file_offset(int(z['start'],16),int(z['end'],16)-int(z['start'],16)+1),digest(pe.read(int(z['start'],16),int(z['end'],16)-int(z['start'],16)+1)))for z in body['ranges']]
   assert actual==[(int(z['start'],16),int(z['end'],16),z['bytes'],z['file_offset'],z['sha256'])for z in q['ranges']]
   assert ident(R/binding['declared_bundle']['path'])==binding['declared_bundle'];bound+=1
 assert bound==107
 alternatives=[]
 for q in selection['additional_authenticated_observations']:
  r=pointer(read(q['file']['path']),q['pointer']);assert canonical(r)==q['record_sha256']and r['evidence_id']==q['evidence_id']and r['analysis_profile']['digest']==PROFILE
  body=r['normalized_result']['procedure']['body'];selected=next(b for b in bodies if b['entry']==q['entry'])
  spans=[dict(start=z['start'],end=z['end'],bytes=int(z['end'],16)-int(z['start'],16)+1,sha256=digest(pe.read(int(z['start'],16),int(z['end'],16)-int(z['start'],16)+1)))for z in body['ranges']]
  assert [(z['start'],z['end'],z['sha256'])for z in spans]==[(z['start'],z['end'],z['sha256'])for z in selected['ranges']];alternatives.append(dict(**q,ranges=spans,observations_not_blended=True))
 assert len(alternatives)==2
 # Source references are reviewed clauses, not a whole-program semantic oracle.
 tokens={
  '0x444930':['DAT_0060ff08','FUN_004f2c80','FUN_00443d60'],
  '0x4f2c80':['param_2 == 4','DAT_00d5d7a0','DAT_00f5f170','DAT_00f536bc & 8','< 1000','0x2bf21','FUN_00511180','FUN_004f7680'],
  '0x4f22e0':['param_2 & 0xfffd','DAT_00924f30'],
  '0x469a10':['& 8','FUN_00469d20'],
  '0x4699e0':['& 4','FUN_00469d20'],
  '0x469c90':['& 0x10','0xffef','FUN_00469d20'],
  '0x4f2df0':['DAT_0060ff18','DAT_00567918','DAT_00533690','FUN_00402cb0','FUN_00444f20','FUN_004ffc90','FUN_0043cfd0'],
  '0x4f30d0':['DAT_00567930','DAT_00567928','FUN_00445530','FUN_00444f20'],
  '0x444f20':['DAT_0060ff0c','0x134','DAT_0060ff20','0x1ff','FUN_00499cf0'],
  '0x402b50':['DAT_005849c4 == 100','0x11','FUN_00402a80'],
  '0x402bd0':['DAT_005849c4','0x11','FUN_00402a80'],
  '0x402910':['blacklist','0x11','DAT_005331a8'],
  '0x402a80':['DAT_005847c4','DAT_00584120','FUN_0051b349'],
  '0x4ffc90':['param_1','param_5 + 3','0x28','0x27','DAT_00567918'],
  '0x43cfd0':['param_6 + 3','0x28','0x27'],
  '0x43d150':['0x2000','0x180','0x573f','0x3be84'],
  '0x445530':['0x11f','DAT_0060ff08','FUN_00443f20','FUN_00445170'],
  '0x4456d0':['10 < DVar1','FUN_00445610','FUN_00445670'],
  '0x4671b0':['DAT_00f536ac','FUN_0043f100','DAT_00614884 + 500','FUN_004f6f60'],
  '0x466b80':['DAT_00536c60','FUN_004671b0'],
  '0x468ab0':['DAT_00536e58','DAT_00536e78','FUN_00469c90'],
  '0x4951d0':['DAT_00564168','DAT_00c3b92c','FUN_00495e50','0x28'],
  '0x496340':['DAT_00564324','DAT_00c44ddc','FUN_0046c6b0(0x16'],
  '0x498b00':['FUN_004f6e30','FUN_004f7290','FUN_004feae0','FUN_004fed30'],
  '0x4d0950':['DAT_00c1e180','FUN_004f6e30','FUN_004fe9a0','FUN_004fed30'],
  '0x4d1300':['DAT_00ef5838','DAT_00f5f048 * 0x3c','0x140','FUN_004fe580'],
  '0x4d2300':['FUN_004f6f10','FUN_004feaa0','FUN_004feae0'],
 }
 for entry,values in tokens.items():
  for value in values:assert value in texts[entry],(entry,value)
 raw_windows=[]
 for name in ['ordinary-chat','chat-presentation']:
  path=f'analysis/game-battle-shared-storage-v1/{name}-source-check.json';d=read(path)
  for i,q in enumerate(d['raw_windows']):
   at=int(q['address'],16);raw=pe.read(at,q['bytes']);assert digest(raw)==q['sha256']and pe.file_offset(at,len(raw))==q['file_offset'];raw_windows.append(dict(**q,source_check=path,pointer=f'/raw_windows/{i}',complete_function_claimed=False))
 inv=read(U/'entry-inventory.json');derived_entries={r['entry']for r in selection['entries']if r['kind']=='derived'};windows=[];modern=[]
 for w in inv['classic_windows']:
  if not any(q['callback']in derived_entries for q in w['controls']):continue
  at=int(w['descriptor_address'],16);raw=pe.read(at,48);words=struct.unpack('<12I',raw);assert digest(raw)==w['descriptor_sha256']and struct.unpack('<I',pe.read(int(w['pointer_address'],16),4))[0]==at
  assert all(int(v,16)in words for v in w['callbacks'].values())
  for q in w['controls']:assert digest(pe.read(int(q['address'],16),32))==q['sha256']
  windows.append(dict(id=w['id'],descriptor_address=hex(at),descriptor_sha256=digest(raw),callbacks=w['callbacks'],controls_identity_checked=len(w['controls'])))
 for w in inv['modern_windows']:
  if w['callback']not in derived_entries:continue
  at=int(w['row_address'],16);raw=pe.read(at,20);assert struct.unpack('<5I',raw)==(w['id'],int(w['callback'],16),w['group'],0,w['initial_dirty']);modern.append(dict(**w,row_sha256=digest(raw),external_activation_not_proven=True))
 protocols=[]
 for side,key,entries_ in [('receive_entries','consumer',{'0x4f22e0':('K0c',['int32']),'0x4f2df0':('Cz>',['int32','bytes','int32','int32']),'0x4f30d0':('DMK',['bytes'])}),('send_entries','producer',{'0x4f7680':(')bX',['int32','int32','bytes','int32','int32','int32']),'0x4f7780':('*(2',['int32']),'0x4f6f60':('(e6',['int32']*2),'0x4f7290':(':+(',['int32']*3+['bytes','int32'])})]:
  for entry,(tag,fields)in entries_.items():
   q=next(q for q in inv[side]if q[key]==entry);assert q['tag']==tag and q['fields']==fields and pe.read(int(q['tag_address'],16),4)==tag.encode()+b'\0';protocols.append(dict(**q,existing_catalog_binding=True,registry_added=False))
 for entry,tag,at,fields in [('0x4f6e30','(>#',0x567b20,['int32']*3+['bytes','int32']),('0x4f6f10','(R!',0x567b24,['int32'])]:
  assert pe.read(at,4)==tag.encode()+b'\0'
  actual=[q['target']for q in calls if q['owner']==entry];expected=['0x4fcea0']
  for field in fields:expected+=['0x4fcab0'if field=='bytes'else'0x4fca70','0x4fca20']
  expected+=['0x4fce00'];assert actual==expected,(entry,actual)
  assert not any(r['producer']==entry for r in inv['send_entries'])
  protocols.append(dict(id=None,producer=entry,tag=tag,tag_address=hex(at),fields=fields,source_authority='analyst-seeded static formatter, all instructions byte verified',native_profile=None,existing_catalog_binding=False,registry_added=False,product_catalog_changed=False,serializer_call_order_verified=actual))
 captions=read(P/'social-ui-candidates.json');assert captions['records_examined']==480 and len(captions['candidates'])==29 and not captions['whole_program_or_runtime_reachability_closed']
 selected_literals=[]
 for a in ['0x536c60','0x536e58','0x536e78','0x564110','0x564168','0x564324','0x565f00','0x565fec']:
  q=next(q for q in captions['static_caption_seeds']if q['address']==a);raw=bytes.fromhex(q['hex']);assert raw==pe.read(int(a,16),len(raw))and digest(raw)==q['sha256'];selected_literals.append(q)
 for at,raw,role in [(0x5678f8,b'P|%s\0','ordinary-chat-body-format'),(0x5331b4,b'data\\blacklist_%d.txt\0','blacklist-path-format'),(0x567918,b'[MIC]\0','microphone-prefix'),(0x533690,b'[GP]\0','group-prefix'),(0x567920,b'[GM\0[gm\0','operator-markers')]:
  assert raw==pe.read(at,len(raw));selected_literals.append(dict(address=hex(at),file_offset=pe.file_offset(at,len(raw)),bytes=len(raw),hex=raw.hex(),sha256=digest(raw),role=role))
 anchors=[]
 for name in ['derived-mail-receipt.json','derived-card-receipt.json']:
  receipt=read(P/name);assert receipt['exit_code']==0 and receipt['source_sha256_after']==receipt['source_sha256']==SHA and receipt['native_profile']is None and not receipt['canonical_REA_metadata_changed']
  for q in receipt['verified_call_anchors']:
   at=int(q['address'],16);raw=bytes.fromhex(q['instruction_hex']);assert raw==pe.read(at,len(raw))and raw[0]==0xe8 and at+5+struct.unpack('<i',raw[1:])[0]==int(q['target'],16);anchors.append(q)
 redundant=[]
 for q in selection['redundant_derived_corroboration']:
  r=pointer(read(q['file']['path']),q['pointer']);assert canonical(r)==q['record_sha256'];covered=set()
  for ins in r['instructions']:
   at=int(ins['address'],16);raw=bytes.fromhex(ins['bytesHex']);assert raw==pe.read(at,len(raw));covered.update(range(at,at+len(raw)))
  nativebody=next(b for b in bodies if b['entry']==q['entry']);assert covered=={a for z in nativebody['ranges']for a in range(int(z['start'],16),int(z['end'],16)+1)}
  redundant.append(dict(**q,instructions=len(r['instructions']),bytes=len(covered),all_bytes_equal_old_native_ranges=True,new_semantic_coverage=False))
 restored=read(P/'card-formatter-original-source.json');assert restored['projection_fields_match_original']and not restored['projection_difference_paths']and restored['projection_is_not_complete_Evidence']and not restored['original_fields_added_or_changed']
 assert ident(R/restored['complete_record']['path'])==restored['complete_record']and records['0x4f6f60']['evidence_id']==restored['evidence_id']
 reject=read(P/'authenticate-projection-rejection.json');assert not reject['passed']and reject['complete_records_factory_validated']==102 and len(reject['failures'])==1
 assert reject['failures'][0]['evidence_id']==restored['evidence_id']
 export=read(P/'rea-export.json')['structuredContent']['result'];close=read(P/'rea-close.json')['structuredContent']['result'];closed=read(P/'rea-final-closed.json')['structuredContent']['result']
 assert export['records']==close['evidence_records']==2 and not closed['open']and not closed['cleanup_pending']
 core=(R/'shared/legacy-game-map-chat.mjs').read_text();actors=(R/'shared/legacy-game-actors.mjs').read_text()
 for token in ['lastAttempt = null','legacyGameMapChatInputBytes = 76','legacyGameMapChatBlacklistCapacity = 100','flags === null','enabled && !inParty','wholeCharacters(text,287)','lastAttempt = tick']:assert token in core,token
 assert 'mic&&!actor.local'in actors and 'actorName.length!==name.length'in actors
 summary=dict(selected_source_views=len(bodies),reused_native_entries=sum(r['kind']=='native'and r['role']!='new-native-REA-body'for r in selection['entries']),new_native_entries=2,native_source_body_bytes=totals['native_body_bytes'],native_listing_boundaries=totals['native_listing_boundaries'],reused_derived_views=totals['reused_derived_views'],reused_derived_body_bytes=totals['reused_derived_body_bytes'],reused_derived_instructions=totals['reused_derived_instructions'],new_unique_derived_views=totals['new_derived_views'],new_derived_body_bytes=totals['new_derived_body_bytes'],new_derived_instructions=totals['new_derived_instructions'],redundant_new_derived_views=1,redundant_derived_body_bytes=107,redundant_derived_instructions=33,declared_source_body_bytes=totals['body_bytes'],direct_E8_CALL_occurrences_verified=len(calls),unique_E8_CALL_sites_verified=len({q['source']for q in calls}),complete_original_native_records_factory_validated=103,old_exact_helper_bindings_verified=bound,additional_same_entry_original_observations=2,classic_descriptors=len(windows),classic_controls_identity_checked=sum(w['controls_identity_checked']for w in windows),modern_table_rows=len(modern),old_bounded_file_read_windows_verified=len(raw_windows),protocol_bindings=len(protocols),newly_source_defined_serializers_not_added_to_product=2,selected_static_literal_spans=len(selected_literals),call_anchors_for_independent_views=len(anchors),new_REA_records=2,final_REA_export_records=2,final_REA_snapshot_records=2,runtime_features_changed=False,all_capability_analysis_complete=False)
 assert len(bodies)==117 and summary['reused_native_entries']==99 and summary['reused_derived_views']==13 and summary['new_unique_derived_views']==3
 return dict(schema='moli.capability.game-chat-social-source-check.v1',source=ident(R/'build/analysis/game-release-current-v1/legacy-members/cg_se_6000.exe'),native_profile=PROFILE,manifest=ident(manifest),source_selection=ident(P/'source-body-selection.json'),source_bodies=bodies,additional_same_entry_original_observations=alternatives,original_complete_record_authentication=ident(P/'authenticate-reused-records.json'),source_helper_index=ident(P/'chat-social-native-source-index.json'),old_helper_records=ident(P/'reused-chat-social-native.json'),semantic_anchor_tokens=tokens,old_bounded_file_read_windows=raw_windows,classic_window_bindings=windows,modern_window_bindings=modern,protocol_bindings=protocols,selected_static_literals=selected_literals,direct_E8_CALLs=calls,verified_call_anchors=anchors,redundant_derived_corroboration=redundant,original_formatter_restoration=restored,social_caption_query_scope=dict(source=captions['source'],terms=captions['terms'],records_examined=480,caption_seeds=len(captions['static_caption_seeds']),matching_derived_entries=len(captions['candidates']),whole_program_or_runtime_reachability_closed=False),summary=summary,passed=True,original_execution=False,VM_operations=False,account_or_official_session_observed=False,runtime_features_changed=False,full_chat_social_mail_lifecycle_closed=False,all_capability_analysis_complete=False,implementation_gate_passed=False,full_goal_complete=False,known_scope=[
 'Complete declared native extents and selected derived instructions match fixed PE. Native non-CALL opcode text is not independently redecoded; source extents are not full business closure.',
 '103 original complete records factory validated individually. The old partial formatter projection was rejected, then restored from its declared original126-record bundle, without synthesizing fields.',
 '437b30/445530 different original observations retained separately. Newly rederived4f6f60 corroborates an existing native formatter and adds no new semantic coverage.',
 'Two new REA functions, plus independent derivations, use different authority.4699e0 is duel bit4; actual namecard bit10 is469c90. Canonical REA metadata not changed.',
 'Static caption query covers480 old derived entries, not the whole program. Mail receive/cache writers/selection meanings and full activation/order remain pending.',
 'No original execution, VM, real chat/blacklist/mail/cache/account reads, product changes/tests/builds, devices or official session.'
 ])
if __name__=='__main__':
 result=build();(U/'game-chat-social-source-check.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n');print(json.dumps(result['summary'],ensure_ascii=False))
