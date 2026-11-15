#!/usr/bin/env python3
"""Validate retained source functions and new byte observations; never execute a target."""
from pathlib import Path
from collections import Counter
import hashlib,json,struct
R=Path(__file__).resolve().parents[2];A=Path(__file__).resolve().parent;P=R/'build/analysis/game-actor-spin-v1'
def info(p):
 b=p.read_bytes();return dict(path=str(p.relative_to(R)),bytes=len(b),sha256=hashlib.sha256(b).hexdigest())
def main():
 spec=json.load(open(A/'implementation-spec.json'));raw=(R/spec['source']['path']).read_bytes();assert info(R/spec['source']['path'])==spec['source']
 pe=struct.unpack_from('<I',raw,60)[0];base=struct.unpack_from('<I',raw,pe+52)[0];start=pe+24+struct.unpack_from('<H',raw,pe+20)[0];sections=[struct.unpack_from('<4I',raw,start+i*40+8)[1:]for i in range(struct.unpack_from('<H',raw,pe+6)[0])]
 def offset(ad,n=1):
  rva=int(ad,16)-base;rows=[off+rva-first for first,size,off in sections if first<=rva and rva+n<=first+size];assert len(rows)==1;return rows[0]
 old=json.load(open(R/'build/analysis/game-actor-context-v1/rea-final.json'))['records'];records=json.load(open(P/'rea-source.json'))['records'];before={r['evidence_id']:r for r in old};after={r['evidence_id']:r for r in records}
 assert len(before)==1426 and len(after)==1452 and all(after[k]==r for k,r in before.items());new=[r for r in records if r['evidence_id']not in before];assert len(new)==26
 checks=[]
 for r in new:
  assert r['subject']['digest']['sha256']==spec['source']['sha256']and r['analysis_profile']['digest']==spec['tools']['profile']and r['provider']['version']=='12.1.4'
  n=r['normalized_result'];op=r['operation']
  if op in ['read_bytes','inspect_native_instruction']:
   if op=='read_bytes':assert n['complete']and n['requested_bytes']==n['returned_bytes'];b=bytes.fromhex(n['bytes_hex'])
   else:assert n['status']=='decoded';b=bytes.fromhex(n['bytes'])
   at=offset(n['address'],len(b));assert raw[at:at+len(b)]==b;checks.append(dict(id=r['evidence_id'],operation=op,address=n['address'],offset=at,bytes=len(b),sha256=hashlib.sha256(b).hexdigest(),matched=True))
  else:assert op=='address_to_file_offset'and n['file_offset']==offset(n['address']);checks.append(dict(id=r['evidence_id'],operation=op,address=n['address'],offset=n['file_offset'],matched=True))
 assert len(checks)==26 and Counter(r['operation']for r in new)=={'read_bytes':4,'address_to_file_offset':4,'inspect_native_instruction':18}
 reused=[dict(entry=r['normalized_result']['procedure']['address'],id=r['evidence_id'])for r in [json.load(open(p))for p in sorted(P.glob('*-retained.json'))]];assert len(reused)==28 and all(r['id']in before for r in reused)
 f={r['normalized_result']['procedure']['address']:r['normalized_result']for r in old if r['operation']=='analyze_function'}
 for ad,parts in [('0x4ffe10',['DAT_00f536a0 = FUN_00500a70(param_5)','*(undefined4 *)(DAT_00f5e8dc + 0x2c) = 3']),('0x43e610',['*(undefined4 *)(param_1 + 0x2c) = 3','piVar10[0xf] = 0']),('0x439080',['case 3:','local_10[0] = 0x2d','local_10[7] = 0x5a','FUN_004fd0d0(param_1,100,1,0)','if (iVar7 == 1)','piVar1[0xf] = piVar1[0xf] + 1']),('0x4ff510',['DAT_00f536a0 = param_1','DAT_00f536ac = param_2']),('0x4ff700',['DAT_00f536ac = param_1']),('0x462110',['FUN_004ff700(uVar3)']),('0x462410',['FUN_004ff700(iVar1)','*(int *)(DAT_00f5e8dc + 0x2b8) != param_1']),('0x461660',['FUN_004ff5a0()']),('0x4ff5a0',['*(undefined4 *)(DAT_00f5e8dc + 0x274) = DAT_00957e6c']),('0x4ff160',['DAT_00f536a0','DAT_00f536ac'])]:assert all(t in f[ad]['pseudocode']for t in parts),ad
 for ad in ['0x4ffe10','0x43e610']:
  spin=f[ad]['pseudocode'].split('case 0x50:')[1].split('case 99:')[0];assert 'DAT_00f536a0 ='not in spin and 'DAT_0059a310'not in spin and 'param_7'not in spin
 assert '0x4f2176: MOV EDX, dword ptr [ECX + 0x2a8]'in f['0x4f2010']['assembly']and '*(int *)(DAT_00f5e8dc + 0x2a8) != 0'in f['0x4f2010']['pseudocode']
 asm=f['0x439080']['assembly'];assert all(t in asm for t in ['0x4398ce: CMP EAX, 0x168','0x4398d3: JG 0x004399b9','0x43998b: FCOS','0x43999c: FSIN','0x4399a2: FCHS','0x4399d9: MOV dword ptr [EDI + 0x3c], EBX','0x4399e7: CALL 0x004fd0d0','0x439a34: INC EAX'])
 p=offset('0x52d908',32);b=raw[p:p+32];constants=dict(yScale=struct.unpack_from('<f',b,0)[0],xScale=struct.unpack_from('<f',b,4)[0],radians=struct.unpack_from('<d',b,8)[0],baseY=struct.unpack_from('<f',b,16)[0],screenBias=struct.unpack_from('<d',b,24)[0]);assert constants==dict(yScale=0.6000000238418579,xScale=1.75,radians=0.017453292519444445,baseY=-1.399999976158142,screenBias=0.5)
 callback=R/'build/analysis/game-legacy-actors-v1/callback-objdump.txt';text=callback.read_text();assert all(t in text for t in ['43ba73:','call   0x439080','jne    0x43bff3','43bfe5:'])
 assert json.load(open(P/'session-closed.json'))==dict(open=False,cleanup_pending=False)
 spec.update(reused_functions=reused,new_records=26,new_function_entries=0,new_operations=dict(Counter(r['operation']for r in new)),constants=dict(address='0x52d908',bytes=32,offset=p,values=constants,angles=[45,0,315,270,225,180,135,90]));(A/'implementation-spec.json').write_text(json.dumps(spec,ensure_ascii=False,indent=2)+'\n')
 result=dict(schema='moli.actor-spin-source-stage172.v1',source=spec['source'],tools=spec['tools'],restored_records=1426,total_records=1452,new_records=26,new_function_entries=0,reused_functions=reused,new_operations=spec['new_operations'],byte_and_mapping_checks=checks,constants=spec['constants'],source_facts=spec['source_facts'],artifacts=[info(P/'rea-source.json'),info(P/'rea-snapshot.json')],retained_callback=info(callback),session_closed=True,target_execution=False,VM_execution=False,official_session=False,goal_status='active',full_goal_complete=False)
 (A/'source-check.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n');print(json.dumps(dict(records=1452,new=26,new_functions=0,reused=28,checks=26,constants=constants)))
if __name__=='__main__':main()
