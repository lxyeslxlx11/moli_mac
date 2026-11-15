#!/usr/bin/env python3
"""Verify the fixed actor lookup, ordinary dialog wire and native button identities."""
import json
import struct
import sys

sys.dont_write_bytecode = True
from verify_formation import records, sha
from verify_source import A, P, R, info, read, same

PRIVATE = P / 'actor-interaction'
WINDOWS = (
    (0x460c7d, 62), (0x43f190, 144), (0x4400e0, 159), (0x440280, 363), (0x4f4410, 133),
    (0x48fce0, 1186), (0x4908e0, 667), (0x4903e0, 896), (0x48f1b0, 496), (0x48f800, 864),
    (0x48f870, 245), (0x48fb03, 443), (0x52ee44, 72), (0x567b50, 4), (0x567c74, 4),
    (0x567bcc, 4), (0x56bd40, 8), (0x4fb795, 5), (0x43b330, 148), (0x48f0a0, 272),
    (0x48f26d, 133), (0x48f90c, 25), (0x48fc72, 66), (0x4909f7, 138), (0x4f8240, 144),
)
HELPERS = (
    0x43f190, 0x4f74e0, 0x4400e0, 0x440280, 0x4f4410, 0x48fce0, 0x4908e0, 0x48f0a0, 0x48f060, 0x48f080,
    0x4e9e20, 0x511000, 0x511060, 0x5111a0, 0x4f8240, 0x468f00, 0x4387c0, 0x4b98c0, 0x490760,
)


