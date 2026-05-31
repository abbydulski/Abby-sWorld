type Props = { title: string; subtitle?: string; action?: React.ReactNode }

export function Topbar({ title, subtitle, action }: Props) {
  return (
    <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-surface">
      <div>
        <h1 className="text-sm font-bold text-text-primary tracking-tight">{title}</h1>
        {subtitle && <p className="text-[11px] text-text-tertiary mt-0.5">{subtitle}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  )
}
