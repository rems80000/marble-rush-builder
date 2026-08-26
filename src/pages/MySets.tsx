import { useMemo, useState } from 'react'
import { ArrowLeft, Check, CheckCircle2, Circle, ExternalLink, Search, ShieldCheck, Upload } from 'lucide-react'
import { useStore } from '../store/useStore'
import PieceCard from '../components/PieceCard'
import type { MarblePiece, MarbleSet, PieceColor, PieceType } from '../types'
import { generateId } from '../utils/storage'

function classify(code: string): { type: PieceType; color: PieceColor } {
  if (code.startsWith('P-')) return { type: 'base', color: 'white' }
  if (code.startsWith('B-')) return { type: 'block', color: code === 'B-02' ? 'orange' : 'blue' }
  if (code === 'MARBLE') return { type: 'marble', color: 'mixed' }
  if (code.startsWith('T-')) return { type: code.includes('01') || code.includes('02') || code.includes('03') || code.includes('04') || code.includes('05') ? 'rail-curved' : 'rail-straight', color: 'mixed' }
  return { type: 'special', color: 'mixed' }
}

function parseNotice(text: string) {
  const entries: { code: string; quantity: number }[] = []
  const regex = /([A-Z]{1,3}-\d{2,3}(?:\/[A-Z]{1,3}-\d{2,3})?|MARBLES?)\s*[xX×]?\s*(\d+)/gi
  for (const match of text.matchAll(regex)) {
    entries.push({ code: match[1]!.toUpperCase().replace('MARBLES', 'MARBLE'), quantity: Number(match[2]) })
  }
  return entries
}

function NoticeEntry({ set, onDone }: { set: MarbleSet; onDone: () => void }) {
  const { dispatch } = useStore()
  const [text, setText] = useState('')
  const parsed = useMemo(() => parseNotice(text), [text])

  function apply() {
    const pieces = [...set.pieces]
    parsed.forEach(({ code, quantity }) => {
      const existing = pieces.find((piece) => piece.code === code)
      if (existing) existing.quantity = quantity
      else {
        const guessed = classify(code)
        const piece: MarblePiece = { id: generateId(), setId: set.id, code, name: `Pièce ${code}`, quantity, type: guessed.type, color: guessed.color, imageSource: 'missing', sourceSetIds: [set.reference] }
        pieces.push(piece)
      }
    })
    dispatch({ type: 'UPDATE_SET', set: { ...set, pieces, inventoryStatus: 'verified-photo' } })
    onDone()
  }

  return (
    <div className="card p-4">
      <h2 className="font-black" style={{ color: 'var(--text-primary)' }}>Relever la page COMPOSANTS</h2>
      <p className="mt-1 text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>Recopie ou colle les codes et quantités de la notice. Exemple : <strong>B-01 x14, T-04 x2</strong>.</p>
      <textarea value={text} onChange={(event) => setText(event.target.value)} rows={7} className="mt-3 w-full resize-none rounded-xl p-3 font-mono text-sm outline-none" style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)', border: '1px solid var(--border)' }} placeholder={'B-01 x14\nB-02 x13\nT-04 x2'} />
      <div className="mt-3 flex items-center justify-between gap-3">
        <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>{parsed.length} code(s) détecté(s)</span>
        <button onClick={apply} disabled={parsed.length === 0} className="flex min-h-11 items-center gap-2 rounded-xl bg-emerald-500 px-4 text-sm font-black text-white disabled:opacity-40"><Check size={18} /> Valider l’inventaire</button>
      </div>
    </div>
  )
}

