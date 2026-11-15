"""Original authored fixture assets; shares no shipped artwork or code bytes."""
from pathlib import Path
import importlib.util,json,struct,sys
sys.dont_write_bytecode=True
R=Path(__file__).resolve().parents[2]
s=importlib.util.spec_from_file_location('retained_combo',R/'analysis/game-battle-combination-v1/generate_vectors.py');prior=importlib.util.module_from_spec(s);s.loader.exec_module(prior)
def fixtures():
 _,records,fs=prior.fixtures();files={r['path']:bytes.fromhex(r['bytesHex'])for r in fs};info=bytearray(files['Bin/AnimeInfo.bin']);data=bytearray(files['Bin/Anime.bin']);seen=set(struct.unpack_from('<I',info,i)[0]for i in range(0,len(info),12))
 resources=[0x1ae0f,0x1ae11,0x1ae18,0x1af87,0x70d0,0x573d]
 resources+=list(range(0x1af57,0x1af83))
 for resource in resources:
  if resource<100000 or resource in seen:continue
  blocks=[prior.anime.action(d,a,96,[(1002,-2,-8,0),(1004,1,-7,0),(1005,0,-6,0)])for d in range(8)for a in range(20)];info.extend(struct.pack('<IIHH',resource,len(data),len(blocks),0));data.extend(b''.join(blocks))
 graphic=bytearray(files['Bin/GraphicInfo.bin']);pixels=bytearray(files['Bin/Graphic.bin']);known={r['resourceId']for r in records};nextid=max(r['index']for r in records)+1
 for resource in resources:
  if resource>=100000 or resource in known:continue
  w,h=9,6;pix=bytes(0 if i%5==0 else 17+i%3 for i in range(w*h));raw=b'RD\0\0'+struct.pack('<iiI',w,h,16+w*h)+pix;row=bytearray(40);struct.pack_into('<IIIiiii',row,0,nextid,len(pixels),len(raw),-4,-3,w,h);struct.pack_into('<I',row,36,resource);graphic.extend(row);pixels.extend(raw);records.append(dict(index=nextid,resourceId=resource,originX=-4,originY=-3,width=w,height=h));nextid+=1
 files.update({'Bin/AnimeInfo.bin':bytes(info),'Bin/Anime.bin':bytes(data),'Bin/GraphicInfo.bin':bytes(graphic),'Bin/Graphic.bin':bytes(pixels)})
 return records,[dict(path=p,bytesHex=b.hex())for p,b in files.items()]
if __name__=='__main__':
 records,files=fixtures();out=dict(schema='moli.shared-storage-authored-fixtures-stage221.v1',authority='original synthetic assets;not original client pixels',files=files,geometry=records);p=R/'analysis/game-battle-shared-storage-v1/original-fixtures.json';p.write_text(json.dumps(out,separators=(',',':'))+'\n');print(json.dumps(dict(file=str(p.relative_to(R)),bytes=p.stat().st_size,geometry=len(records))))
