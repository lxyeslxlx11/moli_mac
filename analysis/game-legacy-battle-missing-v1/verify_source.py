"""Bind SKL98 missing participant cleanup and wait recovery to the fixed PE."""
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
    memory, references = {}, None
    for record in evidence['records']:
        assert record['provider']['id'] == 'ghidra' and record['provider']['version'] == '12.1.4'
        result = record['normalized_result']
        if record['operation'] == 'xrefs':
            assert record['parameters'] == {'address': '0x436930'}
            selected = [addr for addr in result if 0x42c681 <= int(addr, 16) < 0x42da0a]
            references = dict(total=len(result), evidence=record['evidence_id'],
                              SKL98=[image.call(addr, '0x436930') for addr in selected])
        else:
            assert record['operation'] == 'read_bytes'
            address, count = result['address'], result['requested_bytes']
            offset, raw = image.locate(address, count)
            assert result['complete'] and result['returned_bytes'] == count and raw.hex() == result['bytes_hex']
            memory[address] = dict(file_offset=offset, bytes=count, sha256=sha256(raw).hexdigest(), evidence=record['evidence_id'])
    assert len(memory) == 20 and references['total'] == 86 and len(references['SKL98']) == 8

    def check(address, expected):
        raw = bytes.fromhex(expected)
        offset, actual = image.locate(address, len(raw))
        assert actual == raw, (address, expected, actual.hex())
        return dict(file_offset=offset, bytes=len(raw))

    operands = {address: check(address, raw) for address, raw in {
        '0x43693e': '8b565c4a', '0x436949': '0f8eaf000000', '0x436952': '0fbe81a48b5900',
        '0x43695d': '83f841', '0x436962': '83f85a', '0x436988': '83c004', '0x43698f': '894664',
        '0x4369bf': '89692c', '0x4369c2': '895e58895e68', '0x4369ca': '8b86a8000000',
        '0x4369e7': '83ff16', '0x4369ec': '891d409c5900', '0x4369f2': '899eac000000',
        '0x436a14': '890d9c8b5900', '0x436a1d': '891c8dc09b5900', '0x436a24': '8b86a8000000',
        '0x436a47': '891d409c5900', '0x4347fa': 'f680dc0f000002', '0x434807': '837a2c0d',
        '0x434811': 'c742540000803f', '0x43485c': '89889c0c0000', '0x434862': '8988a00c0000',
        '0x43487a': '8988c40f0000', '0x434880': '8988a40c0000', '0x434898': '89b8c80f0000',
        '0x43489e': '89b8a80c0000', '0x4348b0': '89b83c100000', '0x4349ce': 'c780d80f000001000000',
        '0x434a81': '8b8490a40c0000', '0x434be3': '83b8d80f000001', '0x434c46': '3d201c00007e5c',
        '0x434c93': 'c783ac00000000000000', '0x434c74': '6a0b', '0x434c7f': '6a26',
        '0x42c6b6': 'e9e86e0000', '0x42c868': '0f84a0040000', '0x42c9a7': '0f8461030000',
        '0x42cd2a': 'e9ab0c0000', '0x42cd63': '0f84de000000', '0x42ce88': '0f8415670000',
        '0x42cea2': 'e9fc660000', '0x42d151': '0f84fb010000', '0x42d379': '6a48',
        '0x42d38c': 'e951060000', '0x42d3b3': '0f84ea610000', '0x42d3cd': 'e9d1610000',
        '0x42d598': '0f84f5000000', '0x42d6b9': '6a48', '0x42d6cc': 'e911030000',
        '0x42d6ff': '0f84bb020000', '0x42da02': 'ff4058', '0x4197d0': struct.pack('<I', 0x40a17b).hex(),
    }.items()}

    calls = [image.call(hex(address), hex(target)) for address, target in (
        (0x4369de, 0x4347e0), (0x436a38, 0x4347e0), (0x436a4d, 0x40a090),
        (0x4368f4, 0x4347e0), (0x434c6d, 0x4348e0), (0x434c78, 0x434990),
        (0x434c83, 0x434990), (0x434c8b, 0x434a70), (0x434cbb, 0x434990),
        (0x434ccb, 0x434990), (0x434cd8, 0x434a70), (0x42d36e, 0x434a90),
        (0x42d384, 0x434990), (0x42d6af, 0x434a90), (0x42d6c4, 0x434990),
        (0x42d9da, 0x434a90), (0x42d9f0, 0x434a70), (0x42d9f6, 0x4236d0),
        (0x4236f5, 0x423660), (0x432e54, 0x434b90), (0x432e78, 0x436930),
    )]

    routes = [dict(variants=variants, role=role, cleanup=hex(address), tail=tail) for variants, role, address, tail in (
        (list(range(15)), 'caster', 0x42c6ae, 'return'),
        ([6, 7], 'target', 0x42cd0f, 'caster terminator'),
        ([8], 'target', 0x42ce48, 'caster terminator'),
        ([12], 'assist', 0x42ce9a, 'return'),
        ([12], 'target', 0x42d352, 'assist terminator and action 72'),
        ([13], 'assist', 0x42d3c5, 'return'),
        ([13], 'target', 0x42d693, 'assist terminator and action 72'),
        ([0, 1, 2, 3, 4, 5, 9, 10, 11, 14], 'target', 0x42d9c0, 'caster terminator'),
    )]
    assert {row['cleanup'] for row in routes} == set(selected)
    previous = HERE.parent / 'game-legacy-battle-status-assist-v1/source-check.json'
    report = dict(stage=247, source=network['info'](image.path), evidence=network['info'](bundle),
                  previous=network['info'](previous), rea='6.7.0', provider='Ghidra 12.1.4', session_closed=True,
                  memory=memory, references=references, operands=operands, calls=calls, routes=routes,
                  contract=dict(remaining_records='Decrement, scan if positive, otherwise clear active bit and slot.',
                      reset='4347e0 resets 22 masked slots except absent/dead/type 13, retaining busy and body state.',
                      ready_cleared=True, preserves_earlier_variant7_swaps=True,
                      recovery_after_waits=7201, recovery_actions=[11, 38],
                      native_raw_scan='Starts at the live +0x64 field cursor, stops at A-Z or NUL, then advances four bytes.',
                      native_late_tail='May try RID0 from that cursor and increments phase at 42da02 after cleanup.',
                      shared_successor='Use the decoded record end, start merged successors with reset queues at phase zero.',
                      boundaries=['Absent slots covered for parsed SKL98. Assistant FF is a separate native route.',
                                  'Raw cursor drift and its attached RID behavior are outside the shared recovery path.']))
    (HERE / 'source-check.json').write_text(json.dumps(report, indent=2) + '\n')
    print(f'{len(memory)} REA windows, {len(routes)} SKL98 routes, {len(calls)} helper calls, {len(operands)} operands')


if __name__ == '__main__':
    main()
