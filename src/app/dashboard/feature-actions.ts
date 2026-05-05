'use server'

import { getSupabaseServer } from '@/lib/supabase-server'
import type { Agent } from '@/types/database'

type FeatureTier = 'category' | 'homepage'

type PurchaseResult =
  | { success: true }
  | { success: false; error: string }

export async function purchaseFeature(
  agentId: string,
  tier: FeatureTier,
  days: number
): Promise<PurchaseResult> {
  const supabase = getSupabaseServer()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: 'You must be signed in to promote a listing.' }
  }

  const { data, error: fetchError } = await supabase
    .from('agents')
    .select('*')
    .eq('id', agentId)
    .single()

  if (fetchError || !data) {
    return { success: false, error: 'Listing not found.' }
  }

  const agent = data as Agent

  if (agent.submitted_by_user_id !== user.id) {
    return { success: false, error: 'You can only promote listings you submitted.' }
  }

  const { error: updateError } = await supabase
    .from('agents')
    .update({
      featured_until: new Date(Date.now() + days * 86_400_000).toISOString(),
      featured_tier: tier,
    })
    .eq('id', agentId)

  if (updateError) {
    return { success: false, error: 'Failed to update listing.' }
  }

  return { success: true }
}
