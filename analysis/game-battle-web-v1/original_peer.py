"""Independent original byte peer. All network I/O uses an ephemeral OS loopback socket."""
from pathlib import Path
import importlib.util,json,socket,struct,sys
A=Path(__file__).resolve().parent
s=importlib.util.spec_from_file_location('wire',A.parent/'game-legacy-message-v1/generate_vectors.py');wire=importlib.util.module_from_spec(s);s.loader.exec_module(wire)
load=lambda n:json.loads((A.parent/n/'original-vectors.json').read_text())
old=load('game-post-login-v1');options=load('game-character-options-v1');scene=load('game-input-runtime-v1');battle=load('game-battle-transition-v1');catalog=json.loads((A.parent/'game-legacy-message-v1/dispatch-catalog.json').read_text());mode=sys.argv[1]
assert mode in ['guard-stop','missing-cell','guard','escape','position','bad-pixels','baseline','normal','feedback','critical','dodge','KO','pre-impact','MP-clamp','repeat-hit','counter','pause-hit','read-fail','unsupported','reentry-hit','close-hit']
rows=load('game-battle-skill-v1')['traces'];row=next(r for r in rows if r['name']==(mode if mode in [r['name']for r in rows]else 'normal'))
hexword=lambda n:f'{n&0xffffffff:X}'
entry=next(r for r in catalog['incoming']if r['consumer']=='0x4f3430');receive=next(r for r in catalog['incoming']if r['consumer']=='0x4f36d0');send=next(r for r in catalog['outgoing']if r['producer']=='0x4f88f0');flow=options['flows'][1];key=bytes.fromhex(old['bootstrap']['keyHex']);initial=0
encoded=lambda raw:wire.frame(wire.payload_encode(raw,key))
resource=hexword(row['resource']);chars='C|0|'+''.join(f'{slot:X}|Original|{resource}|0|1|64|64|A|A|0|0|0|'for slot in [0,10])
motion='M|SKL|'+'|'.join(hexword(n)for n in [(500 if mode=='unsupported'else row['category']*100+row['level']),row['cost'],0,*[n for h in row['hits']for n in h],255])+'|'
if mode in ['guard-stop','guard','position']:motion='M|ACT|0|'
if mode=='escape':motion='M|ESC|0|1|'
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

  def enter():
   connection.sendall(encoded(wire.message(entry,battle['flow']['entry']))+data());stage('entry-sent')
   action={'guard-stop':b'G','guard':b'G','escape':b'E','position':b'P'}.get(mode,b'H|A');request(wire.message(send,[action]));actions.append(action.decode());stage('attack-verified')
  wait('entry')
  if mode=='baseline':connection.sendall(encoded(wire.message(entry,battle['flow']['entry']))+data());stage('entry-sent')
  else:enter()
  if mode=='reentry-hit':wait('reentry');enter()
  if mode=='feedback':
   wait('feedback');next_chars=chars.replace('|64|64|A|A|','|64|64|7|A|',1);at=next_chars.index('A|Original|');next_chars=next_chars[:at]+next_chars[at:].replace('|64|64|A|A|','|58|64|A|A|',1);connection.sendall(b''.join(encoded(wire.message(receive,[t.encode()]))for t in [next_chars,'A|0|1|',motion]));stage('feedback-sent');request(wire.message(send,[b'H|A']));actions.append('H|A');stage('attack-verified')
  if mode not in ['guard-stop','baseline','bad-pixels','unsupported','read-fail','close-hit']:
   wait('finish');connection.sendall(encoded(wire.message(receive,[b'C|20|'])));stage('finish-sent')
   request(wire.message(exit_send,[0]));exit_requests+=1
   position=next(r for r in catalog['incoming']if r['consumer']=='0x4ef840')
   if mode=='missing-cell':connection.sendall(encoded(wire.message(position,[-1,3,4])))
   stage('exit-verified')
   if mode=='missing-cell':wait('valid-position');connection.sendall(encoded(wire.message(position,[2,3,4])));stage('valid-position-sent')
   wait('move')
   for expected in scene['protocol']['requestPlainHex']:request(bytes.fromhex(expected));movement_requests+=1
   stage('moves-verified')
  wait('release');stage('released');assert connection.recv(1)==b'','unexpected duplicate input/exit/movement'
  print(json.dumps(dict(mode=mode,normal_startup_requests_verified=startup,commands_verified=actions,exit_requests_verified=exit_requests,movement_requests_verified=movement_requests,no_duplicate_or_invented_actions=True,official_session=False,original_execution=False)),flush=True)
