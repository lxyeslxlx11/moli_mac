"""Original exact-byte OS loopback peer. Skill requests and returned SKL are independent wire authorities."""
from pathlib import Path
import importlib.util,json,socket,struct,sys
A=Path(__file__).resolve().parent
s=importlib.util.spec_from_file_location('player_skill_wire',A.parent/'game-legacy-message-v1/generate_vectors.py');wire=importlib.util.module_from_spec(s);s.loader.exec_module(wire)
load=lambda n:json.loads((A.parent/n/'original-vectors.json').read_text())
old,options,scene,battle,v=(load(n)for n in['game-post-login-v1','game-character-options-v1','game-input-runtime-v1','game-battle-transition-v1','game-battle-player-skills-v1'])
mode=sys.argv[1];assert mode in['class19', 'class20', 'class21', 'class22', 'class23', 'class24', 'class25', 'class26', 'class27', 'class28', 'class29', 'class30', 'class31', 'multi', 'reflect', 'RID', 'metadata', 'intercept', 'KO', 'pause', 'reentry', 'close', 'read-fail', 'unsupported-self', 'nextC'];assert sys.argv[2:]in[[],['long']];long_chant=sys.argv[2:]==['long']
catalog=json.loads((A.parent/'game-legacy-message-v1/dispatch-catalog.json').read_text());incoming=lambda c:next(r for r in catalog['incoming']if r['consumer']==c);outgoing=lambda c:next(r for r in catalog['outgoing']if r['producer']==c)
entry,receive,send,query,exit_send=incoming('0x4f3430'),incoming('0x4f36d0'),outgoing('0x4f88f0'),outgoing('0x4f6d00'),outgoing('0x4f67f0');key=bytes.fromhex(old['bootstrap']['keyHex']);flow=options['flows'][1]
encoded=lambda raw:wire.frame(wire.payload_encode(raw,key))
def characters(second=False):
 return'C|0|'+''.join(f'{slot:X}|'+('Hero'if slot==0 else'Enemy'+str(slot))+('|186E6|0|1|'if long_chant else'|186DC|0|1|')+''.join(f'{n:X}|'for n in([100,100,7 if second else 10,10]if slot==0 else[88 if second else 100,100,10,10]))+('1000000|0|0|' if mode=='metadata' and slot==10 else '0|0|0|')for slot in[0,10,*([11]if mode=='multi'else[])])
def motion():
 category=int(mode[5:])if mode.startswith('class')else 20 if mode=='reflect'else 22 if mode in['RID','metadata','intercept','KO']else 31 if mode=='unsupported-self'else 19
 flags,amount=(0x21,120)if mode=='KO'else(0x10001,12)if mode=='reflect'else(0x800001,12)if mode=='RID'else(0x3600001,12)if mode=='metadata'else(0x20000001,12)if mode=='intercept'else(1,12)
 target=0 if mode=='unsupported-self'else 10
 words=[category*100,4,0,0,target,flags,amount]
 if mode=='RID':words.extend([100040,100041,100050])
 if mode=='multi':words.extend([11,1,6])
 words.append(255)
 return'M|SKL|'+''.join(f'{n&0xffffffff:X}|'for n in words)

