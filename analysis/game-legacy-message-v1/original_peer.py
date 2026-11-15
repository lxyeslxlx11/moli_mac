#!/usr/bin/env python3
"""Original standalone loopback peer for catalog, bootstrap/rekey, binary and pose projection."""
from pathlib import Path
import importlib.util
import json
import socket
import struct

HERE=Path(__file__).resolve().parent
spec=importlib.util.spec_from_file_location('original_message_vectors',HERE/'generate_vectors.py');oracle=importlib.util.module_from_spec(spec);spec.loader.exec_module(oracle)
v=json.loads((HERE/'original-vectors.json').read_text());old_key=bytes.fromhex(v['bootstrap'][0]['keyHex']);new_key=bytes.fromhex(v['bootstrap'][1]['keyHex'])
parts=[oracle.frame(bytes.fromhex(v['bootstrap'][0]['payloadHex']))]
for row in v['incoming']:
    if row['id']!=v['protocol']['resetId']:parts.append(oracle.frame(oracle.payload_encode(bytes.fromhex(row['plainHex']),old_key)))
parts.append(oracle.frame(bytes.fromhex(v['binary'][0]['hex'])))
for key in ['resetPlainHex','pendingPoseHex']:parts.append(oracle.frame(oracle.payload_encode(bytes.fromhex(v['protocol'][key]),old_key)))
parts.append(oracle.frame(bytes.fromhex(v['bootstrap'][1]['payloadHex'])))
parts.append(oracle.frame(oracle.payload_encode(bytes.fromhex(v['protocol']['newPoseHex']),new_key)))
wire=b''.join(parts)
expected=[(old_key,bytes.fromhex(v['outgoing'][0]['plainHex']))]*2+[(new_key,bytes.fromhex(row['plainHex'])) for row in v['outgoing']]
with socket.socket() as server:
    server.settimeout(8);server.bind(('127.0.0.1',0));server.listen(1);print(json.dumps(dict(port=server.getsockname()[1])),flush=True)
    connection,_=server.accept()
    with connection:
        connection.settimeout(8);at=0
        for size in [1,2,3,4,7,11,31,127,len(wire)]:
            connection.sendall(wire[at:at+size]);at+=size
            if at>=len(wire):break
        def exact(size):
            raw=b''
            while len(raw)<size:
                chunk=connection.recv(size-len(raw))
                if not chunk:raise ValueError('Short original response')
                raw+=chunk
            return raw
        for key,plain in expected:
            header=exact(4);assert header[:2]==b'\xaf\xef';length=struct.unpack('<H',header[2:])[0]
            assert 0<length<=32760 and length%8==0;body=exact(length);assert exact(2)==b'\xef\xaf'
            assert oracle.payload_decode(body,key)==plain
        connection.shutdown(socket.SHUT_WR)
print(json.dumps(dict(responses_verified=len(expected),incoming_branches=104,original_loopback_only=True)),flush=True)
