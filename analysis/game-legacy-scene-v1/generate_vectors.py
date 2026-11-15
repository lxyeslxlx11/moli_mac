#!/usr/bin/env python3
"""Original scene/cache, masked-state, label and byte-stream reference fixtures."""
from pathlib import Path
import importlib.util,json,random,re,struct
HERE=Path(__file__).resolve().parent;ALPHABET=b'0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
def integer(n):
    sign=b'-' if n<0 else b'';n=abs(n);out=b''
    while True:
        n,d=divmod(n,62);out=ALPHABET[d:d+1]+out
        if n==0:return sign+out
def signed(n):return (n+2**31)%2**32-2**31
def base62(raw):
    n=0;sign=1
    for b in raw:
        n*=62
        if b==45:sign=-1
        elif b in ALPHABET:n+=ALPHABET.index(b)
        else:return 0
    return signed(n*sign)
def decimal(raw):
    match=re.match(br'[\t\n\v\f\r ]*([+-]?)([0-9]*)',raw);digits=match[2]
    n=int(digits or b'0');return signed(-n if match[1]==b'-' else n)
def fields(raw):
    raw=raw.split(b'\0',1)[0];output=[];at=0;start=0
    while at<len(raw):
        if raw[at]>=128:at+=2;continue
        if raw[at]==124:output.append(raw[start:at]);start=at+1
        at+=1
    return output+[raw[start:]]
def unescape(raw):
    raw=raw.split(b'\0',1)[0];out=bytearray();at=0;table={110:10,99:44,122:124,121:92}
    while at<len(raw):
        b=raw[at];at+=1
        if b>=128:
            out.append(b)
            if at<len(raw):out.append(raw[at]);at+=1
        elif b==92:
            if at==len(raw):break
            out.append(table.get(raw[at],raw[at]));at+=1
        else:out.append(b)
    return bytes(out)
def encoded(value):return dict(bytesHex=value.hex()) if isinstance(value,bytes) else value
def record(spec,raw):
    tokens=fields(raw);first=tokens[0][:127];flags=(base62(first) if first else -1)&0xffffffff;at=1;updates=[];ignored=[]
    for field in spec['fields']:
        # Bit0-all and one independent per-field selector.
        if not (flags&1 or flags&(1<<field['ordinal'])):continue
        selected=(tokens[at] if at<len(tokens) else b'')[:255 if field['kind']=='bytes' else 127];at+=1
        if field['kind']=='bytes':
            value=unescape(selected)
            if len(value)>16:ignored.append(field['id']);continue
        else:
            value=decimal(selected) if selected else -1
            if field.get('nonpositive_replacement') is not None and value<=0:value=field['nonpositive_replacement']
        updates.append(dict(fieldId=field['id'],nativeStorage=field['native_storage'],value=encoded(value)))
    return dict(recordId=spec['id'],operationId=spec['operation_id'],flags=flags,updates=updates,ignoredFields=ignored,missingFields=max(0,at-len(tokens)),extraTokenCount=max(0,len(tokens)-at))
def label(raw):
    tokens=fields(unescape(raw));first=unescape(tokens[0][:255]);fallback=len(first)>=25
    code=decimal(tokens[1][:31]) if len(tokens)>1 and tokens[1][:31] else -1
    return dict(labelHex=(b'???' if fallback else first).hex(),code=max(-1,code),fallbackApplied=fallback)
def cache(args,identity=None,previous=None):
    a,b,w,h,x,y,h4,h8,mode,conditional,selector,last=args
    if b==0:return dict(cacheAction='skipped-identityB-zero',cacheHex=None)
    header=b'MAP\1'+struct.pack('<4i',h4,h8,w,h);same=identity==[a,b]
    if same and previous[:20]==header and a!=2:return dict(cacheAction='reused',cacheHex=previous.hex())
    return dict(cacheAction='replaced' if same else 'created',cacheHex=(header+b'\0'*(6*w*h)).hex())
def load(name,path):
    spec=importlib.util.spec_from_file_location(name,path);module=importlib.util.module_from_spec(spec);spec.loader.exec_module(module);return module
