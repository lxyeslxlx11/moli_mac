"""Original public handoff vectors + fixed-sample source anchors. No executable or network use."""
import argparse,hashlib,importlib.util,json,struct,sys
from pathlib import Path
sys.dont_write_bytecode=True
SHA='601b79565e4ac4c71605744a5087bb24582dde164f417514c74190cd4cdc6e31'
ROOT=Path(__file__).resolve().parents[2]
ALPHABET=b'0123456789abcdefghijklmnopqrstuv'
NAMES={0:'CGSharedMem',1:'CGSharedMem',2:'CGSharedMem',3:'KOHSharedMem',4:'CGSharedMem',5:'ZZSharedMem',6:'FESharedMem',7:'CGCSharedMem',9:'CG2SharedMem',11:'CGSharedMem'}
def radix32_bits(value):
 count=max(1,(value.bit_length()+4)//5)
 return bytes(ALPHABET[(value>>(index*5))&31] for index in range(count-1,-1,-1))
def expected(game,name,opaque,tail):
 mapping=NAMES.get(game)
 if mapping is None:return {'mapping_name':None,'write_hex':'','write_bytes':0,'capacity':256}
 adjusted=(tail-0x80000000)&0xffffffff
 result=b'gid:'+name+b' glt:'+opaque.split(b'\0',1)[0]+b':'+radix32_bits(adjusted)+b' \0'
 return {'mapping_name':mapping,'write_hex':result.hex(),'write_bytes':len(result),'capacity':256}
def main():
 ap=argparse.ArgumentParser();ap.add_argument('--pe',type=Path,required=True);args=ap.parse_args();data=args.pe.read_bytes()
 if hashlib.sha256(data).hexdigest()!=SHA:raise ValueError('Fixed sample identity mismatch before parsing.')
 spec=importlib.util.spec_from_file_location('launch_anchor_verifier',ROOT/'analysis/protocol-v3/launch/verify_launch.py');helper=importlib.util.module_from_spec(spec);spec.loader.exec_module(helper);pe=helper.PE32(data)
 anchors=[]
 def literal(id,va,target,value):anchors.append({'id':id,'va':hex(va),'kind':'literal_reference','target':hex(target),'literal':value})
 for row in [('gid',0x407f0c,0x4b2a7c,'gid:'),('glt',0x407f35,0x4b2a84,' glt:'),('separator',0x407f5a,0x4b2a8c,':'),('trailing-space',0x407f76,0x4b2a90,' '),('CG',0x407fc5,0x4b2a94,'CGSharedMem'),('KOH',0x4083ba,0x4b2b50,'KOHSharedMem'),('ZZ',0x4083f0,0x4b2b70,'ZZSharedMem'),('FE',0x40840e,0x4b2b7c,'FESharedMem'),('CGC',0x40842c,0x4b2b88,'CGCSharedMem'),('CG2',0x40844a,0x4b2b98,'CG2SharedMem')]:literal(*row)
 for id,va,target in [('call-ui64toa',0x407f04,0x44dd67),('call-x64toa',0x44dd7a,0x44dcf8),('mapping-copy',0x4084e2,0x44dc00)]:anchors.append({'id':id,'va':hex(va),'kind':'direct_call','target':hex(target)})
 for id,va,hexbytes in [('radix32',0x407eeb,'6a20'),('high-word-zero',0x407f00,'33d2'),('unsigned-sign-flag',0x44dd6f,'6a00'),('copy-entry-into-shared-body',0x44dc00,'578b7c2408eb6e'),('digit-alpha',0x44dd39,'80c157'),('digit-decimal',0x44dd3e,'80c130'),('copy-terminator',0x44dcf0,'8817'),('tail-subtract',0x413e18,'2d00000080')]:anchors.append({'id':id,'va':hex(va),'kind':'instruction_bytes','expected_hex':hexbytes})
 manifest={'sample':{'sha256':SHA},'anchors':anchors}
 audit=helper.verify(data,manifest)
 audit['copy_entry_jump_target']=hex(0x44dc07+struct.unpack('b',pe.at(0x44dc06,1))[0]);assert audit['copy_entry_jump_target']=='0x44dc75'
 directory=Path(__file__).parent;(directory/'handoff-anchors.json').write_text(json.dumps(manifest,indent=2)+'\n');(directory/'handoff-anchor-audit.json').write_text(json.dumps(audit,indent=2)+'\n')
 cases=[]
 def case(label,game,name,opaque,tail):cases.append({'name':label,'game_code':game,'name_hex':name.hex(),'opaque_hex':opaque.hex(),'tail_word_a':tail,'expected':expected(game,name,opaque,tail)})
 words=sorted({0,1,0x7fffffff,0x80000000,0x80000001,0xffffffff}|{value for i in range(32) for value in [(1<<i)-1,1<<i,(1<<i)+1] if value<=0xffffffff})
 for word in words:case('word-%08x'%word,11,b'OriginalGid',b'OriginalOpaque',word)
 for code in range(15):case('mapping-%d'%code,code,b'OriginalGid',b'OriginalOpaque',0x80000020)
 for label,name in [('max-name',b'N'*41),('cp936','测试甲'.encode('gbk')),('utf8','中文甲'.encode('utf-8')),('raw-high',b'\x80\xff')]:
  for at in [0,15,31,32]:
   opaque=bytes(range(1,33));opaque=opaque[:at]+(b'\0' if at<32 else b'')+opaque[at+1:] if at<32 else opaque
   case(label+'-nul-'+str(at),11,name,opaque,0x7fffffff)
 case('empty-opaque',11,b'OriginalGid',b'',0x80000000)
 original=json.loads((ROOT/'analysis/launcher-v8/original-login-vectors.json').read_text())['profiles']
 projections=[]
 for fixture in original:
  body=bytes.fromhex(fixture['body_hex']);field_len=body[9];opaque=body[10:10+field_len];tail=struct.unpack('>I',body[-8:-4])[0]
  for row in fixture['expected']['rows']:
   if row['passes']:
    projections.append({'fixture':fixture['name'],'display_ordinal':row['display_ordinal'],'expected':expected(11,bytes.fromhex(row['name_hex']),opaque,tail)})
 result={'schema':'moli.launcher-v22.original-handoff-vectors.v1','identity':'Only original public names/opaque/test reply bytes, never account/session material.','oracle':'Python arbitrary-precision bit groups and raw byte composition independent of JavaScript division algorithm; fixed source anchors separately verified.','scalar_cases':len(words),'cases':cases,'reply_projections':projections,'format':'gid:<raw-name> glt:<opaque before firstNUL>:<uint32(tailA-80000000h) in lowercase base32><space><NUL>; write prefix only, remaining256B mapping untouched.'}
 (directory/'original-handoff-vectors.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n')
 print(json.dumps({'anchors':audit['count'],'all_anchors_passed':audit['all_passed'],'scalar_cases':len(words),'cases':len(cases),'reply_projections':len(projections),'maximum_write_bytes':max(c['expected']['write_bytes'] for c in cases)}))
if __name__=='__main__':main()
