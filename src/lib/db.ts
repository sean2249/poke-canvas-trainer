import { openDB, type DBSchema, type IDBPDatabase } from 'idb'
import type { Entry } from '../types'

interface TrainerDB extends DBSchema {
  entries: {
    key: number // day
    value: Entry
  }
}

const DB_NAME = 'poke-trainer'
const DB_VERSION = 1

let dbPromise: Promise<IDBPDatabase<TrainerDB>> | null = null

function getDB() {
  if (!dbPromise) {
    dbPromise = openDB<TrainerDB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('entries')) {
          db.createObjectStore('entries', { keyPath: 'day' })
        }
      },
    })
  }
  return dbPromise
}

export async function getEntry(day: number): Promise<Entry | undefined> {
  return (await getDB()).get('entries', day)
}

export async function getAllEntries(): Promise<Entry[]> {
  const all = await (await getDB()).getAll('entries')
  return all.sort((a, b) => a.day - b.day)
}

export async function saveEntry(entry: Entry): Promise<void> {
  await (await getDB()).put('entries', entry)
}

export async function deleteEntry(day: number): Promise<void> {
  await (await getDB()).delete('entries', day)
}

export async function clearAll(): Promise<void> {
  await (await getDB()).clear('entries')
}

/** 匯出全部紀錄為可下載的 JSON 字串（備份用）。 */
export async function exportAll(): Promise<string> {
  const entries = await getAllEntries()
  return JSON.stringify({ app: 'poke-canvas-trainer', version: DB_VERSION, entries }, null, 2)
}

/** 從備份 JSON 還原（覆蓋同一天的紀錄）。回傳成功匯入的筆數。 */
export async function importAll(json: string): Promise<number> {
  const parsed = JSON.parse(json) as { entries?: Entry[] }
  if (!parsed.entries || !Array.isArray(parsed.entries)) {
    throw new Error('備份檔格式不正確：缺少 entries 陣列')
  }
  const db = await getDB()
  const tx = db.transaction('entries', 'readwrite')
  for (const e of parsed.entries) {
    if (typeof e.day === 'number' && typeof e.imageDataUrl === 'string') {
      await tx.store.put(e)
    }
  }
  await tx.done
  return parsed.entries.length
}

/**
 * 向瀏覽器申請「持久化儲存」，降低 IndexedDB 在空間不足時被自動回收的機率。
 * 回傳是否為 persisted 狀態（不支援的瀏覽器回傳 false，App 仍可正常運作）。
 */
export async function requestPersistentStorage(): Promise<boolean> {
  try {
    if (navigator.storage?.persist) {
      if (await navigator.storage.persisted()) return true
      return await navigator.storage.persist()
    }
  } catch {
    // 忽略：部分環境（如 Safari 私密模式）會丟例外
  }
  return false
}

export async function isStoragePersisted(): Promise<boolean> {
  try {
    return (await navigator.storage?.persisted?.()) ?? false
  } catch {
    return false
  }
}
