#!/usr/bin/env python3
"""Original source-contract vectors and independent float32 reference, without native assets or execution."""
from pathlib import Path
import importlib.util,json,math,random,struct
HERE=Path(__file__).resolve().parent;ROOT=HERE.parents[1]
spec=importlib.util.spec_from_file_location('wire',ROOT/'analysis/game-legacy-message-v1/generate_vectors.py');wire=importlib.util.module_from_spec(spec);spec.loader.exec_module(wire)
catalog=json.loads((HERE/'actor-catalog.json').read_text());M=catalog['math'];R=catalog['resource']
f=lambda x:struct.unpack('<f',struct.pack('<f',x))[0]
i32=lambda n:(n+2**31)%2**32-2**31
ALPHABET=b'0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
def split(raw,sep=124):
    raw=raw.split(b'\0',1)[0];out=[];start=at=0
    while at<len(raw):
        if raw[at]>=128:at+=2;continue
        if raw[at]==sep:out.append(raw[start:at]);start=at+1
        at+=1
    return out+[raw[start:]]
def inner(raw):
    raw=raw.split(b'\0',1)[0];out=bytearray();at=0
    while at<len(raw):
        byte=raw[at];at+=1
        if byte>=128:
            out.append(byte)
            if at<len(raw):out.append(raw[at]);at+=1
        elif byte==92:
            if at==len(raw):break
            byte=raw[at];at+=1;out.append({110:10,99:44,122:124,121:92}.get(byte,byte))
        else:out.append(byte)
    return bytes(out)
def decimal(raw):
    raw=raw.lstrip(b' \t\n\r\v\f');sign=1
    if raw[:1] in [b'+',b'-']:
        sign=-1 if raw[:1]==b'-' else 1;raw=raw[1:]
    n=0
    for b in raw:
        if not 48<=b<=57:break
        n=i32(n*10+b-48)
    return i32(n*sign)
def base62(raw):
    n=0;sign=1
    for b in raw:
        n=i32(n*62)
        if b==45:sign=-1
        elif b in ALPHABET:n=i32(n+ALPHABET.index(b))
        else:return 0
    return i32(n*sign)
def tok(row,n,cap=2047):return (row[n-1] if n<=len(row) else b'')[:cap]
def zero(row,n):return decimal(tok(row,n))
def missing(row,n):
    raw=tok(row,n,127);return decimal(raw) if raw else -1
def units(raw):
    rows=split(raw,9);out=[];ignored=truncated=0
    for at,original in enumerate(rows):
        if not original:
            if at==len(rows)-1:break
            ignored+=1;continue
        truncated+=len(original)>2047;row=split(original[:2047])
        if tok(row,11):
            out.append(dict(kind='character',id=base62(tok(row,2)),category=missing(row,1),coordinates=[zero(row,3),zero(row,4)],facingCode=zero(row,5),rawResourceId=zero(row,6),value7=zero(row,7),value8=missing(row,8),
                label0Hex=inner(tok(row,9,255)).hex(),compositeHex=inner(tok(row,10,255)).hex(),flag11=zero(row,11),flag12=zero(row,12),unused13=zero(row,13),label4Hex=inner(tok(row,14,255)).hex(),mode15=zero(row,15),value16=zero(row,16),attachmentHex=tok(row,17).hex()))
        elif tok(row,6):out.append(dict(kind='graphic-object',id=base62(tok(row,1)),coordinates=[zero(row,2),zero(row,3)],rawResourceId=zero(row,4),facingCode=0,value5=missing(row,5),labelHex=inner(tok(row,6,1023)).hex(),value7=missing(row,7)))
        elif tok(row,4):
            amount=zero(row,4);index=sum(amount>=t for t in catalog['units']['value_object']['thresholds']);label=str(amount).encode()+bytes.fromhex(catalog['units']['value_object']['suffix_hex'])
            out.append(dict(kind='value-object',id=base62(tok(row,1)),coordinates=[zero(row,2),zero(row,3)],rawResourceId=0x6b08+index,facingCode=0,amount=amount,labelHex=label.hex()))
        else:ignored+=1
    return dict(kind='actor-list',records=out,ignoredRecords=ignored,truncatedRecords=truncated)
def actions(raw):
    rows=split(raw,44);out=[];truncated=0;stop=len(rows)
    for i,original in enumerate(rows):
        if not original:stop=i;break
        truncated+=len(original)>2047;row=split(original[:2047]);action=missing(row,4)
        out.append(dict(id=base62(tok(row,1)),coordinates=[missing(row,2),missing(row,3)],action=action,facingCode=missing(row,5),parameters=[missing(row,n) for n in [6,7,8]],coordinated=action in [81,82],coordinatedFields=[missing(row,n) for n in range(6,13)] if action in [81,82] else None))
    return dict(kind='actor-actions',records=out,truncatedRecords=truncated,ignoredAfterEmpty=max(0,len(rows)-stop-1))
def removals(raw):
    ids=[]
    for token in split(raw,44):
        token=token[:127];n=base62(token) if token else -1
        if n==-1:break
        ids.append(n)
    return dict(kind='actor-removals',ids=ids)
