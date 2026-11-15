"""Verify fixed legacy queue, guard and near-return evidence against the PE."""

from hashlib import sha256
import json
from pathlib import Path
from runpy import run_path
from struct import unpack


HERE = Path(__file__).resolve().parent
PRIVATE = HERE.parents[1] / 'build/analysis' / HERE.name
startup = run_path(str(HERE.parent / 'game-legacy-startup-materials-v1/verify_source.py'))
network = run_path(str(HERE.parent / 'game-legacy-network-v1/verify_source.py'))


def main():
    image = startup['Image'](network['TARGET'], 1569280, network['SHA'])
    identity = startup['identity']
    bundle = PRIVATE / 'rea-evidence.json'
    closure = PRIVATE / 'rea-closure.json'
    ledger = json.loads(bundle.read_text())
    assert ledger['artifacts'][0]['digest']['sha256'] == network['SHA']
    assert json.loads(closure.read_text()) == {'open': False, 'cleanup_pending': False, 'rea': '6.7.0'}
    memory, references, windows = [], {}, []
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
    assert len(memory) == 20 and not ledger['unknowns']
    assert {address: row['addresses'] for address, row in references.items()} == {
        '0x42fb2e': ['0x42fb24'],
        '0x40c4c9': ['0x40c3e5', '0x40c417', '0x40c43f'],
        '0x423fa0': ['0x4248da', '0x4249cf', '0x424ff7'],
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
        (0, 0x40a188), (22, 0x40c2e4), (23, 0x40c540), (24, 0x40a6b9),
        (49, 0x40ea47), (62, 0x40f5c9), (71, 0x40f505), (72, 0x40f4de),
        (216, 0x415027), (232, 0x417e59),
    ):
        address = 0x419434 + action * 4
        offset, raw = cover(address, 4)
        assert unpack('<I', raw)[0] == target
        callbacks[str(action)] = dict(address=hex(address), file_offset=offset, target=hex(target))

    operands = [verify(address, raw) for address, raw in (
        (0x42f5c1, 'f6c702'), (0x42f882, '837c244402'), (0x42f88d, '813da08b59000a010000'),
        (0x42f8b4, 'a3688b5900'), (0x42f8c3, '6aff'), (0x42f8d7, '6a48'),
        (0x42f8ef, 'f6c402'), (0x42f8f8, '8b04b5c4fa5800'), (0x42fa6e, 'a1688b5900'),
        (0x42fab6, '8b0c85c4fa5800'), (0x42fafc, '80e4fd'), (0x42fb1e, '8935688b5900'),
        (0x42fb34, '6a17'), (0x42fb58, '8b0c85c4fa5800'), (0x42fb75, '8b0485c4fa5800'),
        (0x42fbb6, '68d8000000'), (0x4349a9, '8b88c80f0000418988c80f0000'),
        (0x4349b6, '899488a40c0000'), (0x434a3b, '8b88c40f000041'),
        (0x434a50, '8b8488a40c0000'), (0x434a5c, '89422c'),
        (0x434b75, '468bce89b09c0c0000'), (0x40f50e, '8b54291c8b0495c4fa5800'),
        (0x40a19a, '81bc85a40c0000a1000000'), (0x40f5ca, 'c783b002000000000000'),
        (0x40c4d6, '83f814'), (0x40c4df, '81bd3c1000000a010000'),
        (0x40c4f1, 'c780f00f000000000000'), (0x40c501, '81bc88a80c0000d8000000'),
        (0x40c540, '8b8df00f000041'), (0x40c54f, '83f814'), (0x415039, '8b7c281c'),
        (0x40ea4a, 'c70485c4fa580000000000'), (0x423fef, '6a47'), (0x423fff, '6a00'),
        (0x425115, '68e8000000'), (0x435143, 'f6c702'), (0x43515b, '880c30'),
    )]
    branches = [branch(address, opcode, target) for address, opcode, target in (
        (0x42f5c4, '74', 0x42f54a), (0x42f887, '0f85', 0x42fd64), (0x42f897, '0f85', 0x42fd1b),
        (0x42f8f2, '0f84', 0x42fb26), (0x42fb24, 'eb', 0x42fb2e), (0x40a1a5, '75', 0x40a1b0),
        (0x40c4d9, '0f8d', 0x41549a), (0x40c4e9, '75', 0x40c52d), (0x40c50c, '75', 0x40c51a),
        (0x40c552, '0f8e', 0x419392), (0x435146, '74', 0x43515e),
    )]
    calls = []
    for address, target in (
        (0x42f5c7, 0x434670), (0x42f5cd, 0x4234e0), (0x42f8cc, 0x434af0), (0x42f8e2, 0x434990),
        (0x42f903, 0x434990), (0x42fa7e, 0x434990), (0x42fabf, 0x434990), (0x42fb3f, 0x434990),
        (0x42fb61, 0x434af0), (0x42fb7d, 0x434af0), (0x42fbbd, 0x434990), (0x40f51a, 0x434a30),
        (0x40f520, 0x434a30), (0x40f5d4, 0x434a30), (0x40a1a8, 0x434a30), (0x40c4ce, 0x419fd0),
        (0x40c512, 0x434a30), (0x40c51b, 0x40a090), (0x40ea56, 0x40a090), (0x415041, 0x434b60),
        (0x423fd3, 0x434a90), (0x423ff3, 0x434990), (0x424ff7, 0x423fa0), (0x42510e, 0x434af0),
        (0x425123, 0x434990), (0x43514e, 0x4234e0),
    ):
        cover(address, 5)
        calls.append(image.call(hex(address), hex(target)))

    prior = identity(HERE.parent / 'game-legacy-battle-guard-departure-v1/source-check.json')
    assert prior['sha256'] == '51907d538a5585109536d8ac23586eb35f25e7274d28a859cab2f2d75da4d0fe'
    result = dict(
        stage=255, source=identity(network['TARGET']), evidence=identity(bundle),
        prior=prior, closure=identity(closure), rea='6.7.0', provider='Ghidra 12.1.4',
        memory=memory, references=references, callbacks=callbacks, operands=operands, branches=branches, calls=calls,
        producer=dict(variant=2, category=266, guard_flag=512, registration_base='0x58fac4',
                      guard_queue_selection='0x42f8f8', caster_queue_selection='0x42fa75',
                      result_slot_assignment='0x42fb1e', same_slot_can_share_queue=True,
                      action_71_advances_tuple_target_then_self=True),
        near_catch=dict(distance_less_than=20, class_code=266, reset_parent_delay=True,
                        next_action=216, advance_before_retirement=True, delay_fallback_ticks=21),
        nested=dict(redirect='0x423fa0', nested_tuple='0x42510e', result_action=232,
                    guard_dependency='0x43515b', registry_clear='0x40ea4a'),
        limits=dict(original_execution_replayed=False, same_slot_recovery_is_portable_policy=True,
                    early_departure_recovery_is_portable_policy=True, port_resets_delay_only_when_next_action_216=True,
                    SKL113_nested_wire_proven=False),
        original_execution=0, VM_actions=0, official_sessions=0,
    )
    (HERE / 'source-check.json').write_text(json.dumps(result, indent=2) + '\n')
    print({key: len(result[key]) for key in ('memory', 'references', 'callbacks', 'operands', 'branches', 'calls')})


if __name__ == '__main__':
    main()
