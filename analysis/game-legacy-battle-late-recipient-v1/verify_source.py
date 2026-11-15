"""Verify the producer, incoming hit, and separate action and tuple cursors."""

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
    bundle, closure = PRIVATE / 'rea-evidence.json', PRIVATE / 'rea-closure.json'
    ledger = read(bundle)
    assert read(closure) == {'open': False, 'cleanup_pending': False, 'rea': '6.7.0'}
    assert ledger['artifacts'][0]['digest']['sha256'] == NETWORK['SHA'] and not ledger['unknowns']
    memory, references, windows = [], {}, []
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
        start = int(address, 16)
        windows.append((start, start + length))
    assert len(memory) == 13 and len(references) == 3
    assert {address: len(row['addresses']) for address, row in references.items()} == {
        '0x434a30': 262, '0x421510': 30, '0x434b60': 66}
    for address, sites in (('0x434a30', ('0x40a1a8', '0x40a70c', '0x40d86d', '0x40d91b')),
                           ('0x421510', ('0x40d864',)), ('0x434b60', ('0x40d921',))):
        assert set(sites) <= set(references[address]['addresses'])

    carried = HERE.parent / 'game-battle-physical-results-v1/source-check.json'
    previous = read(carried)
    assert previous['source']['sha256'] == NETWORK['SHA']
    window, = [row for row in previous['selected_original_ranges'] if row['address'] == '0x40a120']
    offset, raw = image.locate(window['address'], window['bytes'])
    assert offset == window['file_offset'] and sha256(raw).hexdigest() == window['sha256']
    windows.append((0x40a120, 0x40a120 + window['bytes']))

    def cover(address, length):
        assert any(start <= address and address + length <= stop for start, stop in windows), hex(address)
        return image.locate(hex(address), length)

    def operand(address, expected):
        expected = bytes.fromhex(expected)
        offset, raw = cover(address, len(expected))
        assert raw == expected, (hex(address), raw.hex())
        return dict(address=hex(address), file_offset=offset, bytes=len(raw))

    operands = [operand(address, raw) for address, raw in (
        (0x40a6c6, '8b048dc4fa5800'), (0x40a6da, '8b482c85c90f8591fbffff'),
        (0x40a19a, '81bc85a40c0000a1000000'), (0x40c7fc, '81bbd002000010270000'),
        (0x40c9bf, '8b859c0c0000c1e0048b4c281c8b048dc4fa580085c00f84eb0e00008bf0'),
        (0x40ca32, '3d204e00007d0d83bd3810000001'), (0x40d86c, '56'),
        (0x40d8bc, 'c783d002000000000000'), (0x40d926, '89b5d00f0000'),
        (0x434a3b, '8b88c40f00004181f9c80000008988c40f0000'),
        (0x434a50, '8b8488a40c000083f8ff740489422c'), (0x434a60, 'c7422ce7000000'),
        (0x434b6f, '8bb09c0c0000468bce89b09c0c0000c1'),
        (0x42470f, '6a18'), (0x42472c, '6a03'), (0x42473e, '6a71'),
        (0x424f36, '6a0e'), (0x424f49, 'e939030000'), (0x425289, '6a00'), (0x42528b, '8b0495c4fa5800'),
    )]
    calls = []
    for address, target in (
        (0x42471a, 0x434990), (0x424737, 0x434990), (0x424749, 0x434990),
        (0x424f41, 0x434990), (0x425294, 0x434990), (0x40a70c, 0x434a30),
        (0x40a1a8, 0x434a30), (0x40c9f4, 0x419e90), (0x40d864, 0x421510),
        (0x40d86d, 0x434a30), (0x40d91b, 0x434a30), (0x40d921, 0x434b60),
    ):
        cover(address, 5)
        calls.append(image.call(hex(address), hex(target)))
    callbacks = {}
    for action, target in ((0, 0x40a188), (3, 0x40a719), (14, 0x40c7e8), (24, 0x40a6b9), (26, 0x40d9aa),
                           (113, 0x411e8f), (157, 0x4129e4), (160, 0x413542), (231, 0x40a17b)):
        offset, raw = cover(0x419434 + action * 4, 4)
        assert unpack('<I', raw)[0] == target
        callbacks[str(action)] = dict(file_offset=offset, target=hex(target))
    prior = identity(HERE.parent / 'game-legacy-battle-independent-following-v1/source-check.json')
    assert prior['sha256'] == '0479c99c440d052c2817f5f6562c6016327049147b4bbed0e8f7dea24032094f'
    result = dict(stage=262, source=identity(image.path), evidence=identity(bundle), closure=identity(closure),
                  prior=prior, carried_source=identity(carried), carried_window=window,
                  rea='6.7.0', provider='Ghidra 12.1.4', memory=memory, references=references, operands=operands,
                  calls=calls, callbacks=callbacks, original_runtime_observed=False)
    (HERE / 'source-check.json').write_text(json.dumps(result, indent=2) + '\n')
    print(json.dumps({key: len(result[key]) for key in ('memory', 'references', 'operands', 'calls', 'callbacks')}))


if __name__ == '__main__':
    main()
