#!/usr/bin/env python3
"""Source-bound protocol metadata extraction. No target execution or copied pseudocode output."""
from pathlib import Path
import argparse
import hashlib
import json
import re
import struct

ROOT=Path(__file__).resolve().parents[2]
HERE=Path(__file__).resolve().parent
DEFAULT=ROOT/'build/analysis/game-legacy-message-v1/rea-final.json'
SHA='37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd'

def extract(path):
    bundle=json.loads(path.read_text());records=bundle['records']
    assert all(r['subject']['digest']['sha256']==SHA for r in records)
    functions={r['normalized_result']['procedure']['address']:r for r in records if r['operation']=='analyze_function'}
    source=ROOT/'build/analysis/game-release-current-v1/legacy-members/cg_se_6000.exe'
    raw=source.read_bytes();assert hashlib.sha256(raw).hexdigest()==SHA
    pe=struct.unpack_from('<I',raw,60)[0];base=struct.unpack_from('<I',raw,pe+52)[0]
    count,optional=struct.unpack_from('<H',raw,pe+6)[0],struct.unpack_from('<H',raw,pe+20)[0];table=pe+24+optional
    sections=[struct.unpack_from('<4I',raw,table+i*40+8)[1:] for i in range(count)]
    def tag(address):
        rva=int(address,16)-base;locations=[offset+rva-start for start,size,offset in sections if start<=rva and rva+4<=start+size]
        assert len(locations)==1;at=locations[0];word=raw[at:at+4];end=word.index(0);text=word[:end].decode('ascii')
        assert 1<=len(text)<=3 and all(33<=ord(c)<=126 for c in text)
        return text,at,hashlib.sha256(word).hexdigest()
    parent=functions['0x4f8a40'];text=parent['normalized_result']['pseudocode'];starts=list(re.finditer(r'pbVar27 = &DAT_(00[0-9a-f]+);',text));incoming=[]
    for i,m in enumerate(starts):
        block=text[m.end():starts[i+1].start() if i+1<len(starts) else len(text)]
        matches=re.findall(r'FUN_(004fcae0|004fcb00)\(\*\(undefined4 \*\)\(DAT_00567ddc \+ (0x[0-9a-f]+|[0-9]+)\)\)',block)
        fields=[dict(index=int(offset,0)//4,type='int32' if helper=='004fcae0' else 'bytes') for helper,offset in matches]
        assert [r['index'] for r in fields]==list(range(1,len(fields)+1))
        handlers=[x for x in re.findall(r'FUN_(00[0-9a-f]+)\(',block) if not x.startswith('004fc')]
        assert len(handlers)<=1
        reset="DAT_00c60528 = 0;" in block
        assert bool(handlers) != reset
        action='reset-bootstrap' if reset else 'no-op' if handlers[0]=='00507690' else 'dispatch'
        address=hex(int(m.group(1),16));value,offset,digest=tag(address)
        incoming.append(dict(id='receive-'+m.group(1),tag=value,tag_address=address,tag_file_offset=offset,tag_word_sha256=digest,
                             fields=[r['type'] for r in fields],consumer=None if reset else hex(int(handlers[0],16)),action=action,
                             native_return=0 if 'return 0;' in block else -1,evidence=parent['evidence_id']))
    assert len(incoming)==104 and max(len(r['fields']) for r in incoming)==17
    init=functions['0x4fcea0'];senders=init['normalized_result']['callers'];outgoing=[]
    for caller in senders:
        r=functions[caller['address']];p=r['normalized_result']['pseudocode'];n=r['normalized_result']
        match=re.search(r'FUN_004fcea0\([^;]+;',p);assert match
        address=hex(int(re.findall(r'00[0-9a-f]{6}',match.group(0))[-1],16));value,offset,digest=tag(address)
        fields=re.findall(r'FUN_(004fca70|004fcab0)\(param_(\d+)(?:,[^;]+)?\);',p)
        assert [int(index) for _,index in fields]==list(range(2,len(fields)+2))
        assert len(re.findall(r'FUN_004fca(?:70|b0)\(',p))==len(fields)
        assert 'FUN_004fce00(param_1,DAT_00567db8);' in p
        assert not any(token in p for token in ['if (','while (','switch('])
        outgoing.append(dict(id='send-'+caller['address'][2:].zfill(8),tag=value,tag_address=address,tag_file_offset=offset,tag_word_sha256=digest,
                             fields=['int32' if helper=='004fca70' else 'bytes' for helper,_ in fields],producer=caller['address'],evidence=r['evidence_id']))
    assert len(outgoing)==60 and len({r['tag'] for r in incoming})==104 and len({r['tag'] for r in outgoing})==60
    return dict(schema='moli.legacy-game-text-catalog.v1',profile='legacy-se6000-37c4-message-v1',source_sha256=SHA,
                coverage=dict(incoming_branches=104,outgoing_formatter_callers=60,maximum_incoming_fields=17,maximum_outgoing_fields=max(len(r['fields']) for r in outgoing),
                              scope='Exactly the retained4f8a40 text branches and all retained4fcea0 callers; not binary/control/gameplay completeness.'),
                incoming=incoming,outgoing=outgoing,dispatch_evidence=parent['evidence_id'],formatter_callers_evidence=init['evidence_id'])

def main():
    parser=argparse.ArgumentParser();parser.add_argument('--bundle',type=Path,default=DEFAULT);parser.add_argument('--write-module',action='store_true');args=parser.parse_args()
    catalog=extract(args.bundle);(HERE/'dispatch-catalog.json').write_text(json.dumps(catalog,ensure_ascii=False,indent=2)+'\n')
    if args.write_module:
        fields=lambda row:{k:row[k] for k in ['id','tag','fields']+(['consumer','action','native_return'] if 'consumer' in row else ['producer'])}
        data={direction:[fields(row) for row in catalog[direction]] for direction in ['incoming','outgoing']}
        module='''/** Source-bound metadata, not native code or inferred business names. Generated by extract_catalog.py. */\nconst data = '''+json.dumps(data,ensure_ascii=False,indent=2)+''';\nfor (const rows of Object.values(data)) {\n  for (const row of rows) { Object.freeze(row.fields); Object.freeze(row); }\n  Object.freeze(rows);\n}\nexport const LEGACY_GAME_MESSAGE_CATALOG = Object.freeze(data);\n'''
        (ROOT/'shared/legacy-game-catalog.mjs').write_text(module)
    print(json.dumps(catalog['coverage']))

if __name__=='__main__':main()
