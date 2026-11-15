"""Bind SKL98 assistant FF and the state 32 swap cut point to the fixed PE."""
from hashlib import sha256
import json
from pathlib import Path
from runpy import run_path

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[1]
PRIVATE = ROOT / 'build/analysis' / HERE.name
network = run_path(str(HERE.parent / 'game-legacy-network-v1/verify_source.py'))
startup = run_path(str(HERE.parent / 'game-legacy-startup-materials-v1/verify_source.py'))


def numeric_read(data, start):
    """Finite projection of the observed 434670 cursor and hex rules."""
    value, cursor, started = 0, start, False
    while cursor < len(data) and data[cursor]:
        byte = data[cursor]
        if 48 <= byte <= 57 or 65 <= byte <= 70:
            digit = byte - (48 if byte < 65 else 55)
            value = ((value << 4) | digit) & 0xffffffff
            started = True
        elif started or byte == 124:
            return value, cursor + 1
        cursor += 1
    return value, cursor


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
            references[record['parameters']['address']] = dict(evidence=record['evidence_id'], addresses=result)
            continue
        assert record['operation'] == 'read_bytes'
        address, count = result['address'], result['requested_bytes']
        offset, raw = image.locate(address, count)
        assert result['complete'] and result['returned_bytes'] == count and raw.hex() == result['bytes_hex']
        memory.append(dict(address=address, file_offset=offset, bytes=count, sha256=sha256(raw).hexdigest(), evidence=record['evidence_id']))
    assert len(memory) == 23 and len(references) == 2
    assert references['0x429404']['addresses'] == ['0x428f77']
    preflight_references = references['0x4362c6']['addresses']
    assert len(preflight_references) == 29
    assert [a for a in preflight_references if 0x435902 <= int(a, 16) < 0x435ab4] == ['0x435a1a', '0x435a83']

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

    operands = [check(a, raw) for a, raw in (
        (0x435919, '8bf8'), (0x435925, '880c37'), (0x4359ff, '83fb0c'), (0x435a64, '83fb0d'),
        (0x435a0f, '8bf8'), (0x435a14, '81ffff000000'), (0x435a78, '8bf8'), (0x435a7d, '81ffff000000'),
        (0x4362cd, 'c7450001000000893a'), (0x4362e0, 'c3'), (0x435ddc, 'c7450001000000893a'),
        (0x42c6c4, '6a18'), (0x42c731, '6a35'), (0x42c747, '6a25'), (0x42c75d, '6a26'),
        (0x42c778, '6887000000'), (0x42c7b3, '6a3e'), (0x42c712, '89b008100000'),
        (0x4349ce, 'c780d80f000001000000'),
        (0x42ce7e, '3dff000000a3bc9b5900'), (0x42d3a9, '3dff000000a3bc9b5900'),
        (0x428f71, '8b4258'), (0x43467d, '8b5664'), (0x434680, '0fbe8aa48b5900'),
        (0x43468b, '83f930'), (0x434690, '83f939'), (0x434695, '83f941'), (0x43469a, '83f946'),
        (0x4346aa, 'c1e004'), (0x4346c6, '83ff01'), (0x4346cb, '83f97c'),
        (0x4346d0, '42895664'), (0x4346d6, 'ff4664'), (0x4346db, 'c3'),
        (0x4335ad, '89486c'), (0x4335b6, '895070'), (0x4335bf, '894874'), (0x4335c8, '895078'),
        (0x4335d1, '89487c'), (0x4335da, '899080000000'), (0x4335e6, '898884000000'), (0x4335f2, '899088000000'),
        (0x4335fe, '89888c000000'), (0x43360a, '899090000000'), (0x433616, '898894000000'),
        (0x433622, '899098000000'), (0x43362e, '8988a4000000'), (0x43364c, 'c3'),
        (0x42cacd, '83782c20'), (0x42cb6c, '891485c4fa5800'), (0x42cb73, '893cb5c4fa5800'),
        (0x42cd1c, '6a006a006aff'), (0x40efc4, '8b442a1c'), (0x40efc8, '8b3485c4fa5800'), (0x40efd0, '8b7e0c'),
    )]
    branches = [branch(a, op, target) for a, op, target in (
        (0x435a1a, '0f84', 0x4362c6), (0x435a83, '0f84', 0x4362c6),
        (0x435a36, '0f84', 0x435dcc), (0x435a9f, '0f84', 0x435dcc),
        (0x42ce88, '0f84', 0x4335a3), (0x42d3b3, '0f84', 0x4335a3),
        (0x42ce97, '75', 0x42cea7), (0x42d3c2, '75', 0x42d3d2),
        (0x428f77, '0f84', 0x429404), (0x42948e, '0f84', 0x42c67b),
        (0x434689, '74', 0x4346d9), (0x4346ce, '74', 0x4346d6),
        (0x42cad1, '0f84', 0x42cb5a), (0x42c9a7, '0f84', 0x42cd0e),
        (0x42cd2a, 'e9', 0x42d9da), (0x42d141, '0f84', 0x42d35a),
    )]
    calls = [image.call(hex(a), hex(b)) for a, b in (
        (0x435914, 0x4234e0), (0x435a04, 0x434cf0), (0x435a0a, 0x4234e0),
        (0x435a6d, 0x434cf0), (0x435a73, 0x4234e0), (0x435dcd, 0x434e60),
        (0x429405, 0x434670), (0x42c727, 0x434990), (0x42c73c, 0x434990), (0x42c752, 0x434990),
        (0x42c768, 0x434990), (0x42c7a8, 0x434990), (0x42c7be, 0x434990),
        (0x42ce70, 0x434670), (0x42ce76, 0x4234e0), (0x42ce9a, 0x436930),
        (0x42d39b, 0x434670), (0x42d3a1, 0x4234e0), (0x42d3c5, 0x436930),
        (0x42cd0f, 0x436930), (0x42d9da, 0x434a90), (0x42d12f, 0x4234e0),
    )]
    projection = []
    for token, expected, width in [(b'SKL|', 0, 4), (b'RID|', 13, 4), (b'CFP|', 207, 3), (b'\0', 0, 0)]:
        sample = b'FF|' + token
        ff, end = numeric_read(sample, 0)
        result, next_cursor = numeric_read(sample, end)
        assert (ff, end, result, next_cursor) == (255, 3, expected, 3 + width)
        projection.append(dict(next_bytes_hex=token.hex(), value=result, cursor_advance=width))
    previous = HERE.parent / 'game-legacy-battle-physical-missing-v1/source-check.json'
    assist = HERE.parent / 'game-legacy-battle-status-assist-v1/source-check.json'
    assert sha256(previous.read_bytes()).hexdigest() == 'bebb285effd27afd90cb30f54450dd49facb133c63b85ea43087dca94d06ae8b'
    assert sha256(assist.read_bytes()).hexdigest() == '5cc5b2feff28873d54023b341056f25aa4e972ef1cccaa9d2d9bde635a3383f0'
    report = dict(
        stage=250, source=network['info'](image.path), evidence=network['info'](bundle),
        previous=network['info'](previous), prior_assist=network['info'](assist),
        rea='6.7.0', provider='Ghidra 12.1.4', session_closed=True, memory=memory, references=references,
        operands=operands, branches=branches, calls=calls, numeric_read_projection=projection,
        contract=dict(variants=[12, 13], assistant=255, preflight_marks_caster=True, preflight_principal=255,
                      preflight_group_advance=True, preflight_calls_attached_RID=False,
                      caster_prefix=[24, 53, 37, 38, 135, 62], prefix_sets_busy=True,
                      ff_returns_before_cleanup_activation_or_phase_change=True,
                      next_native_phase_zero_dispatch='429404 reads from the current numeric cursor, if invoked again.',
                      shared_completion='Discard the unactivated prefix and complete at the decoded boundary. Leave a following RID to its own owner.',
                      valid_assist_impact_empty='Action 84 indexes the first target before testing the terminator.',
                      state32='42cad1 skips formation reassignment, proceeds to both registry writes, and a later missing target calls 436930.',
                      native_runtime_observed=False),
    )
    (HERE / 'source-check.json').write_text(json.dumps(report, indent=2) + '\n')
    print(f'{len(memory)} REA windows, {len(references)} xref sets, {len(calls)} calls, '
          f'{len(operands)} operands, {len(branches)} branches, {len(projection)} synthetic cursor projections')


if __name__ == '__main__':
    main()
