"""Verify the fixed PE evidence for guard releases and saved self RID fields."""
from hashlib import sha256
import json
from pathlib import Path
from runpy import run_path
from struct import unpack


HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[1]
PRIVATE = ROOT / 'build/analysis' / HERE.name
startup = run_path(str(HERE.parent / 'game-legacy-startup-materials-v1/verify_source.py'))
network = run_path(str(HERE.parent / 'game-legacy-network-v1/verify_source.py'))


def main():
    image = startup['Image'](network['TARGET'], 1569280, network['SHA'])
    identity = startup['identity']
    bundle = PRIVATE / 'rea-evidence.json'
    ledger = json.loads(bundle.read_text())
    assert ledger['artifacts'][0]['digest']['sha256'] == network['SHA']
    closure = PRIVATE / 'rea-closure.json'
    assert json.loads(closure.read_text()) == {'open': False, 'cleanup_pending': False, 'rea': '6.7.0'}
    windows, references, memory = [], {}, []
    for record in ledger['records']:
        assert record['provider']['id'] == 'ghidra' and record['provider']['version'] == '12.1.4'
        result = record['normalized_result']
        if record['operation'] == 'xrefs':
            references[record['parameters']['address']] = dict(evidence=record['evidence_id'], addresses=result)
            continue
        assert record['operation'] == 'read_bytes'
        address, count = result['address'], result['requested_bytes']
        offset, raw = image.locate(address, count)
        assert result['complete'] and result['returned_bytes'] == count and raw.hex() == result['bytes_hex']
        memory.append(dict(address=address, file_offset=offset, bytes=count,
                           sha256=sha256(raw).hexdigest(), evidence=record['evidence_id']))
        windows.append((int(address, 16), int(address, 16) + count))
    assert len(memory) == 32
    assert {key: row['addresses'] for key, row in references.items()} == {
        '0x423fa0': ['0x4248da', '0x4249cf', '0x424ff7'],
        '0x4241f0': ['0x425690', '0x4257d5', '0x425d11'],
        '0x42f54a': ['0x42f5c4', '0x42f5d7', '0x42f7fc', '0x42f856', '0x42f875'],
        '0x42fb2e': ['0x42fb24'],
    }

    def cover(address, size):
        assert any(low <= address and address + size <= high for low, high in windows), hex(address)
        return image.locate(hex(address), size)

    def verify(address, expected):
        raw = bytes.fromhex(expected)
        offset, actual = cover(address, len(raw))
        assert actual == raw, (hex(address), expected, actual.hex())
        return dict(address=hex(address), file_offset=offset, bytes=len(raw))

    def branch(address, opcode, target):
        prefix = bytes.fromhex(opcode)
        width = 1 if len(prefix) == 1 and prefix[0] != 0xe9 else 4
        end = address + len(prefix) + width
        raw = prefix + (target - end).to_bytes(width, 'little', signed=True)
        return dict(**verify(address, raw.hex()), target=hex(target))

    callbacks = {}
    for action, target in (
        (0, 0x40a188), (1, 0x40a262), (4, 0x40a813), (23, 0x40c540), (24, 0x40a6b9),
        (39, 0x40e978), (42, 0x40e9e1), (62, 0x40f5c9), (71, 0x40f505), (72, 0x40f4de),
        (216, 0x415027),
    ):
        address = 0x419434 + action * 4
        offset, raw = cover(address, 4)
        assert unpack('<I', raw)[0] == target
        callbacks[str(action)] = dict(address=hex(address), file_offset=offset, target=hex(target))

    guard_actions = {}
    for role, pairs in {
        'caster': [(0x423fb3, 72), (0x423fdf, 24), (0x423fef, 71), (0x423fff, 0), (0x424012, 24)],
        'guard': [(0x424022, 0), (0x42404a, 39), (0x42406a, 78), (0x424094, 67), (0x4240b5, 34),
                  (0x4240c5, 73), (0x4240d5, 7), (0x4240e5, 4), (0x4240f5, 42), (0x424108, 71),
                  (0x424118, 10), (0x424128, 74), (0x424138, 72)],
        'protected': [(0x424163, 0), (0x424173, 27), (0x42419b, 71), (0x4241ab, 72),
                      (0x4241be, 62), (0x4241ce, 1)],
    }.items():
        guard_actions[role] = [dict(**verify(address, f'6a{action:02x}'), action=action) for address, action in pairs]

    operands = [verify(address, raw) for address, raw in (
        (0x42404f, '899a0c100000'), (0x42418d, '55'), (0x4241da, '8bc7'),
        (0x424f54, '83e501'), (0x424f76, '89442464'), (0x424ffc, '89442478'), (0x425115, '68e8000000'),
        (0x40a19a, '81bc85a40c0000a1000000'), (0x40a6c2, '8b4c2a1c'), (0x40a6cd, '85c0'),
        (0x40f50e, '8b54291c'), (0x40f512, '8b0495c4fa5800'), (0x434a41, '41'), (0x434a5c, '89422c'),
        (0x42f0a8, '83f848'), (0x42f0b5, '83f871'), (0x435106, '83f848'), (0x43515b, '880c30'),
        (0x42f532, '897c2430'), (0x42f536, '897c2440'), (0x42f53a, '897c2424'), (0x42f542, 'c744242cffffffff'),
        (0x42f58e, 'f7c300008000'), (0x42f5a3, '89442430'), (0x42f606, 'a900008000'),
        (0x42f628, '89442450'), (0x42f637, '83c418'), (0x42f63a, '89442414'),
        (0x42f88d, '813da08b59000a010000'), (0x42f8ff, '6a00'), (0x42f9ef, '6a47'),
        (0x42fa42, '6a47'), (0x42fa65, '6a00'), (0x42fa73, '6a00'), (0x42fab4, '6a00'),
        (0x42faea, '6a29'), (0x42fb34, '6a17'), (0x42fb82, '8b4c2448'), (0x42fb86, '8b542470'),
        (0x42fb8f, '51525750'), (0x42fbac, '83c44c'), (0x42fbb6, '68d8000000'),
    )]
    branches = [branch(address, opcode, target) for address, opcode, target in (
        (0x40a1a5, '75', 0x40a1b0), (0x40a6cf, '0f84', 0x410279), (0x434a36, '74', 0x434a67),
        (0x42f0af, '0f84', 0x42fdb0), (0x42f0b8, '0f84', 0x42fdb0), (0x435109, '75', 0x43515e),
        (0x42f563, '0f84', 0x42f882), (0x42f56f, '75', 0x42f5dc), (0x42f594, '74', 0x42f5c1),
        (0x42f60b, '74', 0x42f63e), (0x42f8f2, '0f84', 0x42fb26), (0x42fb24, 'eb', 0x42fb2e),
    )]
    calls = []
    for address, target in (
        (0x423fd3, 0x434a90), (0x423ff3, 0x434990), (0x42403e, 0x434a90), (0x42410c, 0x434990),
        (0x42418f, 0x434a90), (0x42419f, 0x434990), (0x424ff7, 0x423fa0), (0x42510e, 0x434af0),
        (0x425123, 0x434990), (0x425d11, 0x4241f0), (0x41027a, 0x434a30),
        (0x40f4df, 0x434b60), (0x40f4e5, 0x434a30), (0x40f51a, 0x434a30), (0x40f520, 0x434a30),
        (0x40f5d4, 0x434a30), (0x42f59d, 0x500a70), (0x42f5ad, 0x500a70), (0x42f5b9, 0x500a70),
        (0x42f622, 0x500a70), (0x42f632, 0x500a70), (0x42f903, 0x434990), (0x42f9f3, 0x434990),
        (0x42fa46, 0x434990), (0x42fa69, 0x434990), (0x42fa7e, 0x434990), (0x42fabf, 0x434990),
        (0x42fb3f, 0x434990), (0x42fb61, 0x434af0), (0x42fb7d, 0x434af0),
        (0x42fba1, 0x436e60), (0x42fbbd, 0x434990),
    ):
        cover(address, 5)
        calls.append(image.call(hex(address), hex(target)))

    # These pushes are live at each access. Both saved-result tails enter 42fb2e at the loop baseline.
    push_sites = {}
    for key, sites in {
        'self_RID_first': [(0x42f596, '55'), (0x42f59c, '50'), (0x42f5a2, '55')],
        'foreign_RID_second': [(0x42f60d, '55'), (0x42f613, '50'), (0x42f619, '55'),
                               (0x42f621, '50'), (0x42f627, '55')],
        'tail_RID': [(0x42fb34, '6a17'), (0x42fb3d, '50'), (0x42fb3e, '55'), (0x42fb55, '57'),
                     (0x42fb56, '53'), (0x42fb57, '51'), (0x42fb5f, '52'), (0x42fb60, '51'),
                     (0x42fb71, '57'), (0x42fb72, '53'), (0x42fb73, '52'), (0x42fb74, '50'), (0x42fb7c, '50')],
    }.items():
        push_sites[key] = [verify(address, raw) for address, raw in sites]
    self_pushes, foreign_pushes, tail_pushes = (len(push_sites[key]) for key in (
        'self_RID_first', 'foreign_RID_second', 'tail_RID',
    ))
    frame = {
        'base': 'ESP at 0x42f54a',
        'push_sites': push_sites,
        'self_RID_first': dict(write='0x42f5a3', encoded_offset=0x30, pushes=self_pushes, offset=0x30 - self_pushes * 4),
        'foreign_RID_second': dict(write='0x42f628', encoded_offset=0x50, pushes=foreign_pushes, offset=0x50 - foreign_pushes * 4),
        'foreign_RID_third': dict(write='0x42f63a', encoded_offset=0x14, pushes=0, offset=0x14),
        'tail_RID_second': dict(read='0x42fb86', encoded_offset=0x70, pushes=tail_pushes, offset=0x70 - tail_pushes * 4),
        'tail_RID_third': dict(read='0x42fb82', encoded_offset=0x48, pushes=tail_pushes, offset=0x48 - tail_pushes * 4),
    }
    assert frame['foreign_RID_second']['offset'] == frame['tail_RID_second']['offset'] == 0x3c
    assert frame['foreign_RID_third']['offset'] == frame['tail_RID_third']['offset'] == 0x14
    prior = identity(HERE.parent / 'game-legacy-battle-physical-boundaries-v1/source-check.json')
    assert prior['sha256'] == '1b0e7b2047ee0b55a3293dbfe7cea44cdc1e2cd1ca8166aa8da431d9f5ea95da'
    result = dict(stage=253, source=identity(network['TARGET']), evidence=identity(bundle),
                  prior=prior, closure=identity(closure), rea='6.7.0', provider='Ghidra 12.1.4',
                  memory=memory, references=references, callbacks=callbacks, guard_actions=guard_actions,
                  operands=operands, branches=branches, calls=calls, RID_frame=frame,
                  limits=dict(preentry_RID_slots_known=False, SKL113_nested_wire_proven=False,
                              original_target_departure_replayed=False, original_targetless_guard_replayed=False),
                  original_execution=0, VM_actions=0, official_sessions=0)
    (HERE / 'source-check.json').write_text(json.dumps(result, indent=2) + '\n')
    print({key: len(result[key]) for key in ('memory', 'references', 'callbacks', 'operands', 'branches', 'calls')})


if __name__ == '__main__':
    main()
