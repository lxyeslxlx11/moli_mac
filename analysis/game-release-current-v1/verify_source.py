#!/usr/bin/env python3
"""Verify selected ordinary archive members and source-bound REA metadata.

Reads only the prescribed private local artifacts. Does not run the installer,
game, debugger or network. Output contains hashes and offsets, never PE bodies.
"""
from pathlib import Path
from collections import Counter
import hashlib
import json
import struct
import zlib

ROOT = Path(__file__).resolve().parents[2]
PRIVATE = ROOT / 'build/analysis/game-release-current-v1'
PUBLIC = Path(__file__).resolve().parent


def info(name):
    path = ROOT / name
    raw = path.read_bytes()
    return {'path': str(path.relative_to(ROOT)), 'bytes': len(raw), 'sha256': hashlib.sha256(raw).hexdigest()}


def member(block, expected_size, expected_crc):
    if len(block) < 5 or expected_size <= 0 or expected_size > 4 * 1024 * 1024:
        raise ValueError('Member size outside selected profile')
    decoder = zlib.decompressobj(-15)
    raw = decoder.decompress(block[:-4], expected_size + 1)
    if len(raw) != expected_size or not decoder.eof or decoder.unused_data or decoder.unconsumed_tail:
        raise ValueError('Member does not have exact bounded DEFLATE input/output')
    crc = zlib.crc32(raw) & 0xffffffff
    if crc != expected_crc or crc != struct.unpack('<I', block[-4:])[0]:
        raise ValueError('Script/member CRC mismatch')
    return raw


def self_check():
    original = b'Original Wise block fixture; no game data.\0' * 5
    compressor = zlib.compressobj(level=6, wbits=-15)
    crc = zlib.crc32(original) & 0xffffffff
    compressed = compressor.compress(original) + compressor.flush()
    block = compressed + struct.pack('<I', crc)
    assert member(block, len(original), crc) == original
    cases = [(block[:-1], len(original), crc), (block, len(original) - 1, crc),
             (block, len(original) + 1, crc), (block, len(original), crc ^ 1),
             (compressed + b'\x00' + block[-4:], len(original), crc), (b'', len(original), crc)]
    for raw, size, checksum in cases:
        try:
            member(raw, size, checksum)
        except (ValueError, zlib.error, struct.error):
            continue
        raise AssertionError('Original negative member fixture accepted')
    return {'positive': 1, 'negative': len(cases), 'all_passed': True, 'original_synthetic_only': True}


def pe_mapper(raw):
    assert raw[:2] == b'MZ'
    pe = struct.unpack_from('<I', raw, 60)[0]
    assert raw[pe:pe + 4] == b'PE\0\0'
    count = struct.unpack_from('<H', raw, pe + 6)[0]
    optional_size = struct.unpack_from('<H', raw, pe + 20)[0]
    assert struct.unpack_from('<H', raw, pe + 24)[0] == 0x10b
    base = struct.unpack_from('<I', raw, pe + 24 + 28)[0]
    table = pe + 24 + optional_size
    assert 0 < count < 64 and table + count * 40 <= len(raw)
    sections = []
    for i in range(count):
        _, rva, size, offset = struct.unpack_from('<4I', raw, table + i * 40 + 8)
        assert size == 0 or offset + size <= len(raw)
        sections.append((rva, size, offset))

    def locate(address, length=1):
        rva = int(address, 16) - base
        matches = [offset + rva - start for start, size, offset in sections if start <= rva and rva + length <= start + size]
        assert len(matches) == 1, (address, length)
        return matches[0]
    return locate


