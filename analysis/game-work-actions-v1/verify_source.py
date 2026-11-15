#!/usr/bin/env python3
"""Bind ordinary item-work and decoration observations to fixed original bytes."""
from pathlib import Path
from hashlib import sha256
import json
import struct

ROOT = Path(__file__).resolve().parents[2]
A = ROOT / 'analysis/game-work-actions-v1'
P = ROOT / 'build/analysis/game-work-actions-v1'
DIGEST = '37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd'
PROFILE = '7810ea9437da59780820ec6fedb47ce47390841a95d527ddb6c3b3700fe180cb'
def read(p):
    return json.loads(p.read_text(encoding='utf-8'))
def identity(p):
    h=sha256()
    with p.open('rb') as f:
        for b in iter(lambda:f.read(1048576),b''): h.update(b)
    return dict(path=str(p.relative_to(ROOT)),bytes=p.stat().st_size,sha256=h.hexdigest())
def verify():
    source=ROOT/'build/analysis/game-release-current-v1/legacy-members/cg_se_6000.exe'
    observed=identity(source)
    assert observed['bytes']==1569280 and observed['sha256']==DIGEST
    data=source.read_bytes();pe=struct.unpack_from('<I',data,60)[0]
    base=struct.unpack_from('<I',data,pe+52)[0];assert base==0x400000
    table=pe+24+struct.unpack_from('<H',data,pe+20)[0]
    sections=[struct.unpack_from('<4I',data,table+i*40+8) for i in range(struct.unpack_from('<H',data,pe+6)[0])]
    def offset(address,size):
        return next(at+address-base-va for _,va,n,at in sections if 0<=address-base-va<=n-size)
    def raw(address,size):
        at=offset(address,size);return data[at:at+size]
    def admit(d):
        assert d['subject']['digest']['sha256']==DIGEST
        assert d['analysis_profile']['digest']==PROFILE
        return d
    functions=[]
    for file in sorted(P.glob('function-*.json')):
        d=admit(read(file));entry=d['normalized_result']['procedure']['address']
        body=d['normalized_result']['procedure']['body'];rows=read(P/('bytes-'+entry[2:]+'.json'))
        assert body['available'] and len(body['ranges'])==len(rows)
        ranges=[]
        for bound,row in zip(body['ranges'],rows):
            r=admit(row);start=int(bound['start'],16);n=int(bound['end'],16)-start+1;v=r['normalized_result']
            decoded=bytes.fromhex(v['bytes_hex'])
            assert v['complete'] and v['returned_bytes']==n and decoded==raw(start,n)
            ranges.append(dict(start=hex(start),bytes=n,file_offset=offset(start,n),sha256=sha256(decoded).hexdigest(),evidence_id=r['evidence_id']))
        assert sum(x['bytes'] for x in ranges)==body['total_bytes']
        functions.append(dict(entry=entry,evidence_id=d['evidence_id'],ranges=ranges))
    assert len(functions)==28 and sum(r['bytes'] for f in functions for r in f['ranges'])==11974
    previous=read(ROOT/'analysis/game-craft-input-v1/source-check.json');parents=[]
    for name in ['derived-callbacks.json','derived-window-callbacks.json','derived-level-choice.json']:
        path=ROOT/'build/analysis/game-craft-input-v1'/name
        old=next(r['artifact'] for r in previous['derived'] if r['artifact']['path']==str(path.relative_to(ROOT)))
        assert identity(path)==old
        v=read(path);assert not v['originalExecution'] and not v['originalBytePatches']
        entries=[]
        for e in v['entries']:
            assert e['status']=='derived-static-export' and e['decompileCompleted']
            total=0
            for ins in e['instructions']:
                address=int(ins['address'],16);b=bytes.fromhex(ins['bytesHex'])
                assert raw(address,len(b))==b;total+=len(b)
            assert total==e['derivedBodyBytes']
            entries.append(dict(entry='0x'+e['requestedEntry'].lstrip('0'),bytes=total,canonical_REA_function_claimed=False))
        parents.append(dict(artifact=old,entries=entries))
    assert sum(len(p['entries']) for p in parents)==14
    assert sum(e['bytes'] for p in parents for e in p['entries'])==14129
    windows=[]
    for name in ['window-labels.json','entry-labels.json','work304-mark-descriptor.json','work304-mark-lines.json','work304-spaces-a.json','work304-spaces-b.json']:
        d=admit(read(P/name));v=d['normalized_result'];address=int(v['address'],16);b=bytes.fromhex(v['bytes_hex'])
        assert v['complete'] and v['returned_bytes']==len(b) and b==raw(address,len(b))
        windows.append(dict(artifact=identity(P/name),address=v['address'],bytes=len(b),sha256=sha256(b).hexdigest(),evidence_id=d['evidence_id']))
    descriptor=bytes.fromhex(read(P/'work304-mark-descriptor.json')['normalized_result']['bytes_hex'])
    assert struct.unpack_from('<I',descriptor)[0]==0xc440d0
    assert struct.unpack('<4I',bytes.fromhex(read(P/'work304-mark-lines.json')['normalized_result']['bytes_hex']))==(1,16,0,0)
    global_byte=admit(read(P/'global-byte.json'))
    assert global_byte['normalized_result']['complete'] and global_byte['normalized_result']['bytes_hex']=='00'
    virtual,va,n,at=next(s for s in sections if 0<=0xc5bd1b-base-s[1]<s[0])
    assert 0xc5bd1b-base-va>=n
    x=admit(read(P/'work304-level-byte-xrefs.json'))
    assert x['normalized_result']==['0x476516','0x4765d2','0x47723d']
    zero=dict(address='0xc5bd1b',evidence_id=global_byte['evidence_id'],bytes_hex='00',
              original_file_byte=False,section_va=hex(base+va),virtual_bytes=virtual,raw_bytes=n,
              initialized_source='PE virtual zero fill plus observed Ghidra loader value',
              references=identity(P/'work304-level-byte-xrefs.json'),
              limitation='Source reads this signed byte for item/decorate submission,not the selected UI level;modeled owned initial byte0.No universal dynamic alias proof is claimed.')
    closure=read(P/'rea-closure.json');assert not closure['open'] and not closure['cleanup_pending']
    assert closure['close']['result']['evidence_records']==closure['export']['result']['records']==1359
    result=dict(stage=304,source=observed,tool='REA6.7.0/Ghidra12.1.4',analysis_profile=PROFILE,
                functions=functions,canonical_function_bytes=11974,parent_callbacks=parents,
                derived_entries_rechecked=14,derived_instruction_bytes_rechecked=14129,
                windows=windows,source_work_level_byte=zero,previous_source=identity(ROOT/'analysis/game-craft-input-v1/source-check.json'),
                evidence=identity(P/'rea-evidence.json'),snapshot=identity(P/'rea.snapshot.json'),closure=identity(P/'rea-closure.json'),
                retained_records=1359,ancestor_retained_records=1287,REA_closed=True,
                facts=['472a10 kind2 enters474100 work state3;217/218 repair weapon/armor,219 appraisal,220 engraving.',
                       '4789e0/4769d0 recheck description readiness,category0..6/7..14,main skill rank,item level and qualification bits.',
                       'Repair/appraise cost is int32(itemLevel*10),start475360 uses CRT5..10 plus3*itemLevel seconds,and7ba before timed+>L(slot,source signed byte,target slot,empty text).',
                       'Engraving costs10 and sends+>L immediately;0x400 permits clearing a prior mark.Delimiters are checked with DBCS byte skipping;blank validation removes20,81,40 bytes.',
                       '55b030 editor and443ab0/444b80 establish one16-byte line;12 at descriptor+0x10 is not its byte capacity.',
                       'Kind1 id255 enters474240 state6:one ordinary decoratable base and one category25/38/39 extra;4eb150 scans all56 product ids across main identifiers200..214.',
                       'Decoration costs100 and475e50 waits8000ms without rand;476170 submits decimal baseSlot|extraSlot with target-1.',
                       'Lor kind2 consumes seven decimal fields in4d7ec0;kind1 decorations retain the existing eight-field4da060 result.Cancellation/initialization clears selected slots.',
                       'Lor kind3 covers treatment/first aid/disguise/transform contexts;kind4 gathering/discovery has a distinct layout.These are mapped but not implemented by this item-work slice.'],
                limitations=['Ordinary context0 only;nonzero context scaling/requery remains required.',
                             'Source work-level byte is initial0;native mutable shared aliases and full original widget/animation/RNG cadence are not proven.',
                             'Result2 console uses its own payload attributes while native widget references older craft attribute globals;portable semantic UI uses the evidenced result2 payload,not an asserted alias equivalence.',
                             'Current inventory remains28slots;source8..99 guard does not prove expansion.',
                             'All37 original requirements/10 incomplete groups and actual platform/current/official acceptance remain active.'],
                original_execution=0,VM_actions=0,official_sessions=0,full_goal_complete=False)
    (A/'source-check.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
    print(json.dumps(dict(stage=304,functions=28,function_bytes=11974,parent_entries=14,parent_bytes=14129,records=1359,REA_closed=True)))
if __name__=='__main__':verify()
