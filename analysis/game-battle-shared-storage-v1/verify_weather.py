#!/usr/bin/env python3
"""Verify the SKL401 queue, rain update, palette and depth submission evidence."""
import json
import struct
import sys

sys.dont_write_bytecode = True
from verify_formation import records, sha
from verify_source import A, P, R, info, read, same

PRIVATE = P / 'weather'
WINDOWS = {
    'producer_dispatch': (0x4339f4, 16),
    'producer': (0x430cac, 737),
    'wait_indices': (0x433872, 8),
    'wait_entry': (0x4337d8, 4),
    'body_dispatch': (0x41976c, 128),
    'action206': (0x414616, 152),
    'action207_prefix': (0x4146ae, 111),
    'action211': (0x414966, 326),
    'overlay_group1': (0x533ab4, 64),
    'wind_initial': (0x53d990, 4),
    'pool_init': (0x4651d0, 157),
    'normal_spawn_and_step': (0x465410, 473),
    'weather_driver': (0x4653d0, 52),
    'battle_driver_call': (0x438550, 56),
    'ordinary_return_context': (0x501da0, 94),
    'draw_insertion': (0x5059f0, 512),
    'draw_consumer': (0x5067e0, 32),
    'rgba_shape': (0x44c140, 92),
    'palette_writer': (0x44a279, 96),
}
HELPERS = (
    0x41a240, 0x41b4a0, 0x41dc00, 0x422120, 0x437b30, 0x449cf0, 0x44c0d0, 0x44ce10,
    0x461660, 0x4651d0, 0x465270, 0x4652c0, 0x465310, 0x4653b0, 0x4653d0,
    0x4653f0, 0x465410, 0x465ae0, 0x501a50, 0x5059f0, 0x506030,
)


