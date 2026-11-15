"""Bind Battle final-queue/color-mask observations to original PE bytes and primary definitions."""
from pathlib import Path
from hashlib import sha256
import json
import struct

ROOT=Path(__file__).resolve().parents[2]
A=Path(__file__).resolve().parent
P=ROOT/'build/analysis/game-battle-draw-style-v1'
SOURCE=ROOT/'build/analysis/game-release-current-v1/legacy-members/cg_se_6000.exe'
SHA='37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd'
raw=SOURCE.read_bytes()
assert sha256(raw).hexdigest()==SHA
pe=struct.unpack_from('<I',raw,60)[0];count=struct.unpack_from('<H',raw,pe+6)[0]
optional=pe+24;header_size=struct.unpack_from('<H',raw,pe+20)[0]
base=struct.unpack_from('<I',raw,optional+28)[0]
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


bundle=json.loads((P/'rea-evidence.json').read_text())
entries=['0x506e80','0x409e70','0x41f7a0','0x41f740','0x421a10','0x422080','0x40a120','0x446e00','0x447330','0x506030','0x4fd0d0','0x4533c0']
functions={};reads={}
for e in bundle['records']:
 n=e['normalized_result']
 if e['operation']=='analyze_function' and n['procedure']['address']in entries:functions[n['procedure']['address']]=e
 if e['operation']=='read_bytes':reads[(n['address'],n['requested_bytes'])]=e
assert set(functions)==set(entries)
checked=[]
for entry,e in functions.items():
 assert e['subject']['digest']['sha256']==SHA and e['provider']['version']=='12.1.4'
 assert e['analysis_profile']['digest']=='7810ea9437da59780820ec6fedb47ce47390841a95d527ddb6c3b3700fe180cb'
 body=e['normalized_result']['procedure']['body'];assert body['available'] and body['contains_entry'] and not body['non_contiguous']
 for region in body['ranges']:
  n=int(region['end'],16)-int(region['start'],16)+1;p=reads[(region['start'],n)];b=bytes.fromhex(p['normalized_result']['bytes_hex']);at=offset(region['start'],n)
  assert p['normalized_result']['complete'] and len(b)==n and b==raw[at:at+n]
  checked.append(dict(entry=entry,bytes=n,offset=at,sha256=sha256(b).hexdigest(),dossier=e['evidence_id'],byte_evidence=p['evidence_id']))
text=lambda a:functions[a]['normalized_result']['pseudocode']
s=text('0x506e80')
for token in ['0x308','0x309','0x30c','0x30d','0x30e','0x30f','0x100000','0x306','piVar5[7]','piVar5[8]']:
 if token=='0x306':continue
 assert token in s,token
assert s.index('0x308')<s.index('0x309')<s.index('0x100000')
assert 'piVar2[0xc3] = -1' in text('0x409e70')
body=text('0x40a120')
for case in ['0x9e','0x9f','0xa2','0xa3','0xa6','0xa7','0xa8','0xd5','0xd6','0xd7']:assert 'case '+case+':' in body
closure=json.loads((P/'rea-closure.json').read_text());assert closure['open']is False and closure['cleanup_pending']is False
out=dict(stage=295,source=identity(SOURCE),provider=dict(REA='6.7.0',Ghidra='12.1.4',profile='7810ea9437da59780820ec6fedb47ce47390841a95d527ddb6c3b3700fe180cb'),evidence=identity(P/'rea-evidence.json'),snapshot=identity(P/'rea-snapshot.json'),retained_records=len(bundle['records']),functions=checked,function_bytes=sum(r['bytes']for r in checked),
 facts=['506e80 source queuecolor overrides use actor308maskand30c..30f independently from animation305flags and300color/306selector.','Order israwanimation,coloroverride,flagmask309/310,andlastghost100000alpha128.','409e70 defaultsobjectcolormask0,colorFFFFFFFF;41f7a0copy preserves sourcefields.','40a120 states162/163 write mask8/0;158/159/213..215 have explicit sourcealpha/mask lifetimes andselected303byte resets.','421a10 updates linkedalpha thenwrites mask0 foralpha255 or8otherwise;422080 fields startmask8alpha0.','446e00/447330 takeadditiveanimationflag8beforealpha;ordinary nonadditivecoloralpha uses source factors5/6.'],
 implementation=['Rawanimation plusdistinct drawColorOverride;rawopacity metadata is notanotherblendfactor.','Pure finalqueue projection preserves colorandflagmask order,ghostprecedence andnamedselector.','Shared point/8bitrounding/straightalpha/indexmask semantics inherited fromstage294;nativeGPU isunverified.'],
 limitations=['40a120 analyze_function completed withretainedEvidence but exceededstdio response budget;procedure projection andfulloriginalbytecheck used. No operationrerun fortransport overflow.','Largefunction valueflow istruncated;the fieldstores/assembly andcompletepseudocode areused within statedscope,notwholeprogramaliasproof.'],
 REA_closed=True,original_execution=0,VM_actions=0,official_sessions=0,full_goal_complete=False)
(A/'source-check.json').write_text(json.dumps(out,indent=2)+'\n');print(json.dumps(dict(stage=295,functions=len(checked),bytes=out['function_bytes'],records=len(bundle['records']))))
