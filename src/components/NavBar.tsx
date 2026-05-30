import { NavLink } from 'react-router-dom'

const TABS = [
  { to: '/', label: '今日', icon: '🏠', end: true },
  { to: '/gallery', label: '圖鑑牆', icon: '🖼️', end: false },
  { to: '/settings', label: '設定', icon: '⚙️', end: false },
]

export default function NavBar() {
  return (
    <nav className="sticky bottom-0 z-10 border-t border-sand bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-2xl">
        {TABS.map((t) => (
          <NavLink
            key={t.to}
            to={t.to}
            end={t.end}
            className={({ isActive }) =>
              `flex flex-1 flex-col items-center gap-0.5 py-2 text-xs font-semibold transition ${
                isActive ? 'text-sunny' : 'text-ink/50 hover:text-ink'
              }`
            }
          >
            <span className="text-xl">{t.icon}</span>
            {t.label}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
