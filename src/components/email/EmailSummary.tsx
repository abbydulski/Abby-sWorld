import { Mail, ArrowRight } from 'lucide-react'
import { Spinner } from '../ui/Spinner'
import type { EmailSummary as EmailSummaryType } from '../../hooks/useEmailSummary'

type Props = {
  summary?: EmailSummaryType
  isLoading: boolean
  unreadCount: number
  hideSectionHeader?: boolean
}

export function EmailSummary({ summary, isLoading, unreadCount, hideSectionHeader }: Props) {
  return (
    <section className="flex flex-col">
      {!hideSectionHeader && (
        <div className="flex items-center justify-between px-6 py-2.5 border-b border-border bg-panel">
          <span className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest">inbox</span>
          <span className="text-[10px] text-text-tertiary">{unreadCount} unread</span>
        </div>
      )}

      {isLoading ? (
        <div className="flex items-center gap-3 px-6 py-3">
          <Spinner size={12} />
          <span className="text-xs text-text-secondary">scanning inbox...</span>
        </div>
      ) : summary ? (
        <>
          <div className="px-6 py-3 border-b border-border">
            <p className="text-xs text-text-primary">{summary.tldr}</p>
            {summary.skipped > 0 && (
              <p className="text-[10px] text-text-tertiary mt-1">{summary.skipped} promotional emails filtered</p>
            )}
          </div>
          {summary.actions.length > 0 && (
            <div className="divide-y divide-border">
              {summary.actions.map((item, i) => (
                <div key={i} className="flex items-center gap-3 px-6 py-2.5">
                  <Mail size={12} className="text-text-tertiary shrink-0" />
                  <div className="flex-1 min-w-0">
                    <span className="text-xs text-text-primary truncate block">{item.subject}</span>
                    <span className="text-[10px] text-text-tertiary">{item.from}</span>
                  </div>
                  <span className="flex items-center gap-1 text-[10px] text-primary font-bold shrink-0 ml-2">
                    {item.action}<ArrowRight size={9} />
                  </span>
                </div>
              ))}
            </div>
          )}
        </>
      ) : (
        <div className="flex items-center gap-3 px-6 py-3">
          <Mail size={12} className="text-text-tertiary" />
          <span className="text-xs text-text-tertiary">no summary available</span>
        </div>
      )}
    </section>
  )
}
