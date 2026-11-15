"""Verify retained REA window, projection, pacing, and camera anchors against the fixed PE."""
from pathlib import Path
from runpy import run_path
import json
import struct


HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[1]
PRIVATE = ROOT / 'build/analysis' / HERE.name
SOURCE = 'build/analysis/game-release-current-v1/legacy-members/cg_se_6000.exe'
SHA = '37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd'
base = run_path(str(HERE.parent / 'game-legacy-startup-materials-v1/verify_source.py'))
identity = base['identity']


def main():
    image = base['Image'](SOURCE, 1569280, SHA)
    path = PRIVATE / 'rea-evidence.json'
    bundle = json.loads(path.read_text())
    assert bundle['artifacts'][0]['digest']['sha256'] == SHA
    assert any(p['id'] == 'ghidra' and p['version'] == '12.1.4' for p in bundle['providers'])
    records = bundle['records']
    assert len(records) == 79
    functions = {e['normalized_result']['procedure']['address']: e for e in records if e['operation'] == 'analyze_function'}
    entries = ('0x45cc90', '0x45d980', '0x507690', '0x463d70', '0x463dc0', '0x44fb50', '0x44fb60',
               '0x45eef0', '0x45f2f0', '0x4ff580', '0x4ef840', '0x4ef870', '0x460f20', '0x4610f0')
    assert struct.unpack('<3I', image.locate('0x53cb88', 12)[1]) == (2, 640, 480)
    assert struct.unpack('<2I', image.locate('0x53d578', 8)[1]) == (320, 240)
    assert image.locate('0x45d9be', 10)[1] == b'\x68\xe0\x01\0\0\x68\x80\x02\0\0'
    assert image.locate('0x507690', 1)[1] == b'\xc3'
    assert image.locate('0x45ef09', 2)[1] == b'\x33\xf6'
    assert image.locate('0x45ef19', 2)[1] == b'\x56\x56'
    assert struct.unpack('<f', image.locate('0x52d928', 4)[1]) == (64.0,)
    for address, instruction in [('0x45f37a', b'\xd9\x1d\x6c\x7e\x95\0'),
                                 ('0x45f3c4', b'\xd9\x1d\x70\x7e\x95\0'),
                                 ('0x45f4c2', b'\x89\x15\xc8\x22\xbf\0'),
                                 ('0x45f4c8', b'\xa3\xc4\x22\xbf\0'),
                                 ('0x44fb50', b'\xc7\x05\x80\x83\x72\0\x01\0\0\0'),
                                 ('0x44fd5a', b'\xc7\x05\x88\xcb\x53\0\x02\0\0\0')]:
        assert image.locate(address, len(instruction))[1] == instruction, address
    calls = [image.call(a, b) for a, b in [('0x45ce73', '0x45d980'), ('0x45ef1b', '0x45f2f0'),
                                          ('0x4ef923', '0x45f2f0'), ('0x4ef84f', '0x4ff580'), ('0x4ff58a', '0x45f2f0')]]
    selected = {'0x53cb8c': 8, '0x53cb88': 12, '0x53d578': 8, '0xbf22c4': 8, '0x728380': 4,
                '0x45d9a1': 73, '0x45ef15': 17, '0x45f36c': 31, '0x45f4b4': 26, '0x4ff580': 21,
                '0x4ef915': 27, '0x463d70': 77, '0x463dc0': 59, '0x44fcad': 28, '0x44fd5a': 13}
    windows, initialized = [], []
    for evidence in records:
        if evidence['operation'] != 'read_bytes':
            continue
        row = evidence['normalized_result']
        address, size = row['address'], row['returned_bytes']
        if selected.get(address) != row['requested_bytes']:
            continue
        assert row['complete'] and size == row['requested_bytes']
        details = dict(address=address, bytes=size, evidence_id=evidence['evidence_id'])
        if address in {'0xbf22c4', '0x728380'}:
            data = image.sections['.data']
            displacement = int(address, 16) - image.base - data['rva']
            assert data['raw_size'] <= displacement and displacement + size <= data['virtual_size']
            assert bytes.fromhex(row['bytes_hex']) == bytes(size)
            initialized.append(dict(**details, file_bytes=False))
        else:
            offset, raw = image.locate(address, size)
            assert raw.hex() == row['bytes_hex']
            windows.append(dict(**details, file_offset=offset))
    assert len(windows) == 13 and len(initialized) == 2
    assert {r['address'] for r in windows + initialized} == set(selected)
    closure = PRIVATE / 'rea-closure.json'
    assert json.loads(closure.read_text()) == dict(rea='6.7.0', open=False, cleanup_pending=False)
    report = dict(stage=231, source=identity(image.path), tools=dict(rea='6.7.0', ghidra='12.1.4'),
                  evidence=identity(path), closure=identity(closure), records=len(records),
                  functions={address: functions[address]['evidence_id'] for address in entries},
                  windows=windows, virtual_initializers=initialized, calls=calls,
                  ordinary_display=dict(width=640, height=480, center=[320, 240], initial_graphics_mode=2,
                                        force_render_initial=False),
                  camera=dict(tile_to_world_scale=64, pre_position_reset=[0, 0],
                              scene_position_set='0x4ef870 -> 0x45f2f0',
                              correction='0x4ef840 -> 0x4ff580 -> 0x45f2f0'),
                  original_execution=False, current_game_consumer='unverified')
    (HERE / 'source-check.json').write_text(json.dumps(report, indent=2) + '\n')
    print(f'{len(windows)} file windows, {len(calls)} calls, {len(entries)} functions, {len(initialized)} virtual initializers')


if __name__ == '__main__':
    main()
