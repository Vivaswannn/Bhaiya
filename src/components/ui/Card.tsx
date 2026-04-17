import { cn } from '@/lib/utils'
import { HTMLAttributes } from 'react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'glass' | 'light'
}

export function Card({ variant = 'glass', className, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-2xl transition-all',
        {
          'bg-white/[0.05] border border-white/[0.08] backdrop-blur-xl': variant === 'glass',
          'bg-white border border-violet/[0.06] shadow-sm shadow-violet/5': variant === 'light',
        },
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
