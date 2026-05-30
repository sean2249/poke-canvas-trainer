import type { DayPlan } from '../types'
import { dataUrlToBase64 } from './image'

/**
 * 查詢後端是否已設定 AI 金鑰。
 * 回傳 true 代表可送出點評；false 代表 AI 老師尚未設定（App 仍可記錄存檔）。
 */
export async function getAiStatus(): Promise<boolean> {
  try {
    const res = await fetch('/api/status')
    if (!res.ok) return false
    const data = (await res.json()) as { aiEnabled?: boolean }
    return !!data.aiEnabled
  } catch {
    return false
  }
}

export interface CritiqueRequest {
  day: number
  subject: string
  media: string
  focus: string
  imageBase64: string
  mediaType: string
}

/**
 * 呼叫後端代理 /api/critique，取得 AI 老師的中文回饋。
 * imageDataUrl 為壓縮後的 JPEG dataURL。
 */
export async function requestCritique(plan: DayPlan, imageDataUrl: string): Promise<string> {
  const body: CritiqueRequest = {
    day: plan.day,
    subject: plan.subject,
    media: plan.media,
    focus: `${plan.focus}：${plan.focusHint}`,
    imageBase64: dataUrlToBase64(imageDataUrl),
    mediaType: 'image/jpeg',
  }

  let res: Response
  try {
    res = await fetch('/api/critique', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
  } catch {
    throw new Error('連線失敗，請確認網路或後端服務是否啟動。')
  }

  if (!res.ok) {
    let detail = ''
    try {
      const data = (await res.json()) as { error?: string }
      detail = data.error ?? ''
    } catch {
      /* ignore */
    }
    if (res.status === 500 && detail.includes('ANTHROPIC_API_KEY')) {
      throw new Error('後端尚未設定 ANTHROPIC_API_KEY，請參考 README 設定金鑰。')
    }
    throw new Error(detail || `老師暫時無法回覆（${res.status}），請稍後再試。`)
  }

  const data = (await res.json()) as { feedback?: string }
  if (!data.feedback) throw new Error('收到空白回饋，請再試一次。')
  return data.feedback
}
