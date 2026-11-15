"""Synthetic files and adversarial configurations; never opens a real VM disk."""
import copy
import importlib.util
import json
import os
from pathlib import Path
import plistlib
import tempfile
import unittest
from unittest.mock import patch

SPEC = importlib.util.spec_from_file_location("moli_offline_four_drive_v7", Path(__file__).with_name("verify_offline_four_drive.py"))
audit = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(audit)


class OfflineFourDriveTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.root = Path(self.temp.name)
        self.bundle = self.root / "synthetic.utm"
        (self.bundle / "Data").mkdir(parents=True)
        for name in audit.INTERNAL_FILES:
            (self.bundle / "Data" / name).write_bytes(b"original synthetic contents, not a VM image")
        self.config = copy.deepcopy(audit.EXPECTED)
        self.save(self.config)

    def save(self, config, fmt=plistlib.FMT_XML):
        (self.bundle / "config.plist").write_bytes(plistlib.dumps(config, fmt=fmt))

    def rejected(self, expected_check=None):
        result = audit.verify(self.bundle)
        self.assertFalse(result["passed"])
        self.assertLess(len(json.dumps(result)), 16384)
        if expected_check:
            self.assertIn(expected_check, result["failed_checks"])
        return result

    def test_valid_config_opens_only_bounded_plist_and_never_guest_payloads(self):
        for fmt in (plistlib.FMT_XML, plistlib.FMT_BINARY):
            with self.subTest(fmt=fmt):
                self.save(self.config, fmt)
                with patch.object(audit.os, "open", wraps=os.open) as opened:
                    result = audit.verify(self.bundle)
                self.assertTrue(result["passed"], result["failed_checks"])
                self.assertEqual([call.args[0] for call in opened.call_args_list], [self.bundle / "config.plist"])
                self.assertEqual(len(result["disk_metadata"]), 4)
                self.assertNotIn("original synthetic contents", json.dumps(result))

    def test_network_modes_and_ports_cannot_pass_as_offline(self):
        for mode in ("Shared", "Bridged", "Host", "Emulated"):
            for forwards in ([], [{"Protocol": "TCP", "HostPort": 5900, "GuestPort": 5900}]):
                with self.subTest(mode=mode, forwards=forwards):
                    config = copy.deepcopy(self.config)
                    config["Network"] = [{"Hardware": "virtio-net-pci", "Mode": mode,
                                           "IsolateFromHost": True, "PortForward": forwards}]
                    self.save(config)
                    self.rejected("config.Network")

    def test_host_access_and_security_changes_rejected(self):
        cases = [("Sharing", "ClipboardSharing", True), ("Sharing", "DirectoryShareMode", "VirtFS"),
                 ("Sharing", "DirectorySharePath", "/Users/example"), ("Input", "UsbSharing", True),
                 ("QEMU", "AdditionalArguments", ["-nic", "user"]), ("QEMU", "UEFIBoot", False),
                 ("QEMU", "TPMDevice", False), ("System", "Architecture", "x86_64")]
        for section, key, value in cases:
            with self.subTest(section=section, key=key):
                config = copy.deepcopy(self.config)
                config[section][key] = value
                self.save(config)
                self.rejected("config." + section)

    def test_external_replaced_reordered_and_writable_drives_rejected(self):
        for index in range(4):
            for path in ("/tmp/foreign.qcow2", "../foreign.qcow2", "file:///tmp/foreign.qcow2", "foreign.qcow2"):
                with self.subTest(index=index, path=path):
                    config = copy.deepcopy(self.config)
                    config["Drive"][index]["ImageName"] = path
                    self.save(config)
                    self.rejected("config.Drive")
        for index in (1, 2, 3):
            config = copy.deepcopy(self.config)
            config["Drive"][index]["ReadOnly"] = False
            self.save(config)
            self.rejected("config.Drive")
        mutations = [lambda c: c["Drive"].append(copy.deepcopy(c["Drive"][0])),
                     lambda c: c["Drive"].reverse(), lambda c: c["Drive"].pop(),
                     lambda c: c["Drive"][0].update({"Interface": "VirtIO"}),
                     lambda c: c["Drive"][2].update({"ImageType": "Disk"}),
                     lambda c: c["Drive"][0].update({"Identifier": "replacement"}),
                     lambda c: c["Drive"][0].update({"Bookmark": b"unexpected external reference"})]
        for mutate in mutations:
            config = copy.deepcopy(self.config)
            mutate(config)
            self.save(config)
            self.rejected("config.Drive")

    def test_closed_schema_unknown_missing_types_and_identity(self):
        for mutate, failure in [
            (lambda c: c.update({"UnknownDevice": {}}), "config.known_root_keys"),
            (lambda c: c.pop("Sharing"), "config.known_root_keys"),
            (lambda c: c["Input"].update({"UsbSharing": 0}), "config.Input"),
            (lambda c: c["Drive"][2].update({"ReadOnly": 1}), "config.Drive"),
            (lambda c: c.update({"Network": {}}), "config.Network"),
            (lambda c: c.update({"Sound": [{}]}), "config.Sound"),
            (lambda c: c.update({"Serial": [{}]}), "config.Serial"),
            (lambda c: c["Display"].append(copy.deepcopy(c["Display"][0])), "config.Display"),
            (lambda c: c["Information"].update({"UUID": "other-vm"}), "config.Information"),
            (lambda c: c["Information"].update({"Notes": "unreviewed delta"}), "config.Information"),
        ]:
            config = copy.deepcopy(self.config)
            mutate(config)
            self.save(config)
            self.rejected(failure)

    def test_leaf_directory_config_and_payload_links_rejected(self):
        for rel in ("config.plist", "Data", *["Data/" + name for name in audit.INTERNAL_FILES]):
            with self.subTest(rel=rel):
                target = self.bundle / rel
                saved = self.root / (target.name + ".saved")
                target.rename(saved)
                target.symlink_to(saved, target_is_directory=saved.is_dir())
                self.rejected()
                target.unlink()
                saved.rename(target)
        alias = self.root / "alias.utm"
        alias.symlink_to(self.bundle, target_is_directory=True)
        self.assertFalse(audit.verify(alias)["passed"])
        for rel in ("config.plist", "Data/" + audit.SYSTEM_NAME):
            extra = self.root / "hardlink"
            os.link(self.bundle / rel, extra)
            self.rejected()
            extra.unlink()

    def test_extra_missing_and_nonregular_files_rejected(self):
        extra = self.bundle / "Data" / "unexpected-image.qcow2"
        extra.write_bytes(b"synthetic")
        self.rejected("Data.exact_internal_files")
        extra.unlink()
        target = self.bundle / "Data" / audit.DRIVER_CD_NAME
        target.unlink()
        self.rejected("Data.exact_internal_files")
        target.mkdir()
        self.rejected("Data.netkvm_readonly_cd.regular_single_link")

    def test_malformed_oversized_ambiguous_and_nonregular_config(self):
        path = self.bundle / "config.plist"
        for raw in (b"not a plist", b"bplist00", b"x" * (audit.LIMIT + 1),
                    b'<plist><dict><key>Network</key><array/><key>Network</key><array/></dict></plist>'):
            with self.subTest(length=len(raw)):
                path.write_bytes(raw)
                self.rejected("config.bounded_regular_unambiguous_plist")
        path.write_bytes(plistlib.dumps(["not a root dict"]))
        self.rejected("config.known_root_keys")
        path.unlink()
        os.mkfifo(path)
        self.rejected("config.bounded_regular_unambiguous_plist")

    def test_replaced_config_between_stat_and_open_is_rejected(self):
        path = self.bundle / "config.plist"
        replacement = self.root / "replacement.plist"
        replacement.write_bytes(path.read_bytes())
        real_open = os.open
        def swap_before_open(name, flags):
            os.replace(replacement, path)
            return real_open(name, flags)
        with patch.object(audit.os, "open", side_effect=swap_before_open):
            self.rejected("config.bounded_regular_unambiguous_plist")

    def test_guest_file_growth_is_metadata_not_a_false_integrity_claim(self):
        for name in audit.INTERNAL_FILES:
            (self.bundle / "Data" / name).write_bytes(b"synthetic growing state" * 40)
        result = audit.verify(self.bundle)
        self.assertTrue(result["passed"], result["failed_checks"])
        self.assertNotIn("disk_sha256", result)

    def test_three_drive_layout_does_not_satisfy_new_policy(self):
        config = copy.deepcopy(self.config)
        config["Drive"].pop()
        self.save(config)
        (self.bundle / "Data" / audit.BASE_DRIVER_CD_NAME).unlink()
        result = self.rejected("config.Drive")
        self.assertIn("Data.exact_internal_files", result["failed_checks"])

    def test_new_cd_must_keep_exact_identity_role_and_no_extra_reference(self):
        for change in ({"Identifier": "another-cd"}, {"ReadOnly": False}, {"ReadOnly": 1},
                       {"ImageType": "Disk"}, {"Interface": "NVMe"},
                       {"ImageName": "../outside.qcow2"}, {"ExternalURL": "/tmp/outside.iso"}):
            with self.subTest(change=change):
                config = copy.deepcopy(self.config)
                config["Drive"][3].update(change)
                self.save(config)
                self.rejected("config.Drive")


if __name__ == "__main__":
    unittest.main()
