import { useGoogleLogin, googleLogout } from '@react-oauth/google'
import { useState, useCallback } from 'react'

type AuthState = {
  token: string | null
  userInfo: { name: string; email: string; picture: string } | null
}

const SCOPES = [
  'https://www.googleapis.com/auth/calendar.readonly',
  'https://www.googleapis.com/auth/gmail.readonly',
].join(' ')

export function useGoogleAuth() {
  const [auth, setAuth] = useState<AuthState>({ token: null, userInfo: null })

  const signIn = useGoogleLogin({
    scope: SCOPES,
    onSuccess: async (tokenResponse) => {
      const token = tokenResponse.access_token
      const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { Authorization: `Bearer ${token}` },
      })
      const info = await res.json()
      setAuth({
        token,
        userInfo: { name: info.name, email: info.email, picture: info.picture },
      })
    },
    onError: (err) => console.error('Google sign-in failed', err),
  })

  const signOut = useCallback(() => {
    googleLogout()
    setAuth({ token: null, userInfo: null })
  }, [])

  return { token: auth.token, userInfo: auth.userInfo, signIn, signOut }
}
