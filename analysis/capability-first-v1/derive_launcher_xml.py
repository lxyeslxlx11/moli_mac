#!/usr/bin/env python3
"""Verify fixed-source XML semantics; never execute the original target."""
import hashlib
import itertools
import json
import re
import struct
from pathlib import Path

from extract_entry_inventory import PE

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / 'analysis/capability-first-v1'
PRIVATE = ROOT / 'build/analysis/capability-launcher-xml-v1'
TARGET = ROOT / 'build/analysis/launcher-current-runtime-v4/POLCN_Launcher.analysis-only.exe'
SHA = 'c82fc98d3d274beadee91254e3343974d7c7fdaf2b2a32bc21cc81b76e85c152'
NATIVE = '7810ea9437da59780820ec6fedb47ce47390841a95d527ddb6c3b3700fe180cb'
WORKFLOW = 'b9a9b4f868ae80c2a55407e7d3772a125da19a3d5e2e1765df03951cbd797158'
BUNDLES = [ROOT / 'build/analysis/capability-launcher-host-routing-v1/rea-launcher-evidence.json',
           ROOT / 'build/analysis/launcher-current-patch-v1/rea-complete-path.json']


def sha(blob):
    return hashlib.sha256(blob).hexdigest()


def load(path):
    return json.loads(path.read_text())


def identity(path):
    return {'path': str(path.relative_to(ROOT)), 'bytes': path.stat().st_size, 'sha256': sha(path.read_bytes())}


