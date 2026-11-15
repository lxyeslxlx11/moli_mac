"""Loopback startup check with original handoff fields and a separately verified source digest."""
import importlib.util
import json
from pathlib import Path
import socket
import struct
import sys


ROOT = Path(__file__).resolve().parents[2]
spec = importlib.util.spec_from_file_location('wire', ROOT / 'analysis/game-legacy-message-v1/generate_vectors.py')
wire = importlib.util.module_from_spec(spec)
spec.loader.exec_module(wire)
vectors = json.loads((ROOT / 'analysis/game-post-login-v1/original-vectors.json').read_text())
key = bytes.fromhex(vectors['bootstrap']['keyHex'])
digest = sys.argv[1].encode('ascii')
assert len(digest) == 32 and all(b in b'0123456789abcdef' for b in digest)


def read_exact(connection, size):
    raw = bytearray()
    while len(raw) < size:
        chunk = connection.recv(size - len(raw))
        assert chunk, 'Connection closed during an original request'
        raw.extend(chunk)
    return bytes(raw)


def request(connection):
    header = read_exact(connection, 4)
    assert header[:2] == b'\xaf\xef'
    size = struct.unpack_from('<H', header, 2)[0]
    assert 0 < size <= 32767
    raw = read_exact(connection, size)
    assert read_exact(connection, 2) == b'\xef\xaf'
    return wire.payload_decode(raw, key)


with socket.socket() as server:
    server.settimeout(20)
    server.bind(('127.0.0.1', 0))
    server.listen(1)
    print(json.dumps({'port': server.getsockname()[1]}), flush=True)
    connection, _ = server.accept()
    with connection:
        connection.settimeout(20)
        connection.sendall(wire.frame(bytes.fromhex(vectors['bootstrap']['payloadHex'])))
        auth = wire.message({'tag': '/b1', 'fields': ['bytes', 'bytes', 'bytes']}, [digest, b'OriginalT', b'OriginalG'])
        assert request(connection) == auth
        connection.sendall(bytes.fromhex(vectors['authReplyFrameHex']))
        assert request(connection) == bytes.fromhex(vectors['flow']['requests']['list']['plainHex'])
        replies = vectors['flow']['replies']
        connection.sendall(bytes.fromhex(replies['category']['frameHex'] + replies['list']['frameHex']))
        assert connection.recv(1) == b''
        print(json.dumps({'authentication_fields_match': True, 'list_request_match': True, 'normal_close': True}))
