"""Bind the fixed PE's SKL93 preparation, command and body callbacks."""
import json
from pathlib import Path
from runpy import run_path
import struct


HERE = Path(__file__).resolve().parent
PRIVATE = HERE.parents[1] / 'build/analysis' / HERE.name
prior = run_path(str(HERE.parent / 'game-legacy-battle-city-return-v1/verify_source.py'))
base, sample = prior['base'], prior['music']


def main():
    image = base['Image'](sample['SOURCE'], 1569280, sample['SHA'])
    evidence_path = PRIVATE / 'rea-evidence.json'
    evidence = json.loads(evidence_path.read_text())
    assert evidence['artifacts'][0]['digest']['sha256'] == sample['SHA']
    assert any(p['id'] == 'ghidra' and p['version'] == '12.1.4' for p in evidence['providers'])
    closure = json.loads((PRIVATE / 'rea-closure.json').read_text())
    assert closure == dict(open=False, cleanup_pending=False, rea='6.7.0')
    memory, procedures = {}, {}
    for record in evidence['records']:
        if record['operation'] == 'read_bytes':
            row = record['normalized_result']
            addr, length = row['address'], row['requested_bytes']
            offset, raw = image.locate(addr, length)
            assert row['complete'] and row['returned_bytes'] == length and bytes.fromhex(row['bytes_hex']) == raw
            memory[addr] = dict(file_offset=offset, bytes=length, evidence=record['evidence_id'])
        elif record['operation'] == 'procedure_pseudo_code':
            assert record['normalized_result']
            procedures[record['parameters']['procedure']] = record['evidence_id']

    def dispatch(table, index, target):
        address = hex(table + 4 * index)
        offset, raw = image.locate(address, 4)
        assert struct.unpack('<I', raw)[0] == target
        return dict(index=index, address=address, file_offset=offset, target=hex(target))

    tables = dict(
        prepare=dispatch(0x43636c, image.locate(hex(0x436398 + 93), 1)[1][0], 0x435895),
        queue=dispatch(0x433878, image.locate(hex(0x4338a8 + 93), 1)[1][0], 0x42c243),
        wait=dispatch(0x4336fc, image.locate(hex(0x43371c + 93), 1)[1][0], 0x432e51),
        bodies=[dispatch(0x419434, action, target) for action, target in (
            (24, 0x40a6b9), (52, 0x40eb7c), (53, 0x40ec43), (65, 0x4125a0), (66, 0x40ec5f), (78, 0x40f674),
        )],
    )
    calls = [image.call(hex(src), hex(dst)) for src, dst in (
        (0x435895, 0x434cf0), (0x43589a, 0x434cf0), (0x4358a0, 0x4234e0), (0x4358b3, 0x4234e0),
        (0x4358d5, 0x434d60), *[(src, 0x434cf0) for src in range(0x4358dd, 0x435900, 5)],
        (0x42c244, 0x434670), (0x42c24a, 0x434670), (0x42c269, 0x436930), (0x42c2c7, 0x434990),
        (0x42c2dd, 0x434990), (0x42c2f2, 0x434990), (0x42c322, 0x434990),
        (0x42c354, 0x40a090), (0x42c360, 0x433a10), (0x42c380, 0x4346e0), (0x42c38c, 0x500a70),
        (0x42c5d1, 0x4235f0), (0x42c5ef, 0x434a90), (0x42c61f, 0x434990), (0x42c634, 0x434990),
        (0x42c654, 0x434a90), (0x42c667, 0x434a70), (0x432e54, 0x434b90), (0x432e72, 0x419f60),
        (0x432e78, 0x436930), (0x4125d8, 0x434a70), (0x4125de, 0x434b60), (0x4125fe, 0x4fd5f0),
        (0x40ec4c, 0x419860), (0x41987f, 0x403470), (0x419888, 0x4033e0), (0x40ebe4, 0x41dc00),
    )]
    operands = {
        '0x42c27e': '6a18', '0x42c2d2': '6a35', '0x42c2e7': '6a42', '0x42c2fd': '6a41',
        '0x42c309': 'c7811010000042570000', '0x42c33c': '3dff000000',
        '0x42c3c0': '8d8e70010000', '0x42c407': '8d8e80010000',
        '0x42c45a': '8d8eb0010000', '0x42c495': '8d8ec0010000',
        '0x42c4c5': '8983dc0f0000', '0x42c5c3': '89465c894660',
        '0x42c5fa': '6a4e', '0x42c606': 'c78018100000cc000000', '0x42c629': '6a34',
        '0x4125b0': '3d10270000', '0x4125b7': '3d204e0000',
        '0x40eb9e': 'd805e8d35200',
    }
    checked = {}
    for address, value in operands.items():
        expected = bytes.fromhex(value)
        offset, raw = image.locate(address, len(expected))
        assert raw == expected, address
        checked[address] = dict(file_offset=offset, bytes=len(raw))
    assert struct.unpack('<f', image.locate('0x52d3e8', 4)[1])[0] == struct.unpack('<f', struct.pack('<f', 0.02))[0]
    source = dict(
        stage=241, sample=base['identity'](image.path),
        previous=base['identity'](HERE.parent / 'game-legacy-battle-city-return-v1/source-check.json'),
        evidence=base['identity'](evidence_path), records=len(evidence['records']), rea='6.7.0', provider='Ghidra 12.1.4',
        memory=memory, procedures=procedures, dispatch=tables, calls=calls, operands=checked,
        contract=dict(
            class_code=93, caster_fields=['skill', 'signedMP', 'ignored', 'slot'],
            repeated=['slot', 'name<=28', 'resource', 'value1d0', 'HP', 'maxHP', 'MP', 'maxMP', 'flags'],
            terminator=255, caster_actions=[24, 53, 66, 65], caster_message=0x5742,
            replacement='mark current slot body deleted and allocate a new body on each target record',
            target_actions=[78, 52], target_sound=0xcc, initial_scale=0, grow_increment=0.02,
            activation_signal=[10000, 19999], friend_flags='4235f0 after status metadata bits 24 through 27',
            finish='434b90 waits on reserved bodies before refacing the caster and releasing',
        ),
        limitations=['Fixed historical sample. The full dispatcher is analyzed through bounded PE-backed windows.',
                     'The native allocation failure, caster self replacement, original asset timing and renderer output are not replayed.'],
    )
    (HERE / 'source-check.json').write_text(json.dumps(source, indent=2) + '\n')
    print(f'{len(memory)} REA reads, {len(calls)} verified calls, {len(procedures)} procedures')


if __name__ == '__main__':
    main()
