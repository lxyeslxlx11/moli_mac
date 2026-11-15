#!/usr/bin/env python3
"""Verify fixed native source,retained analysis andbounded comparator/callback bytes."""
from pathlib import Path
from collections import Counter
import hashlib,json,struct,re
R=Path(__file__).resolve().parents[2];A=Path(__file__).resolve().parent;P=R/'build/analysis/game-legacy-animation-v1'
SHA='37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd';PROFILE='7810ea9437da59780820ec6fedb47ce47390841a95d527ddb6c3b3700fe180cb'
def info(p):
 b=p.read_bytes();return dict(path=str(p.relative_to(R)),bytes=len(b),sha256=hashlib.sha256(b).hexdigest())
def main():
 path=R/'build/analysis/game-release-current-v1/legacy-members/cg_se_6000.exe';raw=path.read_bytes();assert hashlib.sha256(raw).hexdigest()==SHA
 pe=struct.unpack_from('<I',raw,60)[0];base=struct.unpack_from('<I',raw,pe+52)[0];at=pe+24+struct.unpack_from('<H',raw,pe+20)[0];sections=[struct.unpack_from('<4I',raw,at+i*40+8)[1:] for i in range(struct.unpack_from('<H',raw,pe+6)[0])]
 def locate(address,n=1):
  rva=int(address,16)-base;found=[offset+rva-start for start,size,offset in sections if start<=rva and rva+n<=start+size];assert len(found)==1;return found[0]
 records=json.loads((P/'rea-final.json').read_text())['records'];previous=json.loads((R/'build/analysis/game-legacy-render-v1/rea-final.json').read_text())['records'];old={e['evidence_id']:e for e in previous};now={e['evidence_id']:e for e in records};assert len(old)==658 and all(now[k]==v for k,v in old.items());new=[e for e in records if e['evidence_id'] not in old];checks=[];data=[];functions=[]
 for e in new:
  assert e['subject']['digest']['sha256']==SHA and e['provider']['id']=='ghidra' and e['provider']['version']=='12.1.4' and e['analysis_profile']['digest']==PROFILE
  op=e['operation'];n=e['normalized_result']
  if op=='inspect_native_instruction' and n['status']!='decoded':assert n['status']=='data';data.append(dict(id=e['evidence_id'],address=n['address'],status=n['status']));continue
  if op in ['read_bytes','inspect_native_instruction']:
   if op=='read_bytes':assert n['complete'] and n['requested_bytes']==n['returned_bytes']
   b=bytes.fromhex(n['bytes_hex'] if op=='read_bytes' else n['bytes']);off=locate(n['address'],len(b));assert raw[off:off+len(b)]==b;checks.append(dict(id=e['evidence_id'],operation=op,address=n['address'],offset=off,bytes=len(b),sha256=hashlib.sha256(b).hexdigest(),matched=True))
  elif op=='address_to_file_offset':assert n['file_offset']==locate(n['address']);checks.append(dict(id=e['evidence_id'],operation=op,address=n['address'],offset=n['file_offset'],matched=True))
  elif op=='analyze_function':functions.append(dict(id=e['evidence_id'],entry=n['procedure']['address'],query=e['parameters']['procedure'],body=n['procedure']['body'],value_flow_truncated=bool((n.get('native_value_flow') or {}).get('truncated'))))
 ops=dict(Counter(e['operation'] for e in new));assert len(records)==713 and len(new)==55 and ops==dict(analyze_function=20,inspect_native_instruction=28,resolve_containing_procedure=5,read_bytes=1,address_to_file_offset=1)
 assert len(functions)==20 and len({x['entry'] for x in functions})==19 and len(checks)==26 and len(data)==4
 comparator=next(e for e in new if e['operation']=='read_bytes')['normalized_result'];assert comparator['address']=='0x4531c0' and comparator['returned_bytes']==32 and comparator['bytes_hex']=='8b4424048b4c24088b008b093bc8760483c8ffc31bc0f7d8c390909090909090'
 callback=R/'build/analysis/game-legacy-actors-v1/callback-objdump.txt';prior_callback=json.loads((R/'analysis/game-legacy-actors-v1/source-check.json').read_text())['callback'];assert info(callback)=={k:prior_callback[k] for k in ['path','bytes','sha256']};ranges=[]
 for line in callback.read_text().splitlines():
  m=re.match(r'^\s*([0-9a-f]+):\s*((?:[0-9a-f]{2}\s+)+)',line)
  if not m:continue
  address='0x'+m[1];b=bytes.fromhex(m[2]);off=locate(address,len(b));assert raw[off:off+len(b)]==b;ranges.append((int(address,16),len(b)))
 covered={a+i for a,n in ranges for i in range(n)};assert covered==set(range(0x43ba10,0x43c000))
 contract=json.loads((A/'implementation-spec.json').read_text());assert contract['functions']==functions and contract['source']==info(path) and contract['reused_callback']==info(callback)
 c=json.loads((A/'animation-catalog.json').read_text());assert c['index']['record_bytes']==12 and c['action']['extended_bytes']==20 and c['frame']['file_bytes']==10 and c['player']['last_action_offset']==0x2b4
 assert json.loads((P/'session-closed.json').read_text())==dict(open=False,cleanup_pending=False)
 result=dict(schema='moli.legacy-animation-source-stage160.v1',source=info(path),tools=dict(rea='6.7.0',ghidra='12.1.4',analysis_profile=PROFILE),artifacts=[info(P/'rea-final.json'),info(P/'rea-snapshot.json')],restored_records=658,total_records=713,new_records=55,new_operations=ops,functions=functions,function_dossiers=20,unique_function_entries=19,byte_and_mapping_checks=checks,data_observations=data,reused_callback=dict(**info(callback),byte_ranges_checked=len(ranges),unique_bytes_checked=len(covered)),reused_loader=contract['reused_loader'],session_closed=True,target_execution=False,real_credentials_or_sessions=False,corrections=['0x4fd4f0 interior query returned existing4fd0d0;20dossiers mean19unique entries,not20new functions.','4531c0 is undefined asprocedure;32B byte-verified bounded GNU comparator used,not a recovered function dossier.','453720/453cc0 recovered signatures are distorted by stack probe; exactfread12/20/10/8 andruntime stores checked fromretained assembly.','actor+2b4 iscached previous action; historical motion.phase naming isnot an animation frame/time index.','463120 routesordinary sprite through506d50,which addsimage origin andskips graphic indices<1000;source callbacksubtractsorigin beforequeue. Priority10 anddrawOffset are thereforeused forsingle-sprite ordinary composition.'],limitations=['Complete scene/ride/party/callback gates/repeat schedule,wire same-action restart andresource host binding remain incomplete.','Geometry provider must supplyactual decoded image dimensions,not unverified index width/height.','Named palette/other draw styles andaudio execution are notimplemented;metadata/events remainexplicit.','Full current version,auth/battle/remaining business,actual three-platform andofficial playable acceptance incomplete.'],goal_status='active',full_goal_complete=False)
 (A/'source-check.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n');print(json.dumps(dict(new=55,dossiers=20,unique=19,checks=26,data=4,callback_bytes=len(covered))))
if __name__=='__main__':main()
