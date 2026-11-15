/** Internal fixed37c4 numeric helpers. No original pointer tables or preview pixels are emulated. */
export function source500e90(code) {
  if (code > 29999 && code < 98000) {
    if (code > 69999) code -= 12000;
    let family = Math.trunc((code - 30000) / 4000); code = (code - 30000) % 4000;
    const first = Math.trunc(code / 1000); code %= 1000; const second = Math.trunc(code / 10); code %= 10;
    if (family === 3) return code + (second + (first + 0x1fc0) * 5) * 5;
    if (family === 4) family = 3;
    code += (second + (first + 0x1fb0 + family * 4) * 5) * 5;
  }
  return code;
}
export function source500dd0(code) {
  if (code > 202799 && code < 204200) {
    let family = Math.trunc((code - 202800) / 100);
    const remainder = (code - 202800) % 100, variant = remainder % 25;
    if (family === 3) family = 4; else if (family === 4) family = 3;
    code = variant % 5 + (Math.trunc(variant / 5) + (Math.trunc(remainder / 25) + 30 + family * 4) * 100) * 10;
    if (code > 57999) code += 12000;
  }
  return code;
}
export function source5012d0(code) {
  if (code > 0x3182f && code < 0x31da9) return code + 0x9150;
  const order = [2000, 2002, 2008, 2010, 2012, 2014, 2016, 2004, 2006, 2018, 2020, 2022, 2024, 2026];
  const at = order.indexOf(Math.trunc(code / 100));
  return at < 0 ? code : code % 100 + (at * 5 + 0x2f26) * 20;
}
export function source501200(code) {
  if (code > 239999 && code < 241400) return code - 37200;
  const order = [200000, 200200, 200800, 201000, 201200, 201400, 201600, 200400, 200600, 201800, 202000, 202200, 202400, 202600];
  const index = Math.trunc((code - 241400) / 100);
  if (index < 0 || index >= order.length) { const error = new Error('Native inverse table has no supported value here.'); error.code = 'LEGACY_CHARACTER_CODE_TABLE'; throw error; }
  return order[index] + code % 100;
}
// The caller owns the exact148B record. Return only the code computed before native object allocation.
export function prepareCharacterPreviewRecord(record) {
  if (!record[0]) return null;
  const view = new DataView(record.buffer, record.byteOffset, record.byteLength);
  if (view.getInt32(24, true) < 30000) view.setInt32(24, 0x814c, true);
  const normalized = source5012d0(source500e90(view.getInt32(24, true))), variant = view.getInt32(80, true);
  if (variant < 0 && normalized >= 240000 && normalized < 241400) view.setInt32(80, 1, true);
  else if (variant < 0 || normalized >= 241400) view.setInt32(80, 2, true);
  return normalized;
}
