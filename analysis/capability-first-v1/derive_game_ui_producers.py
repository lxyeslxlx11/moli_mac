"""Bind manual numeric-input and pet-point callbacks to the fixed source.

Reuses native dossiers and selected callback exports. Corrects an incomplete
Listing view in a private analysis copy. Never executes the game or product.
"""
import hashlib
import json
import struct
from collections import deque
from pathlib import Path

from extract_entry_inventory import PE

ROOT=Path(__file__).resolve().parents[2]
PUBLIC=Path(__file__).resolve().parent
PRIVATE=ROOT/'build/analysis/capability-game-ui-producers-v1'
SHA='37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd'
PROFILE='7810ea9437da59780820ec6fedb47ce47390841a95d527ddb6c3b3700fe180cb'
MANIFEST_SHA='b3d54219eff5dceba12462c6ddcb308efd0a29a0de8189b90faeaedeb52d69ad'
CAPABILITIES=['G05','G10','X01','X02']

def load(p):return json.loads(p.read_text())
def stable(v):return json.dumps(v,ensure_ascii=False,sort_keys=True,separators=(',',':'))
def sha(raw):return hashlib.sha256(raw).hexdigest()
def identity(p):
 h=hashlib.sha256()
 with p.open('rb') as f:
  for b in iter(lambda:f.read(1024*1024),b''):h.update(b)
 return dict(path=str(p.relative_to(ROOT)),bytes=p.stat().st_size,sha256=h.hexdigest())
def evidence(v):
 if 'content' in v:v=v.get('structuredContent') or json.loads(next(c['text'] for c in v['content'] if c['type']=='text'))
 return v.get('result',v)
def dump(n,v):(PUBLIC/n).write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n')

