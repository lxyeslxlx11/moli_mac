"""Source-body,GUID andprimary SDK binding for the ordinary D3D7 additive path; no target execution."""
from pathlib import Path
from hashlib import sha256
import json
import struct

ROOT=Path(__file__).resolve().parents[2]
A=Path(__file__).resolve().parent
P=ROOT/'build/analysis/game-additive-render-v1'
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
    path=Path(path);h=sha256()
    with path.open('rb')as f:
        for block in iter(lambda:f.read(1024*1024),b''):
            h.update(block)
    return dict(path=str(path.relative_to(ROOT)),bytes=path.stat().st_size,sha256=h.hexdigest())


bundle=json.loads((P/'rea-evidence.json').read_text())
entries=['0x4457d0','0x4457b0','0x446e00','0x447330','0x506030','0x4fd0d0','0x4533c0','0x505d70']
functions={};reads={}
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
    assert e['subject']['digest']['sha256']==SHA and e['provider']['id']=='ghidra'and e['provider']['version']=='12.1.4'
    assert e['analysis_profile']['digest']=='7810ea9437da59780820ec6fedb47ce47390841a95d527ddb6c3b3700fe180cb'
    body=e['normalized_result']['procedure']['body']
    assert body['available']and body['contains_entry']and not body['non_contiguous']
    for region in body['ranges']:
        size=int(region['end'],16)-int(region['start'],16)+1;r=reads[(region['start'],size)]
        data=bytes.fromhex(r['normalized_result']['bytes_hex']);at=offset(region['start'],size)
        assert r['normalized_result']['complete']and raw[at:at+size]==data
        checked.append(dict(entry=entry,dossier=e['evidence_id'],byte_evidence=r['evidence_id'],bytes=size,offset=at,sha256=sha256(data).hexdigest()))
guid=reads[('0x52f0cc',16)]
data=bytes.fromhex(guid['normalized_result']['bytes_hex']);at=offset('0x52f0cc',16)
assert data==raw[at:at+16]==bytes.fromhex('779e04f56148d211a40700a0c90629a8')
headers=json.loads((P/'primary-headers.json').read_text())
for row in headers['headers']:
    assert identity(ROOT/row['path'])['sha256']==row['sha256']
assert headers['constants']['D3DBLEND_ONE']==2 and headers['device7_methods'][20]=='SetRenderState'
out=dict(stage=293,source=identity(source),provider=dict(REA='6.7.0',Ghidra='12.1.4',profile='7810ea9437da59780820ec6fedb47ce47390841a95d527ddb6c3b3700fe180cb'),
    evidence=identity(P/'rea-evidence.json'),snapshot=identity(P/'rea-snapshot.json'),retained_records=len(bundle['records']),functions=checked,function_bytes=sum(r['bytes']for r in checked),
    GUID=dict(address='0x52f0cc',offset=at,bytes=16,sha256=sha256(data).hexdigest(),evidence=guid['evidence_id'],name='IID_IDirect3D7'),primary_headers=identity(P/'primary-headers.json'),
    primary_sources=[dict(url=r['url'],sha256=r['sha256'])for r in headers['headers']]+[dict(url='https://learn.microsoft.com/en-us/windows/win32/direct3d9/alpha-blending-state')],
    facts=['4457d0 QueryInterface uses IID_IDirect3D7 andcreates the device incontext+a0;SDK vtable+0x50/+0x64 name SetRenderState/DrawPrimitive.',
        'The device initializer enables render state27,1(ALPHABLENDENABLE) andconditionally41,1(COLORKEYENABLE).',
        '446e00 and447330 select render states19,2and20,2 forflags8;SDK ONE+ONE means component addition with saturation onthe8-bit target.',
        'The flags8branch precedes vertex-alpha handling;the normal alpha source/destination factors5/6are onlyselected withoutflags8.',
        'Native D3D branches retain sourcecrop/flip/scale;the native DDRAW fallback skips flags8draws.',
        '4533c0/4fd0d0 retain action flagsinto the ordinary state,and506030 passes the queue flagsinto bothdraw paths;505d70 resolves named/neutral/tint palettes beforedrawing.'],
    independent_choices=['Emulate the evidenced D3D equation in the shared byte framebuffer with existing portable point sampling.',
        'Use index0/source-mask transparency andopaque output coverage;native surface alpha andhardware edge/filter precision are not claimed.',
        'Preserve high-layer additive behavior across text bycompositing against the existing owned framebuffer.'],
    observations=['A6a016a1b immediate-byte search hit unrelated UI code;GUID xrefs thenlocated the actual device initializer at4457d0.',
        'An interior query at48ab99 had no analyzed procedure andis not treated as source evidence forrender state.'],
    remaining=['Hardware/driver filtering,edge rules,16/24-bit quantization andnative DDRAW behavior.','Arbitrary vertex colors,otherstyles,full game/current handoff/native platform andofficial acceptance.'],
    REA_closed=True,original_execution=0,VM_actions=0,official_sessions=0,full_goal_complete=False)
(A/'source-check.json').write_text(json.dumps(out,indent=2)+'\n')
print(json.dumps(dict(stage=293,functions=len(checked),bytes=out['function_bytes'],GUID_bytes=16,records=len(bundle['records']))))
