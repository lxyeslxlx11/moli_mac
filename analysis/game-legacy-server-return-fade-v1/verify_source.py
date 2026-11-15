"""Verify the fixed main7 capture and type14 drawing path against REA and the PE."""
from pathlib import Path
from runpy import run_path
import json
import struct


HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[1]
PRIVATE = ROOT / 'build/analysis' / HERE.name
base = run_path(str(HERE.parent / 'game-legacy-startup-materials-v1/verify_source.py'))
identity = base['identity']
SOURCE = 'build/analysis/game-release-current-v1/legacy-members/cg_se_6000.exe'
SHA = '37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd'


def main():
    image = base['Image'](SOURCE, 1569280, SHA)
    evidence_path = PRIVATE / 'rea-evidence.json'
    bundle = json.loads(evidence_path.read_text())
    assert bundle['artifacts'][0]['digest']['sha256'] == SHA
    assert any(p['id'] == 'ghidra' and p['version'] == '12.1.4' for p in bundle['providers'])
    records = bundle['records']
    functions = {r['normalized_result']['procedure']['address']: r for r in records
                 if r['operation'] == 'analyze_function'}
    required = {
        '0x4567a0': ('FUN_00456bc0();', 'FUN_00456a70();', 'DAT_00f5f1a0 = 200;'),
        '0x456bc0': ('DAT_00924fc0 == 0', 'FUN_005029b0();', 'DAT_00727360 = 2;', 'FUN_0050f550();',
                     'DAT_005681f8 = 1;', 'DAT_00924fc0 == 1', 'FUN_00505030(0xe,8,0x40000000)', 'DAT_00727360 = 0;'),
        '0x5029b0': ('DAT_00fab22c,0,0,*(undefined4 *)(DAT_00610668 + 0xc),0,0x10',),
        '0x505030': ('case 0xe:', 'FUN_005029f0(7,param_2,param_3);'),
        '0x5029f0': ('DAT_005681f8 == 1', 'case 7:', '0xef < iVar4', '0xf0 < iVar4',
                     '241.0 < _DAT_00f62d34', '_DAT_00f606b0 < -640.0', '640.0 < _DAT_00f606b0', 'FUN_0044ab50();'),
        '0x44ab50': ('local_14 = DAT_00614390;', 'DAT_00610668 + 0xc),0,0,0,0x1000400,local_64'),
        '0x44ce40': ('DAT_00610668 + 0x94', 'DAT_00610668 + 0x98', 'param_4,param_3,0x10'),
        '0x44fb60': ('_DAT_00728368 = _DAT_00538a90 + _DAT_00728368;', 'FUN_00446740();'),
        '0x4ef290': ('FUN_00510000(0x3c,0x140,0xf0);',),
        '0x50f550': ('DAT_00fba3c4 = 1;', 'DAT_00fab258 ='),
    }
    dossiers = []
    for entry, markers in required.items():
        record = functions[entry]
        row = record['normalized_result']
        assert row['procedure']['body']['available'] and all(mark in row['pseudocode'] for mark in markers), entry
        dossiers.append(dict(entry=entry, evidence_id=record['evidence_id']))

    calls = [image.call(a, b) for a, b in (
        ('0x4567b5', '0x456bc0'), ('0x456c09', '0x5029b0'), ('0x456c18', '0x50f550'),
        ('0x456bdd', '0x505030'), ('0x5050e3', '0x5029f0'), ('0x502f2a', '0x44ab50'),
        ('0x503215', '0x44ce40'), ('0x4ef386', '0x510000'))]
    operands = []
    for address, code in (
        ('0x456bd4', '68000000406a086a0e'), ('0x5050e1', '6a07'),
        ('0x5031e0', 'bedf010000bf680af600'), ('0x503221', '81ffec02f6007fc1'),
        ('0x44fea9', 'dd05908a5300dc0568837200'),
    ):
        expected = bytes.fromhex(code)
        offset, raw = image.locate(address, len(expected))
        assert raw == expected, address
        operands.append(dict(address=address, file_offset=offset, bytes=len(raw)))

    physical = {'0x456bc0':128, '0x5029b0':48, '0x5050d8':23, '0x502f2a':10, '0x5031e0':75,
                '0x44ab50':67, '0x44fea9':28, '0x538a90':8}
    watched = {'0x456c09', '0x456bdd', '0x456c18', '0x5029b6', '0x5050e3', '0x502f2a',
               '0x503215', '0x503227', '0x44fea9', '0x4ef386'}
    mapped, instructions = {}, {}
    virtual = None
    for record in records:
        row = record['normalized_result']
        if record['operation'] == 'read_bytes' and physical.get(row['address']) == row['requested_bytes']:
            address, size = row['address'], row['returned_bytes']
            offset, expected = image.locate(address, size)
            assert row['complete'] and size == physical[address] and bytes.fromhex(row['bytes_hex']) == expected
            mapped[address] = dict(address=address, bytes=size, file_offset=offset, evidence_id=record['evidence_id'])
        elif record['operation'] == 'read_bytes' and row['address'] == '0x614390':
            data = image.sections['.data']
            displacement = 0x614390 - image.base - data['rva']
            assert data['raw_size'] <= displacement and displacement + 4 <= data['virtual_size']
            assert row['complete'] and row['bytes_hex'] == '00000000'
            virtual = dict(address=row['address'], file_bytes=False, initial_value=0, evidence_id=record['evidence_id'])
        elif record['operation'] == 'inspect_native_instruction' and row['address'] in watched:
            address, size = row['address'], row['length']
            offset, expected = image.locate(address, size)
            assert bytes.fromhex(row['bytes']) == expected
            instructions[address] = dict(address=address, bytes=size, file_offset=offset, evidence_id=record['evidence_id'])
    assert set(mapped) == set(physical) and set(instructions) == watched and virtual
    period, = struct.unpack('<d', image.locate('0x538a90', 8)[1])
    assert period == 1000 / 60
    oracle = HERE.parent / 'game-battle-exit-v1/original-vectors.json'
    vectors = json.loads(oracle.read_text())
    frames = next(m['frames'] for m in vectors['modes'] if m['type'] == 14)
    assert vectors['source_sha256'] == SHA and len(frames) == 50
    assert frames[0]['rowPositions'] == list(range(480)) and frames[-1]['rowPositions'][241] == 661
    assert all(not f['complete'] for f in frames[:-1]) and frames[-1]['complete'] and not frames[-1]['copies']
    closure = PRIVATE / 'rea-closure.json'
    assert json.loads(closure.read_text()) == dict(rea='6.7.0', open=False, cleanup_pending=False)
    report = dict(stage=235, source=identity(image.path), tools=dict(rea='6.7.0', ghidra='12.1.4'),
                  bundle=identity(evidence_path), records=len(records), closure=identity(closure), functions=dossiers,
                  direct_calls=calls, checked_operands=operands, physical_windows=list(mapped.values()),
                  instructions=list(instructions.values()), virtual_clear_initial=virtual,
                  transition=dict(main=7, native_type=14, selector=7, width=640, height=480, capture_before_update=True,
                                  stride=8, acceleration=2, source_rows=[479, 1], completion_row=241,
                                  completion_limit=640, steps=len(frames), default_period_ms=period),
                  audio=dict(notice_sound_id=60, capture_music_fade='0x50f550', audible_playback_verified=False),
                  independent_type14_oracle=identity(oracle), original_execution=False)
    (HERE / 'source-check.json').write_text(json.dumps(report, indent=2) + '\n')
    print(f'{len(mapped)} file windows, {len(instructions)} instructions, {len(calls)} calls, '
          f'{len(dossiers)} functions, {len(operands)} operand windows, {len(frames)} type14 frames')


if __name__ == '__main__':
    main()
