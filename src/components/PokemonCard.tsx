import { Link } from 'react-router-dom'
import type { DayPlan, Entry } from '../types'

export default function PokemonCard({
  plan,
  entry,
  isCurrent,
}: {
  plan: DayPlan
  entry?: Entry
  isCurrent?: boolean
}) {
  const done = !!entry
  return (
    <Link
      to={`/day/${plan.day}`}
      className={`card group relative flex flex-col overflow-hidden transition hover:-translate-y-1 hover:shadow-lg ${
        isCurrent ? 'ring-2 ring-sunny' : ''
      }`}
    >
      <div className="relative aspect-square w-full bg-sand/60">
        {done ? (
          <img src={entry.imageDataUrl} alt={plan.subject} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center text-ink/40">
            <span className="text-3xl">❔</span>
            <span className="mt-1 text-xs">待挑戰</span>
          </div>
        )}
        <span className="absolute left-2 top-2 rounded-full bg-white/90 px-2 py-0.5 text-xs font-bold shadow">
          Day {plan.day}
        </span>
        {done && (
          <span className="absolute right-2 top-2 rounded-full bg-mint px-2 py-0.5 text-xs font-bold text-white shadow">
            ✓
          </span>
        )}
      </div>
      <div className="p-2 text-center">
        <div className="truncate text-sm font-semibold">{plan.subject}</div>
        <div className="truncate text-[11px] text-ink/50">{plan.focus}</div>
      </div>
    </Link>
  )
}
