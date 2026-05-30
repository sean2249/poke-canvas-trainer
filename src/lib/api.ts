import type { DayPlan } from '../types'
import { dataUrlToBase64 } from './image'
import { DEFAULT_MODEL, generateCritique } from './critique'
import { getApiKey, getModel, hasApiKey } from './apiKey'

/** 是否已設定金鑰（決定是否顯示「AI 老師尚未設定」狀態）。 */
export function getAiStatus(): boolean {
  return hasApiKey()
}

/**
 * 直接呼叫 Anthropic API 取得 AI 老師的中文回饋。
 * imageDataUrl 為壓縮後的 JPEG dataURL；金鑰取自 localStorage。
 */
export async function requestCritique(plan: DayPlan, imageDataUrl: string): Promise<string> {
  const apiKey = getApiKey()
  if (!apiKey) {
    throw new Error('尚未設定 API 金鑰，請到「設定」頁輸入你的 Anthropic 金鑰。')
  }
  return generateCritique(
    {
      day: plan.day,
      subject: plan.subject,
      media: plan.media,
      focus: `${plan.focus}：${plan.focusHint}`,
      imageBase64: dataUrlToBase64(imageDataUrl),
      mediaType: 'image/jpeg',
    },
    apiKey,
    getModel() || DEFAULT_MODEL,
  )
}
