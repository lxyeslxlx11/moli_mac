"""Verify the assisting-slot routes, actions and data against the fixed PE."""
from hashlib import sha256
import json
from pathlib import Path
from runpy import run_path
import struct

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[1]
PRIVATE = ROOT / 'build/analysis' / HERE.name
network = run_path(str(HERE.parent / 'game-legacy-network-v1/verify_source.py'))
startup = run_path(str(HERE.parent / 'game-legacy-startup-materials-v1/verify_source.py'))


def main():
    image = startup['Image'](network['TARGET'], 1569280, network['SHA'])
    bundle = PRIVATE / 'rea-evidence.json'
    evidence = json.loads(bundle.read_text())
    assert evidence['artifacts'][0]['digest']['sha256'] == network['SHA']
    assert json.loads((PRIVATE / 'rea-closure.json').read_text()) == {
        'open': False, 'cleanup_pending': False, 'rea': '6.7.0',
    }
    memory, references = {}, []
    for record in evidence['records']:
        assert record['provider']['id'] == 'ghidra' and record['provider']['version'] == '12.1.4'
        result = record['normalized_result']
        if record['operation'] == 'xrefs':
            assert record['parameters'] == {'address': '0x599bbc'}
            for address in result:
                assert 0x42ce66 <= int(address, 16) < 0x42d6d1
                offset, raw = image.locate(address, 7)
                assert struct.pack('<I', 0x599bbc) in raw
                references.append(dict(address=address, file_offset=offset, evidence=record['evidence_id']))
        else:
            assert record['operation'] == 'read_bytes'
            address, count = result['address'], result['requested_bytes']
            offset, raw = image.locate(address, count)
            assert result['complete'] and result['returned_bytes'] == count and raw.hex() == result['bytes_hex']
            memory[address] = dict(file_offset=offset, bytes=count, sha256=sha256(raw).hexdigest(), evidence=record['evidence_id'])
    assert len(memory) == 32 and len(references) == 39

    def check(address, expected):
        raw = bytes.fromhex(expected)
        offset, actual = image.locate(address, len(raw))
        assert actual == raw, (address, expected, actual.hex())
        return dict(file_offset=offset, bytes=len(raw))

    operands = {address: check(address, raw) for address, raw in {
        '0x4359ff': '83fb0c', '0x435a14': '81ffff000000', '0x435a20': 'fe0437',
        '0x435a4b': 'f7c300008000', '0x435a64': '83fb0d',
        '0x42c6fc': '898244100000', '0x42c712': '89b008100000', '0x42c7cd': 'bb05000000',
        '0x42ce66': '83f80c', '0x42ce83': 'a3bc9b5900', '0x42cebc': '89820c100000',
        '0x42cf8b': '8982e80f0000', '0x42d015': '8981ec0f0000', '0x42d02b': 'c7811810000020010000',
        '0x42d137': '3dff000000', '0x42d171': 'a900008000', '0x42d24e': 'a808', '0x42d256': 'f6c401',
        '0x42d25f': 'a840', '0x42d2c4': '85f6', '0x42d2d8': '2586000000',
        '0x42d322': 'a820', '0x42d32a': 'a900000100',
        '0x42d391': '83f80d', '0x42d3ae': 'a3bc9b5900', '0x42d3e4': '89810c100000',
        '0x42d457': '8981e80f0000', '0x42d493': '8981ec0f0000', '0x42d57e': '3dff000000',
        '0x42d5c1': '6a00', '0x42d672': '89b030100000', '0x42d688': '899834100000',
        '0x412225': '83f862', '0x412230': '83f90c740583f90d', '0x41223a': '8b850c100000',
        '0x40f364': 'c7435400002041', '0x40f392': '680000a041', '0x40f397': '89b504100000',
        '0x40f3e9': '83f814', '0x40f430': 'c785d00f000004000000', '0x40f446': '89b3d0020000',
        '0x40f474': '898bb8020000', '0x41204c': '3d85000000', '0x412057': '6a19',
        '0x41e000': 'c786a80200004dae0100', '0x4128f1': '83f805',
    }.items()}

    calls = [image.call(hex(address), hex(target)) for address, target in (
        (0x435a04, 0x434cf0), (0x435a0a, 0x4234e0), (0x435a29, 0x4234e0),
        (0x435a3f, 0x434cf0), (0x435a46, 0x434cf0), (0x435a53, 0x434cf0),
        (0x435a58, 0x434cf0), (0x435a5d, 0x434cf0), (0x435a73, 0x4234e0),
        (0x435a92, 0x4234e0), (0x435aa8, 0x434cf0), (0x435aad, 0x434cf0),
        (0x42ce76, 0x4234e0), (0x42ce9a, 0x436930), (0x42d12f, 0x4234e0),
        (0x42d17f, 0x500a70), (0x42d18d, 0x500a70), (0x42d19b, 0x500a70),
        (0x42d1c4, 0x434af0), (0x42d1eb, 0x436e60), (0x42d352, 0x436930), (0x42d36e, 0x434a90),
        (0x42d3a1, 0x4234e0), (0x42d3c5, 0x436930), (0x42d576, 0x4234e0),
        (0x42d5ce, 0x434af0), (0x42d693, 0x436930), (0x42d6af, 0x434a90),
        (0x42d9f0, 0x434a70), (0x42d9f6, 0x4236d0), (0x412248, 0x434a70),
        (0x436e8f, 0x434af0), (0x436ea2, 0x434af0), (0x436ec7, 0x434af0),
        (0x40f002, 0x41a030), (0x40f3b5, 0x419e90), (0x40f3e1, 0x419fd0),
        (0x40f403, 0x434a70), (0x40f427, 0x434a30), (0x40f43a, 0x434b60),
        (0x40f48c, 0x4fd5f0), (0x40f492, 0x419ba0), (0x41210b, 0x41dc00),
        (0x432e54, 0x434b90), (0x432e72, 0x419f60),
    )]

    def actions(rows):
        result = []
        for address, action in rows:
            encoded = b'\x6a' + bytes([action]) if action < 128 else b'\x68' + struct.pack('<I', action)
            result.append(dict(address=hex(address), action=action, **check(hex(address), encoded.hex())))
        return result

    queues = {
        'assist12': actions([(0x42cead,147),(0x42cf12,8),(0x42cf27,6),(0x42cf3d,10),(0x42cff4,78),
            (0x42d04f,83),(0x42d064,34),(0x42d07a,89),(0x42d090,84),(0x42d0a5,35),(0x42d0c5,87),
            (0x42d0e7,244),(0x42d0ff,50),(0x42d10d,49),(0x42d379,72)]),
        'targets12': actions([(0x42d23d,0),(0x42d269,32),(0x42d292,244),(0x42d2a1,50),
            (0x42d2af,49),(0x42d30a,11),(0x42d33a,44)]),
        'assist13': actions([(0x42d3d8,8),(0x42d4b3,6),(0x42d4c8,10),(0x42d4de,62),(0x42d4f4,133),
            (0x42d50c,88),(0x42d535,244),(0x42d54d,50),(0x42d55c,49),(0x42d6b9,72)]),
        'targets13': actions([(0x42d622,0),(0x42d63a,146),(0x42d64c,155)]),
    }
    action_table = {action: check(hex(0x419434 + action * 4), struct.pack('<I', target).hex()) | dict(target=hex(target))
                    for action, target in [(6,0x40a785),(8,0x40c624),(34,0x40e76a),(35,0x40e79b),(72,0x40f4de),
                    (83,0x40f78e),(84,0x40efb6),(87,0x40f34c),(88,0x40f364),(89,0x40f7fc),(133,0x411f0a),
                    (135,0x4121b3),(146,0x411f0a),(147,0x411f0a),(155,0x41283b),(244,0x41937e)]}

    previous = HERE.parent / 'game-legacy-battle-status-position-v1/source-check.json'
    layout = json.loads(previous.read_text())['layout']
    midpoints = [[a + int((b - a) / 2) for a, b in zip(layout[start]['target'], layout[end]['target'])]
                 for start, end in [(10, 15), (5, 0), (15, 5)]]
    assert midpoints == [[188, 203], [449, 336], [318, 270]]
    assert struct.unpack('<3f', image.locate('0x52d404', 12)[1]) == (680, 840, -200)
    report = dict(stage=246, source=network['info'](image.path), evidence=network['info'](bundle),
                  previous=network['info'](previous), rea='6.7.0', provider='Ghidra 12.1.4', session_closed=True,
                  memory=memory, references=references, operands=operands, calls=calls, queues=queues,
                  action_table=action_table, midpoints=midpoints,
                  contract=dict(caster_field='body+0x100c', caster_signal=[10000, 19999],
                      scheduler_reservations=['caster', 'assist', 'each target'], scheduler_principal='assist',
                      target_fields=['slot', 'flags', 'amount'], variant12_extra_flag=0x800000, variant12_extra_fields=3,
                      variant12_result='Action 84 consumes the impact tuples and shared metadata, then clears the shake in 87.',
                      variant13_result='Action 88 approaches within 20, starts target 146 and 155, and departs the bounds.',
                      variant13_style=5, recovery_limit='current maximum HP',
                      assist_departure={'local': [244], 'nonlocal': [50, 49], 'trailing': [72]},
                      boundaries=['Missing assist and target native cleanup routes require separate implementation.',
                                  'Action 84 loads its first target before checking the terminating tuple.']),
                  limitations=['Static fixed historical sample. No original execution or official session.'])
    (HERE / 'source-check.json').write_text(json.dumps(report, indent=2) + '\n')
    print(f'{len(memory)} REA windows, {len(references)} references, {len(calls)} calls, {len(operands)} operands, {len(action_table)} actions')


if __name__ == '__main__':
    main()
