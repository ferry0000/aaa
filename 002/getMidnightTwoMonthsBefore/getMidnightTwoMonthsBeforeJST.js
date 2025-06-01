/**
 * 入力文字列 (JST) をパースし、2ヶ月前の 00:00 (JST) を
 * "YYYY/MM/DD hh:mm" 形式で返す関数
 *
 * @param {string} inputStr - "YYYY/MM/DD hh:mm" 形式の日時文字列 (JST)
 * @returns {string} - "YYYY/MM/DD hh:mm" 形式の、2ヶ月前の 00:00(JST)
 */
function getMidnightTwoMonthsBeforeJST(inputStr) {
  // 1. 入力 "YYYY/MM/DD hh:mm" を分割して数値化
  //    例: "2025/05/18 14:27" → year=2025, month=5, day=18, hour=14, minute=27
  const [datePart, timePart] = inputStr.split(' ');
  const [year, month, day] = datePart.split('/').map(Number);
  // (時刻部分はここでは使いませんが、分解だけしておきます)
  // eslint-disable-next-line no-unused-vars
  const [hour, minute] = timePart.split(':').map(Number);

  // 2. 元の年月日を 0 〜 11 の monthIndex に直し、Date オブジェクトを生成
  //    （ここでは「日付をそのまま使う」ので、時刻は無視しても構いません）
  const origYear = year;
  const origMonthIndex = month - 1; // 0～11
  const origDay = day;

  // 3. 「２ヶ月前」の月インデックスを求める
  //    ─── rawTargetMonthIndex が負になるケースも Math.floor で年を調整する
  const rawTargetMonthIndex = origMonthIndex - 2;
  //    「何年繰り上がる (または繰り下がる) か」を計算
  const yearOffset = Math.floor(rawTargetMonthIndex / 12);
  const targetYear = origYear + yearOffset;
  //    0～11 に収めるために、正の値に戻す
  const targetMonthMod = ((rawTargetMonthIndex % 12) + 12) % 12;

  // 4. ２ヶ月前の “同じ日” が存在しない月の場合（たとえば 5/31 → 3月には 31日がない）、
  //    その月の末日まで合わせる。まずは該当月の末日を取得
  const daysInTargetMonth = new Date(targetYear, targetMonthMod + 1, 0).getDate();
  //    例: 2025年3月の末日を知るなら new Date(2025, 3, 0).getDate() → 31
  const targetDay = Math.min(origDay, daysInTargetMonth);

  // 5. 「２ヶ月前の同じ日もしくは末日」の 00:00 JST を Date で作成
  //    new Date(year, monthIndex, day, hour, minute) はローカルタイム (ここでは JST) として扱われる
  const targetDate = new Date(targetYear, targetMonthMod, targetDay, 0, 0, 0, 0);

  // 6. "YYYY/MM/DD hh:mm" 形式にフォーマットするため、各要素を取り出してゼロ埋め
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
// 3月31日の2ヶ月前 → 1月31日 00:00 → "2025/01/31 00:00"

console.log(getMidnightTwoMonthsBeforeJST("2025/03/30 09:05"));
// 3月30日の2ヶ月前 → 1月30日 00:00 → "2025/01/30 00:00"

console.log(getMidnightTwoMonthsBeforeJST("2025/03/31 12:00"));
// 3月31日の2ヶ月前 → 1月31日 00:00 → "2025/01/31 00:00"

console.log(getMidnightTwoMonthsBeforeJST("2025/02/28 23:59"));
// 2月28日の2ヶ月前 → 12月28日 00:00 → "2024/12/28 00:00"