def main():
    checks = self_check()
    acquired = json.loads((PUBLIC / 'legacy-acquisition.json').read_text())
    plan = acquired['range_plan']
    raw = (ROOT / acquired['range_artifact']['path']).read_bytes()
    assert info(acquired['range_artifact']['path']) == acquired['range_artifact']
    assert len(raw) == plan['range_bytes'] == 1457157
    members = []
    identities = {row['name']: row for row in acquired['members']}
    for row in plan['rows']:
        block = raw[row['archive_start'] - plan['range_start']:row['archive_end'] - plan['range_start']]
        value = member(block, row['output_bytes'], int(row['script_crc32'], 16))
        expected = identities[row['name']]
        assert value == (ROOT / expected['path']).read_bytes()
        assert hashlib.sha256(value).hexdigest() == expected['sha256']
        members.append(info(expected['path']))
    assert members[0]['sha256'] == 'ce3fd80064d647e76bfc4cf2e34e148c6fff260f7d4b507941feb9f7673126a9'
    assert members[1]['sha256'] == '37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd'
    target = (ROOT / members[1]['path']).read_bytes()
    locate = pe_mapper(target)
    bundle = json.loads((PRIVATE / 'rea-final.json').read_text())
    records = bundle['records']
    assert len(records) == 39
    operations = Counter(row['operation'] for row in records)
    instruction_checks, byte_checks, maps, functions = [], [], [], []
    for row in records:
        assert row['subject']['digest']['sha256'] == members[1]['sha256']
        assert row['provider']['id'] == 'ghidra' and row['provider']['version'] == '12.1.4'
        assert row['analysis_profile']['digest'] == '7810ea9437da59780820ec6fedb47ce47390841a95d527ddb6c3b3700fe180cb'
        value = row['normalized_result']
        if row['operation'] == 'inspect_native_instruction':
            assert value['status'] == 'decoded'
            expected = bytes.fromhex(value['bytes'])
            offset = locate(value['address'], len(expected))
            assert target[offset:offset + len(expected)] == expected
            instruction_checks.append({'id':row['evidence_id'],'address':value['address'],'offset':offset,'bytes':len(expected),
                                       'sha256':hashlib.sha256(expected).hexdigest(),'matched':True})
        elif row['operation'] == 'read_bytes':
            assert value['complete'] and value['returned_bytes'] == value['requested_bytes']
            expected = bytes.fromhex(value['bytes_hex'])
            offset = locate(value['address'], len(expected))
            assert target[offset:offset + len(expected)] == expected
            byte_checks.append({'id':row['evidence_id'],'address':value['address'],'offset':offset,'bytes':len(expected),
                                'sha256':hashlib.sha256(expected).hexdigest(),'matched':True})
        elif row['operation'] == 'address_to_file_offset':
            assert value['file_offset'] == locate(value['address'])
            maps.append({'id':row['evidence_id'],**value,'independent_match':True})
        elif row['operation'] == 'analyze_function':
            procedure = value['procedure']
            assert procedure['body']['available'] and value['facet_availability']['pseudocode']['available']
            functions.append({'id':row['evidence_id'],'address':procedure['address'],'name':procedure['name'],
                              'body':procedure['body'],'pseudocode_sha256':hashlib.sha256(value['pseudocode'].encode()).hexdigest()})
    assert len(instruction_checks) == 8 and len(byte_checks) == 4 and len(maps) == 4 and len(functions) == 8
    for row in acquired['reader'].get('source_files', []):
        assert info(row['path'])['sha256'] == row['sha256']
    result = {'schema':'moli.legacy-source-check-stage151.v1','members':members,'ordinary_member_checks':checks,
              'target':members[1],'profile':'legacy-se6000-37c4-2007','current_profile_equivalence':'unverified',
              'REA':{'version':'6.7.0','Ghidra':'12.1.4','records':39,'operations':dict(operations),
                     'analysis_profile':'7810ea9437da59780820ec6fedb47ce47390841a95d527ddb6c3b3700fe180cb',
                     'functions':functions,'instruction_checks':instruction_checks,'byte_checks':byte_checks,'maps':maps,
                     'bundle':info('build/analysis/game-release-current-v1/rea-final.json'),
                     'snapshot':info('build/analysis/game-release-current-v1/rea-snapshot.json'),'session_closed':True},
              'source_artifacts':[info('analysis/game-release-current-v1/legacy-acquisition.json'),
                                  info('analysis/game-release-current-v1/release-observation.json')],
              'qualification':json.loads((PRIVATE/'rewise-qualification.json').read_text()),
              'limits':['Full installer carrier incomplete; each selected member is complete and independently hashed',
                        'No current-version or official-server equivalence established','No target/game/VM/WER/CDB/native-IDE execution',
                        'Only listed static function contracts; business frame/state/movement/battle still incomplete'],
              'target_execution':False,'product_sources_changed':False,'goal_status':'active','full_goal_complete':False}
    (PUBLIC / 'source-check.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n')
    print(json.dumps({'member_checks':checks,'members_verified':2,'REA_records':39,'functions':8,'instructions_matched':8,
                      'byte_reads_matched':4,'source_maps_matched':4,'source_immutable':True}))


if __name__ == '__main__':
    main()
