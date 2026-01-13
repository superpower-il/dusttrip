import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import type { Region, Profile } from '../types'

interface CreateTripPageProps {
  onBack: () => void
  onSuccess: () => void
}

export default function CreateTripPage({ onBack, onSuccess }: CreateTripPageProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [regions, setRegions] = useState<Region[]>([])
  const [userProfile, setUserProfile] = useState<Profile | null>(null)
  const [checkingLeader, setCheckingLeader] = useState(true)

  // Form state
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [regionId, setRegionId] = useState('')
  const [specificLocation, setSpecificLocation] = useState('')
  const [meetingPointAddress, setMeetingPointAddress] = useState('')
  const [startDate, setStartDate] = useState('')
  const [startTime, setStartTime] = useState('')
  const [durationHours, setDurationHours] = useState('')
  const [includesOvernight, setIncludesOvernight] = useState(false)
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium')
  const [minParticipants, setMinParticipants] = useState('1')
  const [maxVehicles, setMaxVehicles] = useState('')
  const [price, setPrice] = useState('')
  const [ofroadLink, setOfroadLink] = useState('')
  const [requiresLifted, setRequiresLifted] = useState(false)
  const [requiresLockers, setRequiresLockers] = useState(false)
  const [requiresLowGear, setRequiresLowGear] = useState(false)
  const [requiresArmored, setRequiresArmored] = useState(false)
  const [notes, setNotes] = useState('')

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) return

      // Check if user is an approved leader
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      setUserProfile(profile)

      // Fetch regions
      const { data: regionsData } = await supabase
        .from('regions')
        .select('*')
        .order('name')
      
      setRegions(regionsData || [])
    } catch (err) {
      console.error('Error:', err)
    } finally {
      setCheckingLeader(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      if (!userProfile || !userProfile.is_leader) {
        throw new Error('רק מובילים מאושרים יכולים ליצור טיולים')
      }

      // Combine date and time
      const dateTimeString = `${startDate}T${startTime}:00`

      const { error: insertError } = await supabase
        .from('trips')
        .insert({
          leader_id: userProfile.id,
          title,
          description: description || null,
          region_id: regionId || null,
          specific_location: specificLocation || null,
          meeting_point_address: meetingPointAddress,
          start_date: dateTimeString,
          duration_hours: durationHours ? parseInt(durationHours) : null,
          includes_overnight: includesOvernight,
          difficulty,
          min_participants: parseInt(minParticipants),
          max_vehicles: parseInt(maxVehicles),
          price: price ? parseFloat(price) : null,
          ofroad_link: ofroadLink || null,
          requires_lifted: requiresLifted,
          requires_lockers: requiresLockers,
          requires_low_gear: requiresLowGear,
          requires_armored: requiresArmored,
          notes: notes || null,
          status: 'active'
        })

      if (insertError) throw insertError

      onSuccess()
    } catch (err: any) {
      setError(err.message || 'אירעה שגיאה')
    } finally {
      setLoading(false)
    }
  }

  if (checkingLeader) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center" dir="rtl">
        <div className="text-center">
          <div className="text-5xl mb-4">🚙</div>
          <p className="text-amber-800 text-xl">טוען...</p>
        </div>
      </div>
    )
  }

  if (!userProfile?.is_leader) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50" dir="rtl">
        <header className="bg-white shadow-md sticky top-0 z-10">
          <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
            <button onClick={onBack} className="text-amber-600 hover:text-amber-800 text-2xl">
              ←
            </button>
            <h1 className="text-2xl font-bold text-amber-800">יצירת טיול</h1>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 py-12">
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="text-6xl mb-4">🔒</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              רק מובילים מאושרים יכולים ליצור טיולים
            </h2>
            <p className="text-gray-600 mb-6">
              כדי להפוך למוביל, עליך להגיש בקשה שתאושר על ידי המנהל
            </p>
            <button
              onClick={onBack}
              className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              חזור לדף הבית
            </button>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50" dir="rtl">
      <header className="bg-white shadow-md sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
          <button onClick={onBack} className="text-amber-600 hover:text-amber-800 text-2xl">
            ←
          </button>
          <div>
            <h1 className="text-2xl font-bold text-amber-800">יצירת טיול חדש</h1>
            <p className="text-sm text-amber-600">מלא את פרטי הטיול</p>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-6 space-y-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-800 border-b pb-2">פרטים בסיסיים</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                שם הטיול <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                placeholder="למשל: טיול ג'יפים בנחל נקרות"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                תיאור
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                placeholder="תאר את הטיול, את המסלול, מה צפוי..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  אזור
                </label>
                <select
                  value={regionId}
                  onChange={(e) => setRegionId(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                >
                  <option value="">בחר אזור</option>
                  {regions.map((region) => (
                    <option key={region.id} value={region.id}>
                      {region.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  מיקום ספציפי
                </label>
                <input
                  type="text"
                  value={specificLocation}
                  onChange={(e) => setSpecificLocation(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="למשל: נחל נקרות"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                נקודת מפגש <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                required
                value={meetingPointAddress}
                onChange={(e) => setMeetingPointAddress(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                placeholder="כתובת מדויקת לנקודת המפגש"
              />
            </div>
          </div>

          {/* Date & Time */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-800 border-b pb-2">תאריך ושעה</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  תאריך <span className="text-red-600">*</span>
                </label>
                <input
                  type="date"
                  required
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  שעה <span className="text-red-600">*</span>
                </label>
                <input
                  type="time"
                  required
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  משך (שעות)
                </label>
                <input
                  type="number"
                  value={durationHours}
                  onChange={(e) => setDurationHours(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="4"
                  min="1"
                />
              </div>
            </div>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={includesOvernight}
                onChange={(e) => setIncludesOvernight(e.target.checked)}
                className="w-4 h-4 text-amber-600 border-gray-300 rounded focus:ring-amber-500"
              />
              <span className="text-sm text-gray-700">כולל לינה</span>
            </label>
          </div>

          {/* Difficulty & Capacity */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-800 border-b pb-2">רמת קושי ומשתתפים</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  רמת קושי <span className="text-red-600">*</span>
                </label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value as 'easy' | 'medium' | 'hard')}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                >
                  <option value="easy">קל</option>
                  <option value="medium">בינוני</option>
                  <option value="hard">קשה</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  מינימום משתתפים
                </label>
                <input
                  type="number"
                  value={minParticipants}
                  onChange={(e) => setMinParticipants(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  min="1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  מקסימום רכבים <span className="text-red-600">*</span>
                </label>
                <input
                  type="number"
                  required
                  value={maxVehicles}
                  onChange={(e) => setMaxVehicles(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  min="1"
                />
              </div>
            </div>
          </div>

          {/* Vehicle Requirements */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-800 border-b pb-2">דרישות רכב</h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <label className="flex items-center gap-2 cursor-pointer bg-gray-50 p-3 rounded-lg">
                <input
                  type="checkbox"
                  checked={requiresLifted}
                  onChange={(e) => setRequiresLifted(e.target.checked)}
                  className="w-4 h-4 text-amber-600 border-gray-300 rounded focus:ring-amber-500"
                />
                <span className="text-sm text-gray-700">מוגבה</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer bg-gray-50 p-3 rounded-lg">
                <input
                  type="checkbox"
                  checked={requiresLockers}
                  onChange={(e) => setRequiresLockers(e.target.checked)}
                  className="w-4 h-4 text-amber-600 border-gray-300 rounded focus:ring-amber-500"
                />
                <span className="text-sm text-gray-700">נעילות</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer bg-gray-50 p-3 rounded-lg">
                <input
                  type="checkbox"
                  checked={requiresLowGear}
                  onChange={(e) => setRequiresLowGear(e.target.checked)}
                  className="w-4 h-4 text-amber-600 border-gray-300 rounded focus:ring-amber-500"
                />
                <span className="text-sm text-gray-700">הילוך כוח</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer bg-gray-50 p-3 rounded-lg">
                <input
                  type="checkbox"
                  checked={requiresArmored}
                  onChange={(e) => setRequiresArmored(e.target.checked)}
                  className="w-4 h-4 text-amber-600 border-gray-300 rounded focus:ring-amber-500"
                />
                <span className="text-sm text-gray-700">ממוגן</span>
              </label>
            </div>
          </div>

          {/* Additional Info */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-800 border-b pb-2">פרטים נוספים</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  מחיר (₪)
                </label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="אופציונלי"
                  min="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  לינק למסלול ב-Ofroad
                </label>
                <input
                  type="url"
                  value={ofroadLink}
                  onChange={(e) => setOfroadLink(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="https://..."
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                הערות נוספות
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                placeholder="הערות, המלצות, או דברים שחשוב לדעת..."
              />
            </div>
          </div>

          {/* Submit */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onBack}
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-3 px-4 rounded-lg transition-all"
            >
              ביטול
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-amber-600 hover:bg-amber-700 text-white font-semibold py-3 px-4 rounded-lg transition-all disabled:opacity-50 shadow-lg hover:shadow-xl"
            >
              {loading ? 'יוצר טיול...' : 'צור טיול 🎉'}
            </button>
          </div>
        </form>
      </main>
    </div>
  )
}
