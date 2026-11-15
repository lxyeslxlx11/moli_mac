#!/usr/bin/env python3
"""Original Python reference for the source post-connect poll and bounded handoff strings."""
from pathlib import Path
import json,random,importlib.util
HERE=Path(__file__).resolve().parent
SPACE=b' \t\n\r\v\f'
def handoff(raw):
    if not 1<=len(raw)<=256 or b'\0' not in raw:raise ValueError('terminator')
    text=raw.split(b'\0',1)[0];out={}
    for marker in [b'gid:',b'glt:']:
        at=text.find(marker)
        if at<0:raise ValueError('field')
        tail=text[at+4:].lstrip(SPACE);word=tail
        for i,b in enumerate(tail):
            if b in SPACE:word=tail[:i];break
        if not 1<=len(word)<=50:raise ValueError('field')
        out[marker[:3].decode()]=word.hex()
    return out

def trace(origin,events):
    stage=71;ack=0;good=False;word=None;result=0;outer=0;state='awaiting-bootstrap';cleared=False;polls=0;out=[]
    for event in events:
        action=event['action'];ignored=False
        if action=='bootstrap':
            if state=='awaiting-bootstrap':stage=73;ack=1;state='awaiting-reply';cleared=True
            else:ignored=True
        elif action=='reply':
            if ack==1 and state=='awaiting-reply':
                ack=2;status=event['status'];detail=bytes.fromhex(event['detailHex']).split(b'\0',1)[0];word=status&65535;good=status==0
                if status!=0 and detail==b'busy':word=1234
            else:ignored=True
        elif action=='poll' and state not in ['failed','accepted']:
            polls+=1;elapsed=(event['tick']-origin)&0xffffffff
            # Literal post-connect branch structure: 4ee730 result first;455500 then applies20s.
            if stage==99:ack=0;result=1
            elif 72<=stage<=80:
                if stage==72:stage+=1
                elif ack==2:
                    if good:stage=82;state='delaying'
                    else:ack=0;result=-7
                else:stage=min(80,stage+1)
            elif 81<=stage<=98:stage+=1
            if result==0 and elapsed>=600001:result=-1
            if result==1:outer=1;state='accepted'
            elif result<0 or elapsed>=20001:outer=-2;state='failed';cleared=True
        out.append(dict(nativeStage=stage,nativeAckState=ack,nativeResult=result,nativeOuterResult=outer,state=state,statusWord=word,polls=polls,credentialsCleared=cleared,ignored=ignored))
    return out

def main():
    handoffs=[]
    values=[b'gid:OriginalG glt:OriginalT\0',b'--prefixgid:X glt:Y\0after',b'gid:  A\t glt:\nB\r\0',b'gid:A gid:Z glt:B glt:W\0',b'glt:T gid:G\0',b'gid:'+bytes([0x81,0x40])+b' glt:T\0']
    for n in [1,49,50,51,60]:values.extend([b'gid:'+b'G'*n+b' glt:T\0',b'gid:G glt:'+b'T'*n+b'\0'])
    values.extend([b'',b'gid:A glt:B',b'gid:A\0glt:B',b'GID:A glt:B\0',b'gid:A GLT:B\0',b'gid: \0',b'gid:A glt: \0',b'gid:A glt:B\0'+b'X'*244])
    for raw in values:
        row=dict(mappingHex=raw.hex())
        try:row['expected']=handoff(raw)
        except ValueError:row['rejected']=True
        handoffs.append(row)
    traces=[];rng=random.Random(165)
    for ordinal in range(120):
        origin=[0,1000,0xfffffff0][ordinal%3];status=[0,1,-1,65536,-2147483648,2147483647][ordinal%6]
        detail=[b'OriginalName',b'busy',b'Busy',b'OriginalName|unmodeled',b'busy\0extra'][ordinal%5]
        events=[dict(action='reply',status=0,detailHex=b'ignored'.hex()),dict(action='bootstrap')]
        count=rng.randrange(0,12)
        events += [dict(action='poll',tick=(origin+i+1)&0xffffffff) for i in range(count)]
        events += [dict(action='reply',status=status,detailHex=detail.hex()),dict(action='reply',status=0,detailHex=b'duplicate'.hex()),dict(action='bootstrap')]
        events += [dict(action='poll',tick=(origin+100+i)&0xffffffff) for i in range(25)]
        traces.append(dict(origin=origin,events=events,expected=trace(origin,events)))
    for elapsed in [20000,20001,600000,600001]:
        for origin in [0,0xfffffff0]:
            events=[dict(action='poll',tick=(origin+elapsed)&0xffffffff)]
            traces.append(dict(origin=origin,events=events,expected=trace(origin,events)))
    for last in [20000,20001,600001]:
        events=[dict(action='bootstrap'),dict(action='reply',status=0,detailHex=b'Good'.hex())]+[dict(action='poll',tick=i) for i in range(18)]+[dict(action='poll',tick=last)]
        traces.append(dict(origin=0,events=events,expected=trace(0,events)))
    ref=HERE.parent/'game-legacy-message-v1/generate_vectors.py';spec=importlib.util.spec_from_file_location('wire_reference',ref);wire=importlib.util.module_from_spec(spec);spec.loader.exec_module(wire)
    bootstrap=json.loads((HERE.parent/'game-legacy-scene-frame-v1/original-vectors.json').read_text())['bootstrap'];key=bytes.fromhex(bootstrap['keyHex'])
    auth=wire.message(dict(tag='/b1',fields=['bytes']*3),[b'0123456789abcdef0123456789abcdef',b'OriginalT',b'OriginalG'])
    replies={name:wire.message(dict(tag='UJt',fields=['int32','bytes']),[status,detail]) for name,status,detail in [('success',0,b'OriginalLabel|unmodeled'),('busy',1,b'busy')]}
    out=dict(schema='moli.game-session-original-vectors.v1',description='Original synthetic inputs and literal independent source-branch reference; no account/captured session.',handoffs=handoffs,traces=traces,
        wire=dict(bootstrap=bootstrap,authPlainHex=auth.hex(),authFrameHex=wire.frame(wire.payload_encode(auth,key)).hex(),replies={name:dict(plainHex=raw.hex(),frameHex=wire.frame(wire.payload_encode(raw,key)).hex()) for name,raw in replies.items()}),
        authentication=dict(moduleDigest='0123456789abcdef0123456789abcdef',gid='OriginalG',glt='OriginalT',successDetail='OriginalLabel|unmodeled',status=0))
    (HERE/'original-vectors.json').write_text(json.dumps(out,indent=2)+'\n');print(json.dumps(dict(handoffs=len(handoffs),traces=len(traces),states=sum(len(x['expected']) for x in traces))))
if __name__=='__main__':main()
