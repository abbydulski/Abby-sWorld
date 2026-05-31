import type { ButtonHTMLAttributes } from 'react'

type Variant = 'primary' | 'ghost' | 'subtle'

type Props = ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }

const variantClasses: Record<Variant, string> = {
  primary: 'bg-primary text-white hover:bg-rose border border-primary',
  ghost: 'bg-transparent text-text-secondary hover:bg-panel hover:text-text-primary border border-border-soft',
  subtle: 'bg-primary-light text-primary hover:bg-primary-muted border border-border',
}

export function Button({ variant = 'primary', className = '', children, ...props }: Props) {
  return (
    <button
      {...props}
      className={[
        'inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-sm font-medium transition-all duration-150',
        variantClasses[variant],
        'disabled:opacity-40 disabled:cursor-not-allowed',
        className,
      ].join(' ')}
    >
      {children}
    </button>
  )
}
