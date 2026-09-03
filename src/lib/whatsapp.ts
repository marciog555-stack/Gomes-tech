const WHATSAPP_NUMBER = '5562982698911'

export function waLink(suffix: string) {
  const text = `Olá! Vim pelo site (${suffix})`
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`
}
