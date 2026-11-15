"""Verify fixed PE skill dispatch, missing body routes and recovery queue writes."""
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
    memory = {}
    for record in evidence['records']:
        assert record['operation'] == 'read_bytes'
        assert record['provider']['id'] == 'ghidra' and record['provider']['version'] == '12.1.4'
        result = record['normalized_result']
        address, count = result['address'], result['requested_bytes']
        offset, raw = image.locate(address, count)
        assert result['complete'] and result['returned_bytes'] == count and raw.hex() == result['bytes_hex']
        memory[address] = dict(file_offset=offset, bytes=count, sha256=sha256(raw).hexdigest(), evidence=record['evidence_id'])
    assert len(memory) == 22

    def check(address, expected):
        expected = bytes.fromhex(expected)
        offset, actual = image.locate(hex(address), len(expected))
        assert actual == expected, (hex(address), expected.hex(), actual.hex())
        return dict(address=hex(address), file_offset=offset, bytes=len(expected))

    def branch(address, opcode, target):
        prefix = bytes.fromhex(opcode)
        width = 1 if prefix[0] in (0x74, 0x75) else 4
        instruction_end = address + len(prefix) + width
        delta = (target - instruction_end).to_bytes(width, 'little', signed=True)
        return dict(**check(address, (prefix + delta).hex()), target=hex(target))

    table_offset, table = image.locate('0x433878', 48)
    selector_offset, selectors = image.locate('0x4338a8', 98)
    destinations = struct.unpack('<12I', table)
    assert all(selector < len(destinations) for selector in selectors)
    groups = {
        'status-list': (0x42b022, [*range(32, 50), *range(54, 61), *range(64, 69), 86]),
        'status-self': (0x42b5fc, [50, 51, 52, 53, 88]),
        'numeric': (0x429c15, [61, 62, 63, 83]),
        'casting': (0x42a495, list(range(19, 32))),
        'skill82': (0x42b947, [82]),
    }
    for entry, categories in groups.values():
        assert [code for code, selector in enumerate(selectors) if destinations[selector] == entry] == categories
    assert len({category for _, categories in groups.values() for category in categories}) == 54

    operands = [check(address, value) for address, value in (
        (0x42949f, '8a90a8384300'), (0x4294a5, 'ff249578384300'),
        (0x42b039, '8b0485c4fa5800'), (0x42b60e, '8b0c85c4fa5800'),
        (0x429c3d, '8b0485c4fa5800'), (0x42a4bd, '8b0485c4fa5800'), (0x42b95e, '8b0485c4fa5800'),
        (0x42b194, '8b0c85c4fa5800'), (0x429ed0, '8b0c85c4fa5800'),
        (0x42a692, '8b0c85c4fa5800'), (0x42bc39, '8b0c85c4fa5800'),
        (0x42b5c1, '6a006a006aff'), (0x42b5f4, 'ff4058'),
        (0x42a313, '6a006a006aff'), (0x42a326, 'a148fb5800'),
        (0x42a33c, '6a01'), (0x42a39b, '6889000000'), (0x42a3b4, '6a00'),
        (0x42a3c9, '6892000000'), (0x42a3e2, '689b000000'), (0x42a462, '6a48'),
        (0x42a382, '81e2fffffeff'), (0x42a489, 'c7475802000000'),
        (0x42a687, 'a3688b5900'), (0x42a72f, '893d584b5900'), (0x42ac7d, '6a006a006aff'), (0x42ac90, 'a148fb5800'),
        (0x42acf8, '8b8a2c10000089882c100000'), (0x42ad17, '81e3fffffeff'),
        (0x42ad30, '6889000000'), (0x42ad48, '6a00'),
        (0x42ae44, '833d688b59000a'), (0x42aeba, '833d688b59000a'),
        (0x42afbc, '8b0d688b59006a4a'), (0x434994, '85c07440'), (0x42b016, 'c7415802000000'),
        (0x42be4d, 'ff4058'), (0x4347fa, 'f680dc0f000002'), (0x434807, '837a2c0d'),
        (0x43693e, '8b565c4a'), (0x436952, '0fbe81a48b5900'),
        (0x42436a, 'c36a26'), (0x42462d, 'c38b076a35'),
    )]
    branch_checks = [branch(address, opcode, target) for address, opcode, target in (
        (0x42948e, '0f84', 0x42c67b),
        (0x42b045, '75', 0x42b055), (0x42b620, '75', 0x42b62f), (0x429c49, '75', 0x429c59),
        (0x42a4c9, '75', 0x42a4d9), (0x42b96a, '75', 0x42b97a),
        (0x42b050, 'e9', 0x4335a3), (0x42b62a, 'e9', 0x4335a3), (0x429c54, 'e9', 0x4335a3),
        (0x42a4d4, 'e9', 0x4335a3), (0x42b975, 'e9', 0x4335a3),
        (0x42b19e, '0f84', 0x42b5b3), (0x429eda, '0f84', 0x42a305),
        (0x42a69c, '0f84', 0x42ac6f), (0x42bc43, '0f84', 0x42be25),
        (0x42a330, '0f84', 0x42a46e), (0x42ac9a, '0f84', 0x42aff6),
        (0x42bc33, '0f84', 0x42be2d), (0x424358, '75', 0x42436b), (0x42461b, '75', 0x42462e),
    )]
    routes = []
    for group, role, cleanup, tail in (
        ('status-list', 'caster', 0x42b048, 'return'),
        ('status-self', 'caster', 0x42b622, 'return'),
        ('numeric', 'caster', 0x429c4c, 'return'),
        ('casting', 'caster', 0x42a4cc, 'return'),
        ('skill82', 'caster', 0x42b96d, 'return'),
        ('status-list', 'target', 0x42b5b3, 'terminator, activate, RID0 lookahead, increment phase'),
        ('numeric', 'target', 0x42a305, 'terminator, accumulated reflection, activate, RID0 lookahead, phase 2'),
        ('casting', 'target', 0x42ac6f, 'terminator, accumulated reflection, activate, RID0 lookahead, phase 2'),
        ('skill82', 'target', 0x42be25, 'activate, RID0 lookahead, increment phase'),
    ):
        routes.append(dict(group=group, role=role, cleanup=image.call(hex(cleanup), '0x436930'), tail=tail))
    calls = [image.call(hex(address), hex(target)) for address, target in (
        (0x42b5cf, 0x434a90), (0x42b5e2, 0x434a70), (0x42b5e8, 0x4236d0),
        (0x42a321, 0x434a90), (0x42a390, 0x434990), (0x42a3a9, 0x434990), (0x42a3bf, 0x434990),
        (0x42a3d7, 0x434990), (0x42a3f0, 0x434990), (0x42a44d, 0x434a90), (0x42a466, 0x434990),
        (0x42a47b, 0x434a70), (0x42a481, 0x4236d0),
        (0x42ac8b, 0x434a90), (0x42ad25, 0x434990), (0x42ad3e, 0x434990), (0x42ad53, 0x434990),
        (0x42ae58, 0x434990), (0x42ae74, 0x434990), (0x42af2b, 0x434af0), (0x42af5c, 0x436e60),
        (0x42afcd, 0x434990), (0x42af71, 0x434990),
        (0x42b004, 0x434a70), (0x42b00a, 0x4236d0), (0x42be3b, 0x434a70), (0x42be41, 0x4236d0),
    )]
    physical = dict(
        entry='0x424310', missing_first_actor=image.call('0x42435b', '0x436930'),
        missing_first_target=image.call('0x42461e', '0x436930'),
        boundary='The first actor aborts before action 38. The first target aborts before action 53. Later role and guard routes are separate.',
        implemented=False,
    )
    prior = HERE.parent / 'game-legacy-battle-missing-v1/source-check.json'
    assert sha256(prior.read_bytes()).hexdigest() == '29957fc82aff6efeecfe2feab81bda4785071eeb4caab30949136c4f61a34f45'
    report = dict(
        stage=248, source=network['info'](image.path), evidence=network['info'](bundle), previous=network['info'](prior),
        rea='6.7.0', provider='Ghidra 12.1.4', session_closed=True, memory=memory,
        dispatch=dict(table_file_offset=table_offset, selector_file_offset=selector_offset,
                      groups={key: dict(entry=hex(entry), categories=categories) for key, (entry, categories) in groups.items()}),
        operands=operands, branches=branch_checks, calls=calls, routes=routes, physical=physical,
        contract=dict(
            categories=54, caster_routes=5, list_target_routes=4,
            reflection=dict(total='signed 32-bit accumulated result from targets processed before the missing slot',
                            numeric_caster_actions=[0, 146, 155], reflector_actions=[1, 137, 72],
                            casting_feedback='SKL31 checks the live missing slot at 42ae44/42aeba',
                            casting_action74='42afcd targets that slot and 434990 returns on a null body'),
            reset='Reuse verified 436930 and 4347e0 rules from stage 247. Queue reset preserves busy.',
            shared_successor='Use validated nextOffset, omit the interrupted RID0 and release-only tail for merged owners.',
            native_cursor_and_phase_replayed=False, native_runtime_observed=False,
        ),
    )
    (HERE / 'source-check.json').write_text(json.dumps(report, indent=2) + '\n')
    print(f'{len(memory)} REA windows, {len(routes)} routes, {len(calls)} tail calls, {len(operands)} operands, {len(branch_checks)} branches')


if __name__ == '__main__':
    main()
