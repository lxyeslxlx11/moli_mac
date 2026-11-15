#!/usr/bin/env python3
"""Original on-disk resource files; independent native path and pixel reference data."""
from pathlib import Path
import copy,hashlib,json,random,re,struct
HERE=Path(__file__).resolve().parent;ROOT=HERE.parents[1]
C=json.loads((HERE/'resource-path-catalog.json').read_text());SCENE=json.loads((ROOT/'analysis/game-legacy-scene-frame-v1/original-vectors.json').read_text());ANIME=json.loads((ROOT/'analysis/game-legacy-animation-v1/original-vectors.json').read_text())
def plan(text):
 def number(prefix):
  at=text.find(prefix)
  if at<0:return None
  m=re.match(r'\s*([+-]?[0-9]+)',text[at+len(prefix):]);assert m;v=int(m[1]);assert -2147483648<=v<=2147483647;return v
 m=re.search(r'binfolder:\s*([^\s]+)',text);directory=m[1].replace('\\','/') if m else 'Bin';names=copy.deepcopy(C['defaults'])
 for key,rows in names.items():
  for group,prefix in enumerate(C['prefixes'][key]):
   if '*' in rows[group]:continue
   if key=='graphic' and group==2:
    n=number(C['graphicV2EarlierAlias']['prefix'])
    if n is not None:rows[group]=C['templates'][key][group].replace('%d',str(n))
   n=number(prefix)
   if n is not None:rows[group]=C['templates'][key][group].replace('%d',str(n))
 for key in ['coordinate','coordinateInfo']:
  for i,s in enumerate(names[key]):
   if s.startswith('*'):names[key][i]=names[key][int(s[1:])]
 groups=[dict(group=i,**{k:(directory+'/'+rows[i]).replace('\\','/') for k,rows in names.items()},graphicRequired=i in [0,3,6],animationRequired=i==0) for i in range(7)]
 return dict(profile='legacy-se6000-37c4-resource-library-v1',directory=directory,groups=groups,palette=(directory+'/'+C['default_palette']).replace('\\','/'),currentVersionCompatibility='unverified')
