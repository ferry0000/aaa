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
 * parseDateTime を利用して、2ヶ月前の 00:00(JST) を
 * "YYYY/MM/DD hh:mm" 形式で返す関数
 *
 * @param {string} inputStr - "YYYY/MM/DD hh:mm" 形式の日時文字列 (JST)
 * @returns {string} - 2ヶ月前の 00:00(JST) を同フォーマットで返す
 */
function getMidnightTwoMonthsBeforeJST(inputStr) {
  // 1. parseDateTime で JST の Date オブジェクトを取得
  const originalDate = parseDateTime(inputStr);

  // 2. 元の年・月・日をそれぞれ取得
  const origYear = originalDate.getFullYear();
  const origMonthIndex = originalDate.getMonth(); // 0〜11
  const origDay = originalDate.getDate();

  // 3. 「2ヶ月前」の月インデックスを一旦計算
  const rawTargetMonthIndex = origMonthIndex - 2;
  //    年の繰り下げが必要かどうかを判断
  const yearOffset = Math.floor(rawTargetMonthIndex / 12);
  const targetYear = origYear + yearOffset;
  //    0〜11 の範囲に収める
  const targetMonthMod = ((rawTargetMonthIndex % 12) + 12) % 12;

  // 4. 2ヶ月前の「同じ日」が存在しない可能性に対応する
  //    → まずは該当月の末日を取得
  const daysInTargetMonth = new Date(targetYear, targetMonthMod + 1, 0).getDate();
  //    元の日が大きすぎる場合は「末日」に丸める
  const targetDay = Math.min(origDay, daysInTargetMonth);

  // 5. 2ヶ月前の 00:00(JST) を Date オブジェクトで作成
  const targetDate = new Date(targetYear, targetMonthMod, targetDay, 0, 0, 0, 0);

  // 6. フォーマット用に各要素をゼロ埋めして文字列化
  const Y = targetDate.getFullYear();
  const M = String(targetDate.getMonth() + 1).padStart(2, '0');
  const D = String(targetDate.getDate()).padStart(2, '0');
  const h = String(targetDate.getHours()).padStart(2, '0');   // 常に "00"
  const m = String(targetDate.getMinutes()).padStart(2, '0'); // 常に "00"

  return `${Y}/${M}/${D} ${h}:${m}`;
}

// --- 動作確認例 ---
console.log(getMidnightTwoMonthsBeforeJST("2025/05/18 14:27")); 
// → "2025/03/18 00:00"

console.log(getMidnightTwoMonthsBeforeJST("2025/03/31 22:10")); 
// → "2025/01/31 00:00"

console.log(getMidnightTwoMonthsBeforeJST("2025/03/30 09:05"));
// → "2025/01/30 00:00"

console.log(getMidnightTwoMonthsBeforeJST("2025/02/28 23:59"));
// → "2024/12/28 00:00"