import { useState } from 'react'
import { Plus, Search, X, CheckCircle2, Circle, ChevronRight, ClipboardList } from 'lucide-react'
import { useStore } from '../store/useStore'
import PieceCard from '../components/PieceCard'
import type { MarbleSet, MarblePiece, PieceType, PieceColor } from '../types'
import { generateId } from '../utils/storage'

// ─── Saisie rapide ────────────────────────────────────────────────────────────

function guessType(code: string): PieceType {
  const prefix = code.split('-')[0]?.toUpperCase() ?? ''
  if (prefix === 'P') return 'base'
  if (prefix === 'B') return 'block'
  if (prefix === 'M') {
    if (code === 'M-03') return 'elevator'
    if (code === 'M-04') return 'train-car'
    if (code === 'M-07') return 'cannon'
    return 'special'
  }
  if (prefix === 'T') {
    if (['T-01', 'T-26'].includes(code)) return 'launcher'
    if (['T-06'].includes(code)) return 'rail-curved'
    if (['T-07', 'T-27', 'T-42'].includes(code)) return 'funnel'
    if (['T-10'].includes(code)) return 'flipper'
    if (['T-17'].includes(code)) return 'spiral'
    if (['T-24', 'T-25'].includes(code)) return 'train-track'
    if (['T-14'].includes(code)) return 'connector'
    if (['T-23'].includes(code)) return 'special'
    return 'rail-straight'
  }
  if (code.toUpperCase().includes('MARBLE') || prefix === 'MRB') return 'marble'
  return 'special'
}

function guessColor(code: string): PieceColor {
  const prefix = code.split('-')[0]?.toUpperCase() ?? ''
  if (prefix === 'P') return 'green'
  if (prefix === 'B') return 'blue'
  if (code === 'M-03') return 'cyan'
  if (code === 'M-04') return 'red'
  if (code === 'M-07' || code === 'T-10') return 'orange'
  if (code === 'T-01' || code === 'T-26') return 'yellow'
  if (code === 'T-17') return 'purple'
  if (code === 'T-27') return 'red'
  if (code === 'T-24' || code === 'T-25') return 'gray'
  if (prefix === 'T') return 'blue'
  if (prefix === 'M') return 'yellow'
  return 'gray'
}

function guessEmoji(code: string): string {
  const t = guessType(code)
  const map: Record<string, string> = {
    base: '🟩', block: '🔵', 'rail-straight': '➖', 'rail-curved': '↪️',
    turn: '🔄', spiral: '🌀', elevator: '⬆️', launcher: '🚀',
    'train-track': '🛤️', 'train-car': '🚃', funnel: '🕳️', flipper: '🔀',
    cannon: '💥', decoration: '✨', marble: '⚪', connector: '🔗', special: '⚙️',
  }
  if (code === 'T-27') return '🏁'
  if (code === 'T-26') return '🚉'
  return map[t] ?? '🔷'
}

interface ParsedEntry { code: string; qty: number }

function parseQuickEntry(text: string): ParsedEntry[] {
  const results: ParsedEntry[] = []
  const regex = /([A-Z]{1,3}-\d{2,3}(?:\/[A-Z]{1,3}-\d{2,3})?|MARBLE)\s*[xX×]?\s*(\d+)/gi
  let match: RegExpExecArray | null
  while ((match = regex.exec(text)) !== null) {
    const code = match[1]!.toUpperCase().split('/')[0]!.trim()
    const qty = parseInt(match[2]!)
    if (!isNaN(qty) && qty > 0) results.push({ code, qty })
  }
  return results
}

// ─── Composant QuickEntry ─────────────────────────────────────────────────────

