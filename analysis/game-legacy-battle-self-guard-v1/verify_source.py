"""Verify guard role order,release branches and bounded alias evidence against the fixed original PE."""
from hashlib import sha256
import json
from pathlib import Path
import re
from runpy import run_path

HERE=Path(__file__).resolve().parent
ROOT=HERE.parents[1]
PRIVATE=ROOT/'build/analysis'/HERE.name
BASE=run_path(str(HERE.parent/'game-legacy-startup-materials-v1/verify_source.py'))
NETWORK=run_path(str(HERE.parent/'game-legacy-network-v1/verify_source.py'))
identity=BASE['identity']
read=lambda path:json.loads(path.read_text())


def main():
    image=BASE['Image'](NETWORK['TARGET'],1569280,NETWORK['SHA']);source=identity(image.path)
    bundle,closure=PRIVATE/'rea-evidence.json',PRIVATE/'rea-closed.json'
    assert read(closure)==dict(open=False,cleanup_pending=False,rea='6.7.0')
    ledger=read(bundle);assert len(ledger['records'])==5 and not ledger['unknowns']
    assert ledger['artifacts'][0]['digest']['sha256']==source['sha256']
    memory,procedures,functions,windows=[],[],{},[]
    for record in ledger['records']:
        assert(record['provider']['id'],record['provider']['version'])==('ghidra','12.1.4')
        assert record['subject']['digest']['sha256']==source['sha256']
        row=record['normalized_result']
        if record['operation']=='analyze_function':
            p=row['procedure'];address,count=p['address'],p['body']['total_bytes']
            assert(address,count)in[('0x423fa0',577),('0x4241f0',287)]
            assert p['body']['ranges']==[dict(start=address,end=hex(int(address,16)+count-1))]
            offset,raw=image.locate(address,count)
            procedures.append(dict(address=address,bytes=count,file_offset=offset,sha256=sha256(raw).hexdigest(),evidence=record['evidence_id']))
            functions[address]=row
            continue
        assert record['operation']=='read_bytes'
        address,count=row['address'],row['requested_bytes'];offset,raw=image.locate(address,count)
        assert row['complete']and row['returned_bytes']==count and raw.hex()==row['bytes_hex']
        memory.append(dict(address=address,bytes=count,file_offset=offset,sha256=sha256(raw).hexdigest(),evidence=record['evidence_id']))
        windows.append((int(address,16),int(address,16)+count))
    assert len(procedures)==2 and len(memory)==3
    previous_path=HERE.parent/'game-legacy-battle-self-metadata-v1/source-check.json';previous=identity(previous_path)
    assert previous['sha256']=='8ea4dfc9c4c2afd1d8534606da49e10ac83be7d0810e180a63ea08bdc70df4e7'
    old=read(previous_path);assert old['source']==source
    carried=old['carried_windows'];assert len(carried)==8
    for row in carried:
        offset,raw=image.locate(row['address'],row['bytes'])
        assert offset==row['file_offset']and sha256(raw).hexdigest()==row['sha256']
        start=int(row['address'],16);windows.append((start,start+len(raw)))
    text=functions['0x423fa0']['pseudocode'];assert 'if ('not in text and'goto 'not in text
    actions=[]
    for line in text.splitlines():
        m=re.search(r'FUN_00434990\(param_1,\(&DAT_0058fac4\)\[(param_\d)\],(0x[0-9a-f]+|\d+)\)',line)
        if m:actions.append([m[1],int(m[2],0)])
    expected=[['param_2',a]for a in[72,24,71,0,24]]+[['param_6',a]for a in[0,39,78,67,34,73,7,4,42,71,10,74,72]]+[['param_3',a]for a in[0,27,71,72,62,1]]
    assert actions==expected and text.count('FUN_00434a90(')==4
    asm=PRIVATE/'redirect.asm'
    assert not re.search(r'\t(j[a-z]+)\s',asm.read_text())
    operands=[]
    for address,expected,meaning in[
        (0x4246f7,'24fb','class5 first record clears only bit0x4'),
        (0x424200,'85c0','release tests zero amount'),
        (0x424242,'f6c7e0','release checks E000 in the high byte'),
        (0x424247,'85ed','release tests negative next target'),
        (0x424297,'f6c320','release checks knockout0x20'),
        (0x4242b3,'85c0','zero release repeats amount test'),
        (0x4242b7,'85ed','zero release checks next target'),
    ]:
        assert any(start<=address and address+len(expected)//2<=stop for start,stop in windows)
        offset,raw=image.locate(hex(address),len(expected)//2);assert raw.hex()==expected
        operands.append(dict(address=hex(address),file_offset=offset,bytes=len(raw),meaning=meaning))
    calls=[image.call(hex(a),hex(t))for a,t in[
        (0x4248da,0x423fa0),(0x4249cf,0x423fa0),(0x424ff7,0x423fa0),
        (0x425690,0x4241f0),(0x4257d5,0x4241f0),(0x425d11,0x4241f0),
        (0x42426a,0x434af0),(0x4242da,0x434af0),
    ]]
    control=ROOT/old['previous']['path'];assert identity(control)==old['previous']
    offset,raw=image.locate('0x434c46',5);assert raw.hex()=='3d201c0000'
    recovery=dict(source_check=identity(control),compare_address='0x434c46',file_offset=offset,limit=7200,
                  calls=[image.call(hex(a),hex(t))for a,t in[(0x434c6d,0x4348e0),(0x434c78,0x434990),(0x434c83,0x434990)]])
    vector_path=HERE/'original-vectors.json';vectors=read(vector_path)
    reference_path=ROOT/vectors['reference']['path'];assert identity(reference_path)['sha256']==vectors['reference']['sha256']
    native=run_path(str(HERE/'generate_vectors.py'))['old']
    assert len(vectors['queues'])==14000 and len(vectors['releases'])==128
    for row in vectors['queues']:
        category,level,actor,target,guard,flags=row['input']
        c=native.case('verify',category,level,hits=[[actor,target,flags,12,[100040,100041,100050]if flags&0x800000 else None,guard]])
        assert native.digest(native.queues(c)['rows'])==row['expected_digest']
    old_guard=HERE.parent/'game-battle-physical-guard-v1/source-check.json';assert read(old_guard)['source']==source
    result=dict(stage=282,source=source,rea='6.7.0',provider='Ghidra12.1.4',
        evidence=dict(ledger=identity(bundle),closure=identity(closure)),previous=previous,
        procedures=procedures,memory=memory,carried_windows=carried,operands=operands,calls=calls,
        redirect_action_order=actions,redirect_three_word_tuple_appends=4,redirect_alias_normalization_observed=False,
        independent_reference=dict(generator=identity(HERE/'generate_vectors.py'),equations=identity(reference_path),
            historical_source_check=identity(old_guard),vectors=identity(vector_path),queues=14000,release_branches=128,
            scenarios=4,callback_states=1280,RGBA_frames=32),recovery=recovery,
        supported_self=dict(categories=[0,1,3,5,6,75,76,77,78,79,80,81,84,85,87,95,110,258,259,266],
            result_mask='0x13f8f77b',class5_first_result_mask='0x13f8f77f',mode='pair0'),
        facts=['423fa0 appends caster,guard and protected-role work in fixed order without a role-equality branch.',
               'Pair-mode caller retains guard0x200 and redirects the result role;positive saved-self normalization is a separate existing path.',
               '4241f0 retains E000,zero,knockout and next-target branches for all role relationships.',
               'The four independent callback traces remain waiting at320 calls;their original owned storage and full RGBA are finite prefix evidence,not native runtime completion.'],
        original_runtime_observed=False,native_device_and_official_acceptance=False,
        extent_limit='Selected original functions,complete retained producer/body ranges and independent finite callback prefixes;whole-game and current-version equivalence remain separate.')
    (HERE/'source-check.json').write_text(json.dumps(result,indent=2)+'\n')
    print(json.dumps({k:len(result[k])for k in['procedures','memory','carried_windows','operands','calls']}))


if __name__=='__main__':
    main()
