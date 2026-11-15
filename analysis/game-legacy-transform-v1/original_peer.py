#!/usr/bin/env python3
"""One original loopback exchange: synthetic bootstrap and game payload transforms."""
from pathlib import Path
import importlib.util
import json
import socket
import struct

# The independent functions do not run a game or contact any external endpoint.
spec = importlib.util.spec_from_file_location('original_vectors',Path(__file__).with_name('generate_vectors.py'))
oracle = importlib.util.module_from_spec(spec)
spec.loader.exec_module(oracle)
fixture = json.loads(Path(__file__).with_name('original-vectors.json').read_text())['bootstrap'][0]
key = bytes.fromhex(fixture['keyHex'])
messages = [b'original-python-message',b'original-second-message']
def frame(value):return b'\xaf\xef'+struct.pack('<H',len(value))+value+b'\xef\xaf'
wire = frame(bytes.fromhex(fixture['payloadHex']))+b''.join(frame(oracle.encode(value,key)) for value in messages)
with socket.socket() as server:
    server.settimeout(5);server.bind(('127.0.0.1',0));server.listen(1)
    print(json.dumps(dict(port=server.getsockname()[1])),flush=True)
    connection,_ = server.accept()
    with connection:
        connection.settimeout(5);at=0
        for length in [1,2,4,3,1,6,2,19,31,len(wire)]:
            connection.sendall(wire[at:at+length]);at+=length
            if at>=len(wire):break
        def exact(length):
            raw=b''
            while len(raw)<length:
                chunk=connection.recv(length-len(raw))
                if not chunk:raise ValueError('Short original response')
                raw+=chunk
            return raw
        header=exact(4);assert header[:2]==b'\xaf\xef'
        size=struct.unpack('<H',header[2:])[0];assert 0<size<=32760 and size%8==0
        payload=exact(size);assert exact(2)==b'\xef\xaf'
        assert oracle.decode(payload,key)==b'original-response'
        connection.shutdown(socket.SHUT_WR)
print(json.dumps(dict(response_verified=True,original_loopback_only=True)),flush=True)
