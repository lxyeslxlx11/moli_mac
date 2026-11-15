#!/usr/bin/env python3
"""Bind the fixed launcher preset workflow to retained REA and source bytes.

This is an offline analysis report builder, not a product codec or UI adapter.
Complete dossiers remain in ignored build/analysis; outputs contain metadata.
"""
import hashlib
import json
import struct
from pathlib import Path

from extract_entry_inventory import PE

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / "analysis/capability-first-v1"
PRIVATE = ROOT / "build/analysis/capability-launcher-presets-v1"
PREVIOUS = ROOT / "build/analysis/capability-dispatch-bindings-v1"
SHA = "c82fc98d3d274beadee91254e3343974d7c7fdaf2b2a32bc21cc81b76e85c152"
PROFILE = "7810ea9437da59780820ec6fedb47ce47390841a95d527ddb6c3b3700fe180cb"
TARGET = ROOT / "build/analysis/launcher-current-runtime-v4/POLCN_Launcher.analysis-only.exe"
REUSE = ("422270", "422fc0", "4156c0", "415830", "44ee28", "44f422")


def sha(data):
    return hashlib.sha256(data).hexdigest()


def load(path):
    return json.loads(path.read_text())


def write(name, value):
    (OUT / name).write_text(json.dumps(value, ensure_ascii=False, indent=2) + "\n")


