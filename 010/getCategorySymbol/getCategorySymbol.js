/** 評価記号 */
const SYMBOLS = {
  CROSS: '×',
  TRIANGLE: '△',
  CIRCLE: '○',
  DOUBLE_CIRCLE: '◎',
  HYPHEN: '-'
};
/** 評価記号スコア */
const SYMBOL_SCORES = { '×': 0, '△': 1, '○': 2, '◎': 3 };

// 1) 「項目名 → 評価記号」のマップを作成
function createSymbolMap(opData) {
  const map = {};
  Object
    .keys(opData)
    .filter(key => key.startsWith('evaluationItem'))
    .forEach(itemKey => {
      const idx = itemKey.replace('evaluationItem', '');
      const itemName = opData[itemKey];
      const symbol = opData[`evaluation${idx}`];
      // 評価項目かつ評価が'-'でない場合、追加
      if (itemName !== SYMBOLS.HYPHEN && symbol !== SYMBOLS.HYPHEN) {
        map[itemName] = symbol;
      }
    });
  return map;
}

// 2) 合計スコアと満点スコアを計算（forEach を使用）
/**
 * 合計スコアと満点スコアを計算する。
 *
 * @param {Object.<string,string>} symbolMap
 *   - 「項目名」→「評価記号」を紐付けたマップ。
 * @param {Array.<{evaluationItem: string, weight: string}>} evaluationItemData
 *   - 各評価項目とその重みの配列。
 * @param {Object.<string,number>} scoreMap
 *   - 評価記号（"×","△","○","◎"）→数値のマップ。
 * @returns {{ actualScore: number, perfectScore: number }}
 *   - actualScore: 重み付きの実スコア合計。
 *   - perfectScore: 重み付きの満点スコア合計。
 */
function calculateScores(symbolMap, evaluationItemData) {
  let actualScore = 0;
  let perfectScore = 0;
  const perfectValue = SYMBOL_SCORES[SYMBOLS.DOUBLE_CIRCLE] || 0;

  evaluationItemData.forEach(({ evaluationItem, weight }) => {
    const w = Number(weight);
    const evaluation = symbolMap[evaluationItem];
    const sAct = SYMBOL_SCORES[evaluation];
    if (sAct !== undefined) {
      actualScore += w * sAct;
      perfectScore += w * perfectValue;
    }
  });

  return { actualScore, perfectScore };
}

// 3) 区分シンボルを計算
function determineCategory(actualScore, perfectScore) {
  const segment = Math.floor(perfectScore / 4);

  if (actualScore <= segment) return SYMBOLS.CROSS;
  else if (actualScore <= segment * 2) return SYMBOLS.TRIANGLE;
  else if (actualScore <= segment * 3) return SYMBOLS.CIRCLE;
  else return SYMBOLS.DOUBLE_CIRCLE;
}

// 4) 全体をまとめて「区分シンボル」を返す関数
function getCategorySymbol(opData, evaluationItemData) {

  // ─── 評価項目重複チェック ───
  if (checkDupEvaItems(opData)) {
    return;
  }

  const symbolMap = createSymbolMap(opData);

  // 算出対象が無い場合、処理終了
  if (!Object.keys(symbolMap).length) {
    return;
  }

  // 「×」が一つでもあれば即 × を返す
  if (Object.values(symbolMap).includes(SYMBOLS.CROSS)) {
    return SYMBOLS.CROSS;
  }

  const { actualScore, perfectScore } = calculateScores(symbolMap, evaluationItemData);
  return determineCategory(actualScore, perfectScore);
}

/**
 * 評価項目重複チェック
 * 
 * @param {*} opData 
 * @returns 
 */
function checkDupEvaItems(opData) {

  // ─── 評価項目重複チェック ───
  // evaluationItem1, evaluationItem2… の値を取得
  const evaluationItems = Object
    .keys(opData)
    .filter(key => key.startsWith('evaluationItem'))
    .map(key => opData[key])
    // '-'を除外
    .filter(item => item !== SYMBOLS.HYPHEN);
  // 重複があれば true、なければ false を返す
  return new Set(evaluationItems).size !== evaluationItems.length;
}

// ─── 使用例 ───
const opData = {
  evaluationItem1: '-', evaluation1: '×',
  evaluationItem2: '判別性', evaluation2: '-',
  evaluationItem3: '可能性', evaluation3: 'a',
  evaluationItem4: '完全性', evaluation4: '△'
};
const evaluationItemData = [
  { evaluationItem: '完全性', weight: '3' },
  { evaluationItem: '可能性', weight: '1' },
  { evaluationItem: '可用性', weight: '5' },
  { evaluationItem: '判別性', weight: '3' }
];

const category = getCategorySymbol(opData, evaluationItemData);
console.log(`区分シンボル: ${category}`);  // 例: '○'