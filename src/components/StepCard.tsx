import type { FeedbackStep } from '../lib/feedback'

const TONE: Record<FeedbackStep['key'], string> = {
  praise: 'border-mint/60 bg-mint/10',
  tweak: 'border-sunny/50 bg-sand/60',
  tip: 'border-sky/50 bg-sky/10',
}

export default function StepCard({ step }: { step: FeedbackStep }) {
  return (
    <div className={`rounded-xl2 border-2 p-4 ${TONE[step.key] ?? 'border-sand bg-white'}`}>
      <div className="mb-1 flex items-center gap-2 font-bold">
        <span className="text-xl">{step.emoji}</span>
        <span>{step.title}</span>
      </div>
      <p className="whitespace-pre-wrap leading-relaxed text-ink/90">{step.body}</p>
    </div>
  )
}
