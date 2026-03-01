import { useState, useEffect, useCallback } from 'react'
import supabase from '../lib/supabase'

export interface Comment {
  id: string
  name: string
  message: string
  created_at: string
}

export function useComments() {
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [posting, setPosting] = useState(false)

  const refresh = useCallback(async () => {
    setLoading(true)
    setError(null)
    const { data, error: fetchErr } = await supabase
      .from('comments')
      .select('id, name, message, created_at')
      .order('created_at', { ascending: false })

    if (fetchErr) {
      setError(fetchErr.message)
    } else {
      setComments(data ?? [])
    }
    setLoading(false)
  }, [])

  useEffect(() => { refresh() }, [refresh])

  const postComment = useCallback(async (name: string, message: string): Promise<string | null> => {
    const trimName = name.trim()
    const trimMsg = message.trim()

    if (!trimName || trimName.length > 50) return 'name must be 1-50 chars'
    if (!trimMsg || trimMsg.length > 500) return 'message must be 1-500 chars'

    setPosting(true)
    setError(null)

    const { error: insertErr } = await supabase
      .from('comments')
      .insert({ name: trimName, message: trimMsg })

    setPosting(false)

    if (insertErr) {
      const msg = insertErr.message.includes('row-level security')
        ? 'rate limit: max 3 comments per hour'
        : insertErr.message
      setError(msg)
      return msg
    }

    await refresh()
    return null
  }, [refresh])

  return { comments, loading, error, posting, postComment, refresh }
}
