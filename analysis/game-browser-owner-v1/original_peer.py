#!/usr/bin/env python3
"""Independent original loopback peer for persistent client/page, including source scene reload. No external service."""
from pathlib import Path
import importlib.util
import json
import socket
import struct
import sys
from time import monotonic

HERE = Path(__file__).resolve().parent
spec = importlib.util.spec_from_file_location('wire', HERE / 'wire_reference.py')
wire = importlib.util.module_from_spec(spec)
spec.loader.exec_module(wire)
v = json.loads((HERE / 'original-vectors.json').read_text())
old = json.loads((HERE / 'post-login-vectors.json').read_text())
scene = json.loads((HERE / 'scene-vectors.json').read_text())
key = bytes.fromhex(old['bootstrap']['keyHex'])
mode = sys.argv[1] if len(sys.argv) > 1 else 'success'
flow = v['flows'][int(sys.argv[2]) if len(sys.argv) > 2 else 0]
scene_music = len(sys.argv) > 3 and sys.argv[3] == '1'
reentry = len(sys.argv) > 4 and sys.argv[4] == '1'
if reentry:
    assert mode in ('battle-status-physical-self-control-charge', 'battle-status-physical-self-control-charged-reflect', 'battle-status-physical-self-control-scatter-stop')
    reentry_vectors = json.loads((HERE / 'reentry-vectors.json').read_text())
