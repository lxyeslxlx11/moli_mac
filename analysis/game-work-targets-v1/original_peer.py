#!/usr/bin/env python3
"""Original localhost normal work peer with byte-for-byte expected requests."""
import importlib.util,json,socket,struct,sys
from pathlib import Path
ROOT=Path(__file__).resolve().parents[2]
def read(path):return json.loads((ROOT/path).read_text())
spec=importlib.util.spec_from_file_location('wire',ROOT/'analysis/game-legacy-message-v1/generate_vectors.py')
wire=importlib.util.module_from_spec(spec);spec.loader.exec_module(wire)
old=read('analysis/game-post-login-v1/original-vectors.json');options=read('analysis/game-character-options-v1/original-vectors.json')
fixture=json.loads(Path(sys.argv[1]).read_text());flow=options['flows'][int(sys.argv[2])];key=bytes.fromhex(old['bootstrap']['keyHex']);count=0
def signal(name):print(json.dumps({'stage':name}),flush=True)
def release(name):assert sys.stdin.readline().strip()==name
with socket.socket() as server:
 server.settimeout(45);server.bind(('127.0.0.1',0));server.listen(1);print(json.dumps({'port':server.getsockname()[1]}),flush=True)
 connection,_=server.accept()
 with connection:
  connection.settimeout(45)
  def exact(n):
   out=b''
   while len(out)<n:
    part=connection.recv(n-len(out));assert part,'client closed before expected request';out+=part
   return out
  def request():
   global count
   header=exact(4);assert header[:2]==b'\xaf\xef';length=struct.unpack('<H',header[2:])[0];assert 0<length<=32767
   payload=exact(length);assert exact(2)==b'\xef\xaf';data=wire.payload_decode(payload,key)
   if data==b'3$} nr ':return request()
   count+=1;return data
  def expect(value):
   got=request();assert got==value,(count,got,value)
  def send(*names):connection.sendall(b''.join(wire.frame(wire.payload_encode(bytes.fromhex(fixture[n]),key)) for n in names))
  connection.sendall(wire.frame(bytes.fromhex(old['bootstrap']['payloadHex'])))
  expect(wire.payload_decode(bytes.fromhex(old['authFrameHex'])[4:-2],key));connection.sendall(bytes.fromhex(old['authReplyFrameHex']))
  expect(bytes.fromhex(old['flow']['requests']['list']['plainHex']));connection.sendall(bytes.fromhex(options['wire']['category5']['frameHex']+flow['initial']['frameHex']))
  expect(bytes.fromhex(options['wire']['request']['plainHex']));connection.sendall(bytes.fromhex(options['wire']['accepted']['frameHex']))
  expect(bytes.fromhex(old['flow']['requests']['list']['plainHex']));connection.sendall(bytes.fromhex(options['wire']['category8']['frameHex']+flow['initial']['frameHex']))
  expect(bytes.fromhex(flow['entry']['plainHex']));connection.sendall(bytes.fromhex(old['flow']['replies']['entered']['frameHex']))
  connection.sendall(b''.join(wire.frame(wire.payload_encode(bytes.fromhex(row),key)) for row in fixture['initial']));signal('ready')
  expect(b'*[c 0 ');send('people');expect(b':J@ 2 3 0 ');expect(b'+>L 0 1 0  ');send('disguiseResult');expect(b':J@ 2 3 0 ')
  expect(b'*[c 1 ');send('people');expect(b':J@ 2 3 0 ');expect(b'*^X 0 ');send('selfSubjects');expect(b'+>L 1 1 1  ');send('transformResult');expect(b':J@ 2 3 0 ')
  expect(b'*[c 2 ');send('people');expect(b':J@ 2 3 d ');expect(b'*^X 0 ');send('selfSubjects');expect(b'+>L 2 1 1  ');send('aidResult','lowMp');signal('aid-low-mp');release('restore-mp');send('restoreMp')
  expect(b'*[c 2 ');send('people');expect(b'*^X 1 ');send('subjects');expect(b'+>L 2 1 1  ');send('aidFailure');expect(b':J@ 2 3 0 ')
  expect(b'*[c 3 ');send('people');expect(b':J@ 2 3 d ');expect(b'*^X 1 ');send('subjects');expect(b'+>L 3 1 0  ');send('treatmentFailure')
  expect(b'*[c 3 ');send('people');expect(b'+>L 3 1 2  ');send('treatmentResult');expect(b':J@ 2 3 0 ')
  expect(b':J@ 2 3 5 ');expect(b'+>L 4 1 -1  ');send('gatherResult');signal('gather-success')
  expect(b'+>L 4 1 -1  ');signal('gather-second');release('paused');send('gatherFailure')
  expect(b':J@ 2 3 0 ')
  expect(b':J@ 2 3 7 ');expect(b':J@ 2 3 0 ')
  expect(b':J@ 2 3 6 ');expect(b':J@ 2 3 0 ')
  send('gatherResult','people','selfSubjects');signal('cancelled')
  assert connection.recv(1)==b'';assert count==37,count
  print(json.dumps(dict(stage=305,requests=count,twoStageTargets=True,petHoleOrdinal=True,allFourTargetModes=True,MPGuard=True,gatherRepeat=True,pause=True,threeGatherPoses=True,cancelled=True,sameConnection=True,officialSession=False)),flush=True)
