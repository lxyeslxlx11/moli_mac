"""Independent original byte peer. All network I/O uses an ephemeral OS loopback socket."""
from pathlib import Path
import importlib.util,json,socket,struct,sys
A=Path(__file__).resolve().parent
s=importlib.util.spec_from_file_location('wire',A.parent/'game-legacy-message-v1/generate_vectors.py');wire=importlib.util.module_from_spec(s);s.loader.exec_module(wire)
load=lambda n:json.loads((A.parent/n/'original-vectors.json').read_text())
old=load('game-post-login-v1');options=load('game-character-options-v1');scene=load('game-input-runtime-v1');battle=load('game-battle-transition-v1');catalog=json.loads((A.parent/'game-legacy-message-v1/dispatch-catalog.json').read_text());mode=sys.argv[1]
assert mode in ['normal','new-own-unit','pause-rebuild','pause-activate','scene-fade','pending-cut','reentry-return','close-return','read-fail','clipped','missing-cell']
entry=next(r for r in catalog['incoming']if r['consumer']=='0x4f3430');receive=next(r for r in catalog['incoming']if r['consumer']=='0x4f36d0');send=next(r for r in catalog['outgoing']if r['producer']=='0x4f88f0');flow=options['flows'][1];key=bytes.fromhex(old['bootstrap']['keyHex']);initial=0
encoded=lambda raw:wire.frame(wire.payload_encode(raw,key))
chars='C|0|0|Original|186AA|0|1|1E|1E|A|A|0|0|0|A|Other|186AA|0|1|1E|1E|A|A|0|0|0|'
motion='M|END|'
exit_send=next(r for r in catalog['outgoing']if r['producer']=='0x4f67f0')
def data():return b''.join(encoded(wire.message(receive,[t.encode()]))for t in ['P|0|10|0|0|0|0|',chars,'A|0|0|',motion])
with socket.socket()as server:
 server.settimeout(25);server.bind(('127.0.0.1',0));server.listen(1);print(json.dumps(dict(port=server.getsockname()[1])),flush=True);connection,_=server.accept()
 with connection:
  connection.settimeout(25);startup=0;actions=[];packets=0;exit_requests=0;movement_requests=0;cycles=0;gates=0
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

  units=next(r for r in catalog['incoming']if r['consumer']=='0x4f16d0');act=next(r for r in catalog['incoming']if r['consumer']=='0x4f2010');remove=next(r for r in catalog['incoming']if r['consumer']=='0x4f2260');position=next(r for r in catalog['incoming']if r['consumer']=='0x4ef840')
  def msg(row,args):return encoded(wire.message(row,args))
  oldunit=b'1|3e|2|3|4|100001|77|8|Old|Guild|0|0|0|Tail|0|0|'
  fresh=b'1|3e|5|6|4|100001|77|8|Fresh|Guild|0|0|0|Tail|0|0|'
  wait('prepare');connection.sendall(msg(units,[oldunit])+msg(act,[b'3e|8|9|1|7|100|0|0,3e|0|0|60|0|100001|100001|0']));stage('prepared')
  def enter():
   global cycles,gates,exit_requests
   connection.sendall(msg(entry,battle['flow']['entry'])+data());stage('entry-sent');cycles+=1
   wait('gates');connection.sendall(msg(units,[b'1|3e|33554432|3|4|100001|77|8|Invalid|G|0|0|0|Tail|0|0|'])+msg(act,[b'3e|33554432|3|1|7|100|0|0'])+msg(remove,[b'zz']));gates+=2;stage('gates-sent')
   guard();stage('guard-verified');request(wire.message(exit_send,[0]));exit_requests+=1
   connection.sendall(msg(units,[fresh]));
   if mode=='new-own-unit':connection.sendall(msg(units,[b'1|1C|30|40|4|100001|77|8|Hero|Guild|0|0|0|Tail|0|0|']))
   stage('exit-verified')
  wait('entry');enter()
  if mode in ['scene-fade','pending-cut']:
   wait('scene');batch=[bytes.fromhex(x)for x in scene['protocol']['beforePlainHex']];batch[-1]=batch[-1].replace(b'g8,',b'ge,',1);connection.sendall(b''.join(encoded(x)for x in batch)+msg(units,[fresh]));stage('scene-sent')
  if mode=='missing-cell':
   wait('invalid-position');connection.sendall(msg(position,[-1,3,4]));stage('invalid-position-sent');wait('valid-position');connection.sendall(msg(position,[2,3,4]));stage('valid-position-sent')
  if mode=='reentry-return':wait('reentry');enter()
  if mode not in ['close-return','read-fail']:
   wait('move')
   for expected in scene['protocol']['requestPlainHex']:request(bytes.fromhex(expected));movement_requests+=1
   stage('moves-verified')
  wait('release');stage('released');assert connection.recv(1)==b'','unexpected duplicate command, exit or movement'
  print(json.dumps(dict(mode=mode,normal_startup_requests_verified=startup,commands_verified=actions,exit_requests_verified=exit_requests,exit_operation=exit_send['id'],exit_tag=exit_send['tag'],exit_arguments=[0],movement_requests_verified=movement_requests,battle_cycles=cycles,gated_messages_sent=gates,no_duplicate_or_invented_actions=True,official_session=False,original_execution=False)),flush=True)
