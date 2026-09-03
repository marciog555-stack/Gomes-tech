import { createFileRoute, useRouter } from '@tanstack/react-router'
import { useServerFn } from '@tanstack/react-start'
import { useState } from 'react'
import { createTransaction, deleteTransaction, listTransactions } from '../lib/admin/transactions.functions'

export const Route = createFileRoute('/_authenticated/admin_/financeiro')({
  loader: () => listTransactions(),
  component: FinanceiroPage,
})

function currency(n: number) {
  return n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

function todayIso() {
  return new Date().toISOString().slice(0, 10)
}

function FinanceiroPage() {
  const transactions = Route.useLoaderData()
  const router = useRouter()
  const createFn = useServerFn(createTransaction)
  const deleteFn = useServerFn(deleteTransaction)

  const [type, setType] = useState<'income' | 'expense'>('income')
  const [amount, setAmount] = useState('')
  const [description, setDescription] = useState('')
  const [occurredOn, setOccurredOn] = useState(todayIso())
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const totalIncome = transactions.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0)
  const totalExpense = transactions.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError(null)
    try {
      await createFn({
        data: { type, amount: Number(amount), description, occurred_on: occurredOn },
      })
      setAmount('')
      setDescription('')
      await router.invalidate()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Excluir este lançamento?')) return
    await deleteFn({ data: { id } })
    await router.invalidate()
  }

  return (
    <div>
      <h1 className="h2-brand text-ink">Financeiro</h1>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="border p-4" style={{ borderColor: 'rgba(11,30,46,0.12)', borderRadius: 4 }}>
          <p className="caption-brand text-steel">Total de entradas (últimos lançamentos)</p>
          <p className="h3-brand mt-1" style={{ color: '#1a7f4b' }}>
            {currency(totalIncome)}
          </p>
        </div>
        <div className="border p-4" style={{ borderColor: 'rgba(11,30,46,0.12)', borderRadius: 4 }}>
          <p className="caption-brand text-steel">Total de saídas (últimos lançamentos)</p>
          <p className="h3-brand mt-1" style={{ color: '#c0392b' }}>
            {currency(totalExpense)}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mt-8 grid gap-3 border-t pt-6 sm:grid-cols-2" style={{ borderColor: 'rgba(11,30,46,0.1)' }}>
        <div className="flex gap-4 sm:col-span-2">
          <label className="caption-brand flex items-center gap-1.5 text-steel">
            <input type="radio" checked={type === 'income'} onChange={() => setType('income')} />
            Entrada
          </label>
          <label className="caption-brand flex items-center gap-1.5 text-steel">
            <input type="radio" checked={type === 'expense'} onChange={() => setType('expense')} />
            Saída
          </label>
        </div>
        <div>
          <label className="caption-brand text-steel">Valor (R$)</label>
          <input
            required
            type="number"
            step="0.01"
            min="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="body-brand mt-1 w-full border px-3 py-2"
            style={{ borderColor: 'rgba(11,30,46,0.18)', borderRadius: 4 }}
          />
        </div>
        <div>
          <label className="caption-brand text-steel">Data</label>
          <input
            required
            type="date"
            value={occurredOn}
            onChange={(e) => setOccurredOn(e.target.value)}
            className="body-brand mt-1 w-full border px-3 py-2"
            style={{ borderColor: 'rgba(11,30,46,0.18)', borderRadius: 4 }}
          />
        </div>
        <div className="sm:col-span-2">
          <label className="caption-brand text-steel">Descrição</label>
          <input
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="body-brand mt-1 w-full border px-3 py-2"
            style={{ borderColor: 'rgba(11,30,46,0.18)', borderRadius: 4 }}
          />
        </div>

        {error && (
          <p className="caption-brand sm:col-span-2" style={{ color: '#c0392b' }}>
            {error}
          </p>
        )}

        <button type="submit" disabled={saving} className="btn-brand btn-brand-primary btn-brand-sm sm:col-span-2" style={{ justifySelf: 'start' }}>
          {saving ? 'Salvando…' : 'Lançar'}
        </button>
      </form>

      <div className="mt-10 space-y-3">
        {transactions.map((t) => (
          <div
            key={t.id}
            className="flex flex-wrap items-center justify-between gap-3 border-t pt-3"
            style={{ borderColor: 'rgba(11,30,46,0.1)' }}
          >
            <div>
              <p className="body-brand text-ink" style={{ fontWeight: 600 }}>
                {t.description}
              </p>
              <p className="caption-brand text-steel">
                {new Date(t.occurred_on + 'T00:00:00').toLocaleDateString('pt-BR')} ·{' '}
                <span style={{ color: t.type === 'income' ? '#1a7f4b' : '#c0392b' }}>
                  {t.type === 'income' ? '+ ' : '- '}
                  {currency(t.amount)}
                </span>
              </p>
            </div>
            <button onClick={() => handleDelete(t.id)} className="caption-brand" style={{ fontWeight: 600, color: '#c0392b' }}>
              Excluir
            </button>
          </div>
        ))}
        {transactions.length === 0 && <p className="body-brand text-steel">Nenhum lançamento ainda.</p>}
      </div>
    </div>
  )
}
