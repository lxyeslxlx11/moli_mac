#!/usr/bin/env python3
"""Verify immutable PE bytes, complete REA records and separately seeded callback code."""
from pathlib import Path
from datetime import datetime,timezone
import collections,hashlib,json,struct
R=Path(__file__).resolve().parents[2];A=R/'analysis/game-battle-body-v1';P=R/'build/analysis/game-battle-body-v1';OLD=R/'build/analysis/game-battle-commands-v1'
SHA='37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd';PROFILE='7810ea9437da59780820ec6fedb47ce47390841a95d527ddb6c3b3700fe180cb'
def read(p):return json.loads(p.read_text())
def write(p,v):p.write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n')
def info(p):
    h=hashlib.sha256()
    with p.open('rb')as f:
        for b in iter(lambda:f.read(1048576),b''):h.update(b)
    return dict(path=str(p.relative_to(R)),bytes=p.stat().st_size,sha256=h.hexdigest())
def main():
    source=R/'build/analysis/game-release-current-v1/legacy-members/cg_se_6000.exe';raw=source.read_bytes();assert len(raw)==1569280 and hashlib.sha256(raw).hexdigest()==SHA
    current=read(P/'rea-final.json');prior=read(OLD/'rea-final.json');records={r['evidence_id']:r for r in current['records']};old={r['evidence_id']:r for r in prior['records']}
    assert len(old)==1756 and len(records)==1830 and all(records[k]==v for k,v in old.items())
    new=[r for k,r in records.items()if k not in old];counts=collections.Counter(r['operation']for r in new)
    assert counts==dict(analyze_function=22,read_bytes=17,address_to_file_offset=34,resolve_containing_procedure=1)
    before=read(P/'functions-before.json');after=dict(before);functions=[];known=[]
    for r in new:
        assert r['subject']['digest']['sha256']==SHA and r['analysis_profile']['digest']==PROFILE
        if r['operation']!='analyze_function':continue
        n=r['normalized_result'];address=n['procedure']['address'];assert address==r['parameters']['procedure']
        if address in before:
            known_path=P/(address[2:]+'-known-query.json');write(known_path,r)
            known.append(dict(requested=r['parameters']['procedure'],resolved=address,query_evidence_id=r['evidence_id'],retained_evidence_id=before[address]['id'],counted_as_new_canonical=False,dossier=info(known_path)));continue
        after[address]={'id':r['evidence_id'],**{k:n[k]for k in ['procedure','pseudocode','assembly','callees','callers']}}
        path=P/(address[2:]+'-new.json');write(path,r)
        functions.append(dict(address=address,evidence_id=r['evidence_id'],body=n['procedure']['body'],native_value_flow_truncated=bool(n.get('native_value_flow',{}).get('truncated')),dossier=info(path)))
    assert len(before)==585 and len(after)==606 and len(functions)==21 and len(known)==1 and sum(r['body']['total_bytes']for r in functions)==2256
    write(P/'functions-complete.json',after)
    pe=struct.unpack_from('<I',raw,60)[0];base=struct.unpack_from('<I',raw,pe+52)[0];start=pe+24+struct.unpack_from('<H',raw,pe+20)[0]
    sections=[struct.unpack_from('<4I',raw,start+40*i+8)for i in range(struct.unpack_from('<H',raw,pe+6)[0])]
    def offset(address):
        rva=int(address,16)-base
        for vs,va,rs,rp in sections:
            if va<=rva<va+min(vs,rs):return rp+rva-va
        raise AssertionError(address)
    maps={r['normalized_result']['address']:r for r in records.values()if r['operation']=='address_to_file_offset'};checks=[]
    for r in new:
        if r['operation']!='read_bytes':continue
        n=r['normalized_result'];b=bytes.fromhex(n['bytes_hex']);address=n['address'];end=hex(int(address,16)+len(b)-1);at=offset(address)
        assert n['complete']and n['requested_bytes']==n['returned_bytes']==len(b)
        assert maps[address]['normalized_result']['file_offset']==at and maps[end]['normalized_result']['file_offset']==at+len(b)-1 and raw[at:at+len(b)]==b
        checks.append(dict(address=address,end=end,file_offset=at,bytes=len(b),evidence_id=r['evidence_id'],sha256=hashlib.sha256(b).hexdigest(),original_bytes_equal=True))
    assert len(checks)==17 and sum(r['bytes']for r in checks)==67476
    table=read(A/'source-tables.json');table_bytes=raw[offset('0x53da08'):offset('0x53da08')+2880]
    assert list(struct.unpack('<360d',table_bytes))==table['sine_degrees']
    scalar=next(r for r in new if r['operation']=='read_bytes'and r['normalized_result']['address']=='0x52d518');scalar_values=struct.unpack('<2f',bytes.fromhex(scalar['normalized_result']['bytes_hex']))
    table.update(message_threshold=scalar_values[0],message_acceleration=scalar_values[1],message_scalar_evidence_id=scalar['evidence_id'],message_x87='FCOM and position addition use unrounded ST0 height; FST separately stores float32 height')
    write(A/'source-tables.json',table)
    expected='/** Source-bound numeric sine table at53da08. No executable code or assets. */\nexport const LEGACY_GAME_BATTLE_SINE=Object.freeze('+json.dumps(table['sine_degrees'],separators=(',',':'))+');\n'
    assert(R/'shared/legacy-game-battle-math-data.mjs').read_text()==expected
    old_actor=read(R/'analysis/game-legacy-actors-v1/actor-catalog.json');assert list(struct.unpack('<65d',raw[offset('0x53e548'):offset('0x53e548')+520]))==old_actor['math']['direction_table']
    derived_checks=[]
    for package,is_new in [(read(R/'build/analysis/game-battle-runtime-v1/derived-callbacks.json'),False),(read(P/'derived-callbacks.json'),True)]:
        assert not package['originalExecution']and not package['originalBytePatches']
        for row in package['entries']:
            content=bytearray()
            for instruction in row['instructions']:
                b=bytes.fromhex(instruction['bytesHex']);at=offset(instruction['address']);assert raw[at:at+len(b)]==b;content.extend(b)
            assert len(content)==row['derivedBodyBytes']and row['decompileCompleted']
            derived_checks.append(dict(entry=row['requestedEntry'],instruction_bytes=len(content),sha256=hashlib.sha256(content).hexdigest(),original_bytes_equal=True,new_export=is_new,canonical_REA_dossier=False))
    assert [r['instruction_bytes']for r in derived_checks]==[682,54685,96,28,169]
    process=read(P/'derived-process-receipt.json');assert process['exit_code']==0 and process['original_unchanged']and process['source_sha256_before']==process['source_sha256_after']==SHA and not process['original_executed']
    unresolved=next(r for r in new if r['operation']=='resolve_containing_procedure');assert unresolved['normalized_result']==dict(found=False,procedure=None,query_address='0x4204c0',reason='not_in_procedure')
    reused=[]
    addresses=['40a120','433a10','433cd0','4347e0','4348e0','434990','4349e0','434a30','434a70','434a90','434af0','434b60','434b90','436500','436880','436930','4fd5f0','409e70','409fe0','40a090','419f60','4199b0','4668a0','4235f0','437b30','4234e0','419840','434670','434770','466820']
    for address in addresses:
        record=old[before['0x'+address]['id']];path=P/(address+'-retained.json');write(path,record)
        reused.append(dict(address='0x'+address,evidence_id=record['evidence_id'],native_value_flow_truncated=bool(record['normalized_result'].get('native_value_flow',{}).get('truncated')),dossier=info(path)))
    body=before['0x40a120'];assert body['procedure']['body']['total_bytes']==62225
    assert 'FUN_0041f3b0'in body['pseudocode'] and 'FST float ptr [ESI + 0x4c]'in after['0x420010']['assembly'][20]
    state=read(P/'final-session-status.json');close=read(P/'session-closed.json')['structuredContent']['result'];assert not state['open']and not state['cleanup_pending']and close['evidence_records']==1830 and close['bytes']==489276177
    out=dict(schema='moli.battle-body-source-stage183.v1',source=info(source),tool='REA6.7.0/Ghidra12.1.4; separate analyst-seeded Ghidra12.1.4 callback export; process JDK21.0.13',analysis_profile=PROFILE,
        records=len(records),new_records=len(new),new_operations=dict(counts),known_functions_before=len(before),known_functions_after=len(after),new_functions=functions,known_function_queries=known,reused_dossiers=reused,
        byte_checks=checks,new_original_bytes_verified=67476,sine_table_values=360,source_tables=info(A/'source-tables.json'),retained_direction_table=dict(address='0x53e548',values=65,bytes=520,original_equal=True),
        derived_callback_checks=derived_checks,new_derived_instruction_bytes=169,retained_derived_instruction_bytes_reverified=55491,unrecognized_callback=dict(address='0x4204c0',resolve_evidence_id=unresolved['evidence_id'],provider_reason='not_in_procedure',canonical_provider_repair=False),
        observed_facts=['419fa0 pseudocode omits the Euclidean distance computation; x87 assembly verifies sqrt of squared deltas then truncation','Sine is source degree-indexed double table, cosine adds float32 ninety degrees before normalization; no Math.sin substitution','420010 compares/adds unrounded x87 height before storing position; stored height is separately float32','433cd0 invokes animation mode0 after C character/selection handling, beyond constructor and optional death loop','409fe0 reads next link after callback; same-priority newly allocated nodes may run this pass while earlier-priority nodes wait','Source49 clears the global actor slot but does not mark the pool body deleted','Source55 resets animation nextFrame/delay, preserving other animation state','Source244 sets manager ready0/stop1; manager requests7 on its following call'],
        coverage_limits=['Complete40a120 body is retained and raw-byte bound, but native value flow is truncated','Only23 body types, with208 leading to unsupported209, are ported; full native dispatch remains incomplete','C selection4235f0/423500 and full mount/special/complex status effects are not implemented','Native main10 entry/fades/C scheduling/background/shadow/render/input/exit-return remain incomplete','Visual RNG seed and quarter/renderer context are explicit; whole-application RNG state is not reconstructed','Native x87 arbitrary-input bit identity and native heap/address behavior are unverified; unsafe/infinite native paths are bounded and rejected'],
        artifacts=[info(P/n)for n in ['rea-final.json','rea.snapshot.json','functions-complete.json','session-closed.json','final-session-status.json','derived-callbacks.json','derived-process-receipt.json']]+[info(R/'tools/ghidra/MoliExportCallbacks.java')],
        session_closed=True,VM_actions=0,original_execution=0,official_sessions=0,phase_complete=False,full_goal_complete=False,goal_status='active',recorded_utc=datetime.now(timezone.utc).isoformat())
    write(A/'source-check.json',out);print(json.dumps(dict(records=1830,new_records=74,new_canonical=21,known_queries=1,reused=30,original_bytes_verified=67476,new_derived_bytes=169,closed=True)))
if __name__=='__main__':main()
