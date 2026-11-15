#!/usr/bin/env python3
"""Bind catalog/list/recovery specifications to fixed static launcher evidence.

This does not execute the launcher. Analyst prototype experiments remain
separate from canonical REA dossiers and from reused composed pseudocode.
"""
import hashlib
import json
from pathlib import Path

from extract_entry_inventory import PE
from derive_dispatch_bindings import vtable_info

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / "analysis/capability-first-v1"
PRIVATE = ROOT / "build/analysis/capability-launcher-catalog-state-v1"
TARGET = ROOT / "build/analysis/launcher-current-runtime-v4/POLCN_Launcher.analysis-only.exe"
SHA = "c82fc98d3d274beadee91254e3343974d7c7fdaf2b2a32bc21cc81b76e85c152"
NATIVE = "7810ea9437da59780820ec6fedb47ce47390841a95d527ddb6c3b3700fe180cb"
WORKFLOW = "b9a9b4f868ae80c2a55407e7d3772a125da19a3d5e2e1765df03951cbd797158"
HISTORICAL = "c7ba69f77809fe589fd5dcccc78fcd4f33d4b6f76325d00a27f37032bbb32384"


def sha(blob):
    return hashlib.sha256(blob).hexdigest()


def load(path):
    return json.loads(path.read_text())


def identity(path):
    return {"path": str(path.relative_to(ROOT)), "bytes": path.stat().st_size,
            "sha256": sha(path.read_bytes())}


def write(name, value):
    (OUT / name).write_text(json.dumps(value, ensure_ascii=False, indent=2) + "\n")


