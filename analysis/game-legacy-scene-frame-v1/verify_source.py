#!/usr/bin/env python3
"""Verify fixed native source, retained composed evidence and exact byte mappings."""
from pathlib import Path
from collections import Counter
import hashlib,json,struct
R=Path(__file__).resolve().parents[2];A=Path(__file__).resolve().parent;P=R/'build/analysis/game-legacy-scene-frame-v1'
SHA='37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd';PROFILE='7810ea9437da59780820ec6fedb47ce47390841a95d527ddb6c3b3700fe180cb'
def info(p):
 b=p.read_bytes();return dict(path=str(p.relative_to(R)),bytes=len(b),sha256=hashlib.sha256(b).hexdigest())
def main():
 path=R/'build/analysis/game-release-current-v1/legacy-members/cg_se_6000.exe';raw=path.read_bytes();assert hashlib.sha256(raw).hexdigest()==SHA
 pe=struct.unpack_from('<I',raw,60)[0];base=struct.unpack_from('<I',raw,pe+52)[0];at=pe+24+struct.unpack_from('<H',raw,pe+20)[0];sections=[struct.unpack_from('<4I',raw,at+i*40+8)[1:] for i in range(struct.unpack_from('<H',raw,pe+6)[0])]
 def locate(address,n=1):
  rva=int(address,16)-base;found=[offset+rva-start for start,size,offset in sections if start<=rva and rva+n<=start+size];assert len(found)==1;return found[0]
 records=json.loads((P/'rea-final.json').read_text())['records'];previous=json.loads((R/'build/analysis/game-legacy-frame-v1/rea-final.json').read_text())['records'];old={e['evidence_id']:e for e in previous};now={e['evidence_id']:e for e in records};assert len(old)==744 and all(now[k]==v for k,v in old.items())
 new=[e for e in records if e['evidence_id'] not in old];checks=[];functions=[];reads={}
 for e in new:
  assert e['subject']['digest']['sha256']==SHA and e['provider']['id']=='ghidra' and e['provider']['version']=='12.1.4' and e['analysis_profile']['digest']==PROFILE
  op=e['operation'];n=e['normalized_result']
  if op in ['read_bytes','inspect_native_instruction']:
   if op=='read_bytes':assert n['complete'] and n['requested_bytes']==n['returned_bytes'];reads[n['address']]=n['bytes_hex']
   else:assert n['status']=='decoded'
   b=bytes.fromhex(n['bytes_hex'] if op=='read_bytes' else n['bytes']);offset=locate(n['address'],len(b));assert raw[offset:offset+len(b)]==b;checks.append(dict(id=e['evidence_id'],operation=op,address=n['address'],offset=offset,bytes=len(b),sha256=hashlib.sha256(b).hexdigest(),matched=True))
  elif op=='address_to_file_offset':assert n['file_offset']==locate(n['address']);checks.append(dict(id=e['evidence_id'],operation=op,address=n['address'],offset=n['file_offset'],matched=True))
  elif op=='analyze_function':functions.append(dict(id=e['evidence_id'],entry=n['procedure']['address'],body=n['procedure']['body'],value_flow_truncated=bool((n.get('native_value_flow') or {}).get('truncated'))))
 ops=dict(Counter(e['operation'] for e in new));assert len(records)==783 and len(new)==39 and ops==dict(analyze_function=14,inspect_native_instruction=13,xrefs=5,read_bytes=3,address_to_file_offset=3,resolve_containing_procedure=1)
 assert len(functions)==14 and len({x['entry'] for x in functions})==14 and len(checks)==19
 assert len(bytes.fromhex(reads['0x463240']))==278
 assert bytes.fromhex(reads['0x53d948']).split(b'\0')[0]==b'bin\\PUK2\\cutdat\\%d.cut' and bytes.fromhex(reads['0x53d974']).split(b'\0')[0]==b'bin\\PUK2\\cutdat\\%d.aut'
 contract=json.loads((A/'implementation-spec.json').read_text());assert contract['source']==info(path) and contract['functions']==functions
 for ref in contract['reused_functions']:
  e=old[ref['id']];assert e['normalized_result']['procedure']['address']==ref['entry'] and e['subject']['digest']['sha256']==SHA
 c=json.loads((A/'scene-frame-catalog.json').read_text());assert c['cut']['file_record_bytes']==18 and c['cut']['runtime_record_bytes']==20 and c['cut']['header_bytes']==12 and c['cut']['capacity']==50000
 assert c['window']['offsets']==[-30,-20,21,31] and c['queues']['tail_kind']==3 and c['queues']['merged_capacity']==3072 and c['ground']['ordinary_cull_exclusive']==[-33,-25,672,504] and c['ground']['atlas_cull_exclusive']==[-65,-49,672,504]
 assert json.loads((P/'session-closed.json').read_text())==dict(open=False,cleanup_pending=False)
 result=dict(schema='moli.legacy-scene-frame-source-stage162.v1',source=info(path),tools=dict(rea='6.7.0',ghidra='12.1.4',analysis_profile=PROFILE),artifacts=[info(P/'rea-final.json'),info(P/'rea-snapshot.json')],restored_records=744,total_records=783,new_records=39,new_operations=ops,
  function_dossiers=14,unique_function_entries=14,functions=functions,byte_and_mapping_checks=checks,reused_functions=contract['reused_functions'],session_closed=True,target_execution=False,real_credentials_or_sessions=False,
  corrections=['CUT file records18B,not20B;20B isruntime stride,confirmedactual341file corpusindependently.','507200 isalreadyretained undefined comparator;no newdossier was requested. Initial local lookupforfunction507200 returnedno match;read retained506030 consumerinstead.','AUT rawcolours feedminimap463780/4636a0,not scenetile lookup;remainseparate source/UI gap.','463780 recovered signature distortedbylarge stack probe;no guessed compile/reimplementationofitsminimapfile/path control.','Source renderwindowisx[-30,+21),y[-20,+31),sharedwithcollisionwindow;cut-ground cullnegativebounds areinteger-inclusive -64/-48 andordinary -32/-24.'],
  limitations=contract['remaining'],goal_status='active',full_goal_complete=False)
 (A/'source-check.json').write_text(json.dumps(result,indent=2)+'\n');print(json.dumps(dict(new=39,dossiers=14,unique=14,checks=19,reused=len(contract['reused_functions']))))
if __name__=='__main__':main()
