#!/usr/bin/env python3
"""Check the fixed PE producer, queue gates and derived SKL400 callback."""
import json
import struct
import sys

sys.dont_write_bytecode = True
from verify_formation import records, sha
from verify_source import A, P, R, info, read, same

PRIVATE = P / 'pursuit'
WINDOWS = {
    'producer_dispatch': (0x4339f4, 16),
    'producer': (0x430954, 856),
    'wait_indices': (0x433872, 8),
    'wait_entry': (0x4337d8, 4),
    'action211_dispatch': (0x41976c, 128),
    'action211': (0x414966, 326),
    'action241_dispatch': (0x4197f8, 24),
    'action241': (0x4192b3, 34),
    'action29_dispatch': (0x4194a8, 4),
    'factory_type31': (0x41e732, 207),
    'pursuit': (0x422500, 1332),
    'speed_scale': (0x52d3a0, 4),
    'turn_and_bounds': (0x52d3c0, 112),
    'carry_offset': (0x52d544, 4),
    'overlay_group3': (0x533b34, 64),
}
HELPERS = (
    0x419840, 0x419ba0, 0x419e90, 0x419fd0, 0x41a030, 0x41a240, 0x41b6a0,
    0x41dc00, 0x41f2d0, 0x41f450, 0x41f520, 0x434990, 0x434a30, 0x434a70,
    0x434af0, 0x434b60, 0x434b90, 0x466a20, 0x51b4cf,
)


