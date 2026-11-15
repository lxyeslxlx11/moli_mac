#!/usr/bin/env python3
"""Independent original TCP peer validates auth, list, selected native fields, then ordinary world/movement."""
from pathlib import Path
import importlib.util,json,socket,struct,sys
HERE=Path(__file__).resolve().parent
s=importlib.util.spec_from_file_location('wire',HERE/'wire_reference.py');wire=importlib.util.module_from_spec(s);s.loader.exec_module(wire)
v=json.loads((HERE/'original-vectors.json').read_text());scene=json.loads((HERE/'scene-vectors.json').read_text());key=bytes.fromhex(v['bootstrap']['keyHex']);mode=sys.argv[1] if len(sys.argv)>1 else 'success';slot=int(sys.argv[2]) if len(sys.argv)>2 else 0;assert mode in ['success','duplicate','unavailable','denied','cancel'] and slot in [0,1]
def encoded(rows):return b''.join(wire.frame(wire.payload_encode(bytes.fromhex(raw),key)) for raw in rows)
with socket.socket() as server:
 server.settimeout(12);server.bind(('127.0.0.1',0));server.listen(1);print(json.dumps(dict(port=server.getsockname()[1])),flush=True)
 connection,_=server.accept()
 with connection:
  connection.settimeout(12)
  def exact(n):
   out=b''
   while len(out)<n:
    part=connection.recv(n-len(out))
    if not part:raise ValueError('Short original request')
    out+=part
   return out
  def request():
   header=exact(4);assert header[:2]==b'\xaf\xef';n=struct.unpack('<H',header[2:])[0];assert 0<n<=32767;raw=exact(n);assert exact(2)==b'\xef\xaf';return wire.payload_decode(raw,key)
  initial=wire.frame(bytes.fromhex(v['bootstrap']['payloadHex']));connection.sendall(initial[:3]);connection.sendall(initial[3:])
  assert request()==wire.payload_decode(bytes.fromhex(v['authFrameHex'])[4:-2],key);connection.sendall(bytes.fromhex(v['authReplyFrameHex']))
  assert request()==bytes.fromhex(v['flow']['requests']['list']['plainHex'])
  if mode=='unavailable':
   connection.sendall(bytes.fromhex(v['flow']['replies']['listUnavailable']['frameHex']));assert connection.recv(1)==b'';entered=False;count=0
  else:
   data=bytes.fromhex(v['flow']['replies']['category']['frameHex'])+bytes.fromhex(v['flow']['replies']['list']['frameHex'])
   if mode=='duplicate':data+=bytes.fromhex(v['flow']['replies']['listEmpty']['frameHex'])
   connection.sendall(data[:11]);connection.sendall(data[11:])
   assert request()==bytes.fromhex(v['flow']['requests']['enter'+str(slot)]['plainHex']);entered=True
   if mode=='cancel':
    assert sys.stdin.readline().strip()=='release';connection.sendall(bytes.fromhex(v['flow']['replies']['entered']['frameHex']));assert sys.stdin.readline().strip()=='release';count=0
    try:connection.shutdown(socket.SHUT_WR)
    except OSError:pass
   elif mode=='denied':
    connection.sendall(bytes.fromhex(v['flow']['replies']['entryDenied']['frameHex']));assert connection.recv(1)==b'';count=0
   else:
    p=scene['protocol'];data=bytes.fromhex(v['flow']['replies']['entered']['frameHex'])+encoded(p['beforePlainHex']);at=0
    for n in [1,2,5,13,31,73,len(data)]:
     connection.sendall(data[at:at+n]);at+=n
     if at>=len(data):break
    count=0
    for expected in p['requestPlainHex']:assert request()==bytes.fromhex(expected);count+=1
    connection.sendall(encoded(p['afterPlainHex']));connection.shutdown(socket.SHUT_WR)
  print(json.dumps(dict(authentication_verified=True,list_request_verified=True,entry_request_verified=entered,selected_slot=slot if entered else None,mode=mode,movement_requests_verified=count,total_client_requests=2+int(entered)+count,official_session=False)),flush=True)
