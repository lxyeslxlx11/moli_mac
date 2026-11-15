"""Synthetic-only fixed-configuration tests; no Windows or guest disk content."""
import copy
import importlib.util
import json
from pathlib import Path
import plistlib
import tempfile
import unittest
from unittest.mock import patch

SPEC = importlib.util.spec_from_file_location("verify_media_config", Path(__file__).with_name("verify_media_config.py"))
audit = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(audit)


class MediaConfigTests(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.addCleanup(self.tmp.cleanup)
        self.root = Path(self.tmp.name)
        self.vm = self.root / "original.utm"
        (self.vm / "Data").mkdir(parents=True)
        for name in (audit.SYSTEM_NAME, audit.MEDIA_NAME, "efi_vars.fd", "tpmdata"):
            (self.vm / "Data" / name).write_bytes(b"original synthetic bytes")
        self.baseline = self.root / "before-install.json"
        self.before = {"config_sha256": audit.ORIGINAL_CONFIG_HASH, "disk_basename": audit.SYSTEM_NAME,
                       "disk_sha256": audit.ORIGINAL_SYSTEM_HASH, "disk_bytes": 197888,
                       "system": audit.EXPECTED_SYSTEM, "sharing": audit.EXPECTED_SHARING,
                       "network": [], "usb_sharing": False}
        self.baseline.write_text(json.dumps(self.before))
        self.config = copy.deepcopy(audit.EXPECTED_SECTIONS)
        self.config["Drive"] = copy.deepcopy(audit.EXPECTED_DRIVES)
        self.config["Information"] = {"Name": audit.VM_NAME, "IconCustom": False,
                                      "UUID": "087A27D7-88CC-4E08-8FB7-0FE852DAA3C8", "Notes": "original note"}
        self.save(self.config)

    def save(self, config):
        (self.vm / "config.plist").write_bytes(plistlib.dumps(config))

    def rejected(self):
        result = audit.verify(self.vm, self.baseline)
        self.assertFalse(result["passed"])
        self.assertLess(len(json.dumps(result)), 16384)
        return result

    def test_valid_fixed_policy_opens_only_two_small_config_files(self):
        with patch.object(audit.os, "open", wraps=audit.os.open) as opened:
            result = audit.verify(self.vm, self.baseline)
        self.assertTrue(result["passed"], result["failed_checks"])
        self.assertEqual([call.args[0] for call in opened.call_args_list], [self.baseline, self.vm / "config.plist"])
        self.assertNotIn("original synthetic bytes", json.dumps(result))
        self.assertEqual(len(result["disk_metadata"]), 2)

    def test_media_role_writeability_identity_and_external_reference_rejected(self):
        for key, value in [("ReadOnly", False), ("ReadOnly", 1), ("ImageType", "Disk"),
                           ("Interface", "SCSI"), ("Identifier", "different"),
                           ("ImageName", "/tmp/outside.qcow2"), ("ImageName", "../outside.qcow2")]:
            with self.subTest(key=key, value=value):
                config = copy.deepcopy(self.config)
                config["Drive"][1][key] = value
                self.save(config)
                self.rejected()
        config = copy.deepcopy(self.config)
        config["Drive"][0]["Identifier"] = "replacement-system"
        self.save(config)
        self.rejected()

    def test_isolation_changes_missing_and_unknown_fields_rejected(self):
        for section, key, value in [(None, "Network", [{"Hardware": "virtio-net-pci"}]),
                                    (None, "Serial", [{}]), (None, "Sound", [{}]),
                                    ("Sharing", "ClipboardSharing", True), ("Sharing", "DirectoryShareMode", "WebDAV"),
                                    ("Input", "UsbSharing", True), ("QEMU", "AdditionalArguments", ["-nic", "user"]),
                                    ("QEMU", "TPMDevice", False), ("System", "MemorySize", 4096),
                                    ("QEMU", "UnknownSharing", True)]:
            with self.subTest(section=section, key=key):
                config = copy.deepcopy(self.config)
                (config if section is None else config[section])[key] = value
                self.save(config)
                self.rejected()
        config = copy.deepcopy(self.config)
        del config["Sharing"]
        self.save(config)
        self.rejected()

    def test_baseline_tamper_links_and_malformed_config_rejected(self):
        before = copy.deepcopy(self.before)
        before["disk_basename"] = "other-user-disk.qcow2"
        self.baseline.write_text(json.dumps(before))
        self.rejected()
        self.baseline.write_text(json.dumps(self.before))
        for relative in ("config.plist", "Data/" + audit.MEDIA_NAME, "Data"):
            with self.subTest(relative=relative):
                path = self.vm / relative
                saved = self.root / (path.name + ".saved")
                path.rename(saved)
                path.symlink_to(saved, target_is_directory=saved.is_dir())
                self.rejected()
                path.unlink()
                saved.rename(path)
        for raw in (b"not a plist", b"x" * (audit.LIMIT + 1)):
            (self.vm / "config.plist").write_bytes(raw)
            self.rejected()


if __name__ == "__main__":
    unittest.main()
