#!/usr/bin/env python3
"""Verify the fixed REB/PLV producer, actor callbacks, and draw conventions."""
import json
import re
import struct
import sys

sys.dont_write_bytecode = True
from verify_formation import records, sha
from verify_source import A, P, R, info, read, same

PRIVATE = P/'actor-transitions'
WINDOWS = {
    'dispatch':(0x433650,96), 'token_pointers':(0x533e54,96),
    'reb_name':(0x534084,4), 'plv_name':(0x534090,4),
    'reb':(0x432bd2,316), 'plv':(0x428c2e,328), 'plv_wait':(0x4284e1,48),
    'body_dispatch':(0x4196a0,20), 'action_158':(0x412bed,1690), 'action_158_loop':(0x413040,24),
    'action_12':(0x40a46e,315), 'action_13':(0x40a5a9,260), 'action_49':(0x40ea47,55),
    'row_permutation':(0x5337b0,88), 'entry_rows':(0x533808,352),
    'normalize':(0x500a70,142), 'tuple_next':(0x434b60,47),
    'transition_step':(0x41b0e0,45), 'transition_factory':(0x41b110,150),
    'follower_step':(0x41b1b0,64), 'follower_factory':(0x41b1f0,163),
}
HELPERS = (0x41b0e0,0x41b110,0x41b1f0,0x434af0,0x434b60,0x466a20,0x500a70,0x506e80,0x51b4cf)