export default function MySets() {
  const { state, dispatch } = useStore()
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [showEntry, setShowEntry] = useState(false)
  const owned = state.sets.filter((set) => set.owned)
  const selected = owned.find((set) => set.id === selectedId)

  if (selected) {
    const count = selected.pieces.reduce((sum, piece) => sum + piece.quantity, 0)
    const verified = selected.inventoryStatus === 'verified-photo'
    return (
      <div className="mx-auto flex max-w-3xl flex-col gap-4 px-4 pb-24 pt-4">
        <button onClick={() => { setSelectedId(null); setShowEntry(false) }} className="flex min-h-11 items-center gap-2 self-start text-sm font-bold" style={{ color: 'var(--text-secondary)' }}><ArrowLeft size={19} /> Mes sets</button>
        <div className="card overflow-hidden">
          <div className="h-28 bg-cover bg-center" style={{ backgroundImage: `linear-gradient(rgba(49,46,129,.25),rgba(49,46,129,.8)),url(${import.meta.env.BASE_URL}reference/collection-sets.jpg)` }} />
          <div className="p-4">
            <div className="flex items-start gap-3">
              <span className="text-4xl">{selected.coverEmoji}</span>
              <div className="min-w-0 flex-1"><p className="text-xs font-black uppercase text-violet-400">Référence {selected.reference}</p><h1 className="text-xl font-black" style={{ color: 'var(--text-primary)' }}>{selected.name}</h1></div>
              <button onClick={() => dispatch({ type: 'TOGGLE_SET_ACTIVE', setId: selected.id })} className="flex min-h-11 items-center gap-1 rounded-xl px-3 text-xs font-bold" style={{ background: selected.active ? 'rgba(16,185,129,.15)' : 'var(--bg-secondary)', color: selected.active ? '#10b981' : 'var(--text-secondary)' }}>{selected.active ? <CheckCircle2 size={18} /> : <Circle size={18} />}{selected.active ? 'Actif' : 'Inactif'}</button>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <div className="rounded-xl p-3" style={{ background: 'var(--bg-secondary)' }}><p className="text-xl font-black" style={{ color: 'var(--text-primary)' }}>{count || '—'}</p><p className="text-xs" style={{ color: 'var(--text-secondary)' }}>pièces relevées</p></div>
              <div className="rounded-xl p-3" style={{ background: 'var(--bg-secondary)' }}><p className="text-xl font-black" style={{ color: 'var(--text-primary)' }}>{selected.advertisedPieceCount ?? '—'}</p><p className="text-xs" style={{ color: 'var(--text-secondary)' }}>total annoncé</p></div>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className={`flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-bold ${verified ? 'bg-emerald-500/15 text-emerald-400' : 'bg-amber-500/15 text-amber-400'}`}><ShieldCheck size={14} /> {verified ? 'Inventaire vérifié sur photo' : 'Détail à relever'}</span>
              {selected.manualUrl && <a href={selected.manualUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1 rounded-lg bg-violet-500/15 px-2 py-1 text-xs font-bold text-violet-300">Notice officielle <ExternalLink size={13} /></a>}
            </div>
          </div>
        </div>

        <button onClick={() => setShowEntry((value) => !value)} className="flex min-h-12 items-center justify-center gap-2 rounded-xl text-sm font-black" style={{ background: showEntry ? 'var(--accent)' : 'var(--bg-secondary)', color: showEntry ? 'white' : 'var(--text-primary)', border: '1px solid var(--border)' }}><Upload size={18} /> {verified ? 'Corriger depuis la notice' : 'Saisir la page COMPOSANTS'}</button>
        {showEntry && <NoticeEntry set={selected} onDone={() => setShowEntry(false)} />}

        <div>
          <h2 className="mb-3 text-sm font-black uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>Pièces du set ({selected.pieces.length} références)</h2>
          {selected.pieces.length > 0 ? <div className="grid gap-2 sm:grid-cols-2">{selected.pieces.map((piece) => <PieceCard key={piece.id} piece={piece} compact />)}</div> : <div className="rounded-2xl border border-dashed p-8 text-center" style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}><p className="text-4xl">📷</p><p className="mt-2 text-sm font-bold">La page COMPOSANTS de ce set manque encore.</p><p className="mt-1 text-xs">Une photo nette permettra de compléter les codes, quantités et images sans approximation.</p></div>}
        </div>
      </div>
    )
  }

  const filtered = owned.filter((set) => `${set.reference} ${set.name}`.toLowerCase().includes(search.toLowerCase()))
  const verifiedCount = owned.filter((set) => set.inventoryStatus === 'verified-photo').length
  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-4 px-4 pb-24 pt-5">
      <div><h1 className="text-2xl font-black" style={{ color: 'var(--text-primary)' }}>Mes 8 sets</h1><p className="mt-1 text-sm" style={{ color: 'var(--text-secondary)' }}>{verifiedCount} inventaires vérifiés · {owned.length - verifiedCount} à compléter</p></div>
      <div className="flex min-h-12 items-center gap-2 rounded-xl px-3" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}><Search size={19} style={{ color: 'var(--text-secondary)' }} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Référence ou nom du set" className="min-w-0 flex-1 bg-transparent text-sm outline-none" style={{ color: 'var(--text-primary)' }} /></div>
      <div className="grid gap-3 sm:grid-cols-2">
        {filtered.map((set) => {
          const count = set.pieces.reduce((sum, piece) => sum + piece.quantity, 0)
          const verified = set.inventoryStatus === 'verified-photo'
          return <button key={set.id} onClick={() => setSelectedId(set.id)} className="card overflow-hidden text-left transition-transform active:scale-[.98]">
            <div className="flex items-center gap-3 p-4">
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl text-3xl" style={{ background: 'var(--bg-secondary)' }}>{set.coverEmoji}</span>
              <span className="min-w-0 flex-1"><span className="block text-xs font-black uppercase text-violet-400">Set {set.reference}</span><span className="block text-sm font-black leading-tight" style={{ color: 'var(--text-primary)' }}>{set.name}</span><span className="mt-1 block text-xs" style={{ color: 'var(--text-secondary)' }}>{count || set.advertisedPieceCount || 0} pièces</span></span>
              {set.active ? <CheckCircle2 size={20} className="text-emerald-400" /> : <Circle size={20} style={{ color: 'var(--text-secondary)' }} />}
            </div>
            <span className={`flex items-center gap-1 border-t px-4 py-2 text-xs font-bold ${verified ? 'text-emerald-400' : 'text-amber-400'}`} style={{ borderColor: 'var(--border)', background: verified ? 'rgba(16,185,129,.06)' : 'rgba(245,158,11,.06)' }}><ShieldCheck size={14} /> {verified ? 'Correspondance photo vérifiée' : 'Page composants nécessaire'}</span>
          </button>
        })}
      </div>
    </div>
  )
}
