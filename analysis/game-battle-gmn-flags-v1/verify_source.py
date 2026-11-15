"""Verify retained REA control/queue observations against original PE file bytes."""
from pathlib import Path
from hashlib import sha256
import json
import struct

ROOT=Path(__file__).resolve().parents[2]
A=Path(__file__).resolve().parent
P=ROOT/'build/analysis/game-battle-gmn-flags-v1'
SOURCE=ROOT/'build/analysis/game-release-current-v1/legacy-members/cg_se_6000.exe'
SHA='37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd'
PROFILE='7810ea9437da59780820ec6fedb47ce47390841a95d527ddb6c3b3700fe180cb'
raw=SOURCE.read_bytes();assert sha256(raw).hexdigest()==SHA
pe=struct.unpack_from('<I',raw,60)[0];count=struct.unpack_from('<H',raw,pe+6)[0]
optional=pe+24;header_size=struct.unpack_from('<H',raw,pe+20)[0];base=struct.unpack_from('<I',raw,optional+28)[0]
sections=[struct.unpack_from('<IIII',raw,optional+header_size+i*40+8)for i in range(count)]


def offset(address,size):
    rva=int(address,16)-base
    for virtual,start,length,at in sections:
        if start<=rva and rva+size<=start+length:
            return at+rva-start
    raise AssertionError(address)


def identity(path):
    path=Path(path);h=sha256()
    with path.open('rb')as f:
        for block in iter(lambda:f.read(1024*1024),b''):
            h.update(block)
    return dict(path=str(path.relative_to(ROOT)),bytes=path.stat().st_size,sha256=h.hexdigest())


bundle=json.loads((P/'rea-evidence.json').read_text());entries={'0x40a120','0x434a30','0x506e80','0x409e70'};functions={};reads={}
for e in bundle['records']:
    n=e['normalized_result']
    if e['operation']=='analyze_function'and n['procedure']['address']in entries:functions[n['procedure']['address']]=e
    if e['operation']=='read_bytes':reads[(n['address'],n['requested_bytes'])]=e
assert set(functions)==entries
checked=[]
for entry,e in functions.items():
    assert e['subject']['digest']['sha256']==SHA and e['provider']['version']=='12.1.4'and e['analysis_profile']['digest']==PROFILE
    body=e['normalized_result']['procedure']['body'];assert body['available']and body['contains_entry']and not body['non_contiguous']
    for region in body['ranges']:
        size=int(region['end'],16)-int(region['start'],16)+1;read=reads[(region['start'],size)];b=bytes.fromhex(read['normalized_result']['bytes_hex']);at=offset(region['start'],size)
        assert read['normalized_result']['complete']and len(b)==size and b==raw[at:at+size]
        checked.append(dict(entry=entry,bytes=size,offset=at,sha256=sha256(b).hexdigest(),dossier=e['evidence_id'],byte_evidence=read['evidence_id']))
text=lambda address:functions[address]['normalized_result']['pseudocode']
body=text('0x40a120')
for case,value in [('0xa4','0xff'),('0xa5','0')]:
    fragment=body.split('case '+case+':',1)[1].split('case ',1)[0]
    assert '(param_1 + 0x309) = '+value+';'in fragment and fragment.count('FUN_00434a30(param_1)')==1
    assert all(token not in fragment for token in ['0x308','0x310','0x30f','0x300'])
pop=text('0x434a30');assert '0xfc4' in pop and '0xca4' in pop and 'iVar2 < 200'in pop and '= 0xe7;'in pop
queue=text('0x506e80');assert queue.index('0x308')<queue.index('0x309')<queue.index('0x100000')
branch=reads[('0x4136d0',84)];b=bytes.fromhex(branch['normalized_result']['bytes_hex']);at=offset('0x4136d0',84);assert b==raw[at:at+84]
searches=[]
for e in bundle['records']:
    if e['operation']=='search_bytes'and e['parameters'].get('pattern')in ['68 a4 00 00 00','68 a5 00 00 00']:
        n=e['normalized_result'];assert n['complete']and not n['matches']and n['searched']['bytes']==1225058
        searches.append(dict(evidence_id=e['evidence_id'],pattern=e['parameters']['pattern'],bytes=n['searched']['bytes'],matches=0,complete=True))
assert len(searches)==2
closure=json.loads((P/'rea-closure.json').read_text());assert not closure['open']and not closure['cleanup_pending']
out=dict(stage=297,source=identity(SOURCE),provider=dict(REA='6.7.0',Ghidra='12.1.4',profile=PROFILE),evidence=identity(P/'rea-evidence.json'),snapshot=identity(P/'rea-snapshot.json'),
    retained_records=len(bundle['records']),functions=checked,function_bytes=sum(r['bytes']for r in checked),control_branch=dict(address='0x4136d0',bytes=84,offset=at,sha256=sha256(b).hexdigest(),evidence_id=branch['evidence_id']),
    facts=['Body action164 writes actor309=255;165 writes actor309=0. Both preserve actor310,308,300 and30f,then advance once through434a30.',
        '434a30 increments actionRead andloads nextaction;end orindex200 selects state231.',
        'Final506e80 independently applies objectcolor mask308,flagmask309/value310,andghostalpha last.'],
    immediate_push_searches=searches,producer_status='No normal protocol producer established. These are bodyqueue actionnumbers,not newGMNwireopcodes.',
    limitations=['The completed PUSH imm32 scans cover initialized .text only;absence doesnotexclude MOV/data-driven/other producers.',
        'The earlier broad a4byte search ispartial. The large40a120 valueflow is truncated;no wholeprogram reachability oralias claim.'],
    REA_closed=True,original_execution=0,VM_actions=0,official_sessions=0,full_goal_complete=False)
(A/'source-check.json').write_text(json.dumps(out,indent=2)+'\n');print(json.dumps(dict(stage=297,functions=len(checked),bytes=out['function_bytes'],control_bytes=84,records=len(bundle['records']))))
