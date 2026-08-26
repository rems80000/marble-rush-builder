import { NavLink } from 'react-router-dom'
import { Archive, Camera, ChevronRight, Grid3X3, Image, Puzzle, Settings, Trophy } from 'lucide-react'

const ITEMS = [
  { to: '/inventaire', label: 'Inventaire complet', description: 'Toutes les pièces fusionnées', Icon: Archive, color: '#06b6d4' },
  { to: '/builder', label: 'Constructeur libre', description: 'Placer et déplacer les pièces', Icon: Grid3X3, color: '#f97316' },
  { to: '/circuits', label: 'Circuits construits', description: 'Photos, notes et favoris', Icon: Trophy, color: '#eab308' },
  { to: '/modules', label: 'Modules réutilisables', description: 'Tours, spirales et branches', Icon: Puzzle, color: '#ec4899' },
  { to: '/images', label: 'Photos des pièces', description: 'Ajouter ou recadrer une image', Icon: Image, color: '#10b981' },
  { to: '/parametres', label: 'Réglages et sauvegarde', description: 'Thème, import et export', Icon: Settings, color: '#8b5cf6' },
]

export default function More() {
  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-4 px-4 pb-24 pt-5">
      <div>
        <h1 className="text-2xl font-black" style={{ color: 'var(--text-primary)' }}>Plus</h1>
        <p className="mt-1 text-sm" style={{ color: 'var(--text-secondary)' }}>Les outils avancés restent disponibles sans encombrer le parcours principal.</p>
      </div>
      <div className="flex flex-col gap-2">
        {ITEMS.map(({ to, label, description, Icon, color }) => (
          <NavLink key={to} to={to} className="card flex min-h-18 items-center gap-3 p-3">
            <span className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl" style={{ background: `${color}20`, color }}><Icon size={23} /></span>
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-bold" style={{ color: 'var(--text-primary)' }}>{label}</span>
              <span className="block text-xs" style={{ color: 'var(--text-secondary)' }}>{description}</span>
            </span>
            <ChevronRight size={20} style={{ color: 'var(--text-secondary)' }} />
          </NavLink>
        ))}
      </div>
      <div className="flex items-center gap-2 rounded-xl p-3 text-xs" style={{ background: 'rgba(6,182,212,.1)', color: 'var(--text-secondary)' }}>
        <Camera size={18} className="text-cyan-400" /> Les photos des notices sont conservées comme références locales dans l’application.
      </div>
    </div>
  )
}
