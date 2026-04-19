'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { CldUploadWidget } from 'next-cloudinary'

interface UploadResult {
  info: {
    secure_url: string
  }
}

export default function NewAssetPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [photoUrl, setPhotoUrl] = useState('')

  const [form, setForm] = useState({
    panelBrand: '',
    capacityKw: '',
    panelCount: '',
    installDate: '',
    lat: '',
    lng: '',
    propertyZone: '',
    assetType: 'Residential',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/assets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          capacityKw: parseFloat(form.capacityKw),
          panelCount: parseInt(form.panelCount),
          lat: form.lat ? parseFloat(form.lat) : undefined,
          lng: form.lng ? parseFloat(form.lng) : undefined,
          photoUrl: photoUrl || undefined,
        }),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to create asset')
      }
      router.push('/assets')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const inputClass =
    'w-full px-4 py-3 rounded-xl text-sm font-medium outline-none transition-all focus:ring-2'
  const inputStyle = {
    background: 'var(--color-surface-container-low)',
    color: 'var(--color-on-surface)',
    border: 'none',
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm font-medium mb-4"
          style={{ color: 'var(--color-on-surface-variant)' }}
        >
          ← Back
        </button>
        <h1
          className="text-3xl font-extrabold mb-1"
          style={{ color: 'var(--color-primary-container)' }}
        >
          Register Solar Asset
        </h1>
        <p style={{ color: 'var(--color-on-surface-variant)' }}>
          Add your solar panel system to start managing it.
        </p>
      </div>

      {/* Step indicator */}
      <div className="flex items-center gap-3 mb-8">
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
          style={{
            background: 'var(--color-secondary-container)',
            color: 'var(--color-on-secondary-container)',
          }}
        >
          1
        </div>
        <span className="text-sm font-semibold" style={{ color: 'var(--color-primary-container)' }}>
          Asset Details
        </span>
        <div
          className="flex-1 h-1 rounded-full"
          style={{ background: 'var(--color-surface-container)' }}
        >
          <div
            className="h-full rounded-full w-full transition-all"
            style={{ background: 'var(--color-secondary-container)' }}
          />
        </div>
        <span className="text-xs" style={{ color: 'var(--color-on-surface-variant)' }}>
          Step 1 of 1
        </span>
      </div>

      <form
        onSubmit={handleSubmit}
        className="rounded-3xl p-8 space-y-6"
        style={{ background: 'var(--color-surface-container-lowest)' }}
      >
        {/* Asset Type */}
        <div>
          <label
            className="block text-sm font-semibold mb-3"
            style={{ color: 'var(--color-primary-container)' }}
          >
            Asset Type *
          </label>
          <div className="grid grid-cols-3 gap-3">
            {(['Residential', 'Commercial', 'Agriculture'] as const).map((type) => {
              const icons = { Residential: '🏠', Commercial: '🏢', Agriculture: '🌾' }
              const selected = form.assetType === type
              return (
                <button
                  key={type}
                  type="button"
                  onClick={() => setForm((prev) => ({ ...prev, assetType: type }))}
                  className="flex flex-col items-center gap-2 py-4 px-3 rounded-2xl text-sm font-semibold transition-all"
                  style={{
                    background: selected
                      ? 'var(--color-primary-container)'
                      : 'var(--color-surface-container-low)',
                    color: selected
                      ? 'var(--color-surface-container-lowest)'
                      : 'var(--color-on-surface)',
                    outline: selected ? '2px solid var(--color-secondary-container)' : 'none',
                    outlineOffset: '2px',
                  }}
                >
                  <span className="text-2xl">{icons[type]}</span>
                  {type}
                </button>
              )
            })}
          </div>
        </div>

        {/* Panel Brand */}
        <div>
          <label
            className="block text-sm font-semibold mb-2"
            style={{ color: 'var(--color-primary-container)' }}
          >
            Panel Brand *
          </label>
          <input
            name="panelBrand"
            value={form.panelBrand}
            onChange={handleChange}
            required
            placeholder="e.g. SunPower, LG Solar, Jinko"
            className={inputClass}
            style={inputStyle}
          />
        </div>

        {/* Capacity + Panel Count */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label
              className="block text-sm font-semibold mb-2"
              style={{ color: 'var(--color-primary-container)' }}
            >
              Capacity (kW) *
            </label>
            <input
              name="capacityKw"
              type="number"
              step="0.1"
              min="0.1"
              value={form.capacityKw}
              onChange={handleChange}
              required
              placeholder="e.g. 6.5"
              className={inputClass}
              style={inputStyle}
            />
          </div>
          <div>
            <label
              className="block text-sm font-semibold mb-2"
              style={{ color: 'var(--color-primary-container)' }}
            >
              Number of Panels *
            </label>
            <input
              name="panelCount"
              type="number"
              min="1"
              value={form.panelCount}
              onChange={handleChange}
              required
              placeholder="e.g. 20"
              className={inputClass}
              style={inputStyle}
            />
          </div>
        </div>

        {/* Install Date */}
        <div>
          <label
            className="block text-sm font-semibold mb-2"
            style={{ color: 'var(--color-primary-container)' }}
          >
            Install Date *
          </label>
          <input
            name="installDate"
            type="date"
            value={form.installDate}
            onChange={handleChange}
            required
            className={inputClass}
            style={inputStyle}
          />
        </div>

        {/* GPS Coordinates */}
        <div>
          <label
            className="block text-sm font-semibold mb-2"
            style={{ color: 'var(--color-primary-container)' }}
          >
            GPS Coordinates (optional)
          </label>
          <div className="grid grid-cols-2 gap-4">
            <input
              name="lat"
              type="number"
              step="any"
              value={form.lat}
              onChange={handleChange}
              placeholder="Latitude e.g. 3.1390"
              className={inputClass}
              style={inputStyle}
            />
            <input
              name="lng"
              type="number"
              step="any"
              value={form.lng}
              onChange={handleChange}
              placeholder="Longitude e.g. 101.6869"
              className={inputClass}
              style={inputStyle}
            />
          </div>
        </div>

        {/* Property Zone */}
        <div>
          <label
            className="block text-sm font-semibold mb-2"
            style={{ color: 'var(--color-primary-container)' }}
          >
            Property Zone (optional)
          </label>
          <input
            name="propertyZone"
            value={form.propertyZone}
            onChange={handleChange}
            placeholder="e.g. Zone A, North Wing"
            className={inputClass}
            style={inputStyle}
          />
        </div>

        {/* Photo Upload */}
        <div>
          <label
            className="block text-sm font-semibold mb-2"
            style={{ color: 'var(--color-primary-container)' }}
          >
            Asset Photo (optional)
          </label>
          {photoUrl ? (
            <div className="flex items-center gap-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={photoUrl}
                alt="Uploaded asset"
                className="w-20 h-20 rounded-xl object-cover"
              />
              <div>
                <p
                  className="text-sm font-medium"
                  style={{ color: 'var(--color-on-tertiary-container)' }}
                >
                  ✓ Photo uploaded
                </p>
                <button
                  type="button"
                  onClick={() => setPhotoUrl('')}
                  className="text-xs mt-1"
                  style={{ color: 'var(--color-error)' }}
                >
                  Remove
                </button>
              </div>
            </div>
          ) : (
            <CldUploadWidget
              uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'solarserv_assets'}
              onSuccess={(result: any) => {
                if (result?.info?.secure_url) {
                  setPhotoUrl(result.info.secure_url)
                }
              }}
            >
              {({ open }) => (
                <button
                  type="button"
                  onClick={() => open()}
                  className="w-full py-8 rounded-xl border-2 border-dashed flex flex-col items-center gap-2 transition-all hover:opacity-80"
                  style={{
                    borderColor: 'var(--color-outline-variant)',
                    color: 'var(--color-on-surface-variant)',
                  }}
                >
                  <span className="text-3xl">📸</span>
                  <span className="text-sm font-medium">Click to upload photo</span>
                  <span className="text-xs">PNG, JPG, WEBP up to 10MB</span>
                </button>
              )}
            </CldUploadWidget>
          )}
        </div>

        {error && (
          <p
            className="text-sm font-medium px-4 py-3 rounded-xl"
            style={{
              background: 'rgba(186,26,26,0.08)',
              color: 'var(--color-error)',
            }}
          >
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 rounded-2xl font-bold text-base transition-all hover:opacity-90 disabled:opacity-60"
          style={{
            background: 'var(--color-secondary-container)',
            color: 'var(--color-on-secondary-container)',
          }}
        >
          {loading ? 'Registering...' : 'Register Asset'}
        </button>
      </form>
    </div>
  )
}
