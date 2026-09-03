export function chargeWaLink(phone: string, clientName: string, amount: number, dueDay: number) {
  const value = amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })
  const text = `Olá, ${clientName}! Passando pra lembrar da mensalidade (R$ ${value}), com vencimento todo dia ${dueDay}. Qualquer coisa me chama por aqui.`
  return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`
}