def main():
    prior = read(A / 'formation-source-check.json')
    for key in ('source', 'snapshot'):
        same(prior[key])
    sample = (R / prior['source']['path']).read_bytes()
    pe = struct.unpack_from('<I', sample, 60)[0]
    image_base = struct.unpack_from('<I', sample, pe+52)[0]
    section_count = struct.unpack_from('<H', sample, pe+6)[0]
    table = pe+24+struct.unpack_from('<H', sample, pe+20)[0]
    sections = [struct.unpack_from('<4I', sample, table+i*40+8) for i in range(section_count)]

    def original(address, length):
        for _, va, size, offset in sections:
            relative = address-image_base-va
            if 0 <= relative <= size-length:
                return sample[offset+relative:offset+relative+length]
        raise AssertionError((hex(address), length))

    def admit(row):
        assert row['subject']['digest']['sha256'] == prior['source']['sha256']
        assert row['analysis_profile']['digest'] == prior['analysis_profile']
        return row

    def instruction_span(rows, start, end):
        cursor = start
        for row in rows:
            material = bytes.fromhex(row['bytesHex'])
            assert int(row['address'], 16) == cursor
            assert material == original(cursor, len(material))
            cursor += len(material)
        assert cursor == end
        return dict(start=hex(start), end_exclusive=hex(end), bytes=end-start,
                    instructions=len(rows), sha256=sha(original(start, end-start)))

    snapshot = PRIVATE / 'rea.snapshot.json'
    before = records(R / prior['snapshot']['path'])
    after = records(snapshot)
    closure = read(PRIVATE / 'rea-closure.json')
    assert before.keys() <= after.keys()
    assert len(before) == 498 and len(after) == closure['close']['evidence_records'] == 528
    assert closure['open'] is False and closure['cleanup_pending'] is False
    assert snapshot.stat().st_size == closure['close']['bytes']

    raw = {}
    for name, (address, length) in WINDOWS.items():
        row = admit(next(r for r in after.values() if r['operation'] == 'read_bytes'
                         and r['normalized_result']['address'] == hex(address)
                         and r['normalized_result']['returned_bytes'] == length))
        result = row['normalized_result']
        data = bytes.fromhex(result['bytes_hex'])
        assert result['complete'] and len(data) == length and data == original(address, length)
        raw[name] = dict(address=hex(address), bytes=length, sha256=sha(data), evidence_id=row['evidence_id'])

    helpers, dossiers = {}, {}
    for address in HELPERS:
        row = admit(next(r for r in after.values() if r['operation'] == 'analyze_function'
                         and r['normalized_result']['procedure']['address'] == hex(address)))
        dossier = row['normalized_result']
        dossiers[address] = dossier
        body = dossier['procedure']['body']
        assert body['available'] and body['contains_entry']
        spans = []
        for span in body['ranges']:
            start, end = int(span['start'], 16), int(span['end'], 16)
            data = original(start, end-start+1)
            spans.append(dict(**span, bytes=len(data), sha256=sha(data)))
        assert sum(s['bytes'] for s in spans) == body['total_bytes']
        helpers[hex(address)] = dict(evidence_id=row['evidence_id'], ranges=spans)

    word = lambda address: struct.unpack('<I', original(address, 4))[0]
    real = lambda address: struct.unpack('<f', original(address, 4))[0]
    assert word(0x4339f4) == 0x430954
    assert original(0x433872, 1) == b'\x02' and word(0x4337d8) == 0x427a0c
    assert word(0x419434+211*4) == 0x414966 and word(0x419434+241*4) == 0x4192b3
    assert word(0x41e741) == 0x422500
    assert (real(0x41e84b), real(0x41e852)) == (320, 260)
    assert (real(0x52d408), real(0x52d404), real(0x52d40c), real(0x52d544)) == (840, 680, -200, 35)
    assert abs(real(0x52d3a0)-0.01) < 1e-8 and abs(real(0x52d3c8)-0.1) < 1e-8
    assert struct.unpack('<16I', original(0x533b34, 64)) == tuple(0x70e9+i//2 for i in range(16))

    main_ref = prior['derived_main']['receipt']
    same(main_ref)
    main_body = next(e for e in read(R / main_ref['path'])['entries'] if e['requestedEntry'] == '004260b0')
    producer = [r for r in main_body['instructions'] if 0x430954 <= int(r['address'],16) < 0x430cac]
    producer_span = instruction_span(producer, 0x430954, 0x430cac)
    assembly = [r['text'] for r in producer]
    assert all(f'PUSH {action}' in assembly for action in ('0xf1', '0x18', '0x35', '0x26', '0xd3', '0x3e'))
    assert 'TEST ECX,0x10000100' in assembly and 'TEST ECX,0x80000' in assembly and 'PUSH 0xff' in assembly

    retained_body = prior['action135']['retained_body']
    same(retained_body)
    body = read(R / retained_body['path'])['0x40a120']['assembly']
    calls = {}
    for address, target in [(0x414983, 0x41dc00), (0x4149e0, 0x41a240), (0x4149f8, 0x41dc00),
                            (0x414a1c, 0x434a30), (0x414a25, 0x434b60), (0x414a85, 0x41f520),
                            (0x4192ca, 0x434b60), (0x4192d0, 0x434a30)]:
        op, rel = struct.unpack('<Bi', original(address, 5))
        assert op == 0xe8 and address+5+rel == target
        assert f'{address:#x}: CALL 0x{target:08x}' in body
        calls[hex(address)] = hex(target)
    seed = dossiers[0x41a240]['pseudocode']
    assert '0x58fb14' in seed and 'DAT_00598ba4' in seed and 'FUN_0051b4cf(param_1)' in seed
    assert 'FUN_0041f2d0' in dossiers[0x41f450]['pseudocode']
    assert 'FUN_00466a20(0,1)' in dossiers[0x41f450]['pseudocode']

    homing_ref = prior['derived_homing']['receipt']
    same(homing_ref)
    derived = read(R / homing_ref['path'])
    (callback,) = derived['entries']
    assert not derived['originalExecution'] and not derived['originalBytePatches']
    assert not callback['functionExistedBeforeSeed']
    span = instruction_span(callback['instructions'], 0x422500, 0x422a34)
    assert span['instructions'] == 385
    assert span['sha256'] == raw['pursuit']['sha256']
    xref = admit(next(r for r in after.values() if r['operation'] == 'xrefs'
                      and r['parameters']['address'] == '0x422500'))
    assert xref['normalized_result'] == ['0x41e73e']
    result = dict(
        schema='moli.stage221.skill400-pursuit-source.v1', source=prior['source'], tool=prior['tool'],
        analysis_profile=prior['analysis_profile'], snapshot=info(snapshot), session_closure=info(PRIVATE / 'rea-closure.json'),
        closed=True, retained_records=len(after), new_retained_records=len(after)-len(before),
        finite_evidence_total=prior['finite_evidence_total']+len(after)-len(before), raw_windows=raw,
        helpers=helpers, producer=dict(retained_main=main_ref, span=producer_span),
        callbacks=dict(retained_body=retained_body, verified_calls=calls, dodge=hex(word(0x419434+29*4))),
        pursuit=dict(derived=homing_ref, span=span, canonical=False, pointer_writer='0x41e73e',
                     xref_evidence_id=xref['evidence_id']),
        bounds=dict(x=[-200,840], y=[-200,680], carry_offset_y=35, start=[320,260]),
        original_execution=0, phase_complete=False,
    )
    (A / 'pursuit-source-check.json').write_text(json.dumps(result, indent=2)+'\n')
    print(json.dumps({k:result[k] for k in ('retained_records','new_retained_records','finite_evidence_total','closed')}))


if __name__ == '__main__':
    main()
