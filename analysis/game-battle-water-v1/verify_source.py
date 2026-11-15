"""Bind retained REA functions/tables to the immutable original PE, without execution."""
from pathlib import Path
from hashlib import sha256
import json
import struct

ROOT=Path(__file__).resolve().parents[2];A=Path(__file__).resolve().parent;P=ROOT/'build/analysis/game-battle-water-v1'
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
entries={'0x437b30','0x501a50','0x44fb60','0x5015a0','0x40a0c0','0x440570','0x433b70','0x437a90','0x423340','0x4ff430','0x4ff3b0','0x4ff160','0x43c000','0x409fe0','0x40a0a0','0x5059f0','0x506030','0x506820','0x442f20','0x505b50','0x505b70','0x506970','0x463d70','0x4f3430'}
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
assert 'FUN_004ff430();'in text('0x501a50')and '_DAT_009250cc ='in text('0x501a50')
start=text('0x501a50').index('case 3:');part=text('0x501a50')[start:].split('case 0x66:')[0]
assert part.index('FUN_004ff430()')<part.index('FUN_004032f0(1)')<part.index('_DAT_009250cc')
capture=text('0x437a90');assert capture.index('FUN_00506ac0')<capture.index('FUN_005059f0')<capture.index('FUN_00506030')
assert '0x140,0xf0,200'in capture and '0x1c'in text('0x423340')and 'FUN_00506ac0'not in text('0x423340')
loop=text('0x44fb60');assert loop.index('FUN_005015a0()')<loop.index('FUN_00442f20()')<loop.index('FUN_00506030()')<loop.index('FUN_00505b50()')
assert 'DAT_00f5e8dc != 0'in text('0x442f20')and '0.25'in text('0x505b70')
ret=text('0x501a50').split('case 0xb:',1)[1].split('case 0x14:',1)[0]
assert ret.index('FUN_004ff160()')<ret.index('FUN_005059f0()')<ret.index('FUN_00506030()')
assert 'FUN_004ff3b0'in text('0x4ff160')and 'DAT_00f5e8dc = FUN_0043c000'in text('0x4ff3b0')
assert 'DAT_00f8f210 = DAT_00957e6c'in text('0x505b50')and 'FUN_00505b50'not in text('0x506030')
closure=json.loads((P/'rea-closure.json').read_text());assert not closure['open']and not closure['cleanup_pending']
out=dict(stage=299,source=identity(SOURCE),provider=dict(REA='6.7.0',Ghidra='12.1.4',profile=functions['0x506820']['analysis_profile']['digest']),functions=checked,function_bytes=sum(r['bytes']for r in checked),
    evidence=identity(P/'rea-evidence.json'),snapshot=identity(P/'rea-snapshot.json'),retained_records=len(bundle['records']),REA_closed=True,
    source_facts=['Normal main9/3 clearslocalpointer andsets9250c8=1 before main10.','437a90 queuesbackground atpriority200,then executesnested506030;423340 latercopiescachedsurface directly.','Nestedpass doesnot call505b50;mainloop advances.25 onlywhilelocalpointer exists.','Normalreturn clearsgate,rebuilds via4ff160/4ff3b0,andcaptures beforeouterphaseupdate;fadeframes continuephase whilelocalexists.'],
    limitations=['Static datareferences do not proveallcomputed aliases orwholeprogramreachability.','Normal main9/3 origin only;othermain9/city/error/stop prefixes remainunverified.','Early ownunit recreation duringreturn canmakephaseadvancebeforewaitthreshold;bindactualpresence,notphase labelsalone.'],
    original_execution=0,VM_actions=0,official_sessions=0,full_goal_complete=False)
(A/'source-check.json').write_text(json.dumps(out,indent=2)+'\n');print(json.dumps(dict(stage=299,functions=len(checked),bytes=out['function_bytes'],records=len(bundle['records']))))
