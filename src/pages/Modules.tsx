import { useState } from 'react'
import type { ModuleTemplate, ModuleType } from '../types'
import { SEED_MODULES } from '../data/seedData'
import StepByStepViewer from '../components/StepByStepViewer'

const MODULE_TYPE_LABELS: Record<ModuleType, string> = {
  'central-tower': 'Tour centrale',
  'fast-branch': 'Branche rapide',
  'slow-branch': 'Branche lente',
  'train-branch': 'Branche train',
  'common-arrival': 'Arrivée commune',
  'elevator': 'Ascenseur',
  'spiral': 'Spirale',
  'launcher': 'Lanceur',
}

const DIFF_COLOR = { easy: '#10b981', medium: '#f59e0b', hard: '#ef4444' }

export default function Modules() {
  const [selected, setSelected] = useState<ModuleTemplate | null>(null)

  if (selected) {
    return (
      <div className="flex flex-col gap-4 pb-6 px-4">
        <button onClick={() => setSelected(null)} className="text-sm mt-5" style={{ color: 'var(--text-secondary)' }}>
          ← Retour aux modules
        </button>

        <div className="flex items-center gap-3">
          <span className="text-5xl">{selected.emoji}</span>
          <div>
            <h1 className="font-bold text-xl" style={{ color: 'var(--text-primary)' }}>{selected.name}</h1>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs px-2 py-0.5 rounded-full font-medium text-white" style={{ background: DIFF_COLOR[selected.difficulty] }}>
                {selected.difficulty}
              </span>
              <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                {MODULE_TYPE_LABELS[selected.type]}
              </span>
            </div>
          </div>
        </div>

        <div className="card p-4">
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{selected.description}</p>
          {selected.tips && (
            <p className="text-xs mt-2 italic" style={{ color: 'var(--accent2)' }}>
              💡 {selected.tips}
            </p>
          )}
        </div>

        <div>
          <h2 className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: 'var(--text-secondary)' }}>
            Types de pièces nécessaires
          </h2>
          <div className="flex flex-wrap gap-2">
            {selected.requiredPieceTypes.map((t) => (
              <span
                key={t}
                className="text-xs px-3 py-1 rounded-full"
                style={{ background: 'var(--bg-secondary)', color: 'var(--text-secondary)', border: '1px solid var(--border)' }}
              >
                {t}
              </span>
            ))}
          </div>
        </div>

        <StepByStepViewer steps={selected.steps} planName={selected.name} />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4 pb-6 px-4">
      <div className="pt-5">
        <h1 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
          Modules 🧩
        </h1>
        <p className="text-sm mt-0.5" style={{ color: 'var(--text-secondary)' }}>
          Blocs de construction réutilisables pour vos circuits.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {SEED_MODULES.map((mod) => (
          <button
            key={mod.id}
            onClick={() => setSelected(mod)}
            className="card p-4 text-left animate-slide-up"
          >
            <div className="flex items-start gap-3">
              <span className="text-4xl">{mod.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>
                    {mod.name}
                  </h3>
                  <span className="text-xs px-2 py-0.5 rounded-full font-medium text-white" style={{ background: DIFF_COLOR[mod.difficulty] }}>
                    {mod.difficulty}
                  </span>
                </div>
                <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>
                  {MODULE_TYPE_LABELS[mod.type]}
                </p>
                <p className="text-xs mt-1 line-clamp-2" style={{ color: 'var(--text-secondary)' }}>
                  {mod.description}
                </p>
                <p className="text-xs mt-2" style={{ color: 'var(--text-secondary)' }}>
                  {mod.steps.length} étapes · {mod.requiredPieceTypes.length} types de pièces
                </p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
