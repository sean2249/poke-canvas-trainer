import { useProgress } from '../lib/useProgress'
import { CURRICULUM, PHASES, TOTAL_DAYS } from '../data/curriculum'
import PokemonCard from '../components/PokemonCard'
import type { PhaseId } from '../types'

export default function Gallery() {
  const { entries, completedCount, currentDay, loading } = useProgress()

  if (loading) return <p className="py-12 text-center text-ink/50">載入中…</p>

  const first = entries.get(1)
  const last = entries.get(30)

  return (
    <div className="space-y-6">
      <section className="card p-4 text-center">
        <h2 className="text-lg font-bold">🖼️ 我的寶可夢圖鑑牆</h2>
        <p className="mt-1 text-sm text-ink/60">
          已收集 {completedCount} / {TOTAL_DAYS} 隻
        </p>
      </section>

      {/* 大師之路：第一天 vs 第三十天 */}
      {first && last && (
        <section className="card bg-gradient-to-br from-sand to-cream p-4">
          <h3 className="mb-3 text-center font-bold">🏆 我的大師之路</h3>
          <div className="grid grid-cols-2 gap-3">
            <figure className="text-center">
              <img src={first.imageDataUrl} alt="Day 1" className="rounded-xl2 shadow-soft" />
              <figcaption className="mt-1 text-xs text-ink/60">Day 1 · 起點</figcaption>
            </figure>
            <figure className="text-center">
              <img src={last.imageDataUrl} alt="Day 30" className="rounded-xl2 shadow-soft" />
              <figcaption className="mt-1 text-xs text-ink/60">Day 30 · 畢業大作</figcaption>
            </figure>
          </div>
          <p className="mt-3 text-center text-sm text-sunny">看看這驚人的進步！👏</p>
        </section>
      )}

      {/* 依階段分組的格子牆 */}
      {(Object.keys(PHASES) as PhaseId[]).map((id) => {
        const phase = PHASES[id]
        const days = CURRICULUM.filter((d) => d.phase === id)
        return (
          <section key={id}>
            <h3 className="mb-2 text-sm font-semibold text-ink/70">
              {phase.emoji} {phase.title}
            </h3>
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
              {days.map((plan) => (
                <PokemonCard
                  key={plan.day}
                  plan={plan}
                  entry={entries.get(plan.day)}
                  isCurrent={plan.day === currentDay}
                />
              ))}
            </div>
          </section>
        )
      })}
    </div>
  )
}
