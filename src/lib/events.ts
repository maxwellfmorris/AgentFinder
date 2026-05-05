'use server'

import { getSupabaseServer } from './supabase-server'
import { getSessionId } from './session'

export async function logSearchEvent({
  query,
  resultCount,
}: {
  query: string
  resultCount: number
}): Promise<void> {
  try {
    const supabase = getSupabaseServer()
    const { data: { user } } = await supabase.auth.getUser()
    await supabase.from('search_events').insert({
      event_type: 'search',
      session_id: getSessionId(),
      user_id: user?.id ?? null,
      query,
      result_count: resultCount,
      agent_id: null,
      position: null,
    })
  } catch {
    // fire-and-forget — logging failures must never crash user flow
  }
}

export async function logClickEvent({
  query,
  agentId,
  position,
}: {
  query: string
  agentId: string
  position: number
}): Promise<void> {
  try {
    const supabase = getSupabaseServer()
    const { data: { user } } = await supabase.auth.getUser()
    await supabase.from('search_events').insert({
      event_type: 'click',
      session_id: getSessionId(),
      user_id: user?.id ?? null,
      query,
      result_count: null,
      agent_id: agentId,
      position,
    })
  } catch {
    // fire-and-forget
  }
}
