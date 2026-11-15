"""Bind repeated SKL401 queue appends and consumers to REA and original PE bytes."""
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
    bundle, closure = PRIVATE / 'rea-evidence.json', PRIVATE / 'rea-closed.json'
    assert read(closure) == dict(open=False, cleanup_pending=False, rea='6.7.0')
    ledger = read(bundle)
    assert len(ledger['records']) == 4 and not ledger['unknowns']
    assert ledger['artifacts'][0]['digest']['sha256'] == source['sha256']
    memory, windows = [], []
    for record in ledger['records']:
        assert record['operation'] == 'read_bytes'
        assert (record['provider']['id'], record['provider']['version']) == ('ghidra', '12.1.4')
        assert record['subject']['digest']['sha256'] == source['sha256']
        result = record['normalized_result']
        address, length = result['address'], result['requested_bytes']
        offset, raw = image.locate(address, length)
        assert result['complete'] and result['returned_bytes'] == length and raw.hex() == result['bytes_hex']
        memory.append(dict(address=address, file_offset=offset, bytes=length,
                           sha256=sha256(raw).hexdigest(), evidence=record['evidence_id']))
        start = int(address, 16)
        windows.append((start, start + length))
    retained, priors = [], []
    for name, digest, helpers in [
        ('pursuit-source-check.json', 'c867c04c8f76a9324b1237a21a3145f9af478ed93165152c5bcbe8f03121af17',
         ['0x434990', '0x434a30', '0x434af0', '0x434b60', '0x434b90']),
        ('formation-source-check.json', '4e65c910d6f45721eb1f4b7237a9e59f7d04f55b80704bab4d25a618d2e1dea8', ['0x41b4a0']),
    ]:
        path = HERE.parent / 'game-battle-shared-storage-v1' / name
        assert identity(path)['sha256'] == digest
        previous = read(path)
        assert previous['source'] == source
        priors.append(identity(path))
        for helper in helpers:
            item = previous['helpers'][helper]
            for row in item['ranges']:
                offset, raw = image.locate(row['start'], row['bytes'])
                assert sha256(raw).hexdigest() == row['sha256']
                retained.append(dict(address=row['start'], file_offset=offset, bytes=len(raw),
                                     sha256=row['sha256'], evidence=item['evidence_id']))
                start = int(row['start'], 16)
                windows.append((start, start + len(raw)))
    assert len(retained) == 6

    def cover(address, length):
        assert any(start <= address and address + length <= stop for start, stop in windows), hex(address)
        return image.locate(hex(address), length)

    operands = []
    for address, expected, meaning in (
        (0x430d80, 'be00000800', 'repeated-impact result mask'),
        (0x430dae, '3dff000000', 'target-list terminator'),
        (0x430ddd, '6a006a00', 'result tuple zero amount and extra'),
        (0x430e4f, '85c6', 'test repeated-impact flag'),
        (0x430e5d, '6a23', 'append action35'),
        (0x430e73, '68cf000000', 'append action207'),
        (0x430e8b, '6a176a006a1e', 'effect extra23 amount0 count30'),
        (0x430e98, '68faad0100', 'effect resource0x1adfa'),
        (0x430ea6, 'e9f4feffff', 'return to next target without deduplication'),
        (0x430ef4, '6a036a016a00', 'rain mode3 row'),
        (0x430f5b, '6a006a016a00', 'rain mode0 row'),
        (0x4146b9, '8b4c281c', 'action207 reads current target-bank resource'),
        (0x41470c, '40', 'action207 increments effect counter'),
        (0x41471f, '3b042a', 'action207 compares current tuple repeat count'),
        (0x4149ee, '3bc7', 'only class400 creates type31 in the shared release loop'),
        (0x414a12, '7410', 'self target skips action pop'),
        (0x4349af, '41', 'action append increments write cursor'),
        (0x434b58, '41', 'tuple append increments write cursor'),
        (0x434c46, '3d201c0000', 'retained wait compares7200'),
    ):
        offset, raw = cover(address, len(expected) // 2)
        assert raw.hex() == expected, (hex(address), raw.hex())
        operands.append(dict(address=hex(address), file_offset=offset, bytes=len(raw), meaning=meaning))
    calls = []
    for address, target in (
        (0x430d29, 0x434990), (0x430d3e, 0x434990), (0x430d54, 0x434990), (0x430d6d, 0x434990),
        (0x430e2d, 0x434af0), (0x430e42, 0x434990), (0x430e68, 0x434990),
        (0x430e81, 0x434990), (0x430e9e, 0x434af0), (0x430ec4, 0x434af0),
        (0x430eea, 0x434990), (0x430f02, 0x434a90), (0x430f18, 0x434990),
        (0x430f2e, 0x434990), (0x430f46, 0x434990), (0x430f62, 0x434a90), (0x430f75, 0x434a70),
        (0x4146bf, 0x41b4a0), (0x414733, 0x434b60), (0x414739, 0x434a30),
        (0x414a1c, 0x434a30), (0x414a25, 0x434b60), (0x414a30, 0x434b60),
        (0x434c6d, 0x4348e0), (0x434c78, 0x434990), (0x434c83, 0x434990),
    ):
        cover(address, 5)
        calls.append(image.call(hex(address), hex(target)))
    result = dict(stage=275, source=source, evidence=identity(bundle), closure=identity(closure), priors=priors,
                  rea='6.7.0', provider='Ghidra 12.1.4', memory=memory, carried_windows=retained,
                  operands=operands, calls=calls,
                  source_facts=['Every target occurrence appends0 and flagged occurrences append35,207 and a count30 effect tuple',
                                'The release loop pops one target action per occurrence, retaining the same body identity',
                                'Action207 consumes the current target-bank effect tuple after its repeat counter completes'],
                  self_effect_boundary=dict(classification='derived unsupported mixed-bank context',
                                            reason='The effect resource enters the caster target list and is not a valid0..21 body slot',
                                            native_execution_verified=False),
                  original_runtime_observed=False, native_device_and_official_acceptance=False,
                  extent_limit='Selected producer and callback byte spans; no canonical whole-function discovery claimed for interior entries.')
    (HERE / 'source-check.json').write_text(json.dumps(result, indent=2) + '\n')
    print(json.dumps({key: len(result[key]) for key in ['memory', 'carried_windows', 'operands', 'calls']}))


if __name__ == '__main__':
    main()
