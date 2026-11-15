"""Check the menu exit callbacks, phase dispatch and return handshake in the fixed PE."""
import json
from pathlib import Path
from runpy import run_path
import struct


HERE = Path(__file__).resolve().parent
PRIVATE = HERE.parents[1] / 'build/analysis' / HERE.name
music = run_path(str(HERE.parent / 'game-legacy-music-phases-v1/verify_source.py'))
base = music['base']


def main():
    image = base['Image'](music['SOURCE'], 1569280, music['SHA'])
    evidence_path = PRIVATE / 'rea-evidence.json'
    evidence = json.loads(evidence_path.read_text())
    assert evidence['artifacts'][0]['digest']['sha256'] == music['SHA']
    assert any(p['id'] == 'ghidra' and p['version'] == '12.1.4' for p in evidence['providers'])
    memory = {}
    for record in evidence['records']:
        if record['operation'] != 'read_bytes':
            continue
        row = record['normalized_result']
        address, size = row['address'], row['requested_bytes']
        assert row['complete'] and row['returned_bytes'] == size
        offset, raw = image.locate(address, size)
        assert raw == bytes.fromhex(row['bytes_hex']), address
        memory[address] = dict(file_offset=offset, bytes=size, evidence_id=record['evidence_id'])
    assert len(memory) == 38

    procedures = {}
    for record in evidence['records']:
        if record['operation'] != 'procedure_pseudo_code':
            continue
        lines = record['normalized_result'].splitlines()
        address = next((line.split('FUN_')[1][:8] for line in lines[:6] if 'FUN_' in line), None)
        assert address
        procedures[hex(int(address, 16))] = record['evidence_id']
    assert len(procedures) == 23

    def check(address, expected):
        offset, raw = image.locate(address, len(expected))
        assert raw == expected, address
        return dict(address=address, file_offset=offset, bytes=len(raw))

    def pointer(address, target):
        return check(address, struct.pack('<I', int(target, 16))) | {'target': target}

    menu = []
    for label, descriptor, callback, help_address in (
        ('注销并回到城内登入点。', '0x548304', '0x487860', '0x563a04'),
        ('注销后回到服务器选择画面。', '0x548324', '0x487930', '0x563a1c'),
    ):
        menu.append(dict(label=label, descriptor=pointer(descriptor, callback),
                         help=check(help_address, label.encode('gb18030') + b'\0')))
    phases = [pointer('0x438678', '0x43828f'), pointer('0x43867c', '0x43834b'),
              pointer('0x438680', '0x438162')]
    markers = {
        '0x437b79': 'ff24855c864300',
        '0x487986': 'f644242402',
        '0x487994': 'a17cf1f50083f80a750cc705a0f1f50009000000',
        '0x4878d8': 'c705a0f1f50007000000',
        '0x4878f3': 'ba0100000083c40c891518ecc500',
        '0x4e2e57': 'c70518ecc50001000000',
        '0x456af8': '66833d82d7d500027405',
        '0x456bd4': '68000000406a086a0e',
        '0x4ef210': 'c70588d7d50001000000ff15a4d05200a38cd7d500',
        '0x4ef270': '3dc02709007616',
        '0x4ef2a3': 'c70588d7d50002000000',
        '0x4ef2e8': '66c70582d7d5000100',
        '0x4ef33f': '66c70582d7d5000200',
        '0x438364': 'a118ecc5006800000040486a08f7d81bc024fe83c00e50',
        '0x502421': 'a118ecc5006800000040486a08f7d81bc024fe83c00f50',
        '0x502457': '891d18ecc500',
    }
    operands = [check(address, bytes.fromhex(raw)) for address, raw in markers.items()]
    strings = [check(address, raw + b'\0') | {'text': raw.decode('ascii')} for address, raw in (
        ('0x5678c8', b'successful'), ('0x567be4', b'1^t'), ('0x567bf4', b'4}o'),
        ('0x567c34', b'VKW'), ('0x567d94', b'>HY'),
    )]
    calls = [image.call(address, target) for address, target in (
        ('0x4879dd', '0x501a30'), ('0x4879f1', '0x510000'), ('0x438196', '0x50f550'),
        ('0x43819b', '0x5029b0'), ('0x43827f', '0x501a30'), ('0x4567b5', '0x456bc0'),
        ('0x456bdd', '0x505030'), ('0x456c18', '0x50f550'), ('0x456933', '0x456a70'),
        ('0x456b02', '0x4ef1e0'), ('0x4ef1f4', '0x4f8720'), ('0x456b8a', '0x4ef230'),
        ('0x4f872b', '0x4fcea0'), ('0x4f8743', '0x4fca20'), ('0x4f8753', '0x4fce00'),
        ('0x45693d', '0x4ee2f0'), ('0x4568c7', '0x4ee2f0'), ('0x4569e1', '0x4ee2f0'),
        ('0x456a23', '0x4ee2f0'), ('0x4878c6', '0x4f8840'), ('0x4e2e27', '0x4f8840'),
        ('0x4f884b', '0x4fcea0'), ('0x4f8863', '0x4fca20'), ('0x4f8873', '0x4fce00'),
        ('0x4382bd', '0x50f550'), ('0x43837b', '0x505030'), ('0x43838e', '0x501a10'),
        ('0x4383d7', '0x4f67f0'), ('0x4f352b', '0x501a10'), ('0x4f3574', '0x4f67f0'),
        ('0x502438', '0x505030'),
    )]
    summary = dict(
        stage=238, sample=base['identity'](image.path), evidence=base['identity'](evidence_path),
        records=len(evidence['records']), rea='6.7.0', provider='Ghidra 12.1.4', memory=memory,
        procedures=procedures, menu=menu, battle_phases_7_through_9=phases,
        operands=operands, strings=strings, calls=calls,
        server_return=dict(main=7, battle_exit_phase=9, fade_type=14, sound=60, request='1^t',
                           request_fields=0, response='VKW', success='successful',
                           unsigned_timeout_condition='elapsed > 600000',
                           skip_request_when_response_status=2),
        city_return=dict(request='4}o', request_fields=0, flag='0xc5ec18', battle_exit_phase=7,
                         fade_phase=8, flag1_fade_out=14, flag1_fade_in=15, followup='$!~ 0',
                         scene_rebuild_order='pending'),
        limitations=['Fixed historical PE only. Some descriptor callbacks and interior entry points have no canonical Ghidra function.',
                     'Physical operands and direct calls are used for these locations. Native presentation and timing were not executed.'],
    )
    (HERE / 'source-check.json').write_text(json.dumps(summary, ensure_ascii=False, indent=2) + '\n')
    print(f'{len(memory)} REA/PE ranges, {len(calls)} calls, {len(procedures)} procedures')


if __name__ == '__main__':
    main()
