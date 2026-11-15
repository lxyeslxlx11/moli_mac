#!/usr/bin/env python3
"""Original metadata/maps and independent source-contract reference. No native game material required."""
from pathlib import Path
import importlib.util,json,math,random,struct
HERE=Path(__file__).resolve().parent;ROOT=HERE.parents[1]
spec=importlib.util.spec_from_file_location('wire',ROOT/'analysis/game-legacy-message-v1/generate_vectors.py');wire=importlib.util.module_from_spec(spec);spec.loader.exec_module(wire)
old=json.loads((ROOT/'analysis/game-legacy-actors-v1/original-vectors.json').read_text());mathdata=json.loads((ROOT/'analysis/game-legacy-actors-v1/actor-catalog.json').read_text())['math']
D=[(0,-1),(1,-1),(1,0),(1,1),(0,1),(-1,1),(-1,0),(-1,-1)];f=lambda n:struct.unpack('<f',struct.pack('<f',n))[0]
def face(x,y):
    x,y=f(x),f(y);angle=0
    if x or y:
        ax,ay=abs(x),abs(y);ratio=min(ax,ay)/max(ax,ay)*64;i=int(ratio);q=f(ratio-i);a=f(mathdata['direction_table'][i]*(1-q)+mathdata['direction_table'][min(i+1,64)]*q)
        if ax>=ay:angle=(180+a if y<0 else 180-a) if x<0 else (360-a if y<0 else a)
        else:angle=(270-a if y<0 else 90+a) if x<0 else (270+a if y<0 else 90-a)
    angle=f(angle+mathdata['direction_offset']);angle=f(angle%360);return int(angle*mathdata['direction_sector_multiplier'])
def primitive(n):return n if n<20000 else n+200000 if n<65536 else n
def graphic_record(index,resource,w,h,flags):
    raw=bytearray(40);struct.pack_into('<i',raw,0,index);struct.pack_into('<II',raw,4,1234+index%11,80);struct.pack_into('<iiII',raw,12,-4,7,24,48)
    struct.pack_into('<BBHI',raw,28,w,h,flags,0x12345678);struct.pack_into('<I',raw,36,resource);return bytes(raw)
def graphic_catalog(groups):
    records={};lookup={};base=0;ignored=0
    for group in groups:
        for at in range(0,len(group),40):
            index=struct.unpack_from('<i',group,at)[0]+base;w,h,flags=struct.unpack_from('<BBH',group,at+28);resource=struct.unpack_from('<I',group,at+36)[0];records[index]=(w,h,flags)
            if resource==0:lookup[0]=0
            elif resource<850000:lookup[resource]=index
            else:ignored+=1
        base+=len(group)//40
    for resource,index in [(0x3bd30,0x9999d),(0x3bd3a,0x9999e),(0x3bd44,0x9999f),(0x3bea2,0x999a0)]:
        if lookup.get(resource,0):lookup[resource]=index
    def get(resource):
        index=lookup.get(resource,0);w,h,flags=records.get(index,(0,0,0));return dict(resourceId=resource,index=index,tileWidth=w,tileHeight=h,rawFlags=flags,collisionClass=flags%100)
    return get,dict(groups=len(groups),records=base,ignoredResourceIds=ignored)
def collision(w,h,planes,mode,metadata):
    ground,objects,flags=planes;out=[0]*(w*h)
    if mode==1:return [int(bool(n&256)) for n in flags]
    def basic(i,n,first=False):
        n=primitive(n)
        if n>=1000 or 60<=n<=79:
            k=metadata(n)['collisionClass']
            if k==0 and out[i]!=2:out[i]=1
            elif k==2:out[i]=2
        elif n==4:out[i]=2
        elif n in [2,5,6,9,10] or (first and n==0 and flags[i]&16384):
            if out[i]!=2:out[i]=1
    for i,n in enumerate(ground):basic(i,n,True)
    for y in range(h):
        for x in range(w):
            i=y*w+x;n=primitive(objects[i])
            if n<1000:basic(i,objects[i])
            else:
                m=metadata(n);k=m['collisionClass']
                if k in [0,2]:
                    for yy in range(max(0,y-m['tileHeight']+1),y+1):
                        for xx in range(x,min(w,x+m['tileWidth'])):
                            p=yy*w+xx
                            if k==2 or out[p]!=2:out[p]=2 if k==2 else 1
            if objects[i]==0 and ground[i]==0 and out[i]==0:out[i]=1
            if flags[i]&255==1:out[i]=1
    return out
