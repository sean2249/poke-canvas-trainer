/**
 * Anthropic API 金鑰與模型設定，存於瀏覽器 localStorage。
 * 注意：金鑰存在使用者自己的瀏覽器，純前端架構（GitHub Pages）下沒有後端可代為保管。
 */
const KEY_STORAGE = 'poke-trainer:anthropic-key'
const MODEL_STORAGE = 'poke-trainer:anthropic-model'

export function getApiKey(): string {
  try {
    return localStorage.getItem(KEY_STORAGE) ?? ''
  } catch {
    return ''
  }
}

export function setApiKey(value: string): void {
  const v = value.trim()
  if (v) localStorage.setItem(KEY_STORAGE, v)
  else localStorage.removeItem(KEY_STORAGE)
}

export function clearApiKey(): void {
  localStorage.removeItem(KEY_STORAGE)
}

export function hasApiKey(): boolean {
  return getApiKey().length > 0
}

export function getModel(): string {
  try {
    return localStorage.getItem(MODEL_STORAGE) ?? ''
  } catch {
    return ''
  }
}

export function setModel(value: string): void {
  const v = value.trim()
  if (v) localStorage.setItem(MODEL_STORAGE, v)
  else localStorage.removeItem(MODEL_STORAGE)
}

/** 把金鑰遮罩成 sk-ant-…abcd 供顯示。 */
export function maskKey(key: string): string {
  if (key.length <= 12) return '••••'
  return `${key.slice(0, 7)}…${key.slice(-4)}`
}
