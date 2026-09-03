const steps = [
  {
    n: '1',
    title: 'Eu vou até você.',
    description:
      'Passo um tempo vendo como o trabalho acontece hoje, antes de propor qualquer coisa.',
  },
  {
    n: '2',
    title: 'Entrego funcionando em semanas.',
    description:
      'Começa pequeno, com o que resolve a dor principal, e cresce depois.',
  },
  {
    n: '3',
    title: 'Suporte direto comigo.',
    description: 'Você fala com quem escreveu o sistema. Sem ticket, sem call center.',
  },
]

export default function HowItWorks() {
  return (
    <section id="como-funciona" className="band band-paper">
      <div className="band-content">
        <h2 className="h2-brand text-ink">Como funciona</h2>

        <ol className="mt-10 space-y-8 md:mt-14 md:space-y-10">
          {steps.map((step) => (
            <li key={step.n} className="flex gap-5 md:gap-8">
              <span
                className="h1-brand shrink-0 text-navy-700"
                style={{ fontSize: '32px', lineHeight: 1 }}
                aria-hidden="true"
              >
                {step.n}
              </span>
              <div className="pt-0.5">
                <h3 className="h3-brand text-ink">{step.title}</h3>
                <p className="body-brand measure mt-1.5 text-ink">
                  {step.description}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
