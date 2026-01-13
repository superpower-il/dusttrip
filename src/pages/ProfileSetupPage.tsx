import { useState } from 'react'
import { supabase } from '../lib/supabase'

interface ProfileSetupPageProps {
  userId: string
  onComplete: () => void
}

export default function ProfileSetupPage({ userId, onComplete }: ProfileSetupPageProps) {
  const [step, setStep] = useState<'address' | 'vehicle'>('address')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Address form state
  const [address, setAddress] = useState('')

  // Vehicle form state
  const [manufacturer, setManufacturer] = useState('')
  const [model, setModel] = useState('')
  const [year, setYear] = useState('')
  const [isLifted, setIsLifted] = useState(false)
  const [hasLockers, setHasLockers] = useState(false)
  const [hasLowGear, setHasLowGear] = useState(false)
  const [isArmored, setIsArmored] = useState(false)
  const [hasRescueGear, setHasRescueGear] = useState(false)

  const handleAddressSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ address })
        .eq('id', userId)

      if (error) throw error

      setStep('vehicle')
    } catch (err: any) {
      setError(err.message || 'אירעה שגיאה')
    } finally {
      setLoading(false)
    }
  }

  const handleVehicleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!hasRescueGear) {
      setError('ציוד חילוץ הוא חובה!')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const { error } = await supabase
        .from('vehicles')
        .insert({
          user_id: userId,
          manufacturer,
          model,
          year: year ? parseInt(year) : null,
          is_lifted: isLifted,
          has_lockers: hasLockers,
          has_low_gear: hasLowGear,
          is_armored: isArmored,
          has_rescue_gear: hasRescueGear,
        })

      if (error) throw error

      onComplete()
    } catch (err: any) {
      setError(err.message || 'אירעה שגיאה')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-amber-100 flex items-center justify-center p-4" dir="rtl">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🚙</div>
          <h1 className="text-3xl font-bold text-amber-800 mb-2">השלמת פרופיל</h1>
          <p className="text-amber-600">
            עוד כמה פרטים ונתחיל לטייל!
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center">
            <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
              step === 'address' ? 'bg-amber-600 text-white' : 'bg-green-500 text-white'
            }`}>
              {step === 'vehicle' ? '✓' : '1'}
            </div>
            <div className="text-sm font-medium mr-2 ml-4">כתובת</div>
          </div>
          <div className="w-16 h-1 bg-gray-300 mx-2"></div>
          <div className="flex items-center">
            <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
              step === 'vehicle' ? 'bg-amber-600 text-white' : 'bg-gray-300 text-gray-600'
            }`}>
              2
            </div>
            <div className="text-sm font-medium mr-2">פרטי רכב</div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}

        {/* Address Form */}
        {step === 'address' && (
          <form onSubmit={handleAddressSubmit} className="space-y-6">
            <div>
              <label htmlFor="address" className="block text-lg font-medium text-gray-700 mb-2">
                כתובת מגורים
              </label>
              <p className="text-sm text-gray-500 mb-3">
                נשתמש בכתובת כדי לחשב זמן נסיעה מומלץ לטיולים
              </p>
              <input
                id="address"
                type="text"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all text-lg"
                placeholder="רחוב 123, עיר"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-amber-600 hover:bg-amber-700 text-white font-semibold py-3 px-4 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
            >
              {loading ? 'שומר...' : 'המשך לפרטי רכב →'}
            </button>
          </form>
        )}

        {/* Vehicle Form */}
        {step === 'vehicle' && (
          <form onSubmit={handleVehicleSubmit} className="space-y-6">
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
              <p className="text-sm text-amber-800">
                <strong>שים לב:</strong> פרטי הרכב ישמשו לבדיקת התאמה לדרישות הטיולים. ציוד חילוץ הוא חובה!
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="manufacturer" className="block text-sm font-medium text-gray-700 mb-1">
                  יצרן
                </label>
                <input
                  id="manufacturer"
                  type="text"
                  required
                  value={manufacturer}
                  onChange={(e) => setManufacturer(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                  placeholder="טויוטה, ג'יפ, סוזוקי..."
                />
              </div>

              <div>
                <label htmlFor="model" className="block text-sm font-medium text-gray-700 mb-1">
                  דגם
                </label>
                <input
                  id="model"
                  type="text"
                  required
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                  placeholder="לנד קרוזר, רנגלר..."
                />
              </div>
            </div>

            <div>
              <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-1">
                שנה (אופציונלי)
              </label>
              <input
                id="year"
                type="number"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                placeholder="2020"
                min="1980"
                max="2026"
              />
            </div>

            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">מפרט הרכב</h3>
              <div className="space-y-3">
                <label className="flex items-center justify-between bg-gray-50 p-4 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                  <span className="text-gray-700 font-medium">מוגבה</span>
                  <input
                    type="checkbox"
                    checked={isLifted}
                    onChange={(e) => setIsLifted(e.target.checked)}
                    className="w-5 h-5 text-amber-600 border-gray-300 rounded focus:ring-amber-500"
                  />
                </label>

                <label className="flex items-center justify-between bg-gray-50 p-4 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                  <span className="text-gray-700 font-medium">נעילות דיפרנציאל</span>
                  <input
                    type="checkbox"
                    checked={hasLockers}
                    onChange={(e) => setHasLockers(e.target.checked)}
                    className="w-5 h-5 text-amber-600 border-gray-300 rounded focus:ring-amber-500"
                  />
                </label>

                <label className="flex items-center justify-between bg-gray-50 p-4 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                  <span className="text-gray-700 font-medium">הילוך כוח (4L)</span>
                  <input
                    type="checkbox"
                    checked={hasLowGear}
                    onChange={(e) => setHasLowGear(e.target.checked)}
                    className="w-5 h-5 text-amber-600 border-gray-300 rounded focus:ring-amber-500"
                  />
                </label>

                <label className="flex items-center justify-between bg-gray-50 p-4 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                  <span className="text-gray-700 font-medium">ממוגן (גחון + מיכל)</span>
                  <input
                    type="checkbox"
                    checked={isArmored}
                    onChange={(e) => setIsArmored(e.target.checked)}
                    className="w-5 h-5 text-amber-600 border-gray-300 rounded focus:ring-amber-500"
                  />
                </label>

                <label className="flex items-center justify-between bg-green-50 p-4 rounded-lg cursor-pointer hover:bg-green-100 transition-colors border-2 border-green-300">
                  <div>
                    <span className="text-gray-700 font-medium">ציוד חילוץ</span>
                    <span className="text-red-600 font-bold mr-1">*</span>
                    <p className="text-xs text-gray-500 mt-1">חובה! (חבלים, מגבה, וכו')</p>
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

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setStep('address')}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-3 px-4 rounded-lg transition-all"
              >
                ← חזור
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-amber-600 hover:bg-amber-700 text-white font-semibold py-3 px-4 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
              >
                {loading ? 'שומר...' : 'סיום והתחל לטייל! 🎉'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
