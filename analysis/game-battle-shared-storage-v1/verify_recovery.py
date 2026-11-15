#!/usr/bin/env python3
"""Check the SKL404 recovery and SKL405 source windows against the fixed PE."""
import hashlib
import json
import struct
import sys

sys.dont_write_bytecode = True
from verify_source import A, P, R, info, read, same

PRIVATE = P / 'alias'
WINDOWS = {
    'handoff_prefix': (0x416ad5, 125),
    'skill404_release': (0x429396, 110),
    'skill405_dispatch': (0x433a08, 4),
    'skill405_wait_index': (0x433877, 1),
    'skill405_wait_entry': (0x4337e0, 4),
    'skill405_producer': (0x4323b6, 608),
    'field_callback': (0x421f90, 219),
}
HELPERS = (
    0x419860, 0x41a030, 0x422080, 0x422d60, 0x4232e0, 0x423340,
    0x4348e0, 0x434990, 0x434b60, 0x434b90, 0x437a90, 0x437b30,
)


def sha(data):
    return hashlib.sha256(data).hexdigest()


def main():
    prior = read(A / 'presentation-source-check.json')
    same(prior['source'])
    same(prior['snapshot'])
    sample = (R / prior['source']['path']).read_bytes()
    pe = struct.unpack_from('<I', sample, 60)[0]
    base = struct.unpack_from('<I', sample, pe + 52)[0]
    count = struct.unpack_from('<H', sample, pe + 6)[0]
    table = pe + 24 + struct.unpack_from('<H', sample, pe + 20)[0]
    sections = [struct.unpack_from('<4I', sample, table + i * 40 + 8) for i in range(count)]

    def original(address, size):
        for _, va, raw_size, raw in sections:
            at = address - base - va
            if 0 <= at <= raw_size - size:
                return sample[raw + at:raw + at + size]
        raise AssertionError((hex(address), size))

    def records(path):
        return {r['evidence_id']:r for r in read(path)['evidence_bundle']['records']}

    snapshot = PRIVATE / 'rea.snapshot.json'
    before = records(R / prior['snapshot']['path'])
    after = records(snapshot)
    assert before.keys() <= after.keys()
    close = read(PRIVATE / 'rea-closure.json')
    assert not close['open'] and not close['cleanup_pending']
    assert len(before) == 458 and len(after) == close['close']['evidence_records'] == 478

    def admit(r):
        assert r['subject']['digest']['sha256'] == prior['source']['sha256']
        assert r['analysis_profile']['digest'] == prior['analysis_profile']
        return r

    raw = {}
    for label,(address,length) in WINDOWS.items():
        choices = [r for r in after.values() if r['operation'] == 'read_bytes'
                   and r['normalized_result']['address'] == hex(address)
                   and r['normalized_result']['returned_bytes'] == length]
        assert choices,label
        row = admit(choices[-1])
        result = row['normalized_result']
        material = bytes.fromhex(result['bytes_hex'])
        assert result['complete'] and len(material) == length and material == original(address,length)
        raw[label] = dict(address=hex(address), bytes=length, sha256=sha(material), evidence_id=row['evidence_id'])
    assert struct.unpack('<I',original(0x433a08,4))[0] == 0x4323b6
    assert original(0x433877,1) == b'\x04'
    assert struct.unpack('<I',original(0x4337e0,4))[0] == 0x432642

    helpers = {}
    dossiers = {}
    for address in HELPERS:
        matches = [r for r in after.values() if r['operation'] == 'analyze_function'
                   and r['normalized_result']['procedure']['address'] == hex(address)]
        assert matches,hex(address)
        row = admit(matches[-1])
        p = row['normalized_result']['procedure']['body']
        assert p['available'] and p['contains_entry']
        ranges = []
        for r in p['ranges']:
            start,end = int(r['start'],16),int(r['end'],16)
            material = original(start,end-start+1)
            ranges.append(dict(**r,bytes=len(material),sha256=sha(material)))
        assert sum(r['bytes'] for r in ranges) == p['total_bytes']
        dossiers[address] = row['normalized_result']
        helpers[hex(address)] = dict(ranges=ranges,evidence_id=row['evidence_id'])
    wait = dossiers[0x434b90]['pseudocode']
    assert '0x1c20 <' in wait and 'FUN_00434990(param_1,*piVar5,0xb)' in wait
    assert 'FUN_00434990(param_1,*piVar5,0x26)' in wait
    assert 'FUN_00437a90()' in dossiers[0x437b30]['pseudocode']
    assert 'DAT_00599df8 = DAT_0058fb30' in dossiers[0x437a90]['pseudocode']

    source = read(A / 'source-check.json')
    main_ref = source['retained_derived_main']['evidence']
    same(main_ref)
    instructions = next(e for e in read(R / main_ref['path'])['entries'] if e['requestedEntry']=='004260b0')['instructions']
    body_ref = source['canonical_cache_layers'][0]
    same(body_ref)
    body = read(R / body_ref['path'])['0x40a120']['assembly']

    def derived(start,end):
        selected = [r for r in instructions if start <= int(r['address'],16) < end]
        cursor=start
        for row in selected:
            b=bytes.fromhex(row['bytesHex'])
            assert int(row['address'],16) == cursor and b == original(cursor,len(b))
            cursor+=len(b)
        assert cursor == end
        return selected,dict(start=hex(start),end_exclusive=hex(end),instructions=len(selected),
            bytes=end-start,sha256=sha(original(start,end-start)))

    producer, producer_info = derived(0x4323b6,0x432616)
    release, release_info = derived(0x432642,0x432677)
    units, units_info = derived(0x429462,0x429476)
    assert any(r['text']=='MOV dword ptr [0x00594b60],EDX' for r in units)
    assert any(r['text']=='IDIV ECX' for r in units)
    assert sum(r['text']=='CALL 0x00434af0' for r in producer)==5
    assert [r['text'] for r in release if r['text'].startswith('CALL')] == [
        'CALL 0x00434b90','CALL 0x00419f60','CALL 0x00436930']
    for label, start, end in [('skill404',0x431118,0x4323b6),('skill405',0x4323b6,0x432616)]:
        rows = [r['text'] for r in instructions if start<=int(r['address'],16)<end]
        assert any('0x00594b60' in text for text in rows) and not any('0x00599bb0' in text for text in rows),label

    # Direct rel32 targets in the 135 activation route.
    calls = {}
    for address,target in [(0x412413,0x510000),(0x41242a,0x422080),(0x412430,0x434b60),
                           (0x412460,0x434b60),(0x4124b8,0x422d60),(0x4124c1,0x434b60),
                           (0x4124e2,0x4232e0),(0x4124e8,0x434b60)]:
        op, rel = struct.unpack('<Bi',original(address,5))
        assert op==0xe8 and address+5+rel==target
        assert f'{address:#x}: CALL 0x{target:08x}' in body
        calls[hex(address)]=hex(target)
    field_ref=source['retained_derived_field_callback']['evidence']
    same(field_ref)
    field=next(e for e in read(R / field_ref['path'])['entries'] if e['requestedEntry']=='00421f90')
    for r in field['instructions']:
        b=bytes.fromhex(r['bytesHex'])
        assert b==original(int(r['address'],16),len(b))
    assert field['derivedBodyBytes']==219

    result=dict(schema='moli.stage221.recovery-and-transformation-source.v1',source=prior['source'],tool=prior['tool'],
        analysis_profile=prior['analysis_profile'],snapshot=info(snapshot),closed=True,
        retained_records=len(after),new_retained_records=len(after)-len(before),
        finite_evidence_total=prior['finite_evidence_total']+len(after)-len(before),
        raw_windows=raw,helpers=helpers,derived_main=dict(receipt=main_ref,producer=producer_info,release=release_info,skill_units=units_info),
        action135=dict(retained_body=body_ref,verified_direct_calls=calls),
        field_callback=dict(receipt=field_ref,entry='0x421f90',bytes=219,authority='derived'),
        original_execution=0,phase_complete=False)
    (A / 'recovery-source-check.json').write_text(json.dumps(result,indent=2)+'\n')
    print(json.dumps({k:result[k] for k in ('retained_records','new_retained_records','finite_evidence_total','closed')}))


if __name__ == '__main__':
    main()
