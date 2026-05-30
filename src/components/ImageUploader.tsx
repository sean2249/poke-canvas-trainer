import { useRef, useState } from 'react'
import { compressImage } from '../lib/image'

export default function ImageUploader({
  onPicked,
  disabled,
}: {
  onPicked: (dataUrl: string) => void
  disabled?: boolean
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleFile(file: File | undefined) {
    if (!file) return
    setError(null)
    setBusy(true)
    try {
      const dataUrl = await compressImage(file)
      setPreview(dataUrl)
      onPicked(dataUrl)
    } catch (e) {
      setError(e instanceof Error ? e.message : '圖片處理失敗')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="space-y-3">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(e) => void handleFile(e.target.files?.[0])}
      />

      <button
        type="button"
        disabled={disabled || busy}
        onClick={() => inputRef.current?.click()}
        className="card flex w-full flex-col items-center justify-center gap-2 px-6 py-10 text-center transition hover:bg-sand/50 disabled:opacity-60"
      >
        {preview ? (
          <img src={preview} alt="作品預覽" className="max-h-72 w-auto rounded-xl2 shadow-soft" />
        ) : (
          <>
            <span className="text-4xl">📷</span>
            <span className="font-semibold">拍照或選擇你的畫作</span>
            <span className="text-sm text-ink/60">會自動壓縮到 1024px，保護你的流量與隱私</span>
          </>
        )}
      </button>

      {preview && !disabled && (
        <button type="button" className="btn-ghost w-full" onClick={() => inputRef.current?.click()}>
          重新選擇照片
        </button>
      )}

      {busy && <p className="text-center text-sm text-ink/60">壓縮圖片中…</p>}
      {error && <p className="text-center text-sm text-coral">{error}</p>}
    </div>
  )
}
