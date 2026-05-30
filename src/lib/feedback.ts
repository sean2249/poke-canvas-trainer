export interface FeedbackStep {
  key: 'praise' | 'tweak' | 'tip'
  title: string
  emoji: string
  body: string
}

const STEP_META: Record<FeedbackStep['key'], { emoji: string; label: string; markers: string[] }> = {
  praise: { emoji: '🌟', label: '肯定亮點', markers: ['肯定亮點', '太棒了', 'Wow'] },
  tweak: { emoji: '✨', label: '精準微調', markers: ['精準微調', '小魔法'] },
  tip: { emoji: '🎯', label: '技法小功課', markers: ['技法補救', '小功課', '明天會更好'] },
}

/**
 * 把 AI 的「三步驟點評」文字拆成三段卡片。
 * 依靠 prompt 產出的標題標記（如【肯定亮點】）切分；切不出來時回傳單一整段。
 */
export function parseFeedback(text: string): FeedbackStep[] {
  const keys = Object.keys(STEP_META) as FeedbackStep['key'][]

  // 找出每個步驟標題在文字中的位置
  const hits = keys
    .map((key) => {
      const idx = STEP_META[key].markers
        .map((m) => text.indexOf(m))
        .filter((i) => i >= 0)
        .sort((a, b) => a - b)[0]
      return idx === undefined ? null : { key, idx }
    })
    .filter((h): h is { key: FeedbackStep['key']; idx: number } => h !== null)
    .sort((a, b) => a.idx - b.idx)

  if (hits.length === 0) {
    return [{ key: 'praise', title: '老師的話', emoji: '💬', body: text.trim() }]
  }

  return hits.map((hit, i) => {
    const start = hit.idx
    const end = i + 1 < hits.length ? hits[i + 1].idx : text.length
    const meta = STEP_META[hit.key]
    return {
      key: hit.key,
      title: meta.label,
      emoji: meta.emoji,
      body: cleanSection(text.slice(start, end)),
    }
  })
}

function cleanSection(chunk: string): string {
  return chunk
    // 去掉開頭的步驟標題與編號，例如「1. 【肯定亮點】（Wow! 太棒了）：」
    .replace(/^\s*\d*\s*[.、]?\s*[【\[][^】\]]*[】\]]\s*[（(][^）)]*[）)]?\s*[:：]?/u, '')
    .replace(/^\s*\d*\s*[.、]?\s*[【\[][^】\]]*[】\]]\s*[:：]?/u, '')
    .trim()
}
