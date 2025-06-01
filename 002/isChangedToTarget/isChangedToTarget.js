const TARGETS = {
  AAA: 2,
  BBB: 4,
  CCC: 5,
};
function isChangedToTargetBySwitch(originalValue, newValue) {
  switch (newValue) {
    case TARGETS.AAA:
    case TARGETS.BBB:
    case TARGETS.CCC:
      // newValue が 2,4,5 のいずれかの場合のみここに来る
      return newValue !== originalValue;
    default:
      return false;
  }
}

function isChangedToTarget(originalValue, newValue) {
  return (
    newValue !== originalValue &&
    (newValue === TARGETS.AAA ||
      newValue === TARGETS.BBB ||
      newValue === TARGETS.CCC)
  );
}
function isChangedToTargetByArray(originalValue, newValue) {
  // TARGETS オブジェクトの値部分を配列にする（[2, 4, 5] になる）
  const targetValues = Object.values(TARGETS);

  // newValue が TARGETS の値のいずれか AND newValue と originalValue が異なる
  return targetValues.includes(newValue) && newValue !== originalValue;
}
