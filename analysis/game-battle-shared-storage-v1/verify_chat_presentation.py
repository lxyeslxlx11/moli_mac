#!/usr/bin/env python3
"""Bind the fixed legacy chat presentation and blacklist paths to PE file bytes."""
import json
import struct
import sys

sys.dont_write_bytecode = True
from verify_formation import sha
from verify_source import A, P, R, info, read, same


def main():
    private = P / 'chat-presentation'
    prior_path = A / 'ordinary-chat-source-check.json'
    prior = read(prior_path)
    same(prior['source'])
    sample = (R / prior['source']['path']).read_bytes()
    pe = struct.unpack_from('<I', sample, 60)[0]
    base = struct.unpack_from('<I', sample, pe + 52)[0]
    table = pe + 24 + struct.unpack_from('<H', sample, pe + 20)[0]
    sections = [struct.unpack_from('<4I', sample, table + i * 40 + 8)
                for i in range(struct.unpack_from('<H', sample, pe + 6)[0])]

    def region(address, size):
        for _, va, raw_size, raw in sections:
            position = address - base - va
            if 0 <= position <= raw_size - size:
                offset = raw + position
                return offset, sample[offset:offset + size]
        raise AssertionError((hex(address), size))

    def original(address, size):
        return region(address, size)[1]

    bundle = private / 'rea-evidence-bundle.json'
    closure_path = private / 'rea-closure.json'
    closure = read(closure_path)
    records = read(bundle)['records']
    ledger = {row['evidence_id']: row for row in records}
    assert closure['open'] is False and closure['cleanup_pending'] is False and closure['package'] == '6.7.0'
    assert len(ledger) == len(records) == closure['export']['records']
    assert bundle.stat().st_size == closure['export']['bytes']
    for row in ledger.values():
        assert row['subject']['digest']['sha256'] == prior['source']['sha256']
        assert row['analysis_profile']['digest'] == prior['analysis_profile']
        assert row['analysis_profile']['provider']['version'] == '12.1.4'

    index = private / 'rea-windows.json'
    windows = []
    for address, size, evidence_id in read(index):
        row = ledger[evidence_id]
        observed = row['normalized_result']
        assert row['operation'] == 'read_bytes' and observed['address'] == address and observed['complete']
        assert observed['requested_bytes'] == observed['returned_bytes'] == size
        offset, data = region(int(address, 16), size)
        assert data == bytes.fromhex(observed['bytes_hex'])
        windows.append(dict(address=address, bytes=size, file_offset=offset, sha256=sha(data), evidence_id=evidence_id))

    helpers = {}
    for row in records:
        if row['operation'] != 'analyze_function':
            continue
        procedure = row['normalized_result']['procedure']
        body = procedure['body']
        assert body['available'] and body['contains_entry']
        spans = []
        for span in body['ranges']:
            first, last = int(span['start'], 16), int(span['end'], 16)
            size = last - first + 1
            offset, data = region(first, size)
            spans.append(dict(**span, bytes=size, file_offset=offset, sha256=sha(data)))
        assert sum(span['bytes'] for span in spans) == body['total_bytes']
        helpers[procedure['address']] = dict(evidence_id=row['evidence_id'], ranges=spans)
    assert {'0x4f2df0','0x4f30d0','0x402cb0','0x402b50','0x402bd0','0x402910','0x402a80',
            '0x43cfd0','0x4ffc90','0x43d150','0x445460','0x43b9d0','0x445530','0x445490','0x445610',
            '0x445670','0x4456d0','0x443f70','0x455500','0x457c30','0x4ed240'} <= helpers.keys()

    calls = (
        (0x4fa4ca,0x4f2df0),(0x4fa546,0x4f30d0),(0x4f2feb,0x402cb0),(0x4f301d,0x444f20),
        (0x4f307f,0x4ffc90),(0x4f3092,0x440250),(0x4f30af,0x43cfd0),
        (0x4ffd61,0x445460),(0x43d097,0x445460),(0x43d5ee,0x445170),(0x43d616,0x43b9d0),
        (0x43d64b,0x445170),(0x43d685,0x44f2c0),(0x43d6c3,0x44f2c0),(0x43d6fb,0x48e8d0),
        (0x444b03,0x402b50),(0x4ed9b0,0x402b50),(0x4eda54,0x402bd0),(0x45570d,0x402910),
        (0x402bbb,0x402a80),(0x402c9e,0x402a80),(0x4f3195,0x51bb40),(0x4f31af,0x444f20),
        (0x4f31c1,0x51bb40),(0x4f31d7,0x51bb40),(0x4f31fb,0x445530),(0x4455d1,0x443f20),
        (0x4454bf,0x443ab0),(0x445505,0x443ab0),(0x4440b2,0x4456d0),(0x4456f4,0x445610),
        (0x4456fe,0x44f3e0),(0x445723,0x445670),(0x44572d,0x44f3e0),
    )
    for site, target in calls:
        opcode, relative = struct.unpack('<Bi', original(site, 5))
        assert opcode == 0xe8 and site + 5 + relative == target, (hex(site), hex(target))

    anchors = {
        0x4f2e29:'3c50',0x4f2e85:'a118ff600085c00f85',0x4f2ff3:'84c00f85bc000000',
        0x4f307a:'68e8030000',0x4f30a9:'68e8030000',0x402b50:'833dc449580064',
        0x402d2a:'83c71181ffc4475800',0x43d5a2:'f7c700200000',0x43d5b4:'3945140f866e010000',
        0x43d5ca:'f7462480010000',0x43d63a:'83f928',0x445578:'b91f010000',
        0x44564d:'833d84495e0003',0x4456ad:'833d9cfd600002',0x4456e8:'83f80a760c',0x445717:'83f80a760c',
    }
    for address, expected in anchors.items():
        assert original(address, len(expected)//2) == bytes.fromhex(expected), hex(address)
    assert original(0x567d08, 8) == b'DMK\x00Cz>\x00'
    assert original(0x567918, 6) == b'[MIC]\x00' and original(0x533690, 5) == b'[GP]\x00'
    assert original(0x567920, 8) == b'[GM\x00[gm\x00'
    assert original(0x567928, 7) == '[公告]\0'.encode('gbk')
    assert original(0x567930, 11) == '[玩家公告]\0'.encode('gbk')
    assert original(0x5331b4, 23) == b'data\\blacklist_%d.txt\x00\x00'
    assert struct.unpack('<I', original(0x534354, 4)) == (1,)
    heights = struct.unpack('<40i', original(0x534224, 160))
    fonts = [struct.unpack_from('<4I', original(0x538904, 336), i * 24 + 8) for i in range(14)]
    assert (heights[0], heights[6], heights[-1], fonts[3]) == (-78,-99,-88,(9,17,17,17))

    report = dict(source=prior['source'], analysis_profile=prior['analysis_profile'], rea='6.7.0', ghidra='12.1.4',
        previous_observation=info(prior_path), evidence_bundle=info(bundle), session_closure=info(closure_path),
        windows_index=info(index), retained_records=len(ledger), closed=True, raw_windows=windows, helpers=helpers,
        call_checks=len(calls), instruction_checks=len(anchors),
        blacklist=dict(capacity=100, entry_bytes=17, comparison='exact bytes after known channel prefix',
                       per_server_path='data\\blacklist_%d.txt'),
        speech=dict(duration_ms=1000, first_line_bytes=40, glyph_height_source='0x538918',
                    body_mask='0x180', display_icon='0x573f', display_box='0x3be84', heights=heights, metrics=fonts),
        announcements=dict(source_text_bytes=287, origin_x=640, strict_interval_ms=10,
                           lanes=[dict(y=60, color=4, passes=4), dict(y=76, color=5, passes=3)]),
        VM_actions=0, original_execution=0, official_sessions=0)
    with (A / 'chat-presentation-source-check.json').open('x') as output:
        output.write(json.dumps(report, indent=2, ensure_ascii=False) + '\n')
    print(len(ledger), len(windows), len(helpers), len(calls), len(anchors))


if __name__ == '__main__':
    main()
