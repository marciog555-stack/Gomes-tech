import { createClient } from '@supabase/supabase-js'

let client: ReturnType<typeof createClient> | null = null

export function supabaseAdmin() {
  if (client) return client

  const url = process.env.SUPABASE_URL
  const key = process.env.SUPABASE_ANON_KEY
  if (!url || !key) {
    throw new Error('SUPABASE_URL / SUPABASE_ANON_KEY are not set')
  }

  client = createClient(url, key, {
    auth: { persistSession: false },
  })
  return client
}
