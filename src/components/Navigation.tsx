import { NavLink } from 'react-router-dom'
import { Home, Package, Archive, Zap, BookOpen, Trophy, Puzzle, Settings } from 'lucide-react'

const NAV_ITEMS = [
  { to: '/',           label: 'Accueil',   Icon: Home },
  { to: '/sets',       label: 'Sets',      Icon: Package },
  { to: '/inventaire', label: 'Inventaire',Icon: Archive },
  { to: '/generateur', label: 'Générer',   Icon: Zap },
  { to: '/plans',      label: 'Plans',     Icon: BookOpen },
  { to: '/circuits',   label: 'Circuits',  Icon: Trophy },
  { to: '/modules',    label: 'Modules',   Icon: Puzzle },
  { to: '/parametres', label: 'Config',    Icon: Settings },
]

export default function Navigation() {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around"
      style={{
        background: 'rgba(15, 10, 46, 0.95)',
        backdropFilter: 'blur(12px)',
        borderTop: '1px solid var(--border)',
        paddingBottom: 'env(safe-area-inset-bottom)',
        minHeight: '56px',
      }}
    >
      {NAV_ITEMS.map(({ to, label, Icon }) => (
        <NavLink
          key={to}
          to={to}
          end={to === '/'}
          className={({ isActive }) =>
            `flex flex-col items-center gap-0.5 px-1 py-2 text-[9px] font-medium transition-colors min-w-0 flex-1 ${
              isActive ? 'text-violet-400' : 'text-slate-500'
            }`
          }
        >
          {({ isActive }) => (
            <>
              <Icon
                size={19}
                className={isActive ? 'text-violet-400' : 'text-slate-500'}
                strokeWidth={isActive ? 2.5 : 1.8}
              />
              <span className="truncate w-full text-center leading-tight">{label}</span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  )
}
