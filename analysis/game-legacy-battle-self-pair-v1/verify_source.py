"""Bind ordinary self-alias queue/target semantics and the retained casting boundaries."""
from hashlib import sha256
import json
from pathlib import Path
from runpy import run_path
import struct

HERE=Path(__file__).resolve().parent
ROOT=HERE.parents[1]
PRIVATE=ROOT/'build/analysis'/HERE.name
STARTUP=run_path(str(HERE.parent/'game-legacy-startup-materials-v1/verify_source.py'))
NETWORK=run_path(str(HERE.parent/'game-legacy-network-v1/verify_source.py'))
identity=STARTUP['identity']
read=lambda p:json.loads(p.read_text())

def main():
    image=STARTUP['Image'](NETWORK['TARGET'],1569280,NETWORK['SHA']);source=identity(image.path)
    memory,windows,evidence=[],[],[]
    for stem in ['boundary','rea']:
        bundle,closure=PRIVATE/(stem+'-evidence.json'),PRIVATE/(stem+'-closed.json')
        assert read(closure)==dict(open=False,cleanup_pending=False,rea='6.7.0')
        ledger=read(bundle);assert len(ledger['records'])==6 and not ledger['unknowns']
        assert ledger['artifacts'][0]['digest']['sha256']==source['sha256']
        evidence.append(dict(ledger=identity(bundle),closure=identity(closure)))
        for record in ledger['records']:
            assert record['operation']=='read_bytes'
            assert (record['provider']['id'],record['provider']['version'])==('ghidra','12.1.4')
            assert record['subject']['digest']['sha256']==source['sha256']
            result=record['normalized_result'];address,length=result['address'],result['requested_bytes']
            offset,raw=image.locate(address,length)
            assert result['complete'] and result['returned_bytes']==length and raw.hex()==result['bytes_hex']
            memory.append(dict(address=address,file_offset=offset,bytes=length,sha256=sha256(raw).hexdigest(),evidence=record['evidence_id']))
            start=int(address,16);windows.append((start,start+length))
    prior=HERE.parent/'game-battle-physical-family-v1/source-check.json'
    assert identity(prior)['sha256']=='fd0507268b440435c8f44cd58cdadfe8edfa2ad271a09fcc368b28af80ca65bc'
    producer=next(row for row in read(prior)['retained_common_producer_checks'] if row['address']=='0x424310')
    offset,raw=image.locate(producer['address'],producer['bytes'])
    assert offset==producer['file_offset'] and sha256(raw).hexdigest()==producer['sha256']
    retained=[dict(address=producer['address'],file_offset=offset,bytes=len(raw),sha256=producer['sha256'],evidence=producer['read_id'])]
    windows.append((0x424310,0x424310+len(raw)))
    helpers=HERE.parent/'game-battle-shared-storage-v1/pursuit-source-check.json'
    assert identity(helpers)['sha256']=='c867c04c8f76a9324b1237a21a3145f9af478ed93165152c5bcbe8f03121af17'
    previous=read(helpers);assert previous['source']==source
    for address in ['0x434990','0x434af0','0x434a30','0x434a70','0x434b60','0x434b90']:
        item=previous['helpers'][address]
        for row in item['ranges']:
            offset,raw=image.locate(row['start'],row['bytes']);assert sha256(raw).hexdigest()==row['sha256']
            retained.append(dict(address=row['start'],file_offset=offset,bytes=len(raw),sha256=row['sha256'],evidence=item['evidence_id']))
            start=int(row['start'],16);windows.append((start,start+len(raw)))
    assert len(retained)==7
    def cover(address,length):
        assert any(start<=address and address+length<=stop for start,stop in windows),hex(address)
        return image.locate(hex(address),length)
    operands=[]
    for address,expected,meaning in (
        (0x42437b,'85ed','category0 physical prefix'),
        (0x424393,'83fd01','category1 physical prefix'),
        (0x4243ac,'83fd03','category3 physical prefix'),
        (0x40c9c8,'8b4c281c','current result slot from caster tuple'),
        (0x40c9cc,'8b048dc4fa5800','current target resolved through the shared body table'),
        (0x40ca00,'c7803c100000ffffffff','target class reset can alias the caster'),
        (0x40d86c,'56','normal result advances the resolved target actor'),
        (0x434a78,'8b410c','pop helper uses the supplied actor body'),
        (0x434a88,'89412c','pop helper writes the supplied actor state'),
        (0x434c46,'3d201c0000','retained wait compares7200'),
        (0x4310cf,'7438','side producer skips absent bodies'),
        (0x434940,'89889c0c0000','queue reset zeros tuple read cursor'),
        (0x43494c,'89501c','queue reset writes first tuple sentinel'),
        (0x43494f,'89502c','queue reset writes next tuple sentinel'),
        (0x412365,'8b442a1c','side release reads current target before advancing'),
    ):
        offset,raw=cover(address,len(expected)//2);assert raw.hex()==expected,(hex(address),raw.hex())
        operands.append(dict(address=hex(address),file_offset=offset,bytes=len(raw),meaning=meaning))
    calls=[]
    for address,target in (
        (0x42436f,0x434990), (0x40d86d,0x434a30),
        (0x40d91b,0x434a30), (0x40d921,0x434b60),
        (0x434c6d,0x4348e0), (0x434c78,0x434990), (0x434c83,0x434990),
        (0x4310e3,0x434a90), (0x4310fc,0x434990),
        (0x412371,0x434a70), (0x41237a,0x434b60),
    ):
        cover(address,5);calls.append(image.call(hex(address),hex(target)))
    cell_offset,cell=image.locate('0x41946c',4);assert struct.unpack('<I',cell)[0]==0x40c7e8
    consumer_map=HERE.parent/'game-battle-physical-results-v1/consumer-map.json'
    group=next(row['complete_group'] for row in read(consumer_map)['body_groups'] if row['state']==14)
    pseudo=ROOT/group['source'];span=group['UTF8_byte_range'];fragment=pseudo.read_bytes()[span['start']:span['end_exclusive']]
    assert sha256(fragment).hexdigest()==group['sha256']=='4eeeb1a639b024b506ebf076156590ab469eb79b0c046bba217e1e9cfd943eef'
    result=dict(stage=276,source=source,evidence=evidence,prior=identity(prior),helpers=identity(helpers),
        rea='6.7.0',provider='Ghidra12.1.4',memory=memory,carried_windows=retained,operands=operands,calls=calls,
        original_dispatch=dict(address='0x41946c',file_offset=cell_offset,bytes=4,hex=cell.hex(),target='0x40c7e8',classification='direct original PE check'),
        body14_group=dict(map=identity(consumer_map),artifact=identity(pseudo),range=span,sha256=group['sha256']),
        supported_self=dict(categories=[0,1,3],result_mask='0x10b',shared_target_and_caster=True),
        casting_audit=dict(attached_RID='Decoder-owned tails already pass through the body wrapper; retain unowned-input refusal.',
            empty_side='Producer skips absent bodies;135 reads current target before checking the next sentinel. Empty runtime remains unverified.'),
        original_runtime_observed=False,native_device_and_official_acceptance=False,
        extent_limit='Selected raw producer/callback spans; reused body14 group and original dispatch do not claim whole-application coverage.')
    (HERE/'source-check.json').write_text(json.dumps(result,indent=2)+'\n')
    print(json.dumps({key:len(result[key]) for key in ['memory','carried_windows','operands','calls']}))

if __name__=='__main__':main()
