#!/usr/bin/env python3
"""Reverify fixed original bytes, retained source authority and finite REA identities."""
from pathlib import Path
import json,hashlib,re,struct
A=Path(__file__).resolve().parent;R=A.parent.parent;P=R/'build/analysis/game-battle-skill82-v1';OLD=R/'build/analysis/game-battle-status-skills-v1';PREV=R/'build/analysis/game-battle-moving-numeric-v1'
def read(p):return json.loads(p.read_text())
def write(p,d):p.write_text(json.dumps(d,ensure_ascii=False,indent=2)+'\n')
def info(p):
    h=hashlib.sha256()
    with p.open('rb')as f:
        for b in iter(lambda:f.read(8*1024*1024),b''):h.update(b)
    return dict(path=str(p.relative_to(R)),bytes=p.stat().st_size,sha256=h.hexdigest())
def main():
    previous=read(R/'analysis/game-battle-moving-numeric-v1/source-check.json');source=previous['source'];assert info(R/source['path'])==source;raw=(R/source['path']).read_bytes();profile=previous['analysis_profile'];artifacts=[]
    for row in previous['artifacts']:assert info(R/row['path'])==row,row['path']
    cache=PREV/'functions-complete.json';functions=read(cache);assert len(functions)==718;artifacts.append(cache)
    pe=struct.unpack_from('<I',raw,60)[0];base=struct.unpack_from('<I',raw,pe+52)[0];optional=struct.unpack_from('<H',raw,pe+20)[0];sections=[]
    for i in range(struct.unpack_from('<H',raw,pe+6)[0]):
        _,va,n,at=struct.unpack_from('<IIII',raw,pe+24+optional+i*40+8);sections.append((base+va,at,n))
    def offset(va,n):
        for start,at,count in sections:
            if start<=va and va+n<=start+count:return at+va-start
        raise AssertionError('no complete original-file mapping')
    ranges=[]
    for addr,n in [('5337b0',64),('52d3d4',8),('41b4a0',266),('422120',32)]:
        rb=P/f'read_bytes-{addr}.json';fb=P/f'address_to_file_offset-{addr}.json';e=read(rb);b=e['normalized_result'];at=offset(int(addr,16),n)
        assert e['subject']['digest']['sha256']==source['sha256']and e['analysis_profile']['digest']==read(fb)['analysis_profile']['digest']==profile and b['complete']and b['requested_bytes']==b['returned_bytes']==n and bytes.fromhex(b['bytes_hex'])==raw[at:at+n]and read(fb)['normalized_result']['file_offset']==at
        ranges.append(dict(address='0x'+addr,bytes=n,file_offset=at,evidence_id=e['evidence_id'],range_sha256=hashlib.sha256(raw[at:at+n]).hexdigest()));artifacts.extend([rb,fb])
    globals_bytes=bytes.fromhex(read(P/'read_bytes-5337b0.json')['normalized_result']['bytes_hex']);indices={hex(0x5337b0+4*i):struct.unpack_from('<i',globals_bytes,4*i)[0]for i in [0,5,10,15]};assert list(indices.values())==[2,7,12,17]
    rb=OLD/'read_bytes-background-midpoint-table.json';fb=OLD/'address_to_file_offset-background-midpoint-table.json';e=read(rb);b=e['normalized_result'];at=offset(0x533810,352);table=bytes.fromhex(b['bytes_hex']);assert b['complete']and len(table)==b['returned_bytes']==352 and table==raw[at:at+352]and read(fb)['normalized_result']['file_offset']==at;artifacts.extend([rb,fb])
    def point(i):return struct.unpack_from('<ii',table,16*i)
    def midpoint(first,second):return[a+int((b-a)/2)for a,b in zip(point(first),point(second))]
    midpoints={'firstSide':midpoint(12,17),'secondSide':midpoint(7,2)};assert midpoints==read(A/'implementation-spec.json')['midpoints']=={'firstSide':[188,203],'secondSide':[449,336]}
    threshold,increment=struct.unpack('<ff',bytes.fromhex(read(P/'read_bytes-52d3d4.json')['normalized_result']['bytes_hex']));assert threshold==2 and increment==0.009999999776482582
    retained=[]
    for addr,n in [('40a120',62225),('41dc00',5390),('433cd0',2459)]:
        rb=OLD/f'read_bytes-{addr}.json';fb=OLD/f'address_to_file_offset-{addr}.json';e=read(rb);b=e['normalized_result'];at=offset(int(addr,16),n)
        assert b['complete']and b['returned_bytes']==n and bytes.fromhex(b['bytes_hex'])==raw[at:at+n]and read(fb)['normalized_result']['file_offset']==at;retained.append(dict(address='0x'+addr,bytes=n,file_offset=at,evidence_id=e['evidence_id']));artifacts.extend([rb,fb])
    derived=R/'build/analysis/game-battle-runtime-v1/derived-callbacks.json';instruction_ranges=[]
    for addr,n in [('004260b0',54685),('004365d0',682)]:
        e=next(e for e in read(derived)['entries']if e['requestedEntry']==addr);count=0
        for ins in e['instructions']:
            b=bytes.fromhex(ins['bytesHex']);at=offset(int(ins['address'],16),len(b));assert raw[at:at+len(b)]==b;count+=len(b)
        assert count==n;instruction_ranges.append(dict(address='0x'+addr[2:],instruction_bytes=count))
    artifacts.append(derived)
    prior=read(PREV/'prior-record-check.json');ids=set();verified=[];pattern=re.compile(rb'"evidence_id"\s*:\s*"([^"]+)"')
    for row in prior['verified_prior_snapshot_files']:
        p=R/row['path'];h=hashlib.sha256();tail=b'';local=set()
        with p.open('rb')as f:
            for b in iter(lambda:f.read(8*1024*1024),b''):
                h.update(b);s=tail+b;local.update(m[1].decode()for m in pattern.finditer(s));tail=s[-256:]
        assert p.stat().st_size==row['bytes']and h.hexdigest()==row['sha256']and len(local)==row['exact_Evidence_records'],row['path'];ids.update(local);verified.append(row)
    assert len(verified)==45 and len(ids)==2323
    small=[]
    for path,n in [(R/'build/analysis/game-battle-numeric-skills-v1/rea.snapshot.json',29),(PREV/'rea.snapshot.json',42)]:
        rows=read(path)['evidence_bundle']['records'];local={r['evidence_id']for r in rows};assert len(rows)==len(local)==n;ids.update(local);small.append(dict(**info(path),exact_Evidence_records=n));artifacts.append(path)
    assert len(ids)==2335
    snapshot=read(P/'rea.snapshot.json');records=snapshot['evidence_bundle']['records'];current={r['evidence_id']for r in records};assert len(records)==len(current)==54 and snapshot['binding']['analysis_profile']['digest']==profile
    assert all(r['subject']['digest']['sha256']==source['sha256']and r['analysis_profile']['digest']==profile for r in records);new=sorted(current-ids);reused=sorted(current&ids)
    write(P/'prior-record-check.json',dict(schema='moli.skill82-evidence-stage202.v1',verified_prior_snapshot_files=verified,prior_small_snapshots_verified=small,prior_union=len(ids),prior_exact_JSON_proof=info(R/'build/analysis/game-battle-numeric-skills-v1/evidence-id-diagnostic.json'),current_records=54,new_ids=new,reused_ids=reused,new_distinct_records=len(new),cumulative_after=len(ids|current),scope='45 historical whole-file hashes and streaming identity sets checked against the stage200 exact per-object JSON proof; two later29/42-record snapshots and current54-record snapshot parsed as complete objects. Canonical dossiers counted separately.'))
    close=read(P/'close-result.json')['result'];assert close['evidence_records']==54 and close['primitive_entries']==8 and close['workflow_entries']==0
    for name in ['session-initial','session-final']:
        s=read(P/f'{name}.json')['result'];assert not s['open']and not s['cleanup_pending']and s['server_identity']['package']['version']=='6.7.0'
    unresolved=[]
    for addr in ['41d19b','41d2f2']:
        path=P/f'containing-{addr}.json';e=read(path);assert not e['normalized_result']['found']and e['normalized_result']['reason']=='not_in_procedure';unresolved.append(dict(address='0x'+addr,evidence_id=e['evidence_id'],scope='Other global-shake references, outside the82 allocation closure; no containing canonical function was established.'));artifacts.append(path)
    helpers=[]
    for addr in ['0x41b4a0','0x422120','0x41b640','0x4199b0','0x419e90','0x41a030','0x436e60','0x436ee0','0x403470','0x4033e0','0x4032f0','0x4034f0','0x403530','0x423340','0x433b70']:
        e=functions[addr];helpers.append(dict(address=addr,canonical_evidence_id=e['id'],bytes=e['procedure']['body']['total_bytes']))
    artifacts.extend(P/n for n in ['rea.snapshot.json','open-result.json','close-result.json','session-initial.json','session-final.json','prior-record-check.json','xrefs-58fb2c.json','xrefs-533c54.json','retained-relevant.json','retained-more.json','global-readers.json']);artifacts.extend([R/'analysis/game-battle-moving-numeric-v1/source-check.json',PREV/'prior-record-check.json'])
    out=dict(schema='moli.skill82-source-stage202.v1',source=source,tool='REA6.7.0/Ghidra12.1.4',analysis_profile=profile,canonical_cache=info(cache),canonical_functions_before=718,canonical_functions_after=718,new_canonical_functions=[],reverified_canonical_helpers=helpers,reverified_current_helper_bytes=298,reverified_current_constant_bytes=72,reverified_retained_midpoint_table_bytes=352,reverified_retained_function_bytes=70074,original_range_reads=ranges,retained_function_reads=retained,derived_instruction_ranges=instruction_ranges,side_indices=indices,midpoints=midpoints,scale=dict(threshold=threshold,float32_increment=increment,source_instructions='0x40f79b/0x40f7a7 floatFADD and0x40f7d0 floatFCOMP'),retained_records_before=2335,retained_record_union_after=len(ids|current),new_distinct_records=len(new),current_snapshot_records=54,reused_record_ids=reused,prior_snapshot_files_hash_verified=45,prior_extra_small_snapshots_verified=2,normalized_cache_is_not_full_Evidence=True,other_global_reference_unknowns=unresolved,source_contract=info(A/'implementation-spec.json'),artifacts=[info(p)for p in dict.fromkeys(artifacts)],session_closed=True,cleanup_pending=False,original_execution=0,VM_actions=0,official_sessions=0,limitations=['Static original bytes and source equations are not original execution/current official compatibility','Empty82 target sentinel runtime remains unobserved; reject before mutation','Original HP-boxing and whole-program RNG/native backend/cadence,unreached shake families and every other original remaining game/platform requirement remain active'],phase_complete=False,full_goal_complete=False,goal_status='active')
    write(A/'source-check.json',out);print(json.dumps(dict(canonical_functions=718,new_canonical_functions=0,helper_bytes=298,constant_bytes=72,retained_body_bytes=70074,retained_table_bytes=352,current_records=54,record_union=len(ids|current),new_records=len(new),session_closed=True)),flush=True)
if __name__=='__main__':main()
