// content.js
// このファイルはGeminiのページに注入され、DOMからチャット履歴を抽出します。
// popup.js からのメッセージを受け取り、処理を実行します。

console.log("content.js loaded.");

// HTMLをMarkdownに変換する関数
function convertHtmlToMarkdown(element) {
    let markdown = '';
    
    const traverse = (node) => {
        if (node.nodeType === Node.TEXT_NODE) {
            return node.textContent;
        }
        
        if (node.nodeType !== Node.ELEMENT_NODE) {
            return '';
        }
        
        const tagName = node.tagName.toLowerCase();
        let content = '';
        
        // 子要素を再帰的に処理
        for (const child of node.childNodes) {
            content += traverse(child);
        }
        
        switch (tagName) {
            case 'p':
                return content + '\n\n';
            case 'h1':
                return `# ${content}\n\n`;
            case 'h2':
                return `## ${content}\n\n`;
            case 'h3':
                return `### ${content}\n\n`;
            case 'h4':
                return `#### ${content}\n\n`;
            case 'h5':
                return `##### ${content}\n\n`;
            case 'h6':
                return `###### ${content}\n\n`;
            case 'strong':
            case 'b':
                return `**${content}**`;
            case 'em':
            case 'i':
                return `*${content}*`;
            case 'code':
                return `\`${content}\``;
            case 'pre':
                return `\`\`\`\n${content}\n\`\`\`\n\n`;
            case 'ul':
                return content + '\n';
            case 'ol':
                return content + '\n';
            case 'li':
                const parent = node.parentNode;
                const isOrdered = parent && parent.tagName.toLowerCase() === 'ol';
                const prefix = isOrdered ? '1. ' : '- ';
                return `${prefix}${content}\n`;
            case 'a':
                const href = node.getAttribute('href');
                return href ? `[${content}](${href})` : content;
            case 'br':
                return '\n';
            case 'blockquote':
                return `> ${content}\n\n`;
            default:
                return content;
        }
    };
    
    return traverse(element);
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "exportChat") {
        console.log("Export chat action received in content.js");

        let markdownContent = "";
        let chatTitle = "Gemini_Chat"; // デフォルトのファイル名（後で実際のタイトルを取得）

        try {
            // チャットタイトルを取得（複数のセレクタを試す）
            const possibleTitleSelectors = [
                'h1', 'h2', 'h3', 
                '[data-testid*="title"]',
                '.chat-title',
                '.conversation-title'
            ];
            
            for (const selector of possibleTitleSelectors) {
                const titleElement = document.querySelector(selector);
                if (titleElement && titleElement.textContent.trim()) {
                    chatTitle = titleElement.textContent.trim();
                    break;
                }
            }

            // 会話コンテナをすべて取得
            const conversationElements = document.querySelectorAll('.conversation-container');
            
            if (conversationElements.length === 0) {
                sendResponse({ error: "チャットメッセージが見つかりませんでした。" });
                return true;
            }

            const currentDate = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
            markdownContent = `# ${chatTitle}\n\n*エクスポート日: ${currentDate}*\n\n---\n\n`;

            conversationElements.forEach((conversationElement, index) => {
                // ユーザーメッセージを抽出
                const userQuery = conversationElement.querySelector('user-query .query-text-line');
                if (userQuery) {
                    const userText = userQuery.textContent.trim();
                    if (userText) {
                        markdownContent += `## ユーザー\n\n${userText}\n\n`;
                    }
                }

                // Geminiの応答を抽出
                const modelResponse = conversationElement.querySelector('model-response .markdown');
                if (modelResponse) {
                    // HTMLをMarkdownに変換
                    let geminiText = convertHtmlToMarkdown(modelResponse);
                    if (geminiText.trim()) {
                        markdownContent += `## Gemini\n\n${geminiText}\n\n`;
                    }
                }

                // 区切り線（最後の会話以外）
                if (index < conversationElements.length - 1) {
                    markdownContent += `---\n\n`;
                }
            });

            // 要件定義で決めたファイル名を生成
            const date = new Date().toISOString().slice(0, 10).replace(/-/g, ''); // YYYYMMDD
            let fileName = `${date}_${chatTitle.replace(/[^a-zA-Z0-9_\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FFF\-]+/g, '_')}`; // ファイル名として不正な文字を置換
            fileName = fileName.substring(0, 80); // 長すぎる場合、80文字でカット（目安）
            fileName += '.md';

            sendResponse({
                markdownContent: markdownContent,
                fileName: fileName
            });

        } catch (error) {
            console.error("Error in content.js:", error);
            sendResponse({ error: `チャット履歴の抽出中にエラーが発生しました: ${error.message}` });
        }
        return true; // 非同期応答の場合に必要
    }
});