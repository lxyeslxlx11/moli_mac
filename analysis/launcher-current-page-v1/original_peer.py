#!/usr/bin/env python3
"""Original loopback UI oracle. Emits metadata only; uses fixed public synthetic inputs."""
import argparse
import json
import signal
import socket
import struct
import sys
import threading
import time
from pathlib import Path
from Crypto.Cipher import Blowfish


def native_hex(value):
    value = format(value, 'X')
    return '0' + value if len(value) % 2 else value


def wordswap(value):
    return b''.join(value[i:i + 4][::-1] for i in range(0, len(value), 4))


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--source-profile', choices=['legacy', 'win32-current'], default='win32-current')
    parser.add_argument('--case', choices=['profiles', 'wrong-group'], default='profiles')
    parser.add_argument('--lifetime-seconds', type=int, choices=range(20, 601), default=20)
    args = parser.parse_args()
    root = Path(__file__).resolve().parents[2]
    vector = json.loads((root / 'analysis/launcher-current-channel-v1/original-vectors.json').read_text())['valid'][0]
    challenge = bytes.fromhex(vector['challenge_hex'])
    at = 4
    fields = []
    for _ in range(3):
        size = struct.unpack_from('>I', challenge, at)[0]
        at += 4
        fields.append(challenge[at:at + size])
        at += size
    current = args.source_profile == 'win32-current'
    modulus_text = fields[1] if current else format(2**127 - 1, 'x').encode()
    modulus = int(modulus_text, 16)
    generator = 2 if current else 3
    # Fixed public oracle exponent, never a real account/session credential.
    oracle_exponent = 0x13579BDF
    public = native_hex(pow(generator, oracle_exponent, modulus)).encode()
    group = b'3' if args.case == 'wrong-group' else str(generator).encode()
    wire = struct.pack('>I', 0) + b''.join(struct.pack('>I', len(v)) + v for v in [group, modulus_text, public])
    reply = bytes.fromhex(json.loads((root / 'analysis/launcher-v9/original-flow-vectors.json').read_text())['flows'][0]['profile_body_hex'])
    username, password = b'SyntheticU1', b'SyntheticP1'
    body = b'\x0a' + struct.pack('>I', 0) + bytes([len(username)]) + username + bytes([len(password)]) + password + struct.pack('>I', 11)
    expected = struct.pack('>H', len(body)) + body
    stop = threading.Event()
    deadline = time.monotonic() + args.lifetime_seconds
    # A terminal interrupt reaches both the Node parent and this owned child.
    # Treat either signal as the same bounded stop command, without a traceback.
    signal.signal(signal.SIGINT, lambda *_: stop.set())
    signal.signal(signal.SIGTERM, lambda *_: stop.set())

    def command_reader():
        for line in sys.stdin:
            if line.strip() == 'stop':
                stop.set()
                return
    threading.Thread(target=command_reader, daemon=True).start()

    def check():
        if stop.is_set():
            raise InterruptedError()
        if time.monotonic() >= deadline:
            raise TimeoutError()

    def receive(conn, size):
        value = bytearray()
        while len(value) < size:
            check()
            try:
                part = conn.recv(size - len(value))
            except socket.timeout:
                continue
            if not part:
                raise EOFError()
            value.extend(part)
        return bytes(value)

    def closed(conn):
        while True:
            check()
            try:
                part = conn.recv(1)
            except socket.timeout:
                continue
            if not part:
                return True
            raise ValueError('Unexpected extra oracle data')

    def record(key, value):
        size = ((len(value) + 7) // 8) * 8 + 8 if current else len(value) + 8 - len(value) % 8
        cipher = wordswap(Blowfish.new(key, Blowfish.MODE_ECB).encrypt(wordswap(value + bytes(size - len(value)))))
        return struct.pack('>II', size, len(value)) + cipher

    try:
        with socket.socket() as listener:
            listener.bind(('127.0.0.1', 0))
            listener.listen(1)
            listener.settimeout(0.1)
            print(json.dumps({'kind': 'ready', 'address': '127.0.0.1', 'port': listener.getsockname()[1]}), flush=True)
            while True:
                check()
                try:
                    conn, _ = listener.accept()
                    break
                except socket.timeout:
                    continue
            with conn:
                conn.settimeout(0.1)
                assert receive(conn, 8) == struct.pack('>II', 1, 8)
                for offset in range(0, len(wire), 17):
                    conn.sendall(wire[offset:offset + 17])
                if args.case == 'wrong-group':
                    assert current
                    assert closed(conn)
                    result = {'passed': True, 'request_verified': False, 'group_rejected_before_request': True, 'client_closed': True}
                else:
                    size = struct.unpack('>I', receive(conn, 4))[0]
                    assert 1 <= size <= 1022
                    client_public = receive(conn, size)
                    assert all(v in b'0123456789ABCDEF' for v in client_public)
                    shared = native_hex(pow(int(client_public, 16), oracle_exponent, modulus))
                    assert len(shared) >= 16
                    key = bytes.fromhex(shared)[:8]
                    cipher_size, plain_size = struct.unpack('>II', receive(conn, 8))
                    expected_size = ((len(expected) + 7) // 8) * 8 + 8 if current else len(expected) + 8 - len(expected) % 8
                    assert cipher_size == expected_size and plain_size == len(expected)
                    cipher = receive(conn, cipher_size)
                    plain = wordswap(Blowfish.new(key, Blowfish.MODE_ECB).decrypt(wordswap(cipher)))
                    assert plain[:plain_size] == expected and not any(plain[plain_size:])
                    notice = b'\x02' + struct.pack('>II', 7, 19)
                    inner = struct.pack('>H', len(notice)) + notice + struct.pack('>H', len(reply)) + reply
                    response = (bytes(8) if current else b'') + record(key, inner[:3]) + record(key, inner[3:])
                    for offset in range(0, len(response), 19):
                        conn.sendall(response[offset:offset + 19])
                    assert closed(conn)
                    result = {'passed': True, 'request_verified': True, 'client_closed': True, 'request_frame_bytes': plain_size,
                              'record_cipher_bytes': cipher_size, 'current_extra_block_verified': current}
        print(json.dumps({'kind': 'result', 'source_profile': args.source_profile, 'connections': 1, **result}), flush=True)
        return 0
    except InterruptedError:
        print(json.dumps({'kind': 'result', 'passed': True, 'stopped': True, 'request_verified': False}), flush=True)
        return 0
    except Exception as error:
        print(json.dumps({'kind': 'result', 'passed': False, 'error_class': type(error).__name__}), flush=True)
        return 1


if __name__ == '__main__':
    sys.exit(main())
