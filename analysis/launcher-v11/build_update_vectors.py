#!/usr/bin/env python3
"""Original ZIP fixtures built with struct/raw zlib, independently read with zipfile."""
from pathlib import Path
import binascii
import hashlib
import io
import json
import struct
import zipfile
import zlib


def archive(definitions, prefix=b'', comment=b'', order=None, extra=b''):
    local = bytearray()
    entries = []
    for name, payload, method, descriptor, strategy in definitions:
        flags = (8 if descriptor else 0) | (0x800 if any(byte > 127 for byte in name) else 0)
        compressor = zlib.compressobj(0 if strategy == 'stored-block' else 6, zlib.DEFLATED, -15,
                                     strategy=zlib.Z_FIXED if strategy == 'fixed' else zlib.Z_DEFAULT_STRATEGY)
        packed = payload if method == 0 else compressor.compress(payload) + compressor.flush()
        crc = binascii.crc32(payload) & 0xffffffff
        fields = (0, 0, 0) if descriptor else (crc, len(packed), len(payload))
        offset = len(local)
        local += struct.pack('<IHHHHHIIIHH', 0x04034b50, 20, flags, method, 0, 0, *fields, len(name), len(extra)) + name + extra + packed
        if descriptor:
            if descriptor == 'signed':
                local += struct.pack('<I', 0x08074b50)
            local += struct.pack('<III', crc, len(packed), len(payload))
        entries.append({'name': name, 'payload': payload, 'method': method, 'flags': flags, 'packed': packed, 'crc': crc, 'offset': offset})
    order = list(range(len(entries))) if order is None else order
    directory = bytearray()
    for index in order:
        row = entries[index]
        directory += struct.pack('<IHHHHHHIIIHHHHHII', 0x02014b50, 20, 20, row['flags'], row['method'], 0, 0,
                                 row['crc'], len(row['packed']), len(row['payload']), len(row['name']), len(extra), 0, 0, 0, 0, row['offset']) + row['name'] + extra
    end = struct.pack('<IHHHHIIH', 0x06054b50, 0, 0, len(entries), len(entries), len(directory), len(local), len(comment))
    result = prefix + local + directory + end + comment
    with zipfile.ZipFile(io.BytesIO(result)) as independent:
        infos = independent.infolist()
        assert len(infos) == len(entries)
        for ordinal, index in enumerate(order):
            assert independent.read(infos[ordinal]) == entries[index]['payload']
    selected = entries[order[0]]
    return result, {'entry_count': len(entries), 'prefix_bytes': len(prefix), 'name_hex': selected['name'].hex(),
                    'method': selected['method'], 'flags': selected['flags'], 'crc32': selected['crc'],
                    'output_bytes': len(selected['payload']), 'md5': hashlib.md5(selected['payload']).hexdigest(),
                    'sha256': hashlib.sha256(selected['payload']).hexdigest(),
                    'deflate_block_type': None if selected['method'] == 0 else (selected['packed'][0] >> 1) & 3}


def main():
    cases = []
    data = (b'Original cross-platform updater fixture. All content is public synthetic data. ' * 400)
    definitions = [
        ('stored-empty', [(b'first.bin', b'', 0, None, None)], {}),
        ('stored-bytes', [(b'first.bin', bytes(range(256)), 0, None, None)], {}),
        ('deflate-empty', [(b'first.bin', b'', 8, None, None)], {}),
        ('deflate-fixed', [(b'first.bin', b'Original fixed fixture' * 80, 8, None, 'fixed')], {}),
        ('deflate-dynamic', [(b'first.bin', data, 8, None, None)], {}),
        ('deflate-stored-block', [(b'first.bin', bytes(range(128)) * 3, 8, None, 'stored-block')], {}),
        ('descriptor-signed', [(b'first.bin', data[:1800], 8, 'signed', None)], {}),
        ('descriptor-unsigned', [(b'first.bin', data[:1800], 8, 'unsigned', None)], {}),
        ('utf8-name', [('原创.bin'.encode(), data[:99], 8, None, None)], {}),
        ('extra-comment', [(b'first.bin', b'Extra original data', 8, None, None)], {'extra': struct.pack('<HHI', 0xcafe, 4, 0x12345678), 'comment': b'Original archive comment'}),
        ('prefixed', [(b'first.bin', data[:509], 8, None, None)], {'prefix': b'Original prefix bytes. Not an executable.\n'}),
        ('reordered-central', [(b'local-first.bin', b'Original local-first data', 8, None, None), (b'central-first.bin', b'Original central-first data', 0, None, None)], {'order': [1, 0]}),
        ('multiple-entries', [(b'first.bin', b'Original first selection', 8, 'signed', None), (b'second.bin', b'Other original data', 8, None, None)], {}),
        ('crc-marker-unsigned', [(b'first.bin', bytes.fromhex('ac0a7ad5'), 0, 'unsigned', None)], {}),
        ('crc-marker-signed', [(b'first.bin', bytes.fromhex('ac0a7ad5'), 0, 'signed', None)], {}),
    ]
    for name, members, options in definitions:
        packed, expected = archive(members, **options)
        cases.append({'name': name, 'archive_hex': packed.hex(), 'expected': expected})
    assert cases[4]['expected']['deflate_block_type'] == 2
    assert cases[5]['expected']['deflate_block_type'] == 0
    assert cases[3]['expected']['deflate_block_type'] == 1
    assert cases[13]['expected']['crc32'] == cases[14]['expected']['crc32'] == 0x08074b50
    result = {'schema': 'moli.launcher-v11.original-update-vectors.v1',
              'identity': 'Original public fixtures only. No official executables/resources, credentials or real update requests.',
              'oracle': 'Python struct/raw zlib/binascii/hashlib, each archive independently read with zipfile.', 'cases': cases}
    Path(__file__).with_name('original-update-vectors.json').write_text(json.dumps(result, indent=2) + '\n')


if __name__ == '__main__':
    main()
