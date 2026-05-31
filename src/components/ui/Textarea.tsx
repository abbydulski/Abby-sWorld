import type { TextareaHTMLAttributes } from 'react'

type Props = TextareaHTMLAttributes<HTMLTextAreaElement> & { label?: string }

export function Textarea({ label, className = '', id, ...props }: Props) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && <label htmlFor={id} className="text-[12px] text-text-secondary font-medium">{label}</label>}
      <textarea
        {...props}
        id={id}
        className={[
          'w-full px-3 py-2 rounded bg-surface border border-border-soft text-text-primary text-sm resize-none',
          'placeholder:text-text-tertiary',
          'focus:outline-none focus:border-border transition-all duration-150',
          className,
        ].join(' ')}
      />
    </div>
  )
}
