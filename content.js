// content.js
// このファイルはGeminiのページに注入され、DOMからチャット履歴を抽出します。
// popup.js からのメッセージを受け取り、処理を実行します。

console.log("content.js loaded.");

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "exportChat") {
        console.log("Export chat action received in content.js");

        let markdownContent = "";
        let chatTitle = "Gemini_Chat"; // デフォルトのファイル名（後で実際のタイトルを取得）

        try {
            // --- ここからDOMからの情報抽出ロジックを記述 ---

            // チャットタイトルを取得する（仮のセレクタ。要調査）
            // 例: const titleElement = document.querySelector('h2.chat-title');
            // if (titleElement) {
            //     chatTitle = titleElement.textContent.trim();
            // }

            // メッセージのコンテナ要素をすべて取得する（仮のセレクタ。要調査）
            // 例: const messageElements = document.querySelectorAll('.message-container');

            // if (messageElements.length === 0) {
            //     sendResponse({ error: "チャットメッセージが見つかりませんでした。" });
            //     return true;
            // }

            // messageElements.forEach((messageElement) => {
            //     // 各メッセージからユーザー/Geminiを判定し、内容を抽出する
            //     // 例: if (messageElement.classList.contains('user-message')) { ... }
            //     //     else if (messageElement.classList.contains('gemini-message')) { ... }

            //     // 日付の取得（要検討: UIに日付表示がない場合、取得は難しい）
            //     const currentDate = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
            //     markdownContent += `\n---\n\n`; // 区切り線

            //     // 仮のメッセージ追加
            //     // markdownContent += `## ユーザー (${currentDate})\n\n`;
            //     // markdownContent += `これはユーザーの仮のメッセージです。\n\n`;
            //     // markdownContent += `## Gemini (${currentDate})\n\n`;
            //     // markdownContent += `これはGeminiの仮の応答です。コードブロックやリストもここに含まれます。\n\n`;
            // });

            // --- ここまでDOMからの情報抽出ロジック ---

            // 要件定義で決めたファイル名を生成
            const date = new Date().toISOString().slice(0, 10).replace(/-/g, ''); // YYYYMMDD
            let fileName = `${date}_${chatTitle.replace(/[^a-zA-Z0-9_\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FFF\-]+/g, '_')}`; // ファイル名として不正な文字を置換
            fileName = fileName.substring(0, 80); // 長すぎる場合、80文字でカット（目安）
            fileName += '.md';

            // 現在はダミーデータとファイル名を返す
            sendResponse({
                markdownContent: "## Gemini Chat History\n\n### 確認用\n\nこのメッセージが見えている場合、content.jsからのダミーデータが渡されています。これまでの対話はまだ抽出されていません。\n\n---\n\n## ユーザー\nテストプロンプト\n\n## Gemini\nテスト応答。コードブロック```javascript\nconsole.log('Hello');\n```",
                fileName: fileName
            });

        } catch (error) {
            console.error("Error in content.js:", error);
            sendResponse({ error: `チャット履歴の抽出中にエラーが発生しました: ${error.message}` });
        }
        return true; // 非同期応答の場合に必要
    }
});