music_phases = mode == 'music-phases'
manual_return = mode in ('manual-return', 'manual-return-battle')
server_return = mode.startswith('server-return') or music_phases or manual_return
battle_city = mode in ('city-return-battle-transfer', 'city-return-battle-early', 'city-return-battle-late')
city_return = battle_city or mode in ('city-return-scene', 'city-return-boundary')
rid0_split = b'RID|0|2|%X|0|AfterSplit|186F0|186DC|1|29|64|8|A|0|SplitPet|186DC|2|0|64|6|A|2|CFP|0|2|'
rid0_alias_core = b'M|SKL|1C21|3|0|0|A|201|0|1|A|201|7|1|1|B|11|1|2|C|11|3|1|2|802011|2|186DC|186DC|186DC|FF|'
rid0_abort = b'RID|0|1|6|0|AfterAbort|186F0|186DC|1|29|64|8|A|0|SplitPet|186DC|2|0|64|6|A|2|CFP|1|2|'
self_metadata_modes = ('battle-status-physical-self-metadata-messages', 'battle-status-physical-self-metadata-RID', 'battle-status-physical-self-metadata-cleanup')
common_self_guard_modes = ('battle-status-physical-common-self-guard', 'battle-status-physical-common-self-guard-all', 'battle-status-physical-common-self-guard-charge')
self_flags_modes = ('battle-status-physical-self-flags-impact', 'battle-status-physical-self-flags-partial', 'battle-status-physical-self-flags-opaque')
modifier_modes = ('battle-status-modifier-99', 'battle-status-modifier-104', 'battle-status-modifier-existing')
upper_modes = tuple('battle-status-upper-'+str(k)for k in [107,108,109,112,114,117])
impact_modes = tuple('battle-status-impact-'+str(k)for k in [4,97,106,111,116]) + ('battle-status-impact-106-RID', 'battle-status-impact-106-RID-wait')
repeated_guard_modes = {
    'battle-status-impact-106-RID': ((), b'M|SKL|2968|3|2|0|A|802041|9|186DC|186DD|186DE|FF|CFP|0|2|'),
    'battle-status-impact-106-RID-wait': ((), b'M|SKL|2968|3|2|0|A|802001|9|186DC|186DD|186DE|FF|CFP|0|2|'),
    **{'battle-status-impact-'+str(k): ((),f'M|SKL|{k*100:X}|3|2|0|A|1|C|FF|CFP|0|2|'.encode())for k in [4,97,106,111,116]},
    'battle-status-upper-107': ((), b'M|SKL|29CC|3|0|0|A|80000|FF|CFP|0|2|'),
    'battle-status-upper-108': ((), b'M|SKL|2A30|3|0|0|A|7|80000|FF|CFP|0|2|'),
    'battle-status-upper-109': ((), b'M|SKL|2A94|3|0|0|A|80000|FF|CFP|0|2|'),
    'battle-status-upper-112': ((), b'M|SKL|2BC0|3|0|0|A|80000|FF|CFP|0|2|'),
    'battle-status-upper-114': ((), b'M|SKL|2C88|3|0|0|A|80000|FF|CFP|0|2|'),
    'battle-status-upper-117': ((), b'M|SKL|2DB4|3|0|0|A|80000|FF|CFP|0|2|'),
    'battle-status-modifier-99': (
        (), b'M|SKL|26AC|3|0|0|A|80000|FF|CFP|0|2|'),
    'battle-status-modifier-104': (
        (), b'M|SKL|28A0|3|0|0|A|80000|FF|CFP|0|2|'),
    'battle-status-modifier-existing': (
        (), b'M|SKL|28A0|3|0|0|A|80000|FF|CFP|0|2|'),
    'battle-status-physical-self-flags-impact': (
        (), b'M|SKL|0|3|0|0|0|805|C|FF|CFP|0|2|'),
    'battle-status-physical-self-flags-partial': (
        (), b'M|SKL|0|3|0|0|0|801|C|FF|CFP|0|2|'),
    'battle-status-physical-self-flags-opaque': (
        (), b'M|SKL|0|3|0|0|0|E4072081|C|FF|CFP|0|2|'),
    'battle-status-physical-common-self-guard': (
        (1,), b'M|SKL|0|3|0|0|0|201|C|1|FF|CFP|0|2|'),
    'battle-status-physical-common-self-guard-all': (
        (), b'M|SKL|0|3|0|0|0|201|C|0|FF|CFP|0|2|'),
    'battle-status-physical-common-self-guard-charge': (
        (1,), b'M|SKL|0|3|0|0|0|1201|C|1|FF|CFP|0|2|'),
    'battle-status-physical-self-metadata-messages': (
        (), b'M|SKL|0|3|0|0|0|3602001|C|FF|CFP|0|2|'),
    'battle-status-physical-self-metadata-RID': (
        (), b'M|SKL|0|3|0|0|0|802001|C|186C8|186DD|186D2|FF|CFP|0|2|'),
    'battle-status-physical-self-metadata-cleanup': (
        (), b'M|SKL|0|3|0|0|0|100401|C|FF|CFP|0|2|'),
    'battle-status-physical-skl72-repeat-protected': (
        (1,), b'M|SKL|1C21|3|0|0|A|201|C|1|A|201|7|1|FF|CFP|0|2|'),
    'battle-status-physical-skl72-repeat-two-guards': (
        (1, 2), b'M|SKL|1C21|3|0|0|A|201|C|1|A|201|7|2|FF|CFP|0|2|'),
    'battle-status-physical-skl72-repeat-following': (
        (1, 11), b'M|SKL|1C21|3|0|0|A|201|0|1|A|201|7|1|1|B|11|1|FF|CFP|0|2|'),
    'battle-status-physical-skl72-following-series': (
        (1, 11), b'M|SKL|1C21|3|0|0|A|201|0|1|A|201|7|1|1|B|11|1|1|A|11|2|FF|CFP|0|2|'),
    'battle-status-physical-skl72-following-shared-target': (
        (1, 2, 11), b'M|SKL|1C21|3|0|0|A|201|0|1|A|201|7|2|1|B|11|1|2|B|11|2|FF|CFP|0|2|'),
    'battle-status-physical-skl72-missing-lookahead': (
        (1, 11), b'M|PLV|B|SKL|1C21|3|0|0|A|201|0|1|A|201|7|1|1|B|11|1|1|A|11|2|FF|CFP|0|2|'),
    'battle-status-physical-skl72-missing-later-lookahead': (
        (1, 2, 11, 12), b'M|PLV|C|SKL|1C21|3|0|0|A|201|0|1|A|201|7|1|1|B|211|0|2|2|C|11|2|FF|CFP|0|2|'),
    'battle-status-physical-skl72-idle-attacker': (
        (1, 2, 11, 12), b'M|SKL|1C21|3|0|0|A|201|0|1|A|201|7|1|1|B|11|1|2|C|11|3|1|A|11|2|FF|CFP|0|2|'),
    'battle-status-physical-skl72-idle-guard-wait': (
        (1, 2, 11), b'M|SKL|1C21|3|0|0|A|201|0|1|A|201|7|1|1|B|11|1|2|1|11|3|1|A|11|2|FF|CFP|0|2|'),
    'battle-status-physical-skl72-late-recipient': (
        (1, 2, 11, 12), b'M|SKL|1C21|3|0|0|A|201|0|1|A|201|7|1|1|B|11|1|2|C|11|3|1|2|11|2|FF|CFP|0|2|'),
    'battle-status-physical-skl72-late-recipient-two-sources': (
        (1, 2, 3, 11, 12), b'M|SKL|1C21|3|0|0|A|201|0|1|A|201|7|3|1|B|11|1|2|C|11|3|1|2|11|2|3|2|11|4|FF|CFP|0|2|'),
    'battle-status-physical-skl72-late-reflect-rid': (
        (1, 2, 11, 12), b'M|SKL|1C21|3|0|0|A|201|0|1|A|201|7|1|1|B|11|1|2|C|11|3|1|2|802011|2|186DC|186DC|186DC|FF|CFP|0|2|'),
    'battle-status-physical-skl72-late-heal-rid': (
        (1, 2, 11, 12), b'M|SKL|1C21|3|0|0|A|201|0|1|A|201|7|1|1|B|11|1|2|C|11|3|1|2|806011|2|186DC|186DC|186DC|1|B|11|4|FF|CFP|0|2|'),
    'battle-status-physical-skl72-late-skip': (
        (1, 2, 11, 12), b'M|SKL|1C21|3|0|0|A|201|0|1|A|201|7|1|1|B|11|1|2|C|11|3|1|2|E011|2|FF|CFP|0|2|'),
    'battle-status-physical-skl72-rid0-late': (
        (1, 2, 11, 12), b'M|SKL|1C21|3|0|0|A|201|0|1|A|201|7|1|1|B|11|1|2|C|11|3|1|2|11|2|FF|' + (rid0_split % 5)),
    'battle-status-physical-skl72-rid0-inline': (
        (1, 2, 11, 12), b'M|SKL|1C21|3|0|0|A|201|0|1|A|201|7|1|1|B|11|1|2|C|11|3|1|2|806011|2|186DC|186DC|186DC|1|B|11|4|FF|' + (rid0_split % 5)),
    'battle-status-physical-skl72-rid0-alias': (
        (1, 2, 11, 12), rid0_alias_core + (rid0_split % 2)),
    'battle-status-physical-skl72-rid0-alias-flight': (
        (1, 2, 11, 12), rid0_alias_core + (rid0_split % 2).replace(b'SplitPet|186DC|', b'SplitPet|186F1|')),
    'battle-status-physical-skl72-rid0-interrupt': (
        (1,), b'M|SKL|1C21|3|0|1|A|10|3|0|C|0|F|FF|' + rid0_abort),
    'battle-status-physical-skl72-rid0-interrupt-two': (
        (1,), b'M|SKL|1C21|3|0|1|A|10|3|C|0|0|F|FF|' + rid0_abort + b'CFP|1|3|'),
    'battle-status-casting-skl19-rid0': (
        (2,), b'M|SKL|76C|3|0|2|A|1|C|FF|RID|0|2|5|0|AfterCast|186F0|186DC|1|29|64|8|A|0|CastMount|186F1|2|0|64|6|A|2|CFP|2|2|'),
    'battle-status-casting-skl19-reflected-rid0': (
        (2,), b'M|SKL|76C|3|0|2|A|810001|C|186DC|0|0|FF|RID|0|2|5|0|AfterCast|186F0|186DC|1|29|64|8|A|0|CastMount|186F1|2|0|64|6|A|2|CFP|2|2|'),
    'battle-status-casting-skl19-lethal-rid0': (
        (), b'M|SKL|76C|3|0|0|A|810061|46|186DC|0|0|FF|RID|0|0|5|0|AfterCast|186F0|186DC|1|29|64|8|A|0|CastMount|186F1|2|0|64|6|A|2|CFP|0|2|'),
    'battle-status-casting-skl19-caster-paired-rid0': (
        (2,), b'M|SKL|76C|3|0|2|A|10001|C|FF|RID|0|A|2|0|AfterCast|186F0|186DC|1|29|64|8|A|0|CastMount|186F1|2|0|64|6|A|2|CFP|2|2|'),
    'battle-status-casting-skl19-queued-update': (
        (2,), b'M|SKL|76C|3|0|2|A|10001|C|FF|RID|0|2|5|0|AfterCast|186F0|186DC|1|29|64|8|A|0|CastMount|186F1|2|0|64|6|A|2|CFP|2|2|'),
    'battle-status-casting-skl19-queued-ack': (
        (2,), b'M|SKL|76C|3|0|2|A|10001|C|FF|RID|0|2|5|0|AfterCast|186F0|186DC|1|29|64|8|A|0|CastMount|186F1|2|0|64|6|A|2|CFP|2|2|'),
    'battle-status-casting-pursuit-repeated': (
        (), b'M|SKL|9CA2|3|0|A|0|A|0|FF|CFP|0|2|'),
    'battle-status-casting-pursuit-notice-repeated': (
        (), b'M|SKL|9CA2|3|0|A|10000000|A|10000000|FF|CFP|0|2|'),
    'battle-status-physical-self-control-charge': (
        (), b'M|SKL|258|3|0|0|0|11|C|FF|CFP|0|2|'),
    'battle-status-physical-self-control-charged-reflect': (
        (), b'M|SKL|258|3|0|0|0|2011|C|FF|CFP|0|2|'),
    'battle-status-physical-self-control-scatter-stop': (
        (), b'M|SKL|258|3|0|0|0|2041|C|FF|CFP|0|2|'),
    'battle-status-physical-self-reflect-following': (
        (), b'M|SKL|258|3|0|0|A|1|6|0|0|2001|C|FF|CFP|0|2|'),
    'battle-status-physical-self-heal-following': (
        (), b'M|SKL|258|3|0|0|A|1|6|0|0|4001|C|FF|CFP|0|2|'),
    'battle-status-physical-self-skip-priority': (
        (), b'M|SKL|20D0|3|0|0|0|E001|C|FF|CFP|0|2|'),
    'battle-status-physical-class5-self': (
        (), b'M|SKL|1F4|3|0|0|0|5|C|FF|CFP|0|2|'),
    'battle-status-physical-class6-self-following': (
        (), b'M|SKL|258|3|0|0|A|1|6|0|0|1|C|FF|CFP|0|2|'),
    'battle-status-physical-class84-self-following': (
        (), b'M|SKL|20D0|3|0|0|A|1|6|0|0|1|C|FF|CFP|0|2|'),
    'battle-status-physical-basic-self': (
        (), b'M|SKL|0|3|0|0|0|1|C|FF|CFP|0|2|'),
    'battle-status-physical-basic-self-following': (
        (), b'M|SKL|0|3|0|0|A|1|6|0|0|1|C|FF|CFP|0|2|'),
    'battle-status-casting-weather-repeat': (
        (), b'M|SKL|9D06|3|0|A|0|A|80000|FF|CFP|0|2|'),
    'battle-status-casting-weather-stacked': (
        (), b'M|SKL|9D06|3|0|A|80000|A|80000|FF|CFP|0|2|'),
    'battle-status-casting-pursuit-linked': (
        (), b'M|SKL|9CA2|3|0|A|800000|A|0|A|0|A|0|FF|CFP|0|2|'),
}
battle_result = mode in repeated_guard_modes or mode in ('battle-summon', 'battle-status-ko', 'battle-status-revive', 'battle-status-grow', 'battle-status-retire',
                         'battle-status-swap', 'battle-status-impact', 'battle-status-recovery',
                         'battle-status-missing-target', 'battle-status-missing-swap',
                         'battle-status-missing-status', 'battle-status-missing-magic',
                         'battle-status-missing-numeric', 'battle-status-missing-82',
                         'battle-status-missing-physical-attacker', 'battle-status-missing-physical-first',
                         'battle-status-missing-physical-late', 'battle-status-missing-physical-chain',
                         'battle-status-missing-physical-projectile',
                         'battle-status-missing-physical-registry', 'battle-status-missing-physical-departed',
                         'battle-status-missing-physical-nested', 'battle-status-physical-self-only',
                         'battle-status-physical-nested-guard-departed', 'battle-status-physical-self-guard',
                         'battle-status-physical-self-guard-flight', 'battle-status-physical-self-guard-flight-target',
                         'battle-status-physical-self-alias-flight', 'battle-status-physical-self-alias-only',
                         'battle-status-physical-skl113-separate', 'battle-status-physical-skl113-grouped',
                         'battle-status-physical-skl113-aligned',
                         'battle-status-physical-skl113-outer-guard', 'battle-status-physical-skl72-shared-guard',
                         'battle-status-assist-ff-impact', 'battle-status-assist-ff-recovery')