def write(name, value):
    (OUT / name).write_text(json.dumps(value, ensure_ascii=False, indent=2) + '\n')


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

    anchor('0x437580', 'document-constructor-type-vptr-tab-size', '0x437600:', '0x48', '0x34')
    anchor('0x438580', 'file-load-reset-chunk-append-and-error-flag-result',
           'PUSH 0x800', 'CALL 0x00437330', 'CALL dword ptr [EAX + 0x8]',
           '0x4386f4: CMP byte ptr [EDI + 0x34], 0x0', 'SETZ BL')
    anchor('0x438750', 'file-load-wrapper-forwards-encoding', 'CALL 0x00438580')
    anchor('0x43a260', 'document-node-loop-and-encoding-selection', 'CALL 0x004398b0', 'CALL 0x00438540',
           'CALL 0x0043aea0', '0x34', '0x38', '0xd')
    anchor('0x4398b0', 'node-identification-and-concrete-vptrs', '0x439968:', '0x4399fd:', '0x439a4c:', 'CALL 0x00439b40')
    anchor('0x437880', 'node-type-parameter-and-parent-child-defaults', '0x14', '0x18', '0x1c')
    anchor('0x437770', 'element-type-and-parse-vptr', '0x4377e4:', '0x14')
    anchor('0x439b40', 'element-name-start-byte-class', '0x7f')
    anchor('0x43a9b0', 'name-byte-class-and-colon', '0x7f', '0x5f', '0x2d', '0x2e', '0x3a')
    anchor('0x439b90', 'quoted-and-unquoted-attribute-paths', 'CALL 0x0043a9b0', 'CALL 0x0043aa70', 'CALL 0x004394f0')
    anchor('0x43a410', 'element-attributes-closing-tag-and-duplicate-branch',
           'CALL 0x00438460', 'CALL 0x00437c00', 'CALL 0x0043ac30', 'CALL 0x0043ae40',
           '0x43a62e: LEA ECX, [EAX + 0x20]', '0x43a641: XOR EDI, EDI')
    anchor('0x438460', 'attribute-name-match', 'CALL 0x004372c0')
    anchor('0x43ac30', 'text-vs-node-and-default-condense-use', '0x43acc1:', '636030', 'CALL 0x00438540')
    anchor('0x43a800', 'text-reader-uses-trim-and-less-than-delimiter', 'PUSH 0x5d9500', 'PUSH 0x1', 'CALL 0x0043aa70')
    anchor('0x43aa70', 'text-read-condense-and-unconditional-end-length-arithmetic',
           '636030', 'CALL 0x00439540', 'CALL 0x004395b0', '0x43ac1a: LEA EAX, [ECX + ESI*0x1]')
    anchor('0x43aea0', 'whitespace-and-UTF8-marker-skips', '0xef', '0xbb', '0xbf', '0xbe')
    anchor('0x439540', 'width-table-copy-without-scalar-decoding', '0x5d9758', 'CALL 0x004395b0', 'CALL 0x005a4a70')
    anchor('0x4395b0', 'entity-decode-mode-ranges-and-indirect-cases',
           '0x78', '0x200000', '0x636070', '0x43977e: JMP dword ptr [EAX*0x4 + 0x439898]')
    anchor('0x439d20', 'comment-end-reader', 'PUSH 0x5d953c', 'CALL 0x0043aa70')
    anchor('0x43a870', 'unknown-node-stops-at-first-greater-than', '0x3e')
    anchor('0x439de0', 'declaration-values-corrobated-by-assembly',
           'CALL 0x00439b90', '0x439fba: CMOVNZ', '0x43a0b1: CMOVNZ', '0x43a195: CMOVNZ')
    anchor('0x43ae40', 'first-error-gate-and-position', '0x34', '0x38', '0x4c', '0x50', 'CALL 0x0043af60')
    anchor('0x438540', 'link-partial-node-without-return-pointer-gate', '0x10', '0x18', '0x1c', '0x30')
    anchor('0x437440', 'counted-append-stops-at-NUL', 'CMP byte ptr')
    anchor('0x4394f0', 'single-byte-append-capacity-path', '0x1')
    anchor('0x40bf80', 'catalog-load-container-gate-and-immediate-text-type',
           'CALL 0x00438750', 'CALL 0x004384a0', '0x14], 0x4', '0x40d3f8: MOV BL, 0x1')

    def loaded(address, count):
        path = PRIVATE / f'read-range-{address:x}.json'
        r = load(path)
        n = r['normalized_result']
        assert r['subject']['digest']['sha256'] == SHA and r['analysis_profile']['digest'] == NATIVE
        blob = bytes.fromhex(n['bytes_hex'])
        assert n['complete'] and n['address'] == hex(address)
        assert n['returned_bytes'] == len(blob) == count and blob == pe.read(address, count)
        return blob, {'address': hex(address), 'bytes': count, 'file_offset': pe.file_offset(address, count),
                      'sha256': sha(blob), 'read_evidence_id': r['evidence_id'], 'retained_read': identity(path)}

    case_bytes, gap_read = loaded(0x439785, 70)
    jump_bytes, jump_read = loaded(0x439898, 16)
    targets = list(struct.unpack('<4I', jump_bytes))
    assert targets == [0x4397a9, 0x43979d, 0x439791, 0x439785]
    disasm_path = PRIVATE / 'entity-cases-llvm.txt'
    receipt_path = PRIVATE / 'entity-cases-llvm-receipt.json'
    receipt = load(receipt_path)
    assert receipt['exit_code'] == 0 and receipt['source_sha256'] == SHA
    assert receipt['original_execution'] is False and receipt['canonical_REA_unchanged'] is True
    assert receipt['stdout_sha256'] == sha(disasm_path.read_bytes())
    assert sha(Path(receipt['tool_path']).read_bytes()) == receipt['tool_sha256']
    instructions, position = [], 0x439785
    for line in disasm_path.read_text().splitlines():
        match = re.match(r'^\s*([0-9a-f]+):\s*((?:[0-9a-f]{2}\s+)+)\s*(.+)$', line)
        if not match:
            continue
        address = int(match.group(1), 16)
        blob = bytes.fromhex(match.group(2))
        assert address == position and blob == pe.read(address, len(blob))
        instructions.append({'address': hex(address), 'bytes': len(blob), 'sha256': sha(blob),
                             'decoded_text_sha256': sha(match.group(3).encode())})
        position += len(blob)
    assert position == 0x4397cb and len(instructions) == 34
    assert set(targets) <= {int(r['address'], 16) for r in instructions}
    entity_ranges = indexed['0x4395b0']['ranges']
    assert [(r['start'], r['end_inclusive']) for r in entity_ranges] == [('0x4395b0', '0x439784'), ('0x4397cb', '0x439897')]
    assert sum(r['bytes'] for r in entity_ranges) + len(case_bytes) == 744
    derived = {'authority': 'independent-LLVM-static-decode-of-source-table-targets', 'canonical_native_dossier': False,
               'canonical_native_body_ranges_unchanged': True, 'fragment': gap_read,
               'source_jump_table': jump_read, 'dispatch_entries': [hex(x) for x in targets],
               'instructions': instructions, 'retained_disassembly': identity(disasm_path),
               'tool_receipt': identity(receipt_path), 'observed_tool_version': receipt['tool_version'].splitlines()[0],
               'all_instruction_bytes_match_original_PE': True, 'original_execution': False,
               'selected_entity_span_bytes_after_reconciliation': 744}

    width_bytes, width_read = loaded(0x5d9758, 1024)
    widths = list(struct.unpack('<256I', width_bytes))
    assert widths == [1] * 194 + [2] * 30 + [3] * 16 + [4] * 5 + [1] * 11
    width_runs, first = [], 0
    for value, values in itertools.groupby(widths):
        count = len(list(values))
        width_runs.append({'first_byte': first, 'last_byte': first + count - 1, 'width': value})
        first += count
    named_bytes, named_read = loaded(0x636070, 60)
    named = []
    for i, (expected, character) in enumerate([('&amp;', 38), ('&lt;', 60), ('&gt;', 62), ('&quot;', 34), ('&apos;', 39)]):
        address, count, value = struct.unpack_from('<IIB3x', named_bytes, i * 12)
        blob = expected.encode() + b'\0'
        assert count == len(expected) and value == character and pe.read(address, len(blob)) == blob
        named.append({'entry_address': hex(0x636070 + i * 12), 'literal_address': hex(address),
                      'literal': expected, 'length': count, 'output_byte': value, 'literal_sha256': sha(blob)})
    flag_bytes, flag_read = loaded(0x636030, 1)
    assert flag_bytes == b'\1'
    delimiter_literals = []
    for address, text in [(0x5d9504, '</'), (0x5d94f4, '>'), (0x5d9500, '<'),
                          (0x5d953c, '-->'), (0x5d9b60, 'UTF8')]:
        blob = text.encode() + b'\0'
        assert pe.read(address, len(blob)) == blob
        delimiter_literals.append({'address': hex(address), 'text': text, 'bytes': len(blob),
                                   'file_offset': pe.file_offset(address, len(blob)), 'sha256': sha(blob)})
    xref_path = PRIVATE / 'condense-flag-xrefs.json'
    xrefs = load(xref_path)
    assert xrefs['subject']['digest']['sha256'] == SHA and xrefs['normalized_result'] == ['0x43aa8d', '0x43acdf']
    for entry, address in [('0x43aa70', '0x43aa8d'), ('0x43ac30', '0x43acdf')]:
        assert any(line.startswith(address + ':') and '636030' in line for line in assembly[entry])

    bindings = []
    for kind, type_id, constructor, store, vt, parser in [
            ('document', 0, '0x437580', 0x437600, 0x5d015c, 0x43a260),
            ('element', 1, '0x437770', 0x4377e4, 0x5d9450, 0x43a410),
            ('comment', 2, '0x4398b0', 0x4399fd, 0x5d946c, 0x439d20),
            ('unknown', 3, '0x4398b0', 0x439a4c, 0x5d94c0, 0x43a870),
            ('text', 4, '0x43ac30', 0x43acc1, 0x5d9488, 0x43a800),
            ('declaration', 5, '0x4398b0', 0x439968, 0x5d94a4, 0x439de0),
            ('attribute', None, '0x43a410', 0x43a591, 0x5d943c, 0x439b90)]:
        assert any(line.startswith(hex(store) + ':') and hex(vt) in line for line in assembly[constructor])
        blob = pe.read(vt + 8, 4)
        assert struct.unpack('<I', blob)[0] == parser
        bindings.append({'kind': kind, 'node_type': type_id, 'vptr_store_procedure': constructor,
                         'vptr_store': hex(store), 'vtable': hex(vt), 'parse_slot_offset': '0x8',
                         'parse_target': hex(parser), 'slot_bytes_sha256': sha(blob)})
    error_rows = []
    for i in range(14):
        pointer = 0x636034 + i * 4
        address = struct.unpack('<I', pe.read(pointer, 4))[0]
        blob = bytearray()
        for j in range(256):
            value = pe.read(address + j, 1)[0]
            if not value:
                break
            blob.append(value)
        else:
            raise AssertionError('error text metadata budget')
        error_rows.append({'error_id': i, 'pointer_address': hex(pointer), 'text_address': hex(address),
                           'text_bytes': len(blob), 'text_sha256': sha(bytes(blob))})

    probe_path = PRIVATE / 'parser-coverage-probe.json'
    probe = load(probe_path)
    assert probe['original_target_executed'] is False and probe['server_or_account_accessed'] is False
    assert probe['product_behavior_changed'] is False
    assert probe['summary'] == {'cases': 28, 'independent_parser_accepts': 11,
                                'selected_property_agrees': 4, 'selected_property_differs': 24}
    assert len(probe['cases']) == len({row['id'] for row in probe['cases']}) == 28
    for row in probe['source_inputs']:
        assert identity(ROOT / row['path']) == row
    assert all(row['native_static_expectation']['authority'] == 'inference-from-selected-static-rules'
               and row['native_static_expectation']['original_execution'] is False for row in probe['cases'])
    comparison = {**probe, 'retained_result': identity(probe_path),
                  'probe_driver': identity(PRIVATE / 'parser-coverage-probe.mjs'),
                  'native_runtime_comparison_performed': False}
    historical_path = ROOT / 'analysis/launcher-current-catalog-v1/implementation-spec.json'
    historical = load(historical_path)
    historical_sha = historical['target']['analysis_unpacked_sha256']
    assert historical_sha == 'c7ba69f77809fe589fd5dcccc78fcd4f33d4b6f76325d00a27f37032bbb32384' and historical_sha != SHA
    summary = {'body_entries': len(bodies), 'new_native_dossiers': sum(r['kind'] == 'new-native' for r in bodies),
               'reused_native_dossiers': sum(r['kind'] == 'reused-native' for r in bodies),
               'composed_reused_bodies': sum(r['kind'] == 'composed' for r in bodies),
               'range_reads': sum(len(r['ranges']) for r in bodies),
               'range_bytes': sum(s['bytes'] for r in bodies for s in r['ranges']),
               'semantic_anchor_groups': len(anchors), 'node_and_attribute_parse_bindings': len(bindings),
               'UTF8_width_entries': len(widths), 'named_entities': len(named), 'error_metadata_rows': len(error_rows),
               'derived_numeric_case_bytes': 70, 'derived_numeric_case_instructions': len(instructions),
               'numeric_case_entries': len(targets), 'auxiliary_data_reads': 4, 'all_read_records': 40,
               'existing_parser_probe_cases': 28, 'selected_static_expectation_differences': 24}
    source_check = {'schema': 'moli.capability.launcher-XML-source-check.v1', 'source': identity(TARGET),
                    'tools': {'REA': '6.7.0', 'Ghidra': '12.1.4', 'native_profile': NATIVE, 'workflow_profile': WORKFLOW},
                    'summary': summary, 'bodies': bodies, 'instruction_anchors': anchors, 'parse_bindings': bindings,
                    'delimiter_literals': delimiter_literals,
                    'numeric_cases_derived_view': derived,
                    'UTF8_width_table': {'read': width_read, 'runs': width_runs},
                    'named_entity_table': {'read': named_read, 'entries': named},
                    'condense_flag': {'read': flag_read, 'initial_value': 1, 'analyzed_xrefs': xrefs['normalized_result'],
                                      'retained_xrefs': identity(xref_path), 'all_possible_writes_excluded': False},
                    'error_string_metadata': error_rows, 'existing_parser_comparison': comparison,
                    'historical_spec': {'artifact': identity(historical_path), 'source_sha256': historical_sha,
                                        'same_source_as_this_contract': False},
                    'all_native_loaded_image_read_bytes_match_original_PE': True,
                    'read_memory_kind': 'static analyzer image, never original process memory',
                    'library_family': 'TiXml class labels, source vptrs and byte layouts', 'library_version_verified': False,
                    'limitations': ['Selected analyzed ranges and one separately decoded gap do not prove whole-program closure.',
                                    'The canonical entity decompiler retains its unresolved jump; the70-byte/4-entry decode is analyst-derived and separate.',
                                    'Declaration pseudocode removes three conditional-value blocks; source assembly is retained and checked instead.',
                                    'Existing-parser executions are real; the native side of their comparison remains static inference.',
                                    'No original XML process, OS file/locale failure, undefined-pointer input or allocation fault was exercised.']}
    write('launcher-xml-source-check.json', source_check)
    facts = [
        {'id': 'file-load', 'procedures': ['0x438580', '0x438750'], 'claim':
         'File load deletes old child nodes before opening the stored byte filename with mode r. It appends NUL-terminated '
         'chunks from the2048-byte reader and calls document parse through slot8 with the supplied mode. A zero file length '
         'returnsfalse without invoking parse; after a nonempty parse, AL is based on error_flag==0 rather than the returned pointer. '
         'File/chunk/locale error effects are not a whole-file byte-decoding guarantee.'},
        {'id': 'document-state-and-prefix', 'procedures': ['0x43a260', '0x438540', '0x4398b0'], 'claim':
         'Direct Parse resets error diagnostics and locations but does not clear existing children. It identifies/parses/links '
         'nodes in order, including linking a node even when its parse pointer is NULL. A non-element/plain-text tail can stop '
         'identification without a new error. More than one top-level element is not rejected by this loop; no-child input sets13. '
         'Returned parse pointer, nonempty child list and the error flag are distinct results.'},
        {'id': 'encoding-mode', 'procedures': ['0x43a260', '0x439de0', '0x43b180'], 'claim':
         'Mode0 is initially unknown. A leading EF BB BF selects1; a parsed declaration with absent/empty encoding or a '
         'case-insensitive UTF-8/UTF8 prefix selects1, otherwise2. Mode1 controls byte-width handling and numeric output; '
         'modes0/2 otherwise use single-byte handling. These modes do not transcode raw file bytes to Unicode strings.'},
        {'id': 'UTF8-byte-copy', 'procedures': ['0x439540', '0x43aa70', '0x43aea0'], 'claim':
         'Mode1 uses the256-entry width table:00..C1=>1,C2..DF=>2,E0..EF=>3,F0..F4=>4,F5..FF=>1. Multi-byte sequences '
         'are copied without a continuation/scalar validity check in this reader. UTF8 whitespace skipping can also skip '
         'EF BB BF,EF BF BE,EF BF BF markers; ordinary whitespace uses the byte CRT classification plus CR/LF.'},
        {'id': 'node-identification', 'procedures': ['0x4398b0', '0x437880', '0x43ac30'], 'claim':
         'Observed node types are document0,element1,comment2,unknown3,text4,declaration5. The factory recognizes a '
         'case-insensitive <?xml prefix, then comment, then <! as unknown, then an immediate valid name-start as element, '
         'otherwise unknown. There is no separate CDATA branch in this factory. ReadValue creates text only on its non-< path.'},
        {'id': 'unknown-and-comment', 'procedures': ['0x43a870', '0x439d20', '0x43aa70'], 'claim':
         'Unknown nodes copy bytes after< to the first> without DTD/namespace/entity-declaration interpretation. Comment '
         'content is read to-->; that path does not reject an internal-- before the terminator. Unterminated/invalid-buffer '
         'outcomes are separate from these ordinary terminated paths.'},
        {'id': 'names-and-attributes', 'procedures': ['0x43a9b0', '0x439b40', '0x439b90', '0x43a410'], 'claim':
         'Name start is byte>=0x7f or the byte alpha class or underscore; later name bytes also allow digit,hyphen,dot,colon. '
         'Names remain raw and namespace attributes are ordinary data. Attributes can be single/double quoted or unquoted; '
         'unquoted text stops on whitespace,slash,> and bypasses entity expansion. The outer element loop does not require '
         'whitespace between successive quoted attributes. Quoted values use the generic text reader.'},
        {'id': 'closing-and-duplicate-attributes', 'procedures': ['0x43a410', '0x438460'], 'claim':
         'Self-close requires/>. The constructed ordinary closing delimiter is exact </name>; whitespace before its> does '
         'not match. A duplicate attribute updates the existing value then returns NULL on that branch without a direct '
         'SetError call there. Enclosing parsing and the document flag determine the eventual result; NULL alone is not '
         'equivalent to a diagnosed rejection.'},
        {'id': 'text-and-consumer', 'procedures': ['0x43ac30', '0x43a800', '0x43aa70', '0x40bf80', '0x403990'], 'claim':
         'The image default condense flag is1. Under that default, ordinary text strips leading/trailing literal whitespace '
         'and joins interior literal whitespace runs with one space; blank text nodes are discarded. Comment/unknown nodes '
         'remain distinct. The catalog producer takes only an immediate first child of type4, so leading comments/CDATA-as-unknown '
         'prevent that field assignment and later text parts are not concatenated.'},
        {'id': 'named-entities', 'procedures': ['0x4395b0', '0x439540'], 'claim':
         'The five case-sensitive named references are amp,lt,gt,quot,apos. An unmatched named reference or bare ampersand '
         'emits the current ampersand byte and advances one input byte, leaving following text literal. No caller compatibility '
         'flag is required by this native branch.'},
        {'id': 'numeric-entities', 'procedures': ['0x4395b0', '0x437440', '0x4394f0'], 'claim':
         'Numeric references use decimal or lowercase-x hex and unsigned32 arithmetic without a scalar-range/overflow check '
         'in the accumulation. Modes0/2 emit the low byte; mode1 selects1..4 output bytes below0x200000. Surrogates and '
         'values above0x10ffff are not filtered by that converter. Its four fallthrough cases occupy a separately verified70-byte '
         'gap outside the canonical analyzed body ranges. NUL/capacity and malformed-reference outcomes need the enclosing '
         'string/reader paths and are not inferred from a Unicode entity API.'},
        {'id': 'declaration', 'procedures': ['0x439de0', '0x439b90', '0x43b180'], 'claim':
         'Declaration recognition/field-prefix checks are case-insensitive. Version,encoding,standalone are parsed through '
         'the attribute reader; other tokens are skipped to whitespace or>. The normal terminator is> and there is no '
         'version1.0-only or initial-node-only gate here. Three retained CMOVNZ assembly sites corroborate value copies '
         'that the pseudocode had removed as unreachable.'},
        {'id': 'error-state-and-locations', 'procedures': ['0x43ae40', '0x437580', '0x43af60'], 'claim':
         'The helper records only the first error while flag+0x34 is clear, storing ID+0x38 and locations+0x4c/+0x50. '
         'The document constructor initializes tab size4; the cursor updater tracks rows,columns,tabs and the selected byte '
         'mode. A false file-load result, NULL parse pointer and a populated error ID are not interchangeable.'},
        {'id': 'catalog-publication', 'procedures': ['0x40bf80', '0x438580', '0x4384a0'], 'claim':
         'The catalog caller requires both load booleans plus exact Gamelist/Games and Regionlist/Regions element lookups '
         'before resetting/publishing shared rows. It does not add a whole-document EOF check or Unicode scalar validation. '
         'Early failures preserve that shared catalog gate boundary; the local parser trees may already be partial.'},
        {'id': 'independent-parser-observation', 'procedures': [], 'claim':
         '28 original synthetic inputs were run against the current independent JavaScript parser/decoder. Eleven are '
         'accepted by that implementation; four agree and24 differ on the selected properties relative to explicit '
         'static-source expectations. The native side was not executed, and this is neither native runtime differential '
         'testing nor full parser acceptance.'}
    ]
    for row in facts:
        row['kind'] = 'fact'
        assert all(entry in indexed for entry in row['procedures'])
    contract = {'schema': 'moli.capability.launcher-XML-contract.v1', 'source': identity(TARGET),
                'source_check': 'analysis/capability-first-v1/launcher-xml-source-check.json',
                'capabilities': ['L01', 'L02', 'L05', 'L06'], 'facts': facts,
                'scope_refinement': ['Same C82 source only; the historical current-catalog spec is C7BA and is not merged.',
                                     'The selected source behavior is not equivalent to a standard Unicode XML/DOM parser.',
                                     'Existing bounded parser budgets and rejection policy remain their explicit implementation profile; no product relaxation was made.'],
                'inferences': [{'kind': 'inference', 'claim': 'D1 needs a source-profile byte grammar and node ownership before '
                               'decoding display fields. Existing transport,digest,pair ownership and explicit codecs can be reused '
                               'after their interfaces are aligned; globally weakening the old string parser would not reproduce '
                               'CDATA,first-text,legacy numeric conversion or error publication.', 'implementation_added': False}],
                'requirement_answers': [
                    {'question': 1, 'status': 'answered-bounded-source', 'result': 'Load/reset,mode selection,whitespace,top-level loop and error/pointer distinctions bound; actual OS I/O/locale acceptance remains separate.'},
                    {'question': 2, 'status': 'answered-bounded-source', 'result': 'Selected node/name/attribute/text/entity/declaration/unknown grammar bound, including numeric case gap and declaration assembly corroboration; no claim of all invalid-memory outcomes.'},
                    {'question': 3, 'status': 'partially-answered', 'result': 'Duplicate/closing/partial-node/error and catalog gates specified. Invalid numeric/truncated/NUL/capacity/allocation/file outcomes and complete caller recovery remain.'},
                    {'question': 4, 'status': 'answered-bounded-comparison', 'result': 'Current independent behavior measured on28 synthetic inputs;24 selected-property differences against static expectations. Native runtime/official equivalence remains unverified.'}],
                'remaining': ['Exact malformed numeric/truncated terminator/embedded-NUL and capacity-dependent outcomes where selected readers perform unchecked pointer arithmetic; no original fault/acceptance proof.',
                              'Actual text-mode file,locale,allocation failures,explicit clear/remove and all caller update/rollback behavior.',
                              'App initializer,all modal/async late results and reopen guards,dynamic menu targets and remaining resource uses.',
                              'Game actual alternate callback dispatch,graphics/input/shared-state ownership and remaining business conditions in the full capability inventory.',
                              'Shared implementation and complete platform/device/account/official acceptance remain outside this static package.'],
                'original_execution': False, 'account_or_session_observed': False, 'runtime_features_changed': False,
                'all_capability_analysis_complete': False, 'implementation_gate_passed': False,
                'official_acceptance': False, 'full_goal_complete': False}
    write('launcher-xml-contract.json', contract)
    print(json.dumps(summary, sort_keys=True))


if __name__ == '__main__':
    main()

