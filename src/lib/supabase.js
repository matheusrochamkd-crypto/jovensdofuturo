import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://uztncdwtaivqzcjlpecq.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV6dG5jZHd0YWl2cXpjamxwZWNxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk2OTI2MzgsImV4cCI6MjA4NTI2ODYzOH0.pVuaVvvyj7nXI3UIPysYQVQWK_7iLa-zOEDNuGxTmvs'

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
    const { data, error } = await supabase.functions.invoke('send-email', {
      body: { type, candidateId }
    })
    
    if (error) {
      console.error('[Email] Edge Function error:', error)
      return null
    }

    console.log('[Email] Sent successfully:', data)
    return data
  } catch (err) {
    console.warn('[Email] Network/Fetch error:', err.message)
    return null
  }
}
