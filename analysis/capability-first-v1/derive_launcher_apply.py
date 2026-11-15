#!/usr/bin/env python3
"""Verify fixed-source preset application and normal-login workflow evidence.

Retained workflow pseudocode is combined explicitly with native range/assembly
observations. It is never relabelled as a newly analyzed native dossier.
"""
import hashlib
import json
from pathlib import Path

from extract_entry_inventory import PE

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / "analysis/capability-first-v1"
PRIVATE = ROOT / "build/analysis/capability-launcher-apply-v1"
SHA = "c82fc98d3d274beadee91254e3343974d7c7fdaf2b2a32bc21cc81b76e85c152"
NATIVE_PROFILE = "7810ea9437da59780820ec6fedb47ce47390841a95d527ddb6c3b3700fe180cb"
WORKFLOW_PROFILE = "b9a9b4f868ae80c2a55407e7d3772a125da19a3d5e2e1765df03951cbd797158"
TARGET = ROOT / "build/analysis/launcher-current-runtime-v4/POLCN_Launcher.analysis-only.exe"


def sha(blob):
    return hashlib.sha256(blob).hexdigest()


def load(path):
    return json.loads(path.read_text())


def identity(path):
    return {"path": str(path.relative_to(ROOT)), "bytes": path.stat().st_size, "sha256": sha(path.read_bytes())}


def write(name, value):
    (OUT / name).write_text(json.dumps(value, ensure_ascii=False, indent=2) + "\n")


