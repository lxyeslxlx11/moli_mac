#!/usr/bin/env python3
"""Verify source-bound actor flag/category tables, range/dedup helpers and native bytes; no execution."""
from pathlib import Path
from collections import Counter
import hashlib,json,struct
R=Path(__file__).resolve().parents[2];A=Path(__file__).resolve().parent;P=R/'build/analysis/game-actor-context-v1'
def info(path):
 b=path.read_bytes();return dict(path=str(path.relative_to(R)),bytes=len(b),sha256=hashlib.sha256(b).hexdigest())
def main():
 spec=json.load(open(A/'implementation-spec.json'));raw=(R/spec['source']['path']).read_bytes();assert info(R/spec['source']['path'])==spec['source']
 pe=struct.unpack_from('<I',raw,60)[0];base=struct.unpack_from('<I',raw,pe+52)[0];start=pe+24+struct.unpack_from('<H',raw,pe+20)[0]
 sections=[struct.unpack_from('<4I',raw,start+i*40+8)[1:] for i in range(struct.unpack_from('<H',raw,pe+6)[0])]
 def locate(address,size=1):
  rva=int(address,16)-base;found=[off+rva-first for first,length,off in sections if first<=rva and rva+size<=first+length];assert len(found)==1;return found[0]
 before=json.load(open(R/'build/analysis/game-local-bootstrap-v1/rea-final.json'))['records'];records=json.load(open(P/'rea-final.json'))['records'];old={r['evidence_id']:r for r in before};after={r['evidence_id']:r for r in records}
 assert len(old)==1347 and len(after)==1426 and all(after[k]==v for k,v in old.items());new=[r for r in records if r['evidence_id']not in old];checks=[];data=[]
 for r in new:
  assert r['subject']['digest']['sha256']==spec['source']['sha256'] and r['analysis_profile']['digest']==spec['tools']['profile'] and r['provider']['version']=='12.1.4'
  n=r['normalized_result'];op=r['operation']
  if op in ['inspect_native_instruction','read_bytes']:
   if op=='read_bytes':assert n['complete'] and n['returned_bytes']==n['requested_bytes'];b=bytes.fromhex(n['bytes_hex'])
   else:
    if n['status']=='data':data.append(dict(id=r['evidence_id'],address=n['address'],incoming=n['incoming_references']));continue
    assert n['status']=='decoded';b=bytes.fromhex(n['bytes'])
   at=locate(n['address'],len(b));assert raw[at:at+len(b)]==b;checks.append(dict(id=r['evidence_id'],operation=op,address=n['address'],offset=at,bytes=len(b),sha256=hashlib.sha256(b).hexdigest(),matched=True))
  elif op=='address_to_file_offset':assert n['file_offset']==locate(n['address']);checks.append(dict(id=r['evidence_id'],operation=op,address=n['address'],offset=n['file_offset'],matched=True))
 assert len(new)==79 and len(checks)==74 and len(data)==1
 functions=[dict(entry=r['normalized_result']['procedure']['address'],id=r['evidence_id'],requested=r['parameters']['procedure'])for r in new if r['operation']=='analyze_function'];assert len(functions)==4
 reused=[dict(entry=r['normalized_result']['procedure']['address'],id=r['evidence_id'])for r in [json.load(open(q))for q in sorted(P.glob('*-retained.json'))]];assert len(reused)==28
 for r in reused:assert old[r['id']]['normalized_result']['procedure']['address']==r['entry']
 f={r['normalized_result']['procedure']['address']:r['normalized_result']for r in records if r['operation']=='analyze_function'}
 for ad,parts in [('0x440850',['DAT_0059a2dc = 0']),('0x440860',['DAT_0059a2dc < 100','piVar1[-1] == param_1','*piVar1 == param_2','piVar1[1] == param_3']),('0x4fdb40',['99999 < param_1','param_1 < 200000']),('0x403580',['return param_1 < iVar1']),('0x403490',['return iVar1 - param_1']),('0x403440',['return iVar1 + param_1']),('0x4033e0',['return iVar1 < param_1']),('0x501a50',['FUN_00440850','FUN_00409fe0']),('0x43f380',['FUN_004401b0(param_13)','FUN_00440180(param_13)','uVar5 | 0x400000','param_9 & 0x100','param_9 & 0x40']),('0x43fcd0',['= 0x400','+ 0x24) | 0x400'])]:assert all(x in f[ad]['pseudocode']for x in parts),ad
 assert '0x4f19f8: PUSH ESI'in f['0x4f16d0']['assembly'] and '0x4f1a0c: ADD ESP, 0x4'in f['0x4f16d0']['assembly'] and '0x4f1baa: MOV ECX, dword ptr [ESP + 0x20]'in f['0x4f16d0']['assembly']
 # Native branch has13 argument pushes plus the still-pending normalization argument; param13 is saved column1, not mode15.
 assert '0x4f1779: PUSH 0x1'in f['0x4f16d0']['assembly'] and '0x4f178a: MOV dword ptr [ESP + 0x28], EAX'in f['0x4f16d0']['assembly']
 assert '0x403589: CMP dword ptr [ESP + 0x4], EAX'in f['0x403580']['assembly']
 # Reuse the already retained scene producer/entry initialization; animation soundScene is not this global.
 for ad,parts in [('0x45eef0',['FUN_0045f2a0(0,0,0,0,0,0,0,0)']),('0x45f2a0',['FUN_004649b0(param_1,param_2,param_8,param_7)']),('0x4649b0',['DAT_00957e88 = param_4']),('0x4ef870',['FUN_0045f2a0(param_2,param_3,param_4,param_5,param_8,param_9,param_10,param_12)']),('0x43f380',['DAT_00957e88 == 0'])]:assert all(x in f[ad]['pseudocode']for x in parts),ad
 assert '(DAT_00f5f17c != 9)'in f['0x4fd0d0']['pseudocode']
 scene_spec=json.load(open(R/'analysis/game-legacy-scene-v1/implementation-spec.json'));assert 'wire8 ->45f2a0 param7 ->4649b0 param4 ->00957e88'in json.dumps(scene_spec)
 at=locate('0x4401e8',91);targets=struct.unpack_from('<5I',raw,at);table=raw[at+20:at+91];returns={0x4401c9:8,0x4401cf:17,0x4401d5:33,0x4401db:257,0x4401e1:1}
 mapped=[returns[targets[i]]for i in table]
 for c in range(1,72):assert mapped[c-1]==(8 if c==1 else 17 if c in [6,13,27]else 33 if c==32 else 257 if c==71 else 1)
 counter=after['ev_abf1419f39bad66a8758dd5152d3bf5b219580479b797319b03d6e848788fb14'];assert counter['normalized_result']['address']=='0x59a2dc' and counter['normalized_result']['status']=='data'
 assert json.load(open(P/'session-closed.json'))==dict(open=False,cleanup_pending=False)
 spec.update(functions=functions,reused_functions=reused,new_records=79,new_operations=dict(Counter(r['operation']for r in new)));(A/'implementation-spec.json').write_text(json.dumps(spec,ensure_ascii=False,indent=2)+'\n')
 result=dict(schema='moli.actor-context-source-stage171.v1',source=spec['source'],tools=spec['tools'],artifacts=[info(P/'rea-final.json'),info(P/'rea-snapshot.json')],restored_records=1347,total_records=1426,new_records=79,new_function_entries=4,functions=functions,reused_functions=reused,byte_and_mapping_checks=checks,data_xrefs=data,counter_xref=dict(id=counter['evidence_id'],address='0x59a2dc'),type_table=dict(address='0x4401e8',offset=at,bytes=91,categories=71,matched=True),native_callback='0x43ba10 remains outside provider procedure; retained callback disassembly/exact instructions reused',source_facts=spec['source_facts'],session_closed=True,target_execution=False,VM_execution=False,official_session=False,goal_status='active',full_goal_complete=False)
 result['scene_mode_producer']=dict(wire_index=8,global_address='0x957e88',source='4ef870/45f2a0.param7/4649b0.param4',entry_initial_value=0,entry_initializer='45eef0',inherited_scene_contract=info(R/'analysis/game-legacy-scene-v1/implementation-spec.json'),functions=[dict(entry=ad,id=next(r['evidence_id']for r in records if r['operation']=='analyze_function'and r['normalized_result']['procedure']['address']==ad))for ad in ['0x4ef870','0x45f2a0','0x4649b0','0x45eef0']],animation_sound_context_is_separate=True,animation_sound_native_global='0xf5f17c')
 (A/'source-check.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n');print(json.dumps(dict(records=1426,new=79,functions=4,reused=28,checks=74,type_categories=71)))
if __name__=='__main__':main()
