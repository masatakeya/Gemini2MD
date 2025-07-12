document.addEventListener('DOMContentLoaded', () => {
    const exportButton = document.getElementById('exportButton');
    const statusMessage = document.getElementById('statusMessage');

    exportButton.addEventListener('click', () => {
        statusMessage.textContent = 'エクスポート中...';
        
        // アクティブなタブに対してcontent.jsを実行し、チャットデータを取得する
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs[0]) {
                const currentTabId = tabs[0].id;
                
                // ホスト権限が gemini.google.com に限定されているので、それ以外のページでは実行しない
                if (!tabs[0].url.startsWith('https://gemini.google.com/')) {
                    statusMessage.textContent = 'エラー: Geminiのチャットページで実行してください。';
                    statusMessage.style.color = 'red';
                    return;
                }

                // content.js を現在のタブに注入し、結果を受け取る
                chrome.scripting.executeScript(
                    {
                        target: { tabId: currentTabId },
                        files: ['content.js'] // 注入するスクリプトファイル
                    },
                    () => {
                        // content.js が注入された後、メッセージを content.js に送信
                        chrome.tabs.sendMessage(currentTabId, { action: "exportChat" }, (response) => {
                            if (chrome.runtime.lastError) {
                                // エラーハンドリング (例: content.jsが応答しない場合など)
                                statusMessage.textContent = 'エラー: エクスポートに失敗しました。ページをリロードしてみてください。';
                                statusMessage.style.color = 'red';
                                console.error(chrome.runtime.lastError);
                                return;
                            }

                            if (response && response.markdownContent && response.fileName) {
                                // Markdownコンテンツとファイル名を受け取ったら、ダウンロード処理を実行
                                downloadMarkdownFile(response.markdownContent, response.fileName);
                                statusMessage.textContent = 'エクスポートが完了しました！';
                                statusMessage.style.color = 'green';
                            } else if (response && response.error) {
                                statusMessage.textContent = `エラー: ${response.error}`;
                                statusMessage.style.color = 'red';
                            } else {
                                statusMessage.textContent = 'エラー: 想定外の応答を受信しました。';
                                statusMessage.style.color = 'red';
                            }
                        });
                    }
                );
            }
        });
    });

    // Markdownファイルをダウンロードする関数
    function downloadMarkdownFile(markdownContent, fileName) {
        const blob = new Blob([markdownContent], { type: 'text/markdown;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName; // ファイル名を設定
        document.body.appendChild(a); // DOMに追加しないとFirefoxで動作しない場合がある
        a.click();
        document.body.removeChild(a); // 要素を削除
        URL.revokeObjectURL(url); // URLを解放
    }
});