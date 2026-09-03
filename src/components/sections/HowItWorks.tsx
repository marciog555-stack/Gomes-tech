const steps = [
  {
    title: 'Eu vou até você.',
    description:
      'Passo um tempo vendo como o trabalho acontece hoje, antes de propor qualquer coisa.',
  },
  {
    title: 'Entrego funcionando em semanas.',
    description:
      'Começa pequeno, com o que resolve a dor principal, e cresce depois.',
  },
  {
    title: 'Suporte direto comigo.',
    description: 'Você fala com quem escreveu o sistema. Sem ticket, sem call center.',
  },
]

export default function HowItWorks() {
  return (
    <section id="como-funciona" className="band band-paper">
      <div className="band-content">
        <h2 className="h2-brand text-ink">Como funciona</h2>

        <div className="mt-10 space-y-8 md:mt-14 md:space-y-10">
          {steps.map((step) => (
            <div key={step.title}>
              <h3 className="h3-brand text-ink">{step.title}</h3>
              <p className="body-brand measure mt-1.5 text-ink">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
