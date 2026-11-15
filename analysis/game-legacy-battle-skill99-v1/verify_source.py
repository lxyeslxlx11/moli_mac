"""Verify the original six-class producer,modifier helpers and derived evidence bounds."""
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
    image=BASE['Image'](NETWORK['TARGET'],1569280,NETWORK['SHA']);source=identity(image.path)
    ledger_path,closure_path=PRIVATE/'rea-evidence.json',PRIVATE/'rea-closed.json'
    ledger=read(ledger_path);assert len(ledger['records'])==14 and not ledger['unknowns']
    assert read(closure_path)==dict(open=False,cleanup_pending=False,rea='6.7.0')
    assert ledger['artifacts'][0]['digest']['sha256']==source['sha256']
    memory,procedures,functions=[],[],{}
    for record in ledger['records']:
        assert record['subject']['digest']['sha256']==source['sha256']
        assert(record['provider']['id'],record['provider']['version'])==('ghidra','12.1.4')
        row=record['normalized_result']
        if record['operation']=='analyze_function':
            proc=row['procedure'];address,count=proc['address'],proc['body']['total_bytes']
            assert(address,count)in[('0x420840',297),('0x420970',358)]
            assert proc['body']['ranges']==[dict(start=address,end=hex(int(address,16)+count-1))]
            offset,raw=image.locate(address,count);functions[address]=row
            procedures.append(dict(address=address,bytes=count,file_offset=offset,sha256=sha256(raw).hexdigest(),evidence=record['evidence_id']))
        else:
            assert record['operation']=='read_bytes'
            address,count=row['address'],row['requested_bytes'];offset,raw=image.locate(address,count)
            assert row['complete']and row['returned_bytes']==count and raw.hex()==row['bytes_hex']
            memory.append(dict(address=address,bytes=count,file_offset=offset,sha256=sha256(raw).hexdigest(),evidence=record['evidence_id']))
    assert len(procedures)==2 and len(memory)==12
    old_path=HERE.parent/'game-battle-shared-storage-v1/source-check.json';old=read(old_path)
    assert old['source']==source
    derived=old['retained_derived_main']
    for kind in['evidence','pseudocode']:assert identity(ROOT/derived[kind]['path'])==derived[kind]
    original=read(ROOT/derived['evidence']['path']);main=next(e for e in original['entries']if e['requestedEntry']=='004260b0')
    total=0
    for instruction in main['instructions']:
        raw=bytes.fromhex(instruction['bytesHex']);_,actual=image.locate(instruction['address'],len(raw));assert actual==raw;total+=len(raw)
    assert len(main['instructions'])==14120 and total==54685
    text=(ROOT/derived['pseudocode']['path']).read_text()
    selected=re.search(r'^        case 99:\n.*?(?=^        case 0x69:)',text,re.M|re.S)
    assert selected and all('case '+value+':'in selected[0]for value in['99','100','0x65','0x66','0x67','0x68'])
    assert '0x99)'in selected[0]and '0x8c)'in selected[0]and '0x80000'in selected[0]
    assert '0x1018) = 0xfd'in selected[0]and '0x1018) = 0x112'in selected[0]
    assert 'FUN_00434a90((&DAT_0058fac4)[DAT_00598b8c],DAT_00598b68,DAT_00594b50,0)'in selected[0]
    constructor=(ROOT/'build/analysis/game-battle-casting-v1/retained-433cd0-private.txt')
    body=(ROOT/'build/analysis/game-battle-physical-family-v1/40a120-retained-pseudocode.txt')
    assert sha256(body.read_bytes()).hexdigest()=='d2b1bccff7cc860eaa226b0bf128c7e0a2be1ec06854ed8832414f35837acae1'
    modifier=functions['0x420970']['pseudocode'];callback=functions['0x420840']['pseudocode']
    assert '0x1064' in modifier and '0x1926a' in modifier and '0xffffffce'in modifier
    assert all(value in modifier for value in['0xfdd','0xfde','0x40','0x80','0x3e99999a'])
    assert all(value in callback for value in['0x1054','0.04','30.0','7','5.0'])
    checks=[]
    for address,expected,meaning in[
        (0x40e944,'6a0153e8a4ec0e00','precast first mode1 animation call'),
        (0x40e94c,'6a0153e89cec0e00','precast second mode1 animation call'),
        (0x40e954,'6a0153e894ec0e00','precast third mode1 animation call'),
        (0x42dc21,'6899000000','six-class target action153'),
        (0x42dc49,'688c000000','successful target action140'),
        (0x42dbb0,'6a00','three-word tuple third argument zero'),
    ]:
        offset,raw=image.locate(hex(address),len(expected)//2);assert raw.hex()==expected
        checks.append(dict(address=hex(address),file_offset=offset,bytes=len(raw),meaning=meaning))
    calls=[image.call(hex(a),hex(t))for a,t in[(0x40e947,0x4fd5f0),(0x40e94f,0x4fd5f0),(0x40e957,0x4fd5f0),
        (0x42dbc6,0x434a90),(0x42dc2f,0x434990),(0x42dc72,0x434990)]]
    table={37:0x40e7fd,38:0x40e964,135:0x4121b3,140:0x412abf,153:0x411f0a,156:0x411f0a}
    for state,address in table.items():
        _,raw=image.locate(hex(0x419434+4*state),4);assert struct.unpack('<I',raw)[0]==address
    v=read(HERE/'original-vectors.json');reference=ROOT/v['reference']['path']
    assert identity(reference)['sha256']==v['reference']['sha256']
    equations=run_path(str(HERE/'generate_vectors.py'))
    for row in v['queues']:assert equations['queues'](row['case'])==row['expected']
    assert(len(v['queues']),len(v['traces']),v['frames'],v['rgbaFrames'])==(2520,15,5156,352)
    assert all(row['settled']for row in v['traces'])
    result=dict(stage=284,source=source,rea='6.7.0',provider='Ghidra12.1.4',
        previous=identity(HERE.parent/'game-legacy-battle-self-flags-v1/source-check.json'),
        evidence=dict(ledger=identity(ledger_path),closure=identity(closure_path)),procedures=procedures,memory=memory,
        retained_main=dict(source_check=identity(old_path),**derived,lexical_range=dict(start=selected.start(),end_exclusive=selected.end()),
            lexical_sha256=sha256(selected[0].encode()).hexdigest(),canonical_now=False),
        retained_callback=identity(body),retained_character=identity(constructor),operands=checks,calls=calls,
        body_dispatch={str(k):hex(v)for k,v in table.items()},
        contract=dict(classes=list(range(99,105)),grammar='code,cost,ignored,caster,(target,flags)*,FF;no damage amount or RID tail',
            caster_actions=[24,53,37,38,135,62,38],target_actions=[153],success_actions=[140,78,35],success_mask='0x80000',
            tuple_words=3,number_style_assignment=False,charge_resource='0x1ae6d',modifier_resources=['0x'+format(0x1926a+i,'x')for i in range(6)],
            sound_keys=dict(odd='0xfd',even='0x112'),modifier_pointer='body+0x1064',modifier_flags='0x4000<<class_minus99',
            C_clear_masks=['0x4000','0x4000','0x10000','0x10000','0x40000','0x40000'],
            lifetime='Existing icon blocks replacement;C clearing retains the child;body removal owns deletion.',
            animation_steps_per_precast_callback=3),
        independent_reference=dict(generator=identity(HERE/'generate_vectors.py'),prior_equations=identity(reference),vectors=identity(HERE/'original-vectors.json'),
            queues=2520,scenarios=15,callback_states=5156,RGBA_frames=352,settled=15,
            raster_scope='Complete authored RGBA with portable nearest scaling;original backend sampling remains unverified.'),
        facts=['SKL99..104 share the original status producer;flags are not ordinary physical results.',
               'Target action153 uses charge33,then successful140 creates one persistent modifier icon and78 emits a sound key.',
               '434a90 writes three tuple fields;the old fourth cell must survive normal and interrupted tails.',
               'The original precast branch has three animation calls;the shared port previously called it twice.'],
        original_runtime_observed=False,original_execution=0,VM_actions=0,official_sessions=0,
        extent_limit='Six original classes and selected helper closure;main is a retained seeded static derivation,not a new canonical function;whole game,current clients and actual platforms remain required.')
    (HERE/'source-check.json').write_text(json.dumps(result,indent=2)+'\n')
    print(json.dumps(dict(procedures=2,memory=12,derived_instructions=14120,derived_bytes=54685,queues=2520,states=5156,RGBA=352)))


if __name__=='__main__':main()
