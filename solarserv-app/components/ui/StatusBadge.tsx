type ServiceStatus = 'Scheduled' | 'InProgress' | 'Completed' | 'Cancelled'

interface StatusBadgeProps {
  status: ServiceStatus | string
}

const STATUS_CONFIG: Record<
  string,
  { bg: string; color: string; glow: string; label: string }
> = {
  Scheduled: {
    bg: 'rgba(245,158,11,0.12)',
    color: '#b45309',
    glow: '0 0 8px rgba(245,158,11,0.3)',
    label: 'Scheduled',
  },
  InProgress: {
    bg: 'rgba(29,111,168,0.12)',
    color: '#1d6fa8',
    glow: '0 0 8px rgba(29,111,168,0.3)',
    label: 'In Progress',
  },
  Completed: {
    bg: 'rgba(0,155,107,0.12)',
    color: '#009b6b',
    glow: '0 0 8px rgba(0,155,107,0.3)',
    label: 'Completed',
  },
  Cancelled: {
    bg: 'rgba(186,26,26,0.1)',
    color: '#ba1a1a',
    glow: '0 0 8px rgba(186,26,26,0.2)',
    label: 'Cancelled',
  },
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status] ?? {
    bg: 'rgba(69,71,78,0.1)',
    color: 'var(--color-on-surface-variant)',
    glow: 'none',
    label: status,
  }

  return (
    <span
      className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold shrink-0"
      style={{
        background: config.bg,
        color: config.color,
        boxShadow: config.glow,
      }}
    >
      {config.label}
    </span>
  )
}
