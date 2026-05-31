import { useQuery } from '@tanstack/react-query'
import { fetchGmailThreads, type GmailThread } from '../lib/googleApi'

export function useGmailDigest(token: string | null) {
  return useQuery<GmailThread[]>({
    queryKey: ['gmail', token],
    enabled: !!token,
    queryFn: () => fetchGmailThreads(token!, 10),
    staleTime: 5 * 60 * 1000,
  })
}
