#!/usr/bin/env python3
"""Reverify the fixed PE, complete retained source ranges and finite evidence identities."""
from pathlib import Path
import json,hashlib,struct,re
A=Path(__file__).resolve().parent;R=A.parent.parent;P=R/'build/analysis/game-battle-numeric-skills-v1';OLD=R/'build/analysis/game-battle-status-skills-v1'
def read(p):return json.loads(p.read_text())
def info(p):
    h=hashlib.sha256()
    with p.open('rb')as f:
        for b in iter(lambda:f.read(8*1024*1024),b''):h.update(b)
    return dict(path=str(p.relative_to(R)),bytes=p.stat().st_size,sha256=h.hexdigest())
def write(p,d):p.write_text(json.dumps(d,ensure_ascii=False,indent=2)+'\n')
def record_ids(path):
    decoder=json.JSONDecoder();ids=set();count=0
    with path.open(encoding='utf-8')as file:
        buf=''
        while '"evidence_bundle"'not in buf:
            part=file.read(4*1024*1024);assert part,'missing bundle';buf+=part
        buf=buf.split('"evidence_bundle"',1)[1]
        while True:
            m=re.search(r'"records"\s*:\s*\[',buf)
            if m:buf=buf[m.end():];break
            part=file.read(4*1024*1024);assert part,'missing records';buf+=part
        while True:
            buf=buf.lstrip()
            if buf.startswith(','):buf=buf[1:].lstrip()
            if buf.startswith(']'):break
            try:row,end=decoder.raw_decode(buf)
            except json.JSONDecodeError:
                part=file.read(4*1024*1024);assert part,'truncated native snapshot record';buf+=part;continue
            assert isinstance(row,dict)and'evidence_id'in row and'operation'in row
            ids.add(row['evidence_id']);count+=1;buf=buf[end:]
    assert len(ids)==count,'duplicate record identity in one snapshot'
    return ids
