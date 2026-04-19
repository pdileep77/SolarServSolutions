'use client'

import { useState } from 'react'
import StatusBadge from '@/components/ui/StatusBadge'

interface Technician {
  id: string
  name: string
}

interface ServiceRequest {
  id: string
  serviceType: string
  status: string
  requestedDatetime: Date
  notes: string | null
  user: { name: string; email: string }
  asset: { panelBrand: string }
  technician: { name: string } | null
}

interface RequestsClientProps {
  initialRequests: ServiceRequest[]
  technicians: Technician[]
}

const STATUS_OPTIONS = ['All', 'Scheduled', 'InProgress', 'Completed', 'Cancelled']
const TYPE_OPTIONS = ['All', 'cleaning', 'inspection', 'maintenance']

export default function RequestsClient({
  initialRequests,
  technicians,
}: RequestsClientProps) {
  const [requests, setRequests] = useState(initialRequests)
  const [statusFilter, setStatusFilter] = useState('All')
  const [typeFilter, setTypeFilter] = useState('All')
  const [search, setSearch] = useState('')
  const [updating, setUpdating] = useState<string | null>(null)

  const filtered = requests.filter((r) => {
    if (statusFilter !== 'All' && r.status !== statusFilter) return false
    if (typeFilter !== 'All' && r.serviceType !== typeFilter) return false
    if (
      search &&
      !r.user.name.toLowerCase().includes(search.toLowerCase()) &&
      !r.asset.panelBrand.toLowerCase().includes(search.toLowerCase())
    )
      return false
    return true
  })

  const handleUpdate = async (
    id: string,
    field: 'status' | 'assignedTechnicianId',
    value: string
  ) => {
    setUpdating(id)
    try {
      const res = await fetch('/api/admin/requests', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, [field]: value }),
      })
      if (res.ok) {
        const updated = await res.json()
        setRequests((prev) =>
          prev.map((r) =>
            r.id === id
              ? {
                  ...r,
                  status: updated.status,
                  technician: updated.technician,
                }
              : r
          )
        )
      }
    } catch {}
    setUpdating(null)
  }

  const selectClass =
    'px-3 py-1.5 rounded-lg text-xs font-medium outline-none cursor-pointer'
  const selectStyle = {
    background: 'var(--color-surface-container-low)',
    color: 'var(--color-on-surface)',
    border: 'none',
  }

  return (
    <div>
      {/* Filter Bar */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <input
          type="search"
          placeholder="Search user or asset..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 min-w-[200px] px-4 py-2 rounded-xl text-sm outline-none"
          style={{ background: 'var(--color-surface-container-low)', color: 'var(--color-on-surface)' }}
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className={selectClass}
          style={selectStyle}
        >
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>{s === 'All' ? 'All Status' : s}</option>
          ))}
        </select>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className={selectClass}
          style={selectStyle}
        >
          {TYPE_OPTIONS.map((t) => (
            <option key={t} value={t} className="capitalize">
              {t === 'All' ? 'All Types' : t}
            </option>
          ))}
        </select>
        <span className="text-sm" style={{ color: 'var(--color-on-surface-variant)' }}>
          {filtered.length} results
        </span>
      </div>

      {/* Table */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{ background: 'var(--color-surface-container-lowest)' }}
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ background: 'var(--color-surface-container-low)' }}>
                {['User', 'Asset', 'Type', 'Date', 'Status', 'Technician', 'Actions'].map(
                  (col) => (
                    <th
                      key={col}
                      className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider"
                      style={{ color: 'var(--color-on-surface-variant)' }}
                    >
                      {col}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {filtered.map((req, i) => (
                <tr
                  key={req.id}
                  style={{
                    borderTop: i > 0 ? '1px solid var(--color-surface-container)' : 'none',
                  }}
                >
                  <td className="px-4 py-3">
                    <div className="text-sm font-semibold" style={{ color: 'var(--color-on-surface)' }}>
                      {req.user.name}
                    </div>
                    <div className="text-xs" style={{ color: 'var(--color-on-surface-variant)' }}>
                      {req.user.email}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm" style={{ color: 'var(--color-on-surface)' }}>
                    {req.asset.panelBrand}
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm capitalize" style={{ color: 'var(--color-on-surface)' }}>
                      {req.serviceType}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs" style={{ color: 'var(--color-on-surface-variant)' }}>
                    {new Date(req.requestedDatetime).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={req.status} />
                  </td>
                  <td className="px-4 py-3">
                    <select
                      defaultValue={req.technician ? technicians.find(t => t.name === req.technician?.name)?.id || '' : ''}
                      onChange={(e) =>
                        handleUpdate(req.id, 'assignedTechnicianId', e.target.value)
                      }
                      className={selectClass}
                      style={selectStyle}
                      disabled={updating === req.id}
                    >
                      <option value="">Unassigned</option>
                      {technicians.map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.name}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={req.status}
                      onChange={(e) => handleUpdate(req.id, 'status', e.target.value)}
                      className={selectClass}
                      style={{
                        ...selectStyle,
                        background: 'var(--color-surface-container)',
                      }}
                      disabled={updating === req.id}
                    >
                      {['Scheduled', 'InProgress', 'Completed', 'Cancelled'].map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-12 text-center text-sm"
                    style={{ color: 'var(--color-on-surface-variant)' }}
                  >
                    No requests found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
