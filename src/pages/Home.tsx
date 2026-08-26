import { useNavigate } from 'react-router-dom'
import { ArrowRight, BookOpen, CheckCircle2, Package, Sparkles } from 'lucide-react'
import { useStore } from '../store/useStore'

export default function Home() {
  const navigate = useNavigate()
  const { state } = useStore()
  const owned = state.sets.filter((set) => set.owned)
  const active = owned.filter((set) => set.active)
  const verified = owned.filter((set) => set.inventoryStatus === 'verified-photo')
  const totalPieces = active.reduce((sum, set) => sum + set.pieces.reduce((pieceSum, piece) => pieceSum + piece.quantity, 0), 0)

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-5 pb-24">
      <section className="relative overflow-hidden px-5 pb-7 pt-8" style={{ background: 'linear-gradient(145deg,#312e81 0%,#5b21b6 60%,#7c3aed 100%)' }}>
        <div className="relative z-10 max-w-lg text-white">
          <p className="mb-2 text-xs font-bold uppercase tracking-[.2em] text-violet-200">Ma collection Marble Rush</p>
          <h1 className="text-3xl font-black leading-tight">Construis un circuit avec tes vraies pièces</h1>
          <p className="mt-2 text-sm leading-relaxed text-violet-100">Choisis tes sets, génère un plan compatible puis suis la notice étape par étape.</p>
          <button onClick={() => navigate('/generateur')} className="mt-5 flex min-h-13 w-full items-center justify-center gap-2 rounded-2xl bg-orange-500 px-5 py-3 text-base font-black text-white shadow-lg sm:w-auto">
            <Sparkles size={21} /> Créer un circuit <ArrowRight size={19} />
          </button>
        </div>
        <div className="absolute -bottom-8 -right-8 text-[150px] opacity-10">🎢</div>
      </section>

      <section className="px-4">
        <div className="grid grid-cols-3 gap-2">
          <div className="card p-3 text-center"><p className="text-2xl font-black text-violet-400">{owned.length}</p><p className="text-xs" style={{ color: 'var(--text-secondary)' }}>sets possédés</p></div>
          <div className="card p-3 text-center"><p className="text-2xl font-black text-cyan-400">{totalPieces}</p><p className="text-xs" style={{ color: 'var(--text-secondary)' }}>pièces vérifiées</p></div>
          <div className="card p-3 text-center"><p className="text-2xl font-black text-emerald-400">{state.plans.length}</p><p className="text-xs" style={{ color: 'var(--text-secondary)' }}>plans sauvegardés</p></div>
        </div>
      </section>

      <section className="px-4">
        <div className="overflow-hidden rounded-2xl" style={{ border: '1px solid var(--border)' }}>
          <img src={`${import.meta.env.BASE_URL}reference/collection-sets.jpg`} alt="Les huit notices Marble Rush de la collection" className="h-44 w-full object-cover object-center" />
          <div className="flex items-center justify-between gap-3 p-3" style={{ background: 'var(--bg-secondary)' }}>
            <div>
              <p className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>Tes 8 sets sont enregistrés</p>
              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{verified.length} inventaires vérifiés sur photo · {owned.length - verified.length} notices à relever</p>
            </div>
            <button onClick={() => navigate('/sets')} className="flex min-h-11 items-center gap-1 rounded-xl px-3 text-sm font-bold text-white" style={{ background: 'var(--accent)' }}>Voir <ArrowRight size={16} /></button>
          </div>
        </div>
      </section>

      <section className="px-4">
        <h2 className="mb-3 text-sm font-black uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>Continuer</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <button onClick={() => navigate('/sets')} className="card flex min-h-20 items-center gap-3 p-4 text-left">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/15 text-cyan-400"><Package /></span>
            <span><strong className="block text-sm" style={{ color: 'var(--text-primary)' }}>Vérifier mes sets</strong><span className="text-xs" style={{ color: 'var(--text-secondary)' }}>Pièces et quantités par notice</span></span>
          </button>
          <button onClick={() => navigate('/plans')} className="card flex min-h-20 items-center gap-3 p-4 text-left">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-400"><BookOpen /></span>
            <span><strong className="block text-sm" style={{ color: 'var(--text-primary)' }}>Reprendre un plan</strong><span className="text-xs" style={{ color: 'var(--text-secondary)' }}>Notice détaillée et progression</span></span>
          </button>
        </div>
      </section>

      {active.length !== owned.length && (
        <div className="mx-4 flex items-center gap-2 rounded-xl p-3 text-xs" style={{ background: 'rgba(245,158,11,.12)', color: 'var(--text-secondary)' }}>
          <CheckCircle2 size={17} className="text-amber-400" /> {active.length} set(s) actif(s) sur {owned.length} pour la génération.
        </div>
      )}
    </div>
  )
}
