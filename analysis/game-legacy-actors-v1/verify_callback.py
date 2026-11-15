#!/usr/bin/env python3
"""Verify a bounded original GNU disassembly and derive non-call CFG coverage. No target execution."""
from pathlib import Path
import hashlib,re,struct
ROOT=Path(__file__).resolve().parents[2];PRIVATE=ROOT/'build/analysis/game-legacy-actors-v1'
def verify(raw,locate):
    path=PRIVATE/'callback-objdump.txt';text=path.read_text();rows=[]
    for line in text.splitlines():
        match=re.match(r'^\s*([0-9a-f]+):\s+((?:[0-9a-f]{2}\s+)+)(.*)$',line)
        if not match:continue
        address=int(match[1],16);data=bytes.fromhex(match[2]);instruction=match[3].strip()
        if not instruction:
            assert rows and rows[-1]['address']+len(rows[-1]['bytes'])==address;rows[-1]['bytes']+=data
        else:rows.append(dict(address=address,bytes=data,instruction=instruction))
    assert rows[0]['address']==0x43ba10 and rows[-1]['address']+len(rows[-1]['bytes'])==0x43c000
    for i,row in enumerate(rows):
        offset=locate(hex(row['address']),len(row['bytes']));assert raw[offset:offset+len(row['bytes'])]==row['bytes']
        if i:assert rows[i-1]['address']+len(rows[i-1]['bytes'])==row['address']
    by_address={r['address']:r for r in rows};pending=[0x43ba10];seen=set();unresolved=[];returns=[];calls=set()
    while pending:
        address=pending.pop()
        if address in seen:continue
        row=by_address[address];seen.add(address);parts=row['instruction'].split(None,1);op=parts[0];operand=parts[1] if len(parts)>1 else ''
        if op.startswith('ret'):returns.append(hex(address));continue
        next_=address+len(row['bytes'])
        if op.startswith('j'):
            target=re.match(r'0x([0-9a-f]+)',operand)
            if target and int(target[1],16) in by_address:pending.append(int(target[1],16))
            else:unresolved.append(dict(address=hex(address),operand=operand))
            if op=='jmp':continue
        if op=='call':calls.add(operand)
        if next_ in by_address:pending.append(next_)
        else:unresolved.append(dict(address=hex(address),fallthrough=hex(next_)))
    assert not unresolved
    return dict(path=str(path.relative_to(ROOT)),bytes=path.stat().st_size,sha256=hashlib.sha256(path.read_bytes()).hexdigest(),selected_range=['0x43ba10','0x43c000'],range_end_exclusive=True,
      instructions_checked=len(rows),bytes_checked=sum(len(r['bytes']) for r in rows),reachable_instructions=len(seen),derived_noncall_CFG_complete=True,returns=sorted(returns),calls=sorted(calls),
      provider_function_body='unavailable; this is a byte-verified bounded GNU range and analyst CFG, not a Ghidra function dossier',target_execution=False)
