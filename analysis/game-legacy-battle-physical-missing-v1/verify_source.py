"""Verify fixed PE physical dispatch, absent-body cut points and cleanup tails."""
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
    memory, references = [], {}
    for record in evidence['records']:
        assert record['provider']['id'] == 'ghidra' and record['provider']['version'] == '12.1.4'
        result = record['normalized_result']
        if record['operation'] == 'xrefs':
            address = record['parameters']['address']
            references[address] = dict(evidence=record['evidence_id'], total=len(result), addresses=result)
            continue
        assert record['operation'] == 'read_bytes'
        address, count = result['address'], result['requested_bytes']
        offset, raw = image.locate(address, count)
        assert result['complete'] and result['returned_bytes'] == count and raw.hex() == result['bytes_hex']
        memory.append(dict(address=address, file_offset=offset, bytes=count, sha256=sha256(raw).hexdigest(), evidence=record['evidence_id']))
    assert len(memory) == 26 and len(references) == 3
    assert references['0x424310']['addresses'] == ['0x42987d']
    assert set(references['0x425fb9']['addresses']) == {'0x424946', '0x425f3a'}
    cleanups = references['0x436930'].pop('addresses')
    producer_bounds = [(0x424310, 0x426098), (0x4294ac, 0x4298ac), (0x42f098, 0x42fdd2)]
    scoped = [a for a in cleanups if any(lo <= int(a, 16) < hi for lo, hi in producer_bounds)]
    assert len(cleanups) == 86 and set(scoped) == {
        '0x42435b', '0x42461e', '0x425fb9', '0x429529', '0x429839', '0x42f148', '0x42f87a',
    }
    references['0x436930']['physical_calls'] = [image.call(a, '0x436930') for a in scoped]

    def check(address, expected):
        expected = bytes.fromhex(expected)
        offset, actual = image.locate(hex(address), len(expected))
        assert actual == expected, (hex(address), expected.hex(), actual.hex())
        return dict(address=hex(address), file_offset=offset, bytes=len(expected))

    def branch(address, opcode, target):
        prefix = bytes.fromhex(opcode)
        width = 1 if prefix[0] in (0x74, 0x75, 0x7d, 0x7c, 0xeb) else 4
        end = address + len(prefix) + width
        delta = (target - end).to_bytes(width, 'little', signed=True)
        return dict(**check(address, (prefix + delta).hex()), target=hex(target))

    def table(address, count):
        offset, data = image.locate(hex(address), count)
        tables[hex(address)] = dict(file_offset=offset, bytes=count, sha256=sha256(data).hexdigest())
        return data

    tables = {}
    low = struct.unpack('<12I', table(0x433878, 48))
    middle = struct.unpack('<16I', table(0x43390c, 64))
    high = struct.unpack('<4I', table(0x43394c, 16))
    destinations = {
        **{i: low[selector] for i, selector in enumerate(table(0x4338a8, 98))},
        **{i: target for i, target in enumerate(middle, 99)},
        **{i: high[selector] for i, selector in enumerate(table(0x43395c, 150), 117)},
    }
    categories = [0, 1, 3, 5, 6, 72, 73, 75, 76, 77, 78, 79, 80, 81, 84, 85, 87, 94, 95, 96,
                  105, 110, 113, 257, 258, 259, 260, 262, 266]
    assert [i for i, address in destinations.items() if address in (0x4294ac, 0x42f098)] == categories
    assert destinations[73] == 0x4294ac and len(categories) == 29

    operands = [check(a, raw) for a, raw in (
        (0x42949f, '8a90a8384300'), (0x4294a5, 'ff249578384300'),
        (0x42da25, 'ff24850c394300'), (0x42f08b, '8a885c394300'), (0x42f091, 'ff248d4c394300'),
        (0x42433c, '3dff000000'), (0x42434f, '8b0485c4fa5800'), (0x42436a, 'c36a26'),
        (0x424381, '6893000000'), (0x424414, '689c000000'), (0x424436, 'c7800410000001000000'),
        (0x42455f, '8982e80f0000'), (0x424593, '8982ec0f0000'),
        (0x424612, '8b0c85c4fa5800'), (0x42462d, 'c38b076a35'),
        (0x42463c, '89aa3c100000'), (0x424652, '898240100000'), (0x424668, '898808100000'),
        (0x424874, '68f2000000'), (0x4248ab, '2500020000'), (0x424903, '3d04010000'),
        (0x42490e, 'f744245c00000800'), (0x42493d, '8b0495c4fa5800'),
        (0x424043, '8b0cbdc4fa5800'), (0x42404c, '8b510c'),
        (0x425ec5, '8b0c85c4fa5800'), (0x425ef4, '83b94010000009'), (0x425efd, '6a4a'),
        (0x425f30, '8b0c85c4fa5800'), (0x425fa3, '89442450'),
        (0x425fc1, '8b44241c'), (0x425fd0, '83f814'), (0x425fe0, '6a0b'), (0x425feb, '6a2c'),
        (0x426012, '6a07'), (0x42601d, '6a0b'), (0x42602f, '6a0a'),
        (0x426046, '2d01010000'), (0x42605e, '83b94010000009'), (0x426067, '6a4a'), (0x42607d, '6a4a'),
        (0x4347fa, 'f680dc0f000002'), (0x434807, '837a2c0d'), (0x4348b6, '89b840100000'),
        (0x4294ea, '8b0485c4fa5800'), (0x4294f4, '8b480c'), (0x429618, '8b0c85c4fa5800'),
        (0x42f0e3, '8b1485c4fa5800'), (0x42f0fa, '8b420c'), (0x42f15a, '8999f40f0000'),
        (0x42f5dc, '8b0c85c4fa5800'), (0x42f882, '837c244402'), (0x42f88d, '813da08b59000a010000'),
        (0x42f89d, '8b44242c85c0'), (0x42f8c3, '6aff'), (0x42f8d7, '6a48'),
        (0x42f934, '6a27'), (0x42f936, '8b510c'), (0x42fb34, '6a17'),
        (0x42fd21, '6a006a006aff'), (0x42fd3a, '6a48'), (0x42fd4f, '6a17'),
        (0x42fd6a, '6a006a006aff'), (0x42fd83, '6a48'), (0x434a74, '85c97413'),
        (0x4298a4, 'ff4058'),
    )]
    branches = [branch(a, op, target) for a, op, target in (
        (0x4294b9, '0f84', 0x429859), (0x42f0af, '0f84', 0x42fdb0),
        (0x42f0b8, '0f84', 0x42fdb0), (0x42f0c2, '0f84', 0x42fdb0), (0x42fdcd, 'e9', 0x42987c),
        (0x424349, '0f84', 0x426090), (0x424358, '75', 0x42436b), (0x42461b, '75', 0x42462e),
        (0x424934, '0f84', 0x424a2f), (0x424946, '0f84', 0x425fb9),
        (0x425ebf, '0f84', 0x425fc1), (0x425ece, '0f84', 0x425fb8), (0x425f3a, '74', 0x425fb9),
        (0x425fce, '75', 0x426006), (0x42604b, '74', 0x42607b), (0x426065, '75', 0x426090),
        (0x429526, '75', 0x429536), (0x429612, '0f84', 0x429841), (0x429622, '0f84', 0x429839),
        (0x42f145, '75', 0x42f155), (0x42f563, '0f84', 0x42f882), (0x42f5e6, '0f84', 0x42f87a),
        (0x42f887, '0f85', 0x42fd64), (0x42f897, '0f85', 0x42fd1b), (0x42f8a3, '0f8c', 0x42fd1b),
    )]
    calls = [image.call(hex(a), hex(b)) for a, b in (
        (0x42436f, 0x434990), (0x4245f5, 0x434990), (0x424679, 0x434990),
        (0x424882, 0x434990), (0x42489f, 0x434af0), (0x4248da, 0x423fa0), (0x4248ec, 0x434990),
        (0x42494c, 0x434670), (0x425ea6, 0x434670), (0x425f13, 0x434990), (0x425f1c, 0x434670),
        (0x425f3c, 0x434670), (0x425fe4, 0x434990), (0x425ff6, 0x434990), (0x426016, 0x434990),
        (0x426028, 0x434990), (0x42603a, 0x434990), (0x42606b, 0x434990), (0x426088, 0x434990),
        (0x42987d, 0x424310), (0x42988f, 0x434a70), (0x429898, 0x4236d0), (0x42984f, 0x434a70),
        (0x42f8cc, 0x434af0), (0x42f8e2, 0x434990), (0x42fb3f, 0x434990),
        (0x42fb61, 0x434af0), (0x42fb7d, 0x434af0),
        (0x42fd2f, 0x434a90), (0x42fd45, 0x434990), (0x42fd5a, 0x434990),
        (0x42fd78, 0x434a90), (0x42fd8e, 0x434990), (0x42fda3, 0x434a70),
    )]
    prior = HERE.parent / 'game-legacy-battle-family-missing-v1/source-check.json'
    prior_self = HERE.parent / 'game-battle-self-physical-v1/source-check.json'
    assert sha256(prior.read_bytes()).hexdigest() == '96793309b9e63ecde6faa88f7a13b2b551fcf6fae026b4e65d93f9fbb4961506'
    assert sha256(prior_self.read_bytes()).hexdigest() == '4daa622cab5db7c44cd9a708be07f007bc566a28b5f3cc8a680966cd01f523ce'
    routes = [
        dict(point='first-pair', role='attacker', branch='0x424358', cleanup='0x42435b', tail='none'),
        dict(point='first-pair', role='target', branch='0x42461b', cleanup='0x42461e', tail='none'),
        dict(point='later-pair', role='attacker', branch='0x425ece', cleanup='0x425fb9', tail='pair return'),
        dict(point='later-pair', role='target', branch='0x425f3a', cleanup='0x425fb9', tail='pair return'),
        dict(point='chain-target', role='target', branch='0x424946', cleanup='0x425fb9', tail='pair return'),
        dict(point='target-list-73', role='target', branch='0x429622', cleanup='0x429839', tail='activate'),
        dict(point='target-list', role='target', branch='0x42f5e6', cleanup='0x42f87a', tail='terminator or saved-self result'),
    ]
    report = dict(
        stage=249, source=network['info'](image.path), evidence=network['info'](bundle),
        previous=network['info'](prior), saved_self=network['info'](prior_self),
        rea='6.7.0', provider='Ghidra 12.1.4', session_closed=True, memory=memory, references=references,
        dispatch=dict(tables=tables, pair_categories=categories, list_categories=[n for n in categories if n not in (72, 113)]),
        operands=operands, branches=branches, calls=calls, routes=routes,
        contract=dict(
            early_pair='First attacker absent precedes action 38. First target absent precedes class, level, MP cost and action 53.',
            late_pair='Principal slot below 20 gets 11/44 on retained KO, otherwise 7/11/10. The 257/262 action 74 is source-stage dependent.',
            late_262_level='42605e checks the post-cleanup level, 4348b6 resets it on ordinary bodies.',
            chain_prefix='424882 and 42489f queue action 242 and the outer tuple before the 260 chain target lookup.',
            related_list='73 target-list absence activates the caster without adding a terminator.',
            projectile_list='General list tail writes a sentinel and action 72. Variant 2 adds 23 and may restore the saved 266 self result.',
            guards='423fa0 can dereference the guard body at 42404c. A null guard has no established cleanup route.',
            positive_caster='4294f4 and 42f0fa can dereference the caster before the later null guard.',
            shared_successor='Use the decoded end, drop the interrupted RID0 and release-only tail for a merged owner.',
            native_cursor_and_phase_replayed=False, native_runtime_observed=False,
        ),
    )
    (HERE / 'source-check.json').write_text(json.dumps(report, indent=2) + '\n')
    print(f'{len(memory)} REA windows, {len(references)} xref sets, {len(routes)} routes, {len(calls)} calls, '
          f'{len(operands)} operands, {len(branches)} branches, {len(categories)} pair categories')


if __name__ == '__main__':
    main()
