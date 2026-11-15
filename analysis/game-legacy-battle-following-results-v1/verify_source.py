"""Verify fixed PE coordinates for later physical results and inline RID spans."""

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
    closure = PRIVATE / 'rea-closed.json'
    assert read(closure) == {'open': False, 'cleanup_pending': False, 'rea': '6.7.0'}
    bundles = [PRIVATE / name for name in ('rea-evidence.json', 'rea-animation-evidence.json')]
    memory, references, windows = [], {}, []
    for path, count in zip(bundles, (12, 4)):
        ledger = read(path)
        assert len(ledger['records']) == count and not ledger['unknowns']
        assert ledger['artifacts'][0]['digest']['sha256'] == NETWORK['SHA']
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
    assert len(memory) == 14 and {k: len(v['addresses']) for k, v in references.items()} == {
        '0x436e60': 30, '0x41a030': 22,
    }
    assert {'0x424f2f', '0x4254b6'} <= set(references['0x436e60']['addresses'])
    assert '0x40cbe6' in references['0x41a030']['addresses']

    carried = HERE.parent / 'game-battle-physical-results-v1/source-check.json'
    prior = HERE.parent / 'game-legacy-battle-late-recipient-v1/source-check.json'
    assert identity(prior)['sha256'] == 'ba650a7e65003e93e876115e5f02be475502a60e6ac3114468aa22a5aaf107e9'
    previous = read(carried)
    assert previous['source'] == identity(image.path)
    retained = [row for row in previous['selected_original_ranges']
                if row['address'] in ('0x40a120', '0x434a30', '0x434af0', '0x434b60')]
    assert len(retained) == 4
    for row in retained:
        offset, raw = image.locate(row['address'], row['bytes'])
        assert offset == row['file_offset'] and sha256(raw).hexdigest() == row['sha256']
        start = int(row['address'], 16)
        windows.append((start, start + row['bytes']))
    dispatch, = [row for row in read(prior)['memory'] if row['address'] == '0x419434']
    offset, raw = image.locate(dispatch['address'], dispatch['bytes'])
    assert offset == dispatch['file_offset'] and sha256(raw).hexdigest() == dispatch['sha256']
    windows.append((0x419434, 0x419434 + len(raw)))

    def cover(address, length):
        assert any(start <= address and address + length <= stop for start, stop in windows), hex(address)
        return image.locate(hex(address), length)

    def operand(address, expected):
        expected = bytes.fromhex(expected)
        offset, raw = cover(address, len(expected))
        assert raw == expected, (hex(address), raw.hex())
        return dict(address=hex(address), file_offset=offset, bytes=len(raw))

    operands = [operand(address, raw) for address, raw in (
        (0x424f36, '6a0e'), (0x424f49, 'e939030000'), (0x425289, '6a00'),
        (0x4253dc, 'f6c48074076a79'), (0x4253e8, 'f6c44074118b036a78'),
        (0x4253fe, 'f6c420742c'), (0x425417, '81e28600000083c21a'), (0x425428, '6a77'),
        (0x436e65, 'f7c500008000'), (0x436eb2, '8b4c1a28'),
        (0x41a0bd, 'f7c600008000'), (0x41a0e6, 'f7c600200000'),
        (0x40c7fc, '81bbd002000010270000'), (0x40ce62, 'f6c680'),
        (0x40d04f, 'f6c640'), (0x40d320, 'f6c620'),
        (0x40d8bc, 'c783d002000000000000'), (0x40d915, '83f80b'),
        (0x434a3b, '8b88c40f00004181f9c80000008988c40f0000'),
        (0x434b6f, '8bb09c0c0000468bce89b09c0c0000c1'),
        (0x4fd632, '8b86a80200008b96ac0200003bc27434'),
        (0x4fd662, '89aec402000089aec002000089aedc020000'),
    )]
    calls = []
    for address, target in (
        (0x424f2f, 0x436e60), (0x424f41, 0x434990), (0x425294, 0x434990), (0x425423, 0x434990),
        (0x4254b6, 0x436e60), (0x436e8f, 0x434af0), (0x436ea2, 0x434af0), (0x436ec7, 0x434af0),
        (0x436eea, 0x434b60), (0x436f29, 0x434b60), (0x436f42, 0x434b60),
        (0x41a0de, 0x436ee0), (0x41a12f, 0x422d60), (0x41a186, 0x422d60), (0x41a19c, 0x4232e0),
        (0x40cbe6, 0x41a030), (0x40ce6c, 0x434a30), (0x40d059, 0x434a30),
        (0x40d32a, 0x434a30), (0x40d330, 0x434a30), (0x40d5a1, 0x434b60),
        (0x40d8f2, 0x4fd5f0), (0x40d91b, 0x434a30), (0x40d921, 0x434b60),
    ):
        cover(address, 5)
        calls.append(image.call(hex(address), hex(target)))
    callbacks = {}
    for action, target in ((14, 0x40c7e8), (119, 0x411f0a), (120, 0x411f0a), (121, 0x411f0a)):
        offset, raw = cover(0x419434 + action * 4, 4)
        assert unpack('<I', raw)[0] == target, (action, raw.hex())
        callbacks[str(action)] = dict(file_offset=offset, target=hex(target))

    result = dict(stage=263, source=identity(image.path), evidence=[identity(path) for path in bundles],
                  closure=identity(closure), prior=identity(prior), carried_source=identity(carried),
                  carried_windows=retained, carried_dispatch=dispatch, rea='6.7.0', provider='Ghidra 12.1.4', memory=memory,
                  references=references, operands=operands, calls=calls, callbacks=callbacks,
                  original_runtime_observed=False)
    (HERE / 'source-check.json').write_text(json.dumps(result, indent=2) + '\n')
    print(json.dumps({key: len(result[key]) for key in ('memory', 'references', 'operands', 'calls', 'callbacks')}))


if __name__ == '__main__':
    main()
