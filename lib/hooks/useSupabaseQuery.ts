import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { PostgrestError } from '@supabase/supabase-js'

interface UseSupabaseQueryResult<T> {
  data: T | null
  error: PostgrestError | null
  loading: boolean
  refetch: () => Promise<void>
}

export function useSupabaseQuery<T>(
  queryFn: (supabase: ReturnType<typeof createClient>) => Promise<{ data: T | null; error: PostgrestError | null }>,
  dependencies: any[] = []
): UseSupabaseQueryResult<T> {
  const [data, setData] = useState<T | null>(null)
  const [error, setError] = useState<PostgrestError | null>(null)
  const [loading, setLoading] = useState(true)
  
  const supabase = createClient()

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)
      const result = await queryFn(supabase)
      
      if (result.error) {
        setError(result.error)
        setData(null)
      } else {
        setData(result.data)
        setError(null)
      }
    } catch (err) {
      setError({
        message: err instanceof Error ? err.message : 'An error occurred',
        details: '',
        hint: '',
        code: 'UNKNOWN',
        name: 'PostgrestError'
      } as PostgrestError)
      setData(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies)

  return { data, error, loading, refetch: fetchData }
}