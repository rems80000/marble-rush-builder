import { useState, useRef } from 'react'
import { Plus, Trash2, Star, StarOff, X, Camera } from 'lucide-react'
import { useStore } from '../store/useStore'
import type { HistoryEntry, Difficulty } from '../types'
import { generateId, formatDate } from '../utils/storage'

const DIFF_LABELS: Record<Difficulty, string> = { easy: '🟢 Facile', medium: '🟡 Moyen', hard: '🔴 Difficile' }
const DIFF_COLOR: Record<Difficulty, string> = { easy: '#10b981', medium: '#f59e0b', hard: '#ef4444' }
const RATINGS = [1, 2, 3, 4, 5] as const

// ─── Formulaire ajout / édition ───────────────────────────────────────────────

function EntryForm({
  initial,
  onSave,
  onCancel,
  sets,
}: {
  initial?: Partial<HistoryEntry>
  onSave: (entry: HistoryEntry) => void
  onCancel: () => void
  sets: ReturnType<typeof useStore>['state']['sets']
}) {
  const [name, setName] = useState(initial?.planName ?? '')
  const [date, setDate] = useState(initial?.builtAt?.slice(0, 10) ?? new Date().toISOString().slice(0, 10))
  const [notes, setNotes] = useState(initial?.notes ?? '')
  const [difficulty, setDifficulty] = useState<Difficulty>(initial?.perceivedDifficulty ?? 'easy')
  const [rating, setRating] = useState<1|2|3|4|5>(initial?.rating ?? 3)
  const [usedSetIds, setUsedSetIds] = useState<string[]>(initial?.usedSetIds ?? [])
  const [photoUrl, setPhotoUrl] = useState<string | undefined>(initial?.photoUrl)
  const fileRef = useRef<HTMLInputElement>(null)

  function toggleSet(id: string) {
    setUsedSetIds((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id])
  }

  function handlePhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => setPhotoUrl(ev.target?.result as string)
    reader.readAsDataURL(file)
  }

  function handleSave() {
    if (!name.trim()) return
    onSave({
      id: initial?.id ?? generateId(),
      planId: initial?.planId ?? '',
      planName: name.trim(),
      builtAt: new Date(date).toISOString(),
      notes: notes.trim() || undefined,
      perceivedDifficulty: difficulty,
      rating,
      usedSetIds,
      photoUrl,
      isFavorite: initial?.isFavorite ?? false,
    })
  }

  const ownedSets = sets.filter((s) => s.owned)

  return (
    <div className="card p-4 animate-bounce-in">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-bold text-base" style={{ color: 'var(--text-primary)' }}>
          {initial?.id ? '✏️ Modifier le circuit' : '➕ Nouveau circuit construit'}
        </h2>
        <button onClick={onCancel}><X size={18} style={{ color: 'var(--text-secondary)' }} /></button>
      </div>

      <div className="flex flex-col gap-4">
        {/* Nom */}
        <div>
          <label className="text-xs font-semibold uppercase tracking-wide block mb-1" style={{ color: 'var(--text-secondary)' }}>Nom du circuit *</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ex : Grand circuit du salon"
            className="w-full rounded-xl px-3 py-3 text-sm"
            style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)', border: '1px solid var(--border)' }} />
        </div>

        {/* Date */}
        <div>
          <label className="text-xs font-semibold uppercase tracking-wide block mb-1" style={{ color: 'var(--text-secondary)' }}>Date de construction</label>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)}
            className="w-full rounded-xl px-3 py-3 text-sm"
            style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)', border: '1px solid var(--border)' }} />
        </div>

        {/* Difficulté ressentie */}
        <div>
          <label className="text-xs font-semibold uppercase tracking-wide block mb-2" style={{ color: 'var(--text-secondary)' }}>Difficulté ressentie</label>
          <div className="flex gap-2">
            {(['easy', 'medium', 'hard'] as Difficulty[]).map((d) => (
              <button key={d} onClick={() => setDifficulty(d)}
                className="flex-1 py-2.5 rounded-xl text-sm font-medium transition-all"
                style={{
                  background: difficulty === d ? DIFF_COLOR[d] : 'var(--bg-secondary)',
                  color: difficulty === d ? 'white' : 'var(--text-secondary)',
                  border: '1px solid var(--border)',
                }}>
                {DIFF_LABELS[d]}
              </button>
            ))}
          </div>
        </div>

        {/* Note / étoiles */}
        <div>
          <label className="text-xs font-semibold uppercase tracking-wide block mb-2" style={{ color: 'var(--text-secondary)' }}>Note plaisir</label>
          <div className="flex gap-2">
            {RATINGS.map((r) => (
              <button key={r} onClick={() => setRating(r)}
                className="flex-1 py-2.5 rounded-xl text-xl transition-all"
                style={{ background: r <= rating ? 'rgba(234,179,8,0.2)' : 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
                {r <= rating ? '⭐' : '☆'}
              </button>
            ))}
          </div>
        </div>

        {/* Sets utilisés */}
        {ownedSets.length > 0 && (
          <div>
            <label className="text-xs font-semibold uppercase tracking-wide block mb-2" style={{ color: 'var(--text-secondary)' }}>Sets utilisés</label>
            <div className="flex flex-col gap-1.5">
              {ownedSets.map((s) => (
                <button key={s.id} onClick={() => toggleSet(s.id)}
                  className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm text-left"
                  style={{
                    background: usedSetIds.includes(s.id) ? 'rgba(124,58,237,0.2)' : 'var(--bg-secondary)',
                    border: `1px solid ${usedSetIds.includes(s.id) ? 'var(--accent)' : 'var(--border)'}`,
                    color: 'var(--text-primary)',
                  }}>
                  <span>{s.coverEmoji ?? '📦'}</span>
                  <span className="flex-1 text-sm">{s.name}</span>
                  {usedSetIds.includes(s.id) && <span className="text-violet-400">✓</span>}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Notes */}
        <div>
          <label className="text-xs font-semibold uppercase tracking-wide block mb-1" style={{ color: 'var(--text-secondary)' }}>Notes / observations</label>
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3}
            placeholder="Ce qui a bien marché, ce qui était difficile…"
            className="w-full rounded-xl px-3 py-2 text-sm resize-none"
            style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)', border: '1px solid var(--border)' }} />
        </div>

        {/* Photo */}
        <div>
          <label className="text-xs font-semibold uppercase tracking-wide block mb-2" style={{ color: 'var(--text-secondary)' }}>Photo (optionnelle)</label>
          {photoUrl ? (
            <div className="relative">
              <img src={photoUrl} alt="Circuit" className="w-full rounded-xl object-cover max-h-48" />
              <button onClick={() => setPhotoUrl(undefined)}
                className="absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center"
                style={{ background: 'rgba(0,0,0,0.6)' }}>
                <X size={14} className="text-white" />
              </button>
            </div>
          ) : (
            <button onClick={() => fileRef.current?.click()}
              className="w-full py-4 rounded-xl flex items-center justify-center gap-2 text-sm"
              style={{ background: 'var(--bg-secondary)', border: '1px dashed var(--border)', color: 'var(--text-secondary)' }}>
              <Camera size={18} /> Ajouter une photo
            </button>
          )}
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handlePhoto} />
        </div>

        <button onClick={handleSave} disabled={!name.trim()}
          className="w-full py-4 rounded-xl font-bold text-white text-base disabled:opacity-40"
          style={{ background: 'var(--accent)' }}>
          {initial?.id ? '✅ Enregistrer les modifications' : '🏆 Enregistrer ce circuit'}
        </button>
      </div>
    </div>
  )
}

// ─── Page principale ──────────────────────────────────────────────────────────

export default function BuiltCircuits() {
  const { state, dispatch } = useStore()
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<HistoryEntry | null>(null)
  const [showFavOnly, setShowFavOnly] = useState(false)

  const entries = state.history
    .filter((h) => !showFavOnly || h.isFavorite)
    .sort((a, b) => new Date(b.builtAt).getTime() - new Date(a.builtAt).getTime())

  function handleSave(entry: HistoryEntry) {
    if (editing) {
      dispatch({ type: 'UPDATE_HISTORY', entry })
    } else {
      dispatch({ type: 'ADD_HISTORY', entry })
    }
    setShowForm(false)
    setEditing(null)
  }

  return (
    <div className="flex flex-col gap-4 pb-6 px-4">
      {/* En-tête */}
      <div className="flex items-center justify-between pt-5">
        <div>
          <h1 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>Mes circuits 🏆</h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--text-secondary)' }}>
            {state.history.length} circuit(s) construit(s)
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setShowFavOnly(!showFavOnly)} className="p-2 rounded-xl"
            style={{ background: showFavOnly ? 'rgba(234,179,8,0.2)' : 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
            <Star size={18} className={showFavOnly ? 'text-yellow-400 fill-yellow-400' : 'text-slate-500'} />
          </button>
          <button onClick={() => { setShowForm(!showForm); setEditing(null) }}
            className="btn-primary flex items-center gap-1 text-sm px-3 py-2">
            <Plus size={16} /> Ajouter
          </button>
        </div>
      </div>

      {/* Formulaire */}
      {(showForm || editing) && (
        <EntryForm
          initial={editing ?? undefined}
          onSave={handleSave}
          onCancel={() => { setShowForm(false); setEditing(null) }}
          sets={state.sets}
        />
      )}

      {/* Liste des circuits */}
      {entries.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 gap-4 text-center">
          <p className="text-6xl">🏆</p>
          <h2 className="font-bold text-lg" style={{ color: 'var(--text-primary)' }}>
            {state.history.length === 0 ? 'Aucun circuit enregistré' : 'Aucun favori'}
          </h2>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            {state.history.length === 0
              ? 'Construisez un circuit et notez-le ici pour vous en souvenir !'
              : 'Marquez des circuits comme favoris pour les retrouver vite.'}
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {entries.map((entry) => {
            const usedSets = state.sets.filter((s) => entry.usedSetIds?.includes(s.id))
            return (
              <div key={entry.id} className="card p-4 animate-slide-up">
                {/* Photo */}
                {entry.photoUrl && (
                  <img src={entry.photoUrl} alt={entry.planName}
                    className="w-full rounded-xl object-cover max-h-44 mb-3" />
                )}
                {/* Header */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-base leading-tight" style={{ color: 'var(--text-primary)' }}>
                      {entry.planName}
                    </h3>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>
                      {formatDate(entry.builtAt)}
                    </p>
                  </div>
                  <button onClick={() => dispatch({ type: 'TOGGLE_HISTORY_FAVORITE', entryId: entry.id })}>
                    {entry.isFavorite
                      ? <Star size={20} className="text-yellow-400 fill-yellow-400" />
                      : <StarOff size={20} style={{ color: 'var(--text-secondary)' }} />}
                  </button>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {entry.perceivedDifficulty && (
                    <span className="text-xs px-2 py-1 rounded-full font-medium text-white"
                      style={{ background: DIFF_COLOR[entry.perceivedDifficulty] }}>
                      {DIFF_LABELS[entry.perceivedDifficulty]}
                    </span>
                  )}
                  {entry.rating && (
                    <span className="text-xs px-2 py-1 rounded-full"
                      style={{ background: 'rgba(234,179,8,0.15)', color: '#ca8a04' }}>
                      {'⭐'.repeat(entry.rating)}
                    </span>
                  )}
                  {usedSets.map((s) => (
                    <span key={s.id} className="text-xs px-2 py-1 rounded-full"
                      style={{ background: 'var(--bg-secondary)', color: 'var(--text-secondary)' }}>
                      {s.coverEmoji} {s.name.split(' ').slice(0, 3).join(' ')}
                    </span>
                  ))}
                </div>

                {/* Notes */}
                {entry.notes && (
                  <p className="text-sm italic mb-3" style={{ color: 'var(--text-secondary)' }}>"{entry.notes}"</p>
                )}

                {/* Actions */}
                <div className="flex gap-2 pt-3" style={{ borderTop: '1px solid var(--border)' }}>
                  <button onClick={() => { setEditing(entry); setShowForm(false) }}
                    className="flex-1 py-2.5 rounded-xl text-sm font-medium"
                    style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)', border: '1px solid var(--border)' }}>
                    ✏️ Modifier
                  </button>
                  <button onClick={() => dispatch({ type: 'DELETE_HISTORY', entryId: entry.id })}
                    className="px-4 py-2.5 rounded-xl"
                    style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)' }}>
                    <Trash2 size={16} className="text-red-400" />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
