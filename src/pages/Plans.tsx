import { useState } from 'react'
import { Trash2, Star, StarOff, Eye, Clock, BarChart2, Search } from 'lucide-react'
import { useStore } from '../store/useStore'
import StepByStepViewer from '../components/StepByStepViewer'
import ValidationPanel from '../components/ValidationPanel'
import { formatDate } from '../utils/storage'
import type { CircuitPlan, Difficulty } from '../types'

const DIFF_COLOR: Record<Difficulty, string> = {
  easy: '#10b981',
  medium: '#f59e0b',
  hard: '#ef4444',
}

export default function Plans() {
  const { state, dispatch } = useStore()
  const [viewing, setViewing] = useState<CircuitPlan | null>(null)
  const [search, setSearch] = useState('')
  const [showFavOnly, setShowFavOnly] = useState(false)

  const filtered = state.plans
    .filter((p) => {
      const matchSearch = p.name.toLowerCase().includes(search.toLowerCase())
      const matchFav = !showFavOnly || p.isFavorite
      return matchSearch && matchFav
    })
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  if (viewing) {
    return (
      <div className="flex flex-col gap-4 pb-6 px-4">
        <div className="flex items-center justify-between pt-5">
          <button onClick={() => setViewing(null)} className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            ← Retour aux plans
          </button>
          <button
            onClick={() => dispatch({ type: 'TOGGLE_PLAN_FAVORITE', planId: viewing.id })}
            className="p-2"
          >
            {viewing.isFavorite
              ? <Star size={20} className="text-yellow-400 fill-yellow-400" />
              : <StarOff size={20} style={{ color: 'var(--text-secondary)' }} />}
          </button>
        </div>

        <StepByStepViewer steps={viewing.steps} planName={viewing.name} />

        {viewing.validationResult && (
          <div>
            <h2 className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: 'var(--text-secondary)' }}>
              Validation
            </h2>
            <ValidationPanel result={viewing.validationResult} />
          </div>
        )}

        <button
          onClick={() => {
            dispatch({ type: 'DELETE_PLAN', planId: viewing.id })
            setViewing(null)
          }}
          className="flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium text-red-400"
          style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)' }}
        >
          <Trash2 size={16} /> Supprimer ce plan
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4 pb-6 px-4">
      <div className="pt-5">
        <h1 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
          Mes Plans 📐
        </h1>
        <p className="text-sm mt-0.5" style={{ color: 'var(--text-secondary)' }}>
          {state.plans.length} plan(s) sauvegardé(s)
        </p>
      </div>

      {/* Recherche + filtres */}
      <div className="flex gap-2">
        <div
          className="flex-1 flex items-center gap-2 rounded-xl px-3 py-2"
          style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}
        >
          <Search size={15} style={{ color: 'var(--text-secondary)' }} />
          <input
            type="text"
            placeholder="Rechercher…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-transparent text-sm outline-none"
            style={{ color: 'var(--text-primary)' }}
          />
        </div>
        <button
          onClick={() => setShowFavOnly(!showFavOnly)}
          className="px-3 py-2 rounded-xl transition-all"
          style={{
            background: showFavOnly ? 'rgba(234,179,8,0.2)' : 'var(--bg-secondary)',
            border: `1px solid ${showFavOnly ? '#ca8a04' : 'var(--border)'}`,
          }}
        >
          <Star size={16} className={showFavOnly ? 'text-yellow-400' : 'text-slate-500'} />
        </button>
      </div>

      {/* Liste */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 gap-4 text-center">
          <p className="text-5xl">📐</p>
          <h2 className="font-bold" style={{ color: 'var(--text-primary)' }}>
            {state.plans.length === 0 ? 'Aucun plan encore' : 'Aucun résultat'}
          </h2>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            {state.plans.length === 0
              ? 'Utilisez le Générateur pour créer votre premier circuit !'
              : 'Modifiez votre recherche.'}
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((plan) => (
            <div key={plan.id} className="card p-4 animate-slide-up">
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="min-w-0">
                  <h3 className="font-bold text-sm truncate" style={{ color: 'var(--text-primary)' }}>
                    {plan.name}
                  </h3>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>
                    {formatDate(plan.createdAt)}
                  </p>
                </div>
                <div className="flex items-center gap-1.5">
                  {plan.isFavorite && <Star size={14} className="text-yellow-400 fill-yellow-400" />}
                  <span
                    className="text-xs px-2 py-0.5 rounded-full font-medium text-white"
                    style={{ background: DIFF_COLOR[plan.difficulty] }}
                  >
                    {plan.difficulty}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-4 mb-3">
                <span className="flex items-center gap-1 text-xs" style={{ color: 'var(--text-secondary)' }}>
                  <BarChart2 size={12} /> {plan.steps.length} étapes
                </span>
                <span className="flex items-center gap-1 text-xs" style={{ color: 'var(--text-secondary)' }}>
                  <Clock size={12} /> ~{plan.estimatedTime} min
                </span>
                {plan.validationResult && (
                  <span
                    className="text-xs px-2 py-0.5 rounded-full"
                    style={{
                      background: plan.validationResult.score >= 80 ? 'rgba(16,185,129,0.15)' : 'rgba(245,158,11,0.15)',
                      color: plan.validationResult.score >= 80 ? '#10b981' : '#f59e0b',
                    }}
                  >
                    Score {plan.validationResult.score}/100
                  </span>
                )}
              </div>

              {plan.tags.length > 0 && (
                <div className="flex gap-1 flex-wrap mb-3">
                  {plan.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs px-2 py-0.5 rounded-full"
                      style={{ background: 'var(--bg-secondary)', color: 'var(--text-secondary)' }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              <div className="flex gap-2">
                <button
                  onClick={() => setViewing(plan)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-sm font-medium text-white"
                  style={{ background: 'var(--accent)' }}
                >
                  <Eye size={15} /> Voir les étapes
                </button>
                <button
                  onClick={() => dispatch({ type: 'TOGGLE_PLAN_FAVORITE', planId: plan.id })}
                  className="px-3 py-2 rounded-xl"
                  style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}
                >
                  {plan.isFavorite
                    ? <StarOff size={16} style={{ color: 'var(--text-secondary)' }} />
                    : <Star size={16} className="text-yellow-400" />}
                </button>
                <button
                  onClick={() => dispatch({ type: 'DELETE_PLAN', planId: plan.id })}
                  className="px-3 py-2 rounded-xl"
                  style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}
                >
                  <Trash2 size={16} className="text-red-400" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
