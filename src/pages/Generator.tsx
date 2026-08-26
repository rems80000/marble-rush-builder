import { useMemo, useState } from 'react'
import { ArrowLeft, Check, CheckCircle2, ChevronDown, ChevronUp, PackageCheck, Sparkles, TriangleAlert } from 'lucide-react'
import { useStore } from '../store/useStore'
import type { BuildStep, CircuitPlan, Difficulty, MarblePiece, PieceColor, ValidationResult } from '../types'
import { generateId } from '../utils/storage'
import StepByStepViewer from '../components/StepByStepViewer'
import ValidationPanel from '../components/ValidationPanel'
import PieceImage from '../components/PieceImage'

interface PieceRef { code: string; qty: number }
interface StepRecipe {
  title: string
  description: string
  pieces: PieceRef[]
  x: number
  y: number
  z: number
  direction?: 'horizontal' | 'vertical' | 'stack' | 'branch-left' | 'branch-right'
  rotation?: 0 | 90 | 180 | 270
  tips?: string
  marbleTest?: boolean
}

interface PlanRecipe {
  id: 'A' | 'B' | 'C'
  name: string
  subtitle: string
  difficulty: Difficulty
  minutes: number
  height: number
  steps: StepRecipe[]
}

const RECIPES: PlanRecipe[] = [
  {
    id: 'A', name: 'Petit parcours stable', difficulty: 'easy', minutes: 15, height: 5,
    subtitle: 'Une tour basse, une descente et de grands virages. Idéal pour commencer.',
    steps: [
      { title: 'Assembler la base', description: 'Pose la grande plaque P-01 bien à plat.', pieces: [{ code: 'P-01', qty: 1 }], x: 2, y: 2, z: 0, tips: 'Les quatre côtés de la plaque doivent toucher la table.' },
      { title: 'Monter les premiers supports', description: 'Clipse quatre blocs B-01 au centre de la plaque.', pieces: [{ code: 'B-01', qty: 4 }], x: 2, y: 2, z: 1, direction: 'stack' },
      { title: 'Renforcer la tour', description: 'Ajoute deux blocs B-02 de part et d’autre de la colonne.', pieces: [{ code: 'B-02', qty: 2 }], x: 1, y: 2, z: 1, tips: 'Appuie jusqu’au clic sans forcer.' },
      { title: 'Installer la rampe de départ', description: 'Place M-07 en haut, orientée vers l’extérieur de la base.', pieces: [{ code: 'M-07', qty: 1 }], x: 2, y: 2, z: 5, rotation: 90, marbleTest: true },
      { title: 'Créer la première descente', description: 'Raccorde deux rails droits courts T-06 en descendant.', pieces: [{ code: 'T-06', qty: 2 }], x: 2, y: 3, z: 4, direction: 'branch-right', rotation: 90 },
      { title: 'Former le virage', description: 'Ajoute deux petits virages T-03 pour ramener la piste vers la base.', pieces: [{ code: 'T-03', qty: 2 }], x: 4, y: 5, z: 2, direction: 'branch-left', rotation: 180 },
      { title: 'Terminer par le réceptacle', description: 'Place le réceptacle M-03 au bout du parcours.', pieces: [{ code: 'M-03', qty: 1 }], x: 3, y: 7, z: 0, tips: 'Ajuste le dernier rail pour viser le centre du réceptacle.', marbleTest: true },
    ],
  },
  {
    id: 'B', name: 'Parcours à deux branches', difficulty: 'medium', minutes: 30, height: 7,
    subtitle: 'Deux chemins différents, avec une branche rapide et une branche spectacle.',
    steps: [
      { title: 'Relier les plaques', description: 'Assemble deux P-01 et quatre P-02 pour former une base en L.', pieces: [{ code: 'P-01', qty: 2 }, { code: 'P-02', qty: 4 }], x: 2, y: 2, z: 0 },
      { title: 'Construire la tour centrale', description: 'Monte huit B-01 en deux colonnes de quatre.', pieces: [{ code: 'B-01', qty: 8 }], x: 3, y: 2, z: 1, direction: 'stack', tips: 'Compare la hauteur des deux colonnes avant de continuer.' },
      { title: 'Ajouter les contreforts', description: 'Renforce la tour avec quatre B-02.', pieces: [{ code: 'B-02', qty: 4 }], x: 2, y: 2, z: 1 },
      { title: 'Installer le module central', description: 'Clipse M-04 au sommet de la structure.', pieces: [{ code: 'M-04', qty: 1 }], x: 3, y: 2, z: 6, marbleTest: true },
      { title: 'Construire la branche rapide', description: 'Place deux T-07 puis deux T-08 sur la droite.', pieces: [{ code: 'T-07', qty: 2 }, { code: 'T-08', qty: 2 }], x: 4, y: 3, z: 5, direction: 'branch-right', rotation: 90 },
      { title: 'Construire la branche spectacle', description: 'Place deux grands virages T-01 puis deux virages T-04 sur la gauche.', pieces: [{ code: 'T-01', qty: 2 }, { code: 'T-04', qty: 2 }], x: 2, y: 3, z: 5, direction: 'branch-left', rotation: 270 },
      { title: 'Rapprocher les deux sorties', description: 'Utilise deux petits virages T-03 pour diriger les branches vers le centre.', pieces: [{ code: 'T-03', qty: 2 }], x: 3, y: 7, z: 1 },
      { title: 'Installer l’arrivée commune', description: 'Place M-03 au point de rencontre des deux branches.', pieces: [{ code: 'M-03', qty: 1 }], x: 4, y: 8, z: 0, tips: 'Teste d’abord chaque branche séparément, puis avec plusieurs billes.', marbleTest: true },
    ],
  },
  {
    id: 'C', name: 'Grand parcours train + ascenseur', difficulty: 'hard', minutes: 55, height: 10,
    subtitle: 'Le circuit vedette du set 5999, avec train, voie ferrée et colonne d’ascenseur.',
    steps: [
      { title: 'Préparer la grande emprise', description: 'Relie deux P-01 et huit P-02 pour obtenir une base large.', pieces: [{ code: 'P-01', qty: 2 }, { code: 'P-02', qty: 8 }], x: 2, y: 2, z: 0 },
      { title: 'Monter la colonne principale', description: 'Empile douze B-01 en colonnes régulières.', pieces: [{ code: 'B-01', qty: 12 }], x: 4, y: 2, z: 1, direction: 'stack', tips: 'Travaille par groupes de trois blocs et contrôle l’alignement.' },
      { title: 'Stabiliser la hauteur', description: 'Ajoute huit B-03 autour de la colonne.', pieces: [{ code: 'B-03', qty: 8 }], x: 3, y: 2, z: 1 },
      { title: 'Installer l’ascenseur', description: 'Fixe la colonne M-40 sur sa base bleue M-45, puis place l’ensemble contre la colonne principale.', pieces: [{ code: 'M-40', qty: 1 }, { code: 'M-45', qty: 1 }], x: 4, y: 2, z: 2, direction: 'vertical', tips: 'La chaîne doit rester droite et libre sur toute sa hauteur.' },
      { title: 'Poser les rails du train', description: 'Forme une boucle avec quatre T-24, deux T-25 et un T-26.', pieces: [{ code: 'T-24', qty: 4 }, { code: 'T-25', qty: 2 }, { code: 'T-26', qty: 1 }], x: 1, y: 6, z: 0 },
      { title: 'Ajouter le train', description: 'Pose le train M-39 sur la voie et vérifie qu’il circule librement.', pieces: [{ code: 'M-39', qty: 1 }], x: 3, y: 6, z: 1, marbleTest: true },
      { title: 'Créer la descente haute', description: 'Raccorde trois grands virages T-04 et deux rails T-06.', pieces: [{ code: 'T-04', qty: 3 }, { code: 'T-06', qty: 2 }], x: 4, y: 3, z: 9, direction: 'branch-right', rotation: 90 },
      { title: 'Installer le pont', description: 'Ajoute M-43 au-dessus de la voie ferrée.', pieces: [{ code: 'M-43', qty: 1 }], x: 5, y: 6, z: 4, tips: 'Laisse assez de passage pour le train sous le pont.' },
      { title: 'Fermer le parcours', description: 'Place M-03 à la sortie basse de l’ascenseur.', pieces: [{ code: 'M-03', qty: 1 }], x: 6, y: 8, z: 0, tips: 'Teste une bille, puis le train, avant de lancer plusieurs billes.', marbleTest: true },
    ],
  },
]

