#!/usr/bin/env python3
"""Bind immutable REA facts and independent COFF bytes; no original execution."""
from pathlib import Path
from datetime import datetime,timezone
import collections,hashlib,json,struct,re
R=Path(__file__).resolve().parents[2];A=R/'analysis/game-battle-transition-v1';P=R/'build/analysis/game-battle-transition-v1'
def info(p):
 h=hashlib.sha256()
 with p.open('rb')as f:
  for b in iter(lambda:f.read(1048576),b''):h.update(b)
 return dict(path=str(p.relative_to(R)),bytes=p.stat().st_size,sha256=h.hexdigest())
def put(p,v):p.write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n')
def main():
 raw=(R/'build/analysis/game-release-current-v1/legacy-members/cg_se_6000.exe').read_bytes();assert len(raw)==1569280 and hashlib.sha256(raw).hexdigest()=='37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd'
 current=json.load(open(P/'rea-final.json'));old=json.load(open(R/'build/analysis/game-party-actions-v1/rea-final.json'));records={r['evidence_id']:r for r in current['records']};prior={r['evidence_id']:r for r in old['records']};assert all(records[k]==v for k,v in prior.items());new=[r for k,r in records.items()if k not in prior];assert len(prior)==1625 and len(records)==1681 and len(new)==56
 counts=collections.Counter(r['operation']for r in new);assert counts==dict(analyze_function=28,inspect_analysis_view=1,xrefs=3,address_to_file_offset=15,read_bytes=8,resolve_containing_procedure=1)
 spec=json.load(open(A/'implementation-spec.json'));f=json.load(open(P/'functions-before.json'));assert len(f)==523;functions=[]
 for r in new:
  if r['operation']=='inspect_analysis_view':assert r['analysis_profile']is None;continue
  assert r['subject']['digest']['sha256']==spec['source_sha256']and r['analysis_profile']['digest']==spec['analysis_profile']
  if r['operation']=='analyze_function':
   n=r['normalized_result'];a=n['procedure']['address'];assert a not in f;f[a]=dict(id=r['evidence_id'],**{k:n[k]for k in['procedure','pseudocode','assembly','callees','callers']});q=P/(a[2:]+'-new.json');put(q,r);functions.append(dict(address=a,evidence_id=r['evidence_id'],body=n['procedure']['body'],native_value_flow_truncated=bool(n.get('native_value_flow',{}).get('truncated')),dossier=info(q)))
 assert len(f)==551;put(P/'functions-complete.json',f)
 pe=struct.unpack_from('<I',raw,60)[0];image=struct.unpack_from('<I',raw,pe+52)[0];count=struct.unpack_from('<H',raw,pe+6)[0];at=pe+24+struct.unpack_from('<H',raw,pe+20)[0];sections=[struct.unpack_from('<4I',raw,at+i*40+8)for i in range(count)]
 def mapping(address):
  rva=int(address,16)-image
  for vs,va,rs,rp in sections:
   if va<=rva<va+vs:return rp+rva-va if rva-va<rs else None
  raise AssertionError(address)
 maps={r['normalized_result']['address']:r for r in records.values()if r['operation']=='address_to_file_offset'};checks=[]
 for r in new:
  if r['operation']!='read_bytes':continue
  n=r['normalized_result'];b=bytes.fromhex(n['bytes_hex']);assert n['complete']and len(b)==n['returned_bytes']==n['requested_bytes'];lo=mapping(n['address']);end=hex(int(n['address'],16)+len(b)-1);assert maps[n['address']]['normalized_result']['file_offset']==lo and maps[end]['normalized_result']['file_offset']==lo+len(b)-1 and raw[lo:lo+len(b)]==b;checks.append(dict(address=n['address'],end=end,bytes=len(b),file_offset=lo,evidence_id=r['evidence_id'],sha256=hashlib.sha256(b).hexdigest(),original_bytes_equal=True))
 assert len(checks)==8 and sum(r['bytes']for r in checks)==5946
 zero_addresses=['0x599dc8','0x599dcc','0x599d28','0x599c9c','0x599ca0','0x599d5c','0x599ce4','0x599c98','0x599d2c','0x598b94','0x598b6c','0x593b4c','0x598b90'];assert all(mapping(a)is None for a in zero_addresses)
 tables=json.load(open(A/'source-tables.json'));n=next(r['normalized_result']for r in new if r['operation']=='read_bytes'and r['normalized_result']['address']=='0x5337b0');b=bytes.fromhex(n['bytes_hex']);assert tables['mapping']==list(struct.unpack_from('<22i',b))and tables['positions']==[list(struct.unpack_from('<4i',b,88+16*i))for i in range(22)]
 layout=[dict(slot=i,entry=tables['positions'][j][:2],target=tables['positions'][j][2:])for i,j in enumerate(tables['mapping'])];expected='/** Source-bound numeric battle slot layout; no assets or executable code. */\nexport const LEGACY_GAME_BATTLE_SLOT_LAYOUT=Object.freeze('+json.dumps(layout,separators=(',',':'))+'.map(r=>Object.freeze({...r,entry:Object.freeze(r.entry),target:Object.freeze(r.target)})));\n';assert(R/'shared/legacy-game-battle-data.mjs').read_text()==expected
 dis=(P/'4365d0-llvm-disassembly.txt').read_text();rows=[]
 for line in dis.splitlines():
  m=re.match(r'^\s*([0-9a-f]+):\s+((?:[0-9a-f]{2}\s+)+)\s*\S',line)
  if m:rows.append((int(m[1],16),bytes.fromhex(m[2])))
 assert rows[0][0]==0x4365d0 and rows[-1][0]+len(rows[-1][1])==0x436ce0
 for i,(address,b)in enumerate(rows):
  off=mapping(hex(address));assert raw[off:off+len(b)]==b
  if i:assert rows[i-1][0]+len(rows[i-1][1])==address
 assert sum(len(b)for _,b in rows)==1808 and any(r['operation']=='resolve_containing_procedure'and r['normalized_result']['query_address']=='0x4365d0'and not r['normalized_result']['found']for r in new)
 reused=[]
 for q in sorted(P.glob('*-retained.json')):
  if not re.fullmatch('[0-9a-f]+-retained.json',q.name):continue
  r=json.load(open(q));assert prior[r['evidence_id']]==r;reused.append(dict(evidence_id=r['evidence_id'],dossier=info(q)))
 assert len(reused)==18
 closed=json.load(open(P/'session-closed.json'))['structuredContent']['result'];status=json.load(open(P/'final-session-status.json'));assert closed['evidence_records']==1681 and closed['bytes']==451623812 and status['open']is False and status['cleanup_pending']is False
 cat=json.load(open(R/'analysis/game-legacy-message-v1/dispatch-catalog.json'));dispatch=[r for r in cat['incoming']if r['consumer']in['0x4f3430','0x4f36d0']];assert {r['tag']for r in dispatch}=={'>HY','?+e'}
 put(A/'source-check.json',dict(schema='moli.battle-transition-source-stage180.v1',source=info(R/'build/analysis/game-release-current-v1/legacy-members/cg_se_6000.exe'),tool=spec['tool'],analysis_profile=spec['analysis_profile'],records=1681,new_records=56,new_operations=dict(counts),known_functions_before=523,known_functions_after=551,new_functions=functions,reused_dossiers=reused,known_function_queries=[],byte_checks=checks,source_tables=info(A/'source-tables.json'),derived_loader_initial_zero=zero_addresses,raw_command_callback=dict(address='0x4365d0',provider_function=False,bytes=1808,instructions_byte_checked=len(rows),noncall_CFG_complete=False,disassembly=info(P/'4365d0-llvm-disassembly.txt')),large_callback=dict(address='0x40a120',retained_evidence_id='ev_70efb29a0b4a5b337df04eaac9f5c862b61d5d466120b1c824502b364f74f038',transport_response_complete=False,retained_dossier_complete=True,native_value_flow_truncated=True,pseudocode_and_assembly_available=True),dispatch=dispatch,facts=spec['facts'],unknowns=spec['unknowns'],artifacts=[info(P/n)for n in['rea-final.json','rea-snapshot.json','functions-complete.json','session-closed.json','final-session-status.json','callback-transport-constraint.json']],session_closed=True,VM_actions=0,original_execution=0,official_sessions=0,phase_complete=False,goal_status='active',full_goal_complete=False,recorded_utc=datetime.now(timezone.utc).isoformat()))
 print(json.dumps(dict(records=1681,new_records=56,new_functions=28,reused=18,source_bytes_verified=5946,raw_callback_bytes=1808,closed=True,phase_complete=False)))
if __name__=='__main__':main()