with socket.socket()as server:
 server.settimeout(25);server.bind(('127.0.0.1',0));server.listen(1);print(json.dumps(dict(port=server.getsockname()[1])),flush=True);connection,_=server.accept()
 with connection:
  connection.settimeout(25);startup=0;actions=[];queries=[];skill_packets=exit_requests=movement_requests=label_packets=0
  def exact(n):
   b=b''
   while len(b)<n:
    p=connection.recv(n-len(b));assert p,'unexpected EOF';b+=p
   return b
  def request(plain):
   h=exact(4);assert h[:2]==b'\xaf\xef';n=struct.unpack('<H',h[2:])[0];assert 0<n<=32767;b=exact(n);assert exact(2)==b'\xef\xaf';actual=wire.payload_decode(b,key);assert actual==plain,(actual.hex(),plain.hex())
  def boot(plain):
   global startup
   request(plain);startup+=1
  def stage(n):print(json.dumps(dict(stage=n)),flush=True)
  def wait(n):assert sys.stdin.readline().strip()==n
  def data(rows):connection.sendall(b''.join(encoded(wire.message(receive,[r.encode()]))for r in rows))
  def skill(c,args):
   global skill_packets
   connection.sendall(encoded(wire.message(incoming(c),args)));skill_packets+=1
  connection.sendall(wire.frame(bytes.fromhex(old['bootstrap']['payloadHex'])));boot(wire.payload_decode(bytes.fromhex(old['authFrameHex'])[4:-2],key));connection.sendall(bytes.fromhex(old['authReplyFrameHex']));boot(bytes.fromhex(old['flow']['requests']['list']['plainHex']));connection.sendall(bytes.fromhex(options['wire']['category5']['frameHex']+flow['initial']['frameHex']));boot(bytes.fromhex(options['wire']['request']['plainHex']));connection.sendall(bytes.fromhex(options['wire']['accepted']['frameHex']));boot(bytes.fromhex(old['flow']['requests']['list']['plainHex']));connection.sendall(bytes.fromhex(options['wire']['category8']['frameHex']+flow['initial']['frameHex']));boot(bytes.fromhex(flow['entry']['plainHex']));connection.sendall(bytes.fromhex(old['flow']['replies']['entered']['frameHex'])+b''.join(encoded(bytes.fromhex(p))for p in scene['protocol']['beforePlainHex']));stage('initial-sent')
  def enter():
   global label_packets
   if mode=='metadata':
    connection.sendall(encoded(wire.message(incoming('0x4f06f0'),[b'OriginalLabel|1|1101|'])))
    label_packets+=1
    connection.sendall(encoded(wire.message(incoming('0x4f48b0'),[1,b'1'])))
    request(wire.message(outgoing('0x4f6de0'),[1]))
    connection.sendall(encoded(wire.message(incoming('0x4f48d0'),[1]+[0]*9+[7,0,0,0,0,b'',b'Enemy10'])))
   skill('0x4f0210',[262,b'Original School']);skill('0x4f0510',[2,v['levelText'].encode()]);skill('0x4f0290',[v['headerText'].encode()]);skill('0x4f0510',[0,v['levelText'].encode()]);skill('0x4f0510',[14,v['levelText'].encode()]);connection.sendall(encoded(wire.message(entry,battle['flow']['entry'])));data(['P|0|10|4004|0|0|FFFFFFFF|',characters(),'A|0|0|',motion()]);request(wire.message(query,[3]));queries.append(3);stage('entry-sent')
  def action(feedback=False):
   text='S|2|1|29'if mode=='multi'or feedback else'S|2|4|0'if mode=='immediate'else'S|E|0|A'if mode=='slotE'else'S|2|0|A';request(wire.message(send,[text.encode()]));actions.append(text);stage('action-verified')
  wait('entry');enter()
  if mode=='queued-update':
   wait('main-mask-update');data(['P|0|10|0|0|0|FFFFFFFF|']);stage('main-mask-updated')
   wait('main-mask-restore');data(['P|0|10|4004|0|0|FFFFFFFF|']);stage('main-mask-restored')
   wait('level-update');changed=v['levelText'].replace('Cut I|Original hit|2|','Cut I|Original hit|1000|',1);assert changed!=v['levelText'];skill('0x4f0510',[2,changed.encode()]);stage('level-updated')
   wait('level-restore');skill('0x4f0510',[2,v['levelText'].encode()]);stage('level-restored')
  action()
  if mode=='reentry':wait('reentry');enter();action()
  if mode=='nextC':
   wait('feedback');skill('0x4f0510',[2,v['levelText'].replace('Cut II','Updated II').encode()]);data([characters(True),'A|0|1|',motion()]);stage('feedback-sent');action(True)
  if mode not in['close','read-fail','unsupported-self']:
   wait('finish');data(['C|20|']);stage('finish-sent');request(wire.message(exit_send,[0]));exit_requests+=1;stage('exit-verified');wait('move')
   for p in scene['protocol']['requestPlainHex']:request(bytes.fromhex(p));movement_requests+=1
   stage('moves-verified')
  wait('release');stage('released');assert connection.recv(1)==b'','unexpected extra action/query/exit/movement'
  print(json.dumps(dict(mode=mode,long_original_fixture_chant=long_chant,normal_startup_requests_verified=startup,skill_packets_verified=skill_packets,label_packets_verified=label_packets,automatic_skill_queries_verified=queries,commands_verified=actions,exit_requests_verified=exit_requests,movement_requests_verified=movement_requests,no_duplicate_or_invented_actions=True,official_session=False,original_execution=False,input_cost_is_not_server_M_cost=True)),flush=True)
