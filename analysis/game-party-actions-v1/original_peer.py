#!/usr/bin/env python3
"""Independent synthetic protocol peer, only OS loopback. No product modules."""
from pathlib import Path
import importlib.util,json,socket,struct,sys
A=Path(__file__).resolve().parent
spec=importlib.util.spec_from_file_location('wire',A.parent/'game-legacy-message-v1/generate_vectors.py');wire=importlib.util.module_from_spec(spec);spec.loader.exec_module(wire)
v=json.load(open(A/'original-vectors.json'));options=json.load(open(A.parent/'game-character-options-v1/original-vectors.json'));old=json.load(open(A.parent/'game-post-login-v1/original-vectors.json'));scene=json.load(open(A.parent/'game-input-runtime-v1/original-vectors.json'));flow=options['flows'][1];key=bytes.fromhex(old['bootstrap']['keyHex']);mode=sys.argv[1];assert mode in['full','actions']
def encoded(plain):return wire.frame(wire.payload_encode(plain.encode('latin1'),key))
with socket.socket()as server:
 server.settimeout(25);server.bind(('127.0.0.1',0));server.listen(1);print(json.dumps(dict(port=server.getsockname()[1])),flush=True);connection,_=server.accept()
 with connection:
  connection.settimeout(25);requests=[]
  def exact(n):
   out=b''
   while len(out)<n:
    b=connection.recv(n-len(out));assert b,'unexpected EOF';out+=b
   return out
  def request(expected):
   header=exact(4);assert header[:2]==b'\xaf\xef';n=struct.unpack('<H',header[2:])[0];assert 0<n<=32767;raw=exact(n);assert exact(2)==b'\xef\xaf';plain=wire.payload_decode(raw,key);assert plain==expected,(plain,expected);requests.append(plain.decode('latin1'))
  def wait(name):assert sys.stdin.readline().strip()==name
  def stage(name):print(json.dumps(dict(stage=name,mode=mode)),flush=True)
  connection.sendall(wire.frame(bytes.fromhex(old['bootstrap']['payloadHex'])));request(wire.payload_decode(bytes.fromhex(old['authFrameHex'])[4:-2],key));connection.sendall(bytes.fromhex(old['authReplyFrameHex']));request(bytes.fromhex(old['flow']['requests']['list']['plainHex']));connection.sendall(bytes.fromhex(options['wire']['category5']['frameHex']+flow['initial']['frameHex']));request(bytes.fromhex(options['wire']['request']['plainHex']));connection.sendall(bytes.fromhex(options['wire']['accepted']['frameHex']));request(bytes.fromhex(old['flow']['requests']['list']['plainHex']));connection.sendall(bytes.fromhex(options['wire']['category8']['frameHex']+flow['initial']['frameHex']));request(bytes.fromhex(flow['entry']['plainHex']))
  initial=v['full']['initial']if mode=='full'else['H#| 1|1C|2|3|4|100010|0|0|Hero|Guild|1|0|0|Tail|0|0| ','H#| 1|3e|2|4|0|100010|0|0|Other|Guild|0|0|0|Tail|0|0| ']
  rows=[bytes.fromhex(x).decode('latin1')for x in scene['protocol']['beforePlainHex']];rows=rows[:3]+initial+rows[4:];data=bytes.fromhex(old['flow']['replies']['entered']['frameHex'])+b''.join(encoded(x)for x in rows);at=0
  for size in[1,2,5,13,31,73,len(data)]:connection.sendall(data[at:at+size]);at+=size
  stage('initial-sent')
  if mode=='full':
   for index,e in enumerate(v['full']['events']):
    wait('event-'+str(index));connection.sendall(encoded(e['plain']))
    if e['plain']=='Kk0 0 1 ':request(b'/Re 2 3 4 ')
    stage('event-'+str(index)+'-sent')
  else:
   wait('join');request(b'*Cc 2 3 1 ');stage('join-received');wait('join-accept');connection.sendall(encoded('Kk0 1 1 '));stage('join-accepted');wait('members');connection.sendall(encoded('HFs 0 1|200|0|0|0|0|Other ')+encoded('HFs 1 1|100|0|0|0|0|Hero '));stage('members-sent');wait('leave');request(b'*Cc 2 3 0 ');stage('leave-received');wait('leave-accept');connection.sendall(encoded('Kk0 0 1 '));request(b'/Re 2 3 4 ');stage('leave-acknowledged')
  wait('release');stage('released');assert connection.recv(1)==b'';print(json.dumps(dict(mode=mode,authentication_verified=True,entry_verified=True,party_requests_verified=requests[5:],total_client_requests=len(requests),source_events=len(v['full']['events'])if mode=='full'else 3,official_session=False)),flush=True)
