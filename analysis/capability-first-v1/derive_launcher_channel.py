#!/usr/bin/env python3
"""Verify fixed-source channel routing and shutdown; never execute the original target."""
import hashlib
import json
import re
import struct
from pathlib import Path

from extract_entry_inventory import PE

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / 'analysis/capability-first-v1'
PRIVATE = ROOT / 'build/analysis/capability-launcher-channel-v1'
TARGET = ROOT / 'build/analysis/launcher-current-runtime-v4/POLCN_Launcher.analysis-only.exe'
SHA = 'c82fc98d3d274beadee91254e3343974d7c7fdaf2b2a32bc21cc81b76e85c152'
NATIVE = '7810ea9437da59780820ec6fedb47ce47390841a95d527ddb6c3b3700fe180cb'
WORKFLOW = 'b9a9b4f868ae80c2a55407e7d3772a125da19a3d5e2e1765df03951cbd797158'
BUNDLES = [PRIVATE / 'rea-launcher-evidence.json',
           ROOT / 'build/analysis/capability-launcher-lifecycle-v1/rea-launcher-evidence.json',
           ROOT / 'build/analysis/launcher-current-patch-v1/rea-complete-path.json']


def sha(blob):
    return hashlib.sha256(blob).hexdigest()


def load(path):
    return json.loads(path.read_text())


def identity(path):
    return {'path': str(path.relative_to(ROOT)), 'bytes': path.stat().st_size, 'sha256': sha(path.read_bytes())}


def write(name, value):
    (OUT / name).write_text(json.dumps(value, ensure_ascii=False, indent=2) + '\n')


