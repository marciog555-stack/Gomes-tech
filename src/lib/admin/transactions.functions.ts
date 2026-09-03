import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { adminAuthMiddleware } from './auth-middleware'
import { supabaseAdmin } from './supabase'

export type Transaction = {
  id: string
  type: 'income' | 'expense'
  amount: number
  description: string
  occurred_on: string
  client_id: string | null
  created_at: string
}

export const listTransactions = createServerFn({ method: 'GET' })
  .middleware([adminAuthMiddleware])
  .handler(async (): Promise<Array<Transaction>> => {
    const { data, error } = await supabaseAdmin()
      .from('transactions')
      .select('*')
      .order('occurred_on', { ascending: false })
      .order('created_at', { ascending: false })
      .limit(200)
    if (error) throw new Error(error.message)
    return data as Array<Transaction>
  })

const transactionInput = z.object({
  type: z.enum(['income', 'expense']),
  amount: z.coerce.number().positive(),
  description: z.string().trim().min(1, 'Descrição obrigatória'),
  occurred_on: z.string().min(1),
  client_id: z.string().uuid().optional().nullable(),
})

export const createTransaction = createServerFn({ method: 'POST' })
  .middleware([adminAuthMiddleware])
  .validator(transactionInput)
  .handler(async ({ data }) => {
    const { error } = await supabaseAdmin().from('transactions').insert(data)
    if (error) throw new Error(error.message)
    return { ok: true }
  })

export const deleteTransaction = createServerFn({ method: 'POST' })
  .middleware([adminAuthMiddleware])
  .validator(z.object({ id: z.string().uuid() }))
  .handler(async ({ data }) => {
    const { error } = await supabaseAdmin().from('transactions').delete().eq('id', data.id)
    if (error) throw new Error(error.message)
    return { ok: true }
  })
