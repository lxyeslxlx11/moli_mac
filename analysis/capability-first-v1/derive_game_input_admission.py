"""Verify source-backed numeric-keypad and classic pet-control admission.

Only analysis metadata is consumed. Original bytes, runtime code and tool
configuration are not changed; derived bodies retain their own authority.
"""
import hashlib
import json
import struct
from pathlib import Path

from extract_entry_inventory import PE

ROOT=Path(__file__).resolve().parents[2]
PUBLIC=Path(__file__).resolve().parent
PRIVATE=ROOT/'build/analysis/capability-game-input-admission-v1'
SHA='37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd'
PROFILE='7810ea9437da59780820ec6fedb47ce47390841a95d527ddb6c3b3700fe180cb'
MANIFEST_SHA='e99d5f9f7cfa622929581ed5e1b64219ad88902ecf6ff2432efcdb5e1ad49653'
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
 pe_path=ROOT/'build/analysis/game-release-current-v1/legacy-members/cg_se_6000.exe';pe=PE(pe_path,SHA)
 member=load(PRIVATE/'evidence-membership-audit.json')
 assert member['passed'] and member['previous_records_unchanged']==1706 and member['current_records']==1708
 assert member['new_operations']=={'inspect_native_instruction':2}
 for k in ['previous_export','current_export']:assert identity(ROOT/member[k]['path'])==member[k]
 for q in member['new_records']:
  assert identity(ROOT/q['file']['path'])==q['file']
  assert sha(stable(evidence(load(ROOT/q['file']['path']))).encode())==q['record_sha256']
 new_derived=[];reused_derived=[];native=[];bodies={}

 def derived(r,path,pointer,target):
  assert r['status']=='derived-static-export' and r['decompileCompleted']
  entry='0x'+r['requestedEntry'].lstrip('0');spans=[];total=0
  for s in r['derivedBody']:
   a,b=int(s['start'],16),int(s['end'],16);raw=pe.read(a,b-a+1)
   assert len(raw)==s['bytes'];spans.append(dict(start=hex(a),end=hex(b),bytes=len(raw),file_offset=pe.file_offset(a,len(raw)),sha256=sha(raw)))
  for i in r['instructions']:
   raw=bytes.fromhex(i['bytesHex']);assert pe.read(int(i['address'],16),len(raw))==raw;total+=len(raw)
  assert total==r['derivedBodyBytes']==sum(s['bytes'] for s in spans)
  target.append(dict(entry=entry,authority='analyst-seeded-derived-static-not-canonical-REA',native_evidence_id=None,
   native_profile_digest=None,retained_source=identity(path),record_pointer=pointer,record_sha256=sha(stable(r).encode()),
   ranges=spans,instructions=len(r['instructions']),pseudocode_sha256=sha(r['pseudocode'].encode()),
   semantic_scope='Only the admission/ownership rules referenced below;other render/name/value fields andcallees are not all closed.'))
  bodies[entry]=r

 for filename in ['derived-number-editors.json','derived-admission-helpers.json']:
  path=PRIVATE/filename;d=load(path);assert not d['originalExecution'] and not d['originalBytePatches']
  for i,r in enumerate(d['entries']):derived(r,path,f'/entries/{i}',new_derived)
 path=PRIVATE/'retained-pet-owner-bodies.json'
 for i,row in enumerate(load(path)['entries']):derived(row['original_derived_entry'],path,f'/entries/{i}/original_derived_entry',reused_derived)
 path=PRIVATE/'retained-prompt-owner-helpers.json'
 for i,r in enumerate(load(path)['records']):derived(r,path,f'/records/{i}',reused_derived)
 assert len(new_derived)==6 and len(reused_derived)==4
 assert sum(r['instructions'] for r in new_derived)==2466 and sum(s['bytes'] for r in new_derived for s in r['ranges'])==8309
 assert sum(r['instructions'] for r in reused_derived)==171 and sum(s['bytes'] for r in reused_derived for s in r['ranges'])==561

 def admit_native(r,path,pointer):
  assert r['operation']=='analyze_function' and r['subject']['digest']['sha256']==SHA and r['analysis_profile']['digest']==PROFILE
  n=r['normalized_result'];spans=[]
  for s in n['procedure']['body']['ranges']:
   a,b=int(s['start'],16),int(s['end'],16);raw=pe.read(a,b-a+1)
   spans.append(dict(start=hex(a),end=hex(b),bytes=len(raw),file_offset=pe.file_offset(a,len(raw)),sha256=sha(raw)))
  native.append(dict(entry=n['procedure']['address'],evidence_id=r['evidence_id'],retained_source=identity(path),record_pointer=pointer,
   record_sha256=sha(stable(r).encode()),native_profile=PROFILE,ranges=spans,pseudocode_sha256=sha(n['pseudocode'].encode())))
 path=PRIVATE/'retained-editor-factory.json'
 for i,r in enumerate(load(path)['records']):admit_native(r,path,f'/records/{i}')
 path=ROOT/'build/analysis/capability-window-engine-v1/function-46ab90.json';frame=evidence(load(path));admit_native(frame,path,'')
 assert len(native)==2 and sum(s['bytes'] for r in native for s in r['ranges'])==621
 anchors=[]
 for filename in ['editor-source-anchors.json','admission-helper-anchors.json']:
  path=PRIVATE/filename
  for row in load(path):
   if 'instruction' in row:
    i=row['instruction'];a=int(i['address'],16);target=int(i['text'].split('0x')[1],16);raw=bytes.fromhex(i['bytesHex'])
   else:a=int(row['address'],16);target=int(row['target'],16);raw=bytes.fromhex(row['bytes_hex'])
   assert pe.read(a,5)==raw and raw[0]==0xe8 and a+5+int.from_bytes(raw[1:],'little',signed=True)==target
   anchors.append(dict(source=hex(a),target=hex(target),instruction_hex=raw.hex(),source_anchors=identity(path)))
 assert {a['target'] for a in anchors}=={'0x46b530','0x46de10','0x445220','0x445230','0x452420','0x483bf0'}

 inventory=load(PUBLIC/'entry-inventory.json');windows=[]
 for window_id in [17,42]:
  row=next(r for r in inventory['classic_windows'] if r['id']==window_id)
  raw=pe.read(int(row['descriptor_address'],16),48);assert sha(raw)==row['descriptor_sha256']
  assert int.from_bytes(pe.read(int(row['pointer_address'],16),4),'little')==int(row['descriptor_address'],16)
  for control in row['controls']:
   b=pe.read(int(control['address'],16),32);assert sha(b)==control['sha256']
   fields=struct.unpack('<8I',b);assert hex(fields[7] or 0x4a31b0)==control['callback']
  windows.append(row)
 pet=windows[0];assert pet['callbacks']['initializer']=='0x4810f0' and pet['control_count']==46
 assert [x['ordinal'] for x in pet['controls'] if x['callback']=='0x481a30']==list(range(5,14))
 assert windows[1]['control_count']==8 and windows[1]['controls'][1]['callback']=='0x49fdd0'
 owner=load(PRIVATE/'classic-pet-owner-inventory.json')['owners'][0];assert owner['original_window_row']==pet
 gates=[dict(ordinal=i,participation_offset=hex(i*0x24+0x18),attribute_index=i-9) for i in range(9,14)]
 for g in gates:assert g['participation_offset'] in bodies['0x483bf0']['pseudocode']
 patterns={
  '0x46b530':['param_7 & 2','param_7 & 1','FUN_00452420(8)','iVar4 < 0x6a','local_2c == 0xb','local_2c == 0xc','local_2c == 0xd','return 3','/ 10'],
  '0x46de10':['DAT_00c08090 == 6','DAT_00c08090 < 6','iVar5 != 1','local_28 == 0xc','DAT_00c08090 = 0','local_28 == 0xd','return 3','DAT_00c08090 = DAT_00c08090 + -1','FUN_00452420(8)'],
  '0x445220':['DAT_0060ff08 = param_1'],
  '0x445230':['local_20[0] = 0x70','DAT_007286ac & 2','DAT_007286ad & 2','iVar3 + 0x10','iVar3 + 8','FUN_00443f20','0x15c'],
  '0x452420':['DAT_0072869c','& 4'],
  '0x4810f0':['param_1 == -1','FUN_00483bf0','0x8000'],
  '0x483bf0':['DAT_00ef35f0','0 < *(int *)(&DAT_00ef365c','iVar11 = 6','iVar7 = iVar7 / 2','local_118[1] < iVar7','local_108 < iVar7'],
  '0x49fdd0':['param_2 & 2','0x8000','FUN_00510000(0x39']}
 semantic=[]
 for entry,tokens in patterns.items():
  s=bodies[entry]['pseudocode']
  for token in tokens:assert token in s,(entry,token)
  semantic.append(dict(entry=entry,required_tokens=tokens,pseudocode_sha256=sha(s.encode())))
 assert 'DAT_0060ff08' not in bodies['0x49fdd0']['pseudocode'] and 'DAT_00c10f90' not in bodies['0x49fdd0']['pseudocode']
 native_observations=[]
 for name in ['46b530','46de10']:
  r=evidence(load(PRIVATE/f'native-instruction-{name}.json'));n=r['normalized_result']
  assert n['status']=='undecodable' and n['procedure'] is None and n['bytes'] is None
  assert r['subject']['digest']['sha256']==SHA and r['analysis_profile']['digest']==PROFILE
  native_observations.append(dict(address='0x'+name,evidence_id=r['evidence_id'],status=n['status'],procedure=None))
 # Independent original-file byte proof of the earlier alternate nonzero guard.
 alt_test=pe.read(0x4df7aa,4);assert alt_test==bytes.fromhex('85c07473')
 previous=load(PUBLIC/'game-ui-producers-contract.json');assert previous['source']['sha256']==SHA
 focus_search_path=PRIVATE/'retained-focus-zero-candidates.json'
 assert identity(focus_search_path)['sha256']=='2c5185e7f2b0ac3ee5b6bd98afe349560c3ad22f8baf6d0504901fe6c6f5b967'
 focus_search=load(focus_search_path)
 assert focus_search['status']=='bounded-negative' and focus_search['source_identity']==member['current_export']
 assert not focus_search['records'] and focus_search['mechanical_receipt']['counts']['native_body_records_searched']==603
 focus_boundary=dict(source=identity(focus_search_path),native_body_records_searched=603,literal_candidates=0,
  search_boundary='仅指定1708记录导出中的规范函数伪代码/汇编，按该文件字面规则；不含全部派生体、寄存器传播或别名。',
  proves_no_focus_clear=False,semantic_assignment=False,repeat_identical_search=False)
 summary=dict(new_derived_entries=6,new_derived_instructions=2466,new_derived_bytes=8309,
  reused_derived_entries=4,reused_derived_instructions=171,reused_derived_bytes=561,
  reused_complete_native_records=2,reused_native_body_bytes=621,source_anchored_CALL_proofs=len(anchors),
  classic_windows_rechecked=2,classic_controls_rechecked=54,classic_pet_point_controls=5,
  native_function_queries_without_default_procedure=2,native_instruction_observations=2,new_native_dossiers=0,
  prior_export_records_unchanged=1706,current_export_records=1708,
  native_dossiers_in_bounded_zero_search=603,native_literal_zero_candidates=0)
 source_check=dict(schema='moli.capability.game-input-admission-source-check.v1',source=identity(pe_path),native_profile=PROFILE,
  input_manifest=identity(manifest),inputs=pins,evidence_membership=identity(PRIVATE/'evidence-membership-audit.json'),
  new_derived_bodies=new_derived,reused_derived_bodies=reused_derived,reused_native_bodies=native,
  source_anchored_calls=anchors,semantic_anchors=semantic,windows=windows,classic_pet_point_fields=gates,
  native_default_listing_observations=native_observations,alternate_nonzero_guard=dict(address='0x4df7aa',bytes_hex=alt_test.hex(),
   meaning='TEST EAX,EAX;JZ means nonzero admission;not signed-positive admission'),
  bounded_focus_zero_search=focus_boundary,summary=summary,derived_instruction_bytes_and_table_bytes_match_fixed_PE=True,native_range_source_identity_bound=True,
  canonical_REA_function_metadata_changed=False,original_execution=False,independent_runtime_memory_capture=False,
  runtime_features_changed=False,all_capability_analysis_complete=False)
 dump('game-input-admission-source-check.json',source_check)
 contract=dict(schema='moli.capability.game-input-admission-contract.v1',source=source_check['source'],
  source_check='analysis/capability-first-v1/game-input-admission-source-check.json',capabilities=CAPABILITIES,
  facts=facts(),inferences=[dict(kind='inference',claim='数字动作、焦点和共享键槽由D0集中管理；宠物命令复用同一字段定义，资格保留来源上下文。可避免按页面重复实现，但尚未量出总工期节省。')],
  numeric_action_contract=dict(source_modes=['normal-46b530','masked-46de10'],action_ids={'0..9':'digit','10':'backspace','11':'maximum-normal-only','12':'clear','13':'submit'},
   source_result_masks={'0':'no action','1':'handled/edit path','3':'handled and submit'},
   digit_arbitration='先鼠标动作，再在flag2时按0..9扫描主键区/数字键区，最低数字命中覆盖鼠标；最后Backspace键查询优先于已选动作。',
   ordinary_known_prompt_maximum=999999,masked_count_independent_of_numeric_value=True,
   examples=[dict(input='六个0',mode='masked',value=0,count=6,normal_submit_eligible=True),dict(input='未输入',mode='masked',value=0,count=0,normal_submit_eligible=False)],
   examples_are_source_derived_not_runtime_tests=True,source_32bit_arithmetic_and_signed_comparisons_preserved=True),
  pet_gate_comparison=[dict(context='classic-window17',source='0x483bf0→participation→0x481a30',exists_word_required=True,
    remaining='signed >0',half_cap='attribute < signed32 total/2 (truncation toward zero)',event_mask=2,selected_slot='c218e4 read at dispatch'),
   dict(context='alternate-pet-subview',source='0x4df420 direct branch',exists_word_required='not asserted bythis localbranch',
    remaining='!=0',half_cap='attribute < signed32 total/2 (truncation toward zero)',event_mask=1,selected_slot='c5e934 snapshot before controls')],
  module_contract_proposal=dict(status='not-implemented',D0='共用数字动作、输入值/已输入位数、键槽查询、焦点指针及隐藏状态；不把查询实现为消费事件。',
   D3='复用宠物属性请求；经典窗口先更新参与标志再回调，另一套按直接门槛处理。保持服务端状态发布及共享源顺序。',
   D5='手动鼠标/触摸/键盘适配；本层没有自由文本或IME解析，不据此宣布全客户端IME已完成。'),
  requirement_answers=[dict(question=1,status='answered-with-scope-limit',answer='两数字盘的动作、数值/位数、键盘条件、返回掩码与提交差异已成规；全客户端键盘/IME生产者与平台验证另列。'),
   dict(question=2,status='partially-answered',answer='正常关闭按钮只置隐藏位并发声，不发协议、不清回调或焦点；焦点setter立即写入，末帧445230实际是F键槽服务。所有者丢失/全局焦点恢复仍待证。'),
   dict(question=3,status='answered-with-scope-limit',answer='经典row17的4810f0→483bf0→五项参与标志→481a30已有来源；与另一套!=0相比，经典为signed>0。整项宠物功能/服务端接受未提升。'),
   dict(question=4,status='answered-with-scope-limit',answer='仅增加统一规则覆盖，38/81/37/10不变；产品代码和全局规格/实现/官方验收门槛保持。')],
  remaining=[dict(id='shared-input-and-focus',capabilities=['X02'],question='继续实际键盘生产/重复节奏、全局焦点读写和隐藏/所有者丢失/重入；445230依赖的452430/443f20完整F键链另列，不将它当作焦点复位。603规范体的字面零调用/零写已限定阴性，后续依具体引用/别名边补证，不重复同一搜索。'),
   dict(id='pet-state-publication',capabilities=['G05'],question='继续完整服务端宠物状态发布/生命周期及其他宠物操作，保留控件资格与请求字段、发送与成功回执的边界。'),
   dict(id='global-capability-frontiers',capabilities=['X01','X02'],question='邻接/菜单/资料mode0/手动选数、97业务回调分发、物理时间/资源/模态/版本与实际平台/官方接受仍保留；已证数字盘、取消按钮和经典加点资格不重做。')],
  original_execution=False,account_or_session_observed=False,runtime_features_changed=False,module_interfaces_changed=False,
  all_capability_analysis_complete=False,implementation_gate_passed=False,official_acceptance=False,full_goal_complete=False)
 dump('game-input-admission-contract.json',contract);print(json.dumps(summary,ensure_ascii=False))

