#!/usr/bin/env python3
"""Read PE metadata and decoded static operands. Never load or execute targets."""
from pathlib import Path
import hashlib, json, re, struct, subprocess

ROOT = Path('/tmp/moli-analysis/crossgate/app')
OUT = Path(__file__).resolve().parent
NAMES = ('Patcher_PUK3.exe', 'cg_se_3000.exe', 'cg_se_6000.exe', 'cg_item_6000.exe')
OBJDUMP = '/opt/homebrew/opt/binutils/bin/objdump'

class PE:
    def __init__(self, path):
        self.path, self.data = path, path.read_bytes()
        b = self.data
        pe = struct.unpack_from('<I', b, 0x3c)[0]
        assert b[pe:pe+4] == b'PE\0\0'
        count = struct.unpack_from('<H', b, pe+6)[0]
        size = struct.unpack_from('<H', b, pe+20)[0]
        optional = pe+24
        assert struct.unpack_from('<H', b, optional)[0] == 0x10b
        self.base = struct.unpack_from('<I', b, optional+28)[0]
        self.entry = self.base+struct.unpack_from('<I', b, optional+16)[0]
        self.sections = []
        for i in range(count):
            o = optional+size+40*i
            vs, rva, rs, ro = struct.unpack_from('<IIII', b, o+8)
            self.sections.append({'name': b[o:o+8].split(b'\0')[0].decode(),
                                  'virtual_size': vs, 'rva': rva,
                                  'raw_size': rs, 'file_offset': ro,
                                  'characteristics': struct.unpack_from('<I', b, o+36)[0]})
        self.imports = []
        rva, import_bytes = struct.unpack_from('<II', b, optional+96+8)
        off = self.file(self.base+rva)
        if off is None: return
        for i in range(min(import_bytes//20, 256)):
            pos = off+20*i
            original, time, forward, name, first = struct.unpack_from('<IIIII', b, pos)
            if (original, time, forward, name, first) == (0, 0, 0, 0, 0): break
            dll = self.string(name)
            table = self.file(self.base+(original or first))
            for j in range(65536):
                if table is None or table+4*j+4>len(b): raise ValueError('import table out of bounds')
                value = struct.unpack_from('<I', b, table+4*j)[0]
                if not value: break
                symbol = f'ordinal:{value & 0xffff}' if value & 0x80000000 else self.string(value+2)
                iat = self.base+first+4*j
                self.imports.append({'dll': dll, 'symbol': symbol, 'descriptor_offset': pos,
                                     'lookup_offset': table+4*j, 'iat_va': iat,
                                     'iat_file_offset': self.file(iat)})

    def file(self, va):
        rva = va-self.base
        for s in self.sections:
            delta = rva-s['rva']
            if 0 <= delta < s['raw_size']:
                result = s['file_offset']+delta
                return result if result < len(self.data) else None
        return None

    def string(self, rva):
        start = self.file(self.base+rva)
        if start is None: raise ValueError('string unmapped')
        end = self.data.find(b'\0', start, start+4096)
        if end < 0: raise ValueError('unterminated string')
        return self.data[start:end].decode('ascii')

def inspect(name):
    pe = PE(ROOT/name)
    interest = [i for i in pe.imports if i['dll'].upper() in ('WININET.DLL', 'WS2_32.DLL', 'WSOCK32.DLL') or i['symbol'] in ('ShellExecuteA', 'ShellExecuteExA', 'CreateProcessA', 'CreateThread', 'LoadLibraryA', 'LoadLibraryW', 'GetProcAddress')]
    by_iat = {i['iat_va']: i for i in interest}
    text = subprocess.run([OBJDUMP, '-d', '-M', 'intel', str(pe.path)], check=True, capture_output=True, text=True).stdout
    instructions = []
    for line in text.splitlines():
        match = re.match(r'\s*([0-9a-f]+):\s*((?:[0-9a-f]{2} )+)\s*(\S+)\s*(.*)', line)
        if not match: continue
        va = int(match[1], 16)
        raw = bytes.fromhex(match[2])
        mnemonic, operands = match[3], match[4]
        instructions.append((va, raw, mnemonic, operands))
    xrefs = []
    edges = []
    for va, raw, mnemonic, operands in instructions:
        addresses = [int(a, 16) for a in re.findall(r'0x[0-9a-f]+', operands)]
        for address in addresses:
            if address in by_iat:
                i = by_iat[address]
                # This records decoded operands, not dynamic invocation or reachability.
                xrefs.append({'instruction_va': va, 'instruction_file_offset': pe.file(va),
                              'instruction_bytes': raw.hex(), 'mnemonic': mnemonic,
                              'import_dll': i['dll'], 'import_symbol': i['symbol'],
                              'iat_va': address,
                              'kind': 'indirect_call' if mnemonic=='call' else 'operand_reference'})
        if mnemonic in ('call', 'jmp'):
            direct = re.match(r'^(?:0x)?([0-9a-f]+)(?:\s|$)', operands)
            if direct:
                edges.append({'from_va': va, 'file_offset': pe.file(va),
                              'to_va': int(direct[1], 16), 'kind': mnemonic,
                              'bytes': raw.hex()})
    data = {'sample': name, 'sha256': hashlib.sha256(pe.data).hexdigest(),
            'bytes': len(pe.data), 'image_base': pe.base, 'entry_va': pe.entry,
            'entry_file_offset': pe.file(pe.entry), 'sections': pe.sections,
            'imports': pe.imports, 'interesting_imports': interest,
            'decoded_import_operand_references': xrefs,
            'limitations': ['PE imports are declarations, not proof of runtime use.',
                           'Decoded operand references are not proof of entry reachability.',
                           'Linear disassembly can misdecode data or overlapping instructions.',
                           'Ordinal-only imports are deliberately not guessed by name.']}
    (OUT/(name+'.network-imports.json')).write_text(json.dumps(data, indent=2)+'\n')
    # Keep a bounded entry summary. Full linear decoding is not a validated CFG,
    # especially for packed/overlapping game startup code.
    selected = [edge for edge in edges if pe.entry <= edge['from_va'] < pe.entry+128]
    if name == 'Patcher_PUK3.exe':
        selected += [edge for edge in edges if edge['from_va'] in (0x41523e,0x409b9e)]
    edge_summary = {'total_linear_direct_edges': len(edges), 'selected_edges': selected,
                    'selection': 'entry VA through entry+127, plus two explicit Patcher anchors',
                    'not_a_complete_or_validated_control_flow_graph': True}
    (OUT/(name+'.direct-control-edges-summary.json')).write_text(json.dumps(edge_summary, indent=2)+'\n')
    print(name, 'imports', len(pe.imports), 'interesting', len(interest), 'operand refs', len(xrefs))

if __name__ == '__main__':
    for name in NAMES: inspect(name)
