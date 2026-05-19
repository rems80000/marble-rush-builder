import { useRef } from 'react'
import { Download, Upload, RotateCcw, Palette, Image as ImageIcon, Grid2x2 } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { useStore } from '../store/useStore'
import { exportJSON, importJSON } from '../utils/storage'
import type { AppTheme } from '../types'

const THEMES: { value: AppTheme; label: string; emoji: string }[] = [
  { value: 'dark',     label: 'Sombre',     emoji: '🌙' },
  { value: 'colorful', label: 'Coloré',     emoji: '🌈' },
  { value: 'light',    label: 'Clair',      emoji: '☀️' },
]

export default function Settings() {
  const { state, dispatch } = useStore()
  const fileRef = useRef<HTMLInputElement>(null)

  async function handleImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      const data = await importJSON(file)
      dispatch({ type: 'IMPORT_STATE', state: data })
      alert('Import réussi !')
    } catch {
      alert('Fichier invalide.')
    }
  }

  return (
    <div className="flex flex-col gap-6 pb-6 px-4">
      <div className="pt-5">
        <h1 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
          Paramètres ⚙️
        </h1>
      </div>

      {/* Thème */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Palette size={16} style={{ color: 'var(--text-secondary)' }} />
          <h2 className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--text-secondary)' }}>
            Thème
          </h2>
        </div>
        <div className="flex gap-2">
          {THEMES.map(({ value, label, emoji }) => (
            <button
              key={value}
              onClick={() => dispatch({ type: 'SET_THEME', theme: value })}
              className="flex-1 py-3 rounded-xl flex flex-col items-center gap-1 transition-all"
              style={{
                background: state.settings.theme === value ? 'var(--accent)' : 'var(--bg-secondary)',
                border: `1px solid ${state.settings.theme === value ? 'var(--accent)' : 'var(--border)'}`,
                color: state.settings.theme === value ? 'white' : 'var(--text-secondary)',
              }}
            >
              <span className="text-xl">{emoji}</span>
              <span className="text-xs font-medium">{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Âge par défaut */}
      <div>
        <h2 className="text-xs font-semibold uppercase tracking-wide mb-3" style={{ color: 'var(--text-secondary)' }}>
          Âge de l'enfant par défaut
        </h2>
        <div className="flex gap-2 flex-wrap">
          {[undefined, 4, 5, 6, 7, 8, 9, 10].map((age) => (
            <button
              key={age ?? 'none'}
              onClick={() => dispatch({ type: 'UPDATE_SETTINGS', settings: { defaultChildAge: age } })}
              className="px-3 py-1.5 rounded-full text-xs font-medium transition-all"
              style={{
                background: state.settings.defaultChildAge === age ? 'var(--accent2)' : 'var(--bg-secondary)',
                color: state.settings.defaultChildAge === age ? 'white' : 'var(--text-secondary)',
                border: '1px solid var(--border)',
              }}
            >
              {age ? `${age} ans` : 'Non défini'}
            </button>
          ))}
        </div>
      </div>

      {/* Données */}
      <div>
        <h2 className="text-xs font-semibold uppercase tracking-wide mb-3" style={{ color: 'var(--text-secondary)' }}>
          Données
        </h2>

        <div className="flex flex-col gap-2">
          <button
            onClick={() => exportJSON(state)}
            className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium"
            style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
          >
            <Download size={18} className="text-emerald-400" />
            Exporter toutes les données (JSON)
          </button>

          <button
            onClick={() => fileRef.current?.click()}
            className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium"
            style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
          >
            <Upload size={18} className="text-cyan-400" />
            Importer des données (JSON)
          </button>
          <input
            ref={fileRef}
            type="file"
            accept=".json"
            className="hidden"
            onChange={handleImport}
          />
        </div>
      </div>

      {/* Statistiques */}
      <div>
        <h2 className="text-xs font-semibold uppercase tracking-wide mb-3" style={{ color: 'var(--text-secondary)' }}>
          Statistiques
        </h2>
        <div className="card p-4">
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'Sets total', value: state.sets.length },
              { label: 'Sets possédés', value: state.sets.filter(s => s.owned).length },
              { label: 'Sets actifs', value: state.sets.filter(s => s.owned && s.active).length },
              { label: 'Plans créés', value: state.plans.length },
              { label: 'Plans favoris', value: state.plans.filter(p => p.isFavorite).length },
              {
                label: 'Pièces dispo',
                value: state.sets.filter(s => s.owned && s.active)
                  .reduce((n, s) => n + s.pieces.reduce((m, p) => m + p.quantity, 0), 0),
              },
            ].map(({ label, value }) => (
              <div key={label}>
                <p className="text-2xl font-bold" style={{ color: 'var(--accent)' }}>{value}</p>
                <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Outils */}
      <div>
        <h2 className="text-xs font-semibold uppercase tracking-wide mb-3" style={{ color: 'var(--text-secondary)' }}>
          Outils
        </h2>
        <div className="flex flex-col gap-2">
          <NavLink
            to="/builder"
            className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium"
            style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
          >
            <Grid2x2 size={18} className="text-cyan-400" />
            Constructeur visuel 🏗️
          </NavLink>
          <NavLink
            to="/images"
            className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium"
            style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
          >
            <ImageIcon size={18} className="text-violet-400" />
            Gérer les photos des pièces 📸
          </NavLink>
        </div>
      </div>

      {/* Reset */}
      <div>
        <h2 className="text-xs font-semibold uppercase tracking-wide mb-3" style={{ color: '#ef4444' }}>
          Zone dangereuse
        </h2>
        <button
          onClick={() => {
            if (confirm('Réinitialiser toutes les données ? Cette action est irréversible.')) {
              dispatch({ type: 'RESET' })
            }
          }}
          className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium w-full"
          style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#ef4444' }}
        >
          <RotateCcw size={18} />
          Réinitialiser toutes les données
        </button>
      </div>

      {/* Info */}
      <div className="text-center pt-2">
        <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
          Marble Rush Builder v1.0 · Données stockées localement · Fonctionne hors-ligne
        </p>
      </div>
    </div>
  )
}
