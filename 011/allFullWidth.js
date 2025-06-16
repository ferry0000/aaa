// ASCII 0x00–0x7F（制御文字を含む）と半角カナをすべて除外
const FULLWIDTH_RE = /^[^\x00-\x7F\uFF61-\uFF9F]+$/u;

/**
 * 配列内のすべての文字列が「全角のみ」で構成されているか判定する
 * 空文字列は正規表現がマッチしないため自動的に false になります
 *
 * @param {string[]} arr
 * @returns {boolean}
 */
function allFullWidth(arr) {
  return arr.every(s => FULLWIDTH_RE.test(s)); // length チェックは不要
}