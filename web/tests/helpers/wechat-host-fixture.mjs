/** Original configuration/text only. No vendor content or real account details. */
export function weChatHostConfig(extra = {}) {
  return { sourceProfile: 'win32-current', textEncoding: 'ascii', allowBareAmpersands: false,
    allowedEndpoints: [{ address: 'fixture.invalid', port: 12345 }],
    gameListXml: '<Gamelist><Games><Game Code="11"><Name>原创联调</Name><EXE>original.exe</EXE><Regions><Region>原创区域</Region><Region>关闭区域</Region><Region>缺失区域</Region><Region>拒绝区域</Region></Regions></Game></Games></Gamelist>',
    regionListXml: '<Regionlist><Regions><Region Code="1"><Name>原创区域</Name><BList><BIP Port="12345">fixture.invalid</BIP></BList><Arglist><Args Gamecode="11"> original </Args></Arglist></Region>'
      + '<Region Code="2"><Name>关闭区域</Name><Closed>原创维护</Closed></Region>'
      + '<Region Code="3"><Name>拒绝区域</Name><BList><BIP Port="12346">denied.invalid</BIP></BList><Arglist><Args Gamecode="11"> original </Args></Arglist></Region></Regions></Regionlist>',
    textPages: ['原创联调说明，第1页。仅验证本地客户端流程，不是官方条款。',
      '原创联调说明，第2页。不会建立真实账号，未连接官方游戏服务。',
      '原创联调说明，第3页。输入仅在内存，取消或隐藏会清空。',
      '原创联调说明，第4页。确认仅限以上原创说明，候选并非游戏可玩证明。'], ...extra };
}
