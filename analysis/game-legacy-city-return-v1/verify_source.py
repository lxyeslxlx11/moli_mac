"""Verify the fixed historical city producer, map rebuild and type15 source paths."""
import json
from pathlib import Path
from runpy import run_path
import struct


HERE = Path(__file__).resolve().parent
PRIVATE = HERE.parents[1] / 'build/analysis' / HERE.name
prior = run_path(str(HERE.parent / 'game-legacy-battle-alternate-exit-v1/verify_source.py'))
base = prior['base']
music = prior['music']


def main():
    image = base['Image'](music['SOURCE'], 1569280, music['SHA'])
    evidence_path = PRIVATE / 'rea-evidence.json'
    evidence = json.loads(evidence_path.read_text())
    assert evidence['artifacts'][0]['digest']['sha256'] == music['SHA']
    assert any(p['id'] == 'ghidra' and p['version'] == '12.1.4' for p in evidence['providers'])
    memory, procedures = {}, {}
    for record in evidence['records']:
        if record['operation'] == 'read_bytes':
            row = record['normalized_result']
            addr, length = row['address'], row['requested_bytes']
            assert row['complete'] and row['returned_bytes'] == length
            offset, raw = image.locate(addr, length)
            assert raw == bytes.fromhex(row['bytes_hex']), addr
            memory[addr] = dict(file_offset=offset, bytes=length, evidence=record['evidence_id'])
        if record['operation'] == 'procedure_pseudo_code':
            proc = record['parameters']['procedure']
            procedures[proc] = record['evidence_id']

    table = {}
    for phase, expected in ((1, 0x502193), (2, 0x502421), (11, 0x5021ae), (20, 0x502485),
                            (200, 0x501c83), (201, 0x501cbd), (202, 0x501d12),
                            (204, 0x501e95), (205, 0x501d51)):
        idx = image.locate(hex(0x502710 + phase), 1)[1][0]
        address = hex(0x5026b4 + 4 * idx)
        offset, raw = image.locate(address, 4)
        assert struct.unpack('<I', raw)[0] == expected
        table[phase] = dict(table_entry=address, file_offset=offset, target=hex(expected))
    assert struct.unpack('<I', image.locate('0x503e54', 4)[1])[0] == 0x50385f
    constants = {}
    for addr, expected in [('0x52ef44', -640), ('0x52d3f4', 640), ('0x52d42c', 240), ('0x52d400', 0)]:
        offset, raw = image.locate(addr, 4)
        assert struct.unpack('<f', raw)[0] == expected
        constants[addr] = dict(file_offset=offset, value=expected)
    for addr, text in [('0x567bf4', b'4}o'), ('0x567c50', b'TfD'), ('0x567d94', b'>HY'), ('0x567ca4', b'M6c')]:
        assert image.locate(addr, 4)[1] == text + b'\0'
    calls = [image.call(src, dst) for src, dst in (
        ('0x4878c6', '0x4f8840'), ('0x4f884b', '0x4fcea0'), ('0x4f8863', '0x4fca20'),
        ('0x4f8873', '0x4fce00'), ('0x4f8f94', '0x4f3430'), ('0x4f352b', '0x501a10'),
        ('0x4f3538', '0x440570'), ('0x4f3574', '0x4f67f0'), ('0x4f470a', '0x4f7e90'),
        ('0x4ef8ba', '0x502810'), ('0x4ef8bf', '0x4ff430'), ('0x501cf2', '0x505030'),
        ('0x501e2e', '0x506030'), ('0x501ece', '0x505030'), ('0x502363', '0x506030'),
        ('0x5023d3', '0x505030'), ('0x502438', '0x505030'), ('0x5051a0', '0x503330'),
        ('0x503d79', '0x44ce40'), ('0x43837b', '0x505030'), ('0x4383d7', '0x4f67f0'),
    )]
    summary = dict(
        stage=239, sample=base['identity'](image.path), previous=base['identity'](HERE.parent / 'game-legacy-battle-alternate-exit-v1/source-check.json'),
        evidence=base['identity'](evidence_path), records=len(evidence['records']), rea='6.7.0', provider='Ghidra 12.1.4',
        memory=memory, procedures=procedures, main9_dispatch=table, calls=calls, floats=constants,
        ordinary=dict(request='4}o', request_fields=0, flag='0xc5ec18', scene_consumer='0x4ef870',
                      scene_phases=[200, 201, 202, 205, 204, 20, 3], scene_wait=5,
                      early_boundary='>HY', early_boundary_reply='$!~ 0', rebuild_phases=[1, 11, 2, 20, 3], rebuild_wait=30,
                      flagged_trade_invite_reply=',ua 0'),
        type15=dict(wrapper='0x505194', engine='0x503330', case7='0x50385f', row_copy='0x503d46',
                    rows=480, order='ascending 0 through 479', increment=8, acceleration=2,
                    preparatory_gate='row241 outside [-640,640]', shrink_gate='row240 >= 240', completion='row0 >= 0'),
        limits=['Historical sample and static evidence. The server schedule is not observed.',
                'The local renderer waits for usable map and character data. Native pool and OS presentation details are outside this verification.'],
    )
    (HERE / 'source-check.json').write_text(json.dumps(summary, indent=2) + '\n')
    print(f'{len(memory)} REA/PE reads, {len(calls)} calls, {len(procedures)} procedure observations')


if __name__ == '__main__':
    main()
