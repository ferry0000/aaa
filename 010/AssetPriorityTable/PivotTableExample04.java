package renshu04;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

public class PivotTableExample04 {

	public static void main(String[] args) {

		List<Map<String, String>> cntrList = new ArrayList<>();



		try (Connection connection = DriverManager.getConnection(url, user, password)) {
			// 処理を記述



			try (Statement statement = connection.createStatement();
					ResultSet resultSet = statement.executeQuery(sql)) {

				// データのリストを取得
				List<Map<String, String>> dataList = getDataList(connection);

				// ピボットマップ
				Map<String, Map<String, String>> pivotTable = new LinkedHashMap<>();

				while (resultSet.next()) {
					String id01 = String.format("OP%02d", resultSet.getInt("1_id"));
					String id02 = String.format("%02d", resultSet.getInt("2_id"));
					String id03 = String.format("%02d", resultSet.getInt("3_id"));
					String type = resultSet.getString("type"); // type を取得
					String name = resultSet.getString("name");

					// 複合キーを作成
					String key = id01 + "-" + id02 + "-" + id03 + "-" + type;
					System.out.println(key);

					Integer priority = resultSet.getObject("priority", Integer.class);

					if (priority == null) {

						pivotTable.put(key, new HashMap<>());

						for (Map<String, String> data : dataList) {
							if (type.equals(data.get("type"))) {

								pivotTable.get(key).put(data.get("name"), "-");
							}
						}

					} else {

						if (!pivotTable.containsKey(key)) {
							pivotTable.put(key, new HashMap<>());
						}
						pivotTable.get(key).put(name, String.valueOf(priority));
						System.out.println(pivotTable);
					}

				}

				// ピボット処理
				System.out.println(pivotTable);

				// 結果の表示
				printPivotTable(cntrList, pivotTable, dataList); // dataListを渡す

			} catch (SQLException e) {
				e.printStackTrace();
			}

		} catch (SQLException e) {
			e.printStackTrace();
		}
	}

	public static void printPivotTable(List<Map<String, String>> cntrList, Map<String, Map<String, String>> pivotTable,
			List<Map<String, String>> dataList) {
		// ヘッダーの表示
		System.out.print("id01\tid02\tid03\ttype\t"); // ヘッダー
		for (Map<String, String> data : dataList) {
			System.out.print(data.get("name") + "\t");
			Map<String, String> record = new HashMap<>();
			record.put("name", data.get("name"));
			record.put("type", data.get("type"));
//			cntrList.add(record);
		}
		System.out.println();

		// データの表示
		for (String key : pivotTable.keySet()) {
			String[] parts = key.split("-"); // 複合キーを分解
			String id01 = parts[0];
			String id02 = parts[1];
			String id03 = parts[2];
			String type = parts[3];

			System.out.print(id01 + "\t\t" + id02 + "\t\t" + id03 + "\t\t" + type + "\t\t");

			Map<String, String> record = new HashMap<>();
			record.put("id01", id01);
			record.put("id02", id02);
			record.put("id03", id03);
			record.put("type", type);

			for (int i = 0; i < dataList.size(); i++) {
				Map<String, String> data = dataList.get(i);
				String priority = pivotTable.get(key).getOrDefault(data.get("name"), "");

				if (priority.equals("0") || priority.equals("-1")) {
					System.out.print("-" + "\t\t");
					record.put("priority" + (i + 1), "-");

				} else {
					System.out.print(priority + "\t\t");
					record.put("priority" + (i + 1), priority);
				}
			}
			cntrList.add(record);
			System.out.println();
		}
		System.out.println(cntrList);
	}

	// テーブルから名、種別を取得する関数
	public static List<Map<String, String>> getDataList(Connection connection) throws SQLException {
		List<Map<String, String>> dataList = new ArrayList<>();

		try (Statement statement = connection.createStatement();
				ResultSet resultSet = statement.executeQuery(sql)) {
			while (resultSet.next()) {
				Map<String, String> row = new HashMap<>();
				row.put("name", resultSet.getString("name"));
				row.put("type", resultSet.getString("type"));
				dataList.add(row);

			}
		}
		return dataList;
	}
}