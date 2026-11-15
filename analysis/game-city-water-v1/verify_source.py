"""Bind retained REA functions/tables to the immutable original PE, without execution."""
from pathlib import Path
from hashlib import sha256
import json
import struct

ROOT=Path(__file__).resolve().parents[2];A=Path(__file__).resolve().parent;P=ROOT/'build/analysis/game-city-water-v1'
SOURCE=ROOT/'build/analysis/game-release-current-v1/legacy-members/cg_se_6000.exe'
SHA='37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd'
raw=SOURCE.read_bytes();assert sha256(raw).hexdigest()==SHA
pe=struct.unpack_from('<I',raw,60)[0];optional=pe+24;size=struct.unpack_from('<H',raw,pe+20)[0];base=struct.unpack_from('<I',raw,optional+28)[0]
sections=[struct.unpack_from('<IIII',raw,optional+size+i*40+8)for i in range(struct.unpack_from('<H',raw,pe+6)[0])]


def offset(address,length):
    rva=int(address,16)-base
    for virtual,start,size,at in sections:
        if start<=rva and rva+length<=start+size:return at+rva-start
    raise AssertionError(address)


def identity(path):
    p=Path(path);h=sha256()
    with p.open('rb')as f:
        for b in iter(lambda:f.read(1048576),b''):h.update(b)
    return dict(path=str(p.relative_to(ROOT)),bytes=p.stat().st_size,sha256=h.hexdigest())


bundle=json.loads((P/'rea-evidence.json').read_text());functions={};reads={}
entries={'0x5059f0', '0x506820', '0x4f16d0', '0x501a50', '0x505b70', '0x4ff430', '0x4ff160', '0x4ff3b0', '0x437b30', '0x4032f0', '0x44fb60', '0x505b50', '0x442f20', '0x502810', '0x4f3430', '0x4ef870', '0x506030'}
for e in bundle['records']:
    n=e['normalized_result']
    if e['operation']=='analyze_function'and n['procedure']['address']in entries:functions[n['procedure']['address']]=e
    if e['operation']=='read_bytes':reads[(n['address'],n['requested_bytes'])]=e
assert set(functions)==entries
checked=[]
for entry,e in sorted(functions.items()):
    assert e['subject']['digest']['sha256']==SHA and e['provider']['version']=='12.1.4'
    assert e['analysis_profile']['digest']=='7810ea9437da59780820ec6fedb47ce47390841a95d527ddb6c3b3700fe180cb'
    body=e['normalized_result']['procedure']['body'];assert body['available']and body['contains_entry']and not body['non_contiguous']
    for r in body['ranges']:
        count=int(r['end'],16)-int(r['start'],16)+1;read=reads[(r['start'],count)];n=read['normalized_result'];b=bytes.fromhex(n['bytes_hex']);at=offset(r['start'],count)
        assert n['complete']and b==raw[at:at+count]
        checked.append(dict(entry=entry,bytes=count,offset=at,sha256=sha256(b).hexdigest(),dossier=e['evidence_id'],byte_evidence=read['evidence_id']))
text=lambda p:functions[p]['normalized_result']['pseudocode']
assert 'DAT_00f5e8dc = 0;'in text('0x4ff430')
scene=text('0x4ef870');assert 'DAT_00f5f17c == 9'in scene and scene.index('DAT_00f5f1a0 = 200')<scene.index('FUN_004ff430()')<scene.index('FUN_0045f2a0(')
assert 'DAT_00f5e8dc == 0'in text('0x4f16d0')and 'FUN_004ff3b0()'in text('0x4f16d0')
loop=text('0x44fb60');assert loop.index('FUN_005015a0()')<loop.index('FUN_00442f20()')<loop.index('FUN_00506030()')<loop.index('FUN_00505b50()')
assert 'DAT_00f5e8dc != 0'in text('0x442f20')and '0.25'in text('0x505b70')
main=text('0x501a50');normal=main.split('case 0xb:',1)[1].split('case 0x14:',1)[0];transfer=main.split('case 0xcd:',1)[1].split('case 0xfa:',1)[0]
assert normal.index('FUN_004ff160()')<normal.index('FUN_005059f0()')<normal.index('FUN_00506030()')
assert 'FUN_004ff160'not in transfer and transfer.index('FUN_005059f0()')<transfer.index('FUN_00506030()')
assert 'FUN_004ff3b0'in text('0x4ff160')and 'DAT_00f5e8dc = FUN_0043c000'in text('0x4ff3b0')
assert 'DAT_00f8f210 = DAT_00957e6c'in text('0x505b50')and 'FUN_00505b50'not in text('0x506030')
prior=ROOT/'analysis/game-legacy-city-return-v1/source-check.json';prior_info=json.loads(prior.read_text());menu=prior_info['memory']['0x502710']
prior_bundle=ROOT/'build/analysis/game-legacy-city-return-v1/rea-evidence.json';previous=json.loads(prior_bundle.read_text());menu_record=next(e for e in previous['records']if e['evidence_id']==menu['evidence']);menu_bytes=bytes.fromhex(menu_record['normalized_result']['bytes_hex'])
assert menu_record['normalized_result']['complete']and len(menu_bytes)==menu['bytes']==253 and menu_bytes==raw[menu['file_offset']:menu['file_offset']+253]
menu_checked=dict(address='0x502710',bytes=253,offset=menu['file_offset'],sha256=sha256(menu_bytes).hexdigest(),evidence=menu['evidence'],source=identity(prior),bundle=identity(prior_bundle))
closure=json.loads((P/'rea-closure.json').read_text());assert not closure['open']and not closure['cleanup_pending']
out=dict(stage=300,source=identity(SOURCE),provider=dict(REA='6.7.0',Ghidra='12.1.4',profile=functions['0x506820']['analysis_profile']['digest']),functions=checked,city_request_menu=menu_checked,function_bytes=sum(r['bytes']for r in checked),
    evidence=identity(P/'rea-evidence.json'),snapshot=identity(P/'rea-snapshot.json'),retained_records=len(bundle['records']),REA_closed=True,
    source_facts=['Initialized city transfer main9 sets200 andclearslocal;main10 doesnot request200 orclearlocal.','Main9/205 captures mapwithout4ff160;main9/11 rebuilds localwith4ff160 beforecapture.','Local ownunit packet canrecreate pointerbeforeoraftercapture.','State dispatch precedes outer localpresence phaseupdate,renderpass andposition snapshot;cached fade copiesdonot regenerate water.','While awaiting the cityreply native main9 continues ordinaryupdates/draws.'],
    limitations=['Static flow isnotoriginal runtime orserverordering evidence.','General initial/othermain9/error/stop/nativecache andwhole-object cadence remainoutside this finitecity lifecycle.','Existing movement/actorprojection andasynchronous selectedframe commitpolicy remainexplicit portablepolicies.'],
    original_execution=0,VM_actions=0,official_sessions=0,full_goal_complete=False)
(A/'source-check.json').write_text(json.dumps(out,indent=2)+'\n');print(json.dumps(dict(stage=300,functions=len(checked),bytes=out['function_bytes'],records=len(bundle['records']))))
