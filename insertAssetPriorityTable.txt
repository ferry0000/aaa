/**
 * cntrList の内容をもとに、asset_priority_table に新規レコードをINSERTします。
 * priority == "-" のときは 0、
 * priority == "" または null のときはスキップします。
 */
public static void insertAssetPriorityTable(
        Connection connection,
        List<Map<String, String>> cntrList,
        List<Map<String, String>> useAssetDataList
) throws SQLException {
    // INSERT 文。sod_pid は必要に応じて適宜カラムと値を調整してください（ここでは 0 を固定挿入）
    String insertSql =
        "INSERT INTO asset_priority_table "
      + "(oo_id, to_id, tt_id, mission_type, asset_name, asset_priority, sod_pid) "
      + "VALUES (?, ?, ?, ?, ?, ?, 0)";

    try (PreparedStatement ps = connection.prepareStatement(insertSql)) {
        connection.setAutoCommit(false);

        for (Map<String, String> record : cntrList) {
            String ooId        = record.get("oo_id");
            String toId        = record.get("to_id");
            String ttId        = record.get("tt_id");
            String missionType = record.get("mission_type");

            for (int i = 0; i < useAssetDataList.size(); i++) {
                String assetName = useAssetDataList.get(i).get("asset_name");
                String key       = "asset_priority" + (i + 1);
                String priority  = record.get(key);

                // 空文字または null はスキップ
                if (priority == null || priority.isEmpty()) {
                    continue;
                }

                // "-" は 0、それ以外は数値にパース
                int priValue;
                if ("-".equals(priority)) {
                    priValue = 0;
                } else {
                    priValue = Integer.parseInt(priority);
                }

                // パラメータ設定
                ps.setString(1, ooId);
                ps.setString(2, toId);
                ps.setString(3, ttId);
                ps.setString(4, missionType);
                ps.setString(5, assetName);
                ps.setInt   (6, priValue);

                // 即時実行
                int inserted = ps.executeUpdate();
                if (inserted == 0) {
                    System.out.printf(
                        "Warning: no rows inserted for %s, %s, %s, %s, %s%n",
                        ooId, toId, ttId, missionType, assetName
                    );
                }
            }
        }

        connection.commit();
        connection.setAutoCommit(true);
        System.out.println("asset_priority_table へのINSERTが完了しました。");
    } catch (SQLException e) {
        connection.rollback();
        throw e;
    }
}