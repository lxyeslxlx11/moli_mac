#!/usr/bin/env python3
"""Prepare the v8 private cold copy of the fixed MoliOffline VM; default is preflight.

Real copying requires --apply, a recent matching normal-shutdown UI receipt,
the fixed v7 four-drive offline policy and zero open source files. Never starts a VM.
"""
import argparse
import datetime as dt
import hashlib
import json
import os
from pathlib import Path
import shutil
import stat
import subprocess
import sys

ROOT = Path('/Users/lx/Documents/Codex/2026-10-25/task')
SOURCE = Path('/Users/lx/Documents/code/moli-mac/build/utm/MoliOffline-ARM64-20261025.utm')
TARGET = SOURCE.parent / 'baselines' / 'MoliOffline-ARM64-20261025-windows-v8.utm'
UI_RECEIPT = ROOT / 'analysis/vm-install-v8/final-ui-state.json'
OUTPUT_RECEIPT = ROOT / 'analysis/vm-install-v8/windows-cold-baseline.json'
POLICY_PATH = ROOT / 'analysis/vm-install-v7/verify_offline_four_drive.py'
POLICY_SHA256 = 'b72b8234cd52625552a6df95afacffe9a011af233cd7cc1ae09014051bbfcc87'
VM_NAME = 'MoliOffline-ARM64-20261025'
VM_UUID = '087A27D7-88CC-4E08-8FB7-0FE852DAA3C8'
FILES = ('config.plist', 'Data/3CDE64AC-478C-4853-85AF-77DE92D646AB.qcow2',
         'Data/Windows11_Client_arm64_zh-cn_26300_9457.qcow2',
         'Data/netkvm-w11-arm64-0.1.274.qcow2',
         'Data/moli-base-drivers-w11-arm64-0.1.274.qcow2', 'Data/efi_vars.fd', 'Data/tpmdata')
RESERVE = 40 * 1024 ** 3
MAX_UI_AGE_SECONDS = 600
TEXT_LIMIT = 65536


class Stop(RuntimeError):
    pass


def require(condition, message):
    if not condition:
        raise Stop(message)


def no_symlink_directories(path):
    path = Path(path).absolute()
    for part in reversed((path, *path.parents)):
        require(stat.S_ISDIR(part.lstat().st_mode), 'Expected real directory: ' + str(part))


def file_state(path):
    s = path.lstat()
    require(stat.S_ISREG(s.st_mode) and s.st_nlink == 1, 'Expected regular single-link file: ' + str(path))
    require(s.st_uid == os.getuid(), 'File not owned by current user: ' + str(path))
    return (s.st_dev, s.st_ino, s.st_size, s.st_mtime_ns, s.st_ctime_ns, s.st_nlink)


def read_regular(path, limit=None, expected=None):
    before = file_state(path)
    require(expected is None or expected == before, 'Source changed before read: ' + str(path))
    require(limit is None or before[2] <= limit, 'Text exceeds bound: ' + str(path))
    flags = os.O_RDONLY | getattr(os, 'O_NOFOLLOW', 0) | getattr(os, 'O_NONBLOCK', 0)
    fd = os.open(path, flags)
    with os.fdopen(fd, 'rb') as stream:
        opened = os.fstat(stream.fileno())
        require(stat.S_ISREG(opened.st_mode) and opened.st_nlink == 1
                and (opened.st_dev, opened.st_ino) == before[:2], 'File replaced during open: ' + str(path))
        if limit is not None:
            raw = stream.read(limit + 1)
            require(len(raw) <= limit, 'Text grew beyond bound: ' + str(path))
            result = raw
        else:
            h = hashlib.sha256()
            for chunk in iter(lambda: stream.read(1024 * 1024), b''):
                h.update(chunk)
            result = h.hexdigest()
    require(file_state(path) == before, 'File changed during read: ' + str(path))
    return result


def unique_object(items):
    out = {}
    for key, value in items:
        require(key not in out, 'Duplicate JSON key in UI receipt')
        out[key] = value
    return out


def validate_ui(path, config_hash, now):
    raw = read_regular(path, TEXT_LIMIT)
    ui = json.loads(raw, object_pairs_hook=unique_object)
    require(type(ui) is dict, 'UI receipt must be an object')
    required = {'schema_version', 'vm', 'uuid', 'observed_utc', 'normal_shutdown_confirmed',
                'config_sha256', 'network_absent', 'sharing_disabled'}
    require(required.issubset(ui), 'UI receipt missing required binding fields')
    require(type(ui['schema_version']) is int and ui['schema_version'] == 1, 'Unknown UI receipt schema')
    require(ui['vm'] == VM_NAME and ui['uuid'] == VM_UUID, 'UI receipt is for another VM')
    require(ui['config_sha256'] == config_hash, 'UI receipt does not match current offline config')
    for key in ('normal_shutdown_confirmed', 'network_absent', 'sharing_disabled'):
        require(ui[key] is True, 'UI receipt has not confirmed ' + key)
    require(type(ui['observed_utc']) is str, 'UI timestamp must be a string')
    observed = dt.datetime.fromisoformat(ui['observed_utc'].replace('Z', '+00:00'))
    require(observed.tzinfo is not None and now.tzinfo is not None, 'UI timestamp must include timezone')
    age = (now - observed).total_seconds()
    require(0 <= age <= MAX_UI_AGE_SECONDS, 'UI shutdown record is stale or in the future')
    return {'sha256': hashlib.sha256(raw).hexdigest(), 'observed_utc': observed.isoformat(),
            'age_seconds_at_preflight': age}


