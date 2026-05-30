/**
 * 回報後端是否已設定 AI 金鑰，讓前端決定是否顯示「AI 老師尚未設定」狀態。
 * 金鑰本身永不外流，只回傳布林值。
 */
interface Env {
  ANTHROPIC_API_KEY?: string
  ANTHROPIC_MODEL?: string
}

export const onRequestGet: PagesFunction<Env> = async ({ env }) => {
  return new Response(
    JSON.stringify({
      aiEnabled: !!env.ANTHROPIC_API_KEY,
      model: env.ANTHROPIC_MODEL ?? 'claude-sonnet-4-6',
    }),
    { headers: { 'Content-Type': 'application/json; charset=utf-8' } },
  )
}
