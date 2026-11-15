"""Bind self charge,knockout,scatter and stop ownership to the fixed original PE."""
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
    assert len(ledger['records']) == 6 and not ledger['unknowns']
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
    previous_path = HERE.parent / 'game-legacy-battle-self-special-v1/source-check.json'
    previous_identity = identity(previous_path)
    assert previous_identity['sha256'] == 'bcf65d4c5cda22214d12b75d745b98de059c8942f26c56f8b6d452fcd95ce9c9'
    previous = read(previous_path)
    assert previous['source'] == source
    carried = previous['carried_windows']
    assert len(carried) == 8
    for row in carried:
        offset, raw = image.locate(row['address'], row['bytes'])
        assert offset == row['file_offset'] and sha256(raw).hexdigest() == row['sha256']
        start = int(row['address'], 16)
        windows.append((start, start + len(raw)))
    direct_offset, direct_bytes = image.locate('0x40e06b', 700)
    windows.append((0x40e06b, 0x40e06b + 700))
    direct = dict(address='0x40e06b',file_offset=direct_offset,bytes=700,sha256=sha256(direct_bytes).hexdigest(),authority='original PE supplemental range')
    operands = []
    for address, expected, meaning in [
        (0x424726,'a810','producer checks low charge0x10'),
        (0x42473e,'6a71','producer queues body113 for low charge'),
        (0x42475a,'f6c410','producer checks high charge0x1000'),
        (0x424773,'6a71','producer queues body113 for high charge'),
        (0x411e94,'c783b002000005000000','body113 uses attack animation5'),
        (0x411ec8,'f6c410','high charge chooses the effect variant'),
        (0x411ef2,'89bad4020000','charge freezes the resolved target'),
        (0x411ef8,'89bbd4020000','charge also freezes the supplied caster'),
        (0x411efe,'c7432c9d000000','charge enters body157'),
        (0x41b669,'c7802410000002000000','charge effect publishes completion2'),
        (0x40e06d,'c783b00200000a000000','knockout body44 selects animation10'),
        (0x40e28d,'c783b002000008000000','scatter body32 selects reaction animation8'),
        (0x40cd2d,'0c02','reflection can mark the supplied caster knocked out'),
        (0x40ce1c,'83c902','ordinary result can mark the resolved target knocked out'),
        (0x41937e,'c705409c590000000000','body244 clears readiness'),
        (0x419388,'c705449c590001000000','body244 sets stop'),
        (0x434940,'89889c0c0000','reset clears tuple cursor'),
        (0x43494c,'89501c','reset writes first tuple sentinel'),
        (0x43494f,'89502c','reset writes next tuple sentinel'),
        (0x434c46,'3d201c0000','existing recovery compares7200'),
    ]:
        assert any(start <= address and address + len(expected)//2 <= stop for start,stop in windows)
        offset, raw = image.locate(hex(address),len(expected)//2)
        assert raw.hex() == expected,(hex(address),raw.hex())
        operands.append(dict(address=hex(address),file_offset=offset,bytes=len(raw),meaning=meaning))
    calls=[image.call(hex(address),hex(target))for address,target in [
        (0x411ea0,0x4fd5f0),(0x411ed6,0x41dc00),(0x41b674,0x40a090),
        (0x40e082,0x4fd5f0),(0x434c6d,0x4348e0),(0x434c78,0x434990),(0x434c83,0x434990),
    ]]
    dispatch=[]
    for state,target in [(32,0x40e28d),(44,0x40dfdb),(113,0x411e8f),(244,0x41937e)]:
        address=0x419434+state*4;offset,raw=image.locate(hex(address),4)
        assert int.from_bytes(raw,'little')==target
        dispatch.append(dict(state=state,address=hex(address),file_offset=offset,hex=raw.hex(),target=hex(target)))
    producer_text = ROOT / 'build/analysis/game-battle-physical-family-v1/424310-retained-pseudocode.txt'
    body_group = previous['body14_group']
    text_path = ROOT / body_group['artifact']['path']
    assert identity(text_path) == body_group['artifact']
    span = body_group['range']
    assert sha256(text_path.read_bytes()[span['start']:span['end_exclusive']]).hexdigest() == body_group['sha256']
    result = dict(stage=279, source=source, rea='6.7.0', provider='Ghidra12.1.4',
        evidence=dict(ledger=identity(bundle), closure=identity(closure)), previous=previous_identity,
        memory=memory, carried_windows=carried, supplemental_original_range=direct, operands=operands, calls=calls, dispatch=dispatch,
        producer_pseudocode=identity(producer_text), body14_group=body_group,
        supported_self=dict(categories=[0,1,3,5,6,75,76,77,78,79,80,81,84,85,87,95,110,258,259,266],
            result_mask='0xf17b', class5_first_result_mask='0xf17f', producer_extra81=True,
            shared_target_and_caster=True, result_class_after_self_reset=-1),
        control_ownership='Self charge freezes the same body for both roles. Reflection can release queued knockout/scatter. Local244 requests stop; remote49 retires that body. Existing7200 recovery remains for parked queues.',
        fresh_entry_scope='The same public command owner and resource ports run a subsequent entry without direct readiness or body-state writes.',
        original_runtime_observed=False, native_device_and_official_acceptance=False,
        extent_limit='Selected raw spans and verified complete retained producer/body14 ranges; no whole-game or runtime claim.')
    (HERE / 'source-check.json').write_text(json.dumps(result, indent=2) + '\n')
    print(json.dumps({key: len(result[key]) for key in ['memory', 'carried_windows', 'operands', 'calls']}))


if __name__ == '__main__':
    main()
