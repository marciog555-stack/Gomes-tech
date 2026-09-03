import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { adminAuthMiddleware } from './auth-middleware'
import { supabaseAdmin } from './supabase'

export type ProjectStatus = 'fila' | 'andamento' | 'entregue'

export type Project = {
  id: string
  name: string
  client_name: string | null
  deadline: string | null
  status: ProjectStatus
  notes: string | null
  created_at: string
}

export const listProjects = createServerFn({ method: 'GET' })
  .middleware([adminAuthMiddleware])
  .handler(async (): Promise<Array<Project>> => {
    const { data, error } = await supabaseAdmin()
      .from('projects')
      .select('*')
      .order('deadline', { ascending: true, nullsFirst: false })
    if (error) throw new Error(error.message)
    return data as Array<Project>
  })

const projectInput = z.object({
  name: z.string().trim().min(1, 'Nome obrigatório'),
  client_name: z.string().trim().optional().nullable(),
  deadline: z.string().trim().optional().nullable(),
  status: z.enum(['fila', 'andamento', 'entregue']),
  notes: z.string().trim().optional().nullable(),
})

export const createProject = createServerFn({ method: 'POST' })
  .middleware([adminAuthMiddleware])
  .validator(projectInput)
  .handler(async ({ data }) => {
    const { error } = await supabaseAdmin().from('projects').insert(data)
    if (error) throw new Error(error.message)
    return { ok: true }
  })

export const updateProject = createServerFn({ method: 'POST' })
  .middleware([adminAuthMiddleware])
  .validator(projectInput.extend({ id: z.string().uuid() }))
  .handler(async ({ data }) => {
    const { id, ...fields } = data
    const { error } = await supabaseAdmin().from('projects').update(fields).eq('id', id)
    if (error) throw new Error(error.message)
    return { ok: true }
  })

export const deleteProject = createServerFn({ method: 'POST' })
  .middleware([adminAuthMiddleware])
  .validator(z.object({ id: z.string().uuid() }))
  .handler(async ({ data }) => {
    const { error } = await supabaseAdmin().from('projects').delete().eq('id', data.id)
    if (error) throw new Error(error.message)
    return { ok: true }
  })
