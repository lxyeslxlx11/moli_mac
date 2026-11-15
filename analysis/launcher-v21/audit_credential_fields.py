"""Fixed-sample offline operand audit. Never executes an executable or reads user state."""
import argparse,bisect,hashlib,json,re,struct
from pathlib import Path
SAMPLE_SHA256='601b79565e4ac4c71605744a5087bb24582dde164f417514c74190cd4cdc6e31'
EXPECTED={
 '84 14 00 00':[0x40fe1b,0x4100ef,0x410375,0x4103b9,0x41151b,0x4118be,0x4118d0,0x41192e,0x415406,0x415418,0x415f2c,0x4160a3,0x4acf9e,0x4ad168],
 '88 14 00 00':[0x40fe32,0x4100dd,0x41039f,0x4103cd,0x41154c,0x411895,0x4118a7,0x411915,0x415f42,0x4160b9,0x4acfac,0x4ad176],
}
def audit(sample,bundle_path):
 data=Path(sample).read_bytes()
 if hashlib.sha256(data).hexdigest()!=SAMPLE_SHA256:raise ValueError('Sample identity mismatch before parsing.')
 pe=struct.unpack_from('<I',data,0x3c)[0]
 if data[:2]!=b'MZ' or data[pe:pe+4]!=b'PE\0\0':raise ValueError('Expected fixed PE.')
 coff=pe+4;machine,sections=struct.unpack_from('<HH',data,coff);opt=coff+20
 if machine!=0x14c or struct.unpack_from('<H',data,opt)[0]!=0x10b:raise ValueError('Expected fixed x86 PE32.')
 base=struct.unpack_from('<I',data,opt+28)[0];table=opt+struct.unpack_from('<H',data,coff+16)[0]
 rows=[]
 for i in range(sections):
  at=table+40*i;name=data[at:at+8].split(b'\0')[0].decode('ascii');vs,rva,size,offset=struct.unpack_from('<IIII',data,at+8)
  rows.append((name,vs,rva,size,offset))
 text=next(row for row in rows if row[0]=='.text');_,vs,rva,size,offset=text
 body=data[offset:offset+size]
 if len(body)!=size:raise ValueError('Incomplete source section.')
 bundle_bytes=Path(bundle_path).read_bytes();bundle=json.loads(bundle_bytes)
 records=bundle['records'];matched=[]
 def file_offset(address):
  matching=[raw+(address-base-va) for _,_,va,raw_size,raw in rows if va<=address-base<va+raw_size]
  if len(matching)!=1:raise ValueError('Source mapping ambiguous.')
  return matching[0]
 for pattern,expected in EXPECTED.items():
  needle=bytes.fromhex(pattern);found=[];cursor=0
  while True:
   at=body.find(needle,cursor)
   if at<0:break
   found.append(base+rva+at);cursor=at+1
  if found!=expected:raise ValueError('Full source .text pattern positions changed.')
  native_records=sorted([x for x in records if x['operation']=='search_bytes' and x['parameters'].get('pattern')==pattern],key=lambda x:int(x['parameters']['start'],16))
  sites=[]
  for native in native_records:
   observed=native['normalized_result']
   if not observed['complete'] or observed['next_cursor'] is not None:raise ValueError('Incomplete native search.')
   for site in observed['matches']:sites.append((site,native))
  if [int(site['address'],16) for site,_ in sites]!=expected:raise ValueError('Native/source positions differ.')
  for site,native in sites:
   address=int(site['address'],16);entry=site['procedure']['address']
   dossier=next(x for x in records if x['operation']=='analyze_function' and x['normalized_result']['procedure']['address']==entry)
   listing=dossier['normalized_result']['assembly'];instructions=[]
   for item in listing:
    match=re.match(r'^(0x[0-9a-f]+): (.*)$',item)
    if match:instructions.append((int(match.group(1),16),match.group(2)))
   locations=[x[0] for x in instructions];index=bisect.bisect_right(locations,address)-1
   start,instruction=instructions[index];end=instructions[index+1][0]
   if not start<=address<address+4<=end or hex(int.from_bytes(needle,'little')) not in instruction:raise ValueError('Pattern is not in the expected operand.')
   raw=file_offset(address)
   if raw!=site['file_offset'] or data[raw:raw+4]!=needle:raise ValueError('Native original-byte mapping differs.')
   matched.append({'field_displacement':hex(int.from_bytes(needle,'little')),'address':hex(address),'file_offset':raw,'function':entry,'function_evidence_id':dossier['evidence_id'],'search_evidence_id':native['evidence_id'],'instruction_address':hex(start),'instruction_bytes':data[file_offset(start):file_offset(end)].hex()})
 dtor=next(x for x in records if x['operation']=='analyze_function' and x['normalized_result']['procedure']['address']=='0x40ff60')
 releases=[];listing=dtor['normalized_result']['assembly']
 for i,line in enumerate(listing):
  if '0x1484' not in line and '0x1488' not in line:continue
  for candidate in listing[i+1:i+5]:
   m=re.match(r'^(0x[0-9a-f]+): CALL (?:0x)?(?:FUN_0040bcd0|0040bcd0|40bcd0)$',candidate)
   if m:
    va=int(m.group(1),16);raw=file_offset(va)
    if data[raw]!=0xe8 or va+5+struct.unpack_from('<i',data,raw+1)[0]!=0x40bcd0:raise ValueError('Destructor release call differs.')
    releases.append({'call':hex(va),'file_offset':raw,'target':'0x40bcd0'});break
 if len(releases)!=2:raise ValueError('Expected two observed CString releases.')
 unwind=[]
 for entry in ['0x4acf99','0x4acfa7','0x4ad163','0x4ad171']:
  record=next(x for x in records if x['operation']=='analyze_function' and x['normalized_result']['procedure']['address']==entry)
  jump=next(line for line in record['normalized_result']['assembly'] if ': JMP ' in line)
  va=int(jump.split(':',1)[0],16);raw=file_offset(va)
  if data[raw]!=0xe9 or va+5+struct.unpack_from('<i',data,raw+1)[0]!=0x40bcd0:raise ValueError('Unwind release jump differs.')
  unwind.append({'function':entry,'evidence_id':record['evidence_id'],'jump':hex(va),'file_offset':raw,'target':'0x40bcd0'})
 return {'schema':'moli.launcher-v21.credential-operands.v1','sample_sha256':SAMPLE_SHA256,'REA_bundle_sha256':hashlib.sha256(bundle_bytes).hexdigest(),'source_section':{'name':'.text','rva':hex(rva),'virtual_bytes':vs,'file_offset':offset,'raw_bytes':size,'sha256':hashlib.sha256(body).hexdigest()},'REA_search_scope':'Two adjacent complete searches0x401000..0x4aafff and0x4ab000..0x4b0dff cover the full720384B .text including padding; independent raw-source positions match.','operand_count':len(matched),'operands':matched,'destructor_evidence_id':dtor['evidence_id'],'destructor_releases':releases,'unwind_releases':unwind,'all_checks_passed':True,'limit':'Literal displacement inventory only. Rebasing, aliases, indirect callbacks, edit controls and unrelated storage APIs are not a whole-program persistence proof; CString release is not a zeroization or durability claim.'}
def main():
 parser=argparse.ArgumentParser();parser.add_argument('sample');parser.add_argument('bundle');parser.add_argument('--output',required=True);args=parser.parse_args()
 result=audit(args.sample,args.bundle);Path(args.output).write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n');print(json.dumps({'operands':result['operand_count'],'destructor_releases':len(result['destructor_releases']),'unwind_releases':len(result['unwind_releases']),'all_checks_passed':True}))
if __name__=='__main__':main()
