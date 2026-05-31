import type { LucideIcon } from 'lucide-react'

type Props = { icon: LucideIcon; message: string; action?: React.ReactNode }

export function EmptyState({ icon: Icon, message, action }: Props) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
      <Icon size={32} className="text-border" strokeWidth={1.5} />
      <p className="text-sm text-text-tertiary">{message}</p>
      {action}
    </div>
  )
}
