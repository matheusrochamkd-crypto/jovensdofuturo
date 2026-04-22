import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Candidate operations
export const submitCandidate = async (candidateData) => {
  const { data, error } = await supabase
    .from('candidates')
    .insert([candidateData])
    .select()
    .single()

  if (error) throw error
  return data
}

export const getCandidates = async (statusFilter = null) => {
  let query = supabase
    .from('candidates')
    .select('*')
    .order('created_at', { ascending: false })

  if (statusFilter) {
    query = query.eq('status', statusFilter)
  }

  const { data, error } = await query
  if (error) throw error
  return data
}

export const updateCandidateStatus = async (id, status) => {
  const { data, error } = await supabase
    .from('candidates')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

// Send email via Edge Function
export const sendEmail = async (type, candidateId) => {
  try {
    const res = await fetch(`${supabaseUrl}/functions/v1/send-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, candidateId }),
    })
    const data = await res.json()
    if (!res.ok) {
      console.error('[Email] Failed:', data)
      return null
    }
    console.log('[Email] Sent successfully:', data)
    return data
  } catch (err) {
    console.warn('[Email] Error:', err.message)
    return null
  }
}
