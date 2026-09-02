import { NavLink } from 'react-router-dom'
import { Home, Sparkles, BookOpen, Menu } from 'lucide-react'

const NAV_ITEMS = [
  { to: '/', label: 'Accueil', Icon: Home },
  { to: '/generateur', label: 'Créer', Icon: Sparkles, primary: true },
  { to: '/plans', label: 'Mes circuits', Icon: BookOpen },
  { to: '/plus', label: 'Plus', Icon: Menu },
]

export default function Navigation() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 flex items-end border-t border-slate-200 bg-white px-3 shadow-[0_-8px_24px_rgba(15,23,42,.08)]" style={{ paddingBottom: 'env(safe-area-inset-bottom)', minHeight: 68 }}>
      {NAV_ITEMS.map(({ to, label, Icon, primary }) => (
        <NavLink key={to} to={to} end={to === '/'} className="flex min-w-0 flex-1 flex-col items-center justify-center gap-1 py-2 text-[11px] font-semibold">
          {({ isActive }) => (
            <>
              <span className={`flex items-center justify-center rounded-2xl ${primary ? '-mt-5 h-13 w-13 shadow-lg' : 'h-8 w-11'}`} style={{ background: primary ? 'linear-gradient(135deg,#f97316,#f59e0b)' : isActive ? '#e0f2fe' : 'transparent', color: primary ? 'white' : isActive ? '#0284c7' : '#64748b' }}>
                <Icon size={primary ? 25 : 22} strokeWidth={isActive || primary ? 2.6 : 2} />
              </span>
              <span style={{ color: isActive ? '#0369a1' : '#64748b' }}>{label}</span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  )
}
