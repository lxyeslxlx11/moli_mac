#!/usr/bin/env python3
"""Prepare the fixed private restoration TEST clone. Default is read-only preflight.

Never registers, starts, logs into, resets, or alters the original/baseline VM.
The original may run: only its bounded config and file metadata are read. Its
mutable system disk/EFI/TPM state is never hashed, copied or required unchanged.
The only semantic config changes are the new clone's Information.Name and UUID.
"""
import argparse
import copy
import datetime as dt
import hashlib
import json
import os
from pathlib import Path
import plistlib
import shutil
import stat
import subprocess
import sys

ROOT = Path('/Users/lx/Documents/Codex/2026-10-25/task')
VM_ROOT = Path('/Users/lx/Documents/code/moli-mac/build/utm')
ORIGINAL_NAME = 'MoliOffline-ARM64-20261025'
ORIGINAL_UUID = '087A27D7-88CC-4E08-8FB7-0FE852DAA3C8'
CLONE_NAME = 'MoliRestoreTest-ARM64-20261025-v9'
CLONE_UUID = '52490BAF-23BC-4E29-A39A-AA9F4E11A1F9'
ORIGINAL = VM_ROOT / (ORIGINAL_NAME + '.utm')
BASELINE = VM_ROOT / 'baselines' / (ORIGINAL_NAME + '-windows-v8.utm')
TARGET = VM_ROOT / (CLONE_NAME + '.utm')
UI_RECEIPT = ROOT / 'analysis/vm-install-v9/restore-preflight-ui.json'
OUTPUT_RECEIPT = ROOT / 'analysis/vm-install-v9/restore-clone.json'
BASELINE_RECEIPT = ROOT / 'analysis/vm-install-v8/windows-cold-baseline.json'
BASELINE_RECEIPT_SHA256 = '538dcae59e03380184c438c723142ff85177e22511dd245c79bd2381d0e4d475'
HELPER_PATH = ROOT / 'analysis/vm-install-v8/create_cold_baseline.py'
HELPER_SHA256 = 'd730abf1d0a4d05a302eb0b3ad0774211894b6e6416b098842acd4a2ae7398a7'
QEMU_IMG = '/opt/homebrew/bin/qemu-img'
EXPECTED_HASHES = {
    'config.plist': 'c7c980a646028c867429f2bc047361bcc92e9e396d871c1b438f1e58c14f8743',
    'Data/3CDE64AC-478C-4853-85AF-77DE92D646AB.qcow2': '6bb344bec27fb28987e7cf1328b9ffac64c818923b738bef6864b43c0b3b0ba3',
    'Data/Windows11_Client_arm64_zh-cn_26300_9457.qcow2': '905b27d845e38d79a3bc39548f11f948bd6690ea2aa24a04b5da8e618aeaeecc',
    'Data/netkvm-w11-arm64-0.1.274.qcow2': '532a8190e967ecd58deee6ee411fa3b3fed4d84cfcb06c39da3e0d1e28d0f4bc',
    'Data/moli-base-drivers-w11-arm64-0.1.274.qcow2': 'f9613b9dfbc919e87448e6a81cd122eaa8321e33d33a62c38653beeeda439470',
    'Data/efi_vars.fd': '033e8bee6128083899bb0ef8d1bca4880d724a701b892ae7adcbc8a7e0edccac',
    'Data/tpmdata': 'd58a7b9dab9d1d73a1ae4d195ab3264df04306b3190913d1d3cd6deaf360fbf5',
}


def load_helper():
    st = HELPER_PATH.lstat()
    if not stat.S_ISREG(st.st_mode) or st.st_nlink != 1 or st.st_size > 65536:
        raise ValueError('Unsafe helper file')
    fd = os.open(HELPER_PATH, os.O_RDONLY | getattr(os, 'O_NOFOLLOW', 0))
    with os.fdopen(fd, 'rb') as stream:
        raw = stream.read(65537)
        opened = os.fstat(stream.fileno())
    if ((st.st_dev, st.st_ino) != (opened.st_dev, opened.st_ino)
            or hashlib.sha256(raw).hexdigest() != HELPER_SHA256):
        raise ValueError('Fixed helper changed; review instead of executing')
    module = type(sys)('moli_v8_checked_helper')
    module.__file__ = str(HELPER_PATH)
    exec(compile(raw, str(HELPER_PATH), 'exec'), module.__dict__)
    return module


