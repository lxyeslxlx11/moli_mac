"""Bind repeated SKL400 appends, launch traversal and the retained wait recovery."""
from hashlib import sha256
import json
from pathlib import Path
from runpy import run_path

HERE=Path(__file__).resolve().parent
ROOT=HERE.parents[1]
PRIVATE=ROOT/'build/analysis'/HERE.name
STARTUP=run_path(str(HERE.parent/'game-legacy-startup-materials-v1/verify_source.py'))
NETWORK=run_path(str(HERE.parent/'game-legacy-network-v1/verify_source.py'))
identity=STARTUP['identity']
read=lambda path:json.loads(path.read_text())

def main():
    image=STARTUP['Image'](NETWORK['TARGET'],1569280,NETWORK['SHA'])
    source=identity(image.path)
    prior=HERE.parent/'game-battle-shared-storage-v1/pursuit-source-check.json'
    assert identity(prior)['sha256']=='c867c04c8f76a9324b1237a21a3145f9af478ed93165152c5bcbe8f03121af17'
    previous=read(prior);assert previous['source']==source
    bundle,closure=PRIVATE/'rea-evidence.json',PRIVATE/'rea-closed.json'
    assert read(closure)==dict(open=False,cleanup_pending=False,rea='6.7.0')
    ledger=read(bundle);assert len(ledger['records'])==9 and not ledger['unknowns']
    assert ledger['artifacts'][0]['digest']['sha256']==source['sha256']
    memory,metadata,windows=[],[],[]
    for record in ledger['records']:
        assert (record['provider']['id'],record['provider']['version'])==('ghidra','12.1.4')
        assert record['subject']['digest']['sha256']==source['sha256']
        if record['operation']!='read_bytes':
            assert record['operation']=='read_function_instructions'
            assert record['normalized_result']['procedure']['address']=='0x434990'
            metadata.append(dict(operation=record['operation'],evidence=record['evidence_id']))
            continue
        result=record['normalized_result'];address,length=result['address'],result['requested_bytes']
        offset,raw=image.locate(address,length)
        assert result['complete'] and result['returned_bytes']==length and raw.hex()==result['bytes_hex']
        memory.append(dict(address=address,file_offset=offset,bytes=length,sha256=sha256(raw).hexdigest(),evidence=record['evidence_id']))
        start=int(address,16);windows.append((start,start+length))
    assert len(memory)==8 and len(metadata)==1
    retained=[]
    for address in ['0x434990','0x434af0','0x434b90']:
        helper=previous['helpers'][address]
        for row in helper['ranges']:
            offset,raw=image.locate(row['start'],row['bytes']);assert sha256(raw).hexdigest()==row['sha256']
            retained.append(dict(address=row['start'],file_offset=offset,bytes=row['bytes'],sha256=row['sha256'],evidence=helper['evidence_id']))
            start=int(row['start'],16);windows.append((start,start+row['bytes']))
    assert len(retained)==3
    def cover(address,length):
        assert any(start<=address and address+length<=stop for start,stop in windows),hex(address)
        return image.locate(hex(address),length)
    operands=[]
    for address,expected in (
        (0x430a76,'be00010000'),(0x430ac9,'3dff000000'),(0x430b20,'3bc1'),
        (0x430b2b,'6a00'),(0x430b43,'6a00'),(0x430b5a,'3bc1'),
        (0x430b60,'6890010000'),(0x430b7b,'68f1000000'),(0x430b9c,'f6c108'),
        (0x430ba1,'f7c100010010'),(0x430c43,'6a4a'),(0x430c56,'e95ffeffff'),
        (0x4349af,'41'),(0x434b58,'41'),(0x4149f4,'6a1f'),(0x414a10,'3bc8'),
        (0x414a12,'7410'),(0x434c46,'3d201c0000'),(0x434c74,'6a0b'),(0x434c7f,'6a26'),
    ):
        offset,raw=cover(address,len(expected)//2);assert raw.hex()==expected,(hex(address),raw.hex())
        operands.append(dict(address=hex(address),file_offset=offset,bytes=len(raw)))
    calls=[]
    for address,target in (
        (0x4309d8,0x434af0),(0x4309f1,0x434990),(0x430a06,0x434990),(0x430a1c,0x434990),
        (0x430a32,0x434990),(0x430a4d,0x434990),(0x430a63,0x434990),
        (0x430b0d,0x434af0),(0x430b2f,0x434990),(0x430b47,0x434990),
        (0x430b70,0x434af0),(0x430b89,0x434990),(0x430bfe,0x434990),(0x430c29,0x434990),
        (0x430c4e,0x434990),(0x430c74,0x434af0),
        (0x4149e0,0x41a240),(0x4149f8,0x41dc00),(0x414a1c,0x434a30),
        (0x414a25,0x434b60),(0x414a30,0x434b60),
        (0x434c6d,0x4348e0),(0x434c78,0x434990),(0x434c83,0x434990),
    ):
        cover(address,5);calls.append(image.call(hex(address),hex(target)))
    result=dict(stage=273,source=source,evidence=identity(bundle),closure=identity(closure),prior=identity(prior),
        rea='6.7.0',provider='Ghidra 12.1.4',memory=memory,carried_windows=retained,metadata=metadata,
        operands=operands,calls=calls,original_runtime_observed=False,native_device_and_official_acceptance=False,
        extent_limit='The producer, body callback and pursuit windows are selected raw PE spans. Canonical whole-function discovery is not claimed for these interior entries.')
    (HERE/'source-check.json').write_text(json.dumps(result,indent=2)+'\n')
    print(json.dumps({key:len(result[key]) for key in ['memory','carried_windows','operands','calls']}))

if __name__=='__main__':main()
