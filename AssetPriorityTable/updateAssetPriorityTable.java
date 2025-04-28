/**
 * cntrList の内容をもとに、asset_priority_table を個別に更新します。
 * priority == "-" のときは 0 に更新、
 * priority == "" のときは更新しない（スキップ）します。
 */
public static void updateAssetPriorityTable(
        Connection connection,
        List<Map<String, String>> cntrList,
        List<Map<String, String>> useAssetDataList
) throws SQLException {
    String updateSql =
        "UPDATE asset_priority_table "
      + "SET asset_priority = ? "
      + "WHERE oo_id = ? AND to_id = ? AND tt_id = ? AND mission_type = ? AND asset_name = ?";

    try (PreparedStatement ps = connection.prepareStatement(updateSql)) {
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

                // 空文字ならスキップ
                if (priority == null || priority.isEmpty()) {
                    continue;
                }

                // priorityが "-" の場合は 0 に
                int priValue;
                if ("-".equals(priority)) {
                    priValue = 0;
                } else {
                    priValue = Integer.parseInt(priority);
                }

                // パラメータ設定
                ps.setInt(1, priValue);
                ps.setString(2, ooId);
                ps.setString(3, toId);
                ps.setString(4, ttId);
                ps.setString(5, missionType);
                ps.setString(6, assetName);

                // 個別に実行
                int updated = ps.executeUpdate();
                if (updated == 0) {
                    System.out.printf(
                        "Warning: no rows updated for %s, %s, %s, %s, %s%n",
                        ooId, toId, ttId, missionType, assetName
                    );
                }
            }
        }

        connection.commit();
        connection.setAutoCommit(true);
        System.out.println("asset_priority_table の更新が完了しました。");
    } catch (SQLException e) {
        connection.rollback();
        throw e;
    }
}



参考



/**
 * cntrList の内容をもとに、asset_priority_table を個別に更新します。
 */
public static void updateAssetPriorityTable(
        Connection connection,
        List<Map<String, String>> cntrList,
        List<Map<String, String>> useAssetDataList
) throws SQLException {
    String updateSql =
        "UPDATE asset_priority_table "
      + "SET asset_priority = ? "
      + "WHERE oo_id = ? AND to_id = ? AND tt_id = ? AND mission_type = ? AND asset_name = ?";

    try (PreparedStatement ps = connection.prepareStatement(updateSql)) {
        // トランザクション開始
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

                // パラメータ設定
                if (priority == null || "-".equals(priority) || priority.isEmpty()) {
                    ps.setNull(1, Types.INTEGER);
                } else {
                    ps.setInt(1, Integer.parseInt(priority));
                }
                ps.setString(2, ooId);
                ps.setString(3, toId);
                ps.setString(4, ttId);
                ps.setString(5, missionType);
                ps.setString(6, assetName);

                // 個別に実行
                int updated = ps.executeUpdate();
                if (updated == 0) {
                    // 必要なら、該当レコードがなかった場合の挙動をここで処理
                    System.out.printf(
                        "Warning: no rows updated for %s, %s, %s, %s, %s%n",
                        ooId, toId, ttId, missionType, assetName
                    );
                }
            }
        }

        connection.commit();
        connection.setAutoCommit(true);
        System.out.println("asset_priority_table の更新が完了しました。");
    } catch (SQLException e) {
        connection.rollback();
        throw e;
    }
}