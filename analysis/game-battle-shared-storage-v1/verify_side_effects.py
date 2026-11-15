#!/usr/bin/env python3
"""Bind CHT, BST, and the exit/time ownership to the fixed PE and REA observations."""
import json
import struct
import sys

sys.dont_write_bytecode = True
from verify_formation import records, sha
from verify_source import A, P, R, info, read, same

PRIVATE = P / 'side-effects'
WINDOWS = {
    'token_table': (0x533e54, 96), 'command_table': (0x433650, 96),
    'chat_token': (0x534098, 4), 'time_token': (0x534080, 4),
    'normal_chat': (0x428a7f, 290), 'normal_time': (0x432d0e, 254),
    'active_abort': (0x426129, 548), 'global_abort': (0x436cf0, 363),
    'body_161': (0x4134d0, 81), 'sound_default': (0x534650, 4),
    'glyph_format': (0x533c44, 16), 'glyph_empty_prefix': (0x5849c8, 1),
    'glyph_spacing': (0x53893c, 4), 'glyph_width': (0x53890c, 4),
    'glyph_acceleration': (0x52d518, 8), 'clock_receive': (0x4f2ae0, 75),
    'clock_pass': (0x451be0, 118), 'clock_main10_selection': (0x437f9e, 65),
    'clock_main10_motion': (0x43805d, 55),
}
HELPERS = (
    0x41fd90, 0x420130, 0x420170, 0x421210, 0x423660, 0x434770,
    0x436cf0, 0x437b30, 0x444f20, 0x445130, 0x451ba0, 0x451be0, 0x4678b0, 0x4f2ae0,
)