def route(w,h,cells,start,goal):
    x,y=start;gx,gy=goal;steps=[];prev=(0,0);final=-1;reason='directional-route'
    def result(preserve=False):return dict(kind='legacy-path',origin=list(start),destination=list(goal),steps=[dict(direction=d,coordinates=[a,b]) for d,a,b in steps],finalFacing=final,reached=(x,y)==(gx,gy),preservePreviousRoute=preserve,reason=reason)
    if (x,y)==(gx,gy):reason='same-point';return result(True)
    initial=face(gx-x,gy-y);allowed={initial,(initial+1)&7,(initial-1)&7}
    def blocked(a,b):return not (0<=a<w and 0<=b<h) or cells[b*w+a]==1
    def append(dx,dy,d,corner=False):
        nonlocal x,y,prev
        sx,sy=prev[0]+dx,prev[1]+dy;merge=False
        if prev!=(0,0) and (dx or dy) and abs(sx)==abs(sy)==1:
            diagonal=D.index((sx,sy));a,b=D[(diagonal+1)&7],D[(diagonal-1)&7]
            if not blocked(x+a[0]-prev[0],y+a[1]-prev[1]) and not blocked(x+b[0]-prev[0],y+b[1]-prev[1]):
                assert steps;steps[-1]=(diagonal,x+dx,y+dy);merge=True
        if merge:prev=(prev[0]+dx,prev[1]+dy)
        else:
            if len(steps)>=100:raise ValueError('LEGACY_NAVIGATION_PATH_OVERFLOW')
            steps.append((d,x+dx,y+dy));prev=(0,0) if corner else (dx,dy)
        x+=dx;y+=dy
    while (x,y)!=(gx,gy):
        if len(steps)>=100:steps=[];reason='source-capacity-reset';return result()
        wanted=face(gx-x,gy-y);selected=None
        if wanted in allowed:
            for offset in [0,1,-1]:
                d=(wanted+offset)&7
                if d not in allowed:continue
                dx,dy=D[d]
                if not blocked(x+dx,y+dy):selected=d;break
                if (x+dx,y+dy)==(gx,gy) and d%2==0:break
        if selected is None:reason='axis-fallback';break
        dx,dy=D[selected]
        if selected%2:
            da,db=(selected+1)&7,(selected-1)&7;a,b=D[da],D[db];ba,bb=blocked(x+a[0],y+a[1]),blocked(x+b[0],y+b[1])
            if ba and bb:reason='axis-fallback';break
            if ba or bb:
                part,d=(b,db) if ba else (a,da);append(*part,d,True);dx-=part[0];dy-=part[1];selected=face(dx,dy)
        append(dx,dy,selected)
    if reason=='axis-fallback':
        for axis in [0,1]:
            delta=((gx,gy)[axis]>(x,y)[axis])-((gx,gy)[axis]<(x,y)[axis])
            while (x,y)[axis]!=(gx,gy)[axis]:
                dx,dy=(delta,0) if axis==0 else (0,delta)
                if blocked(x+dx,y+dy):break
                if len(steps)>=100:raise ValueError('LEGACY_NAVIGATION_PATH_OVERFLOW')
                x+=dx;y+=dy;steps.append((face(dx,dy),x,y))
    if steps and (x,y)!=(gx,gy):final=face(gx-x,gy-y)
    return result()
def window(width,height,center):
    x,y=center;return [max(0,x-30),max(0,y-20),min(width,x+21),min(height,y+31)]
