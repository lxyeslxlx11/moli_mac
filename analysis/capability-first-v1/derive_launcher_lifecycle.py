#!/usr/bin/env python3
"""Verify fixed-source App/login task lifecycle; never execute the original target."""
import hashlib
import json
import re
import struct
from pathlib import Path

from extract_entry_inventory import PE
from derive_dispatch_bindings import vtable_info

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / 'analysis/capability-first-v1'
PRIVATE = ROOT / 'build/analysis/capability-launcher-lifecycle-v1'
TARGET = ROOT / 'build/analysis/launcher-current-runtime-v4/POLCN_Launcher.analysis-only.exe'
SHA = 'c82fc98d3d274beadee91254e3343974d7c7fdaf2b2a32bc21cc81b76e85c152'
NATIVE = '7810ea9437da59780820ec6fedb47ce47390841a95d527ddb6c3b3700fe180cb'
WORKFLOW = 'b9a9b4f868ae80c2a55407e7d3772a125da19a3d5e2e1765df03951cbd797158'
BUNDLES = [PRIVATE / 'rea-launcher-evidence.json',
           ROOT / 'build/analysis/capability-launcher-xml-v1/rea-launcher-evidence.json',
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
            if name in ('RegisterWindowMessageA',):
                selected.append({'dll': dll, 'name': name, 'iat_address': hex(pe.base + first + j * 4),
                                 'descriptor_address': hex(address), 'descriptor_sha256': sha(descriptor),
                                 'lookup_address': hex(thunk_address), 'lookup_sha256': sha(raw),
                                 'name_address': hex(name_address), 'name_bytes': length,
                                 'name_sha256': sha(pe.read(name_address, length))})
        else:
            raise AssertionError('import thunk limit')
    else:
        raise AssertionError('import descriptor terminator missing')
    assert {r['name'] for r in selected} == {'RegisterWindowMessageA'}
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

    anchors = []

    def anchor(entry, claim, *queries):
        matches = []
        for query in queries:
            found = [line for line in assembly[entry] if query in line]
            assert found, (entry, query)
            for line in found:
                address = int(line.split(':', 1)[0], 16)
                assert any(int(s['start'], 16) <= address <= int(s['end_inclusive'], 16)
                           for s in indexed[entry]['ranges'])
                matches.append({'address': hex(address), 'instruction_text_sha256': sha(line.encode())})
        anchors.append({'claim': claim, 'procedure': entry, 'queries': list(queries), 'matches': matches})

    anchor('0x584fb4', 'PE-entry-to-CRT-startup', 'JMP 0x00584e38')
    anchor('0x584e38', 'CRT-walk-bounds-and-conditional-startup',
           'PUSH 0x5cfe38', 'PUSH 0x5cfb58', 'CALL 0x005a8ac8', '0x584e92: JZ')
    anchor('0x5a8ac8', 'initializer-pointer-loop', '0x5a8af7:', '0x5a8afe: JZ',
           '0x5a8b08: CALL', 'ADD ESI, 0x4')
    anchor('0x5ce480', 'registered-normal-App-destructor', 'MOV ECX, 0x63c800', 'JMP 0x00430ce0')
    anchor('0x41e420', 'ordinary-busy-candidate-and-timer-initialization',
           '0x1a74', '0x1a7c', '0x1a80', '0x1ff8', 'PUSH 0x64')
    anchor('0x4291d0', 'candidate-index-and-retry-count-not-generation',
           '0x1a7c', '0x1a80', '0x1a84', '0x1a78', 'CALL 0x00418a10', 'PUSH 0x426a30')
    anchor('0x418a10', 'owned-job-slot-counted-cap-and-normal-publication',
           'MOV dword ptr [EBX], 0x0', 'PUSH 0x63c7d8', 'CMP EAX, 0x4',
           'PUSH 0x40', 'MOV dword ptr [ESI], 0x2', '0x418af5:', '0x418b30:',
           'MOV dword ptr [EBX], ESI')
    anchor('0x426a30', 'IPv4-stream-hints-and-first-address-result',
           'MOV dword ptr [EBP + -0x20], 0x2', 'MOV dword ptr [EBP + -0x1c], 0x1', 'MOV EAX, 0x2af9')
    anchor('0x429fb0', 'worker-only-job-resolver-and-status',
           'MOV ESI, dword ptr [EBP + 0x8]', 'PUSH 0x16', '0x3c', '0x38', 'JMP 0x0042a015')
    anchor('0x42a015', 'normal-worker-done-count-release',
           'LEA EAX, [ESI + 0x4]', 'PUSH 0x63c7d8', 'PUSH ESI', 'CALL 0x004260e0')
    anchor('0x4260e0', 'reference-release', '0x4260e0:', 'CALL dword ptr', '0x1c')
    anchor('0x424cf0', 'timer-current-job-deadline-and-result-detach',
           'SUB EAX, dword ptr [ESI + 0x1a84]', '0x424d6c:', '0x424daa:',
           '0x424ddb:', '0x424dde:', '0x424df5:')
    anchor('0x424cf0', 'assembly-restores-removed-success-connect-block',
           '0x424dfc: TEST EBX, EBX', '0x424e00: CMP', '0x424e15: CMOVNC',
           '0x424e19: MOVZX', '0x424e28: CALL 0x005875e0')
    anchor('0x424cf0', 'accepted-request-starts-a-new-deadline',
           '0x424f12: ADD EAX, 0x2710', '0x424f17: MOV')
    anchor('0x41b690', 'login-stop-detaches-reference-kills-timer-and-defers-close',
           '0x1a78', '0x1a74', '0x1a75', '0x1ff8', 'CALL 0x00587340', 'PUSH 0x10')
    anchor('0x41a020', 'Frame-close-request-while-busy', '0x1a74', '0x1a75', 'CALL 0x0041b690')
    anchor('0x42e260', 'Frame-delegates-close-before-base', 'CALL 0x0041a020', 'JMP 0x0045745a')
    anchor('0x41fa60', 'Main-destroy-detaches-current-job', '0x1a78', 'CALL 0x004260e0')
    anchor('0x422b80', 'reply-admission-checks-busy-and-stop-close-result',
           '0x1a74', 'CALL 0x0041b690')
    anchor('0x422cb0', 'retry-error-gated-by-busy', '0x1a74', 'CALL 0x00587340', 'CALL 0x004291d0')
    anchor('0x4316c0', 'reply-adapter-not-a-generation-proof',
           'CALL 0x00422b80', 'CALL 0x00423c30', 'CALL 0x00422cb0', 'RET 0x40')
    anchor('0x587340', 'channel-stop-enters-internal-close-path',
           '0x20', 'CALL 0x0058ba90', 'CALL 0x00588b40')
    anchor('0x5875e0', 'channel-connect-creates-and-registers-internal-callback',
           'CALL 0x00587340', 'CALL 0x0058c5c0', 'PUSH 0x587440', 'CALL 0x0058cde0',
           'CALL 0x005889e0')

    def admitted_read(name, address, length):
        path = PRIVATE / name
        r = load(path)
        n = r['normalized_result']
        blob = bytes.fromhex(n['bytes_hex'])
        assert r['operation'] == 'read_bytes' and r['subject']['digest']['sha256'] == SHA
        assert r['analysis_profile']['digest'] == NATIVE and n['complete']
        assert n['address'] == hex(address) and n['requested_bytes'] == n['returned_bytes'] == len(blob) == length
        assert pe.read(address, length) == blob
        return blob, {'address': hex(address), 'bytes': length, 'file_offset': pe.file_offset(address, length),
                      'sha256': sha(blob), 'read_evidence_id': r['evidence_id'], 'retained_read': identity(path)}

    # Independently decoded views are bounded by actual CRT pointer targets, not guessed procedures.
    table, table_read = admitted_read('read-data-crt.json', 0x5cfb58, 0x2e0)
    pointers = struct.unpack('<184I', table)
    llvm_path = PRIVATE / 'initializer-window-llvm.txt'
    receipt_path = PRIVATE / 'initializer-window-llvm-receipt.json'
    receipt = load(receipt_path)
    assert receipt['source_sha256'] == SHA and receipt['exit_code'] == 0
    assert receipt['original_execution'] is False and receipt['canonical_REA_unchanged'] is True
    assert sha(llvm_path.read_bytes()) == receipt['stdout_sha256']
    tool = Path(receipt['tool_path'])
    assert sha(tool.read_bytes()) == receipt['tool_sha256']
    decoded = {}
    for line in llvm_path.read_text().splitlines():
        m = re.match(r'^\s*([0-9a-f]+):\s*((?:[0-9a-f]{2}\s+)+)\s*(.+)$', line)
        if m:
            decoded[int(m[1], 16)] = (bytes.fromhex(m[2]), m[3].strip())
    derived = []
    for entry, size, expected_pointer in [(0x401000, 17, 0x5cfb98), (0x401020, 17, 0x5cfb94),
                                          (0x401040, 74, 0x5cfb9c)]:
        slots = [0x5cfb58 + i * 4 for i, target in enumerate(pointers) if target == entry]
        assert slots == [expected_pointer]
        blob, read = admitted_read(f'read-init-{entry:x}.json', entry, size)
        cursor, rows = entry, []
        while cursor < entry + size:
            raw, text = decoded[cursor]
            assert raw == pe.read(cursor, len(raw)) and cursor + len(raw) <= entry + size
            rows.append({'address': hex(cursor), 'bytes': len(raw), 'sha256': sha(raw),
                         'instruction_text_sha256': sha(text.encode())})
            cursor += len(raw)
        assert cursor == entry + size and decoded[cursor-1][0] == b'\xc3'
        derived.append({'entry': hex(entry), 'end_inclusive': hex(cursor-1), 'bytes': size,
                        'CRT_pointer_address': hex(expected_pointer), 'read': read,
                        'instruction_count': len(rows), 'instructions': rows,
                        'canonical_native_dossier': False, 'provenance': 'CRT-table-bound-independent-LLVM-view'})
    assert pe.read(0x401051, 10) == b'\xc7\x05' + struct.pack('<II', 0x63c800, 0x5d6710)
    defaults = []
    for insn, address in [(0x40105b, 0x63c8cc), (0x401065, 0x63c8d0),
                           (0x40106f, 0x63c8d4), (0x401079, 0x63c8d8)]:
        assert pe.read(insn, 10) == b'\xc7\x05' + struct.pack('<II', address, 0)
        defaults.append({'instruction': hex(insn), 'address': hex(address),
                         'App_offset': hex(address-0x63c800), 'value': 0})
    pe_at = struct.unpack_from('<I', pe.raw, 60)[0]
    entry = pe.base + struct.unpack_from('<I', pe.raw, pe_at+24+16)[0]
    assert entry == 0x584fb4
    storage = [s for s in pe.sections if s[0] <= 0x63c800 < s[0]+s[4]]
    assert len(storage) == 1 and storage[0][0]+storage[0][1] == 0x63c800
    app_storage = dict(address='0x63c800', raw_backed=False, section_start=hex(storage[0][0]),
                       section_raw_end=hex(storage[0][0]+storage[0][1]),
                       section_virtual_end=hex(storage[0][0]+storage[0][4]),
                       explicit_custom_zero_stores=defaults)
    counter, counter_read = admitted_read('read-data-dns-counter.json', 0x63c7d8, 4)
    assert counter == b'\0'*4
    literals = []
    for name, address, value in [('taskbar',0x5d29dc,'TaskbarCreated'),
                                  ('drag',0x5d29ec,'commctrl_DragListMsg')]:
        blob = value.encode() + b'\0'
        data, read = admitted_read(f'read-data-{name}.json', address, len(blob))
        assert data == blob
        literals.append(dict(name=value, read=read))
    chain = vtable_info(pe, 0x5d3540)
    assert chain == load(PRIVATE / 'main-message-chain.json') and chain['observed_base_chain_closed']
    registered = []
    for span in chain['message_chain']:
        for row in span['entries']:
            if row['message'] == '0xc000' and row['observed_signature_tag'] in (0x63c7e0,0x63c7dc):
                registered.append(row)
    assert len(registered) == 2
    imports = selected_imports(pe)
    assert imports['selected'][0]['iat_address'] == '0x5cf860'
    failed = load(PRIVATE / 'failed-function-401040.json')
    assert 'evidence_id' not in failed
    inherited = []
    for name in ['launcher-apply', 'launcher-catalog-state', 'launcher-catalog-install', 'launcher-host-routing']:
        path = OUT / f'{name}-contract.json'
        r = load(path)
        assert r['source']['sha256'] == SHA
        inherited.append(identity(path))
    summary = {'body_entries': len(bodies),
               'new_native_dossiers': sum(x['kind']=='new-native' for x in bodies),
               'reused_native_dossiers': sum(x['kind']=='reused-native' for x in bodies),
               'composed_reused_bodies': sum(x['kind']=='composed' for x in bodies),
               'range_reads': sum(len(x['ranges']) for x in bodies),
               'range_bytes': sum(s['bytes'] for x in bodies for s in x['ranges']),
               'semantic_anchor_groups': len(anchors), 'derived_CRT_entries': len(derived),
               'derived_initializer_bytes': sum(x['bytes'] for x in derived),
               'derived_initializer_instructions': sum(x['instruction_count'] for x in derived),
               'CRT_table_entries': len(pointers), 'auxiliary_data_reads': 4,
               'all_read_records': sum(len(x['ranges']) for x in bodies)+len(derived)+4,
               'registered_message_bindings': len(registered)}
    source = dict(schema='moli.capability.launcher-lifecycle-source-check.v1', source=identity(TARGET),
                  native_profile_digest=NATIVE, workflow_profile_digest=WORKFLOW,
                  tools={'REA':'6.7.0','Ghidra':'12.1.4','LLVM':'Apple LLVM 21.0.0'},
                  summary=summary, bodies=bodies, semantic_anchors=anchors,
                  all_native_loaded_image_read_bytes_match_original_PE=True,
                  CRT_initializers=dict(PE_entry=hex(entry), table_read=table_read, table_entries=len(pointers),
                                        derived_views=derived, retained_disassembly=identity(llvm_path),
                                        tool_receipt=identity(receipt_path), tool_sha256=receipt['tool_sha256'],
                                        failed_canonical_query=identity(PRIVATE/'failed-function-401040.json'),
                                        failed_query_counted_as_dossier=False),
                  App_storage=app_storage, resolver_counter_initial_value=dict(value=0, read=counter_read),
                  registered_message_names=literals, registered_message_bindings=registered,
                  Main_message_chain=chain, selected_PE_imports=imports, reused_contracts=inherited,
                  original_execution=False, runtime_features_changed=False,
                  limitations=['Derived CRT views are not canonical recovered functions.',
                               'Timer pseudocode removes three blocks; successful Connect is corroborated by full-body assembly.',
                               'Normal DNS completion/release is bound; all exception,allocation and underlying channel drain paths are not closed.',
                               'Source and selected-state proof is distinct from actual platform/account/official acceptance.'])
    write('launcher-lifecycle-source-check.json', source)
    facts = [
        ('App-defaults',['0x584fb4','0x584e38','0x5a8ac8','0x5ce480','0x430ce0'],
         'The PE entry reaches the CRT routine that conditionally walks [5cfb58,5cfe38). Three actual pointer targets bind the independently decoded message initializers and App constructor view. App63c800 gets vptr5d6710 and explicit zero stores to +cc/+d0/+d4/+d8, then registers5ce480 for normal atexit cleanup. This proves selected source startup/default stores, not that startup or normal cleanup occurred in a running process.'),
        ('message-identity',[],
         'CRT entries401000/401020 register commctrl_DragListMsg and TaskbarCreated into63c7e0/63c7dc. Main registered-message rows bind41fe80/4238b0 respectively. They are drag-list/tray recreation messages, separate from App activation and the AAChannel reply adapter; no login generation identity follows from their registration.'),
        ('ordinary-attempt',['0x41e420','0x4291d0'],
         'Ordinary submit initializes next candidate index main+1a7c from rand modulo count and remaining attempts+1a80 from count, sets busy+1a74 and stores the returned100ms timer in+1ff8. Each attempt decrements remaining, advances index modulo count, copies host/port into the Frame, stops the channel, clears request-sent+1a76, sets GetTickCount+10000 and starts the job in+1a78, recording its start result in+1a77. Failed starts immediately advance candidates. Neither+1a7c nor+1a80 is a request-generation field.'),
        ('DNS-job-ownership',['0x418a10','0x417aa0','0x4260e0'],
         'The job factory first clears/releases the output slot. Its shared counted admission allows at most4 outstanding counted resolver tasks. A normally allocated64-byte job starts with refs2/done0, owns a hostname string, a result buffer at+20, default status11001 at+38 and resolver pointer+3c. Successful thread creation closes its handle and publishes the job pointer; this does not join or stop the thread. Cap rejection and normal thread-start failure reduce the counter. Allocation-null and exceptional paths are not claimed fully handled.'),
        ('DNS-worker',['0x426a30','0x429fb0','0x42a015','0x4260e0'],
         'The supplied426a30 function performs IPv4 stream getaddrinfo, uses the first result and formats an IPv4 address. The worker invokes that resolver with its owned host,job+20 and length22, stores status+38, then the normal cleanup publishes done atomically, reduces the counter and releases the worker reference. The selected normal worker route writes its private job, with no Main/window callback. Normal owner detachment therefore permits a late resolver to finish without publishing through an old Main-owned slot; it does not interrupt getaddrinfo.'),
        ('timer-deadlines',['0x424cf0','0x4291d0'],
         'The DNS timer checks signed32(GetTickCount-deadline) before completion. At expiry it detaches/releases the current job and advances candidates. A completed job is copied locally, its status read, then detached/released and DNS phase cleared. Assembly restores decompiler-removed status0/nonempty-address checks and Connect(address,low16(port)). DNS resolution and channel readiness share the first10s deadline; an accepted login submission sets request-sent and starts another10s deadline. This is a source threshold, not measured wall-clock behavior.'),
        ('stop-close-destroy',['0x41b690','0x41a020','0x42e260','0x41fa60'],
         'Stop clears/releases the current job, clears pending/request-sent/busy and remaining attempts, kills the stored timer or fallback100, and stops the channel. A pending close request is consumed and Frame WM_CLOSE posted. Frame close first defers through Main while busy; Main destruction also detaches/releases its job. These paths release owner references; no synchronous DNS termination follows from them.'),
        ('reply-gate',['0x4316c0','0x422b80','0x422cb0','0x423c30','0x587340','0x5875e0'],
         'The reply adapter keeps the existing16-argument stack ABI proof and calls the success gate before the UI consumer. The gate requires Main busy and Stop returning no deferred close; otherwise it returnsfalse. The retry error helper also checks busy. Connect creates an internal channel and callback registration; Stop delegates internal teardown. The selected Main gates do not carry a candidate generation or prove that a reply from a superseded channel cannot reach a newly busy attempt. Full internal draining/dispatch ownership remains open.'),
        ('separate-task-owners',[],
         'Prior same-source contracts retain separate catalog task fields+2bc4/+2bc8, process busy handles+2b84/+2b88/+2b90, preparation/patch state and modal editing ownership. The DNS slot+1a78 and busy+1a74 do not replace these gates; inherited contracts and their remaining boundaries remain applicable.')
    ]
    rows = [dict(id=i, procedures=es, claim=claim, kind='fact') for i,es,claim in facts]
    assert all(e in indexed for row in rows for e in row['procedures'])
    contract = dict(schema='moli.capability.launcher-lifecycle-contract.v1', source=identity(TARGET),
                    source_check='analysis/capability-first-v1/launcher-lifecycle-source-check.json',
                    capabilities=['L01','L03','L05','L06','L08'], facts=rows,
                    scope_refinement=['Same C82 source; older catalog/metadata source versions are not merged.',
                                      'CRT-derived views, canonical dossiers and retained-pseudocode compositions are separate.',
                                      'Selected normal job ownership is bound; the whole owner/exception/reentry graph is not closed.'],
                    inferences=[dict(kind='inference', implementation_added=False,
                                     claim='D1 should keep candidate budget, owned resolver job, login busy/request phase, catalog work and process ownership separate. A shared attempt owner can preserve cancellation and selected deadline behavior while platform DNS/timer/channel adapters provide explicit late-event semantics. Any new generation token is an independent implementation mechanism, not a recovered wire field or proven native counter.')],
                    requirement_answers=[
                        dict(question=1,status='answered-bounded-source',result='Actual CRT entry traversal binds the App defaults and registered normal destructor, despite canonical401040 query failure.'),
                        dict(question=2,status='partially-answered',result='Candidate,owned DNS job,normal completion,deadline,stop/close and busy reply gate bound; internal channel drain/late reply/reopen remains.'),
                        dict(question=3,status='partially-answered',result='Prior startup/catalog/patch/modal owner rules reused with independent boundaries; no whole lifecycle completion claim.'),
                        dict(question=4,status='answered-bounded-source',result='Independent owner/state implications and remaining platform/lifecycle conditions recorded without new product code.')],
                    remaining=['Underlying channel callback dispatch,Stop/cleanup synchronization,already queued replies and new-attempt identity; busy alone is not full late-result protection.',
                               'All modal/async close/reopen and exception/allocation/thread-start combinations, explicit XML clear/remove and caller recovery, plus dynamic menu targets and three resource uses.',
                               'Game actual alternate callback dispatch,graphics/input/shared-state ownership and remaining full capability conditions.',
                               'Shared implementation and actual platform/device/account/official acceptance remain outside this static package.'],
                    original_execution=False, account_or_session_observed=False, runtime_features_changed=False,
                    all_capability_analysis_complete=False, implementation_gate_passed=False,
                    official_acceptance=False, full_goal_complete=False)
    write('launcher-lifecycle-contract.json', contract)
    print(json.dumps(summary, sort_keys=True))


if __name__ == '__main__':
    main()
