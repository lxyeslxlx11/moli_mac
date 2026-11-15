"""Independent original exact-byte OS TCP peer for normal M selection, received MON, nextC and ordinary return."""
from pathlib import Path
import importlib.util,json,socket,struct,sys
A=Path(__file__).resolve().parent
s=importlib.util.spec_from_file_location('pet_transition_wire',A.parent/'game-legacy-message-v1/generate_vectors.py');wire=importlib.util.module_from_spec(s);s.loader.exec_module(wire)
load=lambda n:json.loads((A.parent/n/'original-vectors.json').read_text())
old,options,scene,battle=(load(n)for n in['game-post-login-v1','game-character-options-v1','game-input-runtime-v1','game-battle-transition-v1']);pets=json.loads((A/'input-vectors.json').read_text())['scenes'][0]['records'];skills=load('game-battle-mounted-input-v1')['skillText'];catalog=json.loads((A.parent/'game-legacy-message-v1/dispatch-catalog.json').read_text());mode=sys.argv[1]
MODES=['summon','busy-dead','withdraw','switch','reuse','opaque-minus1','feedback','pause','reentry','close','read-fail','opponent-unmatched','timeout'];assert mode in MODES
incoming=lambda c:next(r for r in catalog['incoming']if r['consumer']==c)
entry=incoming('0x4f3430');receive=incoming('0x4f36d0');send=next(r for r in catalog['outgoing']if r['producer']=='0x4f88f0');exit_send=next(r for r in catalog['outgoing']if r['producer']=='0x4f67f0');key=bytes.fromhex(old['bootstrap']['keyHex']);flow=options['flows'][1]
encoded=lambda raw:wire.frame(wire.payload_encode(raw,key))
def pet_text(slot,pet_mode):
 t=pets[slot]['wire'].split('|');t[24]=str(pet_mode);return'|'.join(t)
def characters(present=True,second=False):
 return'C|0|'+''.join(f'{slot:X}|{name}|'+''.join(f'{n&0xffffffff:X}|'for n in[100061 if slot==5 and second else 100060,0,1,0 if slot==5 and mode=='busy-dead'else 61 if slot==5 and second else 70,90 if slot==5 and second else 100,7 if slot==5 and second else 10,12 if slot==5 and second else 10,2 if slot==5 and mode=='busy-dead'else 1,0,0])for slot,name in[(0,'Hero'),*([(5,'NextPet'if second else'Pet0')]if present else[]),(10,'Enemy')])
def motion(which=mode):
 summon='MON|0|1|'+('FFFFFFFF'if which=='opaque-minus1'else'0')+'|NextPet|186DD|FFFFFFEF|3D|5A|7|C|5000001|'
 if which=='busy-dead':return'M|ESC|5|0|MON|0|0|0|'
 if which=='withdraw':return'M|MON|0|0|0|'
 if which=='opponent-unmatched':return'M|'+summon.replace('MON|0|','MON|A|',1)
 if which=='timeout':return'M|CBC|A|186DC|46|64|A|A|0|0|'
 return'M|'+('MON|0|0|0|'if which in['switch','feedback','pause','reentry','close','read-fail']else'')+summon
with socket.socket()as server:
 server.settimeout(25);server.bind(('127.0.0.1',0));server.listen(1);print(json.dumps(dict(port=server.getsockname()[1])),flush=True);connection,_=server.accept()
 with connection:
  connection.settimeout(25);startup=0;actions=[];exit_requests=movement_requests=pet_packets=0
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
  def data(rows):connection.sendall(b''.join(encoded(wire.message(receive,[t.encode()]))for t in rows))
  def pet(slot,pet_mode):
   global pet_packets
   connection.sendall(encoded(wire.message(incoming('0x4f0aa0'),[slot,pet_text(slot,pet_mode).encode()])));pet_packets+=1
  def skill(slot):
   global pet_packets
   connection.sendall(encoded(wire.message(incoming('0x4f1420'),[slot,skills.encode()])));pet_packets+=1
  def commands(rows):
   for text in rows:request(wire.message(send,[text.encode()]));actions.append(text)
   stage('action-verified')
  connection.sendall(wire.frame(bytes.fromhex(old['bootstrap']['payloadHex'])));boot(wire.payload_decode(bytes.fromhex(old['authFrameHex'])[4:-2],key));connection.sendall(bytes.fromhex(old['authReplyFrameHex']));boot(bytes.fromhex(old['flow']['requests']['list']['plainHex']));connection.sendall(bytes.fromhex(options['wire']['category5']['frameHex']+flow['initial']['frameHex']));boot(bytes.fromhex(options['wire']['request']['plainHex']));connection.sendall(bytes.fromhex(options['wire']['accepted']['frameHex']));boot(bytes.fromhex(old['flow']['requests']['list']['plainHex']));connection.sendall(bytes.fromhex(options['wire']['category8']['frameHex']+flow['initial']['frameHex']));boot(bytes.fromhex(flow['entry']['plainHex']));connection.sendall(bytes.fromhex(old['flow']['replies']['entered']['frameHex'])+b''.join(encoded(bytes.fromhex(p))for p in scene['protocol']['beforePlainHex']));stage('initial-sent')
  def enter():
   for r in pets:pet(r['slot'],1 if mode=='summon'and r['slot']==0 else r['mode'])
   skill(1);connection.sendall(encoded(wire.message(entry,battle['flow']['entry'])));data(['P|0|10|0|1EF|0|FFFFFFFF|',characters(mode!='summon'),'A|0|0|',motion()]);stage('entry-sent')
  expected=['N','N']if mode=='timeout'else['M|FF']if mode in['withdraw','busy-dead']else['M|1']
  wait('entry');enter();commands(expected)
  if mode=='reentry':wait('reentry');enter();commands(expected)
  if mode=='feedback':
   wait('feedback');pet(0,1);pet(1,2);data(['P|0|30|0|1EF|0|FFFFFFFF|',characters(True,True),'A|0|1|','M|CBC|A|186DC|46|64|A|A|0|0|']);stage('feedback-sent');commands(['M|FF','W|FF'])
  if mode not in['close','read-fail']:
   wait('finish');data(['C|20|']);stage('finish-sent');request(wire.message(exit_send,[0]));exit_requests+=1;stage('exit-verified');wait('move')
   for plain in scene['protocol']['requestPlainHex']:request(bytes.fromhex(plain));movement_requests+=1
   stage('moves-verified')
  wait('release');stage('released');assert connection.recv(1)==b'','unexpected duplicate request'
  print(json.dumps(dict(mode=mode,normal_startup_requests_verified=startup,pet_packets_verified=pet_packets,commands_verified=actions,exit_requests_verified=exit_requests,movement_requests_verified=movement_requests,no_duplicate_or_invented_actions=True,official_session=False,original_execution=False)),flush=True)