type AvailablePiece = MarblePiece & { available: number; setReference: string }

function buildInventory(sets: ReturnType<typeof useStore>['state']['sets'], selectedIds: string[]) {
  const result = new Map<string, AvailablePiece>()
  sets.filter((set) => selectedIds.includes(set.id)).forEach((set) => set.pieces.forEach((piece) => {
    const current = result.get(piece.code)
    if (current) current.available += piece.quantity
    else result.set(piece.code, { ...piece, available: piece.quantity, setReference: set.reference })
  }))
  return result
}

function requestId(code: string | undefined, stepIndex: number, quantityIndex: number) {
  return `${code ?? 'piece'}-${stepIndex}-${quantityIndex}`
}

function resolvePlan(recipe: PlanRecipe, inventory: Map<string, AvailablePiece>, selectedIds: string[]): CircuitPlan {
  const used = new Map<string, number>()
  const missing = new Map<string, number>()
  const steps: BuildStep[] = recipe.steps.map((step, stepIndex) => {
    const pieces = step.pieces.map((request) => {
      const piece = inventory.get(request.code)
      const previous = used.get(request.code) ?? 0
      const available = piece?.available ?? 0
      used.set(request.code, previous + request.qty)
      if (previous + request.qty > available) missing.set(request.code, previous + request.qty - available)
      return { pieceId: piece?.id ?? request.code, pieceCode: request.code, pieceName: piece?.name ?? `Pièce ${request.code}`, quantity: request.qty, color: (piece?.color ?? 'gray') as PieceColor, emoji: piece?.emoji }
    })

    const positions = pieces.flatMap((piece, pieceIndex) => Array.from({ length: piece.quantity }, (_, quantityIndex) => {
      const offset = quantityIndex + pieceIndex
      let x = step.x
      let y = step.y
      let z = step.z
      if (step.direction === 'stack') z += offset
      else if (step.direction === 'vertical') y += offset
      else if (step.direction === 'branch-left') { x -= offset; y += offset; z = Math.max(0, z - offset) }
      else if (step.direction === 'branch-right') { x += offset; y += offset; z = Math.max(0, z - offset) }
      else x += offset
      return { x: Math.max(0, x), y: Math.max(0, y), z, pieceId: requestId(piece.pieceCode, stepIndex, quantityIndex), pieceName: piece.pieceName, pieceCode: piece.pieceCode, color: piece.color, emoji: piece.emoji, rotation: step.rotation ?? 0 }
    }))
    return { stepNumber: stepIndex + 1, title: step.title, description: step.description, pieces, gridPositions: positions, tips: step.tips, marbleTest: step.marbleTest }
  })

  const supportCount = [...used.entries()].filter(([code]) => code.startsWith('B-')).reduce((sum, [, qty]) => sum + qty, 0)
  const trackCount = [...used.entries()].filter(([code]) => code.startsWith('T-')).reduce((sum, [, qty]) => sum + qty, 0)
  const missingText = [...missing.entries()].map(([code, qty]) => `${code} ×${qty}`)
  const validation: ValidationResult = {
    isValid: missing.size === 0,
    score: missing.size === 0 ? Math.max(78, 98 - recipe.height) : Math.max(25, 68 - missing.size * 8),
    issues: missing.size > 0 ? [{ type: 'missing-pieces', description: `Pièces manquantes : ${missingText.join(', ')}` }] : [],
    warnings: trackCount > supportCount * 2 ? [{ type: 'stability', description: 'Beaucoup de rails par rapport aux supports : renforcer les points hauts.' }] : [],
  }
  return { id: generateId(), name: recipe.name, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), difficulty: recipe.difficulty, size: recipe.id === 'A' ? 'small' : recipe.id === 'B' ? 'medium' : 'large', maxHeight: recipe.height, estimatedTime: recipe.minutes, steps, gridData: [], notes: recipe.subtitle, tags: recipe.id === 'C' ? ['train', 'elevator', 'fun'] : recipe.id === 'B' ? ['fun', 'speed'] : ['stability'], isFavorite: false, usedSetIds: selectedIds, validationResult: validation }
}