def facing(x,y):
    x,y=f(x),f(y);angle=0
    if x or y:
        big=max(abs(x),abs(y));small=min(abs(x),abs(y));ratio=small/big*64;index=int(ratio);fraction=f(ratio-index)
        a=f(M['direction_table'][index]*(1-fraction)+M['direction_table'][min(64,index+1)]*fraction)
        if abs(x)>=abs(y):angle=(180+a if y<0 else 180-a) if x<0 else (360-a if y<0 else a)
        else:angle=(270-a if y<0 else 90+a) if x<0 else (270+a if y<0 else 90-a)
    angle=f(angle+M['direction_offset'])
    angle=f(angle%360)
    return int(angle*M['direction_sector_multiplier'])
def grade(value):
    if R['base_grade_zero'][0]<=value<=R['base_grade_zero'][1]:return 0
    for lo,hi,n in R['class_ranges']:
        if lo<value<hi:return n
    lo,hi=R['final_grade6_range'];a,b=R['final_grade6_excluded_inclusive'];return 6 if lo<value<hi and not a<=value<=b else 0
def resource(value,code):
    g=grade(value);cap=0 if code<3 else 3 if code<7 else 6 if code==7 else 7
    if g==0 or cap>=g:return value
    if g==3:return value-5000
    return next((new for lo,hi,new in R['fallback_ranges'] if lo<value<hi),-1)
def motion(origin,speed,targets,frames):
    target=origin[:];pos=[f(v*64) for v in origin];queue=[];velocity=[0,0];display=origin[:];moving=False;anim=phase=face=0
    for point in targets:
        if len(queue)<10:queue.append(point[:])
        else:queue=[];target=point[:];pos=[f(v*64) for v in point];velocity=[0,0];display=point[:]
    states=[]
    for _ in range(frames):
        if pos==[f(v*64) for v in target] and queue:
            count=len(queue);target=queue.pop(0);factor=M['queue_factors'][0 if count<2 else 1 if count<4 else 2 if count<6 else 3];rate=f(speed*factor*M['speed_scale'])
            dx=target[0]*64-pos[0];dy=target[1]*64-pos[1];dy32=f(dy);length=f(math.sqrt(dx*dx+dy*dy32));nx=f(dx/length) if length>0 else 0;ny=f(dy32/length) if length>0 else 0
            velocity=[f(nx*rate*M['step_scale']),f(ny*rate*M['step_scale'])]
            if nx or ny:face=facing(nx,ny);moving=True
        if velocity==[0,0]:
            if moving:anim=0
            moving=False
        else:
            endpoint=[f(v*64) for v in target];distance=sum((a-b)**2 for a,b in zip(endpoint,pos));step=sum(v*v for v in velocity)
            if step<distance:pos=[f(a+b) for a,b in zip(pos,velocity)]
            else:pos=endpoint;velocity=[0,0]
            anim=1
        display=[math.trunc(v*M['inverse_grid']) for v in pos]
        states.append(dict(target=target[:],position=pos[:],display=display[:],velocity=velocity[:],queue=[p[:] for p in queue],facingCode=face,speed=speed,moving=moving,animation=anim,phase=phase))
    return states

