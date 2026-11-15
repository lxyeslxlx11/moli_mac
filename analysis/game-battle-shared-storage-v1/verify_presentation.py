#!/usr/bin/env python3
"""Verify fixed PE and optional asset metadata for the stage221 GMN renderer."""
import hashlib
import json
from pathlib import Path
import struct
import sys

sys.dont_write_bytecode = True
from verify_source import R, A, P, env, info, read, same

PRIVATE = P / 'presentation'
PRODUCERS = P / 'producers'
WINDOWS = {
    'text-lanes': (0x5388f0, 28),
    'font-metrics': (0x53890c, 336),
    'palette-tint-table': (0x5361f4, 164),
    'window-callback-prefix': (0x4ea9b0, 96),
}


def sha(data):
    return hashlib.sha256(data).hexdigest()


def main():
    prior = read(A / 'producer-source-check.json')
    same(prior['source'])
    same(prior['snapshot'])
    binary = (R / prior['source']['path']).read_bytes()
    pe = struct.unpack_from('<I', binary, 60)[0]
    base = struct.unpack_from('<I', binary, pe + 52)[0]
    count = struct.unpack_from('<H', binary, pe + 6)[0]
    table = pe + 24 + struct.unpack_from('<H', binary, pe + 20)[0]
    sections = [struct.unpack_from('<4I', binary, table + i * 40 + 8) for i in range(count)]

    def window(address, size):
        address = int(address, 16) if isinstance(address, str) else address
        for _, va, raw_size, raw in sections:
            at = address - (base + va)
            if 0 <= at <= raw_size - size:
                return binary[raw + at:raw + at + size]
        raise AssertionError((address, size))

    def evidence(path):
        record = env(path)
        assert record['subject']['digest']['sha256'] == prior['source']['sha256']
        assert record['analysis_profile']['digest'] == prior['analysis_profile']
        return record

    def records(path):
        return {row['evidence_id'] for row in read(path)['evidence_bundle']['records']}

    current = PRIVATE / 'rea.snapshot.json'
    old_ids = records(PRODUCERS / 'rea.snapshot.json')
    new_ids = records(current)
    assert old_ids <= new_ids
    assert len(old_ids) == 437 and len(new_ids) == env(PRIVATE / 'close.json')['result']['evidence_records'] == 458
    session = env(PRIVATE / 'session-final.json')['result']
    assert not session['open'] and not session['cleanup_pending']

    checked = {}
    for name, (address, size) in WINDOWS.items():
        record = evidence(PRIVATE / f'{name}.json')
        data = record['normalized_result']
        b = bytes.fromhex(data['bytes_hex'])
        assert record['evidence_id'] in new_ids and data['complete'] and data['returned_bytes'] == len(b) == size
        assert b == window(address, size)
        checked[name] = dict(address=hex(address), bytes=size, sha256=sha(b), evidence_id=record['evidence_id'])
    priorities = struct.unpack('<7i', window(0x5388f0, 28))
    assert priorities[:3] == (210, 212, 216)
    assert struct.unpack('<6i', window(0x53890c, 24))[:4] == (9, 18, 18, 18)
    assert window(0x5361f4, 3) == b'\x80\x80\x80' and window(0x5361f4 + 3 * 13, 3) == b'```'

    functions = set(prior['canonical_dossiers'])
    producer_source = read(A / 'source-check.json')
    for cache in producer_source['canonical_cache_layers']:
        same(cache)
        functions.update(read(R / cache['path']))
    assert len(functions) == prior['canonical_total'] == 754
    canonical = {}
    for path in sorted(PRIVATE.glob('*-dossier.json')):
        if path.name == '4ea9b0-dossier.json':
            assert env(path).get('isError')
            continue
        record = evidence(path)
        assert record['evidence_id'] in new_ids
        p = record['normalized_result']['procedure']
        body = p['body']
        assert body['available'] and body['contains_entry']
        extents = []
        for extent in body['ranges']:
            size = int(extent['end'], 16) - int(extent['start'], 16) + 1
            extents.append(dict(**extent,bytes=size,sha256=sha(window(extent['start'],size))))
        assert sum(x['bytes'] for x in extents) == body['total_bytes']
        canonical[p['address']] = dict(ranges=extents, evidence_id=record['evidence_id'],
                                       newly_retained=p['address'] not in functions)

    derived = read(PRIVATE / 'derived-window.json')
    assert not derived['originalExecution'] and not derived['originalBytePatches']
    callback, = derived['entries']
    assert callback['requestedEntry'] == '004ea9b0' and callback['derivedBodyBytes'] == 720
    assert not callback['functionExistedBeforeSeed'] and callback['decompileCompleted']
    for ins in callback['instructions']:
        original = bytes.fromhex(ins['bytesHex'])
        assert original == window(ins['address'], len(original))
    constructor = evidence(PRODUCERS / '4ea7c0-dossier.json')['normalized_result']['assembly']
    assert any('0x4ea9b0' in ins for ins in constructor)

    asm = evidence(PRODUCERS / '44a430-dossier.json')['normalized_result']['assembly']
    for line in [
        '0x44a712: FST float ptr [ESI + 0x613988]',
        '0x44a744: CALL 0x0051b4a8',
        '0x44a749: FLD float ptr [ESP + 0x10]',
        '0x44a758: FLD float ptr [ESP + 0x1c]',
    ]:
        assert line in asm

    # Asset compatibility is a separate observation on retained installer material.
    material = R / 'build/analysis/diagnostic-material-20261026-_9d1ephh'
    prep = read(material / 'preparation.json')
    asset_root = material / 'source/app/bin'
    graphic_info = asset_root / 'GraphicInfoV3_18.bin'
    table_bytes = graphic_info.read_bytes()
    tile_rows = []
    with (asset_root / 'GraphicV3_18.bin').open('rb') as archive:
        for at in range(0, len(table_bytes), 40):
            resource = struct.unpack_from('<I', table_bytes, at + 36)[0]
            if not 245300 <= resource <= 245308:
                continue
            idx, offset, length, x, y, width, height = struct.unpack_from('<7i',table_bytes,at)
            archive.seek(offset)
            tile = archive.read(length)
            assert len(tile) == length and tile[:2] == b'RD'
            assert struct.unpack_from('<ii',tile,4) == (width,height)
            assert width%4 == 0
            tile_rows.append(dict(resource=resource,index=idx,record_offset=at,archive_offset=offset,bytes=length,
                                  sha256=sha(tile),origin=[x,y],dimensions=[width,height],rd_flags=tile[2]))
    assert sorted(x['resource'] for x in tile_rows) == list(range(245300,245309))
    colors = [info(asset_root / f'pal/palet_{index:02}.cgp') for index in (0,13)]
    assert all(row['bytes'] == 708 for row in colors)

    result = dict(schema='moli.gmn-presentation-source.stage221.v1',
        source=prior['source'],tool=prior['tool'],analysis_profile=prior['analysis_profile'],
        snapshot=info(current),prior_snapshot_records=len(old_ids),snapshot_records=len(new_ids),
        finite_evidence_total=prior['finite_records']+len(new_ids-old_ids),
        canonical_count=len(functions|set(canonical)),canonical_dossiers=canonical,
        closed=True,raw_windows=checked,exact_color_loop_sha256=sha(window(0x44a706,0x44a7ea-0x44a706)),
        derived_window=dict(entry='0x4ea9b0',bytes=720,instructions=len(callback['instructions']),
                            canonical=False,receipt=info(PRIVATE / 'derived-window.json')),
        asset_observation=dict(installer_sha256=prep['source_sha256'],graphic_info=info(graphic_info),
                               tiles=tile_rows,palettes=colors,same_release_as_executable_unverified=True),
        executable_runtime_observed=False,raw_game_art_in_delivery=False,phase_complete=False)
    (A / 'presentation-source-check.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n')
    print(json.dumps({k:result[k] for k in ('canonical_count','finite_evidence_total','snapshot_records','closed')}))


if __name__ == '__main__':
    main()
