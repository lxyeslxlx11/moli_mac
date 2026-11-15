#!/usr/bin/env python3
"""Check item-currency exchange against the fixed PE and retained REA evidence."""
import json
import struct
import sys

sys.dont_write_bytecode = True
from verify_formation import records, sha
from verify_source import A, P, R, info, read, same

PRIVATE = P / 'shop-exchange'
WINDOWS = (
    (0x48fee4, 24), (0x4901f8, 116), (0x49026c, 45), (0x490068, 24), (0x4a96b0, 758),
    (0x4a97c6, 44), (0x4a9802, 44), (0x4a98bc, 150), (0x4f279c, 90), (0x4abaf1, 93),
    (0x4adb01, 190), (0x4adc07, 86), (0x4adcaf, 34), (0x4ad4ce, 106), (0x4ad908, 24),
    (0x4ae0fc, 96), (0x4adf0e, 125), (0x4ac226, 31), (0x4acbac, 24), (0x4ac63d, 380),
    (0x4ac11c, 24), (0x4abed2, 209), (0x5633ec, 10), (0x564aa4, 58), (0x4ac0af, 109), (0x4acc2b, 70),
)
HELPERS = (
    0x4f4410, 0x48fce0, 0x4a96b0, 0x4f25a0, 0x4aae70, 0x437410, 0x4ab290, 0x4ab2e0, 0x4ab1e0, 0x4a99b0, 0x4f8240,
)


