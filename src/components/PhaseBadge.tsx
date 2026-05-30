import type { PhaseInfo } from '../types'

const ACCENT_BG: Record<string, string> = {
  ink: 'bg-ink/10 text-ink',
  coral: 'bg-coral/15 text-coral',
  sky: 'bg-sky/20 text-cyan-700',
  grape: 'bg-grape/20 text-grape',
}

export default function PhaseBadge({ phase }: { phase: PhaseInfo }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${
        ACCENT_BG[phase.accent] ?? ACCENT_BG.ink
      }`}
    >
      <span>{phase.emoji}</span>
      <span>{phase.title.split('·')[0].trim()}</span>
    </span>
  )
}
