import { createFileRoute, useRouter } from '@tanstack/react-router'
import { useServerFn } from '@tanstack/react-start'
import { useState } from 'react'
import { Pencil, Phone, Trash2, UserPlus } from 'lucide-react'
import { type Lead, createLead, deleteLead, listLeads, updateLead } from '../lib/admin/leads.functions'
import { ADMIN_CARD, ADMIN_INPUT, adminAvatar } from '../lib/admin/ui'

function initials(name: string) {
  const parts = name.trim().split(/\s+/)
  return ((parts[0]?.[0] ?? '') + (parts[1]?.[0] ?? '')).toUpperCase()
}

export const Route = createFileRoute('/_authenticated/admin_/leads')({
  loader: () => listLeads(),
  component: LeadsPage,
})

type FormState = { name: string; phone: string; notes: string }
const emptyForm: FormState = { name: '', phone: '', notes: '' }

function LeadForm({
  initial,
  onCancel,
  onSaved,
}: {
  initial?: Lead
  onCancel?: () => void
  onSaved: () => void
}) {
  const router = useRouter()
  const createFn = useServerFn(createLead)
  const updateFn = useServerFn(updateLead)
  const [form, setForm] = useState<FormState>(
    initial ? { name: initial.name, phone: initial.phone ?? '', notes: initial.notes ?? '' } : emptyForm,
  )
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError(null)
    try {
      const payload = { name: form.name, phone: form.phone || null, notes: form.notes || null }
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
          style={ADMIN_INPUT}
        />
      </div>
      <div>
        <label className="caption-brand text-steel">Telefone (opcional)</label>
        <input
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          className="body-brand mt-1 w-full border px-3 py-2"
          style={ADMIN_INPUT}
        />
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

function LeadsPage() {
  const leads = Route.useLoaderData()
  const router = useRouter()
  const deleteFn = useServerFn(deleteLead)
  const [showNew, setShowNew] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  async function handleDelete(id: string) {
    if (!confirm('Excluir este lead?')) return
    await deleteFn({ data: { id } })
    await router.invalidate()
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="h2-brand flex items-center gap-2 text-ink">
          <UserPlus size={22} style={{ color: 'var(--cyan-500)' }} />
          Futuros clientes
        </h1>
        {!showNew && (
          <button onClick={() => setShowNew(true)} className="btn-brand btn-brand-primary btn-brand-sm">
            Novo lead
          </button>
        )}
      </div>
      <p className="body-brand mt-2 text-steel">Gente que ainda não fechou, mas está em conversa.</p>

      {showNew && (
        <div className="mt-4 p-5" style={ADMIN_CARD}>
          <LeadForm onCancel={() => setShowNew(false)} onSaved={() => setShowNew(false)} />
        </div>
      )}

      <div className="mt-8 space-y-3">
        {leads.map((l) =>
          editingId === l.id ? (
            <div key={l.id} className="p-5" style={ADMIN_CARD}>
              <LeadForm initial={l} onCancel={() => setEditingId(null)} onSaved={() => setEditingId(null)} />
            </div>
          ) : (
            <div
              key={l.id}
              className="flex flex-wrap items-center justify-between gap-3 p-4"
              style={ADMIN_CARD}
            >
              <div className="flex items-center gap-3">
                <div style={adminAvatar('#eda100')}>{initials(l.name)}</div>
                <div>
                  <p className="body-brand text-ink" style={{ fontWeight: 600 }}>
                    {l.name}
                  </p>
                  {l.phone && (
                    <p className="caption-brand flex items-center gap-1 text-steel">
                      <Phone size={12} />
                      {l.phone}
                    </p>
                  )}
                  {l.notes && <p className="caption-brand mt-1 text-steel">{l.notes}</p>}
                </div>
              </div>
              <div className="flex gap-4">
                <button onClick={() => setEditingId(l.id)} className="caption-brand flex items-center gap-1 text-cyan-500" style={{ fontWeight: 600 }}>
                  <Pencil size={13} />
                  Editar
                </button>
                <button onClick={() => handleDelete(l.id)} className="caption-brand flex items-center gap-1" style={{ fontWeight: 600, color: '#c0392b' }}>
                  <Trash2 size={13} />
                  Excluir
                </button>
              </div>
            </div>
          ),
        )}
        {leads.length === 0 && !showNew && <p className="body-brand text-steel">Nenhum lead cadastrado ainda.</p>}
      </div>
    </div>
  )
}
