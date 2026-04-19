'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

const SERVICE_TYPES = [
  {
    id: 'cleaning',
    label: 'Cleaning',
    icon: '🧹',
    desc: 'Professional panel cleaning to maximize efficiency',
  },
  {
    id: 'inspection',
    label: 'Inspection',
    icon: '🔍',
    desc: 'Full system inspection and performance report',
  },
  {
    id: 'maintenance',
    label: 'Maintenance',
    icon: '🔧',
    desc: 'Comprehensive maintenance and repair service',
  },
]

const TIME_SLOTS = ['09:00', '10:30', '12:00', '13:30', '15:00', '16:30']

interface Asset {
  id: string
  panelBrand: string
  capacityKw: number
}

export default function BookPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [assets, setAssets] = useState<Asset[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [serviceType, setServiceType] = useState('')
  const [assetId, setAssetId] = useState('')
  const [date, setDate] = useState('')
  const [timeSlot, setTimeSlot] = useState('')
  const [notes, setNotes] = useState('')

  useEffect(() => {
    fetch('/api/assets')
      .then((r) => r.json())
      .then((data) => setAssets(data))
      .catch(() => {})
  }, [])

  const handleConfirm = async () => {
    if (!serviceType || !assetId || !date || !timeSlot) {
      setError('Please fill in all required fields.')
      return
    }
    setLoading(true)
    setError('')
    try {
      const requestedDatetime = new Date(`${date}T${timeSlot}:00`)
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ serviceType, assetId, requestedDatetime, notes }),
      })
      if (!res.ok) {
        const d = await res.json()
        throw new Error(d.error || 'Failed to book')
      }
      router.push('/history')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const selectedAsset = assets.find((a) => a.id === assetId)
  const selectedService = SERVICE_TYPES.find((s) => s.id === serviceType)

  const canGoNext =
    (step === 1 && serviceType) ||
    (step === 2 && assetId) ||
    (step === 3 && date && timeSlot)

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <div className="mb-8">
        <h1
          className="text-3xl font-extrabold mb-1"
          style={{ color: 'var(--color-primary-container)' }}
        >
          Book a Service
        </h1>
        <p style={{ color: 'var(--color-on-surface-variant)' }}>
          Schedule professional service for your solar assets.
        </p>
      </div>

      {/* Step Indicator */}
      <div className="flex items-center gap-2 mb-8">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all"
              style={{
                background:
                  s === step
                    ? 'var(--color-secondary-container)'
                    : s < step
                    ? 'var(--color-on-tertiary-container)'
                    : 'var(--color-surface-container)',
                color:
                  s === step
                    ? 'var(--color-on-secondary-container)'
                    : s < step
                    ? '#fff'
                    : 'var(--color-on-surface-variant)',
              }}
            >
              {s < step ? '✓' : s}
            </div>
            <span
              className="text-sm font-medium hidden sm:block"
              style={{
                color:
                  s === step
                    ? 'var(--color-primary-container)'
                    : 'var(--color-on-surface-variant)',
              }}
            >
              {s === 1 ? 'Service Type' : s === 2 ? 'Select Asset' : 'Date & Time'}
            </span>
            {s < 3 && (
              <div
                className="w-12 h-1 rounded-full mx-2"
                style={{
                  background:
                    s < step
                      ? 'var(--color-on-tertiary-container)'
                      : 'var(--color-surface-container)',
                }}
              />
            )}
          </div>
        ))}
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main Content */}
        <div className="flex-1">
          {/* Step 1: Service Type */}
          {step === 1 && (
            <div
              className="rounded-3xl p-8"
              style={{ background: 'var(--color-surface-container-lowest)' }}
            >
              <h2
                className="text-xl font-bold mb-6"
                style={{ color: 'var(--color-primary-container)' }}
              >
                What service do you need?
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {SERVICE_TYPES.map((svc) => (
                  <button
                    key={svc.id}
                    onClick={() => setServiceType(svc.id)}
                    className="p-6 rounded-2xl text-left transition-all hover:scale-[1.02]"
                    style={{
                      background:
                        serviceType === svc.id
                          ? 'var(--color-primary-container)'
                          : 'var(--color-surface-container-low)',
                      outline:
                        serviceType === svc.id
                          ? '2px solid var(--color-secondary-container)'
                          : 'none',
                    }}
                  >
                    <div className="text-4xl mb-3">{svc.icon}</div>
                    <div
                      className="font-bold text-lg mb-1"
                      style={{
                        color:
                          serviceType === svc.id
                            ? 'var(--color-surface-container-lowest)'
                            : 'var(--color-primary-container)',
                      }}
                    >
                      {svc.label}
                    </div>
                    <div
                      className="text-sm"
                      style={{
                        color:
                          serviceType === svc.id
                            ? 'var(--color-on-primary-container)'
                            : 'var(--color-on-surface-variant)',
                      }}
                    >
                      {svc.desc}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Select Asset */}
          {step === 2 && (
            <div
              className="rounded-3xl p-8"
              style={{ background: 'var(--color-surface-container-lowest)' }}
            >
              <h2
                className="text-xl font-bold mb-6"
                style={{ color: 'var(--color-primary-container)' }}
              >
                Which asset?
              </h2>
              {assets.length === 0 ? (
                <p style={{ color: 'var(--color-on-surface-variant)' }}>
                  No assets found. Please register an asset first.
                </p>
              ) : (
                <div className="space-y-3">
                  {assets.map((asset) => (
                    <button
                      key={asset.id}
                      onClick={() => setAssetId(asset.id)}
                      className="w-full p-5 rounded-2xl text-left flex items-center gap-4 transition-all"
                      style={{
                        background:
                          assetId === asset.id
                            ? 'var(--color-primary-container)'
                            : 'var(--color-surface-container-low)',
                        outline:
                          assetId === asset.id
                            ? '2px solid var(--color-secondary-container)'
                            : 'none',
                      }}
                    >
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0"
                        style={{ background: 'rgba(245,158,11,0.15)' }}
                      >
                        ⚡
                      </div>
                      <div>
                        <div
                          className="font-bold"
                          style={{
                            color:
                              assetId === asset.id
                                ? 'var(--color-surface-container-lowest)'
                                : 'var(--color-primary-container)',
                          }}
                        >
                          {asset.panelBrand}
                        </div>
                        <div
                          className="text-sm"
                          style={{
                            color:
                              assetId === asset.id
                                ? 'var(--color-on-primary-container)'
                                : 'var(--color-on-surface-variant)',
                          }}
                        >
                          {asset.capacityKw} kW system
                        </div>
                      </div>
                      {assetId === asset.id && (
                        <span className="ml-auto text-xl">✓</span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Step 3: Date & Time */}
          {step === 3 && (
            <div
              className="rounded-3xl p-8 space-y-6"
              style={{ background: 'var(--color-surface-container-lowest)' }}
            >
              <div>
                <h2
                  className="text-xl font-bold mb-4"
                  style={{ color: 'var(--color-primary-container)' }}
                >
                  Choose a date
                </h2>
                <input
                  type="date"
                  value={date}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl text-sm font-medium outline-none"
                  style={{
                    background: 'var(--color-surface-container-low)',
                    color: 'var(--color-on-surface)',
                  }}
                />
              </div>

              <div>
                <h2
                  className="text-xl font-bold mb-4"
                  style={{ color: 'var(--color-primary-container)' }}
                >
                  Pick a time slot
                </h2>
                <div className="grid grid-cols-3 gap-3">
                  {TIME_SLOTS.map((slot) => (
                    <button
                      key={slot}
                      onClick={() => setTimeSlot(slot)}
                      className="py-3 rounded-xl font-semibold text-sm transition-all hover:scale-[1.02]"
                      style={{
                        background:
                          timeSlot === slot
                            ? 'var(--color-secondary-container)'
                            : 'var(--color-surface-container-low)',
                        color:
                          timeSlot === slot
                            ? 'var(--color-on-secondary-container)'
                            : 'var(--color-on-surface)',
                      }}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label
                  className="block text-sm font-semibold mb-2"
                  style={{ color: 'var(--color-primary-container)' }}
                >
                  Notes (optional)
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  placeholder="Any specific issues or instructions..."
                  className="w-full px-4 py-3 rounded-xl text-sm font-medium outline-none resize-none"
                  style={{
                    background: 'var(--color-surface-container-low)',
                    color: 'var(--color-on-surface)',
                  }}
                />
              </div>
            </div>
          )}

          {error && (
            <p
              className="mt-4 text-sm font-medium px-4 py-3 rounded-xl"
              style={{ background: 'rgba(186,26,26,0.08)', color: 'var(--color-error)' }}
            >
              {error}
            </p>
          )}

          {/* Navigation */}
          <div className="flex justify-between mt-6">
            {step > 1 ? (
              <button
                onClick={() => setStep((s) => s - 1)}
                className="px-6 py-3 rounded-2xl font-semibold"
                style={{
                  background: 'var(--color-surface-container)',
                  color: 'var(--color-on-surface)',
                }}
              >
                ← Back
              </button>
            ) : (
              <div />
            )}
            {step < 3 ? (
              <button
                onClick={() => setStep((s) => s + 1)}
                disabled={!canGoNext}
                className="px-6 py-3 rounded-2xl font-semibold disabled:opacity-50 transition-all hover:opacity-90"
                style={{
                  background: 'var(--color-secondary-container)',
                  color: 'var(--color-on-secondary-container)',
                }}
              >
                Next →
              </button>
            ) : (
              <button
                onClick={handleConfirm}
                disabled={loading || !canGoNext}
                className="px-8 py-3 rounded-2xl font-bold disabled:opacity-50 transition-all hover:opacity-90"
                style={{
                  background: 'var(--color-secondary-container)',
                  color: 'var(--color-on-secondary-container)',
                }}
              >
                {loading ? 'Booking...' : 'Confirm Booking ✓'}
              </button>
            )}
          </div>
        </div>

        {/* Sidebar Summary */}
        <div className="lg:w-72 shrink-0">
          <div
            className="rounded-3xl p-6 sticky top-24"
            style={{ background: 'var(--color-primary-container)' }}
          >
            <h3
              className="font-bold text-lg mb-4"
              style={{ color: 'var(--color-surface-container-lowest)' }}
            >
              Booking Summary
            </h3>
            <div className="space-y-4">
              <div>
                <div
                  className="text-xs font-semibold uppercase tracking-wider mb-1"
                  style={{ color: 'var(--color-on-primary-container)' }}
                >
                  Service
                </div>
                <div
                  className="font-semibold"
                  style={{ color: 'var(--color-surface-container-lowest)' }}
                >
                  {selectedService
                    ? `${selectedService.icon} ${selectedService.label}`
                    : '—'}
                </div>
              </div>
              <div>
                <div
                  className="text-xs font-semibold uppercase tracking-wider mb-1"
                  style={{ color: 'var(--color-on-primary-container)' }}
                >
                  Asset
                </div>
                <div
                  className="font-semibold"
                  style={{ color: 'var(--color-surface-container-lowest)' }}
                >
                  {selectedAsset ? selectedAsset.panelBrand : '—'}
                </div>
              </div>
              <div>
                <div
                  className="text-xs font-semibold uppercase tracking-wider mb-1"
                  style={{ color: 'var(--color-on-primary-container)' }}
                >
                  Date & Time
                </div>
                <div
                  className="font-semibold"
                  style={{ color: 'var(--color-surface-container-lowest)' }}
                >
                  {date && timeSlot
                    ? `${new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} at ${timeSlot}`
                    : '—'}
                </div>
              </div>
              {notes && (
                <div>
                  <div
                    className="text-xs font-semibold uppercase tracking-wider mb-1"
                    style={{ color: 'var(--color-on-primary-container)' }}
                  >
                    Notes
                  </div>
                  <div
                    className="text-sm"
                    style={{ color: 'var(--color-on-primary-container)' }}
                  >
                    {notes}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