def closed_files(source, runner):
    result = runner(['/usr/sbin/lsof', '-t', *[str(source / p) for p in FILES]],
                    capture_output=True, text=True, timeout=30)
    require(result.returncode == 1 and not result.stdout.strip() and not result.stderr.strip(),
            'Source file is open or lsof unavailable/ambiguous; stop')


def private_mode(path, mode, runner):
    # Only newly created copy files/directories are passed here, never the source.
    result = runner(['/bin/chmod', '-N', str(path)], capture_output=True, text=True, timeout=30)
    require(result.returncode == 0, 'Cannot remove inherited ACL from new private output')
    os.chmod(path, mode, follow_symlinks=False)
    s = path.lstat()
    require(s.st_uid == os.getuid() and stat.S_IMODE(s.st_mode) == mode, 'Private output mode/owner mismatch')


def write_new_receipt(path, value, runner):
    flags = os.O_WRONLY | os.O_CREAT | os.O_EXCL | getattr(os, 'O_NOFOLLOW', 0)
    fd = os.open(path, flags, 0o600)
    with os.fdopen(fd, 'w', encoding='utf-8') as stream:
        private_mode(path, 0o600, runner)
        json.dump(value, stream, ensure_ascii=False, indent=2)
        stream.write('\n')
        stream.flush()
        os.fsync(stream.fileno())


