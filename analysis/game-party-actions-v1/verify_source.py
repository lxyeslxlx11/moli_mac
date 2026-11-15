#!/usr/bin/env python3
"""Immutable dossier/PE verification; source zero-fill and file bytes are kept distinct."""
from pathlib import Path
from datetime import datetime,timezone
import collections,hashlib,json,struct
R=Path(__file__).resolve().parents[2];A=R/'analysis/game-party-actions-v1';P=R/'build/analysis/game-party-actions-v1'
def put(p,x):p.write_text(json.dumps(x,ensure_ascii=False,indent=2)+'\n')
def info(p):
 b=p.read_bytes();return dict(path=str(p.relative_to(R)),bytes=len(b),sha256=hashlib.sha256(b).hexdigest())
def main():
 original=R/'build/analysis/game-release-current-v1/legacy-members/cg_se_6000.exe';raw=original.read_bytes();source=info(original);assert source['bytes']==1569280 and source['sha256']=='37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd'
 current=json.load(open(P/'rea-final.json'));prior=json.load(open(R/'build/analysis/game-party-follow-v1/rea-source.json'));records={r['evidence_id']:r for r in current['records']};old={r['evidence_id']:r for r in prior['records']};assert len(records)==1625 and len(old)==1611 and all(records[k]==v for k,v in old.items())
 new=[r for k,r in records.items()if k not in old];ops=collections.Counter(r['operation']for r in new);assert ops==dict(analyze_function=1,read_bytes=5,address_to_file_offset=8)
 spec=json.load(open(A/'implementation-spec.json'));assert all(r['analysis_profile']['digest']==spec['analysis_profile']for r in new)
 f=json.load(open(P/'functions-before.json'));assert len(f)==522;new_functions=[]
 for r in new:
  if r['operation']!='analyze_function':continue
  n=r['normalized_result'];a=n['procedure']['address'];assert a not in f;f[a]=dict(id=r['evidence_id'],**{k:n[k]for k in ['procedure','pseudocode','assembly','callees','callers']});p=P/(a[2:]+'-new.json');put(p,r);new_functions.append(dict(address=a,evidence_id=r['evidence_id'],body=n['procedure']['body'],dossier=info(p)))
 assert len(f)==523;put(P/'functions-complete.json',f)
 reused=[]
 for p in sorted(P.glob('*-retained.json')):
  r=json.load(open(p));assert old[r['evidence_id']]==r;reused.append(dict(evidence_id=r['evidence_id'],dossier=info(p)))
 assert len(reused)==28
 pe=struct.unpack_from('<I',raw,0x3c)[0];count=struct.unpack_from('<H',raw,pe+6)[0];size=struct.unpack_from('<H',raw,pe+20)[0];image=struct.unpack_from('<I',raw,pe+24+28)[0];sections=[]
 for i in range(count):
  at=pe+24+size+i*40;vs,va,rs,rp=struct.unpack_from('<4I',raw,at+8);sections.append(dict(name=raw[at:at+8].rstrip(b'\0').decode(),virtual_address=va,virtual_size=vs,raw_size=rs,raw_pointer=rp))
 def pe_mapping(address):
  rva=int(address,16)-image;s=next(s for s in sections if s['virtual_address']<=rva<s['virtual_address']+s['virtual_size']);relative=rva-s['virtual_address'];return s['raw_pointer']+relative if relative<s['raw_size']else None,s
 maps={r['normalized_result']['address']:r for r in records.values()if r['operation']=='address_to_file_offset'};checks=[];zero=None
 for r in new:
  if r['operation']!='read_bytes':continue
  n=r['normalized_result'];b=bytes.fromhex(n['bytes_hex']);assert n['complete']and len(b)==n['requested_bytes']==n['returned_bytes'];offset,section=pe_mapping(n['address'])
  if offset is None:
   assert n['address']=='0x614884'and b==bytes(4);zero=dict(address=n['address'],bytes=4,evidence_id=r['evidence_id'],analysis_memory_zero=True,original_file_mapping=False,section=section,derived_loader_initial_zero=True);continue
  end=hex(int(n['address'],16)+len(b)-1);lo,hi=maps[n['address']],maps[end];assert lo['normalized_result']['file_offset']==offset and hi['normalized_result']['file_offset']==offset+len(b)-1 and raw[offset:offset+len(b)]==b
  checks.append(dict(address=n['address'],end=end,bytes=len(b),file_offset=offset,sha256=hashlib.sha256(b).hexdigest(),evidence_id=r['evidence_id'],start_map_id=lo['evidence_id'],end_map_id=hi['evidence_id'],original_bytes_equal=True))
 assert len(checks)==4 and sum(c['bytes']for c in checks)==1031 and zero
 direction=json.load(open(P/'retained-range-53d4d4.json'));assert old[direction['evidence_id']]==direction;n=direction['normalized_result'];offset,_=pe_mapping(n['address']);b=bytes.fromhex(n['bytes_hex']);assert len(b)==32 and raw[offset:offset+32]==b;directions=list(struct.iter_unpack('<hh',b));assert directions==[(0,-1),(1,-1),(1,0),(1,1),(0,1),(-1,1),(-1,0),(-1,-1)]
 final=json.load(open(P/'final-session-status.json'));closed=json.load(open(P/'session-closed.json'))['structuredContent']['result'];assert final['open']is False and final['cleanup_pending']is False and final['server_identity']['package']['version']=='6.7.0'and closed['evidence_records']==1625 and closed['bytes']==387120057
 cat=json.load(open(R/'analysis/game-legacy-message-v1/dispatch-catalog.json'));incoming=next(r for r in cat['incoming']if r['consumer']=='0x4f3310');outgoing=[r for r in cat['outgoing']if r['producer']in ['0x4f77d0','0x4f8340']];assert incoming['tag']=='Kk0'and incoming['fields']==['int32','int32']and {r['tag']for r in outgoing}=={'*Cc','/Re'}and all(r['fields']==['int32']*3 for r in outgoing)
 put(A/'source-check.json',dict(schema='moli.party-actions-source-stage179.v1',source=source,tool=spec['tool'],analysis_profile=spec['analysis_profile'],classification='immutable static source observations and independent ordinary reconstruction; no original execution',records=len(records),new_records=len(new),new_operations=dict(ops),known_functions_before=522,known_functions_after=523,new_functions=new_functions,known_function_queries=[],reused_dossiers=reused,byte_checks=checks,direction_table=dict(evidence_id=direction['evidence_id'],address=n['address'],file_offset=offset,bytes=32,source_equal=True,mapping_provenance='independent original PE section headers',directions=directions),shortcut_timer_initializer=zero,dispatch=dict(incoming=incoming,outgoing=outgoing),source_facts=spec['facts'],unknowns=spec['unknowns'],artifacts=[info(P/n)for n in ['rea-final.json','rea-snapshot.json','functions-complete.json','session-closed.json','final-session-status.json','unmapped-timer-address.json']],session_closed=True,VM_actions=0,original_target_execution=0,official_sessions=0,recorded_utc=datetime.now(timezone.utc).isoformat()))
 print(json.dumps(dict(records=1625,new_records=14,new_functions=1,reused=28,code_bytes=1031,reused_data_bytes=32,zero_fill_separate=True,source_equal=True,closed=True)))
if __name__=='__main__':main()