def facts():
 return [
  dict(id='source-authority',kind='fact',entries=['0x46b530','0x46de10'],claim='默认REA FunctionManager无这两个过程，入口Listing也未解码，不代表文件缺字节。已沿47e160的直接CALL在独立副本恢复；六个本组派生体都核原PE，未改规范函数元数据，不冒充新规范dossier。'),
  dict(id='numeric-action-order',kind='fact',entries=['0x46b530','0x46de10','0x452420'],claim='两数字盘有0..9、退格10、清空12和提交13，普通盘另有最大值11；鼠标使用源矩形/事件位。flag2时按数字升序查主键区和数字键区，首个命中覆盖鼠标选择；最后退格键优先。452420只读72869c[key]&4，不清位；退格查询在flag2检查之外。'),
  dict(id='ordinary-number',kind='fact',entries=['0x46b530'],claim='数字动作按32位值×10+digit，再以有符号比较限至param4；退格向零整除10，最大值动作置param4，清空置0。普通确认按钮的正常资格为当前值>0，flag1可改变按钮选择资格；选中提交动作返回3，无动作返回0，其余处理返回1。本层不查询键13。'),
  dict(id='masked-number',kind='fact',entries=['0x46de10'],claim='掩码盘独立记录c08090位数：不足6位才追加并增位数，超出时发错误声；值仍受param4限制。退格除10并减位数，位数不低于0；清空同时清值/位数，不显示普通盘的最大值动作。最终提交必须位数==6才返回3，包括六个0；flag1不放宽最终六位检查。'),
  dict(id='focus-and-cancel',kind='fact',entries=['0x445220','0x49fdd0'],claim='445220立即把参数写入60ff08。窗口42的关闭按钮49fdd0在事件bit2时只置当前窗口8000并发39声，不调用提交回调、不发送协议，也不直接清c10f90或60ff08。它不是物理销毁或自动焦点恢复的证明。'),
  dict(id='descriptor-dispatch',kind='fact',entries=['0x46cf90'],claim='46cf90以描述符首字为准，0或高字节非0返回0；mode0调用443ab0，mode1调用455290并继续更新+130/+134坐标，mode2只更新坐标，mode3调用4552d0。它不等于焦点setter或请求代次管理器。'),
  dict(id='end-frame-F-slots',kind='fact',entries=['0x46ab90','0x445230'],claim='46ab90在控件循环后调用445230。后者扫描键槽70..77，按7286ac/7286ad的bit2选16/8/0槽组，多个命中保留较大索引，再将5e2780+slot*15c交443f20处理并发声；这不是焦点复位。本组未展开452430和443f20全部语义。'),
  dict(id='classic-pet-admission',kind='fact',entries=['0x4810f0','0x483bf0'],claim='经典加点位于window17，481a30对应控件5..13，其中9..13发送五项属性。正常帧初始化回调4810f0调用483bf0；后者先把五项参与标志清0，在存在字非零、剩余点signed>0且属性<signed32(五属性+剩余之和)/2时分别置1。共同窗口先cb30再按participation==1分发，回调自身不重复该检查。'),
  dict(id='source-context-difference',kind='fact',entries=['0x483bf0','0x4df420'],claim='参与字段位于runtimeControl+18，步长24（均十六进制），对应sidecar的15c/180/1a4/1c8/1ec。另一套4df420直接门槛为剩余!=0，不能与经典signed>0无条件合并；也不向另一套局部分支补猜测的存在检查。两者仍共用原宠物索引/属性索引报文。')]

if __name__=='__main__':build()
