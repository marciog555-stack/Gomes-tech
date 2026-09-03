import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { adminAuthMiddleware } from './auth-middleware'
import { supabaseAdmin } from './supabase'

export type Lead = {
  id: string
  name: string
  phone: string | null
  notes: string | null
  created_at: string
}

export const listLeads = createServerFn({ method: 'GET' })
  .middleware([adminAuthMiddleware])
  .handler(async (): Promise<Array<Lead>> => {
    const { data, error } = await supabaseAdmin()
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) throw new Error(error.message)
    return data as Array<Lead>
  })

const leadInput = z.object({
  name: z.string().trim().min(1, 'Nome obrigatório'),
  phone: z.string().trim().optional().nullable(),
  notes: z.string().trim().optional().nullable(),
})

export const createLead = createServerFn({ method: 'POST' })
  .middleware([adminAuthMiddleware])
  .validator(leadInput)
  .handler(async ({ data }) => {
    const { error } = await supabaseAdmin().from('leads').insert(data)
    if (error) throw new Error(error.message)
    return { ok: true }
  })

export const updateLead = createServerFn({ method: 'POST' })
  .middleware([adminAuthMiddleware])
  .validator(leadInput.extend({ id: z.string().uuid() }))
  .handler(async ({ data }) => {
    const { id, ...fields } = data
    const { error } = await supabaseAdmin().from('leads').update(fields).eq('id', id)
    if (error) throw new Error(error.message)
    return { ok: true }
  })

export const deleteLead = createServerFn({ method: 'POST' })
  .middleware([adminAuthMiddleware])
  .validator(z.object({ id: z.string().uuid() }))
  .handler(async ({ data }) => {
    const { error } = await supabaseAdmin().from('leads').delete().eq('id', data.id)
    if (error) throw new Error(error.message)
    return { ok: true }
  })
