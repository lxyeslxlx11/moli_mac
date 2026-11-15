#!/usr/bin/env python3
"""Original loopback launcher oracle. Never logs private exponents, key bytes or request contents."""
import argparse
import hashlib
import json
import socket
import struct
import sys
import threading
import time
from pathlib import Path
from Crypto.Cipher import Blowfish


def native_hex(value):
    text = format(value, 'X')
    return ('0' + text) if value and len(text) % 2 else text


def wordswap(value):
    return b''.join(value[i:i + 4][::-1] for i in range(0, len(value), 4))


def record(key, plain):
    padded = plain + bytes(8 - len(plain) % 8)
    encrypted = wordswap(Blowfish.new(key, Blowfish.MODE_ECB).encrypt(wordswap(padded)))
    return struct.pack('>II', len(encrypted), len(plain)) + encrypted


class Stopped(Exception):
    pass


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--case', choices=['profiles', 'empty', 'rejected', 'drop', 'stall', 'bad-challenge', 'truncated-record'], default='profiles')
    parser.add_argument('--connections', type=int, choices=range(1, 5), default=1)
    parser.add_argument('--input-profile', choices=['retained-vectors', 'ui-ascii', 'ui-catalog', 'ui-cp936', 'ui-utf8'], default='retained-vectors')
    parser.add_argument('--reply-name-encoding', choices=['auto', 'retained', 'windows-936', 'utf-8', 'invalid'], default='auto')
    parser.add_argument('--reply-delay-ms', type=int, choices=range(0,1001), default=0)
    parser.add_argument('--ui-counter-step', type=int, choices=[0, 1], default=0)
    parser.add_argument('--lifetime-seconds', type=int, choices=range(20, 601), default=20)
    args = parser.parse_args()
    root = Path(__file__).resolve().parents[2]
    login = json.loads((root / 'analysis/launcher-v8/original-login-vectors.json').read_text())
    flows = json.loads((root / 'analysis/launcher-v9/original-flow-vectors.json').read_text())['flows']
    index = {'empty': 1, 'rejected': 2}.get(args.case, 0)
    expected = bytes.fromhex(login['requests'][index]['frame_hex'])
    def ui_frame(counter):
        # Independent original UI request; configured Code11 for catalog binding, old slot0 retained separately.
        username, password = b'SyntheticU1', b'SyntheticP1'
        if args.input_profile in ['ui-cp936', 'ui-utf8']:
            codec = 'gbk' if args.input_profile == 'ui-cp936' else 'utf-8'
            username, password = '合成用户甲'.encode(codec), '测试口令甲'.encode(codec)
        game_code = 0 if args.input_profile == 'ui-ascii' else 11
        body = b'\x0a' + struct.pack('>I', counter) + bytes([len(username)]) + username + bytes([len(password)]) + password + struct.pack('>I', game_code)
        return struct.pack('>H', len(body)) + body
    if args.input_profile != 'retained-vectors':
        expected = ui_frame(0)
    reply = bytes.fromhex(flows[index]['profile_body_hex'])
    name_encoding = args.reply_name_encoding
    if name_encoding == 'auto':
        name_encoding = 'windows-936' if args.input_profile == 'ui-cp936' else 'utf-8' if args.input_profile == 'ui-utf8' else 'retained'
    expected_names = []
    expected_selectable_names = []
    if name_encoding != 'retained' and args.case == 'profiles':
        # Replace only the counted byte-list in the original fixture; preserve every associated numeric column.
        at = 9
        field_length = reply[at]; assert field_length < 253; at += 1 + field_length
        list_at = at; count = reply[at]; assert count == 4; at += 1
        for _ in range(count):
            length = reply[at]; assert length < 253; at += 1 + length
        names = [b'\xff', b'\xfe', b'\x81', b'\xc0'] if name_encoding == 'invalid' else [name.encode('gbk' if name_encoding == 'windows-936' else 'utf-8') for name in ['测试甲', '测试乙', '中文甲', '中文乙']]
        if name_encoding != 'invalid':
            expected_names = [name.decode('gbk' if name_encoding == 'windows-936' else 'utf-8') for name in sorted(names)]
            columns=[]
            column_at=at
            for _ in range(5):
                size=reply[column_at];assert size<253;column_at+=1
                columns.append(list(struct.unpack_from('>'+str(size)+'I',reply,column_at)));column_at+=4*size
            selectable=[]
            for index_,name in enumerate(names):
                state=columns[1][index_];state=state if state<0x80000000 else state-0x100000000
                if state in [0,-4] and not (columns[2][index_]!=0 and columns[4][index_]!=0):selectable.append(name)
            expected_selectable_names=[name.decode('gbk' if name_encoding=='windows-936' else 'utf-8') for name in sorted(selectable)]
        reply = reply[:list_at] + bytes([count]) + b''.join(bytes([len(name)]) + name for name in names) + reply[at:]
    stop = threading.Event()
    deadline = time.monotonic() + args.lifetime_seconds

    def command_reader():
        for line in sys.stdin:
            if line.strip() == 'stop':
                stop.set()
                return
    threading.Thread(target=command_reader, daemon=True).start()

    def check():
        if stop.is_set():
            raise Stopped()
        if time.monotonic() >= deadline:
            raise TimeoutError()

    def receive(conn, count):
        result = bytearray()
        while len(result) < count:
            check()
            try:
                part = conn.recv(count - len(result))
            except socket.timeout:
                continue
            if not part:
                raise EOFError()
            result.extend(part)
        return bytes(result)

    def closed_by_client(conn):
        while True:
            check()
            try:
                part = conn.recv(1)
            except socket.timeout:
                continue
            if not part:
                return True
            raise ValueError('Unexpected post-reply data')

    def fragments(conn, value):
        for at in range(0, len(value), 7):
            check()
            conn.sendall(value[at:at + 7])
            time.sleep(0.001)

    rows, public_digests = [], []
    try:
        with socket.socket() as server:
            server.bind(('127.0.0.1', 0))
            server.listen(4)
            server.settimeout(0.1)
            print(json.dumps({'kind': 'ready', 'address': '127.0.0.1', 'port': server.getsockname()[1]}), flush=True)
            while len(rows) < args.connections:
                check()
                try:
                    conn, _ = server.accept()
                except socket.timeout:
                    continue
                with conn:
                    conn.settimeout(0.1)
                    assert receive(conn, 8) == struct.pack('>II', 1, 8)
                    if args.case == 'drop':
                        rows.append({'hello_verified': True, 'request_verified': False, 'intentional_drop': True})
                        continue
                    if args.case == 'stall':
                        rows.append({'hello_verified': True, 'request_verified': False, 'client_closed': closed_by_client(conn)})
                        continue
                    if args.case == 'bad-challenge':
                        conn.sendall(struct.pack('>I', 1))
                        rows.append({'hello_verified': True, 'request_verified': False, 'client_closed': closed_by_client(conn)})
                        continue
                    modulus, generator, peer_secret = 2**127 - 1, 3, 0x13579BDF
                    fields = [b'3', native_hex(modulus).lower().encode(), native_hex(pow(generator, peer_secret, modulus)).encode()]
                    challenge = struct.pack('>I', 0) + b''.join(struct.pack('>I', len(x)) + x for x in fields)
                    fragments(conn, challenge)
                    length = struct.unpack('>I', receive(conn, 4))[0]
                    assert 1 <= length <= 1022
                    public = receive(conn, length)
                    assert all(c in b'0123456789ABCDEF' for c in public)
                    shared = native_hex(pow(int(public, 16), peer_secret, modulus))
                    assert len(shared) >= 16
                    key = bytes.fromhex(shared)[:8]
                    cipher_length, plain_length = struct.unpack('>II', receive(conn, 8))
                    assert 8 <= cipher_length <= 32760 and cipher_length % 8 == 0 and plain_length <= cipher_length
                    cipher = receive(conn, cipher_length)
                    plain = wordswap(Blowfish.new(key, Blowfish.MODE_ECB).decrypt(wordswap(cipher)))[:plain_length]
                    expected_frame = ui_frame(len(rows) * args.ui_counter_step) if args.input_profile != 'retained-vectors' else expected
                    assert plain == expected_frame
                    if args.reply_delay_ms:
                        time.sleep(args.reply_delay_ms / 1000)
                    public_digests.append(hashlib.sha256(public).digest())
                    if args.case == 'truncated-record':
                        conn.sendall(struct.pack('>II', 16, 5) + b'abc')
                        rows.append({'hello_verified': True, 'request_verified': True, 'intentional_truncation': True})
                        continue
                    notice = bytes([2]) + struct.pack('>II', 7, 19)
                    inner = struct.pack('>H', len(notice)) + notice + struct.pack('>H', len(reply)) + reply
                    fragments(conn, record(key, inner[:3]) + record(key, inner[3:]))
                    rows.append({'hello_verified': True, 'request_verified': True, 'request_frame_bytes': len(plain),
                                 'client_closed': closed_by_client(conn)})
        print(json.dumps({'kind': 'result', 'passed': True, 'case': args.case, 'connections': len(rows), 'rows': rows,
                          'public_values_differ': len(public_digests) <= 1 or len(set(public_digests)) == len(public_digests),
                          'original_profile_names_sorted': expected_names, 'original_selectable_profile_names_sorted':expected_selectable_names,
                          'profile_name_encoding': name_encoding}), flush=True)
    except Stopped:
        print(json.dumps({'kind': 'result', 'passed': True, 'stopped': True, 'case': args.case, 'connections': len(rows), 'rows': rows}), flush=True)
    except Exception as error:
        print(json.dumps({'kind': 'result', 'passed': False, 'case': args.case, 'error_type': type(error).__name__}), flush=True)
        return 1
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
