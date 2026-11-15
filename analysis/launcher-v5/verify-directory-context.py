#!/usr/bin/env python3
"""Read-only fixed-sample directory-flow verifier; never execute target PE."""
import argparse
import hashlib
import importlib.util
import json
import re
import xml.etree.ElementTree as ET
from pathlib import Path
BASE = Path(__file__).resolve().parent
spec = importlib.util.spec_from_file_location('v4_directory_engine', BASE.parent/'launcher-v4/verify-launch-context.py')
ENGINE = importlib.util.module_from_spec(spec)
spec.loader.exec_module(ENGINE)
def verify(pe_data, xml_data, manifest):
    result = ENGINE.verify(pe_data, manifest)
    pe = ENGINE.PRIOR.PE32(pe_data)
    for row in manifest['strings']:
        raw = row['ascii'].encode('ascii') + b'\0'
        if pe.at(int(row['va'],16),len(raw)) != raw:
            raise ValueError('Literal mismatch')
    if len(xml_data) != manifest['catalog']['bytes'] or hashlib.sha256(xml_data).hexdigest() != manifest['catalog']['sha256']:
        raise ValueError('Catalog identity mismatch')
    # Parse only after exact fixed-file identity. No external entity/network handlers.
    text = xml_data.decode('gb18030')
    text, repaired = re.subn(r'&(?!#?[a-zA-Z0-9]+;)', '&amp;', text)
    if repaired != 5: raise ValueError('Unexpected catalog syntax')
    selected = [x for x in ET.fromstring(text).iter('Game') if x.attrib.get('Code') == '11']
    if len(selected) != manifest['catalog']['code11_records']: raise ValueError('Code11 count mismatch')
    for row in selected:
        for key in ('RegKey','RegValue'):
            if row.findtext(key) != manifest['catalog'][key]: raise ValueError('Registry metadata mismatch')
        if row.find('OldRegKey') is not None or row.find('OldRegValue') is not None:
            raise ValueError('Unexpected old-key source')
    result.update(strings_verified=len(manifest['strings']),code11_records_verified=len(selected),catalog_sha256=manifest['catalog']['sha256'],runtime_registry_or_profile_read=False)
    return result

def main():
    p=argparse.ArgumentParser(description=__doc__)
    p.add_argument('--pe',type=Path,required=True)
    p.add_argument('--catalog',type=Path,required=True)
    args=p.parse_args()
    if args.pe.stat().st_size > ENGINE.PRIOR.MAX_BYTES or args.catalog.stat().st_size > 65536:
        raise ValueError('Input byte budget exceeded')
    result=verify(args.pe.read_bytes(),args.catalog.read_bytes(),json.loads((BASE/'directory-context.json').read_text()))
    print(json.dumps(result,ensure_ascii=False,indent=2))
if __name__=='__main__': main()
