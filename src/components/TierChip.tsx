import type { TrustTier } from '@/types/database'
import { TIER_LABELS, TIER_COLORS } from '@/types/database'

interface TierChipProps {
  tier: TrustTier
  size?: 'sm' | 'md'
}

export function TierChip({ tier, size = 'sm' }: TierChipProps) {
  const padding = size === 'md' ? 'px-2.5 py-1 text-xs' : 'px-2 py-0.5 text-xs'
  return (
    <span
      className={`inline-flex items-center font-semibold rounded-full ${padding} ${TIER_COLORS[tier]}`}
    >
      {TIER_LABELS[tier]}
    </span>
  )
}
