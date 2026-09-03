import { waLink } from '../../lib/whatsapp'

export default function Hero() {
  return (
    <section id="topo" className="band band-navy">
      <div className="band-content">
        <h1 className="h1-brand hero-rise measure text-paper">
          Transformamos problemas reais em soluções digitais que funcionam.
        </h1>

        <p
          className="body-brand hero-rise measure mt-5"
          style={{ color: 'rgba(245,247,249,0.78)', animationDelay: '45ms' }}
        >
          Software sob medida e produtos prontos pra quem precisa de
          tecnologia que resolve — não que complica.
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
          <a href="#produtos" className="link-brand text-cyan-300">
            Ver os produtos
          </a>
        </div>

        <div
          className="hero-rise filete mt-10 w-16"
          style={{ animationDelay: '135ms' }}
        />
      </div>
    </section>
  )
}
