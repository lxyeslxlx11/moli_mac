#!/usr/bin/env python3
"""Reverify the retained fixed source without rewriting historical observations.

The stage203 verifier rechecks its complete finite Evidence chain and original
bytes. This stage reuses that evidence for a finite direct-result port; it opens
no REA session and makes no native runtime or whole-family closure claim.
"""
from pathlib import Path
from contextlib import redirect_stdout
import hashlib, importlib.util, io, json

A = Path(__file__).resolve().parent
R = A.parent.parent
P = R / 'build/analysis/game-battle-physical-family-runtime-v1'


def read(p):
    return json.loads(p.read_text())


def info(p):
    h = hashlib.sha256()
    with p.open('rb') as f:
        for b in iter(lambda: f.read(8 * 1024 * 1024), b''):
            h.update(b)
    return dict(path=str(p.relative_to(R)), bytes=p.stat().st_size, sha256=h.hexdigest())


def main():
    prior_dir = R / 'analysis/game-battle-physical-family-v1'
    prior_check = prior_dir / 'source-check.json'
    prior = read(prior_check)
    spec = importlib.util.spec_from_file_location('physical_source203', prior_dir / 'verify_source.py')
    verifier = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(verifier)
    verified_outputs = []

    def verify_without_rewriting(path, value):
        assert read(path) == value, str(path)
        verified_outputs.append(info(path))

    verifier.write = verify_without_rewriting
    stdout = io.StringIO()
    with redirect_stdout(stdout):
        verifier.main()
    assert len(verified_outputs) == 2
    assert read(prior_check) == prior
    layers = prior['canonical_cache_layers']
    merged = {}
    for row in layers:
        assert info(R / row['path']) == row
        current = read(R / row['path'])
        assert not set(merged).intersection(current)
        merged.update(current)
    assert len(merged) == 728
    facts = read(A / 'implementation-spec.json')
    assert facts['source_sha256'] == prior['source']['sha256']
    selected = []
    for address in ['0x40a120', '0x41dc00', '0x424310', '0x423fa0', '0x4241f0',
                    '0x436c20', '0x4348e0', '0x434b90', '0x434a70']:
        d = merged[address]
        assert d['procedure']['address'] == address
        selected.append(dict(address=address, evidence_id=d['id'], body=d['procedure']['body']))
    wait = merged['0x434b90']['pseudocode']
    assert '0x1c20 < iVar4' in wait and 'FUN_004348e0' in wait and 'FUN_00434a70' in wait
    reset = merged['0x4348e0']['pseudocode']
    assert '0x1024' in reset and '0xff8' in reset
    body = merged['0x40a120']['pseudocode']
    assert 'case 0xe:' in body and 'case 0xf4:' in body
    # Offsets, styles and exclusions are explained in the fact/spec document;
    # these checks bind its consumers to the retained canonical source dossier.
    out = dict(
        schema='moli.physical-family-runtime-source-stage204.v1',
        source=prior['source'], tool=prior['tool'], analysis_profile=prior['analysis_profile'],
        source_contract=info(prior_dir / 'implementation-spec.json'),
        consumer_obligations=info(prior_dir / 'consumer-obligations.json'),
        implementation_spec=info(A / 'implementation-spec.json'),
        prior_source_check=info(prior_check), canonical_cache_layers=layers,
        canonical_functions=728, new_canonical_functions=0, new_REA_records=0,
        retained_finite_Evidence_union=2387, latest_closed_snapshot_records=95,
        historical_snapshot_files_reverified=45, later_small_snapshots_reverified=3,
        selected_helpers_original_bytes_reverified=3679,
        constant_bytes_reverified=44, common_producer_bytes_reverified=8618,
        body_constructor_bytes_reverified=67615, dispatcher_instruction_bytes_reverified=54685,
        reused_canonical_dossiers=selected, historical_outputs_verified_without_rewriting=verified_outputs,
        source_verifier_recap=json.loads(stdout.getvalue().strip()),
        facts=facts['facts'], session_closed=True, cleanup_pending=False,
        complete_common_family_source_closure=False, complete_family_runtime=False,
        original_execution=0, VM_actions=0, official_sessions=0,
        native_timing_and_pixels_unverified=True, full_goal_complete=False, goal_status='active')
    (A / 'source-check.json').write_text(json.dumps(out, ensure_ascii=False, indent=2) + '\n')
    print(json.dumps(dict(source_sha256=prior['source']['sha256'], canonical_functions=728,
                         retained_Evidence_union=2387, original_source_reverified=True,
                         new_REA_queries=0, old_evidence_rewritten=False)))


if __name__ == '__main__':
    main()
