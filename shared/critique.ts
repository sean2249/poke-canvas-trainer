/**
 * 與執行環境無關的 AI 點評核心邏輯（使用全域 fetch，可在 Cloudflare workerd 與 Node 執行）。
 * 由 Cloudflare Pages Function（正式環境）與 Vite dev-API plugin（本機開發）共用，
 * 確保「三步驟點評法」prompt 只有一份、不會走樣。
 */

export const DEFAULT_MODEL = 'claude-sonnet-4-6'
const ANTHROPIC_URL = 'https://api.anthropic.com/v1/messages'

export interface CritiqueInput {
  day: number
  subject: string
  media: string
  focus: string
  imageBase64: string
  mediaType?: string
}

/** 帶 HTTP 狀態碼的錯誤，方便兩端轉成對應回應。 */
export class CritiqueError extends Error {
  status: number
  constructor(message: string, status: number) {
    super(message)
    this.name = 'CritiqueError'
    this.status = status
  }
}

export function buildSystemPrompt(day: number, subject: string, media: string, focus: string): string {
  return `你是一位擁有20年教學經驗、極具耐心且溫柔的兒童與成人繪畫啟蒙老師。
現在學員正在進行「30天寶可夢繪畫新手特訓」，今天是【Day ${day}: ${subject}】。
本階段的媒材限制為：${media}，核心特訓重點為：${focus}。

請仔細審視學員上傳的手繪作品照片，並嚴格遵循以下「三步驟點評法」進行繁體中文（台灣）的回饋，字數控制在 300 字內，語氣要充滿鼓勵、絕對不能打擊新手信心。請務必使用下列三個帶【】的標題分段：

1. 【肯定亮點】（Wow! 太棒了）：
   無視任何失誤，先找出畫面中 1-2 個優點（例如：線條很勇敢肯定、圓形抓得很努力、某個色塊塗得很均勻、捕捉到了百變怪流暢的靈魂等）。
2. 【精準微調】（老師的小魔法）：
   針對「新手」能做到的範圍，給予 1 個最關鍵的結構或比例調整建議。請用「可量化／具體」的描述（例如：「如果把大圓形右邊的耳朵縮小 10%，呆萌感會翻倍喔！」或「下筆力道可以再輕一點點，這樣擦草稿時比較不會傷到紙」）。避免使用「結構不對」、「比例不精準」等抽象挫折詞彙。
3. 【技法小功課】（明天會更好）：
   針對今天使用的媒材（鉛筆／色鉛筆／水彩），給予一個實用的小技巧（例如：水彩水太多可以用乾筆吸乾、色鉛筆順著同方向塗會更均勻）。最後用一句充滿期待的話收尾，鼓勵他挑戰明天的主題。`
}

/**
 * 呼叫 Anthropic Messages API 取得回饋文字。
 * 失敗時丟出 CritiqueError（含適當狀態碼）。
 */
export async function generateCritique(
  input: CritiqueInput,
  apiKey: string,
  model: string = DEFAULT_MODEL,
): Promise<string> {
  const { day, subject, media, focus, imageBase64 } = input
  if (!imageBase64 || !subject) {
    throw new CritiqueError('缺少必要欄位（圖片或主題）', 400)
  }
  const mediaType = input.mediaType ?? 'image/jpeg'

  const payload = {
    model,
    max_tokens: 1024,
    system: buildSystemPrompt(day, subject, media, focus),
    messages: [
      {
        role: 'user',
        content: [
          { type: 'image', source: { type: 'base64', media_type: mediaType, data: imageBase64 } },
          {
            type: 'text',
            text: `這是我今天畫的「${subject}」，請老師依三步驟點評法給我溫柔具體的回饋。`,
          },
        ],
      },
    ],
  }

  let res: Response
  try {
    res = await fetch(ANTHROPIC_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify(payload),
    })
  } catch {
    throw new CritiqueError('無法連線到 AI 服務，請稍後再試。', 502)
  }

  if (!res.ok) {
    let detail = ''
    try {
      const err = (await res.json()) as { error?: { message?: string } }
      detail = err.error?.message ?? ''
    } catch {
      /* ignore */
    }
    throw new CritiqueError(`AI 服務回應錯誤（${res.status}）${detail ? '：' + detail : ''}`, 502)
  }

  const data = (await res.json()) as { content?: Array<{ type: string; text?: string }> }
  const feedback = (data.content ?? [])
    .filter((c) => c.type === 'text' && c.text)
    .map((c) => c.text)
    .join('\n')
    .trim()

  if (!feedback) throw new CritiqueError('AI 沒有回覆內容，請再試一次。', 502)
  return feedback
}
