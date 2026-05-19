import { useNavigate } from 'react-router-dom'
import { Package, Archive, Zap, BookOpen, Puzzle, Grid2x2 } from 'lucide-react'
import { useStore } from '../store/useStore'

const QUICK_ACTIONS = [
  { to: '/sets',       label: 'Mes sets',      Icon: Package,   color: '#7c3aed', desc: 'Gérer ma collection' },
  { to: '/inventaire', label: 'Inventaire',    Icon: Archive,   color: '#0891b2', desc: 'Pièces disponibles' },
  { to: '/generateur', label: 'Générer',       Icon: Zap,       color: '#f59e0b', desc: 'Créer un circuit' },
  { to: '/builder',    label: 'Constructeur',  Icon: Grid2x2,   color: '#06b6d4', desc: 'Placer les pièces' },
  { to: '/plans',      label: 'Mes plans',     Icon: BookOpen,  color: '#10b981', desc: 'Plans sauvegardés' },
  { to: '/modules',    label: 'Modules',       Icon: Puzzle,    color: '#ec4899', desc: 'Modules réutilisables' },
]

export default function Home() {
  const navigate = useNavigate()
  const { state } = useStore()

  const ownedSets = state.sets.filter((s) => s.owned)
  const activeSets = state.sets.filter((s) => s.owned && s.active)
  const totalPieces = activeSets.reduce(
    (sum, s) => sum + s.pieces.reduce((ps, p) => ps + p.quantity, 0),
    0,
  )

  return (
    <div className="flex flex-col gap-6 pb-6">
      {/* Hero */}
      <div
        className="px-5 pt-10 pb-8 text-center"
        style={{
          background: 'linear-gradient(160deg, rgba(124,58,237,0.25) 0%, rgba(6,182,212,0.1) 100%)',
          borderBottom: '1px solid var(--border)',
        }}
      >
        <p className="text-5xl mb-3">🔮</p>
        <h1 className="text-2xl font-extrabold mb-1" style={{ color: 'var(--text-primary)' }}>
          Marble Rush Builder
        </h1>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          Gérez vos circuits VTech Marble Rush
        </p>

        {/* Stats rapides */}
        <div className="flex justify-center gap-6 mt-5">
          <div className="text-center">
            <p className="text-2xl font-bold text-violet-400">{ownedSets.length}</p>
            <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>sets possédés</p>
          </div>
          <div className="w-px" style={{ background: 'var(--border)' }} />
          <div className="text-center">
            <p className="text-2xl font-bold text-cyan-400">{totalPieces}</p>
            <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>pièces actives</p>
          </div>
          <div className="w-px" style={{ background: 'var(--border)' }} />
          <div className="text-center">
            <p className="text-2xl font-bold text-emerald-400">{state.plans.length}</p>
            <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>circuits créés</p>
          </div>
        </div>
      </div>

      <div className="px-4">
        {/* Actions rapides */}
        <h2 className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--text-secondary)' }}>
          Actions rapides
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {QUICK_ACTIONS.map(({ to, label, Icon, color, desc }) => (
            <button
              key={to}
              onClick={() => navigate(to)}
              className="card p-4 text-left animate-slide-up hover:scale-[1.02] transition-transform active:scale-[0.98]"
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center mb-2"
                style={{ background: `${color}22` }}
              >
                <Icon size={20} style={{ color }} />
              </div>
              <p className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{label}</p>
              <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>{desc}</p>
            </button>
          ))}
        </div>

        {/* Sets actifs */}
        {activeSets.length > 0 && (
          <div className="mt-6">
            <h2 className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--text-secondary)' }}>
              Sets actifs dans l'inventaire
            </h2>
            <div className="flex flex-col gap-2">
              {activeSets.map((s) => (
                <div
                  key={s.id}
                  className="flex items-center gap-3 rounded-xl px-4 py-3"
                  style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
                >
                  <span className="text-2xl">{s.coverEmoji ?? '📦'}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>{s.name}</p>
                    <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                      {s.pieces.reduce((n, p) => n + p.quantity, 0)} pièces
                    </p>
                  </div>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300">
                    Actif
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Plans récents */}
        {state.plans.length > 0 && (
          <div className="mt-6">
            <h2 className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--text-secondary)' }}>
              Plans récents
            </h2>
            <div className="flex flex-col gap-2">
              {state.plans.slice(0, 3).map((plan) => (
                <button
                  key={plan.id}
                  onClick={() => navigate('/plans')}
                  className="flex items-center gap-3 rounded-xl px-4 py-3 text-left w-full"
                  style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
                >
                  <span className="text-xl">📐</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>{plan.name}</p>
                    <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                      {plan.steps.length} étapes · {plan.difficulty}
                    </p>
                  </div>
                  {plan.isFavorite && <span>⭐</span>}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
