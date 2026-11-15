#!/usr/bin/env python3
"""Read-only sample metadata and selected ASCII evidence; never execute a target."""
from pathlib import Path
import hashlib, json, re, struct, subprocess

ROOT = Path('/tmp/moli-analysis/crossgate/app')
OUT = Path(__file__).resolve().parent
OBJDUMP = '/opt/homebrew/opt/binutils/bin/objdump'
PATTERN = re.compile(r'https?://|ftp://|\.exe|\.dll|\.xml|\.ini|\.cgp|Graphic|Anime|palet|Direct|ddraw|dinput|dsound|winmm|Internet|connect|recv|send|login|auth|ticket|patch|update|password|account|socket', re.I)
modules=[]
for p in sorted(ROOT.iterdir()):
    if p.suffix.lower() not in ('.exe', '.dll'): continue
    b=p.read_bytes()
    pe=struct.unpack_from('<I',b,0x3c)[0]
    machine,sections,timestamp=struct.unpack_from('<HHI',b,pe+4)
    op=pe+24
    row={'file':p.name,'bytes':len(b),'sha256':hashlib.sha256(b).hexdigest(),'pe_offset':pe,'machine':hex(machine),'sections':sections,'coff_timestamp_raw':timestamp,'optional_magic':hex(struct.unpack_from('<H',b,op)[0]),'entry_rva':hex(struct.unpack_from('<I',b,op+16)[0]),'image_base':hex(struct.unpack_from('<I',b,op+28)[0]),'security_directory':list(struct.unpack_from('<II',b,op+96+4*8))}
    modules.append(row)
    dump=subprocess.run([OBJDUMP,'-p',str(p)],capture_output=True,text=True,check=True).stdout
    (OUT/(p.name+'.objdump.txt')).write_text(dump)
    matches=[{'file_offset':hex(m.start()),'text':m.group().decode('ascii')} for m in re.finditer(rb'[\x20-\x7e]{5,}',b) if PATTERN.search(m.group().decode('ascii'))]
    (OUT/(p.name+'.strings.json')).write_text(json.dumps(matches,indent=2))
    print(p.name,hex(machine),len(b),len(matches),'selected ASCII strings')
(OUT/'modules.json').write_text(json.dumps(modules,indent=2))
