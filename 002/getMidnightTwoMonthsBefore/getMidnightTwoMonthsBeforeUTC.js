/**
 * 入力文字列 (UTC) をパースし、2ヶ月前の 00:00 (UTC) を
 * "YYYY/MM/DD hh:mm" 形式で返す関数
 *
 * @param {string} inputStr - "YYYY/MM/DD hh:mm" 形式の日時文字列 (UTC)
 * @returns {string} - "YYYY/MM/DD hh:mm" 形式の、2ヶ月前の 00:00 (UTC)
 */
function getMidnightTwoMonthsBeforeUTC(inputStr) {
  // 1. 入力 "YYYY/MM/DD hh:mm" を分割して数値化
  const [datePart, timePart] = inputStr.split(' ');
  const [year, month, day] = datePart.split('/').map(Number);
  // 時刻部分はここでは結果に影響しないが、パースのために分割しておく
  // eslint-disable-next-line no-unused-vars
  const [hour, minute] = timePart.split(':').map(Number);

  // 2. 元の年月日を 0 〜 11 の monthIndex に直し、UTC として Date オブジェクト（確認用）を作成
  //    ただし時刻は使わないので、Date オブジェクト自体はなくても構わないが、Year/Month を揃えるために保持
  const origYearUTC = year;
  const origMonthIndexUTC = month - 1; // 0〜11
  const origDayUTC = day;

  // 3. 「2ヶ月前」の月インデックスを求める
  const rawTargetMonthIndex = origMonthIndexUTC - 2;
  //    Math.floor(raw / 12) で「何年繰り下がるか」を計算 （負数でも対応）
  const yearOffset = Math.floor(rawTargetMonthIndex / 12);
  const targetYear = origYearUTC + yearOffset;
  //    「0～11 の範囲の月」に戻す
  const targetMonthMod = ((rawTargetMonthIndex % 12) + 12) % 12;

  // 4. 「2ヶ月前の同じ日」が存在しないときは、その月の末日を使う
  //    → まずは該当月の末日を UTC で取得
  //    new Date(Date.UTC(year, monthIndex + 1, 0)) の getUTCDate() で末日の日にち
  const daysInTargetMonth = new Date(Date.UTC(targetYear, targetMonthMod + 1, 0)).getUTCDate();
  //    例: 2025年3月なら new Date(Date.UTC(2025, 3, 0)).getUTCDate() → 31
  const targetDay = Math.min(origDayUTC, daysInTargetMonth);

  // 5. 「2ヶ月前の当日 00:00 (UTC)」を表す Date オブジェクトを作成
  const targetDateUTC = new Date(Date.UTC(targetYear, targetMonthMod, targetDay, 0, 0, 0));

  // 6. フォーマット用に各要素を UTC で取り出し、ゼロ埋めして文字列を組み立て
  const Y = targetDateUTC.getUTCFullYear();
  const M = String(targetDateUTC.getUTCMonth() + 1).padStart(2, '0');
  const D = String(targetDateUTC.getUTCDate()).padStart(2, '0');
  const h = String(targetDateUTC.getUTCHours()).padStart(2, '0');   // 常に "00"
  const m = String(targetDateUTC.getUTCMinutes()).padStart(2, '0'); // 常に "00"

  return `${Y}/${M}/${D} ${h}:${m}`;
}

// --- 動作確認例 ---
console.log(getMidnightTwoMonthsBeforeUTC("2025/05/18 14:27")); 
// → "2025/03/18 00:00" （UTC 前提でも、年月日の算出は同じロジック）

console.log(getMidnightTwoMonthsBeforeUTC("2025/03/31 22:10")); 
// → "2025/01/31 00:00" （3月31日の2ヶ月前は1月31日 00:00）

console.log(getMidnightTwoMonthsBeforeUTC("2025/03/30 09:05")); 
// → "2025/01/30 00:00"

console.log(getMidnightTwoMonthsBeforeUTC("2025/03/31 12:00")); 
// → "2025/01/31 00:00"

console.log(getMidnightTwoMonthsBeforeUTC("2025/02/28 23:59")); 
// → "2024/12/28 00:00" （2月29日がない年でも自動で末日扱いにはならず、28日の2ヶ月前は12/28）