def main():
 rng=random.Random(164);paths=[]
 texts=['','graphicbiv2x:1 graphicbinv2:2','xgraphicbin:9 graphicbin:10','graphicbin:0x123','graphicbin:  -2147483648 tail','graphicbin:2147483647','coordinatebin:2 coordinateinfobin:3 coordinatebinv3:7 coordinateinfobinv3:8','binfolder:LocalRoot graphicsIgnored:1','GRAPHICBIN:8 graphicbinv3:9']
 prefixes=[s for key,v in C['prefixes'].items() for s in v if not key.startswith('coordinate')]
 for _ in range(200):texts.append(' '.join(p+str(rng.randrange(-20,500)) for p in rng.sample(prefixes,rng.randrange(1,9))))
 for text in texts:paths.append(dict(text=text,expected=plan(text)))
 files={};index=bytearray.fromhex(SCENE['graphicBytesHex']);archive=bytearray();images=[]
 for at in range(0,len(index),40):
  ordinal=struct.unpack_from('<i',index,at)[0];w,h=struct.unpack_from('<2i',index,at+20);pixels=bytes(0 if (i+ordinal)%5==0 else 17+(i+ordinal)%3 for i in range(w*h));raw=b'RD\0\0'+struct.pack('<iiI',w,h,16+w*h)+pixels;offset=len(archive);archive.extend(raw);struct.pack_into('<II',index,at+4,offset,len(raw));images.append(dict(index=ordinal,offset=offset,length=len(raw),rgbaBytes=w*h*4))
 palette_samples=[]
 for ordinal,pixels,pal in [(1400,bytes([168,20,17,0]),b''),(1401,bytes([0,1,2,3]),bytes([0,0,0,20,30,40,0,0,0,80,90,100]))]:
  offset=len(archive);raw=(b'RD'+bytes([2,0])+struct.pack('<iiII',4,1,24,len(pal))+pixels+pal) if pal else b'RD\0\0'+struct.pack('<iiI',4,1,20)+pixels;archive+=raw;record=bytearray(40);struct.pack_into('<III',record,0,ordinal,offset,len(raw));struct.pack_into('<ii',record,20,4,1);struct.pack_into('<I',record,36,80000+ordinal);record[28:30]=bytes([1,1]);struct.pack_into('<H',record,30,100);index+=record;images.append(dict(index=ordinal,offset=offset,length=len(raw),rgbaBytes=16))
  for flags in ([0,4] if not pal else [0,4]):
   colors=[[0,0,0,0],[40,30,20,255],[0,0,1,255],[100,90,80,255]] if pal else ([[123,45,67,255],[0,0,1,255],[13,31,61,255],[0,0,0,0]] if flags else [[0,0,0,0],[0,0,0,0],[13,31,61,255],[0,0,0,0]])
   rgba=bytes(n for color in colors for n in color);palette_samples.append(dict(index=ordinal,flags=flags,rgbaHex=rgba.hex(),sha256=hashlib.sha256(rgba).hexdigest()))
 files['Bin/GraphicInfo.bin']=bytes(index);files['Bin/Graphic.bin']=bytes(archive)
 for suffix in ['V3','_Joy']:files['Bin/GraphicInfo'+suffix+'.bin']=b'';files['Bin/Graphic'+suffix+'.bin']=b''
 anime=bytearray();indices=bytearray();ap=bytearray();apindex=bytearray([1])
 for row in ANIME['animations']:
  offset=len(anime);version=row['version'];indices+=struct.pack('<IIHH',row['resourceId'],offset,len(row['actions']),version)
  for a in row['actions']:
   anime+=struct.pack('<HHII',a['direction'],a['action'],a['duration'],len(a['frames']))
   if version==1:anime+=struct.pack('<HHI',a['paletteSelector'],a['flags'],a['color'])
   for q in a['frames']:anime+=struct.pack('<IhhH',q['graphicIndex'],q['x'],q['y'],q['event'])
  entries=row['attachments'];apindex+=struct.pack('<IIH',row['resourceId'],len(ap),len(entries))
  for q in entries:ap+=struct.pack('<Ihh',q['graphicIndex'],q['x'],q['y'])
 files['Bin/AnimeInfo.bin']=bytes(indices);files['Bin/Anime.bin']=bytes(anime);files['Bin/CrdInfo.bin']=bytes(apindex);files['Bin/Crd.bin']=bytes(ap)
 palette=bytearray(672)
 for i,rgb in [(17,[13,31,61]),(18,[97,127,151]),(19,[173,193,223])]:palette[(i-16)*3:(i-15)*3]=bytes(reversed(rgb))
 palette[(168-16)*3:(169-16)*3]=bytes([67,45,123]);files['Bin/pal/palet_00.cgp']=bytes(palette)
 fields=SCENE['protocol']['scene'];selector=fields[1] if fields[10]==-1 else fields[10];files['bin/PUK2/cutdat/'+str(selector)+'.cut']=bytes.fromhex(SCENE['cutHex'])
 out=dict(schema='moli.original-resource-library-stage164.v1',original_synthetic_only=True,pathCases=paths,files=[dict(path=k,bytesHex=v.hex(),bytes=len(v),sha256=hashlib.sha256(v).hexdigest()) for k,v in files.items()],images=images,paletteCases=palette_samples,sceneSelector=selector,expected=dict(sourcePickCases=209,metadataGroups=7,imageRecords=len(images),worldFrames=52,worldReference='../game-input-runtime-v1/original-vectors.json',pixelPaletteIndices=[17,18,19]))
 (HERE/'original-vectors.json').write_text(json.dumps(out,indent=2)+'\n');print(json.dumps(dict(paths=len(paths),files=len(files),fileBytes=sum(map(len,files.values())),images=len(images),selector=selector)))
if __name__=='__main__':main()
