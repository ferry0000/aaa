const record1 = [];
const record2 = [2, 4, 6];
const record3 = [8];
const record4 = [];
const record5 = [];

let allEmpty = true;
for (let i = 1; i <= 5; i++) {
  const arr = window["record" + i]; // 文字列から変数を参照
  if (arr.length > 0) {
    allEmpty = false;
    break;
  }
}
console.log(allEmpty); // false

const records = Array.from(
  { length: 100 },
  (_, i) => globalThis[`record${i + 1}`]
);
//   .filter(Array.isArray); // 未定義や配列以外を除外

const allEmpty = records.every((a) => a.length === 0);
