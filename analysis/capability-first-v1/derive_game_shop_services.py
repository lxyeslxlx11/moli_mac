"""Verify grouped G11 source rules and source identities; no game or product run.

Declared function ranges, selected semantics, global scheduling, independent input
policy and official acceptance retain separate evidence and completion states.
"""
import hashlib,json,re,struct,sys
from collections import Counter
from pathlib import Path
sys.dont_write_bytecode=True
from extract_entry_inventory import PE
R=Path(__file__).resolve().parents[2];U=Path(__file__).resolve().parent;P=R/'build/analysis/capability-game-shop-services-v1'
SHA='37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd'
PROFILE='7810ea9437da59780820ec6fedb47ce47390841a95d527ddb6c3b3700fe180cb'
MANIFEST_SHA='b2020264bf3372af32268c8bf874c65445544f86f8df731d45ece35b6a32faa1'
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
   label='new'if row['role']=='new-pointer-anchored-callback'else'reused'
   totals[label+'_derived_instructions']+=count;totals[label+'_derived_body_bytes']+=size;totals[label+'_derived_views']+=1
  totals['native_views'if native else'derived_views']+=1;totals['body_bytes']+=size
  bodies.append(dict(entry=entry,kind=row['kind'],role=row['role'],source=row['file'],pointer=row['pointer'],record_sha256=row['record_sha256'],
   evidence_id=row['evidence_id'],native_profile=row['native_profile'],ranges=proof,declared_body_bytes=size,pseudocode_sha256=digest(text.encode()),
   derived_instructions_byte_verified=count,semantic_scope='Selected source clauses, not every subroutine effect or runtime path.'))
  texts[entry]=text;records[entry]=r
 auth=read(P/'authenticate-reused-records.json');assert auth['passed']and not auth['failures']and auth['complete_records_factory_validated']==43
 assert not auth['original_snapshot_or_bundle_factory_validated']and not auth['original_snapshot_imported']
 # Exact helper IDs/ranges in the six original source-checks retain their
 # different observations; the new selection does not rewrite old records.
 old=read(P/'reused-shop-native.json');assert len(old['records'])==40 and not old['missing']and not old['conflicts']
 old_ids={r['evidence_id']:r for r in old['records']};bound=0
 for requested in old['requested_helpers']:
  for binding in requested['bindings']:
   doc=read(binding['source_check']['path']);q=pointer(doc,binding['pointer']);entry=binding['entry']
   assert q==binding['original_item']and q['evidence_id']==requested['evidence_id']
   r=old_ids[q['evidence_id']];body=r['normalized_result']['procedure']['body'];assert r['normalized_result']['procedure']['address']==entry
   expected=[(int(z['start'],16),int(z['end'],16),z['sha256'])for z in q['ranges']]
   assert expected==[(int(z['start'],16),int(z['end'],16),digest(pe.read(int(z['start'],16),int(z['end'],16)-int(z['start'],16)+1)))for z in body['ranges']]
   bound+=1
 assert bound==52
 # Source anchors for the root's rule review; token checks alone do not prove semantics.
 tokens={
  '0x48fce0':['case 5:','case 6:','case 7:','case 0x14:','case 0x16:','case 0x1b:','case 0x1c:','case 0x1e:','case 0x1f:'],
  '0x492b90':['DAT_00c5bd18','uVar3 & 1','uVar3 & 2','LAB_00492b10'],
  '0x492b10':['-1 < param_1','param_1 < 2','DAT_00c5bd18','FUN_004f8240'],
  '0x492e10':['param_1 < 1','FUN_004f8240'],
  '0x492f60':['iVar1 != 0','LAB_00492cd0','FUN_004926f0'],
  '0x492cd0':['param_1 < 2','param_1 + 1','FUN_004f8240'],
  '0x4ab510':['DAT_00c221f0','FUN_004b98e0(2,2)','DAT_00c21920 != DAT_0055e4d4','FUN_004ab4c0'],
  '0x4a8f90':['DAT_00c21920 == DAT_0055e4d4','DAT_00c5e94c','iVar1 < 0x1c'],
  '0x4aa910':['DAT_00c07f7c','piVar2[3]','iVar1 = 2'],
  '0x4ad970':['param_2 & 0x400','local_20','iVar5 + local_20','DAT_00c218cc + iVar5 < DAT_00c218c8','DAT_00c43e5c < DAT_00f53624'],
  '0x4ad450':['DAT_00c4382c < 1','DAT_00c218c8 - DAT_00c218cc','DAT_0055e964','iVar10 - local_8'],
  '0x4ac140':['DAT_00c07f7c < 1','DAT_00f53624 < DAT_00c43e5c','FUN_00437410','DAT_004abd10','*DAT_00c3b2ac | 2','DAT_00c08094'],
  '0x4abd10':['param_1 !=','case 0:','case 1:','case 2:','case 3:','case 4:','case 5:','piVar7[1]','FUN_004f8240','0x8000'],
  '0x4af390':['(*DAT_00c08094)(0)','(*DAT_00c08094)(1)','0xfffffffd'],
  '0x4acbd0':['param_2 & 2','0x8000','FUN_004f8240'],
  '0x4ae4c0':['DAT_00c1e168','FUN_004a8f70','FUN_0046c780','FUN_004aadc0'],
  '0x4a8e20':['param_1 == 2','param_1 == 4','DAT_00c3b2ac = DAT_00c11320','FUN_004ae3e0'],
  '0x4ae3e0':['DAT_00c5e9c8','DAT_00c3bf70','DAT_00c1e168','FUN_004aadc0'],
  '0x4efad0':['DAT_00f53624'],
 }
 for entry,values in tokens.items():
  for value in values:assert value in texts[entry],(entry,value)
 for value in ['DAT_00f53624','FUN_00437410','FUN_004aa910','FUN_004ab290']:
  assert value not in texts['0x4abd10'],('No such direct final recheck clause in this body',value)
 # Table/format bytes are separate from runtime state; no BSS byte is invented.
 jump_tables=[]
 for a,targets,owner in [(0x4ac11c,[0x4abd3d,0x4abe0d,0x4abed2,0x4abfa3,0x4ac00b,0x4ac00b],'0x4abd10'),
  (0x4acbac,[0x4ac257,0x4ac437,0x4ac63d,0x4ac7d3,0x4ac90f,0x4ac90f],'0x4ac140')]:
  raw=pe.read(a,24);assert list(struct.unpack('<6I',raw))==targets
  occupied={int(i['address'],16)for i in records[owner]['instructions']};assert set(targets)<=occupied
  jump_tables.append(dict(address=hex(a),bytes=24,file_offset=pe.file_offset(a,24),sha256=digest(raw),owner=owner,targets=[hex(v)for v in targets]))
 formats=[]
 for a,raw in [(0x53632c,b'1\0'),(0x5633ec,b'%d|%d\0'),(0x5331ac,b'%d\0'),(0x564754,b'|\0'),(0x56499c,b'1|%d\0')]:
  assert pe.read(a,len(raw))==raw;formats.append(dict(address=hex(a),bytes=len(raw),hex=raw.hex(),file_offset=pe.file_offset(a,len(raw)),sha256=digest(raw)))
 assert struct.unpack('<I',pe.read(0x55e964,4))[0]==999
 inv=read(U/'entry-inventory.json');windows=[]
 for id in [52,53]:
  w=inv['classic_windows'][id];a=int(w['descriptor_address'],16);raw=pe.read(a,48)
  assert digest(raw)==w['descriptor_sha256']and struct.unpack('<I',pe.read(int(w['pointer_address'],16),4))[0]==a
  words=struct.unpack('<12I',raw)
  assert all(int(v,16)in words for v in w['callbacks'].values())
  for c in w['controls']:assert digest(pe.read(int(c['address'],16),32))==c['sha256']
  windows.append(dict(id=id,descriptor_address=hex(a),descriptor_sha256=digest(raw),callbacks=w['callbacks'],controls_identity_checked=len(w['controls'])))
 receipt=read(P/'derived-callbacks-receipt.json');assert receipt['exit_code']==0 and receipt['source_sha256']==receipt['source_sha256_after']==SHA
 for q in receipt['verified_pointer_anchors']:
  if 'instruction'in q:
   ins=q['instruction'];a=int(ins['address'],16);raw=bytes.fromhex(ins['bytesHex'])
  else:a=int(q['address'],16);raw=bytes.fromhex(q['instruction_hex'])
  assert raw==pe.read(a,len(raw))and raw[-4:]==int(q['target'],16).to_bytes(4,'little')
 protocols=[]
 for side,key,entry,tag,fields in [('receive_entries','consumer','0x4f4410','Q?m',['int32']*4+['bytes']),
  ('send_entries','producer','0x4f8240','/1I',['int32']*5+['bytes'])]:
  q=next(q for q in inv[side]if q[key]==entry);assert q['tag']==tag and q['fields']==fields
  assert pe.read(int(q['tag_address'],16),4)==tag.encode()+b'\0';protocols.append(q)
 # Independent core restrictions are existing design choices, not native claims.
 shop=(R/'shared/legacy-game-map-shop.mjs').read_text();dialog=(R/'shared/legacy-game-map-dialog.mjs').read_text()
 for token in ['row.slotRevision !== item.revision','quantity < 1','total > gold','gold + total > saleGoldLimit','Math.ceil(gold / rate)']:
  assert token in shop,token
 submit=dialog[dialog.index('    submitShop('):dialog.index('    dismiss(',dialog.index('    submitShop('))]
 assert 'quoteShop(expected, selections)'in submit and 'response(expected, 0, bytes, x, y)'in submit
 summary=dict(selected_source_views=len(bodies),unique_reused_native_entries=totals['native_views'],native_source_body_bytes=totals['native_body_bytes'],
  native_listing_boundaries=totals['native_listing_boundaries'],reused_derived_views=totals['reused_derived_views'],reused_derived_body_bytes=totals['reused_derived_body_bytes'],
  reused_derived_instructions=totals['reused_derived_instructions'],new_derived_views=totals['new_derived_views'],new_derived_body_bytes=totals['new_derived_body_bytes'],
  new_derived_instructions=totals['new_derived_instructions'],declared_source_body_bytes=totals['body_bytes'],
  direct_E8_CALL_occurrences_verified=len(calls),unique_E8_CALL_sites_verified=len({q['source']for q in calls}),
  original_complete_native_records_factory_validated=43,old_helper_ID_bindings_verified=bound,classic_descriptors=2,
  classic_controls_identity_checked=sum(q['controls_identity_checked']for q in windows),jump_tables=2,nine_entry_modes_bound=True,
  new_REA_records=0,runtime_features_changed=False,all_capability_analysis_complete=False)
 return dict(schema='moli.capability.game-shop-services-source-check.v1',source=ident(R/'build/analysis/game-release-current-v1/legacy-members/cg_se_6000.exe'),
  native_profile=PROFILE,manifest=ident(manifest),source_selection=ident(P/'source-body-selection.json'),source_bodies=bodies,
  original_complete_record_authentication=ident(P/'authenticate-reused-records.json'),source_helper_index=ident(P/'shop-native-source-index.json'),
  helper_record_selection=ident(P/'reused-shop-native.json'),semantic_anchor_tokens=tokens,jump_tables=jump_tables,format_bytes=formats,
  conversion_limit=dict(address='0x55e964',format='uint32',value=999,hex=pe.read(0x55e964,4).hex()),
  classic_window_bindings=windows,protocol_bindings=protocols,verified_pointer_anchors=receipt['verified_pointer_anchors'],direct_E8_CALLs=calls,
  known_input_and_policy_scope=['Native complete declared ranges/retained Listing and E8 encodings are checked; native non-CALL opcode text is not independently re-decoded.',
   'Selected rule clauses and complete source extents do not close full global/abnormal scheduling or aliases.',
   'Safe input restrictions, live slot revisions and direct quantity entry are independent core choices, not invented native guards.',
   'The raw shipping program, VM, accounts and network are not run; proposed product cases are not executed product tests.'],
  summary=summary,passed=True,original_execution=False,VM_operations=False,account_or_official_session_observed=False,runtime_features_changed=False,
  full_shop_exception_or_global_lifecycle_closed=False,all_capability_analysis_complete=False,implementation_gate_passed=False,full_goal_complete=False)
if __name__=='__main__':
 result=build();(U/'game-shop-services-source-check.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n')
 print(json.dumps(result['summary'],ensure_ascii=False))
