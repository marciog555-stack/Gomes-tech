import { Link, createFileRoute } from '@tanstack/react-router'
import MonthlyChart from '../components/admin/MonthlyChart'
import Sparkline from '../components/admin/Sparkline'
import { listClients } from '../lib/admin/clients.functions'
import { listTransactions } from '../lib/admin/transactions.functions'
import { listLeads } from '../lib/admin/leads.functions'
import { listProjects } from '../lib/admin/projects.functions'
import { daysUntil, dueLabel, nextDueDate } from '../lib/admin/due'
import { monthlySeries } from '../lib/admin/monthly-series'
import { chargeWaLink } from '../lib/admin/whatsapp'
import { ADMIN_CARD, ADMIN_CARD_DARK } from '../lib/admin/ui'

export const Route = createFileRoute('/_authenticated/admin')({
  loader: async () => {
    const [clients, transactions, leads, projects] = await Promise.all([
      listClients(),
      listTransactions(),
      listLeads(),
      listProjects(),
    ])
    return { clients, transactions, leads, projects }
  },
  component: Dashboard,
})

function currency(n: number) {
  return n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

function StatCard({
  label,
  value,
  valueColor,
  spark,
  sparkColor,
  href,
}: {
  label: string
  value: React.ReactNode
  valueColor?: string
  spark?: Array<number>
  sparkColor?: string
  href?: string
}) {
  const inner = (
    <div className="flex items-end justify-between gap-3 p-5" style={ADMIN_CARD}>
      <div>
        <p className="caption-brand text-steel">{label}</p>
        <p className="h3-brand mt-1" style={{ color: valueColor ?? 'var(--ink)' }}>
          {value}
        </p>
      </div>
      {spark && spark.length >= 2 && <Sparkline values={spark} color={sparkColor ?? '#6d8296'} area />}
    </div>
  )
  return href ? (
    <Link to={href} className="block transition-transform" style={{ transitionDuration: '140ms' }}>
      {inner}
    </Link>
  ) : (
    inner
  )
}

function Dashboard() {
  const { clients, transactions, leads, projects } = Route.useLoaderData()

  const today = new Date()
  const series = monthlySeries(transactions)

  const monthTx = transactions.filter((t) => {
    const d = new Date(t.occurred_on)
    return d.getFullYear() === today.getFullYear() && d.getMonth() === today.getMonth()
  })
  const income = monthTx.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0)
  const expense = monthTx.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0)
  const net = income - expense

  const activeClients = clients
    .filter((c) => c.active)
    .map((c) => ({ ...c, days: daysUntil(nextDueDate(c.due_day)) }))
    .sort((a, b) => a.days - b.days)

  const queuedProjects = projects
    .filter((p) => p.status !== 'entregue' && p.deadline)
    .map((p) => ({ ...p, days: daysUntil(new Date(p.deadline + 'T00:00:00')) }))
    .sort((a, b) => a.days - b.days)

  const nextClient = activeClients[0]
  const nextProject = queuedProjects[0]
  const nextUp =
    nextClient && (!nextProject || nextClient.days <= nextProject.days)
      ? { label: 'Cobrança', name: nextClient.name, days: nextClient.days }
      : nextProject
        ? { label: 'Entrega', name: nextProject.name, days: nextProject.days }
        : null

  const rawDateLabel = today.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })
  const dateLabel = rawDateLabel.charAt(0).toUpperCase() + rawDateLabel.slice(1)

  return (
    <div>
      <h1 className="h2-brand text-ink">Olá, Márcio</h1>
      <p className="body-brand mt-1 text-steel">{dateLabel}</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          label="Entradas no mês"
          value={currency(income)}
          spark={series.map((s) => s.income)}
          sparkColor="#0ca30c"
        />
        <StatCard
          label="Saídas no mês"
          value={currency(expense)}
          spark={series.map((s) => s.expense)}
          sparkColor="#d03b3b"
        />
        <StatCard
          label="Saldo do mês"
          value={currency(net)}
          valueColor={net >= 0 ? '#0ca30c' : '#d03b3b'}
          spark={series.map((s) => s.income - s.expense)}
          sparkColor={net >= 0 ? '#0ca30c' : '#d03b3b'}
        />
        <StatCard label="Futuros clientes" value={leads.length} href="/admin/leads" />
        <StatCard label="Projetos na fila" value={projects.filter((p) => p.status !== 'entregue').length} href="/admin/projetos" />
        <div className="p-5" style={ADMIN_CARD_DARK}>
          <p className="caption-brand" style={{ color: 'rgba(245,247,249,0.65)' }}>
            Próximo na fila
          </p>
          {nextUp ? (
            <>
              <p className="h3-brand mt-1 text-paper">
                {nextUp.days <= 0 ? 'Hoje' : `${nextUp.days} dia${nextUp.days === 1 ? '' : 's'}`}
              </p>
              <p className="caption-brand mt-0.5" style={{ color: 'rgba(245,247,249,0.8)' }}>
                {nextUp.label}: {nextUp.name}
              </p>
            </>
          ) : (
            <p className="body-brand mt-1" style={{ color: 'rgba(245,247,249,0.75)' }}>
              Nada urgente agora.
            </p>
          )}
        </div>
      </div>

      <h2 className="h3-brand mt-10 text-ink">Entradas e saídas por mês</h2>
      <div className="mt-4 p-5" style={ADMIN_CARD}>
        <MonthlyChart points={series} />
      </div>

      <h2 className="h3-brand mt-10 text-ink">Assinaturas por vencimento</h2>

      {activeClients.length === 0 ? (
        <p className="body-brand mt-3 text-steel">Nenhum cliente ativo cadastrado ainda.</p>
      ) : (
        <div className="mt-4 space-y-3">
          {activeClients.map((c) => (
            <div
              key={c.id}
              className="flex flex-wrap items-center justify-between gap-3 p-4"
              style={{
                ...ADMIN_CARD,
                borderLeft: `4px solid ${c.days <= 2 ? '#d03b3b' : 'var(--cyan-500)'}`,
              }}
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
