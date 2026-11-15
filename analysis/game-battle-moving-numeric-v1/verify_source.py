#!/usr/bin/env python3
"""Reverify original bytes and the finite, hash-pinned REA evidence membership."""
from pathlib import Path
import hashlib,json,re,struct
A=Path(__file__).resolve().parent;R=A.parent.parent;P=R/'build/analysis/game-battle-moving-numeric-v1';OLD=R/'build/analysis/game-battle-status-skills-v1';PREV=R/'build/analysis/game-battle-numeric-skills-v1'
def read(p):return json.loads(p.read_text())
def write(p,d):p.write_text(json.dumps(d,ensure_ascii=False,indent=2)+'\n')
def info(p):
    h=hashlib.sha256()
    with p.open('rb')as f:
        for b in iter(lambda:f.read(8*1024*1024),b''):h.update(b)
    return dict(path=str(p.relative_to(R)),bytes=p.stat().st_size,sha256=h.hexdigest())
def main():
    previous=read(R/'analysis/game-battle-numeric-skills-v1/source-check.json');source=previous['source'];assert info(R/source['path'])==source;raw=(R/source['path']).read_bytes();profile=previous['analysis_profile'];artifacts=[]
    pe=struct.unpack_from('<I',raw,60)[0];base=struct.unpack_from('<I',raw,pe+52)[0];optional=struct.unpack_from('<H',raw,pe+20)[0];sections=[]
    for i in range(struct.unpack_from('<H',raw,pe+6)[0]):
        _,va,n,at=struct.unpack_from('<IIII',raw,pe+24+optional+i*40+8);sections.append((base+va,at,n))
    def offset(va,n):
        for start,at,count in sections:
            if start<=va and va+n<=start+count:return at+va-start
        raise AssertionError('no original file bytes')
    for row in previous['artifacts']:assert info(R/row['path'])==row,row['path']
    cache=OLD/'functions-complete.json';functions=read(cache);assert len(functions)==716;artifacts.append(cache);new=[];reobserved=[]
    for selector,canonical,n in [('41f740','41f740',87),('41f7a0','41f7a0',1511),('436530','436500',202)]:
        f=P/f'function-{selector}.json';e=read(f);q=e['normalized_result'];assert e['subject']['digest']['sha256']==source['sha256']and e['analysis_profile']['digest']==profile
        address='0x'+canonical;assert q['procedure']['address']==address and q['procedure']['body']['total_bytes']==n
        row=dict(selector='0x'+selector,address=address,bytes=n,evidence_id=e['evidence_id'])
        if address in functions:reobserved.append(row)
        else:functions[address]=dict(id=e['evidence_id'],**q);new.append(row)
        artifacts.append(f)
    assert len(functions)==718 and len(new)==2 and len(reobserved)==1
    reads=[]
    for addr,n in [('41f740',87),('41f7a0',1511),('436500',202),('41f280',70)]:
        rb=P/f'read_bytes-{addr}.json';fb=P/f'address_to_file_offset-{addr}.json';e=read(rb);b=e['normalized_result'];at=offset(int(addr,16),n)
        assert e['analysis_profile']['digest']==read(fb)['analysis_profile']['digest']==profile and b['complete']and b['requested_bytes']==b['returned_bytes']==n and bytes.fromhex(b['bytes_hex'])==raw[at:at+n]and read(fb)['normalized_result']['file_offset']==at
        reads.append(dict(address='0x'+addr,bytes=n,file_offset=at,evidence_id=e['evidence_id'],range_sha256=hashlib.sha256(raw[at:at+n]).hexdigest()));artifacts.extend([rb,fb])
    repeated=[]
    for addr,n in [('40a120',62225),('41dc00',5390),('433cd0',2459)]:
        rb=OLD/f'read_bytes-{addr}.json';fb=OLD/f'address_to_file_offset-{addr}.json';e=read(rb);b=e['normalized_result'];at=offset(int(addr,16),n)
        assert b['complete']and b['returned_bytes']==n and bytes.fromhex(b['bytes_hex'])==raw[at:at+n]and read(fb)['normalized_result']['file_offset']==at
        repeated.append(dict(address='0x'+addr,bytes=n,file_offset=at,evidence_id=e['evidence_id']));artifacts.extend([rb,fb])
    derived=[]
    for path,addr,n in [(P/'derived-callbacks.json','0041f250',33),(R/'build/analysis/game-battle-runtime-v1/derived-callbacks.json','004260b0',54685),(R/'build/analysis/game-battle-runtime-v1/derived-callbacks.json','004365d0',682)]:
        d=read(path);e=next(e for e in d['entries']if e['requestedEntry']==addr);assert e['decompileCompleted'];count=0
        for ins in e['instructions']:
            b=bytes.fromhex(ins['bytesHex']);at=offset(int(ins['address'],16),len(b));assert raw[at:at+len(b)]==b;count+=len(b)
        assert count==n;derived.append(dict(address='0x'+addr[2:],instruction_bytes=count,private_artifact=info(path),canonical_cache_increment=0));artifacts.append(path)
    receipt=read(P/'derived-process-receipt.json');assert receipt['exit_code']==0 and receipt['original_unchanged']and receipt['source_sha256_before']==receipt['source_sha256_after']==source['sha256']and not receipt['original_executed'];artifacts.append(P/'derived-process-receipt.json')
    unseeded=read(P/'function-41f250-unseeded.json');assert unseeded['isError']and'No procedure exists at the requested address: 0x41f250'in str(unseeded);artifacts.append(P/'function-41f250-unseeded.json')
    authority=read(OLD/'next-numeric-observations.json')['authority'];assert all(info(R/r['path'])==r for r in authority);artifacts.extend(R/r['path']for r in authority)
    # The previous exact JSON-decoder proof pins every snapshot's whole-file hash and record count.
    # Verify the same hashes and streaming ID sets; reparse the small current snapshots below.
    prior=read(PREV/'prior-record-check.json');paths=prior['verified_prior_snapshot_files'];ids=set();verified=[];pattern=re.compile(rb'"evidence_id"\s*:\s*"([^"]+)"')
    for row in paths:
        p=R/row['path'];h=hashlib.sha256();tail=b'';local=set()
        with p.open('rb')as f:
            for b in iter(lambda:f.read(8*1024*1024),b''):
                h.update(b);s=tail+b;local.update(m[1].decode()for m in pattern.finditer(s));tail=s[-256:]
        assert p.stat().st_size==row['bytes']and h.hexdigest()==row['sha256']and len(local)==row['exact_Evidence_records'],row['path'];ids.update(local);verified.append(row)
    assert len(verified)==45 and len(ids)==prior['prior_union']==2323
    prior_small=read(PREV/'rea.snapshot.json');small={r['evidence_id']for r in prior_small['evidence_bundle']['records']};assert len(small)==29 and small<=ids;artifacts.extend([PREV/'prior-record-check.json',PREV/'rea.snapshot.json'])
    records=read(P/'rea.snapshot.json')['evidence_bundle']['records'];current={r['evidence_id']for r in records};assert len(records)==len(current)==42
    assert all(r['subject']['digest']['sha256']==source['sha256']and r['analysis_profile']['digest']==profile for r in records)
    newids=sorted(current-ids);reused=sorted(current&ids)
    assert read(P/'close-result.json')['result']['evidence_records']==42 and read(P/'close-result.json')['result']['primitive_entries']==8
    for name in ['session-initial','session-final']:
        s=read(P/f'{name}.json')['result'];assert not s['open']and not s['cleanup_pending']
    write(P/'prior-record-check.json',dict(schema='moli.moving-numeric-evidence-stage201.v1',verified_prior_snapshot_files=verified,previous_exact_JSON_parser_proof=info(PREV/'evidence-id-diagnostic.json'),prior_union=2323,prior_small_snapshot_records=29,prior_small_snapshot_adds=0,current_records=42,new_ids=newids,reused_ids=reused,new_distinct_records=len(newids),cumulative_after=len(ids|current),scope='45 whole-file hashes and streaming ID sets reverified against stage200 exact per-object JSON parsing; previous29-record snapshot adds none. Current42 parsed as complete Evidence objects. Normalized function dossiers counted separately.'))
    helpers=[]
    for addr in ['0x409e70','0x433a10','0x4348e0','0x419e90','0x419f60','0x41f280']:
        e=functions[addr];n=e['procedure']['body']['total_bytes'];at=offset(int(addr,16),n);helpers.append(dict(address=addr,canonical_evidence_id=e['id'],bytes=n,file_offset=at,range_sha256=hashlib.sha256(raw[at:at+n]).hexdigest()))
    before_cache=read(cache);cache_only={e['id']for e in before_cache.values()}-ids;assert len(cache_only)==23
    write(P/'functions-complete.json',functions)
    artifacts.extend(P/n for n in ['functions-complete.json','rea.snapshot.json','close-result.json','session-initial.json','session-final.json','prior-record-check.json','xrefs-599c40.json','xrefs-599c44.json'])
    out=dict(schema='moli.moving-numeric-source-stage201.v1',source=source,tool=previous['tool'],analysis_profile=profile,canonical_functions_before=716,canonical_functions_after=718,new_canonical_functions=new,reobserved_canonical_functions=reobserved,new_canonical_bytes=1598,reverified_noncanonical_selector_bytes=202,reverified_retained_afterimage_bytes=70,original_range_reads=reads,reverified_retained_function_bytes=70074,retained_function_reads=repeated,derived_instruction_ranges=derived,retained_helper_ranges=helpers,retained_records_before=2323,retained_record_union_after=len(ids|current),new_distinct_records=len(newids),current_snapshot_records=42,reused_record_ids=reused,prior_snapshot_files_verified=45,prior_extra_small_snapshot_verified=1,normalized_cache_only_dossiers_outside_prior_finite_snapshots=23,normalized_cache_is_not_full_Evidence=True,unseeded_callback_selector_is_not_a_canonical_function=True,source_contract=info(A/'implementation-spec.json'),artifacts=[info(p)for p in dict.fromkeys(artifacts)],session_closed=True,cleanup_pending=False,original_execution=0,VM_actions=0,official_sessions=0,limitations=['Original-byte static equations are not original execution or current official compatibility','Derived41f25033B remains an independent source export, not a new canonical REA function','Nonlocal83 removed-caster nonzero/self-reflector runtime remains unsupported before mutation','Whole game/native platform/device/current/official requirements remain active'],phase_complete=False,full_goal_complete=False,goal_status='active')
    write(A/'source-check.json',out);print(json.dumps(dict(canonical_functions=718,new_canonical_functions=2,new_bytes=1598,retained_bytes=70074,retained_snapshots=45,current_records=42,record_union=len(ids|current),new_records=len(newids),session_closed=True)),flush=True)
if __name__=='__main__':main()
