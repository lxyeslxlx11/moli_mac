"""Retained REA identity, new PE spans and explicitly derived callback byte validation."""
from pathlib import Path
import collections,hashlib,json,struct
R=Path(__file__).resolve().parents[2];A=Path(__file__).resolve().parent;P=R/'build/analysis/game-battle-return-v1'
def read(p):return json.loads(p.read_text())
def write(p,v):p.write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n')
def info(p):
 h=hashlib.sha256()
 with p.open('rb')as f:
  for b in iter(lambda:f.read(1048576),b''):h.update(b)
 return dict(path=str(p.relative_to(R)),bytes=p.stat().st_size,sha256=h.hexdigest())
def main():
 source=R/'build/analysis/game-release-current-v1/legacy-members/cg_se_6000.exe';raw=source.read_bytes();identity=info(source);assert len(raw)==1569280 and identity['sha256']=='37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd'
 old={r['evidence_id']:r for r in read(R/'build/analysis/game-battle-exit-v1/rea-final.json')['records']};records={r['evidence_id']:r for r in read(P/'rea-final.json')['records']};assert len(old)==2115 and len(records)==2134 and all(records[k]==v for k,v in old.items())
 new=[r for k,r in records.items()if k not in old];counts=collections.Counter(r['operation']for r in new);assert counts==dict(analyze_function=6,xrefs=4,read_bytes=3,address_to_file_offset=6)
 before=read(P/'functions-before.json');after=dict(before);functions=[];known=[]
 for r in new:
  assert r['subject']['digest']['sha256']==identity['sha256']
  if r['operation']!='analyze_function':continue
  n=r['normalized_result'];address=n['procedure']['address'];p=P/(address[2:]+'-'+r['evidence_id'][3:11]+'.json');write(p,r);row=dict(address=address,evidence_id=r['evidence_id'],body=n['procedure']['body'],limitations=n['limitations'],dossier=info(p))
  if address in before:known.append(row)
  else:after[address]={'id':r['evidence_id'],**{k:n[k]for k in ['procedure','pseudocode','assembly','callees','callers']}};functions.append(row)
 assert len(before)==648 and len(after)==651 and len(functions)==len(known)==3;write(P/'functions-complete.json',after)
 pe=struct.unpack_from('<I',raw,60)[0];base=struct.unpack_from('<I',raw,pe+52)[0];start=pe+24+struct.unpack_from('<H',raw,pe+20)[0];sections=[struct.unpack_from('<4I',raw,start+40*i+8)for i in range(struct.unpack_from('<H',raw,pe+6)[0])]
 def offset(address):
  rva=int(address,16)-base
  for vs,va,rs,rp in sections:
   if va<=rva<va+min(vs,rs):return rp+rva-va
  raise AssertionError(address)
 maps={r['normalized_result']['address']:r for r in records.values()if r['operation']=='address_to_file_offset'};checks=[]
 for row in read(P/'read-plan.json'):
  address=row['address'];size=row['length'];r=next(r for r in new if r['operation']=='read_bytes'and r['normalized_result']['address']==address and r['normalized_result']['requested_bytes']==size);n=r['normalized_result'];b=bytes.fromhex(n['bytes_hex']);at=offset(address)
  assert n['complete']and len(b)==n['returned_bytes']==size and raw[at:at+size]==b and maps[address]['normalized_result']['file_offset']==at and maps[row['end']]['normalized_result']['file_offset']==at+size-1
  checks.append(dict(address=address,bytes=size,file_offset=at,sha256=hashlib.sha256(b).hexdigest(),read_evidence=r['evidence_id'],mapping_evidence=maps[address]['evidence_id'],original_bytes_equal=True))
 assert sum(r['bytes']for r in checks)==457
 critical=['0x501a50','0x437b30','0x4f16d0','0x4f2010','0x4ff160','0x4ff3b0','0x4ff430','0x4ff510','0x4ff580','0x4ff5a0','0x4ffba0','0x440450','0x440570','0x4405a0','0x43c000','0x43cd00','0x43c1b0','0x5028a0','0x463ea0','0x4b9a10'];retained=[]
 for a in critical:
  f=after[a];body=f['procedure']['body'];assert body['available'];spans=[]
  for v in body['ranges']:
   at=offset(v['start']);size=int(v['end'],16)-int(v['start'],16)+1;b=raw[at:at+size];assert len(b)==size;spans.append(dict(start=v['start'],end=v['end'],file_offset=at,bytes=size,sha256=hashlib.sha256(b).hexdigest()))
  retained.append(dict(address=a,evidence_id=f['id'],retained_dossier=True,independent_PE_source_spans=spans))
 source_text=after['0x501a50']['pseudocode'];assert all(s in source_text for s in ['FUN_004ff430','FUN_00440450','DAT_00f5f18c','FUN_004405a0','FUN_005028a0'])
 for a in ['0x4f16d0','0x4f2010']:assert 'MOV ECX, 0x9250c8'in '\n'.join(after[a]['assembly'])
 derived=read(P/'ordinary-callback-derived.json');assert derived['source']['sha256']==identity['sha256']and not derived['target_executed']and not derived['source_written'];derived_checks=[]
 for f in derived['functions']:
  assert f['analyst_defined_entry']and f['entry']=='0x43ba10';size=0
  for ins in f['instructions']:
   b=bytes.fromhex(ins['bytes']);at=offset(ins['address']);assert raw[at:at+len(b)]==b;size+=len(b)
  assert size==f['body_bytes']==1515;derived_checks.append(dict(entry=f['entry'],instruction_bytes_verified=size,analyst_defined_entry=True,REA_canonical_function=False,original_bytes_equal=True))
 write(P/'derived-byte-checks.json',derived_checks)
 closed=read(P/'session-closed.json')['result'];assert closed['evidence_records']==2134 and closed['bytes']==524041509 and read(P/'final-session-status.json')==dict(open=False,cleanup_pending=False)
 out=dict(schema='moli.battle-return-source-stage189.v1',source=identity,tool='REA6.7.0/Ghidra12.1.4',records=2134,new_records=19,new_operations=dict(counts),known_functions_before=648,known_functions_after=651,new_functions=functions,known_function_queries=known,new_byte_checks=checks,new_original_bytes_verified=457,retained_source_functions=retained,derived_callback=derived_checks,derived_instruction_bytes_verified=1515,xrefs=[dict(address=r['parameters']['address'],evidence_id=r['evidence_id'],result=r['normalized_result'])for r in new if r['operation']=='xrefs'],artifacts=[info(P/n)for n in ['rea-final.json','rea.snapshot.json','functions-complete.json','ordinary-callback-derived.json','ordinary-callback-export-receipt.json','derived-byte-checks.json','session-closed.json','final-session-status.json']],source_contract=info(A/'implementation-spec.json'),source_limitations=['Normal ordinary-branch0 origin only; initialization flag1 is a derived path invariant, not whole-program indirect writer coverage','Direct numeric-wrapper-base xrefs prove unit/action gates; other unimplemented UI/effect readers remain separate','43ba10 code-pointer entry was unavailable in REA function inventory; independently recreated in a disposable Ghidra project and every1515 instruction bytes verified, not counted as a new REA canonical function','Full native ordinary object pool/UI/audio scheduling, other main9 branches and exit9/type14 control remain incomplete'],session_closed=True,original_execution=0,VM_actions=0,official_sessions=0,phase_complete=False,full_goal_complete=False,goal_status='active')
 write(A/'source-check.json',out);print(json.dumps({k:out[k]for k in ['records','new_records','new_operations','known_functions_after','new_original_bytes_verified','derived_instruction_bytes_verified','session_closed']}))
if __name__=='__main__':main()
