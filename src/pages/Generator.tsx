import { useMemo, useState } from 'react'
import { ArrowLeft, Check, ChevronDown, ChevronUp, Minus, PackageCheck, Plus, Sparkles } from 'lucide-react'
import { useStore } from '../store/useStore'
import type { BuildStep, CircuitPlan, Difficulty, MarblePiece, PieceColor, ValidationResult } from '../types'
import { generateId } from '../utils/storage'
import StepByStepViewer from '../components/StepByStepViewer'
import ValidationPanel from '../components/ValidationPanel'
import PieceImage from '../components/PieceImage'
import MarbleInstructionDiagram from '../components/MarbleInstructionDiagram'

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

type AvailablePiece = MarblePiece & {
  available: number
  setReference: string
  automatic?: boolean
}

interface SelectedFeature {
  piece: AvailablePiece
  quantity: number
}

function buildInventory(sets: ReturnType<typeof useStore>['state']['sets'], selectedSetIds: string[]) {
  const result = new Map<string, AvailablePiece>()
  sets.filter((set) => selectedSetIds.includes(set.id)).forEach((set) => set.pieces.forEach((piece) => {
    const current = result.get(piece.code)
    if (current) {
      current.available += piece.quantity
      if (!current.setReference.split(' + ').includes(set.reference)) current.setReference += ` + ${set.reference}`
    } else {
      result.set(piece.code, { ...piece, available: piece.quantity, setReference: set.reference })
    }
  }))
  return result
}

function isFeaturePiece(piece: AvailablePiece) {
  if (piece.code === 'M-45') return false
  if (piece.code.startsWith('B-') || piece.code.startsWith('P-') || piece.code === 'MARBLE') return false
  if (piece.type === 'rail-straight' || piece.type === 'rail-curved' || piece.type === 'train-track' || piece.type === 'connector') return false
  if (piece.type === 'decoration') return /pont/i.test(piece.name)
  if (piece.type === 'special') return /tourbillon|bascule|module tournant|pont/i.test(piece.name)
  return ['spiral', 'elevator', 'launcher', 'train-car', 'funnel', 'flipper', 'cannon'].includes(piece.type)
}

function featureLabel(piece: AvailablePiece) {
  if (piece.code === 'M-40') return 'Ascenseur complet'
  return piece.name
}

function requestId(code: string | undefined, stepIndex: number, quantityIndex: number) {
  return `${code ?? 'piece'}-${stepIndex}-${quantityIndex}`
}

function featurePieces(feature: AvailablePiece): PieceRef[] {
  if (feature.code === 'M-40') return [{ code: 'M-40', qty: 1 }, { code: 'M-45', qty: 1 }]
  if (feature.code === 'M-39') return [
    { code: 'T-24', qty: 2 },
    { code: 'T-25', qty: 1 },
    { code: 'M-39', qty: 1 },
  ]
  return [{ code: feature.code, qty: 1 }]
}