def main():
    prior = read(A / 'pursuit-source-check.json')
    for key in ('source', 'snapshot'):
        same(prior[key])
    sample = (R / prior['source']['path']).read_bytes()
    pe = struct.unpack_from('<I', sample, 60)[0]
    base = struct.unpack_from('<I', sample, pe+52)[0]
    table = pe+24+struct.unpack_from('<H', sample, pe+20)[0]
    count = struct.unpack_from('<H', sample, pe+6)[0]
    sections = [struct.unpack_from('<4I', sample, table+i*40+8) for i in range(count)]

    def original(address, length):
        for _, va, size, offset in sections:
            relative = address-base-va
            if 0 <= relative <= size-length:
                return sample[offset+relative:offset+relative+length]
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
    assert len(before) == 528 and len(after) == closure['close']['evidence_records'] == 586
    assert closure['open'] is False and closure['cleanup_pending'] is False
    assert snapshot.stat().st_size == closure['close']['bytes']
    raw = {}
    for label, (address, size) in WINDOWS.items():
        row = admit(next(r for r in after.values() if r['operation'] == 'read_bytes'
                         and r['normalized_result']['address'] == hex(address)
                         and r['normalized_result']['returned_bytes'] == size))
        result = row['normalized_result']
        payload = bytes.fromhex(result['bytes_hex'])
        assert result['complete'] and len(payload) == size and payload == original(address, size)
        raw[label] = dict(address=hex(address), bytes=size, sha256=sha(payload), evidence_id=row['evidence_id'])
    word = lambda address: struct.unpack('<I', original(address, 4))[0]
    assert word(0x4339f8) == 0x430cac
    assert original(0x433873, 1) == b'\x02' and word(0x4337d8) == 0x427a0c
    assert [word(0x419434+4*i) for i in (206,207,211)] == [0x414616,0x4146ae,0x414966]
    assert word(0x53d990) == 0xffff
    assert struct.unpack('<16I', original(0x533ab4,64)) == tuple(0x70d9+i//2 for i in range(16))
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
    pool = dossiers[0x4651d0]['pseudocode']
    assert 'DAT_00bff378' in pool and 'puVar2 + 0x44' in pool and '0xc07804' in pool
    assert (0xc07804-0xbff378)//0x44+1 == 500
    spawn = dossiers[0x465410]['pseudocode']
    assert 'local_4 * 4 + -8' in spawn and '% 0x348 + -200' in spawn and '+ 2' in spawn
    assert 'piVar5[3] = 9' in spawn and 'FUN_00465310' in spawn
    assert '0x27f < *piVar5' in spawn and '0x1df < *piVar2' in spawn
    assert 'DAT_0053d990' in dossiers[0x461660]['pseudocode']
    insert = dossiers[0x5059f0]['pseudocode']
    assert '= 0x14;' in insert and '(&DAT_00f631fc)[iVar1 * 0x28] = 9;' in insert
    rgb = dossiers[0x44c0d0]['pseudocode']
    assert 'iVar10 < 0x27c' in rgb and 'iVar8 < 0x1d4' in rgb
    assert '*puVar9 = DAT_00612104' in rgb and 'puVar9[iVar5 * 3 + 1] = DAT_00612104' in rgb
    assert 0x612104-0x611ec8 == 4*0x8f
    palette = dossiers[0x449cf0]['pseudocode']
    assert 'DAT_00611ec8 + iVar6' in palette and 'DAT_00612e18' in palette
    assert 'FUN_004653f0(0xa0)' in dossiers[0x437b30]['pseudocode']
    assert 'FUN_0040a090' in dossiers[0x422120]['pseudocode']

    main_ref = prior['producer']['retained_main']
    same(main_ref)
    main_body = next(e for e in read(R/main_ref['path'])['entries'] if e['requestedEntry']=='004260b0')
    instructions = [r for r in main_body['instructions'] if 0x430cac <= int(r['address'],16) < 0x430f8d]
    cursor = 0x430cac
    for row in instructions:
        data = bytes.fromhex(row['bytesHex'])
        assert int(row['address'],16) == cursor and data == original(cursor,len(data))
        cursor += len(data)
    assert cursor == 0x430f8d and len(instructions) == 183
    asm = {r['address']:r['text'] for r in instructions}
    for address,op in [('00430d90','ADD ECX,0x1ae01'),('00430e4f','TEST ESI,EAX'),
                       ('00430e8b','PUSH 0x17'),('00430e8f','PUSH 0x1e'),
                       ('00430e98','PUSH 0x1adfa'),('00430ef4','PUSH 0x3'),
                       ('00430f5b','PUSH 0x0')]:
        assert asm[address] == op

    body_ref = prior['callbacks']['retained_body']
    same(body_ref)
    body = read(R/body_ref['path'])['0x40a120']['assembly']
    calls = {}
    for address,target in [(0x41469b,0x434b60),(0x4146a1,0x434a30),(0x4146bf,0x41b4a0),
                           (0x414733,0x434b60),(0x414739,0x434a30),(0x4149e0,0x41a240),
                           (0x414a9f,0x41f520),(0x438564,0x4653d0),(0x5067e9,0x4653b0)]:
        op,rel = struct.unpack('<Bi',original(address,5))
        assert op == 0xe8 and address+5+rel == target
        if address<0x438000:
            assert f'{address:#x}: CALL 0x{target:08x}' in body
        calls[hex(address)] = hex(target)
    result = dict(
        schema='moli.stage221.skill401-weather-source.v1',source=prior['source'],tool=prior['tool'],
        analysis_profile=prior['analysis_profile'],snapshot=info(snapshot),session_closure=info(PRIVATE/'rea-closure.json'),
        closed=True,retained_records=len(after),new_retained_records=len(after)-len(before),
        finite_evidence_total=prior['finite_evidence_total']+len(after)-len(before),raw_windows=raw,helpers=helpers,
        producer=dict(receipt=main_ref,start='0x430cac',end_exclusive='0x430f8d',instructions=183,bytes=737),
        callbacks=dict(retained_body=body_ref,verified_calls=calls),
        rain=dict(capacity=500,mode_three_spawns_per_pass=4,stop_x=640,stop_y=480,
                  shape_clip_x_exclusive=636,shape_clip_y_exclusive=468,palette_index=143,priority=20,
                  pixel_offsets=[[0,0],[0,1],[1,2],[1,3]],active_exit_steps=160),
        original_execution=0,phase_complete=False,
    )
    (A/'weather-source-check.json').write_text(json.dumps(result,indent=2)+'\n')
    print(json.dumps({k:result[k] for k in ('retained_records','new_retained_records','finite_evidence_total','closed')}))


if __name__ == '__main__':
    main()
