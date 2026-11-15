import { inspectIndex, getRecord, frameRange, decodeRD } from '../shared/index.mjs';
import { readIndexFile, readFrameFile, formatBytes } from './file-io.mjs';
import { makeSyntheticPair } from './fixture.mjs';
import { PixelView } from './pixel-view.mjs';

const byID = (id) => document.getElementById(id);
const elements = {
  index: byID('index-file'), graphic: byID('graphic-file'), ordinal: byID('record-ordinal'),
  previous: byID('previous-record'), next: byID('next-record'), inspect: byID('inspect-button'),
  status: byID('inspection-status'), statusText: byID('status-text'), total: byID('record-total'),
};
const viewer = new PixelView(byID('pixel-canvas'), byID('canvas-stage'), byID('empty-state'));
const state = { indexFile: null, graphicFile: null, indexBytes: null, summary: null, generation: 0, busy: false };

function status(message, kind = 'success') {
  elements.statusText.textContent = message;
  elements.status.dataset.kind = kind;
}

function clearResult() {
  viewer.clear();
  for (const id of ['source', 'size', 'record', 'version', 'range', 'palette']) byID(`meta-${id}`).textContent = '—';
}

function updateControls() {
  const ready = Boolean(state.indexFile && state.graphicFile);
  const ordinal = Number(elements.ordinal.value);
  elements.inspect.disabled = !ready || state.busy;
  elements.inspect.textContent = state.busy ? '正在读取…' : '核验并查看';
  elements.previous.disabled = !ready || state.busy || !state.summary || !Number.isInteger(ordinal) || ordinal <= 0;
  elements.next.disabled = !ready || state.busy || !state.summary || !Number.isInteger(ordinal) || ordinal >= state.summary.recordCount - 1;
  elements.ordinal.disabled = state.busy;
  elements.ordinal.setAttribute('aria-busy', String(state.busy));
}

function describeFile(input, labelID) {
  const file = input.files?.[0] ?? null;
  byID(labelID).textContent = file ? `${file.name} · ${formatBytes(file.size)}` : '尚未选择';
  return file;
}

function onFilesChanged() {
  state.generation += 1;
  state.busy = false;
  state.indexFile = describeFile(elements.index, 'index-file-name');
  state.graphicFile = describeFile(elements.graphic, 'graphic-file-name');
  state.indexBytes = null;
  state.summary = null;
  elements.ordinal.value = '0';
  elements.ordinal.removeAttribute('max');
  elements.total.textContent = '选择配对文件后读取索引。';
  clearResult();
  status(state.indexFile && state.graphicFile ? '文件已选择。输入记录序号，然后核验并查看。' : '请选择索引和配对图形数据文件。', 'waiting');
  updateControls();
}

function present(frame, record, range, sourceLabel) {
  viewer.show(frame, sourceLabel);
  byID('meta-source').textContent = sourceLabel;
  byID('meta-size').textContent = `${frame.width} × ${frame.height} · ${frame.pixels.length.toLocaleString('zh-CN')} 像素`;
  byID('meta-record').textContent = `${record.ordinal} / ${record.id}`;
  byID('meta-version').textContent = `v${frame.version} · 原始索引像素`;
  byID('meta-range').textContent = `${range.start.toLocaleString('zh-CN')} – ${range.end.toLocaleString('zh-CN')} B（末端不含）`;
  const paletteBytes = frame.opaque.paletteBytes.byteLength;
  byID('meta-palette').textContent = paletteBytes ? `${paletteBytes} B · 保留，未解释颜色` : '无内嵌调色板';
}

async function inspectSelected() {
  if (!state.indexFile || !state.graphicFile) return;
  // Every inspection intent supersedes any older request, even if validation fails.
  const generation = ++state.generation;
  const text = elements.ordinal.value.trim();
  const ordinal = Number(text);
  if (!/^\d+$/.test(text) || !Number.isSafeInteger(ordinal) || ordinal < 0) {
    state.busy = false;
    clearResult();
    status('记录序号必须是从 0 开始的非负整数。', 'error');
    updateControls();
    return;
  }
  const indexFile = state.indexFile;
  const graphicFile = state.graphicFile;
  state.busy = true;
  clearResult();
  status('正在读取索引与所选记录。', 'waiting');
  updateControls();
  try {
    const bytes = state.indexBytes ?? await readIndexFile(indexFile);
    if (generation !== state.generation) return;
    const summary = state.summary ?? inspectIndex(bytes, { pairedByteCount: graphicFile.size });
    state.indexBytes = bytes;
    state.summary = summary;
    elements.ordinal.max = String(summary.recordCount - 1);
    elements.total.textContent = `共 ${summary.recordCount.toLocaleString('zh-CN')} 条记录 · 序号 0–${(summary.recordCount - 1).toLocaleString('zh-CN')}`;
    const record = getRecord(bytes, ordinal, { pairedByteCount: graphicFile.size });
    const range = frameRange(record, { pairedByteCount: graphicFile.size });
    const frameBytes = await readFrameFile(graphicFile, range);
    if (generation !== state.generation) return;
    const frame = decodeRD(frameBytes, { record });
    present(frame, record, range, '本地文件 · 只读核验');
    status(`结构核验通过。已读取 ${formatBytes(range.byteLength)}，未加载整份图形文件。`);
  } catch (error) {
    if (generation !== state.generation) return;
    clearResult();
    const code = error?.code ? ` [${error.code}]` : '';
    status(`未显示此记录${code}：${error?.message ?? String(error)}`, 'error');
  } finally {
    if (generation === state.generation) {
      state.busy = false;
      updateControls();
    }
  }
}

function loadFixture() {
  state.generation += 1;
  state.busy = false;
  state.indexFile = null;
  state.graphicFile = null;
  state.indexBytes = null;
  state.summary = null;
  elements.index.value = '';
  elements.graphic.value = '';
  elements.ordinal.value = '0';
  elements.ordinal.removeAttribute('max');
  byID('index-file-name').textContent = '尚未选择';
  byID('graphic-file-name').textContent = '尚未选择';
  elements.total.textContent = '合成示例仅含 1 条记录；选择文件后可检查真实记录。';
  clearResult();
  try {
    const pair = makeSyntheticPair();
    inspectIndex(pair.index, { pairedByteCount: pair.frame.byteLength });
    const record = getRecord(pair.index, 0, { pairedByteCount: pair.frame.byteLength });
    const range = frameRange(record, { pairedByteCount: pair.frame.byteLength });
    const frame = decodeRD(pair.frame, { record });
    present(frame, record, range, '原创合成夹具');
    status('当前显示原创合成夹具，仅用于核验解析和灰度显示流程。');
  } catch (error) {
    status(`合成夹具检查失败：${error?.message ?? String(error)}`, 'error');
  }
  updateControls();
}

elements.index.addEventListener('change', onFilesChanged);
elements.graphic.addEventListener('change', onFilesChanged);
elements.ordinal.addEventListener('input', updateControls);
byID('inspect-form').addEventListener('submit', (event) => { event.preventDefault(); inspectSelected(); });
elements.previous.addEventListener('click', () => { elements.ordinal.value = String(Number(elements.ordinal.value) - 1); inspectSelected(); });
elements.next.addEventListener('click', () => { elements.ordinal.value = String(Number(elements.ordinal.value) + 1); inspectSelected(); });
byID('load-fixture').addEventListener('click', loadFixture);
byID('view-scale').addEventListener('change', (event) => viewer.setScale(event.target.value));
loadFixture();