def main():
    catalog=json.loads((HERE/'state-catalog.json').read_text())['records'];rng=random.Random(156);cases=[]
    numeric=[b'  +12tail',b'-7',b'2147483648',b'4294967295',b'\t42',b'',b'not-number',b'9'*140]
    for spec in catalog:
        for field in spec['fields']:
            payload=integer(1<<field['ordinal'])+b'|'+(b'A\\zB' if field['kind']=='bytes' else b'  +123tail')
            cases.append(dict(id=spec['operation_id'],dataHex=payload.hex(),expected=record(spec,payload)))
        masks=[0,1,0xffffffff,0x80000000]+[rng.getrandbits(32) for unused in range(24)]
        for mask in masks:
            parts=[integer(mask)]
            for field in spec['fields']:
                if mask&1 or mask&(1<<field['ordinal']):parts.append(b'Original\\cText' if field['kind']=='bytes' else numeric[(field['ordinal']+mask)%len(numeric)])
            payload=b'|'.join(parts)+b'|extra';cases.append(dict(id=spec['operation_id'],dataHex=payload.hex(),expected=record(spec,payload)))
        for payload in [b'',b'!',b'1-',b'0\0ignored',b'1|']:
            cases.append(dict(id=spec['operation_id'],dataHex=payload.hex(),expected=record(spec,payload)))
    a=catalog[0]
    for payload in [integer(1<<29)+b'|'+b'A'*16,integer(1<<29)+b'|'+b'A'*17,integer(1<<30)+b'|\\y'*128,
                    integer(1<<29)+b'|\x81|word',integer(1<<30)+b'|trailing\\']:
        cases.append(dict(id=a['operation_id'],dataHex=payload.hex(),expected=record(a,payload)))
    labels=[b'World|12',b'First\\zSecond|7',b'One\\y\\yzTwo|31',b'A\\y|4',b'\x81|word|23',b'\xfe',b'trailing\\',b'unknown\\q|+3suffix',
      b'A'*24+b'|1',b'A'*25+b'|1',b'A'*256+b'|2',b'|',b'X|-2',b'X|  +42tail',b'X|4294967295',b'X|2147483648',b'X|invalid',b'X',b'\0ignored',b'X|\t9']
    label_cases=[dict(dataHex=raw.hex(),expected=label(raw)) for raw in labels]
    scene_cases=[]
    for identityA in [0,1,2,7,-1]:
        args=[identityA,23,5,4,-2,3,111,-22,1,4,-1,99];blank=bytes.fromhex(cache(args)['cacheHex']);body=bytearray(blank);body[20]=79
        for prior_identity,prior in [(None,None),([identityA,23],bytes(body)),([identityA,24],bytes(body))]:
            scene_cases.append(dict(arguments=args,previousIdentity=prior_identity,previousHex=prior.hex() if prior is not None else None,expected=cache(args,prior_identity,prior)))
        stale=bytearray(body);stale[4]^=1;scene_cases.append(dict(arguments=args,previousIdentity=[identityA,23],previousHex=stale.hex(),expected=cache(args,[identityA,23],bytes(stale))))
    for b in [0]:
        args=[7,b,0,-1,1,2,0,0,0,0,-1,0];scene_cases.append(dict(arguments=args,previousIdentity=None,previousHex=None,expected=cache(args)))
    scene=[7,23,5,4,2,3,111,-22,1,0,-1,99];initial=bytes.fromhex(cache(scene)['cacheHex']);rect=[-1,-1,3,2]
    map_ref=load('original_map_reference',HERE.parent/'game-legacy-world-v1/generate_vectors.py');wire=load('original_wire_reference',HERE.parent/'game-legacy-message-v1/generate_vectors.py')
    count=(rect[2]-rect[0])*(rect[3]-rect[1]);planes=[[(i*103+p*70+11)&0xffff for i in range(count)] for p in range(3)]
    patch_data=b'|'.join(b','.join(integer(v) for v in plane) for plane in planes);updated,written=map_ref.apply(initial,rect,planes)
    full_a=b'1|'+b'|'.join(b'Original' if f['kind']=='bytes' else str(f['ordinal']*17).encode() for f in a['fields'])
    b=catalog[1];full_b=integer(1<<18)+b'|-4';late=integer(1<<29)+b'|'+b'X'*17
    scene2=scene[:];scene2[4:6]=[-4,6];scene2[9]=-1;scene2[11]=101
    scene3=scene2[:];scene3[4:6]=[11,12];scene3[8]=0
    def message(tag,values,blob=None):
        body=tag+b' '+b''.join(wire.integer(v)+b' ' for v in values)
        return body+(wire.escape(blob)+b' ' if blob is not None else b'')
    stream=[message(b'TfD',scene),message(b'Ta>',[],b'OriginalWorld|12'),message(a['tag'].encode(),[],full_a),message(b['tag'].encode(),[],full_b),
      message(b'=]M',[9,23]+rect+map_ref.checks(updated,rect,1)),message(b'=mJ',[7,23]+rect,patch_data),message(b'=]M',[7,23]+rect+map_ref.checks(updated,rect,1)),
      message(b'TfD',scene2),message(a['tag'].encode(),[],late),message(b'=X#',[9,10,3]),message(b'TfD',scene3),message(b'=]M',[7,23]+rect+map_ref.checks(updated,rect,0))]
    protocol=dict(scene=scene,finalScene=scene3,initialCacheHex=initial.hex(),updatedCacheHex=updated.hex(),streamPlainHex=[raw.hex() for raw in stream],requestPlainHex=message(b'!hM',[9,23]+rect).hex(),
      finalLabel=label(b'OriginalWorld|12'),stateUpdates=[record(a,full_a),record(b,full_b),record(a,late)],writtenCells=written,finalCoordinates=[11,12],finalFacingCode=3,
      effectKinds=['scene-transition','scene-label','masked-state-update','masked-state-update','map-cache-notice','map-cache-patch','map-cache-notice','scene-transition','masked-state-update','network-position','scene-transition','map-cache-notice'])
    bootstrap=json.loads((HERE.parent/'game-legacy-message-v1/original-vectors.json').read_text())['bootstrap'][0]
    result=dict(schema='moli.original-legacy-scene-vectors-stage156.v1',original_synthetic_only=True,sceneCases=scene_cases,stateCases=cases,labelCases=label_cases,protocol=protocol,bootstrap=bootstrap)
    (HERE/'original-vectors.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n')
    print(json.dumps(dict(scenes=len(scene_cases),state_cases=len(cases),label_cases=len(label_cases),source_slots=48,stream_messages=len(stream),original=True)))
if __name__=='__main__':main()
