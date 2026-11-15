"""Independent original POS/EQU/mixed byte peer; ephemeral OS loopback only."""
from pathlib import Path
import importlib.util,json,socket,struct,sys
A=Path(__file__).resolve().parent
spec=importlib.util.spec_from_file_location('change_wire',A.parent/'game-legacy-message-v1/generate_vectors.py');wire=importlib.util.module_from_spec(spec);spec.loader.exec_module(wire)
load=lambda n:json.loads((A.parent/n/'original-vectors.json').read_text())
old,options,scene,battle=(load(n)for n in ['game-post-login-v1','game-character-options-v1','game-input-runtime-v1','game-battle-transition-v1']);catalog=json.loads((A.parent/'game-legacy-message-v1/dispatch-catalog.json').read_text());mode=sys.argv[1]
assert mode in ['position','position-single','position-return','equipment','mixed','feedback','P-gate','pause-position','read-fail','reentry-position','close-position','unsupported']
entry=next(r for r in catalog['incoming']if r['consumer']=='0x4f3430');receive=next(r for r in catalog['incoming']if r['consumer']=='0x4f36d0');send=next(r for r in catalog['outgoing']if r['producer']=='0x4f88f0');exit_send=next(r for r in catalog['outgoing']if r['producer']=='0x4f67f0');key=bytes.fromhex(old['bootstrap']['keyHex']);flow=options['flows'][1]
hexword=lambda n:f'{n&0xffffffff:X}';encoded=lambda raw:wire.frame(wire.payload_encode(raw,key))
def characters(next_round=False):
 rows=[(0,'Partner',80,9,100021),(5,'Hero',60,7,100020),(10,'Enemy',100,10,100020)]if next_round else[(0,'Hero',70,10,100020),(5,'Partner',80,9,100021),(10,'Enemy',100,10,100020)]
 if mode=='position-single':rows=[r for r in rows if r[0]!=5]
 return 'C|0|'+''.join(f'{slot:X}|{name}|'+''.join(hexword(n)+'|'for n in [resource,100021 if name=='Hero'else 0,1,hp,100,mp,10,1,0,0])for slot,name,hp,mp,resource in rows)
def equip(slot):return 'EQU|'+'|'.join(hexword(n)for n in [slot,100030,100031])+'|'
motion='M|'+(equip(0)if mode=='equipment'else 'SKL|0|3|0|0|A|1|C|FF|PSN|0|0|A|0|1|'if mode=='mixed'else 'ITM|9|'if mode=='unsupported'else'POS|0|POS|5|'if mode=='position-return'else'POS|0|')
first_action=b'G'if mode=='equipment'else b'H|A'if mode in ['mixed','unsupported']else b'P'
with socket.socket()as server:
 server.settimeout(25);server.bind(('127.0.0.1',0));server.listen(1);print(json.dumps(dict(port=server.getsockname()[1])),flush=True);connection,_=server.accept()
 with connection:
  connection.settimeout(25);startup=0;actions=[];exit_requests=movement_requests=0
  def exact(n):
   b=b''
   while len(b)<n:
    p=connection.recv(n-len(b));assert p,'unexpected EOF';b+=p
   return b
  def request(plain):
   h=exact(4);assert h[:2]==b'\xaf\xef';n=struct.unpack('<H',h[2:])[0];assert 0<n<=32767;b=exact(n);assert exact(2)==b'\xef\xaf';assert wire.payload_decode(b,key)==plain
  def boot(plain):
   global startup
   request(plain);startup+=1
  def stage(name):print(json.dumps(dict(stage=name)),flush=True)
  def wait(name):assert sys.stdin.readline().strip()==name
  def data(texts):connection.sendall(b''.join(encoded(wire.message(receive,[t.encode()]))for t in texts))
  connection.sendall(wire.frame(bytes.fromhex(old['bootstrap']['payloadHex'])));boot(wire.payload_decode(bytes.fromhex(old['authFrameHex'])[4:-2],key));connection.sendall(bytes.fromhex(old['authReplyFrameHex']));boot(bytes.fromhex(old['flow']['requests']['list']['plainHex']));connection.sendall(bytes.fromhex(options['wire']['category5']['frameHex']+flow['initial']['frameHex']));boot(bytes.fromhex(options['wire']['request']['plainHex']));connection.sendall(bytes.fromhex(options['wire']['accepted']['frameHex']));boot(bytes.fromhex(old['flow']['requests']['list']['plainHex']));connection.sendall(bytes.fromhex(options['wire']['category8']['frameHex']+flow['initial']['frameHex']));boot(bytes.fromhex(flow['entry']['plainHex']));connection.sendall(bytes.fromhex(old['flow']['replies']['entered']['frameHex'])+b''.join(encoded(bytes.fromhex(p))for p in scene['protocol']['beforePlainHex']));stage('initial-sent')
  def enter():
   connection.sendall(encoded(wire.message(entry,battle['flow']['entry'])));data(['P|0|10|0|0|0|0|',characters(),'A|0|0|',motion]);stage('entry-sent');request(wire.message(send,[first_action]));actions.append(first_action.decode());stage('action-verified')
  wait('entry');enter()
  if mode=='reentry-position':wait('reentry');enter()
  if mode in ['feedback','P-gate']:
   if mode=='P-gate':
    wait('parameter-five');data(['P|5|10|0|0|0|0|']);stage('parameter-five-sent');wait('parameter-zero');data(['P|0|10|0|0|0|0|']);stage('parameter-zero-sent')
   wait('feedback');data((['P|5|10|0|0|0|0|']if mode=='feedback'else[])+[characters(True),'A|0|1|','M|'+equip(5 if mode=='feedback'else 0)]);stage('feedback-sent');request(wire.message(send,[b'H|A']));actions.append('H|A');stage('action-verified')
  if mode not in ['read-fail','close-position','unsupported']:
   wait('finish');data(['C|20|']);stage('finish-sent');request(wire.message(exit_send,[0]));exit_requests+=1;stage('exit-verified');wait('move')
   for plain in scene['protocol']['requestPlainHex']:request(bytes.fromhex(plain));movement_requests+=1
   stage('moves-verified')
  wait('release');stage('released');assert connection.recv(1)==b'','unexpected duplicate action/exit/movement'
  print(json.dumps(dict(mode=mode,normal_startup_requests_verified=startup,commands_verified=actions,exit_requests_verified=exit_requests,movement_requests_verified=movement_requests,no_duplicate_or_invented_actions=True,official_session=False,original_execution=False)),flush=True)
