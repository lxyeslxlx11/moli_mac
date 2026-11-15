#!/usr/bin/env python3
"""Standalone original scene/state peer; only3 public original files required."""
from pathlib import Path
import importlib.util,json,socket,struct
HERE=Path(__file__).resolve().parent
spec=importlib.util.spec_from_file_location('wire_reference',HERE/'wire_reference.py');wire=importlib.util.module_from_spec(spec);spec.loader.exec_module(wire)
v=json.loads((HERE/'original-vectors.json').read_text());p=v['protocol'];key=bytes.fromhex(v['bootstrap']['keyHex'])
stream=wire.frame(bytes.fromhex(v['bootstrap']['payloadHex']))+b''.join(wire.frame(wire.payload_encode(bytes.fromhex(raw),key)) for raw in p['streamPlainHex'])
with socket.socket() as server:
    server.settimeout(8);server.bind(('127.0.0.1',0));server.listen(1);print(json.dumps(dict(port=server.getsockname()[1])),flush=True)
    connection,_=server.accept()
    with connection:
        connection.settimeout(8);at=0
        for size in [1,2,4,7,19,31,127,len(stream)]:
            connection.sendall(stream[at:at+size]);at+=size
            if at>=len(stream):break
        def exact(size):
            raw=b''
            while len(raw)<size:
                chunk=connection.recv(size-len(raw))
                if not chunk:raise ValueError('Short original scene request')
                raw+=chunk
            return raw
        header=exact(4);assert header[:2]==b'\xaf\xef';size=struct.unpack('<H',header[2:])[0]
        assert 0<size<=32760 and size%8==0;body=exact(size);assert exact(2)==b'\xef\xaf'
        assert wire.payload_decode(body,key)==bytes.fromhex(p['requestPlainHex']);connection.shutdown(socket.SHUT_WR)
print(json.dumps(dict(requests_verified=1,messages_sent=12,scenes=3,masked_state_updates=3,map_notices=3,map_patches=1,original_loopback_only=True)),flush=True)
