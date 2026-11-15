"""Independent original byte peer. All network I/O uses an ephemeral OS loopback socket."""
from pathlib import Path
import importlib.util,json,socket,struct,sys
A=Path(__file__).resolve().parent
s=importlib.util.spec_from_file_location('wire',A.parent/'game-legacy-message-v1/generate_vectors.py');wire=importlib.util.module_from_spec(s);s.loader.exec_module(wire)
load=lambda n:json.loads((A.parent/n/'original-vectors.json').read_text())
old=load('game-post-login-v1');options=load('game-character-options-v1');scene=load('game-input-runtime-v1');battle=load('game-battle-transition-v1');catalog=json.loads((A.parent/'game-legacy-message-v1/dispatch-catalog.json').read_text());mode=sys.argv[1]
assert mode in ['rounds','coalesced','wrap','end','unsupported','pause-M','reentry-M','close-M','body-queue']
entry=next(r for r in catalog['incoming']if r['consumer']=='0x4f3430');receive=next(r for r in catalog['incoming']if r['consumer']=='0x4f36d0');send=next(r for r in catalog['outgoing']if r['producer']=='0x4f88f0');flow=options['flows'][1];key=bytes.fromhex(old['bootstrap']['keyHex']);initial=0xffffffff if mode=='wrap'else 0
encoded=lambda raw:wire.frame(wire.payload_encode(raw,key))
chars='C|0|0|Original|186AA|0|1|1E|1E|A|A|0|0|0|A|Other|186AA|0|1|1E|1E|A|A|0|0|0|'
motion={'coalesced':'M|ACT|0|ACT|0|','body-queue':'M|PNO|0|','end':'M|END|','unsupported':'M|SKL|0|7|0|0|A|0|A|FF|'}.get(mode,'M|ACT|0|')
def data(round,first=True):return b''.join(encoded(wire.message(receive,[t.encode()]))for t in ['P|0|10|0|0|0|0|',chars,f'A|{0 if first else 1024:X}|{round:X}|',motion if first else 'M|ACT|0|ACT|A|'])
with socket.socket()as server:
 server.settimeout(25);server.bind(('127.0.0.1',0));server.listen(1);print(json.dumps(dict(port=server.getsockname()[1])),flush=True);connection,_=server.accept()
 with connection:
  connection.settimeout(25);startup=0;actions=[];packets=0
  def exact(n):
   b=b''
   while len(b)<n:
    x=connection.recv(n-len(b));assert x,'unexpected EOF';b+=x
   return b
  def request(raw):
   h=exact(4);assert h[:2]==b'\xaf\xef';n=struct.unpack('<H',h[2:])[0];assert 0<n<=32767;b=exact(n);assert exact(2)==b'\xef\xaf';assert wire.payload_decode(b,key)==raw
  def boot(raw):
   global startup
   request(raw);startup+=1
  def guard():request(wire.message(send,[b'G']));actions.append('G')
  def wait(name):assert sys.stdin.readline().strip()==name
  def stage(name):print(json.dumps(dict(stage=name)),flush=True)
  connection.sendall(wire.frame(bytes.fromhex(old['bootstrap']['payloadHex'])));boot(wire.payload_decode(bytes.fromhex(old['authFrameHex'])[4:-2],key));connection.sendall(bytes.fromhex(old['authReplyFrameHex']));boot(bytes.fromhex(old['flow']['requests']['list']['plainHex']));connection.sendall(bytes.fromhex(options['wire']['category5']['frameHex']+flow['initial']['frameHex']));boot(bytes.fromhex(options['wire']['request']['plainHex']));connection.sendall(bytes.fromhex(options['wire']['accepted']['frameHex']));boot(bytes.fromhex(old['flow']['requests']['list']['plainHex']));connection.sendall(bytes.fromhex(options['wire']['category8']['frameHex']+flow['initial']['frameHex']));boot(bytes.fromhex(flow['entry']['plainHex']));connection.sendall(bytes.fromhex(old['flow']['replies']['entered']['frameHex'])+b''.join(encoded(bytes.fromhex(p))for p in scene['protocol']['beforePlainHex']));stage('initial-sent')
  wait('entry');connection.sendall(encoded(wire.message(entry,battle['flow']['entry'])));packets+=1;stage('entry-sent');wait('data');b=data(initial);connection.sendall(b[:3]);connection.sendall(b[3:]);packets+=4;stage('data-sent');guard();stage('action-1')
  if mode=='reentry-M':
   wait('reentry');connection.sendall(encoded(wire.message(entry,battle['flow']['entry']))+data(initial));packets+=5;stage('reentry-sent');guard();stage('action-2')
  elif mode in ['rounds','coalesced','wrap','pause-M','body-queue']:
   wait('next');connection.sendall(data((initial+1)&0xffffffff,False));packets+=4;stage('round-2-sent');guard();stage('action-2')
  if mode in ['rounds','coalesced','wrap','pause-M','reentry-M','body-queue']:
   wait('finish');connection.sendall(encoded(wire.message(receive,[b'C|20|'])));packets+=1;stage('end-sent')
  wait('release');stage('released');assert connection.recv(1)==b'','unexpected duplicate input or invented exit request'
  print(json.dumps(dict(mode=mode,normal_startup_requests_verified=startup,commands_verified=actions,action_tag=send['tag'],battle_packets=packets,no_duplicate_or_invented_actions=True,official_session=False,original_execution=False)),flush=True)