def selected_imports(pe):
    """Parse PE32 import descriptors/thunks; project only the selected Win32 APIs."""
    pe_at = struct.unpack_from('<I', pe.raw, 60)[0]
    opt = pe_at + 24
    rva, size = struct.unpack_from('<II', pe.raw, opt + 104)
    assert rva and size >= 20

    def cstr(address):
        out = bytearray()
        for i in range(512):
            b = pe.read(address + i, 1)[0]
            if not b:
                return out.decode('ascii'), i + 1
            out.append(b)
        raise AssertionError('unterminated import name')

    selected, imports = [], 0
    for i in range(min(size // 20, 4096)):
        address = pe.base + rva + i * 20
        descriptor = pe.read(address, 20)
        original, timestamp, forwarder, name_rva, first = struct.unpack('<5I', descriptor)
        if not any((original, timestamp, forwarder, name_rva, first)):
            break
        assert name_rva and first
        dll, _ = cstr(pe.base + name_rva)
        lookup = pe.base + (original or first)
        for j in range(4096):
            thunk_address = lookup + 4 * j
            raw = pe.read(thunk_address, 4)
            value = struct.unpack('<I', raw)[0]
            if not value:
                break
            imports += 1
            if value & 0x80000000:
                continue
            name_address = pe.base + value + 2
            name, length = cstr(name_address)
            if name in ('InterlockedCompareExchange', 'InterlockedIncrement', 'InterlockedDecrement', 'InterlockedExchange', 'EnterCriticalSection', 'LeaveCriticalSection', 'Sleep'):
                selected.append({'dll': dll, 'name': name, 'iat_address': hex(pe.base + first + j * 4),
                                 'descriptor_address': hex(address), 'descriptor_sha256': sha(descriptor),
                                 'lookup_address': hex(thunk_address), 'lookup_sha256': sha(raw),
                                 'name_address': hex(name_address), 'name_bytes': length,
                                 'name_sha256': sha(pe.read(name_address, length))})
        else:
            raise AssertionError('import thunk limit')
    else:
        raise AssertionError('import descriptor terminator missing')
    assert {r['name'] for r in selected} == {'InterlockedCompareExchange', 'EnterCriticalSection', 'InterlockedDecrement', 'Sleep', 'InterlockedIncrement', 'InterlockedExchange', 'LeaveCriticalSection'}
    return {'examined_imports': imports, 'selected': selected,
            'limitation': 'This is static named-import metadata; dynamic API resolution is outside this projection.'}


def main():
    pe = PE(TARGET, SHA)
    manifest = load(PRIVATE / 'body-input-manifest.json')
    wanted, parents, parent_sources = set(), {}, {}
    for row in manifest:
        if row['kind'] == 'composed':
            r = load(ROOT / row['path'])
            wanted.update(r[key] for key in ('pseudocode_parent_evidence_id', 'range_evidence_id', 'assembly_evidence_id'))
    for path in BUNDLES:
        bundle = load(path)
        for r in bundle['records']:
            if r['evidence_id'] in wanted:
                assert r['evidence_id'] not in parents or parents[r['evidence_id']] == r
                parents[r['evidence_id']] = r
                parent_sources.setdefault(r['evidence_id'], identity(path))
        del bundle
    assert wanted <= parents.keys()
    bodies, assembly, indexed = [], {}, {}
    for row in manifest:
        path = ROOT / row['path']
        r = load(path)
        assert r['subject']['digest']['sha256'] == SHA
        entry = row['procedure']
        result = {'procedure': entry, 'kind': row['kind'], 'retained_view': identity(path)}
        if row['kind'] == 'composed':
            assert r['canonical_function_dossier'] is False and r['procedure'] == entry
            parent, info, asm = [parents[r[k]] for k in ('pseudocode_parent_evidence_id', 'range_evidence_id', 'assembly_evidence_id')]
            assert all(x['subject']['digest']['sha256'] == SHA for x in (parent, info, asm))
            assert info['analysis_profile']['digest'] == asm['analysis_profile']['digest'] == NATIVE
            if r['pseudocode_item_index'] is None:
                assert parent['operation'] == 'procedure_pseudo_code' and parent['analysis_profile']['digest'] == NATIVE
                pseudo = parent['normalized_result']
            else:
                assert parent['operation'] == 'batch_decompile' and parent['analysis_profile']['digest'] == WORKFLOW
                item = parent['normalized_result']['items'][r['pseudocode_item_index']]
                assert item['status'] == 'ok' and item['procedure']['address'] == entry
                pseudo = item['pseudocode']
            body, lines = r['body'], r['assembly']
            assert pseudo == r['pseudocode'] and body == info['normalized_result']['body']
            assert info['normalized_result']['entrypoint'] == entry and lines == asm['normalized_result'].splitlines()
            result.update(canonical_native_dossier=False, pseudocode_parent_evidence_id=parent['evidence_id'],
                          pseudocode_profile_digest=parent['analysis_profile']['digest'],
                          pseudocode_parent_source=parent_sources[parent['evidence_id']],
                          pseudocode_utf8_sha256=sha(pseudo.encode()), range_evidence_id=info['evidence_id'],
                          assembly_evidence_id=asm['evidence_id'])
        else:
            assert row['kind'] in ('new-native', 'reused-native')
            assert r['operation'] == 'analyze_function' and r['analysis_profile']['digest'] == NATIVE
            n = r['normalized_result']
            assert n['procedure']['address'] == entry
            body, lines = n['procedure']['body'], n['assembly']
            result.update(canonical_native_dossier=True, evidence_id=r['evidence_id'])
        assert body['available'] and body['contains_entry']
        ranges = []
        for span in body['ranges']:
            start, end = int(span['start'], 16), int(span['end'], 16)
            assert start <= end and pe.executable(start) and pe.executable(end)
            path_read = PRIVATE / f'read-range-{start:x}.json'
            read = load(path_read)
            n = read['normalized_result']
            blob = bytes.fromhex(n['bytes_hex'])
            assert read['subject']['digest']['sha256'] == SHA and read['analysis_profile']['digest'] == NATIVE
            assert n['complete'] and n['address'] == hex(start) and n['returned_bytes'] == len(blob) == end - start + 1
            assert pe.read(start, len(blob)) == blob
            ranges.append({'start': hex(start), 'end_inclusive': hex(end), 'bytes': len(blob),
                           'file_offset': pe.file_offset(start, len(blob)), 'sha256': sha(blob),
                           'read_evidence_id': read['evidence_id'], 'retained_read': identity(path_read)})
        assert sum(s['bytes'] for s in ranges) == body['total_bytes'] == row['body_bytes']
        assert entry not in indexed
        result['ranges'] = ranges
        bodies.append(result)
        indexed[entry], assembly[entry] = result, lines

    anchors=[]

    def anchor(entry,claim,*queries):
        matches=[]
        for query in queries:
            found=[line for line in assembly[entry] if query in line]
            assert found,(entry,query)
            for line in found:
                address=int(line.split(':',1)[0],16)
                assert any(int(s['start'],16)<=address<=int(s['end_inclusive'],16) for s in indexed[entry]['ranges'])
                matches.append(dict(address=hex(address),instruction_text_sha256=sha(line.encode())))
        anchors.append(dict(claim=claim,procedure=entry,queries=list(queries),matches=matches))

    anchor('0x587160','channel-initial-reference-and-operation-fields','0xc','0xd','0x11','0x1c','0x20')
    anchor('0x5875e0','connect-publishes-handle-registers-close-callback-and-owner',
           '0x587678:','0x58767d:','PUSH 0x587440','CALL 0x0058cde0','CALL 0x005889e0')
    anchor('0x58c5c0','returned-native-handle-pair','CALL 0x00589520','0x58c630:')
    anchor('0x589520','nonzero-native-serial-and-context-callback-copy',
           '0x58981f:','0x58983b:','0x589871:','0x58987a:','0x56434543')
    anchor('0x58b230','pool-pointer-magic-and-serial-lookup','0x56434543','0x58b230:','0x58b27c: RET')
    anchor('0x5889e0','registry-insert-owner-key-and-duplicate-rejection',
           'CALL 0x00586fc0','0x588a76:','0x588ad3:','CALL 0x00587050')
    anchor('0x588b40','registry-removal-requires-owner-and-has-owner-scan-fallback',
           'CALL 0x00586fc0','CALL 0x00588330','CALL 0x00587050')
    anchor('0x588190','callback-lookup-matches-serial-acquires-channel-and-coordinator',
           '0x588213:','CALL 0x005877b0','0x588227:','RET 0xc')
    anchor('0x5877b0','double-operation-gate-check-around-channel-borrow',
           '0x5877b8:','0x5877bc:','0x5877ca:','0x5877d5:','0x5877e0:')
    anchor('0x588260','callback-release-is-import-tail-call','CALL 0x00587780','0x588272:','0x58827a: JMP')
    anchor('0x587780','per-channel-borrow-release','0x1c','CALL dword ptr')
    anchor('0x586fc0','optional-critical-section-guard','0x8','CALL dword ptr')
    anchor('0x587050','critical-section-release','CALL dword ptr')
    anchor('0x420740','main-installs-network-pump-timer','PUSH 0x332','PUSH 0x64','CALL 0x00588690')
    anchor('0x423910','pump-timer-distinct-from-login-timer','0x332','CALL 0x00588660','CALL 0x00424cf0')
    anchor('0x588660','optional-pump-under-coordinator-guard','0x18','CALL 0x0058bf60')
    anchor('0x58bf60','engine-reentry-guard-and-context-service','0x006407c4','CALL 0x0058a060','JMP 0x00589e70')
    anchor('0x588690','init-installs-frame-and-message-callbacks',
           'PUSH 0x588d00','PUSH 0x58c0d0','CALL 0x0058ce30')
    anchor('0x58ce30','context-parser-and-message-callback-fields','0x68','0x6c')
    anchor('0x58cde0','context-disconnect-callback-field','0x78')
    anchor('0x58a060','callback-then-handle-revalidation-and-selected-close-tail',
           '0x58a884: CALL 0x0058b230','0x58a88c: CMP EAX, ESI',
           '0x58aa4d: PUSH 0x1','0x58aa4f: PUSH 0x7','0x58aa52: CALL 0x00589c30')
    anchor('0x58c0d0','frame-callback-and-post-callback-pool-buffer-revalidation',
           '0x58c1ab:','0x58c1cc: CALL EDX','0x58c1e8: CALL 0x0058b230','0x58c1f0:','0x58c1f7:')
    anchor('0x588d00','type11-forwarding-retains-native-connection-context','CALL 0x005878d0')
    anchor('0x5878d0','borrowed-reply-adapter-dispatch-and-release',
           'CALL 0x00587750','CALL dword ptr [EAX + 0x14]','CALL 0x00587790')
    anchor('0x587340','stop-gate-saves-handle-and-removes-owner','0x58737b:',
           '0x587391:','CALL 0x00588b40','JMP 0x005873f2')
    anchor('0x5873f2','normal-stop-clears-pair-and-requests-close',
           '0xd','0x11','CALL 0x0058ba00','0x005cf21c')
    anchor('0x58ba00','transport-close-request-distinct-from-destruction','CALL 0x0058b230','0xec','0xf0')
    anchor('0x587440','disconnect-lookup-and-before-reply-failure',
           'CALL 0x00588190','0x58749b:','PUSH -0x64','CALL dword ptr [EAX + 0x14]')
    anchor('0x5874da','normal-disconnect-tail-unregisters-and-releases',
           'CALL 0x00587530','CALL 0x00588260')
    anchor('0x587530','disconnect-unregister-removes-owner-before-pair-clear',
           'CALL 0x00588b40','JMP 0x00587593')
    anchor('0x587593','clear-only-the-matching-pointer-serial-pair',
           '0x587596:','0x58759e:','0x5875a3:','0x5875aa:')
    anchor('0x589c30','selected-disconnect-notify-detach-and-free',
           '0xf0','0x78','0x7c','CALL 0x0058b880')
    anchor('0x430d70','AA-deleting-destructor-enters-channel-destruction','CALL 0x00587210')
    anchor('0x587210','channel-destruction-stops-before-wait-tail',
           'MOV EDI, ECX','CALL 0x00587340','JMP 0x00587261')
    anchor('0x587261','normal-destruction-waits-for-borrows-without-local-deadline',
           'LEA EBX, [EDI + 0x1c]','0x587277:','0x587286: JNZ')
    anchor('0x589e70','cleanup-body-boundary-kept-narrow','0x589e70:','0x589ea4: JNZ 0x0058bc00')

    path=PRIVATE/'read-AAChannel-vtable.json'
    r=load(path);n=r['normalized_result'];blob=bytes.fromhex(n['bytes_hex'])
    assert r['operation']=='read_bytes' and r['subject']['digest']['sha256']==SHA
    assert r['analysis_profile']['digest']==NATIVE and n['complete']
    assert n['address']=='0x5d69c4' and n['requested_bytes']==n['returned_bytes']==len(blob)==24
    assert blob==pe.read(0x5d69c4,24)
    expected=[0x430d70,0x431ce0,0x587880,0x587820,0x431d00,0x4316c0]
    assert list(struct.unpack('<6I',blob))==expected
    vtable=dict(address='0x5d69c4',bytes=24,file_offset=pe.file_offset(0x5d69c4,24),sha256=sha(blob),
                read_evidence_id=r['evidence_id'],retained_read=identity(path),
                slots=[dict(offset=hex(i*4),target=hex(target),file_backed_code=pe.executable(target)) for i,target in enumerate(expected)],
                scope='Six observed pointers only; following bytes are not asserted to be additional vtable slots.')
    imports=selected_imports(pe)
    by_iat={row['iat_address']:row['name'] for row in imports['selected']}
    assert by_iat['0x5cf218']=='InterlockedDecrement' and by_iat['0x5cf34c']=='Sleep'
    assert by_iat['0x5cf21c']=='InterlockedExchange' and by_iat['0x5cf220']=='InterlockedCompareExchange'
    observations=[]
    for op,entry in [('xrefs','5878d0'),('xrefs','587440'),('procedure_callers','588820')]:
        path=PRIVATE/f'{op}-{entry}.json';d=load(path)
        assert d['operation']==op and d['subject']['digest']['sha256']==SHA
        assert d['analysis_profile']['digest']==NATIVE
        observations.append(dict(operation=op,entry='0x'+entry,evidence_id=d['evidence_id'],
                                 retained_observation=identity(path),result=d['normalized_result'],
                                 scope='Selected provider references,not an exhaustive dynamic-call proof.'))
    repeat=load(PRIVATE/'retained-pseudocode-repeat.json')
    assert repeat['procedure']=='0x589520' and repeat['pseudocode_equal'] is True
    old_parent=next(d for d in load(BUNDLES[1])['records'] if d['evidence_id']==repeat['retained_parent_evidence_id'])
    old_item=old_parent['normalized_result']['items'][repeat['retained_item_index']]
    native=load(PRIVATE/'function-589520.json')
    assert native['evidence_id']==repeat['new_native_evidence_id']
    assert old_item['procedure']['address']=='0x589520' and old_item['pseudocode']==native['normalized_result']['pseudocode']
    reused=[]
    for name in ['launcher-lifecycle','launcher-apply']:
        path=OUT/f'{name}-contract.json';d=load(path);assert d['source']['sha256']==SHA;reused.append(identity(path))
    for name in ['login','control','record']:
        path=ROOT/f'analysis/launcher-current-{name}-v1/implementation-spec.json';d=load(path)
        assert d.get('source_analysis_sha256',d.get('source',{}).get('analysis_sha256'))==SHA
        reused.append(identity(path))
    summary=dict(body_entries=len(bodies),new_native_dossiers=sum(x['kind']=='new-native' for x in bodies),
                 reused_native_dossiers=sum(x['kind']=='reused-native' for x in bodies),
                 composed_reused_bodies=sum(x['kind']=='composed' for x in bodies),
                 range_reads=sum(len(x['ranges']) for x in bodies),
                 range_bytes=sum(s['bytes'] for x in bodies for s in x['ranges']),
                 semantic_anchor_groups=len(anchors),vtable_slots=len(expected),auxiliary_data_reads=1,
                 all_read_records=sum(len(x['ranges']) for x in bodies)+1,
                 named_imports_bound=len(imports['selected']),retained_reference_observations=len(observations),
                 repeat_decompilations_with_existing_pseudocode=1)
    normal_tails=[dict(parent='0x587340',tail='0x5873f2',role='normal stop saved-register continuation'),
                  dict(parent='0x587530',tail='0x587593',role='normal unregister saved-register continuation'),
                  dict(parent='0x587440',tail='0x5874da',role='normal disconnect saved-register continuation'),
                  dict(parent='0x587210',tail='0x587261',role='normal destructor saved-register continuation')]
    source=dict(schema='moli.capability.launcher-channel-source-check.v1',source=identity(TARGET),
                native_profile_digest=NATIVE,workflow_profile_digest=WORKFLOW,tools={'REA':'6.7.0','Ghidra':'12.1.4'},
                summary=summary,bodies=bodies,semantic_anchors=anchors,AAChannel_vtable=vtable,
                selected_PE_imports=imports,reference_observations=observations,normal_tail_fragments=normal_tails,
                reused_contracts_and_specs=reused,retained_source_locator=identity(PRIVATE/'retained-source-locator.json'),
                retained_pseudocode_repeat=identity(PRIVATE/'retained-pseudocode-repeat.json'),
                all_native_loaded_image_read_bytes_match_original_PE=True,
                body_pseudocode_scope_warnings=[
                    dict(procedure='0x588190',note='RET0xc and caller assembly retain a third ABI word omitted by two-parameter pseudocode; only pointer/serial are used by the selected checks.'),
                    dict(procedure='0x588260',note='The purported jumptable is a tail JMP to the named InterlockedDecrement import,corroborated by PE IAT.'),
                    dict(procedure='0x589e70',note='Pseudocode expands the branch into58bc00 outside its70-byte body. Claims here stop at the narrow body and its outgoing shutdown branch.'),
                    dict(procedure='0x5872b0',note='This is a nullable borrowed-channel release wrapper; it is not identified as the CChannel destructor.')],
                original_execution=False,runtime_features_changed=False,
                limitations=['Selected normal source routes only; callbacks already acquired before a concurrent or modal Stop/reopen need their actual sequencing.',
                             'Unregister removes an owner row before conditional pair clearing; conditional clearing alone is not complete new-binding protection.',
                             'Global coordinator/engine shutdown,all exceptional tails and OS scheduling remain open.',
                             'Original runtime,platform/device/account and official acceptance are separate.'])
    write('launcher-channel-source-check.json',source)
    facts=[
        ('native-connection-identity',['0x587160','0x5875e0','0x58c5c0','0x589520','0x58b230'],
         'CChannel stores the native connection pointer/serial at+d/+11,with another32-bit word at+15. Connection allocation increments global6407b4 and skips zero on wrap,stores the serial at connection+4,and returns the pointer/serial. Pool lookup requires a matching live bucket object,pointer,magic56434543 and serial. This is native connection identity,not a new login wire field or the Main candidate counters; finite serial wrap is not an infinite uniqueness proof.'),
        ('context-bindings',['0x588690','0x58ce30','0x58cde0','0x589520','0x5875e0'],
         'Initialization stores58c0d0/588d00 as context+68/+6c; allocation copies them to connection+fc/+100. Connect stores587440 as context+78 disconnect callback. AAChannel slots+14/+4 bind4316c0/431ce0; an observed vtable pointer alone does not establish every invocation path.'),
        ('coordinator-registry',['0x588820','0x5889e0','0x588b40','0x586fc0','0x587050'],
         'CCE owns an ordered registry keyed by the low pointer word and stores the CChannel owner in each row. Registering an existing key for another owner throws on that branch. Removal checks owner equality and has an owner scan fallback. Registry operations use the optional critical-section guard; no all-allocation-failure or OS synchronization result is claimed.'),
        ('callback-leases',['0x588190','0x5877b0','0x588260','0x587780','0x587750','0x587790','0x5872b0'],
         'Callback lookup finds the pointer-key row,compares current channel serial with the incoming serial,then acquires a channel borrow using two checks of operation gate+20 around active count+1c increment. Successful lookup also increments coordinator+1c. Normal release decrements both counts; null release is allowed. The third native handle ABI word is forwarded even where recovered pseudocode only declares two parameters.'),
        ('host-pump',['0x420740','0x423910','0x588660','0x58bf60'],
         'Main initialization requests timer0x332 at100ms. Its WM_TIMER branch calls CCE service; timer100 separately handles login deadlines. Service takes the coordinator guard,requires initialized+18 and enters the engine pump only when global6407c4 is zero. The pump sets that counter while synchronously servicing admitted contexts and clears/decrements it before deferred cleanup. It supplies a normal same-stack route and a nested-pump guard,not a measured scheduling/deadline guarantee.'),
        ('framed-message-callback',['0x58a060','0x58c0d0','0x588d00','0x5878d0'],
         'The selected context service calls its connection parser with pointer/serial,then revalidates the pool identity before further connection use. The frame callback reads the BE16 length,invokes connection+100 for a complete message,and again checks the same pool object and unchanged receive length before consuming bytes. Type11 forwards through5878d0: lookup/borrow,virtual+14 reply call,release. No separate asynchronous application reply queue is introduced by this selected call chain; arbitrary other threads/entry points are not excluded.'),
        ('ordinary-stop',['0x587340','0x5873f2','0x58ba00'],
         'Stop returns without a new operation when the operation gate is already held. Its admitted null-handle route releases that gate; the nonnull route saves the handle,removes its registry owner,clears the pointer/serial and requests transport close for the saved still-valid connection before releasing the gate. The close-request helper sets connection+ec when neither close nor destruction is already pending; it does not synchronously free the connection or wait for all acquired callbacks.'),
        ('disconnect-and-unregister',['0x589c30','0x587440','0x5874da','0x587530','0x587593'],
         'Transport destruction sets+f0 before optional disconnect callbacks,detaches the pool/list entries,clears magic and frees resources on the selected normal route. Disconnect lookup uses the current registered serial/borrow gate. If the channel has not recorded a reply,it invokes reply slot+14 with status-100; its normal tail unregisters/releases. Unregister first removes the owner row,then clears the stored handle pair only if both pointer and serial still match. That final pair check does not by itself protect a new registry binding from a callback already acquired before replacement.'),
        ('normal-destruction',['0x430d70','0x587210','0x587261'],
         'AAChannel deleting destruction reaches the CChannel destructor,which restores the base vptr and calls Stop. Its saved-register normal tail polls channel active-borrow count+1c with Sleep1 until zero,then continues base cleanup. There is no deadline in that selected wait loop. This establishes normal lease draining before object release,not completion of every global coordinator shutdown or exception path.'),
        ('preserved-wire-and-Main-gates',[],
         'The same-C82 login/control/record and lifecycle contracts are reused: the16-argument reply ABI,Main busy/deferred-close admission,candidate counters,DNS job and two selected deadline phases remain distinct. This package adds source ownership rules and no request/reply bytes,product feature or claimed original-server acceptance.')]
    rows=[dict(id=i,procedures=es,claim=claim,kind='fact') for i,es,claim in facts]
    assert all(e in indexed for row in rows for e in row['procedures'])
    contract=dict(schema='moli.capability.launcher-channel-contract.v1',source=identity(TARGET),
                  source_check='analysis/capability-first-v1/launcher-channel-source-check.json',
                  capabilities=['L03','L08','X06'],facts=rows,
                  scope_refinement=['Native handle identity and Main candidate counters have different roles.',
                                    'Normal synchronous dispatch/borrow/destruction paths are bound; all possible reentry or global exits are not declared closed.',
                                    'Selected default codecs and earlier independent transport policies retain their version/scope boundaries.'],
                  inferences=[dict(kind='inference',implementation_added=False,
                                   claim='A shared connection owner should carry an opaque local identity through asynchronous platform events,retain/release callback leases and make detach,close request and final destruction distinct. An asynchronous drain keeps the browser/WeChat event loop progressing. Current local attempt IDs remain independent routing mechanisms and never become new wire fields; full modal replacement semantics still need their own source rules.')],
                  requirement_answers=[
                      dict(question=1,status='answered-bounded-source',result='Native pointer/serial producer,pool/registry checks and callback bindings are source-bound;canonical/composed views remain separate.'),
                      dict(question=2,status='answered-bounded-source',result='Main pump,reentry guard,frame/type11 route and callback leases/ABI are bound on the selected normal call stack.'),
                      dict(question=3,status='partially-answered',result='Stop,normal disconnect,pair clearing and normal destructor draining bound;already-acquired callback/modal or cross-thread replacement,all exceptions/global exits remain.'),
                      dict(question=4,status='answered-bounded-source',result='Reusable owner/identity/drain implications recorded without new product implementation or acceptance claims.')],
                  remaining=['Already-acquired callback ordering during modal/concurrent Stop/reopen,global coordinator/engine exits and all exceptional/allocation/callback-throw paths.',
                             'Remaining launcher modal ownership,XML clear/remove and caller recovery,OS/locale/storage,dynamic menu targets and three resource uses.',
                             'Game actual alternate dispatch,graphics/input/shared-state owners and the remaining full capability inventory.',
                             'Independent shared implementation,actual platform/device/account and official acceptance remain outside this static package.'],
                  original_execution=False,account_or_session_observed=False,runtime_features_changed=False,
                  all_capability_analysis_complete=False,implementation_gate_passed=False,official_acceptance=False,full_goal_complete=False)
    write('launcher-channel-contract.json',contract)
    print(json.dumps(summary,sort_keys=True))


if __name__=='__main__':
    main()
