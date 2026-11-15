"""Check legacy audio coordinates against retained REA and physical PE bytes."""
from hashlib import sha256
from pathlib import Path
from runpy import run_path
import json
import re
import struct


HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[1]
PRIVATE = ROOT / 'build/analysis' / HERE.name
base = run_path(str(HERE.parent / 'game-legacy-startup-materials-v1/verify_source.py'))
identity = base['identity']
SOURCE = 'build/analysis/game-release-current-v1/legacy-members/cg_se_6000.exe'
SHA = '37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd'


def retained(bundle, image):
    assert bundle['artifacts'][0]['digest']['sha256'] == SHA
    assert any(p['id'] == 'ghidra' and p['version'] == '12.1.4' for p in bundle['providers'])
    expected = {'0x56bae0', '0x508d01', '0x50f0dd', '0x569c08', '0x50ed79', '0x4fbd0d',
                '0x44fc72', '0x510b7b', '0x53cc1c', '0x53351c', '0x50f706', '0x52d988',
                '0x52d528', '0x538a90', '0x45d8f2', '0x53cd80', '0x508100', '0x501b9a',
                '0x50f8f0', '0x50fb0a', '0x50ff17', '0x569b78', '0x569ad8'}
    memory = []
    for record in bundle['records']:
        row = record['normalized_result']
        if record['operation'] == 'read_bytes' and row['address'] in expected:
            size = row['requested_bytes']
            offset, raw = image.locate(row['address'], size)
            assert row['complete'] and row['returned_bytes'] == size and bytes.fromhex(row['bytes_hex']) == raw
            memory.append(dict(address=row['address'], file_offset=offset, bytes=size, evidence_id=record['evidence_id']))
    assert {row['address'] for row in memory} == expected
    functions = {r['normalized_result']['procedure']['address']: r for r in bundle['records']
                 if r['operation'] == 'analyze_function'}
    required = {
        '0x4ef870': ('if (0 < param_11)', 'DAT_00f5f198 = param_11;'),
        '0x50f2d0': ('0x45564157', '0x20746d66', '0x61746164'),
        '0x50f550': ('DAT_00fba3c4 = 1;', 'DAT_00569adc) / 0xf;'),
        '0x50f5a0': ('log2((float10)100.0);', 'log2((float10)127.0);', '10000 < iVar3'),
        '0x50fa10': ('param_1 == 0xfffffffe', 'DAT_00569acc == 0', 'DAT_00fb94bc',
                     '_DAT_00fab260', '_DAT_00fac14c', 'DAT_00569b78'),
        '0x510000': ('DAT_00569ac8 == 0', '500 < param_1', 'DAT_00fac258', 'DAT_00fab850'),
        '0x510570': ('case 200:', 'DAT_00fba3d0 = 0xfffffffe;'),
        '0x510af0': ('DAT_00fab258 = DAT_00fab258 + -1;', 'FUN_0050f500();'),
        '0x510b50': ('FUN_00510af0();',),
    }
    dossiers = {}
    for address, markers in required.items():
        record = functions[address]
        assert all(marker in record['normalized_result']['pseudocode'] for marker in markers), address
        dossiers[address] = record['evidence_id']
    dispatch = next(r for r in bundle['records'] if r['operation'] == 'procedure_pseudo_code'
                    and 'FUN_004ef870(param_1,uVar5' in r['normalized_result'])
    assert 'uVar14 = FUN_004fcae0(*(undefined4 *)(DAT_00567ddc + 0x28));' in dispatch['normalized_result']
    assert 'uVar12,uVar13,uVar14,uVar15,' in dispatch['normalized_result']
    initializer = next(r for r in bundle['records'] if r['operation'] == 'procedure_pseudo_code'
                       and 'FUN_00507df0(void)' in r['normalized_result'])
    assert '(&DAT_00fac258)[iVar7 * 0x18] = DAT_00fb9474;' in initializer['normalized_result']
    dossiers.update({'0x4f8a40': dispatch['evidence_id'], '0x507df0': initializer['evidence_id']})
    return memory, dossiers


def installed_cue(relative_name):
    source = ROOT / 'build/analysis/diagnostic-material-20261026-_9d1ephh/source/app/bin'
    name = Path(relative_name).name
    index_path = source / 'soundaddr_1.txt'
    offset, length, entry = next(line.split(':') for line in index_path.read_text().splitlines()
                                 if line.lower().endswith(':' + name.lower()))
    offset, length = int(offset), int(length)
    with (source / 'sound_1.bin').open('rb') as archive:
        archive.seek(offset)
        entry_bytes = archive.read(length)
    loose = source / relative_name
    assert len(entry_bytes) == length and entry_bytes == loose.read_bytes()
    return dict(loose=identity(loose), index=identity(index_path), archive_entry=entry,
                archive_offset=offset, archive_bytes=length, member_sha256=sha256(entry_bytes).hexdigest())


