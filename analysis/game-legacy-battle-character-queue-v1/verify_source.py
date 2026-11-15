"""Bind the C ring and selected main10 branch to immutable PE and REA evidence."""
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
read = lambda path: json.loads(path.read_text())


def main():
    image = STARTUP['Image'](NETWORK['TARGET'], 1569280, NETWORK['SHA'])
    source = identity(image.path)
    prior = HERE.parent / 'game-battle-entry-v1/source-check.json'
    assert identity(prior)['sha256'] == 'b22ca50417c44bce24ace71e60f43467b71676690d1c2949b9a6a9fce0b34429'
    previous = read(prior)
    assert previous['source'] == source
    bundle, closure = PRIVATE / 'rea-evidence.json', PRIVATE / 'rea-closed.json'
    assert read(closure) == dict(open=False, cleanup_pending=False, rea='6.7.0')
    ledger = read(bundle)
    assert len(ledger['records']) == 11 and not ledger['unknowns']
    assert ledger['artifacts'][0]['digest']['sha256'] == source['sha256']
    windows, memory, metadata = [], [], []
    for record in ledger['records']:
        assert (record['provider']['id'], record['provider']['version']) == ('ghidra', '12.1.4')
        assert record['subject']['digest']['sha256'] == source['sha256']
        if record['operation'] != 'read_bytes':
            assert record['operation'] in ('xrefs', 'read_function_instructions')
            metadata.append(dict(operation=record['operation'], evidence=record['evidence_id']))
            continue
        result = record['normalized_result']
        address, length = result['address'], result['requested_bytes']
        offset, raw = image.locate(address, length)
        assert result['complete'] and result['returned_bytes'] == length and raw.hex() == result['bytes_hex']
        memory.append(dict(address=address, file_offset=offset, bytes=length,
                           sha256=sha256(raw).hexdigest(), evidence=record['evidence_id']))
        start = int(address, 16)
        windows.append((start, start + length))
    retained = [row for row in previous['byte_checks'] if row['address'] in ('0x437b30', '0x433cd0', '0x4f36d0')]
    assert len(memory) == 9 and len(retained) == 3 and len(metadata) == 2
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
        (0x4f36d9, '3c43'), (0x4f36dd, '8b15948b5900'), (0x4f36ea, 'c1e30c'),
        (0x4f36ed, '81c3644b5900'), (0x4f3709, '42'), (0x4f370c, '83fa04'),
        (0x4f370f, '8915948b5900'), (0x4f371d, 'c705948b590000000000'),
        (0x437b64, '33db83f809'), (0x437b79, 'ff24855c864300'),
        (0x438664, '9e7d4300'), (0x438674, '30814300'),
        (0x437df9, '8b156c8b5900'), (0x437dff, 'a1948b5900'), (0x437e04, '3bd0'),
        (0x437e35, '42'), (0x437e36, '83fa04'), (0x437e39, '89156c8b5900'),
        (0x437e43, '891d6c8b5900'), (0x437e4e, 'f6057c9c590020'),
        (0x437e57, 'c705a0f1f50007000000'), (0x43668a, 'c705a0f1f50002000000'),
        (0x433cec, 'a820'), (0x433cf3, '0f856a090000'),
        (0x434591, 'ba01000000'), (0x43459a, '85d3'), (0x43464a, 'c70700000000'),
        (0x4f37a8, '807f0155'), (0x4f37b0, 'c705d09d590001000000'),
    ):
        offset, raw = cover(address, len(expected) // 2)
        assert raw.hex() == expected, (hex(address), raw.hex())
        operands.append(dict(address=hex(address), file_offset=offset, bytes=len(raw)))
    calls = []
    for address, target in (
        (0x437da3, 0x409fe0), (0x437da8, 0x419930), (0x437dad, 0x506e80),
        (0x437e49, 0x433cd0), (0x438135, 0x409fe0), (0x43813a, 0x419930),
        (0x43813f, 0x506e80), (0x433ce7, 0x433bd0), (0x434642, 0x40a090),
    ):
        cover(address, 5)
        calls.append(image.call(hex(address), hex(target)))
    # The complete retained dispatch branch contains no C consumer call.
    _, phase6 = cover(0x438130, 50)
    assert phase6[-5] == 0xe9 and len(phase6) == 50
    phase6_calls = [0x438130, 0x438135, 0x43813a, 0x43813f, 0x438144,
                    0x438149, 0x43814e, 0x438153, 0x438158]
    targets = []
    for site in phase6_calls:
        _, raw = cover(site, 5)
        assert raw[0] == 0xe8
        targets.append(hex(site + 5 + int.from_bytes(raw[1:], 'little', signed=True)))
    assert '0x433cd0' not in targets
    result = dict(stage=271, source=source, evidence=identity(bundle), closure=identity(closure), prior=identity(prior),
                  rea='6.7.0', provider='Ghidra 12.1.4', memory=memory, carried_windows=retained,
                  metadata=metadata, operands=operands, calls=calls, phase6_callees=targets,
                  original_runtime_observed=False, native_device_and_official_acceptance=False)
    (HERE / 'source-check.json').write_text(json.dumps(result, indent=2) + '\n')
    print(json.dumps({key: len(result[key]) for key in ('memory', 'carried_windows', 'operands', 'calls')}))


if __name__ == '__main__':
    main()
