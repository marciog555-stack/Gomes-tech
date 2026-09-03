import { createFileRoute } from '@tanstack/react-router'
import { listClients } from '../lib/admin/clients.functions'
import { listTransactions } from '../lib/admin/transactions.functions'
import { daysUntil, dueLabel, nextDueDate } from '../lib/admin/due'
import { chargeWaLink } from '../lib/admin/whatsapp'

export const Route = createFileRoute('/_authenticated/admin')({
  loader: async () => {
    const [clients, transactions] = await Promise.all([listClients(), listTransactions()])
    return { clients, transactions }
  },
  component: Dashboard,
})

function currency(n: number) {
  return n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

function Dashboard() {
  const { clients, transactions } = Route.useLoaderData()

  const now = new Date()
  const monthTx = transactions.filter((t) => {
    const d = new Date(t.occurred_on)
    return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth()
  })
  const income = monthTx.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0)
  const expense = monthTx.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0)
  const net = income - expense

  const activeClients = clients
    .filter((c) => c.active)
    .map((c) => {
      const due = nextDueDate(c.due_day)
      return { ...c, days: daysUntil(due) }
    })
    .sort((a, b) => a.days - b.days)

  return (
    <div>
      <h1 className="h2-brand text-ink">Painel</h1>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded border p-4" style={{ borderColor: 'rgba(11,30,46,0.12)', borderRadius: 4 }}>
          <p className="caption-brand text-steel">Entradas no mês</p>
          <p className="h3-brand mt-1 text-ink">{currency(income)}</p>
        </div>
        <div className="rounded border p-4" style={{ borderColor: 'rgba(11,30,46,0.12)', borderRadius: 4 }}>
          <p className="caption-brand text-steel">Saídas no mês</p>
          <p className="h3-brand mt-1 text-ink">{currency(expense)}</p>
        </div>
        <div className="rounded border p-4" style={{ borderColor: 'rgba(11,30,46,0.12)', borderRadius: 4 }}>
          <p className="caption-brand text-steel">Saldo do mês</p>
          <p className="h3-brand mt-1" style={{ color: net >= 0 ? '#1a7f4b' : '#c0392b' }}>
            {currency(net)}
          </p>
        </div>
      </div>

      <h2 className="h3-brand mt-10 text-ink">Assinaturas por vencimento</h2>

      {activeClients.length === 0 ? (
        <p className="body-brand mt-3 text-steel">Nenhum cliente ativo cadastrado ainda.</p>
      ) : (
        <div className="mt-4 space-y-3">
          {activeClients.map((c) => (
            <div
              key={c.id}
              className="flex flex-wrap items-center justify-between gap-3 border-b py-3"
              style={{ borderColor: 'rgba(11,30,46,0.1)' }}
            >
              <div>
                <p className="body-brand text-ink" style={{ fontWeight: 600 }}>
                  {c.name}
                </p>
                <p className="caption-brand text-steel">
                  {currency(c.subscription_amount)} · {dueLabel(c.days)}
                </p>
              </div>
              <a
                href={chargeWaLink(c.phone, c.name, c.subscription_amount, c.due_day)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-brand btn-brand-primary btn-brand-sm"
              >
                Cobrar no WhatsApp
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
