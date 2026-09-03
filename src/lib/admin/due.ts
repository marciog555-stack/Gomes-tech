export function nextDueDate(dueDay: number, today = new Date()): Date {
  const year = today.getFullYear()
  const month = today.getMonth()
  const todayDay = today.getDate()

  if (todayDay <= dueDay) {
    return new Date(year, month, dueDay)
  }
  return new Date(year, month + 1, dueDay)
}

export function daysUntil(date: Date, today = new Date()): number {
  const a = new Date(today.getFullYear(), today.getMonth(), today.getDate())
  const b = new Date(date.getFullYear(), date.getMonth(), date.getDate())
  return Math.round((b.getTime() - a.getTime()) / 86_400_000)
}

export function dueLabel(days: number): string {
  if (days === 0) return 'vence hoje'
  if (days === 1) return 'vence amanhã'
  return `vence em ${days} dias`
}
