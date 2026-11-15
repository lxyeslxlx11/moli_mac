#!/usr/bin/env python3
"""Independent synthetic world TCP peer; verifies every actual outbound movement payload."""
from pathlib import Path
import importlib.util, json, socket, struct, sys
P=Path(__file__).resolve().parent;s=importlib.util.spec_from_file_location('wire',P/'wire_reference.py');wire=importlib.util.module_from_spec(s);s.loader.exec_module(wire)
v=json.load(open(P/'scene-vectors.json'));c=next(r for r in json.load(open(P/'party-vectors.json'))['cases']if r['name']==sys.argv[1]);key=bytes.fromhex(v['bootstrap']['keyHex'])
def frame(b):return wire.frame(wire.payload_encode(b,key))
with socket.socket()as server:
 server.settimeout(15);server.bind(('127.0.0.1',0));server.listen(1);print(json.dumps(dict(port=server.getsockname()[1])),flush=True)
 connection,_=server.accept()
 with connection:
  connection.settimeout(15);data=wire.frame(bytes.fromhex(v['bootstrap']['payloadHex']))+b''.join(frame(bytes.fromhex(p))for p in v['protocol']['beforePlainHex'])+b''.join(frame(p.encode('latin1'))for p in c['packets']);at=0
  for size in [1,2,5,13,31,len(data)]:connection.sendall(data[at:at+size]);at+=size
  def exact(n):
   result=b''
   while len(result)<n:
    b=connection.recv(n-len(result));assert b;result+=b
   return result
  expected=v['protocol']['requestPlainHex']if c['name']=='leader'else[]
  for plain in expected:
   h=exact(4);assert h[:2]==b'\xaf\xef';n=struct.unpack('<H',h[2:])[0];assert 0<n<=32760 and n%8==0;payload=exact(n);assert exact(2)==b'\xef\xaf';assert wire.payload_decode(payload,key)==bytes.fromhex(plain)
  assert sys.stdin.readline().strip()=='done';connection.shutdown(socket.SHUT_WR);assert connection.recv(1)==b''
print(json.dumps(dict(case=c['name'],requests_verified=len(expected),source_packets=len(v['protocol']['beforePlainHex'])+len(c['packets']),scene_frames=len(c['frames']),official_session=False,original_loopback_only=True)),flush=True)
