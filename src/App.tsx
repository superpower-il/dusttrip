import { useEffect, useState } from 'react'
import { supabase } from './lib/supabase'
import type { Session } from '@supabase/supabase-js'
import HomePage from './pages/HomePage'
import AuthPage from './pages/AuthPage'
import ProfileSetupPage from './pages/ProfileSetupPage'
import ProfilePage from './pages/ProfilePage'
import CreateTripPage from './pages/CreateTripPage'

type View = 'home' | 'profile' | 'create-trip'

function App() {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [hasVehicle, setHasVehicle] = useState(false)
  const [checkingVehicle, setCheckingVehicle] = useState(true)
  const [currentView, setCurrentView] = useState<View>('home')

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setCheckingVehicle(true)
    })

    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (session?.user) {
      checkUserVehicle()
    } else {
      setCheckingVehicle(false)
    }
  }, [session])

  const checkUserVehicle = async () => {
    if (!session?.user) return

    try {
      const { data, error } = await supabase
        .from('vehicles')
        .select('id')
        .eq('user_id', session.user.id)
        .limit(1)

      if (error) throw error

      setHasVehicle(data && data.length > 0)
    } catch (err) {
      console.error('Error checking vehicle:', err)
      setHasVehicle(false)
    } finally {
      setCheckingVehicle(false)
    }
  }

  if (loading || (session && checkingVehicle)) {
    return (
      <div className="min-h-screen bg-amber-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4">🚙</div>
          <p className="text-amber-800 text-xl">טוען...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return <AuthPage />
  }

  if (!hasVehicle) {
    return <ProfileSetupPage userId={session.user.id} onComplete={checkUserVehicle} />
  }

  if (currentView === 'profile') {
    return <ProfilePage onBack={() => setCurrentView('home')} />
  }

  if (currentView === 'create-trip') {
    return (
      <CreateTripPage
        onBack={() => setCurrentView('home')}
        onSuccess={() => {
          setCurrentView('home')
          checkUserVehicle()
        }}
      />
    )
  }

  return (
    <HomePage
      onNavigateToProfile={() => setCurrentView('profile')}
      onNavigateToCreateTrip={() => setCurrentView('create-trip')}
    />
  )
}

export default App