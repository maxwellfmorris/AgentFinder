'use client'

import { useState } from 'react'
import { SignInModal } from './SignInModal'

export function DashboardSignInGate() {
  const [showSignIn, setShowSignIn] = useState(false)

  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <p className="text-slate-600 font-medium mb-4">Sign in to see your listings</p>
      <button
        onClick={() => setShowSignIn(true)}
        className="bg-indigo-600 text-white font-semibold text-sm px-6 py-2.5 rounded-full hover:bg-indigo-700 transition-colors"
      >
        Sign in
      </button>
      {showSignIn && <SignInModal onClose={() => setShowSignIn(false)} />}
    </div>
  )
}