def main():
    prior_path = A / 'shop-service-source-check.json'
    prior = read(prior_path)
    same(prior['source'])
    same(prior['snapshot'])
    sample = (R / prior['source']['path']).read_bytes()
    pe = struct.unpack_from('<I', sample, 60)[0]
    base = struct.unpack_from('<I', sample, pe + 52)[0]
    table = pe + 24 + struct.unpack_from('<H', sample, pe + 20)[0]
    count = struct.unpack_from('<H', sample, pe + 6)[0]
    sections = [struct.unpack_from('<4I', sample, table + i * 40 + 8) for i in range(count)]

    def file_offset(address, size):
        for _, va, raw_size, raw in sections:
            offset = address - base - va
            if 0 <= offset <= raw_size - size:
                return raw + offset
        raise AssertionError((hex(address), size))

    def original(address, size):
        at = file_offset(address, size)
        return sample[at:at + size]

    def admitted(row):
        assert row['subject']['digest']['sha256'] == prior['source']['sha256']
        assert row['analysis_profile']['digest'] == prior['analysis_profile']
        return row

    snapshot = PRIVATE / 'rea.snapshot.json'
    closure_path = PRIVATE / 'rea-closure.json'
    closure = read(closure_path)
    before = set(records(R / prior['snapshot']['path']))
    after = records(snapshot)
    assert not closure['open'] and not closure['cleanup_pending'] and closure['package'] == '6.7.0'
    assert len(before) == prior['retained_records'] and before <= after.keys()
    assert len(after) == closure['close']['evidence_records'] and snapshot.stat().st_size == closure['close']['bytes']

    windows = []
    for address, size in WINDOWS:
        row = admitted(next(r for r in after.values() if r['operation'] == 'read_bytes'
                            and r['normalized_result']['address'] == hex(address)
                            and r['normalized_result']['requested_bytes'] == size))
        value = row['normalized_result']
        content = bytes.fromhex(value['bytes_hex'])
        assert value['complete'] and len(content) == value['returned_bytes'] == size
        assert content == original(address, size)
        windows.append(dict(address=hex(address), file_offset=file_offset(address, size), bytes=size,
                            sha256=sha(content), evidence_id=row['evidence_id']))

    helpers = {}
    for address in HELPERS:
        row = admitted(next(r for r in after.values() if r['operation'] == 'analyze_function'
                            and r['normalized_result']['procedure']['address'] == hex(address)))
        body = row['normalized_result']['procedure']['body']
        assert body['available'] and body['contains_entry']
        spans = []
        for span in body['ranges']:
            start, end = int(span['start'], 16), int(span['end'], 16)
            size = end - start + 1
            spans.append(dict(**span, bytes=size, file_offset=file_offset(start, size), sha256=sha(original(start, size))))
        assert sum(span['bytes'] for span in spans) == body['total_bytes']
        helpers[hex(address)] = dict(evidence_id=row['evidence_id'], ranges=spans)

    for address, expected in {
        0x48feef: '8a886c024900ff248df8014900', 0x4a96b6: 'c605f021c20002',
        0x4a97c7: '6a066a7c56', 0x4a97d6: '6a1c6a076a7c56a3b439c400',
        0x4a9807: 'bd08000000', 0x4a98e5: '85c07f0ac7833306000001000000',
        0x4f279d: '8d4e0a', 0x4f27b3: '89830c3df500',
        0x4f27c8: '8d460c', 0x4f27e8: '8983103df500',
        0x4abaff: 'b80c3df500', 0x4abb0a: '6639a8c0f9ffff740739107503034804',
        0x4abb1f: '3d1ceff500', 0x4adb2f: '8b0df8b5c3003bc8',
        0x4adb5c: 'bb08000000b8f06ff500', 0x4adb70: '3950fc75092b087812',
        0x4adb84: '3d20eff500', 0x4adb92: 'b878bfc300',
        0x4adf56: '8bb17cbfc300', 0x4adf65: '8d4430ff99f7fe898178bfc300',
        0x4abed2: '33c0c6442438008944241489442410', 0x4abf35: '8b4424145250',
        0x4abf87: '81c55806000042', 0x4ac0db: '526a005051', 0x4acc3e: '68c84958006a025152',
    }.items():
        content = bytes.fromhex(expected)
        assert original(address, len(content)) == content, hex(address)
    for address, target in (
        (0x49006e, 0x4a96b0), (0x4a97cc, 0x510e50), (0x4a97e2, 0x510d80), (0x4a97ec, 0x5111a0),
        (0x4f27ab, 0x510e50), (0x4f27cf, 0x510e50), (0x4adb8b, 0x437410),
        (0x4adf92, 0x4ab290), (0x4adf97, 0x4ab2e0), (0x4ac0c1, 0x511180),
        (0x4ac0fd, 0x4f8240), (0x4acc63, 0x4f8240),
    ):
        opcode, relative = struct.unpack('<Bi', original(address, 5))
        assert opcode == 0xe8 and address + 5 + relative == target, hex(address)
    mode_index = original(0x49026c, 45)[0x1c]
    assert mode_index == 17 and struct.unpack('<29I', original(0x4901f8, 116))[mode_index] == 0x49006d
    assert struct.unpack('<6I', original(0x4ae0fc, 24))[2] == 0x4adb01
    assert struct.unpack('<6I', original(0x4ae144, 24))[2] == 0x4adf0e
    assert struct.unpack('<6I', original(0x4ad908, 24))[2] == 0x4ad4ce
    assert struct.unpack('<6I', original(0x4acbac, 24))[2] == 0x4ac63d
    assert struct.unpack('<6I', original(0x4ac11c, 24))[2] == 0x4abed2
    assert original(0x5633ec, 6) == b'%d|%d\0' and original(0x564754, 2) == b'|\0'
    assert '交换' in original(0x564aa4, 24).split(b'\0', 1)[0].decode('cp936')
    assert 0xf5ef1c - 0xf53d0c == 28 * 0x65c
    assert 0xf56ff0 - 0xf53d10 == 8 * 0x65c
    assert 0xf5ef20 - 0xf56ff0 == 20 * 0x65c

    catalog = read(A.parent / 'game-legacy-message-v1/dispatch-catalog.json')
    for side, name, entry, tag, fields in (
        ('incoming', 'consumer', '0x4f4410', 'Q?m', ['int32'] * 4 + ['bytes']),
        ('incoming', 'consumer', '0x4f25a0', '?l)', ['bytes']),
        ('outgoing', 'producer', '0x4f8240', '/1I', ['int32'] * 5 + ['bytes']),
    ):
        row = next(r for r in catalog[side] if r[name] == entry)
        assert row['tag'] == tag and row['fields'] == fields
        assert original(int(row['tag_address'], 16), 4) == tag.encode() + b'\0'

    proof = dict(
        schema='moli.37c4-item-exchange-source.v1', source=prior['source'], tool=prior['tool'],
        analysis_profile=prior['analysis_profile'], previous_observation=info(prior_path), snapshot=info(snapshot),
        session_closure=info(closure_path), closed=True, retained_records=len(after),
        new_retained_records=len(after) - len(before), raw_windows=windows, helpers=helpers,
        facts=dict(
            dispatch='Q?m mode 0x1c uses byte-table index 17 and target 49006d, which calls 4a96b0 and sets internal mode 2. Mode 0x1f has the separate 4a99b0 parser.',
            rows='The header has window graphic, title, three explanatory fields, currency code and a 28-byte currency label. Up to twenty rows follow in five-field groups: name, graphic, unit fee, stack size, description. 4a98e9 substitutes stack size one when the provided size is nonpositive.',
            balance='The ?l) record writes its eleventh field to f53d0c and thirteenth field to f53d10. 4abaff reads matching occupied slots at stride 0x65c from slot 0 through 27. The selected fee is sum of each row amount times unit fee (4ab290).',
            capacity='The first budget branch at 4adb2f compares selected fee with the currency balance. 4adb66 starts with bag slot 8 and subtracts each occupied matching stack in ascending slot order. 4adb77 stops at the first partially paid stack. The completely covered count adds to 437410 empty slots. 4adf65 computes each selected row capacity as ceil(amount / stack size).',
            response='The confirmation selection table routes mode 2 to 4ac63d and the accepted callback routes it to 4abed2. 4abed9 initializes the zero-based row counter, 4abf35 uses it with the selected quantity, and 4abf87 advances one row. The shared path escapes the list and sends /1I [X,Y,sequence,actor,0,text]. The existing cancel callback sends button 2 with empty text.',
        ),
        portable_choices=['Use the native final capacity equation with direct browser quantity entry and recheck latest slots on submit. Count positive matching quantities for capacity and funds.',
                          'Use exact bounded integers and the existing reply length guard. Apply inventory only from inbound events.'],
        pending=['Other shop and trade modes, source UI shortcuts and art, live currency deductions and stock replies',
                 'Physical mobile, WeChat game page and devices, current release, official acceptance'],
        VM_actions=0, original_execution=0, official_sessions=0, phase_complete=False,
    )
    (A / 'shop-exchange-source-check.json').write_text(json.dumps(proof, ensure_ascii=False, indent=2) + '\n')
    print(f"REA retained {len(after)} (+{len(after) - len(before)}), {len(windows)} file windows, {len(helpers)} functions, closed")


if __name__ == '__main__':
    main()

