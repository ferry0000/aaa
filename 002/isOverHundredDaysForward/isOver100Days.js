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
 * 2つの日時の差が100日を超えているかを判定する関数
 * @param {string} dateStr1 - 比較したい日時1 ("YYYY/MM/DD hh:mm")
 * @param {string} dateStr2 - 比較したい日時2 ("YYYY/MM/DD hh:mm")
 * @returns {boolean} 絶対差が100日を「超えている」なら true
 */
function isOver100Days(dateStr1, dateStr2) {
  const d1 = parseDateTime(dateStr1);
  const d2 = parseDateTime(dateStr2);

  // ２つの Date の差をミリ秒で計算し、絶対値を取る
  const diffMs = Math.abs(d2.getTime() - d1.getTime());

  // 1日 = 1000(ms) * 60(s) * 60(min) * 24(h) = 86,400,000 ms
  const oneDayMs = 1000 * 60 * 60 * 24;

  // ミリ秒 → 日数
  const diffDays = diffMs / oneDayMs;

  // 「100日を超えている」かどうか（strictly greater）
  return diffDays > 100;
}

// --- 使用例 ---
const a = "2025/01/01 00:00";
const b = "2025/04/12 12:00"; // 100日後は 2025/04/11 00:00 あたり

console.log(isOver100Days(a, b)); // true （およそ 101.5 日差）
console.log(isOver100Days(a, "2025/04/11 00:00")); // false （ぴったり100日なので「超えていない」）