function makeRecipe(
  id: PlanRecipe['id'],
  selected: AvailablePiece[],
  options: { name: string; subtitle: string; difficulty: Difficulty; minutes: number; height: number; supports: number; bases: number },
): PlanRecipe {
  const steps: StepRecipe[] = [
    {
      title: 'Assembler la base',
      description: `Relie ${options.bases} grande${options.bases > 1 ? 's' : ''} plaque${options.bases > 1 ? 's' : ''} P-01 et pose-les bien à plat.`,
      pieces: [{ code: 'P-01', qty: options.bases }], x: 2, y: 2, z: 0,
      tips: 'Les plaques et petits blocs sont considérés comme toujours disponibles.',
    },
    {
      title: 'Monter la structure',
      description: `Empile ${options.supports} blocs B-01 pour créer les points hauts du parcours.`,
      pieces: [{ code: 'B-01', qty: options.supports }], x: 2, y: 2, z: 1, direction: 'stack',
      tips: 'Répartis les blocs en plusieurs colonnes si la structure devient trop haute.',
    },
  ]

  selected.forEach((feature, index) => {
    const level = Math.max(2, options.height - index * 2)
    steps.push({
      title: `Installer ${featureLabel(feature)}`,
      description: `Fixe ${feature.code} sur la structure, puis oriente sa sortie vers la prochaine zone.`,
      pieces: featurePieces(feature),
      x: 2 + index * 2,
      y: 3 + index * 2,
      z: level,
      rotation: (index % 4 * 90) as 0 | 90 | 180 | 270,
      tips: feature.function ?? 'Vérifie que les connecteurs sont bien clipsés.',
      marbleTest: true,
    })
    if (index < selected.length - 1) {
      steps.push({
        title: `Relier à ${selected[index + 1]?.code}`,
        description: 'Ajoute deux rails courts et un virage pour conserver une pente régulière.',
        pieces: [{ code: 'T-06', qty: 2 }, { code: 'T-03', qty: 1 }],
        x: 3 + index * 2, y: 4 + index * 2, z: Math.max(1, level - 1), direction: 'branch-right', rotation: 90,
      })
    }
  })

  steps.push({
    title: 'Créer la descente finale',
    description: 'Raccorde la dernière attraction à une sortie basse et dégagée.',
    pieces: [{ code: 'T-04', qty: id === 'C' ? 3 : 2 }, { code: 'T-08', qty: 1 }],
    x: 4 + selected.length, y: 6 + selected.length, z: Math.max(1, options.height - selected.length * 2),
    direction: 'branch-right', rotation: 90, marbleTest: true,
    tips: 'Teste une bille seule avant de lancer tout le circuit.',
  })

  return { id, ...options, steps }
}

function makeRecipes(selectedFeatures: SelectedFeature[]) {
  const units = selectedFeatures.flatMap(({ piece, quantity }) => Array.from({ length: quantity }, () => piece))
  const compact = units.slice(0, 1)
  const medium = units.slice(0, Math.min(2, units.length))
  const large = units.slice(0, Math.min(6, units.length))
  return [
    makeRecipe('A', compact, {
      name: compact[0] ? `Circuit compact avec ${featureLabel(compact[0])}` : 'Circuit compact',
      subtitle: 'Une attraction principale, une structure basse et une descente fiable.', difficulty: 'easy', minutes: 15, height: 5, supports: 5, bases: 1,
    }),
    makeRecipe('B', medium, {
      name: medium.length > 1 ? 'Circuit duo d’attractions' : 'Circuit moyen',
      subtitle: 'Deux zones de jeu reliées par une pente régulière.', difficulty: 'medium', minutes: 30, height: 7, supports: 9, bases: 2,
    }),
    makeRecipe('C', large, {
      name: large.length > 2 ? 'Grand circuit spectacle' : 'Grand circuit évolutif',
      subtitle: 'Le parcours le plus complet possible avec les attractions sélectionnées.', difficulty: 'hard', minutes: 50, height: 10, supports: 14, bases: 3,
    }),
  ]
}

function buildGenerationInventory(fullInventory: Map<string, AvailablePiece>, quantities: Record<string, number>) {
  const result = new Map<string, AvailablePiece>()
  fullInventory.forEach((piece, code) => {
    if (code.startsWith('B-') || code.startsWith('P-')) {
      result.set(code, { ...piece, available: 999, automatic: true })
    } else if (isFeaturePiece(piece)) {
      result.set(code, { ...piece, available: quantities[code] ?? 0 })
    } else {
      result.set(code, { ...piece })
    }
  })
  const elevatorQty = quantities['M-40'] ?? 0
  const elevatorBase = result.get('M-45')
  if (elevatorBase && elevatorQty > 0) result.set('M-45', { ...elevatorBase, available: elevatorQty })
  return result
}

