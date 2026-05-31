'use client'

import { logOutboundClick } from '@/lib/events'

interface OutboundLinkProps {
  agentId: string
  url: string
  isAffiliate: boolean
  source: 'card' | 'detail' | 'compare'
  className?: string
  ariaLabel?: string
  children: React.ReactNode
}

/**
 * Thin client wrapper around an outbound <a> that fires logOutboundClick
 * onClick. Fire-and-forget — the user's tab transition is never blocked by
 * the logging call. Used everywhere a "Visit Website" CTA renders.
 */
export function OutboundLink({
  agentId,
  url,
  isAffiliate,
  source,
  className,
  ariaLabel,
  children,
}: OutboundLinkProps) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => {
        void logOutboundClick({ agentId, source, wasAffiliate: isAffiliate }).catch(() => {})
      }}
      className={className}
      aria-label={ariaLabel}
    >
      {children}
    </a>
  )
}
