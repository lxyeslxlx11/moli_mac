"""Verify the fixed PE, fresh REA bytes and reused complete producer/result windows."""
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
    assert len(ledger['records']) == 5 and not ledger['unknowns']
    assert ledger['artifacts'][0]['digest']['sha256'] == source['sha256']
    windows, memory = [], []
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
    previous_path = HERE.parent / 'game-legacy-battle-self-pair-v1/source-check.json'
    previous_identity = identity(previous_path)
    assert previous_identity['sha256'] == 'b2979ca3e028f35b6f16ec3691109981f538e6e23d4b3f9b57412893c48ab96f'
    previous = read(previous_path)
    assert previous['source'] == source
    carried = previous['carried_windows'] + [row for row in previous['memory'] if row['address'] == '0x40c7e8']
    assert len(carried) == 8
    for row in carried:
        offset, raw = image.locate(row['address'], row['bytes'])
        assert offset == row['file_offset'] and sha256(raw).hexdigest() == row['sha256']
        start = int(row['address'], 16)
        windows.append((start, start + len(raw)))
    operands = []
    for address, expected, meaning in [
        (0x4243b5, '83fd06', 'class6 physical prefix'),
        (0x42463c, '89aa3c100000', 'producer writes caster class before queuing results'),
        (0x424691, '83fd51', 'class81 reads an additional result word'),
        (0x4246ec, '837c245005', 'class5-only first record flag normalization'),
        (0x4246f7, '24fb', 'class5 clears mask0x4 before tuple append'),
        (0x424b1f, 'c7811010000045570000', 'class5 message resource'),
        (0x424b40, 'c7811010000047570000', 'class84 message resource'),
        (0x424b61, 'c7811010000046570000', 'class87 message resource'),
        (0x40c9c8, '8b4c281c', 'read target slot from current caster tuple'),
        (0x40c9cc, '8b048dc4fa5800', 'resolve target through the shared body registry'),
        (0x40ca00, 'c7803c100000ffffffff', 'target class reset aliases the caster for self hits'),
        (0x40d769, '8b8d3c100000', 'normal result rereads class after target reset'),
        (0x40d76f, '83f954', 'class84 skip tested against reread class'),
        (0x40d778, '83f955', 'class85 skip tested against reread class'),
        (0x40d781, '83f957', 'class87 skip tested against reread class'),
        (0x40d827, '6a06', 'ordinary HP number style6 follows the reread class tests'),
    ]:
        assert any(start <= address and address + len(expected) // 2 <= stop for start, stop in windows)
        offset, raw = image.locate(hex(address), len(expected) // 2)
        assert raw.hex() == expected, (hex(address), raw.hex())
        operands.append(dict(address=hex(address), file_offset=offset, bytes=len(raw), meaning=meaning))
    calls = [image.call(hex(address), hex(target)) for address, target in [
        (0x40d86d, 0x434a30), (0x40d91b, 0x434a30), (0x40d921, 0x434b60),
        (0x40d695, 0x41fe20), (0x40d836, 0x41fe20),
    ]]
    producer_text = ROOT / 'build/analysis/game-battle-physical-family-v1/424310-retained-pseudocode.txt'
    body_group = previous['body14_group']
    text_path = ROOT / body_group['artifact']['path']
    assert identity(text_path) == body_group['artifact']
    span = body_group['range']
    assert sha256(text_path.read_bytes()[span['start']:span['end_exclusive']]).hexdigest() == body_group['sha256']
    result = dict(stage=277, source=source, rea='6.7.0', provider='Ghidra12.1.4',
        evidence=dict(ledger=identity(bundle), closure=identity(closure)), previous=previous_identity,
        memory=memory, carried_windows=carried, operands=operands, calls=calls,
        producer_pseudocode=identity(producer_text), body14_group=body_group,
        supported_self=dict(categories=[0,1,3,5,6,75,76,77,78,79,80,81,84,85,87,95,110,258,259,266],
            result_mask='0x10b', class5_first_result_mask='0x10f', producer_extra81=True,
            shared_target_and_caster=True, result_class_after_self_reset=-1),
        glyph_preflight='Self results use normal HP digits after target class reset, including original category6/84/85/87.',
        original_runtime_observed=False, native_device_and_official_acceptance=False,
        extent_limit='Selected raw spans and verified complete retained producer/body14 ranges; no whole-game or runtime claim.')
    (HERE / 'source-check.json').write_text(json.dumps(result, indent=2) + '\n')
    print(json.dumps({key: len(result[key]) for key in ['memory', 'carried_windows', 'operands', 'calls']}))


if __name__ == '__main__':
    main()
