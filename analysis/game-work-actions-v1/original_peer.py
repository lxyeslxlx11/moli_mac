#!/usr/bin/env python3
"""Original localhost item-work peer. Uses the retained original authored wire vectors only."""
import importlib.util
import json
from pathlib import Path
import socket
import struct
import sys

ROOT = Path(__file__).resolve().parents[2]
def read(path):
    return json.loads((ROOT / path).read_text())
spec = importlib.util.spec_from_file_location('wire', ROOT / 'analysis/game-legacy-message-v1/generate_vectors.py')
wire = importlib.util.module_from_spec(spec)
spec.loader.exec_module(wire)
old = read('analysis/game-post-login-v1/original-vectors.json')
options = read('analysis/game-character-options-v1/original-vectors.json')
fixture = json.loads(Path(sys.argv[1]).read_text())
flow = options['flows'][int(sys.argv[2])]
key = bytes.fromhex(old['bootstrap']['keyHex'])
count = 0
def signal(name):
    print(json.dumps({'stage': name}), flush=True)
def release(name):
    assert sys.stdin.readline().strip() == name

with socket.socket() as server:
    server.settimeout(45)
    server.bind(('127.0.0.1', 0))
    server.listen(1)
    print(json.dumps({'port': server.getsockname()[1]}), flush=True)
    connection, _ = server.accept()
    with connection:
        connection.settimeout(45)
        def exact(n):
            out = b''
            while len(out) < n:
                chunk = connection.recv(n - len(out))
                assert chunk, 'client closed before expected request'
                out += chunk
            return out
        def request():
            global count
            header = exact(4)
            assert header[:2] == b'\xaf\xef'
            length = struct.unpack('<H', header[2:])[0]
            assert 0 < length <= 32767
            data = exact(length)
            assert exact(2) == b'\xef\xaf'
            result = wire.payload_decode(data, key)
            # Ordinary keepalive is independently received and does not alter work order.
            if result == b'3$} nr ':
                return request()
            count += 1
            return result
        def send(rows):
            connection.sendall(b''.join(wire.frame(wire.payload_encode(bytes.fromhex(row), key)) for row in rows))
        connection.sendall(wire.frame(bytes.fromhex(old['bootstrap']['payloadHex'])))
        assert request() == wire.payload_decode(bytes.fromhex(old['authFrameHex'])[4:-2], key)
        connection.sendall(bytes.fromhex(old['authReplyFrameHex']))
        assert request() == bytes.fromhex(old['flow']['requests']['list']['plainHex'])
        connection.sendall(bytes.fromhex(options['wire']['category5']['frameHex'] + flow['initial']['frameHex']))
        assert request() == bytes.fromhex(options['wire']['request']['plainHex'])
        connection.sendall(bytes.fromhex(options['wire']['accepted']['frameHex']))
        assert request() == bytes.fromhex(old['flow']['requests']['list']['plainHex'])
        connection.sendall(bytes.fromhex(options['wire']['category8']['frameHex'] + flow['initial']['frameHex']))
        assert request() == bytes.fromhex(flow['entry']['plainHex'])
        connection.sendall(bytes.fromhex(old['flow']['replies']['entered']['frameHex']))
        send(fixture['initial'])
        assert [request(),request()] == [b"'<4 0 ",b"'<4 5 "]
        send(fixture['recipes'])
        signal('ready')
        assert request() == b':J@ 2 3 c '
        assert request() == b'7ba d '
        assert request() == b'+>L 1 0 8  '
        signal('repair-submitted')
        release('repair-result')
        send([fixture['repairResult'],fixture['lowMp']])
        assert request() == b':J@ 2 3 0 '
        assert request() == b':J@ 2 3 b '
        signal('appraise-open')
        release('restore-mp')
        send([fixture['restoreMp']])
        assert request() == b'7ba d '
        assert request() == b'+>L 3 0 9  '
        send([fixture['appraiseResult']])
        assert request() == b':J@ 2 3 0 '
        assert request() == b':J@ 2 3 9 '
        assert request() == b'+>L 4 0 a Original\\Smark '
        send([fixture['markResult'],fixture['markedItem']])
        assert request() == b'+>L 4 0 a  '
        send([fixture['markResult']])
        assert request() == b':J@ 2 3 0 '
        assert request() == b':J@ 2 3 9 '
        assert request() == b'7ba 8 '
        assert request() == b'+>L 5 0 -1 11|12 '
        send([fixture['decorateResult']])
        assert request() == b':J@ 2 3 0 '
        assert request() == b':J@ 2 3 9 '
        assert request() == b'7ba 8 '
        assert request() == b':J@ 2 3 0 '
        send([fixture['decorateResult']])
        signal('cancelled')
        assert connection.recv(1) == b''
        print(json.dumps({'stage':304,'requests':count,'query':True,'repair':True,'appraise':True,
                          'markAndClear':True,'decorationOrder':True,'cancelled':True,
                          'sameConnection':True,'officialSession':False}),flush=True)
