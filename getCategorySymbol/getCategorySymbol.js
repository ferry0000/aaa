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
      map[itemName] = symbol;
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
  const symbolMap = createSymbolMap(opData);

  // 評価項目、又は評価が'-'の場合、算出対象から削除
  Object.keys(symbolMap).forEach(key => {
    if (key === SYMBOLS.HYPHEN || symbolMap[key] === SYMBOLS.HYPHEN) {
      delete symbolMap[key];
    }
  });

  // 「×」が一つでもあれば即 × を返す
  if (Object.values(symbolMap).includes(SYMBOLS.CROSS)) {
    return SYMBOLS.CROSS;
  }

  const { actualScore, perfectScore } = calculateScores(symbolMap, evaluationItemData);
  return determineCategory(actualScore, perfectScore);
}

// ─── 使用例 ───
const opData = {
  evaluationItem1: '-', evaluation1: '×',
  evaluationItem2: '判別', evaluation2: '-',
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