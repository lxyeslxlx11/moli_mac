"""Bind REA, upper dispatch/ABI observations and independent equations to immutable bytes."""
from pathlib import Path
from hashlib import sha256
from runpy import run_path
import json
import struct

HERE=Path(__file__).resolve().parent
ROOT=HERE.parents[1]
PRIVATE=ROOT/'build/analysis'/HERE.name
BASE=run_path(str(HERE.parent/'game-legacy-startup-materials-v1/verify_source.py'))
NETWORK=run_path(str(HERE.parent/'game-legacy-network-v1/verify_source.py'))
identity=BASE['identity']
read=lambda path:json.loads(path.read_text())

def main():
    image=BASE['Image'](NETWORK['TARGET'],1569280,NETWORK['SHA']);source=identity(image.path)
    ledger_path=PRIVATE/'rea-evidence.json';ledger=read(ledger_path)
    assert len(ledger['records'])==14 and not ledger['unknowns']
    assert read(PRIVATE/'rea-closed.json')==dict(open=False,cleanup_pending=False,rea='6.7.0')
    assert ledger['artifacts'][0]['digest']['sha256']==source['sha256']
    functions=[];memory=[];code={}
    expected={'0x4032f0':39,'0x403530':15,'0x41f160':60,'0x41f1a0':176,'0x421140':200}
    for record in ledger['records']:
        assert record['subject']['digest']['sha256']==source['sha256']
        assert(record['provider']['id'],record['provider']['version'])==('ghidra','12.1.4')
        row=record['normalized_result']
        if record['operation']=='analyze_function':
            proc=row['procedure'];address=proc['address'];count=expected[address]
            assert proc['body']['total_bytes']==count and proc['body']['ranges']==[dict(start=address,end=hex(int(address,16)+count-1))]
            offset,raw=image.locate(address,count);code[address]=row['pseudocode']
            functions.append(dict(address=address,bytes=count,file_offset=offset,sha256=sha256(raw).hexdigest(),evidence=record['evidence_id']))
        else:
            assert record['operation']=='read_bytes';address=row['address'];count=row['requested_bytes'];offset,raw=image.locate(address,count)
            assert row['complete']and row['returned_bytes']==count and raw.hex()==row['bytes_hex']
            memory.append(dict(address=address,bytes=count,file_offset=offset,sha256=sha256(raw).hexdigest(),evidence=record['evidence_id']))
    assert len(functions)==5 and sum(r['bytes']for r in functions)==490 and len(memory)==9 and sum(r['bytes']for r in memory)==4236
    previous=read(HERE.parent/'game-battle-shared-storage-v1/source-check.json');assert previous['source']==source
    derived=previous['retained_derived_main']
    for kind in['evidence','pseudocode']:assert identity(ROOT/derived[kind]['path'])==derived[kind]
    main=next(r for r in read(ROOT/derived['evidence']['path'])['entries']if r['requestedEntry']=='004260b0');total=0
    for instruction in main['instructions']:
        raw=bytes.fromhex(instruction['bytesHex']);_,actual=image.locate(instruction['address'],len(raw));assert actual==raw;total+=len(raw)
    assert len(main['instructions'])==14120 and total==54685
    text=(ROOT/derived['pseudocode']['path']).read_text();fragments=read(PRIVATE/'producer-fragments.json');producers=[]
    for r in fragments:
        bounds=r['character_range'];raw=text[bounds['start']:bounds['end_exclusive']];assert raw==r['pseudocode']
        producers.append(dict(category=r['category'],character_range=bounds,lexical_sha256=sha256(raw.encode()).hexdigest()))
    assert [r['category']for r in producers]==[107,108,109,112,114,117]
    assert all('0x103c'in r['pseudocode']and'0x1040'in r['pseudocode']for r in fragments)
    assert '0x1004' in text[text.index('          case 0x70:'):text.index('          case 0x70:')+800]
    body=ROOT/'build/analysis/game-battle-physical-family-v1/40a120-retained-pseudocode.txt'
    assert sha256(body.read_bytes()).hexdigest()=='d2b1bccff7cc860eaa226b0bf128c7e0a2be1ec06854ed8832414f35837acae1'
    for row in read(PRIVATE/'body-fragments.json'):
        assert body.read_text()[row['start']:row['end_exclusive']]==row['pseudocode']
    assert '0x20000'in code['0x421140']and'0x103c'in code['0x421140']and'0xff4'in code['0x421140']
    assert '0x1004'not in code['0x421140'] # ff4 was copied;the caller separately enables1004.
    assert 'PTR_FUN_0052d340'in code['0x4032f0']and'_rand()'in code['0x4032f0']
    assert '^ param_1'in code['0x403530']
    assert all(x in code['0x41f1a0']for x in['(10,200)','(0,0x167)','(5,0x14)','0x2cc'])
    assert 'FUN_00419ba0'in code['0x41f160']and'FUN_004fd5f0(param_1,1)'in code['0x41f160']
    table={54:0x40ecb8,55:0x40ecf8,57:0x40ed84,102:0x410321,103:0x4104b2,104:0x4105be,
        107:0x410ac7,108:0x410b69,109:0x410f91,146:0x411f0a,154:0x412686,179:0x413988,212:0x411f0a}
    for state,address in table.items():
        _,raw=image.locate(hex(0x419434+4*state),4);assert struct.unpack('<I',raw)[0]==address
    # Resolve the exact varargs IAT import without loading an EXE or DLL.
    pe=struct.unpack_from('<I',image.data,0x3c)[0];optional=pe+24;imports=struct.unpack_from('<I',image.data,optional+104)[0]
    def at(rva,n):return image.locate(hex(image.base+rva),n)[1]
    def z(rva):return at(rva,128).split(b'\0',1)[0].decode('ascii')
    resolved=None
    for i in range(256):
        lookup,_,_,name,iat=struct.unpack('<IIIII',at(imports+i*20,20))
        if not iat:break
        for j in range(4096):
            value=struct.unpack('<I',at((lookup or iat)+j*4,4))[0]
            if value==0:break
            if image.base+iat+j*4==0x52d218:resolved=dict(iat='0x52d218',library=z(name),function=z(value+2))
    assert resolved==dict(iat='0x52d218',library='USER32.dll',function='wsprintfA')
    formats=[]
    for address,label in[(0x533a30,'failure'),(0x533a54,'FP'),(0x533a64,'LP')]:
        _,raw=image.locate(hex(address),36);raw=raw.split(b'\0',1)[0];value=raw.decode('cp932')
        formats.append(dict(address=hex(address),label=label,encoding='cp932',bytes=len(raw),sha256=sha256(raw).hexdigest(),format=value))
    assert formats[1]['format']=='%s のFPは %d/%d'and formats[2]['format']=='%s のLPは %d/%d'
    assert image.locate('0x4103e7',6)[1]==bytes.fromhex('ff1518d25200')
    vectors=read(HERE/'original-vectors.json');equations=run_path(str(HERE/'generate_vectors.py'))
    for row in vectors['queues']:assert equations['queues'](row['case'])==row['expected']
    assert (len(vectors['queues']),len(vectors['traces']),vectors['frames'],vectors['rgbaFrames'])==(4320,26,4825,474)
    assert [r['case']['name']for r in vectors['traces']if not r['settled']]==['gesture-self','gesture-multi']
    result=dict(stage=285,source=source,rea='6.7.0',provider='Ghidra12.1.4',evidence=dict(ledger=identity(ledger_path),closure=identity(PRIVATE/'rea-closed.json')),
        procedures=functions,memory=memory,retained_main=dict(**derived,canonical_now=False,instructions=14120,verified_bytes=54685),
        retained_callback=identity(body),producer_fragments=producers,body_dispatch={str(k):hex(v)for k,v in table.items()},
        information=dict(varargs_import=resolved,formats=formats,boxed_vtable='0x52d340',actual_numeric_arguments='vtable and encoded HP/MP word;not the unboxed values',
            portable_observation='structured existing C vitals;original success text is not claimed equivalent'),
        reference=identity(HERE/'generate_vectors.py'),vectors=identity(HERE/'original-vectors.json'),
        original_execution=0,VM_actions=0,official_sessions=0,complete_game=False)
    (HERE/'source-check.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n')
    print(json.dumps(dict(procedures=len(functions),procedure_bytes=490,reads=len(memory),read_bytes=4236,producer_classes=6,queues=4320,states=4825,RGBA=474)))

if __name__=='__main__':main()
