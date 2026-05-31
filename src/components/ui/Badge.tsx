type Color = 'blue' | 'yellow' | 'gray' | 'warm'

type Props = { color?: Color; children: React.ReactNode; className?: string }

const colorClasses: Record<Color, string> = {
  blue: 'bg-primary-light text-primary border border-border',
  yellow: 'bg-accent-fill text-rose border border-border',
  gray: 'bg-panel text-text-secondary border border-border-soft',
  warm: 'bg-rose-light text-rose border border-border',
}

export function Badge({ color = 'gray', children, className = '' }: Props) {
  return (
    <span className={['inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium', colorClasses[color], className].join(' ')}>
      {children}
    </span>
  )
}
