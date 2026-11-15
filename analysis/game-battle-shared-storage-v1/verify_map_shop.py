#!/usr/bin/env python3
"""Bind ordinary shop observations to the fixed PE and retained REA evidence."""
import json
import struct
import sys

sys.dont_write_bytecode = True
from verify_formation import records, sha
from verify_source import A, P, R, info, read, same

PRIVATE = P / 'map-shop'
WINDOWS = (
    (0x4a8fd0, 709), (0x4a92a0, 1026), (0x4ab9ab, 15), (0x4aa795, 39), (0x4ae255, 85),
    (0x4ac28b, 76), (0x4abbe0, 80), (0x4abd10, 48), (0x4ac11c, 24), (0x4abd3d, 208),
    (0x4abe0d, 197), (0x4ac0af, 109), (0x4acc2b, 70), (0x4ace35, 174),
    (0x4ad908, 24), (0x4ae0fc, 96), (0x4ad9cb, 57), (0x4addcb, 104), (0x4ade38, 200),
    (0x4efee7, 38), (0x5633ec, 10), (0x5637b0, 24), (0x564754, 4), (0x53459c, 8), (0x56bd40, 8),
)
HELPERS = (
    0x48fce0, 0x4f4410, 0x4a8fd0, 0x4a92a0, 0x4a9c80, 0x4aa4e0, 0x4aa8a0, 0x4aa910,
    0x4aa960, 0x4aacf0, 0x4aadc0, 0x437410, 0x4efad0, 0x510d80, 0x510de0, 0x510e50, 0x4f8240,
)


