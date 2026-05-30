import { useEffect, useRef, useState } from 'react'
import { clearAll, exportAll, importAll, isStoragePersisted, requestPersistentStorage } from '../lib/db'
import { clearApiKey, getApiKey, getModel, maskKey, setApiKey, setModel } from '../lib/apiKey'

export default function Settings() {
  const fileRef = useRef<HTMLInputElement>(null)
  const [persisted, setPersisted] = useState<boolean | null>(null)
  const [msg, setMsg] = useState<string | null>(null)
  const [confirmClear, setConfirmClear] = useState(false)

  // API 金鑰管理
  const [keyInput, setKeyInput] = useState('')
  const [modelInput, setModelInput] = useState(() => getModel())
  const [savedKey, setSavedKey] = useState(() => getApiKey())

  useEffect(() => {
    void isStoragePersisted().then(setPersisted)
  }, [])

  function handleSaveKey() {
    // 只有輸入了新金鑰才覆寫，避免「只想改模型」時把既有金鑰清掉（移除請用「移除金鑰」）
    if (keyInput.trim()) setApiKey(keyInput)
    setModel(modelInput)
    setSavedKey(getApiKey())
    setKeyInput('')
    setMsg('已儲存設定 ✨')
  }

  function handleClearKey() {
    clearApiKey()
    setSavedKey('')
    setKeyInput('')
    setMsg('已移除 API 金鑰')
  }

  async function handleExport() {
    const json = await exportAll()
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `poke-trainer-backup-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
    setMsg('已匯出備份檔 ✅')
  }

  async function handleImport(file: File | undefined) {
    if (!file) return
    try {
      const text = await file.text()
      const n = await importAll(text)
      setMsg(`已從備份還原 ${n} 筆紀錄 ✅（重新整理後生效）`)
    } catch (e) {
      setMsg(e instanceof Error ? `匯入失敗：${e.message}` : '匯入失敗')
    }
  }

  async function handleClear() {
    await clearAll()
    setConfirmClear(false)
    setMsg('已清除所有資料，重新整理中…')
    // 重新整理讓 Dashboard/Gallery 等獨立的 useProgress 重新讀取（避免顯示已清除的舊資料）
    window.setTimeout(() => window.location.reload(), 700)
  }

  async function handlePersist() {
    const ok = await requestPersistentStorage()
    setPersisted(ok)
    setMsg(ok ? '已啟用持久化儲存 🛡️' : '瀏覽器未授予持久化（資料仍會盡量保留）')
  }

  return (
    <div className="space-y-5">
      <h2 className="text-lg font-bold">⚙️ 設定</h2>

      {msg && (
        <p className="rounded-xl2 bg-mint/15 px-4 py-3 text-center text-sm text-ink/80">{msg}</p>
      )}

      {/* 儲存狀態 */}
      <section className="card space-y-3 p-4">
        <h3 className="font-semibold">資料儲存</h3>
        <p className="text-sm text-ink/60">
          你的畫作與老師評語都存在這台裝置的瀏覽器裡（IndexedDB），不會上傳雲端。
          換裝置、換瀏覽器或清除瀏覽資料都會看不到，請定期匯出備份。
        </p>
        <div className="flex items-center justify-between rounded-xl2 bg-sand/40 px-3 py-2 text-sm">
          <span>持久化儲存</span>
          <span className={persisted ? 'text-mint' : 'text-coral'}>
            {persisted === null ? '檢查中…' : persisted ? '已啟用 🛡️' : '未啟用'}
          </span>
        </div>
        {!persisted && (
          <button type="button" className="btn-ghost w-full" onClick={() => void handlePersist()}>
            嘗試啟用持久化儲存
          </button>
        )}
      </section>

      {/* AI 老師 — API 金鑰 */}
      <section className="card space-y-3 p-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">AI 老師（Anthropic 金鑰）</h3>
          <span className={savedKey ? 'text-mint text-sm' : 'text-coral text-sm'}>
            {savedKey ? '已就緒 ✨' : '尚未設定'}
          </span>
        </div>

        <p className="rounded-xl2 bg-coral/10 px-3 py-2 text-xs text-coral">
          ⚠️ 這是純前端 App（GitHub Pages），金鑰會存在<strong>你自己的瀏覽器</strong>並由瀏覽器
          直接呼叫 Anthropic。請只在自己的裝置使用、勿在公用電腦輸入；建議用額度受限的個人金鑰。
        </p>

        {savedKey && (
          <div className="flex items-center justify-between rounded-xl2 bg-sand/40 px-3 py-2 text-sm">
            <span>目前金鑰</span>
            <code className="text-ink/70">{maskKey(savedKey)}</code>
          </div>
        )}

        <label className="block text-sm font-semibold">
          API 金鑰
          <input
            type="password"
            autoComplete="off"
            placeholder="sk-ant-..."
            value={keyInput}
            onChange={(e) => setKeyInput(e.target.value)}
            className="mt-1 w-full rounded-xl2 border border-sand px-3 py-2 font-mono text-sm outline-none focus:border-sunny"
          />
        </label>

        <label className="block text-sm font-semibold">
          模型（可留空用預設 claude-sonnet-4-6）
          <input
            type="text"
            autoComplete="off"
            placeholder="claude-sonnet-4-6"
            value={modelInput}
            onChange={(e) => setModelInput(e.target.value)}
            className="mt-1 w-full rounded-xl2 border border-sand px-3 py-2 font-mono text-sm outline-none focus:border-sunny"
          />
        </label>

        <div className="flex gap-2">
          <button
            type="button"
            className="btn-primary flex-1"
            disabled={!keyInput.trim() && !savedKey}
            onClick={handleSaveKey}
          >
            儲存
          </button>
          {savedKey && (
            <button type="button" className="btn-ghost flex-1" onClick={handleClearKey}>
              移除金鑰
            </button>
          )}
        </div>
        <p className="text-xs text-ink/40">
          金鑰申請：console.anthropic.com → API Keys。金鑰只存在本機，不會上傳任何伺服器。
        </p>
      </section>

      {/* 備份 / 還原 */}
      <section className="card space-y-3 p-4">
        <h3 className="font-semibold">備份與還原</h3>
        <button type="button" className="btn-primary w-full" onClick={() => void handleExport()}>
          匯出備份（下載 JSON）⬇️
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="application/json"
          className="hidden"
          onChange={(e) => void handleImport(e.target.files?.[0])}
        />
        <button type="button" className="btn-ghost w-full" onClick={() => fileRef.current?.click()}>
          從備份還原 ⬆️
        </button>
      </section>

      {/* 危險區 */}
      <section className="card space-y-3 border-coral/40 p-4">
        <h3 className="font-semibold text-coral">清除資料</h3>
        {!confirmClear ? (
          <button
            type="button"
            className="btn-ghost w-full border-coral/40 text-coral"
            onClick={() => setConfirmClear(true)}
          >
            清除所有畫作與紀錄
          </button>
        ) : (
          <div className="space-y-2 text-sm">
            <p className="text-coral">此動作無法復原，建議先匯出備份。確定要清除嗎？</p>
            <div className="flex gap-2">
              <button type="button" className="btn-ghost flex-1" onClick={() => setConfirmClear(false)}>
                取消
              </button>
              <button
                type="button"
                className="btn flex-1 bg-coral text-white"
                onClick={() => void handleClear()}
              >
                確定清除
              </button>
            </div>
          </div>
        )}
      </section>

      <p className="text-center text-xs text-ink/40">30天寶可夢繪畫特訓營 · 個人練習用</p>
    </div>
  )
}
