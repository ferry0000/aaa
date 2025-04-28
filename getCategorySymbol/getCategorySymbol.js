// 1) 「項目名 → 評価記号」のマップを作成
function createSymbolMap(opData) {
  const map = {};
  Object
    .keys(opData)
    .filter(key => key.startsWith("evaluationItem"))
    .forEach(itemKey => {
      const idx      = itemKey.replace("evaluationItem", "");
      const itemName = opData[itemKey];
      const symbol   = opData[`evaluation${idx}`];
      map[itemName]  = symbol;
    });
  return map;
}

// 2) 合計スコアと満点スコアを計算（forEach を使用）
function calculateScores(symbolMap, evaluationItemData, scoreMap) {
  let actualScore  = 0;
  let perfectScore = 0;
  const perfectValue = scoreMap["◎"] || 0;

  evaluationItemData.forEach(({ evaluationItem, weight }) => {
    const w    = Number(weight);
    const sAct = scoreMap[symbolMap[evaluationItem]] || 0;
    actualScore  += w * sAct;
    perfectScore += w * perfectValue;
  });

  return { actualScore, perfectScore };
}

// 3) 区分シンボルを計算
function determineCategory(actualScore, perfectScore) {
  const symbols = ["×", "△", "○", "◎"];
  const segment = Math.floor(perfectScore / 4);

  if      (actualScore <= segment)      return symbols[0];
  else if (actualScore <= segment * 2)  return symbols[1];
  else if (actualScore <= segment * 3)  return symbols[2];
  else                                  return symbols[3];
}

// 4) 全体をまとめて「区分シンボル」を返す関数
function getCategorySymbol(opData, evaluationItemData) {
  const scoreMap = { "×": 0, "△": 1, "○": 2, "◎": 3 };
  const symbolMap = createSymbolMap(opData);

  // 「×」が一つでもあれば即 × を返す
  if (Object.values(symbolMap).includes("×")) {
    return "×";
  }

  const { actualScore, perfectScore } = calculateScores(symbolMap, evaluationItemData, scoreMap);
  return determineCategory(actualScore, perfectScore);
}

// ─── 使用例 ───
const opData = {
  evaluationItem1: "可用性", evaluation1: "◎",
  evaluationItem2: "判別性", evaluation2: "○",
  evaluationItem3: "可能性", evaluation3: "○",
  evaluationItem4: "完全性", evaluation4: "△"
};
const evaluationItemData = [
  { evaluationItem: "完全性", weight: "3" },
  { evaluationItem: "可能性", weight: "1" },
  { evaluationItem: "可用性", weight: "5" },
  { evaluationItem: "判別性", weight: "3" }
];

const category = getCategorySymbol(opData, evaluationItemData);
console.log(`区分シンボル: ${category}`);  // 例: "○"