import java.util.*;

public class MapUpdater {
    public static void main(String[] args) {
        // 1) サンプルの map を作成（key1～key100 を初期化）
        Map<String, String> map = new HashMap<>();
        for (int i = 1; i <= 100; i++) {
            map.put("key" + i, "oldValue" + i);
        }

        // 2) サンプルの values リストを用意（size >= 100）
        List<String> values = new ArrayList<>();
        for (int i = 1; i <= 100; i++) {
            values.add("newValue" + i);
        }

        // 3) map を values で更新
        for (int i = 1; i <= 100 && i <= values.size(); i++) {
            String key = "key" + i;
            String newValue = values.get(i - 1);
            // キーが存在する場合のみ更新したいなら if を付ける
            if (map.containsKey(key)) {
                map.put(key, newValue);
            }
            // 存在を問わず追加・上書きするなら、上記 if は不要
        }

        // 4) 結果確認
        map.entrySet()
           .stream()
           .sorted(Comparator.comparing(e -> {
               // "key12" の末尾数字でソートする
               return Integer.parseInt(e.getKey().replace("key", ""));
           }))
           .forEach(e -> System.out.println(e.getKey() + " = " + e.getValue()));
    }
}