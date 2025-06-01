/**
 * 入力文字列 (JST) をパースし、2ヶ月後の末日 23:59 (JST) を
 * "YYYY/MM/DD hh:mm" 形式で返す関数
 *
 * @param {string} inputStr - "YYYY/MM/DD hh:mm" 形式の日時文字列 (JST)
 * @returns {string} "YYYY/MM/DD hh:mm" 形式で 2ヶ月後末日の 23:59
 */
function getLastDayTwoMonthsLaterJST(inputStr) {
  // 1. 入力 "YYYY/MM/DD hh:mm" を分割して数値化
  const [datePart, timePart] = inputStr.split(" ");
  const [year, month, day] = datePart.split("/").map(Number);
  const [hour, minute] = timePart.split(":").map(Number);

  // 2. 元の Date オブジェクトをローカルタイム（JST）で作成
  //    month - 1 で 0〜11 の monthIndex にする
  const originalDate = new Date(year, month - 1, day, hour, minute);

  // 3. 2ヶ月後の「末日」を取得するには、(元の月Index + 2) + 1 の月の 0 日目を利用
  //    例えば、元の月Index が 0 (1月) なら、2ヶ月後は 2 (3月) → 末日は new Date(year, 3, 0) で取得。
  const origYear = originalDate.getFullYear();
  const origMonthIndex = originalDate.getMonth(); // 0〜11
  const targetMonthIndex = origMonthIndex + 2; // 2ヶ月後の monthIndex (0 based)
  // 年またぎの考慮
  const targetYear = origYear + Math.floor(targetMonthIndex / 12);
  const targetMonthMod = targetMonthIndex % 12;

  // 2ヶ月後の末日（時刻はいったん 00:00）
  // → Date(targetYear, targetMonthMod + 1, 0) で “次の月の 0 日目” → 2ヶ月後の末日
  const lastDayDate = new Date(targetYear, targetMonthMod + 1, 0);

  // 4. 時刻を 23:59 にセット
  lastDayDate.setHours(23, 59, 0, 0);

  // 5. ゼロ埋めして文字列を組み立て
  const Y = lastDayDate.getFullYear();
  const M = String(lastDayDate.getMonth() + 1).padStart(2, "0"); // getMonth() は 0〜11
  const D = String(lastDayDate.getDate()).padStart(2, "0");
  const h = String(lastDayDate.getHours()).padStart(2, "0");
  const m = String(lastDayDate.getMinutes()).padStart(2, "0");

  return `${Y}/${M}/${D} ${h}:${m}`;
}

// --- 動作確認例 ---
console.log(getLastDayTwoMonthsLaterJST("2025/01/15 08:30"));
// 期待出力例: "2025/03/31 23:59"（1月15日の2ヶ月後は3月末）
// JST 前提なので、Date の挙動は日本標準時として扱われます