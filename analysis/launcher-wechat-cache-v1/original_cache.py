"""Independent original cache framing oracle. No vendor content, network, account or execution."""
import argparse
import hashlib
import json
import struct
import sys
import xml.etree.ElementTree as ET

MAXIMUM = 2 ** 20
MAGIC = b'MOLICAT1'


def encode(revision, game, region, encoding, amp):
    assert 1 <= revision <= 2 ** 53 - 2
    assert 1 <= len(game) <= MAXIMUM and 1 <= len(region) <= MAXIMUM
    header = struct.pack('<8sQBBHII', MAGIC, revision, {'utf-8': 0, 'gb18030': 1}[encoding], int(amp), 0, len(game), len(region))
    body = game + region
    return header + hashlib.md5(header + body).digest() + body


def decode(record):
    assert 46 <= len(record) <= 2 * MAXIMUM + 44
    magic, revision, encoding, amp, reserved, game_length, region_length = struct.unpack('<8sQBBHII', record[:28])
    assert magic == MAGIC and 1 <= revision <= 2 ** 53 - 2 and encoding in (0, 1) and amp in (0, 1) and reserved == 0
    assert 1 <= game_length <= MAXIMUM and 1 <= region_length <= MAXIMUM
    assert len(record) == 44 + game_length + region_length
    assert record[28:44] == hashlib.md5(record[:28] + record[44:]).digest()
    game, region = record[44:44+game_length], record[44+game_length:]
    codec = ('utf-8', 'gb18030')[encoding]
    texts = [part.decode(codec, errors='strict') for part in (game, region)]
    for text in texts:
        ET.fromstring(text)
    return {'revision': revision, 'encoding': codec, 'allowBareAmpersands': bool(amp),
        'gameListHex': game.hex(), 'regionListHex': region.hex(),
        'gameListMd5': hashlib.md5(game).hexdigest(), 'regionListMd5': hashlib.md5(region).hexdigest()}


def vectors():
    result = []
    for name, revision, encoding, amp, label in [('utf8-first', 1, 'utf-8', False, '原创目录'),
            ('gb18030-upper-word', 2 ** 32 + 1, 'gb18030', True, '\U00010000'),
            ('utf8-max-revision', 2 ** 53 - 2, 'utf-8', False, 'Original')]:
        game = f'<Gamelist><Games><Game Code="11"><Name>{label}</Name><EXE>original.exe</EXE><Regions><Region>R</Region></Regions></Game></Games></Gamelist>'.encode(encoding)
        region = b'<Regionlist><Regions><Region Code="1"><Name>R</Name><BList><BIP Port="12345">fixture.invalid</BIP></BList><Arglist><Args Gamecode="11"> original </Args></Arglist></Region></Regions></Regionlist>'
        record = encode(revision, game, region, encoding, amp)
        result.append({'name': name, **decode(record), 'recordHex': record.hex()})
    return {'schema': 'moli.original-cache-vectors.v1', 'origin': 'Original Python struct/hashlib/XML framing oracle; no vendor material.', 'cases': result}


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--decode', action='store_true')
    args = parser.parse_args()
    if args.decode:
        raw = sys.stdin.buffer.read(4 * MAXIMUM + 2048)
        if len(raw) > 4 * MAXIMUM + 1024:
            raise ValueError('Input budget exceeded')
        value = json.loads(raw)
        result = decode(bytes.fromhex(value['recordHex']))
    else:
        result = vectors()
    print(json.dumps(result, ensure_ascii=False, indent=2))
