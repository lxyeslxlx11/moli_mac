#!/usr/bin/env python3
"""Independent byte peer: actual OS loopback, original startup and source $T5 commands."""
from pathlib import Path
import importlib.util,json,socket,struct,sys
A=Path(__file__).resolve().parent
spec=importlib.util.spec_from_file_location('wire',A.parent/'game-legacy-message-v1/generate_vectors.py');wire=importlib.util.module_from_spec(spec);spec.loader.exec_module(wire)
load=lambda n:json.loads((A.parent/n/'original-vectors.json').read_text())
vectors=load('game-battle-input-v1');old=load('game-post-login-v1');options=load('game-character-options-v1');scene=load('game-input-runtime-v1');battle=load('game-battle-transition-v1');catalog=json.loads((A.parent/'game-legacy-message-v1/dispatch-catalog.json').read_text());mode=sys.argv[1]
name={'pause-send':'single-guard','reentry':'single-guard','send-fail':'single-guard'}.get(mode,mode);case=next(r for r in vectors['scenarios']if r['name']==name);expected=[s for f in case['frames']for s in f['expected']['requests']];expected=expected*2 if mode=='reentry'else []if mode=='send-fail'else expected
entry=next(r for r in catalog['incoming']if r['consumer']=='0x4f3430');receive=next(r for r in catalog['incoming']if r['consumer']=='0x4f36d0');send=next(r for r in catalog['outgoing']if r['producer']=='0x4f88f0');flow=options['flows'][1];key=bytes.fromhex(old['bootstrap']['keyHex'])
def encoded(raw):return wire.frame(wire.payload_encode(raw,key))
with socket.socket()as server:
 server.settimeout(25);server.bind(('127.0.0.1',0));server.listen(1);print(json.dumps(dict(port=server.getsockname()[1])),flush=True);connection,_=server.accept()
 with connection:
  connection.settimeout(25);startup=0;actual=[]
  def exact(n):
   data=b''
   while len(data)<n:
    b=connection.recv(n-len(data));assert b,'unexpected EOF';data+=b
   return data
  def request(raw):
   h=exact(4);assert h[:2]==b'\xaf\xef';n=struct.unpack('<H',h[2:])[0];assert 0<n<=32767;body=exact(n);assert exact(2)==b'\xef\xaf';assert wire.payload_decode(body,key)==raw
  def boot(raw):
   global startup
   request(raw);startup+=1
  def wait(name):assert sys.stdin.readline().strip()==name
  def stage(name):print(json.dumps(dict(stage=name)),flush=True)
  connection.sendall(wire.frame(bytes.fromhex(old['bootstrap']['payloadHex'])));boot(wire.payload_decode(bytes.fromhex(old['authFrameHex'])[4:-2],key));connection.sendall(bytes.fromhex(old['authReplyFrameHex']));boot(bytes.fromhex(old['flow']['requests']['list']['plainHex']));connection.sendall(bytes.fromhex(options['wire']['category5']['frameHex']+flow['initial']['frameHex']));boot(bytes.fromhex(options['wire']['request']['plainHex']));connection.sendall(bytes.fromhex(options['wire']['accepted']['frameHex']));boot(bytes.fromhex(old['flow']['requests']['list']['plainHex']));connection.sendall(bytes.fromhex(options['wire']['category8']['frameHex']+flow['initial']['frameHex']));boot(bytes.fromhex(flow['entry']['plainHex']));connection.sendall(bytes.fromhex(old['flow']['replies']['entered']['frameHex'])+b''.join(encoded(bytes.fromhex(p))for p in scene['protocol']['beforePlainHex']));stage('initial-sent')
  wait('entry');connection.sendall(encoded(wire.message(entry,battle['flow']['entry'])));stage('entry-sent')
  wait('data');chars='C|0|0|Original|186AA|0|1|1E|1E|A|A|0|0|0|A|Other|186AA|0|1|1E|1E|A|A|0|0|0|'
  packets=['P|0|'+format(case['controlFlags'],'X')+'|0|0|0|0|',chars,'A|0|0|','M|END|'];data=b''.join(encoded(wire.message(receive,[s.encode('ascii')]))for s in packets);connection.sendall(data[:3]);connection.sendall(data[3:]);stage('data-sent')
  first=len(expected)//2 if mode=='reentry'else len(expected)
  for index,text in enumerate(expected):
   if mode=='reentry'and index==first:
    stage('first-actions');wait('reentry');connection.sendall(encoded(wire.message(entry,battle['flow']['entry']))+data);stage('reentry-sent')
   request(wire.message(send,[text.encode('ascii')]));actual.append(text)
  stage('actions-verified')
  if mode!='send-fail':wait('end');connection.sendall(encoded(wire.message(receive,[battle['flow']['end'].encode('ascii')])));stage('end-sent')
  wait('release');stage('released');assert connection.recv(1)==b'','unexpected duplicate action or other outgoing byte'
  print(json.dumps(dict(mode=mode,normal_startup_requests_verified=startup,commands_verified=actual,action_tag=send['tag'],source_battle_packets=11 if mode=='reentry'else 5 if mode=='send-fail'else 6,no_duplicate_or_invented_actions=True,official_session=False,original_execution=False)),flush=True)
