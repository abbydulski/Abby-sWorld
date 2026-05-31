import type { HTMLAttributes } from 'react'

type Props = HTMLAttributes<HTMLDivElement>

export function Card({ className = '', children, ...props }: Props) {
  return (
    <div {...props} className={['bg-surface rounded-lg shadow-card', className].join(' ')}>
      {children}
    </div>
  )
}
