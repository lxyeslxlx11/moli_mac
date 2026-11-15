"""Verify A/P fields, live registration marking, round seeding and input reset."""
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
    prior = HERE.parent / 'game-legacy-battle-character-queue-v1/source-check.json'
    assert identity(prior)['sha256'] == '69581d54a1b102db6d90df92f6a958b1a9847dcb63cfc6be4f83a5819bf5b049'
    previous = read(prior)
    assert previous['source'] == source
    bundle, closure = PRIVATE / 'rea-evidence.json', PRIVATE / 'rea-closed.json'
    assert read(closure) == dict(open=False, cleanup_pending=False, rea='6.7.0')
    ledger = read(bundle)
    assert len(ledger['records']) == 9 and not ledger['unknowns']
    assert ledger['artifacts'][0]['digest']['sha256'] == source['sha256']
    windows, memory, metadata = [], [], []
    for record in ledger['records']:
        assert (record['provider']['id'], record['provider']['version']) == ('ghidra', '12.1.4')
        assert record['subject']['digest']['sha256'] == source['sha256']
        result = record['normalized_result']
        if record['operation'] != 'read_bytes':
            assert record['operation'] in ('procedure_callers', 'read_function_instructions')
            if record['operation'] == 'procedure_callers':
                assert set(result) == {'0x437460', '0x4f36d0'}
            metadata.append(dict(operation=record['operation'], evidence=record['evidence_id']))
            continue
        address, length = result['address'], result['requested_bytes']
        offset, raw = image.locate(address, length)
        assert result['complete'] and result['returned_bytes'] == length and raw.hex() == result['bytes_hex']
        memory.append(dict(address=address, file_offset=offset, bytes=length,
                           sha256=sha256(raw).hexdigest(), evidence=record['evidence_id']))
        start = int(address, 16)
        windows.append((start, start + length))
    retained = [row for row in previous['carried_windows'] if row['address'] == '0x437b30']
    assert len(memory) == 7 and len(retained) == 1 and len(metadata) == 2
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
        (0x4f372d, '685c9d5900'), (0x4f3732, '68a09c5900'), (0x4f3737, '689c9c5900'),
        (0x4f373c, '68289d5900'), (0x4f3741, '68cc9d5900'), (0x4f3746, '68c89d5900'),
        (0x4f3764, '68989c5900'), (0x4f3769, '68e49c5900'), (0x4f3784, '83f801'),
        (0x4f378f, 'c705909d590000000000'), (0x4f3799, '890d2c9d5900'),
        (0x436f50, '833d7cf1f5000a'), (0x436f59, 'a12c9d5900'), (0x436f5e, '8b0d989c5900'),
        (0x436f64, '3bc1'), (0x436f6c, 'bec4fa5800'), (0x436f71, '8b0685c0'),
        (0x436f77, '8b15e49c5900'), (0x436f7f, 'd3fa'), (0x436f86, '83482440'),
        (0x436f8e, '81fe14fb5800'), (0x436fa0, 'b9c4fa5800'), (0x436fa5, 'babfffffff'),
        (0x436fb0, '215024'), (0x436fb6, '81f914fb5800'), (0x437471, '0530750000'),
        (0x437e6b, 'a1c89d5900'), (0x437e78, 'a3c49d5900'),
        (0x436682, '40'), (0x436685, 'a32c9d5900'),
    ):
        offset, raw = cover(address, len(expected) // 2)
        assert raw.hex() == expected, (hex(address), raw.hex())
        operands.append(dict(address=hex(address), file_offset=offset, bytes=len(raw)))
    calls = []
    for address, target in (
        (0x4f3754, 0x51cb76), (0x4f3777, 0x51cb76), (0x4f379f, 0x436f50),
        (0x437495, 0x436fa0), (0x43749a, 0x436f50),
        (0x437e49, 0x433cd0), (0x437f8d, 0x437460),
    ):
        cover(address, 5)
        calls.append(image.call(hex(address), hex(target)))
    assert (0x58fb14 - 0x58fac4) // 4 == 20
    result = dict(stage=272, source=source, evidence=identity(bundle), closure=identity(closure), prior=identity(prior),
                  rea='6.7.0', provider='Ghidra 12.1.4', memory=memory, carried_windows=retained,
                  metadata=metadata, operands=operands, calls=calls, native_ack_slots=20,
                  original_runtime_observed=False, native_device_and_official_acceptance=False)
    (HERE / 'source-check.json').write_text(json.dumps(result, indent=2) + '\n')
    print(json.dumps({key: len(result[key]) for key in ('memory', 'carried_windows', 'operands', 'calls')}))


if __name__ == '__main__':
    main()
