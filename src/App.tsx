import { Route, Routes } from 'react-router-dom'
import NavBar from './components/NavBar'
import Dashboard from './pages/Dashboard'
import DayView from './pages/DayView'
import Gallery from './pages/Gallery'
import Settings from './pages/Settings'

export default function App() {
  return (
    <div className="mx-auto flex min-h-dvh max-w-2xl flex-col">
      <header className="px-4 pb-2 pt-5 text-center">
        <h1 className="text-xl font-bold text-sunny">🎨 30天寶可夢繪畫特訓營</h1>
        <p className="text-xs text-ink/50">新手從零開始的手繪陪跑培育指南</p>
      </header>

      <main className="flex-1 px-4 pb-6">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/day/:day" element={<DayView />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </main>

      <NavBar />
    </div>
  )
}
