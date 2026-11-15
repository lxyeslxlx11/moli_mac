"""Decode the selected source-bound DIALOGEX as metadata. Never executes the PE or exports image payloads."""
from pathlib import Path
import hashlib
import json
import struct
import sys

SOURCE_SHA = '9389add9c04cbc6bd313a34098ed94aef11a866ba721c6ccf7f984973efa0f7d'
DIALOG_SHA = '83893b8f5efcc0bcaeaf1755bce1bfcbdb1a12c8803cd7714a676fac8bf68749'


def inspect(path):
    raw = path.read_bytes()
    if len(raw) != 61440 or hashlib.sha256(raw).hexdigest() != SOURCE_SHA:
        raise ValueError('Expected the explicitly selected Config.exe identity')
    data = raw[25728:25728 + 792]
    if hashlib.sha256(data).hexdigest() != DIALOG_SHA:
        raise ValueError('Selected REA resource range does not match')
    at = 0

    def read(fmt):
        nonlocal at
        size = struct.calcsize(fmt)
        if at + size > len(data):
            raise ValueError('Resource read exceeds its bound')
        value = struct.unpack_from(fmt, data, at)
        at += size
        return value

    def string_or_ordinal():
        start = at
        first = read('<H')[0]
        if first == 0:
            return dict(kind='empty')
        if first == 65535:
            return dict(kind='ordinal', value=read('<H')[0])
        value = first
        while value:
            value = read('<H')[0]
        return dict(kind='text', value=data[start:at - 2].decode('utf-16le'))

    ver, sig, help_id, exstyle, style, count, x, y, cx, cy = read('<HHIIIHhhhh')
    if (ver, sig) != (1, 65535) or count != 13:
        raise ValueError('Unexpected selected extended dialog header')
    menu, window_class, title = string_or_ordinal(), string_or_ordinal(), string_or_ordinal()
    font = None
    if style & 0x40:
        point, weight, italic, charset = read('<HHBB')
        font = dict(point=point, weight=weight, italic=italic, charset=charset, typeface=string_or_ordinal())
    controls = []
    for ordinal in range(count):
        at = (at + 3) & ~3
        start = at
        control_help, control_exstyle, control_style, x, y, cx, cy, control_id = read('<IIIhhhhI')
        cls, label = string_or_ordinal(), string_or_ordinal()
        extra = read('<H')[0]
        if at + extra > len(data):
            raise ValueError('Creation data exceeds selected resource')
        at += extra
        controls.append(dict(ordinal=ordinal, id=control_id, style=hex(control_style), windowClass=cls,
                             label=label, resource_offset=start, file_offset=25728 + start, creation_bytes=extra))
    if at != len(data):
        raise ValueError('Selected resource was not consumed exactly')
    return dict(schema='moli.config-dialog-source.v1', source_sha256=SOURCE_SHA,
                resource=dict(type=5, name=102, language=2052, offset=25728, bytes=792, sha256=DIALOG_SHA),
                count=count, consumed_bytes=at, title=title, font=font, controls=controls,
                method='REA resource inventory + bounded Microsoft DIALOGEX/ITEMTEMPLATEEX interpretation',
                references=['https://learn.microsoft.com/en-us/windows/win32/dlgbox/dlgtemplateex',
                            'https://learn.microsoft.com/en-us/windows/win32/dlgbox/dlgitemtemplateex'],
                native_render_or_game_effects_verified=False)


if __name__ == '__main__':
    source = Path(sys.argv[1]).resolve()
    target = Path(__file__).with_name('dialog-structure.json')
    target.write_text(json.dumps(inspect(source), ensure_ascii=False, indent=2) + '\n')
    print(json.dumps(dict(output=str(target), controls=13, consumed_bytes=792)))
