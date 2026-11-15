#!/usr/bin/env python3
"""Recheck source identity, retained dossiers and original PE ranges; no target execution."""
from pathlib import Path
from datetime import datetime, timezone
import collections, hashlib, json
R=Path(__file__).resolve().parents[2];A=R/'analysis/game-party-follow-v1';P=R/'build/analysis/game-party-follow-v1'
def put(p,x):p.write_text(json.dumps(x,ensure_ascii=False,indent=2)+'\n')
def info(p):
 b=p.read_bytes();return dict(path=str(p.relative_to(R)),bytes=len(b),sha256=hashlib.sha256(b).hexdigest())
def main():
 source=R/'build/analysis/game-release-current-v1/legacy-members/cg_se_6000.exe';raw=source.read_bytes();s=info(source)
 assert s['bytes']==1569280 and s['sha256']=='37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd'
 current=json.load(open(P/'rea-source.json'));prior=json.load(open(R/'build/analysis/game-actor-vitals-v1/rea-source.json'))
 records={r['evidence_id']:r for r in current['records']};old={r['evidence_id']:r for r in prior['records']};assert len(records)==1611 and len(old)==1580 and all(records[k]==v for k,v in old.items())
 new=[r for k,r in records.items()if k not in old];ops=collections.Counter(r['operation']for r in new)
 assert ops==dict(analyze_function=13,xrefs=2,resolve_containing_procedure=7,read_bytes=3,address_to_file_offset=6)
 compact=json.load(open(P/'functions-before.json'));assert len(compact)==510;fresh=[];known=[]
 for r in new:
  assert r['analysis_profile']['digest']=='7810ea9437da59780820ec6fedb47ce47390841a95d527ddb6c3b3700fe180cb'
  if r['operation']!='analyze_function':continue
  n=r['normalized_result'];a=n['procedure']['address'];p=P/(a[2:]+'-new.json');put(p,r)
  value=dict(id=r['evidence_id'],**{k:n[k]for k in['procedure','pseudocode','assembly','callees','callers']})
  if a in compact:
   # A reviewed duplicate producer call is retained, never counted as a new canonical procedure.
   previous=compact[a];assert all(value[k]==previous[k]for k in ['procedure','pseudocode','assembly','callees','callers'])
   known.append(dict(address=a,evidence_id=r['evidence_id'],prior_id=previous['id'],facets_equal=True,dossier=info(p)))
  else:compact[a]=value;fresh.append(dict(address=a,evidence_id=r['evidence_id'],body=n['procedure']['body'],dossier=info(p)))
 assert len(compact)==522 and len(known)==1 and len(fresh)==12;put(P/'functions-complete.json',compact)
 reused=[]
 for a in ['0x460c40','0x460f20','0x461500','0x461550','0x461660','0x4618a0','0x4618f0','0x461f40','0x43c1b0','0x43c360','0x43c6b0','0x43cd00','0x4f07d0','0x500500','0x4ff080','0x4ff5a0','0x43ce90','0x43ce20','0x4ffb90','0x4ffbd0','0x4ffbe0','0x439a70','0x461370']:
  r=old[compact[a]['id']];p=P/(a[2:]+'-retained.json');put(p,r);reused.append(dict(address=a,evidence_id=r['evidence_id'],dossier=info(p)))
 maps={r['normalized_result']['address']:r for r in records.values()if r['operation']=='address_to_file_offset'};checks=[]
 for r in new:
  if r['operation']!='read_bytes':continue
  n=r['normalized_result'];a=n['address'];b=bytes.fromhex(n['bytes_hex']);end=hex(int(a,16)+len(b)-1);lo,hi=maps[a],maps[end];offset=lo['normalized_result']['file_offset']
  assert n['complete']and len(b)==n['requested_bytes']==n['returned_bytes']and hi['normalized_result']['file_offset']==offset+len(b)-1 and raw[offset:offset+len(b)]==b
  checks.append(dict(address=a,end=end,bytes=len(b),file_offset=offset,sha256=hashlib.sha256(b).hexdigest(),evidence_id=r['evidence_id'],start_map_id=lo['evidence_id'],end_map_id=hi['evidence_id'],original_bytes_equal=True))
 assert len(checks)==3 and sum(r['bytes']for r in checks)==1193
 closed=json.load(open(P/'session-closed.json'))['result'];assert closed['evidence_records']==1611 and closed['bytes']==386815720
 final=json.load(open(P/'final-session-status.json'));assert final['open']is False and final['cleanup_pending']is False and final['server_identity']['package']['version']=='6.7.0'
 spec=json.load(open(A/'implementation-spec.json'))
 put(A/'source-check.json',dict(schema='moli.party-follow-source-stage178.v1',source=s,tool=spec['tool'],analysis_profile=spec['analysis_profile'],classification='immutable static observations; independent ordinary reconstruction; no original execution',records=len(records),new_records=len(new),new_operations=dict(ops),known_functions_before=510,known_functions_after=522,new_functions=fresh,known_function_queries=known,reused_dossiers=reused,byte_checks=checks,source_facts=spec['facts'],unknowns=spec['unknowns'],artifacts=[info(P/n)for n in ['rea-source.json','rea-snapshot.json','functions-complete.json','session-closed.json','final-session-status.json']],session_closed=True,VM_actions=0,original_target_execution=0,official_sessions=0,recorded_utc=datetime.now(timezone.utc).isoformat()))
 print(json.dumps(dict(records=1611,new_records=31,new_functions=12,known_queries=1,reused=23,code_bytes=1193,source_equal=True,closed=True)))
if __name__=='__main__':main()
