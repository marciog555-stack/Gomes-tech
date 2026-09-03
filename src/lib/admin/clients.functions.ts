import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { adminAuthMiddleware } from './auth-middleware'
import { supabaseAdmin } from './supabase'

export type Client = {
  id: string
  name: string
  phone: string
  subscription_amount: number
  due_day: number
  active: boolean
  notes: string | null
  created_at: string
}

export const listClients = createServerFn({ method: 'GET' })
  .middleware([adminAuthMiddleware])
  .handler(async (): Promise<Array<Client>> => {
    const { data, error } = await supabaseAdmin()
      .from('clients')
      .select('*')
      .order('name', { ascending: true })
    if (error) throw new Error(error.message)
    return data as Array<Client>
  })

const clientInput = z.object({
  name: z.string().trim().min(1, 'Nome obrigatório'),
  phone: z
    .string()
    .trim()
    .regex(/^\d{10,13}$/, 'Telefone deve ter só números, com DDD (ex: 5562999999999)'),
  subscription_amount: z.coerce.number().min(0),
  due_day: z.coerce.number().int().min(1).max(28),
  active: z.boolean().default(true),
  notes: z.string().trim().optional().nullable(),
})

export const createClient = createServerFn({ method: 'POST' })
  .middleware([adminAuthMiddleware])
  .validator(clientInput)
  .handler(async ({ data }) => {
    const { error } = await supabaseAdmin().from('clients').insert(data)
    if (error) throw new Error(error.message)
    return { ok: true }
  })

export const updateClient = createServerFn({ method: 'POST' })
  .middleware([adminAuthMiddleware])
  .validator(clientInput.extend({ id: z.string().uuid() }))
  .handler(async ({ data }) => {
    const { id, ...fields } = data
    const { error } = await supabaseAdmin().from('clients').update(fields).eq('id', id)
    if (error) throw new Error(error.message)
    return { ok: true }
  })

export const deleteClient = createServerFn({ method: 'POST' })
  .middleware([adminAuthMiddleware])
  .validator(z.object({ id: z.string().uuid() }))
  .handler(async ({ data }) => {
    const { error } = await supabaseAdmin().from('clients').delete().eq('id', data.id)
    if (error) throw new Error(error.message)
    return { ok: true }
  })
