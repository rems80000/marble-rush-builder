import { useState, useMemo } from 'react'
import { Search, Filter, Plus, Minus, AlertTriangle } from 'lucide-react'
import { useStore } from '../store/useStore'
import type { PieceType, InventoryEntry } from '../types'
import PieceImage from '../components/PieceImage'

const TYPE_LABELS: Record<PieceType, string> = {
  'base': 'Bases', 'block': 'Blocs', 'rail-straight': 'Rails droits',
  'rail-curved': 'Rails courbes', 'turn': 'Virages', 'spiral': 'Spirales',
  'elevator': 'Ascenseurs', 'launcher': 'Lanceurs', 'train-track': 'Rails train',
  'train-car': 'Wagons', 'funnel': 'Tunnels/Arrivées', 'flipper': 'Flippers',
  'cannon': 'Canons', 'decoration': 'Décors', 'marble': 'Billes',
  'connector': 'Connecteurs', 'special': 'Modules spéciaux',
}

const PIECE_TYPES: PieceType[] = [
  'base', 'block', 'rail-straight', 'rail-curved', 'turn', 'spiral',
  'elevator', 'launcher', 'train-track', 'train-car', 'funnel',
  'flipper', 'cannon', 'marble', 'special', 'decoration', 'connector',
]

type ViewMode = 'merged' | 'by-set'

