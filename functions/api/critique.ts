/**
 * Cloudflare Pages Function — 後端代理（正式環境）。
 * 接收學員作品照片 + 當日主題參數，呼叫共用的點評核心，回傳溫柔的中文回饋。
 * 金鑰只存伺服器環境變數 ANTHROPIC_API_KEY，永不送到瀏覽器。
 */
import { CritiqueError, generateCritique, type CritiqueInput } from '../../shared/critique'

interface Env {
  ANTHROPIC_API_KEY?: string
  ANTHROPIC_MODEL?: string
}

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  })
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  if (!env.ANTHROPIC_API_KEY) {
    return json({ error: '伺服器未設定 ANTHROPIC_API_KEY' }, 500)
  }

  let body: CritiqueInput
  try {
    body = (await request.json()) as CritiqueInput
  } catch {
    return json({ error: '請求格式錯誤' }, 400)
  }

  try {
    const feedback = await generateCritique(body, env.ANTHROPIC_API_KEY, env.ANTHROPIC_MODEL)
    return json({ feedback })
  } catch (e) {
    const status = e instanceof CritiqueError ? e.status : 500
    return json({ error: e instanceof Error ? e.message : '未知錯誤' }, status)
  }
}