def main():
    previous=read(R/'analysis/game-battle-status-skills-v1/source-check.json');source=R/previous['source']['path'];assert info(source)==previous['source'];raw=source.read_bytes()
    pe=struct.unpack_from('<I',raw,60)[0];base=struct.unpack_from('<I',raw,pe+52)[0];optional=struct.unpack_from('<H',raw,pe+20)[0];sections=[]
    for i in range(struct.unpack_from('<H',raw,pe+6)[0]):
        _,va,n,at=struct.unpack_from('<IIII',raw,pe+24+optional+i*40+8);sections.append((base+va,at,n))
    def offset(va,n):
        for start,at,count in sections:
            if start<=va and va+n<=start+count:return at+va-start
        raise AssertionError('no original file bytes')
    profile='7810ea9437da59780820ec6fedb47ce47390841a95d527ddb6c3b3700fe180cb';artifacts=[]
    for row in previous['artifacts']:assert info(R/row['path'])==row
    cache=OLD/'functions-complete.json';functions=read(cache);assert len(functions)==716;artifacts.append(cache)
    ev=read(P/'function-41b6a0.json');assert ev['subject']['digest']['sha256']==previous['source']['sha256']and ev['analysis_profile']['digest']==profile
    assert dict(id=ev['evidence_id'],**ev['normalized_result'])==functions['0x41b6a0'];assert ev['normalized_result']['procedure']['body']['total_bytes']==62
    rb=read(P/'read_bytes-41b6a0.json');fb=read(P/'address_to_file_offset-41b6a0.json');b=rb['normalized_result'];at=offset(0x41b6a0,62)
    assert rb['analysis_profile']['digest']==fb['analysis_profile']['digest']==profile and b['complete']and b['requested_bytes']==b['returned_bytes']==62 and bytes.fromhex(b['bytes_hex'])==raw[at:at+62]and fb['normalized_result']['file_offset']==at
    repeated=[]
    for name,n in [('40a120',62225),('41dc00',5390),('433cd0',2459)]:
        rbpath=OLD/f'read_bytes-{name}.json';fbpath=OLD/f'address_to_file_offset-{name}.json';e=read(rbpath);z=e['normalized_result'];at=offset(int(name,16),n)
        assert z['complete']and z['returned_bytes']==n and bytes.fromhex(z['bytes_hex'])==raw[at:at+n]and read(fbpath)['normalized_result']['file_offset']==at
        repeated.append(dict(address='0x'+name,bytes=n,file_offset=at,evidence_id=e['evidence_id']));artifacts.extend([rbpath,fbpath])
    dispatcher=R/'build/analysis/game-battle-runtime-v1/derived-callbacks.json';entry=next(e for e in read(dispatcher)['entries']if e['requestedEntry']=='004260b0');count=0
    for ins in entry['instructions']:
        z=bytes.fromhex(ins['bytesHex']);at=offset(int(ins['address'],16),len(z));assert raw[at:at+len(z)]==z;count+=len(z)
    assert count==54685;artifacts.append(dispatcher)
    authority=read(OLD/'next-numeric-observations.json')['authority'];assert all(info(R/r['path'])==r for r in authority)
    prior=read(OLD/'prior-record-check.json');paths=prior['verified_prior_snapshot_files']+[info(OLD/'rea.snapshot.json')];ids=set();verified=[]
    pattern=re.compile(rb'"evidence_id"\s*:\s*"([^"]+)"')
    for row in paths:
        p=R/row['path'];h=hashlib.sha256();tail=b'';local=set()
        with p.open('rb')as file:
            for chunk in iter(lambda:file.read(8*1024*1024),b''):
                h.update(chunk);s=tail+chunk;local.update(m[1].decode()for m in pattern.finditer(s));tail=s[-256:]
        assert p.stat().st_size==row['bytes']and h.hexdigest()==row['sha256'];exact=record_ids(p);assert exact==local,(str(p),len(exact),len(local));ids.update(exact);verified.append(dict(path=row['path'],bytes=row['bytes'],sha256=row['sha256'],exact_Evidence_records=len(exact)));print(json.dumps(dict(snapshot=len(verified),record_union=len(ids))),flush=True)
    write(P/'evidence-id-diagnostic.json',dict(exact_parser=True,count=len(ids),verified_prior_snapshot_files=verified));assert len(verified)==45 and len(ids)==2323,(len(verified),len(ids))
    cache_ids={r['id']for r in functions.values()};cache_only=cache_ids-ids
    assert len(cache_only)==23 and len(cache_ids|ids)==2346
    snapshot=read(P/'rea.snapshot.json');records=snapshot['evidence_bundle']['records'];current={r['evidence_id']for r in records};assert len(records)==len(current)==29 and snapshot['binding']['analysis_profile']['digest']==profile
    assert all(r['subject'].get('digest',{}).get('sha256')==previous['source']['sha256']for r in records)
    reused=sorted(current&ids);new=sorted(current-ids);assert len(new)+len(reused)==29
    write(P/'prior-record-check.json',dict(schema='moli.numeric-evidence-membership-stage200.v1',verified_prior_snapshot_files=verified,previous_reported_union=2400,prior_union=len(ids),historical_count_correction=-77,current_records=29,reused_ids=reused,new_ids=new,new_distinct_records=len(new),cumulative_after=len(ids|current),scope='Hash-verified45 finite native snapshots; every records-array object parsed with the standard JSON decoder, independently crosschecked against streaming field lookup. Prior reported2400 was77 above the actual2323 set. Canonical function cache count is separate.'))
    assert read(P/'close-result.json')['result']['evidence_records']==29 and read(P/'close-result.json')['result']['primitive_entries']==5
    for name in['session-initial','session-final']:
        s=read(P/f'{name}.json')['result'];assert not s['open']and not s['cleanup_pending']
    retained_helpers=[]
    for addr in['0x41b640','0x41b6a0','0x421a10']:
        r=functions[addr];n=r['procedure']['body']['total_bytes'];at=offset(int(addr,16),n);retained_helpers.append(dict(address=addr,canonical_evidence_id=r['id'],bytes=n,file_offset=at,original_range_sha256=hashlib.sha256(raw[at:at+n]).hexdigest()))
    spec=dict(schema='moli.numeric-skills-spec-stage200.v1',source=previous['source'],tool='REA6.7.0/Ghidra12.1.4',analysis_profile=profile,classification='facts are static observations; execution/current official behavior remains unverified',facts=[
      dict(location='0x4260b0 cases61..63; shared record/tail labels0x429eb1..0x42a30d and phase2 switch0x428faa',fact='SKL61/62/63 use code/cost/ignored/principal then target/flags/signed-amount triples toFF.50/51 remap20/21. Tens digit is ignored; level is final decimal digit.800000 flag does not add RID words to this source family.'),
      dict(location='0x4260b0 shared61..63 queues',fact='Caster24,53,38,135,62 and1ae01+tier; normal target146, then40000->124,20000->123/154/30 and optional44/45,10000->122,otherwise155. Flags priority is40000 then20000 then10000.10000000 changes numeric style to0; source154/155 emits57bb instead of digits or vitals.'),
      dict(location='0x4260b0 special20-to-first-side /21-to-second-side',fact='Special target omits initial146 and receives its own principal/flags/amount tuple plus179/72 before the ordinary flag branch.179 completes through199; style0 digits or zero-amount10000000 message have no vital mutation.'),
      dict(location='0x4260b0 reflection tail and phase2',fact='10000 adds signed32 amount to a shared total, removes20 only for outbound tuple and records every reflector. Nonzero total appends1/137 to last reflector and0/146/155 to caster with style5 total.137 advances the real target action. Phase2 waits earlier reflectors0,last1,caster0/1. Zero-sum and duplicate reflectors preserve native waits.'),
      dict(location='0x40a120 types135/146/179/137 and0x41dc00 constructor16/17',fact='Real chant signal activates targets with434a70 restart-current-action.146->constructor16->157;179->16->199.16 resource1ae05+tier has ordinary backend8000; tier0 creates17 resource1ae68 atpriority203.41b640 child completion sets parent1024=2;41b6a0 loops secondary and deletes it when its effect parent is deleted.'),
      dict(location='0x40a120 types154/155/199; signed logical values',fact='Only styles3/5/6 currently exposed here mutate MP/HP. Source style0 never mutates vitals. HP additions use signed32 overflow then upper HP clamp; damage subtracts signed32 then lower zero clamp. Duplicate target assignments keep last queued number fields, so callbacks can repeat that final amount.'),
    ],level_table=[3,3,3,2,2,2,1,1,1,0],supported_classes=[61,62,63],observed_not_implemented=[dict(category=83,reason='Shared triple family additionally requires midpoint movement8/6/10,133 and88/193,death/local244 ownership. It remains explicit unsupported, and replaces61 in the existing unknown primary guard.')],inferences=['This shared finite consumer continues actual received primary skill/input/M/round/nextC/ordinary return; runtime compatibility of original executables and current official software is not established.'],unknowns=['Complete attachedRID, native199 nonopaque child/whole-backend identity,43 HUD backup,83 and all other SKL/variants/self31/linked/ride/scale,craft contexts and gameplay','Physical phone/native WeChat/DevTools/device/current official login and business acceptance; no test account'],phase_complete=False,full_goal_complete=False,goal_status='active')
    write(A/'implementation-spec.json',spec)
    artifacts.extend(P/n for n in['evidence-id-diagnostic.json','evidence-scope-diagnostic.json','function-41b6a0.json','read_bytes-41b6a0.json','address_to_file_offset-41b6a0.json','rea.snapshot.json','session-initial.json','session-final.json','close-result.json','prior-record-check.json']);artifacts.extend(R/r['path']for r in authority)
    out=dict(schema='moli.numeric-skills-source-stage200.v1',source=previous['source'],analysis_profile=profile,tool='REA6.7.0/Ghidra12.1.4',canonical_functions_before=716,canonical_functions_after=716,normalized_cache_only_dossiers_outside_finite_snapshots=23,snapshots_plus_normalized_cache_identity_union=2346,normalized_cache_is_not_full_Evidence=True,new_canonical_functions=[],reobserved_canonical_functions=[dict(address='0x41b6a0',bytes=62,evidence_id=ev['evidence_id'])],previous_reported_retained_records=2400,retained_records_before=2323,historical_count_correction=-77,retained_record_union_after=len(ids|current),new_distinct_records=len(new),current_snapshot_records=29,reused_record_ids=reused,prior_snapshot_files_verified=45,reverified_query_function_bytes=62,reverified_retained_function_bytes=70074,retained_function_reads=repeated,reverified_command_instruction_bytes=54685,retained_helper_ranges=retained_helpers,source_contract=info(A/'implementation-spec.json'),artifacts=[info(p)for p in dict.fromkeys(artifacts)],session_closed=True,cleanup_pending=False,original_execution=0,VM_actions=0,official_sessions=0,limitations=['716 canonical functions is a separate retained cache from finite snapshot record membership','Static original-byte/source equations are not original execution','Body-only completion is distinct from command phase2; zero-sum and duplicate reflection waits remain','Complete game and all original platform/native/current/official requirements remain active'],phase_complete=False,full_goal_complete=False,goal_status='active')
    write(A/'source-check.json',out);print(json.dumps(dict(canonical_functions=716,new_canonical_functions=0,reobserved_bytes=62,retained_bytes=70074,dispatcher_instruction_bytes=54685,record_union=len(ids|current),new_records=len(new),verified_snapshots=45,session_closed=True)))
if __name__=='__main__':main()
