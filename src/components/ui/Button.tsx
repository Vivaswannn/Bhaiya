import { cn } from '@/lib/utils'
import { ButtonHTMLAttributes } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost' | 'glass'
  size?: 'sm' | 'md' | 'lg'
}

export function Button({ variant = 'primary', size = 'md', className, children, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        'font-jakarta font-semibold rounded-2xl transition-all active:scale-95 flex items-center justify-center gap-2',
        {
          'bg-violet text-white shadow-lg shadow-violet/30 hover:bg-violet/90': variant === 'primary',
          'bg-white/5 border border-white/10 text-white/70 hover:bg-white/10 backdrop-blur-md': variant === 'glass',
          'text-violet hover:bg-violet/10': variant === 'ghost',
        },
        {
          'text-xs px-3 py-1.5': size === 'sm',
          'text-sm px-4 py-2.5': size === 'md',
          'text-base px-6 py-3.5': size === 'lg',
        },
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}
