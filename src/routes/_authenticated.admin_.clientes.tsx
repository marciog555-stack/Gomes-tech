import { createFileRoute, useRouter } from '@tanstack/react-router'
import { useServerFn } from '@tanstack/react-start'
import { useState } from 'react'
import {
  type Client,
  createClient,
  deleteClient,
  listClients,
  updateClient,
} from '../lib/admin/clients.functions'

export const Route = createFileRoute('/_authenticated/admin_/clientes')({
  loader: () => listClients(),
  component: ClientesPage,
})

type FormState = {
  name: string
  phone: string
  subscription_amount: string
  due_day: string
  active: boolean
  notes: string
}

const emptyForm: FormState = {
  name: '',
  phone: '',
  subscription_amount: '',
  due_day: '',
  active: true,
  notes: '',
}

function ClientForm({
  initial,
  onCancel,
  onSaved,
}: {
  initial?: Client
  onCancel?: () => void
  onSaved: () => void
}) {
  const router = useRouter()
  const createFn = useServerFn(createClient)
  const updateFn = useServerFn(updateClient)
  const [form, setForm] = useState<FormState>(
    initial
      ? {
          name: initial.name,
          phone: initial.phone,
          subscription_amount: String(initial.subscription_amount),
          due_day: String(initial.due_day),
          active: initial.active,
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
        phone: form.phone.replace(/\D/g, ''),
        subscription_amount: Number(form.subscription_amount),
        due_day: Number(form.due_day),
        active: form.active,
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
        <label className="caption-brand text-steel">Nome</label>
        <input
          required
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="body-brand mt-1 w-full border px-3 py-2"
          style={{ borderColor: 'rgba(11,30,46,0.18)', borderRadius: 4 }}
        />
      </div>
      <div>
        <label className="caption-brand text-steel">Telefone (com DDI, só números)</label>
        <input
          required
          placeholder="5562999999999"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          className="body-brand mt-1 w-full border px-3 py-2"
          style={{ borderColor: 'rgba(11,30,46,0.18)', borderRadius: 4 }}
        />
      </div>
      <div>
        <label className="caption-brand text-steel">Mensalidade (R$)</label>
        <input
          required
          type="number"
          step="0.01"
          min="0"
          value={form.subscription_amount}
          onChange={(e) => setForm({ ...form, subscription_amount: e.target.value })}
          className="body-brand mt-1 w-full border px-3 py-2"
          style={{ borderColor: 'rgba(11,30,46,0.18)', borderRadius: 4 }}
        />
      </div>
      <div>
        <label className="caption-brand text-steel">Dia do vencimento (1-28)</label>
        <input
          required
          type="number"
          min="1"
          max="28"
          value={form.due_day}
          onChange={(e) => setForm({ ...form, due_day: e.target.value })}
          className="body-brand mt-1 w-full border px-3 py-2"
          style={{ borderColor: 'rgba(11,30,46,0.18)', borderRadius: 4 }}
        />
      </div>
      <div className="sm:col-span-2">
        <label className="caption-brand text-steel">Observações</label>
        <input
          value={form.notes}
          onChange={(e) => setForm({ ...form, notes: e.target.value })}
          className="body-brand mt-1 w-full border px-3 py-2"
          style={{ borderColor: 'rgba(11,30,46,0.18)', borderRadius: 4 }}
        />
      </div>
      <label className="caption-brand flex items-center gap-2 text-steel">
        <input
          type="checkbox"
          checked={form.active}
          onChange={(e) => setForm({ ...form, active: e.target.checked })}
        />
        Ativo
      </label>

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

function ClientesPage() {
  const clients = Route.useLoaderData()
  const router = useRouter()
  const deleteFn = useServerFn(deleteClient)
  const [showNew, setShowNew] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  async function handleDelete(id: string) {
    if (!confirm('Excluir este cliente?')) return
    await deleteFn({ data: { id } })
    await router.invalidate()
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="h2-brand text-ink">Clientes</h1>
        {!showNew && (
          <button onClick={() => setShowNew(true)} className="btn-brand btn-brand-primary btn-brand-sm">
            Novo cliente
          </button>
        )}
      </div>

      {showNew && (
        <div className="mt-4 border-t pt-4" style={{ borderColor: 'rgba(11,30,46,0.1)' }}>
          <ClientForm onCancel={() => setShowNew(false)} onSaved={() => setShowNew(false)} />
        </div>
      )}

      <div className="mt-8 space-y-4">
        {clients.map((c) =>
          editingId === c.id ? (
            <div key={c.id} className="border-t pt-4" style={{ borderColor: 'rgba(11,30,46,0.1)' }}>
              <ClientForm initial={c} onCancel={() => setEditingId(null)} onSaved={() => setEditingId(null)} />
            </div>
          ) : (
            <div
              key={c.id}
              className="flex flex-wrap items-center justify-between gap-3 border-t pt-4"
              style={{ borderColor: 'rgba(11,30,46,0.1)' }}
            >
              <div>
                <p className="body-brand text-ink" style={{ fontWeight: 600 }}>
                  {c.name} {!c.active && <span className="text-steel">(inativo)</span>}
                </p>
                <p className="caption-brand text-steel">
                  {c.phone} · R$ {c.subscription_amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} · dia{' '}
                  {c.due_day}
                </p>
                {c.notes && <p className="caption-brand mt-1 text-steel">{c.notes}</p>}
              </div>
              <div className="flex gap-4">
                <button onClick={() => setEditingId(c.id)} className="caption-brand text-cyan-500" style={{ fontWeight: 600 }}>
                  Editar
                </button>
                <button onClick={() => handleDelete(c.id)} className="caption-brand" style={{ fontWeight: 600, color: '#c0392b' }}>
                  Excluir
                </button>
              </div>
            </div>
          ),
        )}
        {clients.length === 0 && !showNew && (
          <p className="body-brand text-steel">Nenhum cliente cadastrado ainda.</p>
        )}
      </div>
    </div>
  )
}
