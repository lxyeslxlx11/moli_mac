#!/usr/bin/env python3
"""Original synthetic launcher plaintext reply vectors, independently packed by Python struct."""
import argparse
import json
import struct


def count(value, form):
    if form == 'short':
        return bytes([value])
    if form == 'fd':
        return b'\xfd' + struct.pack('>I', value)
    return b'\xfe' + struct.pack('>II', 0, value)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('output')
    args = parser.parse_args()
    vectors = []
    word = lambda value: struct.pack('>I', value)
    body = b'\x02' + word(0x01020304) + word(0xffffffff)
    vectors.append({'name': 'reply2-boundary', 'type': 2, 'bodyHex': body.hex(),
                    'frameHex': (struct.pack('>H', len(body)) + body).hex(),
                    'expected': {'type': 2, 'wordA': 0x01020304, 'wordB': 0xffffffff}})
    normal = {'wordA': 7, 'wordB': 0, 'byteField': b'\0\xfd\xfe\xff', 'byteList': [b'one', b'', b'\0\xff'],
              'wordLists': [[0x01020304], [], [0xffffffff, 0x80000000], [11], [3, 4]],
              'tailWordA': 0x80000020, 'tailWordB': 0x01020304}
    empty = {'wordA': 0, 'wordB': 0, 'byteField': b'', 'byteList': [], 'wordLists': [[] for _ in range(5)],
             'tailWordA': 0x80000000, 'tailWordB': 0xffffffff}
    maximum = {'wordA': 0xffffffff, 'wordB': 0, 'byteField': bytes(range(32)),
               'byteList': [bytes((index + byte) % 256 for byte in range(41)) for index in range(64)],
               'wordLists': [[(0x80000000 + group * 256 + index) for index in range(64)] for group in range(5)],
               'tailWordA': 0, 'tailWordB': 0xffffffff}
    error = {**empty, 'wordA': 3, 'wordB': 0xffffffe0}
    for name, source, form in [('empty', empty, 'short'), ('normal', normal, 'short'), ('error', error, 'short'),
                               ('extended-fd', normal, 'fd'), ('maximum', maximum, 'short'), ('maximum-fe', maximum, 'fe')]:
        field = lambda value: count(len(value), form) + value
        body = b'\x0b' + word(source['wordA']) + word(source['wordB']) + field(source['byteField'])
        body += count(len(source['byteList']), form) + b''.join(field(value) for value in source['byteList'])
        for values in source['wordLists']:
            body += count(len(values), form) + b''.join(word(value) for value in values)
        body += word(source['tailWordA']) + word(source['tailWordB'])
        expected = {'type': 11, 'wordA': source['wordA'], 'wordB': source['wordB'],
                    'signedWordB': source['wordB'] - 2**32 if source['wordB'] > 0x7fffffff else source['wordB'],
                    'byteFieldHex': source['byteField'].hex(), 'byteListHex': [value.hex() for value in source['byteList']],
                    'wordLists': source['wordLists'], 'tailWordA': source['tailWordA'], 'tailWordB': source['tailWordB']}
        vectors.append({'name': 'reply11-' + name, 'type': 11, 'countForm': form, 'bodyBytes': len(body),
                        'bodyHex': body.hex(), 'frameHex': (struct.pack('>H', len(body)) + body).hex(), 'expected': expected})
    result = {'schema': 'moli.launcher-v7.original-reply-vectors.v1',
              'source': 'Original bytes only. Python struct BE packing and explicit REA-derived count layouts; no original executable, account, network or captured message.',
              'vectors': vectors}
    with open(args.output, 'x', encoding='utf-8') as output:
        json.dump(result, output, ensure_ascii=False, indent=2)
        output.write('\n')
    print(json.dumps({'vectors': len(vectors), 'maximumBodyBytes': max(len(bytes.fromhex(v['bodyHex'])) for v in vectors)}))


if __name__ == '__main__':
    main()