sustained = mode == 'browser-stream'
assert city_return or battle_result or sustained or mode in ['success', 'duplicate', 'retry', 'denied', 'abort', 'widget-close', 'observer-close', 'scene-switch', 'browser', 'cancel', 'server-return', 'server-return-battle', 'music-phases', 'manual-return', 'manual-return-battle']


def encoded(rows):
    return b''.join(wire.frame(wire.payload_encode(bytes.fromhex(x), key)) for x in rows)


def initial_scene():
    rows = list(scene['protocol']['beforePlainHex'])
    if scene_music:
        index, = (i for i, row in enumerate(rows) if bytes.fromhex(row).startswith(b'TfD '))
        fields = bytes.fromhex(rows[index]).split(b' ')
        assert len(fields) == 14 and fields[10] == b'0'
        fields[10] = b'3e'  # 200 in the independent wire alphabet
        rows[index] = b' '.join(fields).hex()
    return encoded(rows)


def city_material():
    rows = {bytes.fromhex(row).split(b' ', 1)[0]: bytes.fromhex(row).split(b' ')
            for row in scene['protocol']['beforePlainHex']}
    transfer, patch = rows[b'TfD'], rows[b'=mJ']
    transfer[11] = transfer[2]  # Same cut selector with a different map identity.
    transfer[2] = patch[2] = wire.integer(24)
    return [b' '.join(row).hex() for row in (transfer, patch)]


