"""Synthetic-only restoration clone tests; no real VM, cp, lsof or QEMU action."""
import copy
import datetime as dt
import hashlib
import importlib.util
import json
import os
from pathlib import Path
import plistlib
import shutil
import stat
import subprocess
import tempfile
from types import SimpleNamespace
import unittest
from unittest.mock import patch

spec = importlib.util.spec_from_file_location('moli_restore_v9', Path(__file__).with_name('create_restore_test_clone.py'))
c = importlib.util.module_from_spec(spec)
spec.loader.exec_module(c)
h = c.load_helper()
policy = h.load_fixed_policy()


class RestoreCloneTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.root = Path(self.temp.name).resolve()
        self.original = self.root / (c.ORIGINAL_NAME + '.utm')
        self.baseline = self.root / 'baselines' / (c.ORIGINAL_NAME + '-windows-v8.utm')
        self.target = self.root / (c.CLONE_NAME + '.utm')
        self.ui = self.root / 'ui.json'
        self.receipt = self.root / 'out.json'
        self.previous = self.root / 'baseline.json'
        for bundle in (self.original, self.baseline):
            (bundle / 'Data').mkdir(parents=True)
            (bundle / 'config.plist').write_bytes(plistlib.dumps(policy.EXPECTED))
            for rel in h.FILES[1:]:
                (bundle / rel).write_bytes(b'synthetic non-VM payload: ' + rel.encode())
        self.hashes = {p: hashlib.sha256((self.baseline / p).read_bytes()).hexdigest() for p in h.FILES}
        self.previous_value = {'status': 'copied_and_hash_verified', 'source': str(self.original),
                               'target': str(self.baseline), 'files': [
                                   {'path': p, 'sha256': self.hashes[p], 'bytes': (self.baseline / p).stat().st_size,
                                    'copy_hash_matches': True} for p in h.FILES]}
        self.previous.write_text(json.dumps(self.previous_value))
        self.previous_hash = hashlib.sha256(self.previous.read_bytes()).hexdigest()
        self.now = dt.datetime(2026, 10, 25, 13, 50, tzinfo=dt.timezone.utc)
        self.ui_value = {'schema_version': 1, 'original_vm': c.ORIGINAL_NAME, 'original_uuid': c.ORIGINAL_UUID,
                         'clone_vm': c.CLONE_NAME, 'clone_uuid': c.CLONE_UUID,
                         'original_config_sha256': self.hashes['config.plist'],
                         'baseline_config_sha256': self.hashes['config.plist'],
                         'original_observed_state': 'running_locked', 'baseline_not_running_confirmed': True,
                         'network_absent': True, 'sharing_disabled': True,
                         'observed_utc': (self.now - dt.timedelta(seconds=20)).isoformat()}
        self.ui.write_text(json.dumps(self.ui_value))
        self.commands = []
        self.hook = None
        self.free = 400 * 1024 ** 3
        self.original_before = {p: h.file_state(self.original / p) for p in h.FILES}
        self.baseline_before = {p: h.file_state(self.baseline / p) for p in h.FILES}

    def runner(self, argv, **kwargs):
        self.commands.append(argv)
        if self.hook:
            value = self.hook(argv)
            if value is not None:
                return value
        if argv[0] == '/usr/sbin/lsof':
            return subprocess.CompletedProcess(argv, 1, '', '')
        if argv[:3] == ['/bin/cp', '-c', '-n']:
            shutil.copyfile(argv[-2], argv[-1])
            return subprocess.CompletedProcess(argv, 0, '', '')
        if argv[:2] == ['/bin/chmod', '-N']:
            return subprocess.CompletedProcess(argv, 0, '', '')
        if argv[0] == c.QEMU_IMG:
            return subprocess.CompletedProcess(argv, 0, '[{"format":"qcow2"}]', '')
        raise AssertionError('Unexpected command ' + repr(argv))

    def build(self, apply=False):
        return c.build(h, policy, self.original, self.baseline, self.target, self.ui, self.receipt,
                       self.hashes, self.previous, self.previous_hash, apply=apply,
                       runner=self.runner, disk_usage=lambda p: SimpleNamespace(free=self.free), now=self.now)

    def test_preflight_has_no_output_or_copy_and_checks_both_sources(self):
        result = self.build()
        self.assertEqual(result['status'], 'preflight_passed')
        self.assertFalse(self.target.exists())
        self.assertFalse(self.receipt.exists())
        self.assertFalse(any(x[0] in ('/bin/cp', '/bin/chmod') for x in self.commands))
        self.assertEqual(sum(x[0] == c.QEMU_IMG for x in self.commands), 4)
        self.assertFalse(any(str(self.original / p) in x for x in self.commands for p in h.FILES))
        self.assertTrue(any(str(self.baseline / 'config.plist') in x for x in self.commands))

    def test_valid_clone_has_only_identity_changes_independent_private_files(self):
        result = self.build(True)
        self.assertEqual(result['status'], 'clone_copied_and_verified')
        self.assertFalse(result['registered_or_started'])
        self.assertFalse(result['login_attempted'])
        self.assertEqual(result['boot_validation'], 'not run')
        config = plistlib.loads((self.target / 'config.plist').read_bytes())
        self.assertEqual(config['Information']['Name'], c.CLONE_NAME)
        self.assertEqual(config['Information']['UUID'], c.CLONE_UUID)
        config['Information']['Name'] = c.ORIGINAL_NAME
        config['Information']['UUID'] = c.ORIGINAL_UUID
        self.assertEqual(config, policy.EXPECTED)
        for rel in h.FILES:
            self.assertEqual(h.file_state(self.original / rel), self.original_before[rel])
            self.assertEqual(h.file_state(self.baseline / rel), self.baseline_before[rel])
            self.assertNotEqual((self.target / rel).stat().st_ino, (self.baseline / rel).stat().st_ino)
            self.assertEqual(stat.S_IMODE((self.target / rel).stat().st_mode), 0o600)
            if rel != 'config.plist':
                self.assertEqual((self.target / rel).read_bytes(), (self.baseline / rel).read_bytes())
        self.assertEqual(stat.S_IMODE(self.target.stat().st_mode), 0o700)
        self.assertEqual({p.name for p in self.target.iterdir()}, {'config.plist', 'Data'})

    def test_existing_target_and_dangling_receipt_are_never_replaced(self):
        self.target.mkdir()
        with self.assertRaises(h.Stop): self.build(True)
        self.target.rmdir()
        self.receipt.symlink_to(self.root / 'not-created')
        with self.assertRaises(h.Stop): self.build(True)
        self.assertFalse((self.root / 'not-created').exists())

    def test_source_links_extra_files_and_linked_ancestors_rejected(self):
        p = self.baseline / h.FILES[-1]
        real = self.root / 'real-tpm'
        p.rename(real); p.symlink_to(real)
        with self.assertRaises(h.Stop): self.build(True)
        p.unlink(); real.rename(p)
        (self.baseline / 'unexpected').write_text('extra')
        with self.assertRaises(h.Stop): self.build(True)
        (self.baseline / 'unexpected').unlink()
        real_parent = self.root / 'real-baselines'
        self.baseline.parent.rename(real_parent)
        self.baseline.parent.symlink_to(real_parent, target_is_directory=True)
        with self.assertRaises(h.Stop): self.build(True)
        self.assertFalse(self.target.exists())

    def test_hardlinked_baseline_or_payload_rejected(self):
        p = self.baseline / h.FILES[1]
        p.unlink(); os.link(self.original / h.FILES[1], p)
        with self.assertRaises(h.Stop): self.build(True)
        self.assertFalse(self.target.exists())

    def test_stale_false_wrong_or_ambiguous_ui_receipt_rejected(self):
        for change in ({'original_observed_state': 'assumed_stopped'}, {'baseline_not_running_confirmed': False},
                       {'original_observed_state': True}, {'clone_uuid': c.ORIGINAL_UUID},
                       {'network_absent': False}, {'sharing_disabled': False},
                       {'observed_utc': (self.now - dt.timedelta(seconds=601)).isoformat()},
                       {'observed_utc': (self.now + dt.timedelta(seconds=1)).isoformat()},
                       {'observed_utc': None}):
            self.ui.write_text(json.dumps(dict(self.ui_value, **change)))
            with self.subTest(change=change), self.assertRaises(h.Stop): self.build(True)
            self.assertFalse(self.target.exists())
        self.ui.write_text('{"schema_version":1,"schema_version":1}')
        with self.assertRaises(h.Stop): self.build(True)

    def test_baseline_open_or_lsof_uncertain_rejected(self):
        for failing in (self.baseline,):
            for code, out, err in ((0, '123', ''), (1, '', 'denied'), (2, '', '')):
                self.hook = lambda a: subprocess.CompletedProcess(a, code, out, err) if a[0].endswith('lsof') and str(failing / 'config.plist') in a else None
                with self.subTest(failing=failing, code=code), self.assertRaises(h.Stop): self.build(True)
                self.assertFalse(self.target.exists())

    def test_v8_receipt_hash_or_inventory_tampering_rejected(self):
        self.previous.write_text(self.previous.read_text() + ' ')
        with self.assertRaises(h.Stop): self.build(True)
        self.previous_value['files'][0]['sha256'] = '0' * 64
        self.previous.write_text(json.dumps(self.previous_value))
        self.previous_hash = hashlib.sha256(self.previous.read_bytes()).hexdigest()
        with self.assertRaises(h.Stop): self.build(True)

    def test_baseline_content_hash_change_stops_before_copy(self):
        (self.baseline / h.FILES[-1]).write_bytes(b'changed synthetic TPM')
        with self.assertRaises(h.Stop): self.build(True)
        self.assertFalse(self.target.exists())

    def test_backing_chain_external_data_and_tool_failure_rejected(self):
        for data in ('[{"format":"qcow2","backing-filename":"other"}]',
                     '[{"format":"qcow2"},{"format":"qcow2"}]',
                     '[{"format":"qcow2","format-specific":{"data":{"data-file":"external"}}}]',
                     '[{"format":"raw"}]', 'not json'):
            self.hook = lambda a: subprocess.CompletedProcess(a, 0, data, '') if a[0] == c.QEMU_IMG else None
            with self.subTest(data=data), self.assertRaises((h.Stop, ValueError)): self.build(True)
            self.assertFalse(self.target.exists())

    def test_full_copy_space_reserve_required(self):
        self.free = sum(x[2] for x in self.baseline_before.values()) + h.RESERVE - 1
        with self.assertRaises(h.Stop): self.build(True)
        self.assertFalse(self.target.exists())

    def test_identity_normalization_rejects_every_other_config_change(self):
        config = plistlib.loads(c.clone_config(h, policy, plistlib.dumps(policy.EXPECTED)))
        for mutate in (lambda d:d['Network'].append({'Mode':'Shared'}),
                       lambda d:d['Sharing'].update(ClipboardSharing=True),
                       lambda d:d['QEMU'].update(TPMDevice=False),
                       lambda d:d['Information'].update(Notes='changed'),
                       lambda d:d['Drive'][0].update(ImageName='/outside.qcow2'),
                       lambda d:d['Information'].update(UUID=c.ORIGINAL_UUID)):
            changed = copy.deepcopy(config); mutate(changed)
            with self.assertRaises(h.Stop): c.check_clone_config(h, policy, changed)

    def test_partial_copy_failure_remains_and_cannot_be_retried(self):
        n = 0
        def hook(a):
            nonlocal n
            if a[0] == '/bin/cp':
                n += 1
                if n == 2: return subprocess.CompletedProcess(a, 1, '', 'copy failed')
        self.hook = hook
        with self.assertRaises(h.Stop): self.build(True)
        self.assertTrue((self.target / 'config.plist').exists())
        self.assertFalse(self.receipt.exists())
        with self.assertRaises(h.Stop): self.build(True)

    def test_corrupt_copy_is_rejected(self):
        def hook(a):
            if a[0] == '/bin/cp':
                Path(a[-1]).write_bytes(b'corrupt')
                return subprocess.CompletedProcess(a, 0, '', '')
        self.hook = hook
        with self.assertRaises(h.Stop): self.build(True)
        self.assertFalse(self.receipt.exists())

    def test_baseline_change_during_copy_is_rejected(self):
        def hook(a):
            if a[0] == '/bin/cp':
                shutil.copyfile(a[-2], a[-1])
                Path(a[-2]).write_bytes(Path(a[-2]).read_bytes() + b'source changed')
                return subprocess.CompletedProcess(a, 0, '', '')
        self.hook = hook
        with self.assertRaises(h.Stop): self.build(True)
        self.assertFalse(self.receipt.exists())

    def test_original_config_change_during_clone_is_not_accepted(self):
        def hook(a):
            if a[0] == '/bin/cp':
                (self.original / 'config.plist').write_bytes(b'concurrent config change')
        self.hook = hook
        with self.assertRaises(h.Stop): self.build(True)
        self.assertFalse(self.receipt.exists())

    def test_running_original_mutable_writes_do_not_block_or_get_hashed(self):
        reads = []
        read = h.read_regular
        def observed_read(path, *args, **kwargs):
            reads.append(Path(path))
            return read(path, *args, **kwargs)
        def hook(a):
            if a[0] == '/usr/sbin/lsof' and str(self.original / 'config.plist') in a:
                return subprocess.CompletedProcess(a, 0, 'original-running', '')
            if a[0] == '/bin/cp':
                for relative in (h.FILES[1], h.FILES[5], h.FILES[6]):
                    with (self.original / relative).open('ab') as stream: stream.write(b'normal guest write')
        self.hook = hook
        with patch.object(h, 'read_regular', side_effect=observed_read):
            result = self.build(True)
        self.assertEqual(result['status'], 'clone_copied_and_verified')
        self.assertFalse(result['original_mutable_file_contents_accessed'])
        self.assertTrue(result['original_mutable_state_not_claimed_unchanged'])
        self.assertTrue(result['baseline_unchanged'])
        self.assertFalse(any(self.original in p.parents for p in reads))
        self.assertFalse(any(str(self.original / p) in a for a in self.commands for p in h.FILES))

    def test_cross_named_source_dependency_is_rejected(self):
        path = self.baseline / h.FILES[-1]
        path.unlink()
        os.link(self.original / h.FILES[-2], path)
        with self.assertRaises(h.Stop): self.build(True)
        self.assertFalse(self.target.exists())

    def test_clone_cannot_hardlink_original_or_baseline_under_another_name(self):
        original_mode = stat.S_IMODE((self.original / h.FILES[-1]).stat().st_mode)
        def hook(a):
            if a[0] == '/bin/cp':
                os.link(self.original / h.FILES[-1], a[-1])
                return subprocess.CompletedProcess(a, 0, '', '')
        self.hook = hook
        with self.assertRaises(h.Stop): self.build(True)
        self.assertFalse(self.receipt.exists())
        self.assertEqual(stat.S_IMODE((self.original / h.FILES[-1]).stat().st_mode), original_mode)

    def test_new_clone_started_before_acceptance_is_rejected(self):
        self.hook = lambda a: subprocess.CompletedProcess(a, 0, '4321', '') if a[0].endswith('lsof') and str(self.target / 'config.plist') in a else None
        with self.assertRaises(h.Stop): self.build(True)
        self.assertFalse(self.receipt.exists())

    def test_acl_failure_leaves_no_success_receipt(self):
        self.hook = lambda a: subprocess.CompletedProcess(a, 1, '', 'ACL failure') if a[0] == '/bin/chmod' else None
        with self.assertRaises(h.Stop): self.build(True)
        self.assertTrue(self.target.exists())
        self.assertFalse(self.receipt.exists())

    def test_space_falling_during_copy_leaves_partial_clone(self):
        def hook(a):
            if a[0] == '/bin/cp': self.free = h.RESERVE - 1
        self.hook = hook
        with self.assertRaises(h.Stop): self.build(True)
        self.assertTrue(self.target.exists())
        self.assertFalse(self.receipt.exists())

    def test_destination_change_after_hash_is_rejected(self):
        def hook(a):
            if a[0] == c.QEMU_IMG and self.target in Path(a[-1]).parents:
                (self.target / h.FILES[-1]).write_bytes(b'changed after hash')
        self.hook = hook
        with self.assertRaises(h.Stop): self.build(True)
        self.assertFalse(self.receipt.exists())

    def test_target_cannot_redirect_to_protected_source(self):
        for target in (self.original, self.baseline, self.root / 'unapproved.utm'):
            self.target = target
            with self.assertRaises(h.Stop): self.build(True)
        self.assertEqual(h.file_state(self.original / 'config.plist'), self.original_before['config.plist'])
        self.assertEqual(h.file_state(self.baseline / 'config.plist'), self.baseline_before['config.plist'])

    def test_fixed_operator_paths_preserve_original_and_baseline(self):
        self.assertEqual(c.TARGET.parent, c.ORIGINAL.parent)
        self.assertNotEqual(c.TARGET, c.BASELINE)
        self.assertNotEqual(c.TARGET, c.ORIGINAL)
        self.assertNotEqual(c.CLONE_UUID, c.ORIGINAL_UUID)
        self.assertEqual(len(c.EXPECTED_HASHES), 7)
        self.assertEqual(c.EXPECTED_HASHES['config.plist'], policy.V7_CONFIG_SHA256)


if __name__ == '__main__':
    unittest.main()
