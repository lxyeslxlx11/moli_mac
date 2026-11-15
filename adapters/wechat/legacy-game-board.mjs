export const weChatBoardMode = 0x15;

function displayTime(seconds) {
  if (seconds === null) return '';
  const date = new Date(seconds * 1000), pad = value => String(value).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export function createWeChatBoard({ client, revision, decode, encode, notify }) {
  const { board, buttons } = client.copyMapDialog();
  let title, entries;
  try {
    const name = decode(board.title);
    title = name ? '留言板 · ' + name : '留言板';
    entries = board.entries.map(({ row, name, timestamp, lines, canDelete }) => ({
      row, author: decode(name) || '留言 ' + (row + 1), time: displayTime(timestamp),
      text: lines.map(decode).join('\n'), canDelete,
    }));
  } finally {
    board.title.fill(0);
    for (const row of board.entries) {
      row.name.fill(0);
      for (const line of row.lines) line.fill(0);
    }
  }
  let draft = '', review = null, sending = false, closed = false, notice = '';

  function snapshot() {
    return {
      revision, title, entries, draft, review, sending, notice,
      canPublish: !!draft.length && !sending, canPrevious: buttons.includes(0x10), canNext: buttons.includes(0x20),
    };
  }

  async function act(action, value) {
    if (closed || sending) return false;
    if (action === 'draft' && typeof value === 'string' && value.length <= 140) draft = value;
    else if (action === 'review-delete') {
      const entry = entries.find(row => row.row === value && row.canDelete);
      if (!entry) return false;
      review = { row: entry.row, text: '确认删除 ' + entry.author + ' 的留言？' };
    } else if (action === 'cancel-delete' && review) review = null;
    else {
      let button, choice = null;
      if (action === 'publish' && draft.length) button = 1;
      else if (action === 'previous' && buttons.includes(0x10)) button = 0x10;
      else if (action === 'next' && buttons.includes(0x20)) button = 0x20;
      else if (action === 'confirm-delete' && review) { button = 0x40; choice = review.row; }
      else if (action !== 'close') return false;
      sending = true;
      notice = '';
      notify();
      let bytes;
      try {
        if (action === 'close') client.dismissMapDialog(revision);
        else {
          if (action === 'publish') bytes = encode(draft.replace(/\r\n|\n/g, '\r'));
          await client.replyMapDialog(revision, button, choice, bytes ?? null);
        }
        return true;
      } catch (error) {
        notice = error.code === 'LEGACY_GAME_BOARD_TEXT' || error.code === 'LEGACY_GAME_DIALOG_TEXT' ?
          '请将留言缩短至两行，每行最多 70 字节。' : '留言操作未完成，请核对输入与当前编码。';
        return false;
      } finally {
        bytes?.fill(0);
        sending = false;
        if (!closed) notify();
      }
    }
    notice = '';
    notify();
    return true;
  }

  return Object.freeze({ revision, snapshot, act, close() { closed = true; draft = ''; review = null; } });
}