def main():
    prior_path = A / 'ground-pickup-source-check.json'
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
    before, after = records(R / prior['snapshot']['path']), records(snapshot)
    closure_path = PRIVATE / 'rea-closure.json'
    closure = read(closure_path)
    assert not closure['open'] and not closure['cleanup_pending'] and closure['package'] == '6.7.0'
    assert len(before) == 1015 and before.keys() <= after.keys()
    assert len(after) == closure['close']['evidence_records'] == 1094
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

    for address, expected in {
        0x460c9b: '6a085051', 0x460cb3: '6a0352', 0x43f1bd: '8d88e0010000', 0x43f1cf: '81c1f0010000',
        0x43f1de: '668b86e6feffff8b54241c23c26685c0', 0x43f1f6: '81c628010000',
        0x43f203: '83c8ff', 0x43f211: '8b04d50ca35900', 0x4400fd: '8b35e4a25900',
        0x4403ac: '392de4a25900', 0x4403b4: '892de4a25900',
        0x4f4410: 'a1304f920085c0757ba118ecc50085c07572', 0x4f4422: 'b9c8509200',
        0x4f4430: '8b44240c83f8ff7530', 0x4f4439: '8b442408',
        0x4f443d: '8b0dd4e455003bc1', 0x4f4447: '8b4c2414a1cc40c4003bc8',
        0x4f445e: 'c705d4e45500ffffffff', 0x48fcfb: '8d87bafeffff83f840', 0x48fd15: '837c241820',
        0x48feb0: 'a3d4e45500892d24b9c300893de003c2008935cc40c400',
        0x4908fc: 'a318ecc100890d1cecc100891520ecc100', 0x490979: '83fa02', 0x4909a5: 'a324ecc100',
        0x490ad8: '68e0034900', 0x48f228: 'b801000000ba06000000', 0x48f26d: '850548e8c100',
        0x48f909: '6aff50ff1564e8c100', 0x48fb03: '8b0d54e8c10085c9', 0x48fc03: '803c1000',
        0x48fc8e: '2beb52556a00ffd0', 0x490402: 'c705d4e45500ffffffff', 0x49061f: 'a124ecc100',
        0x49062b: 'f7d8', 0x490662: '51535250', 0x490694: 'c705d4e45500ffffffff',
        0x4906c6: '40', 0x490703: '526a005051', 0x490736: 'c705d4e45500ffffffff',
        0x56bd40: '0a6e2c637c7a5c79', 0x43b3a0: '891dd4e45500',
    }.items():
        expected = bytes.fromhex(expected)
        assert original(address, len(expected)) == expected, hex(address)
    for address, target in (
        (0x460c9f, 0x43f190), (0x460cb6, 0x4f74e0), (0x43f1c3, 0x403330), (0x43f1d5, 0x403330),
        (0x4fb795, 0x4f4410), (0x4f4427, 0x4034d0), (0x4f4456, 0x468f00), (0x4f447f, 0x48fce0),
        (0x4f4485, 0x440250), (0x4f448b, 0x4387c0), (0x48ff13, 0x4908e0), (0x48ff38, 0x4908e0),
        (0x49090d, 0x5111a0), (0x49099d, 0x510e50), (0x490a39, 0x490760), (0x490b17, 0x48f0a0),
        (0x490b6d, 0x48f0a0), (0x49066b, 0x4034d0), (0x490676, 0x4034d0),
        (0x490683, 0x4f8240), (0x490725, 0x4f8240),
    ):
        opcode, relative = struct.unpack('<Bi', original(address, 5))
        assert opcode == 0xe8 and address + 5 + relative == target, hex(address)

    catalog = read(A.parent / 'game-legacy-message-v1/dispatch-catalog.json')
    for side, name, entry, tag, fields in (
        ('outgoing', 'producer', '0x4f74e0', ';JE', ['int32'] * 2),
        ('incoming', 'consumer', '0x4f4410', 'Q?m', ['int32'] * 4 + ['bytes']),
        ('outgoing', 'producer', '0x4f8240', '/1I', ['int32'] * 5 + ['bytes']),
    ):
        row = next(r for r in catalog[side] if r[name] == entry)
        assert row['tag'] == tag and row['fields'] == fields
        assert original(int(row['tag_address'], 16), 4) == tag.encode() + b'\0'

    refs = {}
    for address, callers in ((0x4f74e0, [0x460cb6]), (0x43f190, [0x460c9f]), (0x4f4410, [0x4fb795])):
        row = admitted(next(r for r in after.values() if r['operation'] == 'xrefs' and r['parameters'].get('address') == hex(address)))
        assert row['normalized_result'] == [hex(caller) for caller in callers]
        refs[hex(address)] = dict(evidence_id=row['evidence_id'], callsites=row['normalized_result'])

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

    assets_path = PRIVATE / 'button-assets.json'
    assets = read(assets_path)
    old_assets = read(A / 'presentation-source-check.json')['asset_observation']
    index_meta = old_assets['graphic_info']
    same(index_meta)
    index_path = R / index_meta['path']
    index = index_path.read_bytes()
    assert sha(index) == assets['index_sha256']
    labels = ('OK', 'Cancel', 'Yes', 'No', 'Back', 'Next')
    assert len(assets['rows']) == len(labels)
    archive = index_path.with_name('GraphicV3_18.bin')
    resources = struct.unpack('<18I', original(0x52ee44, 72))
    with archive.open('rb') as file:
        for slot, (row, label) in enumerate(zip(assets['rows'], labels)):
            assert row['bit'] == 1 << slot and row['resource'] == resources[slot * 3]
            meta = struct.unpack_from('<10I', index, row['metadata_file_offset'])
            assert (meta[0], meta[1], meta[2], meta[5], meta[6], meta[9]) == tuple(row[k] for k in (
                'graphic_index', 'archive_offset', 'bytes', 'width', 'height', 'resource'))
            file.seek(meta[1])
            data = file.read(meta[2])
            assert sha(data) == row['sha256'] and struct.unpack_from('<2I', data, 4) == (68, 17)
            row['visual_label'] = label

    proof = dict(
        schema='moli.37c4-actor-interaction-source.v1', source=prior['source'], tool=prior['tool'], analysis_profile=prior['analysis_profile'],
        previous_observation=info(prior_path), snapshot=info(snapshot), session_closure=info(closure_path), closed=True,
        retained_records=len(after), new_retained_records=len(after) - len(before), raw_windows=windows, helpers=helpers, xrefs=refs,
        button_assets=dict(index=index_meta, archive_path=str(archive.relative_to(R)), receipt=info(assets_path), rows=assets['rows'],
                           installer_sha256=old_assets['installer_sha256'], same_release_as_executable='unverified'),
        facts=dict(
            actor='460c40 takes the existing right-press branch after turn and pickup. 43f190 selects the first active body whose two logical cells match and whose flags intersect 8. A return other than -1 produces ;JE [3, actor ID] with no extra range or time condition. 4400e0 allocates the lowest free supported record and 440280 makes a freed lower slot reusable.',
            receive='4fb795 dispatches Q?m to 4f4410 with mode, button mask, sequence, actor ID and bytes. The function reads stack+0xc including the connection argument. Button mask -1 closes a matching mode and actor. The other branch uses 48fce0. Modes 0,1,2,10,11 share 4908e0. Input modes are 1 and 11. In mode 2, the first newline-terminated field is the number of leading display lines before choices.',
            select='The native button constructor enumerates six low bits. 48f90c passes one bit to the installed callback. 48fc94 passes zero and the selected row minus the header count for menu choices. 4903e0 emits /1I [current X, current Y, sequence, actor ID, button, text]. The menu row text is one based and a menu button sends the negative header count. Native local dismissal resets the window without sending a reply.',
            text='5111a0 applies the inner escape pass. 4e9e20 splits by native width and CR or LF without bisecting a high-byte pair. 511060 uses LF, comma, pipe and backslash substitutions from 56bd40. The portable projection bounds reply bytes, and supports plain text and choices with source layout limits.',
        ),
        pending=['Live server causality between ;JE and Q?m', 'Inline graphics, native modal styling and other modes, source-specific facing and shop consumers',
                 'Physical devices, native WeChat game page, current release and official acceptance'],
        VM_actions=0, original_execution=0, official_sessions=0, phase_complete=False,
    )
    (A / 'actor-interaction-source-check.json').write_text(json.dumps(proof, indent=2) + '\n')
    print(f"REA retained {len(after)} (+{len(after) - len(before)}), {len(windows)} byte windows, {len(helpers)} helpers, closed")


if __name__ == '__main__':
    main()
