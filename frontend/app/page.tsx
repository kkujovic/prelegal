'use client'

import { useEffect, useState } from 'react'
import DocumentSelector, { CatalogEntry } from './components/DocumentSelector'
import DocumentCreator from './components/DocumentCreator'
import SignInScreen from './components/SignInScreen'
import SignUpScreen from './components/SignUpScreen'

interface Auth {
  email: string
  token: string
}

interface DocSelection {
  entry: CatalogEntry
  documentId?: number
  initialFields?: Record<string, string>
}

type AuthScreen = 'signin' | 'signup'

export default function Page() {
  const [auth, setAuth] = useState<Auth | null>(null)
  const [authScreen, setAuthScreen] = useState<AuthScreen>('signin')
  const [selectedDoc, setSelectedDoc] = useState<DocSelection | null>(null)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('token')
    const email = localStorage.getItem('email')
    if (token && email) setAuth({ token, email })
    setLoaded(true)
  }, [])

  function handleSignIn(email: string, token: string) {
    localStorage.setItem('token', token)
    localStorage.setItem('email', email)
    setAuth({ email, token })
  }

  function handleSignOut() {
    localStorage.removeItem('token')
    localStorage.removeItem('email')
    setAuth(null)
    setSelectedDoc(null)
    setAuthScreen('signin')
  }

  if (!loaded) return null

  if (!auth) {
    if (authScreen === 'signup') {
      return <SignUpScreen onSignUp={handleSignIn} onGoSignIn={() => setAuthScreen('signin')} />
    }
    return <SignInScreen onSignIn={handleSignIn} onGoSignUp={() => setAuthScreen('signup')} />
  }

  if (selectedDoc) {
    return (
      <DocumentCreator
        document={selectedDoc.entry}
        token={auth.token}
        documentId={selectedDoc.documentId}
        initialFields={selectedDoc.initialFields}
        onBack={() => setSelectedDoc(null)}
      />
    )
  }

  return (
    <DocumentSelector
      token={auth.token}
      email={auth.email}
      onSelect={(entry) => setSelectedDoc({ entry })}
      onResume={(entry, documentId, initialFields) =>
        setSelectedDoc({ entry, documentId, initialFields })
      }
      onSignOut={handleSignOut}
    />
  )
}
