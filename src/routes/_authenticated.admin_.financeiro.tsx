import { createFileRoute, useRouter } from '@tanstack/react-router'
import { useServerFn } from '@tanstack/react-start'
import { useState } from 'react'
import { ArrowDownRight, ArrowUpRight, Trash2, Wallet } from 'lucide-react'
import { createTransaction, deleteTransaction, listTransactions } from '../lib/admin/transactions.functions'
import { ADMIN_CARD, ADMIN_INPUT, adminIconBadge } from '../lib/admin/ui'
import EmptyState from '../components/admin/EmptyState'

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
      <h1 className="h2-brand flex items-center gap-2 text-ink">
        <Wallet size={22} style={{ color: 'var(--cyan-500)' }} />
        Financeiro
      </h1>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="flex items-center gap-3 p-4" style={ADMIN_CARD}>
          <div style={adminIconBadge('#0ca30c')}>
            <ArrowUpRight size={19} strokeWidth={2.25} />
          </div>
          <div>
            <p className="caption-brand text-steel">Total de entradas</p>
            <p className="h3-brand tabular-nums mt-0.5" style={{ color: '#0ca30c' }}>
              {currency(totalIncome)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 p-4" style={ADMIN_CARD}>
          <div style={adminIconBadge('#d03b3b')}>
            <ArrowDownRight size={19} strokeWidth={2.25} />
          </div>
          <div>
            <p className="caption-brand text-steel">Total de saídas</p>
            <p className="h3-brand tabular-nums mt-0.5" style={{ color: '#d03b3b' }}>
              {currency(totalExpense)}
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mt-8 grid gap-3 p-5 sm:grid-cols-2" style={ADMIN_CARD}>
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
            style={ADMIN_INPUT}
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
            style={ADMIN_INPUT}
          />
        </div>
        <div className="sm:col-span-2">
          <label className="caption-brand text-steel">Descrição</label>
          <input
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="body-brand mt-1 w-full border px-3 py-2"
            style={ADMIN_INPUT}
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
            className="admin-row flex flex-wrap items-center justify-between gap-3 p-4"
            style={ADMIN_CARD}
          >
            <div className="flex items-center gap-3">
              <div style={adminIconBadge(t.type === 'income' ? '#0ca30c' : '#d03b3b')}>
                {t.type === 'income' ? (
                  <ArrowUpRight size={17} strokeWidth={2.25} />
                ) : (
                  <ArrowDownRight size={17} strokeWidth={2.25} />
                )}
              </div>
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
            </div>
            <button onClick={() => handleDelete(t.id)} className="admin-action-link caption-brand items-center gap-1" style={{ fontWeight: 600, color: '#c0392b' }}>
              <Trash2 size={13} />
              Excluir
            </button>
          </div>
        ))}
        {transactions.length === 0 && (
          <EmptyState
            icon={Wallet}
            iconColor="#22a2dc"
            title="Nenhum lançamento ainda"
            description="Registre a primeira entrada ou saída pra começar o histórico."
          />
        )}
      </div>
    </div>
  )
}