def build():
 manifest=PRIVATE/'source-inputs.json';assert identity(manifest)['sha256']==MANIFEST_SHA
 pins=load(manifest)['files']
 for r in pins:assert identity(ROOT/r['path'])==r,r['path']
 source=ROOT/'build/analysis/game-release-current-v1/legacy-members/cg_se_6000.exe'
 pe=PE(source,SHA);native=[];derived=[];bodies={}
 member=load(PRIVATE/'evidence-membership-audit.json')
 assert member['passed'] and member['previous_records_unchanged']==1703 and member['current_records']==1706
 for k in ['previous_export','current_export']:assert identity(ROOT/member[k]['path'])==member[k]
 for q in member['new_records']:
  assert identity(ROOT/q['file']['path'])==q['file']
  assert sha(stable(evidence(load(ROOT/q['file']['path']))).encode())==q['record_sha256']

 def admit_native(r,path,pointer,kind):
  assert r['operation']=='analyze_function' and r['subject']['digest']['sha256']==SHA
  assert r['analysis_profile']['digest']==PROFILE
  n=r['normalized_result'];entry=n['procedure']['address'];ranges=[]
  for s in n['procedure']['body']['ranges']:
   a,b=int(s['start'],16),int(s['end'],16);raw=pe.read(a,b-a+1)
   ranges.append(dict(start=hex(a),end=hex(b),bytes=len(raw),file_offset=pe.file_offset(a,len(raw)),sha256=sha(raw)))
  assert sum(s['bytes'] for s in ranges)==n['procedure']['body']['total_bytes']
  native.append(dict(entry=entry,evidence_id=r['evidence_id'],kind=kind,source=identity(path),record_pointer=pointer,
   exact_parameters=r['parameters'],record_sha256=sha(stable(r).encode()),native_profile=PROFILE,ranges=ranges,
   pseudocode_sha256=sha(n['pseudocode'].encode()),assembly_sha256=sha(stable(n['assembly']).encode())))
  bodies[entry]=n

 for filename in ['reused-prompt-records.json','reused-prompt-lifecycle-records.json','reused-alternate-helpers.json']:
  path=PRIVATE/filename
  for i,r in enumerate(load(path)['records']):admit_native(r,path,f'/records/{i}','reused-complete-native-record')
 path=ROOT/'build/analysis/capability-business-map-v1/historical-canonical-functions.json'
 i,r=next((i,r) for i,r in enumerate(load(path)['records']) if r['evidence_id']=='ev_aa5124f04964721c0be154a4cc20e07a0a684edae6cdd7ba3afca46f366cfe9c')
 admit_native(r,path,f'/records/{i}','retained-canonical-projection-not-complete-Evidence')
 assert len(native)==7 and sum(s['bytes'] for r in native for s in r['ranges'])==1567

 def admit_derived(r,path,pointer,kind):
  entry='0x'+r['requestedEntry'].lstrip('0');ranges=[];count=0
  for s in r['derivedBody']:
   a,b=int(s['start'],16),int(s['end'],16);raw=pe.read(a,b-a+1)
   assert len(raw)==s['bytes'];ranges.append(dict(start=hex(a),end=hex(b),bytes=len(raw),sha256=sha(raw)))
  for ins in r['instructions']:
   raw=bytes.fromhex(ins['bytesHex']);assert pe.read(int(ins['address'],16),len(raw))==raw
   count+=len(raw)
  assert count==r['derivedBodyBytes']==sum(s['bytes'] for s in ranges)
  derived.append(dict(entry=entry,kind=kind,authority='analyst-seeded-derived-static-not-native-Evidence',source=identity(path),
   record_pointer=pointer,record_sha256=sha(stable(r).encode()),ranges=ranges,instructions=len(r['instructions']),
   pseudocode_sha256=sha(r['pseudocode'].encode()),all_callee_semantics_or_runtime_feasibility_closed=False))
  bodies[entry]=dict(pseudocode=r['pseudocode'],assembly=[i['address']+': '+i['text'] for i in r['instructions']])

 path=PRIVATE/'reused-prompt-ui-bindings.json'
 for i,row in enumerate(load(path)['entries']):
  r=row['original_derived_entry'];assert sha(stable(r).encode())==row['original_derived_entry_canonical_json_sha256']
  admit_derived(r,path,f'/entries/{i}/original_derived_entry','reused-prompt-control')
 path=PRIVATE/'reused-classic-pet-control.json';admit_derived(load(path)['selected_record']['original_derived_entry'],path,'/selected_record/original_derived_entry','reused-classic-pet-control')
 path=PRIVATE/'reused-pet-creator.json';admit_derived(load(path)['original_derived_entry'],path,'/original_derived_entry','reused-pet-local-dispatch')
 reused_derived=list(derived)
 path=PRIVATE/'derived-ui-callbacks.json';seed=load(path)
 assert not seed['originalExecution'] and not seed['originalBytePatches']
 for i,r in enumerate(seed['entries']):admit_derived(r,path,f'/entries/{i}','new-seeded-callback-view;pet-range-is-partial')
 pet=next(r for r in seed['entries'] if r['requestedEntry']=='004df420')
 assert pet['functionExistedBeforeSeed'] and pet['derivedBody']==[dict(start='004df420',end='004df615',bytes=502)]
 formatter=next(r for r in seed['entries'] if r['requestedEntry']=='004f63e0')
 assert formatter['derivedBodyBytes']==91 and len(formatter['instructions'])==32

 path=PRIVATE/'derived-pet-flow-expanded.json';flow=load(path)
 assert flow['entry']=='004df420' and flow['exclusiveUpper']=='004e00c0' and not flow['gaps']
 assert not flow['originalExecution'] and not flow['originalBytePatches'] and not flow['functionMetadataChanged']
 assert flow['privateListingOverrides']==[dict(address='004df616',previousUnit='?? 89h',clearThrough='004df624')]
 nodes={int(i['address'],16):i for i in flow['instructions']};assert len(nodes)==len(flow['instructions'])==903
 byte_set=set()
 for address,ins in nodes.items():
  raw=bytes.fromhex(ins['bytesHex']);assert pe.read(address,len(raw))==raw and 0x4df420<=address<0x4e00c0
  assert not byte_set.intersection(range(address,address+len(raw)));byte_set.update(range(address,address+len(raw)))
  assert all(int(s,16) in nodes for s in ins['successors'])
 assert len(byte_set)==3211
 reached=set();todo=deque([0x4df420])
 while todo:
  address=todo.popleft()
  if address in reached:continue
  reached.add(address);todo.extend(int(s,16) for s in nodes[address]['successors'])
 assert reached==set(nodes) and 0x4df808 in reached
 assert not any(i['isCall'] and i['directTargets'] and i['directTargets'][0] in i['successors'] for i in nodes.values())
 jump=nodes[0x4dffca];table=pe.read(0x4e00ac,20);targets=list(struct.unpack('<5I',table))
 assert targets==[0x4dffd1,0x4dffdb,0x4e000b,0x4e0012,0x4e0042]
 assert set(int(x,16) for x in jump['directTargets'])==set(targets)
 assert byte_set==set(range(0x4df420,0x4e00ab)) and pe.read(0x4e00ab,1)==b'\x90'
 flow_proof=dict(source=identity(path),entry='0x4df420',exclusive_upper='0x4e00c0',instructions=903,bytes=3211,
  starts_from_actual_callback_pointer=True,all_declared_instruction_bytes_match_PE=True,all_decoded_successors_accounted_in_bound=True,
  excludes_callee_traversal=True,semantic_runtime_feasibility=False,source_native_function_owner_not_reassigned=True,
  private_listing_override=flow['privateListingOverrides'],original_partial_range_bytes=502,
  added_instruction_bytes_beyond_partial_range=2709,table=dict(address='0x4e00ac',bytes=20,sha256=sha(table),targets=[hex(t) for t in targets]),
  normal_returns=[hex(a) for a,i in nodes.items() if i['isTerminal']])
 primitive=[]
 for address,target in [('4df808',0x4f8020),('4f6432',0x4f89d0),('4df616',None)]:
  path=PRIVATE/f'native-instruction-{address}.json';r=evidence(load(path));n=r['normalized_result']
  assert r['subject']['digest']['sha256']==SHA and r['analysis_profile']['digest']==PROFILE and n['procedure'] is None
  if target is None:assert n['status']=='undecodable' and n['bytes'] is None
  else:
   assert n['status']=='decoded' and n['flow']['direct_destinations']==[hex(target)]
   assert bytes.fromhex(n['bytes'])==pe.read(int(address,16),5)
  primitive.append(dict(address='0x'+address,evidence_id=r['evidence_id'],source=identity(path),status=n['status'],
   canonical_owner=n['procedure'],direct_destinations=n['flow']['direct_destinations']))

 window=load(PRIVATE/'prompt-window42.json');inventory=load(PUBLIC/'entry-inventory.json')
 assert window==next(r for r in inventory['classic_windows'] if r['id']==42)
 descriptor=pe.read(int(window['descriptor_address'],16),48)
 assert sha(descriptor)==window['descriptor_sha256'] and int.from_bytes(pe.read(int(window['pointer_address'],16),4),'little')==int(window['descriptor_address'],16)
 for control in window['controls']:
  raw=pe.read(int(control['address'],16),32);assert sha(raw)==control['sha256']
  fields=struct.unpack('<8I',raw);assert hex(fields[7] or 0x4a31b0)==control['callback']
 assert len(window['controls'])==8 and window['callbacks']['initializer']=='0x47e0d0'
 literals=[]
 values={0x567ad8:'%6d',0x566adc:'回到宠物窗口。',0x566af8:'已经不能再分配点数了。',
  0x566b60:'将点数分配至生命。',0x566b4c:'将点数分配至力量。',0x566b38:'将点数分配至防御。',
  0x566b24:'将点数分配至速度。',0x566b10:'将点数分配至魔法。'}
 for address,text in values.items():
  raw=text.encode('gbk')+b'\0';assert pe.read(address,len(raw))==raw
  literals.append(dict(address=hex(address),bytes=len(raw),sha256=sha(raw),text=text,role='correlated withsource controlflow;not sole namingproof'))
 patterns={
  '0x4de9a0':['local_c[1] = FUN_004df420','DAT_00561700','(*local_c[DAT_00561700])'],
  '0x4df420':['FUN_004f8020','uVar4 < 5','iVar3 / 2','DAT_00ef365c','FUN_004ea5b0','FUN_004ea460(0x14)'],
  '0x481a30':['case 9:','case 0xd:','FUN_004f8020','uVar3 = 4'],
  '0x4f63e0':['local_8','FUN_0051b2f7','FUN_004f89d0'],
  '0x47e4e0':['FUN_00409e70(3,0x24)','FUN_0047e040','FUN_0047e440','param_7','param_9'],
  '0x47e440':['9 < *(short *)','FUN_0047e040','FUN_0040a090'],
  '0x47e040':['FUN_00468190(0x2a)','DAT_00c10f90','DAT_00c10f94','DAT_00c10f98'],
  '0x47e0d0':['param_1 == -1','999999999','DAT_00c10f90 = 0'],
  '0x47e110':['DAT_00c1e508','FUN_00445220'],
  '0x47e160':['DAT_00c10f94 == 0x43','FUN_0046de10','FUN_0046b530','(*DAT_00c10f90)','DAT_00c10f88','0x8000','DAT_00c08090 < 7'],
  '0x47e2d0':['DAT_00c10f94 == 0x43','iVar3 < DAT_00c10f88','iVar3 + 1'],
  '0x47e390':['DAT_00c10f94 == 0x43','iVar3 < 1','iVar3 + -1']}
 anchors=[]
 for entry,tokens in patterns.items():
  s=bodies[entry]['pseudocode']
  for token in tokens:assert token in s,(entry,token)
  anchors.append(dict(entry=entry,required_tokens=tokens,pseudocode_sha256=sha(s.encode())))
 missing=load(PRIVATE/'reused-number-editor-records.json')
 summary=dict(reused_complete_native_records=6,reused_native_projection_records=1,reused_native_body_bytes=1567,
  reused_derived_bodies=len(reused_derived),reused_derived_instructions=sum(r['instructions'] for r in reused_derived),
  reused_derived_bytes=sum(s['bytes'] for r in reused_derived for s in r['ranges']),
  new_seeded_callback_views=2,seeded_formatter_instructions=32,seeded_formatter_bytes=91,
  partial_pet_view_bytes=502,expanded_pet_flow_instructions=903,expanded_pet_flow_bytes=3211,
  new_unique_callback_instruction_bytes=3302,pet_jump_table_bytes=20,prompt_descriptor_and_controls_bytes=304,
  prompt_controls=8,native_instruction_queries=3,new_native_dossiers=0,prior_export_records_unchanged=1703,current_export_records=1706)
 source_check=dict(schema='moli.capability.game-ui-producers-source-check.v1',source=identity(source),native_profile=PROFILE,
  input_manifest=identity(manifest),inputs=pins,evidence_membership=identity(PRIVATE/'evidence-membership-audit.json'),
  native_records=native,derived_records=derived,pet_flow=flow_proof,native_instruction_observations=primitive,
  prompt_window42=window,semantic_anchors=anchors,literal_anchors=literals,
  number_editor_reuse_search=identity(PRIVATE/'reused-number-editor-records.json'),
  summary=summary,original_execution=False,original_bytes_changed=False,tool_configuration_changed=False,
  derived_instruction_bytes_match_fixed_PE=True,native_ranges_bound_by_source_identity=True,
  independent_runtime_memory_capture=False,all_capability_analysis_complete=False)
 dump('game-ui-producers-source-check.json',source_check)
 old=load(PUBLIC/'game-producer-context-contract.json')
 sender_rows=[r for r in old['producer_contexts'] if r['entry'] in ['0x4f8020','0x4f89d0']]
 assert len(sender_rows)==2
 contract=dict(schema='moli.capability.game-ui-producers-contract.v1',source=source_check['source'],
  source_check='analysis/capability-first-v1/game-ui-producers-source-check.json',capabilities=CAPABILITIES,
  facts=facts(),inferences=[dict(kind='inference',claim='Reuse onepet-point request andone numeric-prompt owner acrossplatforms,whilekeepingtheclassic/alternate inputconditions distinct;thisshouldreduce duplicated logic.',
   acceptance='Architecture proposal only;shared implementationandactualplatform acceptance unchanged.')],
  supersedes_bounded_roles=[dict(entry=r['entry'],tag=r['tag'],wire_fields=r['wire_fields'],previous_role=r['role'],
   current_role='pet-attribute-point-allocation' if r['entry']=='0x4f8020' else 'manual-masked-numeric-input-reply',
   wire_definition_changed=False,complete_business_lifecycle=False) for r in sender_rows],
  module_contract_proposal=dict(status='not-implemented',D0='统一输入、可见性、窗口/图形所有权与源调用节奏；数字格式化保留原顺序和边界。',
   D3='宠物加点索引0..4和手动数字输入复用现有字节核心；保留两套界面的资格判断、宠物快照及服务端状态发布。',
   platform_ports='人工键盘/文本输入、掩码呈现、焦点、隐藏/取消和时钟单列端口；不得自动回答或推定官方接受。'),
  requirement_answers=[dict(question=1,status='partially-answered',answer='Factory,animation,fallback,window42,submission callback,mask presentation andreply fields are bound. Detailed46de10/46b530 editoradmission andallcancel/reentry remain.'),
   dict(question=2,status='answered-with-scope-limit',answer='Actual localtab dispatch reachespet callback andsend4df808. Stat indices0..4,sourceadmission,previous/next andreturn requests are bound;global97 dispatcher/serverresult acceptance remain.'),
   dict(question=3,status='answered-with-coverage-limit',answer='Old502-byte callback view was partial;903instruction flow/3211bytes and20-byte switch table now verified. Fiveexisting UIcallback bodies andsixnative helpers reused;no duplicate root decompilation.'),
   dict(question=4,status='answered-with-scope-limit',answer='Source-backed roleoverlayupdatesonlyG05/G10/X01/X02;38/81/37/10 andglobalgate remain unchanged.')],
  remaining=[dict(id='numeric-editors',capabilities=['G10','X02'],question='先复用再补证46de10、46b530的按键准入、长度/数值边界、编辑和IME。指定894记录快照没有完整体，不等于全项目无证据。'),
   dict(id='prompt-lifecycle',capabilities=['G10','X02'],question='补齐默认取消、焦点恢复、共享回调/服务端标识覆盖、所有者丢失和重入。bit8000不等于销毁，共享全局值不是请求代次。'),
   dict(id='pet-eligibility-and-result',capabilities=['G05'],question='经典回调只见事件bit2，须另查构造器/禁用控件资格和服务端完整状态发布；不自行加入另一套界面的半数门槛、本地乐观改点或猜测ack。'),
   dict(id='global-frontiers',capabilities=['X01','X02'],question='邻接/菜单/资料mode0/手动挑战、97业务回调分发、物理时间/输入、资源/模态/版本及实际平台/官方接受继续保留；已证两条回调链不重复分析。')],
  original_execution=False,account_or_session_observed=False,runtime_features_changed=False,module_interfaces_changed=False,
  all_capability_analysis_complete=False,implementation_gate_passed=False,official_acceptance=False,full_goal_complete=False)
 dump('game-ui-producers-contract.json',contract);print(json.dumps(summary,ensure_ascii=False))

