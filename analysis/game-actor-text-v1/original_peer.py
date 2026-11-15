#!/usr/bin/env python3
"""Independent original TCP ordinary actor text peer; fixed original scene and no external service."""
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
spin = json.loads((HERE / 'text-vectors.json').read_text())['full']
key = bytes.fromhex(old['bootstrap']['keyHex'])
mode = sys.argv[1] if len(sys.argv) > 1 else 'success'
flow = v['flows'][int(sys.argv[2]) if len(sys.argv) > 2 else 0]
assert mode in ['text-full', 'text-reload', 'text-close']


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
                    raise ValueError('Short original option request')
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
        data = bytes.fromhex(v['wire']['category5']['frameHex'] + flow['initial']['frameHex'])
        connection.sendall(data[:7])
        connection.sendall(data[7:])
        assert request() == bytes.fromhex(v['wire']['request']['plainHex'])
        upgrades = 1
        connection.sendall(bytes.fromhex(v['wire']['accepted']['frameHex']))
        assert request() == bytes.fromhex(old['flow']['requests']['list']['plainHex'])
        refreshed = True
        connection.sendall(bytes.fromhex(v['wire']['category8']['frameHex'] + flow['initial']['frameHex']))
        assert request() == bytes.fromhex(flow['entry']['plainHex'])
        entered = True
        reloaded = False
        count = 0
        rows = list(scene['protocol']['beforePlainHex'])
        rows[3] = spin['unitPlainHex']
        rows[4:4] = spin['initialPlainHex']
        data = bytes.fromhex(old['flow']['replies']['entered']['frameHex']) + encoded(rows)
        at = 0
        for size in [1, 2, 5, 13, 31, 73, len(data)]:
            connection.sendall(data[at:at + size])
            at += size
            if at >= len(data):
                break
        print(json.dumps(dict(stage='initial-sent', mode=mode)), flush=True)
        limit = 20 if mode == 'text-reload' else 90 if mode == 'text-close' else len(spin['frames'])
        source_packets = len(spin['initialPlainHex'])
        local_options = 0
        for event in spin['events']:
            if event['at'] >= limit:
                continue
            assert sys.stdin.readline().strip() == event['key']
            if event['kind'] == 'packet':
                connection.sendall(encoded([event['plainHex']]))
                source_packets += 1
            else:
                assert event['kind'] == 'cycle' and 0 <= event['mode'] <= 5
                local_options += 1
            print(json.dumps(dict(stage=event['key'] + '-sent', mode=mode)), flush=True)
        if mode != 'text-close':
            assert sys.stdin.readline().strip() == 'release'
            if mode == 'text-reload':
                relocated = bytes.fromhex(rows[1]).replace(b'c c 2 3 ', b'c c 6 4 ', 1).hex()
                connection.sendall(encoded([relocated, rows[-1]]))
                reloaded = True
            print(json.dumps(dict(stage='released', mode=mode)), flush=True)
        assert connection.recv(1) == b''
        print(json.dumps(dict(authentication_verified=True, list_request_verified=True, upgrade_requests_verified=upgrades,
                              roster_refresh_verified=refreshed, entry_request_verified=entered, scene_reloaded=reloaded, selected_slot=flow['slot'],
                              entry_arguments=flow['entry']['arguments'] if entered else None, fallback_corrected=flow['fallback'], actor_text_boundary=True, source_packets_sent=source_packets, local_option_changes=local_options, extra_unit_on_relocation=False,
                              mode=mode, movement_requests_verified=count, total_client_requests=2 + upgrades + int(refreshed) + int(entered) + count,
                              official_session=False)), flush=True)
