"""Verify the fixed PE path from physical pair planning to RID0 body handback."""

from hashlib import sha256
import json
from pathlib import Path
from runpy import run_path
from struct import unpack


HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[1]
PRIVATE = ROOT / 'build/analysis' / HERE.name
STARTUP = run_path(str(HERE.parent / 'game-legacy-startup-materials-v1/verify_source.py'))
NETWORK = run_path(str(HERE.parent / 'game-legacy-network-v1/verify_source.py'))


def read(path):
    return json.loads(path.read_text())


def main():
    image = STARTUP['Image'](NETWORK['TARGET'], 1569280, NETWORK['SHA'])
    identity = STARTUP['identity']
    bundle = PRIVATE / 'rea-evidence.json'
    closure = PRIVATE / 'rea-closed.json'
    assert read(closure) == {'open': False, 'cleanup_pending': False, 'rea': '6.7.0'}
    ledger = read(bundle)
    assert len(ledger['records']) == 14 and not ledger['unknowns']
    assert ledger['artifacts'][0]['digest']['sha256'] == NETWORK['SHA']
    memory, references, windows = [], {}, []

    def add_window(address, length):
        start = int(address, 16)
        windows.append((start, start + length))

    for record in ledger['records']:
        assert [record['provider'][key] for key in ('id', 'version')] == ['ghidra', '12.1.4']
        result = record['normalized_result']
        if record['operation'] == 'xrefs':
            references[record['parameters']['address']] = dict(evidence=record['evidence_id'], addresses=result)
            continue
        assert record['operation'] == 'read_bytes'
        address, length = result['address'], result['requested_bytes']
        offset, raw = image.locate(address, length)
        assert result['complete'] and result['returned_bytes'] == length and raw.hex() == result['bytes_hex']
        memory.append(dict(address=address, file_offset=offset, bytes=length,
                           sha256=sha256(raw).hexdigest(), evidence=record['evidence_id']))
        add_window(address, length)
    assert len(memory) == 12 and {k: len(v['addresses']) for k, v in references.items()} == {
        '0x4236d0': 13, '0x424310': 1,
    }
    assert '0x429898' in references['0x4236d0']['addresses']
    assert references['0x424310']['addresses'] == ['0x42987d']

    prior = HERE.parent / 'game-legacy-battle-following-results-v1/source-check.json'
    assert identity(prior)['sha256'] == 'b7727fec9cd089b2e5747979448350545ffd3ab936929ac5b3b0b3f3b9926927'
    attached = HERE.parent / 'game-battle-attached-rid-v1/source-check.json'
    pair = HERE.parent / 'game-legacy-battle-skl113-wire-v1/source-check.json'
    assert all(read(path)['source'] == identity(image.path) for path in (prior, attached, pair))
    retained = [row for row in read(attached)['selected_original_ranges']
                if row['address'] in ('0x40a120', '0x4236d0', '0x424310', '0x434990', '0x434a30', '0x434a70', '0x434af0')]
    retained += [row for row in read(pair)['memory'] if row['address'] == '0x42fdb0']
    assert len(retained) == 8
    for row in retained:
        offset, raw = image.locate(row['address'], row['bytes'])
        assert offset == row['file_offset'] and sha256(raw).hexdigest() == row['sha256']
        add_window(row['address'], row['bytes'])

    def cover(address, length):
        assert any(start <= address and address + length <= stop for start, stop in windows), hex(address)
        return image.locate(hex(address), length)

    def operand(address, expected):
        expected = bytes.fromhex(expected)
        offset, raw = cover(address, len(expected))
        assert raw == expected, (hex(address), raw.hex())
        return dict(address=hex(address), file_offset=offset, bytes=len(raw))

    operands = [operand(address, raw) for address, raw in (
        (0x42f0a8, '83f848'), (0x42f0af, '0f84fb0c0000'), (0x42fdcd, 'e9aa9affff'),
        (0x423868, '8b04b5c4fa5800'), (0x423e5c, '68dd000000'), (0x423e61, '89825c100000'),
        (0x423e8b, '51506a00508b0250'), (0x4349af, '418988c80f0000'), (0x4349b6, '899488a40c0000'),
        (0x4349ce, 'c780d80f000001000000'),
        (0x40a6c6, '8b048dc4fa5800'), (0x40a6da, '8b482c85c90f8591fbffff'),
        (0x40c9bf, '8b859c0c0000c1e0048b4c281c8b048dc4fa580085c0'),
        (0x416718, '8b859c0c0000'), (0x416736, '8b78248b70288b4258'),
        (0x41674a, '8904b5c4fa5800'), (0x41675f, 'c7402c01000000'),
        (0x41695a, '8b04bdc4fa580085c0'), (0x41697f, '8904bdc4fa5800'),
        (0x416aba, '8b04b5c4fa5800'), (0x4298a4, 'ff4058'),
    )]
    calls = []
    for address, target in (
        (0x42987d, 0x424310), (0x42988f, 0x434a70), (0x429898, 0x4236d0),
        (0x423e7a, 0x434990), (0x423e93, 0x434af0), (0x416966, 0x40a090),
        (0x416a42, 0x434a70), (0x416ac2, 0x434a70), (0x416ac8, 0x40a090),
        (0x40a1a8, 0x434a30), (0x40a70c, 0x434a30), (0x40d86d, 0x434a30),
        (0x40ce6c, 0x434a30), (0x40d059, 0x434a30), (0x40d330, 0x434a30),
    ):
        cover(address, 5)
        calls.append(image.call(hex(address), hex(target)))
    offset, raw = cover(0x419434 + 221 * 4, 4)
    assert unpack('<I', raw)[0] == 0x416718

    result = dict(stage=264, source=identity(image.path), evidence=identity(bundle), closure=identity(closure),
                  prior=identity(prior), carried_sources=[identity(path) for path in (attached, pair)],
                  carried_windows=retained, rea='6.7.0', provider='Ghidra 12.1.4', memory=memory,
                  references=references, operands=operands, calls=calls,
                  callback_221=dict(file_offset=offset, target='0x416718'), original_runtime_observed=False)
    (HERE / 'source-check.json').write_text(json.dumps(result, indent=2) + '\n')
    print(json.dumps({key: len(result[key]) for key in ('memory', 'references', 'operands', 'calls')}))


if __name__ == '__main__':
    main()
