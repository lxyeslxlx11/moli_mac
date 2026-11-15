#!/usr/bin/env python3
"""Check exact-sample static evidence; never execute the analyzed PE.

Run with --sample and optionally --dossier-dir for the temporary REA receipts.
Reuses the narrowly scoped lifecycle verifier; no network or target loading.
"""
import argparse
import copy
import hashlib
import importlib.util
import json
from pathlib import Path
import tempfile


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--sample', type=Path, required=True)
    parser.add_argument('--dossier-dir', type=Path)
    args = parser.parse_args()
    root = Path(__file__).resolve().parent
    spec = importlib.util.spec_from_file_location('lifecycle_verifier', root / 'lifecycle/verify_lifecycle.py')
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    consumer = json.loads((root / 'consumer-evidence.json').read_text())
    lifecycle = json.loads((root / 'lifecycle/lifecycle-evidence.json').read_text())
    results = {name: module.verify(args.sample, manifest)
               for name, manifest in [('consumer', consumer), ('lifecycle', lifecycle)]}
    receipts = []
    if args.dossier_dir:
        for record in consumer['rea_sources']:
            data = (args.dossier_dir / record['temporary_file']).read_bytes()
            assert hashlib.sha256(data).hexdigest() == record['sha256'], 'REA receipt SHA mismatch'
            dossier = json.loads(data)
            assert dossier['evidence_id'] == record['evidence_id'], 'REA evidence ID mismatch'
            assert dossier['subject']['digest']['sha256'] == consumer['sample']['sha256'], 'REA source mismatch'
            receipts.append({'evidence_id': record['evidence_id'], 'passed': True})

    # Original tiny input: proves the version gate rejects unrelated material.
    with tempfile.TemporaryDirectory(prefix='moli-consumer-evidence-') as tmp:
        other = Path(tmp) / 'original-not-a-target.bin'
        other.write_bytes(b'Original synthetic wrong-sample fixture.\n')
        try:
            module.verify(other, consumer)
        except ValueError as error:
            assert 'SHA256 mismatch' in str(error)
        else:
            raise AssertionError('wrong sample was accepted')

    changed = copy.deepcopy(consumer)
    changed['anchors'][0]['expected'] = '00'
    try:
        module.verify(args.sample, changed)
    except AssertionError:
        pass
    else:
        raise AssertionError('incorrect byte anchor was accepted')

    identifiers = [a['id'] for a in consumer['anchors']]
    assert len(identifiers) == len(set(identifiers)), 'duplicate consumer anchor ID'
    assert {a['kind'] for a in consumer['anchors']} <= {'direct_call', 'iat_call', 'ascii_literal', 'bytes'}
    for item in consumer['slots']:
        assert set(item['anchor_ids']) <= set(identifiers), 'unknown slot anchor reference'
    for item in consumer['observations']:
        assert set(item['anchors']) <= set(identifiers), 'unknown observation anchor reference'

    print(json.dumps({
        'passed': True,
        'source_sha256': consumer['sample']['sha256'],
        'anchor_count': sum(x['anchors_passed'] for x in results.values()),
        'range_hash_count': sum(x['reviewed_range_hashes_passed'] for x in results.values()),
        'parts': results,
        'REA_receipts': receipts,
        'negative_checks': {'wrong_sample_rejected': True, 'wrong_anchor_rejected': True},
        'schema_and_reference_checks': 'passed',
        'not_run': ['Windows target execution', 'network or HTTP request', 'package/digest runtime vector',
                    'file replacement or process launch', 'account or official server session'],
        'limits': ['Passing means exact hashes, call/literal encodings and references match this one sample.',
                   'Manual dataflow, library semantic labels and runtime behavior need separate assessment.']
    }, ensure_ascii=False, indent=2))


if __name__ == '__main__':
    main()