def lookahead(w,h,flags,origin,direction):
    rect=window(w,h,origin);rw,rh=rect[2]-rect[0],rect[3]-rect[1]
    if rw<51 or rh<51:return []
    # Materialize the source window so the source's fixed x19/41,y9/31 offsets stay visible.
    data=[flags[yy*w+xx] for yy in range(rect[1],rect[3]) for xx in range(rect[0],rect[2])];x,y=origin;out=[]
    for kind,enabled in [('left',direction in [5,6,7]),('top',direction in [7,0,1]),('right',direction in [1,2,3]),('bottom',direction in [3,4,5])]:
        if not enabled or len(out)==2:continue
        for i in range(23):
            horiz=kind in ['top','bottom'];a=x-11+i if horiz else x+(-11 if kind=='left' else 11);b=y+(-11 if kind=='top' else 11) if horiz else y-11+i
            if not (0<=a<w and 0<=b<h):continue
            cx=19+i if horiz else 19 if kind=='left' else 41;cy=9 if kind=='top' else 31 if kind=='bottom' else 9+i
            if data[cy*rw+cx]:continue
            r=[a-1,b-1,a+1,b-i+23] if kind=='left' else [a,b-1,a+2,b-i+23] if kind=='right' else [a-1,b-1,a-i+23,b+1] if kind=='top' else [a-1,b,a-i+23,b+2]
            out.append([max(0,r[0]),max(0,r[1]),min(w,r[2]),min(h,r[3])]);break
    return out
CONTEXT=dict(nativeInputGuard=0,nativeMovementGuard=0,nativeCoordinationGuard=0,nativePartyMode=0,nativePartyFlags=0,nativeTurnGuard=0,nativeActionGuard=0,nativeEventSelector=0,nativeInteractionSequence=7,nativeArrivalCountdown=0,lastTurnTick=0)
def selector(n):return 2 if 0<=n<=3 or 19<=n<=23 else 3 if n<7 else int(n>15)
def local_frames(w,h,flags,origin,destination,speed,frames,context=None,fills=None):
    ctx=dict(CONTEXT if context is None else context);pos=[f(v*64) for v in origin];display=list(origin);target=list(origin);vel=[0,0];moving=False;animation=phase=0;facing=4
    queued=[];planned=[];pending=list(destination);final=-1;wait=None;event=None;arrived=False;count=0;out=[];flags=flags[:]
    for frame_index in range(frames):
        if fills and frame_index==fills['at']:
            for index,value in fills['values']:flags[index]=value
        cells=[int(bool(n&256)) for n in flags];messages=[];kind='advanced';event_out=None;early=False
        if wait and lookahead(w,h,flags,wait['origin'],wait['direction']):kind='waiting-map';early=True
        else:
            wait=None;enabled=all(ctx[k]==0 for k in ['nativeInputGuard','nativeMovementGuard','nativeCoordinationGuard'])
            if enabled:
                if event:
                    if arrived and event['remaining']>0:event['remaining']-=1
                    if event['remaining']<1:
                        code=2 if event['type']==3 else event['tileCode'];direction=event['facingCode'] if event['type']==3 else -1
                        messages.append(dict(operationId='send-004f6530',arguments=[code,ctx['nativeInteractionSequence'],*display,direction]));ctx['nativeInteractionSequence']=wire.int32(ctx['nativeInteractionSequence']+1)
                        ctx['nativeActionGuard']=1;ctx['nativeCoordinationGuard' if event['type']==3 else 'nativeMovementGuard']=1
                        planned=[];queued=[];pending=None;target=display[:];pos=[f(v*64) for v in display];vel=[0,0];event_out=dict(kind='tile-interaction',type=event['type'],tileCode=code,nativeUIEffects='unmodeled');event=None;kind='interaction';early=True;count+=1
                if not early and pos==[f(v*64) for v in target]:
                    if pending is not None and not queued:
                        r=route(w,h,cells,display,pending);pending=None;final=r['finalFacing']
                        if not r['preservePreviousRoute']:planned=r['steps'][:]
                    if not planned and not queued:
                        if 0<=final<8 and vel==[0,0] and ctx['nativeTurnGuard']==ctx['nativeActionGuard']==0 and facing!=final and ((ctx['lastTurnTick']+500)&0xffffffff)<frame_index+1000:
                            facing=final;messages.append(dict(operationId='send-004f6470',arguments=[*display,dict(bytesHex=bytes([65+final]).hex()),99]));ctx['lastTurnTick']=frame_index+1000
                        final=-1
                    if planned and not queued:
                        batch=planned[:2];planned=planned[len(batch):];queued=[r['direction'] for r in batch];x,y=display
                        for i,d in enumerate(queued):
                            dx,dy=D[d];x+=dx;y+=dy;code=flags[y*w+x]&255;s=selector(ctx['nativeEventSelector'])
                            type1=code in [3,9,10,11,13] or code==6 and s==3 or code==7 and s in [0,1] or code==8 and s==2
                            if code==2:event=dict(type=3,remaining=i,facingCode=face(dx,dy));queued=queued[:i];planned=[];break
                            if type1:event=dict(type=1,remaining=i+1,tileCode=code);queued=queued[:i+1];planned=[];break
                        if queued:messages.append(dict(operationId='send-004f6470',arguments=[*display,dict(bytesHex=bytes(d+97 for d in queued).hex()),99]))
                    if queued:
                        d=queued.pop(0);missing=lookahead(w,h,flags,display,d)
                        for rect in missing:messages.append(dict(operationId='send-004f6610',arguments=[7,23,*rect]))
                        if missing:wait=dict(origin=display[:],direction=d)
                        dx,dy=D[d];target=[display[0]+dx,display[1]+dy];a=f(target[0]*64-pos[0]);b=f(target[1]*64-pos[1]);length=f(math.sqrt(a*a+b*b));nx=f(a/length) if length>0 else 0;ny=f(b/length) if length>0 else 0;rate=f(speed*f(0.01));vel=[f(nx*rate*4),f(ny*rate*4)]
                        if nx or ny:facing=face(nx,ny);moving=True
            if not early:
                arrived=False
                if wait:kind='waiting-map'
                elif vel==[0,0]:
                    if moving:animation=0;phase=-1
                    moving=False
                else:
                    endpoint=[f(v*64) for v in target]
                    if sum(v*v for v in vel)<sum((a-b)**2 for a,b in zip(endpoint,pos)):pos=[f(a+b) for a,b in zip(pos,vel)]
                    else:
                        pos=endpoint;vel=[0,0];arrived=True;p=[math.trunc(v/64) for v in pos]
                        if not (cells[p[1]*w+p[0]]==1):display=p
                    animation=1;moving=True
                count+=1
        out.append(dict(state=kind,requests=messages,event=event_out,position=pos[:],display=display[:],target=target[:],velocity=vel[:],facingCode=facing,speed=speed,moving=moving,animation=animation,phase=phase,queuedDirections=queued[:],routeCount=len(planned),arrivedLast=arrived,frames=count,waitingForMap=None if wait is None else dict(origin=wait['origin'][:],direction=wait['direction']),pendingInteraction=None if event is None else event.copy(),context=ctx.copy()))
    return out

