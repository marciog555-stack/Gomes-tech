import { waLink } from '../../lib/whatsapp'
import { ImagePending } from '../Pending'

function ProductText({
  eyebrow,
  name,
  slogan,
  description,
  bullets,
  href,
  hrefLabel,
  whatsappSuffix,
}: {
  eyebrow: string
  name: string
  slogan: string
  description: string
  bullets: Array<string>
  href: string
  hrefLabel: string
  whatsappSuffix: string
}) {
  return (
    <>
      <p className="caption-brand text-steel">{eyebrow}</p>
      <h3 className="h3-brand mt-2 text-ink">{name}</h3>
      <p className="body-brand mt-2 text-navy-700" style={{ fontWeight: 600 }}>
        {slogan}
      </p>
      <p className="body-brand measure mt-4 text-ink">{description}</p>

      <ul className="body-brand mt-5 space-y-2">
        {bullets.map((b) => (
          <li key={b} className="flex gap-2.5">
            <span
              className="mt-[11px] h-[2px] w-3 shrink-0"
              style={{ background: 'var(--navy-700)' }}
            />
            <span>{b}</span>
          </li>
        ))}
      </ul>

      <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
        <a
          href={waLink(whatsappSuffix)}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-brand btn-brand-primary btn-brand-sm"
        >
          Falar no WhatsApp
        </a>
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="link-brand body-brand inline-block text-cyan-500"
          style={{ fontWeight: 700 }}
        >
          {hrefLabel}
        </a>
      </div>
    </>
  )
}

function ProductRow(props: {
  reversed?: boolean
  eyebrow: string
  name: string
  slogan: string
  description: string
  bullets: Array<string>
  href: string
  hrefLabel: string
  whatsappSuffix: string
  screenshotLabel: string
  /** once a real screenshot is ready, pass its path here to bring back the full-bleed image layout */
  screenshotSrc?: string
}) {
  if (!props.screenshotSrc) {
    return (
      <div className="band-content">
        <ProductText {...props} />
      </div>
    )
  }

  return (
    <div className="bleed-shell">
      <div className={`bleed-grid ${props.reversed ? 'is-reversed' : ''}`}>
        <div className="bleed-text">
          <ProductText {...props} />
        </div>

        <div className="bleed-image">
          <ImagePending
            label={props.screenshotLabel}
            width={390}
            height={844}
            src={props.screenshotSrc}
          />
        </div>
      </div>
    </div>
  )
}

export default function Products() {
  return (
    <section id="produtos" className="band band-paper">
      <div className="band-content">
        <h2 className="h2-brand text-ink">Produtos que já estão no ar</h2>
      </div>

      <div className="mt-10 space-y-16 md:mt-14 md:space-y-24">
        <ProductRow
          eyebrow="SaaS · Segurança do trabalho"
          name="EPI Vision"
          slogan="Gestão de EPI sem papel"
          description="Entrega registrada com assinatura no celular do funcionário. Ficha de cada colaborador pronta para apresentar na fiscalização, com data, item e assinatura. Relatórios de NR-6 em PDF e Excel."
          bullets={[
            'Assinatura digital na entrega, direto no celular',
            'Ficha por colaborador, pronta para auditoria',
            'Relatórios de NR-6 em PDF e Excel',
            'Plano grátis para começar',
          ]}
          href="https://epivision.com.br/"
          hrefLabel="epivision.com.br"
          whatsappSuffix="EPI Vision"
          screenshotLabel="Screenshot real — tela de assinatura no EPI Vision"
        />

        <ProductRow
          reversed
          eyebrow="SaaS · Food service"
          name="MeuCardápio"
          slogan="Cardápio digital com pedido no WhatsApp"
          description="O cliente escolhe pelo celular e o pedido cai direto no seu WhatsApp. Sem comissão por pedido e sem app para o cliente baixar."
          bullets={[
            'Cardápio digital, sempre atualizado',
            'Pedido cai direto no WhatsApp do restaurante',
            'Sem comissão por pedido',
            'Cliente não precisa baixar nenhum app',
          ]}
          href="https://www.xn--meucardpiogo-ibb.com.br/"
          hrefLabel="meucardapiogo.com.br"
          whatsappSuffix="MeuCardápio"
          screenshotLabel="Screenshot real — pedido no MeuCardápio"
        />

        <ProductRow
          eyebrow="Site institucional · Indústria"
          name="Casarinotech"
          slogan="Agilidade, segurança e qualidade que o seu negócio merece"
          description="Site para uma empresa de manutenção e montagem industrial em Goiás: apresenta os serviços (manutenção preventiva, preditiva e corretiva, montagem de equipamentos, consultoria técnica, caldeiraria) e traz prova real de operação — mais de 150 projetos entregues em 3+ anos de atuação."
          bullets={[
            'Manutenção industrial, montagem e consultoria técnica',
            'Caldeiraria e recuperação de tanques',
            'Atendimento 24/7',
            '+150 projetos entregues em Goiás',
          ]}
          href="https://www.casarinotech.com.br/"
          hrefLabel="casarinotech.com.br"
          whatsappSuffix="Casarinotech"
          screenshotLabel="Screenshot real — site da Casarinotech"
        />
      </div>
    </section>
  )
}
