import { waLink } from '../../lib/whatsapp'

function CustomExample({
  title,
  description,
}: {
  title: string
  description: string
}) {
  return (
    <div className="border-l-2 pl-5" style={{ borderColor: 'rgba(245,247,249,0.3)' }}>
      <h3 className="h3-brand text-paper">{title}</h3>
      <p className="body-brand measure mt-2" style={{ color: 'rgba(245,247,249,0.8)' }}>
        {description}
      </p>
    </div>
  )
}

export default function Custom() {
  return (
    <section id="sob-medida" className="band band-navy">
      <div className="band-content">
        <h2 className="h2-brand text-paper">
          Quando não existe sistema pronto que sirva
        </h2>

        <div className="mt-10 grid gap-10 md:mt-14 md:grid-cols-2 md:gap-16">
          <CustomExample
            title="Comanda digital para pizzaria"
            description="Pedido pelo celular do cliente, com o visual da comanda que a casa já usava no balcão."
          />
          <CustomExample
            title="Controle de obra"
            description="Registro de gasto e foto no canteiro, relatório imprimível no fim do mês."
          />
        </div>

        <a
          href={waLink('sob medida')}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-brand btn-brand-primary mt-10 md:mt-14"
        >
          Falar no WhatsApp
        </a>
      </div>
    </section>
  )
}
