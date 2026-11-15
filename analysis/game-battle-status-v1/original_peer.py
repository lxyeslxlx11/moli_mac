"""Independent original PSN byte peer on an ephemeral local OS socket."""
from pathlib import Path
import importlib.util, json, socket, struct, sys
A=Path(__file__).resolve().parent
spec=importlib.util.spec_from_file_location('status_wire',A.parent/'game-legacy-message-v1/generate_vectors.py');wire=importlib.util.module_from_spec(spec);spec.loader.exec_module(wire)
load=lambda name:json.loads((A.parent/name/'original-vectors.json').read_text())
old,options,scene,battle=(load(n)for n in ['game-post-login-v1','game-character-options-v1','game-input-runtime-v1','game-battle-transition-v1'])
catalog=json.loads((A.parent/'game-legacy-message-v1/dispatch-catalog.json').read_text());mode=sys.argv[1]
assert mode in ['damage','heal','MP','KO','chain','feedback','pause-result','read-fail','unsupported','reentry-result','close-result']
entry=next(r for r in catalog['incoming']if r['consumer']=='0x4f3430');receive=next(r for r in catalog['incoming']if r['consumer']=='0x4f36d0');send=next(r for r in catalog['outgoing']if r['producer']=='0x4f88f0');exit_send=next(r for r in catalog['outgoing']if r['producer']=='0x4f67f0')
flow=options['flows'][1];key=bytes.fromhex(old['bootstrap']['keyHex']);hexword=lambda n:f'{n&0xffffffff:X}'
encoded=lambda raw:wire.frame(wire.payload_encode(raw,key))
def characters(values):return 'C|0|'+''.join(f'{slot:X}|Original|{100020:X}|0|1|'+''.join(hexword(n)+'|'for n in numbers)+'0|0|0|'for slot,numbers in zip([0,10],values))
initial=[[70,100,10,10],[100,100,10,10]]
def psn(selector,level,slot,flags,amount):return 'PSN|'+'|'.join(hexword(n)for n in [selector,level,slot,flags,amount])+'|'
heal_mode=mode in ['heal','pause-result','read-fail','reentry-result','close-result']
motion='M|'+(psn(1,9,0,0,12)if heal_mode else psn(2,0,0,0,4)if mode=='MP'else psn(0,0,10,32,1)if mode=='KO'else psn(3,0,10,0,12)if mode=='unsupported'else psn(0,0,0,0,12)+psn(1,9,0,0,12)+psn(2,0,0,0,4)if mode=='chain'else psn(0,0,10,0,12))
def data():return b''.join(encoded(wire.message(receive,[text.encode()]))for text in ['P|0|10|0|0|0|0|',characters(initial),'A|0|0|',motion])
with socket.socket()as server:
 server.settimeout(25);server.bind(('127.0.0.1',0));server.listen(1);print(json.dumps(dict(port=server.getsockname()[1])),flush=True);connection,_=server.accept()
 with connection:
  connection.settimeout(25);startup=0;actions=[];exit_requests=movement_requests=0
  def exact(n):
   result=b''
   while len(result)<n:
    block=connection.recv(n-len(result));assert block,'unexpected EOF';result+=block
   return result
  def request(plain):
   header=exact(4);assert header[:2]==b'\xaf\xef';n=struct.unpack('<H',header[2:])[0];assert 0<n<=32767
   payload=exact(n);assert exact(2)==b'\xef\xaf';assert wire.payload_decode(payload,key)==plain
  def boot(plain):
   global startup
   request(plain);startup+=1
  def wait(name):assert sys.stdin.readline().strip()==name
  def stage(name):print(json.dumps(dict(stage=name)),flush=True)
  connection.sendall(wire.frame(bytes.fromhex(old['bootstrap']['payloadHex'])));boot(wire.payload_decode(bytes.fromhex(old['authFrameHex'])[4:-2],key));connection.sendall(bytes.fromhex(old['authReplyFrameHex']));boot(bytes.fromhex(old['flow']['requests']['list']['plainHex']));connection.sendall(bytes.fromhex(options['wire']['category5']['frameHex']+flow['initial']['frameHex']));boot(bytes.fromhex(options['wire']['request']['plainHex']));connection.sendall(bytes.fromhex(options['wire']['accepted']['frameHex']));boot(bytes.fromhex(old['flow']['requests']['list']['plainHex']));connection.sendall(bytes.fromhex(options['wire']['category8']['frameHex']+flow['initial']['frameHex']));boot(bytes.fromhex(flow['entry']['plainHex']));connection.sendall(bytes.fromhex(old['flow']['replies']['entered']['frameHex'])+b''.join(encoded(bytes.fromhex(p))for p in scene['protocol']['beforePlainHex']));stage('initial-sent')
  def enter():
   connection.sendall(encoded(wire.message(entry,battle['flow']['entry']))+data());stage('entry-sent')
   request(wire.message(send,[b'H|A']));actions.append('H|A');stage('attack-verified')
  wait('entry');enter()
  if mode=='reentry-result':wait('reentry');enter()
  if mode=='feedback':
   wait('feedback');connection.sendall(b''.join(encoded(wire.message(receive,[text.encode()]))for text in [characters([[61,100,7,10],[63,100,5,10]]),'A|0|1|','M|'+psn(2,0,10,0,4)]));stage('feedback-sent')
   request(wire.message(send,[b'H|A']));actions.append('H|A');stage('attack-verified')
  if mode not in ['read-fail','unsupported','close-result']:
   wait('finish');connection.sendall(encoded(wire.message(receive,[b'C|20|'])));stage('finish-sent');request(wire.message(exit_send,[0]));exit_requests+=1;stage('exit-verified')
   wait('move')
   for plain in scene['protocol']['requestPlainHex']:request(bytes.fromhex(plain));movement_requests+=1
   stage('moves-verified')
  wait('release');stage('released');assert connection.recv(1)==b'','unexpected duplicate action/exit/movement'
  print(json.dumps(dict(mode=mode,normal_startup_requests_verified=startup,commands_verified=actions,exit_requests_verified=exit_requests,movement_requests_verified=movement_requests,no_duplicate_or_invented_actions=True,official_session=False,original_execution=False)),flush=True)