function PlanCard({ plan, inventory, onView, onSave, saved }: { plan: CircuitPlan; inventory: Map<string, AvailablePiece>; onView: () => void; onSave: () => void; saved: boolean }) {
  const [expanded, setExpanded] = useState(false)
  const valid = plan.validationResult?.isValid ?? false
  const usage = new Map<string, number>()
  plan.steps.flatMap((step) => step.pieces).forEach((piece) => usage.set(piece.pieceCode ?? '', (usage.get(piece.pieceCode ?? '') ?? 0) + piece.quantity))
  return <article className="card overflow-hidden">
    <div className="p-4">
      <div className="flex items-start gap-3"><span className={`flex h-11 w-11 items-center justify-center rounded-xl ${valid ? 'bg-emerald-500' : 'bg-amber-500'} text-lg font-black text-white`}>{plan.validationResult?.score}</span><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><h2 className="font-black" style={{ color: 'var(--text-primary)' }}>{plan.name}</h2><span className={`rounded-full px-2 py-1 text-[11px] font-black ${valid ? 'bg-emerald-500/15 text-emerald-400' : 'bg-amber-500/15 text-amber-400'}`}>{valid ? 'Constructible' : 'Pièces manquantes'}</span></div><p className="mt-1 text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{plan.notes}</p><p className="mt-2 text-xs font-bold text-violet-300">{plan.steps.length} étapes · environ {plan.estimatedTime} min · hauteur {plan.maxHeight}</p></div></div>
      {plan.validationResult && !valid && <div className="mt-3"><ValidationPanel result={plan.validationResult} /></div>}
      <button onClick={() => setExpanded((value) => !value)} className="mt-3 flex min-h-11 w-full items-center gap-2 rounded-xl px-3 text-left text-sm font-bold" style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}><PackageCheck size={18} /> Pièces utilisées / disponibles {expanded ? <ChevronUp className="ml-auto" size={17} /> : <ChevronDown className="ml-auto" size={17} />}</button>
      {expanded && <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">{[...usage.entries()].filter(([code]) => code).map(([code, qty]) => { const piece = inventory.get(code); const enough = (piece?.available ?? 0) >= qty; return <div key={code} className="flex items-center gap-2 rounded-xl p-2" style={{ background: 'var(--bg-secondary)', border: `1px solid ${enough ? 'var(--border)' : '#f59e0b'}` }}><PieceImage code={code} color={piece?.color} size={42} setReference={piece?.setReference} /><span className="min-w-0"><span className="block text-xs font-black" style={{ color: 'var(--text-primary)' }}>{code}</span><span className={`block text-[11px] ${enough ? 'text-emerald-400' : 'text-amber-400'}`}>{qty} / {piece?.available ?? 0}</span></span></div> })}</div>}
    </div>
    <div className="flex gap-2 border-t p-3" style={{ borderColor: 'var(--border)' }}><button onClick={onView} className="min-h-12 flex-1 rounded-xl bg-orange-500 px-3 text-sm font-black text-white">Voir la notice</button><button onClick={onSave} disabled={saved} className="min-h-12 flex-1 rounded-xl px-3 text-sm font-black disabled:opacity-60" style={{ background: 'var(--bg-secondary)', color: saved ? '#10b981' : 'var(--text-primary)' }}>{saved ? <span className="flex items-center justify-center gap-1"><Check size={17} /> Enregistré</span> : 'Enregistrer'}</button></div>
  </article>
}

