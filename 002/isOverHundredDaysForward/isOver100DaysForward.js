/**
 * "YYYY/MM/DD hh:mm" 形式の文字列を Date オブジェクトに変換する関数
 */
function parseDateTime(str) {
  const [datePart, timePart] = str.split(' ');
  const [year, month, day] = datePart.split('/').map(Number);
  const [hour, minute] = timePart.split(':').map(Number);
  return new Date(year, month - 1, day, hour, minute);
}

/**
 * dateStr2 が dateStr1 より後の日時であるとき、
 * 2つの日時の差が 100日 を超えているかを判定する関数
 * @param {string} dateStr1 - 比較元 ("YYYY/MM/DD hh:mm")
 * @param {string} dateStr2 - 比較先 ("YYYY/MM/DD hh:mm")
 * @returns {boolean} dateStr2 - dateStr1 が 100日 を「超えている」なら true
 */
function isOver100DaysForward(dateStr1, dateStr2) {
  const d1 = parseDateTime(dateStr1);
  const d2 = parseDateTime(dateStr2);

  // dateStr2 が後であることが保証されているので、そのままミリ秒差を取る
  const diffMs = d2.getTime() - d1.getTime();

  // 1日 = 1000(ms) * 60(s) * 60(min) * 24(h) = 86,400,000 ms
  const oneDayMs = 1000 * 60 * 60 * 24;

  // ミリ秒 → 日数
  const diffDays = diffMs / oneDayMs;

  // 「100日を超えている」かどうか（strictly greater）
  return diffDays > 100;
}

// --- 使用例 ---
const start = "2025/01/01 00:00";
const end1  = "2025/04/12 00:00"; // 約 101 日後
const end2  = "2025/04/11 00:00"; // 約 100 日後

console.log(isOver100DaysForward(start, end1)); // true
console.log(isOver100DaysForward(start, end2)); // false