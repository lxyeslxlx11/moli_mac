"""Independent exact-byte OS TCP peer for CMB owner counters,cumulative HP,no MP cost,banner,RID and round/return."""
from pathlib import Path
import importlib.util,json,socket,struct,sys
A=Path(__file__).resolve().parent
s=importlib.util.spec_from_file_location('status_skill_wire',A.parent/'game-legacy-message-v1/generate_vectors.py');wire=importlib.util.module_from_spec(s);s.loader.exec_module(wire)
load=lambda n:json.loads((A.parent/n/'original-vectors.json').read_text())
old,options,scene,battle,v=(load(n)for n in['game-post-login-v1','game-character-options-v1','game-input-runtime-v1','game-battle-transition-v1','game-battle-player-skills-v1'])
MODES=['ordinary', 'single', 'three', 'count10', 'suppress', 'RID3', 'attached-actor', 'attached-victim', 'pause', 'reentry', 'close', 'read-fail', 'nextC', 'local-exit']
MAP={'ordinary': 'ordinary', 'single': 'single', 'three': 'three', 'count10': 'count10', 'suppress': 'suppress-400', 'RID3': 'RID3-plus-attached', 'attached-actor': 'attached-RID-actor', 'attached-victim': 'attached-RID-victim', 'pause': 'ordinary', 'reentry': 'three', 'close': 'ordinary', 'read-fail': 'ordinary', 'nextC': 'ordinary', 'local-exit': 'local-exit'}
WAIT=[]
NORMAL=['ordinary', 'single', 'three', 'count10', 'suppress', 'RID3', 'attached-actor', 'attached-victim', 'pause', 'reentry', 'nextC']
mode=sys.argv[1];assert mode in MODES;assert sys.argv[2:]in[[],['long']];long_chant=False
vectors=json.loads((A/'original-vectors.json').read_text());case=next(r['case']for r in vectors['traces']if r['case']['name']==MAP.get(mode,'local-level0'))
category=8;level=0;principal=case['members'][0][0];hits=all_hits=[[h[0],case['target'],h[1],h[2],h[3]if h[1]&0x800000 else None]for h in case['members']]
slot=lambda n:50 if n==20 else 51 if n==21 else n
catalog=json.loads((A.parent/'game-legacy-message-v1/dispatch-catalog.json').read_text());incoming=lambda c:next(r for r in catalog['incoming']if r['consumer']==c);outgoing=lambda c:next(r for r in catalog['outgoing']if r['producer']==c)
entry,receive,send,query,exit_send=incoming('0x4f3430'),incoming('0x4f36d0'),outgoing('0x4f88f0'),outgoing('0x4f6d00'),outgoing('0x4f67f0');key=bytes.fromhex(old['bootstrap']['keyHex']);flow=options['flows'][1]
encoded=lambda raw:wire.frame(wire.payload_encode(raw,key))
def characters(second=False):
    resource=case['resource']
    rows=[]
    for slot in sorted(set([0,10,principal]+case.get('initialSlots',[])+[s for h in all_hits for s in h[:2]]+[h[5]for h in all_hits if h[2]&0x200]+([case['nested']['target']]+([case['nested']['guard']]if case['nested']['guard']is not None else[])if case.get('nested')and case['nested']['target']!=255 else[]))):
        hp=70
        values=[hp,100,7 if second and slot==principal else 10,10]
        rows.append(f'{slot:X}|'+('Hero'if slot==0 else'Actor'+str(slot))+f'|{resource:X}|0|1|'+''.join(f'{n&0xffffffff:X}|'for n in values)+f"{case.get('flags',{}).get(str(slot),0):X}|{resource if slot in case.get('mounts',[])else 0:X}|0|")
    return 'C|0|'+''.join(rows)
def motion():
    words=[slot(case['target'])]
    for h in case['members']:
        words.extend([slot(h[0]),h[1],h[2]])
        if h[1]&0x800000:words.extend(h[3])
    words.append(255);raw='M|CMB|'+''.join(f'{n&0xffffffff:X}|'for n in words)
    for r in case.get('rids',[]):raw+='RID|'+''.join((str(n)if i in[4,13]else f'{n&0xffffffff:X}')+'|'for i,n in enumerate(r))
    return raw
with socket.socket()as server:
    server.settimeout(30);server.bind(('127.0.0.1',0));server.listen(1);print(json.dumps(dict(port=server.getsockname()[1])),flush=True);connection,_=server.accept()
    with connection:
        connection.settimeout(30);startup=0;actions=[];queries=[];skill_packets=exit_requests=movement_requests=0
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
            skill('0x4f0210',[262,b'Original School']);skill('0x4f0510',[2,v['levelText'].encode()]);skill('0x4f0290',[v['headerText'].encode()]);skill('0x4f0510',[0,v['levelText'].encode()]);skill('0x4f0510',[14,v['levelText'].encode()]);connection.sendall(encoded(wire.message(entry,battle['flow']['entry'])));data([f"P|0|{(case.get('controlFlags',0)|16):X}|4004|0|0|FFFFFFFF|",characters(),'A|0|0|',motion()]);request(wire.message(query,[3]));queries.append(3);stage('entry-sent')
        def action(feedback=False):
            text='S|2|1|29'if feedback else'S|2|0|A';request(wire.message(send,[text.encode()]));actions.append(text);stage('action-verified')
        wait('entry');enter();action()
        if mode=='reentry':wait('reentry');enter();action()
        if mode=='nextC':
            wait('feedback');skill('0x4f0510',[2,v['levelText'].replace('Cut II','Updated II').encode()]);data([characters(True),'A|0|1|',motion()]);stage('feedback-sent');action(True)
        if mode not in['close','read-fail']+WAIT:
            if mode in NORMAL:wait('finish');data(['C|20|']);stage('finish-sent')
            request(wire.message(exit_send,[0]));exit_requests+=1;stage('exit-verified');wait('move')
            for plain in scene['protocol']['requestPlainHex']:request(bytes.fromhex(plain));movement_requests+=1
            stage('moves-verified')
        wait('release');stage('released');assert connection.recv(1)==b'','unexpected extra action/query/exit/movement'
        print(json.dumps(dict(mode=mode,category=category,variant=0,long_original_fixture_chant=long_chant,source_local_stop=mode not in NORMAL+WAIT+['close','read-fail'],normal_startup_requests_verified=startup,skill_packets_verified=skill_packets,automatic_skill_queries_verified=queries,commands_verified=actions,exit_requests_verified=exit_requests,movement_requests_verified=movement_requests,no_duplicate_or_invented_actions=True,official_session=False,original_execution=False,input_cost_is_not_server_M_cost=True)),flush=True)
