#!/usr/bin/env python3
"""Derive ordered masked-state metadata from retained source; never export pseudocode."""
from pathlib import Path
import json
import re
ROOT=Path(__file__).resolve().parents[2];HERE=Path(__file__).resolve().parent
PRIVATE=ROOT/'build/analysis/game-legacy-scene-v1'
def extract():
    bundle=json.loads((PRIVATE/'rea-final.json').read_text())
    functions={r['normalized_result']['procedure']['address']:r for r in bundle['records'] if r['operation']=='analyze_function'}
    messages=json.loads((ROOT/'analysis/game-legacy-message-v1/dispatch-catalog.json').read_text())['incoming'];records=[]
    for address,count in [('0x4efad0',30),('0x4f0000',18)]:
        dossier=functions[address];text=dossier['normalized_result']['pseudocode'];message=next(row for row in messages if row['consumer']==address)
        blocks=re.split(r'    if \(\(uVar[12] & (0x[0-9a-f]+|\d+)\) != 0\) \{',text)[1:];fields=[]
        assert len(blocks)==2*count
        for i in range(0,len(blocks),2):
            mask=int(blocks[i],0);body=blocks[i+1];ordinal=i//2+1;assert mask==(1<<ordinal)|1
            direct=re.search(r'_?DAT_00([0-9a-f]+) = FUN_00510e50',body)
            wrapped=re.search(r'_?DAT_00([0-9a-f]+) = local_20c;',body)
            byte_field=re.search(r'pcVar8 = &DAT_00([0-9a-f]+);',body)
            selected=direct or wrapped or byte_field;assert selected
            field=dict(id='field-{:02d}'.format(ordinal),ordinal=ordinal,mask=mask,native_storage='0x'+selected.group(1),kind='int32' if direct or wrapped else 'bytes')
            if wrapped:field['native_wrapped_value']=True
            if byte_field:field.update(token_bytes=255,maximum_decoded_bytes=16,overlong='keep-prior-value')
            if address=='0x4f0000' and ordinal==18:field.update(nonpositive_replacement=100,native_actor_copy='unmodeled pointer00f5e8dc+0x284')
            fields.append(field)
        records.append(dict(id='state-'+address[2:],operation_id=message['id'],tag=message['tag'],consumer=address,evidence_id=dossier['evidence_id'],fields=fields))
    return dict(schema='moli.legacy-masked-state-catalog-stage156.v1',source_sha256='37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd',
      scope='ordered source slots; game attribute names are unassigned',mask_rule='(flags & field.mask) != 0; bit0 selects all known fields',records=records)
def product(catalog):
    data=[{k:r[k] for k in ['id','operation_id','tag','consumer','fields']} for r in catalog['records']]
    return '/** Generated source metadata only; attribute names remain unassigned. */\nconst data = '+json.dumps(data,ensure_ascii=False,separators=(',',':'))+';\nfor (const record of data) { for (const field of record.fields) Object.freeze(field); Object.freeze(record.fields); Object.freeze(record); }\nexport const LEGACY_GAME_STATE_CATALOG=Object.freeze(data);\n'
if __name__=='__main__':
    result=extract();(HERE/'state-catalog.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n')
    print(json.dumps(dict(records=len(result['records']),fields=sum(len(r['fields']) for r in result['records']),source_only_metadata=True)))
