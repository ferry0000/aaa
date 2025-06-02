public class SimpleDateTruncator {

    /**
     * 文字列長が 19（"yyyy/MM/dd HH:mm:ss"）なら先頭から16文字を返し、
     * それ以外（おそらく "yyyy/MM/dd HH:mm"）ならそのまま返します。
     *
     * ※前提として、入力は必ず正しい形式（"yyyy/MM/dd HH:mm" か "yyyy/MM/dd HH:mm:ss"）であるものとします。
     */
    public static String truncateSecondsSimple(String input) {
        // 例: "2025/06/02 22:15:47" は長さ 19 → 先頭から 16 文字を切り取って "2025/06/02 22:15" を返す
        if (input != null && input.length() == 19) {
            return input.substring(0, 16);
        }
        // それ以外は ("yyyy/MM/dd HH:mm" のはずなので) そのまま返却
        return input;
    }

    // 動作確認用の main
    public static void main(String[] args) {
        String[] samples = {
                "2025/06/02 22:15:47",
                "2025/06/02 22:15"
        };

        for (String s : samples) {
            System.out.println(s + " → " + truncateSecondsSimple(s));
        }
        // 期待出力:
        // 2025/06/02 22:15:47 → 2025/06/02 22:15
        // 2025/06/02 22:15     → 2025/06/02 22:15
    }
}

// ポイント解説
// String.length() == 19 というのは、"yyyy/MM/dd HH:mm:ss" のときちょうど 19 文字になるためです（スラッシュやコロンも含めて 19 文字）。

// substring(0, 16) を使うと "yyyy/MM/dd HH:mm" 部分だけを切り出せます。

// 前提として「入力文字列が必ず "yyyy/MM/dd HH:mm" か "yyyy/MM/dd HH:mm:ss" のどちらかである」という保証がある場合はこれで十分です。

// どちらを選ぶべきか？
// 「入力が想定外のフォーマットだったときにも例外を出したい」 → 1 の DateTimeFormatter を使った方法を推奨します。
// → バリデーションを兼ねて、安全に「秒が存在しようがしまいがパースしてからフォーマットし直す」実装になるので、汎用性が高いです。

// 「とにかく手軽に、かつ入力は必ず想定どおり（秒ありか秒なし）という前提で OK」 → 2 の文字列操作だけの方法で問題ありません。
// → ランタイムの依存が少なく、短いコードで実現できます。

