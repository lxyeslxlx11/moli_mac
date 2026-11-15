#!/usr/bin/env python3
"""Independent logical constructor/order cases from fixed source roles. Original synthetic values only."""
from pathlib import Path
import itertools,json,hashlib
A=Path(__file__).resolve().parent
def main():
    rows=[]
    for order,xy,facing,resource,speed in itertools.product(['identity-scene-position-unit','scene-position-identity-unit','identity-position-scene-unit','identity-unit-scene'],[(2,3),(-2,5),(0,0),(7,1)],[0,4,7],[100001,121111],[1,37,100]):
        # A main9 object already exists before C0 in the first three orders.
        # C0 therefore changes resource/labels, preserving the source global facing/position.
        network=[xy[0]+3,xy[1]-1];unit=[xy[0]+9,xy[1]+7];unit_facing=(facing+2)%8
        expected_point=list(xy) if order in ['identity-position-scene-unit','identity-unit-scene'] else network
        expected_facing=unit_facing if order=='identity-unit-scene' else facing
        rows.append(dict(order=order,identity=100,scene=list(xy),network=network,facing=facing,unitCoordinates=unit,unitFacing=unit_facing,resource=resource,speed=speed,
                         expected=dict(id=100,coordinates=expected_point,position=[x*64 for x in expected_point],facing=expected_facing,resource=resource,speed=speed,value7=77,label0='UnitHero',label1='UnitGuild')))
    result=dict(schema='moli.local-bootstrap-original-vectors-stage170.v1',original_synthetic_only=True,authority='independent Python arithmetic and native argument/order contract; no product imports or original runtime',cases=rows,
                distinctions=dict(selectedAppearance=123456,numericField15=987654,localIdentity=100,currentResource=100001),
                readiness=dict(initial=3,afterLocalUnit=1,afterMap=2,afterBoth=0),full_native_initialization=False)
    raw=(json.dumps(result,indent=2)+'\n').encode();(A/'original-vectors.json').write_bytes(raw);print(json.dumps(dict(cases=len(rows),bytes=len(raw),sha256=hashlib.sha256(raw).hexdigest())))
if __name__=='__main__':main()