def validate_ui(h, path, config_hash, now):
    raw = h.read_regular(path, h.TEXT_LIMIT)
    ui = json.loads(raw, object_pairs_hook=h.unique_object)
    expected = {'schema_version': 1, 'original_vm': ORIGINAL_NAME, 'original_uuid': ORIGINAL_UUID,
                'clone_vm': CLONE_NAME, 'clone_uuid': CLONE_UUID,
                'original_config_sha256': config_hash, 'baseline_config_sha256': config_hash,
                'baseline_not_running_confirmed': True,
                'network_absent': True, 'sharing_disabled': True}
    h.require(type(ui) is dict, 'UI receipt must be an object')
    for key, value in expected.items():
        h.require(key in ui and type(ui[key]) is type(value) and ui[key] == value,
                  'UI receipt missing/mismatched binding: ' + key)
    h.require(ui.get('original_observed_state') in ('stopped', 'running_locked'),
              'Original state must be a fresh observation, not assumed stopped')
    h.require(type(ui.get('observed_utc')) is str, 'UI timestamp must be a string')
    observed = dt.datetime.fromisoformat(ui['observed_utc'].replace('Z', '+00:00'))
    h.require(observed.tzinfo is not None and now.tzinfo is not None, 'UI time must include timezone')
    age = (now - observed).total_seconds()
    h.require(0 <= age <= 600, 'Stale/future baseline and original-state observation')
    return {'sha256': hashlib.sha256(raw).hexdigest(), 'observed_utc': observed.isoformat(),
            'age_seconds': age, 'original_observed_state': ui['original_observed_state']}


def check_backing(h, bundle, runner):
    rows = []
    def no_external_refs(value):
        if type(value) is dict:
            for key, item in value.items():
                h.require(not (('backing' in key or key in ('data-file', 'data-file-raw')) and item),
                          'External/backing disk reference present')
                no_external_refs(item)
        elif type(value) is list:
            for item in value:
                no_external_refs(item)
    for relative in h.FILES[1:5]:
        result = runner([QEMU_IMG, 'info', '--backing-chain', '--output=json', str(bundle / relative)],
                        capture_output=True, text=True, timeout=30)
        h.require(result.returncode == 0 and not result.stderr.strip(), 'Disk header check failed')
        h.require(len(result.stdout) <= h.TEXT_LIMIT, 'Disk header output exceeds bound')
        data = json.loads(result.stdout, object_pairs_hook=h.unique_object)
        h.require(type(data) is list and len(data) == 1 and data[0].get('format') == 'qcow2',
                  'Expected one self-contained qcow2 image')
        no_external_refs(data)
        rows.append({'path': relative, 'format': 'qcow2', 'backing_chain_entries': 1,
                     'external_data_or_backing': False})
    return rows


def clone_config(h, policy, raw):
    source = policy.plain(plistlib.loads(raw, dict_type=policy.UniqueDict))
    h.require(policy.exact(source, policy.EXPECTED), 'Source configuration differs from fixed policy')
    clone = copy.deepcopy(source)
    clone['Information']['Name'] = CLONE_NAME
    clone['Information']['UUID'] = CLONE_UUID
    check_clone_config(h, policy, clone)
    return plistlib.dumps(clone, fmt=plistlib.FMT_XML, sort_keys=True)


def check_clone_config(h, policy, config):
    h.require(type(config) is dict and type(config.get('Information')) is dict, 'Invalid clone config')
    h.require(config['Information'].get('Name') == CLONE_NAME
              and config['Information'].get('UUID') == CLONE_UUID, 'Wrong clone identity')
    normalized = copy.deepcopy(config)
    normalized['Information']['Name'] = ORIGINAL_NAME
    normalized['Information']['UUID'] = ORIGINAL_UUID
    h.require(policy.exact(normalized, policy.EXPECTED), 'Clone changed more than Name/UUID')


