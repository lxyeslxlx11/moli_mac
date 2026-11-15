"""Verify the fixed PE slot reads and original rider lifetime during action 221."""

from hashlib import sha256
import json
from pathlib import Path
from runpy import run_path


HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[1]
PRIVATE = ROOT / 'build/analysis' / HERE.name
STARTUP = run_path(str(HERE.parent / 'game-legacy-startup-materials-v1/verify_source.py'))
NETWORK = run_path(str(HERE.parent / 'game-legacy-network-v1/verify_source.py'))
identity = STARTUP['identity']


def read(path):
    return json.loads(path.read_text())


def main():
    image = STARTUP['Image'](NETWORK['TARGET'], 1569280, NETWORK['SHA'])
    source = identity(image.path)
    bundle = PRIVATE / 'rea-evidence.json'
    closure = PRIVATE / 'rea-closed.json'
    assert read(closure) == {'open': False, 'cleanup_pending': False, 'rea': '6.7.0'}
    ledger = read(bundle)
    assert len(ledger['records']) == 14 and not ledger['unknowns']
    assert ledger['artifacts'][0]['digest']['sha256'] == source['sha256']
    memory, windows = [], []

    def add_window(address, length):
        start = int(address, 16)
        windows.append((start, start + length))

    for record in ledger['records']:
        assert (record['operation'], record['provider']['id'], record['provider']['version']) == (
            'read_bytes', 'ghidra', '12.1.4')
        result = record['normalized_result']
        address, length = result['address'], result['requested_bytes']
        offset, raw = image.locate(address, length)
        assert result['complete'] and result['returned_bytes'] == length and raw.hex() == result['bytes_hex']
        memory.append(dict(address=address, file_offset=offset, bytes=length,
                           sha256=sha256(raw).hexdigest(), evidence=record['evidence_id']))
        add_window(address, length)
    assert len({row['address'] for row in memory}) == 14

    prior = HERE.parent / 'game-legacy-battle-rid0-ownership-v1/source-check.json'
    assert identity(prior)['sha256'] == '78bd757baffa771f5ee8b092054298997120ab8b3e25739d8a4ca6889281498c'
    previous = read(prior)
    assert previous['source'] == source
    retained = [row for row in previous['memory'] if row['address'] in ('0x40a120', '0x416718')]
    assert len(retained) == 2
    for row in retained:
        offset, raw = image.locate(row['address'], row['bytes'])
        assert offset == row['file_offset'] and sha256(raw).hexdigest() == row['sha256']
        add_window(row['address'], row['bytes'])

    def cover(address, length):
        assert any(start <= address and address + length <= stop for start, stop in windows), hex(address)
        return image.locate(hex(address), length)

    operands = []
    for address, expected in (
        (0x4197a8, '18674100'), (0x40a14b, '8b6b0c'), (0x40a174, 'ff248d34944100'),
        (0x409ffe, '8b461c85c075298b4608'), (0x40a023, '56ffd0'),
        (0x423af5, '8b92b4130000'), (0x423e5c, '68dd00000089825c100000'),
        (0x423e6e, '8928897004'), (0x423e8b, '51506a00508b0250'),
        (0x41671e, '8b95b41300008b8d5c100000'), (0x416736, '8b78248b70288b4258'),
        (0x416741, '0f852d010000'), (0x41674a, '8904b5c4fa5800'),
        (0x416751, 'c7400820a14000'), (0x41675f, 'c7402c01000000'), (0x416790, '33d2895104'),
        (0x41687e, '8b8db4130000c7412c01000000'),
        (0x4168aa, '8b04b5c4fa5800d94040'), (0x4168ca, '8b14b5c4fa5800d94244'),
        (0x416904, '8b14b5c4fa580052'), (0x416917, 'b867666666'),
        (0x416922, '0fafd2f7ea'), (0x416930, '8b04b5c4fa58000390f4020000'),
        (0x416945, '8b85b41300008b48584185d2894858'), (0x416954, '0f8c14faffff'),
        (0x41636e, '8b85b413000085c0'), (0x41695a, '8b04bdc4fa580085c07414'),
        (0x41696e, 'c704bdc4fa580000000000'), (0x41697f, '8904bdc4fa5800'),
        (0x416a67, 'c785b413000000000000'), (0x416a7d, 'c7855c10000000000000'),
        (0x416a94, '8b04b5c4fa580050'), (0x416aba, '8b04b5c4fa580050'),
        (0x43464a, 'c70700000000'), (0x40ea4a, 'c70485c4fa580000000000'),
        (0x40a098, 'c7401c01000000'),
    ):
        offset, raw = cover(address, len(expected) // 2)
        assert raw.hex() == expected, (hex(address), raw.hex())
        operands.append(dict(address=hex(address), file_offset=offset, bytes=len(raw)))

    calls = []
    for address, target in (
        (0x423e7a, 0x434990), (0x423e93, 0x434af0),
        (0x41690c, 0x4fd5f0), (0x41637f, 0x4fd5f0),
        (0x416966, 0x40a090), (0x416a42, 0x434a70), (0x416a62, 0x40a090), (0x416a78, 0x40a090),
        (0x416a8f, 0x422e20), (0x416a9c, 0x422e20), (0x416ac2, 0x434a70), (0x416ac8, 0x40a090),
        (0x4345da, 0x40a090), (0x434642, 0x40a090), (0x40ea56, 0x40a090), (0x40a05c, 0x40a0a0),
    ):
        cover(address, 5)
        calls.append(image.call(hex(address), hex(target)))

    offsets = [counter * counter // 5 - 16 for counter in range(10)]
    assert offsets == [-16, -16, -16, -15, -13, -11, -9, -7, -4, 0]
    result = dict(stage=267, source=source, evidence=identity(bundle), closure=identity(closure),
                  prior=identity(prior), carried_windows=retained, rea='6.7.0', provider='Ghidra 12.1.4',
                  memory=memory, operands=operands, calls=calls,
                  synthetic_fall=dict(initial_attachment_y=-16, offsets=offsets, landing_counter=9),
                  empty_b_recovery_observed_in_original=False, original_runtime_observed=False)
    (HERE / 'source-check.json').write_text(json.dumps(result, indent=2) + '\n')
    print(json.dumps({key: len(result[key]) for key in ('memory', 'operands', 'calls', 'carried_windows')}))


if __name__ == '__main__':
    main()
