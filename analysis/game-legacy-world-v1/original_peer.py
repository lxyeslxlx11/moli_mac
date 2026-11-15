#!/usr/bin/env python3
"""Standalone original loopback map peer. Needs only the three copied original files."""
from pathlib import Path
import importlib.util
import json
import socket
import struct

HERE=Path(__file__).resolve().parent
spec=importlib.util.spec_from_file_location('wire_reference',HERE/'wire_reference.py');wire=importlib.util.module_from_spec(spec);spec.loader.exec_module(wire)
vectors=json.loads((HERE/'original-vectors.json').read_text());v=vectors['protocol'];key=bytes.fromhex(vectors['bootstrap']['keyHex'])
parts=[wire.frame(bytes.fromhex(vectors['bootstrap']['payloadHex']))]
for name in ['noticeHex','patchHex','finalNoticeHex','unavailableHex']:parts.append(wire.frame(wire.payload_encode(bytes.fromhex(v[name]),key)))
stream=b''.join(parts)
with socket.socket() as server:
    server.settimeout(8);server.bind(('127.0.0.1',0));server.listen(1);print(json.dumps(dict(port=server.getsockname()[1])),flush=True)
    connection,_=server.accept()
    with connection:
        connection.settimeout(8);at=0
        for size in [1,2,4,7,19,31,len(stream)]:
            connection.sendall(stream[at:at+size]);at+=size
            if at>=len(stream):break
        def exact(size):
            raw=b''
            while len(raw)<size:
                chunk=connection.recv(size-len(raw))
                if not chunk:raise ValueError('Short original map request')
                raw+=chunk
            return raw
        header=exact(4);assert header[:2]==b'\xaf\xef';length=struct.unpack('<H',header[2:])[0]
        assert 0<length<=32760 and length%8==0;body=exact(length);assert exact(2)==b'\xef\xaf'
        assert wire.payload_decode(body,key)==bytes.fromhex(v['requestHex']);connection.shutdown(socket.SHUT_WR)
print(json.dumps(dict(requests_verified=1,map_notices=2,map_patches=1,unavailable=1,original_loopback_only=True)),flush=True)