def facts():
 return [
  dict(id='partial-body-and-anchored-flow',kind='fact',entries=['0x4de9a0','0x4df420'],claim='4de9a0的局部三项回调数组实际选择4df420。旧默认函数范围仅502字节，止于4df615；4df616有原文件MOV字节，规范Listing却未解码。独立副本沿正向指令流恢复903条指令/3211字节及五项20字节跳转表；这是派生回调流证据，不代表规范函数归属或97项全局分发已闭合。'),
  dict(id='pet-point-fields',kind='fact',entries=['0x4df420','0x481a30'],claim='4f8020发送由d72fb2+selected*8取得的有符号宠物索引及属性索引0..4：生命、力量、防御、速度、魔法。另一套界面先取宠物快照，要求ef365c剩余字非零、事件mask1且当前属性<有符号(五属性+剩余之和)/2，首次发送后跳出循环；所见分支没有本地乐观改点。'),
  dict(id='per-UI-eligibility',kind='fact',entries=['0x481a30','0x4df420','0x4e9d00'],claim='经典控件9..13在事件bit2时发送索引0..4，当前回调未见另一套界面的半数检查，构造器/禁用控件条件仍待查。另一套mask1表示首鼠标边沿、0x10表示重复、0x40表示命中。共用报文不等于共用全部交互资格。'),
  dict(id='pet-return-and-selection',kind='fact',entries=['0x4df420','0x4ea460','0x4ea5b0'],claim='返回控件先调用close(561670所存窗口ID)，再调用open(20)，均忽略返回值。上一/下一重复事件按d72fa8环绕c5e934；本次操作仍使用事件前取得的宠物索引快照。open/close保留各自主状态、槽和lookup门槛，发起返回不证明导航一定成功。'),
  dict(id='prompt-construction',kind='fact',entries=['0x4f6440','0x47e4e0','0x47e440','0x47e040'],claim='接收者保存d5d7b0，再以type0x43、mode3、image0x3c405、999999/999999、初值0和4f63e0回调调用工厂。工厂申请泛型图形及36字节附加区；分配失败会立即设置经典窗口42，同时返回0。成功时47e440推进半宽/高，计数>=10后设置窗口42并标记图形待删；该计数不是毫秒。'),
  dict(id='prompt-submit-and-masking',kind='fact',entries=['0x47e0d0','0x47e110','0x47e160','0x47e2d0','0x47e390'],claim='窗口42有8控件。47e0d0仅在参数=-1时重设默认值并调用焦点准备；47e040发布本次上限、回调、控件初值和type/mode。type0x43调用46de10并禁用加减回调，其他type调用46b530。值先限至c10f88；提交bit2先调用非空c10f90(value)，再置窗口bit8000。length<7时还把显示缓冲[length-1]写为加号、[length]写NUL；完整编辑规则待补证。'),
  dict(id='numeric-reply-format',kind='fact',entries=['0x4f63e0','0x4f6440','0x47e160'],claim='汇编证明回调取一个整数，先用%6d格式化到已清零的8字节局部缓冲，再把ASCII空格改为0，随后调用4f89d0(connection,d5d7b0,text)。%6d是最小宽度6，不自行替换成所有整数均适用的%06d或截断。沿用Jl<的整数/字节字段顺序；这是人工数字输入，与518d70的人工选数挑战分开。'),
  dict(id='single-prompt-ownership',kind='fact',entries=['0x47e040','0x47e160','0x4f6440'],claim='窗口句柄c10f84、回调c10f90、type/mode和服务端标识d5d7b0均为可变全局值，复用可覆盖它们，不是每个弹窗的独立代次。提交在回调后置隐藏位，未清回调，也不证明已物理销毁。本轮未读取真实账号、输入秘密或会话。')]

if __name__=='__main__':build()