export default function Inventory() {
  const { state, dispatch } = useStore()
  const [view, setView] = useState<ViewMode>('merged')
  const [search, setSearch] = useState('')
  const [filterType, setFilterType] = useState<PieceType | 'all'>('all')
  const [selectedSetId, setSelectedSetId] = useState<string | null>(null)

  const activeSets = state.sets.filter((s) => s.owned && s.active)

  // ── Vue fusionnée ────────────────────────────────────────────────────────

  const inventory = useMemo<InventoryEntry[]>(() => {
    const map = new Map<string, InventoryEntry>()
    for (const set of activeSets) {
      for (const piece of set.pieces) {
        const existing = map.get(piece.code)
        if (existing) {
          existing.totalQuantity += piece.quantity
          existing.bySet.push({ setId: set.id, setName: set.name, quantity: piece.quantity })
        } else {
          map.set(piece.code, {
            pieceId: piece.id,
            code: piece.code,
            name: piece.name,
            type: piece.type,
            color: piece.color,
            totalQuantity: piece.quantity,
            bySet: [{ setId: set.id, setName: set.name, quantity: piece.quantity }],
            emoji: piece.emoji,
          })
        }
      }
    }
    return Array.from(map.values()).sort((a, b) => a.code.localeCompare(b.code))
  }, [activeSets])

  const filteredMerged = inventory.filter((e) => {
    const matchSearch =
      e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.code.toLowerCase().includes(search.toLowerCase())
    const matchType = filterType === 'all' || e.type === filterType
    return matchSearch && matchType
  })

  // ── Vue par set ──────────────────────────────────────────────────────────

  const currentSet = selectedSetId ? activeSets.find((s) => s.id === selectedSetId) : activeSets[0]

  const filteredBySet = (currentSet?.pieces ?? []).filter((p) => {
    const matchSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.code.toLowerCase().includes(search.toLowerCase())
    const matchType = filterType === 'all' || p.type === filterType
    return matchSearch && matchType
  })

  // ── Stats ────────────────────────────────────────────────────────────────

  const totalPieces = inventory.reduce((n, e) => n + e.totalQuantity, 0)
  const zeroPieces = inventory.filter((e) => e.totalQuantity === 0).length
  const pieceTypes = new Set(inventory.map((e) => e.type)).size

  if (activeSets.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 px-6 text-center">
        <p className="text-5xl">📦</p>
        <h2 className="font-bold text-lg" style={{ color: 'var(--text-primary)' }}>Aucun set actif</h2>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          Active au moins un set dans «&nbsp;Mes Sets&nbsp;» pour voir l'inventaire.
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4 pb-6 px-4">
      {/* En-tête */}
      <div className="pt-5">
        <h1 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>Inventaire 🗃️</h1>
        <p className="text-sm mt-0.5" style={{ color: 'var(--text-secondary)' }}>
          {activeSets.length} set(s) actif(s) · {pieceTypes} types · {totalPieces} pièces
          {zeroPieces > 0 && (
            <span className="ml-2 text-amber-400">⚠️ {zeroPieces} à zéro</span>
          )}
        </p>
      </div>

      {/* Barre résumé quantités */}
      <div className="grid grid-cols-3 gap-2">
        {[
          { label: 'Pièces totales', value: totalPieces, color: 'var(--accent)' },
          { label: 'Types distincts', value: pieceTypes, color: 'var(--accent2)' },
          { label: 'Quantité zéro', value: zeroPieces, color: zeroPieces > 0 ? '#f59e0b' : '#10b981' },
        ].map(({ label, value, color }) => (
          <div key={label} className="card p-3 text-center">
            <p className="text-2xl font-bold" style={{ color }}>{value}</p>
            <p className="text-[10px] mt-0.5" style={{ color: 'var(--text-secondary)' }}>{label}</p>
          </div>
        ))}
      </div>

      {/* Toggle vue */}
      <div className="flex rounded-xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
        {(['merged', 'by-set'] as ViewMode[]).map((v) => (
          <button
            key={v}
            onClick={() => setView(v)}
            className="flex-1 py-2.5 text-sm font-medium transition-colors"
            style={{
              background: view === v ? 'var(--accent)' : 'var(--bg-secondary)',
              color: view === v ? 'white' : 'var(--text-secondary)',
            }}
          >
            {v === 'merged' ? '🔀 Vue fusionnée' : '📦 Par set'}
          </button>
        ))}
      </div>

      {/* Sélecteur de set (vue par set) */}
      {view === 'by-set' && activeSets.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {activeSets.map((s) => (
            <button
              key={s.id}
              onClick={() => setSelectedSetId(s.id)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap flex-shrink-0"
              style={{
                background: (selectedSetId ?? activeSets[0]?.id) === s.id ? 'var(--accent)' : 'var(--bg-secondary)',
                color: (selectedSetId ?? activeSets[0]?.id) === s.id ? 'white' : 'var(--text-secondary)',
                border: '1px solid var(--border)',
              }}
            >
              {s.coverEmoji} {s.name.split(' ').slice(0, 3).join(' ')}
            </button>
          ))}
        </div>
      )}

      {/* Recherche */}
      <div className="flex items-center gap-2 rounded-xl px-3 py-3" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
        <Search size={16} style={{ color: 'var(--text-secondary)' }} />
        <input
          type="text"
          placeholder="Code (B-01, T-04…) ou nom…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 bg-transparent text-sm outline-none"
          style={{ color: 'var(--text-primary)' }}
        />
        {search && (
          <button onClick={() => setSearch('')} style={{ color: 'var(--text-secondary)' }}>✕</button>
        )}
      </div>

      {/* Filtres par type */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => setFilterType('all')}
          className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap flex-shrink-0"
          style={{
            background: filterType === 'all' ? 'var(--accent)' : 'var(--bg-secondary)',
            color: filterType === 'all' ? 'white' : 'var(--text-secondary)',
            border: '1px solid var(--border)',
          }}
        >
          <Filter size={11} /> Tous
        </button>
        {PIECE_TYPES.filter((t) => inventory.some((e) => e.type === t)).map((t) => (
          <button
            key={t}
            onClick={() => setFilterType(filterType === t ? 'all' : t)}
            className="px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap flex-shrink-0"
            style={{
              background: filterType === t ? 'var(--accent)' : 'var(--bg-secondary)',
              color: filterType === t ? 'white' : 'var(--text-secondary)',
              border: '1px solid var(--border)',
            }}
          >
            {TYPE_LABELS[t]}
          </button>
        ))}
      </div>

      {/* ── Vue fusionnée ──────────────────────────────────────────────────── */}
      {view === 'merged' && (
        <div className="flex flex-col gap-2">
          {filteredMerged.length === 0 ? (
            <p className="text-center py-8 text-sm" style={{ color: 'var(--text-secondary)' }}>Aucune pièce trouvée.</p>
          ) : (
            filteredMerged.map((entry) => (
              <div
                key={entry.code}
                className="card p-3 flex items-center gap-3"
                style={entry.totalQuantity === 0 ? { borderColor: '#f59e0b' } : {}}
              >
                <PieceImage code={entry.code} color={entry.color} emoji={entry.emoji} size={44} alt={entry.name} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                    {entry.code} — {entry.name}
                  </p>
                  <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                    {TYPE_LABELS[entry.type]}
                    {entry.bySet.length > 1 && ` · ${entry.bySet.map(s => s.setName.split(' ').slice(-1)[0]).join(', ')}`}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  {entry.totalQuantity === 0 && (
                    <AlertTriangle size={14} className="text-amber-400 mr-1" />
                  )}
                  <span
                    className="text-xl font-bold min-w-[2rem] text-center"
                    style={{ color: entry.totalQuantity === 0 ? '#f59e0b' : 'var(--accent2)' }}
                  >
                    {entry.totalQuantity}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* ── Vue par set ────────────────────────────────────────────────────── */}
      {view === 'by-set' && currentSet && (
        <div className="flex flex-col gap-2">
          <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--text-secondary)' }}>
            {currentSet.coverEmoji} {currentSet.name} — {filteredBySet.length} type(s)
          </p>
          {filteredBySet.length === 0 ? (
            <p className="text-center py-8 text-sm" style={{ color: 'var(--text-secondary)' }}>Aucune pièce trouvée.</p>
          ) : (
            filteredBySet.map((piece) => (
              <div
                key={piece.id}
                className="card p-3 flex items-center gap-3"
                style={piece.quantity === 0 ? { borderColor: '#f59e0b' } : {}}
              >
                <PieceImage code={piece.code} color={piece.color} emoji={piece.emoji} size={44} alt={piece.name} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate" style={{ color: 'var(--text-primary)' }}>
                    {piece.code} — {piece.name}
                  </p>
                  <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                    {TYPE_LABELS[piece.type]}
                    {piece.function && ` · ${piece.function}`}
                  </p>
                </div>
                {/* Boutons +/- */}
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => dispatch({ type: 'UPDATE_PIECE_QUANTITY', setId: currentSet.id, pieceId: piece.id, delta: -1 })}
                    disabled={piece.quantity === 0}
                    className="w-9 h-9 rounded-xl flex items-center justify-center disabled:opacity-30 transition-colors"
                    style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}
                  >
                    <Minus size={14} style={{ color: 'var(--text-primary)' }} />
                  </button>
                  <span
                    className="text-lg font-bold min-w-[2rem] text-center"
                    style={{ color: piece.quantity === 0 ? '#f59e0b' : 'var(--accent2)' }}
                  >
                    {piece.quantity}
                  </span>
                  <button
                    onClick={() => dispatch({ type: 'UPDATE_PIECE_QUANTITY', setId: currentSet.id, pieceId: piece.id, delta: 1 })}
                    className="w-9 h-9 rounded-xl flex items-center justify-center transition-colors"
                    style={{ background: 'var(--accent)', border: 'none' }}
                  >
                    <Plus size={14} className="text-white" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}
