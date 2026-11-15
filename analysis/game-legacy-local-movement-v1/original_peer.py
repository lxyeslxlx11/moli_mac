#!/usr/bin/env python3
"""Standalone original local-motion or cache-wait peer; only3 public original files."""
from pathlib import Path
import importlib.util,json,socket,struct,sys
HERE=Path(__file__).resolve().parent
spec=importlib.util.spec_from_file_location('wire',HERE/'wire_reference.py');wire=importlib.util.module_from_spec(spec);spec.loader.exec_module(wire)
v=json.loads((HERE/'original-vectors.json').read_text());mode=sys.argv[1] if len(sys.argv)>1 else 'movement';p=v['protocolMap' if mode=='missing-map' else 'protocol'];key=bytes.fromhex(v['bootstrap']['keyHex'])
def encoded(rows):return b''.join(wire.frame(wire.payload_encode(bytes.fromhex(raw),key)) for raw in rows)
with socket.socket() as server:
    server.settimeout(8);server.bind(('127.0.0.1',0));server.listen(1);print(json.dumps(dict(port=server.getsockname()[1])),flush=True)
    connection,_=server.accept()
    with connection:
        connection.settimeout(8);data=wire.frame(bytes.fromhex(v['bootstrap']['payloadHex']))+encoded(p['beforePlainHex']);at=0
        for count in [1,2,3,5,11,17,31,len(data)]:
            connection.sendall(data[at:at+count]);at+=count
            if at>=len(data):break
        def exact(count):
            raw=b''
            while len(raw)<count:
                part=connection.recv(count-len(raw))
                if not part:raise ValueError('Short original navigation request')
                raw+=part
            return raw
        for expected in p['requestPlainHex']:
            header=exact(4);assert header[:2]==b'\xaf\xef';count=struct.unpack('<H',header[2:])[0];assert 0<count<=32760 and count%8==0
            raw=exact(count);assert exact(2)==b'\xef\xaf';assert wire.payload_decode(raw,key)==bytes.fromhex(expected)
        connection.sendall(encoded(p['afterPlainHex']));connection.shutdown(socket.SHUT_WR)
print(json.dumps(dict(mode=mode,requests_verified=len(p['requestPlainHex']),messages_sent=len(p['beforePlainHex'])+len(p['afterPlainHex']),original_loopback_only=True)),flush=True)
