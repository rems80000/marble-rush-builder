import { CheckCircle2, AlertTriangle, XCircle, Shield } from 'lucide-react'
import type { ValidationResult } from '../types'

interface Props {
  result: ValidationResult
}

export default function ValidationPanel({ result }: Props) {
  const scoreColor =
    result.score >= 80 ? '#10b981' : result.score >= 50 ? '#f59e0b' : '#ef4444'

  return (
    <div className="card p-4 animate-slide-up">
      {/* Score global */}
      <div className="flex items-center gap-3 mb-4">
        <div
          className="w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold text-white flex-shrink-0"
          style={{ background: scoreColor }}
        >
          {result.score}
        </div>
        <div>
          <p className="font-bold" style={{ color: 'var(--text-primary)' }}>
            Score de validation
          </p>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            {result.isValid ? '✅ Circuit valide' : '❌ Problèmes détectés'}
          </p>
        </div>
        <Shield size={22} className="ml-auto opacity-40" style={{ color: scoreColor }} />
      </div>

      {/* Problèmes critiques */}
      {result.issues.length > 0 && (
        <div className="mb-3">
          <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: '#ef4444' }}>
            Problèmes critiques
          </p>
          <div className="flex flex-col gap-2">
            {result.issues.map((issue, i) => (
              <div
                key={i}
                className="flex gap-2 rounded-xl p-3"
                style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.3)' }}
              >
                <XCircle size={15} className="text-red-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-medium text-red-300">{issue.description}</p>
                  {issue.stepNumber && (
                    <p className="text-xs text-red-400/70">Étape {issue.stepNumber}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Avertissements */}
      {result.warnings.length > 0 && (
        <div className="mb-3">
          <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: '#f59e0b' }}>
            Avertissements
          </p>
          <div className="flex flex-col gap-2">
            {result.warnings.map((w, i) => (
              <div
                key={i}
                className="flex gap-2 rounded-xl p-3"
                style={{ background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.3)' }}
              >
                <AlertTriangle size={15} className="text-amber-400 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-amber-300">{w.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tout OK */}
      {result.issues.length === 0 && result.warnings.length === 0 && (
        <div
          className="flex gap-2 rounded-xl p-3"
          style={{ background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.3)' }}
        >
          <CheckCircle2 size={15} className="text-emerald-400 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-emerald-300">
            Aucun problème détecté. Ce circuit est prêt à être construit !
          </p>
        </div>
      )}
    </div>
  )
}
