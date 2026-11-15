#!/usr/bin/env python3
"""Hash-bound static metadata and independent XML/struct oracles. Explicit files only; no target execution."""
import argparse
import datetime
import hashlib
import json
import os
from pathlib import Path
import re
import stat
import struct

IDENTITIES = {
    'sample': '601b79565e4ac4c71605744a5087bb24582dde164f417514c74190cd4cdc6e31',
    'games': 'be8f1213d77bd294fbb79b2fb51a5e7fecdc9aa3c0854db7a6d821fad20ef85a',
    'regions': '0c94ca78c40c1940f241940a97aabef7849e9ad3285310046f346b69128a8438',
}


def read_regular(path, limit):
    fd = os.open(path, os.O_RDONLY | os.O_NOFOLLOW | os.O_NONBLOCK)
    with os.fdopen(fd, 'rb') as stream:
        before = os.fstat(stream.fileno())
        if not stat.S_ISREG(before.st_mode) or not 0 < before.st_size <= limit:
            raise ValueError('Expected a bounded nonempty regular file')
        value = stream.read(before.st_size + 1)
        after = os.fstat(stream.fileno())
        if len(value) != before.st_size or (before.st_ino, before.st_size, before.st_mtime_ns) != (after.st_ino, after.st_size, after.st_mtime_ns):
            raise ValueError('Input changed or short read')
        return value


def digest(value):
    if isinstance(value, str):
        value = value.encode('utf-8')
    return hashlib.sha256(value).hexdigest()


def leaf(node, name):
    child = node.find(name)
    return child.text or '' if child is not None else ''