def main():
    rng=random.Random(157);character=b'1|1C|2|3|4|100111|77|8|Hero|Guild\\zBadge\\zNote|1|0|999|Tail|0|0|attachment'
    graphic=b'3f|1|1|30001|5|Object|7';value=b'3g|4|1|5000';remote=character.replace(b'1C',b'3e').replace(b'Hero',b'Remote')
    unit_inputs=[b'',b'\t',b'unknown',character,graphic,value,character+b'\t\t'+graphic+b'\t'+value+b'\t',b'1|2|3',b'1|2|3|0',b'\x81\t|1|2|3|4|G|0',b'1|2|3|4|5|X\0ignored']
    for n in [-10,0,49,50,99,100,999,1000,4999,5000,9999,10000,49999,50000,99999,100000,499999,500000,999999,1000000]:unit_inputs.append(b'3|2|3|'+str(n).encode())
    for size in [16,17,255,256,1023,1024,2047,2048]:
        unit_inputs += [character.replace(b'Hero',b'A'*size),b'3|1|1|30001|5|'+b'B'*size+b'|7']
    unit_inputs += [character.replace(b'1|1C|',b'|1-2|').replace(b'|77|',b'|4294967295tail|'),character.replace(b'Hero',b'Raw\x81|Pair\\yTail\\'),character+b'\0'+graphic]
    action_inputs=[b'',b',',b'1',b'1|2|3|1|7|100|4|5',b'1|2|3|81|7|1|2|3|4|5|6|7',b'1|2|3|82',b'1|2|3|40|7|0',b'1|2|3|1|7|100,,2|0|0|0',b'1|2|3|1|7|100,2|4|5|51|2,',b'1-2|  +7tail|-4294967297|30|6|-1|0|5',b'Z'*2048+b'|1|1|1',b'1|'+b'9'*128+b'|3|1|7|100',b'\x81,|2|3|1|7|100']
    remove_inputs=[b'',b',',b'1,2,3',b'1,,2',b'1,-1,2',b'1-2,!',b'Z'*128+b',2',b'1\0,2',b'\x81,1,2']
    direction_inputs=[(0,0)]+[(x,y) for x in [-64,-1,0,1,64] for y in [-64,-1,0,1,64]]
    direction_inputs += [(rng.uniform(-100,100),rng.uniform(-100,100)) for _ in range(180)]
    for i in range(65):direction_inputs += [(64,i),(i,64),(-64,i),(64,-i)]
    motion_cases=[]
    for count in [1,2,3,4,5,6,10,11]:
        for speed in [0,50,100,1000,-1]:
            origin=[-2,3];targets=[[i-1,4+(i%2)] for i in range(count)];motion_cases.append(dict(origin=origin,speed=speed,targets=targets,frames=20,expected=motion(origin,speed,targets,20)))
    for origin,targets,speed,frames in [([0,0],[[1,0]],100,18),([0,0],[[0,0]],100,2),([2,-3],[[-1,-6]],73,70),([33554430,-33554430],[[33554431,-33554431]],100,5)]:motion_cases.append(dict(origin=origin,targets=targets,speed=speed,frames=frames,expected=motion(origin,speed,targets,frames)))
    boundary={-2147483648,-1,0,100000,0x192be,2147483647}
    for pair in [R['base_grade_zero'],R['final_grade6_range'],R['final_grade6_excluded_inclusive']]+[r[:2] for r in R['class_ranges']+R['fallback_ranges']]:
        for n in pair:boundary.update([n-1,n,n+1])
    resources=[dict(value=n,code=c,grade=grade(n),expected=resource(n,c)) for n in sorted(boundary) for c in [0,2,3,6,7,8,0xffffffff]]
    projections=[]
    for position,camera,center in [([0,0],[0,0],[320,240]),([128,192],[64,64],[320,240]),([-65.5,127.75],[3,-4],[200,100])]+[([rng.uniform(-20000,20000),rng.uniform(-20000,20000)],[rng.uniform(-200,200),rng.uniform(-200,200)],[360,250]) for _ in range(20)]:
        p=list(map(f,position));c=list(map(f,camera));u=(p[0]-c[0])/64;v=(p[1]-c[1])/64;projections.append(dict(position=position,camera=camera,center=center,expected=[f((u+v)*32+center[0]),f((v-u)*24+center[1])]))
    dispatch=json.loads((ROOT/'analysis/game-legacy-message-v1/dispatch-catalog.json').read_text());incoming={r['consumer']:r for r in dispatch['incoming'] if r.get('consumer')};outgoing={r['id']:r for r in dispatch['outgoing']}
    scene=[7,23,6,5,2,3,111,-22,1,0,-1,99];changed=scene[:];changed[1]=24;changed[11]=101
    msg=lambda address,values:wire.message(incoming[address],values).hex()
    speed_mask=wire.integer(1<<18)+b'|80'
    before=[msg('0x4f2bb0',[100,0,1,0]),msg('0x4ef870',scene),msg('0x4f0000',[speed_mask]),msg('0x4f16d0',[character+b'\t'+remote+b'\t'+graphic+b'\t'+value]),msg('0x4f2010',[b'3e|5|3|1|7|100|0|0'])]
    after=[msg('0x4f2010',[b'1C|0|0|1|5|-2|0|0']),msg('0x4ef840',[4,2,6]),msg('0x4f2260',[b'3f']),msg('0x4ef870',changed),msg('0x4f2260',[b'1C'])]
    boot=json.loads((ROOT/'analysis/game-legacy-scene-v1/original-vectors.json').read_text())['bootstrap']
    directions=bytes([0,1,2,3,4,5,6,7]);request=wire.message(outgoing['send-004f6470'],[2,3,bytes(b+97 for b in directions),99])
    result=dict(schema='moli.original-actors-vectors-stage157.v1',original_synthetic_only=True,source_profile=catalog['source_sha256'],bootstrap=boot,
        unitCases=[dict(dataHex=b.hex(),expected=units(b)) for b in unit_inputs],actionCases=[dict(dataHex=b.hex(),expected=actions(b)) for b in action_inputs],removeCases=[dict(dataHex=b.hex(),expected=removals(b)) for b in remove_inputs],
        directionCases=[dict(x=x,y=y,expected=facing(x,y)) for x,y in direction_inputs],motionCases=motion_cases,resourceCases=resources,projectionCases=projections,
        protocol=dict(beforePlainHex=before,afterPlainHex=after,requestPlainHex=request.hex(),directionsHex=directions.hex(),scene=scene,finalScene=changed,effectKinds=['actor-context','scene-transition','masked-state-update','actor-list','actor-actions','actor-actions','network-position','actor-removals','scene-transition','actor-removals']))
    (HERE/'original-vectors.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n');print(json.dumps({k:len(result[k]) for k in result if k.endswith('Cases')}))
if __name__=='__main__':main()
