#!/usr/bin/env python3
"""Original full exchange vectors from public fixtures and independent PyCryptodome ECB."""
from pathlib import Path
import json
import struct
import Crypto
from Crypto.Cipher import Blowfish


def swap_words(data):
    assert len(data) % 4 == 0
    return b''.join(data[at:at + 4][::-1] for at in range(0, len(data), 4))


def record(key, plain):
    padded = plain + bytes(8 - len(plain) % 8)
    cipher = swap_words(Blowfish.new(key, Blowfish.MODE_ECB).encrypt(swap_words(padded)))
    return struct.pack('>II', len(cipher), len(plain)) + cipher


def frame(body):
    return struct.pack('>H', len(body)) + body


def main():
    root = Path(__file__).resolve().parents[2]
    channels = json.loads((root/'analysis/launcher-v7/original-channel-vectors.json').read_text())
    login = json.loads((root/'analysis/launcher-v8/original-login-vectors.json').read_text())
    cases = []
    for index, profile_index in enumerate([0, 3, 4]):
        exchange, request, profiles = channels['key_exchange'][index], login['requests'][index], login['profiles'][profile_index]
        key = bytes.fromhex(exchange['derived_fixture_key_hex'])
        inner = frame(bytes([2]) + struct.pack('>II', 7, 19)) + frame(bytes.fromhex(profiles['body_hex']))
        peer_wire = record(key, inner[:3]) + record(key, inner[3:])
        cases.append({'name': ['original-profiles', 'original-empty', 'original-nonzero'][index],
                      'challenge_hex': exchange['challenge_hex'], 'fixture_exponent_hex': exchange['fixture_exponent_hex'],
                      'public_message_hex': exchange['public_message_hex'], 'fixture_key_hex': exchange['derived_fixture_key_hex'],
                      'request_fields': {k: request[k] for k in ['counter', 'game_code', 'username_hex', 'password_hex']},
                      'request_record_hex': record(key, bytes.fromhex(request['frame_hex'])).hex(),
                      'peer_wire_hex': peer_wire.hex(), 'profile_body_hex': profiles['body_hex'],
                      'expected_disposition': profiles['expected']['disposition'], 'expected_notice_count': 1})
    output = {'schema': 'moli.launcher-v9.original-flow-vectors.v1',
              'identity': 'Original public constants only; never real credentials, keys, accounts or captured sessions.',
              'oracle': f'Python struct and PyCryptodome{Crypto.__version__} with32-bit word swaps; reuses independent original arithmetic/input vectors.',
              'flows': cases}
    path = Path(__file__).with_name('original-flow-vectors.json')
    path.write_text(json.dumps(output, indent=2) + '\n')
    print(json.dumps({'flows': len(cases), 'pycryptodome': Crypto.__version__, 'output': str(path)}))


if __name__ == '__main__':
    main()
