"""Check reflection queues, inline unmounting and the RID0 pointer read in the fixed PE."""
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
    prior = HERE.parent / 'game-legacy-battle-casting-rid0-v1/source-check.json'
    assert identity(prior)['sha256'] == 'ec1306745aae9fd4fe48536f3afc52bbaa93d34e9b68831e0f07c72fab0a5fed'
    previous = read(prior)
    assert previous['source'] == source
    bundle, closure = PRIVATE / 'rea-evidence.json', PRIVATE / 'rea-closed.json'
    assert read(closure) == {'open': False, 'cleanup_pending': False, 'rea': '6.7.0'}
    ledger = read(bundle)
    assert len(ledger['records']) == 17 and not ledger['unknowns']
    assert ledger['artifacts'][0]['digest']['sha256'] == source['sha256']
    memory, windows = [], []
    for record in ledger['records']:
        assert (record['operation'], record['provider']['id'], record['provider']['version']) == (
            'read_bytes', 'ghidra', '12.1.4')
        assert record['subject']['digest']['sha256'] == source['sha256']
        result = record['normalized_result']
        address, length = result['address'], result['requested_bytes']
        offset, raw = image.locate(address, length)
        assert result['complete'] and result['returned_bytes'] == length and raw.hex() == result['bytes_hex']
        memory.append(dict(address=address, file_offset=offset, bytes=length,
                           sha256=sha256(raw).hexdigest(), evidence=record['evidence_id']))
        windows.append((int(address, 16), int(address, 16) + length))
    retained = [row for row in previous['memory'] if row['address'] in ('0x416718', '0x4197a8', '0x434af0', '0x436ee0')]
    assert len(retained) == 4 and len({row['address'] for row in memory}) == 17
    for row in retained:
        offset, raw = image.locate(row['address'], row['bytes'])
        assert offset == row['file_offset'] and sha256(raw).hexdigest() == row['sha256']
        start = int(row['address'], 16)
        windows.append((start, start + row['bytes']))

    def cover(address, length):
        assert any(start <= address and address + length <= stop for start, stop in windows), hex(address)
        return image.locate(hex(address), length)

    operands = []
    for address, expected in (
        # Outbound reflection preserves the total and source ordering.
        (0x42a6f7, 'a900000100'), (0x42a70f, '03d625dfff1ffc'),
        (0x42a716, '891548fb5800'), (0x42a729, '890db49b5900'),
        (0x42ac98, '85c00f8456030000'), (0x42aca6, '6a01'),
        (0x42ad17, '81e3fffffeff'), (0x42ad30, '6889000000'), (0x42ad48, '6a00'),
        (0x42af66, '6a48'),
        # Phase2 gates source slots and does not enter the general wait path.
        (0x428f74, '83e8000f8487040000'), (0x428fa4, '8a81cc364300ff2485c0364300'),
        (0x4336c0, 'b18f4200fc8f4200a3354300'), (0x4336cc, '00' * 13),
        (0x428fbc, 'c7465801000000'), (0x428fdb, '8b6b2c85ed'),
        (0x428ff4, '83792c01'), (0x429046, '3bfa0f8c55a50000'),
        (0x42905b, '8b402c85c0'), (0x4290e6, '83f8010f85b4a40000'),
        (0x4290fc, 'c7415801000000'),
        # Reflection action137 copies before action72 advances the source tuple.
        (0x419658, '1d264100'), (0x419554, 'def44000'),
        (0x41261d, '8b853c10000083f813'), (0x412632, '6a006a006a1f6a0053'),
        (0x41e8da, 'c74608c0be4100'), (0x41e949, 'f7c500008000'),
        # Inline metadata chooses the recipient and invokes the rider updater.
        (0x41a0bd, 'f7c600008000'), (0x41a0e6, 'f7c600200000'),
        (0x422d70, '3bc77e69'), (0x422d90, '8986b4130000'), (0x422de7, '89782c'),
        (0x422dea, '8b8eb4130000897958'), (0x422e02, '89beb4130000'),
        # The original 221 reads the rider pointer and then its counter directly.
        (0x4197a8, '18674100'), (0x41671e, '8b95b41300008b8d5c100000'),
        (0x416736, '8b78248b70288b4258'),
    ):
        offset, raw = cover(address, len(expected) // 2)
        assert raw.hex() == expected, (hex(address), raw.hex())
        operands.append(dict(address=hex(address), file_offset=offset, bytes=len(raw)))
    calls = []
    for address, target in (
        (0x42a767, 0x434af0), (0x42a78e, 0x436e60),
        (0x42ad25, 0x434990), (0x42ad3e, 0x434990), (0x42ad53, 0x434990),
        (0x42aefb, 0x434990), (0x42af2b, 0x434af0), (0x42af5c, 0x436e60),
        (0x42af71, 0x434990), (0x42afaa, 0x434990), (0x42afee, 0x434990),
        (0x4290f0, 0x434a30), (0x41263b, 0x41dc00), (0x412644, 0x434a30),
        (0x40f4df, 0x434b60), (0x40f4e5, 0x434a30),
        (0x41e932, 0x434af0), (0x41e966, 0x436ee0), (0x41e981, 0x436e60),
        (0x41bfa2, 0x41a030), (0x41a0de, 0x436ee0), (0x41a12f, 0x422d60),
        (0x41a186, 0x422d60), (0x41a19c, 0x4232e0), (0x422dfa, 0x40a090),
    ):
        cover(address, 5)
        calls.append(image.call(hex(address), hex(target)))
    result = dict(stage=269, source=source, evidence=identity(bundle), closure=identity(closure), prior=identity(prior),
                  rea='6.7.0', provider='Ghidra 12.1.4', memory=memory, carried_windows=retained,
                  operands=operands, calls=calls, original_runtime_observed=False,
                  suspended_rider_recovery_observed_in_original=False)
    (HERE / 'source-check.json').write_text(json.dumps(result, indent=2) + '\n')
    print(json.dumps({key: len(result[key]) for key in ('memory', 'carried_windows', 'operands', 'calls')}))


if __name__ == '__main__':
    main()
