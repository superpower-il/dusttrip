import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import type { Profile, Vehicle } from '../types'

interface ProfilePageProps {
  onBack: () => void
}

export default function ProfilePage({ onBack }: ProfilePageProps) {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  
  const [profile, setProfile] = useState<Profile | null>(null)
  const [vehicle, setVehicle] = useState<Vehicle | null>(null)
  
  // Edit mode states
  const [editMode, setEditMode] = useState<'profile' | 'vehicle' | null>(null)
  
  // Profile form
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  
  // Vehicle form
  const [manufacturer, setManufacturer] = useState('')
  const [model, setModel] = useState('')
  const [year, setYear] = useState('')
  const [isLifted, setIsLifted] = useState(false)
  const [hasLockers, setHasLockers] = useState(false)
  const [hasLowGear, setHasLowGear] = useState(false)
  const [isArmored, setIsArmored] = useState(false)
  const [hasRescueGear, setHasRescueGear] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) return

      // Fetch profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (profileError) throw profileError

      setProfile(profileData)
      setFullName(profileData.full_name || '')
      setPhone(profileData.phone || '')
      setAddress(profileData.address || '')

      // Fetch vehicle
      const { data: vehicleData, error: vehicleError } = await supabase
        .from('vehicles')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (vehicleError) throw vehicleError

      setVehicle(vehicleData)
      setManufacturer(vehicleData.manufacturer || '')
      setModel(vehicleData.model || '')
      setYear(vehicleData.year?.toString() || '')
      setIsLifted(vehicleData.is_lifted || false)
      setHasLockers(vehicleData.has_lockers || false)
      setHasLowGear(vehicleData.has_low_gear || false)
      setIsArmored(vehicleData.is_armored || false)
      setHasRescueGear(vehicleData.has_rescue_gear || false)

    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)
    setSuccess(null)

    try {
      if (!profile) return

      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: fullName,
          phone: phone,
          address: address,
        })
        .eq('id', profile.id)

      if (error) throw error

      setSuccess('הפרופיל עודכן בהצלחה!')
      setEditMode(null)
      await fetchData()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleUpdateVehicle = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!hasRescueGear) {
      setError('ציוד חילוץ הוא חובה!')
      return
    }

    setSaving(true)
    setError(null)
    setSuccess(null)

    try {
      if (!vehicle) return

      const { error } = await supabase
        .from('vehicles')
        .update({
          manufacturer,
          model,
          year: year ? parseInt(year) : null,
          is_lifted: isLifted,
          has_lockers: hasLockers,
          has_low_gear: hasLowGear,
          is_armored: isArmored,
          has_rescue_gear: hasRescueGear,
        })
        .eq('id', vehicle.id)

      if (error) throw error

      setSuccess('פרטי הרכב עודכנו בהצלחה!')
      setEditMode(null)
      await fetchData()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center" dir="rtl">
        <div className="text-center">
          <div className="text-5xl mb-4">🚙</div>
          <p className="text-amber-800 text-xl">טוען...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50" dir="rtl">
      {/* Header */}
      <header className="bg-white shadow-md sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
          <button
            onClick={onBack}
            className="text-amber-600 hover:text-amber-800 text-2xl"
          >
            ←
          </button>
          <div>
            <h1 className="text-2xl font-bold text-amber-800">הפרופיל שלי</h1>
            <p className="text-sm text-amber-600">ערוך את הפרטים שלך</p>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Messages */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg mb-4">
            {success}
          </div>
        )}

        {/* Profile Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">פרטים אישיים</h2>
            {editMode !== 'profile' && (
              <button
                onClick={() => setEditMode('profile')}
                className="text-amber-600 hover:text-amber-800 font-medium"
              >
                ✏️ ערוך
              </button>
            )}
          </div>

          {editMode === 'profile' ? (
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  שם מלא
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  מספר טלפון
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  כתובת מגורים
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="רחוב 123, עיר"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setEditMode(null)
                    setFullName(profile?.full_name || '')
                    setPhone(profile?.phone || '')
                    setAddress(profile?.address || '')
                  }}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 px-4 rounded-lg transition-all"
                >
                  ביטול
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 bg-amber-600 hover:bg-amber-700 text-white font-semibold py-2 px-4 rounded-lg transition-all disabled:opacity-50"
                >
                  {saving ? 'שומר...' : 'שמור שינויים'}
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <div>
                <div className="text-sm text-gray-500">שם מלא</div>
                <div className="text-lg font-medium text-gray-800">{profile?.full_name}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">טלפון</div>
                <div className="text-lg font-medium text-gray-800">{profile?.phone}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">כתובת</div>
                <div className="text-lg font-medium text-gray-800">
                  {profile?.address || 'לא הוגדר'}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Vehicle Section */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">פרטי רכב</h2>
            {editMode !== 'vehicle' && (
              <button
                onClick={() => setEditMode('vehicle')}
                className="text-amber-600 hover:text-amber-800 font-medium"
              >
                ✏️ ערוך
              </button>
            )}
          </div>

          {editMode === 'vehicle' ? (
            <form onSubmit={handleUpdateVehicle} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    יצרן
                  </label>
                  <input
                    type="text"
                    required
                    value={manufacturer}
                    onChange={(e) => setManufacturer(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    דגם
                  </label>
                  <input
                    type="text"
                    required
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  שנה
                </label>
                <input
                  type="number"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  min="1980"
                  max="2026"
                />
              </div>

              <div className="border-t border-gray-200 pt-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">מפרט</h3>
                <div className="space-y-2">
                  <label className="flex items-center justify-between bg-gray-50 p-3 rounded-lg cursor-pointer">
                    <span className="text-gray-700">מוגבה</span>
                    <input
                      type="checkbox"
                      checked={isLifted}
                      onChange={(e) => setIsLifted(e.target.checked)}
                      className="w-5 h-5 text-amber-600 border-gray-300 rounded focus:ring-amber-500"
                    />
                  </label>
                  <label className="flex items-center justify-between bg-gray-50 p-3 rounded-lg cursor-pointer">
                    <span className="text-gray-700">נעילות דיפרנציאל</span>
                    <input
                      type="checkbox"
                      checked={hasLockers}
                      onChange={(e) => setHasLockers(e.target.checked)}
                      className="w-5 h-5 text-amber-600 border-gray-300 rounded focus:ring-amber-500"
                    />
                  </label>
                  <label className="flex items-center justify-between bg-gray-50 p-3 rounded-lg cursor-pointer">
                    <span className="text-gray-700">הילוך כוח (4L)</span>
                    <input
                      type="checkbox"
                      checked={hasLowGear}
                      onChange={(e) => setHasLowGear(e.target.checked)}
                      className="w-5 h-5 text-amber-600 border-gray-300 rounded focus:ring-amber-500"
                    />
                  </label>
                  <label className="flex items-center justify-between bg-gray-50 p-3 rounded-lg cursor-pointer">
                    <span className="text-gray-700">ממוגן (גחון + מיכל)</span>
                    <input
                      type="checkbox"
                      checked={isArmored}
                      onChange={(e) => setIsArmored(e.target.checked)}
                      className="w-5 h-5 text-amber-600 border-gray-300 rounded focus:ring-amber-500"
                    />
                  </label>
                  <label className="flex items-center justify-between bg-green-50 p-3 rounded-lg cursor-pointer border-2 border-green-300">
                    <div>
                      <span className="text-gray-700 font-medium">ציוד חילוץ</span>
                      <span className="text-red-600 font-bold mr-1">*</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={hasRescueGear}
                      onChange={(e) => setHasRescueGear(e.target.checked)}
                      className="w-5 h-5 text-green-600 border-gray-300 rounded focus:ring-green-500"
                    />
                  </label>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setEditMode(null)
                    setManufacturer(vehicle?.manufacturer || '')
                    setModel(vehicle?.model || '')
                    setYear(vehicle?.year?.toString() || '')
                    setIsLifted(vehicle?.is_lifted || false)
                    setHasLockers(vehicle?.has_lockers || false)
                    setHasLowGear(vehicle?.has_low_gear || false)
                    setIsArmored(vehicle?.is_armored || false)
                    setHasRescueGear(vehicle?.has_rescue_gear || false)
                  }}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 px-4 rounded-lg transition-all"
                >
                  ביטול
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 bg-amber-600 hover:bg-amber-700 text-white font-semibold py-2 px-4 rounded-lg transition-all disabled:opacity-50"
                >
                  {saving ? 'שומר...' : 'שמור שינויים'}
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <div>
                <div className="text-sm text-gray-500">רכב</div>
                <div className="text-lg font-medium text-gray-800">
                  {vehicle?.manufacturer} {vehicle?.model} {vehicle?.year && `(${vehicle.year})`}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-500 mb-2">מפרט</div>
                <div className="flex flex-wrap gap-2">
                  {vehicle?.is_lifted && (
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">מוגבה</span>
                  )}
                  {vehicle?.has_lockers && (
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">נעילות</span>
                  )}
                  {vehicle?.has_low_gear && (
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">הילוך כוח</span>
                  )}
                  {vehicle?.is_armored && (
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">ממוגן</span>
                  )}
                  {vehicle?.has_rescue_gear && (
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">✓ ציוד חילוץ</span>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
