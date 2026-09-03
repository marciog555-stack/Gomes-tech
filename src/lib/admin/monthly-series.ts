import type { Transaction } from './transactions.functions'

export type MonthPoint = {
  key: string
  label: string
  income: number
  expense: number
}

const MONTH_LABELS = [
  'jan',
  'fev',
  'mar',
  'abr',
  'mai',
  'jun',
  'jul',
  'ago',
  'set',
  'out',
  'nov',
  'dez',
]

export function monthlySeries(
  transactions: Array<Transaction>,
  monthsBack = 6,
  today = new Date(),
): Array<MonthPoint> {
  const points: Array<MonthPoint> = []
  for (let i = monthsBack - 1; i >= 0; i--) {
    const d = new Date(today.getFullYear(), today.getMonth() - i, 1)
    points.push({
      key: `${d.getFullYear()}-${d.getMonth()}`,
      label: `${MONTH_LABELS[d.getMonth()]}/${String(d.getFullYear()).slice(2)}`,
      income: 0,
      expense: 0,
    })
  }

  const byKey = new Map(points.map((p) => [p.key, p]))
  for (const t of transactions) {
    const d = new Date(t.occurred_on + 'T00:00:00')
    const key = `${d.getFullYear()}-${d.getMonth()}`
    const point = byKey.get(key)
    if (!point) continue
    if (t.type === 'income') point.income += t.amount
    else point.expense += t.amount
  }

  return points
}
