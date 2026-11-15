"""Original Galaxy vectors and fixed-sample short anchors. No target execution or network."""
import argparse,hashlib,importlib.util,json,sys,xml.etree.ElementTree as ET
from pathlib import Path
sys.dont_write_bytecode=True
ROOT=Path(__file__).resolve().parents[2]
SHA='601b79565e4ac4c71605744a5087bb24582dde164f417514c74190cd4cdc6e31'
def expected(code,xml,ordinal):
    rows=[{'ordinal':i,'gameCode':node.attrib['Gamecode'],'name':node.attrib['Name'],'text':node.text or ''}
          for i,node in enumerate(ET.fromstring(xml).findall('./Regions/Region/Galaxylist/Galaxy'))]
    names={row['name']:sum(other['name']==row['name'] for other in rows) for row in rows}
    choices=[{'galaxyOrdinal':row['ordinal'],'gameCode':row['gameCode'],'name':row['name'],'text':row['text'],
              'status':'available' if names[row['name']]==1 else 'ambiguous-name'} for row in rows if int(row['gameCode'])==code]
    if not choices:
        result={'galaxyArgs':None} if ordinal is None else {'error':'GALAXY_UNAVAILABLE'}
    elif ordinal is None:result={'error':'GALAXY_SELECTION_REQUIRED'}
    else:
        selected=next((row for row in choices if row['galaxyOrdinal']==ordinal),None)
        result={'error':'GALAXY_UNAVAILABLE'} if selected is None else {'error':'GALAXY_AMBIGUOUS'} if selected['status']!='available' else {
            'galaxyOrdinal':ordinal,'galaxyName':selected['name'],'galaxyArgs':selected['text']}
    return {'choices':choices,'selection':result}
def main():
    ap=argparse.ArgumentParser(description=__doc__);ap.add_argument('--pe',type=Path,required=True);args=ap.parse_args();data=args.pe.read_bytes()
    if hashlib.sha256(data).hexdigest()!=SHA:raise ValueError('Fixed sample identity mismatch before parsing.')
    s=importlib.util.spec_from_file_location('launch_verify',ROOT/'analysis/protocol-v3/launch/verify_launch.py');m=importlib.util.module_from_spec(s);s.loader.exec_module(m);pe=m.PE32(data)
    anchors=[]
    for label,va,target,literal in [('list',0x402dd4,0x4b20a4,'Galaxylist'),('entry',0x402e60,0x4b20b0,'Galaxy'),
        ('name',0x402ea9,0x4b20b8,'Name'),('gamecode',0x402ee8,0x4b20c0,'Gamecode'),('settings',0x406036,0x4b2468,'Galaxy')]:
        anchors.append({'id':label,'kind':'literal_reference','va':hex(va),'target':hex(target),'literal':literal})
    for label,va,target in [('slot-parse',0x402ef9,0x44d564),('body-string',0x402fc5,0x420420),('body-copy',0x402ff4,0x40bd10),
        ('source-index-add',0x40793e,0x4272b0),('display-flags',0x40795b,0x427470),('name-lookup',0x406019,0x409680),
        ('current-args',0x4060f6,0x40bcf0),('dispatch-confirm',0x411e7b,0x405f90),('dispatch-stage',0x411e6a,0x410c80),
        ('restore-name',0x404fec,0x40bcf0),('restore-args',0x405033,0x40bcf0)]:
        anchors.append({'id':label,'kind':'direct_call','va':hex(va),'target':hex(target)})
    for label,va,length in [('native-inclusive-loop',0x4078be,13),('game-filter',0x4078ed,13),('name-slot',0x402edc,7),
        ('game-slot',0x402f23,7),('body-slot',0x402fed,7),('game-count',0x402f6c,7),('source-index',0x427329,7),
        ('current-region-count',0x405fdf,7),('record-stride',0x4060e2,3),('current-args-field',0x4060f0,6)]:
        anchors.append({'id':label,'kind':'instruction_bytes','va':hex(va),'expected_hex':pe.at(va,length).hex()})
    manifest={'sample':{'sha256':SHA},'anchors':anchors};audit=m.verify(data,manifest)
    D=Path(__file__).parent
    def write(name,value):(D/name).write_text(json.dumps(value,ensure_ascii=False,indent=2)+'\n')
    write('galaxy-anchors.json',manifest);write('galaxy-anchor-audit.json',audit)
    body='<Galaxy Name="First" Gamecode="11"> --first </Galaxy><Galaxy Name="Other" Gamecode="3">other</Galaxy><Galaxy Name="Last" Gamecode="0011"> --last </Galaxy>'
    wrap=lambda body:'<Regionlist><Regions><Region><Name>OriginalRegion</Name><Galaxylist>'+body+'</Galaxylist></Region></Regions></Regionlist>'
    cases=[]
    for code in range(15):
        for ordinal in [None,0,1,2]:
            xml=wrap(body);cases.append({'name':'code%d-ordinal%s'%(code,ordinal),'game_code':code,'region_xml':xml,'galaxy_ordinal':ordinal,'expected':expected(code,xml,ordinal)})
    for name,extra in [('same-name-other-game','<Galaxy Name="Same" Gamecode="3">other</Galaxy><Galaxy Name="Same" Gamecode="11">chosen</Galaxy>'),
                       ('empty-body','<Galaxy Name="Empty" Gamecode="11"/>'),
                       ('entity-and-spaces','<Galaxy Name=" A&amp;B " Gamecode="11">  x &lt; y &amp; z  </Galaxy>')]:
        xml=wrap(extra);ordinal=1 if name=='same-name-other-game' else 0
        cases.append({'name':name,'game_code':11,'region_xml':xml,'galaxy_ordinal':ordinal,'expected':expected(11,xml,ordinal)})
    write('original-galaxy-vectors.json',{'schema':'moli.launcher-v25.original-galaxy-vectors.v1','identity':'Original public XML only; no actualserverconfig/account/session data.',
          'oracle':'PythonElementTree + independentfilter/globalnamecounts; strictindependentselectionpolicy, not nativeexecution or widgetsort/locale proof.','cases':cases})
    print(json.dumps({'source_anchors':audit['count'],'all_anchors_passed':audit['all_passed'],'independent_cases':len(cases)}))
if __name__=='__main__':main()