def main():
    pe = PE(TARGET, SHA)
    inputs = load(PRIVATE / "body-input-manifest.json")
    bodies, assembly_by_entry, body_by_entry = [], {}, {}
    for row in inputs:
        path = ROOT / row["path"]
        d = load(path)
        assert d["subject"]["digest"]["sha256"] == SHA
        item = {"procedure": row["procedure"], "kind": row["kind"], "retained_view": identity(path)}
        if row["kind"] == "composed-reuse":
            body, assembly = d["body"], d["assembly"]
            origin = d["pseudocode_source"]
            parent_path = ROOT / origin["retained_parent"]
            parent = load(parent_path)
            assert d["canonical_function_dossier"] is False
            assert parent["subject"]["digest"]["sha256"] == SHA
            assert d["native_analysis_profile"]["digest"] == NATIVE_PROFILE
            assert d["workflow_profile"]["digest"] == WORKFLOW_PROFILE
            assert parent["analysis_profile"]["digest"] == WORKFLOW_PROFILE
            selected = parent["normalized_result"]["items"][origin["item_index"]]
            assert selected["status"] == "ok" and selected["procedure"]["address"] == row["procedure"]
            assert selected["pseudocode"] == d["pseudocode"]
            assert sha(d["pseudocode"].encode()) == origin["pseudocode_sha256"]
            assert sha((ROOT / origin["source_bundle"]).read_bytes()) == origin["source_bundle_sha256"]
            info = load(PRIVATE / f"procedure_info-{row['procedure'][2:]}.json")
            asm = load(PRIVATE / f"procedure_assembly-{row['procedure'][2:]}.json")
            assert info["normalized_result"]["body"] == body
            assert asm["normalized_result"].splitlines() == assembly
            item.update({"canonical_native_dossier": False, "pseudocode_parent": identity(parent_path),
                         "pseudocode_parent_evidence_id": parent["evidence_id"],
                         "pseudocode_item_index": origin["item_index"],
                         "pseudocode_sha256": origin["pseudocode_sha256"],
                         "pseudocode_utf8_bytes": origin["pseudocode_bytes"],
                         "workflow_profile_digest": WORKFLOW_PROFILE,
                         "range_evidence_id": info["evidence_id"], "assembly_evidence_id": asm["evidence_id"]})
        else:
            assert d["operation"] == "analyze_function"
            assert d["analysis_profile"]["digest"] == NATIVE_PROFILE
            body, assembly = d["normalized_result"]["procedure"]["body"], d["normalized_result"]["assembly"]
            item.update({"canonical_native_dossier": True, "evidence_id": d["evidence_id"]})
        assert body["available"] and body["contains_entry"]
        ranges = []
        for r in body["ranges"]:
            start, end = int(r["start"], 16), int(r["end"], 16)
            assert pe.executable(start) and pe.executable(end) and start <= end
            read_path = PRIVATE / f"read-range-{start:x}.json"
            read = load(read_path)
            n = read["normalized_result"]
            blob = bytes.fromhex(n["bytes_hex"])
            assert read["subject"]["digest"]["sha256"] == SHA
            assert n["complete"] and n["returned_bytes"] == len(blob) == end - start + 1
            assert pe.read(start, len(blob)) == blob
            ranges.append({"start": r["start"], "end_inclusive": r["end"], "bytes": len(blob),
                           "file_offset": pe.file_offset(start, len(blob)), "sha256": sha(blob),
                           "native_memory_read_evidence_id": read["evidence_id"], "retained_read": identity(read_path)})
        assert sum(r["bytes"] for r in ranges) == body["total_bytes"] == row["body_bytes"]
        item["ranges"] = ranges
        bodies.append(item)
        assert row["procedure"] not in body_by_entry
        body_by_entry[row["procedure"]] = item
        assembly_by_entry[row["procedure"]] = assembly

    anchors = []

    def anchor(entry, claim, *needles):
        instructions = []
        for needle in needles:
            matches = [s for s in assembly_by_entry[entry] if needle in s]
            assert matches, (entry, needle)
            instructions.extend(s.split(":", 1)[0] for s in matches)
        owner = body_by_entry[entry]
        anchors.append({"claim": claim, "procedure": entry,
                        "body_evidence_id": owner.get("evidence_id", owner.get("assembly_evidence_id")),
                        "instruction_addresses": sorted(set(instructions))})

    anchor("0x428c00", "selected-record-copy-and-active/manual-flag-publication",
           "LEA ECX, [ESI + 0x10f4]", "CALL 0x00416fc0", "MOV word ptr [ESI + 0x10f0], 0x1")
    anchor("0x428c00", "password-clear-and-startup-option-reset",
           "LEA ECX, [ESI + 0x2200]", "CALL 0x00407c70", "MOV dword ptr [ESI + 0x2428], 0x0")
    anchor("0x428c00", "game-realm-subrealm-preparation-before-credential-stage",
           "CALL 0x0042cf10", "CALL 0x0042d670", "CALL 0x0040de40", "CALL 0x0040e0e0",
           "MOV dword ptr [ESI + 0xa88], 0x3", "CALL 0x0042d120")
    anchor("0x428c00", "game-secondary-identity-is-a-byte-length-equality-predicate", "CALL 0x00414130")
    anchor("0x42d120", "preparation-check-occurs-before-account-input-presentation", "CALL 0x0040f430")
    anchor("0x42d120", "preset-account-is-assigned-to-normal-account-field-and-password-is-cleared",
           "LEA ECX, [EDI + 0x21fc]", "CALL 0x0040e800", "LEA ECX, [EDI + 0x2200]")
    anchor("0x41e420", "account-or-startup-option-change-cancels-preset-selection-but-continues-normal-login",
           "CALL 0x004171c0", "CMP dword ptr [EDI + 0x2428], 0x0", "MOV byte ptr [EDI + 0x10f0], 0x0")
    anchor("0x41e420", "normal-prelogin-gate-and-candidate-attempt-entry",
           "CALL 0x004285d0", "CALL 0x004291d0")
    anchor("0x423c30", "reply-processing-rebuilds-list-before-preset-game-id-consumption",
           "CALL 0x00425790", "CALL 0x00418590")
    anchor("0x418590", "preset-is-consumed-before-comparison-or-reentrant-normal-command",
           "MOV byte ptr [EDI + 0x10f1], 0x1", "MOV byte ptr [EDI + 0x10f0], 0x0",
           "CALL 0x00414130", "CALL 0x005998fc", "CALL 0x0041b610", "CALL 0x0041e420")
    anchor("0x41e420", "normal-game-id-commit-clears-both-preset-flags", "MOV word ptr [EDI + 0x10f0], 0x0", "CALL 0x0042d830")
    anchor("0x4291d0", "exhausted-or-stopped-login-aborts-preset", "MOV byte ptr", "0x10f0", "0x10f1")
    anchor("0x42d830", "normal-handoff-entry-and-return-to-credential-stage", "CALL 0x00410c00", "0xa88")
    anchor("0x417fe0", "credential-view-starts-keyboard-hint-timer", "0x36a", "0x64")
    anchor("0x423910", "keyboard-hint-timer-reads-keyboard-state", "0x36a", "0x20bc")

    table = load(OUT / "launcher-message-map.json")
    timer = next(r for t in table["tables"] for r in t["rows"] if r["handler"] == "0x423910")
    timer_blob = pe.read(int(timer["address"], 16), 24)
    assert int.from_bytes(timer_blob[:4], "little") == 0x113
    assert int.from_bytes(timer_blob[20:24], "little") == 0x423910
    data = [{"role": "main-WM_TIMER-entry", "address": timer["address"], "bytes": 24,
             "file_offset": pe.file_offset(int(timer["address"], 16), 24), "sha256": sha(timer_blob)}]
    for address, role in ((0x5d4e50, "rebind-required"), (0x5d4ec4, "game-selection-invalid"),
                          (0x5d5214, "preset-ready-enter-password"), (0x5d4fb8, "account-option-changed"),
                          (0x5d4fe8, "username-required"), (0x5d4ff8, "password-required"),
                          (0x5d5750, "caps-lock-hint")):
        blob = pe.read(address, 220).split(b"\0", 1)[0] + b"\0"
        data.append({"role": role, "address": hex(address), "bytes": len(blob),
                     "file_offset": pe.file_offset(address, len(blob)), "sha256": sha(blob)})
    source = identity(TARGET)
    source["official_current_version_proven"] = False
    summary = {"body_entries": len(bodies), "new_native_dossiers": sum(r["kind"] == "new-native" for r in bodies),
               "reused_native_dossiers": sum(r["kind"] == "reused-native" for r in bodies),
               "composed_reused_bodies": sum(r["kind"] == "composed-reuse" for r in bodies),
               "range_reads": sum(len(r["ranges"]) for r in bodies),
               "range_bytes": sum(s["bytes"] for r in bodies for s in r["ranges"]),
               "reused_workflow_pseudocode_utf8_bytes": sum(r.get("pseudocode_utf8_bytes", 0) for r in bodies),
               "semantic_anchor_groups": len(anchors), "data_ranges": len(data)}
    assert summary["body_entries"] == 37 and summary["range_bytes"] == 23158
    source_check = {"schema": "moli.capability.launcher-apply-source-check.v1", "source": source,
                    "tools": {"rea": "6.7.0", "native_provider": "Ghidra 12.1.4", "native_profile_digest": NATIVE_PROFILE,
                              "reused_workflow_provider": "rea-workflow 1", "workflow_profile_digest": WORKFLOW_PROFILE},
                    "summary": summary, "bodies": bodies, "instruction_anchors": anchors, "data": data,
                    "read_memory_kind": "static Ghidra loaded image; not a live process, VM memory capture or crash dump",
                    "all_native_memory_read_bytes_match_original_PE": True,
                    "limitations": ["Composed reuse combines an old successful workflow item with explicitly separate current native range/assembly evidence; it is not an analyze_function dossier.",
                                    "Range/byte equality proves source binding; it does not prove every high-level branch or original runtime behavior.",
                                    "425790 and 424cf0 contain decompiler unreachable-block warnings. Complete source ranges are retained, but list sorting/filtering and all retry branches are not declared semantically closed.",
                                    "Method prototypes and implicit ECX receivers are inferred by the decompiler; specific receiver and caller return tests take precedence.",
                                    "The fixed c82f image is not asserted to be the present official release, nor equivalent to another launcher/game version."]}
    write("launcher-apply-source-check.json", source_check)

    contract = {
        "schema": "moli.capability.launcher-apply-contract.v1", "source": source,
        "source_check": "analysis/capability-first-v1/launcher-apply-source-check.json",
        "list_and_persistence_contract": "analysis/capability-first-v1/launcher-presets-contract.json",
        "capabilities": ["L01", "L02", "L03", "L04", "L08"],
        "facts": {
            "ownership": {"selected_record": "main+0x10f4", "pending_preset": "byte main+0x10f0",
                          "manual_fallback_marker": "byte main+0x10f1", "modal_latch": "byte main+0x10f2",
                          "main_step": "main+0xa88", "account": "main+0x21fc", "password": "main+0x2200",
                          "preset_account_string": "main+0x1170 = selected_record+0x7c (field 5)",
                          "preset_game_id_string": "main+0x1188 = selected_record+0x94 (field 6)",
                          "source_offset_scope": "fixed x86 layout; not proposed portable API fields"},
            "catalog_views": {"base": "controller+0x120", "game_count": "base+0x2b30",
                              "game_rows": {"base": "base+0x2bd8", "stride": 164,
                                            "display_string_pointer_offset": 0, "secondary_string_pointer_offset": 4,
                                            "member_realm_indices_offset": 68, "member_count_offset": 148,
                                            "type_u32_offset": 152, "availability_byte_offset": 156},
                              "realm_count": "base+0x2b34", "realm_rows": {"base": "base+0x3574", "stride": 412,
                                            "display_string_pointer_offset": 0, "subrealm_count_offset": 24,
                                            "per_type_subrealm_counts_offset": 168, "subrealm_rows_offset": 228,
                                            "unavailable_byte_offset": 408},
                              "source_binding_status": "consumer offsets verified; complete producer/XML/installation meaning is pending"},
            "admission": {"procedure": "0x428c00", "ordered_conditions": [
                "Clear an older pending preset first, setting manual marker if it had been active.",
                "Scan game display names with __mbscmp and require exactly one name match; separately require type plus equal-length byte equality of display and secondary identity for the selected row.",
                "Require exactly one realm display-name match in the global realm list and membership in the selected game's realm indices.",
                "Require the record validator 0x429980 to pass.",
                "If the per-type subrealm count is below one, require an empty optional subrealm field; otherwise require one matching name across subrealm rows and a matching type.",
                "Require realm unavailable byte zero and game availability byte nonzero before publication."],
                "failure_before_publication": "show rebind-required message; do not replace the stored selected record; the earlier pending flag/marker change is not rolled back",
                "comparison_scope": "source byte/MBCS comparisons; no new case folding, fuzzy matching or ordinal fallback"},
            "application": [
                {"step": "publish", "rule": "copy admitted record to main+0x10f4, set pending=1/manual-marker=0, clear normalized game-ID filter query and password/UI, clear 74 bytes at main+0x11ac and startup option main+0x2428"},
                {"step": "resolve-game", "rule": "populate the ordinary game view, locate the catalog row through visible-to-raw mapping, then prepare the ordinary realm view and installation/path checks"},
                {"step": "revalidate-game", "rule": "after those helpers, require availability still true and controller current game equal to the admitted game; otherwise clear pending, set manual marker when applicable and show selection-invalid; prior effects remain"},
                {"step": "resolve-realm", "rule": "copy selected realm name into the normal controller field and call 0x40de40 with ECX=controller+0x120; clear normal subrealm string/current index"},
                {"step": "resolve-optional-subrealm", "rule": "when required, copy name, call 0x40e0e0 with the same controller receiver, prepare subrealm view and its mapped selection"},
                {"step": "credentials", "rule": "set main step 3 and call 0x42d120, then 0x417fe0; do not synthesize a successful login or game-ID reply"}
            ],
            "preparation_and_account": {"entry": "0x42d120", "check": "0x40f430(controller+0x120)",
                "check_result_0": "continue to credential presentation",
                "check_result_1": "record saved step from 0x41c060, set preparation flag main+0x1a5e and temporary step, return 0; later preparation callbacks remain a separate analysis boundary",
                "check_result_2": "mark/clear pending preset, clear preparation flag and invoke ordinary error helpers, return 0",
                "credential_presentation": "when pending, assign preset field 5 into normal account main+0x21fc and clear password main+0x2200; the source prompt asks for a password",
                "no_submission_here": "this path presents the ordinary credential stage and focus handling; it does not call the credential-stage Next command"},
            "ordinary_submit": {"entry": "0x41e420 case 3", "conditions": [
                "Ignore while normal login-in-progress main+0x1a74 is set.",
                "Update normal input fields; when pending and account differs from the preset or option main+0x2428 is nonzero, mark/clear pending and warn, then continue normal login.",
                "Require nonempty normal account and password.",
                "Require ordinary prelogin helper 0x4285d0 return value 1; cancellation/nonacceptance clears pending and returns.",
                "Require at least one ordinary authentication candidate; otherwise clear pending and report failure."],
                "next": "initialize normal candidate attempt fields and timer 100 at 100ms; call 0x4291d0",
                "wire_dependencies": ["analysis/launcher-current-login-v1/source-verification.json", "analysis/launcher-current-login-v1/implementation-spec.json"],
                "new_protocol_or_credential_bypass": False},
            "reply_and_game_id": {"reply_owner": "0x423c30", "nonpositive_reply_count": "mark/clear pending before ordinary failure handling",
                "positive_reply_path": "populate received IDs/state, call list rebuild 0x425790 and then preset consumer 0x418590",
                "preset_consumer": "0x418590", "ordered_rules": [
                    "Return immediately if pending is zero.",
                    "Copy the selected record to a local record and clear pending/set manual marker BEFORE searching or invoking the normal Next handler.",
                    "Copy received ID strings into a temporary list and require exactly one equal-length byte match to preset field 6; a duplicate match invalidates selection.",
                    "Require the current normal account to match preset field 5 using __mbscmp.",
                    "Require status word 0 or -4 and at least one of restriction fields main+0x1278/main+0x1478 for that ID to be zero.",
                    "Map the raw received ID index to a currently visible row with 0x41b610; missing/hidden/unusable/ambiguous results remain manual.",
                    "On success set the ordinary list selection and call 0x41e420; its case 4 repeats eligibility checks, clears both preset flags, copies game ID to main+0x11cd and enters normal handoff preparation."],
                "raw_vs_visible_indices": "0x43e4a0 maps visible ordinal <64 to raw stored row ID, otherwise -1; 0x41b610 searches visible rows for a bounded raw reply index",
                "fallback_effect": "clear visible selection for mismatch/ambiguity/unusable status; a missing visible-row mapping has its own source message; do not choose another ID automatically"},
            "normal_handoff_boundary": {"entry": "0x42d830", "observed": "step>=5 invokes existing 0x410c00; absent main+0x1a5f and no controller work may restore step 3; step 2 can skip optional subrealm to step 3",
                "current_game_consumer_or_official_acceptance_proven": False,
                "dependency": "analysis/game-legacy-startup-materials-v1/source-check.json"},
            "timers": {"main_map": "WM_TIMER 0x113 -> 0x423910",
                "0x36a": {"period_ms": 100, "purpose": "keyboard/Caps Lock hint; main+0x1a6c stops it and main+0x1a72 gates hint processing", "initiator": "0x417fe0", "submits_login": False},
                "100": {"period_ms": 100, "purpose": "ordinary login progress 0x424cf0; handler stops timer when main+0x1a74 is zero", "preset_specific_retry_loop": False}},
            "abort_and_reentry": {"attempt_exhausted_or_stopped": "0x4291d0 marks/clears pending before stop/error handling",
                "normal_stop": "0x41b690 clears active request, in-progress/attempt fields and timer 100, and may post a window-close request; not a process-exit guarantee",
                "preset_reentry": "the post-reply consumer clears pending before direct normal-command dispatch, so it cannot select the same preset twice through that flag",
                "scope": "the listed static branches only; full late callbacks, dialog lifetime, preparation recovery and every host-close path remain pending"}
        },
        "design_inferences": ["D1 can coordinate preset ownership with the existing shared launcher-flow/login/channel/replies/local modules, preserving source-specific rules and the real receive boundary.",
                              "Use the same normal selection/submit/game-ID path after applying a preset, with an explicit one-use pending selection and manual fallback; thin platforms should not duplicate authentication logic."],
        "requirement_answers": [
            {"question": "catalog field identity and ambiguity predicates", "status": "partially-answered", "remaining": "producer/XML and full installation meaning of secondary identity"},
            {"question": "record ownership and state progression", "status": "answered-for-listed-static-paths"},
            {"question": "normal account/password and received game-ID dependency", "status": "answered-for-listed-static-paths"},
            {"question": "all failure/cancel/reentry conditions", "status": "partially-answered", "remaining": "asynchronous preparation/late callback and full host teardown"},
            {"question": "all UI command creation and delivery", "status": "partially-answered", "remaining": "other dynamic IDs, framework input/focus and resources with unclosed use"}
        ],
        "pending": ["Complete catalog producer/XML identities, installation/path predicates and all configuration/version ownership.",
                    "Complete asynchronous preparation restoration/late callbacks and all normal abort/close/reentry paths, including step helper 0x41c060.",
                    "Close list rebuild/filtering 0x425790 and all candidate retry branches with assembly or corrected independent analysis; current decompiler warnings are not coverage proof.",
                    "Complete keyboard/MBCS/framework delivery, remaining dialogs/menus/dynamic controls, and platform persistence.",
                    "Same-version current game handoff, actual web/mobile/WeChat devices and official service acceptance remain separate requirements."],
        "all_capability_analysis_complete": False, "implementation_gate_passed": False,
        "runtime_features_changed": False, "original_execution": False, "account_or_session_observed": False,
        "official_acceptance": False, "full_goal_complete": False
    }
    write("launcher-apply-contract.json", contract)
    print(json.dumps(summary))


if __name__ == "__main__":
    main()
