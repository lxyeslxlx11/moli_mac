const { createWeChatLegacyGameHost } = require('../../lib/play.js')
const config = require('../../runtime-config.js')
const lifecycle = require('../../../lifecycle.js')
const appearanceChoices = Array.from({ length: 14 }, (_, index) => '造型 ' + (index + 1))
const chatChoices = { range: [1,2,3,4,5], color: [0,1,2,3,5,6,7,8,9], size: [1,2,3] }
const chatDefaults = { rangeChoice: 0, colorChoice: 0, sizeChoice: 0 }

Page({
  data: { status: '正在准备…', characters: [], creation: null, appearanceChoices, detailIndices: [0, 1],
    chat: [], chatChoices, ...chatDefaults, chatMounts: [0], dialogMounts: [], canvasUnavailable: false },
  onLoad() {
    this._canvasRequest = 0
    this._host = createWeChatLegacyGameHost({ wx, config, initialResources: lifecycle.takeGameResources(), render: view => {
      const next = view.dialog?.revision ?? null
      const changed = this._dialogRevision !== next
      if (changed) this._dialogDraft = this._dialogSecondDraft = ''
      const artKey = view.dialogArt?.key ?? null
      const bindArt = artKey !== null && artKey !== this._dialogArtKey
      const patch = { ...view, ...(changed ? { dialogMounts: next === null ? [] : [next] } : {}),
        ...(this.data.connected && !view.connected ? chatDefaults : {}) }
      this._dialogRevision = next
      this._dialogArtKey = artKey
      this.setData(patch, bindArt ? () => this.bindDialogCanvas(artKey) : undefined)
    } })
    this._unsubscribe = lifecycle.listen(() => this.onHide())
  },
  onReady() { this._ready = true; this.bindGameCanvas() },
  onShow() { if (this._ready) this.bindGameCanvas() },
  onResize() { if (this._ready) this.bindGameCanvas() },
  onHide() { this._canvasRequest++; this._dialogDraft = this._dialogSecondDraft = ''; this._host?.hide() },
  onUnload() { this._canvasRequest++; this._unsubscribe?.(); this._host?.close(); this._host = null },
  bindGameCanvas() {
    const request = ++this._canvasRequest
    try {
      wx.createSelectorQuery().in(this).select('#game-canvas').fields({ node: true, size: true, rect: true }).exec(rows => {
        if (this._canvasRequest !== request || !this._host) return
        const surface = rows?.[0]
        this.setData({ canvasUnavailable: !this._host.bindCanvas(surface?.node, surface) })
      })
    } catch { this.setData({ canvasUnavailable: true }) }
  },
  bindDialogCanvas(key) {
    const owner = this._host
    if (!owner || this._dialogArtKey !== key) return
    try {
      wx.createSelectorQuery().in(this).select('#game-dialog-canvas').fields({ node: true }).exec(rows => {
        if (this._host === owner && this._dialogArtKey === key) owner.bindDialogCanvas(rows?.[0]?.node, key)
      })
    } catch { owner.bindDialogCanvas(null, key) }
  },
  onStartup() { return this._host.chooseStartup() },
  onResources() { return this._host.chooseResources() },
  onConnect() { return this._host.connect() },
  onDisconnect() { this._dialogDraft = this._dialogSecondDraft = ''; this._host.disconnect() },
  onReturnToServers() { this._host.requestServerReturn() },
  onReturnToCity() { this._host.requestCityReturn() },
  onPause() { this._host.togglePause() },
  onInteract() { this._host.toggleInteract() },
  onLabels() { return this._host.mapAction('label') },
  onMinimap() { return this._host.toggleMinimap() },
  onMinimapRange() { return this._host.cycleMinimapRange() },
  onParty() { return this._host.mapAction('party') },
  onCharacter(event) {
    const { action, slot, direction } = event.currentTarget.dataset
    return this._host.character(action, Number(slot), Number(direction))
  },
  onCreation(event) {
    const { action, index, delta } = event.currentTarget.dataset
    let value
    if (action === 'appearance') value = Number(event.detail.value)
    else if (index !== undefined) value = { index: Number(index), delta: Number(delta) }
    else if (delta !== undefined) value = Number(delta)
    return this._host.creation(action, value)
  },
  onCreationReview(event) { return this._host.creation('review', event.detail.value.name) },
  onCraftMark(event) { return this._host.craftAction('mark',event.detail.value.mark) },
  onCraft(event) {
    const d=event.currentTarget.dataset
    const value=['skill','level','recipe','position','remove','person','subject'].includes(d.action)?Number(d.value):
      ['assign','target'].includes(d.action)?{slot:Number(d.slot),revision:Number(d.revision)}:
      d.action==='swap'?{from:Number(d.from),to:Number(d.to)}:undefined
    return this._host.craftAction(d.action,value)
  },
  onInventory(event) {
    const { action, slot, revision } = event.currentTarget.dataset
    return this._host.inventoryAction(action, { slot: Number(slot), revision: Number(revision) })
  },
  onInventorySplit(event) { return this._host.inventoryAction('split', event.detail.value.amount) },
  onShop(event) {
    const { action, row, revision } = event.currentTarget.dataset
    return this._host.shopAction(action, Number(revision), Number(row), event.detail?.value)
  },
  onService(event) {
    const { action, choice, revision } = event.currentTarget.dataset
    return this._host.serviceAction(action, Number(revision), Number(choice))
  },
  onBank(event) {
    const { action, revision, version, option } = event.currentTarget.dataset
    const input = event.detail?.value
    const value = action === 'from' || action === 'to' ? Number(input) : input ?? option
    return this._host.bankAction(action, Number(revision), Number(version), value)
  },
  onTrade(event) {
    const { action, revision, version, slot, rowRevision } = event.currentTarget.dataset
    const value = action === 'gold' ? event.detail?.value : slot === undefined ? null : Number(slot)
    return this._host.tradeAction(action, Number(revision), Number(version), value, Number(rowRevision))
  },
  onFamily(event) {
    const { action, revision, version, bit } = event.currentTarget.dataset
    const input = event.detail?.value
    const value = action === 'permission' ? Number(bit) : action.startsWith('select-') ? Number(input) : input
    return this._host.familyAction(action, Number(revision), Number(version), value)
  },
  onFamilyPet(event) {
    const { action, revision, slot, rowRevision } = event.currentTarget.dataset
    const value = action === 'name' ? event.detail?.value : Number(slot)
    return this._host.familyPetAction(action, Number(revision), value, Number(rowRevision))
  },
  onBoard(event) {
    const { action, revision, row } = event.currentTarget.dataset
    const value = action === 'draft' ? event.detail?.value : Number(row)
    return this._host.boardAction(action, Number(revision), value)
  },
  onTouch(event) {
    const kind = event.type.slice(5)
    if (kind === 'cancel' || kind === 'end' && !event.changedTouches?.length) { this._host.touch('cancel'); return }
    for (const touch of event.changedTouches?.length ? event.changedTouches : event.touches ?? []) this._host.touch(kind, touch)
  },
  onChatOption(event) {
    const { option } = event.currentTarget.dataset, choice = Number(event.detail.value)
    if (Object.hasOwn(chatChoices,option) && Number.isInteger(choice) && chatChoices[option][choice] !== undefined) {
      this.setData({ [option + 'Choice']: choice })
    }
  },
  async onChat(event) {
    const owner = this._host
    const {rangeChoice,colorChoice,sizeChoice} = this.data
    const options = { range: chatChoices.range[rangeChoice], color: chatChoices.color[colorChoice], size: sizeChoice }
    const sent = await owner.mapAction('chat', { text: event.detail.value.message, options })
    if (sent && this._host === owner) this.setData({ chatMounts: [this.data.chatMounts[0] + 1] })
    return sent
  },
  onPartyChat() { return this._host.mapAction('party-chat', !this.data.partySelected) },
  onDialogInput(event) {
    if (this._dialogRevision === Number(event.currentTarget.dataset.revision)) this._dialogDraft = event.detail.value
  },
  onDialogSecondInput(event) {
    if (this._dialogRevision === Number(event.currentTarget.dataset.revision)) this._dialogSecondDraft = event.detail.value
  },
  onDialog(event) {
    const { bit, choice, revision } = event.currentTarget.dataset
    const value = { bit: Number(bit), text: this._dialogDraft ?? '', second: this._dialogSecondDraft ?? '' }
    return this._host.mapAction('reply', value, Number(revision), choice === undefined ? null : Number(choice))
  },
  onDismiss(event) { return this._host.mapAction('dismiss', null, Number(event.currentTarget.dataset.revision)) },
  onBattle(event) {
    const { action, value, revision } = event.currentTarget.dataset
    return this._host.battle(action, action === 'command' ? value : Number(value), revision === undefined ? undefined : Number(revision))
  },
})
