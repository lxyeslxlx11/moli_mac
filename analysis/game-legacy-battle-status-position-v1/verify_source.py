"""Bind the SKL98 variant 7 slot, formation and queue writes to the fixed PE."""
from hashlib import sha256
import json
from pathlib import Path
import re
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
    assert len(memory) == 18

    def check(address, expected):
        raw = bytes.fromhex(expected)
        offset, actual = image.locate(address, len(raw))
        assert actual == raw, address
        return dict(file_offset=offset, bytes=len(raw))

    operands = {address: check(address, raw) for address, raw in {
        '0x4359a2': '83fb077535', '0x4359b5': '3dff000000', '0x4359c6': '880c30', '0x4359d8': '8808',
        '0x42c976': '83f807', '0x42c98e': '3dff000000', '0x42c9d7': '75068935c49d5900',
        '0x42ca07': '750689358c8b5900', '0x42ca0f': '8b0cb5b0375300',
        '0x42ca23': '8b8910385300', '0x42ca44': '8b8a14385300',
        '0x42ca66': '8b8a08385300', '0x42ca88': '8b8a0c385300',
        '0x42caa1': '897118', '0x42cabb': '894218', '0x42cacd': '83782c20',
        '0x42cb6c': '891485c4fa5800893cb5c4fa5800',
        '0x42cb83': '8b81b4130000', '0x42cb8d': '897010', '0x42cba5': '8982d4010000',
        '0x42cbbe': '894110', '0x42cbd0': '8991d4010000',
        '0x42cbf6': '8b8ab0130000', '0x42cc00': '894110', '0x42cc18': '8981d4010000',
        '0x42cc31': '894110', '0x42cc43': '8982d4010000',
        '0x42cc4f': '6a4e', '0x42cc5b': 'c78018100000d2000000', '0x42cc7e': '6a0b',
        '0x42cc94': 'bf00004040be64000000', '0x42ccc8': '83782c20', '0x42ccf0': '6a0b',
        '0x42cd20': '6aff', '0x434a70': '8b4c240485c97413', '0x40a405': 'db4504', '0x40a40c': 'db4500',
        '0x419f70': 'da600c', '0x419f79': 'da6008',
        '0x437e6b': 'a1c89d5900', '0x437e78': 'a3c49d5900',
    }.items()}
    calls = [image.call(hex(address), hex(target)) for address, target in (
        (0x4359a7, 0x434cf0), (0x4359ad, 0x4234e0), (0x4359c9, 0x419840),
        (0x42c980, 0x434670), (0x42c986, 0x4234e0), (0x42c9ae, 0x419840),
        (0x42c9f2, 0x434a90), (0x42cc74, 0x434990), (0x42cc89, 0x434990),
        (0x42cce9, 0x434a90), (0x42ccf4, 0x434990), (0x42cd0f, 0x436930),
        (0x42d9da, 0x434a90), (0x42d9f0, 0x434a70), (0x42d9f6, 0x4236d0),
        (0x412570, 0x41a240), (0x41258a, 0x434a70), (0x432e54, 0x434b90),
        (0x432e72, 0x419f60), (0x432e78, 0x436930),
    )]
    permutation = struct.unpack('<22i', image.locate('0x5337b0', 88)[1])
    native_rows = list(struct.iter_unpack('<4i', image.locate('0x533808', 352)[1]))
    layout = [dict(slot=slot, entry=list(native_rows[index][:2]), target=list(native_rows[index][2:]))
              for slot, index in enumerate(permutation)]
    source_layout = (ROOT / 'shared/legacy-game-battle-data.mjs').read_text()
    assert layout == json.loads(re.search(r'LEGACY_GAME_BATTLE_SLOT_LAYOUT=Object\.freeze\((\[.+?\])\.map', source_layout)[1])
    report = dict(stage=245, source=network['info'](image.path), evidence=network['info'](bundle),
                  previous=network['info'](HERE.parent / 'game-legacy-battle-status-slots-v1/source-check.json'),
                  rea='6.7.0', provider='Ghidra 12.1.4', session_closed=True, memory=memory,
                  operands=operands, calls=calls, formation_permutation=permutation, layout=layout,
                  contract=dict(
                      slots='Each supplied slot reserves itself and its 419840 pair. FF terminates.',
                      role_update='If the current local or caster slot equals the supplied slot, assign the pair.',
                      caster_actions=[24, 53, 37, 38, 135, 62],
                      producer_order=['append paired destination to the current caster', 'update caster slot',
                                      'write body slot and formation coordinates', 'swap registry entries',
                                      'reanchor linked objects', 'queue movement', 'append terminator and activate', 'consume RID0'],
                      moved=dict(actions=[78, 11], sound=0xd2, speed=3, speed_percent=100),
                      partner=dict(actions=[11], exclude_state=32, preserve_formation_if_excluded=True),
                      empty_activation='434a70 returns for a vacant tuple destination after sequential swaps.',
                      next_character_input='437e78 assigns the P-derived slot to the current local slot when a new C is applied.',
                  ),
                  limitations=['Static fixed historical sample. Missing selected bodies enter a separate native reset.',
                               'Native renderer and current-version behavior are outside this evidence.'])
    (HERE / 'source-check.json').write_text(json.dumps(report, indent=2) + '\n')
    print(f'{len(memory)} REA windows, {len(calls)} calls, {len(operands)} operands, {len(layout)} formation rows')


if __name__ == '__main__':
    main()
