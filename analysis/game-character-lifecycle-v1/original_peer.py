#!/usr/bin/env python3
"""Original TCP oracle: auth, list, creation, refresh, entry, source scene and two moves. No external endpoints."""
from pathlib import Path
import importlib.util
import json
import socket
import struct
import sys

HERE = Path(__file__).resolve().parent
spec = importlib.util.spec_from_file_location('wire', HERE / 'wire_reference.py')
wire = importlib.util.module_from_spec(spec)
spec.loader.exec_module(wire)
v = json.loads((HERE / 'original-vectors.json').read_text())
old = json.loads((HERE / 'post-login-vectors.json').read_text())
scene = json.loads((HERE / 'scene-vectors.json').read_text())
key = bytes.fromhex(old['bootstrap']['keyHex'])
mode = sys.argv[1] if len(sys.argv) > 1 else 'success'
flow = v['flows'][int(sys.argv[2]) if len(sys.argv) > 2 else 0]
assert mode in ['success', 'duplicate', 'denied', 'abort', 'widget-close', 'observer-close']


def encoded(rows):
    return b''.join(wire.frame(wire.payload_encode(bytes.fromhex(x), key)) for x in rows)


with socket.socket() as server:
    server.settimeout(25)
    server.bind(('127.0.0.1', 0))
    server.listen(1)
    print(json.dumps(dict(port=server.getsockname()[1])), flush=True)
    connection, _ = server.accept()
    with connection:
        connection.settimeout(25)

        def exact(n):
            out = b''
            while len(out) < n:
                chunk = connection.recv(n - len(out))
                if not chunk:
                    raise ValueError('Short original creation request')
                out += chunk
            return out

        def request():
            header = exact(4)
            assert header[:2] == b'\xaf\xef'
            n = struct.unpack('<H', header[2:])[0]
            assert 0 < n <= 32767
            raw = exact(n)
            assert exact(2) == b'\xef\xaf'
            return wire.payload_decode(raw, key)

        connection.sendall(wire.frame(bytes.fromhex(old['bootstrap']['payloadHex'])))
        assert request() == wire.payload_decode(bytes.fromhex(old['authFrameHex'])[4:-2], key)
        connection.sendall(bytes.fromhex(old['authReplyFrameHex']))
        assert request() == bytes.fromhex(old['flow']['requests']['list']['plainHex'])
        data = bytes.fromhex(old['flow']['replies']['category']['frameHex'] + flow['initial']['frameHex'])
        connection.sendall(data[:7])
        connection.sendall(data[7:])
        assert request() == bytes.fromhex(flow['create']['plainHex'])
        refreshed = entered = False
        count = 0
        if mode == 'abort':
            assert connection.recv(1) == b''
        elif mode == 'denied':
            connection.sendall(bytes.fromhex(flow['denied']['frameHex']))
            assert connection.recv(1) == b''
        else:
            if mode.endswith('close'):
                assert sys.stdin.readline().strip() == 'release'
            connection.sendall(bytes.fromhex(flow['created']['frameHex']))
            if mode == 'duplicate':
                connection.sendall(bytes.fromhex(flow['created']['frameHex']))
            if mode == 'observer-close':
                assert connection.recv(1) == b''
            else:
                assert request() == bytes.fromhex(old['flow']['requests']['list']['plainHex'])
                refreshed = True
                connection.sendall(bytes.fromhex(old['flow']['replies']['category']['frameHex'] + flow['refreshed']['frameHex']))
                if mode == 'widget-close':
                    assert sys.stdin.readline().strip() == 'release'
                    connection.shutdown(socket.SHUT_WR)
                else:
                    assert request() == bytes.fromhex(flow['entry']['plainHex'])
                    entered = True
                    data = bytes.fromhex(old['flow']['replies']['entered']['frameHex']) + encoded(scene['protocol']['beforePlainHex'])
                    at = 0
                    for size in [1, 2, 5, 13, 31, 73, len(data)]:
                        connection.sendall(data[at:at + size])
                        at += size
                        if at >= len(data):
                            break
                    for expected in scene['protocol']['requestPlainHex']:
                        assert request() == bytes.fromhex(expected)
                        count += 1
                    connection.sendall(encoded(scene['protocol']['afterPlainHex']))
                    connection.shutdown(socket.SHUT_WR)
        print(json.dumps(dict(authentication_verified=True, list_request_verified=True, creation_request_verified=True,
                              roster_refresh_verified=refreshed, entry_request_verified=entered, selected_slot=flow['slot'],
                              mode=mode, movement_requests_verified=count, total_client_requests=3 + int(refreshed) + int(entered) + count,
                              official_session=False)), flush=True)
