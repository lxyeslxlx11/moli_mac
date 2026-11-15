#!/usr/bin/env python3
"""Fixed-sample, read-only verifier for a narrow launch context; no target execution."""
import argparse
import hashlib
import importlib.util
import json
import struct
from pathlib import Path

BASE=Path(__file__).resolve().parent
SPEC=importlib.util.spec_from_file_location('prior_launch_verifier', BASE.parent/'protocol-v3/launch/verify_launch.py')
PRIOR=importlib.util.module_from_spec(SPEC);SPEC.loader.exec_module(PRIOR)

def branch_target(va, data):
    if len(data)==2 and data[0] in (0x74,0x75,0x76,0x72):
        return va+2+struct.unpack('<b',data[1:])[0]
    if len(data)==6 and data[:2] in (b'\x0f\x84',b'\x0f\x85'):
        return va+6+struct.unpack('<i',data[2:])[0]
    if len(data)==5 and data[0]==0xe9:
        return va+5+struct.unpack('<i',data[1:])[0]
    raise ValueError('Unsupported or truncated branch encoding')

def verify(data,manifest):
    if hashlib.sha256(data).hexdigest()!=manifest['sample']['sha256']:
        raise ValueError('Sample hash mismatch; not a compatible-version claim')
    pe=PRIOR.PE32(data);imports=pe.imports();out=[]
    ids=[r['id'] for r in manifest['anchors']]
    if len(ids)!=len(set(ids)):raise ValueError('Duplicate anchor IDs')
    for row in manifest['anchors']:
        va=int(row['va'],16);expect=bytes.fromhex(row['expected_hex'])
        actual=pe.at(va,len(expect))
        if actual!=expect:raise ValueError('Instruction mismatch: '+row['id'])
        observed={'id':row['id'],'va':row['va'],'file_offset':hex(pe.offset(va,len(expect))),'passed':True}
        if 'branch_target' in row:
            target=branch_target(va,actual)
            if target!=int(row['branch_target'],16):raise ValueError('Branch mismatch')
            observed['branch_target']=hex(target)
        if 'api' in row:
            if actual[:2]!=b'\xff\x15' or len(actual)!=6:raise ValueError('Not IAT call')
            iat=struct.unpack('<I',actual[2:])[0]
            if imports.get(iat,(None,None))[1]!=row['api']:raise ValueError('API mismatch')
            observed.update(iat=hex(iat),api=imports[iat][1],dll=imports[iat][0])
        out.append(observed)
    return {'scope':'Static fixed-sample context only; no account/runtime values','sample_sha256':manifest['sample']['sha256'],'all_passed':True,'count':len(out),'anchors':out}

def main():
    p=argparse.ArgumentParser(description=__doc__);p.add_argument('--pe',type=Path,required=True);args=p.parse_args()
    if args.pe.stat().st_size>PRIOR.MAX_BYTES:raise ValueError('Sample size budget exceeded')
    print(json.dumps(verify(args.pe.read_bytes(),json.loads((BASE/'launch-context.json').read_text())),ensure_ascii=False,indent=2))
if __name__=='__main__':main()
