#!/usr/bin/env python3
"""Offline integration check: fixed samples, evidence links and unchanged runtime code.
Does not execute a target, fetch a URL, or inspect a running process.
"""
import argparse, hashlib, importlib.util, json, re, subprocess, sys
from pathlib import Path

HERE=Path(__file__).resolve().parent
ROOT=HERE.parent.parent

def sha(data):return hashlib.sha256(data).hexdigest()
def load_module(name,path):
    spec=importlib.util.spec_from_file_location(name,path);module=importlib.util.module_from_spec(spec);spec.loader.exec_module(module);return module

def main():
    p=argparse.ArgumentParser(description=__doc__)
    for name in ['launcher','updater','patcher','http-dossier','updater-dossier-dir']:p.add_argument('--'+name,required=True,type=Path)
    a=p.parse_args()
    launch=load_module('stage3_launch',HERE/'launch/verify_launch.py')
    launch_result=launch.verify(a.launcher.read_bytes(),json.loads((HERE/'launch/launch-evidence.json').read_text()))
    http=load_module('stage3_http',HERE/'http-helper/verify_http_helper.py')
    http_result=http.inspect(a.launcher,a.http_dossier)
    consumer=json.loads(subprocess.check_output([sys.executable,str(HERE/'updater/verify_consumer.py'),'--sample',str(a.updater),'--dossier-dir',str(a.updater_dossier_dir)],text=True))
    patcher_manifest=json.loads((HERE/'game-network/patcher-anchors.json').read_text())
    data=a.patcher.read_bytes()
    if sha(data)!=patcher_manifest['sample_sha256']:raise ValueError('Patcher sample mismatch')
    pe_module=load_module('stage3_pe',HERE/'game-network/scan_network_static.py');pe=pe_module.PE(a.patcher)
    if sha(pe.data)!=patcher_manifest['sample_sha256']:raise ValueError('Patcher changed while reading')
    for x in patcher_manifest['anchors']:
        offset=pe.file(int(x['va'],16));length=x['length']
        if offset!=int(x['file_offset'],16) or offset+length>len(data):raise ValueError('Patcher anchor mapping mismatch')
        content=data[offset:offset+length]
        if ('bytes' in x and content.hex()!=x['bytes']) or ('sha256' in x and sha(content)!=x['sha256']):raise ValueError('Patcher anchor mismatch')
    matrix_path=ROOT/'analysis/protocol-v2/spec-matrix.json';matrix=json.loads(matrix_path.read_text());ids=[x['id'] for x in matrix['specs']]
    if len(set(ids))!=20:raise ValueError('Specification identity mismatch')
    counts={name:sum(x['status']==name for x in matrix['specs']) for name in ['observed','inferred','unknown']}
    if counts!={'observed':6,'inferred':1,'unknown':13}:raise ValueError('Unexpected specification promotion')
    for x in matrix['specs']:
        if not set(x['dependencies'])<=set(ids):raise ValueError('Unknown specification dependency')
        if not all((matrix_path.parent/e).exists() for e in x['evidence']):raise ValueError('Missing specification evidence')
    docs=[ROOT/'README.md',ROOT/'AGENTS.md',*ROOT.glob('reports/*.md'),*HERE.rglob('*.md')]
    for f in docs:
        for value in re.findall(r'\]\(([^)]+)\)',f.read_text()):
            target=value.strip('<>').split('#')[0]
            if target and '://' not in target and not (f.parent/target).exists():raise ValueError(f'Missing link {f.name}: {target}')
    prior=json.loads((ROOT/'analysis/delivery-manifest-stage2.json').read_text());checked=[]
    for x in prior['files']:
        rel=Path(x['path'])
        if rel.parts[0] in ['native','shared','web'] and rel.suffix in ['.swift','.mjs','.html','.css']:
            if sha((ROOT/rel).read_bytes())!=x['sha256']:raise ValueError('Runtime source changed: '+str(rel))
            checked.append(str(rel))
    print(json.dumps({'passed':True,'scope':'Static evidence integration, not protocol compatibility or target runtime tests',
      'launch_anchors':launch_result['count'],'updater_anchors':consumer['anchor_count'],'updater_range_hashes':consumer['range_hash_count'],
      'updater_REA_receipts':len(consumer['REA_receipts']),'http_anchors':len(http_result['anchors']),'patcher_anchors':len(patcher_manifest['anchors']),
      'negative_checks':{'updater':consumer['negative_checks'],'http':http_result['negative_identity_checks']},
      'specification_counts':counts,'evidence_dependencies_and_document_links':'passed',
      'unchanged_runtime_sources':checked,
      'not_run':['Windows target execution','HTTP or game connections','account or running shared memory inspection','browser file import','game protocol compatibility']},ensure_ascii=False,indent=2))
if __name__=='__main__':main()
