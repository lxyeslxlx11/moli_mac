"""Verify the fixed lobby, battle and ordinary music transitions against REA and the PE."""
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
    evidence = json.loads(evidence_path.read_text())
    assert evidence['artifacts'][0]['digest']['sha256'] == SHA
    assert any(p['id'] == 'ghidra' and p['version'] == '12.1.4' for p in evidence['providers'])
    memory, virtual = {}, {}
    for record in evidence['records']:
        if record['operation'] != 'read_bytes':
            continue
        row = record['normalized_result']
        address, size = row['address'], row['requested_bytes']
        if address in ('0x534598', '0x5348a0', '0x5331ac', '0x53c9c0'):
            continue
        assert row['complete'] and row['returned_bytes'] == size
        raw = bytes.fromhex(row['bytes_hex'])
        if address in ('0xfba3d0', '0xf5f1a4'):
            section = image.sections['.data']
            relative = int(address, 16) - image.base - section['rva']
            assert section['raw_size'] <= relative and relative + size <= section['virtual_size']
            assert raw == b'\0' * 4
            virtual[address] = dict(initial=0, evidence_id=record['evidence_id'])
        else:
            offset, actual = image.locate(address, size)
            assert raw == actual, address
            memory[address] = dict(file_offset=offset, bytes=size, evidence_id=record['evidence_id'])
    assert len(memory) == 28 and len(virtual) == 2
    required = {
        '0x5015a0': ('case 2:', 'FUN_00457c30();', 'case 3:', 'FUN_00458900();'),
        '0x457c30': ('if (DAT_00f5f1a0 == 0)', 'FUN_0050fa10(0x11);'),
        '0x458900': ('FUN_005019f0(5);', 'FUN_0050f550();'),
        '0x4f3430': ('DAT_00599e10 = param_2;', 'DAT_0058fb30 = param_3;'),
        '0x437b30': ('if (DAT_00957e88 != 1)', 'DAT_0058fb30 < 0x3a40f',
                     '0x3a41a < DAT_0058fb30', '0x5b0 < DAT_0096ba10',
                     'FUN_0050fa10(0x10);', 'case 7:', 'FUN_0050f550();', 'case 9:'),
        '0x45f2a0': ('DAT_0096ba10 = param_2;', 'FUN_004649b0(param_1,param_2,param_8,param_7);'),
        '0x4649b0': ('DAT_00957e88 = param_4;',),
        '0x501a50': ('case 0xb:', '0x1d < DAT_00f5f190', 'FUN_0050fa10(DAT_00f5f1a4);',
                     'FUN_00510570(DAT_00f5f198);', 'case 0x68:', 'FUN_0050fa10(DAT_00fba3d0);'),
        '0x4f4610': ('DAT_00924f30 == 0', '199 < param_2', 'param_2 < 0xfa',
                     'DAT_00f5f198 = param_2;', 'DAT_00f5f194 = 1;'),
    }
    dossiers = {}
    for address, markers in required.items():
        name = f'FUN_{int(address, 16):08x}('
        record = next(r for r in evidence['records'] if r['operation'] == 'procedure_pseudo_code'
                      and any(name in line for line in r['normalized_result'].splitlines()[:6]))
        assert all(marker in record['normalized_result'] for marker in markers), address
        dossiers[address] = record['evidence_id']

    calls = [image.call(a, b) for a, b in (
        ('0x5016e1', '0x457c30'), ('0x457ca1', '0x50fa10'), ('0x458f28', '0x50f550'),
        ('0x4f8f94', '0x4f3430'), ('0x45f2e7', '0x4649b0'), ('0x437c97', '0x50fa10'),
        ('0x437cb4', '0x50fa10'), ('0x438196', '0x50f550'), ('0x4382bd', '0x50f550'),
        ('0x43838e', '0x501a10'), ('0x501be7', '0x50fa10'), ('0x50223b', '0x50f500'),
        ('0x502265', '0x510570'), ('0x502283', '0x50fa10'), ('0x5022b2', '0x50fa10'),
        ('0x4fb901', '0x4f4610'))]
    markers = {
        '0x457c9f': '6a11',
        '0x4f35c6': '8935109e5900',
        '0x4f3624': '890d30fb5800',
        '0x437c17': '392d887e9500754a',
        '0x437c24': '3d0fa403007c243d1aa403007f1d',
        '0x437c69': 'a1109e59003bc5742383f804741e3bc774163bc67412',
        '0x437c7f': '83f80575046a0eeb0f83f80675126a0feb066a10eb026a0d',
        '0x437c9f': 'a110ba96003db10500007c113dc80500007f0a6a10',
        '0x45f2e1': '890d10ba9600',
        '0x4649c7': 'a3887e9500',
        '0x501be1': 'a1d0a3fb0050',
        '0x5022a7': 'a1a4f1f50050a3d0a3fb00',
    }
    operands = {}
    for address, pattern in markers.items():
        expected = bytes.fromhex(pattern)
        offset, raw = image.locate(address, len(expected))
        assert raw == expected, address
        operands[address] = dict(file_offset=offset, bytes=len(raw))
    assert image.locate('0x567d94', 4)[1] == b'>HY\0'
    assert image.locate('0x567c68', 4)[1] == b'S)B\0'

    tables = {}
    for name, address in [('special', '0x438684'), ('mode1', '0x43869c')]:
        offset, raw = image.locate(address, 24)
        targets = struct.unpack('<6I', raw)
        selected = []
        for target in targets:
            op, track = image.locate(hex(target), 2)[1]
            assert op == 0x6a
            selected.append(track)
        tables[name] = dict(address=address, file_offset=offset, targets=[hex(target) for target in targets], tracks=selected)
    assert tables['special']['tracks'] == [34, 16, 16, 34, 35, 26]
    assert tables['mode1']['tracks'] == [25, 16, 16, 25, 26, 26]
    previous = HERE.parent / 'game-legacy-audio-v1/source-check.json'
    catalog = json.loads(previous.read_text())['music']['tracks']
    tracks = {str(n): catalog[n]['path'] for n in (0, 13, 14, 15, 16, 17, 25, 26, 34, 35)}
    summary = dict(
        stage=237, sample=identity(image.path), evidence=identity(evidence_path), records=len(evidence['records']),
        rea='6.7.0', provider='Ghidra 12.1.4', catalog=identity(previous), procedures=dossiers,
        memory=memory, virtual=virtual, calls=calls, operands=operands, tracks=tracks,
        lobby=dict(main=2, track=17, character_selection_fade='0x458f28'),
        battle=dict(tag='>HY', selection_main=10, selection_phase=0, tables=tables, other=[13, 16, 16, 13, 14, 15],
                    special_background=[0x3a40f, 0x3a41a], map_override=[0x5b1, 0x5c8], override_track=16,
                    mode_wire_field=1, background_wire_field=2, scene_mode_wire_field=9, map_wire_field=2,
                    exit_phase=7, return_main=9, return_phase=11, return_wait_frames=30),
        pending_scene_music=dict(tag='S)B', accepted=[200, 249], mapped=[200, 244], stop=218),
    )
    (HERE / 'source-check.json').write_text(json.dumps(summary, indent=2) + '\n')
    print(f'{len(memory)} REA/PE ranges, {len(calls)} calls, {len(dossiers)} procedures')


if __name__ == '__main__':
    main()
