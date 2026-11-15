"""Verify the legacy server-return dispatch, argument order and main-state branch."""
from pathlib import Path
from runpy import run_path
import json


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
        '0x4ef290': ('DAT_00d5d788 == 1', 's_successful_005678c8', 'DAT_00d5d782 = 1;',
                     'DAT_00d5d782 = 2;', 'FUN_00501a30(7);'),
        '0x501a30': ('DAT_00f5f19c = 0;', 'DAT_00f5f1a8 = param_1;'),
        '0x5015a0': ('DAT_00f5f17c = DAT_00f5f1a8;', 'DAT_00f5f1a0 = DAT_00f5f19c;',
                     'case 7:', 'FUN_004567a0();'),
        '0x4567a0': ('FUN_00456bc0();', 'FUN_00456a70();', 'iVar2 != 2', 'DAT_00f5f1a0 = 200;',
                     'DAT_00f5f1a0 == 0xc9', 'FUN_00454980(&DAT_00923b3c)', 'FUN_004ee2f0();', 'FUN_005019f0(2);'),
        '0x456bc0': ('FUN_005029b0();', 'FUN_00505030(0xe,8,0x40000000)'),
        '0x456a70': ('DAT_00d5d782 != 2', 'FUN_004ef1e0();', 'FUN_004ef230()'),
        '0x4ef230': ('DAT_00d5d788 != 2', 'DAT_00d5d782 == 1', 'DAT_00d5d782 != 2'),
        '0x4ef1e0': ('FUN_004f8720(DAT_00cd8e24);', 'DAT_00d5d788 = 1;'),
        '0x4ee2f0': ('DAT_00d18e34 = 0;', 'Ordinal_3(DAT_00cd8e24);', 'FUN_004fc650();'),
        '0x4f8720': ('PTR_DAT_00567be4', 'FUN_004fce00(param_1,DAT_00567db8);'),
        '0x437b30': ('DAT_00c5ec18 != 1', 'FUN_00501a10(9,1);', 'case 9:', 'FUN_00501a30(7);'),
    }
    dossiers = []
    for entry, markers in required.items():
        record = functions[entry]
        row = record['normalized_result']
        assert row['procedure']['body']['available'] and all(mark in row['pseudocode'] for mark in markers), entry
        dossiers.append(dict(entry=entry, evidence_id=record['evidence_id']))

    calls = [image.call(a, b) for a, b in (
        ('0x4fc115', '0x4fcee0'), ('0x4fc13d', '0x4fcee0'), ('0x4fc14c', '0x4ef290'),
        ('0x4ef375', '0x501a30'), ('0x50184a', '0x4567a0'), ('0x4567b5', '0x456bc0'),
        ('0x456bdd', '0x505030'), ('0x456933', '0x456a70'), ('0x456b02', '0x4ef1e0'),
        ('0x456b8a', '0x4ef230'), ('0x4ef1f4', '0x4f8720'), ('0x4568bb', '0x454980'),
        ('0x4568c7', '0x4ee2f0'), ('0x43827f', '0x501a30'))]
    operands = []
    for address, code in (
        ('0x4fc0bc', 'be347c5600'), ('0x4fc111', '8b4804'), ('0x4fc120', '8bf0'),
        ('0x4fc139', '8b4208'), ('0x4fc149', '505651'), ('0x4ef295', '83ec1083f8015356'),
        ('0x4ef29f', '8b442420'), ('0x4ef2f6', '8b442420bec8785600'),
        ('0x4ef373', '6a07'), ('0x456af8', '66833d82d7d500027405'), ('0x456bd9', '6a086a0e'),
    ):
        expected = bytes.fromhex(code)
        offset, raw = image.locate(address, len(expected))
        assert raw == expected, address
        operands.append(dict(address=address, file_offset=offset, bytes=len(raw)))

    physical = {'0x567c34':4, '0x5678c8':11, '0x567be4':4, '0x4ef32c':81, '0x50164c':39,
                '0x456af8':17, '0x456bd3':17, '0x4569b5':51, '0x4ee2f0':56}
    watched = {'0x4fc14c', '0x4ef375', '0x456af8', '0x456b02', '0x456b8a', '0x4569e1', '0x456bdd', '0x43827f'}
    mapped, instructions = {}, {}
    for record in records:
        row = record['normalized_result']
        if record['operation'] == 'read_bytes' and physical.get(row['address']) == row['requested_bytes']:
            address, size = row['address'], row['returned_bytes']
            offset, expected = image.locate(address, size)
            assert row['complete'] and size == physical[address] and bytes.fromhex(row['bytes_hex']) == expected
            mapped[address] = dict(address=address, bytes=size, file_offset=offset, evidence_id=record['evidence_id'])
        elif record['operation'] == 'inspect_native_instruction' and row['address'] in watched:
            address, size = row['address'], row['length']
            offset, expected = image.locate(address, size)
            assert bytes.fromhex(row['bytes']) == expected
            instructions[address] = dict(address=address, bytes=size, file_offset=offset, evidence_id=record['evidence_id'])
    assert set(mapped) == set(physical) and set(instructions) == watched
    for address, value in [('0x567c34', b'VKW\0'), ('0x5678c8', b'successful\0'), ('0x567be4', b'1^t\0')]:
        assert image.locate(address, len(value))[1] == value
    closure = PRIVATE / 'rea-closure.json'
    assert json.loads(closure.read_text()) == dict(rea='6.7.0', open=False, cleanup_pending=False)
    report = dict(stage=234, source=identity(image.path), tools=dict(rea='6.7.0', ghidra='12.1.4'),
                  bundle=identity(evidence_path), records=len(records), closure=identity(closure), functions=dossiers,
                  direct_calls=calls, checked_operands=operands, physical_windows=list(mapped.values()),
                  instructions=list(instructions.values()),
                  notice=dict(tag='VKW', status_wire_index=0, success='successful', comparison='case-sensitive',
                              function='0x4ef290', native_socket_parameter=True, unsolicited_result=2,
                              next_main=7, next_substate=0, native_notice_phase=201, request_1_caret_t=False),
                  remaining=['Native main7 transition pixels', 'Source producer for main10/9 and C5ec18=1 exit8'],
                  original_execution=False, current_game_consumer='unverified')
    (HERE / 'source-check.json').write_text(json.dumps(report, indent=2) + '\n')
    print(f'{len(mapped)} file windows, {len(instructions)} instructions, {len(calls)} calls, '
          f'{len(dossiers)} functions, {len(operands)} operand windows')


if __name__ == '__main__':
    main()
