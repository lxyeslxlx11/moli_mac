#!/usr/bin/env python3
"""Bind new observations and reused static callback exports to the immutable original PE."""
from pathlib import Path
from datetime import datetime, timezone
import collections, hashlib, json, struct
R=Path(__file__).resolve().parents[2]
A=R/'analysis/game-battle-commands-v1'
P=R/'build/analysis/game-battle-commands-v1'
OLD=R/'build/analysis/game-battle-runtime-v1'
SHA='37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd'
PROFILE='7810ea9437da59780820ec6fedb47ce47390841a95d527ddb6c3b3700fe180cb'
def read(p): return json.loads(p.read_text())
def info(p):
    h=hashlib.sha256()
    with p.open('rb') as f:
        for b in iter(lambda:f.read(1048576),b''): h.update(b)
    return dict(path=str(p.relative_to(R)),bytes=p.stat().st_size,sha256=h.hexdigest())
def write(p,value): p.write_text(json.dumps(value,ensure_ascii=False,indent=2)+'\n')
def main():
    source=R/'build/analysis/game-release-current-v1/legacy-members/cg_se_6000.exe'
    raw=source.read_bytes();assert len(raw)==1569280 and hashlib.sha256(raw).hexdigest()==SHA
    current=read(P/'rea-final.json');prior=read(OLD/'rea-final.json')
    records={r['evidence_id']:r for r in current['records']};old={r['evidence_id']:r for r in prior['records']}
    assert len(old)==1729 and len(records)==1756 and all(records[k]==v for k,v in old.items())
    new=[r for k,r in records.items() if k not in old];counts=collections.Counter(r['operation'] for r in new)
    assert counts==dict(analyze_function=11,read_bytes=5,address_to_file_offset=11)
    before=read(P/'functions-before.json');after=dict(before);functions=[];known=[]
    for r in new:
        assert r['subject']['digest']['sha256']==SHA and r['analysis_profile']['digest']==PROFILE
        if r['operation']!='analyze_function': continue
        n=r['normalized_result'];address=n['procedure']['address'];query=r['parameters']['procedure']
        if address in before:
            known.append(dict(requested=query,resolved=address,query_evidence_id=r['evidence_id'],retained_evidence_id=before[address]['id'],counted_as_new_canonical=False))
            assert query=='0x434820' and address=='0x4347e0'
            continue
        after[address]={'id':r['evidence_id'],**{k:n[k] for k in ['procedure','pseudocode','assembly','callees','callers']}}
        path=P/(address[2:]+'-new-query.json');assert read(path)==r
        functions.append(dict(address=address,requested=query,evidence_id=r['evidence_id'],body=n['procedure']['body'],native_value_flow_truncated=bool(n.get('native_value_flow',{}).get('truncated')),dossier=info(path)))
    assert len(before)==575 and len(after)==585 and len(functions)==10 and len(known)==1
    assert sum(f['body']['total_bytes'] for f in functions)==1056
    write(P/'functions-complete.json',after)
    pe=struct.unpack_from('<I',raw,60)[0];base=struct.unpack_from('<I',raw,pe+52)[0]
    start=pe+24+struct.unpack_from('<H',raw,pe+20)[0]
    sections=[struct.unpack_from('<4I',raw,start+40*i+8) for i in range(struct.unpack_from('<H',raw,pe+6)[0])]
    def offset(address):
        rva=int(address,16)-base
        for vs,va,rs,rp in sections:
            if va<=rva<va+min(vs,rs): return rp+rva-va
        raise AssertionError(address)
    maps={r['normalized_result']['address']:r for r in records.values() if r['operation']=='address_to_file_offset'}
    checks=[]
    for r in new:
        if r['operation']!='read_bytes': continue
        n=r['normalized_result'];address=n['address'];data=bytes.fromhex(n['bytes_hex']);end=hex(int(address,16)+len(data)-1);at=offset(address)
        assert n['complete'] and n['returned_bytes']==n['requested_bytes']==len(data)
        assert maps[address]['normalized_result']['file_offset']==at and maps[end]['normalized_result']['file_offset']==at+len(data)-1
        assert raw[at:at+len(data)]==data
        checks.append(dict(address=address,end=end,file_offset=at,bytes=len(data),evidence_id=r['evidence_id'],sha256=hashlib.sha256(data).hexdigest(),original_bytes_equal=True))
    assert len(checks)==5 and sum(r['bytes'] for r in checks)==1109
    table=next(r for r in records.values() if r['evidence_id']=='ev_4b30a2d7e610a2d58801b5c8a3f960b70eb19c45fa6f4ac71c26b5eb6d459e82')
    assert table['evidence_id'] in old
    data=bytes.fromhex(table['normalized_result']['bytes_hex']);assert len(data)==520 and raw[offset('0x53e548'):offset('0x53e548')+520]==data
    catalog=read(R/'analysis/game-legacy-actors-v1/actor-catalog.json');assert list(struct.unpack('<65d',data))==catalog['math']['direction_table']
    js=(R/'shared/legacy-game-actor-data.mjs').read_text();literal=js.split('const data = ',1)[1].split(';\nfunction freeze',1)[0]
    assert json.loads(literal)['math']['direction_table']==catalog['math']['direction_table']
    derived=read(OLD/'derived-callbacks.json');derived_checks=[]
    assert not derived['originalExecution'] and not derived['originalBytePatches']
    for row in derived['entries']:
        content=bytearray()
        for insn in row['instructions']:
            at=offset(insn['address']);data=bytes.fromhex(insn['bytesHex']);assert raw[at:at+len(data)]==data;content.extend(data)
        assert len(content)==row['derivedBodyBytes'] and row['decompileCompleted']
        derived_checks.append(dict(entry=row['requestedEntry'],instruction_bytes=len(content),sha256=hashlib.sha256(content).hexdigest(),original_bytes_equal=True,new_export=False,canonical_REA_dossier=False))
    assert sum(r['instruction_bytes'] for r in derived_checks)==55491
    reuse=['4348e0','434990','434a70','4347e0','436880','436500','434b90','40a090','409e70','409fe0','4668a0','4199b0','419f60','500a70','500b00','500c40','4f36d0','437b30','433a10','433cd0','4351d0','434e60','434670','434770','40a120']
    retained=[]
    for address in reuse:
        key='0x'+address;record=old[before[key]['id']];path=P/(address+'-retained.json');write(path,record)
        retained.append(dict(address=key,evidence_id=record['evidence_id'],native_value_flow_truncated=bool(record['normalized_result'].get('native_value_flow',{}).get('truncated')),dossier=info(path)))
    character_code=old[before['0x433cd0']['id']]['normalized_result']['pseudocode'];assert 'FUN_00433a10(iVar4)' in character_code and 'FUN_004348e0(iVar4)' in character_code and 'FUN_00419f60(iVar2)' in character_code
    state=read(P/'final-session-status.json');assert not state['open'] and not state['cleanup_pending']
    snapshot=read(P/'rea.snapshot.json');assert snapshot
    out=dict(schema='moli.battle-command-source-stage182.v1',source=info(source),tool='REA6.7.0/Ghidra12.1.4; reused separately seeded static callbacks from stage181',analysis_profile=PROFILE,
        records=len(records),new_records=len(new),new_operations=dict(counts),known_functions_before=len(before),known_functions_after=len(after),new_functions=functions,known_function_queries=known,
        canonical_interior_query=dict(requested='0x434a10',resolved='0x4349e0',counted_as_one_new_entry=True),
        reused_dossiers=retained,byte_checks=checks,new_original_bytes_verified=1109,
        direction_table=dict(address='0x53e548',bytes=520,values=65,evidence_id=table['evidence_id'],reused_cached_observation=True,original_bytes_equal=True,shared_table_equal=True),
        derived_callback_checks=derived_checks,derived_instruction_bytes_reverified=55491,
        body_character_slice=dict(new_body_path='433a10 followed by unconditional4348e0 before status in433cd0',modeled_flag_mask=2,heading='target-position update calls419f60; entry/prior-dead branch preserves prior heading'),
        coverage_limits=['Manager/command boundaries are analyst-seeded metadata; canonical count excludes these derived callbacks','40a120 has244 outer body states and truncated native value flow; complete callbacks remain unimplemented','Only eight selected opcodes queue/wait or request exit; unsupported handlers return unavailable','No native frame scheduling, full main10 driver/render/input/exit-return or official compatibility acceptance'],
        artifacts=[info(P/n) for n in ['rea-final.json','rea.snapshot.json','functions-complete.json','final-session-status.json']]+[info(OLD/'derived-callbacks.json')],
        session_closed=True,VM_actions=0,original_execution=0,official_sessions=0,phase_complete=False,full_goal_complete=False,goal_status='active',recorded_utc=datetime.now(timezone.utc).isoformat())
    write(A/'source-check.json',out)
    print(json.dumps(dict(records=len(records),new_records=len(new),new_canonical=len(functions),known_queries=len(known),reused_dossiers=len(retained),verified_original_bytes=1109,cached_table_bytes=520,derived_bytes_reverified=55491,closed=True)))
if __name__=='__main__': main()
