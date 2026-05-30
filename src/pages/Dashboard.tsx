import { Link } from 'react-router-dom'
import { useProgress } from '../lib/useProgress'
import { CURRICULUM, PHASES, TOTAL_DAYS, getDay, getPhase } from '../data/curriculum'
import PhaseBadge from '../components/PhaseBadge'
import ProgressBar from '../components/ProgressBar'
import type { PhaseId } from '../types'

export default function Dashboard() {
  const { completedCount, currentDay, phaseProgress, completedDays, loading } = useProgress()

  if (loading) return <p className="py-12 text-center text-ink/50">載入中…</p>

  const allDone = completedCount >= TOTAL_DAYS
  const today = getDay(currentDay)
  const phase = getPhase(currentDay)

  return (
    <div className="space-y-6">
      {/* 總進度 */}
      <section className="card p-4">
        <div className="mb-2 flex items-end justify-between">
          <span className="font-semibold">特訓進度</span>
          <span className="text-sm text-ink/60">
            {completedCount} / {TOTAL_DAYS} 天
          </span>
        </div>
        <ProgressBar value={completedCount} total={TOTAL_DAYS} />
      </section>

      {/* 今日主題 / 畢業 */}
      {allDone || !today ? (
        <section className="card bg-gradient-to-br from-sand to-cream p-6 text-center">
          <div className="text-4xl">🎓</div>
          <h2 className="mt-2 text-lg font-bold">恭喜完成 30 天特訓！</h2>
          <p className="mt-1 text-sm text-ink/60">到圖鑑牆回顧你的大師之路吧。</p>
          <Link to="/gallery" className="btn-primary mt-4">
            前往圖鑑牆 🖼️
          </Link>
        </section>
      ) : (
        <section className="card overflow-hidden">
          <div className="flex items-center justify-between bg-sand/60 px-4 py-2">
            <PhaseBadge phase={phase} />
            <span className="text-sm font-bold text-sunny">Day {today.day}</span>
          </div>
          <div className="p-5">
            <p className="text-xs text-ink/50">今日主題</p>
            <h2 className="text-2xl font-bold">
              {today.subject}
              <span className="ml-2 text-sm font-normal text-ink/40">{today.subjectEn}</span>
            </h2>

            <div className="mt-4 rounded-xl2 bg-sand/40 p-3">
              <p className="text-sm font-semibold">🎯 今日重點 · {today.focus}</p>
              <p className="mt-1 text-sm text-ink/70">{today.focusHint}</p>
            </div>

            <div className="mt-3 rounded-xl2 border border-sand p-3">
              <p className="text-sm font-semibold">🧰 工具準備</p>
              <p className="mt-1 text-sm text-ink/70">{today.tools}</p>
            </div>

            <Link to={`/day/${today.day}`} className="btn-primary mt-5 w-full">
              開始今天的練習 ✏️
            </Link>
          </div>
        </section>
      )}

      {/* 去挫折化標語 */}
      <p className="rounded-xl2 bg-coral/10 px-4 py-3 text-center text-sm text-coral">
        每天只要 15–30 分鐘，不完美也很可愛！<br />
        百變怪和謎擬Ｑ就是要歪歪的才有靈魂 💕
      </p>

      {/* 四階段進度 */}
      <section className="space-y-3">
        <h3 className="font-semibold">四大階段</h3>
        {(Object.keys(PHASES) as PhaseId[]).map((id) => {
          const p = PHASES[id]
          const prog = phaseProgress[id]
          return (
            <div key={id} className="card p-4">
              <div className="mb-1 flex items-center justify-between">
                <span className="text-sm font-semibold">
                  {p.emoji} {p.title.split('·')[1]?.trim()}
                </span>
                <span className="text-xs text-ink/50">
                  {prog.done}/{prog.total}
                </span>
              </div>
              <p className="mb-2 text-xs text-ink/50">{p.goal}</p>
              <ProgressBar value={prog.done} total={prog.total} />
              <div className="mt-3 grid grid-cols-8 gap-1.5">
                {CURRICULUM.filter((d) => d.phase === id).map((d) => (
                  <Link
                    key={d.day}
                    to={`/day/${d.day}`}
                    title={`Day ${d.day} ${d.subject}`}
                    className={`flex aspect-square items-center justify-center rounded-lg text-[11px] font-bold ${
                      completedDays.has(d.day)
                        ? 'bg-mint text-white'
                        : d.day === currentDay
                          ? 'bg-sunny text-white'
                          : 'bg-sand text-ink/50'
                    }`}
                  >
                    {d.day}
                  </Link>
                ))}
              </div>
            </div>
          )
        })}
      </section>
    </div>
  )
}
