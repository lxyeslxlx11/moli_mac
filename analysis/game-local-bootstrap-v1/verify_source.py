#!/usr/bin/env python3
"""Check retained REA identity, source mappings, instruction bytes and logical roles. No target execution."""
from pathlib import Path
from collections import Counter
import hashlib,json,struct
R=Path(__file__).resolve().parents[2];A=Path(__file__).resolve().parent;P=R/'build/analysis/game-local-bootstrap-v1'
def info(path):
    b=path.read_bytes();return dict(path=str(path.relative_to(R)),bytes=len(b),sha256=hashlib.sha256(b).hexdigest())
def main():
    spec=json.load(open(A/'implementation-spec.json'));raw=(R/spec['source']['path']).read_bytes();assert info(R/spec['source']['path'])==spec['source']
    pe=struct.unpack_from('<I',raw,60)[0];base=struct.unpack_from('<I',raw,pe+52)[0];start=pe+24+struct.unpack_from('<H',raw,pe+20)[0]
    sections=[struct.unpack_from('<4I',raw,start+i*40+8)[1:] for i in range(struct.unpack_from('<H',raw,pe+6)[0])]
    def offset(address,size=1):
        rva=int(address,16)-base;rows=[off+rva-first for first,length,off in sections if first<=rva and rva+size<=first+length];assert len(rows)==1;return rows[0]
    before=json.load(open(R/'build/analysis/game-browser-owner-v1/rea-final.json'))['records'];records=json.load(open(P/'rea-final.json'))['records']
    old={r['evidence_id']:r for r in before};after={r['evidence_id']:r for r in records};assert len(old)==1278 and len(after)==1347 and all(after[k]==v for k,v in old.items())
    new=[r for r in records if r['evidence_id'] not in old];checks=[];data=[]
    for r in new:
        assert r['subject']['digest']['sha256']==spec['source']['sha256'] and r['analysis_profile']['digest']==spec['tools']['profile'] and r['provider']['version']=='12.1.4'
        n=r['normalized_result'];op=r['operation']
        if op=='inspect_native_instruction':
            if n['status']=='data':
                data.append(dict(id=r['evidence_id'],address=n['address'],references=len(n['incoming_references'])));continue
            assert n['status']=='decoded';b=bytes.fromhex(n['bytes']);at=offset(n['address'],len(b));assert raw[at:at+len(b)]==b
            checks.append(dict(id=r['evidence_id'],operation=op,address=n['address'],offset=at,bytes=len(b),sha256=hashlib.sha256(b).hexdigest(),matched=True))
        elif op=='address_to_file_offset':
            assert n['file_offset']==offset(n['address']);checks.append(dict(id=r['evidence_id'],operation=op,address=n['address'],offset=n['file_offset'],matched=True))
    assert len(new)==69 and len(checks)==57 and len(data)==7
    functions=[dict(entry=r['normalized_result']['procedure']['address'],id=r['evidence_id'],requested=r['parameters']['procedure']) for r in new if r['operation']=='analyze_function'];assert functions==spec['functions']
    for r in spec['reused_functions']:assert old[r['id']]['normalized_result']['procedure']['address']==r['entry']
    f={r['normalized_result']['procedure']['address']:r['normalized_result'] for r in records if r['operation']=='analyze_function'}
    assertions={'0x4ff080':['0x4ff082: MOV ECX, 0x2cec','0x4ff089: MOV EDI, 0xf53530','0x4ff08e: STOSD.REP ES:EDI','0x4ff152: MOV dword ptr [0x00f536ac], 0xffffffff'],
     '0x4ff160':['0x4ff174: PUSH EAX','0x4ff179: CALL 0x004034d0','0x4ff17f: MOV ECX, 0x96b9c8','0x4ff184: CALL 0x004034d0','0x4ff189: MOV ECX, dword ptr [0x00f536a0]','0x4ff190: PUSH ECX','0x4ff191: CALL 0x004ff3b0'],
     '0x43c000':['0x43c02f: MOV dword ptr [ESI + 0x2b8], ECX','0x43c041: MOV dword ptr [ESI + 0x2a8], EAX'],
     '0x4f16d0':['0x4f1a27: CALL 0x004ff3b0','0x4f1a38: CALL 0x004ff510','0x4f1ad9: AND byte ptr [0x00922c4c], 0xfd'],
     '0x4ff700':['0x4ff70c: MOV [0x00f536ac], EAX','0x4ff713: MOV dword ptr [ECX + 0x2b8], EAX']}
    for address,lines in assertions.items():assert all(line in f[address]['assembly'] for line in lines),address
    for address,parts in [('0x5015a0',['FUN_0045eef0','FUN_004ff080']),('0x45eef0',['DAT_00922c4c = 3']),('0x501a50',['FUN_004ff160','DAT_00922c4c']),('0x4ef510',['DAT_00922c4c & 0xfe']),('0x4ef580',['DAT_00922c4c & 0xfe']),('0x4ef870',['FUN_004ff430','FUN_0045f2f0']),('0x4ef840',['FUN_004ff580(param_2,param_3)','FUN_004ff700(param_4)'])]:
        assert all(part in f[address]['pseudocode'] for part in parts),address
    raw_slots=[0xf536a0,0xf53698,0xf53534,0xf53630,0xf53641];assert all(0xf53530<=a<0xf53530+0x2cec*4 for a in raw_slots)
    callback=after['ev_1bc71f442d97b00cb458db2392f0e0cedfba5551b8789f01b99d0b3d8fbfa3a1']['normalized_result'];assert callback['procedure'] is None and callback['bytes']=='83ec14' and callback['incoming_references'][0]['source_address']=='0x43c03a'
    assert after['ev_9e13956a4233eb2af8b079a4ecbcf96c3ee709b75699ed044ce6d1adf2ea50e3']['normalized_result']['found'] is False
    assert json.load(open(P/'session-closed.json'))==dict(open=False,cleanup_pending=False)
    result=dict(schema='moli.local-bootstrap-source-stage170.v1',source=spec['source'],tools=spec['tools'],artifacts=[info(P/'rea-final.json'),info(P/'rea-snapshot.json')],restored_records=1278,total_records=1347,new_records=69,new_operations=dict(Counter(r['operation'] for r in new)),new_function_entries=1,functions=functions,reused_functions=spec['reused_functions'],byte_and_mapping_checks=checks,data_xrefs=data,callback_boundary=spec['callback_boundary'],source_slots=spec['source_slots'],session_closed=True,target_execution=False,VM_execution=False,official_session=False,goal_status='active',full_goal_complete=False)
    (A/'source-check.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n');print(json.dumps(dict(records=1347,new=69,functions=1,reused=31,checks=57,data=7)))
if __name__=='__main__':main()