function resolvePlan(recipe: PlanRecipe, inventory: Map<string, AvailablePiece>, usedSetIds: string[]): CircuitPlan {
  const used = new Map<string, number>()
  const missing = new Map<string, number>()
  const steps: BuildStep[] = recipe.steps.map((step, stepIndex) => {
    const pieces = step.pieces.map((request) => {
      const piece = inventory.get(request.code)
      const previous = used.get(request.code) ?? 0
      const available = piece?.available ?? 0
      used.set(request.code, previous + request.qty)
      if (previous + request.qty > available) missing.set(request.code, previous + request.qty - available)
      return {
        pieceId: piece?.id ?? request.code,
        pieceCode: request.code,
        pieceName: piece?.name ?? `Pièce ${request.code}`,
        quantity: request.qty,
        color: (piece?.color ?? 'gray') as PieceColor,
        emoji: piece?.emoji,
      }
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
      return {
        x: Math.max(0, x), y: Math.max(0, y), z,
        pieceId: requestId(piece.pieceCode, stepIndex, quantityIndex), pieceName: piece.pieceName,
        pieceCode: piece.pieceCode, color: piece.color, emoji: piece.emoji, rotation: step.rotation ?? 0,
      }
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
  return {
    id: generateId(), name: recipe.name, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    difficulty: recipe.difficulty, size: recipe.id === 'A' ? 'small' : recipe.id === 'B' ? 'medium' : 'large',
    maxHeight: recipe.height, estimatedTime: recipe.minutes, steps, gridData: [], notes: recipe.subtitle,
    tags: recipe.id === 'C' ? ['spectacle', 'fun'] : recipe.id === 'B' ? ['duo', 'fun'] : ['stability'],
    isFavorite: false, usedSetIds, validationResult: validation,
  }
}

function PlanCard({ plan, inventory, onView, onSave, saved }: { plan: CircuitPlan; inventory: Map<string, AvailablePiece>; onView: () => void; onSave: () => void; saved: boolean }) {
  const [expanded, setExpanded] = useState(false)
  const valid = plan.validationResult?.isValid ?? false
  const usage = new Map<string, number>()
  plan.steps.flatMap((step) => step.pieces).forEach((piece) => usage.set(piece.pieceCode ?? '', (usage.get(piece.pieceCode ?? '') ?? 0) + piece.quantity))
  return <article className="card overflow-hidden">
    <MarbleInstructionDiagram steps={plan.steps} currentStep={plan.steps.length - 1} finalPreview compact />
    <div className="p-4">
      <div className="flex items-start gap-3"><span className={`flex h-11 w-11 items-center justify-center rounded-xl ${valid ? 'bg-emerald-500' : 'bg-amber-500'} text-lg font-black text-white`}>{plan.validationResult?.score}</span><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><h2 className="font-black" style={{ color: 'var(--text-primary)' }}>{plan.name}</h2><span className={`rounded-full px-2 py-1 text-[11px] font-black ${valid ? 'bg-emerald-500/15 text-emerald-400' : 'bg-amber-500/15 text-amber-400'}`}>{valid ? 'Constructible' : 'Pièces manquantes'}</span></div><p className="mt-1 text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{plan.notes}</p><p className="mt-2 text-xs font-bold text-violet-300">{plan.steps.length} étapes · environ {plan.estimatedTime} min · hauteur {plan.maxHeight}</p></div></div>
      {plan.validationResult && !valid && <div className="mt-3"><ValidationPanel result={plan.validationResult} /></div>}
      <button onClick={() => setExpanded((value) => !value)} className="mt-3 flex min-h-11 w-full items-center gap-2 rounded-xl px-3 text-left text-sm font-bold" style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}><PackageCheck size={18} /> Pièces utilisées / disponibles {expanded ? <ChevronUp className="ml-auto" size={17} /> : <ChevronDown className="ml-auto" size={17} />}</button>
      {expanded && <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">{[...usage.entries()].filter(([code]) => code).map(([code, qty]) => { const piece = inventory.get(code); const enough = (piece?.available ?? 0) >= qty; return <div key={code} className="flex items-center gap-2 rounded-xl p-2" style={{ background: 'var(--bg-secondary)', border: `1px solid ${enough ? 'var(--border)' : '#f59e0b'}` }}><PieceImage code={code} color={piece?.color} size={42} setReference={piece?.setReference} /><span className="min-w-0"><span className="block text-xs font-black" style={{ color: 'var(--text-primary)' }}>{code}</span><span className={`block text-[11px] ${enough ? 'text-emerald-400' : 'text-amber-400'}`}>{qty} / {piece?.automatic ? 'toujours dispo' : piece?.available ?? 0}</span></span></div> })}</div>}
    </div>
    <div className="flex gap-2 border-t p-3" style={{ borderColor: 'var(--border)' }}><button onClick={onView} className="min-h-12 flex-1 rounded-xl bg-orange-500 px-3 text-sm font-black text-white">Voir la notice</button><button onClick={onSave} disabled={saved} className="min-h-12 flex-1 rounded-xl px-3 text-sm font-black disabled:opacity-60" style={{ background: 'var(--bg-secondary)', color: saved ? '#10b981' : 'var(--text-primary)' }}>{saved ? <span className="flex items-center justify-center gap-1"><Check size={17} /> Enregistré</span> : 'Enregistrer'}</button></div>
  </article>
}

export default function Generator() {
  const { state, dispatch } = useStore()
  const verifiedSets = useMemo(() => state.sets.filter((set) => set.owned && set.inventoryStatus === 'verified-photo' && set.pieces.length > 0), [state.sets])
  const verifiedSetIds = useMemo(() => verifiedSets.map((set) => set.id), [verifiedSets])
  const fullInventory = useMemo(() => buildInventory(state.sets, verifiedSetIds), [state.sets, verifiedSetIds])
  const featureOptions = useMemo(() => [...fullInventory.values()].filter(isFeaturePiece).sort((a, b) => a.code.localeCompare(b.code)), [fullInventory])
  const [quantities, setQuantities] = useState<Record<string, number>>({})
  const [generated, setGenerated] = useState(false)
  const [viewing, setViewing] = useState<CircuitPlan | null>(null)
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set())
  const selectedFeatures = useMemo(() => featureOptions.map((piece) => ({ piece, quantity: quantities[piece.code] ?? 0 })).filter((item) => item.quantity > 0), [featureOptions, quantities])
  const inventory = useMemo(() => buildGenerationInventory(fullInventory, quantities), [fullInventory, quantities])
  const recipes = useMemo(() => makeRecipes(selectedFeatures), [selectedFeatures])
  const plans = useMemo(() => recipes.map((recipe) => resolvePlan(recipe, inventory, verifiedSetIds)).sort((a, b) => Number(b.validationResult?.isValid) - Number(a.validationResult?.isValid)), [inventory, recipes, verifiedSetIds])
  const previewPlan = plans[Math.min(2, Math.max(0, selectedFeatures.reduce((sum, item) => sum + item.quantity, 0) - 1))] ?? plans[0]
  const selectedCount = selectedFeatures.reduce((sum, item) => sum + item.quantity, 0)

  function changeQuantity(piece: AvailablePiece, delta: number) {
    setQuantities((current) => ({ ...current, [piece.code]: Math.max(0, Math.min(piece.available, (current[piece.code] ?? 0) + delta)) }))
  }

  if (viewing) return <div className="mx-auto max-w-5xl px-4 pb-24 pt-4"><button onClick={() => setViewing(null)} className="mb-4 flex min-h-11 items-center gap-2 text-sm font-bold" style={{ color: 'var(--text-secondary)' }}><ArrowLeft size={18} /> Les propositions</button><StepByStepViewer steps={viewing.steps} planName={viewing.name} /></div>
  if (generated) return <div className="mx-auto flex max-w-3xl flex-col gap-4 px-4 pb-24 pt-5"><div className="flex items-start justify-between gap-3"><div><h1 className="text-2xl font-black" style={{ color: 'var(--text-primary)' }}>Parcours proposés</h1><p className="mt-1 text-sm" style={{ color: 'var(--text-secondary)' }}>Chaque aperçu montre le circuit terminé avec les attractions choisies.</p></div><button onClick={() => setGenerated(false)} className="min-h-11 rounded-xl px-3 text-sm font-bold" style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>Modifier</button></div>{plans.map((plan) => <PlanCard key={plan.id} plan={plan} inventory={inventory} onView={() => setViewing(plan)} saved={savedIds.has(plan.id)} onSave={() => { dispatch({ type: 'ADD_PLAN', plan }); setSavedIds((current) => new Set(current).add(plan.id)) }} />)}</div>

  return <div className="mx-auto flex max-w-4xl flex-col gap-5 px-4 pb-24 pt-5">
    <div><p className="text-xs font-black uppercase tracking-widest text-orange-400">Créer</p><h1 className="text-2xl font-black" style={{ color: 'var(--text-primary)' }}>Choisis tes attractions</h1><p className="mt-1 text-sm" style={{ color: 'var(--text-secondary)' }}>Sélectionne seulement les grandes pièces que tu veux utiliser. Les plaques, petits blocs et supports sont ajoutés automatiquement.</p></div>

    <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_340px]">
      <section>
        <div className="mb-3 flex items-center justify-between gap-3"><h2 className="text-sm font-black" style={{ color: 'var(--text-primary)' }}>1. Grandes pièces disponibles</h2><button type="button" onClick={() => setQuantities({})} className="min-h-10 rounded-xl px-3 text-xs font-bold" style={{ background: 'var(--bg-secondary)', color: 'var(--text-secondary)' }}>Tout retirer</button></div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {featureOptions.map((piece) => {
            const quantity = quantities[piece.code] ?? 0
            return <article key={piece.code} className="relative overflow-hidden rounded-2xl p-3" style={{ background: quantity > 0 ? 'rgba(249,115,22,.12)' : 'var(--bg-secondary)', border: `2px solid ${quantity > 0 ? '#f97316' : 'var(--border)'}` }}>
              <div className="flex justify-center"><PieceImage code={piece.code} color={piece.color} emoji={piece.emoji} size={82} setReference={piece.setReference.split(' + ')[0]} /></div>
              <p className="mt-1 text-center text-sm font-black" style={{ color: 'var(--text-primary)' }}>{piece.code}</p>
              <p className="min-h-8 text-center text-[11px] leading-tight" style={{ color: 'var(--text-secondary)' }}>{featureLabel(piece)}</p>
              <div className="mt-2 flex items-center justify-center gap-2">
                <button type="button" onClick={() => changeQuantity(piece, -1)} disabled={quantity === 0} aria-label={`Retirer ${piece.code}`} className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 disabled:opacity-30"><Minus size={18} /></button>
                <span className="min-w-8 text-center text-xl font-black text-orange-400">{quantity}</span>
                <button type="button" onClick={() => changeQuantity(piece, 1)} disabled={quantity >= piece.available} aria-label={`Ajouter ${piece.code}`} className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500 text-white disabled:opacity-30"><Plus size={18} /></button>
              </div>
              <p className="mt-1 text-center text-[10px]" style={{ color: 'var(--text-secondary)' }}>maximum {piece.available}</p>
            </article>
          })}
        </div>
      </section>

      <aside className="lg:sticky lg:top-4 lg:self-start">
        <h2 className="mb-2 text-sm font-black" style={{ color: 'var(--text-primary)' }}>2. Aperçu en direct</h2>
        {selectedCount > 0 && previewPlan ? <MarbleInstructionDiagram steps={previewPlan.steps} currentStep={previewPlan.steps.length - 1} finalPreview compact /> : <div className="flex min-h-60 flex-col items-center justify-center rounded-2xl p-6 text-center" style={{ background: 'var(--bg-secondary)', border: '1px dashed var(--border)' }}><Sparkles className="mb-3 text-orange-400" size={34} /><p className="font-black" style={{ color: 'var(--text-primary)' }}>Choisis une grande pièce</p><p className="mt-1 text-xs" style={{ color: 'var(--text-secondary)' }}>Le circuit final apparaîtra ici et évoluera à chaque choix.</p></div>}
        <div className="mt-3 rounded-2xl p-4" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}><div className="flex items-center justify-between"><div><p className="text-sm font-black" style={{ color: 'var(--text-primary)' }}>{selectedCount} attraction{selectedCount > 1 ? 's' : ''} choisie{selectedCount > 1 ? 's' : ''}</p><p className="mt-1 text-xs" style={{ color: 'var(--text-secondary)' }}>Blocs B et plaques P : toujours disponibles</p></div><PackageCheck className="text-emerald-400" size={27} /></div></div>
        <button disabled={selectedCount === 0} onClick={() => { setGenerated(true); setSavedIds(new Set()) }} className="mt-3 flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-400 px-3 text-base font-black text-white shadow-lg disabled:opacity-40"><Sparkles size={22} /> Générer 3 parcours</button>
      </aside>
    </div>
  </div>
}
