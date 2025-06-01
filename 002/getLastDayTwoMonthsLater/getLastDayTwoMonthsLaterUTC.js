/**
 * 入力文字列 (UTC) をパースし、UTC で 2ヶ月後の末日 23:59 を
 * "YYYY/MM/DD hh:mm" 形式で返す関数
 *
 * @param {string} inputStr - "YYYY/MM/DD hh:mm" 形式の日時文字列 (UTC)
 * @returns {string} "YYYY/MM/DD hh:mm" 形式で 2ヶ月後末日の UTC 23:59
 */
function getLastDayTwoMonthsLaterUTC(inputStr) {
  // 1. 入力 "YYYY/MM/DD hh:mm" を分割して数値化
  const [datePart, timePart] = inputStr.split(' ');
  const [year, month, day] = datePart.split('/').map(Number);
  const [hour, minute] = timePart.split(':').map(Number);

  // 2. UTC として Date オブジェクトを作成
  //    Date.UTC の結果を渡すと、new Date(ミリ秒) は UTC として扱われる
  const originalDateUTC = new Date(Date.UTC(year, month - 1, day, hour, minute, 0));

  // 3. 2ヶ月後の末日を UTC で求める
  const origYear = originalDateUTC.getUTCFullYear();
  const origMonthIndex = originalDateUTC.getUTCMonth(); // 0〜11
  const targetMonthIndex = origMonthIndex + 2;
  const targetYear = origYear + Math.floor(targetMonthIndex / 12);
  const targetMonthMod = targetMonthIndex % 12;

  // 2ヶ月後の「末日」を求める：UTC で (targetYear, targetMonthMod + 1, 0) とし、日付は当該月の最後
  const lastDayDateUTC = new Date(Date.UTC(targetYear, targetMonthMod + 1, 0, 23, 59, 0));

  // 4. 各要素を UTC で取り出し、ゼロ埋めして文字列を組み立て
  const Y = lastDayDateUTC.getUTCFullYear();
  const M = String(lastDayDateUTC.getUTCMonth() + 1).padStart(2, '0');
  const D = String(lastDayDateUTC.getUTCDate()).padStart(2, '0');
  const h = String(lastDayDateUTC.getUTCHours()).padStart(2, '0');
  const m = String(lastDayDateUTC.getUTCMinutes()).padStart(2, '0');

  return `${Y}/${M}/${D} ${h}:${m}`;
}

// --- 動作確認例 ---
console.log(getLastDayTwoMonthsLaterUTC("2025/01/15 08:30")); 
// 期待出力例: "2025/03/31 23:59"（UTC 前提でも年月日は同じロジックで求まる）