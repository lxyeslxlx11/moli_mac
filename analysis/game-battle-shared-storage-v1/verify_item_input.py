#!/usr/bin/env python3
"""Verify the old client's inventory consumers and battle item input against the PE."""
import json
import struct
import sys

sys.dont_write_bytecode = True
from verify_formation import records, sha
from verify_source import A, P, R, info, read, same

PRIVATE = P / 'item-input'
WINDOWS = (
    (0x567d7c, 8), (0x567bfc, 4), (0x4f9184, 5), (0x4f9297, 5),
    (0x54ae60, 24), (0x559a64, 4), (0x52e358, 48), (0x48aa80, 395),
    (0x48cf50, 1185), (0x48d2b4, 672), (0x48bd0a, 53), (0x534184, 24),
)
HELPERS = (
    0x437080, 0x437410, 0x4374e0, 0x46c4e0, 0x46c6b0, 0x48b810, 0x4e1d20,
    0x4f25a0, 0x4f2c40, 0x4f88f0, 0x4fee90, 0x5009b0, 0x510de0, 0x510e50, 0x5111a0,
)


def main():
    prior = read(A/'mp-items-source-check.json')
    for key in ('source', 'snapshot'):
        same(prior[key])
    sample = (R/prior['source']['path']).read_bytes()
    pe = struct.unpack_from('<I', sample, 60)[0]
    base = struct.unpack_from('<I', sample, pe+52)[0]
    table = pe+24+struct.unpack_from('<H', sample, pe+20)[0]
    count = struct.unpack_from('<H', sample, pe+6)[0]
    sections = [struct.unpack_from('<4I', sample, table+i*40+8) for i in range(count)]

    def original(address, length):
        for _, va, size, offset in sections:
            at = address-base-va
            if 0 <= at <= size-length:
                return sample[offset+at:offset+at+length]
        raise AssertionError((hex(address), length))

    def call(address, target):
        raw = original(address, 5)
        assert raw[0] == 0xe8 and address+5+struct.unpack('<i', raw[1:])[0] == target, hex(address)

    def admitted(row):
        assert row['subject']['digest']['sha256'] == prior['source']['sha256']
        assert row['analysis_profile']['digest'] == prior['analysis_profile']
        return row

    snapshot = PRIVATE/'rea.snapshot.json'
    before = set(records(R/prior['snapshot']['path']))
    after = records(snapshot)
    closure = read(PRIVATE/'rea-closure.json')
    assert before <= after.keys() and len(before) == 779
    assert len(after) == closure['close']['evidence_records'] == 841
    assert not closure['open'] and not closure['cleanup_pending']
    assert closure['close']['bytes'] == snapshot.stat().st_size
    windows = []
    for address, length in WINDOWS:
        row = admitted(next(r for r in after.values() if r['operation'] == 'read_bytes'
                            and r['normalized_result']['address'] == hex(address)
                            and r['normalized_result']['returned_bytes'] == length))
        value = row['normalized_result']
        raw = bytes.fromhex(value['bytes_hex'])
        assert value['complete'] and raw == original(address, length)
        windows.append(dict(address=hex(address), bytes=length, sha256=sha(raw), evidence_id=row['evidence_id']))
    assert original(0x567d7c, 12)[:4] == b'@Y)\0'
    assert original(0x567d84, 4) == b'?l)\0' and original(0x567bfc, 4) == b'$T5\0'
    assert original(0x534184, 6) == b'Q|%X|\0' and original(0x534194, 8) == b'I|%X|%X\0'
    assert struct.unpack('<2I', original(0x54afa8, 8)) == (0x54ae60, 0x48aa80)
    assert struct.unpack('<I', original(0x559a64, 4))[0] == 0x52e358
    for address, target in (
        (0x4f9184, 0x4f25a0), (0x4f9297, 0x4f2c40), (0x48d33c, 0x437410),
        (0x48d3af, 0x4f88f0), (0x48d454, 0x4374e0), (0x48d4ca, 0x4f88f0),
        (0x48bd2d, 0x4f88f0), (0x48ab70, 0x46c6b0), (0x48d069, 0x4f88f0),
    ):
        call(address, target)
    assert original(0x48d146, 2) == bytes.fromhex('8beb')
    assert original(0x48d44b, 7) == bytes.fromhex('0fbf96fc6ff500')
    assert original(0x48d354, 8) == bytes.fromhex('f604851a3df50008')
    assert original(0x48d3ec, 7) == bytes.fromhex('f686fa6ff50001')
    assert original(0x48d3f9, 8) == bytes.fromhex('6683be0070f50000')

    helpers, dossiers = {}, {}
    for address in HELPERS:
        row = admitted(next(r for r in after.values() if r['operation'] == 'analyze_function'
                            and r['normalized_result']['procedure']['address'] == hex(address)))
        result = row['normalized_result']
        dossiers[address] = result['pseudocode']
        body = result['procedure']['body']
        assert body['available'] and body['contains_entry']
        spans = []
        for span in body['ranges']:
            start, end = int(span['start'], 16), int(span['end'], 16)
            raw = original(start, end-start+1)
            spans.append(dict(**span, bytes=len(raw), sha256=sha(raw)))
        assert sum(r['bytes'] for r in spans) == body['total_bytes']
        helpers[hex(address)] = dict(ranges=spans, evidence_id=row['evidence_id'])
    receive = dossiers[0x4f25a0]
    assert all(t in receive for t in ('* 0x65c', 'DAT_00f536cc', '0x1d', 'local_504 + 0xe',
                                      'DAT_00f53d04', 'DAT_00f53d1a', 'DAT_00f53d1c', 'DAT_00f53d1e'))
    assert '0xf5e8dc' in dossiers[0x437410] and '0x32e' in dossiers[0x437410]
    assert 'FUN_005009b0' in dossiers[0x4f2c40]
    assert 's_I__X__X_00534194' in dossiers[0x48b810]
    old = read(R/'analysis/game-battle-input-v1/source-check.json')
    ref = next(r['export'] for r in old['derived_callbacks'] if r['entry']=='0x48aa80')
    same(ref)
    callback = next(r for r in read(R/ref['path'])['functions'] if int(r['entry'], 16)==0x48aa80)
    for row in callback['instructions']:
        raw = bytes.fromhex(row['bytes'])
        assert raw == original(int(row['address'], 16), len(raw))
    assert sum(len(r['bytes'])//2 for r in callback['instructions'])==395

    proof = dict(
        schema='moli.37c4-battle-item-input-source.v1', source=prior['source'], analysis_profile=prior['analysis_profile'],
        tool=prior['tool'], closed=True, snapshot=info(snapshot), session_closure=info(PRIVATE/'rea-closure.json'),
        retained_records=len(after), new_retained_records=len(after)-len(before), raw_windows=windows, helpers=helpers,
        derived_menu_callback=dict(source=ref, address='0x48aa80', instructions=121, bytes=395),
        facts=dict(
            records='?l) dispatches to 4f25a0. Updates use 14 fields and 65c-byte rows starting at f536cc. Slots 8 through 27 are the bag.',
            fields='Name is field 2 with a 28-byte write limit. Fields 5, 7, 8 and 10 supply category, flags, signed 16-bit target mask and identification state.',
            swap='@Y) uses 4f2c40 and 5009b0 to swap two full rows.',
            menu='48aa80 opens window 1b for command index 3. The item selection body reads the bag index plus 8.',
            use='Non-gear requires +64e bit 0 and nonzero +654. 4374e0 selects a target, or 48d49f sends the local slot immediately.',
            equip='Categories 0 through 7 send Q with a trailing separator. With both hand slots filled and no free bag slot, 48d354 checks bit 3 on the raw grid-index row.',
            send='48bd2d, 48d4ca and 48d3af call 4f88f0 using one $T5 byte field. I has no trailing delimiter.',
        ),
        pending=['Native window hit testing, weapon removal shortcut and ordinary bag UI', 'Official/current and actual device acceptance'],
        VM_actions=0, original_execution=0, official_sessions=0, phase_complete=False,
    )
    (A/'item-input-source-check.json').write_text(json.dumps(proof, indent=2)+'\n')
    print(f"REA retained {len(after)} (+{len(after)-len(before)}), {len(windows)} byte windows, {len(helpers)} helpers, closed")


if __name__=='__main__':
    main()
