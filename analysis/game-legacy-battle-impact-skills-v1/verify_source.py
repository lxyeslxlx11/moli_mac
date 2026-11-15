"""Rebind complete source observations and independent equations to fixed immutable PE bytes."""
from pathlib import Path
from hashlib import sha256
from runpy import run_path
import json,re,struct
HERE=Path(__file__).resolve().parent
ROOT=HERE.parents[1]
P=ROOT/'build/analysis'/HERE.name
BASE=run_path(str(HERE.parent/'game-legacy-startup-materials-v1/verify_source.py'))
NET=run_path(str(HERE.parent/'game-legacy-network-v1/verify_source.py'))
identity=BASE['identity'];read=lambda p:json.loads(p.read_text())
def main():
    image=BASE['Image'](NET['TARGET'],1569280,NET['SHA']);source=identity(image.path);ledger=read(P/'rea-evidence.json')
    assert len(ledger['records'])==22 and not ledger['unknowns']
    closed=read(HERE/'rea-closure.json');assert closed['open']is False and closed['cleanup_pending']is False
    assert ledger['artifacts'][0]['digest']['sha256']==source['sha256']
    expected={'0x41b5b0':136,'0x41a030':526,'0x4236d0':2249,'0x409e70':354,'0x41a550':271,'0x4fd5f0':1272,'0x436ee0':109,'0x41a2d0':519,'0x41a000':38,'0x41a4e0':99,'0x436e60':116}
    procedures=[];memory=[];code={}
    for r in ledger['records']:
        assert r['subject']['digest']['sha256']==source['sha256']
        assert(r['provider']['id'],r['provider']['version'])==('ghidra','12.1.4')
        n=r['normalized_result']
        if r['operation']=='analyze_function':
            proc=n['procedure'];addr=proc['address'];count=expected[addr];assert proc['body']['total_bytes']==count
            assert proc['body']['ranges']==[dict(start=addr,end=hex(int(addr,16)+count-1))]
            offset,raw=image.locate(addr,count);code[addr]=n['pseudocode'];procedures.append(dict(address=addr,bytes=count,file_offset=offset,sha256=sha256(raw).hexdigest(),evidence=r['evidence_id']))
        else:
            assert r['operation']=='read_bytes';addr=n['address'];count=n['requested_bytes'];offset,raw=image.locate(addr,count)
            assert n['complete']and n['returned_bytes']==count and raw.hex()==n['bytes_hex'];memory.append(dict(address=addr,bytes=count,file_offset=offset,sha256=sha256(raw).hexdigest(),evidence=r['evidence_id']))
    assert len(procedures)==len(expected)==11 and len(memory)==11
    parent=read(HERE.parent/'game-battle-shared-storage-v1/source-check.json');assert parent['source']==source;derived=parent['retained_derived_main']
    for kind in['evidence','pseudocode']:assert identity(ROOT/derived[kind]['path'])==derived[kind]
    main=next(r for r in read(ROOT/derived['evidence']['path'])['entries']if r['requestedEntry']=='004260b0');total=0
    for instruction in main['instructions']:
        raw=bytes.fromhex(instruction['bytesHex']);assert image.locate(instruction['address'],len(raw))[1]==raw;total+=len(raw)
    assert len(main['instructions'])==14120 and total==54685
    text=(ROOT/derived['pseudocode']['path']).read_text();fragments=[]
    def piece(label,start,end,categories):
        raw=text[start:end];assert raw;fragments.append(dict(label=label,categories=categories,character_range=dict(start=start,end_exclusive=end),lexical_sha256=sha256(raw.encode()).hexdigest(),pseudocode=raw))
    shared=text.index('switchD_0042da25_caseD_6a:');piece('producer106-111-116',shared,text.index('        switch(DAT_00598ba0)',shared),[106,111,116])
    for category,label in[(4,'4'),(97,'0x61')]:
        starts=[m.start()+1 for m in re.finditer(r'\n    case '+re.escape(label)+r':\n',text)];assert len(starts)==1
        start=starts[0];match=re.search(r'\n    case ',text[start+1:]);end=start+1+match.start()if match else len(text);piece('producer'+str(category),start,end,[category])
    piece('completion106-111-116',text.index('          case 0x6a:\n'),text.index('          case 0x6b:\n'),[106,111,116])
    (P/'producer-fragments.json').write_text(json.dumps(fragments,indent=2)+'\n')
    assert all('FUN_00434990'in r['pseudocode']for r in fragments[:3])
    assert all(x in fragments[0]['pseudocode']for x in['0xff4','0x9c','0x65','0x6a','0x6e','0xe000','FUN_004236d0'])
    body=ROOT/'build/analysis/game-battle-physical-family-v1/40a120-retained-pseudocode.txt';assert sha256(body.read_bytes()).hexdigest()=='d2b1bccff7cc860eaa226b0bf128c7e0a2be1ec06854ed8832414f35837acae1'
    body_text=body.read_text();body_rows=[]
    for name in['body-fragments.json','shared-body-fragments.json']:
        for r in read(P/name):
            assert body_text[r['start']:r['end_exclusive']]==r['pseudocode'];body_rows.append(dict(state=r['state'],start=r['start'],end_exclusive=r['end_exclusive'],sha256=sha256(r['pseudocode'].encode()).hexdigest()))
    table={14:0x40c7e8,16:0x40abd5,17:0x40c55d,68:0x40ab1a,84:0x40efb6,85:0x40f20f,86:0x40f1ed,99:0x40fccd,100:0x40fdd7,101:0x410287,106:0x4105d6,110:0x411128,111:0x4114fc,112:0x4115b0}
    for state,address in table.items():assert struct.unpack('<I',image.locate(hex(0x419434+state*4),4)[1])[0]==address
    assert all(x in code['0x41a2d0']for x in['0x60002','0x1adc0','FUN_00436ee0','FUN_0041a550','FUN_00419ba0'])
    assert 'FUN_00409e70(2,0)'in code['0x41b5b0']and '+ 0x10)'not in code['0x41b5b0']
    assert all(x in code['0x41a000']for x in['&DAT_0058fac4','0xff8','piVar2 < 0x58fb1c'])
    assert(0x58fb1c-0x58fac4)//4==22
    assert '0x2cc'in code['0x4fd5f0']and '0x2c8'in code['0x4fd5f0']
    assert '0x13b8' in code['0x41a2d0']and '0x800000'in code['0x436e60']
    vectors=read(HERE/'original-vectors.json');equations=run_path(str(HERE/'generate_vectors.py'))
    for row in vectors['queues']:assert equations['queues'](row['case'])==row['expected']
    assert(len(vectors['queues']),len(vectors['traces']),vectors['frames'],vectors['rgbaFrames'])==(4800,64,14251,1206)
    assert [t['case']['name']for t in vectors['traces']if not t['settled']]==['self4','self111','self116']
    old=HERE.parent/'game-legacy-battle-upper-skills-v1';old_source=read(old/'source-check.json')
    for row in old_source['procedures']:
        if row['address']in['0x421140','0x41f1a0']:
            raw=image.locate(row['address'],row['bytes'])[1];assert sha256(raw).hexdigest()==row['sha256']
    correction=read(HERE/'upper-smoke-traces.json');assert correction['retained_vectors']=={k:identity(old/'original-vectors.json')[k]for k in['path','sha256']}and(correction['frames'],correction['rgbaFrames'])==(374,40)
    out=dict(stage=286,source=source,rea='6.7.0',provider='Ghidra12.1.4',evidence=dict(ledger=identity(P/'rea-evidence.json'),closure=identity(HERE/'rea-closure.json')),procedures=procedures,memory=memory,procedure_bytes=sum(r['bytes']for r in procedures),read_bytes=sum(r['bytes']for r in memory),retained_main=dict(**derived,canonical_now=False,instructions=14120,verified_bytes=54685),retained_callback=identity(body),producer_fragments=[{k:v for k,v in r.items()if k!='pseudocode'}for r in fragments],callback_fragments=body_rows,body_dispatch={str(k):hex(v)for k,v in table.items()},registered_aux_count_slots=22,smoke_correction=dict(source='41f1a0 actor+2cc is drawOffsetY from4fd5f0',vectors=identity(HERE/'upper-smoke-traces.json')),reference=identity(HERE/'generate_vectors.py'),vectors=identity(HERE/'original-vectors.json'),original_execution=0,VM_actions=0,official_sessions=0,complete_game=False)
    (HERE/'source-check.json').write_text(json.dumps(out,ensure_ascii=False,indent=2)+'\n');print(json.dumps({k:out[k]for k in['procedure_bytes','read_bytes','registered_aux_count_slots']}))
if __name__=='__main__':main()
