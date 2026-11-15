#!/usr/bin/env python3
"""Bind the finite SKL400–402 observations to the fixed original PE."""
import hashlib
import json
import struct
import sys

sys.dont_write_bytecode = True
from verify_source import A, P, R, info, read, same

PRIVATE = P / 'formation'
WINDOWS = {
    'producer_dispatch': (0x4339f4, 16),
    'wait_indices': (0x433872, 8),
    'wait_entry': (0x4337d8, 4),
    'skill402_producer': (0x430f8d, 395),
    'action135_dispatch': (0x419650, 4),
    'action135_signal_gate': (0x4121b3, 192),
    'action206_to_237_dispatch': (0x41976c, 128),
    'action212_effect_kind': (0x4120ba, 32),
    'action206_weather_write': (0x414630, 32),
    'overlay_group1': (0x533ab4, 64),
    'overlay_group3': (0x533b34, 64),
}
HELPERS = (
    0x41a240, 0x41b4a0, 0x41b640, 0x41dc00, 0x434b90,
    0x437b30, 0x4653f0, 0x465410, 0x465870, 0x466a20,
)


def sha(data):
    return hashlib.sha256(data).hexdigest()


def records(path):
    return {r['evidence_id']: r for r in read(path)['evidence_bundle']['records']}


def main():
    prior = read(A / 'recovery-source-check.json')
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

    def admit(row):
        assert row['subject']['digest']['sha256'] == prior['source']['sha256']
        assert row['analysis_profile']['digest'] == prior['analysis_profile']
        return row

    def instruction_window(instructions, start, end):
        selected = [r for r in instructions if start <= int(r['address'], 16) < end]
        cursor = start
        for row in selected:
            material = bytes.fromhex(row['bytesHex'])
            assert int(row['address'], 16) == cursor
            assert material == original(cursor, len(material))
            cursor += len(material)
        assert cursor == end
        return [r['text'] for r in selected], dict(
            start=hex(start), end_exclusive=hex(end), instructions=len(selected),
            bytes=end-start, sha256=sha(original(start, end-start)),
        )

    snapshot = PRIVATE / 'rea.snapshot.json'
    before = records(R / prior['snapshot']['path'])
    after = records(snapshot)
    close = read(PRIVATE / 'rea-closure.json')
    assert close['open'] is False and close['cleanup_pending'] is False
    assert before.keys() <= after.keys()
    assert len(before) == 478 and len(after) == close['close']['evidence_records'] == 498
    assert snapshot.stat().st_size == close['close']['bytes']

    raw = {}
    for label, (address, length) in WINDOWS.items():
        row = admit(next(r for r in after.values() if r['operation'] == 'read_bytes'
                        and r['normalized_result']['address'] == hex(address)
                        and r['normalized_result']['returned_bytes'] == length))
        result = row['normalized_result']
        material = bytes.fromhex(result['bytes_hex'])
        assert result['complete'] and len(material) == length == result['requested_bytes']
        assert material == original(address, length)
        raw[label] = dict(address=hex(address), bytes=length, sha256=sha(material),
                          evidence_id=row['evidence_id'])
    dispatch = struct.unpack('<4I', original(0x4339f4, 16))
    assert dispatch == (0x430954, 0x430cac, 0x430f8d, 0x4335a3)
    assert original(0x433872, 3) == bytes([2, 2, 2])
    assert original(0x4337d8, 4) == struct.pack('<I', 0x427a0c)
    actions = {k: struct.unpack('<I', original(0x419434 + 4*k, 4))[0]
               for k in (135, 206, 207, 211, 212)}
    assert actions == {135: 0x4121b3, 206: 0x414616, 207: 0x4146ae,
                       211: 0x414966, 212: 0x411f0a}

    helpers = {}
    dossiers = {}
    for address in HELPERS:
        row = admit(next(r for r in after.values() if r['operation'] == 'analyze_function'
                         and r['normalized_result']['procedure']['address'] == hex(address)))
        dossier = row['normalized_result']
        body = dossier['procedure']['body']
        assert body['available'] and body['contains_entry']
        ranges = []
        for span in body['ranges']:
            start, end = int(span['start'], 16), int(span['end'], 16)
            material = original(start, end-start+1)
            ranges.append(dict(**span, bytes=len(material), sha256=sha(material)))
        assert sum(span['bytes'] for span in ranges) == body['total_bytes']
        helpers[hex(address)] = dict(ranges=ranges, evidence_id=row['evidence_id'])
        dossiers[address] = dossier['pseudocode']
    assert '0x1af8a' in dossiers[0x41dc00] and 'case 0x23:' in dossiers[0x41dc00]
    assert '+ 0x1024) = 2;' in dossiers[0x41b640]
    for address in (0x465410, 0x465870, 0x437b30):
        assert 'DAT_00c07884' in dossiers[address]
    xrefs = admit(next(r for r in after.values() if r['operation'] == 'xrefs'
                      and r['parameters']['address'] == '0xc07884'))
    assert {'0x414630', '0x46544b', '0x465af7'} <= set(xrefs['normalized_result'])

    source = read(A / 'source-check.json')
    main_ref = source['retained_derived_main']['evidence']
    same(main_ref)
    instructions = next(e for e in read(R / main_ref['path'])['entries']
                        if e['requestedEntry'] == '004260b0')['instructions']
    spans = {}
    for label, start, end in [('skill400', 0x430954, 0x430cac), ('skill401', 0x430cac, 0x430f8d),
                              ('skill402', 0x430f8d, 0x431118), ('phase2', 0x427a0c, 0x427a2e)]:
        assembly, spans[label] = instruction_window(instructions, start, end)
        if label == 'skill402':
            assert all(f'PUSH {op}' in assembly for op in ('0x18', '0x35', '0x26', '0x87', '0x3e', '0xd4'))
            assert assembly.count('CALL 0x00434990') == 6 and assembly.count('CALL 0x00434a90') == 1
            assert 'ADD ECX,0x1ade4' in assembly and 'MOV EAX,0xa' in assembly
        if label == 'phase2':
            assert assembly[0] == 'PUSH 0x0'
            assert [line for line in assembly if line.startswith('CALL')] == [
                'CALL 0x00434b90', 'CALL 0x00436930']

    body_ref = source['canonical_cache_layers'][0]
    same(body_ref)
    body = read(R / body_ref['path'])['0x40a120']['assembly']
    assert '0x41234f: MOV ESI, 0x192' in body
    assert original(0x41234f, 5) == bytes.fromhex('be92010000')
    assert bytes.fromhex('81bd3c10000092010000') in original(0x4121b3, 192)
    assert original(0x4120ba, 2) == bytes.fromhex('6a23')
    for address, target in [(0x41232f, 0x4fd5f0), (0x412371, 0x434a70)]:
        op, rel = struct.unpack('<Bi', original(address, 5))
        assert op == 0xe8 and address + 5 + rel == target
        assert f'{address:#x}: CALL 0x{target:08x}' in body

    derived_path = PRIVATE / 'derived-400.json'
    derived = read(derived_path)
    assert derived['originalExecution'] is False and derived['originalBytePatches'] is False
    (homing,) = derived['entries']
    assert homing['requestedEntry'] == '00422500' and not homing['functionExistedBeforeSeed']
    assert homing['derivedBodyBytes'] == 1332
    _, homing_span = instruction_window(homing['instructions'], 0x422500, 0x422a34)
    assert homing_span['instructions'] == 385
    result = dict(
        schema='moli.stage221.side-casting-source.v1', source=prior['source'], tool=prior['tool'],
        analysis_profile=prior['analysis_profile'], snapshot=info(snapshot), session_closure=info(PRIVATE / 'rea-closure.json'),
        closed=True, retained_records=len(after), new_retained_records=len(after)-len(before),
        finite_evidence_total=prior['finite_evidence_total']+len(after)-len(before), raw_windows=raw,
        dispatch={400+i: hex(address) for i, address in enumerate(dispatch)}, actions={k: hex(v) for k, v in actions.items()},
        helpers=helpers, derived_main=dict(receipt=main_ref, spans=spans),
        action135=dict(retained_body=body_ref, intermediate_gate='0x4121b3', natural_release='0x41234f'),
        weather_xrefs=dict(evidence_id=xrefs['evidence_id'], addresses=xrefs['normalized_result']),
        derived_homing=dict(receipt=info(derived_path), authority='derived', canonical=False, span=homing_span),
        original_execution=0, phase_complete=False,
    )
    (A / 'formation-source-check.json').write_text(json.dumps(result, indent=2)+'\n')
    print(json.dumps({k: result[k] for k in ('retained_records', 'new_retained_records',
                                           'finite_evidence_total', 'closed')}))


if __name__ == '__main__':
    main()
