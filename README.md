# CardScanner Pro

CardScanner Pro 是一款基於 AI 的智慧名片掃描應用程式，利用 Google Gemini 強大的多模態模型（Gemini 1.5/2.0 Flash）來精準辨識並提取名片中的聯絡人資訊。

## ✨ 特色功能

*   **AI 智慧辨識**：利用 Google Gemini Vision 模型，精準提取姓名、職稱、公司、電話、Email、地址等資訊。
*   **多語言支援**：針對繁體中文、簡體中文、英文及日文進行優化，特別擅長處理亞洲姓名格式。
*   **一鍵存檔**：自動生成 vCard (.vcf) 檔案，可直接匯入 iPhone 或 Android 通訊錄。
*   **歷史紀錄**：自動儲存掃描紀錄，隨時查閱過往名片。
*   **即時編輯**：掃描後可手動校對與修改資料，確保資訊 100% 正確。
*   **隱私優先**：所有圖片與數據處理皆在用戶端與安全的 API 傳輸中進行。

## 🛠️ 技術棧

*   **前端框架**: React 19 + TypeScript
*   **建置工具**: Vite
*   **樣式庫**: Tailwind CSS (CDN/Utility-first)
*   **AI 模型**: Google Gemini API (@google/genai SDK)
*   **圖標庫**: Lucide React

## 🚀 快速開始

### 先決條件

*   請確保您的電腦已安裝 [Node.js](https://nodejs.org/) (建議 v18 以上版本)。
*   您需要一組 Google Gemini API Key。您可以前往 [Google AI Studio](https://aistudio.google.com/) 免費獲取。

### 安裝步驟

1.  **複製專案**
    ```bash
    git clone <your-repo-url>
    cd cardscan
    ```

2.  **安裝依賴套件**
    ```bash
    npm install
    ```

3.  **設定環境變數**
    在專案根目錄建立一個 `.env` 檔案（或 `.env.local`），並填入您的 API Key：
    ```env
    GEMINI_API_KEY=您的_API_KEY_這裡
    ```

4.  **啟動開發伺服器**
    ```bash
    npm run dev
    ```

5.  **開啟應用程式**
    打開瀏覽器並訪問終端機顯示的網址（通常是 `http://localhost:3000` 或 `http://localhost:3001`）。

    ## ☁️ 自動部署 (GitHub Pages)

    本專案已設定 GitHub Actions，只要您將程式碼推送到 GitHub，即可自動部署。

    **設定步驟：**

    1.  **上傳程式碼**：將本專案推送到您的 GitHub Repository。
    2.  **設定 API Key**：
        *   進入 GitHub Repo 的 **Settings** > **Secrets and variables** > **Actions**。
        *   點擊 **New repository secret**。
        *   Name: `GEMINI_API_KEY`
        *   Value: (貼上您的 Gemini API Key)
    3.  **觸發部署**：
        *   當您推送程式碼到 `main` 或 `master` 分支時，Action 會自動開始建置。
    4.  **啟用 Pages**：
        *   部署完成後，分支 `gh-pages` 會被建立。
        *   進入 **Settings** > **Pages**，將 Build and deployment source 設為 `Deploy from a branch`。
        *   Branch 選擇 `gh-pages`，資料夾選擇 `/ (root)`。
    5.  **完成**：您的 App 現在可以透過 `https://<您的帳號>.github.io/<專案名稱>/` 訪問了！

## 📱 操作指南

1.  **掃描名片**：點擊首頁下方的相機按鈕 📷 拍攝名片，或點擊圖片按鈕 🖼️ 從相簿上傳。
2.  **選擇語言**：在首頁右上角選擇名片的主要語言（繁中/簡中/英/日），這有助於 AI 更精確地辨識姓名格式。
3.  **校對資訊**：AI 辨識完成後會進入編輯頁面，請檢查姓名、電話等欄位是否正確。
4.  **儲存聯絡人**：確認無誤後點擊右上角的 "Save"，系統將下載 .vcf 檔案，您可以在手機上直接打開並儲存到通訊錄。

## ⚠️ 常見問題

*   **畫面一片空白？**
    *   請確認您是否已正確設定 API Key。
    *   檢查瀏覽器 Console 是否有錯誤訊息。
*   **相機無法開啟？**
    *   請確保瀏覽器已取得相機使用權限。
    *   在桌機版瀏覽器上測試時，建議使用「上傳圖片」功能。

## 🤝 貢獻

歡迎提交 Pull Request 或 Issue 來協助改進這個專案！
