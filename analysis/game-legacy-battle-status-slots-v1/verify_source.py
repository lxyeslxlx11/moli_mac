"""Verify the separate SKL98 slot records and the action callbacks against the fixed PE."""
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
    assert len(memory) == 28

    def check(address, expected):
        raw = bytes.fromhex(expected)
        offset, actual = image.locate(address, len(raw))
        assert actual == raw, address
        return dict(file_offset=offset, bytes=len(raw))

    selectors = {'6': ('0x42c828', '0x43597f'), '7': ('0x42c976', '0x4359a2'),
                 '8': ('0x42cd2f', '0x4359dc'), '12': ('0x42ce66', '0x4359ff'),
                 '13': ('0x42d391', '0x435a64')}
    routes = {n: {address: check(address, reg + format(int(n), '02x'))
                  for address, reg in zip(locations, ('83f8', '83fb'))}
              for n, locations in selectors.items()}
    anchors = {
        '0x42c831': 'bb20010000be84570000bfa8000000',
        '0x42c88b': '6a4e', '0x42c8ce': '899918100000', '0x42c8ee': '6a51',
        '0x42c903': '6a42', '0x42c919': '6a4f', '0x42c925': '89b110100000',
        '0x42c93b': '89b91c100000', '0x42c965': '6a36',
        '0x42c9d9': '8935c49d5900', '0x42ca09': '89358c8b5900',
        '0x42cc5b': 'c78018100000d2000000', '0x42ccc8': '83782c20',
        '0x42cd38': 'becd000000', '0x42cd91': 'f682dc0f000002',
        '0x42cdc4': '6afe', '0x42cdd2': '68da000000', '0x42cdf5': '6a4e',
        '0x42ce19': '6a33', '0x42ce2f': '6a31',
        '0x42ce83': 'a3bc9b5900', '0x42d3ae': 'a3bc9b5900',
        '0x40ecbb': 'c783b002000005000000', '0x40ecdf': '8983c4020000',
        '0x40ece5': '8983d0020000', '0x40f69c': '8b851c100000',
        '0x40f6da': 'c783b002000009000000', '0x40f6e7': 'd805e0d35200',
        '0x40f6ff': 'd81ddcd35200', '0x40f71e': '80cd10',
        '0x52d3dc': '6666a63f0ad7a33b',
    }
    operands = {address: check(address, raw) for address, raw in anchors.items()}
    entries = {49:0x40ea47, 51:0x40ead5, 54:0x40ecb8, 66:0x40ec5f,
               78:0x40f674, 79:0x40f696, 81:0x40f6da, 135:0x4121b3, 218:0x4154b0}
    action_table = {action: check(hex(0x419434 + 4 * action), struct.pack('<I', entry).hex()) | dict(target=hex(entry))
                    for action, entry in entries.items()}
    calls = [image.call(hex(address), hex(target)) for address, target in (
        (0x42c841, 0x434670), (0x42c847, 0x4234e0), (0x42c881, 0x434a90),
        (0x42c8e3, 0x434990), (0x42c8f9, 0x434990), (0x42c90e, 0x434990),
        (0x42c950, 0x434990), (0x42c969, 0x434990), (0x42c9ae, 0x419840), (0x42cd0f, 0x436930),
        (0x42cd3e, 0x434670), (0x42cd44, 0x4234e0), (0x42cd7a, 0x434a90),
        (0x42cd9b, 0x4348e0), (0x42cda9, 0x419840), (0x42cdc7, 0x434a90),
        (0x42cde0, 0x434990), (0x42ce0e, 0x434990), (0x42ce24, 0x434990),
        (0x42ce3a, 0x434990), (0x42ce48, 0x436930), (0x42ce70, 0x434670), (0x42d39b, 0x434670), (0x42d9da, 0x434a90),
        (0x42d9f0, 0x434a70), (0x42d9f6, 0x4236d0), (0x40ec6b, 0x420080),
        (0x40ecc5, 0x4fd5f0), (0x40eceb, 0x434a30), (0x40f6a5, 0x510000),
        (0x40f6ab, 0x434a30), (0x40f70d, 0x434a30), (0x40f72a, 0x4fd5f0),
    )]
    report = dict(stage=244, source=network['info'](image.path), evidence=network['info'](bundle),
                  previous=network['info'](HERE.parent / 'game-legacy-battle-status-variant-v1/source-check.json'),
                  rea='6.7.0', provider='Ghidra 12.1.4', session_closed=True, memory=memory, routes=routes,
                  calls=calls, operands=operands, action_table=action_table,
                  contract=dict(
                      variants=[6, 8], caster=[24, 53, 37, 38, 135, 62],
                      target_fields=['slot list', 'FF terminator'], aliases={'50':20, '51':21},
                      growth=dict(actions=[78, 81, 66, 79, 54], initial_sound=0x120, message=0x5784, final_sound=0xa8,
                                  scale_add_f32=0.005, scale_threshold_f32=1.3, status_bit=0x1000,
                                  growth_animation=9, final_animation=5),
                      removal=dict(actions=[78, 51, 49], sound=0xcd, dead_queue_reset='0x4348e0',
                                   local_pair_cache=dict(action=218, tuple=[-2, 0, 0, 0])),
                      tail=dict(tuple_end=-1, restart='0x434a70', attached_RID_reader='0x4236d0'),
                  ),
                  follow_up=dict(
                      variant7=dict(pair='0x419840', local_slot_write='0x42c9d9', caster_slot_write='0x42ca09',
                                    sound_write='0x42cc5b', second_move_state_gate='0x42ccc8'),
                      variants12_and13=dict(additional_slot_storage='0x599bbc', writes=['0x42ce83', '0x42d3ae']),
                  ),
                  limitations=['Static observations of the fixed sample.',
                               'Variants 7, 12 and 13 are located. Their state changes are outside this implementation.',
                               'Missing targets invoke a native cursor and wait reset. The complete reset remains outside the port.'])
    (HERE / 'source-check.json').write_text(json.dumps(report, indent=2) + '\n')
    print(f'{len(memory)} REA windows, {len(routes)} branches, {len(calls)} calls, {len(operands)} operands')


if __name__ == '__main__':
    main()
