import { useGoogleLogin, googleLogout } from '@react-oauth/google'
import { useState, useCallback } from 'react'

type UserInfo = { name: string; email: string; picture: string }

type AuthState = {
  token: string | null
  userInfo: UserInfo | null
}

const SCOPES = [
  'https://www.googleapis.com/auth/calendar.readonly',
  'https://www.googleapis.com/auth/gmail.readonly',
].join(' ')

const USER_INFO_KEY = 'abbysworld_user_info'

function loadCachedUserInfo(): UserInfo | null {
  try {
    const raw = localStorage.getItem(USER_INFO_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function useGoogleAuth() {
  const [auth, setAuth] = useState<AuthState>({
    token: null,
    userInfo: loadCachedUserInfo(),
  })

  const signIn = useGoogleLogin({
    scope: SCOPES,
    onSuccess: async (tokenResponse) => {
      const token = tokenResponse.access_token
      const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { Authorization: `Bearer ${token}` },
      })
      const info = await res.json()
      const userInfo: UserInfo = { name: info.name, email: info.email, picture: info.picture }
      localStorage.setItem(USER_INFO_KEY, JSON.stringify(userInfo))
      setAuth({ token, userInfo })
    },
    onError: (err) => console.error('Google sign-in failed', err),
  })

  const signOut = useCallback(() => {
    googleLogout()
    localStorage.removeItem(USER_INFO_KEY)
    setAuth({ token: null, userInfo: null })
  }, [])

  return { token: auth.token, userInfo: auth.userInfo, signIn, signOut }
}
