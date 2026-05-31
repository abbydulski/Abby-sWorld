import { Bell } from 'lucide-react'

const OPTIONS = [
  { label: 'None', value: null },
  { label: '5 min before', value: 5 },
  { label: '10 min before', value: 10 },
  { label: '15 min before', value: 15 },
  { label: '30 min before', value: 30 },
  { label: '1 hour before', value: 60 },
  { label: '1 day before', value: 1440 },
]

type Props = { value: number | null; onChange: (minutes: number | null) => void }

export function ReminderPicker({ value, onChange }: Props) {
  return (
    <div className="flex items-center gap-2">
      <Bell size={14} className="text-text-tertiary shrink-0" />
      <select
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value === '' ? null : Number(e.target.value))}
        className="flex-1 py-1.5 px-2 rounded-lg bg-panel border border-transparent text-sm text-text-primary focus:outline-none focus:border-border transition-all duration-150"
      >
        {OPTIONS.map((opt) => (
          <option key={opt.label} value={opt.value ?? ''}>{opt.label}</option>
        ))}
      </select>
    </div>
  )
}