export default function Generator() {
  const { state, dispatch } = useStore()
  const verifiedSets = state.sets.filter((set) => set.owned && set.inventoryStatus === 'verified-photo' && set.pieces.length > 0)
  const pendingSets = state.sets.filter((set) => set.owned && set.inventoryStatus !== 'verified-photo')
  const [selectedIds, setSelectedIds] = useState(() => verifiedSets.filter((set) => set.active).map((set) => set.id))
  const [generated, setGenerated] = useState(false)
  const [viewing, setViewing] = useState<CircuitPlan | null>(null)
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set())
  const inventory = useMemo(() => buildInventory(state.sets, selectedIds), [selectedIds, state.sets])
  const plans = useMemo(() => RECIPES.map((recipe) => resolvePlan(recipe, inventory, selectedIds)).sort((a, b) => Number(b.validationResult?.isValid) - Number(a.validationResult?.isValid)), [inventory, selectedIds])

  if (viewing) return <div className="mx-auto max-w-5xl px-4 pb-24 pt-4"><button onClick={() => setViewing(null)} className="mb-4 flex min-h-11 items-center gap-2 text-sm font-bold" style={{ color: 'var(--text-secondary)' }}><ArrowLeft size={18} /> Les propositions</button><StepByStepViewer steps={viewing.steps} planName={viewing.name} /></div>
  if (generated) return <div className="mx-auto flex max-w-3xl flex-col gap-4 px-4 pb-24 pt-5"><div className="flex items-start justify-between gap-3"><div><h1 className="text-2xl font-black" style={{ color: 'var(--text-primary)' }}>Parcours proposés</h1><p className="mt-1 text-sm" style={{ color: 'var(--text-secondary)' }}>Les parcours constructibles sont affichés en premier.</p></div><button onClick={() => setGenerated(false)} className="min-h-11 rounded-xl px-3 text-sm font-bold" style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>Modifier</button></div>{plans.map((plan) => <PlanCard key={plan.id} plan={plan} inventory={inventory} onView={() => setViewing(plan)} saved={savedIds.has(plan.id)} onSave={() => { dispatch({ type: 'ADD_PLAN', plan }); setSavedIds((current) => new Set(current).add(plan.id)) }} />)}</div>

  const totalPieces = [...inventory.values()].reduce((sum, piece) => sum + piece.available, 0)
  return <div className="mx-auto flex max-w-3xl flex-col gap-5 px-4 pb-24 pt-5">
    <div><p className="text-xs font-black uppercase tracking-widest text-orange-400">Créer</p><h1 className="text-2xl font-black" style={{ color: 'var(--text-primary)' }}>Nouveau circuit</h1><p className="mt-1 text-sm" style={{ color: 'var(--text-secondary)' }}>Choisis les sets posés devant toi. L’application vérifie chaque quantité avant de proposer une notice.</p></div>
    <section><h2 className="mb-2 text-sm font-black" style={{ color: 'var(--text-primary)' }}>1. Sets disponibles</h2><div className="grid gap-2 sm:grid-cols-2">{verifiedSets.map((set) => { const selected = selectedIds.includes(set.id); return <button key={set.id} onClick={() => setSelectedIds((ids) => selected ? ids.filter((id) => id !== set.id) : [...ids, set.id])} className="flex min-h-16 items-center gap-3 rounded-2xl p-3 text-left" style={{ background: selected ? 'rgba(249,115,22,.13)' : 'var(--bg-secondary)', border: `2px solid ${selected ? '#f97316' : 'var(--border)'}` }}><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-xs font-black text-indigo-900">{set.reference}</span><span className="min-w-0 flex-1"><span className="block text-sm font-black" style={{ color: 'var(--text-primary)' }}>{set.name}</span><span className="block text-xs" style={{ color: 'var(--text-secondary)' }}>{set.pieces.reduce((sum, piece) => sum + piece.quantity, 0)} pièces relevées</span></span>{selected && <CheckCircle2 className="text-orange-500" size={21} />}</button> })}</div></section>
    <section className="rounded-2xl p-4" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}><div className="flex items-center justify-between"><div><h2 className="text-sm font-black" style={{ color: 'var(--text-primary)' }}>2. Inventaire utilisable</h2><p className="mt-1 text-xs" style={{ color: 'var(--text-secondary)' }}>{inventory.size} références · {totalPieces} pièces</p></div><PackageCheck className="text-emerald-400" size={27} /></div>{pendingSets.length > 0 && <div className="mt-3 flex gap-2 rounded-xl bg-amber-500/10 p-3 text-xs text-amber-300"><TriangleAlert className="flex-shrink-0" size={17} /><span>{pendingSets.length} sets possédés sont enregistrés mais exclus de la génération tant que leur page COMPOSANTS n’est pas relevée.</span></div>}</section>
    <section><h2 className="mb-2 text-sm font-black" style={{ color: 'var(--text-primary)' }}>3. Générer les notices</h2><div className="grid grid-cols-3 gap-2">{RECIPES.map((recipe) => <div key={recipe.id} className="rounded-xl p-3 text-center" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}><p className="text-xl font-black text-orange-400">{recipe.id}</p><p className="mt-1 text-xs font-bold" style={{ color: 'var(--text-primary)' }}>{recipe.id === 'A' ? 'Petit' : recipe.id === 'B' ? '2 branches' : 'Train'}</p></div>)}</div></section>
    <button disabled={selectedIds.length === 0} onClick={() => { setGenerated(true); setSavedIds(new Set()) }} className="flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-400 text-base font-black text-white shadow-lg disabled:opacity-40"><Sparkles size={22} /> Proposer 3 parcours</button>
  </div>
}
