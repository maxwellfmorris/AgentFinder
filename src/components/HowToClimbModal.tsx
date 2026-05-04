'use client'

import { X } from 'lucide-react'
import type { TrustTier } from '@/types/database'
import { TIER_LABELS, TIER_DESCRIPTIONS, TIER_COLORS } from '@/types/database'
import { TierChip } from './TierChip'

const TIER_ORDER: TrustTier[] = ['listed', 'verified', 'vetted', 'audited']

interface HowToClimbModalProps {
  currentTier: TrustTier
  onClose: () => void
}

export function HowToClimbModal({ currentTier, onClose }: HowToClimbModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
        >
          <X size={18} />
        </button>

        <h2 className="text-lg font-bold text-slate-900 mb-1">How to climb the trust ladder</h2>
        <p className="text-sm text-slate-500 mb-6">
          Each tier unlocks more visibility and buyer trust.
        </p>

        <div className="space-y-2">
          {TIER_ORDER.map((tier) => (
            <div
              key={tier}
              className={`flex items-start gap-3 rounded-xl p-3 ${
                tier === currentTier ? 'bg-slate-50' : ''
              }`}
            >
              <TierChip tier={tier} size="md" />
              <p className="text-sm text-slate-600 leading-relaxed pt-0.5">
                {TIER_DESCRIPTIONS[tier]}
              </p>
            </div>
          ))}
        </div>

        <button
          onClick={onClose}
          className="mt-6 w-full bg-indigo-600 text-white font-semibold text-sm py-2.5 rounded-full hover:bg-indigo-700 transition-colors"
        >
          Got it
        </button>
      </div>
    </div>
  )
}
