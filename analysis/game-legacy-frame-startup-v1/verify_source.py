"""Check the ordinary frame and actor initializers against REA and the fixed PE."""
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
    markers = {
        '0x437b30': ('FUN_00433b70();', 'FUN_00501a10(9,1);'),
        '0x501a10': ('DAT_00f5f17c = param_1;', 'DAT_00f5f1a0 = param_2;'),
        '0x5015a0': ('case 9:', 'FUN_00501a50();', 'FUN_004ff080();', 'FUN_004403f0();'),
        '0x501a50': ('FUN_005028a0();', 'DAT_00f5f1a0 = 3;', 'FUN_00460c40();', 'FUN_00409fe0();'),
        '0x43b420': ('0xf9 < DAT_00f5f1a0', 'DAT_00f5f1a0 < 0xfd'),
        '0x433b70': ('DAT_0058f6b4 = 0;',),
        '0x409fe0': ('DAT_0058f6b4 != 1', 'DAT_0058f6b8 == 0', '3 < DAT_0058f6b8'),
        '0x4ff080': ('&DAT_00f53530', '0x2cec', '*puVar1 = 0;', 'DAT_00f5f170 = 0;'),
        '0x4403f0': ('&DAT_0059a424', '+ -0xda) = 0;', '(puVar1 + 1) = 0;', '+ 0x4a;'),
        '0x440450': ('&DAT_0059a424', '+ -0xda) = 0;', '(piVar2 + 1) = 0;', '+ 0x4a;'),
        '0x460c40': ('DAT_00f536b6 & 0x80', 'FUN_004610f0();', 'FUN_00460f20();'),
        '0x460f20': ('DAT_00957e98 = 0x3f800000;',),
        '0x4610f0': ('DAT_00957e98 = 0x3f800000;', '0x3f99999a;', '0x3fcccccd;', '0x40000000;'),
        '0x43c000': ('FUN_00409e70(2,0x44);', '&LAB_0043ba10', '+ 0x24) = 0x34;', '+ 0x2c) = 0;'),
        '0x409e70': ('FUN_0051bcf8(1,800)', 'FUN_0051bcf8(1,param_2)', '*puVar3 = 0;'),
        '0x51bcf8': ('_memset(_Dst,0,_Size);', 'HeapAlloc(DAT_00ff1b88,8,uVar3);'),
        '0x439080': ('switch(*(undefined4 *)(param_1 + 0x2c))', 'case 0:', 'return 0;'),
        '0x4fd0d0': ('+ 0x2d4) != 1', 'DAT_00f5f17c != 9', '& 0x80200'),
        '0x4ff3b0': ('FUN_0043c000(', '+ 0x24) | 0x80;'),
        '0x43f380': ('FUN_0043c000(', '+ 0xc) = iVar3;', 'FUN_004401b0(param_13);'),
        '0x43fcd0': ('FUN_0043c000(', '+ 0xc) = iVar2;', '(&DAT_0059a30a)[iVar2 * 0x94] = 2;'),
    }
    dossiers = []
    for entry, required in markers.items():
        evidence = functions[entry]
        result = evidence['normalized_result']
        assert result['procedure']['body']['available']
        assert all(s in result['pseudocode'] for s in required), entry
        dossiers.append(dict(entry=entry, evidence_id=evidence['evidence_id']))

    calls = [image.call(a, b) for a, b in (
        ('0x437bd6', '0x433b70'), ('0x43838e', '0x501a10'), ('0x501796', '0x4ff080'),
        ('0x50179b', '0x4403f0'), ('0x50185a', '0x501a50'), ('0x50248b', '0x5028a0'),
        ('0x5024bf', '0x460c40'), ('0x5024d5', '0x409fe0'), ('0x460f02', '0x4610f0'),
        ('0x460f0b', '0x460f20'), ('0x43ba2e', '0x43b420'), ('0x43ba73', '0x439080'),
        ('0x43c009', '0x409e70'), ('0x409e7b', '0x51bcf8'), ('0x4ff3d9', '0x43c000'))]
    field_writes = []
    for address, code in (
        ('0x43838c', '6a09'), ('0x502490', 'c705a0f1f50003000000'),
        ('0x4fd0db', '83bed402000001'), ('0x4fd2ec', '833d7cf1f500097509f7462400020800'),
        ('0x460f25', 'c705987e95000000803f'), ('0x4ff3ed', '80c980894824'),
        ('0x4402a0', '33ff'), ('0x440389', '6689bb4aa359006689bb28a45900'),
    ):
        expected = bytes.fromhex(code)
        offset, raw = image.locate(address, len(expected))
        assert raw == expected, address
        field_writes.append(dict(address=address, file_offset=offset, bytes=len(raw)))

    physical = {'0x43ba10':134, '0x43bbc0':105, '0x43bcc0':53, '0x43bd50':45,
                '0x501a10':17, '0x50185a':5, '0x4ff080':38, '0x4403f0':78,
                '0x43c000':100, '0x409e70':44, '0x4fd0d0':36, '0x460f20':16}
    virtual = {'0x58f6b4':8, '0x59a34a':4, '0x59a428':8, '0xf536b6':2}
    watched = {'0x43ba2e', '0x43ba4f', '0x43ba64', '0x43b420', '0x43bd54', '0x43bbfc', '0x43bcc5', '0x433bb5'}
    wanted = physical | virtual
    mapped, zeros, instructions = {}, {}, {}
    for evidence in records:
        row = evidence['normalized_result']
        if evidence['operation'] == 'read_bytes' and wanted.get(row['address']) == row['requested_bytes']:
            address, size = row['address'], row['returned_bytes']
            assert row['complete'] and size == wanted[address]
            item = dict(address=address, bytes=size, evidence_id=evidence['evidence_id'])
            raw = bytes.fromhex(row['bytes_hex'])
            if address in virtual:
                data = image.sections['.data']
                displacement = int(address, 16) - image.base - data['rva']
                assert data['raw_size'] <= displacement and displacement + size <= data['virtual_size']
                assert raw == bytes(size)
                zeros[address] = dict(**item, file_bytes=False)
            else:
                offset, expected = image.locate(address, size)
                assert raw == expected
                mapped[address] = dict(**item, file_offset=offset)
        elif evidence['operation'] == 'inspect_native_instruction' and row['address'] in watched:
            address, size = row['address'], row['length']
            offset, expected = image.locate(address, size)
            assert bytes.fromhex(row['bytes']) == expected
            instructions[address] = dict(address=address, bytes=size, file_offset=offset, evidence_id=evidence['evidence_id'])
    assert set(mapped) == set(physical) and set(zeros) == set(virtual) and set(instructions) == watched
    closure = PRIVATE / 'rea-closure.json'
    assert json.loads(closure.read_text()) == dict(rea='6.7.0', open=False, cleanup_pending=False)
    report = dict(stage=233, source=identity(image.path), tools=dict(rea='6.7.0', ghidra='12.1.4'),
                  bundle=identity(evidence_path), records=len(records), closure=identity(closure),
                  functions=dossiers, direct_calls=calls, physical_windows=list(mapped.values()),
                  instructions=list(instructions.values()), checked_field_instructions=field_writes,
                  virtual_initializers=list(zeros.values()),
                  runtime=dict(runtimeStage=3, ownGateByte=0, movementScale=1, soundScene=9, sparseMode=0),
                  actor=dict(bodyFlags=0x34, localBodyOr=0x80, specialState=0, frozen=0, childAction=None),
                  scope='Fresh ordinary map entry and allocated bodies. Party and packet owners supply live fields.',
                  original_execution=False, current_game_consumer='unverified')
    (HERE / 'source-check.json').write_text(json.dumps(report, indent=2) + '\n')
    print(f'{len(mapped)} file windows, {len(instructions)} instructions, {len(calls)} calls, '
          f'{len(dossiers)} functions, {len(zeros)} virtual initializers')


if __name__ == '__main__':
    main()