def main():
    rng=random.Random(158)
    groups=[b''.join([graphic_record(0,0,0,0,101),graphic_record(1,60,1,1,0),graphic_record(2,79,1,1,102),graphic_record(3,1000,2,3,100),graphic_record(4,220000,2,3,100),graphic_record(5,220001,3,2,102),graphic_record(6,245040,1,1,99),graphic_record(0x9999d,55555,4,2,202)]),b''.join([graphic_record(0,1001,2,1,102),graphic_record(1,60,1,1,1),graphic_record(2,900000,1,1,0)])]
    get,summary=graphic_catalog(groups);graphic_queries=[get(n) for n in [0,1,60,79,1000,1001,220000,220001,245040,265535,55555,849999]]
    collisions=[]
    def add_collision(name,w,h,planes,mode):collisions.append(dict(name=name,width=w,height=h,planes=planes,mode=mode,expected=collision(w,h,planes,mode,get)))
    values=[0,1,2,3,6,7,8,9,10,11,13,255,256,257,0x4000,0x4100,0xc000,0xc100,65535]
    add_collision('mode1-flags-ignore-ground-objects',len(values),1,[[999]*len(values),[1000]*len(values),values],1)
    primitives=[0,1,2,4,5,6,7,8,9,10,11,59,60,79,80,999,1000,1001,20000,20001,65535]
    for flags in [0,1,0x4000,0xc000]:add_collision('ground-primitive-flags-'+str(flags),len(primitives),1,[primitives,[0]*len(primitives),[flags]*len(primitives)],0)
    for ground in [1,4]:
        for resource in [2,4,60,79,1000,1001,20000,20001]:
            w,h=7,6;objects=[0]*(w*h);objects[3*w+5]=resource;flags=[0]*(w*h);flags[2*w+6]=1;add_collision(f'object-footprint-{ground}-{resource}',w,h,[[ground]*(w*h),objects,flags],0)
    for _ in range(20):
        w,h=8,7;planes=[[rng.choice(primitives) for _ in range(w*h)],[rng.choice([0,0,0,2,4,60,1000,20000,20001]) for _ in range(w*h)],[rng.choice([0,0,1,0x4000,0xc000]) for _ in range(w*h)]];add_collision('original-random-overlap',w,h,planes,0)
    paths=[]
    def add_path(name,w,h,cells,start,goal):
        try:expected=route(w,h,cells,start,goal);error=None
        except ValueError as e:expected=None;error=str(e)
        paths.append(dict(name=name,width=w,height=h,cells=cells,start=start,goal=goal,expected=expected,error=error))
    for d,(dx,dy) in enumerate(D):add_path('straight-'+str(d),13,13,[0]*169,[6,6],[6+dx*4,6+dy*4])
    add_path('same-point',6,6,[0]*36,[2,2],[2,2])
    for mask in range(16):
        cells=[0]*100
        for bit,(x,y) in enumerate([(3,2),(2,3),(3,3),(4,3)]):
            if mask&(1<<bit):cells[y*10+x]=1
        add_path('corner-'+str(mask),10,10,cells,[2,2],[7,6])
    cells=[0]*100;cells[2*10+7]=1;add_path('blocked-goal',10,10,cells,[2,2],[7,2])
    for i in range(120):
        w=h=14;cells=[int(rng.random()<0.2) for _ in range(w*h)];start=[rng.randrange(w),rng.randrange(h)];goal=[rng.randrange(w),rng.randrange(h)];cells[start[1]*w+start[0]]=0;add_path('original-random-'+str(i),w,h,cells,start,goal)
    add_path('exact100',121,1,[0]*121,[0,0],[100,0]);add_path('native-outer-reset',121,1,[0]*121,[0,0],[110,0]);cells=[0]*363;cells[3]=cells[4]=1;add_path('native-unsafe-fallback-bounded',3,121,cells,[0,0],[2,120])
    lookaheads=[]
    for direction in range(8):
        for holes in [[],[(29,29)],[(29,34),(34,29),(51,40),(40,51)],[(41,29),(51,35),(41,51)]]:
            w=h=100;flags=[0xc000]*(w*h)
            for x,y in holes:flags[y*w+x]=0
            lookaheads.append(dict(width=w,height=h,origin=[40,40],direction=direction,holes=holes,expected=lookahead(w,h,flags,[40,40],direction)))
    local=[]
    def add_local(name,w,h,origin,goal,steps=80,speed=100,mods=None,context=None,fills=None):
        flags=[0xc000]*(w*h)
        for x,y,n in mods or []:flags[y*w+x]=n
        local.append(dict(name=name,width=w,height=h,origin=origin,destination=goal,speed=speed,frameCount=steps,flagChanges=mods or [],context=CONTEXT if context is None else context,fills=fills,expected=local_frames(w,h,flags,origin,goal,speed,steps,context,fills)))
    add_local('straight-three-batch',12,12,[2,3],[5,3],52)
    add_local('diagonal',12,12,[2,3],[5,6],75)
    add_local('zero-speed',12,12,[2,3],[5,3],4,speed=0)
    add_local('negative-speed',12,12,[2,3],[5,3],4,speed=-2)
    add_local('tile2-before-entry',12,12,[2,3],[5,3],6,mods=[(3,3,0xc002)])
    for code in [3,9,10,11,13]:add_local('tile'+str(code)+'-after-entry',12,12,[2,3],[5,3],20,mods=[(3,3,0xc000|code)])
    for raw,code in [(0,8),(4,6),(7,7),(16,7),(0,6),(7,8)]:add_local('conditional-tile-'+str(raw)+'-'+str(code),12,12,[2,3],[5,3],20,mods=[(3,3,0xc000|code)],context=dict(CONTEXT,nativeEventSelector=raw))
    add_local('cache-wait-and-resume',100,100,[40,40],[38,40],38,mods=[(29,34,0)],fills=dict(at=3,values=[[34*100+29,0xc000]]))
    add_local('input-guard',12,12,[2,3],[5,3],4,context=dict(CONTEXT,nativeInputGuard=1))
    dispatch=json.loads((ROOT/'analysis/game-legacy-message-v1/dispatch-catalog.json').read_text());incoming={r['consumer']:r for r in dispatch['incoming'] if r.get('consumer')};outgoing={r['id']:r for r in dispatch['outgoing']}
    msg=lambda address,values:wire.message(incoming[address],values).hex()
    scene=[7,23,12,12,2,3,111,-22,1,0,-1,99];own=b'1|1C|2|3|4|100111|77|8|Hero|Guild\\zBadge\\zNote|1|0|999|Tail|0|0|'
    # An actual server-style patch fills all cells/marks known before requesting movement.
    plane=b','.join([wire.integer(1)]*144);patch=b'|'.join([plane,plane,b','.join([wire.integer(0)]*144)])
    before=[msg('0x4f2bb0',[100,0,1,0]),msg('0x4ef870',scene),msg('0x4f0000',[wire.integer(1<<18)+b'|100']),msg('0x4f16d0',[own]),msg('0x4ef580',[7,23,0,0,12,12,patch])]
    requests=[wire.message(outgoing['send-004f6470'],[2,3,b'cc',99]).hex(),wire.message(outgoing['send-004f6470'],[4,3,b'c',99]).hex()]
    after=[msg('0x4ef840',[6,4,7])]
    missing_scene=[7,23,100,100,40,40,111,-22,1,0,-1,99]
    missing_own=own.replace(b'|2|3|4|',b'|40|40|4|')
    def blank_patch(rect):
        x,y,right,bottom=rect;count=(right-x)*(bottom-y);one=b','.join([wire.integer(1)]*count);zero=b','.join([wire.integer(0)]*count)
        return msg('0x4ef580',[7,23,*rect,b'|'.join([one,one,zero])])
    missing_before=[msg('0x4f2bb0',[100,0,1,0]),msg('0x4ef870',missing_scene),msg('0x4f0000',[wire.integer(1<<18)+b'|100']),msg('0x4f16d0',[missing_own])]
    missing_before += [blank_patch(rect) for rect in [[10,20,29,71],[30,20,61,71],[29,20,30,34],[29,35,30,71]]]
    missing_request_rect=[28,33,30,52]
    missing_requests=[wire.message(outgoing['send-004f6470'],[40,40,b'gg',99]).hex(),wire.message(outgoing['send-004f6610'],[7,23,*missing_request_rect]).hex()]
    missing_protocol=dict(scene=missing_scene,beforePlainHex=missing_before,requestPlainHex=missing_requests,afterPlainHex=[blank_patch(missing_request_rect)],framesAfterFill=36,destination=[38,40],finalDisplay=[38,40],finalPosition=[2432,2560])
    result=dict(schema='moli.original-local-navigation-vectors-stage158.v1',original_synthetic_only=True,bootstrap=old['bootstrap'],graphicGroupsHex=[g.hex() for g in groups],graphicSummary=summary,graphicQueries=graphic_queries,primitiveCases=[dict(input=n,expected=primitive(n)) for n in [0,1,19999,20000,65535,65536,850000,0xffffffff]],
        collisionCases=collisions,pathCases=paths,lookaheadCases=lookaheads,selectorCases=[dict(input=n,expected=selector(n)) for n in [-10,-1,*range(30)]],localCases=local,sourceContext=CONTEXT,
        protocolMap=missing_protocol,protocol=dict(scene=scene,beforePlainHex=before,afterPlainHex=after,requestPlainHex=requests,frames=52,destination=[5,3],finalPosition=[320,192],finalDisplay=[5,3]))
    (HERE/'original-vectors.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n');print(json.dumps({k:len(result[k]) for k in result if k.endswith('Cases')}))
if __name__=='__main__':main()
