import contextlib
import hashlib
import importlib.util
import io
import json
import os
from pathlib import Path
import shutil
import tempfile
import unittest
from unittest import mock

spec = importlib.util.spec_from_file_location('delivery', '/tmp/deliver_moli_stage16.py')
d = importlib.util.module_from_spec(spec)
spec.loader.exec_module(d)


def sha(data):
    return hashlib.sha256(data).hexdigest()


class DeliveryTests(unittest.TestCase):
    def setUp(self):
        self.base = Path(tempfile.mkdtemp(prefix='moli-delivery-test-', dir='/tmp')).resolve()
        self.stage, self.target = self.base / 'stage', self.base / 'target'
        self.stage.mkdir()
        self.target.mkdir()
        for root in (self.stage, self.target):
            (root / 'analysis').mkdir()
            (root / 'README.md').write_bytes(b'old readme\n')
            (root / 'keep.txt').write_bytes(b'keep\n')
        previous = {'files': [{'path': 'README.md', 'sha256': sha(b'old readme\n')},
                              {'path': 'keep.txt', 'sha256': sha(b'keep\n')}]}
        raw = json.dumps(previous).encode()
        (self.stage / d.PREVIOUS).write_bytes(raw)
        (self.target / d.PREVIOUS).write_bytes(raw)
        self.backups = []

    def tearDown(self):
        for b in self.backups:
            shutil.rmtree(b)
        shutil.rmtree(self.base)

    def run_delivery(self, apply=False):
        output = io.StringIO()
        try:
            with contextlib.redirect_stdout(output):
                return d.run(self.stage, self.target, apply)
        finally:
            for line in output.getvalue().splitlines():
                row = json.loads(line)
                if 'backup' in row:
                    self.backups.append(Path(row['backup']))

    def assert_unpublished(self):
        self.assertFalse((self.stage / d.MANIFEST).exists())
        self.assertFalse((self.target / d.MANIFEST).exists())

    def test_preflight_is_readonly(self):
        (self.stage / 'README.md').write_bytes(b'new\n')
        before = {str(p.relative_to(self.base)): p.read_bytes() for p in self.base.rglob('*') if p.is_file()}
        result = self.run_delivery()
        after = {str(p.relative_to(self.base)): p.read_bytes() for p in self.base.rglob('*') if p.is_file()}
        self.assertEqual(before, after)
        self.assertEqual(result['updated_files'], 1)
        self.assert_unpublished()

    def test_user_deleted_tracked_file_stops(self):
        (self.target / 'keep.txt').unlink()
        with self.assertRaisesRegex(RuntimeError, 'User change or deletion'):
            self.run_delivery(True)
        self.assertFalse((self.target / 'keep.txt').exists())
        self.assert_unpublished()

    def test_user_modified_file_stops(self):
        (self.target / 'README.md').write_bytes(b'user change\n')
        with self.assertRaisesRegex(RuntimeError, 'User change or deletion'):
            self.run_delivery(True)
        self.assertEqual((self.target / 'README.md').read_bytes(), b'user change\n')
        self.assert_unpublished()

    def test_new_file_collision_stops(self):
        (self.stage / 'new.txt').write_bytes(b'agent\n')
        (self.target / 'new.txt').write_bytes(b'user\n')
        with self.assertRaisesRegex(RuntimeError, 'unexpected collision'):
            self.run_delivery(True)
        self.assertEqual((self.target / 'new.txt').read_bytes(), b'user\n')
        self.assert_unpublished()

    def test_new_updated_extra_and_backup(self):
        (self.stage / 'README.md').write_bytes(b'new readme\n')
        (self.stage / 'run.sh').write_bytes(b'#!/bin/sh\nexit 0\n')
        (self.stage / 'run.sh').chmod(0o755)
        (self.target / 'user-extra.txt').write_bytes(b'private user addition\n')
        result = self.run_delivery(True)
        self.assertEqual(result['status'], 'delivered_and_verified')
        self.assertEqual((self.target / 'README.md').read_bytes(), b'new readme\n')
        self.assertEqual((self.target / 'user-extra.txt').read_bytes(), b'private user addition\n')
        self.assertEqual((self.target / 'run.sh').stat().st_mode & 0o777, 0o755)
        self.assertEqual((Path(result['backup']) / 'README.md').read_bytes(), b'old readme\n')
        self.assertEqual((self.stage / d.MANIFEST).read_bytes(), (self.target / d.MANIFEST).read_bytes())

    def test_user_mode_is_preserved_on_updated_file(self):
        (self.target / 'README.md').chmod(0o400)
        (self.stage / 'README.md').write_bytes(b'updated content\n')
        result = self.run_delivery(True)
        self.assertEqual((self.target / 'README.md').stat().st_mode & 0o777, 0o400)
        self.assertEqual((Path(result['backup']) / 'README.md').stat().st_mode & 0o777, 0o400)
        self.assertEqual((self.target / 'README.md').read_bytes(), b'updated content\n')

    def test_target_ancestor_symlink_stops(self):
        (self.stage / 'reports').mkdir()
        (self.stage / 'reports' / 'new.md').write_bytes(b'new\n')
        external = self.base / 'external'
        external.mkdir()
        (self.target / 'reports').symlink_to(external, target_is_directory=True)
        with self.assertRaisesRegex(RuntimeError, 'Symlink component'):
            self.run_delivery(True)
        self.assertEqual(list(external.iterdir()), [])
        self.assert_unpublished()

    def test_source_ancestor_symlink_stops(self):
        external = self.base / 'external'
        external.mkdir()
        (external / 'unexpected.txt').write_bytes(b'outside\n')
        (self.stage / 'reports').symlink_to(external, target_is_directory=True)
        with self.assertRaisesRegex(RuntimeError, 'Symlink component'):
            self.run_delivery(True)
        self.assert_unpublished()

    def test_dangling_destination_symlink_stops(self):
        (self.stage / 'new.txt').write_bytes(b'new\n')
        (self.target / 'new.txt').symlink_to(self.base / 'missing')
        with self.assertRaisesRegex(RuntimeError, 'Symlink component'):
            self.run_delivery(True)
        self.assert_unpublished()

    def test_build_and_private_context_are_pruned(self):
        for rel in ['build/test.iso', '.build/cache', 'native/.build/test.qcow2', '.aws/credentials']:
            p = self.stage / rel
            p.parent.mkdir(parents=True, exist_ok=True)
            p.write_bytes(b'synthetic excluded content')
        self.run_delivery(True)
        paths = {row['path'] for row in json.loads((self.target / d.MANIFEST).read_text())['files']}
        self.assertFalse(any('build' in p or '.aws' in p for p in paths))
        self.assertFalse((self.target / 'build').exists())
        self.assertFalse((self.target / '.aws').exists())

    def test_nonregular_source_stops_without_waiting(self):
        os.mkfifo(self.stage / 'unexpected-pipe')
        with self.assertRaisesRegex(RuntimeError, 'Not an independent regular file'):
            self.run_delivery(True)
        self.assert_unpublished()

    def test_payload_forbidden_extension_stops(self):
        (self.stage / 'misplaced.iso').write_bytes(b'not a real image')
        with self.assertRaisesRegex(RuntimeError, 'Excluded manifest path'):
            self.run_delivery(True)
        self.assert_unpublished()

    def test_malformed_baseline_path_stops(self):
        bad = json.dumps({'files': [{'path': '../outside', 'sha256': '0' * 64}]}).encode()
        (self.stage / d.PREVIOUS).write_bytes(bad)
        with self.assertRaisesRegex(RuntimeError, 'Unsafe manifest path'):
            self.run_delivery(True)
        self.assert_unpublished()

    def test_source_changed_after_preflight_stops(self):
        (self.stage / 'new.txt').write_bytes(b'planned\n')
        original = d.copy_verified
        def change_then_copy(source, destination, expected):
            if source == self.stage / 'new.txt':
                source.write_bytes(b'changed\n')
            return original(source, destination, expected)
        with mock.patch.object(d, 'copy_verified', side_effect=change_then_copy):
            with self.assertRaisesRegex(RuntimeError, 'Source changed'):
                self.run_delivery(True)
        self.assert_unpublished()

    def test_postcopy_verification_failure_does_not_publish(self):
        (self.stage / 'README.md').write_bytes(b'new\n')
        original = d.verify_delivered
        def corrupt_then_verify(target, payload):
            (target / 'README.md').write_bytes(b'corrupt\n')
            return original(target, payload)
        with mock.patch.object(d, 'verify_delivered', side_effect=corrupt_then_verify):
            with self.assertRaisesRegex(RuntimeError, 'Verification failed'):
                self.run_delivery(True)
        self.assert_unpublished()

    def test_manifest_publication_occurs_after_verification(self):
        events = []
        original_verify, original_publish = d.verify_delivered, d.publish_manifest
        def verify(*args):
            original_verify(*args)
            events.append('verified')
        def publish(path, data):
            self.assertTrue(events and events[0] == 'verified')
            events.append(str(path))
            return original_publish(path, data)
        with mock.patch.object(d, 'verify_delivered', side_effect=verify), mock.patch.object(d, 'publish_manifest', side_effect=publish):
            self.run_delivery(True)
        self.assertEqual(events[-1], str(self.target / d.MANIFEST))

    def test_late_manifest_fsync_failure_has_no_published_manifest(self):
        path = self.target / d.MANIFEST
        with mock.patch.object(d.os, 'fsync', side_effect=OSError('synthetic late fsync failure')):
            with self.assertRaisesRegex(OSError, 'synthetic late fsync'):
                d.publish_manifest(path, b'{"status":"success"}')
        self.assertFalse(path.exists())

    def test_second_manifest_failure_is_partial_and_cannot_rerun(self):
        original = d.publish_manifest
        def fail_target(path, data):
            if path == self.target / d.MANIFEST:
                raise OSError('synthetic target publication failure')
            return original(path, data)
        with mock.patch.object(d, 'publish_manifest', side_effect=fail_target):
            with self.assertRaisesRegex(OSError, 'synthetic target publication failure'):
                self.run_delivery(True)
        self.assertTrue((self.stage / d.MANIFEST).exists())
        self.assertFalse((self.target / d.MANIFEST).exists())
        with self.assertRaisesRegex(RuntimeError, 'Stage16 manifest exists'):
            self.run_delivery(True)

    def test_manifest_existing_destination_is_not_overwritten(self):
        path = self.target / d.MANIFEST
        path.write_bytes(b'user existing\n')
        with self.assertRaises(FileExistsError):
            d.publish_manifest(path, b'new\n')
        self.assertEqual(path.read_bytes(), b'user existing\n')

    def test_new_file_concurrent_addition_is_not_overwritten(self):
        (self.stage / 'new.txt').write_bytes(b'planned\n')
        original = d.copy_verified
        def create_target_after_copy(source, destination, expected):
            original(source, destination, expected)
            if source == self.stage / 'new.txt':
                (self.target / 'new.txt').write_bytes(b'concurrent user addition\n')
        with mock.patch.object(d, 'copy_verified', side_effect=create_target_after_copy):
            with self.assertRaises(FileExistsError):
                self.run_delivery(True)
        self.assertEqual((self.target / 'new.txt').read_bytes(), b'concurrent user addition\n')
        self.assert_unpublished()

    def test_repeated_apply_is_refused(self):
        self.run_delivery(True)
        with self.assertRaisesRegex(RuntimeError, 'Stage16 manifest exists'):
            self.run_delivery(True)


if __name__ == '__main__':
    unittest.main(verbosity=2)
