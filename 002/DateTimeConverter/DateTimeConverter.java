import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeFormatterBuilder;
import java.time.format.DateTimeParseException;
import java.time.temporal.ChronoField;

public class DateTimeConverter {

    // 1) 入力用フォーマッタ："yyyy/MM/dd HH:mm" の後に ":ss" があればパースする
    private static final DateTimeFormatter INPUT_FORMATTER = new DateTimeFormatterBuilder()
            // まず "yyyy/MM/dd HH:mm" 部分を定義
            .appendPattern("yyyy/MM/dd HH:mm")
            // 以下をオプションとして括る（存在すれば読み取る）
            .optionalStart()
            .appendPattern(":ss")
            .optionalEnd()
            .parseDefaulting(ChronoField.SECOND_OF_MINUTE, 0) // 秒がなかった場合は 0 として扱う
            .toFormatter();

    // 2) 出力用フォーマッタ：常に "yyyy/MM/dd HH:mm" まで出力する
    private static final DateTimeFormatter OUTPUT_FORMATTER = DateTimeFormatter.ofPattern("yyyy/MM/dd HH:mm");

    /**
     * 文字列が "yyyy/MM/dd HH:mm:ss" なら秒以下を切り捨てて "yyyy/MM/dd HH:mm" にし、
     * もともと "yyyy/MM/dd HH:mm" ならそのまま返します。
     *
     * @param input 入力文字列（例："2025/06/02 22:15:47" または "2025/06/02 22:15"）
     * @return "yyyy/MM/dd HH:mm" 形式の文字列
     * @throws IllegalArgumentException 入力が上記のいずれの形式にも合致しない場合
     */
    public static String truncateSeconds(String input) {
        try {
            LocalDateTime dt = LocalDateTime.parse(input, INPUT_FORMATTER);
            return dt.format(OUTPUT_FORMATTER);
        } catch (DateTimeParseException e) {
            // 「秒なし」「秒あり」のどちらのパターンにもマッチしなかった場合は例外を投げる
            throw new IllegalArgumentException("日付文字列の形式が不正です。"
                    + "許容する形式は \"yyyy/MM/dd HH:mm\" または \"yyyy/MM/dd HH:mm:ss\" です。", e);
        }
    }

    // 動作確認用の main
    public static void main(String[] args) {
        String[] samples = {
                "2025/06/02 22:15:47",
                "2025/06/02 22:15"
        };

        for (String s : samples) {
            System.out.println(s + " → " + truncateSeconds(s));
        }
        // 期待出力:
        // 2025/06/02 22:15:47 → 2025/06/02 22:15
        // 2025/06/02 22:15     → 2025/06/02 22:15
    }
}

// ポイント解説
// INPUT_FORMATTER の中身

// java
// コピーする
// 編集する
// new DateTimeFormatterBuilder()
//     .appendPattern("yyyy/MM/dd HH:mm")
//     .optionalStart()
//     .appendPattern(":ss")
//     .optionalEnd()
//     .parseDefaulting(ChronoField.SECOND_OF_MINUTE, 0)
//     .toFormatter();
// まず "yyyy/MM/dd HH:mm" 部分を必須として定義。

// さらに optionalStart()~optionalEnd() で囲んだ ":ss" をオプション（あれば読み取るが、なくても OK）に設定。

// parseDefaulting(ChronoField.SECOND_OF_MINUTE, 0) は、「秒の情報がなかったときは内部的に 0 を埋めて扱う」という意味です。

// OUTPUT_FORMATTER

// java
// コピーする
// 編集する
// DateTimeFormatter.ofPattern("yyyy/MM/dd HH:mm");
// 常に "年/月/日 時:分" までだけを文字列化します。

// 例外処理
// LocalDateTime.parse(input, INPUT_FORMATTER) が失敗するときは、 "yyyy/MM/dd HH:mm" でも "yyyy/MM/dd HH:mm:ss" でもない文字列が来たということなので、IllegalArgumentException を投げるようにしています。