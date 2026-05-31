import { useQuery } from '@tanstack/react-query'
import type { GmailThread } from '../lib/googleApi'

export type EmailSummary = {
  tldr: string
  actions: { subject: string; from: string; action: string }[]
  skipped: number
}

async function summarize(threads: GmailThread[]): Promise<EmailSummary> {
  if (threads.length === 0) return { tldr: 'Inbox is clear.', actions: [], skipped: 0 }

  const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY
  if (!apiKey) return { tldr: 'Add VITE_ANTHROPIC_API_KEY to .env to enable summaries.', actions: [], skipped: 0 }

  const digest = threads
    .map((t, i) => `${i + 1}. From: ${t.from}\n   Subject: ${t.subject}\n   Snippet: ${t.snippet}`)
    .join('\n\n')

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 400,
      messages: [
        {
          role: 'user',
          content: `You are a personal assistant scanning an inbox for things that actually need attention.

Ignore: newsletters, marketing emails, promotions, shipping updates, social notifications, automated alerts with no action needed.
Include only: emails that require a reply, a decision, or time-sensitive action from a real person.

Return ONLY valid JSON, no markdown:
{
  "tldr": "1 short sentence — what actually needs attention, or 'Nothing urgent' if nothing qualifies",
  "actions": [
    { "subject": "...", "from": "First name or org only", "action": "3-6 word action, e.g. Reply, RSVP, Review document" }
  ],
  "skipped": <number of emails you ignored as noise>
}

Max 4 items in actions. If nothing needs attention, actions is [].

Emails:
${digest}`,
        },
      ],
    }),
  })

  if (!res.ok) throw new Error(`Anthropic API error: ${res.status}`)
  const data = await res.json()
  const raw = data.content?.[0]?.text ?? ''
  const text = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim()
  try {
    return JSON.parse(text) as EmailSummary
  } catch {
    return { tldr: 'Could not parse summary.', actions: [], skipped: 0 }
  }
}

export function useEmailSummary(threads: GmailThread[], enabled: boolean) {
  return useQuery<EmailSummary>({
    queryKey: ['email-summary', threads.map((t) => t.id).join(',')],
    queryFn: () => summarize(threads),
    enabled: enabled && threads.length > 0,
    staleTime: 10 * 60 * 1000,
  })
}
