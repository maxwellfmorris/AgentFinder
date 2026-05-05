import { cookies } from 'next/headers'

export function getSessionId(): string {
  return cookies().get('af_sid')?.value ?? 'unset'
}
