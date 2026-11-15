"""Verify activation and the ordinary physical wait in the fixed x86 PE."""

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


def main():
    image = STARTUP['Image'](NETWORK['TARGET'], 1569280, NETWORK['SHA'])
    identity = STARTUP['identity']
    bundle, closure = PRIVATE / 'rea-evidence.json', PRIVATE / 'rea-closure.json'
    ledger = json.loads(bundle.read_text())
    assert json.loads(closure.read_text()) == {'open': False, 'cleanup_pending': False, 'rea': '6.7.0'}
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
    assert len(memory) == 15 and len(references) == 5
    assert {address: len(row['addresses']) for address, row in references.items()} == {
        '0x424310': 1, '0x434990': 935, '0x434a70': 62, '0x434b90': 18, '0x434a30': 262}
    assert references['0x424310']['addresses'] == ['0x42987d']
    for address in ('0x434a30', '0x434a70'):
        assert not any(0x424310 <= int(site, 16) < 0x426095 for site in references[address]['addresses'])
    assert [site for site in references['0x434a70']['addresses'] if 0x429859 <= int(site, 16) < 0x429897] == ['0x42988f']

    def cover(address, length):
        assert any(start <= address and address + length <= stop for start, stop in windows), hex(address)
        return image.locate(hex(address), length)

    def operand(address, expected):
        expected = bytes.fromhex(expected)
        offset, raw = cover(address, len(expected))
        assert raw == expected, (hex(address), raw.hex())
        return dict(address=hex(address), file_offset=offset, bytes=len(raw))

    operands = [operand(address, raw) for address, raw in (
        (0x429882, 'a1a49b59008b0c85c4fa5800'), (0x4349a3, '89886c100000'),
        (0x4349ce, 'c780d80f000001000000'), (0x434a81, '8b8490a40c000089412c'),
        (0x40a165, '8b4b2c81f9'), (0x40a174, 'ff248d34944100'), (0x40a19a, '81bc85a40c0000a1000000'),
        (0x40a6da, '8b482c85c90f8591fbffff'), (0x40c7fc, '81bbd002000010270000'),
        (0x417eda, '8b3495c4fa5800'), (0x417f73, 'c7462c1d000000'),
        (0x42470f, '6a18'), (0x42472c, '6a03'), (0x42473e, '6a71'), (0x425fb3, 'e955e7ffff'),
        (0x434c46, '3d201c00007e5c'), (0x434c74, '6a0b'), (0x434c7f, '6a26'),
        (0x434c93, 'c783ac00000000000000'),
    )]
    calls = []
    for address, target in (
        (0x42987d, 0x424310), (0x42988f, 0x434a70), (0x42471a, 0x434990),
        (0x424737, 0x434990), (0x424749, 0x434990), (0x40a1a8, 0x434a30),
        (0x40a70c, 0x434a30), (0x40f51a, 0x434a30), (0x40f520, 0x434a30),
        (0x40f4df, 0x434b60), (0x40f4e5, 0x434a30), (0x4192f4, 0x434a30),
        (0x434c6d, 0x4348e0), (0x434c78, 0x434990), (0x434c83, 0x434990), (0x434c8b, 0x434a70),
    ):
        cover(address, 5)
        calls.append(image.call(hex(address), hex(target)))
    referenced_calls = []
    for address, target in (
        (0x424f41, 0x434990), (0x40d86d, 0x434a30), (0x40d330, 0x434a30),
        (0x4181e3, 0x434a30), (0x4181e9, 0x434a30), (0x418475, 0x434a30),
    ):
        assert hex(address) in references[hex(target)]['addresses']
        referenced_calls.append(image.call(hex(address), hex(target)))

    callbacks = {}
    for action, target in ((0, 0x40a188), (14, 0x40c7e8), (24, 0x40a6b9), (71, 0x40f505),
                           (72, 0x40f4de), (232, 0x417e59), (242, 0x4192dd), (243, 0x419301)):
        offset, raw = cover(0x419434 + action * 4, 4)
        assert unpack('<I', raw)[0] == target
        callbacks[str(action)] = dict(file_offset=offset, target=hex(target))
    prior = identity(HERE.parent / 'game-legacy-battle-missing-lookahead-v1/source-check.json')
    assert prior['sha256'] == '75341185f0c3c86e014c390f9f4019b3eb97f573700f09b6e54add50924bde86'
    result = dict(stage=261, source=identity(image.path), evidence=identity(bundle), closure=identity(closure), prior=prior,
                  rea='6.7.0', provider='Ghidra 12.1.4', memory=memory, references=references, operands=operands,
                  calls=calls, referenced_calls=referenced_calls, callbacks=callbacks,
                  ordinary_wait_threshold=7200, original_runtime_observed=False)
    (HERE / 'source-check.json').write_text(json.dumps(result, indent=2) + '\n')
    print(json.dumps({key: len(result[key]) for key in ('memory', 'references', 'operands', 'calls', 'referenced_calls', 'callbacks')}))


if __name__ == '__main__':
    main()
