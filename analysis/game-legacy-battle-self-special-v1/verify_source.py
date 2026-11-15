"""Bind E000 self precedence, double action advancement and class81 followup to the fixed PE."""
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
    windows, memory, evidence = [], [], []
    for stem, count in [('rea', 4), ('extra', 2)]:
        bundle, closure = PRIVATE / (stem + '-evidence.json'), PRIVATE / (stem + '-closed.json')
        assert read(closure) == dict(open=False, cleanup_pending=False, rea='6.7.0')
        ledger = read(bundle)
        assert len(ledger['records']) == count and not ledger['unknowns']
        assert ledger['artifacts'][0]['digest']['sha256'] == source['sha256']
        evidence.append(dict(ledger=identity(bundle), closure=identity(closure)))
        for record in ledger['records']:
            assert record['operation'] == 'read_bytes'
            assert (record['provider']['id'], record['provider']['version']) == ('ghidra', '12.1.4')
            assert record['subject']['digest']['sha256'] == source['sha256']
            result = record['normalized_result']
            address, count = result['address'], result['requested_bytes']
            offset, raw = image.locate(address, count)
            assert result['complete'] and result['returned_bytes'] == count and raw.hex() == result['bytes_hex']
            memory.append(dict(address=address, file_offset=offset, bytes=count,
                               sha256=sha256(raw).hexdigest(), evidence=record['evidence_id']))
            windows.append((int(address, 16), int(address, 16) + count))
    previous_path = HERE.parent / 'game-legacy-battle-self-family-v1/source-check.json'
    previous_identity = identity(previous_path)
    assert previous_identity['sha256'] == '6b909b5cbe3833831500eb4fb39344d8d95db970a99500a32e6cf6cd0ebf2606'
    previous = read(previous_path)
    assert previous['source'] == source
    carried = previous['carried_windows']
    assert len(carried) == 8
    for row in carried:
        offset, raw = image.locate(row['address'], row['bytes'])
        assert offset == row['file_offset'] and sha256(raw).hexdigest() == row['sha256']
        start = int(row['address'], 16)
        windows.append((start, start + len(raw)))
    operands = []
    for address, expected, meaning in [
        (0x40c9c8, '8b4c281c', 'result target slot from caster tuple'),
        (0x40c9cc, '8b048dc4fa5800', 'target resolves through shared registry'),
        (0x40ca00, 'c7803c100000ffffffff', 'target class reset aliases self caster'),
        (0x40ce62, 'f6c680', '8000 branch has first priority'),
        (0x40d04f, 'f6c640', '4000 branch follows8000'),
        (0x40d320, 'f6c620', '2000 branch follows8000 and4000'),
        (0x40d329, '53', 'reflection first advances caster'),
        (0x40d32f, '56', 'reflection then advances target,possibly the same body'),
        (0x40d335, '8b853c100000', 'reflection rereads current class'),
        (0x40d2cb, '6a05', 'healing uses style5 digits'),
        (0x40d554, '6a06', 'reflection uses style6 HP digits after self reset'),
        (0x40d5a0, '53', 'reflection advances caster tuple after result'),
        (0x434a78, '8b410c', 'pop helper resolves the supplied body'),
        (0x434a88, '89412c', 'pop helper writes the supplied action state'),
        (0x434c46, '3d201c0000', 'existing wait counter compares7200'),
        (0x4128f1, '83f805', 'body155 dispatches numeric style5'),
        (0x40345e, '03c2', 'numeric add preserves native signed32 arithmetic'),
        (0x425e55, '689b000000', 'class81 producer appends body155'),
        (0x425e68, '898830100000', 'class81 producer stores the additional amount'),
    ]:
        assert any(start <= address and address + len(expected) // 2 <= stop for start, stop in windows)
        offset, raw = image.locate(hex(address), len(expected) // 2)
        assert raw.hex() == expected, (hex(address), raw.hex())
        operands.append(dict(address=hex(address), file_offset=offset, bytes=len(raw), meaning=meaning))
    calls = [image.call(hex(address), hex(target)) for address, target in [
        (0x40ce6c, 0x434a30), (0x40d059, 0x434a30),
        (0x40d32a, 0x434a30), (0x40d330, 0x434a30),
        (0x40d5a1, 0x434b60), (0x40d91b, 0x434a30), (0x40d921, 0x434b60),
        (0x40d2d6, 0x41fe20), (0x40d55f, 0x41fe20), (0x412905, 0x403450),
    ]]
    producer_text = ROOT / 'build/analysis/game-battle-physical-family-v1/424310-retained-pseudocode.txt'
    body_group = previous['body14_group']
    text_path = ROOT / body_group['artifact']['path']
    assert identity(text_path) == body_group['artifact']
    span = body_group['range']
    assert sha256(text_path.read_bytes()[span['start']:span['end_exclusive']]).hexdigest() == body_group['sha256']
    dispatch_offset, dispatch_bytes = image.locate('0x4196a0', 4)
    assert dispatch_bytes.hex() == '3b284100'
    pseudo_bytes = text_path.read_bytes()
    start155 = pseudo_bytes.index(b'  case 0x9b:')
    end155 = pseudo_bytes.index(b'  case ', start155 + 1)
    result = dict(stage=278, source=source, rea='6.7.0', provider='Ghidra12.1.4',
        evidence=evidence, previous=previous_identity,
        memory=memory, carried_windows=carried, operands=operands, calls=calls,
        producer_pseudocode=identity(producer_text), body14_group=body_group,
        body155_dispatch=dict(address='0x4196a0',file_offset=dispatch_offset,hex=dispatch_bytes.hex(),target='0x41283b'),
        body155_group=dict(artifact=body_group['artifact'],range=dict(start=start155,end_exclusive=end155),sha256=sha256(pseudo_bytes[start155:end155]).hexdigest()),
        supported_self=dict(categories=[0,1,3,5,6,75,76,77,78,79,80,81,84,85,87,95,110,258,259,266],
            result_mask='0xe10b', class5_first_result_mask='0xe10f', producer_extra81=True,
            shared_target_and_caster=True, result_class_after_self_reset=-1),
        E000_precedence=['0x8000','0x4000','0x2000'],
        reflected_self='Caster and target pop twice on the same body,then advance its tuple. This can release following strikes and class81 numeric healing.',
        glyph_preflight='Self reflection uses style6,self healing style5,8000 skips ordinary HP results.',
        original_runtime_observed=False, native_device_and_official_acceptance=False,
        extent_limit='Selected raw spans and verified complete retained producer/body14 ranges; no whole-game or runtime claim.')
    (HERE / 'source-check.json').write_text(json.dumps(result, indent=2) + '\n')
    print(json.dumps({key: len(result[key]) for key in ['memory', 'carried_windows', 'operands', 'calls']}))


if __name__ == '__main__':
    main()
