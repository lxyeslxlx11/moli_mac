"""Verify source identity, retained REA records and PE mappings without execution."""
from pathlib import Path
import collections,hashlib,json,struct
R=Path(__file__).resolve().parents[2];A=Path(__file__).resolve().parent;P=R/'build/analysis/game-battle-exit-v1'
def read(p):return json.loads(p.read_text())
def write(p,v):p.write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n')
def info(p):
 h=hashlib.sha256()
 with p.open('rb')as f:
  for b in iter(lambda:f.read(1048576),b''):h.update(b)
 return dict(path=str(p.relative_to(R)),bytes=p.stat().st_size,sha256=h.hexdigest())
def main():
 source=R/'build/analysis/game-release-current-v1/legacy-members/cg_se_6000.exe';raw=source.read_bytes();assert len(raw)==1569280 and info(source)['sha256']=='37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd'
 old={r['evidence_id']:r for r in read(R/'build/analysis/game-battle-loop-v1/rea-final.json')['records']};records={r['evidence_id']:r for r in read(P/'rea-final.json')['records']};assert len(old)==2088 and len(records)==2115 and all(records[k]==v for k,v in old.items())
 new=[r for k,r in records.items()if k not in old];counts=collections.Counter(r['operation']for r in new);assert counts==dict(read_bytes=6,address_to_file_offset=12,analyze_function=8,xrefs=1)
 before=read(P/'functions-before.json');after=dict(before);functions=[];known=[];repeated=[]
 for r in new:
  assert r['subject']['digest']['sha256']==info(source)['sha256']
  if r['operation']!='analyze_function':continue
  n=r['normalized_result'];address=n['procedure']['address'];p=P/(address[2:]+'-'+r['evidence_id'][3:11]+'.json');write(p,r);row=dict(address=address,evidence_id=r['evidence_id'],body=n['procedure']['body'],limitations=n['limitations'],dossier=info(p))
  if address in before:known.append(row)
  elif address in after:repeated.append(row)
  else:after[address]={'id':r['evidence_id'],**{k:n[k]for k in ['procedure','pseudocode','assembly','callees','callers']}};functions.append(row)
 assert len(before)==642 and len(after)==648 and len(functions)==6 and len(known)==len(repeated)==1;write(P/'functions-complete.json',after)
 pe=struct.unpack_from('<I',raw,60)[0];base=struct.unpack_from('<I',raw,pe+52)[0];start=pe+24+struct.unpack_from('<H',raw,pe+20)[0];sections=[struct.unpack_from('<4I',raw,start+40*i+8)for i in range(struct.unpack_from('<H',raw,pe+6)[0])]
 def offset(address):
  rva=int(address,16)-base
  for vs,va,rs,rp in sections:
   if va<=rva<va+min(vs,rs):return rp+rva-va
  raise AssertionError(address)
 maps={r['normalized_result']['address']:r for r in records.values()if r['operation']=='address_to_file_offset'};checks=[]
 plan=read(P/'read-plan.json')+[dict(address=a,length=n)for a,n in [('0x5029f0',2320),('0x44ce40',278),('0x44ab50',70),('0x4f36d0',312),('0x4f3430',656),('0x437b30',2858)]]
 for row in plan:
  address=row['address'];size=row['length'];r=next(r for r in records.values()if r['operation']=='read_bytes'and r['normalized_result']['address']==address and r['normalized_result']['requested_bytes']==size);n=r['normalized_result'];b=bytes.fromhex(n['bytes_hex']);at=offset(address)
  assert n['complete']and len(b)==n['returned_bytes']==size and raw[at:at+size]==b and maps[address]['normalized_result']['file_offset']==at
  if 'end'in row:assert maps[row['end']]['normalized_result']['file_offset']==at+size-1
  checks.append(dict(address=address,bytes=size,file_offset=at,sha256=hashlib.sha256(b).hexdigest(),read_evidence=r['evidence_id'],mapping_evidence=maps[address]['evidence_id'],retained_read_reused=r['evidence_id']in old,original_bytes_equal=True))
 assert len(checks)==12 and sum(r['bytes']for r in checks)==7055
 x=next(r for r in new if r['operation']=='xrefs');closed=read(P/'session-closed.json')['result'];assert closed['evidence_records']==2115 and closed['bytes']==518538004 and read(P/'final-session-status.json')==dict(open=False,cleanup_pending=False)
 out=dict(schema='moli.battle-exit-source-stage188.v1',source=info(source),tool='REA6.7.0/Ghidra12.1.4',records=2115,new_records=27,new_operations=dict(counts),known_functions_before=642,known_functions_after=648,new_functions=functions,known_function_queries=known,repeated_new_canonical_queries=repeated,byte_checks=checks,original_bytes_verified=7055,new_read_record_bytes=561,mode_global_direct_references=dict(address='0xc5ec18',evidence_id=x['evidence_id'],observed=x['normalized_result'],indirect_writer_completeness=False),retained_derived_callbacks=[info(R/'build/analysis/game-battle-runtime-v1/derived-callbacks.json'),info(R/'build/analysis/game-battle-runtime-v1/derived-byte-checks.json')],source_contract=info(A/'implementation-spec.json'),artifacts=[info(P/n)for n in ['rea-final.json','rea.snapshot.json','functions-complete.json','session-closed.json','final-session-status.json']],source_limitations=['502810 terminal-call flow-model limitation retained; no whole-function/whole-program reachability claim','One second interior query resolved the same new502810 function; it is explicitly not counted twice','Native ordinary pool deprojection/numeric ownership and main9 rebuild, type14 control branch, CHT/BST side effects and native audio are incomplete'],session_closed=True,original_execution=0,VM_actions=0,official_sessions=0,phase_complete=False,full_goal_complete=False,goal_status='active')
 write(A/'source-check.json',out);print(json.dumps({k:out[k]for k in ['records','new_records','new_operations','known_functions_after','original_bytes_verified','new_read_record_bytes','session_closed']}))
if __name__=='__main__':main()
