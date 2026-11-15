"""Bind zero-body storage, RID recipients and finite source frontiers to immutable PE bytes."""
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
    assert len(ledger['records'])==15 and not ledger['unknowns'];assert read(HERE/'rea-closure.json')==dict(open=False,cleanup_pending=False,rea='6.7.0')
    assert ledger['artifacts'][0]['digest']['sha256']==source['sha256']
    expected={'0x434b60':47,'0x41a030':526,'0x409e70':354,'0x420080':164,'0x4232e0':94,'0x436ee0':109,'0x434a30':56,'0x422d60':182,'0x434af0':112,'0x421140':200}
    procedures=[];memory=[];code={}
    for r in ledger['records']:
        assert r['subject']['digest']['sha256']==source['sha256']and(r['provider']['id'],r['provider']['version'])==('ghidra','12.1.4')
        n=r['normalized_result']
        if r['operation']=='analyze_function':
            proc=n['procedure'];addr=proc['address'];count=expected[addr];assert proc['body']['total_bytes']==count and proc['body']['ranges']==[dict(start=addr,end=hex(int(addr,16)+count-1))]
            offset,raw=image.locate(addr,count);code[addr]=n['pseudocode'];procedures.append(dict(address=addr,bytes=count,file_offset=offset,sha256=sha256(raw).hexdigest(),evidence=r['evidence_id']))
        else:
            assert r['operation']=='read_bytes';addr=n['address'];count=n['requested_bytes'];offset,raw=image.locate(addr,count);assert n['complete']and n['returned_bytes']==count and raw.hex()==n['bytes_hex'];memory.append(dict(address=addr,bytes=count,file_offset=offset,sha256=sha256(raw).hexdigest(),evidence=r['evidence_id']))
    assert len(procedures)==10 and sum(r['bytes']for r in procedures)==1844 and len(memory)==5 and sum(r['bytes']for r in memory)==9230
    parent=read(HERE.parent/'game-battle-shared-storage-v1/source-check.json');assert parent['source']==source;derived=parent['retained_derived_main']
    for kind in['evidence','pseudocode']:assert identity(ROOT/derived[kind]['path'])==derived[kind]
    main=next(r for r in read(ROOT/derived['evidence']['path'])['entries']if r['requestedEntry']=='004260b0');total=0
    for instruction in main['instructions']:
        raw=bytes.fromhex(instruction['bytesHex']);assert image.locate(instruction['address'],len(raw))[1]==raw;total+=len(raw)
    assert len(main['instructions'])==14120 and total==54685
    text=(ROOT/derived['pseudocode']['path']).read_text();start=text.index('\n      case 0x191:\n')+1;end=text.index('\n      case 0x192:\n',start);weather=text[start:end]
    assert all(x in weather for x in['0x80000','0x1adfa,0x1e,0,0x17','0xd3','0xce'])
    body=ROOT/'build/analysis/game-battle-physical-family-v1/40a120-retained-pseudocode.txt';assert sha256(body.read_bytes()).hexdigest()=='d2b1bccff7cc860eaa226b0bf128c7e0a2be1ec06854ed8832414f35837acae1';body_text=body.read_text();fragments=[]
    for state in[14,35,101,110,112,206,207,211]:
        label=hex(state);start_b=body_text.index('  case '+label+':\n');next_b=re.search(r'\n  case ',body_text[start_b+1:]);end_b=start_b+1+next_b.start()if next_b else len(body_text);raw=body_text[start_b:end_b];fragments.append(dict(state=state,start=start_b,end_exclusive=end_b,sha256=sha256(raw.encode()).hexdigest(),pseudocode=raw))
    (P/'retained-fragments.json').write_text(json.dumps(dict(weather=dict(start=start,end_exclusive=end,pseudocode=weather),bodies=fragments),indent=2)+'\n')
    table={14:0x40c7e8,35:0x40e79b,101:0x410287,110:0x411128,112:0x4115b0,206:0x414616,207:0x4146ae,211:0x414966}
    for state,address in table.items():assert struct.unpack('<I',image.locate(hex(0x419434+state*4),4)[1])[0]==address
    assert '*puVar3 = 0' in code['0x409e70']and '0x13b8'in code['0x421140']
    assert '0xca0' in code['0x434af0']and '+ 0x2c + iVar1) = 0xffffffff'in code['0x434af0']
    assert code['0x436ee0'].count('FUN_00434b60(param_1)')==3 and '*param_2 ='in code['0x436ee0']
    assert 'FUN_00436ee0(iVar4,&param_2,&local_8,&param_1,&local_4)'in code['0x41a030']
    assert 'FUN_00422d60((&DAT_0058fac4)[iVar3],local_8,param_1)'in code['0x41a030']and 'FUN_00420080((&DAT_0058fac4)[param_2],0x5738'in code['0x41a030']
    assert '0 < param_3'in code['0x422d60']and '*(undefined4 *)(param_1 + 0x2a8) = param_2'in code['0x422d60']
    assert 'param_2 < 1'in code['0x4232e0']and '0x13b0' in code['0x4232e0']
    assert '*(float *)(param_1 + 0x40)'in code['0x420080']and 'iVar2 == 0'in code['0x420080']
    assert 'iVar2 < 200'in code['0x434a30']and '0xfc8'not in code['0x434a30']
    # Construct literal native storage; the ignored stop flag does not restore the skipped tuple.
    bank=[[0,0,0,0]for _ in range(200)];bank[0]=[10,0x802001,9,100040];bank[1][0]=-1
    rid=dict(slot=bank[1][0],first=bank[1][2],second=bank[1][3],third=bank[2][2]);assert rid==dict(slot=-1,first=0,second=0,third=0)and bank[3]==[0,0,0,0]
    ordinary=[0,119,-1]+[0]*197;read_index=0
    for _ in range(4):read_index+=1;state=ordinary[read_index]if ordinary[read_index]!=-1 else 231
    assert(read_index,state)==(4,0)
    prior_weather=HERE.parent/'game-legacy-battle-weather-targets-v1/source-check.json';prior=read(prior_weather);assert prior['source']==source
    vectors=read(HERE/'original-vectors.json');equations=run_path(str(HERE/'generate_vectors.py'))
    for row in vectors['queues']:assert equations['prior'].queues(row['case'])==row['expected']
    assert(len(vectors['queues']),len(vectors['traces']),vectors['frames'],vectors['rgbaFrames'])==(720,29,15288,1030)
    assert [t['case']['name']for t in vectors['traces']if t['settled']]==['flags0x802041']
    result=dict(stage=287,source=source,rea='6.7.0',provider='Ghidra12.1.4',evidence=dict(ledger=identity(P/'rea-evidence.json'),closure=identity(HERE/'rea-closure.json')),procedures=procedures,memory=memory,procedure_bytes=1844,read_bytes=9230,retained_main=dict(**derived,canonical_now=False,instructions=14120,verified_bytes=54685),retained_callback=identity(body),weather_producer=dict(start=start,end_exclusive=end,sha256=sha256(weather.encode()).hexdigest()),callback_fragments=[{k:v for k,v in r.items()if k!='pseudocode'}for r in fragments],body_dispatch={str(k):hex(v)for k,v in table.items()},prior_weather_boundary=identity(prior_weather),source_facts=dict(clone_rows_copied=1,clone_payload_zeroed=True,RID_reader_advances=3,RID_suffix=rid,post_read_tuple=bank[3],reflected_RID_recipient='registered principal',ordinary_RID_recipient='suffix slot -1;native lookup contents unobserved',zero_amount_message_recipient=0,reflected_caster_resource=0,unregistered_clones_per_RID=4,post_sentinel_actions=dict(index=read_index,value=state,read_bound=200,write_bound_not_used=True),weather_self_effect_index=0x1adfa,low116_RID='suffix sentinel skipped;burst can pass the200-row storage bound;native later lookup unobserved'),reference=identity(HERE/'generate_vectors.py'),vectors=identity(HERE/'original-vectors.json'),original_execution=0,VM_actions=0,official_sessions=0,complete_game=False)
    (HERE/'source-check.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n');print(json.dumps(dict(procedures=10,procedure_bytes=1844,reads=5,read_bytes=9230,queues=720,states=15288,RGBA=1030)))
if __name__=='__main__':main()
