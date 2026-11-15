#!/usr/bin/env python3
"""Original synthetic arithmetic/record oracles; no official server, account or captured data."""
from pathlib import Path
from hashlib import sha256
import json
import struct
import Crypto
from Crypto.Cipher import Blowfish


def native_hex(value):
    text = format(value, 'X')
    return ('0' + text) if value and len(text) % 2 else text


def wordswap(data):
    assert len(data) % 4 == 0
    return b''.join(data[i:i + 4][::-1] for i in range(0, len(data), 4))


def record(key, plain):
    padded = plain + bytes(8 - len(plain) % 8)
    encrypted = wordswap(Blowfish.new(key, Blowfish.MODE_ECB).encrypt(wordswap(padded)))
    return struct.pack('>II', len(encrypted), len(plain)) + encrypted


def challenge(generator, modulus, peer):
    fields = [str(generator).encode(), native_hex(modulus).lower().encode(), native_hex(peer).encode()]
    return struct.pack('>I', 0) + b''.join(struct.pack('>I', len(x)) + x for x in fields)


def main():
    keys = [bytes(range(8)), bytes(8), bytes([255]) * 8]
    records = []
    for index, length in enumerate([0, 1, 7, 8, 9, 15, 16, 47, 255]):
        plain = bytes((i * 37 + index) % 256 for i in range(length))
        # Include real trailing zeros inside plaintext, separately from padding.
        if length > 7:
            plain = plain[:-4] + bytes(4)
        key = keys[index % len(keys)]
        records.append({'name': f'original-length-{length}', 'key_hex': key.hex(),
                        'plaintext_hex': plain.hex(), 'record_hex': record(key, plain).hex()})
    length = 0x7fc8
    plain = bytes(i * 29 % 256 for i in range(length))
    maximum = {'plaintext_length': length, 'pattern_multiplier': 29, 'key_hex': keys[0].hex(),
               'record_bytes': len(record(keys[0], plain)), 'record_sha256': sha256(record(keys[0], plain)).hexdigest()}
    arithmetic = []
    for name, modulus, generator, secret, peer_secret in [
        ('original-127-bit', 2**127 - 1, 3, int('1234567890ABCDEF1234567890ABCDEF12345678', 16), 0x13579BDF),
        ('original-public-odd-digits', 2**127 - 1, 3, 11, 0x12345678),
        ('original-255-bit', 2**255 - 19, 2, int('AB' * 20, 16), 0x102030405060708),
    ]:
        peer = pow(generator, peer_secret, modulus)
        public = pow(generator, secret, modulus)
        shared = pow(peer, secret, modulus)
        assert pow(public, peer_secret, modulus) == shared
        shared_hex = native_hex(shared)
        assert len(shared_hex) >= 16
        text = native_hex(public).encode()
        arithmetic.append({'name': name, 'challenge_hex': challenge(format(generator, 'X'), modulus, peer).hex(),
                           'fixture_exponent_hex': secret.to_bytes(20, 'big').hex(),
                           'public_message_hex': (struct.pack('>I', len(text)) + text).hex(),
                           'derived_fixture_key_hex': bytes.fromhex(shared_hex)[:8].hex()})
    output = {'schema': 'moli.launcher-v7.original-channel-vectors.v1',
              'identity': 'Original fixtures only. All private exponents and keys here are public test constants, never account material.',
              'oracle': f'Python pow/struct and PyCryptodome {Crypto.__version__} Blowfish ECB; reverse each32-bit word around standard ECB.',
              'records': records, 'maximum_record': maximum, 'key_exchange': arithmetic}
    path = Path(__file__).with_name('original-channel-vectors.json')
    path.write_text(json.dumps(output, indent=2) + '\n')
    print(json.dumps({'records': len(records), 'key_exchange': len(arithmetic), 'maximum_bytes': maximum['record_bytes'],
                      'pycryptodome': Crypto.__version__, 'output': str(path)}))


if __name__ == '__main__':
    main()