def main():
    pe = PE(TARGET, SHA)
    bodies, assemblies, by_entry = [], {}, {}
    primitive_parents = {"0x40a320": "reused-pseudocode-40a320.json",
                         "0x40bf80": "reused-batch-40bf80.json",
                         "0x408e50": "reused-text-408e50.json"}
    for row in load(PRIVATE / "body-input-manifest.json"):
        path = ROOT / row["path"]
        record = load(path)
        assert record["subject"]["digest"]["sha256"] == SHA
        item = {"procedure": row["procedure"], "kind": row["kind"], "retained_view": identity(path)}
        if row["kind"] in ("new-native", "reused-native"):
            assert record["operation"] == "analyze_function"
            assert record["analysis_profile"]["digest"] == NATIVE
            body = record["normalized_result"]["procedure"]["body"]
            assembly = record["normalized_result"]["assembly"]
            item.update(canonical_native_dossier=True, evidence_id=record["evidence_id"])
        else:
            assert record["canonical_function_dossier"] is False
            body, assembly = record["body"], record["assembly"]
            if row["kind"] == "composed-new-ranges":
                assert record["native_profile"]["digest"] == NATIVE
                parent_path = PRIVATE / primitive_parents[row["procedure"]]
                parent = load(parent_path)
                assert parent["evidence_id"] == record["pseudocode_parent_evidence_id"]
                profile = record["pseudocode_profile"]["digest"]
                assert parent["analysis_profile"]["digest"] == profile
                if record["pseudocode_item_index"] is None:
                    assert parent["operation"] == "procedure_pseudo_code" and profile == NATIVE
                    text = parent["normalized_result"]
                else:
                    assert parent["operation"] == "batch_decompile" and profile == WORKFLOW
                    selected = parent["normalized_result"]["items"][record["pseudocode_item_index"]]
                    assert selected["status"] == "ok" and selected["procedure"]["address"] == row["procedure"]
                    text = selected["pseudocode"]
                native_dir = PRIVATE
            else:
                assert row["kind"] == "composed-prior"
                origin = record["pseudocode_source"]
                parent_path = ROOT / origin["retained_parent"]
                parent = load(parent_path)
                assert sha((ROOT / origin["source_bundle"]).read_bytes()) == origin["source_bundle_sha256"]
                profile = record["workflow_profile"]["digest"]
                assert profile == parent["analysis_profile"]["digest"] == WORKFLOW
                selected = parent["normalized_result"]["items"][origin["item_index"]]
                assert selected["status"] == "ok" and selected["procedure"]["address"] == row["procedure"]
                text = selected["pseudocode"]
                assert sha(text.encode()) == origin["pseudocode_sha256"]
                native_dir = path.parent
            assert parent["subject"]["digest"]["sha256"] == SHA and text == record["pseudocode"]
            info = load(native_dir / f"procedure_info-{row['procedure'][2:]}.json")
            asm = load(native_dir / f"procedure_assembly-{row['procedure'][2:]}.json")
            assert info["normalized_result"]["body"] == body
            assert asm["normalized_result"].splitlines() == assembly
            assert info["evidence_id"] == record["range_evidence_id"]
            assert asm["evidence_id"] == record["assembly_evidence_id"]
            assert info["analysis_profile"]["digest"] == asm["analysis_profile"]["digest"] == NATIVE
            item.update(canonical_native_dossier=False, pseudocode_parent=identity(parent_path),
                        pseudocode_parent_evidence_id=parent["evidence_id"],
                        pseudocode_profile_digest=profile, pseudocode_sha256=sha(text.encode()),
                        pseudocode_utf8_bytes=len(text.encode()), range_evidence_id=info["evidence_id"],
                        assembly_evidence_id=asm["evidence_id"])
        assert body["available"] and body["contains_entry"]
        ranges = []
        for span in body["ranges"]:
            start, end = int(span["start"], 16), int(span["end"], 16)
            assert pe.executable(start) and pe.executable(end) and start <= end
            read_path = PRIVATE / f"read-range-{start:x}.json"
            read = load(read_path)
            result = read["normalized_result"]
            blob = bytes.fromhex(result["bytes_hex"])
            assert read["subject"]["digest"]["sha256"] == SHA and read["analysis_profile"]["digest"] == NATIVE
            assert result["complete"] and result["address"] == hex(start)
            assert result["returned_bytes"] == len(blob) == end - start + 1
            assert pe.read(start, len(blob)) == blob
            ranges.append({"start": hex(start), "end_inclusive": hex(end), "bytes": len(blob),
                           "file_offset": pe.file_offset(start, len(blob)), "sha256": sha(blob),
                           "native_loaded_image_read_evidence_id": read["evidence_id"],
                           "retained_read": identity(read_path)})
        assert sum(s["bytes"] for s in ranges) == body["total_bytes"] == row["body_bytes"]
        item["ranges"] = ranges
        assert row["procedure"] not in by_entry
        bodies.append(item)
        by_entry[row["procedure"]] = item
        assemblies[row["procedure"]] = assembly

    anchors = []

    def anchor(entry, claim, *needles):
        matches = []
        for needle in needles:
            selected = [s for s in assemblies[entry] if needle in s]
            assert selected, (entry, needle)
            matches.extend(s.split(":", 1)[0] for s in selected)
        owner = by_entry[entry]
        anchors.append({"claim": claim, "procedure": entry,
                        "body_evidence_id": owner.get("evidence_id", owner.get("assembly_evidence_id")),
                        "instruction_addresses": sorted(set(matches))})

    anchor("0x418db0", "group-and-order-metadata-plus-stack-cleanup", "0x1c9c", "0x1cdc", "0x1edc", "RET 0xc")
    anchor("0x418db0", "relative-order-tags-F-before-after", "PUSH 0x5d53e8", "PUSH 0x5d53ec", "PUSH 0x5d53f0")
    anchor("0x425790", "both-groups-before-filter-and-row-construction", "CALL 0x00418db0", "CALL 0x0041c9d0", "CALL 0x00418b60", "CALL 0x0043eaf0")
    anchor("0x425790", "selection-restore-or-no-selection", "PUSH 0x186", "CALL 0x00422580", "0x773c")
    anchor("0x41c9d0", "id-space-note-filter-uses-normalized-query", "PUSH 0x5d018c", "0x1694")
    anchor("0x420320", "edit-change-normalizes-query-and-rebuilds-only-step4", "CALL 0x0041c970", "0x1694", "CMP dword ptr [ESI + 0xa88], 0x4", "CALL 0x00425790")
    anchor("0x423910", "filter-timer-and-query-reset", "CMP EAX, 0x36d", "0x1694")
    anchor("0x41cc70", "reorder-query-guard-and-order-undo-publication", "0x1694", "0x1998")
    anchor("0x420740", "dynamic-search-edit29200", "0x421b51: PUSH 0x7210", "0x421b4b: LEA ECX, [EDI + 0x1580]", "0x421b69: CALL 0x00450f23")
    anchor("0x420740", "dynamic-search-toggle29201", "0x421bf1: PUSH 0x7211", "0x421c4a: CALL dword ptr [EAX + 0x164]")
    anchor("0x420740", "dynamic-auxiliary-list32528", "0x421399: PUSH 0x7f10", "0x421393: LEA ECX, [EDI + 0x19a0]")
    anchor("0x420740", "dynamic-preset-chooser7901", "0x421713: PUSH 0x1edd", "0x421738: CALL dword ptr [EAX + 0x164]")
    anchor("0x41f2c0", "dynamic-context-action7926-production-and-direct-dispatch", "0x41f514: PUSH 0x1ef6", "0x41f6b8: CMP ESI, 0x1ef6", "0x41f6c2: CALL 0x00422fc0")
    anchor("0x403040", "childview-construction-and-embedded-main", "0x40307f: MOV dword ptr [ESI], 0x5cfff4", "0x40308c: LEA ECX, [ESI + 0x1a8]")
    anchor("0x40bf80", "game-code-type-and-record-stride", "0x40c83b: CMP ESI, 0xf", "0x40c844: IMUL EAX, ESI, 0xa4", "PUSH 0x5d0ba8", "0x40c890: MOV dword ptr [EDI + 0x98], EAX")
    anchor("0x40bf80", "game-name-and-EXE-produce-preset-identity-fields", "0x40c89e: PUSH 0x5d0b2c", "0x40c8ce: CALL 0x004050a0", "0x40c8d3: PUSH 0x5d0bb0", "0x40c901: LEA ECX, [EDI + 0x4]", "0x40c904: CALL 0x004050a0")
    anchor("0x40bf80", "Galaxy-Gamecode-type-and-Name-plus-game-realm-membership-cap", "0x40c702: CMP ECX, 0xe", "0x40c714: PUSH 0x5d0b2c", "0x40c71f: MOV dword ptr [EBX + 0x3574], ECX", "0x40cc70: CMP dword ptr [EDI + 0x94], 0x14")
    anchor("0x422e20", "preparation-guard-cleared-before-failure-or-reentry", "0x422e3a: CMP byte ptr [EDI + 0x1a5e], 0x0", "0x422e4b: MOV byte ptr [EDI + 0x1a5e], 0x0", "CALL 0x00426c50", "CALL 0x00428a90", "CALL 0x0042d120")
    anchor("0x426c50", "recovery-rechecks-current-selection-and-computed-step", "0x1a64", "CALL 0x0041c060", "CALL 0x0042ca00", "CALL 0x0042d670", "CALL 0x0042cf10")
    anchor("0x408460", "patch-exit100-or102-with-bounded-retry", "CMP EBX, 0x64", "CMP EBX, 0x66", "CMP dword ptr [ESI + 0x2bb0], 0x3", "CALL 0x00422e20")
    anchor("0x40b010", "patch-process-poll-and-completion", "CMP EDI, 0x2329", "CMP dword ptr [EBP + 0x8], 0x103", "CALL 0x00408460")

    data = []
    for address, literal in ((0x5d53e8, b"F"), (0x5d53ec, b"B:"), (0x5d53f0, b"A:"),
                             (0x5d018c, b" "), (0x5d0ba8, b"Code"), (0x5d0bb0, b"EXE"), (0x5d0b2c, b"Name")):
        blob = literal + b"\0"
        assert pe.read(address, len(blob)) == blob
        data.append({"role": literal.decode("ascii"), "address": hex(address), "bytes": len(blob),
                     "file_offset": pe.file_offset(address, len(blob)), "sha256": sha(blob)})

    chain = vtable_info(pe, 0x5cfff4)
    assert chain == load(PRIVATE / "childview-message-chain.json")
    assert chain["rtti_type_name"] == ".?AVCChildView@@" and chain["observed_base_chain_closed"]
    own = chain["message_chain"][0]["entries"]
    assert [(r["message"], r["handler"]) for r in own] == [
        ("0x1", "0x40af60"), ("0xf", "0x40afe0"), ("0x113", "0x40b010"),
        ("0x80c9", "0x40a320"), ("0x80cc", "0x40af80")]

    experiment_path = PRIVATE / "prototype-experiment-family.json"
    experiment = load(experiment_path)
    receipt = load(PRIVATE / "prototype-family-comparison-receipt.json")
    script = PRIVATE / "scripts/CompareListFamilyPrototypes.java"
    assert receipt["artifact_sha256"] == sha(experiment_path.read_bytes())
    assert receipt["script_sha256"] == sha(script.read_bytes()) and receipt["headless_exit_code"] == 0
    assert experiment["source_sha256"] == experiment["original_source_sha256_after"] == SHA
    assert experiment["canonical_REA_dossier"] is False and experiment["original_process_executed"] is False
    derived = []
    for row in receipt["callers"]:
        entry = row["procedure"]
        before, after = experiment["callers_before"][entry], experiment["callers_after"][entry]
        assert before["instructions"] == after["instructions"] and before["ranges"] == after["ranges"]
        for instruction in after["instructions"]:
            blob = bytes.fromhex(instruction["bytes_hex"])
            assert pe.read(int(instruction["address"], 16), len(blob)) == blob
        assert len(after["instructions"]) == row["instructions"]
        assert sum(len(bytes.fromhex(r["bytes_hex"])) for r in after["instructions"]) == row["instruction_bytes"]
        assert before["pseudocode"].count("Removing unreachable block") == row["before_warnings"]
        assert after["pseudocode"].count("Removing unreachable block") == row["after_warnings"]
        derived.append({**row, "before_pseudocode_sha256": sha(before["pseudocode"].encode()),
                        "after_pseudocode_sha256": sha(after["pseudocode"].encode())})
    assert sum(r["instructions"] for r in derived) == 1624
    assert sum(r["instruction_bytes"] for r in derived) == 6267
    assert [(x["entry"], x["stack_purge"]) for x in experiment["helper_after"]] == [("0x00418db0", 12), ("0x0042b0a0", 4)]
    canonical_checks = []
    for entry in ("418db0", "42b0a0"):
        path = PRIVATE / f"canonical-after-prototype-experiment-{entry}.json"
        record = load(path)
        original = load(PRIVATE / f"launcher-function-{entry}.json")
        assert record["subject"]["digest"]["sha256"] == SHA
        assert record["analysis_profile"]["digest"] == NATIVE
        signature = record["normalized_result"]["signature"]
        assert signature == original["normalized_result"]["procedure"]["signature"]
        canonical_checks.append({"procedure": "0x" + entry, "retained_query": identity(path),
                                 "evidence_id": record["evidence_id"], "unchanged_signature": signature})
    diagnostics = {"authority": "analyst-inference", "canonical_native_dossier": False,
                   "artifact": identity(experiment_path), "receipt": identity(PRIVATE / "prototype-family-comparison-receipt.json"),
                   "script": identity(script), "parameter_storage_hypotheses": experiment["helper_after"], "callers": derived,
                   "canonical_signature_checks_after_experiment": canonical_checks,
                   "scope": "independent Ghidra import; original PE and caller instructions unchanged; canonical REA database not annotated",
                   "claim_limit": "Recovered high-level views support source review; warning removal alone does not establish full correctness."}

    historical = []
    for name in ("catalog", "metadata"):
        path = ROOT / f"analysis/launcher-current-{name}-v1/implementation-spec.json"
        target = load(path)["target"]
        digest = target.get("analysis_unpacked_sha256", target.get("unpacked_sha256"))
        assert digest == HISTORICAL and digest != SHA
        historical.append({"specification": identity(path), "analysis_sha256": digest,
                           "packed_sha256": target["packed_sha256"], "usable_as_c82f_body_evidence": False})
    source = {**identity(TARGET), "official_current_version_proven": False}
    summary = {"body_entries": len(bodies), "new_native_dossiers": sum(x["kind"] == "new-native" for x in bodies),
               "reused_native_dossiers": sum(x["kind"] == "reused-native" for x in bodies),
               "composed_reused_bodies": sum(x["kind"].startswith("composed-") for x in bodies),
               "range_reads": sum(len(x["ranges"]) for x in bodies),
               "range_bytes": sum(r["bytes"] for x in bodies for r in x["ranges"]),
               "semantic_anchor_groups": len(anchors), "data_ranges": len(data),
               "derived_prototype_views": len(derived), "derived_instructions": 1624, "derived_instruction_bytes": 6267}
    assert summary["body_entries"] == 49 and summary["range_bytes"] == 43452
    source_check = {"schema": "moli.capability.launcher-catalog-state-source-check.v1", "source": source,
                    "tools": {"rea": "6.7.0", "native_provider": "Ghidra 12.1.4", "native_profile_digest": NATIVE,
                              "reused_workflow_provider": "rea-workflow 1", "workflow_profile_digest": WORKFLOW},
                    "summary": summary, "bodies": bodies, "instruction_anchors": anchors, "data": data,
                    "childview_message_chain": chain, "independent_prototype_experiment": diagnostics,
                    "different_version_historical_contracts": historical,
                    "retained_reuse_ledgers": [identity(ROOT / p) for p in (
                        "build/analysis/capability-launcher-apply-v1/rea-launcher-evidence.json",
                        "build/analysis/launcher-current-patch-v1/rea-complete-path.json")],
                    "all_native_loaded_image_read_bytes_match_original_PE": True,
                    "read_memory_kind": "static Ghidra loaded image; not a process, VM or crash-dump memory capture",
                    "limitations": ["Canonical dossiers, composed reuse and analyst-derived prototype views retain separate identities.",
                                    "Complete source ranges do not establish every branch, runtime behavior or official acceptance.",
                                    "425790/41cc70 warning reduction occurs only in an independent import; canonical records remain unchanged.",
                                    "The two custom helper prototypes model caller-observed parameter storage; they are not recovered original declarations.",
                                    "Historical c7ba catalog/metadata contracts are not c82f body evidence."]}
    write("launcher-catalog-state-source-check.json", source_check)

    contract = {
        "schema": "moli.capability.launcher-catalog-state-contract.v1", "source": source,
        "source_check": "analysis/capability-first-v1/launcher-catalog-state-source-check.json",
        "capabilities": ["L01", "L02", "L03", "L04", "L05", "L08"],
        "facts": {
            "role_correction": {"field": "main+0x1694", "role": "normalized game-ID filter query",
                "superseded_label": "normalized account cache",
                "producer": "0x420320 handles control29200 edit notification768; trims/transforms input through0x41c970; rebuilds only in main step4",
                "consumers": ["0x41c9d0", "0x41cc70", "0x41fe80", "0x423910", "0x428c00"],
                "runtime_implementation_changed": False},
            "filter": {"entry": "0x41c9d0", "haystack": "received GameID + ASCII space + local note main+0x1b9c[rawIndex]",
                "transform": "same0x41c970 MBCS transformation used for query; exact locale behavior is pending",
                "rule": "empty query includes every supplied row; otherwise require nonnegative source __mbsstr match",
                "input_limit": "dynamic edit29200 is assigned limit64; not asserted as64 Unicode characters",
                "timer": "0x36d/100ms manages search visibility in step4 and clears query/edit when leaving; it does not submit login"},
            "raw_list": {"reply_entry": "0x423c30", "maximum_received_count": 64,
                "count_origin": "positive reply count is capped before row population; helper418db0 does not impose its own independent cap",
                "layout_scope": "fixed x86 implementation offsets; not portable wire fields",
                "group_byte": "main+0x1c9c[rawIndex]", "signed_pin_rank": "main+0x1cdc[rawIndex]",
                "relative_order_text": "main+0x1edc[rawIndex]"},
            "group_order": {"entry": "0x418db0", "output_precondition": "both output pointers nonzero; output count initially zero",
                "nonzero_group": "select exact group byte; stable insertion by signed rank ascending, equal ranks retain raw order",
                "group_zero_no_metadata": "append group0 raw indices in received order",
                "group_zero_with_metadata": [
                    "Append group0 empty-metadata rows in received order; keep other rows pending.",
                    "F inserts at front; repeated front insertion reverses the relative processing order of multiple F rows.",
                    "B:<raw GameID> inserts before the first matching group0 target; A:<raw GameID> inserts after it.",
                    "A known target not yet placed defers that row to another pass; missing targets or unknown prefixes use raw-index insertion fallback.",
                    "Repeat while a pass makes progress; append unresolved/cyclic pending rows in their remaining original order."],
                "comparison_boundary": "raw source string comparisons; no invented Unicode/lexical sort or cycle rejection"},
            "list_rebuild": {"entry": "0x425790", "view_basis": "canonical assembly plus independent source-identical prototype-derived view",
                "ordered_rules": [
                    "Capture selected raw index, clear the list and build group1 sequence followed by group0 sequence.",
                    "Filter each raw index through41c9d0, render through418b60, publish its raw-index item mapping.",
                    "Restore the previous raw index if it remains visible, then run422580 selection details.",
                    "Otherwise set selection to-1 and controller selected-ID field+0x773c to-1."],
                "other_group_flags": "the two normal calls select only1 then0; other byte values are not added by this path",
                "presentation": "418b60 adds local note/group/status decoration; this is not a new protocol field"},
            "reorder_boundary": {"entries": ["0x41fe80", "0x41cc70", "0x41bfa0"],
                "observed_conditions": "step4 ordinary list, empty filter query, valid source/target and same group for drag; destination midpoint chooses before/after",
                "mutation": "41cc70 rejects active filtering, invalid index/ordinal and no change; shifts group order, invokes416e40, marks+0x1998 order undo available and rebuilds",
                "metadata_names": ["GID_PIN_ORDER_V2_", "GID_PIN_", "GameIDNotes"],
                "pending": "complete key derivation, rank/tag rewrite persistence, import/export and custom-order/notes dialogs"},
            "dynamic_controls": [
                {"id": 29200, "kind": "search-edit", "owner": "main+0x1580", "producer": "0x420740@0x421b51"},
                {"id": 29201, "kind": "search-toggle", "owner": "main+0x1600", "producer": "0x420740@0x421bf1"},
                {"id": 32528, "kind": "auxiliary-list", "owner": "main+0x19a0", "producer": "0x420740@0x421399", "condition": "nonempty layout rectangle"},
                {"id": 7901, "kind": "preset-chooser-button", "owner": "main+0x1058", "producer": "0x420740@0x421713"}],
            "dynamic_context_action": {"id": 7926, "producer": "WM_CONTEXTMENU0x7b handler41f2c0 AppendMenuA/TrackPopupMenu",
                "dispatch": "returned ID7926 directly calls422fc0; the existing WM_COMMAND table binding is additional",
                "admission": "valid selected ID and no ordinary-login/preparation/modal/controller-work busy condition",
                "is_fifth_window_control": False,
                "other_observed_context_ids_hex": ["0x7201", "0x7202", "0x7203", "0x7204", "0x7205", "0x7206", "0x7209", "0x720a"],
                "pending": "complete semantics and persistence for these additional context actions"},
            "catalog": {"owner": "CChildView B = controller+0x120; embedded main=B+0x1a8",
                "producer": "0x40bf80", "paths": "0x408e50 resolves source catalog files; no host registry/filesystem behavior was executed",
                "game_rows": {"base": "B+0x2bd8", "stride": 164, "capacity": 15,
                    "Name": "row+0 text from child Name", "EXE": "row+4 text from child EXE", "Code": "attribute Code converted to integer at row+0x98",
                    "realm_indices": "row+0x44, count at+0x94, append capped20"},
                "preset_field_refinement": {"field2": "Game.EXE, not a proved installation path", "field4_when_required": "Galaxy.Name"},
                "Galaxy": "Gamecode determines type0..14; Name supplies per-realm Galaxy row name",
                "installation_helpers": ["0x4355f0", "0x435ad0"],
                "coverage": "selected same-c82f producer identities closed; full XML grammar, defaults/failure policy, installation predicates and bootstrap lifecycle still pending"},
            "startup_owner": {"constructor": "0x403040", "vtable": "0x5cfff4", "map": "0x5d04a8",
                "routes": {"WM_CREATE": "0x40af60→0x406290", "WM_TIMER": "0x40b010", "0x80c9": "0x40a320", "0x80cc": "0x40af80→0x4091c0"},
                "bootstrap": "406290 avoids duplicate worker/task, resolves paths and starts ordinary task406a00;40a320 handles task completion and can reach4091c0/40bf80",
                "complete_App_initialization_or_window_lifetime": False},
            "preparation": {"pending_flag": "main+0x1a5e", "recovery_step": "main+0x1a64",
                "computed_step": "41c060 returns2 only for valid current realm, game type0..14 and positive matching Galaxy count; otherwise1",
                "patch_completion": "408460 receives exit results;100 validates/marks selected game then calls422e20,102 increments retry count and relaunches only while count<3;101/other/failure report ordinary failure",
                "poll": "40b010 timer2329 polls patch process; code259 or query failure keeps pending; completion closes/clears handle before408460;30min warning does not force termination",
                "callback": "422e20 ignores results when pending flag is zero; otherwise clears it before either branch",
                "success": "set step3 and reenter42d120 through ordinary path, with optional tray hint",
                "failure": "mark/clear active preset, call426c50 then428a90",
                "recovery": "426c50 clears pending; valid game and display-name agreement choose step2 only when saved step2 and current41c060 still2, otherwise step1; invalid game/name chooses step0; refresh ordinary view/focus",
                "late_callback_limit": "pending-flag guard is not a generation token; no claim that all stale callback/close/reentry paths are closed"}
        },
        "inferences": ["Two explicit helper storage prototypes produce more complete source-identical caller views; original source declarations and all ABI uses are not proved.",
                       "Concentrated specification/reuse can avoid repeated implementation and validation work; no credible project-wide percentage or completion date follows from this group."],
        "remaining": ["Complete notes/pin/custom-order/import/export mutation and persistence plus exact MBCS locale behavior.",
                      "Complete c82f XML grammar, installation/path checks, bootstrap/error/cancel/cleanup and full App initialization.",
                      "All preparation cancellation, close/reentry, callback generation/owner lifetime and authentication retry branches;424cf0 warning remains separate.",
                      "Template296/30721/30734 uses and four non-App static menu routes; dynamic discoveries remain in scope.",
                      "Game common graphics/input/active callback dispatch and per-business lifecycle;647 located bodies are not647 closed capabilities.",
                      "Current-version game producer/consumer compatibility, real target platforms/devices and official session acceptance; no test account available."],
        "requirement_answers": [
            {"question": 1, "status": "partially-answered", "answer": "group/filter/rebuild/selection and source-identical omitted branches bound; metadata persistence and all local editing remain open"},
            {"question": 2, "status": "partially-answered", "answer": "same-c82f Game.Name/EXE/Code and Galaxy.Name producers bound; different-c7ba contracts qualified separately; full grammar/install behavior remains open"},
            {"question": 3, "status": "partially-answered", "answer": "computed recovery, callback guard, patch poll/exit and normal reentry bound; all late/cancel/close lifetimes remain open"},
            {"question": 4, "status": "partially-answered", "answer": "main initialization binds four controls and context action7926; CChildView startup map/source chain bound; full App/other dialogs/menus remain open"}],
        "original_execution": False, "account_or_session_observed": False, "runtime_features_changed": False,
        "all_capability_analysis_complete": False, "implementation_gate_passed": False,
        "official_acceptance": False, "full_goal_complete": False}
    write("launcher-catalog-state-contract.json", contract)
    print(json.dumps(summary, ensure_ascii=False))


if __name__ == "__main__":
    main()
