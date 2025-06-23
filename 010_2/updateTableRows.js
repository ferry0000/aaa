/**
 * 配列 data の内容でテーブルを更新する
 * @param {Array<string>} data - 0〜5 件のデータ
 */
function updateTableRows(data) {
  const tbody = document.querySelector('#sampleTable tbody');
  const rows  = tbody.querySelectorAll('tr');

  // ① 各行を更新
  for (const [index, tr] of rows.entries()) {
    if (data.length <= index) {
      // データが無い行：非表示
      tr.style.display = 'none';
      // field.[`eva_item_name_${idx + 1}`].value = hyphen;
      // field.[`eva_item_${idx + 1}`].value = hyphen;
    }
  }
}