function QuickEntry({ set, onClose }: { set: MarbleSet; onClose: () => void }) {
  const { dispatch } = useStore()
  const [text, setText] = useState('')
  const [preview, setPreview] = useState<ParsedEntry[]>([])
  const [applied, setApplied] = useState(false)

  function handleParse() {
    setPreview(parseQuickEntry(text))
    setApplied(false)
  }

  function handleApply() {
    const updatedPieces = [...set.pieces]
    for (const entry of preview) {
      const existing = updatedPieces.find((p) => p.code === entry.code)
      if (existing) {
        existing.quantity = entry.qty
      } else {
        const newPiece: MarblePiece = {
          id: generateId(),
          setId: set.id,
          name: `Pièce ${entry.code}`,
          code: entry.code,
          type: guessType(entry.code),
          color: guessColor(entry.code),
          quantity: entry.qty,
          emoji: guessEmoji(entry.code),
        }
        updatedPieces.push(newPiece)
      }
    }
    dispatch({ type: 'UPDATE_SET', set: { ...set, pieces: updatedPieces } })
    setApplied(true)
  }

  return (
    <div className="card p-4 animate-bounce-in">
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>
          📋 Saisie rapide depuis notice
        </h2>
        <button onClick={onClose}><X size={18} style={{ color: 'var(--text-secondary)' }} /></button>
      </div>

      <p className="text-xs mb-2" style={{ color: 'var(--text-secondary)' }}>
        Collez votre liste (codes + quantités). Formats acceptés :<br />
        <code className="text-violet-400">B-01 x31</code> &nbsp;·&nbsp;
        <code className="text-violet-400">T-04 5</code> &nbsp;·&nbsp;
        <code className="text-violet-400">M-03 x1, T-27 x1</code>
      </p>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={8}
        placeholder={"B-01 x31\nB-02 x11\nT-04 x5\nM-03 x1\n..."}
        className="w-full rounded-xl px-3 py-2 text-sm font-mono resize-none outline-none"
        style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)', border: '1px solid var(--border)' }}
      />

      <button onClick={handleParse} disabled={!text.trim()} className="w-full mt-3 btn-primary py-3 text-sm disabled:opacity-40">
        Analyser la liste
      </button>

      {preview.length > 0 && (
        <div className="mt-3">
          <p className="text-xs font-semibold mb-2" style={{ color: 'var(--text-secondary)' }}>
            {preview.length} pièces détectées :
          </p>
          <div className="max-h-48 overflow-y-auto flex flex-col gap-1">
            {preview.map((e, i) => {
              const existing = set.pieces.find((p) => p.code === e.code)
              return (
                <div key={i} className="flex items-center justify-between rounded-lg px-3 py-1.5 text-sm"
                  style={{ background: 'var(--bg-secondary)' }}>
                  <span className="font-mono font-bold text-violet-400">{e.code}</span>
                  <span style={{ color: 'var(--text-secondary)' }}>
                    {existing ? `${existing.quantity} → ` : '(nouveau) '}
                    <span className="text-emerald-400 font-bold">{e.qty}</span>
                  </span>
                </div>
              )
            })}
          </div>

          {!applied ? (
            <button onClick={handleApply} className="w-full mt-3 btn-primary py-3 text-sm" style={{ background: '#10b981' }}>
              ✅ Appliquer les quantités
            </button>
          ) : (
            <div className="flex items-center justify-center gap-2 mt-3 py-3 rounded-xl text-sm text-emerald-400"
              style={{ background: 'rgba(16,185,129,0.1)' }}>
              <CheckCircle2 size={16} /> Quantités appliquées !
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ─── Page principale ──────────────────────────────────────────────────────────

export default function MySets() {
  const { state, dispatch } = useStore()
  const [search, setSearch] = useState('')
  const [selectedSetId, setSelectedSetId] = useState<string | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [showQuickEntry, setShowQuickEntry] = useState(false)
  const [filterOwned, setFilterOwned] = useState<'all' | 'owned' | 'active'>('all')
  const [newName, setNewName] = useState('')
  const [newRef, setNewRef] = useState('')
  const [newEmoji, setNewEmoji] = useState('📦')

  const filtered = state.sets.filter((s) => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.reference.toLowerCase().includes(search.toLowerCase())
    const matchOwned =
      filterOwned === 'all' ? true :
      filterOwned === 'owned' ? s.owned :
      s.owned && s.active
    return matchSearch && matchOwned
  })

  const selectedSet = selectedSetId ? state.sets.find((s) => s.id === selectedSetId) : null

  function handleAddSet() {
    if (!newName.trim()) return
    const set: MarbleSet = {
      id: generateId(),
      name: newName.trim(),
      reference: newRef.trim() || '—',
      owned: true,
      active: true,
      coverEmoji: newEmoji,
      pieces: [],
    }
    dispatch({ type: 'ADD_SET', set })
    setNewName('')
    setNewRef('')
    setNewEmoji('📦')
    setShowAddForm(false)
    setSelectedSetId(set.id)
  }

  // ── Vue détail d'un set ──────────────────────────────────────────────────

  if (selectedSet) {
    return (
      <div className="flex flex-col gap-4 pb-6 px-4">
        <button onClick={() => { setSelectedSetId(null); setShowQuickEntry(false) }}
          className="flex items-center gap-2 text-sm mt-4" style={{ color: 'var(--text-secondary)' }}>
          ← Retour aux sets
        </button>

        <div className="flex items-center gap-3">
          <span className="text-4xl">{selectedSet.coverEmoji ?? '📦'}</span>
          <div className="flex-1">
            <h1 className="font-bold text-lg leading-tight" style={{ color: 'var(--text-primary)' }}>
              {selectedSet.name}
            </h1>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              {selectedSet.reference} · {selectedSet.pieces.length} types · {selectedSet.pieces.reduce((n, p) => n + p.quantity, 0)} pièces
            </p>
          </div>
          <button
            onClick={() => dispatch({ type: 'TOGGLE_SET_ACTIVE', setId: selectedSet.id })}
            className="flex flex-col items-center gap-0.5"
            style={{ color: selectedSet.active ? '#10b981' : 'var(--text-secondary)' }}
          >
            {selectedSet.active ? <CheckCircle2 size={22} /> : <Circle size={22} />}
            <span className="text-[10px]">{selectedSet.active ? 'Actif' : 'Inactif'}</span>
          </button>
        </div>

        {/* Actions set */}
        <div className="flex gap-2">
          <button
            onClick={() => setShowQuickEntry(!showQuickEntry)}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold"
            style={{
              background: showQuickEntry ? 'var(--accent)' : 'var(--bg-secondary)',
              color: showQuickEntry ? 'white' : 'var(--text-primary)',
              border: '1px solid var(--border)',
            }}
          >
            <ClipboardList size={16} /> Saisie rapide
          </button>
          <button
            onClick={() => dispatch({ type: 'DELETE_SET', setId: selectedSet.id })}
            className="px-4 py-3 rounded-xl text-sm font-semibold text-red-400"
            style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)' }}
          >
            Supprimer
          </button>
        </div>

        {showQuickEntry && (
          <QuickEntry set={selectedSet} onClose={() => setShowQuickEntry(false)} />
        )}

        <div className="flex flex-col gap-2">
          {selectedSet.pieces.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-4xl mb-2">🗒️</p>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                Aucune pièce. Utilisez la saisie rapide ci-dessus pour importer votre liste.
              </p>
            </div>
          ) : (
            selectedSet.pieces.map((piece) => <PieceCard key={piece.id} piece={piece} />)
          )}
        </div>
      </div>
    )
  }

  // ── Liste des sets ────────────────────────────────────────────────────────

  return (
    <div className="flex flex-col gap-4 pb-6 px-4">
      <div className="flex items-center justify-between pt-5">
        <h1 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>Mes Sets 📦</h1>
        <button onClick={() => setShowAddForm(true)} className="btn-primary flex items-center gap-1 text-sm px-3 py-2">
          <Plus size={16} /> Ajouter
        </button>
      </div>

      {showAddForm && (
        <div className="card p-4 animate-bounce-in">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold" style={{ color: 'var(--text-primary)' }}>Nouveau set</h2>
            <button onClick={() => setShowAddForm(false)}><X size={18} style={{ color: 'var(--text-secondary)' }} /></button>
          </div>
          <div className="flex flex-col gap-3">
            <div className="flex gap-2">
              <input type="text" value={newEmoji} onChange={(e) => setNewEmoji(e.target.value)} placeholder="Emoji"
                className="w-14 text-center rounded-xl px-2 py-3 text-lg"
                style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)', border: '1px solid var(--border)' }} />
              <input type="text" value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Nom du set"
                className="flex-1 rounded-xl px-3 py-3 text-sm"
                style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)', border: '1px solid var(--border)' }} />
            </div>
            <input type="text" value={newRef} onChange={(e) => setNewRef(e.target.value)} placeholder="Référence (ex: 80-186000)"
              className="rounded-xl px-3 py-3 text-sm"
              style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)', border: '1px solid var(--border)' }} />
            <button onClick={handleAddSet} className="btn-primary text-sm py-3">Créer le set</button>
          </div>
        </div>
      )}

      {/* Recherche */}
      <div className="flex items-center gap-2 rounded-xl px-3 py-3" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
        <Search size={16} style={{ color: 'var(--text-secondary)' }} />
        <input type="text" placeholder="Rechercher un set…" value={search} onChange={(e) => setSearch(e.target.value)}
          className="flex-1 bg-transparent text-sm outline-none" style={{ color: 'var(--text-primary)' }} />
      </div>

      {/* Filtres */}
      <div className="flex gap-2">
        {(['all', 'owned', 'active'] as const).map((f) => (
          <button key={f} onClick={() => setFilterOwned(f)}
            className="flex-1 py-2 rounded-xl text-xs font-medium transition-all"
            style={{
              background: filterOwned === f ? 'var(--accent)' : 'var(--bg-secondary)',
              color: filterOwned === f ? 'white' : 'var(--text-secondary)',
              border: '1px solid var(--border)',
            }}>
            {f === 'all' ? `Tous (${state.sets.length})` : f === 'owned' ? `Possédés (${state.sets.filter(s => s.owned).length})` : `Actifs (${state.sets.filter(s => s.owned && s.active).length})`}
          </button>
        ))}
      </div>

      {/* Liste */}
      <div className="flex flex-col gap-3">
        {filtered.length === 0 ? (
          <p className="text-center py-8 text-sm" style={{ color: 'var(--text-secondary)' }}>Aucun set trouvé.</p>
        ) : (
          filtered.map((set) => (
            <div key={set.id} className="card p-4 animate-slide-up" style={set.active ? { borderColor: 'var(--accent)' } : {}}>
              <div className="flex items-start gap-3">
                <div className="w-14 h-14 rounded-xl flex items-center justify-center text-3xl flex-shrink-0"
                  style={{ background: set.active ? 'var(--accent)' : 'var(--bg-secondary)' }}>
                  {set.coverEmoji ?? '📦'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-bold text-sm leading-tight" style={{ color: 'var(--text-primary)' }}>{set.name}</h3>
                    {set.owned ? (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-medium flex-shrink-0">Possédé</span>
                    ) : (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-slate-500/20 text-slate-400 font-medium flex-shrink-0">Catalogue</span>
                    )}
                  </div>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>
                    {set.reference}{set.year ? ` · ${set.year}` : ''}
                  </p>
                  <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
                    {set.pieces.reduce((n, p) => n + p.quantity, 0)} pièces · {set.pieces.length} types
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-3 pt-3" style={{ borderTop: '1px solid var(--border)' }}>
                {set.owned && (
                  <button onClick={() => dispatch({ type: 'TOGGLE_SET_ACTIVE', setId: set.id })}
                    className="flex items-center gap-1.5 text-sm font-medium transition-colors"
                    style={{ color: set.active ? '#10b981' : 'var(--text-secondary)' }}>
                    {set.active ? <CheckCircle2 size={16} className="text-emerald-400" /> : <Circle size={16} />}
                    {set.active ? 'Actif' : 'Activer'}
                  </button>
                )}
                <button onClick={() => setSelectedSetId(set.id)}
                  className="ml-auto flex items-center gap-1 text-sm font-semibold py-2 px-3 rounded-xl"
                  style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>
                  Voir les pièces <ChevronRight size={14} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
