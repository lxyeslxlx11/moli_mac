"""Bounded constant-data evaluation of the fixed sound constructor; no target execution."""
from pathlib import Path
from runpy import run_path
from hashlib import sha256
from collections import Counter
import json
import re
import struct

ROOT = Path(__file__).resolve().parents[2]
A = Path(__file__).resolve().parent
P = ROOT / 'build/analysis' / A.name
BASE = run_path(str(A.parent / 'game-legacy-startup-materials-v1/verify_source.py'))
IMAGE = BASE['Image']('build/analysis/game-release-current-v1/legacy-members/cg_se_6000.exe',
                     1569280, '37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd')


def catalog():
    """Admit only the straight-line MOV/LEA/XOR/PUSH/string-copy constructor prefix."""
    registers = {'esp': 0x20000}
    memory, reads, operations, instructions = {}, set(), Counter(), []
    aliases = {r: (r, 0, 32) for r in ['eax', 'ebx', 'ecx', 'edx', 'esi', 'edi', 'ebp', 'esp']}
    for r in ['eax', 'ebx', 'ecx', 'edx']:
        aliases[r[1:]] = (r, 0, 16)
        aliases[r[1] + 'l'] = (r, 0, 8)
        aliases[r[1] + 'h'] = (r, 8, 8)

    def reg(name):
        r, shift, bits = aliases[name]
        value = registers.get(r)
        assert value is not None, ('unobserved register', name)
        return value >> shift & ((1 << bits) - 1)

    def setreg(name, value):
        r, shift, bits = aliases[name]
        mask = ((1 << bits) - 1) << shift
        registers[r] = (registers.get(r, 0) & ~mask | (value << shift & mask)) & 0xffffffff

    def address(text):
        text = re.sub(r'^%[a-z]+:', '', text)
        if '(' not in text:
            return int(text, 0)
        m = re.fullmatch(r'(0x[0-9a-f]+)?\(%([a-z]+)\)', text)
        assert m, text
        return (int(m[1] or '0', 0) + reg(m[2])) & 0xffffffff

    def read(at, size):
        if 0x400000 <= at < 0x570000:
            data = IMAGE.locate(hex(at), size)[1]
            reads.update(range(at, at + size))
            return int.from_bytes(data, 'little')
        assert all(at + i in memory for i in range(size)), ('uninitialized memory', hex(at), size)
        return sum(memory[at + i] << (8 * i) for i in range(size))

    def write(at, value, size):
        assert 0x1ffe0 <= at < 0x25000 or at in [0xfba390, 0xfba394], hex(at)
        for i in range(size):
            memory[at + i] = value >> (8 * i) & 255

    def value(text, size):
        if text.startswith('$'):
            return int(text[1:], 0)
        if text.startswith('%') and ':' not in text:
            return reg(text[1:])
        return read(address(text), size)

    asm = ROOT / 'build/analysis/game-legacy-battle-self-flags-v1/image.asm'
    for line in asm.read_text().splitlines():
        m = re.match(r'\s*([0-9a-f]+):((?: [0-9a-f]{2})+)\s+(.+)', line)
        if not m or not 0x507dfa <= int(m[1], 16) < 0x50eb88:
            continue
        at = int(m[1], 16)
        raw = bytes.fromhex(m[2])
        assert IMAGE.locate(hex(at), len(raw))[1] == raw, hex(at)
        instructions.append((at, raw))
        text = m[3].split('#')[0].strip()
        op, args = text.split(None, 1)
        repeated = op == 'rep'
        if repeated:
            op, args = args.split(None, 1)
        operations[op] += 1
        if op in ['stosl', 'stosw', 'stosb', 'movsl', 'movsw', 'movsb']:
            size = {'l': 4, 'w': 2, 'b': 1}[op[-1]]
            count = reg('ecx') if repeated else 1
            assert 0 <= count <= 128
            for _ in range(count):
                if op.startswith('movs'):
                    word = read(reg('esi'), size)
                    setreg('esi', reg('esi') + size)
                else:
                    word = reg('eax')
                write(reg('edi'), word, size)
                setreg('edi', reg('edi') + size)
            if repeated:
                setreg('ecx', 0)
        elif op == 'pushl':
            # Four entry register saves are dead constructor storage. The last push
            # is an unrelated label after all rows have been defined.
            word = value(args, 4) if args.startswith('$') else registers.get(args[1:], 0)
            setreg('esp', reg('esp') - 4)
            write(reg('esp'), word, 4)
        else:
            source, target = args.split(', ')
            if op == 'xorl':
                assert source == target and source.startswith('%')
                setreg(target[1:], 0)
                continue
            assert op in ['movl', 'movw', 'movb', 'leal'], (hex(at), op)
            size = {'l': 4, 'w': 2, 'b': 1}[op[-1]]
            word = address(source) if op == 'leal' else value(source, size)
            if target.startswith('%') and ':' not in target:
                setreg(target[1:], word)
            else:
                write(address(target), word, size)
    assert instructions[0][0] == 0x507dfa and instructions[-1][0] == 0x50eb82
    assert all(a + len(raw) == b for (a, raw), (b, _) in zip(instructions, instructions[1:]))
    # The first row ID is MOV word [ESP+0x6c],1 at 507e37. The
    # loader's separately rebound stack cursor selects this same first row.
    start = 0x20000 - 16 + 0x6c
    rows = []
    for index in range(271):
        at = start + index * 70
        identifier = read(at, 2)
        if identifier == 0xffff:
            assert index == 270
            break
        path = bytes(read(at + 2 + i, 1) for i in range(64)).split(b'\0', 1)[0].decode('ascii').replace('\\', '/')
        level, pitch, kind = [read(at + 66 + i, 1) for i in range(3)]
        assert 0 <= identifier <= 500 and re.fullmatch(r'se/[A-Za-z0-9_]+\.wav', path), (index, identifier, path)
        assert level <= 127 and pitch <= 60 and kind in [0, 1], (index, identifier, path, level, pitch, kind)
        rows.append(dict(id=identifier, path=path, level=level, pitch=pitch, kind=kind))
    assert len(rows) == len({r['id'] for r in rows}) == 270
    assert next(r for r in rows if r['id'] == 60)['path'] == 'se/cgsys09.wav'
    ranges = []
    for at in sorted(reads):
        if ranges and at == ranges[-1][0] + ranges[-1][1]:
            ranges[-1][1] += 1
        else:
            ranges.append([at, 1])
    summary = dict(instructions=len(instructions), bytes=sum(len(b) for _, b in instructions),
                   prefix_sha256=sha256(b''.join(b for _, b in instructions)).hexdigest(),
                   operations=dict(operations), static_reads=[dict(address=hex(a), bytes=n,
                   sha256=sha256(IMAGE.locate(hex(a), n)[1]).hexdigest()) for a, n in ranges])
    return rows, summary