def city_battle_entry():
    chars = b'C|0|0|Original|186AA|0|1|1E|1E|A|A|0|0|0|A|Other|186AA|0|1|1E|1E|A|A|0|0|0|'
    packets = [b'>HY 1 g8 ', b'?+e P|0|10|0|0|0|0| ', b'?+e ' + chars + b' ', b'?+e A|0|0| ']
    return encoded([packet.hex() for packet in packets])


def summon_battle_entry():
    chars = b'C|0|0|Original|186DC|0|1|46|64|A|A|0|0|0|A|OldEnemy|186DC|0|1|1E|46|2|7|0|0|0|'
    motion = (b'M|SKL|2455|3|F|0|5|NewPet|186DD|FFFFFFEF|3D|5A|7|C|5000001|'
              b'A|NewEnemy|186DD|FFFFFFEF|3D|5A|7|C|5000001|FF|CFP|A|2|')
    packets = [b'>HY 1 g8 ', b'?+e P|0|10|0|0|0|0| ', b'?+e ' + chars + b' ', b'?+e A|0|0| ', b'?+e ' + motion + b' ']
    return encoded([packet.hex() for packet in packets])


def status_battle_round(status, *, next_round=False):
    revive = status == 'battle-status-revive'
    enemy = b'A|Target|186DC|0|1|0|64|A|A|2|0|0|' if revive else b'A|Target|186DC|0|1|46|64|A|A|0|0|0|'
    if status == 'battle-status-casting-skl19-caster-paired-rid0':
        enemy = b'A|Target|186DC|0|1|46|64|A|A|0|186DC|0|'
    helper = b'1|Helper|186DC|0|1|46|64|A|A|0|0|0|' if status in (
        'battle-status-impact', 'battle-status-recovery', 'battle-status-physical-nested-guard-departed',
        'battle-status-physical-self-guard', 'battle-status-physical-self-guard-flight') else b''
    registry = status == 'battle-status-missing-physical-registry'
    if not next_round and (registry or status == 'battle-status-missing-physical-departed'):
        helper = b'B|Guard|186DC|0|1|46|64|A|A|0|0|0|'
    local_mount = b'186DC' if status == 'battle-status-casting-skl19-lethal-rid0' else b'0'
    chars = b'C|0|0|Original|186DC|0|1|46|64|%X|A|%X|%s|0|' % (
        7 if next_round and not registry else 10, 0x20 if status == 'battle-status-physical-self-metadata-cleanup' else 0, local_mount) + helper + enemy
    if status == 'battle-status-modifier-existing':
        chars = chars.replace(b'A|Target|186DC|0|1|46|64|A|A|0|0|0|', b'A|Target|186DC|0|1|46|64|A|A|8000|0|0|')
    if status == 'battle-status-physical-self-flags-partial':
        chars = chars.replace(b'0|Original|186DC|', b'0|Original|186F1|', 1)
    if status in repeated_guard_modes:
        mount_slot = 1 if status.startswith('battle-status-physical-skl72-rid0-interrupt') else 2
        for slot in repeated_guard_modes[status][0]:
            mounted = status.startswith('battle-status-physical-skl72-rid0-') or status in (
                'battle-status-casting-skl19-rid0', 'battle-status-casting-skl19-reflected-rid0',
                'battle-status-casting-skl19-caster-paired-rid0', 'battle-status-casting-skl19-queued-update',
                'battle-status-casting-skl19-queued-ack')
            mount = b'186DC' if slot == mount_slot and mounted else b'0'
            chars += b'%X|Extra%X|186DC|0|1|46|64|A|A|0|%s|0|' % (slot, slot, mount)
    if status in impact_modes:
        chars = chars.replace(b'|186DC|', b'|186FF|')
    if status == 'battle-status-physical-nested-guard-departed':
        chars += b'10|Protected|186DC|0|1|46|64|A|A|0|0|0|'
    if status in ('battle-status-physical-skl113-separate', 'battle-status-physical-skl113-grouped',
                  'battle-status-physical-skl113-aligned', 'battle-status-physical-skl113-outer-guard',
                  'battle-status-physical-skl72-shared-guard'):
        chars += (b'1|Reserved|186DC|0|1|46|64|A|A|0|0|0|'
                  b'B|Nested|186DC|0|1|46|64|A|A|0|0|0|')
    if status == 'battle-status-physical-skl113-aligned':
        chars += (b'2|Guard|186DC|0|1|46|64|A|A|0|0|0|'
                  b'C|Protected|186DC|0|1|46|64|A|A|0|0|0|')
    if next_round:
        if status == 'battle-status-casting-skl19-queued-ack':
            chars = b'C|0|0|Queued0|186DC|0|1|5A|64|9|A|0|0|0|5|Queued5|186DC|0|1|5A|64|9|A|0|0|0|'
            packets = [b'?+e P|5|10|0|0|0|0| ', b'?+e ' + chars + b' ', b'?+e A|20|1| ', b'?+e M|CFP|5|1| ']
            return encoded([packet.hex() for packet in packets])
        if status == 'battle-status-casting-skl19-queued-update':
            chars = b'C|0|0|Queued0|186DC|0|1|5A|64|9|A|0|0|0|2|Queued2|186DC|0|1|5A|64|9|A|0|0|0|'
        motion = b'M|SKL|1|3|0|0|A|201|C|B|FF|SKL|2649|2|F|6|0|A|FF|' if registry else b'M|CFP|0|1|'
        packets = [b'?+e ' + chars + b' ', b'?+e A|0|1| ', b'?+e ' + motion + b' ']
        return encoded([packet.hex() for packet in packets])
    motion = {
        **{name: case[1] for name, case in repeated_guard_modes.items()},
        'battle-status-revive': b'M|SKL|2649|3|F|B|0|A|80000|89|FF|CFP|A|2|',
        'battle-status-ko': b'M|SKL|2649|3|F|9|0|A|80000|FF|',
        'battle-status-grow': b'M|SKL|2649|3|F|6|0|A|FF|',
        'battle-status-retire': b'M|SKL|2649|3|F|8|0|A|FF|',
        'battle-status-swap': b'M|SKL|2649|3|F|7|0|0|FF|',
        'battle-status-impact': b'M|SKL|2649|3|F|C|0|1|A|1|C|FF|',
        'battle-status-recovery': b'M|SKL|2649|3|F|D|0|1|A|0|C|FF|',
        'battle-status-missing-target': b'M|SKL|2649|3|F|6|0|B|FF|SKL|2649|2|F|6|0|A|FF|',
        'battle-status-missing-swap': b'M|SKL|2649|3|F|7|0|0|0|A|FF|SKL|2649|2|F|6|5|A|FF|',
        'battle-status-missing-status': b'M|SKL|C81|3|F|0|B|1|FF|SKL|2649|2|F|6|0|A|FF|',
        'battle-status-missing-magic': b'M|SKL|76D|3|F|0|B|1|C|FF|SKL|2649|2|F|6|0|A|FF|',
        'battle-status-missing-numeric': b'M|SKL|17D5|3|F|0|B|1|C|FF|SKL|2649|2|F|6|0|A|FF|',
        'battle-status-missing-82': b'M|SKL|2009|3|F|0|B|1|C|FF|SKL|2649|2|F|6|0|A|FF|',
        'battle-status-missing-physical-attacker': b'M|SKL|1|3|0|B|A|1|C|FF|SKL|2649|2|F|6|0|A|FF|',
        'battle-status-missing-physical-first': b'M|SKL|1|3|0|0|B|1|C|FF|SKL|2649|2|F|6|0|A|FF|',
        'battle-status-missing-physical-late': b'M|SKL|1C85|3|0|0|0|0|0|B|A|1|C|FF|SKL|2649|2|F|6|0|A|FF|',
        'battle-status-missing-physical-chain': b'M|SKL|6591|3|0|0|A|80001|C|B|1|7|FF|SKL|2649|2|F|6|0|A|FF|',
        'battle-status-missing-physical-projectile': b'M|SKL|1|3|2|0|B|1|C|FF|SKL|2649|2|F|6|0|A|FF|',
        'battle-status-missing-physical-registry': b'M|CFP|0|1|',
        'battle-status-missing-physical-departed': (
            b'M|PLV|B|SKL|1C85|3|2|B|A|1|C|FF|SKL|1|3|0|0|A|201|C|B|FF|SKL|2649|2|F|6|0|A|FF|'),
        'battle-status-missing-physical-nested': b'M|SKL|1C21|3|0|0|A|1|C|B|1|7|FF|SKL|2649|2|F|6|0|A|FF|',
        'battle-status-physical-self-only': (
            b'M|SKL|67E9|1|1|0|0|4000|C|FF|SKL|67E9|1|2|0|0|4000|C|0|4000|7|FF|'
            b'SKL|67E9|1|3|0|0|4000|C|FF|CFP|0|2|'),
        'battle-status-physical-nested-guard-departed':
            b'M|PLV|10|SKL|1C21|3|0|0|A|1|C|10|201|7|1|FF|CFP|0|2|',
        'battle-status-physical-self-guard':
            b'M|SKL|67E9|3|2|0|0|4000|C|0|4200|7|1|FF|CFP|0|2|',
        'battle-status-physical-self-guard-flight':
            b'M|SKL|67E9|3|2|0|A|1|7|0|4200|7|1|FF|CFP|0|2|',
        'battle-status-physical-self-guard-flight-target':
            b'M|SKL|67E9|3|2|0|A|1|7|0|4200|7|A|FF|CFP|0|2|',
        'battle-status-physical-self-alias-flight':
            b'M|SKL|67E9|3|2|0|A|1|7|0|4200|7|0|FF|CFP|0|2|',
        'battle-status-physical-self-alias-only':
            b'M|SKL|67E9|3|2|0|0|4000|C|0|4200|7|0|FF|CFP|0|2|',
        'battle-status-physical-skl113-separate':
            b'M|SKL|2C25|3|0|0|A|1|C|B|1|7|FF|FF|CFP|B|2|',
        'battle-status-physical-skl113-grouped':
            b'M|SKL|2C25|3|0|0|A|1|C|B|1|7|FF|FF||CFP|0|2|',
        'battle-status-physical-skl113-aligned':
            b'M|SKL|2C25|3|3|0|A|1|C|B|1|FFFFFFFF|0|C|201|7|2|FF|CFP|0|2|',
        'battle-status-physical-skl113-outer-guard':
            b'M|SKL|2C25|3|2|0|A|201|C|1|B|1|7|FF|FF|CFP|B|2|',
        'battle-status-physical-skl72-shared-guard':
            b'M|SKL|1C21|3|0|0|A|201|C|1|B|201|7|1|FF|CFP|0|2|',
        'battle-status-assist-ff-impact': (
            b'M|SKL|2649|3|F|C|0|FF|RID|0|5|0|0|OriginalRider|186DC|0|7B|28|64|8|A|0|'
            b'OriginalMount|186DC|1C8|0|64|0|A|2|SKL|2649|2|F|6|0|A|FF|'),
        'battle-status-assist-ff-recovery': b'M|SKL|2649|3|F|D|0|FF|SKL|2649|2|F|6|0|A|FF|',
    }[status]
    packets = [b'>HY 1 g8 ', b'?+e P|0|10|0|0|0|0| ', b'?+e ' + chars + b' ', b'?+e A|0|0| ', b'?+e ' + motion + b' ']
    return encoded([packet.hex() for packet in packets])