def build(h, policy, original, baseline, target, ui_receipt, output_receipt,
          expected_hashes, baseline_receipt, baseline_receipt_hash, apply=False,
          runner=subprocess.run, disk_usage=shutil.disk_usage, now=None):
    """CLI paths and hashes are fixed; parameters support synthetic tests only."""
    original, baseline, target, ui_receipt, output_receipt, baseline_receipt = map(
        Path, (original, baseline, target, ui_receipt, output_receipt, baseline_receipt))
    h.require(original.name == ORIGINAL_NAME + '.utm', 'Wrong original VM')
    h.require(baseline.name == ORIGINAL_NAME + '-windows-v8.utm'
              and baseline.parent.name == 'baselines' and baseline.parent.parent == original.parent,
              'Wrong v8 baseline path')
    h.require(target.name == CLONE_NAME + '.utm' and target.parent == original.parent, 'Wrong test clone path')
    h.require(tuple(expected_hashes) == h.FILES, 'Unexpected fixed hash inventory')
    for folder in (original, original / 'Data', baseline, baseline / 'Data', target.parent,
                   ui_receipt.parent, output_receipt.parent, baseline_receipt.parent):
        h.no_symlink_directories(folder)
    h.require(not os.path.lexists(target) and not os.path.lexists(output_receipt),
              'Existing target/receipt: inspect outcome, never overwrite or retry blindly')
    h.require(original.stat().st_dev == baseline.stat().st_dev == target.parent.stat().st_dev,
              'Unexpected cross-volume paths')
    h.require(set(p.name for p in baseline.iterdir()) == {'config.plist', 'Data'}, 'Unexpected baseline root files')
    for bundle in (original, baseline):
        audit = policy.verify(bundle)
        h.require(audit.get('passed') is True and audit.get('config_sha256') == expected_hashes['config.plist'],
                  'Baseline/original config violates fixed offline policy')
    h.closed_files(baseline, runner)
    original_before = {p: h.file_state(original / p) for p in h.FILES}
    # Runtime writes to the original's system/EFI/TPM are expected and irrelevant
    # to this copy. Only metadata from config + the three readonly CDs is stable.
    immutable_original = ('config.plist', *h.FILES[2:5])
    before = {p: h.file_state(baseline / p) for p in h.FILES}
    original_inodes = {state[:2] for state in original_before.values()}
    baseline_inodes = {state[:2] for state in before.values()}
    h.require(len(original_inodes) == 7 and len(baseline_inodes) == 7
              and original_inodes.isdisjoint(baseline_inodes), 'Baseline shares a file inode with original')
    raw_receipt = h.read_regular(baseline_receipt, h.TEXT_LIMIT)
    h.require(hashlib.sha256(raw_receipt).hexdigest() == baseline_receipt_hash, 'v8 receipt hash changed')
    previous = json.loads(raw_receipt, object_pairs_hook=h.unique_object)
    h.require(previous.get('status') == 'copied_and_hash_verified'
              and previous.get('source') == str(original) and previous.get('target') == str(baseline),
              'v8 receipt does not bind these sources')
    rows = previous.get('files')
    h.require(type(rows) is list and len(rows) == len(h.FILES)
              and [x['path'] for x in rows] == list(h.FILES), 'v8 receipt inventory differs')
    for row in rows:
        h.require(row['sha256'] == expected_hashes[row['path']] and row['copy_hash_matches'] is True
                  and row['bytes'] == before[row['path']][2], 'v8 receipt content binding differs')
    ui = validate_ui(h, ui_receipt, expected_hashes['config.plist'], now or dt.datetime.now(dt.timezone.utc))
    total = sum(x[2] for x in before.values())
    free = disk_usage(baseline).free
    h.require(free >= total + h.RESERVE, 'Insufficient full-copy fallback space plus 40 GiB reserve')
    for relative in h.FILES:
        h.require(h.read_regular(baseline / relative, expected=before[relative]) == expected_hashes[relative],
                  'Baseline SHA256 mismatch: ' + relative)
    backing = check_backing(h, baseline, runner)
    raw_config = h.read_regular(baseline / 'config.plist', h.TEXT_LIMIT, before['config.plist'])
    new_config = clone_config(h, policy, raw_config)
    h.require(all(h.file_state(original / p) == original_before[p] for p in immutable_original),
              'Original config/readonly media changed concurrently; stop without attributing cause')
    h.require(all(h.file_state(baseline / p) == before[p] for p in h.FILES), 'Baseline changed during checks')
    h.closed_files(baseline, runner)
    plan = {'status': 'preflight_passed', 'apply': bool(apply), 'original': str(original),
            'source_baseline': str(baseline), 'target': str(target), 'clone_name': CLONE_NAME,
            'clone_uuid': CLONE_UUID, 'original_uuid': ORIGINAL_UUID, 'file_count': 7,
            'worst_case_copy_bytes': total, 'reserve_bytes': h.RESERVE, 'free_bytes_before': free,
            'ui_receipt': ui, 'baseline_receipt_sha256': baseline_receipt_hash,
            'baseline_hashes_match_fixed_v8': True, 'baseline_backing_check': backing,
            'original_mutable_file_contents_accessed': False,
            'original_mutable_file_stability_required': False,
            'original_metadata_only_files': list(h.FILES[1:]),
            'allowed_semantic_config_changes': ['Information.Name', 'Information.UUID']}
    if not apply:
        return plan
    target.mkdir(mode=0o700)
    h.private_mode(target, 0o700, runner)
    (target / 'Data').mkdir(mode=0o700)
    h.private_mode(target / 'Data', 0o700, runner)
    copied_rows = []
    remaining = total
    for relative in h.FILES:
        h.require(disk_usage(baseline).free >= remaining + h.RESERVE, 'Space fell below remaining copy budget')
        src, dst = baseline / relative, target / relative
        h.require(h.file_state(src) == before[relative], 'Baseline changed before copy')
        h.require(not os.path.lexists(dst), 'Destination exists unexpectedly')
        result = runner(['/bin/cp', '-c', '-n', str(src), str(dst)], capture_output=True, text=True, timeout=3600)
        h.require(result.returncode == 0, 'Copy failed; partial private clone retained')
        state = h.file_state(dst)
        h.require(state[:2] not in original_inodes | baseline_inodes, 'Clone aliases a protected file inode')
        # Reject a link/alias before chmod, so even an anomalous copy cannot
        # change source permissions through a shared destination inode.
        h.private_mode(dst, 0o600, runner)
        state = h.file_state(dst)
        digest = h.read_regular(dst, expected=state)
        h.require(digest == expected_hashes[relative], 'Clone hash mismatch')
        copied_rows.append({'path': relative, 'bytes': state[2], 'source_sha256': digest,
                            'clone_sha256_before_identity_change': digest, 'state_after_hash': list(state)})
        remaining -= before[relative][2]
    # Only the newly created clone's bounded config is replaced, never either source.
    h.require(h.file_state(target / 'config.plist') == tuple(copied_rows[0]['state_after_hash']), 'Clone config changed')
    temp = target / 'config.identity-v9.plist'
    fd = os.open(temp, os.O_WRONLY | os.O_CREAT | os.O_EXCL | getattr(os, 'O_NOFOLLOW', 0), 0o600)
    with os.fdopen(fd, 'wb') as stream:
        stream.write(new_config)
        stream.flush()
        os.fsync(stream.fileno())
    h.private_mode(temp, 0o600, runner)
    os.replace(temp, target / 'config.plist')
    actual = policy.plain(plistlib.loads(h.read_regular(target / 'config.plist', h.TEXT_LIMIT), dict_type=policy.UniqueDict))
    check_clone_config(h, policy, actual)
    copied_rows[0]['clone_sha256_after_identity_change'] = h.read_regular(target / 'config.plist')
    copied_rows[0]['state_after_hash'] = list(h.file_state(target / 'config.plist'))
    copied_rows[0]['bytes_after_identity_change'] = (target / 'config.plist').stat().st_size
    clone_backing = check_backing(h, target, runner)
    h.closed_files(target, runner)
    h.closed_files(baseline, runner)
    h.require(all(h.file_state(baseline / p) == before[p] for p in h.FILES), 'Baseline changed during copy')
    h.require(all(h.file_state(original / p) == original_before[p] for p in immutable_original),
              'Original config/readonly media changed concurrently; stop without attributing cause')
    for bundle in (original, baseline):
        audit = policy.verify(bundle)
        h.require(audit.get('passed') is True and audit.get('config_sha256') == expected_hashes['config.plist'],
                  'Protected source config changed')
    # Recheck all cross-bundle dependencies, but never compare running guest
    # mutable-file timestamps or treat its normal writes as baseline damage.
    original_now = {h.file_state(original / p)[:2] for p in h.FILES}
    baseline_now = {h.file_state(baseline / p)[:2] for p in h.FILES}
    clone_now = {h.file_state(target / p)[:2] for p in h.FILES}
    h.require(len(original_now) == len(baseline_now) == len(clone_now) == 7
              and original_now.isdisjoint(baseline_now) and clone_now.isdisjoint(original_now | baseline_now),
              'Cross-file or cross-bundle shared inode dependency')
    h.require({p.name for p in target.iterdir()} == {'config.plist', 'Data'}, 'Unexpected clone root files')
    h.require({p.name for p in (target / 'Data').iterdir()} == set(policy.INTERNAL_FILES), 'Unexpected clone Data files')
    for row in copied_rows:
        p = target / row['path']
        h.require(h.file_state(p) == tuple(row['state_after_hash']), 'Clone changed after hash')
        h.require(stat.S_IMODE(p.stat().st_mode) == 0o600, 'Clone file privacy changed')
    for folder in (target, target / 'Data'):
        h.require(stat.S_IMODE(folder.stat().st_mode) == 0o700, 'Clone directory privacy changed')
    free_after = disk_usage(baseline).free
    h.require(free_after >= h.RESERVE, 'Final free space below reserve')
    output = dict(plan, status='clone_copied_and_verified', created_utc=dt.datetime.now(dt.timezone.utc).isoformat(),
                  files=copied_rows, clone_backing_check=clone_backing, free_bytes_after=free_after,
                  baseline_unchanged=True, original_config_and_readonly_media_unchanged=True,
                  original_writes_performed=False, original_mutable_state_not_claimed_unchanged=True,
                  registered_or_started=False, login_attempted=False,
                  privacy='Private copy may contain Windows identity state. Do not distribute or inspect credentials.',
                  method='cp -c -n requests cloning but can fall back to copying; no proof of shared extents.',
                  boot_validation='not run',
                  limitations=['Fresh UI and lsof are observations, not a lock against user-started VMs.',
                               'The original may run and change its mutable files; no copy/hash/unchanged claim is made for them.',
                               'Parallel VM use needs a host memory/CPU budget check before starting the test copy.',
                               'New UUID may trigger guest device/recovery checks. Stop without credentials or security changes.',
                               'This prepares an independent test copy; it does not prove boot or restore success.'])
    h.write_new_receipt(output_receipt, output, runner)
    return output


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--apply', action='store_true', help='Create only the fixed new restoration test clone')
    args = parser.parse_args()
    try:
        h = load_helper()
        result = build(h, h.load_fixed_policy(), ORIGINAL, BASELINE, TARGET, UI_RECEIPT, OUTPUT_RECEIPT,
                       EXPECTED_HASHES, BASELINE_RECEIPT, BASELINE_RECEIPT_SHA256, apply=args.apply)
        print(json.dumps(result, ensure_ascii=False, indent=2))
        return 0
    except (RuntimeError, OSError, ValueError, TypeError, KeyError, OverflowError, RecursionError,
            subprocess.SubprocessError) as exc:
        print(json.dumps({'status': 'stopped', 'completed': False, 'reason': str(exc),
                          'partial_target_may_exist': os.path.lexists(TARGET),
                          'next_step': 'Inspect result before any retry; never overwrite/remove outputs automatically.'}), file=sys.stderr)
        return 1


if __name__ == '__main__':
    raise SystemExit(main())
