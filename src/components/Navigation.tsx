import { NavLink } from 'react-router-dom'
import { Home, Package, Sparkles, BookOpen, Menu } from 'lucide-react'

const NAV_ITEMS = [
  { to: '/', label: 'Accueil', Icon: Home },
  { to: '/sets', label: 'Mes sets', Icon: Package },
  { to: '/generateur', label: 'Créer', Icon: Sparkles, primary: true },
  { to: '/plans', label: 'Mes plans', Icon: BookOpen },
  { to: '/plus', label: 'Plus', Icon: Menu },
]

export default function Navigation() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 flex items-end px-2" style={{ background: 'rgba(15,10,46,.97)', borderTop: '1px solid var(--border)', paddingBottom: 'env(safe-area-inset-bottom)', minHeight: 64 }}>
      {NAV_ITEMS.map(({ to, label, Icon, primary }) => (
        <NavLink key={to} to={to} end={to === '/'} className="flex min-w-0 flex-1 flex-col items-center justify-center gap-1 py-2 text-[11px] font-semibold">
          {({ isActive }) => (
            <>
              <span className={`flex items-center justify-center rounded-2xl ${primary ? '-mt-6 h-12 w-12 shadow-lg' : 'h-7 w-10'}`} style={{ background: primary ? 'linear-gradient(135deg,#f97316,#f59e0b)' : isActive ? 'rgba(124,58,237,.22)' : 'transparent', color: primary ? 'white' : isActive ? '#a78bfa' : '#64748b' }}>
                <Icon size={primary ? 25 : 22} strokeWidth={isActive || primary ? 2.6 : 2} />
              </span>
              <span style={{ color: isActive ? '#a78bfa' : '#94a3b8' }}>{label}</span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  )
}
