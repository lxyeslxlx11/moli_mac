#!/usr/bin/env python3
"""Verify source artifacts, retained evidence and independent original PE byte ranges."""
from pathlib import Path
from collections import Counter
import hashlib,json,struct
R=Path(__file__).resolve().parents[2];A=Path(__file__).resolve().parent;P=R/'build/analysis/game-resource-runtime-v1'
SHA='37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd';PROFILE='7810ea9437da59780820ec6fedb47ce47390841a95d527ddb6c3b3700fe180cb'
def info(p):
 b=p.read_bytes();return dict(path=str(p.relative_to(R)),bytes=len(b),sha256=hashlib.sha256(b).hexdigest())
def main():
 source=R/'build/analysis/game-release-current-v1/legacy-members/cg_se_6000.exe';raw=source.read_bytes();assert hashlib.sha256(raw).hexdigest()==SHA;pe=struct.unpack_from('<I',raw,60)[0];base=struct.unpack_from('<I',raw,pe+52)[0];at=pe+24+struct.unpack_from('<H',raw,pe+20)[0];sections=[struct.unpack_from('<4I',raw,at+i*40+8)[1:] for i in range(struct.unpack_from('<H',raw,pe+6)[0])]
 def locate(address,n=1):
  rva=int(address,16)-base;found=[offset+rva-start for start,size,offset in sections if start<=rva and rva+n<=start+size];assert len(found)==1;return found[0]
 old=json.loads((R/'build/analysis/game-input-runtime-v1/rea-final.json').read_bytes())['records'];records=json.loads((P/'rea-final.json').read_bytes())['records'];before={e['evidence_id']:e for e in old};after={e['evidence_id']:e for e in records};assert len(before)==879 and len(after)==913 and all(after[k]==v for k,v in before.items());new=[e for e in records if e['evidence_id'] not in before];checks=[];functions=[]
 for e in new:
  assert e['subject']['digest']['sha256']==SHA and e['provider']['id']=='ghidra' and e['provider']['version']=='12.1.4' and e['analysis_profile']['digest']==PROFILE
  op=e['operation'];n=e['normalized_result']
  if op in ['inspect_native_instruction','read_bytes']:
   if op=='read_bytes':assert n['complete'] and n['requested_bytes']==n['returned_bytes'];b=bytes.fromhex(n['bytes_hex'])
   else:assert n['status']=='decoded';b=bytes.fromhex(n['bytes'])
   offset=locate(n['address'],len(b));assert raw[offset:offset+len(b)]==b;checks.append(dict(id=e['evidence_id'],operation=op,address=n['address'],offset=offset,bytes=len(b),sha256=hashlib.sha256(b).hexdigest(),matched=True))
  elif op=='address_to_file_offset':assert n['file_offset']==locate(n['address']);checks.append(dict(id=e['evidence_id'],operation=op,address=n['address'],offset=n['file_offset'],matched=True))
  elif op=='analyze_function':functions.append(dict(id=e['evidence_id'],entry=n['procedure']['address'],body=n['procedure']['body']))
 assert len(new)==34 and len(functions)==3 and len(checks)==31
 contract=json.loads((A/'implementation-spec.json').read_text());assert contract['source']==info(source) and contract['functions']==functions
 reused=list(contract['reused_functions']);known={row['entry'] for row in reused}
 for e in reversed(old):
  if e['operation']=='analyze_function':
   a=e['normalized_result']['procedure']['address']
   if a in ['0x5074d0','0x507230','0x449c80','0x4497c0','0x449a10'] and a not in known:reused.append(dict(id=e['evidence_id'],entry=a));known.add(a)
 for row in reused:assert before[row['id']]['normalized_result']['procedure']['address']==row['entry']
 def string(address):
  at=locate(address);return raw[at:raw.index(0,at)].decode('ascii')
 cat=json.loads((A/'resource-path-catalog.json').read_text());assert cat['base']==string('0x53cc1c')=='Bin' and cat['join_format']==string('0x53351c')=='%s\\%s';assert cat['integer_format']==string('0x5331ac')=='%d';assert string('0x53cdc8')=='*%d'
 for k,key in enumerate(['graphic','graphicInfo','animation','animationInfo','coordinate','coordinateInfo']):assert cat['defaults'][key]==[string(hex(0x536f2c+(k*7+i)*128)) for i in range(7)]
 assert cat['defaults']['coordinate']==['*3','*3','*3','Crd.bin','*3','*3','*3'];assert cat['required_graphic_groups']==[0,3,6] and cat['required_animation_groups']==[0]
 assert json.loads((P/'session-closed.json').read_text())==dict(open=False,cleanup_pending=False)
 result=dict(schema='moli.game-resource-runtime-source-stage164.v1',source=info(source),tools=dict(rea='6.7.0',ghidra='12.1.4',profile=PROFILE),artifacts=[info(P/'rea-final.json'),info(P/'rea-snapshot.json')],restored_records=879,total_records=913,new_records=34,new_operations=dict(Counter(e['operation'] for e in new)),function_dossiers=3,unique_dossier_entries=3,new_function_entries=2,redundant_completed_function_entry='0x4649b0',functions=functions,reused_functions=reused,byte_and_mapping_checks=checks,
 extra_original_literal=dict(address='0x53cdc8',offset=locate('0x53cdc8',4),bytes_hex='2a256400',matched=True,rea_read=False),session_closed=True,target_execution=False,VM_execution=False,official_session=False,
 facts=['7families/defaults frombounded original5376B table;Bin join and%d formatting/source first substring semantics.','GraphicV2 earlier graphicbiv2x alias overwritten bygraphicbinv2 branch regardless textual order.','Coordinate*3 aliases resolveafter parameters tofinal group3 paths;init shares case-insensitive duplicatefilehandles.','452460 requires graphics archives/indices groups0/3/6;453720 main animation group0 required.','mode1 CUTuses existing scene.resolvedSelector andhardcoded bin root;binfolder doesnot alterCUT path.','Native506030 calls5074d0->453030 image read and505d70 upload afterclockskip decision;numeric queues maytherefore precedeimage IO.','Neutralmode default noembedded usescurrentCGP/168black withblack0;flag4 noembedded usesoriginal snapshot+explicitblack1;embeddedBGR usesexplicitblack1.','DynamicLUT/UIpalette state isnotinferred;libraryrequires explicit neutral palette context.'],corrections=contract['corrections'],remaining=contract['remaining'],goal_status='active',full_goal_complete=False)
 (A/'source-check.json').write_text(json.dumps(result,indent=2)+'\n');print(json.dumps(dict(records=913,new=34,dossiers=3,newEntries=2,checks=31,reused=len(reused))))
if __name__=='__main__':main()
