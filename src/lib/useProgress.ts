import { useCallback, useEffect, useState } from 'react'
import { getAllEntries } from './db'
import { CURRICULUM, PHASES, TOTAL_DAYS } from '../data/curriculum'
import type { Entry, PhaseId } from '../types'

export interface Progress {
  entries: Map<number, Entry>
  completedDays: Set<number>
  completedCount: number
  currentDay: number // 下一個未完成日（全部完成則為 TOTAL_DAYS）
  phaseProgress: Record<PhaseId, { done: number; total: number }>
  loading: boolean
  reload: () => Promise<void>
}

function computePhaseProgress(completed: Set<number>) {
  const result = {} as Record<PhaseId, { done: number; total: number }>
  for (const phase of Object.values(PHASES)) {
    const [start, end] = phase.range
    let done = 0
    for (let d = start; d <= end; d++) if (completed.has(d)) done++
    result[phase.id] = { done, total: end - start + 1 }
  }
  return result
}

export function useProgress(): Progress {
  const [entries, setEntries] = useState<Map<number, Entry>>(new Map())
  const [loading, setLoading] = useState(true)

  const reload = useCallback(async () => {
    const all = await getAllEntries()
    setEntries(new Map(all.map((e) => [e.day, e])))
    setLoading(false)
  }, [])

  useEffect(() => {
    void reload()
  }, [reload])

  const completedDays = new Set(entries.keys())
  const firstUndone = CURRICULUM.find((d) => !completedDays.has(d.day))

  return {
    entries,
    completedDays,
    completedCount: completedDays.size,
    currentDay: firstUndone?.day ?? TOTAL_DAYS,
    phaseProgress: computePhaseProgress(completedDays),
    loading,
    reload,
  }
}
