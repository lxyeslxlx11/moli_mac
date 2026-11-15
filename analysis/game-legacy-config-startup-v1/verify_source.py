"""Verify the legacy startup configuration chain in retained REA and source bytes."""
from hashlib import sha256
from pathlib import Path
from runpy import run_path
import json


HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[1]
PRIVATE = ROOT / 'build/analysis' / HERE.name
SOURCE = 'build/analysis/game-release-current-v1/legacy-members/cg_se_6000.exe'
SOURCE_SHA256 = '37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd'
base = run_path(str(HERE.parent / 'game-legacy-startup-materials-v1/verify_source.py'))
identity = base['identity']


def main():
    image = base['Image'](SOURCE, 1569280, SOURCE_SHA256)
    path = PRIVATE / 'rea-evidence.json'
    bundle = json.loads(path.read_text())
    assert bundle['artifacts'][0]['digest']['sha256'] == SOURCE_SHA256
    assert any(provider['id'] == 'ghidra' and provider['version'] == '12.1.4' for provider in bundle['providers'])
    records = bundle['records']
    assert len(records) == 63
    functions = {e['normalized_result']['procedure']['address']: e for e in records if e['operation'] == 'analyze_function'}
    addresses = ('0x51dda5', '0x523b0a', '0x45cc90', '0x51b2e4', '0x51b2b3', '0x51f8b5', '0x51d5d3',
                 '0x51b1ed', '0x51f545', '0x520f45', '0x520faa', '0x45cfd0')
    data = image.sections['.data']
    assert data['raw_size'] <= 0xff1304 - image.base - data['rva'] < data['virtual_size'] - 3
    windows = []
    text_mode_default = None
    selected = {'0x51de5c': 41, '0x45ccb3': 79, '0x45cd1e': 41, '0x51b1ed': 89, '0x521077': 95,
                '0x52112f': 43, '0x5348a0': 2, '0x534598': 8, '0x53cd4c': 11, '0x53d478': 11, '0xff1304': 4}
    for evidence in records:
        if evidence['operation'] != 'read_bytes':
            continue
        row = evidence['normalized_result']
        address = hex(int(row['address'], 16))
        if selected.get(address) != row['requested_bytes']:
            continue
        assert row['complete'] and row['returned_bytes'] == row['requested_bytes']
        if address == '0xff1304':
            assert row['bytes_hex'] == '00000000'
            text_mode_default = dict(address=address, file_bytes=False, evidence_id=evidence['evidence_id'])
            continue
        at, raw = image.locate(address, row['returned_bytes'])
        assert raw.hex() == row['bytes_hex']
        windows.append(dict(address=address, file_offset=at, length=len(raw), evidence_id=evidence['evidence_id']))
    assert {r['address'] for r in windows} == set(selected) - {'0xff1304'} and len(windows) == 10 and text_mode_default
    assert image.locate('0x53cd4c', 11)[1] == b'Config.dat\0'
    assert image.locate('0x5348a0', 2)[1] == b'r\0'
    assert image.locate('0x534598', 3)[1] == b'%s\0'
    assert image.locate('0x53d478', 11)[1] == b'binfolder:\0'
    calls = [image.call(address, target) for address, target in (
        ('0x51de5c', '0x523b0a'), ('0x51de80', '0x45cc90'), ('0x45ccce', '0x51b2e4'),
        ('0x45ccfa', '0x51b1ed'), ('0x51b221', '0x51f545'), ('0x51f58d', '0x520f45'),
        ('0x51f9f4', '0x51d5d3'), ('0x45ce69', '0x45cfd0'), ('0x45d0e7', '0x51cb76'))]
    assert image.locate('0x45ccdc', 5)[1] == b'\xb9\x00\x05\x00\x00'
    assert image.locate('0x45ccf2', 5)[1] == b'\x68\x00\x01\x00\x00'
    assert image.locate('0x45cd21', 2)[1] == b'\xf2\xae'
    assert image.locate('0x45cd25', 1)[1] == b'\x4f'
    assert image.locate('0x5210ab', 2)[1] == b'\x3c\x1a'
    assert image.locate('0x5210b3', 2)[1] == b'\x3c\x0d'
    assert image.locate('0x5210cc', 3)[1] == b'\x80\x38\x0a'
    mode_xref = next(e for e in records if e['operation'] == 'xrefs' and e['normalized_result'] == ['0x51d612'])
    closure = PRIVATE / 'rea-closure.json'
    assert json.loads(closure.read_text()) == dict(rea='6.7.0', open=False, cleanup_pending=False)
    output = dict(stage=230, source=identity(image.path), tools=dict(rea='6.7.0', ghidra='12.1.4'),
                  previous_launcher=identity(HERE.parent / 'game-legacy-startup-materials-v1/source-check.json'),
                  evidence=identity(path), closure=identity(closure), records=len(records),
                  procedures={address: functions[address]['evidence_id'] for address in addresses},
                  windows=windows, calls=calls, default_text_mode=dict(**text_mode_default, reference=mode_xref['evidence_id']),
                  contract=dict(source_file='Config.dat', read_mode='r', line_output_limit=255,
                                merge_buffer_bytes_including_terminator=5120,
                                command='WinMain lpCmdLine without executable or its separator',
                                sequence='visible first line followed by command tail; no inserted separator',
                                regular_text_file='CRLF becomes LF; Ctrl-Z ends input; first NUL ends visible prefix'),
                  original_execution=False, current_game_consumer='unverified')
    (HERE / 'source-check.json').write_text(json.dumps(output, indent=2) + '\n')
    print(f'{len(windows)} original windows, {len(calls)} calls, {len(addresses)} functions and one virtual initializer')


if __name__ == '__main__':
    main()