def main():
    pe = PE(TARGET, SHA)
    functions = {}
    bodies = []
    paths = sorted(PRIVATE.glob("launcher-function-*.json"))
    paths += [PREVIOUS / f"launcher-function-{address}.json" for address in REUSE]
    for path in paths:
        d = load(path)
        assert d["subject"]["digest"]["sha256"] == SHA
        assert d["analysis_profile"]["digest"] == PROFILE
        n = d["normalized_result"]
        entry = int(n["procedure"]["address"], 16)
        body = n["procedure"]["body"]
        assert body["available"] and body["contains_entry"]
        ranges = []
        for row in body["ranges"]:
            start, end = int(row["start"], 16), int(row["end"], 16)
            assert start <= end and pe.executable(start) and pe.executable(end)
            blob = pe.read(start, end - start + 1)
            ranges.append({"start": hex(start), "end_inclusive": hex(end),
                           "file_offset": pe.file_offset(start, len(blob)),
                           "bytes": len(blob), "sha256": sha(blob)})
        assert sum(r["bytes"] for r in ranges) == body["total_bytes"]
        functions[f"{entry:x}"] = d
        bodies.append({"procedure": hex(entry), "evidence_id": d["evidence_id"],
                       "retained_dossier": str(path.relative_to(ROOT)),
                       "dossier_sha256": sha(path.read_bytes()), "ranges": ranges,
                       "reused_from_prior_package": path.parent == PREVIOUS})

    anchors = []

    def anchor(proc, claim, *needles):
        d = functions[proc]
        selected = []
        for needle in needles:
            matches = [s for s in d["normalized_result"]["assembly"] if needle in s]
            assert matches, (proc, needle)
            selected.extend(matches)
        anchors.append({"claim": claim, "procedure": "0x" + proc,
                        "evidence_id": d["evidence_id"],
                        "instruction_addresses": sorted({s.split(":", 1)[0] for s in selected})})

    anchor("422270", "copy-dialog-vector-before-modal-and-copy-back-before-result-test",
           "CALL 0x00414f60", "CALL 0x00416cf0", "CMP ESI, 0x1")
    anchor("422270", "apply-selection-only-after-modal-result-one", "CALL 0x00428c00")
    anchor("44f7a0", "default-cancel-ends-modal-with-result-two", "PUSH 0x2", "CALL 0x0044f606")
    anchor("422270", "dialog-flag-pair-initialized-loaded-one-undo-zero",
           "MOV word ptr [EBP + 0xfffffd2d], 0x1")
    anchor("41ec40", "persist-candidate-before-undo-snapshot-and-current-vector-swap",
           "CALL 0x0042a050", "CALL 0x00416cf0", "MOV byte ptr [ESI + 0x17e], 0x1")
    anchor("41ec40", "undo-persists-snapshot-before-clearing-undo-flag",
           "MOV byte ptr [EDI + 0x17e], 0x0")
    anchor("427020", "append-then-persist-then-swap-on-success",
           "CALL 0x0042c730", "CALL 0x00426d00", "MOV BL, 0x1")
    anchor("4228c0", "editor-submit-name-validation-and-duplicate-comparison",
           "CALL 0x00429980", "CALL 0x004295a0", "CALL 0x004294b0", "CALL 0x0044f983")
    anchor("421ce0", "read-only-summary-field-order-and-name-control-limit",
           "MOVAPS XMM0, xmmword ptr [0x005d5ac0]", "PUSH 0x40", "PUSH 0xc5")
    anchor("41b280", "codec-header-and-count-limit", "PUSH 0x3153504c", "CMP EAX, 0x20")
    anchor("419d40", "bounded-field-read-and-final-container-swap",
           "CMP EDI, 0x200", "CALL 0x0042d900")
    anchor("419d40", "decoder-boolean-return-overrides-inferred-void-signature", "MOV AL, BL")
    anchor("426d00", "writer-boolean-return-overrides-inferred-void-signature",
           "MOV AL, byte ptr [EBP + 0xfffffebb]")
    anchor("426d00", "serialization-before-temporary-file-replacement",
           "CALL 0x0041b280", "PUSH 0x80000080", "PUSH 0x9")
    anchor("4195f0", "account-copy-origin-main-field", "PUSH dword ptr [EAX + 0x21fc]")

    data = []

    def datum(address, length, role):
        blob = pe.read(address, length)
        data.append({"role": role, "address": hex(address), "bytes": length,
                     "file_offset": pe.file_offset(address, length), "sha256": sha(blob)})
        return blob

    hooks = []
    for title, vt in (("CDialog", 0x5dbf28), ("Surface", 0x5d36fc),
                      ("Editor", 0x5d3d2c), ("CLaunchPresetDialog", 0x5d4010)):
        slots = {}
        for offset in (0x28, 0xf4, 0x178, 0x180, 0x184):
            value = struct.unpack("<I", datum(vt + offset, 4, f"{title}-slot-{offset:x}"))[0]
            assert pe.executable(value)
            slots[hex(offset)] = hex(value)
        hooks.append({"class": title, "vtable": hex(vt), "selected_slots": slots,
                      "complete_vtable_extent_proven": False})
    assert hooks[2]["selected_slots"]["0x180"] == "0x4228c0"
    assert hooks[3]["selected_slots"]["0xf4"] == "0x41ec40"
    assert hooks[3]["selected_slots"]["0x180"] == "0x422890"
    assert all(h["selected_slots"]["0x184"] == "0x44f7a0" for h in hooks)
    thunks = []
    for address, slot in ((0x44eed2, 0x180), (0x44eee1, 0x184)):
        b = datum(address, 15, "shared-command-virtual-bridge")
        assert b[:4] == bytes.fromhex("8b018b80") and b[8] == 0xe8 and b[13:] == b"\xff\xe0"
        assert struct.unpack("<I", b[4:8])[0] == slot
        read = load(PRIVATE / f"bytes-{address:x}.json")
        assert read["subject"]["digest"]["sha256"] == SHA
        assert bytes.fromhex(read["normalized_result"]["bytes_hex"]) == b
        thunks.append({"address": hex(address), "virtual_slot_read": hex(slot),
                       "check_helper_call": hex(address + 13 + struct.unpack("<i", b[9:13])[0]),
                       "byte_evidence_id": read["evidence_id"],
                       "derivation": "bounded-x86-MOV-MOV-CALL-JMP-byte-pattern",
                       "canonical_function_or_instruction_available": False})
    order = list(struct.unpack("<4I", datum(0x5d5ac0, 16, "editor-summary-field-indices")))
    assert order == [5, 6, 1, 3]
    label_addresses = (0x5d36cc, 0x5d36d8, 0x5d36e0, 0x5d36e8)
    for address in label_addresses:
        b = pe.read(address, 64).split(b"\0", 1)[0]
        datum(address, len(b) + 1, "source-summary-label")
    b = pe.read(0x5d3f74, 100).split(b"\0", 1)[0]
    datum(0x5d3f74, len(b) + 1, "source-persistent-add-explanation")

    inventory = load(OUT / "entry-inventory.json")["launcher"]
    templates = []
    for d in inventory["dialogs"]:
        if d["name"].get("id") in (7900, 7927):
            blob = TARGET.read_bytes()[d["file_offset"]:d["file_offset"] + d["bytes"]]
            assert sha(blob) == d["sha256"]
            templates.append({"id": d["name"]["id"], "controls": d["control_count"],
                              "bytes": d["bytes"], "file_offset": d["file_offset"],
                              "sha256": sha(blob)})
    assert len(templates) == 2
    source = {"path": str(TARGET.relative_to(ROOT)), "sha256": SHA,
              "bytes": TARGET.stat().st_size, "official_current_version_proven": False,
              "scope": "fixed-analysis-image-only-not-legacy-601b-or-other-version"}
    tools = {"rea": "6.7.0", "provider": "Ghidra 12.1.4", "profile_digest": PROFILE,
             "language": "x86:LE:32:default:windows", "image_base": "0x400000"}
    check = {"schema": "moli.capability.launcher-presets-source-check.v1", "source": source,
             "tools": tools, "bodies": bodies, "instruction_anchors": anchors,
             "data": data, "selected_virtual_hooks": hooks, "command_bridges": thunks,
             "templates": templates,
             "summary": {"function_bodies": len(bodies),
                         "new_dossiers": sum(not r["reused_from_prior_package"] for r in bodies),
                         "reused_dossiers": len(REUSE),
                         "function_bytes": sum(s["bytes"] for r in bodies for s in r["ranges"]),
                         "source_data_ranges": len(data), "semantic_anchor_groups": len(anchors)},
             "limitations": ["Range hashes bind the retained native dossiers to this exact PE; no original process was run.",
                             "This phase hashes original PE ranges; it does not add a second native-memory-byte or independent disassembler comparison for the new bodies.",
                             "The two 15-byte command bridges are source-byte derivations, not newly defined canonical functions.",
                             "Only selected virtual slots are examined; no complete-vtable extent is inferred.",
                             "Decompiler void signatures for boolean-return helpers are corrected using AL return instructions and callers' TEST AL."]}
    write("launcher-presets-source-check.json", check)

    fields = []
    names = ["name", "game-display-identity", "game-secondary-identity", "realm-identity",
             "optional-subrealm-identity", "login-account", "game-id"]
    for i, (name, limit) in enumerate(zip(names, (64, 512, 512, 512, 512, 16, 40))):
        fields.append({"index": i, "role": name, "record_memory_offset": 4 + i * 24,
                       "max_bytes": limit, "empty_allowed": i == 4,
                       "role_evidence": "editor-summary-index-and-label" if i in order else
                                        "catalog-match-use-site" if i in (2, 4) else "name-edit-and-list-label",
                       "full_catalog_meaning_closed": i not in (2, 4)})
    contract = {
        "schema": "moli.capability.launcher-presets-contract.v1", "source": source, "tools": tools,
        "capabilities": ["L04", "L08"], "source_check": "analysis/capability-first-v1/launcher-presets-source-check.json",
        "classification": "bounded-source-workflow-and-file-grammar",
        "facts": {
            "entries": {"main_choose_command": {"id": 7901, "procedure": "0x422270", "template": 7900},
                        "main_save_current_command": {"id": 7926, "procedure": "0x422fc0", "helper": "0x427020", "editor_template": 7927},
                        "guard_fields": ["main+0x10f2", "main+0x1a74", "main+0x1a5e", "0x409bf0()"],
                        "reentry_latch": "main+0x10f2 is set across the modal path; busy and cancel branches retain their observed 0x10f0/0x10f1 changes"},
            "state_ownership": {"main_list": "main+0x11a0", "dialog_current_list": "dialog+0xc0",
                                "dialog_selected_record": "dialog+0xcc", "dialog_path": "dialog+0x178",
                                "persistent_mode": "dialog+0x17c", "load_ok": "dialog+0x17d",
                                "undo_available": "dialog+0x17e", "undo_list": "dialog+0x180",
                                "persistent_mode_predicate": "controller+0x7740 == 1 and main+0x2298 != 0",
                                "initialization": "deep-copy main vector; selected record default-initialized; load_ok=1; undo_available=0; undo vector empty",
                                "copy_and_assignment": "0x414f60/0x416cf0 allocate/copy 0xac-byte records and 0x402d80 copies seven string objects; not pointer-only aliasing",
                                "destruction": "0x416380 destroys dialog widgets, string fields and both lists; it is not a save/commit routine"},
            "record": {"memory_stride": 172, "leading_u32": {"range_inclusive": [0, 14], "role": "catalog-game-type-or-index"},
                       "fields": fields, "string_object_size": 24,
                       "string_layout_scope": "fixed-x86 in-memory small-string layout; wire/file stores lengths and bytes, never 24-byte object images",
                       "forbidden_bytes": {"inclusive_ranges": [[0, 31]], "singletons": [127]},
                       "encoding": "raw narrow bytes; this validator does not validate a codepage or UTF-8; bytes >=128 pass this byte-class check"},
            "file": {"path_builder": "0x425320 takes the directory of controller+0x775c using the last slash/backslash and appends LaunchPresets.dat",
                     "magic": {"u32_le": 827543628, "hex_bytes": "4c505331", "ascii": "LPS1"},
                     "version_u32_le": 1, "count_u32_le": {"minimum": 0, "maximum": 32},
                     "layout": ["u32le magic", "u32le version", "u32le count", "count * (u32le type; seven * (u32le byteLength; exact bytes))"],
                     "string_terminators_or_record_padding": "none serialized",
                     "decoder": "0x419d40 uses 0x429430 little-endian reads, length<=512 and remaining-byte checks, per-record 0x429980 validation, exact EOF; swaps the completed temporary vector into the destination only on success",
                     "duplicates": "encoder/decoder do not check name uniqueness; duplicate-name files are not rejected by this grammar alone",
                     "file_reader": {"procedure": "0x41c170", "maximum_file_bytes": 115724,
                                     "zero_file_bytes": "read failure, not an empty-list file",
                                     "missing_file_error_2": "success and clear destination list",
                                     "other_open_size_read_or_parse_failure": "failure; no successful destination-vector swap"},
                     "writer": {"procedure": "0x426d00", "steps": ["validate and serialize", "suffix .tmp-<pid>-<tick>",
                                 "CreateFileA create-new with flags 0x80000080", "WriteFile exact byte count", "FlushFileBuffers", "CloseHandle", "MoveFileExA flags 9"],
                                "failure": "return false; delete the self-created temporary file after a write/flush/replace failure; create-new failure does not delete an already-existing collision file",
                                "not_verified": "actual Windows fault handling, filesystem atomicity, crash durability and platform adapters"}},
            "list_workflow": [
                {"action": "open", "rule": "persistent mode reloads the file into current list; session mode uses copied main list; read failure clears displayed list, disables mutation and preserves main list at close"},
                {"action": "select", "ids": [7902], "notifications": [1, 2], "rule": "valid selection controls primary-button enablement; double click also invokes choose"},
                {"action": "choose", "rule": "0x422890 requires primary-button focus; 0x429910 validates selected index, copies record to dialog+0xcc and delegates modal result 1"},
                {"action": "rename", "id": 7906, "rule": "edit an isolated record copy, change only field 0, on accepted editor result modify candidate vector; validate/persist candidate before changing visible current vector"},
                {"action": "delete", "id": 7907, "rule": "require confirmation result 1; remove candidate row and clamp selection to last remaining index; validate/persist before publication"},
                {"action": "move-up", "id": 7908, "rule": "swap selected row with index-1 only within bounds; validate/persist before publication"},
                {"action": "move-down", "id": 7909, "rule": "swap selected row with index+1 only within bounds; validate/persist before publication"},
                {"action": "mutation-success", "rule": "save previous current vector as single undo snapshot, swap candidate into current, set undo_available=1 and refresh list/selection"},
                {"action": "undo", "id": 7914, "rule": "require load_ok and undo_available; validate/persist snapshot before swap; clear undo_available and consume previous snapshot; no redo stack"},
                {"action": "outer-close-or-cancel", "rule": "when load_ok is true, copy current list back to main BEFORE testing modal result; prior successful list writes and edits survive cancellation; only result 1 calls apply-selected 0x428c00"},
                {"action": "reopen", "rule": "persistent mode reloads file, session mode copies main list; the one-step undo snapshot is local to the destroyed dialog"}
            ],
            "editor": {"procedure": "0x4228c0", "editable_field": 0, "read_only_summary_field_indices": order,
                       "summary_roles": ["login-account", "game-id", "game-display-identity", "realm-identity"],
                       "submission": "require primary-button HWND focus; get edit 7921; trim trailing then leading CRT multibyte whitespace; assign name; validate entire record; compare names using __mbsicmp excluding edited row; only then call modal-OK helper",
                       "limits": "edit control receives limit 64; record validator applies 64 raw bytes to name; do not treat this as 64 Unicode characters",
                       "cancel": "local editor copy destroyed; no candidate-list publication or file write from cancelled editor",
                       "default_name": "0x41d6a0 omits control bytes and limits generated narrow name to 32 bytes without splitting an observed DBCS lead-byte pair; full source-name composition remains tied to catalog context"},
            "add_current": {"procedure": "0x427020", "rule": "clone main list; reload first when persistent; reject failed read or list size >=32; modal editor result 1 appends record; serialize/write when persistent; publish to main only after success; cancel/write failure returns AL=0",
                            "record_origin": "0x419a40 gates selected game-ID state and calls 0x4195f0; summary labels and field copies bind account/game-ID and catalog selection, not a new authentication exchange"},
            "apply_selected_boundary": {"procedure": "0x428c00", "known_conditions": ["record validator passes", "one matching game display identity", "one matching realm identity", "game type and secondary identity match", "realm belongs to selected game", "optional subrealm empty or uniquely matches according to catalog count", "observed catalog flags permit selection"],
                                        "known_effect": "copies selected record, resets local selection state and invokes existing game/realm/subrealm and next-stage helpers",
                                        "complete_authentication_or_game_start_proven": False}
        },
        "design_inferences": ["D1 should add a separate shared preset-list owner/codec and one-step undo; the legacy UserMode-only preference module does not implement this grammar.",
                              "Thin web/WeChat adapters should translate accepted actions and persistence outcomes; cancellation must not silently roll back already-published list changes."],
        "pending": ["Complete catalog identity meanings and all apply-selected/next-stage state, error, cancellation and reentry conditions.",
                    "Exact runtime multibyte locale, trim and case-comparison behavior; do not substitute arbitrary Unicode folding.",
                    "Complete native framework delivery/focus/keyboard lifecycle and UI presentation, including the checking helper inside the derived command bridges.",
                    "File format is fixed c82f only; other launcher versions and the current official distribution are not proven equivalent.",
                    "Implementations, platform persistence, actual device operation and same-version official acceptance await the global analysis gate."],
        "all_L04_analysis_complete": False, "all_L08_analysis_complete": False,
        "all_capability_analysis_complete": False, "implementation_gate_passed": False,
        "runtime_features_changed": False, "original_execution": False,
        "original_file_or_user_account_data_read": False
    }
    assert contract["facts"]["file"]["magic"]["u32_le"] == int.from_bytes(b"LPS1", "little")
    write("launcher-presets-contract.json", contract)
    print(json.dumps(check["summary"], ensure_ascii=False))


if __name__ == "__main__":
    main()
