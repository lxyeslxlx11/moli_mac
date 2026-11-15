"""Cross-check SKL98 pair records and live HP writes in the fixed historical PE."""
import json
from pathlib import Path
from runpy import run_path
import struct


HERE = Path(__file__).resolve().parent
PRIVATE = HERE.parents[1] / 'build/analysis' / HERE.name
prior = run_path(str(HERE.parent / 'game-legacy-battle-summon-v1/verify_source.py'))
base, sample = prior['base'], prior['sample']


def main():
    image = base['Image'](sample['SOURCE'], 1569280, sample['SHA'])
    bundle = PRIVATE / 'rea-evidence.json'
    evidence = json.loads(bundle.read_text())
    assert evidence['artifacts'][0]['digest']['sha256'] == sample['SHA']
    assert any(p['id'] == 'ghidra' and p['version'] == '12.1.4' for p in evidence['providers'])
    assert json.loads((PRIVATE / 'rea-closure.json').read_text()) == dict(open=False, cleanup_pending=False, rea='6.7.0')
    memory, procedures = {}, {}
    for row in evidence['records']:
        if row['operation'] == 'read_bytes':
            data = row['normalized_result']
            address, size = data['address'], data['requested_bytes']
            offset, raw = image.locate(address, size)
            assert data['complete'] and data['returned_bytes'] == size and bytes.fromhex(data['bytes_hex']) == raw
            memory[address] = dict(bytes=size, file_offset=offset, evidence=row['evidence_id'])
        elif row['operation'] == 'procedure_pseudo_code':
            assert row['normalized_result']
            procedures[row['parameters']['procedure']] = row['evidence_id']

    def check(address, expected):
        offset, raw = image.locate(hex(address), len(expected))
        assert raw == expected, hex(address)
        return dict(address=hex(address), bytes=len(raw), file_offset=offset)

    def branch(address, opcode, target):
        return check(address, opcode + struct.pack('<i', target - address - len(opcode) - 4)) | dict(target=hex(target))

    routes = dict(
        preflight=branch(0x4355e2, b'\x0f\x84', 0x435902),
        queue=branch(0x42948e, b'\x0f\x84', 0x42c67b),
        wait=check(0x433780, struct.pack('<I', 0x42929b)) | dict(target='0x42929b'),
        finish=branch(0x4292a1, b'\x0f\x85', 0x432e54),
    )
    calls = [image.call(hex(start), hex(target)) for start, target in (
        (0x435902, 0x434cf0), (0x435907, 0x434cf0), (0x435914, 0x4234e0), (0x435aba, 0x4234e0),
        (0x435ad0, 0x434cf0), (0x435ada, 0x434cf0), (0x42c67c, 0x434670), (0x42c682, 0x434670),
        (0x42c693, 0x4234e0), (0x42c6ae, 0x436930), (0x42c727, 0x434990), (0x42c73c, 0x434990),
        (0x42c752, 0x434990), (0x42c768, 0x434990), (0x42c7a8, 0x434990), (0x42c7be, 0x434990),
        (0x42d6dd, 0x4234e0), (0x42d705, 0x434670), (0x42d725, 0x434a90),
        (0x42d785, 0x434990), (0x42d7e4, 0x434990), (0x42d80a, 0x434990), (0x42d82f, 0x434990),
        (0x42d845, 0x434990), (0x42d85b, 0x434990), (0x42d890, 0x434990), (0x42d8b9, 0x434990),
        (0x42d8e9, 0x434670), (0x42d8f7, 0x4348e0), (0x42d920, 0x434990), (0x42d958, 0x434990),
        (0x42d971, 0x434990), (0x42d9b3, 0x434990), (0x42d9da, 0x434a90), (0x42d9f0, 0x434a70),
        (0x42d9f6, 0x4236d0), (0x432e54, 0x434b90), (0x432e72, 0x419f60), (0x432e78, 0x436930),
        (0x40e81f, 0x510000), (0x40e831, 0x510000), (0x40e936, 0x419f60), (0x40e93c, 0x434a30),
        (0x40e947, 0x4fd5f0), (0x40e94f, 0x4fd5f0), (0x412570, 0x41a240), (0x41258a, 0x434a70),
        (0x412a57, 0x420220), (0x40df95, 0x4032f0), (0x40dfce, 0x434a30), (0x433e2c, 0x4032f0),
        (0x413c6c, 0x41fe20), (0x413d32, 0x403450), (0x413d14, 0x419820),
    )]
    actions = {24:0x40a6b9, 37:0x40e7fd, 38:0x40e964, 43:0x40df8c, 44:0x40dfdb, 45:0x40e152,
               53:0x40ec43, 62:0x40f5c9, 117:0x411f0a, 131:0x411f0a, 132:0x411f0a, 135:0x4121b3,
               138:0x412a2a, 139:0x412a82, 145:0x4120be, 155:0x41283b, 178:0x413988, 199:0x413b44}
    action_table = {action:check(0x419434+4*action, struct.pack('<I', target)) | dict(target=hex(target))
                    for action, target in actions.items()}
    action_pushes = [(0x42c6c4,24), (0x42c731,53), (0x42c747,37), (0x42c75d,38), (0x42c778,135), (0x42c7b3,62),
                     (0x42d77a,117), (0x42d79f,138), (0x42d7fc,132), (0x42d824,45), (0x42d83a,43),
                     (0x42d850,44), (0x42d889,131), (0x42d8ab,139), (0x42d8d7,178), (0x42d902,145),
                     (0x42d939,77), (0x42d963,155), (0x42d9a8,38)]
    operands = [check(address, bytes((0x6a, action))) for address, action in action_pushes if action < 128]
    operands += [check(address, b'\x68'+struct.pack('<I', action)) for address, action in action_pushes if action >= 128]
    for address, pattern in (
        (0x40df8c, '6a00'), (0x40dfa1, '898374010000'), (0x40dfae, '898b78010000'),
        (0x40dfc2, '88937c010000'), (0x433e47, '899674010000'), (0x433e4d, '898678010000'),
        (0x433e3d, '888e7c010000'), (0x42d942, 'c7415400000041'),
        (0x412a35, '8b8d44100000'), (0x412a3b, '81c1fbad0100'),
    ):
        operands.append(check(address, bytes.fromhex(pattern)))
    digit_bases = [struct.unpack('<I', image.locate(hex(0x52d450+16*i), 4)[1])[0] for i in range(8)]
    assert digit_bases == list(range(243700,243780,10))
    report = dict(stage=242, sample=base['identity'](image.path), previous=base['identity'](HERE.parent / 'game-legacy-battle-summon-v1/source-check.json'),
                  evidence=base['identity'](bundle), records=len(evidence['records']), rea='6.7.0', provider='Ghidra 12.1.4',
                  memory=memory, procedures=procedures, routes=routes, action_table=action_table, calls=calls, operands=operands, digit_bases=digit_bases,
                  contract=dict(
                      variants=[0,1,2,3,4,5,9,10,11,14], remaining=[6,7,8,12,13],
                      caster_fields=['skill', 'MP', 'ignored', 'variant', 'slot'],
                      target_fields=['slot', 'flags', 'variant 11 only: signed amount'], terminator=255,
                      caster_actions=[24,53,37,38,135,62], tier=[3,3,3,2,2,2,1,1,1,0],
                      activation='135 signal 10000..19999; reseed from M length, ordinary body count and caster+target',
                      pre_cast_switch_passes=[36,70,102,132,160,186,210,232,252,270],
                      action43='4032f0 boxes zero, then payload 174/178/17c replaces the same current HP cells written by C',
                      actions_by_variant={'0..5':[117,138], '9':[132,45,43,44], '10':[131,139], '11':[145,77,155,38], '14':[]},
                      special10='178 replaces 131 for caster20 and target<10, or caster21 and target>=10; 199 inherits numeric fields',
                      finish='wait, reface caster, release',
                  ),
                  limitations=['Static fixed historical sample. The five other variants, attached RID and missing-target teardown remain outside this implementation.',
                               'Original timer cadence, packaged asset output and complete native RNG/presentation were not run.'])
    (HERE / 'source-check.json').write_text(json.dumps(report, indent=2) + '\n')
    print(f'{len(memory)} REA reads, {len(calls)} verified calls, {len(procedures)} procedures')


if __name__ == '__main__':
    main()
