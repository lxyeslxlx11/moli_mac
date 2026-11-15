"""Verify grouped party/album source rules and source identities; no game or product run.

Declared function ranges, selected semantics, global scheduling, independent input
policy and official acceptance retain separate evidence and completion states.
"""
import hashlib,json,re,struct,sys
from collections import Counter
from pathlib import Path
sys.dont_write_bytecode=True
from extract_entry_inventory import PE
R=Path(__file__).resolve().parents[2];U=Path(__file__).resolve().parent;P=R/'build/analysis/capability-game-party-social-v1'
SHA='37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd'
PROFILE='7810ea9437da59780820ec6fedb47ce47390841a95d527ddb6c3b3700fe180cb'
MANIFEST_SHA='750d120782f7d45fc6c25cd7a7a9fc5403b7be8786626df6ec8b016866770fe7'
def load(p):return json.loads(p.read_text())
def digest(raw):return hashlib.sha256(raw).hexdigest()
def canonical(v):return digest(json.dumps(v,ensure_ascii=False,sort_keys=True,separators=(',',':')).encode())
def ident(p):
 h=hashlib.sha256()
 with p.open('rb')as f:
  for b in iter(lambda:f.read(1048576),b''):h.update(b)
 return dict(path=str(p.relative_to(R)),bytes=p.stat().st_size,sha256=h.hexdigest())
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

 auth=read(P/'authenticate-reused-records.json');assert auth['passed']and not auth['failures']and auth['complete_records_factory_validated']==80
 assert auth['source']==ident(P/'source-body-selection.json')and not auth['original_snapshot_or_bundle_factory_validated']and not auth['original_snapshot_imported']
 old=read(P/'reused-party-social-native.json');assert len(old['records'])==80 and not old['missing']and not old['conflicts']
 old_ids={r['evidence_id']:r for r in old['records']};bound=0;dossiers=0
 for requested in old['requested_helpers']:
  for binding in requested['bindings']:
   assert ident(R/binding['source_check']['path'])==binding['source_check']
   q=pointer(read(binding['source_check']['path']),binding['pointer']);assert q==binding['original_item']and q['evidence_id']==requested['evidence_id']
   r=old_ids[q['evidence_id']];n=r['normalized_result'];body=n['procedure']['body'];entry=n['procedure']['address']
   assert binding['entry']in (None,entry)and q.get('address',entry)==entry
   if 'body'in q:assert q['body']==body
   if 'ranges'in q:
    expected=[(int(z['start'],16),int(z['end'],16),z['sha256'])for z in q['ranges']]
    assert expected==[(int(z['start'],16),int(z['end'],16),digest(pe.read(int(z['start'],16),int(z['end'],16)-int(z['start'],16)+1)))for z in body['ranges']]
   assert ident(R/binding['declared_carrier']['path'])==binding['declared_carrier']
   if binding['carrier_kind']=='dossier':
    assert canonical(read(binding['declared_carrier']['path']))==canonical(r);dossiers+=1
   bound+=1
 assert bound==86 and dossiers==65
 alternatives=[]
 for q in selection['additional_authenticated_observations']:
  r=pointer(read(q['file']['path']),q['pointer']);assert ident(R/q['file']['path'])==q['file']and canonical(r)==q['record_sha256']and r['evidence_id']==q['evidence_id']
  assert r['subject']['digest']['sha256']==SHA and r['analysis_profile']['digest']==PROFILE
  body=r['normalized_result']['procedure']['body'];selected=next(b for b in bodies if b['entry']==q['entry'])
  spans=[dict(start=z['start'],end=z['end'],bytes=int(z['end'],16)-int(z['start'],16)+1,sha256=digest(pe.read(int(z['start'],16),int(z['end'],16)-int(z['start'],16)+1)))for z in body['ranges']]
  assert [(z['start'],z['end'],z['sha256'])for z in spans]==[(z['start'],z['end'],z['sha256'])for z in selected['ranges']]
  alternatives.append(dict(**q,ranges=spans,semantic_observations_not_blended=True))
 assert len(alternatives)==1
 # These tokens locate source clauses reviewed by the root, not a semantic oracle.
 tokens={
  '0x467060':['DAT_00614884 + 500','FUN_0043f2d0','FUN_004f77d0'],
  '0x4f3310':['DAT_00924f30 == 0','param_2 == 1','param_3 == 1','FUN_00500500','FUN_004f8340','_DAT_00f5f16c = 0'],
  '0x4f07d0':['DAT_00f5f170','FUN_00461f40','FUN_00500500'],
  '0x4610f0':['DAT_00957e98','FUN_00461370','FUN_0043c540'],
  '0x4618f0':['DAT_00978a58'],
  '0x4f3430':['DAT_00f5f170 != 0','0x100','FUN_00500570'],
  '0x450100':['DAT_00c439ac = 0x140','_DAT_00c218f0 = 0x15'],
  '0x4fe420':['0x5003','DAT_00d5ea50','DAT_005681d8'],
  '0x4fe0d0':['param_1 <= DAT_00c439ac','DAT_00f5f048 * 0x140','0x80','DAT_00d5eaa1','0x1d','0x1c','DAT_0053459c','DAT_00d5eadb','FUN_004fdf40'],
  '0x4fe290':['DAT_00d5ea54','FUN_00510ea0','FUN_004f6de0','local_4 & uVar6','< param_1'],
  '0x4fe3f0':['DAT_00d5ea54','0xa000','0x2800','FUN_004fdf40'],
  '0x423500':['DAT_00d5ea90','DAT_00f5f048 * 0xa000','0x13f','param_1 + 0x288','param_1 + 0x28e'],
  '0x4235f0':['FUN_00419840','FUN_00423500'],
  '0x5015a0':['FUN_004fdff0'],
  '0x485780':['DAT_00c07a74','DAT_00c1fa90','DAT_0056392c','FUN_0046c6b0'],
  '0x485870':['0x136','DAT_00c07a74'],
  '0x485bd0':['DAT_00c1fa90','DAT_00c3b5d8','0x13f'],
  '0x4dc850':['DAT_00c439ac','DAT_00c07f84','DAT_00d5eadb','FUN_004fdf40','DAT_00c5eab4','DAT_005669d4'],
  '0x4dd2a0':['DAT_00c081b0','DAT_00c218f0','DAT_00d5eadb','0xf'],
 }
 for entry,values in tokens.items():
  for value in values:assert value in texts[entry],(entry,value)
 raw_windows=[];virtual=[]
 def zero_fill(at,length,source,pointer_,old_hash=None):
  matches=[(start,size,offset,flags,vsize)for start,size,offset,flags,vsize in pe.sections if start+size<=at and at+length<=start+vsize]
  assert len(matches)==1
  start,size,offset,flags,vsize=matches[0];computed=digest(bytes(length))
  if old_hash:assert computed==old_hash
  return dict(address=hex(at),bytes=length,section_virtual_start=hex(start),section_raw_bytes=size,section_virtual_bytes=vsize,section_file_offset=offset,derived_loader_zero_sha256=computed,original_file_mapping=False,runtime_memory_read=False,source_check=source,pointer=pointer_)
 friendpath='analysis/game-battle-shared-storage-v1/friend-roster-source-check.json';friend=read(friendpath)
 for name,q in friend['raw_windows'].items():
  at=int(q['address'],16)
  if q.get('mapping')=='PE virtual zero-fill':virtual.append(zero_fill(at,q['bytes'],friendpath,f'/raw_windows/{name}',q['sha256']));continue
  raw=pe.read(at,q['bytes']);assert digest(raw)==q['sha256']
  raw_windows.append(dict(**q,file_offset=pe.file_offset(at,len(raw)),source_check=friendpath,pointer=f'/raw_windows/{name}',complete_function_claimed=False))
 for name in ['game-party-follow-v1','game-party-actions-v1']:
  path=f'analysis/{name}/source-check.json';doc=read(path)
  for i,q in enumerate(doc['byte_checks']):
   at=int(q['address'],16);raw=pe.read(at,q['bytes']);assert digest(raw)==q['sha256']and pe.file_offset(at,len(raw))==q['file_offset']
   raw_windows.append(dict(**q,source_check=path,pointer=f'/byte_checks/{i}',complete_function_claimed=False))
 actions=read('analysis/game-party-actions-v1/source-check.json');virtual.append(zero_fill(0x614884,4,'analysis/game-party-actions-v1/source-check.json','/shortcut_timer_initializer'))
 directions=actions['direction_table'];assert [list(x)for x in struct.iter_unpack('<hh',pe.read(0x53d4d4,32))]==directions['directions']
 old_calls=[]
 for source,target in friend['calls'].items():
  at=int(source,16);raw=pe.read(at,5);assert raw[0]==0xe8 and (at+5+struct.unpack('<i',raw[1:])[0])&0xffffffff==int(target,16)
  old_calls.append(dict(source=source,target=target,bytes_hex=raw.hex(),file_offset=pe.file_offset(at,5),boundary_in_selected_native_listing=any(q['source']==source for q in calls)))
 inv=read(U/'entry-inventory.json');windows=[];modern=[]
 for id in [19,20]:
  w=inv['classic_windows'][id];at=int(w['descriptor_address'],16);raw=pe.read(at,48);words=struct.unpack('<12I',raw)
  assert digest(raw)==w['descriptor_sha256']and struct.unpack('<I',pe.read(int(w['pointer_address'],16),4))[0]==at
  assert all(int(v,16)in words for v in w['callbacks'].values())
  for q in w['controls']:assert digest(pe.read(int(q['address'],16),32))==q['sha256']
  windows.append(dict(id=id,descriptor_address=hex(at),descriptor_sha256=digest(raw),callbacks=w['callbacks'],controls_identity_checked=len(w['controls'])))
 for id in [23,24]:
  w=next(w for w in inv['modern_windows']if w['id']==id);at=int(w['row_address'],16);raw=pe.read(at,20);words=struct.unpack('<5I',raw)
  assert words==(w['id'],int(w['callback'],16),w['group'],0,w['initial_dirty'])
  modern.append(dict(**w,row_sha256=digest(raw),table_row_verified=True,external_activation_not_proven=True))
 protocols=[]
 for side,key,entries in [('receive_entries','consumer',{'0x4f07d0':('HFs',['int32','bytes']),'0x4f3310':('Kk0',['int32']*2),'0x4f48b0':('@t-',['int32','bytes']),'0x4f48d0':('B8S',['int32']*15+['bytes']*2)}),('send_entries','producer',{'0x4f77d0':('*Cc',['int32']*3),'0x4f8340':('/Re',['int32']*3),'0x4f6de0':("'q=",['int32'])})]:
  for entry,(tag,fields)in entries.items():
   q=next(q for q in inv[side]if q[key]==entry);assert q['tag']==tag and q['fields']==fields and pe.read(int(q['tag_address'],16),4)==tag.encode()+b'\0';protocols.append(q)
 literals=[]
 literal_values=[(0x56392c,bytes.fromhex('bfaac6f4b4cbc4a7ceefb5c4cdbcbcf8b4b0bfdaa1a300'),'gbk','open-monster-album'),(0x5669d4,bytes.fromhex('bbd8b5bdcdbcbcf8b4b0bfdaa1a300'),'gbk','return-to-album'),(0x5669ec,bytes.fromhex('b4f2bfaab4cbb3e8ceefb5c4cdbcbcf8b4b0bfdaa1a300'),'gbk','open-pet-album'),(0x5669c8,bytes.fromhex('ccf8b9fd3130d2b3a1a300'),'gbk','skip-ten-pages'),(0x5681cc,b'album.dat\0','ascii','cache-basename'),(0x5681d8,b'CCA\0','ascii','cold-header'),(0x53351c,b'%s\\%s\0','ascii','cache-path-format'),(0x53cc9c,b'data\0','ascii','cache-directory'),(0x5348b4,b'wb\0','ascii','cache-write-mode'),(0x5348b8,b'rb\0','ascii','cache-read-mode')]
 for at,raw,encoding,role in literal_values:
  assert pe.read(at,len(raw))==raw;literals.append(dict(address=hex(at),file_offset=pe.file_offset(at,len(raw)),bytes=len(raw),hex=raw.hex(),sha256=digest(raw),encoding=encoding,role=role))
 # Resolve the old under-recovered /Re ABI using actual ordered pushes.
 assembly={entry:{int(re.match(r'\s*(0x[0-9a-fA-F]+):',line)[1],16):line for line in r['normalized_result']['assembly']}for entry,r in records.items()if 'normalized_result'in r}
 instruction_anchors=[]
 for owner,at,expected,text in [
  ('0x4f3310',0x4f3358,'0fbe05ac36f500','MOVSX EAX, byte ptr [0x00f536ac]'),
  ('0x4f3310',0x4f335f,'50','PUSH EAX'),('0x4f3310',0x4f3360,'b9d022bf00','MOV ECX, 0xbf22d0'),
  ('0x4f3310',0x4f336a,'50','PUSH EAX'),('0x4f3310',0x4f336b,'b9e022bf00','MOV ECX, 0xbf22e0'),
  ('0x4f3310',0x4f3375,'8b0d248ecd00','MOV ECX, dword ptr [0x00cd8e24]'),
  ('0x4f3310',0x4f337b,'50','PUSH EAX'),('0x4f3310',0x4f337c,'51','PUSH ECX'),('0x4f3310',0x4f3382,'83c410','ADD ESP, 0x10'),
  ('0x4fdf40',0x4fdf4b,'68cc815600','PUSH 0x5681cc'),('0x4fdff0',0x4fdffc,'68cc815600','PUSH 0x5681cc'),
  ('0x4fdf40',0x4fdfac,'680c400100','PUSH 0x1400c'),('0x4fdff0',0x4fe097,'3d0c400100','CMP EAX, 0x1400c')]:
  raw=bytes.fromhex(expected);assert raw==pe.read(at,len(raw))and assembly[owner][at].split(': ',1)[1]==text,(owner,hex(at),assembly[owner][at])
  instruction_anchors.append(dict(owner=owner,address=hex(at),bytes_hex=expected,text=text,file_offset=pe.file_offset(at,len(raw))))
 for at,target in [(0x4f3365,0x4034d0),(0x4f3370,0x4034d0),(0x4f337d,0x4f8340),(0x4fdfb2,0x5111c0),(0x4fe08b,0x511310),(0x5017f0,0x4fdff0)]:
  assert any(q['source']==hex(at)and q['target']==hex(target)for q in calls)
 assert 0x4fe380 in assembly['0x4fe290']and 'CMP EAX, EDX'in assembly['0x4fe290'][0x4fe380]
 assert '0x4fe380'not in records
 candidate=read(P/'album-ui-candidates.json');assert candidate['records_examined']==480 and len(candidate['candidates'])==3 and not candidate['whole_program_or_business_role_closed']
 core=(R/'shared/legacy-game-battle-friends.mjs').read_text();actors=(R/'shared/legacy-game-actors.mjs').read_text();protocol=(R/'shared/legacy-game-protocol.mjs').read_text()
 for token in ['const rows=Array(capacity).fill(null)','rows[index]={name,metadata}','revision<nextRevision','revision=nextRevision','close(){for(let index=0;index<capacity;index++)clear(index);revision=0;']:assert token in core,token
 for token in ['LEGACY_PARTY_BATTLE_UNMODELED','LEGACY_PARTY_DUPLICATE_BODY','LEGACY_PARTY_COMPOUND_UNMODELED','prepareCharacterEntry()','beginBattle()']:assert token in actors
 assert 'createBattleFriendRoster()'in protocol and 'battleFriends?.close();battleFriends=null'in protocol
 ss=dict(selected_source_views=len(bodies),unique_reused_native_entries=totals['native_views'],native_source_body_bytes=totals['native_body_bytes'],native_listing_boundaries=totals['native_listing_boundaries'],reused_derived_views=totals['reused_derived_views'],reused_derived_body_bytes=totals['reused_derived_body_bytes'],reused_derived_instructions=totals['reused_derived_instructions'],new_native_or_derived_views=0,declared_source_body_bytes=totals['body_bytes'],direct_E8_CALL_occurrences_verified=len(calls),unique_E8_CALL_sites_verified=len({q['source']for q in calls}),original_complete_native_records_factory_validated=80,additional_same_entry_original_observations=1,old_exact_ID_bindings_verified=bound,original_dossier_bindings_verified=dossiers,classic_descriptors=2,classic_controls_identity_checked=sum(w['controls_identity_checked']for w in windows),modern_table_rows=2,old_bounded_file_read_windows_verified=len(raw_windows),virtual_zero_fill_ranges=2,old_encoded_call_sites_verified=len(old_calls),protocol_bindings=len(protocols),static_literal_spans_verified=len(literals),new_REA_records=0,new_Ghidra_analysis=False,runtime_features_changed=False,all_capability_analysis_complete=False)
 assert ss['selected_source_views']==86 and ss['native_source_body_bytes']==30386 and ss['reused_derived_body_bytes']==5603
 return dict(schema='moli.capability.game-party-social-source-check.v1',source=ident(R/'build/analysis/game-release-current-v1/legacy-members/cg_se_6000.exe'),native_profile=PROFILE,manifest=ident(manifest),source_selection=ident(P/'source-body-selection.json'),source_bodies=bodies,additional_same_entry_original_observations=alternatives,original_complete_record_authentication=ident(P/'authenticate-reused-records.json'),source_helper_index=ident(P/'party-social-native-source-index.json'),helper_record_selection=ident(P/'reused-party-social-native.json'),semantic_anchor_tokens=tokens,old_bounded_file_read_windows=raw_windows,derived_loader_zero_fill=virtual,classic_window_bindings=windows,modern_window_bindings=modern,protocol_bindings=protocols,static_literals=literals,instruction_anchors=instruction_anchors,party_directions=directions,old_encoded_call_sites=old_calls,direct_E8_CALLs=calls,album_UI_query_scope=candidate,summary=ss,passed=True,original_execution=False,VM_operations=False,account_or_official_session_observed=False,runtime_features_changed=False,full_party_social_album_lifecycle_closed=False,all_capability_analysis_complete=False,implementation_gate_passed=False,full_goal_complete=False,known_scope=[
 'Complete declared native extents and seven old derived instruction streams match the fixed PE; selected clauses do not cover every helper effect/global order.',
 '80 complete old records are individually factory validated, including two original461370 observations; no whole original snapshot/bundle factory validation/import.',
 'Native non-CALL opcode text is not independently redecoded. Separate E8-encoded old sites do not imply a selected listing boundary unless marked.',
 'Zero-fill proofs are PE loader geometry, not original file bytes or observed runtime values.',
 'Historical friend-roster names are retained for traceability. Static album UI/path/record links establish album attribution, not full social-friend capability.',
 'No new REA function or Ghidra export, original execution, VM/account/network session, real cache read, product test/build or device flow.'
 ])
if __name__=='__main__':
 result=build();(U/'game-party-social-source-check.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n');print(json.dumps(result['summary'],ensure_ascii=False))