def endpoint(node, address, port):
    return {'addressSha256': digest(address), 'port': int(port), 'portText': port}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    for name in ('sample', 'games', 'regions', 'rea_bundle', 'output_dir'):
        parser.add_argument(name)
    args = parser.parse_args()
    output = Path(args.output_dir)
    targets = [output / name for name in ('static-spec.json', 'configuration-oracle.json', 'request10-vectors.json')]
    if not output.is_dir() or any(path.exists() for path in targets):
        raise ValueError('Use an existing output directory without prior oracle files')
    inputs = {}
    for name in ('sample', 'games', 'regions'):
        value = read_regular(getattr(args, name), 2 * 1024 * 1024)
        if digest(value) != IDENTITIES[name]:
            raise ValueError('Fixed sample identity mismatch')
        inputs[name] = value
    bundle_bytes = read_regular(args.rea_bundle, 64 * 1024 * 1024)
    bundle = json.loads(bundle_bytes)
    records = {}
    for row in bundle['records']:
        if row.get('operation') == 'analyze_function' and row['subject']['digest']['sha256'] == IDENTITIES['sample']:
            records[row['normalized_result']['procedure']['address']] = row
    required = ['0x4015a0', '0x405da0', '0x409680', '0x40a2c0', '0x40aab0', '0x410df0',
                '0x419f90', '0x419fe0', '0x416160', '0x46cf30', '0x46d810', '0x479560',
                '0x4795f0', '0x479690', '0x479340', '0x47ca70', '0x47cab0', '0x4729b0', '0x4768a0']
    if any(address not in records for address in required):
        raise ValueError('Required REA function evidence is missing')
    procedures = []
    for address in required:
        row = records[address]
        if row['provider'] != {'id': 'ghidra', 'name': 'Ghidra', 'version': '12.1.4'}:
            raise ValueError('Unexpected analysis provider')
        n = row['normalized_result']
        procedures.append({'address': address, 'evidence_id': row['evidence_id'],
                           'pseudocode_sha256': digest(n['pseudocode']),
                           'assembly_sha256': digest('\n'.join(n['assembly'])),
                           'assembly_lines': len(n['assembly']),
                           'call_relationship_coverage': row['relationship_coverage']})
    # Artifact coordinates are observed anchors, not proof of business semantics.
    sample = inputs['sample']
    pe = struct.unpack_from('<I', sample, 60)[0]
    count, optional = struct.unpack_from('<H', sample, pe + 6)[0], struct.unpack_from('<H', sample, pe + 20)[0]
    image_base = struct.unpack_from('<I', sample, pe + 52)[0]
    sections = [struct.unpack_from('<IIII', sample, pe + 24 + optional + i * 40 + 8) for i in range(count)]
    anchors = []
    for va in [0x402db1, 0x405f5f, 0x405f67, 0x419fa2, 0x479743, 0x47974d, 0x47ca70, 0x47cab0, 0x4729b0]:
        rva = va - image_base
        mappings = [raw + rva - start for _, start, size, raw in sections if start <= rva < start + size]
        if len(mappings) != 1:
            raise ValueError('Anchor does not have one source mapping')
        offset = mappings[0]
        anchors.append({'va': hex(va), 'file_offset': offset, 'bytes_hex': sample[offset:offset + 8].hex()})
    spec = {'schema': 'moli.launcher-v6.static-spec.v1',
            'recorded_utc': datetime.datetime.now(datetime.timezone.utc).isoformat(),
            'sample_sha256': IDENTITIES['sample'], 'tools': {'REA': '6.7.0', 'Ghidra': '12.1.4'},
            'private_bundle': {'path': 'build/analysis/launcher-v6-rea-evidence-final.json', 'sha256': digest(bundle_bytes), 'bytes': len(bundle_bytes)},
            'procedures': procedures, 'source_byte_observations': anchors,
            'facts': [
                {'kind': 'fact', 'source': '0x4015a0 / 0x405da0', 'text': 'GameList Regions/Region names are compared with RegionList names using409680->40a2c0->40aab0->__mbscmp. Selected ordinal and current Gamecode index the Args slot copied to+1b48.'},
                {'kind': 'fact', 'source': '0x4015a0', 'text': 'Region record stride1c8; bounded40 regions and10 BIP entries. PIP/PPort and BIP/Port are separate fields. Args Gamecode is numeric; original values above14 are clamped to14.'},
                {'kind': 'fact', 'source': '0x419f90 / 0x416160 / 0x410df0', 'text': 'App+ac references the client; constructor sets vtable4b5ca0; wizard case3 calls virtual+0c ->46cf30 ->46d810. Callback entry virtual+14 is419fe0. FID class names alone are not business identities.'},
                {'kind': 'fact', 'source': '0x46d810 / 0x479560 / 0x4795f0 / 0x479690 / 0x479340 / 0x47ca70', 'text': 'Supported builder writes byte10, UInt32BE, counted raw bytes, counted raw bytes, UInt32BE. Each field length<19; counts below253 use one byte. Body budget45.47974d..479753 returns the next offset even though the decompiler inferred void.'},
                {'kind': 'fact', 'source': '0x4729b0 / 0x47cab0 / 0x4768a0', 'text': 'A two-byte BE body length and then body are written to a connection queue. Queue accepts state-dependent paths; this is a pre-queue boundary, not a proven complete encrypted wire/session format.'},
            ],
            'unknowns': ['Business meanings and transformations of request words/byte fields',
                         'Connection initialization, cryptographic handshake and all server response/state rules',
                         'Current service version, authentication/updates/IPC acceptance and end-to-end compatibility'],
            'policy': ['Exact decoded Unicode region names preserve whitespace; not an all-code-page equivalence claim',
                       'Missing/duplicate names or Args slots fail explicitly; no legacy out-of-range write or slot clamping',
                       'Nonempty Galaxylist unsupported; endpoint values are metadata only',
                       'Codec accepts explicit bytes and generic positional fields; it does not encode credentials, authenticate or use a socket'],
            'scope': 'Static source and independent local implementation only; no original PE execution, VM, account, remote request or real credential data'}

    import xml.etree.ElementTree as ET
    bare = re.compile(r'&(?!amp;|lt;|gt;|quot;|apos;|#\d+;|#x[\da-fA-F]+;)')
    game_text, repairs = bare.subn('&amp;', inputs['games'].decode('gb18030'))
    game_root = ET.fromstring(game_text)
    region_root = ET.fromstring(inputs['regions'].decode('gb18030'))
    region_nodes = region_root.findall('Regions/Region')
    region_rows = []
    for ordinal, node in enumerate(region_nodes):
        pip, pport = leaf(node, 'PIP'), leaf(node, 'PPort')
        region_rows.append({'ordinal': ordinal, 'code': node.get('Code', ''), 'nameSha256': digest(leaf(node, 'Name')),
                            'billing': [endpoint(node, entry.text or '', entry.get('Port')) for entry in node.findall('BList/BIP')],
                            'patch': endpoint(node, pip, pport) if pip else None,
                            'statusAddressSha256': digest(leaf(node, 'StatusIP')),
                            'args': [{'ordinal': index, 'gameCode': entry.get('Gamecode'), 'textSha256': digest(entry.text or '')}
                                     for index, entry in enumerate(node.findall('Arglist/Args'))],
                            'closed': node.find('Closed') is not None,
                            'hasGalaxyList': bool(node.findall('Galaxylist/Galaxy'))})
    game_rows = []
    for ordinal, node in enumerate(game_root.findall('Games/Game')):
        references = [entry.text or '' for entry in node.findall('Regions/Region')]
        choices = []
        for reference_ordinal, name in enumerate(references):
            matches = [i for i, entry in enumerate(region_nodes) if leaf(entry, 'Name') == name]
            status = 'missing' if not matches else 'ambiguous' if len(matches) > 1 else 'closed' if region_rows[matches[0]]['closed'] else 'available'
            choices.append({'referenceOrdinal': reference_ordinal, 'status': status, 'matchedOrdinals': matches})
        game_rows.append({'ordinal': ordinal, 'code': node.get('Code'), 'nameSha256': digest(leaf(node, 'Name').strip()),
                          'baseArgsSha256': digest(leaf(node, 'Argsline')), 'referenceNameSha256': [digest(name) for name in references], 'choices': choices})
    configs = {'schema': 'moli.launcher-v6.configuration-oracle.v1', 'method': 'Independent Python ElementTree/hashlib; explicit fixed GB18030 files',
               'source': {name: {'bytes': len(inputs[name]), 'sha256': IDENTITIES[name]} for name in ['games', 'regions']},
               'literalAmpersands': repairs, 'games': game_rows, 'regions': region_rows}
    vectors = []
    cases = [(0, b'', b'', 0xffffffff), (0x01020304, b'AB', b'\0\xff', 0xaabbccdd),
             (0xffffffff, bytes(range(18)), bytes(range(16)), 0),
             (1, bytes(range(16)), bytes(range(18)), 14), (0x80000000, b'\xfd\xfe\n', b'\x80', 0x7fffffff)]
    for a, first, second, b in cases:
        body = struct.pack('>BI', 10, a) + struct.pack('B', len(first)) + first + struct.pack('B', len(second)) + second + struct.pack('>I', b)
        vectors.append({'wordA': a, 'fieldAHex': first.hex(), 'fieldBHex': second.hex(), 'wordB': b,
                        'bodyHex': body.hex(), 'frameHex': (struct.pack('>H', len(body)) + body).hex()})
    request_vectors = {'schema': 'moli.launcher-v6.request10-vectors.v1', 'source': 'Original synthetic data; independent Python struct big-endian packing', 'vectors': vectors}
    for path, value in zip(targets, [spec, configs, request_vectors]):
        with path.open('x', encoding='utf-8') as stream:
            json.dump(value, stream, ensure_ascii=False, indent=2)
            stream.write('\n')
    print(json.dumps({'static_functions': len(procedures), 'byte_observations': len(anchors), 'games': len(game_rows), 'regions': len(region_rows), 'synthetic_message_vectors': len(vectors), 'files': [str(p) for p in targets]}))


if __name__ == '__main__':
    main()
