import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getDay, getPhase } from '../data/curriculum'
import { getEntry, saveEntry } from '../lib/db'
import { getAiStatus, requestCritique } from '../lib/api'
import { parseFeedback } from '../lib/feedback'
import type { Entry } from '../types'
import PhaseBadge from '../components/PhaseBadge'
import ImageUploader from '../components/ImageUploader'
import StepCard from '../components/StepCard'

export default function DayView() {
  const { day: dayParam } = useParams()
  const day = Number(dayParam)
  const plan = getDay(day)

  const [entry, setEntry] = useState<Entry | null>(null)
  const [pickedImage, setPickedImage] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loaded, setLoaded] = useState(false)
  // null = 檢查中，true/false = AI 老師是否已設定
  const [aiEnabled, setAiEnabled] = useState<boolean | null>(null)

  useEffect(() => {
    void getAiStatus().then(setAiEnabled)
  }, [])

  useEffect(() => {
    setEntry(null)
    setPickedImage(null)
    setError(null)
    setLoaded(false)
    if (!plan) return
    void getEntry(day).then((e) => {
      setEntry(e ?? null)
      setLoaded(true)
    })
  }, [day, plan])

  if (!plan) {
    return (
      <div className="py-12 text-center">
        <p className="text-ink/60">找不到這一天 🥲</p>
        <Link to="/" className="btn-ghost mt-4">
          回首頁
        </Link>
      </div>
    )
  }

  const phase = getPhase(day)

  async function persist(image: string, feedback: string) {
    if (!plan) return
    const newEntry: Entry = {
      day: plan.day,
      imageDataUrl: image,
      feedback,
      status: 'done',
      completedAt: Date.now(),
    }
    await saveEntry(newEntry)
    setEntry(newEntry)
    setPickedImage(null)
  }

  // 送出給 AI 老師點評（金鑰存在時）
  async function handleSubmitWithAI() {
    if (!plan || !pickedImage) return
    setSubmitting(true)
    setError(null)
    try {
      const feedback = await requestCritique(plan, pickedImage)
      await persist(pickedImage, feedback)
    } catch (e) {
      setError(e instanceof Error ? e.message : '送出失敗，請再試一次。')
    } finally {
      setSubmitting(false)
    }
  }

  // 無金鑰時：只記錄作品，暫不點評
  async function handleSaveNoFeedback() {
    if (!pickedImage) return
    setSubmitting(true)
    setError(null)
    try {
      await persist(pickedImage, '')
    } finally {
      setSubmitting(false)
    }
  }

  // 已存檔但尚無點評，且 AI 已就緒：補一次點評
  async function handleCritiqueExisting() {
    if (!plan || !entry) return
    setSubmitting(true)
    setError(null)
    try {
      const feedback = await requestCritique(plan, entry.imageDataUrl)
      await persist(entry.imageDataUrl, feedback)
    } catch (e) {
      setError(e instanceof Error ? e.message : '點評失敗，請再試一次。')
    } finally {
      setSubmitting(false)
    }
  }

  const hasFeedback = !!entry?.feedback
  const steps = hasFeedback ? parseFeedback(entry!.feedback) : []

  return (
    <div className="space-y-5">
      <Link to="/" className="text-sm text-ink/50 hover:text-ink">
        ← 回今日
      </Link>

      {/* 主題卡 */}
      <section className="card overflow-hidden">
        <div className="flex items-center justify-between bg-sand/60 px-4 py-2">
          <PhaseBadge phase={phase} />
          <span className="text-sm font-bold text-sunny">Day {plan.day}</span>
        </div>
        <div className="p-5">
          <h2 className="text-2xl font-bold">
            {plan.subject}
            <span className="ml-2 text-sm font-normal text-ink/40">{plan.subjectEn}</span>
          </h2>
          <div className="mt-3 rounded-xl2 bg-sand/40 p-3 text-sm">
            <p className="font-semibold">🎯 {plan.focus}</p>
            <p className="mt-1 text-ink/70">{plan.focusHint}</p>
          </div>
          <div className="mt-2 rounded-xl2 border border-sand p-3 text-sm">
            <p className="font-semibold">🧰 工具準備</p>
            <p className="mt-1 text-ink/70">{plan.tools}</p>
          </div>
          <p className="mt-2 text-xs text-ink/40">媒材：{plan.media}</p>
        </div>
      </section>

      {/* AI 老師尚未設定的提示 */}
      {aiEnabled === false && (
        <div className="rounded-xl2 border border-sunny/40 bg-sand/50 px-4 py-3 text-sm">
          <p className="font-semibold">🔔 AI 老師尚未設定</p>
          <p className="mt-1 text-ink/70">
            後端還沒有 <code>ANTHROPIC_API_KEY</code>，目前無法取得點評。
            你仍然可以記錄並存檔作品到圖鑑牆；設定金鑰後，回到這一天就能請老師補點評。
          </p>
        </div>
      )}

      {!loaded ? (
        <p className="py-6 text-center text-ink/50">載入中…</p>
      ) : entry ? (
        /* 已完成：顯示作品 + 點評（或補點評） */
        <section className="space-y-4">
          <div className="card overflow-hidden">
            <img src={entry.imageDataUrl} alt={plan.subject} className="w-full" />
            <p className="px-4 py-2 text-xs text-ink/40">
              完成於 {new Date(entry.completedAt).toLocaleDateString('zh-TW')}
            </p>
          </div>

          {hasFeedback ? (
            <div>
              <h3 className="mb-2 flex items-center gap-2 font-bold">
                <span>👩‍🏫</span> 老師的點評
              </h3>
              <div className="space-y-3">
                {steps.map((s) => (
                  <StepCard key={s.key} step={s} />
                ))}
              </div>
            </div>
          ) : (
            <div className="rounded-xl2 border border-sand bg-white p-4 text-sm">
              <p className="text-ink/70">這張作品存檔時還沒有 AI 老師，目前尚無點評。</p>
              {aiEnabled && (
                <button
                  type="button"
                  className="btn-primary mt-3 w-full"
                  disabled={submitting}
                  onClick={() => void handleCritiqueExisting()}
                >
                  {submitting ? '老師正在看你的畫… 🖌️' : '請老師現在點評 ✨'}
                </button>
              )}
            </div>
          )}

          {error && (
            <p className="rounded-xl2 bg-coral/10 px-4 py-3 text-center text-sm text-coral">{error}</p>
          )}

          <RedoButton onRedo={() => setEntry(null)} />
        </section>
      ) : (
        /* 未完成：上傳 → 送出 / 存檔 */
        <section className="space-y-4">
          <ImageUploader onPicked={setPickedImage} disabled={submitting} />

          {aiEnabled === false ? (
            <button
              type="button"
              className="btn-primary w-full"
              disabled={!pickedImage || submitting}
              onClick={() => void handleSaveNoFeedback()}
            >
              {submitting ? '存檔中…' : '存入圖鑑（暫無老師點評）📥'}
            </button>
          ) : (
            <button
              type="button"
              className="btn-primary w-full"
              disabled={!pickedImage || submitting}
              onClick={() => void handleSubmitWithAI()}
            >
              {submitting ? '老師正在看你的畫… 🖌️' : '送出給老師點評 ✨'}
            </button>
          )}

          {/* AI 已就緒時，仍可選擇先存檔不點評 */}
          {aiEnabled && pickedImage && !submitting && (
            <button type="button" className="btn-ghost w-full" onClick={() => void handleSaveNoFeedback()}>
              先存檔，稍後再點評
            </button>
          )}

          {submitting && aiEnabled !== false && (
            <p className="text-center text-sm text-ink/50">
              多模態分析需要幾秒鐘，請稍候，別離開頁面喔～
            </p>
          )}
          {error && (
            <p className="rounded-xl2 bg-coral/10 px-4 py-3 text-center text-sm text-coral">{error}</p>
          )}
        </section>
      )}
    </div>
  )
}

function RedoButton({ onRedo }: { onRedo: () => void }) {
  const [confirm, setConfirm] = useState(false)
  if (!confirm) {
    return (
      <button type="button" className="btn-ghost w-full" onClick={() => setConfirm(true)}>
        重新挑戰這一天 🔁
      </button>
    )
  }
  return (
    <div className="rounded-xl2 border border-sand p-3 text-center text-sm">
      <p className="mb-2">重畫會覆蓋目前的作品與點評，確定嗎？</p>
      <div className="flex gap-2">
        <button type="button" className="btn-ghost flex-1" onClick={() => setConfirm(false)}>
          取消
        </button>
        <button type="button" className="btn-primary flex-1" onClick={onRedo}>
          確定重畫
        </button>
      </div>
    </div>
  )
}
