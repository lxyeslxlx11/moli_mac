"""Bind retained REA functions/tables to the immutable original PE, without execution."""
from pathlib import Path
from hashlib import sha256
import json
import struct

ROOT=Path(__file__).resolve().parents[2];A=Path(__file__).resolve().parent;P=ROOT/'build/analysis/game-special-graphics-v1'
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
entries={'0x5059f0','0x506030','0x506820','0x442150','0x506970','0x463d70','0x505b90','0x505b70','0x505b50','0x507b80','0x442f20','0x44fb60','0x4f3430','0x45eef0','0x437b30','0x501a50','0x505bd0','0x506ac0','0x506d50','0x506e80','0x461660','0x45f2f0'}
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
tables=[]
for address,count,expected in [('0x534210',12,[59000,59001,59100]),('0x568208',256,[0,1,2,3,4,5,6,7,8,9,10,10,11,11,11,12,12,12,11,11,11,10,9,9,8,7,6,5,4,3,2,1,0,-1,-2,-3,-4,-5,-6,-7,-8,-9,-10,-10,-11,-11,-11,-12,-12,-12,-11,-11,-11,-10,-9,-9,-8,-7,-6,-5,-4,-3,-2,-1])]:
    e=reads[(address,count)];n=e['normalized_result'];b=bytes.fromhex(n['bytes_hex']);at=offset(address,count);assert n['complete']and b==raw[at:at+count]and list(struct.unpack('<'+'i'*(count//4),b))==expected
    tables.append(dict(address=address,bytes=count,offset=at,sha256=sha256(b).hexdigest(),values=expected,evidence_id=e['evidence_id']))
text=lambda p:functions[p]['normalized_result']['pseudocode']
asm=lambda p:'\n'.join(functions[p]['normalized_result']['assembly'])
assert '0.25'in text('0x505b70')and 'FUN_00505b70()'in text('0x442f20')
assert 'FUN_00505b50()'in text('0x44fb60')and text('0x44fb60').index('FUN_00506030()')<text('0x44fb60').index('FUN_00505b50()')
assert 'DAT_00f8f1fc'in text('0x5059f0')and ' = 8;'in text('0x5059f0')and ' = 2;'in text('0x5059f0')
assert 'FUN_00506820()'in text('0x506030')
for p in ['0x505bd0','0x506ac0','0x506d50','0x506e80']:assert 'DAT_00f8f1fc'in text(p)
for token in ['0x280','0x1e0','0x3f','0x568208','0x51eb851f','[ECX + 0x1c]','[EDX + 0x1c]','ADD EAX, 0x2']:assert token in asm('0x506820'),token
assert 'DAT_00957e6c = DAT_00957e6c + fVar2'in text('0x461660')and '_DAT_00bf22c8 = DAT_00957e6c'in text('0x45f2f0')
closure=json.loads((P/'rea-closure.json').read_text());assert not closure['open']and not closure['cleanup_pending']
out=dict(stage=298,source=identity(SOURCE),provider=dict(REA='6.7.0',Ghidra='12.1.4',profile=functions['0x506820']['analysis_profile']['digest']),functions=checked,function_bytes=sum(r['bytes']for r in checked),tables=tables,
    evidence=identity(P/'rea-evidence.json'),snapshot=identity(P/'rea-snapshot.json'),retained_records=len(bundle['records']),REA_closed=True,
    facts=['3096..3105 are queued graphic indices;5059f0 appends type8 atpriority2 andreserves4helpers.','506820 snapshots640x480 thenissues60strip copies;sourceY=8*i+12+trunc(table[(phase+i)&63]*amplitude/100).','505b70 increments phase.25 onsourceupdates;505b50 captures actualposition afterpresentation.','956/957 sourceposition andcamera originare distinct;461660 advancesposition and45f2f0 initializesboth.'],
    inference=['9250c8 is a lifecycle/stop gate: observed constructors/init/return pathswrite0, two exit pathswrite1. No new user preference is inferred.'],
    policy=['Full-redraw RGBA8 implementation; native caches anddriver timing areunmeasured.','Invalid native source strips are leftuntouched;undersized viewports usezero-padded640x480 scratch andcrop output. Thisisexplicit portablepolicy,not observedGPU behavior.','Waterstate startsatprocesszero inthismodel;native running-prefix state isunmeasured.'],
    api_reference='https://learn.microsoft.com/en-us/windows/win32/api/ddraw/nf-ddraw-idirectdrawsurface7-bltfast',
    original_execution=0,VM_actions=0,official_sessions=0,full_goal_complete=False)
(A/'source-check.json').write_text(json.dumps(out,indent=2)+'\n');print(json.dumps(dict(stage=298,functions=len(checked),bytes=out['function_bytes'],table_bytes=268,records=len(bundle['records']))))
