'use server'

import { getSupabaseServer } from '@/lib/supabase-server'
import { getSessionId } from '@/lib/session'

export interface FeedbackResult {
  success: boolean
  error?: string
}

export async function submitFeedback({
  message,
  email,
  pagePath,
}: {
  message: string
  email: string
  pagePath: string
}): Promise<FeedbackResult> {
  const trimmed = message.trim()
  if (!trimmed) {
    return { success: false, error: 'Please enter a message.' }
  }

  try {
    const supabase = getSupabaseServer()
    const { data: { user } } = await supabase.auth.getUser()
    const { error } = await supabase.from('feedback').insert({
      message: trimmed,
      email: email.trim() || null,
      page_path: pagePath || null,
      session_id: getSessionId(),
      user_id: user?.id ?? null,
    })
    if (error) {
      return { success: false, error: 'Something went wrong. Please try again.' }
    }
    return { success: true }
  } catch {
    return { success: false, error: 'Something went wrong. Please try again.' }
  }
}
