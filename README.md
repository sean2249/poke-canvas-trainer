# 🎨 30天寶可夢繪畫特訓營

新手從零開始的連續 30 天手繪陪跑網頁 App（PWA）。每天解鎖一隻寶可夢主題與訓練重點，用實體紙筆練習後拍照上傳，由 Claude 多模態模型扮演溫柔的繪畫導師，依「三步驟點評法」給出鼓勵又具體的中文回饋，並把畫作與評語收進你的「30天寶可夢圖鑑牆」。

## 技術架構

- **前端**：React + Vite + TypeScript + Tailwind CSS（行動優先、PWA 可安裝）
- **後端代理**：Cloudflare Pages Functions（`functions/api/critique.ts`）代轉 Anthropic API，金鑰只存伺服器、永不進瀏覽器
- **AI 導師**：Claude（多模態視覺），預設 `claude-sonnet-4-6`
- **儲存**：IndexedDB 本機（畫作 + 評語 + 進度），可匯出/匯入 JSON 備份
- **部署**：Cloudflare Pages，GitHub Actions 自動 CI/CD

```
瀏覽器 (React SPA)                Cloudflare Pages
  畫作壓縮 ≤1024px  ──POST /api/critique──▶  Function 組 prompt ──▶ Anthropic
  IndexedDB 存結果  ◀──── 中文三步驟回饋 ────  (金鑰=env secret)   ◀──
```

## 本機開發

一個指令就能完整運作（前端 + `/api`）：

```bash
npm install
npm run dev          # http://localhost:5173
```

開發時的 `/api/status`、`/api/critique` 由 Vite 內建的 dev-API 外掛（`vite-dev-api.ts`）
在同一個程序內提供，與正式環境的 Cloudflare Function 共用 `shared/critique.ts` 的點評邏輯。

**AI 金鑰是「非必須」**：

- 沒有金鑰 → App 照常運作，可記錄與存檔作品；UI 會顯示「AI 老師尚未設定」。
- 想要點評 → 建立 `.dev.vars` 填入金鑰，重啟 `npm run dev`：
  ```bash
  cp .dev.vars.example .dev.vars   # 填入 ANTHROPIC_API_KEY
  ```
  之後到任一天上傳作品即可獲得三步驟點評；先前「暫無點評」的作品也能按「請老師現在點評」補上。

> 選用：若想用真正的 Cloudflare workerd 執行期測試 Functions，可跑 `npm run build && npm run pages:dev`
> （需 wrangler；部分環境的本機 workerd 伺服器可能無法啟動，一般開發用上面的 `npm run dev` 即可）。

## 部署到 Cloudflare Pages（GitHub Actions）

1. 在 Cloudflare 建立一個 Pages 專案，名稱設為 `poke-canvas-trainer`（與 workflow 內 `--project-name` 一致）。
2. 在 **Cloudflare Pages 專案 → Settings → Environment variables** 設定執行期密鑰：
   - `ANTHROPIC_API_KEY`（必填）
   - `ANTHROPIC_MODEL`（可選）
3. 在 **GitHub repo → Settings → Secrets and variables → Actions** 設定部署用密鑰：
   - `CLOUDFLARE_API_TOKEN`（具 Pages 編輯權限的 API token）
   - `CLOUDFLARE_ACCOUNT_ID`
4. `git push` 到 `main` → GitHub Actions 會自動 typecheck、build、部署。PR 只跑檢查不部署。

> 注意：`ANTHROPIC_API_KEY` 設在 Cloudflare（執行期讀取），**不要**放進 GitHub Actions secrets。

## 資料持久性

畫作與評語存在「這個瀏覽器 × 這台裝置」的 IndexedDB，**不是雲端帳號**：

- ✅ 重整、關分頁、重開電腦：資料還在
- ❌ 換裝置 / 換瀏覽器 / 清除網站資料 / 無痕模式：看不到或會被清掉
- ⚠️ 瀏覽器空間不足時可能自動回收；Safari/iOS 長期未互動也可能被清

緩解：App 啟動會呼叫 `navigator.storage.persist()` 申請持久化；請定期到「設定」頁**匯出備份 JSON**。跨裝置同步為日後可加的延伸（例如接 Supabase）。

## 專案結構

```
shared/critique.ts          點評核心（prompt + Anthropic 呼叫），dev 與正式共用
functions/api/critique.ts   正式環境後端代理（Cloudflare Pages Function）
functions/api/status.ts     回報是否已設定金鑰（aiEnabled）
vite-dev-api.ts             本機開發的 /api 處理器（Vite plugin）
src/data/curriculum.ts      30 天課表 + 四階段資料
src/lib/                    db(IndexedDB) / image(壓縮) / api / feedback(解析) / useProgress
src/components/             共用 UI 元件
src/pages/                  Dashboard / DayView / Gallery / Settings
.github/workflows/deploy.yml  CI/CD
```
