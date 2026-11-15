#!/usr/bin/env python3
"""Verify the fixed roster packet, storage and battle call sites against REA and PE bytes."""
import json
import struct
import sys

sys.dont_write_bytecode = True
from verify_formation import records, sha
from verify_source import A, P, R, info, read, same

PRIVATE = P/'friend-roster'
WINDOWS = {
    'lookup':(0x423500,231), 'classification':(0x4235f0,107), 'paired_slot':(0x419840,31),
    'detail_writer':(0x4fe0d0,442), 'summary_writer':(0x4fe290,348), 'cold_init':(0x4fe420,54),
    'capacity':(0x450152,10), 'mask_field':(0x510ea0,95), 'decimal':(0x51c5b2,139),
    'bank_clear':(0x4fe3f0,47), 'summary_receive':(0x4f48b0,19), 'detail_receive':(0x4f48d0,94),
    'detail_send':(0x4f6de0,72), 'receive_tags':(0x567d68,8), 'send_tag':(0x567b1c,4),
    'C_name_read':(0x433c40,143), 'fallback_name':(0x53459c,4), 'cold_row':(0xd5ea5c,128),
    'C_classify':(0x434559,29), 'MON_classify':(0x428020,157), 'entry_classify':(0x437e48,91),
    'detail_bridge':(0x4f4925,5), 'summary_bridge':(0x4f48ba,5), 'auto_request':(0x4fe34d,5),
    'local_cache_load':(0x5017f0,5),
}
HELPERS = (
    0x419840,0x423500,0x4235f0,0x433a10,0x433c40,0x433cd0,0x450100,0x450250,
    0x4f48b0,0x4f48d0,0x4f6de0,0x4fdf40,0x4fdff0,0x4fe0d0,0x4fe290,0x4fe3f0,
    0x4fe420,0x510d80,0x510ea0,0x51c5b2,0x51c63d,
)


