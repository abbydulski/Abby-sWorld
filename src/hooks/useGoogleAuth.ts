import { useGoogleLogin, googleLogout } from '@react-oauth/google'
import { useState, useCallback, useEffect } from 'react'

type AuthState = {
  token: string | null
  userInfo: { name: string; email: string; picture: string } | null
}

const SCOPES = [
  'https://www.googleapis.com/auth/calendar.readonly',
  'https://www.googleapis.com/auth/gmail.readonly',
].join(' ')

const HAS_SIGNED_IN_KEY = 'abbysworld_has_signed_in'

async function fetchUserInfo(token: string) {
  const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
    headers: { Authorization: `Bearer ${token}` },
  })
  const info = await res.json()
  return { name: info.name, email: info.email, picture: info.picture }
}

export function useGoogleAuth() {
  const [auth, setAuth] = useState<AuthState>({ token: null, userInfo: null })
  const [silentLoading, setSilentLoading] = useState(
    () => localStorage.getItem(HAS_SIGNED_IN_KEY) === 'true',
  )

  const handleSuccess = useCallback(async (token: string) => {
    const userInfo = await fetchUserInfo(token)
    setAuth({ token, userInfo })
    localStorage.setItem(HAS_SIGNED_IN_KEY, 'true')
    setSilentLoading(false)
  }, [])

  // Manual sign-in (button press)
  const signIn = useGoogleLogin({
    scope: SCOPES,
    onSuccess: (r) => handleSuccess(r.access_token),
    onError: (err) => {
      console.error('Google sign-in failed', err)
      setSilentLoading(false)
    },
  })

  // Silent re-auth on load — only if user has signed in before
  const silentSignIn = useGoogleLogin({
    scope: SCOPES,
    prompt: 'none',
    onSuccess: (r) => handleSuccess(r.access_token),
    onError: () => {
      // Google session expired — clear flag, show connect button
      localStorage.removeItem(HAS_SIGNED_IN_KEY)
      setSilentLoading(false)
    },
  })

  useEffect(() => {
    if (localStorage.getItem(HAS_SIGNED_IN_KEY) === 'true') {
      silentSignIn()
      // If silent auth doesn't resolve in 4s, stop blocking the UI
      const timeout = setTimeout(() => setSilentLoading(false), 4000)
      return () => clearTimeout(timeout)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const signOut = useCallback(() => {
    googleLogout()
    localStorage.removeItem(HAS_SIGNED_IN_KEY)
    setAuth({ token: null, userInfo: null })
  }, [])

  return { token: auth.token, userInfo: auth.userInfo, signIn, signOut, silentLoading }
}
