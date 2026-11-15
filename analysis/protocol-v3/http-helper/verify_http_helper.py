#!/usr/bin/env python3
"""Check fixed-sample HTTP anchors without executing the target or using a network.

Uses the adjacent audit-only PE mapper. This is evidence validation, not a product
protocol parser. Full REA dossiers stay in the temporary analysis directory.
"""
import argparse
import hashlib
import importlib.util
import json
import struct
from pathlib import Path

EXPECTED = '601b79565e4ac4c71605744a5087bb24582dde164f417514c74190cd4cdc6e31'
EXPECTED_EVIDENCE = 'ev_55ecff2200e634057c076604a9418249b9eec6b5d2d1f6757606e0f1bc81cf7f'
DIRECT = [
 (0x401991,0x41ab70,'launcher_md5 request caller'),
 (0x401b51,0x41ab70,'launcher_url request caller'),
 (0x4020a8,0x41ab70,'xml_md5 request caller'),
 (0x40229b,0x41ab70,'GameList request caller'),
 (0x402457,0x41ab70,'RegionList request caller'),
 (0x41ac07,0x445d98,'CInternetSession constructor'),
 (0x41ac8e,0x446731,'OpenURL wrapper'),
 (0x41acff,0x4462cf,'optional SendRequest wrapper'),
 (0x4462e4,0x4462a0,'SendRequest forwarding wrapper'),
 (0x41ad91,0x4457d2,'QueryInfoStatusCode wrapper'),
]
IMPORTED = [
 (0x445dd0,0x4b169c,'InternetOpenA'),
 (0x446849,0x4b1684,'InternetOpenUrlA'),
 (0x4462b7,0x4b1688,'HttpSendRequestA'),
 (0x445801,0x4b16a8,'HttpQueryInfoA'),
]
LITERALS = [(0x4b62fc,'%s?rtm=%lld'),(0x4b6308,'http://'),
 (0x4b6310,'Content-Type: application/x-www-form-urlencoded')]

def require_identity(data):
    if hashlib.sha256(data).hexdigest()!=EXPECTED:
        raise ValueError('Fixed sample SHA256 mismatch; establish a new evidence version')

def inspect(path,dossier):
    require_identity(path.read_bytes())
    module_path=Path(__file__).resolve().parent.parent/'game-network/scan_network_static.py'
    spec=importlib.util.spec_from_file_location('audit_pe',module_path)
    module=importlib.util.module_from_spec(spec);spec.loader.exec_module(module)
    pe=module.PE(path);require_identity(pe.data)
    original=dossier.read_bytes();x=json.loads(original);n=x['normalized_result']
    if x['evidence_id']!=EXPECTED_EVIDENCE or x['subject']['digest']['sha256']!=EXPECTED:
        raise ValueError('Unexpected REA evidence identity')
    imported={i['iat_va']:i for i in pe.imports}
    anchors=[]
    def offset(va,size):
        pos=pe.file(va)
        if pos is None or pos+size>len(pe.data):raise ValueError('Unbacked anchor')
        return pos
    for va,target,context in DIRECT:
        pos=offset(va,5)
        if pe.data[pos]!=0xe8:raise ValueError('Expected E8 call')
        actual=va+5+struct.unpack_from('<i',pe.data,pos+1)[0]
        if actual!=target:raise ValueError('Direct call mismatch')
        anchors.append({'kind':'direct_call','va':hex(va),'file_offset':hex(pos),'target':hex(actual),'context':context,'passed':True})
    for va,iat,name in IMPORTED:
        pos=offset(va,6)
        if pe.data[pos:pos+2]!=b'\xff\x15' or struct.unpack_from('<I',pe.data,pos+2)[0]!=iat:raise ValueError('IAT call mismatch')
        imp=imported[iat]
        if imp['symbol']!=name or imp['dll'].upper()!='WININET.DLL':raise ValueError('Wrong imported symbol')
        anchors.append({'kind':'iat_call','va':hex(va),'file_offset':hex(pos),'iat_va':hex(iat),'iat_file_offset':hex(imp['iat_file_offset']),'dll':imp['dll'],'symbol':name,'passed':True})
    for va,value in LITERALS:
        expected=value.encode('ascii')+b'\0';pos=offset(va,len(expected))
        if pe.data[pos:pos+len(expected)]!=expected:raise ValueError('Literal mismatch')
        anchors.append({'kind':'ascii_literal','va':hex(va),'file_offset':hex(pos),'value':value,'passed':True})
    # Caller byte evidence is checked above; dossier provenance and partial coverage
    # are retained without copying its source reconstruction.
    return {'source_sha256':EXPECTED,'source_bytes':len(pe.data),'tool_versions':{'rea':'6.7.0','ghidra':'12.1.4','objdump':'2.47.20260726'},
      'rea_evidence_id':x['evidence_id'],'rea_dossier_sha256':hashlib.sha256(original).hexdigest(),
      'procedure':{'address':n['procedure']['address'],'body':n['procedure']['body']},
      'flow_truncated':n['native_value_flow']['truncated'],'unresolved_calls':n['unresolved_calls'],
      'coverage_limitation':'Ghidra body ends 0x41aedd; terminal flow 0x41aed9 goes to separately modeled 0x41af63. Exception/cleanup and virtual read are not fully resolved.',
      'anchors':anchors,'passed':True,
      'negative_identity_checks':negative_checks(pe.data),
      'limits':['Static calls only, no target executed or URL contacted.','HTTP helper chain is update/catalog evidence, not authentication or game framing.','No full pseudocode or asset bytes exported.']}

def negative_checks(data):
    changed=bytearray(data);changed[0]^=1
    results={}
    for name,sample in [('modified_sample',changed),('truncated_sample',data[:128]),('empty_sample',b'')]:
        try:require_identity(sample)
        except ValueError:results[name]='rejected'
        else:raise AssertionError('Identity gate accepted a different sample')
    return results

def main():
    p=argparse.ArgumentParser(description=__doc__);p.add_argument('--pe',required=True,type=Path);p.add_argument('--dossier',required=True,type=Path);a=p.parse_args()
    print(json.dumps(inspect(a.pe,a.dossier),ensure_ascii=False,indent=2))
if __name__=='__main__':main()