def main():
    prior = read(A / 'weather-source-check.json')
    for key in ('source', 'snapshot'):
        same(prior[key])
    sample = (R / prior['source']['path']).read_bytes()
    pe = struct.unpack_from('<I', sample, 60)[0]
    base = struct.unpack_from('<I', sample, pe + 52)[0]
    table = pe + 24 + struct.unpack_from('<H', sample, pe + 20)[0]
    count = struct.unpack_from('<H', sample, pe + 6)[0]
    sections = [struct.unpack_from('<4I', sample, table + i * 40 + 8) for i in range(count)]

    def original(address, length, virtual_zero=False):
        for virtual, va, size, offset in sections:
            relative = address - base - va
            if 0 <= relative <= size - length:
                return sample[offset + relative:offset + relative + length]
            if virtual_zero and size <= relative <= virtual-length:
                return bytes(length)
        raise AssertionError((hex(address), length))

    def admit(row):
        assert row['subject']['digest']['sha256'] == prior['source']['sha256']
        assert row['analysis_profile']['digest'] == prior['analysis_profile']
        return row

    snapshot = PRIVATE / 'rea.snapshot.json'
    before = set(records(R / prior['snapshot']['path']))
    after = records(snapshot)
    closure = read(PRIVATE / 'rea-closure.json')
    assert before <= after.keys()
    assert len(before) == 586 and len(after) == closure['close']['evidence_records'] == 641
    assert not closure['open'] and not closure['cleanup_pending']
    assert snapshot.stat().st_size == closure['close']['bytes']
    raw = {}
    for label, (address, size) in WINDOWS.items():
        row = admit(next(r for r in after.values() if r['operation'] == 'read_bytes'
                         and r['normalized_result']['address'] == hex(address)
                         and r['normalized_result']['returned_bytes'] == size))
        result = row['normalized_result']
        payload = bytes.fromhex(result['bytes_hex'])
        zero_fill = label == 'glyph_empty_prefix'
        assert result['complete'] and len(payload) == size and payload == original(address, size, zero_fill)
        raw[label] = dict(address=hex(address), bytes=size, sha256=sha(payload), evidence_id=row['evidence_id'])
        if zero_fill:
            raw[label]['mapping'] = 'PE virtual zero-fill'

    def word(address):
        return struct.unpack('<I', original(address, 4))[0]

    def target(address):
        code = original(address, 5)
        assert code[0] == 0xe8, hex(address)
        return address + 5 + struct.unpack('<i', code[1:])[0]

    assert [(word(0x533e54 + 4*i), word(0x433650 + 4*i)) for i in (14,20)] == [
        (0x534098,0x428a7f),(0x534080,0x432d0e),
    ]
    assert word(0x419434+4*161) == 0x4134cd
    assert original(0x4134cd,3) == bytes.fromhex('8b4d18')
    assert word(0x534650) == 1 and word(0x53893c) == 11 and word(0x53890c) == 9
    assert original(0x5849c8,1,True) == bytes(1)
    assert target(0x437fd5) == target(0x43808f) == 0x451be0
    assert target(0x438179) == target(0x4382a0) == 0x436cf0
    assert target(0x428b91) == 0x420170

    helpers, dossiers = {}, {}
    for address in HELPERS:
        row = admit(next(r for r in after.values() if r['operation'] == 'analyze_function'
                         and r['normalized_result']['procedure']['address'] == hex(address)))
        dossier = row['normalized_result']
        dossiers[address] = dossier
        body = dossier['procedure']['body']
        assert body['available'] and body['contains_entry']
        spans = []
        for span in body['ranges']:
            start,end = int(span['start'],16),int(span['end'],16)
            payload = original(start,end-start+1)
            spans.append(dict(**span,bytes=len(payload),sha256=sha(payload)))
        assert sum(span['bytes'] for span in spans) == body['total_bytes']
        helpers[hex(address)] = dict(ranges=spans,evidence_id=row['evidence_id'])
    chat = dossiers[0x444f20]['pseudocode']
    assert all(term in chat for term in ('< 0xc', '< 0xe', '0x1ff', '0x134'))
    glyph = dossiers[0x421210]['pseudocode']
    assert all(term in glyph for term in ('0x3b7c4', '0x3b859', '0x3b85a', 'DAT_0053893c', 'FUN_0041fd90'))
    clock = dossiers[0x4f2ae0]['pseudocode']
    assert all(term in clock for term in ('DAT_00924f30 == 0', 'param_2 * 1000', 'GetTickCount'))
    drain = dossiers[0x436cf0]['pseudocode']
    assert all(term in drain for term in ('DAT_00598b64', 'FUN_00434770', 'FUN_00444f20', 'DAT_00f5353c', 'iVar3 * -1000'))
    catalog = (R / 'shared/legacy-game-catalog.mjs').read_text()
    assert '"tag": "Xz@"' in catalog and '"consumer": "0x4f2ae0"' in catalog
    source = dict(
        schema='moli.37c4-battle-chat-time-source.v1',source=prior['source'],
        analysis_profile=prior['analysis_profile'],tool='REA 6.7.0 / Ghidra 12.1.4',
        snapshot=info(snapshot),session_closure=info(PRIVATE/'rea-closure.json'),closed=True,
        retained_records=len(after),new_retained_records=len(after)-len(before),
        raw_windows=raw,helpers=helpers,
        observations={
            'CHT': 'Index 14. Append 255-byte text after unescape. Channel/style upper bounds 12/14. Cue 0x4a if source flag set. Normal icon 0x573f uses fixed world offset and duration callback.',
            'BST': 'Index 20. Idle target, value cursor and action 161. Local signed seconds subtract from 0xf5353c. Glyphs use the shared 41fd90 motion callback.',
            'Xz@': 'The receive consumer takes two signed values and samples the clock. Native battle clock runs after callbacks in phases 4, 5 and 6. Main 9 requires a local body.',
            'exit': 'Active command scanners consume their own effect operands. Global scanner reads operands with a temporary cursor. Both scan raw uppercase triplets, including embedded tokens.',
        },
        residual=['Native sound option writers and audio, main9 special phases and native timer display gates.',
                  'Only safely bounded raw operands are admitted. Corrupted source state and current-release behavior remain unverified.'],
        original_execution=0,VM_actions=0,official_sessions=0,phase_complete=False,
    )
    (A/'side-effects-source-check.json').write_text(json.dumps(source,ensure_ascii=False,indent=2)+'\n')
    print(f"REA retained {len(after)} (+{len(after)-len(before)}), {len(raw)} byte windows, {len(helpers)} helpers, closed")


if __name__ == '__main__':
    main()
