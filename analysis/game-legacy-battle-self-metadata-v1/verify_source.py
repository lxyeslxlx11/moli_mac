"""Bind self metadata to the fixed PE and independently decode authored attack events."""
from hashlib import sha256
import json
from pathlib import Path
from runpy import run_path
import struct

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
    assert len(ledger['records']) == 6 and not ledger['unknowns']
    assert ledger['artifacts'][0]['digest']['sha256'] == source['sha256']
    memory, procedures, windows = [], [], []
    for record in ledger['records']:
        assert (record['provider']['id'], record['provider']['version']) == ('ghidra', '12.1.4')
        assert record['subject']['digest']['sha256'] == source['sha256']
        row = record['normalized_result']
        if record['operation'] == 'analyze_function':
            procedure = row['procedure']
            address, count = procedure['address'], procedure['body']['total_bytes']
            assert (address, count) in [('0x41a030', 526), ('0x436ee0', 109)]
            assert procedure['body']['ranges'] == [dict(start=address, end=hex(int(address, 16)+count-1))]
            offset, raw = image.locate(address, count)
            procedures.append(dict(address=address, bytes=count, file_offset=offset, sha256=sha256(raw).hexdigest(), evidence=record['evidence_id']))
            continue
        assert record['operation'] == 'read_bytes'
        address, count = row['address'], row['requested_bytes']
        offset, raw = image.locate(address, count)
        assert row['complete'] and row['returned_bytes'] == count and raw.hex() == row['bytes_hex']
        memory.append(dict(address=address, file_offset=offset, bytes=count, sha256=sha256(raw).hexdigest(), evidence=record['evidence_id']))
        windows.append((int(address, 16), int(address, 16)+count))
    assert len(procedures) == 2 and len(memory) == 4
    previous_path = HERE.parent / 'game-legacy-battle-self-control-v1/source-check.json'
    previous = identity(previous_path)
    assert previous['sha256'] == '527d436661ac02d248051331db510b020763fcee762919211987960e772e0fb3'
    old = read(previous_path)
    assert old['source'] == source
    carried = old['carried_windows']
    assert len(carried) == 8
    for row in carried:
        offset, raw = image.locate(row['address'], row['bytes'])
        assert offset == row['file_offset'] and sha256(raw).hexdigest() == row['sha256']
        start = int(row['address'], 16)
        windows.append((start, start+len(raw)))
    operands = []
    for address, expected, meaning in [
        (0x41a057, 'f7c600002000', 'first metadata notice flag0x200000'),
        (0x41a08a, 'f7c600004000', 'second metadata notice flag0x400000'),
        (0x41a0bd, 'f7c600008000', 'RID metadata flag0x800000'),
        (0x41a1a4, 'f7c600000001', 'additional notice flag0x1000000'),
        (0x41a1d7, 'f7c600000002', 'notice and sound flag0x2000000'),
        (0x41a063, 'f7c600200000', 'reflection chooses the supplied caster'),
        (0x41a069, '6839570000', 'first message0x5739'),
        (0x41a09c, '683a570000', 'second message0x573a'),
        (0x41a0f0, '6838570000', 'RID message0x5738'),
        (0x436efd, '8b4c301c', 'RID record recipient'),
        (0x436f10, '8b4c3024', 'RID base resource'),
        (0x436f23, '8b4c3028', 'RID rider resource'),
        (0x436f3c, '8b4c3024', 'RID attachment resource'),
        (0x40c844, 'c744242412ae0100', 'impact override0x400 selects0x1ae12'),
        (0x40ca00, 'c7803c100000ffffffff', 'shared self body class resets before conditional status work'),
        (0x40cae0, 'f7042a00001000', 'ordinary impact tests status cleanup0x100000'),
        (0x40cb00, 'c7805010000000000000', 'status child pointer is cleared'),
        (0x40d6c2, 'f7c200000800', 'conditional status tested after class reread'),
        (0x40d726, 'f7042900000010', 'zero-result notice flag0x10000000'),
        (0x40d732, '68bb570000', 'zero-result notice0x57bb'),
    ]:
        assert any(start <= address and address+len(expected)//2 <= stop for start, stop in windows)
        offset, raw = image.locate(hex(address), len(expected)//2)
        assert raw.hex() == expected, (hex(address), raw.hex())
        operands.append(dict(address=hex(address), file_offset=offset, bytes=len(raw), meaning=meaning))
    calls = [image.call(hex(a), hex(t)) for a, t in [
        (0x41a0de, 0x436ee0), (0x436eea, 0x434b60), (0x436f29, 0x434b60), (0x436f42, 0x434b60),
        (0x41a12f, 0x422d60), (0x41a186, 0x422d60), (0x41a19c, 0x4232e0),
        (0x40cba2, 0x41a030), (0x40cbe6, 0x41a030),
    ]]
    body_group = old['body14_group']
    text_path = ROOT / body_group['artifact']['path']
    assert identity(text_path) == body_group['artifact']
    span = body_group['range']
    assert sha256(text_path.read_bytes()[span['start']:span['end_exclusive']]).hexdigest() == body_group['sha256']
    fixture_path = HERE.parent / 'game-battle-shared-storage-v1/original-fixtures.json'
    files = {row['path']: bytes.fromhex(row['bytesHex']) for row in read(fixture_path)['files']}
    index, animation = files['Bin/AnimeInfo.bin'], files['Bin/Anime.bin']
    attacks = {}
    for at in range(0, len(index), 12):
        resource, offset, count, version = struct.unpack_from('<IIHH', index, at)
        if resource not in [100041, 100061, 100114]:
            continue
        directions = []
        for _ in range(count):
            direction, action, duration, frames = struct.unpack_from('<HHII', animation, offset)
            offset += 20 if version == 1 else 12
            events = [struct.unpack_from('<H', animation, offset+i*10+8)[0] for i in range(frames)]
            offset += frames*10
            if action == 5:
                directions.append(dict(direction=direction, events=events))
        assert len(directions) == 8
        assert all(row['events'] == {100041:[0,0,0], 100061:[0,10001,0], 100114:[0,10002,0]}[resource] for row in directions)
        attacks[str(resource)] = directions
    result = dict(stage=281, source=source, rea='6.7.0', provider='Ghidra12.1.4',
        evidence=dict(ledger=identity(bundle), closure=identity(closure)), previous=previous,
        procedures=procedures, memory=memory, carried_windows=carried, operands=operands, calls=calls,
        producer_pseudocode=old['producer_pseudocode'], body14_group=body_group,
        supported_self=dict(categories=[0,1,3,5,6,75,76,77,78,79,80,81,84,85,87,95,110,258,259,266],
            result_mask='0x13f8f57b', class5_first_result_mask='0x13f8f57f'),
        facts=['Metadata helper selects target normally or caster for reflection; self references the same body.',
               'RID helper advances the tuple cursor exactly three times; reflection then advances the result cursor once more.',
               'Self class reset suppresses class-specific condition creation. Ordinary nonzero impact clears status; misses,healing and reflection retain it.',
               'Zero-result notices and metadata execute through original consumers; no extra result or animation signal is synthesized.'],
        authored_animation_contract=dict(fixture=identity(fixture_path), attacks=attacks,
            inference='After resource100041 replacement no later attack signal exists; parked actions retain the original wait recovery. Resource100061 supplies the positive follow-up signal.'),
        original_runtime_observed=False, native_device_and_official_acceptance=False,
        extent_limit='Selected original spans and complete retained producer/body14 ranges; remaining guard aliases and other self flag contexts are separate.')
    (HERE / 'source-check.json').write_text(json.dumps(result, indent=2)+'\n')
    print(json.dumps({key:len(result[key]) for key in ['procedures','memory','carried_windows','operands','calls']}))


if __name__ == '__main__':
    main()
