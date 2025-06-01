/**
 * "YYYY/MM/DD hh:mm" 形式の文字列を Date オブジェクトに変換する関数
 */
function parseDateTime(str) {
  // "YYYY/MM/DD hh:mm" を ["YYYY/MM/DD", "hh:mm"] に分割
  const [datePart, timePart] = str.split(' ');
  const [year, month, day] = datePart.split('/').map(Number);
  const [hour, minute] = timePart.split(':').map(Number);
  // month は 0 始まりなので (月 - 1) する
  return new Date(year, month - 1, day, hour, minute);
}

/**
 * dateStr1 < dateStr2 かどうかを判定する関数
 * @param {string} dateStr1 - 比較元 ("YYYY/MM/DD hh:mm")
 * @param {string} dateStr2 - 比較先 ("YYYY/MM/DD hh:mm")
 * @returns {boolean} dateStr1 が dateStr2 より過去の場合に true
 */
function isEarlier(dateStr1, dateStr2) {
  const d1 = parseDateTime(dateStr1);
  const d2 = parseDateTime(dateStr2);
  return d1.getTime() < d2.getTime();
}

// 使用例
const a = "2025/06/01 12:30";
const b = "2025/06/01 15:45";

if (isEarlier(a, b)) {
  console.log(`${a} は ${b} より前の日時です`);
} else {
  console.log(`${a} は ${b} と同時刻か後の日時です`);
}