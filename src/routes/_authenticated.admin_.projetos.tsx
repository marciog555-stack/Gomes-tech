import { createFileRoute, useRouter } from '@tanstack/react-router'
import { useServerFn } from '@tanstack/react-start'
import { useState } from 'react'
import { CalendarClock, ListChecks, Pencil, Trash2 } from 'lucide-react'
import {
  type Project,
  type ProjectStatus,
  createProject,
  deleteProject,
  listProjects,
  updateProject,
} from '../lib/admin/projects.functions'
import { ADMIN_CARD, ADMIN_INPUT, adminIconBadge } from '../lib/admin/ui'

const STATUS_COLOR: Record<ProjectStatus, string> = {
  fila: '#6d8296',
  andamento: '#eda100',
  entregue: '#0ca30c',
}

export const Route = createFileRoute('/_authenticated/admin_/projetos')({
  loader: () => listProjects(),
  component: ProjetosPage,
})

const STATUS_LABEL: Record<ProjectStatus, string> = {
  fila: 'Na fila',
  andamento: 'Em andamento',
  entregue: 'Entregue',
}

function deadlineLabel(deadline: string | null) {
  if (!deadline) return null
  const today = new Date()
  const d = new Date(deadline + 'T00:00:00')
  const a = new Date(today.getFullYear(), today.getMonth(), today.getDate())
  const days = Math.round((d.getTime() - a.getTime()) / 86_400_000)
  if (days < 0) return { text: `atrasado há ${Math.abs(days)} dia${Math.abs(days) === 1 ? '' : 's'}`, color: '#d03b3b' }
  if (days === 0) return { text: 'entrega hoje', color: '#d03b3b' }
  if (days === 1) return { text: 'entrega amanhã', color: '#eda100' }
  return { text: `entrega em ${days} dias`, color: '#6d8296' }
}

type FormState = {
  name: string
  client_name: string
  deadline: string
  status: ProjectStatus
  notes: string
}

const emptyForm: FormState = { name: '', client_name: '', deadline: '', status: 'fila', notes: '' }

function ProjectForm({
  initial,
  onCancel,
  onSaved,
}: {
  initial?: Project
  onCancel?: () => void
  onSaved: () => void
}) {
  const router = useRouter()
  const createFn = useServerFn(createProject)
  const updateFn = useServerFn(updateProject)
  const [form, setForm] = useState<FormState>(
    initial
      ? {
          name: initial.name,
          client_name: initial.client_name ?? '',
          deadline: initial.deadline ?? '',
          status: initial.status,
          notes: initial.notes ?? '',
        }
      : emptyForm,
  )
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError(null)
    try {
      const payload = {
        name: form.name,
        client_name: form.client_name || null,
        deadline: form.deadline || null,
        status: form.status,
        notes: form.notes || null,
      }
      if (initial) {
        await updateFn({ data: { ...payload, id: initial.id } })
      } else {
        await createFn({ data: payload })
      }
      await router.invalidate()
      onSaved()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar')
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4 grid gap-3 sm:grid-cols-2">
      <div>
        <label className="caption-brand text-steel">Projeto</label>
        <input
          required
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="body-brand mt-1 w-full border px-3 py-2"
          style={ADMIN_INPUT}
        />
      </div>
      <div>
        <label className="caption-brand text-steel">Cliente (opcional)</label>
        <input
          value={form.client_name}
          onChange={(e) => setForm({ ...form, client_name: e.target.value })}
          className="body-brand mt-1 w-full border px-3 py-2"
          style={ADMIN_INPUT}
        />
      </div>
      <div>
        <label className="caption-brand text-steel">Prazo de entrega</label>
        <input
          type="date"
          value={form.deadline}
          onChange={(e) => setForm({ ...form, deadline: e.target.value })}
          className="body-brand mt-1 w-full border px-3 py-2"
          style={ADMIN_INPUT}
        />
      </div>
      <div>
        <label className="caption-brand text-steel">Status</label>
        <select
          value={form.status}
          onChange={(e) => setForm({ ...form, status: e.target.value as ProjectStatus })}
          className="body-brand mt-1 w-full border px-3 py-2"
          style={ADMIN_INPUT}
        >
          <option value="fila">Na fila</option>
          <option value="andamento">Em andamento</option>
          <option value="entregue">Entregue</option>
        </select>
      </div>
      <div className="sm:col-span-2">
        <label className="caption-brand text-steel">Observações</label>
        <input
          value={form.notes}
          onChange={(e) => setForm({ ...form, notes: e.target.value })}
          className="body-brand mt-1 w-full border px-3 py-2"
          style={ADMIN_INPUT}
        />
      </div>

      {error && (
        <p className="caption-brand sm:col-span-2" style={{ color: '#c0392b' }}>
          {error}
        </p>
      )}

      <div className="flex gap-3 sm:col-span-2">
        <button type="submit" disabled={saving} className="btn-brand btn-brand-primary btn-brand-sm">
          {saving ? 'Salvando…' : 'Salvar'}
        </button>
        {onCancel && (
          <button type="button" onClick={onCancel} className="caption-brand text-steel">
            Cancelar
          </button>
        )}
      </div>
    </form>
  )
}

