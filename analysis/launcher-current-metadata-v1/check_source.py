"""Read-only source/hash anchoring; never loads or executes the PE sample."""
import hashlib
import json
import struct
import sys
from pathlib import Path

root = Path(__file__).resolve().parents[2]
packed_path, derived_path = map(Path, sys.argv[1:3])
packed, derived = packed_path.read_bytes(), derived_path.read_bytes()
expected_packed = '71180e5bdda771e7d57dd27d2b879beddee55d61b957dadf7a2da60c907cb69a'
expected_derived = 'c7ba69f77809fe589fd5dcccc78fcd4f33d4b6f76325d00a27f37032bbb32384'
sha = lambda data: hashlib.sha256(data).hexdigest()
if sha(packed) != expected_packed or sha(derived) != expected_derived:
    raise ValueError('Source identity mismatch')
if derived[:2] != b'MZ':
    raise ValueError('Expected PE source')
pe = struct.unpack_from('<I', derived, 0x3c)[0]
if derived[pe:pe + 4] != b'PE\0\0':
    raise ValueError('Invalid PE header')
count = struct.unpack_from('<H', derived, pe + 6)[0]
optional = struct.unpack_from('<H', derived, pe + 20)[0]
base = struct.unpack_from('<I', derived, pe + 24 + 28)[0]
sections = []
for number in range(count):
    at = pe + 24 + optional + number * 40
    name = derived[at:at + 8].split(b'\0')[0].decode('ascii')
    virtual_size, rva, raw_size, raw_at = struct.unpack_from('<IIII', derived, at + 8)
    sections.append((name, rva, raw_size, raw_at))


def raw_mapping(address, size):
    rva = address - base
    matches = [(name, raw_at + rva - start) for name, start, length, raw_at in sections
               if start <= rva and rva + size <= start + length]
    if len(matches) != 1:
        raise ValueError('Expected one file-backed section mapping')
    name, offset = matches[0]
    if offset + size > len(derived):
        raise ValueError('Mapping exceeds source bytes')
    return name, offset


anchors = []
for address, expected_hex in [
    (0x406cfc, 'c746f420000000'), (0x407123, 'e888c40200'),
    (0x407227, 'e884c30200'), (0x43fde0, '55'),
    (0x406d42, 'e8c5161900'), (0x43fdeb, '0457'),
    (0x40660d, '83f80a'), (0x406f46, '3dff000000'),
]:
    expected = bytes.fromhex(expected_hex)
    section, offset = raw_mapping(address, len(expected))
    if derived[offset:offset + len(expected)] != expected:
        raise ValueError('Instruction anchor mismatch')
    anchors.append(dict(kind='instruction', address=hex(address), file_offset=offset,
                        section=section, hex=expected_hex, matched=True))
for address, expected in [
    (0x5cf398, b' \r\n\0'), (0x5d811c, b'&rtm=%lu\0'),
    (0x5d8128, b'?rtm=%lu\0'), (0x5d8134, b'POLLauncher/1.0\0'),
]:
    section, offset = raw_mapping(address, len(expected))
    if derived[offset:offset + len(expected)] != expected:
        raise ValueError('Literal anchor mismatch')
    anchors.append(dict(kind='literal', address=hex(address), file_offset=offset,
                        section=section, hex=expected.hex(), matched=True))

spec = json.loads(Path(__file__).with_name('implementation-spec.json').read_text())
bundle_path = root / 'build/analysis/launcher-current-metadata-v1/rea-evidence.json'
bundle = json.loads(bundle_path.read_text())
previous = json.loads((root / 'build/analysis/launcher-current-catalog-v1/rea-evidence.json').read_text())
records = {row['evidence_id']: row for row in bundle['records']}
previous_ids = {row['evidence_id'] for row in previous['records']}
query_ids = {row['evidence_id'] for row in spec['queries']}
if len(records) != 51 or len(previous_ids) != 31 or not previous_ids.issubset(records):
    raise ValueError('Evidence inventory mismatch')
if set(records) - previous_ids != query_ids or len(query_ids) != 20:
    raise ValueError('New query ledger does not match exported evidence')
if any(records[key]['analysis_profile']['digest'] != spec['target']['profile'] for key in query_ids):
    raise ValueError('Evidence profile mismatch')
exports = []
for relative in ['build/analysis/launcher-current-metadata-v1/rea-evidence.json',
                 'build/analysis/launcher-current-metadata-v1/rea-snapshot.json']:
    payload = (root / relative).read_bytes()
    exports.append(dict(path=relative, bytes=len(payload), sha256=sha(payload), private=True))
receipt = dict(schema='moli.launcher-current-metadata-v1.source-check.v1',
               packed=dict(bytes=len(packed), sha256=sha(packed), md5=hashlib.md5(packed).hexdigest()),
               analysis_copy=dict(bytes=len(derived), sha256=sha(derived), executed=False),
               provider='Ghidra12.1.4 / REA6.7.0 skill42',
               profile=spec['target']['profile'], anchors=anchors,
               mapping='Independent PE section mapping; VA is not used as a file offset',
               rea_private_exports=exports, records_total=len(records), retained_records=len(previous_ids),
               new_records=len(query_ids), new_function_dossiers=12, new_instruction_queries=8,
               session_exported_and_closed=True, original_program_or_network_executed=False,
               scope='Anchors corroborate identity and selected instructions/literals. Complete function/consumer conclusions are tied to the 20-query ledger and retained full worker dossier; anchors alone do not prove all semantics.')
with Path(__file__).with_name('source-check.json').open('x', encoding='utf-8') as file:
    json.dump(receipt, file, ensure_ascii=False, indent=2)
    file.write('\n')
print(json.dumps(dict(anchors=len(anchors), records=len(records), new_records=len(query_ids),
                     packed_md5=receipt['packed']['md5'])))
