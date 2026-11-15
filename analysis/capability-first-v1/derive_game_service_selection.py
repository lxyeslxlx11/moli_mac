"""Verify reused service entry/rule views and layered open-call source evidence.

No original program, VM, account, network or product flow is executed. A source
range, callback table row, open CALL and required runtime feature are different.
"""
import hashlib,json,re,struct,sys
from collections import Counter
from pathlib import Path
sys.dont_write_bytecode=True
from extract_entry_inventory import PE
R=Path(__file__).resolve().parents[2];U=Path(__file__).resolve().parent;P=R/'build/analysis/capability-game-service-selection-v1'
SHA='37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd'
PROFILE='7810ea9437da59780820ec6fedb47ce47390841a95d527ddb6c3b3700fe180cb'
MANIFEST_SHA='c3264109162c54f056c1ee98e8c315afd52655610628d43e7335400a0e785097'
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
 def direct_call(a,raw,text,entry,source,ptr):
  if len(raw)<5 or raw[0]!=0xe8:return
  target=(a+5+struct.unpack('<i',raw[1:5])[0])&0xffffffff
  assert re.search(r'\bCALL\b',text,re.I)and re.search(r'0x0*'+format(target,'x')+r'\b',text,re.I)
  calls.append(dict(source=hex(a),target=hex(target),instruction_hex=raw[:5].hex(),owner=entry,file=source,pointer=ptr,file_offset=pe.file_offset(a,5)))
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
  for span in ranges:
   a,b=int(span['start'],16),int(span['end'],16);raw=pe.read(a,b-a+1);assert pe.executable(a)and pe.executable(b)
   occupied.update(range(a,b+1));proof.append(dict(start=hex(a),end=hex(b),bytes=len(raw),file_offset=pe.file_offset(a,len(raw)),sha256=digest(raw)))
  assert sum(q['bytes']for q in proof)==size
  if native:
   for i,line in enumerate(n['assembly']):
    m=re.match(r'\s*(0x[0-9a-fA-F]+):\s*(.*)',line);assert m
    a=int(m[1],16);assert a in occupied;end=next(int(q['end'],16)+1 for q in proof if int(q['start'],16)<=a<=int(q['end'],16))
    raw=pe.read(a,min(5,end-a));direct_call(a,raw,m[2],entry,row['file']['path'],row['pointer']+f'/normalized_result/assembly/{i}')
   count=0;totals['native_listing_boundaries']+=len(n['assembly'])
  else:
   seen=set()
   for i,ins in enumerate(r['instructions']):
    a=int(ins['address'],16);raw=bytes.fromhex(ins['bytesHex']);assert raw and raw==pe.read(a,len(raw))
    span=set(range(a,a+len(raw)));assert not span&seen;seen|=span
    direct_call(a,raw,ins['text'],entry,row['file']['path'],row['pointer']+f'/instructions/{i}')
   assert seen==occupied;count=len(r['instructions']);totals['derived_instructions']+=count
  totals['native_bodies'if native else'derived_bodies']+=1;totals['body_bytes']+=size
  bodies.append(dict(entry=entry,kind=row['kind'],role=row['role'],source=row['file'],pointer=row['pointer'],record_sha256=row['record_sha256'],
   evidence_id=row['evidence_id'],native_profile=row['native_profile'],ranges=proof,declared_body_bytes=size,pseudocode_sha256=digest(text.encode()),
   derived_instructions_byte_verified=count,full_callback_or_business_path_claimed=False))
  texts[entry]=text;records[entry]=r
 auth=read(P/'authenticate-reused-records.json');assert auth['passed']and not auth['failures']and auth['complete_records_factory_validated']==totals['native_bodies']
 assert not auth['original_snapshot_or_bundle_factory_validated']and not auth['original_snapshot_imported']
 # Exact tokens locate root-reviewed source clauses; matching text is not a
 # proof of feasibility, of all subroutine effects or of an absent feature.
 tokens={
  '0x4f4410':['FUN_0048fce0','param_3 == -1','DAT_00924f30 == 0','DAT_00c5ec18 == 0'],
  '0x48fce0':['case 0x10:','case 0x11:','case 0x18:','case 0x19:','case 0x1a:','FUN_004b0020','FUN_00490db0'],
  '0x4b0020':['DAT_00c11374 != 0','pcVar8[0x11]','pcVar8[0x18]','pcVar8[0x14]'],
  '0x4b0200':['DAT_00c11374 != 0','DAT_00c16218','pcVar7[0x11]','pcVar7[0x18]','pcVar7 + 0x14'],
  '0x4b2d00':['DAT_00c5e295','DAT_00c5e29c','DAT_00c5e298','DAT_00c16218','DAT_0055e4d4 = 0xfffffffe'],
  '0x4bcf90':['uVar5 < 2','uVar5 + 1','uVar5 < 3','FUN_004f8240','DAT_0055e4d4 = 0xffffffff'],
  '0x4bd2e0':['uVar5 + 1','uVar5 < 2','DAT_00c20f08','DAT_00c3b610','FUN_004f8240'],
  '0x4bd720':['iVar7 = 99','iVar10 + 1','iVar7 != 0','(&DAT_00c1df3c)[iVar10]','iVar2 < 0x168'],
  '0x4bdcf0':['DAT_00c4be7c * 8','DAT_00f53624 <','DAT_00d72fa8 == 0','DAT_00c44674 = 1','DAT_00c44674 = 2','iVar3 < 0x100'],
  '0x4be4a0':['DAT_00c5e295','DAT_00c5e278','_DAT_00c07a64 = iVar10','iVar2 < 200','FUN_004ea5b0'],
  '0x4beac0':['iVar8 < (int)(&DAT_00c5e280)','_DAT_00c3b634 = iVar8','FUN_004ea460(0x3d)','uVar5 = thunk_FUN_004034f0(DAT_00c203e0,DAT_00c440cc,2'],
  '0x4bf140':['FUN_004ea6f0(0x3c)','FUN_004ea460(0x3c)','DAT_00c3b634','FUN_004f8240'],
  '0x4c2b70':['local_b8 + 1','0 < *piVar7','piVar7 < 0xc5e210','FUN_004f8240','FUN_004ea5b0'],
  '0x4903e0':['param_2 + 1','FUN_004f8240'],
 }
 for entry,values in tokens.items():
  for value in values:assert value in texts[entry],(entry,value)
 assert 'FUN_004ea460'not in texts['0x4f4410']and 'FUN_004ea460'not in texts['0x48fce0']
 assert 'DAT_00c5e29c'not in texts['0x4be4a0']and 'DAT_00c16218'not in texts['0x4be4a0']
 # These are different fields. A previously stated tooltip/admission difference
 # was withdrawn after checking the classic writer and callback.
 field_proofs=[]
 for address,length in [(0xc5e278,2),(0xc5e295,1),(0xc5e298,4),(0xc5e29c,1)]:
  field_proofs.append(dict(address=hex(address),bytes=length,storage='runtime writable state; no initialized file bytes assumed'))
 inv=read(U/'entry-inventory.json');tables=[]
 descriptors={55:0x55ea30,56:0x55eaf8,57:0x55ebc0,58:0x55ec88,59:0x55ed50,60:0x55ee18,61:0x55eee0,67:0x55f390}
 for id,a in descriptors.items():
  w=next(w for w in inv['modern_windows']if w['id']==id);raw=pe.read(int(w['row_address'],16),20)
  assert struct.unpack('<II',raw[:8])==(id,int(w['callback'],16))and w['group']==2
  assert w['callback']in texts and struct.unpack('<I',pe.read(a+0x10,4))[0]==id
  tables.append(dict(id=id,callback=w['callback'],group=2,row_address=w['row_address'],row_sha256=digest(raw),
   descriptor_address=hex(a),descriptor_id_address=hex(a+0x10),descriptor_id_bytes_hex=pe.read(a+0x10,4).hex()))
 protocols=[]
 for family,side,key,entry,tag,fields in [('receive','receive_entries','consumer','0x4f4410','Q?m',['int32']*4+['bytes']),
  ('send','send_entries','producer','0x4f8240','/1I',['int32']*5+['bytes'])]:
  row=next(r for r in inv[side]if r[key]==entry);assert row['tag']==tag and row['fields']==fields
  raw=pe.read(int(row['tag_address'],16),4);assert raw==tag.encode()+b'\0'and digest(raw)==row['tag_word_sha256'];protocols.append(row)
 # Independently reproduce the complete executable/file-backed rel32 byte scan.
 index=read(P/'open-call-index.json');assert index['passed_mechanical_checks']and not index['issues']
 found=set()
 for va,size,off,flags,virtual_size in pe.sections:
  if not flags&0x20000000:continue
  raw=pe.read(va,size)
  for opcode in [b'\xe8',b'\xe9']:
   at=raw.find(opcode)
   while at>=0:
    if at+5<=len(raw)and (va+at+5+struct.unpack('<i',raw[at+1:at+5])[0])&0xffffffff==0x4ea460:found.add(va+at)
    at=raw.find(opcode,at+1)
 assert found=={int(q['opcode_address'],16)for q in index['candidates']}
 confirmed=[];typed=[];unresolved=[]
 for q in index['candidates']:
  a=int(q['opcode_address'],16);raw=pe.read(a,5);assert raw.hex()==q['encoding_hex']and (a+5+struct.unpack('<i',raw[1:])[0])&0xffffffff==0x4ea460
  n=q['neighboring_original_bytes'];assert pe.read(int(n['address'],16),n['bytes']).hex()==n['bytes_hex']
  matches=q['original_graph_instruction_matches']+q['supplemental_instruction_matches']
  for m in matches:
   actual=pointer(read(m['file']['path']),m['instruction_pointer'])
   if isinstance(actual,dict):assert int(actual['address'],16)==a and actual['bytesHex']==q['encoding_hex']
   else:assert actual==m['original_text']and re.match(r'0x0*'+format(a,'x')+r':\s*CALL\s+0x0*4ea460\b',actual,re.I)
  assert bool(matches)==q['actual_retained_instruction_verified']
  (confirmed if matches else typed if q['old_native_xref_matches']else unresolved).append(q['opcode_address'])
 assert len(confirmed)==79 and len(typed)==15 and len(unresolved)==5
 assert index['retained_full_records'][0]==records['0x4ea460']
 summary=dict(reused_native_records=totals['native_bodies'],reused_derived_views=totals['derived_bodies'],selected_source_views=len(bodies),
  declared_source_body_bytes=totals['body_bytes'],native_listing_boundaries=totals['native_listing_boundaries'],derived_instructions_byte_verified=totals['derived_instructions'],
  selected_source_E8_CALLs_verified=len(calls),selected_table_bindings=len(tables),open_rel32_byte_candidates=len(found),
  open_instruction_confirmed_sites=len(confirmed),open_typed_xref_only_sites=len(typed),open_byte_only_unresolved_sites=len(unresolved),
  new_REA_records=0,new_decompilation=False,runtime_features_changed=False,all_capability_analysis_complete=False)
 return dict(schema='moli.capability.game-service-selection-source-check.v1',source=ident(R/'build/analysis/game-release-current-v1/legacy-members/cg_se_6000.exe'),
  native_profile=PROFILE,manifest=ident(manifest),source_selection=ident(P/'source-body-selection.json'),source_bodies=bodies,
  complete_selected_native_record_authentication=ident(P/'authenticate-reused-records.json'),semantic_anchor_tokens=tokens,state_field_widths=field_proofs,
  table_bindings=tables,protocol_bindings=protocols,selected_source_E8_CALLs=calls,
  open_call_inventory=dict(file=ident(P/'open-call-index.json'),summary=index['summary'],all_rel32_byte_candidates_reproduced=True,
   confirmed_sites=confirmed,typed_xref_only_sites=typed,unresolved_byte_sites=unresolved,limitations=index['limitations']),
  comparison_reused_contracts=[ident(U/n)for n in ['game-training-services-contract.json','game-service-invalidation-contract.json','alternate-window-contract.json']],
  source_scope='Complete retained records/declared address sets and selected rule clauses. No assertion of all callback paths, parameter flow or runtime activation.',
  corrections=[dict(id='threshold-versus-tooltip-byte',kind='corrected-observation',
   result='0xc5e295 is the threshold-admission byte in both reviewed paths; the classic tooltip hint is0xc5e29c. An earlier commentary claim conflated them and is withdrawn.')],
  summary=summary,passed=True,original_execution=False,VM_operations=False,account_or_official_session_observed=False,runtime_features_changed=False,
  alternate_service_activation_closed=False,all_capability_analysis_complete=False,implementation_gate_passed=False,full_goal_complete=False)
if __name__=='__main__':
 result=build();(U/'game-service-selection-source-check.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n')
 print(json.dumps(result['summary'],ensure_ascii=False))
