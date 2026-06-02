'use server'

import { getSupabaseClient } from '@/lib/supabase'
import { cookies } from 'next/headers'

export interface WaitlistResult {
  success: boolean
  error?: string
  duplicate?: boolean
}

export async function joinWaitlist(email: string, source = 'homepage'): Promise<WaitlistResult> {
  const supabase = getSupabaseClient()
  if (!supabase) return { success: false, error: 'Database not configured.' }

  const trimmed = email.trim().toLowerCase()
  if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
    return { success: false, error: 'Please enter a valid email address.' }
  }

  const sessionId = cookies().get('af_sid')?.value ?? null

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase.from('waitlist') as any).insert({
    email: trimmed,
    source,
    session_id: sessionId,
  })

  if (error) {
    if (error.code === '23505') {
      // Duplicate email — treat as success so we don't leak whether an email is on the list
      return { success: true, duplicate: true }
    }
    return { success: false, error: 'Something went wrong. Please try again.' }
  }

  return { success: true }
}
