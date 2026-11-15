"""Synthetic-only cold-copy tests; no real VM, lsof, cp, chmod, or UI actions."""
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
import unittest
from types import SimpleNamespace
from unittest.mock import patch

SCRIPT = Path(__file__).with_name('create_cold_baseline.py')
SPEC = importlib.util.spec_from_file_location('moli_cold_v7', SCRIPT)
cold = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(cold)
POLICY_SPEC = importlib.util.spec_from_file_location(
    'moli_offline_v7_for_synthetic_tests', Path(__file__).with_name('verify_offline_four_drive.py'))
policy = importlib.util.module_from_spec(POLICY_SPEC)
POLICY_SPEC.loader.exec_module(policy)


class ColdBaselineTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.root = Path(self.temp.name).resolve()
        self.source = self.root / (cold.VM_NAME + '.utm')
        (self.source / 'Data').mkdir(parents=True)
        (self.root / 'baselines').mkdir()
        self.target = self.root / 'baselines' / (cold.VM_NAME + '-windows-v7.utm')
        self.ui = self.root / 'ui.json'
        self.receipt = self.root / 'result.json'
        for rel in cold.FILES[1:]:
            (self.source / rel).write_bytes(b'original synthetic non-VM file: ' + rel.encode())
        (self.source / 'config.plist').write_bytes(plistlib.dumps(policy.EXPECTED))
        (self.source / 'screenshot.png').write_bytes(b'private synthetic thumbnail; MUST NOT BE COPIED')
        self.now = dt.datetime(2026, 10, 25, 10, 0, tzinfo=dt.timezone.utc)
        self.binding = {'schema_version': 1, 'vm': cold.VM_NAME, 'uuid': cold.VM_UUID,
                        'observed_utc': (self.now - dt.timedelta(seconds=20)).isoformat(),
                        'normal_shutdown_confirmed': True, 'network_absent': True,
                        'sharing_disabled': True, 'config_sha256': policy.verify(self.source)['config_sha256']}
        self.ui.write_text(json.dumps(self.binding))
        self.commands = []
        self.hook = None
        self.free = 400 * 1024 ** 3
        self.source_before = {name: cold.file_state(self.source / name) for name in cold.FILES}

    def runner(self, argv, **kwargs):
        self.commands.append(argv)
        if self.hook:
            result = self.hook(argv)
            if result is not None:
                return result
        if argv[0] == '/usr/sbin/lsof':
            return subprocess.CompletedProcess(argv, 1, '', '')
        if argv[:3] == ['/bin/cp', '-c', '-n']:
            shutil.copyfile(argv[-2], argv[-1])
            return subprocess.CompletedProcess(argv, 0, '', '')
        if argv[:2] == ['/bin/chmod', '-N']:
            return subprocess.CompletedProcess(argv, 0, '', '')
        raise AssertionError('Unexpected synthetic command: ' + str(argv))

    def build(self, apply=False, **kwargs):
        return cold.build(self.source, self.target, self.ui, self.receipt, policy,
                          apply=apply, runner=self.runner,
                          disk_usage=lambda path: SimpleNamespace(free=self.free), now=self.now, **kwargs)

    def test_default_preflight_does_not_copy_or_write_outputs(self):
        result = self.build()
        self.assertEqual(result['status'], 'preflight_passed')
        self.assertFalse(self.target.exists())
        self.assertFalse(self.receipt.exists())
        self.assertEqual(len(self.commands), 1)
        self.assertEqual(self.commands[0][:2], ['/usr/sbin/lsof', '-t'])

    def test_valid_copy_contains_exact_seven_files_private_modes_and_no_thumbnail(self):
        result = self.build(apply=True)
        self.assertEqual(result['status'], 'copied_and_hash_verified')
        self.assertEqual(len(result['files']), 7)
        copied = {str(p.relative_to(self.target)) for p in self.target.rglob('*') if p.is_file()}
        self.assertEqual(copied, set(cold.FILES))
        self.assertFalse((self.target / 'screenshot.png').exists())
        for name in cold.FILES:
            self.assertEqual((self.source / name).read_bytes(), (self.target / name).read_bytes())
            self.assertEqual(stat.S_IMODE((self.target / name).stat().st_mode), 0o600)
            self.assertEqual(cold.file_state(self.source / name), self.source_before[name])
        self.assertEqual(stat.S_IMODE(self.target.stat().st_mode), 0o700)
        self.assertEqual(stat.S_IMODE((self.target / 'Data').stat().st_mode), 0o700)
        self.assertEqual(stat.S_IMODE(self.receipt.stat().st_mode), 0o600)
        self.assertEqual(result['restore_boot_test'], 'not run')
        self.assertIn('may fall back', result['method'])
        self.assertFalse(result['registered_or_started_copy'])
        self.assertEqual(sum(c[:2] == ['/usr/sbin/lsof', '-t'] for c in self.commands), 2)
        chmod_targets = [Path(c[-1]) for c in self.commands if c[0] == '/bin/chmod']
        self.assertTrue(all(p == self.receipt or p == self.target or self.target in p.parents for p in chmod_targets))

    def test_shutdown_receipt_bindings_and_freshness_are_required(self):
        mutations = [dict(vm='other-vm'), dict(uuid='other-uuid'), dict(config_sha256='0' * 64),
                     dict(normal_shutdown_confirmed=False), dict(normal_shutdown_confirmed=1),
                     dict(network_absent=False), dict(sharing_disabled=False), dict(schema_version=True),
                     dict(observed_utc=(self.now - dt.timedelta(seconds=601)).isoformat()),
                     dict(observed_utc=(self.now + dt.timedelta(seconds=1)).isoformat()),
                     dict(observed_utc='2026-10-25T09:59:40'), dict(observed_utc=None)]
        for delta in mutations:
            with self.subTest(delta=delta):
                self.ui.write_text(json.dumps(dict(self.binding, **delta)))
                with self.assertRaises((cold.Stop, ValueError)):
                    self.build(apply=True)
                self.assertFalse(self.target.exists())
        self.ui.write_text('{"vm":"one","vm":"two"}')
        with self.assertRaises(cold.Stop):
            self.build(apply=True)

    def test_existing_outputs_and_dangling_receipt_never_overwritten(self):
        self.target.mkdir()
        with self.assertRaises(cold.Stop):
            self.build(apply=True)
        self.target.rmdir()
        self.receipt.symlink_to(self.root / 'absent-private-file')
        with self.assertRaises(cold.Stop):
            self.build(apply=True)
        self.assertTrue(self.receipt.is_symlink())
        self.assertFalse((self.root / 'absent-private-file').exists())

    def test_network_extra_data_and_source_links_rejected_before_copy(self):
        config = copy.deepcopy(policy.EXPECTED)
        config['Network'] = [{'Mode': 'Shared'}]
        (self.source / 'config.plist').write_bytes(plistlib.dumps(config))
        with self.assertRaises(cold.Stop):
            self.build(apply=True)
        (self.source / 'config.plist').write_bytes(plistlib.dumps(policy.EXPECTED))
        extra = self.source / 'Data/unexpected.qcow2'
        extra.write_bytes(b'synthetic')
        with self.assertRaises(cold.Stop):
            self.build(apply=True)
        extra.unlink()
        real = self.source / cold.FILES[1]
        moved = self.root / 'moved'
        real.rename(moved)
        real.symlink_to(moved)
        with self.assertRaises(cold.Stop):
            self.build(apply=True)
        self.assertFalse(self.target.exists())

    def test_open_source_or_lsof_ambiguity_stops(self):
        for code, output, error in [(0, '1234\n', ''), (1, '', 'permission denied'), (2, '', '')]:
            with self.subTest(code=code, output=output, error=error):
                self.hook = lambda argv: subprocess.CompletedProcess(argv, code, output, error) if argv[0].endswith('lsof') else None
                with self.assertRaises(cold.Stop):
                    self.build(apply=True)
                self.assertFalse(self.target.exists())

    def test_space_budget_includes_full_fallback_and_reserve(self):
        total = sum((self.source / p).stat().st_size for p in cold.FILES)
        self.free = cold.RESERVE + total - 1
        with self.assertRaises(cold.Stop):
            self.build(apply=True)
        self.assertFalse(self.target.exists())

    def test_partial_copy_failure_is_retained_without_success_receipt(self):
        calls = 0
        def fail_second(argv):
            nonlocal calls
            if argv[0] == '/bin/cp':
                calls += 1
                if calls == 2:
                    return subprocess.CompletedProcess(argv, 1, '', 'synthetic copy failure')
            return None
        self.hook = fail_second
        with self.assertRaises(cold.Stop):
            self.build(apply=True)
        self.assertTrue((self.target / 'config.plist').exists())
        self.assertFalse(self.receipt.exists())
        with self.assertRaises(cold.Stop):
            self.build(apply=True)

    def test_copy_corruption_and_source_change_are_rejected(self):
        def corrupt(argv):
            if argv[0] == '/bin/cp':
                Path(argv[-1]).write_bytes(b'corrupt synthetic output')
                return subprocess.CompletedProcess(argv, 0, '', '')
            return None
        self.hook = corrupt
        with self.assertRaisesRegex(cold.Stop, 'hash mismatch'):
            self.build(apply=True)
        self.assertFalse(self.receipt.exists())

    def test_source_restart_or_write_during_copy_stops_acceptance(self):
        seen = 0
        def restart(argv):
            nonlocal seen
            if argv[0] == '/usr/sbin/lsof':
                seen += 1
                if seen == 2:
                    return subprocess.CompletedProcess(argv, 0, '4321', '')
            return None
        self.hook = restart
        with self.assertRaisesRegex(cold.Stop, 'Source file is open'):
            self.build(apply=True)
        self.assertFalse(self.receipt.exists())

    def test_source_changed_by_concurrent_writer_is_not_accepted(self):
        def source_write(argv):
            if argv[0] == '/bin/cp':
                shutil.copyfile(argv[-2], argv[-1])
                Path(argv[-2]).write_bytes(Path(argv[-2]).read_bytes() + b'concurrent synthetic change')
                return subprocess.CompletedProcess(argv, 0, '', '')
            return None
        self.hook = source_write
        with self.assertRaisesRegex(cold.Stop, 'Source changed'):
            self.build(apply=True)
        self.assertFalse(self.receipt.exists())

    def test_receipt_creation_is_exclusive(self):
        self.receipt.write_text('preserve me')
        with self.assertRaises(FileExistsError):
            cold.write_new_receipt(self.receipt, {'new': 'must not replace'}, self.runner)
        self.assertEqual(self.receipt.read_text(), 'preserve me')

    def test_space_falling_during_copy_leaves_no_success_receipt(self):
        def low_space(argv):
            if argv[0] == '/bin/cp':
                self.free = cold.RESERVE - 1
            return None
        self.hook = low_space
        with self.assertRaisesRegex(cold.Stop, 'reserve'):
            self.build(apply=True)
        self.assertTrue(self.target.exists())
        self.assertFalse(self.receipt.exists())

    def test_new_output_acl_failure_stops_without_success_receipt(self):
        self.hook = lambda argv: subprocess.CompletedProcess(argv, 1, '', 'synthetic ACL failure') if argv[0] == '/bin/chmod' else None
        with self.assertRaisesRegex(cold.Stop, 'inherited ACL'):
            self.build(apply=True)
        self.assertTrue(self.target.exists())
        self.assertFalse(self.receipt.exists())

    def test_destination_changed_after_hash_is_rejected(self):
        calls = 0
        def mutate_after_hash(argv):
            nonlocal calls
            if argv[0] == '/usr/sbin/lsof':
                calls += 1
                if calls == 2:
                    (self.target / cold.FILES[1]).write_bytes(b'late synthetic output change')
            return None
        self.hook = mutate_after_hash
        with self.assertRaisesRegex(cold.Stop, 'Destination changed'):
            self.build(apply=True)
        self.assertFalse(self.receipt.exists())

    def test_seventh_file_is_required_and_added_to_lsof_inventory(self):
        new_cd = 'Data/moli-base-drivers-w11-arm64-0.1.274.qcow2'
        self.assertIn(new_cd, cold.FILES)
        self.build()
        self.assertIn(str(self.source / new_cd), self.commands[0])
        (self.source / new_cd).unlink()
        with self.assertRaisesRegex(cold.Stop, 'Data files'):
            self.build(apply=True)
        self.assertFalse(self.target.exists())

    def test_operator_policy_hash_is_exact_and_mismatch_does_not_execute(self):
        expected = Path(__file__).with_name('verify_offline_four_drive.py')
        self.assertEqual(hashlib.sha256(expected.read_bytes()).hexdigest(), cold.POLICY_SHA256)
        bad_policy = self.root / 'bad_policy.py'
        sentinel = self.root / 'must-not-exist'
        bad_policy.write_text('from pathlib import Path\nPath(' + repr(str(sentinel)) + ').touch()\n')
        with patch.object(cold, 'POLICY_PATH', bad_policy):
            with self.assertRaisesRegex(cold.Stop, 'policy code hash changed'):
                cold.load_fixed_policy()
        self.assertFalse(sentinel.exists())


if __name__ == '__main__':
    unittest.main()
