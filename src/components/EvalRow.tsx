import type { AgentEval, LetterGrade } from '@/types/database'
import { getLetterGrade, VERIFIED_BY_LABELS } from '@/types/database'

interface EvalRowProps {
  eval_: AgentEval
}

const GRADE_COLORS: Record<LetterGrade, string> = {
  A: 'bg-emerald-100 text-emerald-700',
  B: 'bg-green-100 text-green-700',
  C: 'bg-amber-100 text-amber-700',
  D: 'bg-orange-100 text-orange-700',
  F: 'bg-red-100 text-red-700',
}

export function EvalRow({ eval_ }: EvalRowProps) {
  const grade = getLetterGrade(eval_.score)
  const scoreDisplay = `${grade} · ${Math.round(eval_.score)}/100`

  return (
    <div className="flex items-center gap-3 py-3">
      <span
        className={`flex-shrink-0 inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${GRADE_COLORS[grade]}`}
      >
        {grade}
      </span>

      <div className="flex-1 min-w-0">
        <p className="font-semibold text-slate-900 text-sm leading-snug">{eval_.benchmark_name}</p>
        <p className="text-slate-600 text-sm">{scoreDisplay}</p>
      </div>

      <div className="flex items-center gap-1.5 flex-shrink-0">
        {eval_.sample_size !== null && (
          <span className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">
            n={eval_.sample_size}
          </span>
        )}
        <span className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">
          {VERIFIED_BY_LABELS[eval_.verified_by]}
        </span>
      </div>
    </div>
  )
}