def main():
    prior=read(A/'side-effects-source-check.json')
    for key in ('source','snapshot'):
        same(prior[key])
    payload=(R/prior['source']['path']).read_bytes()
    pe=struct.unpack_from('<I',payload,60)[0]
    base=struct.unpack_from('<I',payload,pe+52)[0]
    table=pe+24+struct.unpack_from('<H',payload,pe+20)[0]
    count=struct.unpack_from('<H',payload,pe+6)[0]
    sections=[struct.unpack_from('<4I',payload,table+i*40+8) for i in range(count)]

    def original(address,length,virtual_zero=False):
        for virtual,va,size,offset in sections:
            relative=address-base-va
            if 0<=relative<=size-length:
                return payload[offset+relative:offset+relative+length]
            if virtual_zero and size<=relative<=virtual-length:
                return bytes(length)
        raise AssertionError((hex(address),length))

    def target(address):
        call=original(address,5)
        assert call[0]==0xe8,hex(address)
        return address+5+struct.unpack('<i',call[1:])[0]

    def admit(row):
        assert row['subject']['digest']['sha256']==prior['source']['sha256']
        assert row['analysis_profile']['digest']==prior['analysis_profile']
        return row

    snapshot=PRIVATE/'rea.snapshot.json'
    before=set(records(R/prior['snapshot']['path']))
    after=records(snapshot)
    closure=read(PRIVATE/'rea-closure.json')
    assert before<=after.keys()
    assert len(before)==641 and len(after)==closure['close']['evidence_records']==706
    assert not closure['open'] and not closure['cleanup_pending']
    assert snapshot.stat().st_size==closure['close']['bytes']

    raw={}
    for name,(address,size) in WINDOWS.items():
        row=admit(next(r for r in after.values() if r['operation']=='read_bytes'
                       and r['normalized_result']['address']==hex(address)
                       and r['normalized_result']['returned_bytes']==size))
        result=row['normalized_result']
        data=bytes.fromhex(result['bytes_hex'])
        assert result['complete'] and len(data)==size and data==original(address,size,name=='cold_row')
        raw[name]=dict(address=hex(address),bytes=size,sha256=sha(data),evidence_id=row['evidence_id'])
        if name=='cold_row':
            raw[name]['mapping']='PE virtual zero-fill'

    calls={
        0x42361b:0x419840,0x42363d:0x423500,0x428099:0x4235f0,0x434564:0x4235f0,
        0x437e92:0x4235f0,0x4f48ba:0x4fe290,0x4f4925:0x4fe0d0,0x4fe34d:0x4f6de0,
        0x4f94ce:0x4f48b0,0x4f96cb:0x4f48d0,0x5017f0:0x4fdff0,
    }
    for address,expected in calls.items():
        assert target(address)==expected,(hex(address),hex(expected))
    assert original(0x450152,10)==bytes.fromhex('c705ac39c40040010000')
    assert original(0x567d68,8)==b'B8S\0@t-\0'
    assert original(0x567b1c,4)==b"'q=\0"
    assert original(0x53459c,4)==b'???\0'

    helpers,dossiers={},{}
    for address in HELPERS:
        row=admit(next(r for r in after.values() if r['operation']=='analyze_function'
                       and r['normalized_result']['procedure']['address']==hex(address)))
        dossier=row['normalized_result']
        dossiers[address]=dossier
        body=dossier['procedure']['body']
        assert body['available'] and body['contains_entry']
        spans=[]
        for span in body['ranges']:
            start,end=int(span['start'],16),int(span['end'],16)
            data=original(start,end-start+1)
            spans.append(dict(**span,bytes=len(data),sha256=sha(data)))
        assert sum(span['bytes'] for span in spans)==body['total_bytes']
        helpers[hex(address)]=dict(ranges=spans,evidence_id=row['evidence_id'])

    lookup=dossiers[0x423500]['pseudocode']
    assert all(key in lookup for key in ('0xa000','0x80','0x13f','0x288','0x28a','0x28c','0x28e'))
    summary=dossiers[0x4fe290]['pseudocode']
    assert all(key in summary for key in ('FUN_00510ea0','FUN_004f6de0','< param_1','DAT_00d5ea54','== \'\\0\''))
    detail=dossiers[0x4fe0d0]['pseudocode']
    assert all(f'DAT_00d5ea{offset:x} + iVar3) = param_{param}' in detail
               for offset,param in zip((0x7c,0x80,0x84,0x88),(11,12,13,14)))
    assert '0x10 <' in detail and 'DAT_0053459c' in detail
    catalog=read(R/'analysis/game-legacy-message-v1/dispatch-catalog.json')
    incoming={row['consumer']:row for row in catalog['incoming']}
    request=next(row for row in catalog['outgoing'] if row['producer']=='0x4f6de0')
    assert incoming['0x4f48b0']['tag']=='@t-' and incoming['0x4f48b0']['fields']==['int32','bytes']
    assert incoming['0x4f48d0']['tag']=='B8S' and incoming['0x4f48d0']['fields']==['int32']*15+['bytes']*2
    assert request['tag']=="'q=" and request['fields']==['int32']
    evidence=dict(
        schema='moli.37c4-battle-friend-roster-source.v1',source=prior['source'],analysis_profile=prior['analysis_profile'],
        tool='REA 6.7.0 / Ghidra 12.1.4',closed=True,snapshot=info(snapshot),
        session_closure=info(PRIVATE/'rea-closure.json'),retained_records=len(after),new_retained_records=len(after)-len(before),
        raw_windows=raw,helpers=helpers,calls={hex(a):hex(t) for a,t in calls.items()},
        facts=dict(
            table='Two banks of 320 rows, stride 0x80, with an active byte. Name at row+0x34. Four nonzero tests at row+0x20,0x24,0x28,0x2c.',
            classify='4235f0 clears FE0 low bit, sets for local or paired, otherwise looks up only the opposite side. C, MON and entry call it.',
            summary='@t- takes signed revision and up to ten pipe-separated decimal words. Clear absent bits. Ask for missing or newer set bits in ascending order.',
            detail='B8S takes 15 integers and two byte fields. One-based row index. Arguments 11–14 populate the four tested fields. The last byte field is the name, with a 16-byte limit and ??? fallback.',
            cache='450250 initializes both banks. 5015a0 also calls a file-cache loader. Detail writer and bank clear can invoke a file writer.',
        ),
        pending=['Native cache identity, persistence and character switching', 'Unresolved indirect/native UI paths and original live timing'],
        VM_actions=0,original_execution=0,official_sessions=0,phase_complete=False,
    )
    (A/'friend-roster-source-check.json').write_text(json.dumps(evidence,ensure_ascii=False,indent=2)+'\n')
    print(f"REA retained {len(after)} (+{len(after)-len(before)}), {len(raw)} byte windows, {len(helpers)} helpers, closed")


if __name__=='__main__':
    main()
