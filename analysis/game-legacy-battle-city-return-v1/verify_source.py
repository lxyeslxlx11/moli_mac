"""Anchor the battle city-return boundary and the two receive branches in the fixed PE."""
import json
from pathlib import Path
from runpy import run_path
import struct


HERE = Path(__file__).resolve().parent
PRIVATE = HERE.parents[1] / 'build/analysis' / HERE.name
prior = run_path(str(HERE.parent / 'game-legacy-city-return-v1/verify_source.py'))
base, music = prior['base'], prior['music']


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
            offset, raw = image.locate(addr, length)
            assert row['complete'] and row['returned_bytes'] == length and bytes.fromhex(row['bytes_hex']) == raw, addr
            memory[addr] = dict(file_offset=offset, bytes=length, evidence=record['evidence_id'])
        if record['operation'] == 'procedure_pseudo_code':
            procedures[record['parameters']['procedure']] = record['evidence_id']

    def verify(address, expected):
        offset, raw = image.locate(address, len(expected))
        assert raw == expected, address
        return dict(address=address, file_offset=offset, bytes=len(raw))

    menu = verify('0x548304', struct.pack('<I', 0x487860))
    dispatch = {}
    for phase, destination in ((7, 0x43828f), (8, 0x43834b), (9, 0x438162)):
        slot = hex(0x43865c + 4 * phase)
        dispatch[phase] = verify(slot, struct.pack('<I', destination)) | dict(target=hex(destination))
    markers = {
        '0x4878d3': '83f80a750ac705a0f1f50007000000',
        '0x4878f3': 'ba0100000083c40c891518ecc500',
        '0x438340': '892df8815600a3a0f1f500',
        '0x438364': 'a118ecc5006800000040486a08f7d81bc024fe83c00e50',
        '0x438383': '3bc50f854ffcff ff556a09'.replace(' ', ''),
        '0x4383a0': '538d4c243c',
        '0x4f3445': '391d18ecc5000f8432010000',
        '0x4ef886': '833d7cf1f50009753f',
        '0x4ef8b0': 'c705a0f1f500c8000000',
    }
    operands = [verify(addr, bytes.fromhex(raw)) for addr, raw in markers.items()]
    strings = [verify(addr, raw + b'\0') | dict(text=raw.decode()) for addr, raw in (
        ('0x567bf4', b'4}o'), ('0x567d94', b'>HY'), ('0x567c50', b'TfD'),
    )]
    calls = [image.call(src, dst) for src, dst in (
        ('0x4878c6', '0x4f8840'), ('0x4878ee', '0x510000'), ('0x4f884b', '0x4fcea0'),
        ('0x4f8873', '0x4fce00'), ('0x4382a0', '0x436cf0'), ('0x4382bd', '0x50f550'),
        ('0x4382c2', '0x5029b0'), ('0x43837b', '0x505030'), ('0x43838e', '0x501a10'),
        ('0x43839b', '0x440570'), ('0x4383a5', '0x4032f0'), ('0x4383d7', '0x4f67f0'),
        ('0x4f8f94', '0x4f3430'), ('0x4f346d', '0x4ff430'), ('0x4f3472', '0x440450'),
        ('0x4f352b', '0x501a10'), ('0x4f3542', '0x4032f0'), ('0x4f3574', '0x4f67f0'),
        ('0x4ef8ba', '0x502810'), ('0x501ece', '0x505030'), ('0x502438', '0x505030'),
    )]
    previous = HERE.parent / 'game-legacy-city-return-v1/source-check.json'
    summary = dict(
        stage=240, sample=base['identity'](image.path), previous=base['identity'](previous),
        evidence=base['identity'](evidence_path), records=len(evidence['records']), rea='6.7.0', provider='Ghidra 12.1.4',
        memory=memory, procedures=procedures, menu=menu, main10_dispatch=dispatch, operands=operands,
        strings=strings, calls=calls,
        flow=dict(
            action='4}o', main10_substate=7, flag='0xc5ec18', phase7_falls_through_to8=True,
            battle_fade=14, battle_fade_boundary=[9, 1], battle_boundary_command='$!~ 0',
            early_boundary='>HY while city flag set', early_boundary_command='$!~ 0',
            flagged_receive_checks_main_state=False, transfer_switch_requires_main9=True,
            transfer_in_main10='update scene without requesting phase 200',
            transfer_in_main9='request phase 200 if the scene gate permits',
            main9_capture_fade=15,
        ),
        limitations=['Static fixed historical sample. Two menu/formatter entry points have initialized PE bytes but no canonical Ghidra procedure.',
                     'The ordering of the real server packets and the native frame timing are not observed.'],
    )
    (HERE / 'source-check.json').write_text(json.dumps(summary, indent=2) + '\n')
    print(f'{len(memory)} REA/PE reads, {len(calls)} calls, {len(procedures)} procedures')


if __name__ == '__main__':
    main()
