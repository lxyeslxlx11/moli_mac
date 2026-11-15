#!/usr/bin/env python3
"""Original public byte fixtures and a separate Python model of observed row swaps/gates."""
from pathlib import Path
import json
import struct


def word(value):
    return struct.pack('>I', value & 0xffffffff)


def signed(value):
    return value - 0x100000000 if value > 0x7fffffff else value


def reply(names, columns, result=0, byte_field=b'', tail_a=0, tail_b=0):
    assert len(columns) == 5
    body = bytes([11]) + word(0x12345678) + word(result)
    body += bytes([len(byte_field)]) + byte_field + bytes([len(names)])
    body += b''.join(bytes([len(name)]) + name for name in names)
    body += b''.join(bytes([len(column)]) + b''.join(word(value) for value in column) for column in columns)
    return body + word(tail_a) + word(tail_b)


def expected(names, columns, result, tail_b):
    if result:
        return {'disposition': 'nonzero-result', 'remaining_points_signed': None, 'rows': []}
    if not names:
        return {'disposition': 'no-profiles', 'remaining_points_signed': None, 'rows': []}
    order = list(range(len(names)))
    for current in range(len(order)):
        for prior in range(current):
            if names[order[current]] < names[order[prior]]:
                order[current], order[prior] = order[prior], order[current]
    rows = []
    for display, source in enumerate(order):
        state = signed(columns[1][source])
        reason = ('state' if state not in (0, -4) else
                  'billing-expired' if columns[2][source] != 0 and columns[4][source] != 0 else None)
        rows.append({'source_ordinal': source, 'display_ordinal': display, 'name_hex': names[source].hex(),
                     'state': state, 'words': [column[source] & 0xffffffff for column in columns[1:]],
                     'passes': reason is None, 'blocked_reason': reason})
    return {'disposition': 'profiles', 'remaining_points_signed': signed(tail_b), 'rows': rows}


def main():
    requests = []
    for name, username, password, counter, game_code in [
        ('original-public-ASCII', b'SyntheticU1', b'SyntheticP1', 0x01020304, 11),
        ('original-byte-limit', bytes(range(65, 81)), bytes(range(129, 145)), 0xffffffff, 14),
        ('original-preserve-case-space', b' A a ', b' p P ', 0, 0),
    ]:
        body = bytes([10]) + word(counter) + bytes([len(username)]) + username + bytes([len(password)]) + password + word(game_code)
        requests.append({'name': name, 'username_hex': username.hex(), 'password_hex': password.hex(),
                         'counter': counter, 'game_code': game_code, 'body_hex': body.hex(),
                         'frame_hex': struct.pack('>H', len(body)).hex() + body.hex()})
    cases = []
    definitions = [
        ('original-paired-columns', [b'zeta', b'Alpha', b'beta', b'Beta'],
         [[99], [0, 0xffffffff, 0xfffffffc, 0, 0xdeadbeef], [0, 1, 0, 1, 88], [10, 20, 30, 40, 77], [1, 0, 1, 1, 66]], 0, bytes(range(32)), 0x80000001, 0xffffffff),
        ('original-duplicate-swaps', [b'Echo', b'Echo', b'Alpha'],
         [[], [0, 0, 0], [0, 0, 0], [101, 202, 303], [0, 0, 0]], 0, b'OriginalFixture', 0, 19),
        ('original-unsigned-byte-order', [bytes([255]), bytes([128]), b'a', b'A', b'AA'],
         [[], [0] * 5, [0] * 5, list(range(5)), [0] * 5], 0, b'', 7, 0x80000000),
        ('original-no-profiles', [], [[1, 2], [], [], [], []], 0, b'', 3, 88),
        ('original-nonzero-result-ignores-rows', [b'\x00', b''], [[], [], [], [], []], 0xffffff9c, b'', 4, 89),
        ('original-max-rows', [f'Item{index:03}'.encode() for index in range(63, -1, -1)],
         [list(range(64)), [0 if index % 3 else 0xfffffffc for index in range(64)],
          [index % 2 for index in range(64)], [1000 + index for index in range(64)], [index % 4 for index in range(64)]],
         0, bytes([170]) * 32, 0x12345678, 900),
    ]
    for name, names, columns, result, byte_field, tail_a, tail_b in definitions:
        cases.append({'name': name, 'body_hex': reply(names, columns, result, byte_field, tail_a, tail_b).hex(),
                      'expected': expected(names, columns, result, tail_b)})
    assert [x['source_ordinal'] for x in cases[1]['expected']['rows']] == [2, 1, 0]
    output = {'schema': 'moli.launcher-v8.original-login-vectors.v1',
              'identity': 'All names, input bytes and opaque values are original public test constants; never real credentials/accounts/sessions.',
              'oracle': 'Independent Python struct and byte-order model; observed pairwise row swaps and canonical-state selection checks. Not original program execution.',
              'requests': requests, 'profiles': cases}
    path = Path(__file__).with_name('original-login-vectors.json')
    path.write_text(json.dumps(output, indent=2) + '\n')
    print(json.dumps({'requests': len(requests), 'profile_cases': len(cases), 'max_rows': 64, 'output': str(path)}))


if __name__ == '__main__':
    main()