with socket.socket() as server:
    server.settimeout(25)
    server.bind(('127.0.0.1', 0))
    server.listen(1)
    print(json.dumps(dict(port=server.getsockname()[1])), flush=True)
    connection, _ = server.accept()
    with connection:
        connection.settimeout(25)

        def exact(n):
            out = b''
            while len(out) < n:
                chunk = connection.recv(n - len(out))
                if not chunk:
                    raise ValueError('Short original option request')
                out += chunk
            return out

        def request():
            header = exact(4)
            assert header[:2] == b'\xaf\xef'
            n = struct.unpack('<H', header[2:])[0]
            assert 0 < n <= 32767
            raw = exact(n)
            assert exact(2) == b'\xef\xaf'
            return wire.payload_decode(raw, key)

        def observe_parked():
            assert sys.stdin.readline().strip() == 'check-return'
            connection.settimeout(0.12)
            try:
                connection.recv(1)
            except socket.timeout:
                print(json.dumps(dict(return_parked=True)), flush=True)
            else:
                raise AssertionError('Client sent or closed before the return boundary')
            connection.settimeout(25)

        connection.sendall(wire.frame(bytes.fromhex(old['bootstrap']['payloadHex'])))
        assert request() == wire.payload_decode(bytes.fromhex(old['authFrameHex'])[4:-2], key)
        connection.sendall(bytes.fromhex(old['authReplyFrameHex']))
        assert request() == bytes.fromhex(old['flow']['requests']['list']['plainHex'])
        data = bytes.fromhex(v['wire']['category5']['frameHex'] + flow['initial']['frameHex'])
        connection.sendall(data[:7])
        connection.sendall(data[7:])
        assert request() == bytes.fromhex(v['wire']['request']['plainHex'])
        upgrades = 1
        refreshed = entered = reloaded = False
        count = battle_exits = return_requests = result_guards = battle_keepalives = 0
        if mode == 'abort':
            assert connection.recv(1) == b''
        elif mode == 'denied':
            connection.sendall(bytes.fromhex(v['wire']['denied']['frameHex']))
            assert connection.recv(1) == b''
        else:
            if mode == 'retry':
                connection.sendall(bytes.fromhex(v['wire']['denied']['frameHex']))
                assert request() == bytes.fromhex(v['wire']['request']['plainHex'])
                upgrades += 1
            if mode.endswith('close'):
                assert sys.stdin.readline().strip() == 'release'
            connection.sendall(bytes.fromhex(v['wire']['accepted']['frameHex']))
            if mode == 'duplicate':
                connection.sendall(bytes.fromhex(v['wire']['accepted']['frameHex']))
            if mode.endswith('close'):
                assert connection.recv(1) == b''
            else:
                assert request() == bytes.fromhex(old['flow']['requests']['list']['plainHex'])
                refreshed = True
                connection.sendall(bytes.fromhex(v['wire']['category8']['frameHex'] + flow['initial']['frameHex']))
                assert request() == bytes.fromhex(flow['entry']['plainHex'])
                entered = True
                entry_tick = monotonic()
                if mode == 'cancel':
                    assert connection.recv(1) == b''
                else:
                    if music_phases:
                        assert sys.stdin.readline().strip() == 'entry-ready'
                    data = bytes.fromhex(old['flow']['replies']['entered']['frameHex']) + initial_scene()
                    at = 0
                    for size in [1, 2, 5, 13, 31, 73, len(data)]:
                        connection.sendall(data[at:at + size])
                        at += size
                        if at >= len(data):
                            break
                    if sustained:
                        connection.settimeout(40)
                        previous = entry_tick
                        intervals = []
                        for _ in range(2):
                            assert request() == b'3$} nr '
                            now = monotonic()
                            intervals.append(round((now - previous) * 1000))
                            previous = now
                        assert 29000 < intervals[0] < 40000 and 29900 < intervals[1] < 40000, intervals
                        assert previous - entry_tick > 60
                        print(json.dumps(dict(keepalive_intervals_ms=intervals)), flush=True)
                        connection.settimeout(25)
                    if not battle_result:
                        for expected in scene['protocol']['requestPlainHex']:
                            assert request() == bytes.fromhex(expected)
                            count += 1
                    if mode in ['scene-switch', 'browser'] or server_return or city_return or battle_result or sustained:
                        assert sys.stdin.readline().strip() == 'release'
                    if battle_result:
                        connection.sendall(summon_battle_entry() if mode == 'battle-summon' else status_battle_round(mode))
                        expected_action = b'$T5 W|FF ' if mode == 'battle-status-casting-skl19-lethal-rid0' else b'$T5 G '
                        assert request() == expected_action
                        result_guards += 1
                        if mode == 'battle-status-casting-skl19-lethal-rid0':
                            assert request() == expected_action
                            result_guards += 1
                        if mode in ('battle-status-swap', 'battle-status-missing-physical-registry',
                                    'battle-status-casting-skl19-queued-update', 'battle-status-casting-skl19-queued-ack'):
                            assert sys.stdin.readline().strip() == 'next-round'
                            connection.sendall(status_battle_round(mode, next_round=True))
                            assert request() == b'$T5 G '
                            result_guards += 1
                        native_stop = mode == 'battle-status-physical-self-control-scatter-stop'
                        if native_stop:
                            assert sys.stdin.readline().strip() == 'await-native-exit'
                            assert request() == b'$!~ 0 '
                            battle_exits += 1
                            print(json.dumps(dict(native_exit_verified=True)), flush=True)
                        assert sys.stdin.readline().strip() == 'finish-battle'
                        if mode != 'battle-status-casting-skl19-lethal-rid0' and not native_stop:
                            connection.sendall(encoded([b'?+e C|20| '.hex()]))
                        if not native_stop:
                            next_request = request()
                            while mode in ('battle-status-casting-pursuit-linked', 'battle-status-casting-weather-stacked',
                                        'battle-status-physical-basic-self', 'battle-status-physical-basic-self-following',
                                        'battle-status-physical-class5-self', 'battle-status-physical-class6-self-following', 'battle-status-physical-class84-self-following',
                                        'battle-status-physical-self-reflect-following', 'battle-status-physical-self-heal-following', 'battle-status-physical-self-skip-priority',
                                        'battle-status-physical-self-control-charge', 'battle-status-physical-self-control-charged-reflect', 'battle-status-physical-self-control-scatter-stop', *self_metadata_modes, *common_self_guard_modes, *self_flags_modes, *modifier_modes, *upper_modes, *impact_modes) and next_request == b'3$} nr ':
                                battle_keepalives += 1
                                next_request = request()
                            assert next_request == b'$!~ 0 ', next_request.hex()
                            battle_exits += 1
                        print(json.dumps(dict(battle_exit_verified=True, **(
                            dict(battle_keepalives_verified=battle_keepalives)
                            if mode in ('battle-status-casting-pursuit-linked', 'battle-status-casting-weather-stacked',
                                    'battle-status-physical-basic-self', 'battle-status-physical-basic-self-following',
                                    'battle-status-physical-class5-self', 'battle-status-physical-class6-self-following', 'battle-status-physical-class84-self-following',
                                    'battle-status-physical-self-reflect-following', 'battle-status-physical-self-heal-following', 'battle-status-physical-self-skip-priority',
                                    'battle-status-physical-self-control-charge', 'battle-status-physical-self-control-charged-reflect', 'battle-status-physical-self-control-scatter-stop', *self_metadata_modes, *common_self_guard_modes, *self_flags_modes, *modifier_modes, *upper_modes, *impact_modes) else {}))), flush=True)
                        for expected in scene['protocol']['requestPlainHex']:
                            assert request() == bytes.fromhex(expected)
                            count += 1
                        if reentry:
                            assert sys.stdin.readline().strip() == 'next-battle'
                            connection.sendall(encoded([packet.encode('ascii').hex() for packet in reentry_vectors['packets']]))
                            second_keepalives = 0
                            def second_request():
                                global battle_keepalives, second_keepalives
                                value = request()
                                while value == b'3$} nr ':
                                    battle_keepalives += 1
                                    second_keepalives += 1
                                    value = request()
                                return value
                            assert second_request() == b'$T5 G '
                            result_guards += 1
                            print(json.dumps(dict(second_guard_verified=True)), flush=True)
                            assert sys.stdin.readline().strip() == 'finish-second-battle'
                            connection.sendall(encoded([b'?+e C|20| '.hex()]))
                            assert second_request() == b'$!~ 0 '
                            battle_exits += 1
                            print(json.dumps(dict(second_exit_verified=True, battle_keepalives_verified=second_keepalives)), flush=True)
                            for expected in reentry_vectors['movement']['requestsPlain']:
                                actual = request()
                                assert actual == expected.encode('ascii'), ('second movement', expected, actual.hex())
                                count += 1
                        assert connection.recv(1) == b''
                    elif city_return:
                        if battle_city:
                            connection.sendall(city_battle_entry())
                        assert request() == b'4}o '
                        return_requests += 1
                        print(json.dumps(dict(return_request_verified=True)), flush=True)
                        observe_parked()
                        if battle_city:
                            transfer, patch = city_material()
                            if mode == 'city-return-battle-transfer':
                                connection.sendall(encoded([transfer]))
                            elif mode == 'city-return-battle-early':
                                connection.sendall(encoded([b'>HY 1 g8 '.hex()]))
                            assert request() == b'$!~ 0 '
                            return_requests += 1
                            if mode == 'city-return-battle-late':
                                connection.sendall(encoded([b'>HY 1 g8 '.hex()]))
                                assert request() == b'$!~ 0 '
                                return_requests += 1
                                connection.sendall(encoded([transfer]))
                            if mode == 'city-return-battle-early':
                                connection.sendall(encoded([b'=X# 2 3 4 '.hex()]))
                            print(json.dumps(dict(city_boundary_verified=return_requests - 1)), flush=True)
                            if mode != 'city-return-battle-early':
                                assert sys.stdin.readline().strip() == 'city-map'
                                connection.sendall(encoded([patch]))
                                reloaded = True
                        elif mode == 'city-return-boundary':
                            connection.sendall(encoded([b'M6c Original 1 '.hex(), b'>HY 1 g8 '.hex()]))
                            assert request() == b',ua 0 '
                            assert request() == b'$!~ 0 '
                            return_requests += 2
                            connection.sendall(encoded([b'=X# 2 3 4 '.hex()]))
                        else:
                            transfer, patch = city_material()
                            connection.sendall(encoded([transfer]))
                            assert sys.stdin.readline().strip() == 'city-map'
                            connection.sendall(encoded([patch]))
                            reloaded = True
                        for expected in scene['protocol']['requestPlainHex']:
                            assert request() == bytes.fromhex(expected)
                            count += 1
                        assert connection.recv(1) == b''
                    elif server_return:
                        if mode in ('server-return-battle', 'manual-return-battle') or music_phases:
                            connection.sendall(encoded([b'>HY 1 g8 '.hex()]))
                            if music_phases:
                                assert sys.stdin.readline().strip() == 'queue-music'
                                connection.sendall(encoded([b'S)B 3f '.hex(), b'S)B 42 '.hex()]))
                                assert sys.stdin.readline().strip() == 'finish-battle'
                                connection.sendall(encoded([b'?+e C|20| '.hex()]))
                                assert request() == b'$!~ 0 '
                                battle_exits += 1
                                print(json.dumps(dict(battle_exit_verified=True)), flush=True)
                            if not manual_return:
                                assert sys.stdin.readline().strip() == 'return-notice'
                        if not manual_return:
                            packets = encoded([b'VKW refused successful '.hex(), b'VKW successful detail '.hex(),
                                               b'VKW successful detail '.hex(), *scene['protocol']['afterPlainHex']])
                            connection.sendall(packets[:5])
                            connection.sendall(packets[5:])
                        observe_parked()
                        if manual_return:
                            assert request() == b'1^t '
                            return_requests += 1
                            print(json.dumps(dict(return_request_verified=True)), flush=True)
                            assert sys.stdin.readline().strip() == 'ack-return'
                            packet = encoded([b'VKW successful detail '.hex()])
                            connection.sendall(packet[:5])
                            connection.sendall(packet[5:])
                        assert connection.recv(1) == b''
                    else:
                        connection.sendall(encoded(scene['protocol']['afterPlainHex']))
                        if mode in ['scene-switch', 'browser'] or sustained:
                            connection.sendall(encoded(scene['protocol']['beforePlainHex']))
                            reloaded = True
                            assert connection.recv(1) == b''
                        else:
                            connection.shutdown(socket.SHUT_WR)
        print(json.dumps(dict(authentication_verified=True, list_request_verified=True, upgrade_requests_verified=upgrades,
                              roster_refresh_verified=refreshed, entry_request_verified=entered, scene_reloaded=reloaded, selected_slot=flow['slot'],
                              entry_arguments=flow['entry']['arguments'] if entered else None, fallback_corrected=flow['fallback'],
                              mode=mode, movement_requests_verified=count, total_client_requests=2 + upgrades + int(refreshed) + int(entered) + count + battle_exits + return_requests + result_guards + (2 if sustained else 0) + battle_keepalives,
                              official_session=False, **(dict(battles_verified=2, accepted_connections=1, second_battle_verified=True) if reentry else {}), **(dict(battle_keepalives_verified=battle_keepalives)
                               if mode in ('battle-status-casting-pursuit-linked', 'battle-status-casting-weather-stacked',
                                    'battle-status-physical-basic-self', 'battle-status-physical-basic-self-following',
                                    'battle-status-physical-class5-self', 'battle-status-physical-class6-self-following', 'battle-status-physical-class84-self-following',
                                    'battle-status-physical-self-reflect-following', 'battle-status-physical-self-heal-following', 'battle-status-physical-self-skip-priority',
                                    'battle-status-physical-self-control-charge', 'battle-status-physical-self-control-charged-reflect', 'battle-status-physical-self-control-scatter-stop', *self_metadata_modes, *common_self_guard_modes, *self_flags_modes, *modifier_modes, *upper_modes, *impact_modes) else {}),
                              **(dict(server_return_confirmed=True) if server_return else {}),
                              **(dict(return_request_verified=return_requests == 1) if manual_return else {}),
                              **(dict(city_return_verified=True, city_return_requests=return_requests) if city_return else {}),
                              **(dict(battle_exit_verified=battle_exits == (2 if reentry else 1)) if music_phases or battle_result else {}),
                              **(dict(summon_guards_verified=result_guards) if mode == 'battle-summon' else {}),
                              **(dict(status_pet_waits_verified=result_guards) if mode == 'battle-status-casting-skl19-lethal-rid0' else
                                 dict(status_guards_verified=result_guards) if battle_result and mode != 'battle-summon' else {}))), flush=True)
