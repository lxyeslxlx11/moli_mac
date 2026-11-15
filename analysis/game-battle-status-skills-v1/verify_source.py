#!/usr/bin/env python3
# coding: utf-8
"""Verify immutable PE offsets, callbacks and exact source/evidence union."""
from pathlib import Path
import hashlib, json, struct, re

A=Path(__file__).resolve().parent; R=A.parent.parent; P=R/'build/analysis/game-battle-status-skills-v1'
def read(p): return json.loads(p.read_text())
def info(p): return dict(path=str(p.relative_to(R)),bytes=p.stat().st_size,sha256=hashlib.sha256(p.read_bytes()).hexdigest())
def unwrap(d): return d.get('structuredContent',{}).get('result') or d.get('result') or json.loads(next(c['text'] for c in d['content'] if c['type']=='text'))['result']
def main():
    old=read(R/'analysis/game-battle-casting-v1/source-check.json'); source=R/old['source']['path']; assert info(source)==old['source']
    raw=source.read_bytes(); pe=struct.unpack_from('<I',raw,60)[0]; base=struct.unpack_from('<I',raw,pe+52)[0]; optional=struct.unpack_from('<H',raw,pe+20)[0]; sections=[]
    for i in range(struct.unpack_from('<H',raw,pe+6)[0]):
        _,va,n,at=struct.unpack_from('<IIII',raw,pe+24+optional+i*40+8);sections.append((base+va,at,n))
    def offset(va,n):
        for start,at,count in sections:
            if start<=va and va+n<=start+count:return at+va-start
        raise AssertionError('Original mapped bytes unavailable')
    retained=R/'build/analysis/game-battle-casting-v1/functions-complete.json'
    assert info(retained)==next(r for r in old['artifacts'] if r['path']==str(retained.relative_to(R)))
    functions=read(retained);assert len(functions)==713
    profile='7810ea9437da59780820ec6fedb47ce47390841a95d527ddb6c3b3700fe180cb';files=[retained];new={};checked=[];reobserved=[]
    def evidence(path):
        e=read(path);assert e['subject']['digest']['sha256']==old['source']['sha256'] and e['analysis_profile']['digest']==profile;return e
    def original(name,address,n):
        rb=evidence(P/f'read_bytes-{name}.json');fb=evidence(P/f'address_to_file_offset-{name}.json');b=rb['normalized_result'];at=offset(address,n)
        assert b['complete'] and b['requested_bytes']==b['returned_bytes']==n and bytes.fromhex(b['bytes_hex'])==raw[at:at+n]
        assert fb['normalized_result']['file_offset']==at;files.extend([P/f'read_bytes-{name}.json',P/f'address_to_file_offset-{name}.json'])
        return dict(address=hex(address),bytes=n,file_offset=at,evidence_id=rb['evidence_id'],original_match=True)
    for a,n in [('420b30',285),('4203d0',226),('41ba10',84),('41b6e0',105)]:
        ev=evidence(P/f'function-{a}.json');v=ev['normalized_result'];key='0x'+a
        assert v['procedure']['address']==key and v['procedure']['body']['total_bytes']==n
        row=original(a,int(a,16),n);row['function_evidence_id']=ev['evidence_id'];record=dict(id=ev['evidence_id'],**v)
        if key in functions:
            assert functions[key]==record;reobserved.append(row)
        else:checked.append(row);new[key]=record
        files.append(P/f'function-{a}.json')
    assert len(checked)==3 and sum(r['bytes'] for r in checked)==595
    assert len(reobserved)==1 and reobserved[0]['address']=='0x41b6e0' and reobserved[0]['bytes']==105
    repeated=[original(a,int(a,16),n) for a,n in [('40a120',62225),('41dc00',5390),('433cd0',2459)]]
    constants=[original('slot-globals',0x5337c4,44),original('background-midpoint-table',0x533810,352),original('particle-height',0x52d50c,4)]
    assert struct.unpack_from('<I',raw,offset(0x5337c4,4))[0]==7 and struct.unpack_from('<I',raw,offset(0x5337ec,4))[0]==17
    table=struct.unpack_from('<88i',raw,offset(0x533810,352));assert table[28:30]==(418,313) and table[68:70]==(218,228)
    assert struct.unpack_from('<f',raw,offset(0x52d50c,4))[0]==100.0
    sixth=struct.unpack_from('<16I',raw,offset(0x533bb4,64));assert list(sixth)==[0x70f1+(i>>2) for i in range(16)]
    previous_overlay=R/'build/analysis/game-battle-casting-v1/read_bytes-41f520.json';previous_bytes=evidence(previous_overlay)['normalized_result']
    assert bytes.fromhex(previous_bytes['bytes_hex'])==raw[offset(0x41f520,133):offset(0x41f520,133)+133]
    files.append(previous_overlay)
    derived=read(P/'derived-callbacks.json');assert not derived['originalExecution'] and not derived['originalBytePatches'] and len(derived['entries'])==3
    callbacks=[]
    for e in derived['entries']:
        count=0;assert e['decompileCompleted'] and e['status']=='derived-static-export'
        for ins in e['instructions']:
            b=bytes.fromhex(ins['bytesHex']);at=offset(int(ins['address'],16),len(b));assert raw[at:at+len(b)]==b;count+=len(b)
        assert count==e['derivedBodyBytes'];callbacks.append(dict(entry='0x'+e['requestedEntry'],bytes=count,canonical=False,all_original_bytes_match=True))
    assert sum(r['bytes'] for r in callbacks)==1170
    # Source41ba70 has reverse stack indexing; recover its two complete tables
    # from instruction-level constant propagation before the first branch.
    e=next(e for e in derived['entries'] if e['requestedEntry']=='0041ba70');regs={};stack={}
    for ins in e['instructions']:
        s=ins['text']
        if s.startswith('JLE '):break
        m=re.fullmatch(r'XOR (E\w+),\1',s)
        if m:regs[m[1]]=0;continue
        m=re.fullmatch(r'MOV (E\w+),(0x[0-9a-f]+)',s)
        if m:regs[m[1]]=int(m[2],16);continue
        m=re.fullmatch(r'MOV dword ptr \[ESP \+ (0x[0-9a-f]+)\],(E\w+|0x[0-9a-f]+)',s)
        if m:
            value=regs.get(m[2]) if m[2].startswith('E') else int(m[2],16)
            if value is not None:stack[int(m[1],16)]=((value+2**31)%2**32)-2**31
        m=re.match(r'(?:MOV|LEA) (E\w+),',s)
        if m:regs.pop(m[1],None)
    first=[stack[0x18+4*i] for i in range(16)];second=[stack[0x58+4*i] for i in range(16)]
    assert first==[48,44,34,18,0,-18,-34,-44,-48,-44,-34,-18,0,18,34,44]
    assert second==[0,14,26,44,47,44,26,14,0,-14,-26,-44,-47,-44,-26,-14]
    texts=[i['text'] for i in e['instructions']];assert 'MOV EDX,dword ptr [ESP + ECX*0x1 + 0x54]' in texts and 'MOV ECX,dword ptr [ESP + ECX*0x1 + 0x94]' in texts
    process=read(P/'derived-process-receipt.json');assert process['exit_code']==0 and process['source_sha256_before']==process['source_sha256_after']==old['source']['sha256'] and process['original_unchanged'] and not process['original_executed']
    dispatcher=R/'build/analysis/game-battle-runtime-v1/derived-callbacks.json';entry=next(e for e in read(dispatcher)['entries'] if e['requestedEntry']=='004260b0');count=0
    for ins in entry['instructions']:
        b=bytes.fromhex(ins['bytesHex']);at=offset(int(ins['address'],16),len(b));assert raw[at:at+len(b)]==b;count+=len(b)
    assert count==54685
    prior=read(P/'prior-record-check.json');snapshot=read(P/'rea.snapshot.json');assert prior['queried_records']==26 and prior['new_distinct_records']==22 and len(prior['reused_ids'])==4 and prior['cumulative_after']==2400 and len(prior['verified_prior_snapshot_files'])==44 and not prior['missing_referenced_snapshots']
    assert len(snapshot['evidence_bundle']['records'])==26 and set(e['evidence_id'] for e in snapshot['evidence_bundle']['records'])==set(prior['new_ids']+prior['reused_ids']) and snapshot['binding']['analysis_profile']['digest']==profile
    closed=unwrap(read(P/'close-result.json'));assert closed['evidence_records']==26 and closed['primitive_entries']==4
    for name in ['session-initial.json','session-final.json']:
        s=unwrap(read(P/name));assert not s['open'] and not s['cleanup_pending']
    functions.update(new);assert len(functions)==716;complete=P/'functions-complete.json'
    if complete.exists():assert read(complete)==functions
    else:complete.write_text(json.dumps(functions,ensure_ascii=False,separators=(',',':'))+'\n')
    files.extend(P/n for n in ['derived-callbacks.json','derived-process-receipt.json','prior-record-check.json','rea.snapshot.json','session-initial.json','session-final.json','close-result.json','queried-evidence-ids.txt','xrefs-5337c4.json','xrefs-5337ec.json']);files.extend([complete,dispatcher])
    out=dict(schema='moli.status-skills-source-stage199.v1',classification='fact: immutable instructions/data/pointers; derived: independently seeded callbacks and portable reconstruction; original runtime/backend/current/official unverified',source=old['source'],rea='6.7.0',provider='Ghidra12.1.4',profile_digest=profile,
        canonical_functions_before=713,canonical_functions_after=716,new_canonical_functions=checked,checked_new_function_bytes=595,reobserved_canonical_functions=reobserved,checked_query_function_bytes=700,current_snapshot_records=26,new_distinct_records=22,reused_record_ids=prior['reused_ids'],retained_records_before=2378,retained_record_union_after=2400,prior_snapshot_files_verified=44,
        constants=constants,checked_constant_bytes=400,direct_original_constant_bytes=64,direct_original_overlay_group5=dict(address='0x533bb4',file_offset=offset(0x533bb4,64),bytes=64,values=list(sixth)),reverified_overlay_helper_bytes=133,derived_callbacks=callbacks,reverified_derived_callback_bytes=1170,reverified_retained_function_bytes=sum(r['bytes'] for r in repeated),retained_function_reads=repeated,reverified_command_instruction_bytes=54685,
        particle_stack_tables=dict(first=first,second=second,indexing='41ba70 uses indices15-(i&15) in each table, verified from instructions;41bcb0 uses forward second/first tables'),manager_field_midpoint=[318,270.5],source_contract=info(A/'implementation-spec.json'),artifacts=[info(p) for p in dict.fromkeys(files)],
        session_closed=True,cleanup_pending=False,original_execution=0,VM_actions=0,official_sessions=0,
        limitations=['Three independently seeded callbacks are static derivations, not canonical function count increments','41b6e0 was already in the verified713-function cache and is reobserved, not a new canonical function; record union uses the exact finite44-snapshot lookup separately from canonical cache coverage','434a70 activates the current action and differs from434a30 advancement; self status targets must retain that source distinction','Source background state/C flags and particles are owned, but native nonopaque/DDRAW/D3D/alternate/tint/additive/whole-game timing/audio and unknown linked/ride KO dependencies remain requirements','All other skill/handler/gameplay/platform/current/official requirements remain active'],phase_complete=False,full_goal_complete=False,goal_status='active')
    (A/'source-check.json').write_text(json.dumps(out,ensure_ascii=False,indent=2)+'\n');print(json.dumps(dict(functions=716,record_union=2400,new_function_bytes=595,reobserved_function_bytes=105,callback_bytes=1170,reverified_body_ctor_C_bytes=sum(r['bytes'] for r in repeated),constant_bytes=400,session_closed=True)))
if __name__=='__main__':main()
