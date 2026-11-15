#!/usr/bin/env python3
"""Original independent source battle receive peer. OS loopback only, no game execution."""
from pathlib import Path
import importlib.util,json,socket,struct,sys
A=Path(__file__).resolve().parent
spec=importlib.util.spec_from_file_location('wire',A.parent/'game-legacy-message-v1/generate_vectors.py');wire=importlib.util.module_from_spec(spec);spec.loader.exec_module(wire)
v=json.load(open(A.parent/'game-battle-transition-v1/original-vectors.json'));options=json.load(open(A.parent/'game-character-options-v1/original-vectors.json'));old=json.load(open(A.parent/'game-post-login-v1/original-vectors.json'));scene=json.load(open(A.parent/'game-input-runtime-v1/original-vectors.json'));catalog=json.load(open(A.parent/'game-legacy-message-v1/dispatch-catalog.json'));flow=options['flows'][1];key=bytes.fromhex(old['bootstrap']['keyHex']);mode=sys.argv[1];assert mode in['queues','end','eof']
motion={'queues':'M|ANR|0|PUE|0|ANR|A|END|','end':'M|END|','eof':'M|'}[mode].encode().hex()
entry=next(r for r in catalog['incoming']if r['consumer']=='0x4f3430');command=next(r for r in catalog['incoming']if r['consumer']=='0x4f36d0')
def encoded(raw):return wire.frame(wire.payload_encode(raw,key))
with socket.socket()as server:
 server.settimeout(25);server.bind(('127.0.0.1',0));server.listen(1);print(json.dumps(dict(port=server.getsockname()[1])),flush=True);connection,_=server.accept()
 with connection:
  connection.settimeout(25);requests=0
  def exact(n):
   out=b''
   while len(out)<n:
    b=connection.recv(n-len(out));assert b,'unexpected EOF';out+=b
   return out
  def request(expected):
   global requests
   header=exact(4);assert header[:2]==b'\xaf\xef';n=struct.unpack('<H',header[2:])[0];assert 0<n<=32767;raw=exact(n);assert exact(2)==b'\xef\xaf';assert wire.payload_decode(raw,key)==expected;requests+=1
  def wait(name):assert sys.stdin.readline().strip()==name
  def stage(name):print(json.dumps(dict(stage=name,mode=mode)),flush=True)
  connection.sendall(wire.frame(bytes.fromhex(old['bootstrap']['payloadHex'])));request(wire.payload_decode(bytes.fromhex(old['authFrameHex'])[4:-2],key));connection.sendall(bytes.fromhex(old['authReplyFrameHex']));request(bytes.fromhex(old['flow']['requests']['list']['plainHex']));connection.sendall(bytes.fromhex(options['wire']['category5']['frameHex']+flow['initial']['frameHex']));request(bytes.fromhex(options['wire']['request']['plainHex']));connection.sendall(bytes.fromhex(options['wire']['accepted']['frameHex']));request(bytes.fromhex(old['flow']['requests']['list']['plainHex']));connection.sendall(bytes.fromhex(options['wire']['category8']['frameHex']+flow['initial']['frameHex']));request(bytes.fromhex(flow['entry']['plainHex']));connection.sendall(bytes.fromhex(old['flow']['replies']['entered']['frameHex'])+b''.join(encoded(bytes.fromhex(p))for p in scene['protocol']['beforePlainHex']));stage('initial-sent')
  wait('entry');connection.sendall(encoded(wire.message(entry,v['flow']['entry'])));stage('entry-sent')
  wait('data');data=[v['flow'][k]for k in['parameters','characters','acknowledgment']]+[bytes.fromhex(motion).decode('latin1')]
  raw=b''.join(encoded(wire.message(command,[p.encode('latin1')]))for p in data);connection.sendall(raw[:3]);connection.sendall(raw[3:]);stage('data-sent')
  wait('end');connection.sendall(encoded(wire.message(command,[v['flow']['end'].encode('latin1')])));stage('end-sent')
  wait('release');stage('released');assert connection.recv(1)==b'';print(json.dumps(dict(mode=mode,normal_startup_requests_verified=requests,source_battle_packets=2+len(data),character_packets=1,no_invented_action_requests=True,official_session=False)),flush=True)
