#!/usr/bin/env python3
"""Extract source-bound actor operation identities and mathematical constants; no native code export."""
from pathlib import Path
import json,struct
ROOT=Path(__file__).resolve().parents[2];HERE=Path(__file__).resolve().parent;PRIVATE=ROOT/'build/analysis/game-legacy-actors-v1'
def extract():
    records=json.loads((PRIVATE/'rea-final.json').read_text())['records']
    functions={r['normalized_result']['procedure']['address']:r for r in records if r['operation']=='analyze_function'}
    reads={r['normalized_result']['address']:bytes.fromhex(r['normalized_result']['bytes_hex']) for r in records if r['operation']=='read_bytes'}
    source=json.loads((ROOT/'analysis/game-legacy-message-v1/dispatch-catalog.json').read_text())['incoming']
    operations=[]
    for kind,address in [('context','0x4f2bb0'),('units','0x4f16d0'),('actions','0x4f2010'),('remove','0x4f2260')]:
        message=next(r for r in source if r['consumer']==address)
        operations.append(dict(kind=kind,id=message['id'],tag=message['tag'],consumer=address,evidence_id=functions[address]['evidence_id']))
    scalars={a:struct.unpack('<f',reads[a])[0] for a in ['0x52d3a0','0x52d3d4','0x52d3e4','0x52d400','0x52d534','0x52dd90']}
    factor16,factor12,step,inverse=struct.unpack('<4f',reads['0x52d934']);sector,offset=struct.unpack('<2f',reads['0x52dd88'])
    math=dict(direction_table=list(struct.unpack('<65d',reads['0x53e548'])),direction_table_address='0x53e548',direction_sector_multiplier=sector,direction_offset=offset,
      queue_factors=[1.0,factor12,factor16,2.0],speed_scale=scalars['0x52d3a0'],step_scale=step,inverse_grid=inverse,
      projection=[scalars['0x52d534'],scalars['0x52dd90']],native_default_center=list(struct.unpack('<2i',reads['0x53d578'])))
    resource=dict(base_grade_zero=[100000,0x192be],class_ranges=[
      [0x19a27,0x19bd0,3],[0x19e0f,0x19e41,1],[0x19e41,0x19ebe,2],[0x19f09,0x19f3b,1],[0x19f3b,0x19fb8,2],
      [0x18a23,0x18a27,2],[0x1a1f7,0x1a5df,2],[0x19fb8,0x1a04a,2],[0x1a067,0x1a103,2],
      [0x1aedb,0x1af0e,6],[0x1af27,0x1af40,6],[0x1afa8,0x1b007,7],[0x1b0b1,0x1b0d0,7]],
      final_grade6_range=[0x1afa7,0x1c137],final_grade6_excluded_inclusive=[0x1bdfa,0x1be30],
      fallback_ranges=[[0x19e0f,0x19e41,0x18a24],[0x19e41,0x19ebe,0x18a24],[0x19f09,0x19f3b,0x18a25],[0x19f3b,0x19fb8,0x18a25],
        [0x1a1f7,0x1a5df,0x18a26],[0x19fb8,0x1a04a,0x18a24],[0x1a067,0x1a103,0x18a25],[0x1aedb,0x1af0e,0x18a26],
        [0x1af27,0x1af40,0x18a26],[0x1afa8,0x1b008,0x1b006],[0x1b0b1,0x1b0cf,0x1b006],[0x1afa7,0x1c137,0x18a26]])
    return dict(schema='moli.legacy-actor-catalog-stage157.v1',source_sha256='37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd',operations=operations,
      units=dict(separator=9,record_bytes=2047,branches=[dict(kind='character',nonempty_column=11,columns=17),dict(kind='graphic-object',nonempty_column=6,columns=7),dict(kind='value-object',nonempty_column=4,columns=4)],registry_capacity=1000,
        character=dict(decimal_minus_one=[1,8],base62=[2],decimal_zero=[3,4,5,6,7,11,12,13,15,16],inner_bytes=[9,10,14],raw_bytes=[17],name_maximum=16,secondary_maxima=[16,32,32],field13='parsed but not used by these consumers'),
        graphic_object=dict(base62=[1],decimal_zero=[2,3,4],decimal_minus_one=[5,7],inner_bytes=[6],label_maximum=60),
        value_object=dict(thresholds=[50,100,1000,5000,10000,50000,100000,500000,1000000],resources=list(range(0x6b08,0x6b12)),suffix_hex=reads['0x5678e4'][2:7].hex())),
      actions=dict(separator=44,record_bytes=2047,columns=['id','x','y','action','facing','parameter1','parameter2','parameter3'],coordinated_actions=[81,82],missing_id_dedup_capacity=4096),
      remove=dict(separator=44,field_bytes=127,terminator=-1),motion=dict(queue_capacity=10,default_speed=100,local_callback='separate world prediction, not remote43c700 tick'),math=math,resource=resource)
def product(catalog):
    data={k:catalog[k] for k in ['math','resource']}
    return '/** Source-bound mathematical parameters; no assets or executable code. */\nconst data = '+json.dumps(data,separators=(',',':'))+';\nfunction freeze(value){if(value&&typeof value==="object"){for(const child of Object.values(value))freeze(child);Object.freeze(value);}return value;}\nexport const LEGACY_GAME_ACTOR_DATA=freeze(data);\n'
if __name__=='__main__':
    d=extract();(HERE/'actor-catalog.json').write_text(json.dumps(d,ensure_ascii=False,indent=2)+'\n');print(json.dumps(dict(operations=4,direction_values=65,source_bound=True)))
