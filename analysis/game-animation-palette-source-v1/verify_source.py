"""Bind the named-palette loader/consumer andfixed resource map to the exact original PE."""
from pathlib import Path
from hashlib import sha256
import json
import struct

A=Path(__file__).resolve().parent
ROOT=A.parents[1]
P=ROOT/'build/analysis/game-animation-palette-source-v1'
source=ROOT/'build/analysis/game-release-current-v1/legacy-members/cg_se_6000.exe'
raw=source.read_bytes()
SHA='37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd'
assert sha256(raw).hexdigest()==SHA
pe=struct.unpack_from('<I',raw,60)[0]
count=struct.unpack_from('<H',raw,pe+6)[0]
optional=pe+24
header_size=struct.unpack_from('<H',raw,pe+20)[0]
base=struct.unpack_from('<I',raw,optional+28)[0]
sections=[struct.unpack_from('<IIII',raw,optional+header_size+i*40+8)for i in range(count)]


def offset(address,size):
    rva=int(address,16)-base
    for virtual,start,length,at in sections:
        if start<=rva and rva+size<=start+length:
            return at+rva-start
    raise AssertionError(address)


def identity(path):
    path=Path(path)
    h=sha256()
    with path.open('rb')as f:
        for block in iter(lambda:f.read(1024*1024),b''):
            h.update(block)
    return dict(path=str(path.relative_to(ROOT)),bytes=path.stat().st_size,sha256=h.hexdigest())


bundle=json.loads((P/'rea-evidence.json').read_text())
entries=['0x506d50','0x463120','0x507b20','0x446e00','0x5076a0','0x507690','0x453bb0','0x507580','0x505d70','0x453360','0x4533c0','0x452fe0','0x453030','0x449c80','0x449a10','0x4fd0d0']
functions={}
reads={}
for e in bundle['records']:
    n=e['normalized_result']
    if e['operation']=='analyze_function'and n['procedure']['address']in entries:
        functions[n['procedure']['address']]=e
    if e['operation']=='read_bytes':
        reads[(n['address'],n['requested_bytes'])]=e
assert set(functions)==set(entries)
checked=[]
for entry in entries:
    e=functions[entry]
    assert e['subject']['digest']['sha256']==SHA
    assert e['provider']['id']=='ghidra'and e['provider']['version']=='12.1.4'
    assert e['analysis_profile']['digest']=='7810ea9437da59780820ec6fedb47ce47390841a95d527ddb6c3b3700fe180cb'
    body=e['normalized_result']['procedure']['body']
    assert body['available']and body['contains_entry']and not body['non_contiguous']
    for region in body['ranges']:
        size=int(region['end'],16)-int(region['start'],16)+1
        r=reads[(region['start'],size)]
        data=bytes.fromhex(r['normalized_result']['bytes_hex'])
        at=offset(region['start'],size)
        assert r['normalized_result']['complete']and raw[at:at+size]==data
        checked.append(dict(entry=entry,dossier=e['evidence_id'],byte_evidence=r['evidence_id'],bytes=size,offset=at,sha256=sha256(data).hexdigest()))
table=reads[('0x568310',5980)]
data=bytes.fromhex(table['normalized_result']['bytes_hex'])
at=offset('0x568310',5980)
assert table['normalized_result']['complete']and raw[at:at+5980]==data
resources=list(struct.unpack('<1495I',data))
assert resources[0]==0 and resources[1]==110300 and resources[320]==113058 and resources[-1]==120053
(P/'palette-resources.json').write_text(json.dumps(resources)+'\n')
out=dict(stage=292,source=identity(source),provider=dict(REA='6.7.0',Ghidra='12.1.4',profile='7810ea9437da59780820ec6fedb47ce47390841a95d527ddb6c3b3700fe180cb'),
    evidence=identity(P/'rea-evidence.json'),snapshot=identity(P/'rea-snapshot.json'),retained_records=len(bundle['records']),functions=checked,function_bytes=sum(r['bytes']for r in checked),
    palette_table=dict(address='0x568310',offset=at,bytes=5980,slots=1495,sha256=sha256(data).hexdigest(),evidence=table['evidence_id'],selected=[[i,resources[i]]for i in [0,1,2,278,320,1494]]),
    facts=[
        '4533c0 reads20-byte action headers for nonzero versions andstores the selector/flags/color at runtime action+0xc/+0xe/+0x10.',
        '4fd0d0 copies action+0xc into actor+0x306,flags into+0x305 andcolor into+0x300;463120 and506d50 copy the style block into the ordinary queue.',
        '507580 allocates1495 named-palette slots.507b20 normalizes signed selectors outside1..1494 to0;valid selectors use the fixed table at568310.',
        '5076a0 resolves the mapped graphic resource through452fe0 anddecodes it through453030,thenuses its embedded BGR palette as the named source.',
        'The32-bit palette substitutes1for nontransparent black andkeeps index0transparent;neutral flags4use the untransformed palette,other queries use existing channel/tint transforms.',
        '505d70 chooses the named palette before own-sprite embedded/default palette;449c80 routes the explicit palette into449a10.',
        '446e00 separately uses flags8for additive graphics-device behavior;this is not part of named-palette acceptance.'
    ],
    actual_material_probe=identity(P/'material-palette-probe.log'),
    independent_choices=['Keep bounded partial or missing named-palette reads as explicit unavailable errors;do not reproduce stale uninitialized tails.',
        'Bound the independent palette cache,own decoded palette bytes andclear late reads after cancellation/close.'],
    remaining=['Full16/24-bit andhardware texture/palette scheduling equivalence.','Additive flags8andother draw styles.','Full resource-version/current handoff/native platform andofficial acceptance.'],
    REA_closed=True,original_execution=0,VM_actions=0,official_sessions=0,full_goal_complete=False)
(A/'source-check.json').write_text(json.dumps(out,indent=2)+'\n')
print(json.dumps(dict(stage=292,functions=len(checked),bytes=out['function_bytes'],palette_slots=1495,table_bytes=5980)))
