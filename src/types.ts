/** 四大階段 id */
export type PhaseId = 'lines' | 'pencil' | 'watercolor' | 'mixed'

/** 單一天的課程資料 */
export interface DayPlan {
  day: number
  subject: string // 中文主題對象，例如「霹靂電球」
  subjectEn: string // 英文名，例如 Voltorb
  phase: PhaseId
  media: string // 媒材，例如「純鉛筆與橡皮擦」
  focus: string // 核心訓練重點（標題）
  focusHint: string // 重點的具體說明
  tools: string // 前端工具提示，例如「✏️ HB/2B鉛筆、橡皮擦、普通白紙」
}

/** 階段的展示資訊 */
export interface PhaseInfo {
  id: PhaseId
  title: string
  goal: string
  range: [number, number] // 起訖天數（含）
  accent: string // tailwind 色 class 名稱片段
  emoji: string
}

/** 使用者完成某一天後存進 IndexedDB 的紀錄 */
export interface Entry {
  day: number
  imageDataUrl: string // 壓縮後的 JPEG dataURL
  feedback: string // AI 老師的回饋文字
  status: 'done'
  completedAt: number // epoch ms
}
