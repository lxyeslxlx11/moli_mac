#!/usr/bin/env python3
"""Independent original TCP peer: verify source auth tuple before supplying ordinary scene bytes."""
from pathlib import Path
import importlib.util,json,socket,struct,sys
HERE=Path(__file__).resolve().parent
spec=importlib.util.spec_from_file_location('wire',HERE/'wire_reference.py');wire=importlib.util.module_from_spec(spec);spec.loader.exec_module(wire)
v=json.loads((HERE/'original-vectors.json').read_text());scene=json.loads((HERE/'scene-vectors.json').read_text());key=bytes.fromhex(v['wire']['bootstrap']['keyHex']);mode=sys.argv[1] if len(sys.argv)>1 else 'success';assert mode in ['success','busy','duplicate']
def encoded(rows):return b''.join(wire.frame(wire.payload_encode(bytes.fromhex(raw),key)) for raw in rows)
with socket.socket() as server:
 server.settimeout(12);server.bind(('127.0.0.1',0));server.listen(1);print(json.dumps(dict(port=server.getsockname()[1])),flush=True)
 connection,_=server.accept()
 with connection:
  connection.settimeout(12)
  def exact(count):
   output=b''
   while len(output)<count:
    part=connection.recv(count-len(output))
    if not part:raise ValueError('Short original game request')
    output+=part
   return output
  def read_frame():
   header=exact(4);assert header[:2]==b'\xaf\xef';size=struct.unpack('<H',header[2:])[0];assert 0<size<=32767;payload=exact(size);assert exact(2)==b'\xef\xaf';return wire.payload_decode(payload,key)
  initial=wire.frame(bytes.fromhex(v['wire']['bootstrap']['payloadHex']))
  for piece in [initial[:1],initial[1:3],initial[3:9],initial[9:]]:connection.sendall(piece)
  assert read_frame()==bytes.fromhex(v['wire']['authPlainHex'])
  if mode=='busy':
   connection.sendall(bytes.fromhex(v['wire']['replies']['busy']['frameHex']));assert connection.recv(1)==b'';count=0
  else:
   p=scene['protocol'];data=bytes.fromhex(v['wire']['replies']['success']['frameHex'])
   if mode=='duplicate':data+=bytes.fromhex(v['wire']['replies']['busy']['frameHex'])
   data+=encoded(p['beforePlainHex']);at=0
   for size in [1,2,5,11,31,73,len(data)]:
    connection.sendall(data[at:at+size]);at+=size
    if at>=len(data):break
   count=0
   for expected in p['requestPlainHex']:assert read_frame()==bytes.fromhex(expected);count+=1
   connection.sendall(encoded(p['afterPlainHex']));connection.shutdown(socket.SHUT_WR)
  print(json.dumps(dict(authentication_request_verified=True,authentication_requests=1,rejected=mode=='busy',duplicate_reply=mode=='duplicate',movement_requests_verified=count,source_scene_messages=0 if mode=='busy' else len(scene['protocol']['beforePlainHex'])+len(scene['protocol']['afterPlainHex']),official_session=False)),flush=True)