def main():
    prior=read(A/'friend-roster-source-check.json')
    for key in ('source','snapshot'):
        same(prior[key])
    payload=(R/prior['source']['path']).read_bytes()
    pe=struct.unpack_from('<I',payload,60)[0]
    base=struct.unpack_from('<I',payload,pe+52)[0]
    table=pe+24+struct.unpack_from('<H',payload,pe+20)[0]
    count=struct.unpack_from('<H',payload,pe+6)[0]
    sections=[struct.unpack_from('<4I',payload,table+i*40+8) for i in range(count)]

    def original(address,length):
        for _,va,size,offset in sections:
            relative=address-base-va
            if 0<=relative<=size-length:
                return payload[offset+relative:offset+relative+length]
        raise AssertionError((hex(address),length))

    def word(address):
        return struct.unpack('<I',original(address,4))[0]

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
    assert len(before)==706 and len(after)==closure['close']['evidence_records']==736
    assert not closure['open'] and not closure['cleanup_pending']
    assert snapshot.stat().st_size==closure['close']['bytes']
    raw={}
    for name,(address,size) in WINDOWS.items():
        row=admit(next(r for r in after.values() if r['operation']=='read_bytes'
                       and r['normalized_result']['address']==hex(address)
                       and r['normalized_result']['returned_bytes']==size))
        result=row['normalized_result']
        data=bytes.fromhex(result['bytes_hex'])
        assert result['complete'] and len(data)==size and data==original(address,size)
        raw[name]=dict(address=hex(address),bytes=size,sha256=sha(data),evidence_id=row['evidence_id'])

    assert [word(0x433650+4*i) for i in (16,19)]==[0x428c2e,0x432bd2]
    assert [original(word(0x533e54+4*i),4) for i in (16,19)]==[b'PLV\0',b'REB\0']
    assert [word(0x419434+4*i) for i in (12,13,49,158)]==[0x40a46e,0x40a5a9,0x40ea47,0x412bed]
    assert target(0x428c62)==0x51b4cf and target(0x428c6b)==target(0x428c90)==0x466a20
    assert target(0x432c77)==0x500a70 and target(0x432cb9)==0x434af0
    assert target(0x4284eb)==target(0x432be8)==0x434b90
    slotmap=struct.unpack('<22I',original(0x5337b0,88))
    rows=list(struct.iter_unpack('<4i',original(0x533808,352)))
    raw_slots=[slotmap.index(i) for i in range(20)]
    code=(R/'shared/legacy-game-battle-data.mjs').read_text()
    port_slots=json.loads(re.search(r'ENTRY_ROW_SLOTS=Object.freeze\((\[[^\n]+\])\)',code)[1])
    assert port_slots==raw_slots
    layout=json.loads(re.search(r'SLOT_LAYOUT=Object.freeze\((\[[^\n]+\])\.map',code)[1])
    assert all(row[:2]==tuple(layout[slot]['entry']) for row,slot in zip(rows,raw_slots))

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
    draw='\n'.join(dossiers[0x506e80]['assembly'])
    assert all(line in draw for line in ('0x50701c: MOV AL, byte ptr [ESI + 0x309]',
               '0x507029: NOT AL','0x507038: MOV DL, byte ptr [ESI + 0x310]',
               '0x50703e: AND DL, CL'))
    assert 'FUN_0041b0e0' in dossiers[0x41b110]['pseudocode']
    assert 'LAB_0041b1b0' in dossiers[0x41b1f0]['pseudocode']
    assert '0xc9c' in dossiers[0x434b60]['pseudocode']

    retained=read(A/'source-check.json')['retained_derived_main']['evidence']
    same(retained)
    entries=read(R/retained['path'])['entries']
    main_record=next(item for item in entries if item['requestedEntry']=='004260b0')
    checked={}
    for label in ('reb','plv'):
        start,length=WINDOWS[label]
        rows_=[row for row in main_record['instructions'] if start<=int(row['address'],16)<start+length]
        assert sum(len(row['bytesHex'])//2 for row in rows_)==length
        for row in rows_:
            data=bytes.fromhex(row['bytesHex'])
            assert data==original(int(row['address'],16),len(data))
        checked[label]=dict(instructions=len(rows_),bytes=length)
    groups=R/'build/analysis/game-battle-physical-family-v1/body-cases-private.json'
    case=next(row for row in read(groups) if row['case']==158)
    assert sha(case['text'].encode())==case['sha256']=='97c020132570e343d2897777a75b9e1988b360bc5f6868069ff95166f2f15ebb'
    proof=dict(
        schema='moli.37c4-battle-actor-transitions-source.v1',source=prior['source'],analysis_profile=prior['analysis_profile'],
        tool='REA 6.7.0 / Ghidra 12.1.4',closed=True,snapshot=info(snapshot),
        session_closure=info(PRIVATE/'rea-closure.json'),retained_records=len(after),new_retained_records=len(after)-len(before),
        raw_windows=raw,helpers=helpers,retained_command_assembly=dict(source=retained,checked=checked),
        retained_body_case=dict(source=info(groups),case=158,fragment_sha256=case['sha256']),
        facts=dict(
            REB='432bd2 parses slot, flags, normalized resource and an optional selector. It queues 24,38,158,62 and one four-word result tuple.',
            apply='412bed fades down by seven until the resource swap, then waits for the transition before installing four followers. A same-resource apply skips the fade down.',
            clear='412bed clears current element references and the draw mask, swaps resource and fades in by seven. 434b60 advances the tuple cursor.',
            PLV='428c2e seeds the CRT by mapped slot. Two range draws index separate raw coordinate rows. The 12,66,78,13,49 queue completes before removal.',
            mask='506e80 uses actor+309 as mask and actor+310 as value. The default portable alpha path remains separate from native driver parity.',
        ),
        pending=['CFP and other command consumers','Alternate renderer, original live timing and native pointer alias edge cases'],
        VM_actions=0,original_execution=0,official_sessions=0,phase_complete=False,
    )
    (A/'actor-transitions-source-check.json').write_text(json.dumps(proof,ensure_ascii=False,indent=2)+'\n')
    print(f"REA retained {len(after)} (+{len(after)-len(before)}), {len(raw)} byte windows, {len(helpers)} helpers, closed")


if __name__=='__main__':
    main()
