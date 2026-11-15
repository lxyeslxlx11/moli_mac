"""Verify original battle reset ranges and independently derive the reentry fixture movement."""
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
    assert len(ledger['records']) == 3 and not ledger['unknowns']
    assert ledger['artifacts'][0]['digest']['sha256'] == source['sha256']
    memory = []
    for record in ledger['records']:
        assert record['operation'] == 'read_bytes'
        assert (record['provider']['id'], record['provider']['version']) == ('ghidra', '12.1.4')
        assert record['subject']['digest']['sha256'] == source['sha256']
        row = record['normalized_result']
        offset, raw = image.locate(row['address'], row['requested_bytes'])
        assert row['complete'] and row['returned_bytes'] == len(raw) and raw.hex() == row['bytes_hex']
        memory.append(dict(address=row['address'], file_offset=offset, bytes=len(raw),
                           sha256=sha256(raw).hexdigest(), evidence=record['evidence_id']))
    assert [(r['address'], r['bytes']) for r in memory] == [('0x501a50', 164), ('0x437b30', 240), ('0x433b70', 82)]
    previous = []
    carried = []
    for name, digest in [
        ('game-battle-return-v1', 'e95a31c69cabf7c6d6ad3d5577f833c932604df716cb73e67c04cb9a81e9a8c6'),
        ('game-battle-entry-v1', 'b22ca50417c44bce24ace71e60f43467b71676690d1c2949b9a6a9fce0b34429'),
    ]:
        path = HERE.parent / name / 'source-check.json'
        assert identity(path)['sha256'] == digest
        previous.append(identity(path))
        old = read(path)
        if name == 'game-battle-return-v1':
            function = next(r for r in old['retained_source_functions'] if r['address'] == '0x501a50')
            rows = [dict(address=r['start'], evidence_id=function['evidence_id'], **r)
                    for r in function['independent_PE_source_spans']]
        else:
            rows = [r for r in old['byte_checks'] if r['address'] in ['0x437b30', '0x433b70']]
        for row in rows:
            offset, raw = image.locate(row['address'], row['bytes'])
            assert offset == row['file_offset'] and sha256(raw).hexdigest() == row['sha256']
            carried.append({k: row[k] for k in ['address', 'file_offset', 'bytes', 'sha256', 'evidence_id']})
    assert len(carried) == 3
    operands = []
    for address, expected, meaning in [
        (0x437b80, '891d0c9e5900', 'entry clears frame/readiness work'),
        (0x437be0, '891d089e5900', 'entry clears the previous actor-control work'),
        (0x437be6, '891dfc9d5900', 'entry clears the previous round work'),
        (0x437bec, '892df8815600', 'entry arms the first acknowledgement'),
        (0x433b7b, 'b920000000', 'reset clears32 words of the battle table'),
        (0x433b89, 'b916000000', 'reset clears22 words of battle-control work'),
        (0x433b97, '89159c8b5900', 'reset clears its table counter'),
        (0x433b9d, '8915489c5900', 'reset clears completion work'),
        (0x433ba3, '8915449c5900', 'reset clears the previous stop flag'),
        (0x433ba9, '89152cfb5800', 'reset clears previous control work'),
    ]:
        assert any(int(r['address'], 16) <= address and address + len(expected)//2 <= int(r['address'], 16) + r['bytes'] for r in carried)
        offset, raw = image.locate(hex(address), len(expected)//2)
        assert raw.hex() == expected, (hex(address), raw.hex())
        operands.append(dict(address=hex(address), file_offset=offset, bytes=len(raw), meaning=meaning))
    calls = [image.call(hex(a), hex(t)) for a, t in [
        (0x437bd1, 0x40a0c0), (0x437bd6, 0x433b70), (0x433b71, 0x433b30),
        (0x433bbb, 0x489880), (0x502534, 0x4ff430), (0x502539, 0x440450),
        (0x5023d3, 0x505030),
    ]]
    reference_paths = [
        'analysis/game-input-runtime-v1/original-vectors.json',
        'analysis/game-input-runtime-v1/generate_vectors.py',
        'analysis/game-legacy-local-movement-v1/original-vectors.json',
        'analysis/game-legacy-local-movement-v1/generate_vectors.py',
        'analysis/game-legacy-message-v1/generate_vectors.py',
    ]
    inputs = read(ROOT / reference_paths[0])
    local = read(ROOT / reference_paths[2])
    nav = run_path(str(ROOT / reference_paths[3]))
    wire = run_path(str(ROOT / reference_paths[4]))
    pointer = run_path(str(ROOT / reference_paths[1]))
    fixture = read(HERE / 'original-fixture.json')
    flags = [r for h in inputs['protocol']['beforePlainHex']
             if (r := bytes.fromhex(h)).startswith(b'=mJ ')]
    assert len(flags) == 1
    cells = flags[0].split()[7].split(b'|')[-1].split(b',')
    assert cells == [b'0'] * 144
    movement = fixture['movement']
    assert inputs['protocol']['frames'] == 52 < movement['settleFrames'] == 64
    assert movement['origin'] == inputs['protocol']['destination'] == [5, 3]
    picked = pointer['pick']([416, 168], inputs['protocol']['finalPosition'], [320, 240])
    assert picked['tile'] == movement['destination'] == [8, 3]
    frames = nav['local_frames'](12, 12, [0]*144, movement['origin'], picked['tile'], 100, 64,
                                context=local['localCases'][0]['context'])
    requests = [r for frame in frames for r in frame['requests']]
    encoded = []
    for row in requests:
        x, y, direction, sequence = row['arguments']
        assert row['operationId'] == 'send-004f6470'
        encoded.append((b'!0b ' + wire['integer'](x) + b' ' + wire['integer'](y) + b' '
                        + bytes.fromhex(direction['bytesHex']) + b' ' + wire['integer'](sequence) + b' ').decode())
    assert encoded == movement['requestsPlain'] == ['!0b 5 3 cc 1B ', '!0b 7 3 c 1B ']
    assert frames[-1]['position'] == movement['finalPosition'] == [512, 192]
    assert not frames[-1]['moving']
    spec = HERE.parent / 'game-battle-return-v1/implementation-spec.json'
    assert identity(spec)['sha256'] == '91110a9694b9663c972c2d5fa80d159db4ae78f81338de12456b0c3fa82d0530'
    result = dict(stage=280, source=source, rea='6.7.0', provider='Ghidra12.1.4',
        evidence=dict(ledger=identity(bundle), closure=identity(closure)), previous=previous,
        memory=memory, carried_windows=carried, operands=operands, calls=calls, return_contract=identity(spec),
        movement_oracle=dict(authority='Independent original Python movement/pointer/message references',
            inputs=[identity(ROOT / p) for p in reference_paths], fixture=identity(HERE / 'original-fixture.json'),
            map_cells=144, map_flags=0, first_arrival_frames=52, settle_frames=64,
            second_origin=movement['origin'], second_destination=picked['tile'], requests=encoded,
            final_position=frames[-1]['position']),
        facts=['Fresh entry calls pool deletion and battle table reset; re-arms first acknowledgement and clears previous round/stop work.',
               'Ordinary battle preparation removes local/remote ordinary bodies; the retained return contract reconstructs fresh bodies and capture before committing input.'],
        inference='An actual product second battle must exercise these existing generation, body, round and return owners with fresh values and the same socket.',
        original_runtime_observed=False, native_device_and_official_acceptance=False,
        extent_limit='Selected original bytes and pinned retained source ranges; no whole-game or original runtime claim.')
    (HERE / 'source-check.json').write_text(json.dumps(result, indent=2) + '\n')
    print(json.dumps({key: len(result[key]) for key in ['memory', 'carried_windows', 'operands', 'calls']}))


if __name__ == '__main__':
    main()