def verify():
    rows, summary = catalog()
    bundle_path = P / 'rea-evidence.json'
    bundle = json.loads(bundle_path.read_text())
    assert bundle['artifacts'][0]['digest']['sha256'] == '37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd'
    assert any(p['id'] == 'ghidra' and p['version'] == '12.1.4' for p in bundle['providers'])
    memory, procedures = [], {}
    admitted_reads = {('0x507dfa', 28046), ('0x569ac8', 320), ('0x56ab30', 4624),
                      ('0x56ab1c', 20), ('0x52d988', 32), ('0x52ef80', 8),
                      ('0x50ed83', 171), ('0x44fc61', 62)}
    admitted_functions = {
        '0x510000': ['500 < param_1', '(&DAT_00fac26c)[param_1 * 0x18] = 5;', 'DAT_00fba3e4 & 0x3f'],
        '0x510b50': ['piVar1 = &DAT_00fac26c;', '*piVar1 = *piVar1 + -1;', 'piVar1 = piVar1 + 0x18;'],
        '0x510be0': ['FUN_00510b50();'],
        '0x50f5a0': ['DAT_00fab264 = 0xffffd8f0;', '_DAT_00fab460 = 10000;', '5000 < iVar3'],
    }
    for record in bundle['records']:
        result = record['normalized_result']
        if record['operation'] == 'read_bytes' and isinstance(result, dict) and (result['address'], result['requested_bytes']) in admitted_reads:
            size = result['requested_bytes']
            offset, raw = IMAGE.locate(result['address'], size)
            assert result['complete'] and result['returned_bytes'] == size and bytes.fromhex(result['bytes_hex']) == raw
            memory.append(dict(address=result['address'], bytes=size, file_offset=offset, evidence_id=record['evidence_id']))
        if record['operation'] == 'analyze_function' and result['procedure']['address'] in admitted_functions:
            address = result['procedure']['address']
            assert all(marker in result['pseudocode'] for marker in admitted_functions[address]), address
            body = result['procedure']['body']
            assert body['available'] and not body['non_contiguous']
            start, end = int(body['ranges'][0]['start'], 16), int(body['ranges'][0]['end'], 16)
            raw = IMAGE.locate(hex(start), end - start + 1)[1]
            # Each dossier instruction is also rebound by its provider-returned address
            # and the retained LLVM byte listing, not inferred from decompiler syntax.
            llvm = {}
            for line in (ROOT / 'build/analysis/game-legacy-battle-self-flags-v1/image.asm').read_text().splitlines():
                match = re.match(r'\s*([0-9a-f]+):((?: [0-9a-f]{2})+)\s+', line)
                if match and start <= int(match[1], 16) <= end:
                    llvm[int(match[1], 16)] = bytes.fromhex(match[2])
            addresses = [int(line.split(':')[0], 16) for line in result['assembly']]
            assert set(addresses) == set(llvm) and sum(len(llvm[a]) for a in addresses) == len(raw)
            assert b''.join(llvm[a] for a in sorted(llvm)) == raw
            procedures[address] = dict(evidence_id=record['evidence_id'], bytes=len(raw), sha256=sha256(raw).hexdigest())
    assert {(r['address'], r['bytes']) for r in memory} == admitted_reads
    assert set(procedures) == set(admitted_functions)
    assert struct.unpack('<d', IMAGE.locate('0x52ef80', 8)[1])[0] == 5000
    assert struct.unpack('<4i', IMAGE.locate('0x569ac8', 16)[1]) == (1, 1, -1, 1)
    assert struct.unpack('<2i', IMAGE.locate('0x569ad8', 8)[1]) == (15, 15)
    calls = [IMAGE.call(a, b) for a, b in [('0x44fc72', '0x510be0'), ('0x510be0', '0x510b50')]]
    source = dict(stage=288, sample=BASE['identity'](IMAGE.path), evidence=BASE['identity'](bundle_path),
                  rea='6.7.0', provider='Ghidra 12.1.4', memory=memory, procedures=procedures,
                  calls=calls, constructor=summary, catalog=rows,
                  source_default=dict(sound=True, pan=True, effect_volume=15),
                  facts=['270 explicit IDs1..468 with holes; each catalog pitch is0.',
                         '510000 is a one-shot owner with64 unprotected ring slots and5-update per-ID cooldown.',
                         'pan index is clamp(trunc(x/5),0,127),or64 when disabled;y is unused.',
                         'Per-channel DirectSound attenuation uses the5000 logarithmic pan table;native values past5000 become10000.'],
                  inferred=['The owned logical frame updates cooldown once before its retained body/input cue sequence.'],
                  unverified=['Whole native application scheduling,cross-owner protected/looping ambient voices,physical output and current release compatibility.'])
    (A / 'source-check.json').write_text(json.dumps(source, indent=2) + '\n')
    (P / 'catalog-recovered.json').write_text(json.dumps(dict(rows=rows, constructor=summary), indent=2) + '\n')
    print(json.dumps(dict(rows=len(rows), constructor_instructions=summary['instructions'], constructor_bytes=summary['bytes'],
                          levels=sorted({r['level'] for r in rows}), pitches=sorted({r['pitch'] for r in rows}))))


if __name__ == '__main__':
    verify()
