import { useEffect } from 'react'
import { X } from 'lucide-react'

type Props = { title?: string; onClose: () => void; children: React.ReactNode }

export function Modal({ title, onClose, children }: Props) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onClose])

  return (
    <div
      className="absolute inset-0 z-50 flex items-center justify-center bg-primary/10 backdrop-blur-[2px] min-h-full"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="bg-surface border border-border rounded-lg shadow-panel w-full max-w-lg mx-4">
        {title && (
          <div className="flex items-center justify-between px-5 py-4 border-b border-border-soft">
            <span className="text-sm font-medium text-text-primary">{title}</span>
            <button onClick={onClose} className="text-text-tertiary hover:text-primary transition-colors duration-150 p-0.5 rounded hover:bg-panel">
              <X size={15} />
            </button>
          </div>
        )}
        <div className="p-5">{children}</div>
      </div>
    </div>
  )
}
