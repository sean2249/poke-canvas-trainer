# 🎨 30天寶可夢繪畫特訓營

新手從零開始的連續 30 天手繪陪跑網頁 App（PWA）。每天解鎖一隻寶可夢主題與訓練重點，用實體紙筆練習後拍照上傳，由 Claude 多模態模型扮演溫柔的繪畫導師，依「三步驟點評法」給出鼓勵又具體的中文回饋，並把畫作與評語收進你的「30天寶可夢圖鑑牆」。

## 技術架構（純前端 / 靜態）

- **前端**：React + Vite + TypeScript + Tailwind CSS（行動優先、PWA 可安裝、HashRouter）
- **AI 導師**：瀏覽器**直接呼叫** Anthropic API（多模態），預設 `claude-sonnet-4-6`
- **金鑰**：使用者在「設定」頁輸入自己的 Anthropic API 金鑰，存於瀏覽器 `localStorage`
- **儲存**：IndexedDB 本機（畫作 + 評語 + 進度），可匯出/匯入 JSON 備份
- **部署**：GitHub Pages（GitHub Actions 自動 build + deploy）

沒有任何後端伺服器：圖片壓縮、API 呼叫、資料儲存全部在瀏覽器完成。

```
瀏覽器 (React SPA, GitHub Pages)
  畫作壓縮 ≤1024px ──直接 fetch──▶ api.anthropic.com  (x-api-key = 使用者本機金鑰)
  IndexedDB 存結果 ◀──── 中文三步驟回饋 ────
```

> ⚠️ **金鑰安全**：純前端架構沒有後端可代為保管金鑰，金鑰存在你自己的瀏覽器、並由瀏覽器直接送往 Anthropic。
> 請只在個人裝置使用、勿在公用電腦輸入，建議使用額度受限的個人金鑰。呼叫時帶有
> `anthropic-dangerous-direct-browser-access` 標頭以允許瀏覽器直連。

## 本機開發

```bash
npm install
npm run dev          # http://localhost:5173/poke-canvas-trainer/
```

**AI 金鑰是「非必須」**：

- 沒有金鑰 → App 照常運作，可記錄與存檔作品；UI 顯示「AI 老師尚未設定」。
- 想要點評 → 進「設定」頁貼上你的 Anthropic API 金鑰（可選填模型），存檔後即可在各天上傳並取得三步驟點評；先前「暫無點評」的作品也能按「請老師現在點評」補上。

## 部署到 GitHub Pages

1. **設定 base path**：`vite.config.ts` 的 `base` 預設為 `/poke-canvas-trainer/`（= repo 名）。
   若改用自訂網域或 `<user>.github.io` 主 repo，改為 `'/'`。
2. 在 **GitHub repo → Settings → Pages → Build and deployment → Source** 選 **GitHub Actions**。
3. `git push` 到 `main` → `.github/workflows/deploy.yml` 會自動 typecheck、build、部署。
   PR 只跑 typecheck + build 不部署。
4. 完成後網址為 `https://<user>.github.io/poke-canvas-trainer/`。

不需要任何雲端密鑰或環境變數 —— AI 金鑰由每位使用者在自己的瀏覽器輸入。

## 資料持久性

畫作與評語存在「這個瀏覽器 × 這台裝置」的 IndexedDB，**不是雲端帳號**：

- ✅ 重整、關分頁、重開電腦：資料還在
- ❌ 換裝置 / 換瀏覽器 / 清除網站資料 / 無痕模式：看不到或會被清掉
- ⚠️ 瀏覽器空間不足時可能自動回收；Safari/iOS 長期未互動也可能被清

緩解：App 啟動會呼叫 `navigator.storage.persist()` 申請持久化；請定期到「設定」頁**匯出備份 JSON**。

## 專案結構

```
src/lib/critique.ts         三步驟 prompt + 直接呼叫 Anthropic
src/lib/apiKey.ts           localStorage 金鑰/模型管理
src/lib/api.ts              app 介面：getAiStatus()、requestCritique()
src/lib/db.ts               IndexedDB CRUD + 備份 + 持久化
src/lib/image.ts            上傳前壓縮 ≤1024px
src/lib/feedback.ts         把回覆拆成三張卡片
src/lib/useProgress.ts      由 entries 聚合各階段進度
src/data/curriculum.ts      30 天課表 + 四階段資料
src/pages/                  Dashboard / DayView / Gallery / Settings
.github/workflows/deploy.yml  CI/CD（GitHub Pages）
```
