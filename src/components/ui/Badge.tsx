import { cn } from '@/lib/utils'

interface StatusBadgeProps {
  open: boolean
  className?: string
}

export function StatusBadge({ open, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        'text-[7px] font-bold rounded-full px-2 py-0.5 border shrink-0',
        open
          ? 'bg-open-green/10 text-open-green border-open-green/25'
          : 'bg-closed-red/10 text-closed-red border-closed-red/20',
        className
      )}
    >
      {open ? 'KHULA' : 'BAND'}
    </span>
  )
}

interface CategoryBadgeProps {
  label: string
  color: string
  className?: string
}

export function CategoryBadge({ label, color, className }: CategoryBadgeProps) {
  return (
    <span
      className={cn('text-[9px] font-semibold rounded-full px-2.5 py-0.5', className)}
      style={{ background: `${color}22`, color, border: `1px solid ${color}44` }}
    >
      {label}
    </span>
  )
}
