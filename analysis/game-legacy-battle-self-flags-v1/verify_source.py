"""Check fixed-image flag consumers and the bounded native evidence used by stage283."""
from hashlib import sha256
import json
from pathlib import Path
import re
from runpy import run_path
import struct

HERE=Path(__file__).resolve().parent
ROOT=HERE.parents[1]
PRIVATE=ROOT/'build/analysis'/HERE.name
BASE=run_path(str(HERE.parent/'game-legacy-startup-materials-v1/verify_source.py'))
NETWORK=run_path(str(HERE.parent/'game-legacy-network-v1/verify_source.py'))
identity=BASE['identity']
read=lambda p:json.loads(p.read_text())


def main():
    image=BASE['Image'](NETWORK['TARGET'],1569280,NETWORK['SHA'])
    source=identity(image.path)
    ledger_path,closure_path=PRIVATE/'rea-evidence.json',PRIVATE/'rea-closed.json'
    ledger,closure=read(ledger_path),read(closure_path)
    assert closure['open'] is False and closure['cleanup_pending'] is False
    assert len(ledger['records'])==9 and not ledger['unknowns']
    assert ledger['artifacts'][0]['digest']['sha256']==source['sha256']
    memory,procedures=[],[]
    for record in ledger['records']:
        assert(record['provider']['id'],record['provider']['version'])==('ghidra','12.1.4')
        assert record['subject']['digest']['sha256']==source['sha256']
        row=record['normalized_result']
        if record['operation']=='analyze_function':
            proc=row['procedure'];address,count=proc['address'],proc['body']['total_bytes']
            assert(address,count)==('0x4199b0',425)
            assert proc['body']['ranges']==[dict(start=address,end='0x419b58')]
            offset,raw=image.locate(address,count)
            procedures.append(dict(address=address,bytes=count,file_offset=offset,sha256=sha256(raw).hexdigest(),evidence=record['evidence_id']))
        else:
            assert record['operation']=='read_bytes'
            address,count=row['address'],row['requested_bytes'];offset,raw=image.locate(address,count)
            assert row['complete'] and row['returned_bytes']==count and row['bytes_hex']==raw.hex()
            memory.append(dict(address=address,bytes=count,file_offset=offset,sha256=sha256(raw).hexdigest(),evidence=record['evidence_id']))
    assert len(procedures)==1 and len(memory)==8
    assert{(r['address'],r['bytes'])for r in memory}=={
        ('0x40c7e8',116),('0x40d9a2',64),('0x40dd7e',300),('0x4199b0',425),
        ('0x40de63',376),('0x40de60',379),('0x424dfc',64),('0x41946c',588)}
    previous_path=HERE.parent/'game-legacy-battle-self-guard-v1/source-check.json'
    old=read(previous_path);assert old['source']==source
    carried=old['carried_windows'];assert len(carried)==8
    for row in carried:
        offset,raw=image.locate(row['address'],row['bytes'])
        assert offset==row['file_offset'] and sha256(raw).hexdigest()==row['sha256']
    metadata_path=HERE.parent/'game-legacy-battle-self-metadata-v1/source-check.json'
    metadata=read(metadata_path);assert metadata['source']==source
    helper=next(r for r in metadata['procedures']if r['address']=='0x41a030')
    offset,raw=image.locate(helper['address'],helper['bytes'])
    assert len(raw)==526 and offset==helper['file_offset'] and sha256(raw).hexdigest()==helper['sha256']
    full_path=ROOT/'build/analysis/game-battle-physical-family-v1/40a120-retained-pseudocode.txt'
    full=full_path.read_bytes()
    assert sha256(full).hexdigest()=='d2b1bccff7cc860eaa226b0bf128c7e0a2be1ec06854ed8832414f35837acae1'
    map_path=HERE.parent/'game-battle-physical-results-v1/consumer-map.json';mapping=read(map_path)
    groups=[]
    for state in[14,26,29,160]:
        group=next(r['complete_group']for r in mapping['body_groups']if r['state']==state)
        start,stop=(group['UTF8_byte_range'][k]for k in['start','end_exclusive'])
        assert sha256(full[start:stop]).hexdigest()==group['sha256']
        groups.append(dict(state=state,range=group['UTF8_byte_range'],sha256=group['sha256']))
    producer=ROOT/metadata['producer_pseudocode']['path']
    assert identity(producer)==metadata['producer_pseudocode']
    opaque_bits=[0x80,0x10000,0x20000,0x40000,0x4000000,0x20000000,0x40000000,0x80000000]
    opaque=0xe4070080;consumed=0x1bf8ff7f
    assert sum(opaque_bits)==opaque and opaque^consumed==0xffffffff
    assert not any(re.search(r'(?<![0-9a-f])'+hex(bit)+r'(?![0-9a-f])',producer.read_text())for bit in opaque_bits)
    asm_path=PRIVATE/'image.asm';instructions={}
    for line in asm_path.read_text().splitlines():
        match=re.match(r'\s*([0-9a-f]+):\s+((?:[0-9a-f]{2}\s+)+)\s*(.+)',line)
        if not match:continue
        address=int(match[1],16);raw=bytes.fromhex(match[2]);text=match[3]
        _,original=image.locate(hex(address),len(raw));assert original==raw
        instructions[address]=(raw,text)
    refs=[]
    for address,(raw,text)in instructions.items():
        if not re.search(r'0xfe[4-7]\(',text):continue
        assert '0xfe4(' in text
        opcode,operands=text.split(None,1)
        access='read'if opcode.startswith('test')or operands.startswith('0xfe4(')else'write'
        if access=='read':assert 0x40a120<=address<0x419394
        refs.append(dict(address=hex(address),access=access,bytes=len(raw),sha256=sha256(raw).hexdigest()))
    assert len(refs)==42 and sum(r['access']=='read'for r in refs)==16
    table={14:0x40c7e8,25:0x40d93a,26:0x40d9aa,28:0x40dd85,29:0x40de60,
           32:0x40e28d,33:0x40e5cf,44:0x40dfdb,113:0x411e8f,160:0x413542}
    for state,address in table.items():
        _,raw=image.locate(hex(0x419434+4*state),4);assert struct.unpack('<I',raw)[0]==address
    checks=[]
    for address,expected,meaning in[
        (0x40c82e,'a804','body14 selects110000 with result bit4'),
        (0x40d9ba,'a804','reaction26 tests bit4'),
        (0x40d9be,'f6c40c','reaction26 also tests0400/0800'),
        (0x40de71,'b900000008','body29 spin mask08000000'),
        (0x40de88,'2501000080','signed native reactionCounter modulo2,not a result80000000 test'),
        (0x40df1a,'858de40f0000','body29 exit retests the spin mask'),
        (0x40df37,'a810','body29 return speed tests0010'),
        (0x40df3b,'f6c410','body29 return speed tests1000'),
        (0x424e12,'6a0f6a006a00','class259/9 pushes only15,0,0 for its tile marker'),
        (0x434aa8,'8954011c','three-word tuple helper writes field0'),
        (0x434abc,'891401','three-word tuple helper writes field1'),
        (0x434acc,'89540124','three-word tuple helper writes field2'),
        (0x434ad9,'c744012cffffffff','tuple helper writes next sentinel,leaving current fourth cell intact'),
    ]:
        offset,raw=image.locate(hex(address),len(expected)//2);assert raw.hex()==expected
        checks.append(dict(address=hex(address),file_offset=offset,bytes=len(raw),meaning=meaning))
    angle_constants={0x52d400:0,0x52d41c:360,0x52d440:15,0x52d43c:60,0x52d438:120,
                     0x52d434:165,0x52d430:195,0x52d42c:240,0x52d428:300,0x52d424:345}
    for address,value in angle_constants.items():
        _,raw=image.locate(hex(address),4);assert struct.unpack('<f',raw)[0]==value
    calls=[image.call(hex(address),hex(target))for address,target in[
        (0x40df23,0x4199b0),(0x424e20,0x434a90),(0x40df4e,0x434a30),(0x40df74,0x434a30)]]
    vector_path=HERE/'original-vectors.json';vectors=read(vector_path)
    reference_path=ROOT/vectors['reference']['path'];assert identity(reference_path)['sha256']==vectors['reference']['sha256']
    native=run_path(str(HERE/'generate_vectors.py'))['native']
    assert len(vectors['queues'])==2800 and len(vectors['traces'])==15
    for row in vectors['queues']:
        category,level,flags=row['input'];c=native.case('check',category,level,hits=[[0,0,flags,12]])
        assert native.digest(native.queues(c)['rows'])==row['expected_digest']
    assert vectors['frames']==2400 and vectors['rgbaFrames']==120
    assert all(len(t['states'])==160 and not t['bodySettled']for t in vectors['traces'])
    result=dict(stage=283,source=source,rea='6.7.0',provider='Ghidra12.1.4',
        previous=identity(previous_path),evidence=dict(ledger=identity(ledger_path),closure=identity(closure_path)),
        procedures=procedures,memory=memory,carried_windows=carried,
        retained=dict(callback=identity(full_path),producer=identity(producer),map=identity(map_path),
                      body_groups=groups,metadata_source=identity(metadata_path),metadata_helper=helper),
        operands=checks,calls=calls,body_dispatch={str(k):hex(v)for k,v in table.items()},
        angle_constants={hex(k):v for k,v in angle_constants.items()},
        reaction_flag_inventory=dict(disassembly=identity(asm_path),
            tool=read(PRIVATE/'tool-versions.json')['llvm_objdump']['version'],tool_versions=identity(PRIVATE/'tool-versions.json'),
            references=refs,read_count=16,write_count=26,
            limit='Direct FE4..FE7 displacements only;this is not whole-program indirect-pointer proof.'),
        self_word=dict(categories=native.CLASSES,mode='ordinary pair0',retained_mask='0xffffffff',
            scoped_consumer_mask=hex(consumed),scoped_opaque_mask=hex(opaque),
            opaque_bits=[hex(n)for n in opaque_bits],class5_first_result='clear bit4;later records retain it',
            new_consumers={'0x4':'body14 impact110000 and reaction9','0x800':'reaction9','0x8000000':'body29 spin and current-angle refacing'}),
        tile_marker=dict(category=259,level=9,helper='0x434a90',words=[0,0,15],
            fourth_cell='retained original storage;never zeroed by this append'),
        independent_reference=dict(generator=identity(HERE/'generate_vectors.py'),equations=identity(reference_path),
            historical_source=identity(HERE.parent/'game-battle-physical-guard-v1/source-check.json'),
            vectors=identity(vector_path),queues=2800,scenarios=15,callback_states=2400,RGBA_frames=120,
            oracle_correction='body29 calls4199b0 on the current angle;formation-angle reface is a different helper'),
        recovery=old['recovery'],original_runtime_observed=False,native_device_and_official_acceptance=False,
        facts=['The original producer retains the raw result word;consumers select their own masks.',
               'Three previously excluded bits have scoped consumers;the other eight are opaque within the audited closure.',
               'The existing259/9 port incorrectly cleared tuple field4;three-field native storage semantics are now retained.',
               'Independent160-call prefixes remain unsettled;real portable manager completion is recorded separately.'],
        extent_limit='Fixed37c4 ordinary pair-mode producer/body14/reaction/helper closure;indirect whole-program uses,other skill grammars,current clients and official acceptance are separate.')
    (HERE/'source-check.json').write_text(json.dumps(result,indent=2)+'\n')
    print(json.dumps(dict(procedures=len(procedures),memory=len(memory),carried=len(carried),direct_reads=16,
                         direct_writes=26,queues=2800,states=2400,RGBA=120)))


if __name__=='__main__':main()