def build(source, target, ui_receipt, output_receipt, policy, apply=False,
          runner=subprocess.run, disk_usage=shutil.disk_usage, now=None):
    """Paths are fixed by main; dependency arguments allow synthetic-only tests."""
    source, target, ui_receipt, output_receipt = map(Path, (source, target, ui_receipt, output_receipt))
    require(source.name == VM_NAME + '.utm', 'Unexpected source VM basename')
    require(target.parent.name == 'baselines' and target.name == VM_NAME + '-windows-v8.utm',
            'Unexpected private baseline target')
    require(target.parent.parent == source.parent, 'Baseline must remain beside this source VM')
    for directory in (source, source / 'Data', target.parent, ui_receipt.parent, output_receipt.parent):
        no_symlink_directories(directory)
    require(not os.path.lexists(target) and not os.path.lexists(output_receipt),
            'Existing output or symlink: inspect partial outcome; never overwrite or blindly retry')
    require(source.stat().st_dev == target.parent.stat().st_dev, 'Source and target are on different volumes')
    require(set(p.name for p in (source / 'Data').iterdir()) == {Path(p).name for p in FILES[1:]},
            'Unexpected/missing Data files')
    require(tuple('Data/' + name for name in policy.INTERNAL_FILES) == FILES[1:], 'Unexpected policy file inventory')
    audit = policy.verify(source)
    require(audit.get('passed') is True, 'Offline config rejected: ' + str(audit.get('failed_checks')))
    ui = validate_ui(ui_receipt, audit['config_sha256'], now or dt.datetime.now(dt.timezone.utc))
    closed_files(source, runner)
    before = {p: file_state(source / p) for p in FILES}
    total = sum(state[2] for state in before.values())
    free = disk_usage(source).free
    require(free >= total + RESERVE, 'Insufficient space for a full-copy fallback plus 40 GiB reserve')
    require(all(file_state(source / p) == before[p] for p in FILES), 'Source changed during preflight')
    plan = {'status': 'preflight_passed', 'apply': bool(apply), 'source': str(source), 'target': str(target),
            'file_count': len(FILES), 'worst_case_copy_bytes': total, 'reserve_bytes': RESERVE,
            'host_free_bytes_before': free, 'config_sha256': audit['config_sha256'], 'ui_receipt': ui}
    if not apply:
        return plan
    # Create exclusively. On failure, leave the partial private directory for inspection.
    target.mkdir(mode=0o700)
    private_mode(target, 0o700, runner)
    (target / 'Data').mkdir(mode=0o700)
    private_mode(target / 'Data', 0o700, runner)
    rows = []
    remaining = total
    for name in FILES:
        require(disk_usage(source).free >= remaining + RESERVE,
                'Free space fell below remaining worst-case copy plus reserve')
        src, dst = source / name, target / name
        require(file_state(src) == before[name], 'Source changed before copy: ' + name)
        require(not os.path.lexists(dst), 'Destination already exists: ' + name)
        copied = runner(['/bin/cp', '-c', '-n', str(src), str(dst)],
                        capture_output=True, text=True, timeout=3600)
        require(copied.returncode == 0, 'cp failed for ' + name + '; partial target retained')
        file_state(dst)
        private_mode(dst, 0o600, runner)
        source_hash = read_regular(src, expected=before[name])
        target_before_hash = file_state(dst)
        target_hash = read_regular(dst, expected=target_before_hash)
        require(source_hash == target_hash, 'Copy hash mismatch: ' + name)
        require(before[name][0:2] != target_before_hash[0:2], 'Copy unexpectedly aliases source inode')
        rows.append({'path': name, 'bytes': before[name][2], 'sha256': source_hash,
                     'copy_hash_matches': True, 'target_allocated_bytes': dst.stat().st_blocks * 512,
                     'target_metadata_after_hash': list(target_before_hash)})
        remaining -= before[name][2]
        require(disk_usage(source).free >= RESERVE, 'Free space fell below 40 GiB reserve')
    closed_files(source, runner)
    require(all(file_state(source / p) == before[p] for p in FILES), 'Source changed; baseline not accepted')
    require(all(file_state(target / row['path']) == tuple(row['target_metadata_after_hash']) for row in rows),
            'Destination changed after hash; baseline not accepted')
    source_after = policy.verify(source)
    copy_audit = policy.verify(target)
    require(source_after.get('passed') is True and source_after['config_sha256'] == audit['config_sha256'],
            'Source config changed after copy')
    require(copy_audit.get('passed') is True and copy_audit['config_sha256'] == audit['config_sha256'],
            'Baseline config does not match fixed offline policy')
    require({p.name for p in target.iterdir()} == {'config.plist', 'Data'}, 'Unexpected baseline root file')
    for folder in (target, target / 'Data'):
        st = folder.lstat()
        require(stat.S_ISDIR(st.st_mode) and st.st_uid == os.getuid() and stat.S_IMODE(st.st_mode) == 0o700,
                'Private baseline directory changed')
    free_after = disk_usage(source).free
    require(free_after >= RESERVE, 'Final host reserve below 40 GiB')
    result = dict(plan, status='copied_and_hash_verified', created_utc=dt.datetime.now(dt.timezone.utc).isoformat(),
                  files=rows, host_free_bytes_after=free_after, baseline_config_audit=copy_audit,
                  method='cp -c -n requested cloning; macOS may fall back to copying. Actual shared extents not verified.',
                  permissions='New baseline directories 0700, files/receipt 0600; inherited ACLs removed only from new outputs.',
                  privacy='Private post-login VM may contain Windows identity/session state. Never upload or distribute; no credential stores inspected.',
                  omitted=['UTM screenshot.png thumbnail and other non-whitelisted root content'],
                  restore_boot_test='not run', registered_or_started_copy=False,
                  limitations=['File hashes and config checks do not establish guest health or restoration boot success.',
                               'Same-volume copy is not an independent disaster-recovery backup.',
                               'UI receipt and lsof are observations; no concurrent VM start is allowed during copying.',
                               'Allocated bytes are filesystem metadata, not unique physical usage or proof of cloning.',
                               'Disk backing chains are not established by the config-only policy; require separate prior evidence.',
                               'Preserve current VM before restore; do not register/run duplicate UUID copies simultaneously.'])
    write_new_receipt(output_receipt, result, runner)
    return result


def load_fixed_policy():
    raw = read_regular(POLICY_PATH, TEXT_LIMIT)
    require(hashlib.sha256(raw).hexdigest() == POLICY_SHA256, 'Offline policy code hash changed; review before use')
    # Execute exactly the bytes whose hash was checked, without a second path read.
    module = type(sys)('moli_fixed_v7_checked')
    module.__file__ = str(POLICY_PATH)
    exec(compile(raw, str(POLICY_PATH), 'exec'), module.__dict__)
    return module


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--apply', action='store_true', help='Create the fixed private baseline after all gates pass')
    args = parser.parse_args()
    try:
        result = build(SOURCE, TARGET, UI_RECEIPT, OUTPUT_RECEIPT, load_fixed_policy(), apply=args.apply)
        print(json.dumps(result, ensure_ascii=False, indent=2))
        return 0
    except (Stop, OSError, ValueError, TypeError, KeyError, OverflowError, RecursionError, subprocess.SubprocessError) as exc:
        print(json.dumps({'status': 'stopped', 'completed': False, 'reason': str(exc),
                          'partial_target_may_exist': os.path.lexists(TARGET),
                          'next_step': 'Inspect existing output before any retry; never remove or overwrite automatically.'},
                         ensure_ascii=False), file=sys.stderr)
        return 1


if __name__ == '__main__':
    raise SystemExit(main())
