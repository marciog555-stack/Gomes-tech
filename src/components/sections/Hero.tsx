import { waLink } from '../../lib/whatsapp'
import { TextPending } from '../Pending'

export default function Hero() {
  return (
    <section id="topo" className="band band-navy">
      <div className="band-content">
        <h1 className="h1-brand hero-rise measure text-paper">
          Sistemas feitos para o jeito que a sua empresa já trabalha
        </h1>

        <p
          className="body-brand hero-rise measure mt-5"
          style={{ color: 'rgba(245,247,249,0.78)', animationDelay: '45ms' }}
        >
          Software sob medida e produtos prontos para empresas de Anápolis e
          região. Feito por quem visita a operação antes de escrever a
          primeira linha de código.
        </p>

        <div
          className="hero-rise mt-8 flex flex-wrap items-center gap-x-6 gap-y-3"
          style={{ animationDelay: '90ms' }}
        >
          <a
            href={waLink('topo do site')}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-brand btn-brand-primary"
          >
            Falar no WhatsApp
          </a>
          <a
            href="https://epivision.com.br/"
            target="_blank"
            rel="noopener noreferrer"
            className="link-brand text-cyan-300"
          >
            Ver o EPI Vision
          </a>
        </div>

        <div
          className="hero-rise filete mt-10 w-16"
          style={{ animationDelay: '135ms' }}
        />

        <p
          className="hero-rise caption-brand mt-4"
          style={{ color: 'rgba(245,247,249,0.6)', animationDelay: '135ms' }}
        >
          Produtos em operação com clientes pagantes desde{' '}
          <TextPending tone="dark">ano</TextPending>.
        </p>
      </div>
    </section>
  )
}
