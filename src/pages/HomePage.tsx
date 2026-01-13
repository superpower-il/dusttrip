import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import type { Trip, Region, Profile, Vehicle } from '../types'

interface HomePageProps {
  onNavigateToProfile: () => void
  onNavigateToCreateTrip: () => void
}

export default function HomePage({ onNavigateToProfile, onNavigateToCreateTrip }: HomePageProps) {
  const [trips, setTrips] = useState<any[]>([])
  const [regions, setRegions] = useState<Region[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null)
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null)
  const [userProfile, setUserProfile] = useState<Profile | null>(null)
  const [userVehicle, setUserVehicle] = useState<Vehicle | null>(null)
  const [registering, setRegistering] = useState<string | null>(null)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser()
      
      if (user) {
        // Fetch user profile
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()
        
        setUserProfile(profile)

        // Fetch user vehicle
        const { data: vehicle } = await supabase
          .from('vehicles')
          .select('*')
          .eq('user_id', user.id)
          .single()
        
        setUserVehicle(vehicle)
      }

      // Fetch regions
      const { data: regionsData } = await supabase
        .from('regions')
        .select('*')
      
      setRegions(regionsData || [])

      // Fetch trips with leader info
      const { data: tripsData, error } = await supabase
        .from('trips')
        .select(`
          *,
          leader:profiles!leader_id(full_name, avatar_url),
          region:regions(name),
          registrations:trip_registrations(count)
        `)
        .eq('status', 'active')
        .gte('start_date', new Date().toISOString())
        .order('start_date', { ascending: true })
      
      if (error) {
        console.error('Error fetching trips:', error)
      } else {
        // Fetch registration counts separately for each trip
        const tripsWithCounts = await Promise.all(
          (tripsData || []).map(async (trip) => {
            const { count } = await supabase
              .from('trip_registrations')
              .select('*', { count: 'exact', head: true })
              .eq('trip_id', trip.id)
              .eq('status', 'approved')
            
            return { ...trip, approved_count: count || 0 }
          })
        )
        
        setTrips(tripsWithCounts)
      }
    } catch (err) {
      console.error('Error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
  }

  const getDifficultyLabel = (difficulty: string) => {
    const labels: Record<string, string> = {
      easy: 'קל',
      medium: 'בינוני',
      hard: 'קשה'
    }
    return labels[difficulty] || difficulty
  }

  const getDifficultyColor = (difficulty: string) => {
    const colors: Record<string, string> = {
      easy: 'bg-green-100 text-green-800',
      medium: 'bg-yellow-100 text-yellow-800',
      hard: 'bg-red-100 text-red-800'
    }
    return colors[difficulty] || 'bg-gray-100 text-gray-800'
  }

  const checkVehicleCompatibility = (trip: any) => {
    if (!userVehicle) return { compatible: false, reasons: ['לא נמצא רכב רשום'] }
    
    const reasons: string[] = []
    
    if (trip.requires_lifted && !userVehicle.is_lifted) {
      reasons.push('מוגבה')
    }
    if (trip.requires_lockers && !userVehicle.has_lockers) {
      reasons.push('נעילות דיפרנציאל')
    }
    if (trip.requires_low_gear && !userVehicle.has_low_gear) {
      reasons.push('הילוך כוח')
    }
    if (trip.requires_armored && !userVehicle.is_armored) {
      reasons.push('ממוגן')
    }
    
    return {
      compatible: reasons.length === 0,
      reasons
    }
  }

  const filteredTrips = trips.filter(trip => {
    if (selectedRegion && trip.region_id !== selectedRegion) return false
    if (selectedDifficulty && trip.difficulty !== selectedDifficulty) return false
    return true
  })

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('he-IL', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const handleRegisterToTrip = async (tripId: string) => {
    if (!userVehicle || !userProfile) return

    setRegistering(tripId)

    try {
      const { error } = await supabase
        .from('trip_registrations')
        .insert({
          trip_id: tripId,
          user_id: userProfile.id,
          vehicle_id: userVehicle.id,
          status: 'pending'
        })

      if (error) throw error

      alert('ההרשמה נשלחה בהצלחה! המוביל יבדוק ויאשר את ההשתתפות שלך.')
      await fetchData()
    } catch (err: any) {
      if (err.code === '23505') {
        alert('כבר נרשמת לטיול הזה!')
      } else {
        alert('שגיאה בהרשמה: ' + err.message)
      }
    } finally {
      setRegistering(null)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50" dir="rtl">
      {/* Header */}
      <header className="bg-white shadow-md sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <span className="text-4xl">🚙</span>
            <div>
              <h1 className="text-2xl font-bold text-amber-800">DustTrip</h1>
              <p className="text-sm text-amber-600">שלום, {userProfile?.full_name}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {userProfile?.is_leader && (
              <button
                onClick={onNavigateToCreateTrip}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium"
              >
                ➕ צור טיול
              </button>
            )}
            <button
              onClick={onNavigateToProfile}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors text-sm font-medium"
            >
              👤 הפרופיל שלי
            </button>
            <button
              onClick={handleSignOut}
              className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium"
            >
              התנתק
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Filters */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">סינון טיולים</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Region Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">אזור</label>
              <select
                value={selectedRegion || ''}
                onChange={(e) => setSelectedRegion(e.target.value || null)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              >
                <option value="">כל האזורים</option>
                {regions.map((region) => (
                  <option key={region.id} value={region.id}>
                    {region.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Difficulty Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">רמת קושי</label>
              <select
                value={selectedDifficulty || ''}
                onChange={(e) => setSelectedDifficulty(e.target.value || null)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              >
                <option value="">כל הרמות</option>
                <option value="easy">קל</option>
                <option value="medium">בינוני</option>
                <option value="hard">קשה</option>
              </select>
            </div>
          </div>
        </div>

        {/* Trips List */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-800">
            טיולים קרובים ({filteredTrips.length})
          </h2>

          {loading ? (
            <div className="text-center py-12">
              <div className="text-5xl mb-4">🚙</div>
              <p className="text-gray-600">טוען טיולים...</p>
            </div>
          ) : filteredTrips.length === 0 ? (
            <div className="bg-white rounded-xl shadow-lg p-12 text-center">
              <div className="text-6xl mb-4">🏜️</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                אין טיולים זמינים כרגע
              </h3>
              <p className="text-gray-600">
                בדוק שוב מאוחר יותר או שנה את הסינון
              </p>
            </div>
          ) : (
            <>
              {filteredTrips.map((trip) => {
                const compatibility = checkVehicleCompatibility(trip)
                
                return (
                  <div key={trip.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-gray-800 mb-2">
                          {trip.title}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                          <span>👤 {trip.leader?.full_name}</span>
                          {trip.region && (
                            <>
                              <span>•</span>
                              <span>📍 {trip.region.name}</span>
                            </>
                          )}
                          {trip.specific_location && (
                            <>
                              <span>•</span>
                              <span>{trip.specific_location}</span>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {/* Available Spots Badge */}
                        <div className={`px-4 py-2 rounded-lg font-bold text-center ${
                          trip.approved_count >= trip.max_vehicles 
                            ? 'bg-red-100 text-red-800 border-2 border-red-300' 
                            : trip.approved_count >= trip.max_vehicles * 0.7
                            ? 'bg-orange-100 text-orange-800 border-2 border-orange-300'
                            : 'bg-green-100 text-green-800 border-2 border-green-300'
                        }`}>
                          <div className="text-2xl leading-none mb-1">
                            {trip.max_vehicles - (trip.approved_count || 0)}
                          </div>
                          <div className="text-xs">
                            {trip.approved_count >= trip.max_vehicles ? 'טיול מלא!' : 'מקומות פנויים'}
                          </div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(trip.difficulty)}`}>
                          {getDifficultyLabel(trip.difficulty)}
                        </span>
                      </div>
                      {trip.price && (
                        <div className="text-center p-3 bg-gray-50 rounded-lg">
                          <div className="text-2xl mb-1">💰</div>
                          <div className="text-xs text-gray-600">מחיר</div>
                          <div className="text-sm font-semibold">₪{trip.price}</div>
                        </div>
                      )}
                    </div>

                    {/* Vehicle Requirements */}
                    {(trip.requires_lifted || trip.requires_lockers || trip.requires_low_gear || trip.requires_armored) && (
                      <div className="mb-4">
                        <div className="text-sm font-medium text-gray-700 mb-2">דרישות רכב:</div>
                        <div className="flex flex-wrap gap-2">
                          {trip.requires_lifted && <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">מוגבה</span>}
                          {trip.requires_lockers && <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">נעילות</span>}
                          {trip.requires_low_gear && <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">הילוך כוח</span>}
                          {trip.requires_armored && <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">ממוגן</span>}
                        </div>
                      </div>
                    )}

                    {/* Compatibility & Action Button */}
                    <div className="border-t pt-4">
                      {compatibility.compatible ? (
                        <button 
                          onClick={() => handleRegisterToTrip(trip.id)}
                          disabled={registering === trip.id}
                          className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {registering === trip.id ? 'נרשם...' : 'הרשם לטיול ✓'}
                        </button>
                      ) : (
                        <div>
                          <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-3">
                            <p className="text-sm text-red-800 font-medium mb-1">
                              הרכב שלך לא עומד בדרישות הטיול:
                            </p>
                            <p className="text-sm text-red-700">
                              חסר: {compatibility.reasons.join(', ')}
                            </p>
                          </div>
                          <button disabled className="w-full bg-gray-300 text-gray-600 font-semibold py-3 px-4 rounded-lg cursor-not-allowed">
                            לא ניתן להירשם
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
            </>
          )}
        </div>
      </main>
    </div>
  )
}