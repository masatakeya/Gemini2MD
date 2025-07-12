# Gemini2MD

Google Geminiのチャット履歴をMarkdown形式でエクスポートするChrome拡張機能です。

## 機能

- 🚀 **ワンクリックエクスポート**: 簡単にGeminiの対話履歴をダウンロード
- 📝 **Markdown形式**: 読みやすく、他のツールで再利用しやすい形式で保存
- 🎯 **正確なタイトル**: 現在開いているチャットのタイトルを自動取得
- 🛡️ **エラーハンドリング**: 安全で信頼性の高い動作
- 📅 **日付付きファイル名**: `YYYYMMDD_チャットタイトル.md` 形式で自動命名

## インストール方法

### 1. リポジトリをダウンロード
```bash
git clone https://github.com/masatakeya/Gemini2MD.git
```

または、ZIPファイルをダウンロードして解凍してください。

### 2. Chrome拡張機能として読み込み
1. Chromeブラウザで `chrome://extensions/` にアクセス
2. 右上の「デベロッパーモード」を有効にする
3. 「パッケージ化されていない拡張機能を読み込む」をクリック
4. ダウンロードした `Gemini2MD` フォルダを選択

## 使用方法

1. **Geminiにアクセス**: [gemini.google.com](https://gemini.google.com) でチャットを開く
2. **拡張機能を起動**: ブラウザのツールバーにあるGemini2MDアイコンをクリック
3. **エクスポート実行**: 「チャットをエクスポート」ボタンをクリック
4. **ダウンロード完了**: Markdownファイルが自動的にダウンロードされます

## 出力例

エクスポートされるMarkdownファイルの構造：

```markdown
# チャットタイトル

*エクスポート日: 2025-07-12*

---

## ユーザー

ここにユーザーの質問が入ります

## Gemini

ここにGeminiの回答が入ります。**太字**や*斜体*、`コード`、リストなども適切に変換されます。

---

## ユーザー

次の質問...
```

## 対応ブラウザ

- Google Chrome（Manifest V3対応）
- その他のChromium系ブラウザ

## 技術仕様

- **Manifest Version**: 3
- **権限**: `activeTab`, `scripting`
- **対象サイト**: `https://gemini.google.com/*`
- **言語**: JavaScript（Vanilla）

## 開発

### ファイル構成
```
Gemini2MD/
├── manifest.json      # 拡張機能の設定
├── popup.html         # ポップアップUI
├── popup.css          # UIスタイル
├── popup.js           # ポップアップロジック
├── content.js         # Geminiページでの処理
├── icons/             # アイコン画像
└── テストシナリオ.md   # テスト仕様
```

### 主要機能の実装
- **DOM解析**: GeminiページからチャットデータをCSSセレクタで抽出
- **HTML→Markdown変換**: カスタム変換関数でリッチテキストを処理
- **ファイルダウンロード**: Blob APIを使用した安全なファイル生成

## 貢献

バグ報告や機能要望は、[Issues](https://github.com/masatakeya/Gemini2MD/issues)でお知らせください。

## ライセンス

MIT License

## 注意事項

- この拡張機能はGoogle Geminiの公式ツールではありません
- GeminiのUI変更により動作しなくなる可能性があります
- 個人利用目的で開発されました

---

**開発者**: masatakeya  
**バージョン**: 1.0  
**最終更新**: 2025年7月