def main():
    prior_path = A / 'actor-interaction-source-check.json'
    prior = read(prior_path)
    same(prior['source'])
    same(prior['snapshot'])
    sample = (R / prior['source']['path']).read_bytes()
    pe = struct.unpack_from('<I', sample, 60)[0]
    base = struct.unpack_from('<I', sample, pe + 52)[0]
    table = pe + 24 + struct.unpack_from('<H', sample, pe + 20)[0]
    count = struct.unpack_from('<H', sample, pe + 6)[0]
    sections = [struct.unpack_from('<4I', sample, table + i * 40 + 8) for i in range(count)]

    def original(address, size):
        for _, va, raw_size, raw in sections:
            offset = address - base - va
            if 0 <= offset <= raw_size - size:
                return sample[raw + offset:raw + offset + size]
        raise AssertionError((hex(address), size))

    def admitted(row):
        assert row['subject']['digest']['sha256'] == prior['source']['sha256']
        assert row['analysis_profile']['digest'] == prior['analysis_profile']
        return row

    snapshot = PRIVATE / 'rea.snapshot.json'
    before = set(records(R / prior['snapshot']['path']))
    after = records(snapshot)
    closure_path = PRIVATE / 'rea-closure.json'
    closure = read(closure_path)
    assert not closure['open'] and not closure['cleanup_pending'] and closure['package'] == '6.7.0'
    assert len(before) == prior['retained_records'] and before <= after.keys()
    assert len(after) == closure['close']['evidence_records']
    assert snapshot.stat().st_size == closure['close']['bytes']

    windows = []
    for address, size in WINDOWS:
        row = admitted(next(r for r in after.values() if r['operation'] == 'read_bytes'
                            and r['normalized_result']['address'] == hex(address)
                            and r['normalized_result']['requested_bytes'] == size))
        value = row['normalized_result']
        content = bytes.fromhex(value['bytes_hex'])
        assert value['complete'] and len(content) == value['returned_bytes'] == size
        assert content == original(address, size)
        windows.append(dict(address=hex(address), bytes=size, sha256=sha(content), evidence_id=row['evidence_id']))

    empty_address = 0x5849c8
    virtual_size, va, raw_size, _ = next(s for s in sections if base + s[1] <= empty_address < base + s[1] + s[0])
    offset = empty_address - base - va
    assert raw_size <= offset < virtual_size
    empty_text = admitted(next(r for r in after.values() if r['operation'] == 'read_bytes'
                              and r['normalized_result']['address'] == hex(empty_address)))
    assert empty_text['normalized_result']['complete'] and empty_text['normalized_result']['bytes_hex'] == '00'
    zero_fill = dict(address=hex(empty_address), section_address=hex(base + va), raw_bytes=raw_size,
                     virtual_bytes=virtual_size, evidence_id=empty_text['evidence_id'])

    helpers = {}
    for address in HELPERS:
        row = admitted(next(r for r in after.values() if r['operation'] == 'analyze_function'
                            and r['normalized_result']['procedure']['address'] == hex(address)))
        body = row['normalized_result']['procedure']['body']
        assert body['available'] and body['contains_entry']
        spans = []
        for span in body['ranges']:
            start, end = int(span['start'], 16), int(span['end'], 16)
            content = original(start, end - start + 1)
            spans.append(dict(**span, bytes=len(content), sha256=sha(content)))
        assert sum(span['bytes'] for span in spans) == body['total_bytes']
        helpers[hex(address)] = dict(evidence_id=row['evidence_id'], ranges=spans)

    for address, expected in {
        0x4efee7: 'a9010000087416556a7c53', 0x4efefa: 'a32436f500',
        0x4abd10: '8a44240481ec2802000084c0535556570f85eb030000',
        0x4abd44: '89442414', 0x4abda3: '5250', 0x4abe6e: '8b45045250',
        0x4ac0db: '526a005051', 0x4ac10c: '80cd80', 0x4acc3e: '68c84958006a025152',
        0x4aa795: '8a04d584bfc30084c0', 0x4addf1: '83f914', 0x4ac290: '39057c7fc000',
        0x4ace45: '8a8884bfc30084c9', 0x4aceb8: '8b887cbfc30085c9',
        0x4ade8e: '81f940420f00', 0x56bd40: '0a6e2c637c7a5c79',
    }.items():
        content = bytes.fromhex(expected)
        assert original(address, len(content)) == content, hex(address)
    for address, target in (
        (0x48ff83, 0x4a8fd0), (0x48ff92, 0x4a92a0), (0x48ffc6, 0x4a9c80),
        (0x4efef2, 0x510e50), (0x4ac28b, 0x437410), (0x4ac0c1, 0x511180),
        (0x4ac0fd, 0x4f8240), (0x4acc63, 0x4f8240), (0x4ade29, 0x4aa910),
    ):
        opcode, relative = struct.unpack('<Bi', original(address, 5))
        assert opcode == 0xe8 and address + 5 + relative == target, hex(address)
    assert struct.unpack('<2I', original(0x4ac11c, 8)) == (0x4abd3d, 0x4abe0d)
    assert struct.unpack('<2I', original(0x4ae0fc, 8)) == (0x4ad9d2, 0x4ada4f)
    assert struct.unpack('<2I', original(0x4ae144, 8)) == (0x4addcb, 0x4ade38)
    assert original(0x5633ec, 6) == b'%d|%d\0'
    assert original(0x564754, 2) == b'|\0'
    assert original(0x53459c, 4) == b'???\0'
    assert original(0x5637b0, 24).split(b'\0', 1)[0].decode('cp936') == '＊现在无法装备'

    catalog = read(A.parent / 'game-legacy-message-v1/dispatch-catalog.json')
    for side, name, entry, tag, fields in (
        ('incoming', 'consumer', '0x4f4410', 'Q?m', ['int32'] * 4 + ['bytes']),
        ('incoming', 'consumer', '0x4efad0', 'E(9', ['bytes']),
        ('outgoing', 'producer', '0x4f8240', '/1I', ['int32'] * 5 + ['bytes']),
    ):
        row = next(r for r in catalog[side] if r[name] == entry)
        assert row['tag'] == tag and row['fields'] == fields
        assert original(int(row['tag_address'], 16), 4) == tag.encode() + b'\0'

    proof = dict(
        schema='moli.37c4-ordinary-map-shop-source.v1', source=prior['source'], tool=prior['tool'],
        analysis_profile=prior['analysis_profile'], previous_observation=info(prior_path), snapshot=info(snapshot),
        session_closure=info(closure_path), closed=True, retained_records=len(after),
        new_retained_records=len(after) - len(before), raw_windows=windows, zero_filled_cancel_text=zero_fill, helpers=helpers,
        facts=dict(
            dispatch='48fce0 dispatches ordinary Q?m modes 6 and 7 to 4a8fd0 and 4a92a0. Mode 0x14 uses the separate 4a9c80 branch. The ordinary shop uses 46c6b0 window 0x35.',
            purchase='Five header fields and six fields per row, up to twenty rows. The rows hold name, graphic, unit price, description, low-byte equipment eligibility and stack size. On a zero byte 4aa795 uses the CP936 equipment notice at 5637b0. The ordinary quantity path 4addcb uses row presence and caps the selected amount at twenty per row. 4aa910 sums ceil(quantity / stack size), using two for nonpositive size. 4ac28b checks empty bag slots against this result.',
            sale='Three header fields and ten fields per row, up to twenty rows. 4a92a0 assigns the first quoted row matching each absolute bag slot 8 through 27. 4ace45 rejects the zero availability byte and 4aceb8 uses the signed byte as the initial amount with a fallback of one. 4ade38 increments up to the quote amount. 0x100 changes the label and 0x200 selects a presentation variant. 4aadc0 sums price times amount.',
            gold='E(9 consumer 4efad0 stores mask 0x08000001 at f53624. 4ac257 compares the purchase total against this field. The sale uses a 1000000 gold ceiling.',
            confirmation='4abd10 dispatches accepted confirmation through table 4ac11c. Both loops scan source order and append nonzero quantities as %d|%d pairs. 4abd3d uses a zero-based offer ordinal and 4abe0d loads the bag slot from quantity storage plus four. 4ac0c1 applies inner escaping, then 4ac0fd sends /1I with logical X/Y, sequence, actor ID, zero and text.',
            cancellation='4acc63 sends /1I with the same position and context, button two and empty bytes. The server close still uses the second integer equal to -1 and checks mode and actor.',
        ),
        portable_choices=['Reject orders with unknown gold or malformed price. Invalidate sale quotes on a newer bag slot revision and limit quantity to the live stack.',
                          'Retain text and numeric resource identifiers while rendering the dialog with browser controls.'],
        pending=['Live shop initiation and acceptance', 'Other shop and trade modes, native art and presentation', 'Physical devices, native WeChat game page and current release'],
        VM_actions=0, original_execution=0, official_sessions=0, phase_complete=False,
    )
    (A / 'map-shop-source-check.json').write_text(json.dumps(proof, indent=2) + '\n')
    print(f"REA retained {len(after)} (+{len(after) - len(before)}), {len(windows)} byte windows, {len(helpers)} helpers, closed")


if __name__ == '__main__':
    main()
