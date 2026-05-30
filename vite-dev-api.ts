import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import type { Plugin } from 'vite'
import { CritiqueError, DEFAULT_MODEL, generateCritique, type CritiqueInput } from './shared/critique'

/**
 * 本機開發用的 /api 處理器，讓 `npm run dev` 一個指令就能完整運作
 * （正式環境改由 Cloudflare Pages Function 提供相同的端點）。
 *
 * 金鑰來源：process.env，其次讀取 .dev.vars（與 wrangler 共用同一份檔案）。
 */
function loadEnvVars(root: string): Record<string, string> {
  const vars: Record<string, string> = {}
  for (const name of ['.dev.vars', '.env']) {
    const file = resolve(root, name)
    if (!existsSync(file)) continue
    for (const line of readFileSync(file, 'utf8').split(/\r?\n/)) {
      const trimmed = line.trim()
      if (!trimmed || trimmed.startsWith('#')) continue
      const eq = trimmed.indexOf('=')
      if (eq < 0) continue
      const key = trimmed.slice(0, eq).trim()
      let value = trimmed.slice(eq + 1).trim()
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1)
      }
      if (!(key in vars)) vars[key] = value
    }
  }
  return vars
}

function getKey(root: string): { apiKey?: string; model: string } {
  const fromFile = loadEnvVars(root)
  return {
    apiKey: process.env.ANTHROPIC_API_KEY ?? fromFile.ANTHROPIC_API_KEY,
    model: process.env.ANTHROPIC_MODEL ?? fromFile.ANTHROPIC_MODEL ?? DEFAULT_MODEL,
  }
}

function send(res: import('node:http').ServerResponse, status: number, data: unknown) {
  res.statusCode = status
  res.setHeader('Content-Type', 'application/json; charset=utf-8')
  res.end(JSON.stringify(data))
}

async function readJson(req: import('node:http').IncomingMessage): Promise<unknown> {
  const chunks: Buffer[] = []
  for await (const chunk of req) chunks.push(chunk as Buffer)
  return JSON.parse(Buffer.concat(chunks).toString('utf8'))
}

export function devApi(): Plugin {
  return {
    name: 'dev-api',
    apply: 'serve',
    configureServer(server) {
      const root = server.config.root

      server.middlewares.use((req, res, next) => {
        const url = req.url ?? ''

        if (url.startsWith('/api/status')) {
          const { apiKey, model } = getKey(root)
          send(res, 200, { aiEnabled: !!apiKey, model })
          return
        }

        if (url.startsWith('/api/critique') && req.method === 'POST') {
          void (async () => {
            const { apiKey, model } = getKey(root)
            if (!apiKey) {
              send(res, 500, { error: '伺服器未設定 ANTHROPIC_API_KEY' })
              return
            }
            try {
              const body = (await readJson(req)) as CritiqueInput
              const feedback = await generateCritique(body, apiKey, model)
              send(res, 200, { feedback })
            } catch (e) {
              const status = e instanceof CritiqueError ? e.status : 400
              send(res, status, { error: e instanceof Error ? e.message : '請求錯誤' })
            }
          })()
          return
        }

        next()
      })
    },
  }
}
