import type { InputHTMLAttributes } from 'react'

type Props = InputHTMLAttributes<HTMLInputElement> & { label?: string }

export function Input({ label, className = '', id, ...props }: Props) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && <label htmlFor={id} className="text-[12px] text-text-secondary font-medium">{label}</label>}
      <input
        {...props}
        id={id}
        className={[
          'w-full px-3 py-2 rounded bg-surface border border-border-soft text-text-primary text-sm',
          'placeholder:text-text-tertiary',
          'focus:outline-none focus:border-border transition-all duration-150',
          className,
        ].join(' ')}
      />
    </div>
  )
}