def main():
    image = base['Image'](SOURCE, 1569280, SHA)
    bundle_path = PRIVATE / 'rea-evidence.json'
    bundle = json.loads(bundle_path.read_text())
    memory, dossiers = retained(bundle, image)
    calls = [image.call(a, b) for a, b in (
        ('0x4ef386', '0x510000'), ('0x456c18', '0x50f550'), ('0x4fbd0d', '0x4ef870'),
        ('0x501ba1', '0x510570'), ('0x501bbf', '0x50fa10'), ('0x44fc72', '0x510be0'),
        ('0x510be0', '0x510b50'), ('0x50ef4f', '0x50f2d0'), ('0x50fae7', '0x50f2d0'),
        ('0x50f921', '0x50f790'))]
    operands = {
        '0x4ef37a': '68f000000068400100006a3c',
        '0x508100': 'b264',
        '0x508d01': '8b0de0ba5600',
        '0x508d0d': '898c24000a0000',
        '0x508d51': '889424fa090000889c24fb090000889c24fc09000066c78424fe0900003c00',
        '0x50edb7': '8b442420668b00663dffff',
        '0x50efc5': 'b846000000',
        '0x50f11e': '83c34c83c41081fb100d0000',
        '0x510579': '83f82c0f874d020000ff2485d4075100',
        '0x50f7c5': '2bee',
        '0x50f7ff': '8b1560b2fa00',
    }
    physical = []
    for address, pattern in operands.items():
        expected = bytes.fromhex(pattern)
        offset, raw = image.locate(address, len(expected))
        assert raw == expected, address
        physical.append(dict(address=address, file_offset=offset, bytes=len(raw)))
    assert image.locate('0x53cc1c', 4)[1] == b'Bin\0'
    assert image.locate('0x53351c', 6)[1] == b'%s\\%s\0'
    assert image.locate('0x53cd80', 9)[1] == b'musicoff\0'
    assert image.locate('0x53cd8c', 9)[1] == b'soundoff\0'
    cue = image.locate('0x56bae0', 15)[1].rstrip(b'\0').decode('ascii').replace('\\', '/')
    assert cue == 'se/cgsys09.wav'
    assert struct.unpack('<4d', image.locate('0x52d988', 32)[1]) == (10000.0, -10000.0, 127.0, 100.0)
    assert struct.unpack('<2I', image.locate('0x569ad8', 8)[1]) == (15, 15)
    rate, = struct.unpack('<I', image.locate('0x569b78', 4)[1])
    assert rate == 22050
    period, = struct.unpack('<d', image.locate('0x538a90', 8)[1])
    assert period == 1000 / 60
    tracks = []
    for index in range(44):
        address = 0x569c08 + 76 * index
        offset, row = image.locate(hex(address), 76)
        path = row[:64].split(b'\0', 1)[0].decode('ascii').replace('\\', '/')
        level, mode, extra = struct.unpack_from('<iB3xi', row, 64)
        assert re.fullmatch(r'bgm/[a-zA-Z0-9_]+\.wav', path) and level == 90 and mode in (0, 2) and extra == 0
        tracks.append(dict(track=index, path=path, level=level, mode=mode, file_offset=offset))
    selectors = []
    for index, target in enumerate(struct.unpack('<45I', image.locate('0x5107d4', 45 * 4)[1])):
        code = image.locate(hex(target), 10)[1]
        assert code[:6] == bytes.fromhex('c705d0a3fb00')
        track, = struct.unpack_from('<i', code, 6)
        selectors.append(dict(code=200 + index, track=track, target=hex(target)))
    assert sorted(row['track'] for row in selectors) == [-2, *range(44)]
    source = dict(stage=236, sample=identity(image.path), evidence=identity(bundle_path),
                  rea='6.7.0', provider='Ghidra 12.1.4', evidence_records=len(bundle['records']),
                  memory=memory, procedures=dossiers, calls=calls, operands=physical,
                  resource_root='Bin', cue=dict(id=60, path=cue, level=100, pitch_offset=0, pan=64),
                  music=dict(wire_field=10, period_ms=period, default_rate=rate, tracks=tracks, selectors=selectors),
                  installed_material=installed_cue(cue))
    (HERE / 'source-check.json').write_text(json.dumps(source, indent=2) + '\n')
    print(f'{len(memory)} REA/PE ranges, {len(calls)} calls, {len(tracks)} tracks, {len(selectors)} selectors')


if __name__ == '__main__':
    main()
