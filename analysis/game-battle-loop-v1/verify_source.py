"""Verify retained REA records and original PE file mappings, never execute the target."""
from pathlib import Path
import collections,hashlib,json,struct
R=Path(__file__).resolve().parents[2];A=Path(__file__).resolve().parent;P=R/'build/analysis/game-battle-loop-v1'
def read(p):return json.loads(p.read_text())
def write(p,v):p.write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n')
def info(p):
 h=hashlib.sha256()
 with p.open('rb')as f:
  for b in iter(lambda:f.read(1048576),b''):h.update(b)
 return dict(path=str(p.relative_to(R)),bytes=p.stat().st_size,sha256=h.hexdigest())
def main():
 source=R/'build/analysis/game-release-current-v1/legacy-members/cg_se_6000.exe';raw=source.read_bytes();assert len(raw)==1569280 and info(source)['sha256']=='37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd'
 previous=read(R/'build/analysis/game-battle-input-v1/rea-final.json');current=read(P/'rea-final.json');old={r['evidence_id']:r for r in previous['records']};records={r['evidence_id']:r for r in current['records']};assert len(old)==2074 and len(records)==2088 and all(records[k]==v for k,v in old.items())
 new=[r for k,r in records.items()if k not in old];counts=collections.Counter(r['operation']for r in new)
 before=read(P/'functions-before.json');after=dict(before);functions=[];known=[]
 for r in new:
  assert r['subject']['digest']['sha256']==info(source)['sha256']
  if r['operation']!='analyze_function':continue
  n=r['normalized_result'];address=n['procedure']['address'];p=P/(address[2:]+'-'+r['evidence_id'][3:11]+'.json');write(p,r)
  row=dict(address=address,evidence_id=r['evidence_id'],body=n['procedure']['body'],dossier=info(p))
  if address in before:known.append(row)
  else:after[address]={'id':r['evidence_id'],**{k:n[k]for k in ['procedure','pseudocode','assembly','callees','callers']}};functions.append(row)
 assert len(before)==639 and len(after)==642 and len(functions)==3;write(P/'functions-complete.json',after)
 pe=struct.unpack_from('<I',raw,60)[0];base=struct.unpack_from('<I',raw,pe+52)[0];start=pe+24+struct.unpack_from('<H',raw,pe+20)[0];sections=[struct.unpack_from('<4I',raw,start+40*i+8)for i in range(struct.unpack_from('<H',raw,pe+6)[0])]
 def offset(address):
  rva=int(address,16)-base
  for vs,va,rs,rp in sections:
   if va<=rva<va+min(vs,rs):return rp+rva-va
  raise AssertionError(address)
 checks=[]
 for address,size in [('0x440570',43),('0x5029f0',2320),('0x44f3e0',1159),('0x439c80',11),('0x501a50',3171),('0x437b30',3400)]:
  r=next(r for r in records.values()if r['operation']=='read_bytes'and r['normalized_result']['address']==address and r['normalized_result']['requested_bytes']==size);n=r['normalized_result'];b=bytes.fromhex(n['bytes_hex']);at=offset(address);m=next(r for r in records.values()if r['operation']=='address_to_file_offset'and r['normalized_result']['address']==address)
  assert n['complete']and len(b)==n['returned_bytes']==size and raw[at:at+size]==b and m['normalized_result']['file_offset']==at
  checks.append(dict(address=address,bytes=size,file_offset=at,sha256=hashlib.sha256(b).hexdigest(),read_evidence=r['evidence_id'],mapping_evidence=m['evidence_id'],retained_read_reused=r['evidence_id']in old,original_bytes_equal=True))
 assert sum(r['bytes']for r in checks)==10104
 closed=read(P/'session-closed.json')['result'];assert closed['evidence_records']==2088 and read(P/'final-session-status.json')==dict(open=False,cleanup_pending=False)
 out=dict(schema='moli.battle-loop-source-stage187.v1',source=info(source),tool='REA6.7.0/Ghidra12.1.4',analysis_profile=next(iter(records.values()))['analysis_profile']['digest'],records=len(records),new_records=len(new),new_operations=dict(counts),known_functions_before=639,known_functions_after=642,new_functions=functions,known_function_queries=known,byte_checks=checks,original_bytes_verified=10104,new_read_record_bytes=sum(r['normalized_result']['returned_bytes']for r in new if r['operation']=='read_bytes'),retained_derived_callbacks=[info(R/'build/analysis/game-battle-runtime-v1/derived-callbacks.json'),info(R/'build/analysis/game-battle-runtime-v1/derived-byte-checks.json')],retained_source_contracts=info(A/'implementation-spec.json'),artifacts=[info(P/n)for n in ['rea-final.json','rea.snapshot.json','functions-complete.json','session-closed.json','final-session-status.json']],session_closed=True,original_execution=0,VM_actions=0,official_sessions=0,phase_complete=False,full_goal_complete=False,goal_status='active')
 write(A/'source-check.json',out);print(json.dumps({k:out[k]for k in ['records','new_records','new_operations','known_functions_after','original_bytes_verified','new_read_record_bytes','session_closed']}))
if __name__=='__main__':main()
