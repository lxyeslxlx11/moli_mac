#!/usr/bin/env python3
"""Verify retained REA function bytes against the fixed original file, without execution."""
from pathlib import Path
from hashlib import sha256
import json
import struct

ROOT = Path(__file__).resolve().parents[2]
A = ROOT / 'analysis/game-craft-recipes-v1'
P = ROOT / 'build/analysis/game-craft-recipes-v1'
DIGEST = '37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd'
PROFILE = '7810ea9437da59780820ec6fedb47ce47390841a95d527ddb6c3b3700fe180cb'


def read(path):
    return json.loads(path.read_text(encoding='utf-8'))


def identity(path):
    h = sha256()
    with path.open('rb') as file:
        for block in iter(lambda: file.read(1048576), b''):
            h.update(block)
    return dict(path=str(path.relative_to(ROOT)), bytes=path.stat().st_size, sha256=h.hexdigest())


def verify():
    prior = read(A / 'source-check.json')
    sample = ROOT / prior['source']['path']
    source = identity(sample)
    assert source == prior['source'] and source['sha256'] == DIGEST
    data = sample.read_bytes()
    pe = struct.unpack_from('<I', data, 60)[0]
    base = struct.unpack_from('<I', data, pe + 52)[0]
    table = pe + 24 + struct.unpack_from('<H', data, pe + 20)[0]
    sections = [struct.unpack_from('<4I', data, table + i * 40 + 8)
                for i in range(struct.unpack_from('<H', data, pe + 6)[0])]
    functions = []
    for family, count in [('dossier', 4), ('helper', 6)]:
        for index in range(count):
            dossier = read(P / f'craft-{family}-{index}.json')
            raw_record = read(P / f'craft-bytes-{family}-{index}.json')
            for observation in [dossier, raw_record]:
                assert observation['subject']['digest']['sha256'] == DIGEST
                assert observation['analysis_profile']['digest'] == PROFILE
            body = dossier['normalized_result']['procedure']['body']
            assert body['available'] and len(body['ranges']) == 1
            start = int(body['ranges'][0]['start'], 16)
            length = body['total_bytes']
            value = raw_record['normalized_result']
            raw = bytes.fromhex(value['bytes_hex'])
            assert len(raw) == length and value['complete'] and value['address'] == hex(start)
            at = next(raw_at + start - base - va for _, va, raw_size, raw_at in sections
                      if 0 <= start - base - va <= raw_size - length)
            assert data[at:at + length] == raw
            functions.append(dict(address=hex(start), bytes=length, file_offset=at,
                                  sha256=sha256(raw).hexdigest(), function_evidence=dossier['evidence_id'],
                                  byte_evidence=raw_record['evidence_id']))
    assert len(functions) == 10 and sum(row['bytes'] for row in functions) == 1939
    layout = prior['layout']
    assert 0x698 + 56 * 0x134 == 0x49f8 and 0x49f8 + 4 == 0x49fc
    assert 0x6c + 5 * 0x28 == 0x134 and 7 + 5 * 3 == 22
    assert layout['recipe_count'] == 56 and layout['material_count'] == 5
    assert prior['catalog'] == identity(ROOT / prior['catalog']['path'])
    containing = read(P / 'craft-recipe-presence.json')
    assert not containing['normalized_result']['found']
    closure = read(P / 'rea-closure.json')
    assert not closure['open'] and not closure['cleanup_pending']
    snapshot, evidence = identity(P / 'rea.snapshot.json'), identity(P / 'rea-evidence.json')
    assert snapshot['bytes'] == closure['close']['bytes']
    assert evidence['bytes'] == closure['export']['bytes']
    assert closure['close']['evidence_records'] == closure['export']['records'] == 1153
    result = dict(prior, functions=functions, function_bytes=1939, REA_closed=True,
                  snapshot=snapshot, evidence=evidence, session_closure=identity(P / 'rea-closure.json'),
                  retained_records=1153, ancestor_retained_records=1121,
                  limitations=['Only context0 is ported;normal manufacturing UI/material assignment/submission/results remain pending.',
                               '47176f has no canonical containing procedure;its recipe-presence semantics are not invented.',
                               'Original runtime,actual platform,current and official acceptance remain unverified.'])
    (A / 'source-check.json').write_text(json.dumps(result, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    return dict(stage=302, functions=10, bytes=1939, records=1153, REA_closed=True)


if __name__ == '__main__':
    print(json.dumps(verify()))
