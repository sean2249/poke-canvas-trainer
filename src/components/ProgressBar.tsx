export default function ProgressBar({
  value,
  total,
  className = '',
}: {
  value: number
  total: number
  className?: string
}) {
  const pct = total > 0 ? Math.round((value / total) * 100) : 0
  return (
    <div className={`h-3 w-full overflow-hidden rounded-full bg-sand ${className}`}>
      <div
        className="h-full rounded-full bg-sunny transition-all duration-500"
        style={{ width: `${pct}%` }}
      />
    </div>
  )
}
