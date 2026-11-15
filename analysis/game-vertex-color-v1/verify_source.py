"""Bind ARGB production/draw observations to original PE bytes and primary definitions."""
from pathlib import Path
from hashlib import sha256
import json
import struct

ROOT=Path(__file__).resolve().parents[2]
A=Path(__file__).resolve().parent
P=ROOT/'build/analysis/game-vertex-color-v1'
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
entries=['0x4457d0','0x446e00','0x447330','0x506030','0x505bd0','0x507b20','0x4fd0d0','0x4533c0','0x5076a0']
functions={};reads={};search=None
for e in bundle['records']:
    n=e['normalized_result']
    if e['operation']=='analyze_function' and n['procedure']['address']in entries:
        functions[n['procedure']['address']]=e
    if e['operation']=='read_bytes':
        reads[(n['address'],n['requested_bytes'])]=e
    if e['evidence_id']=='ev_30c67dca74c1aa265e03eedc9b1d46facf2b1b31f09ac2bc9486b9f85631c32d':
        search=e
assert set(functions)==set(entries)
checked=[]
for entry,e in functions.items():
    assert e['subject']['digest']['sha256']==SHA and e['provider']['version']=='12.1.4'
    assert e['analysis_profile']['digest']=='7810ea9437da59780820ec6fedb47ce47390841a95d527ddb6c3b3700fe180cb'
    body=e['normalized_result']['procedure']['body']
    assert body['available'] and body['contains_entry'] and not body['non_contiguous']
    for region in body['ranges']:
        n=int(region['end'],16)-int(region['start'],16)+1
        proof=reads[(region['start'],n)];v=proof['normalized_result'];b=bytes.fromhex(v['bytes_hex']);at=offset(region['start'],n)
        assert v['complete'] and len(b)==n and b==raw[at:at+n]
        checked.append(dict(entry=entry,bytes=n,offset=at,sha256=sha256(b).hexdigest(),dossier=e['evidence_id'],byte_evidence=proof['evidence_id']))
assert sum(r['bytes'] for r in checked)==12101
text=lambda a:functions[a]['normalized_result']['pseudocode']
assert 'local_60 = param_9' in text('0x446e00') and 'local_c = param_9' in text('0x446e00')
assert 'local_60 = param_8' in text('0x447330') and 'local_c = param_8' in text('0x447330')
assert '0xff000000' in text('0x446e00') and '0xff000000' in text('0x447330')
assert 'param_7[2]' in text('0x505bd0') and '0xffffffff' in text('0x505bd0')
assert search and search['normalized_result']['complete']
assert [x['procedure']['address'] for x in search['normalized_result']['matches']]==['0x4457d0']*3
headers=ROOT/'build/analysis/game-additive-render-v1'
primary=json.loads((headers/'primary-headers.json').read_text())
for row in primary['headers']:
    assert identity(ROOT/row['path'])['sha256']==row['sha256']
assert primary['device7_methods'][37]=='SetTextureStageState'
types=(headers/'d3dtypes.h').read_text()
for token in ['D3DTSS_COLOROP        =  1','D3DTSS_ALPHAOP        =  4','D3DTSS_ALPHAARG1      =  5','D3DTSS_ALPHAARG2      =  6','D3DTOP_MODULATE   = 4','D3DTA_DIFFUSE           0x00000000','D3DTA_TEXTURE           0x00000002','((a) << 24) | ((r) << 16) | ((g) << 8) | (b)']:
    assert token in types,token
closure=json.loads((P/'rea-closure.json').read_text())
assert closure['open'] is False and closure['cleanup_pending'] is False
out=dict(stage=294,source=identity(SOURCE),provider=dict(REA='6.7.0',Ghidra='12.1.4',profile='7810ea9437da59780820ec6fedb47ce47390841a95d527ddb6c3b3700fe180cb'),
    evidence=identity(P/'rea-evidence.json'),snapshot=identity(P/'rea-snapshot.json'),retained_records=len(bundle['records']),functions=checked,function_bytes=12101,
    primary_headers=identity(headers/'primary-headers.json'),
    primary_sources=[dict(url=row['url'],sha256=row['sha256']) for row in primary['headers']]+[
        dict(url='https://learn.microsoft.com/en-us/windows/win32/direct3d9/d3dtexturestagestatetype',role='Documented stage0 COLOROP MODULATE, COLORARG1 TEXTURE and COLORARG2 CURRENT defaults; later SDK documentation, not target runtime observation.'),
        dict(url='https://learn.microsoft.com/en-us/windows/win32/direct3d9/d3dta',role='Documented CURRENT at stage0 is DIFFUSE.'),
        dict(url='https://learn.microsoft.com/en-us/windows/win32/direct3d9/d3dtextureop',role='Documented MODULATE component multiplication.')],
    facts=['4533c0 loads action ARGB;4fd0d0 copies it to state+0x300,with static/defaultFFFFFFFF.',
        '505bd0 copies queue style word2 to queue+0x1c or defaultsFFFFFFFF;506030 passes it unchanged to ordinary446e00 andscaled447330.',
        'Both draw functions write the same color to all four diffuse vertices,then select ONE/ZERO foralphaFF orSRCALPHA/INVSRCALPHA otherwise;flags8selectsONE/ONE first.',
        '4457d0 explicitly sets stage0 ALPHAOP MODULATE,ALPHAARG1 TEXTURE,ALPHAARG2 DIFFUSE,andenablesalpha/color-key blending.',
        'The matched FF/2 register-vtable+0x94 call pattern has exactly three observed .text matches,all explicit alpha-stage calls in4457d0;this pattern does not prove absence of all possible indirect writes.',
        '5076a0 copies the declared palette byte count into its named buffer before color conversion;the selected645-byte carrier andall10frames reference only its available color triples.'],
    inference=['Native ordinary RGB modulation follows the documented stage0 color defaults;source does not explicitly set COLOROP/COLORARG1/COLORARG2 in the examined path. No original runtime/hardware readback is claimed.'],
    independent_choices=['Round8-bit RGB multiplication to nearest viafloor((texel*vertex+127)/255).',
        'Multiply existing portableopacity byvertexalpha with the same rounding,then retain straight-alpha source-over andmask handling;opaque real background follows the native blend equation.',
        'Additive ignores both alpha andportableopacity,butstillmodulatesRGB;output coverage alpha remains the existing portable255 policy.',
        'Compose high image commands directly against text output to avoid separate-layer rounding andadditive loss;do not mutate preparedspritepixels orcachekeys forper-drawcolor.',
        'Allow nonempty complete BGR triples up to768bytes fornamed palettes;retain the known-color mask andexplicitly reject every image referencing an unavailable entry. The native tail-clearing pointer arithmetic is not emulated.'],
    remaining=['Original hardware precision/default-state mutation,filter/edge/16/24-bit andDDRAW fallback equivalence.','Full gameplay,remaining consumers,current-version handoff andreal platforms/official acceptance.'],
    REA_closed=True,original_execution=0,VM_actions=0,official_sessions=0,full_goal_complete=False)
(A/'source-check.json').write_text(json.dumps(out,indent=2)+'\n')
print(json.dumps(dict(stage=294,functions=len(checked),bytes=12101,records=len(bundle['records']),REA_closed=True)))