function ProjetosPage() {
  const projects = Route.useLoaderData()
  const router = useRouter()
  const deleteFn = useServerFn(deleteProject)
  const [showNew, setShowNew] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  async function handleDelete(id: string) {
    if (!confirm('Excluir este projeto?')) return
    await deleteFn({ data: { id } })
    await router.invalidate()
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="h2-brand flex items-center gap-2 text-ink">
          <ListChecks size={22} style={{ color: 'var(--cyan-500)' }} />
          Projetos
        </h1>
        {!showNew && (
          <button onClick={() => setShowNew(true)} className="btn-brand btn-brand-primary btn-brand-sm">
            Novo projeto
          </button>
        )}
      </div>
      <p className="body-brand mt-2 text-steel">Fila de entrega, ordenada por prazo.</p>

      {showNew && (
        <div className="mt-4 p-5" style={ADMIN_CARD}>
          <ProjectForm onCancel={() => setShowNew(false)} onSaved={() => setShowNew(false)} />
        </div>
      )}

      <div className="mt-8 space-y-3">
        {projects.map((p) => {
          if (editingId === p.id) {
            return (
              <div key={p.id} className="p-5" style={ADMIN_CARD}>
                <ProjectForm initial={p} onCancel={() => setEditingId(null)} onSaved={() => setEditingId(null)} />
              </div>
            )
          }
          const dl = deadlineLabel(p.deadline)
          return (
            <div
              key={p.id}
              className="flex flex-wrap items-center justify-between gap-3 p-4"
              style={ADMIN_CARD}
            >
              <div className="flex items-center gap-3">
                <div style={adminIconBadge(STATUS_COLOR[p.status])}>
                  <CalendarClock size={18} strokeWidth={2.25} />
                </div>
                <div>
                  <p className="body-brand text-ink" style={{ fontWeight: 600 }}>
                    {p.name} {p.client_name && <span className="text-steel">· {p.client_name}</span>}
                  </p>
                  <p className="caption-brand text-steel">
                    {STATUS_LABEL[p.status]}
                    {dl && (
                      <>
                        {' · '}
                        <span style={{ color: dl.color, fontWeight: 600 }}>{dl.text}</span>
                      </>
                    )}
                  </p>
                  {p.notes && <p className="caption-brand mt-1 text-steel">{p.notes}</p>}
                </div>
              </div>
              <div className="flex gap-4">
                <button onClick={() => setEditingId(p.id)} className="caption-brand flex items-center gap-1 text-cyan-500" style={{ fontWeight: 600 }}>
                  <Pencil size={13} />
                  Editar
                </button>
                <button onClick={() => handleDelete(p.id)} className="caption-brand flex items-center gap-1" style={{ fontWeight: 600, color: '#c0392b' }}>
                  <Trash2 size={13} />
                  Excluir
                </button>
              </div>
            </div>
          )
        })}
        {projects.length === 0 && !showNew && <p className="body-brand text-steel">Nenhum projeto na fila ainda.</p>}
      </div>
    </div>
  )
}
